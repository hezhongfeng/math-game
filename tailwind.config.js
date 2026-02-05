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
        // ============================================
        // 数学游戏配色 - 森林冒险系（自然清新）
        // ============================================
        game: {
          // 主色 - 森林绿
          primary: {
            DEFAULT: '#4A7C59',
            light: '#5D9A6E',
            lighter: '#7BB383',
            dark: '#3A6347',
            50: '#E8F5EB',
            100: '#D1EBD7',
            200: '#A3D7B0',
            300: '#75C389',
            400: '#5D9A6E',
            500: '#4A7C59',
            600: '#3A6347',
            700: '#2F4F39',
            800: '#243B2B',
            900: '#1A281E',
          },
          // 辅色 - 阳光橙
          secondary: {
            DEFAULT: '#E8A838',
            light: '#F0BE5C',
            lighter: '#F5D085',
            dark: '#C48A26',
            50: '#FDF5E6',
            100: '#FAEBCC',
            200: '#F5D799',
            300: '#F0BE5C',
            400: '#E8A838',
            500: '#C48A26',
            600: '#A0701E',
            700: '#7C5617',
            800: '#5C4011',
            900: '#3C2A0B',
          },
          // 强调色 - 落叶黄
          accent: {
            DEFAULT: '#F4D03F',
            light: '#F7DC6F',
            lighter: '#FAE79C',
            dark: '#D4AC0D',
            50: '#FEF9E7',
            100: '#FCF3CF',
            200: '#F9E79F',
            300: '#F7DC6F',
            400: '#F4D03F',
            500: '#D4AC0D',
            600: '#B7950B',
            700: '#96730E',
            800: '#71560A',
            900: '#4C3907',
          },
          // 成功状态 - 嫩芽绿
          success: {
            DEFAULT: '#52C41A',
            light: '#73D13D',
            lighter: '#95DE64',
            dark: '#389E0D',
            50: '#F6FFED',
            100: '#D9F7BE',
            200: '#B7EB8F',
            300: '#95DE64',
            400: '#73D13D',
            500: '#52C41A',
            600: '#389E0D',
            700: '#237804',
            800: '#135200',
            900: '#092B00',
          },
          // 警告 - 温暖棕色
          warning: {
            DEFAULT: '#D4820D',
            light: '#E8A040',
            lighter: '#F0BC70',
            dark: '#A86608',
            50: '#FFF4E6',
            100: '#FFE4C0',
            200: '#FFD099',
            300: '#FFC070',
            400: '#E8A040',
            500: '#D4820D',
            600: '#A86608',
            700: '#7A4C06',
            800: '#5C3A04',
            900: '#3D2603',
          },
          // 错误 - 深红色
          error: {
            DEFAULT: '#CF4A4A',
            light: '#E06C6C',
            lighter: '#F09090',
            dark: '#A83232',
            50: '#FFF2F2',
            100: '#FFE0E0',
            200: '#FFC4C4',
            300: '#FF9E9E',
            400: '#E06C6C',
            500: '#CF4A4A',
            600: '#A83232',
            700: '#842828',
            800: '#631E1E',
            900: '#421414',
          },
          // 中性色 - 自然系
          neutral: {
            bg: {
              DEFAULT: '#F5F5DC',
              light: '#FAFAF0',
              dark: '#E8E8C8',
              cream: '#F5F5DC',
            },
            card: {
              DEFAULT: '#FFFFFF',
              secondary: '#F8F8E8',
              elevated: '#FFFFFF',
            },
            text: {
              primary: '#2C3E2C',
              secondary: '#4A5D4A',
              muted: '#6B7D6B',
              placeholder: '#8B9D8B',
            },
            border: {
              DEFAULT: '#D4D4B8',
              light: '#E8E8D0',
              dark: '#B8B8A0',
              focus: '#4A7C59',
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
        // 有限次数的装饰性动画（3次后停止）
        'float': 'float 4s ease-in-out 3',
        'pulse-gentle': 'pulseGentle 2.5s ease-in-out 3',
        // 入场动画 - 只播放一次
        'fade-in-up': 'fadeInUp 0.6s ease-out both',
        'card-entrance': 'cardEntrance 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'button-entrance': 'buttonEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'slide-in': 'slideIn 0.5s ease-out both',
        // 交互反馈动画
        'wiggle': 'wiggle 0.5s ease-in-out',
        'shake': 'shake 0.5s ease-in-out',
        'pop': 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'touch-feedback': 'touchFeedback 0.15s ease-out',
        'celebration': 'celebration 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'gentle-bounce': 'gentleBounce 0.4s ease-out',
        'success-glow': 'successGlow 1s ease-out',
        'bounce-in': 'bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '20%': { transform: 'translateY(-10px) rotate(3deg)' },
          '40%': { transform: 'translateY(5px) rotate(-1deg)' },
          '60%': { transform: 'translateY(-5px) rotate(1deg)' },
          '80%': { transform: 'translateY(5px) rotate(-1deg)' },
        },
        pulseGentle: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
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
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
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
        celebration: {
          '0%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
          '25%': { transform: 'scale(1.2) rotate(5deg)' },
          '50%': { transform: 'scale(1.1) rotate(-3deg)' },
          '75%': { transform: 'scale(1.15) rotate(2deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        gentleBounce: {
          '0%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-8px)' },
          '60%': { transform: 'translateY(-4px)' },
          '100%': { transform: 'translateY(0)' },
        },
        successGlow: {
          '0%': { boxShadow: '0 0 0 rgba(129, 199, 132, 0)' },
          '50%': { boxShadow: '0 0 20px rgba(129, 199, 132, 0.6)' },
          '100%': { boxShadow: '0 0 0 rgba(129, 199, 132, 0)' },
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
        'game': '0 2px 8px rgba(74, 124, 89, 0.08), 0 1px 4px rgba(0, 0, 0, 0.06)',
        'game-lg': '0 4px 16px rgba(74, 124, 89, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
        'game-xl': '0 8px 32px rgba(74, 124, 89, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
        'game-button': '0 6px 0 0 var(--game-primary-dark), 0 10px 24px rgba(74, 124, 89, 0.35), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
        'game-button-hover': '0 8px 0 0 var(--game-primary-dark), 0 14px 32px rgba(74, 124, 89, 0.45), inset 0 2px 4px rgba(255, 255, 255, 0.4)',
        'game-button-active': '0 2px 0 0 var(--game-primary-dark), 0 4px 12px rgba(74, 124, 89, 0.3), inset 0 3px 6px rgba(0, 0, 0, 0.15)',
        'game-glow': '0 0 20px rgba(74, 124, 89, 0.5)',
        'game-glow-success': '0 0 20px rgba(82, 196, 26, 0.5)',
        'game-glow-accent': '0 0 20px rgba(244, 208, 63, 0.5)',
        'game-card': '8px 8px 16px rgba(0, 0, 0, 0.08), -8px -8px 16px rgba(255, 255, 255, 0.9), inset 1px 1px 2px rgba(255, 255, 255, 0.8)',
        'game-card-hover': '12px 12px 24px rgba(0, 0, 0, 0.12), -12px -12px 24px rgba(255, 255, 255, 0.95), inset 1px 1px 2px rgba(255, 255, 255, 0.8)',
        'game-card-pressed': 'inset 4px 4px 8px rgba(0, 0, 0, 0.08), inset -4px -4px 8px rgba(255, 255, 255, 0.6)',
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