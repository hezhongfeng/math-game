// 游戏常量配置

export const GAME_CONFIG = {
  // 反馈延迟时间（毫秒）
  FEEDBACK_DELAY: 1500,

  // 答案最大长度
  MAX_ANSWER_LENGTH: 4,

  // 每题得分
  SCORE_PER_QUESTION: 10
}

// 装饰元素（使用 emoji）- 已简化
export const DECORATIONS = {
  home: [],
  difficulty: [],
  game: []
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
