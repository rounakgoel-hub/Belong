/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:        'var(--bg)',
        surface:   'var(--surface)',
        surface2:  'var(--surface2)',
        red:       'var(--red)',
        'red-light': 'var(--red-l)',
        cream:     'var(--text)',
        muted:     'var(--muted)',
        gold:      'var(--gold)',
        border:    'var(--border)',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderColor: {
        DEFAULT: 'rgba(255,249,239,0.08)',
      },
    },
  },
  plugins: [],
}
