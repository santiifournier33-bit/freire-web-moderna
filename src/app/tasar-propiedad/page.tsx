import type { Metadata } from "next";
import TasarPropiedadClient from "./TasarPropiedadClient";

export const metadata: Metadata = {
  title: "Tasa tu Propiedad en Pilar | Valor Real y Profesional | Freire",
  description: "Obtenga el valor real de su propiedad con nuestro servicio de tasación profesional en Pilar. Análisis de mercado avanzado para vender rápido y al mejor precio.",
  alternates: {
    canonical: "https://www.freirepropiedades.com/tasar-propiedad",
  },
};

export default function TasarPropiedadPage() {
  return <TasarPropiedadClient />;
}
