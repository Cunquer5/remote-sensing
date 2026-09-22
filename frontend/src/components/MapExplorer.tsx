'use client'

import { useEffect, useState } from 'react'
import { FIELDS, BAITUL_CENTER, BAITUL_BOUNDARY, NON_CANE_PLOTS, STRESS_COLORS, STAGE_COLORS, ADVISORY_META } from '@/lib/data'
import { getStressColor, getStageColor } from '@/lib/utils'
import { MapContainer, TileLayer, Polygon, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

type ColorMode = 'ndvi' | 'ndmi' | 'stress' | 'stage' | 'priority'

export function MapExplorer() {
  const [colorMode, setColorMode] = useState<ColorMode>('stress')
  const [opacity, setOpacity] = useState(70)
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const [layers, setLayers] = useState({
    sugarcane: true,
    classification: false,
    ndvi: false,
    ndmi: false,
    stress: true,
    stage: false,
    priority: false,
    satellite: false
  })

  const [baseMap, setBaseMap] = useState<'basic' | 'satellite'>('basic')

  // Fix Leaflet icon issue for Next.js
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const L = require('leaflet')
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })
    }
  }, [])

  const getColorForField = (field: typeof FIELDS[0]) => {
    if (colorMode === 'stress') return getStressColor(field.stressLevel)
    if (colorMode === 'stage') return getStageColor(field.stage)
    if (colorMode === 'priority') return ADVISORY_META[field.advisory].color
    
    if (colorMode === 'ndvi') {
      if (field.ndvi >= 0.75) return '#1fa356'
      if (field.ndvi >= 0.65) return '#2fbf6b'
      if (field.ndvi >= 0.55) return '#a3d635'
      if (field.ndvi >= 0.45) return '#f5b942'
      return '#f07b2d'
    }
    
    if (colorMode === 'ndmi') {
      if (field.ndmi >= 0.35) return '#38bdf8'
      if (field.ndmi >= 0.25) return '#4dd484'
      if (field.ndmi >= 0.15) return '#f5b942'
      if (field.ndmi >= 0.05) return '#f07b2d'
      return '#e5484d'
    }
    
    return '#64748b'
  }

  const getLegendItems = () => {
    if (colorMode === 'stress') {
      return Object.entries(STRESS_COLORS).map(([level, color]) => ({
        label: level.charAt(0).toUpperCase() + level.slice(1),
        color
      }))
    }
    if (colorMode === 'stage') {
      return Object.entries(STAGE_COLORS).map(([stage, color]) => ({
        label: stage,
        color
      }))
    }
    if (colorMode === 'priority') {
      return Object.entries(ADVISORY_META).map(([action, meta]) => ({
        label: meta.label,
        color: meta.color
      }))
    }
    if (colorMode === 'ndvi') {
      return [
        { label: '≥0.75', color: '#1fa356' },
        { label: '0.65-0.75', color: '#2fbf6b' },
        { label: '0.55-0.65', color: '#a3d635' },
        { label: '0.45-0.55', color: '#f5b942' },
        { label: '<0.45', color: '#f07b2d' }
      ]
    }
    if (colorMode === 'ndmi') {
      return [
        { label: '≥0.35', color: '#38bdf8' },
        { label: '0.25-0.35', color: '#4dd484' },
        { label: '0.15-0.25', color: '#f5b942' },
        { label: '0.05-0.15', color: '#f07b2d' },
        { label: '<0.05', color: '#e5484d' }
      ]
    }
    return []
  }

  return (
    <div className="relative h-screen w-full">
      {/* Layers Panel */}
      <div className="absolute left-4 top-4 z-[1000] rounded-xl border border-night-700 bg-night-850 p-4 w-64">
        <h3 className="font-display text-sm font-semibold text-white mb-3">Layers</h3>
        <div className="space-y-2">
          <div className="mb-3">
            <label className="text-xs text-slate-400 block mb-2">Base Map</label>
            <div className="flex gap-2">
              <button
                onClick={() => setBaseMap('basic')}
                className={`flex-1 rounded px-2 py-1 text-xs transition-colors ${
                  baseMap === 'basic'
                    ? 'bg-cane-600 text-white'
                    : 'bg-night-800 text-slate-300 hover:bg-night-700'
                }`}
              >
                Basic
              </button>
              <button
                onClick={() => setBaseMap('satellite')}
                className={`flex-1 rounded px-2 py-1 text-xs transition-colors ${
                  baseMap === 'satellite'
                    ? 'bg-cane-600 text-white'
                    : 'bg-night-800 text-slate-300 hover:bg-night-700'
                }`}
              >
                Satellite
              </button>
            </div>
          </div>

          <div className="border-t border-night-700 pt-3">
            <label className="text-xs text-slate-400 block mb-2">Overlays</label>
            {Object.entries({
              sugarcane: 'Sugarcane Fields',
              classification: 'Crop Classification',
              ndvi: 'NDVI',
              ndmi: 'NDMI',
              stress: 'Moisture Stress',
              stage: 'Growth Stage',
              priority: 'Irrigation Priority'
            }).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={layers[key as keyof typeof layers]}
                  onChange={(e) => setLayers({ ...layers, [key]: e.target.checked })}
                  className="rounded border-night-600 bg-night-800 text-cane-600 focus:ring-cane-600"
                />
                <span className="text-xs text-slate-300">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className="text-xs text-slate-400 block mb-2">Opacity</label>
          <input
            type="range"
            min="15"
            max="85"
            value={opacity}
            onChange={(e) => setOpacity(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="mt-4">
          <label className="text-xs text-slate-400 block mb-2">Color Mode</label>
          <select
            value={colorMode}
            onChange={(e) => setColorMode(e.target.value as ColorMode)}
            className="w-full rounded border border-night-600 bg-night-800 px-2 py-1 text-xs text-white"
          >
            <option value="stress">Moisture Stress</option>
            <option value="stage">Growth Stage</option>
            <option value="priority">Irrigation Priority</option>
            <option value="ndvi">NDVI</option>
            <option value="ndmi">NDMI</option>
          </select>
        </div>

        {/* Legend */}
        <div className="mt-4">
          <div className="text-xs text-slate-400 mb-2">Legend</div>
          <div className="space-y-1">
            {getLegendItems().map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[10px] text-slate-300">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Right Badge */}
      <div className="absolute right-4 top-4 z-[1000] rounded-full border border-night-700 bg-night-800 px-4 py-2">
        <span className="text-[11px] text-slate-300">
          Baitul, Madhya Pradesh · Sugarcane Remote Sensing Study Area · DEMO
        </span>
      </div>

      {/* Map */}
      <MapContainer
        center={BAITUL_CENTER}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          key={baseMap}
          url={baseMap === 'basic' 
            ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
            : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
          }
          attribution={baseMap === 'basic'
            ? '&copy; OpenStreetMap contributors'
            : '&copy; <a href="https://www.esri.com/">Esri</a>'
          }
        />

        {/* Baitul Boundary */}
        <Polygon
          positions={BAITUL_BOUNDARY}
          color="#2fbf6b"
          weight={2}
          dashArray="5,5"
          fillOpacity={0}
        />

        {/* Non-cane plots */}
        {layers.classification &&
          NON_CANE_PLOTS.map((plot) => (
            <Polygon
              key={`${plot.id}-${opacity}`}
              positions={plot.polygon}
              color="#64748b"
              weight={2}
              dashArray="3,3"
              fillOpacity={opacity / 100}
              fillColor="#64748b"
            />
          ))}

        {/* Sugarcane fields */}
        {layers.sugarcane &&
          FIELDS.map((field) => (
            <Polygon
              key={`${field.id}-${colorMode}-${opacity}`}
              positions={field.polygon}
              color={getColorForField(field)}
              weight={2}
              fillOpacity={opacity / 100}
              fillColor={getColorForField(field)}
              eventHandlers={{
                click: () => setSelectedField(field.id),
                mouseover: (e) => e.target.openPopup(),
              }}
            >
              <Popup>
                <div className="text-xs">
                  <div className="font-semibold">{field.id}</div>
                  <div>{field.village}</div>
                  <div>NDVI: {field.ndvi.toFixed(3)}</div>
                  <div>NDMI: {field.ndmi.toFixed(3)}</div>
                  <div>Stress: {field.stressLevel}</div>
                </div>
              </Popup>
            </Polygon>
          ))}

        {/* Field centroids for selection */}
        {selectedField && (
          <CircleMarker
            center={FIELDS.find(f => f.id === selectedField)?.centroid || BAITUL_CENTER}
            radius={8}
            color="#e5484d"
            fillColor="#e5484d"
            fillOpacity={1}
          />
        )}
      </MapContainer>

      {/* Field Popup */}
      {selectedField && (() => {
        const field = FIELDS.find(f => f.id === selectedField)
        if (!field) return null
        return (
          <div className="absolute bottom-4 right-4 z-[1000] rounded-xl border border-night-700 bg-night-850 p-5 w-80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-white">{field.id}</h3>
              <button
                onClick={() => setSelectedField(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Village</span>
                <span className="text-white">{field.village}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Area</span>
                <span className="text-white">{field.areaHa.toFixed(1)} ha</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded border border-night-700 bg-night-800 p-2 text-center">
                <div className="text-[10px] text-slate-500">Stage</div>
                <div className="text-xs font-semibold" style={{ color: getStageColor(field.stage) }}>
                  {field.stage}
                </div>
              </div>
              <div className="rounded border border-night-700 bg-night-800 p-2 text-center">
                <div className="text-[10px] text-slate-500">Stress</div>
                <div className="text-xs font-semibold" style={{ color: getStressColor(field.stressLevel) }}>
                  {field.stressLevel}
                </div>
              </div>
              <div className="rounded border border-night-700 bg-night-800 p-2 text-center">
                <div className="text-[10px] text-slate-500">NDVI</div>
                <div className="text-xs font-semibold text-cane-400">{field.ndvi.toFixed(3)}</div>
              </div>
              <div className="rounded border border-night-700 bg-night-800 p-2 text-center">
                <div className="text-[10px] text-slate-500">NDMI</div>
                <div className="text-xs font-semibold text-signal-cyan">{field.ndmi.toFixed(3)}</div>
              </div>
            </div>
            <a
              href={`/fields/${field.id}`}
              className="mt-4 block w-full rounded-lg bg-cane-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-cane-700 transition-colors"
            >
              Open Field Intelligence
            </a>
          </div>
        )
      })()}
    </div>
  )
}
