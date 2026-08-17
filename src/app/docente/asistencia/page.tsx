'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input, Select } from '@/components/ui/input'
import { CalendarCheck2, CheckCircle2, Clock, AlertTriangle, FileText, Sparkles, WifiOff, Users } from 'lucide-react'
import { dataStore, type Seccion, type Alumno, type Asistencia } from '@/lib/mock-data'
import { syncManager } from '@/lib/sync-queue'

function DocenteAsistenciaContent() {
  const searchParams = useSearchParams()
  const initialSeccion = searchParams.get('seccion') || 'sec-3a-pri'

  const [secciones, setSecciones] = useState<Seccion[]>([])
  const [selectedSeccion, setSelectedSeccion] = useState<string>(initialSeccion)
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split('T')[0])
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [asistencias, setAsistencias] = useState<Record<string, { estado: 'presente'|'tardanza'|'falta'|'justificado'; justificacion?: string; sync_status: 'synced'|'pending' }>>({})
  const [saveToast, setSaveToast] = useState<string | null>(null)

  const loadData = () => {
    const secList = dataStore.getSecciones()
    setSecciones(secList)

    const allAlu = dataStore.getAlumnos().filter(a => a.seccion_id === selectedSeccion)
    setAlumnos(allAlu)

    const allAst = dataStore.getAsistencias().filter(a => a.fecha === fecha)
    const map: Record<string, { estado: 'presente'|'tardanza'|'falta'|'justificado'; justificacion?: string; sync_status: 'synced'|'pending' }> = {}

    allAlu.forEach((alu) => {
      const match = allAst.find(a => a.alumno_id === alu.id)
      map[alu.id] = {
        estado: match ? match.estado : 'presente',
        justificacion: match?.justificacion,
        sync_status: match?.sync_status === 'pending' ? 'pending' : 'synced',
      }
    })
    setAsistencias(map)
  }

  useEffect(() => {
    loadData()
  }, [selectedSeccion, fecha])

  const handleSetEstado = async (alumnoId: string, estado: 'presente' | 'tardanza' | 'falta' | 'justificado') => {
    const current = asistencias[alumnoId] || {}
    const updated = {
      ...current,
      estado,
      sync_status: (typeof navigator !== 'undefined' && navigator.onLine ? 'synced' : 'pending') as 'synced' | 'pending',
    }

    setAsistencias(prev => ({
      ...prev,
      [alumnoId]: updated,
    }))

    dataStore.saveAsistencia({
      alumno_id: alumnoId,
      seccion_curso_id: 'sc-3a-mat',
      fecha,
      estado,
      justificacion: current.justificacion,
    })

    await syncManager.guardarAsistencia({
      alumno_id: alumnoId,
      seccion_curso_id: 'sc-3a-mat',
      fecha,
      estado,
      justificacion: current.justificacion,
    })

    setSaveToast(`Asistencia actualizada: ${estado.toUpperCase()}`)
    setTimeout(() => setSaveToast(null), 2000)
  }

  const handleMarkAllPresent = () => {
    alumnos.forEach((alu) => {
      handleSetEstado(alu.id, 'presente')
    })
    setSaveToast('Todos los alumnos marcados como PRESENTES')
    setTimeout(() => setSaveToast(null), 2500)
  }

  const totalPresentes = Object.values(asistencias).filter(a => a.estado === 'presente').length
  const totalTardanzas = Object.values(asistencias).filter(a => a.estado === 'tardanza').length
  const totalFaltas = Object.values(asistencias).filter(a => a.estado === 'falta').length
  const totalJustificados = Object.values(asistencias).filter(a => a.estado === 'justificado').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-primary tracking-tight flex items-center gap-2">
            <CalendarCheck2 className="w-6 h-6 text-secondary" />
            <span>Toma de Asistencia Diaria</span>
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Control de puntualidad de clase con sincronización instantánea y modo sin conexión
          </p>
        </div>

        {saveToast && (
          <div className="px-3.5 py-1.5 rounded-xl bg-success-container text-success border border-success/30 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveToast}</span>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-outline-variant/30 shadow-card grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
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

        <Input
          label="Fecha de Sesión"
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />

        <Button
          variant="secondary"
          size="md"
          onClick={handleMarkAllPresent}
          leftIcon={<Sparkles className="w-4 h-4" />}
          className="h-[42px]"
        >
          Marcar Todos Presentes
        </Button>
      </div>

      {/* Real-time Summary Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Presentes</span>
            <p className="text-xl font-extrabold text-emerald-900">{totalPresentes}</p>
          </div>
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Tardanzas</span>
            <p className="text-xl font-extrabold text-amber-900">{totalTardanzas}</p>
          </div>
          <Clock className="w-5 h-5 text-amber-600" />
        </div>

        <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">Faltas</span>
            <p className="text-xl font-extrabold text-rose-900">{totalFaltas}</p>
          </div>
          <AlertTriangle className="w-5 h-5 text-rose-600" />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800">Justificados</span>
            <p className="text-xl font-extrabold text-blue-900">{totalJustificados}</p>
          </div>
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
      </div>

      {/* Attendance Sheet Table */}
      <Card>
        <CardHeader className="bg-surface flex flex-row items-center justify-between">
          <CardTitle className="text-base">Nómina del Aula — {alumnos.length} Estudiantes</CardTitle>
          <span className="text-xs font-semibold text-primary">{fecha}</span>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-surface-container/60 border-b border-surface-container text-on-surface-variant font-semibold text-[11px] uppercase tracking-wider">
                <th className="p-4 w-12 text-center">N°</th>
                <th className="p-4">Estudiante</th>
                <th className="p-4">DNI</th>
                <th className="p-4 text-center">Estado de Asistencia</th>
                <th className="p-4">Observaciones</th>
                <th className="p-4 text-center">Sync</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {alumnos.map((alumno, idx) => {
                const current = asistencias[alumno.id]
                const est = current?.estado || 'presente'

                return (
                  <tr key={alumno.id} className="hover:bg-surface-container/20 transition-colors">
                    <td className="p-4 text-center font-bold text-on-surface-variant">{idx + 1}</td>
                    <td className="p-4 font-bold text-primary">
                      {alumno.apellidos}, {alumno.nombres}
                    </td>
                    <td className="p-4 text-on-surface-variant font-mono text-xs">{alumno.dni}</td>
                    <td className="p-4 text-center">
                      <div className="inline-flex items-center gap-1 bg-surface-container/80 p-1 rounded-xl border border-outline-variant/40">
                        <button
                          onClick={() => handleSetEstado(alumno.id, 'presente')}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            est === 'presente' ? 'bg-emerald-600 text-white shadow' : 'text-on-surface-variant hover:bg-white'
                          }`}
                        >
                          Presente
                        </button>
                        <button
                          onClick={() => handleSetEstado(alumno.id, 'tardanza')}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            est === 'tardanza' ? 'bg-amber-600 text-white shadow' : 'text-on-surface-variant hover:bg-white'
                          }`}
                        >
                          Tardanza
                        </button>
                        <button
                          onClick={() => handleSetEstado(alumno.id, 'falta')}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            est === 'falta' ? 'bg-rose-600 text-white shadow' : 'text-on-surface-variant hover:bg-white'
                          }`}
                        >
                          Falta
                        </button>
                        <button
                          onClick={() => handleSetEstado(alumno.id, 'justificado')}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            est === 'justificado' ? 'bg-blue-600 text-white shadow' : 'text-on-surface-variant hover:bg-white'
                          }`}
                        >
                          Justificado
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <input
                        type="text"
                        placeholder="Nota o motivo..."
                        defaultValue={current?.justificacion || ''}
                        onBlur={(e) => {
                          dataStore.saveAsistencia({
                            alumno_id: alumno.id,
                            seccion_curso_id: 'sc-3a-mat',
                            fecha,
                            estado: est,
                            justificacion: e.target.value,
                          })
                        }}
                        className="w-full bg-white border border-outline-variant/40 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                    </td>
                    <td className="p-4 text-center">
                      {current?.sync_status === 'pending' ? (
                        <WifiOff className="w-4 h-4 text-amber-500 mx-auto" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mx-auto" />
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}

export default function DocenteAsistenciaPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-on-surface-variant">Cargando toma de asistencia...</div>}>
      <DocenteAsistenciaContent />
    </Suspense>
  )
}
