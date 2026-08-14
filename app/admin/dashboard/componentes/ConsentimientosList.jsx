import React, { useState } from 'react'

const VerConsentimiento = ({ c, pac, onClose }) => {
  const contenidos = {
    1: {
      titulo: 'CONSENTIMIENTO INFORMADO PARA LA PARTICIPACIÓN EN UN ESTUDIO DE INVESTIGACIÓN',
      intro: `En el marco del desarrollo del presente proyecto de investigación, se le invita a participar de manera voluntaria en este estudio, cuyo propósito es analizar la relación entre los factores emocionales (estrés, ansiedad y depresión) y los hábitos parafuncionales orales en estudiantes de odontología de la Universidad Antonio Nariño, sede Neiva, durante el periodo académico 2026-1 y 2026-2.`,
      parrafoYo: 'actuando en nombre propio, manifiesto que he sido informado(a) de manera clara, suficiente y comprensible, y mis preguntas han sido contestadas de manera satisfactoria por el investigador. Autorizo de forma libre, previa y voluntaria la toma y uso de registros fotográficos intraorales dentro del proyecto de investigación mencionado, desarrollado por los estudiantes investigadores Diana Carolina Cortés Dulcey, Luisa María Sandoval Ibarra y Christopher Vargas Quiroga, bajo la asesoría temática de la Dra. Alejandra Bobadilla Henao.',
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
      parrafoYo: 'actuando en nombre propio, manifiesto que he sido informado(a) de manera clara, suficiente y comprensible, y mis preguntas han sido contestadas de manera satisfactoria por el investigador. Autorizo de forma libre, previa y voluntaria la toma y uso de registros fotográficos intraorales dentro del proyecto de investigación mencionado, desarrollado por los estudiantes investigadores Diana Carolina Cortés Dulcey, Luisa María Sandoval Ibarra y Christopher Vargas Quiroga, bajo la asesoría temática de la Dra. Alejandra Bobadilla Henao.',
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
                <p style={{ fontSize: '12px', margin: '2px 0' }}>C.C. 1101682283</p>
                <p style={{ fontSize: '12px', margin: '2px 0' }}>Diana Carolina Cortés Dulcey (código 20572211983)</p>
                <p style={{ fontSize: '12px', margin: '2px 0', color: '#555' }}>Estudiante de odontología</p>
              </td>
              <td style={{ width: '50%', padding: '10px 0 0 10px', verticalAlign: 'bottom' }}>
                <img src="https://dejgqxavpwttwlefbhhl.supabase.co/storage/v1/object/public/firmas-investigadores/Luisa.png" alt="firma Luisa" style={{ width: '5cm', height: '2cm', objectFit: 'contain', display: 'block', marginBottom: '4px' }} />
                <p style={{ fontSize: '12px', margin: '2px 0' }}>C.C. 1013104626</p>
                <p style={{ fontSize: '12px', margin: '2px 0' }}>Luisa María Sandoval Ibarra (código 20572212013)</p>
                <p style={{ fontSize: '12px', margin: '2px 0', color: '#555' }}>Estudiante de odontología</p>
              </td>
            </tr>
            <tr>
              <td style={{ width: '50%', padding: '20px 10px 0 0', verticalAlign: 'bottom' }}>
                <img src="https://dejgqxavpwttwlefbhhl.supabase.co/storage/v1/object/public/firmas-investigadores/Christopher.png" alt="firma Christopher" style={{ width: '5cm', height: '2cm', objectFit: 'contain', display: 'block', marginBottom: '4px' }} />
                <p style={{ fontSize: '12px', margin: '2px 0' }}>C.C. 1003894702</p>
                <p style={{ fontSize: '12px', margin: '2px 0' }}>Christopher Vargas Quiroga (código 20572211040)</p>
                <p style={{ fontSize: '12px', margin: '2px 0', color: '#555' }}>Estudiante de odontología</p>
              </td>
              <td style={{ width: '50%', padding: '20px 0 0 10px', verticalAlign: 'bottom' }}>
                <img src="https://dejgqxavpwttwlefbhhl.supabase.co/storage/v1/object/public/firmas-investigadores/Alejandra.png" alt="firma Alejandra" style={{ width: '5cm', height: '2cm', objectFit: 'contain', display: 'block', marginBottom: '4px' }} />
                <p style={{ fontSize: '12px', margin: '2px 0' }}>C.C. 1075238979</p>
                <p style={{ fontSize: '12px', margin: '2px 0' }}>Alejandra Bobadilla Henao</p>
                <p style={{ fontSize: '12px', margin: '2px 0', color: '#555' }}>Docente de odontología</p>
                <p style={{ fontSize: '12px', margin: '2px 0', color: '#555' }}>Asesora temática</p>
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

const ModalEditarPaciente = ({ paciente, onClose, onGuardar }) => {
  const [nombre, setNombre] = useState(paciente.nombre || '')
  const [apellidos, setApellidos] = useState(paciente.apellidos || '')
  const [cedula, setCedula] = useState(paciente.cedula || '')
  const [guardando, setGuardando] = useState(false)

  const guardar = async () => {
    if (!nombre.trim() || !apellidos.trim() || !cedula.trim()) {
      alert('Complete nombre, apellidos y cédula.')
      return
    }
    setGuardando(true)
    await onGuardar({ nombre: nombre.trim(), apellidos: apellidos.trim(), cedula: cedula.trim() })
    setGuardando(false)
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1001, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: '#16171f', border: '1px solid #2d2d2d', borderRadius: '12px', padding: '28px', width: '100%', maxWidth: '440px' }}>
        <h4 style={{ color: '#fff', fontSize: '16px', margin: '0 0 6px 0' }}>Editar datos del paciente</h4>
        <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 20px 0' }}>Los cambios se aplicarán en todos sus registros (historia, encuestas, exploración y consentimientos).</p>

        <div style={{ marginBottom: '14px' }}>
          <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '5px' }}>Nombres:</label>
          <input value={nombre} onChange={e => setNombre(e.target.value)} style={{ width: '100%', padding: '11px 12px', backgroundColor: '#0c0c0f', border: '1px solid #2d2d2d', borderRadius: '8px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '14px' }}>
          <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '5px' }}>Apellidos:</label>
          <input value={apellidos} onChange={e => setApellidos(e.target.value)} style={{ width: '100%', padding: '11px 12px', backgroundColor: '#0c0c0f', border: '1px solid #2d2d2d', borderRadius: '8px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ color: '#9ca3af', fontSize: '13px', display: 'block', marginBottom: '5px' }}>Cédula:</label>
          <input value={cedula} onChange={e => setCedula(e.target.value)} style={{ width: '100%', padding: '11px 12px', backgroundColor: '#0c0c0f', border: '1px solid #2d2d2d', borderRadius: '8px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }} />
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ flex: 1, padding: '12px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', opacity: guardando ? 0.6 : 1 }} disabled={guardando} onClick={guardar}>{guardando ? 'Guardando...' : 'Guardar cambios'}</button>
          <button style={{ flex: 1, padding: '12px', backgroundColor: '#2d2d2d', color: '#ccc', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }} onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  )
}

export default function ConsentimientosList({
  pacientes,
  consentimientos,
  ordenarPorIdParticipante,
  eliminarConsentimiento,
  eliminarConsentimientos,
  editarPaciente,
  filtrar,
  busqueda,
  s
}) {
  const [consentimientoVer, setConsentimientoVer] = useState(null)
  const [pacienteEditar, setPacienteEditar] = useState(null)

  // Solo mostrar pacientes que tengan al menos un consentimiento
  const pacientesConConsentimiento = pacientes.filter(p =>
    consentimientos.some(c => c.cedula == p.cedula)
  )
  const pacientesFiltrados = filtrar(ordenarPorIdParticipante(pacientesConConsentimiento), busqueda)

  return (
    <>
      {!consentimientoVer && !pacienteEditar && (
        <div style={s.card}>
          <div className="tabla-wrap-siempre">
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>N°</th>
                  <th style={s.th}>Nombre</th>
                  <th style={s.th}>Cédula</th>
                  <th style={s.th}>C1</th>
                  <th style={s.th}>C2</th>
                  <th style={s.th}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {pacientesFiltrados.map((p, i) => {
                  const c1 = consentimientos.find(c => c.cedula == p.cedula && c.tipo === 1)
                  const c2 = consentimientos.find(c => c.cedula == p.cedula && c.tipo === 2)
                  const tieneAlguno = !!(c1 || c2)
                  const tiposEliminar = [c1 ? 'C1' : null, c2 ? 'C2' : null].filter(Boolean).join(' y ')
                  return (
                    <tr key={p.id}>
                      <td style={s.td}>{i + 1}</td>
                      <td style={s.td}>{p.nombre} {p.apellidos}</td>
                      <td style={s.td}>{p.cedula}</td>
                      <td style={s.td}><span style={s.badge(c1 ? 'green' : 'red')}>{c1 ? '✓ Firmado' : '✗ Pendiente'}</span></td>
                      <td style={s.td}><span style={s.badge(c2 ? 'green' : 'red')}>{c2 ? '✓ Firmado' : '✗ Pendiente'}</span></td>
                      <td style={s.td}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'nowrap', alignItems: 'center' }}>
                          <button style={s.btnBlue} onClick={() => setPacienteEditar(p)}>Editar</button>
                          {c1 && <button style={s.btnBlue} onClick={() => setConsentimientoVer({ c: c1, pac: p })}>Ver C1</button>}
                          {c2 && <button style={s.btnBlue} onClick={() => setConsentimientoVer({ c: c2, pac: p })}>Ver C2</button>}
                          {tieneAlguno && (
                            <button style={s.btnRed} onClick={() => eliminarConsentimientos(p.cedula, p.nombre + ' ' + p.apellidos, tiposEliminar)}>Eliminar</button>
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
      {consentimientoVer && (
        <VerConsentimiento
          c={consentimientoVer.c}
          pac={consentimientoVer.pac}
          onClose={() => setConsentimientoVer(null)}
        />
      )}
      {pacienteEditar && (
        <ModalEditarPaciente
          paciente={pacienteEditar}
          onClose={() => setPacienteEditar(null)}
          onGuardar={async (datos) => {
            await editarPaciente(pacienteEditar, datos)
            setPacienteEditar(null)
          }}
        />
      )}
    </>
  )
}
