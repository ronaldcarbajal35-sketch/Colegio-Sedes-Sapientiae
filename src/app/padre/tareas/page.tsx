'use client'

import React, { useState, useEffect } from 'react'
import {
  CheckSquare,
  Clock,
  Download,
  Calendar,
  School,
  Sparkles,
  BookOpen
} from 'lucide-react'
import { dataStore, Alumno, TareaAviso } from '@/lib/mock-data'

export default function PadreTareasPage() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null)
  const [tareas, setTareas] = useState<TareaAviso[]>([])

  useEffect(() => {
    const allAlumnos = dataStore.getAlumnos()
    const misHijos = allAlumnos.filter((a) => a.apoderado_id === 'usr-pad-1' || a.id === 'alu-1' || a.id === 'alu-2')
    setAlumnos(misHijos)
    if (misHijos.length > 0) setSelectedAlumno(misHijos[0])
    setTareas(dataStore.getTareas())
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">
              RF-037 / RF-080
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Bimestre I — Ciclo 2026</span>
          </div>
          <h1 className="text-xl font-bold text-primary mt-1">
            Tareas, Actividades y Avisos Académicos
          </h1>
          <p className="text-xs text-on-surface-variant">
            Monitoreo de tareas asignadas por los docentes con cronograma y fecha límite de entrega.
          </p>
        </div>

        {/* Selector de Hijo */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-surface-container border border-outline-variant/40">
          {alumnos.map((hijo) => (
            <button
              key={hijo.id}
              onClick={() => setSelectedAlumno(hijo)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                selectedAlumno?.id === hijo.id
                  ? 'bg-primary text-white shadow-md'
                  : 'text-on-surface-variant hover:text-primary hover:bg-white/60'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              <span>{hijo.nombres.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Tareas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tareas.map((t) => (
          <div key={t.id} className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                  {t.curso_nombre}
                </span>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Entrega: {t.fecha_limite}
                </span>
              </div>

              <h3 className="text-sm font-bold text-primary">{t.titulo}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">{t.descripcion}</p>
            </div>

            <div className="pt-3 border-t border-surface-container flex items-center justify-between text-xs">
              <span className="text-[11px] text-on-surface-variant font-medium">
                Prof: {t.docente_nombre}
              </span>
              {t.archivo_adjunto && (
                <button className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container/80 text-primary text-xs font-bold flex items-center gap-1.5 transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  <span>Ficha PDF</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
