"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

// ── Config ─────────────────────────────────────────────────────────────────
const STORAGE_KEY    = "fp_leadmagnet_v1";
const COOLDOWN_DAYS  = 3;
const SCROLL_THRESHOLD = 0.3;

type StoredState = { submitted: true } | { closedAt: number };

function shouldShowPopup(): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return true;
    const data: StoredState = JSON.parse(raw);
    if ("submitted" in data) return false;
    if ("closedAt"  in data) {
      const days = (Date.now() - data.closedAt) / (1000 * 60 * 60 * 24);
      return days >= COOLDOWN_DAYS;
    }
    return true;
  } catch { return true; }
}

// ── Component ──────────────────────────────────────────────────────────────
export default function LeadMagnetPopup() {
  const [mounted,     setMounted]     = useState(false);
  const [isVisible,   setIsVisible]   = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  const openPopup = useCallback(() => {
    setIsVisible(true);
    requestAnimationFrame(() => requestAnimationFrame(() => setIsAnimating(true)));
  }, []);

  const closePopup = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => setIsVisible(false), 350);
  }, []);

  const handleClose = useCallback(() => {
    closePopup();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ closedAt: Date.now() })); }
    catch { /* incognito / SSR */ }
  }, [closePopup]);

  const handleCTA = useCallback(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ submitted: true })); }
    catch { /* ignore */ }
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
    const onLeave  = (e: MouseEvent) => { if (e.clientY <= 0) fire(); };
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
    <>
      <style>{`
        /* CTA shimmer sweep */
        .fp-cta-btn {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #1B93C1 0%, #0e6d96 100%);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .fp-cta-btn::after {
          content: '';
          position: absolute;
          top: -10%;
          left: -130%;
          width: 60%;
          height: 120%;
          background: linear-gradient(
            100deg,
            transparent 20%,
            rgba(255,255,255,0.40) 50%,
            transparent 80%
          );
          transform: skewX(-18deg);
          transition: left 0.60s ease;
        }
        .fp-cta-btn:hover::after { left: 140%; }
        .fp-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(27,147,193,0.55) !important;
        }
        .fp-cta-btn:active { transform: scale(0.98); }
      `}</style>

      {/* ── Backdrop ───────────────────────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        onClick={handleClose}
        style={{
          position:        "fixed",
          inset:           0,
          zIndex:          9999,
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          padding:         "16px",
          backgroundColor: `rgba(6, 14, 30, ${isAnimating ? 0.75 : 0})`,
          backdropFilter:       isAnimating ? "blur(8px)" : "blur(0)",
          WebkitBackdropFilter: isAnimating ? "blur(8px)" : "blur(0)",
          transition: "background-color 0.38s ease, backdrop-filter 0.38s ease",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position:   "relative",
            maxWidth:   "450px",
            width:      "100%",
            transform:  isAnimating ? "translateY(0) scale(1)" : "translateY(24px) scale(0.96)",
            opacity:    isAnimating ? 1 : 0,
            transition: "transform 0.42s cubic-bezier(0.22,1.2,0.36,1), opacity 0.38s ease",
            borderRadius: "18px",
            overflow:     "hidden",
            boxShadow:    "0 28px 80px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.07)",
            textAlign:    "center",
            display:      "flex",
            flexDirection: "column",
          }}
        >
          {/* Top accent stripe */}
          <div style={{
            height:     "4px",
            background: "linear-gradient(90deg, #1B93C1 0%, #091c40 100%)",
          }} />

          {/* ── HEADER ─────────────────────────────────────────────────── */}
          <div
            style={{
              background: "linear-gradient(160deg, #1B93C1 0%, #0d2d5e 100%)",
              padding:    "40px 24px 32px",
              position:   "relative",
              display:    "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              aria-label="Cerrar"
              style={{
                position:       "absolute",
                top:            "12px",
                right:          "12px",
                width:          "30px",
                height:         "30px",
                borderRadius:   "50%",
                background:     "rgba(255,255,255,0.15)",
                border:         "none",
                cursor:         "pointer",
                color:          "rgba(255,255,255,0.9)",
                fontSize:       "18px",
                lineHeight:     1,
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                transition:     "background 0.2s",
                zIndex:         5,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.3)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
            >
              ×
            </button>
            {/* Pill badge */}
            <div style={{
              display:         "inline-flex",
              alignItems:      "center",
              background:      "rgba(255,255,255,0.15)",
              border:          "1px solid rgba(255,255,255,0.25)",
              borderRadius:    "100px",
              padding:         "4px 14px",
              marginBottom:    "16px",
            }}>
              <span style={{
                color:          "rgba(255,255,255,0.95)",
                fontSize:       "10.5px",
                fontWeight:     700,
                letterSpacing:  "1.5px",
                textTransform:  "uppercase",
              }}>
                GUÍA EXCLUSIVA — GRATUITA
              </span>
            </div>

            {/* Title — Perfect fit for 2 lines */}
            <h2
              id="popup-title"
              style={{
                color:        "#ffffff",
                fontSize:     "clamp(22px, 6vw, 30px)",
                fontWeight:   800,
                lineHeight:   1.25,
                margin:       0,
                letterSpacing: "-0.5px",
                textShadow:   "0 2px 8px rgba(0,0,0,0.2)",
              }}
            >
              ¿Estás pensando en
              <br />
              vender tu propiedad?
            </h2>
          </div>

          {/* ── BODY ───────────────────────────────────────────────────── */}
          <div style={{ padding: "32px 28px", background: "#ffffff" }}>
            <p style={{
              color:      "#4b5563",
              fontSize:   "15.5px",
              lineHeight: 1.6,
              margin:     "0 0 24px",
            }}>
              Descargá gratis nuestra guía del vendedor y conocé los pasos
              para vender rápido y al mejor precio.
            </p>

            {/* Mockup Inside Body */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/guia-mockup.png"
              alt="Guía del Vendedor"
              style={{
                height:       "160px",
                width:        "auto",
                objectFit:    "contain",
                filter:       "drop-shadow(0 12px 24px rgba(0,0,0,0.18))",
                marginBottom: "28px",
                transform:    "rotate(1deg)",
              }}
            />

            {/* CTA */}
            <button
              id="popup-cta-btn"
              className="fp-cta-btn"
              onClick={handleCTA}
              style={{
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                gap:            "10px",
                width:          "100%",
                color:          "#ffffff",
                border:         "none",
                borderRadius:   "10px",
                padding:        "18px 24px",
                fontSize:       "13.5px",
                fontWeight:     700,
                letterSpacing:  "1px",
                textTransform:  "uppercase",
                cursor:         "pointer",
                boxShadow:      "0 4px 16px rgba(27,147,193,0.30)",
              }}
            >
              QUIERO MI GUÍA GRATIS
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16" height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>

            {/* Trust note */}
            <p style={{
              color:         "#9CA3AF",
              fontSize:      "11.5px",
              margin:        "16px 0 0",
              letterSpacing: "0.2px",
            }}>
              Sin spam · Podés darte de baja cuando quieras
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
