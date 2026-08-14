import fs from "fs";
import path from "path";
import { UPLOADS_ROOT } from "./upload.routes.js";

const BACKEND_URL = (process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`).replace(/\/+$/, "");

const toPublicId = (absolutePath) =>
  path.relative(UPLOADS_ROOT, absolutePath).split(path.sep).join("/");

// `v` is a cache-buster: slot uploads (see upload.routes.js) keep a deterministic
// filename so replacing e.g. "background.jpg" reuses the exact same URL. Without
// this, express.static's 7-day Cache-Control (server.js) makes browsers keep
// showing the old bytes after a replace — the file changes on disk but nothing
// tells the browser (or the public site) to refetch it.
const toUrl = (publicId, version) => `${BACKEND_URL}/uploads/${publicId}?v=${version}`;

// Resolve a publicId to an absolute path, rejecting anything that escapes UPLOADS_ROOT
const resolveSafePath = (publicId) => {
  const resolved = path.resolve(UPLOADS_ROOT, publicId);
  const root = path.resolve(UPLOADS_ROOT);
  if (resolved !== root && !resolved.startsWith(root + path.sep)) return null;
  return resolved;
};

// ─── POST /api/upload/image  (protected) ──────────────────────────────────────
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    const publicId = toPublicId(req.file.path);
    const version  = Date.now();

    res.json({
      success: true,
      data: {
        url:      toUrl(publicId, version),
        publicId,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /api/upload/image  (protected) ────────────────────────────────────
export const deleteImage = async (req, res, next) => {
  try {
    const { publicId } = req.body;

    if (!publicId || !String(publicId).trim()) {
      return res.status(400).json({ success: false, message: "publicId is required" });
    }

    const filePath = resolveSafePath(publicId);
    if (!filePath) {
      return res.status(400).json({ success: false, message: "Invalid publicId" });
    }

    try {
      await fs.promises.unlink(filePath);
    } catch (err) {
      if (err.code !== "ENOENT") throw err; // ignore "already deleted"
    }

    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
};
