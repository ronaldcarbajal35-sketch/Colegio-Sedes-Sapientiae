'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
        throw new Error('Credenciales no válidas. Pruebe seleccionando un rol o los accesos demo abajo.')
      }

      if (userProfile.rol !== selectedRole) {
        throw new Error(
          `Las credenciales ingresadas corresponden a "${userProfile.rol}", pero seleccionó el rol "${selectedRole}". Por favor seleccione el rol correcto.`
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
    <div className="w-full max-w-lg bg-white rounded-3xl shadow-elevated border border-outline-variant/30 overflow-hidden">
      {/* Header Institucional */}
      <div className="bg-primary p-6 sm:p-7 text-white text-center relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-secondary/20 blur-2xl pointer-events-none" />
        
        <div className="w-14 h-14 rounded-2xl bg-secondary mx-auto flex items-center justify-center text-white shadow-lg mb-3">
          <School className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold uppercase tracking-tight text-white">
          Colegio Sede Sapiens
        </h1>
        <p className="text-xs text-secondary-container mt-1 font-medium">
          Portal Institucional & Intranet 2026 (24 Aulas)
        </p>
      </div>

      {/* Formulario */}
      <div className="p-6 sm:p-7 space-y-5">
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-error-container text-error text-xs font-medium flex items-start gap-2.5 border border-error/20">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* RF-008: Selector Desplegable de Rol */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-secondary" />
              Seleccione su Rol Institucional (RF-008)
            </label>
            <div className="relative">
              <select
                value={selectedRole}
                onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-outline-variant/60 bg-surface-container/50 text-sm font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
              >
                <option value="padre">👨‍👩‍👧 Padre de Familia / Apoderado</option>
                <option value="docente">👩‍🏫 Docente (Profesor)</option>
                <option value="auxiliar">📋 Auxiliar de Educación</option>
                <option value="administrativo">💼 Administrativo / Secretaría</option>
                <option value="director">🏛️ Dirección General</option>
                <option value="psicologo">🧠 Departamento de Psicología</option>
                <option value="alumno">🎒 Alumno (Estudiante)</option>
              </select>
            </div>
            <p className="text-[11px] text-on-surface-variant">
              El sistema validará que sus credenciales coincidan con el rol seleccionado (RF-009).
            </p>
          </div>

          <Input
            label="Correo Electrónico Institucional"
            type="email"
            placeholder="ejemplo@sedes.edu.pe"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3 text-sm font-bold shadow-md bg-primary hover:bg-primary/90"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Ingresar como {selectedRole.toUpperCase()}
          </Button>
        </form>

        {/* Acceso Rápido Demo para los 7 Roles */}
        <div className="pt-4 border-t border-outline-variant/30">
          <div className="flex items-center gap-1.5 justify-center text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2.5">
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            <span>Acceso Rápido por Rol (Demostración)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {DEMO_PROFILES.map((prof) => (
              <button
                key={prof.id}
                type="button"
                onClick={() => executeDemoLogin(prof)}
                className="flex flex-col items-start p-2.5 rounded-xl border border-outline-variant/40 hover:border-primary/50 bg-surface-container/50 hover:bg-surface-container text-left transition-all group"
              >
                <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${prof.badgeColor}`}>
                  {prof.rol}
                </span>
                <p className="text-[11px] font-bold text-primary truncate w-full mt-1 group-hover:text-secondary">
                  {prof.nombre.split(' ')[0]} {prof.nombre.split(' ')[1] || ''}
                </p>
                <p className="text-[9px] text-on-surface-variant truncate w-full">
                  {prof.cargo.split('—')[0]}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-surface-container/60 border-t border-outline-variant/20 text-center text-xs text-on-surface-variant">
        Plataforma Escolar Integral — Colegio Sede Sapiens 2026
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-container to-[#020d20] flex items-center justify-center p-4 sm:p-6">
      <Suspense fallback={<div className="text-white text-sm">Cargando portal escolar...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
