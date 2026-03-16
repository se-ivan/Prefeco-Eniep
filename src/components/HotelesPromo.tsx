"use client";

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Map, ArrowRight, Building2, MapPin } from 'lucide-react';
import Link from 'next/link';

export function HotelesPromo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="pt-20 pb-10 bg-background/50 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="bg-card dark:bg-card/40 backdrop-blur-md border border-border/50 dark:border-primary/20 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row-reverse items-stretch group"
        >
          {/* Lado de la Imagen/Portada */}
          <div className="w-full md:w-2/5 bg-gradient-to-bl from-[#0b697d] to-[#0d5868] p-6 relative overflow-hidden group/image">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 w-full h-full flex items-center justify-center pt-10 pb-10 md:pt-0 md:pb-0"
            >
              <div className="relative w-full h-full min-h-[300px] md:min-h-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/20">
                <img
                  src="/hoteles/holiday-inn.jpg"
                  alt="Hoteles y Sedes"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-110 opacity-70 mix-blend-overlay"
                />
                <div className="absolute inset-0 flex items-center justify-center flex-col text-white">
                    <MapPin className="w-20 h-20 mb-4 opacity-90 drop-shadow-md" strokeWidth={1.5} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Lado del Contenido */}
          <div className="w-full md:w-3/5 p-8 sm:p-12 flex flex-col justify-center text-center md:text-left bg-gradient-to-br from-background/90 to-background/50">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0b697d]/10 text-[#0b697d] dark:text-[#ffa52d] dark:bg-[#ffa52d]/10 rounded-full text-sm font-semibold mb-6 w-max mx-auto md:mx-0">
              <Building2 className="w-4 h-4" />
              <span>Alojamiento y Directorio</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[#0b697d] dark:text-gray-100">
              Hoteles Sede
            </h2>

            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Encuentra las mejores opciones de alojamiento con tarifas preferenciales para el ENIEP 2026. Nuestro mapa interactivo te ayudar&aacute; a ubicar los hoteles y las sedes oficiales del evento para tu mayor comodidad.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                href="/hoteles"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#0b697d] to-[#0d5868] hover:shadow-lg text-white rounded-xl transition-all font-medium cursor-pointer"
              >
                <motion.div
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Map className="w-5 h-5" />
                  Ir al mapa interactivo
                  <ArrowRight className="w-4 h-4 ml-1" />
                </motion.div>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}