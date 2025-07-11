/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdff',
          500: '#00ff88',
          600: '#00e677',
          900: '#0a0a0f'
        },
        secondary: {
          500: '#0066ff',
          600: '#0052cc'
        },
        accent: {
          500: '#ff6b6b',
          600: '#ff5252'
        }
      },
      fontFamily: {
        primary: ['Orbitron', 'monospace'],
        secondary: ['Inter', 'sans-serif']
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'meteor': 'meteor 2s linear infinite',
        'twinkle': 'twinkle 4s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 255, 136, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(0, 255, 136, 0.6)' }
        },
        meteor: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        twinkle: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' }
        }
      }
    },
  },
  plugins: [],
}
