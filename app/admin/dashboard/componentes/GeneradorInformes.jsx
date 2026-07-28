import React, { useState, useMemo } from 'react'

const VARIABLES_FILA = [
  { value: 'lesiones_orales', label: 'Lesiones orales (Sí / No)' },
  { value: 'lesion_labios', label: 'Lesión en labios (Sí / No)' },
  { value: 'lesion_mejillas', label: 'Lesión en mejillas (Sí / No)' },
  { value: 'lesion_lengua', label: 'Lesión en lengua (Sí / No)' },
]

const VARIABLES_COLUMNA = [
  { value: 'edad', label: 'Edad (Menor / Mayor de edad)' },
  { value: 'sexo', label: 'Sexo' },
  { value: 'area', label: 'Área de la universidad' },
  { value: 'enfermedades', label: 'Enfermedades sistémicas (Sí / No)' },
  { value: 'medicamentos', label: 'Consumo de medicamentos (Sí / No)' },
  { value: 'antecedentes', label: 'Antecedentes psicológicos (Sí / No)' },
  { value: 'sustancias', label: 'Sustancias psicoactivas (Sí / No)' },
  { value: 'fumar', label: 'Hábito de fumar (Sí / No)' },
  { value: 'vape', label: 'Hábito de vape (Sí / No)' },
  { value: 'trastorno', label: 'Trastorno psicológico (Sí / No)' },
  { value: 'depresion', label: 'Depresión (Sí / No)' },
  { value: 'ansiedad', label: 'Ansiedad (Sí / No)' },
  { value: 'estres', label: 'Estrés (Sí / No)' },
]

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899']

export default function GeneradorInformes({ pacientes, exploraciones, historias, analisis, s }) {
  const [varFila, setVarFila] = useState('')
  const [varColumna, setVarColumna] = useState('')
  const [generado, setGenerado] = useState(false)

  const datos = useMemo(() => {
    if (!varFila || !varColumna || !generado) return null

    const getFila = (p) => {
      const e = exploraciones.find(x => x.cedula == p.cedula)
      if (!e) return null
      if (varFila === 'lesiones_orales') {
        if (e.presenta_lesiones === 'Sí') return { val: 'Sí', label: 'Con lesiones' }
        if (e.presenta_lesiones === 'No') return { val: 'No', label: 'Sin lesiones' }
      } else if (varFila === 'lesion_labios') {
        if (e.mordedura_labios === 'Sí') return { val: 'Sí', label: 'Lesión labios' }
        if (e.mordedura_labios === 'No') return { val: 'No', label: 'Sin lesión labios' }
      } else if (varFila === 'lesion_mejillas') {
        if (e.mordedura_mejillas === 'Sí') return { val: 'Sí', label: 'Lesión mejillas' }
        if (e.mordedura_mejillas === 'No') return { val: 'No', label: 'Sin lesión mejillas' }
      } else if (varFila === 'lesion_lengua') {
        if (e.mordedura_lengua === 'Sí') return { val: 'Sí', label: 'Lesión lengua' }
        if (e.mordedura_lengua === 'No') return { val: 'No', label: 'Sin lesión lengua' }
      }
      return null
    }

    const getCol = (p) => {
      const h = historias.find(x => x.cedula == p.cedula)
      const a = analisis.find(x => x.cedula == p.cedula)
      if (varColumna === 'edad') {
        if (h && h.edad != null) {
          const m = h.edad < 18
          return { val: m ? 'Menor' : 'Mayor', label: m ? 'Menor de edad' : 'Mayor de edad' }
        }
      } else if (varColumna === 'sexo') {
        if (h && (h.sexo === 'Masculino' || h.sexo === 'Femenino'))
          return { val: h.sexo, label: h.sexo }
      } else if (varColumna === 'area') {
        if (h && (h.area === 'Preclínica' || h.area === 'Clínica'))
          return { val: h.area, label: h.area }
      } else if (varColumna === 'enfermedades') {
        if (h && (h.enfermedades_sistemicas === 'Sí' || h.enfermedades_sistemicas === 'No'))
          return { val: h.enfermedades_sistemicas, label: h.enfermedades_sistemicas === 'Sí' ? 'Con enfermedad' : 'Sin enfermedad' }
      } else if (varColumna === 'medicamentos') {
        if (h && (h.toma_medicamentos === 'Sí' || h.toma_medicamentos === 'No'))
          return { val: h.toma_medicamentos, label: h.toma_medicamentos === 'Sí' ? 'Consume med.' : 'No consume med.' }
      } else if (varColumna === 'antecedentes') {
        if (h && (h.antecedentes_psicologicos === 'Sí' || h.antecedentes_psicologicos === 'No'))
          return { val: h.antecedentes_psicologicos, label: h.antecedentes_psicologicos === 'Sí' ? 'Con antecedentes' : 'Sin antecedentes' }
      } else if (varColumna === 'sustancias') {
        if (h && (h.sustancias_psicoactivas === 'Sí' || h.sustancias_psicoactivas === 'No'))
          return { val: h.sustancias_psicoactivas, label: h.sustancias_psicoactivas === 'Sí' ? 'Consume SPA' : 'No consume SPA' }
      } else if (varColumna === 'fumar') {
        if (h) {
          const f = h.fuma_cigarrillo_vape === 'Cigarrillo' || h.fuma_cigarrillo_vape === 'Las dos'
          return { val: f ? 'Sí' : 'No', label: f ? 'Fuma' : 'No fuma' }
        }
      } else if (varColumna === 'vape') {
        if (h) {
          const v = h.fuma_cigarrillo_vape === 'Vape' || h.fuma_cigarrillo_vape === 'Las dos'
          return { val: v ? 'Sí' : 'No', label: v ? 'Usa vape' : 'No usa vape' }
        }
      } else if (varColumna === 'trastorno') {
        if (a && a.interpretacion_depresion && a.interpretacion_ansiedad && a.interpretacion_estres) {
          const t = a.interpretacion_depresion !== 'Normal' || a.interpretacion_ansiedad !== 'Normal' || a.interpretacion_estres !== 'Normal'
          return { val: t ? 'Sí' : 'No', label: t ? 'Con trastorno' : 'Sin trastorno' }
        }
      } else if (varColumna === 'depresion') {
        if (a && a.interpretacion_depresion) {
          return { val: a.interpretacion_depresion !== 'Normal' ? 'Sí' : 'No', label: a.interpretacion_depresion !== 'Normal' ? 'Con depresión' : 'Sin depresión' }
        }
      } else if (varColumna === 'ansiedad') {
        if (a && a.interpretacion_ansiedad) {
          return { val: a.interpretacion_ansiedad !== 'Normal' ? 'Sí' : 'No', label: a.interpretacion_ansiedad !== 'Normal' ? 'Con ansiedad' : 'Sin ansiedad' }
        }
      } else if (varColumna === 'estres') {
        if (a && a.interpretacion_estres) {
          return { val: a.interpretacion_estres !== 'Normal' ? 'Sí' : 'No', label: a.interpretacion_estres !== 'Normal' ? 'Con estrés' : 'Sin estrés' }
        }
      }
      return null
    }

    const filas = {}
    const cols = {}
    let total = 0

    pacientes.forEach(p => {
      const f = getFila(p)
      const c = getCol(p)
      if (!f || !c) return
      if (!filas[f.label]) filas[f.label] = {}
      if (!filas[f.label][c.label]) filas[f.label][c.label] = 0
      filas[f.label][c.label]++
      cols[c.label] = (cols[c.label] || 0) + 1
      total++
    })

    if (total === 0) return null

    const filaLabels = Object.keys(filas)
    const colLabels = Object.keys(cols).sort((a, b) => cols[b] - cols[a])

    const tabla = filaLabels.map(fl => {
      const rowTotal = colLabels.reduce((acc, cl) => acc + (filas[fl]?.[cl] || 0), 0)
      return {
        label: fl,
        vals: colLabels.map(cl => filas[fl]?.[cl] || 0),
        pcts: colLabels.map(cl => rowTotal > 0 ? Math.round(((filas[fl]?.[cl] || 0) / rowTotal) * 100) : 0),
        total: rowTotal,
      }
    })

    const filaTotales = filaLabels.map(fl => {
      const rowTotal = colLabels.reduce((acc, cl) => acc + (filas[fl]?.[cl] || 0), 0)
      return { label: fl, total: rowTotal, pct: Math.round((rowTotal / total) * 100) }
    })

    return {
      filaLabels,
      colLabels,
      tabla,
      filaTotales,
      colTotales: colLabels.map(cl => ({ label: cl, total: cols[cl], pct: Math.round((cols[cl] / total) * 100) })),
      total,
      labelFila: VARIABLES_FILA.find(v => v.value === varFila)?.label.split(' (')[0] || '',
      labelCol: VARIABLES_COLUMNA.find(v => v.value === varColumna)?.label.split(' (')[0] || '',
    }
  }, [varFila, varColumna, generado, pacientes, exploraciones, historias, analisis])

  const styles = {
    selectBox: {
      background: '#1b1d24',
      border: '1px solid #2e3038',
      borderRadius: '10px',
      padding: '14px 16px',
      color: '#e5e7eb',
      fontSize: '15px',
    },
    titleBox: {
      background: '#1b1d24',
      border: '1px solid #2e3038',
      borderRadius: '10px',
      padding: '16px',
      fontSize: '16px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    },
    chartBox: {
      background: '#1b1d24',
      border: '1px solid #2e3038',
      borderRadius: '10px',
      padding: '20px',
      marginBottom: '20px',
    },
    chartTitle: {
      color: '#9ca3af',
      fontSize: '13px',
      letterSpacing: '1px',
      textTransform: 'uppercase',
      marginBottom: '30px',
    },
  }

  return (
    <div style={{ ...s.card, marginTop: '10px' }}>
      <h4 style={{ color: '#fff', marginBottom: '15px', fontSize: '18px', fontWeight: '700' }}>Generador de Informes Interactivos</h4>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '15px', alignItems: 'end', marginBottom: '25px', flexWrap: 'wrap' }}>
        <div>
          <label style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '6px', display: 'block' }}>Variable de fila:</label>
          <select style={{ ...styles.selectBox, width: '100%' }} value={varFila} onChange={e => { setVarFila(e.target.value); setGenerado(false) }}>
            <option value="">-- Selecciona --</option>
            {VARIABLES_FILA.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
          </select>
        </div>
        <div>
          <label style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '6px', display: 'block' }}>Variable de columna:</label>
          <select style={{ ...styles.selectBox, width: '100%' }} value={varColumna} onChange={e => { setVarColumna(e.target.value); setGenerado(false) }}>
            <option value="">-- Selecciona --</option>
            {VARIABLES_COLUMNA.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ ...s.btnGreen, height: '44px', padding: '0 22px', fontWeight: '600', fontSize: '15px' }} onClick={() => { if (!varFila || !varColumna) { alert('Selecciona ambas variables.'); return } setGenerado(true) }}>Generar</button>
          {generado && <button style={{ ...s.btn, height: '44px', padding: '0 16px', fontSize: '15px' }} onClick={() => { setVarFila(''); setVarColumna(''); setGenerado(false) }}>Limpiar</button>}
        </div>
      </div>

      {!datos ? (
        <div style={{ ...styles.chartBox, marginBottom: 0 }}>
          <p style={{ color: '#555', fontSize: '14px', margin: 0, textAlign: 'center', padding: '20px 0' }}>Selecciona las variables y presiona <strong style={{ color: '#9ca3af' }}>Generar</strong>.</p>
        </div>
      ) : (
        <div>
          <div style={styles.titleBox}>
            <span style={{ color: '#e5e7eb', fontWeight: '700' }}>{datos.labelFila}</span>
            <span style={{ color: '#9ca3af', fontWeight: '400' }}> según </span>
            <span style={{ color: '#e5e7eb', fontWeight: '700' }}>{datos.labelCol}</span>
          </div>

          {/* FRECUENCIAS + GRÁFICO CIRCULAR */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

            {/* GRÁFICO DE FRECUENCIAS - barras verticales estilo mockup */}
            <div style={styles.chartBox}>
              <div style={styles.chartTitle}>Frecuencias</div>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: datos.filaTotales.length <= 3 ? '80px' : '40px', paddingBottom: '10px', borderBottom: '1px solid #2e3038' }}>
                {datos.filaTotales.map((ft, i) => {
                  const maxTotal = Math.max(...datos.filaTotales.map(f => f.total))
                  const barHeight = maxTotal > 0 ? Math.round((ft.total / maxTotal) * 120) : 0
                  return (
                    <div key={ft.label} style={{ textAlign: 'center', minWidth: '70px' }}>
                      <div style={{ fontWeight: '700', fontSize: '14px', marginBottom: '8px', color: COLORS[i % COLORS.length] }}>{ft.pct}%</div>
                      <div style={{
                        width: '70px',
                        height: `${barHeight}px`,
                        backgroundColor: COLORS[i % COLORS.length],
                        borderRadius: '4px 4px 0 0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: '700',
                        fontSize: '16px',
                      }}>{ft.total}</div>
                      <div style={{ marginTop: '10px', fontSize: '13px', fontWeight: '600', color: COLORS[i % COLORS.length] }}>{ft.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* GRÁFICO CIRCULAR */}
            <div style={styles.chartBox}>
              <div style={styles.chartTitle}>Distribución total</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <svg viewBox="0 0 200 200" width="150" height="150" style={{ flexShrink: 0 }}>
                  {(() => {
                    let acum = 0
                    return datos.colTotales.map((ct, i) => {
                      const pct = ct.total / datos.total
                      const start = acum * 2 * Math.PI - Math.PI / 2
                      acum += pct
                      const end = acum * 2 * Math.PI - Math.PI / 2
                      const x1 = 100 + 80 * Math.cos(start)
                      const y1 = 100 + 80 * Math.sin(start)
                      const x2 = 100 + 80 * Math.cos(end)
                      const y2 = 100 + 80 * Math.sin(end)
                      return <path key={i} d={`M100,100 L${x1},${y1} A80,80 0 ${pct > 0.5 ? 1 : 0},1 ${x2},${y2} Z`} fill={COLORS[i % COLORS.length]} stroke="#1b1d24" strokeWidth="2" />
                    })
                  })()}
                  <circle cx="100" cy="100" r="35" fill="#1b1d24" />
                  <text x="100" y="96" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="800">{datos.total}</text>
                  <text x="100" y="110" textAnchor="middle" fill="#666" fontSize="10">Total</text>
                </svg>
                <div style={{ flex: 1 }}>
                  {datos.colTotales.map((ct, i) => (
                    <div key={ct.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ width: '10px', height: '10px', backgroundColor: COLORS[i % COLORS.length], borderRadius: '2px', flexShrink: 0 }} />
                      <span style={{ fontSize: '14px', color: '#aaa', flex: 1 }}>{ct.label}</span>
                      <span style={{ fontSize: '14px', color: COLORS[i % COLORS.length], fontWeight: '600' }}>{ct.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* TABLA DE CRUCE */}
          <div style={styles.chartBox}>
            <div style={styles.chartTitle}>Tabla de datos</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#888', backgroundColor: '#16171f', borderBottom: '2px solid #333' }}>
                      {datos.labelFila} ↓ · {datos.labelCol} →
                    </th>
                    {datos.colTotales.map((ct, i) => (
                      <th key={ct.label} style={{ padding: '12px', textAlign: 'center', color: COLORS[i % COLORS.length], backgroundColor: '#16171f', borderBottom: '2px solid #333', fontSize: '14px' }}>{ct.label}</th>
                    ))}
                    <th style={{ padding: '12px', textAlign: 'center', color: '#aaa', backgroundColor: '#16171f', borderBottom: '2px solid #333', fontSize: '14px' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {datos.tabla.map((row) => (
                    <tr key={row.label}>
                      <td style={{ padding: '12px', color: '#d1d5db', fontWeight: '600', borderBottom: '1px solid #222', fontSize: '14px' }}>{row.label}</td>
                      {row.vals.map((val, ci) => (
                        <td key={ci} style={{ padding: '12px', textAlign: 'center', color: '#d1d5db', borderBottom: '1px solid #222' }}>
                          <span style={{ fontWeight: '600', fontSize: '14px' }}>{val}</span>
                          <span style={{ color: '#666', fontSize: '13px', marginLeft: '4px' }}>({row.pcts[ci]}%)</span>
                        </td>
                      ))}
                      <td style={{ padding: '12px', textAlign: 'center', fontWeight: '700', color: '#fff', borderBottom: '1px solid #222', fontSize: '14px' }}>{row.total}</td>
                    </tr>
                  ))}
                  <tr style={{ backgroundColor: '#16171f' }}>
                    <td style={{ padding: '12px', fontWeight: '700', color: '#fff', borderTop: '2px solid #333', fontSize: '14px' }}>Total</td>
                    {datos.colTotales.map(ct => (
                      <td key={ct.label} style={{ padding: '12px', textAlign: 'center', fontWeight: '700', color: '#fff', borderTop: '2px solid #333', fontSize: '14px' }}>{ct.total}</td>
                    ))}
                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: '800', color: '#fbbf24', borderTop: '2px solid #333', fontSize: '14px' }}>{datos.total}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* DISTRIBUCIÓN POR COLUMNA - barras horizontales apiladas */}
          <div style={styles.chartBox}>
            <div style={styles.chartTitle}>Distribución por {datos.labelCol}</div>
            {datos.colLabels.map((cl, ci) => {
              const totalEnCol = datos.colTotales.find(ct => ct.label === cl)?.total || 1
              return (
                <div key={cl} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '14px', color: '#aaa', fontWeight: '500' }}>{cl}</span>
                    <span style={{ fontSize: '13px', color: '#666' }}>n={totalEnCol}</span>
                  </div>
                  <div style={{ display: 'flex', height: '30px', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#1a1a1a' }}>
                    {datos.tabla.map((row, ri) => {
                      const valEnCol = row.vals[ci]
                      const pctEnCol = totalEnCol > 0 ? Math.round((valEnCol / totalEnCol) * 100) : 0
                      return (
                        <div
                          key={ri}
                          style={{
                            width: `${pctEnCol}%`,
                            backgroundColor: COLORS[ri % COLORS.length],
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'width 0.5s ease',
                          }}
                        >
                          {pctEnCol >= 8 && <span style={{ fontSize: '13px', fontWeight: '700', color: '#fff' }}>{pctEnCol}%</span>}
                        </div>
                      )
                    })}
                  </div>
                  <div style={{ display: 'flex', gap: '14px', marginTop: '6px' }}>
                    {datos.tabla.map((row, ri) => (
                      <div key={ri} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '10px', height: '10px', backgroundColor: COLORS[ri % COLORS.length], borderRadius: '2px' }} />
                        <span style={{ fontSize: '13px', color: '#888' }}>{row.label}: {row.vals[ci]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

        </div>
      )}
    </div>
  )
}
