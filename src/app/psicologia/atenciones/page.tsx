'use client'

import React, { useState, useEffect } from 'react'
import {
  HeartHandshake,
  Plus,
  Lock,
  Calendar,
  User,
  ShieldCheck,
  Sparkles,
  Check
} from 'lucide-react'
import { dataStore, Alumno, AtencionPsicologia } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'

export default function PsicologiaAtencionesPage() {
  const [atenciones, setAtenciones] = useState<AtencionPsicologia[]>([])
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Formulario de Nueva Atención
  const [selectedAlumnoId, setSelectedAlumnoId] = useState('')
  const [motivo, setMotivo] = useState('')
  const [observaciones, setObservaciones] = useState('')
  const [planAccion, setPlanAccion] = useState('')
  const [derivadoA, setDerivadoA] = useState<AtencionPsicologia['derivado_a']>('Docentes')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    setAtenciones(dataStore.getAtencionesPsicologia())
    const allAlu = dataStore.getAlumnos()
    setAlumnos(allAlu)
    if (allAlu.length > 0) setSelectedAlumnoId(allAlu[0].id)
  }, [])

  const handleCrearAtencion = (e: React.FormEvent) => {
    e.preventDefault()
    const alu = alumnos.find(a => a.id === selectedAlumnoId)
    if (!alu) return

    setIsSubmitting(true)
    try {
      dataStore.addAtencionPsicologia({
        alumno_id: alu.id,
        alumno_nombre: `${alu.nombres} ${alu.apellidos}`,
        seccion_nombre: alu.seccion_nombre,
        psicologo_nombre: 'Lic. Andrés Salgado',
        fecha: new Date().toISOString().split('T')[0],
        motivo,
        observaciones_confidenciales: observaciones,
        acuerdos_plan_accion: planAccion,
        derivado_a: derivadoA,
        seguimiento_activo: true,
      })

      setAtenciones(dataStore.getAtencionesPsicologia())
      setSuccessMessage('Ficha de atención psicológica guardada bajo estricta confidencialidad.')
      setTimeout(() => {
        setIsModalOpen(false)
        setSuccessMessage(null)
        setMotivo('')
        setObservaciones('')
        setPlanAccion('')
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
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              RF-070 / RF-073 (Confidencial)
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Dpto. Psicopedagógico</span>
          </div>
          <h1 className="text-xl font-bold text-primary mt-1">
            Fichas de Entrevistas y Atención Psicológica
          </h1>
          <p className="text-xs text-on-surface-variant">
            Registro confidencial de atenciones individuales, diagnóstico preliminar y plan de intervención.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Nueva Ficha de Atención
        </Button>
      </div>

      {/* Lista de Atenciones */}
      <div className="space-y-4">
        {atenciones.map((at) => (
          <div
            key={at.id}
            className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container pb-3">
              <div>
                <span className="text-xs font-black text-primary">{at.alumno_nombre}</span>
                <span className="text-[11px] text-on-surface-variant ml-2 font-medium">
                  ({at.seccion_nombre})
                </span>
                <h3 className="text-sm font-bold text-secondary mt-0.5">{at.motivo}</h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-primary flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-secondary" />
                  {at.fecha}
                </span>
                <span className="text-[11px] text-on-surface-variant">{at.psicologo_nombre}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200 text-xs space-y-1">
              <span className="font-bold text-rose-950 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-rose-700" />
                Observaciones y Diagnóstico Confidencial (RF-073):
              </span>
              <p className="text-rose-900 leading-relaxed">{at.observaciones_confidenciales}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-container/60 text-xs space-y-1">
              <span className="font-bold text-primary">Plan de Acción y Pautas de Seguimiento:</span>
              <p className="text-on-surface leading-relaxed">{at.acuerdos_plan_accion}</p>
            </div>

            {at.derivado_a && (
              <div className="pt-2 text-[11px] text-secondary font-bold">
                ✓ Derivado con recomendaciones para: {at.derivado_a} (RF-072)
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Nueva Atención */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Atención Psicológica Confidencial"
      >
        <form onSubmit={handleCrearAtencion} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-primary">
              Estudiante Atendido
            </label>
            <select
              value={selectedAlumnoId}
              onChange={(e) => setSelectedAlumnoId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface-container/50 text-xs font-semibold text-primary"
            >
              {alumnos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombres} {a.apellidos} — ({a.seccion_nombre})
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Motivo de la Entrevista / Atención"
            type="text"
            placeholder="Ej: Dificultad de adaptación, ansiedad ante exámenes, etc."
            required
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-primary">
              Observaciones y Diagnóstico (Confidencial)
            </label>
            <textarea
              required
              rows={3}
              placeholder="Detalle clínico y conductual de la sesión..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface-container/50 text-xs text-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-primary">
              Plan de Acción y Acuerdos
            </label>
            <textarea
              required
              rows={3}
              placeholder="Acuerdos con el estudiante, frecuencia de sesiones y tareas..."
              value={planAccion}
              onChange={(e) => setPlanAccion(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface-container/50 text-xs text-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-primary">
              Derivación / Recomendaciones para:
            </label>
            <select
              value={derivadoA}
              onChange={(e) => setDerivadoA(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface-container/50 text-xs font-semibold text-primary"
            >
              <option value="Docentes">Docentes de Aula</option>
              <option value="Auxiliares">Auxiliares de Educación</option>
              <option value="Padres de Familia">Padres de Familia / Apoderados</option>
              <option value="Especialista Externo">Especialista Externo (Neurología/Terapia)</option>
            </select>
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
              Guardar Ficha
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
