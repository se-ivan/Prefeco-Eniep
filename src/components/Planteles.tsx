"use client";

import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { MapPin, Mail, Phone, Globe, Award, Users, BookOpen, Star, ChevronLeft, ChevronRight } from 'lucide-react';

export type CampusData = {
  id?: number;
  name: string;
  location: string;
  phone?: string;
  email?: string;
};

interface PlantelesProps {
  instituciones?: CampusData[];
}

export function Planteles({ instituciones = [] }: PlantelesProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [currentPage, setCurrentPage] = useState(1);

  const mainCampus = {
    name: 'PREFECO "Melchor Ocampo"',
    location: 'Morelia, Michoacán',
    anniversary: '70° aniversario',
    description: 'La institución más emblemática del sistema en Michoacán. Se distingue por su alto nivel académico y su estructura de gestión ciudadana.',
    achievements: [
      { icon: Award, text: 'Ganadores en olimpiadas Académicas' },
      { icon: Users, text: 'Principal cantera del Tec de Morelia y la UMSNH' },
      { icon: Star, text: 'Departamento Internacional único' },
      { icon: BookOpen, text: 'Bachillerato general con formación para el trabajo' },
    ],
    contact: {
      address: 'Juan Benito Díaz de Gamarra s/n, Fracc. Lázaro Cárdenas, 58229 Morelia, Mich.',
      email: 'contacto@prefecomelchorocampo.edu.mx',
      phone: '(443) 323 1273',
      website: 'prefecomelchorocampo.edu.mx',
    },
  };

  const mockCampuses: CampusData[] = [
    { name: 'PREFECO "Emiliano Zapata"', location: 'Zacapu', phone: '(436) 363 5511', email: 'ortiz6771@outlook.com' },
    { name: 'PREFECO "Melchor Ocampo"', location: 'Nueva Italia', phone: '(425) 535 2232', email: 'prepamelchor83@hotmail.com' },
    { name: 'PREFECO "Silviano Carrillo"', location: 'Pátzcuaro', phone: '(434) 342 0687', email: 'instscc@hotmail.com' },
    { name: 'PREFECO "Benito Juárez"', location: 'Cherán', phone: '(423) 594 2097', email: 'preparatoriacheran146@gmail.com' },
    { name: 'PREFECO "Melchor Ocampo"', location: 'Zitácuaro', phone: '(715) 153 0341', email: 'prefeco_zitacuaro@hotmail.com' },
    { name: 'PREFECO "Cuauhtémoc"', location: 'Huandacareo', phone: '(455) 358 0175', email: 'viktormmm@hotmail.com' },
    { name: 'PREFECO "Melchor Ocampo"', location: 'Santa Ana Maya', phone: '(455) 384 2949', email: 'guadalupe.mc@hotmail.com' },
  ];

  const displayCampuses = instituciones.length > 0 ? instituciones : mockCampuses;
  
  const itemsPerPage = 9;
  const totalPages = Math.ceil(displayCampuses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCampuses = displayCampuses.slice(startIndex, startIndex + itemsPerPage);

  const prevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const nextPage = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

  return (
    <section id="planteles" ref={ref} className="py-24 bg-linear-to-br from-background via-card to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block px-4 py-2 bg-[#0b697d]/10 border border-[#0b697d]/20 rounded-lg mb-6">
            <span className="text-[#0b697d] font-semibold text-sm">Red PREFECO</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#0b697d] mb-6">
            Nuestros Planteles
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            8 planteles en todo Michoacán comprometidos con la excelencia educativa
          </p>
        </motion.div>

        {/* Main Campus */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-linear-to-br from-[#0b697d] to-[#0d5868] rounded-3xl shadow-2xl overflow-hidden mb-12"
        >
          <div className="h-2 bg-linear-to-r from-[#0b697d] to-[#ffa52d]"></div>
          <div className="p-8 sm:p-12">
            <div className="flex flex-row items-start justify-between gap-4 mb-8">
              <div className="flex-1">
                <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg mb-4">
                  <span className="text-white font-semibold text-sm">Plantel</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold text-white mb-2">{mainCampus.name}</h3>
                <p className="text-white/80 text-lg">{mainCampus.location}</p>
              </div>
              <div className="shrink-0 bg-white/10 p-2 rounded-xl backdrop-blur-sm">
                <img src="/aniversario.png" alt="68 Aniversario" className="h-16 sm:h-24 w-auto object-contain" />
              </div>
            </div>

            <p className="text-white/90 text-lg mb-8 max-w-3xl">{mainCampus.description}</p>

            {/* Achievements */}
            <div className="mb-8">
              <h4 className="text-white font-bold mb-4 text-xl">Logros Destacados</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mainCampus.achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-xl border-l-4 border-[#ffa52d]"
                  >
                    <achievement.icon className="w-5 h-5 text-[#ffa52d] shrink-0 mt-1" />
                    <span className="text-white">{achievement.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#ffa52d] shrink-0 mt-1" />
                <div>
                  <p className="text-white/70 text-sm mb-1">Dirección</p>
                  <p className="text-white">{mainCampus.contact.address}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#ffa52d] shrink-0 mt-1" />
                <div>
                  <p className="text-white/70 text-sm mb-1">Correo</p>
                  <p className="text-white">{mainCampus.contact.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#ffa52d] shrink-0 mt-1" />
                <div>
                  <p className="text-white/70 text-sm mb-1">Teléfono</p>
                  <p className="text-white">{mainCampus.contact.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-[#ffa52d] shrink-0 mt-1" />
                <div>
                  <p className="text-white/70 text-sm mb-1">Sitio Web</p>
                  <p className="text-white">{mainCampus.contact.website}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Other Campuses */}
        <div>
          <h3 className="font-bold text-[#0b697d] mb-8 text-2xl text-center">PREFECOS Hermanas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCampuses.map((campus, index) => (
              <motion.div
                key={campus.id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.05 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-card dark:bg-card/40 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all border-l-4 border-l-[#ffa52d] border-y border-r border-border dark:hover:shadow-[#ffa52d]/10 group flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-bold text-[#0b697d] dark:text-primary mb-2 text-lg group-hover:text-[#ffa52d] transition-colors">{campus.name}</h4>
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <MapPin className="w-4 h-4 text-[#ffa52d]" />
                    <span className="font-medium text-sm text-foreground/80">{campus.location}</span>
                  </div>
                </div>
                {(campus.phone || campus.email) && (
                  <div className="space-y-3 text-sm border-t border-border pt-4 mt-auto">
                    {campus.phone && (
                      <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground/80 transition-colors">
                        <Phone className="w-4 h-4 shrink-0 text-[#0b697d] dark:text-primary" />
                        <span>{campus.phone}</span>
                      </div>
                    )}
                    {campus.email && (
                      <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground/80 transition-colors">
                        <Mail className="w-4 h-4 shrink-0 text-[#0b697d] dark:text-primary" />
                        <span className="break-all">{campus.email}</span>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="p-2 rounded-full border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Página anterior"
              >
                <ChevronLeft className="w-5 h-5 text-[#0b697d]" />
              </button>
              <span className="text-sm font-medium text-muted-foreground">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full border border-border bg-card hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Página siguiente"
              >
                <ChevronRight className="w-5 h-5 text-[#0b697d]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}