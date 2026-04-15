"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ── localStorage key & config ──────────────────────────────────────────────
const STORAGE_KEY = "fp_leadmagnet_v1";
const COOLDOWN_DAYS = 3;
const SCROLL_THRESHOLD = 0.30; // 30 %

type StoredState =
  | { submitted: true }
  | { closedAt: number };

function shouldShowPopup(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return true;
    const data: StoredState = JSON.parse(raw);
    if ("submitted" in data) return false;
    if ("closedAt" in data) {
      const daysPassed = (Date.now() - data.closedAt) / (1000 * 60 * 60 * 24);
      return daysPassed >= COOLDOWN_DAYS;
    }
    return true;
  } catch {
    return true;
  }
}

// ── Component ──────────────────────────────────────────────────────────────
export default function LeadMagnetPopup() {
  const [mounted, setMounted]         = useState(false);
  const [isVisible, setIsVisible]     = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const router                        = useRouter();

  // Animate in
  const openPopup = useCallback(() => {
    setIsVisible(true);
    // Small rAF delay so browser paints the invisible state first,
    // enabling the CSS transition to actually run.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsAnimating(true));
    });
  }, []);

  // Animate out, then hide
  const closePopup = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 320);
  }, []);

  const handleClose = useCallback(() => {
    closePopup();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ closedAt: Date.now() }));
    } catch { /* ignore SSR / incognito */ }
  }, [closePopup]);

  const handleCTA = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ submitted: true }));
    } catch { /* ignore */ }
    closePopup();
    router.push("/guia-vendedores");
  }, [closePopup, router]);

  // Register triggers only after hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!shouldShowPopup()) return;

    let triggered = false;

    const trigger = () => {
      if (triggered) return;
      triggered = true;
      cleanup(); // remove listeners immediately
      openPopup();
    };

    // ── Exit-intent (desktop) ─────────────────────────────────────────────
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger();
    };

    // ── Scroll 30 % (all devices) ─────────────────────────────────────────
    const onScroll = () => {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      if (window.scrollY / scrollable >= SCROLL_THRESHOLD) trigger();
    };

    const cleanup = () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScroll);
    };

    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("scroll", onScroll, { passive: true });

    return cleanup;
  }, [mounted, openPopup]);

  if (!isVisible) return null;

  return (
    /* ── Backdrop ──────────────────────────────────────────────────────── */
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
        padding: "24px",
        backgroundColor: `rgba(0,0,0,${isAnimating ? 0.55 : 0})`,
        backdropFilter: isAnimating ? "blur(4px)" : "blur(0px)",
        transition: "background-color 0.32s ease, backdrop-filter 0.32s ease",
      }}
    >
      {/* ── Card ────────────────────────────────────────────────────────── */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "14px",
          maxWidth: "460px",
          width: "100%",
          overflow: "hidden",
          boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
          transform: isAnimating
            ? "translateY(0) scale(1)"
            : "translateY(24px) scale(0.97)",
          opacity: isAnimating ? 1 : 0,
          transition: "transform 0.32s cubic-bezier(0.34,1.56,0.64,1), opacity 0.32s ease",
        }}
      >
        {/* ── Header (navy) ─────────────────────────────────────────────── */}
        <div
          style={{
            backgroundColor: "#0B1D3A",
            padding: "28px 32px 24px",
            position: "relative",
          }}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            aria-label="Cerrar ventana"
            style={{
              position: "absolute",
              top: "12px",
              right: "14px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "rgba(255,255,255,0.5)",
              fontSize: "26px",
              lineHeight: 1,
              padding: "4px 8px",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.95)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
            }
          >
            ×
          </button>

          {/* Logo */}
          <div style={{ marginBottom: "16px" }}>
            <Image
              src="/logo-blanco-oficial.png"
              alt="Freire Propiedades"
              width={70}
              height={30}
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          {/* Gold label */}
          <p
            style={{
              color: "#D4AF37",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "2.5px",
              textTransform: "uppercase",
              margin: "0 0 10px",
            }}
          >
            GUÍA EXCLUSIVA — GRATUITA
          </p>

          {/* Title */}
          <h2
            id="popup-title"
            style={{
              color: "#ffffff",
              fontSize: "21px",
              fontWeight: 700,
              lineHeight: 1.35,
              margin: 0,
            }}
          >
            ¿Estás pensando en vender tu propiedad?
          </h2>
        </div>

        {/* ── Body (white) ──────────────────────────────────────────────── */}
        <div style={{ padding: "28px 32px 32px" }}>
          <p
            style={{
              color: "#4a5568",
              fontSize: "15px",
              lineHeight: 1.65,
              margin: "0 0 28px",
            }}
          >
            Descargá gratis nuestra guía del vendedor y conocé los pasos para
            vender rápido y al mejor precio.
          </p>

          {/* CTA */}
          <button
            id="popup-cta-btn"
            onClick={handleCTA}
            style={{
              display: "block",
              width: "100%",
              backgroundColor: "#0B1D3A",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              padding: "16px",
              fontSize: "13px",
              fontWeight: 700,
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "background-color 0.2s ease, transform 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#D4AF37";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#0B1D3A";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            QUIERO MI GUÍA GRATIS →
          </button>

          {/* Trust micro-copy */}
          <p
            style={{
              color: "#a0aec0",
              fontSize: "11px",
              textAlign: "center",
              margin: "14px 0 0",
            }}
          >
            Sin spam. Podés darte de baja cuando quieras.
          </p>
        </div>
      </div>
    </div>
  );
}
