import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import ProcessSteps from "@/components/home/ProcessSteps";
import PropertyShowcase from "@/components/home/PropertyShowcase";
import TrustedPartner from "@/components/home/TrustedPartner";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import FeaturedPortals from "@/components/home/FeaturedPortals";
import Testimonials from "@/components/home/Testimonials";
import FAQ from "@/components/home/FAQ";
import LeadMagnetPromo from "@/components/home/LeadMagnetPromo";
import WhatsAppWidget from "@/components/ui/WhatsAppWidget";
import LeadMagnetPopup from "@/components/layout/LeadMagnetPopup";
import StickyCTA from "@/components/layout/StickyCTA";

export const metadata: Metadata = {
  title: "Venta y Alquiler de Propiedades en Pilar | Freire Propiedades",
  description: "Encuentre su hogar ideal en Pilar y Zona Norte. Expertos en tasaciones y corretaje inmobiliario con certificación internacional CRS. Más de 20 años en el mercado.",
};

export default function Home() {
  return (
    <div className="flex flex-col w-full -mt-24">
      {/* -mt-24 makes the hero go under the transparent fixed navbar */}
      <Hero />
      <ProcessSteps />
      <PropertyShowcase />
      <LeadMagnetPromo />
      <TrustedPartner />
      <WhyChooseUs />
      <FeaturedPortals />
      <Testimonials />
      <FAQ />

      {/* Floating WhatsApp Widget */}
      <WhatsAppWidget />

      {/* Sticky CTA bar — mobile only */}
      <StickyCTA />

      {/* Lead Magnet Popup — exit-intent (desktop) + scroll 30% (all) */}
      <LeadMagnetPopup />
    </div>
  );
}
