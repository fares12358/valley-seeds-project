"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";
import { useTranslation } from "@/context/LangContext";
import { useBrand } from "@/context/BrandContext";
import { LOCALE_META, SUPPORTED_LOCALES } from "@/i18n/index";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { t, lang, setLang, isRTL } = useTranslation();
  const { logoUrl, logoWhiteUrl } = useBrand();

  const navItems = [
    { id: "home",       label: t.nav.home,       path: "/", sectionId: null },
    { id: "about",      label: t.nav.about,      path: "/", sectionId: "about" },
    { id: "services",   label: t.nav.services,   path: "/", sectionId: "services" },
    { id: "technology", label: t.nav.technology, path: "/", sectionId: "technology" },
    { id: "contact",    label: t.nav.contact,    path: "/", sectionId: "contact" },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const scrollToSection = (sectionId) => {
    setIsMobileMenuOpen(false);
    if (!sectionId) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const toggleLang = () => {
    const next = lang === "en" ? "ar" : "en";
    setLang(next);
  };

  const isLight = !isHome || isScrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isLight ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="relative w-40 h-10 flex items-center justify-center">
                <Image
                  src={isLight ? (logoUrl || "/images/logo.svg") : (logoWhiteUrl || "/images/logo-white.svg")}
                  alt="Valley Seeds Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => scrollToSection(item.sectionId)}
                  className={`relative transition-colors hover:text-[var(--brand-primary)] font-medium cursor-pointer bg-transparent border-none text-sm ${
                    pathname === item.path && !item.sectionId
                      ? isLight
                        ? "text-[var(--brand-primary)]"
                        : "text-white font-bold"
                      : isLight
                        ? "text-gray-700"
                        : "text-white"
                  }`}
                >
                  {item.label}
                  {pathname === item.path && !item.sectionId && (
                    <motion.div
                      layoutId="activeNav"
                      className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full ${
                        isLight ? "bg-[var(--brand-primary)]" : "bg-white"
                      }`}
                    />
                  )}
                </button>
              </motion.div>
            ))}
          </nav>

          {/* Right side: CTA + Lang switcher */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language switcher */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              onClick={toggleLang}
              aria-label="Switch language"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider border transition-all duration-300 ${
                isLight
                  ? "border-[var(--brand-primary)]/30 text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/5"
                  : "border-white/30 text-white hover:bg-white/10"
              }`}
            >
              <span>{LOCALE_META[lang === "en" ? "ar" : "en"].flag}</span>
              <span>{LOCALE_META[lang === "en" ? "ar" : "en"].label}</span>
            </motion.button>

            {/* CTA */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              onClick={() => scrollToSection("contact")}
              className={`flex items-center px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                isLight
                  ? "bg-gradient-to-r from-[var(--brand-primary)] to-[#05964a] text-white hover:shadow-lg hover:shadow-[var(--brand-primary)]/20"
                  : "bg-white/10 backdrop-blur-sm text-white border border-white/20 hover:bg-white/20"
              }`}
            >
              {t.nav.cta}
            </motion.button>
          </div>

          {/* Mobile: lang + hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={toggleLang}
              aria-label="Switch language"
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                isLight
                  ? "border-[var(--brand-primary)]/30 text-[var(--brand-primary)]"
                  : "border-white/30 text-white"
              }`}
            >
              <span>{LOCALE_META[lang === "en" ? "ar" : "en"].flag}</span>
              <span>{LOCALE_META[lang === "en" ? "ar" : "en"].label}</span>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-lg transition-colors ${
                isLight
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {isMobileMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 overflow-hidden shadow-lg"
          >
            <nav
              className={`max-w-7xl mx-auto px-4 py-4 flex flex-col space-y-1 ${isRTL ? "text-right" : "text-left"}`}
            >
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => scrollToSection(item.sectionId)}
                  className={`text-left transition-colors py-3 px-3 rounded-lg font-medium cursor-pointer bg-transparent border-none ${
                    pathname === item.path && !item.sectionId
                      ? "text-[var(--brand-primary)] bg-[var(--brand-primary)]/5"
                      : "text-gray-700 hover:text-[var(--brand-primary)] hover:bg-gray-50"
                  } ${isRTL ? "text-right" : "text-left"}`}
                >
                  {item.label}
                </motion.button>
              ))}
              <motion.button
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                onClick={() => scrollToSection("contact")}
                className="mt-3 w-full py-3 rounded-lg bg-gradient-to-r from-[var(--brand-primary)] to-[#05964a] text-white font-semibold text-sm"
              >
                {t.nav.cta}
              </motion.button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
