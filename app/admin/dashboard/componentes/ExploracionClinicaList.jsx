import React, { useState, useRef } from 'react'
import { uploadFotoExploracion, deleteFotoFromStorage, updateExploracionClinica } from '@/lib/queries'

const GestionarFotos = ({ foto1, foto2, cedula, nombre, onClose, onGuardado, s }) => {
  const [f1, setF1] = useState(foto1 || '')
  const [f2, setF2] = useState(foto2 || '')
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState('')
  const input1 = useRef(null)
  const input2 = useRef(null)

  const subir = async (archivo, slot) => {
    if (!archivo) return
    if (!archivo.type.startsWith('image/')) { setError('Solo se permiten imágenes'); return }
    if (archivo.size > 5 * 1024 * 1024) { setError('La imagen no puede superar 5MB'); return }
    setSubiendo(true)
    setError('')
    try {
      const url = await uploadFotoExploracion(cedula, slot, archivo)
      if (slot === 1) setF1(url)
      else setF2(url)
    } catch (e) {
      setError('Error al subir: ' + e.message)
    } finally {
      setSubiendo(false)
    }
  }

  const eliminar = (slot) => {
    if (slot === 1) setF1('')
    else setF2('')
  }

  const guardar = async () => {
    setSubiendo(true)
    setError('')
    try {
      const urlAEliminar1 = foto1 && !f1 ? foto1 : null
      const urlAEliminar2 = foto2 && !f2 ? foto2 : null
      if (urlAEliminar1) await deleteFotoFromStorage(urlAEliminar1)
      if (urlAEliminar2) await deleteFotoFromStorage(urlAEliminar2)
      await updateExploracionClinica(cedula, { foto1_url: f1 || null, foto2_url: f2 || null })
      onGuardado()
      onClose()
    } catch (e) {
      setError('Error al guardar: ' + e.message)
    } finally {
      setSubiendo(false)
    }
  }

  const renderSlot = (url, slot, setUrl) => (
    <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '15px', textAlign: 'center' }}>
      <p style={{ color: '#888', fontSize: '12px', marginBottom: '10px' }}>Foto {slot}</p>
      {url ? (
        <>
          <img src={url} alt={`foto ${slot}`} style={{ width: '100%', borderRadius: '6px', maxHeight: '180px', objectFit: 'cover', marginBottom: '10px' }} />
          <button
            style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', cursor: 'pointer', marginRight: '6px' }}
            onClick={() => eliminar(slot)}
          >
            Eliminar
          </button>
        </>
      ) : (
        <div style={{ width: '100%', height: '100px', backgroundColor: '#222', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
          <span style={{ color: '#555', fontSize: '30px' }}>📷</span>
        </div>
      )}
      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: url ? '8px' : 0 }}>
        <button
          style={{ ...s.btnGreen, fontSize: '11px', padding: '5px 10px' }}
          onClick={() => slot === 1 ? input1.current.click() : input2.current.click()}
          disabled={subiendo}
        >
          {url ? 'Cambiar' : 'Subir foto'}
        </button>
      </div>
      <input
        ref={slot === 1 ? input1 : input2}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={e => subir(e.target.files[0], slot)}
      />
    </div>
  )

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '25px', maxWidth: '550px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        <h3 style={{ color: '#fff', marginBottom: '5px' }}>Gestionar fotos</h3>
        <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>{nombre}</p>
        {error && <p style={{ color: '#f87171', fontSize: '12px', marginBottom: '15px' }}>{error}</p>}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
          {renderSlot(f1, 1, setF1)}
          {renderSlot(f2, 2, setF2)}
        </div>
        {subiendo && <p style={{ color: '#fbbf24', fontSize: '12px', marginBottom: '10px' }}>Subiendo...</p>}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ ...s.btn, flex: 1 }} onClick={onClose}>Cancelar</button>
          <button
            style={{ ...s.btnGreen, flex: 1 }}
            onClick={guardar}
            disabled={subiendo}
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ExploracionClinicaList({
  exploraciones,
  obtenerIdParticipante,
  ordenarPorIdParticipante,
  getNombre,
  eliminarExploracion,
  cargarDatos,
  filtrar,
  busqueda,
  s
}) {
  const [descripcionVer, setDescripcionVer] = useState(null)
  const [fotosGestionar, setFotosGestionar] = useState(null)

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
                    <button
                      style={s.btnBlue}
                      onClick={() =>
                        setFotosGestionar({
                          cedula: e.cedula,
                          nombre: getNombre(e.cedula),
                          foto1_url: e.foto1_url,
                          foto2_url: e.foto2_url
                        })
                      }
                    >
                      {e.foto1_url || e.foto2_url ? `📷 ${(e.foto1_url ? 1 : 0) + (e.foto2_url ? 1 : 0)}` : '📷 Agregar'}
                    </button>
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

      {fotosGestionar && (
        <GestionarFotos
          foto1={fotosGestionar.foto1_url}
          foto2={fotosGestionar.foto2_url}
          cedula={fotosGestionar.cedula}
          nombre={fotosGestionar.nombre}
          onClose={() => setFotosGestionar(null)}
          onGuardado={cargarDatos}
          s={s}
        />
      )}
    </>
  )
}
