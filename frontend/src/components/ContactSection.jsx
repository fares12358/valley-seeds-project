"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  FaEnvelope, FaPhone,
  FaPaperPlane, FaLink, FaCheckCircle,
  FaWhatsapp, FaArrowRight,
} from "react-icons/fa";
import { useTranslation } from "@/context/LangContext";
import { submitContact } from "@/services/contact.service";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INFO_ICONS  = { email: FaEnvelope, phone: FaPhone, whatsapp: FaWhatsapp, website: FaLink };
const INFO_COLORS = {
  email:    "from-[var(--brand-primary)] to-[#05964a]",
  phone:    "from-[var(--brand-primary)] to-[var(--brand-accent)]",
  whatsapp: "from-[#25D366] to-[#128C7E]",
  website:  "from-[var(--brand-accent)] to-[#b8e032]",
};
const INFO_HOVER = {
  email:    "hover:bg-[var(--brand-primary)]/5",
  phone:    "hover:bg-[var(--brand-primary)]/5",
  whatsapp: "hover:bg-[#25D366]/5",
  website:  "hover:bg-[var(--brand-accent)]/5",
};

const EMPTY_FORM = { name: "", email: "", phone: "", subject: "", message: "" };

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};
const itemVariants = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function ContactSection() {
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { t, isRTL } = useTranslation();
  const c = t.contact;
  const f = c.form;

  const [formData,     setFormData]     = useState(EMPTY_FORM);
  const [submitted,    setSubmitted]    = useState(false);
  const [isSending,    setIsSending]    = useState(false);
  const [error,        setError]        = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError(f.error);
      return;
    }
    if (!EMAIL_RE.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setIsSending(true);
    try {
      await submitContact(formData);

      // ── Meta Pixel: Lead event ──────────────────────────────────────────
      // MetaPixel.jsx exposes this global after the pixel initialises.
      // The optional object can carry extra parameters for Meta's reporting.
      if (typeof window.__metaPixelLead === "function") {
        window.__metaPixelLead({
          content_name:     formData.subject || "Contact Form",
          content_category: "Lead",
        });
      }
      // ───────────────────────────────────────────────────────────────────

      setSubmitted(true);
      setFormData(EMPTY_FORM);
    } catch (err) {
      const backendMsg = err?.response?.data?.message;
      const isNetwork  = err?.code === "ERR_NETWORK";
      setError(
        backendMsg ? backendMsg :
        isNetwork  ? "Cannot connect. Please check your connection." :
                     f.error
      );
    } finally {
      setIsSending(false);
    }
  };

  const inputClasses = (field) =>
    `w-full px-5 py-4 bg-gray-50 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
      focusedField === field
        ? "border-[var(--brand-primary)] bg-white shadow-[0_0_0_4px_rgba(3,115,56,0.08)]"
        : "border-gray-200 hover:border-gray-300"
    }`;

  return (
    <section id="contact" className="relative py-24 lg:py-32 bg-gradient-to-b from-gray-50 via-white to-gray-50 overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--brand-accent)]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--brand-primary)]/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16 lg:mb-20"
        >
          <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[var(--brand-primary)]/70 font-medium mb-6">
            <span className="w-8 h-px bg-[var(--brand-accent)]" />
            {c.eyebrow}
            <span className="w-8 h-px bg-[var(--brand-accent)]" />
          </span>
          <h2 className="text-[var(--brand-primary)] mb-6 font-serif text-3xl sm:text-4xl lg:text-5xl leading-tight">
            {c.heading_line1}
            <br className="hidden sm:block" />
            {" "}{c.heading_line2}
          </h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {c.subheading}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-[0_4px_40px_rgba(3,115,56,0.06)] border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--brand-primary)] via-[var(--brand-accent)] to-[var(--brand-primary)]" />

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-16"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="w-20 h-20 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                  >
                    <FaCheckCircle className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-[var(--brand-primary)] mb-3 text-2xl font-serif">{c.success.heading}</h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-8">{c.success.body}</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="inline-flex items-center gap-2 text-sm text-[var(--brand-primary)] font-medium hover:gap-3 transition-all"
                  >
                    {c.success.again}
                    <FaArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-accent)] flex items-center justify-center">
                      <FaPaperPlane className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--brand-primary)]">{f.title}</h3>
                      <p className="text-xs text-gray-400">{f.subtitle}</p>
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="c-name" className="block text-sm font-medium text-gray-600 mb-2">
                        {f.name_label} <span className="text-red-400">*</span>
                      </label>
                      <input type="text" id="c-name" name="name" value={formData.name} onChange={handleChange}
                        onFocus={() => setFocusedField("name")} onBlur={() => setFocusedField(null)}
                        className={inputClasses("name")} placeholder={f.name_placeholder} />
                    </div>
                    <div>
                      <label htmlFor="c-email" className="block text-sm font-medium text-gray-600 mb-2">
                        {f.email_label} <span className="text-red-400">*</span>
                      </label>
                      <input type="email" id="c-email" name="email" value={formData.email} onChange={handleChange}
                        onFocus={() => setFocusedField("email")} onBlur={() => setFocusedField(null)}
                        className={inputClasses("email")} placeholder={f.email_placeholder} />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="c-phone" className="block text-sm font-medium text-gray-600 mb-2">{f.phone_label}</label>
                      <input type="tel" id="c-phone" name="phone" value={formData.phone} onChange={handleChange}
                        onFocus={() => setFocusedField("phone")} onBlur={() => setFocusedField(null)}
                        className={inputClasses("phone")} placeholder={f.phone_placeholder} />
                    </div>
                    <div>
                      <label htmlFor="c-subject" className="block text-sm font-medium text-gray-600 mb-2">{f.subject_label}</label>
                      <select id="c-subject" name="subject" value={formData.subject} onChange={handleChange}
                        onFocus={() => setFocusedField("subject")} onBlur={() => setFocusedField(null)}
                        className={`${inputClasses("subject")} appearance-none cursor-pointer`}
                      >
                        <option value="">{f.subject_placeholder}</option>
                        {(f.subject_options || []).map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="c-message" className="block text-sm font-medium text-gray-600 mb-2">
                      {f.message_label} <span className="text-red-400">*</span>
                    </label>
                    <textarea id="c-message" name="message" value={formData.message} onChange={handleChange}
                      onFocus={() => setFocusedField("message")} onBlur={() => setFocusedField(null)}
                      rows={5} className={`${inputClasses("message")} resize-none`}
                      placeholder={f.message_placeholder} />
                  </div>

                  <motion.button
                    type="submit" disabled={isSending}
                    whileHover={{ scale: isSending ? 1 : 1.01 }}
                    whileTap={{ scale: isSending ? 1 : 0.98 }}
                    className="w-full bg-gradient-to-r from-[var(--brand-primary)] to-[#05964a] text-white px-8 py-4 rounded-xl hover:shadow-[0_8px_30px_rgba(3,115,56,0.25)] transition-all duration-300 flex items-center justify-center gap-3 group text-sm font-semibold tracking-wide disabled:opacity-60"
                  >
                    {isSending
                      ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <FaPaperPlane className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
                    }
                    <span>{isSending ? "Sending..." : f.submit}</span>
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <motion.div variants={containerVariants} initial="hidden" animate={isInView ? "visible" : "hidden"} className="space-y-4">
              {(c.info || []).map((info) => {
                const Icon = INFO_ICONS[info.key] || FaEnvelope;
                return (
                  <motion.a
                    key={info.key}
                    href={info.link}
                    target={info.link?.startsWith("http") ? "_blank" : undefined}
                    rel={info.link?.startsWith("http") ? "noopener noreferrer" : undefined}
                    variants={itemVariants}
                    whileHover={{ x: isRTL ? -4 : 4 }}
                    className={`flex items-center gap-5 p-5 bg-white rounded-2xl shadow-[0_2px_16px_rgba(3,115,56,0.04)] border border-gray-100 hover:border-[var(--brand-accent)]/30 hover:shadow-[0_8px_30px_rgba(3,115,56,0.08)] transition-all duration-300 group ${INFO_HOVER[info.key] || ""}`}
                  >
                    <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${INFO_COLORS[info.key] || "from-[var(--brand-primary)] to-[var(--brand-accent)]"} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs tracking-wider uppercase text-gray-400 font-medium mb-0.5">{info.label}</div>
                      <div className="text-gray-700 font-medium text-sm truncate group-hover:text-[var(--brand-primary)] transition-colors">{info.value}</div>
                    </div>
                    <FaArrowRight className={`w-4 h-4 text-gray-300 group-hover:text-[var(--brand-primary)] transition-all duration-300 flex-shrink-0 ${isRTL ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
                  </motion.a>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
