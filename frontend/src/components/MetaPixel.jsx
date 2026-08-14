"use client";

/**
 * MetaPixel.jsx
 *
 * Loads the Meta Pixel script once (idempotent) and exposes two events:
 *   1. PageView  — fired automatically on mount (public homepage load)
 *   2. Lead      — fired by calling window.__metaPixelLead() after a
 *                  successful contact-form submission
 *
 * The Pixel ID is fetched from GET /api/settings (public) so it can be
 * updated from the dashboard without a redeploy. If the ID is empty or the
 * fetch fails the component is a no-op — the site never breaks.
 *
 * Place this component once, inside the public-site layout (NOT the dashboard
 * layout), so it only initialises on pages the visitor sees.
 */

import { useEffect } from "react";

function initPixel(pixelId) {
  if (!pixelId) return;

  // Guard: already initialised (e.g. React strict-mode double-invoke)
  if (window.fbq) {
    window.fbq("init", pixelId);
    window.fbq("track", "PageView");
    return;
  }

  // Official Meta Pixel base code (minified inline — no external loader needed)
  /* eslint-disable */
  (function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push    = n;
    n.loaded  = true;
    n.version = "2.0";
    n.queue   = [];
    t         = b.createElement(e);
    t.async   = true;
    t.src     = v;
    s         = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */

  window.fbq("init", pixelId);
  window.fbq("track", "PageView");

  // Expose a global so ContactSection can fire the Lead event without
  // needing to know the pixel ID or import anything extra.
  window.__metaPixelLead = (extraParams = {}) => {
    window.fbq("track", "Lead", extraParams);
  };
}

export default function MetaPixel() {
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) return;

    fetch(`${apiUrl}/settings`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        const pixelId = json?.data?.metaPixelId?.trim();
        if (pixelId) initPixel(pixelId);
      })
      .catch(() => {});
  }, []);

  // Nothing rendered — pure side-effect component
  return null;
}
