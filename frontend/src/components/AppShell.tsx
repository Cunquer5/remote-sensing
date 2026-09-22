'use client'

import { usePathname } from 'next/navigation'
import { Sidebar } from './Sidebar'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()

  // Landing page doesn't have sidebar
  if (pathname === '/') {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-night-950 text-e6f0e9">
      <Sidebar />
      <main className="ml-60 flex-1">{children}</main>
    </div>
  )
}
