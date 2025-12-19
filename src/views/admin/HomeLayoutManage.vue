<template>
  <div class="home-layout-manage">
    <el-card class="header-card">
      <h2><el-icon><Grid /></el-icon> 首页产品服务布局管理</h2>
      <p>拖拽调整首页"产品与服务"模块的卡片显示顺序</p>
    </el-card>

    <el-card class="layout-card">
      <template #header>
        <div class="card-header">
          <span>🎨 卡片布局预览（拖拽调整顺序）</span>
          <div class="header-actions">
            <el-button @click="resetOrder" size="small">
              <el-icon><RefreshRight /></el-icon> 恢复默认顺序
            </el-button>
            <el-button type="primary" @click="saveOrder" :loading="saving" size="small">
              <el-icon><Check /></el-icon> 保存顺序
            </el-button>
          </div>
        </div>
      </template>

      <el-alert 
        type="info" 
        title="操作提示" 
        :closable="false"
        style="margin-bottom: 20px;">
        <p>🖱️ 拖拽卡片即可调整显示顺序，调整后点击"保存顺序"按钮保存更改</p>
        <p>📱 前台首页"产品与服务"模块将按照此处设置的顺序显示</p>
      </el-alert>

      <div class="series-grid-container">
        <div class="series-grid" ref="seriesGridRef">
          <div 
            v-for="series in sortedSeries" 
            :key="series.id" 
            :data-id="series.id"
            class="series-card">
            <div class="drag-handle">
              <el-icon><Rank /></el-icon>
            </div>
            <div class="series-image">
              <img :src="series.image" :alt="series.name" />
            </div>
            <div class="series-info">
              <h3>{{ series.name }}</h3>
              <p>{{ series.description }}</p>
              <el-tag :type="series.type === 'category' ? 'primary' : 'success'" size="small">
                {{ series.type === 'category' ? '产品分类' : '服务智能体' }}
              </el-tag>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Grid, Check, RefreshRight, Rank } from '@element-plus/icons-vue'
import { useProductsServicesStore } from '../../store/productsServices'
import Sortable from 'sortablejs'

const productsStore = useProductsServicesStore()
const seriesGridRef = ref(null)
const saving = ref(false)
const currentOrder = ref([])

// 获取所有产品服务卡片
const allSeries = computed(() => {
  const categories = productsStore.visibleLevel1Categories.map(category => ({
    id: category.id,
    name: category.name['zh-CN'],
    description: category.description['zh-CN'],
    image: category.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600',
    type: 'category'
  }))
  
  const additionalServices = [
    {
      id: 'tool-selector',
      name: '拧紧工具选型',
      description: '智能分析工艺需求，推荐最优拧紧工具方案',
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600',
      type: 'service'
    },
    {
      id: 'fault-tracking',
      name: '故障工单管理',
      description: '全流程工单管理系统，从创建到追踪到完成',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600',
      type: 'service'
    }
  ]
  
  return [...categories, ...additionalServices]
})

// 排序后的卡片列表
const sortedSeries = computed(() => {
  if (currentOrder.value.length === 0) {
    return allSeries.value
  }
  
  return allSeries.value.sort((a, b) => {
    const indexA = currentOrder.value.indexOf(String(a.id))
    const indexB = currentOrder.value.indexOf(String(b.id))
    if (indexA === -1 && indexB === -1) return 0
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  })
})

// 初始化拖拽
const initDraggable = () => {
  if (!seriesGridRef.value) return
  
  Sortable.create(seriesGridRef.value, {
    animation: 200,
    handle: '.drag-handle',
    ghostClass: 'series-card-ghost',
    chosenClass: 'series-card-chosen',
    dragClass: 'series-card-drag',
    onEnd: (evt) => {
      // 更新当前顺序
      currentOrder.value = Array.from(seriesGridRef.value.children).map(el => el.getAttribute('data-id'))
    }
  })
}

// 加载保存的顺序
const loadOrder = () => {
  const savedOrder = JSON.parse(localStorage.getItem('homeProductSeriesOrder') || '[]')
  currentOrder.value = savedOrder
}

// 保存顺序
const saveOrder = () => {
  saving.value = true
  localStorage.setItem('homeProductSeriesOrder', JSON.stringify(currentOrder.value))
  setTimeout(() => {
    saving.value = false
    ElMessage.success('布局顺序已保存！前台首页将按此顺序显示')
  }, 500)
}

// 恢复默认顺序
const resetOrder = () => {
  currentOrder.value = []
  localStorage.removeItem('homeProductSeriesOrder')
  ElMessage.success('已恢复默认顺序')
}

onMounted(() => {
  loadOrder()
  nextTick(() => {
    initDraggable()
  })
})
</script>

<style scoped>
.home-layout-manage {
  padding: 20px;
}

.header-card {
  margin-bottom: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.header-card h2 {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  margin-bottom: 8px;
}

.header-card p {
  opacity: 0.95;
  font-size: 14px;
}

.layout-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.series-grid-container {
  padding: 20px 0;
}

.series-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@media (max-width: 1200px) {
  .series-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .series-grid {
    grid-template-columns: 1fr;
  }
}

.series-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e8e8e8;
  transition: all 0.3s ease;
  position: relative;
  cursor: move;
}

.series-card:hover {
  border-color: #667eea;
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.2);
}

.drag-handle {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(102, 126, 234, 0.9);
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  z-index: 10;
  transition: all 0.3s ease;
}

.drag-handle:active {
  cursor: grabbing;
}

.series-card:hover .drag-handle {
  background: #667eea;
  transform: scale(1.1);
}

.series-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.series-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.series-info {
  padding: 20px;
}

.series-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 10px;
}

.series-info p {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 12px;
}

/* 拖拽样式 */
.series-card-ghost {
  opacity: 0.4;
  background: #f0f0f0;
  border: 2px dashed #667eea;
}

.series-card-chosen {
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  border-color: #667eea;
  transform: scale(1.02);
}

.series-card-drag {
  transform: rotate(3deg);
  opacity: 0.9;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
}
</style>
