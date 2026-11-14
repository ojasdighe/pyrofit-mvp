/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        strava: 'rgb(var(--brand-rgb) / <alpha-value>)',
        brand: 'rgb(var(--brand-rgb) / <alpha-value>)',
        'on-brand': 'var(--on-brand)',
        carbon: 'var(--carbon)',
        bg: 'var(--bg)',
        fg: 'var(--fg)',
        surface: 'var(--surface)',
        'surface-low': 'var(--surface)',
        'surface-high': 'var(--surface-high)',
        'surface-top': 'var(--surface-top)',
        border: 'var(--border)',
        'border-bright': 'var(--border-bright)',
        muted: 'var(--muted)',
        faint: 'var(--faint)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        oswald: ['Oswald', 'sans-serif'],
        space: ['"Space Grotesk"', 'sans-serif'],
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
