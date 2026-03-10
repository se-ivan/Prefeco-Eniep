"use client";

import { usePathname } from "next/navigation";
import { Calendar } from "lucide-react";
import { motion } from "motion/react";

const routeMap: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Resumen General", subtitle: "Vista principal de la plataforma" },
  "/dashboard/instituciones": { title: "Instituciones", subtitle: "Gestión de planteles y sedes" },
  "/dashboard/instituciones/registro": { title: "Registrar Institución", subtitle: "Altas de nuevas instituciones" },
  "/dashboard/usuarios": { title: "Encargados", subtitle: "Administración de usuarios responsables" },
  "/dashboard/participantes/lista": { title: "Participantes", subtitle: "Listado general de alumnos y docentes" },
  "/dashboard/participantes": { title: "Registrar Participante", subtitle: "Inscripción de nuevos participantes" },
  "/dashboard/personal-apoyo": { title: "Registrar Personal", subtitle: "Alta de staff y apoyo" },
  "/dashboard/personal-apoyo/lista": { title: "Personal de Apoyo", subtitle: "Lista de staff registrado" },
  "/dashboard/exportar-credenciales": { title: "Generar Credenciales", subtitle: "Exportación de credenciales y cédulas" },
  "/dashboard/disciplinas": { title: "Disciplinas", subtitle: "Gestión de categorías deportivas y culturales" },
  "/dashboard/configuracion": { title: "Configuración", subtitle: "Ajustes de tu cuenta" },
};

export default function DashboardHeader() {
  const pathname = usePathname();
  
  // Encontrar la coincidencia más exacta en el mapa de rutas
  const currentRoute = routeMap[pathname] || { 
    title: "Plataforma ENIEP", 
    subtitle: "Gestión Deportiva y Cultural" 
  };

  const currentDate = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  const formattedDate = currentDate.charAt(0).toUpperCase() + currentDate.slice(1);

  return (
    <header className="h-16 flex-none flex items-center justify-between px-8 bg-white/50 backdrop-blur-md border-b border-gray-100 z-10 sticky top-0">
       <motion.div 
         initial={{ opacity: 0, x: -20 }}
         animate={{ opacity: 1, x: 0 }}
         key={pathname}
         className="flex flex-col"
       >
          <h2 className="text-sm font-bold text-gray-800">{currentRoute.title}</h2>
          <p className="text-[10px] text-gray-500">{currentRoute.subtitle}</p>
       </motion.div>
       <motion.div 
         initial={{ opacity: 0, scale: 0.95 }}
         animate={{ opacity: 1, scale: 1 }}
         className="bg-teal-50 text-teal-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-teal-100 flex items-center gap-2 shadow-sm"
       >
         <Calendar size={14} />
         <span className="hidden sm:inline">{formattedDate}</span>
       </motion.div>
    </header>
  );
}
