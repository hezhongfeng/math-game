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
        // 简约科技风格配色系统
        game: {
          // 主色调 - 电光蓝
          primary: {
            DEFAULT: '#0066FF',
            light: '#3385FF',
            lighter: '#66A3FF',
            dark: '#0052CC',
            50: '#E6F0FF',
            100: '#CCE0FF',
            200: '#99C2FF',
            300: '#66A3FF',
            400: '#3385FF',
            500: '#0066FF',
            600: '#0052CC',
            700: '#003D99',
            800: '#002966',
            900: '#001433',
          },
          // 辅助色 - 能量绿
          secondary: {
            DEFAULT: '#00D084',
            light: '#33D99D',
            lighter: '#66E2B6',
            dark: '#00A86B',
            50: '#E6FAF3',
            100: '#CCF5E7',
            200: '#99EBCF',
            300: '#66E2B6',
            400: '#33D99D',
            500: '#00D084',
            600: '#00A86B',
            700: '#007F50',
            800: '#005536',
            900: '#002A1B',
          },
          // 强调色 - 闪电黄
          accent: {
            DEFAULT: '#FFC700',
            light: '#FFD633',
            lighter: '#FFE566',
            dark: '#E6B300',
            50: '#FFFBE6',
            100: '#FFF7CC',
            200: '#FFEF99',
            300: '#FFE766',
            400: '#FFDF33',
            500: '#FFC700',
            600: '#E6B300',
            700: '#B38A00',
            800: '#806200',
            900: '#4D3900',
          },
          // 成功状态 - 科技绿
          success: {
            DEFAULT: '#00D084',
            light: '#33D99D',
            lighter: '#66E2B6',
            dark: '#00A86B',
            50: '#E6FAF3',
            100: '#CCF5E7',
            200: '#99EBCF',
            300: '#66E2B6',
            400: '#33D99D',
            500: '#00D084',
            600: '#00A86B',
            700: '#007F50',
            800: '#005536',
            900: '#002A1B',
          },
          // 警告 - 活力橙
          warning: {
            DEFAULT: '#FF6B35',
            light: '#FF8A5D',
            lighter: '#FFAA85',
            dark: '#E65A24',
            50: '#FFF4EF',
            100: '#FFE9DF',
            200: '#FFD3BF',
            300: '#FFBD9F',
            400: '#FFA77F',
            500: '#FF6B35',
            600: '#E65A24',
            700: '#CC4A1A',
            800: '#A33A14',
            900: '#7A2B0F',
          },
          // 错误 - 警示红
          error: {
            DEFAULT: '#FF4757',
            light: '#FF6B79',
            lighter: '#FF8F9B',
            dark: '#E63344',
            50: '#FFEBED',
            100: '#FFD7DB',
            200: '#FFB0B7',
            300: '#FF8893',
            400: '#FF606E',
            500: '#FF4757',
            600: '#E63344',
            700: '#CC2635',
            800: '#A31E2A',
            900: '#7A1621',
          },
          // 中性色 - 简约灰
          neutral: {
            bg: {
              DEFAULT: '#F5F7FA',
              light: '#FFFFFF',
              dark: '#E8ECF1',
            },
            card: {
              DEFAULT: '#FFFFFF',
              secondary: '#FAFBFC',
              elevated: '#FFFFFF',
            },
            text: {
              primary: '#1A1A1A',
              secondary: '#666666',
              muted: '#999999',
              placeholder: '#CCCCCC',
            },
            border: {
              DEFAULT: '#E5E5E5',
              light: '#F0F0F0',
              dark: '#CCCCCC',
              focus: '#0066FF',
            },
          },
        },
      },
      fontFamily: {
        'display': ['"Noto Sans SC"', 'system-ui', '-apple-system', 'sans-serif'],
        'body': ['"Noto Sans SC"', 'system-ui', '-apple-system', 'sans-serif'],
        'number': ['"Noto Sans SC"', 'system-ui', '-apple-system', 'sans-serif'],
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
        // 简约入场动画
        'fade-in-up': 'fadeInUp 0.6s ease-out both',
        'card-entrance': 'cardEntrance 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'button-entrance': 'buttonEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        // 简约交互反馈动画
        'shake': 'shake 0.5s ease-in-out',
        'pop': 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'touch-feedback': 'touchFeedback 0.15s ease-out',
        'gentle-bounce': 'gentleBounce 0.4s ease-out',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
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
        buttonEntrance: {
          '0%': { opacity: '0', transform: 'translateY(40px) scale(0.8)' },
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
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        touchFeedback: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        gentleBounce: {
          '0%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-8px)' },
          '60%': { transform: 'translateY(-4px)' },
          '100%': { transform: 'translateY(0)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      borderRadius: {
        'cute': '16px',
        'cute-lg': '24px',
        'cute-xl': '32px',
        'cute-2xl': '40px',
        'pill': '9999px',
      },
      boxShadow: {
        // 简约阴影
        'game': '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.06)',
        'game-lg': '0 4px 16px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
        'game-xl': '0 8px 32px rgba(0, 0, 0, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
        // 霓虹发光效果 - 简约版
        'glow-blue': '0 0 20px rgba(0, 102, 255, 0.4)',
        'glow-green': '0 0 20px rgba(0, 208, 132, 0.4)',
        'glow-yellow': '0 0 20px rgba(255, 199, 0, 0.4)',
        'glow-orange': '0 0 20px rgba(255, 107, 53, 0.4)',
        // 按钮阴影
        'game-button': '0 6px 20px rgba(0, 102, 255, 0.3)',
        'game-button-hover': '0 8px 24px rgba(0, 102, 255, 0.4)',
        // 卡片阴影
        'game-card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'game-card-hover': '0 4px 16px rgba(0, 0, 0, 0.12)',
      },
      transitionTimingFunction: {
        'bounce-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'elastic': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  },
  // 添加减少动画支持插件
  plugins: [
    function({ addVariant }) {
      addVariant('reduced-motion', '@media (prefers-reduced-motion: reduce)')
      addVariant('motion-safe', '@media (prefers-reduced-motion: no-preference)')
    }
  ],
}
