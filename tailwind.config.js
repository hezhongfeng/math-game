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
      },
      fontFamily: {
        'rounded': ['"Alimama FangYuanTi VF"', 'Nunito', 'Comic Sans MS', 'cursive', 'sans-serif'],
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
        // 新增动画
        'bounce-gentle': 'bounceGentle 2s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'shake': 'shake 0.5s ease-in-out',
        'pop': 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'elastic': 'elastic 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'spin-slow': 'spin 8s linear infinite',
        'star-twinkle': 'starTwinkle 2s ease-in-out infinite',
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
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
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
        // 原有阴影
        'cute': '0 6px 20px rgba(74, 144, 226, 0.15)',
        'cute-lg': '0 10px 30px rgba(74, 144, 226, 0.2)',
        'cute-xl': '0 14px 40px rgba(74, 144, 226, 0.25)',
        'card': '0 4px 15px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 25px rgba(74, 144, 226, 0.2)',
        // Cliomorphism 风格 - 双层阴影系统
        'clay': '0 4px 0 0 rgba(0, 0, 0, 0.1), 0 6px 20px rgba(0, 0, 0, 0.1)',
        'clay-hover': '0 6px 0 0 rgba(0, 0, 0, 0.1), 0 10px 30px rgba(0, 0, 0, 0.15)',
        'clay-active': '0 2px 0 0 rgba(0, 0, 0, 0.1), 0 2px 10px rgba(0, 0, 0, 0.1)',
        'clay-inset': 'inset 0 3px 6px rgba(0, 0, 0, 0.1), inset 0 1px 3px rgba(0, 0, 0, 0.1)',
        // 光晕效果
        'glow': '0 0 20px rgba(79, 195, 247, 0.4)',
        'glow-green': '0 0 20px rgba(129, 199, 132, 0.4)',
        'glow-pink': '0 0 20px rgba(255, 138, 128, 0.4)',
        'glow-yellow': '0 0 20px rgba(255, 213, 79, 0.4)',
        // 玻璃拟态
        'glass': '0 8px 32px rgba(31, 38, 135, 0.15)',
        // 弥散阴影
        'diffuse': '0 20px 60px rgba(0, 0, 0, 0.08)',
        'diffuse-lg': '0 30px 80px rgba(0, 0, 0, 0.12)',
      },
      transitionTimingFunction: {
        'bounce-out': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        'elastic': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  },
  plugins: [],
}
