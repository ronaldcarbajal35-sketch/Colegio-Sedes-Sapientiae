'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  GraduationCap,
  CalendarCheck2,
  CreditCard,
  ClipboardList,
  CheckSquare,
  AlertTriangle,
  QrCode,
  ArrowRight,
  Sparkles,
  BookOpenCheck,
  CheckCircle2,
  Clock,
  School,
  FileText
} from 'lucide-react'
import { dataStore, Alumno, Pago, TareaAviso, ConductaIncidencia, TemarioDia } from '@/lib/mock-data'

export default function PadreDashboard() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null)
  const [pagos, setPagos] = useState<Pago[]>([])
  const [tareas, setTareas] = useState<TareaAviso[]>([])
  const [conductas, setConductas] = useState<ConductaIncidencia[]>([])
  const [temarios, setTemarios] = useState<TemarioDia[]>([])

  useEffect(() => {
    const allAlumnos = dataStore.getAlumnos()
    const misHijos = allAlumnos.filter((a) => a.apoderado_id === 'usr-pad-1' || a.id === 'alu-1' || a.id === 'alu-2')
    setAlumnos(misHijos)
    if (misHijos.length > 0) {
      setSelectedAlumno(misHijos[0])
    }

    setPagos(dataStore.getPagos())
    setTareas(dataStore.getTareas())
    setConductas(dataStore.getConductas())
    setTemarios(dataStore.getTemarios())
  }, [])

  const childId = selectedAlumno?.id || 'alu-1'
  const childPagos = pagos.filter((p) => p.alumno_id === childId)
  const tieneMora = childPagos.some((p) => p.estado === 'vencido' || p.mora > 0)
  const deudasVencidas = childPagos.filter((p) => p.estado === 'vencido' || p.mora > 0)
  const childConductas = conductas.filter((c) => c.alumno_id === childId)

  return (
    <div className="space-y-6">
      {/* Header con Bienvenida y Selector de Hijo */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-secondary/15 text-secondary">
              Apoderado Oficial
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Ciclo Académico 2026</span>
          </div>
          <h1 className="text-2xl font-black text-primary tracking-tight">
            Bienvenido, Ing. Roberto Quispe Mamani
          </h1>
          <p className="text-xs text-on-surface-variant">
            Seguimiento académico, asistencia en tiempo real y pagos institucionales de sus menores hijos.
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
              <span className="text-[10px] opacity-80">({hijo.seccion_nombre.split(' ')[0]})</span>
            </button>
          ))}
        </div>
      </div>

      {/* ALERTA DE MORA Y BLOQUEO DE NOTAS (RF-033, RF-034) */}
      {tieneMora ? (
        <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-950">
                Aviso de Deuda Pendiente — Acceso a Notas Restringido (RF-034)
              </h3>
              <p className="text-xs text-amber-900/90 mt-0.5 leading-relaxed">
                El estudiante <span className="font-bold">{selectedAlumno?.nombres}</span> registra{' '}
                <span className="font-bold">{deudasVencidas.length} pensión(es) vencida(s)</span>. Regularice su pago mediante Yape QR para habilitar la visualización de notas.
              </p>
            </div>
          </div>
          <Link
            href="/padre/pagos"
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center justify-center gap-2 shrink-0 shadow-md transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Pagar con Yape QR</span>
          </Link>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-xs text-emerald-950 font-medium">
              <span className="font-bold">Estado de Cuenta al Día:</span> No registra deudas pendientes para {selectedAlumno?.nombres}.
            </p>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
            Notas Habilitadas
          </span>
        </div>
      )}

      {/* Grid de Acceso a Módulos Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Libreta de Notas */}
        <Link
          href="/padre/notas"
          className="p-5 rounded-2xl bg-white border border-outline-variant/30 hover:border-primary/40 shadow-soft hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">
              RF-030
            </span>
          </div>
          <h2 className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">
            Libreta de Calificaciones
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            {tieneMora ? '🔒 Bloqueado por mora' : 'Consolidado diario y bimestral'}
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-primary gap-1">
            <span>Ver notas</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Asistencia Escolar */}
        <Link
          href="/padre/asistencia"
          className="p-5 rounded-2xl bg-white border border-outline-variant/30 hover:border-primary/40 shadow-soft hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">
              RF-031
            </span>
          </div>
          <h2 className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">
            Control de Asistencia
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Marcación diaria por el auxiliar
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-primary gap-1">
            <span>Ver registro</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Pagos & Yape QR */}
        <Link
          href="/padre/pagos"
          className="p-5 rounded-2xl bg-white border border-outline-variant/30 hover:border-primary/40 shadow-soft hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">
              RF-035 / RF-050
            </span>
          </div>
          <h2 className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">
            Pagos & Yape QR
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            Subida de voucher y validación
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-primary gap-1">
            <span>Gestionar pagos</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Conducta y Méritos */}
        <Link
          href="/padre/conducta"
          className="p-5 rounded-2xl bg-white border border-outline-variant/30 hover:border-primary/40 shadow-soft hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ClipboardList className="w-5 h-5" />
            </div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">
              RF-038
            </span>
          </div>
          <h2 className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">
            Conducta y Méritos
          </h2>
          <p className="text-xs text-on-surface-variant mt-1">
            {childConductas.length} registro(s) por el auxiliar
          </p>
          <div className="mt-4 flex items-center text-xs font-semibold text-primary gap-1">
            <span>Ver reporte</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Sección Inferior: Temario del Día & Tareas Pendientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Temario del Día (RF-010, RF-082) */}
        <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-surface-container pb-3">
            <div className="flex items-center gap-2">
              <BookOpenCheck className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-bold text-primary">Temario Dictado Hoy en Clase (RF-010)</h2>
            </div>
            <Link href="/padre/temario" className="text-xs text-secondary font-bold hover:underline">
              Ver todos
            </Link>
          </div>

          <div className="space-y-3">
            {temarios.slice(0, 2).map((tem) => (
              <div key={tem.id} className="p-3.5 rounded-xl bg-surface-container/50 border border-outline-variant/20 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-primary">{tem.curso_nombre}</span>
                  <span className="text-on-surface-variant text-[11px]">{tem.fecha}</span>
                </div>
                <p className="text-xs font-semibold text-on-surface">{tem.tema_titulo}</p>
                <p className="text-xs text-on-surface-variant line-clamp-2">{tem.descripcion}</p>
                <p className="text-[10px] text-secondary font-medium">Dictado por: {tem.docente_nombre}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tareas y Cronograma de Entregas (RF-011, RF-037) */}
        <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-surface-container pb-3">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-bold text-primary">Tareas & Avisos de la Semana (RF-037)</h2>
            </div>
            <Link href="/padre/tareas" className="text-xs text-secondary font-bold hover:underline">
              Ver todas
            </Link>
          </div>

          <div className="space-y-3">
            {tareas.slice(0, 2).map((tar) => (
              <div key={tar.id} className="p-3.5 rounded-xl bg-surface-container/50 border border-outline-variant/20 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-primary">{tar.curso_nombre}</span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Límite: {tar.fecha_limite}
                  </span>
                </div>
                <p className="text-xs font-semibold text-on-surface">{tar.titulo}</p>
                <p className="text-xs text-on-surface-variant line-clamp-2">{tar.descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
