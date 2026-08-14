"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslation } from "@/context/LangContext";

export default function MissionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { t } = useTranslation();
  const m = t.mission;

  return (
    <section id="mission" className="py-24 lg:py-32 bg-linear-to-b from-white via-[#f4faf6] to-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[var(--brand-accent)]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[var(--brand-primary)]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={ref} className="text-center max-w-4xl mx-auto">

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[var(--brand-primary)]/70 font-medium">
              <span className="w-6 h-px bg-[var(--brand-accent)]" />
              {m.eyebrow}
              <span className="w-6 h-px bg-[var(--brand-accent)]" />
            </span>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="mb-16"
          >
            <div className="relative bg-white rounded-3xl p-8 sm:p-12 shadow-[0_4px_40px_rgba(3,115,56,0.08)] border border-[var(--brand-accent)]/20 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-[var(--brand-primary)] via-[var(--brand-accent)] to-[var(--brand-primary)]" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--brand-accent)]/10 rounded-full blur-2xl" />

              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] rounded-full text-xs font-semibold tracking-wide mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand-primary)] animate-pulse" />
                {m.vision.badge}
              </div>

              <h2 className="text-[var(--brand-primary)] mb-6 font-serif text-3xl sm:text-4xl">
                {m.vision.heading}
              </h2>

              <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                {m.vision.body}
              </p>
            </div>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="mb-20"
          >
            <div className="relative bg-gradient-to-br from-[var(--brand-primary)] to-[#05964a] rounded-3xl p-8 sm:p-12 shadow-[0_8px_40px_rgba(3,115,56,0.25)] overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--brand-accent)]/10 rounded-full blur-2xl -translate-x-1/3 translate-y-1/3" />

              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 text-white rounded-full text-xs font-semibold tracking-wide mb-6 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--brand-accent)] animate-pulse" />
                {m.missionCard.badge}
              </div>

              <h2 className="text-white mb-6 font-serif text-3xl sm:text-4xl">
                {m.missionCard.heading}
              </h2>

              <p className="text-white/85 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                {m.missionCard.body}
              </p>
            </div>
          </motion.div>

          {/* Bottom decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-16 h-px bg-gradient-to-r from-transparent via-[var(--brand-accent)]/40 to-transparent max-w-md mx-auto"
          />
        </div>
      </div>
    </section>
  );
}
