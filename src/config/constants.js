// 游戏常量配置

// LocalStorage 存储键名 - 集中管理避免冲突
export const STORAGE_KEYS = {
  GAME_DATA: 'math-game-data'
}

export const GAME_CONFIG = {
  FEEDBACK_DELAY: 800,
  MAX_ANSWER_LENGTH: 4,
  PASS_ACCURACY: 85
}

export const AUDIO_ENGINE = {
  MASTER_GAIN: 1,
  FILTER_FREQUENCY: 4000,
  WARMUP_GAIN: 0.0001
}

export const AUDIO_COOLDOWNS = {
  click: 40,
  key: 28,
  delete: 50,
  submit: 60,
  correct: 150,
  wrong: 180,
  question: 180,
  back: 120,
  victory: 600,
  unlock: 600,
  praise: 1800
}

export const AUDIO_FREQUENCIES = {
  click: 698.46,
  key: 440.0,
  delete: {
    start: 349.23,
    end: 293.66
  },
  submit: [523.25, 659.25, 783.99],
  correct: [523.25, 659.25, 783.99, 1046.5, 1318.51],
  wrong: [329.63, 293.66],
  question: 392.0,
  back: {
    start: 493.88,
    end: 392.0
  },
  victory: [523.25, 659.25, 783.99, 987.77, 1174.66, 1318.51],
  unlock: [783.99, 987.77, 1174.66]
}

export const AUDIO_PARAMS = {
  click: {
    type: 'triangle',
    gain: 0.22,
    duration: 0.035,
    attack: 0.005,
    release: 0.025
  },
  key: {
    type: 'triangle',
    gain: 0.30,
    duration: 0.04,
    attack: 0.005,
    release: 0.03
  },
  delete: {
    type: 'triangle',
    gain: 0.22,
    duration: 0.05,
    attack: 0.005,
    release: 0.035
  },
  submit: {
    type: 'triangle',
    gain: 0.35,
    duration: 0.05,
    interval: 0.045,
    attack: 0.005,
    release: 0.035
  },
  correct: {
    type: 'triangle',
    sparkleType: 'sine',
    gain: 0.55,
    sparkleGain: 0.36,
    duration: 0.08,
    sparkleDuration: 0.15,
    interval: 0.05,
    stepGainRatio: 0.92,
    attack: 0.006,
    release: 0.05
  },
  wrong: {
    type: 'triangle',
    gain: 0.42,
    duration: 0.08,
    interval: 0.06,
    stepGainRatio: 0.88,
    attack: 0.005,
    release: 0.04
  },
  question: {
    type: 'triangle',
    gain: 0.15,
    duration: 0.06,
    attack: 0.005,
    release: 0.04
  },
  back: {
    type: 'triangle',
    gain: 0.22,
    duration: 0.05,
    attack: 0.005,
    release: 0.035
  },
  victory: {
    type: 'triangle',
    gain: 0.60,
    duration: 0.1,
    interval: 0.07,
    stepGainRatio: 0.88,
    attack: 0.008,
    release: 0.06
  },
  unlock: {
    type: 'sine',
    gain: 0.45,
    duration: 0.12,
    interval: 0.1,
    attack: 0.005,
    release: 0.05
  }
}
