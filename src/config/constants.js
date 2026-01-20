// 游戏常量配置

export const GAME_CONFIG = {
  // 反馈延迟时间（毫秒）
  FEEDBACK_DELAY: 1500,

  // 答案最大长度
  MAX_ANSWER_LENGTH: 4,

  // 每题得分
  SCORE_PER_QUESTION: 10
}

// 装饰元素（使用 emoji）
export const DECORATIONS = {
  home: [
    { emoji: '☀️', class: 'top-8 right-8 animate-float', size: 48 },
    { emoji: '☁️', class: 'top-16 left-12 animate-wiggle', size: 32 },
    { emoji: '☁️', class: 'top-24 right-24 animate-wiggle', size: 24 },
    { emoji: '⚽', class: 'bottom-20 left-8 animate-bounce-slow', size: 28 },
    { emoji: '⚽', class: 'bottom-16 right-12 animate-bounce-slow', size: 24 },
    { emoji: '✨', class: 'top-32 left-1/4 animate-pulse-slow', size: 20 },
    { emoji: '⭐', class: 'top-40 right-1/3 animate-pulse-slow', size: 16 },
  ],
  difficulty: [
    { emoji: '☀️', class: 'top-12 right-12 animate-float', size: 40 },
    { emoji: '☁️', class: 'top-20 left-16 animate-wiggle', size: 28 },
    { emoji: '☁️', class: 'top-28 right-32 animate-wiggle', size: 20 },
    { emoji: '⚽', class: 'bottom-32 left-12 animate-bounce-slow', size: 24 },
    { emoji: '⚽', class: 'bottom-28 right-20 animate-bounce-slow', size: 20 },
    { emoji: '✨', class: 'top-40 left-1/4 animate-pulse-slow', size: 16 },
  ],
  game: [
    { emoji: '☀️', class: 'top-8 right-8 animate-float', size: 48 },
    { emoji: '⚽', class: 'bottom-32 left-8 animate-float', size: 28 },
  ]
}

// 可爱表情映射
export const CUTE_EMOJIS = ['⚽', '⭐', '🌈', '🚀', '🏆', '✨']

// 语音反馈消息
export const SPEECH_MESSAGES = {
  correct: ['答对了！', '太棒了！', '你真聪明！', '非常正确！'],
  incorrect: ['不对哦', '再想想', '加油', '继续努力'],
  encouragement: (accuracy) => {
    if (accuracy === 100) return '完美！你太厉害了！'
    if (accuracy >= 80) return '做得很好！继续加油！'
    if (accuracy >= 60) return '还不错！再接再厉！'
    return '继续努力，你会越来越棒！'
  }
}

// 题目运算符文本
export const OPERATOR_TEXT = {
  '+': '加',
  '-': '减',
  '×': '乘',
  '÷': '除'
}
