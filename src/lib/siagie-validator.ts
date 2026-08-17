import * as XLSX from 'xlsx'
import { dataStore } from './mock-data'

export interface SIAGIEInconsistencia {
  id: string
  tipo: 'error' | 'warning'
  alumno: string
  seccion: string
  dni: string
  descripcion: string
  accionSugerida: string
}

export interface SIAGIEValidacionResultado {
  esValido: boolean
  totalAlumnos: number
  totalErrores: number
  totalAdvertencias: number
  inconsistencias: SIAGIEInconsistencia[]
  periodo: string
  anio: number
}

export function validarDatosSIAGIE(seccionId?: string, periodo = 'Bimestre 1'): SIAGIEValidacionResultado {
  let alumnos = dataStore.getAlumnos()
  const notas = dataStore.getNotas()
  const secciones = dataStore.getSecciones()

  if (seccionId && seccionId !== 'todas') {
    alumnos = alumnos.filter(a => a.seccion_id === seccionId)
  }

  const inconsistencias: SIAGIEInconsistencia[] = []

  alumnos.forEach((alumno) => {
    const seccionObj = secciones.find(s => s.id === alumno.seccion_id)
    const seccionNombre = seccionObj ? seccionObj.nombre : alumno.seccion_nombre || 'Sin sección'

    // 1. Validar DNI (8 dígitos exactos)
    if (!alumno.dni || alumno.dni.length !== 8 || !/^\d{8}$/.test(alumno.dni)) {
      inconsistencias.push({
        id: `err-dni-${alumno.id}`,
        tipo: 'error',
        alumno: `${alumno.apellidos}, ${alumno.nombres}`,
        seccion: seccionNombre,
        dni: alumno.dni || 'SIN DNI',
        descripcion: 'El DNI no cuenta con los 8 dígitos numéricos válidos requeridos por el MINEDU.',
        accionSugerida: 'Editar el expediente del alumno y registrar el DNI emitido por RENIEC.',
      })
    }

    // 2. Validar Código de Estudiante
    if (!alumno.codigo_estudiante || !alumno.codigo_estudiante.startsWith('EST-')) {
      inconsistencias.push({
        id: `warn-cod-${alumno.id}`,
        tipo: 'warning',
        alumno: `${alumno.apellidos}, ${alumno.nombres}`,
        seccion: seccionNombre,
        dni: alumno.dni,
        descripcion: 'Código de estudiante temporal no homologado con el padrón del MINEDU.',
        accionSugerida: 'Generar código definitivo en la sección de matrícula.',
      })
    }

    // 3. Validar Notas del Periodo
    const notasAlumno = notas.filter(n => n.alumno_id === alumno.id && n.periodo === periodo)
    if (notasAlumno.length === 0) {
      inconsistencias.push({
        id: `err-not-${alumno.id}`,
        tipo: 'error',
        alumno: `${alumno.apellidos}, ${alumno.nombres}`,
        seccion: seccionNombre,
        dni: alumno.dni,
        descripcion: `No se han registrado evaluaciones en ninguna competencia para el ${periodo}.`,
        accionSugerida: 'Solicitar a los docentes de área completar el llenado de notas.',
      })
    }
  })

  const totalErrores = inconsistencias.filter(i => i.tipo === 'error').length
  const totalAdvertencias = inconsistencias.filter(i => i.tipo === 'warning').length

  return {
    esValido: totalErrores === 0,
    totalAlumnos: alumnos.length,
    totalErrores,
    totalAdvertencias,
    inconsistencias,
    periodo,
    anio: 2026,
  }
}

export function exportarExcelSIAGIE(seccionId?: string, periodo = 'Bimestre 1') {
  let alumnos = dataStore.getAlumnos()
  const notas = dataStore.getNotas()
  const secciones = dataStore.getSecciones()

  if (seccionId && seccionId !== 'todas') {
    alumnos = alumnos.filter(a => a.seccion_id === seccionId)
  }

  // Estructura oficial formato MINEDU SIAGIE v3.0
  const excelData = alumnos.map((alumno, idx) => {
    const seccionObj = secciones.find(s => s.id === alumno.seccion_id)
    const notasAlumno = notas.filter(n => n.alumno_id === alumno.id && n.periodo === periodo)
    const partesApellido = alumno.apellidos.split(' ')
    const paterno = partesApellido[0] || alumno.apellidos
    const materno = partesApellido.slice(1).join(' ') || ''

    const notaMat = notasAlumno.find(n => n.seccion_curso_id.includes('mat'))?.calificacion || 'A'
    const notaCom = notasAlumno.find(n => n.seccion_curso_id.includes('com'))?.calificacion || 'A'

    return {
      'N°': idx + 1,
      'CÓDIGO MODULAR': '0349281',
      'ANEXO': '0',
      'NIVEL EDUCATIVO': seccionObj?.nivel || 'Primaria',
      'GRADO': seccionObj?.grado || '3ro',
      'SECCIÓN': seccionObj?.nombre?.split(' ')[1] || 'A',
      'TIPO DOC': 'DNI',
      'NUMERO DOCUMENTO': alumno.dni,
      'APELLIDO PATERNO': paterno,
      'APELLIDO MATERNO': materno,
      'NOMBRES': alumno.nombres,
      'SEXO': alumno.genero || 'M',
      'FECHA NACIMIENTO': alumno.fecha_nacimiento,
      'ESTADO MATRICULA': 'Definitiva',
      'COMPETENCIA 1 (MAT)': notaMat,
      'COMPETENCIA 2 (COM)': notaCom,
      'PERIODO EVALUACION': periodo,
      'AÑO ESCOLAR': 2026,
    }
  })

  // Crear libro de trabajo
  const worksheet = XLSX.utils.json_to_sheet(excelData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'SIAGIE_OFICIAL_2026')

  // Ajustar anchos de columna
  worksheet['!cols'] = [
    { wch: 5 },  // N
    { wch: 16 }, // Cod Modular
    { wch: 8 },  // Anexo
    { wch: 15 }, // Nivel
    { wch: 8 },  // Grado
    { wch: 10 }, // Sección
    { wch: 10 }, // Tipo doc
    { wch: 18 }, // Numero doc
    { wch: 20 }, // Apellido pat
    { wch: 20 }, // Apellido mat
    { wch: 22 }, // Nombres
    { wch: 6 },  // Sexo
    { wch: 16 }, // Fecha nac
    { wch: 16 }, // Estado mat
    { wch: 20 }, // Mat
    { wch: 20 }, // Com
    { wch: 18 }, // Periodo
    { wch: 12 }, // Año
  ]

  // Descargar archivo Excel en el cliente
  const fileName = `SIAGIE_SedesSapientiae_2026_${periodo.replace(/\s+/g, '_')}.xlsx`
  XLSX.writeFile(workbook, fileName)
}
