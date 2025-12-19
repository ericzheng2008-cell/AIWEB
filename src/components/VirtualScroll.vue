<template>
  <div 
    class="virtual-scroll-container" 
    :style="{ height: containerHeight + 'px' }"
    @scroll="handleScroll"
    ref="containerRef"
  >
    <div 
      class="virtual-scroll-phantom" 
      :style="{ height: totalHeight + 'px' }"
    ></div>
    <div 
      class="virtual-scroll-content" 
      :style="{ transform: `translateY(${offsetY}px)` }"
    >
      <slot 
        :visibleData="visibleData"
        :startIndex="startIndex"
        :endIndex="endIndex"
      ></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { rafThrottle } from '@/utils/performance'

// Props
const props = defineProps({
  // 数据源
  data: {
    type: Array,
    required: true,
    default: () => []
  },
  // 每项高度
  itemHeight: {
    type: Number,
    default: 50
  },
  // 容器高度
  containerHeight: {
    type: Number,
    default: 600
  },
  // 缓冲区项目数
  buffer: {
    type: Number,
    default: 5
  }
})

// 响应式数据
const containerRef = ref(null)
const scrollTop = ref(0)
const startIndex = ref(0)
const endIndex = ref(0)
const offsetY = ref(0)

// 计算属性
const totalHeight = computed(() => props.data.length * props.itemHeight)

const visibleCount = computed(() => Math.ceil(props.containerHeight / props.itemHeight))

const visibleData = computed(() => {
  return props.data.slice(startIndex.value, endIndex.value + 1)
})

// 方法
const calculateVisibleRange = () => {
  const start = Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.buffer)
  const end = Math.min(
    props.data.length - 1,
    start + visibleCount.value + props.buffer * 2
  )
  
  startIndex.value = start
  endIndex.value = end
  offsetY.value = start * props.itemHeight
}

// 使用RAF节流优化滚动性能
const handleScroll = rafThrottle((event) => {
  scrollTop.value = event.target.scrollTop
  calculateVisibleRange()
})

// 监听数据变化
watch(() => props.data, () => {
  calculateVisibleRange()
}, { deep: true })

// 初始化
onMounted(() => {
  calculateVisibleRange()
})

// 暴露方法给父组件
defineExpose({
  scrollTo: (index) => {
    if (containerRef.value) {
      containerRef.value.scrollTop = index * props.itemHeight
    }
  },
  scrollToTop: () => {
    if (containerRef.value) {
      containerRef.value.scrollTop = 0
    }
  }
})
</script>

<style scoped>
.virtual-scroll-container {
  overflow-y: auto;
  position: relative;
}

.virtual-scroll-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.virtual-scroll-content {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}
</style>
