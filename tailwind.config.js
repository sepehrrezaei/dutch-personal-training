/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        glaze: 'rgb(var(--glaze) / <alpha-value>)',
        paper: 'rgb(var(--paper) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        cobalt: 'rgb(var(--cobalt) / <alpha-value>)',
        'cobalt-soft': 'rgb(var(--cobalt-soft) / <alpha-value>)',
        oranje: 'rgb(var(--oranje) / <alpha-value>)',
        tulip: 'rgb(var(--tulip) / <alpha-value>)',
        polder: 'rgb(var(--polder) / <alpha-value>)',
        onprimary: 'rgb(var(--onprimary) / <alpha-value>)',
        de: 'rgb(var(--de) / <alpha-value>)',
        het: 'rgb(var(--het) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        sans: ['var(--font-sans)'],
      },
      borderRadius: { tile: '1.25rem' },
      boxShadow: {
        tile: '0 1px 0 rgb(var(--line)), 0 10px 30px -18px rgb(var(--cobalt) / var(--glow))',
        press: 'inset 0 -4px 0 rgb(0 0 0 / 0.18)',
      },
    },
  },
  plugins: [],
};
