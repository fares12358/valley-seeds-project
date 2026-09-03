import { Router } from "express";
import authMiddleware from "../../middlewares/auth.middleware.js";
import { getTelegramConfig } from "./telegram-config.service.js";
import { sendTelegramMessage, setTelegramWebhook, getWebhookInfo } from "./telegram.service.js";

const router = Router();

// ─── POST /api/telegram/webhook  (public, secret-token header check) ──────────
// Receives Telegram bot updates. /start and /id reply with the sender's numeric
// chat ID so the admin can find it without leaving Telegram. Always returns 200 —
// Telegram retries aggressively on any non-200 response.
router.post("/webhook", async (req, res) => {
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (expectedSecret && req.headers["x-telegram-bot-api-secret-token"] !== expectedSecret) {
    return res.status(401).json({ success: false, message: "Invalid webhook secret" });
  }

  try {
    const update = req.body;
    const chatId = update?.message?.chat?.id;
    const text   = update?.message?.text?.trim();

    if (chatId && (text === "/start" || text === "/id")) {
      const { botToken } = await getTelegramConfig();
      if (botToken) {
        await sendTelegramMessage(
          botToken,
          chatId,
          `👋 Your chat ID is:\n<code>${chatId}</code>\n\nPaste this into the dashboard's Telegram settings.`
        );
      }
    } else if (chatId) {
      const { botToken } = await getTelegramConfig();
      if (botToken) {
        await sendTelegramMessage(botToken, chatId, "Available commands: /start, /id");
      }
    }
  } catch (err) {
    console.warn("[telegram] Webhook handling failed:", err.message);
  }

  res.sendStatus(200);
});

// ─── POST /api/telegram/register-webhook  (protected) ──────────────────────────
router.post("/register-webhook", authMiddleware, async (req, res, next) => {
  try {
    const { botToken } = await getTelegramConfig();
    if (!botToken) {
      return res.status(400).json({ success: false, message: "No bot token configured yet" });
    }

    const base = (req.body?.webhookUrl || process.env.WEBHOOK_BASE_URL || "").replace(/\/$/, "");
    if (!base) {
      return res.status(400).json({ success: false, message: "No webhook URL provided or configured" });
    }

    const result = await setTelegramWebhook(botToken, `${base}/api/telegram/webhook`);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }
    res.json({ success: true, data: result.data });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/telegram/webhook-info  (protected) ───────────────────────────────
router.get("/webhook-info", authMiddleware, async (req, res, next) => {
  try {
    const { botToken } = await getTelegramConfig();
    if (!botToken) {
      return res.json({ success: true, data: null });
    }
    const result = await getWebhookInfo(botToken);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }
    res.json({ success: true, data: result.data });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/telegram/test  (protected) ───────────────────────────────────────
router.get("/test", authMiddleware, async (req, res, next) => {
  try {
    const { botToken, chatId } = await getTelegramConfig();
    if (!botToken || !chatId) {
      return res.status(400).json({ success: false, message: "Telegram is not fully configured" });
    }
    const result = await sendTelegramMessage(botToken, chatId, "✅ Test message from Valley Seeds dashboard.");
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
});

export default router;
