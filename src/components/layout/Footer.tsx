import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

const socialLinks = [
  { icon: FaFacebook, label: 'Facebook', href: '#' },
  { icon: FaInstagram, label: 'Instagram', href: '#' },
  { icon: FaLinkedin, label: 'LinkedIn', href: '#' },
];

const quickLinks = [
  { text: 'Inicio', href: '/' },
  { text: 'Propiedades', href: '/propiedades' },
  { text: 'Quiero tasar mi casa', href: '/tasar-propiedad' },
  { text: 'Contacto', href: '/contacto' },
];

const contactInfo = [
  { icon: Phone, text: '+54 9 11 5145-4915' },
  { icon: Mail, text: 'contacto@freirepropiedades.com' },
  { icon: MapPin, text: 'Edificio STUDIOS Work&Live, Las Amapolas 475, Manuel Alberti, Pilar, Provincia de Buenos Aires', isAddress: true },
];

export default function Footer() {
  return (
    <footer className="bg-primary bg-gradient-to-t from-[#061224] to-primary text-white relative w-full overflow-hidden pt-16 mt-auto">
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Company Info */}
          <div>
            <div className="mb-8">
              <Image
                src="/logo-blanco-oficial.png"
                alt="Freire Propiedades"
                width={420}
                height={180}
                className="h-40 w-auto object-contain"
              />
            </div>
            <p className="max-w-md leading-relaxed text-white font-sans text-sm">
              Nos enorgullecemos de ser tu socio de confianza y ayudarte a alcanzar tus objetivos inmobiliarios en Pilar y Zona Norte.
              <br /><br />
              <span className="font-bold text-white text-[10px] uppercase tracking-widest">Matrícula CMCPSI 6142</span>
            </p>
            <div className="flex gap-6 mt-8">
              {socialLinks.map((social) => (
                <a key={social.label} href={social.href} className="text-white hover:text-secondary transition-all duration-300 transform hover:-translate-y-1">
                  <span className="sr-only">{social.label}</span>
                  <social.icon size={22} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2">
            {/* Quick Links */}
            <div className="text-left">
              <h3 className="label-editorial text-secondary mb-6 opacity-80">Navegación</h3>
              <ul className="space-y-4">
                {quickLinks.map(({ text, href }) => (
                  <li key={text}>
                    <Link
                      href={href}
                      className="text-white/80 hover:text-white transition-all duration-300 text-sm font-semibold uppercase tracking-[0.1em]"
                    >
                      {text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="text-left">
              <h3 className="label-editorial text-secondary mb-6 opacity-80">Contacto</h3>
              <ul className="space-y-6">
                {contactInfo.map(({ icon: Icon, text, isAddress }, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <Icon className="text-secondary size-5 shrink-0 mt-0.5" />
                    {isAddress ? (
                      <address className="text-white/70 not-italic leading-relaxed text-sm max-w-[280px]">
                        {text}
                      </address>
                    ) : (
                      <span className="text-white font-semibold text-sm">
                        {text}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[11px] font-medium text-white/40 uppercase tracking-widest text-center">
            © {new Date().getFullYear()} Freire Propiedades. Engineered for Excellence.
          </p>
          <div className="flex space-x-8 text-[11px] font-bold uppercase tracking-widest">
            <Link href="/" className="text-white/40 hover:text-white transition-colors">
              Privacidad
            </Link>
            <Link href="/" className="text-white/40 hover:text-white transition-colors">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
