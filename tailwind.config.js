/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg:        '#1A1614',
        surface:   '#221E1C',
        surface2:  '#2E2825',
        red:       '#B52900',
        'red-light': '#E05A35',
        cream:     '#FFF9EF',
        muted:     '#8A7E78',
        gold:      '#C9A84C',
        border:    'rgba(255,249,239,0.08)',
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
