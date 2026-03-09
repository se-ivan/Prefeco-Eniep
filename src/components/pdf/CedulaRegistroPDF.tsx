import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

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
  logoPlaceholder: { width: 65, height: 75, backgroundColor: '#f9f9f9', border: '1pt dashed #ccc', justifyContent: 'center' },
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
  fieldBody: { border: `1pt solid ${COLORS.teal}`, borderTop: 'none', height: 20, backgroundColor: '#ffffff' },

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
  cardDataContainer: { flex: 1, position: 'relative', justifyContent: 'flex-start' },
  
  // Fila superior de la credencial
  cardTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4, paddingRight: 22 },
  chevron: { color: COLORS.orange, fontWeight: 'bold', fontSize: 14, marginRight: 4, marginTop: -2 },
  
  // numberOfLines={1} fuerza a que no haga wrap. Con 2 columnas ahora hay espacio suficiente.
  studentName: { fontSize: 9, fontWeight: 'bold', borderBottom: '1pt solid #e0e0e0', flex: 1, paddingBottom: 2, textTransform: 'uppercase' },
  
  miniLogo: { width: 22, height: 28, backgroundColor: '#f0f0f0', position: 'absolute', top: -2, right: -2, border: '0.5pt solid #ccc', justifyContent: 'center' },
  
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

// Cambiamos el límite de 18 a 10 participantes por página (2 columnas x 5 filas)
const chunkArray = (arr: any[], size: number) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
  return result;
};

export const CedulaRegistroPDF = ({ participantes }: { participantes: any[] }) => {
  // Generamos páginas de 10 en 10
  const pages = chunkArray(participantes, 10);

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

          {/* CUADRÍCULA DE CREDENCIALES (2 COLUMNAS) */}
          <View style={styles.grid}>
            {pageData.map((p, i) => (
              <View key={i} style={styles.card}>
                
                {/* Cuadro de foto */}
                <View style={styles.photoBox}></View>

                {/* Contenido derecho */}
                <View style={styles.cardDataContainer}>
                  
                  {/* Fila del nombre */}
                  <View style={styles.cardTopRow}>
                    <Text style={styles.chevron}>{'>'}</Text>
                    <Text style={styles.studentName}>
                      {p.nombres} {p.apellidoPaterno}
                    </Text>
                  </View>
                  
                  {/* Mini Logo */}
                  <View style={styles.miniLogo}>
                    <Text style={{fontSize: 5, textAlign: 'center'}}>LOGO</Text>
                  </View>

                  {/* Lista de datos (Fuentes más grandes) */}
                  <View style={{ marginTop: 2 }}>
                    <View style={styles.dataRow}>
                      <Text style={styles.label}>Institución:</Text>
                      <Text style={styles.value}>{p.institucion?.nombre}</Text>
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

        </Page>
      ))}
    </Document>
  );
};