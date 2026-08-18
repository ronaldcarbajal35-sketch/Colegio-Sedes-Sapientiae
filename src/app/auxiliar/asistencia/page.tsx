'use client'

import React, { useState, useEffect } from 'react'
import {
  CalendarCheck2,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldAlert,
  Save,
  Search,
  Filter,
  Users,
  Check
} from 'lucide-react'
import { dataStore, Seccion, Alumno, Asistencia } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'

export default function AuxiliarAsistenciaPage() {
  const [secciones, setSecciones] = useState<Seccion[]>([])
  const [selectedSeccionId, setSelectedSeccionId] = useState<string>('sec-3a-pri')
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [fecha, setFecha] = useState<string>(new Date().toISOString().split('T')[0])
  const [asistencias, setAsistencias] = useState<Record<string, 'presente' | 'tardanza' | 'falta' | 'justificado'>>({})
  const [justificaciones, setJustificaciones] = useState<Record<string, string>>({})
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const allSecciones = dataStore.getSecciones()
    setSecciones(allSecciones)

    const allAlumnos = dataStore.getAlumnos()
    setAlumnos(allAlumnos)

    const initialMap: Record<string, 'presente' | 'tardanza' | 'falta' | 'justificado'> = {}
    const justMap: Record<string, string> = {}
    const currentAsist = dataStore.getAsistencias().filter(a => a.fecha === fecha)

    allAlumnos.forEach(alu => {
      const found = currentAsist.find(a => a.alumno_id === alu.id)
      initialMap[alu.id] = found ? found.estado : 'presente'
      if (found?.justificacion) justMap[alu.id] = found.justificacion
    })

    setAsistencias(initialMap)
    setJustificaciones(justMap)
  }, [fecha])

  const currentSeccion = secciones.find(s => s.id === selectedSeccionId) || secciones[0]
  const filteredAlumnos = alumnos.filter(a => a.seccion_id === selectedSeccionId && (
    a.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.dni.includes(searchTerm)
  ))

  const handleSetEstado = (alumnoId: string, estado: 'presente' | 'tardanza' | 'falta' | 'justificado') => {
    setAsistencias(prev => ({ ...prev, [alumnoId]: estado }))
  }

  const handleSetAll = (estado: 'presente' | 'tardanza' | 'falta' | 'justificado') => {
    const updated = { ...asistencias }
    filteredAlumnos.forEach(alu => {
      updated[alu.id] = estado
    })
    setAsistencias(updated)
  }

  const handleGuardarAsistencia = () => {
    filteredAlumnos.forEach(alu => {
      dataStore.saveAsistencia({
        alumno_id: alu.id,
        alumno_nombre: `${alu.nombres} ${alu.apellidos}`,
        seccion_id: selectedSeccionId,
        fecha,
        estado: asistencias[alu.id] || 'presente',
        justificacion: justificaciones[alu.id],
        registrado_por: 'Aux. Pedro Huamán',
      })
    })

    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
              RF-020 / RF-003
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Gestión de las 24 Aulas</span>
          </div>
          <h1 className="text-xl font-bold text-primary mt-1">
            Registro Diario de Asistencia Escolar
          </h1>
          <p className="text-xs text-on-surface-variant">
            Marcación por aula con notificación automática a padres ante faltas o tardanzas (RF-024).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="px-3.5 py-2 rounded-xl border border-outline-variant/60 bg-surface-container/50 text-xs font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <Button
            variant="primary"
            onClick={handleGuardarAsistencia}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Guardar Asistencia
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-success-container text-success text-xs font-bold flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Asistencia guardada con éxito. Notificaciones WhatsApp enviadas a los padres con faltas/tardanzas (RF-024).</span>
          </div>
        </div>
      )}

      {/* Selector de las 24 AULAS (RF-003) */}
      <div className="bg-white p-4 rounded-2xl border border-outline-variant/30 shadow-soft space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-primary">
          <span>Seleccionar de las 24 Aulas Institucionales:</span>
          <span className="text-on-surface-variant font-normal">
            Aula activa: <span className="font-bold text-secondary">{currentSeccion?.nombre}</span>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5 max-h-40 overflow-y-auto pr-1">
          {secciones.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSelectedSeccionId(sec.id)}
              className={`p-2 rounded-xl text-[11px] font-bold text-left transition-all border ${
                selectedSeccionId === sec.id
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-surface-container/50 hover:bg-surface-container border-outline-variant/30 text-on-surface'
              }`}
            >
              <span className="block truncate">{sec.nombre.split(' - ')[0]}</span>
              <span className={`text-[9px] block uppercase ${selectedSeccionId === sec.id ? 'text-secondary-container' : 'text-on-surface-variant'}`}>
                {sec.nivel}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Controles de Lote & Filtro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-outline-variant/30 shadow-soft">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Buscar alumno por nombre, apellido o DNI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-outline-variant/60 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
          <span>Marcar todos:</span>
          <button
            onClick={() => handleSetAll('presente')}
            className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 text-xs font-bold"
          >
            Presentes
          </button>
          <button
            onClick={() => handleSetAll('falta')}
            className="px-2.5 py-1 rounded-lg bg-error-container text-error hover:bg-error/20 text-xs font-bold"
          >
            Faltas
          </button>
        </div>
      </div>

      {/* Lista de Alumnos */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-soft overflow-hidden">
        <div className="p-4 border-b border-surface-container flex items-center justify-between text-xs font-bold text-primary">
          <span>Estudiante / Apoderado</span>
          <span>Marcación de Asistencia (RF-020)</span>
        </div>

        <div className="divide-y divide-surface-container">
          {filteredAlumnos.map((alu) => {
            const estadoActual = asistencias[alu.id] || 'presente'

            return (
              <div
                key={alu.id}
                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-surface-container/30 transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-primary">
                      {alu.nombres} {alu.apellidos}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-mono">
                      DNI: {alu.dni}
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant">
                    Apoderado: {alu.apoderado_nombre} ({alu.apoderado_telefono})
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleSetEstado(alu.id, 'presente')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      estadoActual === 'presente'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-surface-container text-on-surface-variant hover:bg-emerald-50 hover:text-emerald-800'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Presente</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetEstado(alu.id, 'tardanza')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      estadoActual === 'tardanza'
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-surface-container text-on-surface-variant hover:bg-amber-50 hover:text-amber-800'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Tardanza</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetEstado(alu.id, 'falta')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      estadoActual === 'falta'
                        ? 'bg-error text-white shadow-sm'
                        : 'bg-surface-container text-on-surface-variant hover:bg-error-container hover:text-error'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Falta</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSetEstado(alu.id, 'justificado')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                      estadoActual === 'justificado'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-surface-container text-on-surface-variant hover:bg-blue-50 hover:text-blue-800'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Justificado</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
