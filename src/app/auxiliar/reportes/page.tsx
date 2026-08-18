'use client'

import React, { useState, useEffect } from 'react'
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  ShieldAlert,
  School
} from 'lucide-react'
import { dataStore, Seccion, Alumno, Asistencia } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'

export default function AuxiliarReportesPage() {
  const [secciones, setSecciones] = useState<Seccion[]>([])
  const [selectedSeccionId, setSelectedSeccionId] = useState('sec-3a-pri')
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [asistencias, setAsistencias] = useState<Asistencia[]>([])

  useEffect(() => {
    setSecciones(dataStore.getSecciones())
    setAlumnos(dataStore.getAlumnos())
    setAsistencias(dataStore.getAsistencias())
  }, [])

  const currentSeccion = secciones.find(s => s.id === selectedSeccionId) || secciones[0]
  const seccionAlumnos = alumnos.filter(a => a.seccion_id === selectedSeccionId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
              RF-023
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Consolidados Estadísticos</span>
          </div>
          <h1 className="text-xl font-bold text-primary mt-1">
            Reportes de Asistencia por Aula y Rango de Fechas
          </h1>
          <p className="text-xs text-on-surface-variant">
            Exportación de reportes de puntualidad, inasistencias y justificaciones para tutoría y dirección.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => alert('Generando reporte Excel/PDF para SIAGIE...')}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Exportar Excel / PDF
        </Button>
      </div>

      {/* Selector de Aula */}
      <div className="bg-white p-4 rounded-2xl border border-outline-variant/30 shadow-soft space-y-2">
        <span className="text-xs font-bold text-primary">Seleccionar Aula:</span>
        <div className="flex flex-wrap gap-1.5">
          {secciones.slice(0, 12).map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSelectedSeccionId(sec.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedSeccionId === sec.id
                  ? 'bg-primary text-white shadow'
                  : 'bg-surface-container/60 hover:bg-surface-container text-on-surface'
              }`}
            >
              {sec.nombre.split(' - ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla Resumen */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-soft overflow-hidden">
        <div className="p-4 border-b border-surface-container flex items-center justify-between">
          <h3 className="text-xs font-bold text-primary">
            Consolidado de Asistencia — {currentSeccion?.nombre}
          </h3>
          <span className="text-xs text-on-surface-variant">{seccionAlumnos.length} Alumnos matriculados</span>
        </div>

        <div className="divide-y divide-surface-container">
          {seccionAlumnos.map((alu) => (
            <div key={alu.id} className="p-4 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-primary">{alu.nombres} {alu.apellidos}</span>
                <p className="text-[11px] text-on-surface-variant">Código: {alu.codigo_estudiante} • DNI: {alu.dni}</p>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="text-center">
                  <span className="text-[10px] text-emerald-800 font-bold block">Presentes</span>
                  <span className="font-bold text-emerald-700">18 días</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-amber-800 font-bold block">Tardanzas</span>
                  <span className="font-bold text-amber-700">1</span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-error font-bold block">Faltas</span>
                  <span className="font-bold text-error">0</span>
                </div>
                <div className="text-center pl-2 border-l border-outline-variant/30">
                  <span className="text-[10px] text-on-surface-variant font-bold block">% Puntualidad</span>
                  <span className="font-black text-primary">95.0%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
