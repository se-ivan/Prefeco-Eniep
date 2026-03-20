"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Building2,
  UserPlus,
  Users,
  ShieldCheck,
  Briefcase,
  ClipboardList,
  IdCard,
  FileText,
  Volleyball,
  type LucideIcon,
} from "lucide-react";

type MenuItem = {
  name: string;
  icon: LucideIcon;
  href: string;
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

type DashboardSidebarProps = {
  isAdmin: boolean;
  userName: string;
  userEmail: string;
  footer: React.ReactNode;
};

function isItemActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getActiveHref(pathname: string, sections: MenuSection[]) {
  const candidates = sections
    .flatMap((section) => section.items)
    .map((item) => item.href)
    .filter((href) => isItemActive(pathname, href));

  if (candidates.length === 0) return null;

  // Keep only one active item: exact match wins, otherwise longest prefix match.
  return candidates.sort((a, b) => b.length - a.length)[0];
}

export default function DashboardSidebar({
  isAdmin,
  userName,
  userEmail,
  footer,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const sections: MenuSection[] = [
    {
      title: "General",
      items: [
        { name: "Inicio", icon: Home, href: "/dashboard" },
        { name: "Documentos Institucionales", icon: FileText, href: "/dashboard/institucion-documentos" },
      ],
    },
    ...(isAdmin
      ? [
          {
            title: "Administración",
            items: [
              { name: "Instituciones", icon: Building2, href: "/dashboard/instituciones" },
              { name: "Registrar Institución", icon: UserPlus, href: "/dashboard/instituciones/registro" },
              { name: "Encargados", icon: ShieldCheck, href: "/dashboard/usuarios" },
            ],
          },
        ]
      : []),
    {
      title: "Participantes",
      items: [
        { name: "Registrar Participante", icon: UserPlus, href: "/dashboard/participantes" },
        { name: "Lista de Participantes", icon: Users, href: "/dashboard/participantes/lista" },
      ],
    },
    {
      title: "Personal de Apoyo",
      items: [
        { name: "Registrar Personal", icon: Briefcase, href: "/dashboard/personal-apoyo" },
        { name: "Lista de Personal", icon: ClipboardList, href: "/dashboard/personal-apoyo/lista" },
      ],
    },
    {
      title: "Evento",
      items: [
        { name: "Disciplinas", icon: Volleyball, href: "/dashboard/disciplinas" },
        { name: "Generar Credenciales", icon: IdCard, href: "/dashboard/exportar-credenciales" },
        { name: "Reportes Excel", icon: FileText, href: "/dashboard/reportes" },
      ],
    },
  ];

  const activeHref = getActiveHref(pathname, sections);

  return (
    <aside className="w-72 bg-[#08677a] text-white hidden md:flex md:flex-col">
      <div className="p-8">
        <h1 className="text-2xl font-bold tracking-tight">ENIEP</h1>
        <p className="text-xs text-teal-200/60 font-medium">2026</p>
      </div>

      <nav className="flex-1 px-4 pb-4 overflow-y-auto">
        <div className="space-y-6">
          {sections.map((section) => (
            <div key={section.title}>
              <p className="px-4 mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-teal-200/60">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const active = activeHref === item.href;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={[
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                        active
                          ? "bg-[#ffa52d] text-white shadow-[0_8px_24px_-12px_rgba(255,165,45,0.9)]"
                          : "text-teal-50 hover:bg-teal-700/50",
                      ].join(" ")}
                    >
                      <item.icon size={20} strokeWidth={2} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div className="p-4 space-y-4">
        <div className="bg-teal-800/40 p-4 rounded-2xl border border-teal-700/30">
          <p className="text-sm font-semibold text-white truncate">{userName}</p>
          <p className="text-xs text-teal-200/70 truncate">{userEmail}</p>
        </div>

        {footer}
      </div>
    </aside>
  );
}