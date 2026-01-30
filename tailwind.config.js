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
        // 移动端儿童数学游戏配色 - 温暖珊瑚+清新薄荷
        // ============================================
        game: {
          // 主色 - 活力珊瑚红（温暖、高能量、儿童喜欢）
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
          // 辅色 - 清新薄荷绿（活力、清爽、平衡）
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
          // 强调色 - 阳光金黄（快乐、醒目）
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
          // 中性色 - 高对比度移动端优化
          neutral: {
            // 背景色
            bg: {
              DEFAULT: '#FFFBF7',    // 奶油白
              light: '#FFFFFF',
              dark: '#FFF0E6',
              cream: '#FFFBF7',
            },
            // 卡片
            card: {
              DEFAULT: '#FFFFFF',
              secondary: '#FFF8F0',
              elevated: '#FFFFFF',
            },
            // 文字 - 高对比度确保户外可读
            text: {
              primary: '#1A1A2E',    // 深墨蓝，高对比
              secondary: '#4A5568',   // 深灰
              muted: '#718096',       // 中灰
              placeholder: '#A0AEC0', // 浅灰
            },
            // 边框
            border: {
              DEFAULT: '#E2E8F0',
              light: '#F1F5F9',
              dark: '#CBD5E1',
              focus: '#FF5757',
            },
          },
        },
        // ============================================
        // 原有 Peppa 配色（向后兼容）
        // ============================================
        peppa: {
          blue: {
            DEFAULT: '#4A90E2',
            light: '#7AB8FF',
            lighter: '#B3D4FF',
            dark: '#2A70C2',
          },
          cyan: {
            DEFAULT: '#26C6DA',
            light: '#4DD0E1',
            dark: '#0097A7',
          },
          green: {
            DEFAULT: '#4CAF50',
            light: '#66BB6A',
            dark: '#388E3C',
          },
          yellow: {
            DEFAULT: '#FFD54F',
            light: '#FFE082',
            dark: '#FFB300',
          },
          orange: {
            DEFAULT: '#FF9800',
            light: '#FFB74D',
            dark: '#E65100',
          },
          purple: {
            DEFAULT: '#AB47BC',
            light: '#BA68C8',
            dark: '#7B1FA2',
          },
          red: {
            DEFAULT: '#EF5350',
            light: '#E57373',
            dark: '#D32F2F',
          },
          bg: {
            primary: '#E3F2FD',
            secondary: '#F5F9FF',
            card: '#FFFFFF',
          },
        },
        // ============================================
        // 马卡龙色系 - 柔和鲜艳的新配色系统
        // ============================================
        macaron: {
          // 主色调 - 珊瑚粉
          primary: {
            DEFAULT: '#FF8A80',
            light: '#FFAB91',
            lighter: '#FFCCBC',
            dark: '#F4511E',
          },
          // 辅助色 - 天空蓝
          blue: {
            DEFAULT: '#4FC3F7',
            light: '#81D4FA',
            lighter: '#B3E5FC',
            dark: '#29B6F6',
          },
          // 薄荷绿
          mint: {
            DEFAULT: '#80CBC4',
            light: '#A5D6A7',
            lighter: '#C8E6C9',
            dark: '#66BB6A',
          },
          // 奶油黄
          cream: {
            DEFAULT: '#FFF176',
            light: '#FFF59D',
            lighter: '#FFF9C4',
            dark: '#FFEE58',
          },
          // 薰衣草紫
          lavender: {
            DEFAULT: '#CE93D8',
            light: '#E1BEE7',
            lighter: '#F3E5F5',
            dark: '#AB47BC',
          },
          // 蜜桃橙
          peach: {
            DEFAULT: '#FFAB91',
            light: '#FFCCBC',
            lighter: '#FBE9E7',
            dark: '#FF8A65',
          },
          // 成功绿
          success: {
            DEFAULT: '#A5D6A7',
            light: '#C8E6C9',
            dark: '#81C784',
          },
          // 警告橙
          warning: {
            DEFAULT: '#FFCC80',
            light: '#FFE0B2',
            dark: '#FFB74D',
          },
          // 背景色
          bg: {
            cream: '#FFF8E1',
            lavender: '#F3E5F5',
            mint: '#E0F7FA',
            white: '#FFFFFF',
          },
        },
        // ============================================
        // 阶段颜色 - 难度选择页使用
        // ============================================
        stage: {
          beginner: '#81C784',    // 入门 - 浅绿
          elementary: '#4FC3F7',  // 初级 - 天蓝
          intermediate: '#FFD54F',// 中级 - 金黄
          advanced: '#FF8A65',    // 进级 - 橙红
          expert: '#E57373',      // 高级 - 粉红
        },
        // ============================================
        // 糖果工坊色系 - Claymorphism 新设计系统
        // ============================================
        candy: {
          // 草莓粉
          berry: {
            DEFAULT: '#FF8FA3',
            light: '#FFB3C1',
            lighter: '#FFD1D9',
            dark: '#E85A70',
          },
          // 薄荷绿
          mint: {
            DEFAULT: '#98FF98',
            light: '#B8FFB8',
            lighter: '#D4FFD4',
            dark: '#6BCB77',
          },
          // 天空蓝
          sky: {
            DEFAULT: '#4FC3F7',
            light: '#81D4FA',
            lighter: '#B3E5FC',
            dark: '#29B6F6',
          },
          // 柠檬黄
          lemon: {
            DEFAULT: '#FFE66D',
            light: '#FFF5A0',
            lighter: '#FFF9D4',
            dark: '#FFD93D',
          },
          // 薰衣草紫
          lavender: {
            DEFAULT: '#CE93D8',
            light: '#E1BEE7',
            lighter: '#F3E5F5',
            dark: '#AB47BC',
          },
          // 蜜桃橙
          peach: {
            DEFAULT: '#FFAB91',
            light: '#FFCCBC',
            lighter: '#FBE9E7',
            dark: '#FF8A65',
          },
          // 奶油白背景
          cream: {
            DEFAULT: '#FFFBF5',
            light: '#FFFEF9',
            dark: '#FFF5E6',
          },
          // 巧克力文字
          choco: {
            DEFAULT: '#5D4E37',
            light: '#7A6A5A',
            dark: '#3D3225',
          },
        },
        // ============================================
        // 低龄儿童友好配色 - 温暖、柔和、亲切
        // ============================================
        toddler: {
          // 主色 - 温暖桃色（温暖、柔和、亲切）
          primary: {
            DEFAULT: '#F9A8D4',
            light: '#FBB8DC',
            lighter: '#FCD5E4',
            dark: '#F472B6',
            50: '#FDF2F8',
            100: '#FBCFE8',
            200: '#F9A8D4',
            300: '#F9A8D4',
            400: '#F9A8D4',
            500: '#F9A8D4',
            600: '#F472B6',
            700: '#DB2777',
            800: '#BE185D',
            900: '#9D174D',
          },
          // 辅助色 - 清新薄荷绿（活力、清新）
          secondary: {
            DEFAULT: '#6EE7B7',
            light: '#86EFAC',
            lighter: '#BBF7D0',
            dark: '#10B981',
            50: '#ECFDF5',
            100: '#D1FAE5',
            200: '#A7F3D0',
            300: '#6EE7B7',
            400: '#34D399',
            500: '#10B981',
            600: '#059669',
            700: '#047857',
            800: '#065F46',
            900: '#064E3B',
          },
          // CTA - 温暖橙色（温暖、引人注意）
          accent: {
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
          // 成功状态 - 薄荷绿
          success: {
            DEFAULT: '#10B981',
            light: '#6EE7B7',
            lighter: '#A7F3D0',
            dark: '#059669',
            50: '#ECFDF5',
            100: '#D1FAE5',
            200: '#A7F3D0',
            300: '#6EE7B7',
            400: '#34D399',
            500: '#10B981',
            600: '#059669',
            700: '#047857',
            800: '#065F46',
            900: '#064E3B',
          },
          // 警告 - 柔和黄色
          warning: {
            DEFAULT: '#FDE68A',
            light: '#FEF9C3',
            lighter: '#FFFBEB',
            dark: '#FCD34D',
            50: '#FFFBEB',
            100: '#FEF9C3',
            200: '#FDE68A',
            300: '#FDE68A',
            400: '#FDE68A',
            500: '#F59E0B',
            600: '#D97706',
            700: '#B45309',
            800: '#92400E',
            900: '#78350F',
          },
          // 错误状态 - 柔和红色
          error: {
            DEFAULT: '#FCA5A5',
            light: '#FECACA',
            lighter: '#FEE2E2',
            dark: '#F87171',
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
            // 背景色
            bg: {
              DEFAULT: '#FFF7ED',
              light: '#FFFBEB',
              dark: '#FEF3C7',
            },
            // 卡片
            card: {
              DEFAULT: '#FFFFFF',
              secondary: '#FFFBEB',
            },
            // 文字
            text: {
              primary: '#9D174D',
              secondary: '#6B7280',
              muted: '#9CA3AF',
            },
            // 边框
            border: {
              DEFAULT: '#FBCFE8',
              light: '#FDF2F8',
              dark: '#F9A8D4',
            },
          },
        },
        // ============================================
        // 男孩友好配色系统 - 现代科技感（向后兼容）
        // ============================================
        boy: {
          // 主色 - 靛蓝（科技感、稳重）
          primary: {
            DEFAULT: '#4F46E5',
            light: '#6366F1',
            lighter: '#818CF8',
            dark: '#3730A3',
            50: '#EEF2FF',
            100: '#E0E7FF',
            200: '#C7D2FE',
            300: '#A5B4FC',
            400: '#818CF8',
            500: '#6366F1',
            600: '#4F46E5',
            700: '#4338CA',
            800: '#3730A3',
            900: '#312E81',
          },
          // 辅助色 - 活力橙（能量、进取）
          accent: {
            DEFAULT: '#F97316',
            light: '#FB923C',
            lighter: '#FDBA74',
            dark: '#EA580C',
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
          // 科技绿 - 成功状态
          success: {
            DEFAULT: '#22C55E',
            light: '#4ADE80',
            lighter: '#86EFAC',
            dark: '#16A34A',
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
          // 警告黄
          warning: {
            DEFAULT: '#EAB308',
            light: '#FACC15',
            lighter: '#FDE047',
            dark: '#CA8A04',
            50: '#FEFCE8',
            100: '#FEF9C3',
            200: '#FEF08A',
            300: '#FDE047',
            400: '#FACC15',
            500: '#EAB308',
            600: '#CA8A04',
            700: '#A16207',
            800: '#854D0E',
            900: '#713F12',
          },
          // 错误红
          error: {
            DEFAULT: '#EF4444',
            light: '#F87171',
            lighter: '#FCA5A5',
            dark: '#DC2626',
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
            // 背景色
            bg: {
              DEFAULT: '#F1F5F9',
              light: '#F8FAFC',
              dark: '#E2E8F0',
            },
            // 卡片
            card: {
              DEFAULT: '#FFFFFF',
              secondary: '#F8FAFC',
            },
            // 文字
            text: {
              primary: '#1E293B',
              secondary: '#64748B',
              muted: '#94A3B8',
            },
            // 边框
            border: {
              DEFAULT: '#E2E8F0',
              light: '#F1F5F9',
              dark: '#CBD5E1',
            },
          },
        },
      },
      fontSize: {
        // 儿童友好的字体大小 - 更大更易读
        'child-xs': ['14px', { lineHeight: '1.6' }],
        'child-sm': ['16px', { lineHeight: '1.6' }],
        'child-base': ['18px', { lineHeight: '1.6' }], // 儿童最小基础字体
        'child-lg': ['22px', { lineHeight: '1.5' }],
        'child-xl': ['26px', { lineHeight: '1.4' }],
        'child-2xl': ['32px', { lineHeight: '1.3' }],
        'child-3xl': ['40px', { lineHeight: '1.2' }],
        'child-4xl': ['48px', { lineHeight: '1.1' }],
      },
      spacing: {
        // 触摸友好的间距
        'touch-sm': '8px',   // 最小触摸间距
        'touch-md': '12px',  // 推荐触摸间距
        'touch-lg': '16px',  // 大触摸间距
        'touch-xl': '24px',  // 超大触摸间距
        // 儿童友好的组件尺寸
        'child-btn-sm': '48px',  // 小按钮最小尺寸
        'child-btn-md': '64px',  // 标准按钮尺寸
        'child-btn-lg': '80px',  // 大按钮尺寸
        'child-card': '88px',    // 卡片最小高度
      },
      animation: {
        // 基础动画
        'float': 'float 4s ease-in-out infinite',
        'pulse-gentle': 'pulseGentle 2.5s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'card-entrance': 'cardEntrance 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'button-entrance': 'buttonEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'title-glow': 'titleGlow 3s ease-in-out infinite',
        'slide-in': 'slideIn 0.5s ease-out',
        // 交互动画
        'wiggle': 'wiggle 0.5s ease-in-out',
        'shake': 'shake 0.5s ease-in-out',
        'pop': 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'elastic': 'elastic 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'spin-slow': 'spin 8s linear infinite',
        'star-twinkle': 'starTwinkle 2s ease-in-out infinite',
        // 儿童友好的交互动画
        'touch-feedback': 'touchFeedback 0.15s ease-out',
        'celebration': 'celebration 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'gentle-bounce': 'gentleBounce 0.4s ease-out',
        'success-glow': 'successGlow 1s ease-out',
        // Claymorphism 新动画
        'pop-clay': 'popClay 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'celebrate-clay': 'celebrateClay 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'jelly-clay': 'jellyClay 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'float-clay': 'floatClay 3s ease-in-out infinite',
        'glow-clay': 'glowClay 2s ease-in-out infinite',
        'shake-clay': 'shakeClay 0.5s ease-in-out',
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
        titleGlow: {
          '0%, 100%': { textShadow: '0 0 10px rgba(74, 144, 226, 0.3)' },
          '50%': { textShadow: '0 0 25px rgba(74, 144, 226, 0.6), 0 0 35px rgba(74, 144, 226, 0.4)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // 新增关键帧
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
        elastic: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '60%': { transform: 'scale(1.1)' },
          '80%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        starTwinkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1) rotate(0deg)' },
          '50%': { opacity: '0.6', transform: 'scale(0.9) rotate(15deg)' },
        },
        // 儿童友好的交互动画关键帧
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
        // Claymorphism 新动画
        popClay: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(0.92)' },
          '70%': { transform: 'scale(1.03)' },
          '100%': { transform: 'scale(1)' },
        },
        celebrateClay: {
          '0%': { transform: 'scale(0.5) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'scale(1.15) rotate(5deg)' },
          '70%': { transform: 'scale(1.05) rotate(-3deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        jellyClay: {
          '0%, 100%': { transform: 'scale(1, 1)' },
          '25%': { transform: 'scale(0.95, 1.05)' },
          '50%': { transform: 'scale(1.05, 0.95)' },
          '75%': { transform: 'scale(0.98, 1.02)' },
        },
        floatClay: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '33%': { transform: 'translateY(-8px) rotate(2deg)' },
          '66%': { transform: 'translateY(-4px) rotate(-1deg)' },
        },
        glowClay: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255, 143, 163, 0.4)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 143, 163, 0.8), 0 0 30px rgba(255, 143, 163, 0.4)' },
        },
        shakeClay: {
          '0%, 100%': { transform: 'translateX(0) rotate(0deg)' },
          '10%': { transform: 'translateX(-6px) rotate(-2deg)' },
          '20%': { transform: 'translateX(6px) rotate(2deg)' },
          '30%': { transform: 'translateX(-4px) rotate(-1deg)' },
          '40%': { transform: 'translateX(4px) rotate(1deg)' },
          '50%': { transform: 'translateX(-2px) rotate(0deg)' },
          '60%': { transform: 'translateX(2px) rotate(0deg)' },
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
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        // ============================================
        // 移动端儿童数学游戏阴影 - 珊瑚红主题
        // ============================================
        'game': '0 2px 8px rgba(255, 87, 87, 0.08), 0 1px 4px rgba(0, 0, 0, 0.06)',
        'game-lg': '0 4px 16px rgba(255, 87, 87, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
        'game-xl': '0 8px 32px rgba(255, 87, 87, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
        'game-button': '0 3px 0 0 #B32525, 0 4px 12px rgba(255, 87, 87, 0.3)',
        'game-button-hover': '0 5px 0 0 #B32525, 0 8px 20px rgba(255, 87, 87, 0.4)',
        'game-button-active': '0 1px 0 0 #B32525, 0 2px 8px rgba(255, 87, 87, 0.3)',
        'game-glow': '0 0 20px rgba(255, 87, 87, 0.5)',
        'game-glow-success': '0 0 20px rgba(74, 222, 128, 0.5)',
        'game-glow-accent': '0 0 20px rgba(255, 193, 7, 0.5)',
        // 统一的可爱阴影系统
        'cute': '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.06)',
        'cute-lg': '0 4px 16px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.08)',
        'cute-xl': '0 8px 32px rgba(0, 0, 0, 0.12), 0 4px 16px rgba(0, 0, 0, 0.1)',
        // 儿童友好的阴影系统 - 统一的阴影体系
        'child-soft': '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04)',
        'child-medium': '0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.06)',
        'child-large': '0 8px 24px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.08)',
        'child-button': '0 3px 0 0 rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.1)',
        'child-button-hover': '0 5px 0 0 rgba(0, 0, 0, 0.1), 0 8px 20px rgba(0, 0, 0, 0.15)',
        'child-button-active': '0 1px 0 0 rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.1)',
        // 卡片阴影
        'card': '0 2px 12px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 24px rgba(0, 0, 0, 0.12)',
        // 低龄儿童友好阴影系统
        'toddler-primary': '0 0 20px rgba(249, 168, 212, 0.4)',
        'toddler-success': '0 0 20px rgba(16, 185, 129, 0.4)',
        'toddler-warning': '0 0 20px rgba(253, 230, 138, 0.4)',
        'toddler-error': '0 0 20px rgba(252, 165, 165, 0.4)',
        'toddler-accent': '0 0 20px rgba(251, 146, 60, 0.4)',
        // 轻量柔和阴影系统（向后兼容）
        'soft-primary': '0 0 20px rgba(14, 165, 233, 0.4)',
        'soft-success': '0 0 20px rgba(16, 185, 129, 0.4)',
        'soft-warning': '0 0 20px rgba(251, 191, 36, 0.4)',
        'soft-error': '0 0 20px rgba(248, 113, 113, 0.4)',
        'soft-accent': '0 0 20px rgba(251, 191, 36, 0.4)',
        // 男孩友好阴影系统（向后兼容）
        'boy-primary': '0 0 20px rgba(79, 70, 229, 0.5)',
        'boy-success': '0 0 20px rgba(34, 197, 94, 0.5)',
        'boy-warning': '0 0 20px rgba(234, 179, 8, 0.5)',
        'boy-error': '0 0 20px rgba(239, 68, 68, 0.5)',
        'boy-accent': '0 0 20px rgba(249, 115, 22, 0.5)',
        // 特殊效果阴影
        'glow': '0 0 20px rgba(79, 195, 247, 0.4)',
        'glow-green': '0 0 20px rgba(129, 199, 132, 0.4)',
        'glow-pink': '0 0 20px rgba(255, 138, 128, 0.4)',
        'glow-yellow': '0 0 20px rgba(255, 213, 79, 0.4)',
        // Claymorphism 双边阴影系统
        'clay': '4px 4px 12px rgba(0, 0, 0, 0.1), -2px -2px 8px rgba(255, 255, 255, 0.8), inset -2px -2px 6px rgba(0, 0, 0, 0.05), inset 2px 2px 6px rgba(255, 255, 255, 0.8)',
        'clay-hover': '6px 6px 16px rgba(0, 0, 0, 0.12), -3px -3px 10px rgba(255, 255, 255, 0.9), inset -2px -2px 6px rgba(0, 0, 0, 0.05), inset 2px 2px 6px rgba(255, 255, 255, 0.8)',
        'clay-active': '2px 2px 6px rgba(0, 0, 0, 0.1), -1px -1px 4px rgba(255, 255, 255, 0.8), inset -3px -3px 8px rgba(0, 0, 0, 0.08), inset 3px 3px 8px rgba(255, 255, 255, 0.6)',
        'clay-card': '8px 8px 20px rgba(0, 0, 0, 0.08), -4px -4px 12px rgba(255, 255, 255, 0.9), inset -2px -2px 8px rgba(0, 0, 0, 0.03), inset 2px 2px 8px rgba(255, 255, 255, 0.9)',
        'clay-pressed': '4px 4px 10px rgba(0, 0, 0, 0.08), -2px -2px 8px rgba(255, 255, 255, 0.9), inset -3px -3px 8px rgba(0, 0, 0, 0.08), inset 3px 3px 8px rgba(255, 255, 255, 0.6)',
        'clay-button': '4px 4px 10px rgba(0, 0, 0, 0.08), -2px -2px 6px rgba(255, 255, 255, 1), inset -1px -1px 4px rgba(0, 0, 0, 0.03), inset 1px 1px 4px rgba(255, 255, 255, 0.9)',
        'clay-planet': '6px 6px 16px rgba(0, 0, 0, 0.12), -4px -4px 12px rgba(255, 255, 255, 0.9), inset -3px -3px 8px rgba(0, 0, 0, 0.05), inset 3px 3px 8px rgba(255, 255, 255, 0.9)',
        'glow-berry': '0 0 20px rgba(255, 143, 163, 0.5)',
        'glow-mint': '0 0 20px rgba(152, 255, 152, 0.5)',
        'glow-sky': '0 0 20px rgba(79, 195, 247, 0.5)',
        'glow-lemon': '0 0 20px rgba(255, 230, 109, 0.5)',
      },
      transitionTimingFunction: {
        'bounce-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'elastic': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  },
  plugins: [],
}
