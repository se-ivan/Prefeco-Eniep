"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Users, FileText, Calendar, Trophy, Activity, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { PieChart as PieChartIcon } from "lucide-react";

const DemographicsChart = dynamic(
  () => import("@/components/DemographicsChart").then(mod => mod.DemographicsChart),
  { 
    ssr: false, 
    loading: () => (
      <Card className="col-span-full lg:col-span-3 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center gap-2">
          <PieChartIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
          <div>
            <CardTitle className="text-lg dark:text-slate-100">Distribución de Inscripciones y Asignaciones</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-75 w-full flex items-center justify-center text-sm text-slate-500 dark:text-slate-400">
            Cargando gráfico...
          </div>
        </CardContent>
      </Card>
    )
  }
);

function getActivityLabel(action: string) {
  if (action === "ALUMNO_REGISTRADO") return "Registro de participante";
  if (action === "EQUIPO_DISCIPLINA") return "Registro de equipo";
  if (action === "PARTICIPANTE_DISCIPLINA") return "Inscripción a disciplina";
  if (action === "PERSONAL_APOYO_REGISTRADO") return "Registro de personal de apoyo";
  return "Actividad";
}

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
      <div className="flex min-h-screen items-center justify-center bg-gray-50/50 dark:bg-slate-950/50">
        <p className="text-lg font-semibold animate-pulse text-gray-600 dark:text-gray-300">
          Cargando tu información...
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
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Total Inscripciones de Alumnos
            </CardTitle>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-md">
              <Users className="h-4 w-4 text-blue-500 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData?.totalStudents}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Inscripciones vigentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Próximos Encuentros
            </CardTitle>
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-md">
              <Calendar className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData?.upcomingEvents}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">En el dia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Disciplinas Activas
            </CardTitle>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-md">
              <Trophy className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardData?.activeDisciplines}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Deportivas y culturales</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
                              <CardHeader className="flex flex-row items-center gap-2">
            <Activity className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            <div>
              <CardTitle className="text-lg">Actividad Reciente</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardData?.recentActivity && dashboardData.recentActivity.length > 0 ? (
              dashboardData.recentActivity.map((activity: any) => (
                <div key={activity.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700">
                        {String(activity.accion ?? "A").slice(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {activity.descripcion}
                      </p>
                      <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-1">
                        <span>{getActivityLabel(activity.accion)}</span>
                      </div>
                      {dashboardData?.isAdmin && activity?.institucion?.nombre ? (
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Institución: {activity.institucion.nombre}
                        </div>
                      ) : null}
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700">
                    {getActivityLabel(activity.accion)}
                  </Badge>
                </div>
              ))
            ) : (
                <div className="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
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
            <Calendar className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            <div>
              <CardTitle className="text-lg">Próximos Encuentros</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-slate-500 text-center py-4">
              No hay próximos encuentros programados.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
