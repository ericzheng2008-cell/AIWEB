<template>
  <div class="fault-statistics-container">
    <div class="page-header">
      <div class="header-content">
        <h1>
          <el-icon><DataAnalysis /></el-icon>
          故障率统计分析
        </h1>
        <p class="subtitle">设备故障分析 | 维修效率 | 成本分析 | 预测预警</p>
      </div>
      <div class="header-actions">
        <el-radio-group v-model="timeRange" @change="handleTimeRangeChange">
          <el-radio-button label="week">本周</el-radio-button>
          <el-radio-button label="month">本月</el-radio-button>
          <el-radio-button label="quarter">本季度</el-radio-button>
          <el-radio-button label="year">本年</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 核心指标卡片 -->
    <el-row :gutter="20" class="kpi-row">
      <el-col :span="4">
        <div class="kpi-card">
          <div class="kpi-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
            <el-icon><Files /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-label">工单总数</div>
            <div class="kpi-value">{{ kpiData.totalOrders }}</div>
            <div class="kpi-trend up">
              <el-icon><CaretTop /></el-icon>
              12.5%
            </div>
          </div>
        </div>
      </el-col>

      <el-col :span="4">
        <div class="kpi-card">
          <div class="kpi-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
            <el-icon><Warning /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-label">故障率</div>
            <div class="kpi-value">{{ kpiData.faultRate }}%</div>
            <div class="kpi-trend down">
              <el-icon><CaretBottom /></el-icon>
              3.2%
            </div>
          </div>
        </div>
      </el-col>

      <el-col :span="4">
        <div class="kpi-card">
          <div class="kpi-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
            <el-icon><Timer /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-label">平均响应时间</div>
            <div class="kpi-value">{{ kpiData.avgResponseTime }}</div>
            <div class="kpi-trend down">
              <el-icon><CaretBottom /></el-icon>
              8.5%
            </div>
          </div>
        </div>
      </el-col>

      <el-col :span="4">
        <div class="kpi-card">
          <div class="kpi-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
            <el-icon><Clock /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-label">平均维修时间</div>
            <div class="kpi-value">{{ kpiData.avgRepairTime }}</div>
            <div class="kpi-trend up">
              <el-icon><CaretTop /></el-icon>
              5.1%
            </div>
          </div>
        </div>
      </el-col>

      <el-col :span="4">
        <div class="kpi-card">
          <div class="kpi-icon" style="background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);">
            <el-icon><Checked /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-label">首次修复率</div>
            <div class="kpi-value">{{ kpiData.firstTimeFixRate }}%</div>
            <div class="kpi-trend up">
              <el-icon><CaretTop /></el-icon>
              4.3%
            </div>
          </div>
        </div>
      </el-col>

      <el-col :span="4">
        <div class="kpi-card">
          <div class="kpi-icon" style="background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);">
            <el-icon><Money /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-label">维修成本</div>
            <div class="kpi-value">¥{{ kpiData.totalCost }}</div>
            <div class="kpi-trend down">
              <el-icon><CaretBottom /></el-icon>
              6.7%
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 图表区域 - 第一行 -->
    <el-row :gutter="20" class="charts-row">
      <el-col :span="16">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>故障趋势分析</span>
              <el-tag type="info" size="small">过去12个月</el-tag>
            </div>
          </template>
          <div ref="faultTrendChart" style="height: 350px;"></div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>故障等级分布</span>
            </div>
          </template>
          <div ref="faultLevelChart" style="height: 350px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 - 第二行 -->
    <el-row :gutter="20" class="charts-row">
      <el-col :span="12">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>设备故障率TOP10</span>
            </div>
          </template>
          <div ref="deviceFaultRateChart" style="height: 400px;"></div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>维修人员工作量分析</span>
            </div>
          </template>
          <div ref="technicianWorkloadChart" style="height: 400px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 - 第三行 -->
    <el-row :gutter="20" class="charts-row">
      <el-col :span="8">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>故障类型占比</span>
            </div>
          </template>
          <div ref="faultTypeRatioChart" style="height: 350px;"></div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>维修时效性分析</span>
            </div>
          </template>
          <div ref="timelinessChart" style="height: 350px;"></div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>维修成本结构</span>
            </div>
          </template>
          <div ref="costStructureChart" style="height: 350px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 设备详细分析表 -->
    <el-card shadow="never" class="table-card">
      <template #header>
        <div class="card-header">
          <span>设备故障详细分析</span>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索设备名称"
            :prefix-icon="Search"
            style="width: 250px;"
            clearable
          />
        </div>
      </template>

      <el-table :data="deviceAnalysisData" stripe border style="width: 100%">
        <el-table-column type="index" label="排名" width="60" />
        <el-table-column prop="deviceName" label="设备名称" width="200" show-overflow-tooltip />
        <el-table-column prop="totalFaults" label="故障次数" width="100" sortable>
          <template #default="{ row }">
            <el-tag :type="row.totalFaults > 3 ? 'danger' : 'success'">
              {{ row.totalFaults }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="criticalFaults" label="高危故障" width="100" sortable>
          <template #default="{ row }">
            <span :style="{ color: row.criticalFaults > 0 ? '#f56c6c' : '#909399' }">
              {{ row.criticalFaults }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="seriousFaults" label="严重故障" width="100" sortable>
          <template #default="{ row }">
            <span :style="{ color: row.seriousFaults > 0 ? '#e6a23c' : '#909399' }">
              {{ row.seriousFaults }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="故障率" width="120" sortable>
          <template #default="{ row }">
            <el-progress 
              :percentage="getFaultRatePercentage(row)" 
              :color="getFaultRateColor(row)"
              :stroke-width="14"
            />
          </template>
        </el-table-column>
        <el-table-column label="平均维修时间" width="140">
          <template #default="{ row }">
            {{ getAvgRepairTime(row) }}分钟
          </template>
        </el-table-column>
        <el-table-column prop="totalCost" label="维修成本" width="120" sortable>
          <template #default="{ row }">
            <span style="color: #f56c6c; font-weight: 500;">¥{{ row.totalCost }}</span>
          </template>
        </el-table-column>
        <el-table-column label="健康评分" width="150">
          <template #default="{ row }">
            <el-rate 
              :model-value="getHealthScore(row)" 
              disabled 
              show-score 
              text-color="#ff9900"
              :score-template="`${getHealthScore(row) * 20}分`"
            />
          </template>
        </el-table-column>
        <el-table-column label="风险等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getRiskLevel(row).type" effect="dark">
              {{ getRiskLevel(row).text }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="viewDeviceDetail(row)">
              查看详情
            </el-button>
            <el-button type="warning" link size="small" @click="viewHistory(row)">
              维修历史
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 预警提示 -->
    <el-card shadow="never" class="alert-card">
      <template #header>
        <div class="card-header">
          <span>故障预警与建议</span>
          <el-tag type="danger" size="small">{{ alerts.length }}条预警</el-tag>
        </div>
      </template>
      
      <el-timeline>
        <el-timeline-item
          v-for="(alert, index) in alerts"
          :key="index"
          :timestamp="alert.time"
          :type="alert.type"
          :icon="alert.icon"
          placement="top"
        >
          <el-card shadow="hover">
            <div class="alert-content">
              <div class="alert-header">
                <strong>{{ alert.title }}</strong>
                <el-tag :type="alert.type" size="small">{{ alert.level }}</el-tag>
              </div>
              <div class="alert-description">{{ alert.description }}</div>
              <div class="alert-suggestion">
                <el-icon><Opportunity /></el-icon>
                <span>建议：{{ alert.suggestion }}</span>
              </div>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useFaultTrackingStore } from '../store/faultTracking'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  DataAnalysis, Files, Warning, Timer, Clock, Checked, Money, 
  Search, CaretTop, CaretBottom, Opportunity 
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const store = useFaultTrackingStore()
const router = useRouter()

const timeRange = ref('month')
const searchKeyword = ref('')

// KPI数据
const kpiData = computed(() => ({
  totalOrders: store.workOrders.length,
  faultRate: 8.3,
  avgResponseTime: '15分钟',
  avgRepairTime: `${store.avgRepairTime}分钟`,
  firstTimeFixRate: 92,
  totalCost: store.workOrders.reduce((sum, o) => sum + o.totalCost, 0)
}))

// 设备分析数据
const deviceAnalysisData = computed(() => {
  let data = store.deviceFaultRate
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    data = data.filter(d => d.deviceName.toLowerCase().includes(keyword))
  }
  
  return data.sort((a, b) => b.totalFaults - a.totalFaults)
})

// 获取故障率百分比
const getFaultRatePercentage = (device) => {
  return Math.min(device.totalFaults * 20, 100)
}

// 获取故障率颜色
const getFaultRateColor = (device) => {
  const rate = device.totalFaults
  if (rate >= 4) return '#f56c6c'
  if (rate >= 2) return '#e6a23c'
  return '#67c23a'
}

// 获取平均维修时间
const getAvgRepairTime = (device) => {
  return Math.round(60 + Math.random() * 120)
}

// 获取健康评分
const getHealthScore = (device) => {
  const score = 5 - Math.min(device.totalFaults, 5)
  return Math.max(score, 1)
}

// 获取风险等级
const getRiskLevel = (device) => {
  if (device.criticalFaults > 0) return { type: 'danger', text: '高风险' }
  if (device.seriousFaults > 1) return { type: 'warning', text: '中风险' }
  if (device.totalFaults > 2) return { type: 'info', text: '低风险' }
  return { type: 'success', text: '健康' }
}

// 预警数据
const alerts = ref([
  {
    time: '2025-12-13 14:30',
    type: 'danger',
    icon: 'Warning',
    level: '紧急',
    title: 'DEV-004 设备高频故障预警',
    description: '底盘装配工位-扳手最近7天内发生2次高危故障，故障率显著偏高',
    suggestion: '建议立即安排全面检修，评估设备更换必要性'
  },
  {
    time: '2025-12-13 10:15',
    type: 'warning',
    icon: 'Clock',
    level: '重要',
    title: '维修响应时间超标',
    description: '最近3个工单的响应时间超过30分钟，影响生产效率',
    suggestion: '优化维修人员排班，增加应急响应机制'
  },
  {
    time: '2025-12-12 16:45',
    type: 'info',
    icon: 'Tools',
    level: '提示',
    title: '定期保养到期提醒',
    description: '3台设备即将到达保养周期，建议提前安排保养计划',
    suggestion: '提前准备备件，避免影响生产计划'
  }
])

// 图表引用
const faultTrendChart = ref()
const faultLevelChart = ref()
const deviceFaultRateChart = ref()
const technicianWorkloadChart = ref()
const faultTypeRatioChart = ref()
const timelinessChart = ref()
const costStructureChart = ref()

// 初始化所有图表
const initCharts = () => {
  initFaultTrendChart()
  initFaultLevelChart()
  initDeviceFaultRateChart()
  initTechnicianWorkloadChart()
  initFaultTypeRatioChart()
  initTimelinessChart()
  initCostStructureChart()
}

// 故障趋势分析图
const initFaultTrendChart = () => {
  const chart = echarts.init(faultTrendChart.value)
  
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  const totalData = [8, 12, 15, 10, 14, 18, 20, 16, 22, 19, 25, 5]
  const criticalData = [2, 3, 4, 2, 3, 5, 6, 4, 7, 5, 8, 1]
  const seriousData = [3, 4, 5, 3, 5, 6, 7, 5, 8, 6, 9, 1]
  
  chart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    legend: {
      data: ['故障总数', '高危故障', '严重故障']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: months
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '故障总数',
        type: 'line',
        data: totalData,
        smooth: true,
        itemStyle: { color: '#409eff' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
          ])
        }
      },
      {
        name: '高危故障',
        type: 'line',
        data: criticalData,
        smooth: true,
        itemStyle: { color: '#f56c6c' }
      },
      {
        name: '严重故障',
        type: 'line',
        data: seriousData,
        smooth: true,
        itemStyle: { color: '#e6a23c' }
      }
    ]
  })
}

// 故障等级分布图
const initFaultLevelChart = () => {
  const chart = echarts.init(faultLevelChart.value)
  
  const data = [
    { value: 1, name: '高危', itemStyle: { color: '#f56c6c' } },
    { value: 1, name: '严重', itemStyle: { color: '#e6a23c' } },
    { value: 1, name: '一般', itemStyle: { color: '#409eff' } },
    { value: 2, name: '轻微', itemStyle: { color: '#67c23a' } }
  ]
  
  chart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    series: [
      {
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}\n{c}次'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold'
          }
        },
        data
      }
    ]
  })
}

// 设备故障率TOP10图
const initDeviceFaultRateChart = () => {
  const chart = echarts.init(deviceFaultRateChart.value)
  
  const data = store.deviceFaultRate.slice(0, 10)
  
  chart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
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
      data: data.map(d => d.deviceName.substring(0, 12))
    },
    series: [
      {
        name: '故障次数',
        type: 'bar',
        data: data.map(d => d.totalFaults),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#fa709a' },
            { offset: 1, color: '#fee140' }
          ])
        },
        barWidth: '60%',
        label: {
          show: true,
          position: 'right'
        }
      }
    ]
  })
}

// 维修人员工作量分析图
const initTechnicianWorkloadChart = () => {
  const chart = echarts.init(technicianWorkloadChart.value)
  
  const techs = store.technicians
  const ordersByTech = store.ordersByTechnician
  
  const data = techs.map(tech => ({
    name: tech.name,
    completed: ordersByTech[tech.name]?.filter(o => ['resolved', 'closed'].includes(o.status)).length || 0,
    inProgress: ordersByTech[tech.name]?.filter(o => o.status === 'in_progress').length || 0
  }))
  
  chart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['已完成', '进行中']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.name)
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '已完成',
        type: 'bar',
        stack: 'total',
        data: data.map(d => d.completed),
        itemStyle: { color: '#67c23a' }
      },
      {
        name: '进行中',
        type: 'bar',
        stack: 'total',
        data: data.map(d => d.inProgress),
        itemStyle: { color: '#409eff' }
      }
    ]
  })
}

// 故障类型占比图
const initFaultTypeRatioChart = () => {
  const chart = echarts.init(faultTypeRatioChart.value)
  
  const data = Object.entries(store.faultTypeStats).map(([name, value]) => ({
    name,
    value
  }))
  
  chart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    series: [
      {
        type: 'pie',
        radius: '70%',
        data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  })
}

// 维修时效性分析图
const initTimelinessChart = () => {
  const chart = echarts.init(timelinessChart.value)
  
  const data = [
    { value: 3, name: '超时', itemStyle: { color: '#f56c6c' } },
    { value: 2, name: '按时', itemStyle: { color: '#67c23a' } },
    { value: 0, name: '提前', itemStyle: { color: '#409eff' } }
  ]
  
  chart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}次 ({d}%)'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data,
        label: {
          show: true,
          formatter: '{b}\n{c}次'
        }
      }
    ]
  })
}

// 维修成本结构图
const initCostStructureChart = () => {
  const chart = echarts.init(costStructureChart.value)
  
  const data = [
    { value: 180, name: '备件成本', itemStyle: { color: '#409eff' } },
    { value: 15, name: '人工成本', itemStyle: { color: '#67c23a' } },
    { value: 0, name: '其他成本', itemStyle: { color: '#e6a23c' } }
  ]
  
  chart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: ¥{c} ({d}%)'
    },
    series: [
      {
        type: 'pie',
        radius: '70%',
        data,
        label: {
          show: true,
          formatter: '{b}\n¥{c}'
        }
      }
    ]
  })
}

const handleTimeRangeChange = () => {
  ElMessage.info(`切换至${timeRange.value === 'week' ? '本周' : timeRange.value === 'month' ? '本月' : timeRange.value === 'quarter' ? '本季度' : '本年'}数据`)
  nextTick(() => {
    initCharts()
  })
}

const viewDeviceDetail = (device) => {
  router.push({ path: '/device-status', query: { deviceId: device.deviceId } })
}

const viewHistory = (device) => {
  router.push({ path: '/maintenance-history', query: { deviceId: device.deviceId } })
}

onMounted(() => {
  nextTick(() => {
    initCharts()
  })
})
</script>

<style scoped>
.fault-statistics-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header-content h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  color: #303133;
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-content h1 .el-icon {
  font-size: 32px;
  color: #409eff;
}

.subtitle {
  margin: 0;
  font-size: 14px;
  color: #909399;
}

/* KPI卡片 */
.kpi-row {
  margin-bottom: 20px;
}

.kpi-card {
  display: flex;
  align-items: center;
  padding: 24px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.kpi-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

.kpi-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  color: white;
  margin-right: 16px;
}

.kpi-content {
  flex: 1;
}

.kpi-label {
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
}

.kpi-value {
  font-size: 26px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.kpi-trend {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.kpi-trend.up {
  color: #f56c6c;
}

.kpi-trend.down {
  color: #67c23a;
}

/* 图表行 */
.charts-row {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 15px;
}

.table-card {
  margin-bottom: 20px;
}

/* 预警卡片 */
.alert-card {
  margin-bottom: 20px;
}

.alert-content {
  line-height: 1.6;
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.alert-description {
  color: #606266;
  margin-bottom: 12px;
}

.alert-suggestion {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: #ecf5ff;
  border-left: 3px solid #409eff;
  border-radius: 4px;
  color: #409eff;
  font-size: 14px;
}
</style>
