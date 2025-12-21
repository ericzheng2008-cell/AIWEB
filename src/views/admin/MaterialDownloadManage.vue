<template>
  <div class="material-download-manage">
    <el-card class="header-card">
      <h2><el-icon><FolderOpened /></el-icon> 资料下载管理</h2>
      <p>管理产品手册、技术资料、白皮书等下载资源</p>
    </el-card>

    <el-tabs v-model="activeTab" class="content-tabs">
      <!-- 资料管理 -->
      <el-tab-pane label="📄 资料管理" name="materials">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>资料列表</span>
              <el-button type="primary" @click="showAddMaterialDialog">
                <el-icon><Plus /></el-icon> 添加资料
              </el-button>
            </div>
          </template>

          <!-- 筛选栏 -->
          <div class="filter-toolbar">
            <el-select v-model="filterCategory" placeholder="按分类筛选" style="width: 200px">
              <el-option label="全部分类" value="all" />
              <el-option 
                v-for="category in categories" 
                :key="category.id"
                :label="category.name['zh-CN']" 
                :value="String(category.id)" />
            </el-select>

            <el-select v-model="filterType" placeholder="按类型筛选" style="width: 200px">
              <el-option label="全部类型" value="all" />
              <el-option label="产品手册" value="manual" />
              <el-option label="技术资料" value="technical" />
              <el-option label="白皮书" value="whitepaper" />
              <el-option label="其他" value="other" />
            </el-select>

            <el-input 
              v-model="searchKeyword" 
              placeholder="搜索资料标题..."
              clearable
              style="width: 300px">
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>

          <!-- 资料表格 -->
          <el-table :data="filteredMaterials" border stripe style="margin-top: 20px">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column label="缩略图" width="120">
              <template #default="{ row }">
                <el-image 
                  v-if="row.thumbnailUrl" 
                  :src="row.thumbnailUrl" 
                  fit="cover"
                  style="width: 80px; height: 60px; border-radius: 4px" />
                <div v-else class="thumbnail-placeholder">
                  <el-icon><Document /></el-icon>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="标题" min-width="200">
              <template #default="{ row }">
                <div>
                  <strong>{{ row.title['zh-CN'] }}</strong>
                  <div class="en-name">{{ row.title['en-US'] }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="分类" width="150">
              <template #default="{ row }">
                {{ getCategoryName(row.categoryId) }}
              </template>
            </el-table-column>
            <el-table-column label="类型" width="120">
              <template #default="{ row }">
                <el-tag :type="getTypeTagColor(row.type)">
                  {{ getTypeName(row.type) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="文件信息" width="150">
              <template #default="{ row }">
                <div>
                  <el-tag size="small" type="info">{{ row.fileType.toUpperCase() }}</el-tag>
                  <div style="font-size: 12px; color: #666; margin-top: 4px">
                    {{ row.fileSize }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="下载次数" width="100" align="center">
              <template #default="{ row }">
                <el-tag type="success">{{ row.downloadCount || 0 }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="可见" width="80" align="center">
              <template #default="{ row }">
                <el-switch 
                  v-model="row.visible" 
                  @change="updateMaterialVisibility(row)" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button size="small" @click="editMaterial(row)">
                  <el-icon><Edit /></el-icon> 编辑
                </el-button>
                <el-button size="small" type="danger" @click="deleteMaterial(row)">
                  <el-icon><Delete /></el-icon> 删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- 分类管理 -->
      <el-tab-pane label="📁 分类管理" name="categories">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>资料分类</span>
              <el-button type="primary" @click="showAddCategoryDialog">
                <el-icon><Plus /></el-icon> 添加分类
              </el-button>
            </div>
          </template>

          <el-table :data="categories" border stripe>
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column label="名称" min-width="200">
              <template #default="{ row }">
                <div>
                  <strong>{{ row.name['zh-CN'] }}</strong>
                  <div class="en-name">{{ row.name['en-US'] }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="描述" min-width="250">
              <template #default="{ row }">
                {{ row.description['zh-CN'] }}
              </template>
            </el-table-column>
            <el-table-column label="资料数量" width="100" align="center">
              <template #default="{ row }">
                <el-tag type="info">{{ getMaterialCount(row.id) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="排序" width="80">
              <template #default="{ row }">
                {{ row.order }}
              </template>
            </el-table-column>
            <el-table-column label="可见" width="80" align="center">
              <template #default="{ row }">
                <el-switch v-model="row.visible" @change="updateCategoryVisibility(row)" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button size="small" @click="editCategory(row)">
                  <el-icon><Edit /></el-icon> 编辑
                </el-button>
                <el-button size="small" type="danger" @click="deleteCategory(row)">
                  <el-icon><Delete /></el-icon> 删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- 下载统计 -->
      <el-tab-pane label="📊 下载统计" name="stats">
        <el-card>
          <template #header>
            <span>下载记录</span>
          </template>

          <el-table :data="downloadRecords" border stripe max-height="600">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column label="资料" min-width="200">
              <template #default="{ row }">
                {{ row.materialTitle['zh-CN'] }}
              </template>
            </el-table-column>
            <el-table-column label="下载用户" min-width="250">
              <template #default="{ row }">
                <div>
                  <div><strong>{{ row.userInfo.name }}</strong> - {{ row.userInfo.company }}</div>
                  <div style="font-size: 12px; color: #666;">
                    {{ row.userInfo.phone }} | {{ row.userInfo.email }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="下载时间" width="180">
              <template #default="{ row }">
                {{ formatDateTime(row.downloadedAt) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- 报价请求 -->
      <el-tab-pane label="💬 报价请求" name="quotes">
        <el-card>
          <template #header>
            <span>报价请求列表</span>
          </template>

          <el-table :data="userRegistrations" border stripe max-height="600">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column label="用户信息" min-width="250">
              <template #default="{ row }">
                <div>
                  <div><strong>{{ row.name }}</strong> - {{ row.company }}</div>
                  <div style="font-size: 12px; color: #666;">
                    📞 {{ row.phone }} | ✉️ {{ row.email }}
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="需求产品" min-width="200">
              <template #default="{ row }">
                {{ row.product || '（仅资料下载）' }}
              </template>
            </el-table-column>
            <el-table-column label="目的" width="120">
              <template #default="{ row }">
                <el-tag :type="row.purpose === 'quote' ? 'warning' : 'info'">
                  {{ getPurposeName(row.purpose) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="120">
              <template #default="{ row }">
                <el-select 
                  v-model="row.status" 
                  size="small"
                  @change="updateRegistrationStatus(row)">
                  <el-option label="待处理" value="pending" />
                  <el-option label="已联系" value="contacted" />
                  <el-option label="已完成" value="completed" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="提交时间" width="180">
              <template #default="{ row }">
                {{ formatDateTime(row.registeredAt) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加/编辑资料弹窗 -->
    <el-dialog
      v-model="showMaterialDialog"
      :title="materialDialogTitle"
      width="700px">
      
      <el-form ref="materialFormRef" :model="materialForm" :rules="materialRules" label-width="120px">
        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="materialForm.categoryId" placeholder="请选择分类">
            <el-option 
              v-for="category in categories" 
              :key="category.id"
              :label="category.name['zh-CN']" 
              :value="category.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="资料类型" prop="type">
          <el-radio-group v-model="materialForm.type">
            <el-radio value="manual">产品手册</el-radio>
            <el-radio value="technical">技术资料</el-radio>
            <el-radio value="whitepaper">白皮书</el-radio>
            <el-radio value="other">其他</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="中文标题" prop="titleZh">
          <el-input v-model="materialForm.titleZh" placeholder="请输入中文标题" />
        </el-form-item>

        <el-form-item label="英文标题" prop="titleEn">
          <el-input v-model="materialForm.titleEn" placeholder="Please enter English title" />
        </el-form-item>

        <el-form-item label="中文描述" prop="descriptionZh">
          <el-input 
            v-model="materialForm.descriptionZh" 
            type="textarea"
            :rows="3"
            placeholder="请输入中文描述" />
        </el-form-item>

        <el-form-item label="英文描述" prop="descriptionEn">
          <el-input 
            v-model="materialForm.descriptionEn" 
            type="textarea"
            :rows="3"
            placeholder="Please enter English description" />
        </el-form-item>

        <el-form-item label="文件上传" prop="fileUrl">
          <el-upload
            class="upload-demo"
            action="#"
            :before-upload="handleFileUpload"
            :show-file-list="false"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
            drag>
            <div v-if="!materialForm.fileUrl" class="upload-content">
              <el-icon class="upload-icon"><UploadFilled /></el-icon>
              <div class="el-upload__text">
                拖拽文件到此处，或<em>点击上传</em>
              </div>
              <div class="el-upload__tip">
                支持PDF、Word、Excel、PPT等格式，单个文件不超过50MB
              </div>
            </div>
            <div v-else class="uploaded-file">
              <el-icon><Document /></el-icon>
              <span>{{ materialForm.fileName }}</span>
              <el-button size="small" type="danger" @click="removeFile">删除</el-button>
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item label="缩略图" prop="thumbnailUrl">
          <el-upload
            class="thumbnail-uploader"
            action="#"
            :before-upload="handleThumbnailUpload"
            :show-file-list="false"
            accept="image/*">
            <img v-if="materialForm.thumbnailUrl" :src="materialForm.thumbnailUrl" class="thumbnail" />
            <div v-else class="thumbnail-placeholder">
              <el-icon><Plus /></el-icon>
              <div>上传缩略图</div>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showMaterialDialog = false">取消</el-button>
        <el-button type="primary" @click="saveMaterial" :loading="saving">保存</el-button>
      </template>
    </el-dialog>

    <!-- 添加/编辑分类弹窗 -->
    <el-dialog
      v-model="showCategoryDialog"
      :title="categoryDialogTitle"
      width="600px">
      
      <el-form ref="categoryFormRef" :model="categoryForm" :rules="categoryRules" label-width="120px">
        <el-form-item label="中文名称" prop="nameZh">
          <el-input v-model="categoryForm.nameZh" placeholder="请输入中文名称" />
        </el-form-item>

        <el-form-item label="英文名称" prop="nameEn">
          <el-input v-model="categoryForm.nameEn" placeholder="Please enter English name" />
        </el-form-item>

        <el-form-item label="中文描述" prop="descriptionZh">
          <el-input 
            v-model="categoryForm.descriptionZh" 
            type="textarea"
            :rows="3"
            placeholder="请输入中文描述" />
        </el-form-item>

        <el-form-item label="英文描述" prop="descriptionEn">
          <el-input 
            v-model="categoryForm.descriptionEn" 
            type="textarea"
            :rows="3"
            placeholder="Please enter English description" />
        </el-form-item>

        <el-form-item label="排序" prop="order">
          <el-input-number v-model="categoryForm.order" :min="1" :max="100" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showCategoryDialog = false">取消</el-button>
        <el-button type="primary" @click="saveCategory" :loading="saving">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useMaterialDownloadStore } from '../../store/materialDownload'
import {
  FolderOpened, Plus, Search, Document, Edit, Delete, UploadFilled
} from '@element-plus/icons-vue'

const materialStore = useMaterialDownloadStore()

const activeTab = ref('materials')
const saving = ref(false)

// 分类和资料数据
const categories = computed(() => materialStore.categories)
const materials = computed(() => materialStore.materials)
const downloadRecords = computed(() => materialStore.downloadRecords)
const userRegistrations = computed(() => materialStore.userRegistrations)

// 筛选
const filterCategory = ref('all')
const filterType = ref('all')
const searchKeyword = ref('')

// 筛选后的资料
const filteredMaterials = computed(() => {
  let result = materials.value

  if (filterCategory.value !== 'all') {
    result = result.filter(m => String(m.categoryId) === filterCategory.value)
  }

  if (filterType.value !== 'all') {
    result = result.filter(m => m.type === filterType.value)
  }

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(m =>
      m.title['zh-CN'].toLowerCase().includes(keyword) ||
      m.title['en-US'].toLowerCase().includes(keyword)
    )
  }

  return result
})

// 资料弹窗
const showMaterialDialog = ref(false)
const materialFormRef = ref(null)
const currentMaterial = ref(null)

const materialForm = ref({
  categoryId: null,
  type: 'manual',
  titleZh: '',
  titleEn: '',
  descriptionZh: '',
  descriptionEn: '',
  fileUrl: '',
  fileName: '',
  fileType: 'pdf',
  fileSize: '',
  thumbnailUrl: ''
})

const materialRules = {
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
  type: [{ required: true, message: '请选择资料类型', trigger: 'change' }],
  titleZh: [{ required: true, message: '请输入中文标题', trigger: 'blur' }],
  titleEn: [{ required: true, message: '请输入英文标题', trigger: 'blur' }],
  fileUrl: [{ required: true, message: '请上传文件', trigger: 'change' }]
}

const materialDialogTitle = computed(() => {
  return currentMaterial.value ? '编辑资料' : '添加资料'
})

// 分类弹窗
const showCategoryDialog = ref(false)
const categoryFormRef = ref(null)
const currentCategory = ref(null)

const categoryForm = ref({
  nameZh: '',
  nameEn: '',
  descriptionZh: '',
  descriptionEn: '',
  order: 1
})

const categoryRules = {
  nameZh: [{ required: true, message: '请输入中文名称', trigger: 'blur' }],
  nameEn: [{ required: true, message: '请输入英文名称', trigger: 'blur' }]
}

const categoryDialogTitle = computed(() => {
  return currentCategory.value ? '编辑分类' : '添加分类'
})

// 工具方法
const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name['zh-CN'] : '未知分类'
}

const getTypeName = (type) => {
  const typeNames = {
    manual: '产品手册',
    technical: '技术资料',
    whitepaper: '白皮书',
    other: '其他'
  }
  return typeNames[type] || type
}

const getTypeTagColor = (type) => {
  const colors = {
    manual: 'primary',
    technical: 'success',
    whitepaper: 'warning',
    other: 'info'
  }
  return colors[type] || 'info'
}

const getPurposeName = (purpose) => {
  const purposes = {
    download: '下载资料',
    quote: '索取报价',
    both: '两者都要'
  }
  return purposes[purpose] || purpose
}

const getMaterialCount = (categoryId) => {
  return materials.value.filter(m => m.categoryId === categoryId).length
}

const formatDateTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 资料操作
const showAddMaterialDialog = () => {
  currentMaterial.value = null
  materialForm.value = {
    categoryId: null,
    type: 'manual',
    titleZh: '',
    titleEn: '',
    descriptionZh: '',
    descriptionEn: '',
    fileUrl: '',
    fileName: '',
    fileType: 'pdf',
    fileSize: '',
    thumbnailUrl: ''
  }
  showMaterialDialog.value = true
}

const editMaterial = (material) => {
  currentMaterial.value = material
  materialForm.value = {
    categoryId: material.categoryId,
    type: material.type,
    titleZh: material.title['zh-CN'],
    titleEn: material.title['en-US'],
    descriptionZh: material.description['zh-CN'],
    descriptionEn: material.description['en-US'],
    fileUrl: material.fileUrl,
    fileName: material.fileName || '',
    fileType: material.fileType,
    fileSize: material.fileSize,
    thumbnailUrl: material.thumbnailUrl || ''
  }
  showMaterialDialog.value = true
}

const saveMaterial = async () => {
  if (!materialFormRef.value) return

  await materialFormRef.value.validate((valid) => {
    if (valid) {
      saving.value = true

      const materialData = {
        categoryId: materialForm.value.categoryId,
        type: materialForm.value.type,
        title: {
          'zh-CN': materialForm.value.titleZh,
          'en-US': materialForm.value.titleEn
        },
        description: {
          'zh-CN': materialForm.value.descriptionZh,
          'en-US': materialForm.value.descriptionEn
        },
        fileUrl: materialForm.value.fileUrl,
        fileName: materialForm.value.fileName,
        fileType: materialForm.value.fileType,
        fileSize: materialForm.value.fileSize,
        thumbnailUrl: materialForm.value.thumbnailUrl
      }

      setTimeout(() => {
        if (currentMaterial.value) {
          // 更新
          materialStore.updateMaterial(currentMaterial.value.id, materialData)
          ElMessage.success('资料更新成功')
        } else {
          // 添加
          materialStore.addMaterial(materialData)
          ElMessage.success('资料添加成功')
        }

        saving.value = false
        showMaterialDialog.value = false
      }, 500)
    }
  })
}

const deleteMaterial = (material) => {
  ElMessageBox.confirm(`确定要删除资料"${material.title['zh-CN']}"吗？`, '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    materialStore.deleteMaterial(material.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const updateMaterialVisibility = (material) => {
  materialStore.updateMaterial(material.id, { visible: material.visible })
  ElMessage.success('更新成功')
}

// 文件上传
const handleFileUpload = (file) => {
  // 检查文件大小（50MB）
  if (file.size > 50 * 1024 * 1024) {
    ElMessage.error('文件大小不能超过50MB')
    return false
  }

  // 模拟上传（实际应用中应上传到服务器）
  const reader = new FileReader()
  reader.onload = (e) => {
    materialForm.value.fileUrl = e.target.result
    materialForm.value.fileName = file.name
    materialForm.value.fileType = file.name.split('.').pop().toLowerCase()
    materialForm.value.fileSize = formatFileSize(file.size)
    ElMessage.success('文件上传成功')
  }
  reader.readAsDataURL(file)

  return false // 阻止自动上传
}

const handleThumbnailUpload = (file) => {
  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    ElMessage.error('只能上传图片文件')
    return false
  }

  // 检查文件大小（5MB）
  if (file.size > 5 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过5MB')
    return false
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    materialForm.value.thumbnailUrl = e.target.result
    ElMessage.success('缩略图上传成功')
  }
  reader.readAsDataURL(file)

  return false
}

const removeFile = () => {
  materialForm.value.fileUrl = ''
  materialForm.value.fileName = ''
  materialForm.value.fileType = 'pdf'
  materialForm.value.fileSize = ''
}

const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

// 分类操作
const showAddCategoryDialog = () => {
  currentCategory.value = null
  categoryForm.value = {
    nameZh: '',
    nameEn: '',
    descriptionZh: '',
    descriptionEn: '',
    order: categories.value.length + 1
  }
  showCategoryDialog.value = true
}

const editCategory = (category) => {
  currentCategory.value = category
  categoryForm.value = {
    nameZh: category.name['zh-CN'],
    nameEn: category.name['en-US'],
    descriptionZh: category.description['zh-CN'],
    descriptionEn: category.description['en-US'],
    order: category.order
  }
  showCategoryDialog.value = true
}

const saveCategory = async () => {
  if (!categoryFormRef.value) return

  await categoryFormRef.value.validate((valid) => {
    if (valid) {
      saving.value = true

      const categoryData = {
        name: {
          'zh-CN': categoryForm.value.nameZh,
          'en-US': categoryForm.value.nameEn
        },
        description: {
          'zh-CN': categoryForm.value.descriptionZh,
          'en-US': categoryForm.value.descriptionEn
        },
        order: categoryForm.value.order
      }

      setTimeout(() => {
        if (currentCategory.value) {
          // 更新
          materialStore.updateCategory(currentCategory.value.id, categoryData)
          ElMessage.success('分类更新成功')
        } else {
          // 添加
          materialStore.addCategory(categoryData)
          ElMessage.success('分类添加成功')
        }

        saving.value = false
        showCategoryDialog.value = false
      }, 500)
    }
  })
}

const deleteCategory = (category) => {
  // 检查是否有资料使用该分类
  const count = getMaterialCount(category.id)
  if (count > 0) {
    ElMessage.warning(`该分类下有 ${count} 个资料，请先删除或移动资料`)
    return
  }

  ElMessageBox.confirm(`确定要删除分类"${category.name['zh-CN']}"吗？`, '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    materialStore.deleteCategory(category.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const updateCategoryVisibility = (category) => {
  materialStore.updateCategory(category.id, { visible: category.visible })
  ElMessage.success('更新成功')
}

// 报价状态更新
const updateRegistrationStatus = (registration) => {
  materialStore.updateRegistrationStatus(registration.id, registration.status)
  ElMessage.success('状态更新成功')
}
</script>

<style scoped>
.material-download-manage {
  padding: 24px;
}

.header-card {
  margin-bottom: 24px;
}

.header-card h2 {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  margin: 0 0 8px 0;
  color: #1976D2;
}

.header-card p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.content-tabs {
  background: white;
  border-radius: 8px;
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.filter-toolbar {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.en-name {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.thumbnail-placeholder {
  width: 80px;
  height: 60px;
  background: #f5f5f5;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  font-size: 24px;
}

/* 上传组件样式 */
.upload-content {
  padding: 40px 0;
  text-align: center;
}

.upload-icon {
  font-size: 48px;
  color: #409EFF;
  margin-bottom: 16px;
}

.uploaded-file {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 4px;
}

.uploaded-file .el-icon {
  font-size: 24px;
  color: #409EFF;
}

.thumbnail-uploader {
  width: 178px;
  height: 178px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s;
}

.thumbnail-uploader:hover {
  border-color: #409EFF;
}

.thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  color: #999;
}

.thumbnail-placeholder .el-icon {
  font-size: 32px;
  margin-bottom: 8px;
}
</style>
