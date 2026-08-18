'use client'

import React, { useState, useEffect } from 'react'
import {
  CheckSquare,
  Plus,
  Clock,
  Upload,
  Calendar,
  Sparkles,
  Check
} from 'lucide-react'
import { dataStore, SeccionCurso, TareaAviso } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'

export default function DocenteTareasPage() {
  const [seccionesCursos, setSeccionesCursos] = useState<SeccionCurso[]>([])
  const [selectedScId, setSelectedScId] = useState('')
  const [tareas, setTareas] = useState<TareaAviso[]>([])

  // Modal Nueva Tarea
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fechaLimite, setFechaLimite] = useState('')
  const [bimestre, setBimestre] = useState<'I' | 'II' | 'III' | 'IV'>('I')
  const [tipo, setTipo] = useState<'tarea' | 'aviso'>('tarea')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    const scList = dataStore.getSeccionesCursos()
    setSeccionesCursos(scList)
    if (scList.length > 0) setSelectedScId(scList[0].id)
    setTareas(dataStore.getTareas())
  }, [])

  const currentSc = seccionesCursos.find(sc => sc.id === selectedScId) || seccionesCursos[0]

  const handleCrearTarea = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentSc) return

    setIsSubmitting(true)
    try {
      dataStore.addTarea({
        seccion_curso_id: currentSc.id,
        seccion_nombre: currentSc.seccion_nombre,
        curso_nombre: currentSc.curso_nombre,
        docente_nombre: 'Prof. Carlos García Silva',
        titulo,
        descripcion,
        fecha_asignacion: new Date().toISOString().split('T')[0],
        fecha_limite: fechaLimite,
        bimestre,
        tipo,
        archivo_adjunto: 'ficha_actividad.pdf',
      })

      setTareas(dataStore.getTareas())
      setSuccessMessage('Tarea publicada exitosamente.')
      setTimeout(() => {
        setIsModalOpen(false)
        setSuccessMessage(null)
        setTitulo('')
        setDescripcion('')
        setFechaLimite('')
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
              RF-011 / RF-017
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Asignación de Actividades</span>
          </div>
          <h1 className="text-xl font-bold text-primary mt-1">
            Gestión de Tareas, Fichas y Avisos
          </h1>
          <p className="text-xs text-on-surface-variant">
            Publique tareas con fecha límite de entrega para alumnos y visualización para padres de familia.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Crear Nueva Tarea
        </Button>
      </div>

      {/* Lista de Tareas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tareas.map((t) => (
          <div key={t.id} className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-secondary">{t.curso_nombre} — {t.seccion_nombre}</span>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Entrega: {t.fecha_limite}
                </span>
              </div>
              <h3 className="text-sm font-bold text-primary">{t.titulo}</h3>
              <p className="text-xs text-on-surface-variant leading-relaxed">{t.descripcion}</p>
            </div>

            <div className="pt-3 border-t border-surface-container flex items-center justify-between text-[11px] text-on-surface-variant">
              <span>Bimestre {t.bimestre}</span>
              <span>Asignado: {t.fecha_asignacion}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nueva Tarea */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nueva Tarea o Aviso Escolar"
      >
        <form onSubmit={handleCrearTarea} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-primary">
              Curso y Aula Destino
            </label>
            <select
              value={selectedScId}
              onChange={(e) => setSelectedScId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface-container/50 text-xs font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {seccionesCursos.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.curso_nombre} — ({sc.seccion_nombre})
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Título de la Tarea / Actividad"
            type="text"
            placeholder="Ej: Ficha Práctica N° 5 - Ecuaciones de 1er Grado"
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Fecha Límite de Entrega"
              type="date"
              required
              value={fechaLimite}
              onChange={(e) => setFechaLimite(e.target.value)}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-primary">
                Bimestre
              </label>
              <select
                value={bimestre}
                onChange={(e) => setBimestre(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface-container/50 text-xs font-semibold text-primary"
              >
                <option value="I">Bimestre I</option>
                <option value="II">Bimestre II</option>
                <option value="III">Bimestre III</option>
                <option value="IV">Bimestre IV</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-primary">
              Instrucciones y Criterios de Evaluación
            </label>
            <textarea
              required
              rows={4}
              placeholder="Especifique los ejercicios a resolver, formato de entrega y rúbrica..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
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
              Publicar Tarea
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
