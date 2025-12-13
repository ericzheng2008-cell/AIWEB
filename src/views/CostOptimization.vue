<template>
  <div class="cost-optimization">
    <Header />
    
    <div class="page-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1><el-icon><Money /></el-icon> 成本优化分析</h1>
        <p class="subtitle">数据驱动的降本增效方案 · 智能优化建议 · ROI提升</p>
        <el-button type="primary" @click="generateSuggestions" :loading="generating">
          <el-icon><Refresh /></el-icon>
          生成优化建议
        </el-button>
      </div>

      <!-- 降本指标卡片 -->
      <div class="savings-metrics">
        <div class="metric-card total">
          <div class="metric-icon">
            <el-icon :size="40"><TrendCharts /></el-icon>
          </div>
          <div class="metric-content">
            <div class="metric-label">总节省潜力</div>
            <div class="metric-value">¥{{ (costStore.savingsMetrics.totalSavings / 10000).toFixed(1) }}万</div>
            <div class="metric-trend positive">
              <el-icon><Top /></el-icon>
              预计年化收益
            </div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon" style="background: linear-gradient(135deg, #1890ff, #36cfc9);">
            <el-icon :size="32"><Box /></el-icon>
          </div>
          <div class="metric-content">
            <div class="metric-label">备件优化</div>
            <div class="metric-value">¥{{ (costStore.savingsMetrics.partsOptimization / 10000).toFixed(1) }}万</div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon" style="background: linear-gradient(135deg, #52c41a, #73d13d);">
            <el-icon :size="32"><User /></el-icon>
          </div>
          <div class="metric-content">
            <div class="metric-label">人工效率</div>
            <div class="metric-value">¥{{ (costStore.savingsMetrics.laborEfficiency / 10000).toFixed(1) }}万</div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon" style="background: linear-gradient(135deg, #faad14, #ffc53d);">
            <el-icon :size="32"><Clock /></el-icon>
          </div>
          <div class="metric-content">
            <div class="metric-label">预防性维护</div>
            <div class="metric-value">¥{{ (costStore.savingsMetrics.preventiveMaintenance / 10000).toFixed(1) }}万</div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon" style="background: linear-gradient(135deg, #f5222d, #ff4d4f);">
            <el-icon :size="32"><Lightning /></el-icon>
          </div>
          <div class="metric-content">
            <div class="metric-label">能源效率</div>
            <div class="metric-value">¥{{ (costStore.savingsMetrics.energyEfficiency / 10000).toFixed(1) }}万</div>
          </div>
        </div>
      </div>

      <!-- 优化建议列表 -->
      <div class="suggestions-section">
        <div class="section-header">
          <h2>优化建议</h2>
          <div class="filters">
            <el-radio-group v-model="filterPriority" @change="handleFilterChange">
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button label="high">高优先级</el-radio-button>
              <el-radio-button label="medium">中优先级</el-radio-button>
              <el-radio-button label="low">低优先级</el-radio-button>
            </el-radio-group>
            <el-select v-model="filterCategory" placeholder="筛选类别" clearable style="width: 160px; margin-left: 12px;">
              <el-option 
                v-for="cat in costStore.categories" 
                :key="cat.id" 
                :label="cat.name" 
                :value="cat.id">
                <el-icon><component :is="cat.icon" /></el-icon>
                {{ cat.name }}
              </el-option>
            </el-select>
          </div>
        </div>

        <div class="suggestions-list">
          <el-empty v-if="filteredSuggestions.length === 0" description="暂无优化建议，点击上方按钮生成" />
          
          <div 
            v-for="suggestion in filteredSuggestions" 
            :key="suggestion.id" 
            class="suggestion-card"
            :class="[suggestion.priority, suggestion.status]">
            <div class="suggestion-header">
              <div class="header-left">
                <el-tag 
                  :type="getPriorityType(suggestion.priority)" 
                  size="small"
                  effect="dark">
                  {{ getPriorityLabel(suggestion.priority) }}
                </el-tag>
                <el-tag 
                  :color="getCategoryColor(suggestion.category)"
                  size="small"
                  style="margin-left: 8px; border: none; color: #fff;">
                  {{ getCategoryName(suggestion.category) }}
                </el-tag>
              </div>
              <div class="header-right">
                <el-dropdown @command="handleSuggestionAction">
                  <el-button text>
                    <el-icon><MoreFilled /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item :command="{action: 'implement', id: suggestion.id}">
                        <el-icon><Select /></el-icon>
                        标记为已实施
                      </el-dropdown-item>
                      <el-dropdown-item :command="{action: 'archive', id: suggestion.id}">
                        <el-icon><FolderOpened /></el-icon>
                        归档
                      </el-dropdown-item>
                      <el-dropdown-item :command="{action: 'delete', id: suggestion.id}" divided>
                        <el-icon><Delete /></el-icon>
                        删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>

            <div class="suggestion-body">
              <h3 class="suggestion-title">{{ suggestion.title }}</h3>
              <p class="suggestion-desc">{{ suggestion.description }}</p>

              <div class="suggestion-details">
                <div class="detail-section">
                  <h4><el-icon><Warning /></el-icon> 当前情况</h4>
                  <p>{{ suggestion.currentSituation }}</p>
                </div>
                <div class="detail-section">
                  <h4><el-icon><Opportunity /></el-icon> 解决方案</h4>
                  <p>{{ suggestion.solution }}</p>
                </div>
              </div>

              <div class="suggestion-metrics">
                <div class="metric-item savings">
                  <el-icon><Money /></el-icon>
                  <span class="label">预计节省</span>
                  <span class="value">¥{{ (suggestion.potentialSavings / 10000).toFixed(1) }}万</span>
                </div>
                <div class="metric-item time">
                  <el-icon><Clock /></el-icon>
                  <span class="label">实施周期</span>
                  <span class="value">{{ suggestion.implementationTime }}</span>
                </div>
                <div class="metric-item difficulty">
                  <el-icon><DataLine /></el-icon>
                  <span class="label">实施难度</span>
                  <span class="value">{{ getDifficultyLabel(suggestion.difficulty) }}</span>
                </div>
              </div>
            </div>

            <div class="suggestion-footer">
              <span class="created-time">创建于: {{ formatDate(suggestion.createdAt) }}</span>
              <el-button 
                v-if="suggestion.status === 'pending'"
                type="primary" 
                size="small"
                @click="implementSuggestion(suggestion.id)">
                开始实施
              </el-button>
              <el-tag v-else-if="suggestion.status === 'implementing'" type="warning">实施中</el-tag>
              <el-tag v-else-if="suggestion.status === 'completed'" type="success">已完成</el-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- ROI分析图表 -->
      <div class="roi-analysis">
        <h2>ROI投资回报分析</h2>
        <div class="chart-container">
          <div ref="roiChart" class="chart"></div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useCostOptimizationStore } from '../store/costOptimization'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import * as echarts from 'echarts'

const costStore = useCostOptimizationStore()
const generating = ref(false)
const filterPriority = ref('all')
const filterCategory = ref(null)
const roiChart = ref(null)

// 过滤后的建议
const filteredSuggestions = computed(() => {
  let suggestions = [...costStore.optimizationSuggestions]
  
  if (filterPriority.value !== 'all') {
    suggestions = suggestions.filter(s => s.priority === filterPriority.value)
  }
  
  if (filterCategory.value) {
    suggestions = suggestions.filter(s => s.category === filterCategory.value)
  }
  
  // 按优先级和节省金额排序
  const priorityOrder = { high: 3, medium: 2, low: 1 }
  suggestions.sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    return b.potentialSavings - a.potentialSavings
  })
  
  return suggestions
})

// 生成优化建议
const generateSuggestions = async () => {
  generating.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    costStore.generateOptimizationSuggestions()
    ElMessage.success('优化建议生成成功！')
    await nextTick()
    initROIChart()
  } finally {
    generating.value = false
  }
}

// 实施建议
const implementSuggestion = (id) => {
  ElMessageBox.confirm(
    '确认开始实施此优化建议吗？',
    '确认实施',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    costStore.updateSuggestionStatus(id, 'implementing')
    ElMessage.success('已标记为实施中')
  }).catch(() => {})
}

// 处理建议操作
const handleSuggestionAction = ({ action, id }) => {
  if (action === 'implement') {
    costStore.updateSuggestionStatus(id, 'completed')
    ElMessage.success('已标记为已完成')
  } else if (action === 'archive') {
    costStore.updateSuggestionStatus(id, 'archived')
    ElMessage.success('已归档')
  } else if (action === 'delete') {
    ElMessageBox.confirm('确认删除此建议吗？', '确认删除', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      costStore.deleteSuggestion(id)
      ElMessage.success('删除成功')
    }).catch(() => {})
  }
}

// 筛选变化
const handleFilterChange = () => {
  // 筛选逻辑已在computed中处理
}

// 获取优先级类型
const getPriorityType = (priority) => {
  const types = { high: 'danger', medium: 'warning', low: 'info' }
  return types[priority] || 'info'
}

// 获取优先级标签
const getPriorityLabel = (priority) => {
  const labels = { high: '高优先级', medium: '中优先级', low: '低优先级' }
  return labels[priority] || priority
}

// 获取难度标签
const getDifficultyLabel = (difficulty) => {
  const labels = { low: '容易', medium: '中等', high: '困难' }
  return labels[difficulty] || difficulty
}

// 获取类别名称
const getCategoryName = (categoryId) => {
  const category = costStore.categories.find(c => c.id === categoryId)
  return category ? category.name : categoryId
}

// 获取类别颜色
const getCategoryColor = (categoryId) => {
  const category = costStore.categories.find(c => c.id === categoryId)
  return category ? category.color : '#666'
}

// 格式化日期
const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleString('zh-CN', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 初始化ROI图表
const initROIChart = () => {
  if (!roiChart.value) return
  
  const chart = echarts.init(roiChart.value)
  
  const categories = costStore.categories.map(c => c.name)
  const data = costStore.categories.map(c => {
    const suggestions = costStore.suggestionsByCategory[c.id] || []
    return suggestions.reduce((sum, s) => sum + s.potentialSavings, 0) / 10000
  })
  
  const option = {
    title: {
      text: '各类别降本潜力分析',
      left: 'center',
      top: 20
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: '{b}: ¥{c}万'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: categories,
      axisLabel: {
        interval: 0,
        rotate: 30
      }
    },
    yAxis: {
      type: 'value',
      name: '节省金额(万元)',
      axisLabel: {
        formatter: '¥{value}'
      }
    },
    series: [{
      name: '潜在节省',
      type: 'bar',
      data: data,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#1890ff' },
          { offset: 1, color: '#36cfc9' }
        ])
      },
      label: {
        show: true,
        position: 'top',
        formatter: '¥{c}万'
      }
    }]
  }
  
  chart.setOption(option)
  
  window.addEventListener('resize', () => {
    chart.resize()
  })
}

onMounted(() => {
  // 自动生成建议
  if (costStore.optimizationSuggestions.length === 0) {
    generateSuggestions()
  } else {
    nextTick(() => {
      initROIChart()
    })
  }
})
</script>

<style scoped>
.cost-optimization {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f0f5ff 0%, #ffffff 300px);
}

.page-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;
}

.page-header {
  text-align: center;
  margin-bottom: 48px;
}

.page-header h1 {
  font-size: 36px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 24px;
}

/* 指标卡片 */
.savings-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.metric-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
}

.metric-card.total {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, #1890ff, #36cfc9);
  color: #fff;
}

.metric-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.metric-card.total .metric-icon {
  background: rgba(255,255,255,0.2);
}

.metric-content {
  flex: 1;
}

.metric-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.metric-card.total .metric-label {
  color: rgba(255,255,255,0.9);
}

.metric-value {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1;
  margin-bottom: 8px;
}

.metric-card.total .metric-value {
  color: #fff;
  font-size: 48px;
}

.metric-trend {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.metric-trend.positive {
  color: rgba(255,255,255,0.9);
}

/* 建议列表 */
.suggestions-section {
  margin-bottom: 48px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
}

.filters {
  display: flex;
  gap: 12px;
}

.suggestions-list {
  display: grid;
  gap: 24px;
}

.suggestion-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  border-left: 4px solid #d9d9d9;
  transition: all 0.3s;
}

.suggestion-card.high {
  border-left-color: #f5222d;
}

.suggestion-card.medium {
  border-left-color: #faad14;
}

.suggestion-card.low {
  border-left-color: #52c41a;
}

.suggestion-card:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.12);
}

.suggestion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  gap: 8px;
}

.suggestion-body {
  margin-bottom: 20px;
}

.suggestion-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.suggestion-desc {
  font-size: 15px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.suggestion-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.detail-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.detail-section p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.suggestion-metrics {
  display: flex;
  gap: 32px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.metric-item .label {
  font-size: 13px;
  color: #666;
}

.metric-item .value {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
}

.metric-item.savings .value {
  color: #52c41a;
}

.suggestion-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.created-time {
  font-size: 13px;
  color: #999;
}

/* ROI分析 */
.roi-analysis {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.roi-analysis h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 24px;
}

.chart-container {
  width: 100%;
  height: 400px;
}

.chart {
  width: 100%;
  height: 100%;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 28px;
  }
  
  .savings-metrics {
    grid-template-columns: 1fr;
  }
  
  .metric-card.total {
    grid-column: 1;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .filters {
    flex-direction: column;
    width: 100%;
  }
  
  .suggestion-details {
    grid-template-columns: 1fr;
  }
  
  .suggestion-metrics {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
