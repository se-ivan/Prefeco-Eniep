"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2, ArrowLeft, Mail, ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import useSWR from "swr";
import { authClient } from "@/lib/auth-client";
import { motion, AnimatePresence } from "motion/react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function InstitucionOnboardingModal() {
  const router = useRouter();
  const { data: user, mutate } = useSWR("/api/me", fetcher);
  
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "verify" | "success">("email");

  useEffect(() => {
    if (user && user.role === "RESPONSABLE_INSTITUCION") {
      const isMissingEmail = user.email?.endsWith("@local.eniep") || user.email?.endsWith("@localhost") || !user.email;

      if (isMissingEmail) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    }
  }, [user]);

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/cuenta/enviar-codigo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al enviar el código");
      }

      toast.success("Código de verificación enviado");
      console.log("Nota para desarrollo: Revisa la terminal del servidor para ver el código.");
      setStep("verify");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/cuenta/verificar-codigo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: otp }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Código incorrecto");
      }

      toast.success("Correo verificado correctamente");
      setStep("success");
      
      // Esperar un momento antes de cerrar y recargar
      setTimeout(() => {
        setOpen(false);
        mutate();
        router.refresh();
      }, 2000);
      
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-0 shadow-2xl [&>button]:hidden bg-transparent">
        <div className="bg-card dark:bg-card text-card-foreground p-8 relative flex flex-col items-center text-center">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#0b697d] via-[#2eb4cc] to-[#ffa52d]" />
          
          <AnimatePresence mode="wait">
            {step === "email" && (
              <motion.div 
                key="email"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-[#0b697d]/10 dark:bg-[#2eb4cc]/15 text-[#0b697d] dark:text-[#2eb4cc] rounded-full flex items-center justify-center mb-6">
                  <Mail className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Bienvenido a ENIEP</h2>
                <p className="text-muted-foreground text-sm mb-8">
                  Como es tu primera vez iniciando sesión, necesitamos que registres el correo electrónico de contacto de tu institución.
                </p>

                <form onSubmit={handleSendCode} className="w-full space-y-5">
                  <div className="space-y-3 text-left">
                    <label htmlFor="email" className="text-sm font-semibold ml-1">Correo Electrónico</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ejemplo@institucion.edu.mx"
                      disabled={loading}
                      required
                      className="flex h-12 w-full rounded-xl border border-input bg-transparent px-4 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                    />
                  </div>
                  
                  <div className="pt-2 flex flex-col gap-3">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full h-12 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#0b697d] to-[#0a5a6b] dark:from-[#2eb4cc] dark:to-[#2aa8b8] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Procesando...</>
                      ) : (
                        "Enviar Código"
                      )}
                    </button>
                    
                    <button 
                      type="button" 
                      disabled={loading}
                      onClick={async () => {
                        await authClient.signOut();
                        router.push("/");
                      }}
                      className="w-full h-12 inline-flex items-center justify-center rounded-xl border border-input bg-transparent hover:bg-accent text-sm font-medium transition-colors"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" /> Cancelar y salir
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === "verify" && (
              <motion.div 
                key="verify"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-[#ffa52d]/10 text-[#ffa52d] rounded-full flex items-center justify-center mb-6">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Verifica tu Correo</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Hemos enviado un código de 6 dígitos a <br/>
                  <span className="font-semibold text-foreground">{email}</span>
                </p>

                <form onSubmit={handleVerifyCode} className="w-full space-y-6">
                  <div className="space-y-3 text-left w-full flex flex-col items-center">
                    <label htmlFor="otp" className="text-sm font-semibold w-full text-center">Código de verificación</label>
                    <input
                      id="otp"
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="000000"
                      disabled={loading}
                      required
                      className="h-16 w-3/4 rounded-xl border-2 border-input bg-transparent px-4 py-2 text-center text-3xl font-bold tracking-[0.2em] ring-offset-background focus-visible:outline-none focus-visible:border-[#ffa52d] focus-visible:ring-1 focus-visible:ring-[#ffa52d] disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                    />
                  </div>
                  
                  <div className="pt-2 flex flex-col gap-3">
                    <button 
                      type="submit" 
                      disabled={loading || otp.length !== 6}
                      className="w-full h-12 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#ffa52d] to-[#e69427] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verificando...</>
                      ) : (
                        "Confirmar y Continuar"
                      )}
                    </button>
                    
                    <button 
                      type="button" 
                      disabled={loading}
                      onClick={() => setStep("email")}
                      className="w-full h-12 inline-flex items-center justify-center rounded-xl hover:bg-accent text-sm font-medium transition-colors text-muted-foreground"
                    >
                      Volver e intentar con otro correo
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full flex flex-col items-center py-6"
              >
                <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold mb-2">¡Todo Listo!</h2>
                <p className="text-muted-foreground text-sm text-center">
                  Tu correo ha sido verificado y tu cuenta actualizada exitosamente. Redirigiendo...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
