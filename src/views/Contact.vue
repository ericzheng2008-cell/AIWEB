<template>
  <div class="contact-page">
    <Header />
    
    <!-- 页面头部 -->
    <section class="page-header">
      <div class="container">
        <h1>{{ pageHeader.title }}</h1>
        <p>{{ pageHeader.subtitle }}</p>
      </div>
    </section>

    <!-- 联系方式 -->
    <section class="contact-content">
      <div class="container">
        <div class="contact-grid">
          <!-- 联系信息 -->
          <div class="contact-info-section">
            <h2>联系方式</h2>
            <div class="contact-items">
              <div class="contact-item">
                <div class="contact-icon">
                  <el-icon :size="32" color="#1890ff"><Phone /></el-icon>
                </div>
                <div class="contact-detail">
                  <h3>{{ contactInfo.phone.title }}</h3>
                  <p>{{ contactInfo.phone.value }}</p>
                  <p class="sub-info">{{ contactInfo.phone.subInfo }}</p>
                </div>
              </div>

              <div class="contact-item">
                <div class="contact-icon">
                  <el-icon :size="32" color="#1890ff"><Message /></el-icon>
                </div>
                <div class="contact-detail">
                  <h3>{{ contactInfo.email.title }}</h3>
                  <p>{{ contactInfo.email.value }}</p>
                  <p class="sub-info">{{ contactInfo.email.subInfo }}</p>
                </div>
              </div>

              <div class="contact-item">
                <div class="contact-icon">
                  <el-icon :size="32" color="#1890ff"><Location /></el-icon>
                </div>
                <div class="contact-detail">
                  <h3>{{ contactInfo.address.title }}</h3>
                  <p>{{ contactInfo.address.value }}</p>
                  <p class="sub-info">{{ contactInfo.address.subInfo }}</p>
                </div>
              </div>
            </div>

            <h2 style="margin-top: 50px;">{{ officesTitle }}</h2>
            <div class="offices-list">
              <div v-for="office in offices" :key="office.id" class="office-card">
                <h4>{{ office.city }}</h4>
                <p>{{ office.region }}</p>
              </div>
            </div>
          </div>

          <!-- 留言表单 -->
          <div class="contact-form-section">
            <h2>在线留言</h2>
            <el-form :model="form" label-position="top" size="large">
              <el-form-item label="姓名">
                <el-input v-model="form.name" placeholder="请输入您的姓名" />
              </el-form-item>
              
              <el-form-item label="公司">
                <el-input v-model="form.company" placeholder="请输入公司名称" />
              </el-form-item>

              <el-form-item label="电话">
                <el-input v-model="form.phone" placeholder="请输入联系电话" />
              </el-form-item>

              <el-form-item label="邮箱">
                <el-input v-model="form.email" placeholder="请输入电子邮箱" />
              </el-form-item>

              <el-form-item label="需求类型">
                <el-select v-model="form.type" placeholder="请选择需求类型" style="width: 100%">
                  <el-option label="产品咨询" value="product" />
                  <el-option label="解决方案" value="solution" />
                  <el-option label="技术支持" value="support" />
                  <el-option label="商务合作" value="business" />
                </el-select>
              </el-form-item>

              <el-form-item label="留言内容">
                <el-input 
                  v-model="form.message" 
                  type="textarea" 
                  :rows="4"
                  placeholder="请描述您的需求..." 
                />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" size="large" style="width: 100%" @click="submitForm">
                  提交留言
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { usePageContentStore } from '../store/pageContent'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

const { locale } = useI18n()
const pageContentStore = usePageContentStore()

const form = ref({
  name: '',
  company: '',
  phone: '',
  email: '',
  type: '',
  message: ''
})

// 从store获取联系页面内容
const contactContent = computed(() => pageContentStore.pages.contact || {})

// 页面头部
const pageHeader = computed(() => ({
  title: contactContent.value.banner?.title?.[locale.value] || contactContent.value.banner?.title?.['zh-CN'] || '联系我们',
  subtitle: contactContent.value.banner?.subtitle?.[locale.value] || contactContent.value.banner?.subtitle?.['zh-CN'] || '我们期待与您合作'
}))

// 联系方式信息
const contactInfo = computed(() => {
  const info = contactContent.value.contactInfo
  if (!info) {
    return {
      phone: { title: '服务热线', value: '400-123-4567', subInfo: '周一至周五 9:00-18:00' },
      email: { title: '电子邮箱', value: 'sales@mingsheng.com', subInfo: '我们会在24小时内回复' },
      address: { title: '公司地址', value: '广东省广州市珠江三角洲', subInfo: '广州市明升伟业机电有限公司' }
    }
  }
  
  return {
    phone: {
      title: info.phone.title[locale.value] || info.phone.title['zh-CN'],
      value: info.phone.value,
      subInfo: info.phone.subInfo[locale.value] || info.phone.subInfo['zh-CN']
    },
    email: {
      title: info.email.title[locale.value] || info.email.title['zh-CN'],
      value: info.email.value,
      subInfo: info.email.subInfo[locale.value] || info.email.subInfo['zh-CN']
    },
    address: {
      title: info.address.title[locale.value] || info.address.title['zh-CN'],
      value: info.address.value[locale.value] || info.address.value['zh-CN'],
      subInfo: info.address.subInfo[locale.value] || info.address.subInfo['zh-CN']
    }
  }
})

// 办事处标题
const officesTitle = computed(() => {
  const title = contactContent.value.officesTitle
  return title?.[locale.value] || title?.['zh-CN'] || '办事处网络'
})

// 办事处列表
const offices = computed(() => {
  const officesList = contactContent.value.offices
  if (!officesList || officesList.length === 0) {
    return [
      { id: 1, city: '长沙', region: '湖南省' },
      { id: 2, city: '株洲', region: '湖南省' },
      { id: 3, city: '常德', region: '湖南省' },
      { id: 4, city: '柳州', region: '广西省' },
      { id: 5, city: '武汉', region: '湖北省' },
      { id: 6, city: '宜昌', region: '湖北省' },
      { id: 7, city: '杭州', region: '华中地区' },
      { id: 8, city: '上海', region: '华东地区' }
    ]
  }
  
  return officesList.map((office, index) => ({
    id: index + 1,
    city: office.city[locale.value] || office.city['zh-CN'],
    region: office.region[locale.value] || office.region['zh-CN']
  }))
})

const submitForm = () => {
  if (!form.value.name || !form.value.phone || !form.value.message) {
    ElMessage.warning('请填写必填项')
    return
  }
  
  ElMessage.success('提交成功！我们会尽快与您联系')
  // 重置表单
  form.value = {
    name: '',
    company: '',
    phone: '',
    email: '',
    type: '',
    message: ''
  }
}
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.page-header {
  background: linear-gradient(135deg, #003366 0%, #001a33 100%);
  color: #fff;
  padding: 80px 0;
  text-align: center;
}

.page-header h1 {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 16px;
}

.page-header p {
  font-size: 18px;
  opacity: 0.9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.contact-content {
  padding: 80px 0;
}

.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
}

.contact-info-section h2,
.contact-form-section h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 32px;
}

.contact-items {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.contact-item {
  display: flex;
  gap: 20px;
}

.contact-icon {
  flex-shrink: 0;
}

.contact-detail h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.contact-detail p {
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
}

.contact-detail .sub-info {
  font-size: 14px;
  color: #666;
}

.offices-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.office-card {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #e8e8e8;
}

.office-card h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 6px;
}

.office-card p {
  font-size: 13px;
  color: #666;
}

.contact-form-section {
  background: #fff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}
</style>
