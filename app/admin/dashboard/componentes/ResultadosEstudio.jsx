import React, { useMemo } from 'react'
import GeneradorInformes from './GeneradorInformes'

export default function ResultadosEstudio({
  pacientes,
  consentimientos,
  historias,
  analisis,
  exploraciones,
  s
}) {

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

      {/* BLOQUE 3: GENERADOR DE INFORMES INTERACTIVOS */}
      <GeneradorInformes
        pacientes={pacientes}
        exploraciones={exploraciones}
        historias={historias}
        analisis={analisis}
        s={s}
      />

    </div>
  )
}
