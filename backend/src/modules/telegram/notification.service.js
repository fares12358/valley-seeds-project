import { getTelegramConfig } from "./telegram-config.service.js";
import { sendTelegramMessage } from "./telegram.service.js";

// parse_mode: "HTML" means unescaped user input would be a Telegram-side markup
// injection vector — escape before interpolating.
const escapeHtml = (str) =>
  String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Builds + sends the contact-form notification. Never treats a missing config or a
// failed send as an error — Telegram is an optional channel, the contact submission
// itself already succeeded regardless of what happens here.
export const notifyContactSubmission = async ({ name, email, phone, subject, message }) => {
  const { botToken, chatId } = await getTelegramConfig();

  if (!botToken || !chatId) {
    return { sent: false, configured: false, message: "Telegram is not configured" };
  }

  const timestamp = new Date().toLocaleString("en-EG", { timeZone: "Africa/Cairo" });

  const text = [
    "📩 <b>New Contact Form Submission</b>",
    "",
    `<b>Name:</b> ${escapeHtml(name)}`,
    `<b>Email:</b> ${escapeHtml(email)}`,
    phone ? `<b>Phone:</b> ${escapeHtml(phone)}` : null,
    `<b>Subject:</b> ${escapeHtml(subject || "General Inquiry")}`,
    "",
    `<b>Message:</b>\n<code>${escapeHtml(message)}</code>`,
    "",
    `🕒 ${escapeHtml(timestamp)}`,
  ].filter(Boolean).join("\n");

  const result = await sendTelegramMessage(botToken, chatId, text);
  return { sent: result.success, configured: true, message: result.message };
};
