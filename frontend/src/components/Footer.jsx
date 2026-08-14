"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowUp,
  FaFacebookF, FaLinkedinIn, FaInstagram, FaWhatsapp,
} from "react-icons/fa";
import Image from "next/image";
import { useTranslation } from "@/context/LangContext";
import { useBrand } from "@/context/BrandContext";

const CONTACT_ICONS = {
  email:    { icon: FaEnvelope,     href: "mailto:info@valley-seeds.com" },
  phone:    { icon: FaPhone,        href: "tel:+201287636986" },
  location: { icon: FaMapMarkerAlt, href: null },
};

const socialLinks = [
  { icon: FaFacebookF, href: "#",                             label: "Facebook" },
  { icon: FaLinkedinIn, href: "#",                            label: "LinkedIn" },
  { icon: FaInstagram, href: "#",                             label: "Instagram" },
  { icon: FaWhatsapp,  href: "https://wa.me/201287636986",    label: "WhatsApp" },
];

export default function Footer() {
  const { t } = useTranslation();
  const { logoWhiteUrl } = useBrand();
  const fo = t.footer;
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative bg-gradient-to-b from-[#012a14] to-[#011a0c] text-white z-50">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--brand-accent)] to-transparent opacity-60" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--brand-accent)]/5 rounded-full blur-3xl -translate-y-1/2" />

      <motion.button
        onClick={scrollToTop}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.95 }}
        className="absolute bottom-10 right-0.5 -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-[#012a14] to-[#011a0c] rounded-sm flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow cursor-pointer z-10 border border-white"
      >
        <FaArrowUp className="w-4 h-4 text-white" />
      </motion.button>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">

          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="sm:col-span-2 lg:col-span-1"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-40 h-10 flex items-center justify-center">
                <Image src={logoWhiteUrl || "/images/logo-white.svg"} alt="Valley Seeds Logo" fill className="object-contain" />
              </div>
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
              {fo.tagline}
            </p>
            <div className="flex gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target={social.href.startsWith("http") ? "_blank" : undefined}
                    rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[var(--brand-accent)]/20 hover:border-[var(--brand-accent)]/30 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <Icon className="w-3.5 h-3.5 text-white/70" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <h4 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
              <span className="w-4 h-px bg-[var(--brand-accent)]" />
              {fo.quick_links_title}
            </h4>
            <ul className="space-y-3">
              {fo.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-[var(--brand-accent)] transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-[var(--brand-accent)] transition-colors" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h4 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
              <span className="w-4 h-px bg-[var(--brand-accent)]" />
              {fo.services_title}
            </h4>
            <ul className="space-y-3">
              {fo.services.map((service, i) => (
                <li key={i} className="text-sm text-white/60 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[var(--brand-accent)]/40" />
                  {service}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h4 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
              <span className="w-4 h-px bg-[var(--brand-accent)]" />
              {fo.contact_title}
            </h4>
            <ul className="space-y-4">
              {fo.contact_items.map((item) => {
                const config = CONTACT_ICONS[item.key];
                const Icon = config.icon;
                const content = (
                  <>
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--brand-accent)]/15 transition-colors">
                      <Icon className="w-3.5 h-3.5 text-[var(--brand-accent)]" />
                    </div>
                    <div>
                      <div className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">{item.label}</div>
                      <div className="text-sm text-white/70 group-hover:text-[var(--brand-accent)] transition-colors">{item.value}</div>
                    </div>
                  </>
                );
                return (
                  <li key={item.key}>
                    {config.href ? (
                      <a href={config.href} className="flex items-start gap-3 group">{content}</a>
                    ) : (
                      <div className="flex items-start gap-3 group">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center gap-4"
        >
          <a href="https://oneto-one.com" className="text-xs text-white/40 text-center sm:text-left hover:text-[var(--brand-accent)] hover:underline">
            © {currentYear} {fo.copyright}
          </a>
        </motion.div>
      </div>
    </footer>
  );
}
