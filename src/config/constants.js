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
  click: 800
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
  }
}

// 可爱表情映射
export const CUTE_EMOJIS = ['⚽', '⭐', '🌈', '🚀', '🏆', '✨']
