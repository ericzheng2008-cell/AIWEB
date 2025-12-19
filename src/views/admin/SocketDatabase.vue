<template>
  <div class="socket-database">
    <el-card class="header-card">
      <div class="header">
        <div>
          <h2>套筒选型数据库</h2>
          <p class="subtitle">管理和维护套筒选型数据，支持智能推荐</p>
        </div>
        <div class="header-actions">
          <el-upload
            :show-file-list="false"
            :before-upload="handleExcelUpload"
            accept=".xlsx,.xls"
            :auto-upload="true"
          >
            <el-button type="success" size="large">
              <el-icon><Upload /></el-icon>
              Excel批量导入
            </el-button>
          </el-upload>
          <el-button type="primary" size="large" @click="showAddDialog">
            <el-icon><Plus /></el-icon>
            添加套筒
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 搜索和筛选 -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="品牌">
          <el-select v-model="filterForm.brand" placeholder="全部品牌" clearable style="width: 150px">
            <el-option label="全部" value="" />
            <el-option label="Atlascopco" value="Atlascopco" />
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
                <el-option label="Atlascopco" value="Atlascopco" />
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
            <el-form-item label="长度外形" prop="socketType.shape">
              <el-select v-model="formData.socketType.shape" placeholder="请选择长度外形" filterable allow-create>
                <el-option label="标准" value="标准" />
                <el-option label="加长" value="加长" />
                <el-option label="接杆" value="接杆" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="输入端类型" prop="socketType.inputType">
              <el-select v-model="formData.socketType.inputType" placeholder="请选择输入端类型" filterable allow-create>
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
            <el-form-item label="输出端对边尺寸" prop="socketType.inputSize">
              <el-select v-model="formData.socketType.inputSize" placeholder="请选择或输入尺寸" filterable allow-create>
                <el-option label="10mm" value="10mm" />
                <el-option label="12mm" value="12mm" />
                <el-option label="13mm" value="13mm" />
                <el-option label="14mm" value="14mm" />
                <el-option label="15mm" value="15mm" />
                <el-option label="17mm" value="17mm" />
                <el-option label="18mm" value="18mm" />
                <el-option label="T25" value="T25" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="磁性" prop="socketType.magnetic">
              <el-select v-model="formData.socketType.magnetic" placeholder="请选择磁性" filterable allow-create>
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
            <el-form-item label="长度尺寸" prop="specifications.length">
              <el-select v-model="formData.specifications.length" placeholder="请选择或输入长度" filterable allow-create>
                <el-option label="30mm" value="30mm" />
                <el-option label="40mm" value="40mm" />
                <el-option label="50mm" value="50mm" />
                <el-option label="60mm" value="60mm" />
                <el-option label="70mm" value="70mm" />
                <el-option label="75mm" value="75mm" />
                <el-option label="100mm" value="100mm" />
                <el-option label="150mm" value="150mm" />
                <el-option label="200mm" value="200mm" />
                <el-option label="250mm" value="250mm" />
                <el-option label="300mm" value="300mm" />
              </el-select>
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
              <el-select v-model="formData.specifications.inputEnd" placeholder="请选择或输入" filterable allow-create style="width: 100%">
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
            <el-form-item label="输出端" prop="specifications.outputEnd">
              <el-select v-model="formData.specifications.outputEnd" placeholder="请选择或输入" filterable allow-create style="width: 100%">
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
            <el-form-item label="输出端尺寸" prop="specifications.size">
              <el-select v-model="formData.specifications.size" placeholder="请选择或输入" filterable allow-create style="width: 100%">
                <el-option label="10mm" value="10mm" />
                <el-option label="12mm" value="12mm" />
                <el-option label="13mm" value="13mm" />
                <el-option label="14mm" value="14mm" />
                <el-option label="15mm" value="15mm" />
                <el-option label="17mm" value="17mm" />
                <el-option label="18mm" value="18mm" />
                <el-option label="T25" value="T25" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="磁性类型" prop="specifications.magnetic">
              <el-select v-model="formData.specifications.magnetic" placeholder="请选择或输入" filterable allow-create style="width: 100%">
                <el-option label="固定磁" value="固定磁" />
                <el-option label="伸缩磁" value="伸缩磁" />
                <el-option label="中空磁" value="中空磁" />
                <el-option label="外置磁环" value="外置磁环" />
                <el-option label="无磁性" value="无磁性" />
              </el-select>
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
import { Plus, Upload } from '@element-plus/icons-vue'
import * as XLSX from 'xlsx'

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
  'socketType.shape': [{ required: true, message: '请选择长度外形', trigger: 'change' }],
  'socketType.inputType': [{ required: true, message: '请选择输入端类型', trigger: 'change' }],
  'socketType.inputSize': [{ required: true, message: '请输入输出端对边尺寸', trigger: 'blur' }],
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
      magnetic: ''
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

// Excel 批量导入处理
const handleExcelUpload = (file) => {
  const reader = new FileReader()
  
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      
      // 读取第一个工作表
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      
      // 转换为 JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet)
      
      if (!jsonData || jsonData.length === 0) {
        ElMessage.warning('Excel 文件为空')
        return false
      }
      
      // 转换数据格式并导入
      let successCount = 0
      let errorCount = 0
      
      jsonData.forEach((row, index) => {
        try {
          const socketData = {
            brand: row['品牌'] || '',
            toolType: row['工具类型'] || '',
            squareSize: row['四方尺寸'] || '',
            toolModel: row['工具型号'] || '',
            model: row['套筒型号'] || '',
            name: row['套筒名称'] || '',
            fullName: row['完整名称'] || '',
            description: row['描述说明'] || '',
            socketType: {
              shape: row['长度外形'] || row['外形'] || '',
              inputType: row['输入端类型'] || '',
              inputSize: row['输出端对边尺寸'] || '',
              magnetic: row['磁性'] || ''
            },
            features: {
              antiVibration: row['是否抗振'] === '是' || row['是否抗振'] === true,
              sealRingPin: row['配密封圈销子'] === '是' || row['配密封圈销子'] === true
            },
            specifications: {
              inputEnd: row['输入端'] || '',
              outputEnd: row['输出端'] || '',
              size: row['输出端尺寸'] || '',
              length: row['长度尺寸'] || '',
              magnetic: row['磁性类型'] || '',
              antiVibration: row['是否抗振'] === '是' || row['是否抗振'] === true,
              sealRingPin: row['配密封圈销子'] === '是' || row['配密封圈销子'] === true
            },
            applications: row['应用场景'] ? row['应用场景'].split(',') : [],
            price: parseFloat(row['价格']) || 0,
            stock: parseInt(row['库存']) || 0
          }
          
          // 验证必填字段
          if (!socketData.model || !socketData.name) {
            console.warn(`第 ${index + 2} 行数据缺少必填字段，已跳过`)
            errorCount++
            return
          }
          
          socketStore.addSocket(socketData)
          successCount++
          
        } catch (error) {
          console.error(`处理第 ${index + 2} 行时出错:`, error)
          errorCount++
        }
      })
      
      ElMessage.success(`导入完成！成功: ${successCount} 条，失败: ${errorCount} 条`)
      
    } catch (error) {
      console.error('Excel 解析错误:', error)
      ElMessage.error('Excel 文件解析失败，请检查文件格式')
    }
  }
  
  reader.readAsArrayBuffer(file)
  
  // 阻止自动上传
  return false
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

.header-actions {
  display: flex;
  gap: 12px;
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
