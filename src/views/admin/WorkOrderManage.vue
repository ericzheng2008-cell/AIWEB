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
      <el-row :gutter="16" style="margin-bottom: 16px;">
        <el-col :span="6">
          <el-input v-model="searchKeyword" placeholder="搜索工单号/设备名称" clearable />
        </el-col>
        <el-col :span="6">
          <el-input v-model="customerNameKeyword" placeholder="搜索客户姓名" clearable />
        </el-col>
        <el-col :span="6">
          <el-input v-model="customerPhoneKeyword" placeholder="搜索客户手机号" clearable />
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="16">
        <el-col :span="6">
          <el-select v-model="filterStatus" placeholder="工单状态" clearable>
            <el-option label="全部状态" value="" />
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="in_progress" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="filterServiceStatus" placeholder="服务状态" clearable>
            <el-option label="全部服务状态" value="" />
            <el-option label="待服务" value="pending" />
            <el-option label="诊断中" value="diagnosing" />
            <el-option label="维修中" value="repairing" />
            <el-option label="测试中" value="testing" />
            <el-option label="已完成" value="completed" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="filterPriority" placeholder="优先级" clearable>
            <el-option label="全部优先级" value="" />
            <el-option label="低" value="low" />
            <el-option label="中" value="medium" />
            <el-option label="高" value="high" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="filterPartsStatus" placeholder="配件状态" clearable>
            <el-option label="全部配件状态" value="" />
            <el-option label="无需配件" value="not_required" />
            <el-option label="待订购" value="pending" />
            <el-option label="已订购" value="ordered" />
            <el-option label="运输中" value="in_transit" />
            <el-option label="已到货" value="received" />
          </el-select>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="table-card">
      <el-table :data="filteredWorkOrders" stripe>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="id" label="工单号" width="140" />
        <el-table-column label="客户信息" min-width="150">
          <template #default="{ row }">
            <div>{{ row.customerName || '-' }}</div>
            <div style="font-size: 12px; color: #999;">{{ row.customerPhone || '-' }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="faultType" label="故障类型" width="120" />
        <el-table-column prop="deviceName" label="设备名称" min-width="150" />
        <el-table-column label="优先级" width="90">
          <template #default="{ row }">
            <el-tag :type="getPriorityType(row.priority)">{{ getPriorityText(row.priority) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="工单状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="服务状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getServiceStatusType(row.serviceStatus)">
              {{ getServiceStatusText(row.serviceStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="配件状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getPartsStatusType(row.partsOrderStatus)" size="small">
              {{ getPartsStatusText(row.partsOrderStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reportedBy" label="报告人" width="100" />
        <el-table-column label="处理人" width="120">
          <template #default="{ row }">
            {{ row.assignedTo || '未分配' }}
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="viewDetail(row)">查看</el-button>
            <el-button size="small" type="primary" @click="editWorkOrder(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteWorkOrder(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="detailVisible" title="工单详情" width="900px">
      <div v-if="currentWorkOrder">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="基本信息" name="basic">
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
              <el-descriptions-item label="工单状态">
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
          </el-tab-pane>

          <el-tab-pane label="客户信息" name="customer">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="客户姓名">
                {{ currentWorkOrder.customerName || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="客户电话">
                {{ currentWorkOrder.customerPhone || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="客户公司" :span="2">
                {{ currentWorkOrder.customerCompany || '-' }}
              </el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>

          <el-tab-pane label="服务跟踪" name="service">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="服务状态">
                <el-tag :type="getServiceStatusType(currentWorkOrder.serviceStatus)">
                  {{ getServiceStatusText(currentWorkOrder.serviceStatus) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="配件订购状态">
                <el-tag :type="getPartsStatusType(currentWorkOrder.partsOrderStatus)">
                  {{ getPartsStatusText(currentWorkOrder.partsOrderStatus) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="配件订购详情" :span="2">
                {{ currentWorkOrder.partsOrderDetails || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="检测结果" :span="2">
                <div v-if="currentWorkOrder.inspectionResult">
                  <div><strong>结果：</strong>{{ currentWorkOrder.inspectionResult }}</div>
                  <div><strong>检测时间：</strong>{{ currentWorkOrder.inspectionTime }}</div>
                  <div><strong>检测人员：</strong>{{ currentWorkOrder.inspectionBy }}</div>
                </div>
                <span v-else>-</span>
              </el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>

          <el-tab-pane label="交付验收" name="delivery">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="交付状态">
                <el-tag :type="getDeliveryStatusType(currentWorkOrder.deliveryStatus)">
                  {{ getDeliveryStatusText(currentWorkOrder.deliveryStatus) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="验收状态">
                <el-tag :type="getAcceptanceStatusType(currentWorkOrder.acceptanceStatus)">
                  {{ getAcceptanceStatusText(currentWorkOrder.acceptanceStatus) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="交付时间">
                {{ currentWorkOrder.deliveryTime || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="交付人员">
                {{ currentWorkOrder.deliveryBy || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="验收时间">
                {{ currentWorkOrder.acceptanceTime || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="验收人员">
                {{ currentWorkOrder.acceptanceBy || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="验收备注" :span="2">
                {{ currentWorkOrder.acceptanceNotes || '-' }}
              </el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>

          <el-tab-pane label="人员信息" name="personnel">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="设备负责部门" :span="2">
                <el-tag type="success">{{ currentWorkOrder.deviceDepartment || '-' }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="设备管理人员">
                {{ currentWorkOrder.deviceManagerName || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="管理人员电话">
                {{ currentWorkOrder.deviceManagerPhone || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="维修人员">
                {{ currentWorkOrder.repairPersonName || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="维修人员电话">
                {{ currentWorkOrder.repairPersonPhone || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="供应商服务人员">
                {{ currentWorkOrder.supplierPersonName || '-' }}
              </el-descriptions-item>
              <el-descriptions-item label="供应商人员电话">
                {{ currentWorkOrder.supplierPersonPhone || '-' }}
              </el-descriptions-item>
            </el-descriptions>
          </el-tab-pane>

          <el-tab-pane label="维修日志" name="logs">
            <el-timeline v-if="currentWorkOrder.maintenanceLog && currentWorkOrder.maintenanceLog.length">
              <el-timeline-item
                v-for="(log, index) in currentWorkOrder.maintenanceLog"
                :key="index"
                :timestamp="log.time"
                placement="top"
              >
                <el-card>
                  <h4>{{ log.action }} - {{ log.operator }}</h4>
                  <p>{{ log.details }}</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
            <el-empty v-else description="暂无维修日志" />
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>

    <!-- 编辑工单对话框 -->
    <el-dialog v-model="editVisible" title="编辑工单" width="800px">
      <el-form :model="editForm" label-width="120px">
        <el-divider content-position="left">客户信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户姓名">
              <el-input v-model="editForm.customerName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户电话">
              <el-input v-model="editForm.customerPhone" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="客户公司">
          <el-input v-model="editForm.customerCompany" />
        </el-form-item>

        <el-divider content-position="left">服务跟踪</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="服务状态">
              <el-select v-model="editForm.serviceStatus" style="width: 100%">
                <el-option label="待服务" value="pending" />
                <el-option label="诊断中" value="diagnosing" />
                <el-option label="维修中" value="repairing" />
                <el-option label="测试中" value="testing" />
                <el-option label="已完成" value="completed" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="配件订购状态">
              <el-select v-model="editForm.partsOrderStatus" style="width: 100%">
                <el-option label="无需配件" value="not_required" />
                <el-option label="待订购" value="pending" />
                <el-option label="已订购" value="ordered" />
                <el-option label="运输中" value="in_transit" />
                <el-option label="已到货" value="received" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="配件订购详情">
          <el-input v-model="editForm.partsOrderDetails" type="textarea" :rows="2" />
        </el-form-item>

        <el-divider content-position="left">检测结果</el-divider>
        <el-form-item label="检测结果">
          <el-input v-model="editForm.inspectionResult" type="textarea" :rows="3" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="检测人员">
              <el-input v-model="editForm.inspectionBy" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">交付验收</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="交付状态">
              <el-select v-model="editForm.deliveryStatus" style="width: 100%">
                <el-option label="未交付" value="not_delivered" />
                <el-option label="已交付" value="delivered" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="验收状态">
              <el-select v-model="editForm.acceptanceStatus" style="width: 100%">
                <el-option label="未验收" value="not_accepted" />
                <el-option label="已验收" value="accepted" />
                <el-option label="已拒绝" value="rejected" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="验收备注">
          <el-input v-model="editForm.acceptanceNotes" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useFaultTrackingStore } from '../../store'
import { ElMessage, ElMessageBox } from 'element-plus'

const faultStore = useFaultTrackingStore()

const searchKeyword = ref('')
const customerNameKeyword = ref('')
const customerPhoneKeyword = ref('')
const filterStatus = ref('')
const filterServiceStatus = ref('')
const filterPriority = ref('')
const filterPartsStatus = ref('')
const detailVisible = ref(false)
const editVisible = ref(false)
const currentWorkOrder = ref(null)
const activeTab = ref('basic')
const editForm = ref({})

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
  
  // 基础搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(wo => 
      wo.id.toLowerCase().includes(keyword) ||
      wo.faultType.toLowerCase().includes(keyword) ||
      wo.deviceName.toLowerCase().includes(keyword)
    )
  }
  
  // 客户姓名搜索
  if (customerNameKeyword.value) {
    const keyword = customerNameKeyword.value.toLowerCase()
    result = result.filter(wo => 
      wo.customerName && wo.customerName.toLowerCase().includes(keyword)
    )
  }
  
  // 客户手机号搜索
  if (customerPhoneKeyword.value) {
    const keyword = customerPhoneKeyword.value
    result = result.filter(wo => 
      wo.customerPhone && wo.customerPhone.includes(keyword)
    )
  }
  
  // 工单状态筛选
  if (filterStatus.value) {
    if (filterStatus.value === 'in_progress') {
      result = result.filter(wo => ['assigned', 'in_progress'].includes(wo.status))
    } else if (filterStatus.value === 'completed') {
      result = result.filter(wo => ['resolved', 'closed'].includes(wo.status))
    } else {
      result = result.filter(wo => wo.status === filterStatus.value)
    }
  }
  
  // 服务状态筛选
  if (filterServiceStatus.value) {
    result = result.filter(wo => wo.serviceStatus === filterServiceStatus.value)
  }
  
  // 优先级筛选
  if (filterPriority.value) {
    result = result.filter(wo => wo.priority === filterPriority.value)
  }
  
  // 配件状态筛选
  if (filterPartsStatus.value) {
    result = result.filter(wo => wo.partsOrderStatus === filterPartsStatus.value)
  }
  
  return result
})

const handleSearch = () => {
  // 触发计算属性重新计算
  ElMessage.success(`找到 ${filteredWorkOrders.value.length} 条工单`)
}

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

const getServiceStatusText = (status) => {
  const statusMap = {
    pending: '待服务',
    diagnosing: '诊断中',
    repairing: '维修中',
    testing: '测试中',
    completed: '已完成'
  }
  return statusMap[status] || status
}

const getServiceStatusType = (status) => {
  const typeMap = {
    pending: 'warning',
    diagnosing: 'primary',
    repairing: 'primary',
    testing: '',
    completed: 'success'
  }
  return typeMap[status] || ''
}

const getPartsStatusText = (status) => {
  const statusMap = {
    not_required: '无需配件',
    pending: '待订购',
    ordered: '已订购',
    in_transit: '运输中',
    received: '已到货'
  }
  return statusMap[status] || status
}

const getPartsStatusType = (status) => {
  const typeMap = {
    not_required: 'info',
    pending: 'warning',
    ordered: 'primary',
    in_transit: '',
    received: 'success'
  }
  return typeMap[status] || ''
}

const getDeliveryStatusText = (status) => {
  const statusMap = {
    not_delivered: '未交付',
    delivered: '已交付'
  }
  return statusMap[status] || status
}

const getDeliveryStatusType = (status) => {
  const typeMap = {
    not_delivered: 'warning',
    delivered: 'success'
  }
  return typeMap[status] || ''
}

const getAcceptanceStatusText = (status) => {
  const statusMap = {
    not_accepted: '未验收',
    accepted: '已验收',
    rejected: '已拒绝'
  }
  return statusMap[status] || status
}

const getAcceptanceStatusType = (status) => {
  const typeMap = {
    not_accepted: 'warning',
    accepted: 'success',
    rejected: 'danger'
  }
  return typeMap[status] || ''
}

const showAddDialog = () => {
  ElMessage.info('请使用前台页面创建工单')
}

const viewDetail = (row) => {
  currentWorkOrder.value = row
  activeTab.value = 'basic'
  detailVisible.value = true
}

const editWorkOrder = (row) => {
  currentWorkOrder.value = row
  editForm.value = {
    customerName: row.customerName,
    customerPhone: row.customerPhone,
    customerCompany: row.customerCompany,
    serviceStatus: row.serviceStatus,
    partsOrderStatus: row.partsOrderStatus,
    partsOrderDetails: row.partsOrderDetails,
    inspectionResult: row.inspectionResult,
    inspectionBy: row.inspectionBy,
    deliveryStatus: row.deliveryStatus,
    acceptanceStatus: row.acceptanceStatus,
    acceptanceNotes: row.acceptanceNotes
  }
  editVisible.value = true
}

const saveEdit = () => {
  const success = faultStore.updateWorkOrder(currentWorkOrder.value.id, editForm.value)
  if (success) {
    ElMessage.success('保存成功')
    editVisible.value = false
  } else {
    ElMessage.error('保存失败')
  }
}

const deleteWorkOrder = (row) => {
  ElMessageBox.confirm('确定要删除这个工单吗？', '确认删除', {
    type: 'warning'
  }).then(() => {
    const success = faultStore.deleteWorkOrder(row.id)
    if (success) {
      ElMessage.success('删除成功')
    } else {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

const resetFilter = () => {
  searchKeyword.value = ''
  customerNameKeyword.value = ''
  customerPhoneKeyword.value = ''
  filterStatus.value = ''
  filterServiceStatus.value = ''
  filterPriority.value = ''
  filterPartsStatus.value = ''
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
