/**
 * 背景音乐音频合成工具
 */

import { AUDIO_FREQUENCIES, AUDIO_PARAMS } from '../config/constants'

/**
 * 创建背景音乐的音频缓冲区
 * @param {AudioContext} audioContext - 音频上下文
 * @returns {AudioBuffer|null}
 */
export function createBackgroundMusicBuffer(audioContext) {
  if (!audioContext) return null

  const freq = AUDIO_FREQUENCIES.melody
  const bass = AUDIO_FREQUENCIES.bass
  const params = AUDIO_PARAMS.backgroundMusic

  const duration = params.duration
  // Safari 修复：使用默认采样率以防 audioContext.sampleRate 为 0 或异常
  const sampleRate = audioContext.sampleRate || 44100

  try {
    // Safari/Webkit 要求缓冲区长度必须是整数
    const bufferLength = Math.floor(duration * sampleRate)
    const buffer = audioContext.createBuffer(2, bufferLength, sampleRate)

    // A段 - 明亮上升 (前4秒)
  const partA = [
    { freq: freq.C5, time: 0.0, dur: 0.5 },
    { freq: freq.C5, time: 0.5, dur: 0.5 },
    { freq: freq.G5, time: 1.0, dur: 0.5 },
    { freq: freq.G5, time: 1.5, dur: 0.5 },
    { freq: freq.A5, time: 2.0, dur: 0.5 },
    { freq: freq.A5, time: 2.5, dur: 0.5 },
    { freq: freq.G5, time: 3.0, dur: 0.5 },
    { freq: freq.F5, time: 3.5, dur: 0.5 },
  ]

  // B段 - 柔和下落 (后4秒)
  const partB = [
    { freq: freq.E5, time: 4.0, dur: 0.5 },
    { freq: freq.E5, time: 4.5, dur: 0.5 },
    { freq: freq.D5, time: 5.0, dur: 0.5 },
    { freq: freq.D5, time: 5.5, dur: 0.5 },
    { freq: freq.C5, time: 6.0, dur: 0.5 },
    { freq: freq.C5, time: 6.5, dur: 0.5 },
    { freq: freq.E5, time: 7.0, dur: 0.5 },
    { freq: freq.C5, time: 7.5, dur: 0.5 },
  ]

  // 低音伴奏
  const bassNotes = [
    { freq: bass.G3, time: 0 },
    { freq: bass.G3, time: 1 },
    { freq: bass.A3, time: 2 },
    { freq: bass.A3, time: 3 },
    { freq: bass.G3, time: 4 },
    { freq: bass.G3, time: 5 },
    { freq: bass.E3, time: 6 },
    { freq: bass.G3, time: 7 },
  ]

  const melody = [...partA, ...partB]

  for (let channel = 0; channel < 2; channel++) {
    const channelData = buffer.getChannelData(channel)

    // 主旋律
    melody.forEach(note => {
      const startSample = Math.floor(note.time * sampleRate)
      const noteDuration = Math.floor(note.dur * sampleRate)

      for (let i = startSample; i < startSample + noteDuration && i < channelData.length; i++) {
        const t = (i - startSample) / sampleRate

        const envelope = Math.exp(-t * 2.5) * (1 - t * 0.15)
        const sample = Math.sin(2 * Math.PI * note.freq * i / sampleRate) * params.melodyGain * envelope

        channelData[i] += sample
      }
    })

    // 低音伴奏
    bassNotes.forEach(note => {
      const startSample = Math.floor(note.time * sampleRate)
      const noteDur = 1.0

      for (let i = startSample; i < startSample + noteDur * sampleRate && i < channelData.length; i++) {
        const t = (i - startSample) / sampleRate
        const envelope = Math.exp(-t * 1.2)
        const sample = Math.sin(2 * Math.PI * note.freq * i / sampleRate) * params.bassGain * envelope
        const sample2 = Math.sin(2 * Math.PI * note.freq * 2 * i / sampleRate) * params.bassOvertoneGain * envelope

        channelData[i] += sample + sample2
      }
    })
  }

  return buffer
  } catch (error) {
    console.error('Failed to create background music buffer:', error)
    return null
  }
}
