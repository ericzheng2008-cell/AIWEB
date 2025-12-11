/**
 * 防抖的 localStorage 存储工具
 * 解决频繁写入导致的性能问题
 */

class DebouncedStorage {
  constructor() {
    this.cache = new Map()
    this.saveTimers = new Map()
    this.debounceTime = 500 // 默认防抖时间 500ms
  }

  /**
   * 防抖保存到 localStorage
   * @param {string} key - 存储键
   * @param {any} value - 存储值
   * @param {number} delay - 防抖延迟（毫秒）
   */
  save(key, value, delay = this.debounceTime) {
    // 更新缓存
    this.cache.set(key, value)

    // 清除之前的定时器
    if (this.saveTimers.has(key)) {
      clearTimeout(this.saveTimers.get(key))
    }

    // 设置新的定时器
    const timer = setTimeout(() => {
      this._saveToLocalStorage(key, value)
      this.saveTimers.delete(key)
    }, delay)

    this.saveTimers.set(key, timer)
  }

  /**
   * 立即保存（用于重要数据）
   * @param {string} key - 存储键
   * @param {any} value - 存储值
   */
  saveNow(key, value) {
    // 取消防抖
    if (this.saveTimers.has(key)) {
      clearTimeout(this.saveTimers.get(key))
      this.saveTimers.delete(key)
    }

    this.cache.set(key, value)
    this._saveToLocalStorage(key, value)
  }

  /**
   * 内部方法：实际写入 localStorage
   */
  _saveToLocalStorage(key, value) {
    try {
      const jsonValue = JSON.stringify(value)
      localStorage.setItem(key, jsonValue)
      console.log(`[Storage] 已保存: ${key} (${(jsonValue.length / 1024).toFixed(2)}KB)`)
    } catch (error) {
      console.error(`[Storage] 保存失败: ${key}`, error)
      
      // 处理存储满的情况
      if (error.name === 'QuotaExceededError') {
        this._handleQuotaExceeded(key, value)
      }
    }
  }

  /**
   * 读取数据（优先从缓存）
   * @param {string} key - 存储键
   * @param {any} defaultValue - 默认值
   * @returns {any}
   */
  get(key, defaultValue = null) {
    // 先从缓存读取
    if (this.cache.has(key)) {
      return this.cache.get(key)
    }

    // 从 localStorage 读取
    try {
      const item = localStorage.getItem(key)
      if (item !== null) {
        const parsed = JSON.parse(item)
        this.cache.set(key, parsed)
        return parsed
      }
    } catch (error) {
      console.error(`[Storage] 读取失败: ${key}`, error)
    }

    return defaultValue
  }

  /**
   * 删除数据
   * @param {string} key - 存储键
   */
  remove(key) {
    // 清除定时器
    if (this.saveTimers.has(key)) {
      clearTimeout(this.saveTimers.get(key))
      this.saveTimers.delete(key)
    }

    // 删除缓存和存储
    this.cache.delete(key)
    localStorage.removeItem(key)
  }

  /**
   * 清空所有数据
   */
  clear() {
    // 清除所有定时器
    this.saveTimers.forEach(timer => clearTimeout(timer))
    this.saveTimers.clear()
    
    // 清空缓存和存储
    this.cache.clear()
    localStorage.clear()
  }

  /**
   * 处理存储空间不足
   */
  _handleQuotaExceeded(key, value) {
    console.warn('[Storage] 存储空间不足，正在清理旧数据...')

    // 保护的重要键
    const protectedKeys = [
      'authToken',
      'language',
      'siteConfig',
      'userInfo'
    ]

    // 获取所有键
    const allKeys = []
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (!protectedKeys.includes(k)) {
        allKeys.push(k)
      }
    }

    // 删除一半的非保护数据
    const keysToDelete = allKeys.slice(0, Math.ceil(allKeys.length / 2))
    keysToDelete.forEach(k => {
      localStorage.removeItem(k)
      this.cache.delete(k)
    })

    console.log(`[Storage] 已清理 ${keysToDelete.length} 项数据`)

    // 重试保存
    try {
      this._saveToLocalStorage(key, value)
    } catch (error) {
      console.error('[Storage] 清理后仍无法保存:', error)
      alert('存储空间不足，请清理浏览器数据')
    }
  }

  /**
   * 刷新所有待保存的数据（页面卸载前调用）
   */
  flushAll() {
    console.log('[Storage] 正在保存所有待写入数据...')
    
    // 立即执行所有待保存的操作
    this.saveTimers.forEach((timer, key) => {
      clearTimeout(timer)
      if (this.cache.has(key)) {
        this._saveToLocalStorage(key, this.cache.get(key))
      }
    })
    
    this.saveTimers.clear()
  }

  /**
   * 获取存储使用情况
   * @returns {Object}
   */
  getStorageInfo() {
    let totalSize = 0
    const items = {}

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      const value = localStorage.getItem(key)
      const size = value.length * 2 // UTF-16编码，每个字符2字节
      
      totalSize += size
      items[key] = {
        size: (size / 1024).toFixed(2) + 'KB'
      }
    }

    return {
      totalSize: (totalSize / 1024).toFixed(2) + 'KB',
      itemCount: localStorage.length,
      items,
      cacheSize: this.cache.size,
      pendingSaves: this.saveTimers.size
    }
  }

  /**
   * 批量保存
   * @param {Object} data - 键值对对象
   */
  batchSave(data) {
    Object.entries(data).forEach(([key, value]) => {
      this.save(key, value)
    })
  }

  /**
   * 批量读取
   * @param {Array<string>} keys - 键数组
   * @returns {Object}
   */
  batchGet(keys) {
    const result = {}
    keys.forEach(key => {
      result[key] = this.get(key)
    })
    return result
  }
}

// 创建单例
export const storage = new DebouncedStorage()

// 页面卸载前保存所有数据
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    storage.flushAll()
  })

  // 页面隐藏时也保存（移动端支持）
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      storage.flushAll()
    }
  })
}

// 开发环境：暴露到 window 方便调试
if (import.meta.env.MODE === 'development') {
  window.__storage__ = storage
  console.log('[Storage] 调试工具已挂载到 window.__storage__')
  console.log('使用 window.__storage__.getStorageInfo() 查看存储信息')
}

export default storage
