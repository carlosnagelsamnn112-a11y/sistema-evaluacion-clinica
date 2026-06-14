'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import SignaturePad from 'signature_pad'

const consentimientoTextos = {
  1: `CONSENTIMIENTO INFORMADO PARA LA PARTICIPACIÓN EN UN ESTUDIO DE INVESTIGACIÓN TRABAJO DE GRADO

Título del proyecto: Relación entre factores emocionales y hábitos parafuncionales en estudiantes de odontología de la Universidad Antonio Nariño, Sede Neiva.

Ciudad: Neiva – Huila

En el marco del desarrollo del presente proyecto de investigación, se le invita a participar de manera voluntaria en este estudio, cuyo propósito es analizar la relación entre los factores emocionales (estrés, ansiedad y depresión) y los hábitos parafuncionales orales en estudiantes de odontología de la Universidad Antonio Nariño, sede Neiva, durante el periodo académico 2026-1 y 2026-2.

Yo, identificado(a) con el número de cédula que aparece al pie de mi firma, actuando en nombre propio, manifiesto que he sido informado(a) de manera clara, suficiente y comprensible, y que acepto participar de manera libre y voluntaria en el estudio de investigación anteriormente mencionado.

1. INFORMACIÓN DEL ESTUDIO
He sido informado(a) de manera clara y suficiente sobre el objetivo del estudio.

2. PROCEDIMIENTOS
Entiendo que mi participación incluye responder cuestionarios y permitir un examen clínico intraoral no invasivo.

3. RIESGOS
Esta investigación es de riesgo mínimo según la Resolución 8430 de 1993 del Ministerio de Salud de Colombia.

4. BENEFICIOS
No recibiré beneficios económicos, pero contribuiré al conocimiento científico.

5. CONFIDENCIALIDAD
La información será tratada con estricta confidencialidad y usada únicamente con fines académicos.

6. PARTICIPACIÓN VOLUNTARIA
Puedo retirarme en cualquier momento sin ningún perjuicio.`,

  2: `CONSENTIMIENTO INFORMADO PARA LA TOMA Y USO DE REGISTROS FOTOGRÁFICOS

TRABAJO DE GRADO

Título del proyecto: Relación entre factores emocionales y hábitos parafuncionales en estudiantes de odontología de la Universidad Antonio Nariño, Sede Neiva.

Ciudad: Neiva – Huila

Yo, identificado(a) con el número de cédula que aparece al pie de mi firma, autorizo de forma libre y voluntaria la toma y uso de registros fotográficos intraorales dentro del proyecto de investigación mencionado.

1. FINALIDAD
Las imágenes serán utilizadas exclusivamente con fines académicos y científicos.

2. PROCEDIMIENTO
La toma de fotografías se realizará únicamente en la cavidad oral, mediante procedimientos no invasivos.

3. CONFIDENCIALIDAD
Las imágenes serán tratadas con estricta confidencialidad.

4. PARTICIPACIÓN VOLUNTARIA
Puedo retirar mi autorización en cualquier momento sin ningún perjuicio.`
}

const epsList = [
  'Adres', 'Aliansalud EPS', 'Asmet Salud', 'Cajacopi Atlántico',
  'Capital Salud', 'Capresoca', 'Coosalud', 'Dusakawi',
  'EPS Familiar de Colombia', 'EPS Sanitas', 'EPS Sura', 'Famisanar',
  'Indalpe', 'Mallamas', 'Medimás EPS', 'Nueva EPS', 'Pijaos Salud',
  'Salud Bolívar', 'Salud Total EPS', 'Savia Salud',
  'Servicio Occidental de Salud', 'Sisben', 'Particular', 'Otra'
]

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
  body: { backgroundColor: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '15px', fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif', color: '#fff' },
  container: { maxWidth: '700px', width: '100%', backgroundColor: '#111', borderRadius: '12px', padding: '25px', border: '1px solid #333', margin: '10px auto' },
  h2: { color: '#fff', textAlign: 'center', marginBottom: '25px', fontWeight: '500', borderBottom: '2px solid #333', paddingBottom: '15px', fontSize: '20px' },
  h3: { color: '#eee', margin: '15px 0', fontWeight: '500' },
  btn: { backgroundColor: '#222', color: '#fff', border: '1px solid #444', borderRadius: '8px', padding: '12px 24px', fontSize: '16px', fontWeight: '500', cursor: 'pointer', width: '100%', marginBottom: '10px' },
  btnSecondary: { backgroundColor: '#1a1a1a', color: '#fff', border: '1px solid #333', borderRadius: '8px', padding: '12px 24px', fontSize: '16px', cursor: 'pointer', width: '100%', marginBottom: '10px' },
  btnSuccess: { backgroundColor: '#2a5a2a', color: '#fff', border: '1px solid #3a7a3a', borderRadius: '8px', padding: '12px 24px', fontSize: '16px', fontWeight: '500', cursor: 'pointer', width: '100%', marginBottom: '10px' },
  input: { width: '100%', padding: '12px 15px', margin: '5px 0 15px 0', border: '1px solid #333', borderRadius: '6px', fontSize: '15px', backgroundColor: '#1a1a1a', color: '#fff', boxSizing: 'border-box' },
  label: { display: 'block', marginBottom: '5px', color: '#ccc', fontWeight: '500', fontSize: '14px' },
  formGroup: { marginBottom: '10px' },
  error: { color: '#ff6666', fontSize: '14px', margin: '10px 0', padding: '12px', backgroundColor: '#220000', borderRadius: '6px', textAlign: 'center', border: '1px solid #cc0000' },
  success: { backgroundColor: '#1a1a1a', borderLeft: '4px solid #00aa00', padding: '20px', margin: '20px 0', textAlign: 'center', borderRadius: '8px' },
  infoPaciente: { backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '15px', marginBottom: '20px', textAlign: 'center' },
  consentBox: { backgroundColor: '#fff', color: '#000', padding: '20px', borderRadius: '8px', marginBottom: '20px', maxHeight: '350px', overflowY: 'auto', fontSize: '13px', lineHeight: '1.5', whiteSpace: 'pre-wrap' },
  firmaArea: { backgroundColor: '#fff', border: '2px solid #333', borderRadius: '8px', padding: '10px', margin: '15px 0' },
  pregunta: { backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '15px', marginBottom: '12px' },
  opciones: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' },
  opcionLabel: { display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#222', padding: '8px 12px', border: '1px solid #444', borderRadius: '20px', cursor: 'pointer', fontSize: '14px', color: '#ccc' },
  select: { width: '100%', padding: '12px 15px', margin: '5px 0 15px 0', border: '1px solid #333', borderRadius: '6px', fontSize: '15px', backgroundColor: '#1a1a1a', color: '#fff', boxSizing: 'border-box' },
  checkGroup: { backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '12px', margin: '5px 0 15px 0' },
}

export default function Paciente() {
  const [pantalla, setPantalla] = useState('menu')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [paciente, setPaciente] = useState(null)
  const [tipoConsentimiento, setTipoConsentimiento] = useState(null)
  const [epsInput, setEpsInput] = useState('')
  const [epsFiltered, setEpsFiltered] = useState([])
  const [showEps, setShowEps] = useState(false)
  const [respuestas, setRespuestas] = useState({})
  const canvasRef = useRef(null)
  const signaturePadRef = useRef(null)

  const [cons1, setCons1] = useState({ nombre: '', apellidos: '', cedula: '' })
  const [cons2Cedula, setCons2Cedula] = useState('')
  const [historiaCedula, setHistoriaCedula] = useState('')
  const [encuestaCedula, setEncuestaCedula] = useState('')

  const [historia, setHistoria] = useState({
    fechaNacimiento: '', contacto: '', sexo: '', semestre: '',
    enfermedadesSistemicas: '', tipoEnfermedad: '',
    tomaMedicamentos: '', tipoMedicamento: '',
    antecedentesPsicologicos: '', tipoEnfermedadPsicologica: '',
    habitoLabios: false, habitoMejillas: false, habitoLengua: false, habitoNo: false,
    sustanciasPsicoactivas: '', tipoSustancia: '',
    fumaCigarrilloVape: ''
  })

  useEffect(() => {
    if (pantalla === 'consentimiento' && canvasRef.current) {
      setTimeout(() => {
        const canvas = canvasRef.current
        canvas.width = canvas.offsetWidth || 500
        canvas.height = 200
        signaturePadRef.current = new SignaturePad(canvas, {
          backgroundColor: 'rgb(255,255,255)',
          penColor: 'rgb(0,0,0)'
        })
      }, 200)
    }
  }, [pantalla])

  const mostrar = (p) => { setError(''); setPantalla(p) }
  const volverMenu = () => { setPantalla('menu'); setError(''); setPaciente(null) }

  const calcularEdad = (fechaNac) => {
    const hoy = new Date()
    const nac = new Date(fechaNac)
    let edad = hoy.getFullYear() - nac.getFullYear()
    const m = hoy.getMonth() - nac.getMonth()
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--
    return edad
  }

  // ── CONSENTIMIENTO 1 ──
  const validarCons1 = async () => {
    if (!cons1.nombre || !cons1.apellidos || !cons1.cedula) { setError('Complete todos los campos'); return }
    setLoading(true)
    try {
      const { data } = await supabase.from('consentimientos').select('id').eq('cedula', cons1.cedula).eq('tipo', 1)
      if (data && data.length > 0) { setError('Este paciente ya tiene el Consentimiento 1 firmado'); setLoading(false); return }
      setTipoConsentimiento(1)
      mostrar('consentimiento')
    } catch { setError('Error al verificar. Intente de nuevo') }
    setLoading(false)
  }

  // ── CONSENTIMIENTO 2 ──
  const validarCons2 = async () => {
    if (!cons2Cedula) { setError('Ingrese el número de cédula'); return }
    setLoading(true)
    try {
      const { data: c1 } = await supabase.from('consentimientos').select('id').eq('cedula', cons2Cedula).eq('tipo', 1)
      if (!c1 || c1.length === 0) { setError('Debe firmar primero el Consentimiento 1'); setLoading(false); return }
      const { data: c2 } = await supabase.from('consentimientos').select('id').eq('cedula', cons2Cedula).eq('tipo', 2)
      if (c2 && c2.length > 0) { setError('Este paciente ya tiene el Consentimiento 2 firmado'); setLoading(false); return }
      const { data: pac } = await supabase.from('pacientes').select('*').eq('cedula', cons2Cedula).single()
      if (!pac) { setError('Paciente no encontrado'); setLoading(false); return }
      setPaciente(pac)
      setTipoConsentimiento(2)
      mostrar('consentimiento')
    } catch { setError('Error al verificar. Intente de nuevo') }
    setLoading(false)
  }

  // ── GUARDAR CONSENTIMIENTO ──
  const guardarConsentimiento = async () => {
    if (!signaturePadRef.current || signaturePadRef.current.isEmpty()) {
      setError('Por favor firme en el área designada'); return
    }
    setLoading(true)
    try {
      const firmaDataURL = signaturePadRef.current.toDataURL()
      const nombrePaciente = tipoConsentimiento === 1 ? cons1.nombre : paciente.nombre
      const apellidosPaciente = tipoConsentimiento === 1 ? cons1.apellidos : paciente.apellidos
      const cedulaPaciente = tipoConsentimiento === 1 ? cons1.cedula : cons2Cedula

      let pacienteId
      if (tipoConsentimiento === 1) {
        const { data: existePac } = await supabase.from('pacientes').select('id').eq('cedula', cedulaPaciente)
        if (existePac && existePac.length > 0) {
          pacienteId = existePac[0].id
        } else {
          const { data: nuevoPac } = await supabase.from('pacientes').insert({ nombre: nombrePaciente, apellidos: apellidosPaciente, cedula: cedulaPaciente }).select().single()
          pacienteId = nuevoPac.id
        }
      } else {
        pacienteId = paciente.id
      }

      await supabase.from('consentimientos').insert({
        paciente_id: pacienteId,
        cedula: cedulaPaciente,
        tipo: tipoConsentimiento,
        pdf_url: firmaDataURL,
        fecha_firma: new Date().toISOString().split('T')[0]
      })

      mostrar('exitoConsentimiento')
    } catch (e) { setError('Error al guardar: ' + e.message) }
    setLoading(false)
  }

  // ── HISTORIA CLÍNICA ──
  const validarHistoria = async () => {
    if (!historiaCedula) { setError('Ingrese el número de cédula'); return }
    setLoading(true)
    try {
      const { data: c1 } = await supabase.from('consentimientos').select('id').eq('cedula', historiaCedula).eq('tipo', 1)
      if (!c1 || c1.length === 0) { setError('Debe tener el Consentimiento 1 firmado'); setLoading(false); return }
      const { data: c2 } = await supabase.from('consentimientos').select('id').eq('cedula', historiaCedula).eq('tipo', 2)
      if (!c2 || c2.length === 0) { setError('Debe tener el Consentimiento 2 firmado'); setLoading(false); return }
      const { data: hist } = await supabase.from('historias_clinicas').select('id').eq('cedula', historiaCedula)
      if (hist && hist.length > 0) { setError('Este paciente ya tiene historia clínica registrada'); setLoading(false); return }
      const { data: pac } = await supabase.from('pacientes').select('*').eq('cedula', historiaCedula).single()
      if (!pac) { setError('Paciente no encontrado'); setLoading(false); return }
      setPaciente(pac)
      mostrar('historia')
    } catch { setError('Error al verificar') }
    setLoading(false)
  }

  const guardarHistoria = async () => {
    if (!historia.fechaNacimiento || !historia.contacto || !epsInput || !historia.sexo || !historia.semestre) {
      setError('Complete todos los campos requeridos'); return
    }
    if (!historia.habitoNo && !historia.habitoLabios && !historia.habitoMejillas && !historia.habitoLengua) {
      setError('Seleccione al menos una opción de hábitos orales'); return
    }
    if (!historia.fumaCigarrilloVape) { setError('Seleccione una opción sobre consumo de cigarrillo/vape'); return }

    setLoading(true)
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
        paciente_id: paciente.id,
        cedula: paciente.cedula,
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
      mostrar('exitoHistoria')
    } catch (e) { setError('Error al guardar: ' + e.message) }
    setLoading(false)
  }

  // ── ENCUESTA ──
  const validarEncuesta = async () => {
    if (!encuestaCedula) { setError('Ingrese el número de cédula'); return }
    setLoading(true)
    try {
      const { data: c1 } = await supabase.from('consentimientos').select('id').eq('cedula', encuestaCedula).eq('tipo', 1)
      if (!c1 || c1.length === 0) { setError('Debe tener el Consentimiento 1 firmado'); setLoading(false); return }
      const { data: c2 } = await supabase.from('consentimientos').select('id').eq('cedula', encuestaCedula).eq('tipo', 2)
      if (!c2 || c2.length === 0) { setError('Debe tener el Consentimiento 2 firmado'); setLoading(false); return }
      const { data: hist } = await supabase.from('historias_clinicas').select('id').eq('cedula', encuestaCedula)
      if (!hist || hist.length === 0) { setError('Debe registrar primero la historia clínica'); setLoading(false); return }
      const { data: enc } = await supabase.from('respuestas_dass21').select('id').eq('cedula', encuestaCedula)
      if (enc && enc.length > 0) { setError('Este paciente ya completó la encuesta'); setLoading(false); return }
      const { data: pac } = await supabase.from('pacientes').select('*').eq('cedula', encuestaCedula).single()
      setPaciente(pac)
      mostrar('encuesta')
    } catch { setError('Error al verificar') }
    setLoading(false)
  }

  const guardarEncuesta = async () => {
    const faltantes = preguntas.map((_, i) => respuestas[i] === undefined ? i + 1 : null).filter(Boolean)
    if (faltantes.length > 0) { setError(`Faltan las preguntas: ${faltantes.join(', ')}`); return }

    setLoading(true)
    try {
      const obj = {}
      preguntas.forEach((_, i) => { obj[`p${i + 1}`] = parseInt(respuestas[i]) })

      await supabase.from('respuestas_dass21').insert({ paciente_id: paciente.id, cedula: paciente.cedula, ...obj })

      // Calcular DASS-21
      const r = preguntas.map((_, i) => parseInt(respuestas[i]))
      const depresion = [2,4,9,12,15,16,20].reduce((a, i) => a + r[i], 0) * 2
      const ansiedad = [1,3,6,8,14,18,19].reduce((a, i) => a + r[i], 0) * 2
      const estres = [0,5,7,10,11,13,17].reduce((a, i) => a + r[i], 0) * 2

      const interp = (p, tipo) => {
        if (tipo === 'depresion') { if (p<=9) return 'Normal'; if (p<=13) return 'Leve'; if (p<=20) return 'Moderado'; if (p<=27) return 'Severo'; return 'Extremadamente severo' }
        if (tipo === 'ansiedad') { if (p<=7) return 'Normal'; if (p<=9) return 'Leve'; if (p<=14) return 'Moderado'; if (p<=19) return 'Severo'; return 'Extremadamente severo' }
        if (p<=14) return 'Normal'; if (p<=18) return 'Leve'; if (p<=25) return 'Moderado'; if (p<=33) return 'Severo'; return 'Extremadamente severo'
      }

      const intD = interp(depresion, 'depresion')
      const intA = interp(ansiedad, 'ansiedad')
      const intE = interp(estres, 'estres')

      await supabase.from('analisis_dass21').insert({
        paciente_id: paciente.id, cedula: paciente.cedula,
        puntaje_depresion: depresion, puntaje_ansiedad: ansiedad, puntaje_estres: estres,
        interpretacion_depresion: intD, interpretacion_ansiedad: intA, interpretacion_estres: intE
      })

      await supabase.from('exploracion_clinica').insert({
        paciente_id: paciente.id, cedula: paciente.cedula,
        tiene_depresion: (intD === 'Severo' || intD === 'Extremadamente severo') ? 'Sí' : 'No',
        tiene_ansiedad: (intA === 'Severo' || intA === 'Extremadamente severo') ? 'Sí' : 'No',
        tiene_estres: (intE === 'Severo' || intE === 'Extremadamente severo') ? 'Sí' : 'No'
      })

      mostrar('exitoEncuesta')
    } catch (e) { setError('Error al guardar: ' + e.message) }
    setLoading(false)
  }

  // ── RENDER ──
  return (
    <main style={s.body}>
      <div style={s.container}>
        <h2 style={s.h2}>SISTEMA DE EVALUACIÓN CLÍNICA</h2>

        {/* MENÚ */}
        {pantalla === 'menu' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
            <button style={s.btn} onClick={() => { setCons1({ nombre: '', apellidos: '', cedula: '' }); setError(''); mostrar('cedulaCons1') }}>CONSENTIMIENTO 1 RECOLECCIÓN DE DATOS</button>
            <button style={s.btn} onClick={() => { setCons2Cedula(''); setError(''); mostrar('cedulaCons2') }}>CONSENTIMIENTO 2 REGISTRO FOTOGRÁFICO</button>
            <button style={s.btn} onClick={() => { setHistoriaCedula(''); setError(''); mostrar('cedulaHistoria') }}>REGISTRAR HISTORIA CLÍNICA</button>
            <button style={s.btn} onClick={() => { setEncuestaCedula(''); setError(''); mostrar('cedulaEncuesta') }}>REALIZAR ENCUESTA</button>
            <button style={{ ...s.btnSecondary, marginTop: '10px' }} onClick={() => window.location.href = '/'}>← Volver al inicio</button>
          </div>
        )}

        {/* CÉDULA CONSENTIMIENTO 1 */}
        {pantalla === 'cedulaCons1' && (
          <div>
            <h3 style={s.h3}>CONSENTIMIENTO 1 — RECOLECCIÓN DE DATOS</h3>
            <div style={s.formGroup}><label style={s.label}>Nombres completos:</label><input style={s.input} value={cons1.nombre} onChange={e => setCons1({ ...cons1, nombre: e.target.value })} placeholder="Ingrese sus nombres" /></div>
            <div style={s.formGroup}><label style={s.label}>Apellidos completos:</label><input style={s.input} value={cons1.apellidos} onChange={e => setCons1({ ...cons1, apellidos: e.target.value })} placeholder="Ingrese sus apellidos" /></div>
            <div style={s.formGroup}><label style={s.label}>Número de cédula:</label><input style={s.input} type="number" value={cons1.cedula} onChange={e => setCons1({ ...cons1, cedula: e.target.value })} placeholder="Ingrese su número de cédula" /></div>
            {error && <div style={s.error}>{error}</div>}
            <button style={s.btn} onClick={validarCons1} disabled={loading}>{loading ? 'Verificando...' : 'Siguiente'}</button>
            <button style={s.btnSecondary} onClick={volverMenu}>Cancelar</button>
          </div>
        )}

        {/* CÉDULA CONSENTIMIENTO 2 */}
        {pantalla === 'cedulaCons2' && (
          <div>
            <h3 style={s.h3}>CONSENTIMIENTO 2 — REGISTRO FOTOGRÁFICO</h3>
            <div style={s.formGroup}><label style={s.label}>Número de cédula:</label><input style={s.input} type="number" value={cons2Cedula} onChange={e => setCons2Cedula(e.target.value)} placeholder="Ingrese su número de cédula" /></div>
            {error && <div style={s.error}>{error}</div>}
            <button style={s.btn} onClick={validarCons2} disabled={loading}>{loading ? 'Verificando...' : 'Siguiente'}</button>
            <button style={s.btnSecondary} onClick={volverMenu}>Cancelar</button>
          </div>
        )}

        {/* CONSENTIMIENTO FIRMA */}
        {pantalla === 'consentimiento' && (
          <div>
            <h3 style={s.h3}>{tipoConsentimiento === 1 ? 'CONSENTIMIENTO 1 — RECOLECCIÓN DE DATOS' : 'CONSENTIMIENTO 2 — REGISTRO FOTOGRÁFICO'}</h3>
            <div style={s.infoPaciente}>
              <p style={{ color: '#fff', fontSize: '16px' }}>Paciente: <strong>{tipoConsentimiento === 1 ? `${cons1.nombre} ${cons1.apellidos}` : `${paciente?.nombre} ${paciente?.apellidos}`}</strong></p>
              <p style={{ color: '#ccc' }}>Cédula: {tipoConsentimiento === 1 ? cons1.cedula : cons2Cedula}</p>
              <p style={{ color: '#ccc' }}>Fecha: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div style={s.consentBox}>{consentimientoTextos[tipoConsentimiento]}</div>
            <div style={s.firmaArea}>
              <p style={{ color: '#000', marginBottom: '8px', fontWeight: '500' }}>Firma del participante:</p>
              <canvas ref={canvasRef} style={{ width: '100%', height: '200px', border: '1px solid #ccc', borderRadius: '4px', display: 'block' }} />
              <button style={{ ...s.btnSecondary, marginTop: '8px' }} onClick={() => signaturePadRef.current?.clear()}>Limpiar firma</button>
            </div>
            {error && <div style={s.error}>{error}</div>}
            <button style={s.btnSuccess} onClick={guardarConsentimiento} disabled={loading}>{loading ? 'Guardando...' : 'Aceptar y guardar'}</button>
            <button style={s.btnSecondary} onClick={volverMenu}>Cancelar</button>
          </div>
        )}

        {/* CÉDULA HISTORIA */}
        {pantalla === 'cedulaHistoria' && (
          <div>
            <h3 style={s.h3}>VERIFICAR PACIENTE</h3>
            <div style={s.formGroup}><label style={s.label}>Número de cédula:</label><input style={s.input} type="number" value={historiaCedula} onChange={e => setHistoriaCedula(e.target.value)} placeholder="Ingrese número de cédula" /></div>
            {error && <div style={s.error}>{error}</div>}
            <button style={s.btn} onClick={validarHistoria} disabled={loading}>{loading ? 'Verificando...' : 'Siguiente'}</button>
            <button style={s.btnSecondary} onClick={volverMenu}>Cancelar</button>
          </div>
        )}

        {/* HISTORIA CLÍNICA */}
        {pantalla === 'historia' && (
          <div>
            <h3 style={s.h3}>REGISTRO DE HISTORIA CLÍNICA</h3>
            <div style={s.infoPaciente}>
              <p style={{ color: '#fff', fontSize: '16px' }}>Paciente: <strong>{paciente?.nombre} {paciente?.apellidos}</strong></p>
              <p style={{ color: '#ccc' }}>Cédula: {paciente?.cedula}</p>
            </div>
            <div style={s.formGroup}><label style={s.label}>Fecha de nacimiento:</label><input style={s.input} type="date" value={historia.fechaNacimiento} onChange={e => setHistoria({ ...historia, fechaNacimiento: e.target.value })} /></div>
            <div style={s.formGroup}><label style={s.label}>Teléfono de contacto:</label><input style={s.input} type="number" value={historia.contacto} onChange={e => setHistoria({ ...historia, contacto: e.target.value })} placeholder="Número telefónico" /></div>
            <div style={s.formGroup}>
              <label style={s.label}>EPS:</label>
              <input style={s.input} value={epsInput} onChange={e => { setEpsInput(e.target.value); setEpsFiltered(epsList.filter(ep => ep.toLowerCase().includes(e.target.value.toLowerCase()))); setShowEps(true) }} onFocus={() => { setEpsFiltered(epsList); setShowEps(true) }} onBlur={() => setTimeout(() => setShowEps(false), 200)} placeholder="Buscar EPS..." />
              {showEps && epsFiltered.length > 0 && (
                <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #444', borderRadius: '6px', maxHeight: '180px', overflowY: 'auto', position: 'relative', zIndex: 10 }}>
                  {epsFiltered.map(ep => <div key={ep} style={{ padding: '10px 15px', cursor: 'pointer', borderBottom: '1px solid #333', color: '#fff' }} onMouseDown={() => { setEpsInput(ep); setShowEps(false) }}>{ep}</div>)}
                </div>
              )}
            </div>
            <div style={s.formGroup}><label style={s.label}>Sexo:</label><select style={s.select} value={historia.sexo} onChange={e => setHistoria({ ...historia, sexo: e.target.value })}><option value="">-- Seleccione --</option><option>Masculino</option><option>Femenino</option><option>Otro</option></select></div>
            <div style={s.formGroup}><label style={s.label}>Semestre actual:</label><input style={s.input} type="number" min="1" max="9" value={historia.semestre} onChange={e => setHistoria({ ...historia, semestre: e.target.value })} placeholder="1 a 9" /></div>
            <div style={s.formGroup}><label style={s.label}>¿Presenta enfermedades sistémicas?</label><select style={s.select} value={historia.enfermedadesSistemicas} onChange={e => setHistoria({ ...historia, enfermedadesSistemicas: e.target.value })}><option value="">-- Seleccione --</option><option>No</option><option>Sí</option></select></div>
            {historia.enfermedadesSistemicas === 'Sí' && <div style={s.formGroup}><label style={s.label}>Especifique la enfermedad:</label><input style={s.input} value={historia.tipoEnfermedad} onChange={e => setHistoria({ ...historia, tipoEnfermedad: e.target.value })} /></div>}
            <div style={s.formGroup}><label style={s.label}>¿Toma medicamentos?</label><select style={s.select} value={historia.tomaMedicamentos} onChange={e => setHistoria({ ...historia, tomaMedicamentos: e.target.value })}><option value="">-- Seleccione --</option><option>No</option><option>Sí</option></select></div>
            {historia.tomaMedicamentos === 'Sí' && <div style={s.formGroup}><label style={s.label}>Especifique el medicamento:</label><input style={s.input} value={historia.tipoMedicamento} onChange={e => setHistoria({ ...historia, tipoMedicamento: e.target.value })} /></div>}
            <div style={s.formGroup}><label style={s.label}>¿Antecedentes psicológicos?</label><select style={s.select} value={historia.antecedentesPsicologicos} onChange={e => setHistoria({ ...historia, antecedentesPsicologicos: e.target.value })}><option value="">-- Seleccione --</option><option>No</option><option>Sí</option></select></div>
            {historia.antecedentesPsicologicos === 'Sí' && <div style={s.formGroup}><label style={s.label}>Especifique:</label><input style={s.input} value={historia.tipoEnfermedadPsicologica} onChange={e => setHistoria({ ...historia, tipoEnfermedadPsicologica: e.target.value })} /></div>}
            <div style={s.formGroup}>
              <label style={s.label}>¿Presenta hábitos que generen lesiones orales?</label>
              <div style={s.checkGroup}>
                {[['habitoNo', 'No'], ['habitoLabios', 'Mordedura de labios'], ['habitoMejillas', 'Mordedura de mejillas'], ['habitoLengua', 'Mordedura de lengua']].map(([key, label]) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '8px 0', cursor: 'pointer', color: '#ccc' }}>
                    <input type="checkbox" checked={historia[key]} onChange={e => {
                      if (key === 'habitoNo' && e.target.checked) setHistoria({ ...historia, habitoNo: true, habitoLabios: false, habitoMejillas: false, habitoLengua: false })
                      else setHistoria({ ...historia, [key]: e.target.checked, habitoNo: false })
                    }} />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            <div style={s.formGroup}><label style={s.label}>¿Consume sustancias psicoactivas?</label><select style={s.select} value={historia.sustanciasPsicoactivas} onChange={e => setHistoria({ ...historia, sustanciasPsicoactivas: e.target.value })}><option value="">-- Seleccione --</option><option>No</option><option>Sí</option></select></div>
            {historia.sustanciasPsicoactivas === 'Sí' && <div style={s.formGroup}><label style={s.label}>Especifique:</label><input style={s.input} value={historia.tipoSustancia} onChange={e => setHistoria({ ...historia, tipoSustancia: e.target.value })} /></div>}
            <div style={s.formGroup}>
              <label style={s.label}>¿Fuma cigarrillo o vape?</label>
              <div style={s.checkGroup}>
                {['Cigarrillo', 'Vape', 'Las dos', 'Ninguna'].map(op => (
                  <label key={op} style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '8px 0', cursor: 'pointer', color: '#ccc' }}>
                    <input type="radio" name="fuma" value={op} checked={historia.fumaCigarrilloVape === op} onChange={e => setHistoria({ ...historia, fumaCigarrilloVape: e.target.value })} />
                    {op}
                  </label>
                ))}
              </div>
            </div>
            {error && <div style={s.error}>{error}</div>}
            <button style={s.btn} onClick={guardarHistoria} disabled={loading}>{loading ? 'Guardando...' : 'Guardar registro'}</button>
            <button style={s.btnSecondary} onClick={volverMenu}>Cancelar</button>
          </div>
        )}

        {/* CÉDULA ENCUESTA */}
        {pantalla === 'cedulaEncuesta' && (
          <div>
            <h3 style={s.h3}>VERIFICAR PACIENTE PARA ENCUESTA</h3>
            <div style={s.formGroup}><label style={s.label}>Número de cédula:</label><input style={s.input} type="number" value={encuestaCedula} onChange={e => setEncuestaCedula(e.target.value)} placeholder="Ingrese número de cédula" /></div>
            {error && <div style={s.error}>{error}</div>}
            <button style={s.btn} onClick={validarEncuesta} disabled={loading}>{loading ? 'Verificando...' : 'Continuar'}</button>
            <button style={s.btnSecondary} onClick={volverMenu}>Cancelar</button>
          </div>
        )}

        {/* ENCUESTA */}
        {pantalla === 'encuesta' && (
          <div>
            <h3 style={s.h3}>ENCUESTA DASS-21</h3>
            <div style={s.infoPaciente}>
              <p style={{ color: '#fff', fontSize: '16px' }}>Paciente: <strong>{paciente?.nombre} {paciente?.apellidos}</strong></p>
            </div>
            <p style={{ color: '#999', marginBottom: '15px', fontSize: '14px' }}>Seleccione una opción para cada pregunta (0 = No me ocurrió, 3 = Me ocurrió mucho)</p>
            {preguntas.map((p, i) => (
              <div key={i} style={s.pregunta}>
                <strong style={{ color: '#fff', display: 'block', marginBottom: '10px', fontSize: '14px' }}>{i + 1}. {p}</strong>
                <div style={s.opciones}>
                  {[0, 1, 2, 3].map(v => (
                    <label key={v} style={{ ...s.opcionLabel, backgroundColor: respuestas[i] === v ? '#2a5a2a' : '#222', borderColor: respuestas[i] === v ? '#3a7a3a' : '#444' }}>
                      <input type="radio" name={`p${i}`} value={v} checked={respuestas[i] === v} onChange={() => setRespuestas({ ...respuestas, [i]: v })} style={{ display: 'none' }} />
                      {v}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            {error && <div style={s.error}>{error}</div>}
            <button style={s.btn} onClick={guardarEncuesta} disabled={loading}>{loading ? 'Guardando...' : 'Guardar respuestas'}</button>
            <button style={s.btnSecondary} onClick={volverMenu}>Cancelar</button>
          </div>
        )}

        {/* PANTALLAS DE ÉXITO */}
        {pantalla === 'exitoConsentimiento' && (
          <div style={s.success}><h3 style={{ color: '#00ff00' }}>✓ Consentimiento guardado correctamente</h3><p style={{ color: '#ccc' }}>La firma ha sido registrada en el sistema.</p><button style={{ ...s.btn, marginTop: '20px' }} onClick={volverMenu}>Volver al inicio</button></div>
        )}
        {pantalla === 'exitoHistoria' && (
          <div style={s.success}><h3 style={{ color: '#00ff00' }}>✓ Historia clínica guardada correctamente</h3><p style={{ color: '#ccc' }}>Los datos han sido almacenados en el sistema.</p><button style={{ ...s.btn, marginTop: '20px' }} onClick={volverMenu}>Volver al inicio</button></div>
        )}
        {pantalla === 'exitoEncuesta' && (
          <div style={s.success}><h3 style={{ color: '#00ff00' }}>✓ Encuesta guardada correctamente</h3><p style={{ color: '#ccc' }}>Las respuestas han sido almacenadas en el sistema.</p><button style={{ ...s.btn, marginTop: '20px' }} onClick={volverMenu}>Volver al inicio</button></div>
        )}
      </div>
    </main>
  )
}