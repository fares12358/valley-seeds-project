"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { FaShieldAlt, FaCheckCircle, FaClock, FaHandshake, FaArrowRight } from "react-icons/fa";

const benefits = [
  { icon: FaCheckCircle, title: "Growth Monitoring",    description: "Regular monitoring and support throughout the entire period" },
  { icon: FaHandshake,   title: "Material Replacement", description: "Option for replacement when necessary" },
  { icon: FaClock,       title: "Long-Term Support",    description: "6 years of expert support and consulting" },
];

export default function WarrantySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="warranty" className="py-20 bg-[#2F6E49] text-white relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8CCB8A] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#8CCB8A] rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 bg-white/20 text-white rounded-full mb-4">
            Quality Guarantee
          </div>
          <h2 className="text-white mb-6">6-Year Warranty</h2>
          <p className="text-white/90 text-lg max-w-3xl mx-auto leading-relaxed">
            All seedlings and raw materials come with a 6-year warranty, including growth
            monitoring, support, and replacement options — all verified through the
            blockchain system.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="w-64 h-64 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/20 shadow-2xl">
                <div className="text-center">
                  <FaShieldAlt className="w-20 h-20 text-[#8CCB8A] mx-auto mb-4" />
                  <div className="text-white">6 Years</div>
                  <div className="text-white/80 text-lg">Warranty</div>
                </div>
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 w-64 h-64 bg-[#8CCB8A]/20 rounded-full"
              />
            </div>
          </motion.div>

          {/* Benefits */}
          <div className="space-y-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
                className="flex items-start gap-4 bg-white/10 backdrop-blur-sm p-6 rounded-xl hover:bg-white/15 transition-colors"
              >
                <div className="flex-shrink-0 w-14 h-14 bg-[#8CCB8A] rounded-lg flex items-center justify-center">
                  <benefit.icon className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h4 className="text-white mb-2">{benefit.title}</h4>
                  <p className="text-white/80">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mt-16 text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
            <FaCheckCircle className="w-5 h-5 text-[#8CCB8A]" />
            <span className="text-white/90">Blockchain verified and transparent</span>
          </div>

          <div>
            <Link
              href="/technology"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-[#2F6E49] rounded-lg hover:bg-[#8CCB8A] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Learn More About Our Technology
              <FaArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
