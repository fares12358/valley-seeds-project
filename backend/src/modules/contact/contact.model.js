import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema(
  {
    name:    { type: String, required: [true, "Name is required"],    trim: true },
    email:   { type: String, required: [true, "Email is required"],   trim: true, lowercase: true },
    phone:   { type: String, trim: true },
    subject: { type: String, trim: true },
    message: { type: String, required: [true, "Message is required"], trim: true },
    read:    { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Covers getAll(): filter on read + sort on createdAt in one index
ContactSchema.index({ read: 1, createdAt: -1 });
// Covers unfiltered sort (when read filter is not applied)
ContactSchema.index({ createdAt: -1 });

const Contact = mongoose.model("Contact", ContactSchema);
export default Contact;
