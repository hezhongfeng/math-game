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

// 音频频率配置 - 极简交互版
export const AUDIO_FREQUENCIES = {
  // 数字键音效频率 - 统一单音，避免“弹琴感”
  digit: 720.00, // F#5
  
  // 正确音效频率 - 简单上扬双音
  correct: {
    note1: 659.25,  // E5
    note2: 987.77   // B5
  },
  
  // 错误音效频率 - 简单下降音
  wrong: {
    start: 246.94,  // B3
    end: 196.00     // G3
  },
  
  // 点击音效频率
  click: {
    // 通用点击：轻柔单音
    default: 760.00, // G5
    
    // 删除键：轻下滑
    delete: {
      start: 440.00,  // A4
      end: 349.23     // F4
    },
    
    // 提交键：轻上扬
    submit: {
      note1: 659.25,  // E5
      note2: 830.61   // G#5
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
  // 数字键音效参数 - 柔和单击
  digit: {
    gain: 0.05,
    duration: 0.026,
    wave: 'sine',
    attack: 0.004,
    release: 0.012
  },
  
  // 正确音效参数 - 简单双音
  correct: {
    gain: 0.115,
    duration: 0.07,
    interval: 0.045,
    wave: 'triangle'
  },
  
  // 错误音效参数 - 简单下滑音
  wrong: {
    gain: 0.085,
    duration: 0.07,
    wave: 'triangle'
  },
  
  // 通用点击音效参数
  click: {
    gain: 0.045,
    duration: 0.024,
    wave: 'sine'
  },
  
  // 删除键参数
  delete: {
    gain: 0.05,
    duration: 0.04,
    wave: 'sine'
  },
  
  // 提交键参数
  submit: {
    gain: 0.06,
    duration: 0.04,
    interval: 0.028,
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
