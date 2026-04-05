/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"DM Sans"', 'sans-serif'],
        display: ['"Syne"', 'sans-serif'],
      },
      colors: {
        ink: {
          50:  '#f7f6f3',
          100: '#eceae3',
          200: '#d8d4c8',
          300: '#b8b2a0',
          400: '#918a77',
          500: '#736c5a',
          600: '#5c5648',
          700: '#4a4439',
          800: '#3d392f',
          900: '#2e2b23',
          950: '#1a1814',
        },
        amber: {
          400: '#f59e0b',
          500: '#d97706',
        }
      },
      animation: {
        'fade-up': 'fadeUp 0.4s ease both',
        'pulse-dot': 'pulseDot 1.4s ease-in-out infinite',
        'spin-slow': 'spin 2s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%, 80%, 100%': { transform: 'scale(0)', opacity: '0.3' },
          '40%': { transform: 'scale(1)', opacity: '1' },
        }
      }
    }
  },
  plugins: []
}
