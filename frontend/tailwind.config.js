/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        lab: {
          950: '#050810',
          900: '#0a1020',
          850: '#0f1730',
          800: '#141e3d',
          accent: '#22d3ee',
          accent2: '#34d399',
          muted: '#94a3b8',
        },
      },
      boxShadow: {
        glow: '0 0 40px rgba(34, 211, 238, 0.12)',
      },
    },
  },
  plugins: [],
};
