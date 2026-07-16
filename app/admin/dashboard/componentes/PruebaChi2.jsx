import React from 'react'

export default function PruebaChi2({
  varFila,
  setVarFila,
  varColumna,
  setVarColumna,
  calculoChi2,
  setCalculoChi2,
  calcularPruebaChi2,
  pacientes,
  exploraciones,
  historias,
  analisis,
  s
}) {

  const handleCalcular = () => {
    calcularPruebaChi2(pacientes, exploraciones, historias, analisis)
  }

  return (
    <div style={s.card}>
      <h3 style={{ color: '#fff', marginBottom: '10px', fontSize: '18px', fontWeight: '600' }}>
        7. Prueba de Chi-cuadrado
      </h3>
      <p style={{ color: '#888', fontSize: '14px', marginBottom: '20px' }}>
        Analiza de forma interactiva la asociación estadística entre las variables del estudio clínico. Los cálculos se generan automáticamente sobre todos los registros guardados.
      </p>

      {/* PANEL DE SELECCIÓN */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '15px', alignItems: 'end', marginBottom: '30px', flexWrap: 'wrap' }}>
        <div>
          <label style={{ color: '#ccc', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Variable de las filas:</label>
          <select
            style={{ ...s.select, width: '100%' }}
            value={varFila}
            onChange={e => {
              setVarFila(e.target.value)
              setCalculoChi2(null)
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
          <label style={{ color: '#ccc', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Variable de las columnas:</label>
          <select
            style={{ ...s.select, width: '100%' }}
            value={varColumna}
            onChange={e => {
              setVarColumna(e.target.value)
              setCalculoChi2(null)
            }}
          >
            <option value="">-- Seleccione una variable --</option>
            <option value="Edad (Menor / Mayor de edad)">Edad (Menor / Mayor de edad)</option>
            <option value="Sexo">Sexo</option>
            <option value="Área de la universidad">Área de la universidad</option>
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
          style={{ ...s.btnGreen, padding: '12px 28px', height: '40px', fontSize: '14px', fontWeight: '600' }}
          onClick={handleCalcular}
        >
          Calcular
        </button>
      </div>

      {!calculoChi2 ? (
        <div style={{ padding: '40px 20px', border: '1px dashed #333', borderRadius: '8px', textAlign: 'center', backgroundColor: '#0a0a0a' }}>
          <span style={{ fontSize: '36px', display: 'block', marginBottom: '10px' }}>📊</span>
          <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
            Selecciona una variable de fila y una de columna, y presiona el botón **Calcular** para ver los resultados.
          </p>
        </div>
      ) : (
        <div>
          {/* INFO ADICIONAL */}
          <div style={{ backgroundColor: '#161616', border: '1px solid #2d2d2d', borderRadius: '8px', padding: '12px 18px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#aaa' }}>
              Tamaño de muestra analizada (N): <strong style={{ color: '#fff' }}>{calculoChi2.totalN} pacientes</strong>
            </span>
            <span style={{ fontSize: '12px', color: '#666' }}>Cruzado por Cédula</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px', flexWrap: 'wrap' }}>
            
            {/* TABLA DE CONTINGENCIA (OBSERVADO vs ESPERADO) */}
            <div style={{ backgroundColor: '#141414', border: '1px solid #2c2c2c', borderRadius: '10px', padding: '18px' }}>
              <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: '600', marginBottom: '15px', borderBottom: '1px solid #2c2c2c', paddingBottom: '8px' }}>
                Tabla de contingencia (Frecuencias Observadas / Esperadas)
              </h4>
              <div className="tabla-wrap-siempre">
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', color: '#fff' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '10px', borderBottom: '2px solid #333', textAlign: 'left', color: '#888' }}>
                        {varFila.split(' ')[0]} ↓ \ {varColumna.split(' ')[0]} →
                      </th>
                      <th style={{ padding: '10px', borderBottom: '2px solid #333', textAlign: 'center' }}>{calculoChi2.labelC1}</th>
                      <th style={{ padding: '10px', borderBottom: '2px solid #333', textAlign: 'center' }}>{calculoChi2.labelC2}</th>
                      <th style={{ padding: '10px', borderBottom: '2px solid #333', textAlign: 'center', fontWeight: 'bold', color: '#aaa' }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '12px 10px', borderBottom: '1px solid #222', fontWeight: 'bold' }}>{calculoChi2.labelF1}</td>
                      <td style={{ padding: '12px 10px', borderBottom: '1px solid #222', textAlign: 'center' }}>
                        <div style={{ fontSize: '16px', fontWeight: '500' }}>{calculoChi2.obs.o11}</div>
                        <div style={{ fontSize: '11px', color: '#888' }}>esp: {calculoChi2.esp.e11.toFixed(2)}</div>
                      </td>
                      <td style={{ padding: '12px 10px', borderBottom: '1px solid #222', textAlign: 'center' }}>
                        <div style={{ fontSize: '16px', fontWeight: '500' }}>{calculoChi2.obs.o12}</div>
                        <div style={{ fontSize: '11px', color: '#888' }}>esp: {calculoChi2.esp.e12.toFixed(2)}</div>
                      </td>
                      <td style={{ padding: '12px 10px', borderBottom: '1px solid #222', textAlign: 'center', fontWeight: 'bold', color: '#aaa' }}>{calculoChi2.totalF1}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '12px 10px', borderBottom: '1px solid #222', fontWeight: 'bold' }}>{calculoChi2.labelF2}</td>
                      <td style={{ padding: '12px 10px', borderBottom: '1px solid #222', textAlign: 'center' }}>
                        <div style={{ fontSize: '16px', fontWeight: '500' }}>{calculoChi2.obs.o21}</div>
                        <div style={{ fontSize: '11px', color: '#888' }}>esp: {calculoChi2.esp.e21.toFixed(2)}</div>
                      </td>
                      <td style={{ padding: '12px 10px', borderBottom: '1px solid #222', textAlign: 'center' }}>
                        <div style={{ fontSize: '16px', fontWeight: '500' }}>{calculoChi2.obs.o22}</div>
                        <div style={{ fontSize: '11px', color: '#888' }}>esp: {calculoChi2.esp.e22.toFixed(2)}</div>
                      </td>
                      <td style={{ padding: '12px 10px', borderBottom: '1px solid #222', textAlign: 'center', fontWeight: 'bold', color: '#aaa' }}>{calculoChi2.totalF2}</td>
                    </tr>
                    <tr style={{ backgroundColor: '#1a1a1a' }}>
                      <td style={{ padding: '10px', fontWeight: 'bold', color: '#aaa' }}>Total</td>
                      <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: '#aaa' }}>{calculoChi2.totalC1}</td>
                      <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: '#aaa' }}>{calculoChi2.totalC2}</td>
                      <td style={{ padding: '10px', textAlign: 'center', fontWeight: 'bold', color: '#fff' }}>{calculoChi2.totalN}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* TABLA DE PARÁMETROS ESTADÍSTICOS */}
            <div style={{ backgroundColor: '#141414', border: '1px solid #2c2c2c', borderRadius: '10px', padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: '600', marginBottom: '15px', borderBottom: '1px solid #2c2c2c', paddingBottom: '8px' }}>
                  Parámetros del Análisis Estadístico
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #222' }}>
                    <span style={{ color: '#888' }}>Grados de libertad (gl)</span>
                    <span style={{ color: '#fff', fontWeight: 'bold' }}>{calculoChi2.gl}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #222' }}>
                    <span style={{ color: '#888' }}>Nivel de Confianza (P)</span>
                    <span style={{ color: '#fff', fontWeight: 'bold' }}>{(calculoChi2.pValorConfianza * 100).toFixed(0)}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #222' }}>
                    <span style={{ color: '#888' }}>Nivel de Significancia (α)</span>
                    <span style={{ color: '#fff', fontWeight: 'bold' }}>0.05</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #222' }}>
                    <span style={{ color: '#888' }}>Valor crítico de tabla</span>
                    <span style={{ color: '#64b5f6', fontWeight: 'bold' }}>{calculoChi2.valorCritico.toFixed(3)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #222' }}>
                    <span style={{ color: '#888' }}>Chi-cuadrado calculado (X²)</span>
                    <span style={{ color: '#e57373', fontWeight: 'bold' }}>{calculoChi2.chiTotal.toFixed(6)}</span>
                  </div>
                </div>
              </div>

              {/* RESULTADO DE LA COMPARACIÓN */}
              <div style={{ marginTop: '20px', padding: '12px 15px', backgroundColor: '#1a1a1a', borderRadius: '8px', border: '1px solid #333', textAlign: 'center' }}>
                <span style={{ fontSize: '13px', color: '#aaa' }}>Comparación: </span>
                <strong style={{ fontSize: '14px', color: '#fff' }}>{calculoChi2.chiTotal.toFixed(4)}</strong>
                <span style={{ fontSize: '13px', color: '#aaa' }}> {calculoChi2.seRechazaH0 ? '>' : '≤'} </span>
                <strong style={{ fontSize: '14px', color: '#64b5f6' }}>{calculoChi2.valorCritico.toFixed(3)}</strong>
              </div>
            </div>
          </div>

          {/* DETALLE DE CÁLCULO CELDA POR CELDA */}
          <div style={{ ...s.card, backgroundColor: '#141414', border: '1px solid #2c2c2c', marginBottom: '25px' }}>
            <h4 style={{ color: '#fff', fontSize: '15px', fontWeight: '600', marginBottom: '15px', borderBottom: '1px solid #2c2c2c', paddingBottom: '8px' }}>
              Cálculos analíticos intermedios (celda por celda)
            </h4>
            <div className="tabla-wrap-siempre">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', color: '#fff' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #333' }}>
                    <th style={{ padding: '8px 10px', textAlign: 'left', color: '#888' }}>Celda (Fila x Columna)</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', color: '#888' }}>Obs (O)</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', color: '#888' }}>Esp (E)</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', color: '#888' }}>(O - E)</th>
                    <th style={{ padding: '8px 10px', textAlign: 'center', color: '#888' }}>(O - E)²</th>
                    <th style={{ padding: '8px 10px', textAlign: 'right', color: '#fff', fontWeight: 'bold' }}>(O - E)² / E</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: `${calculoChi2.labelF1} ∩ ${calculoChi2.labelC1}`, o: calculoChi2.obs.o11, e: calculoChi2.esp.e11, chi: calculoChi2.parc.chi11 },
                    { label: `${calculoChi2.labelF1} ∩ ${calculoChi2.labelC2}`, o: calculoChi2.obs.o12, e: calculoChi2.esp.e12, chi: calculoChi2.parc.chi12 },
                    { label: `${calculoChi2.labelF2} ∩ ${calculoChi2.labelC1}`, o: calculoChi2.obs.o21, e: calculoChi2.esp.e21, chi: calculoChi2.parc.chi21 },
                    { label: `${calculoChi2.labelF2} ∩ ${calculoChi2.labelC2}`, o: calculoChi2.obs.o22, e: calculoChi2.esp.e22, chi: calculoChi2.parc.chi22 },
                  ].map((row, i) => {
                    const dif = row.o - row.e
                    const difSq = Math.pow(dif, 2)
                    return (
                      <tr key={i} style={{ borderBottom: '1px solid #222' }}>
                        <td style={{ padding: '10px', color: '#ccc', fontWeight: '500' }}>{row.label}</td>
                        <td style={{ padding: '10px', textAlign: 'center' }}>{row.o}</td>
                        <td style={{ padding: '10px', textAlign: 'center', color: '#aaa' }}>{row.e.toFixed(4)}</td>
                        <td style={{ padding: '10px', textAlign: 'center', color: dif >= 0 ? '#81c784' : '#e57373' }}>{dif.toFixed(4)}</td>
                        <td style={{ padding: '10px', textAlign: 'center', color: '#aaa' }}>{difSq.toFixed(4)}</td>
                        <td style={{ padding: '10px', textAlign: 'right', fontWeight: 'bold', color: '#e57373' }}>{row.chi.toFixed(6)}</td>
                      </tr>
                    )
                  })}
                  <tr style={{ backgroundColor: '#1a1a1a', fontWeight: 'bold' }}>
                    <td style={{ padding: '10px', color: '#fff' }}>Suma Total (Chi-cuadrado calculado)</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>{calculoChi2.totalN}</td>
                    <td style={{ padding: '10px', textAlign: 'center', color: '#aaa' }}>{calculoChi2.totalN.toFixed(4)}</td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>0.0000</td>
                    <td style={{ padding: '10px', textAlign: 'center', color: '#aaa' }}>—</td>
                    <td style={{ padding: '10px', textAlign: 'right', color: '#e57373', fontSize: '15px' }}>{calculoChi2.chiTotal.toFixed(6)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* CUADRO DE CONCLUSIÓN */}
          <div style={{
            padding: '24px 30px',
            borderRadius: '12px',
            border: `1px solid ${calculoChi2.seRechazaH0 ? '#5a1a1a' : '#1a5a1a'}`,
            backgroundColor: calculoChi2.seRechazaH0 ? '#2a0a0a' : '#0a2a0a',
            boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
              <span style={{ fontSize: '28px' }}>{calculoChi2.seRechazaH0 ? '🚨' : '✅'}</span>
              <h4 style={{ color: '#fff', fontSize: '18px', fontWeight: '600', margin: 0 }}>
                {calculoChi2.seRechazaH0 
                  ? 'Conclusión: Existe Relación Significativa (Se rechaza H₀)' 
                  : 'Conclusión: Independencia de Variables (Se acepta H₀)'}
              </h4>
            </div>
            
            <div style={{ fontSize: '15px', lineHeight: '1.6', color: '#ddd' }}>
              {calculoChi2.seRechazaH0 ? (
                <>
                  Dado que el valor de Chi-cuadrado calculado (<strong style={{ color: '#ff8a80' }}>{calculoChi2.chiTotal.toFixed(4)}</strong>) es <strong>mayor</strong> que el valor crítico de la tabla (<strong style={{ color: '#64b5f6' }}>{calculoChi2.valorCritico.toFixed(3)}</strong>), <strong>se rechaza la hipótesis nula (H₀)</strong> y <strong>se acepta la hipótesis alternativa (H₁)</strong>.
                  <br /><br />
                  Esto significa estadísticamente, con un nivel de confianza del <strong>95%</strong>, que <strong>existe una relación de dependencia significativa</strong> entre las variables <strong>{varFila.split(' (')[0]}</strong> y <strong>{varColumna.split(' (')[0]}</strong> en el grupo estudiado.
                </>
              ) : (
                <>
                  Dado que el valor de Chi-cuadrado calculado (<strong style={{ color: '#ff8a80' }}>{calculoChi2.chiTotal.toFixed(4)}</strong>) es <strong>menor o igual</strong> que el valor crítico de la tabla (<strong style={{ color: '#64b5f6' }}>{calculoChi2.valorCritico.toFixed(3)}</strong>), <strong>no se puede rechazar la hipótesis nula (H₀)</strong>.
                  <br /><br />
                  Esto significa estadísticamente, con un nivel de confianza del <strong>95%</strong>, que <strong>las variables son independientes</strong> y no se puede afirmar que exista una relación o asociación significativa entre <strong>{varFila.split(' (')[0]}</strong> y <strong>{varColumna.split(' (')[0]}</strong>.
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
