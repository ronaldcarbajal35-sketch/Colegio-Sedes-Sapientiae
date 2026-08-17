'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ShieldCheck, UserCheck, GraduationCap, Users, ChevronDown, Sparkles } from 'lucide-react'

export interface DemoUser {
  id: string
  nombre: string
  email: string
  rol: 'direccion' | 'secretaria' | 'docente' | 'padre'
  cargo: string
  avatar: string
  defaultRoute: string
}

export const DEMO_PROFILES: DemoUser[] = [
  {
    id: 'd1000000-0000-0000-0000-000000000001',
    nombre: 'Sor María del Carmen Rodríguez',
    email: 'direccion@sedes.edu.pe',
    rol: 'direccion',
    cargo: 'Directora General',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&q=80',
    defaultRoute: '/admin/dashboard',
  },
  {
    id: 'd1000000-0000-0000-0000-000000000002',
    nombre: 'Lic. Patricia Valenzuela',
    email: 'secretaria@sedes.edu.pe',
    rol: 'secretaria',
    cargo: 'Secretaría Académica & SIAGIE',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&q=80',
    defaultRoute: '/admin/matricula',
  },
  {
    id: 'd1000000-0000-0000-0000-000000000003',
    nombre: 'Prof. Carlos Alberto García Silva',
    email: 'docente.garcia@sedes.edu.pe',
    rol: 'docente',
    cargo: 'Docente de Matemática (3ro A / 5to B)',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&q=80',
    defaultRoute: '/docente/secciones',
  },
  {
    id: 'd1000000-0000-0000-0000-000000000005',
    nombre: 'Ing. Roberto Quispe Mamani',
    email: 'apoderado.quispe@gmail.com',
    rol: 'padre',
    cargo: 'Apoderado (Joaquín y Valeria)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&q=80',
    defaultRoute: '/padre/dashboard',
  },
]

export function RoleSwitcherBanner() {
  const router = useRouter()
  const pathname = usePathname()
  const [currentRole, setCurrentRole] = useState<string>('padre')
  const [currentUser, setCurrentUser] = useState<DemoUser>(DEMO_PROFILES[3])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Detectar rol actual por cookies o ruta
    const roleCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('sedes_demo_role='))
      ?.split('=')[1]

    if (roleCookie) {
      const match = DEMO_PROFILES.find(p => p.rol === roleCookie)
      if (match) {
        setCurrentRole(roleCookie)
        setCurrentUser(match)
        return
      }
    }

    if (pathname.startsWith('/admin')) {
      setCurrentRole('direccion')
      setCurrentUser(DEMO_PROFILES[0])
    } else if (pathname.startsWith('/docente')) {
      setCurrentRole('docente')
      setCurrentUser(DEMO_PROFILES[2])
    } else if (pathname.startsWith('/padre')) {
      setCurrentRole('padre')
      setCurrentUser(DEMO_PROFILES[3])
    }
  }, [pathname])

  const handleSwitchRole = (profile: DemoUser) => {
    // Guardar rol demo en cookie para middleware
    document.cookie = `sedes_demo_role=${profile.rol}; path=/; max-age=86400`
    document.cookie = `sedes_demo_user=${encodeURIComponent(JSON.stringify(profile))}; path=/; max-age=86400`
    localStorage.setItem('sedes_active_user', JSON.stringify(profile))
    setCurrentRole(profile.rol)
    setCurrentUser(profile)
    setIsOpen(false)
    router.push(profile.defaultRoute)
    router.refresh()
  }

  const roleIcons = {
    direccion: <ShieldCheck className="w-4 h-4 text-purple-600" />,
    secretaria: <UserCheck className="w-4 h-4 text-blue-600" />,
    docente: <GraduationCap className="w-4 h-4 text-emerald-600" />,
    padre: <Users className="w-4 h-4 text-amber-600" />,
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container/80 hover:bg-surface-container border border-outline-variant/40 text-xs font-semibold text-primary transition-all shadow-sm"
      >
        <Sparkles className="w-3.5 h-3.5 text-secondary" />
        <span className="hidden sm:inline text-on-surface-variant font-normal">Rol demo:</span>
        <span className="capitalize font-bold text-primary">{currentUser.rol}</span>
        <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-elevated border border-outline-variant/30 p-2 z-50 animate-in fade-in zoom-in-95">
            <div className="px-3 py-2 border-b border-surface-container/80 mb-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Cambio Rápido de Rol (Demo & RLS)
              </p>
              <p className="text-xs text-on-surface-variant/80">
                Selecciona una identidad para validar vistas y permisos:
              </p>
            </div>
            <div className="space-y-1">
              {DEMO_PROFILES.map((prof) => (
                <button
                  key={prof.id}
                  onClick={() => handleSwitchRole(prof)}
                  className={`w-full text-left p-2.5 rounded-lg transition-all flex items-center gap-3 ${
                    currentRole === prof.rol
                      ? 'bg-primary/10 border border-primary/30 text-primary font-medium'
                      : 'hover:bg-surface-container text-on-surface'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center shrink-0 border border-outline-variant/30">
                    {roleIcons[prof.rol]}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-primary truncate">{prof.nombre}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold bg-surface-container text-on-surface-variant">
                        {prof.rol}
                      </span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant truncate">{prof.cargo}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
