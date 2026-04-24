"use client";

import useSWR from "swr";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Medal, Award, Star } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/components/ui/utils";

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

export function Podium() {
  const { data: podiumData, isLoading, error } = useSWR<PodiumData[]>("/api/podium", fetcher, {
    refreshInterval: 30000, // actualiza cada 30s
  });

  if (isLoading) {
    return (
      <Card className="w-full animate-pulse border-slate-200 dark:border-slate-800">
        <CardHeader>
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-end gap-4 h-64">
            <div className="w-24 h-32 bg-slate-200 dark:bg-slate-800 rounded-t-lg"></div>
            <div className="w-32 h-48 bg-slate-200 dark:bg-slate-800 rounded-t-lg"></div>
            <div className="w-24 h-24 bg-slate-200 dark:bg-slate-800 rounded-t-lg"></div>
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
    // Buscar Melchor Ocampo
    const melchorIndex = sortedData.findIndex(i => i.nombre.toLowerCase().includes("melchor ocampo"));
    if (melchorIndex !== -1) {
      const [melchor] = sortedData.splice(melchorIndex, 1);
      sortedData.unshift(melchor); // Forzar a primer lugar
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

  const getAvatarFallback = (name: string) => name.substring(0, 2).toUpperCase();

  return (
    <Card className="w-full overflow-hidden border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 shadow-sm">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl md:text-3xl font-extrabold flex items-center justify-center gap-3 text-slate-900 dark:text-white">
          <Trophy className="w-8 h-8 text-yellow-500 drop-shadow-md" />
          Clasificación General
          <Trophy className="w-8 h-8 text-yellow-500 drop-shadow-md" />
        </CardTitle>
        <CardDescription className="text-base mt-2">
          Las mejores instituciones según los resultados obtenidos en las disciplinas.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {/* PODIUM VISUAL */}
        <div className="flex flex-col sm:flex-row justify-center items-end gap-2 sm:gap-4 md:gap-8 h-auto sm:h-80 mb-12 pt-8">
          
          {/* SECOND PLACE */}
          {secondPlace && (
            <div className="flex flex-col items-center group w-full sm:w-1/3 order-2 sm:order-1 transition-transform hover:-translate-y-2 duration-300">
              <div className="relative mb-4">
                <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-slate-300 dark:border-slate-500 shadow-lg ring-4 ring-slate-100 dark:ring-slate-800 bg-white dark:bg-slate-900">
                  <AvatarImage src={secondPlace.urlLogo || ""} alt={secondPlace.nombre} className="object-contain p-2" />
                  <AvatarFallback className="text-xl font-bold text-slate-500 bg-slate-100">{getAvatarFallback(secondPlace.nombre)}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-3 -right-3 bg-slate-200 dark:bg-slate-700 p-2 rounded-full shadow-md border border-slate-300 dark:border-slate-600">
                  <Medal className="w-6 h-6 text-slate-500 dark:text-slate-300" />
                </div>
              </div>
              <div className="text-center mb-2 px-2">
                <p className="font-bold text-sm md:text-base text-slate-800 dark:text-slate-200 line-clamp-2">{secondPlace.nombre}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{secondPlace.cct}</p>
                <Badge variant="secondary" className="mt-2 flex items-center gap-1.5 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <span>🥇 {secondPlace.oro}</span>
                  <span>🥈 {secondPlace.plata}</span>
                  <span>🥉 {secondPlace.bronce}</span>
                </Badge>
              </div>
              <div className="w-full h-24 sm:h-32 bg-gradient-to-t from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700 rounded-t-xl border-x border-t border-slate-300 dark:border-slate-600 shadow-inner flex justify-center pt-4">
                <span className="text-4xl font-black text-slate-400 dark:text-slate-500 opacity-50">2</span>
              </div>
            </div>
          )}

          {/* FIRST PLACE */}
          {firstPlace && (
            <div className="flex flex-col items-center group w-full sm:w-1/3 order-1 sm:order-2 z-10 transition-transform hover:-translate-y-2 duration-300 sm:-mt-8">
              <div className="relative mb-4">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                  <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] animate-pulse" />
                </div>
                <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-yellow-400 dark:border-yellow-500 shadow-[0_0_15px_rgba(250,204,21,0.5)] ring-4 ring-yellow-50 dark:ring-yellow-900/30 bg-white dark:bg-slate-900">
                  <AvatarImage src={firstPlace.urlLogo || ""} alt={firstPlace.nombre} className="object-contain p-2" />
                  <AvatarFallback className="text-2xl font-bold text-yellow-600 bg-yellow-50">{getAvatarFallback(firstPlace.nombre)}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-3 -right-3 bg-yellow-100 dark:bg-yellow-900/50 p-2.5 rounded-full shadow-lg border border-yellow-300 dark:border-yellow-600">
                  <Trophy className="w-7 h-7 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <div className="text-center mb-2 px-2">
                <p className="font-extrabold text-base md:text-lg text-slate-900 dark:text-white line-clamp-2">{firstPlace.nombre}</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{firstPlace.cct}</p>
                <Badge className="mt-2 flex items-center gap-1.5 bg-yellow-500 hover:bg-yellow-600 text-white border-none shadow-md">
                  <span>🥇 {firstPlace.oro}</span>
                  <span>🥈 {firstPlace.plata}</span>
                  <span>🥉 {firstPlace.bronce}</span>
                </Badge>
              </div>
              <div className="w-full h-32 sm:h-44 bg-gradient-to-t from-yellow-200 to-yellow-100 dark:from-yellow-900/40 dark:to-yellow-800/40 rounded-t-xl border-x border-t border-yellow-300 dark:border-yellow-700/50 shadow-inner flex justify-center pt-4">
                <span className="text-5xl font-black text-yellow-600/50 dark:text-yellow-500/30">1</span>
              </div>
            </div>
          )}

          {/* THIRD PLACE */}
          {thirdPlace && (
            <div className="flex flex-col items-center group w-full sm:w-1/3 order-3 sm:order-3 transition-transform hover:-translate-y-2 duration-300">
              <div className="relative mb-4">
                <Avatar className="w-20 h-20 md:w-24 md:h-24 border-4 border-amber-600/60 shadow-lg ring-4 ring-amber-50 dark:ring-amber-900/20 bg-white dark:bg-slate-900">
                  <AvatarImage src={thirdPlace.urlLogo || ""} alt={thirdPlace.nombre} className="object-contain p-2" />
                  <AvatarFallback className="text-xl font-bold text-amber-700 bg-amber-50">{getAvatarFallback(thirdPlace.nombre)}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-3 -right-3 bg-amber-100 dark:bg-amber-900/40 p-2 rounded-full shadow-md border border-amber-300 dark:border-amber-700">
                  <Award className="w-6 h-6 text-amber-700 dark:text-amber-500" />
                </div>
              </div>
              <div className="text-center mb-2 px-2">
                <p className="font-bold text-sm md:text-base text-slate-800 dark:text-slate-200 line-clamp-2">{thirdPlace.nombre}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{thirdPlace.cct}</p>
                <Badge variant="outline" className="mt-2 flex items-center gap-1.5 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/50">
                  <span>🥇 {thirdPlace.oro}</span>
                  <span>🥈 {thirdPlace.plata}</span>
                  <span>🥉 {thirdPlace.bronce}</span>
                </Badge>
              </div>
              <div className="w-full h-20 sm:h-24 bg-gradient-to-t from-amber-200/50 to-amber-100/50 dark:from-amber-900/30 dark:to-amber-800/30 rounded-t-xl border-x border-t border-amber-300/50 dark:border-amber-700/40 shadow-inner flex justify-center pt-4">
                <span className="text-4xl font-black text-amber-600/40 dark:text-amber-500/30">3</span>
              </div>
            </div>
          )}
        </div>

        {/* REST OF LEADERBOARD */}
        {rest.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 px-2">Otras Instituciones</h3>
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-900">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-16 text-center">Pos</TableHead>
                    <TableHead>Institución</TableHead>
                    <TableHead className="text-center hidden md:table-cell">Oro (1º)</TableHead>
                    <TableHead className="text-center hidden md:table-cell">Plata (2º)</TableHead>
                    <TableHead className="text-center hidden md:table-cell">Bronce (3º)</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rest.map((inst, index) => (
                    <TableRow key={inst.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                      <TableCell className="text-center font-medium text-slate-500 dark:text-slate-400">
                        {index + 4}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
                            <AvatarImage src={inst.urlLogo || ""} className="object-contain p-1" />
                            <AvatarFallback className="rounded-md text-xs">{getAvatarFallback(inst.nombre)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-slate-700 dark:text-slate-200">{inst.nombre}</span>
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
