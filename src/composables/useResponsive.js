/**
 * 响应式布局组合式函数
 * 提供移动端检测、断点判断、屏幕方向等功能
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { debounce } from '@/utils/performance'

export function useResponsive() {
  const windowWidth = ref(window.innerWidth)
  const windowHeight = ref(window.innerHeight)
  
  // 更新窗口尺寸
  const updateSize = debounce(() => {
    windowWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight
  }, 200)
  
  // 断点定义
  const breakpoints = {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
    xxl: 1600
  }
  
  // 是否移动设备
  const isMobile = computed(() => windowWidth.value < breakpoints.md)
  
  // 是否平板设备
  const isTablet = computed(() => 
    windowWidth.value >= breakpoints.md && windowWidth.value < breakpoints.lg
  )
  
  // 是否桌面设备
  const isDesktop = computed(() => windowWidth.value >= breakpoints.lg)
  
  // 当前断点
  const currentBreakpoint = computed(() => {
    const width = windowWidth.value
    if (width < breakpoints.sm) return 'xs'
    if (width < breakpoints.md) return 'sm'
    if (width < breakpoints.lg) return 'md'
    if (width < breakpoints.xl) return 'lg'
    if (width < breakpoints.xxl) return 'xl'
    return 'xxl'
  })
  
  // 屏幕方向
  const orientation = computed(() => 
    windowWidth.value > windowHeight.value ? 'landscape' : 'portrait'
  )
  
  // 是否小屏幕
  const isSmallScreen = computed(() => windowWidth.value < breakpoints.md)
  
  // 响应式列数
  const responsiveColumns = computed(() => {
    if (isMobile.value) return 1
    if (isTablet.value) return 2
    if (windowWidth.value < breakpoints.xl) return 3
    return 4
  })
  
  // 响应式间距
  const responsiveGutter = computed(() => {
    if (isMobile.value) return 12
    if (isTablet.value) return 16
    return 20
  })
  
  // 生命周期
  onMounted(() => {
    window.addEventListener('resize', updateSize)
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', updateSize)
  })
  
  return {
    windowWidth,
    windowHeight,
    isMobile,
    isTablet,
    isDesktop,
    currentBreakpoint,
    orientation,
    isSmallScreen,
    responsiveColumns,
    responsiveGutter
  }
}

/**
 * 移动端触摸手势
 */
export function useTouchGestures(element) {
  const startX = ref(0)
  const startY = ref(0)
  const endX = ref(0)
  const endY = ref(0)
  
  const onTouchStart = (e) => {
    startX.value = e.touches[0].clientX
    startY.value = e.touches[0].clientY
  }
  
  const onTouchMove = (e) => {
    endX.value = e.touches[0].clientX
    endY.value = e.touches[0].clientY
  }
  
  const onTouchEnd = () => {
    const deltaX = endX.value - startX.value
    const deltaY = endY.value - startY.value
    
    // 判断滑动方向
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // 水平滑动
      if (deltaX > 50) {
        return 'swipe-right'
      } else if (deltaX < -50) {
        return 'swipe-left'
      }
    } else {
      // 垂直滑动
      if (deltaY > 50) {
        return 'swipe-down'
      } else if (deltaY < -50) {
        return 'swipe-up'
      }
    }
    
    return 'tap'
  }
  
  onMounted(() => {
    if (element.value) {
      element.value.addEventListener('touchstart', onTouchStart)
      element.value.addEventListener('touchmove', onTouchMove)
      element.value.addEventListener('touchend', onTouchEnd)
    }
  })
  
  onUnmounted(() => {
    if (element.value) {
      element.value.removeEventListener('touchstart', onTouchStart)
      element.value.removeEventListener('touchmove', onTouchMove)
      element.value.removeEventListener('touchend', onTouchEnd)
    }
  })
  
  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  }
}

export default useResponsive
