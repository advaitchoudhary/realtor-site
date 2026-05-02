"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

const STORAGE_KEY = "privacy_accepted";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pointer-events-none">
      <div
        className="max-w-4xl mx-auto pointer-events-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-2xl px-5 py-4 shadow-2xl border border-white/10"
        style={{ background: "var(--primary)" }}
      >
        <p className="text-white/80 text-sm leading-relaxed flex-1">
          We use cookies to enhance your experience and collect inquiry information to respond to your requests. By continuing to use this site, you agree to our{" "}
          <Link href="/privacy" className="text-white underline hover:opacity-80 transition-opacity">
            Privacy Policy
          </Link>{" "}
          and{" "}
          <Link href="/terms" className="text-white underline hover:opacity-80 transition-opacity">
            Terms of Use
          </Link>.
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={accept}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-[var(--primary)] transition-opacity hover:opacity-90"
            style={{ background: "var(--accent)" }}
          >
            Accept
          </button>
          <button
            onClick={accept}
            aria-label="Dismiss"
            className="text-white/50 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
