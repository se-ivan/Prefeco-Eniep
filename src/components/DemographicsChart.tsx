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
    <Card className="col-span-full xl:col-span-3">
      <CardHeader className="flex flex-row items-center gap-2">
        <PieChartIcon className="w-5 h-5 text-slate-500" />
        <div>
          <CardTitle className="text-lg">Distribución de Participantes</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full flex items-center justify-center">
          {data.male + data.female + data.support === 0 ? (
             <p className="text-sm text-slate-500">No hay datos aún.</p>
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
                <Tooltip formatter={(value: number) => [`${value} integrantes`, 'Cantidad']} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
