import Settings from "./settings.model.js";
import { encrypt } from "../../utils/crypto.js";

const DEFAULTS = {
  brandName:         "Valley Seeds",
  primaryColor:      "#037338",
  accentColor:       "#96C422",
  email:             "info@valley-seeds.com",
  phone:             "+20 128 763 6986",
  whatsapp:          "+20 128 763 6986",
  website:           "www.valley-seeds.com",
  location:          "Cairo, Egypt",
  socialLinks:       { facebook: "", linkedin: "", instagram: "", whatsapp: "https://wa.me/201287636986" },
  logoUrl:           "",
  logoWhiteUrl:      "",
  logoPublicId:      "",
  logoWhitePublicId: "",
  metaPixelId:       "",
};

const ALLOWED_FIELDS = [
  "brandName", "primaryColor", "accentColor",
  "email", "phone", "whatsapp", "website", "location",
  "socialLinks",
  "logoUrl", "logoWhiteUrl",
  "logoPublicId", "logoWhitePublicId",
  "metaPixelId",
];

// ─── GET /api/settings ─────────────────────────────────────────────────────────
// Public route (consumed by the website + MetaPixel component).
// emailConfig must never appear here — it holds SMTP credentials.
// Use GET /api/settings/email (protected) for that.
export const get = async (req, res, next) => {
  try {
    const settings = await Settings.findOne({}).lean();
    const data = { ...(settings || DEFAULTS) };
    delete data.emailConfig;
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/settings  (protected) ────────────────────────────────────────────
export const update = async (req, res, next) => {
  try {
    const payload = {};
    ALLOWED_FIELDS.forEach((key) => {
      if (req.body[key] !== undefined) payload[key] = req.body[key];
    });

    if (payload.socialLinks) {
      const { facebook, linkedin, instagram, whatsapp } = payload.socialLinks;
      payload.socialLinks = { facebook, linkedin, instagram, whatsapp };
    }

    const updated = await Settings.findOneAndUpdate(
      {},
      { $set: payload },
      { new: true, upsert: true, runValidators: false }
    );
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

const EMAIL_PROVIDERS = ["smtp", "app_password"];

// ─── GET /api/settings/email  (protected) ──────────────────────────────────────
// Returns the SMTP config with `passSet` instead of the actual password —
// the ciphertext/plaintext password is never sent back to the browser.
export const getEmailConfig = async (req, res, next) => {
  try {
    const settings = await Settings.findOne({}).lean();
    const cfg = settings?.emailConfig || {};
    res.json({
      success: true,
      data: {
        provider: cfg.provider || "smtp",
        host:     cfg.host || "",
        port:     cfg.port || 587,
        secure:   cfg.secure || false,
        user:     cfg.user || "",
        from:     cfg.from || "",
        to:       cfg.to || "",
        passSet:  Boolean(cfg.pass),
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── PUT /api/settings/email  (protected) ──────────────────────────────────────
// `pass` is optional on update — omit/blank it to keep the currently stored password.
export const updateEmailConfig = async (req, res, next) => {
  try {
    const { provider, host, port, secure, user, pass, from, to } = req.body;

    if (provider !== undefined && !EMAIL_PROVIDERS.includes(provider)) {
      return res.status(400).json({ success: false, message: "Invalid email provider type" });
    }

    const payload = {};
    if (provider !== undefined) payload["emailConfig.provider"] = provider;
    if (host     !== undefined) payload["emailConfig.host"]     = host;
    if (port     !== undefined) payload["emailConfig.port"]     = Number(port) || 587;
    if (secure   !== undefined) payload["emailConfig.secure"]   = Boolean(secure);
    if (user     !== undefined) payload["emailConfig.user"]     = user;
    if (from     !== undefined) payload["emailConfig.from"]     = from;
    if (to       !== undefined) payload["emailConfig.to"]       = to;
    if (pass)                   payload["emailConfig.pass"]     = encrypt(pass);

    const updated = await Settings.findOneAndUpdate(
      {},
      { $set: payload },
      { new: true, upsert: true, runValidators: false }
    ).lean();

    const cfg = updated.emailConfig || {};
    res.json({
      success: true,
      data: {
        provider: cfg.provider || "smtp",
        host:     cfg.host || "",
        port:     cfg.port || 587,
        secure:   cfg.secure || false,
        user:     cfg.user || "",
        from:     cfg.from || "",
        to:       cfg.to || "",
        passSet:  Boolean(cfg.pass),
      },
    });
  } catch (err) {
    next(err);
  }
};
