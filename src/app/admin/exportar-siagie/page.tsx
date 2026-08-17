'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { StatsCard } from '@/components/ui/stats-card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/input'
import { FileSpreadsheet, CheckCircle2, AlertTriangle, Download, RefreshCw, Sparkles, ShieldCheck, HelpCircle } from 'lucide-react'
import { dataStore, type Seccion } from '@/lib/mock-data'
import { validarDatosSIAGIE, exportarExcelSIAGIE, type SIAGIEValidacionResultado } from '@/lib/siagie-validator'

export default function AdminExportarSIAGIEPage() {
  const [secciones, setSecciones] = useState<Seccion[]>([])
  const [selectedSeccion, setSelectedSeccion] = useState<string>('todas')
  const [selectedPeriodo, setSelectedPeriodo] = useState<string>('Bimestre 1')
  const [resultado, setResultado] = useState<SIAGIEValidacionResultado | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const loadData = () => {
    const secList = dataStore.getSecciones()
    setSecciones(secList)
    runValidation()
  }

  const runValidation = () => {
    setIsValidating(true)
    setTimeout(() => {
      const res = validarDatosSIAGIE(selectedSeccion, selectedPeriodo)
      setResultado(res)
      setIsValidating(false)
    }, 400)
  }

  useEffect(() => {
    loadData()
  }, [selectedSeccion, selectedPeriodo])

  const handleExport = () => {
    setIsExporting(true)
    setTimeout(() => {
      exportarExcelSIAGIE(selectedSeccion, selectedPeriodo)
      setIsExporting(false)
    }, 500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-primary tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
            <span>Módulo de Exportación Oficial SIAGIE (MINEDU)</span>
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Validador previo de consistencia de nóminas y generador de plantillas oficiales en formato Excel
          </p>
        </div>

        <Button
          variant="success"
          size="md"
          isLoading={isExporting}
          onClick={handleExport}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Descargar Archivo SIAGIE (.xlsx)
        </Button>
      </div>

      {/* Filter and Validation Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-outline-variant/30 shadow-card grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        <Select
          label="Filtrar por Aula / Sección"
          value={selectedSeccion}
          onChange={(e) => setSelectedSeccion(e.target.value)}
        >
          <option value="todas">Todas las Secciones del Colegio</option>
          {secciones.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre} ({s.nivel})
            </option>
          ))}
        </Select>

        <Select
          label="Periodo de Evaluación"
          value={selectedPeriodo}
          onChange={(e) => setSelectedPeriodo(e.target.value)}
        >
          <option value="Bimestre 1">Bimestre 1</option>
          <option value="Bimestre 2">Bimestre 2</option>
          <option value="Bimestre 3">Bimestre 3</option>
          <option value="Bimestre 4">Bimestre 4</option>
        </Select>

        <Button
          variant="outline"
          size="md"
          isLoading={isValidating}
          onClick={runValidation}
          leftIcon={<RefreshCw className="w-4 h-4" />}
          className="h-[42px]"
        >
          Volver a Validar
        </Button>
      </div>

      {/* Validation KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Estado de Consistencia"
          value={resultado?.esValido ? 'Apto para SIAGIE' : 'Observaciones'}
          subtitle={resultado?.esValido ? 'Cumple todas las reglas MINEDU' : 'Requiere corrección previa'}
          variant={resultado?.esValido ? 'success' : 'warning'}
          icon={<ShieldCheck className="w-6 h-6" />}
        />

        <StatsCard
          title="Alumnos Auditados"
          value={`${resultado?.totalAlumnos || 0} Estudiantes`}
          subtitle="Nómina cargada en sistema"
          variant="primary"
          icon={<FileSpreadsheet className="w-6 h-6" />}
        />

        <StatsCard
          title="Inconsistencias Detectadas"
          value={`${resultado?.inconsistencias.length || 0}`}
          subtitle={`${resultado?.totalErrores || 0} errores críticos`}
          variant={resultado?.totalErrores ? 'warning' : 'success'}
          icon={<AlertTriangle className="w-6 h-6" />}
        />
      </div>

      {/* Consistency Checklist Results */}
      <Card>
        <CardHeader className="bg-surface flex flex-row items-center justify-between">
          <CardTitle className="text-base">Checklist de Reglas de Consistencia SIAGIE v3.0</CardTitle>
          <Badge variant={resultado?.esValido ? 'success' : 'warning'}>
            {resultado?.esValido ? '100% VÁLIDO' : 'ACCIONES PENDIENTES'}
          </Badge>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-surface-container/60 border-b border-surface-container text-on-surface-variant font-semibold text-[11px] uppercase tracking-wider">
                <th className="p-4">Tipo</th>
                <th className="p-4">Estudiante / Aula</th>
                <th className="p-4">DNI</th>
                <th className="p-4">Inconsistencia Detectada</th>
                <th className="p-4">Acción Sugerida</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {resultado?.inconsistencias.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-emerald-800 bg-emerald-50/50">
                    <div className="flex flex-col items-center gap-2">
                      <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                      <p className="font-bold">¡Todos los registros son 100% consistentes con las directivas del MINEDU!</p>
                      <p className="text-xs text-on-surface-variant">Puede proceder con la descarga del archivo Excel sin riesgo de rechazo en el portal SIAGIE.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                resultado?.inconsistencias.map((inc) => (
                  <tr key={inc.id} className="hover:bg-surface-container/20 transition-colors">
                    <td className="p-4">
                      <Badge variant={inc.tipo === 'error' ? 'error' : 'warning'} size="sm">
                        {inc.tipo.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-primary">{inc.alumno}</p>
                      <p className="text-xs text-on-surface-variant">{inc.seccion}</p>
                    </td>
                    <td className="p-4 font-mono text-xs">{inc.dni}</td>
                    <td className="p-4 text-xs font-medium text-on-surface max-w-sm">
                      {inc.descripcion}
                    </td>
                    <td className="p-4 text-xs text-on-surface-variant max-w-xs">
                      {inc.accionSugerida}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
