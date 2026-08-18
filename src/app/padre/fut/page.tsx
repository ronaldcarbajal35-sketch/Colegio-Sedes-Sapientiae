'use client'

import React, { useState, useEffect } from 'react'
import {
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Upload,
  ArrowRight,
  Sparkles,
  Info,
  Check
} from 'lucide-react'
import { dataStore, FUT } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'

export default function PadreFutPage() {
  const [futs, setFuts] = useState<FUT[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Formulario nuevo FUT
  const [tipoTramite, setTipoTramite] = useState<FUT['tipo_tramite']>('Certificado de Estudios')
  const [asunto, setAsunto] = useState('')
  const [solicitanteNombre, setSolicitanteNombre] = useState('Ing. Roberto Quispe Mamani')
  const [dni, setDni] = useState('10293847')
  const [telefono, setTelefono] = useState('+51 987 112 233')
  const [oficina, setOficina] = useState<FUT['oficina_derivada']>('Secretaría Académica')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    setFuts(dataStore.getFuts())
  }, [])

  const handleCrearFut = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const nuevo = dataStore.addFut({
        solicitante_nombre: solicitanteNombre,
        solicitante_rol: 'padre',
        dni,
        telefono,
        tipo_tramite: tipoTramite,
        asunto,
        oficina_derivada: oficina,
        estado: 'en_proceso',
        documento_adjunto: 'solicitud_adjunta.pdf',
      })

      setFuts(dataStore.getFuts())
      setSuccessMessage(`¡Trámite ${nuevo.correlativo} registrado exitosamente!`)
      setTimeout(() => {
        setIsModalOpen(false)
        setSuccessMessage(null)
        setAsunto('')
      }, 1500)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800">
              RF-040 a RF-045
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Mesa de Partes Virtual</span>
          </div>
          <h1 className="text-xl font-bold text-primary mt-1">
            Formato Único de Trámite (FUT Virtual)
          </h1>
          <p className="text-xs text-on-surface-variant">
            Presente solicitudes institucionales y consulte la trazabilidad completa de su expediente en línea.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Presentar Nuevo FUT
        </Button>
      </div>

      {/* Lista de FUTs Registrados */}
      <div className="space-y-4">
        {futs.map((fut) => {
          const isCumplido = fut.estado === 'cumplido'
          const isNoCumplido = fut.estado === 'no_cumplido'

          return (
            <div
              key={fut.id}
              className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-container pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-primary font-mono">{fut.correlativo}</span>
                    <span
                      className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                        isCumplido
                          ? 'bg-emerald-100 text-emerald-800'
                          : isNoCumplido
                          ? 'bg-error-container text-error'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {fut.estado.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-secondary font-bold">• {fut.tipo_tramite}</span>
                  </div>
                  <p className="text-xs text-on-surface-variant">
                    Ingresado el {fut.fecha_ingreso} • Solicitante: <span className="font-semibold text-primary">{fut.solicitante_nombre}</span>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-on-surface-variant uppercase block">Oficina Asignada:</span>
                  <span className="text-xs font-bold text-primary">{fut.oficina_derivada}</span>
                </div>
              </div>

              {/* Asunto y Respuesta */}
              <div className="space-y-2">
                <p className="text-xs text-on-surface leading-relaxed">
                  <span className="font-bold text-primary">Asunto: </span>
                  {fut.asunto}
                </p>

                {fut.resolucion_notas && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                    <span className="font-bold flex items-center gap-1.5 text-emerald-900">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Resolución / Respuesta de Dirección:
                    </span>
                    <p className="leading-relaxed">{fut.resolucion_notas}</p>
                  </div>
                )}
              </div>

              {/* Historial de Trazabilidad (RF-044) */}
              <div className="pt-2 border-t border-surface-container">
                <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-2">
                  Historial de Cambios y Trazabilidad (RF-044):
                </span>
                <div className="space-y-1.5">
                  {fut.historial_estados.map((h, i) => (
                    <div key={i} className="text-[11px] text-on-surface-variant flex items-start gap-2">
                      <Clock className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                      <span>
                        <span className="font-bold text-primary">{h.fecha}</span> ({h.usuario}): {h.comentario}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal Nuevo FUT */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Formulario Único de Trámite (FUT) — Presentar Solicitud"
      >
        <form onSubmit={handleCrearFut} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-primary">
              Tipo de Trámite Requerido
            </label>
            <select
              value={tipoTramite}
              onChange={(e) => setTipoTramite(e.target.value as FUT['tipo_tramite'])}
              className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface-container/50 text-xs font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Certificado de Estudios">Certificado de Estudios Oficial</option>
              <option value="Constancia de Matrícula">Constancia de Matrícula 2026</option>
              <option value="Justificación de Inasistencia">Justificación de Inasistencia / Médica</option>
              <option value="Rectificación de Notas">Rectificación / Revisión de Calificaciones</option>
              <option value="Traslado de Matrícula">Traslado de Matrícula</option>
              <option value="Exoneración de Área">Exoneración de Área Curricular</option>
              <option value="Otro">Otro Asunto Administrativo</option>
            </select>
          </div>

          <Input
            label="Nombres y Apellidos del Solicitante"
            type="text"
            required
            value={solicitanteNombre}
            onChange={(e) => setSolicitanteNombre(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="DNI del Solicitante"
              type="text"
              required
              value={dni}
              onChange={(e) => setDni(e.target.value)}
            />
            <Input
              label="Teléfono WhatsApp"
              type="text"
              required
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-primary">
              Oficina o Área a la que se Dirige
            </label>
            <select
              value={oficina}
              onChange={(e) => setOficina(e.target.value as FUT['oficina_derivada'])}
              className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface-container/50 text-xs font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Secretaría Académica">Secretaría Académica</option>
              <option value="Dirección">Dirección General</option>
              <option value="Psicología">Departamento de Psicología</option>
              <option value="Coordinación Pedagógica">Coordinación Pedagógica</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-primary">
              Detalle y Fundamentación de la Solicitud
            </label>
            <textarea
              required
              rows={3}
              placeholder="Explique detalladamente el motivo de su solicitud..."
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface-container/50 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
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
              Ingresar Expediente FUT
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
