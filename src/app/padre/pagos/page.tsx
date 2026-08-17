'use client'

import React, { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { StatsCard } from '@/components/ui/stats-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { CreditCard, CheckCircle2, AlertCircle, Clock, Receipt, UploadCloud, ShieldCheck, Download } from 'lucide-react'
import { dataStore, type Alumno, type Pago } from '@/lib/mock-data'
import { openCulqiCheckout } from '@/lib/culqi'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function PadrePagosPage() {
  const [currentChild, setCurrentChild] = useState<Alumno | null>(null)
  const [pagos, setPagos] = useState<Pago[]>([])
  const [activePagoForModal, setActivePagoForModal] = useState<Pago | null>(null)
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false)
  const [isManualModalOpen, setIsManualModalOpen] = useState(false)
  const [manualCode, setManualCode] = useState('')
  const [manualMethod, setManualMethod] = useState<'yape_manual' | 'plin_manual' | 'efectivo'>('yape_manual')
  const [isProcessing, setIsProcessing] = useState(false)

  const loadData = () => {
    const allAlu = dataStore.getAlumnos()
    const storedChildId = typeof window !== 'undefined' ? localStorage.getItem('sedes_selected_child') : null
    const child = allAlu.find(a => a.id === storedChildId) || allAlu.find(a => a.apoderado_id === 'usr-pad-1') || allAlu[0]
    setCurrentChild(child)

    if (child) {
      const studentPagos = dataStore.getPagos().filter(p => p.alumno_id === child.id)
      setPagos(studentPagos)
    }
  }

  useEffect(() => {
    loadData()
    const handleChildChange = () => loadData()
    window.addEventListener('child_changed', handleChildChange)
    return () => window.removeEventListener('child_changed', handleChildChange)
  }, [])

  const handlePayCulqi = (pago: Pago) => {
    openCulqiCheckout({
      title: 'Colegio Sedes Sapientiae',
      currency: 'PEN',
      amount: pago.monto + pago.mora,
      description: `${pago.concepto} - ${currentChild?.nombres} ${currentChild?.apellidos}`,
      pagoId: pago.id,
      alumnoNombre: `${currentChild?.nombres} ${currentChild?.apellidos}`,
      onSuccess: (token: any) => {
        dataStore.updatePago(pago.id, {
          estado: 'pagado',
          fecha_pago: new Date().toISOString(),
          metodo_pago: 'culqi',
          culqi_charge_id: token.id || `chr_${Date.now()}`,
        })
        loadData()
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
      },
      onError: (err: any) => {
        alert(`Error al procesar pago: ${err?.user_message || 'Intente nuevamente'}`)
      }
    })
  }

  const handleManualPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activePagoForModal) return
    setIsProcessing(true)

    setTimeout(() => {
      dataStore.updatePago(activePagoForModal.id, {
        estado: 'pagado',
        fecha_pago: new Date().toISOString(),
        metodo_pago: manualMethod,
        culqi_charge_id: `OPE-${manualCode || Math.floor(100000 + Math.random() * 900000)}`,
      })
      setIsProcessing(false)
      setIsManualModalOpen(false)
      loadData()
      confetti({ particleCount: 80, spread: 60 })
    }, 700)
  }

  const totalPagado = pagos.filter(p => p.estado === 'pagado').reduce((acc, p) => acc + p.monto, 0)
  const totalPendiente = pagos.filter(p => p.estado === 'pendiente' || p.estado === 'vencido').reduce((acc, p) => acc + p.monto + p.mora, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-primary tracking-tight">
          Estado de Pagos y Pensiones Escolares
        </h2>
        <p className="text-xs sm:text-sm text-on-surface-variant">
          Pasarela segura Culqi y reporte de pagos para <strong>{currentChild?.nombres} {currentChild?.apellidos}</strong>
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Total Pagado (2026)"
          value={formatCurrency(totalPagado)}
          subtitle="Comprobantes emitidos"
          variant="success"
          icon={<CheckCircle2 className="w-6 h-6" />}
        />

        <StatsCard
          title="Monto Pendiente"
          value={formatCurrency(totalPendiente)}
          subtitle={totalPendiente > 0 ? 'Cuotas por vencer' : 'Al día'}
          variant={totalPendiente > 0 ? 'warning' : 'primary'}
          icon={<CreditCard className="w-6 h-6" />}
        />

        <StatsCard
          title="Próximo Vencimiento"
          value="31 Mar 2026"
          subtitle="Pensión Marzo 2026"
          variant="info"
          icon={<Clock className="w-6 h-6" />}
        />
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader className="bg-surface flex flex-row items-center justify-between">
          <CardTitle className="text-base">Cronograma Anual de Mensualidades 2026</CardTitle>
          <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Pagos encriptados con Culqi PCI-DSS</span>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-surface-container/60 border-b border-surface-container text-on-surface-variant font-semibold text-[11px] uppercase tracking-wider">
                <th className="p-4">Concepto</th>
                <th className="p-4">Monto</th>
                <th className="p-4">Fecha Vencimiento</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acción / Comprobante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {pagos.map((pago) => (
                <tr key={pago.id} className="hover:bg-surface-container/20 transition-colors">
                  <td className="p-4 font-bold text-primary">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-secondary" />
                      <span>{pago.concepto}</span>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-on-surface font-mono">
                    {formatCurrency(pago.monto + pago.mora)}
                    {pago.mora > 0 && <span className="text-[10px] text-error block">+ {formatCurrency(pago.mora)} mora</span>}
                  </td>
                  <td className="p-4 text-on-surface-variant">
                    {formatDate(pago.fecha_vencimiento)}
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={
                        pago.estado === 'pagado'
                          ? 'success'
                          : pago.estado === 'vencido'
                          ? 'error'
                          : 'warning'
                      }
                      size="md"
                      dot
                    >
                      {pago.estado.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    {pago.estado === 'pagado' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setActivePagoForModal(pago)
                          setIsReceiptModalOpen(true)
                        }}
                        leftIcon={<Download className="w-3.5 h-3.5 text-primary" />}
                      >
                        Recibo
                      </Button>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handlePayCulqi(pago)}
                          leftIcon={<CreditCard className="w-3.5 h-3.5" />}
                        >
                          Pagar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setActivePagoForModal(pago)
                            setIsManualModalOpen(true)
                          }}
                          leftIcon={<UploadCloud className="w-3.5 h-3.5" />}
                        >
                          Yape / Plin
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Modal: Recibo Digital */}
      <Modal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        title="Comprobante Electrónico de Pago"
        description="Colegio Sedes Sapientiae — RUC 20481928371"
      >
        {activePagoForModal && (
          <div className="space-y-4">
            <div className="bg-surface-container/60 p-4 rounded-xl border border-outline-variant/30 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Número de Transacción:</span>
                <span className="font-mono font-bold text-primary">{activePagoForModal.culqi_charge_id || 'CHR-2026-91823'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Alumno:</span>
                <span className="font-bold text-primary">{currentChild?.nombres} {currentChild?.apellidos}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Concepto:</span>
                <span className="font-bold text-primary">{activePagoForModal.concepto}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Método de Pago:</span>
                <span className="capitalize font-semibold text-primary">{activePagoForModal.metodo_pago || 'Culqi Checkout'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Fecha de Pago:</span>
                <span className="font-medium text-primary">{formatDate(activePagoForModal.fecha_pago || new Date())}</span>
              </div>
              <div className="pt-2 border-t border-outline-variant/40 flex justify-between text-sm font-bold text-primary">
                <span>Total Abonado:</span>
                <span>{formatCurrency(activePagoForModal.monto)}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="primary" size="sm" onClick={() => window.print()} leftIcon={<Download className="w-4 h-4" />}>
                Imprimir Comprobante
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Carga Manual Yape / Plin */}
      <Modal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        title="Reportar Pago vía Yape, Plin o Transferencia"
        description="Ingrese el código de operación del voucher bancario."
      >
        <form onSubmit={handleManualPaymentSubmit} className="space-y-4">
          <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-xl text-xs text-primary space-y-1">
            <p className="font-bold">Cuentas Institucionales:</p>
            <p>• Yape / Plin al número: <strong>987 654 321</strong></p>
            <p>• BCP Cta Cte: <strong>191-28391823-0-12</strong></p>
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-primary uppercase tracking-wider">
              Billetera o Banco
            </label>
            <select
              value={manualMethod}
              onChange={(e) => setManualMethod(e.target.value as any)}
              className="w-full bg-white border border-outline-variant/60 rounded-lg p-2.5 text-sm"
            >
              <option value="yape_manual">Yape</option>
              <option value="plin_manual">Plin</option>
              <option value="efectivo">Transferencia BCP / BBVA</option>
            </select>
          </div>

          <Input
            label="Número de Operación del Voucher"
            placeholder="Ej. 084920"
            required
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsManualModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" isLoading={isProcessing} leftIcon={<CheckCircle2 className="w-4 h-4" />}>
              Validar y Registrar Pago
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
