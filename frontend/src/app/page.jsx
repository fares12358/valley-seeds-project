"use client";

import HeroSection       from "@/components/HeroSection";
import AboutSection      from "@/components/AboutSection";
import WhyUsSection      from "@/components/WhyUsSection";
import MissionSection    from "@/components/MissionSection";
import ServicesSection   from "@/components/ServicesSection";
import TechnologySection from "@/components/TechnologySection";
import BlockchainSection from "@/components/BlockchainSection";
import ContactSection    from "@/components/ContactSection";
import Header            from "@/components/Header";
import Footer            from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <AboutSection />
        <WhyUsSection />
        <MissionSection />
        <ServicesSection />
        <TechnologySection />
        <BlockchainSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
