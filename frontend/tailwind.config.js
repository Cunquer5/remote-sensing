/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        night: {
          950: '#060d0a',
          900: '#0a1410',
          850: '#0d1a14',
          800: '#122219',
          700: '#1a2f23',
          600: '#24402f',
          500: '#31553f',
        },
        cane: {
          300: '#7ee2a8',
          400: '#4dd484',
          500: '#2fbf6b',
          600: '#1fa356',
          700: '#178546',
        },
        signal: {
          amber: '#f5b942',
          orange: '#f07b2d',
          red: '#e5484d',
          purple: '#a855f7',
          cyan: '#38bdf8',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
