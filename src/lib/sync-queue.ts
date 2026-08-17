import { offlineDb, type SyncQueueItem, type OfflineNota, type OfflineAsistencia } from './offline-db'
import { createClient } from './supabase/client'

export type SyncStatusListener = (status: {
  isOnline: boolean
  pendingCount: number
  isSyncing: boolean
  lastSyncTime: Date | null
}) => void

class SyncManager {
  private isOnline: boolean = typeof window !== 'undefined' ? navigator.onLine : true
  private isSyncing: boolean = false
  private lastSyncTime: Date | null = null
  private listeners: Set<SyncStatusListener> = new Set()

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleOnline())
      window.addEventListener('offline', () => this.handleOffline())
      this.updatePendingCount()
    }
  }

  public subscribe(listener: SyncStatusListener) {
    this.listeners.add(listener)
    this.notify()
    return () => {
      this.listeners.delete(listener)
    }
  }

  private async notify() {
    const pendingCount = typeof window !== 'undefined' ? await offlineDb.sync_queue.count() : 0
    this.listeners.forEach((listener) => {
      listener({
        isOnline: this.isOnline,
        pendingCount,
        isSyncing: this.isSyncing,
        lastSyncTime: this.lastSyncTime,
      })
    })
  }

  private handleOnline() {
    this.isOnline = true
    this.notify()
    this.processQueue()
  }

  private handleOffline() {
    this.isOnline = false
    this.notify()
  }

  public async updatePendingCount() {
    await this.notify()
  }

  // Guardar nota con soporte Offline-First
  public async guardarNota(nota: {
    id?: string
    alumno_id: string
    seccion_curso_id: string
    competencia: string
    calificacion: string
    periodo: string
    conclusiones_descriptivas?: string
  }) {
    const local_id = nota.id || `local_nota_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const isActuallyOnline = typeof navigator !== 'undefined' && navigator.onLine

    const offlineItem: OfflineNota = {
      ...nota,
      local_id,
      sync_status: isActuallyOnline ? 'synced' : 'pending',
      timestamp: Date.now(),
    }

    await offlineDb.notas.put(offlineItem)

    if (!isActuallyOnline) {
      await offlineDb.sync_queue.add({
        tipo: 'nota',
        operacion: 'insert',
        datos: offlineItem,
        intentos: 0,
        creado_en: Date.now(),
      })
      await this.notify()
      return { success: true, offline: true, item: offlineItem }
    }

    // Intentar sincronizar con Supabase
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from('notas').upsert({
        alumno_id: nota.alumno_id,
        seccion_curso_id: nota.seccion_curso_id,
        competencia: nota.competencia,
        calificacion: nota.calificacion,
        periodo: nota.periodo,
        conclusiones_descriptivas: nota.conclusiones_descriptivas,
        sync_status: 'synced',
      }).select().single()

      if (error) {
        // Encolar si falla por red
        console.warn('Error al guardar en Supabase, guardando en cola offline:', error.message)
        await offlineDb.sync_queue.add({
          tipo: 'nota',
          operacion: 'insert',
          datos: offlineItem,
          intentos: 1,
          creado_en: Date.now(),
          ultimo_error: error.message,
        })
        offlineItem.sync_status = 'pending'
        await offlineDb.notas.put(offlineItem)
        await this.notify()
        return { success: true, offline: true, item: offlineItem }
      }

      offlineItem.sync_status = 'synced'
      if (data?.id) offlineItem.id = data.id
      await offlineDb.notas.put(offlineItem)
      this.lastSyncTime = new Date()
      await this.notify()
      return { success: true, offline: false, item: data || offlineItem }
    } catch (err: any) {
      await offlineDb.sync_queue.add({
        tipo: 'nota',
        operacion: 'insert',
        datos: offlineItem,
        intentos: 1,
        creado_en: Date.now(),
        ultimo_error: err?.message,
      })
      offlineItem.sync_status = 'pending'
      await offlineDb.notas.put(offlineItem)
      await this.notify()
      return { success: true, offline: true, item: offlineItem }
    }
  }

  // Guardar asistencia con soporte Offline-First
  public async guardarAsistencia(asistencia: {
    id?: string
    alumno_id: string
    seccion_curso_id: string
    fecha: string
    estado: 'presente' | 'tardanza' | 'falta' | 'justificado'
    justificacion?: string
  }) {
    const local_id = asistencia.id || `local_asist_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const isActuallyOnline = typeof navigator !== 'undefined' && navigator.onLine

    const offlineItem: OfflineAsistencia = {
      ...asistencia,
      local_id,
      sync_status: isActuallyOnline ? 'synced' : 'pending',
      timestamp: Date.now(),
    }

    await offlineDb.asistencias.put(offlineItem)

    if (!isActuallyOnline) {
      await offlineDb.sync_queue.add({
        tipo: 'asistencia',
        operacion: 'insert',
        datos: offlineItem,
        intentos: 0,
        creado_en: Date.now(),
      })
      await this.notify()
      return { success: true, offline: true, item: offlineItem }
    }

    try {
      const supabase = createClient()
      const { data, error } = await supabase.from('asistencias').upsert({
        alumno_id: asistencia.alumno_id,
        seccion_curso_id: asistencia.seccion_curso_id,
        fecha: asistencia.fecha,
        estado: asistencia.estado,
        justificacion: asistencia.justificacion,
        sync_status: 'synced',
      }).select().single()

      if (error) {
        await offlineDb.sync_queue.add({
          tipo: 'asistencia',
          operacion: 'insert',
          datos: offlineItem,
          intentos: 1,
          creado_en: Date.now(),
          ultimo_error: error.message,
        })
        offlineItem.sync_status = 'pending'
        await offlineDb.asistencias.put(offlineItem)
        await this.notify()
        return { success: true, offline: true, item: offlineItem }
      }

      offlineItem.sync_status = 'synced'
      if (data?.id) offlineItem.id = data.id
      await offlineDb.asistencias.put(offlineItem)
      this.lastSyncTime = new Date()
      await this.notify()
      return { success: true, offline: false, item: data || offlineItem }
    } catch (err: any) {
      await offlineDb.sync_queue.add({
        tipo: 'asistencia',
        operacion: 'insert',
        datos: offlineItem,
        intentos: 1,
        creado_en: Date.now(),
        ultimo_error: err?.message,
      })
      offlineItem.sync_status = 'pending'
      await offlineDb.asistencias.put(offlineItem)
      await this.notify()
      return { success: true, offline: true, item: offlineItem }
    }
  }

  // Drenar y sincronizar cola pendiente
  public async processQueue() {
    if (this.isSyncing) return
    this.isSyncing = true
    this.notify()

    try {
      const items = await offlineDb.sync_queue.toArray()
      const supabase = createClient()

      for (const item of items) {
        if (!item.id) continue

        try {
          if (item.tipo === 'nota') {
            const { error } = await supabase.from('notas').upsert({
              alumno_id: item.datos.alumno_id,
              seccion_curso_id: item.datos.seccion_curso_id,
              competencia: item.datos.competencia,
              calificacion: item.datos.calificacion,
              periodo: item.datos.periodo,
              sync_status: 'synced',
            })
            if (error) throw error

            await offlineDb.notas.update(item.datos.local_id, { sync_status: 'synced' })
            await offlineDb.sync_queue.delete(item.id)
          } else if (item.tipo === 'asistencia') {
            const { error } = await supabase.from('asistencias').upsert({
              alumno_id: item.datos.alumno_id,
              seccion_curso_id: item.datos.seccion_curso_id,
              fecha: item.datos.fecha,
              estado: item.datos.estado,
              sync_status: 'synced',
            })
            if (error) throw error

            await offlineDb.asistencias.update(item.datos.local_id, { sync_status: 'synced' })
            await offlineDb.sync_queue.delete(item.id)
          }
        } catch (err: any) {
          console.error('Error al sincronizar elemento de cola:', err)
          await offlineDb.sync_queue.update(item.id, {
            intentos: item.intentos + 1,
            ultimo_error: err?.message || 'Error de conexión',
          })
        }
      }

      this.lastSyncTime = new Date()
    } finally {
      this.isSyncing = false
      this.notify()
    }
  }
}

export const syncManager = new SyncManager()
