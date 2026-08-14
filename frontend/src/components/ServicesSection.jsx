"use client";

import React, { memo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import * as FaIcons from "react-icons/fa";
import { useTranslation } from "@/context/LangContext";

// Fallback shown when a card has no icon set, or an invalid icon name was entered
const DEFAULT_ICON_NAME = "FaStar";

const COLOR_POOL = [
  "from-[var(--brand-primary)] to-[#05964a]",
  "from-[var(--brand-primary)] to-[var(--brand-accent)]",
  "from-[#05964a] to-[var(--brand-accent)]",
  "from-[var(--brand-accent)] to-[#b8e032]",
  "from-[#025c2e] to-[var(--brand-primary)]",
  "from-[var(--brand-primary)] to-[#048a44]",
  "from-[var(--brand-accent)] to-[var(--brand-primary)]",
  "from-[#05964a] to-[#b8e032]",
];

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
};
const itemVariants = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

// Memoised — prevents re-renders when ServicesSection parent updates
export const ValueCard = memo(function ValueCard({ value, index, images }) {
  // value.icon is a react-icons/fa export name (e.g. "FaLeaf") chosen in the dashboard
  const Icon  = FaIcons[value.icon] || FaIcons[DEFAULT_ICON_NAME];
  const color = COLOR_POOL[index % COLOR_POOL.length];
  // Only ever sourced from the backend's uploads folder — no local/Unsplash fallback
  const imgSrc = images?.[index]?.url || null;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden
        hover:border-[var(--brand-accent)]/30 hover:bg-white/8 hover:shadow-[0_8px_40px_rgba(3,115,56,0.2)] transition-all duration-500"
    >
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      {/* Image — next/image for lazy loading + WebP conversion on uploaded image URLs */}
      <div className="h-44 overflow-hidden relative">
        <motion.div
          className="absolute inset-0"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.5 }}
        >
          {imgSrc ? (
            <Image
              src={imgSrc}
              alt={value.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover brightness-[0.6] saturate-90 group-hover:brightness-[0.75] group-hover:saturate-100 transition-all duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/5">
              <FaIcons.FaImage className="text-white/15 text-4xl" />
            </div>
          )}
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-2/3 bg-gradient-to-b from-transparent via-[#012a14]/60 to-[#012a14]/90" />
        <motion.div
          whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
          transition={{ duration: 0.5 }}
          className={`absolute bottom-4 left-4 w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}
        >
          <Icon className="w-5 h-5 text-white" />
        </motion.div>
      </div>

      <div className="p-5 pt-6">
        <h3 className="text-[15px] font-bold text-white mb-2 group-hover:text-[var(--brand-accent)] transition-colors duration-300">
          {value.name}
        </h3>
        <p className="text-sm text-white/60 leading-relaxed">{value.desc}</p>
      </div>

      <div className="px-5 pb-5">
        <div className="h-px bg-gradient-to-r from-[var(--brand-accent)]/0 via-[var(--brand-accent)]/30 to-[var(--brand-accent)]/0 scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      </div>
    </motion.div>
  );
});

const ServicesSection = () => {
  const { t } = useTranslation();
  const s = t.services;
  const values = s.values || [];
  const images = t.services?._images || [];

  const VISIBLE  = 4;
  const hasMore  = values.length > VISIBLE;
  const displayed = values.slice(0, VISIBLE);

  return (
    <section id="services" className="relative py-24 lg:py-32 bg-gradient-to-br from-[#012a14] via-[var(--brand-primary)] to-[#05964a] overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[var(--brand-accent)]/5 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-accent)]/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 lg:mb-16"
        >
          <div className="inline-flex items-center gap-2.5 text-xs tracking-[0.2em] uppercase text-[var(--brand-accent)] mb-5">
            <span className="block w-8 h-px bg-[var(--brand-accent)]" />
            {s.eyebrow}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-white">
            {s.heading}<br />
            <span className="text-[var(--brand-accent)]">{s.heading_accent}</span>
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          {displayed.map((value, index) => (
            <ValueCard key={index} value={value} index={index} images={images} />
          ))}
        </motion.div>

        {hasMore && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-12 flex justify-center"
          >
            <Link
              href="/values"
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl
                bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-sm
                hover:bg-[var(--brand-accent)] hover:border-[var(--brand-accent)] hover:text-[#012a14]
                transition-all duration-300 hover:shadow-[0_8px_30px_rgba(150,196,34,0.3)]"
            >
              <span>
                {t.services?.show_more || "Show All Values"}
                {" "}
                <span className="text-[var(--brand-accent)] group-hover:text-[#012a14]">
                  ({values.length})
                </span>
              </span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 flex items-center justify-center gap-3"
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--brand-accent)]/30" />
          <div className="w-2 h-2 rounded-full bg-[var(--brand-accent)]/40" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--brand-accent)]/30" />
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
