<template>
  <div class="work-order-detail">
    <!-- 基本信息 -->
    <el-descriptions title="工单基本信息" :column="2" border>
      <el-descriptions-item label="工单号">
        <el-tag>{{ order.id }}</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="状态">
        <el-tag :type="getStatusType(order.status)">
          {{ getStatusText(order.status) }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="设备名称">{{ order.deviceName }}</el-descriptions-item>
      <el-descriptions-item label="设备型号">{{ order.deviceModel }}</el-descriptions-item>
      <el-descriptions-item label="设备ID">{{ order.deviceId }}</el-descriptions-item>
      <el-descriptions-item label="位置">{{ order.location }}</el-descriptions-item>
      <el-descriptions-item label="故障类型">
        <el-tag :type="getFaultLevelType(order.faultLevel)" effect="dark">
          {{ order.faultType }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="故障等级">
        <el-tag :type="getFaultLevelType(order.faultLevel)">
          {{ getFaultLevelText(order.faultLevel) }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="优先级">
        <el-tag :type="getPriorityType(order.priority)">
          {{ getPriorityText(order.priority) }}
        </el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="报修人">{{ order.reportedBy }}</el-descriptions-item>
      <el-descriptions-item label="报修时间" :span="2">{{ order.reportedTime }}</el-descriptions-item>
      <el-descriptions-item label="故障描述" :span="2">
        <div class="fault-description">{{ order.faultDescription }}</div>
      </el-descriptions-item>
    </el-descriptions>

    <!-- 维修信息 -->
    <el-descriptions title="维修信息" :column="2" border style="margin-top: 20px;">
      <el-descriptions-item label="维修人员">
        {{ order.assignedTo || '未分配' }}
      </el-descriptions-item>
      <el-descriptions-item label="分配时间">
        {{ order.assignedTime || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="开始时间">
        {{ order.startTime || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="完成时间">
        {{ order.resolvedTime || '-' }}
      </el-descriptions-item>
      <el-descriptions-item label="预估时间">
        {{ order.estimatedTime }}
      </el-descriptions-item>
      <el-descriptions-item label="实际时间">
        <el-tag v-if="order.actualTime" :type="isOvertime(order) ? 'danger' : 'success'">
          {{ order.actualTime }}
        </el-tag>
        <span v-else>-</span>
      </el-descriptions-item>
      <el-descriptions-item label="维修计划" :span="2">
        <pre v-if="order.maintenancePlan" class="maintenance-plan">{{ order.maintenancePlan }}</pre>
        <span v-else style="color: #909399;">暂无维修计划</span>
      </el-descriptions-item>
      <el-descriptions-item label="备注" :span="2">
        {{ order.notes || '无' }}
      </el-descriptions-item>
    </el-descriptions>

    <!-- 维修时间轴 -->
    <div class="maintenance-timeline" style="margin-top: 30px;">
      <h3>维修进度</h3>
      <el-timeline>
        <el-timeline-item
          v-for="(log, index) in order.maintenanceLog"
          :key="index"
          :timestamp="log.time"
          :type="getLogType(log.action)"
          :icon="getLogIcon(log.action)"
          placement="top"
        >
          <el-card shadow="hover">
            <div class="log-header">
              <strong>{{ log.action }}</strong>
              <el-tag size="small">{{ log.operator }}</el-tag>
            </div>
            <div class="log-content">{{ log.details }}</div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>

    <!-- 备件信息 -->
    <div v-if="order.spareParts.length > 0" class="spare-parts" style="margin-top: 30px;">
      <h3>使用备件</h3>
      <el-table :data="order.spareParts" border stripe>
        <el-table-column prop="name" label="备件名称" />
        <el-table-column prop="quantity" label="数量" width="100" />
        <el-table-column prop="unit" label="单位" width="100" />
        <el-table-column prop="price" label="单价（¥）" width="120">
          <template #default="{ row }">
            ¥{{ row.price }}
          </template>
        </el-table-column>
        <el-table-column label="小计（¥）" width="120">
          <template #default="{ row }">
            ¥{{ row.price * row.quantity }}
          </template>
        </el-table-column>
      </el-table>
      <div class="total-cost">
        <strong>维修总成本：</strong>
        <span class="cost-value">¥{{ order.totalCost }}</span>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons" style="margin-top: 30px;">
      <template v-if="order.status === 'pending'">
        <el-button type="primary" :icon="User" @click="showAssignDialog = true">
          分配维修人员
        </el-button>
      </template>

      <template v-if="order.status === 'assigned'">
        <el-button type="warning" :icon="VideoCameraFilled" @click="handleStart">
          开始维修
        </el-button>
      </template>

      <template v-if="order.status === 'in_progress'">
        <el-button type="primary" :icon="Plus" @click="showLogDialog = true">
          添加维修日志
        </el-button>
        <el-button type="success" :icon="Plus" @click="showPartDialog = true">
          添加备件
        </el-button>
        <el-button type="success" :icon="CircleCheck" @click="showCompleteDialog = true">
          完成维修
        </el-button>
      </template>

      <template v-if="order.status === 'resolved'">
        <el-button type="success" :icon="Select" @click="handleClose">
          验收关闭
        </el-button>
      </template>

      <el-button @click="$emit('close')">关闭</el-button>
    </div>

    <!-- 分配维修人员对话框 -->
    <el-dialog v-model="showAssignDialog" title="分配维修人员" width="500px">
      <el-form :model="assignForm" label-width="100px">
        <el-form-item label="维修人员">
          <el-select v-model="assignForm.technicianName" placeholder="请选择维修人员" style="width: 100%">
            <el-option 
              v-for="tech in technicians" 
              :key="tech.id" 
              :label="`${tech.name} (工作量: ${tech.workload})`" 
              :value="tech.name"
            >
              <div>{{ tech.name }} - 工作量: {{ tech.workload }}</div>
              <div style="font-size: 12px; color: #909399;">技能: {{ tech.skills.join(', ') }}</div>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAssignDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmAssign">确定</el-button>
      </template>
    </el-dialog>

    <!-- 添加维修日志对话框 -->
    <el-dialog v-model="showLogDialog" title="添加维修日志" width="600px">
      <el-form :model="logForm" label-width="100px">
        <el-form-item label="操作类型">
          <el-select v-model="logForm.action" placeholder="请选择操作类型" style="width: 100%">
            <el-option label="问题诊断" value="问题诊断" />
            <el-option label="更换部件" value="更换部件" />
            <el-option label="调试测试" value="调试测试" />
            <el-option label="检查进度" value="检查进度" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="详细说明">
          <el-input v-model="logForm.details" type="textarea" :rows="4" placeholder="请输入详细说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showLogDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmAddLog">确定</el-button>
      </template>
    </el-dialog>

    <!-- 添加备件对话框 -->
    <el-dialog v-model="showPartDialog" title="添加备件" width="600px">
      <el-form :model="partForm" label-width="100px">
        <el-form-item label="备件名称">
          <el-input v-model="partForm.name" placeholder="请输入备件名称" />
        </el-form-item>
        <el-form-item label="数量">
          <el-input-number v-model="partForm.quantity" :min="1" :max="999" />
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="partForm.unit" placeholder="例如：个、件、米" style="width: 150px;" />
        </el-form-item>
        <el-form-item label="单价（¥）">
          <el-input-number v-model="partForm.price" :min="0" :precision="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPartDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmAddPart">确定</el-button>
      </template>
    </el-dialog>

    <!-- 完成维修对话框 -->
    <el-dialog v-model="showCompleteDialog" title="完成维修" width="600px">
      <el-form :model="completeForm" label-width="100px">
        <el-form-item label="实际耗时">
          <el-input v-model="completeForm.actualTime" placeholder="例如：2小时30分钟" />
        </el-form-item>
        <el-form-item label="维修总结">
          <el-input v-model="completeForm.notes" type="textarea" :rows="5" placeholder="请输入维修总结" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCompleteDialog = false">取消</el-button>
        <el-button type="success" @click="confirmComplete">确认完成</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useFaultTrackingStore } from '../store/faultTracking'
import { ElMessage, ElMessageBox } from 'element-plus'
import { User, Plus, CircleCheck, Select, VideoCameraFilled } from '@element-plus/icons-vue'

const props = defineProps({
  order: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update', 'close'])

const store = useFaultTrackingStore()
const technicians = store.technicians

// 状态映射函数
const getStatusType = (status) => {
  const map = { pending: 'warning', assigned: 'info', in_progress: 'primary', resolved: 'success', closed: '' }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = { pending: '待处理', assigned: '已分配', in_progress: '维修中', resolved: '已解决', closed: '已关闭' }
  return map[status] || status
}

const getFaultLevelType = (level) => {
  const map = { critical: 'danger', serious: 'warning', normal: 'info', minor: 'success' }
  return map[level] || 'info'
}

const getFaultLevelText = (level) => {
  const map = { critical: '高危', serious: '严重', normal: '一般', minor: '轻微' }
  return map[level] || level
}

const getPriorityType = (priority) => {
  const map = { high: 'danger', medium: 'warning', low: 'info' }
  return map[priority] || 'info'
}

const getPriorityText = (priority) => {
  const map = { high: '高', medium: '中', low: '低' }
  return map[priority] || priority
}

const getLogType = (action) => {
  const map = {
    '接受工单': 'primary',
    '开始维修': 'warning',
    '问题诊断': 'info',
    '更换部件': 'success',
    '完成维修': 'success',
    '验收通过': 'success',
    '关闭工单': 'info'
  }
  return map[action] || 'primary'
}

const getLogIcon = (action) => {
  const map = {
    '接受工单': 'User',
    '开始维修': 'VideoCamera',
    '问题诊断': 'Search',
    '更换部件': 'Tools',
    '完成维修': 'CircleCheck',
    '验收通过': 'Select',
    '关闭工单': 'Finished'
  }
  return map[action] || 'Document'
}

const isOvertime = (order) => {
  if (!order.actualTime || !order.estimatedTime) return false
  // 简单比较，实际应该转换为分钟数比较
  return order.actualTime.includes('小时') && parseInt(order.actualTime) > parseInt(order.estimatedTime)
}

// 分配维修人员
const showAssignDialog = ref(false)
const assignForm = ref({ technicianName: '' })

const confirmAssign = () => {
  if (!assignForm.value.technicianName) {
    ElMessage.warning('请选择维修人员')
    return
  }
  
  const success = store.assignWorkOrder(props.order.id, assignForm.value.technicianName)
  if (success) {
    ElMessage.success('分配成功')
    showAssignDialog.value = false
    emit('update')
  }
}

// 开始维修
const handleStart = async () => {
  try {
    await ElMessageBox.confirm('确认开始维修？', '开始维修', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const success = store.startMaintenance(props.order.id, props.order.assignedTo)
    if (success) {
      ElMessage.success('已开始维修')
      emit('update')
    }
  } catch {}
}

// 添加维修日志
const showLogDialog = ref(false)
const logForm = ref({ action: '', details: '' })

const confirmAddLog = () => {
  if (!logForm.value.action || !logForm.value.details) {
    ElMessage.warning('请填写完整信息')
    return
  }
  
  const success = store.addMaintenanceLog(props.order.id, {
    operator: props.order.assignedTo,
    action: logForm.value.action,
    details: logForm.value.details
  })
  
  if (success) {
    ElMessage.success('日志添加成功')
    showLogDialog.value = false
    logForm.value = { action: '', details: '' }
    emit('update')
  }
}

// 添加备件
const showPartDialog = ref(false)
const partForm = ref({ name: '', quantity: 1, unit: '个', price: 0 })

const confirmAddPart = () => {
  if (!partForm.value.name) {
    ElMessage.warning('请输入备件名称')
    return
  }
  
  const success = store.addSparePart(props.order.id, { ...partForm.value })
  if (success) {
    ElMessage.success('备件添加成功')
    showPartDialog.value = false
    partForm.value = { name: '', quantity: 1, unit: '个', price: 0 }
    emit('update')
  }
}

// 完成维修
const showCompleteDialog = ref(false)
const completeForm = ref({ actualTime: '', notes: '' })

const confirmComplete = () => {
  if (!completeForm.value.actualTime || !completeForm.value.notes) {
    ElMessage.warning('请填写完整信息')
    return
  }
  
  const success = store.resolveMaintenance(
    props.order.id,
    props.order.assignedTo,
    completeForm.value.actualTime,
    completeForm.value.notes
  )
  
  if (success) {
    ElMessage.success('维修完成')
    showCompleteDialog.value = false
    completeForm.value = { actualTime: '', notes: '' }
    emit('update')
  }
}

// 关闭工单
const handleClose = async () => {
  try {
    const { value } = await ElMessageBox.prompt('请输入验收意见', '验收关闭', {
      confirmButtonText: '确认关闭',
      cancelButtonText: '取消',
      inputPlaceholder: '验收通过，工单关闭'
    })
    
    const success = store.closeWorkOrder(props.order.id, '验收人', value)
    if (success) {
      ElMessage.success('工单已关闭')
      emit('update')
      emit('close')
    }
  } catch {}
}
</script>

<style scoped>
.work-order-detail {
  padding: 10px;
}

.fault-description {
  white-space: pre-wrap;
  line-height: 1.6;
}

.maintenance-plan {
  white-space: pre-wrap;
  font-family: inherit;
  line-height: 1.6;
  margin: 0;
}

.maintenance-timeline h3 {
  margin: 0 0 20px 0;
  font-size: 18px;
  color: #303133;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.log-content {
  color: #606266;
  line-height: 1.6;
}

.spare-parts h3 {
  margin: 0 0 15px 0;
  font-size: 18px;
  color: #303133;
}

.total-cost {
  text-align: right;
  padding: 15px;
  background: #f5f7fa;
  margin-top: 10px;
  border-radius: 4px;
  font-size: 16px;
}

.cost-value {
  color: #f56c6c;
  font-size: 20px;
  font-weight: bold;
  margin-left: 10px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

:deep(.el-descriptions__title) {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 15px;
}

:deep(.el-timeline-item__timestamp) {
  color: #909399;
  font-size: 13px;
}
</style>
