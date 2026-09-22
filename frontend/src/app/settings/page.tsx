'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { Panel } from '@/components/ui'
import { CheckCircle2, AlertCircle } from 'lucide-react'

export default function SettingsPage() {
  const [aoiName, setAoiName] = useState('Baitul District')
  const [cloudCoverMax, setCloudCoverMax] = useState(25)
  const [compositingWindow, setCompositingWindow] = useState(14)
  const [confidenceThreshold, setConfidenceThreshold] = useState(75)
  const [stressAlertThreshold, setStressAlertThreshold] = useState(60)
  const [notifications, setNotifications] = useState(true)
  const [showSaved, setShowSaved] = useState(false)

  const handleSave = () => {
    setShowSaved(true)
    setTimeout(() => setShowSaved(false), 2500)
  }

  return (
    <div className="min-h-screen bg-night-950">
      <PageHeader
        title="Settings"
        subtitle="Configure study region, processing parameters, and alerts"
      />

      <div className="px-8 py-6">
        {/* Study Region */}
        <Panel title="Study region" className="mb-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-500 block mb-2">AOI Name</label>
              <input
                type="text"
                value={aoiName}
                onChange={(e) => setAoiName(e.target.value)}
                className="w-full rounded-lg border border-night-700 bg-night-800 px-4 py-2 text-sm text-white focus:border-cane-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-2">Description</label>
              <p className="text-sm text-slate-400">
                Baitul district boundary defined by 12 coordinate points covering approximately 10,043 km² in Madhya Pradesh, India.
              </p>
            </div>
          </div>
        </Panel>

        {/* Satellite Processing */}
        <Panel title="Satellite processing" className="mb-6">
          <div className="space-y-6">
            <div>
              <label className="text-xs text-slate-500 block mb-2">
                Cloud cover maximum: {cloudCoverMax}%
              </label>
              <input
                type="range"
                min="5"
                max="80"
                value={cloudCoverMax}
                onChange={(e) => setCloudCoverMax(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Images with cloud cover above this threshold will be excluded from analysis
              </p>
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-2">
                Compositing window: {compositingWindow} days
              </label>
              <input
                type="range"
                min="7"
                max="30"
                value={compositingWindow}
                onChange={(e) => setCompositingWindow(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Temporal window for aggregating multiple satellite observations
              </p>
            </div>
          </div>
        </Panel>

        {/* Classification & Alerts */}
        <Panel title="Classification & alerts" className="mb-6">
          <div className="space-y-6">
            <div>
              <label className="text-xs text-slate-500 block mb-2">
                Confidence threshold: {confidenceThreshold}%
              </label>
              <input
                type="range"
                min="50"
                max="95"
                value={confidenceThreshold}
                onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Minimum confidence required for crop classification acceptance
              </p>
            </div>
            <div>
              <label className="text-xs text-slate-500 block mb-2">
                Stress alert threshold: {stressAlertThreshold}
              </label>
              <input
                type="range"
                min="30"
                max="90"
                value={stressAlertThreshold}
                onChange={(e) => setStressAlertThreshold(Number(e.target.value))}
                className="w-full"
              />
              <p className="text-[10px] text-slate-500 mt-1">
                Stress score threshold for triggering irrigation alerts
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-white">Enable notifications</div>
                <p className="text-xs text-slate-500">Receive alerts for high-stress fields and irrigation priorities</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications ? 'bg-cane-600' : 'bg-night-700'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    notifications ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </Panel>

        {/* Live Data Connection */}
        <Panel title="Live data connection" className="mb-6">
          <div className="rounded-lg border border-night-700 bg-night-800 p-4">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="h-5 w-5 text-amber-400" />
              <div>
                <div className="text-sm font-medium text-white">No live data source connected</div>
                <p className="text-xs text-slate-500">
                  Currently using demo/synthetic data. Configure API keys and credentials to enable live satellite data ingestion.
                </p>
              </div>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Sentinel Hub</span>
                <span className="text-amber-400">Not configured</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Google Earth Engine</span>
                <span className="text-amber-400">Not configured</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Weather API</span>
                <span className="text-amber-400">Not configured</span>
              </div>
            </div>
          </div>
        </Panel>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 rounded-lg bg-cane-600 px-6 py-3 text-sm font-medium text-white hover:bg-cane-700 transition-colors"
          >
            {showSaved ? (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Settings saved
              </>
            ) : (
              'Save Settings'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
