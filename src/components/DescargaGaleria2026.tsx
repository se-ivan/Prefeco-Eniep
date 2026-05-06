"use client";

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Download, ExternalLink, Images } from 'lucide-react';

const GALLERY_DRIVE_URL = 'https://drive.google.com/drive/folders/1i1K5x7DSC5dpz97O00gQtbpeF003UO-Z?usp=sharing';

export function DescargaGaleria2026() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="pb-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-3xl border border-[#0b697d]/20 bg-linear-to-br from-[#0b697d]/8 via-background to-[#ffa52d]/10 p-8 sm:p-10 shadow-xl"
        >
          <div className="pointer-events-none absolute -top-20 -right-14 h-48 w-48 rounded-full bg-[#ffa52d]/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-[#0b697d]/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#0b697d]/20 bg-[#0b697d]/10 px-4 py-1.5 text-sm font-semibold text-[#0b697d]">
                <Images className="h-4 w-4" />
                Galeria ENIEP 2026
              </div>
              <h3 className="mt-4 text-2xl sm:text-3xl font-bold text-[#0b697d]">
                Descarga la galería 2026
              </h3>
              <p className="mt-2 text-muted-foreground">
                Accede a la galería de ENIEP 2026 para ver y descargar las fotos del evento.
              </p>
            </div>

            <a
              href={GALLERY_DRIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#0b697d] to-[#0d5868] px-6 py-3.5 font-semibold text-white shadow-lg transition-all hover:shadow-2xl hover:scale-[1.02] active:scale-95"
            >
              <Download className="h-5 w-5" />
              Descarga tus fotos 
              {/*<ExternalLink className="h-4 w-4 opacity-80 transition-transform group-hover:translate-x-0.5" />*/}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}