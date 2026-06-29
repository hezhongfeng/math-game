# 贡献指南

## 环境准备

- Node.js 20 或兼容版本
- pnpm 11（本地与 CI 统一；仓库只维护 `pnpm-lock.yaml`）
- 现代浏览器

```bash
pnpm install
pnpm run dev
```

## 开发流程

1. 从最新主分支创建分支。
2. 阅读 [`AGENTS.md`](./AGENTS.md) 和相关专项文档。
3. 保持改动聚焦，遵循现有组件和 composable 模式。
4. 为行为变化添加或更新测试。
5. 更新相关文档和 `CHANGELOG.md` 的 `Unreleased`。
6. 运行构建、单测和 E2E。

推荐分支名：

- `feature/...`
- `fix/...`
- `docs/...`
- `refactor/...`
- `test/...`

## 代码规范

### Vue 与 JavaScript

- 使用 `<script setup>`。
- Props 必须声明类型和默认值。
- Emits 使用事件名数组。
- 不引入 TypeScript。
- 组合式逻辑使用 `use` 前缀。
- 公共工具函数添加必要 JSDoc。
- 捕获异常时至少记录错误并提供安全回退。

### 样式与交互

- 遵循 [`DESIGN.md`](./DESIGN.md)。
- 保持简约、移动优先和儿童友好。
- 触摸目标至少 `44×44px`，数字键盘至少 `64×64px`。
- 使用现有 CSS 变量；Tailwind 和 scoped CSS 按当前代码模式混合使用。
- 动画应短且有目的，并支持 reduced motion。

### 提交信息

推荐 Conventional Commits，说明尽量使用中文：

```text
feat(explore): 增加新的数量挑战范围
fix(storage): 按当前题量过滤计时榜
docs: 同步项目文档与当前实现
test(game): 补充完整通关流程
```

## 测试

```bash
pnpm run build
pnpm run test:unit
pnpm run test:e2e
```

按改动类型补充验证：

| 改动 | 验证 |
|------|------|
| generator、stars、format | 对应工具单测 |
| useGame、useStorage、useSound | composable 单测 |
| 组件 props、events、状态 | Vue Test Utils |
| 路由、反馈、完整回合 | Playwright |
| 视觉和触摸 | 320/390px + 桌面 + 真机 |
| PWA | 生产构建、manifest、Service Worker 更新 |

Playwright 当前使用两套 Chromium 移动设备参数。涉及 iOS 音频、PWA、振动或 Safari 布局时，必须补充 Safari/WebKit 或真机检查。

## 新增关卡

1. 编辑 `src/config/difficulty.js`。
2. 选择或实现明确的 `stage` 和 `operation`。
3. 更新 `DIFFICULTY_GROUPS`。
4. 为题量和题型分布补充测试。
5. 更新 `docs/DIFFICULTY_CURVE.md`。

示例结构：

```javascript
{
  id: 27,
  name: '27',
  level: '10组',
  range: [0, 20],
  operation: 'mixed',
  stage: 'newStage',
  questionCount: 40,
  description: '关卡说明',
  helperText: '给孩子的短提示',
  color: 'var(--candy-blue)',
  textColor: 'var(--candy-blue-dark)',
  stars: 5
}
```

不要只增加配置而不实现 generator 对应阶段。

## 新增组件

1. 放入 `src/components/`。
2. 定义 props、events 和无障碍语义。
3. 遵循移动端触摸和 reduced-motion 规则。
4. 添加关键组件测试。
5. 公开接口变化同步 `COMPONENTS.md`。

## 修改存储

- 必须兼容旧记录和部分损坏数据。
- 新字段需要默认值或过滤策略。
- 榜单条目保留 `totalCount`。
- 更新 `useStorage.spec.js` 与架构文档。

## 修改音频

- 参数位于 `src/config/constants.js`。
- 播放和 AudioContext 生命周期位于 `src/composables/useSound.js`。
- 本地鼓励语音位于 `public/audio/praise/`。
- 不增加第二套音频状态管理。
- 移动端自动播放限制必须实测。

## 修改 PWA

PWA 的事实来源：

- `vite.config.js`
- `public/manifest.json`
- `src/components/PWAUpdatePrompt.vue`

不要新增手写 `public/sw.js` 或重复注册链路。

## Pull Request 检查

- [ ] 改动范围清晰，无无关重构
- [ ] `pnpm run build` 通过
- [ ] `pnpm run test:unit` 通过
- [ ] `pnpm run test:e2e` 通过
- [ ] 手机布局和触摸交互已验证
- [ ] 无新的控制台错误
- [ ] LocalStorage 变化向后兼容
- [ ] PWA 更新链路未被破坏
- [ ] 相关文档已更新
- [ ] `CHANGELOG.md` 已记录用户可见变化

## 文档边界

现行行为以 README、AGENTS、DESIGN、COMPONENTS、PWA、ARCHITECTURE 和源码为准。

`specs/`、`docs/superpowers/` 与 `design-system/` 保存历史方案或参考，不应直接作为实现说明引用。
