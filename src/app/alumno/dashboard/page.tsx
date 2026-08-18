'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  CheckSquare,
  CalendarCheck2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Clock,
  Download
} from 'lucide-react'
import { dataStore, TareaAviso, TemarioDia, LibroMaterial } from '@/lib/mock-data'

export default function AlumnoDashboardPage() {
  const [tareas, setTareas] = useState<TareaAviso[]>([])
  const [temarios, setTemarios] = useState<TemarioDia[]>([])
  const [libros, setLibros] = useState<LibroMaterial[]>([])

  useEffect(() => {
    setTareas(dataStore.getTareas())
    setTemarios(dataStore.getTemarios())
    setLibros(dataStore.getLibrosMaterial())
  }, [])

  return (
    <div className="space-y-6">
      {/* Bienvenida Estudiante */}
      <div className="bg-gradient-to-r from-primary to-primary-container p-6 sm:p-8 rounded-3xl text-white shadow-soft relative overflow-hidden">
        <div className="max-w-xl space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-secondary/30 text-secondary-container">
            Estudiante Oficial — 3ro A Primaria
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            ¡Hola, Joaquín Andrés! 👋
          </h1>
          <p className="text-xs sm:text-sm text-surface-container/90 leading-relaxed">
            Revisa tus tareas de la semana, el temario dictado hoy por tus profesores y descarga tus libros digitales.
          </p>
        </div>
      </div>

      {/* Accesos Rápidos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/alumno/tareas"
          className="p-5 rounded-2xl bg-white border border-outline-variant/30 hover:border-primary/40 shadow-soft hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <CheckSquare className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">
            Mis Tareas
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">{tareas.length} Tareas asignadas</p>
          <div className="mt-4 flex items-center text-xs font-semibold text-primary gap-1">
            <span>Ver tareas</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/alumno/temario"
          className="p-5 rounded-2xl bg-white border border-outline-variant/30 hover:border-primary/40 shadow-soft hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <CalendarCheck2 className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">
            Temario de Hoy
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">{temarios.length} Clases dictadas</p>
          <div className="mt-4 flex items-center text-xs font-semibold text-primary gap-1">
            <span>Ver temas</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/repositorio"
          className="p-5 rounded-2xl bg-white border border-outline-variant/30 hover:border-primary/40 shadow-soft hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">
            Biblioteca Digital
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">{libros.length} Libros y Guías</p>
          <div className="mt-4 flex items-center text-xs font-semibold text-primary gap-1">
            <span>Descargar libros</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/alumno/notas"
          className="p-5 rounded-2xl bg-white border border-outline-variant/30 hover:border-primary/40 shadow-soft hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h2 className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">
            Mis Calificaciones
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">Bimestre I en curso</p>
          <div className="mt-4 flex items-center text-xs font-semibold text-primary gap-1">
            <span>Ver mis notas</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Tareas Urgentes y Temario Reciente */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-surface-container pb-3">
            <h2 className="text-sm font-bold text-primary flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-purple-700" />
              <span>Tareas Pendientes (RF-080)</span>
            </h2>
            <Link href="/alumno/tareas" className="text-xs text-secondary font-bold hover:underline">
              Ver todas
            </Link>
          </div>

          <div className="space-y-3">
            {tareas.map((t) => (
              <div key={t.id} className="p-3.5 rounded-xl bg-surface-container/50 border border-outline-variant/20 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-primary">{t.curso_nombre}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {t.fecha_limite}
                  </span>
                </div>
                <p className="text-xs font-semibold text-on-surface">{t.titulo}</p>
                <p className="text-[11px] text-on-surface-variant truncate">{t.descripcion}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-surface-container pb-3">
            <h2 className="text-sm font-bold text-primary flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>Libros Escolares Disponibles (RF-081)</span>
            </h2>
            <Link href="/repositorio" className="text-xs text-secondary font-bold hover:underline">
              Ir al repositorio
            </Link>
          </div>

          <div className="space-y-3">
            {libros.map((l) => (
              <div key={l.id} className="p-3.5 rounded-xl bg-surface-container/50 border border-outline-variant/20 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-primary block">{l.titulo}</span>
                  <span className="text-[11px] text-on-surface-variant">{l.curso_nombre} • {l.tamano_mb}</span>
                </div>
                <a
                  href={l.url_descarga}
                  className="px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold flex items-center gap-1.5 hover:bg-primary/90 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
