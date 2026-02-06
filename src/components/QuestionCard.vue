<script setup>
import { computed } from 'vue'
import { Clock, Terminal } from 'lucide-vue-next'

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  showAnswer: {
    type: Boolean,
    default: false
  },
  userAnswer: {
    type: String,
    default: ''
  },
  currentIndex: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    default: 10
  },
  questionTimer: {
    type: Number,
    default: 0
  }
})

const shouldShowFeedback = computed(() => props.showAnswer && props.question.userAnswer !== null)
const isCorrect = computed(() => props.question.isCorrect === true)
const isIncorrect = computed(() => props.question.isCorrect === false)

// 格式化计时器显示 MM:SS
const formattedTime = computed(() => {
  const minutes = Math.floor(props.questionTimer / 60)
  const seconds = props.questionTimer % 60
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// 答案显示
const answerDisplay = computed(() => {
  if (shouldShowFeedback.value) {
    return isCorrect.value ? props.question.answer : props.userAnswer
  }
  return props.userAnswer || '_'
})
</script>

<template>
  <div 
    class="terminal-card" 
    :class="{ 
      'is-success': isCorrect, 
      'is-error': isIncorrect 
    }"
  >
    <!-- 扫描线效果 -->
    <div class="scan-line"></div>
    
    <!-- 顶部状态栏 -->
    <div class="terminal-header">
      <div class="terminal-info">
        <Terminal :size="16" class="terminal-icon" />
        <span class="task-label">TASK_{{ currentIndex + 1 }}</span>
      </div>
      <div class="progress-bar">
        <div 
          class="progress-fill" 
          :style="{ width: ((currentIndex + 1) / totalQuestions * 100) + '%' }"
        ></div>
      </div>
      <div class="timer-display">
        <Clock :size="14" />
        <span>{{ formattedTime }}</span>
      </div>
    </div>

    <!-- 算式终端区域 -->
    <div class="terminal-body">
      <div class="calculation-line">
        <span class="operand" data-type="number">{{ question.operand1 }}</span>
        <span class="operator" data-type="op">{{ question.operator }}</span>
        <span class="operand" data-type="number">{{ question.operand2 }}</span>
        <span class="equals" data-type="op">=</span>
        <span 
          class="answer-display" 
          :class="{ 
            'is-placeholder': !userAnswer && !showAnswer,
            'is-correct': isCorrect,
            'is-wrong': isIncorrect 
          }"
        >
          {{ answerDisplay }}
          <span v-if="!userAnswer && !showAnswer" class="cursor-blink"></span>
        </span>
      </div>
      
      <!-- 状态信息 -->
      <div class="status-line">
        <span class="status-label">STATUS:</span>
        <span v-if="isCorrect" class="status-value success">COMPLETE ✓</span>
        <span v-else-if="isIncorrect" class="status-value error">RETRY NEEDED</span>
        <span v-else class="status-value waiting">AWAITING INPUT...</span>
      </div>
    </div>
    
    <!-- 装饰角标 -->
    <div class="corner-decoration top-left"></div>
    <div class="corner-decoration top-right"></div>
    <div class="corner-decoration bottom-left"></div>
    <div class="corner-decoration bottom-right"></div>
  </div>
</template>

<style scoped>
.terminal-card {
  position: relative;
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.98) 0%, rgba(30, 41, 59, 0.95) 100%);
  border-radius: var(--radius-sharp-lg);
  border: 2px solid rgba(0, 102, 255, 0.3);
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 420px;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  box-shadow: 
    0 0 40px rgba(0, 102, 255, 0.1),
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  overflow: hidden;
  transition: all var(--duration-micro) ease;
}

/* 扫描线效果 */
.scan-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--hero-blue), transparent);
  opacity: 0.5;
  animation: scanMove 3s linear infinite;
  pointer-events: none;
}

@keyframes scanMove {
  0% { transform: translateY(0); opacity: 0; }
  10% { opacity: 0.5; }
  90% { opacity: 0.5; }
  100% { transform: translateY(200px); opacity: 0; }
}

/* 成功状态 */
.is-success {
  border-color: rgba(0, 208, 132, 0.5);
  box-shadow: 
    0 0 40px rgba(0, 208, 132, 0.2),
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.is-success .scan-line {
  background: linear-gradient(90deg, transparent, var(--win-green), transparent);
}

/* 错误状态 */
.is-error {
  border-color: rgba(255, 107, 53, 0.5);
  box-shadow: 
    0 0 40px rgba(255, 107, 53, 0.2),
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.is-error .scan-line {
  background: linear-gradient(90deg, transparent, var(--alert-orange), transparent);
}

/* 顶部状态栏 */
.terminal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 102, 255, 0.2);
}

.terminal-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--hero-blue);
}

.terminal-icon {
  filter: drop-shadow(0 0 8px rgba(0, 102, 255, 0.5));
}

.task-label {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--hero-blue);
  text-shadow: 0 0 10px rgba(0, 102, 255, 0.5);
}

/* 进度条 */
.progress-bar {
  flex: 1;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  overflow: hidden;
  max-width: 120px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--hero-blue), var(--hero-blue-light));
  border-radius: var(--radius-full);
  transition: width var(--duration-macro) ease;
  box-shadow: 0 0 10px rgba(0, 102, 255, 0.5);
}

/* 计时器 */
.timer-display {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: rgba(0, 102, 255, 0.1);
  border: 1px solid rgba(0, 102, 255, 0.3);
  border-radius: var(--radius-sharp-sm);
  font-size: 14px;
  font-weight: 600;
  color: var(--hero-blue);
  font-variant-numeric: tabular-nums;
  font-family: 'Courier New', monospace;
}

/* 算式区域 */
.terminal-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.calculation-line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px 0;
}

.operand {
  font-size: 52px;
  font-weight: 800;
  color: white;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.operator {
  font-size: 48px;
  font-weight: 700;
  color: var(--hero-blue);
  line-height: 1;
  text-shadow: 0 0 15px rgba(0, 102, 255, 0.6);
}

.equals {
  font-size: 48px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1;
}

/* 答案显示 */
.answer-display {
  position: relative;
  font-size: 52px;
  font-weight: 800;
  color: white;
  line-height: 1;
  min-width: 80px;
  text-align: center;
  padding: 12px 20px;
  background: rgba(0, 102, 255, 0.1);
  border: 2px solid rgba(0, 102, 255, 0.4);
  border-radius: var(--radius-sharp-md);
  font-variant-numeric: tabular-nums;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
  transition: all var(--duration-micro) ease;
  font-family: 'Courier New', monospace;
}

.answer-display.is-placeholder {
  color: rgba(255, 255, 255, 0.3);
  border-style: dashed;
  border-color: rgba(0, 102, 255, 0.2);
}

.answer-display.is-correct {
  color: var(--win-green);
  background: rgba(0, 208, 132, 0.15);
  border-color: var(--win-green);
  text-shadow: 0 0 20px rgba(0, 208, 132, 0.5);
  box-shadow: 0 0 30px rgba(0, 208, 132, 0.3);
}

.answer-display.is-wrong {
  color: var(--alert-orange);
  background: rgba(255, 107, 53, 0.15);
  border-color: var(--alert-orange);
  text-shadow: 0 0 20px rgba(255, 107, 53, 0.5);
  animation: techShake var(--duration-bounce) ease;
}

/* 光标闪烁 */
.cursor-blink {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 40px;
  background: var(--hero-blue);
  animation: cursorBlink 1s step-end infinite;
  box-shadow: 0 0 10px var(--hero-blue);
}

/* 状态行 */
.status-line {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.status-label {
  color: rgba(148, 163, 184, 0.8);
  letter-spacing: 0.1em;
}

.status-value {
  font-weight: 700;
  letter-spacing: 0.05em;
}

.status-value.success {
  color: var(--win-green);
  text-shadow: 0 0 10px rgba(0, 208, 132, 0.5);
}

.status-value.error {
  color: var(--alert-orange);
  text-shadow: 0 0 10px rgba(255, 107, 53, 0.5);
}

.status-value.waiting {
  color: var(--hero-blue);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* 装饰角标 */
.corner-decoration {
  position: absolute;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(0, 102, 255, 0.3);
}

.corner-decoration.top-left {
  top: 8px;
  left: 8px;
  border-right: none;
  border-bottom: none;
}

.corner-decoration.top-right {
  top: 8px;
  right: 8px;
  border-left: none;
  border-bottom: none;
}

.corner-decoration.bottom-left {
  bottom: 8px;
  left: 8px;
  border-right: none;
  border-top: none;
}

.corner-decoration.bottom-right {
  bottom: 8px;
  right: 8px;
  border-left: none;
  border-top: none;
}

.is-success .corner-decoration {
  border-color: rgba(0, 208, 132, 0.4);
}

.is-error .corner-decoration {
  border-color: rgba(255, 107, 53, 0.4);
}

/* 响应式 */
@media (min-width: 768px) {
  .terminal-card {
    padding: 36px 32px;
    max-width: 480px;
  }

  .operand {
    font-size: 64px;
  }

  .operator,
  .equals {
    font-size: 56px;
  }

  .answer-display {
    font-size: 64px;
    min-width: 100px;
    padding: 16px 24px;
  }
  
  .cursor-blink {
    height: 50px;
  }
}
</style>
