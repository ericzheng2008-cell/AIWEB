<template>
  <div class="maintenance-history-container">
    <div class="page-header">
      <div class="header-content">
        <h1>
          <el-icon><Clock /></el-icon>
          维修历史记录
        </h1>
        <p class="subtitle">历史查询 | 趋势分析 | 数据统计</p>
      </div>
      <div class="header-actions">
        <el-button :icon="Download" @click="exportHistory">
          导出历史
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: #ecf5ff; color: #409eff;">
            <el-icon><Document /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-label">历史工单总数</div>
            <div class="stat-value">{{ store.workOrders.length }}</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: #f0f9ff; color: #67c23a;">
            <el-icon><CircleCheck /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-label">完成率</div>
            <div class="stat-value">{{ completionRate }}%</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: #fef0f0; color: #f56c6c;">
            <el-icon><Timer /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-label">平均维修时间</div>
            <div class="stat-value">{{ store.avgRepairTime }}分钟</div>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-icon" style="background: #fdf6ec; color: #e6a23c;">
            <el-icon><Money /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-label">总维修成本</div>
            <div class="stat-value">¥{{ totalCost }}</div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 筛选条件 -->
    <el-card shadow="never" class="filter-card">
      <el-form :inline="true" :model="filters">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="filters.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            @change="handleFilter"
          />
        </el-form-item>

        <el-form-item label="设备">
          <el-select v-model="filters.deviceId" placeholder="全部设备" clearable @change="handleFilter">
            <el-option 
              v-for="device in devices" 
              :key="device.id" 
              :label="device.name" 
              :value="device.id" 
            />
          </el-select>
        </el-form-item>

        <el-form-item label="故障类型">
          <el-select v-model="filters.faultType" placeholder="全部类型" clearable @change="handleFilter">
            <el-option 
              v-for="(count, type) in store.faultTypeStats" 
              :key="type" 
              :label="`${type} (${count})`" 
              :value="type" 
            />
          </el-select>
        </el-form-item>

        <el-form-item label="维修人员">
          <el-select v-model="filters.assignedTo" placeholder="全部人员" clearable @change="handleFilter">
            <el-option 
              v-for="tech in store.technicians" 
              :key="tech.id" 
              :label="tech.name" 
              :value="tech.name" 
            />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 图表展示 -->
    <el-row :gutter="20" class="charts-row">
      <el-col :span="12">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>故障类型分布</span>
            </div>
          </template>
          <div ref="faultTypeChart" style="height: 300px;"></div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>设备故障率排名</span>
            </div>
          </template>
          <div ref="deviceFaultChart" style="height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="charts-row">
      <el-col :span="24">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>月度维修趋势</span>
            </div>
          </template>
          <div ref="trendChart" style="height: 350px;"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 历史记录表格 -->
    <el-card shadow="never" class="table-card">
      <template #header>
        <div class="card-header">
          <span>维修历史记录</span>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索工单号、设备名称"
            :prefix-icon="Search"
            style="width: 300px;"
            clearable
            @input="handleSearch"
          />
        </div>
      </template>
      
      <el-table :data="filteredHistory" stripe style="width: 100%">
        <el-table-column prop="id" label="工单号" width="140" sortable />
        <el-table-column prop="deviceName" label="设备名称" width="180" show-overflow-tooltip />
        <el-table-column prop="faultType" label="故障类型" width="140">
          <template #default="{ row }">
            <el-tag :type="getFaultLevelType(row.faultLevel)" size="small">
              {{ row.faultType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="assignedTo" label="维修人员" width="120" />
        <el-table-column prop="createdAt" label="创建时间" width="160" sortable />
        <el-table-column prop="resolvedTime" label="完成时间" width="160" sortable />
        <el-table-column prop="actualTime" label="维修耗时" width="120">
          <template #default="{ row }">
            <el-tag v-if="row.actualTime" size="small">{{ row.actualTime }}</el-tag>
            <span v-else style="color: #909399;">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="totalCost" label="维修成本" width="120">
          <template #default="{ row }">
            <span style="color: #f56c6c;">¥{{ row.totalCost }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="viewDetail(row)">
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog v-model="showDetailDialog" :title="`工单详情 - ${currentOrder?.id}`" width="900px">
      <work-order-detail v-if="currentOrder" :order="currentOrder" :readonly="true" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useFaultTrackingStore } from '../store/faultTracking'
import { useDeviceStatusStore } from '../store/deviceStatus'
import { ElMessage } from 'element-plus'
import { Download, Clock, Document, CircleCheck, Timer, Money, Search } from '@element-plus/icons-vue'
import WorkOrderDetail from '../components/WorkOrderDetail.vue'
import * as echarts from 'echarts'

const store = useFaultTrackingStore()
const deviceStore = useDeviceStatusStore()

const devices = deviceStore.devices

// 统计数据
const completionRate = computed(() => {
  const total = store.workOrders.length
  const completed = store.completedOrders.length
  return total > 0 ? Math.round((completed / total) * 100) : 0
})

const totalCost = computed(() => {
  return store.workOrders.reduce((sum, order) => sum + order.totalCost, 0)
})

// 筛选条件
const filters = ref({
  dateRange: null,
  deviceId: '',
  faultType: '',
  assignedTo: ''
})

const searchKeyword = ref('')

// 过滤后的历史记录
const filteredHistory = computed(() => {
  let history = [...store.workOrders]
  
  // 搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    history = history.filter(order =>
      order.id.toLowerCase().includes(keyword) ||
      order.deviceName.toLowerCase().includes(keyword)
    )
  }
  
  // 日期筛选
  if (filters.value.dateRange && filters.value.dateRange.length === 2) {
    const [start, end] = filters.value.dateRange
    history = history.filter(order => {
      const createdDate = order.createdAt.split(' ')[0]
      return createdDate >= start && createdDate <= end
    })
  }
  
  // 设备筛选
  if (filters.value.deviceId) {
    history = history.filter(order => order.deviceId === filters.value.deviceId)
  }
  
  // 故障类型筛选
  if (filters.value.faultType) {
    history = history.filter(order => order.faultType === filters.value.faultType)
  }
  
  // 维修人员筛选
  if (filters.value.assignedTo) {
    history = history.filter(order => order.assignedTo === filters.value.assignedTo)
  }
  
  return history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const handleFilter = () => {
  nextTick(() => {
    initCharts()
  })
}

const handleSearch = () => {
  // 搜索逻辑已通过computed处理
}

// 查看详情
const showDetailDialog = ref(false)
const currentOrder = ref(null)

const viewDetail = (order) => {
  currentOrder.value = order
  showDetailDialog.value = true
}

// 图表
const faultTypeChart = ref()
const deviceFaultChart = ref()
const trendChart = ref()

const initCharts = () => {
  initFaultTypeChart()
  initDeviceFaultChart()
  initTrendChart()
}

// 故障类型分布图
const initFaultTypeChart = () => {
  const chart = echarts.init(faultTypeChart.value)
  
  const data = Object.entries(store.faultTypeStats).map(([name, value]) => ({
    name,
    value
  }))
  
  chart.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data
      }
    ]
  })
}

// 设备故障率排名图
const initDeviceFaultChart = () => {
  const chart = echarts.init(deviceFaultChart.value)
  
  const deviceFaultRate = store.deviceFaultRate.slice(0, 6)
  
  chart.setOption({
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
      data: deviceFaultRate.map(d => d.deviceName.substring(0, 10))
    },
    series: [
      {
        name: '故障次数',
        type: 'bar',
        data: deviceFaultRate.map(d => d.totalFaults),
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: '#83bff6' },
            { offset: 1, color: '#188df0' }
          ])
        },
        barWidth: '60%'
      }
    ]
  })
}

// 月度维修趋势图
const initTrendChart = () => {
  const chart = echarts.init(trendChart.value)
  
  // 模拟月度数据
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
  const totalData = [8, 12, 15, 10, 14, 18, 20, 16, 22, 19, 25, 5]
  const completedData = [7, 11, 14, 9, 13, 16, 18, 15, 20, 17, 22, 5]
  
  chart.setOption({
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['工单总数', '已完成']
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
        name: '工单总数',
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
        name: '已完成',
        type: 'line',
        data: completedData,
        smooth: true,
        itemStyle: { color: '#67c23a' },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(103, 194, 58, 0.3)' },
            { offset: 1, color: 'rgba(103, 194, 58, 0.05)' }
          ])
        }
      }
    ]
  })
}

// 导出历史
const exportHistory = () => {
  const data = filteredHistory.value
  
  let content = '维修历史记录\n\n'
  content += '工单号\t设备名称\t故障类型\t维修人员\t创建时间\t完成时间\t维修耗时\t维修成本\n'
  
  data.forEach(order => {
    content += `${order.id}\t${order.deviceName}\t${order.faultType}\t${order.assignedTo || '-'}\t${order.createdAt}\t${order.resolvedTime || '-'}\t${order.actualTime || '-'}\t¥${order.totalCost}\n`
  })
  
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `维修历史记录_${new Date().toLocaleDateString()}.txt`
  link.click()
  URL.revokeObjectURL(url)
  
  ElMessage.success('导出成功')
}

const getFaultLevelType = (level) => {
  const map = { critical: 'danger', serious: 'warning', normal: 'info', minor: 'success' }
  return map[level] || 'info'
}

onMounted(() => {
  nextTick(() => {
    initCharts()
  })
})
</script>

<style scoped>
.maintenance-history-container {
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

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-right: 16px;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.filter-card {
  margin-bottom: 20px;
}

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
</style>
