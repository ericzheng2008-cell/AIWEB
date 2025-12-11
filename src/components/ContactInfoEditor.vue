<template>
  <div class="contact-info-editor">
    <el-card>
      <h3>联系方式配置</h3>
      
      <!-- 服务热线 -->
      <el-divider content-position="left">服务热线</el-divider>
      <el-form label-width="120px">
        <el-form-item label="中文标题">
          <el-input v-model="contactInfo.phone.title['zh-CN']" />
        </el-form-item>
        <el-form-item label="英文标题">
          <el-input v-model="contactInfo.phone.title['en-US']" />
        </el-form-item>
        <el-form-item label="电话号码">
          <el-input v-model="contactInfo.phone.value" />
        </el-form-item>
        <el-form-item label="中文提示">
          <el-input v-model="contactInfo.phone.subInfo['zh-CN']" placeholder="周一至周五 9:00-18:00" />
        </el-form-item>
        <el-form-item label="英文提示">
          <el-input v-model="contactInfo.phone.subInfo['en-US']" placeholder="Mon-Fri 9:00-18:00" />
        </el-form-item>
      </el-form>

      <!-- 电子邮箱 -->
      <el-divider content-position="left">电子邮箱</el-divider>
      <el-form label-width="120px">
        <el-form-item label="中文标题">
          <el-input v-model="contactInfo.email.title['zh-CN']" />
        </el-form-item>
        <el-form-item label="英文标题">
          <el-input v-model="contactInfo.email.title['en-US']" />
        </el-form-item>
        <el-form-item label="邮箱地址">
          <el-input v-model="contactInfo.email.value" />
        </el-form-item>
        <el-form-item label="中文提示">
          <el-input v-model="contactInfo.email.subInfo['zh-CN']" placeholder="我们会在24小时内回复" />
        </el-form-item>
        <el-form-item label="英文提示">
          <el-input v-model="contactInfo.email.subInfo['en-US']" placeholder="We will reply within 24 hours" />
        </el-form-item>
      </el-form>

      <!-- 公司地址 -->
      <el-divider content-position="left">公司地址</el-divider>
      <el-form label-width="120px">
        <el-form-item label="中文标题">
          <el-input v-model="contactInfo.address.title['zh-CN']" />
        </el-form-item>
        <el-form-item label="英文标题">
          <el-input v-model="contactInfo.address.title['en-US']" />
        </el-form-item>
        <el-form-item label="中文地址">
          <el-input v-model="contactInfo.address.value['zh-CN']" />
        </el-form-item>
        <el-form-item label="英文地址">
          <el-input v-model="contactInfo.address.value['en-US']" />
        </el-form-item>
        <el-form-item label="中文公司名">
          <el-input v-model="contactInfo.address.subInfo['zh-CN']" />
        </el-form-item>
        <el-form-item label="英文公司名">
          <el-input v-model="contactInfo.address.subInfo['en-US']" />
        </el-form-item>
      </el-form>

      <el-button type="primary" @click="saveContactInfo">
        <el-icon><Check /></el-icon> 保存联系方式
      </el-button>
    </el-card>

    <!-- 办事处网络 -->
    <el-card style="margin-top: 20px;">
      <h3>办事处网络</h3>
      
      <el-form label-width="120px" style="margin-bottom: 20px;">
        <el-form-item label="中文标题">
          <el-input v-model="officesTitle['zh-CN']" />
        </el-form-item>
        <el-form-item label="英文标题">
          <el-input v-model="officesTitle['en-US']" />
        </el-form-item>
      </el-form>

      <el-button type="primary" size="small" @click="addOffice" style="margin-bottom: 15px;">
        <el-icon><Plus /></el-icon> 添加办事处
      </el-button>

      <el-table :data="offices" style="width: 100%">
        <el-table-column label="中文城市" width="150">
          <template #default="scope">
            <el-input v-model="scope.row.city['zh-CN']" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="英文城市" width="150">
          <template #default="scope">
            <el-input v-model="scope.row.city['en-US']" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="中文地区" width="200">
          <template #default="scope">
            <el-input v-model="scope.row.region['zh-CN']" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="英文地区" width="200">
          <template #default="scope">
            <el-input v-model="scope.row.region['en-US']" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button type="danger" size="small" @click="removeOffice(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-button type="primary" @click="saveOffices" style="margin-top: 20px;">
        <el-icon><Check /></el-icon> 保存办事处列表
      </el-button>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { usePageContentStore } from '../store/pageContent'
import { ElMessage } from 'element-plus'

const props = defineProps({
  lang: {
    type: String,
    default: 'zh-CN'
  }
})

const pageContentStore = usePageContentStore()

// 联系方式信息
const contactInfo = reactive({
  phone: {
    title: { 'zh-CN': '服务热线', 'en-US': 'Service Hotline' },
    value: '400-123-4567',
    subInfo: { 'zh-CN': '周一至周五 9:00-18:00', 'en-US': 'Mon-Fri 9:00-18:00' }
  },
  email: {
    title: { 'zh-CN': '电子邮箱', 'en-US': 'Email' },
    value: 'sales@mingsheng.com',
    subInfo: { 'zh-CN': '我们会在24小时内回复', 'en-US': 'We will reply within 24 hours' }
  },
  address: {
    title: { 'zh-CN': '公司地址', 'en-US': 'Address' },
    value: { 'zh-CN': '广东省广州市珠江三角洲', 'en-US': 'Pearl River Delta, Guangzhou, Guangdong' },
    subInfo: { 'zh-CN': '广州市明升伟业机电有限公司', 'en-US': 'Guangzhou Mingsheng Industry Co., Ltd.' }
  }
})

// 办事处标题
const officesTitle = reactive({
  'zh-CN': '办事处网络',
  'en-US': 'Office Network'
})

// 办事处列表
const offices = ref([])

// 加载数据
const loadData = () => {
  const contactContent = pageContentStore.pages.contact
  if (contactContent) {
    if (contactContent.contactInfo) {
      Object.assign(contactInfo, JSON.parse(JSON.stringify(contactContent.contactInfo)))
    }
    if (contactContent.officesTitle) {
      Object.assign(officesTitle, contactContent.officesTitle)
    }
    if (contactContent.offices) {
      offices.value = JSON.parse(JSON.stringify(contactContent.offices))
    }
  }
}

onMounted(() => {
  loadData()
})

// 保存联系方式
const saveContactInfo = () => {
  const contactContent = { ...pageContentStore.pages.contact }
  contactContent.contactInfo = JSON.parse(JSON.stringify(contactInfo))
  pageContentStore.updatePageContent('contact', contactContent)
  ElMessage.success('保存成功')
}

// 添加办事处
const addOffice = () => {
  offices.value.push({
    city: { 'zh-CN': '', 'en-US': '' },
    region: { 'zh-CN': '', 'en-US': '' }
  })
}

// 删除办事处
const removeOffice = (index) => {
  offices.value.splice(index, 1)
}

// 保存办事处列表
const saveOffices = () => {
  const contactContent = { ...pageContentStore.pages.contact }
  contactContent.officesTitle = { ...officesTitle }
  contactContent.offices = JSON.parse(JSON.stringify(offices.value))
  pageContentStore.updatePageContent('contact', contactContent)
  ElMessage.success('保存成功')
}
</script>

<style scoped>
.contact-info-editor {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
