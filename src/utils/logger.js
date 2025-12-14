/**
 * 日志工具 - 生产环境自动禁用console输出
 * Logger Utility - Auto-disable console output in production
 */

const isDevelopment = import.meta.env.DEV

class Logger {
  constructor() {
    this.enabled = isDevelopment
    this.logs = []
    this.maxLogs = 100
  }

  /**
   * 普通日志
   */
  log(...args) {
    if (this.enabled) {
      console.log(...args)
      this._saveLog('log', args)
    }
  }

  /**
   * 信息日志
   */
  info(...args) {
    if (this.enabled) {
      console.info(...args)
      this._saveLog('info', args)
    }
  }

  /**
   * 警告日志
   */
  warn(...args) {
    if (this.enabled) {
      console.warn(...args)
    }
    // 警告始终记录
    this._saveLog('warn', args)
  }

  /**
   * 错误日志
   */
  error(...args) {
    // 错误始终输出和记录
    console.error(...args)
    this._saveLog('error', args)
  }

  /**
   * 调试日志 - 仅开发环境
   */
  debug(...args) {
    if (this.enabled) {
      console.debug(...args)
      this._saveLog('debug', args)
    }
  }

  /**
   * 分组日志
   */
  group(label) {
    if (this.enabled) {
      console.group(label)
    }
  }

  groupEnd() {
    if (this.enabled) {
      console.groupEnd()
    }
  }

  /**
   * 保存日志到内存
   */
  _saveLog(level, args) {
    const log = {
      level,
      message: args,
      timestamp: new Date().toISOString()
    }
    
    this.logs.push(log)
    
    // 限制日志数量
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }
  }

  /**
   * 获取所有日志
   */
  getLogs() {
    return this.logs
  }

  /**
   * 清空日志
   */
  clearLogs() {
    this.logs = []
  }

  /**
   * 导出日志
   */
  exportLogs() {
    const logsText = this.logs.map(log => 
      `[${log.timestamp}] [${log.level.toUpperCase()}] ${JSON.stringify(log.message)}`
    ).join('\n')
    
    const blob = new Blob([logsText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `logs_${new Date().getTime()}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }
}

// 创建单例
const logger = new Logger()

// 开发工具
if (isDevelopment) {
  window.__logger__ = logger
  logger.info('💡 日志工具已挂载到 window.__logger__')
  logger.info('使用 window.__logger__.exportLogs() 导出日志')
}

export default logger
