"use client";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Trophy, Medal, Award, Star, Building2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface PodiumData {
  id: number;
  nombre: string;
  cct: string;
  urlLogo: string | null;
  oro: number;
  plata: number;
  bronce: number;
  puntos: number;
  totalMedallas: number;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function InstitutionLogo({ src, alt, size = "md" }: { src: string | null; alt: string; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-16 w-16 md:h-20 md:w-20",
    lg: "h-20 w-20 md:h-28 md:w-28",
  };

  if (src) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden`}>
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-contain p-1.5"
          onError={(e) => {
            // Hide broken image, show fallback
            (e.target as HTMLImageElement).style.display = "none";
            const fallback = (e.target as HTMLImageElement).nextElementSibling;
            if (fallback) (fallback as HTMLElement).style.display = "flex";
          }}
        />
        <div className="hidden items-center justify-center h-full w-full">
          <Building2 className="h-1/2 w-1/2 text-slate-400" />
        </div>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center`}>
      <Building2 className="h-1/2 w-1/2 text-slate-400 dark:text-slate-500" />
    </div>
  );
}

export function Podium() {
  const { data: podiumData, isLoading, error } = useSWR<PodiumData[]>("/api/podium", fetcher, {
    refreshInterval: 30000,
  });

  if (isLoading) {
    return (
      <Card className="w-full animate-pulse border-slate-200 dark:border-slate-800">
        <CardHeader>
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded mx-auto"></div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-end gap-6 py-8">
            <div className="w-28 h-36 bg-slate-200 dark:bg-slate-800 rounded-t-lg"></div>
            <div className="w-32 h-48 bg-slate-200 dark:bg-slate-800 rounded-t-lg"></div>
            <div className="w-28 h-28 bg-slate-200 dark:bg-slate-800 rounded-t-lg"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !podiumData) {
    return (
      <Card className="w-full border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20">
        <CardContent className="p-6 text-center text-red-500">
          Error al cargar el podio de instituciones.
        </CardContent>
      </Card>
    );
  }

  let sortedData = [...podiumData].filter((inst) => inst.puntos > 0 || inst.totalMedallas > 0);
  
  // LOGICA MOCK: Si no hay ganadores registrados aún, mostramos instituciones de prueba
  if (sortedData.length === 0 && podiumData.length > 0) {
    sortedData = [...podiumData];
    // Poner a 16SBC2016J en primer lugar
    const targetIndex = sortedData.findIndex(i => i.cct === "16SBC2016J");
    if (targetIndex !== -1) {
      const [target] = sortedData.splice(targetIndex, 1);
      sortedData.unshift(target); // Forzar a primer lugar
    }
  }

  if (sortedData.length === 0) {
    return (
      <Card className="w-full overflow-hidden border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Podio de Instituciones
            <Trophy className="w-6 h-6 text-yellow-500" />
          </CardTitle>
          <CardDescription>Aún no hay instituciones registradas.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const firstPlace = sortedData[0];
  const secondPlace = sortedData[1];
  const thirdPlace = sortedData[2];
  const rest = sortedData.slice(3);

  return (
    <Card className="w-full overflow-hidden border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50/80 dark:from-slate-950 dark:to-slate-900 shadow-sm">
      <CardHeader className="text-center pb-4 px-4 md:px-6">
        <CardTitle className="text-xl md:text-2xl font-extrabold flex items-center justify-center gap-3 text-slate-900 dark:text-white">
          <Trophy className="w-7 h-7 text-yellow-500 drop-shadow-md" />
          Clasificación General
          <Trophy className="w-7 h-7 text-yellow-500 drop-shadow-md" />
        </CardTitle>
        <CardDescription className="text-sm mt-1">
          Las mejores instituciones según los resultados obtenidos en las disciplinas.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-2 sm:px-4 md:px-6 pb-6">
        {/* PODIUM VISUAL */}
        <div className="flex justify-center items-end gap-3 sm:gap-6 md:gap-10 pt-6 pb-4 max-w-3xl mx-auto">
          
          {/* SECOND PLACE */}
          {secondPlace && (
            <div className="flex flex-col items-center w-1/3 max-w-[200px] group transition-transform hover:-translate-y-1 duration-300">
              {/* Avatar + Badge */}
              <div className="relative mb-3">
                <div className="rounded-full border-4 border-slate-300 dark:border-slate-500 shadow-lg ring-2 ring-slate-100 dark:ring-slate-800 overflow-hidden bg-white dark:bg-slate-900">
                  <InstitutionLogo src={secondPlace.urlLogo} alt={secondPlace.nombre} size="md" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-slate-200 dark:bg-slate-700 p-1.5 rounded-full shadow-md border border-slate-300 dark:border-slate-600">
                  <Medal className="w-4 h-4 text-slate-500 dark:text-slate-300" />
                </div>
              </div>
              {/* Info */}
              <div className="text-center mb-2 w-full px-1">
                <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 line-clamp-2 leading-tight">{secondPlace.nombre}</p>
                <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-mono">{secondPlace.cct}</p>
                <Badge variant="secondary" className="mt-1.5 text-[10px] sm:text-xs px-2 py-0.5 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  🥇{secondPlace.oro} 🥈{secondPlace.plata} 🥉{secondPlace.bronce}
                </Badge>
              </div>
              {/* Pedestal */}
              <div className="w-full h-20 sm:h-28 bg-gradient-to-t from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-t-xl border-x border-t border-slate-300 dark:border-slate-600 shadow-inner flex items-start justify-center pt-3">
                <span className="text-3xl sm:text-4xl font-black text-slate-400 dark:text-slate-500 opacity-40">2</span>
              </div>
            </div>
          )}

          {/* FIRST PLACE */}
          {firstPlace && (
            <div className="flex flex-col items-center w-1/3 max-w-[220px] group z-10 transition-transform hover:-translate-y-1 duration-300">
              {/* Star */}
              <div className="mb-1">
                <Star className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] animate-pulse mx-auto" />
              </div>
              {/* Avatar + Badge */}
              <div className="relative mb-3">
                <div className="rounded-full border-4 border-yellow-400 dark:border-yellow-500 shadow-[0_0_20px_rgba(250,204,21,0.4)] ring-2 ring-yellow-50 dark:ring-yellow-900/30 overflow-hidden bg-white dark:bg-slate-900">
                  <InstitutionLogo src={firstPlace.urlLogo} alt={firstPlace.nombre} size="lg" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-yellow-100 dark:bg-yellow-900/50 p-2 rounded-full shadow-lg border border-yellow-300 dark:border-yellow-600">
                  <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              {/* Info */}
              <div className="text-center mb-2 w-full px-1">
                <p className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-2 leading-tight">{firstPlace.nombre}</p>
                <p className="text-[10px] sm:text-xs font-medium text-slate-400 dark:text-slate-500 mt-0.5 font-mono">{firstPlace.cct}</p>
                <Badge className="mt-1.5 text-[10px] sm:text-xs px-2 py-0.5 bg-yellow-500 hover:bg-yellow-600 text-white border-none shadow-md">
                  🥇{firstPlace.oro} 🥈{firstPlace.plata} 🥉{firstPlace.bronce}
                </Badge>
              </div>
              {/* Pedestal */}
              <div className="w-full h-28 sm:h-40 bg-gradient-to-t from-yellow-200 to-yellow-100 dark:from-yellow-900/40 dark:to-yellow-800/40 rounded-t-xl border-x border-t border-yellow-300 dark:border-yellow-700/50 shadow-inner flex items-start justify-center pt-3">
                <span className="text-4xl sm:text-5xl font-black text-yellow-600/40 dark:text-yellow-500/30">1</span>
              </div>
            </div>
          )}

          {/* THIRD PLACE */}
          {thirdPlace && (
            <div className="flex flex-col items-center w-1/3 max-w-[200px] group transition-transform hover:-translate-y-1 duration-300">
              {/* Avatar + Badge */}
              <div className="relative mb-3">
                <div className="rounded-full border-4 border-amber-500/60 dark:border-amber-600/60 shadow-lg ring-2 ring-amber-50 dark:ring-amber-900/20 overflow-hidden bg-white dark:bg-slate-900">
                  <InstitutionLogo src={thirdPlace.urlLogo} alt={thirdPlace.nombre} size="md" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-amber-100 dark:bg-amber-900/40 p-1.5 rounded-full shadow-md border border-amber-300 dark:border-amber-700">
                  <Award className="w-4 h-4 text-amber-700 dark:text-amber-500" />
                </div>
              </div>
              {/* Info */}
              <div className="text-center mb-2 w-full px-1">
                <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 line-clamp-2 leading-tight">{thirdPlace.nombre}</p>
                <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-mono">{thirdPlace.cct}</p>
                <Badge variant="outline" className="mt-1.5 text-[10px] sm:text-xs px-2 py-0.5 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/50">
                  🥇{thirdPlace.oro} 🥈{thirdPlace.plata} 🥉{thirdPlace.bronce}
                </Badge>
              </div>
              {/* Pedestal */}
              <div className="w-full h-16 sm:h-20 bg-gradient-to-t from-amber-200/50 to-amber-100/50 dark:from-amber-900/30 dark:to-amber-800/30 rounded-t-xl border-x border-t border-amber-300/50 dark:border-amber-700/40 shadow-inner flex items-start justify-center pt-3">
                <span className="text-3xl sm:text-4xl font-black text-amber-600/30 dark:text-amber-500/25">3</span>
              </div>
            </div>
          )}
        </div>

        {/* REST OF LEADERBOARD */}
        {rest.length > 0 && (
          <div className="mt-8">
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-3 px-1">Otras Instituciones</h3>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-900">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-14 text-center">Pos</TableHead>
                    <TableHead>Institución</TableHead>
                    <TableHead className="text-center hidden md:table-cell">Oro</TableHead>
                    <TableHead className="text-center hidden md:table-cell">Plata</TableHead>
                    <TableHead className="text-center hidden md:table-cell">Bronce</TableHead>
                    <TableHead className="text-right w-20">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rest.map((inst, index) => (
                    <TableRow key={inst.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <TableCell className="text-center font-medium text-slate-500 dark:text-slate-400">
                        {index + 4}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                            {inst.urlLogo ? (
                              <img src={inst.urlLogo} alt={inst.nombre} className="h-full w-full object-contain p-0.5" />
                            ) : (
                              <Building2 className="h-3.5 w-3.5 text-slate-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="font-medium text-sm text-slate-700 dark:text-slate-200 truncate block">{inst.nombre}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{inst.cct}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center hidden md:table-cell">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500 text-xs font-bold">
                          {inst.oro}
                        </span>
                      </TableCell>
                      <TableCell className="text-center hidden md:table-cell">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 text-xs font-bold">
                          {inst.plata}
                        </span>
                      </TableCell>
                      <TableCell className="text-center hidden md:table-cell">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500 text-xs font-bold">
                          {inst.bronce}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-bold text-slate-900 dark:text-white">
                        {inst.totalMedallas}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
