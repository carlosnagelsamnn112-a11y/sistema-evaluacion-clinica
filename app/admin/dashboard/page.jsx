'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const s = {
  body: { backgroundColor: '#000', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif', color: '#fff' },
  header: { backgroundColor: '#111', borderBottom: '1px solid #333', padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  main: { padding: '25px', maxWidth: '1200px', margin: '0 auto' },
  tabs: { display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' },
  tab: { padding: '10px 20px', borderRadius: '8px', border: '1px solid #444', backgroundColor: '#222', color: '#fff', cursor: 'pointer', fontSize: '14px' },
  tabActive: { padding: '10px 20px', borderRadius: '8px', border: '1px solid #4444aa', backgroundColor: '#1a1a3e', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  card: { backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '20px', marginBottom: '15px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  th: { backgroundColor: '#1a1a1a', color: '#ccc', padding: '10px 12px', textAlign: 'left', borderBottom: '1px solid #333', fontWeight: '500' },
  td: { padding: '10px 12px', borderBottom: '1px solid #222', color: '#ddd', verticalAlign: 'top' },
  badge: (color) => ({ display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', backgroundColor: color === 'green' ? '#1a3a1a' : color === 'red' ? '#3a1a1a' : color === 'yellow' ? '#3a3a1a' : '#2a2a2a', color: color === 'green' ? '#4caf50' : color === 'red' ? '#f44336' : color === 'yellow' ? '#ffeb3b' : '#9e9e9e', border: `1px solid ${color === 'green' ? '#2a5a2a' : color === 'red' ? '#5a2a2a' : color === 'yellow' ? '#5a5a2a' : '#3a3a3a'}` }),
  btn: { backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '6px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' },
  btnRed: { backgroundColor: '#3a1a1a', color: '#ff6666', border: '1px solid #5a2a2a', borderRadius: '6px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' },
  stat: { backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '20px', textAlign: 'center' },
  input: { padding: '8px 12px', border: '1px solid #333', borderRadius: '6px', backgroundColor: '#1a1a1a', color: '#fff', fontSize: '14px', width: '100%', boxSizing: 'border-box' },
}

const colorBadge = (interp) => {
  if (!interp) return 'gray'
  if (interp === 'Normal') return 'green'
  if (interp === 'Leve') return 'yellow'
  if (interp === 'Moderado') return 'yellow'
  if (interp === 'Severo' || interp === 'Extremadamente severo') return 'red'
  return 'gray'
}

export default function Dashboard() {
  const router = useRouter()
  const [admin, setAdmin] = useState(null)
  const [tab, setTab] = useState('resumen')
  const [pacientes, setPacientes] = useState([])
  const [analisis, setAnalisis] = useState([])
  const [historias, setHistorias] = useState([])
  const [consentimientos, setConsentimientos] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [pacienteDetalle, setPacienteDetalle] = useState(null)

  useEffect(() => {
    const session = localStorage.getItem('adminSession')
    if (!session) { router.push('/admin/login'); return }
    const data = JSON.parse(session)
    // Sesión expira en 8 horas
    if (Date.now() - data.timestamp > 8 * 60 * 60 * 1000) {
      localStorage.removeItem('adminSession')
      router.push('/admin/login')
      return
    }
    setAdmin(data)
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setLoading(true)
    const [{ data: pacs }, { data: anal }, { data: hist }, { data: cons }] = await Promise.all([
      supabase.from('pacientes').select('*').order('created_at', { ascending: false }),
      supabase.from('analisis_dass21').select('*').order('created_at', { ascending: false }),
      supabase.from('historias_clinicas').select('*').order('created_at', { ascending: false }),
      supabase.from('consentimientos').select('*').order('created_at', { ascending: false }),
    ])
    setPacientes(pacs || [])
    setAnalisis(anal || [])
    setHistorias(hist || [])
    setConsentimientos(cons || [])
    setLoading(false)
  }

  const cerrarSesion = () => {
    localStorage.removeItem('adminSession')
    router.push('/')
  }

  const pacientesFiltrados = pacientes.filter(p =>
    `${p.nombre} ${p.apellidos} ${p.cedula}`.toLowerCase().includes(busqueda.toLowerCase())
  )

  const tieneConsentimiento = (cedula, tipo) => consentimientos.some(c => c.cedula == cedula && c.tipo === tipo)
  const tieneHistoria = (cedula) => historias.some(h => h.cedula == cedula)
  const tieneEncuesta = (cedula) => analisis.some(a => a.cedula == cedula)
  const getAnalisis = (cedula) => analisis.find(a => a.cedula == cedula)
  const getHistoria = (cedula) => historias.find(h => h.cedula == cedula)
  const getConsentimiento = (cedula, tipo) => consentimientos.find(c => c.cedula == cedula && c.tipo === tipo)

  const verDetalle = (paciente) => {
    setPacienteDetalle(paciente)
    setTab('detalle')
  }

  if (loading) return (
    <div style={{ ...s.body, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <p style={{ color: '#888' }}>Cargando datos...</p>
    </div>
  )

  return (
    <div style={s.body}>
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
        {/* TABS */}
        <div style={s.tabs}>
          {[
            { key: 'resumen', label: '📊 Resumen' },
            { key: 'pacientes', label: '👥 Pacientes' },
            { key: 'analisis', label: '🧠 Análisis DASS-21' },
            { key: 'consentimientos', label: '📄 Consentimientos' },
          ].map(t => (
            <button key={t.key} style={tab === t.key ? s.tabActive : s.tab} onClick={() => { setTab(t.key); setPacienteDetalle(null) }}>{t.label}</button>
          ))}
        </div>

        {/* RESUMEN */}
        {tab === 'resumen' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px', marginBottom: '25px' }}>
              {[
                { label: 'Total pacientes', value: pacientes.length, color: '#4fc3f7' },
                { label: 'Historias clínicas', value: historias.length, color: '#81c784' },
                { label: 'Encuestas completadas', value: analisis.length, color: '#ffb74d' },
                { label: 'Consentimientos firmados', value: consentimientos.length, color: '#ce93d8' },
              ].map(item => (
                <div key={item.label} style={s.stat}>
                  <div style={{ fontSize: '36px', fontWeight: '700', color: item.color }}>{item.value}</div>
                  <div style={{ color: '#888', fontSize: '13px', marginTop: '5px' }}>{item.label}</div>
                </div>
              ))}
            </div>

            <div style={s.card}>
              <h3 style={{ color: '#fff', marginBottom: '15px', fontWeight: '500' }}>Distribución DASS-21</h3>
              {['depresion', 'ansiedad', 'estres'].map(dim => {
                const campo = `interpretacion_${dim}`
                const counts = { Normal: 0, Leve: 0, Moderado: 0, Severo: 0, 'Extremadamente severo': 0 }
                analisis.forEach(a => { if (counts[a[campo]] !== undefined) counts[a[campo]]++ })
                return (
                  <div key={dim} style={{ marginBottom: '15px' }}>
                    <p style={{ color: '#ccc', marginBottom: '8px', fontWeight: '500', textTransform: 'capitalize' }}>{dim === 'estres' ? 'Estrés' : dim.charAt(0).toUpperCase() + dim.slice(1)}</p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {Object.entries(counts).map(([nivel, count]) => (
                        <span key={nivel} style={s.badge(colorBadge(nivel))}>{nivel}: {count}</span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={s.card}>
              <h3 style={{ color: '#fff', marginBottom: '15px', fontWeight: '500' }}>Últimos pacientes registrados</h3>
              <table style={s.table}>
                <thead><tr><th style={s.th}>Nombre</th><th style={s.th}>Cédula</th><th style={s.th}>C1</th><th style={s.th}>C2</th><th style={s.th}>Historia</th><th style={s.th}>Encuesta</th></tr></thead>
                <tbody>
                  {pacientes.slice(0, 5).map(p => (
                    <tr key={p.id}>
                      <td style={s.td}>{p.nombre} {p.apellidos}</td>
                      <td style={s.td}>{p.cedula}</td>
                      <td style={s.td}><span style={s.badge(tieneConsentimiento(p.cedula, 1) ? 'green' : 'red')}>{tieneConsentimiento(p.cedula, 1) ? '✓' : '✗'}</span></td>
                      <td style={s.td}><span style={s.badge(tieneConsentimiento(p.cedula, 2) ? 'green' : 'red')}>{tieneConsentimiento(p.cedula, 2) ? '✓' : '✗'}</span></td>
                      <td style={s.td}><span style={s.badge(tieneHistoria(p.cedula) ? 'green' : 'red')}>{tieneHistoria(p.cedula) ? '✓' : '✗'}</span></td>
                      <td style={s.td}><span style={s.badge(tieneEncuesta(p.cedula) ? 'green' : 'red')}>{tieneEncuesta(p.cedula) ? '✓' : '✗'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PACIENTES */}
        {tab === 'pacientes' && (
          <div>
            <div style={{ marginBottom: '15px' }}>
              <input style={s.input} placeholder="Buscar por nombre o cédula..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
            </div>
            <div style={s.card}>
              <table style={s.table}>
                <thead>
                  <tr>
                    <th style={s.th}>ID</th>
                    <th style={s.th}>Nombre completo</th>
                    <th style={s.th}>Cédula</th>
                    <th style={s.th}>C1</th>
                    <th style={s.th}>C2</th>
                    <th style={s.th}>Historia</th>
                    <th style={s.th}>Encuesta</th>
                    <th style={s.th}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pacientesFiltrados.map(p => (
                    <tr key={p.id}>
                      <td style={s.td}>{p.id}</td>
                      <td style={s.td}>{p.nombre} {p.apellidos}</td>
                      <td style={s.td}>{p.cedula}</td>
                      <td style={s.td}><span style={s.badge(tieneConsentimiento(p.cedula, 1) ? 'green' : 'red')}>{tieneConsentimiento(p.cedula, 1) ? '✓ Firmado' : '✗ Pendiente'}</span></td>
                      <td style={s.td}><span style={s.badge(tieneConsentimiento(p.cedula, 2) ? 'green' : 'red')}>{tieneConsentimiento(p.cedula, 2) ? '✓ Firmado' : '✗ Pendiente'}</span></td>
                      <td style={s.td}><span style={s.badge(tieneHistoria(p.cedula) ? 'green' : 'red')}>{tieneHistoria(p.cedula) ? '✓' : '✗'}</span></td>
                      <td style={s.td}><span style={s.badge(tieneEncuesta(p.cedula) ? 'green' : 'red')}>{tieneEncuesta(p.cedula) ? '✓' : '✗'}</span></td>
                      <td style={s.td}><button style={s.btn} onClick={() => verDetalle(p)}>Ver detalle</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {pacientesFiltrados.length === 0 && <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>No se encontraron pacientes</p>}
            </div>
          </div>
        )}

        {/* ANÁLISIS DASS-21 */}
        {tab === 'analisis' && (
          <div style={s.card}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Nombre</th>
                  <th style={s.th}>Cédula</th>
                  <th style={s.th}>Depresión</th>
                  <th style={s.th}>Puntaje D</th>
                  <th style={s.th}>Ansiedad</th>
                  <th style={s.th}>Puntaje A</th>
                  <th style={s.th}>Estrés</th>
                  <th style={s.th}>Puntaje E</th>
                </tr>
              </thead>
              <tbody>
                {analisis.map(a => (
                  <tr key={a.id}>
                    <td style={s.td}>{pacientes.find(p => p.cedula == a.cedula)?.nombre} {pacientes.find(p => p.cedula == a.cedula)?.apellidos}</td>
                    <td style={s.td}>{a.cedula}</td>
                    <td style={s.td}><span style={s.badge(colorBadge(a.interpretacion_depresion))}>{a.interpretacion_depresion}</span></td>
                    <td style={s.td}>{a.puntaje_depresion}</td>
                    <td style={s.td}><span style={s.badge(colorBadge(a.interpretacion_ansiedad))}>{a.interpretacion_ansiedad}</span></td>
                    <td style={s.td}>{a.puntaje_ansiedad}</td>
                    <td style={s.td}><span style={s.badge(colorBadge(a.interpretacion_estres))}>{a.interpretacion_estres}</span></td>
                    <td style={s.td}>{a.puntaje_estres}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {analisis.length === 0 && <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>No hay encuestas completadas aún</p>}
          </div>
        )}

        {/* CONSENTIMIENTOS */}
        {tab === 'consentimientos' && (
          <div style={s.card}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Nombre</th>
                  <th style={s.th}>Cédula</th>
                  <th style={s.th}>Tipo</th>
                  <th style={s.th}>Fecha firma</th>
                  <th style={s.th}>Firma</th>
                </tr>
              </thead>
              <tbody>
                {consentimientos.map(c => {
                  const pac = pacientes.find(p => p.cedula == c.cedula)
                  return (
                    <tr key={c.id}>
                      <td style={s.td}>{pac?.nombre} {pac?.apellidos}</td>
                      <td style={s.td}>{c.cedula}</td>
                      <td style={s.td}><span style={s.badge('green')}>Consentimiento {c.tipo}</span></td>
                      <td style={s.td}>{c.fecha_firma}</td>
                      <td style={s.td}>
                        {c.pdf_url && c.pdf_url.startsWith('data:image') ? (
                          <img src={c.pdf_url} alt="firma" style={{ height: '50px', backgroundColor: '#fff', borderRadius: '4px', padding: '2px' }} />
                        ) : (
                          <span style={{ color: '#888' }}>—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {consentimientos.length === 0 && <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>No hay consentimientos registrados aún</p>}
          </div>
        )}

        {/* DETALLE PACIENTE */}
        {tab === 'detalle' && pacienteDetalle && (() => {
          const hist = getHistoria(pacienteDetalle.cedula)
          const anal = getAnalisis(pacienteDetalle.cedula)
          const c1 = getConsentimiento(pacienteDetalle.cedula, 1)
          const c2 = getConsentimiento(pacienteDetalle.cedula, 2)
          return (
            <div>
              <button style={{ ...s.btn, marginBottom: '20px' }} onClick={() => setTab('pacientes')}>← Volver a pacientes</button>
              <div style={s.card}>
                <h3 style={{ color: '#fff', marginBottom: '15px' }}>Datos del paciente</h3>
                <p style={{ color: '#ccc' }}><strong style={{ color: '#fff' }}>Nombre:</strong> {pacienteDetalle.nombre} {pacienteDetalle.apellidos}</p>
                <p style={{ color: '#ccc' }}><strong style={{ color: '#fff' }}>Cédula:</strong> {pacienteDetalle.cedula}</p>
                <p style={{ color: '#ccc' }}><strong style={{ color: '#fff' }}>Registrado:</strong> {new Date(pacienteDetalle.created_at).toLocaleDateString('es-ES')}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div style={s.card}>
                  <h4 style={{ color: '#fff', marginBottom: '10px' }}>Consentimiento 1</h4>
                  {c1 ? <><span style={s.badge('green')}>✓ Firmado</span><p style={{ color: '#888', marginTop: '8px', fontSize: '13px' }}>Fecha: {c1.fecha_firma}</p>{c1.pdf_url?.startsWith('data:image') && <img src={c1.pdf_url} alt="firma" style={{ height: '60px', backgroundColor: '#fff', borderRadius: '4px', padding: '2px', marginTop: '8px' }} />}</> : <span style={s.badge('red')}>✗ Pendiente</span>}
                </div>
                <div style={s.card}>
                  <h4 style={{ color: '#fff', marginBottom: '10px' }}>Consentimiento 2</h4>
                  {c2 ? <><span style={s.badge('green')}>✓ Firmado</span><p style={{ color: '#888', marginTop: '8px', fontSize: '13px' }}>Fecha: {c2.fecha_firma}</p>{c2.pdf_url?.startsWith('data:image') && <img src={c2.pdf_url} alt="firma" style={{ height: '60px', backgroundColor: '#fff', borderRadius: '4px', padding: '2px', marginTop: '8px' }} />}</> : <span style={s.badge('red')}>✗ Pendiente</span>}
                </div>
              </div>

              {hist && (
                <div style={s.card}>
                  <h4 style={{ color: '#fff', marginBottom: '15px' }}>Historia Clínica</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    {[
                      ['Fecha nacimiento', hist.fecha_nacimiento],
                      ['Edad', hist.edad + ' años'],
                      ['Sexo', hist.sexo],
                      ['Contacto', hist.contacto],
                      ['EPS', hist.eps],
                      ['Semestre', hist.semestre],
                      ['Área', hist.area],
                      ['Enf. sistémicas', hist.enfermedades_sistemicas],
                      ['Medicamentos', hist.toma_medicamentos],
                      ['Ant. psicológicos', hist.antecedentes_psicologicos],
                      ['Hábitos orales', hist.habitos_orales],
                      ['Sustancias psicoactivas', hist.sustancias_psicoactivas],
                      ['Fuma/Vape', hist.fuma_cigarrillo_vape],
                    ].map(([label, value]) => (
                      <div key={label} style={{ backgroundColor: '#1a1a1a', borderRadius: '6px', padding: '10px' }}>
                        <p style={{ color: '#888', fontSize: '12px', margin: '0 0 4px 0' }}>{label}</p>
                        <p style={{ color: '#fff', fontSize: '14px', margin: 0 }}>{value || '—'}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {anal && (
                <div style={s.card}>
                  <h4 style={{ color: '#fff', marginBottom: '15px' }}>Resultados DASS-21</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                    {[
                      { label: 'Depresión', puntaje: anal.puntaje_depresion, interp: anal.interpretacion_depresion },
                      { label: 'Ansiedad', puntaje: anal.puntaje_ansiedad, interp: anal.interpretacion_ansiedad },
                      { label: 'Estrés', puntaje: anal.puntaje_estres, interp: anal.interpretacion_estres },
                    ].map(item => (
                      <div key={item.label} style={{ backgroundColor: '#1a1a1a', borderRadius: '8px', padding: '15px', textAlign: 'center' }}>
                        <p style={{ color: '#888', fontSize: '13px', marginBottom: '8px' }}>{item.label}</p>
                        <p style={{ color: '#fff', fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0' }}>{item.puntaje}</p>
                        <span style={s.badge(colorBadge(item.interp))}>{item.interp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {!hist && <div style={s.card}><p style={{ color: '#888', textAlign: 'center' }}>Historia clínica pendiente</p></div>}
              {!anal && <div style={s.card}><p style={{ color: '#888', textAlign: 'center' }}>Encuesta DASS-21 pendiente</p></div>}
            </div>
          )
        })()}
      </div>
    </div>
  )
}