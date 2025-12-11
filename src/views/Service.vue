<template>
  <div class="service-page">
    <Header />
    
    <!-- 页面头部 -->
    <section class="page-header">
      <div class="container">
        <h1>{{ banner.title }}</h1>
        <p>{{ banner.subtitle }}</p>
      </div>
    </section>

    <!-- 服务内容 -->
    <section class="service-content">
      <div class="container">
        <!-- 服务项目 -->
        <div class="service-items">
          <div v-for="service in serviceItems" :key="service.icon" class="service-card">
            <div class="service-icon">
              <el-icon :size="60" color="#1890ff">
                <component :is="service.icon" />
              </el-icon>
            </div>
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
          </div>
        </div>

        <!-- 技术支持 -->
        <div class="support-section">
          <h2>{{ technicalSupport.title }}</h2>
          <div class="support-content">
            <div class="support-info">
              <h3>{{ technicalSupport.providedTitle }}</h3>
              <ul>
                <li v-for="(item, index) in technicalSupport.providedItems" :key="index">
                  <el-icon><Checked /></el-icon> {{ item }}
                </li>
              </ul>
            </div>
            <div class="support-contact">
              <h3>{{ technicalSupport.contactTitle }}</h3>
              <div class="contact-methods">
                <div class="method-item">
                  <el-icon :size="32"><Phone /></el-icon>
                  <div>
                    <p class="label">{{ technicalSupport.hotline.label }}</p>
                    <p class="value">{{ technicalSupport.hotline.value }}</p>
                  </div>
                </div>
                <div class="method-item">
                  <el-icon :size="32"><Message /></el-icon>
                  <div>
                    <p class="label">{{ technicalSupport.email.label }}</p>
                    <p class="value">{{ technicalSupport.email.value }}</p>
                  </div>
                </div>
              </div>
              <el-button type="primary" size="large" style="width: 100%; margin-top: 20px">
                {{ technicalSupport.buttonText }}
              </el-button>
            </div>
          </div>
        </div>

        <!-- 服务承诺 -->
        <div class="promise-section">
          <h2>{{ servicePromises.title }}</h2>
          <div class="promise-grid">
            <div v-for="promise in servicePromises.items" :key="promise.title" class="promise-item">
              <h4>{{ promise.title }}</h4>
              <p>{{ promise.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { usePageContentStore } from '../store/pageContent'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

const { locale } = useI18n()
const pageContentStore = usePageContentStore()

// 从store获取服务页面内容
const serviceContent = computed(() => pageContentStore.pages.service || {})

// 页面头部
const banner = computed(() => ({
  title: serviceContent.value.banner?.title?.[locale.value] || serviceContent.value.banner?.title?.['zh-CN'] || '服务与支持',
  subtitle: serviceContent.value.banner?.subtitle?.[locale.value] || serviceContent.value.banner?.subtitle?.['zh-CN'] || ''
}))

// 服务项目
const serviceItems = computed(() => {
  const items = serviceContent.value.serviceItems
  if (!items || items.length === 0) return []
  
  return items.map(item => ({
    icon: item.icon,
    title: item.title[locale.value] || item.title['zh-CN'],
    description: item.description[locale.value] || item.description['zh-CN']
  }))
})

// 技术支持
const technicalSupport = computed(() => {
  const support = serviceContent.value.technicalSupport
  if (!support) {
    return {
      title: '技术支持',
      providedTitle: '我们提供',
      providedItems: [],
      contactTitle: '联系技术支持',
      hotline: { label: '技术热线', value: '400-123-4567' },
      email: { label: '技术邮箱', value: 'support@mingsheng.com' },
      buttonText: '在线咨询'
    }
  }
  
  return {
    title: support.title[locale.value] || support.title['zh-CN'],
    providedTitle: support.providedTitle[locale.value] || support.providedTitle['zh-CN'],
    providedItems: support.providedItems.map(item => item[locale.value] || item['zh-CN']),
    contactTitle: support.contactTitle[locale.value] || support.contactTitle['zh-CN'],
    hotline: {
      label: support.hotline.label[locale.value] || support.hotline.label['zh-CN'],
      value: support.hotline.value
    },
    email: {
      label: support.email.label[locale.value] || support.email.label['zh-CN'],
      value: support.email.value
    },
    buttonText: support.buttonText[locale.value] || support.buttonText['zh-CN']
  }
})

// 服务承诺
const servicePromises = computed(() => {
  const promises = serviceContent.value.servicePromises
  if (!promises) return { title: '服务承诺', items: [] }
  
  return {
    title: promises.title[locale.value] || promises.title['zh-CN'],
    items: promises.items.map(item => ({
      title: item.title[locale.value] || item.title['zh-CN'],
      description: item.description[locale.value] || item.description['zh-CN']
    }))
  }
})
</script>

<style scoped>
.service-page {
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

.service-content {
  padding: 80px 0;
}

.service-items {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 80px;
}

.service-card {
  background: #fff;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  transition: all 0.3s;
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.service-icon {
  margin-bottom: 24px;
}

.service-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.service-card p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.support-section,
.promise-section {
  margin-bottom: 60px;
}

.support-section h2,
.promise-section h2 {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 40px;
  text-align: center;
}

.support-content {
  background: #fff;
  border-radius: 12px;
  padding: 50px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.support-info h3,
.support-contact h3 {
  font-size: 22px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 24px;
}

.support-info ul {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.support-info ul li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  color: #333;
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.method-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.method-item .label {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
}

.method-item .value {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
}

.promise-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.promise-item {
  background: #fff;
  padding: 32px 24px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.promise-item h4 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.promise-item p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}
</style>
