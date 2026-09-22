'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PageHeader } from '@/components/PageHeader'
import { StressPill } from '@/components/ui'
import { FIELDS, STRESS_COLORS, ADVISORY_META } from '@/lib/data'
import { getStressColor, getStageColor, formatArea } from '@/lib/utils'

export default function FieldsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [stressFilter, setStressFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'stress' | 'area' | 'ndvi'>('stress')

  const filteredFields = FIELDS.filter(field => {
    const matchesSearch = 
      field.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      field.village.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStress = stressFilter === 'all' || field.stressLevel === stressFilter
    
    return matchesSearch && matchesStress
  }).sort((a, b) => {
    if (sortBy === 'stress') return b.stressScore - a.stressScore
    if (sortBy === 'area') return b.areaHa - a.areaHa
    if (sortBy === 'ndvi') return b.ndvi - a.ndvi
    return 0
  })

  return (
    <div className="min-h-screen bg-night-950">
      <PageHeader
        title="Field Intelligence"
        subtitle="Search and analyze all 28 sugarcane fields in the Baitul study area"
      />

      <div className="px-8 py-6">
        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Search by field ID or village..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-lg border border-night-700 bg-night-800 px-4 py-2 text-sm text-white placeholder-slate-500 focus:border-cane-600 focus:outline-none"
          />

          <div className="flex gap-2">
            <button
              onClick={() => setStressFilter('all')}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                stressFilter === 'all'
                  ? 'bg-cane-600 text-white'
                  : 'bg-night-800 text-slate-400 hover:bg-night-700'
              }`}
            >
              All
            </button>
            {Object.keys(STRESS_COLORS).map(level => (
              <button
                key={level}
                onClick={() => setStressFilter(level)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  stressFilter === level
                    ? 'bg-cane-600 text-white'
                    : 'bg-night-800 text-slate-400 hover:bg-night-700'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'stress' | 'area' | 'ndvi')}
            className="rounded-lg border border-night-700 bg-night-800 px-3 py-2 text-xs text-white"
          >
            <option value="stress">Sort by Stress</option>
            <option value="area">Sort by Area</option>
            <option value="ndvi">Sort by NDVI</option>
          </select>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-night-700 bg-night-850 overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-night-700 bg-night-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Field ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Village</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Area</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Crop Confidence</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Growth Stage</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">NDVI</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">NDMI</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Stress</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Advisory</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Data Quality</th>
              </tr>
            </thead>
            <tbody>
              {filteredFields.map(field => (
                <tr key={field.id} className="border-b border-night-700 hover:bg-night-800 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/fields/${field.id}`}
                      className="text-sm font-medium text-cane-400 hover:text-cane-300"
                    >
                      {field.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">{field.village}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{formatArea(field.areaHa)}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{(field.confidence * 100).toFixed(0)}%</td>
                  <td className="px-4 py-3">
                    <span
                      className="text-xs font-medium"
                      style={{ color: getStageColor(field.stage) }}
                    >
                      {field.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">{field.ndvi.toFixed(3)}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{field.ndmi.toFixed(3)}</td>
                  <td className="px-4 py-3">
                    <StressPill level={field.stressLevel} />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
                      style={{
                        backgroundColor: `${ADVISORY_META[field.advisory].color}1f`,
                        color: ADVISORY_META[field.advisory].color
                      }}
                    >
                      {ADVISORY_META[field.advisory].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">{field.dataQuality}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredFields.length === 0 && (
            <div className="px-4 py-12 text-center text-slate-500">
              No fields match your search criteria
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
