/**
 * 背景装饰动画配置
 * 使用低龄儿童友好的配色：温暖桃色、清新薄荷绿、活力橙色
 */

// 装饰类型配置
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

// 背景装饰配置数据 - 低龄儿童友好配色
// 使用温暖桃色、清新薄荷绿、柔和黄色、活力橙色等暖色调
export const JELLYFISH_CONFIG = [
  // 第一组: 温暖桃色系 - 亲切温馨
  { color: '#F9A8D4', delay: 0, left: '8%', startTop: '85%', size: 45, opacity: 0.6, type: 'cute', speed: 1.0, wiggle: 0.8 },
  { color: '#F472B6', delay: 0.8, left: '5%', startTop: '70%', size: 38, opacity: 0.55, type: 'playful', speed: 1.2, wiggle: 1.2 },
  { color: '#FBB8DC', delay: 1.5, left: '12%', startTop: '55%', size: 42, opacity: 0.65, type: 'gentle', speed: 0.9, wiggle: 0.6 },
  { color: '#F472B6', delay: 2.2, left: '3%', startTop: '40%', size: 35, opacity: 0.5, type: 'bouncy', speed: 1.4, wiggle: 1.5 },

  // 第二组: 清新薄荷绿系 - 活力清新
  { color: '#6EE7B7', delay: 3, left: '18%', startTop: '45%', size: 40, opacity: 0.55, type: 'dreamy', speed: 0.8, wiggle: 0.9 },
  { color: '#10B981', delay: 4.2, left: '32%', startTop: '35%', size: 48, opacity: 0.6, type: 'elegant', speed: 0.7, wiggle: 0.5 },
  { color: '#86EFAC', delay: 5.5, left: '45%', startTop: '95%', size: 44, opacity: 0.65, type: 'cute', speed: 1.1, wiggle: 1.0 },
  { color: '#34D399', delay: 6.8, left: '42%', startTop: '80%', size: 36, opacity: 0.55, type: 'playful', speed: 1.3, wiggle: 1.4 },

  // 第三组: 柔和黄色系 - 温暖明亮
  { color: '#FDE68A', delay: 8, left: '68%', startTop: '72%', size: 46, opacity: 0.6, type: 'mysterious', speed: 0.6, wiggle: 0.7 },
  { color: '#FCD34D', delay: 9.5, left: '75%', startTop: '58%', size: 39, opacity: 0.55, type: 'gentle', speed: 0.9, wiggle: 0.8 },
  { color: '#FEF9C3', delay: 11, left: '82%', startTop: '42%', size: 43, opacity: 0.6, type: 'dreamy', speed: 0.8, wiggle: 1.1 },

  // 第四组: 活力橙色系 - 热情能量
  { color: '#FB923C', delay: 12.5, left: '15%', startTop: '75%', size: 41, opacity: 0.55, type: 'fresh', speed: 1.0, wiggle: 1.0 },
  { color: '#F97316', delay: 14, left: '35%', startTop: '90%', size: 47, opacity: 0.6, type: 'bouncy', speed: 1.2, wiggle: 1.3 },
  { color: '#FDBA74', delay: 15.5, left: '55%', startTop: '70%', size: 38, opacity: 0.55, type: 'playful', speed: 1.1, wiggle: 1.2 },

  // 第五组: 柔和粉色系 - 温柔可爱
  { color: '#FCA5A5', delay: 17, left: '25%', startTop: '50%', size: 40, opacity: 0.6, type: 'sunny', speed: 1.0, wiggle: 0.9 },
  { color: '#FECACA', delay: 18.5, left: '50%', startTop: '85%', size: 44, opacity: 0.65, type: 'cheerful', speed: 1.3, wiggle: 1.4 },
  { color: '#FBCFE8', delay: 20, left: '70%', startTop: '60%', size: 37, opacity: 0.55, type: 'gentle', speed: 0.9, wiggle: 0.8 }
]

// 工具函数
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
