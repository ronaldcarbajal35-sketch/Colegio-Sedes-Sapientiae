'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FileText,
  QrCode,
  AlertTriangle,
  Users2,
  School,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  MessageSquare
} from 'lucide-react'
import { dataStore, Seccion, ComprobantePago, FUT, Pago } from '@/lib/mock-data'

export default function AdminDashboardPage() {
  const [secciones, setSecciones] = useState<Seccion[]>([])
  const [comprobantes, setComprobantes] = useState<ComprobantePago[]>([])
  const [futs, setFuts] = useState<FUT[]>([])
  const [pagos, setPagos] = useState<Pago[]>([])

  useEffect(() => {
    setSecciones(dataStore.getSecciones())
    setComprobantes(dataStore.getComprobantes())
    setFuts(dataStore.getFuts())
    setPagos(dataStore.getPagos())
  }, [])

  const comprobantesPendientes = comprobantes.filter(c => c.estado === 'pendiente')
  const futsEnProceso = futs.filter(f => f.estado === 'en_proceso')
  const deudoresMora = pagos.filter(p => p.estado === 'vencido')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800">
              Secretaría & Administración
            </span>
            <span className="text-xs text-on-surface-variant font-medium">Año Escolar 2026</span>
          </div>
          <h1 className="text-xl font-bold text-primary mt-1">
            Panel de Gestión Administrativa
          </h1>
          <p className="text-xs text-on-surface-variant">
            Control de mesas de trámite FUT, validación de comprobantes Yape QR, morosidad y matrículas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-surface-container text-xs font-bold text-primary">
            24 Aulas Activas
          </span>
        </div>
      </div>

      {/* Tarjetas de Estadísticas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Comprobantes Yape Pendientes */}
        <Link
          href="/admin/pagos-revision"
          className="p-5 rounded-2xl bg-white border border-outline-variant/30 hover:border-primary/40 shadow-soft hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-900 uppercase">
              RF-052
            </span>
          </div>
          <span className="text-2xl font-black text-primary">{comprobantesPendientes.length}</span>
          <p className="text-xs font-bold text-primary mt-1">Vouchers Yape por Revisar</p>
          <p className="text-[11px] text-on-surface-variant">Validar para desbloqueo de mora</p>
        </Link>

        {/* FUTs en Proceso */}
        <Link
          href="/admin/fut"
          className="p-5 rounded-2xl bg-white border border-outline-variant/30 hover:border-primary/40 shadow-soft hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-900 uppercase">
              RF-040
            </span>
          </div>
          <span className="text-2xl font-black text-primary">{futsEnProceso.length}</span>
          <p className="text-xs font-bold text-primary mt-1">Trámites FUT en Curso</p>
          <p className="text-[11px] text-on-surface-variant">Mesa de partes virtual</p>
        </Link>

        {/* Morosidad */}
        <Link
          href="/admin/morosidad"
          className="p-5 rounded-2xl bg-white border border-outline-variant/30 hover:border-primary/40 shadow-soft hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-900 uppercase">
              RF-057
            </span>
          </div>
          <span className="text-2xl font-black text-primary">{deudoresMora.length}</span>
          <p className="text-xs font-bold text-primary mt-1">Alumnos con Mora Activa</p>
          <p className="text-[11px] text-on-surface-variant">Bloqueo automático de notas</p>
        </Link>

        {/* Notificaciones WhatsApp */}
        <Link
          href="/admin/whatsapp"
          className="p-5 rounded-2xl bg-white border border-outline-variant/30 hover:border-primary/40 shadow-soft hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MessageSquare className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 uppercase">
              RF-100
            </span>
          </div>
          <span className="text-2xl font-black text-primary">En Vivo</span>
          <p className="text-xs font-bold text-primary mt-1">Centro Notif. WhatsApp</p>
          <p className="text-[11px] text-on-surface-variant">Alertas a padres de familia</p>
        </Link>
      </div>

      {/* Secciones de Trabajo Rápido: Vouchers Yape y FUTs Recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vouchers Pendientes de Validación (RF-052) */}
        <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-surface-container pb-3">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-purple-700" />
              <h2 className="text-sm font-bold text-primary">Comprobantes Yape por Validar (RF-052)</h2>
            </div>
            <Link href="/admin/pagos-revision" className="text-xs text-secondary font-bold hover:underline">
              Ir a bandeja
            </Link>
          </div>

          <div className="space-y-3">
            {comprobantesPendientes.length === 0 ? (
              <p className="text-xs text-on-surface-variant py-4 text-center">
                ✓ No hay comprobantes pendientes de validación.
              </p>
            ) : (
              comprobantesPendientes.map((c) => (
                <div key={c.id} className="p-3.5 rounded-xl bg-surface-container/50 border border-outline-variant/20 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <span className="text-xs font-black text-primary">{c.alumno_nombre}</span>
                    <p className="text-[11px] text-on-surface-variant">
                      {c.periodo_concepto} • Op: <span className="font-mono font-bold text-primary">{c.nro_operacion}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-primary block">S/ {c.monto}.00</span>
                    <Link
                      href="/admin/pagos-revision"
                      className="text-[11px] text-purple-700 font-bold hover:underline"
                    >
                      Revisar voucher ➔
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Trámites FUT en Mesa de Partes (RF-040) */}
        <div className="bg-white p-6 rounded-2xl border border-outline-variant/30 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-surface-container pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-700" />
              <h2 className="text-sm font-bold text-primary">Expedientes FUT Ingresados (RF-040)</h2>
            </div>
            <Link href="/admin/fut" className="text-xs text-secondary font-bold hover:underline">
              Gestionar todos
            </Link>
          </div>

          <div className="space-y-3">
            {futs.slice(0, 2).map((f) => (
              <div key={f.id} className="p-3.5 rounded-xl bg-surface-container/50 border border-outline-variant/20 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-primary font-mono">{f.correlativo}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold uppercase">
                    {f.estado.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs font-bold text-on-surface">{f.tipo_tramite} — {f.solicitante_nombre}</p>
                <p className="text-[11px] text-on-surface-variant truncate">{f.asunto}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
