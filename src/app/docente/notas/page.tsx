'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/input'
import { BookOpenCheck, CheckCircle2, Clock, Save, Sparkles, Wifi, WifiOff, Users, ArrowRight } from 'lucide-react'
import { dataStore, type Seccion, type Alumno, type Nota } from '@/lib/mock-data'
import { syncManager } from '@/lib/sync-queue'

function DocenteNotasContent() {
  const searchParams = useSearchParams()
  const initialSeccion = searchParams.get('seccion') || 'sec-3a-pri'

  const [secciones, setSecciones] = useState<Seccion[]>([])
  const [selectedSeccion, setSelectedSeccion] = useState<string>(initialSeccion)
  const [selectedPeriodo, setSelectedPeriodo] = useState<string>('Bimestre 1')
  const [selectedCompetencia, setSelectedCompetencia] = useState<string>('Resuelve problemas de cantidad')
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [notas, setNotas] = useState<Record<string, { calificacion: 'AD'|'A'|'B'|'C'; conclusiones?: string; sync_status: 'synced'|'pending' }>>({})
  const [saveStatus, setSaveStatus] = useState<string | null>(null)

  const competencias = [
    'Resuelve problemas de cantidad',
    'Resuelve problemas de forma, movimiento y localización',
    'Resuelve problemas de regularidad, equivalencia y cambio',
    'Resuelve problemas de gestión de datos e incertidumbre',
  ]

  const loadData = () => {
    const secList = dataStore.getSecciones()
    setSecciones(secList)

    const allAlu = dataStore.getAlumnos().filter(a => a.seccion_id === selectedSeccion)
    setAlumnos(allAlu)

    const allNotas = dataStore.getNotas().filter(n => n.periodo === selectedPeriodo && n.competencia === selectedCompetencia)
    const map: Record<string, { calificacion: 'AD'|'A'|'B'|'C'; conclusiones?: string; sync_status: 'synced'|'pending' }> = {}

    allAlu.forEach((alu) => {
      const match = allNotas.find(n => n.alumno_id === alu.id)
      if (match) {
        map[alu.id] = {
          calificacion: match.calificacion,
          conclusiones: match.conclusiones_descriptivas,
          sync_status: match.sync_status === 'pending' ? 'pending' : 'synced',
        }
      }
    })
    setNotas(map)
  }

  useEffect(() => {
    loadData()
  }, [selectedSeccion, selectedPeriodo, selectedCompetencia])

  const handleSetCalificacion = async (alumnoId: string, grade: 'AD' | 'A' | 'B' | 'C') => {
    const current = notas[alumnoId] || {}
    const updated = {
      ...current,
      calificacion: grade,
      sync_status: (typeof navigator !== 'undefined' && navigator.onLine ? 'synced' : 'pending') as 'synced' | 'pending',
    }

    setNotas(prev => ({
      ...prev,
      [alumnoId]: updated,
    }))

    // Guardar en store y pasar por motor offline-first
    dataStore.saveNota({
      alumno_id: alumnoId,
      seccion_curso_id: 'sc-3a-mat',
      competencia: selectedCompetencia,
      calificacion: grade,
      periodo: selectedPeriodo,
      conclusiones_descriptivas: current.conclusiones,
    })

    await syncManager.guardarNota({
      alumno_id: alumnoId,
      seccion_curso_id: 'sc-3a-mat',
      competencia: selectedCompetencia,
      calificacion: grade,
      periodo: selectedPeriodo,
      conclusiones_descriptivas: current.conclusiones,
    })

    setSaveStatus(`Calificación de estudiante guardada (${grade})`)
    setTimeout(() => setSaveStatus(null), 2500)
  }

  const handleSetConclusion = (alumnoId: string, text: string) => {
    const current = notas[alumnoId]
    if (!current) return

    setNotas(prev => ({
      ...prev,
      [alumnoId]: { ...current, conclusiones: text },
    }))

    dataStore.saveNota({
      alumno_id: alumnoId,
      seccion_curso_id: 'sc-3a-mat',
      competencia: selectedCompetencia,
      calificacion: current.calificacion,
      periodo: selectedPeriodo,
      conclusiones_descriptivas: text,
    })
  }

  const handleFillAll = (grade: 'AD' | 'A' | 'B' | 'C') => {
    alumnos.forEach((alu) => {
      handleSetCalificacion(alu.id, grade)
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-primary tracking-tight flex items-center gap-2">
            <BookOpenCheck className="w-6 h-6 text-secondary" />
            <span>Registro de Calificaciones (MINEDU)</span>
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Evaluación formativa y cualitativa con soporte Offline-First (Dexie.js + Supabase)
          </p>
        </div>

        {saveStatus && (
          <div className="px-3.5 py-1.5 rounded-xl bg-success-container text-success border border-success/30 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveStatus}</span>
          </div>
        )}
      </div>

      {/* Control Filters Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-outline-variant/30 shadow-card grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Select
          label="Sección y Grado"
          value={selectedSeccion}
          onChange={(e) => setSelectedSeccion(e.target.value)}
        >
          {secciones.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre} ({s.nivel})
            </option>
          ))}
        </Select>

        <Select
          label="Periodo Académico"
          value={selectedPeriodo}
          onChange={(e) => setSelectedPeriodo(e.target.value)}
        >
          <option value="Bimestre 1">Bimestre 1</option>
          <option value="Bimestre 2">Bimestre 2</option>
          <option value="Bimestre 3">Bimestre 3</option>
          <option value="Bimestre 4">Bimestre 4</option>
        </Select>

        <Select
          label="Competencia Curricular"
          value={selectedCompetencia}
          onChange={(e) => setSelectedCompetencia(e.target.value)}
        >
          {competencias.map((comp) => (
            <option key={comp} value={comp}>
              {comp}
            </option>
          ))}
        </Select>
      </div>

      {/* Quick Fill Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-container/60 p-3.5 rounded-xl border border-outline-variant/30 text-xs">
        <div className="flex items-center gap-2 font-bold text-primary">
          <Sparkles className="w-4 h-4 text-secondary" />
          <span>Llenado Rápido para todos los alumnos:</span>
        </div>
        <div className="flex items-center gap-2">
          {(['AD', 'A', 'B', 'C'] as const).map((grade) => (
            <button
              key={grade}
              onClick={() => handleFillAll(grade)}
              className="px-2.5 py-1 rounded-lg font-bold bg-white hover:bg-primary hover:text-white border border-outline-variant/30 text-primary shadow-xs transition-colors"
            >
              Asignar {grade}
            </button>
          ))}
        </div>
      </div>

      {/* Student Evaluation Matrix Table */}
      <Card>
        <CardHeader className="bg-surface flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Lista de Estudiantes — {alumnos.length} Alumnos</CardTitle>
            <p className="text-xs text-on-surface-variant">{selectedCompetencia}</p>
          </div>
          <span className="text-xs font-bold text-primary">{selectedPeriodo}</span>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-surface-container/60 border-b border-surface-container text-on-surface-variant font-semibold text-[11px] uppercase tracking-wider">
                <th className="p-4 w-12 text-center">N°</th>
                <th className="p-4">Apellidos y Nombres</th>
                <th className="p-4">DNI</th>
                <th className="p-4 text-center">Calificación (MINEDU)</th>
                <th className="p-4">Conclusión Descriptiva / Observación</th>
                <th className="p-4 text-center">Sync</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {alumnos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-on-surface-variant">
                    No hay estudiantes registrados en esta sección.
                  </td>
                </tr>
              ) : (
                alumnos.map((alumno, index) => {
                  const currentNota = notas[alumno.id]
                  const cal = currentNota?.calificacion

                  return (
                    <tr key={alumno.id} className="hover:bg-surface-container/20 transition-colors">
                      <td className="p-4 text-center font-bold text-on-surface-variant">{index + 1}</td>
                      <td className="p-4 font-bold text-primary">
                        {alumno.apellidos}, {alumno.nombres}
                      </td>
                      <td className="p-4 text-on-surface-variant font-mono text-xs">{alumno.dni}</td>
                      <td className="p-4 text-center">
                        <div className="inline-flex items-center gap-1 p-1 bg-surface-container/80 rounded-xl border border-outline-variant/40">
                          {(['AD', 'A', 'B', 'C'] as const).map((grade) => {
                            const isSelected = cal === grade
                            return (
                              <button
                                key={grade}
                                onClick={() => handleSetCalificacion(alumno.id, grade)}
                                className={`w-8 h-8 rounded-lg font-bold text-xs transition-all ${
                                  isSelected
                                    ? grade === 'AD'
                                      ? 'bg-emerald-600 text-white shadow'
                                      : grade === 'A'
                                      ? 'bg-blue-600 text-white shadow'
                                      : grade === 'B'
                                      ? 'bg-amber-600 text-white shadow'
                                      : 'bg-rose-600 text-white shadow'
                                    : 'text-on-surface-variant hover:bg-white'
                                }`}
                              >
                                {grade}
                              </button>
                            )
                          })}
                        </div>
                      </td>
                      <td className="p-4">
                        <input
                          type="text"
                          placeholder="Ingrese retroalimentación descriptiva..."
                          defaultValue={currentNota?.conclusiones || ''}
                          onBlur={(e) => handleSetConclusion(alumno.id, e.target.value)}
                          className="w-full bg-white border border-outline-variant/40 rounded-lg px-2.5 py-1.5 text-xs text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </td>
                      <td className="p-4 text-center">
                        {currentNota?.sync_status === 'pending' ? (
                          <span title="Guardado offline localmente">
                            <WifiOff className="w-4 h-4 text-amber-500 mx-auto" />
                          </span>
                        ) : (
                          <span title="Sincronizado con Supabase">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

export default function DocenteNotasPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-on-surface-variant">Cargando registro de notas...</div>}>
      <DocenteNotasContent />
    </Suspense>
  )
}
