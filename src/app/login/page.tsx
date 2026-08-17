'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { School, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, GraduationCap, Users, AlertCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DEMO_PROFILES } from '@/components/shared/role-switcher-banner'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get('redirect')
  const errorParam = searchParams.get('error')

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(
    errorParam === 'unauthorized_admin'
      ? 'Su cuenta no tiene permisos de Dirección o Secretaría para acceder a este módulo.'
      : errorParam === 'unauthorized_docente'
      ? 'Su cuenta no tiene permisos de Docente para acceder a este módulo.'
      : errorParam === 'unauthorized_padre'
      ? 'Su cuenta no tiene permisos de Apoderado para acceder a este módulo.'
      : null
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    try {
      // 1. Intentar inicio con Supabase Auth si está configurado
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Si no existe usuario en Supabase Auth o es un demo email
        const demoUser = DEMO_PROFILES.find(p => p.email.toLowerCase() === email.toLowerCase())
        if (demoUser) {
          executeDemoLogin(demoUser)
          return
        }
        throw error
      }

      if (data?.user) {
        const rol = data.user.user_metadata?.rol || 'padre'
        const target = redirectUrl || (rol === 'direccion' || rol === 'secretaria' ? '/admin/dashboard' : rol === 'docente' ? '/docente/secciones' : '/padre/dashboard')
        router.push(target)
        router.refresh()
      }
    } catch (err: any) {
      // Fallback para login de demostración inteligente
      const demoUser = DEMO_PROFILES.find(p => p.email.toLowerCase() === email.toLowerCase())
      if (demoUser) {
        executeDemoLogin(demoUser)
      } else {
        setErrorMessage(err?.message || 'Credenciales no válidas. Pruebe los accesos directos de demostración abajo.')
      }
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
    <div className="w-full max-w-md bg-white rounded-2xl shadow-elevated border border-outline-variant/20 overflow-hidden">
      {/* Header */}
      <div className="bg-primary p-6 sm:p-8 text-white text-center relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-secondary/20 blur-2xl pointer-events-none" />
        
        <div className="w-14 h-14 rounded-2xl bg-secondary mx-auto flex items-center justify-center text-white shadow-lg mb-3">
          <School className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold uppercase tracking-tight text-white">
          Colegio Sedes Sapientiae
        </h1>
        <p className="text-xs text-secondary-container mt-1 font-medium">
          Intranet Institucional 2026
        </p>
      </div>

      {/* Body */}
      <div className="p-6 sm:p-8 space-y-6">
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-error-container text-error text-xs font-medium flex items-start gap-2.5 border border-error/20">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
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
            className="w-full py-3 text-sm font-bold shadow-md"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Iniciar Sesión
          </Button>
        </form>

        {/* Quick Demo Logins */}
        <div className="pt-4 border-t border-outline-variant/30">
          <div className="flex items-center gap-1.5 justify-center text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">
            <Sparkles className="w-3.5 h-3.5 text-secondary" />
            <span>Acceso Rápido por Rol (Demostración)</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => executeDemoLogin(DEMO_PROFILES[3])}
              className="flex items-center gap-2 p-2.5 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100/80 text-amber-950 text-left transition-all"
            >
              <Users className="w-4 h-4 text-amber-700 shrink-0" />
              <div className="overflow-hidden">
                <p className="text-[11px] font-bold truncate">Padre de Familia</p>
                <p className="text-[9px] text-amber-800/80 truncate">Apoderado Quispe</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => executeDemoLogin(DEMO_PROFILES[2])}
              className="flex items-center gap-2 p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-950 text-left transition-all"
            >
              <GraduationCap className="w-4 h-4 text-emerald-700 shrink-0" />
              <div className="overflow-hidden">
                <p className="text-[11px] font-bold truncate">Docente</p>
                <p className="text-[9px] text-emerald-800/80 truncate">Prof. García</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => executeDemoLogin(DEMO_PROFILES[0])}
              className="flex items-center gap-2 p-2.5 rounded-xl border border-purple-200 bg-purple-50/70 hover:bg-purple-100/80 text-purple-950 text-left transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-purple-700 shrink-0" />
              <div className="overflow-hidden">
                <p className="text-[11px] font-bold truncate">Dirección</p>
                <p className="text-[9px] text-purple-800/80 truncate">Sor María</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => executeDemoLogin(DEMO_PROFILES[1])}
              className="flex items-center gap-2 p-2.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100/80 text-blue-950 text-left transition-all"
            >
              <UserCheck className="w-4 h-4 text-blue-700 shrink-0" />
              <div className="overflow-hidden">
                <p className="text-[11px] font-bold truncate">Secretaría</p>
                <p className="text-[9px] text-blue-800/80 truncate">Lic. Valenzuela</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-3.5 bg-surface-container/50 border-t border-outline-variant/20 text-center text-xs text-on-surface-variant">
        Protegido con Supabase Auth & RLS de PostgreSQL
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary-container to-[#020d20] flex items-center justify-center p-4 sm:p-6">
      <Suspense fallback={<div className="text-white text-sm">Cargando intranet...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
