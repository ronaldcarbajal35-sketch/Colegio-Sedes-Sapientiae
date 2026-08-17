// Mock Data & Interactive Store for Demo and Fallback in Colegio Sedes Sapientiae

export interface Perfil {
  id: string
  nombre: string
  email: string
  rol: 'direccion' | 'secretaria' | 'docente' | 'padre'
  telefono?: string
  avatar_url?: string
}

export interface Seccion {
  id: string
  nombre: string
  grado: string
  nivel: 'Inicial' | 'Primaria' | 'Secundaria'
  anio_escolar: number
  capacidad: number
  tutor_nombre?: string
}

export interface Curso {
  id: string
  nombre: string
  area_curricular: string
}

export interface SeccionCurso {
  id: string
  seccion_id: string
  curso_id: string
  docente_id: string
  seccion_nombre: string
  curso_nombre: string
  docente_nombre: string
  horas_semanales: number
}

export interface Alumno {
  id: string
  nombres: string
  apellidos: string
  dni: string
  fecha_nacimiento: string
  genero: 'M' | 'F'
  apoderado_id: string
  apoderado_nombre?: string
  apoderado_telefono?: string
  seccion_id: string
  seccion_nombre?: string
  codigo_estudiante: string
  avatar?: string
}

export interface Matricula {
  id: string
  alumno_id: string
  alumno_nombre: string
  dni: string
  grado_postula: string
  nivel: 'Inicial' | 'Primaria' | 'Secundaria'
  anio_escolar: number
  estado: 'postulante' | 'en_evaluacion' | 'matriculado' | 'retirado'
  documentos: string[]
  ficha_pdf_url?: string
  observaciones?: string
  costo_matricula: number
  created_at: string
}

export interface Nota {
  id: string
  alumno_id: string
  seccion_curso_id: string
  competencia: string
  calificacion: 'AD' | 'A' | 'B' | 'C'
  periodo: string
  conclusiones_descriptivas?: string
  sync_status: 'synced' | 'pending' | 'conflict'
  updated_at: string
}

export interface Asistencia {
  id: string
  alumno_id: string
  seccion_curso_id: string
  fecha: string
  estado: 'presente' | 'tardanza' | 'falta' | 'justificado'
  justificacion?: string
  sync_status: 'synced' | 'pending' | 'conflict'
}

export interface Pago {
  id: string
  alumno_id: string
  alumno_nombre: string
  concepto: string
  monto: number
  mora: number
  estado: 'pendiente' | 'pagado' | 'vencido' | 'anulado'
  fecha_vencimiento: string
  fecha_pago?: string
  metodo_pago?: 'culqi' | 'yape_manual' | 'plin_manual' | 'efectivo'
  culqi_charge_id?: string
  comprobante_url?: string
}

export interface Comunicado {
  id: string
  titulo: string
  contenido: string
  categoria: 'Circular' | 'Evento' | 'Aviso urgente' | 'Académico'
  destinatarios: string
  autor_nombre: string
  enviar_whatsapp: boolean
  whatsapp_enviados: number
  created_at: string
}

export const INITIAL_SECCIONES: Seccion[] = [
  { id: 'sec-3a-pri', nombre: '3ro A Primaria', grado: '3ro', nivel: 'Primaria', anio_escolar: 2026, capacidad: 25, tutor_nombre: 'Prof. Carlos García' },
  { id: 'sec-5b-sec', nombre: '5to B Secundaria', grado: '5to', nivel: 'Secundaria', anio_escolar: 2026, capacidad: 28, tutor_nombre: 'Prof. Laura Méndez' },
  { id: 'sec-1a-sec', nombre: '1ro A Secundaria', grado: '1ro', nivel: 'Secundaria', anio_escolar: 2026, capacidad: 30, tutor_nombre: 'Prof. Carlos García' },
  { id: 'sec-4a-pri', nombre: '4to A Primaria', grado: '4to', nivel: 'Primaria', anio_escolar: 2026, capacidad: 25, tutor_nombre: 'Prof. Laura Méndez' },
]

export const INITIAL_CURSOS: Curso[] = [
  { id: 'cur-mat', nombre: 'Matemática', area_curricular: 'Ciencias' },
  { id: 'cur-com', nombre: 'Comunicación Integral', area_curricular: 'Humanidades' },
  { id: 'cur-cyt', nombre: 'Ciencia y Tecnología', area_curricular: 'Ciencias' },
  { id: 'cur-ing', nombre: 'Inglés Técnico', area_curricular: 'Idiomas' },
  { id: 'cur-soc', nombre: 'Ciencias Sociales', area_curricular: 'Humanidades' },
]

export const INITIAL_SECCIONES_CURSOS: SeccionCurso[] = [
  { id: 'sc-3a-mat', seccion_id: 'sec-3a-pri', curso_id: 'cur-mat', docente_id: 'usr-doc-1', seccion_nombre: '3ro A Primaria', curso_nombre: 'Matemática', docente_nombre: 'Prof. Carlos Alberto García Silva', horas_semanales: 6 },
  { id: 'sc-3a-com', seccion_id: 'sec-3a-pri', curso_id: 'cur-com', docente_id: 'usr-doc-2', seccion_nombre: '3ro A Primaria', curso_nombre: 'Comunicación Integral', docente_nombre: 'Prof. Laura Méndez Castillo', horas_semanales: 5 },
  { id: 'sc-5b-mat', seccion_id: 'sec-5b-sec', curso_id: 'cur-mat', docente_id: 'usr-doc-1', seccion_nombre: '5to B Secundaria', curso_nombre: 'Matemática', docente_nombre: 'Prof. Carlos Alberto García Silva', horas_semanales: 6 },
  { id: 'sc-1a-mat', seccion_id: 'sec-1a-sec', curso_id: 'cur-mat', docente_id: 'usr-doc-1', seccion_nombre: '1ro A Secundaria', curso_nombre: 'Matemática', docente_nombre: 'Prof. Carlos Alberto García Silva', horas_semanales: 5 },
]

export const INITIAL_ALUMNOS: Alumno[] = [
  {
    id: 'alu-1',
    nombres: 'Joaquín Andrés',
    apellidos: 'Quispe Flores',
    dni: '78912345',
    fecha_nacimiento: '2016-04-12',
    genero: 'M',
    apoderado_id: 'usr-pad-1',
    apoderado_nombre: 'Ing. Roberto Quispe Mamani',
    apoderado_telefono: '987112233',
    seccion_id: 'sec-3a-pri',
    seccion_nombre: '3ro A Primaria',
    codigo_estudiante: 'EST-2026-001',
  },
  {
    id: 'alu-2',
    nombres: 'Valeria Sofía',
    apellidos: 'Quispe Flores',
    dni: '78912346',
    fecha_nacimiento: '2010-09-24',
    genero: 'F',
    apoderado_id: 'usr-pad-1',
    apoderado_nombre: 'Ing. Roberto Quispe Mamani',
    apoderado_telefono: '987112233',
    seccion_id: 'sec-5b-sec',
    seccion_nombre: '5to B Secundaria',
    codigo_estudiante: 'EST-2026-002',
  },
  {
    id: 'alu-3',
    nombres: 'Mateo Sebastián',
    apellidos: 'Flores Mendoza',
    dni: '78912347',
    fecha_nacimiento: '2016-01-18',
    genero: 'M',
    apoderado_id: 'usr-pad-2',
    apoderado_nombre: 'Dra. Carmen Rosa Flores Díaz',
    apoderado_telefono: '987445566',
    seccion_id: 'sec-3a-pri',
    seccion_nombre: '3ro A Primaria',
    codigo_estudiante: 'EST-2026-003',
  },
  {
    id: 'alu-4',
    nombres: 'Luciana María',
    apellidos: 'Sánchez Paz',
    dni: '78912348',
    fecha_nacimiento: '2016-07-03',
    genero: 'F',
    apoderado_id: 'usr-pad-2',
    apoderado_nombre: 'Dra. Carmen Rosa Flores Díaz',
    apoderado_telefono: '987445566',
    seccion_id: 'sec-3a-pri',
    seccion_nombre: '3ro A Primaria',
    codigo_estudiante: 'EST-2026-004',
  },
  {
    id: 'alu-5',
    nombres: 'Diego Alonso',
    apellidos: 'Gutiérrez Ramos',
    dni: '78912349',
    fecha_nacimiento: '2016-11-20',
    genero: 'M',
    apoderado_id: 'usr-pad-1',
    apoderado_nombre: 'Ing. Roberto Quispe Mamani',
    seccion_id: 'sec-3a-pri',
    seccion_nombre: '3ro A Primaria',
    codigo_estudiante: 'EST-2026-005',
  }
]

export const INITIAL_NOTAS: Nota[] = [
  { id: 'not-1', alumno_id: 'alu-1', seccion_curso_id: 'sc-3a-mat', competencia: 'Resuelve problemas de cantidad', calificacion: 'AD', periodo: 'Bimestre 1', conclusiones_descriptivas: 'Excelente razonamiento lógico matemático.', sync_status: 'synced', updated_at: '2026-03-20T10:00:00Z' },
  { id: 'not-2', alumno_id: 'alu-1', seccion_curso_id: 'sc-3a-mat', competencia: 'Resuelve problemas de forma y movimiento', calificacion: 'A', periodo: 'Bimestre 1', conclusiones_descriptivas: 'Demuestra destreza espacial y geométrica.', sync_status: 'synced', updated_at: '2026-03-20T10:00:00Z' },
  { id: 'not-3', alumno_id: 'alu-1', seccion_curso_id: 'sc-3a-com', competencia: 'Se comunica oralmente en su lengua materna', calificacion: 'AD', periodo: 'Bimestre 1', conclusiones_descriptivas: 'Fluidez y excelente dicción.', sync_status: 'synced', updated_at: '2026-03-20T10:00:00Z' },
  { id: 'not-4', alumno_id: 'alu-3', seccion_curso_id: 'sc-3a-mat', competencia: 'Resuelve problemas de cantidad', calificacion: 'B', periodo: 'Bimestre 1', conclusiones_descriptivas: 'Requiere reforzar tablas de multiplicación.', sync_status: 'synced', updated_at: '2026-03-20T10:00:00Z' },
  { id: 'not-5', alumno_id: 'alu-4', seccion_curso_id: 'sc-3a-mat', competencia: 'Resuelve problemas de cantidad', calificacion: 'A', periodo: 'Bimestre 1', conclusiones_descriptivas: 'Buen desempeño general.', sync_status: 'synced', updated_at: '2026-03-20T10:00:00Z' },
  { id: 'not-6', alumno_id: 'alu-5', seccion_curso_id: 'sc-3a-mat', competencia: 'Resuelve problemas de cantidad', calificacion: 'AD', periodo: 'Bimestre 1', conclusiones_descriptivas: 'Destacada participación.', sync_status: 'synced', updated_at: '2026-03-20T10:00:00Z' },
]

export const INITIAL_ASISTENCIAS: Asistencia[] = [
  { id: 'ast-1', alumno_id: 'alu-1', seccion_curso_id: 'sc-3a-mat', fecha: new Date().toISOString().split('T')[0], estado: 'presente', sync_status: 'synced' },
  { id: 'ast-2', alumno_id: 'alu-3', seccion_curso_id: 'sc-3a-mat', fecha: new Date().toISOString().split('T')[0], estado: 'tardanza', justificacion: 'Tráfico en la vía expresa', sync_status: 'synced' },
  { id: 'ast-3', alumno_id: 'alu-4', seccion_curso_id: 'sc-3a-mat', fecha: new Date().toISOString().split('T')[0], estado: 'presente', sync_status: 'synced' },
  { id: 'ast-4', alumno_id: 'alu-5', seccion_curso_id: 'sc-3a-mat', fecha: new Date().toISOString().split('T')[0], estado: 'justificado', justificacion: 'Cita médica odontológica', sync_status: 'synced' },
]

export const INITIAL_PAGOS: Pago[] = [
  { id: 'pag-1', alumno_id: 'alu-1', alumno_nombre: 'Joaquín Andrés Quispe Flores', concepto: 'Matrícula Escolar 2026', monto: 350.00, mora: 0, estado: 'pagado', fecha_vencimiento: '2026-02-15', fecha_pago: '2026-02-10T10:30:00Z', metodo_pago: 'culqi', culqi_charge_id: 'chr_test_18274619' },
  { id: 'pag-2', alumno_id: 'alu-1', alumno_nombre: 'Joaquín Andrés Quispe Flores', concepto: 'Pensión Marzo 2026', monto: 420.00, mora: 0, estado: 'pendiente', fecha_vencimiento: '2026-03-31' },
  { id: 'pag-3', alumno_id: 'alu-1', alumno_nombre: 'Joaquín Andrés Quispe Flores', concepto: 'Pensión Abril 2026', monto: 420.00, mora: 0, estado: 'pendiente', fecha_vencimiento: '2026-04-30' },
  { id: 'pag-4', alumno_id: 'alu-2', alumno_nombre: 'Valeria Sofía Quispe Flores', concepto: 'Matrícula Escolar 2026', monto: 350.00, mora: 0, estado: 'pagado', fecha_vencimiento: '2026-02-15', fecha_pago: '2026-02-11T15:45:00Z', metodo_pago: 'culqi', culqi_charge_id: 'chr_test_84729103' },
  { id: 'pag-5', alumno_id: 'alu-2', alumno_nombre: 'Valeria Sofía Quispe Flores', concepto: 'Pensión Marzo 2026', monto: 420.00, mora: 0, estado: 'pendiente', fecha_vencimiento: '2026-03-31' },
  { id: 'pag-6', alumno_id: 'alu-3', alumno_nombre: 'Mateo Sebastián Flores Mendoza', concepto: 'Pensión Marzo 2026', monto: 420.00, mora: 25.00, estado: 'vencido', fecha_vencimiento: '2026-03-10' },
]

export const INITIAL_MATRICULAS: Matricula[] = [
  { id: 'mat-1', alumno_id: 'alu-1', alumno_nombre: 'Joaquín Andrés Quispe Flores', dni: '78912345', grado_postula: '3ro Primaria', nivel: 'Primaria', anio_escolar: 2026, estado: 'matriculado', documentos: ['dni_apoderado.pdf', 'dni_menor.pdf', 'libreta_2025.pdf'], costo_matricula: 350.00, created_at: '2026-01-15' },
  { id: 'mat-2', alumno_id: 'alu-2', alumno_nombre: 'Valeria Sofía Quispe Flores', dni: '78912346', grado_postula: '5to Secundaria', nivel: 'Secundaria', anio_escolar: 2026, estado: 'matriculado', documentos: ['dni_menor.pdf', 'certificado_estudios.pdf'], costo_matricula: 350.00, created_at: '2026-01-18' },
  { id: 'mat-3', alumno_id: 'alu-3', alumno_nombre: 'Mateo Sebastián Flores Mendoza', dni: '78912347', grado_postula: '3ro Primaria', nivel: 'Primaria', anio_escolar: 2026, estado: 'matriculado', documentos: ['partida_nacimiento.pdf', 'dni_menor.pdf'], costo_matricula: 350.00, created_at: '2026-01-20' },
  { id: 'mat-4', alumno_id: 'alu-post-1', alumno_nombre: 'Camila Andrea Paredes Rios', dni: '78999123', grado_postula: '1ro Primaria', nivel: 'Primaria', anio_escolar: 2026, estado: 'en_evaluacion', documentos: ['partida_nacimiento.pdf', 'ficha_psicologica.pdf'], observaciones: 'Evaluación psicopedagógica programada para el 25 de Marzo.', costo_matricula: 350.00, created_at: '2026-02-05' },
  { id: 'mat-5', alumno_id: 'alu-post-2', alumno_nombre: 'Rodrigo Ignacio Beltrán Vera', dni: '78999456', grado_postula: '1ro Secundaria', nivel: 'Secundaria', anio_escolar: 2026, estado: 'postulante', documentos: ['dni_postulante.pdf'], observaciones: 'Pendiente entrega de certificado de conducta del colegio anterior.', costo_matricula: 350.00, created_at: '2026-02-12' },
]

export const INITIAL_COMUNICADOS: Comunicado[] = [
  {
    id: 'com-1',
    titulo: 'Inicio del Año Escolar 2026 y Ceremonia de Apertura',
    contenido: 'Estimada comunidad educativa Sedes Sapientiae: Les damos una cordial bienvenida al ciclo escolar 2026. La ceremonia de apertura se llevará a cabo en el patio central a las 8:00 AM. Los alumnos deberán asistir con uniforme institucional completo.',
    categoria: 'Circular',
    destinatarios: 'todos',
    autor_nombre: 'Sor María del Carmen Rodríguez (Dirección)',
    enviar_whatsapp: true,
    whatsapp_enviados: 185,
    created_at: '2026-03-01T08:00:00Z',
  },
  {
    id: 'com-2',
    titulo: 'Primera Reunión General de Padres de Familia - Primaria',
    contenido: 'Se convoca a los señores apoderados de nivel Primaria a la primera reunión de coordinación y presentación del plan tutorial anual. Lugar: Auditorio San José. Fecha: Viernes 20 de marzo a las 6:30 PM.',
    categoria: 'Evento',
    destinatarios: 'primaria',
    autor_nombre: 'Lic. Patricia Valenzuela (Secretaría)',
    enviar_whatsapp: true,
    whatsapp_enviados: 92,
    created_at: '2026-03-05T14:30:00Z',
  },
  {
    id: 'com-3',
    titulo: 'Cronograma de Talleres Extracurriculares de Robótica y Música',
    contenido: 'Ya se encuentran abiertas las inscripciones para los talleres de Robótica Educativa, Banda de Música y Teatro Escolar. Cupos limitados por orden de inscripción en secretaría.',
    categoria: 'Académico',
    destinatarios: 'todos',
    autor_nombre: 'Prof. Carlos García',
    enviar_whatsapp: false,
    whatsapp_enviados: 0,
    created_at: '2026-03-10T11:15:00Z',
  }
]

// Interactive in-memory & local-storage synchronized store
class SedesDataStore {
  private getStorage<T>(key: string, defaultVal: T): T {
    if (typeof window === 'undefined') return defaultVal
    const stored = localStorage.getItem(`sedes_${key}`)
    if (!stored) {
      localStorage.setItem(`sedes_${key}`, JSON.stringify(defaultVal))
      return defaultVal
    }
    try {
      return JSON.parse(stored)
    } catch {
      return defaultVal
    }
  }

  private setStorage<T>(key: string, value: T): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`sedes_${key}`, JSON.stringify(value))
    }
  }

  // Alumnos
  getAlumnos(): Alumno[] {
    return this.getStorage('alumnos', INITIAL_ALUMNOS)
  }
  addAlumno(alumno: Alumno) {
    const list = this.getAlumnos()
    list.unshift(alumno)
    this.setStorage('alumnos', list)
    return alumno
  }

  // Secciones y Cursos
  getSecciones(): Seccion[] {
    return this.getStorage('secciones', INITIAL_SECCIONES)
  }
  getCursos(): Curso[] {
    return this.getStorage('cursos', INITIAL_CURSOS)
  }
  getSeccionesCursos(): SeccionCurso[] {
    return this.getStorage('secciones_cursos', INITIAL_SECCIONES_CURSOS)
  }

  // Notas
  getNotas(): Nota[] {
    return this.getStorage('notas', INITIAL_NOTAS)
  }
  saveNota(nota: Partial<Nota> & { alumno_id: string; seccion_curso_id: string; competencia: string; calificacion: 'AD'|'A'|'B'|'C'; periodo: string }) {
    const list = this.getNotas()
    const index = list.findIndex(n => n.alumno_id === nota.alumno_id && n.seccion_curso_id === nota.seccion_curso_id && n.competencia === nota.competencia && n.periodo === nota.periodo)
    const now = new Date().toISOString()
    if (index >= 0) {
      list[index] = { ...list[index], ...nota, updated_at: now, sync_status: 'synced' }
    } else {
      list.push({
        id: `not-${Date.now()}`,
        alumno_id: nota.alumno_id,
        seccion_curso_id: nota.seccion_curso_id,
        competencia: nota.competencia,
        calificacion: nota.calificacion,
        periodo: nota.periodo,
        conclusiones_descriptivas: nota.conclusiones_descriptivas,
        sync_status: 'synced',
        updated_at: now,
      })
    }
    this.setStorage('notas', list)
    return list
  }

  // Asistencias
  getAsistencias(): Asistencia[] {
    return this.getStorage('asistencias', INITIAL_ASISTENCIAS)
  }
  saveAsistencia(asistencia: { alumno_id: string; seccion_curso_id: string; fecha: string; estado: 'presente'|'tardanza'|'falta'|'justificado'; justificacion?: string }) {
    const list = this.getAsistencias()
    const index = list.findIndex(a => a.alumno_id === asistencia.alumno_id && a.seccion_curso_id === asistencia.seccion_curso_id && a.fecha === asistencia.fecha)
    if (index >= 0) {
      list[index] = { ...list[index], ...asistencia, sync_status: 'synced' }
    } else {
      list.push({
        id: `ast-${Date.now()}`,
        ...asistencia,
        sync_status: 'synced',
      })
    }
    this.setStorage('asistencias', list)
    return list
  }

  // Pagos
  getPagos(): Pago[] {
    return this.getStorage('pagos', INITIAL_PAGOS)
  }
  updatePago(id: string, update: Partial<Pago>) {
    const list = this.getPagos()
    const index = list.findIndex(p => p.id === id)
    if (index >= 0) {
      list[index] = { ...list[index], ...update }
      this.setStorage('pagos', list)
      return list[index]
    }
    return null
  }

  // Matrículas
  getMatriculas(): Matricula[] {
    return this.getStorage('matriculas', INITIAL_MATRICULAS)
  }
  updateMatriculaEstado(id: string, estado: 'postulante' | 'en_evaluacion' | 'matriculado' | 'retirado', observaciones?: string) {
    const list = this.getMatriculas()
    const index = list.findIndex(m => m.id === id)
    if (index >= 0) {
      list[index].estado = estado
      if (observaciones !== undefined) list[index].observaciones = observaciones
      this.setStorage('matriculas', list)
      return list[index]
    }
    return null
  }
  addMatricula(matricula: Matricula) {
    const list = this.getMatriculas()
    list.unshift(matricula)
    this.setStorage('matriculas', list)
    return matricula
  }

  // Comunicados
  getComunicados(): Comunicado[] {
    return this.getStorage('comunicados', INITIAL_COMUNICADOS)
  }
  addComunicado(comunicado: Comunicado) {
    const list = this.getComunicados()
    list.unshift(comunicado)
    this.setStorage('comunicados', list)
    return comunicado
  }
}

export const dataStore = new SedesDataStore()
