<template>
  <div class="lazy-image-container" :style="containerStyle">
    <transition name="fade">
      <img
        v-if="isLoaded"
        :src="currentSrc"
        :alt="alt"
        :class="['lazy-image', imageClass, { 'lazy-image-loaded': isLoaded }]"
        :style="imageStyle"
        @load="onLoad"
        @error="onError"
      />
    </transition>
    
    <!-- 占位符或加载动画 -->
    <div v-if="!isLoaded && !error" class="lazy-image-placeholder">
      <el-skeleton :loading="true" animated>
        <template #template>
          <el-skeleton-item variant="image" :style="{ width: '100%', height: '100%' }" />
        </template>
      </el-skeleton>
    </div>
    
    <!-- 错误占位符 -->
    <div v-if="error" class="lazy-image-error">
      <el-icon><PictureFilled /></el-icon>
      <span>图片加载失败</span>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'

export default {
  name: 'LazyImage',
  props: {
    // 图片源
    src: {
      type: String,
      required: true
    },
    // 占位图
    placeholder: {
      type: String,
      default: ''
    },
    // 图片描述
    alt: {
      type: String,
      default: ''
    },
    // 容器样式
    containerStyle: {
      type: Object,
      default: () => ({})
    },
    // 图片样式
    imageStyle: {
      type: Object,
      default: () => ({})
    },
    // 图片类名
    imageClass: {
      type: String,
      default: ''
    },
    // 懒加载阈值
    threshold: {
      type: Number,
      default: 0.01
    },
    // 是否立即加载（不使用懒加载）
    eager: {
      type: Boolean,
      default: false
    }
  },
  emits: ['load', 'error'],
  setup(props, { emit }) {
    const isLoaded = ref(false)
    const error = ref(false)
    const currentSrc = ref(props.placeholder)
    let observer = null
    const imageElement = ref(null)

    // 加载图片
    const loadImage = () => {
      if (isLoaded.value || error.value) return
      
      const img = new Image()
      img.src = props.src
      
      img.onload = () => {
        currentSrc.value = props.src
        isLoaded.value = true
        emit('load')
      }
      
      img.onerror = () => {
        error.value = true
        emit('error')
      }
    }

    // 交叉观察器回调
    const onIntersect = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          loadImage()
          if (observer) {
            observer.disconnect()
          }
        }
      })
    }

    onMounted(() => {
      if (props.eager) {
        // 立即加载
        loadImage()
      } else {
        // 使用 IntersectionObserver 实现懒加载
        if ('IntersectionObserver' in window) {
          observer = new IntersectionObserver(onIntersect, {
            threshold: props.threshold,
            rootMargin: '50px' // 提前50px开始加载
          })
          
          // 观察容器元素
          const container = imageElement.value?.$el || imageElement.value
          if (container) {
            observer.observe(container)
          }
        } else {
          // 不支持 IntersectionObserver，直接加载
          loadImage()
        }
      }
    })

    onUnmounted(() => {
      if (observer) {
        observer.disconnect()
      }
    })

    const onLoad = () => {
      isLoaded.value = true
    }

    const onError = () => {
      error.value = true
    }

    return {
      isLoaded,
      error,
      currentSrc,
      imageElement,
      onLoad,
      onError
    }
  }
}
</script>

<style scoped>
.lazy-image-container {
  position: relative;
  overflow: hidden;
  background-color: #f5f7fa;
}

.lazy-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.lazy-image-loaded {
  opacity: 1;
}

.lazy-image-placeholder,
.lazy-image-error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.lazy-image-error {
  flex-direction: column;
  color: #909399;
  font-size: 14px;
}

.lazy-image-error .el-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

/* 淡入动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
