#!/usr/bin/env node

/**
 * PWA 图标生成脚本
 * 将 SVG 图标转换为多尺寸 PNG
 * 
 * 使用方法:
 * 1. 安装依赖: npm install sharp
 * 2. 运行: node scripts/generate-icons.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const THEME_COLOR = { r: 255, g: 123, b: 84 }

// 图标尺寸配置
const sizes = [72, 96, 128, 144, 152, 192, 384, 512]

// 路径配置
const inputFile = path.join(__dirname, '../public/icons/icon.svg')
const outputDir = path.join(__dirname, '../public/icons')

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

// 检查输入文件
if (!fs.existsSync(inputFile)) {
  console.error('[ERROR] 找不到输入文件:', inputFile)
  process.exit(1)
}

console.log('[INFO] 开始生成 PWA 图标...')

// 生成各尺寸图标
async function generateIcons() {
  const promises = sizes.map(async (size) => {
    const outputFile = path.join(outputDir, `icon-${size}x${size}.png`)

    try {
      await sharp(inputFile)
        .resize(size, size, {
          fit: 'contain',
          background: { ...THEME_COLOR, alpha: 1 }
        })
        .png({ quality: 90 })
        .toFile(outputFile)

      console.log(`[OK] ${size}x${size}px`)
      return { size, success: true }
    } catch (error) {
      console.error(`[FAIL] ${size}x${size}px:`, error.message)
      return { size, success: false, error }
    }
  })

  const results = await Promise.all(promises)

  // 统计结果
  const successCount = results.filter(r => r.success).length
  const failCount = results.length - successCount

  console.log(`[INFO] 生成完成: ${successCount} 成功, ${failCount} 失败`)

  if (failCount === 0) {
    console.log('[SUCCESS] 所有图标生成成功!')
    console.log('[INFO] 图标已保存到 public/icons/')
    console.log('[INFO] 重新构建项目以包含新图标')
  }
}

// 运行
generateIcons().catch(console.error)
