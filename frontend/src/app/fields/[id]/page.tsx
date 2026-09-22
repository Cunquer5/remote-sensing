'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { Panel, StressPill } from '@/components/ui'
import { FIELDS, STAGE_COLORS, ADVISORY_META, STAGE_WATER_NEED } from '@/lib/data'
import { getStressColor, getStageColor, formatArea, formatDate } from '@/lib/utils'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts'
import { useParams } from 'next/navigation'

export default function FieldDetailPage() {
  const params = useParams()
  const fieldId = params.id as string
  const field = FIELDS.find(f => f.id === fieldId)

  if (!field) {
    return (
      <div className="min-h-screen bg-night-950 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-2xl font-semibold text-white">Field Not Found</h1>
          <p className="mt-2 text-slate-400">Field {fieldId} does not exist in the dataset.</p>
        </div>
      </div>
    )
  }

  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['ndvi', 'ndmi'])

  const metricColors: Record<string, string> = {
    ndvi: '#2fbf6b',
    ndmi: '#38bdf8',
    ndwi: '#4dd484',
    stressScore: '#e5484d',
    rainfall: '#64748b',
    et: '#f5b942'
  }

  const metricDomains: Record<string, [number, number]> = {
    ndvi: [0, 1],
    ndmi: [-0.2, 0.5],
    ndwi: [-0.3, 0.5],
    stressScore: [0, 100],
    rainfall: [0, 100],
    et: [0, 10]
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-night-700 bg-night-800 p-3">
          <p className="text-xs text-slate-400">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(3) : entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  const getStageAreas = () => {
    const areas: any[] = []
    let currentStage = field.series[0].stage
    let startIndex = 0

    field.series.forEach((point, i) => {
      if (point.stage !== currentStage) {
        areas.push({
          x0: startIndex,
          x1: i,
          stage: currentStage,
          color: STAGE_COLORS[currentStage]
        })
        currentStage = point.stage
        startIndex = i
      }
    })
    areas.push({
      x0: startIndex,
      x1: field.series.length - 1,
      stage: currentStage,
      color: STAGE_COLORS[currentStage]
    })
    return areas
  }

  const stageAreas = getStageAreas()

  return (
    <div className="min-h-screen bg-night-950">
      <PageHeader
        title={`Field ${field.id}`}
        subtitle={`${field.village} · ${formatArea(field.areaHa)}`}
        badge={field.dataQuality}
      />

      <div className="px-8 py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Panel: Field Intelligence */}
          <div className="space-y-6">
            <Panel title="Field Intelligence">
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-xs text-slate-500">Field ID</dt>
                  <dd className="text-sm text-white">{field.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-xs text-slate-500">Area</dt>
                  <dd className="text-sm text-white">{formatArea(field.areaHa)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-xs text-slate-500">Crop</dt>
                  <dd className="text-sm text-white">{field.crop}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-xs text-slate-500">Growth Stage</dt>
                  <dd className="text-sm font-medium" style={{ color: getStageColor(field.stage) }}>
                    {field.stage}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-xs text-slate-500">NDVI</dt>
                  <dd className="text-sm text-cane-400">{field.ndvi.toFixed(3)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-xs text-slate-500">NDMI</dt>
                  <dd className="text-sm text-signal-cyan">{field.ndmi.toFixed(3)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-xs text-slate-500">NDWI</dt>
                  <dd className="text-sm text-white">{field.ndwi.toFixed(3)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-xs text-slate-500">Stress Score</dt>
                  <dd className="text-sm font-medium" style={{ color: getStressColor(field.stressLevel) }}>
                    {field.stressScore.toFixed(1)}/100
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-xs text-slate-500">7-Day Rainfall</dt>
                  <dd className="text-sm text-white">{field.rainfall7d.toFixed(1)} mm</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-xs text-slate-500">Evapotranspiration</dt>
                  <dd className="text-sm text-white">{field.et.toFixed(1)} mm/day</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-xs text-slate-500">Last Observation</dt>
                  <dd className="text-sm text-white">{formatDate(field.lastObservation)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-xs text-slate-500">Data Quality</dt>
                  <dd className="text-sm text-white">{field.dataQuality}</dd>
                </div>
              </dl>
            </Panel>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Irrigation Advisory */}
            <Panel title="Irrigation Advisory">
              <div className="mb-4">
                <StressPill level={field.advisory} label={ADVISORY_META[field.advisory].label} />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-slate-500">Confidence</span>
                  <div className="text-white">{(field.advisoryConfidence * 100).toFixed(0)}%</div>
                </div>
                <div>
                  <span className="text-xs text-slate-500">Priority</span>
                  <div className="text-white">{field.irrigationPriority}/4</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-300">{field.advisoryReason}</p>
              <div className="mt-4 rounded-lg border border-night-700 bg-night-800 p-4">
                <h4 className="text-xs font-semibold text-slate-400 mb-2">Why this recommendation?</h4>
                <p className="text-xs text-slate-300">{field.explanation}</p>
                <p className="mt-2 text-[10px] text-slate-500">
                  This recommendation is based on current growth stage ({field.stage}) water requirements: {STAGE_WATER_NEED[field.stage].toLowerCase()}
                </p>
              </div>
            </Panel>

            {/* Cane Moisture Stress Score */}
            <Panel title="Cane Moisture Stress Score">
              <div className="flex items-center gap-6">
                <div>
                  <div
                    className="font-display text-5xl font-semibold"
                    style={{ color: getStressColor(field.stressLevel) }}
                  >
                    {field.stressScore.toFixed(0)}
                  </div>
                  <div className="text-sm text-slate-400">/ 100</div>
                </div>
                <StressPill level={field.stressLevel} />
                <div>
                  <span className="text-xs text-slate-500">Confidence</span>
                  <div className="text-sm text-white">{(field.stressConfidence * 100).toFixed(0)}%</div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-xs font-semibold text-slate-400 mb-3">Contributing Factors</h4>
                <div className="space-y-2">
                  {field.stressFactors.map((factor, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-24 text-xs text-slate-300">{factor.label}</div>
                      <div className="flex-1 h-2 bg-night-700 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${factor.contribution}%`,
                            backgroundColor: getStressColor(field.stressLevel),
                            opacity: 1 - (i * 0.15)
                          }}
                        />
                      </div>
                      <div className="w-12 text-xs text-right text-slate-400">{factor.contribution}%</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 space-y-1">
                {field.stressFactors.map((factor, i) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-slate-400">{factor.label}</span>
                    <span className="text-slate-300">{factor.detail}</span>
                  </div>
                ))}
              </div>
            </Panel>

            {/* Time-Series Analysis */}
            <Panel title="Time-Series Analysis">
              <div className="mb-4 flex flex-wrap gap-2">
                {Object.keys(metricColors).map(metric => (
                  <button
                    key={metric}
                    onClick={() => {
                      if (selectedMetrics.includes(metric)) {
                        if (selectedMetrics.length > 1) {
                          setSelectedMetrics(selectedMetrics.filter(m => m !== metric))
                        }
                      } else {
                        setSelectedMetrics([...selectedMetrics, metric])
                      }
                    }}
                    className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                      selectedMetrics.includes(metric)
                        ? 'text-white'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                    style={{
                      backgroundColor: selectedMetrics.includes(metric) ? metricColors[metric] : '#1a2f23'
                    }}
                  >
                    {metric.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={field.series}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a2f23" />
                    <XAxis
                      dataKey="date"
                      stroke="#475569"
                      tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis
                      stroke="#475569"
                      domain={metricDomains[selectedMetrics[0]] || [0, 1]}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    {selectedMetrics.map(metric => (
                      <Line
                        key={metric}
                        type="monotone"
                        dataKey={metric}
                        stroke={metricColors[metric]}
                        strokeWidth={2}
                        dot={false}
                        name={metric.toUpperCase()}
                      />
                    ))}
                    {stageAreas.map((area, i) => (
                      <ReferenceArea
                        key={i}
                        x1={area.x0}
                        x2={area.x1}
                        fill={area.color}
                        fillOpacity={0.1}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-night-700 bg-night-800 p-3">
                  <div className="text-[10px] text-slate-500">Latest NDVI</div>
                  <div className="text-sm font-semibold text-cane-400">{field.ndvi.toFixed(3)}</div>
                </div>
                <div className="rounded-lg border border-night-700 bg-night-800 p-3">
                  <div className="text-[10px] text-slate-500">Latest NDMI</div>
                  <div className="text-sm font-semibold text-signal-cyan">{field.ndmi.toFixed(3)}</div>
                </div>
                <div className="rounded-lg border border-night-700 bg-night-800 p-3">
                  <div className="text-[10px] text-slate-500">Water Balance</div>
                  <div className="text-sm font-semibold text-white">
                    {(field.rainfall7d - field.et * 7).toFixed(1)} mm
                  </div>
                </div>
              </div>

              {field.dataQuality !== 'Good' && (
                <div className="mt-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                  <p className="text-xs text-amber-300">
                    ⚠️ Limited data quality: {field.cloudCover}% cloud cover in latest observation. Results should be interpreted with caution.
                  </p>
                </div>
              )}
            </Panel>
          </div>
        </div>
      </div>
    </div>
  )
}
