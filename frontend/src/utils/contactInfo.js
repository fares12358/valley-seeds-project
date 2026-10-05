// Single source of truth for public contact info: Settings (dashboard → Settings).
// Turns the raw Settings fields into { value, href } per channel so the Contact
// section and the Footer always show the same data and links.
// A channel with no value is omitted — callers skip it instead of rendering a dead link.

const digits = (s) => String(s || "").replace(/[^\d]/g, "");

export function buildContactInfo(brand = {}) {
  const email    = (brand.email || "").trim();
  const phone    = (brand.phone || "").trim();
  const whatsapp = (brand.whatsapp || "").trim();
  const website  = (brand.website || "").trim();
  const location = (brand.location || "").trim();
  // Explicit wa.me link from Social Links wins; otherwise derive one from the number
  const waLink   = (brand.socialLinks?.whatsapp || "").trim() || (digits(whatsapp) ? `https://wa.me/${digits(whatsapp)}` : "");

  const info = {};
  if (email)    info.email    = { value: email,    href: `mailto:${email}` };
  if (phone)    info.phone    = { value: phone,    href: `tel:${phone.replace(/[^\d+]/g, "")}` };
  if (whatsapp) info.whatsapp = { value: whatsapp, href: waLink || null };
  if (website)  info.website  = { value: website,  href: /^https?:\/\//i.test(website) ? website : `https://${website}` };
  if (location) info.location = { value: location, href: null };
  return info;
}
