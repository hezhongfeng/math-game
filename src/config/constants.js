// 游戏常量配置

export const GAME_CONFIG = {
  // 反馈延迟时间（毫秒）
  FEEDBACK_DELAY: 1500,

  // 答案最大长度
  MAX_ANSWER_LENGTH: 4
}

// 音频频率配置（乐音）
export const AUDIO_FREQUENCIES = {
  // 正确音效频率 (C5, E5, G5, B5, C6)
  correct: {
    note1: 523.25,
    note2: 659.25,
    note3: 783.99,
    note4: 987.77,
    note5: 1046.50
  },
  // 错误音效频率
  wrong: {
    start: 200,
    end: 100
  },
  // 点击音效频率
  click: 800,
  // 背景音乐旋律频率 (C5, D5, E5, F5, G5, A5, B5, C6)
  melody: {
    C5: 523.25,
    D5: 587.33,
    E5: 659.25,
    F5: 698.46,
    G5: 783.99,
    A5: 880.00,
    B5: 987.77,
    C6: 1046.50
  },
  // 低音频率 (E3, G3, A3)
  bass: {
    E3: 164.81,
    G3: 196.00,
    A3: 220.00
  }
}

// 音频参数配置
export const AUDIO_PARAMS = {
  // 正确音效参数
  correct: {
    gain: 0.3,
    envelope: 0.4,
    delay1: 150,
    delay2: 300
  },
  // 错误音效参数
  wrong: {
    gain: 0.2,
    duration: 0.4
  },
  // 点击音效参数
  click: {
    gain: 0.1,
    duration: 0.05
  },
  // 胜利音效参数
  win: {
    gain: 0.25,
    noteDuration: 0.15
  },
  // 背景音乐参数
  backgroundMusic: {
    duration: 8,
    melodyGain: 0.15,
    bassGain: 0.06,
    bassOvertoneGain: 0.03
  }
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
