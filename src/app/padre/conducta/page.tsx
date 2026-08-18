'use client'

import React, { useState, useEffect } from 'react'
import {
  ClipboardList,
  Award,
  AlertOctagon,
  Info,
  Calendar,
  School,
  Sparkles
} from 'lucide-react'
import { dataStore, Alumno, ConductaIncidencia } from '@/lib/mock-data'

export default function PadreConductaPage() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null)
  const [conductas, setConductas] = useState<ConductaIncidencia[]>([])

  useEffect(() => {
    const allAlumnos = dataStore.getAlumnos()
    const misHijos = allAlumnos.filter((a) => a.apoderado_id === 'usr-pad-1' || a.id === 'alu-1' || a.id === 'alu-2' || a.id === 'alu-3')
    setAlumnos(misHijos)
    if (misHijos.length > 0) setSelectedAlumno(misHijos[0])
    setConductas(dataStore.getConductas())
  }, [])

  const childId = selectedAlumno?.id || 'alu-1'
  const childConductas = conductas.filter((c) => c.alumno_id === childId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
              RF-021 / RF-038
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Seguimiento Formativo & Disciplinario</span>
          </div>
          <h1 className="text-xl font-bold text-primary mt-1">
            Reporte de Conducta, Méritos e Incidencias
          </h1>
          <p className="text-xs text-on-surface-variant">
            Observaciones registradas por el auxiliar de educación y cuerpo tutorial del colegio.
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

      {/* Lista de Registros de Conducta */}
      <div className="space-y-4">
        {childConductas.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-outline-variant/30 text-center shadow-soft">
            <p className="text-xs text-on-surface-variant">
              No se registran incidencias disciplinarias para {selectedAlumno?.nombres}.
            </p>
          </div>
        ) : (
          childConductas.map((c) => {
            const isMerito = c.tipo === 'merito'
            const isDemerito = c.tipo === 'demerito'

            return (
              <div
                key={c.id}
                className={`p-6 rounded-2xl border transition-all shadow-soft space-y-2 ${
                  isMerito
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : isDemerito
                    ? 'bg-amber-50/60 border-amber-300'
                    : 'bg-white border-outline-variant/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isMerito
                          ? 'bg-emerald-600 text-white'
                          : isDemerito
                          ? 'bg-amber-600 text-white'
                          : 'bg-primary text-white'
                      }`}
                    >
                      {isMerito ? (
                        <Award className="w-4 h-4" />
                      ) : isDemerito ? (
                        <AlertOctagon className="w-4 h-4" />
                      ) : (
                        <Info className="w-4 h-4" />
                      )}
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        isMerito
                          ? 'bg-emerald-100 text-emerald-800'
                          : isDemerito
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-surface-container text-primary'
                      }`}
                    >
                      {c.tipo}
                    </span>
                    <span className="text-xs text-on-surface-variant flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {c.fecha}
                    </span>
                  </div>

                  <span className="text-[11px] text-on-surface-variant font-medium">
                    Registrado por: <span className="font-bold text-primary">{c.auxiliar_nombre}</span>
                  </span>
                </div>

                <h3 className="text-sm font-bold text-primary pt-1">{c.titulo}</h3>
                <p className="text-xs text-on-surface leading-relaxed">{c.descripcion}</p>

                {c.notificado_whatsapp && (
                  <p className="text-[10px] text-emerald-800 font-semibold pt-1">
                    ✓ Notificación enviada al WhatsApp del apoderado (RF-024)
                  </p>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
