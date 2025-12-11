<template>
  <div class="page-content-manage">
    <el-card class="header-card">
      <h2><el-icon><Document /></el-icon> 页面内容管理系统</h2>
      <p>管理网站各页面的文字、图片、排版内容</p>
    </el-card>

    <el-tabs v-model="activeTab" class="content-tabs">
      <!-- 首页内容 -->
      <el-tab-pane label="首页内容" name="home">
        <el-card>
          <h3>Banner横幅配置</h3>
          <el-form :model="homeContent.banner" label-width="120px">
            <el-form-item label="中文标题">
              <el-input v-model="homeContent.banner.title['zh-CN']" />
            </el-form-item>
            <el-form-item label="英文标题">
              <el-input v-model="homeContent.banner.title['en-US']" />
            </el-form-item>
            <el-form-item label="中文副标题">
              <el-input v-model="homeContent.banner.subtitle['zh-CN']" />
            </el-form-item>
            <el-form-item label="英文副标题">
              <el-input v-model="homeContent.banner.subtitle['en-US']" />
            </el-form-item>
            <el-form-item label="中文描述">
              <el-input type="textarea" :rows="3" v-model="homeContent.banner.description['zh-CN']" />
            </el-form-item>
            <el-form-item label="英文描述">
              <el-input type="textarea" :rows="3" v-model="homeContent.banner.description['en-US']" />
            </el-form-item>
            <el-form-item label="背景图片">
              <ImageUploader v-model="homeContent.banner.image" alt="Banner图片" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveHomeContent">
                <el-icon><Check /></el-icon> 保存首页内容
              </el-button>
            </el-form-item>
          </el-form>

          <el-divider />

          <h3>首页内容模块</h3>
          <el-button type="primary" @click="showAddSectionDialog('home')" style="margin-bottom: 20px;">
            <el-icon><Plus /></el-icon> 添加内容模块
          </el-button>

          <div v-if="homeContent.sections && homeContent.sections.length > 0">
            <el-card v-for="(section, index) in homeContent.sections" :key="index" class="section-card">
              <div class="section-header">
                <h4>{{ section.title['zh-CN'] }}</h4>
                <div class="section-actions">
                  <el-button size="small" @click="editSection('home', index, section)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteSection('home', index)">删除</el-button>
                </div>
              </div>
              <p class="section-preview">{{ section.content['zh-CN'] }}</p>
              <img v-if="section.image" :src="section.image" class="section-image-preview" />
            </el-card>
          </div>
        </el-card>
      </el-tab-pane>

      <!-- 关于我们 -->
      <el-tab-pane label="关于我们" name="about">
        <el-card>
          <h3>Banner横幅配置</h3>
          <el-form :model="aboutContent.banner" label-width="120px">
            <el-form-item label="中文标题">
              <el-input v-model="aboutContent.banner.title['zh-CN']" />
            </el-form-item>
            <el-form-item label="英文标题">
              <el-input v-model="aboutContent.banner.title['en-US']" />
            </el-form-item>
            <el-form-item label="中文副标题">
              <el-input v-model="aboutContent.banner.subtitle['zh-CN']" />
            </el-form-item>
            <el-form-item label="英文副标题">
              <el-input v-model="aboutContent.banner.subtitle['en-US']" />
            </el-form-item>
            <el-form-item label="背景图片">
              <ImageUploader v-model="aboutContent.banner.image" alt="Banner图片" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveAboutContent">
                <el-icon><Check /></el-icon> 保存Banner配置
              </el-button>
            </el-form-item>
          </el-form>

          <el-divider />

          <h3>内容模块</h3>
          <el-button type="primary" @click="showAddSectionDialog('about')" style="margin-bottom: 20px;">
            <el-icon><Plus /></el-icon> 添加内容模块
          </el-button>
          
          <div v-if="aboutContent.sections && aboutContent.sections.length > 0">
            <el-card v-for="(section, index) in aboutContent.sections" :key="index" class="section-card">
              <div class="section-header">
                <h4>{{ section.title['zh-CN'] }}</h4>
                <div class="section-actions">
                  <el-button size="small" @click="editSection('about', index, section)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteSection('about', index)">删除</el-button>
                </div>
              </div>
              <p class="section-preview">{{ section.content['zh-CN'] }}</p>
              <img v-if="section.image" :src="section.image" class="section-image-preview" />
            </el-card>
          </div>
        </el-card>
      </el-tab-pane>

      <!-- 服务与支持 -->
      <el-tab-pane label="服务与支持" name="service">
        <el-card>
          <h3>Banner横幅配置</h3>
          <el-form :model="serviceContent.banner" label-width="120px">
            <el-form-item label="中文标题">
              <el-input v-model="serviceContent.banner.title['zh-CN']" />
            </el-form-item>
            <el-form-item label="英文标题">
              <el-input v-model="serviceContent.banner.title['en-US']" />
            </el-form-item>
            <el-form-item label="中文副标题">
              <el-input v-model="serviceContent.banner.subtitle['zh-CN']" />
            </el-form-item>
            <el-form-item label="英文副标题">
              <el-input v-model="serviceContent.banner.subtitle['en-US']" />
            </el-form-item>
            <el-form-item label="背景图片">
              <ImageUploader v-model="serviceContent.banner.image" alt="Banner图片" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveServiceContent">
                <el-icon><Check /></el-icon> 保存Banner配置
              </el-button>
            </el-form-item>
          </el-form>

          <el-divider />

          <h3>内容模块</h3>
          <el-button type="primary" @click="showAddSectionDialog('service')" style="margin-bottom: 20px;">
            <el-icon><Plus /></el-icon> 添加内容模块
          </el-button>
          
          <div v-if="serviceContent.sections && serviceContent.sections.length > 0">
            <el-card v-for="(section, index) in serviceContent.sections" :key="index" class="section-card">
              <div class="section-header">
                <h4>{{ section.title['zh-CN'] }}</h4>
                <div class="section-actions">
                  <el-button size="small" @click="editSection('service', index, section)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteSection('service', index)">删除</el-button>
                </div>
              </div>
              <p class="section-preview">{{ section.content['zh-CN'] }}</p>
              <img v-if="section.image" :src="section.image" class="section-image-preview" />
            </el-card>
          </div>
        </el-card>
      </el-tab-pane>

      <!-- 联系我们 -->
      <el-tab-pane label="联系我们" name="contact">
        <el-card>
          <h3>Banner横幅配置</h3>
          <el-form :model="contactContent.banner" label-width="120px">
            <el-form-item label="中文标题">
              <el-input v-model="contactContent.banner.title['zh-CN']" />
            </el-form-item>
            <el-form-item label="英文标题">
              <el-input v-model="contactContent.banner.title['en-US']" />
            </el-form-item>
            <el-form-item label="中文副标题">
              <el-input v-model="contactContent.banner.subtitle['zh-CN']" />
            </el-form-item>
            <el-form-item label="英文副标题">
              <el-input v-model="contactContent.banner.subtitle['en-US']" />
            </el-form-item>
            <el-form-item label="背景图片">
              <ImageUploader v-model="contactContent.banner.image" alt="Banner图片" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveContactContent">
                <el-icon><Check /></el-icon> 保存Banner配置
              </el-button>
            </el-form-item>
          </el-form>

          <el-divider />

          <h3>内容模块</h3>
          <el-button type="primary" @click="showAddSectionDialog('contact')" style="margin-bottom: 20px;">
            <el-icon><Plus /></el-icon> 添加内容模块
          </el-button>
          
          <div v-if="contactContent.sections && contactContent.sections.length > 0">
            <el-card v-for="(section, index) in contactContent.sections" :key="index" class="section-card">
              <div class="section-header">
                <h4>{{ section.title['zh-CN'] }}</h4>
                <div class="section-actions">
                  <el-button size="small" @click="editSection('contact', index, section)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteSection('contact', index)">删除</el-button>
                </div>
              </div>
              <p class="section-preview">{{ section.content['zh-CN'] }}</p>
              <img v-if="section.image" :src="section.image" class="section-image-preview" />
            </el-card>
          </div>
        </el-card>
      </el-tab-pane>

      <!-- 应用案例分类管理 -->
      <el-tab-pane label="应用案例分类" name="solutions">
        <el-card>
          <div class="section-header">
            <h3>应用案例分类（3级结构）</h3>
            <el-button type="primary" @click="showAddSolutionCategoryDialog(1)">
              <el-icon><Plus /></el-icon> 添加1级分类
            </el-button>
          </div>

          <!-- 分类树形展示 -->
          <el-tree
            :data="solutionCategoryTree"
            :props="{ label: 'label', children: 'children' }"
            node-key="id"
            default-expand-all
            class="category-tree">
            <template #default="{ node, data }">
              <div class="tree-node">
                <span class="node-label">
                  <el-tag :type="getLevelType(data.level)" size="small">{{ data.level }}级</el-tag>
                  {{ data.label }}
                </span>
                <span class="node-actions">
                  <el-button 
                    v-if="data.level < 3" 
                    size="small" 
                    text
                    @click.stop="showAddSolutionCategoryDialog(data.level + 1, data.realId)">
                    添加子分类
                  </el-button>
                  <el-button size="small" text @click.stop="editSolutionCategory(data)">编辑</el-button>
                  <el-button size="small" text type="danger" @click.stop="deleteSolutionCategory(data)">删除</el-button>
                </span>
              </div>
            </template>
          </el-tree>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加/编辑内容模块对话框 -->
    <el-dialog 
      v-model="sectionDialogVisible" 
      :title="isEditMode ? '编辑内容模块' : '添加内容模块'"
      width="800px">
      <el-form :model="sectionForm" label-width="120px">
        <el-form-item label="中文标题">
          <el-input v-model="sectionForm.title['zh-CN']" />
        </el-form-item>
        <el-form-item label="英文标题">
          <el-input v-model="sectionForm.title['en-US']" />
        </el-form-item>
        <el-form-item label="中文内容">
          <el-input type="textarea" :rows="6" v-model="sectionForm.content['zh-CN']" />
        </el-form-item>
        <el-form-item label="英文内容">
          <el-input type="textarea" :rows="6" v-model="sectionForm.content['en-US']" />
        </el-form-item>
        <el-form-item label="配图">
          <ImageUploader v-model="sectionForm.image" alt="内容配图" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="sectionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSection">保存</el-button>
      </template>
    </el-dialog>

    <!-- 添加/编辑应用案例分类对话框 -->
    <el-dialog 
      v-model="solutionCategoryDialogVisible" 
      :title="isEditMode ? '编辑案例分类' : '添加案例分类'"
      width="700px">
      <el-form :model="solutionCategoryForm" label-width="120px">
        <el-form-item v-if="solutionCategoryForm.level > 1" label="上级分类">
          <el-select v-model="solutionCategoryForm.parentId" placeholder="请选择上级分类" style="width: 100%;">
            <el-option 
              v-for="cat in getParentOptions(solutionCategoryForm.level)" 
              :key="cat.id" 
              :label="cat.name['zh-CN']" 
              :value="cat.id" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="中文名称">
          <el-input v-model="solutionCategoryForm.name['zh-CN']" />
        </el-form-item>
        <el-form-item label="英文名称">
          <el-input v-model="solutionCategoryForm.name['en-US']" />
        </el-form-item>
        <el-form-item label="中文描述">
          <el-input type="textarea" :rows="3" v-model="solutionCategoryForm.description['zh-CN']" />
        </el-form-item>
        <el-form-item label="英文描述">
          <el-input type="textarea" :rows="3" v-model="solutionCategoryForm.description['en-US']" />
        </el-form-item>
        <el-form-item label="分类图片">
          <ImageUploader v-model="solutionCategoryForm.image" alt="分类图片" />
        </el-form-item>
        <el-form-item v-if="solutionCategoryForm.level === 1" label="图标">
          <el-input v-model="solutionCategoryForm.icon" placeholder="如：Van, Monitor等" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="solutionCategoryDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSolutionCategory">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { usePageContentStore } from '../../store/pageContent'
import ImageUploader from '../../components/ImageUploader.vue'

const pageStore = usePageContentStore()
const activeTab = ref('home')

// 页面内容
const homeContent = ref({ banner: {}, sections: [] })
const aboutContent = ref({ banner: {}, sections: [] })
const serviceContent = ref({ banner: {}, sections: [] })
const contactContent = ref({ banner: {}, sections: [] })

// 内容模块表单
const sectionDialogVisible = ref(false)
const isEditMode = ref(false)
const currentPage = ref('')
const currentSectionIndex = ref(-1)
const sectionForm = ref({
  title: { 'zh-CN': '', 'en-US': '' },
  content: { 'zh-CN': '', 'en-US': '' },
  image: ''
})

// 应用案例分类表单
const solutionCategoryDialogVisible = ref(false)
const solutionCategoryForm = ref({
  level: 1,
  parentId: null,
  name: { 'zh-CN': '', 'en-US': '' },
  description: { 'zh-CN': '', 'en-US': '' },
  image: '',
  icon: ''
})

// 构建应用案例分类树
const solutionCategoryTree = computed(() => {
  return pageStore.solutionCategories.map(cat => {
    const subs = pageStore.solutionSubCategories
      .filter(s => s.parentId === cat.id)
      .map(sub => {
        const thirds = pageStore.solutionThirdCategories
          .filter(t => t.parentId === sub.id)
          .map(third => ({
            id: `third-${third.id}`,
            label: third.name['zh-CN'],
            level: 3,
            realId: third.id,
            type: 'third',
            data: third
          }))
        
        return {
          id: `sub-${sub.id}`,
          label: sub.name['zh-CN'],
          level: 2,
          realId: sub.id,
          type: 'sub',
          data: sub,
          children: thirds
        }
      })
    
    return {
      id: `cat-${cat.id}`,
      label: cat.name['zh-CN'],
      level: 1,
      realId: cat.id,
      type: 'category',
      data: cat,
      children: subs
    }
  })
})

// 加载页面内容
const loadContent = () => {
  homeContent.value = pageStore.getPageContent('home')
  if (!homeContent.value.banner) homeContent.value.banner = {}
  if (!homeContent.value.sections) homeContent.value.sections = []
  
  aboutContent.value = pageStore.getPageContent('about')
  if (!aboutContent.value.sections) aboutContent.value.sections = []
  if (!aboutContent.value.banner) aboutContent.value.banner = { title: { 'zh-CN': '', 'en-US': '' }, subtitle: { 'zh-CN': '', 'en-US': '' }, image: '' }
  
  serviceContent.value = pageStore.getPageContent('service')
  if (!serviceContent.value.sections) serviceContent.value.sections = []
  if (!serviceContent.value.banner) serviceContent.value.banner = { title: { 'zh-CN': '', 'en-US': '' }, subtitle: { 'zh-CN': '', 'en-US': '' }, image: '' }
  
  contactContent.value = pageStore.getPageContent('contact')
  if (!contactContent.value.sections) contactContent.value.sections = []
  if (!contactContent.value.banner) contactContent.value.banner = { title: { 'zh-CN': '', 'en-US': '' }, subtitle: { 'zh-CN': '', 'en-US': '' }, image: '' }
}

// 保存首页内容
const saveHomeContent = () => {
  pageStore.updatePageContent('home', homeContent.value)
  ElMessage.success('首页内容已保存')
}

// 保存关于我们内容
const saveAboutContent = () => {
  pageStore.updatePageContent('about', aboutContent.value)
  ElMessage.success('关于我们内容已保存')
}

// 保存服务与支持内容
const saveServiceContent = () => {
  pageStore.updatePageContent('service', serviceContent.value)
  ElMessage.success('服务与支持内容已保存')
}

// 保存联系我们内容
const saveContactContent = () => {
  pageStore.updatePageContent('contact', contactContent.value)
  ElMessage.success('联系我们内容已保存')
}

// 显示添加模块对话框
const showAddSectionDialog = (page) => {
  currentPage.value = page
  isEditMode.value = false
  currentSectionIndex.value = -1
  sectionForm.value = {
    title: { 'zh-CN': '', 'en-US': '' },
    content: { 'zh-CN': '', 'en-US': '' },
    image: ''
  }
  sectionDialogVisible.value = true
}

// 编辑模块
const editSection = (page, index, section) => {
  currentPage.value = page
  isEditMode.value = true
  currentSectionIndex.value = index
  sectionForm.value = JSON.parse(JSON.stringify(section))
  sectionDialogVisible.value = true
}

// 保存模块
const saveSection = () => {
  if (!sectionForm.value.title['zh-CN']) {
    ElMessage.warning('请填写中文标题')
    return
  }
  
  pageStore.updatePageSection(currentPage.value, currentSectionIndex.value, sectionForm.value)
  sectionDialogVisible.value = false
  loadContent()
  ElMessage.success('保存成功')
}

// 删除模块
const deleteSection = (page, index) => {
  ElMessageBox.confirm('确定要删除这个内容模块吗？', '确认删除', {
    type: 'warning'
  }).then(() => {
    pageStore.deletePageSection(page, index)
    loadContent()
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 显示添加应用案例分类对话框
const showAddSolutionCategoryDialog = (level, parentId = null) => {
  isEditMode.value = false
  solutionCategoryForm.value = {
    level,
    parentId,
    name: { 'zh-CN': '', 'en-US': '' },
    description: { 'zh-CN': '', 'en-US': '' },
    image: '',
    icon: ''
  }
  solutionCategoryDialogVisible.value = true
}

// 编辑应用案例分类
const editSolutionCategory = (data) => {
  isEditMode.value = true
  solutionCategoryForm.value = JSON.parse(JSON.stringify(data.data))
  solutionCategoryForm.value.level = data.level
  solutionCategoryDialogVisible.value = true
}

// 保存应用案例分类
const saveSolutionCategory = () => {
  if (!solutionCategoryForm.value.name['zh-CN']) {
    ElMessage.warning('请填写完整的名称')
    return
  }
  
  if (isEditMode.value) {
    if (solutionCategoryForm.value.level === 1) {
      pageStore.updateSolutionCategory(solutionCategoryForm.value)
    } else if (solutionCategoryForm.value.level === 2) {
      pageStore.updateSolutionSubCategory(solutionCategoryForm.value)
    } else {
      pageStore.updateSolutionThirdCategory(solutionCategoryForm.value)
    }
  } else {
    if (solutionCategoryForm.value.level === 1) {
      pageStore.addSolutionCategory(solutionCategoryForm.value)
    } else if (solutionCategoryForm.value.level === 2) {
      pageStore.addSolutionSubCategory(solutionCategoryForm.value)
    } else {
      pageStore.addSolutionThirdCategory(solutionCategoryForm.value)
    }
  }
  
  solutionCategoryDialogVisible.value = false
  ElMessage.success('保存成功')
}

// 删除应用案例分类
const deleteSolutionCategory = (data) => {
  ElMessageBox.confirm(`确定要删除 "${data.label}" 及其所有子分类和案例吗？`, '确认删除', {
    type: 'warning'
  }).then(() => {
    if (data.level === 1) {
      pageStore.deleteSolutionCategory(data.realId)
    } else if (data.level === 2) {
      pageStore.deleteSolutionSubCategory(data.realId)
    } else {
      pageStore.deleteSolutionThirdCategory(data.realId)
    }
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 获取上级分类选项
const getParentOptions = (level) => {
  if (level === 2) {
    return pageStore.solutionCategories
  } else if (level === 3) {
    return pageStore.solutionSubCategories
  }
  return []
}

// 获取等级类型
const getLevelType = (level) => {
  const types = { 1: 'danger', 2: 'warning', 3: 'success' }
  return types[level] || 'info'
}

onMounted(() => {
  loadContent()
})
</script>

<style scoped>
.page-content-manage {
  padding: 20px;
}

.header-card {
  margin-bottom: 20px;
}

.header-card h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
  margin-bottom: 8px;
}

.content-tabs {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.section-card {
  margin-bottom: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.section-preview {
  color: #666;
  font-size: 14px;
  margin-bottom: 12px;
  white-space: pre-wrap;
  max-height: 100px;
  overflow: hidden;
}

.section-image-preview {
  max-width: 200px;
  max-height: 150px;
  border-radius: 4px;
}

.category-tree {
  margin-top: 20px;
}

.tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 20px;
}

.node-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.node-actions {
  display: flex;
  gap: 8px;
}
</style>
