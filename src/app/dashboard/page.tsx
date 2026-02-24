"use client";

import { authClient } from "@/lib/auth-client"; // <-- Importamos authClient
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  // Sacamos useSession desde authClient
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg font-semibold animate-pulse text-gray-600">
          Cargando tu perfil...
        </p>
      </div>
    );
  }

  if (!session) return null;

  const handleCerrarSesion = async () => {
    // Usamos authClient para cerrar sesión
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 flex justify-center items-start">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            ¡Bienvenido!
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Has iniciado sesión exitosamente.
          </p>
        </div>

        <div className="flex flex-col items-center space-y-4 border-t border-gray-200 pt-6">
          {session.user.image ? (
            <img
              src={session.user.image}
              alt="Foto de perfil"
              className="h-24 w-24 rounded-full border-4 border-gray-200 shadow-sm"
            />
          ) : (
            <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center text-gray-500 font-bold text-xl shadow-sm">
              {session.user.name?.charAt(0) || "U"}
            </div>
          )}

          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800">
              {session.user.name}
            </h3>
            <p className="text-gray-500">{session.user.email}</p>
          </div>
        </div>

        <button
          onClick={handleCerrarSesion}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}