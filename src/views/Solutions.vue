<template>
  <div class="solutions-page">
    <Header />
    
    <!-- 页面头部 -->
    <section class="page-header">
      <div class="container">
        <h1>{{ banner.title }}</h1>
        <p>{{ banner.subtitle }}</p>
      </div>
    </section>

    <!-- 解决方案列表 -->
    <section class="solutions-content">
      <div class="container">
        <div class="solutions-list">
          <div v-for="solution in solutions" :key="solution.id" class="solution-item">
            <div class="solution-image">
              <img :src="solution.image" :alt="solution.name" />
            </div>
            <div class="solution-content">
              <h2>{{ solution.name }}</h2>
              <p class="solution-intro">{{ solution.description }}</p>
              <div class="solution-features">
                <h3>{{ featuresTitle }}</h3>
                <ul>
                  <li v-for="(feature, index) in solution.features" :key="index">
                    <el-icon color="#1890ff"><Checked /></el-icon>
                    {{ feature }}
                  </li>
                </ul>
              </div>
              <div class="solution-applications">
                <h3>{{ applicationsTitle }}</h3>
                <div class="application-tags">
                  <span v-for="(app, index) in solution.applications" :key="index">
                    {{ app }}
                  </span>
                </div>
              </div>
              <el-button type="primary" size="large" @click="contactUs">{{ consultButtonText }}</el-button>
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
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePageContentStore } from '../store/pageContent'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

const router = useRouter()
const { locale } = useI18n()
const pageContentStore = usePageContentStore()

// 从store获取解决方案页面内容
const solutionsContent = computed(() => pageContentStore.pages.solutions || {})

// 页面头部
const banner = computed(() => ({
  title: solutionsContent.value.banner?.title?.[locale.value] || solutionsContent.value.banner?.title?.['zh-CN'] || '应用案例',
  subtitle: solutionsContent.value.banner?.subtitle?.[locale.value] || solutionsContent.value.banner?.subtitle?.['zh-CN'] || ''
}))

// 解决方案列表
const solutions = computed(() => {
  const list = solutionsContent.value.solutionsList
  if (!list || list.length === 0) return []
  
  return list.map(solution => ({
    id: solution.id,
    name: solution.name[locale.value] || solution.name['zh-CN'],
    description: solution.description[locale.value] || solution.description['zh-CN'],
    image: solution.image,
    features: solution.features.map(f => f[locale.value] || f['zh-CN']),
    applications: solution.applications.map(a => a[locale.value] || a['zh-CN'])
  }))
})

// 方案特点标题
const featuresTitle = computed(() => {
  const title = solutionsContent.value.featuresTitle
  return title?.[locale.value] || title?.['zh-CN'] || '方案特点'
})

// 应用场景标题
const applicationsTitle = computed(() => {
  const title = solutionsContent.value.applicationsTitle
  return title?.[locale.value] || title?.['zh-CN'] || '应用场景'
})

// 咨询按钮文字
const consultButtonText = computed(() => {
  const text = solutionsContent.value.consultButtonText
  return text?.[locale.value] || text?.['zh-CN'] || '咨询方案'
})

const contactUs = () => {
  router.push('/contact')
}
</script>

<style scoped>
.solutions-page {
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

.solutions-content {
  padding: 80px 0;
}

.solutions-list {
  display: flex;
  flex-direction: column;
  gap: 60px;
}

.solution-item {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 40px;
}

.solution-image {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.solution-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.solution-content {
  padding: 40px 40px 40px 0;
}

.solution-content h2 {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.solution-intro {
  font-size: 16px;
  color: #666;
  line-height: 1.8;
  margin-bottom: 32px;
}

.solution-features,
.solution-applications {
  margin-bottom: 32px;
}

.solution-features h3,
.solution-applications h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.solution-features ul {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.solution-features ul li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: #333;
}

.application-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.application-tags span {
  background: #f0f7ff;
  color: #1890ff;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  border: 1px solid #d6e4ff;
}
</style>
