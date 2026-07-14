import React, { useState } from 'react'

const VerFotos = ({ foto1, foto2, nombre, onClose, s }) => (
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

export default function ExploracionClinicaList({
  exploraciones,
  obtenerIdParticipante,
  ordenarPorIdParticipante,
  getNombre,
  eliminarExploracion,
  filtrar,
  busqueda,
  s
}) {
  const [descripcionVer, setDescripcionVer] = useState(null)
  const [fotosVer, setFotosVer] = useState(null)

  const exploracionesFiltradas = filtrar(ordenarPorIdParticipante(exploraciones), busqueda)

  return (
    <>
      <div style={s.card}>
        <div className="tabla-wrap-siempre">
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>ID</th>
                <th style={s.th}>Nombre</th>
                <th style={s.th}>Cédula</th>
                <th style={s.th}>Lesiones</th>
                <th style={s.th}>Labios</th>
                <th style={s.th}>Mejillas</th>
                <th style={s.th}>Lengua</th>
                <th style={s.th}>Úlcera</th>
                <th style={s.th}>Queratosis</th>
                <th style={s.th}>Fibroma</th>
                <th style={s.th}>M. Buccarum</th>
                <th style={s.th}>M. Labiarum</th>
                <th style={s.th}>M. Linguarum</th>
                <th style={s.th}>Descripción</th>
                <th style={s.th}>Fotos</th>
                <th style={s.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {exploracionesFiltradas.map(e => (
                <tr key={e.id}>
                  <td style={s.td}>{obtenerIdParticipante(e.cedula)}</td>
                  <td style={s.td}>{getNombre(e.cedula)}</td>
                  <td style={s.td}>{e.cedula}</td>
                  <td style={s.td}>
                    <span
                      style={s.badge(
                        e.presenta_lesiones === 'Sí'
                          ? 'red'
                          : e.presenta_lesiones === 'No'
                          ? 'green'
                          : 'gray'
                      )}
                    >
                      {e.presenta_lesiones || '—'}
                    </span>
                  </td>
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
                      <button
                        style={s.btnBlue}
                        onClick={() =>
                          setDescripcionVer({
                            nombre: getNombre(e.cedula),
                            texto: e.descripcion_lesion
                          })
                        }
                      >
                        Ver texto
                      </button>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td style={s.td}>
                    {e.foto1_url || e.foto2_url ? (
                      <button
                        style={s.btnBlue}
                        onClick={() =>
                          setFotosVer({
                            nombre: getNombre(e.cedula),
                            foto1_url: e.foto1_url,
                            foto2_url: e.foto2_url
                          })
                        }
                      >
                        📷 Ver fotos
                      </button>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td style={s.td}>
                    {e.presenta_lesiones !== null ? (
                      <button
                        style={s.btnRed}
                        onClick={() => eliminarExploracion(e.id, e.cedula, getNombre(e.cedula))}
                      >
                        Eliminar
                      </button>
                    ) : (
                      '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {exploraciones.length === 0 && (
          <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>
            No hay exploraciones registradas
          </p>
        )}
      </div>

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
        <VerFotos
          foto1={fotosVer.foto1_url}
          foto2={fotosVer.foto2_url}
          nombre={fotosVer.nombre}
          onClose={() => setFotosVer(null)}
          s={s}
        />
      )}
    </>
  )
}
export { VerFotos }
