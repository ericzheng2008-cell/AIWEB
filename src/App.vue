<template>
  <div id="app">
    <ProductsServicesSidebar v-if="showSidebar" />
    <div class="main-wrapper" :class="{ 'with-sidebar': showSidebar }">
      <router-view @open-sidebar="showSidebar = true" />
    </div>
    <AiChat />
    <!-- 安彤AI监控中心 -->
    <AntomAIMonitor />
    <!-- 询盘表单 -->
    <InquiryForm />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onErrorCaptured } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import AiChat from './components/AiChat.vue'
import InquiryForm from './components/InquiryForm.vue'
import ProductsServicesSidebar from './components/ProductsServicesSidebar.vue'
import AntomAIMonitor from './components/AntomAIMonitor.vue'
import { useAntomAIStore } from './store/antomAI'
import logger from './utils/logger'

const route = useRoute()
const showSidebar = ref(false)
const antomStore = useAntomAIStore()

// 初始化安彤AI系统
onMounted(() => {
  try {
    antomStore.initializeAntomAI()
    
    // 记录页面访问行为
    antomStore.recordUserBehavior({
      type: 'view',
      page: 'app',
      action: 'mounted',
      data: { route: route.path },
      result: 'success'
    })
  } catch (error) {
    logger.error('安彤AI初始化失败:', error)
    ElMessage.warning('智能助手启动遇到问题，但不影响正常使用')
  }
})

// 监听路由变化，记录用户行为
watch(() => route.path, (newPath, oldPath) => {
  // 在特定页面隐藏侧边栏
  if (newPath === '/' || newPath === '/about' || newPath === '/contact') {
    showSidebar.value = false
  }
  
  // 记录路由切换行为
  try {
    antomStore.recordUserBehavior({
      type: 'navigation',
      page: oldPath || 'initial',
      action: 'route_change',
      data: { from: oldPath, to: newPath },
      context: { timestamp: new Date().toISOString() },
      result: 'success'
    })
  } catch (error) {
    logger.error('记录路由切换失败:', error)
  }
})

// 错误边界 - 捕获安彤AI组件的错误
onErrorCaptured((err, instance, info) => {
  logger.error('应用错误捕获:', err, info)
  
  // 如果是安彤AI相关错误，不让它影响整个应用
  if (info.includes('AntomAI') || instance?.$options?.name?.includes('AntomAI')) {
    ElMessage.error('智能助手遇到问题，已自动关闭')
    return false // 阻止错误继续传播
  }
  
  return true // 其他错误继续传播
})
</script>

<style>
#app {
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden; /* 防止横向滚动 */
}

.main-wrapper {
  transition: margin-left 0.3s;
  width: 100%;
  overflow-x: hidden;
}

.main-wrapper.with-sidebar {
  margin-left: 300px;
}

/* 移动端优化 - 侧边栏自动隐藏 */
@media screen and (max-width: 1024px) {
  .main-wrapper.with-sidebar {
    margin-left: 0;
  }
}
</style>
