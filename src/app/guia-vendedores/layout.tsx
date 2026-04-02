import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guía para Vendedores | Freire Propiedades',
  description: 'Descargue gratis la guía técnica y aprenda los secretos y requisitos para concretar la venta de su propiedad.',
  alternates: {
    canonical: 'https://www.freirepropiedades.com/guia-vendedores',
  },
};

export default function GuiaVendedoresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
