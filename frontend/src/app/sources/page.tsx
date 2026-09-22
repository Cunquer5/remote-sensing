'use client'

import { PageHeader } from '@/components/PageHeader'
import { Panel } from '@/components/ui'
import { Database, Satellite, Cloud, CloudRain, Globe, Layers, Server } from 'lucide-react'

export default function SourcesPage() {
  const dataSources = [
    {
      icon: Satellite,
      name: 'Sentinel-2 (MSI)',
      provider: 'ESA/Copernicus',
      resolution: '10m',
      frequency: '~5 days',
      availability: 'pending',
      usage: 'Primary source for NDVI, NDMI, NDWI, EVI calculations and crop classification'
    },
    {
      icon: Satellite,
      name: 'Sentinel-1 (SAR)',
      provider: 'ESA/Copernicus',
      resolution: '10m',
      frequency: '6-12 days',
      availability: 'pending',
      usage: 'All-weather imagery for moisture stress detection and crop monitoring'
    },
    {
      icon: Globe,
      name: 'Landsat 8/9',
      provider: 'USGS/NASA',
      resolution: '30m',
      frequency: '16 days',
      availability: 'pending',
      usage: 'Historical baseline data and supplementary vegetation indices'
    },
    {
      icon: CloudRain,
      name: 'MODIS/VIIRS',
      provider: 'NASA/NOAA',
      resolution: '250m-1km',
      frequency: 'daily',
      availability: 'pending',
      usage: 'Coarse-resolution vegetation monitoring and weather context'
    },
    {
      icon: Cloud,
      name: 'Weather & Precipitation',
      provider: 'CHIRPS/IMD/ERA5',
      resolution: '5-25km',
      frequency: 'daily',
      availability: 'pending',
      usage: 'Rainfall data for irrigation advisory and water balance calculations'
    },
    {
      icon: Layers,
      name: 'FAO WaPOR',
      provider: 'FAO',
      resolution: '30-250m',
      frequency: '10-daily/monthly',
      availability: 'pending',
      usage: 'Evapotranspiration and biomass productivity data'
    },
    {
      icon: Database,
      name: 'Google Earth Engine',
      provider: 'Google',
      resolution: 'platform',
      frequency: 'on-demand',
      availability: 'pending',
      usage: 'Cloud computing platform for satellite data processing and analysis'
    },
    {
      icon: Server,
      name: 'PostgreSQL/PostGIS',
      provider: 'Self-hosted',
      resolution: 'N/A',
      frequency: 'N/A',
      availability: 'pending',
      usage: 'Spatial database for storing field boundaries, time-series data, and query results'
    }
  ]

  return (
    <div className="min-h-screen bg-night-950">
      <PageHeader
        title="Data Sources"
        subtitle="Satellite imagery, weather data, and processing infrastructure"
      />

      <div className="px-8 py-6">
        {/* Demo Mode Banner */}
        <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
          <div className="flex items-start gap-3">
            <Database className="h-5 w-5 text-amber-400 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-amber-300">Demo Mode</h4>
              <p className="text-xs text-amber-200/80 mt-1">
                This platform is currently running in demo mode with synthetic data. Live data connections to the sources listed below are not yet established. Production deployment will require integration with actual satellite data providers and weather APIs.
              </p>
            </div>
          </div>
        </div>

        {/* Data Sources Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dataSources.map((source, i) => {
            const Icon = source.icon
            return (
              <div key={i} className="rounded-xl border border-night-700 bg-night-850 p-5">
                <div className="mb-4 rounded-lg bg-cane-600/20 p-3 w-fit">
                  <Icon className="h-6 w-6 text-cane-400" />
                </div>
                <h3 className="font-display text-lg font-semibold text-white mb-1">{source.name}</h3>
                <p className="text-xs text-slate-500 mb-3">{source.provider}</p>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Resolution</span>
                    <span className="text-white">{source.resolution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Frequency</span>
                    <span className="text-white">{source.frequency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Availability</span>
                    <span className="text-amber-400">{source.availability}</span>
                  </div>
                </div>
                <p className="mt-3 text-xs text-slate-400 leading-relaxed">{source.usage}</p>
              </div>
            )
          })}
        </div>

        {/* Integration Architecture */}
        <Panel title="Integration architecture" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="rounded-lg border border-night-700 bg-night-800 p-4">
              <div className="text-sm font-medium text-white mb-2">Data Adapters</div>
              <p className="text-xs text-slate-500">
                Standardized connectors for each satellite and weather data source with automatic retry and error handling
              </p>
            </div>
            <div className="rounded-lg border border-night-700 bg-night-800 p-4">
              <div className="text-sm font-medium text-white mb-2">Processing Layer</div>
              <p className="text-xs text-slate-500">
                Cloud masking, compositing, index calculation, and quality control pipelines running on GEE
              </p>
            </div>
            <div className="rounded-lg border border-night-700 bg-night-800 p-4">
              <div className="text-sm font-medium text-white mb-2">Model Layer</div>
              <p className="text-xs text-slate-500">
                Random Forest classification, stress detection models, and irrigation advisory algorithms
              </p>
            </div>
            <div className="rounded-lg border border-night-700 bg-night-800 p-4">
              <div className="text-sm font-medium text-white mb-2">Serving Layer</div>
              <p className="text-xs text-slate-500">
                REST API, PostGIS spatial queries, and real-time dashboard updates via WebSocket
              </p>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  )
}
