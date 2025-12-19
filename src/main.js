import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import i18n from './i18n'
import router from './router'
import App from './App.vue'
import './assets/style.css'
import './assets/responsive.css' // ✨ 引入响应式样式
import './styles/pantone-2736c.css' // ✨ 引入PANTONE 2736C配色方案
import { initDemoData } from './utils/initDemoData' // ✨ 引入演示数据初始化

// ✨ 初始化演示数据（确保所有访客看到相同的初始内容）
initDemoData()

// 创建应用实例
const app = createApp(App)

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册插件
app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(ElementPlus)

// 挂载应用
app.mount('#app')

// Service Worker 注册（PWA支持 - 可选）
if ('serviceWorker' in navigator && import.meta.env.MODE === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('✅ Service Worker 注册成功:', registration.scope)
      })
      .catch(error => {
        console.log('❌ Service Worker 注册失败:', error)
      })
  })
}
