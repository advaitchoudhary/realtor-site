"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { siteConfig } from "@/lib/config";

// Strip non-digits from phone and build WhatsApp URL
const phone = siteConfig.agent.phone.replace(/\D/g, "");
const message = encodeURIComponent(
  `Hi ${siteConfig.agent.name}, I found your website and I'm interested in your real estate services. Can you help me?`
);
const WHATSAPP_URL = `https://wa.me/${phone}?text=${message}`;

export default function WhatsAppButton() {
  const [tooltipVisible, setTooltipVisible] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-[998] flex flex-col items-end gap-2">
      {/* Tooltip bubble */}
      {tooltipVisible && (
        <div className="relative flex items-center gap-2 bg-white text-gray-800 text-sm font-medium px-4 py-2.5 rounded-2xl shadow-lg border border-gray-100 max-w-[220px]">
          <span>Chat with Manoj on WhatsApp</span>
          <button
            onClick={() => setTooltipVisible(false)}
            className="shrink-0 text-gray-400 hover:text-gray-600"
            aria-label="Dismiss"
          >
            <X size={13} />
          </button>
          {/* Bubble tail */}
          <span className="absolute -bottom-2 right-7 w-3 h-3 bg-white border-b border-r border-gray-100 rotate-45" />
        </div>
      )}

      {/* WhatsApp button */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
        style={{ background: "#25D366" }}
      >
        {/* WhatsApp SVG icon */}
        <svg viewBox="0 0 32 32" width="30" height="30" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.49.664 4.823 1.82 6.833L2 30l7.376-1.793A13.933 13.933 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.54 11.54 0 0 1-5.89-1.608l-.422-.25-4.376 1.063 1.1-4.262-.276-.437A11.56 11.56 0 0 1 4.4 16C4.4 9.59 9.59 4.4 16 4.4S27.6 9.59 27.6 16 22.41 27.6 16 27.6zm6.33-8.63c-.347-.174-2.055-1.014-2.374-1.13-.319-.115-.55-.173-.782.174-.231.346-.896 1.13-1.098 1.362-.202.231-.404.26-.75.086-.347-.173-1.464-.54-2.787-1.72-1.03-.918-1.725-2.052-1.927-2.398-.202-.347-.022-.534.152-.707.156-.155.347-.404.52-.606.174-.202.231-.347.347-.578.115-.231.058-.433-.029-.607-.087-.173-.782-1.883-1.071-2.579-.282-.677-.569-.585-.782-.595l-.665-.012c-.231 0-.607.087-.924.433-.318.347-1.214 1.186-1.214 2.893s1.243 3.356 1.416 3.587c.174.231 2.447 3.733 5.929 5.235.829.358 1.476.572 1.98.732.832.265 1.59.228 2.189.138.668-.1 2.055-.84 2.346-1.651.29-.81.29-1.505.202-1.651-.086-.145-.318-.231-.664-.405z"/>
        </svg>
      </a>
    </div>
  );
}
