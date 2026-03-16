"use client";

import { motion, useInView, AnimatePresence } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const allImages = [
  // Escuela
  { src: '/escuela/entrada.webp', title: 'Entrada Principal', category: 'Instalaciones' },
  { src: '/escuela/principal.webp', title: 'Edificio Principal', category: 'Instalaciones' },
  { src: '/escuela/patio.webp', title: 'Patio Central', category: 'Instalaciones' },
  { src: '/escuela/patio2.webp', title: 'Áreas Verdes', category: 'Instalaciones' },
  { src: '/escuela/gradas.webp', title: 'Gradas Deportivas', category: 'Instalaciones' },
  { src: '/escuela/cafe.webp', title: 'Cafetería', category: 'Instalaciones' },
  { src: '/escuela/afuera_salon.webp', title: 'Zona de Salones', category: 'Instalaciones' },
  { src: '/escuela/direccion.webp', title: 'Dirección', category: 'Instalaciones' },
  { src: '/escuela/estatua.webp', title: 'Estatua y Monumentos', category: 'Instalaciones' },
  
  // Actividades
  { src: '/actividades/atletismo.webp', title: 'Atletismo', category: 'Actividades' },
  { src: '/actividades/atletismo1.webp', title: 'Práctica de Atletismo', category: 'Actividades' },
  { src: '/actividades/atletismo (2).webp', title: 'Competencia de Atletismo', category: 'Actividades' },
  { src: '/actividades/futbol.webp', title: 'Fútbol', category: 'Actividades' },
  { src: '/actividades/futbol (2).webp', title: 'Equipo de Fútbol', category: 'Actividades' },
  { src: '/actividades/basket.webp', title: 'Básquetbol', category: 'Actividades' },
  { src: '/actividades/basketF.webp', title: 'Básquetbol Femenil', category: 'Actividades' },
  { src: '/actividades/porritas.webp', title: 'Porristas', category: 'Actividades' },
  { src: '/actividades/baile.webp', title: 'Baile', category: 'Actividades' },
  { src: '/actividades/danza.webp', title: 'Danza', category: 'Actividades' },
  { src: '/actividades/canto.webp', title: 'Canto', category: 'Actividades' },
  { src: '/actividades/pintura.webp', title: 'Pintura', category: 'Actividades' },
  { src: '/actividades/dibujo.webp', title: 'Dibujo', category: 'Actividades' },
  { src: '/actividades/botarga.webp', title: 'Mascota Escolar', category: 'Actividades' },
  { src: '/actividades/equipo6.webp', title: 'Actividad en Equipo', category: 'Actividades' },
  { src: '/actividades/equipo7.webp', title: 'Práctica en Equipo', category: 'Actividades' },
  { src: '/actividades/equipo10.webp', title: 'Actividad Grupal', category: 'Actividades' }
];

const previewImages = [
  allImages[0], // Entrada Principal
  allImages[17], // Baile
  allImages[12], // Fútbol
  allImages[1], // Edificio Principal
  allImages[20], // Pintura
  allImages[4], // Gradas
];

export function Galeria() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % allImages.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + allImages.length) % allImages.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;
      if (e.key === 'ArrowRight') setSelectedImage((prev) => prev !== null ? (prev + 1) % allImages.length : 0);
      if (e.key === 'ArrowLeft') setSelectedImage((prev) => prev !== null ? (prev - 1 + allImages.length) % allImages.length : 0);
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  return (
    <section id="galeria" ref={ref} className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 bg-[#0b697d]/10 border border-[#0b697d]/20 rounded-lg mb-6">
            <span className="text-[#0b697d] font-semibold text-sm">GALERÍA</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#0b697d] mb-6">
            Vida Estudiantil
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Conoce nuestras instalaciones y la gran variedad de actividades que ofrecemos.
          </p>
        </motion.div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewImages.map((image, index) => {
            const actualIndex = allImages.findIndex(img => img.src === image.src);
            return (
              <motion.div
                key={image.title + index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => openLightbox(actualIndex)}
                className="relative group overflow-hidden rounded-2xl shadow-lg cursor-pointer aspect-[4/3] bg-muted/20"
              >
                <ImageWithFallback
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b697d]/90 via-[#0b697d]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-sm font-medium mb-1 text-[#ffa52d]">{image.category}</p>
                    <h3 className="font-bold text-xl">{image.title}</h3>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12 flex flex-col items-center gap-4"
        >
          <button 
            onClick={() => openLightbox(0)}
            className="px-8 py-4 bg-gradient-to-r from-[#ffa52d] to-[rgba(255,165,45,0.8)] text-white rounded-xl hover:shadow-xl transition-all font-semibold shadow-md hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            Ver Todas las Fotos
          </button>
        </motion.div>
      </div>

      {/* Lightbox / Carousel Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-[101]"
            >
              <X className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {/* Prev */}
            <button
              onClick={prevImage}
              className="absolute left-2 md:left-8 p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-[101]"
            >
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            {/* Next */}
            <button
              onClick={nextImage}
              className="absolute right-2 md:right-8 p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-[101]"
            >
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
            </button>

            <div className="w-full h-full flex flex-col items-center justify-center p-4 md:p-12 relative" onClick={(e) => e.stopPropagation()}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.2 }}
                  src={allImages[selectedImage].src}
                  alt={allImages[selectedImage].title}
                  className="max-w-full max-h-[70vh] md:max-h-[80vh] object-contain rounded-lg shadow-2xl"
                />
              </AnimatePresence>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center absolute bottom-8 left-0 right-0 px-4"
              >
                <div className="bg-black/50 backdrop-blur-md inline-block p-4 rounded-xl border border-white/10">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{allImages[selectedImage].title}</h3>
                  <span className="px-3 py-1 bg-[#ffa52d] text-white text-xs md:text-sm font-medium rounded-full">
                    {allImages[selectedImage].category}
                  </span>
                  <p className="mt-3 text-white/60 text-xs md:text-sm">
                    {selectedImage + 1} de {allImages.length}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
