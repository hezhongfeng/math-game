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
    { emoji: '⭐', style: 'top: 10%; left: 5%; font-size: 2rem; animation-delay: 0s;' },
    { emoji: '🌈', style: 'top: 20%; right: 8%; font-size: 2.5rem; animation-delay: 2s;' },
    { emoji: '☁️', style: 'top: 15%; left: 15%; font-size: 1.8rem; animation-delay: 4s;' },
    { emoji: '🚀', style: 'bottom: 20%; right: 10%; font-size: 2.2rem; animation-delay: 1s;' },
    { emoji: '🏆', style: 'bottom: 15%; left: 8%; font-size: 2rem; animation-delay: 3s;' },
    { emoji: '✨', style: 'top: 50%; left: 3%; font-size: 1.5rem; animation-delay: 5s;' },
    { emoji: '🌟', style: 'top: 60%; right: 5%; font-size: 1.8rem; animation-delay: 2.5s;' },
    { emoji: '☀️', style: 'bottom: 10%; right: 20%; font-size: 2.3rem; animation-delay: 3.5s;' }
  ],
  difficulty: [
    { emoji: '📚', style: 'top: 8%; left: 10%; font-size: 2rem; animation-delay: 0s;' },
    { emoji: '✏️', style: 'top: 12%; right: 12%; font-size: 1.8rem; animation-delay: 1.5s;' },
    { emoji: '🎯', style: 'bottom: 15%; left: 8%; font-size: 2.2rem; animation-delay: 3s;' },
    { emoji: '💡', style: 'bottom: 10%; right: 15%; font-size: 1.9rem; animation-delay: 4.5s;' }
  ],
  game: [
    { emoji: '➕', style: 'top: 10%; left: 5%; font-size: 1.5rem; animation-delay: 0s;' },
    { emoji: '➖', style: 'top: 20%; right: 8%; font-size: 1.5rem; animation-delay: 1s;' },
    { emoji: '✖️', style: 'bottom: 15%; left: 10%; font-size: 1.5rem; animation-delay: 2s;' },
    { emoji: '➗', style: 'bottom: 20%; right: 5%; font-size: 1.5rem; animation-delay: 3s;' },
    { emoji: '🧮', style: 'top: 50%; left: 3%; font-size: 1.8rem; animation-delay: 4s;' },
    { emoji: '📊', style: 'top: 60%; right: 3%; font-size: 1.8rem; animation-delay: 5s;' }
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
