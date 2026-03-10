import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { 
  Home, 
  Building2,
  UserPlus, 
  Users, 
  Briefcase,
  ClipboardList,
  Calendar,
  Settings, 
  Volleyball,
  LogOut 
} from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  const userName = session?.user?.name || "Usuario";
  const userEmail = session?.user?.email || "Sin email";

  const currentDate = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  const formattedDate = currentDate.charAt(0).toUpperCase() + currentDate.slice(1);

  let menuItems = [
      { name: "Inicio", icon: Home, href: "/dashboard" },
  ];

  if (session?.user?.role === "admin") {
    menuItems = [
      ...menuItems,
      { name: "Instituciones", icon: Building2, href: "/dashboard/instituciones" },
      { name: "Registrar Institución", icon: UserPlus, href: "/dashboard/instituciones/registro" },
      { name: "Participantes", icon: Users, href: "/dashboard/participantes/lista" },
      { name: "Registrar Participante", icon: UserPlus, href: "/dashboard/participantes" },
      { name: "Registrar Personal", icon: Briefcase, href: "/dashboard/personal-apoyo" },
      { name: "Personal de Apoyo", icon: ClipboardList, href: "/dashboard/personal-apoyo/lista" },
      { name: "Disciplinas", icon: Volleyball, href: "/dashboard/disciplinas" },
    ];
  } else if (session?.user?.role === "institucion") {
    menuItems = [
      ...menuItems,
      { name: "Participantes", icon: Users, href: "/dashboard/participantes/lista" },
      { name: "Registrar Participante", icon: UserPlus, href: "/dashboard/participantes" },
      { name: "Registrar Personal", icon: Briefcase, href: "/dashboard/personal-apoyo" },
      { name: "Personal de Apoyo", icon: ClipboardList, href: "/dashboard/personal-apoyo/lista" },
      { name: "Disciplinas", icon: Volleyball, href: "/dashboard/disciplinas" },
    ];
  } else {
    menuItems = [...menuItems];
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebar */}
      <aside className="w-72 bg-[#08677a] text-white hidden md:flex md:flex-col">
        {/* Header del Sidebar */}
        <div className="p-8">
          <h1 className="text-2xl font-bold tracking-tight">ENIEP</h1>
          <p className="text-xs text-teal-200/60 font-medium">2026</p>
        </div>

        {/* Navegación Principal */}
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-teal-50 hover:bg-teal-700/50"
            >
              <item.icon size={20} strokeWidth={2} />
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* Footer del Sidebar: Perfil y Configuración */}
        <div className="p-4 space-y-4">
          {/* Card de Usuario */}
          <div className="bg-teal-800/40 p-4 rounded-2xl border border-teal-700/30">
            <p className="text-sm font-semibold text-white truncate">{userName}</p>
            <p className="text-xs text-teal-200/70 truncate">{userEmail}</p>
          </div>

          <div className="space-y-1">
            <button className="flex items-center gap-3 px-4 py-2 w-full text-teal-100 hover:text-white transition-colors text-sm">
              <Settings size={18} />
              Configuración
            </button>
            <button className="flex items-center gap-3 px-4 py-2 w-full text-teal-100 hover:text-white transition-colors text-sm">
              <LogOut size={18} />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header Superior (Opcional, para la fecha y el título) */}
        <header className="h-16 flex items-center justify-between px-8 bg-white/50 backdrop-blur-sm border-b border-gray-100">
           <div className="flex flex-col">
              <h2 className="text-sm font-bold text-gray-800">Registrar Alumno</h2>
              <p className="text-[10px] text-gray-500">Plataforma de Gestión Deportiva y Cultural</p>
           </div>
           <div className="bg-teal-50 text-teal-700 px-3 py-1.5 rounded-lg text-xs font-medium border border-teal-100 flex items-center gap-2">
             <Calendar size={14} />
             {formattedDate}
           </div>
        </header>

        <section className="flex-1 p-8 overflow-y-auto">
          {children}
        </section>
      </main>
    </div>
  );
}