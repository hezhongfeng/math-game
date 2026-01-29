<script setup>
import { ref } from 'vue'
import { Play, Star, Trophy, Heart, Sparkles } from 'lucide-vue-next'
import TouchOptimizedButton from '../components/TouchOptimizedButton.vue'
import AnimatedCard from '../components/AnimatedCard.vue'

const celebrationTrigger = ref(false)
const loadingState = ref(false)

function triggerCelebration() {
  celebrationTrigger.value = true
  setTimeout(() => {
    celebrationTrigger.value = false
  }, 1000)
}

function toggleLoading() {
  loadingState.value = !loadingState.value
}
</script>

<template>
  <div class="demo-page">
    <div class="container">
      <h1 class="demo-title font-child-friendly">儿童友好组件演示</h1>

      <!-- 按钮演示 -->
      <section class="demo-section">
        <h2 class="section-title font-child-friendly">TouchOptimizedButton 组件</h2>
        <div class="button-grid">
          <TouchOptimizedButton size="small" variant="primary" :icon="Play">
            小按钮
          </TouchOptimizedButton>

          <TouchOptimizedButton size="medium" variant="secondary" :icon="Star">
            中等按钮
          </TouchOptimizedButton>

          <TouchOptimizedButton size="large" variant="success" :icon="Trophy">
            大按钮
          </TouchOptimizedButton>

          <TouchOptimizedButton size="xl" variant="playful" :icon="Heart">
            超大按钮
          </TouchOptimizedButton>

          <TouchOptimizedButton
            size="medium"
            variant="primary"
            :loading="loadingState"
            @click="toggleLoading"
          >
            {{ loadingState ? '加载中...' : '切换加载状态' }}
          </TouchOptimizedButton>

          <TouchOptimizedButton size="medium" variant="secondary" disabled>
            禁用按钮
          </TouchOptimizedButton>
        </div>
      </section>

      <!-- 卡片演示 -->
      <section class="demo-section">
        <h2 class="section-title font-child-friendly">AnimatedCard 组件</h2>
        <div class="card-grid">
          <AnimatedCard elevation="low" padding="md">
            <h3 class="font-child-friendly text-child-lg font-bold mb-2">低阴影卡片</h3>
            <p class="font-child-friendly text-child-base text-gray-600">这是一个低阴影的卡片示例</p>
          </AnimatedCard>

          <AnimatedCard elevation="medium" padding="md" :interactive="true">
            <h3 class="font-child-friendly text-child-lg font-bold mb-2">交互式卡片</h3>
            <p class="font-child-friendly text-child-base text-gray-600">这个卡片可以交互，试试悬停和点击</p>
          </AnimatedCard>

          <AnimatedCard elevation="high" padding="md" variant="success">
            <h3 class="font-child-friendly text-child-lg font-bold mb-2">成功状态卡片</h3>
            <p class="font-child-friendly text-child-base text-gray-600">这是一个成功状态的卡片</p>
          </AnimatedCard>

          <AnimatedCard
            elevation="medium"
            padding="md"
            variant="playful"
            :celebration-trigger="celebrationTrigger"
            :clickable="true"
            @click="triggerCelebration"
          >
            <h3 class="font-child-friendly text-child-lg font-bold mb-2">庆祝动画卡片</h3>
            <p class="font-child-friendly text-child-base text-gray-600">点击我触发庆祝动画！</p>
            <template #decoration>
              <Sparkles class="text-macaron-primary animate-star-twinkle" :size="24" />
            </template>
          </AnimatedCard>

          <AnimatedCard elevation="medium" padding="md" :loading-state="loadingState">
            <h3 class="font-child-friendly text-child-lg font-bold mb-2">加载状态卡片</h3>
            <p class="font-child-friendly text-child-base text-gray-600">这个卡片会显示加载状态</p>
          </AnimatedCard>
        </div>
      </section>

      <!-- 字体演示 -->
      <section class="demo-section">
        <h2 class="section-title font-child-friendly">儿童友好字体</h2>
        <div class="font-demo">
          <p class="font-child-friendly text-child-xs">超小字体 (14px)</p>
          <p class="font-child-friendly text-child-sm">小字体 (16px)</p>
          <p class="font-child-friendly text-child-base">基础字体 (18px)</p>
          <p class="font-child-friendly text-child-lg">大字体 (22px)</p>
          <p class="font-child-friendly text-child-xl">超大字体 (26px)</p>
          <p class="font-child-friendly text-child-2xl">2XL字体 (32px)</p>
          <p class="font-child-friendly text-child-3xl">3XL字体 (40px)</p>
        </div>
      </section>

      <!-- 颜色演示 -->
      <section class="demo-section">
        <h2 class="section-title font-child-friendly">马卡龙色系</h2>
        <div class="color-grid">
          <div class="color-card bg-macaron-primary">
            <span class="color-name font-child-friendly text-white">珊瑚粉</span>
          </div>
          <div class="color-card bg-macaron-blue">
            <span class="color-name font-child-friendly text-white">天空蓝</span>
          </div>
          <div class="color-card bg-macaron-mint">
            <span class="color-name font-child-friendly text-white">薄荷绿</span>
          </div>
          <div class="color-card bg-macaron-cream">
            <span class="color-name font-child-friendly text-gray-700">奶油黄</span>
          </div>
          <div class="color-card bg-macaron-lavender">
            <span class="color-name font-child-friendly text-white">薰衣草紫</span>
          </div>
          <div class="color-card bg-macaron-peach">
            <span class="color-name font-child-friendly text-white">蜜桃橙</span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.demo-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #FFF8E1 0%, #F3E5F5 50%, #E0F7FA 100%);
  padding: 2rem 1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.demo-title {
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 3rem;
  background: linear-gradient(135deg, #FF8A80 0%, #4FC3F7 50%, #81C784 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.demo-section {
  margin-bottom: 3rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #37474F;
}

.button-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  align-items: center;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.font-demo {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.color-card {
  height: 100px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.color-name {
  font-weight: 600;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .button-grid {
    grid-template-columns: 1fr;
  }

  .card-grid {
    grid-template-columns: 1fr;
  }

  .color-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
