import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle"; // Asumiendo que lo tienes exportado así

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Menú Lateral (Sidebar) */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xl font-bold text-gray-800 dark:text-white">ENIEP Admin</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/dashboard" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md dark:text-gray-300 dark:hover:bg-gray-700">
            Inicio
          </Link>
          <Link href="/dashboard/instituciones" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md dark:text-gray-300 dark:hover:bg-gray-700">
            Instituciones
          </Link>
          <Link href="/dashboard/participantes" className="block px-4 py-2 font-medium bg-blue-50 text-blue-700 rounded-md dark:bg-blue-900/50 dark:text-blue-200">
            Participantes
          </Link>
          <Link href="/dashboard/equipos" className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md dark:text-gray-300 dark:hover:bg-gray-700">
            Equipos
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <ThemeToggle />
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col">
        {/* Aquí podrías agregar un Header móvil si lo necesitas */}
        <div className="flex-1 p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}