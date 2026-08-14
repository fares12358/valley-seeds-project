import "dotenv/config";

// ─── Startup env validation — fail fast before anything else loads ─────────────
const REQUIRED_ENV = ["MONGO_URI", "JWT_SECRET", "ADMIN_EMAIL", "ADMIN_PASSWORD"];
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(`[server] Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

import express       from "express";
import cors          from "cors";
import cookieParser  from "cookie-parser";
import helmet        from "helmet";
import connectDB              from "./config/db.js";
import authRoutes             from "./modules/auth/auth.routes.js";
import contentRoutes          from "./modules/content/content.routes.js";
import settingsRoutes         from "./modules/settings/settings.routes.js";
import uploadRoutes, { UPLOADS_ROOT } from "./modules/upload/upload.routes.js";
import contactRoutes          from "./modules/contact/contact.routes.js";
import errorMiddleware        from "./middlewares/error.middleware.js";
import { authLimiter }        from "./middlewares/rateLimiter.js";

const app = express();

// ─── Trust proxy — required for correct req.ip behind Railway/Render/Nginx ────
// Without this, rate limiter sees the proxy IP, not the real client IP
app.set("trust proxy", 1);

// ─── Security ─────────────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.CLIENT_URL    || "http://localhost:3000",
  process.env.DASHBOARD_URL || "http://localhost:3000",
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
}));

// ─── Body parsers ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "6mb" }));
app.use(express.urlencoded({ extended: true, limit: "6mb" }));
app.use(cookieParser());

// ─── CSRF Origin check — lightweight protection for cookie-authenticated mutations
// sameSite:none (production) removes browser CSRF protection — verify Origin header
// as a defence-in-depth measure on all state-mutating authenticated routes
const CSRF_SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const CSRF_PUBLIC_PATHS = [
  "/api/contact",
  "/api/auth/login",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/health",
];

app.use((req, res, next) => {
  if (CSRF_SAFE_METHODS.has(req.method)) return next();
  if (CSRF_PUBLIC_PATHS.some((p) => req.path.startsWith(p.replace("/api", "")))) return next();

  const origin = req.headers.origin || req.headers.referer;
  if (origin) {
    try {
      const originHost  = new URL(origin).hostname;
      const allowedHosts = allowedOrigins.map((o) => new URL(o).hostname);
      if (!allowedHosts.includes(originHost)) {
        return res.status(403).json({ success: false, message: "Forbidden — invalid origin" });
      }
    } catch {
      // Malformed origin header — block the request
      return res.status(403).json({ success: false, message: "Forbidden — invalid origin" });
    }
  }
  // No origin header (Postman, curl, server-to-server) — allow through in dev
  next();
});

// ─── Auth rate limiting — applied to sensitive auth endpoints only ─────────────
app.use("/api/auth/login",           authLimiter);
app.use("/api/auth/forgot-password", authLimiter);

// ─── Uploaded images — served locally from disk (replaces Cloudinary) ─────────
// Cross-Origin-Resource-Policy override: images must be embeddable by the
// frontend even when it's on a different domain (Vercel + Railway/Render).
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(UPLOADS_ROOT, { maxAge: "7d" })
);

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth",     authRoutes);
app.use("/api/content",  contentRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/upload",   uploadRoutes);
app.use("/api/contact",  contactRoutes);

// ─── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.originalUrl} not found` });
});

// ─── Global error handler (must be last) ──────────────────────────────────────
app.use(errorMiddleware);

// ─── Start — await DB before accepting connections (prevents startup race) ─────
const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[server] Running on port ${PORT} — ${process.env.NODE_ENV || "development"}`);
  });
})();

export default app;
