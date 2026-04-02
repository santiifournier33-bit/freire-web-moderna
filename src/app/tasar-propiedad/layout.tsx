import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tasar una Propiedad | Freire Propiedades',
  description: 'Solicite una tasación profesional de su inmueble. Nuestro servicio técnico asegura el valor de mercado óptimo.',
  alternates: {
    canonical: 'https://www.freirepropiedades.com/tasar-propiedad',
  },
};

export default function TasarPropiedadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
