import type { Metadata } from 'next'
import { allFontVariables } from './fonts'
import './globals.css'
import 'leaflet/dist/leaflet.css'
import { AppShell } from '@/components/AppShell'

export const metadata: Metadata = {
  title: 'CaneSense AI - Sugarcane Crop Intelligence',
  description: 'Satellite-powered intelligence for every stage of sugarcane growth. Remote sensing-based detection and classification of water stress in sugarcane using SAR imagery.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={allFontVariables}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  )
}
