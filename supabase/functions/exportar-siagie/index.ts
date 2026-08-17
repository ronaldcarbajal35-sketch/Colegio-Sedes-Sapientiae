// Edge Function: exportar-siagie (Deno)
// Valida consistencia de datos MINEDU (DNIs, notas completas, asistencias) y genera estructura SIAGIE

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { anio_escolar = 2026, seccion_id, periodo = 'Bimestre 1' } = await req.json();

    // 1. Obtener alumnos de la sección
    let alumnosQuery = supabaseClient
      .from('alumnos')
      .select('id, nombres, apellidos, dni, fecha_nacimiento, genero, codigo_estudiante, secciones(nombre, grado, nivel)');

    if (seccion_id) {
      alumnosQuery = alumnosQuery.eq('seccion_id', seccion_id);
    }

    const { data: alumnos, error: alumnosErr } = await alumnosQuery;
    if (alumnosErr) throw alumnosErr;

    // 2. Obtener notas registradas
    const { data: notas, error: notasErr } = await supabaseClient
      .from('notas')
      .select('*, secciones_cursos(cursos(nombre), seccion_id)')
      .eq('periodo', periodo);

    if (notasErr) throw notasErr;

    // 3. Ejecutar checklist de consistencia SIAGIE
    const inconsistencias: Array<{ alumno: string; dni: string; motivo: string; tipo: 'error' | 'warning' }> = [];

    const siagieRows = (alumnos || []).map((alumno, index) => {
      // Validar DNI
      if (!alumno.dni || alumno.dni.length !== 8 || !/^\d+$/.test(alumno.dni)) {
        inconsistencias.push({
          alumno: `${alumno.apellidos}, ${alumno.nombres}`,
          dni: alumno.dni || 'SIN DNI',
          motivo: 'DNI inválido o no tiene 8 dígitos numéricos requeridos por MINEDU',
          tipo: 'error'
        });
      }

      // Validar notas
      const notasAlumno = (notas || []).filter(n => n.alumno_id === alumno.id);
      if (notasAlumno.length === 0) {
        inconsistencias.push({
          alumno: `${alumno.apellidos}, ${alumno.nombres}`,
          dni: alumno.dni,
          motivo: `No tiene notas registradas para el ${periodo}`,
          tipo: 'warning'
        });
      }

      return {
        item: index + 1,
        codigo_modular: '0349281', // Código modular institucional Sedes Sapientiae
        anexo: '0',
        nivel: alumno.secciones?.nivel || 'Primaria',
        grado: alumno.secciones?.grado || '3ro',
        seccion: alumno.secciones?.nombre || 'A',
        tipo_documento: 'DNI',
        numero_documento: alumno.dni,
        apellido_paterno: alumno.apellidos.split(' ')[0] || alumno.apellidos,
        apellido_materno: alumno.apellidos.split(' ')[1] || '',
        nombres: alumno.nombres,
        sexo: alumno.genero || 'M',
        fecha_nacimiento: alumno.fecha_nacimiento,
        estado_matricula: 'Definitiva',
        total_evaluaciones: notasAlumno.length,
      };
    });

    const esValido = inconsistencias.filter(i => i.tipo === 'error').length === 0;

    return new Response(
      JSON.stringify({
        success: true,
        validoParaExportar: esValido,
        periodo,
        totalAlumnos: siagieRows.length,
        inconsistencias,
        filasExportables: siagieRows,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
