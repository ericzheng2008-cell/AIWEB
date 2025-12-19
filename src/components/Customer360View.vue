<template>
  <div class="customer-360-view">
    <!-- 客户基本信息卡片 -->
    <el-card class="customer-header">
      <div class="customer-info-section">
        <div class="customer-avatar">
          <el-avatar :size="80" :src="customer.avatar">
            {{ customer.name?.[0] || 'C' }}
          </el-avatar>
        </div>
        
        <div class="customer-details">
          <h2>{{ customer.name }}</h2>
          <div class="customer-meta">
            <el-tag :type="getLifecycleType(customer.lifecycle)">
              {{ getLifecycleName(customer.lifecycle) }}
            </el-tag>
            <el-tag type="info">{{ customer.customerLevel }}</el-tag>
            <el-tag v-if="customer.industry">{{ customer.industry }}</el-tag>
          </div>
          
          <!-- 标签云 -->
          <div class="tag-cloud">
            <el-tag 
              v-for="tag in customer.tags" 
              :key="tag"
              size="small"
              effect="plain"
              class="tag-item"
            >
              {{ tag }}
            </el-tag>
          </div>
        </div>

        <div class="customer-actions">
          <el-button @click="goHome">
            <el-icon><HomeFilled /></el-icon>
            返回主页
          </el-button>
          <el-button type="primary" @click="openSandbox">
            <el-icon><DataAnalysis /></el-icon>
            进入沙盘分析
          </el-button>
          <el-button @click="generateStrategy">
            <el-icon><MagicStick /></el-icon>
            策略推荐
          </el-button>
          <el-button @click="exportReport">
            <el-icon><Download /></el-icon>
            导出报告
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 核心KPI指标 -->
    <el-row :gutter="16" class="kpi-section">
      <el-col :span="6">
        <el-card>
          <div class="kpi-card">
            <div class="kpi-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <el-icon :size="32"><Wallet /></el-icon>
            </div>
            <div class="kpi-content">
              <div class="kpi-label">预测CLV</div>
              <div class="kpi-value">¥{{ (customer.predictedCLV / 10000).toFixed(1) }}万</div>
              <div class="kpi-trend">
                <el-icon :color="customer.clvTrend > 0 ? '#67C23A' : '#F56C6C'">
                  <component :is="customer.clvTrend > 0 ? 'Top' : 'Bottom'" />
                </el-icon>
                {{ customer.clvTrend > 0 ? '+' : '' }}{{ customer.clvTrend }}%
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          <div class="kpi-card">
            <div class="kpi-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
              <el-icon :size="32"><Warning /></el-icon>
            </div>
            <div class="kpi-content">
              <div class="kpi-label">流失风险</div>
              <div class="kpi-value">{{ customer.churnRisk }}%</div>
              <el-tag :type="getRiskType(customer.churnRisk)" size="small">
                {{ getRiskLevel(customer.churnRisk) }}
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          <div class="kpi-card">
            <div class="kpi-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
              <el-icon :size="32"><TrendCharts /></el-icon>
            </div>
            <div class="kpi-content">
              <div class="kpi-label">转化概率</div>
              <div class="kpi-value">{{ customer.conversionProbability }}%</div>
              <el-progress 
                :percentage="customer.conversionProbability" 
                :show-text="false"
                :stroke-width="8"
                :color="getProgressColor(customer.conversionProbability)"
              />
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="6">
        <el-card>
          <div class="kpi-card">
            <div class="kpi-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
              <el-icon :size="32"><ShoppingCart /></el-icon>
            </div>
            <div class="kpi-content">
              <div class="kpi-label">总消费金额</div>
              <div class="kpi-value">¥{{ (customer.totalSpent / 10000).toFixed(1) }}万</div>
              <div class="kpi-subtitle">{{ customer.orderCount }}个订单</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 主内容区域 -->
    <el-row :gutter="16" class="main-content">
      <!-- 左侧：交易与互动时间轴 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>📅 行为时间轴</span>
              <el-radio-group v-model="timelineFilter" size="small">
                <el-radio-button label="all">全部</el-radio-button>
                <el-radio-button label="transaction">交易</el-radio-button>
                <el-radio-button label="interaction">互动</el-radio-button>
              </el-radio-group>
            </div>
          </template>

          <el-timeline>
            <el-timeline-item
              v-for="event in filteredTimeline"
              :key="event.id"
              :timestamp="event.time"
              :type="getEventType(event.type)"
              :icon="getEventIcon(event.type)"
            >
              <div class="timeline-content">
                <div class="timeline-title">{{ event.title }}</div>
                <div class="timeline-desc">{{ event.description }}</div>
                <el-tag v-if="event.channel" size="small">{{ event.channel }}</el-tag>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>

      <!-- 右侧：RFM分析与CLV趋势 -->
      <el-col :span="12">
        <!-- RFM分析 -->
        <el-card class="mb-3">
          <template #header>
            <span>📊 RFM分层分析</span>
          </template>
          
          <div class="rfm-section">
            <div class="rfm-item">
              <div class="rfm-label">最近购买（Recency）</div>
              <el-progress 
                :percentage="customer.rfm.recency" 
                :color="getProgressColor(customer.rfm.recency)"
              >
                <span>{{ customer.rfm.recency }}分</span>
              </el-progress>
              <div class="rfm-detail">最近购买：{{ customer.lastPurchaseDays }}天前</div>
            </div>

            <div class="rfm-item">
              <div class="rfm-label">购买频率（Frequency）</div>
              <el-progress 
                :percentage="customer.rfm.frequency" 
                :color="getProgressColor(customer.rfm.frequency)"
              >
                <span>{{ customer.rfm.frequency }}分</span>
              </el-progress>
              <div class="rfm-detail">购买次数：{{ customer.orderCount }}次</div>
            </div>

            <div class="rfm-item">
              <div class="rfm-label">消费金额（Monetary）</div>
              <el-progress 
                :percentage="customer.rfm.monetary" 
                :color="getProgressColor(customer.rfm.monetary)"
              >
                <span>{{ customer.rfm.monetary }}分</span>
              </el-progress>
              <div class="rfm-detail">总消费：¥{{ (customer.totalSpent / 10000).toFixed(1) }}万</div>
            </div>

            <div class="rfm-summary">
              <el-tag :type="getRFMType(customer.rfmSegment)" size="large">
                {{ customer.rfmSegment }}
              </el-tag>
            </div>
          </div>
        </el-card>

        <!-- CLV趋势图 -->
        <el-card>
          <template #header>
            <span>📈 CLV预测趋势</span>
          </template>
          
          <div class="clv-chart">
            <div 
              v-for="(month, index) in customer.clvTrend" 
              :key="index"
              class="clv-bar-item"
            >
              <div class="clv-bar-container">
                <div 
                  class="clv-bar"
                  :style="{ 
                    height: (month.value / customer.maxCLV * 100) + '%',
                    background: index < 6 ? '#409EFF' : '#67C23A'
                  }"
                  :title="'CLV: ¥' + (month.value / 10000).toFixed(1) + '万'"
                />
              </div>
              <div class="clv-label">{{ month.month }}</div>
            </div>
          </div>
          <div class="chart-legend">
            <span><span class="legend-dot" style="background: #409EFF;"></span>历史CLV</span>
            <span><span class="legend-dot" style="background: #67C23A;"></span>预测CLV</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- AI智能洞察 -->
    <el-card class="ai-insights">
      <template #header>
        <span>🤖 AI智能洞察与建议</span>
      </template>

      <el-row :gutter="16">
        <el-col :span="8">
          <div class="insight-section">
            <h4>🎯 战略建议</h4>
            <div 
              v-for="insight in customer.strategicInsights" 
              :key="insight.id"
              class="insight-item"
            >
              <div class="insight-header">
                <el-icon :color="insight.color"><Star /></el-icon>
                <span class="insight-title">{{ insight.title }}</span>
              </div>
              <div class="insight-content">{{ insight.content }}</div>
              <el-tag :type="insight.priority" size="small">{{ insight.priorityText }}</el-tag>
            </div>
          </div>
        </el-col>

        <el-col :span="8">
          <div class="insight-section">
            <h4>⚡ 运营建议</h4>
            <div 
              v-for="insight in customer.operationalInsights" 
              :key="insight.id"
              class="insight-item"
            >
              <div class="insight-header">
                <el-icon :color="insight.color"><Tools /></el-icon>
                <span class="insight-title">{{ insight.title }}</span>
              </div>
              <div class="insight-content">{{ insight.content }}</div>
              <el-button size="small" @click="applyInsight(insight)">应用建议</el-button>
            </div>
          </div>
        </el-col>

        <el-col :span="8">
          <div class="insight-section">
            <h4>⚠️ 风险预警</h4>
            <div 
              v-for="alert in customer.alerts" 
              :key="alert.id"
              class="insight-item alert"
            >
              <div class="insight-header">
                <el-icon :color="alert.color"><Warning /></el-icon>
                <span class="insight-title">{{ alert.title }}</span>
              </div>
              <div class="insight-content">{{ alert.content }}</div>
              <el-tag :type="alert.severity" size="small">{{ alert.severityText }}</el-tag>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  DataAnalysis, MagicStick, Download, Wallet, Warning,
  TrendCharts, ShoppingCart, Star, Tools, Top, Bottom, HomeFilled
} from '@element-plus/icons-vue'

const router = useRouter()

const props = defineProps({
  customerId: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['open-sandbox', 'strategy-recommend'])

// 时间轴筛选
const timelineFilter = ref('all')

// 客户数据（示例数据，实际应从Store获取）
const customer = ref({
  id: props.customerId,
  name: '明升汽车制造有限公司',
  avatar: '',
  lifecycle: 'active',
  customerLevel: '高价值客户',
  industry: '汽车制造',
  tags: ['高价值', '活跃', '偏好拧紧工具', '流失风险低', '决策周期短'],
  
  // KPI指标
  predictedCLV: 120000,
  clvTrend: 15,
  churnRisk: 18,
  conversionProbability: 85,
  totalSpent: 850000,
  orderCount: 24,
  lastPurchaseDays: 12,
  
  // RFM分析
  rfm: {
    recency: 85,
    frequency: 90,
    monetary: 95
  },
  rfmSegment: '重要价值客户',
  
  // CLV趋势（12个月）
  clvTrend: [
    { month: '7月', value: 80000 },
    { month: '8月', value: 85000 },
    { month: '9月', value: 90000 },
    { month: '10月', value: 95000 },
    { month: '11月', value: 100000 },
    { month: '12月', value: 105000 },
    { month: '1月', value: 110000 },
    { month: '2月', value: 115000 },
    { month: '3月', value: 120000 },
    { month: '4月', value: 125000 },
    { month: '5月', value: 130000 },
    { month: '6月', value: 135000 }
  ],
  maxCLV: 135000,
  
  // 时间轴事件
  timeline: [
    {
      id: '1',
      time: '2025-12-16 14:30',
      type: 'transaction',
      title: '完成订单 #2025121601',
      description: '购买数字扭矩扳手 x 5，金额 ¥35,000',
      channel: 'APP'
    },
    {
      id: '2',
      time: '2025-12-15 10:20',
      type: 'interaction',
      title: '客服咨询',
      description: '咨询套筒工具选型问题，情绪：正面',
      channel: '客服电话'
    },
    {
      id: '3',
      time: '2025-12-10 09:00',
      type: 'interaction',
      title: '产品浏览',
      description: '浏览拧紧数据采集系统详情页，停留8分钟',
      channel: '网站'
    },
    {
      id: '4',
      time: '2025-12-05 15:45',
      type: 'transaction',
      title: '完成订单 #2025120501',
      description: '购买套筒工具包 x 2，金额 ¥28,000',
      channel: 'APP'
    },
    {
      id: '5',
      time: '2025-11-28 11:30',
      type: 'interaction',
      title: '邮件互动',
      description: '打开营销邮件并点击产品链接',
      channel: '邮件'
    }
  ],
  
  // AI洞察
  strategicInsights: [
    {
      id: 's1',
      title: '推荐高端产品',
      content: '客户消费能力强且偏好高品质产品，建议推荐企业级拧紧解决方案',
      color: '#409EFF',
      priority: 'success',
      priorityText: '高优先级'
    },
    {
      id: 's2',
      title: '建立长期合作',
      content: '客户稳定性高，建议签订年度合作协议，提供专属服务',
      color: '#67C23A',
      priority: 'success',
      priorityText: '高优先级'
    }
  ],
  
  operationalInsights: [
    {
      id: 'o1',
      title: '定期回访',
      content: '建议每月定期回访，了解使用情况并推荐新品',
      color: '#E6A23C'
    },
    {
      id: 'o2',
      title: '技术培训',
      content: '提供免费技术培训，提升客户粘性',
      color: '#409EFF'
    }
  ],
  
  alerts: [
    {
      id: 'a1',
      title: '购买周期延长',
      content: '距离上次购买已12天，注意跟进',
      color: '#E6A23C',
      severity: 'warning',
      severityText: '中风险'
    }
  ]
})

// 过滤后的时间轴
const filteredTimeline = computed(() => {
  if (timelineFilter.value === 'all') {
    return customer.value.timeline
  }
  return customer.value.timeline.filter(e => e.type === timelineFilter.value)
})

// 辅助方法
const getLifecycleType = (lifecycle) => {
  const types = {
    new: 'info',
    active: 'success',
    dormant: 'warning',
    churn: 'danger'
  }
  return types[lifecycle] || 'info'
}

const getLifecycleName = (lifecycle) => {
  const names = {
    new: '新客户',
    active: '活跃客户',
    dormant: '休眠客户',
    churn: '流失客户'
  }
  return names[lifecycle] || '未知'
}

const getRiskType = (risk) => {
  if (risk < 30) return 'success'
  if (risk < 60) return 'warning'
  return 'danger'
}

const getRiskLevel = (risk) => {
  if (risk < 30) return '低风险'
  if (risk < 60) return '中风险'
  return '高风险'
}

const getProgressColor = (percentage) => {
  if (percentage >= 80) return '#67C23A'
  if (percentage >= 50) return '#E6A23C'
  return '#F56C6C'
}

const getRFMType = (segment) => {
  const types = {
    '重要价值客户': 'success',
    '重要保持客户': 'success',
    '重要挽留客户': 'warning',
    '重要发展客户': 'info',
    '一般价值客户': 'info',
    '一般保持客户': '',
    '一般挽留客户': 'warning',
    '一般发展客户': 'info'
  }
  return types[segment] || ''
}

const getEventType = (type) => {
  return type === 'transaction' ? 'success' : 'primary'
}

const getEventIcon = (type) => {
  return type === 'transaction' ? ShoppingCart : TrendCharts
}

// 操作方法
const goHome = () => {
  router.push('/')
  ElMessage.success('返回主页')
}

const openSandbox = () => {
  emit('open-sandbox', customer.value)
}

const generateStrategy = () => {
  emit('strategy-recommend', customer.value)
  ElMessage.success('正在生成AI策略建议...')
}

const exportReport = () => {
  ElMessage.success('报告导出中...')
}

const applyInsight = (insight) => {
  ElMessage.success(`正在应用建议：${insight.title}`)
}
</script>

<style scoped lang="scss">
.customer-360-view {
  padding: 20px;
}

.customer-header {
  margin-bottom: 20px;
}

.customer-info-section {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.customer-avatar {
  flex-shrink: 0;
}

.customer-details {
  flex: 1;
  
  h2 {
    margin: 0 0 12px 0;
    font-size: 24px;
  }
  
  .customer-meta {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
  }
  
  .tag-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
}

.customer-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.kpi-section {
  margin-bottom: 20px;
}

.kpi-card {
  display: flex;
  gap: 16px;
  
  .kpi-icon {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
  }
  
  .kpi-content {
    flex: 1;
    
    .kpi-label {
      font-size: 12px;
      color: #909399;
      margin-bottom: 4px;
    }
    
    .kpi-value {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 4px;
    }
    
    .kpi-trend {
      font-size: 14px;
      color: #67C23A;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .kpi-subtitle {
      font-size: 12px;
      color: #909399;
      margin-top: 4px;
    }
  }
}

.main-content {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timeline-content {
  .timeline-title {
    font-weight: bold;
    margin-bottom: 4px;
  }
  
  .timeline-desc {
    font-size: 14px;
    color: #606266;
    margin-bottom: 8px;
  }
}

.rfm-section {
  .rfm-item {
    margin-bottom: 20px;
    
    .rfm-label {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 8px;
    }
    
    .rfm-detail {
      font-size: 12px;
      color: #909399;
      margin-top: 4px;
    }
  }
  
  .rfm-summary {
    text-align: center;
    padding: 16px 0;
    border-top: 1px solid #EBEEF5;
  }
}

.clv-chart {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 180px;
  padding: 10px 0;
  
  .clv-bar-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .clv-bar-container {
      width: 100%;
      height: 150px;
      position: relative;
      display: flex;
      align-items: flex-end;
      
      .clv-bar {
        width: 100%;
        border-radius: 4px 4px 0 0;
        transition: all 0.3s;
        cursor: pointer;
        
        &:hover {
          opacity: 0.8;
        }
      }
    }
    
    .clv-label {
      font-size: 11px;
      color: #909399;
      margin-top: 4px;
    }
  }
}

.chart-legend {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 16px;
  font-size: 14px;
  
  .legend-dot {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    margin-right: 6px;
  }
}

.ai-insights {
  .insight-section {
    h4 {
      margin: 0 0 16px 0;
      font-size: 16px;
    }
    
    .insight-item {
      padding: 12px;
      background: #f5f7fa;
      border-radius: 8px;
      margin-bottom: 12px;
      
      &.alert {
        background: #fef0f0;
      }
      
      .insight-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        
        .insight-title {
          font-weight: bold;
          font-size: 14px;
        }
      }
      
      .insight-content {
        font-size: 13px;
        color: #606266;
        margin-bottom: 8px;
        line-height: 1.5;
      }
    }
  }
}

.mb-3 {
  margin-bottom: 16px;
}
</style>
