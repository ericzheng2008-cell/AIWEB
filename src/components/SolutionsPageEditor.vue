<template>
  <el-space direction="vertical" :size="20" style="width: 100%;">
    <!-- Banner配置 -->
    <el-card>
      <template #header><h3>{{ isChinese ? 'Banner横幅配置' : 'Banner Configuration' }}</h3></template>
      <el-form :model="localContent.banner" label-width="120px">
        <el-form-item :label="isChinese ? '标题' : 'Title'">
          <el-input v-model="localContent.banner.title[lang]" />
        </el-form-item>
        <el-form-item :label="isChinese ? '副标题' : 'Subtitle'">
          <el-input v-model="localContent.banner.subtitle[lang]" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveContent">
            <el-icon><Check /></el-icon> {{ isChinese ? '保存配置' : 'Save' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 页面标题配置 -->
    <el-card>
      <template #header><h3>{{ isChinese ? '页面文字配置' : 'Page Text Configuration' }}</h3></template>
      <el-form label-width="150px">
        <el-form-item :label="isChinese ? '方案特点标题' : 'Features Title'">
          <el-input v-model="localContent.featuresTitle[lang]" />
        </el-form-item>
        <el-form-item :label="isChinese ? '应用场景标题' : 'Applications Title'">
          <el-input v-model="localContent.applicationsTitle[lang]" />
        </el-form-item>
        <el-form-item :label="isChinese ? '咨询按钮文字' : 'Consult Button Text'">
          <el-input v-model="localContent.consultButtonText[lang]" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveContent">
            <el-icon><Check /></el-icon> {{ isChinese ? '保存配置' : 'Save' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 解决方案列表 -->
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3>{{ isChinese ? '解决方案列表' : 'Solutions List' }}</h3>
          <el-button size="small" type="primary" @click="addSolution">
            <el-icon><Plus /></el-icon> {{ isChinese ? '添加方案' : 'Add Solution' }}
          </el-button>
        </div>
      </template>
      
      <div v-for="(solution, index) in localContent.solutionsList" :key="solution.id">
        <el-card style="margin-bottom: 20px;">
          <template #header>
            <div style="display: flex; justify-content: space-between;">
              <span><strong>{{ isChinese ? '方案' : 'Solution' }} {{ index + 1 }}:</strong> {{ solution.name[lang] }}</span>
              <div>
                <el-button size="small" @click="moveSolutionUp(index)" :disabled="index === 0">{{ isChinese ? '上移' : 'Up' }}</el-button>
                <el-button size="small" @click="moveSolutionDown(index)" :disabled="index === localContent.solutionsList.length - 1">{{ isChinese ? '下移' : 'Down' }}</el-button>
                <el-button size="small" type="danger" text @click="removeSolution(index)">{{ isChinese ? '删除' : 'Delete' }}</el-button>
              </div>
            </div>
          </template>
          
          <el-form label-width="120px">
            <el-form-item :label="isChinese ? '名称' : 'Name'">
              <el-input v-model="solution.name[lang]" />
            </el-form-item>
            <el-form-item :label="isChinese ? '描述' : 'Description'">
              <el-input type="textarea" :rows="2" v-model="solution.description[lang]" />
            </el-form-item>
            <el-form-item :label="isChinese ? '图片URL' : 'Image URL'">
              <el-input v-model="solution.image" placeholder="https://..." />
            </el-form-item>
            
            <el-divider content-position="left">{{ isChinese ? '方案特点' : 'Features' }}</el-divider>
            
            <div v-for="(feature, fIndex) in solution.features" :key="fIndex">
              <el-form-item :label="(isChinese ? '特点 ' : 'Feature ') + (fIndex + 1)">
                <el-input v-model="feature[lang]" :placeholder="isChinese ? '输入特点' : 'Enter feature'" />
                <el-button size="small" type="danger" text @click="removeFeature(solution, fIndex)" style="margin-top: 5px;">
                  {{ isChinese ? '删除' : 'Delete' }}
                </el-button>
              </el-form-item>
            </div>
            
            <el-form-item>
              <el-button size="small" @click="addFeature(solution)">
                <el-icon><Plus /></el-icon> {{ isChinese ? '添加特点' : 'Add Feature' }}
              </el-button>
            </el-form-item>
            
            <el-divider content-position="left">{{ isChinese ? '应用场景' : 'Applications' }}</el-divider>
            
            <div v-for="(app, aIndex) in solution.applications" :key="aIndex">
              <el-form-item :label="(isChinese ? '场景 ' : 'Scenario ') + (aIndex + 1)">
                <el-input v-model="app[lang]" :placeholder="isChinese ? '输入场景' : 'Enter scenario'" />
                <el-button size="small" type="danger" text @click="removeApplication(solution, aIndex)" style="margin-top: 5px;">
                  {{ isChinese ? '删除' : 'Delete' }}
                </el-button>
              </el-form-item>
            </div>
            
            <el-form-item>
              <el-button size="small" @click="addApplication(solution)">
                <el-icon><Plus /></el-icon> {{ isChinese ? '添加场景' : 'Add Scenario' }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      
      <el-button type="primary" @click="saveContent" style="margin-top: 10px;">
        <el-icon><Check /></el-icon> {{ isChinese ? '保存所有配置' : 'Save All' }}
      </el-button>
    </el-card>
  </el-space>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { usePageContentStore } from '../store/pageContent'

const props = defineProps({
  lang: {
    type: String,
    default: 'zh-CN'
  }
})

const isChinese = computed(() => props.lang === 'zh-CN')

const pageContentStore = usePageContentStore()

// 本地内容副本
const localContent = ref({
  banner: {
    title: { 'zh-CN': '应用案例', 'en-US': 'Application Cases' },
    subtitle: { 'zh-CN': '', 'en-US': '' }
  },
  featuresTitle: { 'zh-CN': '方案特点', 'en-US': 'Solution Features' },
  applicationsTitle: { 'zh-CN': '应用场景', 'en-US': 'Application Scenarios' },
  consultButtonText: { 'zh-CN': '咨询方案', 'en-US': 'Consult Solution' },
  solutionsList: []
})

// 初始化
const initializeContent = () => {
  const solutionsContent = pageContentStore.pages.solutions || {}
  localContent.value = {
    banner: solutionsContent.banner || localContent.value.banner,
    featuresTitle: solutionsContent.featuresTitle || localContent.value.featuresTitle,
    applicationsTitle: solutionsContent.applicationsTitle || localContent.value.applicationsTitle,
    consultButtonText: solutionsContent.consultButtonText || localContent.value.consultButtonText,
    solutionsList: solutionsContent.solutionsList || [],
    categories: solutionsContent.categories || []
  }
}

initializeContent()

// 添加解决方案
const addSolution = () => {
  const maxId = localContent.value.solutionsList.length > 0 
    ? Math.max(...localContent.value.solutionsList.map(s => s.id)) + 1 
    : 1
    
  localContent.value.solutionsList.push({
    id: maxId,
    name: { 'zh-CN': '', 'en-US': '' },
    description: { 'zh-CN': '', 'en-US': '' },
    image: '',
    features: [],
    applications: []
  })
}

// 删除解决方案
const removeSolution = (index) => {
  localContent.value.solutionsList.splice(index, 1)
}

// 上移解决方案
const moveSolutionUp = (index) => {
  if (index > 0) {
    const temp = localContent.value.solutionsList[index]
    localContent.value.solutionsList[index] = localContent.value.solutionsList[index - 1]
    localContent.value.solutionsList[index - 1] = temp
  }
}

// 下移解决方案
const moveSolutionDown = (index) => {
  if (index < localContent.value.solutionsList.length - 1) {
    const temp = localContent.value.solutionsList[index]
    localContent.value.solutionsList[index] = localContent.value.solutionsList[index + 1]
    localContent.value.solutionsList[index + 1] = temp
  }
}

// 添加方案特点
const addFeature = (solution) => {
  solution.features.push({ 'zh-CN': '', 'en-US': '' })
}

// 删除方案特点
const removeFeature = (solution, index) => {
  solution.features.splice(index, 1)
}

// 添加应用场景
const addApplication = (solution) => {
  solution.applications.push({ 'zh-CN': '', 'en-US': '' })
}

// 删除应用场景
const removeApplication = (solution, index) => {
  solution.applications.splice(index, 1)
}

// 保存内容
const saveContent = () => {
  pageContentStore.updatePageContent('solutions', localContent.value)
  ElMessage.success(isChinese.value ? '保存成功' : 'Saved successfully')
}
</script>
