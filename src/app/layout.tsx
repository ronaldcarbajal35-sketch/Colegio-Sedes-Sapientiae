import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Colegio Sedes Sapientiae — Sistema de Gestión Escolar',
  description: 'Plataforma integral de gestión académica, matrículas, control de pagos y asistencia escolar para el Colegio Sedes Sapientiae.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="h-full">
      <body className="h-full bg-surface text-on-surface antialiased font-sans">
        {children}
      </body>
    </html>
  )
}
