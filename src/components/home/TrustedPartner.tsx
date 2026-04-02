"use client";
import Image from "next/image";
import { Clock, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function TrustedPartner() {
  return (
    <section className="py-20 md:py-28 bg-surface-lowest overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-primary/10 pb-12"
        >
          <div className="max-w-2xl">
            <span className="label-editorial mb-4 block underline decoration-secondary decoration-2 underline-offset-8">Respaldo Institucional</span>
            <h2 className="text-4xl md:text-6xl font-bold text-primary tracking-[-0.03em] leading-[1.05]">
              Tu Socio en el <br />
              <span className="text-secondary italic font-normal">Mercado Real</span>
            </h2>
          </div>
          <p className="text-lg text-on-surface-variant max-w-md font-sans leading-relaxed border-l-2 border-primary/20 pl-6 py-2">
            Trayectoria avalada por certificaciones internacionales y un equipo multidisciplinar que garantiza seguridad jurídica.
          </p>
        </motion.div>
        
        {/* Horizontal Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Item 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group flex flex-col justify-between bg-surface-container-low p-8 lg:p-10 h-full border border-primary/5 transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl hover:bg-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] group-hover:bg-secondary/10 transition-colors duration-700"></div>
            
            <div className="mb-6 lg:mb-8 relative z-10">
              <div className="flex-shrink-0 bg-white p-4 shadow-sm w-fit group-hover:shadow-md transition-shadow grayscale group-hover:grayscale-0">
                <Image
                  src="/crs-logo.png"
                  alt="CRS Certification"
                  width={70}
                  height={24}
                  className="h-8 w-auto object-contain"
                />
              </div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-3 uppercase tracking-widest leading-snug">Comunidad CRS</h3>
              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed font-sans">
                Otorgada por <span className="font-bold text-primary">NAR</span> (Asociación de Corredores de Estados Unidos), certificándonos como especialistas de alto rendimiento.
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-primary/10 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
               <span className="text-[10px] uppercase tracking-widest font-bold text-secondary">Certificación</span>
               <ArrowRight className="w-4 h-4 text-primary" />
            </div>
          </motion.div>
          
          {/* Item 2 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="group flex flex-col justify-between bg-surface-container-low p-8 lg:p-10 h-full border border-primary/5 transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl hover:bg-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] group-hover:bg-secondary/10 transition-colors duration-700"></div>
            
            <div className="mb-6 lg:mb-8 relative z-10">
              <div className="w-16 h-16 bg-surface-container flex items-center justify-center text-primary group-hover:text-secondary group-hover:bg-primary/5 transition-all duration-500">
                <Clock className="w-6 h-6 stroke-[1.5]" />
              </div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-3 uppercase tracking-widest leading-snug">Diez años de dedicación</h3>
              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed font-sans">
                Presencia constante en la comunidad, transformando la venta de propiedades en una gestión puramente técnica y transparente.
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-primary/10 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
               <span className="text-[10px] uppercase tracking-widest font-bold text-secondary">Experiencia</span>
               <ArrowRight className="w-4 h-4 text-primary" />
            </div>
          </motion.div>
          
          {/* Item 3 */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="group flex flex-col justify-between bg-surface-container-low p-8 lg:p-10 h-full border border-primary/5 transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl hover:bg-white relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] group-hover:bg-secondary/10 transition-colors duration-700"></div>
            
            <div className="mb-6 lg:mb-8 relative z-10">
              <div className="w-16 h-16 bg-surface-container flex items-center justify-center text-primary group-hover:text-secondary group-hover:bg-primary/5 transition-all duration-500">
                <Users className="w-6 h-6 stroke-[1.5]" />
              </div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-primary mb-3 uppercase tracking-widest leading-snug">Seguridad Operativa</h3>
              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed font-sans">
                Colaboración directa con gestores, abogados y escribanos matriculados para asegurar la <span className="font-bold text-primary">seguridad jurídica</span> de tu operación.
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-primary/10 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500">
               <span className="text-[10px] uppercase tracking-widest font-bold text-secondary">Respaldo Absoluto</span>
               <ArrowRight className="w-4 h-4 text-primary" />
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
