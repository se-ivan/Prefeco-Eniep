import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

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
  mainBody: { position: 'absolute', top: 38, left: 10, right: 10, bottom: 42, flexDirection: 'row' },

  // --- FOTO ---
  photoSection: { width: 60, height: 80, position: 'relative' },
  photoBorderBox: { position: 'absolute', top: 0, left: 0, right: 3, bottom: 3, border: `1pt solid ${COLORS.orange}`, borderLeft: 'none' },
  photoImage: { position: 'absolute', top: 3, left: 3, right: 0, bottom: 0, objectFit: 'cover' },

  // --- SECCIÓN CENTRAL (DATOS) ---
  centerSection: { flex: 1, paddingHorizontal: 8, justifyContent: 'flex-start' },
  
  nameRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  chevron: { color: COLORS.orange, fontSize: 18, fontWeight: 'bold', lineHeight: 0.8, marginRight: 5, marginTop: 1 },
  
  // SOLUCIÓN 1: Se eliminó el "height" fijo miniatura para que los nombres puedan respirar en dos líneas
  nameContainer: { flex: 1, paddingRight: 5, justifyContent: 'center' },
  firstName: { fontSize: 3, fontWeight: 'bold', color: COLORS.teal },
  lastName: { fontSize: 3, fontWeight: 'bold', color: COLORS.teal },

  // --- CAJA DE DATOS ---
  // SOLUCIÓN 2: justify-content space-evenly distribuye las filas sin aplastarlas
  dataBox: { border: `1pt solid ${COLORS.orange}`, borderRadius: 4, padding: 5, flex: 1, justifyContent: 'space-evenly' },
  
  // SOLUCIÓN 3: Altura fija de 10pt (exactamente 1 línea de texto) y overflow hidden cortan cualquier salto de línea extra.
  dataRow: { flexDirection: 'row', alignItems: 'flex-end', height: 10, overflow: 'hidden' },
  dataRowTwoCols: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 10, overflow: 'hidden' },
  
  // Damos más espacio a la Clave (CCT), que suele ser más larga que Edo.
  dataColLeft: { width: '55%', flexDirection: 'row', alignItems: 'flex-end', paddingRight: 4, overflow: 'hidden' },
  dataColRight: { width: '45%', flexDirection: 'row', alignItems: 'flex-end', overflow: 'hidden' },
  
  dataLabel: { fontSize: 6.5, color: COLORS.textDark, fontWeight: 'bold', marginRight: 2 },
  dataValueLine: { fontSize: 6.5, color: COLORS.textDark, flex: 1 },

  // --- LOGOS ---
  logosSection: { width: 45, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 0 },
  logoTop: { width: 40, height: 45, justifyContent: 'center' },
  logoBottom: { width: 36, height: 36, justifyContent: 'center' },
  logoTopImage: { width: '100%', height: '100%', objectFit: 'contain' },
  logoBottomImage: { width: '100%', height: '100%', objectFit: 'contain' },

  // --- PIE DE PÁGINA ---
  footerTags: { position: 'absolute', bottom: 6, left: 10, right: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  // SOLUCIÓN 5: Usar flex: 1 en lugar de width: 60 permite que las pastillas se estiren si el texto ("Ajedrez Individual") lo necesita
  tagGroup: { flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 4, overflow: 'hidden' },
  tagLabel: { fontSize: 6.5, color: COLORS.teal, marginRight: 2, fontWeight: 'bold' },
  tagBox: { border: `0.5pt solid ${COLORS.orange}`, borderRadius: 6, flex: 1, height: 12, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, overflow: 'hidden' },
  tagValue: { fontSize: 5.5, color: COLORS.textDark }
});

const Diagonals = ({ isAlumno }: { isAlumno: boolean }) => (
  <View style={isAlumno ? styles.diagonalsContainerAlumno : styles.diagonalsContainerPersonal}>
    {[1, 2, 3, 4, 5, 6].map(i => <View key={i} style={styles.diagonalBar} />)}
  </View>
);

const safeText = (value: unknown) => (value == null || value === '' ? 'N/A' : String(value));

const LEFT_LOGO_SRC = '/logo-escuela.png';
const RIGHT_LOGO_SRC = '/logo-eniep.png';

const getProxiedImageUrl = (url: string | null | undefined): string => {
  if (!url) return '';
  if (url.startsWith('http')) {
    return `/api/proxy-image?url=${encodeURIComponent(url)}`;
  }
  return url;
};

const fitFontSize = (value: unknown, base: number, min: number, step = 12) => {
  const len = safeText(value).length;
  if (len <= step) return base;
  const reduced = base - Math.ceil((len - step) / step) * 0.5;
  return Math.max(min, reduced);
};

const truncateText = (text: string, maxLength: number = 30) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim();
};

export const CredencialesPDF = ({
  usuarios,
  tipo = 'ALUMNO',
  institucionLogoUrl,
}: {
  usuarios: any[];
  tipo: 'ALUMNO' | 'PERSONAL';
  institucionLogoUrl?: string | null;
}) => {
  const isAlumno = tipo === 'ALUMNO';
  const dynamicInstitutionLogo = institucionLogoUrl ? getProxiedImageUrl(institucionLogoUrl) : LEFT_LOGO_SRC;
  
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
              const nombreCorto = [user?.nombres, user?.apellidoPaterno].filter(Boolean).join(' ').trim();
              const nameFont = fitFontSize(nombreCompleto, 8, 9, 10);
              const dataFont = fitFontSize(`${institucion?.nombre ?? ''}${institucion?.cct ?? ''}${user?.puesto ?? ''}`, 6.5, 5, 14);
              const cctFont = fitFontSize(institucion?.cct ?? '', 6.5, 4.5, 8);
              const tagFont = fitFontSize(`${disciplina?.nombre ?? ''}${categoria?.nombre ?? ''}${disciplina?.rama ?? ''}`, 5.5, 4.5, 10);
              const edoFont = fitFontSize(institucion?.estado ?? '', 6.5, 4.5, 14); // Nuevo cálculo dinámico extra para Edo
              const photoUrl = user?.fotoUrl ? String(user.fotoUrl) : '';

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
                      {photoUrl ? (
                        <Image src={getProxiedImageUrl(photoUrl)} style={styles.photoImage} />
                      ) : (
                        <View style={[styles.photoImage, { backgroundColor: '#e0e0e0' }]} />
                      )}
                    </View>

                    {/* DATOS CENTRALES */}
                    <View style={styles.centerSection}>
                      <View style={styles.nameRow}>
                        <Text style={styles.chevron}>{'>'}</Text>
                        <View style={styles.nameContainer}>
                          <Text style={[styles.firstName, { fontSize: nameFont }]}>{safeText(user?.nombres).toUpperCase()}</Text>
                          <Text style={[styles.lastName, { fontSize: nameFont }]}>{safeText(user?.apellidoPaterno).toUpperCase()}</Text>
                        </View>
                      </View>

                      <View style={styles.dataBox}>
                        <View style={styles.dataRow}>
                          <Text style={styles.dataLabel}>Inst:</Text>
                          <Text style={[styles.dataValueLine, { fontSize: dataFont }]}>{safeText(institucion.nombre)}</Text>
                        </View>
                        
                        <View style={styles.dataRowTwoCols}>
                          <View style={styles.dataColLeft}>
                            <Text style={styles.dataLabel}>Clave:</Text>
                            <Text style={[styles.dataValueLine, { fontSize: cctFont }]}>{safeText(institucion.cct)}</Text>
                          </View>
                          <View style={styles.dataColRight}>
                            <Text style={styles.dataLabel}>Edo:</Text>
                            <Text style={[styles.dataValueLine, { fontSize: edoFont }]}>{safeText(institucion.estado)}</Text>
                          </View>
                        </View>
                        
                        {isAlumno && (
                          <>
                            <View style={styles.dataRow}>
                              <Text style={styles.dataLabel}>Alumno:</Text>
                              <Text style={[styles.dataValueLine, { fontSize: dataFont }]}>{truncateText(safeText(nombreCorto)).toUpperCase()}</Text>
                            </View>
                            <View style={styles.dataRow}>
                              <Text style={styles.dataLabel}>Matrícula:</Text>
                              <Text style={[styles.dataValueLine, { fontSize: dataFont }]}>{safeText(user?.matricula)}</Text>
                            </View>
                            <View style={styles.dataRow}>
                              <Text style={styles.dataLabel}>CURP:</Text>
                              <Text style={[styles.dataValueLine, { fontSize: dataFont }]}>{safeText(user?.curp)}</Text>
                            </View>
                            
                            <View style={styles.dataRowTwoCols}>
                              <View style={styles.dataColLeft}>
                                <Text style={styles.dataLabel}>Tel:</Text>
                                <Text style={[styles.dataValueLine, { fontSize: dataFont }]}>{safeText(user?.telefono)}</Text>
                              </View>
                              <View style={styles.dataColRight}>
                                <Text style={styles.dataLabel}>Sem:</Text>
                                <Text style={[styles.dataValueLine, { fontSize: dataFont }]}>{safeText(user?.semestre)}</Text>
                              </View>
                            </View>
                          </>
                        )}

                        {!isAlumno && (
                          <>
                            <View style={styles.dataRow}>
                              <Text style={styles.dataLabel}>CURP:</Text>
                              <Text style={[styles.dataValueLine, { fontSize: dataFont }]}>{safeText(user?.curp)}</Text>
                            </View>
                            <View style={styles.dataRow}>
                              <Text style={styles.dataLabel}>Tel:</Text>
                              <Text style={[styles.dataValueLine, { fontSize: dataFont }]}>{safeText(user?.telefono)}</Text>
                            </View>
                            <View style={styles.dataRow}>
                              <Text style={styles.dataLabel}>Cargo:</Text>
                              <Text style={[styles.dataValueLine, { fontSize: dataFont }]}>{safeText(user?.puesto ?? user?.rol)}</Text>
                            </View>
                          </>
                        )}
                      </View>
                    </View>

                    {/* LOGOS */}
                    <View style={styles.logosSection}>
                      <View style={styles.logoTop}>
                        <Image src={RIGHT_LOGO_SRC} style={styles.logoTopImage} />
                      </View>
                      <View style={styles.logoBottom}>
                        <Image src={dynamicInstitutionLogo} style={styles.logoBottomImage} />
                      </View>
                    </View>

                  </View>

                  <View style={styles.bottomStripe} />
                  <Diagonals isAlumno={isAlumno} />

                  {/* ETIQUETAS INFERIORES */}
                  <View style={styles.footerTags}>
                    <View style={styles.tagGroup}>
                      <Text style={styles.tagLabel}>Disciplina:</Text>
                      <View style={styles.tagBox}>
                        <Text style={[styles.tagValue, { fontSize: tagFont }]}>{safeText(disciplina.nombre)}</Text>
                      </View>
                    </View>
                    <View style={styles.tagGroup}>
                      <Text style={styles.tagLabel}>Categoría:</Text>
                      <View style={styles.tagBox}>
                        <Text style={[styles.tagValue, { fontSize: tagFont }]}>{safeText(categoria.nombre)}</Text>
                      </View>
                    </View>
                    <View style={styles.tagGroup}>
                      <Text style={styles.tagLabel}>Rama:</Text>
                      <View style={styles.tagBox}>
                        <Text style={[styles.tagValue, { fontSize: tagFont }]}>{safeText(disciplina.rama)}</Text>
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