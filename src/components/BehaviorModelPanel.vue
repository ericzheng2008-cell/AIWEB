<template>
  <div class="behavior-model-panel">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon :size="40" color="#409EFF"><User /></el-icon>
            <div class="stat-content">
              <div class="stat-value">{{ totalCustomers }}</div>
              <div class="stat-label">总客户数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon :size="40" color="#67C23A"><TrendCharts /></el-icon>
            <div class="stat-content">
              <div class="stat-value">{{ highPropensityCount }}</div>
              <div class="stat-label">高倾向客户</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon :size="40" color="#E6A23C"><Warning /></el-icon>
            <div class="stat-content">
              <div class="stat-value">{{ atRiskCount }}</div>
              <div class="stat-label">流失风险</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon :size="40" color="#F56C6C"><PieChart /></el-icon>
            <div class="stat-content">
              <div class="stat-value">{{ avgBehaviorScore }}</div>
              <div class="stat-label">平均行为分</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 功能标签页 -->
    <el-card class="main-panel" shadow="never">
      <el-tabs v-model="activeTab" type="border-card">
        <!-- 1. 客户行为分析 -->
        <el-tab-pane label="客户行为分析" name="behavior">
          <div class="search-bar">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索客户姓名、公司或电话"
              style="width: 300px"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="analyzeSelectedCustomer">
              <el-icon><DataAnalysis /></el-icon>
              分析选中客户
            </el-button>
          </div>

          <el-table
            :data="filteredCustomers"
            stripe
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="客户姓名" width="120" />
            <el-table-column prop="company" label="公司" width="180" />
            <el-table-column label="行为分数" width="150">
              <template #default="{ row }">
                <el-progress
                  :percentage="row.behaviorScore"
                  :color="getScoreColor(row.behaviorScore)"
                />
              </template>
            </el-table-column>
            <el-table-column label="生命周期" width="120">
              <template #default="{ row }">
                <el-tag :type="getStageType(row.stage)">
                  {{ row.stage }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="购买倾向" width="150">
              <template #default="{ row }">
                <div class="propensity-cell">
                  <el-tag :type="getPropensityType(row.propensity)">
                    {{ row.propensityLabel }}
                  </el-tag>
                  <span class="propensity-score">{{ row.propensity }}%</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="最后互动" width="120">
              <template #default="{ row }">
                {{ formatDate(row.lastInteraction) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="150">
              <template #default="{ row }">
                <el-button size="small" @click="viewCustomerDetail(row)">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="totalCustomers"
            layout="total, prev, pager, next"
            style="margin-top: 20px; justify-content: center"
          />
        </el-tab-pane>

        <!-- 2. 生命周期分布 -->
        <el-tab-pane label="生命周期分布" name="lifecycle">
          <div class="lifecycle-container">
            <div class="chart-wrapper">
              <div ref="lifecycleChartRef" style="width: 100%; height: 400px"></div>
            </div>
            <div class="lifecycle-details">
              <el-descriptions :column="2" border>
                <el-descriptions-item
                  v-for="stage in lifecycleStages"
                  :key="stage.name"
                  :label="stage.label"
                >
                  <el-tag :type="stage.type">{{ stage.count }} 人</el-tag>
                  <span class="percentage">{{ stage.percentage }}%</span>
                </el-descriptions-item>
              </el-descriptions>
            </div>
          </div>
        </el-tab-pane>

        <!-- 3. 购买倾向预测 -->
        <el-tab-pane label="购买倾向预测" name="propensity">
          <div class="propensity-container">
            <el-alert
              title="AI预测说明"
              type="info"
              :closable="false"
              style="margin-bottom: 20px"
            >
              基于客户历史行为、互动频率、生命周期阶段等多维度数据,AI模型预测客户未来购买倾向
            </el-alert>

            <div class="filter-bar">
              <el-select v-model="propensityFilter" placeholder="筛选倾向等级">
                <el-option label="全部" value="all" />
                <el-option label="极高" value="very_high" />
                <el-option label="高" value="high" />
                <el-option label="中" value="medium" />
                <el-option label="低" value="low" />
              </el-select>
              <el-button type="success" @click="exportHighPropensity">
                <el-icon><Download /></el-icon>
                导出高倾向客户
              </el-button>
            </div>

            <el-table :data="propensityList" stripe>
              <el-table-column prop="name" label="客户" width="120" />
              <el-table-column label="倾向分数" width="200">
                <template #default="{ row }">
                  <el-progress
                    :percentage="row.score"
                    :color="row.color"
                    :stroke-width="20"
                  >
                    <span class="progress-text">{{ row.score }}%</span>
                  </el-progress>
                </template>
              </el-table-column>
              <el-table-column label="倾向等级" width="120">
                <template #default="{ row }">
                  <el-tag :color="row.color" effect="dark">
                    {{ row.level }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="置信度" width="100">
                <template #default="{ row }">
                  {{ row.confidence }}%
                </template>
              </el-table-column>
              <el-table-column label="预计成交" width="120">
                <template #default="{ row }">
                  {{ row.timeframe }}
                </template>
              </el-table-column>
              <el-table-column label="建议行动" min-width="300">
                <template #default="{ row }">
                  <div class="action-list">
                    <el-tag
                      v-for="(action, idx) in row.actions"
                      :key="idx"
                      size="small"
                      :type="getActionPriority(action.priority)"
                      style="margin: 2px"
                    >
                      {{ action.action }}
                    </el-tag>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>

        <!-- 4. 客户行为路径 -->
        <el-tab-pane label="客户行为路径" name="journey">
          <div class="journey-container">
            <el-select
              v-model="selectedCustomerForJourney"
              placeholder="选择客户查看行为路径"
              filterable
              style="width: 300px; margin-bottom: 20px"
            >
              <el-option
                v-for="customer in customers"
                :key="customer.id"
                :label="`${customer.name} - ${customer.company}`"
                :value="customer.id"
              />
            </el-select>

            <div v-if="currentJourney" class="journey-visualization">
              <!-- 路径类型 -->
              <el-alert
                :title="`路径类型: ${currentJourney.pathType.label}`"
                :type="getJourneyType(currentJourney.pathType.efficiency)"
                show-icon
                :closable="false"
              >
                完成度: {{ currentJourney.completion }}%
              </el-alert>

              <!-- 路径步骤可视化 -->
              <el-steps
                :active="currentJourney.currentPath.length"
                finish-status="success"
                style="margin: 30px 0"
              >
                <el-step
                  v-for="(step, idx) in currentJourney.currentPath"
                  :key="idx"
                  :title="step.step"
                  :description="formatDate(step.timestamp)"
                />
              </el-steps>

              <!-- 瓶颈识别 -->
              <div v-if="currentJourney.bottlenecks.length > 0" class="bottlenecks">
                <h4><el-icon><Warning /></el-icon> 流程瓶颈</h4>
                <el-alert
                  v-for="(bottleneck, idx) in currentJourney.bottlenecks"
                  :key="idx"
                  :title="`${bottleneck.step} → ${bottleneck.nextStep}`"
                  :type="bottleneck.severity === 'high' ? 'error' : 'warning'"
                  style="margin-bottom: 10px"
                >
                  停滞时间: {{ bottleneck.delayDays }} 天
                </el-alert>
              </div>

              <!-- 下一步预测 -->
              <div v-if="currentJourney.nextSteps.length > 0" class="next-steps">
                <h4><el-icon><MagicStick /></el-icon> AI预测下一步</h4>
                <el-tag
                  v-for="(next, idx) in currentJourney.nextSteps"
                  :key="idx"
                  size="large"
                  type="success"
                  style="margin-right: 10px"
                >
                  {{ next.step }} ({{ Math.round(next.probability * 100) }}%)
                </el-tag>
              </div>

              <!-- 优化建议 -->
              <div v-if="currentJourney.recommendations.length > 0" class="recommendations">
                <h4><el-icon><Memo /></el-icon> 优化建议</h4>
                <el-timeline>
                  <el-timeline-item
                    v-for="(rec, idx) in currentJourney.recommendations"
                    :key="idx"
                    :type="rec.priority === 'high' ? 'danger' : 'primary'"
                    :timestamp="rec.issue"
                  >
                    {{ rec.suggestion }}
                  </el-timeline-item>
                </el-timeline>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 客户详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="客户行为详细分析"
      width="80%"
      @close="closeDetailDialog"
    >
      <div v-if="selectedCustomerDetail" class="customer-detail">
        <!-- 基本信息 -->
        <el-descriptions :column="3" border>
          <el-descriptions-item label="客户姓名">
            {{ selectedCustomerDetail.name }}
          </el-descriptions-item>
          <el-descriptions-item label="公司">
            {{ selectedCustomerDetail.company }}
          </el-descriptions-item>
          <el-descriptions-item label="行为分数">
            <el-tag :type="getScoreType(selectedCustomerDetail.behaviorScore)">
              {{ selectedCustomerDetail.behaviorScore }} 分
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <!-- 行为特征雷达图 -->
        <div class="behavior-radar">
          <h4>行为特征分析</h4>
          <div ref="radarChartRef" style="width: 100%; height: 400px"></div>
        </div>

        <!-- 关键洞察 -->
        <div class="key-insights">
          <h4>关键洞察</h4>
          <el-timeline>
            <el-timeline-item
              v-for="(insight, idx) in selectedCustomerDetail.keyInsights"
              :key="idx"
              type="primary"
            >
              {{ insight }}
            </el-timeline-item>
          </el-timeline>
        </div>

        <!-- 推荐行动 -->
        <div class="recommended-actions">
          <h4>推荐行动</h4>
          <el-row :gutter="15">
            <el-col
              v-for="(action, idx) in selectedCustomerDetail.topActions"
              :key="idx"
              :span="8"
            >
              <el-card shadow="hover">
                <el-tag :type="getActionPriority(action.priority)">
                  {{ action.priority }}
                </el-tag>
                <p class="action-content">{{ action.action }}</p>
                <p class="action-reason">原因: {{ action.reason }}</p>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="createTask">创建跟进任务</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import {
  User,
  TrendCharts,
  Warning,
  PieChart,
  Search,
  DataAnalysis,
  Download,
  MagicStick,
  Memo
} from '@element-plus/icons-vue'
import { BehaviorDrivenModelManager } from '@/utils/behaviorDrivenModel'
import { ElMessage, ElMessageBox } from 'element-plus'

// 数据
const modelManager = new BehaviorDrivenModelManager()
const customers = ref([])
const selectedCustomers = ref([])
const searchKeyword = ref('')
const activeTab = ref('behavior')
const currentPage = ref(1)
const pageSize = ref(10)
const propensityFilter = ref('all')
const selectedCustomerForJourney = ref(null)
const detailDialogVisible = ref(false)
const selectedCustomerDetail = ref(null)

// 图表引用
const lifecycleChartRef = ref(null)
const radarChartRef = ref(null)

// 统计数据
const totalCustomers = computed(() => customers.value.length)
const highPropensityCount = computed(() => 
  customers.value.filter(c => c.propensity >= 60).length
)
const atRiskCount = computed(() => 
  customers.value.filter(c => c.stage === '流失风险' || c.stage === '已流失').length
)
const avgBehaviorScore = computed(() => {
  if (customers.value.length === 0) return 0
  const sum = customers.value.reduce((total, c) => total + c.behaviorScore, 0)
  return Math.round(sum / customers.value.length)
})

// 过滤后的客户列表
const filteredCustomers = computed(() => {
  let list = customers.value
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    list = list.filter(c => 
      c.name.toLowerCase().includes(keyword) ||
      c.company.toLowerCase().includes(keyword) ||
      c.phone?.includes(keyword)
    )
  }
  
  const start = (currentPage.value - 1) * pageSize.value
  return list.slice(start, start + pageSize.value)
})

// 生命周期分布
const lifecycleStages = computed(() => {
  const stages = {
    visitor: { name: 'visitor', label: '访客', type: 'info', count: 0 },
    lead: { name: 'lead', label: '线索', type: 'primary', count: 0 },
    opportunity: { name: 'opportunity', label: '商机', type: 'warning', count: 0 },
    customer: { name: 'customer', label: '客户', type: 'success', count: 0 },
    advocate: { name: 'advocate', label: '忠诚客户', type: 'success', count: 0 },
    atRisk: { name: 'atRisk', label: '流失风险', type: 'danger', count: 0 },
    churned: { name: 'churned', label: '已流失', type: 'info', count: 0 }
  }
  
  customers.value.forEach(c => {
    const stageKey = Object.keys(stages).find(key => stages[key].label === c.stage)
    if (stageKey) stages[stageKey].count++
  })
  
  const total = customers.value.length || 1
  return Object.values(stages).map(stage => ({
    ...stage,
    percentage: Math.round(stage.count / total * 100)
  }))
})

// 购买倾向列表
const propensityList = computed(() => {
  let list = customers.value.map(c => ({
    id: c.id,
    name: c.name,
    score: c.propensity,
    level: c.propensityLabel,
    color: getPropensityColor(c.propensity),
    confidence: c.confidence || 85,
    timeframe: c.timeframe || '1个月内',
    actions: c.recommendedActions || []
  }))
  
  if (propensityFilter.value !== 'all') {
    list = list.filter(item => {
      const level = item.level.toLowerCase().replace(' ', '_')
      return level === propensityFilter.value
    })
  }
  
  return list.sort((a, b) => b.score - a.score)
})

// 当前客户旅程
const currentJourney = ref(null)

// 方法
const handleSelectionChange = (selection) => {
  selectedCustomers.value = selection
}

const analyzeSelectedCustomer = async () => {
  if (selectedCustomers.value.length === 0) {
    ElMessage.warning('请先选择客户')
    return
  }
  
  if (selectedCustomers.value.length > 1) {
    ElMessage.warning('一次只能分析一个客户')
    return
  }
  
  await viewCustomerDetail(selectedCustomers.value[0])
}

const viewCustomerDetail = async (customer) => {
  try {
    // 调用行为模型分析
    const analysis = await modelManager.analyzeCustomer(customer.id, {
      visitLogs: customer.visitLogs || [],
      interactions: customer.interactions || [],
      orders: customer.orders || [],
      socialData: customer.socialData || {},
      referralSource: customer.referralSource
    })
    
    selectedCustomerDetail.value = {
      ...customer,
      ...analysis.summary,
      behaviorFeatures: analysis.behaviorFeatures.features,
      keyInsights: analysis.summary.keyInsights,
      topActions: analysis.summary.topActions
    }
    
    detailDialogVisible.value = true
    
    // 等待对话框渲染后绘制雷达图
    await nextTick()
    drawRadarChart(analysis.behaviorFeatures.features)
  } catch (error) {
    console.error('分析客户失败:', error)
    ElMessage.error('分析客户失败')
  }
}

const closeDetailDialog = () => {
  detailDialogVisible.value = false
  selectedCustomerDetail.value = null
}

const drawRadarChart = (features) => {
  if (!radarChartRef.value) return
  
  const chart = echarts.init(radarChartRef.value)
  
  const option = {
    title: {
      text: '行为特征雷达图'
    },
    tooltip: {},
    radar: {
      indicator: [
        { name: '访问频率', max: 30 },
        { name: '互动质量', max: 30 },
        { name: '购买历史', max: 30 },
        { name: '社交影响', max: 20 },
        { name: '忠诚度', max: 25 }
      ]
    },
    series: [{
      type: 'radar',
      data: [{
        value: [
          features.visit?.frequency || 0,
          features.interaction?.inquiryCount || 0,
          features.purchase?.frequency || 0,
          features.social?.shareCount || 0,
          features.purchase?.lifetimeValue ? 20 : 0
        ],
        name: '客户行为特征'
      }]
    }]
  }
  
  chart.setOption(option)
}

const exportHighPropensity = () => {
  const highPropensityCustomers = customers.value.filter(c => c.propensity >= 60)
  
  if (highPropensityCustomers.length === 0) {
    ElMessage.warning('暂无高倾向客户')
    return
  }
  
  const csv = [
    ['客户姓名', '公司', '购买倾向', '预计成交时间', '建议行动'].join(','),
    ...highPropensityCustomers.map(c => 
      [c.name, c.company, `${c.propensity}%`, c.timeframe, c.recommendedActions?.[0]?.action || ''].join(',')
    )
  ].join('\n')
  
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `高购买倾向客户_${new Date().toLocaleDateString()}.csv`
  link.click()
  
  ElMessage.success('导出成功')
}

const createTask = () => {
  ElMessageBox.prompt('请输入任务描述', '创建跟进任务', {
    confirmButtonText: '创建',
    cancelButtonText: '取消'
  }).then(({ value }) => {
    console.log('创建任务:', value, '客户:', selectedCustomerDetail.value.name)
    ElMessage.success('任务创建成功')
    detailDialogVisible.value = false
  })
}

const getScoreColor = (score) => {
  if (score >= 80) return '#67C23A'
  if (score >= 60) return '#409EFF'
  if (score >= 40) return '#E6A23C'
  return '#F56C6C'
}

const getScoreType = (score) => {
  if (score >= 80) return 'success'
  if (score >= 60) return 'primary'
  if (score >= 40) return 'warning'
  return 'danger'
}

const getStageType = (stage) => {
  const typeMap = {
    '访客': 'info',
    '线索': 'primary',
    '商机': 'warning',
    '客户': 'success',
    '忠诚客户': 'success',
    '流失风险': 'danger',
    '已流失': 'info'
  }
  return typeMap[stage] || 'info'
}

const getPropensityType = (score) => {
  if (score >= 80) return 'success'
  if (score >= 60) return 'primary'
  if (score >= 40) return 'warning'
  return 'danger'
}

const getPropensityColor = (score) => {
  if (score >= 80) return '#67C23A'
  if (score >= 60) return '#409EFF'
  if (score >= 40) return '#E6A23C'
  return '#F56C6C'
}

const getActionPriority = (priority) => {
  const map = {
    urgent: 'danger',
    high: 'warning',
    medium: 'primary',
    low: 'info'
  }
  return map[priority] || 'info'
}

const getJourneyType = (efficiency) => {
  const map = {
    high: 'success',
    medium: 'warning',
    low: 'danger'
  }
  return map[efficiency] || 'info'
}

const formatDate = (date) => {
  if (!date) return '-'
  const d = new Date(date)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

// 初始化模拟数据
const initMockData = () => {
  customers.value = [
    {
      id: 1,
      name: '张三',
      company: '科技有限公司',
      phone: '13800138000',
      behaviorScore: 85,
      stage: '商机',
      propensity: 78,
      propensityLabel: '高',
      confidence: 88,
      timeframe: '1周内',
      lastInteraction: new Date(Date.now() - 2 * 24 * 3600 * 1000),
      recommendedActions: [
        { priority: 'urgent', action: '立即发送报价', reason: '购买意向极高' },
        { priority: 'high', action: '安排产品演示', reason: '技术关注度高' }
      ],
      visitLogs: [],
      interactions: [],
      orders: []
    },
    {
      id: 2,
      name: '李四',
      company: '制造集团',
      phone: '13900139000',
      behaviorScore: 62,
      stage: '线索',
      propensity: 55,
      propensityLabel: '中',
      confidence: 75,
      timeframe: '1个月内',
      lastInteraction: new Date(Date.now() - 5 * 24 * 3600 * 1000),
      recommendedActions: [
        { priority: 'high', action: '电话跟进', reason: '需求明确' }
      ],
      visitLogs: [],
      interactions: [],
      orders: []
    },
    {
      id: 3,
      name: '王五',
      company: '工业公司',
      behaviorScore: 45,
      stage: '流失风险',
      propensity: 32,
      propensityLabel: '低',
      confidence: 65,
      timeframe: '6个月以上',
      lastInteraction: new Date(Date.now() - 70 * 24 * 3600 * 1000),
      recommendedActions: [
        { priority: 'urgent', action: '挽回优惠', reason: '流失风险高' }
      ],
      visitLogs: [],
      interactions: [],
      orders: []
    }
  ]
}

// 绘制生命周期分布图
const drawLifecycleChart = () => {
  if (!lifecycleChartRef.value) return
  
  const chart = echarts.init(lifecycleChartRef.value)
  
  const option = {
    title: {
      text: '客户生命周期分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    series: [{
      type: 'pie',
      radius: '60%',
      data: lifecycleStages.value.map(stage => ({
        name: stage.label,
        value: stage.count
      })),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }
  
  chart.setOption(option)
}

// 监听标签页切换
watch(activeTab, (newTab) => {
  if (newTab === 'lifecycle') {
    nextTick(() => drawLifecycleChart())
  }
})

// 监听选中客户变化
watch(selectedCustomerForJourney, async (customerId) => {
  if (!customerId) {
    currentJourney.value = null
    return
  }
  
  const customer = customers.value.find(c => c.id === customerId)
  if (!customer) return
  
  try {
    const analysis = await modelManager.analyzeCustomer(customerId, {
      visitLogs: customer.visitLogs || [],
      interactions: customer.interactions || [],
      orders: customer.orders || [],
      socialData: customer.socialData || {}
    })
    
    currentJourney.value = analysis.customerJourney
  } catch (error) {
    console.error('分析客户旅程失败:', error)
    ElMessage.error('分析失败')
  }
})

onMounted(() => {
  initMockData()
  drawLifecycleChart()
})
</script>

<style scoped lang="scss">
.behavior-model-panel {
  padding: 20px;

  .stats-row {
    margin-bottom: 20px;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 15px;

    .stat-content {
      .stat-value {
        font-size: 28px;
        font-weight: bold;
        color: #303133;
      }

      .stat-label {
        font-size: 14px;
        color: #909399;
        margin-top: 5px;
      }
    }
  }

  .main-panel {
    .search-bar {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
    }

    .propensity-cell {
      display: flex;
      align-items: center;
      gap: 10px;

      .propensity-score {
        font-weight: bold;
      }
    }

    .action-list {
      display: flex;
      flex-wrap: wrap;
    }
  }

  .lifecycle-container {
    display: flex;
    gap: 30px;

    .chart-wrapper {
      flex: 1;
    }

    .lifecycle-details {
      flex: 1;

      .percentage {
        margin-left: 10px;
        color: #909399;
      }
    }
  }

  .propensity-container {
    .filter-bar {
      display: flex;
      gap: 15px;
      margin-bottom: 20px;
    }

    .progress-text {
      font-weight: bold;
    }
  }

  .journey-container {
    .bottlenecks,
    .next-steps,
    .recommendations {
      margin-top: 30px;

      h4 {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 15px;
      }
    }
  }

  .customer-detail {
    .behavior-radar,
    .key-insights,
    .recommended-actions {
      margin-top: 30px;

      h4 {
        margin-bottom: 15px;
        font-size: 16px;
        font-weight: bold;
      }
    }

    .action-content {
      margin: 10px 0;
      font-weight: bold;
    }

    .action-reason {
      color: #909399;
      font-size: 12px;
    }
  }
}
</style>
