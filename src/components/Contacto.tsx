"use client";

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export function Contacto() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Ubicación',
      details: ['Juan Benito Diaz de Gamarra s/n, Fracc. Lazaro Cardenas', '58229 Morelia, Mich.'],
      color: 'from-[#0b697d] to-[#0d5868]',
    },
    {
      icon: Phone,
      title: 'Teléfonos',
      details: ['(443) 323 1273'],
      color: 'from-[#0b697d] to-[#0d5868]',
    },
    {
      icon: Clock,
      title: 'Horario de Atención',
      details: ['Lunes a Viernes: 8:00 AM - 4:00 PM', 'Sábado: 9:00 AM - 1:00 PM'],
      color: 'from-[#0b697d] to-[#0d5868]',
    },
    {
      icon: Mail,
      title: 'Correo',
      details: ['contacto@prefecomelchorocampo.edu.mx'],
      color: 'from-[#0b697d] to-[#0d5868]',
    },
  ];

  return (
    <section id="contacto" ref={ref} className="py-24 bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 bg-[rgba(11,105,125,0.1)] border border-[rgba(11,105,125,0.2)] rounded-lg mb-6">
            <span className="text-[#0b697d] font-semibold text-sm">¿Tienes Preguntas?</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#0b697d] mb-6">
            Contáctanos
          </h2>
          <p className="text-lg text-muted-foreground mt-2">
            Estamos aquí para ayudarte. Comunícate con nosotros para más información
          </p>
        </motion.div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-card dark:bg-card/40 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-border dark:hover:border-primary/50 dark:hover:shadow-primary/20 group"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                <info.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-[#0b697d] dark:text-primary mb-3 text-lg group-hover:text-[#ffa52d] transition-colors">{info.title}</h3>
              <div className="space-y-2">
                {info.details.map((detail, i) => (
                  <p key={i} className="text-muted-foreground text-sm leading-relaxed wrap-break-word group-hover:text-foreground/90 transition-colors">
                    {detail}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 bg-gradient-to-r from-[#0b697d]/90 to-[#0d5868]/90 ba
ckdrop-blur-md rounded-2xl shadow-2xl p-8 sm:p-12 text-center border border-white/10"
        >
          <div className="h-2 w-full max-w-sm mx-auto bg-gradient-to-r from-[#0b697d] to-[#ffa52d] rounded-full mb-8"></div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Acceder al Sistema ENIEP 2026
          </h3>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Inicia el registro de tus estudiantes y personal de apoyo entre el 16 y el 27 de marzo del 2026
          </p>
          <motion.button
            onClick={() => window.dispatchEvent(new Event('openLoginModal'))}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-gradient-to-r from-[#ffa52d] to-[rgba(255,165,45,0.8)] text-white rounded-xl hover:shadow-xl transition-all font-semibold text-lg"
          >
            Acceder Ahora
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}