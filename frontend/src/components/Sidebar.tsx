'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Map, 
  Radar, 
  ScanSearch, 
  Droplets, 
  Droplet, 
  Sprout, 
  LineChart, 
  Database, 
  MessageSquare, 
  Settings,
  Satellite
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/map', icon: Map, label: 'Map Explorer' },
  { href: '/fields', icon: Radar, label: 'Field Intelligence' },
  { href: '/detection', icon: ScanSearch, label: 'Crop Detection' },
  { href: '/stress', icon: Droplets, label: 'Moisture Stress' },
  { href: '/advisory', icon: Droplet, label: 'Irrigation Advisory' },
  { href: '/stages', icon: Sprout, label: 'Growth Stages' },
  { href: '/timeseries', icon: LineChart, label: 'Time Series' },
  { href: '/sources', icon: Database, label: 'Data Sources' },
  { href: '/copilot', icon: MessageSquare, label: 'CaneSense Copilot' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed left-0 top-0 h-full w-60 border-r border-night-700 bg-night-900">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="border-b border-night-700 px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <Satellite className="h-6 w-6 text-cane-400" />
            <div>
              <div className="font-display text-lg font-semibold text-white">CaneSense AI</div>
              <div className="text-[10px] text-slate-400">Sugarcane Intelligence</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      isActive
                        ? 'bg-cane-600/15 text-cane-300'
                        : 'text-slate-400 hover:bg-night-800 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-night-700 px-6 py-4">
          <div className="mb-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2">
            <div className="text-[10px] font-semibold text-amber-400">Demo Data</div>
            <div className="text-[9px] text-amber-300/70">Prototype build</div>
          </div>
          <div className="text-[10px] text-slate-500">Baitul, Madhya Pradesh</div>
        </div>
      </div>
    </div>
  )
}
