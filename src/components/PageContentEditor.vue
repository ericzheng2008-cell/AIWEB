<template>
  <el-card>
    <h3>Banner横幅配置</h3>
    <el-form :model="pageContent.banner" label-width="120px">
      <el-form-item label="中文标题">
        <el-input v-model="pageContent.banner.title['zh-CN']" />
      </el-form-item>
      <el-form-item label="英文标题">
        <el-input v-model="pageContent.banner.title['en-US']" />
      </el-form-item>
      <el-form-item label="中文副标题">
        <el-input v-model="pageContent.banner.subtitle['zh-CN']" />
      </el-form-item>
      <el-form-item label="英文副标题">
        <el-input v-model="pageContent.banner.subtitle['en-US']" />
      </el-form-item>
      <!-- 首页独有字段 -->
      <template v-if="pageType === 'home'">
        <el-form-item label="中文描述">
          <el-input type="textarea" :rows="3" v-model="pageContent.banner.description['zh-CN']" />
        </el-form-item>
        <el-form-item label="英文描述">
          <el-input type="textarea" :rows="3" v-model="pageContent.banner.description['en-US']" />
        </el-form-item>
        <el-form-item label="中文按钮文字">
          <el-input v-model="pageContent.banner.buttonText['zh-CN']" />
        </el-form-item>
        <el-form-item label="英文按钮文字">
          <el-input v-model="pageContent.banner.buttonText['en-US']" />
        </el-form-item>
      </template>
      <el-form-item label="背景图片">
        <ImageUploader v-model="pageContent.banner.image" alt="Banner图片" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveContent">
          <el-icon><Check /></el-icon> 保存Banner配置
        </el-button>
      </el-form-item>
    </el-form>

    <el-divider />

    <h3>内容模块</h3>
    <el-button type="primary" @click="showAddSectionDialog" style="margin-bottom: 20px;">
      <el-icon><Plus /></el-icon> 添加内容模块
    </el-button>

    <div v-if="pageContent.sections && pageContent.sections.length > 0">
      <el-card v-for="(section, index) in pageContent.sections" :key="index" class="section-card">
        <div class="section-header">
          <h4>{{ section.title['zh-CN'] }}</h4>
          <div class="section-actions">
            <el-button size="small" @click="editSection(index, section)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteSection(index)">删除</el-button>
          </div>
        </div>
        <p class="section-preview">{{ section.content['zh-CN'] }}</p>
        <img v-if="section.image" :src="section.image" class="section-image-preview" />
      </el-card>
    </div>
  </el-card>

  <!-- 内容模块编辑对话框 -->
  <el-dialog v-model="sectionDialogVisible" :title="sectionForm.isEdit ? '编辑内容模块' : '添加内容模块'" width="700px">
    <el-form :model="sectionForm" label-width="120px">
      <el-form-item label="中文标题">
        <el-input v-model="sectionForm.title['zh-CN']" />
      </el-form-item>
      <el-form-item label="英文标题">
        <el-input v-model="sectionForm.title['en-US']" />
      </el-form-item>
      <el-form-item label="中文内容">
        <el-input type="textarea" :rows="5" v-model="sectionForm.content['zh-CN']" />
      </el-form-item>
      <el-form-item label="英文内容">
        <el-input type="textarea" :rows="5" v-model="sectionForm.content['en-US']" />
      </el-form-item>
      <el-form-item label="配图">
        <ImageUploader v-model="sectionForm.image" alt="模块配图" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="sectionDialogVisible = false">取消</el-button>
      <el-button type="primary" @click="saveSectionForm">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { usePageContentStore } from '../store/pageContent'
import ImageUploader from './ImageUploader.vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  pageType: {
    type: String,
    required: true,
    validator: (value) => ['home', 'about', 'service', 'contact'].includes(value)
  },
  lang: {
    type: String,
    default: 'zh-CN'
  }
})

const pageContentStore = usePageContentStore()

// 页面内容
const pageContent = reactive({
  banner: {
    title: { 'zh-CN': '', 'en-US': '' },
    subtitle: { 'zh-CN': '', 'en-US': '' },
    description: { 'zh-CN': '', 'en-US': '' },
    buttonText: { 'zh-CN': '', 'en-US': '' },
    image: ''
  },
  sections: []
})

// 加载页面内容
const loadPageContent = () => {
  const content = pageContentStore.pages[props.pageType]
  if (content) {
    // 确保所有字段都存在
    pageContent.banner = {
      title: content.banner.title || { 'zh-CN': '', 'en-US': '' },
      subtitle: content.banner.subtitle || { 'zh-CN': '', 'en-US': '' },
      description: content.banner.description || { 'zh-CN': '', 'en-US': '' },
      buttonText: content.banner.buttonText || { 'zh-CN': '', 'en-US': '' },
      image: content.banner.image || ''
    }
    pageContent.sections = [...(content.sections || [])]
  }
}

// 监听页面类型变化
watch(() => props.pageType, loadPageContent, { immediate: true })

// 保存内容
const saveContent = () => {
  // 准备保存的数据，只保存当前页面类型需要的字段
  const contentToSave = {
    banner: {
      title: { ...pageContent.banner.title },
      subtitle: { ...pageContent.banner.subtitle },
      image: pageContent.banner.image
    },
    sections: [...pageContent.sections]
  }
  
  // 首页需要额外的字段
  if (props.pageType === 'home') {
    contentToSave.banner.description = { ...pageContent.banner.description }
    contentToSave.banner.buttonText = { ...pageContent.banner.buttonText }
  }
  
  pageContentStore.updatePageContent(props.pageType, contentToSave)
  ElMessage.success('保存成功')
}

// 内容模块对话框
const sectionDialogVisible = ref(false)
const sectionForm = reactive({
  isEdit: false,
  editIndex: -1,
  title: { 'zh-CN': '', 'en-US': '' },
  content: { 'zh-CN': '', 'en-US': '' },
  image: ''
})

const showAddSectionDialog = () => {
  sectionForm.isEdit = false
  sectionForm.editIndex = -1
  sectionForm.title = { 'zh-CN': '', 'en-US': '' }
  sectionForm.content = { 'zh-CN': '', 'en-US': '' }
  sectionForm.image = ''
  sectionDialogVisible.value = true
}

const editSection = (index, section) => {
  sectionForm.isEdit = true
  sectionForm.editIndex = index
  sectionForm.title = { ...section.title }
  sectionForm.content = { ...section.content }
  sectionForm.image = section.image || ''
  sectionDialogVisible.value = true
}

const saveSectionForm = () => {
  const section = {
    title: { ...sectionForm.title },
    content: { ...sectionForm.content },
    image: sectionForm.image
  }

  if (sectionForm.isEdit) {
    pageContent.sections[sectionForm.editIndex] = section
  } else {
    pageContent.sections.push(section)
  }

  saveContent()
  sectionDialogVisible.value = false
}

const deleteSection = (index) => {
  pageContent.sections.splice(index, 1)
  saveContent()
  ElMessage.success('删除成功')
}
</script>

<style scoped>
.section-card {
  margin-bottom: 15px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.section-actions {
  display: flex;
  gap: 10px;
}

.section-preview {
  color: #666;
  margin: 10px 0;
  line-height: 1.6;
}

.section-image-preview {
  max-width: 200px;
  max-height: 150px;
  object-fit: cover;
  border-radius: 4px;
  margin-top: 10px;
}
</style>
