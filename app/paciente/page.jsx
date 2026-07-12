'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import SignaturePad from 'signature_pad'

const consentimientoTextos = {
  1: `CONSENTIMIENTO INFORMADO PARA LA PARTICIPACIÓN EN UN ESTUDIO DE INVESTIGACIÓN
TRABAJO DE GRADO

Título del proyecto: Relación entre factores emocionales y hábitos parafuncionales en estudiantes de odontología de la Universidad Antonio Nariño, Sede Neiva.

Ciudad: Neiva – Huila

En el marco del desarrollo del presente proyecto de investigación, se le invita a participar de manera voluntaria en este estudio, cuyo propósito es analizar la relación entre los factores emocionales (estrés, ansiedad y depresión) y los hábitos parafuncionales orales en estudiantes de odontología de la Universidad Antonio Nariño, sede Neiva, durante el periodo académico 2026-1 y 2026-2.

Yo, identificado(a) con el número de cédula que aparece al pie de mi firma, actuando en nombre propio, manifiesto que he sido informado(a) de manera clara, suficiente y comprensible, y mis preguntas han sido contestadas de manera satisfactoria por el investigador. Autorizo de forma libre, previa y voluntaria la toma y uso de registros fotográficos intraorales dentro del proyecto de investigación mencionado, desarrollado por los estudiantes investigadores Diana Carolina Cortés, Luisa María Sandoval y Christopher Vargas, bajo la asesoría científica de la Dra. Alejandra Bobadilla Henao.

1. Información del estudio
He sido informado(a) de manera clara y suficiente sobre el objetivo del estudio, el cual busca analizar la relación entre los hábitos parafuncionales orales y los factores emocionales, así como su posible impacto en la salud oral.

2. Procedimientos
Entiendo que mi participación incluye:
- Responder un cuestionario estructurado que incluye información sobre datos personales generales, antecedentes médicos y hábitos parafuncionales orales.
- Responder una encuesta validada para la evaluación de aspectos emocionales (estrés, ansiedad y depresión).
- Someterme a un examen clínico intraoral no invasivo.
- Permitir la toma de registros fotográficos intraorales, cuando sea necesario (previa autorización específica).

3. Riesgos
Se me ha informado que esta investigación es de riesgo mínimo, ya que no implica procedimientos invasivos ni intervenciones que afecten mi integridad física o psicológica. En concordancia con la Resolución 8430 de 1993 del Ministerio de Salud de Colombia, este estudio se clasifica como investigación con riesgo mínimo.

4. Beneficios
Comprendo que no recibiré beneficios económicos por mi participación; sin embargo, esta contribuirá al fortalecimiento del conocimiento científico en el área de la salud oral.

5. Confidencialidad y privacidad
Se garantiza que la información suministrada será tratada con estricta confidencialidad y utilizada únicamente con fines académicos e investigativos. Mi identidad no será revelada en publicaciones o presentaciones, salvo autorización expresa.

6. Uso de información
Autorizo el uso de la información recolectada para análisis académico, presentación de resultados y publicaciones derivadas de la investigación.

7. Participación voluntaria y retiro
Entiendo que mi participación es totalmente voluntaria y que puedo retirarme en cualquier momento, sin que esto genere ningún tipo de perjuicio.

8. Aclaración de dudas
He tenido la oportunidad de realizar preguntas sobre el estudio y he recibido respuestas claras y satisfactorias por parte de los investigadores.

En constancia de lo anterior, se firma el presente consentimiento informado.`,

  2: `CONSENTIMIENTO INFORMADO PARA LA TOMA Y USO DE REGISTROS FOTOGRÁFICOS EN INVESTIGACIÓN
TRABAJO DE GRADO

Título del proyecto: Relación entre factores emocionales y hábitos parafuncionales en estudiantes de odontología de la Universidad Antonio Nariño, Sede Neiva.

Ciudad: Neiva – Huila

En el marco del desarrollo del presente proyecto de investigación, se solicita su autorización para la toma de registros fotográficos intraorales, los cuales serán utilizados exclusivamente con fines académicos y científicos. Estas imágenes permitirán apoyar el análisis clínico y la comprensión de los hábitos parafuncionales en los participantes del estudio.

Yo, identificado(a) con el número de cédula que aparece al pie de mi firma, actuando en nombre propio, manifiesto que he sido informado(a) de manera clara, suficiente y comprensible, y mis preguntas han sido contestadas de manera satisfactoria por el investigador. Autorizo de forma libre, previa y voluntaria la toma y uso de registros fotográficos intraorales dentro del proyecto de investigación mencionado, desarrollado por los estudiantes investigadores Diana Carolina Cortés, Luisa María Sandoval y Christopher Vargas, bajo la asesoría científica de la Dra. Alejandra Bobadilla Henao.

1. Finalidad de los registros fotográficos
He sido informado(a) de manera clara de que las imágenes serán utilizadas exclusivamente con fines académicos, científicos e investigativos en el desarrollo del trabajo de grado.

2. Procedimiento
Entiendo que la toma de fotografías se realizará únicamente en la cavidad oral, mediante procedimientos no invasivos y cumpliendo con las normas de bioseguridad establecidas.

3. Riesgos
Se me ha informado que este procedimiento es de riesgo mínimo, ya que no representa daño físico ni psicológico para mi integridad.

4. Confidencialidad y privacidad
Se garantiza que las imágenes serán tratadas con estricta confidencialidad, evitando cualquier información que permita mi identificación. En caso de que se requiera incluir elementos que puedan facilitar mi identificación, se solicitará una autorización adicional.

5. Uso de las imágenes
Autorizo que los registros fotográficos puedan ser utilizados en análisis clínico, presentaciones académicas o científicas y publicaciones derivadas de la investigación.

6. Participación voluntaria y retiro
Comprendo que mi participación es totalmente voluntaria y que puedo retirar mi autorización en cualquier momento, sin que esto genere ningún tipo de perjuicio.

7. Aclaración de dudas
Declaro que he recibido información suficiente sobre el propósito, alcance y uso de los registros fotográficos, y que he tenido la oportunidad de realizar preguntas, las cuales han sido respondidas satisfactoriamente.

En constancia de lo anterior, se firma el presente consentimiento informado.`
}

const s = {
  body: { backgroundColor: '#08080c', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '15px', fontFamily: 'var(--font-sans)', color: '#fff' },
  container: { maxWidth: '700px', width: '100%', backgroundColor: '#111218', borderRadius: '12px', padding: '25px', border: '1px solid rgba(255, 255, 255, 0.06)', margin: '10px auto', boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)' },
  h2: { color: '#fff', textAlign: 'center', marginBottom: '25px', fontWeight: '500', borderBottom: '2px solid rgba(255, 255, 255, 0.08)', paddingBottom: '15px', fontSize: '20px' },
  h3: { color: '#eee', margin: '15px 0', fontWeight: '500' },
  btn: { backgroundColor: '#1b1d26', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '12px 24px', fontSize: '16px', fontWeight: '500', cursor: 'pointer', width: '100%', marginBottom: '10px' },
  btnSecondary: { backgroundColor: '#111218', color: '#9ca3af', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '12px 24px', fontSize: '16px', cursor: 'pointer', width: '100%', marginBottom: '10px' },
  btnSuccess: { backgroundColor: 'rgba(16, 185, 129, 0.12)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', padding: '12px 24px', fontSize: '16px', fontWeight: '500', cursor: 'pointer', width: '100%', marginBottom: '10px' },
  input: { width: '100%', padding: '12px 15px', margin: '5px 0 15px 0', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px', fontSize: '15px', backgroundColor: '#15161e', color: '#fff', boxSizing: 'border-box' },
  label: { display: 'block', marginBottom: '5px', color: '#9ca3af', fontWeight: '500', fontSize: '14px' },
  formGroup: { marginBottom: '10px' },
  error: { color: '#f87171', fontSize: '14px', margin: '10px 0', padding: '12px', backgroundColor: 'rgba(239, 68, 68, 0.12)', borderRadius: '6px', textAlign: 'center', border: '1px solid rgba(239, 68, 68, 0.2)' },
  success: { backgroundColor: '#111218', borderLeft: '4px solid #10b981', padding: '20px', margin: '20px 0', textAlign: 'center', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' },
  infoPaciente: { backgroundColor: '#15161e', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '8px', padding: '15px', marginBottom: '20px', textAlign: 'center' },
  consentBox: { backgroundColor: '#0d0d12', color: '#e5e7eb', padding: '20px', borderRadius: '8px', marginBottom: '20px', maxHeight: '350px', overflowY: 'auto', fontSize: '13px', lineHeight: '1.6', whiteSpace: 'pre-wrap', border: '1px solid rgba(255, 255, 255, 0.06)' },
  firmaArea: { backgroundColor: '#fff', border: '2px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '10px', margin: '15px 0' },
}

export default function Paciente() {
  const [pantalla, setPantalla] = useState('menu')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [paciente, setPaciente] = useState(null)
  const [tipoConsentimiento, setTipoConsentimiento] = useState(null)
  const canvasRef = useRef(null)
  const signaturePadRef = useRef(null)

  const [cons1, setCons1] = useState({ nombre: '', apellidos: '', cedula: '' })
  const [cons2Cedula, setCons2Cedula] = useState('')

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
          const { data: nuevoPac, error: errorPac } = await supabase.from('pacientes').insert({ nombre: nombrePaciente, apellidos: apellidosPaciente, cedula: cedulaPaciente }).select().single()
          if (errorPac || !nuevoPac) { setError('Error al crear paciente: ' + (errorPac?.message || 'sin datos')); setLoading(false); return }
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

  return (
    <main style={s.body}>
      <style>{`
        button { transition: all 0.2s ease; }
        button:hover { filter: brightness(1.2); transform: translateY(-1px); }
        button:active { transform: translateY(0) scale(0.98); }
        input { transition: all 0.2s ease; }
        input:focus { border-color: #fbbf24 !important; box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.15); }
      `}</style>
      <div style={s.container}>
        <h2 style={s.h2}>SISTEMA DE EVALUACIÓN CLÍNICA</h2>

        {/* MENÚ — solo consentimientos */}
        {pantalla === 'menu' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
            <button style={s.btn} onClick={() => { setCons1({ nombre: '', apellidos: '', cedula: '' }); setError(''); mostrar('cedulaCons1') }}>
              CONSENTIMIENTO 1 — RECOLECCIÓN DE DATOS
            </button>
            <button style={s.btn} onClick={() => { setCons2Cedula(''); setError(''); mostrar('cedulaCons2') }}>
              CONSENTIMIENTO 2 — REGISTRO FOTOGRÁFICO
            </button>
            <button style={{ ...s.btnSecondary, marginTop: '10px' }} onClick={() => window.location.href = '/'}>
              ← Volver al inicio
            </button>
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

        {/* ÉXITO */}
        {pantalla === 'exitoConsentimiento' && (
          <div style={s.success}>
            <h3 style={{ color: '#00ff00' }}>✓ Consentimiento guardado correctamente</h3>
            <p style={{ color: '#ccc', margin: '10px 0' }}>La firma ha sido registrada en el sistema.</p>
            <button style={{ ...s.btn, marginTop: '20px' }} onClick={volverMenu}>Volver al inicio</button>
          </div>
        )}
      </div>
    </main>
  )
}