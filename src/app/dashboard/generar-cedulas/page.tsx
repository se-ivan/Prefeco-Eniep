'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { pdf } from '@react-pdf/renderer';
import { 
  Building2, 
  MapPin, 
  Search, 
  Loader2,
  FileText,
  Users,
  CheckCircle2,
} from 'lucide-react';
import { CedulaRegistroPDF } from '@/components/pdf/CedulaRegistroPDF';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type Institucion = {
  id: number;
  cct: string;
  nombre: string;
  estado: string;
  zonaEscolar: string;
  urlLogo: string | null;
};

export default function GenerarCedulasPage() {
  const { data: instituciones = [], isLoading } = useSWR<Institucion[]>('/api/instituciones');
  const [registros, setRegistros] = useState<any[]>([]);
  const [institucionSeleccionada, setInstitucionSeleccionada] = useState<Institucion | null>(null);
  const [loadingDatos, setLoadingDatos] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [generandoCedula, setGenerandoCedula] = useState(false);

  const [selectedRamas, setSelectedRamas] = useState<string[]>([]);
  const [selectedModalidades, setSelectedModalidades] = useState<string[]>([]);

  const registrosFiltradosPorCheckboxes = useMemo(() => {
    return registros.filter((reg) => {
      const d = reg.disciplina;
      const matchRama = selectedRamas.length === 0 || (d && selectedRamas.includes(d.rama));
      const matchModalidad = selectedModalidades.length === 0 || (d && selectedModalidades.includes(d.modalidad));
      return matchRama && matchModalidad;
    });
  }, [registros, selectedRamas, selectedModalidades]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!institucionSeleccionada && instituciones.length === 1) {
      const unica = instituciones[0];
      setInstitucionSeleccionada(unica);
      fetchRegistros(unica.id);
    }
  }, [instituciones, institucionSeleccionada]);

  const fetchRegistros = async (institucionId: number) => {
    setLoadingDatos(true);
    try {
      const endpoint = `/api/participantes-inscritos?institucionId=${institucionId}&includeEquipos=true`;
      const res = await fetch(endpoint);
      if (!res.ok) throw new Error('Error al cargar registros');
      const data = await res.json();
      setRegistros(data);
      toast.success(`Se encontraron ${data.length} participantes`);
    } catch (error) {
      console.error('Error cargando registros:', error);
      toast.error('Error al cargar registros');
      setRegistros([]);
    } finally {
      setLoadingDatos(false);
    }
  };

  const handleSeleccionarInstitucion = (institucion: Institucion) => {
    setInstitucionSeleccionada(institucion);
    fetchRegistros(institucion.id);
  };

  const filteredInstituciones = instituciones.filter(
    (inst) =>
      inst.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.cct.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const downloadBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleDescargarCedula = useCallback(async () => {
    if (!institucionSeleccionada || registrosFiltradosPorCheckboxes.length === 0) return;
    setGenerandoCedula(true);
    try {
      const blob = await pdf(
        <CedulaRegistroPDF participantes={registrosFiltradosPorCheckboxes} />
      ).toBlob();
      const fileName = `cedula_registro_${institucionSeleccionada.cct}_${new Date().toISOString().split('T')[0]}.pdf`;
      downloadBlob(blob, fileName);
      toast.success('Cédula descargada correctamente');
    } catch (err) {
      console.error('Error generando cédula:', err);
      toast.error('Error al generar la cédula');
    } finally {
      setGenerandoCedula(false);
    }
  }, [institucionSeleccionada, registrosFiltradosPorCheckboxes]);

  return (
    <div className="min-h-screen">
      <main className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
        
        {/* Header con estadísticas */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">
                Total Instituciones
              </CardTitle>
              <div className="p-2 bg-[#0b697d]/10 rounded-md">
                <Building2 className="h-4 w-4 text-[#0b697d]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{instituciones.length}</div>
              <p className="text-xs text-slate-500 mt-1">Registradas en el sistema</p>
            </CardContent>
          </Card>

          {institucionSeleccionada && (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500">
                    Institución Seleccionada
                  </CardTitle>
                  <div className="p-2 bg-[#ffa52d]/10 rounded-md">
                    <CheckCircle2 className="h-4 w-4 text-[#ffa52d]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-bold truncate">{institucionSeleccionada.nombre}</div>
                  <p className="text-xs text-slate-500 mt-1">{institucionSeleccionada.cct}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-500">
                    Inscripciones de participantes
                  </CardTitle>
                  <div className="p-2 bg-emerald-50 rounded-md">
                    <Users className="h-4 w-4 text-emerald-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{registrosFiltradosPorCheckboxes.length}</div>
                  <p className="text-xs text-slate-500 mt-1">Listos para exportar (aplica filtros de rama y modalidad)</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Barra de búsqueda y acciones */}
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Buscar por CCT, nombre o estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 h-11 rounded-xl border-slate-200 bg-white shadow-sm focus:border-[#0b697d] focus:ring-[#0b697d]/20"
            />
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            {institucionSeleccionada && registrosFiltradosPorCheckboxes.length > 0 && isClient && (
              <Button
                className="w-full sm:w-auto h-11 gap-2 bg-[#0b697d] text-white hover:bg-[#095667]"
                disabled={generandoCedula}
                onClick={handleDescargarCedula}
              >
                {generandoCedula ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generando Cédula...
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    Descargar Cédula PDF
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Filtros de Disciplina */}
        {institucionSeleccionada && registros.length > 0 && isClient && (
          <div className="mb-8 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
            <h3 className="font-semibold text-sm text-slate-700 mb-4">Filtrar por Disciplina</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">Rama</span>
                <div className="flex flex-wrap gap-5">
                  {['VARONIL', 'FEMENIL', 'UNICA', 'MIXTO'].map((rama) => (
                    <div key={rama} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`rama-${rama}`}
                        checked={selectedRamas.includes(rama)}
                        onCheckedChange={(checked) => {
                          if (checked) setSelectedRamas([...selectedRamas, rama]);
                          else setSelectedRamas(selectedRamas.filter(r => r !== rama));
                        }}
                      />
                      <Label htmlFor={`rama-${rama}`} className="text-sm cursor-pointer select-none">{rama}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">Modalidad</span>
                <div className="flex flex-wrap gap-5">
                  {['INDIVIDUAL', 'EQUIPO'].map((mod) => (
                    <div key={mod} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`mod-${mod}`}
                        checked={selectedModalidades.includes(mod)}
                        onCheckedChange={(checked) => {
                          if (checked) setSelectedModalidades([...selectedModalidades, mod]);
                          else setSelectedModalidades(selectedModalidades.filter(m => m !== mod));
                        }}
                      />
                      <Label htmlFor={`mod-${mod}`} className="text-sm cursor-pointer select-none">{mod}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contenido principal */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#0b697d]">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="mt-4 font-medium">Cargando instituciones...</p>
          </div>
        ) : filteredInstituciones.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Building2 className="h-12 w-12 mb-4 text-slate-300" />
            <p className="text-lg font-medium text-slate-600">
              No se encontraron instituciones
            </p>
            {searchTerm ? (
              <p className="text-sm">Intenta con otros términos de búsqueda.</p>
            ) : (
              <p className="text-sm mt-1">No hay instituciones registradas en el sistema.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInstituciones.map((inst) => (
              <Card 
                key={inst.id}
                className={`group cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-[#0b697d] ${
                  institucionSeleccionada?.id === inst.id 
                    ? 'border-[#0b697d] border-2 bg-[#0b697d]/5' 
                    : 'border-slate-200'
                }`}
                onClick={() => handleSeleccionarInstitucion(inst)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-bold text-slate-800 group-hover:text-[#0b697d] transition-colors line-clamp-2">
                        {inst.nombre}
                      </CardTitle>
                    </div>
                    {institucionSeleccionada?.id === inst.id && (
                      <CheckCircle2 className="h-5 w-5 text-[#0b697d] shrink-0" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <span className="font-mono font-medium">{inst.cct}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span>{inst.estado}</span>
                  </div>
                  <div className="pt-2 flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      Zona: {inst.zonaEscolar}
                    </Badge>
                    {loadingDatos && institucionSeleccionada?.id === inst.id && (
                      <Loader2 className="h-4 w-4 animate-spin text-[#0b697d]" />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Instrucciones */}
        {!institucionSeleccionada && !isLoading && filteredInstituciones.length > 0 && (
          <div className="mt-8 space-y-4">
            <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex gap-3">
                <FileText className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">
                    Selecciona una institución
                  </h3>
                  <p className="text-sm text-blue-700">
                    Haz clic en cualquier tarjeta para cargar los datos y exportar las cédulas de registro.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}