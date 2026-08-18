'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  School,
  TrendingUp,
  CreditCard,
  FileText,
  Users,
  CalendarCheck2,
  AlertTriangle,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { dataStore, Seccion, FUT, Pago, Alumno } from '@/lib/mock-data'

export default function DirectorDashboardPage() {
  const [secciones, setSecciones] = useState<Seccion[]>([])
  const [futs, setFuts] = useState<FUT[]>([])
  const [pagos, setPagos] = useState<Pago[]>([])
  const [alumnos, setAlumnos] = useState<Alumno[]>([])

  useEffect(() => {
    setSecciones(dataStore.getSecciones())
    setFuts(dataStore.getFuts())
    setPagos(dataStore.getPagos())
    setAlumnos(dataStore.getAlumnos())
  }, [])

  const futsPendientes = futs.filter(f => f.estado === 'en_proceso')
  const morosos = pagos.filter(p => p.estado === 'vencido')
  const totalRecaudado = pagos.filter(p => p.estado === 'pagado').reduce((acc, p) => acc + p.monto, 0)

  return (
    <div className="space-y-6">
      {/* Header Directivo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">
              RF-060 a RF-063
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Dirección General — Sedes Sapientiae 2026</span>
          </div>
          <h1 className="text-xl font-bold text-primary mt-1">
            Panel de Supervisión Institucional (24 Aulas)
          </h1>
          <p className="text-xs text-on-surface-variant">
            Monitoreo en tiempo real de asistencia global, rendimiento académico, finanzas y derivación de FUTs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/director/fut"
            className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold shadow transition-all flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Mesa de FUTs ({futsPendientes.length})</span>
          </Link>
        </div>
      </div>

      {/* Métricas Globales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-outline-variant/30 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
              <School className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-on-surface-variant">Capacidad: 680</span>
          </div>
          <span className="text-2xl font-black text-primary">24 Aulas</span>
          <p className="text-xs font-bold text-primary mt-1">Inicial, Primaria y Secundaria</p>
          <p className="text-[11px] text-emerald-700 font-semibold">100% Cobertura docente</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-outline-variant/30 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">96.2%</span>
          </div>
          <span className="text-2xl font-black text-primary">Puntualidad</span>
          <p className="text-xs font-bold text-primary mt-1">Asistencia Global Hoy</p>
          <p className="text-[11px] text-on-surface-variant">Reportada por auxiliares</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-outline-variant/30 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-on-surface-variant">Marzo 2026</span>
          </div>
          <span className="text-2xl font-black text-primary">S/ {totalRecaudado.toLocaleString()}</span>
          <p className="text-xs font-bold text-primary mt-1">Recaudación Yape & Banco</p>
          <p className="text-[11px] text-on-surface-variant">{morosos.length} Apoderados con mora</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-outline-variant/30 shadow-soft">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">En Proceso</span>
          </div>
          <span className="text-2xl font-black text-primary">{futsPendientes.length} Trámites</span>
          <p className="text-xs font-bold text-primary mt-1">Expedientes FUT Activos</p>
          <p className="text-[11px] text-on-surface-variant">Requieren derivación/visto bueno</p>
        </div>
      </div>

      {/* Matriz de las 24 AULAS (RF-003, RF-063) */}
      <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-surface-container pb-3">
          <div>
            <h2 className="text-sm font-bold text-primary">Supervisión en Tiempo Real de las 24 Aulas (RF-003)</h2>
            <p className="text-xs text-on-surface-variant">Distribución por Nivel, Tutor responsable y Auxiliar asignado</p>
          </div>
          <span className="text-xs font-bold text-secondary">Año Académico 2026</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {secciones.map((sec) => (
            <div
              key={sec.id}
              className="p-3.5 rounded-xl border border-outline-variant/30 bg-surface-container/30 hover:bg-surface-container/60 transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-primary truncate">{sec.nombre.split(' - ')[0]}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded uppercase font-bold bg-primary text-white">
                  {sec.nivel}
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant truncate">
                Tutor: <strong className="text-primary">{sec.tutor_nombre}</strong>
              </p>
              <p className="text-[10px] text-on-surface-variant truncate">
                Auxiliar: {sec.auxiliar_nombre}
              </p>
              <div className="pt-1 flex items-center justify-between text-[10px] text-emerald-800 font-bold border-t border-outline-variant/20">
                <span>Capacidad: {sec.capacidad} est.</span>
                <span>Asistencia: 100%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
