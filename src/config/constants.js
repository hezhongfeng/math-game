// 游戏常量配置

// LocalStorage 存储键名 - 集中管理避免冲突
export const STORAGE_KEYS = {
  GAME_DATA: 'math-game-data',
  SETTINGS: 'math-game-settings'
}

export const GAME_CONFIG = {
  FEEDBACK_DELAY: 1500,
  MAX_ANSWER_LENGTH: 4
}

export const AUDIO_ENGINE = {
  MASTER_GAIN: 0.6,
  FILTER_FREQUENCY: 3200,
  WARMUP_GAIN: 0.0001
}

export const AUDIO_COOLDOWNS = {
  click: 36,
  key: 24,
  delete: 42,
  submit: 52,
  correct: 120,
  wrong: 150,
  question: 160,
  back: 100,
  victory: 500,
  unlock: 500
}

export const AUDIO_FREQUENCIES = {
  click: 587.33,
  key: 523.25,
  delete: {
    start: 392.0,
    end: 329.63
  },
  submit: [523.25, 659.25],
  correct: [659.25, 830.61, 987.77, 1318.51],
  wrong: [392.0, 329.63],
  question: 523.25,
  back: {
    start: 540,
    end: 420
  },
  victory: [523.25, 659.25, 783.99, 1046.5],
  unlock: [783.99, 1046.5]
}

export const AUDIO_PARAMS = {
  click: {
    type: 'sine',
    gain: 0.026,
    duration: 0.022,
    attack: 0.003,
    release: 0.016
  },
  key: {
    type: 'sine',
    gain: 0.03,
    duration: 0.024,
    attack: 0.003,
    release: 0.018
  },
  delete: {
    type: 'sine',
    gain: 0.032,
    duration: 0.036,
    attack: 0.003,
    release: 0.02
  },
  submit: {
    type: 'sine',
    gain: 0.038,
    duration: 0.034,
    interval: 0.032,
    attack: 0.003,
    release: 0.022
  },
  correct: {
    type: 'triangle',
    sparkleType: 'sine',
    gain: 0.068,
    sparkleGain: 0.04,
    duration: 0.064,
    sparkleDuration: 0.1,
    interval: 0.038,
    stepGainRatio: 0.93,
    attack: 0.004,
    release: 0.03
  },
  wrong: {
    type: 'sine',
    gain: 0.036,
    duration: 0.068,
    interval: 0.05,
    stepGainRatio: 0.9,
    attack: 0.003,
    release: 0.026
  },
  question: {
    type: 'sine',
    gain: 0.01,
    duration: 0.02,
    attack: 0.003,
    release: 0.014
  },
  back: {
    type: 'sine',
    gain: 0.03,
    duration: 0.038,
    attack: 0.003,
    release: 0.022
  },
  victory: {
    type: 'sine',
    gain: 0.052,
    duration: 0.064,
    interval: 0.06,
    stepGainRatio: 0.9,
    attack: 0.004,
    release: 0.03
  },
  unlock: {
    type: 'sine',
    gain: 0.048,
    duration: 0.07,
    interval: 0.08,
    attack: 0.004,
    release: 0.03
  }
}
