<template>
  <div class="socket-database">
    <el-card class="header-card">
      <div class="header">
        <div>
          <h2>套筒选型数据库</h2>
          <p class="subtitle">管理和维护套筒选型数据，支持智能推荐</p>
        </div>
        <el-button type="primary" size="large" @click="showAddDialog">
          <el-icon><Plus /></el-icon>
          添加套筒
        </el-button>
      </div>
    </el-card>

    <!-- 搜索和筛选 -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="品牌">
          <el-select v-model="filterForm.brand" placeholder="全部品牌" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="阿特拉斯" value="阿特拉斯" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="工具类型">
          <el-select v-model="filterForm.toolType" placeholder="全部类型" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="油压脉冲" value="油压脉冲" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="四方尺寸">
          <el-select v-model="filterForm.squareSize" placeholder="全部尺寸" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="1/4快换" value="1/4快换" />
            <el-option label="1/4四方" value="1/4四方" />
            <el-option label="3/8四方" value="3/8四方" />
            <el-option label="1/2四方" value="1/2四方" />
            <el-option label="3/4四方" value="3/4四方" />
            <el-option label="1寸四方" value="1寸四方" />
          </el-select>
        </el-form-item>
        <el-form-item label="输入端类型">
          <el-select v-model="filterForm.inputType" placeholder="全部类型" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="外六角" value="外六角" />
            <el-option label="内六角" value="内六角" />
            <el-option label="内六星" value="内六星" />
            <el-option label="Torx" value="Torx" />
            <el-option label="十字" value="十字" />
            <el-option label="一字" value="一字" />
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

    <!-- 套筒列表 -->
    <el-card class="table-card">
      <el-table :data="filteredSockets" stripe style="width: 100%" max-height="600">
        <el-table-column prop="model" label="型号" width="140" fixed />
        <el-table-column prop="name" label="名称" width="180" />
        <el-table-column prop="brand" label="品牌" width="100" />
        <el-table-column prop="toolType" label="工具类型" width="100" />
        <el-table-column prop="squareSize" label="四方尺寸" width="120" />
        <el-table-column label="套筒类型" width="250">
          <template #default="scope">
            <div class="socket-type-info">
              <el-tag size="small" type="info">{{ scope.row.socketType.shape }}</el-tag>
              <el-tag size="small" type="success">{{ scope.row.socketType.inputType }}</el-tag>
              <el-tag size="small" type="warning">{{ scope.row.socketType.inputSize }}</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="磁性" width="100">
          <template #default="scope">
            <el-tag size="small" type="primary">{{ scope.row.socketType.magnetic }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="特性" width="150">
          <template #default="scope">
            <div class="features">
              <el-tag v-if="scope.row.features.antiVibration" size="small" type="success">抗振</el-tag>
              <el-tag v-if="scope.row.features.sealRingPin" size="small" type="warning">密封圈</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="specifications.length" label="长度" width="100" />
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
      :title="isEdit ? '编辑套筒' : '添加套筒'"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form :model="formData" label-width="120px" ref="formRef" :rules="formRules">
        <el-divider content-position="left">基本信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="品牌" prop="brand">
              <el-select v-model="formData.brand" placeholder="请选择品牌">
                <el-option label="阿特拉斯" value="阿特拉斯" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工具类型" prop="toolType">
              <el-select v-model="formData.toolType" placeholder="请选择工具类型">
                <el-option label="油压脉冲" value="油压脉冲" />
                <el-option label="其他" value="其他" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工具四方尺寸" prop="squareSize">
              <el-select v-model="formData.squareSize" placeholder="请选择四方尺寸">
                <el-option label="1/4快换" value="1/4快换" />
                <el-option label="1/4四方" value="1/4四方" />
                <el-option label="3/8四方" value="3/8四方" />
                <el-option label="1/2四方" value="1/2四方" />
                <el-option label="3/4四方" value="3/4四方" />
                <el-option label="1寸四方" value="1寸四方" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工具型号" prop="toolModel">
              <el-input v-model="formData.toolModel" placeholder="如：ETBP45-10" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="套筒型号" prop="model">
              <el-input v-model="formData.model" placeholder="如：AV315150MP" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="套筒名称" prop="name">
              <el-input v-model="formData.name" placeholder="如：抗振固定磁套筒" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="完整名称" prop="fullName">
          <el-input v-model="formData.fullName" placeholder="如：抗振接杆固定磁套筒" />
        </el-form-item>

        <el-form-item label="描述说明" prop="description">
          <el-input type="textarea" v-model="formData.description" :rows="2" placeholder="请输入套筒描述" />
        </el-form-item>

        <el-divider content-position="left">套筒选型参数</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="外形" prop="socketType.shape">
              <el-select v-model="formData.socketType.shape" placeholder="请选择外形">
                <el-option label="标准" value="标准" />
                <el-option label="加长" value="加长" />
                <el-option label="接杆" value="接杆" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="输入端类型" prop="socketType.inputType">
              <el-select v-model="formData.socketType.inputType" placeholder="请选择输入端类型">
                <el-option label="外六角" value="外六角" />
                <el-option label="内六角" value="内六角" />
                <el-option label="内六星" value="内六星" />
                <el-option label="Torx" value="Torx" />
                <el-option label="十字" value="十字" />
                <el-option label="一字" value="一字" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="输入端尺寸" prop="socketType.inputSize">
              <el-input v-model="formData.socketType.inputSize" placeholder="如：15mm 或 T25" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="磁性" prop="socketType.magnetic">
              <el-select v-model="formData.socketType.magnetic" placeholder="请选择磁性">
                <el-option label="固定磁" value="固定磁" />
                <el-option label="伸缩磁" value="伸缩磁" />
                <el-option label="中空磁" value="中空磁" />
                <el-option label="外置磁环" value="外置磁环" />
                <el-option label="无磁性" value="无磁性" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="长度类型" prop="socketType.length">
              <el-select v-model="formData.socketType.length" placeholder="请选择长度类型">
                <el-option label="标准" value="标准" />
                <el-option label="加长" value="加长" />
                <el-option label="接杆" value="接杆" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="长度尺寸" prop="specifications.length">
              <el-input v-model="formData.specifications.length" placeholder="如：150mm">
                <template #append>mm</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">特性功能</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否抗振">
              <el-switch v-model="formData.features.antiVibration" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="配密封圈销子">
              <el-switch v-model="formData.features.sealRingPin" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">详细规格</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="输入端" prop="specifications.inputEnd">
              <el-input v-model="formData.specifications.inputEnd" placeholder="如：3/8四方" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="输出端" prop="specifications.outputEnd">
              <el-input v-model="formData.specifications.outputEnd" placeholder="如：外六角" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="输出端尺寸" prop="specifications.size">
              <el-input v-model="formData.specifications.size" placeholder="如：15mm" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="磁性类型" prop="specifications.magnetic">
              <el-input v-model="formData.specifications.magnetic" placeholder="如：固定磁" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">应用场景与价格</el-divider>
        <el-form-item label="应用场景">
          <el-select v-model="formData.applications" multiple placeholder="请选择应用场景" style="width: 100%">
            <el-option label="门盖工位" value="门盖工位" />
            <el-option label="底盘装配" value="底盘装配" />
            <el-option label="发动机装配" value="发动机装配" />
            <el-option label="悬挂系统" value="悬挂系统" />
            <el-option label="转向系统" value="转向系统" />
            <el-option label="深孔装配" value="深孔装配" />
            <el-option label="受限空间" value="受限空间" />
            <el-option label="电子设备装配" value="电子设备装配" />
            <el-option label="精密件装配" value="精密件装配" />
            <el-option label="延长操作" value="延长操作" />
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
import { ref, computed, onMounted } from 'vue'
import { useSocketDatabaseStore } from '@/store/socketDatabase'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const socketStore = useSocketDatabaseStore()

// 筛选表单
const filterForm = ref({
  brand: '',
  toolType: '',
  squareSize: '',
  inputType: '',
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
  squareSize: '',
  toolModel: '',
  model: '',
  name: '',
  fullName: '',
  description: '',
  socketType: {
    shape: '',
    inputType: '',
    inputSize: '',
    magnetic: '',
    length: ''
  },
  features: {
    antiVibration: false,
    sealRingPin: false
  },
  specifications: {
    inputEnd: '',
    outputEnd: '',
    size: '',
    length: '',
    magnetic: '',
    antiVibration: false,
    sealRingPin: false
  },
  applications: [],
  price: 0,
  stock: 0
})

// 表单验证规则
const formRules = {
  brand: [{ required: true, message: '请选择品牌', trigger: 'change' }],
  toolType: [{ required: true, message: '请选择工具类型', trigger: 'change' }],
  squareSize: [{ required: true, message: '请选择四方尺寸', trigger: 'change' }],
  model: [{ required: true, message: '请输入套筒型号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入套筒名称', trigger: 'blur' }],
  'socketType.shape': [{ required: true, message: '请选择外形', trigger: 'change' }],
  'socketType.inputType': [{ required: true, message: '请选择输入端类型', trigger: 'change' }],
  'socketType.inputSize': [{ required: true, message: '请输入输入端尺寸', trigger: 'blur' }],
  'socketType.magnetic': [{ required: true, message: '请选择磁性', trigger: 'change' }]
}

// 筛选后的套筒列表
const filteredSockets = computed(() => {
  let result = socketStore.allSockets

  if (filterForm.value.brand) {
    result = result.filter(s => s.brand === filterForm.value.brand)
  }
  if (filterForm.value.toolType) {
    result = result.filter(s => s.toolType === filterForm.value.toolType)
  }
  if (filterForm.value.squareSize) {
    result = result.filter(s => s.squareSize === filterForm.value.squareSize)
  }
  if (filterForm.value.inputType) {
    result = result.filter(s => s.socketType.inputType === filterForm.value.inputType)
  }
  if (filterForm.value.keyword) {
    const keyword = filterForm.value.keyword.toLowerCase()
    result = result.filter(s => 
      s.model.toLowerCase().includes(keyword) ||
      s.name.toLowerCase().includes(keyword) ||
      s.fullName.toLowerCase().includes(keyword)
    )
  }

  return result
})

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
    `确定要删除套筒 ${row.model} - ${row.name} 吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    socketStore.deleteSocket(row.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 提交表单
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      // 同步规格数据
      formData.value.specifications.antiVibration = formData.value.features.antiVibration
      formData.value.specifications.sealRingPin = formData.value.features.sealRingPin

      if (isEdit.value) {
        socketStore.updateSocket(formData.value.id, formData.value)
        ElMessage.success('更新成功')
      } else {
        socketStore.addSocket(formData.value)
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
    squareSize: '',
    inputType: '',
    keyword: ''
  }
}

// 重置表单
const resetForm = () => {
  formData.value = {
    brand: '',
    toolType: '',
    squareSize: '',
    toolModel: '',
    model: '',
    name: '',
    fullName: '',
    description: '',
    socketType: {
      shape: '',
      inputType: '',
      inputSize: '',
      magnetic: '',
      length: ''
    },
    features: {
      antiVibration: false,
      sealRingPin: false
    },
    specifications: {
      inputEnd: '',
      outputEnd: '',
      size: '',
      length: '',
      magnetic: '',
      antiVibration: false,
      sealRingPin: false
    },
    applications: [],
    price: 0,
    stock: 0
  }
}

onMounted(() => {
  // 初始化
})
</script>

<style scoped>
.socket-database {
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

.socket-type-info {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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
