"use client";

import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Hero() {
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

      <div className="max-w-7xl justify-center flex items-center flex-col mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center max-w-xl mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8 flex justify-center px-4"
          >
            <img 
              src="/logo-escuela-hero-claro2.webp" 
              alt="PREFECO Melchor Ocampo" 
              className="w-full max-w-2xl lg:max-w-4xl h-auto drop-shadow-2xl" 
            />
          </motion.div>

        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-2 bg-gradient-to-r from-[#0b697d]/90 to-[#0d5868]/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 sm:p-12 text-center border border-white/10"
        >
          <div className="h-2 w-full bg-gradient-to-r from-[#0b697d] to-[#ffa52d] rounded-full mb-8"></div>
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