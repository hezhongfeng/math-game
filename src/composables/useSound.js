import { computed } from 'vue'
import { useSettingsStore } from '../stores/settings'
import { useToast } from './useToast'
import { getAudioContext, forceInitializeAudioContext, ensureAudioContextRunning } from '../utils/audioContext'
import { logAudioEvent, LOG_LEVELS, LOG_CATEGORIES } from '../utils/audioDebug'
import { AUDIO_FREQUENCIES, AUDIO_PARAMS } from '../config/constants'

/**
 * 音效播放 Composable
 * 使用 Web Audio API 生成音效
 *
 * iOS Safari 兼容性说明：
 * - 在 iOS 上，AudioContext 需要在用户交互后才能播放声音
 * - 使用 ensureAudioContextRunning() 确保播放前恢复
 * - 必须在同步代码路径中调用 resume()，不能使用 await
 */
export function useSound() {
  const settingsStore = useSettingsStore()
  const isEnabled = computed(() => settingsStore.soundEnabled)
  const { error: showError } = useToast()

  /**
   * 同步恢复 AudioContext
   * iOS Safari 要求必须在同步代码中调用 resume()
   */
  function ensureAudioContextSync() {
    const ctx = getAudioContext()
    if (!ctx) {
      logAudioEvent(
        LOG_LEVELS.ERROR,
        LOG_CATEGORIES.CONTEXT,
        '同步恢复失败：AudioContext 不存在'
      )
      return false
    }

    if (ctx.state === 'suspended') {
      logAudioEvent(
        LOG_LEVELS.DEBUG,
        LOG_CATEGORIES.CONTEXT,
        '同步调用 AudioContext.resume()'
      )
      // 同步调用 resume，不等待结果
      // iOS Safari 要求 resume() 在用户交互的同步调用栈中
      ctx.resume()
        .then(() => {
          logAudioEvent(
            LOG_LEVELS.SUCCESS,
            LOG_CATEGORIES.CONTEXT,
            '同步恢复 AudioContext 成功',
            { state: ctx.state }
          )
        })
        .catch((error) => {
          logAudioEvent(
            LOG_LEVELS.WARN,
            LOG_CATEGORIES.CONTEXT,
            '同步恢复 AudioContext 失败',
            { error: error.message }
          )
        })
      return true
    }

    logAudioEvent(
      LOG_LEVELS.DEBUG,
      LOG_CATEGORIES.CONTEXT,
      'AudioContext 已经是运行状态，无需同步恢复',
      { state: ctx.state }
    )
    return true
  }

  /**
   * 播放音效
   * @param {string} type - 音效类型: 'correct', 'wrong', 'win', 'click'
   */
  function playSound(type) {
    if (!isEnabled.value) {
      logAudioEvent(
        LOG_LEVELS.DEBUG,
        LOG_CATEGORIES.PLAY,
        '音效播放被跳过（音效已禁用）',
        { type }
      )
      return
    }

    const ctx = getAudioContext()
    if (!ctx) {
      logAudioEvent(
        LOG_LEVELS.ERROR,
        LOG_CATEGORIES.PLAY,
        'AudioContext 不存在，无法播放音效',
        { type }
      )
      return
    }

    logAudioEvent(
      LOG_LEVELS.INFO,
      LOG_CATEGORIES.PLAY,
      `开始播放音效: ${type}`,
      {
        type,
        contextState: ctx.state,
        currentTime: ctx.currentTime
      }
    )

    // iOS Safari 关键修复：必须在同步代码中恢复 AudioContext
    const syncResult = ensureAudioContextSync()
    if (!syncResult) {
      logAudioEvent(
        LOG_LEVELS.WARN,
        LOG_CATEGORIES.PLAY,
        `同步恢复 AudioContext 失败，继续尝试播放: ${type}`
      )
    }

    try {
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      const now = ctx.currentTime

      logAudioEvent(
        LOG_LEVELS.DEBUG,
        LOG_CATEGORIES.PLAY,
        `音频节点已创建: ${type}`,
        {
          oscillatorType: oscillator.type,
          currentTime: now
        }
      )

      switch (type) {
        case 'correct':
          // 正确音效：上升的三声"叮叮叮"
          playCorrectSound(ctx, oscillator, gainNode, now)
          break
        case 'wrong':
          // 错误音效：低沉的"嗡"声
          playWrongSound(ctx, oscillator, gainNode, now)
          break
        case 'win':
          // 胜利音效：欢快的音阶
          playWinSound(ctx, oscillator, gainNode, now)
          break
        case 'click':
          // 点击音效：短促的"嗒"声
          playClickSound(ctx, oscillator, gainNode, now)
          break
        default:
          logAudioEvent(
            LOG_LEVELS.WARN,
            LOG_CATEGORIES.PLAY,
            `未知的音效类型: ${type}`
          )
          break
      }
    } catch (error) {
      logAudioEvent(
        LOG_LEVELS.ERROR,
        LOG_CATEGORIES.PLAY,
        `音效播放异常: ${type}`,
        { error: error.message, stack: error.stack }
      )
    }
  }

  /**
   * 正确音效
   */
  function playCorrectSound(ctx, oscillator, gainNode, now) {
    const freq = AUDIO_FREQUENCIES.correct
    const params = AUDIO_PARAMS.correct

    logAudioEvent(
      LOG_LEVELS.DEBUG,
      LOG_CATEGORIES.PLAY,
      '播放正确音效：第一声',
      { frequencies: [freq.note1, freq.note2, freq.note3], delay: 0 }
    )

    // 第一声
    oscillator.frequency.setValueAtTime(freq.note1, now)
    oscillator.frequency.setValueAtTime(freq.note2, now + 0.1)
    oscillator.frequency.setValueAtTime(freq.note3, now + 0.2)
    gainNode.gain.setValueAtTime(params.gain, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + params.envelope)
    oscillator.start(now)
    oscillator.stop(now + params.envelope)

    // 第二声
    setTimeout(async () => {
      try {
        logAudioEvent(
          LOG_LEVELS.DEBUG,
          LOG_CATEGORIES.PLAY,
          '播放正确音效：第二声',
          { delay: params.delay1 }
        )
        
        // iOS Safari 26.2 关键修复：确保 AudioContext 处于运行状态
        // 使用 ensureAudioContextRunning 等待 resume 完成
        await ensureAudioContextRunning()
        
        const ctx = getAudioContext()
        if (!ctx || ctx.state !== 'running') {
          logAudioEvent(
            LOG_LEVELS.WARN,
            LOG_CATEGORIES.PLAY,
            'AudioContext 不可用，跳过第二声播放'
          )
          return // AudioContext 不可用，跳过播放
        }
        
        const osc2 = ctx.createOscillator()
        const gain2 = ctx.createGain()
        osc2.connect(gain2)
        gain2.connect(ctx.destination)
        const t = ctx.currentTime
        osc2.frequency.setValueAtTime(freq.note3, t)
        osc2.frequency.setValueAtTime(freq.note4, t + 0.1)
        gain2.gain.setValueAtTime(params.gain, t)
        gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.3)
        osc2.start(t)
        osc2.stop(t + 0.3)
        
        logAudioEvent(
          LOG_LEVELS.SUCCESS,
          LOG_CATEGORIES.PLAY,
          '正确音效第二声播放成功',
          { frequencies: [freq.note3, freq.note4] }
        )
      } catch (error) {
        logAudioEvent(
          LOG_LEVELS.ERROR,
          LOG_CATEGORIES.PLAY,
          '正确音效第二声播放失败',
          { error: error.message, stack: error.stack }
        )
      }
    }, params.delay1)

    // 第三声
    setTimeout(async () => {
      try {
        logAudioEvent(
          LOG_LEVELS.DEBUG,
          LOG_CATEGORIES.PLAY,
          '播放正确音效：第三声',
          { delay: params.delay2 }
        )
        
        // iOS Safari 26.2 关键修复：确保 AudioContext 处于运行状态
        await ensureAudioContextRunning()
        
        const ctx = getAudioContext()
        if (!ctx || ctx.state !== 'running') {
          logAudioEvent(
            LOG_LEVELS.WARN,
            LOG_CATEGORIES.PLAY,
            'AudioContext 不可用，跳过第三声播放'
          )
          return // AudioContext 不可用，跳过播放
        }
        
        const osc3 = ctx.createOscillator()
        const gain3 = ctx.createGain()
        osc3.connect(gain3)
        gain3.connect(ctx.destination)
        const t = ctx.currentTime
        osc3.frequency.setValueAtTime(freq.note5, t)
        osc3.type = 'sine'
        gain3.gain.setValueAtTime(params.gain, t)
        gain3.gain.exponentialRampToValueAtTime(0.01, t + params.envelope)
        osc3.start(t)
        osc3.stop(t + params.envelope)
        
        logAudioEvent(
          LOG_LEVELS.SUCCESS,
          LOG_CATEGORIES.PLAY,
          '正确音效第三声播放成功',
          { frequency: freq.note5 }
        )
      } catch (error) {
        logAudioEvent(
          LOG_LEVELS.ERROR,
          LOG_CATEGORIES.PLAY,
          '正确音效第三声播放失败',
          { error: error.message, stack: error.stack }
        )
      }
    }, params.delay2)
  }

  /**
   * 错误音效
   */
  function playWrongSound(ctx, oscillator, gainNode, now) {
    const freq = AUDIO_FREQUENCIES.wrong
    const params = AUDIO_PARAMS.wrong

    logAudioEvent(
      LOG_LEVELS.DEBUG,
      LOG_CATEGORIES.PLAY,
      '播放错误音效',
      { frequencies: [freq.start, freq.end], type: 'sawtooth' }
    )

    oscillator.type = 'sawtooth'
    oscillator.frequency.setValueAtTime(freq.start, now)
    oscillator.frequency.linearRampToValueAtTime(freq.end, now + params.duration)
    gainNode.gain.setValueAtTime(params.gain, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + params.duration)
    oscillator.start(now)
    oscillator.stop(now + params.duration)
  }

  /**
   * 胜利音效
   */
  function playWinSound(ctx, _oscillator, _gainNode, _now) {
    const freq = AUDIO_FREQUENCIES.correct
    const params = AUDIO_PARAMS.win
    const notes = [freq.note1, freq.note2, freq.note3, freq.note5]

    logAudioEvent(
      LOG_LEVELS.DEBUG,
      LOG_CATEGORIES.PLAY,
      '播放胜利音效',
      { noteCount: notes.length, frequencies: notes }
    )

    notes.forEach((noteFreq, index) => {
      setTimeout(async () => {
        try {
          logAudioEvent(
            LOG_LEVELS.DEBUG,
            LOG_CATEGORIES.PLAY,
            `播放胜利音效第 ${index + 1} 声`,
            { note: noteFreq, delay: index * params.noteDuration * 1000 }
          )
          
          // iOS Safari 26.2 关键修复：确保 AudioContext 处于运行状态
          await ensureAudioContextRunning()
          
          const ctx = getAudioContext()
          if (!ctx || ctx.state !== 'running') {
            logAudioEvent(
              LOG_LEVELS.WARN,
              LOG_CATEGORIES.PLAY,
              `AudioContext 不可用，跳过胜利音效第 ${index + 1} 声`
            )
            return // AudioContext 不可用，跳过播放
          }
          
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.connect(gain)
          gain.connect(ctx.destination)
          const t = ctx.currentTime
          osc.frequency.setValueAtTime(noteFreq, t)
          osc.type = 'sine'
          gain.gain.setValueAtTime(params.gain, t)
          gain.gain.exponentialRampToValueAtTime(0.01, t + params.noteDuration)
          osc.start(t)
          osc.stop(t + params.noteDuration)
          
          logAudioEvent(
            LOG_LEVELS.SUCCESS,
            LOG_CATEGORIES.PLAY,
            `胜利音效第 ${index + 1} 声播放成功`,
            { note: noteFreq }
          )
        } catch (error) {
          logAudioEvent(
            LOG_LEVELS.ERROR,
            LOG_CATEGORIES.PLAY,
            `胜利音效第 ${index + 1} 声播放失败`,
            { error: error.message, stack: error.stack }
          )
        }
      }, index * params.noteDuration * 1000)
    })
  }

  /**
   * 点击音效
   */
  function playClickSound(ctx, oscillator, gainNode, now) {
    const freq = AUDIO_FREQUENCIES.click
    const params = AUDIO_PARAMS.click

    logAudioEvent(
      LOG_LEVELS.DEBUG,
      LOG_CATEGORIES.PLAY,
      '播放点击音效',
      { frequency: freq, type: 'sine' }
    )

    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(freq, now)
    gainNode.gain.setValueAtTime(params.gain, now)
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + params.duration)
    oscillator.start(now)
    oscillator.stop(now + params.duration)
  }

  return {
    isEnabled,
    playSound,
    forceInitializeAudioContext
  }
}
