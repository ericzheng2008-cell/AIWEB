<template>
  <div class="about-page">
    <Header />
    
    <div class="page-banner">
      <h1>{{ banner.title }}</h1>
      <p>{{ banner.subtitle }}</p>
    </div>

    <div class="container">
      <!-- 公司简介 -->
      <section class="section company-intro">
        <div class="intro-content">
          <div class="intro-text">
            <h2>{{ companyIntro.title }}</h2>
            <p v-for="(paragraph, index) in companyIntro.content" :key="index" v-html="paragraph"></p>
          </div>
          <div class="intro-image">
            <img :src="companyIntro.image" alt="Company" />
          </div>
        </div>
      </section>

      <!-- 发展历程 -->
      <section class="section timeline-section" id="history">
        <h2 class="section-title">{{ timeline.title }}</h2>
        <div class="timeline">
          <div v-for="item in timeline.items" :key="item.year" class="timeline-item">
            <div class="year">{{ item.year }}</div>
            <div class="content">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- 资质认证 -->
      <section class="section certifications-section">
        <h2 class="section-title">{{ certifications.title }}</h2>
        <div class="cert-grid">
          <div v-for="cert in certifications.items" :key="cert.name" class="cert-card">
            <el-icon :size="60" color="#1890ff"><Medal /></el-icon>
            <h3>{{ cert.name }}</h3>
            <p>{{ cert.description }}</p>
            <span class="cert-year">{{ cert.year }}</span>
          </div>
        </div>
      </section>

      <!-- 团队优势 -->
      <section class="section team-section" id="team">
        <h2 class="section-title">{{ teamAdvantages.title }}</h2>
        <div class="team-grid">
          <div v-for="(item, index) in teamAdvantages.items" :key="index" class="team-card">
            <el-icon :size="50" color="#1890ff">
              <UserFilled v-if="index === 0" />
              <Trophy v-else-if="index === 1" />
              <Connection v-else />
            </el-icon>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </section>

      <!-- 服务网络 -->
      <section class="section network-section">
        <h2 class="section-title">{{ serviceNetwork.title }}</h2>
        <div class="map-container">
          <div class="offices-list">
            <div class="office-group">
              <h3>{{ serviceNetwork.headquarters.title }}</h3>
              <div class="office-item highlight">
                <el-icon><Location /></el-icon>
                <span>{{ serviceNetwork.headquarters.location }}</span>
              </div>
            </div>
            <div v-for="(office, index) in serviceNetwork.offices" :key="index" class="office-group">
              <h3>{{ office.region }}</h3>
              <div v-for="(city, cityIndex) in office.cities" :key="cityIndex" class="office-item">
                <el-icon><Location /></el-icon>
                <span>{{ city }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 联系我们 -->
      <section class="section contact-cta">
        <div class="cta-content">
          <h2>{{ contactCTA.title }}</h2>
          <p>{{ contactCTA.subtitle }}</p>
          <el-button type="primary" size="large" @click="$router.push('/contact')">
            {{ contactCTA.buttonText }}
          </el-button>
        </div>
      </section>
    </div>

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

// 从store获取关于我们页面内容
const aboutContent = computed(() => pageContentStore.pages.about || {})

// 页面头部
const banner = computed(() => ({
  title: aboutContent.value.banner?.title?.[locale.value] || aboutContent.value.banner?.title?.['zh-CN'] || '关于明升伟业',
  subtitle: aboutContent.value.banner?.subtitle?.[locale.value] || aboutContent.value.banner?.subtitle?.['zh-CN'] || ''
}))

// 公司简介
const companyIntro = computed(() => {
  const intro = aboutContent.value.companyIntro
  if (!intro) return { title: '公司简介', content: [], image: '' }
  
  return {
    title: intro.title[locale.value] || intro.title['zh-CN'],
    content: intro.content.map(p => p[locale.value] || p['zh-CN']),
    image: intro.image
  }
})

// 发展历程
const timeline = computed(() => {
  const tl = aboutContent.value.timeline
  if (!tl) return { title: '发展历程', items: [] }
  
  return {
    title: tl.title[locale.value] || tl.title['zh-CN'],
    items: tl.items.map(item => ({
      year: typeof item.year === 'string' ? item.year : (item.year[locale.value] || item.year['zh-CN']),
      title: item.title[locale.value] || item.title['zh-CN'],
      description: item.description[locale.value] || item.description['zh-CN']
    }))
  }
})

// 资质认证
const certifications = computed(() => {
  const certs = aboutContent.value.certifications
  if (!certs) return { title: '资质认证', items: [] }
  
  return {
    title: certs.title[locale.value] || certs.title['zh-CN'],
    items: certs.items.map(cert => ({
      name: cert.name,
      description: cert.description[locale.value] || cert.description['zh-CN'],
      year: cert.year[locale.value] || cert.year['zh-CN']
    }))
  }
})

// 团队优势
const teamAdvantages = computed(() => {
  const team = aboutContent.value.teamAdvantages
  if (!team) return { title: '团队优势', items: [] }
  
  return {
    title: team.title[locale.value] || team.title['zh-CN'],
    items: team.items.map(item => ({
      title: item.title[locale.value] || item.title['zh-CN'],
      description: item.description[locale.value] || item.description['zh-CN']
    }))
  }
})

// 服务网络
const serviceNetwork = computed(() => {
  const network = aboutContent.value.serviceNetwork
  if (!network) return { title: '服务网络', headquarters: {}, offices: [] }
  
  return {
    title: network.title[locale.value] || network.title['zh-CN'],
    headquarters: {
      title: network.headquarters.title[locale.value] || network.headquarters.title['zh-CN'],
      location: network.headquarters.location[locale.value] || network.headquarters.location['zh-CN']
    },
    offices: network.offices.map(office => ({
      region: office.region[locale.value] || office.region['zh-CN'],
      cities: office.cities.map(city => city[locale.value] || city['zh-CN'])
    }))
  }
})

// 联系CTA
const contactCTA = computed(() => {
  const cta = aboutContent.value.contactCTA
  if (!cta) return { title: '期待与您合作', subtitle: '', buttonText: '联系我们' }
  
  return {
    title: cta.title[locale.value] || cta.title['zh-CN'],
    subtitle: cta.subtitle[locale.value] || cta.subtitle['zh-CN'],
    buttonText: cta.buttonText[locale.value] || cta.buttonText['zh-CN']
  }
})
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.page-banner {
  background: linear-gradient(135deg, #003366 0%, #001a33 100%);
  color: #fff;
  text-align: center;
  padding: 100px 20px;
}

.page-banner h1 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
}

.page-banner p {
  font-size: 20px;
  opacity: 0.9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section {
  padding: 80px 0;
}

.section-title {
  font-size: 36px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 50px;
  color: #1a1a1a;
}

/* 公司简介 */
.company-intro {
  background: #fff;
}

.intro-content {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 60px;
  align-items: center;
}

.intro-text h2 {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 30px;
}

.intro-text p {
  font-size: 16px;
  line-height: 2;
  color: #444;
  margin-bottom: 20px;
}

.intro-text strong {
  color: #1890ff;
  font-weight: 600;
}

.intro-image {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.intro-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

/* 发展历程 */
.timeline-section {
  background: #fafbfc;
}

.timeline {
  max-width: 900px;
  margin: 0 auto;
  position: relative;
  padding-left: 60px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 20px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #1890ff;
}

.timeline-item {
  position: relative;
  margin-bottom: 50px;
}

.timeline-item .year {
  position: absolute;
  left: -60px;
  top: 0;
  width: 80px;
  height: 40px;
  background: #1890ff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
}

.timeline-item .content {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.timeline-item .content h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 10px;
}

.timeline-item .content p {
  font-size: 15px;
  color: #666;
  line-height: 1.8;
}

/* 资质认证 */
.certifications-section {
  background: #fff;
}

.cert-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  max-width: 900px;
  margin: 0 auto;
}

.cert-card {
  background: #fafbfc;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  border: 2px solid #e8e8e8;
  transition: all 0.3s;
}

.cert-card:hover {
  border-color: #1890ff;
  box-shadow: 0 8px 16px rgba(24, 144, 255, 0.15);
  transform: translateY(-4px);
}

.cert-card h3 {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 20px 0 10px;
}

.cert-card p {
  font-size: 14px;
  color: #666;
  margin-bottom: 15px;
}

.cert-year {
  display: inline-block;
  background: #1890ff;
  color: #fff;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

/* 团队优势 */
.team-section {
  background: #fafbfc;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.team-card {
  background: #fff;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  transition: all 0.3s;
}

.team-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

.team-card h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 20px 0 15px;
}

.team-card p {
  font-size: 15px;
  color: #666;
  line-height: 1.8;
}

/* 服务网络 */
.network-section {
  background: #fff;
}

.map-container {
  max-width: 1000px;
  margin: 0 auto;
}

.offices-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 30px;
}

.office-group h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 2px solid #1890ff;
}

.office-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  font-size: 14px;
  color: #666;
  background: #fafbfc;
  border-radius: 6px;
  margin-bottom: 8px;
  transition: all 0.3s;
}

.office-item:hover {
  background: #f0f7ff;
  color: #1890ff;
}

.office-item.highlight {
  background: #1890ff;
  color: #fff;
  font-weight: 600;
}

/* 联系CTA */
.contact-cta {
  background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%);
  border-radius: 16px;
  margin: 0 20px 80px;
}

.cta-content {
  text-align: center;
  color: #fff;
}

.cta-content h2 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
}

.cta-content p {
  font-size: 18px;
  margin-bottom: 32px;
  opacity: 0.9;
}
</style>
