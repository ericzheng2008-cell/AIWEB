/**
 * P2-1: 实时数据同步引擎
 * 功能: 支持Webhook/API/CDC三种同步方式
 * 开发周期: Week 1-2
 */

import { ref, computed } from 'vue'

// 数据源配置
export const dataSources = ref([
  {
    id: 'erp',
    name: 'ERP系统',
    type: 'webhook',
    syncInterval: '实时',
    sla: '<5s',
    status: 'active',
    lastSync: null,
    syncCount: 0,
    errorCount: 0,
    endpoint: '/api/sync/erp'
  },
  {
    id: 'sap',
    name: 'SAP系统',
    type: 'api',
    syncInterval: '5分钟',
    sla: '<30s',
    status: 'active',
    lastSync: null,
    syncCount: 0,
    errorCount: 0,
    apiUrl: 'https://sap.example.com/api'
  },
  {
    id: 'mes',
    name: 'MES系统',
    type: 'incremental',
    syncInterval: '15分钟',
    sla: '<2min',
    status: 'active',
    lastSync: null,
    syncCount: 0,
    errorCount: 0
  },
  {
    id: 'email',
    name: '邮件系统',
    type: 'imap',
    syncInterval: '实时',
    sla: '<10s',
    status: 'active',
    lastSync: null,
    syncCount: 0,
    errorCount: 0
  },
  {
    id: 'social',
    name: '社交媒体',
    type: 'api',
    syncInterval: '1小时',
    sla: '<5min',
    status: 'active',
    lastSync: null,
    syncCount: 0,
    errorCount: 0
  }
])

// 同步状态监控
export const syncMetrics = ref({
  totalSyncs: 0,
  successCount: 0,
  failureCount: 0,
  averageLatency: 0,
  successRate: 0,
  dataVolume: 0
})

// 同步日志
export const syncLogs = ref([])

/**
 * 数据同步服务类
 */
class DataSyncService {
  constructor() {
    this.isRunning = false
    this.syncQueue = []
    this.retryAttempts = 3
  }

  /**
   * Webhook推送同步
   */
  async handleWebhook(sourceId, data) {
    const startTime = Date.now()
    
    try {
      console.log(`[DataSync] Webhook received from ${sourceId}`, data)
      
      // 数据验证
      const validatedData = await this.validateData(data)
      
      // 数据转换
      const transformedData = await this.transformData(validatedData, sourceId)
      
      // 写入数据库
      await this.upsertData(transformedData)
      
      const latency = Date.now() - startTime
      
      // 更新指标
      this.updateMetrics(sourceId, true, latency)
      
      // 记录日志
      this.logSync(sourceId, 'webhook', 'success', latency, transformedData.length)
      
      return { success: true, latency }
    } catch (error) {
      const latency = Date.now() - startTime
      this.updateMetrics(sourceId, false, latency)
      this.logSync(sourceId, 'webhook', 'failed', latency, 0, error.message)
      
      throw error
    }
  }

  /**
   * API轮询同步
   */
  async syncFromAPI(sourceId) {
    const source = dataSources.value.find(s => s.id === sourceId)
    if (!source) return
    
    const startTime = Date.now()
    
    try {
      console.log(`[DataSync] Polling API from ${source.name}`)
      
      // 获取增量数据
      const lastSyncTime = source.lastSync || new Date(0)
      const data = await this.fetchFromAPI(source.apiUrl, lastSyncTime)
      
      if (data.length === 0) {
        console.log(`[DataSync] No new data from ${source.name}`)
        return
      }
      
      // 数据转换与存储
      const transformedData = await this.transformData(data, sourceId)
      await this.upsertData(transformedData)
      
      const latency = Date.now() - startTime
      
      // 更新数据源状态
      source.lastSync = new Date()
      source.syncCount++
      
      this.updateMetrics(sourceId, true, latency)
      this.logSync(sourceId, 'api', 'success', latency, transformedData.length)
      
      return { success: true, count: transformedData.length, latency }
    } catch (error) {
      const latency = Date.now() - startTime
      source.errorCount++
      
      this.updateMetrics(sourceId, false, latency)
      this.logSync(sourceId, 'api', 'failed', latency, 0, error.message)
      
      // 重试逻辑
      if (source.errorCount < this.retryAttempts) {
        console.log(`[DataSync] Retry ${source.errorCount}/${this.retryAttempts}`)
        setTimeout(() => this.syncFromAPI(sourceId), 5000 * source.errorCount)
      }
      
      throw error
    }
  }

  /**
   * CDC增量同步 (Change Data Capture)
   */
  async syncCDC(sourceId) {
    const source = dataSources.value.find(s => s.id === sourceId)
    if (!source) return
    
    const startTime = Date.now()
    
    try {
      console.log(`[DataSync] CDC sync from ${source.name}`)
      
      // 监听binlog变更
      const changes = await this.captureDatabaseChanges(sourceId)
      
      if (changes.length === 0) {
        return
      }
      
      // 数据标准化
      const normalized = await this.normalizeChanges(changes)
      
      // 去重
      const deduplicated = await this.deduplicateChanges(normalized)
      
      // 写入目标库
      await this.applyChanges(deduplicated)
      
      const latency = Date.now() - startTime
      
      source.lastSync = new Date()
      source.syncCount++
      
      this.updateMetrics(sourceId, true, latency)
      this.logSync(sourceId, 'cdc', 'success', latency, deduplicated.length)
      
      return { success: true, count: deduplicated.length, latency }
    } catch (error) {
      const latency = Date.now() - startTime
      source.errorCount++
      
      this.updateMetrics(sourceId, false, latency)
      this.logSync(sourceId, 'cdc', 'failed', latency, 0, error.message)
      
      throw error
    }
  }

  /**
   * 数据验证
   */
  async validateData(data) {
    // 必填字段检查
    const requiredFields = ['id', 'type', 'timestamp']
    
    for (const field of requiredFields) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field}`)
      }
    }
    
    // 数据类型检查
    if (typeof data.id !== 'string') {
      throw new Error('Invalid id type')
    }
    
    // 时间戳验证
    const timestamp = new Date(data.timestamp)
    if (isNaN(timestamp.getTime())) {
      throw new Error('Invalid timestamp format')
    }
    
    return data
  }

  /**
   * 数据转换
   */
  async transformData(data, sourceId) {
    // 根据数据源类型进行转换
    const transformers = {
      erp: this.transformERPData,
      sap: this.transformSAPData,
      mes: this.transformMESData,
      email: this.transformEmailData,
      social: this.transformSocialData
    }
    
    const transformer = transformers[sourceId]
    if (!transformer) {
      throw new Error(`No transformer found for source: ${sourceId}`)
    }
    
    return Array.isArray(data) 
      ? data.map(item => transformer.call(this, item))
      : [transformer.call(this, data)]
  }

  /**
   * ERP数据转换
   */
  transformERPData(data) {
    return {
      id: data.id,
      customerId: data.customer_id,
      orderId: data.order_id,
      amount: parseFloat(data.amount),
      status: data.status,
      createdAt: new Date(data.created_at),
      source: 'erp'
    }
  }

  /**
   * SAP数据转换
   */
  transformSAPData(data) {
    return {
      id: data.VBELN,  // SAP订单号
      customerId: data.KUNNR,  // SAP客户号
      amount: parseFloat(data.NETWR),
      currency: data.WAERK,
      status: this.mapSAPStatus(data.VBTYP),
      createdAt: this.parseSAPDate(data.ERDAT),
      source: 'sap'
    }
  }

  /**
   * MES数据转换
   */
  transformMESData(data) {
    return {
      id: data.work_order_id,
      productId: data.product_id,
      quantity: parseInt(data.quantity),
      status: data.status,
      completedAt: data.completed_at ? new Date(data.completed_at) : null,
      source: 'mes'
    }
  }

  /**
   * 邮件数据转换
   */
  transformEmailData(data) {
    return {
      id: data.messageId,
      from: data.from,
      to: data.to,
      subject: data.subject,
      body: data.body,
      receivedAt: new Date(data.date),
      source: 'email'
    }
  }

  /**
   * 社交媒体数据转换
   */
  transformSocialData(data) {
    return {
      id: data.id,
      platform: data.platform,
      author: data.author,
      content: data.content,
      sentiment: data.sentiment || null,
      engagement: data.likes + data.shares,
      createdAt: new Date(data.created_at),
      source: 'social'
    }
  }

  /**
   * 数据写入/更新
   */
  async upsertData(data) {
    // 模拟数据库写入
    // 实际应该调用后端API
    console.log('[DataSync] Upserting data:', data.length, 'records')
    
    // 这里应该是真实的数据库操作
    // await axios.post('/api/data/sync', { data })
    
    return { success: true, count: data.length }
  }

  /**
   * 从API获取数据
   */
  async fetchFromAPI(apiUrl, lastSyncTime) {
    // 模拟API调用
    // 实际应该使用axios或fetch
    console.log(`[DataSync] Fetching from ${apiUrl} since ${lastSyncTime}`)
    
    // 模拟返回数据
    return [
      {
        id: `${Date.now()}-1`,
        type: 'order',
        customer_id: 'C001',
        amount: 50000,
        status: 'confirmed',
        created_at: new Date().toISOString(),
        timestamp: new Date().toISOString()
      }
    ]
  }

  /**
   * 捕获数据库变更
   */
  async captureDatabaseChanges(sourceId) {
    // 模拟CDC变更捕获
    // 实际应该连接MySQL Binlog或类似机制
    console.log(`[DataSync] Capturing changes from ${sourceId}`)
    
    return []  // 返回变更记录
  }

  /**
   * 标准化变更
   */
  async normalizeChanges(changes) {
    return changes.map(change => ({
      operation: change.type,  // INSERT/UPDATE/DELETE
      table: change.table,
      before: change.before,
      after: change.after,
      timestamp: change.timestamp
    }))
  }

  /**
   * 去重变更
   */
  async deduplicateChanges(changes) {
    const seen = new Set()
    return changes.filter(change => {
      const key = `${change.table}-${change.after?.id}`
      if (seen.has(key)) {
        return false
      }
      seen.add(key)
      return true
    })
  }

  /**
   * 应用变更
   */
  async applyChanges(changes) {
    for (const change of changes) {
      switch (change.operation) {
        case 'INSERT':
        case 'UPDATE':
          await this.upsertData([change.after])
          break
        case 'DELETE':
          console.log('[DataSync] Deleting record:', change.before?.id)
          // await deleteRecord(change.before.id)
          break
      }
    }
  }

  /**
   * 更新同步指标
   */
  updateMetrics(sourceId, success, latency) {
    const source = dataSources.value.find(s => s.id === sourceId)
    if (source) {
      source.lastSync = new Date()
      if (success) {
        source.syncCount++
      } else {
        source.errorCount++
      }
    }
    
    syncMetrics.value.totalSyncs++
    if (success) {
      syncMetrics.value.successCount++
    } else {
      syncMetrics.value.failureCount++
    }
    
    // 更新平均延迟
    syncMetrics.value.averageLatency = 
      (syncMetrics.value.averageLatency * (syncMetrics.value.totalSyncs - 1) + latency) 
      / syncMetrics.value.totalSyncs
    
    // 更新成功率
    syncMetrics.value.successRate = 
      (syncMetrics.value.successCount / syncMetrics.value.totalSyncs * 100).toFixed(2)
  }

  /**
   * 记录同步日志
   */
  logSync(sourceId, type, status, latency, count, error = null) {
    const log = {
      id: `log-${Date.now()}`,
      sourceId,
      sourceName: dataSources.value.find(s => s.id === sourceId)?.name,
      type,
      status,
      latency: `${latency}ms`,
      count,
      error,
      timestamp: new Date()
    }
    
    syncLogs.value.unshift(log)
    
    // 只保留最近1000条日志
    if (syncLogs.value.length > 1000) {
      syncLogs.value = syncLogs.value.slice(0, 1000)
    }
  }

  /**
   * SAP状态映射
   */
  mapSAPStatus(vbtyp) {
    const statusMap = {
      'C': 'confirmed',
      'L': 'delivered',
      'F': 'invoiced',
      'H': 'cancelled'
    }
    return statusMap[vbtyp] || 'unknown'
  }

  /**
   * SAP日期解析
   */
  parseSAPDate(sapDate) {
    // SAP日期格式: YYYYMMDD
    if (!sapDate || sapDate.length !== 8) return null
    
    const year = sapDate.substring(0, 4)
    const month = sapDate.substring(4, 6)
    const day = sapDate.substring(6, 8)
    
    return new Date(`${year}-${month}-${day}`)
  }

  /**
   * 启动自动同步
   */
  startAutoSync() {
    if (this.isRunning) {
      console.log('[DataSync] Auto sync already running')
      return
    }
    
    this.isRunning = true
    console.log('[DataSync] Starting auto sync')
    
    // SAP: 每5分钟同步
    setInterval(() => {
      this.syncFromAPI('sap')
    }, 5 * 60 * 1000)
    
    // MES: 每15分钟同步
    setInterval(() => {
      this.syncCDC('mes')
    }, 15 * 60 * 1000)
    
    // Social: 每小时同步
    setInterval(() => {
      this.syncFromAPI('social')
    }, 60 * 60 * 1000)
    
    console.log('[DataSync] Auto sync started')
  }

  /**
   * 停止自动同步
   */
  stopAutoSync() {
    this.isRunning = false
    console.log('[DataSync] Auto sync stopped')
  }

  /**
   * 手动触发同步
   */
  async manualSync(sourceId) {
    const source = dataSources.value.find(s => s.id === sourceId)
    if (!source) {
      throw new Error(`Source not found: ${sourceId}`)
    }
    
    switch (source.type) {
      case 'webhook':
        throw new Error('Webhook sources cannot be manually synced')
      case 'api':
      case 'imap':
        return await this.syncFromAPI(sourceId)
      case 'incremental':
        return await this.syncCDC(sourceId)
      default:
        throw new Error(`Unknown sync type: ${source.type}`)
    }
  }

  /**
   * 获取同步冲突
   */
  async getConflicts() {
    // 模拟冲突检测
    return [
      {
        id: 'conflict-1',
        sourceA: 'erp',
        sourceB: 'sap',
        field: 'customer.phone',
        valueA: '13800138000',
        valueB: '13900139000',
        strategy: 'manual_review',
        status: 'pending'
      }
    ]
  }

  /**
   * 解决冲突
   */
  async resolveConflict(conflictId, resolution) {
    console.log(`[DataSync] Resolving conflict ${conflictId}:`, resolution)
    
    // 应用解决方案
    switch (resolution.strategy) {
      case 'keep_source_a':
        await this.applyValue(resolution.field, resolution.valueA)
        break
      case 'keep_source_b':
        await this.applyValue(resolution.field, resolution.valueB)
        break
      case 'merge':
        await this.mergeValues(resolution.field, resolution.valueA, resolution.valueB)
        break
    }
    
    return { success: true }
  }

  async applyValue(field, value) {
    console.log(`[DataSync] Applying value: ${field} = ${value}`)
    // 实际数据库更新
  }

  async mergeValues(field, valueA, valueB) {
    console.log(`[DataSync] Merging values: ${field} = ${valueA} + ${valueB}`)
    // 实际数据合并逻辑
  }
}

// 导出单例
export const dataSyncService = new DataSyncService()

// 导出计算属性
export const useDataSync = () => {
  const activeSources = computed(() => 
    dataSources.value.filter(s => s.status === 'active')
  )
  
  const realtimeSources = computed(() =>
    dataSources.value.filter(s => s.syncInterval === '实时')
  )
  
  const errorSources = computed(() =>
    dataSources.value.filter(s => s.errorCount > 0)
  )
  
  const recentLogs = computed(() =>
    syncLogs.value.slice(0, 50)
  )
  
  return {
    dataSources,
    syncMetrics,
    syncLogs,
    activeSources,
    realtimeSources,
    errorSources,
    recentLogs,
    dataSyncService
  }
}
