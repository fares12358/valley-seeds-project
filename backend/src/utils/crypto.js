import crypto from "crypto";

// Encrypts small secrets (e.g. the SMTP password) for storage in MongoDB.
// Key is derived from JWT_SECRET so no extra required env var — nothing new to configure.
const ALGO = "aes-256-gcm";

let cachedKey = null;
const getKey = () => {
  if (!cachedKey) {
    cachedKey = crypto.scryptSync(process.env.JWT_SECRET, "valley-seeds-email-config", 32);
  }
  return cachedKey;
};

export const encrypt = (text) => {
  if (!text) return "";
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(String(text), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString("hex"), tag.toString("hex"), encrypted.toString("hex")].join(":");
};

export const decrypt = (payload) => {
  if (!payload) return "";
  const [ivHex, tagHex, dataHex] = String(payload).split(":");
  if (!ivHex || !tagHex || !dataHex) return "";
  try {
    const decipher = crypto.createDecipheriv(ALGO, getKey(), Buffer.from(ivHex, "hex"));
    decipher.setAuthTag(Buffer.from(tagHex, "hex"));
    return Buffer.concat([decipher.update(Buffer.from(dataHex, "hex")), decipher.final()]).toString("utf8");
  } catch {
    return ""; // corrupted value or JWT_SECRET rotated — treat as unset rather than crash
  }
};
