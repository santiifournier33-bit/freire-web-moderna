import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto | Freire Propiedades',
  description: 'Contáctese con Freire Propiedades para recibir asesoramiento personalizado. Estamos en Pilar, Zona Norte.',
  alternates: {
    canonical: 'https://www.freirepropiedades.com/contacto',
  },
};

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
