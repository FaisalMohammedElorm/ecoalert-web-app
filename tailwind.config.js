/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ALX Bold Impact Design System
        'pure-white': '#ffffff',
        'emerald-green': '#02b75e',
        'lime-accent': '#c4e878',
        'navy-deep': '#03134f',
        'off-white-surface': '#f8f8f8',
        'charcoal-text': '#212529',
        'dark-navy-text': '#03134f',
        'electric-blue': '#0452f0',
        'ink-dark': '#1c1f2a',
        'border-subtle': '#d1d5db',

        // Eco green scale — environmental accent used across content pages
        'eco': {
          50: '#e7f9f0',
          100: '#c3f0db',
          200: '#8fe3bd',
          300: '#54d199',
          400: '#1fbd77',
          500: '#02b75e',
          600: '#029a4f',
          700: '#017a3f',
          800: '#015e31',
          900: '#014426',
        },

        // Backwards compatibility mapping (old color names → new palette)
        'alx': {
          navy: '#03134f',
          'navy-light': 'rgba(3, 19, 79, 0.5)',
          'navy-lighter': 'rgba(3, 19, 79, 0.3)',
          'navy-darker': 'rgba(3, 19, 79, 0.8)',
          lime: '#0452f0',
          'lime-dark': '#0340c0',
          'lime-light': '#0d5aff',
          gray: '#212529',
          'gray-light': '#f8f8f8',
          'gray-dark': '#1c1f2a',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
        mono: ['Poppins', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Hero headline
        'hero-display': ['70px', { lineHeight: '59.5px', fontWeight: '700', letterSpacing: '-3px' }],
        // Section headings
        'section-xl': ['52px', { lineHeight: '67.6px', fontWeight: '300' }],
        'section-lg': ['48px', { lineHeight: '62.4px', fontWeight: '700', letterSpacing: '-2.88px' }],
        'section-md': ['32px', { lineHeight: '41.6px', fontWeight: '700' }],
        // Subheading
        'subheading': ['28px', { lineHeight: '36.4px', fontWeight: '500' }],
        // Card & body
        'card-title': ['24px', { lineHeight: '36px', fontWeight: '500' }],
        'body-large': ['22px', { lineHeight: '33px', fontWeight: '400' }],
        'body-default': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-medium': ['20px', { lineHeight: '30px', fontWeight: '400' }],
        // Labels
        'label-default': ['15px', { lineHeight: '22.5px', fontWeight: '400' }],
        'label-emphasis': ['15px', { lineHeight: '28px', fontWeight: '500', letterSpacing: '-6%' }],
        // Caption
        'caption': ['12px', { lineHeight: '15px', fontWeight: '400' }],
      },
      spacing: {
        '1': '5px',
        '2': '8px',
        '3': '10px',
        '4': '12px',
        '5': '14px',
        '6': '15px',
        '7': '16px',
        '8': '18px',
        '9': '20px',
        '10': '22px',
        '11': '25px',
        '12': '26px',
        '13': '30px',
        '14': '35px',
        '15': '40px',
        '16': '45px',
        '17': '50px',
        '18': '70px',
      },
      borderRadius: {
        'sm': '5px',
        'md': '8px',
        'lg': '14px',
        'xl': '16px',
        '2xl': '20px',
        'pill': '9999px',
      },
      boxShadow: {
        'dropdown': '0px 1px 3px 0px rgba(16, 24, 40, 0.1)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'fade-down': 'fadeDown 0.4s ease forwards',
        'slide-in': 'slideIn 0.5s ease forwards',
        'slide-in-right': 'slideInRight 0.5s ease forwards',
        'slide-down': 'slideDown 0.5s ease forwards',
        'scale-in': 'scaleIn 0.5s ease forwards',
        'pulse-emerald': 'pulseEmerald 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeDown: {
          '0%': { opacity: '0', transform: 'translateY(-12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseEmerald: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(2, 183, 94, 0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(2, 183, 94, 0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(4, 82, 240, 0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(4, 82, 240, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
