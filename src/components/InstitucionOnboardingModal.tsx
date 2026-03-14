"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import useSWR from "swr";
import { authClient } from "@/lib/auth-client";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function InstitucionOnboardingModal() {
  const router = useRouter();
  const { data: user, mutate } = useSWR("/api/me", fetcher);
  
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.role === "RESPONSABLE_INSTITUCION") {
      const isMissingEmail = user.email?.endsWith("@local.eniep") || !user.email;
      const isMissingPhone = !user.institucion?.telefono;

      if (isMissingEmail || isMissingPhone) {
        setOpen(true);
        if (!isMissingEmail) setEmail(user.email);
        if (!isMissingPhone) setTelefono(user.institucion?.telefono || "");
      } else {
        setOpen(false);
      }
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/cuenta", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, telefono }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error al actualizar datos");
      }

      toast.success("Datos actualizados correctamente");
      setOpen(false);
      mutate(); // Refetch user data
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Bienvenido a la plataforma ENIEP</DialogTitle>
          <DialogDescription>
            Como es tu primera vez iniciando sesión, necesitamos que completes la información de contacto de tu institución para poder continuar. Despues de hacer el registro podras hacer login con tu correo y contraseña. 
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico de Contacto</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@institucion.edu.mx"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono de la Institución</Label>
            <Input
              id="telefono"
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="1234567890"
              required
              minLength={10}
            />
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button 
              type="submit" 
              className="w-full bg-[#0b697d] hover:bg-[#0a5a6b] dark:bg-[#2eb4cc] dark:hover:bg-[#2aa8b8] text-white dark:text-[#020f12] font-bold transition-all hover:shadow-lg" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
                </>
              ) : (
                "Guardar y Continuar"
              )}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              disabled={loading}
              onClick={async () => {
                await authClient.signOut();
                router.push("/");
              }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancelar y volver al inicio
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
