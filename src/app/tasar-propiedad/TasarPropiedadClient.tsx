"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, MapPin, Building, Home, CheckCircle, ChevronDown } from "lucide-react";
import { createWebContact } from "@/lib/tokkobroker";
import dynamic from "next/dynamic";
import "intl-tel-input/styles";
import validator from "validator";

const IntlTelInput = dynamic(() => import("intl-tel-input/reactWithUtils"), {
  ssr: false,
});
import { parsePhoneNumberFromString } from "libphonenumber-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TasarPropiedadPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Contact
    name: "",
    email: "",
    phone: "",
    // Step 2: Property
    address: "",
    locality: "",
    floor: "",
    apartment: "",
    operationType: "",
    propertyType: "",
    comments: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [emailError, setEmailError] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const operationTypes = ["Venta", "Alquiler", "Venta y Alquiler"];
  const propertyTypes = ["Casa", "Departamento", "Terreno / Lote", "Local Comercial", "Otro"];

  const isValidEmail = formData.email ? validator.isEmail(formData.email) : false;
  const step1Valid = formData.name && isValidEmail && isPhoneValid;
  const step2Valid = formData.address && formData.locality && formData.operationType && formData.propertyType;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleNext = () => setStep(2);
  const handlePrev = () => setStep(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!step2Valid) return;
    
    setStatus("loading");
    const eventId = crypto.randomUUID();

    const textData = `
Operación: ${formData.operationType}
Tipo de Propiedad: ${formData.propertyType}
Dirección: ${formData.address}
Localidad: ${formData.locality}
Piso/Depto: ${formData.floor || "-"} / ${formData.apartment || "-"}
Comentarios extras: ${formData.comments || "Ninguno"}
    `.trim();

    // Capture form data into local variables before any state mutations
    const leadName = formData.name;
    const leadEmail = formData.email;
    const leadPhone = formData.phone;

    const success = await createWebContact({
      name: leadName,
      email: leadEmail,
      phone: leadPhone,
      text: textData,
      tags: ["web", "tasacion", "vendedor"],
    });

    // Sync to Brevo independently — runs regardless of Tokko result
    // Awaited to prevent the browser from cancelling the request on re-render
    try {
      const brevoRes = await fetch("/api/brevo-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadName,
          email: leadEmail,
          phone: leadPhone,
          source: "tasacion",
          eventId,
        }),
      });
      if (!brevoRes.ok) {
        const errText = await brevoRes.text();
        console.error("[Brevo] Tasacion sync failed:", brevoRes.status, errText);
      }
    } catch (brevoErr) {
      console.error("[Brevo] Tasacion network error:", brevoErr);
    }

    if (success) {
      // Conversion events (browser-side)
      if (typeof fbq !== "undefined") fbq("track", "Lead", {}, { eventID: eventId });
      if (typeof gtag !== "undefined") gtag("event", "generate_lead", { event_category: "tasacion" });

      window.scrollTo({ top: 0, behavior: "smooth" });
      setStatus("success");
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
          <span className="label-editorial text-secondary mb-4 block uppercase tracking-[0.2em]">Gestión Iniciada</span>
          <h2 className="text-4xl md:text-5xl font-bold text-primary tracking-tight mb-6 italic font-normal">Solicitud Recibida</h2>
          <p className="text-lg text-on-surface-variant mb-12 font-sans leading-relaxed">
            Hemos procesado los datos de su propiedad con éxito. Un especialista de nuestro equipo técnico se comunicará con usted en el transcurso de las próximas 24 horas hábiles.
          </p>
          <button 
            onClick={() => {
              setStatus("idle");
              setStep(1);
              setFormData({name: "", email: "", phone: "", address: "", locality: "", floor: "", apartment: "", operationType: "", propertyType: "", comments: ""});
            }}
            className="btn-secondary !bg-primary !text-white px-10 py-5 text-sm uppercase tracking-widest font-bold shadow-ambient w-full"
          >
            Nueva Tasación
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 pt-40 pb-32 bg-surface">
      <div className="container mx-auto px-6 max-w-4xl">
        
        {/* Editorial Header */}
        <div className="mb-24 flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12">
          <div className="max-w-2xl text-left">
            <span className="label-editorial mb-4 block underline decoration-secondary decoration-2 underline-offset-8 uppercase tracking-[0.2em] w-fit">Servicio Técnico</span>
            <h1 className="text-5xl md:text-7xl font-bold text-primary tracking-[-0.04em] leading-[0.95]">
              Tasación <br />
              <span className="text-secondary italic font-normal">Profesional</span>
            </h1>
          </div>
          <p className="text-xl text-on-surface-variant max-w-md font-sans leading-relaxed italic border-l-2 border-secondary/50 pl-6 py-2">
            "Definir el valor de mercado con precisión es el primer paso crítico para una operación exitosa."
          </p>
        </div>

        <div className="bg-surface-container-lowest border border-primary/10 shadow-lg shadow-primary/10 relative overflow-hidden rounded-xl">
          
          {/* Progress Indication (Architectural Minimalist) */}
          <div className="h-1 w-full bg-surface-dim">
            <div 
              className="h-full bg-secondary transition-all duration-700 ease-standard"
              style={{ width: step === 1 ? '50%' : '100%' }}
            />
          </div>

          <form onSubmit={handleSubmit} className="p-12 md:p-20">
            
            {/* Step 1: Contact (Transparent Form Concept) */}
            <div className={`transition-all duration-700 ease-standard ${step === 1 ? "opacity-100 block translate-y-0" : "opacity-0 hidden translate-y-10"}`}>
              <span className="text-sm font-bold text-primary/50 mb-8 block uppercase tracking-[0.15em]">Paso 01 — Datos Personales</span>
              
              <div className="space-y-12">
                <div className="group">
                  <label className="text-xs font-bold uppercase tracking-[0.1em] mb-3 block text-primary/60">Nombre Completo</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full py-4 bg-surface-container-low border-b-2 border-primary/15 focus:border-secondary focus:outline-none transition-all placeholder:text-primary/30 text-base font-semibold rounded-t-md"
                    placeholder="Escriba aquí..."
                    required={step === 1}
                  />
                </div>
                
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="group">
                    <label className="text-xs font-bold uppercase tracking-[0.1em] mb-3 block text-primary/60">Correo Electrónico</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full py-4 bg-surface-container-low border-b-2 border-primary/15 focus:border-secondary focus:outline-none transition-all placeholder:text-primary/30 text-base font-semibold rounded-t-md"
                      placeholder="usuario@dominio.com"
                      required={step === 1}
                    />
                    {emailError && (
                      <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-2">{emailError}</span>
                    )}
                  </div>
                  <div className="group">
                    <label className="text-xs font-bold uppercase tracking-[0.1em] mb-3 block text-primary/60">Teléfono / WhatsApp</label>
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
                        className: `w-full py-4 bg-surface-container-low border-b-2 transition-all placeholder:text-primary/30 text-base font-semibold rounded-t-md focus:outline-none ${
                          formData.phone && !isPhoneValid ? "border-red-500/50" : "border-primary/15 focus:border-secondary"
                        }`,
                        placeholder: "+54 9 11 ...",
                        required: step === 1,
                      }}
                    />
                    {formData.phone && !isPhoneValid && (
                      <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-2 block">Número inválido o incompleto</span>
                    )}
                  </div>
                </div>
                
                <div className="pt-12 flex justify-center">
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!step1Valid}
                    className={`btn-secondary h-16 w-full px-12 uppercase tracking-widest font-bold text-xs shadow-ambient transition-all duration-700 ${
                      step1Valid 
                      ? "!bg-primary !text-white !border-none" 
                      : "opacity-30 cursor-not-allowed grayscale"
                    }`}
                  >
                    Continuar al paso 02
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: Property (Transparent Form Concept) */}
            <div className={`transition-all duration-700 ease-standard ${step === 2 ? "opacity-100 block translate-y-0" : "opacity-0 hidden translate-y-10"}`}>
              <button 
                type="button" 
                onClick={handlePrev}
                className="flex items-center text-primary/30 hover:text-secondary transition-all text-[10px] uppercase tracking-widest font-bold mb-10 group"
              >
                <ChevronLeft size={14} className="mr-2 group-hover:-translate-x-2 transition-transform duration-500" />
                Regresar
              </button>
              
              <span className="text-sm font-bold text-primary/50 mb-8 block uppercase tracking-[0.15em]">Paso 02 — Detalles de la Propiedad</span>
              
              <div className="space-y-12">
                <div className="group">
                  <label className="text-xs font-bold uppercase tracking-[0.1em] mb-3 block text-primary/60">Dirección Exacta</label>
                  <div className="relative">
                    <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/20 pointer-events-none" />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full pl-8 py-4 bg-surface-container-low border-b-2 border-primary/15 focus:border-secondary focus:outline-none transition-all placeholder:text-primary/30 text-base font-semibold rounded-t-md"
                      placeholder="Calle y numeración..."
                      required={step === 2}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-[1fr_80px_80px] gap-12">
                  <div className="group">
                    <label className="text-xs font-bold uppercase tracking-[0.1em] mb-3 block text-primary/60">Localidad / Barrio</label>
                    <input
                      type="text"
                      name="locality"
                      value={formData.locality}
                      onChange={handleChange}
                      className="w-full py-4 bg-surface-container-low border-b-2 border-primary/15 focus:border-secondary focus:outline-none transition-all placeholder:text-primary/30 text-base font-semibold rounded-t-md"
                      placeholder="Ej. Pilar del Este"
                      required={step === 2}
                    />
                  </div>
                  <div className="group text-center">
                    <label className="text-xs font-bold uppercase tracking-[0.1em] mb-3 block text-primary/60">Piso</label>
                    <input
                      type="text"
                      name="floor"
                      value={formData.floor}
                      onChange={handleChange}
                      className="w-full py-4 bg-surface-container-low border-b-2 border-primary/15 focus:border-secondary focus:outline-none transition-all placeholder:text-primary/30 text-base font-semibold text-center rounded-t-md"
                      placeholder="-"
                    />
                  </div>
                  <div className="group text-center">
                    <label className="text-xs font-bold uppercase tracking-[0.1em] mb-3 block text-primary/60">Depto</label>
                    <input
                      type="text"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleChange}
                      className="w-full py-4 bg-surface-container-low border-b-2 border-primary/15 focus:border-secondary focus:outline-none transition-all placeholder:text-primary/30 text-base font-semibold text-center rounded-t-md"
                      placeholder="-"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                  <div className="group">
                    <label className="text-xs font-bold uppercase tracking-[0.1em] mb-3 block text-primary/60">Tipo de Operación</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="w-full py-4 bg-surface-container-low border-b-2 border-primary/15 focus:border-secondary focus:outline-none transition-all cursor-pointer text-base font-semibold text-primary/70 rounded-t-md text-left flex items-center justify-between outline-none">
                        <span>{formData.operationType || "Seleccionar..."}</span>
                        <ChevronDown className="w-4 h-4 text-primary/40 group-data-[state=open]:rotate-180 transition-transform" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {operationTypes.map((op) => (
                          <DropdownMenuItem
                            key={op}
                            onClick={() => setFormData((prev) => ({ ...prev, operationType: op }))}
                          >
                            {op}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="group">
                    <label className="text-xs font-bold uppercase tracking-[0.1em] mb-3 block text-primary/60">Tipología</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="w-full py-4 bg-surface-container-low border-b-2 border-primary/15 focus:border-secondary focus:outline-none transition-all cursor-pointer text-base font-semibold text-primary/70 rounded-t-md text-left flex items-center justify-between outline-none">
                        <span>{formData.propertyType || "Seleccionar..."}</span>
                        <ChevronDown className="w-4 h-4 text-primary/40 group-data-[state=open]:rotate-180 transition-transform" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {propertyTypes.map((pt) => (
                          <DropdownMenuItem
                            key={pt}
                            onClick={() => setFormData((prev) => ({ ...prev, propertyType: pt }))}
                          >
                            {pt}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="group">
                  <label className="text-xs font-bold uppercase tracking-[0.1em] mb-3 block text-primary/60">Memorándum / Comentarios Adicionales</label>
                  <textarea
                    name="comments"
                    value={formData.comments}
                    onChange={handleChange}
                    rows={4}
                    className="w-full py-4 bg-surface-container-low border-b-2 border-primary/15 focus:border-secondary focus:outline-none transition-all placeholder:text-primary/30 text-base font-semibold resize-none rounded-t-md"
                    placeholder="Describa ambientes, estado general o detalles de interés..."
                  />
                </div>

                <div className="pt-12 flex flex-col items-center gap-4">
                  <p className="text-xs text-primary/50 flex items-center gap-1.5">
                    <span>🔒</span> Tu información es 100% confidencial
                  </p>
                  {status === "error" && (
                    <p className="text-[10px] text-red-500 uppercase tracking-widest font-bold">Error en el servidor. Reintente.</p>
                  )}
                  <button
                    type="submit"
                    disabled={!step2Valid || status === "loading"}
                    className={`h-16 w-full px-16 uppercase tracking-widest font-bold text-sm shadow-ambient transition-all duration-700 rounded-lg ${
                      step2Valid && status !== "loading"
                      ? "bg-primary text-white hover:bg-primary/90" 
                      : "bg-primary/20 text-primary/30 cursor-not-allowed"
                    }`}
                  >
                    {status === "loading" ? "Procesando Datos..." : "Finalizar y Solicitar Tasación"}
                  </button>
                </div>
              </div>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
