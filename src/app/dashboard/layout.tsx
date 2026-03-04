import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Calendar } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";

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

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <DashboardSidebar userName={userName} userEmail={userEmail} />

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