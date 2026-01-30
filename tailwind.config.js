/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ============================================
        // 数学游戏统一配色系统 - 珊瑚红主题
        // ============================================
        game: {
          // 主色 - 活力珊瑚红
          primary: {
            DEFAULT: '#FF5757',
            light: '#FF7A7A',
            lighter: '#FFB3B3',
            dark: '#E63E3E',
            50: '#FFF0F0',
            100: '#FFE0E0',
            200: '#FFC4C4',
            300: '#FF9E9E',
            400: '#FF7A7A',
            500: '#FF5757',
            600: '#E63E3E',
            700: '#CC2E2E',
            800: '#B32525',
            900: '#991F1F',
          },
          // 辅色 - 清新薄荷绿
          secondary: {
            DEFAULT: '#00D9C0',
            light: '#33E6D4',
            lighter: '#80F0E6',
            dark: '#00B8A3',
            50: '#E6FCFA',
            100: '#B3F5F0',
            200: '#80ECE4',
            300: '#4DE3D8',
            400: '#1ADACC',
            500: '#00D9C0',
            600: '#00B8A3',
            700: '#009E8C',
            800: '#008575',
            900: '#006B5E',
          },
          // 强调色 - 阳光金黄
          accent: {
            DEFAULT: '#FFC107',
            light: '#FFD54F',
            lighter: '#FFECB3',
            dark: '#FFAB00',
            50: '#FFF8E1',
            100: '#FFECB3',
            200: '#FFE082',
            300: '#FFD54F',
            400: '#FFCA28',
            500: '#FFC107',
            600: '#FFB300',
            700: '#FFAB00',
            800: '#FF8F00',
            900: '#FF6F00',
          },
          // 成功状态 - 明亮草绿
          success: {
            DEFAULT: '#4ADE80',
            light: '#6EE79C',
            lighter: '#A5F3C0',
            dark: '#22C55E',
            50: '#F0FDF4',
            100: '#DCFCE7',
            200: '#BBF7D0',
            300: '#86EFAC',
            400: '#4ADE80',
            500: '#22C55E',
            600: '#16A34A',
            700: '#15803D',
            800: '#166534',
            900: '#14532D',
          },
          // 警告 - 温暖橙色
          warning: {
            DEFAULT: '#FB923C',
            light: '#FDBA74',
            lighter: '#FED7AA',
            dark: '#F97316',
            50: '#FFF7ED',
            100: '#FFEDD5',
            200: '#FED7AA',
            300: '#FDBA74',
            400: '#FB923C',
            500: '#F97316',
            600: '#EA580C',
            700: '#C2410C',
            800: '#9A3412',
            900: '#7C2D12',
          },
          // 错误 - 鲜艳红色
          error: {
            DEFAULT: '#F87171',
            light: '#FCA5A5',
            lighter: '#FECACA',
            dark: '#EF4444',
            50: '#FEF2F2',
            100: '#FEE2E2',
            200: '#FECACA',
            300: '#FCA5A5',
            400: '#F87171',
            500: '#EF4444',
            600: '#DC2626',
            700: '#B91C1C',
            800: '#991B1B',
            900: '#7F1D1D',
          },
          // 中性色
          neutral: {
            bg: {
              DEFAULT: '#FFFBF7',
              light: '#FFFFFF',
              dark: '#FFF0E6',
              cream: '#FFFBF7',
            },
            card: {
              DEFAULT: '#FFFFFF',
              secondary: '#FFF8F0',
              elevated: '#FFFFFF',
            },
            text: {
              primary: '#1A1A2E',
              secondary: '#4A5568',
              muted: '#718096',
              placeholder: '#A0AEC0',
            },
            border: {
              DEFAULT: '#E2E8F0',
              light: '#F1F5F9',
              dark: '#CBD5E1',
              focus: '#FF5757',
            },
          },
        },
        // 阶段颜色 - 用于难度关卡
        stage: {
          beginner: '#22C55E',    // 入门 - 绿色 (game-success)
          elementary: '#F97316',  // 初级 - 橙色 (game-warning-dark)
          intermediate: '#FFC107',// 中级 - 黄色 (game-accent)
          advanced: '#FF5757',    // 进级 - 红色 (game-primary)
          expert: '#4F46E5',      // 高级 - 紫色
        },
      },
      fontFamily: {
        // 中文优先风格 - 阿里妈妈数黑体（标题/数字）+ 思源黑体（正文）
        'display': ['"Alimama ShuHeiTi"', '"Noto Sans SC"', 'system-ui', '-apple-system', 'sans-serif'],
        'body': ['"Noto Sans SC"', 'system-ui', '-apple-system', 'sans-serif'],
        'number': ['"Alimama ShuHeiTi"', '"Noto Sans SC"', 'system-ui', 'sans-serif'],
        // 向后兼容
        'child-friendly': ['"Alimama ShuHeiTi"', '"Noto Sans SC"', 'system-ui', '-apple-system', 'sans-serif'],
        'child-body': ['"Noto Sans SC"', 'system-ui', '-apple-system', 'sans-serif'],
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
        'child-card': '88px',
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-gentle': 'pulseGentle 2.5s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'card-entrance': 'cardEntrance 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'button-entrance': 'buttonEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'slide-in': 'slideIn 0.5s ease-out',
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
        'game': '0 2px 8px rgba(255, 87, 87, 0.08), 0 1px 4px rgba(0, 0, 0, 0.06)',
        'game-lg': '0 4px 16px rgba(255, 87, 87, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
        'game-xl': '0 8px 32px rgba(255, 87, 87, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
        'game-button': '0 3px 0 0 #B32525, 0 4px 12px rgba(255, 87, 87, 0.3)',
        'game-button-hover': '0 5px 0 0 #B32525, 0 8px 20px rgba(255, 87, 87, 0.4)',
        'game-button-active': '0 1px 0 0 #B32525, 0 2px 8px rgba(255, 87, 87, 0.3)',
        'game-glow': '0 0 20px rgba(255, 87, 87, 0.5)',
        'game-glow-success': '0 0 20px rgba(74, 222, 128, 0.5)',
        'game-glow-accent': '0 0 20px rgba(255, 193, 7, 0.5)',
        'cute': '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.06)',
        'cute-lg': '0 4px 16px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.08)',
        'cute-xl': '0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.1)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 24px rgba(0, 0, 0, 0.12)',
      },
      transitionTimingFunction: {
        'bounce-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'elastic': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  },
  plugins: [],
}