"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiCheckCircle } from "react-icons/fi";
import * as FaIcons from "react-icons/fa";
import { useTranslation } from "@/context/LangContext";

// Fallback shown when a metric item has no icon set, or an invalid icon name was entered
const DEFAULT_ICON_NAME = "FaChartBar";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const ERP = () => {
  const { t } = useTranslation();
  const e = t.erp;

  return (
    <section className="relative py-24 lg:py-32 bg-gradient-to-br from-[#012a14] via-[var(--brand-primary)] to-[#05964a] overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--brand-accent)]/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-accent)]/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2.5 text-xs tracking-[0.2em] uppercase text-[var(--brand-accent)] mb-6">
              <span className="block w-8 h-px bg-[var(--brand-accent)]" />
              {e.eyebrow}
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-normal leading-tight mb-6 text-white">
              {e.heading}<br />
              <span className="text-[var(--brand-accent)]">{e.heading_accent}</span>
            </h2>

            <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-10 max-w-lg">
              {e.body}
            </p>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-5"
            >
              {e.points.map((pt, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                  className="flex gap-4 items-start group cursor-default"
                >
                  <div className="mt-1 flex-shrink-0">
                    <div className="w-6 h-6 rounded-lg bg-[var(--brand-accent)]/15 flex items-center justify-center group-hover:bg-[var(--brand-accent)]/25 transition-colors duration-300">
                      <FiCheckCircle className="w-3.5 h-3.5 text-[var(--brand-accent)]" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white mb-1 group-hover:text-[var(--brand-accent)] transition-colors duration-300">
                      {pt.title}
                    </div>
                    <div className="text-sm text-white/60 leading-relaxed">{pt.text}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Dashboard Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/15 shadow-[0_8px_40px_rgba(0,0,0,0.2)] overflow-hidden">
              <div className="px-6 py-5 border-b border-white/10 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[var(--brand-accent)] animate-pulse" />
                <span className="text-xs tracking-[0.15em] uppercase text-[var(--brand-accent)] font-medium">
                  {e.dashboard.label}
                </span>
              </div>

              <div className="p-2">
                {e.dashboard.items.map((item, index) => {
                  // item.icon is a react-icons/fa export name (e.g. "FaUsers") chosen in the dashboard
                  const Icon = FaIcons[item.icon] || FaIcons[DEFAULT_ICON_NAME];
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + index * 0.08, duration: 0.4 }}
                      whileHover={{ backgroundColor: "rgba(150, 196, 34, 0.08)" }}
                      className="flex items-center justify-between px-4 py-4 rounded-xl transition-all duration-200 group"
                    >
                      <span className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[var(--brand-accent)]/10 flex items-center justify-center group-hover:bg-[var(--brand-accent)]/20 transition-colors duration-200">
                          <Icon className="w-5 h-5 text-[var(--brand-accent)]" />
                        </div>
                        <span className="text-sm text-white/70 group-hover:text-white transition-colors duration-200">
                          {item.label}
                        </span>
                      </span>
                      <span className="text-base font-bold text-white font-serif tracking-tight">
                        {item.val}
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              <div className="px-6 py-4 border-t border-white/10 bg-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-white/40 tracking-wider uppercase">{e.dashboard.last_updated}</span>
                  <span className="text-[10px] text-[var(--brand-accent)] tracking-wider">{e.dashboard.just_now}</span>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-6 flex items-center justify-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-[var(--brand-accent)] animate-pulse" />
              <span className="text-xs text-white/50 tracking-wide">{e.dashboard.sync_label}</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ERP;
