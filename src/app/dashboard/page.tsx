"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Users, FileText, Calendar, Trophy, Activity, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useSWR from "swr";
import { DemographicsChart } from "@/components/DemographicsChart";

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  
  const { data: dashboardData } = useSWR("/api/dashboard", {
    refreshInterval: 60000,
  });

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50/50">
        <p className="text-lg font-semibold animate-pulse text-gray-600">
          Cargando tu informaciÃƒÆ’Ã†â€™Ãƒâ€šÃ‚Â³n...
        </p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex-1 space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Alumnos Inscritos
            </CardTitle>
            <div className="p-2 bg-blue-50 rounded-md">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData?.totalStudents}</div>
            <p className="text-xs text-slate-500 mt-1">Alumnos Registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Próximos Encuentros
            </CardTitle>
            <div className="p-2 bg-indigo-50 rounded-md">
              <Calendar className="h-4 w-4 text-indigo-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData?.upcomingEvents}</div>
            <p className="text-xs text-slate-500 mt-1">En el dia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Disciplinas Activas
            </CardTitle>
            <div className="p-2 bg-emerald-50 rounded-md">
              <Trophy className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData?.activeDisciplines}</div>
            <p className="text-xs text-slate-500 mt-1">Deportivas y culturales</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
                              <CardHeader className="flex flex-row items-center gap-2">
            <Activity className="w-5 h-5 text-slate-500" />
            <div>
              <CardTitle className="text-lg">Actividad Reciente</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData?.recentActivity && dashboardData.recentActivity.length > 0 ? (
              dashboardData.recentActivity.map((participant: any) => (
                <div key={participant.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700">
                        {participant.nombres[0]}{participant.apellidoPaterno[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {participant.nombres} {participant.apellidoPaterno} {participant.apellidoMaterno}
                      </p>
                      <div className="flex items-center text-xs text-slate-500 mt-1">
                        <span>Participante Registrado</span>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className={participant.estatus === "ACTIVO" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-700 border-slate-200"}>
                    {participant.estatus}
                  </Badge>
                </div>
              ))
            ) : (
                <div className="text-sm text-slate-500 text-center py-4">
                  No hay actividad reciente.
                </div>
            )}
          </CardContent>
        </Card>

        <DemographicsChart data={{ male: dashboardData?.maleStudents || 0, female: dashboardData?.femaleStudents || 0, support: dashboardData?.supportStaff || 0 }} />
      </div>

      <div className="grid gap-4 mt-6">
        <Card className="col-span-full">
          <CardHeader className="flex flex-row items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-500" />
            <div>
              <CardTitle className="text-lg">Proximos Encuentros</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-slate-900 text-sm">Torneo de Futbol - Fase de Grupos</h4>
                <div className="flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-1 rounded text-xs">
                  <Users className="w-3 h-3" />
                  <span>8</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  15 Feb 2026 09:00 AM
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1.5">
                <MapPin className="w-3 h-3 text-red-400" />
                Cancha Principal
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-slate-900 text-sm">Concurso de Ajedrez</h4>
                <div className="flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-1 rounded text-xs">
                  <Users className="w-3 h-3" />
                  <span>16</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  18 Feb 2026 10:00 AM
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1.5">
                <MapPin className="w-3 h-3 text-red-400" />
                Aula Magna
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-slate-900 text-sm">Presentación Danza Regional</h4>
                <div className="flex items-center gap-1 text-slate-500 bg-slate-100 px-2 py-1 rounded text-xs">
                  <Users className="w-3 h-3" />
                  <span>4</span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  22 Feb 2026 16:00 PM
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1.5">
                <MapPin className="w-3 h-3 text-red-400" />
                Teatro Auditorio
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
