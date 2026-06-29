# AGENTS.md

本文件是代理和协作者在本仓库中的执行规范。源码、测试和配置优先于历史设计稿。

## 核心原则

### 简约优先

- 每个颜色、动画、阴影和形状都必须服务于操作或理解。
- 避免装饰性动画、复杂故事角色、过量渐变和强烈发光。
- 保持高对比度和清晰信息层级。
- 数字探索中的 Three.js 球阵是数位教学工具，不是装饰。

### 移动优先

- 先保证手机竖屏，再增强桌面体验。
- 交互目标至少 `44×44px`，数字键盘至少 `64×64px`。
- 交互元素使用 `touch-action: manipulation` 和无 tap highlight。
- UI 变更必须检查安全区域、横向溢出和键盘位置稳定性。

## 技术事实

- Vue 3，Composition API，统一使用 `<script setup>`
- Vite 7
- Vue Router 4
- JavaScript，不使用 TypeScript
- Tailwind CSS 3、scoped CSS 和全局 CSS 变量混合使用
- Lucide Vue Next
- Three.js
- LocalStorage 持久化
- Vitest + Vue Test Utils
- Playwright
- vite-plugin-pwa

## 常用命令

仓库只维护 `pnpm-lock.yaml`，本地开发和 CI 统一使用 pnpm 11：

```bash
pnpm install
pnpm run dev
pnpm run build
pnpm run preview
pnpm run test:unit
pnpm run test:e2e
```

首次运行 E2E：

```bash
pnpm run test:e2e:install
```

## 当前产品行为

- 主线共 26 关，题量为 20-40 题。
- 关卡必须按顺序通过，正确率达到 `85%` 视为通过。
- 正确答案自动进入下一题；错误答案等待用户确认。
- 结算支持查看错题和仅重练错题。
- 错题重练不更新最佳成绩和计时榜。
- 每关计时榜只比较与当前关卡题量一致的记录。
- 小球辅助默认关闭，支持加法、减法和缺项加法。
- 音效与振动默认开启，没有设置开关。
- `/explore` 支持 1-1000 的 Three.js 球阵探索。

## 代码风格

### Vue

- Props 显式声明类型和合理默认值。
- Emits 使用 `defineEmits([...])`。
- 组件结构依次为 imports、props/emits、组合式逻辑、state、computed、methods。
- 页面和组件使用 PascalCase；composable 使用 `use` 前缀。

### Imports

1. Vue
2. Vue Router
3. 外部依赖
4. composables
5. config
6. utils
7. components

遵循现有文件的局部顺序，不为排序做无关重构。

### 样式

- 优先复用 `src/assets/styles/variables.css` 的令牌。
- 通用布局可用 Tailwind；复杂组件状态使用 scoped CSS。
- 不要引用不存在的旧主题类，如 `hero-blue`、`rounded-pill`、`shadow-cute-xl`。
- 动画优先使用 `opacity` 和 `transform`。
- 支持全局 `prefers-reduced-motion`。
- 不用 `transition: all` 添加新的复杂过渡。

### 错误处理

LocalStorage、音频和浏览器 API 必须有失败路径。不要使用空 catch：

```javascript
try {
  return JSON.parse(localStorage.getItem('math-game-data'))
} catch (error) {
  console.error('读取游戏数据失败:', error)
  return null
}
```

### JSDoc

为 utils、composables 和不直观的纯函数添加简洁 JSDoc。组件模板中不添加重复说明代码含义的注释。

## 事实来源

| 内容 | 文件 |
|------|------|
| 关卡、题量和分组 | `src/config/difficulty.js` |
| 出题规则 | `src/utils/generator.js` |
| 游戏常量与音频参数 | `src/config/constants.js` |
| 星级和评级 | `src/utils/stars.js` |
| 存储结构 | `src/composables/useStorage.js` |
| 路由 | `src/router.js` |
| PWA | `vite.config.js`、`public/manifest.json` |
| 测试命令 | `package.json` |
| E2E 设备配置 | `playwright.config.js` |

## 关卡配置

`src/config/difficulty.js` 当前包含 26 个关卡。每个关卡字段为：

```javascript
{
  id,
  name,
  level,
  range,
  operation,
  stage,
  questionCount,
  description,
  helperText,
  color,
  textColor,
  stars
}
```

新增或调整关卡时同步：

- `DIFFICULTY_GROUPS`
- `tests/unit/difficulty.spec.js`
- 相关 generator 测试
- `docs/DIFFICULTY_CURVE.md`
- README 和 CHANGELOG（用户可见时）

减法结果必须非负。

## 存储

LocalStorage keys：

- `math-game-data`
- `math-game-number-bond-hint-enabled`

修改存储 schema 时：

- 保留旧数据兼容和损坏数据兜底。
- 更新 `tests/unit/useStorage.spec.js`。
- 更新 `docs/ARCHITECTURE.md`。
- 榜单记录必须包含 `totalCount`，避免不同题量直接比较。

## 测试要求

按风险选择测试：

- 纯工具或 composable：对应 Vitest。
- 组件 props、events 或状态：组件单测。
- 路由、完整作答、反馈、结算：Playwright。
- UI 动画：验证 DOM 稳定性，并在移动尺寸手动检查。
- PWA：生产构建后检查 manifest、注册和更新提示。

合并前最低检查：

```bash
pnpm run build
pnpm run test:unit
pnpm run test:e2e
```

Playwright 当前是 Pixel 7 与 iPhone 13 参数下的 Chromium 模拟，不等同于 iOS Safari/WebKit 真机测试。

## Git

- 提交信息尽量使用中文。
- 推荐 Conventional Commits：`type(scope): 中文说明`
- 示例：`fix(game): 优化题目切换动画`
- 不提交 `dist/`、`playwright-report/` 或测试临时产物，除非任务明确要求。

## 文档

现行文档包括 README、DESIGN、COMPONENTS、CONTRIBUTING、PWA、SOUND_SYSTEM_SIMPLE、`docs/ARCHITECTURE.md` 和 `docs/DIFFICULTY_CURVE.md`。

`specs/`、`docs/superpowers/` 与 `design-system/` 是历史方案或设计参考。不要把其中的旧计划当作当前行为。
