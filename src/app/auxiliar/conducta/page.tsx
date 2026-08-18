'use client'

import React, { useState, useEffect } from 'react'
import {
  ClipboardList,
  Plus,
  Award,
  AlertOctagon,
  Info,
  Calendar,
  MessageSquare,
  Sparkles,
  Check
} from 'lucide-react'
import { dataStore, Seccion, Alumno, ConductaIncidencia } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'

export default function AuxiliarConductaPage() {
  const [secciones, setSecciones] = useState<Seccion[]>([])
  const [selectedSeccionId, setSelectedSeccionId] = useState<string>('sec-3a-pri')
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [conductas, setConductas] = useState<ConductaIncidencia[]>([])

  // Modal para nueva observación
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAlumnoId, setSelectedAlumnoId] = useState('')
  const [tipo, setTipo] = useState<'merito' | 'demerito' | 'observacion'>('demerito')
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [notificarWsp, setNotificarWsp] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    const allSec = dataStore.getSecciones()
    setSecciones(allSec)
    const allAlu = dataStore.getAlumnos()
    setAlumnos(allAlu)
    if (allAlu.length > 0) setSelectedAlumnoId(allAlu[0].id)
    setConductas(dataStore.getConductas())
  }, [])

  const currentSeccion = secciones.find(s => s.id === selectedSeccionId) || secciones[0]
  const currentAlumnos = alumnos.filter(a => a.seccion_id === selectedSeccionId)

  const handleCrearConducta = (e: React.FormEvent) => {
    e.preventDefault()
    const alu = alumnos.find(a => a.id === selectedAlumnoId)
    if (!alu) return

    setIsSubmitting(true)
    try {
      dataStore.addConducta({
        alumno_id: alu.id,
        alumno_nombre: `${alu.nombres} ${alu.apellidos}`,
        seccion_id: alu.seccion_id,
        seccion_nombre: alu.seccion_nombre,
        fecha: new Date().toISOString().split('T')[0],
        tipo,
        titulo,
        descripcion,
        auxiliar_nombre: 'Aux. Pedro Huamán',
        notificado_whatsapp: notificarWsp,
      })

      setConductas(dataStore.getConductas())
      setSuccessMessage('Observación registrada y enviada a los padres con éxito.')
      setTimeout(() => {
        setIsModalOpen(false)
        setSuccessMessage(null)
        setTitulo('')
        setDescripcion('')
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
              RF-021 / RF-024
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Control Tutorial y Disciplina</span>
          </div>
          <h1 className="text-xl font-bold text-primary mt-1">
            Registro de Conducta, Méritos y Deméritos
          </h1>
          <p className="text-xs text-on-surface-variant">
            Registre notas de comportamiento por alumno con notificación inmediata a los padres vía WhatsApp.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Nueva Observación
        </Button>
      </div>

      {/* Selector de Aula */}
      <div className="bg-white p-4 rounded-2xl border border-outline-variant/30 shadow-soft space-y-2">
        <span className="text-xs font-bold text-primary">Filtrar por Aula:</span>
        <div className="flex flex-wrap gap-1.5">
          {secciones.slice(0, 10).map((sec) => (
            <button
              key={sec.id}
              onClick={() => setSelectedSeccionId(sec.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedSeccionId === sec.id
                  ? 'bg-primary text-white shadow'
                  : 'bg-surface-container/60 hover:bg-surface-container text-on-surface'
              }`}
            >
              {sec.nombre.split(' - ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Registros */}
      <div className="space-y-3">
        {conductas.map((c) => {
          const isMerito = c.tipo === 'merito'
          const isDemerito = c.tipo === 'demerito'

          return (
            <div
              key={c.id}
              className={`p-5 rounded-2xl border transition-all shadow-soft space-y-2 ${
                isMerito
                  ? 'bg-emerald-50/60 border-emerald-200'
                  : isDemerito
                  ? 'bg-amber-50/70 border-amber-300'
                  : 'bg-white border-outline-variant/30'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      isMerito
                        ? 'bg-emerald-100 text-emerald-800'
                        : isDemerito
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-surface-container text-primary'
                    }`}
                  >
                    {c.tipo}
                  </span>
                  <span className="text-xs font-black text-primary">{c.alumno_nombre}</span>
                  <span className="text-[11px] text-on-surface-variant">({c.seccion_nombre})</span>
                </div>
                <span className="text-xs text-on-surface-variant">{c.fecha}</span>
              </div>

              <h3 className="text-xs font-bold text-primary">{c.titulo}</h3>
              <p className="text-xs text-on-surface leading-relaxed">{c.descripcion}</p>

              <div className="pt-1 flex items-center justify-between text-[11px] text-on-surface-variant border-t border-surface-container/60">
                <span>Registrado por: <strong className="text-primary">{c.auxiliar_nombre}</strong></span>
                {c.notificado_whatsapp && (
                  <span className="text-emerald-800 font-bold flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    Notificado a Apoderado por WhatsApp
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal Nueva Observación */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Incidencia o Mérito de Comportamiento"
      >
        <form onSubmit={handleCrearConducta} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-primary">
              Seleccionar Alumno
            </label>
            <select
              value={selectedAlumnoId}
              onChange={(e) => setSelectedAlumnoId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface-container/50 text-xs font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {alumnos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombres} {a.apellidos} — ({a.seccion_nombre})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-primary">
              Tipo de Observación (RF-021)
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setTipo('merito')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  tipo === 'merito'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                    : 'bg-surface-container/50 border-outline-variant/40 text-on-surface'
                }`}
              >
                🏅 Mérito
              </button>
              <button
                type="button"
                onClick={() => setTipo('demerito')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  tipo === 'demerito'
                    ? 'bg-amber-600 text-white border-amber-600 shadow'
                    : 'bg-surface-container/50 border-outline-variant/40 text-on-surface'
                }`}
              >
                ⚠️ Demérito
              </button>
              <button
                type="button"
                onClick={() => setTipo('observacion')}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  tipo === 'observacion'
                    ? 'bg-primary text-white border-primary shadow'
                    : 'bg-surface-container/50 border-outline-variant/40 text-on-surface'
                }`}
              >
                📝 Observación
              </button>
            </div>
          </div>

          <Input
            label="Título del Incidente o Mérito"
            type="text"
            placeholder="Ej: Destacada ayuda a sus compañeros o Tardanza reiterada"
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-primary">
              Descripción Detallada
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describa el hecho ocurrido, lugar y acuerdos tomados..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface-container/50 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-primary cursor-pointer">
            <input
              type="checkbox"
              checked={notificarWsp}
              onChange={(e) => setNotificarWsp(e.target.checked)}
              className="rounded text-primary focus:ring-primary w-4 h-4"
            />
            <span>Enviar notificación automática por WhatsApp al apoderado (RF-024)</span>
          </label>

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
              Guardar Observación
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
