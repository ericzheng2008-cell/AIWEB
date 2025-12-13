<template>
  <div class="fault-tracking-container">
    <div class="page-header">
      <div class="header-content">
        <h1>
          <el-icon><Tools /></el-icon>
          故障设备追踪
        </h1>
        <p class="subtitle">工单管理 | 维修追踪 | 故障分析</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" :icon="Plus" @click="showCreateDialog = true">
          创建工单
        </el-button>
        <el-button :icon="Download" @click="exportReport">
          导出报告
        </el-button>
      </div>
    </div>

    <!-- 统计概览 -->
    <div class="stats-overview">
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-card pending">
            <div class="stat-icon"><el-icon><Clock /></el-icon></div>
            <div class="stat-content">
              <div class="stat-value">{{ store.statusStats.pending }}</div>
              <div class="stat-label">待处理工单</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card active">
            <div class="stat-icon"><el-icon><Setting /></el-icon></div>
            <div class="stat-content">
              <div class="stat-value">{{ store.activeOrders.length }}</div>
              <div class="stat-label">进行中工单</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card completed">
            <div class="stat-icon"><el-icon><CircleCheck /></el-icon></div>
            <div class="stat-content">
              <div class="stat-value">{{ store.completedOrders.length }}</div>
              <div class="stat-label">已完成工单</div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-card overdue">
            <div class="stat-icon"><el-icon><Warning /></el-icon></div>
            <div class="stat-content">
              <div class="stat-value">{{ store.overdueOrders.length }}</div>
              <div class="stat-label">超时工单</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 筛选和搜索 -->
    <el-card class="filter-card" shadow="never">
      <el-form :inline="true" :model="filters">
        <el-form-item label="工单状态">
          <el-select v-model="filters.status" placeholder="全部" clearable @change="handleFilter">
            <el-option label="待处理" value="pending" />
            <el-option label="已分配" value="assigned" />
            <el-option label="维修中" value="in_progress" />
            <el-option label="已解决" value="resolved" />
            <el-option label="已关闭" value="closed" />
          </el-select>
        </el-form-item>

        <el-form-item label="优先级">
          <el-select v-model="filters.priority" placeholder="全部" clearable @change="handleFilter">
            <el-option label="高" value="high" />
            <el-option label="中" value="medium" />
            <el-option label="低" value="low" />
          </el-select>
        </el-form-item>

        <el-form-item label="故障等级">
          <el-select v-model="filters.faultLevel" placeholder="全部" clearable @change="handleFilter">
            <el-option label="高危" value="critical" />
            <el-option label="严重" value="serious" />
            <el-option label="一般" value="normal" />
            <el-option label="轻微" value="minor" />
          </el-select>
        </el-form-item>

        <el-form-item label="维修人员">
          <el-select v-model="filters.assignedTo" placeholder="全部" clearable @change="handleFilter">
            <el-option v-for="tech in store.technicians" :key="tech.id" :label="tech.name" :value="tech.name" />
          </el-select>
        </el-form-item>

        <el-form-item label="搜索">
          <el-input
            v-model="searchKeyword"
            placeholder="工单号/设备名称/故障类型"
            :prefix-icon="Search"
            clearable
            @input="handleSearch"
            style="width: 250px"
          />
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 工单列表 -->
    <el-card class="table-card" shadow="never">
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <el-tab-pane label="全部工单" name="all">
          <work-order-table :orders="filteredOrders" @view="viewWorkOrder" @update="updateWorkOrder" />
        </el-tab-pane>
        <el-tab-pane label="待处理" name="pending">
          <work-order-table :orders="store.pendingOrders" @view="viewWorkOrder" @update="updateWorkOrder" />
        </el-tab-pane>
        <el-tab-pane label="进行中" name="active">
          <work-order-table :orders="store.activeOrders" @view="viewWorkOrder" @update="updateWorkOrder" />
        </el-tab-pane>
        <el-tab-pane label="已完成" name="completed">
          <work-order-table :orders="store.completedOrders" @view="viewWorkOrder" @update="updateWorkOrder" />
        </el-tab-pane>
        <el-tab-pane label="高优先级" name="high">
          <work-order-table :orders="store.highPriorityOrders" @view="viewWorkOrder" @update="updateWorkOrder" />
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 创建工单对话框 -->
    <el-dialog v-model="showCreateDialog" title="创建维修工单" width="700px" :close-on-click-modal="false">
      <el-form :model="newOrder" label-width="100px" :rules="createRules" ref="createFormRef">
        <el-form-item label="设备名称" prop="deviceName">
          <el-input v-model="newOrder.deviceName" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备ID" prop="deviceId">
          <el-input v-model="newOrder.deviceId" placeholder="请输入设备ID" />
        </el-form-item>
        <el-form-item label="设备型号" prop="deviceModel">
          <el-input v-model="newOrder.deviceModel" placeholder="请输入设备型号" />
        </el-form-item>
        <el-form-item label="位置" prop="location">
          <el-input v-model="newOrder.location" placeholder="请输入设备位置" />
        </el-form-item>
        <el-form-item label="故障类型" prop="faultType">
          <el-select v-model="newOrder.faultType" placeholder="请选择故障类型" style="width: 100%">
            <el-option label="电池故障" value="电池故障" />
            <el-option label="温度异常" value="温度异常" />
            <el-option label="扭矩精度下降" value="扭矩精度下降" />
            <el-option label="通讯故障" value="通讯故障" />
            <el-option label="定期保养" value="定期保养" />
            <el-option label="机械磨损" value="机械磨损" />
            <el-option label="电气故障" value="电气故障" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="故障等级" prop="faultLevel">
          <el-radio-group v-model="newOrder.faultLevel">
            <el-radio label="critical">高危</el-radio>
            <el-radio label="serious">严重</el-radio>
            <el-radio label="normal">一般</el-radio>
            <el-radio label="minor">轻微</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-radio-group v-model="newOrder.priority">
            <el-radio label="high">高</el-radio>
            <el-radio label="medium">中</el-radio>
            <el-radio label="low">低</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="故障描述" prop="faultDescription">
          <el-input v-model="newOrder.faultDescription" type="textarea" :rows="4" placeholder="请详细描述故障现象" />
        </el-form-item>
        <el-form-item label="预估时间" prop="estimatedTime">
          <el-input v-model="newOrder.estimatedTime" placeholder="例如：2小时" />
        </el-form-item>
        <el-form-item label="报修人" prop="reportedBy">
          <el-input v-model="newOrder.reportedBy" placeholder="请输入报修人姓名" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">创建工单</el-button>
      </template>
    </el-dialog>

    <!-- 工单详情对话框 -->
    <el-dialog v-model="showDetailDialog" :title="`工单详情 - ${currentOrder?.id}`" width="900px" :close-on-click-modal="false">
      <work-order-detail v-if="currentOrder" :order="currentOrder" @update="handleUpdateOrder" @close="showDetailDialog = false" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFaultTrackingStore } from '../store/faultTracking'
import { ElMessage } from 'element-plus'
import { Plus, Download, Clock, Setting, CircleCheck, Warning, Search, Tools } from '@element-plus/icons-vue'
import WorkOrderTable from '../components/WorkOrderTable.vue'
import WorkOrderDetail from '../components/WorkOrderDetail.vue'

const store = useFaultTrackingStore()

// 筛选条件
const filters = ref({
  status: '',
  priority: '',
  faultLevel: '',
  assignedTo: ''
})

const searchKeyword = ref('')
const activeTab = ref('all')

// 过滤后的工单列表
const filteredOrders = computed(() => {
  let orders = store.workOrders
  
  // 应用搜索
  if (searchKeyword.value) {
    orders = store.searchWorkOrders(searchKeyword.value)
  }
  
  // 应用筛选
  const hasFilters = Object.values(filters.value).some(v => v)
  if (hasFilters) {
    orders = store.filterWorkOrders(filters.value)
  }
  
  return orders
})

// 创建工单
const showCreateDialog = ref(false)
const createFormRef = ref()
const newOrder = ref({
  deviceName: '',
  deviceId: '',
  deviceModel: '',
  location: '',
  faultType: '',
  faultLevel: 'normal',
  faultDescription: '',
  priority: 'medium',
  estimatedTime: '',
  reportedBy: '',
  reportedTime: '',
  faultTime: ''
})

const createRules = {
  deviceName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
  deviceId: [{ required: true, message: '请输入设备ID', trigger: 'blur' }],
  faultType: [{ required: true, message: '请选择故障类型', trigger: 'change' }],
  faultDescription: [{ required: true, message: '请输入故障描述', trigger: 'blur' }],
  reportedBy: [{ required: true, message: '请输入报修人姓名', trigger: 'blur' }]
}

const handleCreate = async () => {
  try {
    await createFormRef.value.validate()
    
    const now = new Date().toLocaleString('zh-CN', { hour12: false })
    newOrder.value.reportedTime = now
    newOrder.value.faultTime = now
    
    store.createWorkOrder(newOrder.value)
    
    ElMessage.success('工单创建成功')
    showCreateDialog.value = false
    
    // 重置表单
    createFormRef.value.resetFields()
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 查看工单详情
const showDetailDialog = ref(false)
const currentOrder = ref(null)

const viewWorkOrder = (order) => {
  currentOrder.value = order
  showDetailDialog.value = true
}

const updateWorkOrder = (orderId) => {
  const order = store.getWorkOrderById(orderId)
  viewWorkOrder(order)
}

const handleUpdateOrder = () => {
  // 刷新当前工单数据
  currentOrder.value = store.getWorkOrderById(currentOrder.value.id)
}

// 筛选和搜索
const handleFilter = () => {
  // 筛选逻辑已通过computed自动处理
}

const handleSearch = () => {
  // 搜索逻辑已通过computed自动处理
}

const handleTabChange = (tabName) => {
  // Tab切换逻辑
}

// 导出报告
const exportReport = () => {
  const report = store.generateFaultReport()
  
  const content = `
故障设备追踪报告
生成时间: ${report.timestamp}

一、工单统计
- 工单总数: ${report.summary.total}
- 待处理: ${report.summary.pending}
- 进行中: ${report.summary.inProgress}
- 已完成: ${report.summary.completed}
- 平均维修时间: ${report.summary.avgRepairTime}分钟
- 总维修成本: ¥${report.summary.totalCost}

二、故障类型分布
${Object.entries(report.faultTypeDistribution).map(([type, count]) => `- ${type}: ${count}次`).join('\n')}

三、本周工单统计
- 本周总数: ${report.weeklyStats.total}
- 已完成: ${report.weeklyStats.completed}
- 进行中: ${report.weeklyStats.inProgress}
- 待处理: ${report.weeklyStats.pending}

四、高优先级工单
${report.highPriorityOrders.map(o => `- [${o.id}] ${o.device} - ${o.faultType} (${o.status})`).join('\n')}
  `
  
  // 创建并下载文件
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `故障追踪报告_${new Date().toLocaleDateString()}.txt`
  link.click()
  URL.revokeObjectURL(url)
  
  ElMessage.success('报告导出成功')
}

onMounted(() => {
  // 初始化加载数据
})
</script>

<style scoped>
.fault-tracking-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
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

.header-actions {
  display: flex;
  gap: 12px;
}

/* 统计卡片 */
.stats-overview {
  margin-bottom: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  border-left: 4px solid;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.stat-card.pending {
  border-left-color: #e6a23c;
}

.stat-card.active {
  border-left-color: #409eff;
}

.stat-card.completed {
  border-left-color: #67c23a;
}

.stat-card.overdue {
  border-left-color: #f56c6c;
}

.stat-icon {
  font-size: 48px;
  margin-right: 20px;
  opacity: 0.8;
}

.stat-card.pending .stat-icon {
  color: #e6a23c;
}

.stat-card.active .stat-icon {
  color: #409eff;
}

.stat-card.completed .stat-icon {
  color: #67c23a;
}

.stat-card.overdue .stat-icon {
  color: #f56c6c;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

/* 筛选卡片 */
.filter-card {
  margin-bottom: 20px;
}

/* 表格卡片 */
.table-card {
  margin-bottom: 20px;
}

:deep(.el-tabs__item) {
  font-size: 15px;
  font-weight: 500;
}

:deep(.el-dialog__body) {
  max-height: 70vh;
  overflow-y: auto;
}
</style>
