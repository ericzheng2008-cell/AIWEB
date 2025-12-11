<template>
  <div class="products-services-page">
    <Header />
    
    <!-- 页面标题 -->
    <section class="page-hero">
      <div class="container">
        <h1>{{ t('productsServices.title') }}</h1>
        <p>{{ t('productsServices.desc') }}</p>
      </div>
    </section>

    <!-- 产品系列展示 -->
    <section class="section">
      <div class="container">
        <div class="series-grid">
          <div v-for="series in productSeries" :key="series.id" 
               class="series-card" 
               @click="goToProducts(series)">
            <div class="series-image">
              <img :src="series.image" :alt="series.name" />
            </div>
            <div class="series-info">
              <h3>{{ series.name }}</h3>
              <p>{{ series.description }}</p>
              <div class="series-link">
                {{ t('common.viewDetails') }} <el-icon><ArrowRight /></el-icon>
              </div>
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

// 从CMS获取产品大类
const productSeries = computed(() => {
  return cmsStore.productCategories.map(category => ({
    id: category.id,
    name: category.name[locale.value] || category.name['zh-CN'],
    description: category.description[locale.value] || category.description['zh-CN'],
    image: category.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600'
  }))
})

const goToProducts = (series) => {
  // 跳转到产品分类页面（层级展示）
  router.push(`/product-category/${series.id}`)
}
</script>

<style scoped>
.products-services-page {
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

.series-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.series-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 1px solid #e8e8e8;
}

.series-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}

.series-image {
  width: 100%;
  height: 240px;
  overflow: hidden;
}

.series-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.series-card:hover .series-image img {
  transform: scale(1.08);
}

.series-info {
  padding: 28px;
}

.series-info h3 {
  font-size: 22px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.series-info p {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 20px;
}

.series-link {
  color: #1890ff;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 768px) {
  .series-grid {
    grid-template-columns: 1fr;
  }
}
</style>
