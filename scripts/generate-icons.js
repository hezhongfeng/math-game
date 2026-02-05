#!/usr/bin/env node

/**
 * PWA 图标生成脚本
 * 将 SVG 图标转换为多尺寸 PNG
 * 
 * 使用方法:
 * 1. 安装依赖: npm install sharp
 * 2. 运行: node scripts/generate-icons.js
 */

const fs = require('fs')
const path = require('path')

// 检查是否安装了 sharp
let sharp

try {
  sharp = require('sharp')
} catch (error) {
  console.log('
❌ 缺少依赖: sharp')
  console.log('请安装依赖后重试:')
  console.log('  npm install sharp --save-dev')
  console.log('  或')
  console.log('  pnpm add sharp --save-dev')
  console.log()
  process.exit(1)
}

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
  console.error(`❌ 找不到输入文件: ${inputFile}`)
  process.exit(1)
}

console.log('🎨 开始生成 PWA 图标...\n')

// 生成各尺寸图标
async function generateIcons() {
  const promises = sizes.map(async (size) => {
    const outputFile = path.join(outputDir, `icon-${size}x${size}.png`)
    
    try {
      await sharp(inputFile)
        .resize(size, size, {
          fit: 'contain',
          background: { r: 74, g: 124, b: 89, alpha: 1 }
        })
        .png({ quality: 90 })
        .toFile(outputFile)
      
      console.log(`✅ ${size}x${size}px`)
      return { size, success: true }
    } catch (error) {
      console.error(`❌ ${size}x${size}px:`, error.message)
      return { size, success: false, error }
    }
  })
  
  const results = await Promise.all(promises)
  
  // 统计结果
  const successCount = results.filter(r => r.success).length
  const failCount = results.length - successCount
  
  console.log(`\n📊 生成完成: ${successCount} 成功, ${failCount} 失败`)
  
  if (failCount === 0) {
    console.log('\n🎉 所有图标生成成功!')
    console.log('\n提示:')
    console.log('  - 图标已保存到 public/icons/')
    console.log('  - 重新构建项目以包含新图标')
    console.log('  - 在 Chrome DevTools > Application > Manifest 中验证')
  }
}

// 运行
generateIcons().catch(console.error)
