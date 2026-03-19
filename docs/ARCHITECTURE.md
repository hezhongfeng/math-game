# Architecture Overview

这是一份面向协作者的"一页架构图"，用于快速理解项目关键路径。

## 1. 运行时结构

- 前端框架：Vue 3（`<script setup>`）
- 状态管理：Pinia（`src/stores/settings.js`）
- 路由：Vue Router（`src/router.js`）
- 构建：Vite + vite-plugin-pwa

核心页面流：

1. `/` 首页（开始挑战）
2. `/difficulty` 难度选择（关卡解锁）
3. `/game/:id` 游戏页（作答、反馈、结算）

## 2. 数据流与持久化

- 游戏记录存储键：`math-game-data`
- 设置存储键：`math-game-settings`

`useStorage`（`src/composables/useStorage.js`）：

- 负责最佳成绩读取与更新
- 使用全局响应式缓存 + `storage` 事件同步跨标签页状态

`settings` store（`src/stores/settings.js`）：

- 负责应用设置管理
- 应用启动时加载一次
- 当前仅保留最小占位实现（无用户可见设置项）

## 3.1 音频反馈架构

`useSound`（`src/composables/useSound.js`）负责：

- 基于 Web Audio API 合成并播放交互音效
- 通过 master gain + lowpass 统一输出链路，降低刺耳感
- 使用冷却时间限制高频触发，避免连点堆音
- 使用 `AudioContext.currentTime` 调度多音序列，保证移动端稳定性

当前反馈策略：

1. 输入/删除/提交：短音提示，节奏轻快
2. 正确：上行奖励音，自动进入下一题
3. 错误：温和提示音 + 全屏错误模态，用户确认后继续
4. 完成关卡：庆祝音与解锁音分层触发，并在结果弹窗中展示本轮错题

## 4. 游戏核心逻辑

`useGame`（`src/composables/useGame.js`）负责：

- 生成题目（`src/utils/generator.js`）
- 提交答案与得分统计
- 记录本轮错题数据（题目、用户答案、正确答案）
- 进度、正确率、耗时计算
- 输出结算结果（供结果弹窗和存储使用）
- 支持基于指定题目列表重新开局，用于“再练错题”

## 5. PWA 更新链路

- 插件：`vite-plugin-pwa`（`vite.config.js`）
- 更新提示组件：`src/components/PWAUpdatePrompt.vue`
- 策略：`prompt` 模式，发现新版本时在应用内提示刷新

说明：PWA 注册与更新逻辑已统一到插件路径，避免重复注册冲突。

## 6. E2E 冒烟测试

Playwright 配置：

- `playwright.config.js`
- `tests/e2e/smoke.spec.js`

当前覆盖：

1. 首页 -> 选关 -> 进入游戏页
2. 作答后进度推进
3. 完成一局 -> 结果弹窗 -> 返回关卡页

CI 工作流：

- `.github/workflows/e2e-smoke.yml`（PR 自动执行）
