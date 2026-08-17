'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bell, Search, Filter, CheckCircle2, FileText, Calendar, MessageSquare } from 'lucide-react'
import { dataStore, type Comunicado } from '@/lib/mock-data'
import { formatDate } from '@/lib/utils'

export default function PadreComunicadosPage() {
  const [comunicados, setComunicados] = useState<Comunicado[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('todas')
  const [readIds, setReadIds] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const comList = dataStore.getComunicados()
    setComunicados(comList)
  }, [])

  const toggleRead = (id: string) => {
    setReadIds(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const filtered = comunicados.filter((c) => {
    const matchesSearch = c.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || c.contenido.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'todas' || c.categoria.toLowerCase() === selectedCategory.toLowerCase()
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-primary tracking-tight">
          Comunicados y Circulares Institucionales
        </h2>
        <p className="text-xs sm:text-sm text-on-surface-variant">
          Canal oficial de noticias, eventos escolares y avisos de dirección
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full">
          <Input
            placeholder="Buscar por palabra clave en comunicados..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
          {['todas', 'Circular', 'Evento', 'Académico'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-on-surface-variant hover:bg-surface-container border border-outline-variant/30'
              }`}
            >
              {cat === 'todas' ? 'Todos los Avisos' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Feed of Notices */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-on-surface-variant space-y-2">
              <Bell className="w-8 h-8 text-outline mx-auto" />
              <p className="text-sm font-semibold">No se encontraron comunicados con los filtros seleccionados.</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((com) => {
            const isRead = !!readIds[com.id]
            return (
              <Card key={com.id} className={`transition-all ${isRead ? 'opacity-85' : 'border-l-4 border-l-secondary'}`}>
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
                    </div>

                    <button
                      onClick={() => toggleRead(com.id)}
                      className={`text-xs font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors ${
                        isRead
                          ? 'bg-success-container text-success border-success/30'
                          : 'bg-surface-container text-on-surface-variant hover:bg-primary/10 hover:text-primary border-outline-variant/30'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isRead ? 'Leído' : 'Confirmar Lectura'}</span>
                    </button>
                  </div>
                  <CardTitle className="text-base sm:text-lg mt-2">{com.titulo}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-3">
                  <p className="text-xs sm:text-sm text-on-surface leading-relaxed whitespace-pre-line">
                    {com.contenido}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-surface-container text-xs text-on-surface-variant">
                    <span className="font-medium">Emitido por: {com.autor_nombre}</span>
                    {com.enviar_whatsapp && (
                      <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 font-semibold flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
                        Notificado a {com.whatsapp_enviados} apoderados por WhatsApp
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
