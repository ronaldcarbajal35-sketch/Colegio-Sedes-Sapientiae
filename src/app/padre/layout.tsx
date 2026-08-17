'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/shared/sidebar'
import { Navbar } from '@/components/shared/navbar'

export default function PadreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedChildId, setSelectedChildId] = useState<string>('alu-1')

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Sidebar
        role="padre"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:pl-64 flex flex-col flex-1">
        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          selectedChildId={selectedChildId}
          onSelectChild={(id) => {
            setSelectedChildId(id)
            if (typeof window !== 'undefined') {
              localStorage.setItem('sedes_selected_child', id)
              window.dispatchEvent(new Event('child_changed'))
            }
          }}
          isPadre={true}
        />

        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
