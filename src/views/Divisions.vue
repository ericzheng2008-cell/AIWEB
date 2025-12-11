<template>
  <div class="divisions-page">
    <Header />
    
    <!-- 页面标题 -->
    <section class="page-hero">
      <div class="container">
        <h1>{{ t('common.divisions') }}</h1>
        <p>{{ t('divisions.desc') }}</p>
      </div>
    </section>

    <!-- 事业部展示 -->
    <section class="section">
      <div class="container">
        <div class="divisions-grid">
          <div v-for="division in divisions" :key="division.id" 
               class="division-card"
               @click="goToDivision(division)">
            <div class="division-icon">
              <el-icon :size="48"><component :is="division.icon" /></el-icon>
            </div>
            <h3>{{ division.name }}</h3>
            <p>{{ division.description }}</p>
            <div class="division-link">
              {{ t('common.viewDetails') }} <el-icon><ArrowRight /></el-icon>
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
import { useCmsAdvancedStore } from '../store/cmsAdvanced'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

const router = useRouter()
const { t, locale } = useI18n()
const cmsStore = useCmsAdvancedStore()

// 从CMS获取事业部
const divisions = computed(() => {
  return cmsStore.divisions.map(division => ({
    ...division,
    name: division.name[locale.value] || division.name['zh-CN'],
    description: division.description[locale.value] || division.description['zh-CN']
  }))
})

const goToDivision = (division) => {
  router.push({ path: '/products', query: { category: division.id } })
}
</script>

<style scoped>
.divisions-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.page-hero {
  background: linear-gradient(135deg, #003366 0%, #0066cc 100%);
  color: #fff;
  padding: 80px 0;
  text-align: center;
}

.page-hero h1 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
}

.page-hero p {
  font-size: 20px;
  opacity: 0.9;
}

.section {
  padding: 80px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.divisions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.division-card {
  background: #fff;
  padding: 40px 28px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e8e8e8;
  text-align: center;
}

.division-card:hover {
  border-color: #1890ff;
  box-shadow: 0 8px 16px rgba(24, 144, 255, 0.15);
  transform: translateY(-4px);
}

.division-icon {
  margin-bottom: 20px;
  color: #1890ff;
}

.division-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1a1a1a;
}

.division-card p {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 16px;
}

.division-link {
  color: #1890ff;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

@media (max-width: 1024px) {
  .divisions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .divisions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
