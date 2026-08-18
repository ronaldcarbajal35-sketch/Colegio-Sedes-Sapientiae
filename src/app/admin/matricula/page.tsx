'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input, Select } from '@/components/ui/input'
import { School, Search, Plus, CheckCircle2, FileText, Download, Eye, Sparkles, UserPlus } from 'lucide-react'
import { dataStore, type Matricula, type Alumno } from '@/lib/mock-data'
import { formatCurrency, formatDate } from '@/lib/utils'

export default function AdminMatriculaPage() {
  const [matriculas, setMatriculas] = useState<Matricula[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterEstado, setFilterEstado] = useState('todos')
  const [isNewModalOpen, setIsNewModalOpen] = useState(false)
  const [selectedMatricula, setSelectedMatricula] = useState<Matricula | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isSuccessToast, setIsSuccessToast] = useState<string | null>(null)

  // Form State for new matricula
  const [formNombres, setFormNombres] = useState('')
  const [formApellidos, setFormApellidos] = useState('')
  const [formDni, setFormDni] = useState('')
  const [formFechaNac, setFormFechaNac] = useState('2018-05-10')
  const [formGrado, setFormGrado] = useState('1ro Primaria')
  const [formApoderado, setFormApoderado] = useState('')
  const [formTelefono, setFormTelefono] = useState('')

  const loadData = () => {
    setMatriculas(dataStore.getMatriculas())
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleUpdateEstado = (id: string, nuevoEstado: 'postulante' | 'en_evaluacion' | 'matriculado' | 'retirado') => {
    dataStore.updateMatriculaEstado(id, nuevoEstado)
    loadData()
    if (selectedMatricula && selectedMatricula.id === id) {
      setSelectedMatricula({ ...selectedMatricula, estado: nuevoEstado })
    }
    setIsSuccessToast(`Estado actualizado a: ${nuevoEstado.toUpperCase()}`)
    setTimeout(() => setIsSuccessToast(null), 2500)
  }

  const handleCreateMatricula = (e: React.FormEvent) => {
    e.preventDefault()

    const newAluId = `alu-${Date.now()}`
    const newMatId = `mat-${Date.now()}`

    // 1. Guardar alumno
    dataStore.addAlumno({
      id: newAluId,
      nombres: formNombres,
      apellidos: formApellidos,
      dni: formDni,
      fecha_nacimiento: formFechaNac,
      genero: 'M',
      apoderado_id: 'usr-pad-1',
      apoderado_nombre: formApoderado,
      apoderado_telefono: formTelefono,
      seccion_id: 'sec-3a-pri',
      seccion_nombre: formGrado,
      codigo_estudiante: `EST-2026-${Math.floor(100 + Math.random() * 900)}`,
    })

    // 2. Guardar matrícula
    dataStore.addMatricula({
      id: newMatId,
      alumno_id: newAluId,
      alumno_nombre: `${formNombres} ${formApellidos}`,
      dni: formDni,
      grado_postula: formGrado,
      nivel: formGrado.includes('Secundaria') ? 'Secundaria' : 'Primaria',
      anio_escolar: 2026,
      estado: 'matriculado',
      documentos: ['dni_menor.pdf', 'dni_apoderado.pdf', 'ficha_vacunacion.pdf'],
      costo_matricula: 350.00,
      created_at: new Date().toISOString().split('T')[0],
    })

    setIsNewModalOpen(false)
    loadData()
    setIsSuccessToast(`¡Matrícula registrada exitosamente para ${formNombres}!`)
    setTimeout(() => setIsSuccessToast(null), 3000)

    // Limpiar formulario
    setFormNombres('')
    setFormApellidos('')
    setFormDni('')
    setFormApoderado('')
    setFormTelefono('')
  }

  const filtered = matriculas.filter((m) => {
    const matchesSearch = m.alumno_nombre.toLowerCase().includes(searchTerm.toLowerCase()) || m.dni.includes(searchTerm)
    const matchesEstado = filterEstado === 'todos' || m.estado === filterEstado
    return matchesSearch && matchesEstado
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-primary tracking-tight flex items-center gap-2">
            <School className="w-6 h-6 text-secondary" />
            <span>Módulo de Matrícula & Admisión 2026</span>
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Administración de postulaciones, revisión de expedientes y registro de matrícula
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isSuccessToast && (
            <div className="px-3.5 py-1.5 rounded-xl bg-success-container text-success border border-success/30 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSuccessToast}</span>
            </div>
          )}

          <Button
            variant="primary"
            size="md"
            onClick={() => setIsNewModalOpen(true)}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Nueva Matrícula
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-outline-variant/30 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Buscar alumno por nombre o DNI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {['todos', 'postulante', 'en_evaluacion', 'matriculado'].map((est) => (
            <button
              key={est}
              onClick={() => setFilterEstado(est)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap capitalize ${
                filterEstado === est
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-on-surface-variant hover:bg-surface-container border border-outline-variant/30'
              }`}
            >
              {est === 'todos' ? 'Todos los Estados' : est.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Enrollment Table */}
      <Card>
        <CardHeader className="bg-surface flex flex-row items-center justify-between">
          <CardTitle className="text-base">Padrón de Matrícula — {filtered.length} Registros</CardTitle>
          <span className="text-xs font-semibold text-primary">Año Lectivo 2026</span>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-surface-container/60 border-b border-surface-container text-on-surface-variant font-semibold text-[11px] uppercase tracking-wider">
                <th className="p-4">Estudiante Postulante</th>
                <th className="p-4">DNI</th>
                <th className="p-4">Grado / Nivel</th>
                <th className="p-4">Expediente</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {filtered.map((mat) => (
                <tr key={mat.id} className="hover:bg-surface-container/20 transition-colors">
                  <td className="p-4 font-bold text-primary">
                    {mat.alumno_nombre}
                  </td>
                  <td className="p-4 font-mono text-on-surface-variant">{mat.dni}</td>
                  <td className="p-4 font-medium text-on-surface">{mat.grado_postula}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container text-primary font-semibold text-xs">
                      <FileText className="w-3.5 h-3.5" />
                      {mat.documentos.length} docs
                    </span>
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={
                        mat.estado === 'matriculado'
                          ? 'success'
                          : mat.estado === 'en_evaluacion'
                          ? 'warning'
                          : 'default'
                      }
                      size="md"
                      dot
                    >
                      {mat.estado.toUpperCase().replace('_', ' ')}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedMatricula(mat)
                          setIsDetailModalOpen(true)
                        }}
                        leftIcon={<Eye className="w-3.5 h-3.5" />}
                      >
                        Expediente
                      </Button>

                      {mat.estado !== 'matriculado' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleUpdateEstado(mat.id, 'matriculado')}
                          leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                        >
                          Matricular
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Modal: Ver Expediente & Cambiar Estado */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Expediente de Matrícula y Admisión"
        description="Revisión documental del postulante"
      >
        {selectedMatricula && (
          <div className="space-y-4">
            <div className="bg-surface-container/60 p-4 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Postulante:</span>
                <span className="font-bold text-primary">{selectedMatricula.alumno_nombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">DNI:</span>
                <span className="font-mono font-semibold">{selectedMatricula.dni}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Grado y Nivel:</span>
                <span className="font-semibold">{selectedMatricula.grado_postula}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Costo Matrícula:</span>
                <span className="font-bold text-primary">{formatCurrency(selectedMatricula.costo_matricula)}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2">
                Documentos Adjuntos (Supabase Storage):
              </h4>
              <div className="space-y-1.5">
                {selectedMatricula.documentos.map((doc: string, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-white border border-outline-variant/30 rounded-lg text-xs">
                    <span className="font-medium text-primary flex items-center gap-2">
                      <FileText className="w-4 h-4 text-secondary" />
                      {doc}
                    </span>
                    <Badge variant="success" size="sm">Verificado</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-outline-variant/30 flex justify-between items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-on-surface-variant">Cambiar Estado:</span>
                <select
                  value={selectedMatricula.estado}
                  onChange={(e) => handleUpdateEstado(selectedMatricula.id, e.target.value as any)}
                  className="bg-white border border-outline-variant/60 rounded-lg p-1.5 text-xs font-bold text-primary cursor-pointer"
                >
                  <option value="postulante">Postulante</option>
                  <option value="en_evaluacion">En Evaluación</option>
                  <option value="matriculado">Matriculado</option>
                  <option value="retirado">Retirado</option>
                </select>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => window.print()}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Imprimir Ficha FUM
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal: Nueva Matrícula Form */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Registrar Nueva Matrícula / Postulación"
        description="Crea el expediente y genera usuario apoderado automáticamente"
      >
        <form onSubmit={handleCreateMatricula} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Nombres del Estudiante"
              placeholder="Ej. Santiago"
              required
              value={formNombres}
              onChange={(e) => setFormNombres(e.target.value)}
            />
            <Input
              label="Apellidos del Estudiante"
              placeholder="Ej. Ramos Mendoza"
              required
              value={formApellidos}
              onChange={(e) => setFormApellidos(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="DNI del Menor (8 dígitos)"
              placeholder="Ej. 78999888"
              maxLength={8}
              required
              value={formDni}
              onChange={(e) => setFormDni(e.target.value)}
            />
            <Input
              label="Fecha de Nacimiento"
              type="date"
              required
              value={formFechaNac}
              onChange={(e) => setFormFechaNac(e.target.value)}
            />
          </div>

          <Select
            label="Grado a Postular / Matricular"
            value={formGrado}
            onChange={(e) => setFormGrado(e.target.value)}
          >
            <option value="1ro Primaria">1ro Primaria</option>
            <option value="3ro A Primaria">3ro A Primaria</option>
            <option value="4to A Primaria">4to A Primaria</option>
            <option value="1ro A Secundaria">1ro A Secundaria</option>
            <option value="5to B Secundaria">5to B Secundaria</option>
          </Select>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Nombre del Apoderado"
              placeholder="Ej. Manuel Ramos"
              required
              value={formApoderado}
              onChange={(e) => setFormApoderado(e.target.value)}
            />
            <Input
              label="Teléfono WhatsApp Apoderado"
              placeholder="Ej. 987654321"
              required
              value={formTelefono}
              onChange={(e) => setFormTelefono(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/30">
            <Button type="button" variant="outline" onClick={() => setIsNewModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" leftIcon={<CheckCircle2 className="w-4 h-4" />}>
              Completar y Registrar Matrícula
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
