"use client";

import { useState } from "react";
import Image from "next/image";
import { Download, CheckCircle, ShieldCheck } from "lucide-react";
import validator from "validator";
import { InfiniteGrid } from "@/components/ui/infinite-grid";

export default function GuiaVendedoresPage() {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [emailError, setEmailError] = useState("");
  
  const isValidEmail = formData.email ? validator.isEmail(formData.email) : false;
  const isFormValid = formData.name && isValidEmail;

  const kitItems = [
    "Documentación requerida para la venta",
    "Gastos a la hora de vender",
    "Qué variables debes acordar con el comprador de tu propiedad",
    "¿Qué es el Home Staging? Tips y consejos.",
    "Factores controlables (y no) para la venta.",
    "Cómo fijar el valor de publicación correcto, y mucho más..",
  ];

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({ ...formData, email: value });
    if (value && !validator.isEmail(value)) {
      setEmailError("El formato del correo es inválido.");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setStatus("loading");
    const eventId = crypto.randomUUID();

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, source: "Guia Vendedores", eventId }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Error en la solicitud");
      }
      
      // Conversion events (browser-side)
      if (typeof fbq !== "undefined") fbq("track", "Lead", {}, { eventID: eventId });
      if (typeof gtag !== "undefined") gtag("event", "generate_lead", { event_category: "guia-vendedores" });

      setStatus("success");
      setFormData({ name: "", email: "" });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error("Error submitting lead:", error.message);
      setStatus("error");
      setEmailError(error.message); // Muestra el mensaje exacto
      setTimeout(() => setStatus("idle"), 5000); 
    }
  };

  if (status === "success") {
    return (
      <InfiniteGrid className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <div className="bg-white p-12 md:p-16 shadow-2xl max-w-xl w-full rounded-2xl relative z-10 mx-auto">
          <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-10 text-primary">
            <Download className="w-10 h-10" strokeWidth={1} />
          </div>
          <span className="label-editorial text-secondary mb-4 block uppercase tracking-[0.2em] font-bold">Acceso Concedido</span>
          <h2 className="text-4xl md:text-5xl font-bold text-primary tracking-tight mb-6 italic font-normal">Kit en camino</h2>
          <p className="text-lg text-on-surface-variant mb-12 font-sans leading-relaxed">
            Hemos enviado el material exclusivo a su casilla de correo. El proceso de capacitación técnica para su próxima venta ha comenzado.
          </p>
          <a
            href="/"
            className="btn-secondary !bg-primary !text-white px-10 py-5 text-sm uppercase tracking-widest font-bold shadow-ambient block w-full"
          >
            Regresar al Inicio
          </a>
        </div>
      </InfiniteGrid>
    );
  }

  return (
    <InfiniteGrid className="flex flex-col flex-1 pt-32 pb-32 md:pt-40 md:pb-40 overflow-hidden">
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        
        {/* Superior headers - Forced Contrast on Light Background */}
        <div className="mb-16 md:mb-24 flex flex-col items-center text-center max-w-4xl mx-auto">
          <span className="text-secondary uppercase tracking-[0.3em] font-extrabold block mb-4 drop-shadow-sm text-[11px] md:text-sm">
            Recurso Exclusivo
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary tracking-[-0.04em] leading-[0.95] mb-8">
            Guía para <span className="text-secondary italic font-normal">Vendedores</span>
          </h1>
          <p className="text-lg md:text-2xl text-on-surface-variant font-sans leading-relaxed font-medium max-w-3xl">
            "La diferencia entre una venta común y una operación extraordinaria radica en la preparación técnica del propietario."
          </p>
        </div>

        {/* Stretch Container for Symmetry */}
        <div className="grid lg:grid-cols-2 gap-10 items-stretch">
          
          {/* Left Column: Compendio Técnico (Now Qué incluye?) */}
          <div className="bg-[#0b254d] backdrop-blur-md border border-white/10 shadow-ambient p-10 md:p-14 rounded-2xl flex flex-col h-full transform hover:scale-[1.01] transition-transform duration-500">
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-12 block tracking-tight">¿Qué incluye?</h3>
            <ul className="space-y-8 flex-1 flex flex-col justify-center">
              {kitItems.map((item, index) => (
                <li key={index} className="flex items-start gap-5 group">
                  <div className="w-1.5 h-1.5 shrink-0 bg-secondary rounded-full mt-2 group-hover:scale-150 transition-transform shadow-sm shadow-secondary"></div>
                  <span className="text-base md:text-lg font-semibold text-white/90 leading-snug group-hover:text-white transition-colors tracking-tight">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Form Widget */}
          <div className="bg-white p-10 md:p-14 shadow-ambient rounded-2xl flex flex-col h-full border border-primary/5 transform hover:scale-[1.01] transition-transform duration-500">
             <div className="space-y-6 mb-12">
               <h2 className="text-3xl md:text-5xl font-bold text-primary tracking-tight">Obtén tu Guía gratis</h2>
               <p className="text-sm md:text-lg text-on-surface-variant font-sans leading-relaxed">
                 Complete los campos para autorizar el envío del material digital.
               </p>
             </div>
             
             <form onSubmit={handleSubmit} className="flex flex-col flex-1 justify-between gap-8">
               <div className="space-y-8">
                 <div className="group">
                   <label className="label-editorial mb-3 block text-primary/60 font-bold uppercase tracking-widest text-[10px]">Nombre Identificatorio</label>
                   <input
                     type="text"
                     value={formData.name}
                     onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                     required
                     disabled={status === "loading"}
                     placeholder="Escriba aquí..."
                     className="w-full py-4 bg-transparent border-b border-primary/15 focus:border-secondary focus:outline-none transition-all placeholder:text-primary/10 text-base font-semibold text-primary"
                   />
                 </div>
                 
                 <div className="group">
                   <label className="label-editorial mb-3 block text-primary/60 font-bold uppercase tracking-widest text-[10px]">Dirección Electrónica</label>
                   <div className="flex flex-col">
                     <input
                       type="email"
                       value={formData.email}
                       onChange={handleEmailChange}
                       required
                       disabled={status === "loading"}
                       placeholder="usuario@dominio.com"
                       className="w-full py-4 bg-transparent border-b border-primary/15 focus:border-secondary focus:outline-none transition-all placeholder:text-primary/10 text-base font-semibold text-primary"
                     />
                     {emailError && (
                       <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-2 block">{emailError}</span>
                     )}
                   </div>
                 </div>
               </div>

               <div className="space-y-6 mt-8">
                 {status === "error" && (
                   <p className="text-[10px] text-red-500 uppercase tracking-widest font-bold text-center">Falla en la sincronización. Reintente.</p>
                 )}
                 
                 <button
                   type="submit"
                   disabled={status === "loading" || !isFormValid}
                   className={`btn-secondary w-full py-6 shadow-2xl hover:shadow-blue-500/20 uppercase tracking-widest font-extrabold text-[13px] transition-all hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 ${isFormValid ? '!bg-primary text-white !border-none hover:bg-primary/90' : 'bg-primary/10 text-primary/40 cursor-not-allowed border border-primary/20'}`}
                 >
                   {status === "loading" ? "Validando Protocolo..." : "Descargar Kit Inmobiliario"}
                 </button>
                 
                 <div className="flex items-center justify-center gap-3 text-primary/30">
                   <ShieldCheck size={16} />
                   <span className="text-[10px] uppercase tracking-widest font-bold">Transferencia Segura SSL</span>
                 </div>
               </div>
             </form>
          </div>

        </div>
      </div>
    </InfiniteGrid>
  );
}
