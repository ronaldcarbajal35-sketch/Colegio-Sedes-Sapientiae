import React from 'react'
import { cn } from '@/lib/utils'

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'grade-AD'
  | 'grade-A'
  | 'grade-B'
  | 'grade-C'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  dot?: boolean
}

export function Badge({ className, variant = 'default', size = 'md', dot = false, children, ...props }: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    default: 'bg-surface-container text-on-surface-variant border-outline-variant/40',
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary/10 text-secondary border-secondary/20',
    success: 'bg-success-container text-success font-semibold border-success/30',
    warning: 'bg-warning-container text-warning font-semibold border-warning/30',
    error: 'bg-error-container text-error font-semibold border-error/30',
    info: 'bg-info-container text-info font-semibold border-info/30',
    'grade-AD': 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
    'grade-A': 'bg-blue-100 text-blue-800 border-blue-300 font-bold',
    'grade-B': 'bg-amber-100 text-amber-800 border-amber-300 font-bold',
    'grade-C': 'bg-rose-100 text-rose-800 border-rose-300 font-bold',
  }

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5',
  }

  const dotColors: Record<BadgeVariant, string> = {
    default: 'bg-on-surface-variant',
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
    info: 'bg-info',
    'grade-AD': 'bg-emerald-600',
    'grade-A': 'bg-blue-600',
    'grade-B': 'bg-amber-600',
    'grade-C': 'bg-rose-600',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium border transition-colors select-none',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />}
      {children}
    </span>
  )
}
