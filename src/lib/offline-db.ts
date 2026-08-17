import Dexie, { type Table } from 'dexie'

export interface OfflineNota {
  id?: string
  local_id: string
  alumno_id: string
  seccion_curso_id: string
  competencia: string
  calificacion: string
  periodo: string
  conclusiones_descriptivas?: string
  sync_status: 'synced' | 'pending' | 'conflict'
  timestamp: number
}

export interface OfflineAsistencia {
  id?: string
  local_id: string
  alumno_id: string
  seccion_curso_id: string
  fecha: string
  estado: 'presente' | 'tardanza' | 'falta' | 'justificado'
  justificacion?: string
  sync_status: 'synced' | 'pending' | 'conflict'
  timestamp: number
}

export interface SyncQueueItem {
  id?: number
  tipo: 'nota' | 'asistencia' | 'matricula' | 'pago'
  operacion: 'insert' | 'update' | 'delete'
  datos: any
  intentos: number
  creado_en: number
  ultimo_error?: string
}

export class SedesOfflineDatabase extends Dexie {
  notas!: Table<OfflineNota, string>
  asistencias!: Table<OfflineAsistencia, string>
  sync_queue!: Table<SyncQueueItem, number>

  constructor() {
    super('SedesSapientiaeOfflineDB')
    this.version(1).stores({
      notas: 'local_id, alumno_id, seccion_curso_id, periodo, sync_status, timestamp',
      asistencias: 'local_id, [alumno_id+fecha+seccion_curso_id], fecha, sync_status, timestamp',
      sync_queue: '++id, tipo, operacion, intentos, creado_en',
    })
  }
}

export const offlineDb = new SedesOfflineDatabase()
