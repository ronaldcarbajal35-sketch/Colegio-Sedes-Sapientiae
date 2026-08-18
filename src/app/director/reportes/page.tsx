'use client'

import React, { useState, useEffect } from 'react'
import {
  FileSpreadsheet,
  Download,
  School,
  TrendingUp,
  CreditCard,
  GraduationCap
} from 'lucide-react'
import { dataStore, Seccion, Alumno } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'

export default function DirectorReportesPage() {
  const [secciones, setSecciones] = useState<Seccion[]>([])
  const [alumnos, setAlumnos] = useState<Alumno[]>([])

  useEffect(() => {
    setSecciones(dataStore.getSecciones())
    setAlumnos(dataStore.getAlumnos())
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">
              RF-063 / RF-110 a RF-113
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Consolidados de Gestión Escolar</span>
          </div>
          <h1 className="text-xl font-bold text-primary mt-1">
            Reportes Generales de la Institución
          </h1>
          <p className="text-xs text-on-surface-variant">
            Exportación de métricas de notas, asistencia, morosidad y resolución de FUTs para MINEDU / UGEL.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => alert('Generando informe ejecutivo consolidado en PDF...')}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Descargar Informe Ejecutivo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <GraduationCap className="w-5 h-5 text-secondary" />
            <span>Rendimiento Académico por Nivel</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 rounded-lg bg-surface-container/50">
              <span>Inicial (3, 4 y 5 Años):</span>
              <strong className="text-emerald-700">100% Nivel AD</strong>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-surface-container/50">
              <span>Primaria (1° a 6° A y B):</span>
              <strong className="text-emerald-700">92% Nivel AD / A</strong>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-surface-container/50">
              <span>Secundaria (1° a 5°):</span>
              <strong className="text-primary">88% Nivel A / B</strong>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft space-y-3">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <CreditCard className="w-5 h-5 text-secondary" />
            <span>Resumen Financiero y Recaudación Yape</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-2 rounded-lg bg-surface-container/50">
              <span>Matrículas Cobradas 2026:</span>
              <strong className="text-emerald-700">98.5%</strong>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-surface-container/50">
              <span>Pensiones Marzo al Día:</span>
              <strong className="text-emerald-700">91.0%</strong>
            </div>
            <div className="flex justify-between p-2 rounded-lg bg-surface-container/50">
              <span>Tasa de Morosidad Actual:</span>
              <strong className="text-amber-800">9.0%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
