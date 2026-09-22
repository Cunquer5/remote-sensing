import { Inter, Space_Grotesk, IBM_Plex_Mono } from 'next/font/google'

export const inter = Inter({ subsets: ['latin'], weight: ['300','400','500','600','700'], variable: '--font-inter', display: 'swap' })
export const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400','500','600','700'], variable: '--font-display', display: 'swap' })
export const plexMono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400','500','600'], variable: '--font-mono', display: 'swap' })
export const allFontVariables = [inter.variable, spaceGrotesk.variable, plexMono.variable].join(' ')
