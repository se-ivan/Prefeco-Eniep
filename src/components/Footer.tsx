"use client";

import { motion } from 'motion/react';
import { MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  const navLinks = [
    'INICIO',
    'SOBRE NOSOTROS',
    'MODELO EDUCATIVO',
    'GALERÍA',
    'PLANTELES',
    'CONTACTO',
  ];

  const scrollToSection = (label: string) => {
    const sectionMap: { [key: string]: string } = {
      'INICIO': '#inicio',
      'SOBRE NOSOTROS': '#historia',
      'MODELO EDUCATIVO': '#modelo',
      'GALERÍA': '#galeria',
      'PLANTELES': '#planteles',
      'CONTACTO': '#contacto',
    };
    
    const href = sectionMap[label];
    if (href) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-gradient-to-br from-[#0b697d] to-[#0a4f5e] text-white">
      <div className="h-2 bg-gradient-to-r from-[#0b697d] via-[#ffa52d] to-[#0b697d]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.png" alt="PREFECO Logo" className="h-12 w-12 object-contain brightness-0 invert" />
              <div className="flex flex-col text-white">
                <span className="font-bold text-xl leading-tight">PREFECO</span>
                <span className="text-sm text-white/70">Melchor Ocampo</span>
              </div>
            </div>
            <p className="text-white/80 leading-relaxed mb-4">
              68 años formando generaciones de michoacanos comprometidos con el conocimiento y el desarrollo de su comunidad.
            </p>
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <span className="font-bold">#YoSoyPREFECO</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="font-bold text-xl mb-6">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link}>
                  <button
                    onClick={() => scrollToSection(link)}
                    className="text-white/70 hover:text-[#ffa52d] transition-colors text-left"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-bold text-xl mb-6">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#ffa52d] flex-shrink-0 mt-1" />
                <span className="text-white/80">Calzada Juárez #159, Morelia</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#ffa52d] flex-shrink-0 mt-1" />
                <span className="text-white/80">(443) 312 2144</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#ffa52d] flex-shrink-0 mt-1" />
                <span className="text-white/80">contacto@prefecomelchorocampo.edu.mx</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-8 border-t border-white/20 text-center text-white/70"
        >
          <p>© 2026 PREFECO Melchor Ocampo. Todos los derechos reservados.</p>
        </motion.div>
      </div>
    </footer>
  );
}