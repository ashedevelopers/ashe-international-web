/** ASHE brand tokens extracted from the live site (asheinternational.org). */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ashe: {
          green: '#0E622A',
          'green-dark': '#07401A',
          'green-soft': '#9FC0AA',
          yellow: '#F9C61F',
          ink: '#0F0F0F',
          line: '#E6E6E6',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: { ashe: '10px', 'ashe-lg': '12px' },
      fontSize: {
        kinetic: ['clamp(3rem, 11vw, 10rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
      },
      keyframes: {
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
      animation: { marquee: 'marquee 30s linear infinite' },
    },
  },
  plugins: [],
};
