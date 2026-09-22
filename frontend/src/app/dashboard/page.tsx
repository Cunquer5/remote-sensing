'use client'

import { PageHeader } from '@/components/PageHeader'
import { StatCard } from '@/components/ui'
import { FIELDS, STATS, STRESS_COLORS, STAGE_COLORS, ADVISORY_META, LATEST_OBSERVATION } from '@/lib/data'
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function DashboardPage() {
  const stressDistribution = [
    { name: 'No Stress', value: FIELDS.filter(f => f.stressLevel === 'none').length, color: STRESS_COLORS.none },
    { name: 'Low Stress', value: FIELDS.filter(f => f.stressLevel === 'low').length, color: STRESS_COLORS.low },
    { name: 'Moderate', value: FIELDS.filter(f => f.stressLevel === 'moderate').length, color: STRESS_COLORS.moderate },
    { name: 'High Stress', value: FIELDS.filter(f => f.stressLevel === 'high').length, color: STRESS_COLORS.high },
    { name: 'Severe', value: FIELDS.filter(f => f.stressLevel === 'severe').length, color: STRESS_COLORS.severe },
  ]

  const stageDistribution = Object.entries(STAGE_COLORS).map(([stage, color]) => ({
    name: stage,
    value: FIELDS.filter(f => f.stage === stage).length,
    color
  }))

  const advisoryDistribution = Object.entries(ADVISORY_META).map(([action, meta]) => ({
    name: meta.label,
    value: FIELDS.filter(f => f.advisory === action).length,
    color: meta.color
  }))

  // Generate trend data from field series
  const trendData = FIELDS[0].series.map((point, i) => ({
    week: i + 1,
    ndvi: Number(point.ndvi.toFixed(3)),
    ndmi: Number(point.ndmi.toFixed(3)),
    rainfall: Number(point.rainfall.toFixed(1))
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-night-700 bg-night-800 p-3">
          <p className="text-xs text-slate-400">Week {label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-night-950">
      <PageHeader
        title="Executive Dashboard"
        subtitle="Baitul district sugarcane monitoring overview"
        badge={`Latest: ${LATEST_OBSERVATION}`}
      />

      <div className="px-8 py-6">
        {/* Stat Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <StatCard
            label="Total Study Area"
            value={STATS.studyAreaKm2.toLocaleString()}
            accentColor="#38bdf8"
            unit="km²"
          />
          <StatCard
            label="Sugarcane Area"
            value={STATS.sugarcaneHa.toFixed(1)}
            accentColor="#2fbf6b"
            unit="ha"
            hint={`${(STATS.sugarcaneHa * 2.471).toFixed(1)} acres`}
          />
          <StatCard
            label="Sugarcane Fields"
            value={STATS.fieldCount}
            accentColor="#4dd484"
          />
          <StatCard
            label="Healthy"
            value={`${STATS.healthyPct}%`}
            accentColor="#2fbf6b"
          />
          <StatCard
            label="Moisture Stressed"
            value={`${STATS.stressedPct}%`}
            accentColor="#f07b2d"
          />
          <StatCard
            label="High-Stress Fields"
            value={STATS.highStressCount}
            accentColor="#e5484d"
          />
          <StatCard
            label="Irrigation Priority"
            value={STATS.irrigationPriority}
            accentColor="#f5b942"
          />
          <StatCard
            label="Average NDVI"
            value={STATS.avgNdvi.toFixed(3)}
            accentColor="#2fbf6b"
          />
          <StatCard
            label="Average NDMI"
            value={STATS.avgNdmi.toFixed(3)}
            accentColor="#38bdf8"
          />
          <StatCard
            label="Latest Observation"
            value={STATS.latestObservation}
            accentColor="#a3d635"
          />
        </div>

        {/* Charts Row */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Moisture Stress Distribution */}
          <div className="rounded-xl border border-night-700 bg-night-850 p-5">
            <h3 className="font-display text-sm font-semibold text-white">Moisture Stress Distribution</h3>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stressDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {stressDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Growth Stage Distribution */}
          <div className="rounded-xl border border-night-700 bg-night-850 p-5">
            <h3 className="font-display text-sm font-semibold text-white">Growth-Stage Distribution</h3>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stageDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2f23" />
                  <XAxis type="number" stroke="#475569" />
                  <YAxis dataKey="name" type="category" width={80} stroke="#475569" tick={{ fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {stageDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Irrigation Priority */}
          <div className="rounded-xl border border-night-700 bg-night-850 p-5">
            <h3 className="font-display text-sm font-semibold text-white">Irrigation Priority</h3>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={advisoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {advisoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* District Trend Chart */}
        <div className="mt-6 rounded-xl border border-night-700 bg-night-850 p-5">
          <h3 className="font-display text-sm font-semibold text-white">District NDVI/NDMI Trend</h3>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2f23" />
                <XAxis dataKey="week" stroke="#475569" />
                <YAxis yAxisId="left" stroke="#475569" domain={[0, 1]} />
                <YAxis yAxisId="right" orientation="right" stroke="#475569" domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="ndvi" stroke="#2fbf6b" strokeWidth={2} dot={false} name="NDVI" />
                <Line yAxisId="left" type="monotone" dataKey="ndmi" stroke="#38bdf8" strokeWidth={2} dot={false} name="NDMI" />
                <Line yAxisId="right" type="monotone" dataKey="rainfall" stroke="#64748b" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Rainfall (mm)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
