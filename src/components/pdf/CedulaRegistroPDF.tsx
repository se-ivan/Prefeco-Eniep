import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Colores extraídos de la imagen
const COLORS = {
  teal: '#3aa5b8',
  orange: '#f6a02b',
  textDark: '#333333',
  textLight: '#ffffff'
};

const styles = StyleSheet.create({
  page: { padding: 30, backgroundColor: '#ffffff' },
  
  // Encabezado principal
  headerContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  logoPlaceholder: { width: 100, height: 75, justifyContent: 'center' },
  logoImage: { width: '100%', height: '100%', objectFit: 'contain' },
  headerTextContainer: { alignItems: 'center', flex: 1 },
  title: { fontSize: 20, color: COLORS.teal, fontWeight: 'bold' },
  subtitle: { fontSize: 13, color: COLORS.orange, marginVertical: 4, fontWeight: 'bold' },
  cedulaText: { fontSize: 12, textDecoration: 'underline', marginBottom: 6, color: COLORS.textDark },
  dateText: { fontSize: 9, color: COLORS.textDark },

  // Campos de Información (Evento, Campus, Sede)
  fieldGroup: { marginBottom: 10 },
  fieldRow: { flexDirection: 'row', justifyContent: 'space-between' },
  fieldHeader: { backgroundColor: COLORS.teal, paddingVertical: 4, paddingHorizontal: 6 },
  fieldHeaderText: { color: COLORS.textLight, fontSize: 9, fontWeight: 'bold' },
  fieldBody: { border: `1pt solid ${COLORS.teal}`, borderTop: 'none', height: 20, backgroundColor: '#ffffff', justifyContent: 'center', paddingHorizontal: 6 },
  fieldBodyText: { fontSize: 8, color: COLORS.textDark },

  // Cuadrícula de Credenciales (AHORA A 2 COLUMNAS)
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { 
    width: '48.5%', // Permite 2 columnas exactas
    height: 95,     // Tarjeta más alta
    border: `1pt solid ${COLORS.orange}`, 
    marginBottom: 12, 
    padding: 6, 
    flexDirection: 'row',
    position: 'relative'
  },
  
  // Interior de la Credencial
  photoBox: { 
    width: 55,       // Foto mucho más ancha
    height: 72,      // Foto más alta
    border: `1pt solid ${COLORS.orange}`, 
    marginRight: 8,
    marginTop: 8
  },
  photoImage: { width: 55, height: 72, objectFit: 'cover', marginRight: 8, marginTop: 8 },
  cardDataContainer: { flex: 1, position: 'relative', justifyContent: 'flex-start' },
  
  // Fila superior de la credencial
  cardTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, paddingRight: 22 },
  chevron: { color: COLORS.orange, fontWeight: 'bold', fontSize: 14, marginRight: 4, marginTop: -2 },
  
  // numberOfLines={1} fuerza a que no haga wrap. Con 2 columnas ahora hay espacio suficiente.
  studentName: { fontSize: 9, fontWeight: 'bold', borderBottom: '1pt solid #e0e0e0', flex: 1, paddingBottom: 2, textTransform: 'uppercase' },
  
  miniLogo: { width: 22, height: 28, position: 'absolute', top: -2, right: -2, justifyContent: 'center' },
  miniLogoImage: { width: 22, height: 28, objectFit: 'contain' },
  
  // Datos del estudiante
  dataRow: { flexDirection: 'row', marginBottom: 2.5, alignItems: 'flex-end' },
  label: { fontSize: 7.5, fontWeight: 'bold', color: COLORS.textDark, width: 45 },
  value: { fontSize: 7.5, color: COLORS.textDark, borderBottom: '0.5pt solid #ccc', flex: 1 },

  // Pie de Página
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30 },
  signatureRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 25 },
  signatureLine: { borderTop: '1pt solid #000', width: '30%', textAlign: 'center', paddingTop: 4, fontSize: 9 },
  disclaimer: { fontSize: 7, textAlign: 'center', marginTop: 15, color: '#444' }
});

const LEFT_LOGO_SRC = '/logo-escuela.png';
const RIGHT_LOGO_SRC = '/logo-eniep.png';

const getProxiedImageUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  if (url.startsWith('http')) {
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  }
  return url;
};

const safeText = (value: unknown) => (value == null || value === '' ? 'N/A' : String(value));
const fitFontSize = (value: unknown, base: number, min: number, step = 14) => {
  const len = safeText(value).length;
  if (len <= step) return base;
  const reduced = base - Math.ceil((len - step) / step) * 0.5;
  return Math.max(min, reduced);
};

const normalizeGroupKey = (value: unknown) => safeText(value).trim().toUpperCase();

// Cambiamos el límite de 18 a 10 participantes por página (2 columnas x 5 filas)
const chunkArray = (arr: any[], size: number) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
};

export const CedulaRegistroPDF = ({ participantes }: { participantes: any[] }) => {
  // Agrupamos participantes por disciplina y rama para evitar mezclar varonil/femenil en la misma cédula
  const groupedByDisciplina = participantes.reduce((acc, p) => {
    const disciplinaId = p?.disciplina?.id ?? p?.disciplinaId ?? p?.disciplina?.nombre ?? 'Sin Disciplina';
    const disciplinaRama = normalizeGroupKey(p?.disciplina?.rama);
    const disciplinaKey = `${disciplinaId}::${disciplinaRama}`;
    if (!acc[disciplinaKey]) acc[disciplinaKey] = [];
    acc[disciplinaKey].push(p);
    return acc;
  }, {} as Record<string, any[]>);

  // Generamos páginas de 10 en 10 por cada disciplina
  const pages: any[][] = [];
  for (const key of Object.keys(groupedByDisciplina).sort()) {
    const chunks = chunkArray(groupedByDisciplina[key], 10);
    pages.push(...chunks);
  }

  return (
    <Document>
      {pages.map((pageData, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          {(() => {
            const first = pageData?.[0] ?? {};
            const eventName = safeText(first?.disciplina?.nombre);
            const eventRama = safeText(first?.disciplina?.rama);
            const campus = safeText(first?.institucion?.nombre);
            const sede = safeText(first?.institucion?.estado);
            const eventLabel = eventRama === 'N/A' ? eventName : `${eventName} - ${eventRama}`;
            return (
              <>
          
          {/* ENCABEZADO */}
          <View style={styles.headerContainer}>
            <View style={styles.logoPlaceholder}>
              <Image src={LEFT_LOGO_SRC} style={styles.logoImage} />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Interprefecos 2026</Text>
              <Text style={styles.subtitle}>Académico, Cultural y Deportivo</Text>
              <Text style={styles.cedulaText}>CÉDULA DE REGISTRO</Text>
              <Text style={styles.dateText}>FECHA DE EXPEDICIÓN: {new Date().toLocaleDateString()}</Text>
            </View>
            <View style={styles.logoPlaceholder}>
              <Image src={RIGHT_LOGO_SRC} style={styles.logoImage} />
            </View>
          </View>

          {/* EVENTO / ACTIVIDAD */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldHeaderText}>EVENTO / ACTIVIDAD</Text>
            </View>
            <View style={styles.fieldBody}>
              <Text style={[styles.fieldBodyText, { fontSize: fitFontSize(eventLabel, 8, 6, 16) }]}>{eventLabel}</Text>
            </View>
          </View>

          {/* CAMPUS Y SEDE */}
          <View style={[styles.fieldRow, styles.fieldGroup]}>
            <View style={{ width: '48%' }}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldHeaderText}>CAMPUS</Text>
              </View>
              <View style={styles.fieldBody}>
                <Text style={[styles.fieldBodyText, { fontSize: fitFontSize(campus, 8, 6, 16) }]}>{campus}</Text>
              </View>
            </View>
            <View style={{ width: '48%' }}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldHeaderText}>SEDE</Text>
              </View>
              <View style={styles.fieldBody}>
                <Text style={[styles.fieldBodyText, { fontSize: fitFontSize(sede, 8, 6, 16) }]}>{sede}</Text>
              </View>
            </View>
          </View>

          {/* CUADRÍCULA DE CREDENCIALES (2 COLUMNAS) */}
          <View style={styles.grid}>
            {pageData.map((p, i) => (
              <View key={i} style={styles.card}>
                {(() => {
                  const nombre = p?.nombres || '';
                  const apPaterno = p?.apellidoPaterno || '';
                  const apMaterno = p?.apellidoMaterno || '';
                  const fullName = [nombre, apPaterno, apMaterno].filter(Boolean).join(' ') || 'N/A';
                  const institucionNombre = safeText(p?.institucion?.nombre);
                  const institucionEstado = safeText(p?.institucion?.estado);
                  const institucionClave = safeText(p?.institucion?.cct);
                  const matricula = safeText(p?.matricula);
                  const telefono = safeText(p?.telefono);
                  const semestre = safeText(p?.semestre);
                  const fotoUrl = p?.fotoUrl ? String(p.fotoUrl) : '';
                  const valueFont = fitFontSize(`${institucionNombre}${institucionClave}${fullName}`, 7.5, 6, 12);

                  return (
                    <>
                
                {/* Cuadro de foto */}
                {fotoUrl ? <Image src={getProxiedImageUrl(fotoUrl)} style={styles.photoImage} /> : <View style={styles.photoBox}></View>}

                {/* Contenido derecho */}
                <View style={styles.cardDataContainer}>
                  
                  {/* Fila del nombre */}
                  <View style={styles.cardTopRow}>
                    <Text style={styles.chevron}>{'>'}</Text>
                    <Text style={[styles.studentName, { fontSize: fitFontSize(fullName, 9, 7, 10) }]}>
                      {fullName}
                    </Text>
                  </View>
                  
                  {/* Mini Logo */}
                  <View style={styles.miniLogo}>
                    <Image src={RIGHT_LOGO_SRC} style={styles.miniLogoImage} />
                  </View>

                  {/* Lista de datos (Fuentes más grandes) */}
                  <View style={{ marginTop: 2 }}>
                    <View style={styles.dataRow}>
                      <Text style={styles.label}>Institución:</Text>
                      <Text style={[styles.value, { fontSize: valueFont }]}>{institucionNombre}</Text>
                    </View>
                    <View style={styles.dataRow}>
                      <Text style={styles.label}>Estado:</Text>
                      <Text style={[styles.value, { fontSize: valueFont }]}>{institucionEstado}</Text>
                    </View>
                    <View style={styles.dataRow}>
                      <Text style={styles.label}>Clave:</Text>
                      <Text style={[styles.value, { fontSize: valueFont }]}>{institucionClave}</Text>
                    </View>
                    <View style={styles.dataRow}>
                      <Text style={styles.label}>Matrícula:</Text>
                      <Text style={[styles.value, { fontSize: valueFont }]}>{matricula}</Text>
                    </View>
                    <View style={styles.dataRow}>
                      <Text style={styles.label}>Teléfono:</Text>
                      <Text style={[styles.value, { fontSize: valueFont }]}>{telefono}</Text>
                    </View>
                    <View style={styles.dataRow}>
                      <Text style={styles.label}>Semestre:</Text>
                      <Text style={[styles.value, { fontSize: valueFont }]}>{semestre}</Text>
                    </View>
                  </View>

                </View>
                    </>
                  );
                })()}
              </View>
            ))}
          </View>

          {/* FIRMAS */}
          <View style={styles.footer}>
            <View style={styles.signatureRow}>
              <Text style={styles.signatureLine}>SELLO / CAMPUS</Text>
              <Text style={styles.signatureLine}>DIRECTOR DEL CAMPUS</Text>
              <Text style={styles.signatureLine}>RECIBIÓ</Text>
            </View>
            <Text style={styles.disclaimer}>
              Este documento será inválido si presenta tachadura, correcciones, marcas, sobreimpresión, sobreposición de fotos, falta de una o más fotos, así como cualquier tipo de modificación.
            </Text>
          </View>

              </>
            );
          })()}

        </Page>
      ))}
    </Document>
  );
};