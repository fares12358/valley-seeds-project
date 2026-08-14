/** @type {import('next').NextConfig} */

// Derive the backend's origin from NEXT_PUBLIC_API_URL (e.g. "http://localhost:5000/api")
// so uploaded images served from the backend's /uploads route can be optimised by next/image.
const backendPatterns = [];
try {
  const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api");
  backendPatterns.push({
    protocol: apiUrl.protocol.replace(":", ""),
    hostname: apiUrl.hostname,
    port: apiUrl.port || "",
    pathname: "/uploads/**",
  });
} catch {
  // NEXT_PUBLIC_API_URL missing/invalid at build time — fall back to local dev default below
}

const nextConfig = {
  output: "standalone",
  images: {
    // Next's image optimizer refuses to fetch upstream images that resolve to a
    // private/loopback IP (SSRF guard) — that's "localhost" in local dev, always.
    // Production's backend is a real public domain, so optimization stays on there.
    unoptimized: process.env.NODE_ENV !== "production",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      // Local dev fallback — backend serving uploaded images from disk
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      ...backendPatterns,
    ],
  },
};

export default nextConfig;
