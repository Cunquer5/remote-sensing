import React from 'react'

interface StatCardProps {
  label: string
  value: string | number
  accentColor?: string
  unit?: string
  hint?: string
}

export function StatCard({ label, value, accentColor = '#2fbf6b', unit, hint }: StatCardProps) {
  return (
    <div className="rounded-xl border border-night-700 bg-night-850 p-4">
      <div className="text-[10px] uppercase text-slate-500">{label}</div>
      <div className="font-display text-2xl font-semibold" style={{ color: accentColor }}>
        {value}
        {unit && <span className="ml-1 text-sm text-slate-400">{unit}</span>}
      </div>
      {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
    </div>
  )
}

interface PanelProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}

export function Panel({ title, subtitle, children, className }: PanelProps) {
  return (
    <div className={`rounded-xl border border-night-700 bg-night-850 ${className || ''}`}>
      <div className="border-b border-night-700 px-5 py-3">
        <h3 className="font-display text-sm font-semibold text-white">{title}</h3>
        {subtitle && <p className="text-[11px] text-slate-500">{subtitle}</p>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}

interface StressPillProps {
  level: string
  label?: string
}

export function StressPill({ level, label }: StressPillProps) {
  const colors: Record<string, string> = {
    'none': '#2fbf6b',
    'low': '#a3d635',
    'moderate': '#f5b942',
    'high': '#f07b2d',
    'severe': '#e5484d'
  }
  
  const color = colors[level] || '#64748b'
  const displayLabel = label || level.charAt(0).toUpperCase() + level.slice(1)
  
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
      style={{
        backgroundColor: `${color}1f`,
        color: color
      }}
    >
      <span
        className="mr-1.5 h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {displayLabel}
    </span>
  )
}
