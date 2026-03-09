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
  logoPlaceholder: { width: 60, height: 70, backgroundColor: '#f9f9f9', border: '1pt dashed #ccc', justifyContent: 'center' },
  headerTextContainer: { alignItems: 'center', flex: 1 },
  title: { fontSize: 20, color: COLORS.teal, fontWeight: 'bold' },
  subtitle: { fontSize: 13, color: COLORS.orange, marginVertical: 4, fontWeight: 'bold' },
  cedulaText: { fontSize: 12, textDecoration: 'underline', marginBottom: 6, color: COLORS.textDark },
  dateText: { fontSize: 9, color: COLORS.textDark },

  // Campos de Información (Evento, Campus, Sede)
  fieldGroup: { marginBottom: 10 },
  fieldRow: { flexDirection: 'row', justifyContent: 'space-between' },
  fieldHeader: { backgroundColor: COLORS.teal, paddingVertical: 4, paddingHorizontal: 6 },
  fieldHeaderText: { color: COLORS.textLight, fontSize: 8, fontWeight: 'bold' },
  fieldBody: { border: `1pt solid ${COLORS.teal}`, borderTop: 'none', height: 18, backgroundColor: '#ffffff' },

  // Cuadrícula de Credenciales
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { 
    width: '32.5%', // Permite 3 columnas con un pequeño espacio entre ellas
    height: 75, // Altura reducida para dar aspecto 3:1 (aprox 170x75)
    border: `1pt solid ${COLORS.orange}`, 
    marginBottom: 8, 
    padding: 4, 
    flexDirection: 'row',
    position: 'relative'
  },
  
  // Interior de la Credencial
  photoBox: { 
    width: 38, 
    height: 52, 
    border: `1pt solid ${COLORS.orange}`, 
    marginRight: 6,
    marginTop: 8 // Empujado un poco hacia abajo para alinear con los datos
  },
  cardDataContainer: { flex: 1, position: 'relative' },
  
  // Fila superior de la credencial (Flecha + Nombre + Logo)
  cardTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2, paddingRight: 18 },
  chevron: { color: COLORS.orange, fontWeight: 'bold', fontSize: 12, marginRight: 4, marginTop: -2 },
  studentName: { fontSize: 7, fontWeight: 'bold', borderBottom: '1pt solid #e0e0e0', flex: 1, paddingBottom: 1, textTransform: 'uppercase' },
  miniLogo: { width: 18, height: 22, backgroundColor: '#f0f0f0', position: 'absolute', top: -2, right: -2, border: '0.5pt solid #ccc', justifyContent: 'center' },
  
  // Datos del estudiante
  dataRow: { flexDirection: 'row', marginBottom: 1.5, alignItems: 'flex-end' },
  label: { fontSize: 6.5, fontWeight: 'bold', color: COLORS.textDark, width: 35 },
  value: { fontSize: 6.5, color: COLORS.textDark, borderBottom: '0.5pt solid #ccc', flex: 1 },

  // Pie de Página
  footer: { position: 'absolute', bottom: 30, left: 30, right: 30 },
  signatureRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 },
  signatureLine: { borderTop: '1pt solid #000', width: '30%', textAlign: 'center', paddingTop: 4, fontSize: 8 },
  disclaimer: { fontSize: 6.5, textAlign: 'center', marginTop: 15, color: '#444' }
});

const chunkArray = (arr: any[], size: number) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
};

export const CedulaRegistroPDF = ({ participantes }: { participantes: any[] }) => {
  const pages = chunkArray(participantes, 18);

  return (
    <Document>
      {pages.map((pageData, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          
          {/* ENCABEZADO */}
          <View style={styles.headerContainer}>
            <View style={styles.logoPlaceholder}>
              <Text style={{ fontSize: 7, textAlign: 'center' }}>LOGO IZQ</Text>
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Interprefecos 2026</Text>
              <Text style={styles.subtitle}>Académico, Cultural y Deportivo</Text>
              <Text style={styles.cedulaText}>CÉDULA DE REGISTRO</Text>
              <Text style={styles.dateText}>FECHA DE EXPEDICIÓN: {new Date().toLocaleDateString()}</Text>
            </View>
            <View style={styles.logoPlaceholder}>
              <Text style={{ fontSize: 7, textAlign: 'center' }}>LOGO DER</Text>
            </View>
          </View>

          {/* EVENTO / ACTIVIDAD */}
          <View style={styles.fieldGroup}>
            <View style={styles.fieldHeader}>
              <Text style={styles.fieldHeaderText}>EVENTO / ACTIVIDAD</Text>
            </View>
            <View style={styles.fieldBody} />
          </View>

          {/* CAMPUS Y SEDE */}
          <View style={[styles.fieldRow, styles.fieldGroup]}>
            <View style={{ width: '48%' }}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldHeaderText}>CAMPUS</Text>
              </View>
              <View style={styles.fieldBody} />
            </View>
            <View style={{ width: '48%' }}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldHeaderText}>SEDE</Text>
              </View>
              <View style={styles.fieldBody} />
            </View>
          </View>

          {/* CUADRÍCULA DE CREDENCIALES */}
          <View style={styles.grid}>
            {pageData.map((p, i) => (
              <View key={i} style={styles.card}>
                
                {/* Cuadro de foto (solo borde naranja) */}
                <View style={styles.photoBox}></View>

                {/* Contenido derecho de la credencial */}
                <View style={styles.cardDataContainer}>
                  
                  {/* Fila del nombre, flecha y logo */}
                  <View style={styles.cardTopRow}>
                    <Text style={styles.chevron}>{'>'}</Text>
                    <Text style={styles.studentName}>
                      {p.nombres} {p.apellidoPaterno}
                    </Text>
                  </View>
                  
                  {/* Mini Logo derecho */}
                  <View style={styles.miniLogo}>
                    <Text style={{fontSize: 4, textAlign: 'center'}}>LOGO</Text>
                  </View>

                  {/* Lista de datos */}
                  <View style={{ marginTop: 2 }}>
                    <View style={styles.dataRow}>
                      <Text style={styles.label}>Institución:</Text>
                      <Text style={styles.value}>{p.institucion?.nombre?.substring(0,20)}</Text>
                    </View>
                    <View style={styles.dataRow}>
                      <Text style={styles.label}>Estado:</Text>
                      <Text style={styles.value}></Text>
                    </View>
                    <View style={styles.dataRow}>
                      <Text style={styles.label}>Clave:</Text>
                      <Text style={styles.value}></Text>
                    </View>
                    <View style={styles.dataRow}>
                      <Text style={styles.label}>Matrícula:</Text>
                      <Text style={styles.value}>{p.matricula}</Text>
                    </View>
                    <View style={styles.dataRow}>
                      <Text style={styles.label}>Teléfono:</Text>
                      <Text style={styles.value}></Text>
                    </View>
                    <View style={styles.dataRow}>
                      <Text style={styles.label}>Semestre:</Text>
                      <Text style={styles.value}></Text>
                    </View>
                  </View>

                </View>
              </View>
            ))}
          </View>

          {/* FIRMAS Y PIE DE PÁGINA */}
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

        </Page>
      ))}
    </Document>
  );
};