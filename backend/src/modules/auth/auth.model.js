import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AdminSchema = new mongoose.Schema(
  {
    email: {
      type:      String,
      required:  [true, "Email is required"],
      unique:    true,
      lowercase: true,
      trim:      true,
    },
    password: {
      type:      String,
      required:  [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
    },
    resetToken:           { type: String },
    resetTokenExpiry:     { type: Date },
    // Rate-limit forgot-password emails: one per admin per 60 seconds
    lastResetRequestAt:   { type: Date },
  },
  { timestamps: true }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Covers findOne({ resetToken, resetTokenExpiry: { $gt } }) in resetPassword
AdminSchema.index({ resetToken: 1, resetTokenExpiry: 1 });

// ─── Hooks ───────────────────────────────────────────────────────────────────
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

AdminSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

const Admin = mongoose.model("Admin", AdminSchema);
export default Admin;
