import React from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  badge?: string
}

export function PageHeader({ title, subtitle, badge }: PageHeaderProps) {
  return (
    <div className="border-b border-night-700 bg-night-900/60 px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {badge && (
            <span className="rounded-full border border-night-700 bg-night-800 px-3 py-1 text-[11px] text-slate-300">
              {badge}
            </span>
          )}
          <span className="rounded-full border border-night-700 bg-night-800 px-3 py-1 text-[11px] text-amber-400">
            Demo Data
          </span>
        </div>
      </div>
    </div>
  )
}
