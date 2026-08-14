"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { FaImage } from "react-icons/fa";
import { useTranslation } from "@/context/LangContext";

const AboutSection = () => {
  const { t } = useTranslation();
  const a = t.about;
  const images = a?._images || [];
  const mainImg      = images[0]?.url || null;
  const secondaryImg = images[1]?.url || null;

  return (
    <section id="about" className="py-22 px-12 bg-[#f5f2eb]">
      <div className="max-w-[1120px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-18 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2.5 text-[10px] tracking-[0.16em] uppercase text-[var(--brand-primary)] mb-3.5">
              <span className="block w-6 h-px bg-[#c9a84c]" />
              {a.eyebrow}
            </div>

            <h2 className="font-serif text-4xl font-normal leading-snug mb-8">
              {a.heading_line1}<br />{a.heading_line2}
            </h2>

            <p className="text-[15px] text-[#3d5228] leading-relaxed mb-4">
              {a.body}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative h-[460px] hidden lg:block"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-0 right-14 bottom-14 rounded-2xl overflow-hidden shadow-[0_24px_60px_rgba(3,115,56,0.18)]"
            >
              {mainImg ? (
                <Image
                  src={mainImg}
                  alt={a.img_main_alt}
                  fill
                  sizes="(max-width: 1024px) 0px, 40vw"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[var(--brand-primary)]/5">
                  <FaImage className="text-[var(--brand-primary)]/20 text-5xl" />
                </div>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute bottom-0 right-0 w-[52%] h-[52%] rounded-[14px] overflow-hidden border-[5px] border-[#f5f2eb] shadow-[0_12px_32px_rgba(3,115,56,0.2)]"
            >
              {secondaryImg ? (
                <Image
                  src={secondaryImg}
                  alt={a.img_secondary_alt}
                  fill
                  sizes="(max-width: 1024px) 0px, 20vw"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[var(--brand-primary)]/5">
                  <FaImage className="text-[var(--brand-primary)]/20 text-3xl" />
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
