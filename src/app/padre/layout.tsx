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
  const [selectedChildId, setSelectedChildId] = useState('alu-1')

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar
        role="padre"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <Navbar
          onOpenSidebar={() => setSidebarOpen(true)}
          selectedChildId={selectedChildId}
          onSelectChild={(id) => setSelectedChildId(id)}
          isPadre={true}
        />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          {children}
        </main>
      </div>
    </div>
  )
}
