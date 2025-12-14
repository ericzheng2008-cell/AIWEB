<template>
  <div class="production-line-manage">
    <el-card shadow="never">
      <template #header>
        <div class="header-row">
          <div class="header-left">
            <el-icon :size="20"><Position /></el-icon>
            <span class="header-title">线体管理</span>
          </div>
          <div class="header-right">
            <el-button type="primary" @click="showAddDialog">
              <el-icon><Plus /></el-icon>
              添加线体
            </el-button>
          </div>
        </div>
      </template>

      <!-- 搜索过滤 -->
      <div class="filter-section">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索线体名称..."
          clearable
          style="width: 300px"
          @input="handleSearch">
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <!-- 线体列表 -->
      <el-table 
        :data="filteredProductionLines" 
        stripe 
        style="width: 100%"
        v-loading="loading">
        <el-table-column type="index" label="#" width="60" />
        <el-table-column prop="name" label="线体名称" min-width="200">
          <template #default="{ row }">
            <el-tag :type="getLineTypeTag(row.name)" effect="plain">
              {{ row.name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="category" label="所属类别" width="150">
          <template #default="{ row }">
            <el-tag size="small">{{ row.category }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="280" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="editProductionLine(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button link type="danger" size="small" @click="deleteProductionLine(row)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalProductionLines"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingLine ? '编辑线体' : '添加线体'"
      width="600px"
      :close-on-click-modal="false">
      <el-form 
        :model="formData" 
        :rules="formRules" 
        ref="formRef" 
        label-width="120px">
        <el-form-item label="线体名称" prop="name">
          <el-input 
            v-model="formData.name" 
            placeholder="请输入线体名称"
            clearable />
        </el-form-item>
        <el-form-item label="所属类别" prop="category">
          <el-select 
            v-model="formData.category" 
            placeholder="请选择线体类别"
            style="width: 100%"
            clearable>
            <el-option label="汽车行业" value="汽车行业" />
            <el-option label="铁路行业" value="铁路行业" />
            <el-option label="工程机械" value="工程机械" />
            <el-option label="航空航天" value="航空航天" />
            <el-option label="电气电子" value="电气电子" />
            <el-option label="能源动力" value="能源动力" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input 
            v-model="formData.description" 
            type="textarea"
            :rows="3"
            placeholder="请输入线体描述（可选）"
            maxlength="500"
            show-word-limit />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Position, Plus, Search, Edit, Delete 
} from '@element-plus/icons-vue'
import { useProductionLineStore } from '../../store/productionLine'

const productionLineStore = useProductionLineStore()

// 数据
const loading = ref(false)
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const dialogVisible = ref(false)
const submitting = ref(false)
const editingLine = ref(null)
const formRef = ref(null)

// 从 store 获取线体列表
const productionLines = computed(() => productionLineStore.productionLines)

// 表单数据
const formData = reactive({
  name: '',
  category: '',
  description: ''
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入线体名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择线体类别', trigger: 'change' }
  ]
}

// 计算属性
const filteredProductionLines = computed(() => {
  let result = productionLines.value
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(line => 
      line.name.toLowerCase().includes(keyword) || 
      line.category.toLowerCase().includes(keyword)
    )
  }
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return result.slice(start, end)
})

const totalProductionLines = computed(() => {
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    return productionLines.value.filter(line => 
      line.name.toLowerCase().includes(keyword) || 
      line.category.toLowerCase().includes(keyword)
    ).length
  }
  return productionLines.value.length
})

// 方法
const getLineTypeTag = (name) => {
  if (name.includes('汽车')) return 'primary'
  if (name.includes('铁路')) return 'success'
  if (name.includes('工程')) return 'warning'
  if (name.includes('航空')) return 'danger'
  if (name.includes('电气') || name.includes('电子')) return 'info'
  return ''
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

const showAddDialog = () => {
  editingLine.value = null
  Object.assign(formData, {
    name: '',
    category: '',
    description: ''
  })
  dialogVisible.value = true
}

const editProductionLine = (row) => {
  editingLine.value = row
  Object.assign(formData, {
    name: row.name,
    category: row.category,
    description: row.description
  })
  dialogVisible.value = true
}

const deleteProductionLine = (row) => {
  ElMessageBox.confirm(
    `确定要删除线体 "${row.name}" 吗？此操作不可恢复。`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    productionLineStore.deleteProductionLine(row.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      submitting.value = true
      
      setTimeout(() => {
        if (editingLine.value) {
          // 编辑
          productionLineStore.updateProductionLine(editingLine.value.id, formData)
          ElMessage.success('更新成功')
        } else {
          // 新增
          productionLineStore.addProductionLine(formData)
          ElMessage.success('添加成功')
        }
        
        dialogVisible.value = false
        submitting.value = false
      }, 500)
    }
  })
}

// 初始化
onMounted(() => {
  loading.value = true
  productionLineStore.loadProductionLines()
  loading.value = false
})
</script>

<style scoped>
.production-line-manage {
  padding: 20px;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
}

.filter-section {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
