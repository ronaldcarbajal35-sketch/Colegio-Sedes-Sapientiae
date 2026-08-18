'use client'

import React, { useState, useEffect } from 'react'
import {
  BookOpenCheck,
  Plus,
  Calendar,
  Save,
  Link2,
  Trash2,
  Sparkles,
  Check
} from 'lucide-react'
import { dataStore, SeccionCurso, TemarioDia } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'

export default function DocenteTemarioPage() {
  const [seccionesCursos, setSeccionesCursos] = useState<SeccionCurso[]>([])
  const [selectedScId, setSelectedScId] = useState('')
  const [temarios, setTemarios] = useState<TemarioDia[]>([])

  // Modal Nuevo Temario
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [temaTitulo, setTemaTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [recursoUrl, setRecursoUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    const scList = dataStore.getSeccionesCursos()
    setSeccionesCursos(scList)
    if (scList.length > 0) setSelectedScId(scList[0].id)
    setTemarios(dataStore.getTemarios())
  }, [])

  const currentSc = seccionesCursos.find(sc => sc.id === selectedScId) || seccionesCursos[0]

  const handleCrearTemario = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentSc) return

    setIsSubmitting(true)
    try {
      dataStore.addTemario({
        seccion_curso_id: currentSc.id,
        seccion_nombre: currentSc.seccion_nombre,
        curso_nombre: currentSc.curso_nombre,
        docente_nombre: 'Prof. Carlos García Silva',
        fecha: new Date().toISOString().split('T')[0],
        tema_titulo: temaTitulo,
        descripcion,
        recursos_enlaces: recursoUrl ? [recursoUrl] : [],
      })

      setTemarios(dataStore.getTemarios())
      setSuccessMessage('Temario del día publicado exitosamente para alumnos y padres.')
      setTimeout(() => {
        setIsModalOpen(false)
        setSuccessMessage(null)
        setTemaTitulo('')
        setDescripcion('')
        setRecursoUrl('')
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
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
              RF-010 / RF-082
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Contenido Dictado en Clase</span>
          </div>
          <h1 className="text-xl font-bold text-primary mt-1">
            Temario del Día — Publicación Diaria
          </h1>
          <p className="text-xs text-on-surface-variant">
            Registre los temas tratados en cada sesión para que los alumnos y padres estén sincronizados.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Publicar Temario de Hoy
        </Button>
      </div>

      {/* Selector de Aula y Curso */}
      <div className="bg-white p-4 rounded-2xl border border-outline-variant/30 shadow-soft space-y-2">
        <span className="text-xs font-bold text-primary">Mis Cursos Asignados:</span>
        <div className="flex flex-wrap gap-2">
          {seccionesCursos.map((sc) => (
            <button
              key={sc.id}
              onClick={() => setSelectedScId(sc.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedScId === sc.id
                  ? 'bg-primary text-white shadow'
                  : 'bg-surface-container/60 hover:bg-surface-container text-on-surface'
              }`}
            >
              {sc.curso_nombre} — ({sc.seccion_nombre})
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Temarios Publicados */}
      <div className="space-y-4">
        {temarios.map((tem) => (
          <div key={tem.id} className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-container pb-3">
              <div>
                <span className="text-xs font-bold text-secondary uppercase">{tem.curso_nombre}</span>
                <h3 className="text-sm font-black text-primary">{tem.tema_titulo}</h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-primary flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-secondary" />
                  {tem.fecha}
                </span>
                <span className="text-[11px] text-on-surface-variant">{tem.seccion_nombre}</span>
              </div>
            </div>

            <p className="text-xs text-on-surface leading-relaxed">{tem.descripcion}</p>

            {tem.recursos_enlaces && tem.recursos_enlaces.length > 0 && (
              <div className="pt-2 flex items-center gap-2">
                <span className="text-[11px] font-bold text-primary">Material adjunto:</span>
                <a
                  href={tem.recursos_enlaces[0]}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-secondary font-bold hover:underline"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Enlace de estudio / Diapositivas</span>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal Nuevo Temario */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Publicar Temario del Día — ${currentSc?.curso_nombre}`}
      >
        <form onSubmit={handleCrearTemario} className="space-y-4">
          <div className="p-3 rounded-xl bg-surface-container/60 text-xs text-primary font-medium">
            Aula: <span className="font-bold">{currentSc?.seccion_nombre}</span> • Fecha: <span className="font-bold">{new Date().toISOString().split('T')[0]}</span>
          </div>

          <Input
            label="Tema o Contenido Principal Dictado"
            type="text"
            placeholder="Ej: Teorema de Pitágoras y Ejercicios de Aplicación"
            required
            value={temaTitulo}
            onChange={(e) => setTemaTitulo(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-primary">
              Resumen de la Clase y Actividades Desarrolladas
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describa los conceptos explicados, páginas del libro resueltas o dinámicas de clase..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface-container/50 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <Input
            label="Enlace a Diapositivas / Material de Clase (Opcional)"
            type="url"
            placeholder="https://drive.google.com/... o enlace web"
            value={recursoUrl}
            onChange={(e) => setRecursoUrl(e.target.value)}
          />

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
              Publicar Temario
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
