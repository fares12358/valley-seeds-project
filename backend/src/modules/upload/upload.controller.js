import fs from "fs";
import path from "path";
import { UPLOADS_ROOT } from "./upload.routes.js";

// Strip any trailing slash AND any trailing /api segment so the URL is always
// the bare origin — e.g. https://api.valley-seeds.oneto-one.com/api becomes
// https://api.valley-seeds.oneto-one.com — regardless of what the admin
// pastes into BACKEND_URL in the .env file.
const BACKEND_URL = (process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`)
  .replace(/\/+$/, "")   // remove trailing slashes
  .replace(/\/api$/, ""); // remove accidental /api suffix

const toPublicId = (absolutePath) =>
  path.relative(UPLOADS_ROOT, absolutePath).split(path.sep).join("/");

const toUrl = (publicId, version) => `${BACKEND_URL}/uploads/${publicId}?v=${version}`;

// Resolve a publicId to an absolute path, rejecting anything that escapes UPLOADS_ROOT
const resolveSafePath = (publicId) => {
  const resolved = path.resolve(UPLOADS_ROOT, publicId);
  const root     = path.resolve(UPLOADS_ROOT);
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
      if (err.code !== "ENOENT") throw err;
    }

    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
};
