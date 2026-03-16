"use client";

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Coffee, FileText, Download, Utensils } from 'lucide-react';

export function CafeteriaMenu() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="py-20 bg-background/50 relative overflow-hidden transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="bg-card dark:bg-card/40 backdrop-blur-md border border-border/50 dark:border-primary/20 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row items-stretch group"
        >
          {/* Lado de la Imagen/Portada */}
          <div className="w-full md:w-2/5 bg-gradient-to-br from-[#0b697d] to-[#0d5868] p-6 relative overflow-hidden group/image">
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 w-full h-full flex items-center justify-center"
            >
              <div className="relative w-full h-full min-h-[300px] md:min-h-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                <img 
                  src="/menu-portada.png" 
                  alt="Portada Menú Cafetería" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-110"
                />
              </div>
            </motion.div>
          </div>

          {/* Lado del Contenido */}
          <div className="w-full md:w-3/5 p-8 sm:p-12 flex flex-col justify-center text-center md:text-left bg-gradient-to-br from-background/90 to-background/50">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0b697d]/10 text-[#0b697d] dark:text-[#ffa52d] dark:bg-[#ffa52d]/10 rounded-full text-sm font-semibold mb-6 w-max mx-auto md:mx-0">
              <Coffee className="w-4 h-4" />
              <span>Cafetería Escolar</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[#0b697d] dark:text-gray-100">
              Menú del Restaurante
            </h2>
            
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Explora nuestra selección de alimentos, bebidas y snacks preparados con altos estándares de calidad para acompañarte durante el evento.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              {/* Botón para ver - Nota: Asegúrate de poner el PDF real en la carpeta public con el nombre menu-cafeteria.pdf */}
              <motion.a
                href="https://prefeco.my.canva.site/naranja-verde-y-negro-elegante-comida-men-a4"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#0b697d] to-[#0d5868] hover:shadow-lg text-white rounded-xl transition-all font-medium"
              >
                <FileText className="w-5 h-5" />
                Ver Menú
              </motion.a>
              
              <motion.a
                href="/menu-cafeteria.pdf"
                download="Menu_Cafeteria_PREFECO.pdf"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl transition-all font-medium border border-border"
              >
                <Download className="w-5 h-5" />
                Descargar
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}