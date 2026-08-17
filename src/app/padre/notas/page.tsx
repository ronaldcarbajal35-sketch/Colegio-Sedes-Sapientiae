'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, Award, BookOpen, Sparkles, CheckCircle2, HelpCircle } from 'lucide-react'
import { dataStore, type Alumno, type Nota } from '@/lib/mock-data'

export default function PadreNotasPage() {
  const [selectedBimestre, setSelectedBimestre] = useState('Bimestre 1')
  const [currentChild, setCurrentChild] = useState<Alumno | null>(null)
  const [notas, setNotas] = useState<Nota[]>([])
  const [isDownloading, setIsDownloading] = useState(false)

  const loadChildData = () => {
    const allAlu = dataStore.getAlumnos()
    const storedChildId = typeof window !== 'undefined' ? localStorage.getItem('sedes_selected_child') : null
    const child = allAlu.find(a => a.id === storedChildId) || allAlu.find(a => a.apoderado_id === 'usr-pad-1') || allAlu[0]
    setCurrentChild(child)

    if (child) {
      const studentNotas = dataStore.getNotas().filter(n => n.alumno_id === child.id && n.periodo === selectedBimestre)
      setNotas(studentNotas)
    }
  }

  useEffect(() => {
    loadChildData()
    const handleChildChange = () => loadChildData()
    window.addEventListener('child_changed', handleChildChange)
    return () => window.removeEventListener('child_changed', handleChildChange)
  }, [selectedBimestre])

  const handleDownloadPDF = () => {
    setIsDownloading(true)
    setTimeout(() => {
      setIsDownloading(false)
      window.print()
    }, 600)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-primary tracking-tight">
            Libreta de Información Académica
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Evaluación cualitativa por competencias según lineamientos del MINEDU — <strong>{currentChild?.nombres} {currentChild?.apellidos}</strong> ({currentChild?.seccion_nombre})
          </p>
        </div>

        <Button
          variant="secondary"
          size="md"
          isLoading={isDownloading}
          onClick={handleDownloadPDF}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Descargar Boleta PDF
        </Button>
      </div>

      {/* Bimestre Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-3 overflow-x-auto">
        {['Bimestre 1', 'Bimestre 2', 'Bimestre 3', 'Bimestre 4'].map((bim) => (
          <button
            key={bim}
            onClick={() => setSelectedBimestre(bim)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedBimestre === bim
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white text-on-surface-variant hover:bg-surface-container border border-outline-variant/30'
            }`}
          >
            {bim}
          </button>
        ))}
      </div>

      {/* Escala de Calificación Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-outline-variant/30 shadow-card text-xs">
        <div className="flex items-center gap-2.5">
          <Badge variant="grade-AD" size="md">AD</Badge>
          <div>
            <p className="font-bold text-primary">Logro Destacado</p>
            <p className="text-[11px] text-on-surface-variant">Supera los aprendizajes esperados</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Badge variant="grade-A" size="md">A</Badge>
          <div>
            <p className="font-bold text-primary">Logro Esperado</p>
            <p className="text-[11px] text-on-surface-variant">Alcanza el nivel de la competencia</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Badge variant="grade-B" size="md">B</Badge>
          <div>
            <p className="font-bold text-primary">En Proceso</p>
            <p className="text-[11px] text-on-surface-variant">Próximo a alcanzar el nivel</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Badge variant="grade-C" size="md">C</Badge>
          <div>
            <p className="font-bold text-primary">En Inicio</p>
            <p className="text-[11px] text-on-surface-variant">Muestra progreso mínimo</p>
          </div>
        </div>
      </div>

      {/* Competencies Table Card */}
      <Card>
        <CardHeader className="bg-surface">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Resultados de Evaluación: {selectedBimestre}</CardTitle>
            <span className="text-xs text-on-surface-variant font-medium">Año Lectivo 2026</span>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-surface-container/60 border-b border-surface-container text-on-surface-variant font-semibold text-[11px] uppercase tracking-wider">
                <th className="p-4">Área Curricular</th>
                <th className="p-4">Competencia Evaluada</th>
                <th className="p-4 text-center">Calificación</th>
                <th className="p-4">Conclusión Descriptiva</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {notas.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-on-surface-variant">
                    No se han registrado calificaciones para el {selectedBimestre} todavía.
                  </td>
                </tr>
              ) : (
                notas.map((nota) => {
                  const area = nota.seccion_curso_id.includes('mat') ? 'Matemática' : 'Comunicación Integral'
                  return (
                    <tr key={nota.id} className="hover:bg-surface-container/20 transition-colors">
                      <td className="p-4 font-bold text-primary flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-secondary" />
                        <span>{area}</span>
                      </td>
                      <td className="p-4 text-on-surface font-medium max-w-xs">
                        {nota.competencia}
                      </td>
                      <td className="p-4 text-center">
                        <Badge variant={`grade-${nota.calificacion}` as any} size="md">
                          {nota.calificacion}
                        </Badge>
                      </td>
                      <td className="p-4 text-xs text-on-surface-variant max-w-sm">
                        {nota.conclusiones_descriptivas || 'Desempeño satisfactorio acorde a la programación curricular.'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
