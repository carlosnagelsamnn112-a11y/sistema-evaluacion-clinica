import { useState, useCallback } from 'react'

export default function useOddsRatio() {
  const [varFila, setVarFila] = useState('')
  const [varColumna, setVarColumna] = useState('')
  const [calculoOR, setCalculoOR] = useState(null)

  const calcularOddsRatio = useCallback((pacientes, exploraciones, historias, analisis) => {
    if (!varFila || !varColumna) {
      alert('Por favor seleccione ambas variables.')
      return
    }

    let datosCruzados = []

    pacientes.forEach(p => {
      const e = exploraciones.find(x => x.cedula == p.cedula)
      if (!e) return

      const h = historias.find(x => x.cedula == p.cedula)
      const a = analisis.find(x => x.cedula == p.cedula)

      let valFila = null
      let labelFila = ''

      if (varFila === 'Lesiones orales (Sí / No)') {
        if (e.presenta_lesiones === 'Sí' || e.presenta_lesiones === 'No') {
          valFila = e.presenta_lesiones
          labelFila = e.presenta_lesiones === 'Sí' ? 'Con lesión' : 'Sin lesión'
        }
      } else if (varFila === 'Lesión en labios (Sí / No)') {
        if (e.mordedura_labios === 'Sí' || e.mordedura_labios === 'No') {
          valFila = e.mordedura_labios
          labelFila = e.mordedura_labios === 'Sí' ? 'Lesión en labios' : 'Sin lesión en labios'
        }
      } else if (varFila === 'Lesión en mejillas (Sí / No)') {
        if (e.mordedura_mejillas === 'Sí' || e.mordedura_mejillas === 'No') {
          valFila = e.mordedura_mejillas
          labelFila = e.mordedura_mejillas === 'Sí' ? 'Lesión en mejillas' : 'Sin lesión en mejillas'
        }
      } else if (varFila === 'Lesión en lengua (Sí / No)') {
        if (e.mordedura_lengua === 'Sí' || e.mordedura_lengua === 'No') {
          valFila = e.mordedura_lengua
          labelFila = e.mordedura_lengua === 'Sí' ? 'Lesión en lengua' : 'Sin lesión en lengua'
        }
      }

      if (valFila === null) return

      let valCol = null
      let labelCol = ''

      if (varColumna === 'Edad (Menor / Mayor de edad)') {
        if (h && h.edad !== undefined && h.edad !== null) {
          const esMenor = h.edad < 18
          valCol = esMenor ? 'Menor' : 'Mayor'
          labelCol = esMenor ? 'Menor de edad' : 'Mayor de edad'
        }
      } else if (varColumna === 'Sexo') {
        if (h && (h.sexo === 'Masculino' || h.sexo === 'Femenino')) {
          valCol = h.sexo
          labelCol = h.sexo
        }
      } else if (varColumna === 'Área de la universidad') {
        if (h && (h.area === 'Preclínica' || h.area === 'Clínica')) {
          valCol = h.area
          labelCol = h.area
        }
      } else if (varColumna === 'Enfermedades sistémicas (Sí / No)') {
        if (h && (h.enfermedades_sistemicas === 'Sí' || h.enfermedades_sistemicas === 'No')) {
          valCol = h.enfermedades_sistemicas
          labelCol = h.enfermedades_sistemicas === 'Sí' ? 'Con enfermedad' : 'Sin enfermedad'
        }
      } else if (varColumna === 'Consumo de medicamentos (Sí / No)') {
        if (h && (h.toma_medicamentos === 'Sí' || h.toma_medicamentos === 'No')) {
          valCol = h.toma_medicamentos
          labelCol = h.toma_medicamentos === 'Sí' ? 'Consume medicamentos' : 'No consume medicamentos'
        }
      } else if (varColumna === 'Antecedentes psicológicos (Sí / No)') {
        if (h && (h.antecedentes_psicologicos === 'Sí' || h.antecedentes_psicologicos === 'No')) {
          valCol = h.antecedentes_psicologicos
          labelCol = h.antecedentes_psicologicos === 'Sí' ? 'Con antecedentes' : 'Sin antecedentes'
        }
      } else if (varColumna === 'Sustancias psicoactivas (Sí / No)') {
        if (h && (h.sustancias_psicoactivas === 'Sí' || h.sustancias_psicoactivas === 'No')) {
          valCol = h.sustancias_psicoactivas
          labelCol = h.sustancias_psicoactivas === 'Sí' ? 'Consume SPA' : 'No consume SPA'
        }
      } else if (varColumna === 'Hábito de fumar (Sí / No)') {
        if (h) {
          const fuma = h.fuma_cigarrillo_vape === 'Cigarrillo' || h.fuma_cigarrillo_vape === 'Las dos'
          valCol = fuma ? 'Sí' : 'No'
          labelCol = fuma ? 'Fuma' : 'No fuma'
        }
      } else if (varColumna === 'Hábito de vape (Sí / No)') {
        if (h) {
          const vape = h.fuma_cigarrillo_vape === 'Vape' || h.fuma_cigarrillo_vape === 'Las dos'
          valCol = vape ? 'Sí' : 'No'
          labelCol = vape ? 'Usa vape' : 'No usa vape'
        }
      } else if (varColumna === 'Trastorno psicológico (Sí / No)') {
        if (a && a.interpretacion_depresion && a.interpretacion_ansiedad && a.interpretacion_estres) {
          const tiene = a.interpretacion_depresion !== 'Normal' || a.interpretacion_ansiedad !== 'Normal' || a.interpretacion_estres !== 'Normal'
          valCol = tiene ? 'Sí' : 'No'
          labelCol = tiene ? 'Con trastorno psicológico' : 'Sin trastorno psicológico'
        }
      } else if (varColumna === 'Depresión (Sí / No)') {
        if (a && a.interpretacion_depresion) {
          const tiene = a.interpretacion_depresion !== 'Normal'
          valCol = tiene ? 'Sí' : 'No'
          labelCol = tiene ? 'Con depresión' : 'Sin depresión'
        }
      } else if (varColumna === 'Ansiedad (Sí / No)') {
        if (a && a.interpretacion_ansiedad) {
          const tiene = a.interpretacion_ansiedad !== 'Normal'
          valCol = tiene ? 'Sí' : 'No'
          labelCol = tiene ? 'Con ansiedad' : 'Sin ansiedad'
        }
      } else if (varColumna === 'Estrés (Sí / No)') {
        if (a && a.interpretacion_estres) {
          const tiene = a.interpretacion_estres !== 'Normal'
          valCol = tiene ? 'Sí' : 'No'
          labelCol = tiene ? 'Con estrés' : 'Sin estrés'
        }
      }

      if (valCol === null) return

      datosCruzados.push({
        cedula: p.cedula,
        filaVal: valFila,
        filaLabel: labelFila,
        colVal: valCol,
        colLabel: labelCol
      })
    })

    const totalN = datosCruzados.length
    if (totalN < 2) {
      alert(`No hay suficientes datos cruzados para calcular la prueba (Total pacientes válidos: ${totalN}).`)
      setCalculoOR(null)
      return
    }

    const catFilas = ['Sí', 'No']
    let catCols = []
    if (varColumna === 'Edad (Menor / Mayor de edad)') {
      catCols = ['Menor', 'Mayor']
    } else if (varColumna === 'Sexo') {
      catCols = ['Masculino', 'Femenino']
    } else if (varColumna === 'Área de la universidad') {
      catCols = ['Preclínica', 'Clínica']
    } else {
      catCols = ['Sí', 'No']
    }

    const getEtiquetaFila = (cat) => {
      if (varFila === 'Lesiones orales (Sí / No)') return cat === 'Sí' ? 'Con lesión' : 'Sin lesión'
      if (varFila === 'Lesión en labios (Sí / No)') return cat === 'Sí' ? 'Con lesión labial' : 'Sin lesión labial'
      if (varFila === 'Lesión en mejillas (Sí / No)') return cat === 'Sí' ? 'Con lesión en mejillas' : 'Sin lesión en mejillas'
      if (varFila === 'Lesión en lengua (Sí / No)') return cat === 'Sí' ? 'Con lesión en lengua' : 'Sin lesión en lengua'
      return cat
    }

    const getEtiquetaCol = (cat) => {
      if (varColumna === 'Edad (Menor / Mayor de edad)') return cat === 'Menor' ? 'Menor de edad' : 'Mayor de edad'
      if (varColumna === 'Sexo') return cat
      if (varColumna === 'Área de la universidad') return cat
      if (varColumna === 'Enfermedades sistémicas (Sí / No)') return cat === 'Sí' ? 'Con enfermedad' : 'Sin enfermedad'
      if (varColumna === 'Consumo de medicamentos (Sí / No)') return cat === 'Sí' ? 'Consume medicamentos' : 'No consume medicamentos'
      if (varColumna === 'Antecedentes psicológicos (Sí / No)') return cat === 'Sí' ? 'Con antecedentes' : 'Sin antecedentes'
      if (varColumna === 'Sustancias psicoactivas (Sí / No)') return cat === 'Sí' ? 'Consume SPA' : 'No consume SPA'
      if (varColumna === 'Hábito de fumar (Sí / No)') return cat === 'Sí' ? 'Fuma' : 'No fuma'
      if (varColumna === 'Hábito de vape (Sí / No)') return cat === 'Sí' ? 'Usa vape' : 'No usa vape'
      if (varColumna === 'Trastorno psicológico (Sí / No)') return cat === 'Sí' ? 'Con trastorno psicológico' : 'Sin trastorno psicológico'
      if (varColumna === 'Depresión (Sí / No)') return cat === 'Sí' ? 'Con depresión' : 'Sin depresión'
      if (varColumna === 'Ansiedad (Sí / No)') return cat === 'Sí' ? 'Con ansiedad' : 'Sin ansiedad'
      if (varColumna === 'Estrés (Sí / No)') return cat === 'Sí' ? 'Con estrés' : 'Sin estrés'
      return cat
    }

    const f1 = catFilas[0], f2 = catFilas[1]
    const c1 = catCols[0], c2 = catCols[1]

    let a = datosCruzados.filter(x => x.filaVal === f1 && x.colVal === c1).length
    let b = datosCruzados.filter(x => x.filaVal === f1 && x.colVal === c2).length
    let c = datosCruzados.filter(x => x.filaVal === f2 && x.colVal === c1).length
    let d = datosCruzados.filter(x => x.filaVal === f2 && x.colVal === c2).length

    const totalF1 = a + b
    const totalF2 = c + d
    const totalC1 = a + c
    const totalC2 = b + d

    // Corrección de Haldane-Anscombe si alguna celda es 0 para evitar división por cero o Ln(0)
    let aCalc = a, bCalc = b, cCalc = c, dCalc = d
    let aplicoHaldane = false
    if (a === 0 || b === 0 || c === 0 || d === 0) {
      aCalc += 0.5
      bCalc += 0.5
      cCalc += 0.5
      dCalc += 0.5
      aplicoHaldane = true
    }

    const oddsRatio = (aCalc * dCalc) / (bCalc * cCalc)
    const logOR = Math.log(oddsRatio)
    const seLogOR = Math.sqrt((1 / aCalc) + (1 / bCalc) + (1 / cCalc) + (1 / dCalc))
    const z = 1.96

    const icLower = Math.exp(logOR - (z * seLogOR))
    const icUpper = Math.exp(logOR + (z * seLogOR))

    // Determinar significancia estadística al 95%
    // Si el intervalo de confianza de 95% no incluye 1.0 (icLower > 1 o icUpper < 1)
    const esSignificativo = (icLower > 1.0 && icUpper > 1.0) || (icLower < 1.0 && icUpper < 1.0)
    const esFactorRiesgo = icLower > 1.0
    const esFactorProtector = icUpper < 1.0

    setCalculoOR({
      totalN,
      f1, f2, c1, c2,
      labelF1: getEtiquetaFila(f1),
      labelF2: getEtiquetaFila(f2),
      labelC1: getEtiquetaCol(c1),
      labelC2: getEtiquetaCol(c2),
      a, b, c, d,
      aCalc, bCalc, cCalc, dCalc,
      aplicoHaldane,
      totalF1, totalF2, totalC1, totalC2,
      oddsRatio,
      logOR,
      seLogOR,
      icLower,
      icUpper,
      esSignificativo,
      esFactorRiesgo,
      esFactorProtector
    })
  }, [varFila, varColumna])

  return {
    varFila,
    setVarFila,
    varColumna,
    setVarColumna,
    calculoOR,
    setCalculoOR,
    calcularOddsRatio
  }
}
