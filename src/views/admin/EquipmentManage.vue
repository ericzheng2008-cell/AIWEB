<template>
  <div class="equipment-manage">
    <div class="page-header">
      <h2><el-icon><Box /></el-icon> 设备全生命周期管理</h2>
      <el-button type="primary" @click="showAddDialog">
        <el-icon><Plus /></el-icon>添加设备
      </el-button>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-value">{{ equipmentStore.equipmentAssets.length }}</div>
          <div class="stat-label">设备总数</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-value">{{ equipmentStore.getRunningEquipment.length }}</div>
          <div class="stat-label">运行中</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-value">{{ equipmentStore.getMaintenanceDueEquipment.length }}</div>
          <div class="stat-label">待保养</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-value">¥{{ (equipmentStore.getTotalAssetValue / 10000).toFixed(0) }}万</div>
          <div class="stat-label">资产总值</div>
        </div>
      </el-col>
    </el-row>

    <!-- 筛选 -->
    <el-card class="filter-card">
      <el-row :gutter="16">
        <el-col :span="6">
          <el-input v-model="searchKeyword" placeholder="搜索设备名称/型号" clearable>
            <template #prefix><el-icon><Search /></el-icon></template>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-select v-model="filterCategory" placeholder="设备分类" clearable>
            <el-option label="全部分类" value="" />
            <el-option v-for="cat in equipmentStore.getAllCategories" :key="cat.id" 
                       :label="cat.name['zh-CN']" :value="cat.id" />
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-select v-model="filterStatus" placeholder="设备状态" clearable>
            <el-option label="全部状态" value="" />
            <el-option label="运行中" value="running" />
            <el-option label="维护中" value="maintenance" />
            <el-option label="闲置" value="idle" />
            <el-option label="故障" value="fault" />
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-button @click="resetFilter">重置</el-button>
          <el-button type="success" @click="exportData">
            <el-icon><Download /></el-icon>导出
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 设备列表 -->
    <el-card class="table-card">
      <el-table :data="filteredEquipment" stripe>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="id" label="设备编号" width="130" />
        <el-table-column prop="name" label="设备名称" min-width="150" />
        <el-table-column label="分类" width="100">
          <template #default="{ row }">
            <el-tag>{{ getCategoryName(row.category) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="型号" width="150">
          <template #default="{ row }">{{ row.manufacturer }} {{ row.model }}</template>
        </el-table-column>
        <el-table-column label="状态" width="90">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusText(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="位置" width="130" />
        <el-table-column label="采购价(万)" width="100">
          <template #default="{ row }">¥{{ (row.purchasePrice / 10000).toFixed(1) }}</template>
        </el-table-column>
        <el-table-column label="运行时长" width="100">
          <template #default="{ row }">{{ row.workingHours }}h</template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="viewDetail(row)">查看</el-button>
            <el-button size="small" type="primary" @click="editEquipment(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteEquipment(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="750px" @close="resetForm">
      <el-form :model="formData" label-width="100px" ref="formRef">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="设备名称" required>
              <el-input v-model="formData.name" placeholder="请输入设备名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="设备分类" required>
              <el-select v-model="formData.category" placeholder="选择分类" style="width:100%">
                <el-option v-for="cat in equipmentStore.getAllCategories" :key="cat.id" 
                           :label="cat.name['zh-CN']" :value="cat.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="制造商">
              <el-input v-model="formData.manufacturer" placeholder="如：ABB" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="型号">
              <el-input v-model="formData.model" placeholder="设备型号" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="序列号">
              <el-input v-model="formData.serialNumber" placeholder="设备序列号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="位置">
              <el-input v-model="formData.location" placeholder="如：车间A-1号线" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="采购日期">
              <el-date-picker v-model="formData.purchaseDate" type="date" style="width:100%" 
                              value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="安装日期">
              <el-date-picker v-model="formData.installDate" type="date" style="width:100%" 
                              value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="保修到期">
              <el-date-picker v-model="formData.warrantyEndDate" type="date" style="width:100%" 
                              value-format="YYYY-MM-DD" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="采购价(元)">
              <el-input-number v-model="formData.purchasePrice" :min="0" :step="1000" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-select v-model="formData.status" placeholder="选择状态" style="width:100%">
                <el-option label="运行中" value="running" />
                <el-option label="维护中" value="maintenance" />
                <el-option label="闲置" value="idle" />
                <el-option label="故障" value="fault" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="运行时长(h)">
              <el-input-number v-model="formData.workingHours" :min="0" style="width:100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="使用率(%)">
              <el-input-number v-model="formData.utilizationRate" :min="0" :max="100" style="width:100%" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailVisible" title="设备详情" width="800px">
      <div v-if="currentEquipment">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="设备编号">{{ currentEquipment.id }}</el-descriptions-item>
          <el-descriptions-item label="设备名称">{{ currentEquipment.name }}</el-descriptions-item>
          <el-descriptions-item label="分类">{{ getCategoryName(currentEquipment.category) }}</el-descriptions-item>
          <el-descriptions-item label="制造商">{{ currentEquipment.manufacturer }}</el-descriptions-item>
          <el-descriptions-item label="型号">{{ currentEquipment.model }}</el-descriptions-item>
          <el-descriptions-item label="序列号">{{ currentEquipment.serialNumber }}</el-descriptions-item>
          <el-descriptions-item label="位置">{{ currentEquipment.location }}</el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(currentEquipment.status)">{{ getStatusText(currentEquipment.status) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="采购日期">{{ currentEquipment.purchaseDate }}</el-descriptions-item>
          <el-descriptions-item label="采购价">¥{{ currentEquipment.purchasePrice.toLocaleString() }}</el-descriptions-item>
          <el-descriptions-item label="运行时长">{{ currentEquipment.workingHours }}h</el-descriptions-item>
          <el-descriptions-item label="使用率">{{ currentEquipment.utilizationRate }}%</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useEquipmentLifecycleStore } from '../../store'
import { ElMessage, ElMessageBox } from 'element-plus'

const equipmentStore = useEquipmentLifecycleStore()

const searchKeyword = ref('')
const filterCategory = ref('')
const filterStatus = ref('')
const dialogVisible = ref(false)
const detailVisible = ref(false)
const dialogMode = ref('add')
const currentEquipment = ref(null)
const formRef = ref(null)

const formData = ref({
  name: '',
  category: '',
  manufacturer: '',
  model: '',
  serialNumber: '',
  location: '',
  purchaseDate: '',
  installDate: '',
  warrantyEndDate: '',
  purchasePrice: 0,
  status: 'running',
  workingHours: 0,
  utilizationRate: 0,
  components: []
})

const dialogTitle = computed(() => dialogMode.value === 'add' ? '添加设备' : '编辑设备')

const filteredEquipment = computed(() => {
  let result = [...equipmentStore.equipmentAssets]
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(eq => 
      eq.name.toLowerCase().includes(keyword) ||
      eq.model.toLowerCase().includes(keyword) ||
      eq.serialNumber.toLowerCase().includes(keyword)
    )
  }
  
  if (filterCategory.value) {
    result = result.filter(eq => eq.category === filterCategory.value)
  }
  
  if (filterStatus.value) {
    result = result.filter(eq => eq.status === filterStatus.value)
  }
  
  return result
})

const getCategoryName = (categoryId) => {
  const category = equipmentStore.equipmentCategories[categoryId]
  return category ? category.name['zh-CN'] : categoryId
}

const getStatusText = (status) => {
  const statusMap = {
    running: '运行中',
    maintenance: '维护中',
    idle: '闲置',
    fault: '故障'
  }
  return statusMap[status] || status
}

const getStatusType = (status) => {
  const typeMap = {
    running: 'success',
    maintenance: 'warning',
    idle: 'info',
    fault: 'danger'
  }
  return typeMap[status] || ''
}

const showAddDialog = () => {
  dialogMode.value = 'add'
  resetForm()
  dialogVisible.value = true
}

const editEquipment = (row) => {
  dialogMode.value = 'edit'
  currentEquipment.value = row
  formData.value = { ...row }
  dialogVisible.value = true
}

const viewDetail = (row) => {
  currentEquipment.value = row
  detailVisible.value = true
}

const handleSubmit = () => {
  if (!formData.value.name || !formData.value.category) {
    ElMessage.warning('请填写必填项')
    return
  }
  
  if (dialogMode.value === 'add') {
    equipmentStore.addEquipment(formData.value)
    ElMessage.success('添加成功')
  } else {
    equipmentStore.updateEquipment(currentEquipment.value.id, formData.value)
    ElMessage.success('更新成功')
  }
  
  dialogVisible.value = false
}

const deleteEquipment = (row) => {
  ElMessageBox.confirm('确定要删除这个设备吗？', '确认删除', {
    type: 'warning'
  }).then(() => {
    equipmentStore.deleteEquipment(row.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const resetForm = () => {
  formData.value = {
    name: '',
    category: '',
    manufacturer: '',
    model: '',
    serialNumber: '',
    location: '',
    purchaseDate: '',
    installDate: '',
    warrantyEndDate: '',
    purchasePrice: 0,
    status: 'running',
    workingHours: 0,
    utilizationRate: 0,
    components: []
  }
}

const resetFilter = () => {
  searchKeyword.value = ''
  filterCategory.value = ''
  filterStatus.value = ''
}

const exportData = () => {
  ElMessage.info('导出功能开发中')
}
</script>

<style scoped>
.equipment-manage {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  display: flex;
  align-items: center;
  gap: 8px;
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
