import React from 'react'
import { cn } from '@/lib/utils'

export interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: string
    isPositive?: boolean
  }
  icon: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'info'
}

export function StatsCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  variant = 'primary',
}: StatsCardProps) {
  const iconVariants = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/15 text-secondary',
    success: 'bg-success-container text-success',
    warning: 'bg-warning-container text-warning',
    info: 'bg-info-container text-info',
  }

  return (
    <div className="bg-white rounded-xl border border-outline-variant/30 p-5 shadow-card hover:shadow-soft transition-all duration-200 flex items-start justify-between">
      <div className="flex flex-col">
        <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant/80">{title}</span>
        <span className="text-2xl sm:text-3xl font-extrabold text-primary mt-1 tracking-tight">{value}</span>
        {subtitle && <span className="text-xs text-on-surface-variant mt-1">{subtitle}</span>}
        {trend && (
          <div className="flex items-center gap-1 mt-2 text-xs font-medium">
            <span className={trend.isPositive ? 'text-success' : 'text-error'}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}
            </span>
            <span className="text-on-surface-variant/60">vs mes anterior</span>
          </div>
        )}
      </div>
      <div className={cn('p-3 rounded-xl shrink-0 flex items-center justify-center', iconVariants[variant])}>
        {icon}
      </div>
    </div>
  )
}
