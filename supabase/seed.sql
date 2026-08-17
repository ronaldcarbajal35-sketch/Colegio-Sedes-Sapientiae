-- =============================================================================
-- SEED DATA: Colegio Sedes Sapientiae
-- Datos de prueba para Dirección, Secretaría, Docentes, Apoderados, Alumnos, Notas, Asistencias y Pagos
-- =============================================================================

-- 1. SECCIONES
INSERT INTO secciones (id, nombre, grado, nivel, anio_escolar, capacidad) VALUES
  ('a1111111-1111-1111-1111-111111111111', '3ro A Primaria', '3ro', 'Primaria', 2026, 25),
  ('a2222222-2222-2222-2222-222222222222', '5to B Secundaria', '5to', 'Secundaria', 2026, 28),
  ('a3333333-3333-3333-3333-333333333333', '1ro A Secundaria', '1ro', 'Secundaria', 2026, 30)
ON CONFLICT (id) DO NOTHING;

-- 2. CURSOS
INSERT INTO cursos (id, nombre, area_curricular) VALUES
  ('c1111111-1111-1111-1111-111111111111', 'Matemática', 'Ciencias'),
  ('c2222222-2222-2222-2222-222222222222', 'Comunicación Integral', 'Humanidades'),
  ('c3333333-3333-3333-3333-333333333333', 'Ciencia y Tecnología', 'Ciencias'),
  ('c4444444-4444-4444-4444-444444444444', 'Inglés Técnico', 'Idiomas'),
  ('c5555555-5555-5555-5555-555555555555', 'Ciencias Sociales', 'Humanidades')
ON CONFLICT (id) DO NOTHING;

-- 3. PERFILES DE PRUEBA
-- Nota: En producción estos coinciden con auth.users(id)
INSERT INTO perfiles (id, nombre, email, rol, telefono) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'Sor María del Carmen Rodríguez', 'direccion@sedes.edu.pe', 'direccion', '987654321'),
  ('d1000000-0000-0000-0000-000000000002', 'Lic. Patricia Valenzuela', 'secretaria@sedes.edu.pe', 'secretaria', '987654322'),
  ('d1000000-0000-0000-0000-000000000003', 'Prof. Carlos Alberto García Silva', 'docente.garcia@sedes.edu.pe', 'docente', '987654323'),
  ('d1000000-0000-0000-0000-000000000004', 'Prof. Laura Méndez Castillo', 'docente.mendez@sedes.edu.pe', 'docente', '987654324'),
  ('d1000000-0000-0000-0000-000000000005', 'Ing. Roberto Quispe Mamani', 'apoderado.quispe@gmail.com', 'padre', '987112233'),
  ('d1000000-0000-0000-0000-000000000006', 'Dra. Carmen Rosa Flores Díaz', 'apoderado.flores@gmail.com', 'padre', '987445566')
ON CONFLICT (id) DO NOTHING;

-- 4. DOCENTES
INSERT INTO docentes (id, especialidad, codigo_plaza) VALUES
  ('d1000000-0000-0000-0000-000000000003', 'Matemática y Física', 'PLZ-2026-081'),
  ('d1000000-0000-0000-0000-000000000004', 'Lengua y Literatura', 'PLZ-2026-082')
ON CONFLICT (id) DO NOTHING;

-- 5. APODERADOS
INSERT INTO apoderados (id, dni, direccion, ocupacion) VALUES
  ('d1000000-0000-0000-0000-000000000005', '43218765', 'Av. Primavera 450, Urb. Las Flores', 'Ingeniero de Sistemas'),
  ('d1000000-0000-0000-0000-000000000006', '71829304', 'Jr. Los Álamos 124, San Isidro', 'Médico Cirujano')
ON CONFLICT (id) DO NOTHING;

-- 6. ASIGNACIÓN SECCIONES-CURSOS
INSERT INTO secciones_cursos (id, seccion_id, curso_id, docente_id, horas_semanales) VALUES
  ('sc111111-1111-1111-1111-111111111111', 'a1111111-1111-1111-1111-111111111111', 'c1111111-1111-1111-1111-111111111111', 'd1000000-0000-0000-0000-000000000003', 6),
  ('sc222222-2222-2222-2222-222222222222', 'a1111111-1111-1111-1111-111111111111', 'c2222222-2222-2222-2222-222222222222', 'd1000000-0000-0000-0000-000000000004', 5),
  ('sc333333-3333-3333-3333-333333333333', 'a2222222-2222-2222-2222-222222222222', 'c1111111-1111-1111-1111-111111111111', 'd1000000-0000-0000-0000-000000000003', 6)
ON CONFLICT (id) DO NOTHING;

-- 7. ALUMNOS
INSERT INTO alumnos (id, nombres, apellidos, dni, fecha_nacimiento, genero, apoderado_id, seccion_id, codigo_estudiante) VALUES
  ('e1111111-1111-1111-1111-111111111111', 'Joaquín Andrés', 'Quispe Flores', '78912345', '2016-04-12', 'M', 'd1000000-0000-0000-0000-000000000005', 'a1111111-1111-1111-1111-111111111111', 'EST-2026-001'),
  ('e2222222-2222-2222-2222-222222222222', 'Valeria Sofía', 'Quispe Flores', '78912346', '2010-09-24', 'F', 'd1000000-0000-0000-0000-000000000005', 'a2222222-2222-2222-2222-222222222222', 'EST-2026-002'),
  ('e3333333-3333-3333-3333-333333333333', 'Mateo Sebastián', 'Flores Mendoza', '78912347', '2016-01-18', 'M', 'd1000000-0000-0000-0000-000000000006', 'a1111111-1111-1111-1111-111111111111', 'EST-2026-003'),
  ('e4444444-4444-4444-4444-444444444444', 'Luciana María', 'Sánchez Paz', '78912348', '2016-07-03', 'F', 'd1000000-0000-0000-0000-000000000006', 'a1111111-1111-1111-1111-111111111111', 'EST-2026-004')
ON CONFLICT (id) DO NOTHING;

-- 8. MATRÍCULAS
INSERT INTO matriculas (id, alumno_id, anio_escolar, estado, costo_matricula) VALUES
  ('m1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 2026, 'matriculado', 350.00),
  ('m2222222-2222-2222-2222-222222222222', 'e2222222-2222-2222-2222-222222222222', 2026, 'matriculado', 350.00),
  ('m3333333-3333-3333-3333-333333333333', 'e3333333-3333-3333-3333-333333333333', 2026, 'matriculado', 350.00),
  ('m4444444-4444-4444-4444-444444444444', 'e4444444-4444-4444-4444-444444444444', 2026, 'en_evaluacion', 350.00)
ON CONFLICT (id) DO NOTHING;

-- 9. NOTAS
INSERT INTO notas (id, alumno_id, seccion_curso_id, competencia, calificacion, periodo, sync_status) VALUES
  ('n1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 'sc111111-1111-1111-1111-111111111111', 'Resuelve problemas de cantidad', 'AD', 'Bimestre 1', 'synced'),
  ('n2222222-2222-2222-2222-222222222222', 'e1111111-1111-1111-1111-111111111111', 'sc111111-1111-1111-1111-111111111111', 'Resuelve problemas de forma y movimiento', 'A', 'Bimestre 1', 'synced'),
  ('n3333333-3333-3333-3333-333333333333', 'e1111111-1111-1111-1111-111111111111', 'sc222222-2222-2222-2222-222222222222', 'Se comunica oralmente en su lengua materna', 'AD', 'Bimestre 1', 'synced'),
  ('n4444444-4444-4444-4444-444444444444', 'e3333333-3333-3333-3333-333333333333', 'sc111111-1111-1111-1111-111111111111', 'Resuelve problemas de cantidad', 'B', 'Bimestre 1', 'synced'),
  ('n5555555-5555-5555-5555-555555555555', 'e4444444-4444-4444-4444-444444444444', 'sc111111-1111-1111-1111-111111111111', 'Resuelve problemas de cantidad', 'A', 'Bimestre 1', 'synced')
ON CONFLICT (id) DO NOTHING;

-- 10. ASISTENCIAS
INSERT INTO asistencias (alumno_id, seccion_curso_id, fecha, estado, sync_status) VALUES
  ('e1111111-1111-1111-1111-111111111111', 'sc111111-1111-1111-1111-111111111111', CURRENT_DATE, 'presente', 'synced'),
  ('e3333333-3333-3333-3333-333333333333', 'sc111111-1111-1111-1111-111111111111', CURRENT_DATE, 'tardanza', 'synced'),
  ('e4444444-4444-4444-4444-444444444444', 'sc111111-1111-1111-1111-111111111111', CURRENT_DATE, 'presente', 'synced')
ON CONFLICT (alumno_id, seccion_curso_id, fecha) DO NOTHING;

-- 11. PAGOS
INSERT INTO pagos (id, alumno_id, concepto, monto, estado, fecha_vencimiento, fecha_pago, metodo_pago) VALUES
  ('p1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 'Matrícula Escolar 2026', 350.00, 'pagado', '2026-02-15', '2026-02-10 10:30:00+00', 'culqi'),
  ('p2222222-2222-2222-2222-222222222222', 'e1111111-1111-1111-1111-111111111111', 'Pensión Marzo 2026', 420.00, 'pendiente', '2026-03-31', NULL, NULL),
  ('p3333333-3333-3333-3333-333333333333', 'e1111111-1111-1111-1111-111111111111', 'Pensión Abril 2026', 420.00, 'pendiente', '2026-04-30', NULL, NULL),
  ('p4444444-4444-4444-4444-444444444444', 'e2222222-2222-2222-2222-222222222222', 'Matrícula Escolar 2026', 350.00, 'pagado', '2026-02-15', '2026-02-11 15:45:00+00', 'culqi'),
  ('p5555555-5555-5555-5555-555555555555', 'e3333333-3333-3333-3333-333333333333', 'Pensión Marzo 2026', 420.00, 'vencido', '2026-03-10', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- 12. COMUNICADOS
INSERT INTO comunicados (id, titulo, contenido, categoria, destinatarios, autor_id, enviar_whatsapp, whatsapp_enviados) VALUES
  ('cm11111-1111-1111-1111-111111111111', 'Inicio del Año Escolar y Ceremonia de Apertura 2026', 'Estimada comunidad educativa Sedes Sapientiae, les damos una cordial bienvenida al ciclo escolar 2026. La ceremonia de apertura se llevará a cabo en el patio central a las 8:00 AM. Los alumnos deberán asistir con uniforme institucional completo.', 'Circular', 'todos', 'd1000000-0000-0000-0000-000000000001', true, 185),
  ('cm22222-2222-2222-2222-222222222222', 'Primera Reunión General de Padres de Familia - Primaria', 'Se convoca a los apoderados de nivel Primaria a la 1ra reunión de coordinación y presentación del plan tutorial el viernes 20 de marzo a las 6:30 PM vía auditorio escolar.', 'Evento', 'primaria', 'd1000000-0000-0000-0000-000000000002', true, 92)
ON CONFLICT (id) DO NOTHING;
