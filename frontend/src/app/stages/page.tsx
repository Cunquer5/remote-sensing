'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { StatCard, Panel } from '@/components/ui'
import { FIELDS, STAGE_COLORS } from '@/lib/data'
import Link from 'next/link'
import { Sprout } from 'lucide-react'

export default function StagesPage() {
  const [ndviRise, setNdviRise] = useState(0.04)
  const [ndviPlateau, setNdviPlateau] = useState(0.70)
  const [minDays, setMinDays] = useState(14)
  const [ndmiFloor, setNdmiFloor] = useState(0.15)

  const stageCounts = {
    'Establishment': FIELDS.filter(f => f.stage === 'Establishment').length,
    'Early Vegetative': FIELDS.filter(f => f.stage === 'Early Vegetative').length,
    'Tillering': FIELDS.filter(f => f.stage === 'Tillering').length,
    'Grand Growth': FIELDS.filter(f => f.stage === 'Grand Growth').length,
    'Maturity': FIELDS.filter(f => f.stage === 'Maturity').length,
    'Harvest': FIELDS.filter(f => f.stage === 'Harvest').length,
  }

  const stageDescriptions = [
    {
      stage: 'Establishment',
      duration: '30-45 days',
      signature: 'Low NDVI, increasing gradually',
      water: 'Low water requirement - maintain soil moisture for germination',
      color: STAGE_COLORS.Establishment
    },
    {
      stage: 'Early Vegetative',
      duration: '45-60 days',
      signature: 'Rising NDVI, canopy development',
      water: 'Moderate water - support tiller initiation',
      color: STAGE_COLORS['Early Vegetative']
    },
    {
      stage: 'Tillering',
      duration: '60-90 days',
      signature: 'High NDVI, rapid growth',
      water: 'High water demand - critical for tiller development',
      color: STAGE_COLORS.Tillering
    },
    {
      stage: 'Grand Growth',
      duration: '90-120 days',
      signature: 'Peak NDVI, maximum biomass',
      water: 'Peak water demand - maximum biomass accumulation',
      color: STAGE_COLORS['Grand Growth']
    },
    {
      stage: 'Maturity',
      duration: '30-45 days',
      signature: 'Declining NDVI, senescence',
      water: 'Reduced water - allow gradual moisture decline for ripening',
      color: STAGE_COLORS.Maturity
    },
    {
      stage: 'Harvest',
      duration: '15-30 days',
      signature: 'Low NDVI, dry canopy',
      water: 'Minimal water - dry conditions preferred for harvest',
      color: STAGE_COLORS.Harvest
    }
  ]

  return (
    <div className="min-h-screen bg-night-950">
      <PageHeader
        title="Growth Stages"
        subtitle="Sugarcane phenology tracking across 6 growth stages"
      />

      <div className="px-8 py-6">
        {/* Stage Stat Cards */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {Object.entries(stageCounts).map(([stage, count]) => (
            <StatCard
              key={stage}
              label={stage}
              value={count}
              accentColor={STAGE_COLORS[stage as keyof typeof STAGE_COLORS]}
            />
          ))}
        </div>

        {/* Phenology Timeline */}
        <Panel title="Sugarcane phenology timeline" className="mt-6">
          <div className="overflow-x-auto">
            <div className="flex gap-4 min-w-max pb-4">
              {stageDescriptions.map((item) => (
                <div key={item.stage} className="flex-1 min-w-[200px]">
                  <div
                    className="h-2 rounded-full mb-3"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="font-medium text-white mb-1">{item.stage}</div>
                  <div className="text-xs text-slate-500 mb-2">Duration: {item.duration}</div>
                  <div className="text-xs text-slate-400 mb-1">
                    <span className="text-slate-500">Spectral:</span> {item.signature}
                  </div>
                  <div className="text-xs text-slate-400">
                    <span className="text-slate-500">Water:</span> {item.water}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        {/* Configurable Stage Thresholds */}
        <Panel title="Configurable stage thresholds" subtitle="Adjust detection parameters (estimates, not certainties)" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="text-xs text-slate-400 block mb-2">
                NDVI weekly rise → vegetative transition
              </label>
              <input
                type="range"
                min="0.01"
                max="0.08"
                step="0.01"
                value={ndviRise}
                onChange={(e) => setNdviRise(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-slate-500 mt-1">Current: {ndviRise.toFixed(2)}</div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-2">
                NDVI plateau threshold → grand growth
              </label>
              <input
                type="range"
                min="0.55"
                max="0.90"
                step="0.05"
                value={ndviPlateau}
                onChange={(e) => setNdviPlateau(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-slate-500 mt-1">Current: {ndviPlateau.toFixed(2)}</div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-2">
                Minimum days before stage change
              </label>
              <input
                type="range"
                min="7"
                max="42"
                step="7"
                value={minDays}
                onChange={(e) => setMinDays(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-slate-500 mt-1">Current: {minDays} days</div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-2">
                NDMI floor flagging moisture-limited growth
              </label>
              <input
                type="range"
                min="0.05"
                max="0.30"
                step="0.05"
                value={ndmiFloor}
                onChange={(e) => setNdmiFloor(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-slate-500 mt-1">Current: {ndmiFloor.toFixed(2)}</div>
            </div>
          </div>
          <p className="mt-4 text-[10px] text-slate-500">
            * These thresholds are estimates used for phenological stage detection. Stage boundaries are not certainties and should be validated with ground observations.
          </p>
        </Panel>

        {/* Current Detections */}
        <Panel title="Current detections" subtitle="All 28 fields with stage information" className="mt-6">
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {FIELDS.map((field) => (
              <Link
                key={field.id}
                href={`/fields/${field.id}`}
                className="flex items-center justify-between rounded-lg border border-night-700 bg-night-800 p-3 hover:border-night-600 hover:bg-night-750 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: STAGE_COLORS[field.stage] }}
                  />
                  <div>
                    <div className="text-sm font-medium text-white">{field.id}</div>
                    <div className="text-xs text-slate-500">{field.village}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Stage</div>
                    <div className="text-sm text-white">{field.stage}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Days in Stage</div>
                    <div className="text-sm text-white">{field.daysInStage}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Confidence</div>
                    <div
                      className={`text-sm font-medium ${
                        field.stageConfidence >= 0.85
                          ? 'text-cane-400'
                          : field.stageConfidence >= 0.75
                          ? 'text-amber-400'
                          : 'text-red-400'
                      }`}
                    >
                      {(field.stageConfidence * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  )
}
