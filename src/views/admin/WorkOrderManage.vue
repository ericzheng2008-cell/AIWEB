<template>
  <div class="work-order-manage">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <div>
            <el-icon><List /></el-icon>
            <span>工单管理</span>
          </div>
          <el-button type="primary" @click="showCreateDialog = true">
            <el-icon><Plus /></el-icon>
            创建工单
          </el-button>
        </div>
      </template>

      <!-- 搜索筛选 -->
      <el-form :model="searchForm" inline class="search-form">
        <el-form-item label="工单号">
          <el-input v-model="searchForm.orderNumber" placeholder="输入工单号" clearable />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="输入手机号" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="选择状态" clearable>
            <el-option 
              v-for="option in workOrderStore.statusOptions" 
              :key="option.value" 
              :label="option.label" 
              :value="option.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 工单列表 -->
      <el-table :data="filteredOrders" border stripe v-loading="loading">
        <el-table-column prop="orderNumber" label="工单号" width="160" fixed />
        <el-table-column prop="customerName" label="客户姓名" width="100" />
        <el-table-column prop="contactPhone" label="联系电话" width="120" />
        <el-table-column prop="deviceModel" label="设备型号" width="150" />
        <el-table-column label="状态" width="130">
          <template #default="{ row }">
            <el-tag :color="workOrderStore.getStatusColor(row.status)" style="color: #fff;">
              {{ workOrderStore.getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="配件数量" width="100" align="center">
          <template #default="{ row }">
            <el-badge :value="row.parts ? row.parts.length : 0" type="primary">
              <el-icon><Box /></el-icon>
            </el-badge>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="viewDetail(row)">
              <el-icon><View /></el-icon>
              查看
            </el-button>
            <el-button link type="primary" size="small" @click="editStatus(row)">
              <el-icon><Edit /></el-icon>
              更新状态
            </el-button>
            <el-button link type="primary" size="small" @click="manageParts(row)">
              <el-icon><Box /></el-icon>
              配件管理
            </el-button>
            <el-button link type="danger" size="small" @click="deleteOrder(row)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 统计信息 -->
      <div class="statistics">
        <el-row :gutter="20">
          <el-col :span="6" v-for="(value, key) in workOrderStore.statusStatistics" :key="key">
            <el-statistic 
              :title="workOrderStore.getStatusLabel(key)" 
              :value="value"
              :value-style="{ color: workOrderStore.getStatusColor(key) }" />
          </el-col>
        </el-row>
      </div>
    </el-card>

    <!-- 创建工单对话框 -->
    <el-dialog v-model="showCreateDialog" title="创建工单" width="700px">
      <el-form :model="createForm" :rules="createRules" ref="createFormRef" label-width="120px">
        <el-form-item label="客户姓名" prop="customerName">
          <el-input v-model="createForm.customerName" placeholder="请输入客户姓名" />
        </el-form-item>
        <el-form-item label="联系电话" prop="contactPhone">
          <el-input v-model="createForm.contactPhone" placeholder="请输入联系电话" maxlength="11" />
        </el-form-item>
        <el-form-item label="设备型号" prop="deviceModel">
          <el-input v-model="createForm.deviceModel" placeholder="请输入设备型号" />
        </el-form-item>
        <el-form-item label="设备序列号">
          <el-input v-model="createForm.deviceSN" placeholder="请输入设备序列号" />
        </el-form-item>
        <el-form-item label="故障描述" prop="faultDescription">
          <el-input 
            v-model="createForm.faultDescription" 
            type="textarea" 
            :rows="4" 
            placeholder="请描述故障现象" />
        </el-form-item>
        <el-form-item label="预计完成时间">
          <el-date-picker 
            v-model="createForm.estimatedCompletion" 
            type="date" 
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">创建</el-button>
      </template>
    </el-dialog>

    <!-- 更新状态对话框 -->
    <el-dialog v-model="showStatusDialog" title="更新工单状态" width="600px">
      <el-form :model="statusForm" label-width="100px">
        <el-form-item label="当前状态">
          <el-tag :color="workOrderStore.getStatusColor(statusForm.currentStatus)" style="color: #fff;">
            {{ workOrderStore.getStatusLabel(statusForm.currentStatus) }}
          </el-tag>
        </el-form-item>
        <el-form-item label="新状态" required>
          <el-select v-model="statusForm.newStatus" placeholder="选择新状态">
            <el-option 
              v-for="option in workOrderStore.statusOptions" 
              :key="option.value" 
              :label="option.label" 
              :value="option.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input 
            v-model="statusForm.note" 
            type="textarea" 
            :rows="3" 
            placeholder="填写状态变更说明（可选）" />
        </el-form-item>
        <el-form-item label="操作人">
          <el-input v-model="statusForm.operator" placeholder="输入操作人姓名" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showStatusDialog = false">取消</el-button>
        <el-button type="primary" @click="handleUpdateStatus">确认更新</el-button>
      </template>
    </el-dialog>

    <!-- 配件管理对话框 -->
    <el-dialog v-model="showPartsDialog" title="配件管理" width="900px">
      <div v-if="currentOrder">
        <div class="parts-header">
          <h3>工单号: {{ currentOrder.orderNumber }}</h3>
          <el-button type="primary" size="small" @click="showAddPartDialog = true">
            <el-icon><Plus /></el-icon>
            添加配件
          </el-button>
        </div>
        
        <el-table :data="currentOrder.parts || []" border>
          <el-table-column prop="name" label="配件名称" />
          <el-table-column prop="partNumber" label="零件编号" width="120" />
          <el-table-column prop="quantity" label="数量" width="80" align="center" />
          <el-table-column label="状态" width="120">
            <template #default="{ row }">
              <el-tag :color="workOrderStore.getPartsStatusColor(row.status)" size="small" style="color: #fff;">
                {{ workOrderStore.getPartsStatusLabel(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="supplier" label="供应商" width="120" />
          <el-table-column prop="estimatedArrival" label="预计到货" width="110" />
          <el-table-column label="操作" width="150">
            <template #default="{ row, $index }">
              <el-button link type="primary" size="small" @click="editPartStatus(row, $index)">
                更新状态
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 添加配件对话框 -->
    <el-dialog v-model="showAddPartDialog" title="添加配件" width="600px">
      <el-form :model="partForm" :rules="partRules" ref="partFormRef" label-width="100px">
        <el-form-item label="配件名称" prop="name">
          <el-input v-model="partForm.name" placeholder="请输入配件名称" />
        </el-form-item>
        <el-form-item label="零件编号">
          <el-input v-model="partForm.partNumber" placeholder="请输入零件编号" />
        </el-form-item>
        <el-form-item label="数量" prop="quantity">
          <el-input-number v-model="partForm.quantity" :min="1" />
        </el-form-item>
        <el-form-item label="供应商">
          <el-input v-model="partForm.supplier" placeholder="请输入供应商名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddPartDialog = false">取消</el-button>
        <el-button type="primary" @click="handleAddPart">添加</el-button>
      </template>
    </el-dialog>

    <!-- 更新配件状态对话框 -->
    <el-dialog v-model="showPartStatusDialog" title="更新配件状态" width="600px">
      <el-form :model="partStatusForm" label-width="100px">
        <el-form-item label="配件名称">
          <el-text>{{ partStatusForm.partName }}</el-text>
        </el-form-item>
        <el-form-item label="当前状态">
          <el-tag :color="workOrderStore.getPartsStatusColor(partStatusForm.currentStatus)" size="small" style="color: #fff;">
            {{ workOrderStore.getPartsStatusLabel(partStatusForm.currentStatus) }}
          </el-tag>
        </el-form-item>
        <el-form-item label="新状态" required>
          <el-select v-model="partStatusForm.newStatus" placeholder="选择新状态">
            <el-option 
              v-for="option in workOrderStore.partsStatusOptions" 
              :key="option.value" 
              :label="option.label" 
              :value="option.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="预计到货日期">
          <el-date-picker 
            v-model="partStatusForm.estimatedArrival" 
            type="date" 
            placeholder="选择日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD" />
        </el-form-item>
        <el-form-item label="物流单号">
          <el-input v-model="partStatusForm.trackingNumber" placeholder="输入物流单号（可选）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPartStatusDialog = false">取消</el-button>
        <el-button type="primary" @click="handleUpdatePartStatus">确认更新</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useWorkOrderStore } from '../../store/workOrder'

const workOrderStore = useWorkOrderStore()

// 搜索表单
const searchForm = ref({
  orderNumber: '',
  phone: '',
  status: ''
})

// 加载状态
const loading = ref(false)

// 创建工单
const showCreateDialog = ref(false)
const createForm = ref({
  customerName: '',
  contactPhone: '',
  deviceModel: '',
  deviceSN: '',
  faultDescription: '',
  estimatedCompletion: ''
})
const createFormRef = ref(null)
const createRules = {
  customerName: [{ required: true, message: '请输入客户姓名', trigger: 'blur' }],
  contactPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  deviceModel: [{ required: true, message: '请输入设备型号', trigger: 'blur' }],
  faultDescription: [{ required: true, message: '请描述故障现象', trigger: 'blur' }]
}

// 更新状态
const showStatusDialog = ref(false)
const statusForm = ref({
  orderId: '',
  currentStatus: '',
  newStatus: '',
  note: '',
  operator: ''
})

// 配件管理
const showPartsDialog = ref(false)
const currentOrder = ref(null)
const showAddPartDialog = ref(false)
const partForm = ref({
  name: '',
  partNumber: '',
  quantity: 1,
  supplier: ''
})
const partFormRef = ref(null)
const partRules = {
  name: [{ required: true, message: '请输入配件名称', trigger: 'blur' }],
  quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }]
}

// 配件状态更新
const showPartStatusDialog = ref(false)
const partStatusForm = ref({
  partIndex: -1,
  partName: '',
  currentStatus: '',
  newStatus: '',
  estimatedArrival: '',
  trackingNumber: ''
})

// 过滤后的工单列表
const filteredOrders = computed(() => {
  let orders = workOrderStore.workOrders
  
  if (searchForm.value.orderNumber) {
    orders = orders.filter(order => 
      order.orderNumber.includes(searchForm.value.orderNumber)
    )
  }
  
  if (searchForm.value.phone) {
    orders = orders.filter(order => 
      order.contactPhone.includes(searchForm.value.phone)
    )
  }
  
  if (searchForm.value.status) {
    orders = orders.filter(order => order.status === searchForm.value.status)
  }
  
  return orders
})

// 搜索
const handleSearch = () => {
  // 已通过computed自动过滤
}

// 重置
const handleReset = () => {
  searchForm.value = {
    orderNumber: '',
    phone: '',
    status: ''
  }
}

// 查看详情
const viewDetail = (order) => {
  ElMessageBox.alert(`
    <div style="line-height: 2;">
      <strong>工单号：</strong>${order.orderNumber}<br>
      <strong>客户：</strong>${order.customerName}<br>
      <strong>设备：</strong>${order.deviceModel}<br>
      <strong>故障：</strong>${order.faultDescription || '-'}<br>
      <strong>状态：</strong>${workOrderStore.getStatusLabel(order.status)}
    </div>
  `, '工单详情', {
    dangerouslyUseHTMLString: true,
    confirmButtonText: '关闭'
  })
}

// 编辑状态
const editStatus = (order) => {
  statusForm.value = {
    orderId: order.id,
    currentStatus: order.status,
    newStatus: '',
    note: '',
    operator: '管理员'
  }
  showStatusDialog.value = true
}

// 更新状态
const handleUpdateStatus = () => {
  if (!statusForm.value.newStatus) {
    ElMessage.warning('请选择新状态')
    return
  }
  
  const success = workOrderStore.updateOrderStatus(
    statusForm.value.orderId,
    statusForm.value.newStatus,
    statusForm.value.note,
    statusForm.value.operator
  )
  
  if (success) {
    ElMessage.success('状态更新成功')
    showStatusDialog.value = false
  } else {
    ElMessage.error('状态更新失败')
  }
}

// 配件管理
const manageParts = (order) => {
  currentOrder.value = order
  showPartsDialog.value = true
}

// 添加配件
const handleAddPart = async () => {
  try {
    await partFormRef.value.validate()
    
    const success = workOrderStore.addPart(currentOrder.value.id, partForm.value)
    
    if (success) {
      ElMessage.success('配件添加成功')
      showAddPartDialog.value = false
      partForm.value = {
        name: '',
        partNumber: '',
        quantity: 1,
        supplier: ''
      }
    } else {
      ElMessage.error('配件添加失败')
    }
  } catch (error) {
    console.log('验证失败:', error)
  }
}

// 编辑配件状态
const editPartStatus = (part, index) => {
  partStatusForm.value = {
    partIndex: index,
    partName: part.name,
    currentStatus: part.status,
    newStatus: '',
    estimatedArrival: part.estimatedArrival || '',
    trackingNumber: part.trackingNumber || ''
  }
  showPartStatusDialog.value = true
}

// 更新配件状态
const handleUpdatePartStatus = () => {
  if (!partStatusForm.value.newStatus) {
    ElMessage.warning('请选择新状态')
    return
  }
  
  const success = workOrderStore.updatePartsStatus(
    currentOrder.value.id,
    partStatusForm.value.partIndex,
    partStatusForm.value.newStatus,
    partStatusForm.value.estimatedArrival
  )
  
  if (success) {
    // 更新物流单号
    if (partStatusForm.value.trackingNumber) {
      const part = currentOrder.value.parts[partStatusForm.value.partIndex]
      part.trackingNumber = partStatusForm.value.trackingNumber
      workOrderStore.saveToLocalStorage()
    }
    
    ElMessage.success('配件状态更新成功')
    showPartStatusDialog.value = false
  } else {
    ElMessage.error('配件状态更新失败')
  }
}

// 创建工单
const handleCreate = async () => {
  try {
    await createFormRef.value.validate()
    
    const newOrder = workOrderStore.createWorkOrder({
      ...createForm.value,
      creator: '管理员'
    })
    
    ElMessage.success(`工单创建成功！工单号：${newOrder.orderNumber}`)
    showCreateDialog.value = false
    createForm.value = {
      customerName: '',
      contactPhone: '',
      deviceModel: '',
      deviceSN: '',
      faultDescription: '',
      estimatedCompletion: ''
    }
  } catch (error) {
    console.log('验证失败:', error)
  }
}

// 删除工单
const deleteOrder = (order) => {
  ElMessageBox.confirm(
    `确定要删除工单 ${order.orderNumber} 吗？此操作不可恢复！`,
    '警告',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const success = workOrderStore.deleteOrder(order.id)
    if (success) {
      ElMessage.success('工单已删除')
    } else {
      ElMessage.error('删除失败')
    }
  }).catch(() => {
    // 用户取消
  })
}

// 格式化日期时间
const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

// 组件挂载时初始化数据
onMounted(() => {
  workOrderStore.initDemoData()
})
</script>

<style scoped>
.work-order-manage {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header > div {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
}

.search-form {
  margin-bottom: 20px;
}

.statistics {
  margin-top: 24px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.parts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.parts-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}
</style>
