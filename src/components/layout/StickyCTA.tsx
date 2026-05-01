"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const distanceFromBottom = docHeight - scrollY - viewportHeight;

      // Show after 500px scroll, hide near footer (last 400px)
      setIsVisible(scrollY > 500 && distanceFromBottom > 400);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-[90] md:hidden transition-all duration-500 ease-out ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0"
      }`}
    >
      <div className="bg-white/95 backdrop-blur-xl border-t border-primary/10 shadow-[0_-4px_20px_rgba(0,37,72,0.08)] px-4 py-3">
        <Link
          href="/tasar-propiedad"
          className="flex items-center justify-center gap-2 w-full bg-primary text-white py-3.5 rounded-lg text-xs font-bold uppercase tracking-[0.12em] transition-all duration-300 active:scale-[0.98] shadow-md"
        >
          Tasar mi propiedad
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
