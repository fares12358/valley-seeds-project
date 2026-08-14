"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { FaArrowRight, FaPhone } from "react-icons/fa";
import { useTranslation } from "@/context/LangContext";

export default function HeroSection() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, isRTL } = useTranslation();
  const bgUrl = t.hero?._images?.[0]?.url || null;

  const scrollToSection = (sectionId) => {
    setIsMobileMenuOpen(false);
    if (!sectionId) { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetPosition = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background — sourced from the uploaded hero image, solid brand gradient if none uploaded yet */}
      <div className="absolute inset-0 z-0">
        {bgUrl ? (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('${bgUrl}')` }}
            />
            <div className="absolute inset-0 bg-linear-to-br from-[var(--brand-primary)]/90 via-[var(--brand-primary)]/70 to-[var(--brand-accent)]/60" />
          </>
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-[var(--brand-primary)] via-[var(--brand-primary)] to-[var(--brand-accent)]" />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h1 className="text-white max-w-4xl mx-auto">
            {t.hero.heading}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-white/90 max-w-3xl mx-auto text-lg sm:text-xl"
          >
            {t.hero.subheading}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={() => scrollToSection("contact")}
              className="group bg-white text-[var(--brand-primary)] px-8 py-4 rounded-lg hover:bg-[var(--brand-accent)] hover:text-white transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              {t.hero.cta_primary}
              <FaArrowRight
                className={`w-5 h-5 transition-transform ${isRTL ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
              />
            </button>

            <button
              onClick={() => scrollToSection("contact")}
              className="group bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-[var(--brand-primary)] transition-all duration-300 flex items-center gap-2"
            >
              <FaPhone className="w-5 h-5" />
              {t.hero.cta_secondary}
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="relative z-10 w-full bg-white/10 backdrop-blur-md border-t border-white/20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/20">
            {t.hero.stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.15, duration: 0.6 }}
                className="flex flex-col items-center justify-center py-8 sm:py-10 px-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-2 h-2 bg-[var(--brand-accent)] rounded-full animate-pulse flex-shrink-0" />
                  <motion.span
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.4 + index * 0.15, type: "spring", stiffness: 200 }}
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight"
                  >
                    {stat.number}
                  </motion.span>
                </div>
                <span className="text-white/80 text-sm sm:text-base text-center font-medium">
                  {stat.text}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute md:bottom-50 bottom-110 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-2 bg-white/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
