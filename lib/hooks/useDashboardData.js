import { useState, useCallback, useMemo } from 'react'
import {
  getDashboardData,
  deleteConsentimiento,
  deleteHistoriaClinica,
  deleteEncuestaDass21,
  resetExploracionClinica,
  insertEps,
  deleteEps,
  updateEps
} from '../queries'

export default function useDashboardData() {
  const [pacientes, setPacientes] = useState([])
  const [analisis, setAnalisis] = useState([])
  const [historias, setHistorias] = useState([])
  const [consentimientos, setConsentimientos] = useState([])
  const [exploraciones, setExploraciones] = useState([])
  const [epsBD, setEpsBD] = useState([])
  const [respuestas, setRespuestas] = useState([])
  const [loading, setLoading] = useState(true)

  const cargarDatos = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getDashboardData()
      setPacientes(data.pacientes)
      setAnalisis(data.analisis)
      setHistorias(data.historias)
      setConsentimientos(data.consentimientos)
      setExploraciones(data.exploraciones)
      setEpsBD(data.epsBD)
      setRespuestas(data.respuestas)
    } catch (e) {
      console.error('Error al cargar datos del dashboard:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  const pacientesOrdenados = useMemo(() => {
    return [...pacientes].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  }, [pacientes])

  const obtenerIdParticipante = useCallback((cedula) => {
    const idx = pacientesOrdenados.findIndex(p => p.cedula == cedula)
    return idx !== -1 ? idx + 1 : '—'
  }, [pacientesOrdenados])

  const ordenarPorIdParticipante = useCallback((lista) => {
    return [...lista].sort((a, b) => {
      const idA = obtenerIdParticipante(a.cedula)
      const idB = obtenerIdParticipante(b.cedula)
      if (idA === '—') return 1
      if (idB === '—') return -1
      return idA - idB
    })
  }, [obtenerIdParticipante])

  const getNombre = useCallback((cedula) => {
    const p = pacientes.find(x => x.cedula == cedula)
    return p ? `${p.nombre} ${p.apellidos}` : '—'
  }, [pacientes])

  const filtrar = useCallback((lista, busqueda) => {
    return lista.filter(item => {
      const nombre = getNombre(item.cedula)
      const cedula = item.cedula || ''
      return `${nombre} ${cedula}`.toLowerCase().includes(busqueda.toLowerCase())
    })
  }, [getNombre])

  // EPS CRUD
  const handleAgregarEps = useCallback(async (nuevaEps) => {
    if (!nuevaEps.trim()) return
    try {
      await insertEps(nuevaEps.trim())
      await cargarDatos()
    } catch (e) {
      console.error('Error al agregar EPS:', e)
      alert('Error al agregar EPS: ' + e.message)
    }
  }, [cargarDatos])

  const handleEliminarEps = useCallback(async (id) => {
    if (!confirm('¿Eliminar esta EPS?')) return
    try {
      await deleteEps(id)
      await cargarDatos()
    } catch (e) {
      console.error('Error al eliminar EPS:', e)
      alert('Error al eliminar EPS: ' + e.message)
    }
  }, [cargarDatos])

  const handleGuardarEditEps = useCallback(async (id, editEpsNombre) => {
    if (!editEpsNombre.trim()) return
    try {
      await updateEps(id, editEpsNombre)
      await cargarDatos()
    } catch (e) {
      console.error('Error al guardar edición de EPS:', e)
      alert('Error al guardar edición de EPS: ' + e.message)
    }
  }, [cargarDatos])

  // Eliminación de Registros Clínicos
  const handleEliminarConsentimiento = useCallback(async (id, tipoNombre, pacNombre) => {
    if (!confirm(`Advertencia: Eliminar el consentimiento de un paciente conservará su historia clínica y encuestas en la base de datos.\n\n¿Está seguro de que desea eliminar el ${tipoNombre} de ${pacNombre}?`)) return
    try {
      await deleteConsentimiento(id)
      alert(`${tipoNombre} eliminado con éxito.`)
      await cargarDatos()
    } catch (e) {
      console.error('Error al eliminar consentimiento:', e)
      alert('Error al eliminar consentimiento: ' + e.message)
    }
  }, [cargarDatos])

  const handleEliminarHistoria = useCallback(async (id, pacNombre) => {
    if (!confirm(`¿Está seguro de que desea eliminar la historia clínica de ${pacNombre}? Esta acción no se puede deshacer.`)) return
    try {
      await deleteHistoriaClinica(id)
      alert('Historia clínica eliminada con éxito.')
      await cargarDatos()
    } catch (e) {
      console.error('Error al eliminar historia clínica:', e)
      alert('Error al eliminar historia clínica: ' + e.message)
    }
  }, [cargarDatos])

  const handleEliminarEncuesta = useCallback(async (id, cedula, pacNombre) => {
    if (!confirm(`¿Está seguro de que desea eliminar la encuesta DASS-21 y su análisis asociado para ${pacNombre}?\n\nEsto también restablecerá las banderas de trastorno psicológico en la exploración clínica del paciente.`)) return
    try {
      await deleteEncuestaDass21(id, cedula)
      alert('Encuesta DASS-21 eliminada con éxito.')
      await cargarDatos()
    } catch (e) {
      console.error('Error al eliminar encuesta:', e)
      alert('Error al eliminar encuesta: ' + e.message)
    }
  }, [cargarDatos])

  const handleEliminarExploracion = useCallback(async (id, cedula, pacNombre) => {
    if (!confirm(`¿Está seguro de que desea eliminar los datos clínicos de la exploración (lesiones y fotos) de ${pacNombre}?`)) return
    try {
      await resetExploracionClinica(id)
      alert('Exploración clínica restablecida con éxito.')
      await cargarDatos()
    } catch (e) {
      console.error('Error al eliminar exploración clínica:', e)
      alert('Error al eliminar exploración clínica: ' + e.message)
    }
  }, [cargarDatos])

  return {
    pacientes,
    analisis,
    historias,
    consentimientos,
    exploraciones,
    epsBD,
    respuestas,
    loading,
    pacientesOrdenados,
    cargarDatos,
    obtenerIdParticipante,
    ordenarPorIdParticipante,
    getNombre,
    filtrar,
    agregarEps: handleAgregarEps,
    eliminarEps: handleEliminarEps,
    guardarEditEps: handleGuardarEditEps,
    eliminarConsentimiento: handleEliminarConsentimiento,
    eliminarHistoria: handleEliminarHistoria,
    eliminarEncuesta: handleEliminarEncuesta,
    eliminarExploracion: handleEliminarExploracion
  }
}
