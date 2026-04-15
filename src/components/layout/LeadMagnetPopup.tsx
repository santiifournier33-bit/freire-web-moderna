"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

// ── Config ────────────────────────────────────────────────────────────────
const STORAGE_KEY = "fp_leadmagnet_v1";
const COOLDOWN_DAYS = 3;
const SCROLL_THRESHOLD = 0.3; // 30%

type StoredState = { submitted: true } | { closedAt: number };

function shouldShowPopup(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return true;
    const data: StoredState = JSON.parse(raw);
    if ("submitted" in data) return false;
    if ("closedAt" in data) {
      const days = (Date.now() - data.closedAt) / (1000 * 60 * 60 * 24);
      return days >= COOLDOWN_DAYS;
    }
    return true;
  } catch {
    return true;
  }
}

// ── Component ─────────────────────────────────────────────────────────────
export default function LeadMagnetPopup() {
  const [mounted, setMounted]         = useState(false);
  const [isVisible, setIsVisible]     = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const router                        = useRouter();

  const openPopup = useCallback(() => {
    setIsVisible(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setIsAnimating(true)));
  }, []);

  const closePopup = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 340);
  }, []);

  const handleClose = useCallback(() => {
    closePopup();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ closedAt: Date.now() }));
    } catch { /* incognito / SSR */ }
  }, [closePopup]);

  const handleCTA = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ submitted: true }));
    } catch { /* ignore */ }
    closePopup();
    router.push("/guia-vendedores");
  }, [closePopup, router]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted || !shouldShowPopup()) return;

    let triggered = false;

    const fire = () => {
      if (triggered) return;
      triggered = true;
      cleanup();
      openPopup();
    };

    // Exit-intent: mouse leaves viewport through top (desktop)
    const onLeave = (e: MouseEvent) => { if (e.clientY <= 0) fire(); };

    // Scroll 30% (all devices)
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0 && window.scrollY / total >= SCROLL_THRESHOLD) fire();
    };

    const cleanup = () => {
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", onScroll);
    };

    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return cleanup;
  }, [mounted, openPopup]);

  if (!isVisible) return null;

  return (
    /* Backdrop */
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
      onClick={handleClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        backgroundColor: `rgba(8, 18, 36, ${isAnimating ? 0.65 : 0})`,
        backdropFilter: isAnimating ? "blur(8px)" : "blur(0)",
        WebkitBackdropFilter: isAnimating ? "blur(8px)" : "blur(0)",
        transition: "background-color 0.35s ease, backdrop-filter 0.35s ease",
      }}
    >
      {/* Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#ffffff",
          borderRadius: "16px",
          maxWidth: "420px",
          width: "100%",
          overflow: "hidden",
          boxShadow: "0 32px 80px rgba(0,0,0,0.38)",
          transform: isAnimating ? "translateY(0) scale(1)" : "translateY(28px) scale(0.95)",
          opacity: isAnimating ? 1 : 0,
          transition: "transform 0.38s cubic-bezier(0.22,1.2,0.36,1), opacity 0.35s ease",
        }}
      >
        {/* Top accent stripe */}
        <div style={{ height: "4px", background: "linear-gradient(90deg,#1B93C1,#0b6fa0)" }} />

        {/* Header */}
        <div
          style={{
            background: "linear-gradient(140deg, #1B93C1 0%, #1278a8 100%)",
            padding: "26px 28px 22px",
            position: "relative",
          }}
        >
          {/* Close */}
          <button
            onClick={handleClose}
            aria-label="Cerrar"
            style={{
              position: "absolute", top: "12px", right: "14px",
              width: "28px", height: "28px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.18)",
              border: "none", cursor: "pointer",
              color: "rgba(255,255,255,0.85)",
              fontSize: "18px", lineHeight: 1,
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.32)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.18)")}
          >
            ×
          </button>

          {/* Pill badge */}
          <div
            style={{
              display: "inline-flex", alignItems: "center",
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.28)",
              borderRadius: "100px",
              padding: "3px 11px",
              marginBottom: "14px",
            }}
          >
            <span style={{
              color: "rgba(255,255,255,0.92)",
              fontSize: "10px", fontWeight: 700,
              letterSpacing: "1.8px", textTransform: "uppercase",
            }}>
              GUÍA EXCLUSIVA — GRATUITA
            </span>
          </div>

          {/* Title */}
          <h2
            id="popup-title"
            style={{
              color: "#fff",
              fontSize: "clamp(20px, 4.5vw, 25px)",
              fontWeight: 800,
              lineHeight: 1.25,
              margin: 0,
              letterSpacing: "-0.4px",
              textShadow: "0 1px 6px rgba(0,0,0,0.18)",
            }}
          >
            ¿Estás pensando en vender tu propiedad?
          </h2>
        </div>

        {/* Body */}
        <div style={{ padding: "22px 28px 26px" }}>
          <p style={{
            color: "#374151",
            fontSize: "15px",
            lineHeight: 1.7,
            margin: "0 0 22px",
          }}>
            Descargá gratis nuestra guía del vendedor y conocé los pasos para
            vender rápido y al mejor precio.
          </p>

          {/* CTA */}
          <button
            id="popup-cta-btn"
            onClick={handleCTA}
            style={{
              display: "flex", alignItems: "center",
              justifyContent: "center", gap: "8px",
              width: "100%",
              background: "linear-gradient(135deg, #1B93C1 0%, #0e6d96 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "15px 24px",
              fontSize: "12.5px", fontWeight: 700,
              letterSpacing: "1.2px", textTransform: "uppercase",
              cursor: "pointer",
              boxShadow: "0 4px 18px rgba(27,147,193,0.38)",
              transition: "filter 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = "brightness(1.1)";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 26px rgba(27,147,193,0.48)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = "brightness(1)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 18px rgba(27,147,193,0.38)";
            }}
          >
            QUIERO MI GUÍA GRATIS
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

          {/* Trust */}
          <p style={{
            color: "#9CA3AF", fontSize: "11px",
            textAlign: "center", margin: "12px 0 0",
            letterSpacing: "0.2px",
          }}>
            Sin spam · Podés darte de baja cuando quieras
          </p>
        </div>
      </div>
    </div>
  );
}
