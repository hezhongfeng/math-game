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

// 音频频率配置 - 简单好听版
export const AUDIO_FREQUENCIES = {
  // 数字键音效频率 (0-9) - 简单音阶，干净清晰
  digits: [
    523.25,  // C5 - 0
    587.33,  // D5 - 1
    659.25,  // E5 - 2
    698.46,  // F5 - 3
    783.99,  // G5 - 4
    880.00,  // A5 - 5
    987.77,  // B5 - 6
    1046.50, // C6 - 7
    1174.66, // D6 - 8
    1318.51  // E6 - 9
  ],
  
  // 正确音效频率 - 简单上扬双音
  correct: {
    note1: 659.25,  // E5
    note2: 880.00   // A5
  },
  
  // 错误音效频率 - 简单下降音
  wrong: {
    start: 587.33,  // D5
    end: 440.00     // A4
  },
  
  // 点击音效频率
  click: {
    // 通用点击：干净的单音
    default: 880.00, // A5
    
    // 删除键：短促下滑
    delete: {
      start: 523.25,  // C5
      end: 392.00     // G4
    },
    
    // 提交键：简单上扬
    submit: {
      note1: 659.25,  // E5
      note2: 783.99   // G5
    }
  },
  
  // 胜利音效频率 - 简单音阶
  win: {
    // 简单音阶：C5, D5, E5, F5, G5
    scale: [523.25, 587.33, 659.25, 698.46, 783.99]
  }
}

// 音频参数配置 - 简单纯净版
export const AUDIO_PARAMS = {
  // 数字键音效参数 - 简单三角波
  digit: {
    gain: 0.08,
    duration: 0.04,
    wave: 'triangle',
    attack: 0.005,
    release: 0.02
  },
  
  // 正确音效参数 - 简单双音
  correct: {
    gain: 0.15,
    duration: 0.1,
    interval: 0.05,
    wave: 'sine'
  },
  
  // 错误音效参数 - 简单下滑音
  wrong: {
    gain: 0.1,
    duration: 0.08,
    wave: 'triangle'
  },
  
  // 通用点击音效参数
  click: {
    gain: 0.06,
    duration: 0.03,
    wave: 'triangle'
  },
  
  // 删除键参数
  delete: {
    gain: 0.07,
    duration: 0.05,
    wave: 'sine'
  },
  
  // 提交键参数
  submit: {
    gain: 0.08,
    duration: 0.06,
    interval: 0.03,
    wave: 'sine'
  },
  
  // 胜利音效参数
  win: {
    gain: 0.18,
    noteDuration: 0.09,
    interval: 0.07,
    wave: 'triangle'
  }
}
