/**
 * PWA 图标生成脚本
 * 将 SVG 图标转换为各种尺寸的 PNG 图标
 */

import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { mkdirSync, existsSync } from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const ICONS_DIR = join(__dirname, '../public/icons')

// 需要生成的图标尺寸
const SIZES = [72, 96, 128, 144, 152, 192, 384, 512]

async function generateIcons() {
  // 确保 icons 目录存在
  if (!existsSync(ICONS_DIR)) {
    mkdirSync(ICONS_DIR, { recursive: true })
  }

  const svgPath = join(ICONS_DIR, 'icon.svg')
  
  console.log('🎨 开始生成 PWA 图标...\n')

  for (const size of SIZES) {
    const outputPath = join(ICONS_DIR, `icon-${size}x${size}.png`)
    
    try {
      await sharp(svgPath)
        .resize(size, size)
        .png()
        .toFile(outputPath)
      
      console.log(`✅ 生成: icon-${size}x${size}.png`)
    } catch (error) {
      console.error(`❌ 失败: icon-${size}x${size}.png`, error.message)
    }
  }

  console.log('\n🎉 图标生成完成！')
  console.log('\n提示：部署后用户需要重新"添加到主屏幕"才能看到新图标')
}

generateIcons().catch(console.error)
