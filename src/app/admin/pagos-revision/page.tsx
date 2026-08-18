'use client'

import React, { useState, useEffect } from 'react'
import {
  QrCode,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  AlertTriangle,
  User,
  MessageSquare,
  Sparkles,
  Check
} from 'lucide-react'
import { dataStore, ComprobantePago, Alumno } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'

export default function AdminPagosRevisionPage() {
  const [comprobantes, setComprobantes] = useState<ComprobantePago[]>([])
  const [selectedComp, setSelectedComp] = useState<ComprobantePago | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [motivoRechazo, setMotivoRechazo] = useState('')
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  useEffect(() => {
    setComprobantes(dataStore.getComprobantes())
  }, [])

  const handleAprobar = (comp: ComprobantePago) => {
    const res = dataStore.resolverComprobante(
      comp.id,
      'aprobar',
      'Lic. Patricia Valenzuela (Secretaría)'
    )
    if (res) {
      setComprobantes(dataStore.getComprobantes())
      setActionSuccess(`✅ Comprobante de ${comp.alumno_nombre} APROBADO. Se habilitó el acceso a notas (RF-054).`)
      setIsViewModalOpen(false)
      setTimeout(() => setActionSuccess(null), 3000)
    }
  }

  const handleOpenRechazo = (comp: ComprobantePago) => {
    setSelectedComp(comp)
    setMotivoRechazo('Monto o número de operación no coincide con estado de cuenta bancario.')
    setIsRejectModalOpen(true)
  }

  const handleConfirmarRechazo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedComp) return

    const res = dataStore.resolverComprobante(
      selectedComp.id,
      'rechazar',
      'Lic. Patricia Valenzuela (Secretaría)',
      motivoRechazo
    )

    if (res) {
      setComprobantes(dataStore.getComprobantes())
      setActionSuccess(`❌ Comprobante RECHAZADO. Se notificó al padre el motivo vía WhatsApp (RF-055).`)
      setIsRejectModalOpen(false)
      setIsViewModalOpen(false)
      setTimeout(() => setActionSuccess(null), 3000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">
              RF-052 a RF-055
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Caja & Tesorería</span>
          </div>
          <h1 className="text-xl font-bold text-primary mt-1">
            Bandeja de Validación de Comprobantes Yape QR
          </h1>
          <p className="text-xs text-on-surface-variant">
            Revise los comprobantes de pago subidos por los apoderados y apruebe para desbloquear notas automáticamente.
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-success-container text-success text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Lista de Comprobantes */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-soft overflow-hidden">
        <div className="p-4 border-b border-surface-container flex items-center justify-between">
          <h3 className="text-xs font-bold text-primary">Comprobantes Recibidos ({comprobantes.length})</h3>
          <span className="text-xs text-on-surface-variant">Yape QR Institucional</span>
        </div>

        <div className="divide-y divide-surface-container">
          {comprobantes.map((comp) => {
            const isPendiente = comp.estado === 'pendiente'
            const isAprobado = comp.estado === 'aprobado'
            const isRechazado = comp.estado === 'rechazado'

            return (
              <div
                key={comp.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-container/20 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-primary">{comp.alumno_nombre}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        isAprobado
                          ? 'bg-emerald-100 text-emerald-800'
                          : isRechazado
                          ? 'bg-error-container text-error'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {comp.estado}
                    </span>
                    <span className="text-xs font-bold text-secondary">• {comp.periodo_concepto}</span>
                  </div>

                  <p className="text-xs text-on-surface-variant">
                    Apoderado: <span className="font-semibold text-primary">{comp.apoderado_nombre}</span> • Op: <span className="font-mono font-bold text-primary">{comp.nro_operacion}</span> • Enviado: {comp.fecha_subida}
                  </p>

                  {comp.motivo_rechazo && (
                    <p className="text-xs text-error font-medium">Motivo de rechazo: {comp.motivo_rechazo}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 justify-between md:justify-end">
                  <div className="text-right">
                    <span className="text-[10px] text-on-surface-variant block uppercase">Monto</span>
                    <span className="text-base font-black text-primary">S/ {comp.monto}.00</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedComp(comp)
                        setIsViewModalOpen(true)
                      }}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      Ver Voucher
                    </Button>

                    {isPendiente && (
                      <>
                        <Button
                          size="sm"
                          variant="primary"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => handleAprobar(comp)}
                          leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                        >
                          Aprobar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-error border-error/30 hover:bg-error-container"
                          onClick={() => handleOpenRechazo(comp)}
                          leftIcon={<XCircle className="w-3.5 h-3.5" />}
                        >
                          Rechazar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal Visor de Voucher */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={`Voucher de Pago — ${selectedComp?.periodo_concepto}`}
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-surface-container/60 space-y-1 text-xs">
            <p><strong className="text-primary">Alumno:</strong> {selectedComp?.alumno_nombre}</p>
            <p><strong className="text-primary">Apoderado:</strong> {selectedComp?.apoderado_nombre}</p>
            <p><strong className="text-primary">Monto declarado:</strong> S/ {selectedComp?.monto}.00</p>
            <p><strong className="text-primary">Nro. de Operación Yape:</strong> {selectedComp?.nro_operacion}</p>
          </div>

          <div className="p-4 rounded-2xl border border-outline-variant/40 bg-surface-container/30 text-center space-y-2">
            <p className="text-[11px] font-bold text-primary">Captura del Comprobante Yape:</p>
            <div className="w-full h-48 rounded-xl bg-surface-container overflow-hidden border border-outline-variant/30 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedComp?.comprobante_url}
                alt="Comprobante Yape"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {selectedComp?.estado === 'pendiente' && (
            <div className="flex gap-2 justify-end pt-2">
              <Button
                variant="outline"
                className="text-error"
                onClick={() => {
                  if (selectedComp) handleOpenRechazo(selectedComp)
                }}
              >
                Rechazar Comprobante
              </Button>
              <Button
                variant="primary"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => {
                  if (selectedComp) handleAprobar(selectedComp)
                }}
              >
                Aprobar y Desbloquear Notas
              </Button>
            </div>
          )}
        </div>
      </Modal>

      {/* Modal Rechazar Voucher con Motivo (RF-055) */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Rechazar Comprobante de Pago"
      >
        <form onSubmit={handleConfirmarRechazo} className="space-y-4">
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
            <p className="font-bold">Aviso importante (RF-055):</p>
            <p className="text-[11px] mt-0.5">
              Al rechazar el comprobante, el estudiante continuará con estado de mora y el motivo será notificado de inmediato al WhatsApp del apoderado.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-primary">
              Motivo del Rechazo
            </label>
            <textarea
              required
              rows={3}
              value={motivoRechazo}
              onChange={(e) => setMotivoRechazo(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface-container/50 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" type="button" onClick={() => setIsRejectModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" className="bg-error text-white">
              Confirmar Rechazo y Notificar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
