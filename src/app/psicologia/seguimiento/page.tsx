'use client'

import React, { useState, useEffect } from 'react'
import {
  Users2,
  GraduationCap,
  CalendarCheck2,
  ClipboardList,
  Search,
  School
} from 'lucide-react'
import { dataStore, Alumno, Nota, Asistencia, ConductaIncidencia } from '@/lib/mock-data'

export default function PsicologiaSeguimientoPage() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [selectedAlumnoId, setSelectedAlumnoId] = useState('alu-3')
  const [notas, setNotas] = useState<Nota[]>([])
  const [asistencias, setAsistencias] = useState<Asistencia[]>([])
  const [conductas, setConductas] = useState<ConductaIncidencia[]>([])

  useEffect(() => {
    setAlumnos(dataStore.getAlumnos())
    setNotas(dataStore.getNotas())
    setAsistencias(dataStore.getAsistencias())
    setConductas(dataStore.getConductas())
  }, [])

  const selectedAlumno = alumnos.find(a => a.id === selectedAlumnoId) || alumnos[0]
  const aluNotas = notas.filter(n => n.alumno_id === selectedAlumnoId)
  const aluConductas = conductas.filter(c => c.alumno_id === selectedAlumnoId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
              RF-071
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Seguimiento Psicopedagógico</span>
          </div>
          <h1 className="text-xl font-bold text-primary mt-1">
            Historial Integral del Alumno (Académico & Conducta)
          </h1>
          <p className="text-xs text-on-surface-variant">
            Consulta cruzada de rendimiento, asistencias y reportes del auxiliar para diagnósticos precisos.
          </p>
        </div>
      </div>

      {/* Selector de Alumno */}
      <div className="bg-white p-4 rounded-2xl border border-outline-variant/30 shadow-soft flex items-center gap-3">
        <span className="text-xs font-bold text-primary">Seleccionar Estudiante:</span>
        <select
          value={selectedAlumnoId}
          onChange={(e) => setSelectedAlumnoId(e.target.value)}
          className="flex-1 max-w-md px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface-container/50 text-xs font-bold text-primary"
        >
          {alumnos.map((a) => (
            <option key={a.id} value={a.id}>
              {a.nombres} {a.apellidos} — ({a.seccion_nombre})
            </option>
          ))}
        </select>
      </div>

      {/* Ficha Integral */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Historial Académico */}
        <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-container pb-3">
            <GraduationCap className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-bold text-primary">Calificaciones y Rendimiento (RF-071)</h2>
          </div>

          <div className="space-y-3">
            {aluNotas.map((n) => (
              <div key={n.id} className="p-3.5 rounded-xl bg-surface-container/40 border border-outline-variant/20 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-primary block">{n.competencia}</span>
                  <span className="text-[11px] text-on-surface-variant">Bimestre {n.bimestre}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-primary block">{n.nota_bimestral} / 20</span>
                  <span className="text-[10px] font-bold text-emerald-800">{n.calificacion_literal}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Historial Conductual */}
        <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-container pb-3">
            <ClipboardList className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-bold text-primary">Historial Disciplinario del Auxiliar</h2>
          </div>

          <div className="space-y-3">
            {aluConductas.length === 0 ? (
              <p className="text-xs text-on-surface-variant py-4 text-center">
                ✓ Sin incidencias disciplinarias registradas.
              </p>
            ) : (
              aluConductas.map((c) => (
                <div key={c.id} className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-950 uppercase">{c.tipo}</span>
                    <span className="text-on-surface-variant text-[11px]">{c.fecha}</span>
                  </div>
                  <p className="text-xs font-semibold text-primary">{c.titulo}</p>
                  <p className="text-xs text-on-surface leading-relaxed">{c.descripcion}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
