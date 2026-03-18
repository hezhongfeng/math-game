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
    gain: 0.2,
    noteDuration: 0.1,
    interval: 0.11
  },
  // 错误音效参数
  wrong: {
    gain: 0.14,
    duration: 0.15,
    tailDuration: 0.06
  },
  // 点击音效参数
  click: {
    gain: 0.07,
    duration: 0.045,
    transientGain: 0.015,
    transientDuration: 0.008
  },
  // 删除键参数
  clickDelete: {
    gain: 0.075,
    duration: 0.06
  },
  // 提交键参数
  clickSubmit: {
    gain: 0.095,
    noteDuration: 0.045,
    interval: 0.03
  },
  // 胜利音效参数
  win: {
    gain: 0.2,
    noteDuration: 0.11,
    interval: 0.1,
    tailDuration: 0.14
  }
}
