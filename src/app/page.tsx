'use client'

import React from 'react'
import Link from 'next/link'
import { School, ShieldCheck, GraduationCap, Users, ArrowRight, BookOpen, CheckCircle2, Lock, Sparkles } from 'lucide-react'
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
              Colegio Sedes Sapientiae
            </h1>
            <p className="text-xs text-secondary-container font-medium">
              Formación Integral en Valores y Excelencia
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
      <main className="max-w-7xl mx-auto px-6 py-12 sm:py-20 w-full flex-1 flex flex-col justify-center">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-secondary-container backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-secondary-container" />
            <span>Plataforma Oficial de Gestión Escolar 2026</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Gestión Educativa Moderna, Segura y en Tiempo Real
          </h2>

          <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Portal institucional unificado para seguimiento pedagógico de estudiantes, registro de calificaciones MINEDU con modo offline, pagos con Culqi, circulares y exportación SIAGIE.
          </p>
        </div>

        {/* Portals Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 sm:mt-16">
          {/* Card 1: Portal Apoderados */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-secondary/30 border border-secondary text-secondary-container flex items-center justify-center shadow-inner">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-secondary-container transition-colors">
                Portal de Apoderados
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Consulte libretas de calificaciones por competencias (AD/A/B/C), calendario de asistencia diaria, cronograma de pensiones con pasarela de pago seguro y circulares escolares.
              </p>
            </div>
            <button
              onClick={() => handleQuickLogin(DEMO_PROFILES[3])}
              className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/10 hover:bg-secondary text-white text-xs font-bold transition-all border border-white/20"
            >
              <span>Ingresar como Padre de Familia</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: Portal Docentes */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 flex items-center justify-center shadow-inner">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                Portal Docente
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Toma rápida de asistencia, registro de notas bimestrales por áreas curriculares y funcionamiento <strong>Offline-first con Dexie.js</strong> garantizado sin conexión a internet.
              </p>
            </div>
            <button
              onClick={() => handleQuickLogin(DEMO_PROFILES[2])}
              className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/10 hover:bg-emerald-600 text-white text-xs font-bold transition-all border border-white/20"
            >
              <span>Ingresar como Docente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 3: Portal Dirección & Secretaría */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400 text-purple-300 flex items-center justify-center shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                Dirección & Secretaría
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Gestión integral de admisión y matrícula, control financiero de morosidad, emisión segmentada de comunicados y exportación oficial de nóminas SIAGIE para el MINEDU.
              </p>
            </div>
            <button
              onClick={() => handleQuickLogin(DEMO_PROFILES[0])}
              className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/10 hover:bg-purple-600 text-white text-xs font-bold transition-all border border-white/20"
            >
              <span>Ingresar como Dirección</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Feature badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-white/75">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Supabase PostgreSQL + RLS Estricto</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-secondary-container" />
            <span>Offline-First con IndexedDB</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Integración Culqi & WhatsApp API</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-secondary-container" />
            <span>Formato Oficial MINEDU SIAGIE</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 border-t border-white/10 text-center text-xs text-white/60">
        © 2026 Colegio Sedes Sapientiae. Todos los derechos reservados. Sistema protegido por Row Level Security (RLS).
      </footer>
    </div>
  )
}
