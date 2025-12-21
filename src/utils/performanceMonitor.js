/**
 * 🚀 性能监控工具
 * 用于监控页面加载性能、资源加载时间等
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = {}
    this.observers = []
  }

  /**
   * 初始化性能监控
   */
  init() {
    if (typeof window === 'undefined') return
    
    // 监控页面加载性能
    this.measurePageLoad()
    
    // 监控资源加载
    this.measureResourceLoad()
    
    // 监控长任务
    this.measureLongTasks()
    
    // 监控First Input Delay (FID)
    this.measureFID()
    
    // 监控Cumulative Layout Shift (CLS)
    this.measureCLS()
  }

  /**
   * 测量页面加载性能
   */
  measurePageLoad() {
    if (!window.performance || !window.performance.timing) return
    
    window.addEventListener('load', () => {
      setTimeout(() => {
        const timing = window.performance.timing
        const metrics = {
          // DNS查询时间
          dns: timing.domainLookupEnd - timing.domainLookupStart,
          // TCP连接时间
          tcp: timing.connectEnd - timing.connectStart,
          // 请求响应时间
          request: timing.responseEnd - timing.requestStart,
          // DOM解析时间
          domParse: timing.domInteractive - timing.responseEnd,
          // DOM内容加载完成时间
          domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
          // 页面完全加载时间
          pageLoad: timing.loadEventEnd - timing.navigationStart,
          // 首次渲染时间 (FP)
          firstPaint: this.getFirstPaint(),
          // 首次内容渲染时间 (FCP)
          firstContentfulPaint: this.getFirstContentfulPaint(),
          // 最大内容渲染时间 (LCP)
          largestContentfulPaint: this.getLargestContentfulPaint()
        }
        
        this.metrics.pageLoad = metrics
        this.reportMetrics('pageLoad', metrics)
      }, 0)
    })
  }

  /**
   * 测量资源加载
   */
  measureResourceLoad() {
    if (!window.PerformanceObserver) return
    
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'resource') {
            // 分类统计资源加载时间
            const resourceType = this.getResourceType(entry.name)
            if (!this.metrics.resources) this.metrics.resources = {}
            if (!this.metrics.resources[resourceType]) {
              this.metrics.resources[resourceType] = []
            }
            
            this.metrics.resources[resourceType].push({
              name: entry.name,
              duration: entry.duration,
              size: entry.transferSize || 0,
              protocol: entry.nextHopProtocol
            })
          }
        })
      })
      
      observer.observe({ entryTypes: ['resource'] })
      this.observers.push(observer)
    } catch (e) {
      console.warn('资源监控初始化失败:', e)
    }
  }

  /**
   * 测量长任务
   */
  measureLongTasks() {
    if (!window.PerformanceObserver) return
    
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        if (!this.metrics.longTasks) this.metrics.longTasks = []
        
        entries.forEach((entry) => {
          if (entry.duration > 50) { // 超过50ms的任务
            this.metrics.longTasks.push({
              duration: entry.duration,
              startTime: entry.startTime
            })
          }
        })
      })
      
      observer.observe({ entryTypes: ['longtask'] })
      this.observers.push(observer)
    } catch (e) {
      // longtask API可能不被支持
    }
  }

  /**
   * 测量首次输入延迟 (FID)
   */
  measureFID() {
    if (!window.PerformanceObserver) return
    
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          this.metrics.fid = entry.processingStart - entry.startTime
        })
      })
      
      observer.observe({ entryTypes: ['first-input'] })
      this.observers.push(observer)
    } catch (e) {
      // first-input可能不被支持
    }
  }

  /**
   * 测量累积布局偏移 (CLS)
   */
  measureCLS() {
    if (!window.PerformanceObserver) return
    
    try {
      let clsValue = 0
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            this.metrics.cls = clsValue
          }
        })
      })
      
      observer.observe({ entryTypes: ['layout-shift'] })
      this.observers.push(observer)
    } catch (e) {
      // layout-shift可能不被支持
    }
  }

  /**
   * 获取首次渲染时间 (FP)
   */
  getFirstPaint() {
    if (!window.performance || !window.performance.getEntriesByType) return 0
    
    const paintEntries = window.performance.getEntriesByType('paint')
    const fpEntry = paintEntries.find(entry => entry.name === 'first-paint')
    return fpEntry ? fpEntry.startTime : 0
  }

  /**
   * 获取首次内容渲染时间 (FCP)
   */
  getFirstContentfulPaint() {
    if (!window.performance || !window.performance.getEntriesByType) return 0
    
    const paintEntries = window.performance.getEntriesByType('paint')
    const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint')
    return fcpEntry ? fcpEntry.startTime : 0
  }

  /**
   * 获取最大内容渲染时间 (LCP)
   */
  getLargestContentfulPaint() {
    return new Promise((resolve) => {
      if (!window.PerformanceObserver) {
        resolve(0)
        return
      }
      
      try {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          resolve(lastEntry ? lastEntry.startTime : 0)
        })
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] })
        this.observers.push(observer)
      } catch (e) {
        resolve(0)
      }
    })
  }

  /**
   * 获取资源类型
   */
  getResourceType(url) {
    if (/\.(js|mjs)$/i.test(url)) return 'script'
    if (/\.css$/i.test(url)) return 'style'
    if (/\.(png|jpg|jpeg|gif|webp|svg|ico)$/i.test(url)) return 'image'
    if (/\.(woff|woff2|ttf|eot|otf)$/i.test(url)) return 'font'
    if (/\.(mp4|webm|ogg)$/i.test(url)) return 'video'
    return 'other'
  }

  /**
   * 上报性能指标
   */
  reportMetrics(type, metrics) {
    // 开发环境打印到控制台
    if (import.meta.env.MODE === 'development') {
      console.log(`📊 [性能监控] ${type}:`, metrics)
    }
    
    // 生产环境可以上报到服务器
    if (import.meta.env.MODE === 'production') {
      // TODO: 发送到分析服务
      // this.sendToAnalytics(type, metrics)
    }
  }

  /**
   * 获取所有性能指标
   */
  getAllMetrics() {
    return this.metrics
  }

  /**
   * 清理观察者
   */
  cleanup() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// 创建单例
const performanceMonitor = new PerformanceMonitor()

export default performanceMonitor
