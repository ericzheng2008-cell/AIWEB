<template>
  <div class="device-status-page">
    <Header />
    
    <!-- 页面标题 -->
    <section class="page-header">
      <div class="container">
        <div class="header-content">
          <el-icon :size="48" color="#fff"><Monitor /></el-icon>
          <h1>在线设备查询</h1>
          <p>实时监控设备状态，智能预警异常情况</p>
        </div>
      </div>
    </section>

    <!-- 统计概览 -->
    <section class="statistics-section">
      <div class="container">
        <el-row :gutter="20">
          <el-col :span="6">
            <div class="stat-card total">
              <div class="stat-icon">
                <el-icon :size="40"><Box /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ deviceStore.devices.length }}</div>
                <div class="stat-label">设备总数</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card online">
              <div class="stat-icon">
                <el-icon :size="40"><CircleCheck /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ deviceStore.onlineDevices.length }}</div>
                <div class="stat-label">在线运行</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card warning">
              <div class="stat-icon">
                <el-icon :size="40"><Warning /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ deviceStore.warningDevices.length }}</div>
                <div class="stat-label">预警状态</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="stat-card offline">
              <div class="stat-icon">
                <el-icon :size="40"><CircleClose /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ deviceStore.offlineDevices.length }}</div>
                <div class="stat-label">离线故障</div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </section>

    <!-- 主内容 -->
    <section class="main-content">
      <div class="container">
        <!-- 筛选栏 -->
        <el-card class="filter-card" shadow="hover">
          <el-form :inline="true" :model="filters">
            <el-form-item label="关键词">
              <el-input 
                v-model="filters.keyword" 
                placeholder="搜索设备名称/编号/位置" 
                clearable 
                :prefix-icon="Search"
                style="width: 250px" />
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="filters.status" placeholder="全部状态" clearable style="width: 150px">
                <el-option label="在线" value="online" />
                <el-option label="离线" value="offline" />
                <el-option label="预警" value="warning" />
                <el-option label="维护中" value="maintenance" />
              </el-select>
            </el-form-item>
            <el-form-item label="位置">
              <el-select v-model="filters.location" placeholder="全部位置" clearable style="width: 150px">
                <el-option label="车间A" value="车间A" />
                <el-option label="车间B" value="车间B" />
                <el-option label="车间C" value="车间C" />
              </el-select>
            </el-form-item>
            <el-form-item label="品牌">
              <el-select v-model="filters.brand" placeholder="全部品牌" clearable style="width: 150px">
                <el-option label="Atlas Copco" value="Atlas Copco" />
                <el-option label="Bosch" value="Bosch" />
                <el-option label="EQTCF" value="EQTCF" />
                <el-option label="Ingersoll Rand" value="Ingersoll Rand" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :icon="Search" @click="applyFilters">查询</el-button>
              <el-button :icon="RefreshRight" @click="resetFilters">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 设备列表 -->
        <div class="devices-grid">
          <el-card 
            v-for="device in filteredDevices" 
            :key="device.id" 
            class="device-card"
            :class="device.status"
            shadow="hover"
            @click="viewDeviceDetail(device)">
            <!-- 状态标识 -->
            <div class="device-status-badge" :class="device.status">
              <el-icon v-if="device.status === 'online'" :size="16"><CircleCheck /></el-icon>
              <el-icon v-else-if="device.status === 'offline'" :size="16"><CircleClose /></el-icon>
              <el-icon v-else-if="device.status === 'warning'" :size="16"><Warning /></el-icon>
              <el-icon v-else :size="16"><Tools /></el-icon>
              <span>{{ statusText(device.status) }}</span>
            </div>

            <div class="device-header">
              <div class="device-title">
                <h3>{{ device.name }}</h3>
                <el-text size="small" type="info">{{ device.id }}</el-text>
              </div>
              <div class="device-health">
                <el-progress 
                  type="circle" 
                  :percentage="device.healthScore" 
                  :width="60"
                  :color="getHealthColor(device.healthScore)" />
              </div>
            </div>

            <el-divider />

            <div class="device-info">
              <div class="info-row">
                <span class="info-label">型号:</span>
                <span class="info-value">{{ device.brand }} {{ device.model }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">位置:</span>
                <span class="info-value">{{ device.location }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">操作员:</span>
                <span class="info-value">{{ device.operator }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">运行时长:</span>
                <span class="info-value">{{ device.runningHours }} 小时</span>
              </div>
            </div>

            <el-divider />

            <!-- 性能指标 -->
            <div class="device-metrics">
              <div v-if="device.batteryLevel !== undefined" class="metric-item">
                <el-icon><Battery /></el-icon>
                <span>电量: {{ device.batteryLevel }}%</span>
              </div>
              <div v-if="device.torqueAccuracy" class="metric-item">
                <el-icon><DataAnalysis /></el-icon>
                <span>精度: {{ device.torqueAccuracy }}%</span>
              </div>
              <div v-if="device.temperature" class="metric-item">
                <el-icon><Sunny /></el-icon>
                <span>温度: {{ device.temperature }}°C</span>
              </div>
              <div v-if="device.airPressure" class="metric-item">
                <el-icon><Wind /></el-icon>
                <span>气压: {{ device.airPressure }}bar</span>
              </div>
            </div>

            <!-- 预警信息 -->
            <div v-if="device.warnings && device.warnings.length" class="device-warnings">
              <el-alert 
                v-for="(warning, idx) in device.warnings" 
                :key="idx"
                :title="warning" 
                type="warning" 
                :closable="false"
                size="small" />
            </div>

            <!-- 故障信息 -->
            <div v-if="device.faultDescription" class="device-fault">
              <el-alert 
                :title="device.faultType" 
                :description="device.faultDescription"
                type="error" 
                :closable="false"
                size="small" />
            </div>

            <!-- 维护信息 -->
            <div v-if="device.maintenanceNote" class="device-maintenance">
              <el-alert 
                title="维护中" 
                :description="device.maintenanceNote"
                type="info" 
                :closable="false"
                size="small" />
            </div>

            <el-divider />

            <div class="device-footer">
              <el-text size="small" type="info">
                最后更新: {{ device.lastUpdate }}
              </el-text>
            </div>
          </el-card>
        </div>

        <!-- 空状态 -->
        <el-empty v-if="filteredDevices.length === 0" description="未找到匹配的设备" />
      </div>
    </section>

    <!-- 设备详情对话框 -->
    <el-dialog 
      v-model="detailVisible" 
      :title="selectedDevice?.name" 
      width="800px"
      :close-on-click-modal="false">
      <div v-if="selectedDevice" class="device-detail">
        <!-- 状态和健康度 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card shadow="never">
              <template #header>
                <strong>设备状态</strong>
              </template>
              <div class="detail-status">
                <el-tag 
                  :type="getStatusType(selectedDevice.status)" 
                  size="large"
                  effect="dark">
                  {{ statusText(selectedDevice.status) }}
                </el-tag>
                <div class="status-time">
                  更新时间: {{ selectedDevice.lastUpdate }}
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card shadow="never">
              <template #header>
                <strong>健康评分</strong>
              </template>
              <div class="detail-health">
                <el-progress 
                  type="dashboard" 
                  :percentage="selectedDevice.healthScore"
                  :width="120"
                  :color="getHealthColor(selectedDevice.healthScore)">
                  <template #default="{ percentage }">
                    <span class="health-score">{{ percentage }}</span>
                    <span class="health-unit">分</span>
                  </template>
                </el-progress>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 详细信息 -->
        <el-card shadow="never" style="margin-top: 20px">
          <template #header>
            <strong>设备信息</strong>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="设备编号">{{ selectedDevice.id }}</el-descriptions-item>
            <el-descriptions-item label="设备类型">{{ selectedDevice.type }}</el-descriptions-item>
            <el-descriptions-item label="品牌">{{ selectedDevice.brand }}</el-descriptions-item>
            <el-descriptions-item label="型号">{{ selectedDevice.model }}</el-descriptions-item>
            <el-descriptions-item label="安装位置">{{ selectedDevice.location }}</el-descriptions-item>
            <el-descriptions-item label="操作员">{{ selectedDevice.operator }}</el-descriptions-item>
            <el-descriptions-item label="运行时长">{{ selectedDevice.runningHours }} 小时</el-descriptions-item>
            <el-descriptions-item label="扭矩精度">{{ selectedDevice.torqueAccuracy }}%</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 保养信息 -->
        <el-card shadow="never" style="margin-top: 20px">
          <template #header>
            <strong>保养计划</strong>
          </template>
          <el-timeline>
            <el-timeline-item :timestamp="selectedDevice.lastMaintenance" placement="top">
              <el-text type="success">上次保养</el-text>
            </el-timeline-item>
            <el-timeline-item :timestamp="selectedDevice.nextMaintenance" placement="top">
              <el-text type="warning">下次保养</el-text>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </div>
      
      <template #footer>
        <el-button @click="detailVisible = false">关闭</el-button>
        <el-button type="primary" :icon="Download" @click="downloadDeviceReport">
          下载报告
        </el-button>
      </template>
    </el-dialog>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Monitor, Box, CircleCheck, CircleClose, Warning, Search, RefreshRight, 
  Tools, Battery, DataAnalysis, Sunny, Wind, Download
} from '@element-plus/icons-vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import { useDeviceStatusStore } from '../store/deviceStatus'

const deviceStore = useDeviceStatusStore()

// 筛选条件
const filters = ref({
  keyword: '',
  status: '',
  location: '',
  brand: ''
})

// 筛选后的设备列表
const filteredDevices = ref([...deviceStore.devices])

// 设备详情
const detailVisible = ref(false)
const selectedDevice = ref(null)

// 应用筛选
const applyFilters = () => {
  let result = [...deviceStore.devices]

  // 关键词搜索
  if (filters.value.keyword) {
    result = deviceStore.searchDevices(filters.value.keyword)
  }

  // 状态筛选
  if (filters.value.status) {
    result = result.filter(d => d.status === filters.value.status)
  }

  // 位置筛选
  if (filters.value.location) {
    result = result.filter(d => d.location.includes(filters.value.location))
  }

  // 品牌筛选
  if (filters.value.brand) {
    result = result.filter(d => d.brand === filters.value.brand)
  }

  filteredDevices.value = result
  ElMessage.success(`找到 ${result.length} 台设备`)
}

// 重置筛选
const resetFilters = () => {
  filters.value = {
    keyword: '',
    status: '',
    location: '',
    brand: ''
  }
  filteredDevices.value = [...deviceStore.devices]
  ElMessage.info('筛选条件已重置')
}

// 查看设备详情
const viewDeviceDetail = (device) => {
  selectedDevice.value = device
  detailVisible.value = true
}

// 状态文本
const statusText = (status) => {
  const map = {
    online: '在线',
    offline: '离线',
    warning: '预警',
    maintenance: '维护中'
  }
  return map[status] || status
}

// 状态类型
const getStatusType = (status) => {
  const map = {
    online: 'success',
    offline: 'danger',
    warning: 'warning',
    maintenance: 'info'
  }
  return map[status] || 'info'
}

// 健康度颜色
const getHealthColor = (score) => {
  if (score >= 90) return '#67c23a'
  if (score >= 70) return '#409eff'
  if (score >= 50) return '#e6a23c'
  return '#f56c6c'
}

// 下载设备报告
const downloadDeviceReport = () => {
  if (!selectedDevice.value) return

  const device = selectedDevice.value
  const content = `
设备状态报告
==================

设备编号: ${device.id}
设备名称: ${device.name}
设备类型: ${device.type}
品牌型号: ${device.brand} ${device.model}

当前状态
-----------------
运行状态: ${statusText(device.status)}
健康评分: ${device.healthScore}分
运行时长: ${device.runningHours}小时
扭矩精度: ${device.torqueAccuracy}%
${device.batteryLevel !== undefined ? `电池电量: ${device.batteryLevel}%` : ''}
${device.temperature ? `工作温度: ${device.temperature}°C` : ''}

位置信息
-----------------
安装位置: ${device.location}
操作员: ${device.operator}

保养信息
-----------------
上次保养: ${device.lastMaintenance}
下次保养: ${device.nextMaintenance}

${device.warnings && device.warnings.length ? `
预警信息
-----------------
${device.warnings.map(w => `⚠️ ${w}`).join('\n')}
` : ''}

${device.faultDescription ? `
故障信息
-----------------
故障类型: ${device.faultType}
故障描述: ${device.faultDescription}
` : ''}

==================
生成时间: ${new Date().toLocaleString()}
来源: 明升伟业设备管理系统
==================
`

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `设备报告_${device.id}_${Date.now()}.txt`
  link.click()
  URL.revokeObjectURL(url)
  
  ElMessage.success('报告已下载')
}
</script>

<style scoped>
.device-status-page {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 页面标题 */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 0;
  color: #fff;
}

.header-content {
  text-align: center;
}

.header-content h1 {
  font-size: 36px;
  font-weight: 700;
  margin: 16px 0 12px;
}

.header-content p {
  font-size: 16px;
  opacity: 0.95;
}

/* 统计概览 */
.statistics-section {
  padding: 40px 0;
  background: #fff;
  margin-top: -40px;
  position: relative;
  z-index: 10;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  color: #fff;
}

.stat-card.total .stat-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.stat-card.online .stat-icon {
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
}

.stat-card.warning .stat-icon {
  background: linear-gradient(135deg, #e6a23c 0%, #f5b041 100%);
}

.stat-card.offline .stat-icon {
  background: linear-gradient(135deg, #f56c6c 0%, #f89898 100%);
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

/* 主内容 */
.main-content {
  padding: 40px 0 80px;
}

.filter-card {
  margin-bottom: 24px;
}

/* 设备网格 */
.devices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
}

.device-card {
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.device-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.device-card.online {
  border-left: 4px solid #67c23a;
}

.device-card.offline {
  border-left: 4px solid #f56c6c;
}

.device-card.warning {
  border-left: 4px solid #e6a23c;
}

.device-card.maintenance {
  border-left: 4px solid #409eff;
}

.device-status-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
}

.device-status-badge.online {
  background: #67c23a;
}

.device-status-badge.offline {
  background: #f56c6c;
}

.device-status-badge.warning {
  background: #e6a23c;
}

.device-status-badge.maintenance {
  background: #409eff;
}

.device-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 16px;
}

.device-title h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
  padding-right: 100px;
}

.device-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

.info-label {
  color: #666;
}

.info-value {
  color: #1a1a1a;
  font-weight: 500;
}

.device-metrics {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f5f7fa;
  border-radius: 6px;
  font-size: 13px;
  color: #333;
}

.device-warnings,
.device-fault,
.device-maintenance {
  margin-top: 12px;
}

.device-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 设备详情 */
.detail-status {
  text-align: center;
}

.status-time {
  margin-top: 12px;
  font-size: 13px;
  color: #666;
}

.detail-health {
  text-align: center;
}

.health-score {
  font-size: 28px;
  font-weight: 700;
}

.health-unit {
  font-size: 14px;
  color: #666;
}
</style>
