import Link from 'next/link'
import { Satellite, ArrowRight, LayoutDashboard, Map, Database, ScanSearch, Sprout, Droplets, Droplet } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-night-950">
      {/* Header */}
      <header className="border-b border-night-700 bg-night-900/50 px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Satellite className="h-7 w-7 text-cane-400" />
            <div>
              <div className="font-display text-xl font-semibold text-white">CaneSense AI</div>
              <div className="text-[10px] text-slate-400">Sugarcane Intelligence</div>
            </div>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/map" className="text-sm text-slate-400 hover:text-white transition-colors">
              Map Explorer
            </Link>
            <Link href="/sources" className="text-sm text-slate-400 hover:text-white transition-colors">
              Data Sources
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg bg-cane-600 px-4 py-2 text-sm font-medium text-white hover:bg-cane-700 transition-colors"
            >
              Open Platform
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-8 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left: Hero Content */}
            <div className="flex flex-col justify-center">
              <div className="mb-6 inline-flex items-center rounded-full border border-night-700 bg-night-800 px-4 py-2">
                <span className="text-[11px] font-medium text-cane-400">
                  Baitul, Madhya Pradesh — Sugarcane Remote Sensing Study Area
                </span>
              </div>
              <h1 className="font-display text-5xl font-semibold leading-tight text-white">
                Satellite-powered intelligence for every stage of{' '}
                <span className="text-cane-400">sugarcane growth</span>.
              </h1>
              <p className="mt-6 text-lg text-slate-400">
                Monitor crop health, detect moisture stress, and generate irrigation advisories using
                SAR satellite imagery and AI-powered analysis.
              </p>
              <div className="mt-8 flex gap-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-lg bg-cane-600 px-6 py-3 font-medium text-white hover:bg-cane-700 transition-colors"
                >
                  Explore Baitul Study Area
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/map"
                  className="inline-flex items-center gap-2 rounded-lg border border-night-700 bg-night-800 px-6 py-3 font-medium text-white hover:bg-night-700 transition-colors"
                >
                  View Live Crop Intelligence
                </Link>
              </div>
              <div className="mt-12 grid grid-cols-3 gap-6">
                <div>
                  <div className="font-display text-2xl font-semibold text-cane-400">10m</div>
                  <div className="text-sm text-slate-500">Resolution</div>
                </div>
                <div>
                  <div className="font-display text-2xl font-semibold text-cane-400">6</div>
                  <div className="text-sm text-slate-500">Growth Stages</div>
                </div>
                <div>
                  <div className="font-display text-2xl font-semibold text-cane-400">0-100</div>
                  <div className="text-sm text-slate-500">Stress Score</div>
                </div>
              </div>
            </div>

            {/* Right: Satellite Visualization */}
            <div className="relative">
              <div className="rounded-xl border border-night-700 bg-night-800 p-6">
                <svg
                  viewBox="0 0 400 300"
                  className="w-full"
                  style={{ backgroundColor: '#0a1410' }}
                >
                  {/* Grid */}
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1a2f23" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="400" height="300" fill="url(#grid)" />

                  {/* District Boundary */}
                  <polygon
                    points="100,50 100,250 150,270 200,280 250,270 300,250 300,50 250,30 200,20 150,30"
                    fill="none"
                    stroke="#2fbf6b"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />

                  {/* Field Rectangles */}
                  <rect x="120" y="80" width="30" height="25" fill="#2fbf6b" opacity="0.7" />
                  <rect x="160" y="70" width="35" height="30" fill="#a3d635" opacity="0.7" />
                  <rect x="200" y="85" width="28" height="22" fill="#f5b942" opacity="0.7" />
                  <rect x="240" y="75" width="32" height="28" fill="#2fbf6b" opacity="0.7" />
                  <rect x="130" y="120" width="25" height="35" fill="#f07b2d" opacity="0.7" />
                  <rect x="170" y="110" width="40" height="30" fill="#2fbf6b" opacity="0.7" />
                  <rect x="220" y="115" width="30" height="25" fill="#a3d635" opacity="0.7" />
                  <rect x="260" y="105" width="28" height="32" fill="#e5484d" opacity="0.7" />
                  <rect x="140" y="165" width="35" height="28" fill="#2fbf6b" opacity="0.7" />
                  <rect x="185" y="155" width="30" height="35" fill="#f5b942" opacity="0.7" />
                  <rect x="230" y="160" width="32" height="30" fill="#2fbf6b" opacity="0.7" />

                  {/* Pulsing Red Dot for BTL-024 */}
                  <circle cx="274" cy="119" r="6" fill="#e5484d">
                    <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
                  </circle>

                  {/* Coordinates Text */}
                  <text x="20" y="280" fill="#475569" fontSize="10" fontFamily="monospace">
                    21.9°N, 77.9°E
                  </text>
                </svg>

                {/* Metric Boxes */}
                <div className="mt-4 grid grid-cols-4 gap-2">
                  <div className="rounded border border-night-700 bg-night-850 p-2 text-center">
                    <div className="text-[10px] text-slate-500">NDVI</div>
                    <div className="font-display text-sm font-semibold text-cane-400">0.72</div>
                  </div>
                  <div className="rounded border border-night-700 bg-night-850 p-2 text-center">
                    <div className="text-[10px] text-slate-500">NDMI</div>
                    <div className="font-display text-sm font-semibold text-signal-cyan">0.28</div>
                  </div>
                  <div className="rounded border border-night-700 bg-night-850 p-2 text-center">
                    <div className="text-[10px] text-slate-500">Stress</div>
                    <div className="font-display text-sm font-semibold text-signal-red">68</div>
                  </div>
                  <div className="rounded border border-night-700 bg-night-850 p-2 text-center">
                    <div className="text-[10px] text-slate-500">Stage</div>
                    <div className="font-display text-sm font-semibold text-signal-amber">GG</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-night-700 bg-night-900/30 px-8 py-20">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-3xl font-semibold text-white">
            From satellite pixels to irrigation decisions
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-night-700 bg-night-850 p-6">
              <div className="mb-4 rounded-lg bg-cane-600/20 p-3 w-fit">
                <ScanSearch className="h-6 w-6 text-cane-400" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white">Crop Detection</h3>
              <p className="mt-2 text-sm text-slate-400">
                AI-powered classification of sugarcane fields using SAR imagery with 12-step processing pipeline.
              </p>
            </div>
            <div className="rounded-xl border border-night-700 bg-night-850 p-6">
              <div className="mb-4 rounded-lg bg-signal-cyan/20 p-3 w-fit">
                <Sprout className="h-6 w-6 text-signal-cyan" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white">Growth Stages</h3>
              <p className="mt-2 text-sm text-slate-400">
                Track phenological development across 6 stages from establishment to harvest.
              </p>
            </div>
            <div className="rounded-xl border border-night-700 bg-night-850 p-6">
              <div className="mb-4 rounded-lg bg-signal-red/20 p-3 w-fit">
                <Droplets className="h-6 w-6 text-signal-red" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white">Moisture Stress</h3>
              <p className="mt-2 text-sm text-slate-400">
                0-100 stress score with 5 severity levels based on NDMI, rainfall, and thermal data.
              </p>
            </div>
            <div className="rounded-xl border border-night-700 bg-night-850 p-6">
              <div className="mb-4 rounded-lg bg-signal-amber/20 p-3 w-fit">
                <Droplet className="h-6 w-6 text-signal-amber" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white">Irrigation Advisory</h3>
              <p className="mt-2 text-sm text-slate-400">
                Field-specific recommendations with confidence scores and priority rankings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-night-700 bg-night-900 px-8 py-6">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="text-sm text-slate-500">
            © 2026 CaneSense AI. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[10px] text-amber-400">
              DEMO DATA
            </span>
            <span className="text-[10px] text-slate-600">Prototype build</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
