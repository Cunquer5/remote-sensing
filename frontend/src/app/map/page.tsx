'use client'

import dynamic from 'next/dynamic'

const MapExplorer = dynamic(() => import('@/components/MapExplorer').then(mod => ({ default: mod.MapExplorer })), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center bg-night-950">
      <div className="text-slate-400">Loading map...</div>
    </div>
  )
})

export default function MapPage() {
  return <MapExplorer />
}
