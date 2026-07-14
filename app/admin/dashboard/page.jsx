'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useDashboardData from '@/lib/hooks/useDashboardData'
import useFlujoPaciente from '@/lib/hooks/useFlujoPaciente'
import useChi2 from '@/lib/hooks/useChi2'

// Importación de componentes
import EpsManager from './componentes/EpsManager'
import ConsentimientosList from './componentes/ConsentimientosList'
import HistoriasList from './componentes/HistoriasList'
import AnalisisDass from './componentes/AnalisisDass'
import ExploracionClinicaList from './componentes/ExploracionClinicaList'
import ResultadosEstudio from './componentes/ResultadosEstudio'
import PruebaChi2 from './componentes/PruebaChi2'
import FlujoPacienteForm from './componentes/FlujoPacienteForm'

const preguntas = [
  'Me costó mucho relajarme',
  'Me di cuenta que tenía la boca seca',
  'No podía sentir ningún sentimiento positivo',
  'Se me hizo difícil respirar',
  'Se me hizo difícil tomar la iniciativa para hacer cosas',
  'Reaccioné exageradamente en ciertas situaciones',
  'Sentí que mis manos temblaban',
  'Sentí que tenía muchos nervios',
  'Estaba preocupado por situaciones en las cuales podía tener pánico',
  'Sentí que no había nada que me ilusionara',
  'Me sentí agitado',
  'Se me hizo difícil relajarme',
  'Me sentí desanimado y melancólico',
  'No toleré nada que no me dejara continuar con lo que estaba haciendo',
  'Sentí que estaba a punto de pánico',
  'No me pude entusiasmar con nada',
  'Sentí que valía muy poco como persona',
  'Sentí que estaba muy irritable',
  'Sentí los latidos de mi corazón sin haber hecho esfuerzo físico',
  'Tuve miedo sin razón',
  'Sentí que la vida no tenía ningún sentido'
]

const s = {
  body: { backgroundColor: '#08080c', minHeight: '100vh', fontFamily: 'var(--font-sans)', color: '#fff' },
  header: { backgroundColor: '#0f1016', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' },
  main: { padding: '25px', maxWidth: '1200px', margin: '0 auto' },
  card: { backgroundColor: '#111218', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '20px', marginBottom: '15px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  th: { backgroundColor: '#16171f', color: '#9ca3af', padding: '12px 14px', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', fontWeight: '500', whiteSpace: 'nowrap' },
  td: { padding: '12px 14px', borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: '#d1d5db', verticalAlign: 'middle' },
  btn: { backgroundColor: '#1b1d26', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '6px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' },
  btnRed: { backgroundColor: 'rgba(239, 68, 68, 0.12)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '6px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' },
  btnGreen: { backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '6px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' },
  btnBlue: { backgroundColor: 'rgba(59, 130, 246, 0.12)', color: '#60a5fa', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '6px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' },
  input: { padding: '8px 12px', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', backgroundColor: '#15161e', color: '#fff', fontSize: '14px', boxSizing: 'border-box' },
  badge: (color) => ({ display: 'inline-block', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '500', backgroundColor: color === 'green' ? 'rgba(16, 185, 129, 0.1)' : color === 'red' ? 'rgba(239, 68, 68, 0.1)' : color === 'yellow' ? 'rgba(245, 158, 11, 0.1)' : '#2a2a2a', color: color === 'green' ? '#34d399' : color === 'red' ? '#f87171' : color === 'yellow' ? '#fbbf24' : '#9e9e9e', border: `1px solid ${color === 'green' ? 'rgba(16, 185, 129, 0.2)' : color === 'red' ? 'rgba(239, 68, 68, 0.2)' : color === 'yellow' ? 'rgba(245, 158, 11, 0.2)' : '#333'}` }),
  select: { padding: '8px 12px', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', backgroundColor: '#15161e', color: '#fff', fontSize: '14px' },
  textarea: { width: '100%', padding: '10px', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', backgroundColor: '#15161e', color: '#fff', fontSize: '14px', minHeight: '100px', boxSizing: 'border-box', resize: 'vertical' },
  tableWrap: { width: '100%' },
}

const colorBadge = (interp) => {
  if (!interp) return 'gray'
  if (interp === 'Normal') return 'green'
  if (interp === 'Leve' || interp === 'Moderado') return 'yellow'
  if (interp === 'Severo' || interp === 'Extremadamente severo') return 'red'
  return 'gray'
}

export default function Dashboard() {
  const router = useRouter()
  const [admin, setAdmin] = useState(null)
  const [vista, setVista] = useState('inicio')
  const [detalleVista, setDetalleVista] = useState('eps')
  const [busqueda, setBusqueda] = useState('')

  // Obtención de estados y lógica a través de los hooks
  const dashboardData = useDashboardData()
  const flujoState = useFlujoPaciente()
  const chi2State = useChi2()

  const {
    pacientes,
    analisis,
    historias,
    consentimientos,
    exploraciones,
    epsBD,
    respuestas,
    loading,
    cargarDatos,
    obtenerIdParticipante,
    ordenarPorIdParticipante,
    filtrar,
    agregarEps,
    eliminarEps,
    guardarEditEps,
    eliminarConsentimiento,
    eliminarHistoria,
    eliminarEncuesta,
    eliminarExploracion
  } = dashboardData

  // Validación de sesión del administrador
  useEffect(() => {
    const verificarSesion = async () => {
      const session = localStorage.getItem('adminSession')
      if (!session) {
        router.push('/admin/login')
        return
      }
      const data = JSON.parse(session)
      if (Date.now() - data.timestamp > 8 * 60 * 60 * 1000) {
        localStorage.removeItem('adminSession')
        router.push('/admin/login')
        return
      }
      setAdmin(data)
      await cargarDatos()
    }
    verificarSesion()
  }, [router, cargarDatos])

  const cerrarSesion = () => {
    localStorage.removeItem('adminSession')
    router.push('/')
  }

  if (loading) {
    return (
      <div style={{ ...s.body, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ color: '#888' }}>Cargando...</p>
      </div>
    )
  }

  return (
    <div style={s.body}>
      <style>{`
        .tabla-wrap-siempre { width: 100%; overflow-x: auto; }
        tr:hover td { background-color: rgba(255, 255, 255, 0.015); transition: background-color 0.15s ease; }
        button { transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
        button:hover { filter: brightness(1.15) contrast(1.05); transform: translateY(-1px); }
        button:active { transform: translateY(0) scale(0.98); }
        select, input, textarea { transition: all 0.2s ease; }
        select:focus, input:focus, textarea:focus { border-color: #fbbf24 !important; box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.15); }
      `}</style>

      {/* HEADER */}
      <div style={s.header}>
        <div>
          <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '500' }}>Panel de Administración</h1>
          <p style={{ margin: 0, fontSize: '13px', color: '#888' }}>Sistema de Evaluación Clínica — UAN Neiva</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ color: '#888', fontSize: '14px' }}>👤 {admin?.nombre}</span>
          <button style={s.btnRed} onClick={cerrarSesion}>Cerrar sesión</button>
        </div>
      </div>

      <div style={s.main}>
        {/* PANTALLA DE INICIO */}
        {vista === 'inicio' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', maxWidth: '600px', margin: '40px auto' }}>
            <button
              onClick={() => {
                setVista('flujo')
                flujoState.setFlujoVista('menu')
                flujoState.setFlujoCedula('')
                flujoState.setFlujoError('')
              }}
              style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '30px', color: '#fff', cursor: 'pointer', textAlign: 'center' }}
            >
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>📋</div>
              <div style={{ fontSize: '16px', fontWeight: '500' }}>Llenar datos del paciente</div>
              <div style={{ fontSize: '13px', color: '#888', marginTop: '5px' }}>Historia clínica, encuesta y exploración</div>
            </button>
            <button
              onClick={() => {
                setVista('datos')
                setDetalleVista('eps')
                setBusqueda('')
              }}
              style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '30px', color: '#fff', cursor: 'pointer', textAlign: 'center' }}
            >
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>📊</div>
              <div style={{ fontSize: '16px', fontWeight: '500' }}>Revisar datos</div>
              <div style={{ fontSize: '13px', color: '#888', marginTop: '5px' }}>Ver registros y resultados</div>
            </button>
          </div>
        )}

        {/* ── FLUJO REGISTRO PACIENTE ── */}
        {vista === 'flujo' && (
          <FlujoPacienteForm
            flujoState={flujoState}
            setVista={setVista}
            epsBD={epsBD}
            preguntas={preguntas}
            cargarDatos={cargarDatos}
            s={s}
          />
        )}

        {/* ── VISUALIZACIÓN DE DATOS (TABS) ── */}
        {vista === 'datos' && (
          <div>
            <button style={{ ...s.btn, marginBottom: '20px' }} onClick={() => setVista('inicio')}>
              ← Volver
            </button>

            {/* TABS DE SELECCIÓN */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {[
                { key: 'eps', label: '1. EPS' },
                { key: 'consentimientos', label: '2. Consentimientos' },
                { key: 'historias', label: '3. Historia Clínica' },
                { key: 'analisis', label: '4. Análisis DASS-21' },
                { key: 'exploracion', label: '5. Exploración Clínica' },
                { key: 'resultados', label: '6. Resultados del Estudio' },
                { key: 'chi2', label: '7. Prueba de Chi-cuadrado' },
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => {
                    setDetalleVista(t.key)
                    setBusqueda('')
                  }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    border: `1px solid ${detalleVista === t.key ? '#4444aa' : '#444'}`,
                    backgroundColor: detalleVista === t.key ? '#1a1a3e' : '#222',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: detalleVista === t.key ? '600' : '400'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Buscador (para tabs con tabla) */}
            {['consentimientos', 'historias', 'analisis', 'exploracion'].includes(detalleVista) && (
              <div style={{ marginBottom: '15px' }}>
                <input
                  style={{ ...s.input, width: '100%', maxWidth: '400px' }}
                  placeholder="Buscar por nombre o cédula..."
                  value={busqueda}
                  onChange={e => setBusqueda(e.target.value)}
                />
              </div>
            )}

            {/* Renderizado de vistas */}
            {detalleVista === 'eps' && (
              <EpsManager
                epsBD={epsBD}
                agregarEps={agregarEps}
                eliminarEps={eliminarEps}
                guardarEditEps={guardarEditEps}
                s={s}
              />
            )}

            {detalleVista === 'consentimientos' && (
              <ConsentimientosList
                pacientes={pacientes}
                consentimientos={consentimientos}
                obtenerIdParticipante={obtenerIdParticipante}
                ordenarPorIdParticipante={ordenarPorIdParticipante}
                eliminarConsentimiento={eliminarConsentimiento}
                filtrar={filtrar}
                busqueda={busqueda}
                s={s}
              />
            )}

            {detalleVista === 'historias' && (
              <HistoriasList
                historias={historias}
                obtenerIdParticipante={obtenerIdParticipante}
                ordenarPorIdParticipante={ordenarPorIdParticipante}
                getNombre={dashboardData.getNombre}
                eliminarHistoria={eliminarHistoria}
                filtrar={filtrar}
                busqueda={busqueda}
                s={s}
              />
            )}

            {detalleVista === 'analisis' && (
              <AnalisisDass
                analisis={analisis}
                respuestas={respuestas}
                preguntas={preguntas}
                obtenerIdParticipante={obtenerIdParticipante}
                ordenarPorIdParticipante={ordenarPorIdParticipante}
                getNombre={dashboardData.getNombre}
                eliminarEncuesta={eliminarEncuesta}
                colorBadge={colorBadge}
                filtrar={filtrar}
                busqueda={busqueda}
                s={s}
              />
            )}

            {detalleVista === 'exploracion' && (
              <ExploracionClinicaList
                exploraciones={exploraciones}
                obtenerIdParticipante={obtenerIdParticipante}
                ordenarPorIdParticipante={ordenarPorIdParticipante}
                getNombre={dashboardData.getNombre}
                eliminarExploracion={eliminarExploracion}
                filtrar={filtrar}
                busqueda={busqueda}
                s={s}
              />
            )}

            {detalleVista === 'resultados' && (
              <ResultadosEstudio
                pacientes={pacientes}
                consentimientos={consentimientos}
                historias={historias}
                analisis={analisis}
                exploraciones={exploraciones}
                s={s}
              />
            )}

            {detalleVista === 'chi2' && (
              <PruebaChi2
                varFila={chi2State.varFila}
                setVarFila={chi2State.setVarFila}
                varColumna={chi2State.varColumna}
                setVarColumna={chi2State.setVarColumna}
                calculoChi2={chi2State.calculoChi2}
                setCalculoChi2={chi2State.setCalculoChi2}
                calcularPruebaChi2={chi2State.calcularPruebaChi2}
                pacientes={pacientes}
                exploraciones={exploraciones}
                historias={historias}
                analisis={analisis}
                s={s}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}