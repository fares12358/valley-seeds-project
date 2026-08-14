"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/context/LangContext";

const WhyUsSection = () => {
  const { t } = useTranslation();
  const w = t.whyUs;

  return (
    <section id="why" className="py-22 px-12 bg-white">
      <div className="max-w-[1120px] mx-auto">
        <div className="inline-flex items-center gap-2.5 text-[10px] tracking-[0.16em] uppercase text-[var(--brand-primary)] mb-3.5">
          <span className="block w-6 h-px bg-[#c9a84c]" />
          {w.eyebrow}
        </div>

        <h2 className="font-serif text-4xl font-normal leading-snug mb-8">
          {w.heading_line1}<br />{w.heading_line2}
        </h2>

        <div className="flex flex-col gap-2.5">
          {(w.reasons ?? []).map((reason, index) => (
            <motion.div
              key={reason.num ?? index}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ borderColor: "var(--brand-accent)", boxShadow: "0 4px 20px rgba(150,196,34,0.12)" }}
              className="grid grid-cols-1 md:grid-cols-[60px_1fr_280px] items-center gap-6 bg-white rounded-[14px] border border-[rgba(150,196,34,0.15)] px-6 py-4.5 transition-all duration-200"
            >
              <div className="text-[28px] text-[#c8e87a]">{reason.num}</div>
              <div className="text-[15px] font-semibold text-[#1a2e0e]">{reason.title}</div>
              <div className="text-[13px] text-[#6a8050] leading-relaxed">{reason.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
