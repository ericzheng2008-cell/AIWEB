<template>
  <img
    :src="currentSrc"
    :srcset="srcsetValue"
    :sizes="sizesValue"
    :alt="alt"
    :loading="loading"
    :class="['optimized-image', imageClass, { loaded: isLoaded, error: hasError }]"
    @load="handleLoad"
    @error="handleError"
  />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  // 图片源地址
  src: {
    type: String,
    required: true
  },
  // 替代文本
  alt: {
    type: String,
    default: ''
  },
  // 懒加载模式
  loading: {
    type: String,
    default: 'lazy', // 'lazy' | 'eager'
    validator: (value) => ['lazy', 'eager'].includes(value)
  },
  // 图片宽度（用于生成响应式图片）
  width: {
    type: Number,
    default: null
  },
  // 图片质量 (1-100)
  quality: {
    type: Number,
    default: 80,
    validator: (value) => value >= 1 && value <= 100
  },
  // 图片格式
  format: {
    type: String,
    default: 'webp',
    validator: (value) => ['webp', 'jpg', 'png'].includes(value)
  },
  // 备用图片
  fallback: {
    type: String,
    default: '/images/placeholder.png'
  },
  // 自定义CSS类
  imageClass: {
    type: String,
    default: ''
  },
  // 是否启用响应式图片
  responsive: {
    type: Boolean,
    default: true
  },
  // 自定义srcset
  srcset: {
    type: String,
    default: null
  },
  // 自定义sizes
  sizes: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['load', 'error'])

const isLoaded = ref(false)
const hasError = ref(false)
const currentSrc = ref(props.src)

// 生成响应式图片集
const srcsetValue = computed(() => {
  if (props.srcset) {
    return props.srcset
  }

  if (!props.responsive || !props.src) {
    return ''
  }

  // 如果是外部图片（如 unsplash），返回原图
  if (props.src.startsWith('http://') || props.src.startsWith('https://')) {
    const widths = [400, 800, 1200]
    return widths.map(w => {
      const url = new URL(props.src)
      url.searchParams.set('w', w)
      url.searchParams.set('q', props.quality)
      return `${url.href} ${w}w`
    }).join(', ')
  }

  // 本地图片生成不同尺寸
  const widths = [400, 800, 1200]
  return widths.map(w => `${props.src}?w=${w} ${w}w`).join(', ')
})

// sizes属性
const sizesValue = computed(() => {
  if (props.sizes) {
    return props.sizes
  }

  if (props.width) {
    return `${props.width}px`
  }

  return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 800px'
})

// 图片加载成功
const handleLoad = (event) => {
  isLoaded.value = true
  hasError.value = false
  emit('load', event)
}

// 图片加载失败
const handleError = (event) => {
  console.warn('[OptimizedImage] 图片加载失败:', props.src)
  hasError.value = true
  
  // 使用备用图片
  if (currentSrc.value !== props.fallback) {
    currentSrc.value = props.fallback
  }
  
  emit('error', event)
}

// 预加载关键图片
onMounted(() => {
  if (props.loading === 'eager' && !isLoaded.value) {
    const img = new Image()
    img.src = props.src
    img.onload = () => {
      isLoaded.value = true
    }
  }
})
</script>

<style scoped>
.optimized-image {
  display: block;
  width: 100%;
  height: auto;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.optimized-image.loaded {
  opacity: 1;
}

.optimized-image.error {
  opacity: 0.5;
  filter: grayscale(100%);
}

/* 加载时的占位效果 */
.optimized-image:not(.loaded):not(.error) {
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
