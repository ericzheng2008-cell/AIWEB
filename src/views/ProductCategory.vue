<template>
  <div class="product-category-page">
    <Header />
    
    <!-- 面包屑导航 -->
    <div class="breadcrumb-container">
      <div class="container">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">{{ t('common.home') }}</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/products-services' }">{{ t('productsServices.title') }}</el-breadcrumb-item>
          <el-breadcrumb-item v-if="currentCategory">{{ currentCategory.name[locale] }}</el-breadcrumb-item>
          <el-breadcrumb-item v-if="currentSubCategory">{{ currentSubCategory.name[locale] }}</el-breadcrumb-item>
          <el-breadcrumb-item v-if="currentThirdCategory">{{ currentThirdCategory.name[locale] }}</el-breadcrumb-item>
          <el-breadcrumb-item v-if="currentFourthCategory">{{ currentFourthCategory.name[locale] }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>

    <!-- 页面内容 -->
    <div class="page-container">
      <!-- 侧边栏：分类树 -->
      <aside class="sidebar">
        <div class="category-tree-wrapper">
          <h3>{{ t('cms.category.title') }}</h3>
          <el-tree
            :data="categoryTree"
            :props="{ label: 'label', children: 'children' }"
            node-key="id"
            :default-expanded-keys="expandedKeys"
            :current-node-key="currentNodeKey"
            @node-click="handleNodeClick"
            class="category-tree">
            <template #default="{ node, data }">
              <span class="tree-node-label">
                <el-tag :type="getLevelType(data.level)" size="small">{{ data.level }}{{ t('cms.category.level') }}</el-tag>
                {{ data.label }}
              </span>
            </template>
          </el-tree>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="main-content">
        <!-- 当前分类信息 -->
        <el-card v-if="currentDisplayCategory" class="category-header" shadow="never">
          <div class="category-info">
            <div class="category-image" v-if="currentDisplayCategory.image">
              <img :src="currentDisplayCategory.image" :alt="currentDisplayCategory.name[locale]" />
            </div>
            <div class="category-details">
              <h1>{{ currentDisplayCategory.name[locale] }}</h1>
              <p class="category-desc">{{ currentDisplayCategory.description[locale] }}</p>
            </div>
          </div>
        </el-card>

        <!-- 子分类展示（如果有） -->
        <div v-if="hasSubCategories" class="sub-categories-section">
          <h2>
            <span v-if="currentLevel === 1">产品中类</span>
            <span v-else-if="currentLevel === 2">产品小类</span>
            <span v-else-if="currentLevel === 3">产品系列</span>
          </h2>
          <div class="sub-categories-grid">
            <div 
              v-for="sub in subCategories" 
              :key="sub.id"
              class="sub-category-card"
              @click="navigateToCategory(sub)">
              <div class="sub-image" v-if="sub.image">
                <img :src="sub.image" :alt="sub.name[locale]" />
              </div>
              <div class="sub-info">
                <h3>{{ sub.name[locale] }}</h3>
                <p>{{ sub.description[locale] }}</p>
                <div class="sub-link">
                  {{ t('common.viewDetails') }} <el-icon><ArrowRight /></el-icon>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 产品列表（叶子节点） -->
        <div v-if="!hasSubCategories && products.length > 0" class="products-section">
          <div class="section-header">
            <h2>产品列表</h2>
            <span class="product-count">共 {{ products.length }} 款产品</span>
          </div>
          <div class="products-grid">
            <div 
              v-for="product in products" 
              :key="product.id"
              class="product-card"
              @click="goToProductDetail(product)">
              <div class="product-image">
                <img 
                  :src="product.images && product.images[0] || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400'" 
                  :alt="product.name[locale]" 
                />
              </div>
              <div class="product-info">
                <h3>{{ product.name[locale] }}</h3>
                <p class="product-desc">{{ product.description[locale] }}</p>
                <el-button type="primary" size="small">{{ t('common.viewDetails') }}</el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <el-empty 
          v-if="!hasSubCategories && products.length === 0" 
          description="暂无产品"
          :image-size="200"
        />
      </main>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCmsAdvancedStore } from '../store/cmsAdvanced'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

const router = useRouter()
const route = useRoute()
const { t, locale } = useI18n()
const cmsStore = useCmsAdvancedStore()

const expandedKeys = ref([])
const currentNodeKey = ref(null)

// 获取当前分类ID
const categoryId = computed(() => parseInt(route.params.categoryId) || null)
const subCategoryId = computed(() => parseInt(route.params.subCategoryId) || null)
const thirdCategoryId = computed(() => parseInt(route.params.thirdCategoryId) || null)
const fourthCategoryId = computed(() => parseInt(route.params.fourthCategoryId) || null)

// 当前层级
const currentLevel = computed(() => {
  if (fourthCategoryId.value) return 4
  if (thirdCategoryId.value) return 3
  if (subCategoryId.value) return 2
  if (categoryId.value) return 1
  return 0
})

// 获取当前分类对象
const currentCategory = computed(() => {
  return cmsStore.productCategories.find(c => c.id === categoryId.value)
})

const currentSubCategory = computed(() => {
  return cmsStore.productSubCategories.find(s => s.id === subCategoryId.value)
})

const currentThirdCategory = computed(() => {
  return cmsStore.productThirdCategories.find(t => t.id === thirdCategoryId.value)
})

const currentFourthCategory = computed(() => {
  return cmsStore.productFourthCategories.find(f => f.id === fourthCategoryId.value)
})

// 当前显示的分类
const currentDisplayCategory = computed(() => {
  if (currentLevel.value === 4) return currentFourthCategory.value
  if (currentLevel.value === 3) return currentThirdCategory.value
  if (currentLevel.value === 2) return currentSubCategory.value
  if (currentLevel.value === 1) return currentCategory.value
  return null
})

// 获取子分类
const subCategories = computed(() => {
  if (currentLevel.value === 1) {
    // 显示2级分类
    return cmsStore.productSubCategories.filter(s => s.parentId === categoryId.value)
  } else if (currentLevel.value === 2) {
    // 显示3级分类
    return cmsStore.productThirdCategories.filter(t => t.parentId === subCategoryId.value)
  } else if (currentLevel.value === 3) {
    // 显示4级分类
    return cmsStore.productFourthCategories.filter(f => f.parentId === thirdCategoryId.value)
  }
  return []
})

// 是否有子分类
const hasSubCategories = computed(() => subCategories.value.length > 0)

// 获取当前分类下的产品
const products = computed(() => {
  if (currentLevel.value === 4) {
    return cmsStore.products.filter(p => p.fourthCategoryId === fourthCategoryId.value)
  } else if (currentLevel.value === 3) {
    return cmsStore.products.filter(p => p.thirdCategoryId === thirdCategoryId.value)
  } else if (currentLevel.value === 2) {
    return cmsStore.products.filter(p => p.subCategoryId === subCategoryId.value)
  } else if (currentLevel.value === 1) {
    return cmsStore.products.filter(p => p.categoryId === categoryId.value)
  }
  return []
})

// 构建分类树
const categoryTree = computed(() => {
  return cmsStore.productCategories.map(cat => {
    const subs = cmsStore.productSubCategories
      .filter(s => s.parentId === cat.id)
      .map(sub => {
        const thirds = cmsStore.productThirdCategories
          .filter(t => t.parentId === sub.id)
          .map(third => {
            const fourths = cmsStore.productFourthCategories
              .filter(f => f.parentId === third.id)
              .map(fourth => ({
                id: `fourth-${fourth.id}`,
                label: fourth.name[locale.value] || fourth.name['zh-CN'],
                level: 4,
                realId: fourth.id,
                type: 'fourth',
                data: fourth
              }))
            
            return {
              id: `third-${third.id}`,
              label: third.name[locale.value] || third.name['zh-CN'],
              level: 3,
              realId: third.id,
              type: 'third',
              data: third,
              children: fourths
            }
          })
        
        return {
          id: `sub-${sub.id}`,
          label: sub.name[locale.value] || sub.name['zh-CN'],
          level: 2,
          realId: sub.id,
          type: 'sub',
          data: sub,
          children: thirds
        }
      })
    
    return {
      id: `cat-${cat.id}`,
      label: cat.name[locale.value] || cat.name['zh-CN'],
      level: 1,
      realId: cat.id,
      type: 'category',
      data: cat,
      children: subs
    }
  })
})

// 获取等级类型
const getLevelType = (level) => {
  const types = { 1: 'danger', 2: 'warning', 3: 'success', 4: 'info' }
  return types[level] || 'info'
}

// 处理节点点击
const handleNodeClick = (data) => {
  if (data.type === 'category') {
    router.push(`/product-category/${data.realId}`)
  } else if (data.type === 'sub') {
    const catId = cmsStore.productSubCategories.find(s => s.id === data.realId)?.parentId
    router.push(`/product-category/${catId}/${data.realId}`)
  } else if (data.type === 'third') {
    const subId = cmsStore.productThirdCategories.find(t => t.id === data.realId)?.parentId
    const catId = cmsStore.productSubCategories.find(s => s.id === subId)?.parentId
    router.push(`/product-category/${catId}/${subId}/${data.realId}`)
  } else if (data.type === 'fourth') {
    const thirdId = cmsStore.productFourthCategories.find(f => f.id === data.realId)?.parentId
    const subId = cmsStore.productThirdCategories.find(t => t.id === thirdId)?.parentId
    const catId = cmsStore.productSubCategories.find(s => s.id === subId)?.parentId
    router.push(`/product-category/${catId}/${subId}/${thirdId}/${data.realId}`)
  }
}

// 导航到分类
const navigateToCategory = (category) => {
  if (currentLevel.value === 1) {
    // 当前在1级，点击2级
    router.push(`/product-category/${categoryId.value}/${category.id}`)
  } else if (currentLevel.value === 2) {
    // 当前在2级，点击3级
    router.push(`/product-category/${categoryId.value}/${subCategoryId.value}/${category.id}`)
  } else if (currentLevel.value === 3) {
    // 当前在3级，点击4级
    router.push(`/product-category/${categoryId.value}/${subCategoryId.value}/${thirdCategoryId.value}/${category.id}`)
  }
}

// 去产品详情
const goToProductDetail = (product) => {
  router.push(`/product/${product.id}`)
}

// 更新展开的节点
const updateExpandedKeys = () => {
  const keys = []
  if (categoryId.value) {
    keys.push(`cat-${categoryId.value}`)
    currentNodeKey.value = `cat-${categoryId.value}`
  }
  if (subCategoryId.value) {
    keys.push(`sub-${subCategoryId.value}`)
    currentNodeKey.value = `sub-${subCategoryId.value}`
  }
  if (thirdCategoryId.value) {
    keys.push(`third-${thirdCategoryId.value}`)
    currentNodeKey.value = `third-${thirdCategoryId.value}`
  }
  if (fourthCategoryId.value) {
    keys.push(`fourth-${fourthCategoryId.value}`)
    currentNodeKey.value = `fourth-${fourthCategoryId.value}`
  }
  expandedKeys.value = keys
}

// 监听路由变化
watch(() => route.params, () => {
  updateExpandedKeys()
}, { immediate: true })

onMounted(() => {
  updateExpandedKeys()
})
</script>

<style scoped>
.product-category-page {
  min-height: 100vh;
  background: #f5f7fa;
}

.breadcrumb-container {
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
  padding: 16px 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-container {
  max-width: 1400px;
  margin: 30px auto;
  padding: 0 20px;
  display: flex;
  gap: 30px;
}

.sidebar {
  width: 300px;
  flex-shrink: 0;
}

.category-tree-wrapper {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  position: sticky;
  top: 100px;
}

.category-tree-wrapper h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.category-tree {
  border: none;
}

.tree-node-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.main-content {
  flex: 1;
}

.category-header {
  margin-bottom: 30px;
}

.category-info {
  display: flex;
  gap: 30px;
  align-items: center;
}

.category-image {
  width: 200px;
  height: 200px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
}

.category-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.category-details h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 16px;
  color: #1a1a1a;
}

.category-desc {
  font-size: 16px;
  color: #666;
  line-height: 1.8;
}

.sub-categories-section,
.products-section {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.sub-categories-section h2,
.products-section h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #1a1a1a;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.product-count {
  color: #666;
  font-size: 14px;
}

.sub-categories-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.sub-category-card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  gap: 16px;
}

.sub-category-card:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
  transform: translateY(-2px);
}

.sub-image {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 6px;
  overflow: hidden;
}

.sub-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sub-info {
  flex: 1;
}

.sub-info h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.sub-info p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 12px;
}

.sub-link {
  color: #1890ff;
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.product-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.product-card:hover {
  border-color: #1890ff;
  box-shadow: 0 8px 16px rgba(24, 144, 255, 0.15);
  transform: translateY(-4px);
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
  transform: scale(1.1);
}

.product-info {
  padding: 20px;
}

.product-info h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.product-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 16px;
  height: 44px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

@media (max-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-container {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
  }
  
  .products-grid,
  .sub-categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>
