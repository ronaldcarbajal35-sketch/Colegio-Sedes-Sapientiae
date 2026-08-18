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
  FileText,
  Award,
  Calendar,
  Compass
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
    <div className="min-h-screen bg-[#061024] text-white flex flex-col justify-between selection:bg-secondary selection:text-white">
      {/* Navigation Header */}
      <header className="sticky top-0 z-30 bg-[#061024]/90 backdrop-blur-md px-6 py-4 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white p-1 shadow-lg shrink-0 border border-secondary/40">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-sedes.jpg"
                alt="Escudo Sedes Sapientiae"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black tracking-tight uppercase leading-tight text-white">
                Sedes Sapientiae
              </h1>
              <p className="text-[11px] text-secondary-container font-medium">
                Colegio Diocesano — Inicial • Primaria • Secundaria
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/repositorio"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold transition-all border border-white/15"
            >
              <BookOpen className="w-3.5 h-3.5 text-secondary-container" />
              <span>Biblioteca Digital</span>
            </Link>

            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-white font-bold text-xs sm:text-sm hover:bg-secondary/90 transition-all shadow-md hover:scale-105"
            >
              <span>Ingreso al Sistema</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section con Fotografía Real de Fondo */}
      <section className="relative overflow-hidden border-b border-white/10 py-16 sm:py-24">
        {/* Background Image con Gradiente Oscuro Profesional */}
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero-desfile-escolta.jpg"
            alt="Desfile Cívico y Escolta Colegio Sedes Sapientiae"
            className="w-full h-full object-cover object-center filter brightness-[0.35] contrast-125 scale-105 transform motion-safe:animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061024] via-[#061024]/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 border border-white/25 text-xs font-bold text-secondary-container backdrop-blur-md shadow-lg">
            <Sparkles className="w-4 h-4 text-secondary-container animate-spin-slow" />
            <span>Formando Líderes en Valores y Excelencia Académica</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mx-auto text-white drop-shadow-md">
            Colegio Diocesano <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-white via-secondary-container to-white bg-clip-text text-transparent">
              Sedes Sapientiae
            </span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-white/85 max-w-2xl mx-auto leading-relaxed drop-shadow">
            Plataforma Institucional Oficial para el seguimiento pedagógico en tiempo real, gestión de trámites FUT, control de asistencia, calificaciones y biblioteca digital en nuestras <strong>24 aulas</strong>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/login"
              className="px-6 py-3.5 rounded-2xl bg-secondary hover:bg-secondary/90 text-white font-bold text-sm shadow-xl hover:shadow-2xl transition-all flex items-center gap-2"
            >
              <span>Acceder a la Intranet Escolar</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#comunidad"
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition-all"
            >
              Conocer Nuestra Comunidad
            </a>
          </div>

          {/* Badges Rápidos */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-white/80">
            <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-sm border border-white/15">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>24 Aulas (Inicial, Primaria, Secundaria)</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-sm border border-white/15">
              <CheckCircle2 className="w-4 h-4 text-secondary-container" />
              <span>Mesa de Trámites FUT Virtual</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-sm border border-white/15">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Pagos Yape QR & Alertas WhatsApp</span>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Comunidad Educativa / Galería Fotográfica */}
      <section id="comunidad" className="max-w-7xl mx-auto px-6 py-14 sm:py-20 w-full space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-secondary-container">
            Identidad & Tradición
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Nuestra Comunidad Educativa en Acción
          </h2>
          <p className="text-xs sm:text-sm text-white/70">
            Docentes calificados, compromiso pastoral y estudiantes comprometidos con la disciplina y el honor.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Tarjeta 1: Plana Docente y Directiva */}
          <div className="group rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-secondary/40 transition-all duration-300 flex flex-col justify-between">
            <div className="h-56 overflow-hidden relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/plana-docente.jpg"
                alt="Plana Docente Sedes Sapientiae"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061024] via-transparent to-transparent" />
              <span className="absolute bottom-3 left-4 text-xs font-bold px-2.5 py-1 rounded-full bg-secondary/80 text-white backdrop-blur-sm">
                Plana Docente & Directiva
              </span>
            </div>
            <div className="p-5 space-y-2">
              <h3 className="text-base font-bold text-white group-hover:text-secondary-container transition-colors">
                Excelencia Pedagógica & Acompañamiento
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Docentes titulados con vocación de servicio, tutores por grado y acompañamiento permanente en las 24 aulas.
              </p>
            </div>
          </div>

          {/* Tarjeta 2: Formación Cívica y Escolta */}
          <div className="group rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-secondary/40 transition-all duration-300 flex flex-col justify-between">
            <div className="h-56 overflow-hidden relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/alumnas-desfile.jpg"
                alt="Batallón y Escolta de Alumnas"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061024] via-transparent to-transparent" />
              <span className="absolute bottom-3 left-4 text-xs font-bold px-2.5 py-1 rounded-full bg-primary-container text-white backdrop-blur-sm">
                Disciplina & Civismo
              </span>
            </div>
            <div className="p-5 space-y-2">
              <h3 className="text-base font-bold text-white group-hover:text-secondary-container transition-colors">
                Batallón y Escolta Escolar
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Fomentamos el civismo, amor a la patria, gallardía y trabajo en equipo a través de nuestras representaciones cívicas.
              </p>
            </div>
          </div>

          {/* Tarjeta 3: Aniversario y Trayectoria */}
          <div className="group rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-secondary/40 transition-all duration-300 flex flex-col justify-between">
            <div className="h-56 overflow-hidden relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/docentes-aniversario.jpg"
                alt="Docentes en Aniversario Institucional"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061024] via-transparent to-transparent" />
              <span className="absolute bottom-3 left-4 text-xs font-bold px-2.5 py-1 rounded-full bg-rose-900/80 text-white backdrop-blur-sm">
                25 Años de Historia
              </span>
            </div>
            <div className="p-5 space-y-2">
              <h3 className="text-base font-bold text-white group-hover:text-secondary-container transition-colors">
                Tradición y Prestigio Diocesano
              </h3>
              <p className="text-xs text-white/70 leading-relaxed">
                Bodas de Plata formando generaciones con valores cristianos, solvencia moral y preparación para la educación superior.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portales de Acceso Rápido por Rol */}
      <section className="bg-gradient-to-b from-[#061024] via-[#0b1b3d] to-[#061024] py-16 border-t border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-widest text-secondary-container">
              Módulos del Sistema
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Accesos Directos a los 7 Portales
            </h2>
            <p className="text-xs text-white/70">
              Seleccione su rol para ingresar inmediatamente a su panel correspondiente:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* 1. Apoderados */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:bg-white/15 hover:border-cyan-400/50 transition-all group">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Portal de Apoderados
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Notas diarias con bloqueo por mora, pagos con Yape QR, temario del día y mesa de trámites FUT.
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
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:bg-white/15 hover:border-emerald-400/50 transition-all group">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Portal Docente
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Temario diario, registro de notas con auditoría, publicación de tareas y descarga de textos escolares.
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
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:bg-white/15 hover:border-amber-400/50 transition-all group">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  Portal Auxiliar
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Toma rápida de asistencia de las 24 aulas y registro de incidencias y méritos con aviso WhatsApp.
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
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:bg-white/15 hover:border-rose-400/50 transition-all group">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors">
                  Dpto. Psicología
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Fichas confidenciales de atención, seguimiento psicopedagógico y pautas a docentes.
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

            {/* 5. Dirección General */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:bg-white/15 hover:border-purple-400/50 transition-all group">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                  Dirección General
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Supervisión global de las 24 aulas, aprobación de FUTs y reportes consolidados.
                </p>
              </div>
              <button
                onClick={() => handleQuickLogin(DEMO_PROFILES[0])}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-purple-600 text-white text-xs font-bold transition-all border border-white/20 flex items-center justify-center gap-1.5"
              >
                <span>Acceso Dirección</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 6. Secretaría & Admin */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:bg-white/15 hover:border-blue-400/50 transition-all group">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
                  <School className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                  Secretaría & Admin
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Validación de vouchers Yape QR, mesa de partes FUT, morosidad y exportación SIAGIE.
                </p>
              </div>
              <button
                onClick={() => handleQuickLogin(DEMO_PROFILES[1])}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-blue-600 text-white text-xs font-bold transition-all border border-white/20 flex items-center justify-center gap-1.5"
              >
                <span>Acceso Secretaría</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 7. Alumnos */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:bg-white/15 hover:border-amber-400/50 transition-all group">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                  Portal de Alumnos
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Consulta de tareas asignadas, temario de hoy, calificaciones y repositorio de libros.
                </p>
              </div>
              <button
                onClick={() => handleQuickLogin(DEMO_PROFILES[6])}
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-amber-600 text-white text-xs font-bold transition-all border border-white/20 flex items-center justify-center gap-1.5"
              >
                <span>Acceso Alumno</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 8. Repositorio Digital */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:bg-white/15 hover:border-emerald-400/50 transition-all group">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Biblioteca Digital
                </h3>
                <p className="text-xs text-white/70 leading-relaxed">
                  Descarga directa de textos escolares, guías y separatas por nivel y curso.
                </p>
              </div>
              <Link
                href="/repositorio"
                className="w-full py-2 rounded-xl bg-white/10 hover:bg-emerald-600 text-white text-xs font-bold transition-all border border-white/20 flex items-center justify-center gap-1.5"
              >
                <span>Explorar Biblioteca</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-white/10 text-center text-xs text-white/60 space-y-2">
        <div className="flex items-center justify-center gap-2">
          <div className="w-6 h-6 rounded bg-white p-0.5 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo-sedes.jpg" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-bold text-white">Colegio Diocesano Sedes Sapientiae</span>
        </div>
        <p>© 2026 Colegio Sedes Sapientiae. Plataforma Escolar Integral — Formando personas íntegras para el Perú.</p>
      </footer>
    </div>
  )
}
