"use client";

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Download, Images, ExternalLink } from 'lucide-react';

const GALLERY_DRIVE_URL = 'https://drive.google.com/drive/folders/1i1K5x7DSC5dpz97O00gQtbpeF003UO-Z?usp=sharing';

// ... (imports y URL iguales)

export function BannerDescargaGaleria() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="px-4 py-10">
      <div className="max-w-4xl mx-auto"> {/* Bajé a 4xl para compactar más como los ejemplos */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2rem] border border-[#0b697d]/10 bg-white shadow-2xl" 
          // ↑ El fondo blanco o muy claro hace que el degradado de las esquinas luzca más limpio
        >
          {/* Fondo con degradados sutiles */}
          <div className="absolute inset-0 bg-linear-to-br from-[#3497ac]/5 to-[#ffa52d]/5" />
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_right,rgba(255,165,45,0.2),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(52,151,172,0.15),transparent_40%)]" />

          <div className="relative z-10 flex flex-col-reverse items-center gap-8 px-8 py-10 lg:flex-row lg:justify-between lg:px-14">
            
            <div className="w-full text-left lg:max-w-lg">
              {/* Badge más sutil */}
              <div className="inline-flex items-center gap-2 rounded-full bg-[#3497ac]/10 px-4 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#3497ac]">
                <Images className="w-3.5 h-3.5" />
                Galería ENIEP 2026
              </div>

              {/* Título con color más fuerte para legibilidad */}
              <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-800">
                Fotos y momentos destacados <br/> <span className="text-[#3497ac]">ENIEP</span>
              </h2>

              <p className="mt-4 text-sm sm:text-base text-slate-500 leading-relaxed">
                Accede a la galería y descarga las fotos de las competencias y los mejores momentos de ENIEP 2026.
              </p>

              <div className="mt-8">
                <a
                  href={GALLERY_DRIVE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 rounded-full bg-linear-to-r from-[#3497ac] to-[#2a7a8b] px-8 py-4 font-bold text-white shadow-[0_10px_20px_-5px_rgba(52,151,172,0.4)] transition-all hover:scale-105 active:scale-95"
                >
                  <Download className="w-5 h-5 transition-transform group-hover:rotate-12" />
                  Descarga la galería
                  <ExternalLink className="w-4 h-4 opacity-50" />
                </a>
              </div>
            </div>

            {/* Logo con efecto de brillo */}
            <div className="relative">
              <div className="absolute inset-0 bg-[#3497ac]/20 blur-[60px] rounded-full" />
              <img
                src="/logo-eniep.png"
                alt="Logo ENIEP"
                className="relative z-10 w-40 sm:w-48 lg:w-56 h-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.1)]"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}