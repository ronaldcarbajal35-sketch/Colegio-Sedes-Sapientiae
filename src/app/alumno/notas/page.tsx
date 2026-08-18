'use client'

import React, { useState, useEffect } from 'react'
import {
  GraduationCap,
  Sparkles,
  Info
} from 'lucide-react'
import { dataStore, Nota } from '@/lib/mock-data'

export default function AlumnoNotasPage() {
  const [notas, setNotas] = useState<Nota[]>([])
  const [selectedBimestre, setSelectedBimestre] = useState<'I' | 'II' | 'III' | 'IV'>('I')

  useEffect(() => {
    // Alumno Joaquín (alu-1)
    const allNotas = dataStore.getNotas().filter(n => n.alumno_id === 'alu-1')
    setNotas(allNotas)
  }, [])

  const bimNotas = notas.filter(n => n.bimestre === selectedBimestre)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
              RF-084
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Bimestre {selectedBimestre}</span>
          </div>
          <h1 className="text-xl font-bold text-primary mt-1">
            Mis Calificaciones y Logros
          </h1>
          <p className="text-xs text-on-surface-variant">
            Consulta tus notas del día y promedios bimestrales registrados por tus docentes.
          </p>
        </div>

        <div className="flex gap-1.5">
          {(['I', 'II', 'III', 'IV'] as const).map((bim) => (
            <button
              key={bim}
              onClick={() => setSelectedBimestre(bim)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedBimestre === bim
                  ? 'bg-secondary text-white shadow'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container/80'
              }`}
            >
              Bimestre {bim}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-soft overflow-hidden">
        <div className="p-4 border-b border-surface-container flex items-center justify-between">
          <h3 className="text-xs font-bold text-primary">Cursos y Competencias Evaluadas</h3>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded">
            Nivel: AD / A
          </span>
        </div>

        <div className="divide-y divide-surface-container">
          {bimNotas.map((nota) => (
            <div key={nota.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-surface-container/20 transition-colors">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-primary">
                  {nota.seccion_curso_id.includes('mat') ? 'Matemática y Razonamiento' : 'Comunicación y Literatura'}
                </span>
                <p className="text-xs text-on-surface">{nota.competencia}</p>
                {nota.conclusiones_descriptivas && (
                  <p className="text-[11px] text-secondary font-medium mt-1">
                    Nota docente: {nota.conclusiones_descriptivas}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] text-on-surface-variant block uppercase">Nota</span>
                  <span className="text-base font-black text-primary">{nota.nota_bimestral} / 20</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-purple-100 text-purple-800">
                  {nota.calificacion_literal}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
