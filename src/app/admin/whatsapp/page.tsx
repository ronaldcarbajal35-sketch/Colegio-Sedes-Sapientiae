'use client'

import React, { useState, useEffect } from 'react'
import {
  MessageSquare,
  Send,
  CheckCheck,
  Clock,
  Phone,
  Filter,
  Sparkles,
  Check
} from 'lucide-react'
import { dataStore, NotificacionWhatsApp } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AdminWhatsAppPage() {
  const [logs, setLogs] = useState<NotificacionWhatsApp[]>([])
  const [telefono, setTelefono] = useState('+51 987 112 233')
  const [mensaje, setMensaje] = useState('')
  const [destinatario, setDestinatario] = useState('Ing. Roberto Quispe')
  const [sentSuccess, setSentSuccess] = useState(false)

  useEffect(() => {
    setLogs(dataStore.getWhatsAppLogs())
  }, [])

  const handleEnviarDirecto = (e: React.FormEvent) => {
    e.preventDefault()
    if (!mensaje) return

    dataStore.addWhatsAppLog({
      destinatario_nombre: destinatario,
      telefono,
      tipo_evento: 'comunicado_general',
      mensaje: `📢 Colegio Sede Sapiens: ${mensaje}`,
      estado: 'enviado',
    })

    setLogs(dataStore.getWhatsAppLogs())
    setMensaje('')
    setSentSuccess(true)
    setTimeout(() => setSentSuccess(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
              RF-100 a RF-102
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Meta WhatsApp Cloud API</span>
          </div>
          <h1 className="text-xl font-bold text-primary mt-1">
            Centro de Notificaciones WhatsApp a Padres
          </h1>
          <p className="text-xs text-on-surface-variant">
            Historial de mensajes automáticos enviados por notas, inasistencias, conducta, tareas y validación de pagos.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario Envío Directo */}
        <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft space-y-4">
          <div className="flex items-center gap-2 border-b border-surface-container pb-3">
            <Send className="w-4 h-4 text-emerald-600" />
            <h2 className="text-sm font-bold text-primary">Enviar Mensaje Directo</h2>
          </div>

          <form onSubmit={handleEnviarDirecto} className="space-y-3">
            <Input
              label="Nombre del Apoderado"
              type="text"
              required
              value={destinatario}
              onChange={(e) => setDestinatario(e.target.value)}
            />

            <Input
              label="Número de Teléfono (WhatsApp)"
              type="text"
              required
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              leftIcon={<Phone className="w-3.5 h-3.5" />}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-primary">
                Texto del Mensaje
              </label>
              <textarea
                required
                rows={4}
                placeholder="Escriba el aviso o comunicado institucional..."
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface-container/50 text-xs text-primary focus:ring-2 focus:ring-primary"
              />
            </div>

            {sentSuccess && (
              <div className="p-3 rounded-xl bg-success-container text-success text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Mensaje enviado correctamente vía WhatsApp API.</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              leftIcon={<Send className="w-4 h-4" />}
            >
              Enviar a WhatsApp
            </Button>
          </form>
        </div>

        {/* Log de Mensajes Enviados (RF-102) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-outline-variant/30 shadow-soft overflow-hidden flex flex-col">
          <div className="p-4 border-b border-surface-container flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold text-primary">Historial de Notificaciones (RF-102)</h2>
            </div>
            <span className="text-xs text-on-surface-variant">{logs.length} Notificaciones registradas</span>
          </div>

          <div className="divide-y divide-surface-container p-4 space-y-3 overflow-y-auto max-h-[500px]">
            {logs.map((log) => (
              <div key={log.id} className="p-4 rounded-xl bg-surface-container/40 border border-outline-variant/20 space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-primary">{log.destinatario_nombre}</span>
                    <span className="text-[11px] text-on-surface-variant font-mono">{log.telefono}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-bold">
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>{log.estado.toUpperCase()} • {log.fecha_hora}</span>
                  </div>
                </div>

                <p className="text-xs text-on-surface bg-white p-3 rounded-lg border border-outline-variant/20 font-mono">
                  {log.mensaje}
                </p>

                <span className="text-[10px] uppercase font-bold text-secondary tracking-wider block">
                  Evento: {log.tipo_evento.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
