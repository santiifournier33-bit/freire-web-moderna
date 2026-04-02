"use client";

import { useState } from "react";
import { User, Mail, Phone, MessageSquare, Send, CheckCircle } from "lucide-react";
import { createWebContact } from "@/lib/tokkobroker";
import dynamic from "next/dynamic";
import "intl-tel-input/styles";
import validator from "validator";

const IntlTelInput = dynamic(() => import("intl-tel-input/reactWithUtils"), {
  ssr: false,
});
import { parsePhoneNumberFromString } from "libphonenumber-js";

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [emailError, setEmailError] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const isValidEmail = formData.email ? validator.isEmail(formData.email) : false;
  const isFormValid = formData.name && isValidEmail && isPhoneValid && formData.message;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (name === "email") {
      if (value && !validator.isEmail(value)) {
        setEmailError("El formato del correo es inválido.");
      } else {
        setEmailError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setStatus("loading");
    
    const success = await createWebContact({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      text: formData.message,
      tags: ["web", "contacto"],
    });

    if (success) {
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
      setEmailError("");
      setIsPhoneValid(false);
    } else {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col min-h-screen pt-40 pb-32 bg-surface items-center justify-center text-center px-6">
        <div className="bg-surface-container-lowest p-16 shadow-ambient max-w-xl">
          <div className="w-20 h-20 bg-surface-container flex items-center justify-center mx-auto mb-10">
            <CheckCircle className="w-10 h-10 text-secondary" strokeWidth={1} />
          </div>
          <span className="label-editorial text-secondary mb-4 block uppercase tracking-[0.2em]">Canal Directo</span>
          <h2 className="text-4xl md:text-5xl font-bold text-primary tracking-tight mb-6 italic font-normal">Mensaje Enviado</h2>
          <p className="text-lg text-on-surface-variant mb-12 font-sans leading-relaxed">
            Su consulta ha sido derivada a un profesional de nuestra firma. Nos pondremos en contacto a la brevedad para brindarle el asesoramiento técnico solicitado.
          </p>
          <button 
            onClick={() => setStatus("idle")}
            className="btn-secondary !bg-primary !text-white px-10 py-5 text-sm uppercase tracking-widest font-bold shadow-ambient w-full"
          >
            Nueva Consulta
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 pt-40 pb-32 bg-surface">
      <div className="container mx-auto px-6 max-w-5xl">
        
        {/* Editorial Header */}
        <div className="mb-24 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12">
          <div className="max-w-2xl text-left">
            <span className="label-editorial mb-4 block underline decoration-secondary decoration-2 underline-offset-8 uppercase tracking-[0.2em] w-fit">Atención Preferencial</span>
            <h1 className="text-5xl md:text-7xl font-bold text-primary tracking-[-0.04em] leading-[0.95]">
              Hablemos de <br />
              <span className="text-secondary italic font-normal">tu futuro</span>
            </h1>
          </div>
          <p className="text-xl text-on-surface-variant max-w-md font-sans leading-relaxed italic border-l-2 border-secondary/50 pl-6 py-2">
            "La comunicación es la base de toda transacción técnica. Estamos aquí para simplificar el proceso."
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">
          
          {/* Contact Info (Architectural Sidebar) */}
          <div className="space-y-16">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-primary/40 block border-b border-primary/10 pb-4">Oficina Central</span>
              <div className="space-y-4">
                <p className="text-2xl font-bold text-primary tracking-tight">Edificio STUDIOS Work&Live</p>
                <p className="text-base text-on-surface-variant font-sans leading-relaxed">
                  Las Amapolas 475, Manuel Alberti <br />
                  Pilar, Provincia de Buenos Aires
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-primary/40 block border-b border-primary/10 pb-4">Atención Digital</span>
              <div className="space-y-4 flex flex-col items-start gap-4">
                <a href="mailto:contacto@freirepropiedades.com" className="text-lg font-bold text-primary hover:text-secondary transition-colors">contacto@freirepropiedades.com</a>
                <a href="tel:+5491151454915" className="text-lg font-bold text-primary hover:text-secondary transition-colors">+54 9 11 5145-4915</a>
              </div>
            </div>
          </div>

          {/* Form Container: The Transparent Form Style */}
          <div className="bg-surface-container-lowest border border-primary/10 p-12 md:p-16 shadow-lg shadow-primary/10 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-primary/50 mb-10 block">Formulario de Enlace</span>
            
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="group">
                <label className="text-xs font-bold uppercase tracking-[0.1em] mb-3 block text-primary/60">Nombre Completo</label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full py-3 bg-surface-container-low border-b-2 border-primary/15 focus:border-secondary focus:outline-none transition-all placeholder:text-primary/30 text-base font-semibold rounded-t-md"
                    placeholder="Escriba aquí..."
                    required
                    disabled={status === "loading"}
                  />
                </div>
              </div>

              <div className="group">
                <label className="text-xs font-bold uppercase tracking-[0.1em] mb-3 block text-primary/60">Correo Electrónico</label>
                <div className="relative flex flex-col">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full py-3 bg-surface-container-low border-b-2 border-primary/15 focus:border-secondary focus:outline-none transition-all placeholder:text-primary/30 text-base font-semibold rounded-t-md"
                    placeholder="usuario@dominio.com"
                    required
                    disabled={status === "loading"}
                  />
                  {emailError && (
                    <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-2">{emailError}</span>
                  )}
                </div>
              </div>

              <div className="group">
                <label className="text-xs font-bold uppercase tracking-[0.1em] mb-3 block text-primary/60">Teléfono / Celular</label>
                <div className="relative">
                  <IntlTelInput
                    initialValue={formData.phone}
                    onChangeNumber={(number) => {
                      setFormData((prev) => ({ ...prev, phone: number }));
                      const parsed = parsePhoneNumberFromString(number);
                      setIsPhoneValid(parsed ? parsed.isValid() : false);
                    }}
                    initOptions={{
                      initialCountry: "ar",
                      nationalMode: false,
                      autoPlaceholder: "polite",
                      dropdownContainer: typeof document !== "undefined" ? document.body : null,
                    }}
                    inputProps={{
                      name: "phone",
                      className: `w-full py-3 bg-surface-container-low border-b-2 transition-all placeholder:text-primary/30 text-base font-semibold rounded-t-md focus:outline-none ${
                        formData.phone && !isPhoneValid ? "border-red-500/50" : "border-primary/15 focus:border-secondary"
                      }`,
                      placeholder: "+54 9 11 ...",
                      required: true,
                      disabled: status === "loading",
                    }}
                  />
                  {formData.phone && !isPhoneValid && (
                    <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-2 block">Número inválido o incompleto</span>
                  )}
                </div>
              </div>

              <div className="group">
                <label className="text-xs font-bold uppercase tracking-[0.1em] mb-3 block text-primary/60">Mensaje o Consulta Técnica</label>
                <div className="relative">
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full py-3 bg-surface-container-low border-b-2 border-primary/15 focus:border-secondary focus:outline-none transition-all placeholder:text-primary/30 text-base font-semibold resize-none rounded-t-md"
                    placeholder="Díganos cómo podemos ayudarle..."
                    required
                    disabled={status === "loading"}
                  />
                </div>
              </div>

              {status === "error" && (
                <p className="text-[10px] text-red-500 uppercase tracking-widest font-bold mb-6 text-center">Error en el envío. Reintente.</p>
              )}

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={!isFormValid || status === "loading"}
                  className={`btn-secondary w-full !bg-primary !text-white !border-none py-5 shadow-ambient uppercase tracking-widest font-bold text-[10px] transition-all duration-700 ${
                    isFormValid && status !== "loading"
                    ? "opacity-100" 
                    : "opacity-30 cursor-not-allowed grayscale"
                  }`}
                >
                  {status === "loading" ? "Procesando Mensaje..." : "Enviar Consulta Directa"}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
