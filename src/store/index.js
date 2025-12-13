import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 导入其他store模块
export { useFaultTrackingStore } from './faultTracking'
export { useEquipmentLifecycleStore } from './equipmentLifecycle'
export { useCostOptimizationStore } from './costOptimization'


export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || '')
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo') || '{}'))

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => userInfo.value.role === 'admin')

  function setToken(newToken) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function setUserInfo(info) {
    userInfo.value = info
    localStorage.setItem('userInfo', JSON.stringify(info))
  }

  function logout() {
    token.value = ''
    userInfo.value = {}
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    isAdmin,
    setToken,
    setUserInfo,
    logout
  }
})

export const useContentStore = defineStore('content', () => {
  const siteConfig = ref({
    siteName: '企业营销平台',
    logo: '/logo.png',
    description: '专业的企业级营销获客解决方案',
    keywords: '营销,获客,电商,推广'
  })

  const banners = ref([])
  const products = ref([])
  const promotions = ref([])

  function updateSiteConfig(config) {
    siteConfig.value = { ...siteConfig.value, ...config }
  }

  function setBanners(data) {
    banners.value = data
  }

  function setProducts(data) {
    products.value = data
  }

  function setPromotions(data) {
    promotions.value = data
  }

  return {
    siteConfig,
    banners,
    products,
    promotions,
    updateSiteConfig,
    setBanners,
    setProducts,
    setPromotions
  }
})
