import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const COLORS = {
  teal: '#3aa5b8',
  orange: '#f6a02b',
  textDark: '#333333',
  white: '#ffffff',
  bgGray: '#f8f8f8'
};

const styles = StyleSheet.create({
  page: { padding: 20, backgroundColor: '#ffffff' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  
  // --- CONTENEDOR PRINCIPAL ---
  card: { 
    width: '48.5%', 
    height: 175, 
    border: '0.5pt dashed #ccc',
    marginBottom: 15, 
    position: 'relative',
    backgroundColor: COLORS.white,
    overflow: 'hidden' 
  },

  // --- FRANJAS Y DECORACIONES ---
  topStripeAlumno: { position: 'absolute', top: 12, right: 0, width: '60%', height: 16, backgroundColor: COLORS.orange },
  topStripePersonal: { position: 'absolute', top: 12, left: 0, right: 0, height: 18, backgroundColor: COLORS.orange, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  bottomStripe: { position: 'absolute', bottom: 25, left: 0, right: 0, height: 14, backgroundColor: COLORS.orange },
  
  diagonalsContainerAlumno: { position: 'absolute', bottom: 22, left: -10, flexDirection: 'row', transform: 'skewX(-20deg)' },
  diagonalsContainerPersonal: { position: 'absolute', bottom: 22, right: -10, flexDirection: 'row', transform: 'skewX(-20deg)' },
  diagonalBar: { width: 8, height: 22, backgroundColor: COLORS.teal, marginRight: 4 },

  // --- TÍTULOS ---
  titleAlumno: { position: 'absolute', top: 8, left: 15, fontSize: 18, fontWeight: '900', color: COLORS.teal, letterSpacing: 1 },
  titlePersonal: { fontSize: 14, fontWeight: '900', color: COLORS.teal, letterSpacing: 1, backgroundColor: COLORS.white, paddingHorizontal: 10 },

  // --- CUERPO PRINCIPAL ---
  mainBody: { position: 'absolute', top: 38, left: 10, right: 10, bottom: 45, flexDirection: 'row' },

  // --- FOTO ---
  photoSection: { width: 60, height: 80, position: 'relative' },
  photoBorderBox: { position: 'absolute', top: 0, left: 0, right: 3, bottom: 3, border: `1pt solid ${COLORS.orange}`, borderLeft: 'none' },
  photoImage: { position: 'absolute', top: 3, left: 3, right: 0, bottom: 0, objectFit: 'cover' },

  // --- SECCIÓN CENTRAL (DATOS) ---
  centerSection: { flex: 1, paddingHorizontal: 8, justifyContent: 'flex-start' },
  
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 5 },
  chevron: { color: COLORS.orange, fontSize: 18, fontWeight: 'bold', lineHeight: 0.8, marginRight: 5, marginTop: 1 },
  
  // Contenedor del nombre con control estricto de overflow
  nameContainer: { flex: 1, paddingRight: 5, height: 14, overflow: 'hidden' },
  firstName: { fontSize: 13, fontWeight: 'bold', color: COLORS.teal, lineHeight: 1, textOverflow: 'ellipsis' },
  lastName: { fontSize: 13, fontWeight: 'bold', color: COLORS.teal, lineHeight: 1, textOverflow: 'ellipsis' },

  // --- CAJA DE DATOS ---
  dataBox: { border: `1pt solid ${COLORS.orange}`, borderRadius: 4, padding: 5, flex: 1, justifyContent: 'space-between' },
  
  // Filas con altura fija (height: 9) para asegurar que el contenido extra se oculte y no empuje nada
  dataRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 2, height: 9, overflow: 'hidden' },
  dataRowTwoCols: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 2, height: 9, overflow: 'hidden' },
  
  // Separación explícita del 48% para dejar un "gap" de 4% en el medio
  dataColLeft: { width: '48%', flexDirection: 'row', alignItems: 'flex-end', overflow: 'hidden' },
  dataColRight: { width: '48%', flexDirection: 'row', alignItems: 'flex-end', overflow: 'hidden' },
  
  dataLabel: { fontSize: 6.5, color: COLORS.textDark, fontWeight: 'bold', marginRight: 2 },
  // El textOverflow: 'ellipsis' hace el trabajo de truncamiento visualmente
  dataValueLine: { fontSize: 6.5, color: COLORS.textDark, flex: 1, textOverflow: 'ellipsis' },

  // --- LOGOS ---
  logosSection: { width: 45, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 0 },
  logoTop: { width: 40, height: 45, backgroundColor: COLORS.bgGray, border: '0.5pt dashed #ccc', justifyContent: 'center' },
  logoBottom: { width: 36, height: 36, backgroundColor: COLORS.bgGray, border: '0.5pt dashed #ccc', borderRadius: 18, justifyContent: 'center' },

  // --- PIE DE PÁGINA ---
  footerTags: { position: 'absolute', bottom: 6, left: 10, right: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tagGroup: { flexDirection: 'row', alignItems: 'center', height: 12, overflow: 'hidden' },
  tagLabel: { fontSize: 7, color: COLORS.teal, marginRight: 4, fontWeight: 'bold' },
  tagBox: { border: `0.5pt solid ${COLORS.orange}`, borderRadius: 6, width: 45, height: 12, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2, overflow: 'hidden' },
  tagValue: { fontSize: 5.5, color: COLORS.textDark, textOverflow: 'ellipsis' }
});

const Diagonals = ({ isAlumno }: { isAlumno: boolean }) => (
  <View style={isAlumno ? styles.diagonalsContainerAlumno : styles.diagonalsContainerPersonal}>
    {[1, 2, 3, 4, 5, 6].map(i => <View key={i} style={styles.diagonalBar} />)}
  </View>
);

const safeText = (value: unknown) => (value == null || value === '' ? 'N/A' : String(value));

export const CredencialesPDF = ({ usuarios, tipo = 'ALUMNO' }: { usuarios: any[], tipo: 'ALUMNO' | 'PERSONAL' }) => {
  const isAlumno = tipo === 'ALUMNO';
  
  const chunkArray = (arr: any[], size: number) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) result.push(arr.slice(i, i + size));
    return result;
  };
  
  const pages = chunkArray(usuarios, 8);

  return (
    <Document>
      {pages.map((pageData, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          <View style={styles.grid}>
            {pageData.map((user, i) => {
              const institucion = user?.institucion ?? {};
              const disciplina = user?.disciplina ?? {};
              const categoria = user?.categoria ?? {};
              const nombreCompleto = [user?.nombres, user?.apellidoPaterno, user?.apellidoMaterno].filter(Boolean).join(' ').trim();

              return (
                <View key={i} style={styles.card}>
                  
                  {isAlumno ? (
                    <>
                      <Text style={styles.titleAlumno}>ALUMNO</Text>
                      <View style={styles.topStripeAlumno} />
                    </>
                  ) : (
                    <View style={styles.topStripePersonal}>
                      <Text style={styles.titlePersonal}>PERSONAL DE APOYO</Text>
                    </View>
                  )}

                  <View style={styles.mainBody}>
                    
                    {/* FOTO */}
                    <View style={styles.photoSection}>
                      <View style={styles.photoBorderBox} />
                      <View style={[styles.photoImage, { backgroundColor: '#e0e0e0' }]} /> 
                    </View>

                    {/* DATOS CENTRALES */}
                    <View style={styles.centerSection}>
                      <View style={styles.nameRow}>
                        <Text style={styles.chevron}>{'>'}</Text>
                        <View style={styles.nameContainer}>
                          <Text style={styles.firstName}>{safeText(user?.nombres)}</Text>
                          <Text style={styles.lastName}>{safeText(user?.apellidoPaterno)}</Text>
                        </View>
                      </View>

                      <View style={styles.dataBox}>
                        <View style={styles.dataRow}>
                          <Text style={styles.dataLabel}>Inst:</Text>
                          <Text style={styles.dataValueLine}>{safeText(institucion.nombre)}</Text>
                        </View>
                        
                        <View style={styles.dataRowTwoCols}>
                          <View style={styles.dataColLeft}>
                            <Text style={styles.dataLabel}>Clave:</Text>
                            <Text style={styles.dataValueLine}>{safeText(institucion.cct)}</Text>
                          </View>
                          <View style={styles.dataColRight}>
                            <Text style={styles.dataLabel}>Edo:</Text>
                            <Text style={styles.dataValueLine}>{safeText(institucion.estado)}</Text>
                          </View>
                        </View>
                        
                        {isAlumno && (
                          <>
                            <View style={styles.dataRow}>
                              <Text style={styles.dataLabel}>Alumno:</Text>
                              <Text style={styles.dataValueLine}>{safeText(nombreCompleto)}</Text>
                            </View>
                            <View style={styles.dataRow}>
                              <Text style={styles.dataLabel}>Matrícula:</Text>
                              <Text style={styles.dataValueLine}>{safeText(user?.matricula)}</Text>
                            </View>
                            <View style={styles.dataRow}>
                              <Text style={styles.dataLabel}>CURP:</Text>
                              <Text style={styles.dataValueLine}>{safeText(user?.curp)}</Text>
                            </View>
                            
                            <View style={styles.dataRowTwoCols}>
                              <View style={styles.dataColLeft}>
                                <Text style={styles.dataLabel}>Tel:</Text>
                                <Text style={styles.dataValueLine}>{safeText(user?.telefono)}</Text>
                              </View>
                              <View style={styles.dataColRight}>
                                <Text style={styles.dataLabel}>Sem:</Text>
                                <Text style={styles.dataValueLine}>{safeText(user?.semestre)}</Text>
                              </View>
                            </View>
                          </>
                        )}

                        {!isAlumno && (
                          <>
                            <View style={styles.dataRow}>
                              <Text style={styles.dataLabel}>CURP:</Text>
                              <Text style={styles.dataValueLine}>{safeText(user?.curp)}</Text>
                            </View>
                            <View style={styles.dataRow}>
                              <Text style={styles.dataLabel}>Tel:</Text>
                              <Text style={styles.dataValueLine}>{safeText(user?.telefono)}</Text>
                            </View>
                            <View style={styles.dataRow}>
                              <Text style={styles.dataLabel}>Cargo:</Text>
                              <Text style={styles.dataValueLine}>{safeText(user?.puesto ?? user?.rol)}</Text>
                            </View>
                          </>
                        )}
                      </View>
                    </View>

                    {/* LOGOS */}
                    <View style={styles.logosSection}>
                      <View style={styles.logoTop}><Text style={{fontSize: 5, textAlign: 'center'}}>ENIEP</Text></View>
                      <View style={styles.logoBottom}><Text style={{fontSize: 5, textAlign: 'center'}}>PREPA</Text></View>
                    </View>

                  </View>

                  <View style={styles.bottomStripe} />
                  <Diagonals isAlumno={isAlumno} />

                  {/* ETIQUETAS INFERIORES */}
                  <View style={styles.footerTags}>
                    <View style={styles.tagGroup}>
                      <Text style={styles.tagLabel}>Disciplina:</Text>
                      <View style={[styles.tagBox, { width: 60 }]}>
                        <Text style={styles.tagValue}>{safeText(disciplina.nombre)}</Text>
                      </View>
                    </View>
                    <View style={styles.tagGroup}>
                      <Text style={styles.tagLabel}>Categoría:</Text>
                      <View style={styles.tagBox}>
                        <Text style={styles.tagValue}>{safeText(categoria.nombre)}</Text>
                      </View>
                    </View>
                    <View style={styles.tagGroup}>
                      <Text style={styles.tagLabel}>Rama:</Text>
                      <View style={styles.tagBox}>
                        <Text style={styles.tagValue}>{safeText(disciplina.rama)}</Text>
                      </View>
                    </View>
                  </View>

                </View>
              );
            })}
          </View>
        </Page>
      ))}
    </Document>
  );
};