-- =============================================================================
-- BASE DE DATOS RELACIONAL POSTGRESQL / SUPABASE (MÍNIMO 8 TABLAS)
-- EMPRESA: CONSTRUCTORA SALCEDO E INGENIEROS CONSULTORES E.I.R.L. "CSIC"
-- =============================================================================

-- 1. TABLA DE USUARIOS (Clientes, Ingenieros, Administradores)
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_completo VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    rol VARCHAR(50) NOT NULL DEFAULT 'cliente' CHECK (rol IN ('cliente', 'ingeniero', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABLA DE CATEGORÍAS (Especialidades de Ingeniería y Cursos)
CREATE TABLE IF NOT EXISTS categorias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLA DE INGENIEROS / ESPECIALISTAS CSIC
CREATE TABLE IF NOT EXISTS especialistas_ingenieros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    cip_colegiatura VARCHAR(50) NOT NULL UNIQUE,
    especialidad VARCHAR(100) NOT NULL, -- Ej. Estructuras, Saneamiento, Geotecnia, Topografía
    biografia TEXT,
    disponible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABLA DE SERVICIOS DE CONSULTORÍA TÉCNICA
CREATE TABLE IF NOT EXISTS servicios_consultoria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT NOT NULL,
    duracion_minutos INT NOT NULL DEFAULT 45,
    precio_estimado DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. TABLA DE RESERVAS DE CONSULTAS (Gestión de Citas)
CREATE TABLE IF NOT EXISTS reservas_consultas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_reserva VARCHAR(20) NOT NULL UNIQUE,
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    servicio_id UUID NOT NULL REFERENCES servicios_consultoria(id) ON DELETE RESTRICT,
    ingeniero_id UUID REFERENCES especialistas_ingenieros(id) ON DELETE SET NULL,
    fecha_reserva DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    estado VARCHAR(50) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'confirmada', 'atendida', 'cancelada')),
    notas_cliente TEXT,
    notas_ingeniero TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TABLA DE CURSOS DE CAPACITACIÓN
CREATE TABLE IF NOT EXISTS cursos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
    titulo VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    descripcion TEXT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    imagen_url TEXT,
    instructor_id UUID REFERENCES especialistas_ingenieros(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TABLA DE MÓDULOS DE CURSO
CREATE TABLE IF NOT EXISTS modulos_curso (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    curso_id UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    posicion INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. TABLA DE LECCIONES Y RECURSOS EN VIDEO
CREATE TABLE IF NOT EXISTS lecciones_curso (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    modulo_id UUID NOT NULL REFERENCES modulos_curso(id) ON DELETE CASCADE,
    titulo VARCHAR(255) NOT NULL,
    video_url TEXT NOT NULL,
    duracion_minutos INT DEFAULT 10,
    recurso_pdf_url TEXT,
    posicion INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. TABLA DE INSCRIPCIONES A CURSOS
CREATE TABLE IF NOT EXISTS inscripciones_cursos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    curso_id UUID NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
    estado_pago VARCHAR(50) DEFAULT 'completado' CHECK (estado_pago IN ('pendiente', 'completado', 'reembolsado')),
    progreso_porcentaje INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(usuario_id, curso_id)
);

-- 10. TABLA DE PAGOS Y TRANSACCIONES
CREATE TABLE IF NOT EXISTS pagos_transacciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    reserva_id UUID REFERENCES reservas_consultas(id) ON DELETE SET NULL,
    inscripcion_id UUID REFERENCES inscripciones_cursos(id) ON DELETE SET NULL,
    monto DECIMAL(10, 2) NOT NULL,
    metodo_pago VARCHAR(50) NOT NULL, -- 'Yape', 'Plin', 'Tarjeta', 'Transferencia'
    referencia_pago VARCHAR(100),
    estado VARCHAR(50) DEFAULT 'completado' CHECK (estado IN ('pendiente', 'completado', 'fallido')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- DATOS SEMILLA DE PRUEBA (SEED DATA)
-- =============================================================================

INSERT INTO categorias (nombre, slug, descripcion) VALUES
('Obras y Estructuras', 'estructuras', 'Consultoría en cálculo estructural y edificaciones'),
('Saneamiento y Agua', 'saneamiento', 'Proyectos de agua potable, alcantarillado e independización'),
('Geotecnia y Topografía', 'geotecnia', 'Estudios de suelos y levantamientos topográficos'),
('Cursos de Capacitación', 'capacitacion', 'Cursos técnicos para ingenieros y técnicos')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO servicios_consultoria (nombre, descripcion, duracion_minutos, precio_estimado) VALUES
('Asesoría en Licencias y Saneamiento Físico-Legal', 'Revisión técnica de expedientes para licencias de construcción y saneamiento de predios.', 45, 150.00),
('Evaluación Estructural de Edificaciones y Suelos', 'Inspección técnica en campo para verificación de cimentaciones y estructuras sismorresistentes.', 60, 250.00),
('Elaboración de Expedientes Técnicos y Presupuesto', 'Consultoría para revisión de valorizaciones, metrados y cronogramas de obra.', 60, 200.00)
ON CONFLICT DO NOTHING;

-- Habilitar Row Level Security (RLS)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservas_consultas ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicios_consultoria ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir lectura publica de servicios" ON servicios_consultoria FOR SELECT USING (true);
