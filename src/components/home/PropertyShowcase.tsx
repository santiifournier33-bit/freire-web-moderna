import Image from "next/image";
import { Play, Eye, Maximize } from "lucide-react";
import Link from "next/link";

export default function PropertyShowcase() {
  const items = [
    {
      title: "Tour 360°",
      copy: "Revisar la propiedad sin límites. Optimiza tiempo y atrae interesados reales directamente.",
      href: "https://kuula.co/share/collection/7FgPs",
      image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      Icon: Eye,
    },
    {
      title: "Video Inmersivo",
      copy: "Conexión emocional instantánea aumentando su visibilidad y acelerando la captación.",
      href: "https://www.youtube.com/watch?v=PuqHzGWjUXk",
      image: "https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
      Icon: Play,
    },
    {
      title: "Fotografía Pro",
      copy: "La primera impresión perfecta. Clave fundamental para el interés inicial del comprador.",
      href: null,
      image: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/vLeAYUiyvUMIhRMyjWtd/media/6800f7978ceb991b16c4ceae.jpeg",
      Icon: null,
    },
    {
      title: "Plano Comercial",
      copy: "Visualización clara de distribución para proyectar la vida real en el nuevo espacio.",
      href: null,
      image: "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/vLeAYUiyvUMIhRMyjWtd/media/6800f7e351be4a1040119071.jpeg",
      Icon: null,
    },
  ];

  return (
    <section className="py-20 md:py-28 bg-surface-container-low overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-primary/10 pb-12">
          <div className="max-w-2xl">
            <span className="label-editorial mb-4 block underline decoration-secondary decoration-2 underline-offset-8">Excelencia Visual</span>
            <h2 className="text-4xl md:text-6xl font-bold text-primary tracking-[-0.03em] leading-[1.05]">
              Así se proyectará <br />
              <span className="text-secondary italic font-normal">tu propiedad</span>
            </h2>
          </div>
          <p className="text-sm md:text-base text-on-surface-variant max-w-md font-sans leading-relaxed border-l-2 border-primary/20 pl-6 py-2">
            Utilizamos tecnología de vanguardia y un ojo arquitectónico para que cada rincón cuente una historia de valor y exclusividad.
          </p>
        </div>

        {/* Minimalist Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {items.map((item, index) => (
            <div key={index} className="group relative bg-surface-lowest h-full border border-primary/5 transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl hover:border-transparent flex flex-col">
              
              {/* Image Container with Hover Overlay */}
              <div className="relative h-[220px] w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-1000 ease-in-out group-hover:scale-[1.15]"
                />
                <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/40 transition-colors duration-500 mix-blend-multiply"></div>
                
                {item.href && item.Icon && (
                  <Link href={item.href} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 scale-95 group-hover:scale-100">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                      <item.Icon className="w-6 h-6 text-white ml-0.5" />
                    </div>
                  </Link>
                )}
                {!item.href && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-10 scale-95 group-hover:scale-100">
                    <Maximize className="w-8 h-8 text-white/70" />
                  </div>
                )}
              </div>
              
              {/* Text Area */}
              <div className="p-8 flex-1 flex flex-col justify-start bg-white relative">
                 {/* Top subtle line */}
                 <div className="absolute top-0 left-0 w-0 h-[2px] bg-secondary group-hover:w-full transition-all duration-700 ease-out"></div>
                 
                 <h3 className="text-xs font-bold text-primary mb-3 uppercase tracking-widest leading-relaxed">
                   {item.title}
                 </h3>
                 <p className="text-on-surface-variant font-sans text-sm leading-relaxed">
                   {item.copy}
                 </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
