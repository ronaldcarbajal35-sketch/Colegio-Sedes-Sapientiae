'use client'

import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input, Select } from '@/components/ui/input'
import { Users2, Search, UserPlus, ShieldCheck, Mail, Phone, Lock, CheckCircle2 } from 'lucide-react'
import { DEMO_PROFILES, type DemoUser } from '@/components/shared/role-switcher-banner'
import { UserRole } from '@/lib/mock-data'

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState<DemoUser[]>(DEMO_PROFILES)
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('todos')
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  // Form State
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [rol, setRol] = useState<UserRole>('docente')
  const [cargo, setCargo] = useState('')
  const [telefono, setTelefono] = useState('')

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault()

    const newUser: DemoUser = {
      id: `usr-${Date.now()}`,
      nombre,
      email,
      rol,
      cargo: cargo || (rol === 'docente' ? 'Docente de Aula' : rol === 'padre' ? 'Apoderado' : 'Personal Administrativo'),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&q=80',
      defaultRoute: rol === 'director' ? '/director/dashboard' : rol === 'administrativo' ? '/admin/dashboard' : rol === 'docente' ? '/docente/secciones' : rol === 'auxiliar' ? '/auxiliar/asistencia' : rol === 'psicologo' ? '/psicologia/atenciones' : rol === 'padre' ? '/padre/dashboard' : '/alumno/dashboard',
      badgeColor: 'bg-primary/10 text-primary border-primary/20',
    }

    setUsers(prev => [newUser, ...prev])
    setIsModalOpen(false)
    setToastMsg(`Usuario ${nombre} creado en auth.users y perfiles.`)
    setTimeout(() => setToastMsg(null), 3000)

    setNombre('')
    setEmail('')
    setCargo('')
    setTelefono('')
  }

  const filtered = users.filter((u) => {
    const matchesSearch = u.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRoleFilter === 'todos' || u.rol === selectedRoleFilter
    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-primary tracking-tight flex items-center gap-2">
            <Users2 className="w-6 h-6 text-secondary" />
            <span>Gestión de Cuentas y 7 Roles Institucionales</span>
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Administración de credenciales de los 7 roles vinculadas a <code>auth.users</code> y <code>perfiles</code> (RF-001, RF-002)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {toastMsg && (
            <div className="px-3.5 py-1.5 rounded-xl bg-success-container text-success border border-success/30 text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>{toastMsg}</span>
            </div>
          )}

          <Button
            variant="primary"
            size="md"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Nuevo Usuario
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-outline-variant/30 shadow-card flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Buscar por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {['todos', 'director', 'administrativo', 'docente', 'auxiliar', 'psicologo', 'padre', 'alumno'].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRoleFilter(r)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap capitalize ${
                selectedRoleFilter === r
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-on-surface-variant hover:bg-surface-container border border-outline-variant/30'
              }`}
            >
              {r === 'todos' ? 'Todos los Roles' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader className="bg-surface flex flex-row items-center justify-between">
          <CardTitle className="text-base">Padrón de Usuarios del Sistema — {filtered.length} Cuentas</CardTitle>
          <span className="text-xs text-on-surface-variant font-medium">Supabase Auth Provider</span>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-surface-container/60 border-b border-surface-container text-on-surface-variant font-semibold text-[11px] uppercase tracking-wider">
                <th className="p-4">Usuario</th>
                <th className="p-4">Correo Electrónico</th>
                <th className="p-4">Rol en Sistema</th>
                <th className="p-4">Cargo Institucional</th>
                <th className="p-4 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-surface-container/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20">
                        {user.nombre.charAt(0)}
                      </div>
                      <span className="font-bold text-primary">{user.nombre}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-on-surface-variant text-xs">{user.email}</td>
                  <td className="p-4">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${user.badgeColor}`}>
                      {user.rol}
                    </span>
                  </td>
                  <td className="p-4 text-on-surface-variant text-xs">{user.cargo}</td>
                  <td className="p-4 text-center">
                    <Badge variant="success" size="sm" dot>Activo</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Modal: New User */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Crear Nuevo Usuario Institucional (RF-001)"
        description="Genera la cuenta en el sistema para cualquiera de los 7 roles"
      >
        <form onSubmit={handleCreateUser} className="space-y-4">
          <Input
            label="Nombre Completo"
            placeholder="Ej. Lic. Manuel Benítez"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <Input
            label="Correo Electrónico"
            type="email"
            placeholder="ejemplo@sedes.edu.pe"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Rol del Usuario"
              value={rol}
              onChange={(e) => setRol(e.target.value as UserRole)}
            >
              <option value="director">Director</option>
              <option value="administrativo">Administrativo / Secretaría</option>
              <option value="docente">Docente</option>
              <option value="auxiliar">Auxiliar</option>
              <option value="psicologo">Psicólogo</option>
              <option value="padre">Padre de Familia</option>
              <option value="alumno">Alumno</option>
            </Select>

            <Input
              label="Teléfono Móvil"
              placeholder="Ej. 987654321"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
            />
          </div>

          <Input
            label="Cargo o Especialidad"
            placeholder="Ej. Docente de Ciencias / Apoderado / Auxiliar de Primaria"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/30">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" leftIcon={<CheckCircle2 className="w-4 h-4" />}>
              Crear y Habilitar Usuario
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
