"use client";

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Galeria() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const images = [
    {
      src: 'https://images.unsplash.com/photo-1662392228425-92ba6109dc8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXhpY2FuJTIwZm9sayUyMGRhbmNlJTIwdHJhZGl0aW9uYWx8ZW58MXx8fHwxNzcwOTMxNTA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Danza Folclórica',
      category: 'Cultural'
    },
    {
      src: 'https://images.unsplash.com/photo-1608803238528-16ca3cf5c0c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHVkZW50cyUyMHBsYXlpbmclMjBzcG9ydHMlMjBzb2NjZXJ8ZW58MXx8fHwxNzcwOTMxNTA1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Deportes',
      category: 'Actividades'
    },
    {
      src: 'https://images.unsplash.com/photo-1591218214141-45545921d2d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFkdWF0aW9uJTIwY2VyZW1vbnklMjBzdHVkZW50cyUyMGNlbGVicmF0aW5nfGVufDF8fHx8MTc3MDg3NjUxMXww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Graduación',
      category: 'Eventos'
    },
    {
      src: 'https://images.unsplash.com/photo-1763824951292-b082ea414774?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXhpY2FuJTIwY3VsdHVyYWwlMjBldmVudCUyMGNvbG9yZnVsfGVufDF8fHx8MTc3MDkzMTUwNnww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Eventos Culturales',
      category: 'Cultural'
    },
    {
      src: 'https://images.unsplash.com/photo-1603958956194-cf9718dba4b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaWJyYXJ5JTIwYm9va3MlMjBzdHVkZW50c3xlbnwxfHx8fDE3NzA5MzE1MDR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Biblioteca',
      category: 'Instalaciones'
    },
    {
      src: 'https://images.unsplash.com/photo-1758611228434-7b5b697abd0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzY2hvb2wlMjBidWlsZGluZyUyMGNhbXB1c3xlbnwxfHx8fDE3NzA5MzE1MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Instalaciones',
      category: 'Campus'
    },
  ];

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
            PREFECO
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Conoce nuestras instalaciones, eventos y la vida estudiantil
          </p>
        </motion.div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <motion.div
              key={image.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative group overflow-hidden rounded-2xl shadow-lg cursor-pointer aspect-[4/3]"
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
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-12"
        >
          <button className="px-8 py-4 bg-gradient-to-r from-[#ffa52d] to-[rgba(255,165,45,0.8)] text-white rounded-xl hover:shadow-xl transition-all font-semibold">
            Ver Más Fotos
          </button>
        </motion.div>
      </div>
    </section>
  );
}