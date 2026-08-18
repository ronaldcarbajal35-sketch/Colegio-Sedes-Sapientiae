'use client'

import React, { useState, useEffect } from 'react'
import {
  BookOpenCheck,
  Save,
  History,
  Calculator,
  ShieldCheck,
  Sparkles,
  Info,
  Check,
  Search
} from 'lucide-react'
import { dataStore, SeccionCurso, Alumno, Nota, AuditoriaNota } from '@/lib/mock-data'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'

export default function DocenteNotasPage() {
  const [seccionesCursos, setSeccionesCursos] = useState<SeccionCurso[]>([])
  const [selectedScId, setSelectedScId] = useState('')
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [notas, setNotas] = useState<Nota[]>([])
  const [auditorias, setAuditorias] = useState<AuditoriaNota[]>([])
  const [selectedBimestre, setSelectedBimestre] = useState<'I' | 'II' | 'III' | 'IV'>('I')

  // Estado editable de notas: { alumnoId: { nota_dia, nota_bimestral, conclusiones } }
  const [editMap, setEditMap] = useState<Record<string, { nota_dia: number; nota_bimestral: number; conclusiones: string }>>({})
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Modal de Historial / Auditoría (RF-016)
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false)

  useEffect(() => {
    const scList = dataStore.getSeccionesCursos()
    setSeccionesCursos(scList)
    if (scList.length > 0) setSelectedScId(scList[0].id)

    const allAlu = dataStore.getAlumnos()
    setAlumnos(allAlu)
    setNotas(dataStore.getNotas())
    setAuditorias(dataStore.getAuditoriaNotas())
  }, [])

  useEffect(() => {
    const currentNotas = dataStore.getNotas().filter(n => n.seccion_curso_id === selectedScId && n.bimestre === selectedBimestre)
    const map: Record<string, { nota_dia: number; nota_bimestral: number; conclusiones: string }> = {}

    alumnos.forEach(alu => {
      const found = currentNotas.find(n => n.alumno_id === alu.id)
      map[alu.id] = {
        nota_dia: found ? found.nota_dia : 16,
        nota_bimestral: found ? found.nota_bimestral : 16,
        conclusiones: found?.conclusiones_descriptivas || '',
      }
    })

    setEditMap(map)
  }, [selectedScId, selectedBimestre, alumnos])

  const currentSc = seccionesCursos.find(sc => sc.id === selectedScId) || seccionesCursos[0]
  const seccionAlumnos = alumnos.filter(a => a.seccion_id === currentSc?.seccion_id)

  const handleNotaDiaChange = (aluId: string, val: number) => {
    const clamped = Math.max(0, Math.min(20, val || 0))
    setEditMap(prev => ({
      ...prev,
      [aluId]: {
        ...prev[aluId],
        nota_dia: clamped,
        // RF-014: Consolidación automática de nota bimestral
        nota_bimestral: clamped,
      }
    }))
  }

  const handleNotaBimestralChange = (aluId: string, val: number) => {
    const clamped = Math.max(0, Math.min(20, val || 0))
    setEditMap(prev => ({
      ...prev,
      [aluId]: {
        ...prev[aluId],
        nota_bimestral: clamped,
      }
    }))
  }

  const handleConclusionesChange = (aluId: string, text: string) => {
    setEditMap(prev => ({
      ...prev,
      [aluId]: {
        ...prev[aluId],
        conclusiones: text,
      }
    }))
  }

  const handleGuardarNotas = () => {
    seccionAlumnos.forEach(alu => {
      const data = editMap[alu.id]
      if (data) {
        dataStore.saveNota({
          alumno_id: alu.id,
          seccion_curso_id: currentSc.id,
          bimestre: selectedBimestre,
          competencia: 'Resuelve problemas y razonamiento del área',
          nota_dia: data.nota_dia,
          nota_bimestral: data.nota_bimestral,
          conclusiones_descriptivas: data.conclusiones,
          usuario_nombre: 'Prof. Carlos García Silva',
          motivo_cambio: 'Actualización en registro de calificaciones',
        })
      }
    })

    setNotas(dataStore.getNotas())
    setAuditorias(dataStore.getAuditoriaNotas())
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 2500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
              RF-013 / RF-014 / RF-016
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Evaluación Formativa & Consolidado</span>
          </div>
          <h1 className="text-xl font-bold text-primary mt-1">
            Registro de Calificaciones (Diarias y Bimestrales)
          </h1>
          <p className="text-xs text-on-surface-variant">
            Califique las sesiones diarias con consolidación bimestral automática y auditoría de cambios.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsAuditModalOpen(true)}
            leftIcon={<History className="w-4 h-4" />}
          >
            Historial de Auditoría
          </Button>

          <Button
            variant="primary"
            onClick={handleGuardarNotas}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Guardar Calificaciones
          </Button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-success-container text-success text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>Calificaciones guardadas exitosamente y registradas en el log de auditoría.</span>
        </div>
      )}

      {/* Selector de Curso y Bimestre */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-outline-variant/30 shadow-soft">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-primary">Curso:</span>
          {seccionesCursos.map((sc) => (
            <button
              key={sc.id}
              onClick={() => setSelectedScId(sc.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedScId === sc.id
                  ? 'bg-primary text-white shadow'
                  : 'bg-surface-container/60 hover:bg-surface-container text-on-surface'
              }`}
            >
              {sc.curso_nombre} ({sc.seccion_nombre})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 border-t sm:border-t-0 pt-2 sm:pt-0">
          {(['I', 'II', 'III', 'IV'] as const).map((bim) => (
            <button
              key={bim}
              onClick={() => setSelectedBimestre(bim)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedBimestre === bim
                  ? 'bg-secondary text-white shadow'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container/80'
              }`}
            >
              Bimestre {bim}
            </button>
          ))}
        </div>
      </div>

      {/* Matriz de Calificaciones */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-soft overflow-hidden">
        <div className="p-4 border-b border-surface-container grid grid-cols-12 gap-2 text-xs font-bold text-primary items-center">
          <span className="col-span-4">Estudiante / Código</span>
          <span className="col-span-2 text-center">Nota del Día (RF-013)</span>
          <span className="col-span-2 text-center">Nota Bimestral (RF-014)</span>
          <span className="col-span-4">Conclusión Descriptiva / Observación</span>
        </div>

        <div className="divide-y divide-surface-container">
          {seccionAlumnos.map((alu) => {
            const current = editMap[alu.id] || { nota_dia: 16, nota_bimestral: 16, conclusiones: '' }

            return (
              <div key={alu.id} className="p-4 grid grid-cols-12 gap-2 items-center hover:bg-surface-container/30 transition-colors">
                <div className="col-span-4 space-y-0.5">
                  <span className="text-xs font-black text-primary block">
                    {alu.nombres} {alu.apellidos}
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-mono">
                    {alu.codigo_estudiante} • DNI: {alu.dni}
                  </span>
                </div>

                <div className="col-span-2 flex justify-center">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={current.nota_dia}
                    onChange={(e) => handleNotaDiaChange(alu.id, parseInt(e.target.value))}
                    className="w-16 text-center py-1.5 font-black text-sm rounded-xl border border-outline-variant/60 focus:ring-2 focus:ring-primary text-primary"
                  />
                </div>

                <div className="col-span-2 flex justify-center">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={current.nota_bimestral}
                    onChange={(e) => handleNotaBimestralChange(alu.id, parseInt(e.target.value))}
                    className="w-16 text-center py-1.5 font-black text-sm rounded-xl border-2 border-secondary bg-amber-50/50 text-secondary focus:ring-2 focus:ring-secondary"
                  />
                </div>

                <div className="col-span-4">
                  <input
                    type="text"
                    placeholder="Excelente desempeño / Reforzar cálculo..."
                    value={current.conclusiones}
                    onChange={(e) => handleConclusionesChange(alu.id, e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-outline-variant/60 text-on-surface focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modal de Historial de Auditoría (RF-016) */}
      <Modal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        title="Historial de Auditoría de Calificaciones (RF-016)"
      >
        <div className="space-y-3">
          <p className="text-xs text-on-surface-variant">
            Registro inmutable de correcciones y ediciones de notas con usuario, fecha y valor anterior/nuevo.
          </p>

          <div className="divide-y divide-surface-container max-h-72 overflow-y-auto">
            {auditorias.map((aud) => (
              <div key={aud.id} className="py-3 space-y-1 text-xs">
                <div className="flex items-center justify-between font-bold text-primary">
                  <span>{aud.alumno_nombre} — {aud.curso_nombre}</span>
                  <span className="text-on-surface-variant text-[11px] font-normal">{aud.fecha}</span>
                </div>
                <p className="text-on-surface-variant">
                  Modificado por: <span className="font-semibold text-primary">{aud.usuario_modifica}</span>
                </p>
                <div className="flex items-center gap-3 text-xs pt-1">
                  <span className="text-error font-medium">Anterior: {aud.valor_anterior}</span>
                  <span>➔</span>
                  <span className="text-emerald-700 font-bold">Nuevo: {aud.valor_nuevo}</span>
                </div>
                <p className="text-[11px] text-secondary font-medium pt-0.5">Motivo: {aud.motivo}</p>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="outline" onClick={() => setIsAuditModalOpen(false)}>
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
