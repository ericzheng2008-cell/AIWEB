<template>
  <header class="site-header">
    <div class="header-top">
      <div class="header-container">
        <div class="top-info">
          <span><el-icon><Phone /></el-icon> {{ t('header.hotline') }}：400-123-4567</span>
          <span><el-icon><Message /></el-icon> sales@mingsheng.com</span>
        </div>
        <div class="top-actions">
          <!-- 多语言切换器 -->
          <el-dropdown @command="changeLanguage" trigger="click" class="lang-dropdown">
            <span class="lang-switch">
              <el-icon><Globe /></el-icon>
              <span>{{ currentLanguage.name }}</span>
              <el-icon class="arrow"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item 
                  v-for="lang in supportedLanguages" 
                  :key="lang.code"
                  :command="lang.code"
                  :class="{ active: locale === lang.code }">
                  <span class="lang-flag">{{ lang.flag }}</span>
                  <span>{{ lang.name }}</span>
                  <el-icon v-if="locale === lang.code" class="check-icon"><Check /></el-icon>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
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
            <div 
              v-if="navItem.children && navItem.children.length > 0" 
              class="nav-item-dropdown"
              :data-has-many-children="navItem.children.length > 4">
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
          <!-- 移动端菜单按钮 -->
          <el-icon class="mobile-menu-toggle" :size="24" @click="showMobileMenu = !showMobileMenu">
            <Menu v-if="!showMobileMenu" />
            <Close v-else />
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

    <!-- 移动端菜单 -->
    <transition name="mobile-menu-fade">
      <div v-if="showMobileMenu" class="mobile-menu-overlay" @click="showMobileMenu = false">
        <div class="mobile-menu" @click.stop>
          <div class="mobile-menu-header">
            <h3>{{ t('common.menu') }}</h3>
            <el-icon :size="24" @click="showMobileMenu = false">
              <Close />
            </el-icon>
          </div>
          <nav class="mobile-nav">
            <template v-for="navItem in visibleNavItems" :key="navItem.id">
              <!-- 有子菜单的导航项 -->
              <div v-if="navItem.children && navItem.children.length > 0" class="mobile-nav-group">
                <div class="mobile-nav-parent" @click="toggleMobileSubmenu(navItem.id)">
                  <span>{{ navItem.name[locale] || navItem.name['zh-CN'] }}</span>
                  <el-icon :class="{ 'rotate': activeMobileSubmenu === navItem.id }">
                    <ArrowDown />
                  </el-icon>
                </div>
                <transition name="submenu-slide">
                  <div v-if="activeMobileSubmenu === navItem.id" class="mobile-submenu">
                    <router-link 
                      v-for="child in navItem.children.filter(c => c.visible)"
                      :key="child.id"
                      :to="child.path"
                      class="mobile-submenu-item"
                      @click="showMobileMenu = false">
                      {{ child.name[locale] || child.name['zh-CN'] }}
                    </router-link>
                  </div>
                </transition>
              </div>
              <!-- 普通导航项 -->
              <router-link 
                v-else
                :to="navItem.path"
                class="mobile-nav-item"
                @click="showMobileMenu = false">
                {{ navItem.name[locale] || navItem.name['zh-CN'] }}
              </router-link>
            </template>
          </nav>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { supportedLanguages } from '../i18n'
import { useCmsAdvancedStore } from '../store/cmsAdvanced'
import { usePageContentStore } from '../store/pageContent'
import { 
  Phone, Message, Globe, ArrowDown, Check, Search, Menu, Close 
} from '@element-plus/icons-vue'

const router = useRouter()
const { t, locale } = useI18n()
const cmsStore = useCmsAdvancedStore()
const pageStore = usePageContentStore()

const searchQuery = ref('')
const showSearch = ref(false)
const currentLang = ref(locale.value)
const showMobileMenu = ref(false)
const activeMobileSubmenu = ref(null)

// 从CMS获取配置
const siteConfig = computed(() => cmsStore.siteConfig)
const companyName = computed(() => siteConfig.value.companyName[locale.value] || siteConfig.value.companyName['zh-CN'])
const companySlogan = computed(() => siteConfig.value.slogan[locale.value] || siteConfig.value.slogan['zh-CN'])

// 获取可见的导航项
const visibleNavItems = computed(() => pageStore.visibleNavItems)

// 当前语言信息
const currentLanguage = computed(() => {
  return supportedLanguages.find(lang => lang.code === locale.value) || supportedLanguages[0]
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/products', query: { search: searchQuery.value } })
    showSearch.value = false
    searchQuery.value = ''
  }
}

// 切换语言
const changeLanguage = (langCode) => {
  locale.value = langCode
  currentLang.value = langCode
  localStorage.setItem('language', langCode)
}

// 旧的切换方法（保留兼容性）
const toggleLanguage = () => {
  const newLocale = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN'
  changeLanguage(newLocale)
}

const toggleMobileSubmenu = (id) => {
  activeMobileSubmenu.value = activeMobileSubmenu.value === id ? null : id
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
  align-items: center;
}

/* 多语言下拉菜单 */
.lang-dropdown {
  cursor: pointer;
}

.lang-switch {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 13px;
  background: rgba(255, 255, 255, 0.1);
}

.lang-switch:hover {
  background: rgba(255, 255, 255, 0.2);
}

.lang-switch .arrow {
  font-size: 12px;
  transition: transform 0.3s;
}

.lang-dropdown:hover .lang-switch .arrow {
  transform: rotate(180deg);
}

/* 语言下拉项 */
:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
}

:deep(.el-dropdown-menu__item.active) {
  background: #f0f0f0;
  color: #667eea;
  font-weight: 500;
}

.lang-flag {
  font-size: 18px;
}

.check-icon {
  margin-left: auto;
  color: #667eea;
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
  border-radius: 8px;
  padding: 12px 0;
  min-width: 200px;
  max-width: 400px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 100;
  margin-top: 8px;
  border: 1px solid #e8e8e8;
}

/* 针对子菜单较多的导航项，使用多列布局 */
.nav-item-dropdown[data-has-many-children="true"] .dropdown-menu {
  min-width: 360px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  padding: 16px 8px;
}

.nav-item-dropdown:hover .dropdown-menu {
  opacity: 1;
  visibility: visible;
  margin-top: 0;
}

.dropdown-item {
  display: block;
  padding: 12px 20px;
  color: #333;
  font-size: 14px;
  font-weight: 400;
  transition: all 0.3s;
  white-space: nowrap;
  border-radius: 4px;
  margin: 0 4px;
}

.dropdown-item:hover {
  background: #f0f5ff;
  color: #1890ff;
  transform: translateX(4px);
}

.dropdown-item.router-link-active {
  color: #1890ff;
  background: #e6f7ff;
  font-weight: 500;
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

/* ================================================
   移动端菜单按钮 - 默认隐藏
   ================================================ */
.mobile-menu-toggle {
  display: none;
  cursor: pointer;
  color: #666;
  transition: color 0.3s;
}

.mobile-menu-toggle:hover {
  color: #1890ff;
}

/* ================================================
   移动端菜单
   ================================================ */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  display: none;
}

.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 80%;
  max-width: 320px;
  background: #fff;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e8e8e8;
}

.mobile-menu-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.mobile-menu-header .el-icon {
  cursor: pointer;
  color: #666;
}

.mobile-nav {
  padding: 10px 0;
}

.mobile-nav-item,
.mobile-nav-parent {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  color: #333;
  font-size: 15px;
  font-weight: 500;
  transition: all 0.3s;
  cursor: pointer;
}

.mobile-nav-item:hover,
.mobile-nav-parent:hover {
  background: #f0f5ff;
  color: #1890ff;
}

.mobile-nav-item.router-link-active {
  color: #1890ff;
  background: #e6f7ff;
}

.mobile-nav-parent .el-icon {
  transition: transform 0.3s;
}

.mobile-nav-parent .el-icon.rotate {
  transform: rotate(180deg);
}

.mobile-submenu {
  background: #f9f9f9;
}

.mobile-submenu-item {
  display: block;
  padding: 12px 20px 12px 40px;
  color: #666;
  font-size: 14px;
  transition: all 0.3s;
}

.mobile-submenu-item:hover {
  background: #f0f5ff;
  color: #1890ff;
}

.mobile-submenu-item.router-link-active {
  color: #1890ff;
  background: #e6f7ff;
}

/* 移动端菜单动画 */
.mobile-menu-fade-enter-active,
.mobile-menu-fade-leave-active {
  transition: opacity 0.3s;
}

.mobile-menu-fade-enter-from,
.mobile-menu-fade-leave-to {
  opacity: 0;
}

.mobile-menu-fade-enter-active .mobile-menu,
.mobile-menu-fade-leave-active .mobile-menu {
  transition: transform 0.3s;
}

.mobile-menu-fade-enter-from .mobile-menu,
.mobile-menu-fade-leave-to .mobile-menu {
  transform: translateX(100%);
}

/* 子菜单滑动动画 */
.submenu-slide-enter-active,
.submenu-slide-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.submenu-slide-enter-from,
.submenu-slide-leave-to {
  max-height: 0;
  opacity: 0;
}

.submenu-slide-enter-to,
.submenu-slide-leave-from {
  max-height: 500px;
  opacity: 1;
}

/* ================================================
   响应式设计
   ================================================ */

/* 移动端优化 (<= 1024px) */
@media screen and (max-width: 1024px) {
  /* 显示移动端菜单按钮 */
  .mobile-menu-toggle {
    display: block;
  }

  /* 隐藏桌面导航 */
  .main-nav {
    display: none;
  }

  /* 显示移动端菜单 */
  .mobile-menu-overlay {
    display: block;
  }

  /* 优化header高度 */
  .header-main .header-container {
    height: 60px;
  }

  /* 优化logo */
  .logo-image {
    height: 40px;
  }

  .logo-text h1 {
    font-size: 20px;
  }

  .company-slogan {
    font-size: 11px;
  }

  /* 隐藏顶部信息栏 */
  .header-top {
    display: none;
  }
}

/* 平板横屏 (768px - 1024px landscape) */
@media screen and (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
  .main-nav {
    display: flex;
    gap: 20px;
  }

  .mobile-menu-toggle {
    display: none;
  }

  .mobile-menu-overlay {
    display: none;
  }
}

/* 桌面设备 (>= 1025px) */
@media screen and (min-width: 1025px) {
  .mobile-menu-overlay {
    display: none !important;
  }

  .mobile-menu-toggle {
    display: none !important;
  }
}

</style>
