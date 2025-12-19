/**
 * 性能优化工具库
 * 包含防抖、节流、虚拟滚动、懒加载等性能优化方法
 */

/**
 * 防抖函数 - 延迟执行
 * @param {Function} fn - 要执行的函数
 * @param {Number} delay - 延迟时间(ms)
 * @returns {Function}
 */
export function debounce(fn, delay = 300) {
  let timer = null
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数 - 限制执行频率
 * @param {Function} fn - 要执行的函数
 * @param {Number} delay - 间隔时间(ms)
 * @returns {Function}
 */
export function throttle(fn, delay = 300) {
  let lastTime = 0
  return function(...args) {
    const now = Date.now()
    if (now - lastTime >= delay) {
      fn.apply(this, args)
      lastTime = now
    }
  }
}

/**
 * 请求动画帧节流
 * @param {Function} fn - 要执行的函数
 * @returns {Function}
 */
export function rafThrottle(fn) {
  let requestId = null
  return function(...args) {
    if (requestId) return
    requestId = requestAnimationFrame(() => {
      fn.apply(this, args)
      requestId = null
    })
  }
}

/**
 * 懒加载图片
 * @param {String} selector - 图片选择器
 * @param {Object} options - IntersectionObserver选项
 */
export function lazyLoadImages(selector = 'img[data-src]', options = {}) {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target
        const src = img.dataset.src
        if (src) {
          img.src = src
          img.removeAttribute('data-src')
          observer.unobserve(img)
        }
      }
    })
  }, { ...defaultOptions, ...options })
  
  const images = document.querySelectorAll(selector)
  images.forEach(img => observer.observe(img))
  
  return observer
}

/**
 * 虚拟滚动计算
 * @param {Object} params
 * @returns {Object}
 */
export function calculateVirtualScroll(params) {
  const {
    scrollTop = 0,
    containerHeight = 0,
    itemHeight = 50,
    totalItems = 0,
    buffer = 5 // 缓冲区项目数
  } = params
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer)
  const visibleCount = Math.ceil(containerHeight / itemHeight)
  const endIndex = Math.min(totalItems - 1, startIndex + visibleCount + buffer * 2)
  
  return {
    startIndex,
    endIndex,
    visibleItems: endIndex - startIndex + 1,
    offsetY: startIndex * itemHeight
  }
}

/**
 * 分批处理大量数据
 * @param {Array} data - 要处理的数据
 * @param {Function} handler - 处理函数
 * @param {Number} batchSize - 每批处理数量
 * @returns {Promise}
 */
export function batchProcess(data, handler, batchSize = 100) {
  return new Promise((resolve) => {
    let index = 0
    
    function processBatch() {
      const batch = data.slice(index, index + batchSize)
      batch.forEach(item => handler(item))
      index += batchSize
      
      if (index < data.length) {
        requestIdleCallback ? requestIdleCallback(processBatch) : setTimeout(processBatch, 0)
      } else {
        resolve()
      }
    }
    
    processBatch()
  })
}

/**
 * 内存优化 - 清理大对象
 * @param {Object} obj - 要清理的对象
 */
export function clearLargeObject(obj) {
  if (!obj || typeof obj !== 'object') return
  
  Object.keys(obj).forEach(key => {
    delete obj[key]
  })
}

/**
 * 性能监控
 * @param {String} name - 监控名称
 * @param {Function} fn - 要监控的函数
 * @returns {*}
 */
export async function measurePerformance(name, fn) {
  const startTime = performance.now()
  const startMemory = performance.memory ? performance.memory.usedJSHeapSize : 0
  
  let result
  try {
    result = await fn()
  } finally {
    const endTime = performance.now()
    const endMemory = performance.memory ? performance.memory.usedJSHeapSize : 0
    
    console.log(`[性能监控] ${name}:`, {
      duration: `${(endTime - startTime).toFixed(2)}ms`,
      memoryDelta: `${((endMemory - startMemory) / 1024 / 1024).toFixed(2)}MB`
    })
  }
  
  return result
}

/**
 * Web Worker工厂
 * @param {String} workerCode - Worker代码字符串
 * @returns {Worker}
 */
export function createWorker(workerCode) {
  const blob = new Blob([workerCode], { type: 'application/javascript' })
  const workerUrl = URL.createObjectURL(blob)
  const worker = new Worker(workerUrl)
  
  // 清理URL对象
  worker.addEventListener('error', () => {
    URL.revokeObjectURL(workerUrl)
  })
  
  return worker
}

/**
 * 使用Web Worker执行计算密集任务
 * @param {Function} task - 任务函数
 * @param {*} data - 传递给Worker的数据
 * @returns {Promise}
 */
export function runInWorker(task, data) {
  return new Promise((resolve, reject) => {
    const workerCode = `
      self.onmessage = function(e) {
        const task = ${task.toString()}
        try {
          const result = task(e.data)
          self.postMessage({ success: true, result })
        } catch (error) {
          self.postMessage({ success: false, error: error.message })
        }
      }
    `
    
    const worker = createWorker(workerCode)
    
    worker.onmessage = (e) => {
      if (e.data.success) {
        resolve(e.data.result)
      } else {
        reject(new Error(e.data.error))
      }
      worker.terminate()
    }
    
    worker.onerror = (error) => {
      reject(error)
      worker.terminate()
    }
    
    worker.postMessage(data)
  })
}

/**
 * 组件级代码分割 - 动态导入
 * @param {String} componentPath - 组件路径
 * @returns {Promise<Component>}
 */
export function lazyLoadComponent(componentPath) {
  return () => import(/* webpackChunkName: "lazy-[request]" */ `@/${componentPath}`)
}

/**
 * 缓存计算结果
 * @param {Function} fn - 要缓存的函数
 * @param {Function} keyGenerator - 缓存键生成函数
 * @returns {Function}
 */
export function memoize(fn, keyGenerator = (...args) => JSON.stringify(args)) {
  const cache = new Map()
  
  return function(...args) {
    const key = keyGenerator(...args)
    
    if (cache.has(key)) {
      return cache.get(key)
    }
    
    const result = fn.apply(this, args)
    cache.set(key, result)
    
    // 限制缓存大小
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value
      cache.delete(firstKey)
    }
    
    return result
  }
}

/**
 * 响应式图片加载
 * @param {String} src - 图片路径
 * @param {Object} sizes - 不同尺寸配置
 * @returns {String}
 */
export function getResponsiveImageSrc(src, sizes = {}) {
  const deviceWidth = window.innerWidth
  
  if (deviceWidth <= 768 && sizes.mobile) {
    return sizes.mobile
  } else if (deviceWidth <= 1024 && sizes.tablet) {
    return sizes.tablet
  } else if (sizes.desktop) {
    return sizes.desktop
  }
  
  return src
}

/**
 * 预加载资源
 * @param {Array<String>} urls - 资源URL列表
 * @param {String} type - 资源类型 (image|script|style)
 * @returns {Promise}
 */
export function preloadResources(urls, type = 'image') {
  const promises = urls.map(url => {
    return new Promise((resolve, reject) => {
      if (type === 'image') {
        const img = new Image()
        img.onload = resolve
        img.onerror = reject
        img.src = url
      } else if (type === 'script') {
        const script = document.createElement('script')
        script.onload = resolve
        script.onerror = reject
        script.src = url
        document.head.appendChild(script)
      } else if (type === 'style') {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.onload = resolve
        link.onerror = reject
        link.href = url
        document.head.appendChild(link)
      }
    })
  })
  
  return Promise.all(promises)
}

export default {
  debounce,
  throttle,
  rafThrottle,
  lazyLoadImages,
  calculateVirtualScroll,
  batchProcess,
  clearLargeObject,
  measurePerformance,
  createWorker,
  runInWorker,
  lazyLoadComponent,
  memoize,
  getResponsiveImageSrc,
  preloadResources
}
