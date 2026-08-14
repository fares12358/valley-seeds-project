import { Router } from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { uploadImage, deleteImage } from "./upload.controller.js";
import authMiddleware from "../../middlewares/auth.middleware.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Root of all uploaded files — served statically by server.js at /uploads
export const UPLOADS_ROOT = path.join(__dirname, "../../uploads");

const MIME_EXT = {
  "image/jpeg": ".jpg",
  "image/png":  ".png",
  "image/webp": ".webp",
};

// Only allow simple, filesystem-safe names — prevents path traversal via ?folder=../../
const safeFolder = (raw) => {
  const folder = String(raw || "general");
  return /^[a-zA-Z0-9_-]+$/.test(folder) ? folder : "general";
};

// A "slot" is a stable content-image placeholder (e.g. "background", "card-0").
// Passing ?slot=X gives the file a deterministic name so re-uploading to the
// same slot always overwrites the same file instead of piling up new ones.
const safeSlot = (raw) => {
  const slot = String(raw || "");
  return /^[a-zA-Z0-9_-]+$/.test(slot) ? slot : null;
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(UPLOADS_ROOT, "valley-seeds", safeFolder(req.query.folder));
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext  = MIME_EXT[file.mimetype] || "";
    const slot = safeSlot(req.query.slot);

    if (!slot) {
      cb(null, `${crypto.randomUUID()}${ext}`);
      return;
    }

    // Replacing a slot — remove any existing file for it first (any extension),
    // so switching from e.g. a .jpg to a .png doesn't leave the old file orphaned.
    const dir = path.join(UPLOADS_ROOT, "valley-seeds", safeFolder(req.query.folder));
    try {
      fs.readdirSync(dir)
        .filter((f) => f.startsWith(`${slot}.`))
        .forEach((f) => fs.unlinkSync(path.join(dir, f)));
    } catch {
      // Directory not readable yet — nothing to clean up
    }

    cb(null, `${slot}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (MIME_EXT[file.mimetype]) cb(null, true);
  else cb(new Error("Only JPEG, PNG, and WebP images are allowed"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

const router = Router();

router.post(  "/image", authMiddleware, upload.single("image"), uploadImage);
router.delete("/image", authMiddleware, deleteImage);

export default router;
