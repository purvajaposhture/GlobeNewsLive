import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        'void': 'var(--bg-void)',
        'surface': 'var(--bg-surface)',
        'base': 'var(--bg-base)',
        'panel': 'var(--bg-panel)',
        'elevated': 'var(--bg-elevated)',
        'border-subtle': 'var(--border-subtle)',
        'border-default': 'var(--border-default)',
        'border-dim': 'var(--border-dim)',
        'border-glow': 'var(--border-glow)',
        'accent-cyan': 'var(--accent-cyan)',
        'accent-green': 'var(--accent-green)',
        'accent-amber': 'var(--accent-amber)',
        'accent-red': 'var(--accent-red)',
        'accent-purple': 'var(--accent-purple)',
        'accent-blue': 'var(--accent-blue)',
        'accent-orange': 'var(--accent-orange)',
        'accent-gold': 'var(--accent-gold)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'text-dim': 'var(--text-dim)',
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'IBM Plex Mono', 'monospace'],
        body: ['var(--font-body)', 'Inter', 'system-ui', 'sans-serif'],
        accent: ['var(--font-accent)', 'Orbitron', 'sans-serif'],
      }
    }
  },
  plugins: []
}
export default config
