"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2, ArrowLeft, Mail, ShieldCheck, CheckCircle2, Lock, Upload, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import useSWR from "swr";
import { authClient } from "@/lib/auth-client";
import { motion, AnimatePresence } from "motion/react";
import { uploadImageToFirebase } from "@/lib/photo-upload";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function InstitucionOnboardingModal() {
  const router = useRouter();
  const { data: user, mutate } = useSWR("/api/me", fetcher);

  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  
  // States for profile step
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [showPasswords, setShowPasswords] = useState(false);

  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"email" | "verify" | "profile" | "success">("email");

  useEffect(() => {
    if (user && user.role === "RESPONSABLE_INSTITUCION") {
      if (step === "email") {
        const isMissingEmail = user.email?.endsWith("@local.eniep") || user.email?.endsWith("@localhost") || !user.email;
        setOpen(!!isMissingEmail);
      }
    }
  }, [user, step]);

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
      setStep("profile");

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (newPassword || currentPassword) {
        if (!currentPassword) throw new Error("Debes ingresar tu contraseña actual");
        if (!newPassword) throw new Error("Debes ingresar tu nueva contraseña");
        if (newPassword !== confirmPassword) throw new Error("Las contraseñas nuevas no coinciden");

        const res = await authClient.changePassword({
          newPassword,
          currentPassword,
          revokeOtherSessions: false
        });
        
        if (res.error) throw new Error("La contraseña actual es incorrecta o la nueva contraseña no cumple con los requisitos (mínimo 8 caracteres)");
      }

      let urlLogo = undefined;
      if (logoFile) {
        toast.info("Subiendo logo...");
        const uploadResult = await uploadImageToFirebase(logoFile, "institucion");
        urlLogo = uploadResult.url;
      }

      if (urlLogo) {
        const updateRes = await fetch("/api/cuenta", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urlLogo })
        });
        if (!updateRes.ok) {
           const errData = await updateRes.json();
           throw new Error(errData.error || "Error al actualizar logo en el servidor");
        }
      }

      toast.success("Perfil actualizado correctamente");
      setStep("success");
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

            {step === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-[#0b697d]/10 dark:bg-[#2eb4cc]/15 text-[#0b697d] dark:text-[#2eb4cc] rounded-full flex items-center justify-center mb-6">
                  <Lock className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Seguridad y Logo</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Opcionalmente, puedes cambiar tu contraseña y subir el logo de tu institución (min. 200x200).
                </p>

                <form onSubmit={handleProfileSubmit} className="w-full space-y-4">
                  <div className="space-y-3 text-left">
                     <p className="text-sm font-semibold ml-1 text-foreground/80">Cambiar contraseña (Opcional)</p>
                     
                     <div className="relative">
                       <input
                          type={showPasswords ? "text" : "password"}
                          placeholder="Contraseña actual"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          disabled={loading}
                          className="flex h-11 w-full rounded-xl border border-input bg-transparent px-4 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                     </div>

                     <div className="relative">
                        <input
                          type={showPasswords ? "text" : "password"}
                          placeholder="Nueva contraseña"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          disabled={loading}
                          className="flex h-11 w-full rounded-xl border border-input bg-transparent px-4 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                     </div>
                     <p className="text-xs text-muted-foreground ml-1">Mínimo 8 caracteres.</p>

                     <div className="relative">
                        <input
                          type={showPasswords ? "text" : "password"}
                          placeholder="Confirmar nueva contraseña"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          disabled={loading}
                          className="flex h-11 w-full rounded-xl border border-input bg-transparent px-4 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                        <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                     </div>
                  </div>

                  <div className="space-y-3 text-left pt-2">
                    <p className="text-sm font-semibold ml-1 text-foreground/80">Logo de la Institución (Opcional)</p>
                    <label className="flex flex-col items-center justify-center w-full h-24 rounded-xl border border-dashed border-input bg-transparent hover:bg-accent/50 cursor-pointer transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-6 h-6 text-muted-foreground mb-2" />
                        <p className="text-xs text-muted-foreground text-center px-4">
                          {logoFile ? logoFile.name : "Sube una imagen (PNG, JPG, WEBP)"}
                        </p>
                      </div>
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg, image/webp" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setLogoFile(e.target.files[0]);
                          }
                        }}
                        disabled={loading}
                      />
                    </label>
                  </div>

                  <div className="pt-4 flex flex-col gap-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-12 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#0b697d] to-[#0a5a6b] dark:from-[#2eb4cc] dark:to-[#2aa8b8] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {loading ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Procesando...</>
                      ) : (
                        "Guardar y Finalizar"
                      )}
                    </button>
                    
                    {!newPassword && !currentPassword && !logoFile && (
                      <button
                        type="button"
                        onClick={() => {
                          setStep("success");
                          setTimeout(() => {
                            setOpen(false);
                            mutate();
                            router.refresh();
                          }, 2000);
                        }}
                        disabled={loading}
                        className="w-full text-sm font-medium text-muted-foreground hover:underline"
                      >
                        Omitir y continuar
                      </button>
                    )}
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
