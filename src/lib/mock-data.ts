// Modelo de Datos Integral — Colegio Sede Sapiens 2026
// Conforme a los Requerimientos Funcionales RF-001 a RF-113

export type UserRole = 'director' | 'administrativo' | 'docente' | 'auxiliar' | 'psicologo' | 'padre' | 'alumno'

export interface Perfil {
  id: string
  nombre: string
  email: string
  rol: UserRole
  cargo: string
  telefono?: string
  avatar_url?: string
  secciones_asignadas?: string[]
}

export interface Seccion {
  id: string
  nombre: string
  grado: string
  seccion: string
  nivel: 'Inicial' | 'Primaria' | 'Secundaria'
  anio_escolar: number
  capacidad: number
  tutor_nombre?: string
  auxiliar_nombre?: string
}

export interface Curso {
  id: string
  nombre: string
  area_curricular: string
  nivel: 'Inicial' | 'Primaria' | 'Secundaria'
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
  apoderado_nombre: string
  apoderado_telefono: string
  seccion_id: string
  seccion_nombre: string
  codigo_estudiante: string
  avatar?: string
  tiene_mora?: boolean
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

// RF-010, RF-082: Temario del Día
export interface TemarioDia {
  id: string
  seccion_curso_id: string
  seccion_nombre: string
  curso_nombre: string
  docente_nombre: string
  fecha: string
  tema_titulo: string
  descripcion: string
  recursos_enlaces?: string[]
  created_at: string
}

// RF-011, RF-080: Tareas y Avisos
export interface TareaAviso {
  id: string
  seccion_curso_id: string
  seccion_nombre: string
  curso_nombre: string
  docente_nombre: string
  titulo: string
  descripcion: string
  fecha_asignacion: string
  fecha_limite: string
  bimestre: 'I' | 'II' | 'III' | 'IV'
  archivo_adjunto?: string
  tipo: 'tarea' | 'aviso'
}

// RF-013, RF-014, RF-015, RF-016: Calificaciones y Auditoría
export interface Nota {
  id: string
  alumno_id: string
  seccion_curso_id: string
  bimestre: 'I' | 'II' | 'III' | 'IV'
  competencia: string
  nota_dia: number // 0-20
  nota_bimestral: number // 0-20
  calificacion_literal: 'AD' | 'A' | 'B' | 'C'
  calificacion?: 'AD' | 'A' | 'B' | 'C'
  periodo?: string
  conclusiones_descriptivas?: string
  fecha_registro: string
  updated_at: string
  sync_status?: 'synced' | 'pending' | 'conflict'
}

export interface AuditoriaNota {
  id: string
  nota_id: string
  alumno_nombre: string
  curso_nombre: string
  usuario_modifica: string
  fecha: string
  valor_anterior: number | string
  valor_nuevo: number | string
  motivo: string
}

// RF-020, RF-023: Asistencia
export interface Asistencia {
  id: string
  alumno_id: string
  alumno_nombre?: string
  seccion_id?: string
  seccion_curso_id?: string
  fecha: string
  estado: 'presente' | 'tardanza' | 'falta' | 'justificado'
  justificacion?: string
  registrado_por?: string // Auxiliar o Docente
  sync_status?: 'synced' | 'pending' | 'conflict'
}

// RF-021, RF-022, RF-038: Conducta e Incidencias (Auxiliar)
export interface ConductaIncidencia {
  id: string
  alumno_id: string
  alumno_nombre: string
  seccion_id: string
  seccion_nombre: string
  fecha: string
  tipo: 'merito' | 'demerito' | 'observacion'
  titulo: string
  descripcion: string
  auxiliar_nombre: string
  notificado_whatsapp: boolean
}

// RF-032, RF-033, RF-034, RF-050: Pagos y Deudas
export interface Pago {
  id: string
  alumno_id: string
  alumno_nombre: string
  apoderado_id: string
  concepto: string
  monto: number
  mora: number
  estado: 'pendiente' | 'pagado' | 'vencido' | 'en_revision' | 'anulado'
  fecha_vencimiento: string
  fecha_pago?: string
  metodo_pago?: 'yape_qr' | 'plin_qr' | 'transferencia' | 'efectivo' | 'culqi' | 'yape_manual' | 'plin_manual'
  nro_operacion?: string
  culqi_charge_id?: string
  comprobante_url?: string
}

// RF-035, RF-036, RF-051, RF-052, RF-053, RF-054, RF-055: Comprobantes Yape QR
export interface ComprobantePago {
  id: string
  pago_id: string
  alumno_id: string
  alumno_nombre: string
  apoderado_id: string
  apoderado_nombre: string
  periodo_concepto: string
  monto: number
  nro_operacion: string
  comprobante_url: string
  fecha_subida: string
  estado: 'pendiente' | 'aprobado' | 'rechazado'
  motivo_rechazo?: string
  revisado_por?: string
  fecha_revision?: string
}

// RF-040 a RF-045, RF-060 a RF-062: Formato Único de Trámite (FUT)
export interface FUT {
  id: string
  correlativo: string // Ej: FUT-2026-0038
  solicitante_nombre: string
  solicitante_rol: 'padre' | 'alumno' | 'docente' | 'otro'
  dni: string
  telefono: string
  correo?: string
  tipo_tramite: 'Certificado de Estudios' | 'Constancia de Matrícula' | 'Traslado de Matrícula' | 'Justificación de Inasistencia' | 'Rectificación de Notas' | 'Exoneración de Área' | 'Otro'
  asunto: string
  documento_adjunto?: string
  oficina_derivada: 'Dirección' | 'Secretaría Académica' | 'Psicología' | 'Coordinación Pedagógica'
  estado: 'en_proceso' | 'cumplido' | 'no_cumplido'
  resolucion_notas?: string
  historial_estados: {
    fecha: string
    usuario: string
    estado_anterior: string
    nuevo_estado: string
    comentario: string
  }[]
  fecha_ingreso: string
}

// RF-070 a RF-073: Módulo Psicología
export interface AtencionPsicologia {
  id: string
  alumno_id: string
  alumno_nombre: string
  seccion_nombre: string
  psicologo_nombre: string
  fecha: string
  motivo: string
  observaciones_confidenciales: string
  acuerdos_plan_accion: string
  derivado_a?: 'Docentes' | 'Auxiliares' | 'Padres de Familia' | 'Especialista Externo'
  seguimiento_activo: boolean
}

// RF-081, RF-090 a RF-092: Repositorio Digital de Libros y Material
export interface LibroMaterial {
  id: string
  titulo: string
  descripcion: string
  tipo: 'libro' | 'separata' | 'guia_practica' | 'evaluacion' | 'multimedia'
  nivel: 'Inicial' | 'Primaria' | 'Secundaria'
  grado: string
  curso_nombre: string
  bimestre: 'I' | 'II' | 'III' | 'IV'
  url_descarga: string
  tamano_mb: string
  subido_por_rol: 'docente' | 'administrativo'
  autor: string
  fecha_subida: string
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

// RF-100 a RF-102: Log de Notificaciones WhatsApp
export interface NotificacionWhatsApp {
  id: string
  destinatario_nombre: string
  telefono: string
  tipo_evento: 'nota_registrada' | 'falta_tardanza' | 'demerito_conducta' | 'nueva_tarea' | 'pago_aprobado' | 'pago_rechazado' | 'fut_actualizado' | 'comunicado_general'
  mensaje: string
  estado: 'enviado' | 'entregado' | 'leido'
  fecha_hora: string
}

// RF-046: Asistencia de Personal Administrativo y Docente
export interface AsistenciaPersonal {
  id: string
  personal_id: string
  personal_nombre: string
  rol: string
  fecha: string
  hora_ingreso: string
  hora_salida?: string
  estado: 'puntual' | 'tardanza' | 'falta'
}

// ----------------------------------------------------
// DATOS INICIALES DEMO — 24 AULAS
// ----------------------------------------------------

export const INITIAL_SECCIONES: Seccion[] = [
  // INICIAL (3 aulas)
  { id: 'sec-ini-3', nombre: 'Inicial 3 Años - Gotitas de Amor', grado: '3 Años', seccion: 'Única', nivel: 'Inicial', anio_escolar: 2026, capacidad: 20, tutor_nombre: 'Lic. Mariana Soto', auxiliar_nombre: 'Aux. Gladys Ramos' },
  { id: 'sec-ini-4', nombre: 'Inicial 4 Años - Rayitos de Sol', grado: '4 Años', seccion: 'Única', nivel: 'Inicial', anio_escolar: 2026, capacidad: 22, tutor_nombre: 'Lic. Claudia Paredes', auxiliar_nombre: 'Aux. Gladys Ramos' },
  { id: 'sec-ini-5', nombre: 'Inicial 5 Años - Pequeños Sabios', grado: '5 Años', seccion: 'Única', nivel: 'Inicial', anio_escolar: 2026, capacidad: 25, tutor_nombre: 'Lic. Sandra Navarro', auxiliar_nombre: 'Aux. Gladys Ramos' },

  // PRIMARIA (12 aulas: 1° a 6°, A y B)
  { id: 'sec-1a-pri', nombre: '1ro A Primaria', grado: '1ro', seccion: 'A', nivel: 'Primaria', anio_escolar: 2026, capacidad: 26, tutor_nombre: 'Prof. Ana María Ruiz', auxiliar_nombre: 'Aux. Pedro Huamán' },
  { id: 'sec-1b-pri', nombre: '1ro B Primaria', grado: '1ro', seccion: 'B', nivel: 'Primaria', anio_escolar: 2026, capacidad: 26, tutor_nombre: 'Prof. Julia Morales', auxiliar_nombre: 'Aux. Pedro Huamán' },
  { id: 'sec-2a-pri', nombre: '2do A Primaria', grado: '2do', seccion: 'A', nivel: 'Primaria', anio_escolar: 2026, capacidad: 28, tutor_nombre: 'Prof. Elena Vásquez', auxiliar_nombre: 'Aux. Pedro Huamán' },
  { id: 'sec-2b-pri', nombre: '2do B Primaria', grado: '2do', seccion: 'B', nivel: 'Primaria', anio_escolar: 2026, capacidad: 28, tutor_nombre: 'Prof. Mario Mendoza', auxiliar_nombre: 'Aux. Pedro Huamán' },
  { id: 'sec-3a-pri', nombre: '3ro A Primaria', grado: '3ro', seccion: 'A', nivel: 'Primaria', anio_escolar: 2026, capacidad: 28, tutor_nombre: 'Prof. Carlos García Silva', auxiliar_nombre: 'Aux. Pedro Huamán' },
  { id: 'sec-3b-pri', nombre: '3ro B Primaria', grado: '3ro', seccion: 'B', nivel: 'Primaria', anio_escolar: 2026, capacidad: 28, tutor_nombre: 'Prof. Laura Méndez', auxiliar_nombre: 'Aux. Pedro Huamán' },
  { id: 'sec-4a-pri', nombre: '4to A Primaria', grado: '4to', seccion: 'A', nivel: 'Primaria', anio_escolar: 2026, capacidad: 30, tutor_nombre: 'Prof. Teresa Chumpitaz', auxiliar_nombre: 'Aux. Pedro Huamán' },
  { id: 'sec-4b-pri', nombre: '4to B Primaria', grado: '4to', seccion: 'B', nivel: 'Primaria', anio_escolar: 2026, capacidad: 30, tutor_nombre: 'Prof. Hugo Salcedo', auxiliar_nombre: 'Aux. Pedro Huamán' },
  { id: 'sec-5a-pri', nombre: '5to A Primaria', grado: '5to', seccion: 'A', nivel: 'Primaria', anio_escolar: 2026, capacidad: 30, tutor_nombre: 'Prof. Mónica Rivas', auxiliar_nombre: 'Aux. Pedro Huamán' },
  { id: 'sec-5b-pri', nombre: '5to B Primaria', grado: '5to', seccion: 'B', nivel: 'Primaria', anio_escolar: 2026, capacidad: 30, tutor_nombre: 'Prof. Fernando Castro', auxiliar_nombre: 'Aux. Pedro Huamán' },
  { id: 'sec-6a-pri', nombre: '6to A Primaria', grado: '6to', seccion: 'A', nivel: 'Primaria', anio_escolar: 2026, capacidad: 30, tutor_nombre: 'Prof. Patricia Lozano', auxiliar_nombre: 'Aux. Pedro Huamán' },
  { id: 'sec-6b-pri', nombre: '6to B Primaria', grado: '6to', seccion: 'B', nivel: 'Primaria', anio_escolar: 2026, capacidad: 30, tutor_nombre: 'Prof. Jorge Benítez', auxiliar_nombre: 'Aux. Pedro Huamán' },

  // SECUNDARIA (9 aulas: 1° a 4° A/B y 5° A) -> Total 3 + 12 + 9 = 24 AULAS
  { id: 'sec-1a-sec', nombre: '1ro A Secundaria', grado: '1ro', seccion: 'A', nivel: 'Secundaria', anio_escolar: 2026, capacidad: 32, tutor_nombre: 'Prof. Carlos García Silva', auxiliar_nombre: 'Aux. Roberto Calvo' },
  { id: 'sec-1b-sec', nombre: '1ro B Secundaria', grado: '1ro', seccion: 'B', nivel: 'Secundaria', anio_escolar: 2026, capacidad: 32, tutor_nombre: 'Prof. Laura Méndez', auxiliar_nombre: 'Aux. Roberto Calvo' },
  { id: 'sec-2a-sec', nombre: '2do A Secundaria', grado: '2do', seccion: 'A', nivel: 'Secundaria', anio_escolar: 2026, capacidad: 32, tutor_nombre: 'Prof. Diego Romero', auxiliar_nombre: 'Aux. Roberto Calvo' },
  { id: 'sec-2b-sec', nombre: '2do B Secundaria', grado: '2do', seccion: 'B', nivel: 'Secundaria', anio_escolar: 2026, capacidad: 32, tutor_nombre: 'Prof. Vanessa Campos', auxiliar_nombre: 'Aux. Roberto Calvo' },
  { id: 'sec-3a-sec', nombre: '3ro A Secundaria', grado: '3ro', seccion: 'A', nivel: 'Secundaria', anio_escolar: 2026, capacidad: 32, tutor_nombre: 'Prof. Víctor Alvarado', auxiliar_nombre: 'Aux. Roberto Calvo' },
  { id: 'sec-3b-sec', nombre: '3ro B Secundaria', grado: '3ro', seccion: 'B', nivel: 'Secundaria', anio_escolar: 2026, capacidad: 32, tutor_nombre: 'Prof. Carmen Salazar', auxiliar_nombre: 'Aux. Roberto Calvo' },
  { id: 'sec-4a-sec', nombre: '4to A Secundaria', grado: '4to', seccion: 'A', nivel: 'Secundaria', anio_escolar: 2026, capacidad: 32, tutor_nombre: 'Prof. Guillermo Bravo', auxiliar_nombre: 'Aux. Roberto Calvo' },
  { id: 'sec-4b-sec', nombre: '4to B Secundaria', grado: '4to', seccion: 'B', nivel: 'Secundaria', anio_escolar: 2026, capacidad: 32, tutor_nombre: 'Prof. Rosario Pinto', auxiliar_nombre: 'Aux. Roberto Calvo' },
  { id: 'sec-5a-sec', nombre: '5to A Secundaria (Promoción 2026)', grado: '5to', seccion: 'A', nivel: 'Secundaria', anio_escolar: 2026, capacidad: 35, tutor_nombre: 'Prof. Carlos García Silva', auxiliar_nombre: 'Aux. Roberto Calvo' },
]

export const INITIAL_CURSOS: Curso[] = [
  { id: 'cur-mat', nombre: 'Matemática y Razonamiento', area_curricular: 'Matemática', nivel: 'Primaria' },
  { id: 'cur-com', nombre: 'Comunicación y Literatura', area_curricular: 'Comunicación', nivel: 'Primaria' },
  { id: 'cur-cyt', nombre: 'Ciencia y Tecnología', area_curricular: 'Ciencias', nivel: 'Primaria' },
  { id: 'cur-soc', nombre: 'Personal Social / Historia', area_curricular: 'Ciencias Sociales', nivel: 'Primaria' },
  { id: 'cur-ing', nombre: 'Inglés Intensivo', area_curricular: 'Idiomas', nivel: 'Primaria' },
  { id: 'cur-alg', nombre: 'Álgebra y Geometría', area_curricular: 'Matemática', nivel: 'Secundaria' },
  { id: 'cur-fis', nombre: 'Física Elemental', area_curricular: 'Ciencias', nivel: 'Secundaria' },
]

export const INITIAL_SECCIONES_CURSOS: SeccionCurso[] = [
  { id: 'sc-3a-mat', seccion_id: 'sec-3a-pri', curso_id: 'cur-mat', docente_id: 'usr-doc-1', seccion_nombre: '3ro A Primaria', curso_nombre: 'Matemática y Razonamiento', docente_nombre: 'Prof. Carlos García Silva', horas_semanales: 6 },
  { id: 'sc-3a-com', seccion_id: 'sec-3a-pri', curso_id: 'cur-com', docente_id: 'usr-doc-2', seccion_nombre: '3ro A Primaria', curso_nombre: 'Comunicación y Literatura', docente_nombre: 'Prof. Laura Méndez Castillo', horas_semanales: 5 },
  { id: 'sc-3a-cyt', seccion_id: 'sec-3a-pri', curso_id: 'cur-cyt', docente_id: 'usr-doc-1', seccion_nombre: '3ro A Primaria', curso_nombre: 'Ciencia y Tecnología', docente_nombre: 'Prof. Carlos García Silva', horas_semanales: 4 },
  { id: 'sc-5a-alg', seccion_id: 'sec-5a-sec', curso_id: 'cur-alg', docente_id: 'usr-doc-1', seccion_nombre: '5to A Secundaria', curso_nombre: 'Álgebra y Geometría', docente_nombre: 'Prof. Carlos García Silva', horas_semanales: 6 },
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
    apoderado_telefono: '+51 987 112 233',
    seccion_id: 'sec-3a-pri',
    seccion_nombre: '3ro A Primaria',
    codigo_estudiante: 'EST-2026-001',
    tiene_mora: false,
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
    apoderado_telefono: '+51 987 112 233',
    seccion_id: 'sec-5a-sec',
    seccion_nombre: '5to A Secundaria (Promoción 2026)',
    codigo_estudiante: 'EST-2026-002',
    tiene_mora: false,
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
    apoderado_telefono: '+51 987 445 566',
    seccion_id: 'sec-3a-pri',
    seccion_nombre: '3ro A Primaria',
    codigo_estudiante: 'EST-2026-003',
    tiene_mora: true, // Con mora para demostrar RF-034
  },
  {
    id: 'alu-4',
    nombres: 'Luciana María',
    apellidos: 'Sánchez Paz',
    dni: '78912348',
    fecha_nacimiento: '2016-07-03',
    genero: 'F',
    apoderado_id: 'usr-pad-3',
    apoderado_nombre: 'Sr. Manuel Sánchez',
    apoderado_telefono: '+51 981 223 344',
    seccion_id: 'sec-3a-pri',
    seccion_nombre: '3ro A Primaria',
    codigo_estudiante: 'EST-2026-004',
    tiene_mora: false,
  },
  {
    id: 'alu-5',
    nombres: 'Diego Alonso',
    apellidos: 'Gutiérrez Ramos',
    dni: '78912349',
    fecha_nacimiento: '2016-11-20',
    genero: 'M',
    apoderado_id: 'usr-pad-4',
    apoderado_nombre: 'Sra. Beatriz Ramos',
    apoderado_telefono: '+51 982 334 455',
    seccion_id: 'sec-3a-pri',
    seccion_nombre: '3ro A Primaria',
    codigo_estudiante: 'EST-2026-005',
    tiene_mora: false,
  }
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
    autor_nombre: 'Prof. Carlos García Silva',
    enviar_whatsapp: false,
    whatsapp_enviados: 0,
    created_at: '2026-03-10T11:15:00Z',
  }
]

// RF-010: Temarios del Día Iniciales
export const INITIAL_TEMARIOS: TemarioDia[] = [
  {
    id: 'tem-1',
    seccion_curso_id: 'sc-3a-mat',
    seccion_nombre: '3ro A Primaria',
    curso_nombre: 'Matemática y Razonamiento',
    docente_nombre: 'Prof. Carlos García Silva',
    fecha: '2026-03-24',
    tema_titulo: 'Propiedades de la Multiplicación y Problemas Cotidianos',
    descripcion: 'Se explicó la propiedad distributiva y conmutativa con ejemplos prácticos de compra y venta. Resolución de páginas 45 a 48 del libro institucional.',
    recursos_enlaces: ['https://sedes.edu.pe/recursos/mat-3pri-distributiva.pdf'],
    created_at: '2026-03-24T10:30:00Z',
  },
  {
    id: 'tem-2',
    seccion_curso_id: 'sc-3a-com',
    seccion_nombre: '3ro A Primaria',
    curso_nombre: 'Comunicación y Literatura',
    docente_nombre: 'Prof. Laura Méndez Castillo',
    fecha: '2026-03-24',
    tema_titulo: 'Estructura del Cuento: Inicio, Nudo y Desenlace',
    descripcion: 'Lectura comentada de "El Caballero Carmelo". Identificación de personajes principales, secundarios y redacción de un final alternativo en el cuaderno.',
    recursos_enlaces: ['https://sedes.edu.pe/recursos/com-3pri-carmelo.pdf'],
    created_at: '2026-03-24T11:45:00Z',
  },
]

// RF-011: Tareas y Avisos Iniciales
export const INITIAL_TAREAS: TareaAviso[] = [
  {
    id: 'tar-1',
    seccion_curso_id: 'sc-3a-mat',
    seccion_nombre: '3ro A Primaria',
    curso_nombre: 'Matemática y Razonamiento',
    docente_nombre: 'Prof. Carlos García Silva',
    titulo: 'Ficha Práctica N° 4: Multiplicaciones de dos cifras',
    descripcion: 'Resolver los ejercicios del 1 al 10 en la ficha impresa entregada en clase y pegar en el cuaderno de trabajo.',
    fecha_asignacion: '2026-03-24',
    fecha_limite: '2026-03-27',
    bimestre: 'I',
    archivo_adjunto: 'ficha_practica_multiplicacion.pdf',
    tipo: 'tarea',
  },
  {
    id: 'tar-2',
    seccion_curso_id: 'sc-3a-com',
    seccion_nombre: '3ro A Primaria',
    curso_nombre: 'Comunicación y Literatura',
    docente_nombre: 'Prof. Laura Méndez Castillo',
    titulo: 'Redacción de Mini Cuento Ilustrado',
    descripcion: 'Elaborar un cuento de 2 páginas con tema libre aplicando la estructura aprendida. Incluir al menos 1 dibujo coloreado.',
    fecha_asignacion: '2026-03-23',
    fecha_limite: '2026-03-28',
    bimestre: 'I',
    tipo: 'tarea',
  },
]

// RF-013, RF-014, RF-015: Calificaciones
export const INITIAL_NOTAS: Nota[] = [
  { id: 'not-1', alumno_id: 'alu-1', seccion_curso_id: 'sc-3a-mat', bimestre: 'I', competencia: 'Resuelve problemas de cantidad', nota_dia: 18, nota_bimestral: 18, calificacion_literal: 'AD', calificacion: 'AD', periodo: 'Bimestre 1', conclusiones_descriptivas: 'Excelente razonamiento lógico matemático.', fecha_registro: '2026-03-24', updated_at: '2026-03-24T12:00:00Z', sync_status: 'synced' },
  { id: 'not-2', alumno_id: 'alu-1', seccion_curso_id: 'sc-3a-mat', bimestre: 'I', competencia: 'Resuelve problemas de forma y movimiento', nota_dia: 16, nota_bimestral: 17, calificacion_literal: 'A', calificacion: 'A', periodo: 'Bimestre 1', conclusiones_descriptivas: 'Demuestra destreza espacial y geométrica.', fecha_registro: '2026-03-24', updated_at: '2026-03-24T12:00:00Z', sync_status: 'synced' },
  { id: 'not-3', alumno_id: 'alu-1', seccion_curso_id: 'sc-3a-com', bimestre: 'I', competencia: 'Se comunica oralmente en su lengua materna', nota_dia: 19, nota_bimestral: 19, calificacion_literal: 'AD', calificacion: 'AD', periodo: 'Bimestre 1', conclusiones_descriptivas: 'Fluidez y excelente dicción.', fecha_registro: '2026-03-24', updated_at: '2026-03-24T12:00:00Z', sync_status: 'synced' },
  { id: 'not-4', alumno_id: 'alu-3', seccion_curso_id: 'sc-3a-mat', bimestre: 'I', competencia: 'Resuelve problemas de cantidad', nota_dia: 13, nota_bimestral: 13, calificacion_literal: 'B', calificacion: 'B', periodo: 'Bimestre 1', conclusiones_descriptivas: 'Requiere reforzar tablas de multiplicar.', fecha_registro: '2026-03-24', updated_at: '2026-03-24T12:00:00Z', sync_status: 'synced' },
  { id: 'not-5', alumno_id: 'alu-4', seccion_curso_id: 'sc-3a-mat', bimestre: 'I', competencia: 'Resuelve problemas de cantidad', nota_dia: 17, nota_bimestral: 17, calificacion_literal: 'A', calificacion: 'A', periodo: 'Bimestre 1', conclusiones_descriptivas: 'Buen desempeño general.', fecha_registro: '2026-03-24', updated_at: '2026-03-24T12:00:00Z', sync_status: 'synced' },
]

// RF-016: Auditoría de Notas
export const INITIAL_AUDITORIA_NOTAS: AuditoriaNota[] = [
  { id: 'aud-1', nota_id: 'not-1', alumno_nombre: 'Joaquín Andrés Quispe Flores', curso_nombre: 'Matemática', usuario_modifica: 'Prof. Carlos García Silva', fecha: '2026-03-24 14:30', valor_anterior: 16, valor_nuevo: 18, motivo: 'Revisión de punto adicional por participación destacada en pizarra.' },
]

// RF-020: Asistencias
export const INITIAL_ASISTENCIAS: Asistencia[] = [
  { id: 'ast-1', alumno_id: 'alu-1', alumno_nombre: 'Joaquín Andrés Quispe Flores', seccion_id: 'sec-3a-pri', seccion_curso_id: 'sc-3a-mat', fecha: '2026-03-24', estado: 'presente', registrado_por: 'Aux. Pedro Huamán', sync_status: 'synced' },
  { id: 'ast-2', alumno_id: 'alu-3', alumno_nombre: 'Mateo Sebastián Flores Mendoza', seccion_id: 'sec-3a-pri', seccion_curso_id: 'sc-3a-mat', fecha: '2026-03-24', estado: 'tardanza', justificacion: 'Congestión vehicular en Av. Próceres', registrado_por: 'Aux. Pedro Huamán', sync_status: 'synced' },
  { id: 'ast-3', alumno_id: 'alu-4', alumno_nombre: 'Luciana María Sánchez Paz', seccion_id: 'sec-3a-pri', seccion_curso_id: 'sc-3a-mat', fecha: '2026-03-24', estado: 'presente', registrado_por: 'Aux. Pedro Huamán', sync_status: 'synced' },
  { id: 'ast-4', alumno_id: 'alu-5', alumno_nombre: 'Diego Alonso Gutiérrez Ramos', seccion_id: 'sec-3a-pri', seccion_curso_id: 'sc-3a-mat', fecha: '2026-03-24', estado: 'justificado', justificacion: 'Cita odontológica programada', registrado_por: 'Aux. Pedro Huamán', sync_status: 'synced' },
]

// RF-021, RF-038: Conducta e Incidencias
export const INITIAL_CONDUCTAS: ConductaIncidencia[] = [
  {
    id: 'cnd-1',
    alumno_id: 'alu-1',
    alumno_nombre: 'Joaquín Andrés Quispe Flores',
    seccion_id: 'sec-3a-pri',
    seccion_nombre: '3ro A Primaria',
    fecha: '2026-03-22',
    tipo: 'merito',
    titulo: 'Reconocimiento por Compañerismo y Solidaridad',
    descripcion: 'Apoyó activamente a un compañero nuevo con la orientación de aulas y préstamo de materiales escolares.',
    auxiliar_nombre: 'Aux. Pedro Huamán',
    notificado_whatsapp: true,
  },
  {
    id: 'cnd-2',
    alumno_id: 'alu-3',
    alumno_nombre: 'Mateo Sebastián Flores Mendoza',
    seccion_id: 'sec-3a-pri',
    seccion_nombre: '3ro A Primaria',
    fecha: '2026-03-24',
    tipo: 'demerito',
    titulo: 'Uso no autorizado de celular en hora de formación',
    descripcion: 'Se le llamó la atención de forma verbal tras manipular dispositivo móvil durante la formación general.',
    auxiliar_nombre: 'Aux. Pedro Huamán',
    notificado_whatsapp: true,
  },
]

// RF-032, RF-033: Pagos y Mora
export const INITIAL_PAGOS: Pago[] = [
  { id: 'pag-1', alumno_id: 'alu-1', alumno_nombre: 'Joaquín Andrés Quispe Flores', apoderado_id: 'usr-pad-1', concepto: 'Matrícula Escolar 2026', monto: 350.00, mora: 0, estado: 'pagado', fecha_vencimiento: '2026-02-15', fecha_pago: '2026-02-10', metodo_pago: 'yape_qr', nro_operacion: 'YAPE-882194' },
  { id: 'pag-2', alumno_id: 'alu-1', alumno_nombre: 'Joaquín Andrés Quispe Flores', apoderado_id: 'usr-pad-1', concepto: 'Pensión Marzo 2026', monto: 420.00, mora: 0, estado: 'pagado', fecha_vencimiento: '2026-03-31', fecha_pago: '2026-03-20', metodo_pago: 'yape_qr', nro_operacion: 'YAPE-912048' },
  { id: 'pag-3', alumno_id: 'alu-1', alumno_nombre: 'Joaquín Andrés Quispe Flores', apoderado_id: 'usr-pad-1', concepto: 'Pensión Abril 2026', monto: 420.00, mora: 0, estado: 'pendiente', fecha_vencimiento: '2026-04-30' },
  
  // Caso de alumno con deuda/mora para RF-034 (Mateo Flores)
  { id: 'pag-4', alumno_id: 'alu-3', alumno_nombre: 'Mateo Sebastián Flores Mendoza', apoderado_id: 'usr-pad-2', concepto: 'Pensión Marzo 2026', monto: 420.00, mora: 25.00, estado: 'vencido', fecha_vencimiento: '2026-03-10' },
]

// RF-035, RF-051, RF-052: Comprobantes Yape QR
export const INITIAL_COMPROBANTES: ComprobantePago[] = [
  {
    id: 'cmp-1',
    pago_id: 'pag-2',
    alumno_id: 'alu-1',
    alumno_nombre: 'Joaquín Andrés Quispe Flores',
    apoderado_id: 'usr-pad-1',
    apoderado_nombre: 'Ing. Roberto Quispe Mamani',
    periodo_concepto: 'Pensión Marzo 2026',
    monto: 420.00,
    nro_operacion: '912048',
    comprobante_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60',
    fecha_subida: '2026-03-20 16:40',
    estado: 'aprobado',
    revisado_por: 'Lic. Patricia Valenzuela (Secretaría)',
    fecha_revision: '2026-03-20 17:15',
  },
  {
    id: 'cmp-2',
    pago_id: 'pag-4',
    alumno_id: 'alu-3',
    alumno_nombre: 'Mateo Sebastián Flores Mendoza',
    apoderado_id: 'usr-pad-2',
    apoderado_nombre: 'Dra. Carmen Rosa Flores Díaz',
    periodo_concepto: 'Pensión Marzo 2026 + Mora',
    monto: 445.00,
    nro_operacion: '772910',
    comprobante_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60',
    fecha_subida: '2026-03-24 09:10',
    estado: 'pendiente',
  }
]

// RF-040 a RF-045, RF-060: Formato Único de Trámite (FUT)
export const INITIAL_FUTS: FUT[] = [
  {
    id: 'fut-1',
    correlativo: 'FUT-2026-0042',
    solicitante_nombre: 'Ing. Roberto Quispe Mamani',
    solicitante_rol: 'padre',
    dni: '10293847',
    telefono: '+51 987 112 233',
    correo: 'apoderado.quispe@gmail.com',
    tipo_tramite: 'Certificado de Estudios',
    asunto: 'Solicitud de certificado oficial de estudios de Primaria para trámite de visa.',
    documento_adjunto: 'recibo_tramite_0042.pdf',
    oficina_derivada: 'Secretaría Académica',
    estado: 'en_proceso',
    fecha_ingreso: '2026-03-21',
    historial_estados: [
      { fecha: '2026-03-21 09:30', usuario: 'Lic. Patricia Valenzuela', estado_anterior: 'Ingresado', nuevo_estado: 'en_proceso', comentario: 'Recepción de expediente e inicio de verificación de notas en SIAGIE.' },
      { fecha: '2026-03-22 11:00', usuario: 'Sor María del Carmen (Directora)', estado_anterior: 'en_proceso', nuevo_estado: 'en_proceso', comentario: 'Derivado a Secretaría con visto bueno de Dirección.' }
    ]
  },
  {
    id: 'fut-2',
    correlativo: 'FUT-2026-0041',
    solicitante_nombre: 'Dra. Carmen Rosa Flores Díaz',
    solicitante_rol: 'padre',
    dni: '44556677',
    telefono: '+51 987 445 566',
    correo: 'carmen.flores@hospital.gob.pe',
    tipo_tramite: 'Justificación de Inasistencia',
    asunto: 'Justificación médica por cuadro respiratorio agudo del alumno Mateo Flores.',
    documento_adjunto: 'certificado_medico_essalud.pdf',
    oficina_derivada: 'Coordinación Pedagógica',
    estado: 'cumplido',
    resolucion_notas: 'Inasistencia justificada en el sistema escolar. Evaluaciones reprogramadas.',
    fecha_ingreso: '2026-03-18',
    historial_estados: [
      { fecha: '2026-03-18 08:15', usuario: 'Lic. Patricia Valenzuela', estado_anterior: 'Ingresado', nuevo_estado: 'en_proceso', comentario: 'Ingreso de expediente médico.' },
      { fecha: '2026-03-19 14:00', usuario: 'Sor María del Carmen (Directora)', estado_anterior: 'en_proceso', nuevo_estado: 'cumplido', comentario: 'Aprobado y notificado al auxiliar y docentes.' }
    ]
  }
]

// RF-070 a RF-073: Psicología
export const INITIAL_ATENCIONES_PSICOLOGIA: AtencionPsicologia[] = [
  {
    id: 'psi-1',
    alumno_id: 'alu-3',
    alumno_nombre: 'Mateo Sebastián Flores Mendoza',
    seccion_nombre: '3ro A Primaria',
    psicologo_nombre: 'Lic. Andrés Salgado (Dpto. Psicología)',
    fecha: '2026-03-23',
    motivo: 'Evaluación de adaptación escolar y concentración en clase',
    observaciones_confidenciales: 'Alumno muestra ligera inquietud motriz durante clases de larga duración. Responde favorablemente a estímulos visuales y dinámicas participativas.',
    acuerdos_plan_accion: 'Se establece pauta de pausas activas y refuerzo positivo. Próxima sesión de seguimiento en 15 días.',
    derivado_a: 'Docentes',
    seguimiento_activo: true,
  }
]

// RF-081, RF-090 a RF-092: Repositorio Digital
export const INITIAL_LIBROS_MATERIAL: LibroMaterial[] = [
  {
    id: 'lib-1',
    titulo: 'Libro de Matemática y Razonamiento 3° Primaria (Edición 2026)',
    descripcion: 'Texto escolar completo oficial con teoría, ejercicios guiados y fichas de evaluación por competencias.',
    tipo: 'libro',
    nivel: 'Primaria',
    grado: '3ro',
    curso_nombre: 'Matemática y Razonamiento',
    bimestre: 'I',
    url_descarga: '/recursos/libro_matematica_3primaria.pdf',
    tamano_mb: '18.4 MB',
    subido_por_rol: 'docente',
    autor: 'Prof. Carlos García Silva',
    fecha_subida: '2026-03-01',
  },
  {
    id: 'lib-2',
    titulo: 'Antología de Cuentos y Lecturas Peruanas 3° Primaria',
    descripcion: 'Compendio de relatos breves y fábulas tradicionales para el Plan Lector del 1er Bimestre.',
    tipo: 'libro',
    nivel: 'Primaria',
    grado: '3ro',
    curso_nombre: 'Comunicación y Literatura',
    bimestre: 'I',
    url_descarga: '/recursos/antologia_lecturas_3pri.pdf',
    tamano_mb: '12.1 MB',
    subido_por_rol: 'docente',
    autor: 'Prof. Laura Méndez Castillo',
    fecha_subida: '2026-03-05',
  },
  {
    id: 'lib-3',
    titulo: 'Guía Práctica: El Método Científico y Experimentos Caseros',
    descripcion: 'Guía de laboratorio para experimentos de Ciencia y Tecnología con materiales reciclables.',
    tipo: 'guia_practica',
    nivel: 'Primaria',
    grado: '3ro',
    curso_nombre: 'Ciencia y Tecnología',
    bimestre: 'I',
    url_descarga: '/recursos/guia_experimentos_cyt.pdf',
    tamano_mb: '6.5 MB',
    subido_por_rol: 'docente',
    autor: 'Prof. Carlos García Silva',
    fecha_subida: '2026-03-10',
  }
]

// RF-100 a RF-102: Log WhatsApp
export const INITIAL_WHATSAPP_LOGS: NotificacionWhatsApp[] = [
  {
    id: 'wsp-1',
    destinatario_nombre: 'Ing. Roberto Quispe Mamani',
    telefono: '+51 987 112 233',
    tipo_evento: 'pago_aprobado',
    mensaje: '✅ Colegio Sede Sapiens: Estimado apoderado, su comprobante de pago por "Pensión Marzo 2026" ha sido APROBADO satisfactoriamente. Gracias por su puntualidad.',
    estado: 'leido',
    fecha_hora: '2026-03-20 17:16',
  },
  {
    id: 'wsp-2',
    destinatario_nombre: 'Dra. Carmen Rosa Flores Díaz',
    telefono: '+51 987 445 566',
    tipo_evento: 'demerito_conducta',
    mensaje: '⚠️ Colegio Sede Sapiens: Se ha registrado una observación de comportamiento para su menor hijo Mateo Flores: "Uso no autorizado de celular en hora de formación". Revise la app institucional.',
    estado: 'entregado',
    fecha_hora: '2026-03-24 08:35',
  },
  {
    id: 'wsp-3',
    destinatario_nombre: 'Ing. Roberto Quispe Mamani',
    telefono: '+51 987 112 233',
    tipo_evento: 'nota_registrada',
    mensaje: '📚 Colegio Sede Sapiens: El Prof. Carlos García ha registrado una nueva calificación (18 - AD) en Matemática para Joaquín Quispe.',
    estado: 'leido',
    fecha_hora: '2026-03-24 12:05',
  }
]

// ----------------------------------------------------
// STORE REACTIVO INTEGRADO CON LOCALSTORAGE
// ----------------------------------------------------

class SedesStore {
  private get<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined') return fallback
    const item = localStorage.getItem(`sapiens_${key}`)
    if (!item) {
      localStorage.setItem(`sapiens_${key}`, JSON.stringify(fallback))
      return fallback
    }
    try {
      return JSON.parse(item)
    } catch {
      return fallback
    }
  }

  private set<T>(key: string, val: T): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`sapiens_${key}`, JSON.stringify(val))
    }
  }

  // Aulas & Secciones
  getSecciones(): Seccion[] { return this.get('secciones', INITIAL_SECCIONES) }
  getCursos(): Curso[] { return this.get('cursos', INITIAL_CURSOS) }
  getSeccionesCursos(): SeccionCurso[] { return this.get('secciones_cursos', INITIAL_SECCIONES_CURSOS) }
  getAlumnos(): Alumno[] { return this.get('alumnos', INITIAL_ALUMNOS) }
  addAlumno(alumno: Alumno): Alumno {
    const list = this.getAlumnos()
    list.unshift(alumno)
    this.set('alumnos', list)
    return alumno
  }

  // Matrículas
  getMatriculas(): Matricula[] { return this.get('matriculas', INITIAL_MATRICULAS) }
  addMatricula(mat: Matricula): Matricula {
    const list = this.getMatriculas()
    list.unshift(mat)
    this.set('matriculas', list)
    return mat
  }
  updateMatriculaEstado(id: string, estado: Matricula['estado'], observaciones?: string) {
    const list = this.getMatriculas()
    const idx = list.findIndex(m => m.id === id)
    if (idx >= 0) {
      list[idx].estado = estado
      if (observaciones !== undefined) list[idx].observaciones = observaciones
      this.set('matriculas', list)
      return list[idx]
    }
    return null
  }

  // Comunicados
  getComunicados(): Comunicado[] { return this.get('comunicados', INITIAL_COMUNICADOS) }
  addComunicado(com: Comunicado): Comunicado {
    const list = this.getComunicados()
    list.unshift(com)
    this.set('comunicados', list)
    return com
  }

  // Temario del Día (RF-010)
  getTemarios(): TemarioDia[] { return this.get('temarios', INITIAL_TEMARIOS) }
  addTemario(temario: Omit<TemarioDia, 'id' | 'created_at'>): TemarioDia {
    const list = this.getTemarios()
    const nuevo: TemarioDia = {
      ...temario,
      id: `tem-${Date.now()}`,
      created_at: new Date().toISOString(),
    }
    list.unshift(nuevo)
    this.set('temarios', list)
    return nuevo
  }

  // Tareas y Avisos (RF-011)
  getTareas(): TareaAviso[] { return this.get('tareas', INITIAL_TAREAS) }
  addTarea(tarea: Omit<TareaAviso, 'id'>): TareaAviso {
    const list = this.getTareas()
    const nueva: TareaAviso = { ...tarea, id: `tar-${Date.now()}` }
    list.unshift(nueva)
    this.set('tareas', list)
    return nueva
  }

  // Calificaciones y Auditoría (RF-013, RF-014, RF-016)
  getNotas(): Nota[] { return this.get('notas', INITIAL_NOTAS) }
  getAuditoriaNotas(): AuditoriaNota[] { return this.get('auditoria_notas', INITIAL_AUDITORIA_NOTAS) }
  
  saveNota(payload: {
    alumno_id: string
    seccion_curso_id: string
    bimestre: 'I' | 'II' | 'III' | 'IV'
    competencia: string
    nota_dia: number
    nota_bimestral?: number
    conclusiones_descriptivas?: string
    usuario_nombre: string
    motivo_cambio?: string
  }) {
    const notas = this.getNotas()
    const audit = this.getAuditoriaNotas()
    const index = notas.findIndex(n => n.alumno_id === payload.alumno_id && n.seccion_curso_id === payload.seccion_curso_id && n.competencia === payload.competencia && n.bimestre === payload.bimestre)
    
    const getLiteral = (score: number): 'AD' | 'A' | 'B' | 'C' => {
      if (score >= 18) return 'AD'
      if (score >= 14) return 'A'
      if (score >= 11) return 'B'
      return 'C'
    }

    const bimestralCalculada = payload.nota_bimestral !== undefined ? payload.nota_bimestral : payload.nota_dia
    const literal = getLiteral(bimestralCalculada)
    const now = new Date().toISOString()

    if (index >= 0) {
      const notaPrevia = notas[index]
      if (notaPrevia.nota_dia !== payload.nota_dia || notaPrevia.nota_bimestral !== bimestralCalculada) {
        audit.unshift({
          id: `aud-${Date.now()}`,
          nota_id: notaPrevia.id,
          alumno_nombre: this.getAlumnos().find(a => a.id === payload.alumno_id)?.nombres + ' ' + this.getAlumnos().find(a => a.id === payload.alumno_id)?.apellidos || 'Alumno',
          curso_nombre: this.getSeccionesCursos().find(sc => sc.id === payload.seccion_curso_id)?.curso_nombre || 'Curso',
          usuario_modifica: payload.usuario_nombre,
          fecha: new Date().toLocaleString(),
          valor_anterior: `${notaPrevia.nota_dia} (Bim: ${notaPrevia.nota_bimestral})`,
          valor_nuevo: `${payload.nota_dia} (Bim: ${bimestralCalculada})`,
          motivo: payload.motivo_cambio || 'Ajuste docente en sistema',
        })
        this.set('auditoria_notas', audit)
      }

      notas[index] = {
        ...notas[index],
        nota_dia: payload.nota_dia,
        nota_bimestral: bimestralCalculada,
        calificacion_literal: literal,
        calificacion: literal,
        periodo: `Bimestre ${payload.bimestre}`,
        conclusiones_descriptivas: payload.conclusiones_descriptivas || notas[index].conclusiones_descriptivas,
        updated_at: now,
      }
    } else {
      notas.push({
        id: `not-${Date.now()}`,
        alumno_id: payload.alumno_id,
        seccion_curso_id: payload.seccion_curso_id,
        bimestre: payload.bimestre,
        competencia: payload.competencia,
        nota_dia: payload.nota_dia,
        nota_bimestral: bimestralCalculada,
        calificacion_literal: literal,
        calificacion: literal,
        periodo: `Bimestre ${payload.bimestre}`,
        conclusiones_descriptivas: payload.conclusiones_descriptivas,
        fecha_registro: now.split('T')[0],
        updated_at: now,
      })
    }
    this.set('notas', notas)
    return notas
  }

  // Asistencia (RF-020)
  getAsistencias(): Asistencia[] { return this.get('asistencias', INITIAL_ASISTENCIAS) }
  saveAsistencia(asistencia: Omit<Asistencia, 'id'>): Asistencia {
    const list = this.getAsistencias()
    const index = list.findIndex(a => a.alumno_id === asistencia.alumno_id && a.fecha === asistencia.fecha)
    if (index >= 0) {
      list[index] = { ...list[index], ...asistencia, sync_status: 'synced' }
    } else {
      list.push({ ...asistencia, id: `ast-${Date.now()}`, sync_status: 'synced' })
    }
    this.set('asistencias', list)

    // Si es falta o tardanza, disparar log de WhatsApp automático (RF-024)
    if (asistencia.estado === 'falta' || asistencia.estado === 'tardanza') {
      const alu = this.getAlumnos().find(a => a.id === asistencia.alumno_id)
      if (alu) {
        this.addWhatsAppLog({
          destinatario_nombre: alu.apoderado_nombre,
          telefono: alu.apoderado_telefono,
          tipo_evento: 'falta_tardanza',
          mensaje: `🔔 Colegio Sede Sapiens: Estimado apoderado, se ha registrado una ${asistencia.estado.toUpperCase()} para el alumno ${alu.nombres} ${alu.apellidos} el día ${asistencia.fecha}. ${asistencia.justificacion ? 'Detalle: ' + asistencia.justificacion : ''}`,
          estado: 'entregado',
        })
      }
    }

    return list[list.length - 1]
  }

  // Conducta e Incidencias (RF-021, RF-038)
  getConductas(): ConductaIncidencia[] { return this.get('conductas', INITIAL_CONDUCTAS) }
  addConducta(conducta: Omit<ConductaIncidencia, 'id'>): ConductaIncidencia {
    const list = this.getConductas()
    const nueva: ConductaIncidencia = { ...conducta, id: `cnd-${Date.now()}` }
    list.unshift(nueva)
    this.set('conductas', list)

    // Notificar por WhatsApp si aplica (RF-024)
    if (conducta.notificado_whatsapp) {
      const alu = this.getAlumnos().find(a => a.id === conducta.alumno_id)
      if (alu) {
        this.addWhatsAppLog({
          destinatario_nombre: alu.apoderado_nombre,
          telefono: alu.apoderado_telefono,
          tipo_evento: 'demerito_conducta',
          mensaje: `📋 Colegio Sede Sapiens: Registro de ${conducta.tipo.toUpperCase()} para ${conducta.alumno_nombre}: "${conducta.titulo} - ${conducta.descripcion}".`,
          estado: 'entregado',
        })
      }
    }

    return nueva
  }

  // Pagos y Mora (RF-032, RF-034, RF-050)
  getPagos(): Pago[] { return this.get('pagos', INITIAL_PAGOS) }
  getComprobantes(): ComprobantePago[] { return this.get('comprobantes', INITIAL_COMPROBANTES) }

  updatePago(id: string, update: Partial<Pago>) {
    const list = this.getPagos()
    const index = list.findIndex(p => p.id === id)
    if (index >= 0) {
      list[index] = { ...list[index], ...update }
      this.set('pagos', list)
      return list[index]
    }
    return null
  }

  subirComprobanteYape(payload: {
    pago_id: string
    alumno_id: string
    alumno_nombre: string
    apoderado_id: string
    apoderado_nombre: string
    periodo_concepto: string
    monto: number
    nro_operacion: string
    comprobante_url: string
  }): ComprobantePago {
    const comprobantes = this.getComprobantes()
    const nuevo: ComprobantePago = {
      ...payload,
      id: `cmp-${Date.now()}`,
      fecha_subida: new Date().toLocaleString(),
      estado: 'pendiente',
    }
    comprobantes.unshift(nuevo)
    this.set('comprobantes', comprobantes)

    // Actualizar estado del pago a 'en_revision'
    const pagos = this.getPagos()
    const pIdx = pagos.findIndex(p => p.id === payload.pago_id)
    if (pIdx >= 0) {
      pagos[pIdx].estado = 'en_revision'
      this.set('pagos', pagos)
    }

    return nuevo
  }

  // RF-053, RF-054: Aprobar o Rechazar Comprobante por Administrativo
  resolverComprobante(comprobante_id: string, accion: 'aprobar' | 'rechazar', revisor_nombre: string, motivo_rechazo?: string) {
    const comprobantes = this.getComprobantes()
    const pagos = this.getPagos()
    const alumnos = this.getAlumnos()

    const cIdx = comprobantes.findIndex(c => c.id === comprobante_id)
    if (cIdx < 0) return null

    const comp = comprobantes[cIdx]
    comp.estado = accion === 'aprobar' ? 'aprobado' : 'rechazado'
    comp.revisado_por = revisor_nombre
    comp.fecha_revision = new Date().toLocaleString()
    if (motivo_rechazo) comp.motivo_rechazo = motivo_rechazo

    const pIdx = pagos.findIndex(p => p.id === comp.pago_id)
    if (pIdx >= 0) {
      if (accion === 'aprobar') {
        pagos[pIdx].estado = 'pagado'
        pagos[pIdx].mora = 0
        pagos[pIdx].fecha_pago = new Date().toISOString().split('T')[0]
        pagos[pIdx].metodo_pago = 'yape_qr'
        pagos[pIdx].nro_operacion = comp.nro_operacion

        // Desbloquear mora del alumno si no tiene más deudas vencidas (RF-054)
        const aluIdx = alumnos.findIndex(a => a.id === comp.alumno_id)
        if (aluIdx >= 0) {
          const otrasDeudas = pagos.some(p => p.alumno_id === comp.alumno_id && p.id !== comp.pago_id && p.estado === 'vencido')
          alumnos[aluIdx].tiene_mora = otrasDeudas
          this.set('alumnos', alumnos)
        }

        // Enviar WhatsApp al padre (RF-100)
        this.addWhatsAppLog({
          destinatario_nombre: comp.apoderado_nombre,
          telefono: '+51 987 112 233',
          tipo_evento: 'pago_aprobado',
          mensaje: `✅ Colegio Sede Sapiens: Su pago por "${comp.periodo_concepto}" ha sido APROBADO. Su acceso a la libreta de notas ha sido habilitado.`,
          estado: 'entregado',
        })
      } else {
        pagos[pIdx].estado = 'vencido'
        // Enviar WhatsApp de rechazo (RF-055)
        this.addWhatsAppLog({
          destinatario_nombre: comp.apoderado_nombre,
          telefono: '+51 987 112 233',
          tipo_evento: 'pago_rechazado',
          mensaje: `❌ Colegio Sede Sapiens: Su comprobante por "${comp.periodo_concepto}" fue RECHAZADO. Motivo: ${motivo_rechazo || 'Voucher no legible'}. Por favor regularice su pago.`,
          estado: 'entregado',
        })
      }
      this.set('pagos', pagos)
    }

    this.set('comprobantes', comprobantes)
    return comp
  }

  // FUT - Formato Único de Trámite (RF-040 a RF-045, RF-060 a RF-062)
  getFuts(): FUT[] { return this.get('futs', INITIAL_FUTS) }
  addFut(fut: Omit<FUT, 'id' | 'correlativo' | 'historial_estados' | 'fecha_ingreso'>): FUT {
    const futs = this.getFuts()
    const correlativo = `FUT-2026-${String(futs.length + 43).padStart(4, '0')}`
    const nuevo: FUT = {
      ...fut,
      id: `fut-${Date.now()}`,
      correlativo,
      fecha_ingreso: new Date().toISOString().split('T')[0],
      historial_estados: [
        {
          fecha: new Date().toLocaleString(),
          usuario: fut.solicitante_nombre,
          estado_anterior: 'Nuevo',
          nuevo_estado: 'en_proceso',
          comentario: `Ingreso de trámite: ${fut.tipo_tramite}.`,
        }
      ]
    }
    futs.unshift(nuevo)
    this.set('futs', futs)

    // Enviar WhatsApp al solicitante
    this.addWhatsAppLog({
      destinatario_nombre: nuevo.solicitante_nombre,
      telefono: nuevo.telefono,
      tipo_evento: 'fut_actualizado',
      mensaje: `📑 Colegio Sede Sapiens: Su solicitud ${nuevo.correlativo} (${nuevo.tipo_tramite}) ha sido recibida y derivada a ${nuevo.oficina_derivada}.`,
      estado: 'entregado',
    })

    return nuevo
  }

  actualizarEstadoFut(id: string, nuevo_estado: 'en_proceso' | 'cumplido' | 'no_cumplido', usuario_nombre: string, comentario: string, resolucion_notas?: string) {
    const futs = this.getFuts()
    const idx = futs.findIndex(f => f.id === id)
    if (idx < 0) return null

    const f = futs[idx]
    const estado_anterior = f.estado
    f.estado = nuevo_estado
    if (resolucion_notas) f.resolucion_notas = resolucion_notas
    f.historial_estados.unshift({
      fecha: new Date().toLocaleString(),
      usuario: usuario_nombre,
      estado_anterior,
      nuevo_estado,
      comentario,
    })
    this.set('futs', futs)

    // Notificar WhatsApp
    this.addWhatsAppLog({
      destinatario_nombre: f.solicitante_nombre,
      telefono: f.telefono,
      tipo_evento: 'fut_actualizado',
      mensaje: `📑 Colegio Sede Sapiens: El estado de su expediente ${f.correlativo} cambió a ${nuevo_estado.toUpperCase()}. Detalle: ${comentario}`,
      estado: 'entregado',
    })

    return f
  }

  derivarFut(id: string, nueva_oficina: 'Dirección' | 'Secretaría Académica' | 'Psicología' | 'Coordinación Pedagógica', usuario_nombre: string) {
    const futs = this.getFuts()
    const idx = futs.findIndex(f => f.id === id)
    if (idx < 0) return null

    const f = futs[idx]
    const anterior = f.oficina_derivada
    f.oficina_derivada = nueva_oficina
    f.historial_estados.unshift({
      fecha: new Date().toLocaleString(),
      usuario: usuario_nombre,
      estado_anterior: f.estado,
      nuevo_estado: f.estado,
      comentario: `Expediente derivado de ${anterior} a ${nueva_oficina}.`,
    })
    this.set('futs', futs)
    return f
  }

  // Psicología (RF-070 a RF-073)
  getAtencionesPsicologia(): AtencionPsicologia[] { return this.get('psicologia_atenciones', INITIAL_ATENCIONES_PSICOLOGIA) }
  addAtencionPsicologia(atencion: Omit<AtencionPsicologia, 'id'>): AtencionPsicologia {
    const list = this.getAtencionesPsicologia()
    const nueva: AtencionPsicologia = { ...atencion, id: `psi-${Date.now()}` }
    list.unshift(nueva)
    this.set('psicologia_atenciones', list)
    return nueva
  }

  // Repositorio de Libros y Material (RF-090 a RF-092)
  getLibrosMaterial(): LibroMaterial[] { return this.get('libros_material', INITIAL_LIBROS_MATERIAL) }
  addLibroMaterial(item: Omit<LibroMaterial, 'id' | 'fecha_subida'>): LibroMaterial {
    const list = this.getLibrosMaterial()
    const nuevo: LibroMaterial = {
      ...item,
      id: `lib-${Date.now()}`,
      fecha_subida: new Date().toISOString().split('T')[0],
    }
    list.unshift(nuevo)
    this.set('libros_material', list)
    return nuevo
  }

  // WhatsApp Logs (RF-100 a RF-102)
  getWhatsAppLogs(): NotificacionWhatsApp[] { return this.get('whatsapp_logs', INITIAL_WHATSAPP_LOGS) }
  addWhatsAppLog(log: Omit<NotificacionWhatsApp, 'id' | 'fecha_hora'>): NotificacionWhatsApp {
    const list = this.getWhatsAppLogs()
    const nuevo: NotificacionWhatsApp = {
      ...log,
      id: `wsp-${Date.now()}`,
      fecha_hora: new Date().toLocaleString(),
    }
    list.unshift(nuevo)
    this.set('whatsapp_logs', list)
    return nuevo
  }
}

export const dataStore = new SedesStore()
