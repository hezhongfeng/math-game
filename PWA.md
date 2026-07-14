# 数感闯关 PWA 说明

> 软件全称：数感闯关儿童数学启蒙训练软件｜产品简称：数感闯关｜软件版本：V1.0

项目通过 `vite-plugin-pwa` 和 Workbox 提供安装、离线缓存与更新提示。

## 当前实现

| 文件 | 作用 |
|------|------|
| `vite.config.js` | PWA 插件、预缓存范围和 Google Fonts 运行时缓存 |
| `public/manifest.json` | 应用名称、颜色、图标和快捷入口 |
| `src/components/PWAUpdatePrompt.vue` | 新版本可用时提示刷新 |
| `public/icons/` | SVG 与 72-512px PNG 图标 |
| `scripts/generate-icons.js` | 从源图标生成 PNG |

项目不维护手写 `public/sw.js`，也没有独立 `usePWA` composable。

## 构建行为

- `registerType: 'prompt'`
- 开发环境不启用 Service Worker
- Workbox 预缓存 `js/css/html/ico/png/svg/json/mp3`
- Google Fonts 使用 `CacheFirst`，缓存期一年，最多 10 条
- `three` 的拆包与 PWA 无直接关系，由 Vite build 配置处理

生产验证：

```bash
pnpm run build
pnpm run preview
```

Service Worker 只在生产构建中生成。不要用 `pnpm run dev` 判断离线或更新行为。

## Manifest

当前 manifest：

- 应用全称：数感闯关儿童数学启蒙训练软件
- 应用简称：数感闯关
- 软件版本：V1.0
- 应用描述：双模式数学启蒙训练，包含 26 关主线闯关与 1–1000 数字探索
- `start_url` / `scope`：`/`
- `display`：`standalone`
- 方向：`portrait`
- 主题色：`#4A90E2`
- 背景色：`#F5F7FA`
- 26 个主线关卡描述
- 两个快捷入口，均进入 `/difficulty`
- SVG maskable 图标与 72-512px PNG 图标

修改 manifest 后运行：

```bash
pnpm run test:e2e
```

E2E 会检查 manifest link、应用全称和简称，以及 theme-color 元数据，但不会完整验证安装体验。

## 更新流程

1. 新构建部署后，浏览器发现新的 Service Worker。
2. `virtual:pwa-register` 触发 `onNeedRefresh`。
3. `PWAUpdatePrompt.vue` 显示更新弹窗。
4. 用户点击“更新”后调用 `updateSW(true)` 并刷新。

当前界面没有“稍后”按钮；更新弹窗出现后只能执行更新。

## 图标

重新生成 PNG：

```bash
pnpm run generate-icons
```

脚本依赖 devDependency `sharp`，无需再次安装。

修改图标后检查：

- manifest 路径与文件真实存在
- 192px 和 512px 图标可加载
- maskable 图标安全区域
- Android 安装图标
- iOS 添加到主屏幕图标

## 浏览器边界

- PWA 需要 HTTPS；`localhost` 属于安全上下文例外。
- iOS/iPadOS 的安装和后台行为由 Safari/WebKit 限制决定。
- iOS 上的 Chrome、Edge 等仍使用 WebKit，安装能力不能按桌面 Chrome 推断。
- 快捷方式支持情况随平台变化，不在本项目文档中承诺固定版本矩阵。
- 微信内置浏览器不作为完整 PWA 安装环境保证。

## 手动验证

Chrome/Edge：

1. 使用生产预览或 HTTPS 部署。
2. DevTools → Application → Manifest，检查图标和快捷入口。
3. Application → Service Workers，检查注册状态。
4. 首次在线访问后切换 Offline，刷新已访问页面。
5. 部署新构建，确认更新提示出现并能刷新。

iOS Safari：

1. 使用 HTTPS 地址访问。
2. 通过分享菜单添加到主屏幕。
3. 从主屏幕启动，检查 standalone 外观。
4. 在线访问一次后测试离线启动。
5. 单独验证音频，不把桌面 E2E 结果视为真机结论。

## 常见问题

### 开发环境没有 Service Worker

这是预期行为，`devOptions.enabled` 为 `false`。使用生产构建预览。

### 更新提示不出现

- 确认部署内容和 precache manifest 已变化。
- 检查是否仍被旧 Service Worker 控制。
- 关闭所有应用标签页后重新打开。
- 在 DevTools 中检查注册和 waiting worker。

### 离线页面不可用

- 首次访问必须在线。
- 检查资源是否在 Workbox globPatterns 中。
- 检查部署路径是否与 manifest 的根 scope 一致。
- 检查控制台和 Service Worker 日志。

### 强制清理本地 PWA

仅用于调试：

```javascript
const registrations = await navigator.serviceWorker.getRegistrations()
await Promise.all(registrations.map(registration => registration.unregister()))
```

随后在浏览器中清理站点缓存并重新访问。
