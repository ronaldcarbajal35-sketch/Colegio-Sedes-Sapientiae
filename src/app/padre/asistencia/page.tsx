'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { StatsCard } from '@/components/ui/stats-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input } from '@/components/ui/input'
import { CalendarCheck2, CheckCircle2, Clock, AlertTriangle, FileText, Send, Calendar } from 'lucide-react'
import { dataStore, type Alumno, type Asistencia } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'

export default function PadreAsistenciaPage() {
  const [currentChild, setCurrentChild] = useState<Alumno | null>(null)
  const [asistencias, setAsistencias] = useState<Asistencia[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [justFecha, setJustFecha] = useState(new Date().toISOString().split('T')[0])
  const [justMotivo, setJustMotivo] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const loadData = () => {
    const allAlu = dataStore.getAlumnos()
    const storedChildId = typeof window !== 'undefined' ? localStorage.getItem('sedes_selected_child') : null
    const child = allAlu.find(a => a.id === storedChildId) || allAlu.find(a => a.apoderado_id === 'usr-pad-1') || allAlu[0]
    setCurrentChild(child)

    if (child) {
      const astList = dataStore.getAsistencias().filter(a => a.alumno_id === child.id)
      setAsistencias(astList)
    }
  }

  useEffect(() => {
    loadData()
    const handleChildChange = () => loadData()
    window.addEventListener('child_changed', handleChildChange)
    return () => window.removeEventListener('child_changed', handleChildChange)
  }, [])

  const handleSendJustification = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentChild) return
    setIsSaving(true)

    setTimeout(() => {
      dataStore.saveAsistencia({
        alumno_id: currentChild.id,
        seccion_curso_id: 'sc-3a-mat',
        fecha: justFecha,
        estado: 'justificado',
        justificacion: justMotivo,
      })

      setIsSaving(false)
      setIsModalOpen(false)
      setJustMotivo('')
      loadData()
    }, 800)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-primary tracking-tight">
            Control de Asistencia Escolar
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Registro diario de puntualidad y asistencia — <strong>{currentChild?.nombres} {currentChild?.apellidos}</strong>
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<FileText className="w-4 h-4" />}
        >
          Justificar Inasistencia / Tardanza
        </Button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatsCard
          title="Asistencias"
          value="24 días"
          subtitle="Puntualidad excelente"
          variant="success"
          icon={<CheckCircle2 className="w-6 h-6" />}
        />

        <StatsCard
          title="Tardanzas"
          value="1 día"
          subtitle="0.5 horas acumuladas"
          variant="warning"
          icon={<Clock className="w-6 h-6" />}
        />

        <StatsCard
          title="Faltas Injustificadas"
          value="0 días"
          subtitle="Sin incidencias"
          variant="primary"
          icon={<AlertTriangle className="w-6 h-6" />}
        />

        <StatsCard
          title="Justificadas"
          value="1 día"
          subtitle="Aceptado por secretaría"
          variant="info"
          icon={<CalendarCheck2 className="w-6 h-6" />}
        />
      </div>

      {/* History Table */}
      <Card>
        <CardHeader className="bg-surface flex flex-row items-center justify-between">
          <CardTitle className="text-base">Historial de Registro Diario (Mes Actual)</CardTitle>
          <span className="text-xs font-semibold text-primary">Marzo 2026</span>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-surface-container/60 border-b border-surface-container text-on-surface-variant font-semibold text-[11px] uppercase tracking-wider">
                <th className="p-4">Fecha</th>
                <th className="p-4">Hora de Ingreso</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Observaciones / Justificación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {asistencias.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-on-surface-variant">
                    No hay registros de asistencia para este periodo.
                  </td>
                </tr>
              ) : (
                asistencias.map((ast) => (
                  <tr key={ast.id} className="hover:bg-surface-container/20 transition-colors">
                    <td className="p-4 font-bold text-primary flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-outline" />
                      <span>{formatDate(ast.fecha)}</span>
                    </td>
                    <td className="p-4 text-on-surface font-mono text-xs">
                      {ast.estado === 'presente' ? '07:45 AM' : ast.estado === 'tardanza' ? '08:15 AM' : '--:--'}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          ast.estado === 'presente'
                            ? 'success'
                            : ast.estado === 'tardanza'
                            ? 'warning'
                            : ast.estado === 'justificado'
                            ? 'info'
                            : 'error'
                        }
                        size="md"
                        dot
                      >
                        {ast.estado.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-4 text-xs text-on-surface-variant max-w-sm">
                      {ast.justificacion || (ast.estado === 'presente' ? 'Ingreso normal y puntual a clases.' : '-')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Modal: Justificar Falta */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Enviar Justificación de Asistencia"
        description="La solicitud será revisada y validada por secretaría y auxiliar general."
      >
        <form onSubmit={handleSendJustification} className="space-y-4">
          <Input
            label="Fecha a Justificar"
            type="date"
            required
            value={justFecha}
            onChange={(e) => setJustFecha(e.target.value)}
          />

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-primary uppercase tracking-wider">
              Motivo o Justificación Detallada
            </label>
            <textarea
              required
              rows={4}
              placeholder="Describa el motivo médico, trámite familiar o eventualidad..."
              value={justMotivo}
              onChange={(e) => setJustMotivo(e.target.value)}
              className="w-full bg-white border border-outline-variant/60 rounded-lg p-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving} leftIcon={<Send className="w-4 h-4" />}>
              Enviar a Secretaría
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
