"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaHome } from "react-icons/fa";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center px-4"
      >
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-[#2F6E49] opacity-20 mb-4 leading-none select-none">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            We&apos;re sorry, but the page you are looking for does not exist
            or has been moved.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#2F6E49] to-[#8CCB8A] text-white rounded-lg hover:shadow-lg transition-all duration-300 font-semibold"
        >
          <FaHome />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
