'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpenCheck, CalendarCheck2, Users, Clock, GraduationCap, ChevronRight, Sparkles } from 'lucide-react'
import { dataStore, type SeccionCurso, type Alumno } from '@/lib/mock-data'

export default function DocenteSeccionesPage() {
  const [seccionesCursos, setSeccionesCursos] = useState<SeccionCurso[]>([])
  const [alumnos, setAlumnos] = useState<Alumno[]>([])

  useEffect(() => {
    // Filtrar cursos a cargo del docente García
    const scList = dataStore.getSeccionesCursos().filter(sc => sc.docente_id === 'usr-doc-1')
    setSeccionesCursos(scList)
    setAlumnos(dataStore.getAlumnos())
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-container p-6 sm:p-8 rounded-2xl text-white shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-emerald-300 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Año Lectivo 2026 — Área de Matemática</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Mis Secciones y Cursos Asignados
          </h2>
          <p className="text-xs sm:text-sm text-surface-container/80 max-w-xl">
            Bienvenido, Prof. Carlos Alberto García Silva. Seleccione un aula para iniciar el registro pedagógico de evaluaciones o asistencia.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/docente/notas">
            <Button variant="secondary" size="md" leftIcon={<BookOpenCheck className="w-4 h-4" />}>
              Calificaciones
            </Button>
          </Link>
          <Link href="/docente/asistencia">
            <Button variant="outline" size="md" className="bg-white/10 text-white border-white/20 hover:bg-white/20" leftIcon={<CalendarCheck2 className="w-4 h-4" />}>
              Asistencia
            </Button>
          </Link>
        </div>
      </div>

      {/* Sections Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {seccionesCursos.map((sc) => {
          const sectionAlumnos = alumnos.filter(a => a.seccion_id === sc.seccion_id)
          const isPrimaria = sc.seccion_nombre.includes('Primaria')

          return (
            <Card key={sc.id} className="hover:shadow-soft transition-all duration-200 flex flex-col justify-between group">
              <CardHeader className="bg-surface pb-3">
                <div className="flex items-center justify-between">
                  <Badge variant={isPrimaria ? 'primary' : 'secondary'} size="sm">
                    {isPrimaria ? 'Primaria' : 'Secundaria'}
                  </Badge>
                  <span className="text-xs text-on-surface-variant font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-outline" />
                    {sc.horas_semanales} hrs/sem
                  </span>
                </div>
                <CardTitle className="text-lg mt-2 group-hover:text-secondary transition-colors">
                  {sc.seccion_nombre}
                </CardTitle>
                <p className="text-xs text-on-surface-variant font-semibold">
                  Curso: {sc.curso_nombre}
                </p>
              </CardHeader>

              <CardContent className="space-y-4 pt-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-surface-container">
                    <span className="text-on-surface-variant flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-outline" />
                      Total de Alumnos:
                    </span>
                    <span className="font-bold text-primary">{sectionAlumnos.length} inscritos</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-surface-container">
                    <span className="text-on-surface-variant flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-outline" />
                      Evaluaciones Bimestre 1:
                    </span>
                    <Badge variant="success" size="sm">En Progreso</Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link href={`/docente/notas?seccion=${sc.seccion_id}`}>
                    <Button variant="primary" size="sm" className="w-full text-xs" leftIcon={<BookOpenCheck className="w-3.5 h-3.5" />}>
                      Notas
                    </Button>
                  </Link>
                  <Link href={`/docente/asistencia?seccion=${sc.seccion_id}`}>
                    <Button variant="outline" size="sm" className="w-full text-xs" leftIcon={<CalendarCheck2 className="w-3.5 h-3.5" />}>
                      Asistencia
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
