'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import SignaturePad from 'signature_pad'

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

const epsList = [
  'Adres','Aliansalud EPS','Asmet Salud','Cajacopi Atlántico','Capital Salud',
  'Capresoca','Coosalud','Dusakawi','EPS Familiar de Colombia','EPS Sanitas',
  'EPS Sura','Famisanar','Indalpe','Mallamas','Medimás EPS','Nueva EPS',
  'Pijaos Salud','Salud Bolívar','Salud Total EPS','Savia Salud',
  'Servicio Occidental de Salud','Sisben','Particular','Otra'
]

const s = {
  body: { backgroundColor: '#000', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif', color: '#fff' },
  header: { backgroundColor: '#111', borderBottom: '1px solid #333', padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  main: { padding: '25px', maxWidth: '1200px', margin: '0 auto' },
  card: { backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '20px', marginBottom: '15px' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  th: { backgroundColor: '#1a1a1a', color: '#ccc', padding: '10px 12px', textAlign: 'left', borderBottom: '1px solid #333', fontWeight: '500' },
  td: { padding: '10px 12px', borderBottom: '1px solid #222', color: '#ddd', verticalAlign: 'middle' },
  btn: { backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '6px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' },
  btnRed: { backgroundColor: '#3a1a1a', color: '#ff6666', border: '1px solid #5a2a2a', borderRadius: '6px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' },
  btnGreen: { backgroundColor: '#1a3a1a', color: '#4caf50', border: '1px solid #2a5a2a', borderRadius: '6px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' },
  btnBlue: { backgroundColor: '#1a1a3a', color: '#64b5f6', border: '1px solid #2a2a5a', borderRadius: '6px', padding: '8px 16px', fontSize: '13px', cursor: 'pointer' },
  input: { padding: '8px 12px', border: '1px solid #333', borderRadius: '6px', backgroundColor: '#1a1a1a', color: '#fff', fontSize: '14px', boxSizing: 'border-box' },
  badge: (color) => ({ display: 'inline-block', padding: '3px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '500', backgroundColor: color === 'green' ? '#1a3a1a' : color === 'red' ? '#3a1a1a' : color === 'yellow' ? '#3a3a1a' : '#2a2a2a', color: color === 'green' ? '#4caf50' : color === 'red' ? '#f44336' : color === 'yellow' ? '#ffeb3b' : '#9e9e9e', border: `1px solid ${color === 'green' ? '#2a5a2a' : color === 'red' ? '#5a2a2a' : color === 'yellow' ? '#5a5a2a' : '#3a3a3a'}` }),
  select: { padding: '8px 12px', border: '1px solid #333', borderRadius: '6px', backgroundColor: '#1a1a1a', color: '#fff', fontSize: '14px' },
  textarea: { width: '100%', padding: '10px', border: '1px solid #333', borderRadius: '6px', backgroundColor: '#1a1a1a', color: '#fff', fontSize: '14px', minHeight: '100px', boxSizing: 'border-box', resize: 'vertical' },
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
  const [pacientes, setPacientes] = useState([])
  const [analisis, setAnalisis] = useState([])
  const [historias, setHistorias] = useState([])
  const [consentimientos, setConsentimientos] = useState([])
  const [exploraciones, setExploraciones] = useState([])
  const [epsBD, setEpsBD] = useState([])
  const [respuestas, setRespuestas] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')

  // Estado flujo paciente admin
  const [flujoVista, setFlujoVista] = useState('menu')
  const [flujoCedula, setFlujoCedula] = useState('')
  const [flujoPaciente, setFlujoPaciente] = useState(null)
  const [flujoError, setFlujoError] = useState('')
  const [flujoLoading, setFlujoLoading] = useState(false)
  const [epsInput, setEpsInput] = useState('')
  const [epsFiltered, setEpsFiltered] = useState([])
  const [showEps, setShowEps] = useState(false)
  const [historia, setHistoria] = useState({
    fechaNacimiento: '', contacto: '', sexo: '', semestre: '',
    enfermedadesSistemicas: '', tipoEnfermedad: '',
    tomaMedicamentos: '', tipoMedicamento: '',
    antecedentesPsicologicos: '', tipoEnfermedadPsicologica: '',
    habitoLabios: false, habitoMejillas: false, habitoLengua: false, habitoNo: false,
    sustanciasPsicoactivas: '', tipoSustancia: '', fumaCigarrilloVape: ''
  })
  const [respuestasDass, setRespuestasDass] = useState({})
  const [exploracion, setExploracion] = useState({
    presentaLesiones: '', mordeduraLabios: '', mordeduraMejillas: '', mordeduraLengua: '',
    ulceraTraumatica: '', queratosisFriccional: '', fibromaTraumatico: '',
    morsicatioBuccarum: '', morsicatioLabiarum: '', morsicatioLinguarum: '',
    descripcionLesion: ''
  })

  // Estado visualización
  const [detalleVista, setDetalleVista] = useState('eps')
  const [pacienteDetalle, setPacienteDetalle] = useState(null)
  const [consentimientoVer, setConsentimientoVer] = useState(null)
  const [respuestaDetalle, setRespuestaDetalle] = useState(null)
  const [nuevaEps, setNuevaEps] = useState('')
  const [editEps, setEditEps] = useState(null)
  const [editEpsNombre, setEditEpsNombre] = useState('')

  useEffect(() => {
    const session = localStorage.getItem('adminSession')
    if (!session) { router.push('/admin/login'); return }
    const data = JSON.parse(session)
    if (Date.now() - data.timestamp > 8 * 60 * 60 * 1000) {
      localStorage.removeItem('adminSession'); router.push('/admin/login'); return
    }
    setAdmin(data)
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setLoading(true)
    const [{ data: pacs }, { data: anal }, { data: hist }, { data: cons }, { data: expl }, { data: epsData }, { data: resp }] = await Promise.all([
      supabase.from('pacientes').select('*').order('created_at', { ascending: false }),
      supabase.from('analisis_dass21').select('*').order('created_at', { ascending: false }),
      supabase.from('historias_clinicas').select('*').order('created_at', { ascending: false }),
      supabase.from('consentimientos').select('*').order('created_at', { ascending: false }),
      supabase.from('exploracion_clinica').select('*').order('created_at', { ascending: false }),
      supabase.from('eps').select('*').order('nombre'),
      supabase.from('respuestas_dass21').select('*').order('created_at', { ascending: false }),
    ])
    setPacientes(pacs || [])
    setAnalisis(anal || [])
    setHistorias(hist || [])
    setConsentimientos(cons || [])
    setExploraciones(expl || [])
    setEpsBD(epsData || [])
    setRespuestas(resp || [])
    setLoading(false)
  }

  const cerrarSesion = () => { localStorage.removeItem('adminSession'); router.push('/') }

  const getNombre = (cedula) => {
    const p = pacientes.find(x => x.cedula == cedula)
    return p ? `${p.nombre} ${p.apellidos}` : '—'
  }

  const filtrar = (lista, campo = 'cedula') => lista.filter(item => {
    const nombre = getNombre(item.cedula || item[campo])
    const cedula = item.cedula || item[campo] || ''
    return `${nombre} ${cedula}`.toLowerCase().includes(busqueda.toLowerCase())
  })

  const calcularEdad = (fechaNac) => {
    const hoy = new Date(); const nac = new Date(fechaNac)
    let edad = hoy.getFullYear() - nac.getFullYear()
    const m = hoy.getMonth() - nac.getMonth()
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--
    return edad
  }

  // ── FLUJO ADMIN: VALIDAR CÉDULA ──
  const validarCedulaFlujo = async (tipo) => {
    if (!flujoCedula) { setFlujoError('Ingrese el número de cédula'); return }
    setFlujoLoading(true); setFlujoError('')
    try {
      const { data: c1 } = await supabase.from('consentimientos').select('id').eq('cedula', flujoCedula).eq('tipo', 1)
      if (!c1 || c1.length === 0) { setFlujoError('El paciente debe tener el Consentimiento 1 firmado'); setFlujoLoading(false); return }
      const { data: c2 } = await supabase.from('consentimientos').select('id').eq('cedula', flujoCedula).eq('tipo', 2)
      if (!c2 || c2.length === 0) { setFlujoError('El paciente debe tener el Consentimiento 2 firmado'); setFlujoLoading(false); return }
      if (tipo === 'historia') {
        const { data: hist } = await supabase.from('historias_clinicas').select('id').eq('cedula', flujoCedula)
        if (hist && hist.length > 0) { setFlujoError('Este paciente ya tiene historia clínica registrada'); setFlujoLoading(false); return }
      }
      if (tipo === 'encuesta') {
        const { data: hist } = await supabase.from('historias_clinicas').select('id').eq('cedula', flujoCedula)
        if (!hist || hist.length === 0) { setFlujoError('Debe registrar primero la historia clínica'); setFlujoLoading(false); return }
        const { data: enc } = await supabase.from('respuestas_dass21').select('id').eq('cedula', flujoCedula)
        if (enc && enc.length > 0) { setFlujoError('Este paciente ya completó la encuesta'); setFlujoLoading(false); return }
      }
      if (tipo === 'exploracion') {
        const { data: hist } = await supabase.from('historias_clinicas').select('id').eq('cedula', flujoCedula)
        if (!hist || hist.length === 0) { setFlujoError('Debe registrar primero la historia clínica'); setFlujoLoading(false); return }
        const { data: enc } = await supabase.from('respuestas_dass21').select('id').eq('cedula', flujoCedula)
        if (!enc || enc.length === 0) { setFlujoError('Debe completar primero la encuesta'); setFlujoLoading(false); return }
        const { data: expl } = await supabase.from('exploracion_clinica').select('id').eq('cedula', flujoCedula)
        if (expl && expl.length > 0) { setFlujoError('Este paciente ya tiene exploración clínica registrada'); setFlujoLoading(false); return }
      }
      const { data: pac } = await supabase.from('pacientes').select('*').eq('cedula', flujoCedula).single()
      if (!pac) { setFlujoError('Paciente no encontrado'); setFlujoLoading(false); return }
      setFlujoPaciente(pac)
      setFlujoVista(tipo)
    } catch { setFlujoError('Error al verificar') }
    setFlujoLoading(false)
  }

  // ── GUARDAR HISTORIA ──
  const guardarHistoria = async () => {
    if (!historia.fechaNacimiento || !historia.contacto || !epsInput || !historia.sexo || !historia.semestre) { setFlujoError('Complete todos los campos requeridos'); return }
    if (!historia.habitoNo && !historia.habitoLabios && !historia.habitoMejillas && !historia.habitoLengua) { setFlujoError('Seleccione al menos una opción de hábitos orales'); return }
    if (!historia.fumaCigarrilloVape) { setFlujoError('Seleccione una opción sobre consumo de cigarrillo/vape'); return }
    setFlujoLoading(true)
    try {
      const semestre = parseInt(historia.semestre)
      const area = semestre <= 4 ? 'Preclínica' : 'Clínica'
      const edad = calcularEdad(historia.fechaNacimiento)
      const habitos = []
      if (historia.habitoNo) habitos.push('No')
      if (historia.habitoLabios) habitos.push('Mordedura de labios')
      if (historia.habitoMejillas) habitos.push('Mordedura de mejillas')
      if (historia.habitoLengua) habitos.push('Mordedura de lengua')
      await supabase.from('historias_clinicas').insert({
        paciente_id: flujoPaciente.id, cedula: flujoPaciente.cedula,
        fecha_nacimiento: historia.fechaNacimiento, contacto: historia.contacto, eps: epsInput, edad, sexo: historia.sexo, semestre, area,
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
      setFlujoVista('exito'); cargarDatos()
    } catch (e) { setFlujoError('Error al guardar: ' + e.message) }
    setFlujoLoading(false)
  }

  // ── GUARDAR ENCUESTA ──
  const guardarEncuesta = async () => {
    const faltantes = preguntas.map((_, i) => respuestasDass[i] === undefined ? i + 1 : null).filter(Boolean)
    if (faltantes.length > 0) { setFlujoError(`Faltan las preguntas: ${faltantes.join(', ')}`); return }
    setFlujoLoading(true)
    try {
      const obj = {}
      preguntas.forEach((_, i) => { obj[`p${i + 1}`] = parseInt(respuestasDass[i]) })
      await supabase.from('respuestas_dass21').insert({ paciente_id: flujoPaciente.id, cedula: flujoPaciente.cedula, ...obj })
      const r = preguntas.map((_, i) => parseInt(respuestasDass[i]))
      const depresion = [2,4,9,12,15,16,20].reduce((a, i) => a + r[i], 0) * 2
      const ansiedad = [1,3,6,8,14,18,19].reduce((a, i) => a + r[i], 0) * 2
      const estres = [0,5,7,10,11,13,17].reduce((a, i) => a + r[i], 0) * 2
      const interp = (p, tipo) => {
        if (tipo === 'depresion') { if (p<=9) return 'Normal'; if (p<=13) return 'Leve'; if (p<=20) return 'Moderado'; if (p<=27) return 'Severo'; return 'Extremadamente severo' }
        if (tipo === 'ansiedad') { if (p<=7) return 'Normal'; if (p<=9) return 'Leve'; if (p<=14) return 'Moderado'; if (p<=19) return 'Severo'; return 'Extremadamente severo' }
        if (p<=14) return 'Normal'; if (p<=18) return 'Leve'; if (p<=25) return 'Moderado'; if (p<=33) return 'Severo'; return 'Extremadamente severo'
      }
      const intD = interp(depresion, 'depresion'), intA = interp(ansiedad, 'ansiedad'), intE = interp(estres, 'estres')
      await supabase.from('analisis_dass21').insert({ paciente_id: flujoPaciente.id, cedula: flujoPaciente.cedula, puntaje_depresion: depresion, puntaje_ansiedad: ansiedad, puntaje_estres: estres, interpretacion_depresion: intD, interpretacion_ansiedad: intA, interpretacion_estres: intE })
      await supabase.from('exploracion_clinica').insert({ paciente_id: flujoPaciente.id, cedula: flujoPaciente.cedula, tiene_depresion: (intD === 'Severo' || intD === 'Extremadamente severo') ? 'Sí' : 'No', tiene_ansiedad: (intA === 'Severo' || intA === 'Extremadamente severo') ? 'Sí' : 'No', tiene_estres: (intE === 'Severo' || intE === 'Extremadamente severo') ? 'Sí' : 'No' })
      setFlujoVista('exito'); cargarDatos()
    } catch (e) { setFlujoError('Error al guardar: ' + e.message) }
    setFlujoLoading(false)
  }

  // ── GUARDAR EXPLORACIÓN ──
  const guardarExploracion = async () => {
    if (!exploracion.presentaLesiones) { setFlujoError('Indique si el paciente presenta lesiones orales'); return }
    setFlujoLoading(true)
    try {
      await supabase.from('exploracion_clinica').update({
        presenta_lesiones: exploracion.presentaLesiones,
        mordedura_labios: exploracion.mordeduraLabios,
        mordedura_mejillas: exploracion.mordeduraMejillas,
        mordedura_lengua: exploracion.mordeduraLengua,
        ulcera_traumatica: exploracion.ulceraTraumatica,
        queratosis_friccional: exploracion.queratosisFriccional,
        fibroma_traumatico: exploracion.fibromaTraumatico,
        morsicatio_buccarum: exploracion.morsicatioBuccarum,
        morsicatio_labiarum: exploracion.morsicatioLabiarum,
        morsicatio_linguarum: exploracion.morsicatioLinguarum,
        descripcion_lesion: exploracion.descripcionLesion
      }).eq('cedula', flujoPaciente.cedula)
      setFlujoVista('exito'); cargarDatos()
    } catch (e) { setFlujoError('Error al guardar: ' + e.message) }
    setFlujoLoading(false)
  }

  // ── EPS CRUD ──
  const agregarEps = async () => {
    if (!nuevaEps.trim()) return
    await supabase.from('eps').insert({ nombre: nuevaEps.trim() })
    setNuevaEps(''); cargarDatos()
  }
  const eliminarEps = async (id) => {
    if (!confirm('¿Eliminar esta EPS?')) return
    await supabase.from('eps').delete().eq('id', id); cargarDatos()
  }
  const guardarEditEps = async () => {
    if (!editEpsNombre.trim()) return
    await supabase.from('eps').update({ nombre: editEpsNombre }).eq('id', editEps)
    setEditEps(null); setEditEpsNombre(''); cargarDatos()
  }

  // ── CONSENTIMIENTO PDF VIEW ──
  const VerConsentimiento = ({ c, pac, onClose }) => {
    const textos = {
      1: { titulo: 'CONSENTIMIENTO INFORMADO PARA LA PARTICIPACIÓN EN UN ESTUDIO DE INVESTIGACIÓN', subtitulo: 'TRABAJO DE GRADO' },
      2: { titulo: 'CONSENTIMIENTO INFORMADO PARA LA TOMA Y USO DE REGISTROS FOTOGRÁFICOS EN INVESTIGACIÓN', subtitulo: 'TRABAJO DE GRADO' }
    }
    const t = textos[c.tipo]
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 1000, overflowY: 'auto', padding: '20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '8px', padding: '40px', color: '#000' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ backgroundColor: '#1a2e5a', color: '#fff', display: 'inline-block', padding: '10px 20px', borderRadius: '4px', marginBottom: '20px', fontWeight: '700', fontSize: '18px', letterSpacing: '2px' }}>UAN</div>
            <p style={{ fontSize: '10px', color: '#333', marginBottom: '20px' }}>UNIVERSIDAD ANTONIO NARIÑO</p>
            <h3 style={{ fontWeight: '700', fontSize: '14px', marginBottom: '5px' }}>{t.titulo}</h3>
            <h4 style={{ fontWeight: '700', fontSize: '13px' }}>{t.subtitulo}</h4>
          </div>
          <p style={{ marginBottom: '10px', fontSize: '13px' }}><strong>Título del proyecto:</strong> Relación entre factores emocionales y hábitos parafuncionales en estudiantes de odontología de la Universidad Antonio Nariño, Sede Neiva.</p>
          <p style={{ marginBottom: '20px', fontSize: '13px' }}><strong>Ciudad:</strong> Neiva – Huila</p>
          <p style={{ marginBottom: '15px', fontSize: '13px' }}>Yo, <strong>{pac?.nombre} {pac?.apellidos}</strong>, identificado(a) con el número de cédula <strong>{c.cedula}</strong>, actuando en nombre propio, manifiesto que he sido informado(a) de manera clara, suficiente y comprensible, y mis preguntas han sido contestadas de manera satisfactoria por el investigador.</p>
          <p style={{ marginBottom: '30px', fontSize: '13px' }}>Desarrollado por los estudiantes investigadores Diana Carolina Cortés, Luisa María Sandoval y Christopher Vargas, bajo la asesoría científica de la Dra. Alejandra Bobadilla Henao.</p>
          <p style={{ marginBottom: '30px', fontSize: '13px' }}>En constancia de lo anterior, se firma el presente consentimiento informado.</p>
          <div style={{ marginBottom: '20px' }}>
            {c.pdf_url && c.pdf_url.startsWith('data:image') && (
              <img src={c.pdf_url} alt="firma" style={{ height: '80px', display: 'block', marginBottom: '10px' }} />
            )}
            <div style={{ borderTop: '1px solid #000', paddingTop: '8px' }}>
              <p style={{ fontSize: '13px', margin: '3px 0' }}><strong>Nombre:</strong> {pac?.nombre} {pac?.apellidos}</p>
              <p style={{ fontSize: '13px', margin: '3px 0' }}><strong>Cédula:</strong> {c.cedula}</p>
              <p style={{ fontSize: '13px', margin: '3px 0' }}><strong>Fecha:</strong> {c.fecha_firma}</p>
            </div>
          </div>
          <div style={{ borderTop: '2px solid #1a2e5a', paddingTop: '10px', textAlign: 'center' }}>
            <p style={{ color: '#1a2e5a', fontWeight: '700', fontSize: '13px' }}>www.uan.edu.co</p>
          </div>
          <button onClick={onClose} style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#1a2e5a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', width: '100%' }}>Cerrar</button>
        </div>
      </div>
    )
  }

  if (loading) return <div style={{ ...s.body, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><p style={{ color: '#888' }}>Cargando...</p></div>

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
        {/* PANTALLA DE INICIO */}
        {vista === 'inicio' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '600px', margin: '40px auto' }}>
            <button onClick={() => { setVista('flujo'); setFlujoVista('menu'); setFlujoCedula(''); setFlujoError('') }} style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '30px', color: '#fff', cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>📋</div>
              <div style={{ fontSize: '16px', fontWeight: '500' }}>Llenar datos del paciente</div>
              <div style={{ fontSize: '13px', color: '#888', marginTop: '5px' }}>Historia clínica, encuesta y exploración</div>
            </button>
            <button onClick={() => { setVista('datos'); setDetalleVista('eps'); setBusqueda('') }} style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '30px', color: '#fff', cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ fontSize: '40px', marginBottom: '10px' }}>📊</div>
              <div style={{ fontSize: '16px', fontWeight: '500' }}>Revisar datos</div>
              <div style={{ fontSize: '13px', color: '#888', marginTop: '5px' }}>Ver registros y resultados</div>
            </button>
          </div>
        )}

        {/* ── FLUJO DATOS PACIENTE ── */}
        {vista === 'flujo' && (
          <div>
            <button style={{ ...s.btn, marginBottom: '20px' }} onClick={() => setVista('inicio')}>← Volver</button>

            {flujoVista === 'menu' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px', margin: '0 auto' }}>
                <h3 style={{ color: '#fff', textAlign: 'center', marginBottom: '10px' }}>Seleccione una acción</h3>
                {[
                  { key: 'cedulaHistoria', label: '📋 Historia Clínica' },
                  { key: 'cedulaEncuesta', label: '📝 Encuesta DASS-21' },
                  { key: 'cedulaExploracion', label: '🔍 Exploración Clínica' },
                ].map(op => (
                  <button key={op.key} style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '10px', padding: '15px', color: '#fff', cursor: 'pointer', fontSize: '15px' }}
                    onClick={() => { setFlujoCedula(''); setFlujoError(''); setFlujoVista(op.key) }}>{op.label}</button>
                ))}
              </div>
            )}

            {/* CÉDULA HISTORIA */}
            {flujoVista === 'cedulaHistoria' && (
              <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                <h3 style={{ color: '#fff', marginBottom: '15px' }}>Historia Clínica — Verificar paciente</h3>
                <input style={{ ...s.input, width: '100%', marginBottom: '10px' }} type="number" value={flujoCedula} onChange={e => setFlujoCedula(e.target.value)} placeholder="Número de cédula" />
                {flujoError && <div style={{ color: '#ff6666', padding: '10px', backgroundColor: '#220000', borderRadius: '6px', marginBottom: '10px' }}>{flujoError}</div>}
                <button style={{ ...s.btnGreen, width: '100%', marginBottom: '8px' }} onClick={() => validarCedulaFlujo('historia')} disabled={flujoLoading}>{flujoLoading ? 'Verificando...' : 'Continuar'}</button>
                <button style={{ ...s.btn, width: '100%' }} onClick={() => setFlujoVista('menu')}>← Volver</button>
              </div>
            )}

            {/* HISTORIA CLÍNICA */}
            {flujoVista === 'historia' && (
              <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                <div style={{ ...s.card, textAlign: 'center', marginBottom: '20px' }}>
                  <p style={{ color: '#fff', fontSize: '16px' }}>Paciente: <strong>{flujoPaciente?.nombre} {flujoPaciente?.apellidos}</strong></p>
                  <p style={{ color: '#888' }}>Cédula: {flujoPaciente?.cedula}</p>
                </div>
                {[
                  { label: 'Fecha de nacimiento', field: 'fechaNacimiento', type: 'date' },
                  { label: 'Teléfono de contacto', field: 'contacto', type: 'number' },
                ].map(f => (
                  <div key={f.field} style={{ marginBottom: '12px' }}>
                    <label style={{ color: '#ccc', fontSize: '14px', display: 'block', marginBottom: '4px' }}>{f.label}:</label>
                    <input style={{ ...s.input, width: '100%' }} type={f.type} value={historia[f.field]} onChange={e => setHistoria({ ...historia, [f.field]: e.target.value })} />
                  </div>
                ))}
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ color: '#ccc', fontSize: '14px', display: 'block', marginBottom: '4px' }}>EPS:</label>
                  <input style={{ ...s.input, width: '100%' }} value={epsInput} onChange={e => { setEpsInput(e.target.value); setEpsFiltered(epsBD.map(x => x.nombre).filter(ep => ep.toLowerCase().includes(e.target.value.toLowerCase()))); setShowEps(true) }} onFocus={() => { setEpsFiltered(epsBD.map(x => x.nombre)); setShowEps(true) }} onBlur={() => setTimeout(() => setShowEps(false), 200)} placeholder="Buscar EPS..." />
                  {showEps && epsFiltered.length > 0 && <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #444', borderRadius: '6px', maxHeight: '180px', overflowY: 'auto' }}>{epsFiltered.map(ep => <div key={ep} style={{ padding: '10px', cursor: 'pointer', color: '#fff', borderBottom: '1px solid #333' }} onMouseDown={() => { setEpsInput(ep); setShowEps(false) }}>{ep}</div>)}</div>}
                </div>
                {[
                  { label: 'Sexo', field: 'sexo', opts: ['Masculino', 'Femenino', 'Otro'] },
                  { label: '¿Enfermedades sistémicas?', field: 'enfermedadesSistemicas', opts: ['No', 'Sí'] },
                  { label: '¿Toma medicamentos?', field: 'tomaMedicamentos', opts: ['No', 'Sí'] },
                  { label: '¿Antecedentes psicológicos?', field: 'antecedentesPsicologicos', opts: ['No', 'Sí'] },
                  { label: '¿Consume sustancias psicoactivas?', field: 'sustanciasPsicoactivas', opts: ['No', 'Sí'] },
                ].map(f => (
                  <div key={f.field} style={{ marginBottom: '12px' }}>
                    <label style={{ color: '#ccc', fontSize: '14px', display: 'block', marginBottom: '4px' }}>{f.label}:</label>
                    <select style={{ ...s.select, width: '100%' }} value={historia[f.field]} onChange={e => setHistoria({ ...historia, [f.field]: e.target.value })}>
                      <option value="">-- Seleccione --</option>
                      {f.opts.map(o => <option key={o}>{o}</option>)}
                    </select>
                    {historia[f.field] === 'Sí' && f.field === 'enfermedadesSistemicas' && <input style={{ ...s.input, width: '100%', marginTop: '6px' }} placeholder="Especifique la enfermedad" value={historia.tipoEnfermedad} onChange={e => setHistoria({ ...historia, tipoEnfermedad: e.target.value })} />}
                    {historia[f.field] === 'Sí' && f.field === 'tomaMedicamentos' && <input style={{ ...s.input, width: '100%', marginTop: '6px' }} placeholder="Especifique el medicamento" value={historia.tipoMedicamento} onChange={e => setHistoria({ ...historia, tipoMedicamento: e.target.value })} />}
                    {historia[f.field] === 'Sí' && f.field === 'antecedentesPsicologicos' && <input style={{ ...s.input, width: '100%', marginTop: '6px' }} placeholder="Especifique la enfermedad psicológica" value={historia.tipoEnfermedadPsicologica} onChange={e => setHistoria({ ...historia, tipoEnfermedadPsicologica: e.target.value })} />}
                    {historia[f.field] === 'Sí' && f.field === 'sustanciasPsicoactivas' && <input style={{ ...s.input, width: '100%', marginTop: '6px' }} placeholder="Especifique la sustancia" value={historia.tipoSustancia} onChange={e => setHistoria({ ...historia, tipoSustancia: e.target.value })} />}
                  </div>
                ))}
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ color: '#ccc', fontSize: '14px', display: 'block', marginBottom: '4px' }}>Semestre actual:</label>
                  <input style={{ ...s.input, width: '100%' }} type="number" min="1" max="9" value={historia.semestre} onChange={e => setHistoria({ ...historia, semestre: e.target.value })} placeholder="1 a 9" />
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ color: '#ccc', fontSize: '14px', display: 'block', marginBottom: '4px' }}>Hábitos orales:</label>
                  <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '12px' }}>
                    {[['habitoNo', 'No'], ['habitoLabios', 'Mordedura de labios'], ['habitoMejillas', 'Mordedura de mejillas'], ['habitoLengua', 'Mordedura de lengua']].map(([key, label]) => (
                      <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '6px 0', cursor: 'pointer', color: '#ccc' }}>
                        <input type="checkbox" checked={historia[key]} onChange={e => {
                          if (key === 'habitoNo' && e.target.checked) setHistoria({ ...historia, habitoNo: true, habitoLabios: false, habitoMejillas: false, habitoLengua: false })
                          else setHistoria({ ...historia, [key]: e.target.checked, habitoNo: false })
                        }} />{label}
                      </label>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ color: '#ccc', fontSize: '14px', display: 'block', marginBottom: '4px' }}>¿Fuma cigarrillo o vape?</label>
                  <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '12px' }}>
                    {['Cigarrillo', 'Vape', 'Las dos', 'Ninguna'].map(op => (
                      <label key={op} style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '6px 0', cursor: 'pointer', color: '#ccc' }}>
                        <input type="radio" name="fuma" value={op} checked={historia.fumaCigarrilloVape === op} onChange={e => setHistoria({ ...historia, fumaCigarrilloVape: e.target.value })} />{op}
                      </label>
                    ))}
                  </div>
                </div>
                {flujoError && <div style={{ color: '#ff6666', padding: '10px', backgroundColor: '#220000', borderRadius: '6px', marginBottom: '10px' }}>{flujoError}</div>}
                <button style={{ ...s.btnGreen, width: '100%', marginBottom: '8px' }} onClick={guardarHistoria} disabled={flujoLoading}>{flujoLoading ? 'Guardando...' : 'Guardar historia clínica'}</button>
                <button style={{ ...s.btn, width: '100%' }} onClick={() => setFlujoVista('menu')}>← Volver</button>
              </div>
            )}

            {/* CÉDULA ENCUESTA */}
            {flujoVista === 'cedulaEncuesta' && (
              <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                <h3 style={{ color: '#fff', marginBottom: '15px' }}>Encuesta DASS-21 — Verificar paciente</h3>
                <input style={{ ...s.input, width: '100%', marginBottom: '10px' }} type="number" value={flujoCedula} onChange={e => setFlujoCedula(e.target.value)} placeholder="Número de cédula" />
                {flujoError && <div style={{ color: '#ff6666', padding: '10px', backgroundColor: '#220000', borderRadius: '6px', marginBottom: '10px' }}>{flujoError}</div>}
                <button style={{ ...s.btnGreen, width: '100%', marginBottom: '8px' }} onClick={() => validarCedulaFlujo('encuesta')} disabled={flujoLoading}>{flujoLoading ? 'Verificando...' : 'Continuar'}</button>
                <button style={{ ...s.btn, width: '100%' }} onClick={() => setFlujoVista('menu')}>← Volver</button>
              </div>
            )}

            {/* ENCUESTA */}
            {flujoVista === 'encuesta' && (
              <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                <div style={{ ...s.card, textAlign: 'center', marginBottom: '20px' }}>
                  <p style={{ color: '#fff', fontSize: '16px' }}>Paciente: <strong>{flujoPaciente?.nombre} {flujoPaciente?.apellidos}</strong></p>
                </div>
                <p style={{ color: '#999', marginBottom: '15px', fontSize: '14px' }}>Seleccione una opción para cada pregunta (0 = No me ocurrió, 3 = Me ocurrió mucho)</p>
                {preguntas.map((p, i) => (
                  <div key={i} style={{ ...s.card, marginBottom: '10px' }}>
                    <strong style={{ color: '#fff', display: 'block', marginBottom: '10px', fontSize: '14px' }}>{i + 1}. {p}</strong>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {[0, 1, 2, 3].map(v => (
                        <label key={v} style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: respuestasDass[i] === v ? '#2a5a2a' : '#222', padding: '8px 16px', border: `1px solid ${respuestasDass[i] === v ? '#3a7a3a' : '#444'}`, borderRadius: '20px', cursor: 'pointer', fontSize: '14px', color: '#ccc' }}>
                          <input type="radio" name={`p${i}`} value={v} checked={respuestasDass[i] === v} onChange={() => setRespuestasDass({ ...respuestasDass, [i]: v })} style={{ display: 'none' }} />{v}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                {flujoError && <div style={{ color: '#ff6666', padding: '10px', backgroundColor: '#220000', borderRadius: '6px', marginBottom: '10px' }}>{flujoError}</div>}
                <button style={{ ...s.btnGreen, width: '100%', marginBottom: '8px' }} onClick={guardarEncuesta} disabled={flujoLoading}>{flujoLoading ? 'Guardando...' : 'Guardar encuesta'}</button>
                <button style={{ ...s.btn, width: '100%' }} onClick={() => setFlujoVista('menu')}>← Volver</button>
              </div>
            )}

            {/* CÉDULA EXPLORACIÓN */}
            {flujoVista === 'cedulaExploracion' && (
              <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                <h3 style={{ color: '#fff', marginBottom: '15px' }}>Exploración Clínica — Verificar paciente</h3>
                <input style={{ ...s.input, width: '100%', marginBottom: '10px' }} type="number" value={flujoCedula} onChange={e => setFlujoCedula(e.target.value)} placeholder="Número de cédula" />
                {flujoError && <div style={{ color: '#ff6666', padding: '10px', backgroundColor: '#220000', borderRadius: '6px', marginBottom: '10px' }}>{flujoError}</div>}
                <button style={{ ...s.btnGreen, width: '100%', marginBottom: '8px' }} onClick={() => validarCedulaFlujo('exploracion')} disabled={flujoLoading}>{flujoLoading ? 'Verificando...' : 'Continuar'}</button>
                <button style={{ ...s.btn, width: '100%' }} onClick={() => setFlujoVista('menu')}>← Volver</button>
              </div>
            )}

            {/* EXPLORACIÓN CLÍNICA */}
            {flujoVista === 'exploracion' && (
              <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                <div style={{ ...s.card, textAlign: 'center', marginBottom: '20px' }}>
                  <p style={{ color: '#fff', fontSize: '16px' }}>Paciente: <strong>{flujoPaciente?.nombre} {flujoPaciente?.apellidos}</strong></p>
                  <p style={{ color: '#888' }}>Cédula: {flujoPaciente?.cedula}</p>
                </div>
                <div style={s.card}>
                  <h4 style={{ color: '#fff', marginBottom: '15px' }}>Identificación de lesiones</h4>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ color: '#ccc', fontSize: '14px', display: 'block', marginBottom: '8px' }}>¿Presenta lesiones orales?</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {['Sí', 'No'].map(v => (
                        <label key={v} style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: exploracion.presentaLesiones === v ? '#2a5a2a' : '#222', padding: '8px 20px', border: `1px solid ${exploracion.presentaLesiones === v ? '#3a7a3a' : '#444'}`, borderRadius: '20px', cursor: 'pointer', color: '#ccc' }}>
                          <input type="radio" name="presentaLesiones" value={v} checked={exploracion.presentaLesiones === v} onChange={e => setExploracion({ ...exploracion, presentaLesiones: e.target.value })} style={{ display: 'none' }} />{v}
                        </label>
                      ))}
                    </div>
                  </div>

                  {exploracion.presentaLesiones === 'Sí' && (
                    <>
                      <h4 style={{ color: '#fff', margin: '20px 0 15px' }}>Localización de la lesión</h4>
                      {[
                        { key: 'mordeduraLabios', label: 'Mordedura de labios' },
                        { key: 'mordeduraMejillas', label: 'Mordedura de mejillas' },
                        { key: 'mordeduraLengua', label: 'Mordedura de lengua' },
                      ].map(f => (
                        <div key={f.key} style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label style={{ color: '#ccc', fontSize: '14px' }}>{f.label}</label>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {['Sí', 'No'].map(v => (
                              <label key={v} style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: exploracion[f.key] === v ? '#2a5a2a' : '#222', padding: '6px 14px', border: `1px solid ${exploracion[f.key] === v ? '#3a7a3a' : '#444'}`, borderRadius: '20px', cursor: 'pointer', color: '#ccc', fontSize: '13px' }}>
                                <input type="radio" name={f.key} value={v} checked={exploracion[f.key] === v} onChange={e => setExploracion({ ...exploracion, [f.key]: e.target.value })} style={{ display: 'none' }} />{v}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}

                      <h4 style={{ color: '#fff', margin: '20px 0 15px' }}>Tipo de lesión</h4>
                      {[
                        { key: 'ulceraTraumatica', label: 'Úlcera traumática' },
                        { key: 'queratosisFriccional', label: 'Queratosis friccional' },
                        { key: 'fibromaTraumatico', label: 'Fibroma traumático' },
                        { key: 'morsicatioBuccarum', label: 'Morsicatio buccarum' },
                        { key: 'morsicatioLabiarum', label: 'Morsicatio labiarum' },
                        { key: 'morsicatioLinguarum', label: 'Morsicatio linguarum' },
                      ].map(f => (
                        <div key={f.key} style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label style={{ color: '#ccc', fontSize: '14px' }}>{f.label}</label>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {['Sí', 'No'].map(v => (
                              <label key={v} style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: exploracion[f.key] === v ? '#2a5a2a' : '#222', padding: '6px 14px', border: `1px solid ${exploracion[f.key] === v ? '#3a7a3a' : '#444'}`, borderRadius: '20px', cursor: 'pointer', color: '#ccc', fontSize: '13px' }}>
                                <input type="radio" name={f.key} value={v} checked={exploracion[f.key] === v} onChange={e => setExploracion({ ...exploracion, [f.key]: e.target.value })} style={{ display: 'none' }} />{v}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}

                      <h4 style={{ color: '#fff', margin: '20px 0 10px' }}>Descripción de la lesión</h4>
                      <textarea style={s.textarea} placeholder="Describa clínicamente la lesión observada..." value={exploracion.descripcionLesion} onChange={e => setExploracion({ ...exploracion, descripcionLesion: e.target.value })} />
                    </>
                  )}
                </div>
                {flujoError && <div style={{ color: '#ff6666', padding: '10px', backgroundColor: '#220000', borderRadius: '6px', marginBottom: '10px' }}>{flujoError}</div>}
                <button style={{ ...s.btnGreen, width: '100%', marginBottom: '8px' }} onClick={guardarExploracion} disabled={flujoLoading}>{flujoLoading ? 'Guardando...' : 'Guardar exploración clínica'}</button>
                <button style={{ ...s.btn, width: '100%' }} onClick={() => setFlujoVista('menu')}>← Volver</button>
              </div>
            )}

            {/* ÉXITO */}
            {flujoVista === 'exito' && (
              <div style={{ ...s.card, textAlign: 'center', maxWidth: '400px', margin: '40px auto' }}>
                <h3 style={{ color: '#00ff00', marginBottom: '10px' }}>✓ Guardado correctamente</h3>
                <p style={{ color: '#888', marginBottom: '20px' }}>Los datos han sido almacenados en el sistema.</p>
                <button style={{ ...s.btnGreen, width: '100%', marginBottom: '8px' }} onClick={() => { setFlujoVista('menu'); setFlujoCedula(''); setFlujoPaciente(null); setRespuestasDass({}); setExploracion({ presentaLesiones: '', mordeduraLabios: '', mordeduraMejillas: '', mordeduraLengua: '', ulceraTraumatica: '', queratosisFriccional: '', fibromaTraumatico: '', morsicatioBuccarum: '', morsicatioLabiarum: '', morsicatioLinguarum: '', descripcionLesion: '' }); setHistoria({ fechaNacimiento: '', contacto: '', sexo: '', semestre: '', enfermedadesSistemicas: '', tipoEnfermedad: '', tomaMedicamentos: '', tipoMedicamento: '', antecedentesPsicologicos: '', tipoEnfermedadPsicologica: '', habitoLabios: false, habitoMejillas: false, habitoLengua: false, habitoNo: false, sustanciasPsicoactivas: '', tipoSustancia: '', fumaCigarrilloVape: '' }); setEpsInput('') }}>Registrar otro paciente</button>
                <button style={{ ...s.btn, width: '100%' }} onClick={() => setVista('inicio')}>← Volver al inicio</button>
              </div>
            )}
          </div>
        )}

        {/* ── VISUALIZACIÓN DE DATOS ── */}
        {vista === 'datos' && (
          <div>
            <button style={{ ...s.btn, marginBottom: '20px' }} onClick={() => setVista('inicio')}>← Volver</button>

            {/* TABS */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {[
                { key: 'eps', label: '1. EPS' },
                { key: 'consentimientos', label: '2. Consentimientos' },
                { key: 'historias', label: '3. Historia Clínica' },
                { key: 'analisis', label: '4. Análisis DASS-21' },
                { key: 'exploracion', label: '5. Exploración Clínica' },
                { key: 'resultados', label: '6. Resultados del Estudio' },
              ].map(t => (
                <button key={t.key} onClick={() => { setDetalleVista(t.key); setBusqueda(''); setPacienteDetalle(null); setRespuestaDetalle(null); setConsentimientoVer(null) }}
                  style={{ padding: '8px 14px', borderRadius: '8px', border: `1px solid ${detalleVista === t.key ? '#4444aa' : '#444'}`, backgroundColor: detalleVista === t.key ? '#1a1a3e' : '#222', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: detalleVista === t.key ? '600' : '400' }}>{t.label}</button>
              ))}
            </div>

            {/* Buscador (para tabs con tabla) */}
            {['consentimientos', 'historias', 'analisis', 'exploracion'].includes(detalleVista) && (
              <div style={{ marginBottom: '15px' }}>
                <input style={{ ...s.input, width: '100%', maxWidth: '400px' }} placeholder="Buscar por nombre o cédula..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
              </div>
            )}

            {/* ── 1. EPS ── */}
            {detalleVista === 'eps' && (
              <div style={s.card}>
                <h3 style={{ color: '#fff', marginBottom: '15px' }}>Gestión de EPS</h3>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  <input style={{ ...s.input, flex: 1 }} value={nuevaEps} onChange={e => setNuevaEps(e.target.value)} placeholder="Nombre de la nueva EPS" onKeyDown={e => e.key === 'Enter' && agregarEps()} />
                  <button style={s.btnGreen} onClick={agregarEps}>+ Agregar</button>
                </div>
                <table style={s.table}>
                  <thead><tr><th style={s.th}>#</th><th style={s.th}>Nombre EPS</th><th style={s.th}>Acciones</th></tr></thead>
                  <tbody>
                    {epsBD.map((ep, i) => (
                      <tr key={ep.id}>
                        <td style={s.td}>{i + 1}</td>
                        <td style={s.td}>
                          {editEps === ep.id ? <input style={s.input} value={editEpsNombre} onChange={e => setEditEpsNombre(e.target.value)} /> : ep.nombre}
                        </td>
                        <td style={s.td}>
                          {editEps === ep.id ? (
                            <><button style={{ ...s.btnGreen, marginRight: '6px' }} onClick={guardarEditEps}>Guardar</button><button style={s.btn} onClick={() => setEditEps(null)}>Cancelar</button></>
                          ) : (
                            <><button style={{ ...s.btnBlue, marginRight: '6px' }} onClick={() => { setEditEps(ep.id); setEditEpsNombre(ep.nombre) }}>Editar</button><button style={s.btnRed} onClick={() => eliminarEps(ep.id)}>Eliminar</button></>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── 2. CONSENTIMIENTOS ── */}
            {detalleVista === 'consentimientos' && !consentimientoVer && (
              <div style={s.card}>
                <table style={s.table}>
                  <thead><tr><th style={s.th}>Nombre</th><th style={s.th}>Cédula</th><th style={s.th}>C1</th><th style={s.th}>C2</th><th style={s.th}>Ver</th></tr></thead>
                  <tbody>
                    {filtrar(pacientes, 'cedula').map(p => {
                      const c1 = consentimientos.find(c => c.cedula == p.cedula && c.tipo === 1)
                      const c2 = consentimientos.find(c => c.cedula == p.cedula && c.tipo === 2)
                      return (
                        <tr key={p.id}>
                          <td style={s.td}>{p.nombre} {p.apellidos}</td>
                          <td style={s.td}>{p.cedula}</td>
                          <td style={s.td}><span style={s.badge(c1 ? 'green' : 'red')}>{c1 ? '✓ Firmado' : '✗ Pendiente'}</span></td>
                          <td style={s.td}><span style={s.badge(c2 ? 'green' : 'red')}>{c2 ? '✓ Firmado' : '✗ Pendiente'}</span></td>
                          <td style={s.td} style={{ display: 'flex', gap: '6px' }}>
                            {c1 && <button style={s.btnBlue} onClick={() => setConsentimientoVer({ c: c1, pac: p })}>Ver C1</button>}
                            {c2 && <button style={s.btnBlue} onClick={() => setConsentimientoVer({ c: c2, pac: p })}>Ver C2</button>}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {consentimientoVer && <VerConsentimiento c={consentimientoVer.c} pac={consentimientoVer.pac} onClose={() => setConsentimientoVer(null)} />}

            {/* ── 3. HISTORIAS ── */}
            {detalleVista === 'historias' && (
              <div style={s.card}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}>Nombre</th><th style={s.th}>Cédula</th><th style={s.th}>Edad</th>
                      <th style={s.th}>Sexo</th><th style={s.th}>EPS</th><th style={s.th}>Semestre</th>
                      <th style={s.th}>Área</th><th style={s.th}>Enf. Sistémicas</th>
                      <th style={s.th}>Medicamentos</th><th style={s.th}>Ant. Psicológicos</th>
                      <th style={s.th}>Hábitos Orales</th><th style={s.th}>Sustancias</th><th style={s.th}>Fuma/Vape</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtrar(historias).map(h => (
                      <tr key={h.id}>
                        <td style={s.td}>{getNombre(h.cedula)}</td>
                        <td style={s.td}>{h.cedula}</td>
                        <td style={s.td}>{h.edad}</td>
                        <td style={s.td}>{h.sexo}</td>
                        <td style={s.td}>{h.eps}</td>
                        <td style={s.td}>{h.semestre}</td>
                        <td style={s.td}>{h.area}</td>
                        <td style={s.td}>{h.enfermedades_sistemicas}</td>
                        <td style={s.td}>{h.toma_medicamentos}</td>
                        <td style={s.td}>{h.antecedentes_psicologicos}</td>
                        <td style={s.td}>{h.habitos_orales}</td>
                        <td style={s.td}>{h.sustancias_psicoactivas}</td>
                        <td style={s.td}>{h.fuma_cigarrillo_vape}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {historias.length === 0 && <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>No hay historias clínicas registradas</p>}
              </div>
            )}

            {/* ── 4. ANÁLISIS DASS-21 ── */}
            {detalleVista === 'analisis' && !respuestaDetalle && (
              <div style={s.card}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}>Nombre</th><th style={s.th}>Cédula</th>
                      <th style={s.th}>Depresión</th><th style={s.th}>Ptje D</th>
                      <th style={s.th}>Ansiedad</th><th style={s.th}>Ptje A</th>
                      <th style={s.th}>Estrés</th><th style={s.th}>Ptje E</th>
                      <th style={s.th}>Detalle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtrar(analisis).map(a => (
                      <tr key={a.id}>
                        <td style={s.td}>{getNombre(a.cedula)}</td>
                        <td style={s.td}>{a.cedula}</td>
                        <td style={s.td}><span style={s.badge(colorBadge(a.interpretacion_depresion))}>{a.interpretacion_depresion}</span></td>
                        <td style={s.td}>{a.puntaje_depresion}</td>
                        <td style={s.td}><span style={s.badge(colorBadge(a.interpretacion_ansiedad))}>{a.interpretacion_ansiedad}</span></td>
                        <td style={s.td}>{a.puntaje_ansiedad}</td>
                        <td style={s.td}><span style={s.badge(colorBadge(a.interpretacion_estres))}>{a.interpretacion_estres}</span></td>
                        <td style={s.td}>{a.puntaje_estres}</td>
                        <td style={s.td}><button style={s.btnBlue} onClick={() => setRespuestaDetalle(respuestas.find(r => r.cedula == a.cedula))}>Ver detalle</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {analisis.length === 0 && <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>No hay encuestas completadas</p>}
              </div>
            )}
            {detalleVista === 'analisis' && respuestaDetalle && (
              <div style={s.card}>
                <button style={{ ...s.btn, marginBottom: '15px' }} onClick={() => setRespuestaDetalle(null)}>← Volver a la lista</button>
                <h3 style={{ color: '#fff', marginBottom: '15px' }}>Respuestas de {getNombre(respuestaDetalle.cedula)}</h3>
                <table style={s.table}>
                  <thead><tr><th style={s.th}>Nº</th><th style={s.th}>Pregunta</th><th style={s.th}>Puntaje</th></tr></thead>
                  <tbody>
                    {preguntas.map((p, i) => (
                      <tr key={i}>
                        <td style={s.td}>{i + 1}</td>
                        <td style={s.td}>{p}</td>
                        <td style={s.td}><span style={s.badge(respuestaDetalle[`p${i+1}`] >= 2 ? 'red' : respuestaDetalle[`p${i+1}`] === 1 ? 'yellow' : 'green')}>{respuestaDetalle[`p${i+1}`]}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── 5. EXPLORACIÓN CLÍNICA ── */}
            {detalleVista === 'exploracion' && (
              <div style={s.card}>
                <table style={s.table}>
                  <thead>
                    <tr>
                      <th style={s.th}>Nombre</th><th style={s.th}>Cédula</th>
                      <th style={s.th}>Lesiones</th><th style={s.th}>M. Labios</th>
                      <th style={s.th}>M. Mejillas</th><th style={s.th}>M. Lengua</th>
                      <th style={s.th}>Úlcera</th><th style={s.th}>Queratosis</th>
                      <th style={s.th}>Fibroma</th><th style={s.th}>M. Buccarum</th>
                      <th style={s.th}>M. Labiarum</th><th style={s.th}>M. Linguarum</th>
                      <th style={s.th}>Descripción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtrar(exploraciones).map(e => (
                      <tr key={e.id}>
                        <td style={s.td}>{getNombre(e.cedula)}</td>
                        <td style={s.td}>{e.cedula}</td>
                        <td style={s.td}><span style={s.badge(e.presenta_lesiones === 'Sí' ? 'red' : e.presenta_lesiones === 'No' ? 'green' : 'gray')}>{e.presenta_lesiones || '—'}</span></td>
                        <td style={s.td}>{e.mordedura_labios || '—'}</td>
                        <td style={s.td}>{e.mordedura_mejillas || '—'}</td>
                        <td style={s.td}>{e.mordedura_lengua || '—'}</td>
                        <td style={s.td}>{e.ulcera_traumatica || '—'}</td>
                        <td style={s.td}>{e.queratosis_friccional || '—'}</td>
                        <td style={s.td}>{e.fibroma_traumatico || '—'}</td>
                        <td style={s.td}>{e.morsicatio_buccarum || '—'}</td>
                        <td style={s.td}>{e.morsicatio_labiarum || '—'}</td>
                        <td style={s.td}>{e.morsicatio_linguarum || '—'}</td>
                        <td style={s.td} style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.descripcion_lesion || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {exploraciones.length === 0 && <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>No hay exploraciones registradas</p>}
              </div>
            )}

            {/* ── 6. RESULTADOS DEL ESTUDIO ── */}
            {detalleVista === 'resultados' && (
              <div>
                <h3 style={{ color: '#fff', marginBottom: '20px' }}>Resultados del Estudio</h3>
                {/* Estadísticas generales */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '25px' }}>
                  {[
                    { label: 'Total participantes', value: pacientes.length, color: '#4fc3f7' },
                    { label: 'Con lesiones orales', value: exploraciones.filter(e => e.presenta_lesiones === 'Sí').length, color: '#f44336' },
                    { label: 'Sin lesiones orales', value: exploraciones.filter(e => e.presenta_lesiones === 'No').length, color: '#4caf50' },
                    { label: 'Encuestas completadas', value: analisis.length, color: '#ffb74d' },
                  ].map(item => (
                    <div key={item.label} style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '10px', padding: '15px', textAlign: 'center' }}>
                      <div style={{ fontSize: '32px', fontWeight: '700', color: item.color }}>{item.value}</div>
                      <div style={{ color: '#888', fontSize: '12px', marginTop: '5px' }}>{item.label}</div>
                    </div>
                  ))}
                </div>

                {/* Lesiones por tipo (datos del administrador) */}
                <div style={{ ...s.card, marginBottom: '20px' }}>
                  <h4 style={{ color: '#fff', marginBottom: '15px' }}>Lesiones registradas en exploración clínica</h4>
                  <p style={{ color: '#888', fontSize: '12px', marginBottom: '15px' }}>Datos ingresados por el administrador durante la exploración clínica</p>
                  <table style={s.table}>
                    <thead><tr><th style={s.th}>Tipo de lesión</th><th style={s.th}>Casos</th><th style={s.th}>Porcentaje</th></tr></thead>
                    <tbody>
                      {[
                        { key: 'mordedura_labios', label: 'Mordedura de labios' },
                        { key: 'mordedura_mejillas', label: 'Mordedura de mejillas' },
                        { key: 'mordedura_lengua', label: 'Mordedura de lengua' },
                        { key: 'ulcera_traumatica', label: 'Úlcera traumática' },
                        { key: 'queratosis_friccional', label: 'Queratosis friccional' },
                        { key: 'fibroma_traumatico', label: 'Fibroma traumático' },
                        { key: 'morsicatio_buccarum', label: 'Morsicatio buccarum' },
                        { key: 'morsicatio_labiarum', label: 'Morsicatio labiarum' },
                        { key: 'morsicatio_linguarum', label: 'Morsicatio linguarum' },
                      ].map(item => {
                        const count = exploraciones.filter(e => e[item.key] === 'Sí').length
                        const total = exploraciones.filter(e => e[item.key] !== null && e[item.key] !== undefined && e[item.key] !== '').length
                        const pct = total > 0 ? Math.round((count / total) * 100) : 0
                        return (
                          <tr key={item.key}>
                            <td style={s.td}>{item.label}</td>
                            <td style={s.td}>{count}</td>
                            <td style={s.td}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ flex: 1, backgroundColor: '#333', borderRadius: '4px', height: '8px' }}>
                                  <div style={{ width: `${pct}%`, backgroundColor: '#f44336', height: '8px', borderRadius: '4px' }} />
                                </div>
                                <span style={{ minWidth: '35px', fontSize: '12px' }}>{pct}%</span>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                {/* DASS-21 distribución */}
                <div style={s.card}>
                  <h4 style={{ color: '#fff', marginBottom: '15px' }}>Distribución DASS-21</h4>
                  {['depresion', 'ansiedad', 'estres'].map(dim => {
                    const campo = `interpretacion_${dim}`
                    const niveles = ['Normal', 'Leve', 'Moderado', 'Severo', 'Extremadamente severo']
                    const counts = {}
                    niveles.forEach(n => { counts[n] = analisis.filter(a => a[campo] === n).length })
                    const total = analisis.length
                    return (
                      <div key={dim} style={{ marginBottom: '20px' }}>
                        <p style={{ color: '#ccc', marginBottom: '10px', fontWeight: '500' }}>{dim === 'estres' ? 'Estrés' : dim.charAt(0).toUpperCase() + dim.slice(1)}</p>
                        {niveles.map(nivel => {
                          const count = counts[nivel]
                          const pct = total > 0 ? Math.round((count / total) * 100) : 0
                          return (
                            <div key={nivel} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                              <span style={{ minWidth: '180px', fontSize: '13px', color: '#ccc' }}>{nivel}</span>
                              <div style={{ flex: 1, backgroundColor: '#333', borderRadius: '4px', height: '8px' }}>
                                <div style={{ width: `${pct}%`, backgroundColor: colorBadge(nivel) === 'green' ? '#4caf50' : colorBadge(nivel) === 'yellow' ? '#ffeb3b' : '#f44336', height: '8px', borderRadius: '4px' }} />
                              </div>
                              <span style={{ minWidth: '60px', fontSize: '12px', color: '#888' }}>{count} ({pct}%)</span>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
                </div>

                {/* Relación lesiones vs DASS */}
                <div style={s.card}>
                  <h4 style={{ color: '#fff', marginBottom: '15px' }}>Relación entre lesiones orales y factores emocionales</h4>
                  <p style={{ color: '#888', fontSize: '12px', marginBottom: '15px' }}>Solo pacientes con exploración clínica completada</p>
                  <table style={s.table}>
                    <thead><tr><th style={s.th}>Condición</th><th style={s.th}>Con lesiones</th><th style={s.th}>Sin lesiones</th></tr></thead>
                    <tbody>
                      {[
                        { label: 'Depresión severa/extrema', campo: 'interpretacion_depresion' },
                        { label: 'Ansiedad severa/extrema', campo: 'interpretacion_ansiedad' },
                        { label: 'Estrés severo/extremo', campo: 'interpretacion_estres' },
                      ].map(item => {
                        const conLesiones = exploraciones.filter(e => e.presenta_lesiones === 'Sí').map(e => e.cedula)
                        const sinLesiones = exploraciones.filter(e => e.presenta_lesiones === 'No').map(e => e.cedula)
                        const severo = (cedulas) => analisis.filter(a => cedulas.includes(a.cedula) && (a[item.campo] === 'Severo' || a[item.campo] === 'Extremadamente severo')).length
                        return (
                          <tr key={item.label}>
                            <td style={s.td}>{item.label}</td>
                            <td style={s.td}><span style={s.badge('red')}>{severo(conLesiones)} casos</span></td>
                            <td style={s.td}><span style={s.badge('green')}>{severo(sinLesiones)} casos</span></td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}