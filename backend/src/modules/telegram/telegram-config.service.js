import Settings from "../settings/settings.model.js";
import { decrypt } from "../../utils/crypto.js";

// Resolves { botToken, chatId } — DB (encrypted) first, env vars as fallback.
// Called by every other Telegram module. Never throws — a missing/broken config
// is a soft "not configured" state (both fields null), not an exception.
export const getTelegramConfig = async () => {
  let cfg = null;
  try {
    const settings = await Settings.findOne({}).select("telegramConfig").lean();
    cfg = settings?.telegramConfig;
  } catch (err) {
    console.warn("[telegram] Failed to read Settings.telegramConfig:", err.message);
  }

  let botToken = process.env.TELEGRAM_BOT_TOKEN || null;
  if (cfg?.botTokenEncrypted) {
    const decrypted = decrypt(cfg.botTokenEncrypted);
    botToken = decrypted || process.env.TELEGRAM_BOT_TOKEN || null;
  }

  const chatId = cfg?.chatId || process.env.TELEGRAM_CHAT_ID || null;

  return { botToken, chatId };
};
