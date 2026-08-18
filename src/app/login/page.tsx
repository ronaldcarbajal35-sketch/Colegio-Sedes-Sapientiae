'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  School,
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  Users,
  ClipboardList,
  HeartHandshake,
  BookOpen,
  AlertCircle,
  Sparkles,
  User,
  CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DEMO_PROFILES } from '@/components/shared/role-switcher-banner'
import { UserRole } from '@/lib/mock-data'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect')
  const errorParam = searchParams.get('error')

  const [selectedRole, setSelectedRole] = useState<UserRole>('padre')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(
    errorParam ? 'Acceso restringido: no cuenta con los permisos para este módulo.' : null
  )

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role)
    setErrorMessage(null)
    const match = DEMO_PROFILES.find((p) => p.rol === role)
    if (match) {
      setEmail(match.email)
      setPassword('••••••••')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    try {
      // Validar coincidencia de usuario con el rol seleccionado (RF-009)
      const userProfile = DEMO_PROFILES.find(
        (p) => p.email.toLowerCase() === email.toLowerCase().trim()
      )

      if (!userProfile) {
        throw new Error('Credenciales no válidas. Seleccione uno de los roles demo o verifique su correo.')
      }

      if (userProfile.rol !== selectedRole) {
        throw new Error(
          `Las credenciales corresponden a "${userProfile.rol}", pero seleccionó el rol "${selectedRole}". Seleccione el rol correcto.`
        )
      }

      executeDemoLogin(userProfile)
    } catch (err: any) {
      setErrorMessage(err?.message || 'Error al iniciar sesión.')
    } finally {
      setIsLoading(false)
    }
  }

  const executeDemoLogin = (profile: typeof DEMO_PROFILES[0]) => {
    document.cookie = `sedes_demo_role=${profile.rol}; path=/; max-age=86400`
    document.cookie = `sedes_demo_user=${encodeURIComponent(JSON.stringify(profile))}; path=/; max-age=86400`
    localStorage.setItem('sedes_active_user', JSON.stringify(profile))
    const target = redirectUrl || profile.defaultRoute
    router.push(target)
    router.refresh()
  }

  return (
    <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-outline-variant/30 overflow-hidden my-6">
      {/* Header Institucional con Escudo Oficial */}
      <div className="bg-gradient-to-r from-primary via-[#0d1f40] to-primary p-6 sm:p-7 text-white text-center relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-secondary/20 blur-2xl pointer-events-none" />
        
        <div className="w-16 h-16 rounded-2xl bg-white mx-auto flex items-center justify-center p-1.5 shadow-xl mb-3 border-2 border-secondary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/logo-sedes.jpg"
            alt="Logo Colegio Sedes Sapientiae"
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">
          Sedes Sapientiae
        </h1>
        <p className="text-xs text-secondary-container mt-1 font-semibold tracking-wider uppercase">
          Colegio Diocesano — Intranet Escolar 2026
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-error-container/40 border border-error/30 text-error flex items-start gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-xs font-semibold leading-relaxed">
              {errorMessage}
            </div>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Selector de Rol Desplegable Obligatorio (RF-008) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-primary">
              1. Seleccione su Rol Institucional (RF-008)
            </label>
            <div className="relative">
              <select
                value={selectedRole}
                onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                className="w-full px-4 py-3 rounded-2xl border-2 border-primary/20 bg-surface-container/50 text-xs sm:text-sm font-bold text-primary focus:outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all cursor-pointer appearance-none"
              >
                <option value="padre">👨‍👩‍👧 Padre de Familia / Apoderado</option>
                <option value="docente">👩‍🏫 Docente de Aula</option>
                <option value="auxiliar">📋 Auxiliar de Educación</option>
                <option value="psicologo">🧠 Psicólogo Escolar</option>
                <option value="administrativo">💼 Personal Administrativo / Secretaría</option>
                <option value="director">🏛️ Dirección General</option>
                <option value="alumno">🎒 Estudiante / Alumno</option>
              </select>
            </div>
            <p className="text-[11px] text-on-surface-variant font-medium">
              El sistema validará que sus credenciales correspondan estrictamente a este perfil (RF-009).
            </p>
          </div>

          <div className="space-y-3 pt-1">
            <Input
              label="2. Correo Electrónico Institucional"
              type="email"
              placeholder="ejemplo@sedes.edu.pe"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="3. Contraseña de Acceso"
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full bg-secondary hover:bg-secondary/90 text-white font-bold shadow-lg"
            isLoading={isLoading}
            leftIcon={<ArrowRight className="w-4 h-4" />}
          >
            Ingresar al Módulo
          </Button>
        </form>

        {/* Accesos Rápidos de Demostración (7 Roles) */}
        <div className="pt-4 border-t border-surface-container space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider">
              Acceso Rápido Demo (7 Perfiles)
            </span>
            <span className="text-[10px] text-on-surface-variant">Clic para autocompletar</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DEMO_PROFILES.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  handleRoleChange(p.rol)
                  executeDemoLogin(p)
                }}
                className={`p-2.5 rounded-xl border text-left transition-all text-xs hover:border-secondary hover:shadow-sm ${
                  selectedRole === p.rol
                    ? 'bg-primary/5 border-secondary ring-2 ring-secondary/20'
                    : 'bg-surface-container/40 border-outline-variant/30'
                }`}
              >
                <span className="font-bold text-primary block truncate">{p.nombre.split(' ')[0]} {p.nombre.split(' ')[1]}</span>
                <span className="text-[10px] text-secondary font-semibold uppercase">{p.rol}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="text-center pt-2">
          <Link
            href="/"
            className="text-xs text-secondary font-bold hover:underline"
          >
            ← Volver a la Portada Institucional
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-[#08152e] to-[#020b1c] flex flex-col justify-between relative overflow-hidden">
      {/* Background Photos with Subtle Vignette Overlay */}
      <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-luminosity">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/plana-docente.jpg"
          alt="Plana Docente Sedes Sapientiae"
          className="w-full h-full object-cover"
        />
      </div>

      <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between max-w-7xl mx-auto w-full z-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white p-1 shadow-md shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/logo-sedes.jpg"
              alt="Logo Sedes Sapientiae"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="text-sm font-black text-white tracking-tight uppercase leading-none">
              Sedes Sapientiae
            </h2>
            <p className="text-[10px] text-secondary-container font-medium">
              Colegio Diocesano — 24 Aulas
            </p>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold text-white/80 hover:text-white transition-colors"
        >
          Portada
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
        <Suspense fallback={<div className="text-white text-xs">Cargando formulario...</div>}>
          <LoginForm />
        </Suspense>
      </main>

      <footer className="px-6 py-3 border-t border-white/10 text-center text-[11px] text-white/60 z-10">
        © 2026 Colegio Diocesano Sedes Sapientiae. Plataforma Escolar Integral.
      </footer>
    </div>
  )
}
