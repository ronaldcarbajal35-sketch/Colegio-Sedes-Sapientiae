'use client'

import React, { useEffect, useState } from 'react'
import { syncManager } from '@/lib/sync-queue'
import { Wifi, WifiOff, RefreshCw } from 'lucide-react'

export function SyncBadge() {
  const [status, setStatus] = useState({
    isOnline: true,
    pendingCount: 0,
    isSyncing: false,
    lastSyncTime: null as Date | null,
  })

  useEffect(() => {
    const unsubscribe = syncManager.subscribe(setStatus)
    return () => unsubscribe()
  }, [])

  const handleManualSync = async () => {
    await syncManager.processQueue()
  }

  if (status.isOnline && status.pendingCount === 0) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <Wifi className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">En Línea</span>
      </div>
    )
  }

  if (!status.isOnline) {
    return (
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-300 text-xs font-semibold animate-pulse">
        <WifiOff className="w-3.5 h-3.5" />
        <span>Modo Offline ({status.pendingCount} pendientes)</span>
      </div>
    )
  }

  return (
    <button
      onClick={handleManualSync}
      disabled={status.isSyncing}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium hover:bg-blue-100 transition-colors"
      title="Haga clic para sincronizar cambios pendientes con Supabase"
    >
      <RefreshCw className={`w-3.5 h-3.5 ${status.isSyncing ? 'animate-spin text-blue-600' : ''}`} />
      <span>{status.isSyncing ? 'Sincronizando...' : `Sincronizar (${status.pendingCount})`}</span>
    </button>
  )
}
