'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { StatCard, Panel } from '@/components/ui'
import { FIELDS, ADVISORY_META, STAGE_WATER_NEED } from '@/lib/data'
import Link from 'next/link'
import { Droplet, Droplets, Cloud, Thermometer, Waves, History, Sprout } from 'lucide-react'

export default function AdvisoryPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>('all')

  const advisoryCounts = {
    'IRRIGATION_REQUIRED': FIELDS.filter(f => f.advisory === 'IRRIGATION_REQUIRED').length,
    'IRRIGATION_CAN_BE_DELAYED': FIELDS.filter(f => f.advisory === 'IRRIGATION_CAN_BE_DELAYED').length,
    'MONITOR_FIELD': FIELDS.filter(f => f.advisory === 'MONITOR_FIELD').length,
    'NO_IMMEDIATE_IRRIGATION': FIELDS.filter(f => f.advisory === 'NO_IMMEDIATE_IRRIGATION').length,
  }

  const filteredFields = selectedFilter === 'all'
    ? FIELDS
    : FIELDS.filter(f => f.advisory === selectedFilter)

  const advisoryInputs = [
    { icon: Sprout, name: 'Crop growth stage', desc: 'Water requirements vary by phenological stage' },
    { icon: Droplets, name: 'Moisture stress', desc: 'NDMI-based canopy moisture assessment' },
    { icon: Cloud, name: 'Recent rainfall', desc: '7-day cumulative precipitation' },
    { icon: Thermometer, name: 'Weather context', desc: 'Temperature and humidity conditions' },
    { icon: Waves, name: 'Soil moisture & ET', desc: 'Root zone water and evapotranspiration' },
    { icon: History, name: 'Field history', desc: 'Previous irrigation and stress patterns' },
  ]

  return (
    <div className="min-h-screen bg-night-950">
      <PageHeader
        title="Irrigation Advisory"
        subtitle="Field-specific irrigation recommendations based on crop conditions"
      />

      <div className="px-8 py-6">
        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {Object.entries(ADVISORY_META).map(([action, meta]) => (
            <div
              key={action}
              onClick={() => setSelectedFilter(action)}
              className={`cursor-pointer rounded-xl border p-4 transition-colors ${
                selectedFilter === action
                  ? 'border-cane-600 bg-cane-600/10'
                  : 'border-night-700 bg-night-850 hover:border-night-600'
              }`}
            >
              <div className="text-[10px] uppercase text-slate-500 mb-1">{meta.label}</div>
              <div
                className="font-display text-2xl font-semibold"
                style={{ color: meta.color }}
              >
                {advisoryCounts[action as keyof typeof advisoryCounts]}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">{meta.description}</div>
            </div>
          ))}
        </div>

        {/* How advisories are generated */}
        <Panel title="How advisories are generated" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {advisoryInputs.map((input, i) => {
              const Icon = input.icon
              return (
                <div key={i} className="rounded-lg border border-night-700 bg-night-800 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-5 w-5 text-cane-400" />
                    <span className="text-sm font-medium text-white">{input.name}</span>
                  </div>
                  <p className="text-xs text-slate-500">{input.desc}</p>
                </div>
              )
            })}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Advisories are generated using a rule-based system that considers growth stage water requirements, current moisture stress, recent rainfall, and field history. Recommendations are updated weekly based on the latest satellite observations.
          </p>
        </Panel>

        {/* Field advisories */}
        <Panel title="Field advisories" className="mt-6">
          <div className="space-y-3">
            {filteredFields
              .sort((a, b) => a.irrigationPriority - b.irrigationPriority)
              .map((field) => (
                <div
                  key={field.id}
                  className="rounded-lg border border-night-700 bg-night-800 p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Link
                        href={`/fields/${field.id}`}
                        className="font-medium text-cane-400 hover:text-cane-300"
                      >
                        {field.id}
                      </Link>
                      <div className="text-xs text-slate-500">{field.village} · {field.areaHa.toFixed(1)} ha</div>
                    </div>
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                      style={{
                        backgroundColor: `${ADVISORY_META[field.advisory].color}1f`,
                        color: ADVISORY_META[field.advisory].color
                      }}
                    >
                      {ADVISORY_META[field.advisory].label}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-xs mb-3">
                    <div>
                      <span className="text-slate-500">Stage</span>
                      <div className="text-white">{field.stage}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Stress Score</span>
                      <div className="text-white">{field.stressScore.toFixed(0)}/100</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Confidence</span>
                      <div className="text-white">{(field.advisoryConfidence * 100).toFixed(0)}%</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Date</span>
                      <div className="text-white">{field.lastObservation}</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">{field.advisoryReason}</p>
                </div>
              ))}
          </div>
        </Panel>

        {/* Stage water-demand reference */}
        <Panel title="Stage water-demand reference" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {Object.entries(STAGE_WATER_NEED).map(([stage, need]) => (
              <div key={stage} className="rounded-lg border border-night-700 bg-night-800 p-4">
                <div className="text-sm font-medium text-white mb-2">{stage}</div>
                <p className="text-xs text-slate-500">{need}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  )
}
