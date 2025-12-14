<template>
  <div class="classroom-resources-manage">
    <el-card class="header-card">
      <h2><el-icon><FolderOpened /></el-icon> 小课堂多媒体资源管理</h2>
      <p>管理课程的视频、PPT、PDF、Excel、Word等多媒体资源</p>
    </el-card>

    <!-- 课程选择器 -->
    <el-card class="selector-card">
      <el-form :inline="true">
        <el-form-item label="一级分类">
          <el-select v-model="selectedCategory" placeholder="选择分类" @change="onCategoryChange" style="width: 200px;">
            <el-option
              v-for="cat in store.getAllCategories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id">
              <span>{{ cat.icon }} {{ cat.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="二级分类">
          <el-select
            v-model="selectedSubcategory"
            placeholder="选择子分类"
            :disabled="!selectedCategory"
            @change="onSubcategoryChange"
            style="width: 200px;">
            <el-option
              v-for="sub in availableSubcategories"
              :key="sub.id"
              :label="sub.name"
              :value="sub.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="课程">
          <el-select
            v-model="selectedLesson"
            placeholder="选择课程"
            :disabled="!selectedSubcategory"
            @change="onLessonChange"
            style="width: 300px;">
            <el-option
              v-for="lesson in availableLessons"
              :key="lesson.id"
              :label="lesson.title"
              :value="lesson.id" />
          </el-select>
        </el-form-item>
      </el-form>

      <el-alert
        v-if="currentLesson"
        :title="`当前课程: ${currentLesson.title}`"
        type="info"
        :closable="false"
        class="current-lesson-alert">
        <template #default>
          <div class="lesson-info">
            <span><el-icon><User /></el-icon> {{ currentLesson.author }}</span>
            <span><el-icon><Clock /></el-icon> {{ currentLesson.duration }}</span>
            <span><el-icon><View /></el-icon> {{ currentLesson.views }} 次浏览</span>
          </div>
        </template>
      </el-alert>
    </el-card>

    <!-- 资源管理标签页 -->
    <el-card v-if="currentLesson" class="resources-card">
      <el-tabs v-model="activeResourceTab">
        <!-- 视频资源 -->
        <el-tab-pane name="videos">
          <template #label>
            <span><el-icon><VideoPlay /></el-icon> 视频 ({{ resourceStats.totalVideos }})</span>
          </template>

          <div class="resource-section">
            <div class="section-header">
              <h3>视频资源</h3>
              <el-button type="primary" @click="showUploadDialog('video')">
                <el-icon><Upload /></el-icon> 上传视频
              </el-button>
            </div>

            <el-table :data="currentResources.videos" stripe>
              <el-table-column label="预览" width="100">
                <template #default="scope">
                  <div class="file-preview video-preview">
                    <el-icon :size="32"><VideoPlay /></el-icon>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="文件名" min-width="200" />
              <el-table-column label="大小" width="120">
                <template #default="scope">
                  {{ formatFileSize(scope.row.size) }}
                </template>
              </el-table-column>
              <el-table-column prop="duration" label="时长" width="100" />
              <el-table-column label="上传时间" width="180">
                <template #default="scope">
                  {{ formatDate(scope.row.uploadTime) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200" fixed="right">
                <template #default="scope">
                  <el-button size="small" @click="previewFile(scope.row)">
                    <el-icon><View /></el-icon> 预览
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteResource('video', scope.row.id)">
                    <el-icon><Delete /></el-icon> 删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-empty v-if="currentResources.videos.length === 0" description="暂无视频资源" />
          </div>
        </el-tab-pane>

        <!-- PDF资源 -->
        <el-tab-pane name="pdfs">
          <template #label>
            <span><el-icon><Document /></el-icon> PDF ({{ resourceStats.totalPdfs }})</span>
          </template>

          <div class="resource-section">
            <div class="section-header">
              <h3>PDF资源</h3>
              <el-button type="primary" @click="showUploadDialog('pdf')">
                <el-icon><Upload /></el-icon> 上传PDF
              </el-button>
            </div>

            <el-table :data="currentResources.pdfs" stripe>
              <el-table-column label="预览" width="100">
                <template #default="scope">
                  <div class="file-preview pdf-preview">
                    <el-icon :size="32"><Document /></el-icon>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="文件名" min-width="200" />
              <el-table-column label="大小" width="120">
                <template #default="scope">
                  {{ formatFileSize(scope.row.size) }}
                </template>
              </el-table-column>
              <el-table-column prop="pages" label="页数" width="100" />
              <el-table-column label="上传时间" width="180">
                <template #default="scope">
                  {{ formatDate(scope.row.uploadTime) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200" fixed="right">
                <template #default="scope">
                  <el-button size="small" @click="previewFile(scope.row)">
                    <el-icon><View /></el-icon> 预览
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteResource('pdf', scope.row.id)">
                    <el-icon><Delete /></el-icon> 删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-empty v-if="currentResources.pdfs.length === 0" description="暂无PDF资源" />
          </div>
        </el-tab-pane>

        <!-- PPT资源 -->
        <el-tab-pane name="ppts">
          <template #label>
            <span><el-icon><Present /></el-icon> PPT ({{ resourceStats.totalPpts }})</span>
          </template>

          <div class="resource-section">
            <div class="section-header">
              <h3>PPT资源</h3>
              <el-button type="primary" @click="showUploadDialog('ppt')">
                <el-icon><Upload /></el-icon> 上传PPT
              </el-button>
            </div>

            <el-table :data="currentResources.ppts" stripe>
              <el-table-column label="预览" width="100">
                <template #default="scope">
                  <div class="file-preview ppt-preview">
                    <el-icon :size="32"><Present /></el-icon>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="文件名" min-width="200" />
              <el-table-column label="大小" width="120">
                <template #default="scope">
                  {{ formatFileSize(scope.row.size) }}
                </template>
              </el-table-column>
              <el-table-column prop="slides" label="幻灯片数" width="120" />
              <el-table-column label="上传时间" width="180">
                <template #default="scope">
                  {{ formatDate(scope.row.uploadTime) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200" fixed="right">
                <template #default="scope">
                  <el-button size="small" @click="previewFile(scope.row)">
                    <el-icon><View /></el-icon> 预览
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteResource('ppt', scope.row.id)">
                    <el-icon><Delete /></el-icon> 删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-empty v-if="currentResources.ppts.length === 0" description="暂无PPT资源" />
          </div>
        </el-tab-pane>

        <!-- Excel资源 -->
        <el-tab-pane name="excels">
          <template #label>
            <span><el-icon><Files /></el-icon> Excel ({{ resourceStats.totalExcels }})</span>
          </template>

          <div class="resource-section">
            <div class="section-header">
              <h3>Excel资源</h3>
              <el-button type="primary" @click="showUploadDialog('excel')">
                <el-icon><Upload /></el-icon> 上传Excel
              </el-button>
            </div>

            <el-table :data="currentResources.excels" stripe>
              <el-table-column label="预览" width="100">
                <template #default="scope">
                  <div class="file-preview excel-preview">
                    <el-icon :size="32"><Files /></el-icon>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="文件名" min-width="200" />
              <el-table-column label="大小" width="120">
                <template #default="scope">
                  {{ formatFileSize(scope.row.size) }}
                </template>
              </el-table-column>
              <el-table-column prop="sheets" label="工作表数" width="120" />
              <el-table-column label="上传时间" width="180">
                <template #default="scope">
                  {{ formatDate(scope.row.uploadTime) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200" fixed="right">
                <template #default="scope">
                  <el-button size="small" @click="previewFile(scope.row)">
                    <el-icon><View /></el-icon> 预览
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteResource('excel', scope.row.id)">
                    <el-icon><Delete /></el-icon> 删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-empty v-if="currentResources.excels.length === 0" description="暂无Excel资源" />
          </div>
        </el-tab-pane>

        <!-- Word资源 -->
        <el-tab-pane name="words">
          <template #label>
            <span><el-icon><Notebook /></el-icon> Word ({{ resourceStats.totalWords }})</span>
          </template>

          <div class="resource-section">
            <div class="section-header">
              <h3>Word资源</h3>
              <el-button type="primary" @click="showUploadDialog('word')">
                <el-icon><Upload /></el-icon> 上传Word
              </el-button>
            </div>

            <el-table :data="currentResources.words" stripe>
              <el-table-column label="预览" width="100">
                <template #default="scope">
                  <div class="file-preview word-preview">
                    <el-icon :size="32"><Notebook /></el-icon>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="文件名" min-width="200" />
              <el-table-column label="大小" width="120">
                <template #default="scope">
                  {{ formatFileSize(scope.row.size) }}
                </template>
              </el-table-column>
              <el-table-column prop="pages" label="页数" width="100" />
              <el-table-column label="上传时间" width="180">
                <template #default="scope">
                  {{ formatDate(scope.row.uploadTime) }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200" fixed="right">
                <template #default="scope">
                  <el-button size="small" @click="previewFile(scope.row)">
                    <el-icon><View /></el-icon> 预览
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteResource('word', scope.row.id)">
                    <el-icon><Delete /></el-icon> 删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <el-empty v-if="currentResources.words.length === 0" description="暂无Word资源" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 上传对话框 -->
    <el-dialog
      v-model="uploadDialogVisible"
      :title="`上传${getFileTypeLabel(currentUploadType)}`"
      width="600px">
      <el-upload
        ref="uploadRef"
        class="upload-demo"
        drag
        :accept="getAcceptType(currentUploadType)"
        :auto-upload="false"
        :on-change="handleFileChange"
        :limit="1">
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或<em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            支持格式: {{ getAcceptType(currentUploadType) }}，文件大小不超过100MB
          </div>
        </template>
      </el-upload>

      <el-form v-if="uploadForm.file" :model="uploadForm" label-width="100px" style="margin-top: 20px;">
        <el-form-item label="文件名">
          <el-input v-model="uploadForm.name" placeholder="默认使用原文件名" />
        </el-form-item>
        <el-form-item v-if="currentUploadType === 'video'" label="时长">
          <el-input v-model="uploadForm.duration" placeholder="如: 10:35" />
        </el-form-item>
        <el-form-item v-if="currentUploadType === 'pdf' || currentUploadType === 'word'" label="页数">
          <el-input-number v-model="uploadForm.pages" :min="0" />
        </el-form-item>
        <el-form-item v-if="currentUploadType === 'ppt'" label="幻灯片数">
          <el-input-number v-model="uploadForm.slides" :min="0" />
        </el-form-item>
        <el-form-item v-if="currentUploadType === 'excel'" label="工作表数">
          <el-input-number v-model="uploadForm.sheets" :min="0" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="uploadDialogVisible = false">取消</el-button>
        <el-button type="primary" :disabled="!uploadForm.file" @click="confirmUpload">
          确定上传
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  FolderOpened, Upload, VideoPlay, Document, Present, Files, Notebook,
  View, Delete, User, Clock, UploadFilled
} from '@element-plus/icons-vue'
import { useClassroomStore } from '../../store/classroom'

const store = useClassroomStore()

// 课程选择
const selectedCategory = ref(null)
const selectedSubcategory = ref(null)
const selectedLesson = ref(null)

const availableSubcategories = computed(() => {
  if (!selectedCategory.value) return []
  return store.getSubcategoriesByCategory(selectedCategory.value)
})

const availableLessons = computed(() => {
  if (!selectedSubcategory.value) return []
  return store.getLessonsBySubcategory(selectedSubcategory.value)
})

const currentLesson = computed(() => {
  if (!selectedLesson.value) return null
  return store.getLessonById(selectedLesson.value)
})

// 资源数据
const activeResourceTab = ref('videos')
const currentResources = computed(() => {
  if (!currentLesson.value) return { videos: [], pdfs: [], ppts: [], excels: [], words: [] }
  return store.getLessonResources(currentLesson.value.id)
})

const resourceStats = computed(() => {
  if (!currentLesson.value) return {
    totalVideos: 0, totalPdfs: 0, totalPpts: 0, totalExcels: 0, totalWords: 0
  }
  return store.getResourceStats(currentLesson.value.id)
})

// 上传对话框
const uploadDialogVisible = ref(false)
const currentUploadType = ref('video')
const uploadRef = ref(null)
const uploadForm = reactive({
  file: null,
  name: '',
  duration: '',
  pages: 0,
  slides: 0,
  sheets: 0
})

// 文件类型配置
const fileTypeConfig = {
  video: {
    label: '视频',
    accept: '.mp4,.avi,.mov,.wmv,.flv,.mkv',
    storeMethod: 'addVideoResource'
  },
  pdf: {
    label: 'PDF',
    accept: '.pdf',
    storeMethod: 'addPdfResource'
  },
  ppt: {
    label: 'PPT',
    accept: '.ppt,.pptx',
    storeMethod: 'addPptResource'
  },
  excel: {
    label: 'Excel',
    accept: '.xls,.xlsx',
    storeMethod: 'addExcelResource'
  },
  word: {
    label: 'Word',
    accept: '.doc,.docx',
    storeMethod: 'addWordResource'
  }
}

// 方法
const onCategoryChange = () => {
  selectedSubcategory.value = null
  selectedLesson.value = null
}

const onSubcategoryChange = () => {
  selectedLesson.value = null
}

const onLessonChange = () => {
  activeResourceTab.value = 'videos'
}

const showUploadDialog = (type) => {
  if (!currentLesson.value) {
    ElMessage.warning('请先选择课程')
    return
  }
  currentUploadType.value = type
  Object.assign(uploadForm, {
    file: null,
    name: '',
    duration: '',
    pages: 0,
    slides: 0,
    sheets: 0
  })
  uploadDialogVisible.value = true
}

const getFileTypeLabel = (type) => {
  return fileTypeConfig[type]?.label || '文件'
}

const getAcceptType = (type) => {
  return fileTypeConfig[type]?.accept || '*'
}

const handleFileChange = (uploadFile) => {
  uploadForm.file = uploadFile.raw
  uploadForm.name = uploadFile.name
}

const confirmUpload = () => {
  if (!uploadForm.file) {
    ElMessage.warning('请选择文件')
    return
  }

  // 模拟文件上传（实际项目中应该上传到服务器）
  const fileData = {
    name: uploadForm.name || uploadForm.file.name,
    size: uploadForm.file.size,
    type: uploadForm.file.type,
    url: URL.createObjectURL(uploadForm.file), // 本地预览URL
    duration: uploadForm.duration,
    pages: uploadForm.pages,
    slides: uploadForm.slides,
    sheets: uploadForm.sheets
  }

  const storeMethod = fileTypeConfig[currentUploadType.value].storeMethod
  store[storeMethod](currentLesson.value.id, fileData)

  ElMessage.success('上传成功！')
  uploadDialogVisible.value = false
}

const deleteResource = (type, resourceId) => {
  ElMessageBox.confirm('确定要删除该资源吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const methodMap = {
      video: 'deleteVideoResource',
      pdf: 'deletePdfResource',
      ppt: 'deletePptResource',
      excel: 'deleteExcelResource',
      word: 'deleteWordResource'
    }
    
    store[methodMap[type]](currentLesson.value.id, resourceId)
    ElMessage.success('删除成功！')
  }).catch(() => {})
}

const previewFile = (file) => {
  if (file.url) {
    window.open(file.url, '_blank')
  } else {
    ElMessage.info('暂无预览')
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

// 加载数据
store.loadFromLocalStorage()
</script>

<style scoped lang="scss">
.classroom-resources-manage {
  padding: 20px;

  .header-card {
    margin-bottom: 20px;

    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      font-size: 24px;
    }

    p {
      color: #666;
      margin: 0;
    }
  }

  .selector-card {
    margin-bottom: 20px;

    .current-lesson-alert {
      margin-top: 16px;

      .lesson-info {
        display: flex;
        gap: 24px;
        font-size: 14px;

        span {
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }
    }
  }

  .resources-card {
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h3 {
        margin: 0;
        font-size: 18px;
      }
    }

    .resource-section {
      padding: 20px 0;
    }

    .file-preview {
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;

      &.video-preview {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
      }

      &.pdf-preview {
        background: linear-gradient(135deg, #f56c6c, #f093fb);
        color: white;
      }

      &.ppt-preview {
        background: linear-gradient(135deg, #e6a23c, #f39c12);
        color: white;
      }

      &.excel-preview {
        background: linear-gradient(135deg, #67c23a, #43e97b);
        color: white;
      }

      &.word-preview {
        background: linear-gradient(135deg, #409eff, #4facfe);
        color: white;
      }
    }
  }

  .upload-demo {
    :deep(.el-upload-dragger) {
      width: 100%;
      height: 200px;
    }
  }
}
</style>
