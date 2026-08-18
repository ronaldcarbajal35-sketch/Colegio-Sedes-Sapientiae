'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  ShieldCheck,
  UserCheck,
  GraduationCap,
  Users,
  HeartHandshake,
  BookOpen,
  ClipboardList,
  ChevronDown,
  Sparkles,
  Check
} from 'lucide-react'
import { UserRole } from '@/lib/mock-data'

export interface DemoUser {
  id: string
  nombre: string
  email: string
  rol: UserRole
  cargo: string
  avatar: string
  defaultRoute: string
  badgeColor: string
}

export const DEMO_PROFILES: DemoUser[] = [
  {
    id: 'd1000000-0000-0000-0000-000000000001',
    nombre: 'Sor María del Carmen Rodríguez',
    email: 'direccion@sedes.edu.pe',
    rol: 'director',
    cargo: 'Directora General — Supervisión Institucional & FUT',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&h=120&fit=crop&q=80',
    defaultRoute: '/director/dashboard',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  {
    id: 'd1000000-0000-0000-0000-000000000002',
    nombre: 'Lic. Patricia Valenzuela',
    email: 'secretaria@sedes.edu.pe',
    rol: 'administrativo',
    cargo: 'Secretaría Académica — FUT & Validación Yape QR',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&h=120&fit=crop&q=80',
    defaultRoute: '/admin/dashboard',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  {
    id: 'd1000000-0000-0000-0000-000000000003',
    nombre: 'Prof. Carlos García Silva',
    email: 'docente.garcia@sedes.edu.pe',
    rol: 'docente',
    cargo: 'Docente — Temario, Tareas, Notas y Material',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&q=80',
    defaultRoute: '/docente/secciones',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    id: 'd1000000-0000-0000-0000-000000000004',
    nombre: 'Aux. Pedro Huamán Quispe',
    email: 'auxiliar.huaman@sedes.edu.pe',
    rol: 'auxiliar',
    cargo: 'Auxiliar — Asistencia 24 Aulas & Conducta / Méritos',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=80',
    defaultRoute: '/auxiliar/asistencia',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  {
    id: 'd1000000-0000-0000-0000-000000000005',
    nombre: 'Lic. Andrés Salgado',
    email: 'psicologia@sedes.edu.pe',
    rol: 'psicologo',
    cargo: 'Dpto. Psicología — Fichas y Derivaciones Confidenciales',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&q=80',
    defaultRoute: '/psicologia/atenciones',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
  },
  {
    id: 'd1000000-0000-0000-0000-000000000006',
    nombre: 'Ing. Roberto Quispe Mamani',
    email: 'apoderado.quispe@gmail.com',
    rol: 'padre',
    cargo: 'Apoderado — Joaquín (3° Pri) y Valeria (5° Sec)',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&q=80',
    defaultRoute: '/padre/dashboard',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  },
  {
    id: 'd1000000-0000-0000-0000-000000000007',
    nombre: 'Joaquín Andrés Quispe',
    email: 'alumno.joaquin@sedes.edu.pe',
    rol: 'alumno',
    cargo: 'Estudiante — 3ro A Primaria',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&fit=crop&q=80',
    defaultRoute: '/alumno/dashboard',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  },
]

export function RoleSwitcherBanner() {
  const router = useRouter()
  const pathname = usePathname()
  const [currentUser, setCurrentUser] = useState<DemoUser>(DEMO_PROFILES[5]) // Default: Padre
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const roleCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('sedes_demo_role='))
      ?.split('=')[1]

    if (roleCookie) {
      const match = DEMO_PROFILES.find(p => p.rol === roleCookie)
      if (match) {
        setCurrentUser(match)
        return
      }
    }

    if (pathname.startsWith('/director')) {
      setCurrentUser(DEMO_PROFILES[0])
    } else if (pathname.startsWith('/admin')) {
      setCurrentUser(DEMO_PROFILES[1])
    } else if (pathname.startsWith('/docente')) {
      setCurrentUser(DEMO_PROFILES[2])
    } else if (pathname.startsWith('/auxiliar')) {
      setCurrentUser(DEMO_PROFILES[3])
    } else if (pathname.startsWith('/psicologia')) {
      setCurrentUser(DEMO_PROFILES[4])
    } else if (pathname.startsWith('/padre')) {
      setCurrentUser(DEMO_PROFILES[5])
    } else if (pathname.startsWith('/alumno')) {
      setCurrentUser(DEMO_PROFILES[6])
    }
  }, [pathname])

  const handleSwitchRole = (profile: DemoUser) => {
    document.cookie = `sedes_demo_role=${profile.rol}; path=/; max-age=86400`
    document.cookie = `sedes_demo_user=${encodeURIComponent(JSON.stringify(profile))}; path=/; max-age=86400`
    localStorage.setItem('sedes_active_user', JSON.stringify(profile))
    setCurrentUser(profile)
    setIsOpen(false)
    router.push(profile.defaultRoute)
    router.refresh()
  }

  const roleIcons: Record<UserRole, React.ReactNode> = {
    director: <ShieldCheck className="w-4 h-4 text-purple-600" />,
    administrativo: <UserCheck className="w-4 h-4 text-blue-600" />,
    docente: <GraduationCap className="w-4 h-4 text-emerald-600" />,
    auxiliar: <ClipboardList className="w-4 h-4 text-amber-600" />,
    psicologo: <HeartHandshake className="w-4 h-4 text-rose-600" />,
    padre: <Users className="w-4 h-4 text-cyan-600" />,
    alumno: <BookOpen className="w-4 h-4 text-indigo-600" />,
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container/80 border border-outline-variant/40 text-xs font-semibold text-primary transition-all shadow-sm"
      >
        <Sparkles className="w-3.5 h-3.5 text-secondary shrink-0" />
        <span className="hidden sm:inline text-on-surface-variant font-normal">Rol activo:</span>
        <span className="capitalize font-bold text-primary">{currentUser.rol}</span>
        <ChevronDown className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-84 sm:w-96 bg-white rounded-xl shadow-elevated border border-outline-variant/30 p-2.5 z-50 animate-in fade-in zoom-in-95">
            <div className="px-3 py-2 border-b border-surface-container mb-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-secondary" />
                Selector de los 7 Roles Institucionales
              </p>
              <p className="text-[11px] text-on-surface-variant">
                Haz clic en cualquier rol para cambiar de vista y validar permisos:
              </p>
            </div>

            <div className="space-y-1.5 max-h-[70vh] overflow-y-auto pr-1">
              {DEMO_PROFILES.map((prof) => {
                const isSelected = currentUser.rol === prof.rol
                return (
                  <button
                    key={prof.id}
                    onClick={() => handleSwitchRole(prof)}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-center gap-3 border ${
                      isSelected
                        ? 'bg-primary/10 border-primary/40 text-primary font-medium shadow-sm'
                        : 'hover:bg-surface-container/70 border-transparent text-on-surface'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center shrink-0 border border-outline-variant/30 shadow-sm">
                      {roleIcons[prof.rol]}
                    </div>
                    <div className="overflow-hidden flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-primary truncate">{prof.nombre}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold border ${prof.badgeColor}`}>
                          {prof.rol}
                        </span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant truncate mt-0.5">{prof.cargo}</p>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
