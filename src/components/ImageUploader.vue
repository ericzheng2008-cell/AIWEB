<template>
  <div class="image-uploader">
    <div v-if="imageUrl" class="image-preview" @click="handleImageClick">
      <img :src="imageUrl" :alt="alt" />
      <div class="image-overlay">
        <div class="overlay-text">点击替换图片</div>
      </div>
      <div class="image-actions" @click.stop>
        <el-button size="small" @click="handleChange">
          <el-icon><Edit /></el-icon> 更换
        </el-button>
        <el-button size="small" @click="handleView">
          <el-icon><ZoomIn /></el-icon> 查看
        </el-button>
        <el-button size="small" type="danger" @click="handleRemove">
          <el-icon><Delete /></el-icon> 删除
        </el-button>
      </div>
    </div>
    
    <div v-else class="upload-trigger" @click="handleClick">
      <el-icon :size="40"><Plus /></el-icon>
      <div class="upload-text">点击上传图片</div>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleFileSelect"
    />

    <!-- 图片选择对话框 -->
    <el-dialog v-model="dialogVisible" title="选择图片" width="600px">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="本地上传" name="upload">
          <div class="upload-area">
            <el-upload
              class="upload-dragger"
              drag
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleUploadChange">
              <el-icon class="upload-icon" :size="60"><UploadFilled /></el-icon>
              <div class="upload-text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="upload-tip">支持 JPG、PNG、GIF 格式，建议大小不超过2MB</div>
            </el-upload>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="网络图片" name="url">
          <el-form :model="urlForm" label-width="80px">
            <el-form-item label="图片URL">
              <el-input 
                v-model="urlForm.url" 
                placeholder="请输入图片URL"
                @keyup.enter="handleUrlSubmit">
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleUrlSubmit">确定</el-button>
            </el-form-item>
          </el-form>
          
          <div v-if="urlForm.url" class="url-preview">
            <img :src="urlForm.url" alt="预览" @error="handleImageError" />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <!-- 图片查看对话框 -->
    <el-dialog v-model="viewDialogVisible" title="查看图片" width="80%">
      <div class="image-view">
        <img :src="imageUrl" :alt="alt" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: '图片'
  }
})

const emit = defineEmits(['update:modelValue'])

const imageUrl = ref(props.modelValue)
const fileInput = ref(null)
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const activeTab = ref('upload')
const urlForm = ref({
  url: ''
})

// 打开选择对话框
const handleClick = () => {
  dialogVisible.value = true
}

const handleImageClick = () => {
  dialogVisible.value = true
}

const handleChange = () => {
  dialogVisible.value = true
}

const handleView = () => {
  viewDialogVisible.value = true
}

const handleRemove = () => {
  imageUrl.value = ''
  emit('update:modelValue', '')
  ElMessage.success('图片已删除')
}

// 处理文件选择
const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    processFile(file)
  }
}

// 处理上传组件的文件
const handleUploadChange = (uploadFile) => {
  const file = uploadFile.raw
  if (file) {
    processFile(file)
  }
}

// 处理文件转换为Base64
const processFile = (file) => {
  // 检查文件大小
  if (file.size > 2 * 1024 * 1024) {
    ElMessage.warning('图片大小不能超过2MB')
    return
  }

  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    ElMessage.warning('请选择图片文件')
    return
  }

  // 转换为Base64
  const reader = new FileReader()
  reader.onload = (e) => {
    imageUrl.value = e.target.result
    emit('update:modelValue', e.target.result)
    dialogVisible.value = false
    ElMessage.success('图片上传成功')
  }
  reader.onerror = () => {
    ElMessage.error('图片读取失败')
  }
  reader.readAsDataURL(file)
}

// 处理URL提交
const handleUrlSubmit = () => {
  if (!urlForm.value.url.trim()) {
    ElMessage.warning('请输入图片URL')
    return
  }
  
  imageUrl.value = urlForm.value.url
  emit('update:modelValue', urlForm.value.url)
  dialogVisible.value = false
  urlForm.value.url = ''
  ElMessage.success('图片已设置')
}

// 处理图片加载错误
const handleImageError = () => {
  ElMessage.error('图片加载失败，请检查URL是否正确')
}

// 监听props变化
const watchProps = () => {
  imageUrl.value = props.modelValue
}
watchProps()
</script>

<style scoped>
.image-uploader {
  width: 100%;
}

.image-preview {
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
  background: #f5f7fa;
  cursor: pointer;
  transition: all 0.3s;
}

.image-preview:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.image-preview img {
  width: 100%;
  height: auto;
  display: block;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(64, 158, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-preview:hover .image-overlay {
  opacity: 1;
}

.overlay-text {
  color: white;
  font-size: 16px;
  font-weight: 500;
}

.image-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  padding: 10px;
  display: flex;
  justify-content: center;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s;
  z-index: 10;
}

.image-preview:hover .image-actions {
  opacity: 1;
}

.upload-trigger {
  border: 2px dashed #dcdfe6;
  border-radius: 4px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #fafbfc;
}

.upload-trigger:hover {
  border-color: #409eff;
  background: #f0f9ff;
}

.upload-trigger .el-icon {
  color: #c0c4cc;
}

.upload-text {
  margin-top: 10px;
  color: #606266;
  font-size: 14px;
}

.upload-area {
  padding: 20px 0;
}

.upload-dragger {
  width: 100%;
}

.upload-icon {
  color: #409eff;
  margin-bottom: 16px;
}

.upload-tip {
  color: #999;
  font-size: 12px;
  margin-top: 8px;
}

.url-preview {
  margin-top: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 10px;
  background: #f5f7fa;
}

.url-preview img {
  max-width: 100%;
  height: auto;
  display: block;
}

.image-view {
  text-align: center;
}

.image-view img {
  max-width: 100%;
  height: auto;
}
</style>
