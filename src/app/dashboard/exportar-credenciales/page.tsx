'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { 
  Building2, 
  MapPin, 
  Search, 
  Download, 
  Loader2,
  FileText,
  Users,
  CheckCircle2,
  TestTube
} from 'lucide-react';
import { CedulaRegistroPDF } from '@/components/pdf/CedulaRegistroPDF';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

type Institucion = {
  id: number;
  cct: string;
  nombre: string;
  estado: string;
  zonaEscolar: string;
  urlLogo: string | null;
};

// Datos de prueba para testing
const datosPrueba = Array.from({ length: 18 }, (_, i) => ({
  id: i + 1,
  nombres: `Nombre${i + 1}`,
  apellidoPaterno: `Apellido${i + 1}`,
  apellidoMaterno: `Materno${i + 1}`,
  matricula: `MAT${1000 + i}`,
  curp: `CURP${String(i + 1).padStart(14, '0')}`,
  fechaNacimiento: '2008-01-15',
  genero: i % 2 === 0 ? 'MASCULINO' : 'FEMENINO',
  tipoSangre: ['O+', 'A+', 'B+', 'AB+'][i % 4],
  institucion: {
    nombre: 'Institución de Prueba',
    cct: '00CCT0000A'
  }
}));

export default function ExportarPage() {
  const { data: instituciones = [], isLoading } = useSWR<Institucion[]>('/api/instituciones');
  const [participantes, setParticipantes] = useState([]);
  const [institucionSeleccionada, setInstitucionSeleccionada] = useState<Institucion | null>(null);
  const [loadingDatos, setLoadingDatos] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchParticipantes = async (institucionId: number) => {
    setLoadingDatos(true);
    try {
      const res = await fetch(`/api/participantes-inscritos?institucionId=${institucionId}`);
      if (!res.ok) throw new Error('Error al cargar participantes');
      const data = await res.json();
      setParticipantes(data);
      toast.success(`Se encontraron ${data.length} participantes`);
    } catch (error) {
      console.error("Error cargando participantes:", error);
      toast.error('Error al cargar participantes');
      setParticipantes([]);
    } finally {
      setLoadingDatos(false);
    }
  };

  const handleSeleccionarInstitucion = (institucion: Institucion) => {
    setInstitucionSeleccionada(institucion);
    fetchParticipantes(institucion.id);
  };

  const filteredInstituciones = instituciones.filter(
    (inst) =>
      inst.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.cct.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                    Participantes
                  </CardTitle>
                  <div className="p-2 bg-emerald-50 rounded-md">
                    <Users className="h-4 w-4 text-emerald-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{participantes.length}</div>
                  <p className="text-xs text-slate-500 mt-1">Listos para exportar</p>
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
            {/* Botón de datos de prueba */}
            {isClient && (
              <PDFDownloadLink
                document={<CedulaRegistroPDF participantes={datosPrueba} />}
                fileName={`cedula_prueba_${new Date().toISOString().split('T')[0]}.pdf`}
                className="w-full sm:w-auto"
              >
                {({ loading }) => (
                  <Button 
                    className="w-full h-11 gap-2 bg-purple-600 text-white hover:bg-purple-700"
                    disabled={loading}
                    title="Generar PDF con datos de prueba"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <TestTube className="h-4 w-4" />
                        Datos de Prueba
                      </>
                    )}
                  </Button>
                )}
              </PDFDownloadLink>
            )}

            {/* Botón de descarga con datos reales */}
            {institucionSeleccionada && participantes.length > 0 && isClient && (
              <PDFDownloadLink
                document={<CedulaRegistroPDF participantes={participantes} />}
                fileName={`cedula_${institucionSeleccionada.cct}_${new Date().toISOString().split('T')[0]}.pdf`}
                className="w-full sm:w-auto"
              >
                {({ loading }) => (
                  <Button 
                    className="w-full h-11 gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generando PDF...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Descargar Cédulas PDF
                      </>
                    )}
                  </Button>
                )}
              </PDFDownloadLink>
            )}
          </div>
        </div>

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
                    Haz clic en cualquier tarjeta de institución para cargar sus participantes 
                    y poder exportar las cédulas de registro en formato PDF.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
              <div className="flex gap-3">
                <TestTube className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-purple-900 mb-1">
                    Modo de prueba disponible
                  </h3>
                  <p className="text-sm text-purple-700">
                    Usa el botón "Datos de Prueba" para generar un PDF de ejemplo con 18 participantes 
                    ficticios. Ideal para verificar el formato y diseño sin usar datos reales.
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