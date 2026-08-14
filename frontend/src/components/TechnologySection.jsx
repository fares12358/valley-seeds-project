"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import * as FaIcons from "react-icons/fa";
import { useTranslation } from "@/context/LangContext";

// Fallback shown when a card has no icon set, or an invalid icon name was entered
const DEFAULT_ICON_NAME = "FaFlask";

const TechnologySection = () => {
  const { t } = useTranslation();
  const tech   = t.technology;
  const cards  = tech?.cards   || [];
  const images = tech?._images || [];

  const gridCols =
    cards.length === 1
      ? "grid-cols-1 max-w-2xl"
      : cards.length >= 3
      ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-1 md:grid-cols-2";

  return (
    <section id="technology" className="py-22 px-12 bg-[#ede8db]">
      <div className="max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2.5 text-[10px] tracking-[0.16em] uppercase text-[var(--brand-primary)] mb-3.5">
          <span className="block w-6 h-px bg-[#c9a84c]" />
          {tech.eyebrow}
        </div>

        <h2 className="font-serif text-4xl font-normal leading-snug mb-8 text-[#1a2e0e]">
          {tech.heading_line1}<br />{tech.heading_line2}
        </h2>

        <div className={`grid ${gridCols} gap-4`}>
          {cards.map((card, index) => {
            // card.icon is a react-icons/fa export name (e.g. "FaFlask") chosen in the dashboard
            const Icon   = FaIcons[card.icon] || FaIcons[DEFAULT_ICON_NAME];
            // Only ever sourced from the backend's uploads folder — no local/Unsplash fallback
            const imgSrc = images[index]?.url || null;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 3) * 0.15, duration: 0.6 }}
                className="bg-white rounded-2xl border border-[rgba(150,196,34,0.18)] overflow-hidden shadow-[0_4px_24px_rgba(3,115,56,0.06)]"
              >
                {/* next/image replaces motion.img — lazy loading + WebP for uploaded images */}
                <div className="h-[220px] overflow-hidden relative">
                  <motion.div
                    className="absolute inset-0"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.4 }}
                  >
                    {imgSrc ? (
                      <Image
                        src={imgSrc}
                        alt={card.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[var(--brand-primary)]/5">
                        <FaIcons.FaImage className="text-[var(--brand-primary)]/20 text-4xl" />
                      </div>
                    )}
                  </motion.div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3.5">
                    <div className="w-10 h-10 rounded-[10px] bg-[#f0f8dc] flex items-center justify-center flex-shrink-0">
                      <Icon className="text-xl text-[var(--brand-primary)]" />
                    </div>
                    <div className="text-[15px] font-semibold text-[#1a2e0e]">{card.name}</div>
                  </div>
                  <p className="text-[13px] text-[#6a8050] leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;
