/** ASHE brand tokens. Palette comes from the live site; page background is pure white. */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ashe: { green: '#0E622A', deep: '#07401A', yellow: '#F9C61F', cream: '#FFFFFF', clay: '#E9B58A', mint: '#CFE9D3', ink: '#0F0F0F' },
      },
      fontFamily: {
        display: ['Anton', 'Impact', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      keyframes: { marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } } },
      animation: { marquee: 'marquee 30s linear infinite', 'spin-slow': 'spin 24s linear infinite' },
    },
  },
  plugins: [],
};
