import Contact from "./contact.model.js";
import { sendContactEmail } from "../../config/email.js";

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));

// ─── POST /api/contact  (public) ─────────────────────────────────────────────
export const submit = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required",
      });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email address" });
    }
    if (message.trim().length < 5) {
      return res.status(400).json({ success: false, message: "Message is too short" });
    }

    const contact = await Contact.create({
      name:    name.trim(),
      email:   email.trim().toLowerCase(),
      phone:   phone?.trim()   || undefined,
      subject: subject?.trim() || undefined,
      message: message.trim(),
    });

    try {
      sendContactEmail(contact).catch((err) =>
        console.warn("[contact] Email send failed:", err.message)
      );
    } catch (emailErr) {
      console.warn("[contact] Email init failed:", emailErr.message);
    }

    res.status(201).json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/contact/messages  (protected) ───────────────────────────────────
export const getAll = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.read !== undefined) {
      filter.read = req.query.read === "true";
    }

    // Pagination support — default 50 per page, max 100
    const limit = Math.min(parseInt(req.query.limit) || 50, 100);
    const skip  = parseInt(req.query.skip) || 0;

    // Parallel queries — index-friendly + .lean() skips Mongoose hydration
    const [messages, [totals]] = await Promise.all([
      Contact.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Contact.aggregate([{
        $group: {
          _id:         null,
          total:       { $sum: 1 },
          unreadCount: { $sum: { $cond: [{ $eq: ["$read", false] }, 1, 0] } },
        },
      }]),
    ]);

    const total       = totals?.total       || 0;
    const unreadCount = totals?.unreadCount || 0;
    const hasMore     = skip + messages.length < total;

    res.json({ success: true, data: { messages, total, unreadCount, hasMore } });
  } catch (err) {
    next(err);
  }
};

// ─── PATCH /api/contact/messages/:id  (protected) ────────────────────────────
export const markRead = async (req, res, next) => {
  try {
    const readValue = req.body.read ?? true;
    const updated = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: readValue },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// ─── DELETE /api/contact/messages/:id  (protected) ───────────────────────────
export const remove = async (req, res, next) => {
  try {
    const deleted = await Contact.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }
    res.json({ success: true, data: null });
  } catch (err) {
    next(err);
  }
};
