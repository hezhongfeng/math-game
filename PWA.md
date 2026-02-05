# PWA 配置说明

本项目已配置为 Progressive Web App (PWA)，支持离线访问和添加到主屏幕。

## 功能特性

- ✅ 离线缓存 - 游戏可在无网络时运行
- ✅ 添加到主屏幕 - 像原生应用一样使用
- ✅ 自动更新 - 检测到新版本时提示更新
- ✅ 快速启动 - 缓存优先策略确保快速加载
- ✅ 多尺寸图标 - 适配各种设备

## 文件结构

```
public/
├── manifest.json           # PWA 配置清单
├── sw.js                   # Service Worker 脚本
├── icons/
│   ├── icon.svg            # 主图标 (矢量)
│   ├── icon-72x72.png      # 小尺寸图标
│   ├── icon-96x96.png      # 快捷方式图标
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
  "description": "专为儿童设计的数学运算游戏",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F0F0E8",
  "theme_color": "#4A7C59",
  "orientation": "portrait"
}
```

### Service Worker

缓存策略: **Cache First, Network Fallback**

- 优先从缓存读取
- 后台更新缓存
- 离线时返回缓存内容

### 更新机制

当检测到新版本时:
1. Service Worker 在后台安装
2. 提示用户有新版本
3. 用户确认后刷新页面

## 性能优化

### 首次加载

- 预加载关键字体
- DNS 预解析外部资源
- 关键 CSS 内联

### 运行时

- 图片懒加载
- 路由级代码分割
- 字体 display=swap

## 浏览器兼容性

| 浏览器 | 版本 | 支持状态 |
|--------|------|----------|
| Chrome | 90+ | ✅ 完全支持 |
| Safari | 14+ | ✅ 完全支持 |
| Firefox | 90+ | ✅ 支持 |
| Edge | 90+ | ✅ 完全支持 |
| Samsung | 15+ | ✅ 完全支持 |

## 常见问题

### Q: 为什么图标没有显示?

检查以下几点:
1. 图标文件是否存在于 `public/icons/`
2. 文件名和尺寸是否正确
3. 是否重新构建了项目

### Q: 离线后无法访问?

1. 检查 Service Worker 是否注册成功
2. 查看 DevTools > Application > Cache Storage
3. 确保访问过页面后才会缓存

### Q: 如何强制更新?

在控制台执行:
```javascript
navigator.serviceWorker.getRegistrations().then(regs => {
  for (let reg of regs) reg.unregister()
})
location.reload()
```

## 相关链接

- [Web App Manifest](https://developer.mozilla.org/zh-CN/docs/Web/Manifest)
- [Service Worker API](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API)
- [PWA Checklist](https://web.dev/pwa-checklist/)
