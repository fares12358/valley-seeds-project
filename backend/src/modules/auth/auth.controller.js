import crypto from "crypto";
import jwt    from "jsonwebtoken";
import Admin  from "./auth.model.js";
import { clearAdminCache } from "../../middlewares/auth.middleware.js";
import { sendPasswordResetEmail, sendPasswordResetConfirmation } from "../../config/email.js";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));

// Cookie options — RULE R5: always use this helper, never hardcode sameSite
const cookieOptions = () => ({
  httpOnly: true,
  secure:   process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  maxAge:   7 * 24 * 60 * 60 * 1000,
  path:     "/",
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }
    if (!isValidEmail(email)) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin || !(await admin.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.cookie("vs_token", token, cookieOptions());
    res.json({ success: true, data: { email: admin.email, createdAt: admin.createdAt } });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
export const logout = (req, res) => {
  // Bust the auth middleware cache immediately so the token is rejected
  // even before the 60s TTL expires
  try {
    const token = req.cookies?.vs_token;
    if (token) {
      const decoded = jwt.decode(token);
      if (decoded?.id) clearAdminCache(decoded.id);
    }
  } catch { /* ignore decode errors on logout */ }

  res.clearCookie("vs_token", {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    path:     "/",
  });
  res.json({ success: true, data: null });
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
export const me = (req, res) => {
  res.json({ success: true, data: req.admin });
};

// ─── POST /api/auth/forgot-password ──────────────────────────────────────────
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }
    if (!isValidEmail(email)) {
      return res.json({ success: true, data: null }); // enumeration protection
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.json({ success: true, data: null }); // enumeration protection
    }

    // Per-user throttle: max 1 reset email per 60 seconds per admin
    // Prevents distributed spam to the admin's inbox from different IPs
    if (
      admin.lastResetRequestAt &&
      Date.now() - admin.lastResetRequestAt.getTime() < 60_000
    ) {
      // Return success — don't reveal the throttle to prevent enumeration
      return res.json({ success: true, data: null });
    }

    const rawToken    = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    admin.resetToken          = hashedToken;
    admin.resetTokenExpiry    = new Date(Date.now() + 60 * 60 * 1000);
    admin.lastResetRequestAt  = new Date();
    await admin.save({ validateBeforeSave: false });

    if (!process.env.CLIENT_URL) {
      console.error("[auth] CLIENT_URL not set — password reset link will be broken");
    }
    const resetUrl = `${process.env.CLIENT_URL || "http://localhost:3000"}/dashboard/reset-password?token=${rawToken}`;
    await sendPasswordResetEmail(admin.email, resetUrl);

    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/auth/reset-password ───────────────────────────────────────────
export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ success: false, message: "Token and new password are required" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const admin = await Admin.findOne({
      resetToken:       hashedToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ success: false, message: "Reset link is invalid or has expired" });
    }

    admin.password         = newPassword;
    admin.resetToken       = undefined;
    admin.resetTokenExpiry = undefined;
    await admin.save();

    // Also clear the middleware cache so any active sessions are invalidated
    clearAdminCache(admin._id);

    sendPasswordResetConfirmation(admin.email).catch((err) =>
      console.warn("[auth] Confirmation email failed:", err.message)
    );

    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/auth/credentials  (protected) ───────────────────────────────────
// Change the admin's email and/or password from the dashboard. Requires the
// current password so a hijacked/left-open session can't silently lock the real admin out.
export const updateCredentials = async (req, res, next) => {
  try {
    const { currentPassword, newEmail, newPassword } = req.body;

    if (!currentPassword) {
      return res.status(400).json({ success: false, message: "Current password is required" });
    }
    if (!newEmail && !newPassword) {
      return res.status(400).json({ success: false, message: "Provide a new email or a new password" });
    }
    if (newEmail && !isValidEmail(newEmail)) {
      return res.status(400).json({ success: false, message: "Invalid email address" });
    }
    if (newPassword && newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    const admin = await Admin.findById(req.admin._id);
    if (!admin || !(await admin.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }

    if (newEmail) admin.email = newEmail.toLowerCase().trim();
    if (newPassword) admin.password = newPassword; // re-hashed by the pre-save hook
    await admin.save();

    // Bust the cache immediately — old sessions elsewhere shouldn't keep the stale email/password
    clearAdminCache(admin._id);

    // Reissue the cookie so its embedded email claim matches the new one
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );
    res.cookie("vs_token", token, cookieOptions());

    if (newPassword) {
      sendPasswordResetConfirmation(admin.email).catch((err) =>
        console.warn("[auth] Confirmation email failed:", err.message)
      );
    }

    res.json({ success: true, data: { email: admin.email } });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: "That email is already in use" });
    }
    next(err);
  }
};
