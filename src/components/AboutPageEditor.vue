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


    <!-- 公司简介 -->
    <el-card>
      <template #header><h3>{{ isChinese ? '公司简介' : 'Company Profile' }}</h3></template>
      <el-form :model="localContent.companyIntro" label-width="120px">
        <el-form-item :label="isChinese ? '标题' : 'Title'">
          <el-input v-model="localContent.companyIntro.title[lang]" />
        </el-form-item>
        <el-form-item :label="isChinese ? '内容段落1' : 'Content Paragraph 1'">
          <el-input type="textarea" :rows="4" v-model="localContent.companyIntro.content[0][lang]" />
        </el-form-item>
        <el-form-item :label="isChinese ? '内容段落2' : 'Content Paragraph 2'">
          <el-input type="textarea" :rows="4" v-model="localContent.companyIntro.content[1][lang]" />
        </el-form-item>
        <el-form-item :label="isChinese ? '配图URL' : 'Image URL'">
          <el-input v-model="localContent.companyIntro.image" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveContent">
            <el-icon><Check /></el-icon> {{ isChinese ? '保存配置' : 'Save' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 发展历程 -->
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3>{{ isChinese ? '发展历程' : 'Development History' }}</h3>
          <el-button size="small" type="primary" @click="addTimelineItem">
            <el-icon><Plus /></el-icon> {{ isChinese ? '添加里程碑' : 'Add Milestone' }}
          </el-button>
        </div>
      </template>
      <el-form :model="localContent.timeline" label-width="120px">
        <el-form-item :label="isChinese ? '标题' : 'Title'">
          <el-input v-model="localContent.timeline.title[lang]" />
        </el-form-item>
      </el-form>
      
      <el-divider />
      
      <div v-for="(item, index) in localContent.timeline.items" :key="index" class="timeline-item-editor">
        <el-card style="margin-bottom: 15px;">
          <template #header>
            <div style="display: flex; justify-content: space-between;">
              <span>{{ isChinese ? '里程碑' : 'Milestone' }} {{ index + 1 }}</span>
              <el-button size="small" type="danger" text @click="removeTimelineItem(index)">{{ isChinese ? '删除' : 'Delete' }}</el-button>
            </div>
          </template>
          <el-form label-width="120px">
            <el-form-item :label="isChinese ? '年份' : 'Year'">
              <el-input v-model="item.year" v-if="typeof item.year === 'string'" />
              <el-input v-else v-model="item.year[lang]" />
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
      
      <el-button type="primary" @click="saveContent" style="margin-top: 10px;">
        <el-icon><Check /></el-icon> {{ isChinese ? '保存配置' : 'Save' }}
      </el-button>
    </el-card>

    <!-- 资质认证 -->
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <h3>{{ isChinese ? '资质认证' : 'Certifications' }}</h3>
          <el-button size="small" type="primary" @click="addCertification">
            <el-icon><Plus /></el-icon> {{ isChinese ? '添加认证' : 'Add Certification' }}
          </el-button>
        </div>
      </template>
      <el-form :model="localContent.certifications" label-width="120px">
        <el-form-item :label="isChinese ? '标题' : 'Title'">
          <el-input v-model="localContent.certifications.title[lang]" />
        </el-form-item>
      </el-form>
      
      <el-divider />
      
      <div v-for="(cert, index) in localContent.certifications.items" :key="index">
        <el-card style="margin-bottom: 15px;">
          <template #header>
            <div style="display: flex; justify-content: space-between;">
              <span>{{ isChinese ? '认证' : 'Certification' }} {{ index + 1 }}</span>
              <el-button size="small" type="danger" text @click="removeCertification(index)">{{ isChinese ? '删除' : 'Delete' }}</el-button>
            </div>
          </template>
          <el-form label-width="120px">
            <el-form-item :label="isChinese ? '认证名称' : 'Name'">
              <el-input v-model="cert.name" />
            </el-form-item>
            <el-form-item :label="isChinese ? '描述' : 'Description'">
              <el-input v-model="cert.description[lang]" />
            </el-form-item>
            <el-form-item :label="isChinese ? '年份' : 'Year'">
              <el-input v-model="cert.year[lang]" />
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      
      <el-button type="primary" @click="saveContent" style="margin-top: 10px;">
        <el-icon><Check /></el-icon> {{ isChinese ? '保存配置' : 'Save' }}
      </el-button>
    </el-card>
  </el-space>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
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
    title: { 'zh-CN': '', 'en-US': '' },
    subtitle: { 'zh-CN': '', 'en-US': '' }
  },
  companyIntro: {
    title: { 'zh-CN': '公司简介', 'en-US': 'Company Profile' },
    content: [
      { 'zh-CN': '', 'en-US': '' },
      { 'zh-CN': '', 'en-US': '' }
    ],
    image: ''
  },
  timeline: {
    title: { 'zh-CN': '发展历程', 'en-US': 'Development History' },
    items: []
  },
  certifications: {
    title: { 'zh-CN': '资质认证', 'en-US': 'Certifications' },
    items: []
  }
})

// 初始化
const initializeContent = () => {
  const aboutContent = pageContentStore.pages.about || {}
  localContent.value = {
    banner: aboutContent.banner || { title: { 'zh-CN': '', 'en-US': '' }, subtitle: { 'zh-CN': '', 'en-US': '' } },
    companyIntro: aboutContent.companyIntro || localContent.value.companyIntro,
    timeline: aboutContent.timeline || localContent.value.timeline,
    certifications: aboutContent.certifications || localContent.value.certifications,
    teamAdvantages: aboutContent.teamAdvantages || { title: { 'zh-CN': '团队优势', 'en-US': 'Team Advantages' }, items: [] },
    serviceNetwork: aboutContent.serviceNetwork || { title: { 'zh-CN': '服务网络', 'en-US': 'Service Network' }, headquarters: {}, offices: [] },
    contactCTA: aboutContent.contactCTA || { title: { 'zh-CN': '期待与您合作', 'en-US': 'Looking Forward to Working With You' }, subtitle: { 'zh-CN': '', 'en-US': '' }, buttonText: { 'zh-CN': '联系我们', 'en-US': 'Contact Us' } }
  }
}

initializeContent()

// 添加里程碑
const addTimelineItem = () => {
  localContent.value.timeline.items.push({
    year: '',
    title: { 'zh-CN': '', 'en-US': '' },
    description: { 'zh-CN': '', 'en-US': '' }
  })
}

// 删除里程碑
const removeTimelineItem = (index) => {
  localContent.value.timeline.items.splice(index, 1)
}

// 添加认证
const addCertification = () => {
  localContent.value.certifications.items.push({
    name: '',
    description: { 'zh-CN': '', 'en-US': '' },
    year: { 'zh-CN': '', 'en-US': '' }
  })
}

// 删除认证
const removeCertification = (index) => {
  localContent.value.certifications.items.splice(index, 1)
}

// 保存内容
const saveContent = () => {
  pageContentStore.updatePageContent('about', localContent.value)
  ElMessage.success(isChinese.value ? '保存成功' : 'Saved successfully')
}
</script>

<style scoped>
.timeline-item-editor {
  margin-top: 15px;
}
</style>
