import React from 'react'

export default function HistoriasList({
  historias,
  obtenerIdParticipante,
  ordenarPorIdParticipante,
  getNombre,
  eliminarHistoria,
  filtrar,
  busqueda,
  s
}) {
  const historiasFiltradas = filtrar(ordenarPorIdParticipante(historias), busqueda)

  return (
    <div style={s.card}>
      <div className="tabla-wrap-siempre">
        <table style={s.table}>
          <thead>
            <tr>
              <th style={s.th}>ID</th>
              <th style={s.th}>Nombre</th>
              <th style={s.th}>Cédula</th>
              <th style={s.th}>Edad</th>
              <th style={s.th}>Sexo</th>
              <th style={s.th}>EPS</th>
              <th style={s.th}>Semestre</th>
              <th style={s.th}>Área</th>
              <th style={s.th}>Enf. Sistémicas</th>
              <th style={s.th}>Medicamentos</th>
              <th style={s.th}>Ant. Psicológicos</th>
              <th style={s.th}>Hábitos Orales</th>
              <th style={s.th}>Sustancias</th>
              <th style={s.th}>Fuma/Vape</th>
              <th style={s.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {historiasFiltradas.map(h => (
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
      {historias.length === 0 && (
        <p style={{ color: '#888', textAlign: 'center', padding: '20px' }}>No hay historias clínicas registradas</p>
      )}
    </div>
  )
}
