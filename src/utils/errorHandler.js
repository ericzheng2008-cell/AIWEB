/**
 * 全局错误处理工具
 * 提供友好的错误提示和错误上报
 */

import { ElMessage, ElNotification } from 'element-plus'

class ErrorHandler {
  constructor() {
    this.errorMap = this.initErrorMap()
    this.errorLog = []
    this.maxLogSize = 100
  }

  /**
   * 初始化错误映射表
   */
  initErrorMap() {
    return {
      // 网络错误
      'Network Error': {
        title: '网络错误',
        message: '无法连接到服务器，请检查您的网络连接',
        type: 'error',
        duration: 5000
      },
      'Request timeout': {
        title: '请求超时',
        message: '服务器响应超时，请稍后重试',
        type: 'warning',
        duration: 4000
      },
      'timeout of': {
        title: '请求超时',
        message: '操作超时，请检查网络或稍后重试',
        type: 'warning',
        duration: 4000
      },

      // HTTP 错误状态码
      '400': {
        title: '请求错误',
        message: '请求参数有误，请检查后重试',
        type: 'error'
      },
      '401': {
        title: '未授权',
        message: '登录已过期，请重新登录',
        type: 'error',
        action: () => {
          setTimeout(() => {
            window.location.href = '/login'
          }, 1500)
        }
      },
      '403': {
        title: '权限不足',
        message: '您没有权限执行此操作',
        type: 'error'
      },
      '404': {
        title: '资源不存在',
        message: '请求的资源未找到',
        type: 'warning'
      },
      '500': {
        title: '服务器错误',
        message: '服务器内部错误，请稍后重试或联系管理员',
        type: 'error'
      },
      '502': {
        title: '网关错误',
        message: '服务器网关错误，请稍后重试',
        type: 'error'
      },
      '503': {
        title: '服务不可用',
        message: '服务暂时不可用，请稍后重试',
        type: 'error'
      },

      // 业务错误
      'INVALID_TOKEN': {
        title: 'Token无效',
        message: '登录凭证无效，请重新登录',
        type: 'error',
        action: () => {
          localStorage.removeItem('authToken')
          window.location.href = '/login'
        }
      },
      'USER_NOT_FOUND': {
        title: '用户不存在',
        message: '该用户不存在',
        type: 'error'
      },
      'PERMISSION_DENIED': {
        title: '权限不足',
        message: '您没有执行此操作的权限',
        type: 'error'
      }
    }
  }

  /**
   * 主要错误处理方法
   * @param {Error|Object} error - 错误对象
   * @param {Object} options - 配置选项
   */
  handle(error, options = {}) {
    const {
      silent = false, // 是否静默处理（不显示UI）
      context = '',   // 错误上下文
      showNotification = true // 是否显示通知
    } = options

    // 记录错误
    this.logError(error, context)

    // 静默模式
    if (silent) {
      console.error('[ErrorHandler] Silent error:', error)
      return
    }

    // 获取错误信息
    const errorInfo = this.parseError(error, context)

    // 显示错误提示
    if (showNotification) {
      this.showErrorNotification(errorInfo)
    }

    // 执行额外操作
    if (errorInfo.action) {
      errorInfo.action()
    }

    return errorInfo
  }

  /**
   * 解析错误对象
   */
  parseError(error, context = '') {
    let errorInfo = null

    // HTTP 响应错误
    if (error.response) {
      const status = error.response.status.toString()
      errorInfo = this.errorMap[status]
      
      // 尝试从响应中获取更详细的错误信息
      if (error.response.data) {
        const data = error.response.data
        if (data.code && this.errorMap[data.code]) {
          errorInfo = this.errorMap[data.code]
        }
        if (data.message) {
          errorInfo = {
            ...errorInfo,
            message: data.message
          }
        }
      }
    }
    // 请求错误（网络错误等）
    else if (error.request) {
      errorInfo = this.errorMap['Network Error']
    }
    // 其他错误
    else if (error.message) {
      // 尝试匹配错误消息
      const matchedKey = Object.keys(this.errorMap).find(key => 
        error.message.includes(key)
      )
      if (matchedKey) {
        errorInfo = this.errorMap[matchedKey]
      }
    }

    // 如果没有匹配到，使用默认错误
    if (!errorInfo) {
      errorInfo = {
        title: '未知错误',
        message: error.message || '发生了未知错误，请稍后重试',
        type: 'error'
      }
    }

    // 添加上下文
    if (context) {
      errorInfo = {
        ...errorInfo,
        message: `${context}: ${errorInfo.message}`
      }
    }

    return errorInfo
  }

  /**
   * 显示错误通知
   */
  showErrorNotification(errorInfo) {
    ElNotification({
      title: errorInfo.title,
      message: errorInfo.message,
      type: errorInfo.type,
      duration: errorInfo.duration || 5000,
      showClose: true,
      position: 'top-right'
    })
  }

  /**
   * 显示简单的错误消息
   */
  showMessage(message, type = 'error') {
    ElMessage({
      message,
      type,
      duration: 3000,
      showClose: true
    })
  }

  /**
   * 友好的错误提示（用于特定场景）
   */
  showFriendlyError(error, context = '') {
    const friendlyMessages = {
      'Failed to fetch': '无法连接到服务器，请检查网络',
      'timeout': '操作超时，请重试',
      'canceled': '操作已取消',
      'NetworkError': '网络连接失败',
      'TypeError': '数据格式错误',
      'SyntaxError': '数据解析失败'
    }

    let message = error.message || '未知错误'
    
    // 尝试匹配友好消息
    const matchedKey = Object.keys(friendlyMessages).find(key => 
      message.includes(key)
    )
    
    if (matchedKey) {
      message = friendlyMessages[matchedKey]
    }

    if (context) {
      message = `${context}失败: ${message}`
    }

    this.showMessage(message, 'error')
  }

  /**
   * 记录错误到本地日志
   */
  logError(error, context = '') {
    const logEntry = {
      timestamp: new Date().toISOString(),
      context,
      message: error.message,
      stack: error.stack,
      type: error.name,
      url: window.location.href,
      userAgent: navigator.userAgent
    }

    // 添加到日志数组
    this.errorLog.push(logEntry)

    // 限制日志大小
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift()
    }

    // 保存到 localStorage（可选）
    if (import.meta.env.MODE === 'development') {
      try {
        localStorage.setItem('errorLog', JSON.stringify(this.errorLog.slice(-10)))
      } catch (e) {
        console.warn('无法保存错误日志到 localStorage')
      }
    }

    console.error('[ErrorHandler]', logEntry)
  }

  /**
   * 获取错误日志
   */
  getErrorLog() {
    return this.errorLog
  }

  /**
   * 清空错误日志
   */
  clearErrorLog() {
    this.errorLog = []
    localStorage.removeItem('errorLog')
  }

  /**
   * 上报错误到监控平台（可扩展）
   */
  reportError(error, context = '') {
    // TODO: 集成 Sentry 或其他监控平台
    if (import.meta.env.MODE === 'production') {
      // 示例：发送到后端API
      // fetch('/api/log-error', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     error: {
      //       message: error.message,
      //       stack: error.stack
      //     },
      //     context,
      //     url: window.location.href,
      //     timestamp: new Date().toISOString()
      //   })
      // })
    }
  }

  /**
   * 添加自定义错误映射
   */
  addErrorMapping(code, config) {
    this.errorMap[code] = config
  }

  /**
   * 批量添加错误映射
   */
  addErrorMappings(mappings) {
    Object.assign(this.errorMap, mappings)
  }
}

// 创建单例
export const errorHandler = new ErrorHandler()

// 全局错误监听
if (typeof window !== 'undefined') {
  // 捕获未处理的 Promise 错误
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[Unhandled Promise Rejection]', event.reason)
    errorHandler.handle(event.reason, {
      context: 'Promise未捕获的错误'
    })
  })

  // 捕获全局错误
  window.addEventListener('error', (event) => {
    console.error('[Global Error]', event.error)
    errorHandler.handle(event.error, {
      context: '全局未捕获的错误'
    })
  })

  // 开发环境：暴露到 window
  if (import.meta.env.MODE === 'development') {
    window.__errorHandler__ = errorHandler
    console.log('[ErrorHandler] 已挂载到 window.__errorHandler__')
  }
}

export default errorHandler
