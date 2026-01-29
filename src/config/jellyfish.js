/**
 * 水母动画配置
 * 将水母数据从 Home.vue 中提取出来，便于维护和复用
 */

// 水母类型配置
export const JELLYFISH_TYPES = {
  cute: { tentacles: 4, animation: 'floatJellyfish-cute' },
  playful: { tentacles: 5, animation: 'floatJellyfish-playful' },
  gentle: { tentacles: 3, animation: 'floatJellyfish-gentle' },
  bouncy: { tentacles: 6, animation: 'floatJellyfish-bouncy' },
  dreamy: { tentacles: 4, animation: 'floatJellyfish-dreamy' },
  elegant: { tentacles: 3, animation: 'floatJellyfish-elegant' },
  mysterious: { tentacles: 5, animation: 'floatJellyfish-mysterious' },
  fresh: { tentacles: 4, animation: 'floatJellyfish-fresh' },
  sunny: { tentacles: 5, animation: 'floatJellyfish-sunny' },
  cheerful: { tentacles: 6, animation: 'floatJellyfish-cheerful' }
}

// 水母配置数据 - 完整版本，保持丰富的动画效果
export const JELLYFISH_CONFIG = [
  // 第一组: 珊瑚粉色系 - 温柔可爱型
  { color: '#FFAB91', delay: 0, left: '8%', startTop: '85%', size: 45, opacity: 0.75, type: 'cute', speed: 1.0, wiggle: 0.8 },
  { color: '#FF8A65', delay: 0.8, left: '5%', startTop: '70%', size: 38, opacity: 0.7, type: 'playful', speed: 1.2, wiggle: 1.2 },
  { color: '#FFCCBC', delay: 1.5, left: '12%', startTop: '55%', size: 42, opacity: 0.8, type: 'gentle', speed: 0.9, wiggle: 0.6 },
  { color: '#FF8A80', delay: 2.2, left: '3%', startTop: '40%', size: 35, opacity: 0.65, type: 'bouncy', speed: 1.4, wiggle: 1.5 },

  // 第二组: 天蓝色系 - 梦幻飘逸型
  { color: '#81D4FA', delay: 3, left: '18%', startTop: '45%', size: 40, opacity: 0.7, type: 'dreamy', speed: 0.8, wiggle: 0.9 },
  { color: '#4FC3F7', delay: 4.2, left: '32%', startTop: '35%', size: 48, opacity: 0.8, type: 'elegant', speed: 0.7, wiggle: 0.5 },
  { color: '#B3E5FC', delay: 5.5, left: '45%', startTop: '95%', size: 44, opacity: 0.75, type: 'cute', speed: 1.1, wiggle: 1.0 },
  { color: '#29B6F6', delay: 6.8, left: '42%', startTop: '80%', size: 36, opacity: 0.7, type: 'playful', speed: 1.3, wiggle: 1.4 },

  // 第三组: 薰衣草紫色系 - 神秘优雅型
  { color: '#CE93D8', delay: 8, left: '68%', startTop: '72%', size: 46, opacity: 0.8, type: 'mysterious', speed: 0.6, wiggle: 0.7 },
  { color: '#BA68C8', delay: 9.5, left: '75%', startTop: '58%', size: 39, opacity: 0.7, type: 'gentle', speed: 0.9, wiggle: 0.8 },
  { color: '#E1BEE7', delay: 11, left: '82%', startTop: '42%', size: 43, opacity: 0.75, type: 'dreamy', speed: 0.8, wiggle: 1.1 },

  // 第四组: 薄荷绿色系 - 清新活力型
  { color: '#80CBC4', delay: 12.5, left: '15%', startTop: '75%', size: 41, opacity: 0.7, type: 'fresh', speed: 1.0, wiggle: 1.0 },
  { color: '#4DB6AC', delay: 14, left: '35%', startTop: '90%', size: 47, opacity: 0.8, type: 'bouncy', speed: 1.2, wiggle: 1.3 },
  { color: '#A5D6A7', delay: 15.5, left: '55%', startTop: '70%', size: 38, opacity: 0.7, type: 'playful', speed: 1.1, wiggle: 1.2 },

  // 第五组: 奶油黄色系 - 温暖阳光型
  { color: '#FFF176', delay: 17, left: '25%', startTop: '50%', size: 40, opacity: 0.75, type: 'sunny', speed: 1.0, wiggle: 0.9 },
  { color: '#FFEE58', delay: 18.5, left: '50%', startTop: '85%', size: 44, opacity: 0.8, type: 'cheerful', speed: 1.3, wiggle: 1.4 },
  { color: '#FFF59D', delay: 20, left: '70%', startTop: '60%', size: 37, opacity: 0.7, type: 'gentle', speed: 0.9, wiggle: 0.8 }
]

// 水母工具函数
export function getTentacleCount(type) {
  return JELLYFISH_TYPES[type]?.tentacles || 4
}

export function getJellyAnimationClass(type) {
  return JELLYFISH_TYPES[type]?.animation || 'floatJellyfish'
}

export function jellyStyle(jelly) {
  return {
    left: jelly.left,
    top: jelly.startTop,
    width: `${jelly.size}px`,
    height: `${jelly.size * 0.9}px`,
    animationDelay: `${jelly.delay}s`,
    animationDuration: `${25 / jelly.speed}s`,
    opacity: jelly.opacity
  }
}
