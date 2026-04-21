"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart as PieChartIcon } from "lucide-react";

const COLORS = ['#3b82f6', '#ec4899', '#f59e0b'];

export function DemographicsChart({ data }: { data: { male: number, female: number, support: number } }) {
  const chartData = [
    { name: 'Hombres', value: data.male },
    { name: 'Mujeres', value: data.female },
    { name: 'Personal de Apoyo', value: data.support }
  ];

  return (
    <Card className="col-span-full lg:col-span-3 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
      <CardHeader className="flex flex-row items-center gap-2">
        <PieChartIcon className="w-5 h-5 text-slate-500 dark:text-slate-400" />
        <div>
          <CardTitle className="text-lg dark:text-slate-100">Distribución de Inscripciones y Asignaciones</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
          <div className="h-75 w-full flex items-center justify-center">
          {data.male + data.female + data.support === 0 ? (
             <p className="text-sm text-slate-500 dark:text-slate-400">No hay datos aún.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value} registros`, 'Cantidad']} 
                  contentStyle={{ backgroundColor: 'var(--tooltip-bg, #ffffff)', borderColor: 'var(--tooltip-border, #e2e8f0)', color: 'var(--tooltip-text, #0f172a)' }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ color: 'var(--legend-text, #64748b)' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
