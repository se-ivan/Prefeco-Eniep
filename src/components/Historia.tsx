"use client";

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Target, Calendar, Eye, Heart } from 'lucide-react';

export function Historia() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const items = [
    {
      icon: Target,
      title: 'Misión',
      description: 'Formar bachilleres con sólidos conocimientos académicos, capacidades técnicas y valores cívicos para su desarrollo integral.',
      color: 'from-[#ffa52d] to-[rgba(255,165,45,0.8)]',
    },
    {
      icon: Calendar,
      title: 'Fundación',
      subtitle: 'Morelia, 1956',
      description: 'El modelo de cooperativas educativas en México fue impulsado por Lázaro Cárdenas desde finales de los años 30, estableciendo las bases de lo que hoy conocemos como el sistema PREFECO.',
      color: 'from-[#ffa52d] to-[rgba(255,165,45,0.8)]',
    },
    {
      icon: Eye,
      title: 'Visión',
      description: 'Ser la institución de nivel medio superior líder en Michoacán, reconocida por su excelencia académica y compromiso social.',
      color: 'from-[#ffa52d] to-[rgba(255,165,45,0.8)]',
    },
    {
      icon: Heart,
      title: 'Valores',
      description: 'Responsabilidad, cooperación, integridad académica, respeto a la diversidad y compromiso con la comunidad.',
      color: 'from-[#ffa52d] to-[rgba(255,165,45,0.8)]',
    },
  ];

  return (
    <section id="historia" ref={ref} className="py-24 bg-background transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 bg-[rgba(255,165,45,0.1)] border border-[rgba(255,165,45,0.2)] rounded-lg mb-6">
            <span className="text-[#ffa52d] font-semibold text-sm">Nuestra Historia</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#0b697d] mb-6">
            Una Tradición de Excelencia
          </h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            Desde 1956, formando generaciones de michoacanos comprometidos con el conocimiento y el desarrollo de su comunidad
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-card dark:bg-card/40 backdrop-blur-sm p-8 rounded-2xl border-l-4 border-l-[#ffa52d] border-y border-r border-border shadow-lg hover:shadow-xl transition-all dark:hover:shadow-[#ffa52d]/10 group"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform`}>
                <item.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-bold text-[#0b697d] dark:text-primary mb-2 text-xl group-hover:text-[#ffa52d] transition-colors">{item.title}</h3>
              {item.subtitle && (
                <p className="text-secondary font-semibold mb-3">{item.subtitle}</p>
              )}
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Feature Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center bg-gradient-to-r from-[#0b697d] to-[#0d5868] text-white p-8 sm:p-12 rounded-2xl shadow-xl"
        >
          <p className="text-lg sm:text-xl leading-relaxed max-w-4xl mx-auto">
            PREFECO "Melchor Ocampo" representa la fusión perfecta entre la gestión ciudadana y la excelencia académica, siendo modelo para otras instituciones en todo el estado.
          </p>
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-6 inline-block px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full"
          >
            <span className="font-bold text-lg">#YoSoyPREFECO</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}