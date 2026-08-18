'use client'

import React, { useState, useEffect } from 'react'
import {
  FileText,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  Send,
  Sparkles,
  Check
} from 'lucide-react'
import { dataStore, FUT } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'

export default function AdminFutPage() {
  const [futs, setFuts] = useState<FUT[]>([])
  const [selectedFut, setSelectedFut] = useState<FUT | null>(null)
  const [isDerivarModalOpen, setIsDerivarModalOpen] = useState(false)
  const [isResolverModalOpen, setIsResolverModalOpen] = useState(false)

  const [nuevaOficina, setNuevaOficina] = useState<FUT['oficina_derivada']>('Secretaría Académica')
  const [nuevoEstado, setNuevoEstado] = useState<'cumplido' | 'no_cumplido'>('cumplido')
  const [comentarioResolucion, setComentarioResolucion] = useState('')
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  useEffect(() => {
    setFuts(dataStore.getFuts())
  }, [])

  const handleDerivar = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFut) return

    dataStore.derivarFut(selectedFut.id, nuevaOficina, 'Lic. Patricia Valenzuela (Secretaría)')
    setFuts(dataStore.getFuts())
    setActionSuccess(`Expediente ${selectedFut.correlativo} derivado a ${nuevaOficina}.`)
    setIsDerivarModalOpen(false)
    setTimeout(() => setActionSuccess(null), 3000)
  }

  const handleResolver = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFut) return

    dataStore.actualizarEstadoFut(
      selectedFut.id,
      nuevoEstado,
      'Sor María del Carmen (Dirección)',
      comentarioResolucion,
      comentarioResolucion
    )

    setFuts(dataStore.getFuts())
    setActionSuccess(`Expediente ${selectedFut.correlativo} marcado como ${nuevoEstado.toUpperCase()}.`)
    setIsResolverModalOpen(false)
    setTimeout(() => setActionSuccess(null), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
              RF-040 a RF-045 / RF-060
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Mesa de Partes & Trámites</span>
          </div>
          <h1 className="text-xl font-bold text-primary mt-1">
            Gestión y Derivación de Expedientes FUT
          </h1>
          <p className="text-xs text-on-surface-variant">
            Recepción, derivación a oficinas (Dirección, Secretaría, Psicología) y resolución final de trámites.
          </p>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-success-container text-success text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Lista de Expedientes */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-soft overflow-hidden">
        <div className="p-4 border-b border-surface-container flex items-center justify-between">
          <h3 className="text-xs font-bold text-primary">Expedientes Ingresados ({futs.length})</h3>
          <span className="text-xs text-on-surface-variant">Trazabilidad en Tiempo Real</span>
        </div>

        <div className="divide-y divide-surface-container">
          {futs.map((fut) => {
            const isCumplido = fut.estado === 'cumplido'
            const isNoCumplido = fut.estado === 'no_cumplido'

            return (
              <div key={fut.id} className="p-5 space-y-3 hover:bg-surface-container/20 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-black text-primary font-mono">{fut.correlativo}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        isCumplido
                          ? 'bg-emerald-100 text-emerald-800'
                          : isNoCumplido
                          ? 'bg-error-container text-error'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {fut.estado.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-bold text-secondary">• {fut.tipo_tramite}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedFut(fut)
                        setNuevaOficina(fut.oficina_derivada)
                        setIsDerivarModalOpen(true)
                      }}
                      leftIcon={<Send className="w-3.5 h-3.5" />}
                    >
                      Derivar
                    </Button>

                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        setSelectedFut(fut)
                        setIsResolverModalOpen(true)
                      }}
                    >
                      Resolver
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-on-surface">
                  <strong className="text-primary">Solicitante:</strong> {fut.solicitante_nombre} (DNI: {fut.dni} • WhatsApp: {fut.telefono}) • Oficina: <strong className="text-secondary">{fut.oficina_derivada}</strong>
                </p>

                <p className="text-xs text-on-surface-variant bg-surface-container/40 p-3 rounded-xl border border-outline-variant/20">
                  <strong className="text-primary">Asunto: </strong>{fut.asunto}
                </p>

                {fut.resolucion_notas && (
                  <div className="p-3 rounded-xl bg-emerald-50 text-xs text-emerald-950 border border-emerald-200">
                    <strong>Resolución:</strong> {fut.resolucion_notas}
                  </div>
                )}

                {/* Trazabilidad */}
                <div className="pt-2 text-[11px] text-on-surface-variant space-y-1">
                  <span className="font-bold text-primary block">Trazabilidad e Historial (RF-044):</span>
                  {fut.historial_estados.map((h, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-secondary shrink-0" />
                      <span>{h.fecha} ({h.usuario}): {h.comentario}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal Derivar a Oficina (RF-042, RF-061) */}
      <Modal
        isOpen={isDerivarModalOpen}
        onClose={() => setIsDerivarModalOpen(false)}
        title={`Derivar Expediente ${selectedFut?.correlativo}`}
      >
        <form onSubmit={handleDerivar} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-primary">
              Seleccionar Área u Oficina de Destino
            </label>
            <select
              value={nuevaOficina}
              onChange={(e) => setNuevaOficina(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface-container/50 text-xs font-semibold text-primary"
            >
              <option value="Dirección">Dirección General</option>
              <option value="Secretaría Académica">Secretaría Académica</option>
              <option value="Psicología">Departamento de Psicología</option>
              <option value="Coordinación Pedagógica">Coordinación Pedagógica</option>
            </select>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" type="button" onClick={() => setIsDerivarModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Confirmar Derivación
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Resolver FUT (RF-043, RF-062) */}
      <Modal
        isOpen={isResolverModalOpen}
        onClose={() => setIsResolverModalOpen(false)}
        title={`Evaluar y Resolver Expediente ${selectedFut?.correlativo}`}
      >
        <form onSubmit={handleResolver} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-primary">
              Estado Final del Trámite (RF-043)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setNuevoEstado('cumplido')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  nuevoEstado === 'cumplido'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                    : 'bg-surface-container/50 border-outline-variant/40 text-on-surface'
                }`}
              >
                ✓ Cumplido (Aprobado)
              </button>
              <button
                type="button"
                onClick={() => setNuevoEstado('no_cumplido')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  nuevoEstado === 'no_cumplido'
                    ? 'bg-error text-white border-error shadow'
                    : 'bg-surface-container/50 border-outline-variant/40 text-on-surface'
                }`}
              >
                ✕ No Cumplido (Rechazado)
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-primary">
              Respuesta / Resolución Notificada al Solicitante
            </label>
            <textarea
              required
              rows={4}
              placeholder="Indique los términos de la resolución, entrega de documentos o reprogramación..."
              value={comentarioResolucion}
              onChange={(e) => setComentarioResolucion(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface-container/50 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" type="button" onClick={() => setIsResolverModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Guardar Resolución y Notificar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
