import { supabase } from './supabase'

/**
 * Carga todos los datos iniciales necesarios para el panel de administración
 */
export async function getDashboardData() {
  const [
    { data: pacs },
    { data: anal },
    { data: hist },
    { data: cons },
    { data: expl },
    { data: epsData },
    { data: resp }
  ] = await Promise.all([
    supabase.from('pacientes').select('*').order('id', { ascending: true }),
    supabase.from('analisis_dass21').select('*').order('id', { ascending: true }),
    supabase.from('historias_clinicas').select('*').order('id', { ascending: true }),
    supabase.from('consentimientos').select('*').order('id', { ascending: true }),
    supabase.from('exploracion_clinica').select('*').order('id', { ascending: true }),
    supabase.from('eps').select('*').order('nombre'),
    supabase.from('respuestas_dass21').select('*').order('id', { ascending: true })
  ])

  return {
    pacientes: pacs || [],
    analisis: anal || [],
    historias: hist || [],
    consentimientos: cons || [],
    exploraciones: expl || [],
    epsBD: epsData || [],
    respuestas: resp || []
  }
}

/**
 * Valida el estado del paciente por su cédula para los diferentes flujos
 */
export async function getValidationData(cedula) {
  const [
    { data: c1 },
    { data: c2 },
    { data: hist },
    { data: enc },
    { data: expl },
    { data: pac }
  ] = await Promise.all([
    supabase.from('consentimientos').select('id').eq('cedula', cedula).eq('tipo', 1),
    supabase.from('consentimientos').select('id').eq('cedula', cedula).eq('tipo', 2),
    supabase.from('historias_clinicas').select('id').eq('cedula', cedula),
    supabase.from('respuestas_dass21').select('id').eq('cedula', cedula),
    supabase.from('exploracion_clinica').select('presenta_lesiones').eq('cedula', cedula),
    supabase.from('pacientes').select('*').eq('cedula', cedula).single()
  ])

  return {
    c1: c1 || [],
    c2: c2 || [],
    historia: hist || [],
    encuesta: enc || [],
    exploracion: expl || [],
    paciente: pac || null
  }
}

/**
 * Guarda la historia clínica del paciente
 */
export async function insertHistoriaClinica(data) {
  const { error } = await supabase.from('historias_clinicas').insert(data)
  if (error) throw error
}

/**
 * Guarda las respuestas DASS-21 y el análisis asociado, además de actualizar/crear la exploración
 */
export async function insertDassData({ pacienteId, cedula, respuestas, analisis, datosDass }) {
  // 1. Insertar respuestas DASS-21
  const { error: errResp } = await supabase.from('respuestas_dass21').insert({
    paciente_id: pacienteId,
    cedula,
    ...respuestas
  })
  if (errResp) throw errResp

  // 2. Insertar análisis DASS-21
  const { error: errAnal } = await supabase.from('analisis_dass21').insert({
    paciente_id: pacienteId,
    cedula,
    ...analisis
  })
  if (errAnal) throw errAnal

  // 3. Crear o actualizar la fila base de exploracion_clinica
  const { data: existeExpl, error: errExist } = await supabase
    .from('exploracion_clinica')
    .select('id')
    .eq('cedula', cedula)
  if (errExist) throw errExist

  if (existeExpl && existeExpl.length > 0) {
    const { error: errUpd } = await supabase
      .from('exploracion_clinica')
      .update(datosDass)
      .eq('cedula', cedula)
    if (errUpd) throw errUpd
  } else {
    const { error: errIns } = await supabase.from('exploracion_clinica').insert({
      paciente_id: pacienteId,
      cedula,
      ...datosDass
    })
    if (errIns) throw errIns
  }
}

/**
 * Guarda los resultados de la exploración clínica
 */
export async function updateExploracionClinica(cedula, data) {
  const { error } = await supabase
    .from('exploracion_clinica')
    .update(data)
    .eq('cedula', cedula)
  if (error) throw error
}

/**
 * Elimina un consentimiento por su ID
 */
export async function deleteConsentimiento(id) {
  const { error } = await supabase.from('consentimientos').delete().eq('id', id)
  if (error) throw error
}

/**
 * Elimina una historia clínica por su ID
 */
export async function deleteHistoriaClinica(id) {
  const { error } = await supabase.from('historias_clinicas').delete().eq('id', id)
  if (error) throw error
}

/**
 * Elimina las respuestas de DASS-21, análisis y resetea flags de exploración
 */
export async function deleteEncuestaDass21(analisisId, cedula) {
  const { error: errResp } = await supabase.from('respuestas_dass21').delete().eq('cedula', cedula)
  if (errResp) throw errResp

  const { error: errAnal } = await supabase.from('analisis_dass21').delete().eq('id', analisisId)
  if (errAnal) throw errAnal

  const { error: errExpl } = await supabase
    .from('exploracion_clinica')
    .update({
      tiene_depresion: 'No',
      tiene_ansiedad: 'No',
      tiene_estres: 'No'
    })
    .eq('cedula', cedula)
  if (errExpl) throw errExpl
}

/**
 * Resetea los datos de exploración clínica de un paciente (lesiones y fotos)
 */
export async function resetExploracionClinica(id) {
  const { error } = await supabase
    .from('exploracion_clinica')
    .update({
      presenta_lesiones: null,
      mordedura_labios: 'No',
      mordedura_mejillas: 'No',
      mordedura_lengua: 'No',
      ulcera_traumatica: 'No',
      queratosis_friccional: 'No',
      fibroma_traumatico: 'No',
      morsicatio_buccarum: 'No',
      morsicatio_labiarum: 'No',
      morsicatio_linguarum: 'No',
      descripcion_lesion: null,
      foto1_url: null,
      foto2_url: null
    })
    .eq('id', id)
  if (error) throw error
}

/**
 * Agrega una nueva EPS
 */
export async function insertEps(nombre) {
  const { error } = await supabase.from('eps').insert({ nombre })
  if (error) throw error
}

/**
 * Elimina una EPS por ID
 */
export async function deleteEps(id) {
  const { error } = await supabase.from('eps').delete().eq('id', id)
  if (error) throw error
}

/**
 * Actualiza el nombre de una EPS
 */
export async function updateEps(id, nombre) {
  const { error } = await supabase.from('eps').update({ nombre }).eq('id', id)
  if (error) throw error
}

/**
 * Sube una foto de exploración a Supabase Storage y retorna la URL pública
 */
export async function uploadFotoExploracion(cedula, slot, archivo) {
  const ext = archivo.name.split('.').pop()
  const path = `${cedula}/foto${slot}_${Date.now()}.${ext}`
  
  const { error: uploadError } = await supabase.storage
    .from('exploracion-fotos')
    .upload(path, archivo, { upsert: true })
  
  if (uploadError) throw uploadError

  const { data: urlData } = supabase.storage
    .from('exploracion-fotos')
    .getPublicUrl(path)
  
  return urlData.publicUrl
}
