'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { StatsCard } from '@/components/ui/stats-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { AlertTriangle, MessageSquare, CreditCard, CheckCircle2, Phone, Search, Send, Clock } from 'lucide-react'
import { dataStore, type Pago, type Alumno } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function AdminMorosidadPage() {
  const [pagos, setPagos] = useState<Pago[]>([])
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false)
  const [selectedPagoForMsg, setSelectedPagoForMsg] = useState<Pago | null>(null)
  const [customMsg, setCustomMsg] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [successToast, setSuccessToast] = useState<string | null>(null)

  const loadData = () => {
    setPagos(dataStore.getPagos())
    setAlumnos(dataStore.getAlumnos())
  }

  useEffect(() => {
    loadData()
  }, [])

  const morosos = pagos.filter(p => p.estado === 'vencido' || p.estado === 'pendiente')

  const handleOpenWhatsapp = (pago: Pago) => {
    const alu = alumnos.find(a => a.id === pago.alumno_id)
    setSelectedPagoForMsg(pago)
    setCustomMsg(
      `Estimado apoderado de *${pago.alumno_nombre}*: Le recordamos que el concepto *${pago.concepto}* por un monto de *S/ ${pago.monto + pago.mora}* se encuentra pendiente. Agradeceremos regularizar el abono en tesorería o vía plataforma digital.`
    )
    setIsWhatsappModalOpen(true)
  }

  const handleSendWhatsapp = () => {
    setIsSending(true)
    setTimeout(() => {
      setIsSending(false)
      setIsWhatsappModalOpen(false)
      setSuccessToast(`¡Recordatorio de WhatsApp enviado al apoderado de ${selectedPagoForMsg?.alumno_nombre}!`)
      setTimeout(() => setSuccessToast(null), 3000)
    }, 800)
  }

  const handleMarkAsPaid = (pagoId: string) => {
    dataStore.updatePago(pagoId, {
      estado: 'pagado',
      fecha_pago: new Date().toISOString(),
      metodo_pago: 'efectivo',
      culqi_charge_id: `TES-${Date.now()}`,
    })
    loadData()
    setSuccessToast('Pago regularizado y registrado en caja escolar')
    setTimeout(() => setSuccessToast(null), 2500)
  }

  const totalVencido = morosos.filter(p => p.estado === 'vencido').reduce((acc, p) => acc + p.monto + p.mora, 0)
  const totalPendiente = morosos.reduce((acc, p) => acc + p.monto + p.mora, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-primary tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            <span>Control de Morosidad y Cobranzas</span>
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Seguimiento de mensualidades vencidas y recordatorios por WhatsApp Business API
          </p>
        </div>

        {successToast && (
          <div className="px-3.5 py-1.5 rounded-xl bg-success-container text-success border border-success/30 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Monto Vencido Crítico"
          value={formatCurrency(totalVencido)}
          subtitle="Pensiones fuera de plazo límite"
          variant="warning"
          icon={<AlertTriangle className="w-6 h-6" />}
        />

        <StatsCard
          title="Total por Recaudar"
          value={formatCurrency(totalPendiente)}
          subtitle="Incluye cuotas del mes corriente"
          variant="primary"
          icon={<CreditCard className="w-6 h-6" />}
        />

        <StatsCard
          title="Casos Morosos"
          value={`${morosos.filter(p => p.estado === 'vencido').length} Apoderados`}
          subtitle="Requieren notificación preventiva"
          variant="info"
          icon={<Clock className="w-6 h-6" />}
        />
      </div>

      {/* Debtors Table */}
      <Card>
        <CardHeader className="bg-surface flex flex-row items-center justify-between">
          <CardTitle className="text-base">Listado de Pensiones Pendientes de Pago</CardTitle>
          <span className="text-xs font-semibold text-primary">Marzo 2026</span>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-surface-container/60 border-b border-surface-container text-on-surface-variant font-semibold text-[11px] uppercase tracking-wider">
                <th className="p-4">Estudiante / Aula</th>
                <th className="p-4">Concepto</th>
                <th className="p-4">Monto + Mora</th>
                <th className="p-4">Fecha Vencimiento</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones de Cobranza</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {morosos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-on-surface-variant">
                    ¡Excelente! No hay pensiones pendientes registradas en este momento.
                  </td>
                </tr>
              ) : (
                morosos.map((pago) => {
                  const alu = alumnos.find(a => a.id === pago.alumno_id)
                  const isVencido = pago.estado === 'vencido'

                  return (
                    <tr key={pago.id} className="hover:bg-surface-container/20 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-primary">{pago.alumno_nombre}</p>
                        <p className="text-xs text-on-surface-variant">{alu?.seccion_nombre || '3ro A Primaria'}</p>
                      </td>
                      <td className="p-4 font-medium text-on-surface">{pago.concepto}</td>
                      <td className="p-4 font-mono font-bold text-primary">
                        {formatCurrency(pago.monto + pago.mora)}
                        {pago.mora > 0 && <span className="text-[10px] text-error block">+ {formatCurrency(pago.mora)} mora</span>}
                      </td>
                      <td className="p-4 text-on-surface-variant">{formatDate(pago.fecha_vencimiento)}</td>
                      <td className="p-4">
                        <Badge variant={isVencido ? 'error' : 'warning'} size="md" dot>
                          {pago.estado.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleOpenWhatsapp(pago)}
                            leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                          >
                            WhatsApp
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAsPaid(pago.id)}
                            leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-success" />}
                          >
                            Cobrar en Caja
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Modal: WhatsApp Reminder */}
      <Modal
        isOpen={isWhatsappModalOpen}
        onClose={() => setIsWhatsappModalOpen(false)}
        title="Enviar Recordatorio por WhatsApp Business API"
        description="Notificación directa al teléfono del apoderado"
      >
        <div className="space-y-4">
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              Destinatario: Apoderado de {selectedPagoForMsg?.alumno_nombre} (Tel: 987 112 233)
            </p>
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-primary uppercase tracking-wider">
              Mensaje a Enviar
            </label>
            <textarea
              rows={4}
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              className="w-full bg-white border border-outline-variant/60 rounded-lg p-3 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/30">
            <Button type="button" variant="outline" onClick={() => setIsWhatsappModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
              isLoading={isSending}
              onClick={handleSendWhatsapp}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Enviar Notificación
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
