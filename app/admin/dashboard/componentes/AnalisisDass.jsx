import React, { useState } from 'react'

export default function AnalisisDass({
  analisis,
  respuestas,
  preguntas,
  obtenerIdParticipante,
  ordenarPorIdParticipante,
  getNombre,
  eliminarEncuesta,
  colorBadge,
  filtrar,
  busqueda,
  s
}) {
  const [respuestaDetalle, setRespuestaDetalle] = useState(null)

  const analisisFiltrados = filtrar(ordenarPorIdParticipante(analisis), busqueda)

  return (
    <>
      {!respuestaDetalle ? (
        <div style={s.card}>
          <div className="tabla-wrap-siempre">
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>ID</th>
                  <th style={s.th}>Nombre</th>
                  <th style={s.th}>Cédula</th>
                  <th style={s.th}>Depresión</th>
                  <th style={s.th}>Ansiedad</th>
                  <th style={s.th}>Estrés</th>
                  <th style={s.th}>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {analisisFiltrados.map(a => (
                  <tr key={a.id}>
                    <td style={s.td}>{obtenerIdParticipante(a.cedula)}</td>
                    <td style={s.td}>{getNombre(a.cedula)}</td>
                    <td style={s.td}>{a.cedula}</td>
                    <td style={s.td}>
                      <span style={s.badge(colorBadge(a.interpretacion_depresion))}>
                        {a.interpretacion_depresion}
                      </span>
                    </td>
                    <td style={s.td}>
                      <span style={s.badge(colorBadge(a.interpretacion_ansiedad))}>
                        {a.interpretacion_ansiedad}
                      </span>
                    </td>
                    <td style={s.td}>
                      <span style={s.badge(colorBadge(a.interpretacion_estres))}>
                        {a.interpretacion_estres}
                      </span>
                    </td>
                    <td style={s.td}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          style={s.btnBlue}
                          onClick={() => setRespuestaDetalle(respuestas.find(r => r.cedula == a.cedula))}
                        >
                          Ver detalle
                        </button>
                        <button
                          style={s.btnRed}
                          onClick={() => eliminarEncuesta(a.id, a.cedula, getNombre(a.cedula))}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {analisis.length === 0 && (
            <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>
              No hay encuestas completadas
            </p>
          )}
        </div>
      ) : (
        <div style={s.card}>
          <button style={{ ...s.btn, marginBottom: '15px' }} onClick={() => setRespuestaDetalle(null)}>
            ← Volver a la lista
          </button>
          <h3 style={{ color: '#fff', marginBottom: '15px' }}>
            Respuestas de {getNombre(respuestaDetalle.cedula)}
          </h3>
          <div className="tabla-wrap-siempre">
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>Nº</th>
                  <th style={s.th}>Pregunta</th>
                  <th style={s.th}>Puntaje</th>
                </tr>
              </thead>
              <tbody>
                {preguntas.map((p, i) => (
                  <tr key={i}>
                    <td style={s.td}>{i + 1}</td>
                    <td style={s.td}>{p}</td>
                    <td style={s.td}>
                      <span
                        style={s.badge(
                          respuestaDetalle[`p${i + 1}`] >= 2
                            ? 'red'
                            : respuestaDetalle[`p${i + 1}`] === 1
                            ? 'yellow'
                            : 'green'
                        )}
                      >
                        {respuestaDetalle[`p${i + 1}`]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}
