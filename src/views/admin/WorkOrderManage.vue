<template>
  <div class="workorder-manage">
    <div class="page-header">
      <h2>工单管理系统</h2>
      <el-button type="primary" @click="showAddDialog">创建工单</el-button>
    </div>

    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-value">{{ faultStore.workOrders.length }}</div>
          <div class="stat-label">工单总数</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-value">{{ getPendingCount }}</div>
          <div class="stat-label">待处理</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-value">{{ getInProgressCount }}</div>
          <div class="stat-label">处理中</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-value">{{ getCompletedCount }}</div>
          <div class="stat-label">已完成</div>
        </div>
      </el-col>
    </el-row>

    <el-card class="filter-card">
      <el-row :gutter="16">
        <el-col :span="6">
          <el-input v-model="searchKeyword" placeholder="搜索工单号/设备名称" clearable />
        </el-col>
        <el-col :span="5">
          <el-select v-model="filterStatus" placeholder="工单状态" clearable>
            <el-option label="全部状态" value="" />
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="in_progress" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-select v-model="filterPriority" placeholder="优先级" clearable>
            <el-option label="全部优先级" value="" />
            <el-option label="低" value="low" />
            <el-option label="中" value="medium" />
            <el-option label="高" value="high" />
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-button @click="resetFilter">重置</el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="table-card">
      <el-table :data="filteredWorkOrders" stripe>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="id" label="工单号" width="140" />
        <el-table-column prop="faultType" label="故障类型" width="120" />
        <el-table-column prop="deviceName" label="设备名称" min-width="150" />
        <el-table-column label="优先级" width="90">
          <template #default="{ row }">
            <el-tag :type="getPriorityType(row.priority)">{{ getPriorityText(row.priority) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reportedBy" label="报告人" width="100" />
        <el-table-column label="处理人" width="120">
          <template #default="{ row }">
            {{ row.assignedTo || '未分配' }}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="viewDetail(row)">查看</el-button>
            <el-button size="small" type="danger" @click="deleteWorkOrder(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="detailVisible" title="工单详情" width="800px">
      <div v-if="currentWorkOrder">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="工单号">{{ currentWorkOrder.id }}</el-descriptions-item>
          <el-descriptions-item label="故障类型">{{ currentWorkOrder.faultType }}</el-descriptions-item>
          <el-descriptions-item label="设备名称">{{ currentWorkOrder.deviceName }}</el-descriptions-item>
          <el-descriptions-item label="设备型号">{{ currentWorkOrder.deviceModel }}</el-descriptions-item>
          <el-descriptions-item label="设备位置">{{ currentWorkOrder.location }}</el-descriptions-item>
          <el-descriptions-item label="优先级">
            <el-tag :type="getPriorityType(currentWorkOrder.priority)">
              {{ getPriorityText(currentWorkOrder.priority) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(currentWorkOrder.status)">
              {{ getStatusText(currentWorkOrder.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="报告人">{{ currentWorkOrder.reportedBy }}</el-descriptions-item>
          <el-descriptions-item label="处理人">{{ currentWorkOrder.assignedTo || '未分配' }}</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ currentWorkOrder.createdAt }}</el-descriptions-item>
          <el-descriptions-item label="预估时间">{{ currentWorkOrder.estimatedTime }}</el-descriptions-item>
          <el-descriptions-item label="实际时间">{{ currentWorkOrder.actualTime || '进行中' }}</el-descriptions-item>
          <el-descriptions-item label="故障描述" :span="2">
            {{ currentWorkOrder.faultDescription }}
          </el-descriptions-item>
          <el-descriptions-item label="维护计划" :span="2" v-if="currentWorkOrder.maintenancePlan">
            <pre style="white-space: pre-wrap; margin: 0;">{{ currentWorkOrder.maintenancePlan }}</pre>
          </el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFaultTrackingStore } from '../../store'
import { ElMessage, ElMessageBox } from 'element-plus'

const faultStore = useFaultTrackingStore()

const searchKeyword = ref('')
const filterStatus = ref('')
const filterPriority = ref('')
const detailVisible = ref(false)
const currentWorkOrder = ref(null)

const getPendingCount = computed(() => {
  return faultStore.workOrders.filter(wo => wo.status === 'pending').length
})

const getInProgressCount = computed(() => {
  return faultStore.workOrders.filter(wo => ['assigned', 'in_progress'].includes(wo.status)).length
})

const getCompletedCount = computed(() => {
  return faultStore.workOrders.filter(wo => ['resolved', 'closed'].includes(wo.status)).length
})

const filteredWorkOrders = computed(() => {
  let result = [...faultStore.workOrders]
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(wo => 
      wo.id.toLowerCase().includes(keyword) ||
      wo.faultType.toLowerCase().includes(keyword) ||
      wo.deviceName.toLowerCase().includes(keyword)
    )
  }
  
  if (filterStatus.value) {
    if (filterStatus.value === 'in_progress') {
      result = result.filter(wo => ['assigned', 'in_progress'].includes(wo.status))
    } else if (filterStatus.value === 'completed') {
      result = result.filter(wo => ['resolved', 'closed'].includes(wo.status))
    } else {
      result = result.filter(wo => wo.status === filterStatus.value)
    }
  }
  
  if (filterPriority.value) {
    result = result.filter(wo => wo.priority === filterPriority.value)
  }
  
  return result
})

const getPriorityText = (priority) => {
  const priorityMap = {
    low: '低',
    medium: '中',
    high: '高',
    urgent: '紧急'
  }
  return priorityMap[priority] || priority
}

const getPriorityType = (priority) => {
  const typeMap = {
    low: 'info',
    medium: '',
    high: 'warning',
    urgent: 'danger'
  }
  return typeMap[priority] || ''
}

const getStatusText = (status) => {
  const statusMap = {
    pending: '待处理',
    assigned: '已分配',
    in_progress: '处理中',
    resolved: '已解决',
    completed: '已完成',
    closed: '已关闭'
  }
  return statusMap[status] || status
}

const getStatusType = (status) => {
  const typeMap = {
    pending: 'warning',
    assigned: 'primary',
    in_progress: 'primary',
    resolved: 'success',
    completed: 'success',
    closed: 'info'
  }
  return typeMap[status] || ''
}

const showAddDialog = () => {
  ElMessage.info('请使用前台页面创建工单')
}

const viewDetail = (row) => {
  currentWorkOrder.value = row
  detailVisible.value = true
}

const deleteWorkOrder = (row) => {
  ElMessageBox.confirm('确定要删除这个工单吗？', '确认删除', {
    type: 'warning'
  }).then(() => {
    faultStore.deleteWorkOrder(row.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const resetFilter = () => {
  searchKeyword.value = ''
  filterStatus.value = ''
  filterPriority.value = ''
}
</script>

<style scoped>
.workorder-manage {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  text-align: center;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.filter-card {
  margin-bottom: 20px;
}

.table-card {
  margin-top: 0;
}
</style>
