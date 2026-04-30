# Architecture Overview

这是一份面向协作者的"一页架构图"，用于快速理解项目关键路径。

## 1. 运行时结构

- 前端框架：Vue 3（`<script setup>`）
- 路由：Vue Router（`src/router.js`）
- 构建：Vite + vite-plugin-pwa

核心页面流：

1. `/` 首页（"开始"入口 + "数字探索"入口）
2. `/difficulty` 难度选择（关卡解锁）
3. `/game/:id` 游戏页（作答、反馈、结算）
4. `/explore` 数字探索（自由探索 + 范围挑战 + 3D 球阵可视化）

## 2. 数据流与持久化

- 游戏记录存储键：`math-game-data`

`useStorage`（`src/composables/useStorage.js`）：

- 负责最佳成绩读取与更新
- 负责每关前 10 名计时榜的读取与更新
- 使用全局响应式缓存 + `storage` 事件同步跨标签页状态

## 3.1 音频反馈架构

`useSound`（`src/composables/useSound.js`）负责：

- 基于 Web Audio API 合成并播放交互音效
- 在结算时播放内置本地鼓励音频
- 通过 master gain + lowpass 统一输出链路，降低刺耳感
- 使用冷却时间限制高频触发，避免连点堆音
- 使用 `AudioContext.currentTime` 调度多音序列，保证移动端稳定性
- 在初始化后预加载本地鼓励音频，并通过已解锁的 Web Audio 输出链路播放，提高 iOS Safari 结算语音成功率

当前反馈策略：

1. 输入/删除/提交：短音提示，节奏轻快
2. 正确：上行奖励音，自动进入下一题
3. 错误：温和提示音 + 大号答案反馈卡，点击反馈区域继续
4. 完成关卡：庆祝音、解锁音、结算主反馈语音分层触发，并在结果弹窗中展示计时榜与本轮错题

结算语音策略：

- 每轮只播放一句主反馈，避免多句播报打断孩子
- 新纪录优先，其次是错题重练，再按正确率选择满分 / 高分 / 过关 / 再试一次
- 语音会延后到胜利音或解锁音之后播放；如果用户立即再来或离开页面，待播放和正在播放的语音都会被清理
- 语音使用 `public/audio/praise/*.mp3` 本地文件，不调用联网语音 API，也不在运行时合成语音

产品约束：

- 音效与触觉反馈默认开启
- 当前版本不提供“音效/震动设置”开关

## 4. 游戏核心逻辑

`useGame`（`src/composables/useGame.js`）负责：

- 生成题目（`src/utils/generator.js`）
- 按关卡阶段输出对应的分段题目
- 提交答案与回合结果统计
- 记录本轮错题数据（题目、用户答案、正确答案）
- 进度、正确率、耗时计算
- 输出结算结果（供结果弹窗和存储使用）
- 支持基于指定题目列表重新开局，用于“练错题”

题目展示组件：

- `src/components/QuestionCard.vue` 负责题面、输入占位和答题状态展示
- `src/components/NumberBondHint.vue` 根据题型显示极简小球辅助：加法用两组小球表达合并，减法用划掉的小球表达拿走，缺项加法用实心/空心表达已知与未知
- 小球辅助不展示策略文字；每行固定 10 个位置，最多渲染 30 个小球，超过部分以 `+N` 标记，兼顾十进制感和移动端空间
- `Game.vue` 提供悬浮“小球开/关”切换，仅在当前题目支持小球辅助时出现；默认关闭，打开后会写入 `math-game-number-bond-hint-enabled`，方便熟练后练习

## 4.1 数字探索逻辑

`src/pages/NumberExplore.vue` 负责：

- 管理自由探索 / 挑战模式切换
- 维护挑战范围配置与当前训练档位
- 处理输入校验、状态提示、数位拆解文案
- 在结果页驱动连续探索（如 `-1 / +1 / +10`）

`src/components/BallArray.vue` 负责：

- 使用 Three.js 渲染统一的 3D 十进制球阵
- 通过 `x/y/z` 轴分别表达个位、十位、百位结构
- 根据数量范围调整球体颜色、透明度与分组层次
- 在移动端使用自动旋转 + 可滚动页面，在桌面端支持直接交互

## 5. PWA 更新链路

- 插件：`vite-plugin-pwa`（`vite.config.js`）
- 清单：`public/manifest.json`
- 更新提示组件：`src/components/PWAUpdatePrompt.vue`
- 策略：`prompt` 模式，发现新版本时在应用内提示刷新
- 注册方式：组件内通过 `virtual:pwa-register` 调用插件返回的更新函数

说明：项目不再保留手写 Service Worker 或独立的 PWA 更新状态层，避免两套实现并存造成理解和维护成本。

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
