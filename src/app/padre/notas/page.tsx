'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  GraduationCap,
  Lock,
  QrCode,
  AlertTriangle,
  FileCheck2,
  TrendingUp,
  School,
  Sparkles,
  Info
} from 'lucide-react'
import { dataStore, Alumno, Nota, Pago } from '@/lib/mock-data'

export default function PadreNotasPage() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null)
  const [notas, setNotas] = useState<Nota[]>([])
  const [pagos, setPagos] = useState<Pago[]>([])
  const [selectedBimestre, setSelectedBimestre] = useState<'I' | 'II' | 'III' | 'IV'>('I')

  useEffect(() => {
    const allAlumnos = dataStore.getAlumnos()
    const misHijos = allAlumnos.filter((a) => a.apoderado_id === 'usr-pad-1' || a.id === 'alu-1' || a.id === 'alu-2' || a.id === 'alu-3')
    setAlumnos(misHijos)
    if (misHijos.length > 0) {
      setSelectedAlumno(misHijos[0])
    }
    setNotas(dataStore.getNotas())
    setPagos(dataStore.getPagos())
  }, [])

  const childId = selectedAlumno?.id || 'alu-1'
  const childPagos = pagos.filter((p) => p.alumno_id === childId)
  const tieneMora = childPagos.some((p) => p.estado === 'vencido' || p.mora > 0)
  const deudasVencidas = childPagos.filter((p) => p.estado === 'vencido' || p.mora > 0)
  const childNotas = notas.filter((n) => n.alumno_id === childId && n.bimestre === selectedBimestre)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary">
              RF-030 / RF-034
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Bimestre {selectedBimestre} — Año 2026</span>
          </div>
          <h1 className="text-xl font-bold text-primary mt-1">
            Libreta de Calificaciones Escolar
          </h1>
          <p className="text-xs text-on-surface-variant">
            Notas diarias y promedios consolidados bimestrales por competencias curriculares.
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
              {pagos.some(p => p.alumno_id === hijo.id && (p.estado === 'vencido' || p.mora > 0)) && (
                <span className="w-2 h-2 rounded-full bg-amber-500" title="Tiene mora" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Selector de Bimestre */}
      <div className="flex gap-2">
        {(['I', 'II', 'III', 'IV'] as const).map((bim) => (
          <button
            key={bim}
            onClick={() => setSelectedBimestre(bim)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedBimestre === bim
                ? 'bg-secondary text-white shadow'
                : 'bg-white border border-outline-variant/30 text-on-surface hover:bg-surface-container'
            }`}
          >
            Bimestre {bim}
          </button>
        ))}
      </div>

      {/* BLOQUEO POR MORA (RF-034) */}
      {tieneMora ? (
        <div className="bg-white rounded-3xl border-2 border-amber-300 p-8 sm:p-12 text-center shadow-soft relative overflow-hidden">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center shadow-inner">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-amber-950">
                Visualización de Calificaciones Bloqueada (RF-034)
              </h3>
              <p className="text-xs text-amber-900/80 leading-relaxed">
                Estimado apoderado, el estudiante <span className="font-bold">{selectedAlumno?.nombres}</span> presenta un saldo pendiente por concepto de pensión escolar.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-left space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-amber-950">
                <span>Concepto adeudado:</span>
                <span>{deudasVencidas[0]?.concepto}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-amber-900">
                <span>Monto + Mora administrativa:</span>
                <span className="font-black text-sm text-error">
                  S/ {(deudasVencidas[0]?.monto || 0) + (deudasVencidas[0]?.mora || 0)}.00
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/padre/pagos"
                className="w-full py-3 px-6 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all"
              >
                <QrCode className="w-4 h-4" />
                <span>Pagar con Yape QR y Desbloquear Notas</span>
              </Link>
              <p className="text-[11px] text-on-surface-variant mt-2">
                Al subir su comprobante y ser aprobado por secretaría, las calificaciones se desbloquearán de forma automática (RF-054).
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* TABLA DE CALIFICACIONES HABILITADA */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-outline-variant/30 shadow-soft">
              <span className="text-xs text-on-surface-variant font-medium">Promedio Bimestral Actual</span>
              <p className="text-2xl font-black text-primary mt-1">18.0 / 20</p>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded mt-2 inline-block">
                Nivel Logro: AD (Destacado)
              </span>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-outline-variant/30 shadow-soft">
              <span className="text-xs text-on-surface-variant font-medium">Competencias Evaluadas</span>
              <p className="text-2xl font-black text-primary mt-1">{childNotas.length} Registros</p>
              <span className="text-[11px] text-on-surface-variant mt-2 inline-block">
                Evaluación formativa continua
              </span>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-outline-variant/30 shadow-soft">
              <span className="text-xs text-on-surface-variant font-medium">Conducta y Asistencia</span>
              <p className="text-2xl font-black text-emerald-600 mt-1">Sobresaliente</p>
              <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded mt-2 inline-block">
                100% Asistencia puntual
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-soft overflow-hidden">
            <div className="p-5 border-b border-surface-container flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-primary">Detalle de Calificaciones por Curso</h3>
                <p className="text-xs text-on-surface-variant">Notas del día (RF-013) y consolidación bimestral (RF-014)</p>
              </div>
            </div>

            <div className="divide-y divide-surface-container">
              {childNotas.map((nota) => (
                <div key={nota.id} className="p-5 space-y-2 hover:bg-surface-container/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-primary">
                        {nota.seccion_curso_id.includes('mat') ? 'Matemática y Razonamiento' : 'Comunicación y Literatura'}
                      </span>
                      <p className="text-xs text-on-surface font-medium">{nota.competencia}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-on-surface-variant block uppercase">Nota del Día</span>
                        <span className="text-xs font-bold text-primary">{nota.nota_dia} / 20</span>
                      </div>
                      <div className="text-right pl-3 border-l border-outline-variant/30">
                        <span className="text-[10px] text-on-surface-variant block uppercase">Nota Bimestral</span>
                        <span className="text-base font-black text-primary">{nota.nota_bimestral}</span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-black ${
                        nota.calificacion_literal === 'AD'
                          ? 'bg-purple-100 text-purple-800'
                          : nota.calificacion_literal === 'A'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {nota.calificacion_literal}
                      </span>
                    </div>
                  </div>

                  {nota.conclusiones_descriptivas && (
                    <div className="p-3 rounded-xl bg-surface-container/60 text-xs text-on-surface-variant flex items-start gap-2 border border-outline-variant/20">
                      <Info className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-primary">Conclusión descriptiva docente: </span>
                        <span>{nota.conclusiones_descriptivas}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
