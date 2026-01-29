<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Trophy, Play, Star, Sparkles } from 'lucide-vue-next'
import { useStorage } from '../composables/useStorage'
import { useSound } from '../composables/useSound'
import { DIFFICULTY_GROUPS } from '../config/difficulty'
import TouchOptimizedButton from '../components/TouchOptimizedButton.vue'
import AnimatedCard from '../components/AnimatedCard.vue'

const router = useRouter()
const { getAllBestScores } = useStorage()
const { playSound, forceInitializeAudioContext } = useSound()

const bestScores = getAllBestScores()
const completedCount = Object.keys(bestScores).length

// 水母数据 - 优化形态和动画，更加生动可爱
const jellyfishes = [
  // 第一组: 珊瑚粉色系 - 温柔可爱型
  {
    color: '#FFAB91',
    delay: 0,
    left: '8%',
    startTop: '85%',
    size: 45,
    opacity: 0.75,
    type: 'cute', // 可爱型
    speed: 1.0,
    wiggle: 0.8
  },
  {
    color: '#FF8A65',
    delay: 0.8,
    left: '5%',
    startTop: '70%',
    size: 38,
    opacity: 0.7,
    type: 'playful', // 活泼型
    speed: 1.2,
    wiggle: 1.2
  },
  {
    color: '#FFCCBC',
    delay: 1.5,
    left: '12%',
    startTop: '55%',
    size: 42,
    opacity: 0.8,
    type: 'gentle', // 温和型
    speed: 0.9,
    wiggle: 0.6
  },
  {
    color: '#FF8A80',
    delay: 2.2,
    left: '3%',
    startTop: '40%',
    size: 35,
    opacity: 0.65,
    type: 'bouncy', // 弹跳型
    speed: 1.4,
    wiggle: 1.5
  },

  // 第二组: 天蓝色系 - 梦幻飘逸型
  {
    color: '#81D4FA',
    delay: 3,
    left: '18%',
    startTop: '45%',
    size: 40,
    opacity: 0.7,
    type: 'dreamy', // 梦幻型
    speed: 0.8,
    wiggle: 0.9
  },
  {
    color: '#4FC3F7',
    delay: 4.2,
    left: '32%',
    startTop: '35%',
    size: 48,
    opacity: 0.8,
    type: 'elegant', // 优雅型
    speed: 0.7,
    wiggle: 0.5
  },
  {
    color: '#B3E5FC',
    delay: 5.5,
    left: '45%',
    startTop: '95%',
    size: 44,
    opacity: 0.75,
    type: 'cute',
    speed: 1.1,
    wiggle: 1.0
  },
  {
    color: '#29B6F6',
    delay: 6.8,
    left: '42%',
    startTop: '80%',
    size: 36,
    opacity: 0.7,
    type: 'playful',
    speed: 1.3,
    wiggle: 1.4
  },

  // 第三组: 薰衣草紫色系 - 神秘优雅型
  {
    color: '#CE93D8',
    delay: 8,
    left: '68%',
    startTop: '72%',
    size: 46,
    opacity: 0.8,
    type: 'mysterious', // 神秘型
    speed: 0.6,
    wiggle: 0.7
  },
  {
    color: '#BA68C8',
    delay: 9.5,
    left: '75%',
    startTop: '58%',
    size: 39,
    opacity: 0.7,
    type: 'gentle',
    speed: 0.9,
    wiggle: 0.8
  },
  {
    color: '#E1BEE7',
    delay: 11,
    left: '82%',
    startTop: '42%',
    size: 43,
    opacity: 0.75,
    type: 'dreamy',
    speed: 0.8,
    wiggle: 1.1
  },

  // 第四组: 薄荷绿色系 - 清新活力型
  {
    color: '#80CBC4',
    delay: 12.5,
    left: '15%',
    startTop: '75%',
    size: 41,
    opacity: 0.7,
    type: 'fresh', // 清新型
    speed: 1.0,
    wiggle: 1.0
  },
  {
    color: '#4DB6AC',
    delay: 14,
    left: '35%',
    startTop: '90%',
    size: 47,
    opacity: 0.8,
    type: 'bouncy',
    speed: 1.2,
    wiggle: 1.3
  },
  {
    color: '#A5D6A7',
    delay: 15.5,
    left: '55%',
    startTop: '70%',
    size: 38,
    opacity: 0.7,
    type: 'playful',
    speed: 1.1,
    wiggle: 1.2
  },

  // 第五组: 奶油黄色系 - 温暖阳光型
  {
    color: '#FFF176',
    delay: 17,
    left: '25%',
    startTop: '50%',
    size: 40,
    opacity: 0.75,
    type: 'sunny', // 阳光型
    speed: 1.0,
    wiggle: 0.9
  },
  {
    color: '#FFEE58',
    delay: 18.5,
    left: '50%',
    startTop: '85%',
    size: 44,
    opacity: 0.8,
    type: 'cheerful', // 欢快型
    speed: 1.3,
    wiggle: 1.4
  },
  {
    color: '#FFF59D',
    delay: 20,
    left: '70%',
    startTop: '60%',
    size: 37,
    opacity: 0.7,
    type: 'gentle',
    speed: 0.9,
    wiggle: 0.8
  }
]

function startGame() {
  playSound('click')
  router.push('/difficulty')
}

function viewAchievements() {
  playSound('click')
  router.push('/difficulty')
}

// 计算水母样式 - 根据类型应用不同动画
function jellyStyle(jelly) {
  const baseStyle = {
    left: jelly.left,
    top: jelly.startTop,
    width: `${jelly.size}px`,
    height: `${jelly.size * 0.9}px`,
    animationDelay: `${jelly.delay}s`,
    opacity: jelly.opacity
  }

  // 根据类型添加不同的动画类
  const animationClass = getJellyAnimationClass(jelly.type, jelly.speed, jelly.wiggle)

  return {
    ...baseStyle,
    animationDuration: `${25 / jelly.speed}s`
  }
}

// 获取水母动画类名
function getJellyAnimationClass(type, speed, wiggle) {
  const animations = {
    cute: 'floatJellyfish-cute',
    playful: 'floatJellyfish-playful',
    gentle: 'floatJellyfish-gentle',
    bouncy: 'floatJellyfish-bouncy',
    dreamy: 'floatJellyfish-dreamy',
    elegant: 'floatJellyfish-elegant',
    mysterious: 'floatJellyfish-mysterious',
    fresh: 'floatJellyfish-fresh',
    sunny: 'floatJellyfish-sunny',
    cheerful: 'floatJellyfish-cheerful'
  }
  return animations[type] || 'floatJellyfish'
}

// 获取水母触手数量
function getTentacleCount(type) {
  const tentacleCounts = {
    cute: 4,
    playful: 5,
    gentle: 3,
    bouncy: 6,
    dreamy: 4,
    elegant: 3,
    mysterious: 5,
    fresh: 4,
    sunny: 5,
    cheerful: 6
  }
  return tentacleCounts[type] || 4
}

// iOS Safari 兼容性修复
onMounted(() => {
  forceInitializeAudioContext().catch(() => {})
})
</script>

<template>
  <div class="page">
    <!-- 装饰性浮动元素 -->
    <div class="floating-decorations">
      <div class="deco-circle deco-1"></div>
      <div class="deco-circle deco-2"></div>
      <div class="deco-circle deco-3"></div>
      <div class="deco-star">⭐</div>
      <div class="deco-sparkle">✨</div>
    </div>

    <!-- 水母背景 - 优化形态和动画 -->
    <div class="jellyfishes">
      <div
        v-for="(jelly, index) in jellyfishes"
        :key="index"
        :class="[
          'jellyfish',
          `jellyfish-${jelly.type}`,
          getJellyAnimationClass(jelly.type, jelly.speed, jelly.wiggle)
        ]"
        :style="jellyStyle(jelly)"
      >
        <!-- 水母头部 - 增强3D效果 -->
        <div class="jelly-head" :style="{
          background: `linear-gradient(135deg, ${jelly.color}, ${jelly.color}dd)`,
          filter: `hue-rotate(${Math.sin(index * 0.5) * 10}deg)`
        }">
          <!-- 多层光泽效果 -->
          <div class="jelly-shine jelly-shine-main"></div>
          <div class="jelly-shine jelly-shine-secondary"></div>
          <!-- 可爱的眼睛（部分水母） -->
          <div v-if="['cute', 'playful', 'cheerful'].includes(jelly.type)" class="jelly-eyes">
            <div class="jelly-eye jelly-eye-left"></div>
            <div class="jelly-eye jelly-eye-right"></div>
          </div>
          <!-- 腮红效果（可爱型水母） -->
          <div v-if="jelly.type === 'cute'" class="jelly-blush">
            <div class="blush blush-left"></div>
            <div class="blush blush-right"></div>
          </div>
        </div>

        <!-- 水母触手 - 更生动的摆动 -->
        <div class="jelly-tentacles" :class="`tentacles-${jelly.type}`">
          <div
            v-for="i in getTentacleCount(jelly.type)"
            :key="i"
            class="tentacle"
            :class="`tentacle-${i}`"
            :style="{
              background: `linear-gradient(to bottom, ${jelly.color}aa, ${jelly.color}66)`,
              animationDelay: `${i * 0.1 + jelly.delay * 0.1}s`,
              animationDuration: `${2 + jelly.wiggle * 0.5}s`
            }"
          ></div>
        </div>

        <!-- 装饰性粒子效果 -->
        <div v-if="['dreamy', 'mysterious', 'elegant'].includes(jelly.type)" class="jelly-particles">
          <div
            v-for="p in 3"
            :key="p"
            class="particle"
            :style="{
              animationDelay: `${jelly.delay + p * 0.3}s`,
              background: jelly.color
            }"
          ></div>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="content">
      <!-- 标题区 -->
      <div class="header animate-fade-in-up">
        <!-- 渐变发光标题 - 使用儿童友好字体 -->
        <h1 class="title">
          <span class="title-text font-child-friendly">快乐数学</span>
          <Sparkles class="title-sparkle" :size="32" />
        </h1>
        <p class="subtitle animate-pulse-gentle font-child-friendly">
          <span class="subtitle-icon">🎯</span>
          趣味学习，快乐成长！
          <span class="subtitle-icon">🚀</span>
        </p>
      </div>

      <!-- 统计卡片 - 使用新的AnimatedCard组件 -->
      <div class="stats">
        <AnimatedCard
          elevation="medium"
          :interactive="true"
          variant="default"
          padding="md"
          class="stat-card stat-card-trophy animate-card-entrance"
          style="animation-delay: 100ms"
        >
          <div class="stat-icon-wrapper icon-trophy">
            <Trophy :size="28" class="stat-icon" />
          </div>
          <p class="stat-value">{{ completedCount }}</p>
          <p class="stat-label">已完成关卡</p>
        </AnimatedCard>

        <AnimatedCard
          elevation="medium"
          :interactive="true"
          variant="default"
          padding="md"
          class="stat-card stat-card-star animate-card-entrance"
          style="animation-delay: 200ms"
        >
          <div class="stat-icon-wrapper icon-star">
            <Star :size="28" class="stat-icon" />
          </div>
          <p class="stat-value">{{ DIFFICULTY_GROUPS.length * 3 }}</p>
          <p class="stat-label">总关卡数</p>
        </AnimatedCard>
      </div>

      <!-- 主按钮 - 使用新的TouchOptimizedButton组件 -->
      <div class="buttons">
        <TouchOptimizedButton
          size="large"
          variant="primary"
          :icon="Play"
          :icon-size="24"
          :haptic-feedback="true"
          class="animate-button-entrance"
          style="animation-delay: 300ms"
          @click="startGame"
        >
          开始游戏
        </TouchOptimizedButton>

        <TouchOptimizedButton
          size="large"
          variant="secondary"
          :icon="Trophy"
          :icon-size="24"
          :haptic-feedback="true"
          class="animate-button-entrance"
          style="animation-delay: 400ms"
          @click="viewAchievements"
        >
          查看成就
        </TouchOptimizedButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  position: relative;
  background: linear-gradient(180deg, #FFF8E1 0%, #F3E5F5 30%, #E0F7FA 60%, #FFF8E1 100%);
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: max(24px, env(safe-area-inset-bottom));
}

/* 装饰性浮动元素 */
.floating-decorations {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.deco-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.3;
}

.deco-1 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, #FF8A80, #FFAB91);
  top: 5%;
  right: -50px;
  animation: float-rotate 8s ease-in-out infinite;
}

.deco-2 {
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, #81D4FA, #4FC3F7);
  bottom: 15%;
  left: -30px;
  animation: float-rotate 10s ease-in-out infinite reverse;
}

.deco-3 {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #CE93D8, #BA68C8);
  top: 40%;
  left: 5%;
  animation: float-gentle 6s ease-in-out infinite;
}

.deco-star, .deco-sparkle {
  position: absolute;
  font-size: 24px;
  animation: starTwinkle 2s ease-in-out infinite;
}

.deco-star {
  top: 15%;
  left: 15%;
  animation-delay: 0.5s;
}

.deco-sparkle {
  top: 25%;
  right: 12%;
  animation-delay: 1s;
}

/* 水母动画 */
.jellyfishes {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.jellyfish {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: floatJellyfish 20s linear infinite;
  opacity: 0;
}

/* 不同类型水母的专属动画 */
.jellyfish-cute {
  animation: floatJellyfish-cute 22s linear infinite;
}

.jellyfish-playful {
  animation: floatJellyfish-playful 18s linear infinite;
}

.jellyfish-gentle {
  animation: floatJellyfish-gentle 25s linear infinite;
}

.jellyfish-bouncy {
  animation: floatJellyfish-bouncy 16s linear infinite;
}

.jellyfish-dreamy {
  animation: floatJellyfish-dreamy 28s linear infinite;
}

.jellyfish-elegant {
  animation: floatJellyfish-elegant 30s linear infinite;
}

.jellyfish-mysterious {
  animation: floatJellyfish-mysterious 32s linear infinite;
}

.jellyfish-fresh {
  animation: floatJellyfish-fresh 20s linear infinite;
}

.jellyfish-sunny {
  animation: floatJellyfish-sunny 19s linear infinite;
}

.jellyfish-cheerful {
  animation: floatJellyfish-cheerful 15s linear infinite;
}

.jelly-head {
  width: 100%;
  height: 100%;
  border-radius: 50% 50% 45% 45% / 60% 60% 40% 40%;
  position: relative;
  box-shadow:
    inset -6px -6px 16px rgba(0, 0, 0, 0.08),
    inset 6px 6px 16px rgba(255, 255, 255, 0.4),
    0 8px 25px rgba(0, 0, 0, 0.1);
  animation: jellyPulse 3s ease-in-out infinite;
}

.jelly-shine {
  position: absolute;
  border-radius: 50%;
}

.jelly-shine-main {
  top: 15%;
  left: 20%;
  width: 25%;
  height: 35%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.7), transparent);
}

.jelly-shine-secondary {
  top: 25%;
  right: 25%;
  width: 15%;
  height: 20%;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.4), transparent);
}

/* 可爱的眼睛 */
.jelly-eyes {
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.jelly-eye {
  width: 6px;
  height: 8px;
  background: #2E3440;
  border-radius: 50%;
  position: relative;
  animation: eyeBlink 4s ease-in-out infinite;
}

.jelly-eye::after {
  content: '';
  position: absolute;
  top: 1px;
  left: 1px;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
}

/* 腮红效果 */
.jelly-blush {
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 16px;
}

.blush {
  width: 8px;
  height: 6px;
  background: rgba(255, 182, 193, 0.6);
  border-radius: 50%;
  animation: blushGlow 3s ease-in-out infinite;
}

/* 装饰性粒子效果 */
.jelly-particles {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 120%;
  height: 120%;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  opacity: 0;
  animation: particleFloat 4s ease-in-out infinite;
}

.particle:nth-child(1) {
  top: 20%;
  left: 30%;
  animation-delay: 0s;
}

.particle:nth-child(2) {
  top: 40%;
  right: 25%;
  animation-delay: 1.3s;
}

.particle:nth-child(3) {
  bottom: 30%;
  left: 40%;
  animation-delay: 2.6s;
}

@keyframes jellyPulse {
  0%, 100% {
    transform: scale(1);
    border-radius: 50% 50% 45% 45% / 60% 60% 40% 40%;
  }
  50% {
    transform: scale(1.03);
    border-radius: 52% 52% 48% 48% / 62% 62% 38% 38%;
  }
}

@keyframes eyeBlink {
  0%, 90%, 100% { transform: scaleY(1); }
  95% { transform: scaleY(0.1); }
}

@keyframes blushGlow {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
}

@keyframes particleFloat {
  0%, 100% {
    opacity: 0;
    transform: translateY(0) scale(0.5);
  }
  50% {
    opacity: 0.7;
    transform: translateY(-15px) scale(1);
  }
}

.jelly-tentacles {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-top: -8px;
}

.tentacle {
  width: 3px;
  height: 30px;
  border-radius: 0 0 50% 50%;
  opacity: 0.6;
  animation: tentacleWave 2s ease-in-out infinite;
}

/* 不同类型水母的触手样式 */
.tentacles-cute .tentacle {
  animation: tentacleWave-cute 2.2s ease-in-out infinite;
}

.tentacles-playful .tentacle {
  animation: tentacleWave-playful 1.8s ease-in-out infinite;
}

.tentacles-bouncy .tentacle {
  animation: tentacleWave-bouncy 1.5s ease-in-out infinite;
}

.tentacles-dreamy .tentacle {
  animation: tentacleWave-dreamy 2.8s ease-in-out infinite;
}

.tentacles-elegant .tentacle {
  animation: tentacleWave-elegant 3.2s ease-in-out infinite;
}

.tentacle:nth-child(1) { animation-delay: 0s; }
.tentacle:nth-child(2) { animation-delay: 0.2s; }
.tentacle:nth-child(3) { animation-delay: 0.4s; }
.tentacle:nth-child(4) { animation-delay: 0.1s; }
.tentacle:nth-child(5) { animation-delay: 0.3s; }
.tentacle:nth-child(6) { animation-delay: 0.5s; }

@keyframes tentacleWave {
  0%, 100% { transform: translateX(0) rotate(-5deg); }
  50% { transform: translateX(2px) rotate(5deg); }
}

@keyframes tentacleWave-cute {
  0%, 100% { transform: translateX(0) rotate(-3deg) scaleY(1); }
  50% { transform: translateX(1px) rotate(3deg) scaleY(1.05); }
}

@keyframes tentacleWave-playful {
  0%, 100% { transform: translateX(0) rotate(-8deg); }
  25% { transform: translateX(3px) rotate(8deg); }
  75% { transform: translateX(-2px) rotate(-4deg); }
}

@keyframes tentacleWave-bouncy {
  0%, 100% { transform: translateX(0) rotate(-10deg) scaleY(1); }
  50% { transform: translateX(4px) rotate(10deg) scaleY(1.1); }
}

@keyframes tentacleWave-dreamy {
  0%, 100% { transform: translateX(0) rotate(-2deg); }
  33% { transform: translateX(1px) rotate(2deg); }
  66% { transform: translateX(-1px) rotate(-1deg); }
}

@keyframes tentacleWave-elegant {
  0%, 100% { transform: translateX(0) rotate(-1deg); }
  50% { transform: translateX(0.5px) rotate(1deg); }
}

/* 基础水母浮动动画 */
@keyframes floatJellyfish {
  0% {
    transform: translateY(0) rotate(-3deg);
    opacity: 0;
  }
  3% {
    opacity: 0.7;
  }
  97% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(-120vh) rotate(3deg);
    opacity: 0;
  }
}

/* 可爱型 - 轻柔摆动 */
@keyframes floatJellyfish-cute {
  0% {
    transform: translateY(0) rotate(-2deg) scale(1);
    opacity: 0;
  }
  3% {
    opacity: 0.8;
  }
  25% {
    transform: translateY(-30vh) rotate(1deg) scale(1.02);
  }
  50% {
    transform: translateY(-60vh) rotate(-1deg) scale(1);
  }
  75% {
    transform: translateY(-90vh) rotate(2deg) scale(1.01);
  }
  97% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-120vh) rotate(-1deg) scale(1);
    opacity: 0;
  }
}

/* 活泼型 - 左右摆动 */
@keyframes floatJellyfish-playful {
  0% {
    transform: translateY(0) translateX(0) rotate(-4deg);
    opacity: 0;
  }
  3% {
    opacity: 0.75;
  }
  20% {
    transform: translateY(-24vh) translateX(10px) rotate(4deg);
  }
  40% {
    transform: translateY(-48vh) translateX(-8px) rotate(-3deg);
  }
  60% {
    transform: translateY(-72vh) translateX(12px) rotate(5deg);
  }
  80% {
    transform: translateY(-96vh) translateX(-6px) rotate(-2deg);
  }
  97% {
    opacity: 0.75;
  }
  100% {
    transform: translateY(-120vh) translateX(0) rotate(3deg);
    opacity: 0;
  }
}

/* 温和型 - 平稳上升 */
@keyframes floatJellyfish-gentle {
  0% {
    transform: translateY(0) rotate(-1deg);
    opacity: 0;
  }
  3% {
    opacity: 0.8;
  }
  97% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-120vh) rotate(1deg);
    opacity: 0;
  }
}

/* 弹跳型 - 上下弹跳 */
@keyframes floatJellyfish-bouncy {
  0% {
    transform: translateY(0) rotate(-5deg) scale(1);
    opacity: 0;
  }
  3% {
    opacity: 0.7;
  }
  15% {
    transform: translateY(-18vh) rotate(5deg) scale(1.05);
  }
  25% {
    transform: translateY(-22vh) rotate(-3deg) scale(0.98);
  }
  35% {
    transform: translateY(-38vh) rotate(4deg) scale(1.03);
  }
  45% {
    transform: translateY(-42vh) rotate(-2deg) scale(0.99);
  }
  55% {
    transform: translateY(-58vh) rotate(3deg) scale(1.02);
  }
  65% {
    transform: translateY(-62vh) rotate(-4deg) scale(0.97);
  }
  75% {
    transform: translateY(-78vh) rotate(2deg) scale(1.01);
  }
  85% {
    transform: translateY(-82vh) rotate(-1deg) scale(1);
  }
  97% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(-120vh) rotate(3deg) scale(1);
    opacity: 0;
  }
}

/* 梦幻型 - 飘逸旋转 */
@keyframes floatJellyfish-dreamy {
  0% {
    transform: translateY(0) rotate(0deg) scale(1);
    opacity: 0;
  }
  3% {
    opacity: 0.8;
  }
  25% {
    transform: translateY(-30vh) rotate(90deg) scale(1.01);
  }
  50% {
    transform: translateY(-60vh) rotate(180deg) scale(0.99);
  }
  75% {
    transform: translateY(-90vh) rotate(270deg) scale(1.01);
  }
  97% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-120vh) rotate(360deg) scale(1);
    opacity: 0;
  }
}

/* 优雅型 - 缓慢优雅 */
@keyframes floatJellyfish-elegant {
  0% {
    transform: translateY(0) rotate(0deg) scale(1);
    opacity: 0;
  }
  3% {
    opacity: 0.85;
  }
  33% {
    transform: translateY(-40vh) rotate(-2deg) scale(1.01);
  }
  66% {
    transform: translateY(-80vh) rotate(2deg) scale(0.99);
  }
  97% {
    opacity: 0.85;
  }
  100% {
    transform: translateY(-120vh) rotate(0deg) scale(1);
    opacity: 0;
  }
}

/* 神秘型 - 渐隐渐现 */
@keyframes floatJellyfish-mysterious {
  0% {
    transform: translateY(0) rotate(-3deg);
    opacity: 0;
  }
  3% {
    opacity: 0.6;
  }
  20% {
    opacity: 0.9;
    transform: translateY(-24vh) rotate(2deg);
  }
  40% {
    opacity: 0.4;
    transform: translateY(-48vh) rotate(-1deg);
  }
  60% {
    opacity: 0.8;
    transform: translateY(-72vh) rotate(3deg);
  }
  80% {
    opacity: 0.5;
    transform: translateY(-96vh) rotate(-2deg);
  }
  97% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(-120vh) rotate(1deg);
    opacity: 0;
  }
}

/* 清新型 - 轻快摆动 */
@keyframes floatJellyfish-fresh {
  0% {
    transform: translateY(0) translateX(0) rotate(-3deg);
    opacity: 0;
  }
  3% {
    opacity: 0.75;
  }
  25% {
    transform: translateY(-30vh) translateX(5px) rotate(3deg);
  }
  50% {
    transform: translateY(-60vh) translateX(-3px) rotate(-2deg);
  }
  75% {
    transform: translateY(-90vh) translateX(4px) rotate(2deg);
  }
  97% {
    opacity: 0.75;
  }
  100% {
    transform: translateY(-120vh) translateX(0) rotate(-1deg);
    opacity: 0;
  }
}

/* 阳光型 - 明亮闪烁 */
@keyframes floatJellyfish-sunny {
  0% {
    transform: translateY(0) rotate(-2deg) scale(1);
    opacity: 0;
    filter: brightness(1);
  }
  3% {
    opacity: 0.8;
  }
  25% {
    transform: translateY(-30vh) rotate(2deg) scale(1.02);
    filter: brightness(1.1);
  }
  50% {
    transform: translateY(-60vh) rotate(-1deg) scale(1);
    filter: brightness(1);
  }
  75% {
    transform: translateY(-90vh) rotate(3deg) scale(1.01);
    filter: brightness(1.05);
  }
  97% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-120vh) rotate(1deg) scale(1);
    opacity: 0;
    filter: brightness(1);
  }
}

/* 欢快型 - 快速弹跳 */
@keyframes floatJellyfish-cheerful {
  0% {
    transform: translateY(0) translateX(0) rotate(-6deg) scale(1);
    opacity: 0;
  }
  3% {
    opacity: 0.7;
  }
  12% {
    transform: translateY(-14vh) translateX(8px) rotate(6deg) scale(1.04);
  }
  20% {
    transform: translateY(-18vh) translateX(-6px) rotate(-4deg) scale(0.98);
  }
  28% {
    transform: translateY(-32vh) translateX(10px) rotate(5deg) scale(1.03);
  }
  36% {
    transform: translateY(-36vh) translateX(-4px) rotate(-3deg) scale(0.99);
  }
  44% {
    transform: translateY(-50vh) translateX(7px) rotate(4deg) scale(1.02);
  }
  52% {
    transform: translateY(-54vh) translateX(-8px) rotate(-5deg) scale(0.97);
  }
  60% {
    transform: translateY(-68vh) translateX(6px) rotate(3deg) scale(1.01);
  }
  68% {
    transform: translateY(-72vh) translateX(-5px) rotate(-2deg) scale(1);
  }
  76% {
    transform: translateY(-86vh) translateX(4px) rotate(2deg) scale(1.01);
  }
  84% {
    transform: translateY(-90vh) translateX(-3px) rotate(-1deg) scale(1);
  }
  97% {
    opacity: 0.7;
  }
  100% {
    transform: translateY(-120vh) translateX(0) rotate(4deg) scale(1);
    opacity: 0;
  }
}

.content {
  width: 100%;
  max-width: 380px;
  position: relative;
  z-index: 1;
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.title {
  font-size: 48px;
  font-weight: 800;
  margin-bottom: 12px;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.title-text {
  background: linear-gradient(135deg, #FF8A80 0%, #4FC3F7 50%, #81C784 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.title-sparkle {
  color: #FFD54F;
  animation: starTwinkle 2s ease-in-out infinite;
}

.subtitle {
  font-size: 18px;
  color: #5a7a9a;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.subtitle-icon {
  font-size: 20px;
}

.stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 36px;
}

/* Cliomorphism 风格统计卡片 */
.stat-card {
  background: #ffffff;
  border-radius: 28px;
  padding: 24px 16px;
  text-align: center;
  box-shadow:
    0 4px 0 0 rgba(0, 0, 0, 0.08),
    0 6px 20px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.5);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow:
    0 6px 0 0 rgba(0, 0, 0, 0.08),
    0 12px 30px rgba(0, 0, 0, 0.15);
}

.stat-card-trophy {
  border-top: 4px solid #4FC3F7;
}

.stat-card-star {
  border-top: 4px solid #FFD54F;
}

.stat-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  box-shadow:
    0 3px 0 0 rgba(0, 0, 0, 0.08),
    0 4px 12px rgba(0, 0, 0, 0.1);
}

.icon-trophy {
  background: linear-gradient(135deg, #E1F5FE 0%, #B3E5FC 100%);
  color: #0288D1;
}

.icon-star {
  background: linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%);
  color: #FFA000;
}

.stat-value {
  font-size: 36px;
  font-weight: 800;
  font-family: inherit;
  margin-bottom: 4px;
  color: #37474F;
}

.stat-card-trophy .stat-value {
  color: #0277BD;
}

.stat-card-star .stat-value {
  color: #F57F17;
}

.stat-label {
  font-size: 14px;
  color: #78909C;
  font-family: inherit;
  font-weight: 500;
}

/* 按钮区域 */
.buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Cliomorphism 风格立体按钮 */
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  padding: 20px 28px;
  font-size: 20px;
  font-weight: 700;
  font-family: inherit;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  position: relative;
  overflow: hidden;
}

.btn-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-text {
  position: relative;
  z-index: 1;
}

/* 主按钮 - 渐变立体 */
.btn-clay-primary {
  background: linear-gradient(180deg, #FF8A80 0%, #FF7043 100%);
  color: white;
  box-shadow:
    0 5px 0 0 #E64A19,
    0 8px 25px rgba(255, 112, 67, 0.4);
  border: none;
}

.btn-clay-primary:hover {
  transform: translateY(-2px);
  box-shadow:
    0 7px 0 0 #E64A19,
    0 12px 35px rgba(255, 112, 67, 0.5);
}

.btn-clay-primary:active {
  transform: translateY(3px);
  box-shadow:
    0 2px 0 0 #E64A19,
    0 4px 15px rgba(255, 112, 67, 0.4);
}

/* 按钮光泽效果 */
.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.5s;
}

.btn-clay-primary:hover .btn-shine {
  left: 100%;
}

/* 次要按钮 */
.btn-clay-secondary {
  background: linear-gradient(180deg, #ffffff 0%, #F5F5F5 100%);
  color: #4FC3F7;
  box-shadow:
    0 4px 0 0 #B0BEC5,
    0 6px 20px rgba(0, 0, 0, 0.1);
  border: 2px solid #E0F7FA;
}

.btn-clay-secondary:hover {
  transform: translateY(-2px);
  box-shadow:
    0 6px 0 0 #B0BEC5,
    0 10px 30px rgba(0, 0, 0, 0.15);
  border-color: #B3E5FC;
}

.btn-clay-secondary:active {
  transform: translateY(2px);
  box-shadow:
    0 2px 0 0 #B0BEC5,
    0 4px 15px rgba(0, 0, 0, 0.1);
}

/* 水波纹效果 */
.btn-ripple::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.5) 0%, transparent 70%);
  transform: scale(0);
  opacity: 0;
  animation: ripple-effect 0.6s ease-out;
}

@keyframes ripple-effect {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

/* 动画延迟类 */
.animate-card-entrance {
  animation: cardEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.animate-button-entrance {
  animation: buttonEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes cardEntrance {
  0% {
    opacity: 0;
    transform: translateY(25px) scale(0.92);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes buttonEntrance {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes starTwinkle {
  0%, 100% { opacity: 1; transform: scale(1) rotate(0deg); }
  50% { opacity: 0.6; transform: scale(0.9) rotate(15deg); }
}
</style>
