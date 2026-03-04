"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Building2,
  UserPlus,
  Users,
  Briefcase,
  ClipboardList,
  Settings,
  LogOut,
} from "lucide-react";

type MenuItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  match: "exact" | "prefix";
};

const menuItems: MenuItem[] = [
  { name: "Inicio", icon: Home, href: "/dashboard", match: "exact" },
  { name: "Instituciones", icon: Building2, href: "/dashboard/instituciones", match: "prefix" },
  { name: "Registrar Institución", icon: UserPlus, href: "/dashboard/instituciones/registro", match: "exact" },
  { name: "Registrar Participante", icon: UserPlus, href: "/dashboard/participantes", match: "exact" },
  { name: "Participantes", icon: Users, href: "/dashboard/participantes/lista", match: "prefix" },
  { name: "Registrar Personal", icon: Briefcase, href: "/dashboard/personal-apoyo", match: "exact" },
  { name: "Personal de Apoyo", icon: ClipboardList, href: "/dashboard/personal-apoyo/lista", match: "prefix" },
];

export default function DashboardSidebar({ userName, userEmail }: { userName: string; userEmail: string }) {
  const pathname = usePathname();

  const isItemActive = (item: MenuItem) => {
    if (!pathname) return false;
    if (item.match === "exact") return pathname === item.href;
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  return (
    <aside className="hidden w-72 flex-col bg-[#08677a] text-white md:flex">
      <div className="p-8">
        <h1 className="text-2xl font-bold tracking-tight">ENIEP</h1>
        <p className="text-xs font-medium text-teal-200/60">2026</p>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {menuItems.map((item) => {
          const active = isItemActive(item);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all ${
                active
                  ? "bg-amber-300 text-[#065466] font-semibold shadow-sm"
                  : "text-teal-50 hover:bg-teal-700/50"
              }`}
            >
              <item.icon size={20} strokeWidth={2} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-4 p-4">
        <div className="rounded-2xl border border-teal-700/30 bg-teal-800/40 p-4">
          <p className="truncate text-sm font-semibold text-white">{userName}</p>
          <p className="truncate text-xs text-teal-200/70">{userEmail}</p>
        </div>

        <div className="space-y-1">
          <button className="flex w-full items-center gap-3 px-4 py-2 text-sm text-teal-100 transition-colors hover:text-white">
            <Settings size={18} />
            Configuración
          </button>
          <button className="flex w-full items-center gap-3 px-4 py-2 text-sm text-teal-100 transition-colors hover:text-white">
            <LogOut size={18} />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </aside>
  );
}
