import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.spec.js'],
    exclude: ['tests/e2e/**', '.claude/**'],
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
