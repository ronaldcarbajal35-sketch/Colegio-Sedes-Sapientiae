'use client'

import React, { useState, useEffect } from 'react'
import {
  FileText,
  HeartHandshake,
  Send,
  Calendar,
  Sparkles
} from 'lucide-react'
import { dataStore, AtencionPsicologia } from '@/lib/mock-data'

export default function PsicologiaDerivacionesPage() {
  const [atenciones, setAtenciones] = useState<AtencionPsicologia[]>([])

  useEffect(() => {
    setAtenciones(dataStore.getAtencionesPsicologia())
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
              RF-072
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Intervención Escolar</span>
          </div>
          <h1 className="text-xl font-bold text-primary mt-1">
            Derivaciones y Pautas a Docentes y Padres
          </h1>
          <p className="text-xs text-on-surface-variant">
            Recomendaciones psicopedagógicas emitidas para orientar el trabajo en el aula y en casa.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {atenciones.map((at) => (
          <div key={at.id} className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container pb-3">
              <div>
                <span className="text-xs font-black text-primary">{at.alumno_nombre}</span>
                <span className="text-xs text-secondary ml-2 font-bold">• Dirigido a: {at.derivado_a}</span>
              </div>
              <span className="text-xs text-on-surface-variant">{at.fecha}</span>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-primary">Pautas y Recomendaciones:</span>
              <p className="text-xs text-on-surface bg-surface-container/40 p-4 rounded-xl border border-outline-variant/20 leading-relaxed">
                {at.acuerdos_plan_accion}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
