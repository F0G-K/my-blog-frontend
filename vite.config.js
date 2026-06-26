import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    // 优先使用环境变量指定的端口(便于预览工具分配空闲端口),默认 5173
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
    proxy: {
      // 开发环境把 /api 代理到后端,避免本地跨域
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
