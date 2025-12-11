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

    <!-- 服务项目 -->
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3>{{ isChinese ? '服务项目' : 'Service Items' }}</h3>
          <el-button size="small" type="primary" @click="addServiceItem">
            <el-icon><Plus /></el-icon> {{ isChinese ? '添加服务' : 'Add Service' }}
          </el-button>
        </div>
      </template>
      
      <div v-for="(item, index) in localContent.serviceItems" :key="index">
        <el-card style="margin-bottom: 15px;">
          <template #header>
            <div style="display: flex; justify-content: space-between;">
              <span>{{ isChinese ? '服务' : 'Service' }} {{ index + 1 }}</span>
              <el-button size="small" type="danger" text @click="removeServiceItem(index)">{{ isChinese ? '删除' : 'Delete' }}</el-button>
            </div>
          </template>
          <el-form label-width="120px">
            <el-form-item :label="isChinese ? '图标' : 'Icon'">
              <el-select v-model="item.icon">
                <el-option label="Tools" value="Tools" />
                <el-option label="Reading" value="Reading" />
                <el-option label="Setting" value="Setting" />
                <el-option label="Service" value="Service" />
                <el-option label="DocumentCopy" value="DocumentCopy" />
                <el-option label="Pointer" value="Pointer" />
              </el-select>
            </el-form-item>
            <el-form-item :label="isChinese ? '标题' : 'Title'">
              <el-input v-model="item.title[lang]" />
            </el-form-item>
            <el-form-item :label="isChinese ? '描述' : 'Description'">
              <el-input type="textarea" :rows="2" v-model="item.description[lang]" />
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      
      <el-button type="primary" @click="saveContent">
        <el-icon><Check /></el-icon> {{ isChinese ? '保存配置' : 'Save' }}
      </el-button>
    </el-card>

    <!-- 技术支持 -->
    <el-card>
      <template #header><h3>{{ isChinese ? '技术支持' : 'Technical Support' }}</h3></template>
      <el-form :model="localContent.technicalSupport" label-width="120px">
        <el-form-item :label="isChinese ? '标题' : 'Title'">
          <el-input v-model="localContent.technicalSupport.title[lang]" />
        </el-form-item>
        
        <el-divider content-position="left">{{ isChinese ? '提供服务列表' : 'Provided Services' }}</el-divider>
        
        <el-form-item :label="isChinese ? '列表标题' : 'List Title'">
          <el-input v-model="localContent.technicalSupport.providedTitle[lang]" />
        </el-form-item>
        
        <div v-for="(item, index) in localContent.technicalSupport.providedItems" :key="index">
          <el-form-item :label="(isChinese ? '服务 ' : 'Service ') + (index + 1)">
            <el-input v-model="item[lang]" :placeholder="isChinese ? '输入服务项' : 'Enter service item'" />
            <el-button size="small" type="danger" text @click="removeTechSupportItem(index)" style="margin-top: 5px;">
              {{ isChinese ? '删除' : 'Delete' }}
            </el-button>
          </el-form-item>
        </div>
        
        <el-form-item>
          <el-button size="small" @click="addTechSupportItem">
            <el-icon><Plus /></el-icon> {{ isChinese ? '添加服务项' : 'Add Service Item' }}
          </el-button>
        </el-form-item>
        
        <el-divider content-position="left">{{ isChinese ? '联系方式' : 'Contact Information' }}</el-divider>
        
        <el-form-item :label="isChinese ? '联系标题' : 'Contact Title'">
          <el-input v-model="localContent.technicalSupport.contactTitle[lang]" />
        </el-form-item>
        
        <el-form-item :label="isChinese ? '热线标签' : 'Hotline Label'">
          <el-input v-model="localContent.technicalSupport.hotline.label[lang]" />
        </el-form-item>
        <el-form-item :label="isChinese ? '热线号码' : 'Hotline Number'">
          <el-input v-model="localContent.technicalSupport.hotline.value" />
        </el-form-item>
        
        <el-form-item :label="isChinese ? '邮箱标签' : 'Email Label'">
          <el-input v-model="localContent.technicalSupport.email.label[lang]" />
        </el-form-item>
        <el-form-item :label="isChinese ? '邮箱地址' : 'Email Address'">
          <el-input v-model="localContent.technicalSupport.email.value" />
        </el-form-item>
        
        <el-form-item :label="isChinese ? '按钮文字' : 'Button Text'">
          <el-input v-model="localContent.technicalSupport.buttonText[lang]" />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="saveContent">
            <el-icon><Check /></el-icon> {{ isChinese ? '保存配置' : 'Save' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 服务承诺 -->
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3>{{ isChinese ? '服务承诺' : 'Service Commitment' }}</h3>
          <el-button size="small" type="primary" @click="addServicePromise">
            <el-icon><Plus /></el-icon> {{ isChinese ? '添加承诺' : 'Add Promise' }}
          </el-button>
        </div>
      </template>
      
      <el-form :model="localContent.servicePromises" label-width="120px">
        <el-form-item :label="isChinese ? '标题' : 'Title'">
          <el-input v-model="localContent.servicePromises.title[lang]" />
        </el-form-item>
      </el-form>
      
      <el-divider />
      
      <div v-for="(promise, index) in localContent.servicePromises.items" :key="index">
        <el-card style="margin-bottom: 15px;">
          <template #header>
            <div style="display: flex; justify-content: space-between;">
              <span>{{ isChinese ? '承诺' : 'Promise' }} {{ index + 1 }}</span>
              <el-button size="small" type="danger" text @click="removeServicePromise(index)">{{ isChinese ? '删除' : 'Delete' }}</el-button>
            </div>
          </template>
          <el-form label-width="120px">
            <el-form-item :label="isChinese ? '标题' : 'Title'">
              <el-input v-model="promise.title[lang]" />
            </el-form-item>
            <el-form-item :label="isChinese ? '描述' : 'Description'">
              <el-input type="textarea" :rows="2" v-model="promise.description[lang]" />
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      
      <el-button type="primary" @click="saveContent">
        <el-icon><Check /></el-icon> {{ isChinese ? '保存配置' : 'Save' }}
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
  banner: { title: { 'zh-CN': '', 'en-US': '' }, subtitle: { 'zh-CN': '', 'en-US': '' } },
  serviceItems: [],
  technicalSupport: {
    title: { 'zh-CN': '技术支持', 'en-US': 'Technical Support' },
    providedTitle: { 'zh-CN': '我们提供', 'en-US': 'We Provide' },
    providedItems: [],
    contactTitle: { 'zh-CN': '联系技术支持', 'en-US': 'Contact Technical Support' },
    hotline: { label: { 'zh-CN': '技术热线', 'en-US': 'Technical Hotline' }, value: '400-123-4567' },
    email: { label: { 'zh-CN': '技术邮箱', 'en-US': 'Technical Email' }, value: 'support@mingsheng.com' },
    buttonText: { 'zh-CN': '在线咨询', 'en-US': 'Online Consultation' }
  },
  servicePromises: {
    title: { 'zh-CN': '服务承诺', 'en-US': 'Service Commitment' },
    items: []
  }
})

// 初始化
const initializeContent = () => {
  const serviceContent = pageContentStore.pages.service || {}
  localContent.value = {
    banner: serviceContent.banner || localContent.value.banner,
    serviceItems: serviceContent.serviceItems || [],
    technicalSupport: serviceContent.technicalSupport || localContent.value.technicalSupport,
    servicePromises: serviceContent.servicePromises || localContent.value.servicePromises,
    sections: serviceContent.sections || []
  }
}

initializeContent()

// 添加服务项
const addServiceItem = () => {
  localContent.value.serviceItems.push({
    icon: 'Tools',
    title: { 'zh-CN': '', 'en-US': '' },
    description: { 'zh-CN': '', 'en-US': '' }
  })
}

// 删除服务项
const removeServiceItem = (index) => {
  localContent.value.serviceItems.splice(index, 1)
}

// 添加技术支持项
const addTechSupportItem = () => {
  localContent.value.technicalSupport.providedItems.push({ 'zh-CN': '', 'en-US': '' })
}

// 删除技术支持项
const removeTechSupportItem = (index) => {
  localContent.value.technicalSupport.providedItems.splice(index, 1)
}

// 添加服务承诺
const addServicePromise = () => {
  localContent.value.servicePromises.items.push({
    title: { 'zh-CN': '', 'en-US': '' },
    description: { 'zh-CN': '', 'en-US': '' }
  })
}

// 删除服务承诺
const removeServicePromise = (index) => {
  localContent.value.servicePromises.items.splice(index, 1)
}

// 保存内容
const saveContent = () => {
  pageContentStore.updatePageContent('service', localContent.value)
  ElMessage.success(isChinese.value ? '保存成功' : 'Saved successfully')
}
</script>
