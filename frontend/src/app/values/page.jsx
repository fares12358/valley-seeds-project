"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ValueCard } from "@/components/ServicesSection";
import { useTranslation } from "@/context/LangContext";

const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

export default function ValuesPage() {
  const { t } = useTranslation();
  const s      = t.services;
  const values = s?.values  || [];
  const images = s?._images || [];

  // Explicit grid columns — only one lg:grid-cols-X applied at a time
  const lgCols =
    values.length <= 1 ? "lg:grid-cols-1" :
    values.length === 2 ? "lg:grid-cols-2" :
    values.length === 3 ? "lg:grid-cols-3" :
                          "lg:grid-cols-4";

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-[#012a14] via-[var(--brand-primary)] to-[#05964a] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[var(--brand-accent)]/5 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--brand-accent)]/30 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24">

          {/* Back link — translated */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-10"
          >
            <Link
              href="/#services"
              className="inline-flex items-center gap-2 text-white/50 hover:text-[var(--brand-accent)] text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t.services?.back_to_home || "Back to home"}
            </Link>
          </motion.div>

          {/* Header — same style as ServicesSection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-14 lg:mb-16"
          >
            <div className="inline-flex items-center gap-2.5 text-xs tracking-[0.2em] uppercase text-[var(--brand-accent)] mb-5">
              <span className="block w-8 h-px bg-[var(--brand-accent)]" />
              {s.eyebrow}
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-tight text-white">
              {s.heading}<br />
              <span className="text-[var(--brand-accent)]">{s.heading_accent}</span>
            </h1>
            <p className="mt-4 text-white/50 text-sm">
              {values.length} {values.length === 1 ? "value" : "values"}
            </p>
          </motion.div>

          {/* All cards — fixed grid logic */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`grid grid-cols-1 sm:grid-cols-2 gap-5 ${lgCols}`}
          >
            {values.map((value, index) => (
              <ValueCard key={index} value={value} index={index} images={images} />
            ))}
          </motion.div>

          <div className="mt-20 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--brand-accent)]/30" />
            <div className="w-2 h-2 rounded-full bg-[var(--brand-accent)]/40" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--brand-accent)]/30" />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
