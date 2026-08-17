'use client'

import React from 'react'
import { Menu, Bell } from 'lucide-react'
import { SyncBadge } from './sync-badge'
import { RoleSwitcherBanner, DEMO_PROFILES } from './role-switcher-banner'
import { dataStore, type Alumno } from '@/lib/mock-data'

interface NavbarProps {
  onOpenSidebar: () => void
  selectedChildId?: string
  onSelectChild?: (childId: string) => void
  isPadre?: boolean
}

export function Navbar({ onOpenSidebar, selectedChildId, onSelectChild, isPadre = false }: NavbarProps) {
  const [children, setChildren] = React.useState<Alumno[]>([])

  React.useEffect(() => {
    if (isPadre) {
      const all = dataStore.getAlumnos()
      // Hijos del apoderado por defecto (Joaquín y Valeria)
      const misHijos = all.filter(a => a.apoderado_id === 'usr-pad-1')
      setChildren(misHijos)
    }
  }, [isPadre])

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-outline-variant/30 px-4 sm:px-6 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Left side: Hamburger & Child Selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSidebar}
            className="p-2 rounded-lg text-primary hover:bg-surface-container lg:hidden transition-colors"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          {isPadre && children.length > 0 && (
            <div className="flex items-center gap-2 bg-surface-container/70 px-3 py-1.5 rounded-xl border border-outline-variant/30">
              <span className="text-xs font-medium text-on-surface-variant hidden md:inline">
                Estudiante activo:
              </span>
              <select
                value={selectedChildId || children[0]?.id}
                onChange={(e) => onSelectChild && onSelectChild(e.target.value)}
                className="bg-transparent text-xs sm:text-sm font-bold text-primary focus:outline-none cursor-pointer"
              >
                {children.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.nombres} ({child.seccion_nombre || 'Primaria'})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Right side: Sync Badge, Role Switcher, Notifications, User */}
        <div className="flex items-center gap-3">
          <SyncBadge />
          <RoleSwitcherBanner />

          <button
            className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors relative"
            title="Notificaciones"
          >
            <Bell className="w-4 h-4 text-primary" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
          </button>
        </div>
      </div>
    </header>
  )
}
