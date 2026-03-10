"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Loader2, Settings } from "lucide-react";
import { toast } from "sonner";

export default function SidebarFooterActions() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      const res = await fetch("/api/auth/sign-out", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      toast.success("Sesión cerrada");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("No se pudo cerrar sesión. Intenta nuevamente.");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="space-y-1">
      <Link
        href="/dashboard/configuracion"
        className="flex items-center gap-3 px-4 py-2 w-full text-teal-100 hover:text-white transition-colors text-sm"
      >
        <Settings size={18} />
        Configuración
      </Link>
      <button
        type="button"
        onClick={handleSignOut}
        disabled={signingOut}
        className="flex items-center gap-3 px-4 py-2 w-full text-teal-100 hover:text-white transition-colors text-sm disabled:opacity-70"
      >
        {signingOut ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
        {signingOut ? "Cerrando..." : "Cerrar Sesión"}
      </button>
    </div>
  );
}
