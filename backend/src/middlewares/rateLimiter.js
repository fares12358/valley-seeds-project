import rateLimit from "express-rate-limit";

// ─── Auth limiter — brute-force / enumeration protection ─────────────────────
// Applied to: POST /api/auth/login  and  POST /api/auth/forgot-password
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,   // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Please try again in 15 minutes." },
});

// ─── Contact submit limiter — spam + email-quota protection ───────────────────
// Applied to: POST /api/contact  (public website form only)
// NOT applied to: GET/PATCH/DELETE /api/contact/messages  (dashboard, protected by auth)
export const contactSubmitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,   // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many submissions. Please try again later." },
});
