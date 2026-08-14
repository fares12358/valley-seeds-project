import jwt from "jsonwebtoken";
import Admin from "../modules/auth/auth.model.js";

// ─── In-memory admin cache — eliminates one DB query per protected request ────
// Single admin CMS: one entry max. TTL 60s. Cleared on logout.
const adminCache = new Map();
const CACHE_TTL  = 60 * 1000; // 60 seconds

// Exported so logout can bust the cache immediately on sign-out
export const clearAdminCache = (adminId) => {
  adminCache.delete(String(adminId));
};

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.vs_token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized — no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const adminId  = String(decoded.id);

    // Check in-memory cache first (TTL 60s)
    const cached = adminCache.get(adminId);
    if (cached && Date.now() - cached.ts < CACHE_TTL) {
      req.admin = cached.admin;
      return next();
    }

    // Cache miss — hit the DB once per 60 seconds per admin
    const admin = await Admin
      .findById(adminId)
      .select("-password -resetToken -resetTokenExpiry")
      .lean(); // lean() — read-only plain object, skip Mongoose hydration

    if (!admin) {
      return res.status(401).json({ success: false, message: "Unauthorized — admin not found" });
    }

    // Populate cache
    adminCache.set(adminId, { admin, ts: Date.now() });

    req.admin = admin;
    next();
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[auth] JWT verification failed:", err.message);
    }
    return res.status(401).json({ success: false, message: "Unauthorized — invalid token" });
  }
};

export default authMiddleware;
