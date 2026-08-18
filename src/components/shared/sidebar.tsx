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
  FileText,
  CheckSquare,
  QrCode,
  HeartHandshake,
  BookOpen,
  ClipboardList,
  MessageSquare,
  Clock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { UserRole } from '@/lib/mock-data'

interface SidebarProps {
  role: UserRole | string
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ role, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  const directorLinks = [
    { href: '/director/dashboard', label: 'Supervisión 24 Aulas', icon: LayoutDashboard },
    { href: '/director/fut', label: 'Derivación de FUTs', icon: FileText },
    { href: '/admin/morosidad', label: 'Control Financiero', icon: AlertTriangle },
    { href: '/admin/usuarios', label: 'Directorio de Personal', icon: Users2 },
    { href: '/director/reportes', label: 'Reportes Institucionales', icon: FileSpreadsheet },
  ]

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Panel Administrativo', icon: LayoutDashboard },
    { href: '/admin/fut', label: 'Mesa de Trámites FUT', icon: FileText },
    { href: '/admin/pagos-revision', label: 'Validar Pagos Yape QR', icon: QrCode },
    { href: '/admin/morosidad', label: 'Control de Morosidad', icon: AlertTriangle },
    { href: '/admin/matricula', label: 'Matrícula & Alumnos', icon: School },
    { href: '/admin/asistencia-personal', label: 'Asistencia Personal', icon: Clock },
    { href: '/admin/whatsapp', label: 'Centro Notif. WhatsApp', icon: MessageSquare },
    { href: '/admin/comunicados', label: 'Comunicados Oficiales', icon: Bell },
    { href: '/admin/exportar-siagie', label: 'Exportación SIAGIE', icon: FileSpreadsheet },
  ]

  const docenteLinks = [
    { href: '/docente/secciones', label: 'Mis Cursos y Aulas', icon: Layers },
    { href: '/docente/temario', label: 'Temario del Día', icon: CalendarCheck2 },
    { href: '/docente/tareas', label: 'Tareas y Avisos', icon: CheckSquare },
    { href: '/docente/notas', label: 'Registro de Notas', icon: BookOpenCheck },
    { href: '/docente/asistencia', label: 'Toma de Asistencia', icon: CalendarCheck2 },
    { href: '/repositorio', label: 'Repositorio de Libros', icon: BookOpen },
  ]

  const auxiliarLinks = [
    { href: '/auxiliar/asistencia', label: 'Asistencia 24 Aulas', icon: CalendarCheck2 },
    { href: '/auxiliar/conducta', label: 'Conducta e Incidencias', icon: ClipboardList },
    { href: '/auxiliar/reportes', label: 'Reportes de Asistencia', icon: FileSpreadsheet },
  ]

  const psicologoLinks = [
    { href: '/psicologia/atenciones', label: 'Fichas de Entrevistas', icon: HeartHandshake },
    { href: '/psicologia/seguimiento', label: 'Seguimiento Integral', icon: Users2 },
    { href: '/psicologia/derivaciones', label: 'Derivaciones y Pautas', icon: FileText },
  ]

  const padreLinks = [
    { href: '/padre/dashboard', label: 'Panel del Apoderado', icon: LayoutDashboard },
    { href: '/padre/notas', label: 'Libreta de Notas', icon: GraduationCap },
    { href: '/padre/pagos', label: 'Pagos & Yape QR', icon: CreditCard },
    { href: '/padre/asistencia', label: 'Control de Asistencia', icon: CalendarCheck2 },
    { href: '/padre/conducta', label: 'Reporte de Conducta', icon: ClipboardList },
    { href: '/padre/tareas', label: 'Tareas y Avisos', icon: CheckSquare },
    { href: '/padre/temario', label: 'Temario Dictado en Clase', icon: BookOpenCheck },
    { href: '/padre/fut', label: 'Nuevo Trámite FUT', icon: FileText },
    { href: '/repositorio', label: 'Libros y Material', icon: BookOpen },
  ]

  const alumnoLinks = [
    { href: '/alumno/dashboard', label: 'Mi Portal Escolar', icon: LayoutDashboard },
    { href: '/alumno/tareas', label: 'Mis Tareas Pendientes', icon: CheckSquare },
    { href: '/alumno/temario', label: 'Temario del Día', icon: CalendarCheck2 },
    { href: '/repositorio', label: 'Biblioteca Digital', icon: BookOpen },
    { href: '/alumno/notas', label: 'Mis Calificaciones', icon: GraduationCap },
  ]

  const roleMap: Record<string, { title: string; links: typeof padreLinks }> = {
    director: { title: 'Portal de Dirección', links: directorLinks },
    administrativo: { title: 'Gestión Administrativa', links: adminLinks },
    secretaria: { title: 'Gestión Administrativa', links: adminLinks },
    admin: { title: 'Gestión Administrativa', links: adminLinks },
    docente: { title: 'Portal Docente', links: docenteLinks },
    auxiliar: { title: 'Portal Auxiliar', links: auxiliarLinks },
    psicologo: { title: 'Dpto. Psicología', links: psicologoLinks },
    padre: { title: 'Portal de Apoderados', links: padreLinks },
    alumno: { title: 'Portal del Estudiante', links: alumnoLinks },
  }

  const currentConfig = roleMap[role] || roleMap.padre
  const links = currentConfig.links

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
          <div className="p-4 border-b border-primary-container flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-white shadow-md shrink-0">
              <School className="w-6 h-6" />
            </div>
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold tracking-tight text-white uppercase leading-tight truncate">
                Sede Sapiens
              </h1>
              <p className="text-[11px] text-secondary-container font-medium tracking-wide">
                Intranet 2026
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 max-h-[calc(100vh-170px)] overflow-y-auto">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-outline flex items-center justify-between">
              <span>{currentConfig.title}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary-container text-secondary-container capitalize">
                {role}
              </span>
            </div>
            {links.map((link) => {
              const Icon = link.icon
              const isActive = pathname === link.href

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-smooth group',
                    isActive
                      ? 'bg-secondary text-white shadow font-semibold'
                      : 'text-surface-container/80 hover:bg-primary-container hover:text-white'
                  )}
                >
                  <Icon className={cn('w-4 h-4 shrink-0 transition-transform group-hover:scale-110', isActive ? 'text-white' : 'text-outline')} />
                  <span className="truncate">{link.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-3 border-t border-primary-container bg-primary-container/40">
          <div className="flex items-center justify-between text-xs text-outline mb-2 px-1">
            <span>24 Aulas Activas</span>
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
