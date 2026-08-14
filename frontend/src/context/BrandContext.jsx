"use client";

import { createContext, useContext, useEffect, useState } from "react";

const BrandContext = createContext(null);

const DEFAULTS = {
  brandName:    "Valley Seeds",
  primaryColor: "#037338",
  accentColor:  "#96C422",
  logoUrl:      "",
  logoWhiteUrl: "",
};

// Fetches Settings (brand colors + logos) from the backend once and applies the
// colors as CSS custom properties (--brand-primary / --brand-accent) so every
// component that already styles itself with var(--brand-primary) picks them up
// without re-rendering. Falls back to the hardcoded defaults on any failure —
// the public site must never break because the settings API is unreachable.
export function BrandProvider({ children }) {
  const [brand, setBrand] = useState(DEFAULTS);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return;

    fetch(`${apiUrl}/settings`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data) setBrand((prev) => ({ ...prev, ...json.data }));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (brand.primaryColor) root.style.setProperty("--brand-primary", brand.primaryColor);
    if (brand.accentColor)  root.style.setProperty("--brand-accent", brand.accentColor);
  }, [brand.primaryColor, brand.accentColor]);

  return <BrandContext.Provider value={brand}>{children}</BrandContext.Provider>;
}

export function useBrand() {
  const ctx = useContext(BrandContext);
  if (!ctx) throw new Error("useBrand must be inside <BrandProvider>");
  return ctx;
}
