<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Trophy, Play, Star, Zap, Target, Gamepad2 } from 'lucide-vue-next'
import { useStorage } from '../composables/useStorage'
import { useSound } from '../composables/useSound'
import { DIFFICULTY_GROUPS } from '../config/difficulty'

const router = useRouter()
const { getAllBestScores } = useStorage()
const { playSound, forceInitializeAudioContext } = useSound()

const bestScores = getAllBestScores()
const completedCount = Object.keys(bestScores).length

function startGame() {
  playSound('click')
  router.push('/difficulty')
}

function viewAchievements() {
  playSound('click')
  router.push('/difficulty')
}

// iOS Safari 兼容性修复
onMounted(() => {
  forceInitializeAudioContext().catch(() => {})
})
</script>

<template>
  <div class="command-center">
    <!-- 背景网格 -->
    <div class="grid-background"></div>
    
    <!-- 扫描线 -->
    <div class="scan-overlay"></div>
    
    <!-- 主内容区 -->
    <div class="content">
      <!-- 顶部状态栏 -->
      <div class="status-bar">
        <div class="system-status">
          <span class="status-dot"></span>
          <span class="status-text">SYSTEM ONLINE</span>
        </div>
        <div class="version">v3.0</div>
      </div>
      
      <!-- 标题区 -->
      <div class="hero-section" style="animation: slide-up-fade var(--duration-macro) var(--ease-decelerate) forwards">
        <!-- Logo图标 -->
        <div class="logo-container">
          <div class="logo-ring outer"></div>
          <div class="logo-ring inner"></div>
          <div class="logo-core">
            <Gamepad2 :size="40" stroke-width="2" />
          </div>
        </div>
        
        <h1 class="main-title">数学指挥官</h1>
        <p class="tagline">MATH COMMANDER // 脑力训练系统</p>
      </div>

      <!-- 数据面板 -->
      <div class="data-panels">
        <div class="data-panel" style="animation: slide-up-fade var(--duration-macro) var(--ease-decelerate) 100ms forwards; opacity: 0">
          <div class="panel-header">
            <Target :size="18" />
            <span>MISSIONS</span>
          </div>
          <div class="panel-value">{{ completedCount }}</div>
          <div class="panel-bar">
            <div class="bar-fill" :style="{ width: (completedCount / (DIFFICULTY_GROUPS.length * 3) * 100) + '%' }"></div>
          </div>
        </div>

        <div class="data-panel" style="animation: slide-up-fade var(--duration-macro) var(--ease-decelerate) 150ms forwards; opacity: 0">
          <div class="panel-header">
            <Zap :size="18" />
            <span>TOTAL XP</span>
          </div>
          <div class="panel-value">{{ DIFFICULTY_GROUPS.length * 3 }}</div>
          <div class="panel-bar">
            <div class="bar-fill energy"></div>
          </div>
        </div>
      </div>

      <!-- 主控制按钮 -->
      <div class="command-buttons">
        <button
          class="command-btn btn-launch"
          style="animation: slide-up-fade var(--duration-macro) var(--ease-decelerate) 200ms forwards; opacity: 0"
          @click="startGame"
        >
          <div class="btn-glow"></div>
          <Play :size="24" stroke-width="2.5" />
          <span class="btn-label">启动任务</span>
          <span class="btn-sub">START MISSION</span>
        </button>

        <button
          class="command-btn btn-stats"
          style="animation: slide-up-fade var(--duration-macro) var(--ease-decelerate) 250ms forwards; opacity: 0"
          @click="viewAchievements"
        >
          <Trophy :size="22" stroke-width="2.5" />
          <span class="btn-label">成就档案</span>
          <span class="btn-sub">ACHIEVEMENTS</span>
        </button>
      </div>
      
      <!-- 底部装饰 -->
      <div class="bottom-decoration">
        <div class="tech-line"></div>
        <span class="tech-text">MATH COMMAND CENTER</span>
        <div class="tech-line"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.command-center {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #0a0f1d 0%, #0f172a 50%, #0a0f1d 100%);
}

/* 背景网格 */
.grid-background {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(0, 102, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 102, 255, 0.03) 1px, transparent 1px);
  background-size: 50px 50px;
  pointer-events: none;
}

/* 扫描线覆盖 */
.scan-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 102, 255, 0.03) 50%,
    transparent 100%
  );
  animation: scanSweep 8s linear infinite;
  pointer-events: none;
}

@keyframes scanSweep {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}

/* 主内容 */
.content {
  width: 100%;
  max-width: 380px;
  position: relative;
  z-index: 1;
}

/* 状态栏 */
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding: 0 4px;
}

.system-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: var(--win-green);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--win-green);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-text {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: var(--win-green);
  font-family: 'Courier New', monospace;
}

.version {
  font-size: 11px;
  color: rgba(148, 163, 184, 0.6);
  font-family: 'Courier New', monospace;
}

/* 标题区域 */
.hero-section {
  text-align: center;
  margin-bottom: 40px;
  opacity: 0;
}

/* Logo容器 */
.logo-container {
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-ring {
  position: absolute;
  border: 2px solid rgba(0, 102, 255, 0.3);
  border-radius: 50%;
  animation: rotate 20s linear infinite;
}

.logo-ring.outer {
  width: 100px;
  height: 100px;
  border-top-color: var(--hero-blue);
  border-bottom-color: var(--hero-blue);
}

.logo-ring.inner {
  width: 80px;
  height: 80px;
  border-left-color: var(--energy-yellow);
  border-right-color: var(--energy-yellow);
  animation-direction: reverse;
  animation-duration: 15s;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.logo-core {
  width: 60px;
  height: 60px;
  background: linear-gradient(145deg, var(--hero-blue) 0%, var(--hero-blue-dark) 100%);
  border-radius: var(--radius-sharp-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 
    0 0 30px rgba(0, 102, 255, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.main-title {
  font-size: 36px;
  font-weight: 800;
  color: white;
  margin-bottom: 8px;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-shadow: 0 0 30px rgba(0, 102, 255, 0.5);
}

.tagline {
  font-size: 12px;
  color: rgba(148, 163, 184, 0.8);
  font-weight: 500;
  letter-spacing: 0.2em;
  font-family: 'Courier New', monospace;
}

/* 数据面板 */
.data-panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 40px;
}

.data-panel {
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
  border: 1px solid rgba(0, 102, 255, 0.2);
  border-radius: var(--radius-sharp-md);
  padding: 20px 16px;
  text-align: center;
  box-shadow: 
    0 4px 16px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all var(--duration-micro) ease;
  opacity: 0;
}

.data-panel:hover {
  border-color: rgba(0, 102, 255, 0.4);
  box-shadow: 
    0 0 20px rgba(0, 102, 255, 0.1),
    0 4px 16px rgba(0, 0, 0, 0.3);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: rgba(148, 163, 184, 0.8);
  margin-bottom: 12px;
  font-family: 'Courier New', monospace;
}

.panel-header svg {
  color: var(--hero-blue);
}

.panel-value {
  font-size: 32px;
  font-weight: 800;
  color: white;
  margin-bottom: 12px;
  text-shadow: 0 0 20px rgba(0, 102, 255, 0.3);
  font-variant-numeric: tabular-nums;
}

.panel-bar {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--hero-blue), var(--hero-blue-light));
  border-radius: var(--radius-full);
  box-shadow: 0 0 10px rgba(0, 102, 255, 0.5);
  transition: width 1s ease;
}

.bar-fill.energy {
  width: 100%;
  background: linear-gradient(90deg, var(--energy-yellow), var(--energy-yellow-light));
  box-shadow: 0 0 10px rgba(255, 199, 0, 0.5);
}

/* 命令按钮 */
.command-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.command-btn {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 20px 32px;
  border-radius: var(--radius-sharp-md);
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  transition: all var(--duration-micro) ease;
  overflow: hidden;
  opacity: 0;
}

.btn-launch {
  background: linear-gradient(145deg, rgba(0, 102, 255, 0.2) 0%, rgba(0, 82, 204, 0.3) 100%);
  border: 2px solid rgba(0, 102, 255, 0.5);
  box-shadow: 
    0 0 30px rgba(0, 102, 255, 0.2),
    0 8px 24px rgba(0, 0, 0, 0.3);
}

.btn-launch:hover {
  border-color: rgba(0, 102, 255, 0.8);
  box-shadow: 
    0 0 40px rgba(0, 102, 255, 0.4),
    0 8px 24px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.btn-launch:active {
  transform: translateY(0) scale(0.98);
}

.btn-glow {
  position: absolute;
  inset: -2px;
  background: linear-gradient(90deg, transparent, rgba(0, 102, 255, 0.4), transparent);
  opacity: 0;
  transition: opacity var(--duration-micro) ease;
}

.btn-launch:hover .btn-glow {
  opacity: 1;
}

.btn-stats {
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.btn-stats:hover {
  border-color: rgba(255, 199, 0, 0.5);
  box-shadow: 
    0 0 20px rgba(255, 199, 0, 0.1),
    0 4px 16px rgba(0, 0, 0, 0.3);
  transform: translateY(-2px);
}

.command-btn svg {
  color: white;
  margin-bottom: 4px;
}

.btn-label {
  font-size: 18px;
  font-weight: 700;
  color: white;
  letter-spacing: 0.1em;
}

.btn-sub {
  font-size: 10px;
  color: rgba(148, 163, 184, 0.8);
  letter-spacing: 0.2em;
  font-family: 'Courier New', monospace;
}

/* 底部装饰 */
.bottom-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.tech-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 102, 255, 0.3), transparent);
}

.tech-text {
  font-size: 10px;
  color: rgba(148, 163, 184, 0.5);
  letter-spacing: 0.2em;
  font-family: 'Courier New', monospace;
  white-space: nowrap;
}

/* 响应式 */
@media (min-width: 768px) {
  .content {
    max-width: 440px;
  }
  
  .logo-container {
    width: 120px;
    height: 120px;
    margin-bottom: 32px;
  }
  
  .logo-ring.outer {
    width: 120px;
    height: 120px;
  }
  
  .logo-ring.inner {
    width: 96px;
    height: 96px;
  }
  
  .logo-core {
    width: 72px;
    height: 72px;
  }
  
  .main-title {
    font-size: 42px;
  }
  
  .data-panels {
    gap: 20px;
  }
  
  .data-panel {
    padding: 24px 20px;
  }
  
  .panel-value {
    font-size: 36px;
  }
}
</style>
