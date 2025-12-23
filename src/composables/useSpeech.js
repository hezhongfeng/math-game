import { ref } from 'vue'

/**
 * 语音播报 Composable
 * 使用浏览器原生的 Speech Synthesis API
 */
export function useSpeech() {
  const isEnabled = ref(true)
  const isSpeaking = ref(false)
  const synthesis = window.speechSynthesis
  
  /**
   * 播报文本
   * @param {string} text - 要播报的文本
   * @param {Object} options - 配置选项
   */
  function speak(text, options = {}) {
    if (!isEnabled.value || !synthesis) return
    
    // 取消当前正在播报的内容
    synthesis.cancel()
    
    const utterance = new SpeechSynthesisUtterance(text)
    
    // 设置语言
    utterance.lang = options.lang || 'zh-CN'
    
    // 设置语速
    utterance.rate = options.rate || 0.9
    
    // 设置音量
    utterance.volume = options.volume || 1
    
    // 设置音调
    utterance.pitch = options.pitch || 1.2
    
    // 开始播报时
    utterance.onstart = () => {
      isSpeaking.value = true
    }
    
    // 播报结束时
    utterance.onend = () => {
      isSpeaking.value = false
    }
    
    // 出错时
    utterance.onerror = () => {
      isSpeaking.value = false
      console.error('语音播报出错')
    }
    
    synthesis.speak(utterance)
  }
  
  /**
   * 播报题目
   * @param {Object} question - 题目对象
   */
  function speakQuestion(question) {
    const text = `${question.operand1} ${getOperatorText(question.operator)} ${question.operand2} 等于多少？`
    speak(text, { rate: 0.8, pitch: 1.3 })
  }
  
  /**
   * 播报正确反馈
   */
  function speakCorrect() {
    const messages = ['答对了！', '太棒了！', '你真聪明！', '非常正确！']
    const message = messages[Math.floor(Math.random() * messages.length)]
    speak(message, { rate: 1, pitch: 1.4 })
  }
  
  /**
   * 播报错误反馈
   * @param {number} correctAnswer - 正确答案
   */
  function speakIncorrect(correctAnswer) {
    const messages = ['不对哦', '再想想', '加油', '继续努力']
    const message = messages[Math.floor(Math.random() * messages.length)]
    speak(`${message}，正确答案是 ${correctAnswer}`, { rate: 0.9, pitch: 1.2 })
  }
  
  /**
   * 播报鼓励语
   * @param {number} correctCount - 正确数量
   * @param {number} totalCount - 总题目数
   */
  function speakEncouragement(correctCount, totalCount) {
    const accuracy = Math.round((correctCount / totalCount) * 100)
    let message = ''
    
    if (accuracy === 100) {
      message = '完美！你太厉害了！'
    } else if (accuracy >= 80) {
      message = '做得很好！继续加油！'
    } else if (accuracy >= 60) {
      message = '还不错！再接再厉！'
    } else {
      message = '继续努力，你会越来越棒！'
    }
    
    speak(message, { rate: 1, pitch: 1.3 })
  }
  
  /**
   * 停止播报
   */
  function stop() {
    if (synthesis) {
      synthesis.cancel()
      isSpeaking.value = false
    }
  }
  
  /**
   * 切换语音开关
   */
  function toggle() {
    isEnabled.value = !isEnabled.value
    if (!isEnabled.value) {
      stop()
    }
  }
  
  /**
   * 获取运算符的中文表示
   * @param {string} operator - 运算符
   * @returns {string} 中文表示
   */
  function getOperatorText(operator) {
    const operators = {
      '+': '加',
      '-': '减',
      '×': '乘',
      '÷': '除'
    }
    return operators[operator] || operator
  }
  
  /**
   * 检查浏览器是否支持语音播报
   */
  function isSupported() {
    return 'speechSynthesis' in window
  }
  
  return {
    isEnabled,
    isSpeaking,
    speak,
    speakQuestion,
    speakCorrect,
    speakIncorrect,
    speakEncouragement,
    stop,
    toggle,
    isSupported
  }
}
