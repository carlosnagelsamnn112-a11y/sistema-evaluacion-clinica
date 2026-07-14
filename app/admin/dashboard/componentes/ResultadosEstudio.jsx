import React, { useState, useMemo } from 'react'

export default function ResultadosEstudio({
  pacientes,
  consentimientos,
  historias,
  analisis,
  exploraciones,
  s
}) {
  // Estados para reporte interactivo
  const [indicadorClinico, setIndicadorClinico] = useState('')
  const [factorAnalisis, setFactorAnalisis] = useState('')
  const [datosInteractivos, setDatosInteractivos] = useState(null)

  // Cálculos base fijos
  const totalConC1 = useMemo(() => {
    return consentimientos.filter(c => c.tipo === 1).length
  }, [consentimientos])

  const totalHistorias = historias.length
  const totalEncuestas = analisis.length
  const totalExploraciones = useMemo(() => {
    return exploraciones.filter(e => e.presenta_lesiones !== null).length
  }, [exploraciones])

  // Trastornos vs Lesiones orales
  const tieneTrastorno = useMemo(() => {
    return (cedula) => {
      const a = analisis.find(x => x.cedula == cedula)
      return a && (
        a.interpretacion_depresion !== 'Normal' ||
        a.interpretacion_ansiedad !== 'Normal' ||
        a.interpretacion_estres !== 'Normal'
      )
    }
  }, [analisis])

  const relacionEstadisticas = useMemo(() => {
    // Pacientes con exploración clínica completada
    const explorados = exploraciones.filter(e => e.presenta_lesiones === 'Sí' || e.presenta_lesiones === 'No')
    const conLesionesCedulas = explorados.filter(e => e.presenta_lesiones === 'Sí').map(e => e.cedula)
    const sinLesionesCedulas = explorados.filter(e => e.presenta_lesiones === 'No').map(e => e.cedula)

    const conL_conT = conLesionesCedulas.filter(c => tieneTrastorno(c)).length
    const conL_sinT = conLesionesCedulas.filter(c => !tieneTrastorno(c)).length
    const sinL_conT = sinLesionesCedulas.filter(c => tieneTrastorno(c)).length
    const sinL_sinT = sinLesionesCedulas.filter(c => !tieneTrastorno(c)).length

    return { conL_conT, conL_sinT, sinL_conT, sinL_sinT }
  }, [exploraciones, tieneTrastorno])

  const { conL_conT, conL_sinT, sinL_conT, sinL_sinT } = relacionEstadisticas

  // Generar reporte interactivo
  const generarResultados = () => {
    if (!indicadorClinico || !factorAnalisis) {
      alert('Por favor selecciona el indicador clínico y el factor de análisis.')
      return
    }

    // Obtener valor del indicador para cada paciente
    const getIndicador = (cedula) => {
      const e = exploraciones.find(x => x.cedula == cedula)
      const a = analisis.find(x => x.cedula == cedula)
      if (indicadorClinico === 'lesiones_orales') return e?.presenta_lesiones === 'Sí'
      if (indicadorClinico === 'lesion_labios') return e?.mordedura_labios === 'Sí'
      if (indicadorClinico === 'lesion_mejillas') return e?.mordedura_mejillas === 'Sí'
      if (indicadorClinico === 'lesion_lengue' || indicadorClinico === 'lesion_lengua') return e?.mordedura_lengua === 'Sí'
      if (indicadorClinico === 'depresion') return a?.interpretacion_depresion && a.interpretacion_depresion !== 'Normal'
      if (indicadorClinico === 'ansiedad') return a?.interpretacion_ansiedad && a.interpretacion_ansiedad !== 'Normal'
      if (indicadorClinico === 'estres') return a?.interpretacion_estres && a.interpretacion_estres !== 'Normal'
      if (indicadorClinico === 'cualquier_trastorno') return a && (a.interpretacion_depresion !== 'Normal' || a.interpretacion_ansiedad !== 'Normal' || a.interpretacion_estres !== 'Normal')
      return false
    }

    // Obtener categoría del factor para cada paciente
    const getFactor = (cedula) => {
      const h = historias.find(x => x.cedula == cedula)
      if (!h) return null
      if (factorAnalisis === 'sexo') return h.sexo || null
      if (factorAnalisis === 'area') return h.area || null
      if (factorAnalisis === 'fuma') {
        const v = h.fuma_cigarrillo_vape
        if (!v || v === 'Ninguna') return 'No fuma/vape'
        return 'Fuma o usa vape'
      }
      if (factorAnalisis === 'sustancias') return h.sustancias_psicoactivas || null
      if (factorAnalisis === 'eps') return h.eps || null
      return null
    }

    // Filtrar solo pacientes con datos completos en ambas variables
    const patsValidos = pacientes.filter(p => {
      const e = exploraciones.find(x => x.cedula == p.cedula)
      const h = historias.find(x => x.cedula == p.cedula)
      const needsExp = ['lesiones_orales', 'lesion_labios', 'lesion_mejillas', 'lesion_lengua'].includes(indicadorClinico)
      const needsAnal = ['depresion', 'ansiedad', 'estres', 'cualquier_trastorno'].includes(indicadorClinico)
      if (needsExp && (!e || e.presenta_lesiones === null || e.presenta_lesiones === '')) return false
      if (needsAnal && !analisis.find(x => x.cedula == p.cedula)) return false
      if (!h) return false
      if (!getFactor(p.cedula)) return false
      return true
    })

    // Agrupar por categoría del factor
    const grupos = {}
    patsValidos.forEach(p => {
      const cat = getFactor(p.cedula)
      if (!grupos[cat]) grupos[cat] = { total: 0, positives: 0 }
      grupos[cat].total++
      if (getIndicador(p.cedula)) grupos[cat].positives++
    })

    const resultado = Object.entries(grupos).map(([cat, v]) => ({
      categoria: cat,
      total: v.total,
      positivos: v.positives,
      negativos: v.total - v.positives,
      porcentaje: v.total > 0 ? Math.round((v.positives / v.total) * 100) : 0
    })).sort((a, b) => b.porcentaje - a.porcentaje)

    setDatosInteractivos({
      items: resultado,
      totalPacientes: patsValidos.length,
      totalPositivos: resultado.reduce((acc, d) => acc + d.positivos, 0)
    })
  }

  const labelIndicador = {
    lesiones_orales: 'Lesiones orales',
    lesion_labios: 'Lesión en labios',
    lesion_mejillas: 'Lesión en mejillas',
    lesion_lengua: 'Lesión en lengua',
    depresion: 'Trastorno de depresión',
    ansiedad: 'Trastorno de ansiedad',
    estres: 'Trastorno de estrés',
    cualquier_trastorno: 'Cualquier trastorno psicológico',
  }[indicadorClinico] || indicadorClinico

  const labelFactor = {
    sexo: 'Sexo',
    area: 'Área de la universidad',
    fuma: 'Hábito de fumar/vape',
    sustancias: 'Sustancias psicoactivas',
    eps: 'EPS',
  }[factorAnalisis] || factorAnalisis

  // Configuración de la Dona/Donut SVG para datos interactivos
  const donutConfig = useMemo(() => {
    if (!datosInteractivos || datosInteractivos.totalPositivos === 0) return { donutSegmentos: [], totalPositivos: 0, totalPacientes: 0 }
    
    const { items, totalPositivos, totalPacientes } = datosInteractivos
    const positivosPorCat = items.filter(d => d.positivos > 0)
    const donutR = 70
    const circ = 2 * Math.PI * donutR
    let acumulado = 0

    const palette = ['#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6', '#ef4444', '#06b6d4', '#84cc16']
    
    const donutSegmentos = positivosPorCat.map((d, i) => {
      const pct = d.positivos / totalPositivos
      const dashLen = pct * circ
      const offset = circ - acumulado * circ
      acumulado += pct
      return { ...d, dashLen, offset, color: palette[i % palette.length] }
    })

    return { donutSegmentos, totalPositivos, totalPacientes, palette }
  }, [datosInteractivos])

  const palette = donutConfig.palette || ['#f59e0b', '#3b82f6', '#10b981', '#ec4899', '#8b5cf6', '#ef4444', '#06b6d4', '#84cc16']

  return (
    <div>
      <h3 style={{ color: '#fff', marginBottom: '20px', fontSize: '18px' }}>Resultados del Estudio</h3>

      {/* BLOQUE 1: 4 ESTADÍSTICAS PRINCIPALES */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '12px', marginBottom: '25px' }}>
        {[
          { label: 'Total pacientes', sublabel: 'con Consentimiento 1 firmado', value: totalConC1, color: '#4fc3f7' },
          { label: 'Historia clínica', sublabel: 'completada', value: totalHistorias, color: '#81c784' },
          { label: 'Encuesta DASS-21', sublabel: 'completada', value: totalEncuestas, color: '#ffb74d' },
          { label: 'Exploración clínica', sublabel: 'completada', value: totalExploraciones, color: '#ce93d8' },
        ].map(item => (
          <div key={item.label} style={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', padding: '18px', textAlign: 'center' }}>
            <div style={{ fontSize: '40px', fontWeight: '800', color: item.color, lineHeight: 1 }}>{item.value}</div>
            <div style={{ color: '#fff', fontSize: '13px', fontWeight: '600', marginTop: '8px' }}>{item.label}</div>
            <div style={{ color: '#666', fontSize: '11px', marginTop: '3px' }}>{item.sublabel}</div>
          </div>
        ))}
      </div>

      {/* BLOQUE 2: RELACIÓN LESIONES vs TRASTORNOS */}
      <div style={{ ...s.card, marginBottom: '20px' }}>
        <h4 style={{ color: '#fff', marginBottom: '5px', fontSize: '15px' }}>Relación entre lesiones orales y trastornos psicológicos</h4>
        <p style={{ color: '#666', fontSize: '12px', marginBottom: '18px' }}>Trastorno = cualquier nivel distinto de Normal en Depresión, Ansiedad o Estrés · Solo pacientes con exploración clínica completada</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { label: 'Con lesiones orales y con trastornos psicológicos', value: conL_conT, color: '#f44336', bg: '#2a0a0a', border: '#5a1a1a' },
            { label: 'Con lesiones orales y sin trastornos psicológicos', value: conL_sinT, color: '#ff9800', bg: '#2a1a0a', border: '#5a3a0a' },
            { label: 'Sin lesiones orales y con trastornos psicológicos', value: sinL_conT, color: '#2196f3', bg: '#0a1a2a', border: '#1a3a5a' },
            { label: 'Sin lesiones orales y sin trastornos psicológicos', value: sinL_sinT, color: '#4caf50', bg: '#0a2a0a', border: '#1a5a1a' },
          ].map(item => {
            const total = conL_conT + conL_sinT + sinL_conT + sinL_sinT
            const pct = total > 0 ? Math.round((item.value / total) * 100) : 0
            return (
              <div key={item.label} style={{ backgroundColor: item.bg, border: `1px solid ${item.border}`, borderRadius: '10px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <div style={{ fontSize: '32px', fontWeight: '800', color: item.color, minWidth: '50px', textAlign: 'center' }}>{item.value}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#fff', fontSize: '13px', fontWeight: '600' }}>{item.label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                    <div style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px', height: '6px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, backgroundColor: item.color, height: '100%' }} />
                    </div>
                    <span style={{ color: '#888', fontSize: '11px', minWidth: '28px', textAlign: 'right' }}>{pct}%</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* BLOQUE 3: GENERADOR INTERACTIVO */}
      <div style={s.card}>
        <h4 style={{ color: '#fff', marginBottom: '5px', fontSize: '15px' }}>Generador de Informes Interactivos</h4>
        <p style={{ color: '#666', fontSize: '12px', marginBottom: '20px' }}>Cruza un indicador clínico de salud con un factor de análisis socio-demográfico para visualizar prevalencias.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '15px', alignItems: 'end', marginBottom: '25px', flexWrap: 'wrap' }}>
          <div>
            <label style={{ color: '#ccc', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Indicador clínico:</label>
            <select style={{ ...s.select, width: '100%' }} value={indicadorClinico} onChange={e => { setIndicadorClinico(e.target.value); setDatosInteractivos(null) }}>
              <option value="">-- Selecciona --</option>
              <option value="lesiones_orales">Lesiones orales (Sí/No)</option>
              <option value="lesion_labios">Lesión en labios (Sí/No)</option>
              <option value="lesion_mejillas">Lesión en mejillas (Sí/No)</option>
              <option value="lesion_lengua">Lesión en lengua (Sí/No)</option>
              <option value="depresion">Trastorno de depresión (Distinto de Normal)</option>
              <option value="ansiedad">Trastorno de ansiedad (Distinto de Normal)</option>
              <option value="estres">Trastorno de estrés (Distinto de Normal)</option>
              <option value="cualquier_trastorno">Cualquier trastorno psicológico (DASS-21)</option>
            </select>
          </div>
          <div>
            <label style={{ color: '#ccc', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Factor de análisis:</label>
            <select style={{ ...s.select, width: '100%' }} value={factorAnalisis} onChange={e => { setFactorAnalisis(e.target.value); setDatosInteractivos(null) }}>
              <option value="">-- Selecciona --</option>
              <option value="sexo">Sexo</option>
              <option value="area">Área académica (Preclínica/Clínica)</option>
              <option value="fuma">Hábito de fumar o usar vape</option>
              <option value="sustancias">Consumo de sustancias psicoactivas</option>
              <option value="eps">EPS asociada</option>
            </select>
          </div>
          <button style={{ ...s.btnGreen, height: '39px', padding: '0 25px', fontWeight: '600' }} onClick={generarResultados}>
            Generar resultados
          </button>
        </div>

        {/* CONTENIDOS DEL REPORTE GENERADO */}
        {!datosInteractivos ? (
          <div style={{ padding: '40px 20px', border: '1px dashed #2a2a2a', borderRadius: '10px', textAlign: 'center', backgroundColor: '#0c0c0f' }}>
            <span style={{ fontSize: '32px', display: 'block', marginBottom: '10px' }}>📊</span>
            <p style={{ color: '#555', fontSize: '13px', margin: 0 }}>
              Selecciona el indicador clínico y el factor de análisis y presiona <strong style={{ color: '#9ca3af' }}>Generar resultados</strong>.
            </p>
          </div>
        ) : (() => {
          const { donutSegmentos, totalPositivos, totalPacientes } = donutConfig
          const donutR = 70, donutCx = 100, donutCy = 100, strokeWidth = 30
          const circ = 2 * Math.PI * donutR

          return (
            <div>
              {/* Encabezado del reporte */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
                <div>
                  <p style={{ color: '#fff', fontWeight: '600', fontSize: '14px', margin: '0 0 3px 0' }}>
                    {labelIndicador} <span style={{ color: '#666' }}>según</span> {labelFactor}
                  </p>
                  <p style={{ color: '#666', fontSize: '12px', margin: 0 }}>
                    {totalPacientes} pacientes con datos completos · {totalPositivos} con indicador positivo
                  </p>
                </div>
                <button
                  style={{ ...s.btn, fontSize: '12px', padding: '6px 14px' }}
                  onClick={() => setDatosInteractivos(null)}
                >
                  ✕ Limpiar
                </button>
              </div>

              {/* Contenido Visual */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', alignItems: 'start' }}>
                
                {/* 1. BARRAS HORIZONTALES */}
                <div>
                  <p style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px' }}>
                    Prevalencia por {labelFactor}
                  </p>
                  {datosInteractivos.items.map((d, i) => (
                    <div key={d.categoria} style={{ marginBottom: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13px', color: '#d1d5db' }}>{d.categoria}</span>
                        <span style={{ fontSize: '12px', color: palette[i % palette.length], fontWeight: '600' }}>
                          {d.positivos}/{d.total} · {d.porcentaje}%
                        </span>
                      </div>
                      <div style={{ backgroundColor: '#1a1a1a', borderRadius: '6px', height: '24px', overflow: 'hidden', border: '1px solid #2a2a2a', position: 'relative' }}>
                        <div style={{
                          width: `${d.porcentaje}%`,
                          backgroundColor: palette[i % palette.length],
                          height: '100%',
                          borderRadius: '6px',
                          transition: 'width 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                          minWidth: d.porcentaje > 0 ? '4px' : '0',
                          opacity: 0.9
                        }} />
                        {d.porcentaje > 10 && (
                          <span style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', fontSize: '11px', color: '#000', fontWeight: '700' }}>
                            {d.porcentaje}%
                          </span>
                        )}
                      </div>
                      {/* Sub-barras del total */}
                      <div style={{ marginTop: '3px', display: 'flex', gap: '3px' }}>
                        {d.total > 0 && (
                          <div style={{ flex: d.positivos, backgroundColor: palette[i % palette.length], height: '3px', borderRadius: '2px', opacity: 0.5 }} />
                        )}
                        {d.negativos > 0 && (
                          <div style={{ flex: d.negativos, backgroundColor: '#2a2a2a', height: '3px', borderRadius: '2px' }} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 2. DONUT SVG */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <p style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px', alignSelf: 'flex-start' }}>
                    Distribución de casos positivos
                  </p>
                  {totalPositivos === 0 ? (
                    <div style={{ padding: '30px', textAlign: 'center', color: '#555', fontSize: '13px' }}>
                      Sin casos positivos registrados para mostrar.
                    </div>
                  ) : (
                    <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                      <svg viewBox="0 0 200 200" width="200" height="200">
                        {/* Anillo de fondo */}
                        <circle
                          cx={donutCx} cy={donutCy} r={donutR}
                          fill="none" stroke="#1e1e1e" strokeWidth={strokeWidth + 2}
                        />
                        {donutSegmentos.map((seg, i) => (
                          <circle
                            key={i}
                            cx={donutCx} cy={donutCy} r={donutR}
                            fill="none"
                            stroke={seg.color}
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${seg.dashLen} ${circ}`}
                            strokeDashoffset={seg.offset}
                            transform={`rotate(-90 ${donutCx} ${donutCy})`}
                            style={{ transition: 'stroke-dasharray 0.7s ease' }}
                          />
                        ))}
                        {/* Hueco central */}
                        <circle cx={donutCx} cy={donutCy} r={donutR - strokeWidth / 2 - 1} fill="#111218" />
                        {/* Textos centrales */}
                        <text x={donutCx} y={donutCy - 8} textAnchor="middle" fill="#fff" fontSize="22" fontWeight="800">{totalPositivos}</text>
                        <text x={donutCx} y={donutCy + 10} textAnchor="middle" fill="#666" fontSize="10">positivos</text>
                        <text x={donutCx} y={donutCy + 22} textAnchor="middle" fill="#555" fontSize="9">de {totalPacientes}</text>
                      </svg>
                    </div>
                  )}

                  {/* Leyenda */}
                  {totalPositivos > 0 && (
                    <div style={{ marginTop: '14px', width: '100%' }}>
                      {datosInteractivos.items.filter(d => d.positivos > 0).map((d, i) => (
                        <div key={d.categoria} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: palette[i % palette.length], flexShrink: 0 }} />
                          <span style={{ fontSize: '12px', color: '#9ca3af', flex: 1 }}>{d.categoria}</span>
                          <span style={{ fontSize: '12px', color: palette[i % palette.length], fontWeight: '600' }}>
                            {totalPositivos > 0 ? Math.round((d.positivos / totalPositivos) * 100) : 0}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* 3. TABLA RESUMEN */}
              <div style={{ marginTop: '24px', overflowX: 'auto' }}>
                <p style={{ color: '#9ca3af', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                  Tabla resumen
                </p>
                <table style={{ ...s.table, fontSize: '13px' }}>
                  <thead>
                    <tr>
                      <th style={s.th}>{labelFactor}</th>
                      <th style={{ ...s.th, textAlign: 'center' }}>Total pacientes</th>
                      <th style={{ ...s.th, textAlign: 'center' }}>Con indicador</th>
                      <th style={{ ...s.th, textAlign: 'center' }}>Sin indicador</th>
                      <th style={{ ...s.th, textAlign: 'center' }}>Prevalencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {datosInteractivos.items.map((d, i) => (
                      <tr key={d.categoria}>
                        <td style={s.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: palette[i % palette.length] }} />
                            {d.categoria}
                          </div>
                        </td>
                        <td style={{ ...s.td, textAlign: 'center', color: '#fff' }}>{d.total}</td>
                        <td style={{ ...s.td, textAlign: 'center' }}>
                          <span style={s.badge(d.positivos > 0 ? 'yellow' : 'gray')}>{d.positivos}</span>
                        </td>
                        <td style={{ ...s.td, textAlign: 'center', color: '#888' }}>{d.negativos}</td>
                        <td style={{ ...s.td, textAlign: 'center' }}>
                          <span style={s.badge(d.porcentaje >= 50 ? 'red' : d.porcentaje >= 25 ? 'yellow' : 'green')}>
                            {d.porcentaje}%
                          </span>
                        </td>
                      </tr>
                    ))}
                    {/* Fila de totales */}
                    <tr style={{ borderTop: '2px solid #333' }}>
                      <td style={{ ...s.td, fontWeight: '700', color: '#fff' }}>TOTAL</td>
                      <td style={{ ...s.td, textAlign: 'center', fontWeight: '700', color: '#fff' }}>{totalPacientes}</td>
                      <td style={{ ...s.td, textAlign: 'center', fontWeight: '700', color: '#fbbf24' }}>{totalPositivos}</td>
                      <td style={{ ...s.td, textAlign: 'center', fontWeight: '700', color: '#888' }}>{totalPacientes - totalPositivos}</td>
                      <td style={{ ...s.td, textAlign: 'center', fontWeight: '700', color: '#fff' }}>
                        {totalPacientes > 0 ? Math.round((totalPositivos / totalPacientes) * 100) : 0}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </div>
          )
        })()}
      </div>

    </div>
  )
}
