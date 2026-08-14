import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    brandName:         { type: String, default: "Valley Seeds" },
    primaryColor:      { type: String, default: "#037338" },
    accentColor:       { type: String, default: "#96C422" },
    email:             { type: String, default: "info@valley-seeds.com" },
    phone:             { type: String, default: "+20 128 763 6986" },
    whatsapp:          { type: String, default: "+20 128 763 6986" },
    website:           { type: String, default: "www.valley-seeds.com" },
    location:          { type: String, default: "Cairo, Egypt" },
    socialLinks: {
      facebook:  { type: String, default: "" },
      linkedin:  { type: String, default: "" },
      instagram: { type: String, default: "" },
      whatsapp:  { type: String, default: "https://wa.me/201287636986" },
    },
    logoUrl:           { type: String, default: "" },
    logoWhiteUrl:      { type: String, default: "" },
    // publicId = relative path under uploads/ — needed to delete the file from disk
    logoPublicId:      { type: String, default: "" },
    logoWhitePublicId: { type: String, default: "" },

    // Meta Pixel ID — stored here so the dashboard can update it without a deploy.
    // Returned on the public GET /api/settings so the frontend can initialise the pixel.
    metaPixelId: { type: String, default: "" },

    // Outgoing email config, editable from the dashboard instead of process.env.
    // Never returned to the public GET /settings route — see settings.controller.js.
    emailConfig: {
      provider: { type: String, enum: ["smtp", "app_password"], default: "smtp" },
      host:     { type: String, default: "" },
      port:     { type: Number, default: 587 },
      secure:   { type: Boolean, default: false },
      user:     { type: String, default: "" },
      pass:     { type: String, default: "" }, // AES-256-GCM ciphertext, see utils/crypto.js
      from:     { type: String, default: "" },
      to:       { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", SettingsSchema);
export default Settings;
