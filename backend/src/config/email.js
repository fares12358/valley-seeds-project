import nodemailer from "nodemailer";
import he from "he";
import Settings from "../modules/settings/settings.model.js";
import { decrypt } from "../utils/crypto.js";

const GMAIL_DEFAULTS = { host: "smtp.gmail.com", port: 587, secure: false };

// Builds a transporter from the dashboard-configured Settings.emailConfig, falling
// back to the legacy EMAIL_* env vars when no config has been saved from the dashboard yet.
// Built fresh per send (low volume: contact form + password reset) so dashboard
// changes take effect immediately, with no cache to invalidate.
const getMailer = async () => {
  let cfg = null;
  try {
    const settings = await Settings.findOne({}).lean();
    cfg = settings?.emailConfig;
  } catch {
    // DB unreachable — fall through to env vars below
  }

  if (cfg?.user && cfg?.pass) {
    const isAppPassword = cfg.provider === "app_password";
    return {
      transporter: nodemailer.createTransport({
        host:   cfg.host || (isAppPassword ? GMAIL_DEFAULTS.host : ""),
        port:   cfg.port || (isAppPassword ? GMAIL_DEFAULTS.port : 587),
        secure: typeof cfg.secure === "boolean" ? cfg.secure : GMAIL_DEFAULTS.secure,
        auth:   { user: cfg.user, pass: decrypt(cfg.pass) },
      }),
      from: cfg.from || cfg.user,
      to:   cfg.to || cfg.user,
    };
  }

  return {
    transporter: nodemailer.createTransport({
      host:   process.env.EMAIL_HOST,
      port:   Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === "true",
      auth:   { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    }),
    from: process.env.EMAIL_FROM,
    to:   process.env.EMAIL_TO,
  };
};

// ─── Sanitisation helpers ─────────────────────────────────────────────────────
// esc()        — HTML-encode for safe interpolation into email HTML body
// safeHeader() — strip newlines from values used in SMTP headers (header injection prevention)
const esc        = (str) => he.encode(String(str || ""), { useNamedReferences: true });
const safeHeader = (str) => String(str || "").replace(/[\r\n\t]/g, " ").trim();

// ─── Email 1: Contact form submission → client inbox ─────────────────────────
export const sendContactEmail = async (submission) => {
  const subject  = safeHeader(submission.subject || "General Inquiry");
  const safeName = safeHeader(submission.name);
  const { transporter, from, to } = await getMailer();

  await transporter.sendMail({
    from,
    to,
    replyTo: submission.email,   // raw email — this is an SMTP header, not HTML
    subject: `New contact from ${safeName} — ${subject}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
        <div style="background:#037338;padding:16px 24px;border-radius:8px;margin-bottom:24px">
          <h1 style="color:#fff;margin:0;font-size:20px">New Contact Message</h1>
          <p style="color:#96C422;margin:4px 0 0;font-size:14px">Valley Seeds Website</p>
        </div>
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
          <tr><td style="padding:8px 0;color:#6b7280;font-size:13px;width:100px">Name</td><td style="padding:8px 0;font-weight:600;color:#111827">${esc(submission.name)}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:13px">Email</td><td style="padding:8px 0;color:#111827"><a href="mailto:${esc(submission.email)}" style="color:#037338">${esc(submission.email)}</a></td></tr>
          ${submission.phone ? `<tr><td style="padding:8px 0;color:#6b7280;font-size:13px">Phone</td><td style="padding:8px 0;color:#111827">${esc(submission.phone)}</td></tr>` : ""}
          <tr><td style="padding:8px 0;color:#6b7280;font-size:13px">Subject</td><td style="padding:8px 0;color:#111827">${esc(subject)}</td></tr>
          <tr><td style="padding:8px 0;color:#6b7280;font-size:13px">Received</td><td style="padding:8px 0;color:#111827">${new Date().toLocaleString("en-EG",{timeZone:"Africa/Cairo"})}</td></tr>
        </table>
        <div style="background:#f9fafb;border-left:4px solid #037338;padding:16px;border-radius:4px;margin-bottom:24px">
          <p style="margin:0;color:#374151;line-height:1.6;white-space:pre-wrap">${esc(submission.message)}</p>
        </div>
        <a href="mailto:${esc(submission.email)}?subject=Re: ${esc(subject)}" style="display:inline-block;background:#037338;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Reply to ${esc(submission.name)}</a>
      </div>
    `,
  });
};

// ─── Email 2: Password reset link → admin ────────────────────────────────────
export const sendPasswordResetEmail = async (adminEmail, resetUrl) => {
  const { transporter, from } = await getMailer();
  await transporter.sendMail({
    from,
    to:      adminEmail,
    subject: "Reset your Valley Seeds admin password",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
        <div style="background:#037338;padding:16px 24px;border-radius:8px;margin-bottom:24px">
          <h1 style="color:#fff;margin:0;font-size:20px">Password Reset Request</h1>
          <p style="color:#96C422;margin:4px 0 0;font-size:14px">Valley Seeds Admin</p>
        </div>
        <p style="color:#374151">You requested a password reset for your Valley Seeds admin account.</p>
        <p style="color:#374151">Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
        <div style="text-align:center;margin:32px 0">
          <a href="${resetUrl}" style="display:inline-block;background:#037338;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px">Reset Password</a>
        </div>
        <p style="color:#6b7280;font-size:13px">Or copy this link into your browser:</p>
        <p style="color:#037338;font-size:13px;word-break:break-all">${resetUrl}</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
        <p style="color:#9ca3af;font-size:12px">If you did not request this, you can safely ignore this email. Your password will not change.</p>
      </div>
    `,
  });
};

// ─── Email 3: Password changed confirmation → admin ───────────────────────────
export const sendPasswordResetConfirmation = async (adminEmail) => {
  const { transporter, from } = await getMailer();
  await transporter.sendMail({
    from,
    to:      adminEmail,
    subject: "Your Valley Seeds admin password has been changed",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
        <div style="background:#037338;padding:16px 24px;border-radius:8px;margin-bottom:24px">
          <h1 style="color:#fff;margin:0;font-size:20px">Password Changed</h1>
          <p style="color:#96C422;margin:4px 0 0;font-size:14px">Valley Seeds Admin</p>
        </div>
        <p style="color:#374151">Your Valley Seeds admin password was successfully changed at:</p>
        <p style="color:#111827;font-weight:600">${new Date().toLocaleString("en-EG",{timeZone:"Africa/Cairo"})}</p>
        <div style="background:#fef2f2;border:1px solid #fee2e2;padding:16px;border-radius:8px;margin-top:24px">
          <p style="color:#dc2626;margin:0;font-weight:600">If you did not make this change, contact your developer immediately and revoke access.</p>
        </div>
      </div>
    `,
  });
};
