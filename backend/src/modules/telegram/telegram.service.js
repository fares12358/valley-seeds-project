// Thin wrapper around the Telegram Bot HTTP API. No axios dependency — Node 18+'s
// built-in fetch is enough for these three calls.
const API_BASE = "https://api.telegram.org";

// POST /sendMessage — never throws, callers treat this as a pure fire-and-forget side effect.
export const sendTelegramMessage = async (botToken, chatId, text) => {
  if (!botToken || !chatId) {
    return { success: false, configured: false, message: "Telegram is not configured" };
  }
  try {
    const res = await fetch(`${API_BASE}/bot${botToken}/sendMessage`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
    });
    const data = await res.json();
    if (!data.ok) {
      return { success: false, configured: true, message: data.description || "Telegram API error" };
    }
    return { success: true, configured: true, data: data.result };
  } catch (err) {
    return { success: false, configured: true, message: err.message };
  }
};

// GET /getMe — validates a bot token. Not currently wired to a route, kept for parity/future use.
export const getMe = async (botToken) => {
  if (!botToken) return { success: false, configured: false, message: "No bot token" };
  try {
    const res = await fetch(`${API_BASE}/bot${botToken}/getMe`);
    const data = await res.json();
    if (!data.ok) return { success: false, configured: true, message: data.description || "Invalid token" };
    return { success: true, configured: true, data: data.result };
  } catch (err) {
    return { success: false, configured: true, message: err.message };
  }
};

// POST /setWebhook — passes secret_token so Telegram echoes it back on every webhook call.
export const setTelegramWebhook = async (botToken, webhookUrl) => {
  if (!botToken || !webhookUrl) {
    return { success: false, configured: false, message: "Bot token and webhook URL are required" };
  }
  try {
    const res = await fetch(`${API_BASE}/bot${botToken}/setWebhook`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url:          webhookUrl,
        secret_token: process.env.TELEGRAM_WEBHOOK_SECRET || undefined,
      }),
    });
    const data = await res.json();
    if (!data.ok) return { success: false, configured: true, message: data.description || "Failed to set webhook" };
    return { success: true, configured: true, data: data.result };
  } catch (err) {
    return { success: false, configured: true, message: err.message };
  }
};

// GET /getWebhookInfo — used by the dashboard to show current registration status.
export const getWebhookInfo = async (botToken) => {
  if (!botToken) return { success: false, configured: false, message: "No bot token" };
  try {
    const res = await fetch(`${API_BASE}/bot${botToken}/getWebhookInfo`);
    const data = await res.json();
    if (!data.ok) return { success: false, configured: true, message: data.description || "Failed to fetch webhook info" };
    return { success: true, configured: true, data: data.result };
  } catch (err) {
    return { success: false, configured: true, message: err.message };
  }
};
