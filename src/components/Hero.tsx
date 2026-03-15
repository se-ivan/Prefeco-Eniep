"use client";

import { motion } from 'motion/react';
import { GraduationCap, Users, BookOpen, Trophy, Flag, Drum, Shield, Music, Medal } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Hero() {
  const cards = [
    {
      icon: Trophy,
      title: 'ENIEP 2025',
      description: 'Consulta los detalles y requisitos de la convocatoria vigente para el ENIEP 2025.',
      href: '#'
    },
    {
      icon: Flag,
      title: 'CONCURSO DE ESCOLTAS 2025',
      description: 'Revisa las bases y lineamientos para participar en el concurso de escoltas 2025.',
      href: '#'
    },
    {
      icon: Drum,
      title: 'CONCURSO DE BANDAS DE GUERRA 2025',
      description: 'Infórmate acerca del concurso de bandas de guerra 2025 y sus categorías.',
      href: '#'
    },
  ];

  return (
    <section 
      id="inicio" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      style={{
        backgroundImage: 'linear-gradient(to bottom right, rgba(11, 105, 125, 0.9), rgba(13, 88, 104, 0.8)), url("/heroFondo.jpg")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8 flex justify-center"
          >
            <img src="/logo.png" alt="PREFECO Logo" className="h-24 sm:h-32 w-auto drop-shadow-2xl" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6">
              PREFECO
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl sm:text-2xl lg:text-3xl text-white/90 mb-4 max-w-3xl mx-auto"
            >
              Preparación que renueva para el futuro
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg sm:text-xl text-[#ffa52d] font-medium"
            >
              Melchor Ocampo
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 inline-block"
          >
            <div className="px-6 py-3 bg-white/10 rounded-full border-2 border-white/20 backdrop-blur-sm">
              <span className="text-white font-bold text-sm sm:text-base">#YoSoyPREFECO</span>
            </div>
          </motion.div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-20">
          {cards.map((card, index) => (
            <motion.a
              href={card.href}
              key={card.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-card/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-border dark:hover:border-primary/50 dark:hover:shadow-primary/20 group block cursor-pointer"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#0b697d] to-[#ffa52d] rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
                <card.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-[#0b697d] dark:text-primary mb-3 text-lg group-hover:text-[#ffa52d] transition-colors">{card.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{card.description}</p>
            </motion.a>
          ))}
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex justify-center mt-20"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2"
          >
            <div className="w-1 h-2 bg-white/50 rounded-full"></div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}