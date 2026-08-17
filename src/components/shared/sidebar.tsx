'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  GraduationCap,
  CalendarCheck2,
  CreditCard,
  Bell,
  BookOpenCheck,
  Users2,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  School,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  role: 'padre' | 'docente' | 'admin' | 'direccion' | 'secretaria'
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  const padreLinks = [
    { href: '/padre/dashboard', label: 'Inicio', icon: LayoutDashboard },
    { href: '/padre/notas', label: 'Libreta de Notas', icon: GraduationCap },
    { href: '/padre/asistencia', label: 'Asistencia Escolar', icon: CalendarCheck2 },
    { href: '/padre/pagos', label: 'Pagos y Pensiones', icon: CreditCard },
    { href: '/padre/comunicados', label: 'Comunicados y Avisos', icon: Bell },
  ]

  const docenteLinks = [
    { href: '/docente/secciones', label: 'Mis Secciones y Cursos', icon: Layers },
    { href: '/docente/notas', label: 'Registro de Calificaciones', icon: BookOpenCheck },
    { href: '/docente/asistencia', label: 'Toma de Asistencia', icon: CalendarCheck2 },
  ]

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Panel Directivo', icon: LayoutDashboard },
    { href: '/admin/matricula', label: 'Matrícula & Postulantes', icon: School },
    { href: '/admin/morosidad', label: 'Control de Morosidad', icon: AlertTriangle },
    { href: '/admin/usuarios', label: 'Gestión de Usuarios', icon: Users2 },
    { href: '/admin/comunicados', label: 'Emisión de Comunicados', icon: Bell },
    { href: '/admin/exportar-siagie', label: 'Exportación SIAGIE', icon: FileSpreadsheet },
  ]

  const links = role === 'padre' ? padreLinks : role === 'docente' ? docenteLinks : adminLinks

  const handleLogout = () => {
    document.cookie = 'sedes_demo_role=; path=/; max-age=0'
    document.cookie = 'sedes_demo_user=; path=/; max-age=0'
    localStorage.removeItem('sedes_active_user')
    window.location.href = '/login'
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-primary/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 w-64 bg-primary text-white flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-primary-container lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header */}
        <div>
          <div className="p-5 border-b border-primary-container flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-white shadow-md">
              <School className="w-6 h-6" />
            </div>
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold tracking-tight text-white uppercase leading-tight">
                Sedes Sapientiae
              </h1>
              <p className="text-[11px] text-secondary-container font-medium tracking-wide">
                Sistema Escolar
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-outline">
              {role === 'padre' ? 'Portal de Apoderados' : role === 'docente' ? 'Portal Docente' : 'Gestión Administrativa'}
            </div>
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href || (link.href !== '/admin/dashboard' && link.href !== '/padre/dashboard' && pathname.startsWith(link.href))

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-smooth group',
                    isActive
                      ? 'bg-secondary text-white shadow font-semibold'
                      : 'text-surface-container/80 hover:bg-primary-container hover:text-white'
                  )}
                >
                  <Icon className={cn('w-4 h-4 transition-transform group-hover:scale-110', isActive ? 'text-white' : 'text-outline')} />
                  <span className="truncate">{link.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-primary-container bg-primary-container/40">
          <div className="flex items-center justify-between text-xs text-outline mb-3">
            <span>Año Escolar</span>
            <span className="font-bold text-secondary-container">2026</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary-container/80 hover:bg-error text-surface-container hover:text-white text-xs font-semibold transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  )
}
