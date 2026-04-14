import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageLoader from "@/components/layout/PageLoader";
import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";
import MicrosoftClarity from "@/components/analytics/MicrosoftClarity";
import MetaPixel from "@/components/analytics/MetaPixel";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const BASE_URL = "https://www.freirepropiedades.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Freire Propiedades | Inmobiliaria en Pilar y Zona Norte",
    template: "%s | Freire Propiedades",
  },
  description:
    "Inmobiliaria con certificación CRS internacional en Pilar y Zona Norte. Compra, venta, alquiler y tasaciones de propiedades con más de 20 años de experiencia.",
  keywords: [
    "inmobiliaria Pilar",
    "casas en venta Pilar",
    "departamentos Pilar",
    "alquiler Pilar",
    "tasación de propiedades Pilar",
    "inmobiliaria Zona Norte",
    "casas en venta Zona Norte Buenos Aires",
    "Freire Propiedades",
    "FREIRE Negocios Inmobiliarios",
    "Del Viso inmobiliaria",
    "Manuel Alberti casas",
  ],
  authors: [{ name: "FREIRE Negocios Inmobiliarios" }],
  creator: "FREIRE Negocios Inmobiliarios",
  publisher: "FREIRE Negocios Inmobiliarios",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: BASE_URL,
    siteName: "Freire Propiedades",
    title: "Freire Propiedades | Inmobiliaria en Pilar y Zona Norte",
    description:
      "Inmobiliaria con certificación CRS internacional en Pilar y Zona Norte. Compra, venta, alquiler y tasaciones de propiedades.",
    images: [
      {
        url: "/logo-freire-azul.png",
        width: 240,
        height: 100,
        alt: "FREIRE Negocios Inmobiliarios",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Freire Propiedades | Inmobiliaria en Pilar y Zona Norte",
    description:
      "Compra, venta, alquiler y tasaciones en Pilar y Zona Norte. Certificación CRS internacional.",
    images: ["/logo-freire-azul.png"],
  },
  alternates: {
    canonical: BASE_URL,
  },
  category: "real estate",
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-AR"
      className={`${inter.variable} h-full antialiased`}
    >
      <head>
        <LocalBusinessSchema />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-surface text-on-surface selection:bg-primary/20">
        {/* ── Marketing Analytics (solo se renderizan si las env vars están configuradas) ── */}
        <MicrosoftClarity />
        <MetaPixel />
        <GoogleAnalytics />

        <PageLoader />
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

