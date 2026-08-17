'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { Input, Select } from '@/components/ui/input'
import { Bell, Plus, Send, MessageSquare, CheckCircle2, Calendar, Users } from 'lucide-react'
import { dataStore, type Comunicado } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'

export default function AdminComunicadosPage() {
  const [comunicados, setComunicados] = useState<Comunicado[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  // Form State
  const [titulo, setTitulo] = useState('')
  const [contenido, setContenido] = useState('')
  const [categoria, setCategoria] = useState<'Circular' | 'Evento' | 'Aviso urgente' | 'Académico'>('Circular')
  const [destinatarios, setDestinatarios] = useState('todos')
  const [enviarWhatsapp, setEnviarWhatsapp] = useState(true)

  const loadData = () => {
    setComunicados(dataStore.getComunicados())
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSendComunicado = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)

    setTimeout(() => {
      const whatsappCount = enviarWhatsapp ? (destinatarios === 'todos' ? 185 : destinatarios === 'primaria' ? 95 : 45) : 0

      dataStore.addComunicado({
        id: `com-${Date.now()}`,
        titulo,
        contenido,
        categoria,
        destinatarios,
        autor_nombre: 'Lic. Patricia Valenzuela (Secretaría)',
        enviar_whatsapp: enviarWhatsapp,
        whatsapp_enviados: whatsappCount,
        created_at: new Date().toISOString(),
      })

      setIsSending(false)
      setIsModalOpen(false)
      loadData()
      setToastMsg(`Comunicado emitido y difundido a ${whatsappCount} apoderados.`)
      setTimeout(() => setToastMsg(null), 3000)

      setTitulo('')
      setContenido('')
    }, 900)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-primary tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-secondary" />
            <span>Emisión de Comunicados & WhatsApp</span>
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant">
            Publicación institucional segmentada con integración de WhatsApp Business API
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
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Redactar Comunicado
          </Button>
        </div>
      </div>

      {/* Notices Feed */}
      <div className="space-y-4">
        {comunicados.map((com) => (
          <Card key={com.id}>
            <CardHeader className="bg-surface pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      com.categoria === 'Circular'
                        ? 'primary'
                        : com.categoria === 'Evento'
                        ? 'secondary'
                        : 'warning'
                    }
                    size="md"
                  >
                    {com.categoria}
                  </Badge>
                  <span className="text-xs text-on-surface-variant flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-outline" />
                    {formatDate(com.created_at)}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-surface-container text-primary uppercase">
                    Destino: {com.destinatarios}
                  </span>
                </div>

                {com.enviar_whatsapp && (
                  <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold text-xs flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {com.whatsapp_enviados} WhatsApps entregados
                  </span>
                )}
              </div>
              <CardTitle className="text-lg mt-2">{com.titulo}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-3">
              <p className="text-xs sm:text-sm text-on-surface leading-relaxed whitespace-pre-line">
                {com.contenido}
              </p>
              <div className="pt-2 border-t border-surface-container text-xs text-on-surface-variant font-medium">
                Publicado por: {com.autor_nombre}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal: New Notice */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Redactar Comunicado Institucional"
        description="El comunicado aparecerá en el portal de apoderados y se enviará por WhatsApp."
        maxWidth="lg"
      >
        <form onSubmit={handleSendComunicado} className="space-y-4">
          <Input
            label="Título del Comunicado"
            placeholder="Ej. Suspensión de Clases por Jornada Pedagógica"
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Categoría"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value as any)}
            >
              <option value="Circular">Circular Oficial</option>
              <option value="Evento">Evento Escolar</option>
              <option value="Aviso urgente">Aviso Urgente</option>
              <option value="Académico">Académico</option>
            </Select>

            <Select
              label="Destinatarios"
              value={destinatarios}
              onChange={(e) => setDestinatarios(e.target.value)}
            >
              <option value="todos">Todos los Apoderados (Colegio Completo)</option>
              <option value="primaria">Solo Nivel Primaria</option>
              <option value="secundaria">Solo Nivel Secundaria</option>
              <option value="sec-3a-pri">Solo 3ro A Primaria</option>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-primary uppercase tracking-wider">
              Contenido del Comunicado
            </label>
            <textarea
              required
              rows={5}
              placeholder="Redacte el texto oficial..."
              value={contenido}
              onChange={(e) => setContenido(e.target.value)}
              className="w-full bg-white border border-outline-variant/60 rounded-lg p-3 text-xs sm:text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
            <input
              type="checkbox"
              id="chk-whatsapp"
              checked={enviarWhatsapp}
              onChange={(e) => setEnviarWhatsapp(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
            />
            <label htmlFor="chk-whatsapp" className="text-xs font-bold text-emerald-950 cursor-pointer">
              Disparar notificación automática vía WhatsApp Cloud API
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/30">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" isLoading={isSending} leftIcon={<Send className="w-4 h-4" />}>
              Publicar y Enviar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
