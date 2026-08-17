'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { StatsCard } from '@/components/ui/stats-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  School,
  CreditCard,
  AlertTriangle,
  FileSpreadsheet,
  Users2,
  Bell,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import { dataStore, type Alumno, type Matricula, type Pago } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function AdminDashboardPage() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [matriculas, setMatriculas] = useState<Matricula[]>([])
  const [pagos, setPagos] = useState<Pago[]>([])

  useEffect(() => {
    setAlumnos(dataStore.getAlumnos())
    setMatriculas(dataStore.getMatriculas())
    setPagos(dataStore.getPagos())
  }, [])

  const matriculadosCount = matriculas.filter(m => m.estado === 'matriculado').length
  const postulantesCount = matriculas.filter(m => m.estado === 'postulante' || m.estado === 'en_evaluacion').length
  const totalRecaudado = pagos.filter(p => p.estado === 'pagado').reduce((sum, p) => sum + p.monto, 0)
  const totalMoroso = pagos.filter(p => p.estado === 'vencido').reduce((sum, p) => sum + p.monto + p.mora, 0)
  const totalPendiente = pagos.reduce((sum, p) => sum + p.monto, 0)
  const morosidadPorcentaje = totalPendiente > 0 ? ((totalMoroso / totalPendiente) * 100).toFixed(1) : '0'

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary via-primary-container to-[#031c47] p-6 sm:p-8 rounded-2xl text-white shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-secondary-container backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Panel de Gestión Integral y Dirección 2026</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Colegio Sedes Sapientiae
          </h2>
          <p className="text-xs sm:text-sm text-surface-container/80 max-w-xl">
            Monitoreo en tiempo real de admisiones, recaudación de pensiones con Culqi, control de morosidad y cumplimiento MINEDU SIAGIE.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/matricula">
            <Button variant="secondary" size="md" leftIcon={<School className="w-4 h-4" />}>
              Matrículas
            </Button>
          </Link>
          <Link href="/admin/exportar-siagie">
            <Button variant="outline" size="md" className="bg-white/10 text-white border-white/20 hover:bg-white/20" leftIcon={<FileSpreadsheet className="w-4 h-4" />}>
              SIAGIE
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Alumnos Matriculados"
          value={`${matriculadosCount} Alumnos`}
          subtitle={`${postulantesCount} en proceso de admisión`}
          trend={{ value: '12%', isPositive: true }}
          variant="primary"
          icon={<Users2 className="w-6 h-6" />}
        />

        <StatsCard
          title="Recaudación Anual"
          value={formatCurrency(totalRecaudado)}
          subtitle="Matrículas y pensiones pagadas"
          trend={{ value: '8.4%', isPositive: true }}
          variant="success"
          icon={<CreditCard className="w-6 h-6" />}
        />

        <StatsCard
          title="Tasa de Morosidad"
          value={`${morosidadPorcentaje}%`}
          subtitle={`Deuda: ${formatCurrency(totalMoroso)}`}
          trend={{ value: '2.1%', isPositive: false }}
          variant="warning"
          icon={<AlertTriangle className="w-6 h-6" />}
        />

        <StatsCard
          title="Asistencia Promedio"
          value="96.8%"
          subtitle="Récord de asistencia institucional"
          trend={{ value: '0.5%', isPositive: true }}
          variant="info"
          icon={<TrendingUp className="w-6 h-6" />}
        />
      </div>

      {/* 2-Columns Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Matrícula Status and Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Postulaciones y Matrículas Recientes</CardTitle>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Expedientes en evaluación y recién matriculados
                </p>
              </div>
              <Link href="/admin/matricula">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Gestionar Matrículas
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-surface-container">
                {matriculas.slice(0, 4).map((mat) => (
                  <div key={mat.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-surface-container/30 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary">{mat.alumno_nombre}</span>
                        <span className="text-xs text-on-surface-variant font-mono">({mat.dni})</span>
                      </div>
                      <p className="text-xs text-on-surface-variant">
                        Grado: <strong>{mat.grado_postula}</strong> • {mat.documentos.length} documentos adjuntos
                      </p>
                    </div>

                    <Badge
                      variant={
                        mat.estado === 'matriculado'
                          ? 'success'
                          : mat.estado === 'en_evaluacion'
                          ? 'warning'
                          : 'default'
                      }
                      size="md"
                    >
                      {mat.estado.toUpperCase().replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Management Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href="/admin/comunicados" className="group">
              <div className="p-5 rounded-2xl bg-white border border-outline-variant/30 shadow-card hover:shadow-soft transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Bell className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-primary group-hover:text-purple-700 transition-colors">
                  Emitir Comunicado
                </h4>
                <p className="text-xs text-on-surface-variant">
                  Difusión masiva a apoderados con integración de WhatsApp API.
                </p>
              </div>
            </Link>

            <Link href="/admin/morosidad" className="group">
              <div className="p-5 rounded-2xl bg-white border border-outline-variant/30 shadow-card hover:shadow-soft transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-primary group-hover:text-amber-700 transition-colors">
                  Seguimiento de Morosos
                </h4>
                <p className="text-xs text-on-surface-variant">
                  Reportes de deudas y recordatorios automáticos por WhatsApp.
                </p>
              </div>
            </Link>

            <Link href="/admin/exportar-siagie" className="group">
              <div className="p-5 rounded-2xl bg-white border border-outline-variant/30 shadow-card hover:shadow-soft transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-primary group-hover:text-emerald-700 transition-colors">
                  Exportación SIAGIE
                </h4>
                <p className="text-xs text-on-surface-variant">
                  Validador de consistencia y descarga oficial en Excel para MINEDU.
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Right 1 Col: Financial Snapshot & System Security */}
        <div className="space-y-6">
          <Card className="border-t-4 border-t-secondary">
            <CardHeader>
              <CardTitle className="text-base">Distribución por Nivel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Primaria (3ro A, 4to A)</span>
                    <span className="text-primary font-bold">75% Ocupación</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-3/4" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Secundaria (1ro A, 5to B)</span>
                    <span className="text-primary font-bold">88% Ocupación</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                    <div className="h-full bg-secondary rounded-full w-[88%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Inicial (3, 4, 5 años)</span>
                    <span className="text-primary font-bold">60% Ocupación</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-container overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full w-3/5" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-surface-container text-xs text-on-surface-variant space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Políticas RLS activas en Postgres</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Las consultas directas a la base de datos están restringidas por rol de usuario para salvaguardar la privacidad de los menores.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
