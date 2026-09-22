'use client'

import { PageHeader } from '@/components/PageHeader'
import { StatCard, Panel } from '@/components/ui'
import { StressPill } from '@/components/ui'
import { FIELDS, STRESS_COLORS, STRESS_LABELS } from '@/lib/data'
import Link from 'next/link'
import { Droplets, AlertTriangle } from 'lucide-react'

export default function StressPage() {
  const stressCounts = {
    none: FIELDS.filter(f => f.stressLevel === 'none').length,
    low: FIELDS.filter(f => f.stressLevel === 'low').length,
    moderate: FIELDS.filter(f => f.stressLevel === 'moderate').length,
    high: FIELDS.filter(f => f.stressLevel === 'high').length,
    severe: FIELDS.filter(f => f.stressLevel === 'severe').length,
  }

  const highestStressFields = [...FIELDS]
    .sort((a, b) => b.stressScore - a.stressScore)
    .slice(0, 6)

  const stressInputs = [
    { name: 'NDMI (Canopy Moisture)', weight: 'High', desc: 'Primary indicator of canopy water content' },
    { name: 'Recent Rainfall', weight: 'High', desc: '7-day cumulative precipitation' },
    { name: 'Land Surface Temperature', weight: 'Medium', desc: 'Thermal stress indicator' },
    { name: 'Evapotranspiration Demand', weight: 'Medium', desc: 'Atmospheric water demand' },
    { name: 'Growth Stage Sensitivity', weight: 'Medium', desc: 'Stage-specific water needs' },
    { name: 'Soil Moisture', weight: 'Medium', desc: 'Root zone water availability' },
    { name: 'NDWI (Water Index)', weight: 'Low', desc: 'Surface water detection' },
    { name: 'Cloud Cover', weight: 'Low', desc: 'Data quality factor' },
    { name: 'EVI (Enhanced Vegetation)', weight: 'Low', desc: 'Vegetation condition' },
  ]

  const stressScale = [
    { range: '0-19', label: 'No Stress', color: STRESS_COLORS.none, desc: 'Optimal moisture conditions' },
    { range: '20-39', label: 'Low Stress', color: STRESS_COLORS.low, desc: 'Slight moisture deficit' },
    { range: '40-59', label: 'Moderate Stress', color: STRESS_COLORS.moderate, desc: 'Moderate moisture limitation' },
    { range: '60-79', label: 'High Stress', color: STRESS_COLORS.high, desc: 'Significant water deficit' },
    { range: '80-100', label: 'Severe Stress', color: STRESS_COLORS.severe, desc: 'Critical moisture shortage' },
  ]

  return (
    <div className="min-h-screen bg-night-950">
      <PageHeader
        title="Moisture Stress"
        subtitle="Cane Moisture Stress Score analysis and field rankings"
      />

      <div className="px-8 py-6">
        {/* Stress Level Stat Cards */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
          {Object.entries(stressCounts).map(([level, count]) => (
            <StatCard
              key={level}
              label={STRESS_LABELS[level as keyof typeof STRESS_LABELS]}
              value={count}
              accentColor={STRESS_COLORS[level as keyof typeof STRESS_COLORS]}
            />
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* How the score is built */}
          <Panel title="How the score is built" subtitle="9 input indicators contribute to the stress score">
            <div className="space-y-3">
              {stressInputs.map((input, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-night-700 bg-night-800 p-3">
                  <div>
                    <div className="text-sm font-medium text-white">{input.name}</div>
                    <div className="text-xs text-slate-500">{input.desc}</div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                      input.weight === 'High'
                        ? 'bg-red-500/20 text-red-400'
                        : input.weight === 'Medium'
                        ? 'bg-amber-500/20 text-amber-400'
                        : 'bg-slate-500/20 text-slate-400'
                    }`}
                  >
                    {input.weight}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-[10px] text-slate-500">
              * Weights are re-calculated when certain inputs are unavailable due to cloud cover or data gaps
            </div>
          </Panel>

          {/* Highest-stress fields */}
          <Panel title="Highest-stress fields" subtitle="Fields requiring immediate attention">
            <div className="space-y-3">
              {highestStressFields.map((field) => (
                <Link
                  key={field.id}
                  href={`/fields/${field.id}`}
                  className="block rounded-lg border border-night-700 bg-night-800 p-4 hover:border-night-600 hover:bg-night-750 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-signal-red" />
                      <span className="font-medium text-white">{field.id}</span>
                    </div>
                    <StressPill level={field.stressLevel} />
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">{field.village}</span>
                    <span className="font-semibold text-signal-red">{field.stressScore.toFixed(0)}/100</span>
                  </div>
                </Link>
              ))}
            </div>
          </Panel>
        </div>

        {/* Stress classification scale */}
        <Panel title="Stress classification scale" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
            {stressScale.map((item) => (
              <div
                key={item.range}
                className="rounded-lg border border-night-700 bg-night-800 p-4 text-center"
              >
                <div
                  className="inline-block h-3 w-3 rounded-full mb-2"
                  style={{ backgroundColor: item.color }}
                />
                <div className="text-lg font-semibold text-white">{item.range}</div>
                <div className="text-xs font-medium text-slate-300 mt-1">{item.label}</div>
                <div className="text-[10px] text-slate-500 mt-2">{item.desc}</div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  )
}
