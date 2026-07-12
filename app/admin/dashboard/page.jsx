'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

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
    descripcionLesion: '', foto1Url: '', foto2Url: ''
  })

  // Estado visualización
  const [detalleVista, setDetalleVista] = useState('eps')
  const [consentimientoVer, setConsentimientoVer] = useState(null)
  const [respuestaDetalle, setRespuestaDetalle] = useState(null)
  const [nuevaEps, setNuevaEps] = useState('')
  const [editEps, setEditEps] = useState(null)
  const [editEpsNombre, setEditEpsNombre] = useState('')
  const [descripcionVer, setDescripcionVer] = useState(null)
  const [fotosVer, setFotosVer] = useState(null)
  const [subiendoFoto, setSubiendoFoto] = useState(false)
  const [fotoError, setFotoError] = useState('')
  const [varFila, setVarFila] = useState('')
  const [varColumna, setVarColumna] = useState('')
  const [calculoChi2, setCalculoChi2] = useState(null)
  const [indicadorClinico, setIndicadorClinico] = useState('')
  const [factorAnalisis, setFactorAnalisis] = useState('')
  const [datosInteractivos, setDatosInteractivos] = useState(null)

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
      supabase.from('pacientes').select('*').order('id', { ascending: true }),
      supabase.from('analisis_dass21').select('*').order('id', { ascending: true }),
      supabase.from('historias_clinicas').select('*').order('id', { ascending: true }),
      supabase.from('consentimientos').select('*').order('id', { ascending: true }),
      supabase.from('exploracion_clinica').select('*').order('id', { ascending: true }),
      supabase.from('eps').select('*').order('nombre'),
      supabase.from('respuestas_dass21').select('*').order('id', { ascending: true })
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

  const pacientesOrdenados = [...pacientes].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

  const obtenerIdParticipante = (cedula) => {
    const idx = pacientesOrdenados.findIndex(p => p.cedula == cedula)
    return idx !== -1 ? idx + 1 : '—'
  }

  const ordenarPorIdParticipante = (lista) => {
    return [...lista].sort((a, b) => {
      const idA = obtenerIdParticipante(a.cedula)
      const idB = obtenerIdParticipante(b.cedula)
      if (idA === '—') return 1
      if (idB === '—') return -1
      return idA - idB
    })
  }

  const getNombre = (cedula) => {
    const p = pacientes.find(x => x.cedula == cedula)
    return p ? `${p.nombre} ${p.apellidos}` : '—'
  }

  const filtrar = (lista) => lista.filter(item => {
    const nombre = getNombre(item.cedula)
    const cedula = item.cedula || ''
    return `${nombre} ${cedula}`.toLowerCase().includes(busqueda.toLowerCase())
  })

  const calcularEdad = (fechaNac) => {
    const hoy = new Date(); const nac = new Date(fechaNac)
    let edad = hoy.getFullYear() - nac.getFullYear()
    const m = hoy.getMonth() - nac.getMonth()
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--
    return edad
  }

  const calcularPruebaChi2 = () => {
    if (!varFila || !varColumna) {
      alert('Por favor seleccione ambas variables.');
      return;
    }

    let datosCruzados = [];

    pacientes.forEach(p => {
      const e = exploraciones.find(x => x.cedula == p.cedula);
      if (!e) return;

      const h = historias.find(x => x.cedula == p.cedula);
      const a = analisis.find(x => x.cedula == p.cedula);

      let valFila = null;
      let labelFila = '';

      if (varFila === 'Lesiones orales (Sí / No)') {
        if (e.presenta_lesiones === 'Sí' || e.presenta_lesiones === 'No') {
          valFila = e.presenta_lesiones;
          labelFila = e.presenta_lesiones === 'Sí' ? 'Con lesión' : 'Sin lesión';
        }
      } else if (varFila === 'Lesión en labios (Sí / No)') {
        if (e.mordedura_labios === 'Sí' || e.mordedura_labios === 'No') {
          valFila = e.mordedura_labios;
          labelFila = e.mordedura_labios === 'Sí' ? 'Lesión en labios' : 'Sin lesión en labios';
        }
      } else if (varFila === 'Lesión en mejillas (Sí / No)') {
        if (e.mordedura_mejillas === 'Sí' || e.mordedura_mejillas === 'No') {
          valFila = e.mordedura_mejillas;
          labelFila = e.mordedura_mejillas === 'Sí' ? 'Lesión en mejillas' : 'Sin lesión en mejillas';
        }
      } else if (varFila === 'Lesión en lengua (Sí / No)') {
        if (e.mordedura_lengua === 'Sí' || e.mordedura_lengua === 'No') {
          valFila = e.mordedura_lengua;
          labelFila = e.mordedura_lengua === 'Sí' ? 'Lesión en lengua' : 'Sin lesión en lengua';
        }
      }

      if (valFila === null) return;

      let valCol = null;
      let labelCol = '';

      if (varColumna === 'Trastornos psicológicos (Sí / No)') {
        if (a) {
          const tieneT = a.interpretacion_depresion !== 'Normal' || a.interpretacion_ansiedad !== 'Normal' || a.interpretacion_estres !== 'Normal';
          valCol = tieneT ? 'Sí' : 'No';
          labelCol = tieneT ? 'Con trastorno' : 'Sin trastorno';
        }
      } else if (varColumna === 'Trastorno psicológico de tipo depresión') {
        if (a) {
          const tieneT = a.interpretacion_depresion !== 'Normal';
          valCol = tieneT ? 'Sí' : 'No';
          labelCol = tieneT ? 'Con depresión' : 'Sin depresión';
        }
      } else if (varColumna === 'Trastorno psicológico de tipo ansiedad') {
        if (a) {
          const tieneT = a.interpretacion_ansiedad !== 'Normal';
          valCol = tieneT ? 'Sí' : 'No';
          labelCol = tieneT ? 'Con ansiedad' : 'Sin ansiedad';
        }
      } else if (varColumna === 'Trastorno psicológico de tipo estrés') {
        if (a) {
          const tieneT = a.interpretacion_estres !== 'Normal';
          valCol = tieneT ? 'Sí' : 'No';
          labelCol = tieneT ? 'Con estrés' : 'Sin estrés';
        }
      } else if (varColumna === 'Hábito de fumar') {
        if (h) {
          const fuma = h.fuma_cigarrillo_vape === 'Cigarrillo' || h.fuma_cigarrillo_vape === 'Las dos';
          valCol = fuma ? 'Sí' : 'No';
          labelCol = fuma ? 'Fuma' : 'No fuma';
        }
      } else if (varColumna === 'Hábito de vape') {
        if (h) {
          const vape = h.fuma_cigarrillo_vape === 'Vape' || h.fuma_cigarrillo_vape === 'Las dos';
          valCol = vape ? 'Sí' : 'No';
          labelCol = vape ? 'Usa vape' : 'No usa vape';
        }
      } else if (varColumna === 'Consumo de sustancias psicoactivas') {
        if (h && (h.sustancias_psicoactivas === 'Sí' || h.sustancias_psicoactivas === 'No')) {
          valCol = h.sustancias_psicoactivas;
          labelCol = h.sustancias_psicoactivas === 'Sí' ? 'Consume SPA' : 'No consume SPA';
        }
      } else if (varColumna === 'Área de la universidad') {
        if (h && (h.area === 'Preclínica' || h.area === 'Clínica')) {
          valCol = h.area;
          labelCol = h.area;
        }
      } else if (varColumna === 'Sexo') {
        if (h && (h.sexo === 'Masculino' || h.sexo === 'Femenino')) {
          valCol = h.sexo;
          labelCol = h.sexo;
        }
      }

      if (valCol === null) return;

      datosCruzados.push({
        cedula: p.cedula,
        filaVal: valFila,
        filaLabel: labelFila,
        colVal: valCol,
        colLabel: labelCol
      });
    });

    const totalN = datosCruzados.length;
    if (totalN < 2) {
      alert(`No hay suficientes datos cruzados para calcular la prueba (Total pacientes válidos: ${totalN}).`);
      setCalculoChi2(null);
      return;
    }

    const catFilas = ['Sí', 'No'];
    let catCols = [];
    if (varColumna.startsWith('Trastorno') || varColumna.startsWith('Hábito') || varColumna.includes('sustancias') || varColumna.startsWith('Trastornos')) {
      catCols = ['Sí', 'No'];
    } else if (varColumna === 'Área de la universidad') {
      catCols = ['Preclínica', 'Clínica'];
    } else if (varColumna === 'Sexo') {
      catCols = ['Masculino', 'Femenino'];
    }

    const getEtiquetaFila = (cat) => {
      if (varFila === 'Lesiones orales (Sí / No)') return cat === 'Sí' ? 'Con lesión' : 'Sin lesión';
      if (varFila === 'Lesiones en los labios (Sí / No)') return cat === 'Sí' ? 'Con lesión labial' : 'Sin lesión labial';
      if (varFila === 'Lesiones en las mejillas (Sí / No)') return cat === 'Sí' ? 'Con lesión en mejillas' : 'Sin lesión en mejillas';
      if (varFila === 'Lesiones en la lengua (Sí / No)') return cat === 'Sí' ? 'Con lesión en lengua' : 'Sin lesión en lengua';
      return cat;
    };

    const getEtiquetaCol = (cat) => {
      if (varColumna === 'Trastornos psicológicos (Sí / No)') return cat === 'Sí' ? 'Con trastorno' : 'Sin trastorno';
      if (varColumna === 'Trastorno psicológico de tipo depresión') return cat === 'Sí' ? 'Con depresión' : 'Sin depresión';
      if (varColumna === 'Trastorno psicológico de tipo ansiedad') return cat === 'Sí' ? 'Con ansiedad' : 'Sin ansiedad';
      if (varColumna === 'Trastorno psicológico de tipo estrés') return cat === 'Sí' ? 'Con estrés' : 'Sin estrés';
      if (varColumna === 'Hábito de fumar') return cat === 'Sí' ? 'Fuma' : 'No fuma';
      if (varColumna === 'Hábito de vape') return cat === 'Sí' ? 'Usa vape' : 'No usa vape';
      if (varColumna === 'Consumo de sustancias psicoactivas') return cat === 'Sí' ? 'Consume SPA' : 'No consume SPA';
      return cat;
    };

    const f1 = catFilas[0], f2 = catFilas[1];
    const c1 = catCols[0], c2 = catCols[1];

    const o11 = datosCruzados.filter(x => x.filaVal === f1 && x.colVal === c1).length;
    const o12 = datosCruzados.filter(x => x.filaVal === f1 && x.colVal === c2).length;
    const o21 = datosCruzados.filter(x => x.filaVal === f2 && x.colVal === c1).length;
    const o22 = datosCruzados.filter(x => x.filaVal === f2 && x.colVal === c2).length;

    const totalF1 = o11 + o12;
    const totalF2 = o21 + o22;
    const totalC1 = o11 + o21;
    const totalC2 = o12 + o22;

    const e11 = totalN > 0 ? (totalF1 * totalC1) / totalN : 0;
    const e12 = totalN > 0 ? (totalF1 * totalC2) / totalN : 0;
    const e21 = totalN > 0 ? (totalF2 * totalC1) / totalN : 0;
    const e22 = totalN > 0 ? (totalF2 * totalC2) / totalN : 0;

    const chi11 = e11 > 0 ? Math.pow(o11 - e11, 2) / e11 : 0;
    const chi12 = e12 > 0 ? Math.pow(o12 - e12, 2) / e12 : 0;
    const chi21 = e21 > 0 ? Math.pow(o21 - e21, 2) / e21 : 0;
    const chi22 = e22 > 0 ? Math.pow(o22 - e22, 2) / e22 : 0;

    const chiTotal = chi11 + chi12 + chi21 + chi22;
    const gl = 1;
    const pValorConfianza = 0.95;
    const valorCritico = 3.841;
    const seRechazaH0 = chiTotal > valorCritico;

    setCalculoChi2({
      totalN,
      f1, f2, c1, c2,
      labelF1: getEtiquetaFila(f1),
      labelF2: getEtiquetaFila(f2),
      labelC1: getEtiquetaCol(c1),
      labelC2: getEtiquetaCol(c2),
      obs: { o11, o12, o21, o22 },
      esp: { e11, e12, e21, e22 },
      parc: { chi11, chi12, chi21, chi22 },
      totalF1, totalF2, totalC1, totalC2,
      chiTotal,
      gl,
      pValorConfianza,
      valorCritico,
      seRechazaH0
    });
  };

  const resetFlujoForms = () => {
    setRespuestasDass({})
    setExploracion({ presentaLesiones: '', mordeduraLabios: '', mordeduraMejillas: '', mordeduraLengua: '', ulceraTraumatica: '', queratosisFriccional: '', fibromaTraumatico: '', morsicatioBuccarum: '', morsicatioLabiarum: '', morsicatioLinguarum: '', descripcionLesion: '', foto1Url: '', foto2Url: '' })
    setHistoria({ fechaNacimiento: '', contacto: '', sexo: '', semestre: '', enfermedadesSistemicas: '', tipoEnfermedad: '', tomaMedicamentos: '', tipoMedicamento: '', antecedentesPsicologicos: '', tipoEnfermedadPsicologica: '', habitoLabios: false, habitoMejillas: false, habitoLengua: false, habitoNo: false, sustanciasPsicoactivas: '', tipoSustancia: '', fumaCigarrilloVape: '' })
    setEpsInput('')
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
        // CORREGIDO: solo bloquea si presenta_lesiones ya tiene un valor real guardado por el admin
        const { data: expl } = await supabase.from('exploracion_clinica').select('presenta_lesiones').eq('cedula', flujoCedula)
        if (expl && expl.length > 0 && expl[0].presenta_lesiones) { setFlujoError('Este paciente ya tiene exploración clínica registrada'); setFlujoLoading(false); return }
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
      // Crea o actualiza la fila base de exploracion_clinica con los datos de DASS,
      // SIN tocar presenta_lesiones (eso lo llena el admin después, por separado)
      const { data: existeExpl } = await supabase.from('exploracion_clinica').select('id').eq('cedula', flujoPaciente.cedula)
      const datosDass = {
        tiene_depresion: (intD === 'Severo' || intD === 'Extremadamente severo') ? 'Sí' : 'No',
        tiene_ansiedad: (intA === 'Severo' || intA === 'Extremadamente severo') ? 'Sí' : 'No',
        tiene_estres: (intE === 'Severo' || intE === 'Extremadamente severo') ? 'Sí' : 'No'
      }
      if (existeExpl && existeExpl.length > 0) {
        await supabase.from('exploracion_clinica').update(datosDass).eq('cedula', flujoPaciente.cedula)
      } else {
        await supabase.from('exploracion_clinica').insert({ paciente_id: flujoPaciente.id, cedula: flujoPaciente.cedula, ...datosDass })
      }
      setFlujoVista('exito'); cargarDatos()
    } catch (e) { setFlujoError('Error al guardar: ' + e.message) }
    setFlujoLoading(false)
  }

  // ── GUARDAR EXPLORACIÓN ──
  const guardarExploracion = async () => {
    if (!exploracion.presentaLesiones) { setFlujoError('Indique si el paciente presenta lesiones orales'); return }

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
    try {
      // Normaliza: cualquier campo de localizacion/tipo que no sea 'Sí' explícito queda 'No'
      const normalizar = (lista) => {
        const obj = {}
        lista.forEach(k => { obj[k] = exploracion[k] === 'Sí' ? 'Sí' : 'No' })
        return obj
      }
      const camposNormalizados = exploracion.presentaLesiones === 'Sí'
        ? { ...normalizar(localizacion), ...normalizar(tipoLesion) }
        : { mordeduraLabios: 'No', mordeduraMejillas: 'No', mordeduraLengua: 'No', ulceraTraumatica: 'No', queratosisFriccional: 'No', fibromaTraumatico: 'No', morsicatioBuccarum: 'No', morsicatioLabiarum: 'No', morsicatioLinguarum: 'No' }

      await supabase.from('exploracion_clinica').update({
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
      }).eq('cedula', flujoPaciente.cedula)
      setFlujoVista('exito'); cargarDatos()
    } catch (e) { setFlujoError('Error al guardar: ' + e.message) }
    setFlujoLoading(false)
  }

  // ── ELIMINACIÓN DE REGISTROS CLÍNICOS INDIVIDUALES ──
  const eliminarConsentimiento = async (id, tipoNombre, pacNombre) => {
    if (!confirm(`Advertencia: Eliminar el consentimiento de un paciente conservará su historia clínica y encuestas en la base de datos.\n\n¿Está seguro de que desea eliminar el ${tipoNombre} de ${pacNombre}?`)) return
    try {
      await supabase.from('consentimientos').delete().eq('id', id)
      alert(`${tipoNombre} eliminado con éxito.`)
      cargarDatos()
    } catch (e) {
      alert('Error al eliminar consentimiento: ' + e.message)
    }
  }

  const eliminarHistoria = async (id, pacNombre) => {
    if (!confirm(`¿Está seguro de que desea eliminar la historia clínica de ${pacNombre}? Esta acción no se puede deshacer.`)) return
    try {
      await supabase.from('historias_clinicas').delete().eq('id', id)
      alert('Historia clínica eliminada con éxito.')
      cargarDatos()
    } catch (e) {
      alert('Error al eliminar historia clínica: ' + e.message)
    }
  }

  const eliminarEncuesta = async (id, cedula, pacNombre) => {
    if (!confirm(`¿Está seguro de que desea eliminar la encuesta DASS-21 y su análisis asociado para ${pacNombre}?\n\nEsto también restablecerá las banderas de trastorno psicológico en la exploración clínica del paciente.`)) return
    try {
      await supabase.from('respuestas_dass21').delete().eq('cedula', cedula)
      await supabase.from('analisis_dass21').delete().eq('id', id)
      await supabase.from('exploracion_clinica').update({
        tiene_depresion: 'No',
        tiene_ansiedad: 'No',
        tiene_estres: 'No'
      }).eq('cedula', cedula)
      alert('Encuesta DASS-21 eliminada con éxito.')
      cargarDatos()
    } catch (e) {
      alert('Error al eliminar encuesta: ' + e.message)
    }
  }

  const eliminarExploracion = async (id, cedula, pacNombre) => {
    if (!confirm(`¿Está seguro de que desea eliminar los datos clínicos de la exploración (lesiones y fotos) de ${pacNombre}?`)) return
    try {
      await supabase.from('exploracion_clinica').update({
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
      }).eq('id', id)
      alert('Exploración clínica restablecida con éxito.')
      cargarDatos()
    } catch (e) {
      alert('Error al eliminar exploración clínica: ' + e.message)
    }
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

  // ── SUBIR FOTO (durante el llenado de exploración) ──
  const subirFotoFormulario = async (archivo, slot) => {
    if (!archivo) return
    if (!archivo.type.startsWith('image/')) { setFotoError('Solo se permiten imágenes'); return }
    if (archivo.size > 5 * 1024 * 1024) { setFotoError('La imagen no puede superar 5MB'); return }
    setSubiendoFoto(true); setFotoError('')
    try {
      const ext = archivo.name.split('.').pop()
      const path = `${flujoPaciente.cedula}/foto${slot}_${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage.from('exploracion-fotos').upload(path, archivo, { upsert: true })
      if (uploadError) throw uploadError
      const { data: urlData } = supabase.storage.from('exploracion-fotos').getPublicUrl(path)
      const campo = slot === 1 ? 'foto1Url' : 'foto2Url'
      setExploracion(prev => ({ ...prev, [campo]: urlData.publicUrl }))
    } catch (e) { setFotoError('Error al subir: ' + e.message) }
    setSubiendoFoto(false)
  }

  const eliminarFotoFormulario = (slot) => {
    const campo = slot === 1 ? 'foto1Url' : 'foto2Url'
    setExploracion(prev => ({ ...prev, [campo]: '' }))
  }

  // ── VER FOTOS (solo lectura, en Revisar datos) ──
  const VerFotos = ({ foto1, foto2, nombre, onClose }) => (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '25px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ color: '#fff', marginBottom: '5px' }}>Fotos de exploración clínica</h3>
        <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>{nombre}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
          {[foto1, foto2].map((url, i) => (
            <div key={i} style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '15px', textAlign: 'center' }}>
              <p style={{ color: '#888', fontSize: '12px', marginBottom: '10px' }}>Foto {i + 1}</p>
              {url ? (
                <img src={url} alt={`foto ${i + 1}`} style={{ width: '100%', borderRadius: '6px', maxHeight: '220px', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '120px', backgroundColor: '#222', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#555', fontSize: '30px' }}>📷</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <button style={{ ...s.btn, width: '100%' }} onClick={onClose}>Cerrar</button>
      </div>
    </div>
  )

  // ── CONSENTIMIENTO VIEW (versión simple, se mejora después) ──
  const VerConsentimiento = ({ c, pac, onClose }) => {
    const contenidos = {
      1: {
        titulo: 'CONSENTIMIENTO INFORMADO PARA LA PARTICIPACIÓN EN UN ESTUDIO DE INVESTIGACIÓN',
        intro: `En el marco del desarrollo del presente proyecto de investigación, se le invita a participar de manera voluntaria en este estudio, cuyo propósito es analizar la relación entre los factores emocionales (estrés, ansiedad y depresión) y los hábitos parafuncionales orales en estudiantes de odontología de la Universidad Antonio Nariño, sede Neiva, durante el periodo académico 2026-1 y 2026-2.`,
        parrafoYo: 'actuando en nombre propio, manifiesto que he sido informado(a) de manera clara, suficiente y comprensible, y mis preguntas han sido contestadas de manera satisfactoria por el investigador. Autorizo de forma libre, previa y voluntaria la toma y uso de registros fotográficos intraorales dentro del proyecto de investigación mencionado, desarrollado por los estudiantes investigadores Diana Carolina Cortés, Luisa María Sandoval y Christopher Vargas, bajo la asesoría científica de la Dra. Alejandra Bobadilla Henao.',
        cuerpo: [
          { titulo: '1. Información del estudio', texto: 'He sido informado(a) de manera clara y suficiente sobre el objetivo del estudio, el cual busca analizar la relación entre los hábitos parafuncionales orales y los factores emocionales, así como su posible impacto en la salud oral.' },
          { titulo: '2. Procedimientos', texto: 'Entiendo que mi participación incluye:\n- Responder un cuestionario estructurado que incluye información sobre datos personales generales, antecedentes médicos y hábitos parafuncionales orales.\n- Responder una encuesta validada para la evaluación de aspectos emocionales (estrés, ansiedad y depresión).\n- Someterme a un examen clínico intraoral no invasivo.\n- Permitir la toma de registros fotográficos intraorales, cuando sea necesario (previa autorización específica).' },
          { titulo: '3. Riesgos', texto: 'Se me ha informado que esta investigación es de riesgo mínimo, ya que no implica procedimientos invasivos ni intervenciones que afecten mi integridad física o psicológica. En concordancia con la Resolución 8430 de 1993 del Ministerio de Salud de Colombia, este estudio se clasifica como investigación con riesgo mínimo.' },
          { titulo: '4. Beneficios', texto: 'Comprendo que no recibiré beneficios económicos por mi participación; sin embargo, esta contribuirá al fortalecimiento del conocimiento científico en el área de la salud oral.' },
          { titulo: '5. Confidencialidad y privacidad', texto: 'Se garantiza que la información suministrada será tratada con estricta confidencialidad y utilizada únicamente con fines académicos e investigativos. Mi identidad no será revelada en publicaciones o presentaciones, salvo autorización expresa.' },
          { titulo: '6. Uso de información', texto: 'Autorizo el uso de la información recolectada para análisis académico, presentación de resultados y publicaciones derivadas de la investigación.' },
          { titulo: '7. Participación voluntaria y retiro', texto: 'Entiendo que mi participación es totalmente voluntaria y que puedo retirarme en cualquier momento, sin que esto genere ningún tipo de perjuicio.' },
          { titulo: '8. Aclaración de dudas', texto: 'He tenido la oportunidad de realizar preguntas sobre el estudio y he recibido respuestas claras y satisfactorias por parte de los investigadores.' },
        ]
      },
      2: {
        titulo: 'CONSENTIMIENTO INFORMADO PARA LA TOMA Y USO DE REGISTROS FOTOGRÁFICOS EN INVESTIGACIÓN',
        intro: `En el marco del desarrollo del presente proyecto de investigación, se solicita su autorización para la toma de registros fotográficos intraorales, los cuales serán utilizados exclusivamente con fines académicos y científicos. Estas imágenes permitirán apoyar el análisis clínico y la comprensión de los hábitos parafuncionales en los participantes del estudio.`,
        parrafoYo: 'actuando en nombre propio, manifiesto que he sido informado(a) de manera clara, suficiente y comprensible, y mis preguntas han sido contestadas de manera satisfactoria por el investigador. Autorizo de forma libre, previa y voluntaria la toma y uso de registros fotográficos intraorales dentro del proyecto de investigación mencionado, desarrollado por los estudiantes investigadores Diana Carolina Cortés, Luisa María Sandoval y Christopher Vargas, bajo la asesoría científica de la Dra. Alejandra Bobadilla Henao.',
        cuerpo: [
          { titulo: '1. Finalidad de los registros fotográficos', texto: 'He sido informado(a) de manera clara de que las imágenes serán utilizadas exclusivamente con fines académicos, científicos e investigativos en el desarrollo del trabajo de grado.' },
          { titulo: '2. Procedimiento', texto: 'Entiendo que la toma de fotografías se realizará únicamente en la cavidad oral, mediante procedimientos no invasivos y cumpliendo con las normas de bioseguridad establecidas.' },
          { titulo: '3. Riesgos', texto: 'Se me ha informado que este procedimiento es de riesgo mínimo, ya que no representa daño físico ni psicológico para mi integridad.' },
          { titulo: '4. Confidencialidad y privacidad', texto: 'Se garantiza que las imágenes serán tratadas con estricta confidencialidad, evitando cualquier información que permita mi identificación. En caso de que se requiera incluir elementos que puedan facilitar mi identificación, se solicitará una autorización adicional.' },
          { titulo: '5. Uso de las imágenes', texto: 'Autorizo que los registros fotográficos puedan ser utilizados en análisis clínico, presentaciones académicas o científicas y publicaciones derivadas de la investigación.' },
          { titulo: '6. Participación voluntaria y retiro', texto: 'Comprendo que mi participación es totalmente voluntaria y que puedo retirar mi autorización en cualquier momento, sin que esto genere ningún tipo de perjuicio.' },
          { titulo: '7. Aclaración de dudas', texto: 'Declaro que he recibido información suficiente sobre el propósito, alcance y uso de los registros fotográficos, y que he tenido la oportunidad de realizar preguntas, las cuales han sido respondidas satisfactoriamente.' },
        ]
      }
    }
    const t = contenidos[c.tipo]
    const fechaFormateada = c.fecha_firma ? c.fecha_firma.split('-').reverse().join('/') : ''

    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.92)', zIndex: 1000, overflowY: 'auto', padding: '20px' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '8px', padding: '50px 50px 30px 50px', color: '#000', fontFamily: 'Arial, sans-serif' }}>

          {/* LOGO */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <img src="https://dejgqxavpwttwlefbhhl.supabase.co/storage/v1/object/public/firmas-investigadores/logo-uan.png" alt="Logo Universidad Antonio Nariño" style={{ height: '70px', objectFit: 'contain', display: 'block', margin: '0 auto' }} />
          </div>

          {/* TÍTULO */}
          <div style={{ textAlign: 'center', marginBottom: '25px' }}>
            <p style={{ fontWeight: '700', fontSize: '13px', margin: '0 0 4px 0' }}>{t.titulo}</p>
            <p style={{ fontWeight: '700', fontSize: '13px', margin: 0 }}>TRABAJO DE GRADO</p>
          </div>

          {/* DATOS DEL PROYECTO */}
          <p style={{ fontSize: '13px', marginBottom: '6px' }}><strong>Título del proyecto:</strong> Relación entre factores emocionales y hábitos parafuncionales en estudiantes de odontología de la Universidad Antonio Nariño, Sede Neiva.</p>
          <p style={{ fontSize: '13px', marginBottom: '20px' }}><strong>Ciudad:</strong> Neiva – Huila</p>

          {/* INTRO */}
          <p style={{ fontSize: '13px', marginBottom: '15px', textAlign: 'justify' }}>{t.intro}</p>

          {/* PÁRRAFO YO */}
          <p style={{ fontSize: '13px', marginBottom: '20px', textAlign: 'justify' }}>
            Yo, <strong>{pac?.nombre} {pac?.apellidos}</strong>, identificado(a) con el número de cédula que aparece al pie de mi firma, {t.parrafoYo}
          </p>

          {/* NUMERALES */}
          {t.cuerpo.map((item, i) => (
            <div key={i} style={{ marginBottom: '15px' }}>
              <p style={{ fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>{item.titulo}</p>
              <p style={{ fontSize: '13px', textAlign: 'justify', whiteSpace: 'pre-line', margin: 0 }}>{item.texto}</p>
            </div>
          ))}

          {/* CIERRE */}
          <p style={{ fontSize: '13px', margin: '25px 0 25px 0' }}>En constancia de lo anterior, se firma el presente consentimiento informado.</p>

          {/* FIRMA PACIENTE — tamaño fijo 5cm x 2cm */}
          <div style={{ marginBottom: '15px' }}>
            {c.pdf_url && c.pdf_url.startsWith('data:image') ? (
              <img src={c.pdf_url} alt="firma paciente" style={{ width: '5cm', height: '2cm', objectFit: 'contain', display: 'block', marginBottom: '8px' }} />
            ) : (
              <div style={{ width: '5cm', height: '2cm', marginBottom: '8px' }} />
            )}
          </div>

          {/* DATOS PACIENTE */}
          <p style={{ fontSize: '13px', margin: '3px 0' }}>Nombre: {pac?.nombre} {pac?.apellidos}</p>
          <p style={{ fontSize: '13px', margin: '3px 0' }}>Cédula de ciudadanía: {c.cedula}</p>
          <p style={{ fontSize: '13px', margin: '3px 0 30px 0' }}>Fecha: {fechaFormateada}</p>

          {/* FIRMAS INVESTIGADORES */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
            <tbody>
              <tr>
                <td style={{ width: '50%', padding: '10px 10px 0 0', verticalAlign: 'bottom' }}>
                  <img src="https://dejgqxavpwttwlefbhhl.supabase.co/storage/v1/object/public/firmas-investigadores/Diana.png" alt="firma Diana" style={{ width: '5cm', height: '2cm', objectFit: 'contain', display: 'block', marginBottom: '4px' }} />
                  <p style={{ fontSize: '12px', margin: '2px 0' }}>1101682283</p>
                  <p style={{ fontSize: '12px', margin: '2px 0' }}>Diana Carolina Cortés (20572211983)</p>
                  <p style={{ fontSize: '12px', margin: '2px 0', color: '#555' }}>Estudiante de odontología</p>
                </td>
                <td style={{ width: '50%', padding: '10px 0 0 10px', verticalAlign: 'bottom' }}>
                  <img src="https://dejgqxavpwttwlefbhhl.supabase.co/storage/v1/object/public/firmas-investigadores/Luisa.png" alt="firma Luisa" style={{ width: '5cm', height: '2cm', objectFit: 'contain', display: 'block', marginBottom: '4px' }} />
                  <p style={{ fontSize: '12px', margin: '2px 0' }}>1013104626</p>
                  <p style={{ fontSize: '12px', margin: '2px 0' }}>Luisa María Sandoval (20572212013)</p>
                  <p style={{ fontSize: '12px', margin: '2px 0', color: '#555' }}>Estudiante de odontología</p>
                </td>
              </tr>
              <tr>
                <td style={{ width: '50%', padding: '20px 10px 0 0', verticalAlign: 'bottom' }}>
                  <img src="https://dejgqxavpwttwlefbhhl.supabase.co/storage/v1/object/public/firmas-investigadores/Christopher.png" alt="firma Christopher" style={{ width: '5cm', height: '2cm', objectFit: 'contain', display: 'block', marginBottom: '4px' }} />
                  <p style={{ fontSize: '12px', margin: '2px 0' }}>1003894702</p>
                  <p style={{ fontSize: '12px', margin: '2px 0' }}>Christopher Vargas (20572211040)</p>
                  <p style={{ fontSize: '12px', margin: '2px 0', color: '#555' }}>Estudiante de odontología</p>
                </td>
                <td style={{ width: '50%', padding: '20px 0 0 10px', verticalAlign: 'bottom' }}>
                  <img src="https://dejgqxavpwttwlefbhhl.supabase.co/storage/v1/object/public/firmas-investigadores/Alejandra.png" alt="firma Alejandra" style={{ width: '5cm', height: '2cm', objectFit: 'contain', display: 'block', marginBottom: '4px' }} />
                  <p style={{ fontSize: '12px', margin: '2px 0' }}>123456789</p>
                  <p style={{ fontSize: '12px', margin: '2px 0' }}>Alejandra Bobadilla Henao</p>
                  <p style={{ fontSize: '12px', margin: '2px 0', color: '#555' }}>Docente de odontología</p>
                  <p style={{ fontSize: '12px', margin: '2px 0', color: '#555' }}>Asesora científica</p>
                </td>
              </tr>
            </tbody>
          </table>

          {/* PIE DE PÁGINA */}
          <div style={{ borderTop: '2px solid #1a2e5a', paddingTop: '10px', textAlign: 'center' }}>
            <p style={{ color: '#1a2e5a', fontWeight: '700', fontSize: '13px', margin: 0 }}>www.uan.edu.co</p>
          </div>

          <button onClick={onClose} style={{ marginTop: '25px', padding: '12px 20px', backgroundColor: '#1a2e5a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', width: '100%', fontSize: '14px' }}>Cerrar</button>
        </div>
      </div>
    )
  }

  if (loading) return <div style={{ ...s.body, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><p style={{ color: '#888' }}>Cargando...</p></div>

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
                    <label style={{ color: '#ccc', fontSize: '14px', display: 'block', marginBottom: '8px' }}>¿Presenta lesiones orales? *</label>
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
                      <h4 style={{ color: '#fff', margin: '20px 0 15px' }}>Localización de la lesión (Zonas anatómicas afectadas - Mínimo una opción) *</h4>
                      {[
                        { key: 'mordeduraLabios', label: 'Labios' },
                        { key: 'mordeduraMejillas', label: 'Mejillas' },
                        { key: 'mordeduraLengua', label: 'Lengua' },
                      ].map(f => (
                        <div key={f.key} style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
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

                      <h4 style={{ color: '#fff', margin: '20px 0 15px' }}>Tipo de lesión (mínimo una opción) *</h4>
                      {[
                        { key: 'ulceraTraumatica', label: 'Úlcera traumática' },
                        { key: 'queratosisFriccional', label: 'Queratosis friccional' },
                        { key: 'fibromaTraumatico', label: 'Fibroma traumático' },
                        { key: 'morsicatioBuccarum', label: 'Morsicatio buccarum' },
                        { key: 'morsicatioLabiarum', label: 'Morsicatio labiarum' },
                        { key: 'morsicatioLinguarum', label: 'Morsicatio linguarum' },
                      ].map(f => (
                        <div key={f.key} style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
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

                      <h4 style={{ color: '#fff', margin: '20px 0 10px' }}>Descripción de la lesión {exploracion.presentaLesiones === 'Sí' ? '*' : ''}</h4>
                      <textarea style={s.textarea} placeholder="Describa clínicamente la lesión observada..." value={exploracion.descripcionLesion} onChange={e => setExploracion({ ...exploracion, descripcionLesion: e.target.value })} />

                      <h4 style={{ color: '#fff', margin: '20px 0 10px' }}>
                        Fotos de evidencia {exploracion.presentaLesiones === 'Sí' ? '(obligatorio, mínimo 1, máximo 2)' : ''}
                      </h4>
                      {fotoError && <div style={{ color: '#ff6666', padding: '10px', backgroundColor: '#220000', borderRadius: '6px', marginBottom: '10px', fontSize: '13px' }}>{fotoError}</div>}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {[1, 2].map(slot => {
                          const url = slot === 1 ? exploracion.foto1Url : exploracion.foto2Url
                          return (
                            <div key={slot} style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                              <p style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>Foto {slot}</p>
                              {url ? (
                                <div>
                                  <img src={url} alt={`foto ${slot}`} style={{ width: '100%', borderRadius: '6px', marginBottom: '8px', maxHeight: '150px', objectFit: 'cover' }} />
                                  <button style={{ ...s.btnRed, width: '100%' }} onClick={() => eliminarFotoFormulario(slot)}>Eliminar</button>
                                </div>
                              ) : (
                                <div>
                                  <div style={{ width: '100%', height: '100px', backgroundColor: '#222', borderRadius: '6px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ color: '#555', fontSize: '26px' }}>📷</span>
                                  </div>
                                  <label style={{ ...s.btnGreen, display: 'block', cursor: 'pointer', textAlign: 'center', marginBottom: '6px' }}>
                                    {subiendoFoto ? 'Subiendo...' : '📷 Tomar foto'}
                                    <input type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={e => subirFotoFormulario(e.target.files[0], slot)} disabled={subiendoFoto} />
                                  </label>
                                  <label style={{ ...s.btnBlue, display: 'block', cursor: 'pointer', textAlign: 'center' }}>
                                    {subiendoFoto ? 'Subiendo...' : '🖼️ Elegir archivo'}
                                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => subirFotoFormulario(e.target.files[0], slot)} disabled={subiendoFoto} />
                                  </label>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
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
                <button style={{ ...s.btnGreen, width: '100%', marginBottom: '8px' }} onClick={() => { setFlujoVista('menu'); setFlujoCedula(''); setFlujoPaciente(null); resetFlujoForms() }}>Registrar otro paciente</button>
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
                { key: 'chi2', label: '7. Prueba de Chi-cuadrado' },
              ].map(t => (
                <button key={t.key} onClick={() => { setDetalleVista(t.key); setBusqueda(''); setRespuestaDetalle(null); setConsentimientoVer(null) }}
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
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                  <input style={{ ...s.input, flex: 1, minWidth: '150px' }} value={nuevaEps} onChange={e => setNuevaEps(e.target.value)} placeholder="Nombre de la nueva EPS" onKeyDown={e => e.key === 'Enter' && agregarEps()} />
                  <button style={s.btnGreen} onClick={agregarEps}>+ Agregar</button>
                </div>
                <div className="tabla-wrap-siempre">
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
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button style={s.btnGreen} onClick={guardarEditEps}>Guardar</button>
                                <button style={s.btn} onClick={() => setEditEps(null)}>Cancelar</button>
                              </div>
                            ) : (
                              <div style={{ display: 'flex', gap: '6px' }}>
                                <button style={s.btnBlue} onClick={() => { setEditEps(ep.id); setEditEpsNombre(ep.nombre) }}>Editar</button>
                                <button style={s.btnRed} onClick={() => eliminarEps(ep.id)}>Eliminar</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── 2. CONSENTIMIENTOS ── */}
            {detalleVista === 'consentimientos' && !consentimientoVer && (
              <div style={s.card}>
                <div className="tabla-wrap-siempre">
                  <table style={s.table}>
                    <thead><tr><th style={s.th}>ID</th><th style={s.th}>Nombre</th><th style={s.th}>Cédula</th><th style={s.th}>C1</th><th style={s.th}>C2</th><th style={s.th}>Ver</th></tr></thead>
                    <tbody>
                      {filtrar(ordenarPorIdParticipante(pacientes)).map(p => {
                        const c1 = consentimientos.find(c => c.cedula == p.cedula && c.tipo === 1)
                        const c2 = consentimientos.find(c => c.cedula == p.cedula && c.tipo === 2)
                        return (
                          <tr key={p.id}>
                            <td style={s.td}>{obtenerIdParticipante(p.cedula)}</td>
                            <td style={s.td}>{p.nombre} {p.apellidos}</td>
                            <td style={s.td}>{p.cedula}</td>
                            <td style={s.td}><span style={s.badge(c1 ? 'green' : 'red')}>{c1 ? '✓ Firmado' : '✗ Pendiente'}</span></td>
                            <td style={s.td}><span style={s.badge(c2 ? 'green' : 'red')}>{c2 ? '✓ Firmado' : '✗ Pendiente'}</span></td>
                            <td style={s.td}>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {c1 && (
                                  <div style={{ display: 'flex', gap: '4px' }}>
                                    <button style={s.btnBlue} onClick={() => setConsentimientoVer({ c: c1, pac: p })}>Ver C1</button>
                                    <button style={s.btnRed} onClick={() => eliminarConsentimiento(c1.id, 'Consentimiento 1', p.nombre + ' ' + p.apellidos)}>Eliminar C1</button>
                                  </div>
                                )}
                                {c2 && (
                                  <div style={{ display: 'flex', gap: '4px' }}>
                                    <button style={s.btnBlue} onClick={() => setConsentimientoVer({ c: c2, pac: p })}>Ver C2</button>
                                    <button style={s.btnRed} onClick={() => eliminarConsentimiento(c2.id, 'Consentimiento 2', p.nombre + ' ' + p.apellidos)}>Eliminar C2</button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {consentimientoVer && <VerConsentimiento c={consentimientoVer.c} pac={consentimientoVer.pac} onClose={() => setConsentimientoVer(null)} />}

            {/* ── 3. HISTORIAS ── */}
            {detalleVista === 'historias' && (
              <div style={s.card}>
                <div className="tabla-wrap-siempre">
                  <table style={s.table}>
                    <thead>
                      <tr>
                        <th style={s.th}>ID</th><th style={s.th}>Nombre</th><th style={s.th}>Cédula</th><th style={s.th}>Edad</th>
                        <th style={s.th}>Sexo</th><th style={s.th}>EPS</th><th style={s.th}>Semestre</th>
                        <th style={s.th}>Área</th><th style={s.th}>Enf. Sistémicas</th>
                        <th style={s.th}>Medicamentos</th><th style={s.th}>Ant. Psicológicos</th>
                        <th style={s.th}>Hábitos Orales</th><th style={s.th}>Sustancias</th><th style={s.th}>Fuma/Vape</th><th style={s.th}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtrar(ordenarPorIdParticipante(historias)).map(h => (
                        <tr key={h.id}>
                          <td style={s.td}>{obtenerIdParticipante(h.cedula)}</td>
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
                          <td style={s.td}>
                            <button style={s.btnRed} onClick={() => eliminarHistoria(h.id, getNombre(h.cedula))}>Eliminar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {historias.length === 0 && <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>No hay historias clínicas registradas</p>}
              </div>
            )}

            {/* ── 4. ANÁLISIS DASS-21 ── */}
            {detalleVista === 'analisis' && !respuestaDetalle && (
              <div style={s.card}>
                <div className="tabla-wrap-siempre">
                  <table style={s.table}>
                    <thead>
                      <tr>
                        <th style={s.th}>ID</th><th style={s.th}>Nombre</th><th style={s.th}>Cédula</th>
                        <th style={s.th}>Depresión</th>
                        <th style={s.th}>Ansiedad</th>
                        <th style={s.th}>Estrés</th>
                        <th style={s.th}>Detalle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtrar(ordenarPorIdParticipante(analisis)).map(a => (
                        <tr key={a.id}>
                          <td style={s.td}>{obtenerIdParticipante(a.cedula)}</td>
                          <td style={s.td}>{getNombre(a.cedula)}</td>
                          <td style={s.td}>{a.cedula}</td>
                          <td style={s.td}><span style={s.badge(colorBadge(a.interpretacion_depresion))}>{a.interpretacion_depresion}</span></td>
                          <td style={s.td}><span style={s.badge(colorBadge(a.interpretacion_ansiedad))}>{a.interpretacion_ansiedad}</span></td>
                          <td style={s.td}><span style={s.badge(colorBadge(a.interpretacion_estres))}>{a.interpretacion_estres}</span></td>
                          <td style={s.td}>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button style={s.btnBlue} onClick={() => setRespuestaDetalle(respuestas.find(r => r.cedula == a.cedula))}>Ver detalle</button>
                              <button style={s.btnRed} onClick={() => eliminarEncuesta(a.id, a.cedula, getNombre(a.cedula))}>Eliminar</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {analisis.length === 0 && <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>No hay encuestas completadas</p>}
              </div>
            )}
            {detalleVista === 'analisis' && respuestaDetalle && (
              <div style={s.card}>
                <button style={{ ...s.btn, marginBottom: '15px' }} onClick={() => setRespuestaDetalle(null)}>← Volver a la lista</button>
                <h3 style={{ color: '#fff', marginBottom: '15px' }}>Respuestas de {getNombre(respuestaDetalle.cedula)}</h3>
                <div className="tabla-wrap-siempre">
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
              </div>
            )}

            {/* ── 5. EXPLORACIÓN CLÍNICA ── */}
            {detalleVista === 'exploracion' && (
              <div style={s.card}>
                <div className="tabla-wrap-siempre">
                  <table style={s.table}>
                    <thead>
                      <tr>
                        <th style={s.th}>ID</th><th style={s.th}>Nombre</th><th style={s.th}>Cédula</th>
                        <th style={s.th}>Lesiones</th>
                        <th style={s.th}>Labios</th>
                        <th style={s.th}>Mejillas</th><th style={s.th}>Lengua</th>
                        <th style={s.th}>Úlcera</th><th style={s.th}>Queratosis</th>
                        <th style={s.th}>Fibroma</th><th style={s.th}>M. Buccarum</th>
                        <th style={s.th}>M. Labiarum</th><th style={s.th}>M. Linguarum</th>
                        <th style={s.th}>Descripción</th><th style={s.th}>Fotos</th><th style={s.th}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtrar(ordenarPorIdParticipante(exploraciones)).map(e => (
                        <tr key={e.id}>
                          <td style={s.td}>{obtenerIdParticipante(e.cedula)}</td>
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
                          <td style={s.td}>
                            {e.descripcion_lesion ? (
                              <button style={s.btnBlue} onClick={() => setDescripcionVer({ nombre: getNombre(e.cedula), texto: e.descripcion_lesion })}>Ver texto</button>
                            ) : '—'}
                          </td>
                          <td style={s.td}>
                            {(e.foto1_url || e.foto2_url) ? (
                              <button style={s.btnBlue} onClick={() => setFotosVer({ nombre: getNombre(e.cedula), foto1_url: e.foto1_url, foto2_url: e.foto2_url })}>📷 Ver fotos</button>
                            ) : '—'}
                          </td>
                          <td style={s.td}>
                            {e.presenta_lesiones !== null ? (
                              <button style={s.btnRed} onClick={() => eliminarExploracion(e.id, e.cedula, getNombre(e.cedula))}>Eliminar</button>
                            ) : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {exploraciones.length === 0 && <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>No hay exploraciones registradas</p>}
              </div>
            )}

            {descripcionVer && (
              <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                <div style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '25px', maxWidth: '500px', width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
                  <h3 style={{ color: '#fff', marginBottom: '5px' }}>Descripción de la lesión</h3>
                  <p style={{ color: '#888', fontSize: '13px', marginBottom: '15px' }}>{descripcionVer.nombre}</p>
                  <p style={{ color: '#ddd', fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{descripcionVer.texto}</p>
                  <button style={{ ...s.btn, width: '100%', marginTop: '20px' }} onClick={() => setDescripcionVer(null)}>Cerrar</button>
                </div>
              </div>
            )}

            {fotosVer && (
              <VerFotos foto1={fotosVer.foto1_url} foto2={fotosVer.foto2_url} nombre={fotosVer.nombre} onClose={() => setFotosVer(null)} />
            )}

            {/* ── 6. RESULTADOS DEL ESTUDIO ── */}
            {detalleVista === 'resultados' && (() => {
              // Cálculos base
              const totalConC1 = [...new Set(consentimientos.filter(c => c.tipo === 1).map(c => c.cedula))].length
              const totalHistorias = historias.length
              const totalEncuestas = analisis.length
              const explCompletas = exploraciones.filter(e => e.presenta_lesiones !== null && e.presenta_lesiones !== '')
              const totalExploraciones = explCompletas.length

              // Trastorno = cualquier nivel distinto de Normal en cualquiera de los 3
              const tieneTrastorno = (cedula) => {
                const a = analisis.find(x => x.cedula == cedula)
                if (!a) return false
                return a.interpretacion_depresion !== 'Normal' ||
                       a.interpretacion_ansiedad !== 'Normal' ||
                       a.interpretacion_estres !== 'Normal'
              }

              const conLesionesCedulas = explCompletas.filter(e => e.presenta_lesiones === 'Sí').map(e => e.cedula)
              const sinLesionesCedulas = explCompletas.filter(e => e.presenta_lesiones === 'No').map(e => e.cedula)

              const conL_conT = conLesionesCedulas.filter(c => tieneTrastorno(c)).length
              const conL_sinT = conLesionesCedulas.filter(c => !tieneTrastorno(c)).length
              const sinL_conT = sinLesionesCedulas.filter(c => tieneTrastorno(c)).length
              const sinL_sinT = sinLesionesCedulas.filter(c => !tieneTrastorno(c)).length

              const niveles = ['Normal', 'Leve', 'Moderado', 'Severo', 'Extremadamente severo']
              const coloresNivel = { 'Normal': '#4caf50', 'Leve': '#8bc34a', 'Moderado': '#ffb74d', 'Severo': '#f44336', 'Extremadamente severo': '#b71c1c' }



              return (
                <div>
                  <h3 style={{ color: '#fff', marginBottom: '20px', fontSize: '18px' }}>Resultados del Estudio</h3>

                  {/* BLOQUE 1: 4 ESTADÍSTICAS PRINCIPALES */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginBottom: '25px' }}>
                    {[
                      { label: 'Total pacientes', sublabel: 'con Consentimiento 1 firmado', value: totalConC1, color: '#4fc3f7' },
                      { label: 'Historia clínica', sublabel: 'completada', value: totalHistorias, color: '#81c784' },
                      { label: 'Encuesta DASS-21', sublabel: 'completada', value: totalEncuestas, color: '#ffb74d' },
                      { label: 'Exploración clínica', sublabel: 'completada', value: totalExploraciones, color: '#ce93d8' },
                    ].map(item => (
                      <div key={item.label} style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '18px', textAlign: 'center' }}>
                        <div style={{ fontSize: '40px', fontWeight: '800', color: item.color, lineHeight: 1 }}>{item.value}</div>
                        <div style={{ color: '#fff', fontSize: '13px', fontWeight: '600', marginTop: '8px' }}>{item.label}</div>
                        <div style={{ color: '#666', fontSize: '11px', marginTop: '3px' }}>{item.sublabel}</div>
                      </div>
                    ))}
                  </div>

                  {/* BLOQUE 2: RELACIÓN LESIONES vs TRASTORNOS */}
                  <div style={{ ...s.card, marginBottom: '20px' }}>
                    <h4 style={{ color: '#fff', marginBottom: '5px', fontSize: '15px' }}>Relación entre lesiones orales y trastornos psicológicos</h4>
                    <p style={{ color: '#666', fontSize: '12px', marginBottom: '18px' }}>Trastorno = cualquier nivel distinto de Normal en Depresión, Ansiedad o Estrés · Solo pacientes con exploración clínica completada</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {[
                        { label: 'Con lesiones orales y con trastornos psicológicos', value: conL_conT, color: '#f44336', bg: '#2a0a0a', border: '#5a1a1a' },
                        { label: 'Con lesiones orales y sin trastornos psicológicos', value: conL_sinT, color: '#ff9800', bg: '#2a1a0a', border: '#5a3a0a' },
                        { label: 'Sin lesiones orales y con trastornos psicológicos', value: sinL_conT, color: '#2196f3', bg: '#0a1a2a', border: '#1a3a5a' },
                        { label: 'Sin lesiones orales y sin trastornos psicológicos', value: sinL_sinT, color: '#4caf50', bg: '#0a2a0a', border: '#1a5a1a' },
                      ].map(item => {
                        const total = conL_conT + conL_sinT + sinL_conT + sinL_sinT
                        const pct = total > 0 ? Math.round((item.value / total) * 100) : 0
                        return (
                          <div key={item.label} style={{ backgroundColor: item.bg, border: `1px solid ${item.border}`, borderRadius: '10px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <div style={{ fontSize: '32px', fontWeight: '800', color: item.color, minWidth: '50px', textAlign: 'center' }}>{item.value}</div>
                            <div style={{ flex: 1 }}>
                              <p style={{ color: '#ddd', fontSize: '14px', margin: '0 0 6px 0' }}>{item.label}</p>
                              <div style={{ backgroundColor: '#111', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                                <div style={{ width: `${pct}%`, backgroundColor: item.color, height: '100%', borderRadius: '4px', transition: 'width 0.6s ease' }} />
                              </div>
                            </div>
                            <div style={{ color: item.color, fontSize: '16px', fontWeight: '700', minWidth: '40px', textAlign: 'right' }}>{pct}%</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* BLOQUE 6: PANEL INTERACTIVO */}
                  <div style={{ ...s.card, marginBottom: '20px' }}>
                    <h4 style={{ color: '#fff', marginBottom: '6px', fontSize: '16px', fontWeight: '700', letterSpacing: '0.5px' }}>
                      🔬 Análisis interactivo por variables
                    </h4>
                    <p style={{ color: '#666', fontSize: '12px', marginBottom: '22px' }}>
                      Selecciona un indicador clínico y un factor de análisis para visualizar la distribución de los datos del estudio.
                    </p>

                    {/* SELECTORES */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '18px' }}>
                      <div>
                        <label style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '500', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Indicador clínico
                        </label>
                        <select
                          style={{ ...s.select, width: '100%' }}
                          value={indicadorClinico}
                          onChange={e => { setIndicadorClinico(e.target.value); setDatosInteractivos(null) }}
                        >
                          <option value="">-- Seleccione --</option>
                          <option value="lesiones_orales">Lesiones orales (Sí/No)</option>
                          <option value="lesion_labios">Lesión en labios (Sí/No)</option>
                          <option value="lesion_mejillas">Lesión en mejillas (Sí/No)</option>
                          <option value="lesion_lengua">Lesión en lengua (Sí/No)</option>
                          <option value="depresion">Trastorno de depresión (Sí/No)</option>
                          <option value="ansiedad">Trastorno de ansiedad (Sí/No)</option>
                          <option value="estres">Trastorno de estrés (Sí/No)</option>
                          <option value="cualquier_trastorno">Cualquier trastorno psicológico (Sí/No)</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '500', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Factor de análisis
                        </label>
                        <select
                          style={{ ...s.select, width: '100%' }}
                          value={factorAnalisis}
                          onChange={e => { setFactorAnalisis(e.target.value); setDatosInteractivos(null) }}
                        >
                          <option value="">-- Seleccione --</option>
                          <option value="sexo">Sexo</option>
                          <option value="area">Área de la universidad</option>
                          <option value="fuma">Hábito de fumar/vape</option>
                          <option value="sustancias">Consumo de sustancias psicoactivas</option>
                          <option value="eps">EPS</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                        <button
                          style={{ ...s.btnGreen, width: '100%', padding: '10px 20px', fontWeight: '700', fontSize: '14px' }}
                          onClick={() => {
                            if (!indicadorClinico || !factorAnalisis) {
                              alert('Seleccione ambas variables para generar el análisis.')
                              return
                            }

                            // Obtener valor del indicador para cada paciente
                            const getIndicador = (cedula) => {
                              const e = exploraciones.find(x => x.cedula == cedula)
                              const a = analisis.find(x => x.cedula == cedula)
                              if (indicadorClinico === 'lesiones_orales') return e?.presenta_lesiones === 'Sí'
                              if (indicadorClinico === 'lesion_labios') return e?.mordedura_labios === 'Sí'
                              if (indicadorClinico === 'lesion_mejillas') return e?.mordedura_mejillas === 'Sí'
                              if (indicadorClinico === 'lesion_lengua') return e?.mordedura_lengua === 'Sí'
                              if (indicadorClinico === 'depresion') return a?.interpretacion_depresion && a.interpretacion_depresion !== 'Normal'
                              if (indicadorClinico === 'ansiedad') return a?.interpretacion_ansiedad && a.interpretacion_ansiedad !== 'Normal'
                              if (indicadorClinico === 'estres') return a?.interpretacion_estres && a.interpretacion_estres !== 'Normal'
                              if (indicadorClinico === 'cualquier_trastorno') return a && (a.interpretacion_depresion !== 'Normal' || a.interpretacion_ansiedad !== 'Normal' || a.interpretacion_estres !== 'Normal')
                              return false
                            }

                            // Obtener categoría del factor para cada paciente
                            const getFactor = (cedula) => {
                              const h = historias.find(x => x.cedula == cedula)
                              if (!h) return null
                              if (factorAnalisis === 'sexo') return h.sexo || null
                              if (factorAnalisis === 'area') return h.area || null
                              if (factorAnalisis === 'fuma') {
                                const v = h.fuma_cigarrillo_vape
                                if (!v || v === 'Ninguna') return 'No fuma/vape'
                                return 'Fuma o usa vape'
                              }
                              if (factorAnalisis === 'sustancias') return h.sustancias_psicoactivas || null
                              if (factorAnalisis === 'eps') return h.eps || null
                              return null
                            }

                            // Filtrar solo pacientes con datos completos en ambas variables
                            const patsValidos = pacientes.filter(p => {
                              const e = exploraciones.find(x => x.cedula == p.cedula)
                              const h = historias.find(x => x.cedula == p.cedula)
                              // Para indicadores de exploración, necesitamos e con datos
                              const needsExp = ['lesiones_orales','lesion_labios','lesion_mejillas','lesion_lengua'].includes(indicadorClinico)
                              const needsAnal = ['depresion','ansiedad','estres','cualquier_trastorno'].includes(indicadorClinico)
                              if (needsExp && (!e || e.presenta_lesiones === null || e.presenta_lesiones === '')) return false
                              if (needsAnal && !analisis.find(x => x.cedula == p.cedula)) return false
                              if (!h) return false
                              if (!getFactor(p.cedula)) return false
                              return true
                            })

                            // Agrupar por categoría del factor
                            const grupos = {}
                            patsValidos.forEach(p => {
                              const cat = getFactor(p.cedula)
                              if (!grupos[cat]) grupos[cat] = { total: 0, positivos: 0 }
                              grupos[cat].total++
                              if (getIndicador(p.cedula)) grupos[cat].positivos++
                            })

                            const resultado = Object.entries(grupos).map(([cat, v]) => ({
                              categoria: cat,
                              total: v.total,
                              positivos: v.positivos,
                              negativos: v.total - v.positivos,
                              porcentaje: v.total > 0 ? Math.round((v.positivos / v.total) * 100) : 0
                            })).sort((a, b) => b.porcentaje - a.porcentaje)

                            setDatosInteractivos({
                              items: resultado,
                              totalPacientes: patsValidos.length,
                              totalPositivos: resultado.reduce((acc, d) => acc + d.positivos, 0)
                            })
                          }}
                        >
                          Generar resultados
                        </button>
                      </div>
                    </div>

                    {/* RESULTADOS INTERACTIVOS */}
                    {!datosInteractivos && (
                      <div style={{ padding: '40px 20px', border: '1px dashed #2a2a2a', borderRadius: '10px', textAlign: 'center', backgroundColor: '#0c0c0f' }}>
                        <span style={{ fontSize: '32px', display: 'block', marginBottom: '10px' }}>📊</span>
                        <p style={{ color: '#555', fontSize: '13px', margin: 0 }}>
                          Selecciona el indicador clínico y el factor de análisis y presiona <strong style={{ color: '#9ca3af' }}>Generar resultados</strong>.
                        </p>
                      </div>
                    )}

                    {datosInteractivos && (() => {
                      const { items, totalPacientes, totalPositivos } = datosInteractivos

                      // Paleta de colores para categorías
                      const palette = ['#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6', '#ef4444', '#06b6d4', '#84cc16']

                      const labelIndicador = {
                        lesiones_orales: 'Lesiones orales',
                        lesion_labios: 'Lesión en labios',
                        lesion_mejillas: 'Lesión en mejillas',
                        lesion_lengua: 'Lesión en lengua',
                        depresion: 'Trastorno de depresión',
                        ansiedad: 'Trastorno de ansiedad',
                        estres: 'Trastorno de estrés',
                        cualquier_trastorno: 'Cualquier trastorno psicológico',
                      }[indicadorClinico] || indicadorClinico

                      const labelFactor = {
                        sexo: 'Sexo',
                        area: 'Área de la universidad',
                        fuma: 'Hábito de fumar/vape',
                        sustancias: 'Sustancias psicoactivas',
                        eps: 'EPS',
                      }[factorAnalisis] || factorAnalisis

                      // Donut SVG: solo positivos por categoría
                      const positivosPorCat = items.filter(d => d.positivos > 0)
                      const donutR = 70, donutCx = 100, donutCy = 100, strokeWidth = 30
                      const circ = 2 * Math.PI * donutR
                      let acumulado = 0
                      const donutSegmentos = totalPositivos > 0 ? positivosPorCat.map((d, i) => {
                        const pct = d.positivos / totalPositivos
                        const dashLen = pct * circ
                        const offset = circ - acumulado * circ
                        acumulado += pct
                        return { ...d, dashLen, offset, color: palette[i % palette.length] }
                      }) : []

                      return (
                        <div>
                          {/* Encabezado de resultados */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                            <div>
                              <p style={{ color: '#fff', fontWeight: '600', fontSize: '14px', margin: '0 0 3px 0' }}>
                                {labelIndicador} <span style={{ color: '#666' }}>según</span> {labelFactor}
                              </p>
                              <p style={{ color: '#666', fontSize: '12px', margin: 0 }}>
                                {totalPacientes} pacientes con datos completos · {totalPositivos} con indicador positivo
                              </p>
                            </div>
                            <button
                              style={{ ...s.btn, fontSize: '12px', padding: '6px 14px' }}
                              onClick={() => setDatosInteractivos(null)}
                            >
                              ✕ Limpiar
                            </button>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'start' }}>
                            {/* GRÁFICO DE BARRAS HORIZONTALES */}
                            <div>
                              <p style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px' }}>
                                Prevalencia por {labelFactor}
                              </p>
                              {items.map((d, i) => (
                                <div key={d.categoria} style={{ marginBottom: '14px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '13px', color: '#d1d5db' }}>{d.categoria}</span>
                                    <span style={{ fontSize: '12px', color: palette[i % palette.length], fontWeight: '600' }}>
                                      {d.positivos}/{d.total} · {d.porcentaje}%
                                    </span>
                                  </div>
                                  <div style={{ backgroundColor: '#1a1a1a', borderRadius: '6px', height: '24px', overflow: 'hidden', border: '1px solid #2a2a2a', position: 'relative' }}>
                                    <div style={{
                                      width: `${d.porcentaje}%`,
                                      backgroundColor: palette[i % palette.length],
                                      height: '100%',
                                      borderRadius: '6px',
                                      transition: 'width 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                                      minWidth: d.porcentaje > 0 ? '4px' : '0',
                                      opacity: 0.9
                                    }} />
                                    {d.porcentaje > 10 && (
                                      <span style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#000', fontWeight: '700' }}>
                                        {d.porcentaje}%
                                      </span>
                                    )}
                                  </div>
                                  {/* Mini barra del total */}
                                  <div style={{ marginTop: '3px', display: 'flex', gap: '3px' }}>
                                    {d.total > 0 && (
                                      <div style={{ flex: d.positivos, backgroundColor: palette[i % palette.length], height: '3px', borderRadius: '2px', opacity: 0.5 }} />
                                    )}
                                    {d.negativos > 0 && (
                                      <div style={{ flex: d.negativos, backgroundColor: '#2a2a2a', height: '3px', borderRadius: '2px' }} />
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* GRÁFICO DONA */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <p style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px', alignSelf: 'flex-start' }}>
                                Distribución de casos positivos
                              </p>
                              {totalPositivos === 0 ? (
                                <div style={{ padding: '30px', textAlign: 'center', color: '#555', fontSize: '13px' }}>
                                  Sin casos positivos registrados para mostrar.
                                </div>
                              ) : (
                                <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                                  <svg viewBox="0 0 200 200" width="200" height="200">
                                    {/* Anillo de fondo */}
                                    <circle
                                      cx={donutCx} cy={donutCy} r={donutR}
                                      fill="none" stroke="#1e1e1e" strokeWidth={strokeWidth + 2}
                                    />
                                    {donutSegmentos.map((seg, i) => (
                                      <circle
                                        key={i}
                                        cx={donutCx} cy={donutCy} r={donutR}
                                        fill="none"
                                        stroke={seg.color}
                                        strokeWidth={strokeWidth}
                                        strokeDasharray={`${seg.dashLen} ${circ}`}
                                        strokeDashoffset={seg.offset}
                                        transform={`rotate(-90 ${donutCx} ${donutCy})`}
                                        style={{ transition: 'stroke-dasharray 0.7s ease' }}
                                      />
                                    ))}
                                    {/* Hueco central */}
                                    <circle cx={donutCx} cy={donutCy} r={donutR - strokeWidth / 2 - 1} fill="#111218" />
                                    {/* Texto central */}
                                    <text x={donutCx} y={donutCy - 8} textAnchor="middle" fill="#fff" fontSize="22" fontWeight="800">{totalPositivos}</text>
                                    <text x={donutCx} y={donutCy + 10} textAnchor="middle" fill="#666" fontSize="10">positivos</text>
                                    <text x={donutCx} y={donutCy + 22} textAnchor="middle" fill="#555" fontSize="9">de {totalPacientes}</text>
                                  </svg>
                                </div>
                              )}
                              {/* Leyenda */}
                              <div style={{ marginTop: '14px', width: '100%' }}>
                                {items.filter(d => d.positivos > 0).map((d, i) => (
                                  <div key={d.categoria} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: palette[i % palette.length], flexShrink: 0 }} />
                                    <span style={{ fontSize: '12px', color: '#9ca3af', flex: 1 }}>{d.categoria}</span>
                                    <span style={{ fontSize: '12px', color: palette[i % palette.length], fontWeight: '600' }}>
                                      {totalPositivos > 0 ? Math.round((d.positivos / totalPositivos) * 100) : 0}%
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* TABLA RESUMEN */}
                          <div style={{ marginTop: '24px', overflowX: 'auto' }}>
                            <p style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                              Tabla resumen
                            </p>
                            <table style={{ ...s.table, fontSize: '13px' }}>
                              <thead>
                                <tr>
                                  <th style={s.th}>{labelFactor}</th>
                                  <th style={{ ...s.th, textAlign: 'center' }}>Total pacientes</th>
                                  <th style={{ ...s.th, textAlign: 'center' }}>Con indicador</th>
                                  <th style={{ ...s.th, textAlign: 'center' }}>Sin indicador</th>
                                  <th style={{ ...s.th, textAlign: 'center' }}>Prevalencia</th>
                                </tr>
                              </thead>
                              <tbody>
                                {items.map((d, i) => (
                                  <tr key={d.categoria}>
                                    <td style={s.td}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: palette[i % palette.length] }} />
                                        {d.categoria}
                                      </div>
                                    </td>
                                    <td style={{ ...s.td, textAlign: 'center', color: '#fff' }}>{d.total}</td>
                                    <td style={{ ...s.td, textAlign: 'center' }}>
                                      <span style={s.badge(d.positivos > 0 ? 'yellow' : 'gray')}>{d.positivos}</span>
                                    </td>
                                    <td style={{ ...s.td, textAlign: 'center', color: '#888' }}>{d.negativos}</td>
                                    <td style={{ ...s.td, textAlign: 'center' }}>
                                      <span style={s.badge(d.porcentaje >= 50 ? 'red' : d.porcentaje >= 25 ? 'yellow' : 'green')}>
                                        {d.porcentaje}%
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                                {/* Fila de totales */}
                                <tr style={{ borderTop: '2px solid #333' }}>
                                  <td style={{ ...s.td, fontWeight: '700', color: '#fff' }}>TOTAL</td>
                                  <td style={{ ...s.td, textAlign: 'center', fontWeight: '700', color: '#fff' }}>{totalPacientes}</td>
                                  <td style={{ ...s.td, textAlign: 'center', fontWeight: '700', color: '#fbbf24' }}>{totalPositivos}</td>
                                  <td style={{ ...s.td, textAlign: 'center', fontWeight: '700', color: '#888' }}>{totalPacientes - totalPositivos}</td>
                                  <td style={{ ...s.td, textAlign: 'center', fontWeight: '700', color: '#fff' }}>
                                    {totalPacientes > 0 ? Math.round((totalPositivos / totalPacientes) * 100) : 0}%
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              )
            })()}

            {/* ── 7. PRUEBA DE CHI-CUADRADO ── */}
            {detalleVista === 'chi2' && (
              <div style={s.card}>
                <h3 style={{ color: '#fff', marginBottom: '10px', fontSize: '18px', fontWeight: '600' }}>7. Prueba de Chi-cuadrado</h3>
                <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>
                  Analiza de forma interactiva la asociación estadística entre las variables del estudio clínico. Los cálculos se generan automáticamente sobre todos los registros guardados.
                </p>

                {/* PANEL DE SELECCIÓN */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '15px', alignItems: 'end', marginBottom: '30px', flexWrap: 'wrap' }}>
                  <div>
                    <label style={{ ...s.label, marginBottom: '6px' }}>Variable de las filas:</label>
                    <select style={{ ...s.select, width: '100%' }} value={varFila} onChange={e => { setVarFila(e.target.value); setCalculoChi2(null); }}>
                      <option value="">-- Seleccione una variable --</option>
                      <option value="Lesiones orales (Sí / No)">Lesiones orales (Sí / No)</option>
                      <option value="Lesión en labios (Sí / No)">Lesión en labios (Sí / No)</option>
                      <option value="Lesión en mejillas (Sí / No)">Lesión en mejillas (Sí / No)</option>
                      <option value="Lesión en lengua (Sí / No)">Lesión en lengua (Sí / No)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ ...s.label, marginBottom: '6px' }}>Variable de las columnas:</label>
                    <select style={{ ...s.select, width: '100%' }} value={varColumna} onChange={e => { setVarColumna(e.target.value); setCalculoChi2(null); }}>
                      <option value="">-- Seleccione una variable --</option>
                      <option value="Trastornos psicológicos (Sí / No)">Trastornos psicológicos (Sí / No)</option>
                      <option value="Trastorno psicológico de tipo depresión">Trastorno psicológico de tipo depresión</option>
                      <option value="Trastorno psicológico de tipo ansiedad">Trastorno psicológico de tipo ansiedad</option>
                      <option value="Trastorno psicológico de tipo estrés">Trastorno psicológico de tipo estrés</option>
                      <option value="Hábito de fumar">Hábito de fumar</option>
                      <option value="Hábito de vape">Hábito de vape</option>
                      <option value="Consumo de sustancias psicoactivas">Consumo de sustancias psicoactivas</option>
                      <option value="Área de la universidad">Área de la universidad</option>
                      <option value="Sexo">Sexo</option>
                    </select>
                  </div>
                  <button style={{ ...s.btnGreen, padding: '12px 28px', height: '40px', fontSize: '14px', fontWeight: '600' }} onClick={calcularPruebaChi2}>
                    Calcular
                  </button>
                </div>

                {!calculoChi2 ? (
                  <div style={{ padding: '40px 20px', border: '1px dashed #333', borderRadius: '8px', textAlign: 'center', backgroundColor: '#0a0a0a' }}>
                    <span style={{ fontSize: '36px', display: 'block', marginBottom: '10px' }}>📊</span>
                    <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Selecciona una variable de fila y una de columna, y presiona el botón **Calcular** para ver los resultados.</p>
                  </div>
                ) : (
                  <div>
                    {/* INFO ADICIONAL */}
                    <div style={{ backgroundColor: '#161616', border: '1px solid #2d2d2d', borderRadius: '8px', padding: '12px 18px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', color: '#aaa' }}>Tamaño de muestra analizada (N): <strong style={{ color: '#fff' }}>{calculoChi2.totalN} pacientes</strong></span>
                      <span style={{ fontSize: '12px', color: '#666' }}>Cruzado por Cédula</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px', flexWrap: 'wrap' }}>
                      
                      {/* TABLA DE CONTINGENCIA (OBSERVADO vs ESPERADO) */}
                      <div style={{ backgroundColor: '#141414', border: '1px solid #2c2c2c', borderRadius: '10px', padding: '18px' }}>
                        <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: '600', marginBottom: '15px', borderBottom: '1px solid #2c2c2c', paddingBottom: '8px' }}>
                          Tabla de contingencia (Frecuencias Observadas / Esperadas)
                        </h4>
                        <div className="tabla-wrap-siempre">
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', color: '#fff' }}>
                            <thead>
                              <tr>
                                <th style={{ padding: '10px', borderBottom: '2px solid #333', textAlign: 'left', color: '#888' }}>
                                  {varFila.split(' ')[0]} ↓ \ {varColumna.split(' ')[0]} →
                                </th>
                                <th style={{ padding: '10px', borderBottom: '2px solid #333', textAlign: 'center' }}>{calculoChi2.labelC1}</th>
                                <th style={{ padding: '10px', borderBottom: '2px solid #333', textAlign: 'center' }}>{calculoChi2.labelC2}</th>
                                <th style={{ padding: '10px', borderBottom: '2px solid #333', textAlign: 'center', fontWeight: 'bold', color: '#aaa' }}>Total</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td style={{ padding: '12px 10px', borderBottom: '1px solid #222', fontWeight: 'bold' }}>{calculoChi2.labelF1}</td>
                                <td style={{ padding: '12px 10px', borderBottom: '1px solid #222', textAlign: 'center' }}>
                                  <div style={{ fontSize: '16px', fontWeight: '500' }}>{calculoChi2.obs.o11}</div>
                                  <div style={{ fontSize: '11px', color: '#888' }}>esp: {calculoChi2.esp.e11.toFixed(2)}</div>
                                </td>
                                <td style={{ padding: '12px 10px', borderBottom: '1px solid #222', textAlign: 'center' }}>
                                  <div style={{ fontSize: '16px', fontWeight: '500' }}>{calculoChi2.obs.o12}</div>
                                  <div style={{ fontSize: '11px', color: '#888' }}>esp: {calculoChi2.esp.e12.toFixed(2)}</div>
                                </td>
                                <td style={{ padding: '12px 10px', borderBottom: '1px solid #222', textAlign: 'center', fontWeight: 'bold', color: '#aaa' }}>{calculoChi2.totalF1}</td>
                              </tr>
                              <tr>
                                <td style={{ padding: '12px 10px', borderBottom: '1px solid #222', fontWeight: 'bold' }}>{calculoChi2.labelF2}</td>
                                <td style={{ padding: '12px 10px', borderBottom: '1px solid #222', textAlign: 'center' }}>
                                  <div style={{ fontSize: '16px', fontWeight: '500' }}>{calculoChi2.obs.o21}</div>
                                  <div style={{ fontSize: '11px', color: '#888' }}>esp: {calculoChi2.esp.e21.toFixed(2)}</div>
                                </td>
                                <td style={{ padding: '12px 10px', borderBottom: '1px solid #222', textAlign: 'center' }}>
                                  <div style={{ fontSize: '16px', fontWeight: '500' }}>{calculoChi2.obs.o22}</div>
                                  <div style={{ fontSize: '11px', color: '#888' }}>esp: {calculoChi2.esp.e22.toFixed(2)}</div>
                                </td>
                                <td style={{ padding: '12px 10px', borderBottom: '1px solid #222', textAlign: 'center', fontWeight: 'bold', color: '#aaa' }}>{calculoChi2.totalF2}</td>
                              </tr>
                              <tr style={{ backgroundColor: '#1a1a1a' }}>
                                <td style={{ padding: '10px', fontWeight: 'bold', color: '#aaa' }}>Total</td>
                                <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: '#aaa' }}>{calculoChi2.totalC1}</td>
                                <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: '#aaa' }}>{calculoChi2.totalC2}</td>
                                <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: '#fff' }}>{calculoChi2.totalN}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* TABLA DE PARÁMETROS ESTADÍSTICOS */}
                      <div style={{ backgroundColor: '#141414', border: '1px solid #2c2c2c', borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: '600', marginBottom: '15px', borderBottom: '1px solid #2c2c2c', paddingBottom: '8px' }}>
                            Parámetros del Análisis Estadístico
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #222' }}>
                              <span style={{ color: '#888' }}>Grados de libertad (gl)</span>
                              <span style={{ color: '#fff', fontWeight: 'bold' }}>{calculoChi2.gl}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #222' }}>
                              <span style={{ color: '#888' }}>Nivel de Confianza (P)</span>
                              <span style={{ color: '#fff', fontWeight: 'bold' }}>{(calculoChi2.pValorConfianza * 100).toFixed(0)}%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #222' }}>
                              <span style={{ color: '#888' }}>Nivel de Significancia (α)</span>
                              <span style={{ color: '#fff', fontWeight: 'bold' }}>0.05</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #222' }}>
                              <span style={{ color: '#888' }}>Valor crítico de tabla</span>
                              <span style={{ color: '#64b5f6', fontWeight: 'bold' }}>{calculoChi2.valorCritico.toFixed(3)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #222' }}>
                              <span style={{ color: '#888' }}>Chi-cuadrado calculado (X²)</span>
                              <span style={{ color: '#e57373', fontWeight: 'bold' }}>{calculoChi2.chiTotal.toFixed(6)}</span>
                            </div>
                          </div>
                        </div>

                        {/* RESULTADO DE LA COMPARACIÓN */}
                        <div style={{ marginTop: '20px', padding: '12px 15px', backgroundColor: '#1a1a1a', borderRadius: '8px', border: '1px solid #333', textAlign: 'center' }}>
                          <span style={{ fontSize: '13px', color: '#aaa' }}>Comparación: </span>
                          <strong style={{ fontSize: '14px', color: '#fff' }}>{calculoChi2.chiTotal.toFixed(4)}</strong>
                          <span style={{ fontSize: '13px', color: '#aaa' }}> {calculoChi2.seRechazaH0 ? '>' : '≤'} </span>
                          <strong style={{ fontSize: '14px', color: '#64b5f6' }}>{calculoChi2.valorCritico.toFixed(3)}</strong>
                        </div>
                      </div>
                    </div>

                    {/* DETALLE DE CÁLCULO CELDA POR CELDA */}
                    <div style={{ ...s.card, backgroundColor: '#141414', border: '1px solid #2c2c2c', marginBottom: '25px' }}>
                      <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: '600', marginBottom: '15px', borderBottom: '1px solid #2c2c2c', paddingBottom: '8px' }}>
                        Cálculos analíticos intermedios (celda por celda)
                      </h4>
                      <div className="tabla-wrap-siempre">
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', color: '#fff' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid #333' }}>
                              <th style={{ padding: '8px 10px', textAlign: 'left', color: '#888' }}>Celda (Fila x Columna)</th>
                              <th style={{ padding: '8px 10px', textAlign: 'center', color: '#888' }}>Obs (O)</th>
                              <th style={{ padding: '8px 10px', textAlign: 'center', color: '#888' }}>Esp (E)</th>
                              <th style={{ padding: '8px 10px', textAlign: 'center', color: '#888' }}>(O - E)</th>
                              <th style={{ padding: '8px 10px', textAlign: 'center', color: '#888' }}>(O - E)²</th>
                              <th style={{ padding: '8px 10px', textAlign: 'right', color: '#fff', fontWeight: 'bold' }}>(O - E)² / E</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              { label: `${calculoChi2.labelF1} ∩ ${calculoChi2.labelC1}`, o: calculoChi2.obs.o11, e: calculoChi2.esp.e11, chi: calculoChi2.parc.chi11 },
                              { label: `${calculoChi2.labelF1} ∩ ${calculoChi2.labelC2}`, o: calculoChi2.obs.o12, e: calculoChi2.esp.e12, chi: calculoChi2.parc.chi12 },
                              { label: `${calculoChi2.labelF2} ∩ ${calculoChi2.labelC1}`, o: calculoChi2.obs.o21, e: calculoChi2.esp.e21, chi: calculoChi2.parc.chi21 },
                              { label: `${calculoChi2.labelF2} ∩ ${calculoChi2.labelC2}`, o: calculoChi2.obs.o22, e: calculoChi2.esp.e22, chi: calculoChi2.parc.chi22 },
                            ].map((row, i) => {
                              const dif = row.o - row.e;
                              const difSq = Math.pow(dif, 2);
                              return (
                                <tr key={i} style={{ borderBottom: '1px solid #222' }}>
                                  <td style={{ padding: '10px', color: '#ccc', fontWeight: '500' }}>{row.label}</td>
                                  <td style={{ padding: '10px', textAlign: 'center' }}>{row.o}</td>
                                  <td style={{ padding: '10px', textAlign: 'center', color: '#aaa' }}>{row.e.toFixed(4)}</td>
                                  <td style={{ padding: '10px', textAlign: 'center', color: dif >= 0 ? '#81c784' : '#e57373' }}>{dif.toFixed(4)}</td>
                                  <td style={{ padding: '10px', textAlign: 'center', color: '#aaa' }}>{difSq.toFixed(4)}</td>
                                  <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#e57373' }}>{row.chi.toFixed(6)}</td>
                                </tr>
                              );
                            })}
                            <tr style={{ backgroundColor: '#1a1a1a', fontWeight: 'bold' }}>
                              <td style={{ padding: '10px', color: '#fff' }}>Suma Total (Chi-cuadrado calculado)</td>
                              <td style={{ padding: '10px', textAlign: 'center' }}>{calculoChi2.totalN}</td>
                              <td style={{ padding: '10px', textAlign: 'center', color: '#aaa' }}>{calculoChi2.totalN.toFixed(4)}</td>
                              <td style={{ padding: '10px', textAlign: 'center' }}>0.0000</td>
                              <td style={{ padding: '10px', textAlign: 'center', color: '#aaa' }}>—</td>
                              <td style={{ padding: '10px', textAlign: 'right', color: '#e57373', fontSize: '15px' }}>{calculoChi2.chiTotal.toFixed(6)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* CUADRO DE CONCLUSIÓN */}
                    <div style={{
                      padding: '24px 30px',
                      borderRadius: '12px',
                      border: `1px solid ${calculoChi2.seRechazaH0 ? '#5a1a1a' : '#1a5a1a'}`,
                      backgroundColor: calculoChi2.seRechazaH0 ? '#2a0a0a' : '#0a2a0a',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                      transition: 'all 0.3s ease'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                        <span style={{ fontSize: '28px' }}>{calculoChi2.seRechazaH0 ? '🚨' : '✅'}</span>
                        <h4 style={{ color: '#fff', fontSize: '18px', fontWeight: '600', margin: 0 }}>
                          {calculoChi2.seRechazaH0 
                            ? 'Conclusión: Existe Relación Significativa (Se rechaza H₀)' 
                            : 'Conclusión: Independencia de Variables (Se acepta H₀)'}
                        </h4>
                      </div>
                      
                      <div style={{ fontSize: '15px', lineHeight: '1.6', color: '#ddd' }}>
                        {calculoChi2.seRechazaH0 ? (
                          <>
                            Dado que el valor de Chi-cuadrado calculado (<strong style={{ color: '#ff8a80' }}>{calculoChi2.chiTotal.toFixed(4)}</strong>) es <strong>mayor</strong> que el valor crítico de la tabla (<strong style={{ color: '#64b5f6' }}>{calculoChi2.valorCritico.toFixed(3)}</strong>), <strong>se rechaza la hipótesis nula (H₀)</strong> y <strong>se acepta la hipótesis alternativa (H₁)</strong>.
                            <br /><br />
                            Esto significa estadísticamente, con un nivel de confianza del <strong>95%</strong>, que <strong>existe una relación de dependencia significativa</strong> entre las variables <strong>{varFila.split(' (')[0]}</strong> y <strong>{varColumna.split(' (')[0]}</strong> en el grupo estudiado.
                          </>
                        ) : (
                          <>
                            Dado que el valor de Chi-cuadrado calculado (<strong style={{ color: '#ff8a80' }}>{calculoChi2.chiTotal.toFixed(4)}</strong>) es <strong>menor o igual</strong> que el valor crítico de la tabla (<strong style={{ color: '#64b5f6' }}>{calculoChi2.valorCritico.toFixed(3)}</strong>), <strong>no se puede rechazar la hipótesis nula (H₀)</strong>.
                            <br /><br />
                            Esto significa estadísticamente, con un nivel de confianza del <strong>95%</strong>, que <strong>las variables son independientes</strong> y no se puede afirmar que exista una relación o asociación significativa entre <strong>{varFila.split(' (')[0]}</strong> y <strong>{varColumna.split(' (')[0]}</strong>.
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}