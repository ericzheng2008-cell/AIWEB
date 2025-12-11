<template>
  <div class="home">
    <Header />
    
    <!-- 主Banner -->
    <section class="hero-banner">
      <el-carousel 
        :height="bannerHeight + 'px'" 
        :interval="bannerAutoplay ? 5000 : 0" 
        :autoplay="bannerAutoplay"
        arrow="always"
        indicator-position="outside">
        <el-carousel-item v-for="(banner, index) in banners" :key="index">
          <div class="banner-item" :style="{ backgroundImage: `url(${banner.image})`, width: bannerWidth + '%' }">
            <div class="banner-overlay"></div>
            <div class="banner-content">
              <h1>{{ banner.title }}</h1>
              <p class="subtitle">{{ banner.subtitle }}</p>
              <div class="banner-buttons">
                <el-button type="primary" size="large" @click="handleBannerClick(banner)">
                  {{ banner.buttonText }}
                </el-button>
                <el-button size="large" plain @click="goToContact">联系我们</el-button>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </section>

    <!-- 产品系列 -->
    <section class="section product-series">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">我们的产品和服务 / Products & Services</h2>
          <p class="section-desc">专业的工业自动化设备与智能制造解决方案</p>
        </div>
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
                查看详情 <el-icon><ArrowRight /></el-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 应用解决方案 -->
    <section class="section solutions-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">应用案例 / Application Cases</h2>
          <p class="section-desc">为不同行业提供智能制造与工业自动化应用方案</p>
        </div>
        <div class="solutions-grid">
          <div v-for="solution in solutions" :key="solution.id" 
               class="solution-card"
               @click="goToSolution(solution)">
            <div class="solution-icon">
              <el-icon :size="48"><component :is="solution.icon" /></el-icon>
            </div>
            <h3>{{ solution.name }}</h3>
            <p>{{ solution.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 关于明升伟业 -->
    <section class="section about-section">
      <div class="container">
        <div class="about-content">
          <div class="about-text">
            <h2>{{ aboutCompanyData.title[locale] || aboutCompanyData.title['zh-CN'] }}</h2>
            <p class="about-intro">
              {{ aboutCompanyData.intro[locale] || aboutCompanyData.intro['zh-CN'] }}
            </p>
            <div class="certifications">
              <div v-for="(cert, index) in aboutCompanyData.certifications" :key="index" class="cert-item">
                <el-icon :size="32" color="#1890ff"><Checked /></el-icon>
                <span>{{ cert.name[locale] || cert.name['zh-CN'] }}</span>
              </div>
            </div>
            <el-button type="primary" size="large" @click="goToAbout">
              {{ aboutCompanyData.buttonText[locale] || aboutCompanyData.buttonText['zh-CN'] }}
            </el-button>
          </div>
          <div class="about-image">
            <img :src="aboutCompanyData.image" alt="公司厂房" />
          </div>
        </div>
      </div>
    </section>

    <!-- 企业优势 -->
    <section class="section advantages-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            {{ homeContent.advantages?.title?.[locale] || homeContent.advantages?.title?.['zh-CN'] || '我们的优势' }}
          </h2>
          <p class="section-desc">
            {{ homeContent.advantages?.subtitle?.[locale] || homeContent.advantages?.subtitle?.['zh-CN'] || '值得信赖的工业合作伙伴' }}
          </p>
        </div>
        <div class="advantage-grid">
          <div v-for="(adv, index) in advantages" :key="index" class="advantage-item">
            <div class="advantage-icon">
              <el-icon :size="48" color="#1890ff">
                <component :is="adv.icon" />
              </el-icon>
            </div>
            <h3>{{ adv.title[locale] || adv.title['zh-CN'] }}</h3>
            <p>{{ adv.description[locale] || adv.description['zh-CN'] }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 服务网络 -->
    <section class="section service-network">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            {{ homeContent.serviceNetwork?.title?.[locale] || homeContent.serviceNetwork?.title?.['zh-CN'] || '服务网络' }}
          </h2>
          <p class="section-desc">
            {{ homeContent.serviceNetwork?.subtitle?.[locale] || homeContent.serviceNetwork?.subtitle?.['zh-CN'] || '全国多地设有办事处，提供优质的客户服务' }}
          </p>
        </div>
        <div class="offices-grid">
          <div v-for="(office, index) in offices" :key="index" class="office-item">
            <el-icon :size="32" color="#1890ff"><Location /></el-icon>
            <h4>{{ office.city }}</h4>
            <p>{{ office.region }}</p>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCmsAdvancedStore } from '../store/cmsAdvanced'
import { usePageContentStore } from '../store/pageContent'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

const router = useRouter()
const { t, locale } = useI18n()
const cmsStore = useCmsAdvancedStore()
const pageContentStore = usePageContentStore()

// 从store获取首页板块数据
const homeContent = computed(() => pageContentStore.pages.home || {})

// Banner设置 - 从CMS读取
const bannerWidth = computed(() => homeContent.value.bannerSettings?.width || 100)
const bannerHeight = computed(() => homeContent.value.bannerSettings?.height || 650)
const bannerAutoplay = computed(() => homeContent.value.bannerSettings?.autoplay !== false)

const banners = ref([
  {
    id: 1,
    title: '广州市明升伟业机电有限公司',
    subtitle: '成立于1996年，总部位于珠江三角洲美丽的花城——广州',
    description: '是一家集科研开发、生产制造、销售服务为一体的现代化科技企业，专业从事欧美高端工业工具供应与应用解决方案',
    certifications: ['ISO9000认证', 'QS9000认证', 'IATF16949认证'],
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920',
    buttonText: '了解更多',
    type: 'company'
  },
  {
    id: 2,
    title: '专业工业工具 · 智能装配方案',
    subtitle: '28年专注于高端工业工具供应与应用解决方案',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1920',
    buttonText: '探索产品'
  },
  {
    id: 3,
    title: '欧美高端工具 · 品质保证',
    subtitle: '电动工具 · 气动工具 · 手动工具',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1920',
    buttonText: '查看系列'
  },
  {
    id: 4,
    title: 'IATF16949认证 · 汽车制造体系',
    subtitle: '为汽车行业提供高强度标准件与传感器',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1920',
    buttonText: '了解方案'
  }
])

// 从store获取产品大类（1级分类）
const productSeries = computed(() => {
  return cmsStore.productCategories.map(category => ({
    id: category.id,
    name: category.name[locale.value] || category.name['zh-CN'],
    description: category.description[locale.value] || category.description['zh-CN'],
    image: category.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600'
  }))
})

const solutions = ref([
  { id: 1, name: '汽车制造', description: '为汽车制造企业提供全套工具装配解决方案', icon: 'Van' },
  { id: 2, name: '智能制造', description: '配套智能制造领域的工具应用与系统集成', icon: 'Monitor' },
  { id: 3, name: '航空航天', description: '高精度工具应用于航空航天精密装配', icon: 'Promotion' },
  { id: 4, name: '能源设备', description: '能源设备制造与维护工具解决方案', icon: 'HotWater' }
])

// 关于明升伟业板块
const aboutCompanyData = computed(() => {
  return homeContent.value.aboutCompany || {
    title: { 'zh-CN': '关于明升伟业', 'en-US': 'About Mingsheng' },
    intro: { 'zh-CN': '', 'en-US': '' },
    certifications: [],
    buttonText: { 'zh-CN': '了解更多', 'en-US': 'Learn More' },
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800'
  }
})

// 我们的优势
const advantages = computed(() => {
  const data = homeContent.value.advantages
  if (data && data.items && data.items.length > 0) {
    return data.items
  }
  // 默认数据
  return [
    { 
      icon: 'Medal', 
      title: { 'zh-CN': '28年行业经验', 'en-US': '28 Years Experience' }, 
      description: { 'zh-CN': '自1996年成立，深耕工业工具领域近三十年，积累丰富实际案例', 'en-US': 'Since 1996, deep cultivation in industrial tools' } 
    },
    { 
      icon: 'Checked', 
      title: { 'zh-CN': '权威体系认证', 'en-US': 'Authoritative Certification' }, 
      description: { 'zh-CN': 'ISO9000、QS9000、IATF16949汽车制造体系认证', 'en-US': 'ISO9000, QS9000, IATF16949 certification' } 
    },
    { 
      icon: 'Box', 
      title: { 'zh-CN': '欧美高端品牌', 'en-US': 'European Brands' }, 
      description: { 'zh-CN': '专业代理欧美一线工业工具品牌，品质有保障', 'en-US': 'Professional agency for European brands' } 
    },
    { 
      icon: 'Service', 
      title: { 'zh-CN': '全国服务网络', 'en-US': 'National Service' }, 
      description: { 'zh-CN': '在华中、华南、西南多地设有办事处，提供及时服务', 'en-US': 'Offices nationwide for timely service' } 
    }
  ]
})

// 服务网络
const offices = computed(() => {
  const data = homeContent.value.serviceNetwork
  if (data && data.offices && data.offices.length > 0) {
    return data.offices.map(office => ({
      city: office.city[locale.value] || office.city['zh-CN'],
      region: office.region[locale.value] || office.region['zh-CN']
    }))
  }
  // 默认数据
  return [
    { city: '广州', region: '总部 · 珠江三角洲' },
    { city: '长沙', region: '湖南省' },
    { city: '株洲', region: '湖南省' },
    { city: '常德', region: '湖南省' },
    { city: '柳州', region: '广西省' },
    { city: '武汉', region: '湖北省' },
    { city: '宜昌', region: '湖北省' },
    { city: '杭州', region: '华中地区' },
    { city: '上海', region: '华东地区' }
  ]
})

const goToProducts = (series) => {
  // 跳转到产品分类页面（层级展示）
  router.push(`/product-category/${series.id}`)
}

const goToSolution = (solution) => {
  router.push({ path: '/solutions', query: { id: solution.id } })
}

const goToAbout = () => {
  router.push('/about')
}

const goToContact = () => {
  router.push('/contact')
}

const handleBannerClick = (banner) => {
  if (banner.type === 'company') {
    router.push('/about')
  } else {
    router.push('/products')
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: #f5f7fa;
}

/* Banner样式 */
.hero-banner {
  width: 100%;
}

.banner-item {
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 0 auto;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 40, 80, 0.85) 0%, rgba(0, 20, 40, 0.7) 100%);
}

.banner-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: #fff;
  max-width: 1000px;
  padding: 0 20px;
}

.banner-content h1 {
  font-size: 56px;
  font-weight: 700;
  margin-bottom: 24px;
  line-height: 1.2;
  letter-spacing: 1px;
}

.banner-content .subtitle {
  font-size: 22px;
  margin-bottom: 20px;
  opacity: 0.95;
  font-weight: 300;
}

.banner-content .description {
  font-size: 18px;
  margin-bottom: 24px;
  opacity: 0.9;
  font-weight: 300;
  line-height: 1.6;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.banner-content.company-intro .subtitle {
  font-size: 20px;
  margin-bottom: 16px;
}

.banner-certifications {
  display: flex;
  gap: 24px;
  justify-content: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.cert-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.15);
  padding: 10px 20px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 15px;
  font-weight: 500;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.cert-badge:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.cert-badge .el-icon {
  color: #52c41a;
  font-size: 18px;
}

.banner-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}

/* 通用板块样式 */
.section {
  padding: 80px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-title {
  font-size: 42px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.section-desc {
  font-size: 18px;
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

/* 产品系列 */
.product-series {
  background: #fff;
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

/* 解决方案 */
.solutions-section {
  background: #fafbfc;
}

.solutions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.solution-card {
  background: #fff;
  padding: 40px 28px;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e8e8e8;
}

.solution-card:hover {
  border-color: #1890ff;
  box-shadow: 0 8px 16px rgba(24, 144, 255, 0.15);
  transform: translateY(-4px);
}

.solution-icon {
  margin-bottom: 20px;
  color: #1890ff;
}

.solution-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1a1a1a;
}

.solution-card p {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

/* 关于明升伟业 */
.about-section {
  background: #fff;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.about-text h2 {
  font-size: 36px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 24px;
}

.about-intro {
  font-size: 16px;
  line-height: 1.8;
  color: #444;
  margin-bottom: 32px;
}

.certifications {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
}

.cert-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.about-image {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.about-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

/* 企业优势 */
.advantages-section {
  background: #fafbfc;
}

.advantage-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}

.advantage-item {
  background: #fff;
  text-align: center;
  padding: 40px 24px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
}

.advantage-item:hover {
  border-color: #1890ff;
  box-shadow: 0 8px 16px rgba(24, 144, 255, 0.1);
}

.advantage-icon {
  margin-bottom: 20px;
}

.advantage-item h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1a1a1a;
}

.advantage-item p {
  color: #666;
  line-height: 1.6;
  font-size: 14px;
}

/* 服务网络 */
.service-network {
  background: #fff;
}

.offices-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.office-item {
  text-align: center;
  padding: 24px;
  background: #fafbfc;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
}

.office-item:hover {
  background: #fff;
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
}

.office-item h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 12px 0 6px;
  color: #1a1a1a;
}

.office-item p {
  font-size: 13px;
  color: #666;
}
</style>
