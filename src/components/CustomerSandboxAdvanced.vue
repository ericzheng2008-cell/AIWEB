<template>
  <div class="customer-sandbox-advanced">
    <!-- 页面头部 -->
    <el-card class="header-card" shadow="never">
      <div class="page-header">
        <div class="header-left">
          <el-icon :size="32" color="#1890ff"><DataAnalysis /></el-icon>
          <div>
            <h2>客户沙盘分析</h2>
            <p>AI驱动的客户全景分析与商业模拟</p>
          </div>
        </div>
        <div class="header-right">
          <el-button @click="goHome">
            <el-icon><HomeFilled /></el-icon>
            返回主页
          </el-button>
          <el-button type="success" @click="generateStrategy" :disabled="!selectedCustomer">
            <el-icon><MagicStick /></el-icon>
            策略推荐
          </el-button>
          <el-button type="warning" @click="exportReport" :disabled="!selectedCustomer">
            <el-icon><Download /></el-icon>
            导出报告
          </el-button>
          <el-button type="primary" @click="refreshAnalysis">
            <el-icon><Refresh /></el-icon>
            刷新分析
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 主内容区域 -->
    <el-row :gutter="20">
      <!-- 左侧：客户选择与基本信息 -->
      <el-col :span="6">
        <el-card class="customer-selector-card">
          <template #header>
            <div class="card-header">
              <span>客户选择</span>
              <el-tag type="success">{{ customers.length }}</el-tag>
            </div>
          </template>

          <!-- 搜索框 -->
          <el-input
            v-model="searchKeyword"
            placeholder="搜索客户名称..."
            clearable
            class="mb-3">
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>

          <!-- 客户列表 -->
          <el-scrollbar height="600px">
            <div
              v-for="customer in filteredCustomers"
              :key="customer.id"
              class="customer-item"
              :class="{ active: selectedCustomer?.id === customer.id }"
              @click="selectCustomer(customer)">
              <div class="customer-avatar">
                <el-avatar :size="40">{{ customer.name.charAt(0) }}</el-avatar>
              </div>
              <div class="customer-info">
                <div class="customer-name">{{ customer.name }}</div>
                <div class="customer-meta">
                  <el-tag :type="getLevelType(customer.level)" size="small">
                    {{ customer.level }}
                  </el-tag>
                  <span class="customer-value">¥{{ formatNumber(customer.totalValue) }}</span>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </el-card>
      </el-col>

      <!-- 中间：沙盘可视化 -->
      <el-col :span="12">
        <el-card v-if="selectedCustomer" class="sandbox-visualization-card">
          <template #header>
            <div class="card-header">
              <span>客户沙盘 - {{ selectedCustomer.name }}</span>
              <el-button-group size="small">
                <el-button :type="viewMode === '3d' ? 'primary' : ''" @click="viewMode = '3d'">
                  3D视图
                </el-button>
                <el-button :type="viewMode === 'timeline' ? 'primary' : ''" @click="viewMode = 'timeline'">
                  时间线
                </el-button>
                <el-button :type="viewMode === 'matrix' ? 'primary' : ''" @click="viewMode = 'matrix'">
                  矩阵图
                </el-button>
              </el-button-group>
            </div>
          </template>

          <!-- 3D沙盘视图 -->
          <div v-show="viewMode === '3d'" class="sandbox-3d-view">
            <div ref="sandbox3DRef" style="width: 100%; height: 500px;"></div>
          </div>

          <!-- 时间线视图 -->
          <div v-show="viewMode === 'timeline'" class="sandbox-timeline-view">
            <div ref="timelineChartRef" style="width: 100%; height: 500px;"></div>
          </div>

          <!-- 矩阵图视图 -->
          <div v-show="viewMode === 'matrix'" class="sandbox-matrix-view">
            <div ref="matrixChartRef" style="width: 100%; height: 500px;"></div>
          </div>
        </el-card>

        <!-- 未选择客户时的占位 -->
        <el-empty v-else description="请选择一个客户进行沙盘分析" :image-size="200" />
      </el-col>

      <!-- 右侧：AI分析与建议 -->
      <el-col :span="6">
        <el-card v-if="selectedCustomer" class="ai-insights-card">
          <template #header>
            <div class="card-header">
              <span>AI智能洞察</span>
              <el-icon color="#FFA500"><MagicStick /></el-icon>
            </div>
          </template>

          <el-scrollbar height="600px">
            <!-- 客户画像 -->
            <div class="insight-section">
              <h4><el-icon><User /></el-icon> 客户画像</h4>
              <el-descriptions :column="1" border size="small">
                <el-descriptions-item label="客户等级">
                  <el-tag :type="getLevelType(selectedCustomer.level)">
                    {{ selectedCustomer.level }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="生命周期">
                  {{ selectedCustomer.lifecycle }}
                </el-descriptions-item>
                <el-descriptions-item label="活跃度">
                  <el-progress :percentage="selectedCustomer.activeness" :color="getProgressColor(selectedCustomer.activeness)" />
                </el-descriptions-item>
                <el-descriptions-item label="忠诚度">
                  <el-progress :percentage="selectedCustomer.loyalty" :color="getProgressColor(selectedCustomer.loyalty)" />
                </el-descriptions-item>
              </el-descriptions>
            </div>

            <!-- 价值分析 -->
            <div class="insight-section">
              <h4><el-icon><Money /></el-icon> 价值分析</h4>
              <div class="value-metrics">
                <div class="metric-card">
                  <div class="metric-label">累计价值</div>
                  <div class="metric-value">¥{{ formatNumber(selectedCustomer.totalValue) }}</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">年度贡献</div>
                  <div class="metric-value">¥{{ formatNumber(selectedCustomer.annualValue) }}</div>
                </div>
                <div class="metric-card">
                  <div class="metric-label">预测LTV</div>
                  <div class="metric-value">¥{{ formatNumber(selectedCustomer.predictedLTV) }}</div>
                </div>
              </div>
            </div>

            <!-- 风险评估 -->
            <div class="insight-section">
              <h4><el-icon><Warning /></el-icon> 风险评估</h4>
              <el-alert 
                :title="`流失风险: ${selectedCustomer.churnRisk}%`"
                :type="selectedCustomer.churnRisk > 50 ? 'error' : selectedCustomer.churnRisk > 30 ? 'warning' : 'success'"
                :closable="false"
                show-icon />
              <div class="risk-factors">
                <div v-for="risk in selectedCustomer.riskFactors" :key="risk.factor" class="risk-item">
                  <span>{{ risk.factor }}</span>
                  <el-tag :type="getRiskType(risk.level)" size="small">{{ risk.level }}</el-tag>
                </div>
              </div>
            </div>

            <!-- AI建议 -->
            <div class="insight-section">
              <h4><el-icon><ChatDotRound /></el-icon> AI建议</h4>
              <el-timeline>
                <el-timeline-item
                  v-for="(suggestion, index) in aiSuggestions"
                  :key="index"
                  :type="suggestion.priority === '高' ? 'danger' : suggestion.priority === '中' ? 'warning' : 'primary'"
                  :icon="suggestion.icon">
                  <div class="suggestion-content">
                    <div class="suggestion-title">{{ suggestion.title }}</div>
                    <div class="suggestion-desc">{{ suggestion.description }}</div>
                    <el-button size="small" type="primary" link @click="applySuggestion(suggestion)">
                      立即执行
                    </el-button>
                  </div>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-scrollbar>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
// import 'echarts-gl' // ❌ 移除静态导入
import {
  DataAnalysis, HomeFilled, Refresh, Search, User, Money,
  Warning, ChatDotRound, MagicStick, Download
} from '@element-plus/icons-vue'

console.log('🚀 CustomerSandboxAdvanced 组件开始初始化')

const router = useRouter()

// ✅ 动态导入 echarts-gl，只在需要时加载
let echartsGLLoaded = false
const loadEChartsGL = async () => {
  if (!echartsGLLoaded) {
    console.log('📦 开始加载 ECharts-GL')
    await import('echarts-gl')
    echartsGLLoaded = true
    console.log('✅ ECharts-GL 加载完成')
  }
}

// 返回主页
const goHome = () => {
  router.push('/')
  ElMessage.success('返回主页')
}

// 生成AI策略推荐
const generateStrategy = () => {
  if (!selectedCustomer.value) {
    ElMessage.warning('请先选择一个客户')
    return
  }
  
  ElMessage({
    type: 'success',
    message: `正在为 ${selectedCustomer.value.name} 生成AI策略建议...`,
    duration: 3000
  })
  
  // 模拟AI分析过程
  setTimeout(() => {
    ElMessage({
      type: 'success',
      message: '策略建议已生成！请查看右侧AI智能洞察面板',
      duration: 5000
    })
  }, 2000)
}

// 导出沙盘分析报告
const exportReport = () => {
  if (!selectedCustomer.value) {
    ElMessage.warning('请先选择一个客户')
    return
  }
  
  ElMessage({
    type: 'info',
    message: '正在生成报告...',
    duration: 2000
  })
  
  // 模拟报告生成
  setTimeout(() => {
    const reportContent = `
客户沙盘分析报告
================

客户名称：${selectedCustomer.value.name}
客户等级：${selectedCustomer.value.level}
生命周期：${selectedCustomer.value.lifecycle}
活跃度：${selectedCustomer.value.activeness}%
忠诚度：${selectedCustomer.value.loyalty}%

价值分析
--------
累计价值：¥${formatNumber(selectedCustomer.value.totalValue)}
年度贡献：¥${formatNumber(selectedCustomer.value.annualValue)}
预测LTV：¥${formatNumber(selectedCustomer.value.predictedLTV)}

风险评估
--------
流失风险：${selectedCustomer.value.churnRisk}%
风险因素：
${selectedCustomer.value.riskFactors.map(r => `- ${r.factor}（${r.level}）`).join('\n')}

AI建议
------
${aiSuggestions.value.map((s, i) => `${i + 1}. ${s.title}\n   ${s.description}`).join('\n\n')}

报告生成时间：${new Date().toLocaleString('zh-CN')}
    `
    
    // 创建下载链接
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `客户沙盘分析_${selectedCustomer.value.name}_${new Date().getTime()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    ElMessage({
      type: 'success',
      message: '报告已成功导出！',
      duration: 3000
    })
  }, 1500)
}

// 状态数据
const searchKeyword = ref('')
const selectedCustomer = ref(null)
const viewMode = ref('3d')

// ECharts实例
const sandbox3DRef = ref(null)
const timelineChartRef = ref(null)
const matrixChartRef = ref(null)
let sandbox3DChart = null
let timelineChart = null
let matrixChart = null

// 模拟客户数据
const customers = ref([
  {
    id: 'C001',
    name: '华为技术有限公司',
    level: '战略级',
    lifecycle: '成长期',
    activeness: 85,
    loyalty: 92,
    totalValue: 15800000,
    annualValue: 5200000,
    predictedLTV: 28500000,
    churnRisk: 12,
    riskFactors: [
      { factor: '竞品活跃', level: '低' },
      { factor: '价格敏感度', level: '中' }
    ]
  },
  {
    id: 'C002',
    name: '比亚迪汽车工业有限公司',
    level: '核心级',
    lifecycle: '成熟期',
    activeness: 78,
    loyalty: 85,
    totalValue: 12300000,
    annualValue: 4100000,
    predictedLTV: 22000000,
    churnRisk: 25,
    riskFactors: [
      { factor: '沟通频率下降', level: '中' },
      { factor: '新需求减少', level: '中' }
    ]
  },
  {
    id: 'C003',
    name: '小米集团',
    level: '潜力级',
    lifecycle: '引入期',
    activeness: 92,
    loyalty: 68,
    totalValue: 3200000,
    annualValue: 3200000,
    predictedLTV: 18500000,
    churnRisk: 38,
    riskFactors: [
      { factor: '合作初期', level: '高' },
      { factor: '多家供应商对比', level: '高' }
    ]
  },
  {
    id: 'C004',
    name: '宁德时代新能源科技股份有限公司',
    level: '战略级',
    lifecycle: '成熟期',
    activeness: 88,
    loyalty: 95,
    totalValue: 18500000,
    annualValue: 6200000,
    predictedLTV: 35000000,
    churnRisk: 8,
    riskFactors: [
      { factor: '高度满意', level: '低' }
    ]
  },
  {
    id: 'C005',
    name: '理想汽车',
    level: '核心级',
    lifecycle: '成长期',
    activeness: 81,
    loyalty: 76,
    totalValue: 8900000,
    annualValue: 3800000,
    predictedLTV: 16200000,
    churnRisk: 32,
    riskFactors: [
      { factor: '业务扩张', level: '中' },
      { factor: '成本压力', level: '中' }
    ]
  }
])

// 过滤客户
const filteredCustomers = computed(() => {
  if (!searchKeyword.value) return customers.value
  return customers.value.filter(c => 
    c.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

// AI建议数据
const aiSuggestions = computed(() => {
  if (!selectedCustomer.value) return []
  
  return [
    {
      icon: 'StarFilled',
      priority: '高',
      title: '推荐高价值产品',
      description: `基于${selectedCustomer.value.name}的采购历史，建议推荐智能拧紧系统升级方案，预计可提升20%订单额`
    },
    {
      icon: 'Bell',
      priority: '中',
      title: '定期回访提醒',
      description: '距离上次回访已7天，建议在3天内安排技术交流会议'
    },
    {
      icon: 'TrendCharts',
      priority: '中',
      title: '需求趋势预测',
      description: 'AI预测该客户在Q2将有新产线建设需求，建议提前准备解决方案'
    },
    {
      icon: 'Warning',
      priority: '低',
      title: '关注竞品动态',
      description: '检测到竞争对手最近联系该客户，建议加强沟通频率'
    }
  ]
})

// 选择客户
const selectCustomer = (customer) => {
  selectedCustomer.value = customer
  console.log(`👤 选择客户: ${customer.name}`)
  // 使用 setTimeout 替代 nextTick，确保容器完成布局
  setTimeout(() => {
    if (viewMode.value === '3d') {
      render3DSandbox()
    } else if (viewMode.value === 'timeline') {
      renderTimeline()
    } else if (viewMode.value === 'matrix') {
      renderMatrix()
    }
  }, 300)
}

// 渲染3D沙盘
const render3DSandbox = async (retryCount = 0) => {
  if (!sandbox3DRef.value) {
    console.log('❌ 3D沙盘: 容器引用不存在')
    return
  }
  
  // 检查容器是否可见（v-show 导致容器存在但不可见）
  const container = sandbox3DRef.value
  if (container.offsetParent === null) {
    console.log(`⏳ 3D沙盘: 容器被隐藏，等待显示 (重试 ${retryCount + 1}/10)`)
    // 容器被隐藏（display: none），最多重试 10 次
    if (retryCount < 10) {
      setTimeout(() => render3DSandbox(retryCount + 1), 300)
    } else {
      console.log('⚠️ 3D沙盘: 容器始终被隐藏，停止重试')
    }
    return
  }
  
  // 检查容器尺寸
  const width = container.clientWidth
  const height = container.clientHeight
  
  console.log(`📏 3D沙盘: 容器尺寸 ${width}×${height}`)
  
  if (!width || !height) {
    console.log(`⏳ 3D沙盘: 容器尺寸为0，等待布局 (重试 ${retryCount + 1}/5)`)
    // 最多重试5次，避免无限循环
    if (retryCount < 5) {
      setTimeout(() => render3DSandbox(retryCount + 1), 200)
    } else {
      console.log('⚠️ 3D沙盘: 容器尺寸始终为0，停止重试')
    }
    return
  }
  
  // ✅ 在初始化前加载 ECharts-GL
  await loadEChartsGL()
  
  try {
    // 在初始化前最后一次检查尺寸
    const finalWidth = container.clientWidth
    const finalHeight = container.clientHeight
    
    if (!finalWidth || !finalHeight) {
      console.log('⚠️ 3D沙盘: 初始化前尺寸变为0，取消渲染')
      return
    }
    
    console.log(`✅ 3D沙盘: 开始初始化，尺寸 ${finalWidth}×${finalHeight}`)
    
    if (!sandbox3DChart) {
      // 首次初始化
      sandbox3DChart = echarts.init(container)
      console.log('✅ 3D沙盘: 图表实例已创建')
    } else {
      // 容器尺寸改变时需要resize - 再次检查尺寸避免警告
      const currentWidth = container.clientWidth
      const currentHeight = container.clientHeight
      if (currentWidth > 0 && currentHeight > 0) {
        sandbox3DChart.resize()
        console.log(`✅ 3D沙盘: 图表已调整尺寸 ${currentWidth}×${currentHeight}`)
      } else {
        console.log('⚠️ 3D沙盘: resize前尺寸为0，跳过')
        return // 尺寸为0，跳过resize
      }
    }

    const option = {
      tooltip: {},
      backgroundColor: '#f8f9fa',
      grid3D: {
        viewControl: {
          projection: 'perspective'
        }
      },
      xAxis3D: { type: 'category', data: ['Q1', 'Q2', 'Q3', 'Q4'] },
      yAxis3D: { type: 'value', name: '销售额(万元)' },
      zAxis3D: { type: 'value', name: '活跃度' },
      series: [{
        type: 'bar3D',
        data: [
          [0, 520, 85],
          [1, 480, 78],
          [2, 550, 82],
          [3, 620, 88]
        ],
        shading: 'lambert',
        label: {
          show: false
        },
        itemStyle: {
          color: '#1890ff'
        }
      }]
    }

    // setOption 前最后检查一次尺寸
    const preSetWidth = container.clientWidth
    const preSetHeight = container.clientHeight
    if (!preSetWidth || !preSetHeight) {
      console.log('⚠️ 3D沙盘: setOption前尺寸为0，取消设置')
      return
    }

    console.log('✅ 3D沙盘: 开始设置option')
    sandbox3DChart.setOption(option)
    console.log('✅ 3D沙盘: 渲染完成')
  } catch (error) {
    console.error('❌ 3D沙盘渲染失败:', error)
  }
}

// 渲染时间线
const renderTimeline = (retryCount = 0) => {
  if (!timelineChartRef.value) {
    console.log('❌ 时间线: 容器引用不存在')
    return
  }
  
  // 检查容器是否可见（v-show 导致容器存在但不可见）
  const container = timelineChartRef.value
  if (container.offsetParent === null) {
    console.log(`⏳ 时间线: 容器被隐藏，等待显示 (重试 ${retryCount + 1}/10)`)
    // 容器被隐藏（display: none），最多重试 10 次
    if (retryCount < 10) {
      setTimeout(() => renderTimeline(retryCount + 1), 300)
    } else {
      console.log('⚠️ 时间线: 容器始终被隐藏，停止重试')
    }
    return
  }
  
  // 检查容器尺寸
  const width = container.clientWidth
  const height = container.clientHeight
  
  console.log(`📏 时间线: 容器尺寸 ${width}×${height}`)
  
  if (!width || !height) {
    console.log(`⏳ 时间线: 容器尺寸为0，等待布局 (重试 ${retryCount + 1}/5)`)
    // 最多重试5次，避免无限循环
    if (retryCount < 5) {
      setTimeout(() => renderTimeline(retryCount + 1), 200)
    } else {
      console.log('⚠️ 时间线: 容器尺寸始终为0，停止重试')
    }
    return
  }
  
  try {
    // 在初始化前最后一次检查尺寸
    const finalWidth = container.clientWidth
    const finalHeight = container.clientHeight
    
    if (!finalWidth || !finalHeight) {
      console.log('⚠️ 时间线: 初始化前尺寸变为0，取消渲染')
      return
    }
    
    console.log(`✅ 时间线: 开始初始化，尺寸 ${finalWidth}×${finalHeight}`)
    
    if (!timelineChart) {
      timelineChart = echarts.init(container)
      console.log('✅ 时间线: 图表实例已创建')
    } else {
      // 容器尺寸改变时需要resize - 再次检查尺寸避免警告
      const currentWidth = container.clientWidth
      const currentHeight = container.clientHeight
      if (currentWidth > 0 && currentHeight > 0) {
        timelineChart.resize()
        console.log(`✅ 时间线: 图表已调整尺寸 ${currentWidth}×${currentHeight}`)
      } else {
        console.log('⚠️ 时间线: resize前尺寸为0，跳过')
        return // 尺寸为0，跳过resize
      }
    }

    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['销售额', '活跃度', '满意度']
      },
      xAxis: {
        type: 'category',
        data: ['1月', '2月', '3月', '4月', '5月', '6月']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '销售额',
          type: 'line',
          data: [120, 132, 101, 134, 90, 230],
          smooth: true,
          areaStyle: { opacity: 0.3 }
        },
        {
          name: '活跃度',
          type: 'line',
          data: [220, 182, 191, 234, 290, 330],
          smooth: true,
          areaStyle: { opacity: 0.3 }
        },
        {
          name: '满意度',
          type: 'line',
          data: [150, 232, 201, 154, 190, 330],
          smooth: true,
          areaStyle: { opacity: 0.3 }
        }
      ]
    }

    timelineChart.setOption(option)
  } catch (error) {
    console.error('时间线图表渲染失败:', error)
  }
}

// 渲染矩阵图
const renderMatrix = (retryCount = 0) => {
  if (!matrixChartRef.value) return
  
  // 检查容器是否可见（v-show 导致容器存在但不可见）
  const container = matrixChartRef.value
  if (container.offsetParent === null) {
    // 容器被隐藏（display: none），最多重试 10 次
    if (retryCount < 10) {
      setTimeout(() => renderMatrix(retryCount + 1), 300)
    }
    return
  }
  
  // 检查容器尺寸
  const width = container.clientWidth
  const height = container.clientHeight
  
  if (!width || !height) {
    // 最多重试5次，避免无限循环
    if (retryCount < 5) {
      setTimeout(() => renderMatrix(retryCount + 1), 200)
    }
    return
  }
  
  try {
    if (!matrixChart) {
      matrixChart = echarts.init(container)
    } else {
      // 容器尺寸改变时需要resize - 再次检查尺寸避免警告
      const currentWidth = container.clientWidth
      const currentHeight = container.clientHeight
      if (currentWidth > 0 && currentHeight > 0) {
        matrixChart.resize()
      } else {
        return // 尺寸为0，跳过resize
      }
    }

    const option = {
      tooltip: {},
      grid: {
        left: 50,
        right: 50,
        top: 50,
        bottom: 50
      },
      xAxis: {
        type: 'value',
        name: '客户价值',
        min: 0,
        max: 100
      },
      yAxis: {
        type: 'value',
        name: '流失风险',
        min: 0,
        max: 100
      },
      series: [{
        type: 'scatter',
        symbolSize: 20,
        data: customers.value.map(c => [
          (c.totalValue / 20000000) * 100,
          c.churnRisk,
          c.name
        ]),
        itemStyle: {
          color: '#1890ff'
        },
        emphasis: {
          label: {
            show: true,
            formatter: (param) => param.data[2],
            position: 'top'
          }
        }
      }]
    }

    matrixChart.setOption(option)
  } catch (error) {
    console.error('矩阵图表渲染失败:', error)
  }
}

// 刷新分析
const refreshAnalysis = () => {
  ElMessage.success('正在刷新分析数据...')
  if (selectedCustomer.value) {
    selectCustomer(selectedCustomer.value)
  }
}

// 应用建议
const applySuggestion = (suggestion) => {
  ElMessage.success(`正在执行: ${suggestion.title}`)
}

// 工具函数
const formatNumber = (num) => {
  return (num / 10000).toFixed(1) + '万'
}

const getLevelType = (level) => {
  const types = {
    '战略级': 'danger',
    '核心级': 'warning',
    '潜力级': 'success',
    '普通级': 'info'
  }
  return types[level] || 'info'
}

const getProgressColor = (percentage) => {
  if (percentage >= 80) return '#67c23a'
  if (percentage >= 60) return '#e6a23c'
  return '#f56c6c'
}

const getRiskType = (level) => {
  const types = {
    '高': 'danger',
    '中': 'warning',
    '低': 'success'
  }
  return types[level] || 'info'
}

// ✅ 标记是否已经初始化过
const initialized = ref(false)

// ✅ 监听组件可见性，只在变为可见时才初始化
const checkAndInit = () => {
  if (initialized.value) {
    console.log('⏭️ 组件已初始化，跳过')
    return
  }
  
  // 检查组件根元素是否可见
  const rootEl = document.querySelector('.customer-sandbox-advanced')
  if (!rootEl) {
    console.log('❌ 未找到组件根元素')
    return
  }
  
  if (rootEl.offsetParent === null) {
    console.log('⏳ 组件被隐藏，等待显示后初始化')
    return
  }
  
  console.log('🎉 组件已显示，开始初始化！')
  initialized.value = true
  
  // 延迟初始化，确保 DOM 容器完成布局
  setTimeout(() => {
    if (customers.value.length > 0) {
      selectCustomer(customers.value[0])
    }
  }, 500)
}

// 监听视图模式切换
watch(viewMode, (newMode) => {
  console.log(`🔄 视图模式切换为: ${newMode}`)
  // 使用 setTimeout 确保容器已完成渲染和布局
  setTimeout(() => {
    if (newMode === '3d') {
      render3DSandbox()
    } else if (newMode === 'timeline') {
      renderTimeline()
    } else if (newMode === 'matrix') {
      renderMatrix()
    }
  }, 300)
}, { flush: 'post' })

// 挂载时尝试初始化（如果组件可见）
onMounted(() => {
  console.log('📍 组件已挂载，检查可见性')
  checkAndInit()
  
  // ✅ 使用 MutationObserver 监听父元素的 style 变化
  const rootEl = document.querySelector('.customer-sandbox-advanced')
  if (rootEl?.parentElement) {
    const observer = new MutationObserver(() => {
      console.log('🔍 检测到父元素变化，检查可见性')
      checkAndInit()
    })
    
    observer.observe(rootEl.parentElement, {
      attributes: true,
      attributeFilter: ['style']
    })
    
    // 组件卸载时停止观察
    onUnmounted(() => {
      observer.disconnect()
    })
  }
  
  // ✅ 备用方案：定时检查（前3秒每300ms检查一次）
  let checkCount = 0
  const checkInterval = setInterval(() => {
    checkCount++
    if (checkCount > 10 || initialized.value) {
      clearInterval(checkInterval)
      return
    }
    checkAndInit()
  }, 300)
})
</script>

<style scoped>
.customer-sandbox-advanced {
  padding: 20px;
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
  gap: 16px;
  align-items: center;
}

.header-left h2 {
  margin: 0;
  font-size: 24px;
  color: #2c3e50;
}

.header-left p {
  margin: 4px 0 0 0;
  color: #7f8c8d;
  font-size: 14px;
}

.header-right {
  display: flex;
  gap: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 客户选择卡片 */
.customer-selector-card {
  height: 100%;
}

.customer-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  margin-bottom: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.customer-item:hover {
  background: #f5f7fa;
  border-color: #1890ff;
}

.customer-item.active {
  background: #e6f7ff;
  border-color: #1890ff;
}

.customer-info {
  flex: 1;
}

.customer-name {
  font-weight: 600;
  margin-bottom: 4px;
}

.customer-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.customer-value {
  font-size: 12px;
  color: #f39c12;
  font-weight: 600;
}

/* 沙盘可视化 */
.sandbox-visualization-card {
  height: 100%;
  min-height: 600px;
}

/* ===== 响应式设计 ===== */

/* 平板设备 (768px - 1024px) */
@media screen and (max-width: 1024px) {
  .customer-sandbox-advanced {
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
    min-width: 120px;
  }

  .el-col {
    width: 100% !important;
    max-width: 100% !important;
  }

  .sandbox-visualization-card {
    min-height: 400px;
  }
}

/* 手机设备 (最大 767px) */
@media screen and (max-width: 767px) {
  .customer-sandbox-advanced {
    padding: 8px;
  }

  .header-left {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .header-left .el-icon {
    font-size: 24px !important;
  }

  .header-left h2 {
    font-size: 18px;
  }

  .header-left p {
    font-size: 12px;
  }

  .header-right {
    width: 100%;
    flex-direction: column;
    gap: 8px;
  }

  .header-right .el-button {
    width: 100%;
    justify-content: center;
  }

  .el-row {
    display: flex;
    flex-direction: column;
  }

  .el-col {
    width: 100% !important;
    max-width: 100% !important;
    margin-bottom: 12px;
  }

  .customer-item {
    padding: 10px;
  }

  .customer-name {
    font-size: 14px;
  }

  .customer-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .sandbox-visualization-card {
    min-height: 300px;
  }

  #sandbox-3d,
  #timeline-chart,
  #matrix-chart {
    height: 300px !important;
  }

  .ai-suggestions-card .el-card__body {
    padding: 12px;
  }

  .suggestion-item {
    padding: 12px;
  }

  .suggestion-content h4 {
    font-size: 14px;
  }

  .suggestion-content p {
    font-size: 12px;
  }
}

/* 小屏手机 (最大 480px) */
@media screen and (max-width: 480px) {
  .header-card .el-card__body {
    padding: 12px;
  }

  .header-left h2 {
    font-size: 16px;
  }

  .header-left p {
    font-size: 11px;
  }

  .header-right .el-button {
    font-size: 13px;
    padding: 8px 12px;
  }

  .customer-item {
    padding: 8px;
    margin-bottom: 6px;
  }

  .customer-name {
    font-size: 13px;
  }

  .customer-value {
    font-size: 11px;
  }

  .sandbox-visualization-card {
    min-height: 250px;
  }

  #sandbox-3d,
  #timeline-chart,
  #matrix-chart {
    height: 250px !important;
  }
}


/* AI洞察卡片 */
.ai-insights-card {
  height: 100%;
}

.insight-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #ecf0f1;
}

.insight-section:last-child {
  border-bottom: none;
}

.insight-section h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 12px 0;
  color: #2c3e50;
}

.value-metrics {
  display: grid;
  gap: 12px;
}

.metric-card {
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
}

.metric-label {
  font-size: 12px;
  opacity: 0.9;
  margin-bottom: 4px;
}

.metric-value {
  font-size: 20px;
  font-weight: 600;
}

.risk-factors {
  margin-top: 12px;
}

.risk-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed #ecf0f1;
}

.suggestion-content {
  padding: 8px 0;
}

.suggestion-title {
  font-weight: 600;
  margin-bottom: 4px;
}

.suggestion-desc {
  font-size: 12px;
  color: #7f8c8d;
  margin-bottom: 8px;
}

.mb-3 {
  margin-bottom: 12px;
}
</style>
