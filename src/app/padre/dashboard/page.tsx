'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { StatsCard } from '@/components/ui/stats-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  GraduationCap,
  CalendarCheck2,
  CreditCard,
  Bell,
  ArrowRight,
  User,
  BookOpen,
  AlertCircle,
  FileText,
  ShieldCheck,
} from 'lucide-react'
import { dataStore, type Alumno, type Nota, type Pago, type Comunicado } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function PadreDashboard() {
  const [activeChildId, setActiveChildId] = useState<string>('alu-1')
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [currentChild, setCurrentChild] = useState<Alumno | null>(null)
  const [notas, setNotas] = useState<Nota[]>([])
  const [pagos, setPagos] = useState<Pago[]>([])
  const [comunicados, setComunicados] = useState<Comunicado[]>([])

  const loadData = () => {
    const allAlu = dataStore.getAlumnos()
    const misHijos = allAlu.filter(a => a.apoderado_id === 'usr-pad-1')
    setAlumnos(misHijos)

    const storedChildId = typeof window !== 'undefined' ? localStorage.getItem('sedes_selected_child') : null
    const childId = storedChildId && misHijos.find(h => h.id === storedChildId) ? storedChildId : misHijos[0]?.id || 'alu-1'
    setActiveChildId(childId)

    const selected = misHijos.find(h => h.id === childId) || misHijos[0] || null
    setCurrentChild(selected)

    const allNotas = dataStore.getNotas().filter(n => n.alumno_id === childId)
    setNotas(allNotas)

    const allPagos = dataStore.getPagos().filter(p => p.alumno_id === childId)
    setPagos(allPagos)

    const allCom = dataStore.getComunicados()
    setComunicados(allCom.slice(0, 3))
  }

  useEffect(() => {
    loadData()
    const handleChildChange = () => loadData()
    window.addEventListener('child_changed', handleChildChange)
    return () => window.removeEventListener('child_changed', handleChildChange)
  }, [])

  const proximoPago = pagos.find(p => p.estado === 'pendiente' || p.estado === 'vencido')

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-primary-container rounded-2xl p-6 sm:p-8 text-white shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-secondary-container backdrop-blur-md">
            <span>Año Escolar 2026</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Bienvenido, Ing. Roberto Quispe
          </h2>
          <p className="text-sm text-surface-container/80 max-w-xl">
            Seguimiento académico y administrativo de su hijo(a):{' '}
            <strong className="text-secondary-container">{currentChild?.nombres} {currentChild?.apellidos}</strong>{' '}
            ({currentChild?.seccion_nombre})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/padre/pagos">
            <Button variant="secondary" size="md" leftIcon={<CreditCard className="w-4 h-4" />}>
              Pagar Pensión
            </Button>
          </Link>
          <Link href="/padre/notas">
            <Button variant="outline" size="md" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              Ver Notas
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard
          title="Rendimiento Global"
          value="AD (Destacado)"
          subtitle="Basado en 3 competencias evaluadas"
          variant="success"
          icon={<GraduationCap className="w-6 h-6" />}
        />

        <StatsCard
          title="Asistencia del Mes"
          value="98.5%"
          subtitle="20 días asistidos, 0 faltas"
          variant="primary"
          icon={<CalendarCheck2 className="w-6 h-6" />}
        />

        <StatsCard
          title="Estado de Pagos"
          value={proximoPago ? formatCurrency(proximoPago.monto) : 'Al Día'}
          subtitle={proximoPago ? `Vence el ${formatDate(proximoPago.fecha_vencimiento)}` : 'Sin deudas pendientes'}
          variant={proximoPago?.estado === 'vencido' ? 'warning' : 'info'}
          icon={<CreditCard className="w-6 h-6" />}
        />

        <StatsCard
          title="Comunicados Nuevos"
          value="2 Avisos"
          subtitle="Circulares oficiales vigentes"
          variant="secondary"
          icon={<Bell className="w-6 h-6" />}
        />
      </div>

      {/* Two Column Layout: Recent Grades & Upcoming Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Evaluations */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Últimas Calificaciones MINEDU</CardTitle>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Evaluación por competencias correspondiente al Bimestre 1
                </p>
              </div>
              <Link href="/padre/notas">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Ver Libreta Completa
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-surface-container">
                {notas.length === 0 ? (
                  <p className="p-6 text-center text-xs text-on-surface-variant">No hay calificaciones registradas para este estudiante.</p>
                ) : (
                  notas.map((nota) => (
                    <div key={nota.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-surface-container/30 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-primary" />
                          <span className="text-xs font-semibold uppercase text-on-surface-variant">
                            {nota.seccion_curso_id.includes('mat') ? 'Matemática' : 'Comunicación Integral'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-primary">{nota.competencia}</h4>
                        {nota.conclusiones_descriptivas && (
                          <p className="text-xs text-on-surface-variant italic">
                            "{nota.conclusiones_descriptivas}"
                          </p>
                        )}
                      </div>
                      <Badge variant={`grade-${nota.calificacion}` as any} size="md">
                        {nota.calificacion}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Institutional Circulars */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Comunicados y Avisos Recientes</CardTitle>
                <p className="text-xs text-on-surface-variant mt-0.5">
                  Información enviada por Dirección y Secretaría
                </p>
              </div>
              <Link href="/padre/comunicados">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Ver Todos
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-surface-container">
                {comunicados.map((com) => (
                  <div key={com.id} className="p-4 sm:p-5 space-y-2 hover:bg-surface-container/30 transition-colors">
                    <div className="flex items-center justify-between">
                      <Badge variant={com.categoria === 'Circular' ? 'primary' : com.categoria === 'Evento' ? 'secondary' : 'warning'}>
                        {com.categoria}
                      </Badge>
                      <span className="text-xs text-on-surface-variant">{formatDate(com.created_at)}</span>
                    </div>
                    <h4 className="text-sm font-bold text-primary">{com.titulo}</h4>
                    <p className="text-xs text-on-surface-variant line-clamp-2">{com.contenido}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Pension Status & Student Card */}
        <div className="space-y-6">
          {/* Active Student Info Card */}
          <Card className="border-t-4 border-t-primary">
            <CardHeader>
              <CardTitle className="text-base">Ficha del Estudiante</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg border border-primary/20">
                  {currentChild?.nombres.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-primary">{currentChild?.nombres} {currentChild?.apellidos}</h4>
                  <p className="text-xs text-on-surface-variant">DNI: {currentChild?.dni}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-surface-container text-xs">
                <div className="flex justify-between py-1 border-b border-surface-container/60">
                  <span className="text-on-surface-variant">Código Modular:</span>
                  <span className="font-semibold text-primary">{currentChild?.codigo_estudiante}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-surface-container/60">
                  <span className="text-on-surface-variant">Aula / Grado:</span>
                  <span className="font-semibold text-primary">{currentChild?.seccion_nombre}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-surface-container/60">
                  <span className="text-on-surface-variant">Tutor de Aula:</span>
                  <span className="font-semibold text-primary">Prof. Carlos García</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-on-surface-variant">Estado Matrícula:</span>
                  <Badge variant="success" size="sm">Matriculado 2026</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Card Shortcut */}
          <Card className="bg-gradient-to-br from-amber-500/10 to-transparent border-amber-200">
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center gap-2 text-secondary">
                <CreditCard className="w-5 h-5" />
                <h4 className="text-sm font-bold">Próximo Vencimiento</h4>
              </div>

              {proximoPago ? (
                <div className="space-y-2">
                  <p className="text-xs text-on-surface-variant">{proximoPago.concepto}</p>
                  <p className="text-2xl font-black text-primary">{formatCurrency(proximoPago.monto)}</p>
                  <div className="flex items-center justify-between text-xs text-on-surface-variant">
                    <span>Vence:</span>
                    <span className="font-bold text-error">{formatDate(proximoPago.fecha_vencimiento)}</span>
                  </div>

                  <Link href="/padre/pagos" className="block pt-2">
                    <Button variant="primary" size="sm" className="w-full">
                      Pagar con Culqi / Tarjeta
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="py-4 text-center space-y-2">
                  <ShieldCheck className="w-8 h-8 text-success mx-auto" />
                  <p className="text-xs font-bold text-success">¡Felicitaciones! Se encuentra al día en todas sus mensualidades.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
