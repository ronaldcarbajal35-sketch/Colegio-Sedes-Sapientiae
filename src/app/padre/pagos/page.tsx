'use client'

import React, { useState, useEffect } from 'react'
import {
  CreditCard,
  QrCode,
  Upload,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  FileText,
  School,
  Sparkles,
  Info,
  Check
} from 'lucide-react'
import { dataStore, Alumno, Pago, ComprobantePago } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'

export default function PadrePagosPage() {
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [selectedAlumno, setSelectedAlumno] = useState<Alumno | null>(null)
  const [pagos, setPagos] = useState<Pago[]>([])
  const [comprobantes, setComprobantes] = useState<ComprobantePago[]>([])

  // Modal para subir comprobante Yape QR
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPago, setSelectedPago] = useState<Pago | null>(null)
  const [nroOperacion, setNroOperacion] = useState('')
  const [comprobanteUrl, setComprobanteUrl] = useState('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    const allAlumnos = dataStore.getAlumnos()
    const misHijos = allAlumnos.filter((a) => a.apoderado_id === 'usr-pad-1' || a.id === 'alu-1' || a.id === 'alu-2' || a.id === 'alu-3')
    setAlumnos(misHijos)
    if (misHijos.length > 0) setSelectedAlumno(misHijos[0])

    setPagos(dataStore.getPagos())
    setComprobantes(dataStore.getComprobantes())
  }, [])

  const childId = selectedAlumno?.id || 'alu-1'
  const childPagos = pagos.filter((p) => p.alumno_id === childId)
  const childComprobantes = comprobantes.filter((c) => c.alumno_id === childId)

  const handleOpenPagar = (pago: Pago) => {
    setSelectedPago(pago)
    setNroOperacion('')
    setSuccessMessage(null)
    setIsModalOpen(true)
  }

  const handleSubirVoucher = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPago || !selectedAlumno) return

    setIsSubmitting(true)
    try {
      const nuevo = dataStore.subirComprobanteYape({
        pago_id: selectedPago.id,
        alumno_id: selectedAlumno.id,
        alumno_nombre: `${selectedAlumno.nombres} ${selectedAlumno.apellidos}`,
        apoderado_id: selectedAlumno.apoderado_id,
        apoderado_nombre: selectedAlumno.apoderado_nombre,
        periodo_concepto: selectedPago.concepto,
        monto: selectedPago.monto + (selectedPago.mora || 0),
        nro_operacion: nroOperacion,
        comprobante_url: comprobanteUrl,
      })

      setComprobantes(dataStore.getComprobantes())
      setPagos(dataStore.getPagos())
      setSuccessMessage('Comprobante enviado exitosamente a Secretaría para su validación.')
      setTimeout(() => {
        setIsModalOpen(false)
        setSuccessMessage(null)
      }, 1500)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
              RF-035 / RF-050 / RF-051
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Recaudación Escolar 2026</span>
          </div>
          <h1 className="text-xl font-bold text-primary mt-1">
            Gestión de Pagos & Yape QR Institucional
          </h1>
          <p className="text-xs text-on-surface-variant">
            Pague sus pensiones mediante el código QR de Yape y suba la captura para aprobación inmediata.
          </p>
        </div>

        {/* Selector de Hijo */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-surface-container border border-outline-variant/40">
          {alumnos.map((hijo) => (
            <button
              key={hijo.id}
              onClick={() => setSelectedAlumno(hijo)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                selectedAlumno?.id === hijo.id
                  ? 'bg-primary text-white shadow-md'
                  : 'text-on-surface-variant hover:text-primary hover:bg-white/60'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              <span>{hijo.nombres.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tarjeta Informativa Yape QR Institucional (RF-050) */}
      <div className="bg-gradient-to-br from-[#720e9e] to-[#480a64] rounded-3xl p-6 sm:p-8 text-white shadow-elevated grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold tracking-wide">
            <QrCode className="w-4 h-4 text-amber-300" />
            <span>Yape Institucional Oficial</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Paga en segundos escaneando nuestro QR
          </h2>
          <p className="text-xs sm:text-sm text-purple-100 leading-relaxed">
            1. Abre Yape en tu teléfono y escanea el código.<br />
            2. Ingresa el monto exacto de la pensión.<br />
            3. Toma captura de pantalla y súbela en el botón &ldquo;Subir Voucher&rdquo;.
          </p>
          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-purple-200">
            <div>
              <span className="block text-[10px] text-purple-300 uppercase">Titular:</span>
              <span className="text-white font-bold">Colegio Sede Sapiens S.A.C.</span>
            </div>
            <div>
              <span className="block text-[10px] text-purple-300 uppercase">Número Yape:</span>
              <span className="text-white font-bold">987 654 321</span>
            </div>
            <div>
              <span className="block text-[10px] text-purple-300 uppercase">RUC:</span>
              <span className="text-white font-bold">20601234567</span>
            </div>
          </div>
        </div>

        {/* QR Visual Mock */}
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl text-primary shadow-lg max-w-[200px] mx-auto">
          <div className="w-36 h-36 bg-surface-container rounded-xl border-2 border-dashed border-primary/40 flex flex-col items-center justify-center text-center p-2">
            <QrCode className="w-20 h-20 text-[#720e9e]" />
            <span className="text-[10px] font-black text-[#720e9e] mt-1">YAPE SEDE SAPIENS</span>
          </div>
          <span className="text-[11px] font-bold mt-2 text-on-surface">Escanea con tu App</span>
        </div>
      </div>

      {/* Lista de Pagos y Pensiones del Alumno */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-soft overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-surface-container pb-4">
          <div>
            <h3 className="text-base font-bold text-primary">Estado de Cuenta de {selectedAlumno?.nombres}</h3>
            <p className="text-xs text-on-surface-variant">Historial de matrículas, pensiones mensuales y estado de mora</p>
          </div>
        </div>

        <div className="space-y-3">
          {childPagos.map((pago) => {
            const isVencido = pago.estado === 'vencido'
            const isPagado = pago.estado === 'pagado'
            const isRevision = pago.estado === 'en_revision'

            return (
              <div
                key={pago.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isVencido
                    ? 'bg-amber-50/70 border-amber-300'
                    : isPagado
                    ? 'bg-white border-outline-variant/30'
                    : isRevision
                    ? 'bg-blue-50/70 border-blue-200'
                    : 'bg-surface-container/30 border-outline-variant/30'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">{pago.concepto}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        isPagado
                          ? 'bg-emerald-100 text-emerald-800'
                          : isVencido
                          ? 'bg-error-container text-error'
                          : isRevision
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isRevision ? 'En Revisión' : pago.estado}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant">
                    <span>Vencimiento: {pago.fecha_vencimiento}</span>
                    {pago.fecha_pago && <span>• Pagado el: {pago.fecha_pago}</span>}
                    {pago.nro_operacion && <span>• Op: {pago.nro_operacion}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-4 justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="text-xs text-on-surface-variant block">Total:</span>
                    <span className="text-base font-black text-primary">
                      S/ {pago.monto + (pago.mora || 0)}.00
                    </span>
                    {pago.mora > 0 && (
                      <span className="text-[10px] text-error font-bold block">
                        (+ S/ {pago.mora}.00 de mora)
                      </span>
                    )}
                  </div>

                  {!isPagado && (
                    <Button
                      size="sm"
                      variant={isVencido ? 'primary' : 'outline'}
                      onClick={() => handleOpenPagar(pago)}
                      leftIcon={<Upload className="w-3.5 h-3.5" />}
                    >
                      {isRevision ? 'Subir otro comprobante' : 'Subir Comprobante'}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Historial de Comprobantes Subidos (RF-036) */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-soft p-6 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-primary">Historial de Comprobantes Enviados (RF-036)</h3>
          <p className="text-xs text-on-surface-variant">Seguimiento en tiempo real de la validación administrativa</p>
        </div>

        {childComprobantes.length === 0 ? (
          <p className="text-xs text-on-surface-variant py-4 text-center">
            No se han registrado comprobantes aún para este estudiante.
          </p>
        ) : (
          <div className="divide-y divide-surface-container">
            {childComprobantes.map((comp) => (
              <div key={comp.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-primary">{comp.periodo_concepto}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        comp.estado === 'aprobado'
                          ? 'bg-emerald-100 text-emerald-800'
                          : comp.estado === 'rechazado'
                          ? 'bg-error-container text-error'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {comp.estado}
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant">
                    Nro. Operación: <span className="font-semibold text-primary">{comp.nro_operacion}</span> • Enviado: {comp.fecha_subida}
                  </p>
                  {comp.motivo_rechazo && (
                    <p className="text-xs text-error font-medium">Motivo rechazo: {comp.motivo_rechazo}</p>
                  )}
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-primary">S/ {comp.monto}.00</span>
                  {comp.revisado_por && (
                    <span className="text-[10px] text-on-surface-variant block">Revisado por: {comp.revisado_por}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL DE SUBIDA DE VOUCHER (RF-051) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Subir Comprobante Yape — ${selectedPago?.concepto}`}
      >
        <form onSubmit={handleSubirVoucher} className="space-y-4">
          <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-950 space-y-1">
            <p className="font-bold">Monto a pagar: S/ {(selectedPago?.monto || 0) + (selectedPago?.mora || 0)}.00</p>
            <p className="text-[11px] text-purple-900">
              Yape institucional: <span className="font-bold">987 654 321</span> (Colegio Sede Sapiens)
            </p>
          </div>

          <Input
            label="Número de Operación Yape (Referencia)"
            type="text"
            placeholder="Ej: 912048 o 772910"
            required
            value={nroOperacion}
            onChange={(e) => setNroOperacion(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-primary">
              Captura de Pantalla / Voucher de Yape
            </label>
            <div className="p-4 rounded-xl border-2 border-dashed border-outline-variant/60 bg-surface-container/30 text-center space-y-2">
              <Upload className="w-6 h-6 text-secondary mx-auto" />
              <p className="text-xs font-medium text-primary">Voucher cargado para demostración</p>
              <p className="text-[10px] text-on-surface-variant">JPG, PNG o PDF hasta 5MB</p>
            </div>
          </div>

          {successMessage && (
            <div className="p-3 rounded-xl bg-success-container text-success text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" isLoading={isSubmitting}>
              Confirmar y Enviar a Secretaría
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
