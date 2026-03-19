/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      xs: '375px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      fontFamily: {
        'display': ['"Noto Sans SC"', 'system-ui', '-apple-system', 'sans-serif'],
        'body': ['"Noto Sans SC"', 'system-ui', '-apple-system', 'sans-serif'],
        'number': ['"Nunito"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'child-2xs': ['14px', { lineHeight: '1.5', letterSpacing: '0.02em' }],
        'child-xs': ['16px', { lineHeight: '1.6', letterSpacing: '0.01em' }],
        'child-sm': ['18px', { lineHeight: '1.6', letterSpacing: '0' }],
        'child-base': ['20px', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
        'child-md': ['22px', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        'child-lg': ['24px', { lineHeight: '1.5', letterSpacing: '-0.02em' }],
        'child-xl': ['28px', { lineHeight: '1.4', letterSpacing: '-0.02em' }],
        'child-2xl': ['32px', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
        'child-3xl': ['38px', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        'child-4xl': ['46px', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
      },
      spacing: {
        'touch-sm': '8px',
        'touch-md': '12px',
        'touch-lg': '16px',
        'touch-xl': '24px',
        'child-btn-sm': '48px',
        'child-btn-md': '64px',
        'child-btn-lg': '80px',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out both',
        'card-entrance': 'cardEntrance 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'shake': 'shake 0.5s ease-in-out',
        'pop': 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'touch-feedback': 'touchFeedback 0.15s ease-out',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        cardEntrance: {
          '0%': { opacity: '0', transform: 'translateY(30px) scale(0.9)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        touchFeedback: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      borderRadius: {
        'cute': '16px',
        'cute-lg': '24px',
        'cute-xl': '32px',
        'cute-2xl': '40px',
        'pill': '9999px',
      },
    },
  },
  plugins: [
    function({ addVariant }) {
      addVariant('reduced-motion', '@media (prefers-reduced-motion: reduce)')
      addVariant('motion-safe', '@media (prefers-reduced-motion: no-preference)')
    }
  ],
}
