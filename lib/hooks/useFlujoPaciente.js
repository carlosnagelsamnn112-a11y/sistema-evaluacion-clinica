import { useState, useCallback } from 'react'
import {
  getValidationData,
  insertHistoriaClinica,
  insertDassData,
  updateExploracionClinica,
  uploadFotoExploracion
} from '../queries'

const initialHistoriaState = {
  fechaNacimiento: '', contacto: '', sexo: '', semestre: '',
  enfermedadesSistemicas: '', tipoEnfermedad: '',
  tomaMedicamentos: '', tipoMedicamento: '',
  antecedentesPsicologicos: '', tipoEnfermedadPsicologica: '',
  habitoLabios: false, habitoMejillas: false, habitoLengua: false, habitoNo: false,
  sustanciasPsicoactivas: '', tipoSustancia: '', fumaCigarrilloVape: ''
}

const initialExploracionState = {
  presentaLesiones: '', mordeduraLabios: '', mordeduraMejillas: '', mordeduraLengua: '',
  ulceraTraumatica: '', queratosisFriccional: '', fibromaTraumatico: '',
  morsicatioBuccarum: '', morsicatioLabiarum: '', morsicatioLinguarum: '',
  descripcionLesion: '', foto1Url: '', foto2Url: ''
}

export default function useFlujoPaciente() {
  const [flujoVista, setFlujoVista] = useState('menu')
  const [flujoCedula, setFlujoCedula] = useState('')
  const [flujoPaciente, setFlujoPaciente] = useState(null)
  const [flujoError, setFlujoError] = useState('')
  const [flujoLoading, setFlujoLoading] = useState(false)

  // Autocompletado de EPS
  const [epsInput, setEpsInput] = useState('')
  const [epsFiltered, setEpsFiltered] = useState([])
  const [showEps, setShowEps] = useState(false)

  // Estados de formularios
  const [historia, setHistoria] = useState(initialHistoriaState)
  const [respuestasDass, setRespuestasDass] = useState({})
  const [exploracion, setExploracion] = useState(initialExploracionState)

  // Subida de fotos
  const [subiendoFoto, setSubiendoFoto] = useState(false)
  const [fotoError, setFotoError] = useState('')

  const resetFlujoForms = useCallback(() => {
    setRespuestasDass({})
    setExploracion(initialExploracionState)
    setHistoria(initialHistoriaState)
    setEpsInput('')
    setFlujoError('')
  }, [])

  const calcularEdad = useCallback((fechaNac) => {
    const hoy = new Date()
    const nac = new Date(fechaNac)
    let edad = hoy.getFullYear() - nac.getFullYear()
    const m = hoy.getMonth() - nac.getMonth()
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--
    return edad
  }, [])

  const validarCedulaFlujo = useCallback(async (tipo) => {
    if (!flujoCedula) { setFlujoError('Ingrese el número de cédula'); return }
    setFlujoLoading(true)
    setFlujoError('')
    try {
      const data = await getValidationData(flujoCedula)

      if (!data.c1 || data.c1.length === 0) {
        setFlujoError('El paciente debe tener el Consentimiento 1 firmado')
        setFlujoLoading(false)
        return
      }
      if (!data.c2 || data.c2.length === 0) {
        setFlujoError('El paciente debe tener el Consentimiento 2 firmado')
        setFlujoLoading(false)
        return
      }

      if (tipo === 'historia') {
        if (data.historia && data.historia.length > 0) {
          setFlujoError('Este paciente ya tiene historia clínica registrada')
          setFlujoLoading(false)
          return
        }
      }

      if (tipo === 'encuesta') {
        if (!data.historia || data.historia.length === 0) {
          setFlujoError('Debe registrar primero la historia clínica')
          setFlujoLoading(false)
          return
        }
        if (data.encuesta && data.encuesta.length > 0) {
          setFlujoError('Este paciente ya completó la encuesta')
          setFlujoLoading(false)
          return
        }
      }

      if (tipo === 'exploracion') {
        if (!data.historia || data.historia.length === 0) {
          setFlujoError('Debe registrar primero la historia clínica')
          setFlujoLoading(false)
          return
        }
        if (!data.encuesta || data.encuesta.length === 0) {
          setFlujoError('Debe completar primero la encuesta')
          setFlujoLoading(false)
          return
        }
        if (data.exploracion && data.exploracion.length > 0 && data.exploracion[0].presenta_lesiones) {
          setFlujoError('Este paciente ya tiene exploración clínica registrada')
          setFlujoLoading(false)
          return
        }
      }

      if (!data.paciente) {
        setFlujoError('Paciente no encontrado')
        setFlujoLoading(false)
        return
      }

      setFlujoPaciente(data.paciente)
      setFlujoVista(tipo)
    } catch (e) {
      console.error(e)
      setFlujoError('Error al verificar')
    } finally {
      setFlujoLoading(false)
    }
  }, [flujoCedula])

  const guardarHistoria = useCallback(async (callbackCargarDatos) => {
    if (!historia.fechaNacimiento || !historia.contacto || !epsInput || !historia.sexo || !historia.semestre) {
      setFlujoError('Complete todos los campos requeridos')
      return
    }
    if (!historia.habitoNo && !historia.habitoLabios && !historia.habitoMejillas && !historia.habitoLengua) {
      setFlujoError('Seleccione al menos una opción de hábitos orales')
      return
    }
    if (!historia.fumaCigarrilloVape) {
      setFlujoError('Seleccione una opción sobre consumo de cigarrillo/vape')
      return
    }
    setFlujoLoading(true)
    setFlujoError('')
    try {
      const semestre = parseInt(historia.semestre)
      const area = semestre <= 4 ? 'Preclínica' : 'Clínica'
      const edad = calcularEdad(historia.fechaNacimiento)
      const habitos = []
      if (historia.habitoNo) habitos.push('No')
      if (historia.habitoLabios) habitos.push('Mordedura de labios')
      if (historia.habitoMejillas) habitos.push('Mordedura de mejillas')
      if (historia.habitoLengua) habitos.push('Mordedura de lengua')

      await insertHistoriaClinica({
        paciente_id: flujoPaciente.id,
        cedula: flujoPaciente.cedula,
        fecha_nacimiento: historia.fechaNacimiento,
        contacto: historia.contacto,
        eps: epsInput,
        edad,
        sexo: historia.sexo,
        semestre,
        area,
        enfermedades_sistemicas: historia.enfermedadesSistemicas === 'Sí' ? historia.tipoEnfermedad : 'No',
        tipo_enfermedad: historia.tipoEnfermedad,
        toma_medicamentos: historia.tomaMedicamentos === 'Sí' ? historia.tipoMedicamento : 'No',
        tipo_medicamento: historia.tipoMedicamento,
        antecedentes_psicologicos: historia.antecedentesPsicologicos === 'Sí' ? historia.tipoEnfermedadPsicologica : 'No',
        tipo_enfermedad_psicologica: historia.tipoEnfermedadPsicologica,
        habitos_orales: habitos.join(', '),
        habito_labios: historia.habitoLabios ? 'Sí' : 'No',
        habito_mejillas: historia.habitoMejillas ? 'Sí' : 'No',
        habito_lengua: historia.habitoLengua ? 'Sí' : 'No',
        sustancias_psicoactivas: historia.sustanciasPsicoactivas === 'Sí' ? historia.tipoSustancia : 'No',
        tipo_sustancia: historia.tipoSustancia,
        fuma_cigarrillo_vape: historia.fumaCigarrilloVape
      })
      
      setFlujoVista('exito')
      if (callbackCargarDatos) await callbackCargarDatos()
    } catch (e) {
      setFlujoError('Error al guardar: ' + e.message)
    } finally {
      setFlujoLoading(false)
    }
  }, [historia, epsInput, flujoPaciente, calcularEdad])

  const guardarEncuesta = useCallback(async (preguntas, callbackCargarDatos) => {
    const faltantes = preguntas.map((_, i) => respuestasDass[i] === undefined ? i + 1 : null).filter(Boolean)
    if (faltantes.length > 0) {
      setFlujoError(`Faltan las preguntas: ${faltantes.join(', ')}`)
      return
    }
    setFlujoLoading(true)
    setFlujoError('')
    try {
      const obj = {}
      preguntas.forEach((_, i) => { obj[`p${i + 1}`] = parseInt(respuestasDass[i]) })

      const r = preguntas.map((_, i) => parseInt(respuestasDass[i]))
      const depresion = [2, 4, 9, 12, 15, 16, 20].reduce((a, i) => a + r[i], 0) * 2
      const ansiedad = [1, 3, 6, 8, 14, 18, 19].reduce((a, i) => a + r[i], 0) * 2
      const estres = [0, 5, 7, 10, 11, 13, 17].reduce((a, i) => a + r[i], 0) * 2

      const interp = (p, tipo) => {
        if (tipo === 'depresion') {
          if (p <= 9) return 'Normal'
          if (p <= 13) return 'Leve'
          if (p <= 20) return 'Moderado'
          if (p <= 27) return 'Severo'
          return 'Extremadamente severo'
        }
        if (tipo === 'ansiedad') {
          if (p <= 7) return 'Normal'
          if (p <= 9) return 'Leve'
          if (p <= 14) return 'Moderado'
          if (p <= 19) return 'Severo'
          return 'Extremadamente severo'
        }
        if (p <= 14) return 'Normal'
        if (p <= 18) return 'Leve'
        if (p <= 25) return 'Moderado'
        if (p <= 33) return 'Severo'
        return 'Extremadamente severo'
      }

      const intD = interp(depresion, 'depresion')
      const intA = interp(ansiedad, 'ansiedad')
      const intE = interp(estres, 'estres')

      const datosDass = {
        tiene_depresion: (intD === 'Severo' || intD === 'Extremadamente severo') ? 'Sí' : 'No',
        tiene_ansiedad: (intA === 'Severo' || intA === 'Extremadamente severo') ? 'Sí' : 'No',
        tiene_estres: (intE === 'Severo' || intE === 'Extremadamente severo') ? 'Sí' : 'No'
      }

      await insertDassData({
        pacienteId: flujoPaciente.id,
        cedula: flujoPaciente.cedula,
        respuestas: obj,
        analisis: {
          puntaje_depresion: depresion,
          puntaje_ansiedad: ansiedad,
          puntaje_estres: estres,
          interpretacion_depresion: intD,
          interpretacion_ansiedad: intA,
          interpretacion_estres: intE
        },
        datosDass
      })

      setFlujoVista('exito')
      if (callbackCargarDatos) await callbackCargarDatos()
    } catch (e) {
      setFlujoError('Error al guardar: ' + e.message)
    } finally {
      setFlujoLoading(false)
    }
  }, [respuestasDass, flujoPaciente])

  const guardarExploracion = useCallback(async (callbackCargarDatos) => {
    if (!exploracion.presentaLesiones) {
      setFlujoError('Indique si el paciente presenta lesiones orales')
      return
    }

    const localizacion = ['mordeduraLabios', 'mordeduraMejillas', 'mordeduraLengua']
    const tipoLesion = ['ulceraTraumatica', 'queratosisFriccional', 'fibromaTraumatico', 'morsicatioBuccarum', 'morsicatioLabiarum', 'morsicatioLinguarum']

    if (exploracion.presentaLesiones === 'Sí') {
      const tieneLocalizacion = localizacion.some(k => exploracion[k] === 'Sí')
      if (!tieneLocalizacion) { setFlujoError('Marque al menos una opción en Localización de la lesión'); return }
      const tieneTipo = tipoLesion.some(k => exploracion[k] === 'Sí')
      if (!tieneTipo) { setFlujoError('Marque al menos una opción en Tipo de lesión'); return }
      if (!exploracion.descripcionLesion.trim()) { setFlujoError('La descripción de la lesión es obligatoria'); return }
      if (!exploracion.foto1Url && !exploracion.foto2Url) { setFlujoError('Debe subir al menos una foto de evidencia'); return }
    }

    setFlujoLoading(true)
    setFlujoError('')
    try {
      const normalizar = (lista) => {
        const obj = {}
        lista.forEach(k => { obj[k] = exploracion[k] === 'Sí' ? 'Sí' : 'No' })
        return obj
      }
      const camposNormalizados = exploracion.presentaLesiones === 'Sí'
        ? { ...normalizar(localizacion), ...normalizar(tipoLesion) }
        : { mordeduraLabios: 'No', mordeduraMejillas: 'No', mordeduraLengua: 'No', ulceraTraumatica: 'No', queratosisFriccional: 'No', fibromaTraumatico: 'No', morsicatioBuccarum: 'No', morsicatioLabiarum: 'No', morsicatioLinguarum: 'No' }

      await updateExploracionClinica(flujoPaciente.cedula, {
        presenta_lesiones: exploracion.presentaLesiones,
        mordedura_labios: camposNormalizados.mordeduraLabios,
        mordedura_mejillas: camposNormalizados.mordeduraMejillas,
        mordedura_lengua: camposNormalizados.mordeduraLengua,
        ulcera_traumatica: camposNormalizados.ulceraTraumatica,
        queratosis_friccional: camposNormalizados.queratosisFriccional,
        fibroma_traumatico: camposNormalizados.fibromaTraumatico,
        morsicatio_buccarum: camposNormalizados.morsicatioBuccarum,
        morsicatio_labiarum: camposNormalizados.morsicatioLabiarum,
        morsicatio_linguarum: camposNormalizados.morsicatioLinguarum,
        descripcion_lesion: exploracion.descripcionLesion || null,
        foto1_url: exploracion.foto1Url || null,
        foto2_url: exploracion.foto2Url || null
      })

      setFlujoVista('exito')
      if (callbackCargarDatos) await callbackCargarDatos()
    } catch (e) {
      setFlujoError('Error al guardar: ' + e.message)
    } finally {
      setFlujoLoading(false)
    }
  }, [exploracion, flujoPaciente])

  const subirFotoFormulario = useCallback(async (archivo, slot) => {
    if (!archivo) return
    if (!archivo.type.startsWith('image/')) { setFotoError('Solo se permiten imágenes'); return }
    if (archivo.size > 5 * 1024 * 1024) { setFotoError('La imagen no puede superar 5MB'); return }
    setSubiendoFoto(true)
    setFotoError('')
    try {
      const publicUrl = await uploadFotoExploracion(flujoPaciente.cedula, slot, archivo)
      const campo = slot === 1 ? 'foto1Url' : 'foto2Url'
      setExploracion(prev => ({ ...prev, [campo]: publicUrl }))
    } catch (e) {
      setFotoError('Error al subir: ' + e.message)
    } finally {
      setSubiendoFoto(false)
    }
  }, [flujoPaciente])

  const eliminarFotoFormulario = useCallback((slot) => {
    const campo = slot === 1 ? 'foto1Url' : 'foto2Url'
    setExploracion(prev => ({ ...prev, [campo]: '' }))
  }, [])

  return {
    flujoVista,
    setFlujoVista,
    flujoCedula,
    setFlujoCedula,
    flujoPaciente,
    setFlujoPaciente,
    flujoError,
    setFlujoError,
    flujoLoading,
    epsInput,
    setEpsInput,
    epsFiltered,
    setEpsFiltered,
    showEps,
    setShowEps,
    historia,
    setHistoria,
    respuestasDass,
    setRespuestasDass,
    exploracion,
    setExploracion,
    subiendoFoto,
    fotoError,
    resetFlujoForms,
    validarCedulaFlujo,
    guardarHistoria,
    guardarEncuesta,
    guardarExploracion,
    subirFotoFormulario,
    eliminarFotoFormulario
  }
}
