'use client'

import React, { useState } from 'react'
import {
  Clock,
  CheckCircle2,
  Calendar,
  UserCheck,
  Sparkles,
  Save,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminAsistenciaPersonalPage() {
  const [horaMarcacion, setHoraMarcacion] = useState('07:55 AM')
  const [marcado, setMarcado] = useState(false)

  const personal = [
    { id: 'p1', nombre: 'Sor María del Carmen Rodríguez', cargo: 'Directora General', hora_ingreso: '07:45 AM', estado: 'Puntual' },
    { id: 'p2', nombre: 'Lic. Patricia Valenzuela', cargo: 'Secretaría Académica', hora_ingreso: '07:50 AM', estado: 'Puntual' },
    { id: 'p3', nombre: 'Prof. Carlos García Silva', cargo: 'Docente de Matemática', hora_ingreso: '07:55 AM', estado: 'Puntual' },
    { id: 'p4', nombre: 'Aux. Pedro Huamán', cargo: 'Auxiliar de Educación', hora_ingreso: '07:30 AM', estado: 'Puntual' },
    { id: 'p5', nombre: 'Lic. Andrés Salgado', cargo: 'Psicólogo Escolar', hora_ingreso: '08:05 AM', estado: 'Tardanza' },
  ]

  const handleMarcar = () => {
    setMarcado(true)
    setTimeout(() => setMarcado(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
              RF-046
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Control Biométrico / Asistencia</span>
          </div>
          <h1 className="text-xl font-bold text-primary mt-1">
            Asistencia de Personal Docente y Administrativo
          </h1>
          <p className="text-xs text-on-surface-variant">
            Registro de ingreso y salida diaria del personal del colegio.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={handleMarcar}
          leftIcon={<Clock className="w-4 h-4" />}
        >
          Marcar Mi Ingreso / Salida
        </Button>
      </div>

      {marcado && (
        <div className="p-4 rounded-xl bg-success-container text-success text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>Marcación de asistencia registrada exitosamente a las {new Date().toLocaleTimeString()}.</span>
        </div>
      )}

      {/* Tabla de Personal */}
      <div className="bg-white rounded-2xl border border-outline-variant/30 shadow-soft overflow-hidden">
        <div className="p-4 border-b border-surface-container flex items-center justify-between">
          <h3 className="text-xs font-bold text-primary">Registro de Hoy — {new Date().toISOString().split('T')[0]}</h3>
          <span className="text-xs text-on-surface-variant">5 Integrantes registrados</span>
        </div>

        <div className="divide-y divide-surface-container">
          {personal.map((p) => (
            <div key={p.id} className="p-4 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-primary block">{p.nombre}</span>
                <span className="text-[11px] text-on-surface-variant">{p.cargo}</span>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <span className="font-mono text-primary">{p.hora_ingreso}</span>
                <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                  p.estado === 'Puntual' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {p.estado}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
