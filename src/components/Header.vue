<template>
  <header class="site-header">
    <div class="header-top">
      <div class="header-container">
        <div class="top-info">
          <span><el-icon><Phone /></el-icon> {{ t('header.hotline') }}：400-123-4567</span>
          <span><el-icon><Message /></el-icon> sales@mingsheng.com</span>
        </div>
        <div class="top-actions">
          <span @click="toggleLanguage" class="lang-switch">{{ t('header.language') }}</span>
        </div>
      </div>
    </div>
    
    <div class="header-main">
      <div class="header-container">
        <div class="logo" @click="$router.push('/')">
          <img v-if="siteConfig.logo" :src="siteConfig.logo" :alt="companyName" class="logo-image" />
          <div v-else class="logo-text">
            <h1>{{ companyName }}</h1>
            <p class="company-slogan">{{ companySlogan }}</p>
          </div>
        </div>
        
        <nav class="main-nav">
          <template v-for="navItem in visibleNavItems" :key="navItem.id">
            <!-- 有子菜单的导航项 -->
            <div v-if="navItem.children && navItem.children.length > 0" class="nav-item-dropdown">
              <span class="nav-link">
                {{ navItem.name[locale] || navItem.name['zh-CN'] }}
                <el-icon class="arrow-icon"><ArrowDown /></el-icon>
              </span>
              <div class="dropdown-menu">
                <router-link 
                  v-for="child in navItem.children.filter(c => c.visible)"
                  :key="child.id"
                  :to="child.path"
                  class="dropdown-item">
                  {{ child.name[locale] || child.name['zh-CN'] }}
                </router-link>
              </div>
            </div>
            <!-- 普通导航项 -->
            <router-link 
              v-else
              :to="navItem.path">
              {{ navItem.name[locale] || navItem.name['zh-CN'] }}
            </router-link>
          </template>
        </nav>

        <div class="header-actions">
          <el-icon class="search-icon" :size="20" @click="showSearch = !showSearch">
            <Search />
          </el-icon>
        </div>
      </div>
    </div>

    <!-- 搜索框 -->
    <div v-if="showSearch" class="search-panel">
      <div class="header-container">
        <el-input 
          v-model="searchQuery" 
          :placeholder="t('common.search')"
          class="search-input"
          size="large"
          @keyup.enter="handleSearch">
          <template #suffix>
            <el-icon class="el-input__icon" @click="handleSearch">
              <Search />
            </el-icon>
          </template>
        </el-input>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useCmsAdvancedStore } from '../store/cmsAdvanced'
import { usePageContentStore } from '../store/pageContent'

const router = useRouter()
const { t, locale } = useI18n()
const cmsStore = useCmsAdvancedStore()
const pageStore = usePageContentStore()

const searchQuery = ref('')
const showSearch = ref(false)
const currentLang = ref(locale.value)

// 从CMS获取配置
const siteConfig = computed(() => cmsStore.siteConfig)
const companyName = computed(() => siteConfig.value.companyName[locale.value] || siteConfig.value.companyName['zh-CN'])
const companySlogan = computed(() => siteConfig.value.slogan[locale.value] || siteConfig.value.slogan['zh-CN'])

// 获取可见的导航项
const visibleNavItems = computed(() => pageStore.visibleNavItems)

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/products', query: { search: searchQuery.value } })
    showSearch.value = false
    searchQuery.value = ''
  }
}

const toggleLanguage = () => {
  const newLocale = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN'
  locale.value = newLocale
  currentLang.value = newLocale
  localStorage.setItem('language', newLocale)
}
</script>

<style scoped>
.site-header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-top {
  background: #003366;
  color: #fff;
  font-size: 13px;
}

.header-top .header-container {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.top-info {
  display: flex;
  gap: 30px;
}

.top-info span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.top-actions {
  display: flex;
  gap: 20px;
}

.lang-switch {
  cursor: pointer;
  transition: opacity 0.3s;
}

.lang-switch:hover {
  opacity: 0.8;
}

.header-main {
  background: #fff;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-main .header-container {
  height: 80px;
}

.logo {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.logo-image {
  height: 60px;
  max-width: 200px;
  object-fit: contain;
}

.logo-text {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.logo-text h1 {
  font-size: 28px;
  font-weight: 700;
  color: #003366;
  letter-spacing: 2px;
}

.company-slogan {
  font-size: 12px;
  color: #666;
  font-weight: 400;
}

.main-nav {
  display: flex;
  gap: 36px;
  margin-left: auto;
  margin-right: 40px;
  align-items: center;
}

.main-nav a,
.nav-dropdown,
.nav-item-dropdown {
  color: #333;
  font-size: 15px;
  font-weight: 500;
  transition: color 0.3s;
  position: relative;
  padding: 8px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.nav-item-dropdown {
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: color 0.3s;
}

.arrow-icon {
  font-size: 12px;
  transition: transform 0.3s;
}

.nav-item-dropdown:hover .arrow-icon {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border-radius: 4px;
  padding: 8px 0;
  min-width: 160px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 100;
  margin-top: 8px;
}

.nav-item-dropdown:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  margin-top: 0;
}

.dropdown-item {
  display: block;
  padding: 10px 20px;
  color: #333;
  font-size: 14px;
  font-weight: 400;
  transition: all 0.3s;
  white-space: nowrap;
}

.dropdown-item:hover {
  background: #f5f7fa;
  color: #1890ff;
}

.dropdown-item.router-link-active {
  color: #1890ff;
  background: #e6f7ff;
}

.main-nav > a:hover,
.main-nav > a.router-link-active,
.nav-item-dropdown:hover .nav-link {
  color: #1890ff;
}

.main-nav > a.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #1890ff;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.search-icon {
  cursor: pointer;
  color: #666;
  transition: color 0.3s;
}

.search-icon:hover {
  color: #1890ff;
}

.search-panel {
  background: #f5f7fa;
  border-top: 1px solid #e8e8e8;
  padding: 20px 0;
}

.search-input {
  max-width: 600px;
  margin: 0 auto;
}
</style>
