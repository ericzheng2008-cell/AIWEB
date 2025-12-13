<template>
  <div class="tool-brand-database">
    <el-card class="header-card">
      <div class="header">
        <div>
          <h2>品牌型号数据库</h2>
          <p class="subtitle">管理工具品牌型号参数数据，支持智能匹配推荐</p>
        </div>
        <el-button type="primary" size="large" @click="showAddDialog">
          <el-icon><Plus /></el-icon>
          添加工具
        </el-button>
      </div>
    </el-card>

    <!-- 搜索和筛选 -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="品牌">
          <el-select v-model="filterForm.brand" placeholder="全部品牌" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="EQTCF" value="EQTCF" />
            <el-option label="博世" value="博世" />
          </el-select>
        </el-form-item>
        <el-form-item label="工具类型">
          <el-select v-model="filterForm.toolType" placeholder="全部类型" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="锂电池" value="锂电池" />
            <el-option label="有线电动" value="有线电动" />
          </el-select>
        </el-form-item>
        <el-form-item label="控制类型">
          <el-select v-model="filterForm.controlType" placeholder="全部控制" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="离合器" value="离合器" />
            <el-option label="油压脉冲" value="油压脉冲" />
            <el-option label="电脉冲" value="电脉冲" />
            <el-option label="直驱" value="直驱" />
          </el-select>
        </el-form-item>
        <el-form-item label="扭矩范围">
          <el-select v-model="filterForm.torqueRange" placeholder="全部范围" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="1-5Nm" value="1-5Nm" />
            <el-option label="5-8Nm" value="5-8Nm" />
            <el-option label="6-12Nm" value="6-12Nm" />
            <el-option label="5-10Nm" value="5-10Nm" />
            <el-option label="20-30Nm" value="20-30Nm" />
            <el-option label="25-35Nm" value="25-35Nm" />
            <el-option label="30-45Nm" value="30-45Nm" />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="filterForm.keyword" placeholder="型号/名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleFilter">搜索</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 工具列表 -->
    <el-card class="table-card">
      <el-table :data="filteredTools" stripe style="width: 100%" max-height="600">
        <el-table-column prop="model" label="型号" width="140" fixed />
        <el-table-column prop="name" label="名称" width="200" />
        <el-table-column prop="brand" label="品牌" width="100" />
        <el-table-column prop="toolType" label="工具类型" width="100" />
        <el-table-column prop="controlType" label="控制类型" width="110">
          <template #default="scope">
            <el-tag size="small" :type="getControlTypeColor(scope.row.controlType)">
              {{ scope.row.controlType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="torqueRange" label="扭矩范围" width="120">
          <template #default="scope">
            <el-tag size="small" type="warning">{{ scope.row.torqueRange }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="规格参数" width="250">
          <template #default="scope">
            <div class="spec-info">
              <span>供电: {{ scope.row.specifications.power }}</span>
              <span>转速: {{ scope.row.specifications.speed }}</span>
              <span>重量: {{ scope.row.specifications.weight }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="特性" width="180">
          <template #default="scope">
            <div class="features">
              <el-tag v-if="scope.row.features.portable" size="small" type="success">便携</el-tag>
              <el-tag v-if="scope.row.features.adjustable" size="small" type="info">可调</el-tag>
              <el-tag v-if="scope.row.features.digital" size="small" type="primary">数字化</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格(¥)" width="100" />
        <el-table-column prop="stock" label="库存" width="80" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button size="small" type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" link @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑工具' : '添加工具'"
      width="900px"
      :close-on-click-modal="false"
    >
      <el-form :model="formData" label-width="120px" ref="formRef" :rules="formRules">
        <el-divider content-position="left">基本信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="品牌" prop="brand">
              <el-select v-model="formData.brand" placeholder="请选择品牌">
                <el-option label="EQTCF" value="EQTCF" />
                <el-option label="博世" value="博世" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工具型号" prop="model">
              <el-input v-model="formData.model" placeholder="如：ETBP10-42" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="工具名称" prop="name">
          <el-input v-model="formData.name" placeholder="如：EQTCF锂电池离合器拧紧工具" />
        </el-form-item>

        <el-form-item label="描述说明" prop="description">
          <el-input type="textarea" v-model="formData.description" :rows="2" placeholder="请输入工具描述" />
        </el-form-item>

        <el-divider content-position="left">工具参数</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="工具类型" prop="toolType">
              <el-select v-model="formData.toolType" placeholder="请选择">
                <el-option label="锂电池" value="锂电池" />
                <el-option label="有线电动" value="有线电动" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="控制类型" prop="controlType">
              <el-select v-model="formData.controlType" placeholder="请选择">
                <el-option label="离合器" value="离合器" />
                <el-option label="油压脉冲" value="油压脉冲" />
                <el-option label="电脉冲" value="电脉冲" />
                <el-option label="直驱" value="直驱" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="扭矩范围" prop="torqueRange">
              <el-select v-model="formData.torqueRange" placeholder="请选择">
                <el-option label="1-5Nm" value="1-5Nm" />
                <el-option label="5-8Nm" value="5-8Nm" />
                <el-option label="6-12Nm" value="6-12Nm" />
                <el-option label="5-10Nm" value="5-10Nm" />
                <el-option label="20-30Nm" value="20-30Nm" />
                <el-option label="25-35Nm" value="25-35Nm" />
                <el-option label="30-45Nm" value="30-45Nm" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">详细规格</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="供电方式" prop="specifications.power">
              <el-input v-model="formData.specifications.power" placeholder="如：锂电池" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="控制方式" prop="specifications.control">
              <el-input v-model="formData.specifications.control" placeholder="如：离合器" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="最小扭矩" prop="specifications.minTorque">
              <el-input-number v-model="formData.specifications.minTorque" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最大扭矩" prop="specifications.maxTorque">
              <el-input-number v-model="formData.specifications.maxTorque" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="单位" prop="specifications.unit">
              <el-input v-model="formData.specifications.unit" placeholder="Nm" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="重量" prop="specifications.weight">
              <el-input v-model="formData.specifications.weight" placeholder="如：1.2kg" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="转速" prop="specifications.speed">
              <el-input v-model="formData.specifications.speed" placeholder="如：0-800 rpm" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="电压" prop="specifications.voltage">
              <el-input v-model="formData.specifications.voltage" placeholder="如：220V（可选）" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">工具特性</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="便携性">
              <el-switch v-model="formData.features.portable" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="可调节">
              <el-switch v-model="formData.features.adjustable" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数字化">
              <el-switch v-model="formData.features.digital" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">应用场景与价格</el-divider>
        <el-form-item label="应用场景">
          <el-select v-model="formData.applications" multiple placeholder="请选择应用场景" style="width: 100%">
            <el-option label="精密装配" value="精密装配" />
            <el-option label="电子设备" value="电子设备" />
            <el-option label="小型部件" value="小型部件" />
            <el-option label="汽车装配" value="汽车装配" />
            <el-option label="机械装配" value="机械装配" />
            <el-option label="中型部件" value="中型部件" />
            <el-option label="底盘装配" value="底盘装配" />
            <el-option label="通用装配" value="通用装配" />
            <el-option label="快速装配" value="快速装配" />
            <el-option label="重型装配" value="重型装配" />
            <el-option label="发动机装配" value="发动机装配" />
            <el-option label="大型部件" value="大型部件" />
            <el-option label="悬挂系统" value="悬挂系统" />
            <el-option label="超重型装配" value="超重型装配" />
            <el-option label="底盘总成" value="底盘总成" />
            <el-option label="超大型部件" value="超大型部件" />
          </el-select>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="价格" prop="price">
              <el-input-number v-model="formData.price" :min="0" :precision="2" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="库存" prop="stock">
              <el-input-number v-model="formData.stock" :min="0" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToolBrandDatabaseStore } from '@/store/toolBrandDatabase'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const toolBrandStore = useToolBrandDatabaseStore()

// 筛选表单
const filterForm = ref({
  brand: '',
  toolType: '',
  controlType: '',
  torqueRange: '',
  keyword: ''
})

// 对话框
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)

// 表单数据
const formData = ref({
  brand: '',
  toolType: '',
  controlType: '',
  torqueRange: '',
  model: '',
  name: '',
  description: '',
  specifications: {
    power: '',
    control: '',
    minTorque: 0,
    maxTorque: 0,
    unit: 'Nm',
    weight: '',
    speed: '',
    voltage: ''
  },
  features: {
    portable: false,
    adjustable: false,
    digital: false
  },
  applications: [],
  price: 0,
  stock: 0
})

// 表单验证规则
const formRules = {
  brand: [{ required: true, message: '请选择品牌', trigger: 'change' }],
  toolType: [{ required: true, message: '请选择工具类型', trigger: 'change' }],
  controlType: [{ required: true, message: '请选择控制类型', trigger: 'change' }],
  torqueRange: [{ required: true, message: '请选择扭矩范围', trigger: 'change' }],
  model: [{ required: true, message: '请输入工具型号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入工具名称', trigger: 'blur' }]
}

// 筛选后的工具列表
const filteredTools = computed(() => {
  let result = toolBrandStore.allTools

  if (filterForm.value.brand) {
    result = result.filter(t => t.brand === filterForm.value.brand)
  }
  if (filterForm.value.toolType) {
    result = result.filter(t => t.toolType === filterForm.value.toolType)
  }
  if (filterForm.value.controlType) {
    result = result.filter(t => t.controlType === filterForm.value.controlType)
  }
  if (filterForm.value.torqueRange) {
    result = result.filter(t => t.torqueRange === filterForm.value.torqueRange)
  }
  if (filterForm.value.keyword) {
    const keyword = filterForm.value.keyword.toLowerCase()
    result = result.filter(t => 
      t.model.toLowerCase().includes(keyword) ||
      t.name.toLowerCase().includes(keyword)
    )
  }

  return result
})

// 获取控制类型颜色
const getControlTypeColor = (type) => {
  const colors = {
    '离合器': 'success',
    '油压脉冲': 'danger',
    '电脉冲': 'warning',
    '直驱': 'primary'
  }
  return colors[type] || 'info'
}

// 显示添加对话框
const showAddDialog = () => {
  isEdit.value = false
  resetForm()
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  isEdit.value = true
  formData.value = JSON.parse(JSON.stringify(row))
  dialogVisible.value = true
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(
    `确定要删除工具 ${row.model} - ${row.name} 吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    toolBrandStore.deleteTool(row.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 提交表单
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      if (isEdit.value) {
        toolBrandStore.updateTool(formData.value.id, formData.value)
        ElMessage.success('更新成功')
      } else {
        toolBrandStore.addTool(formData.value)
        ElMessage.success('添加成功')
      }
      dialogVisible.value = false
    }
  })
}

// 筛选
const handleFilter = () => {
  // computed 会自动更新
}

// 重置筛选
const resetFilter = () => {
  filterForm.value = {
    brand: '',
    toolType: '',
    controlType: '',
    torqueRange: '',
    keyword: ''
  }
}

// 重置表单
const resetForm = () => {
  formData.value = {
    brand: '',
    toolType: '',
    controlType: '',
    torqueRange: '',
    model: '',
    name: '',
    description: '',
    specifications: {
      power: '',
      control: '',
      minTorque: 0,
      maxTorque: 0,
      unit: 'Nm',
      weight: '',
      speed: '',
      voltage: ''
    },
    features: {
      portable: false,
      adjustable: false,
      digital: false
    },
    applications: [],
    price: 0,
    stock: 0
  }
}
</script>

<style scoped>
.tool-brand-database {
  padding: 20px;
}

.header-card {
  margin-bottom: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h2 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.subtitle {
  margin: 8px 0 0 0;
  color: #909399;
  font-size: 14px;
}

.filter-card {
  margin-bottom: 20px;
}

.table-card {
  margin-bottom: 20px;
}

.spec-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #606266;
}

.features {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

:deep(.el-form-item) {
  margin-bottom: 18px;
}

:deep(.el-divider) {
  margin: 24px 0 16px 0;
}

:deep(.el-dialog__body) {
  max-height: 600px;
  overflow-y: auto;
}
</style>
