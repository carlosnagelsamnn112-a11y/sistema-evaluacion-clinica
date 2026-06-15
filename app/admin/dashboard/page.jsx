const VerConsentimiento = ({ c, pac, onClose }) => {
  const contenidos = {
    1: {
      titulo: 'CONSENTIMIENTO INFORMADO PARA LA PARTICIPACIÓN EN UN ESTUDIO DE INVESTIGACIÓN',
      subtitulo: 'TRABAJO DE GRADO',
      intro: `En el marco del desarrollo del presente proyecto de investigación, se le invita a participar de manera voluntaria en este estudio, cuyo propósito es analizar la relación entre los factores emocionales (estrés, ansiedad y depresión) y los hábitos parafuncionales orales en estudiantes de odontología de la Universidad Antonio Nariño, sede Neiva, durante el periodo académico 2026-1 y 2026-2.`,
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
      subtitulo: 'TRABAJO DE GRADO',
      intro: `En el marco del desarrollo del presente proyecto de investigación, se solicita su autorización para la toma de registros fotográficos intraorales, los cuales serán utilizados exclusivamente con fines académicos y científicos. Estas imágenes permitirán apoyar el análisis clínico y la comprensión de los hábitos parafuncionales en los participantes del estudio.`,
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
  const td = { padding: '8px 12px', border: '1px solid #ccc', fontSize: '12px', textAlign: 'center' }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.92)', zIndex: 1000, overflowY: 'auto', padding: '20px' }}>
      <div style={{ maxWidth: '820px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '8px', padding: '50px 50px 30px 50px', color: '#000', fontFamily: 'Arial, sans-serif' }}>

        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ display: 'inline-block', backgroundColor: '#1a2e5a', color: '#fff', padding: '12px 24px', borderRadius: '4px', fontWeight: '900', fontSize: '22px', letterSpacing: '3px', marginBottom: '4px' }}>UAN</div>
          <p style={{ fontSize: '10px', color: '#333', letterSpacing: '2px', margin: '4px 0 0 0' }}>UNIVERSIDAD ANTONIO NARIÑO</p>
        </div>

        {/* TÍTULO */}
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <p style={{ fontWeight: '700', fontSize: '13px', margin: '0 0 4px 0' }}>{t.titulo}</p>
          <p style={{ fontWeight: '700', fontSize: '13px', margin: 0 }}>{t.subtitulo}</p>
        </div>

        {/* DATOS DEL PROYECTO */}
        <p style={{ fontSize: '13px', marginBottom: '6px' }}><strong>Título del proyecto:</strong> Relación entre factores emocionales y hábitos parafuncionales en estudiantes de odontología de la Universidad Antonio Nariño, Sede Neiva.</p>
        <p style={{ fontSize: '13px', marginBottom: '20px' }}><strong>Ciudad:</strong> Neiva – Huila</p>

        {/* INTRO */}
        <p style={{ fontSize: '13px', marginBottom: '15px', textAlign: 'justify' }}>{t.intro}</p>

        {/* PÁRRAFO YO */}
        <p style={{ fontSize: '13px', marginBottom: '20px', textAlign: 'justify' }}>
          Yo, <strong>{pac?.nombre} {pac?.apellidos}</strong>, identificado(a) con el número de cédula <strong>{c.cedula}</strong>, actuando en nombre propio, manifiesto que he sido informado(a) de manera clara, suficiente y comprensible, y mis preguntas han sido contestadas de manera satisfactoria por el investigador. Autorizo de forma libre, previa y voluntaria la toma y uso de registros fotográficos intraorales dentro del proyecto de investigación mencionado, desarrollado por los estudiantes investigadores Diana Carolina Cortés, Luisa María Sandoval y Christopher Vargas, bajo la asesoría científica de la Dra. Alejandra Bobadilla Henao.
        </p>

        {/* NUMERALES */}
        {t.cuerpo.map((item, i) => (
          <div key={i} style={{ marginBottom: '15px' }}>
            <p style={{ fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>{item.titulo}</p>
            <p style={{ fontSize: '13px', textAlign: 'justify', whiteSpace: 'pre-line', margin: 0 }}>{item.texto}</p>
          </div>
        ))}

        {/* CIERRE */}
        <p style={{ fontSize: '13px', margin: '25px 0 30px 0' }}>En constancia de lo anterior, se firma el presente consentimiento informado.</p>

        {/* FIRMA PACIENTE */}
        <div style={{ marginBottom: '30px' }}>
          {c.pdf_url && c.pdf_url.startsWith('data:image') && (
            <img src={c.pdf_url} alt="firma paciente" style={{ height: '80px', display: 'block', marginBottom: '8px' }} />
          )}
          <div style={{ borderTop: '1px solid #000', paddingTop: '8px', maxWidth: '300px' }}>
            <p style={{ fontSize: '13px', margin: '3px 0' }}><strong>Nombre:</strong> {pac?.nombre} {pac?.apellidos}</p>
            <p style={{ fontSize: '13px', margin: '3px 0' }}><strong>Cédula de ciudadanía:</strong> {c.cedula}</p>
            <p style={{ fontSize: '13px', margin: '3px 0' }}><strong>Fecha:</strong> {c.fecha_firma}</p>
          </div>
        </div>

        {/* FIRMAS INVESTIGADORES */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
          <tbody>
            <tr>
              <td style={{ width: '50%', padding: '10px', verticalAlign: 'bottom' }}>
                <div style={{ borderTop: '1px solid #000', paddingTop: '8px' }}>
                  <p style={{ fontSize: '12px', margin: '2px 0' }}>1101682283</p>
                  <p style={{ fontSize: '12px', margin: '2px 0' }}>Diana Carolina Cortés (20572211983)</p>
                  <p style={{ fontSize: '12px', margin: '2px 0', color: '#555' }}>Estudiante de odontología</p>
                </div>
              </td>
              <td style={{ width: '50%', padding: '10px', verticalAlign: 'bottom' }}>
                <div style={{ borderTop: '1px solid #000', paddingTop: '8px' }}>
                  <p style={{ fontSize: '12px', margin: '2px 0' }}>1013104626</p>
                  <p style={{ fontSize: '12px', margin: '2px 0' }}>Luisa María Sandoval (20572212013)</p>
                  <p style={{ fontSize: '12px', margin: '2px 0', color: '#555' }}>Estudiante de odontología</p>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ width: '50%', padding: '30px 10px 10px 10px', verticalAlign: 'bottom' }}>
                <div style={{ borderTop: '1px solid #000', paddingTop: '8px' }}>
                  <p style={{ fontSize: '12px', margin: '2px 0' }}>1003894702</p>
                  <p style={{ fontSize: '12px', margin: '2px 0' }}>Christopher Vargas (20572211040)</p>
                  <p style={{ fontSize: '12px', margin: '2px 0', color: '#555' }}>Estudiante de odontología</p>
                </div>
              </td>
              <td style={{ width: '50%', padding: '30px 10px 10px 10px', verticalAlign: 'bottom' }}>
                <div style={{ borderTop: '1px solid #000', paddingTop: '8px' }}>
                  <p style={{ fontSize: '12px', margin: '2px 0' }}>123456789</p>
                  <p style={{ fontSize: '12px', margin: '2px 0' }}>Alejandra Bobadilla Henao</p>
                  <p style={{ fontSize: '12px', margin: '2px 0', color: '#555' }}>Docente de odontología</p>
                  <p style={{ fontSize: '12px', margin: '2px 0', color: '#555' }}>Asesora científica</p>
                </div>
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