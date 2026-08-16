import React from 'react'

export default function PruebaOddsRatio({
  varFila,
  setVarFila,
  varColumna,
  setVarColumna,
  calculoOR,
  setCalculoOR,
  calcularOddsRatio,
  pacientes,
  exploraciones,
  historias,
  analisis,
  s
}) {

  const handleCalcular = () => {
    calcularOddsRatio(pacientes, exploraciones, historias, analisis)
  }

  return (
    <div style={s.card}>
      <h3 style={{ color: '#fff', marginBottom: '10px', fontSize: '18px', fontWeight: '600' }}>
        8. Prueba Odds Ratio (Razón de Momios / Razón de Posibilidades)
      </h3>
      <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>
        Evalúa la fuerza de asociación y la probabilidad relativa (Odds Ratio) entre la presencia de lesiones orales y los factores demográficos, clínicos y psicológicos de la población del estudio.
      </p>

      {/* PANEL DE SELECCIÓN */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '15px', alignItems: 'end', marginBottom: '30px', flexWrap: 'wrap' }}>
        <div>
          <label style={{ color: '#ccc', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Variable de las filas (Efecto / Lesión):</label>
          <select
            style={{ ...s.select, width: '100%' }}
            value={varFila}
            onChange={e => {
              setVarFila(e.target.value)
              setCalculoOR(null)
            }}
          >
            <option value="">-- Seleccione una variable --</option>
            <option value="Lesiones orales (Sí / No)">Lesiones orales (Sí / No)</option>
            <option value="Lesión en labios (Sí / No)">Lesión en labios (Sí / No)</option>
            <option value="Lesión en mejillas (Sí / No)">Lesión en mejillas (Sí / No)</option>
            <option value="Lesión en lengua (Sí / No)">Lesión en lengua (Sí / No)</option>
          </select>
        </div>
        <div>
          <label style={{ color: '#ccc', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Variable de las columnas (Factor de riesgo / exposición):</label>
          <select
            style={{ ...s.select, width: '100%' }}
            value={varColumna}
            onChange={e => {
              setVarColumna(e.target.value)
              setCalculoOR(null)
            }}
          >
            <option value="">-- Seleccione una variable --</option>
            <option value="Edad (Menor / Mayor de edad)">Edad (Menor / Mayor de edad)</option>
            <option value="Sexo">Sexo (Masculino / Femenino)</option>
            <option value="Área de la universidad">Área de la universidad (Preclínica / Clínica)</option>
            <option value="Enfermedades sistémicas (Sí / No)">Enfermedades sistémicas (Sí / No)</option>
            <option value="Consumo de medicamentos (Sí / No)">Consumo de medicamentos (Sí / No)</option>
            <option value="Antecedentes psicológicos (Sí / No)">Antecedentes psicológicos (Sí / No)</option>
            <option value="Sustancias psicoactivas (Sí / No)">Sustancias psicoactivas (Sí / No)</option>
            <option value="Hábito de fumar (Sí / No)">Hábito de fumar (Sí / No)</option>
            <option value="Hábito de vape (Sí / No)">Hábito de vape (Sí / No)</option>
            <option value="Trastorno psicológico (Sí / No)">Trastorno psicológico (Sí / No)</option>
            <option value="Depresión (Sí / No)">Depresión (Sí / No)</option>
            <option value="Ansiedad (Sí / No)">Ansiedad (Sí / No)</option>
            <option value="Estrés (Sí / No)">Estrés (Sí / No)</option>
          </select>
        </div>
        <button
          style={{ ...s.btnGreen, padding: '12px 24px', fontSize: '14px', height: '42px' }}
          onClick={handleCalcular}
        >
          📊 Calcular Odds Ratio
        </button>
      </div>

      {calculoOR && (
        <div>
          {/* TABLA DE CONTINGENCIA 2x2 */}
          <h4 style={{ color: '#fff', fontSize: '15px', marginBottom: '12px' }}>
            Tabla de Contingencia 2x2 ({calculoOR.labelFila} vs {calculoOR.labelC1})
          </h4>
          <div style={{ overflowX: 'auto', marginBottom: '25px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', textAlign: 'center' }}>
              <thead>
                <tr style={{ backgroundColor: '#1a1a1a', borderBottom: '1px solid #333' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#aaa', fontWeight: '500' }}>
                    {varFila.split(' (')[0]} \ {varColumna.split(' (')[0]}
                  </th>
                  <th style={{ padding: '12px', color: '#10b981', fontWeight: '600' }}>
                    {calculoOR.labelC1} (Exposición +)
                  </th>
                  <th style={{ padding: '12px', color: '#3b82f6', fontWeight: '600' }}>
                    {calculoOR.labelC2} (Exposición -)
                  </th>
                  <th style={{ padding: '12px', color: '#888', fontWeight: '500' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '12px', textAlign: 'left', color: '#fff', fontWeight: '500' }}>
                    {calculoOR.labelF1} (Caso +)
                  </td>
                  <td style={{ padding: '12px', color: '#fff', fontWeight: 'bold', backgroundColor: '#161d19' }}>
                    {calculoOR.a} <span style={{ color: '#888', fontSize: '11px' }}>(a)</span>
                  </td>
                  <td style={{ padding: '12px', color: '#fff', fontWeight: 'bold', backgroundColor: '#161922' }}>
                    {calculoOR.b} <span style={{ color: '#888', fontSize: '11px' }}>(b)</span>
                  </td>
                  <td style={{ padding: '12px', color: '#aaa', backgroundColor: '#181818' }}>
                    {calculoOR.totalF1}
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #222' }}>
                  <td style={{ padding: '12px', textAlign: 'left', color: '#fff', fontWeight: '500' }}>
                    {calculoOR.labelF2} (Caso -)
                  </td>
                  <td style={{ padding: '12px', color: '#fff', fontWeight: 'bold', backgroundColor: '#161d19' }}>
                    {calculoOR.c} <span style={{ color: '#888', fontSize: '11px' }}>(c)</span>
                  </td>
                  <td style={{ padding: '12px', color: '#fff', fontWeight: 'bold', backgroundColor: '#161922' }}>
                    {calculoOR.d} <span style={{ color: '#888', fontSize: '11px' }}>(d)</span>
                  </td>
                  <td style={{ padding: '12px', color: '#aaa', backgroundColor: '#181818' }}>
                    {calculoOR.totalF2}
                  </td>
                </tr>
                <tr style={{ backgroundColor: '#181818', fontWeight: 'bold' }}>
                  <td style={{ padding: '12px', textAlign: 'left', color: '#888' }}>Total de Pacientes</td>
                  <td style={{ padding: '12px', color: '#aaa' }}>{calculoOR.totalC1}</td>
                  <td style={{ padding: '12px', color: '#aaa' }}>{calculoOR.totalC2}</td>
                  <td style={{ padding: '12px', color: '#10b981', fontSize: '15px' }}>N = {calculoOR.totalN}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {calculoOR.aplicoHaldane && (
            <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px', padding: '10px 14px', marginBottom: '20px', fontSize: '12px', color: '#fbbf24' }}>
              ⚠️ <strong>Corrección de Haldane-Anscombe aplicada:</strong> Debido a que al menos una celda de la tabla contenía 0 observaciones, se sumó 0.5 a cada celda para evitar indefiniciones matemáticas en la división por cero o la función logarítmica.
            </div>
          )}

          {/* PARÁMETROS CALCULADOS */}
          <h4 style={{ color: '#fff', fontSize: '15px', marginBottom: '12px' }}>
            Resultados de la Prueba Odds Ratio
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '25px' }}>
            <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '15px', textAlign: 'center' }}>
              <span style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Odds Ratio (OR)</span>
              <strong style={{ color: calculoOR.esFactorRiesgo ? '#ef4444' : calculoOR.esFactorProtector ? '#3b82f6' : '#10b981', fontSize: '22px' }}>
                {calculoOR.oddsRatio.toFixed(3)}
              </strong>
            </div>
            <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '15px', textAlign: 'center' }}>
              <span style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '4px' }}>Error Estándar SE(ln OR)</span>
              <strong style={{ color: '#fff', fontSize: '22px' }}>
                {calculoOR.seLogOR.toFixed(4)}
              </strong>
            </div>
            <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '15px', textAlign: 'center' }}>
              <span style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '4px' }}>IC 95% Límite Inferior</span>
              <strong style={{ color: '#aaa', fontSize: '22px' }}>
                {calculoOR.icLower.toFixed(3)}
              </strong>
            </div>
            <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', padding: '15px', textAlign: 'center' }}>
              <span style={{ color: '#888', fontSize: '12px', display: 'block', marginBottom: '4px' }}>IC 95% Límite Superior</span>
              <strong style={{ color: '#aaa', fontSize: '22px' }}>
                {calculoOR.icUpper.toFixed(3)}
              </strong>
            </div>
          </div>

          {/* FÓRMULAS INTERMEDIAS DETALLADAS */}
          <div style={{ backgroundColor: '#141414', border: '1px solid #282828', borderRadius: '8px', padding: '16px', marginBottom: '25px' }}>
            <h5 style={{ color: '#ccc', margin: '0 0 10px 0', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Fórmulas y Procedimiento de Cálculo
            </h5>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', fontSize: '13px', color: '#aaa' }}>
              <div>
                <p style={{ margin: '0 0 6px 0' }}>
                  <strong style={{ color: '#fff' }}>1. Odds Ratio (OR):</strong>
                </p>
                <code style={{ display: 'block', backgroundColor: '#0a0a0a', padding: '8px 12px', borderRadius: '6px', color: '#10b981', fontFamily: 'monospace' }}>
                  OR = (a × d) / (b × c) = ({calculoOR.aCalc} × {calculoOR.dCalc}) / ({calculoOR.bCalc} × {calculoOR.cCalc}) = {calculoOR.oddsRatio.toFixed(4)}
                </code>
              </div>
              <div>
                <p style={{ margin: '0 0 6px 0' }}>
                  <strong style={{ color: '#fff' }}>2. Intervalo de Confianza al 95%:</strong>
                </p>
                <code style={{ display: 'block', backgroundColor: '#0a0a0a', padding: '8px 12px', borderRadius: '6px', color: '#3b82f6', fontFamily: 'monospace' }}>
                  IC 95% = exp(ln({calculoOR.oddsRatio.toFixed(3)}) ± 1.96 × {calculoOR.seLogOR.toFixed(4)}) = [{calculoOR.icLower.toFixed(3)} - {calculoOR.icUpper.toFixed(3)}]
                </code>
              </div>
            </div>
          </div>

          {/* CUADRO DE CONCLUSIÓN */}
          <div
            style={{
              backgroundColor: calculoOR.esFactorRiesgo ? 'rgba(239, 68, 68, 0.12)' : calculoOR.esFactorProtector ? 'rgba(59, 130, 246, 0.12)' : 'rgba(16, 185, 129, 0.12)',
              border: `1px solid ${calculoOR.esFactorRiesgo ? 'rgba(239, 68, 68, 0.3)' : calculoOR.esFactorProtector ? 'rgba(59, 130, 246, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
              borderRadius: '10px',
              padding: '20px'
            }}
          >
            <h4
              style={{
                color: calculoOR.esFactorRiesgo ? '#f87171' : calculoOR.esFactorProtector ? '#60a5fa' : '#34d399',
                fontSize: '16px',
                marginTop: 0,
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{calculoOR.esFactorRiesgo ? '⚠️' : calculoOR.esFactorProtector ? '🛡️' : '💡'}</span>
              <span>
                {calculoOR.esFactorRiesgo
                  ? 'Conclusión: Factor de Riesgo Estadísticamente Significativo'
                  : calculoOR.esFactorProtector
                  ? 'Conclusión: Factor Protector Estadísticamente Significativo'
                  : 'Conclusión: No existe Asociación Estadísticamente Significativa'}
              </span>
            </h4>

            <p style={{ color: '#e5e7eb', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
              {calculoOR.esFactorRiesgo && (
                <>
                  Se identificó que <strong>{varColumna.split(' (')[0]}</strong> es un <strong>factor de riesgo significativo</strong> para <strong>{varFila.split(' (')[0]}</strong>.
                  El grupo con <strong>{calculoOR.labelC1}</strong> presenta <strong>{calculoOR.oddsRatio.toFixed(2)} veces más probabilidad (odds)</strong> de presentar <strong>{calculoOR.labelF1}</strong> en comparación con el grupo de referencia ({calculoOR.labelC2}).
                  Debido a que el Intervalo de Confianza del 95% (<strong>IC 95%: {calculoOR.icLower.toFixed(3)} - {calculoOR.icUpper.toFixed(3)}</strong>) es estrictamente mayor a 1.0, existe evidencia estadística suficiente para afirmar la asociación.
                </>
              )}

              {calculoOR.esFactorProtector && (
                <>
                  Se identificó que <strong>{varColumna.split(' (')[0]}</strong> actúa como un <strong>factor protector significativo</strong> frente a <strong>{varFila.split(' (')[0]}</strong> (Odds Ratio = <strong>{calculoOR.oddsRatio.toFixed(2)}</strong>).
                  La probabilidad de presentar <strong>{calculoOR.labelF1}</strong> es menor en el grupo con <strong>{calculoOR.labelC1}</strong> que en el grupo de referencia.
                  Debido a que el Intervalo de Confianza del 95% (<strong>IC 95%: {calculoOR.icLower.toFixed(3)} - {calculoOR.icUpper.toFixed(3)}</strong>) es completamente inferior a 1.0, la asociación es estadísticamente significativa.
                </>
              )}

              {!calculoOR.esSignificativo && (
                <>
                  El análisis de Odds Ratio arrojó un valor de <strong>{calculoOR.oddsRatio.toFixed(3)}</strong> con un Intervalo de Confianza al 95% de <strong>[{calculoOR.icLower.toFixed(3)} a {calculoOR.icUpper.toFixed(3)}]</strong>.
                  Puesto que el intervalo de confianza incluye el valor nulo de <strong>1.0</strong>, <strong>no se puede concluir con significancia estadística al 95% de confianza</strong> que <strong>{varColumna.split(' (')[0]}</strong> constituya un factor de riesgo o de protección para <strong>{varFila.split(' (')[0]}</strong> en la muestra evaluada.
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
