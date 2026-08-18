-- =============================================================================
-- MIGRACIÓN INICIAL SUPABASE / POSTGRESQL 2026
-- COLEGIO SEDE SAPIENS — ESQUEMA RELACIONAL Y RLS
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS perfiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nombre VARCHAR(150) NOT NULL,
    apellidos VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    dni VARCHAR(15) NOT NULL UNIQUE,
    telefono VARCHAR(30),
    rol VARCHAR(30) NOT NULL CHECK (rol IN ('director', 'administrativo', 'docente', 'auxiliar', 'psicologo', 'padre', 'alumno')),
    cargo VARCHAR(150),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS secciones (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    grado VARCHAR(30) NOT NULL,
    seccion VARCHAR(10) NOT NULL,
    nivel VARCHAR(30) NOT NULL CHECK (nivel IN ('Inicial', 'Primaria', 'Secundaria')),
    anio_escolar INT NOT NULL DEFAULT 2026,
    capacidad INT NOT NULL DEFAULT 30,
    tutor_id UUID REFERENCES perfiles(id) ON DELETE SET NULL,
    auxiliar_id UUID REFERENCES perfiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alumnos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    codigo_estudiante VARCHAR(30) NOT NULL UNIQUE,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    dni VARCHAR(15) NOT NULL UNIQUE,
    fecha_nacimiento DATE NOT NULL,
    genero CHAR(1) CHECK (genero IN ('M', 'F')),
    seccion_id VARCHAR(50) NOT NULL REFERENCES secciones(id) ON DELETE RESTRICT,
    apoderado_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE RESTRICT,
    tiene_mora BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cursos (
    id VARCHAR(50) PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    area_curricular VARCHAR(100) NOT NULL,
    nivel VARCHAR(30) NOT NULL CHECK (nivel IN ('Inicial', 'Primaria', 'Secundaria')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS seccion_cursos (
    id VARCHAR(50) PRIMARY KEY,
    seccion_id VARCHAR(50) NOT NULL REFERENCES secciones(id) ON DELETE CASCADE,
    curso_id VARCHAR(50) NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
    docente_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE RESTRICT,
    horas_semanales INT NOT NULL DEFAULT 4,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(seccion_id, curso_id)
);

CREATE TABLE IF NOT EXISTS temarios_dia (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seccion_curso_id VARCHAR(50) NOT NULL REFERENCES seccion_cursos(id) ON DELETE CASCADE,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    tema_titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    recursos_enlaces TEXT[],
    docente_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tareas_avisos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seccion_curso_id VARCHAR(50) NOT NULL REFERENCES seccion_cursos(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_asignacion DATE NOT NULL DEFAULT CURRENT_DATE,
    fecha_limite DATE NOT NULL,
    bimestre VARCHAR(10) NOT NULL CHECK (bimestre IN ('I', 'II', 'III', 'IV')),
    tipo VARCHAR(20) NOT NULL DEFAULT 'tarea' CHECK (tipo IN ('tarea', 'aviso')),
    archivo_adjunto TEXT,
    docente_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS calificaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alumno_id UUID NOT NULL REFERENCES alumnos(id) ON DELETE CASCADE,
    seccion_curso_id VARCHAR(50) NOT NULL REFERENCES seccion_cursos(id) ON DELETE CASCADE,
    bimestre VARCHAR(10) NOT NULL CHECK (bimestre IN ('I', 'II', 'III', 'IV')),
    competencia VARCHAR(255) NOT NULL,
    nota_dia NUMERIC(4, 2) NOT NULL CHECK (nota_dia >= 0 AND nota_dia <= 20),
    nota_bimestral NUMERIC(4, 2) NOT NULL CHECK (nota_bimestral >= 0 AND nota_bimestral <= 20),
    calificacion_literal VARCHAR(5) NOT NULL CHECK (calificacion_literal IN ('AD', 'A', 'B', 'C')),
    conclusiones_descriptivas TEXT,
    docente_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE RESTRICT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(alumno_id, seccion_curso_id, bimestre, competencia)
);

CREATE TABLE IF NOT EXISTS auditoria_calificaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calificacion_id UUID NOT NULL REFERENCES calificaciones(id) ON DELETE CASCADE,
    alumno_id UUID NOT NULL REFERENCES alumnos(id) ON DELETE CASCADE,
    usuario_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE RESTRICT,
    valor_anterior VARCHAR(50) NOT NULL,
    valor_nuevo VARCHAR(50) NOT NULL,
    motivo TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS asistencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alumno_id UUID NOT NULL REFERENCES alumnos(id) ON DELETE CASCADE,
    seccion_id VARCHAR(50) NOT NULL REFERENCES secciones(id) ON DELETE CASCADE,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('presente', 'tardanza', 'falta', 'justificado')),
    justificacion TEXT,
    registrado_por UUID NOT NULL REFERENCES perfiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(alumno_id, fecha)
);

CREATE TABLE IF NOT EXISTS conducta_incidencias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alumno_id UUID NOT NULL REFERENCES alumnos(id) ON DELETE CASCADE,
    seccion_id VARCHAR(50) NOT NULL REFERENCES secciones(id) ON DELETE CASCADE,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('merito', 'demerito', 'observacion')),
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    auxiliar_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE RESTRICT,
    notificado_whatsapp BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pagos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alumno_id UUID NOT NULL REFERENCES alumnos(id) ON DELETE CASCADE,
    apoderado_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE RESTRICT,
    concepto VARCHAR(150) NOT NULL,
    monto NUMERIC(10, 2) NOT NULL,
    mora NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagado', 'vencido', 'en_revision', 'anulado')),
    fecha_vencimiento DATE NOT NULL,
    fecha_pago TIMESTAMP WITH TIME ZONE,
    metodo_pago VARCHAR(50),
    nro_operacion VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS comprobantes_yape (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pago_id UUID NOT NULL REFERENCES pagos(id) ON DELETE CASCADE,
    alumno_id UUID NOT NULL REFERENCES alumnos(id) ON DELETE CASCADE,
    apoderado_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE RESTRICT,
    periodo_concepto VARCHAR(150) NOT NULL,
    monto NUMERIC(10, 2) NOT NULL,
    nro_operacion VARCHAR(100) NOT NULL,
    comprobante_url TEXT NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'aprobado', 'rechazado')),
    motivo_rechazo TEXT,
    revisado_por UUID REFERENCES perfiles(id) ON DELETE SET NULL,
    fecha_subida TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    fecha_revision TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS tramites_fut (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    correlativo VARCHAR(30) NOT NULL UNIQUE,
    solicitante_id UUID REFERENCES perfiles(id) ON DELETE SET NULL,
    solicitante_nombre VARCHAR(150) NOT NULL,
    solicitante_rol VARCHAR(30) NOT NULL,
    dni VARCHAR(15) NOT NULL,
    telefono VARCHAR(30) NOT NULL,
    correo VARCHAR(150),
    tipo_tramite VARCHAR(100) NOT NULL,
    asunto TEXT NOT NULL,
    documento_adjunto TEXT,
    oficina_derivada VARCHAR(50) NOT NULL DEFAULT 'Secretaría Académica' CHECK (oficina_derivada IN ('Dirección', 'Secretaría Académica', 'Psicología', 'Coordinación Pedagógica')),
    estado VARCHAR(20) NOT NULL DEFAULT 'en_proceso' CHECK (estado IN ('en_proceso', 'cumplido', 'no_cumplido')),
    resolucion_notas TEXT,
    fecha_ingreso DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS atenciones_psicologia (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alumno_id UUID NOT NULL REFERENCES alumnos(id) ON DELETE CASCADE,
    psicologo_id UUID NOT NULL REFERENCES perfiles(id) ON DELETE RESTRICT,
    fecha DATE NOT NULL DEFAULT CURRENT_DATE,
    motivo VARCHAR(255) NOT NULL,
    observaciones_confidenciales TEXT NOT NULL,
    acuerdos_plan_accion TEXT NOT NULL,
    derivado_a VARCHAR(100),
    seguimiento_activo BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS repositorio_materiales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    tipo VARCHAR(30) NOT NULL CHECK (tipo IN ('libro', 'separata', 'guia_practica', 'evaluacion', 'multimedia')),
    nivel VARCHAR(30) NOT NULL CHECK (nivel IN ('Inicial', 'Primaria', 'Secundaria')),
    grado VARCHAR(30) NOT NULL,
    curso_id VARCHAR(50) REFERENCES cursos(id) ON DELETE SET NULL,
    bimestre VARCHAR(10) NOT NULL CHECK (bimestre IN ('I', 'II', 'III', 'IV')),
    url_descarga TEXT NOT NULL,
    tamano_mb VARCHAR(20),
    subido_por UUID NOT NULL REFERENCES perfiles(id) ON DELETE RESTRICT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS whatsapp_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    destinatario_nombre VARCHAR(150) NOT NULL,
    telefono VARCHAR(30) NOT NULL,
    tipo_evento VARCHAR(50) NOT NULL,
    mensaje TEXT NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'enviado' CHECK (estado IN ('enviado', 'entregado', 'leido')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
