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
    { href: '/docente/temario', label: 'Temario del Día', icon: CalendarCheck2 },
    { href: '/docente/tareas', label: 'Tareas & Avisos', icon: CheckSquare },
    { href: '/docente/notas', label: 'Registro de Notas', icon: GraduationCap },
    { href: '/docente/secciones', label: 'Mis 24 Aulas / Secciones', icon: BookOpenCheck },
    { href: '/docente/asistencia', label: 'Asistencia Diaria', icon: Clock },
    { href: '/repositorio', label: 'Biblioteca Digital', icon: BookOpen },
  ]

  const auxiliarLinks = [
    { href: '/auxiliar/asistencia', label: 'Asistencia 24 Aulas', icon: CalendarCheck2 },
    { href: '/auxiliar/conducta', label: 'Méritos & Deméritos', icon: ClipboardList },
    { href: '/auxiliar/reportes', label: 'Reporte de Conducta', icon: FileSpreadsheet },
  ]

  const psicologoLinks = [
    { href: '/psicologia/atenciones', label: 'Fichas Confidenciales', icon: HeartHandshake },
    { href: '/psicologia/seguimiento', label: 'Seguimiento Integral', icon: Users2 },
    { href: '/psicologia/derivaciones', label: 'Pautas & Derivaciones', icon: FileText },
  ]

  const padreLinks = [
    { href: '/padre/dashboard', label: 'Resumen General', icon: LayoutDashboard },
    { href: '/padre/notas', label: 'Notas (Bloqueo x Mora)', icon: GraduationCap },
    { href: '/padre/pagos', label: 'Cronograma & Yape QR', icon: QrCode },
    { href: '/padre/temario', label: 'Temario del Día', icon: CalendarCheck2 },
    { href: '/padre/tareas', label: 'Tareas Escolares', icon: CheckSquare },
    { href: '/padre/conducta', label: 'Reporte Disciplinario', icon: ClipboardList },
    { href: '/padre/fut', label: 'Mesa de Partes FUT', icon: FileText },
    { href: '/padre/comunicados', label: 'Circulares & Avisos', icon: Bell },
  ]

  const alumnoLinks = [
    { href: '/alumno/dashboard', label: 'Mi Panel Escolar', icon: LayoutDashboard },
    { href: '/alumno/tareas', label: 'Mis Tareas Asignadas', icon: CheckSquare },
    { href: '/alumno/temario', label: 'Temario de Hoy', icon: CalendarCheck2 },
    { href: '/alumno/notas', label: 'Mis Calificaciones', icon: GraduationCap },
    { href: '/repositorio', label: 'Libros Escolares', icon: BookOpen },
  ]

  const roleConfig: Record<string, { title: string; links: typeof adminLinks }> = {
    director: { title: 'Dirección General', links: directorLinks },
    administrativo: { title: 'Secretaría / Admin', links: adminLinks },
    docente: { title: 'Portal Docente', links: docenteLinks },
    auxiliar: { title: 'Portal Auxiliar', links: auxiliarLinks },
    psicologo: { title: 'Dpto. Psicología', links: psicologoLinks },
    padre: { title: 'Portal Apoderados', links: padreLinks },
    alumno: { title: 'Portal Estudiante', links: alumnoLinks },
  }

  const currentConfig = roleConfig[role] || roleConfig.docente
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
          'fixed top-0 bottom-0 left-0 z-40 w-64 bg-primary text-white flex flex-col justify-between transition-transform duration-300 ease-in-out border-r border-primary-container lg:translate-x-0 shadow-xl',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Header with Real Official Shield Logo */}
        <div>
          <div className="p-4 border-b border-primary-container/80 flex items-center gap-3 bg-[#0a162e]">
            <div className="w-11 h-11 rounded-xl overflow-hidden border border-white/20 shadow-md shrink-0 bg-white p-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-sedes.jpg"
                alt="Escudo Sedes Sapientiae"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="overflow-hidden">
              <h1 className="text-xs font-black tracking-tight text-white uppercase leading-tight truncate">
                Sedes Sapientiae
              </h1>
              <p className="text-[10px] text-secondary-container font-medium tracking-wide">
                Colegio Diocesano
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 max-h-[calc(100vh-170px)] overflow-y-auto">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-outline flex items-center justify-between">
              <span>{currentConfig.title}</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary-container text-secondary-container capitalize font-bold">
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
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group',
                    isActive
                      ? 'bg-secondary text-white shadow-sm font-bold'
                      : 'text-surface-container/80 hover:bg-primary-container hover:text-white'
                  )}
                >
                  <Icon className={cn('w-4 h-4 transition-transform group-hover:scale-110', isActive ? 'text-white' : 'text-surface-container/60')} />
                  <span className="truncate">{link.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer / Logout */}
        <div className="p-4 border-t border-primary-container/80 bg-[#0a162e]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3.5 py-2 rounded-xl text-xs font-semibold text-error/90 hover:bg-error/10 hover:text-error transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  )
}
