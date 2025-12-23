/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 男孩蓝色主题配色
        peppa: {
          blue: {
            DEFAULT: '#4A90E2',
            light: '#7AB8FF',
            dark: '#2A70C2',
            sky: '#5BA3F6',
          },
          cyan: {
            DEFAULT: '#00BCD4',
            light: '#26C6DA',
            dark: '#0097A7',
          },
          green: {
            DEFAULT: '#4CAF50',
            light: '#66BB6A',
            dark: '#388E3C',
            grass: '#8BC34A',
          },
          yellow: {
            DEFAULT: '#FFD93D',
            light: '#FFE066',
            dark: '#FFC700',
            sun: '#FFD700',
          },
          orange: {
            DEFAULT: '#FF9800',
            light: '#FFB74D',
            dark: '#E65100',
          },
          purple: {
            DEFAULT: '#9C27B0',
            light: '#AB47BC',
            dark: '#7B1FA2',
          },
          background: {
            DEFAULT: '#E3F2FD',
            light: '#F1F8E9',
            dark: '#BBDEFB',
          },
        },
        primary: {
          DEFAULT: '#4A90E2',
          light: '#7AB8FF',
          dark: '#2A70C2',
        },
        background: {
          light: '#F5F9FFF',
          white: '#FFFFFF',
          sky: '#E3F2FD',
        },
      },
      fontFamily: {
        'rounded': ['"Alimama FangYuanTi VF"', 'Nunito', 'Comic Sans MS', 'cursive', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'bounce-cute': 'bounceCute 0.5s ease-in-out',
        'bounce-happy': 'bounceHappy 1s ease-in-out',
        'pop': 'pop 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
        'wiggle-x': 'wiggleX 2s ease-in-out infinite',
        'wiggle-y': 'wiggleY 2s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'slide-in': 'slideIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        bounceCute: {
          '0%, 100%': { transform: 'translateY(0) scale(1)' },
          '50%': { transform: 'translateY(-20px) scale(1.1)' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        wiggleX: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        wiggleY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '25%': { transform: 'translateY(-5px)' },
          '75%': { transform: 'translateY(5px)' },
        },
        bounceHappy: {
          '0%, 100%': { transform: 'translateY(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateY(-15px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateY(-7px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        slideIn: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          'from': { opacity: '0', transform: 'scale(0.9)' },
          'to': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 183, 197, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 183, 197, 0.6)' },
        },
      },
      borderRadius: {
        'cute': '20px',
        'cute-lg': '30px',
        'cute-xl': '40px',
        'pill': '9999px',
      },
      boxShadow: {
        'cute': '0 8px 20px rgba(255, 183, 197, 0.3)',
        'cute-lg': '0 12px 30px rgba(255, 183, 197, 0.4)',
        'cute-xl': '0 16px 40px rgba(255, 183, 197, 0.5)',
        'glow-pink': '0 0 20px rgba(255, 183, 197, 0.5)',
        'glow-yellow': '0 0 20px rgba(255, 217, 61, 0.5)',
      },
    },
  },
  plugins: [],
}
