"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await authClient.resetPassword({
        newPassword: password,
        token: token || undefined,
      });

      if (error) {
        toast.error(error.message || "Error al restablecer la contraseña");
      } else {
        toast.success("Contraseña actualizada exitosamente");
        router.push("/");
      }
    } catch (err: any) {
      toast.error("Ocurrió un error inesperado al restablecer la contraseña");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center p-8 bg-card text-card-foreground rounded-2xl shadow-xl max-w-md w-full border border-border">
        <h2 className="text-2xl font-bold mb-4 text-destructive">Enlace inválido</h2>
        <p className="text-muted-foreground mb-6">
          No se encontró un token válido. Por favor, solicita un nuevo enlace de recuperación.
        </p>
        <button
          onClick={() => router.push("/")}
          className="w-full py-3 bg-[#0b697d] text-white rounded-xl font-bold hover:bg-[#0a5a6b] transition-all"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card text-card-foreground p-8 rounded-3xl shadow-2xl w-full max-w-md border border-border"
    >
      <div className="w-16 h-16 bg-[#0b697d]/10 text-[#0b697d] rounded-full flex items-center justify-center mb-6 mx-auto">
        <Lock className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold mb-2 text-center">Nueva Contraseña</h2>
      <p className="text-muted-foreground text-sm mb-8 text-center">
        Ingresa tu nueva contraseña para acceder a la plataforma.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-2">
            Nueva Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimo 8 caracteres"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-transparent border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0b697d] transition-all text-foreground"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">
            Confirmar Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar contraseña"
              disabled={isLoading}
              className="w-full px-4 py-3 bg-transparent border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0b697d] transition-all text-foreground"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-linear-to-r from-[#0b697d] to-[#ffa52d] text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Guardando...
            </>
          ) : (
            "Actualizar Contraseña"
          )}
        </button>
      </form>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Suspense fallback={<Loader2 className="w-8 h-8 animate-spin text-[#0b697d]" />}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
