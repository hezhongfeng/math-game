# PWA 配置说明

本项目已配置为 Progressive Web App (PWA)，支持离线访问、添加到主屏幕和原生应用般的体验。

## 功能特性

- ✅ **离线缓存** - 游戏可在无网络时运行
- ✅ **添加到主屏幕** - 像原生应用一样使用，支持 iOS 和 Android
- ✅ **自动更新** - 检测到新版本时提示用户刷新
- ✅ **快速启动** - 缓存优先策略确保秒级加载
- ✅ **多尺寸图标** - 适配各种设备和场景（72px-512px）
- ✅ **快捷方式** - 支持从主屏幕直接进入游戏或查看关卡进度
- ✅ **主题颜色** - 使用固定主题色统一浏览器与安装态外观

## 文件结构

```
public/
├── manifest.json           # PWA 配置清单
├── favicon.png             # 浏览器标签图标
├── icons/
│   ├── icon.svg            # 主图标 (矢量)
│   ├── icon-72x72.png      # 小尺寸图标
│   ├── icon-96x96.png      # 通用图标
│   ├── icon-128x128.png    # Chrome 商店
│   ├── icon-144x144.png    # Microsoft
│   ├── icon-152x152.png    # iPad
│   ├── icon-192x192.png    # Android/Add to Home
│   ├── icon-384x384.png    # 大尺寸
│   ├── icon-512x512.png    # 启动画面
│   ├── shortcut-play.svg   # 快捷方式图标
│   └── shortcut-trophy.svg # 快捷方式图标
```

## 生成图标

### 方法 1: 使用脚本 (推荐)

```bash
# 安装依赖
npm install sharp --save-dev

# 运行生成脚本
node scripts/generate-icons.js
```

### 方法 2: 在线工具

1. 访问 [PWA Asset Generator](https://pwa-asset-generator.nicepkg.cn/)
2. 上传 `public/icons/icon.svg`
3. 下载生成的图标包
4. 解压到 `public/icons/` 目录

## 测试 PWA

### Chrome DevTools

1. 打开 DevTools (F12)
2. 切换到 **Application** 标签
3. 检查以下项目:
   - **Manifest** - 验证配置
   - **Service Workers** - 检查 SW 状态
   - **Cache Storage** - 查看缓存内容
   - **Clear storage** - 清理缓存

### Lighthouse 审计

1. 打开 DevTools
2. 切换到 **Lighthouse** 标签
3. 选择 "PWA" 类别
4. 点击 "Generate report"
5. 目标分数: 90+

### 真机测试

**Android Chrome:**
1. 访问部署后的网站
2. 点击菜单 → "添加到主屏幕"
3. 验证图标和启动画面

**iOS Safari:**
1. 访问部署后的网站
2. 点击分享 → "添加到主屏幕"
3. 验证图标和全屏模式

## 配置说明

### manifest.json

```json
{
  "name": "数学运算游戏",
  "short_name": "数学游戏",
  "description": "专为儿童设计的数学运算游戏，包含渐进式加减法练习与 26 个主线关卡",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F5F7FA",
  "theme_color": "#4A90E2",
  "orientation": "portrait",
  "scope": "/",
  "lang": "zh-CN"
}
```

**配置说明：**
- `background_color`: 启动画面背景色（浅灰蓝 #F5F7FA）
- `theme_color`: 主题色（蓝色 #4A90E2）
- `display: standalone`: 以独立应用模式运行，无浏览器 UI
- `orientation: portrait`: 固定竖屏显示
- `scope`: 限定 PWA 作用域为根路径
- `shortcuts`: 提供两个快捷入口（开始游戏、查看关卡进度）

### Service Worker

当前 Service Worker 由 `vite-plugin-pwa` 在构建时自动生成，不再维护单独的 `public/sw.js`。

缓存策略: **Workbox 预缓存 + 运行时缓存**

- **构建时预缓存**: 核心静态资源会被插件自动加入预缓存
- **运行时缓存**: 额外对 Google Fonts 做缓存，减少重复请求
- **离线可用**: 已缓存资源在断网时仍可继续访问
- **更新提示**: 新版本安装完成后，由应用内弹窗提示刷新

**缓存的资源：**
- Vite 构建产物（JS / CSS / HTML）
- 图标与 manifest
- 配置中的额外静态资源

### 更新机制

当检测到新版本时:
1. `vite-plugin-pwa` 在后台安装新版本 Service Worker
2. `src/components/PWAUpdatePrompt.vue` 通过 `virtual:pwa-register` 收到 `onNeedRefresh`
3. 页面弹出“更新”提示
4. 用户确认后调用插件返回的更新函数并刷新页面

## 性能优化

### 首次加载优化

| 优化措施 | 实现方式 | 效果 |
|---------|---------|------|
| Vite 预构建 | 构建时产物优化 | 减少首屏资源体积 |
| 预缓存 | `vite-plugin-pwa` + Workbox | 核心资源离线可用 |
| 图标静态托管 | `public/` 目录 | 安装和启动资源稳定 |
| 视口锁定 | `user-scalable=no` | 防止移动端缩放干扰 |

### 运行时优化

- **缓存优先**: Service Worker 拦截所有请求，优先返回缓存
- **后台更新**: 网络可用时静默更新缓存，下次访问生效
- **离线回退**: 导航请求失败时返回 `index.html`，支持 SPA 路由
- **资源压缩**: Vite 自动压缩 JS/CSS，减小传输体积

### 移动端专项优化

- 禁用双击缩放（防止游戏误操作）
- 触摸反馈优化（`-webkit-tap-highlight-color`）
- 安全区域适配（刘海屏/灵动岛支持）
- 振动 API 反馈（增强交互体验）

## 浏览器兼容性

### 核心功能支持

| 浏览器 | 版本 | PWA 支持 | 离线功能 | 添加到主屏幕 | 快捷方式 |
|--------|------|---------|---------|-------------|---------|
| Chrome (Android) | 90+ | ✅ 完全支持 | ✅ | ✅ | ✅ |
| Safari (iOS) | 14+ | ✅ 完全支持 | ✅ | ✅ | ❌ 不支持 |
| Chrome (iOS) | 90+ | ⚠️ 受限* | ❌ | ❌ | ❌ |
| Firefox (Android) | 90+ | ✅ 支持 | ✅ | ✅ | ✅ |
| Edge (Android/iOS) | 90+ | ✅ 完全支持 | ✅ | ✅ | ✅ |
| Samsung Internet | 15+ | ✅ 完全支持 | ✅ | ✅ | ✅ |

\* Chrome on iOS 使用 WKWebView，Service Worker 功能受限

### 各平台详细说明

**iOS Safari:**
- ✅ 支持添加到主屏幕（使用 "分享" → "添加到主屏幕"）
- ✅ 支持离线缓存
- ✅ 支持主题颜色（iOS 15+）
- ❌ 不支持快捷方式
- ⚠️ 触觉反馈需用户先交互才能触发

**Android Chrome:**
- ✅ 完全支持所有 PWA 功能
- ✅ 支持快捷方式

**微信内置浏览器:**
- ✅ 支持基本 PWA 功能
- ⚠️ 添加到主屏幕需使用系统浏览器

## 快捷方式 (Shortcuts)

PWA 支持从主屏幕长按图标快速进入特定功能：

| 快捷方式 | 图标 | 功能描述 |
|---------|------|---------|
| **开始挑战** | ▶️ | 直接进入难度选择页面 |
| **查看进度** | 🏆 | 进入选关页查看已完成关卡和当前进度 |

**支持平台：**
- ✅ Android Chrome 84+
- ✅ Android Samsung Internet 15+
- ✅ Windows Edge/Chrome
- ⚠️ iOS Safari 暂不支持

## 常见问题

### Q: 为什么图标没有显示?

检查以下几点:
1. 图标文件是否存在于 `public/icons/`
2. 文件名和尺寸是否正确（参考文件结构部分）
3. 是否重新构建了项目（`npm run build`）
4. 是否使用 HTTPS（PWA 要求安全上下文）

### Q: 离线后无法访问?

1. 检查 Service Worker 是否注册成功（DevTools > Application > Service Workers）
2. 查看缓存内容（DevTools > Application > Cache Storage）
3. 确保访问过页面后才会缓存（首次访问需在线）
4. 检查是否允许第三方 Cookie（某些浏览器设置会影响 Service Worker）

### Q: 如何强制更新?

**方法 1 - 开发者控制台：**
```javascript
navigator.serviceWorker.getRegistrations().then(regs => {
  for (let reg of regs) reg.unregister()
})
location.reload()
```

**方法 2 - 重新构建并部署：**
重新执行 `npm run build` 并发布新的静态资源，`vite-plugin-pwa` 会基于新产物更新缓存清单。

### Q: iOS 添加到主屏幕后打开是白屏？

1. 确保 `manifest.json` 中的 `start_url` 正确
2. 检查所有资源路径是否为绝对路径（以 `/` 开头）
3. iOS 13+ 需要确保 Service Worker 注册成功
4. 尝试在设置中清除 Safari 缓存后重新添加

### Q: Android 上如何移除 PWA?

- **Chrome**: 长按图标 → 应用信息 → 卸载
- **系统设置**: 设置 → 应用 → 数学游戏 → 卸载
- **快捷方式**: 长按图标拖至"卸载"区域

## 代码中使用 PWA

当前项目中的 PWA 入口很简单：

- `vite.config.js`：配置 `vite-plugin-pwa`
- `public/manifest.json`：维护应用清单
- `src/components/PWAUpdatePrompt.vue`：展示更新提示并执行刷新

如果后续需要新增安装提示、分享等能力，建议单独按场景新增 composable，不要再把安装、更新、分享、振动混成一个通用 `usePWA` 文件。

## 相关链接

- [Web App Manifest](https://developer.mozilla.org/zh-CN/docs/Web/Manifest)
- [Service Worker API](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API)
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Can I Use - Service Workers](https://caniuse.com/serviceworkers)
- [Workbox](https://developer.chrome.com/docs/workbox/) - Google 的 PWA 工具库
