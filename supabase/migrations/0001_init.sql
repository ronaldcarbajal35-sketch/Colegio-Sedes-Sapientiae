-- =============================================================================
-- SISTEMA DE GESTIÓN ESCOLAR — COLEGIO SEDES SAPIENTIAE
-- Migración Inicial: Esquema Relacional, Enums, Triggers, RLS y Storage
-- =============================================================================

-- 1. TIPOS ENUMERADOS
CREATE TYPE rol AS ENUM ('direccion', 'secretaria', 'docente', 'padre');
CREATE TYPE estado_matricula AS ENUM ('postulante', 'en_evaluacion', 'matriculado', 'retirado');
CREATE TYPE estado_asistencia AS ENUM ('presente', 'tardanza', 'falta', 'justificado');
CREATE TYPE estado_pago AS ENUM ('pendiente', 'pagado', 'vencido', 'anulado');

-- 2. TABLA: perfiles (Extiende auth.users de Supabase)
CREATE TABLE IF NOT EXISTS perfiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  email TEXT,
  rol rol NOT NULL,
  telefono TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA: apoderados (Padres de familia o tutores legales)
CREATE TABLE IF NOT EXISTS apoderados (
  id UUID PRIMARY KEY REFERENCES perfiles(id) ON DELETE CASCADE,
  dni TEXT UNIQUE NOT NULL,
  direccion TEXT,
  ocupacion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA: docentes (Personal pedagógico)
CREATE TABLE IF NOT EXISTS docentes (
  id UUID PRIMARY KEY REFERENCES perfiles(id) ON DELETE CASCADE,
  especialidad TEXT,
  codigo_plaza TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLA: secciones (Aulas por grado, nivel y año escolar)
CREATE TABLE IF NOT EXISTS secciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,          -- Ej. "3ro A Primaria", "5to B Secundaria"
  grado TEXT NOT NULL,           -- Ej. "3ro", "5to"
  nivel TEXT NOT NULL,           -- "Inicial" | "Primaria" | "Secundaria"
  anio_escolar INT NOT NULL DEFAULT 2026,
  tutor_id UUID REFERENCES docentes(id) ON DELETE SET NULL,
  capacidad INT DEFAULT 30,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABLA: cursos (Áreas curriculares)
CREATE TABLE IF NOT EXISTS cursos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,          -- Ej. "Matemática", "Comunicación", "Ciencia y Tecnología"
  area_curricular TEXT NOT NULL, -- "Ciencias", "Humanidades", "Artes"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABLA: secciones_cursos (Asignación de cursos a secciones y docentes)
CREATE TABLE IF NOT EXISTS secciones_cursos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seccion_id UUID REFERENCES secciones(id) ON DELETE CASCADE NOT NULL,
  curso_id UUID REFERENCES cursos(id) ON DELETE CASCADE NOT NULL,
  docente_id UUID REFERENCES docentes(id) ON DELETE CASCADE NOT NULL,
  horas_semanales INT DEFAULT 4,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(seccion_id, curso_id, docente_id)
);

-- 8. TABLA: alumnos (Estudiantes del colegio)
CREATE TABLE IF NOT EXISTS alumnos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombres TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  dni TEXT UNIQUE NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  genero TEXT CHECK (genero IN ('M', 'F')),
  apoderado_id UUID REFERENCES apoderados(id) ON DELETE RESTRICT NOT NULL,
  seccion_id UUID REFERENCES secciones(id) ON DELETE SET NULL,
  codigo_estudiante TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TABLA: matriculas (Historial y proceso de matrícula anual)
CREATE TABLE IF NOT EXISTS matriculas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alumno_id UUID REFERENCES alumnos(id) ON DELETE CASCADE NOT NULL,
  anio_escolar INT NOT NULL DEFAULT 2026,
  estado estado_matricula DEFAULT 'postulante',
  documentos TEXT[],             -- Array de URLs/paths en Supabase Storage
  ficha_pdf_url TEXT,
  observaciones TEXT,
  costo_matricula NUMERIC(10,2) DEFAULT 350.00,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TABLA: notas (Evaluaciones por competencia en escala MINEDU)
CREATE TABLE IF NOT EXISTS notas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alumno_id UUID REFERENCES alumnos(id) ON DELETE CASCADE NOT NULL,
  seccion_curso_id UUID REFERENCES secciones_cursos(id) ON DELETE CASCADE NOT NULL,
  competencia TEXT NOT NULL,     -- Ej. "Resuelve problemas de cantidad"
  calificacion TEXT NOT NULL,    -- AD | A | B | C (Primaria/Secundaria)
  periodo TEXT NOT NULL,         -- "Bimestre 1", "Bimestre 2", "Bimestre 3", "Bimestre 4"
  conclusiones_descriptivas TEXT,
  sync_status TEXT DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending', 'conflict')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. TABLA: asistencias (Registro diario de asistencia por sesión)
CREATE TABLE IF NOT EXISTS asistencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alumno_id UUID REFERENCES alumnos(id) ON DELETE CASCADE NOT NULL,
  seccion_curso_id UUID REFERENCES secciones_cursos(id) ON DELETE CASCADE NOT NULL,
  fecha DATE NOT NULL,
  estado estado_asistencia NOT NULL DEFAULT 'presente',
  justificacion TEXT,
  sync_status TEXT DEFAULT 'synced' CHECK (sync_status IN ('synced', 'pending', 'conflict')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(alumno_id, seccion_curso_id, fecha)
);

-- 12. TABLA: pagos (Pensiones, matrículas y conceptos financieros)
CREATE TABLE IF NOT EXISTS pagos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alumno_id UUID REFERENCES alumnos(id) ON DELETE CASCADE NOT NULL,
  concepto TEXT NOT NULL,        -- Ej. "Matrícula 2026", "Pensión Marzo 2026"
  monto NUMERIC(10,2) NOT NULL,
  mora NUMERIC(10,2) DEFAULT 0.00,
  estado estado_pago DEFAULT 'pendiente',
  fecha_vencimiento DATE NOT NULL,
  fecha_pago TIMESTAMPTZ,
  metodo_pago TEXT,             -- "culqi", "yape_manual", "plin_manual", "efectivo"
  culqi_charge_id TEXT,
  comprobante_url TEXT,
  observaciones TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. TABLA: comunicados (Circulares, avisos y eventos institucionales)
CREATE TABLE IF NOT EXISTS comunicados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  contenido TEXT NOT NULL,
  categoria TEXT NOT NULL,       -- "Circular", "Evento", "Aviso urgente", "Académico"
  destinatarios TEXT NOT NULL,   -- 'todos', 'inicial', 'primaria', 'secundaria', o seccion_id UUID
  autor_id UUID REFERENCES perfiles(id) ON DELETE SET NULL,
  adjunto_url TEXT,
  enviar_whatsapp BOOLEAN DEFAULT FALSE,
  whatsapp_enviados INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- FUNCIONES AUXILIARES Y TRIGGERS DE AUTENTICACIÓN
-- =============================================================================

-- Función helper: Retorna el rol del usuario autenticado en la sesión
CREATE OR REPLACE FUNCTION auth_rol()
RETURNS rol AS $$
  SELECT rol FROM perfiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Trigger automático al crear un usuario en auth.users
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO perfiles (id, nombre, email, rol, telefono)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', 'Usuario Nuevo'),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'rol')::rol, 'padre'),
    NEW.raw_user_meta_data->>'telefono'
  );

  -- Si es padre, crear registro correspondiente en apoderados
  IF (NEW.raw_user_meta_data->>'rol' = 'padre') THEN
    INSERT INTO apoderados (id, dni)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'dni', '00000000'))
    ON CONFLICT (id) DO NOTHING;
  END IF;

  -- Si es docente, crear registro en docentes
  IF (NEW.raw_user_meta_data->>'rol' = 'docente') THEN
    INSERT INTO docentes (id, especialidad)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'especialidad', 'General'))
    ON CONFLICT (id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- =============================================================================
-- SEGURIDAD A NIVEL DE FILAS (ROW LEVEL SECURITY - RLS)
-- =============================================================================

-- Habilitar RLS en todas las tablas sensibles
ALTER TABLE perfiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE apoderados ENABLE ROW LEVEL SECURITY;
ALTER TABLE docentes ENABLE ROW LEVEL SECURITY;
ALTER TABLE secciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE secciones_cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE alumnos ENABLE ROW LEVEL SECURITY;
ALTER TABLE matriculas ENABLE ROW LEVEL SECURITY;
ALTER TABLE notas ENABLE ROW LEVEL SECURITY;
ALTER TABLE asistencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE pagos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comunicados ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- POLICIES: perfiles
-- -----------------------------------------------------------------------------
CREATE POLICY "Usuarios leen su propio perfil" ON perfiles
  FOR SELECT USING (auth.uid() = id OR auth_rol() IN ('direccion', 'secretaria'));

CREATE POLICY "Usuarios editan su propio perfil" ON perfiles
  FOR UPDATE USING (auth.uid() = id OR auth_rol() IN ('direccion'));

-- -----------------------------------------------------------------------------
-- POLICIES: alumnos
-- -----------------------------------------------------------------------------
CREATE POLICY "Padres ven solo sus hijos" ON alumnos
  FOR SELECT USING (
    auth_rol() = 'padre' AND apoderado_id = auth.uid()
  );

CREATE POLICY "Docentes ven alumnos de sus secciones" ON alumnos
  FOR SELECT USING (
    auth_rol() = 'docente' AND seccion_id IN (
      SELECT seccion_id FROM secciones_cursos WHERE docente_id = auth.uid()
    )
  );

CREATE POLICY "Staff ve todos los alumnos" ON alumnos
  FOR ALL USING (auth_rol() IN ('direccion', 'secretaria'));

-- -----------------------------------------------------------------------------
-- POLICIES: matriculas
-- -----------------------------------------------------------------------------
CREATE POLICY "Padres ven matriculas de sus hijos" ON matriculas
  FOR SELECT USING (
    auth_rol() = 'padre' AND alumno_id IN (
      SELECT id FROM alumnos WHERE apoderado_id = auth.uid()
    )
  );

CREATE POLICY "Padres pueden postular matricula de sus hijos" ON matriculas
  FOR INSERT WITH CHECK (
    auth_rol() = 'padre' AND alumno_id IN (
      SELECT id FROM alumnos WHERE apoderado_id = auth.uid()
    )
  );

CREATE POLICY "Staff gestiona matriculas" ON matriculas
  FOR ALL USING (auth_rol() IN ('direccion', 'secretaria'));

-- -----------------------------------------------------------------------------
-- POLICIES: notas
-- -----------------------------------------------------------------------------
CREATE POLICY "Padres ven notas de sus hijos" ON notas
  FOR SELECT USING (
    auth_rol() = 'padre' AND alumno_id IN (
      SELECT id FROM alumnos WHERE apoderado_id = auth.uid()
    )
  );

CREATE POLICY "Docentes gestionan notas de sus secciones" ON notas
  FOR ALL USING (
    auth_rol() = 'docente' AND seccion_curso_id IN (
      SELECT id FROM secciones_cursos WHERE docente_id = auth.uid()
    )
  );

CREATE POLICY "Staff ve y gestiona todas las notas" ON notas
  FOR ALL USING (auth_rol() IN ('direccion', 'secretaria'));

-- -----------------------------------------------------------------------------
-- POLICIES: asistencias
-- -----------------------------------------------------------------------------
CREATE POLICY "Padres ven asistencias de sus hijos" ON asistencias
  FOR SELECT USING (
    auth_rol() = 'padre' AND alumno_id IN (
      SELECT id FROM alumnos WHERE apoderado_id = auth.uid()
    )
  );

CREATE POLICY "Docentes registran asistencia en sus secciones" ON asistencias
  FOR ALL USING (
    auth_rol() = 'docente' AND seccion_curso_id IN (
      SELECT id FROM secciones_cursos WHERE docente_id = auth.uid()
    )
  );

CREATE POLICY "Staff gestiona todas las asistencias" ON asistencias
  FOR ALL USING (auth_rol() IN ('direccion', 'secretaria'));

-- -----------------------------------------------------------------------------
-- POLICIES: pagos
-- -----------------------------------------------------------------------------
CREATE POLICY "Padres ven pagos de sus hijos" ON pagos
  FOR SELECT USING (
    auth_rol() = 'padre' AND alumno_id IN (
      SELECT id FROM alumnos WHERE apoderado_id = auth.uid()
    )
  );

CREATE POLICY "Padres pueden adjuntar comprobante a sus pagos" ON pagos
  FOR UPDATE USING (
    auth_rol() = 'padre' AND alumno_id IN (
      SELECT id FROM alumnos WHERE apoderado_id = auth.uid()
    )
  );

CREATE POLICY "Staff gestiona todos los pagos" ON pagos
  FOR ALL USING (auth_rol() IN ('direccion', 'secretaria'));

-- -----------------------------------------------------------------------------
-- POLICIES: comunicados
-- -----------------------------------------------------------------------------
CREATE POLICY "Usuarios autenticados leen comunicados" ON comunicados
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff crea y gestiona comunicados" ON comunicados
  FOR ALL USING (auth_rol() IN ('direccion', 'secretaria'));

-- -----------------------------------------------------------------------------
-- POLICIES: secciones y cursos (Lectura general para autenticados)
-- -----------------------------------------------------------------------------
CREATE POLICY "Todos los autenticados leen secciones" ON secciones
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff gestiona secciones" ON secciones
  FOR ALL USING (auth_rol() IN ('direccion', 'secretaria'));

CREATE POLICY "Todos los autenticados leen cursos" ON cursos
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff gestiona cursos" ON cursos
  FOR ALL USING (auth_rol() IN ('direccion', 'secretaria'));

CREATE POLICY "Todos los autenticados leen secciones_cursos" ON secciones_cursos
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Staff gestiona secciones_cursos" ON secciones_cursos
  FOR ALL USING (auth_rol() IN ('direccion', 'secretaria'));

-- =============================================================================
-- STORAGE BUCKETS Y POLÍTICAS DE ACCESO
-- =============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('documentos-matricula', 'documentos-matricula', false),
  ('boletas', 'boletas', false),
  ('comprobantes-pago', 'comprobantes-pago', false),
  ('comunicados-adjuntos', 'comunicados-adjuntos', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de Storage
CREATE POLICY "Acceso a documentos matricula" ON storage.objects
  FOR ALL USING (
    bucket_id = 'documentos-matricula' AND (
      auth_rol() IN ('direccion', 'secretaria') OR 
      (auth.uid()::text = (storage.foldername(name))[1])
    )
  );

CREATE POLICY "Acceso a boletas" ON storage.objects
  FOR ALL USING (
    bucket_id = 'boletas' AND (
      auth_rol() IN ('direccion', 'secretaria', 'docente') OR 
      (auth.uid()::text = (storage.foldername(name))[1])
    )
  );

CREATE POLICY "Acceso a comprobantes de pago" ON storage.objects
  FOR ALL USING (
    bucket_id = 'comprobantes-pago' AND (
      auth_rol() IN ('direccion', 'secretaria') OR 
      (auth.uid()::text = (storage.foldername(name))[1])
    )
  );

CREATE POLICY "Lectura publica de comunicados adjuntos" ON storage.objects
  FOR SELECT USING (bucket_id = 'comunicados-adjuntos');

CREATE POLICY "Staff sube comunicados adjuntos" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'comunicados-adjuntos' AND auth_rol() IN ('direccion', 'secretaria')
  );
