import { headers } from "next/headers";
import { getUserScope } from "@/lib/rbac";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardAnimationWrapper from "@/components/DashboardAnimationWrapper";
import SidebarFooterActions from "@/components/SidebarFooterActions";
import DashboardSidebar from "@/components/DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const scope = await getUserScope(await headers());
  const isAdmin = scope?.role === "ADMIN";

  const userName = scope?.name || "Usuario";
  const userEmail = scope?.email || "Sin email";

  const currentDate = new Date().toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  const formattedDate = currentDate.charAt(0).toUpperCase() + currentDate.slice(1);

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <DashboardSidebar
        isAdmin={isAdmin}
        userName={userName}
        userEmail={userEmail}
        footer={<SidebarFooterActions />}
      />

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <DashboardHeader />
        
        <DashboardAnimationWrapper>
          <section className="flex-1 p-8 overflow-y-auto w-full">
            {children}
          </section>
        </DashboardAnimationWrapper>
      </main>
    </div>
  );
}