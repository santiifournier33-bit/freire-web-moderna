"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  // Pages where navbar should always stay visible
  const isFixedPage = pathname === "/guia-vendedores";

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    setIsScrolled(currentScrollY > 20);

    const scrollDiff = Math.abs(currentScrollY - lastScrollY);

    if (currentScrollY < 10) {
      setIsVisible(true);
    } else if (
      currentScrollY > lastScrollY &&
      currentScrollY > 100 &&
      scrollDiff > 5 &&
      !isFixedPage
    ) {
      setIsVisible(false);
    } else if (currentScrollY < lastScrollY && scrollDiff > 5) {
      setIsVisible(true);
    }

    setLastScrollY(currentScrollY);
  }, [lastScrollY, isFixedPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Propiedades", href: "/propiedades" },
    { name: "Contacto", href: "/contacto" },
  ];

  const isActiveLink = (href: string) => pathname === href;

  // Light mode = Hero at top, no scroll, menu closed
  const showLightMode = !isScrolled && pathname === "/" && !isMobileMenuOpen;

  // Header background: solid white when menu open or scrolled, transparent on Hero
  const headerBg = isMobileMenuOpen
    ? "bg-white border-b border-primary/8 shadow-sm"
    : isScrolled
    ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,37,72,0.08)] border-b border-primary/5"
    : "bg-transparent border-b border-transparent";

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* HEADER BAR                                                         */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${headerBg}`}
      >
        <nav className="mx-auto flex h-24 md:h-28 w-full max-w-7xl items-center justify-between px-5 md:px-8">

          {/* Logo */}
          <Link
            href="/"
            className="relative z-10 flex items-center group shrink-0"
            onClick={() => {
              if (pathname === "/") {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <Image
              src={showLightMode ? "/logo-blanco-oficial.png" : "/logo-freire-azul.png"}
              alt="Freire Propiedades"
              width={240}
              height={100}
              className="h-20 md:h-24 w-auto object-contain transition-all duration-300"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-5 py-3 rounded-md text-xs uppercase tracking-[0.12em] font-bold transition-all duration-300 ${
                  isActiveLink(link.href)
                    ? showLightMode
                      ? "text-white bg-white/15"
                      : "text-primary bg-primary/5"
                    : showLightMode
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-primary/70 hover:text-primary hover:bg-primary/5"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="w-px h-6 bg-current opacity-10 mx-2" />
            <Link
              href="/tasar-propiedad"
              className={`ml-2 px-6 py-3 rounded-md text-xs font-bold uppercase tracking-[0.12em] transition-all duration-300 ${
                showLightMode
                  ? "bg-white text-primary hover:bg-secondary hover:text-white shadow-sm hover:shadow-md hover:-translate-y-0.5"
                  : "btn-primary !py-3 !px-6 !text-xs !rounded-md"
              }`}
            >
              Tasar mi propiedad
            </Link>
          </div>

          {/* ── Mobile Hamburger Button ─────────────────────────────────── */}
          <button
            className={`md:hidden relative z-[60] flex items-center justify-center w-12 h-12 rounded-xl
              transition-all duration-300 active:scale-90 touch-manipulation ${
              isMobileMenuOpen
                ? "bg-primary/10 text-primary"
                : showLightMode
                ? "text-white bg-white/20 backdrop-blur-sm border border-white/30 shadow-lg"
                : "text-primary bg-primary/5 border border-primary/10"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Abrir / cerrar menú"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {/* Hand-drawn hamburger / X — no icon library dependency */}
            <div className="relative w-6 h-6">
              <span
                className={`absolute left-0 block w-6 h-0.5 bg-current transition-all duration-300 ease-out ${
                  isMobileMenuOpen ? "top-[11px] rotate-45" : "top-[6px] rotate-0"
                }`}
              />
              <span
                className={`absolute left-0 top-[11px] block w-6 h-0.5 bg-current transition-all duration-200 ${
                  isMobileMenuOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
                }`}
              />
              <span
                className={`absolute left-0 block w-6 h-0.5 bg-current transition-all duration-300 ease-out ${
                  isMobileMenuOpen ? "top-[11px] -rotate-45" : "top-[16px] rotate-0"
                }`}
              />
            </div>
          </button>
        </nav>
      </header>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* MOBILE MENU — OUTSIDE <header> to avoid transform stacking trap   */}
      {/* The header uses translate-y for show/hide, which creates a new    */}
      {/* CSS containing block. Fixed children inside it get trapped.       */}
      {/* By rendering as a sibling, the menu is fixed to the viewport.    */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 top-24 z-[45] md:hidden"
          style={{ background: "#ffffff" }}
        >
          <div className="flex flex-col h-full px-6 pt-8 pb-12 overflow-y-auto">

            {/* Nav Links */}
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center px-5 py-4 rounded-xl text-lg font-bold tracking-tight transition-colors duration-200 ${
                    isActiveLink(link.href)
                      ? "text-primary bg-primary/6 border border-primary/10"
                      : "text-primary/65 hover:text-primary hover:bg-primary/5"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* CTA at bottom */}
            <div className="mt-auto pt-8 border-t border-primary/10">
              <Link
                href="/tasar-propiedad"
                className="btn-primary block w-full text-center !rounded-xl !py-4 !text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tasar mi propiedad
              </Link>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
