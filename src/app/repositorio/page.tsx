'use client'

import React, { useState, useEffect } from 'react'
import {
  BookOpen,
  Plus,
  Download,
  Search,
  Filter,
  FileText,
  Video,
  Layers,
  Sparkles,
  Upload,
  Check
} from 'lucide-react'
import { dataStore, LibroMaterial, UserRole } from '@/lib/mock-data'
import { Sidebar } from '@/components/shared/sidebar'
import { Navbar } from '@/components/shared/navbar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Modal } from '@/components/ui/modal'

export default function RepositorioDigitalPage() {
  const [libros, setLibros] = useState<LibroMaterial[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNivel, setSelectedNivel] = useState<'Todos' | 'Inicial' | 'Primaria' | 'Secundaria'>('Todos')
  const [userRole, setUserRole] = useState<UserRole>('docente')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Modal para que docentes o administrativos suban material (RF-092)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [titulo, setTitulo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [tipo, setTipo] = useState<LibroMaterial['tipo']>('libro')
  const [nivel, setNivel] = useState<'Inicial' | 'Primaria' | 'Secundaria'>('Primaria')
  const [grado, setGrado] = useState('3ro')
  const [cursoNombre, setCursoNombre] = useState('Matemática y Razonamiento')
  const [bimestre, setBimestre] = useState<'I' | 'II' | 'III' | 'IV'>('I')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    setLibros(dataStore.getLibrosMaterial())
    const roleCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('sedes_demo_role='))
      ?.split('=')[1] as UserRole
    if (roleCookie) setUserRole(roleCookie)
  }, [])

  const canUpload = userRole === 'docente' || userRole === 'administrativo' || userRole === 'director'

  const filtered = libros.filter((l) => {
    const matchSearch = l.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.curso_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    const matchNivel = selectedNivel === 'Todos' || l.nivel === selectedNivel
    return matchSearch && matchNivel
  })

  const handleSubirMaterial = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      dataStore.addLibroMaterial({
        titulo,
        descripcion,
        tipo,
        nivel,
        grado,
        curso_nombre: cursoNombre,
        bimestre,
        url_descarga: `/recursos/${titulo.toLowerCase().replace(/\s+/g, '_')}.pdf`,
        tamano_mb: '14.2 MB',
        subido_por_rol: 'docente',
        autor: 'Prof. Carlos García Silva',
      })

      setLibros(dataStore.getLibrosMaterial())
      setSuccessMessage('Libro/Material publicado exitosamente en el repositorio digital.')
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
    <div className="min-h-screen bg-surface flex">
      <Sidebar role={userRole} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <Navbar onOpenSidebar={() => setSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                  RF-090 a RF-092
                </span>
                <span className="text-xs text-on-surface-variant font-medium">Biblioteca Digital Institucional</span>
              </div>
              <h1 className="text-xl font-bold text-primary mt-1">
                Repositorio de Libros y Material Educativo
              </h1>
              <p className="text-xs text-on-surface-variant">
                Descargue textos escolares oficiales, separatas, guías prácticas y material por curso y bimestre.
              </p>
            </div>

            {canUpload && (
              <Button
                variant="primary"
                onClick={() => setIsModalOpen(true)}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Subir Libro / Material (RF-092)
              </Button>
            )}
          </div>

          {/* Filtros de Nivel y Búsqueda */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-outline-variant/30 shadow-soft">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {(['Todos', 'Inicial', 'Primaria', 'Secundaria'] as const).map((niv) => (
                <button
                  key={niv}
                  onClick={() => setSelectedNivel(niv)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    selectedNivel === niv
                      ? 'bg-primary text-white shadow'
                      : 'bg-surface-container/60 hover:bg-surface-container text-on-surface'
                  }`}
                >
                  {niv}
                </button>
              ))}
            </div>

            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar por título, curso o autor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-outline-variant/60 text-xs text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Grid de Libros y Material */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-outline-variant/30 shadow-soft p-5 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-primary/10 text-primary">
                      {item.tipo.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-on-surface-variant font-bold">
                      {item.grado} {item.nivel} • Bim. {item.bimestre}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-primary group-hover:text-secondary transition-colors">
                    {item.titulo}
                  </h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                    {item.descripcion}
                  </p>
                </div>

                <div className="pt-3 border-t border-surface-container flex items-center justify-between">
                  <div className="text-[11px] text-on-surface-variant">
                    <span className="block font-semibold text-primary">{item.curso_nombre}</span>
                    <span>{item.tamano_mb}</span>
                  </div>

                  <a
                    href={item.url_descarga}
                    download
                    className="px-3.5 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar</span>
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Modal Subir Material */}
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Publicar Libro o Material en el Repositorio (RF-092)"
          >
            <form onSubmit={handleSubirMaterial} className="space-y-4">
              <Input
                label="Título del Libro o Documento"
                type="text"
                required
                placeholder="Ej: Texto Escolar de Razonamiento Matemático 3°"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary">
                    Nivel
                  </label>
                  <select
                    value={nivel}
                    onChange={(e) => setNivel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface-container/50 text-xs font-semibold text-primary"
                  >
                    <option value="Inicial">Inicial</option>
                    <option value="Primaria">Primaria</option>
                    <option value="Secundaria">Secundaria</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary">
                    Grado
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: 3ro"
                    value={grado}
                    onChange={(e) => setGrado(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface-container/50 text-xs font-semibold text-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Curso Asignado"
                  type="text"
                  required
                  placeholder="Ej: Matemática"
                  value={cursoNombre}
                  onChange={(e) => setCursoNombre(e.target.value)}
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
                  Descripción y Contenido del Material
                </label>
                <textarea
                  required
                  rows={3}
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant/60 bg-surface-container/50 text-xs text-primary"
                />
              </div>

              <div className="p-4 rounded-xl border-2 border-dashed border-outline-variant/60 bg-surface-container/30 text-center space-y-1.5">
                <Upload className="w-5 h-5 text-secondary mx-auto" />
                <p className="text-xs font-semibold text-primary">Archivo PDF / Multimedia seleccionado</p>
                <p className="text-[10px] text-on-surface-variant">Hasta 50MB</p>
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
                  Publicar en Repositorio
                </Button>
              </div>
            </form>
          </Modal>
        </main>
      </div>
    </div>
  )
}
