"use client";

import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { BookOpen, Wrench, Globe, Trophy, School, Users } from 'lucide-react';

export function ModeloEducativo() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const features = [
    {
      icon: BookOpen,
      title: 'Bachillerato General',
      description: 'Programa académico completo que prepara para el nivel superior con enfoque en ciencias y humanidades.',
    },
    {
      icon: Wrench,
      title: 'Capacitación Técnica',
      description: 'Especialidades en Administración, Higiene y Salud, Tecnologías de la Información y más.',
    },
    {
      icon: Globe,
      title: 'Interculturalidad',
      description: 'Único plantel con Departamento de Interculturalidad, promoviendo la diversidad cultural.',
    },
    {
      icon: Trophy,
      title: 'Olimpiadas del Conocimiento',
      description: 'Alumnos destacados y ganadores en Olimpiadas de Biología y Química a nivel nacional.',
    },
    {
      icon: School,
      title: 'Cantera UMSNH',
      description: 'Principal fuente de estudiantes para la Universidad Michoacana de San Nicolás de Hidalgo.',
    },
    {
      icon: Users,
      title: 'Gestión Ciudadana',
      description: 'Modelo cooperativo único con participación activa de padres de familia en la gestión.',
    },
  ];

  return (
    <section id="modelo" ref={ref} className="py-24 bg-gradient-to-br from-background via-card to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 bg-[#0b697d]/10 border border-[#0b697d]/20 rounded-lg mb-6">
            <span className="text-[#0b697d] font-semibold text-sm">Formación Integral</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#0b697d] mb-6">
            Modelo Educativo
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Bachillerato general con capacitaciones para el trabajo y enfoque en desarrollo integral
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="bg-card dark:bg-card/60 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-border dark:hover:border-primary/50 dark:hover:shadow-primary/20 group"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 bg-gradient-to-br from-[#0b697d]/10 to-[#ffa52d]/10 dark:from-[#0b697d]/20 dark:to-[#ffa52d]/20 rounded-xl flex items-center justify-center mb-6 group-hover:from-[#0b697d] group-hover:to-[#ffa52d] transition-all duration-300 shadow-sm"
              >
                <feature.icon className="w-8 h-8 text-[#0b697d] dark:text-primary group-hover:text-white transition-colors" />
              </motion.div>
              <h3 className="font-bold text-[#0b697d] dark:text-primary mb-3 text-xl group-hover:text-[#ffa52d] transition-colors">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <button className="px-8 py-4 bg-gradient-to-r from-[#0b697d] to-[#ffa52d] text-white rounded-xl hover:shadow-xl transition-all font-semibold text-lg">
            Conoce Más Sobre Nuestro Modelo
          </button>
        </motion.div>
      </div>
    </section>
  );
}