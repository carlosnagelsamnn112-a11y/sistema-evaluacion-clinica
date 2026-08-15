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
    supabase.from('historias_clinicas').select('fecha_nacimiento').eq('cedula', cedula),
    supabase.from('respuestas_dass21').select('p1').eq('cedula', cedula),
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
 * Guarda la historia clínica del paciente.
 * Si ya existe una fila con esa cédula, la actualiza en vez de insertar
 * (evita duplicados por doble clic o reintentos).
 */
export async function insertHistoriaClinica(data) {
  const { data: existente } = await supabase
    .from('historias_clinicas')
    .select('id')
    .eq('cedula', data.cedula)
    .limit(1)
  if (existente && existente.length > 0) {
    const { error } = await supabase
      .from('historias_clinicas')
      .update(data)
      .eq('id', existente[0].id)
    if (error) throw error
    return
  }
  const { error } = await supabase.from('historias_clinicas').insert(data)
  if (error) throw error
}

/**
 * Guarda las respuestas DASS-21 y el análisis asociado, además de actualizar/crear la exploración
 */
export async function insertDassData({ pacienteId, cedula, respuestas, analisis, datosDass }) {
  // Verificar si ya existe una encuesta completada para esta cédula (evita duplicados por doble clic o reintentos)
  const { data: existente, error: errExist } = await supabase
    .from('respuestas_dass21')
    .select('id')
    .eq('cedula', cedula)
    .not('p1', 'is', null)
    .limit(1)
  if (errExist) throw errExist

  if (existente && existente.length > 0) {
    // Ya existe: actualizar respuestas, análisis y flags en lugar de insertar de nuevo
    const { error: errRespUpd } = await supabase
      .from('respuestas_dass21')
      .update({ ...respuestas })
      .eq('cedula', cedula)
      .not('p1', 'is', null)
    if (errRespUpd) throw errRespUpd

    const { error: errAnalUpd } = await supabase
      .from('analisis_dass21')
      .update({ ...analisis })
      .eq('cedula', cedula)
    if (errAnalUpd) throw errAnalUpd

    const { data: existeExpl, error: errExist2 } = await supabase
      .from('exploracion_clinica')
      .select('id')
      .eq('cedula', cedula)
    if (errExist2) throw errExist2

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
    return
  }

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
  const { data: existeExpl, error: errExistExpl } = await supabase
    .from('exploracion_clinica')
    .select('id')
    .eq('cedula', cedula)
  if (errExistExpl) throw errExistExpl

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
 * Guarda los resultados de la exploración clínica.
 * Si la fila no existe para esa cédula, la crea (evita perder datos sin fila base).
 */
export async function updateExploracionClinica(cedula, data) {
  const { data: existente } = await supabase
    .from('exploracion_clinica')
    .select('id')
    .eq('cedula', cedula)
    .limit(1)
  if (existente && existente.length > 0) {
    const { error } = await supabase
      .from('exploracion_clinica')
      .update(data)
      .eq('id', existente[0].id)
    if (error) throw error
    return
  }
  const { data: paciente } = await supabase
    .from('pacientes')
    .select('id')
    .eq('cedula', cedula)
    .limit(1)
  const { error } = await supabase.from('exploracion_clinica').insert({
    paciente_id: paciente && paciente.length > 0 ? paciente[0].id : null,
    cedula,
    ...data
  })
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
 * Elimina todos los consentimientos (C1 y C2) de un paciente por su cédula
 */
export async function deleteConsentimientosDePaciente(cedula) {
  const { error } = await supabase.from('consentimientos').delete().eq('cedula', cedula)
  if (error) throw error
}

/**
 * Actualiza nombre, apellidos y/o cédula de un paciente en todas sus tablas
 */
export async function updatePacienteDatos(pacienteId, cedulaAnterior, datos) {
  const { nombre, apellidos, cedula } = datos

  if (cedula !== cedulaAnterior) {
    const { data: duplicado } = await supabase
      .from('pacientes')
      .select('id')
      .eq('cedula', cedula)
      .neq('id', pacienteId)
    if (duplicado && duplicado.length > 0) {
      throw new Error('Ya existe otro paciente con esa cédula')
    }
  }

  const { error: errPac } = await supabase
    .from('pacientes')
    .update({ nombre, apellidos, cedula })
    .eq('id', pacienteId)
  if (errPac) throw errPac

  if (cedula !== cedulaAnterior) {
    const tablas = ['consentimientos', 'historias_clinicas', 'respuestas_dass21', 'analisis_dass21', 'exploracion_clinica']
    for (const t of tablas) {
      const { error: e } = await supabase
        .from(t)
        .update({ cedula })
        .eq('cedula', cedulaAnterior)
      if (e) throw e
    }
  }
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

/**
 * Elimina un archivo de foto del storage de Supabase a partir de su URL pública
 */
export async function deleteFotoFromStorage(url) {
  if (!url) return
  const bucketPrefix = '/storage/v1/object/public/exploracion-fotos/'
  const idx = url.indexOf(bucketPrefix)
  if (idx === -1) return
  const filePath = decodeURIComponent(url.substring(idx + bucketPrefix.length))
  const { error } = await supabase.storage
    .from('exploracion-fotos')
    .remove([filePath])
  if (error) throw error
}

/**
 * Sube una firma en Base64 a Supabase Storage y retorna la URL pública (con fallback a DataURL en caso de error)
 */
export async function uploadFirmaConsentimiento(cedula, tipo, firmaDataURL) {
  if (!firmaDataURL || !firmaDataURL.startsWith('data:image')) {
    return firmaDataURL
  }
  try {
    const res = await fetch(firmaDataURL)
    const blob = await res.blob()
    const path = `firmas/${cedula}_c${tipo}_${Date.now()}.png`

    const { error: uploadError } = await supabase.storage
      .from('exploracion-fotos')
      .upload(path, blob, { contentType: 'image/png', upsert: true })

    if (uploadError) {
      console.warn('No se pudo subir la firma a Storage, guardando fallback:', uploadError.message)
      return firmaDataURL
    }

    const { data: urlData } = supabase.storage
      .from('exploracion-fotos')
      .getPublicUrl(path)

    return urlData.publicUrl || firmaDataURL
  } catch (err) {
    console.warn('Excepción al subir la firma a Storage:', err)
    return firmaDataURL
  }
}

