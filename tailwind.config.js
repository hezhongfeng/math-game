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
      colors: {
        brand: {
          primary: 'var(--brand-primary)',
          success: 'var(--brand-success)',
          reward: 'var(--brand-reward)',
          warning: 'var(--brand-warning)',
          alert: 'var(--brand-alert)',
          accent: 'var(--brand-accent)',
        },
        candy: {
          blue: 'var(--candy-blue)',
          mint: 'var(--candy-mint)',
          yellow: 'var(--candy-yellow)',
          peach: 'var(--candy-peach)',
          red: 'var(--candy-red)',
          accent: 'var(--candy-lavender)',
        }
      },
      fontFamily: {
        'display': ['"Noto Sans SC"', 'system-ui', '-apple-system', 'sans-serif'],
        'body': ['"Noto Sans SC"', 'system-ui', '-apple-system', 'sans-serif'],
        'number': ['"Nunito"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'cute': 'var(--radius-sm)',
        'cute-lg': 'var(--radius-md)',
        'cute-xl': 'var(--radius-lg)',
        'cute-2xl': 'var(--radius-xl)',
      },
      // 这里的动画定义仅作为补充，实际主要使用 animations.css 中的类
      animation: {
        'pop': 'pop var(--duration-normal) var(--ease-standard)',
        'bounce-subtle': 'success-jump var(--duration-slow) var(--ease-standard)',
      },
    },
  },
  plugins: [
    function({ addVariant }) {
      addVariant('reduced-motion', '@media (prefers-reduced-motion: reduce)')
    }
  ],
}
