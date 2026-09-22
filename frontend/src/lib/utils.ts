import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number, decimals: number = 1): string {
  return num.toFixed(decimals)
}

export function formatArea(ha: number): string {
  const acres = ha * 2.471
  return `${ha.toFixed(1)} ha (${acres.toFixed(1)} acres)`
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function getStressColor(level: string): string {
  const colors: Record<string, string> = {
    'none': '#2fbf6b',
    'low': '#a3d635',
    'moderate': '#f5b942',
    'high': '#f07b2d',
    'severe': '#e5484d'
  }
  return colors[level] || '#64748b'
}

export function getStageColor(stage: string): string {
  const colors: Record<string, string> = {
    'Establishment': '#38bdf8',
    'Early Vegetative': '#7ee2a8',
    'Tillering': '#4dd484',
    'Grand Growth': '#2fbf6b',
    'Maturity': '#f5b942',
    'Harvest': '#b08968'
  }
  return colors[stage] || '#64748b'
}
