import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// Element Plus 基础样式 + 暗色 CSS 变量(由 html.dark 触发)
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'

// 全站样式(变量 / 断点 / reset / markdown)
import '@/styles/index.css'

import App from './App.vue'
import router from './router'
import { useThemeStore } from './store/theme'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(ElementPlus)

// 全局注册 Element Plus 图标
for (const [name, comp] of Object.entries(ElementPlusIconsVue)) {
  app.component(name, comp)
}

// 挂载前初始化主题(应用 data-theme + 代码高亮 + 跟随系统)
useThemeStore().init()

app.mount('#app')
