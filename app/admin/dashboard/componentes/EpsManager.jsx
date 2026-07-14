import React, { useState } from 'react'

export default function EpsManager({ epsBD, agregarEps, eliminarEps, guardarEditEps, s }) {
  const [nuevaEps, setNuevaEps] = useState('')
  const [editEps, setEditEps] = useState(null)
  const [editEpsNombre, setEditEpsNombre] = useState('')

  const handleAgregar = () => {
    if (!nuevaEps.trim()) return
    agregarEps(nuevaEps)
    setNuevaEps('')
  }

  const handleGuardarEdit = () => {
    if (!editEpsNombre.trim()) return
    guardarEditEps(editEps, editEpsNombre)
    setEditEps(null)
    setEditEpsNombre('')
  }

  return (
    <div style={s.card}>
      <h3 style={{ color: '#fff', marginBottom: '15px' }}>Gestión de EPS</h3>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          style={{ ...s.input, flex: 1, minWidth: '150px' }}
          value={nuevaEps}
          onChange={e => setNuevaEps(e.target.value)}
          placeholder="Nombre de la nueva EPS"
          onKeyDown={e => e.key === 'Enter' && handleAgregar()}
        />
        <button style={s.btnGreen} onClick={handleAgregar}>+ Agregar</button>
      </div>
      <div className="tabla-wrap-siempre">
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>#</th>
              <th style={s.th}>Nombre EPS</th>
              <th style={s.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {epsBD.map((ep, i) => (
              <tr key={ep.id}>
                <td style={s.td}>{i + 1}</td>
                <td style={s.td}>
                  {editEps === ep.id ? (
                    <input
                      style={s.input}
                      value={editEpsNombre}
                      onChange={e => setEditEpsNombre(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleGuardarEdit()}
                    />
                  ) : (
                    ep.nombre
                  )}
                </td>
                <td style={s.td}>
                  {editEps === ep.id ? (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button style={s.btnGreen} onClick={handleGuardarEdit}>Guardar</button>
                      <button style={s.btn} onClick={() => setEditEps(null)}>Cancelar</button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        style={s.btnBlue}
                        onClick={() => {
                          setEditEps(ep.id)
                          setEditEpsNombre(ep.nombre)
                        }}
                      >
                        Editar
                      </button>
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
  )
}
