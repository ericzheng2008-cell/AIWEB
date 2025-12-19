<template>
  <div class="data-quality-monitor">
    <div class="view-header">
      <h2>📊 数据质量监控</h2>
      <div class="header-actions">
        <el-button @click="refreshData" :loading="refreshing">
          <el-icon><Refresh /></el-icon>
          刷新数据
        </el-button>
        <el-button @click="showSettings">
          <el-icon><Setting /></el-icon>
          配置规则
        </el-button>
      </div>
    </div>

    <!-- 数据质量总览 -->
    <el-row :gutter="20" class="mb-4">
      <el-col :span="6" v-for="metric in qualityOverview" :key="metric.id">
        <el-card shadow="hover" class="quality-metric-card">
          <div class="metric-header">
            <el-icon :size="32" :color="metric.color">
              <component :is="metric.icon" />
            </el-icon>
            <div class="metric-info">
              <div class="metric-title">{{ metric.title }}</div>
              <div class="metric-value" :style="{ color: metric.color }">
                {{ metric.value }}{{ metric.suffix }}
              </div>
            </div>
          </div>
          <el-progress 
            :percentage="metric.score" 
            :color="getQualityColor(metric.score)"
            :stroke-width="8"
          />
          <div class="metric-trend">
            <span :class="metric.trend > 0 ? 'positive' : 'negative'">
              {{ metric.trend > 0 ? '↑' : '↓' }} {{ Math.abs(metric.trend) }}%
            </span>
            环比上月
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据源同步状态 -->
    <el-row :gutter="20" class="mb-4">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>📡 数据源同步状态</span>
              <el-button text @click="refreshDataSources">
                <el-icon><Refresh /></el-icon>
              </el-button>
            </div>
          </template>
          <el-table :data="dataSources" style="width: 100%">
            <el-table-column prop="name" label="数据源" width="120" />
            <el-table-column label="同步频率" width="100">
              <template #default="{ row }">
                <el-tag :type="getIntervalType(row.syncInterval)" size="small">
                  {{ row.syncInterval }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="最后同步" width="160">
              <template #default="{ row }">
                <span v-if="row.lastSync">{{ formatTime(row.lastSync) }}</span>
                <el-tag v-else type="danger" size="small">未同步</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template #default="{ row }">
                <el-badge 
                  :value="row.status === 'syncing' ? '同步中' : ''" 
                  :type="row.status === 'success' ? 'success' : 'warning'"
                >
                  <el-icon :color="getStatusColor(row.status)" :size="20">
                    <component :is="getStatusIcon(row.status)" />
                  </el-icon>
                </el-badge>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="{ row }">
                <el-button 
                  text 
                  type="primary" 
                  size="small"
                  @click="syncDataSource(row)"
                  :loading="row.status === 'syncing'"
                >
                  立即同步
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>🔍 数据质量问题分布</span>
              <el-tooltip content="点击查看详情">
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <div id="qualityIssuesChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据质量详细指标 -->
    <el-row :gutter="20" class="mb-4">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>📈 数据质量趋势分析</span>
              <el-radio-group v-model="trendPeriod" size="small">
                <el-radio-button label="7days">近7天</el-radio-button>
                <el-radio-button label="30days">近30天</el-radio-button>
                <el-radio-button label="90days">近90天</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div id="qualityTrendChart" style="height: 350px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据清洗规则引擎 -->
    <el-row :gutter="20" class="mb-4">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>🛠️ 数据清洗规则</span>
              <el-button text type="primary" @click="showAddRuleDialog">
                <el-icon><Plus /></el-icon>
                添加规则
              </el-button>
            </div>
          </template>
          <el-table :data="cleaningRules" style="width: 100%">
            <el-table-column prop="fieldName" label="字段" width="120" />
            <el-table-column prop="ruleName" label="规则名称" />
            <el-table-column label="启用状态" width="100">
              <template #default="{ row }">
                <el-switch v-model="row.enabled" @change="toggleRule(row)" />
              </template>
            </el-table-column>
            <el-table-column label="应用次数" width="100">
              <template #default="{ row }">
                <el-tag>{{ row.appliedCount }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template #default="{ row }">
                <el-button text type="primary" size="small" @click="editRule(row)">
                  编辑
                </el-button>
                <el-button text type="danger" size="small" @click="deleteRule(row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>⚠️ 数据异常提醒</span>
              <el-badge :value="alerts.length" :max="99" type="danger">
                <el-icon :size="20"><Warning /></el-icon>
              </el-badge>
            </div>
          </template>
          <div class="alerts-list">
            <el-alert
              v-for="alert in alerts"
              :key="alert.id"
              :title="alert.title"
              :type="alert.type"
              :description="alert.description"
              :closable="true"
              @close="dismissAlert(alert)"
              class="mb-2"
            >
              <template #default>
                <div class="alert-actions">
                  <el-button size="small" type="primary" @click="handleAlert(alert)">
                    立即处理
                  </el-button>
                  <el-button size="small" @click="viewAlertDetail(alert)">
                    查看详情
                  </el-button>
                </div>
              </template>
            </el-alert>
            <el-empty v-if="alerts.length === 0" description="暂无数据异常" :image-size="100" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据字段级质量报告 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>📋 字段级质量报告</span>
              <el-input
                v-model="fieldSearch"
                placeholder="搜索字段..."
                style="width: 200px;"
                clearable
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </div>
          </template>
          <el-table 
            :data="filteredFieldQuality" 
            style="width: 100%"
            :default-sort="{ prop: 'qualityScore', order: 'ascending' }"
          >
            <el-table-column prop="fieldName" label="字段名称" width="150" />
            <el-table-column prop="totalRecords" label="总记录数" width="100" />
            <el-table-column label="缺失率" width="120">
              <template #default="{ row }">
                <el-progress 
                  :percentage="row.missingRate" 
                  :color="getMissingColor(row.missingRate)"
                  :stroke-width="8"
                />
              </template>
            </el-table-column>
            <el-table-column label="重复率" width="120">
              <template #default="{ row }">
                <el-progress 
                  :percentage="row.duplicateRate" 
                  :color="getDuplicateColor(row.duplicateRate)"
                  :stroke-width="8"
                />
              </template>
            </el-table-column>
            <el-table-column label="格式错误率" width="120">
              <template #default="{ row }">
                <el-progress 
                  :percentage="row.formatErrorRate" 
                  :color="getFormatErrorColor(row.formatErrorRate)"
                  :stroke-width="8"
                />
              </template>
            </el-table-column>
            <el-table-column label="质量评分" width="100" sortable prop="qualityScore">
              <template #default="{ row }">
                <el-tag :type="getScoreType(row.qualityScore)">
                  {{ row.qualityScore }}分
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="建议操作">
              <template #default="{ row }">
                <el-text type="primary" v-if="row.recommendation">
                  {{ row.recommendation }}
                </el-text>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button text type="primary" size="small" @click="cleanField(row)">
                  清洗数据
                </el-button>
                <el-button text type="success" size="small" @click="viewFieldDetail(row)">
                  详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { 
  Refresh, Setting, QuestionFilled, Plus, Warning, Search,
  CircleCheck, CircleClose, Loading
} from '@element-plus/icons-vue'

// 响应式数据
const refreshing = ref(false)
const trendPeriod = ref('30days')
const fieldSearch = ref('')

// 数据质量总览
const qualityOverview = ref([
  { 
    id: 1, 
    title: '整体质量评分', 
    value: 87, 
    suffix: '分',
    score: 87,
    trend: 5,
    icon: 'TrendCharts',
    color: '#67C23A'
  },
  { 
    id: 2, 
    title: '数据完整率', 
    value: 92.5, 
    suffix: '%',
    score: 92.5,
    trend: 3,
    icon: 'CircleCheck',
    color: '#409EFF'
  },
  { 
    id: 3, 
    title: '数据准确率', 
    value: 95.8, 
    suffix: '%',
    score: 95.8,
    trend: -2,
    icon: 'SuccessFilled',
    color: '#E6A23C'
  },
  { 
    id: 4, 
    title: '数据一致性', 
    value: 88.3, 
    suffix: '%',
    score: 88.3,
    trend: 7,
    icon: 'Connection',
    color: '#F56C6C'
  }
])

// 数据源配置
const dataSources = ref([
  { 
    id: 1, 
    name: 'CRM系统', 
    syncInterval: '5分钟', 
    lastSync: new Date(Date.now() - 3 * 60000),
    status: 'success'
  },
  { 
    id: 2, 
    name: 'ERP系统', 
    syncInterval: '1小时', 
    lastSync: new Date(Date.now() - 30 * 60000),
    status: 'success'
  },
  { 
    id: 3, 
    name: '市场数据', 
    syncInterval: '1天', 
    lastSync: new Date(Date.now() - 2 * 60 * 60000),
    status: 'warning'
  },
  { 
    id: 4, 
    name: '竞对数据', 
    syncInterval: '1天', 
    lastSync: null,
    status: 'error'
  }
])

// 数据清洗规则
const cleaningRules = ref([
  { id: 1, fieldName: 'phone', ruleName: '手机号格式化', enabled: true, appliedCount: 1523 },
  { id: 2, fieldName: 'email', ruleName: '邮箱验证', enabled: true, appliedCount: 892 },
  { id: 3, fieldName: 'address', ruleName: '地址标准化', enabled: true, appliedCount: 645 },
  { id: 4, fieldName: 'company', ruleName: '公司名去重', enabled: false, appliedCount: 0 },
  { id: 5, fieldName: 'price', ruleName: '价格格式统一', enabled: true, appliedCount: 2341 }
])

// 数据异常提醒
const alerts = ref([
  {
    id: 1,
    type: 'error',
    title: '重复数据异常',
    description: '客户表中发现238条重复记录，可能影响分析准确性'
  },
  {
    id: 2,
    type: 'warning',
    title: '数据缺失提醒',
    description: '本月新增客户中有15%未填写联系方式'
  },
  {
    id: 3,
    type: 'warning',
    title: '数据格式不一致',
    description: '地址字段存在多种格式，建议统一标准化'
  }
])

// 字段级质量数据
const fieldQualityData = ref([
  { fieldName: 'customer_name', totalRecords: 5000, missingRate: 2, duplicateRate: 5, formatErrorRate: 1, qualityScore: 92, recommendation: '优秀，无需处理' },
  { fieldName: 'phone', totalRecords: 5000, missingRate: 8, duplicateRate: 3, formatErrorRate: 12, qualityScore: 77, recommendation: '建议启用手机号格式化规则' },
  { fieldName: 'email', totalRecords: 5000, missingRate: 15, duplicateRate: 2, formatErrorRate: 8, qualityScore: 75, recommendation: '需要加强邮箱验证' },
  { fieldName: 'address', totalRecords: 5000, missingRate: 20, duplicateRate: 1, formatErrorRate: 25, qualityScore: 54, recommendation: '严重：需立即清洗地址数据' },
  { fieldName: 'company', totalRecords: 5000, missingRate: 5, duplicateRate: 18, formatErrorRate: 3, qualityScore: 74, recommendation: '建议启用公司名去重规则' },
  { fieldName: 'revenue', totalRecords: 5000, missingRate: 12, duplicateRate: 0, formatErrorRate: 5, qualityScore: 83, recommendation: '良好，需补充缺失数据' }
])

const filteredFieldQuality = computed(() => {
  if (!fieldSearch.value) return fieldQualityData.value
  return fieldQualityData.value.filter(field => 
    field.fieldName.toLowerCase().includes(fieldSearch.value.toLowerCase())
  )
})

// 方法
const refreshData = () => {
  refreshing.value = true
  setTimeout(() => {
    refreshing.value = false
    ElMessage.success('数据已刷新')
  }, 1000)
}

const showSettings = () => {
  ElMessage.info('打开数据质量配置面板')
}

const refreshDataSources = () => {
  ElMessage.success('正在刷新数据源状态...')
}

const syncDataSource = (source) => {
  source.status = 'syncing'
  setTimeout(() => {
    source.lastSync = new Date()
    source.status = 'success'
    ElMessage.success(`${source.name} 同步完成`)
  }, 2000)
}

const getQualityColor = (score) => {
  if (score >= 90) return '#67C23A'
  if (score >= 75) return '#E6A23C'
  return '#F56C6C'
}

const getIntervalType = (interval) => {
  if (interval.includes('分钟')) return 'success'
  if (interval.includes('小时')) return 'warning'
  return 'info'
}

const getStatusColor = (status) => {
  const colorMap = { success: '#67C23A', warning: '#E6A23C', error: '#F56C6C', syncing: '#409EFF' }
  return colorMap[status] || '#909399'
}

const getStatusIcon = (status) => {
  const iconMap = { success: 'CircleCheck', warning: 'Warning', error: 'CircleClose', syncing: 'Loading' }
  return iconMap[status] || 'QuestionFilled'
}

const formatTime = (date) => {
  const now = new Date()
  const diff = Math.floor((now - date) / 60000)
  if (diff < 1) return '刚刚'
  if (diff < 60) return `${diff}分钟前`
  if (diff < 1440) return `${Math.floor(diff / 60)}小时前`
  return `${Math.floor(diff / 1440)}天前`
}

const getMissingColor = (rate) => {
  if (rate <= 5) return '#67C23A'
  if (rate <= 15) return '#E6A23C'
  return '#F56C6C'
}

const getDuplicateColor = (rate) => {
  if (rate <= 3) return '#67C23A'
  if (rate <= 10) return '#E6A23C'
  return '#F56C6C'
}

const getFormatErrorColor = (rate) => {
  if (rate <= 5) return '#67C23A'
  if (rate <= 15) return '#E6A23C'
  return '#F56C6C'
}

const getScoreType = (score) => {
  if (score >= 90) return 'success'
  if (score >= 75) return 'warning'
  return 'danger'
}

const showAddRuleDialog = () => {
  ElMessage.info('打开添加清洗规则对话框')
}

const toggleRule = (rule) => {
  ElMessage.success(`${rule.ruleName} 已${rule.enabled ? '启用' : '禁用'}`)
}

const editRule = (rule) => {
  ElMessage.info(`编辑规则: ${rule.ruleName}`)
}

const deleteRule = (rule) => {
  ElMessage.warning(`删除规则: ${rule.ruleName}`)
}

const dismissAlert = (alert) => {
  const index = alerts.value.findIndex(a => a.id === alert.id)
  if (index > -1) {
    alerts.value.splice(index, 1)
  }
}

const handleAlert = (alert) => {
  ElMessage.success(`开始处理: ${alert.title}`)
}

const viewAlertDetail = (alert) => {
  ElMessage.info(`查看详情: ${alert.title}`)
}

const cleanField = (field) => {
  ElMessage.success(`开始清洗字段: ${field.fieldName}`)
}

const viewFieldDetail = (field) => {
  ElMessage.info(`查看字段详情: ${field.fieldName}`)
}

// 初始化图表
const initCharts = () => {
  // 数据质量问题分布饼图
  const issuesChart = echarts.init(document.getElementById('qualityIssuesChart'))
  issuesChart.setOption({
    tooltip: { trigger: 'item' },
    legend: { orient: 'vertical', right: 10, top: 'center' },
    series: [{
      name: '问题类型',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 16, fontWeight: 'bold' } },
      data: [
        { value: 238, name: '重复数据', itemStyle: { color: '#F56C6C' } },
        { value: 156, name: '缺失数据', itemStyle: { color: '#E6A23C' } },
        { value: 89, name: '格式错误', itemStyle: { color: '#409EFF' } },
        { value: 45, name: '数据冲突', itemStyle: { color: '#909399' } }
      ]
    }]
  })

  // 数据质量趋势图
  const trendChart = echarts.init(document.getElementById('qualityTrendChart'))
  trendChart.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['整体评分', '完整率', '准确率', '一致性'] },
    xAxis: { 
      type: 'category', 
      boundaryGap: false,
      data: ['12/01', '12/05', '12/10', '12/15', '12/20', '12/25', '12/30']
    },
    yAxis: { type: 'value', min: 70, max: 100 },
    series: [
      { 
        name: '整体评分', 
        type: 'line', 
        smooth: true,
        data: [82, 85, 86, 84, 87, 88, 87],
        itemStyle: { color: '#67C23A' }
      },
      { 
        name: '完整率', 
        type: 'line', 
        smooth: true,
        data: [89, 90, 91, 90, 92, 93, 92.5],
        itemStyle: { color: '#409EFF' }
      },
      { 
        name: '准确率', 
        type: 'line', 
        smooth: true,
        data: [97, 96, 95, 96, 96, 97, 95.8],
        itemStyle: { color: '#E6A23C' }
      },
      { 
        name: '一致性', 
        type: 'line', 
        smooth: true,
        data: [81, 83, 84, 85, 86, 87, 88.3],
        itemStyle: { color: '#F56C6C' }
      }
    ]
  })
}

onMounted(() => {
  setTimeout(() => {
    initCharts()
  }, 300)
})
</script>

<style scoped lang="scss">
.data-quality-monitor {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h2 {
    margin: 0;
    font-size: 24px;
    color: #303133;
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }
}

.quality-metric-card {
  .metric-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;

    .metric-info {
      flex: 1;

      .metric-title {
        font-size: 14px;
        color: #606266;
        margin-bottom: 4px;
      }

      .metric-value {
        font-size: 28px;
        font-weight: 600;
      }
    }
  }

  .metric-trend {
    margin-top: 8px;
    font-size: 13px;
    color: #909399;

    .positive {
      color: #67C23A;
      font-weight: 600;
    }

    .negative {
      color: #F56C6C;
      font-weight: 600;
    }
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.alerts-list {
  max-height: 400px;
  overflow-y: auto;

  .alert-actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }
}

.mb-2 {
  margin-bottom: 8px;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>
