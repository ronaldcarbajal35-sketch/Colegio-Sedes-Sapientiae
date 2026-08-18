'use client'

import React from 'react'
import Link from 'next/link'
import {
  School,
  ShieldCheck,
  GraduationCap,
  Users,
  ClipboardList,
  HeartHandshake,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  QrCode,
  FileText
} from 'lucide-react'
import { DEMO_PROFILES } from '@/components/shared/role-switcher-banner'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  const handleQuickLogin = (profile: typeof DEMO_PROFILES[0]) => {
    document.cookie = `sedes_demo_role=${profile.rol}; path=/; max-age=86400`
    document.cookie = `sedes_demo_user=${encodeURIComponent(JSON.stringify(profile))}; path=/; max-age=86400`
    localStorage.setItem('sedes_active_user', JSON.stringify(profile))
    router.push(profile.defaultRoute)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary via-primary-container to-[#020b1c] text-white flex flex-col justify-between">
      {/* Navigation Header */}
      <header className="px-6 py-5 border-b border-white/10 flex items-center justify-between max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-white shadow-md">
            <School className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight uppercase leading-tight text-white">
              Colegio Sede Sapiens
            </h1>
            <p className="text-xs text-secondary-container font-medium">
              Plataforma Escolar Integral — 24 Aulas
            </p>
          </div>
        </div>

        <Link
          href="/login"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-white font-semibold text-sm hover:bg-secondary-container hover:text-primary transition-all shadow-md"
        >
          <span>Ingreso al Sistema</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-10 sm:py-16 w-full flex-1 flex flex-col justify-center space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-secondary-container backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-secondary-container" />
            <span>Sistema Escolar Integral 2026 (7 Roles & 24 Aulas)</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Gestión Educativa, Trámites FUT, Pagos Yape QR & Psicología
          </h2>

          <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
            Plataforma institucional centralizada para Directores, Administrativos, Docentes, Auxiliares, Psicólogos, Padres de Familia y Alumnos.
          </p>
        </div>

        {/* Portales de los 7 Roles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* 1. Padres */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:bg-white/15 transition-all group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                Portal de Apoderados
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Notas diarias/bimestrales con bloqueo dinámico por mora, pagos con Yape QR, asistencia y tareas.
              </p>
            </div>
            <button
              onClick={() => handleQuickLogin(DEMO_PROFILES[5])}
              className="w-full py-2 rounded-xl bg-white/10 hover:bg-cyan-600 text-white text-xs font-bold transition-all border border-white/20 flex items-center justify-center gap-1.5"
            >
              <span>Acceso Apoderado</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 2. Docentes */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:bg-white/15 transition-all group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                Portal Docente
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Temario del día, publicación de tareas, registro de notas diarias/bimestrales y auditoría de cambios.
              </p>
            </div>
            <button
              onClick={() => handleQuickLogin(DEMO_PROFILES[2])}
              className="w-full py-2 rounded-xl bg-white/10 hover:bg-emerald-600 text-white text-xs font-bold transition-all border border-white/20 flex items-center justify-center gap-1.5"
            >
              <span>Acceso Docente</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 3. Auxiliares */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:bg-white/15 transition-all group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                <ClipboardList className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                Portal Auxiliar
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Toma de asistencia rápida de las 24 aulas y notas de conducta/méritos con aviso WhatsApp.
              </p>
            </div>
            <button
              onClick={() => handleQuickLogin(DEMO_PROFILES[3])}
              className="w-full py-2 rounded-xl bg-white/10 hover:bg-amber-600 text-white text-xs font-bold transition-all border border-white/20 flex items-center justify-center gap-1.5"
            >
              <span>Acceso Auxiliar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4. Psicología */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:bg-white/15 transition-all group">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors">
                Dpto. Psicología
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Fichas de atención y entrevistas confidenciales, seguimiento y derivaciones a docentes y padres.
              </p>
            </div>
            <button
              onClick={() => handleQuickLogin(DEMO_PROFILES[4])}
              className="w-full py-2 rounded-xl bg-white/10 hover:bg-rose-600 text-white text-xs font-bold transition-all border border-white/20 flex items-center justify-center gap-1.5"
            >
              <span>Acceso Psicología</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Badges de Cobertura */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-white/80 pt-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>24 Aulas Activas (Inicial, Primaria, Secundaria)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-secondary-container" />
            <span>Mesa de Trámites FUT & Derivaciones</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Pagos Yape QR con Desbloqueo Automático de Mora</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-secondary-container" />
            <span>Meta WhatsApp API para Notificaciones en Vivo</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-white/10 text-center text-xs text-white/60">
        © 2026 Colegio Sede Sapiens. Plataforma Escolar Integral adaptada a los requerimientos funcionales institucionales.
      </footer>
    </div>
  )
}
