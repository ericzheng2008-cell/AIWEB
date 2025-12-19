<template>
  <div class="products-services-page">
    <Header />
    
    <!-- 页面横幅 (PANTONE 2736C主色调) -->
    <section 
      class="page-hero"
      :style="{
        backgroundImage: bannerSettings.backgroundImage ? `url(${bannerSettings.backgroundImage})` : 'none',
        background: bannerSettings.backgroundImage 
          ? `linear-gradient(135deg, ${bannerSettings.backgroundColor}99 0%, ${bannerSettings.backgroundColor} 100%), url(${bannerSettings.backgroundImage})`
          : `linear-gradient(135deg, ${bannerSettings.backgroundColor} 0%, #0066dd 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: bannerSettings.textColor
      }">
      <div class="hero-overlay"></div>
      <div class="container">
        <h1>{{ bannerSettings.title[locale] || bannerSettings.title['zh-CN'] }}</h1>
        <p>{{ bannerSettings.subtitle[locale] || bannerSettings.subtitle['zh-CN'] }}</p>
        <div class="hero-actions">
          <el-button @click="goHome" type="success" size="large" round>
            <el-icon><HomeFilled /></el-icon>
            返回主页
          </el-button>
        </div>
      </div>
    </section>

    <!-- 产品系列展示 (6个子系统) -->
    <section class="section">
      <div class="container">
        <div class="series-grid" ref="seriesGridRef">
          <div 
            v-for="category in level1Categories" 
            :key="category.id" 
            :data-id="category.id"
            class="series-card"
            :class="{ 'draggable-enabled': isAdmin }">
            <div v-if="isAdmin" class="drag-handle" title="拖拽调整顺序">
              <el-icon><Rank /></el-icon>
            </div>
            <div class="series-content" @click="goToLevel2(category)">
              <div class="series-image">
                <img :src="category.image" :alt="category.name" />
                <div class="series-overlay">
                  <component :is="getIcon(category.icon)" class="series-icon" />
                </div>
              </div>
              <div class="series-info">
                <h3>{{ category.name }}</h3>
                <p>{{ category.description }}</p>
                <div class="series-link">
                  {{ t('common.viewDetails') || '查看详情' }} <el-icon><ArrowRight /></el-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 二级分类详情对话框 -->
    <el-dialog 
      v-model="level2DialogVisible" 
      :title="currentLevel1Name"
      width="900px"
      class="level2-dialog">
      <div class="level2-grid">
        <div 
          v-for="level2 in currentLevel2Categories" 
          :key="level2.id"
          class="level2-card"
          @click="goToLevel3(level2)">
          <h4>{{ level2.name }}</h4>
          <p>{{ level2.description }}</p>
          <div class="level2-arrow">
            <el-icon><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 三级分类详情对话框 -->
    <el-dialog 
      v-model="level3DialogVisible" 
      :title="currentLevel2Name"
      width="800px"
      class="level3-dialog">
      <div class="level3-list">
        <div 
          v-for="level3 in currentLevel3Categories" 
          :key="level3.id"
          class="level3-item"
          @click="goToProducts(level3)">
          <div class="level3-content">
            <h5>{{ level3.name }}</h5>
            <p>{{ level3.description }}</p>
          </div>
          <el-icon class="level3-arrow"><ArrowRight /></el-icon>
        </div>
      </div>
    </el-dialog>

    <!-- 产品列表对话框 -->
    <el-dialog 
      v-model="productsDialogVisible" 
      :title="currentLevel3Name"
      width="1000px"
      class="products-dialog">
      <div class="products-grid">
        <div 
          v-for="product in currentProducts" 
          :key="product.id"
          class="product-card">
          <div class="product-image">
            <img :src="product.images[0]" :alt="product.name" />
          </div>
          <div class="product-info">
            <h5>{{ product.name }}</h5>
            <p>{{ product.description }}</p>
            <el-button type="primary" size="small" @click.stop="viewProductDetail(product)">
              查看详情
            </el-button>
          </div>
        </div>
      </div>
      <el-empty v-if="currentProducts.length === 0" description="暂无产品" />
    </el-dialog>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useProductsServicesStore } from '../store/productsServices'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { HomeFilled } from '@element-plus/icons-vue'
import Sortable from 'sortablejs'

const router = useRouter()
const { t, locale } = useI18n()
const productsStore = useProductsServicesStore()

// 返回主页
const goHome = () => {
  router.push('/')
  ElMessage.success('返回主页')
}


// 拖拽元素引用
const seriesGridRef = ref(null)

// 检查是否为管理员
const isAdmin = computed(() => {
  return !!localStorage.getItem('adminToken')
})

const bannerSettings = ref({
  title: {
    'zh-CN': '产品与服务',
    'en-US': 'Products & Services'
  },
  subtitle: {
    'zh-CN': '专业的工业自动化设备与智能制造解决方案',
    'en-US': 'Professional Industrial Automation Equipment and Intelligent Manufacturing Solutions'
  },
  backgroundImage: '',
  backgroundColor: '#0047BB', // PANTONE 2736C
  textColor: '#ffffff'
})

// 对话框控制
const level2DialogVisible = ref(false)
const level3DialogVisible = ref(false)
const productsDialogVisible = ref(false)

// 当前选中的分类
const currentLevel1 = ref(null)
const currentLevel2 = ref(null)
const currentLevel3 = ref(null)

// 从localStorage加载页面设置
const loadPageSettings = () => {
  const savedSettings = localStorage.getItem('productsServicesPageSettings')
  if (savedSettings) {
    try {
      const settings = JSON.parse(savedSettings)
      if (settings.banner) {
        Object.assign(bannerSettings.value, settings.banner)
      }
    } catch (e) {
      console.error('加载页面设置失败:', e)
    }
  }
}

// 获取一级分类（6个子系统）- 支持自定义排序
const level1Categories = computed(() => {
  // 获取保存的排序
  const savedOrder = JSON.parse(localStorage.getItem('productsServicesPageOrder') || '[]')
  
  const categories = productsStore.visibleLevel1Categories.map(cat => ({
    id: cat.id,
    name: cat.name[locale.value] || cat.name['zh-CN'],
    description: cat.description[locale.value] || cat.description['zh-CN'],
    image: cat.image,
    icon: cat.icon
  }))
  
  // 如果有保存的排序，按照保存的顺序排列
  if (savedOrder.length > 0) {
    return categories.sort((a, b) => {
      const indexA = savedOrder.indexOf(a.id)
      const indexB = savedOrder.indexOf(b.id)
      if (indexA === -1 && indexB === -1) return 0
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return indexA - indexB
    })
  }
  
  return categories
})

// 获取当前二级分类
const currentLevel2Categories = computed(() => {
  if (!currentLevel1.value) return []
  return productsStore.getLevel2Categories(currentLevel1.value.id).map(cat => ({
    id: cat.id,
    name: cat.name[locale.value] || cat.name['zh-CN'],
    description: cat.description[locale.value] || cat.description['zh-CN']
  }))
})

// 获取当前三级分类
const currentLevel3Categories = computed(() => {
  if (!currentLevel2.value) return []
  return productsStore.getLevel3Categories(currentLevel2.value.id).map(cat => ({
    id: cat.id,
    name: cat.name[locale.value] || cat.name['zh-CN'],
    description: cat.description[locale.value] || cat.description['zh-CN']
  }))
})

// 获取当前产品列表
const currentProducts = computed(() => {
  if (!currentLevel3.value) return []
  return productsStore.getProductsByCategory(currentLevel3.value.id, 3).map(prod => ({
    id: prod.id,
    name: prod.name[locale.value] || prod.name['zh-CN'],
    description: prod.description[locale.value] || prod.description['zh-CN'],
    images: prod.images || []
  }))
})

// 名称计算
const currentLevel1Name = computed(() => currentLevel1.value ? currentLevel1.value.name : '')
const currentLevel2Name = computed(() => currentLevel2.value ? currentLevel2.value.name : '')
const currentLevel3Name = computed(() => currentLevel3.value ? currentLevel3.value.name : '')

// 获取图标组件
const getIcon = (iconName) => {
  return ElementPlusIconsVue[iconName] || ElementPlusIconsVue.Box
}

// 导航方法
const goToLevel2 = (category) => {
  currentLevel1.value = category
  level2DialogVisible.value = true
}

const goToLevel3 = (level2) => {
  currentLevel2.value = level2
  level2DialogVisible.value = false
  level3DialogVisible.value = true
}

const goToProducts = (level3) => {
  currentLevel3.value = level3
  level3DialogVisible.value = false
  productsDialogVisible.value = true
}

const viewProductDetail = (product) => {
  // 可以跳转到产品详情页面
  console.log('查看产品详情:', product)
}

// 初始化拖拽功能（仅在管理员登录时启用）
const initDraggable = () => {
  if (!isAdmin.value || !seriesGridRef.value) {
    console.log('非管理员或元素未就绪，跳过拖拽初始化')
    return
  }
  
  console.log('✅ 管理员身份确认，启用产品与服务页面拖拽功能')
  
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
      const newOrder = Array.from(seriesGridRef.value.children).map(el => 
        parseInt(el.getAttribute('data-id'))
      )
      // 保存到 localStorage
      localStorage.setItem('productsServicesPageOrder', JSON.stringify(newOrder))
      console.log('✅ 产品与服务卡片顺序已更新:', newOrder)
      
      // 显示提示消息
      ElMessage.success('卡片顺序已保存！刷新页面查看效果')
    }
  })
}

onMounted(() => {
  loadPageSettings()
  nextTick(() => {
    initDraggable()
  })
})
</script>

<style scoped>
.products-services-page {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 页面横幅 - PANTONE 2736C主色调 */
.page-hero {
  background-size: cover;
  background-position: center;
  color: #fff;
  padding: 100px 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 71, 187, 0.2); /* PANTONE 2736C 透明遮罩 */
  z-index: 1;
}

.page-hero .container {
  position: relative;
  z-index: 2;
}

.page-hero h1 {
  font-size: 52px;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.page-hero p {
  font-size: 22px;
  opacity: 0.95;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

.section {
  padding: 80px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 产品系列卡片 - 3列网格 */
.series-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.series-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid #e8e8e8;
  box-shadow: 0 4px 12px rgba(0, 71, 187, 0.08); /* PANTONE 2736C 阴影 */
  position: relative;
}

.series-content {
  cursor: pointer;
}

.series-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 16px 32px rgba(0, 71, 187, 0.2); /* PANTONE 2736C 悬停阴影 */
  border-color: #0047BB; /* PANTONE 2736C */
}

.series-image {
  width: 100%;
  height: 260px;
  overflow: hidden;
  position: relative;
}

.series-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.series-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0, 71, 187, 0.85) 0%, rgba(0, 102, 221, 0.75) 100%); /* PANTONE 2736C 渐变 */
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.series-card:hover .series-overlay {
  opacity: 1;
}

.series-icon {
  font-size: 64px;
  color: #fff;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

.series-card:hover .series-image img {
  transform: scale(1.1);
}

.series-info {
  padding: 32px;
}

.series-info h3 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 14px;
}

.series-info p {
  color: #666;
  font-size: 15px;
  line-height: 1.7;
  margin-bottom: 24px;
  min-height: 50px;
}

.series-link {
  color: #0047BB; /* PANTONE 2736C */
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
}

.series-card:hover .series-link {
  color: #0066dd;
  gap: 10px;
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

/* 对话框样式 - PANTONE 2736C主题 */
:deep(.level2-dialog .el-dialog__header),
:deep(.level3-dialog .el-dialog__header),
:deep(.products-dialog .el-dialog__header) {
  background: linear-gradient(135deg, #0047BB 0%, #0066dd 100%); /* PANTONE 2736C */
  color: #fff;
  padding: 24px;
  border-radius: 8px 8px 0 0;
}

:deep(.el-dialog__title) {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: #fff;
  font-size: 24px;
}

.level2-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 10px;
}

.level2-card {
  padding: 24px;
  border: 2px solid #e8e8e8;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.level2-card:hover {
  border-color: #0047BB; /* PANTONE 2736C */
  background: linear-gradient(135deg, rgba(0, 71, 187, 0.03) 0%, rgba(0, 102, 221, 0.05) 100%);
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(0, 71, 187, 0.15);
}

.level2-card h4 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 10px;
}

.level2-card p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.level2-arrow {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #0047BB; /* PANTONE 2736C */
  font-size: 20px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.level2-card:hover .level2-arrow {
  opacity: 1;
}

.level3-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.level3-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.level3-item:hover {
  border-color: #0047BB; /* PANTONE 2736C */
  background: linear-gradient(90deg, rgba(0, 71, 187, 0.03) 0%, rgba(0, 102, 221, 0.05) 100%);
  transform: translateX(8px);
  box-shadow: 0 4px 12px rgba(0, 71, 187, 0.12);
}

.level3-content h5 {
  font-size: 17px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 6px;
}

.level3-content p {
  font-size: 13px;
  color: #666;
}

.level3-arrow {
  font-size: 20px;
  color: #0047BB; /* PANTONE 2736C */
  transition: transform 0.3s ease;
}

.level3-item:hover .level3-arrow {
  transform: translateX(8px);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding: 10px;
}

.product-card {
  border: 2px solid #e8e8e8;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.product-card:hover {
  border-color: #0047BB; /* PANTONE 2736C */
  box-shadow: 0 8px 20px rgba(0, 71, 187, 0.15);
  transform: translateY(-6px);
}

.product-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.08);
}

.product-info {
  padding: 20px;
}

.product-info h5 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 10px;
}

.product-info p {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 16px;
  min-height: 40px;
}

:deep(.product-info .el-button--primary) {
  background: #0047BB; /* PANTONE 2736C */
  border-color: #0047BB;
}

:deep(.product-info .el-button--primary:hover) {
  background: #0066dd;
  border-color: #0066dd;
}

@media (max-width: 768px) {
  .series-grid,
  .products-grid {
    grid-template-columns: 1fr !important;
  }
  
  .level2-grid {
    grid-template-columns: 1fr !important;
  }
  
  .page-hero h1 {
    font-size: 32px;
  }
  
  .page-hero p {
    font-size: 16px;
  }
}
</style>
