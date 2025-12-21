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
              <span>🌐 {{ currentLanguage.name }}</span>
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
          <!-- 索取报价按钮 -->
          <el-button 
            type="primary" 
            class="quote-btn" 
            @click="showQuoteDialog = true">
            <el-icon><ChatDotRound /></el-icon>
            {{ t('header.requestQuote') }}
          </el-button>
          
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
    
    <!-- 索取报价弹窗 (复用MaterialDownload的注册功能) -->
    <el-dialog
      v-model="showQuoteDialog"
      :title="t('header.requestQuoteTitle')"
      width="500px"
      :close-on-click-modal="false"
      class="quote-dialog">
      
      <el-form 
        ref="quoteFormRef" 
        :model="quoteForm" 
        :rules="quoteRules"
        label-width="100px">
        
        <el-alert
          :title="t('header.quoteNotice')"
          type="info"
          :closable="false"
          style="margin-bottom: 20px" />

        <el-form-item :label="t('materials.form.name')" prop="name">
          <el-input 
            v-model="quoteForm.name" 
            :placeholder="t('materials.form.namePlaceholder')"
            clearable />
        </el-form-item>

        <el-form-item :label="t('materials.form.company')" prop="company">
          <el-input 
            v-model="quoteForm.company" 
            :placeholder="t('materials.form.companyPlaceholder')"
            clearable />
        </el-form-item>

        <el-form-item :label="t('materials.form.phone')" prop="phone">
          <el-input 
            v-model="quoteForm.phone" 
            :placeholder="t('materials.form.phonePlaceholder')"
            clearable />
        </el-form-item>

        <el-form-item :label="t('materials.form.email')" prop="email">
          <el-input 
            v-model="quoteForm.email" 
            :placeholder="t('materials.form.emailPlaceholder')"
            clearable />
        </el-form-item>
        
        <el-form-item :label="t('header.quoteProduct')" prop="product">
          <el-input 
            v-model="quoteForm.product" 
            type="textarea"
            :rows="3"
            :placeholder="t('header.quoteProductPlaceholder')"
            clearable />
        </el-form-item>

        <el-form-item :label="t('materials.form.captcha')" prop="captcha">
          <div class="captcha-container">
            <el-input 
              v-model="quoteForm.captcha" 
              :placeholder="t('materials.form.captchaPlaceholder')"
              style="width: 200px" />
            <div class="captcha-code" @click="refreshQuoteCaptcha">
              <canvas ref="quoteCaptchaCanvas" width="120" height="40"></canvas>
            </div>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showQuoteDialog = false">
          {{ t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="submitQuoteRequest" :loading="quoteSubmitting">
          {{ t('common.submit') }}
        </el-button>
      </template>
    </el-dialog>
  </header>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { supportedLanguages } from '../i18n'
import { useCmsAdvancedStore } from '../store/cmsAdvanced'
import { usePageContentStore } from '../store/pageContent'
import { useMaterialDownloadStore } from '../store/materialDownload'
import { 
  Phone, Message, ArrowDown, Check, Search, Menu, Close, ChatDotRound 
} from '@element-plus/icons-vue'

const router = useRouter()
const { t, locale } = useI18n()
const cmsStore = useCmsAdvancedStore()
const pageStore = usePageContentStore()
const materialStore = useMaterialDownloadStore()

const searchQuery = ref('')
const showSearch = ref(false)
const currentLang = ref(locale.value)
const showMobileMenu = ref(false)
const activeMobileSubmenu = ref(null)

// 索取报价相关
const showQuoteDialog = ref(false)
const quoteSubmitting = ref(false)
const quoteFormRef = ref(null)
const quoteCaptchaCanvas = ref(null)
const quoteCaptchaCode = ref('')

// 报价表单
const quoteForm = ref({
  name: '',
  company: '',
  phone: '',
  email: '',
  product: '',
  captcha: ''
})

// 报价表单验证规则
const quoteRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  company: [
    { required: true, message: '请输入公司名称', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  product: [
    { required: true, message: '请输入产品或服务需求', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (value.toLowerCase() !== quoteCaptchaCode.value.toLowerCase()) {
          callback(new Error('验证码不正确'))
        } else {
          callback()
        }
      }, 
      trigger: 'blur' 
    }
  ]
}

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

// 生成验证码
const generateQuoteCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// 绘制验证码
const drawQuoteCaptcha = () => {
  nextTick(() => {
    if (!quoteCaptchaCanvas.value) return
    
    const ctx = quoteCaptchaCanvas.value.getContext('2d')
    const width = quoteCaptchaCanvas.value.width
    const height = quoteCaptchaCanvas.value.height
    
    // 清空画布
    ctx.clearRect(0, 0, width, height)
    
    // 背景
    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(0, 0, width, height)
    
    // 干扰线
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`
      ctx.beginPath()
      ctx.moveTo(Math.random() * width, Math.random() * height)
      ctx.lineTo(Math.random() * width, Math.random() * height)
      ctx.stroke()
    }
    
    // 验证码文字
    quoteCaptchaCode.value = generateQuoteCaptcha()
    ctx.font = 'bold 24px Arial'
    ctx.textBaseline = 'middle'
    
    for (let i = 0; i < quoteCaptchaCode.value.length; i++) {
      ctx.fillStyle = `rgb(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100})`
      ctx.save()
      ctx.translate(20 + i * 25, height / 2)
      ctx.rotate((Math.random() - 0.5) * 0.3)
      ctx.fillText(quoteCaptchaCode.value[i], 0, 0)
      ctx.restore()
    }
    
    // 干扰点
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`
      ctx.beginPath()
      ctx.arc(Math.random() * width, Math.random() * height, 1, 0, 2 * Math.PI)
      ctx.fill()
    }
  })
}

// 刷新验证码
const refreshQuoteCaptcha = () => {
  drawQuoteCaptcha()
}

// 提交报价请求
const submitQuoteRequest = async () => {
  if (!quoteFormRef.value) return
  
  await quoteFormRef.value.validate((valid) => {
    if (valid) {
      quoteSubmitting.value = true
      
      const userInfo = {
        name: quoteForm.value.name,
        company: quoteForm.value.company,
        phone: quoteForm.value.phone,
        email: quoteForm.value.email,
        product: quoteForm.value.product,
        purpose: 'quote'
      }
      
      // 注册用户（报价请求）
      materialStore.registerUser(userInfo)
      
      setTimeout(() => {
        quoteSubmitting.value = false
        showQuoteDialog.value = false
        ElMessage.success(t('header.quoteSuccess'))
        
        // 重置表单
        quoteFormRef.value.resetFields()
      }, 1000)
    }
  })
}

// 监听报价弹窗打开，绘制验证码
watch(() => showQuoteDialog.value, (val) => {
  if (val) {
    nextTick(() => {
      drawQuoteCaptcha()
    })
  }
})

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

/* 索取报价按钮 */
.quote-btn {
  height: 40px;
  padding: 0 24px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.25);
  transition: all 0.3s;
}

.quote-btn:hover {
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.35);
  transform: translateY(-2px);
}

.search-icon {
  cursor: pointer;
  color: #666;
  transition: color 0.3s;
}

.search-icon:hover {
  color: #1890ff;
}

/* 索取报价弹窗样式 */
.quote-dialog .el-dialog__header {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  color: white;
  padding: 20px 24px;
}

.quote-dialog .el-dialog__title {
  color: white;
  font-size: 20px;
  font-weight: 600;
}

.captcha-container {
  display: flex;
  gap: 12px;
  align-items: center;
}

.captcha-code {
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #dcdfe6;
  transition: all 0.3s;
}

.captcha-code:hover {
  border-color: #1890ff;
  box-shadow: 0 0 8px rgba(24, 144, 255, 0.3);
}

.captcha-code canvas {
  display: block;
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
