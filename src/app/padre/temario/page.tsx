'use client'

import React, { useState, useEffect } from 'react'
import {
  BookOpenCheck,
  Calendar,
  School,
  Sparkles,
  Link2,
  FileText
} from 'lucide-react'
import { dataStore, Alumno, TemarioDia } from '@/lib/mock-data'

export default function PadreTemarioPage() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null)
  const [temarios, setTemarios] = useState<TemarioDia[]>([])

  useEffect(() => {
    const allAlumnos = dataStore.getAlumnos()
    const misHijos = allAlumnos.filter((a) => a.apoderado_id === 'usr-pad-1' || a.id === 'alu-1' || a.id === 'alu-2')
    setAlumnos(misHijos)
    if (misHijos.length > 0) setSelectedAlumno(misHijos[0])
    setTemarios(dataStore.getTemarios())
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
              RF-010 / RF-082
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Contenido Dictado en Clase</span>
          </div>
          <h1 className="text-xl font-bold text-primary mt-1">
            Temario del Día por Aula y Curso
          </h1>
          <p className="text-xs text-on-surface-variant">
            Revise lo trabajado hoy por los docentes para orientar el estudio de su hijo en casa.
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

      {/* Lista de Temarios */}
      <div className="space-y-4">
        {temarios.map((t) => (
          <div key={t.id} className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container pb-3">
              <div>
                <span className="text-xs font-bold text-secondary">{t.curso_nombre}</span>
                <h3 className="text-sm font-black text-primary">{t.tema_titulo}</h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-primary flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-secondary" />
                  {t.fecha}
                </span>
                <span className="text-[11px] text-on-surface-variant">Prof. {t.docente_nombre}</span>
              </div>
            </div>

            <p className="text-xs text-on-surface leading-relaxed">{t.descripcion}</p>

            {t.recursos_enlaces && t.recursos_enlaces.length > 0 && (
              <div className="pt-2 flex items-center gap-2">
                <span className="text-[11px] font-bold text-primary">Recurso de clase:</span>
                <a
                  href={t.recursos_enlaces[0]}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-secondary font-bold hover:underline"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Ver guía adjunta</span>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
