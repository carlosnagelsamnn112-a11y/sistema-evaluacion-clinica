import React from 'react'

export default function FlujoPacienteForm({
  flujoState,
  setVista,
  epsBD,
  preguntas,
  cargarDatos,
  s
}) {
  const {
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
  } = flujoState

  // Handlers locales
  const handleValidarCedula = (tipo) => {
    validarCedulaFlujo(tipo)
  }

  const handleGuardarHistoria = () => {
    guardarHistoria(cargarDatos)
  }

  const handleGuardarEncuesta = () => {
    guardarEncuesta(preguntas, cargarDatos)
  }

  const handleGuardarExploracion = () => {
    guardarExploracion(cargarDatos)
  }

  const handleEpsChange = (value) => {
    setEpsInput(value)
    setEpsFiltered(
      epsBD.map(x => x.nombre).filter(ep => ep.toLowerCase().includes(value.toLowerCase()))
    )
    setShowEps(true)
  }

  const handleEpsFocus = () => {
    setEpsFiltered(epsBD.map(x => x.nombre))
    setShowEps(true)
  }

  return (
    <div>
      <button style={{ ...s.btn, marginBottom: '20px' }} onClick={() => setVista('inicio')}>
        ← Volver
      </button>

      {/* MENÚ DE SELECCIÓN DE ACCIONES */}
      {flujoVista === 'menu' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px', margin: '0 auto' }}>
          <h3 style={{ color: '#fff', textAlign: 'center', marginBottom: '10px' }}>Seleccione una acción</h3>
          {[
            { key: 'cedulaHistoria', label: '📋 Historia Clínica' },
            { key: 'cedulaEncuesta', label: '📝 Encuesta DASS-21' },
            { key: 'cedulaExploracion', label: '🔍 Exploración Clínica' },
          ].map(op => (
            <button
              key={op.key}
              style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '10px', padding: '15px', color: '#fff', cursor: 'pointer', fontSize: '15px' }}
              onClick={() => {
                setFlujoCedula('')
                setFlujoError('')
                setFlujoVista(op.key)
              }}
            >
              {op.label}
            </button>
          ))}
        </div>
      )}

      {/* CÉDULA HISTORIA */}
      {flujoVista === 'cedulaHistoria' && (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <h3 style={{ color: '#fff', marginBottom: '15px' }}>Historia Clínica — Verificar paciente</h3>
          <input
            style={{ ...s.input, width: '100%', marginBottom: '10px' }}
            type="number"
            value={flujoCedula}
            onChange={e => setFlujoCedula(e.target.value)}
            placeholder="Número de cédula"
            onKeyDown={e => e.key === 'Enter' && handleValidarCedula('historia')}
          />
          {flujoError && (
            <div style={{ color: '#ff6666', padding: '10px', backgroundColor: '#220000', borderRadius: '6px', marginBottom: '10px' }}>
              {flujoError}
            </div>
          )}
          <button
            style={{ ...s.btnGreen, width: '100%', marginBottom: '8px' }}
            onClick={() => handleValidarCedula('historia')}
            disabled={flujoLoading}
          >
            {flujoLoading ? 'Verificando...' : 'Continuar'}
          </button>
          <button style={{ ...s.btn, width: '100%' }} onClick={() => setFlujoVista('menu')}>
            ← Volver
          </button>
        </div>
      )}

      {/* HISTORIA CLÍNICA */}
      {flujoVista === 'historia' && (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ ...s.card, textAlign: 'center', marginBottom: '20px' }}>
            <p style={{ color: '#fff', fontSize: '16px' }}>
              Paciente: <strong>{flujoPaciente?.nombre} {flujoPaciente?.apellidos}</strong>
            </p>
            <p style={{ color: '#888' }}>Cédula: {flujoPaciente?.cedula}</p>
          </div>

          {[
            { label: 'Fecha de nacimiento', field: 'fechaNacimiento', type: 'date' },
            { label: 'Teléfono de contacto', field: 'contacto', type: 'number' },
          ].map(f => (
            <div key={f.field} style={{ marginBottom: '12px' }}>
              <label style={{ color: '#ccc', fontSize: '14px', display: 'block', marginBottom: '4px' }}>{f.label}:</label>
              <input
                style={{ ...s.input, width: '100%' }}
                type={f.type}
                value={historia[f.field]}
                onChange={e => setHistoria({ ...historia, [f.field]: e.target.value })}
              />
            </div>
          ))}

          <div style={{ marginBottom: '12px' }}>
            <label style={{ color: '#ccc', fontSize: '14px', display: 'block', marginBottom: '4px' }}>EPS:</label>
            <input
              style={{ ...s.input, width: '100%' }}
              value={epsInput}
              onChange={e => handleEpsChange(e.target.value)}
              onFocus={handleEpsFocus}
              onBlur={() => setTimeout(() => setShowEps(false), 200)}
              placeholder="Buscar EPS..."
            />
            {showEps && epsFiltered.length > 0 && (
              <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #444', borderRadius: '6px', maxHeight: '180px', overflowY: 'auto' }}>
                {epsFiltered.map(ep => (
                  <div
                    key={ep}
                    style={{ padding: '10px', cursor: 'pointer', color: '#fff', borderBottom: '1px solid #333' }}
                    onMouseDown={() => {
                      setEpsInput(ep)
                      setShowEps(false)
                    }}
                  >
                    {ep}
                  </div>
                ))}
              </div>
            )}
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
              <select
                style={{ ...s.select, width: '100%' }}
                value={historia[f.field]}
                onChange={e => setHistoria({ ...historia, [f.field]: e.target.value })}
              >
                <option value="">-- Seleccione --</option>
                {f.opts.map(o => <option key={o}>{o}</option>)}
              </select>
              {historia[f.field] === 'Sí' && f.field === 'enfermedadesSistemicas' && (
                <input
                  style={{ ...s.input, width: '100%', marginTop: '6px' }}
                  placeholder="Especifique la enfermedad"
                  value={historia.tipoEnfermedad}
                  onChange={e => setHistoria({ ...historia, tipoEnfermedad: e.target.value })}
                />
              )}
              {historia[f.field] === 'Sí' && f.field === 'tomaMedicamentos' && (
                <input
                  style={{ ...s.input, width: '100%', marginTop: '6px' }}
                  placeholder="Especifique el medicamento"
                  value={historia.tipoMedicamento}
                  onChange={e => setHistoria({ ...historia, tipoMedicamento: e.target.value })}
                />
              )}
              {historia[f.field] === 'Sí' && f.field === 'antecedentesPsicologicos' && (
                <input
                  style={{ ...s.input, width: '100%', marginTop: '6px' }}
                  placeholder="Especifique la enfermedad psicológica"
                  value={historia.tipoEnfermedadPsicologica}
                  onChange={e => setHistoria({ ...historia, tipoEnfermedadPsicologica: e.target.value })}
                />
              )}
              {historia[f.field] === 'Sí' && f.field === 'sustanciasPsicoactivas' && (
                <input
                  style={{ ...s.input, width: '100%', marginTop: '6px' }}
                  placeholder="Especifique la sustancia"
                  value={historia.tipoSustancia}
                  onChange={e => setHistoria({ ...historia, tipoSustancia: e.target.value })}
                />
              )}
            </div>
          ))}

          <div style={{ marginBottom: '12px' }}>
            <label style={{ color: '#ccc', fontSize: '14px', display: 'block', marginBottom: '4px' }}>Semestre actual:</label>
            <input
              style={{ ...s.input, width: '100%' }}
              type="number"
              min="1"
              max="9"
              value={historia.semestre}
              onChange={e => setHistoria({ ...historia, semestre: e.target.value })}
              placeholder="1 a 9"
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ color: '#ccc', fontSize: '14px', display: 'block', marginBottom: '4px' }}>Hábitos orales:</label>
            <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '12px' }}>
              {[
                ['habitoNo', 'No'],
                ['habitoLabios', 'Mordedura de labios'],
                ['habitoMejillas', 'Mordedura de mejillas'],
                ['habitoLengua', 'Mordedura de lengua']
              ].map(([key, label]) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '6px 0', cursor: 'pointer', color: '#ccc' }}>
                  <input
                    type="checkbox"
                    checked={historia[key]}
                    onChange={e => {
                      if (key === 'habitoNo' && e.target.checked) {
                        setHistoria({ ...historia, habitoNo: true, habitoLabios: false, habitoMejillas: false, habitoLengua: false })
                      } else {
                        setHistoria({ ...historia, [key]: e.target.checked, habitoNo: false })
                      }
                    }}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ color: '#ccc', fontSize: '14px', display: 'block', marginBottom: '4px' }}>¿Fuma cigarrillo o vape?</label>
            <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '12px' }}>
              {['Cigarrillo', 'Vape', 'Las dos', 'Ninguna'].map(op => (
                <label key={op} style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '6px 0', cursor: 'pointer', color: '#ccc' }}>
                  <input
                    type="radio"
                    name="fuma"
                    value={op}
                    checked={historia.fumaCigarrilloVape === op}
                    onChange={e => setHistoria({ ...historia, fumaCigarrilloVape: e.target.value })}
                  />
                  {op}
                </label>
              ))}
            </div>
          </div>

          {flujoError && (
            <div style={{ color: '#ff6666', padding: '10px', backgroundColor: '#220000', borderRadius: '6px', marginBottom: '10px' }}>
              {flujoError}
            </div>
          )}
          <button
            style={{ ...s.btnGreen, width: '100%', marginBottom: '8px' }}
            onClick={handleGuardarHistoria}
            disabled={flujoLoading}
          >
            {flujoLoading ? 'Guardando...' : 'Guardar historia clínica'}
          </button>
          <button style={{ ...s.btn, width: '100%' }} onClick={() => setFlujoVista('menu')}>
            ← Volver
          </button>
        </div>
      )}

      {/* CÉDULA ENCUESTA */}
      {flujoVista === 'cedulaEncuesta' && (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <h3 style={{ color: '#fff', marginBottom: '15px' }}>Encuesta DASS-21 — Verificar paciente</h3>
          <input
            style={{ ...s.input, width: '100%', marginBottom: '10px' }}
            type="number"
            value={flujoCedula}
            onChange={e => setFlujoCedula(e.target.value)}
            placeholder="Número de cédula"
            onKeyDown={e => e.key === 'Enter' && handleValidarCedula('encuesta')}
          />
          {flujoError && (
            <div style={{ color: '#ff6666', padding: '10px', backgroundColor: '#220000', borderRadius: '6px', marginBottom: '10px' }}>
              {flujoError}
            </div>
          )}
          <button
            style={{ ...s.btnGreen, width: '100%', marginBottom: '8px' }}
            onClick={() => handleValidarCedula('encuesta')}
            disabled={flujoLoading}
          >
            {flujoLoading ? 'Verificando...' : 'Continuar'}
          </button>
          <button style={{ ...s.btn, width: '100%' }} onClick={() => setFlujoVista('menu')}>
            ← Volver
          </button>
        </div>
      )}

      {/* ENCUESTA DASS-21 */}
      {flujoVista === 'encuesta' && (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ ...s.card, textAlign: 'center', marginBottom: '20px' }}>
            <p style={{ color: '#fff', fontSize: '16px' }}>
              Paciente: <strong>{flujoPaciente?.nombre} {flujoPaciente?.apellidos}</strong>
            </p>
          </div>
          <p style={{ color: '#999', marginBottom: '15px', fontSize: '14px' }}>
            Seleccione una opción para cada pregunta (0 = No me ocurrió, 3 = Me ocurrió mucho)
          </p>

          {preguntas.map((p, i) => (
            <div key={i} style={{ ...s.card, marginBottom: '10px' }}>
              <strong style={{ color: '#fff', display: 'block', marginBottom: '10px', fontSize: '14px' }}>
                {i + 1}. {p}
              </strong>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[0, 1, 2, 3].map(v => (
                  <label
                    key={v}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      backgroundColor: respuestasDass[i] === v ? '#2a5a2a' : '#222',
                      padding: '8px 16px',
                      border: `1px solid ${respuestasDass[i] === v ? '#3a7a3a' : '#444'}`,
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#ccc'
                    }}
                  >
                    <input
                      type="radio"
                      name={`p${i}`}
                      value={v}
                      checked={respuestasDass[i] === v}
                      onChange={() => setRespuestasDass({ ...respuestasDass, [i]: v })}
                      style={{ display: 'none' }}
                    />
                    {v}
                  </label>
                ))}
              </div>
            </div>
          ))}

          {flujoError && (
            <div style={{ color: '#ff6666', padding: '10px', backgroundColor: '#220000', borderRadius: '6px', marginBottom: '10px' }}>
              {flujoError}
            </div>
          )}
          <button
            style={{ ...s.btnGreen, width: '100%', marginBottom: '8px' }}
            onClick={handleGuardarEncuesta}
            disabled={flujoLoading}
          >
            {flujoLoading ? 'Guardando...' : 'Guardar encuesta'}
          </button>
          <button style={{ ...s.btn, width: '100%' }} onClick={() => setFlujoVista('menu')}>
            ← Volver
          </button>
        </div>
      )}

      {/* CÉDULA EXPLORACIÓN */}
      {flujoVista === 'cedulaExploracion' && (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
          <h3 style={{ color: '#fff', marginBottom: '15px' }}>Exploración Clínica — Verificar paciente</h3>
          <input
            style={{ ...s.input, width: '100%', marginBottom: '10px' }}
            type="number"
            value={flujoCedula}
            onChange={e => setFlujoCedula(e.target.value)}
            placeholder="Número de cédula"
            onKeyDown={e => e.key === 'Enter' && handleValidarCedula('exploracion')}
          />
          {flujoError && (
            <div style={{ color: '#ff6666', padding: '10px', backgroundColor: '#220000', borderRadius: '6px', marginBottom: '10px' }}>
              {flujoError}
            </div>
          )}
          <button
            style={{ ...s.btnGreen, width: '100%', marginBottom: '8px' }}
            onClick={() => handleValidarCedula('exploracion')}
            disabled={flujoLoading}
          >
            {flujoLoading ? 'Verificando...' : 'Continuar'}
          </button>
          <button style={{ ...s.btn, width: '100%' }} onClick={() => setFlujoVista('menu')}>
            ← Volver
          </button>
        </div>
      )}

      {/* EXPLORACIÓN CLÍNICA */}
      {flujoVista === 'exploracion' && (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div style={{ ...s.card, textAlign: 'center', marginBottom: '20px' }}>
            <p style={{ color: '#fff', fontSize: '16px' }}>
              Paciente: <strong>{flujoPaciente?.nombre} {flujoPaciente?.apellidos}</strong>
            </p>
            <p style={{ color: '#888' }}>Cédula: {flujoPaciente?.cedula}</p>
          </div>

          <div style={s.card}>
            <h4 style={{ color: '#fff', marginBottom: '15px' }}>Identificación de lesiones</h4>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#ccc', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                ¿Presenta lesiones orales? *
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {['Sí', 'No'].map(v => (
                  <label
                    key={v}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: exploracion.presentaLesiones === v ? '#2a5a2a' : '#222',
                      padding: '8px 20px',
                      border: `1px solid ${exploracion.presentaLesiones === v ? '#3a7a3a' : '#444'}`,
                      borderRadius: '20px',
                      cursor: 'pointer',
                      color: '#ccc'
                    }}
                  >
                    <input
                      type="radio"
                      name="presentaLesiones"
                      value={v}
                      checked={exploracion.presentaLesiones === v}
                      onChange={e => setExploracion({ ...exploracion, presentaLesiones: e.target.value })}
                      style={{ display: 'none' }}
                    />
                    {v}
                  </label>
                ))}
              </div>
            </div>

            {exploracion.presentaLesiones === 'Sí' && (
              <>
                <h4 style={{ color: '#fff', margin: '20px 0 15px' }}>
                  Localización de la lesión (Zonas anatómicas afectadas - Mínimo una opción) *
                </h4>
                {[
                  { key: 'mordeduraLabios', label: 'Labios' },
                  { key: 'mordeduraMejillas', label: 'Mejillas' },
                  { key: 'mordeduraLengua', label: 'Lengua' },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <label style={{ color: '#ccc', fontSize: '14px' }}>{f.label}</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {['Sí', 'No'].map(v => (
                        <label
                          key={v}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            backgroundColor: exploracion[f.key] === v ? '#2a5a2a' : '#222',
                            padding: '6px 14px',
                            border: `1px solid ${exploracion[f.key] === v ? '#3a7a3a' : '#444'}`,
                            borderRadius: '20px',
                            cursor: 'pointer',
                            color: '#ccc',
                            fontSize: '13px'
                          }}
                        >
                          <input
                            type="radio"
                            name={f.key}
                            value={v}
                            checked={exploracion[f.key] === v}
                            onChange={e => setExploracion({ ...exploracion, [f.key]: e.target.value })}
                            style={{ display: 'none' }}
                          />
                          {v}
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
                        <label
                          key={v}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            backgroundColor: exploracion[f.key] === v ? '#2a5a2a' : '#222',
                            padding: '6px 14px',
                            border: `1px solid ${exploracion[f.key] === v ? '#3a7a3a' : '#444'}`,
                            borderRadius: '20px',
                            cursor: 'pointer',
                            color: '#ccc',
                            fontSize: '13px'
                          }}
                        >
                          <input
                            type="radio"
                            name={f.key}
                            value={v}
                            checked={exploracion[f.key] === v}
                            onChange={e => setExploracion({ ...exploracion, [f.key]: e.target.value })}
                            style={{ display: 'none' }}
                          />
                          {v}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <h4 style={{ color: '#fff', margin: '20px 0 10px' }}>
                  Descripción de la lesión {exploracion.presentaLesiones === 'Sí' ? '*' : ''}
                </h4>
                <textarea
                  style={s.textarea}
                  placeholder="Describa clínicamente la lesión observada..."
                  value={exploracion.descripcionLesion}
                  onChange={e => setExploracion({ ...exploracion, descripcionLesion: e.target.value })}
                />

                <h4 style={{ color: '#fff', margin: '20px 0 10px' }}>
                  Fotos de evidencia {exploracion.presentaLesiones === 'Sí' ? '(obligatorio, mínimo 1, máximo 2)' : ''}
                </h4>
                {fotoError && (
                  <div style={{ color: '#ff6666', padding: '10px', backgroundColor: '#220000', borderRadius: '6px', marginBottom: '10px', fontSize: '13px' }}>
                    {fotoError}
                  </div>
                )}
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
                              <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                style={{ display: 'none' }}
                                onChange={e => subirFotoFormulario(e.target.files[0], slot)}
                                disabled={subiendoFoto}
                              />
                            </label>
                            <label style={{ ...s.btnBlue, display: 'block', cursor: 'pointer', textAlign: 'center' }}>
                              {subiendoFoto ? 'Subiendo...' : '🖼️ Elegir archivo'}
                              <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={e => subirFotoFormulario(e.target.files[0], slot)}
                                disabled={subiendoFoto}
                              />
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

          {flujoError && (
            <div style={{ color: '#ff6666', padding: '10px', backgroundColor: '#220000', borderRadius: '6px', marginBottom: '10px' }}>
              {flujoError}
            </div>
          )}
          <button
            style={{ ...s.btnGreen, width: '100%', marginBottom: '8px' }}
            onClick={handleGuardarExploracion}
            disabled={flujoLoading}
          >
            {flujoLoading ? 'Guardando...' : 'Guardar exploración clínica'}
          </button>
          <button style={{ ...s.btn, width: '100%' }} onClick={() => setFlujoVista('menu')}>
            ← Volver
          </button>
        </div>
      )}

      {/* PANTALLA DE ÉXITO */}
      {flujoVista === 'exito' && (
        <div style={{ ...s.card, textAlign: 'center', maxWidth: '400px', margin: '40px auto' }}>
          <h3 style={{ color: '#00ff00', marginBottom: '10px' }}>✓ Guardado correctamente</h3>
          <p style={{ color: '#888', marginBottom: '20px' }}>Los datos han sido almacenados en el sistema.</p>
          <button
            style={{ ...s.btnGreen, width: '100%', marginBottom: '8px' }}
            onClick={() => {
              setFlujoVista('menu')
              setFlujoCedula('')
              setFlujoPaciente(null)
              resetFlujoForms()
            }}
          >
            Registrar otro paciente
          </button>
          <button style={{ ...s.btn, width: '100%' }} onClick={() => setVista('inicio')}>
            ← Volver al inicio
          </button>
        </div>
      )}
    </div>
  )
}
