import Image from "next/image";

export default function FeaturedPortals() {
  const logos = [
    { name: "Zona Prop", src: "/zona-Photoroom.png" },
    { name: "Mercado Libre", src: "/mercado-libre-logo.png" },
    { name: "Argenprop", src: "/white-Photoroom.png" },
  ];

  return (
    <section className="py-32 bg-surface-container-low">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <span className="label-editorial mb-4 block">Máxima visibilidad</span>
          <h2 className="text-2xl md:text-4xl font-bold text-primary mb-4 tracking-[-0.02em]">
            Presencia en <span className="text-secondary italic font-normal">Plataformas Líderes</span>
          </h2>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-16 md:gap-32">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="relative h-12 md:h-16 w-32 md:w-48 opacity-40 hover:opacity-100 transition-all duration-700 filter grayscale hover:grayscale-0 hover:scale-110"
            >
              <Image
                src={logo.src}
                alt={logo.name}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
