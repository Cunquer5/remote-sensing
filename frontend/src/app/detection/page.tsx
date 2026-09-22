'use client'

import { PageHeader } from '@/components/PageHeader'
import { StatCard, Panel } from '@/components/ui'
import { FIELDS } from '@/lib/data'
import { formatArea } from '@/lib/utils'
import { ScanSearch, CheckCircle2, Clock, XCircle } from 'lucide-react'

export default function DetectionPage() {
  const pipelineSteps = [
    { num: 1, name: 'Satellite Data', desc: 'Sentinel-1/2, Landsat 8/9 acquisition' },
    { num: 2, name: 'AOI Filter', desc: 'Baitul district boundary extraction' },
    { num: 3, name: 'Cloud Filter', desc: 'Quality masking and compositing' },
    { num: 4, name: 'Compositing', desc: 'Temporal aggregation (7-30 days)' },
    { num: 5, name: 'Features', desc: 'NDVI, NDMI, texture, backscatter' },
    { num: 6, name: 'Classification', desc: 'Random Forest model inference' },
    { num: 7, name: 'Field Mask', desc: 'Boundary extraction and validation' },
    { num: 8, name: 'Stage ID', desc: 'Phenological stage detection' },
    { num: 9, name: 'Stress Detection', desc: 'Moisture stress classification' },
    { num: 10, name: 'Water Requirement', desc: 'ET-based demand estimation' },
    { num: 11, name: 'Advisory', desc: 'Irrigation recommendation generation' },
    { num: 12, name: 'Dashboard', desc: 'Visualization and API serving' },
  ]

  const models = [
    { name: 'Random Forest', status: 'active', accuracy: null },
    { name: 'XGBoost', status: 'available', accuracy: null },
    { name: 'SVM', status: 'available', accuracy: null },
    { name: 'Temporal ML', status: 'planned', accuracy: null },
  ]

  const classificationOutput = FIELDS.slice(0, 10).map(field => ({
    id: field.id,
    crop: field.crop,
    confidence: (field.confidence * 100).toFixed(1),
    area: field.areaHa.toFixed(1),
    acquisition: '2026-09-18',
    quality: field.dataQuality
  }))

  return (
    <div className="min-h-screen bg-night-950">
      <PageHeader
        title="Crop Detection"
        subtitle="AI-powered sugarcane field classification using SAR and optical imagery"
      />

      <div className="px-8 py-6">
        {/* Stat Cards */}
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <StatCard
            label="Mapped Fields"
            value={FIELDS.length}
            accentColor="#2fbf6b"
          />
          <StatCard
            label="Mean Confidence"
            value={`${(FIELDS.reduce((sum, f) => sum + f.confidence, 0) / FIELDS.length * 100).toFixed(1)}%`}
            accentColor="#38bdf8"
          />
          <StatCard
            label="Classifier"
            value="Random Forest"
            accentColor="#4dd484"
          />
          <StatCard
            label="Training Data"
            value="Pending"
            accentColor="#f5b942"
          />
        </div>

        {/* AI Processing Pipeline */}
        <Panel title="AI Processing Pipeline" subtitle="12-step satellite-to-advisory pipeline" className="mt-6">
          <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {pipelineSteps.map((step, i) => (
              <div key={step.num} className="relative">
                <div className="rounded-lg border border-night-700 bg-night-800 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-cane-400">{step.num}</span>
                    {i < pipelineSteps.length - 1 && (
                      <div className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 text-slate-600">
                        ↓
                      </div>
                    )}
                  </div>
                  <div className="text-xs font-medium text-white mb-1">{step.name}</div>
                  <div className="text-[10px] text-slate-500">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Model Selection */}
        <Panel title="Model Selection" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {models.map((model) => (
              <div
                key={model.name}
                className={`rounded-lg border p-4 cursor-pointer transition-colors ${
                  model.status === 'active'
                    ? 'border-cane-600 bg-cane-600/10'
                    : model.status === 'available'
                    ? 'border-night-700 bg-night-800 hover:border-night-600'
                    : 'border-night-700 bg-night-800/50 opacity-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{model.name}</span>
                  {model.status === 'active' && (
                    <CheckCircle2 className="h-4 w-4 text-cane-400" />
                  )}
                  {model.status === 'available' && (
                    <Clock className="h-4 w-4 text-slate-500" />
                  )}
                  {model.status === 'planned' && (
                    <XCircle className="h-4 w-4 text-slate-600" />
                  )}
                </div>
                <div className="text-[10px] text-slate-500 capitalize">{model.status}</div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Accuracy & Validation */}
        <Panel title="Accuracy & Validation" className="mt-6">
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4 mb-4">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-amber-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-amber-300">Validation Data Required</h4>
                <p className="text-xs text-amber-200/80 mt-1">
                  Ground truth validation data is needed to compute accuracy metrics. Current classifications are based on model predictions without independent verification.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            {['Overall Accuracy', 'Precision', 'Recall', 'F1 Score'].map((metric) => (
              <div
                key={metric}
                className="rounded-lg border border-dashed border-night-700 bg-night-800/50 p-4 text-center"
              >
                <div className="text-xs text-slate-500 mb-1">{metric}</div>
                <div className="text-lg font-semibold text-slate-600">—</div>
                <div className="text-[10px] text-slate-600">pending validation</div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-dashed border-night-700 bg-night-800/50 p-6">
            <div className="text-center text-slate-600">
              <ScanSearch className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <div className="text-sm">Confusion Matrix</div>
              <div className="text-xs mt-1">Available after validation</div>
            </div>
          </div>
        </Panel>

        {/* Classification Output */}
        <Panel title="Classification Output" subtitle="Sample field classifications" className="mt-6">
          <div className="rounded-xl border border-night-700 bg-night-800 overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-night-700 bg-night-850">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Field</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Crop</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Confidence</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Area (ha)</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Acquisition</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">Quality</th>
                </tr>
              </thead>
              <tbody>
                {classificationOutput.map((field) => (
                  <tr key={field.id} className="border-b border-night-700">
                    <td className="px-4 py-3 text-sm text-cane-400 font-medium">{field.id}</td>
                    <td className="px-4 py-3 text-sm text-white">{field.crop}</td>
                    <td className="px-4 py-3 text-sm text-white">{field.confidence}%</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{field.area}</td>
                    <td className="px-4 py-3 text-sm text-slate-300">{field.acquisition}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs ${
                          field.quality === 'Good' ? 'text-cane-400' : field.quality === 'Fair' ? 'text-amber-400' : 'text-red-400'
                        }`}
                      >
                        {field.quality}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  )
}
