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
            <div class="banner-overlay" :style="{ 
              background: banner.overlayColor 
                ? `linear-gradient(135deg, rgba(${banner.overlayColor.r}, ${banner.overlayColor.g}, ${banner.overlayColor.b}, ${banner.overlayOpacity || 0.85}) 0%, rgba(${Math.floor(banner.overlayColor.r * 0.5)}, ${Math.floor(banner.overlayColor.g * 0.5)}, ${Math.floor(banner.overlayColor.b * 0.5)}, ${(banner.overlayOpacity || 0.85) - 0.15}) 100%)`
                : `linear-gradient(135deg, rgba(0, 40, 80, ${banner.overlayOpacity || 0.85}) 0%, rgba(0, 20, 40, ${(banner.overlayOpacity || 0.85) - 0.15}) 100%)` 
            }"></div>
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

    <!-- 明星产品展示 -->
    <section v-if="featuredProducts.length > 0" class="section featured-products-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">明星产品 / Featured Products</h2>
          <p class="section-desc">精选热销产品，为您提供卓越的工业解决方案</p>
        </div>
        <div class="featured-products-grid">
          <div v-for="product in featuredProducts" :key="product.id" class="featured-product-card">
            <!-- 视频媒体 (兼容旧格式video和新格式video-file/video-link) -->
            <div v-if="isVideoType(product.mediaType)" class="product-media">
              <!-- 视频链接: YouTube, Vimeo等 -->
              <iframe 
                v-if="product.mediaType === 'video-link' || product.mediaUrl.includes('youtube') || product.mediaUrl.includes('youtu.be') || product.mediaUrl.includes('vimeo') || product.mediaUrl.includes('qq.com')"
                :src="product.mediaUrl"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                class="product-video">
              </iframe>
              <!-- 视频文件: MP4等 -->
              <video 
                v-else
                :src="product.mediaUrl"
                controls
                :poster="product.thumbnailUrl"
                class="product-video">
                您的浏览器不支持视频播放
              </video>
            </div>
            
            <!-- 网页链接 -->
            <div v-else-if="product.mediaType === 'web-link'" class="product-media product-web-wrapper">
              <iframe 
                :src="product.mediaUrl"
                frameborder="0"
                class="product-web-frame">
              </iframe>
              <div class="web-overlay" @click="openExternalLink(product.mediaUrl)">
                <el-icon><Connection /></el-icon>
                <span>点击访问网页</span>
              </div>
            </div>
            
            <!-- 图片或GIF媒体 (兼容旧格式和新格式) -->
            <div v-else class="product-media product-image-wrapper">
              <img 
                :src="product.thumbnailUrl || product.mediaUrl" 
                :alt="product.title"
                class="product-image"
                :class="{ 'animated-image': isAnimatedType(product.mediaType) }"
                @click="goToProductLink(product.link)"
              />
            </div>
            
            <div class="product-info">
              <h3>{{ product.title }}</h3>
              <p>{{ product.description }}</p>
              <el-button type="primary" @click="goToProductLink(product.link)" v-if="product.link">
                <el-icon><View /></el-icon>
                了解详情
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 产品系列 -->
    <section class="section product-series">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">我们的产品和服务 / Products & Services</h2>
          <p class="section-desc">专业的工业自动化设备与智能制造解决方案</p>
        </div>
        <div class="series-grid" ref="seriesGridRef">
          <div v-for="series in productSeries" :key="series.id" 
               :data-id="series.id"
               class="series-card"
               :class="{ 'draggable-enabled': isAdmin }">
            <div v-if="isAdmin" class="drag-handle" title="拖拽调整顺序">
              <el-icon><Rank /></el-icon>
            </div>
            <div class="series-content" @click="goToProducts(series)">
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
      </div>
    </section>

    <!-- 智能体板块 -->
    <section class="section ai-agents-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">安彤智能体 / ANTOM AI Agents</h2>
          <p class="section-desc">基于人工智能的专业工业解决方案 | 自主学习·主动思考·持续进化</p>
        </div>
        <div class="agents-grid">
          <div v-for="agent in aiAgents" :key="agent.id" 
               class="agent-card"
               :class="{ 'agent-card-new': agent.badge }"
               @click="goToAgent(agent)">
            <el-tag v-if="agent.badge" type="danger" size="small" class="agent-badge">{{ agent.badge }}</el-tag>
            <div class="agent-icon">
              <el-icon><component :is="agent.icon" /></el-icon>
            </div>
            <h3>{{ agent.name }}</h3>
            <p>{{ agent.description }}</p>
            <div class="agent-tags">
              <el-tag v-for="tag in agent.tags" :key="tag" size="small" type="info">{{ tag }}</el-tag>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- AI营销中台板块 -->
    <section class="section marketing-hub-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">🚀 AI国际营销中台 / AI Marketing Hub</h2>
          <p class="section-desc">智能化、自动化、数据化的完整营销解决方案 | 7种语言 · 20个系统 · ROI提升385%</p>
        </div>
        
        <!-- 核心数据展示 -->
        <div class="hub-stats">
          <div class="stat-item">
            <div class="stat-icon">📊</div>
            <div class="stat-value">8,830</div>
            <div class="stat-label">行专业代码</div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">🎯</div>
            <div class="stat-value">20</div>
            <div class="stat-label">个核心系统</div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">🌍</div>
            <div class="stat-value">7</div>
            <div class="stat-label">种国际语言</div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">💰</div>
            <div class="stat-value">385%</div>
            <div class="stat-label">营销ROI</div>
          </div>
        </div>

        <!-- 功能模块 -->
        <div class="hub-features">
          <!-- Phase 2: AI驱动营销 -->
          <div class="feature-group">
            <h3 class="feature-group-title">
              <el-icon><TrendCharts /></el-icon>
              Phase 2：AI驱动营销
            </h3>
            <div class="feature-cards">
              <div class="feature-card" @click="$router.push('/ai-product-selector')">
                <div class="feature-icon">🎯</div>
                <h4>AI产品选型系统</h4>
                <p>4步智能推荐 | 92%准确率</p>
                <el-button type="primary" size="small" plain>立即体验</el-button>
              </div>
              <div class="feature-card" @click="$router.push('/resource-center')">
                <div class="feature-icon">📚</div>
                <h4>资源中心</h4>
                <p>白皮书 · 技术文档 · 案例</p>
                <el-button type="primary" size="small" plain>浏览资源</el-button>
              </div>
              <div class="feature-card">
                <div class="feature-icon">🏆</div>
                <h4>AI询盘评分</h4>
                <p>A/B/C/D智能分级</p>
                <el-button size="small" plain>了解详情</el-button>
              </div>
              <div class="feature-card">
                <div class="feature-icon">💰</div>
                <h4>AI自动报价</h4>
                <p>PDF生成 · 邮件发送</p>
                <el-button size="small" plain>了解详情</el-button>
              </div>
            </div>
          </div>

          <!-- Phase 3: 营销自动化 -->
          <div class="feature-group">
            <h3 class="feature-group-title">
              <el-icon><Connection /></el-icon>
              Phase 3：营销自动化
            </h3>
            <div class="feature-cards">
              <div class="feature-card" @click="$router.push('/email-marketing')">
                <div class="feature-icon">📧</div>
                <h4>AI邮件营销</h4>
                <p>A/B测试 · 10,000封/天</p>
                <el-button type="success" size="small" plain>创建活动</el-button>
              </div>
              <div class="feature-card" @click="$router.push('/lead-nurturing')">
                <div class="feature-icon">🔄</div>
                <h4>线索孵化系统</h4>
                <p>6阶段漏斗 · 自动化工作流</p>
                <el-button type="success" size="small" plain>查看线索</el-button>
              </div>
              <div class="feature-card">
                <div class="feature-icon">🗺️</div>
                <h4>客户旅程追踪</h4>
                <p>行为分析 · 转化归因</p>
                <el-button size="small" plain>了解详情</el-button>
              </div>
              <div class="feature-card">
                <div class="feature-icon">🤖</div>
                <h4>AI内容推荐</h4>
                <p>协同过滤 · 个性化推送</p>
                <el-button size="small" plain>了解详情</el-button>
              </div>
            </div>
          </div>

          <!-- Phase 4: 数据分析 -->
          <div class="feature-group">
            <h3 class="feature-group-title">
              <el-icon><DataAnalysis /></el-icon>
              Phase 4：数据分析优化
            </h3>
            <div class="feature-cards">
              <div class="feature-card" @click="$router.push('/marketing-data-hub')">
                <div class="feature-icon">📊</div>
                <h4>营销数据中台</h4>
                <p>实时KPI · 可视化看板</p>
                <el-button type="warning" size="small" plain>查看数据</el-button>
              </div>
              <div class="feature-card">
                <div class="feature-icon">🔮</div>
                <h4>AI预测分析</h4>
                <p>85%准确率 · 流失预警</p>
                <el-button size="small" plain>了解详情</el-button>
              </div>
              <div class="feature-card">
                <div class="feature-icon">📈</div>
                <h4>自动化报表</h4>
                <p>日/周/月报 · PDF导出</p>
                <el-button size="small" plain>了解详情</el-button>
              </div>
              <div class="feature-card">
                <div class="feature-icon">🎯</div>
                <h4>多维度归因</h4>
                <p>6种模型 · 触点分析</p>
                <el-button size="small" plain>了解详情</el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- ROI对比 -->
        <div class="roi-comparison">
          <h3>💰 真实效果对比</h3>
          <div class="roi-grid">
            <div class="roi-item">
              <div class="roi-label">响应速度</div>
              <div class="roi-before">24小时</div>
              <div class="roi-arrow">→</div>
              <div class="roi-after">即时</div>
              <div class="roi-improve">↓ 95%</div>
            </div>
            <div class="roi-item">
              <div class="roi-label">转化率</div>
              <div class="roi-before">3%</div>
              <div class="roi-arrow">→</div>
              <div class="roi-after">8-12%</div>
              <div class="roi-improve">↑ 166-300%</div>
            </div>
            <div class="roi-item">
              <div class="roi-label">获客成本</div>
              <div class="roi-before">¥50/个</div>
              <div class="roi-arrow">→</div>
              <div class="roi-after">¥15/个</div>
              <div class="roi-improve">↓ 70%</div>
            </div>
            <div class="roi-item">
              <div class="roi-label">营销ROI</div>
              <div class="roi-before">180%</div>
              <div class="roi-arrow">→</div>
              <div class="roi-after">385-520%</div>
              <div class="roi-improve">↑ 114-189%</div>
            </div>
          </div>
        </div>

        <!-- CTA按钮 -->
        <div class="hub-cta">
          <el-button type="primary" size="large" @click="$router.push('/ai-product-selector')">
            <el-icon><Promotion /></el-icon>
            立即体验AI营销中台
          </el-button>
          <el-button size="large" plain @click="openDemoPage">
            <el-icon><Document /></el-icon>
            查看完整功能演示
          </el-button>
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
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useCmsStore } from '../store/cms'
import { useCmsAdvancedStore } from '../store/cmsAdvanced'
import { usePageContentStore } from '../store/pageContent'
import { useProductsServicesStore } from '../store/productsServices'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import Sortable from 'sortablejs'

const router = useRouter()
const { t, locale } = useI18n()
const cmsStore = useCmsStore()
const cmsAdvancedStore = useCmsAdvancedStore()
const pageContentStore = usePageContentStore()
const productsStore = useProductsServicesStore()

// 拖拽元素引用
const seriesGridRef = ref(null)

// 检查是否为管理员
const isAdmin = computed(() => {
  return !!localStorage.getItem('adminToken')
})

// 从store获取首页板块数据
const homeContent = computed(() => pageContentStore.pages.home || {})

// Banner设置 - 从CMS读取
const bannerWidth = computed(() => homeContent.value.bannerSettings?.width || 100)
const bannerHeight = computed(() => homeContent.value.bannerSettings?.height || 650)
const bannerAutoplay = computed(() => homeContent.value.bannerSettings?.autoplay !== false)

// 从CMS Store获取Banner数据
const banners = computed(() => {
  return cmsStore.homeBanners
    .filter(b => b.status === 'active')
    .sort((a, b) => a.order - b.order)
    .map(banner => ({
      id: banner.id,
      title: banner.title[locale.value] || banner.title['zh-CN'],
      subtitle: banner.subtitle[locale.value] || banner.subtitle['zh-CN'],
      image: banner.image,
      buttonText: banner.buttonText[locale.value] || banner.buttonText['zh-CN'],
      buttonAction: banner.buttonAction
    }))
})

// 从store获取产品大类（1级分类）并添加工具选型和工单系统
const productSeries = computed(() => {
  // 获取保存的排序
  const savedOrder = JSON.parse(localStorage.getItem('homeProductSeriesOrder') || '[]')
  
  const categories = productsStore.visibleLevel1Categories.map(category => ({
    id: category.id,
    name: category.name[locale.value] || category.name['zh-CN'],
    description: category.description[locale.value] || category.description['zh-CN'],
    image: category.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600',
    type: 'category'
  }))
  
  // 添加工具选型智能体到产品服务
  const additionalServices = [
    {
      id: 'tool-selector',
      name: '拧紧工具选型',
      description: '智能分析工艺需求，推荐最优拧紧工具方案',
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600',
      type: 'service',
      path: '/tool-selector'
    }
  ]
  
  const allSeries = [...categories, ...additionalServices]
  
  // 如果有保存的排序，按照保存的顺序排列
  if (savedOrder.length > 0) {
    return allSeries.sort((a, b) => {
      const indexA = savedOrder.indexOf(String(a.id))
      const indexB = savedOrder.indexOf(String(b.id))
      if (indexA === -1 && indexB === -1) return 0
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return indexA - indexB
    })
  }
  
  return allSeries
})

// 获取明星产品展示
const featuredProducts = computed(() => {
  return cmsStore.featuredProducts
    .filter(p => p.status === 'active')
    .sort((a, b) => a.order - b.order)
    .map(product => ({
      id: product.id,
      title: product.title[locale.value] || product.title['zh-CN'],
      description: product.description[locale.value] || product.description['zh-CN'],
      mediaType: product.mediaType, // video / image / gif
      mediaUrl: product.mediaUrl,
      thumbnailUrl: product.thumbnailUrl,
      link: product.link
    }))
})

const solutions = ref([
  { id: 1, name: '汽车制造', description: '为汽车制造企业提供全套工具装配解决方案', icon: 'Van' },
  { id: 2, name: '智能制造', description: '配套智能制造领域的工具应用与系统集成', icon: 'Monitor' },
  { id: 3, name: '航空航天', description: '高精度工具应用于航空航天精密装配', icon: 'Promotion' },
  { id: 4, name: '能源设备', description: '能源设备制造与维护工具解决方案', icon: 'HotWater' }
])

// AI智能体数据（移除工具选型和工单管理）
const aiAgents = ref([
  { 
    id: 2, 
    name: '数字监控驾驶舱', 
    description: '可视化数字监控中心，实时监控设备状态、维护流程、零配件订货状态', 
    icon: 'DataAnalysis',
    tags: ['实时监控', '可视化数据', '智能预警'],
    path: '/equipment-dashboard',
    badge: '新功能'
  },
  { 
    id: 3, 
    name: '设备全生命周期管理', 
    description: '关键设备资产管理、ROI分析、保养预测、成本优化', 
    icon: 'Box',
    tags: ['设备档案', 'ROI分析', 'AI保养预测'],
    path: '/equipment-lifecycle'
  },
  { 
    id: 5, 
    name: '拧紧曲线对比分析', 
    description: '专业的拧紧曲线分析工具，支持多曲线对比、智能诊断', 
    icon: 'TrendCharts',
    tags: ['曲线对比', 'AI诊断', '工艺建议'],
    path: '/curve-analysis'
  },
  { 
    id: 6, 
    name: '拧紧数据采集分析', 
    description: '基于Open Protocol实时采集PF4000/PF8000控制器数据，Cpk分析+智能报警', 
    icon: 'DataAnalysis',
    tags: ['数据采集', 'Cpk分析', '异常报警'],
    path: '/tightening-data'
  },
  { 
    id: 7, 
    name: '产品技术销售小课堂', 
    description: '拧紧工具产品技术知识库，涵盖产品介绍、技术规格、应用案例', 
    icon: 'Reading',
    tags: ['产品知识', '技术规格', '应用案例'],
    path: '/tech-classroom'
  },
  { 
    id: 8, 
    name: '拧紧工艺改进与验证', 
    description: 'PSE拧紧程序参数推荐，多维度工艺条件筛选，三种控制策略分析', 
    icon: 'Setting',
    tags: ['PSE参数', '工艺验证', '策略分析'],
    path: '/process-verification',
    badge: '新功能'
  },
  { 
    id: 9, 
    name: '明升AICRM智能助手', 
    description: '轻量化智能客户关系管理系统，AI驱动商机管理、客户360°画像、半自动执行', 
    icon: 'User',
    tags: ['客户管理', 'AI预测', '商机跟进'],
    path: '/mingsheng-aicrm',
    badge: 'AI营销',
    category: 'marketing'
  },
  { 
    id: 10, 
    name: 'AIMES助手', 
    description: 'AI MES系统 - 生产现场感知、智能排产、质量控制、设备智能运维', 
    icon: 'Setting',
    tags: ['智能制造', 'MES系统', 'AI排产'],
    path: '/mingsheng-aicrm?tab=aimes',
    badge: '新功能',
    category: 'manufacturing'
  }
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
  // 如果是服务类型，直接跳转到对应路由
  if (series.type === 'service' && series.path) {
    router.push(series.path)
  } else {
    // 产品分类，跳转到产品与服务页面
    router.push('/products-services')
  }
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

const openDemoPage = () => {
  window.open('/📊_AI营销中台功能演示_2025-12-17.html', '_blank')
}

const handleBannerClick = (banner) => {
  const action = banner.buttonAction || 'products'
  switch (action) {
    case 'about':
      router.push('/about')
      break
    case 'products':
      router.push('/products-services')
      break
    case 'solutions':
      router.push('/solutions')
      break
    case 'contact':
      router.push('/contact')
      break
    default:
      router.push('/products-services')
  }
}

const goToAgent = (agent) => {
  if (agent.path) {
    router.push(agent.path)
  } else {
    router.push(`/ai-agent/${agent.id}`)
  }
}

const goToProductLink = (link) => {
  if (link) {
    if (link.startsWith('http')) {
      // 外部链接，新窗口打开
      window.open(link, '_blank')
    } else {
      // 内部路由
      router.push(link)
    }
  }
}

// 打开外部链接
const openExternalLink = (url) => {
  window.open(url, '_blank')
}

// 判断是否为视频类型
const isVideoType = (mediaType) => {
  return mediaType === 'video' || mediaType === 'video-file' || mediaType === 'video-link'
}

// 判断是否为动画类型
const isAnimatedType = (mediaType) => {
  return mediaType === 'gif' || mediaType === 'gif-file' || mediaType === 'animation-link'
}

// 初始化拖拽功能（仅在管理员登录时启用）
const initDraggable = () => {
  if (!isAdmin.value || !seriesGridRef.value) {
    console.log('非管理员或元素未就绪，跳过拖拽初始化')
    return
  }
  
  console.log('✅ 管理员身份确认，启用拖拽功能')
  
  // 初始化 Sortable
  Sortable.create(seriesGridRef.value, {
    animation: 200,
    handle: '.drag-handle', // 只能通过拖拽手柄拖动
    ghostClass: 'series-card-ghost',
    chosenClass: 'series-card-chosen',
    dragClass: 'series-card-drag',
    forceFallback: true,
    fallbackTolerance: 3,
    onStart: (evt) => {
      console.log('开始拖拽卡片:', evt.item.getAttribute('data-id'))
    },
    onEnd: (evt) => {
      // 获取新的排序
      const newOrder = Array.from(seriesGridRef.value.children).map(el => el.getAttribute('data-id'))
      // 保存到 localStorage
      localStorage.setItem('homeProductSeriesOrder', JSON.stringify(newOrder))
      console.log('✅ 产品服务卡片顺序已更新:', newOrder)
      
      // 显示提示消息
      if (typeof ElMessage !== 'undefined') {
        ElMessage.success('卡片顺序已保存！刷新页面查看效果')
      }
    }
  })
}

// 组件挂载后初始化拖拽
onMounted(() => {
  nextTick(() => {
    initDraggable()
  })
})

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
  /* 朦胧效果由内联样式控制，可在后台调整透明度 */
  transition: background 0.3s ease;
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

@media (max-width: 1600px) {
  .series-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1200px) {
  .series-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.series-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 1px solid #e8e8e8;
  position: relative;
}

.series-content {
  cursor: pointer;
}

.series-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}

/* 管理员拖拽手柄 */
.drag-handle {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  animation: pulseGlow 2s infinite;
}

.drag-handle:hover {
  transform: scale(1.15);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.6);
}

.drag-handle:active {
  cursor: grabbing;
  transform: scale(1.05);
}

@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
  }
  50% {
    box-shadow: 0 2px 16px rgba(102, 126, 234, 0.8);
  }
}

/* 拖拽状态样式 */
.series-card-ghost {
  opacity: 0.3;
  background: linear-gradient(135deg, #667eea22 0%, #764ba222 100%);
  border: 2px dashed #667eea;
}

.series-card-chosen {
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  border-color: #667eea;
  transform: scale(1.02);
}

.series-card-drag {
  transform: rotate(3deg) scale(1.05);
  opacity: 0.9;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
  cursor: grabbing !important;
}

/* 管理员模式提示 */
.draggable-enabled {
  border-color: rgba(102, 126, 234, 0.3);
}

.draggable-enabled:hover {
  border-color: #667eea;
}

.series-image {
  width: 100%;
  height: 168px; /* 减小30%: 240 → 168 */
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
  padding: 20px; /* 减小30%: 28 → 20 */
}

.series-info h3 {
  font-size: 15px; /* 减小30%: 22 → 15 */
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px; /* 减小30%: 12 → 8 */
}

.series-info p {
  color: #666;
  font-size: 10px; /* 减小30%: 14 → 10 */
  line-height: 1.6;
  margin-bottom: 14px; /* 减小30%: 20 → 14 */
}

.series-link {
  color: #1890ff;
  font-size: 10px; /* 减小30%: 14 → 10 */
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 1600px) {
  .agents-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1200px) {
  .agents-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .agents-grid {
    grid-template-columns: 1fr;
  }
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

/* 安彤智能体板块 */
.ai-agents-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 0;
}

.ai-agents-section .section-title,
.ai-agents-section .section-desc {
  color: #fff;
}

.agents-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.agent-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 24px 20px;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  backdrop-filter: blur(10px);
  position: relative;
}

.agent-card:hover {
  background: #fff;
  border-color: #fff;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
  transform: translateY(-8px);
}

/* 新功能卡片样式 */
.agent-card-new {
  background: rgba(255, 245, 245, 0.98);
  border: 2px solid rgba(255, 107, 107, 0.3);
  animation: cardPulse 2s infinite;
}

.agent-card-new:hover {
  background: #fff5f5;
  border-color: #ff6b6b;
  box-shadow: 0 12px 32px rgba(255, 107, 107, 0.3);
}

@keyframes cardPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.4);
  }
  50% {
    box-shadow: 0 0 20px 8px rgba(255, 107, 107, 0.2);
  }
}

/* 新功能徽章 */
.agent-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  font-weight: 600;
  animation: badgeBounce 1s infinite;
  z-index: 1;
}

@keyframes badgeBounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.agent-icon {
  margin-bottom: 16px;
  color: #667eea;
}

.agent-icon .el-icon {
  font-size: 40px;
}

.agent-card h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
  color: #1a1a1a;
}

.agent-card p {
  color: #666;
  font-size: 13px;
  line-height: 1.5;
}

/* AI营销中台板块 */
.marketing-hub-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
  padding: 80px 0;
}

.hub-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 50px;
}

.stat-item {
  background: white;
  padding: 30px 20px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  transition: all 0.3s;
}

.stat-item:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.12);
}

.stat-icon {
  font-size: 42px;
  margin-bottom: 12px;
}

.stat-value {
  font-size: 42px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 8px;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

.hub-features {
  margin-bottom: 50px;
}

.feature-group {
  margin-bottom: 40px;
}

.feature-group-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 24px;
  padding-left: 10px;
  border-left: 4px solid #667eea;
}

.feature-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.feature-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.feature-card:hover {
  border-color: #667eea;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
  transform: translateY(-4px);
}

.feature-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.feature-card h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.feature-card p {
  color: #666;
  font-size: 13px;
  margin-bottom: 16px;
  line-height: 1.5;
}

.roi-comparison {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  margin-bottom: 40px;
}

.roi-comparison h3 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.roi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.roi-item {
  text-align: center;
}

.roi-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  font-weight: 500;
}

.roi-before {
  font-size: 16px;
  color: #999;
  text-decoration: line-through;
  margin-bottom: 8px;
}

.roi-arrow {
  font-size: 20px;
  color: #667eea;
  margin: 8px 0;
}

.roi-after {
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 8px;
}

.roi-improve {
  font-size: 18px;
  font-weight: 600;
  color: #10b981;
  padding: 4px 12px;
  background: #f0fdf4;
  border-radius: 20px;
  display: inline-block;
}

.hub-cta {
  text-align: center;
  padding-top: 20px;
}

.hub-cta .el-button {
  margin: 0 10px;
}

.agent-tags {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
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

/* 明星产品展示 */
.featured-products-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.featured-products-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
}

@media (max-width: 1200px) {
  .featured-products-grid {
    grid-template-columns: 1fr;
  }
}

.featured-product-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.featured-product-card:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

.product-media {
  width: 100%;
  height: 280px; /* 减小30%: 400 → 280 */
  background: #000;
  position: relative;
}

.product-video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.product-image-wrapper {
  cursor: pointer;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-image-wrapper:hover .product-image {
  transform: scale(1.05);
}

.product-info {
  padding: 22px; /* 减小30%: 32 → 22 */
  text-align: center;
}

.product-info h3 {
  font-size: 17px; /* 减小30%: 24 → 17 */
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 11px; /* 减小30%: 16 → 11 */
}

.product-info p {
  font-size: 11px; /* 减小30%: 15 → 11 */
  color: #666;
  line-height: 1.6;
  margin-bottom: 17px; /* 减小30%: 24 → 17 */
}

.product-info .el-button {
  font-size: 11px; /* 减小30%: 16 → 11 */
  padding: 8px 22px; /* 减小30%: 12→8, 32→22 */
}

/* ========== 新增媒体类型样式 ========== */

/* 网页链接样式 */
.product-web-wrapper {
  position: relative;
  cursor: pointer;
}

.product-web-frame {
  width: 100%;
  height: 100%;
  pointer-events: none; /* 防止直接操作iframe */
}

.web-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #fff;
  font-size: 20px;
  font-weight: 500;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-web-wrapper:hover .web-overlay {
  opacity: 1;
}

.web-overlay .el-icon {
  font-size: 48px;
}

/* 动画图片样式 */
.animated-image {
  /* 为GIF添加特殊效果 */
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1);
}

/* 视频样式增强 */
.product-video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .product-media {
    height: 175px; /* 减小30%: 250 → 175 */
  }
  
  .product-info {
    padding: 14px; /* 减小30%: 20 → 14 */
  }
  
  .product-info h3 {
    font-size: 13px; /* 减小30%: 18 → 13 */
  }
  
  .product-info p {
    font-size: 10px; /* 减小30%: 14 → 10 */
  }
}



</style>
