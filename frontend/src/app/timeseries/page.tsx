'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { Panel } from '@/components/ui'
import { FIELDS, STAGE_COLORS } from '@/lib/data'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts'
import { LineChart as LineChartIcon } from 'lucide-react'

export default function TimeSeriesPage() {
  const [selectedField, setSelectedField] = useState(FIELDS[0].id)
  const [dateRange, setDateRange] = useState<'full' | '90' | '60'>('full')
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['ndvi', 'ndmi'])

  const field = FIELDS.find(f => f.id === selectedField) || FIELDS[0]

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

  const getFilteredSeries = () => {
    if (dateRange === 'full') return field.series
    if (dateRange === '90') return field.series.slice(-13)
    if (dateRange === '60') return field.series.slice(-9)
    return field.series
  }

  const series = getFilteredSeries()

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
    let currentStage = series[0].stage
    let startIndex = 0

    series.forEach((point, i) => {
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
      x1: series.length - 1,
      stage: currentStage,
      color: STAGE_COLORS[currentStage]
    })
    return areas
  }

  const stageAreas = getStageAreas()

  return (
    <div className="min-h-screen bg-night-950">
      <PageHeader
        title="Time Series"
        subtitle="Historical analysis of vegetation indices and stress indicators"
      />

      <div className="px-8 py-6">
        {/* Controls */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <div>
            <label className="text-xs text-slate-500 block mb-2">Field</label>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="rounded-lg border border-night-700 bg-night-800 px-3 py-2 text-sm text-white"
            >
              {FIELDS.map(f => (
                <option key={f.id} value={f.id}>{f.id} - {f.village}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-500 block mb-2">Date Range</label>
            <div className="flex gap-2">
              {(['full', '90', '60'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                    dateRange === range
                      ? 'bg-cane-600 text-white'
                      : 'bg-night-800 text-slate-400 hover:bg-night-700'
                  }`}
                >
                  {range === 'full' ? 'Full Season' : `Last ~${range} days`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-500 block mb-2">Metrics (min 1)</label>
            <div className="flex gap-2">
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
          </div>
        </div>

        {/* Chart */}
        <Panel title="Time Series Chart">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
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

          {/* Summary Cards */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            {selectedMetrics.slice(0, 3).map(metric => {
              const latest = series[series.length - 1][metric as keyof typeof series[0]] as number
              const previous = series[series.length - 2]?.[metric as keyof typeof series[0]] as number
              const delta = previous && typeof previous === 'number' && typeof latest === 'number' ? ((latest - previous) / Math.abs(previous) * 100).toFixed(1) : '0.0'
              return (
                <div key={metric} className="rounded-lg border border-night-700 bg-night-800 p-3">
                  <div className="text-[10px] text-slate-500">Latest {metric.toUpperCase()}</div>
                  <div className="text-sm font-semibold" style={{ color: metricColors[metric] }}>
                    {typeof latest === 'number' ? latest.toFixed(3) : latest}
                  </div>
                  <div className={`text-[10px] ${parseFloat(delta) >= 0 ? 'text-cane-400' : 'text-red-400'}`}>
                    {parseFloat(delta) >= 0 ? '+' : ''}{delta}% WoW
                  </div>
                </div>
              )
            })}
          </div>
        </Panel>
      </div>
    </div>
  )
}
