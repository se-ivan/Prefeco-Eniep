import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type AppRole = "ADMIN" | "RESPONSABLE_INSTITUCION" | "DIRECTIVO";

export type UserScope = {
  id: string;
  name: string;
  username: string | null;
  email: string;
  role: AppRole;
  institucionId: number | null;
  institucion: { id: number; nombre: string; cct: string; telefono?: string | null; urlLogo?: string | null; avalPresidenciaUrl?: string | null; liberacionAdeudosUrl?: string | null } | null;
};

export async function getUserScope(headersValue: Headers): Promise<UserScope | null> {
  let session: any = null;
  try {
    session = await auth.api.getSession({ headers: headersValue });
  } catch (error) {
    console.error("getUserScope: no se pudo obtener sesión", error);
    return null;
  }

  if (!session?.user?.id) return null;

  let user;
  try {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        institucionId: true,
        institucion: { select: { id: true, nombre: true, cct: true, telefono: true, urlLogo: true, avalPresidenciaUrl: true, liberacionAdeudosUrl: true } },
      },
    });
  } catch (error) {
    console.error("getUserScope: no se pudo consultar usuario", error);
    return null;
  }

  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    username: user.username ?? null,
    email: user.email,
    role: user.role as AppRole,
    institucionId: user.institucionId ?? null,
    institucion: user.institucion ?? null,
  };
}

export function isAdmin(scope: UserScope | null): boolean {
  return !!scope && scope.role === "ADMIN";
}

export function isDirectivo(scope: UserScope | null): boolean {
  return !!scope && scope.role === "DIRECTIVO";
}

export function hasAdminViewAccess(scope: UserScope | null): boolean {
  return !!scope && (scope.role === "ADMIN" || scope.role === "DIRECTIVO");
}

export function isResponsable(scope: UserScope | null): boolean { return !!scope && scope.role === 'RESPONSABLE_INSTITUCION'; }
