/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 统一主题配色 - 明亮活泼的儿童风格
        peppa: {
          // 主色调 - 蓝色
          blue: {
            DEFAULT: '#4A90E2',
            light: '#7AB8FF',
            lighter: '#B3D4FF',
            dark: '#2A70C2',
          },
          // 辅助色 - 青色
          cyan: {
            DEFAULT: '#26C6DA',
            light: '#4DD0E1',
            dark: '#0097A7',
          },
          // 绿色 - 成功
          green: {
            DEFAULT: '#4CAF50',
            light: '#66BB6A',
            dark: '#388E3C',
          },
          // 黄色 - 星星/成就
          yellow: {
            DEFAULT: '#FFD54F',
            light: '#FFE082',
            dark: '#FFB300',
          },
          // 橙色 - 警告/错误
          orange: {
            DEFAULT: '#FF9800',
            light: '#FFB74D',
            dark: '#E65100',
          },
          // 紫色 - 特殊
          purple: {
            DEFAULT: '#AB47BC',
            light: '#BA68C8',
            dark: '#7B1FA2',
          },
          // 红色 - 错误
          red: {
            DEFAULT: '#EF5350',
            light: '#E57373',
            dark: '#D32F2F',
          },
          // 背景色
          bg: {
            primary: '#E3F2FD',
            secondary: '#F5F9FF',
            card: '#FFFFFF',
          },
        },
      },
      fontFamily: {
        'rounded': ['"Alimama FangYuanTi VF"', 'Nunito', 'Comic Sans MS', 'cursive', 'sans-serif'],
      },
      animation: {
        'float': 'float 4s ease-in-out infinite',
        'pulse-gentle': 'pulseGentle 2.5s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'card-entrance': 'cardEntrance 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'button-entrance': 'buttonEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both',
        'title-glow': 'titleGlow 3s ease-in-out infinite',
        'slide-in': 'slideIn 0.5s ease-out',
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
      },
      borderRadius: {
        'cute': '16px',
        'cute-lg': '24px',
        'cute-xl': '32px',
        'cute-2xl': '40px',
        'pill': '9999px',
      },
      boxShadow: {
        'cute': '0 6px 20px rgba(74, 144, 226, 0.15)',
        'cute-lg': '0 10px 30px rgba(74, 144, 226, 0.2)',
        'cute-xl': '0 14px 40px rgba(74, 144, 226, 0.25)',
        'card': '0 4px 15px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 25px rgba(74, 144, 226, 0.2)',
      },
    },
  },
  plugins: [],
}
