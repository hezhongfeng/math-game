// 游戏常量配置

// LocalStorage 存储键名 - 集中管理避免冲突
export const STORAGE_KEYS = {
  // 游戏数据（成绩、进度）
  GAME_DATA: 'math-game-data',
  // 用户设置（音效等）
  SETTINGS: 'math-game-settings'
}

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
  click: {
    // 导航/通用点击
    default: 720,
    // 数字键（0-9）轻微分组，避免单调
    digits: [620, 640, 660, 680, 700, 720, 740, 760, 780, 800],
    // 删除键：更低、更短促
    deleteStart: 420,
    deleteEnd: 300,
    // 提交键：更积极的双音
    submit1: 840,
    submit2: 1080
  }
}

// 音频参数配置
export const AUDIO_PARAMS = {
  // 正确音效参数
  correct: {
    gain: 0.24,
    noteDuration: 0.11,
    harmonyGain: 0.08,
    swing: 0.012
  },
  // 错误音效参数
  wrong: {
    gain: 0.16,
    duration: 0.24,
    tailDuration: 0.1
  },
  // 点击音效参数
  click: {
    gain: 0.09,
    duration: 0.055,
    bodyDuration: 0.045,
    transientGain: 0.05,
    transientDuration: 0.02
  },
  // 删除键参数
  clickDelete: {
    gain: 0.08,
    duration: 0.08
  },
  // 提交键参数
  clickSubmit: {
    gain: 0.11,
    harmonyGain: 0.06,
    noteDuration: 0.055,
    interval: 0.04
  },
  // 胜利音效参数
  win: {
    gain: 0.22,
    harmonyGain: 0.09,
    noteDuration: 0.13,
    tailDuration: 0.18,
    swing: 0.01
  }
}
