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
/* ========================================
   根元素样式 - 确保不受全局优化影响
   ======================================== */
html,
body,
#app {
  transform: none !important;
  margin: 0;
  padding: 0;
}

#app {
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden; /* 防止横向滚动 */
}

.main-wrapper {
  transition: margin-left 0.3s;
  width: 100%;
  overflow-x: hidden;
  transform: none !important; /* 确保主容器不受缩放影响 */
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

/* ========================================
   全局卡片尺寸优化 - 2025-12-19
   默认尺寸减小85%，hover时恢复100%并轻微放大
   ======================================== */

/* Element Plus 卡片统一优化 */
.el-card {
  transform: scale(0.85);
  transform-origin: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 8px;
}

.el-card:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
  z-index: 10;
}

/* 自定义卡片类优化 */
.agent-card,
.product-card,
.feature-card,
.service-card,
.solution-card,
.category-card,
.form-card,
.result-card,
.config-card,
.timeline-card,
.parts-card,
.query-card,
.promotion-card,
.method-card {
  transform: scale(0.85);
  transform-origin: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 8px;
}

.agent-card:hover,
.product-card:hover,
.feature-card:hover,
.service-card:hover,
.solution-card:hover,
.category-card:hover,
.form-card:hover,
.result-card:hover,
.config-card:hover,
.timeline-card:hover,
.parts-card:hover,
.query-card:hover,
.promotion-card:hover,
.method-card:hover {
  transform: scale(1.02);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15) !important;
  z-index: 10;
}

/* Grid/Row 容器优化，防止卡片间距过大 */
.el-row {
  margin: -8px !important;
}

.el-col {
  padding: 8px !important;
}

/* 统计卡片特殊处理 */
.el-statistic {
  transform: scale(0.9);
  transition: transform 0.3s;
}

.el-statistic:hover {
  transform: scale(1);
}

/* AICRM视图卡片优化 */
.aicrm-enhanced .el-card,
.aicrm-enhanced .agent-card,
.aicrm-enhanced .kpi-card,
.aicrm-enhanced .opportunity-card,
.aicrm-enhanced .customer-card {
  transform: scale(0.85);
  margin: 6px;
}

.aicrm-enhanced .el-card:hover,
.aicrm-enhanced .agent-card:hover,
.aicrm-enhanced .kpi-card:hover,
.aicrm-enhanced .opportunity-card:hover,
.aicrm-enhanced .customer-card:hover {
  transform: scale(1.02);
}

/* 保持表格、表单等内部元素正常尺寸 */
.el-table,
.el-form,
.el-dialog,
.el-drawer,
.el-menu {
  transform: none !important;
}

/* 响应式调整 - 小屏幕取消缩放 */
@media screen and (max-width: 768px) {
  .el-card,
  .agent-card,
  .product-card,
  .feature-card,
  .service-card,
  .solution-card,
  .category-card,
  .form-card,
  .result-card,
  .config-card,
  .timeline-card,
  .parts-card,
  .query-card,
  .promotion-card,
  .method-card {
    transform: scale(0.95);
  }
  
  .el-card:hover,
  .agent-card:hover,
  .product-card:hover,
  .feature-card:hover,
  .service-card:hover,
  .solution-card:hover,
  .category-card:hover,
  .form-card:hover,
  .result-card:hover,
  .config-card:hover,
  .timeline-card:hover,
  .parts-card:hover,
  .query-card:hover,
  .promotion-card:hover,
  .method-card:hover {
    transform: scale(1);
  }
}
</style>
