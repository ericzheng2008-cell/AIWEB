<template>
  <div class="work-order-table">
    <el-table :data="orders" stripe style="width: 100%" :default-sort="{ prop: 'createdAt', order: 'descending' }">
      <el-table-column prop="id" label="工单号" width="140" sortable />
      
      <el-table-column prop="deviceName" label="设备名称" width="200" show-overflow-tooltip>
        <template #default="{ row }">
          <div class="device-info">
            <div class="device-name">{{ row.deviceName }}</div>
            <div class="device-model">{{ row.deviceModel }}</div>
          </div>
        </template>
      </el-table-column>
      
      <el-table-column prop="location" label="位置" width="140" />
      
      <el-table-column prop="faultType" label="故障类型" width="140">
        <template #default="{ row }">
          <el-tag :type="getFaultLevelType(row.faultLevel)" effect="dark">
            {{ row.faultType }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column prop="priority" label="优先级" width="90">
        <template #default="{ row }">
          <el-tag :type="getPriorityType(row.priority)" size="small">
            {{ getPriorityText(row.priority) }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column prop="assignedTo" label="维修人员" width="120">
        <template #default="{ row }">
          <span v-if="row.assignedTo">{{ row.assignedTo }}</span>
          <span v-else style="color: #909399;">未分配</span>
        </template>
      </el-table-column>
      
      <el-table-column prop="createdAt" label="创建时间" width="160" sortable />
      
      <el-table-column label="进度" width="120">
        <template #default="{ row }">
          <el-progress 
            :percentage="getProgress(row)" 
            :color="getProgressColor(row)"
            :status="getProgressStatus(row)"
          />
        </template>
      </el-table-column>
      
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link size="small" @click="$emit('view', row)">
            查看详情
          </el-button>
          <el-button 
            v-if="row.status === 'pending'" 
            type="success" 
            link 
            size="small" 
            @click="handleAssign(row)"
          >
            分配
          </el-button>
          <el-button 
            v-if="row.status === 'assigned'" 
            type="warning" 
            link 
            size="small" 
            @click="handleStart(row)"
          >
            开始
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配工单对话框 -->
    <el-dialog v-model="showAssignDialog" title="分配维修人员" width="500px">
      <el-form :model="assignForm" label-width="100px">
        <el-form-item label="维修人员">
          <el-select v-model="assignForm.technicianName" placeholder="请选择维修人员" style="width: 100%">
            <el-option 
              v-for="tech in technicians" 
              :key="tech.id" 
              :label="`${tech.name} (当前工作量: ${tech.workload})`" 
              :value="tech.name"
            >
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>{{ tech.name }}</span>
                <el-tag size="small" type="info">工作量: {{ tech.workload }}</el-tag>
              </div>
              <div style="font-size: 12px; color: #909399; margin-top: 4px;">
                技能: {{ tech.skills.join(', ') }}
              </div>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAssignDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmAssign">确定分配</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFaultTrackingStore } from '../store/faultTracking'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  orders: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['view', 'update'])

const store = useFaultTrackingStore()
const technicians = store.technicians

// 获取故障等级类型
const getFaultLevelType = (level) => {
  const map = {
    critical: 'danger',
    serious: 'warning',
    normal: 'info',
    minor: 'success'
  }
  return map[level] || 'info'
}

// 获取状态类型
const getStatusType = (status) => {
  const map = {
    pending: 'warning',
    assigned: 'info',
    in_progress: 'primary',
    resolved: 'success',
    closed: ''
  }
  return map[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const map = {
    pending: '待处理',
    assigned: '已分配',
    in_progress: '维修中',
    resolved: '已解决',
    closed: '已关闭'
  }
  return map[status] || status
}

// 获取优先级类型
const getPriorityType = (priority) => {
  const map = {
    high: 'danger',
    medium: 'warning',
    low: 'info'
  }
  return map[priority] || 'info'
}

// 获取优先级文本
const getPriorityText = (priority) => {
  const map = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return map[priority] || priority
}

// 获取进度
const getProgress = (order) => {
  const statusProgress = {
    pending: 0,
    assigned: 25,
    in_progress: 50,
    resolved: 90,
    closed: 100
  }
  return statusProgress[order.status] || 0
}

// 获取进度条颜色
const getProgressColor = (order) => {
  if (order.status === 'closed') return '#67c23a'
  if (order.status === 'resolved') return '#67c23a'
  if (order.status === 'in_progress') return '#409eff'
  if (order.status === 'assigned') return '#e6a23c'
  return '#909399'
}

// 获取进度状态
const getProgressStatus = (order) => {
  if (order.status === 'closed') return 'success'
  return null
}

// 分配工单
const showAssignDialog = ref(false)
const assignForm = ref({
  orderId: '',
  technicianName: ''
})

const handleAssign = (order) => {
  assignForm.value.orderId = order.id
  assignForm.value.technicianName = ''
  showAssignDialog.value = true
}

const confirmAssign = () => {
  if (!assignForm.value.technicianName) {
    ElMessage.warning('请选择维修人员')
    return
  }
  
  const success = store.assignWorkOrder(assignForm.value.orderId, assignForm.value.technicianName)
  if (success) {
    ElMessage.success('工单分配成功')
    showAssignDialog.value = false
    emit('update', assignForm.value.orderId)
  } else {
    ElMessage.error('工单分配失败')
  }
}

// 开始维修
const handleStart = async (order) => {
  try {
    await ElMessageBox.confirm('确认开始维修此设备？', '开始维修', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const success = store.startMaintenance(order.id, order.assignedTo)
    if (success) {
      ElMessage.success('已开始维修')
      emit('update', order.id)
    } else {
      ElMessage.error('操作失败')
    }
  } catch {
    // 用户取消
  }
}
</script>

<style scoped>
.work-order-table {
  width: 100%;
}

.device-info {
  line-height: 1.5;
}

.device-name {
  font-weight: 500;
  color: #303133;
}

.device-model {
  font-size: 12px;
  color: #909399;
  margin-top: 2px;
}

:deep(.el-table) {
  font-size: 14px;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
  font-weight: 600;
  color: #606266;
}
</style>
