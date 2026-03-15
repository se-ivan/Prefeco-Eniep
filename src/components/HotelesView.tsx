"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, DollarSign, Info } from 'lucide-react';
import { hotelesData } from '@/app/hoteles/hotelesData';
import { Navigation } from '@/components/Navigation';

type Hotel = (typeof hotelesData)[number];
type CostRange = 'all' | 'low' | 'mid' | 'high' | 'premium';

const GOOGLE_MAPS_SCRIPT_ID = 'google-maps-script';

function normalizeText(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function getMinPrice(hotel: Hotel) {
  const matches = hotel.tarifas.match(/\$\s?([\d,.]+)/g) ?? [];
  if (matches.length === 0) return Number.POSITIVE_INFINITY;
  const values = matches
    .map((match) => Number(match.replace(/[^\d.]/g, '')))
    .filter((num) => Number.isFinite(num));
  return values.length > 0 ? Math.min(...values) : Number.POSITIVE_INFINITY;
}

function inCostRange(price: number, range: CostRange) {
  if (!Number.isFinite(price)) return range === 'all';
  if (range === 'all') return true;
  if (range === 'low') return price <= 900;
  if (range === 'mid') return price > 900 && price <= 1200;
  if (range === 'high') return price > 1200 && price <= 1700;
  return price > 1700;
}

async function loadGoogleMaps(apiKey: string): Promise<any> {
  if ((window as any).google?.maps) {
    return (window as any).google;
  }

  await new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('No se pudo cargar Google Maps')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('No se pudo cargar Google Maps'));
    document.head.appendChild(script);
  });

  return (window as any).google;
}

function GoogleMarkersMap({
  hotels,
  selectedHotel,
  mapMode,
}: {
  hotels: Hotel[];
  selectedHotel: Hotel;
  mapMode: 'selected' | 'all';
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const geocodeCacheRef = useRef<Map<string, { lat: number; lng: number }>>(new Map());
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey || !mapRef.current) return;

    let cancelled = false;

    const renderMap = async () => {
      const google = await loadGoogleMaps(apiKey);
      if (cancelled || !mapRef.current) return;

      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 19.705, lng: -101.194 },
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      const targets = mapMode === 'all' ? hotels : [selectedHotel];
      const geocoder = new google.maps.Geocoder();
      const bounds = new google.maps.LatLngBounds();

      for (const hotel of targets) {
        const cacheKey = hotel.mapQuery ?? hotel.name;
        let location = geocodeCacheRef.current.get(cacheKey);

        if (!location) {
          const result = await geocoder.geocode({ address: cacheKey }).catch(() => null);
          const geoResult = result?.results?.[0]?.geometry?.location;
          if (geoResult) {
            location = { lat: geoResult.lat(), lng: geoResult.lng() };
            geocodeCacheRef.current.set(cacheKey, location);
          }
        }

        if (!location) continue;

        const marker = new google.maps.Marker({
          map,
          position: location,
          title: hotel.name,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<div style="font-family: Arial, sans-serif; font-size: 13px;"><strong>${hotel.name}</strong><br/>${hotel.zona}</div>`,
        });

        marker.addListener('click', () => infoWindow.open(map, marker));
        bounds.extend(location);
      }

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, 60);
      }
    };

    renderMap().catch(() => {
      // Fallback visual stays handled in parent if API fails.
    });

    return () => {
      cancelled = true;
    };
  }, [apiKey, hotels, mapMode, selectedHotel]);

  if (!apiKey) return null;

  return <div ref={mapRef} className="h-full w-full" />;
}

export default function HotelesView() {
  const [selectedHotel, setSelectedHotel] = useState<Hotel>(hotelesData[0]);
  const [mapMode, setMapMode] = useState<'selected' | 'all'>('selected');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('all');
  const [costRange, setCostRange] = useState<CostRange>('all');
  const hasGoogleMapsKey = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

  const zoneOptions = useMemo(() => {
    return ['all', ...new Set(hotelesData.map((hotel) => hotel.zona))];
  }, []);

  const filteredHotels = useMemo(() => {
    const normalizedSearch = normalizeText(searchTerm.trim());
    return hotelesData.filter((hotel) => {
      const matchesName =
        normalizedSearch.length === 0 ||
        normalizeText(hotel.name).includes(normalizedSearch);
      const matchesZone = selectedZone === 'all' || hotel.zona === selectedZone;
      const price = getMinPrice(hotel);
      const matchesCost = inCostRange(price, costRange);
      return matchesName && matchesZone && matchesCost;
    });
  }, [costRange, searchTerm, selectedZone]);

  useEffect(() => {
    if (!filteredHotels.some((hotel) => hotel.id === selectedHotel.id)) {
      if (filteredHotels.length > 0) {
        setSelectedHotel(filteredHotels[0]);
      }
    }
  }, [filteredHotels, selectedHotel.id]);

  const allHotelsMapQuery = useMemo(() => {
    return filteredHotels.map((hotel) => hotel.mapQuery ?? `${hotel.name} Morelia`).join('|');
  }, [filteredHotels]);

  const mapSrc =
    mapMode === 'all'
      ? `https://maps.google.com/maps?q=${encodeURIComponent(allHotelsMapQuery || 'Morelia Michoacan hoteles')}&t=&z=12&ie=UTF8&iwloc=&output=embed`
      : `https://maps.google.com/maps?q=${encodeURIComponent(selectedHotel.mapQuery ?? `${selectedHotel.name} Morelia`)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="min-h-screen bg-background flex flex-col pt-20">
      <Navigation />
      
      {/* On mobile, let it flow naturally. On desktop, lock height to screen. */}
      <div className="flex-1 flex flex-col md:flex-row w-full md:h-[calc(100vh-80px)]">
        
        {/* Left Side: Hotel List */}
        <div className="w-full md:w-1/2 lg:w-[45%] flex flex-col border-r border-border md:h-full bg-card/50 order-last md:order-first">
          <div className="p-4 md:p-6 border-b border-border bg-background z-10 shrink-0 space-y-4 shadow-sm relative">
            <h1 className="text-2xl md:text-3xl font-bold text-[#0b697d] dark:text-[#2eb4cc]">Hoteles Sede</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Explora las opciones de alojamiento con tarifas preferenciales para el ENIEP 2026.
            </p>

            <div className="grid grid-cols-1 gap-3">
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar hotel por nombre..."
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-[#0b697d] transition-all"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={selectedZone}
                  onChange={(event) => setSelectedZone(event.target.value)}
                  className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-[#0b697d] transition-all"
                >
                  {zoneOptions.map((zone) => (
                    <option key={zone} value={zone}>
                      {zone === 'all' ? 'Todas las zonas' : zone}
                    </option>
                  ))}
                </select>

                <select
                  value={costRange}
                  onChange={(event) => setCostRange(event.target.value as CostRange)}
                  className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-[#0b697d] transition-all"
                >
                  <option value="all">Todos los costos</option>
                  <option value="low">Hasta $900</option>
                  <option value="mid">$901 a $1,200</option>
                  <option value="high">$1,201 a $1,700</option>
                  <option value="premium">Mayor a $1,700</option>
                </select>
              </div>

              <p className="text-xs font-medium text-muted-foreground">
                Mostrando {filteredHotels.length} de {hotelesData.length} hoteles
              </p>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
            {filteredHotels.map((hotel) => (
              <motion.div
                key={hotel.id}
                whileHover={{ y: -2 }}
                onClick={() => {
                  setSelectedHotel(hotel);
                  // On mobile when clicking a hotel, scroll to top where the map is
                  if (window.innerWidth < 768) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                className={`cursor-pointer group flex flex-row items-stretch rounded-xl overflow-hidden border transition-all duration-200 shadow-sm ${
                  selectedHotel.id === hotel.id 
                    ? 'border-[#0b697d] bg-[#0b697d]/5 dark:bg-[#0b697d]/10 ring-1 ring-[#0b697d]' 
                    : 'border-border bg-card hover:border-[#0b697d]/50 hover:shadow-md'
                }`}
              >
                {/* Espacio para Imagen del Hotel - Relacion 1:1 (Cuadrada) ubicada a la izquierda */}
                <div className="w-28 sm:w-36 aspect-square shrink-0 bg-linear-to-br from-muted/50 to-muted relative flex items-center justify-center border-r border-border/50 overflow-hidden">
                   {hotel.imagenUrl ? (
                     <img 
                       src={hotel.imagenUrl} 
                       alt={hotel.name}
                       className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                     />
                   ) : (
                     <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center text-muted-foreground/50">
                       <span className="text-2xl sm:text-3xl opacity-60">🏨</span>
                       <span className="text-[10px] leading-tight mt-1 hidden sm:block font-medium">1:1 Imagen</span>
                     </div>
                   )}
                </div>

                <div className="p-3 sm:p-4 flex flex-col flex-1 min-w-0 justify-center">
                  <h3 className={`font-bold text-base sm:text-lg leading-tight ${selectedHotel.id === hotel.id ? 'text-[#0b697d] dark:text-[#2eb4cc]' : 'text-foreground'}`}>
                    {hotel.name}
                  </h3>
                  
                  <div className="space-y-1.5 text-xs sm:text-sm mt-1.5">
                    <div className="flex items-start gap-1.5 text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#ffa52d]" />
                      <span className="leading-snug line-clamp-1">{hotel.zona}</span>
                    </div>
                    
                    <div className="flex items-start gap-1.5 text-muted-foreground">
                      <DollarSign className="w-3.5 h-3.5 mt-0.5 shrink-0 text-green-600" />
                      <span className="leading-snug line-clamp-1">{hotel.tarifas}</span>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      <span className="flex-1 text-[10px] sm:text-xs text-muted-foreground hidden sm:block">
                        Clic para ver en el mapa superior
                      </span>
                      {hotel.pdfUrl && (
                        <a
                          href={hotel.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(event) => event.stopPropagation()}
                          className="ml-auto inline-flex items-center justify-center rounded-lg bg-[#0b697d]/10 text-[#0b697d] hover:bg-[#0b697d] hover:text-white dark:text-[#2eb4cc] dark:hover:text-white px-2.5 py-1.5 text-xs font-semibold transition"
                        >
                          Ver PDF
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredHotels.length === 0 && (
              <div className="rounded-xl border border-dashed border-border bg-card p-8 flex flex-col items-center justify-center text-center space-y-3">
                <span className="text-4xl">🔍</span>
                <p className="text-sm font-medium text-muted-foreground">
                  No hay hoteles que coincidan con la busqueda.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedZone('all');
                    setCostRange('all');
                  }}
                  className="mt-2 text-xs font-semibold text-[#0b697d] hover:underline"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Map & Selected Hotel Details */}
        <div className="w-full md:w-1/2 lg:w-[55%] flex flex-col h-[60vh] md:h-[calc(100vh-80px)] relative bg-muted/30 md:border-l border-border md:sticky md:top-[80px]">
          
          {/* Details Overlay (Now floating at bottom to avoid top map controls) */}
          <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 bg-background/95 backdrop-blur-md border border-border shadow-2xl rounded-2xl p-5 z-10">
            <div className="mb-3 flex flex-wrap gap-2 items-center justify-between">
              <div className="flex gap-2">
                <button
                  onClick={() => setMapMode("selected")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    mapMode === "selected"
                      ? "bg-[#0b697d] text-white shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Modo: Hotel Seleccionado
                </button>
                <button
                  onClick={() => setMapMode("all")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    mapMode === "all"
                      ? "bg-[#ffa52d] text-black shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Modo: Todos los Hoteles
                </button>
              </div>
            </div>

            {!hasGoogleMapsKey && mapMode === 'all' && (
              <p className="mb-2 text-xs text-muted-foreground bg-orange-100/50 dark:bg-orange-900/20 p-2 rounded-lg">
                Para interactuar con multiples pines a la vez, agrega una clave de Google Maps (API Key) en variables de entorno.
              </p>
            )}

            <div className="border-t border-border/50 pt-3 mt-1">
              <h2 className="text-xl md:text-2xl font-bold text-[#0b697d] dark:text-[#2eb4cc] mb-2 leading-tight">
                {selectedHotel.name}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                  <span className="text-foreground line-clamp-2">{selectedHotel.zona}</span>
                </div>
                <div className="flex items-start gap-2">
                  <DollarSign className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                  <span className="text-foreground font-medium line-clamp-2">{selectedHotel.tarifas}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                  <span className="text-foreground line-clamp-1">{selectedHotel.contacto}</span>
                </div>
                {selectedHotel.pdfUrl ? (
                  <div className="flex items-start gap-2 mt-1 sm:mt-0">
                    <a
                      href={selectedHotel.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-lg bg-[#0b697d] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#095566] w-full sm:w-auto"
                    >
                      Mas informacion detallada (PDF)
                    </a>
                  </div>
                ) : (
                   <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground text-xs italic">Sin cotizacion en PDF adicional.</span>
                   </div>
                )}
              </div>
            </div>
          </div>

          {/* Google Maps iFrame */}
          <div className="flex-1 w-full bg-muted">
            {hasGoogleMapsKey && mapMode === 'all' ? (
              <GoogleMarkersMap hotels={filteredHotels} selectedHotel={selectedHotel} mapMode={mapMode} />
            ) : (
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                scrolling="no" 
                marginHeight={0} 
                marginWidth={0} 
                src={mapSrc}
                title="Mapa de Hotel"
                className="transition-all duration-500 opacity-95"
              />
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}