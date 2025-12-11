<template>
  <div class="solution-category-page">
    <Header />
    
    <!-- 面包屑导航 -->
    <div class="breadcrumb-container">
      <div class="container">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">{{ t('common.home') }}</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/solutions' }">{{ t('common.solutions') }}</el-breadcrumb-item>
          <el-breadcrumb-item v-if="currentCategory">{{ currentCategory.name[locale] }}</el-breadcrumb-item>
          <el-breadcrumb-item v-if="currentSubCategory">{{ currentSubCategory.name[locale] }}</el-breadcrumb-item>
          <el-breadcrumb-item v-if="currentThirdCategory">{{ currentThirdCategory.name[locale] }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>

    <!-- 页面内容 -->
    <div class="page-container">
      <!-- 侧边栏：分类树 -->
      <aside class="sidebar">
        <div class="category-tree-wrapper">
          <h3>应用案例分类</h3>
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
                <el-tag :type="getLevelType(data.level)" size="small">{{ data.level }}级</el-tag>
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

        <!-- 子分类展示 -->
        <div v-if="hasSubCategories" class="sub-categories-section">
          <h2>{{ currentLevel === 1 ? '应用场景' : '具体案例分类' }}</h2>
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

        <!-- 案例列表 -->
        <div v-if="!hasSubCategories && cases.length > 0" class="cases-section">
          <div class="section-header">
            <h2>应用案例</h2>
            <span class="case-count">共 {{ cases.length }} 个案例</span>
          </div>
          <div class="cases-grid">
            <div 
              v-for="solutionCase in cases" 
              :key="solutionCase.id"
              class="case-card"
              @click="viewCaseDetail(solutionCase)">
              <div class="case-image">
                <img 
                  :src="solutionCase.images && solutionCase.images[0] || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400'" 
                  :alt="solutionCase.name[locale]" 
                />
              </div>
              <div class="case-info">
                <h3>{{ solutionCase.name[locale] }}</h3>
                <p class="case-desc">{{ solutionCase.description[locale] }}</p>
                <el-button type="primary" size="small">{{ t('common.viewDetails') }}</el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <el-empty 
          v-if="!hasSubCategories && cases.length === 0" 
          description="暂无案例"
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
import { usePageContentStore } from '../store/pageContent'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

const router = useRouter()
const route = useRoute()
const { t, locale } = useI18n()
const pageStore = usePageContentStore()

const expandedKeys = ref([])
const currentNodeKey = ref(null)

// 获取当前分类ID
const categoryId = computed(() => parseInt(route.params.categoryId) || null)
const subCategoryId = computed(() => parseInt(route.params.subCategoryId) || null)
const thirdCategoryId = computed(() => parseInt(route.params.thirdCategoryId) || null)

// 当前层级
const currentLevel = computed(() => {
  if (thirdCategoryId.value) return 3
  if (subCategoryId.value) return 2
  if (categoryId.value) return 1
  return 0
})

// 获取当前分类对象
const currentCategory = computed(() => {
  return pageStore.solutionCategories.find(c => c.id === categoryId.value)
})

const currentSubCategory = computed(() => {
  return pageStore.solutionSubCategories.find(s => s.id === subCategoryId.value)
})

const currentThirdCategory = computed(() => {
  return pageStore.solutionThirdCategories.find(t => t.id === thirdCategoryId.value)
})

// 当前显示的分类
const currentDisplayCategory = computed(() => {
  if (currentLevel.value === 3) return currentThirdCategory.value
  if (currentLevel.value === 2) return currentSubCategory.value
  if (currentLevel.value === 1) return currentCategory.value
  return null
})

// 获取子分类
const subCategories = computed(() => {
  if (currentLevel.value === 1) {
    return pageStore.solutionSubCategories.filter(s => s.parentId === categoryId.value)
  } else if (currentLevel.value === 2) {
    return pageStore.solutionThirdCategories.filter(t => t.parentId === subCategoryId.value)
  }
  return []
})

const hasSubCategories = computed(() => subCategories.value.length > 0)

// 获取案例
const cases = computed(() => {
  if (currentLevel.value === 3) {
    return pageStore.solutionCases.filter(c => c.thirdCategoryId === thirdCategoryId.value)
  } else if (currentLevel.value === 2) {
    return pageStore.solutionCases.filter(c => c.subCategoryId === subCategoryId.value)
  } else if (currentLevel.value === 1) {
    return pageStore.solutionCases.filter(c => c.categoryId === categoryId.value)
  }
  return []
})

// 构建分类树
const categoryTree = computed(() => {
  return pageStore.solutionCategories.map(cat => {
    const subs = pageStore.solutionSubCategories
      .filter(s => s.parentId === cat.id)
      .map(sub => {
        const thirds = pageStore.solutionThirdCategories
          .filter(t => t.parentId === sub.id)
          .map(third => ({
            id: `third-${third.id}`,
            label: third.name[locale.value] || third.name['zh-CN'],
            level: 3,
            realId: third.id,
            type: 'third',
            data: third
          }))
        
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

const getLevelType = (level) => {
  const types = { 1: 'danger', 2: 'warning', 3: 'success' }
  return types[level] || 'info'
}

const handleNodeClick = (data) => {
  if (data.type === 'category') {
    router.push(`/solution-category/${data.realId}`)
  } else if (data.type === 'sub') {
    const catId = pageStore.solutionSubCategories.find(s => s.id === data.realId)?.parentId
    router.push(`/solution-category/${catId}/${data.realId}`)
  } else if (data.type === 'third') {
    const subId = pageStore.solutionThirdCategories.find(t => t.id === data.realId)?.parentId
    const catId = pageStore.solutionSubCategories.find(s => s.id === subId)?.parentId
    router.push(`/solution-category/${catId}/${subId}/${data.realId}`)
  }
}

const navigateToCategory = (category) => {
  if (currentLevel.value === 1) {
    router.push(`/solution-category/${categoryId.value}/${category.id}`)
  } else if (currentLevel.value === 2) {
    router.push(`/solution-category/${categoryId.value}/${subCategoryId.value}/${category.id}`)
  }
}

const viewCaseDetail = (solutionCase) => {
  // 跳转到案例详情页
  router.push(`/solution/${solutionCase.id}`)
}

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
  expandedKeys.value = keys
}

watch(() => route.params, () => {
  updateExpandedKeys()
}, { immediate: true })

onMounted(() => {
  updateExpandedKeys()
})
</script>

<style scoped>
/* 与ProductCategory.vue相同的样式 */
.solution-category-page {
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
.cases-section {
  background: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.sub-categories-section h2,
.cases-section h2 {
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

.case-count {
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

.cases-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.case-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.case-card:hover {
  border-color: #1890ff;
  box-shadow: 0 8px 16px rgba(24, 144, 255, 0.15);
  transform: translateY(-4px);
}

.case-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.case-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.case-card:hover .case-image img {
  transform: scale(1.1);
}

.case-info {
  padding: 20px;
}

.case-info h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.case-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 16px;
  height: 44px;
  overflow: hidden;
}
</style>
