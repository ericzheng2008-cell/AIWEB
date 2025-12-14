<template>
  <div class="workstation-manage">
    <el-card shadow="never">
      <template #header>
        <div class="header-row">
          <div class="header-left">
            <el-icon :size="20"><Operation /></el-icon>
            <span class="header-title">工位管理</span>
          </div>
          <div class="header-right">
            <el-button type="primary" @click="showAddDialog">
              <el-icon><Plus /></el-icon>
              添加工位
            </el-button>
          </div>
        </div>
      </template>

      <!-- 搜索过滤 -->
      <div class="filter-section">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索工位名称..."
          clearable
          style="width: 300px"
          @input="handleSearch">
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <!-- 工位列表 -->
      <el-table 
        :data="filteredWorkstations" 
        stripe 
        style="width: 100%"
        v-loading="loading">
        <el-table-column type="index" label="#" width="60" />
        <el-table-column prop="name" label="工位名称" min-width="200" />
        <el-table-column prop="productionLine" label="所属线体" min-width="180" />
        <el-table-column prop="description" label="描述" min-width="250" show-overflow-tooltip />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="editWorkstation(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button link type="danger" size="small" @click="deleteWorkstation(row)">
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
          :total="totalWorkstations"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingWorkstation ? '编辑工位' : '添加工位'"
      width="600px"
      :close-on-click-modal="false">
      <el-form 
        :model="formData" 
        :rules="formRules" 
        ref="formRef" 
        label-width="120px">
        <el-form-item label="工位名称" prop="name">
          <el-input 
            v-model="formData.name" 
            placeholder="请输入工位名称"
            clearable />
        </el-form-item>
        <el-form-item label="所属线体" prop="productionLine">
          <el-select 
            v-model="formData.productionLine" 
            placeholder="请选择所属线体"
            style="width: 100%"
            clearable>
            <el-option 
              v-for="line in productionLines" 
              :key="line.id" 
              :label="line.name" 
              :value="line.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input 
            v-model="formData.description" 
            type="textarea"
            :rows="3"
            placeholder="请输入工位描述（可选）"
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
  Operation, Plus, Search, Edit, Delete 
} from '@element-plus/icons-vue'
import { useProductionLineStore } from '../../store/productionLine'

const productionLineStore = useProductionLineStore()

// 数据
const loading = ref(false)
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(20)
const workstations = ref([])
const dialogVisible = ref(false)
const submitting = ref(false)
const editingWorkstation = ref(null)
const formRef = ref(null)

// 从 store 获取线体列表
const productionLines = computed(() => productionLineStore.productionLines)

// 表单数据
const formData = reactive({
  name: '',
  productionLine: '',
  description: ''
})

// 表单验证规则
const formRules = {
  name: [
    { required: true, message: '请输入工位名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  productionLine: [
    { required: true, message: '请选择所属线体', trigger: 'change' }
  ]
}

// 计算属性
const filteredWorkstations = computed(() => {
  let result = workstations.value
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(ws => 
      ws.name.toLowerCase().includes(keyword) || 
      ws.productionLine.toLowerCase().includes(keyword)
    )
  }
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return result.slice(start, end)
})

const totalWorkstations = computed(() => {
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    return workstations.value.filter(ws => 
      ws.name.toLowerCase().includes(keyword) || 
      ws.productionLine.toLowerCase().includes(keyword)
    ).length
  }
  return workstations.value.length
})

// 方法
const loadWorkstations = () => {
  loading.value = true
  // 从 localStorage 加载
  const saved = localStorage.getItem('workstations')
  if (saved) {
    workstations.value = JSON.parse(saved)
  } else {
    // 初始化默认数据
    workstations.value = [
      {
        id: 1,
        name: '门盖工位',
        productionLine: '汽车总装线',
        description: '车门和引擎盖装配工位',
        createTime: '2024-01-15 10:30:00'
      },
      {
        id: 2,
        name: '底盘工位',
        productionLine: '汽车总装线',
        description: '底盘零部件装配工位',
        createTime: '2024-01-15 10:35:00'
      },
      {
        id: 3,
        name: '焊接工位',
        productionLine: '汽车焊装线',
        description: '车身焊接工位',
        createTime: '2024-01-15 10:40:00'
      }
    ]
    saveWorkstations()
  }
  loading.value = false
}

const saveWorkstations = () => {
  localStorage.setItem('workstations', JSON.stringify(workstations.value))
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
  editingWorkstation.value = null
  Object.assign(formData, {
    name: '',
    productionLine: '',
    description: ''
  })
  dialogVisible.value = true
}

const editWorkstation = (row) => {
  editingWorkstation.value = row
  Object.assign(formData, {
    name: row.name,
    productionLine: row.productionLine,
    description: row.description
  })
  dialogVisible.value = true
}

const deleteWorkstation = (row) => {
  ElMessageBox.confirm(
    `确定要删除工位 "${row.name}" 吗？此操作不可恢复。`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = workstations.value.findIndex(ws => ws.id === row.id)
    if (index > -1) {
      workstations.value.splice(index, 1)
      saveWorkstations()
      ElMessage.success('删除成功')
    }
  }).catch(() => {})
}

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      submitting.value = true
      
      setTimeout(() => {
        if (editingWorkstation.value) {
          // 编辑
          const index = workstations.value.findIndex(ws => ws.id === editingWorkstation.value.id)
          if (index > -1) {
            workstations.value[index] = {
              ...workstations.value[index],
              name: formData.name,
              productionLine: formData.productionLine,
              description: formData.description
            }
          }
          ElMessage.success('更新成功')
        } else {
          // 新增
          const newWorkstation = {
            id: Date.now(),
            name: formData.name,
            productionLine: formData.productionLine,
            description: formData.description,
            createTime: new Date().toLocaleString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            }).replace(/\//g, '-')
          }
          workstations.value.unshift(newWorkstation)
          ElMessage.success('添加成功')
        }
        
        saveWorkstations()
        dialogVisible.value = false
        submitting.value = false
      }, 500)
    }
  })
}

// 初始化
onMounted(() => {
  loadWorkstations()
  productionLineStore.loadProductionLines()
})
</script>

<style scoped>
.workstation-manage {
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
