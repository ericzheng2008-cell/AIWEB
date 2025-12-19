<template>
  <div class="ai-learning-dashboard">
    <!-- 页面头部 -->
    <el-card class="header-card">
      <div class="page-header">
        <div class="header-left">
          <el-icon :size="32" color="#409EFF"><DataAnalysis /></el-icon>
          <div>
            <h2>AI学习训练中心</h2>
            <p>查看用户反馈，优化AI回答质量</p>
          </div>
        </div>
        <div class="header-right">
          <el-button @click="goHome">
            <el-icon><HomeFilled /></el-icon>
            返回主页
          </el-button>
          <el-button type="primary" @click="refreshData">
            <el-icon><Refresh /></el-icon>
            刷新数据
          </el-button>
          <el-button type="success" @click="exportData">
            <el-icon><Download /></el-icon>
            导出报告
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="12" :sm="6">
        <el-card class="stat-card">
          <el-statistic title="总反馈数" :value="statistics.total">
            <template #prefix>
              <el-icon color="#409EFF"><ChatDotRound /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card class="stat-card">
          <el-statistic title="好评率" :value="statistics.goodRate" suffix="%">
            <template #prefix>
              <el-icon color="#67C23A"><SuccessFilled /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card class="stat-card">
          <el-statistic title="待改进" :value="statistics.needImprovement">
            <template #prefix>
              <el-icon color="#E6A23C"><WarningFilled /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="6">
        <el-card class="stat-card">
          <el-statistic title="差评数" :value="statistics.badCount">
            <template #prefix>
              <el-icon color="#F56C6C"><CircleCloseFilled /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>反馈详情</span>
          <div class="filter-group">
            <el-select v-model="filterRating" placeholder="筛选评分" clearable style="width: 120px;">
              <el-option label="好评" :value="1" />
              <el-option label="差评" :value="-1" />
              <el-option label="中立" :value="0" />
            </el-select>
            <el-input 
              v-model="searchKeyword" 
              placeholder="搜索问题或反馈" 
              clearable
              style="width: 200px;"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
        </div>
      </template>

      <el-table 
        :data="filteredFeedbacks" 
        stripe
        style="width: 100%"
        :default-sort="{ prop: 'timestamp', order: 'descending' }"
      >
        <el-table-column type="expand">
          <template #default="{ row }">
            <div class="expand-content">
              <div class="expand-row">
                <strong>问题：</strong>
                <p>{{ row.question }}</p>
              </div>
              <div class="expand-row">
                <strong>AI回答：</strong>
                <p v-html="row.answer"></p>
              </div>
              <div class="expand-row" v-if="row.feedback">
                <strong>用户反馈：</strong>
                <p>{{ row.feedback }}</p>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="question" label="问题" min-width="200">
          <template #default="{ row }">
            <el-text truncated>{{ row.question }}</el-text>
          </template>
        </el-table-column>

        <el-table-column prop="rating" label="评分" width="100" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.rating === 1" type="success">
              <el-icon><Select /></el-icon> 好评
            </el-tag>
            <el-tag v-else-if="row.rating === -1" type="danger">
              <el-icon><Close /></el-icon> 差评
            </el-tag>
            <el-tag v-else type="info">
              <el-icon><Minus /></el-icon> 中立
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="feedback" label="反馈内容" min-width="200">
          <template #default="{ row }">
            <el-text v-if="row.feedback" truncated>{{ row.feedback }}</el-text>
            <el-text v-else type="info">无</el-text>
          </template>
        </el-table-column>

        <el-table-column prop="timestamp" label="时间" width="160" sortable>
          <template #default="{ row }">
            {{ formatTime(row.timestamp) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="viewDetail(row)">
              <el-icon><View /></el-icon> 详情
            </el-button>
            <el-button size="small" type="danger" @click="deleteFeedback(row.id)">
              <el-icon><Delete /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="filteredFeedbacks.length"
          layout="total, sizes, prev, pager, next, jumper"
        />
      </div>
    </el-card>

    <!-- 趋势分析图表 -->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12">
        <el-card>
          <template #header>
            <span>评分趋势</span>
          </template>
          <div id="rating-trend-chart" style="height: 300px;"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12">
        <el-card>
          <template #header>
            <span>高频问题Top10</span>
          </template>
          <div id="top-questions-chart" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="反馈详情" width="600px">
      <div v-if="selectedFeedback" class="detail-dialog">
        <div class="detail-item">
          <label>问题：</label>
          <p>{{ selectedFeedback.question }}</p>
        </div>
        <div class="detail-item">
          <label>AI回答：</label>
          <div v-html="selectedFeedback.answer"></div>
        </div>
        <div class="detail-item">
          <label>用户评分：</label>
          <el-tag v-if="selectedFeedback.rating === 1" type="success">好评</el-tag>
          <el-tag v-else-if="selectedFeedback.rating === -1" type="danger">差评</el-tag>
          <el-tag v-else type="info">中立</el-tag>
        </div>
        <div class="detail-item" v-if="selectedFeedback.feedback">
          <label>用户反馈：</label>
          <p>{{ selectedFeedback.feedback }}</p>
        </div>
        <div class="detail-item">
          <label>反馈时间：</label>
          <p>{{ formatTime(selectedFeedback.timestamp) }}</p>
        </div>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useLearningEngineStore } from '../store/learningEngine'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  DataAnalysis, HomeFilled, Refresh, Download, ChatDotRound,
  SuccessFilled, WarningFilled, CircleCloseFilled, Search,
  Select, Close, Minus, View, Delete
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const router = useRouter()
const learningStore = useLearningEngineStore()

// 数据状态
const filterRating = ref(null)
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const detailDialogVisible = ref(false)
const selectedFeedback = ref(null)

// 计算统计数据
const statistics = computed(() => {
  const feedbacks = learningStore.feedbacks
  const total = feedbacks.length
  const goodCount = feedbacks.filter(f => f.rating === 1).length
  const badCount = feedbacks.filter(f => f.rating === -1).length
  const neutralCount = feedbacks.filter(f => f.rating === 0).length
  
  return {
    total,
    goodCount,
    badCount,
    neutralCount,
    goodRate: total > 0 ? ((goodCount / total) * 100).toFixed(1) : 0,
    needImprovement: badCount + neutralCount
  }
})

// 过滤后的反馈数据
const filteredFeedbacks = computed(() => {
  let result = learningStore.feedbacks

  // 评分筛选
  if (filterRating.value !== null) {
    result = result.filter(f => f.rating === filterRating.value)
  }

  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(f => 
      f.question.toLowerCase().includes(keyword) ||
      (f.feedback && f.feedback.toLowerCase().includes(keyword))
    )
  }

  return result
})

// 返回主页
const goHome = () => {
  router.push('/')
}

// 刷新数据
const refreshData = () => {
  learningStore.loadFeedbacks()
  ElMessage.success('数据已刷新')
  initCharts()
}

// 导出数据
const exportData = () => {
  const feedbacks = learningStore.feedbacks
  
  let csvContent = 'ID,问题,回答,评分,反馈内容,时间\n'
  
  feedbacks.forEach(f => {
    const rating = f.rating === 1 ? '好评' : f.rating === -1 ? '差评' : '中立'
    const row = [
      f.id,
      `"${f.question.replace(/"/g, '""')}"`,
      `"${f.answer.replace(/<[^>]*>/g, '').replace(/"/g, '""')}"`,
      rating,
      `"${(f.feedback || '').replace(/"/g, '""')}"`,
      formatTime(f.timestamp)
    ].join(',')
    csvContent += row + '\n'
  })
  
  // 添加BOM以支持Excel正确显示中文
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `AI学习反馈数据_${new Date().getTime()}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
  
  ElMessage.success('数据已导出为CSV文件')
}

// 查看详情
const viewDetail = (feedback) => {
  selectedFeedback.value = feedback
  detailDialogVisible.value = true
}

// 删除反馈
const deleteFeedback = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这条反馈吗？', '确认删除', {
      type: 'warning'
    })
    
    learningStore.deleteFeedback(id)
    ElMessage.success('删除成功')
  } catch {
    // 用户取消
  }
}

// 格式化时间
const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 初始化图表
const initCharts = () => {
  initRatingTrendChart()
  initTopQuestionsChart()
}

// 评分趋势图
const initRatingTrendChart = () => {
  const chart = echarts.init(document.getElementById('rating-trend-chart'))
  
  const feedbacks = learningStore.feedbacks
  const last7Days = []
  const goodData = []
  const badData = []
  const neutralData = []
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
    last7Days.push(dateStr)
    
    const dayStart = new Date(date.setHours(0, 0, 0, 0)).getTime()
    const dayEnd = new Date(date.setHours(23, 59, 59, 999)).getTime()
    
    const dayFeedbacks = feedbacks.filter(f => f.timestamp >= dayStart && f.timestamp <= dayEnd)
    goodData.push(dayFeedbacks.filter(f => f.rating === 1).length)
    badData.push(dayFeedbacks.filter(f => f.rating === -1).length)
    neutralData.push(dayFeedbacks.filter(f => f.rating === 0).length)
  }
  
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['好评', '差评', '中立']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: last7Days
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '好评',
        type: 'line',
        data: goodData,
        smooth: true,
        itemStyle: { color: '#67C23A' }
      },
      {
        name: '差评',
        type: 'line',
        data: badData,
        smooth: true,
        itemStyle: { color: '#F56C6C' }
      },
      {
        name: '中立',
        type: 'line',
        data: neutralData,
        smooth: true,
        itemStyle: { color: '#909399' }
      }
    ]
  }
  
  chart.setOption(option)
  
  // 响应式
  window.addEventListener('resize', () => chart.resize())
}

// 高频问题图表
const initTopQuestionsChart = () => {
  const chart = echarts.init(document.getElementById('top-questions-chart'))
  
  const feedbacks = learningStore.feedbacks
  const questionCount = {}
  
  feedbacks.forEach(f => {
    const q = f.question
    questionCount[q] = (questionCount[q] || 0) + 1
  })
  
  const sorted = Object.entries(questionCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: sorted.map(([q]) => q.length > 20 ? q.substring(0, 20) + '...' : q).reverse(),
      axisLabel: {
        interval: 0
      }
    },
    series: [
      {
        type: 'bar',
        data: sorted.map(([, count]) => count).reverse(),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#409EFF' },
            { offset: 1, color: '#79bbff' }
          ])
        }
      }
    ]
  }
  
  chart.setOption(option)
  
  // 响应式
  window.addEventListener('resize', () => chart.resize())
}

// 组件挂载
onMounted(() => {
  learningStore.loadFeedbacks()
  setTimeout(() => {
    initCharts()
  }, 500)
})

// 监听数据变化
watch(() => learningStore.feedbacks, () => {
  setTimeout(() => {
    initCharts()
  }, 300)
}, { deep: true })
</script>

<style scoped>
.ai-learning-dashboard {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.header-card {
  margin-bottom: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-left h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.header-left p {
  margin: 4px 0 0 0;
  color: #909399;
  font-size: 14px;
}

.header-right {
  display: flex;
  gap: 12px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.table-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-group {
  display: flex;
  gap: 12px;
}

.expand-content {
  padding: 16px;
  background: #f9f9f9;
  border-radius: 4px;
}

.expand-row {
  margin-bottom: 12px;
}

.expand-row:last-child {
  margin-bottom: 0;
}

.expand-row strong {
  display: block;
  margin-bottom: 4px;
  color: #606266;
}

.expand-row p {
  margin: 0;
  color: #303133;
  line-height: 1.6;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.detail-dialog .detail-item {
  margin-bottom: 20px;
}

.detail-dialog .detail-item:last-child {
  margin-bottom: 0;
}

.detail-dialog label {
  display: block;
  font-weight: bold;
  color: #606266;
  margin-bottom: 8px;
}

.detail-dialog p {
  margin: 0;
  color: #303133;
  line-height: 1.6;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .ai-learning-dashboard {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .header-right {
    width: 100%;
    flex-wrap: wrap;
  }

  .header-right .el-button {
    flex: 1;
  }

  .card-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .filter-group {
    width: 100%;
    flex-direction: column;
  }

  .filter-group .el-select,
  .filter-group .el-input {
    width: 100% !important;
  }
}
</style>
