import { useState, useCallback } from 'react'

export default function useChi2() {
  const [varFila, setVarFila] = useState('')
  const [varColumna, setVarColumna] = useState('')
  const [calculoChi2, setCalculoChi2] = useState(null)

  const calcularPruebaChi2 = useCallback((pacientes, exploraciones, historias, analisis) => {
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
      setCalculoChi2(null)
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
    } else if (varColumna.includes('Sí / No)')) {
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

    const o11 = datosCruzados.filter(x => x.filaVal === f1 && x.colVal === c1).length
    const o12 = datosCruzados.filter(x => x.filaVal === f1 && x.colVal === c2).length
    const o21 = datosCruzados.filter(x => x.filaVal === f2 && x.colVal === c1).length
    const o22 = datosCruzados.filter(x => x.filaVal === f2 && x.colVal === c2).length

    const totalF1 = o11 + o12
    const totalF2 = o21 + o22
    const totalC1 = o11 + o21
    const totalC2 = o12 + o22

    const e11 = totalN > 0 ? (totalF1 * totalC1) / totalN : 0
    const e12 = totalN > 0 ? (totalF1 * totalC2) / totalN : 0
    const e21 = totalN > 0 ? (totalF2 * totalC1) / totalN : 0
    const e22 = totalN > 0 ? (totalF2 * totalC2) / totalN : 0

    const chi11 = e11 > 0 ? Math.pow(o11 - e11, 2) / e11 : 0
    const chi12 = e12 > 0 ? Math.pow(o12 - e12, 2) / e12 : 0
    const chi21 = e21 > 0 ? Math.pow(o21 - e21, 2) / e21 : 0
    const chi22 = e22 > 0 ? Math.pow(o22 - e22, 2) / e22 : 0

    const chiTotal = chi11 + chi12 + chi21 + chi22
    const gl = 1
    const pValorConfianza = 0.95
    const valorCritico = 3.841
    const seRechazaH0 = chiTotal > valorCritico

    setCalculoChi2({
      totalN,
      f1, f2, c1, c2,
      labelF1: getEtiquetaFila(f1),
      labelF2: getEtiquetaFila(f2),
      labelC1: getEtiquetaCol(c1),
      labelC2: getEtiquetaCol(c2),
      obs: { o11, o12, o21, o22 },
      esp: { e11, e12, e21, e22 },
      parc: { chi11, chi12, chi21, chi22 },
      totalF1, totalF2, totalC1, totalC2,
      chiTotal,
      gl,
      pValorConfianza,
      valorCritico,
      seRechazaH0
    })
  }, [varFila, varColumna])

  return {
    varFila,
    setVarFila,
    varColumna,
    setVarColumna,
    calculoChi2,
    setCalculoChi2,
    calcularPruebaChi2
  }
}
