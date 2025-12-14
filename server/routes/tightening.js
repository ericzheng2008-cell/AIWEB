import express from 'express'
import net from 'net'
import dgram from 'dgram'

const router = express.Router()

/**
 * 拧紧数据采集服务 (基于ToolsNet 8架构)
 * 
 * 技术组件:
 * - Data Collection Service (.Net 64-bit, MSMQ)
 * - Common Data Collection (.Net 64-bit, MSMQ)
 * - Protocol Interface Module (PIM) (Delphi 32-bit)
 * - Archive Service (.Net 64-bit)
 * 
 * 支持协议:
 * - Open Protocol (Atlas Copco标准)
 * - TCP/IP Socket连接
 */

// ========== 内存数据存储 (实际应使用SQL Server/Oracle) ==========
const dataStore = {
  // 连接池 - 模拟多控制器连接
  connections: new Map(),
  
  // 拧紧结果 - 实际应存储到数据库
  results: [],
  
  // 拧紧曲线 (Trace Data) - 大数据量
  curves: [],
  
  // 控制器事件
  events: [],
  
  // 程序版本历史
  programVersions: [],
  
  // 工具数据
  tools: [],
  
  // 统计缓存
  statistics: {},
  
  // 消息队列 (模拟MSMQ)
  messageQueue: [],
  
  // ToolsNet Map 结构
  // System → Station → Spindle → Program
  toolsNetMap: {
    systems: []  // 存储所有系统
  }
}

// ========== Open Protocol 消息解析器 ==========
class OpenProtocolParser {
  /**
   * 解析Open Protocol消息
   * 格式: LLLLMIDRRRRSSSSSSSS[Data]
   * LLLL: 长度 (4位)
   * MID: 消息ID (4位)
   * RRR: 修订号 (3位)
   * SSSS: 序列号 (可选)
   */
  static parse(message) {
    if (typeof message !== 'string' || message.length < 20) {
      throw new Error('Invalid Open Protocol message')
    }

    const length = parseInt(message.substring(0, 4))
    const mid = parseInt(message.substring(4, 8))
    const revision = parseInt(message.substring(8, 11))
    
    return {
      length,
      mid,
      revision,
      rawData: message.substring(20),
      timestamp: new Date().toISOString()
    }
  }

  /**
   * 构建Open Protocol响应
   */
  static build(mid, revision, data = '') {
    const content = `    ${mid.toString().padStart(4, '0')}${revision.toString().padStart(3, '0')}         ${data}`
    const length = content.length.toString().padStart(4, '0')
    return length + content
  }

  /**
   * 解析拧紧结果 (MID 0061)
   */
  static parseTighteningResult(data) {
    const result = {
      cellId: this.extractValue(data, '01'),
      channelId: this.extractValue(data, '02'),
      torqueControllerName: this.extractValue(data, '03'),
      vinNumber: this.extractValue(data, '04'),
      jobId: this.extractValue(data, '05'),
      psetId: this.extractValue(data, '06'),
      batchSize: this.extractValue(data, '07'),
      batchCount: this.extractValue(data, '08'),
      tighteningStatus: this.extractValue(data, '09'),
      torqueStatus: this.extractValue(data, '10'),
      angleStatus: this.extractValue(data, '11'),
      torque: parseFloat(this.extractValue(data, '12')),
      angle: parseFloat(this.extractValue(data, '13')),
      timeLastChange: this.extractValue(data, '14'),
      dateLastChange: this.extractValue(data, '15'),
      targetTorque: parseFloat(this.extractValue(data, '16')),
      targetAngle: parseFloat(this.extractValue(data, '17')),
      batchStatus: this.extractValue(data, '18')
    }

    return result
  }

  /**
   * 从Open Protocol数据中提取字段值
   */
  static extractValue(data, parameterId) {
    const regex = new RegExp(`${parameterId}:([^:]+)(?=\\d{2}:|$)`)
    const match = data.match(regex)
    return match ? match[1].trim() : null
  }
}

// ========== TCP连接管理器 (Protocol Interface Module) ==========
class ProtocolInterfaceModule {
  constructor(host, port) {
    this.host = host
    this.port = port
    this.socket = null
    this.connected = false
    this.connectionId = `${host}:${port}`
    this.buffer = ''
    this.subscribers = []
  }

  /**
   * 连接到控制器
   */
  connect() {
    return new Promise((resolve, reject) => {
      this.socket = new net.Socket()
      
      this.socket.connect(this.port, this.host, () => {
        this.connected = true
        console.log(`[PIM] 已连接到控制器: ${this.connectionId}`)
        
        // 发送连接握手 (MID 0001)
        const handshake = OpenProtocolParser.build(1, 1)
        this.socket.write(handshake)
        
        resolve({
          success: true,
          connectionId: this.connectionId,
          protocol: 'Open Protocol',
          version: '2.8.0'
        })
      })

      this.socket.on('data', (data) => {
        this.buffer += data.toString()
        this.processBuffer()
      })

      this.socket.on('error', (error) => {
        console.error(`[PIM] 连接错误: ${error.message}`)
        this.connected = false
        reject(error)
      })

      this.socket.on('close', () => {
        console.log(`[PIM] 连接已关闭: ${this.connectionId}`)
        this.connected = false
      })

      // 超时处理
      setTimeout(() => {
        if (!this.connected) {
          reject(new Error('连接超时'))
        }
      }, 5000)
    })
  }

  /**
   * 处理接收缓冲区
   */
  processBuffer() {
    while (this.buffer.length >= 20) {
      try {
        const message = OpenProtocolParser.parse(this.buffer)
        this.buffer = this.buffer.substring(message.length)
        
        // 推送到订阅者
        this.subscribers.forEach(callback => callback(message))
        
        // 发送ACK (MID 0062)
        if (message.mid === 61) {
          const ack = OpenProtocolParser.build(62, 1)
          this.socket.write(ack)
        }
      } catch (error) {
        console.error('[PIM] 消息解析错误:', error.message)
        break
      }
    }
  }

  /**
   * 订阅消息
   */
  subscribe(callback) {
    this.subscribers.push(callback)
  }

  /**
   * 断开连接
   */
  disconnect() {
    if (this.socket) {
      this.socket.destroy()
      this.connected = false
    }
  }

  /**
   * 发送命令
   */
  sendCommand(mid, revision, data) {
    if (!this.connected) {
      throw new Error('未连接到控制器')
    }
    
    const message = OpenProtocolParser.build(mid, revision, data)
    this.socket.write(message)
  }
}

// ========== 数据采集服务 (Data Collection Service) ==========
class DataCollectionService {
  constructor() {
    this.isRunning = false
    this.collectionSpeed = { resultsPerMinute: 0, resultsPerSecond: 0 }
    this.lastResultTime = Date.now()
    this.resultCount = 0
  }

  /**
   * 启动数据采集
   */
  start(connectionId) {
    const connection = dataStore.connections.get(connectionId)
    if (!connection) {
      throw new Error('连接不存在')
    }

    this.isRunning = true
    console.log(`[DCS] 数据采集服务已启动: ${connectionId}`)

    // 订阅拧紧结果
    connection.pim.subscribe((message) => {
      if (message.mid === 61) { // 拧紧结果
        this.processTighteningResult(message, connectionId)
      } else if (message.mid === 70) { // 报警
        this.processAlarm(message, connectionId)
      } else if (message.mid === 110) { // 曲线数据
        this.processCurveData(message, connectionId)
      }
    })

    // 启动速度监控
    this.startSpeedMonitor()
  }

  /**
   * 处理拧紧结果
   */
  processTighteningResult(message, connectionId) {
    try {
      const result = OpenProtocolParser.parseTighteningResult(message.rawData)
      
      // 数据清洗
      const cleanedResult = {
        id: Date.now() + Math.random(),
        connectionId,
        timestamp: message.timestamp,
        unitName: result.torqueControllerName,
        cellId: result.cellId,
        channelId: result.channelId,
        vinNumber: result.vinNumber,
        jobId: parseInt(result.jobId),
        psetId: parseInt(result.psetId),
        batchSize: parseInt(result.batchSize),
        batchCount: parseInt(result.batchCount),
        result: result.tighteningStatus === '1' ? 'OK' : 'NOK',
        torque: result.torque,
        angle: result.angle,
        targetTorque: result.targetTorque,
        targetAngle: result.targetAngle,
        torqueStatus: result.torqueStatus === '1' ? 'OK' : 'NOK',
        angleStatus: result.angleStatus === '1' ? 'OK' : 'NOK',
        resultTime: `${result.dateLastChange} ${result.timeLastChange}`,
        batchStatus: result.batchStatus
      }

      // 推送到消息队列 (MSMQ)
      dataStore.messageQueue.push({
        type: 'TIGHTENING_RESULT',
        data: cleanedResult,
        timestamp: new Date().toISOString()
      })

      // 存储到数据库 (实际应异步写入SQL Server)
      dataStore.results.unshift(cleanedResult)
      if (dataStore.results.length > 50000) {
        dataStore.results = dataStore.results.slice(0, 50000)
      }

      // 更新统计
      this.updateStatistics()
      
      // 异常检测
      this.detectAnomalies(cleanedResult)

      this.resultCount++
      
      console.log(`[DCS] 拧紧结果已处理: VIN=${result.vinNumber}, Result=${cleanedResult.result}`)
    } catch (error) {
      console.error('[DCS] 处理拧紧结果失败:', error.message)
    }
  }

  /**
   * 处理报警
   */
  processAlarm(message, connectionId) {
    const event = {
      id: Date.now() + Math.random(),
      connectionId,
      eventType: 'ALARM',
      eventLevel: 'error',
      eventCode: 'A001',
      eventDescription: '控制器报警',
      timestamp: message.timestamp
    }

    dataStore.events.unshift(event)
    console.log(`[DCS] 报警事件: ${event.eventDescription}`)
  }

  /**
   * 处理曲线数据
   */
  processCurveData(message, connectionId) {
    const curve = {
      id: Date.now() + Math.random(),
      connectionId,
      timestamp: message.timestamp,
      traceData: message.rawData
    }

    dataStore.curves.unshift(curve)
    if (dataStore.curves.length > 5000) {
      dataStore.curves = dataStore.curves.slice(0, 5000)
    }

    console.log(`[DCS] 曲线数据已保存`)
  }

  /**
   * 更新统计
   */
  updateStatistics() {
    const total = dataStore.results.length
    if (total === 0) return

    const ok = dataStore.results.filter(r => r.result === 'OK').length
    const nok = dataStore.results.filter(r => r.result === 'NOK').length

    dataStore.statistics = {
      total,
      ok,
      nok,
      okRate: (ok / total * 100).toFixed(2),
      nokRate: (nok / total * 100).toFixed(2),
      lastUpdate: new Date().toISOString()
    }
  }

  /**
   * 异常检测
   */
  detectAnomalies(result) {
    if (result.result === 'NOK') {
      const event = {
        id: Date.now() + Math.random(),
        connectionId: result.connectionId,
        eventType: 'NOK',
        eventLevel: 'warning',
        eventCode: 'E001',
        eventDescription: `拧紧NOK - VIN: ${result.vinNumber}`,
        timestamp: new Date().toISOString()
      }
      dataStore.events.unshift(event)
    }
  }

  /**
   * 启动速度监控
   */
  startSpeedMonitor() {
    setInterval(() => {
      if (!this.isRunning) return

      const now = Date.now()
      const timeDiff = (now - this.lastResultTime) / 1000
      
      this.collectionSpeed = {
        resultsPerSecond: (this.resultCount / timeDiff).toFixed(2),
        resultsPerMinute: ((this.resultCount / timeDiff) * 60).toFixed(0)
      }

      this.lastResultTime = now
      this.resultCount = 0
    }, 5000)
  }

  /**
   * 停止数据采集
   */
  stop() {
    this.isRunning = false
    console.log('[DCS] 数据采集服务已停止')
  }
}

// 数据采集服务实例
const dataCollectionService = new DataCollectionService()

// ========== REST API 路由 ==========

/**
 * POST /api/tightening/connect
 * 连接到控制器
 */
router.post('/connect', async (req, res) => {
  try {
    const { ipAddress, port = 4545, controller = 'PF4000' } = req.body

    if (!ipAddress) {
      return res.status(400).json({
        success: false,
        message: 'IP地址不能为空'
      })
    }

    const connectionId = `${ipAddress}:${port}`

    // 检查是否已连接
    if (dataStore.connections.has(connectionId)) {
      return res.json({
        success: true,
        message: '已连接',
        data: {
          connectionId,
          controller,
          protocol: 'Open Protocol'
        }
      })
    }

    // 创建连接
    const pim = new ProtocolInterfaceModule(ipAddress, port)
    const result = await pim.connect()

    // 保存连接
    dataStore.connections.set(connectionId, {
      pim,
      controller,
      ipAddress,
      port,
      connectTime: new Date().toISOString()
    })

    res.json({
      success: true,
      message: `成功连接到 ${controller}`,
      data: {
        ...result,
        controller
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '连接失败: ' + error.message
    })
  }
})

/**
 * POST /api/tightening/disconnect
 * 断开连接
 */
router.post('/disconnect', (req, res) => {
  try {
    const { connectionId } = req.body

    const connection = dataStore.connections.get(connectionId)
    if (!connection) {
      return res.status(404).json({
        success: false,
        message: '连接不存在'
      })
    }

    connection.pim.disconnect()
    dataStore.connections.delete(connectionId)
    dataCollectionService.stop()

    res.json({
      success: true,
      message: '连接已断开'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '断开失败: ' + error.message
    })
  }
})

/**
 * POST /api/tightening/start-collection
 * 开始数据采集
 */
router.post('/start-collection', (req, res) => {
  try {
    const { connectionId } = req.body

    dataCollectionService.start(connectionId)

    res.json({
      success: true,
      message: '数据采集已启动'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '启动失败: ' + error.message
    })
  }
})

/**
 * POST /api/tightening/stop-collection
 * 停止数据采集
 */
router.post('/stop-collection', (req, res) => {
  try {
    dataCollectionService.stop()

    res.json({
      success: true,
      message: '数据采集已停止'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '停止失败: ' + error.message
    })
  }
})

/**
 * GET /api/tightening/results
 * 获取拧紧结果
 */
router.get('/results', (req, res) => {
  try {
    const { 
      dateFrom, 
      dateTo, 
      result, 
      psetId, 
      vinNumber,
      limit = 1000,
      offset = 0
    } = req.query

    let results = [...dataStore.results]

    // 过滤
    if (dateFrom) {
      results = results.filter(r => new Date(r.timestamp) >= new Date(dateFrom))
    }
    if (dateTo) {
      results = results.filter(r => new Date(r.timestamp) <= new Date(dateTo))
    }
    if (result) {
      results = results.filter(r => r.result === result)
    }
    if (psetId) {
      results = results.filter(r => r.psetId === parseInt(psetId))
    }
    if (vinNumber) {
      results = results.filter(r => r.vinNumber && r.vinNumber.includes(vinNumber))
    }

    // 分页
    const total = results.length
    results = results.slice(offset, offset + parseInt(limit))

    res.json({
      success: true,
      data: {
        results,
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '查询失败: ' + error.message
    })
  }
})

/**
 * GET /api/tightening/statistics
 * 获取统计数据
 */
router.get('/statistics', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        ...dataStore.statistics,
        collectionSpeed: dataCollectionService.collectionSpeed
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '查询失败: ' + error.message
    })
  }
})

/**
 * GET /api/tightening/events
 * 获取控制器事件
 */
router.get('/events', (req, res) => {
  try {
    const { eventLevel, limit = 100 } = req.query

    let events = [...dataStore.events]

    if (eventLevel) {
      events = events.filter(e => e.eventLevel === eventLevel)
    }

    events = events.slice(0, parseInt(limit))

    res.json({
      success: true,
      data: {
        events,
        total: events.length
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '查询失败: ' + error.message
    })
  }
})

/**
 * GET /api/tightening/curves/:resultId
 * 获取拧紧曲线
 */
router.get('/curves/:resultId', (req, res) => {
  try {
    const { resultId } = req.params

    const curve = dataStore.curves.find(c => c.resultId === resultId)

    if (!curve) {
      return res.status(404).json({
        success: false,
        message: '曲线数据不存在'
      })
    }

    res.json({
      success: true,
      data: curve
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '查询失败: ' + error.message
    })
  }
})

/**
 * POST /api/tightening/export
 * 导出数据
 */
router.post('/export', (req, res) => {
  try {
    const { type = 'results', format = 'csv', filters = {} } = req.body

    let data = []
    let filename = ''

    if (type === 'results') {
      data = dataStore.results
      filename = `tightening_results_${Date.now()}.csv`
    } else if (type === 'events') {
      data = dataStore.events
      filename = `controller_events_${Date.now()}.csv`
    }

    // 应用过滤器
    // ... 过滤逻辑

    res.json({
      success: true,
      message: '导出成功',
      data: {
        filename,
        url: `/exports/${filename}`,
        count: data.length
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '导出失败: ' + error.message
    })
  }
})

/**
 * GET /api/tightening/mock-data
 * 生成模拟数据
 */
router.get('/mock-data', (req, res) => {
  try {
    const { count = 100 } = req.query

    // 生成模拟数据
    for (let i = 0; i < parseInt(count); i++) {
      const targetTorque = 35
      const torque = targetTorque + (Math.random() - 0.5) * 8
      const result = Math.random() > 0.15 ? 'OK' : 'NOK'

      dataStore.results.unshift({
        id: Date.now() + Math.random(),
        connectionId: 'mock',
        timestamp: new Date(Date.now() - i * 60000).toISOString(),
        unitName: 'PF4000-MOCK',
        cellId: '1',
        channelId: '1',
        vinNumber: `VIN${String(i).padStart(6, '0')}`,
        jobId: 100,
        psetId: Math.floor(Math.random() * 5) + 1,
        batchSize: 10,
        batchCount: i % 10 + 1,
        result,
        torque: parseFloat(torque.toFixed(2)),
        angle: parseFloat((180 + (Math.random() - 0.5) * 30).toFixed(1)),
        targetTorque,
        targetAngle: 180,
        torqueStatus: result === 'OK' ? 'OK' : 'NOK',
        angleStatus: result === 'OK' ? 'OK' : 'NOK',
        resultTime: new Date().toLocaleString()
      })
    }

    dataCollectionService.updateStatistics()

    res.json({
      success: true,
      message: `已生成${count}条模拟数据`,
      data: dataStore.statistics
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '生成失败: ' + error.message
    })
  }
})

// ========== 数据库维护任务 (Database Jobs) ==========

/**
 * 数据库维护服务
 * 模拟 ToolsNet 数据库维护任务
 */
class DatabaseMaintenanceService {
  constructor() {
    // 维护任务配置
    this.jobs = {
      deleteMaintenanceJob: {
        name: 'ToolsNet_DeleteMaintenance',
        enabled: false,
        daysToKeep: 100,
        description: '删除过期的结果、曲线、程序信息和不再使用的工具数据',
        schedule: 'daily',
        lastRun: null,
        runCount: 0
      },
      deleteUnboundGraphsJob: {
        name: 'ToolsNet_DeleteUnboundGraphs',
        enabled: true,
        description: '删除未关联到结果的曲线数据（主要用于PowerMACS系统）',
        schedule: 'daily',
        lastRun: null,
        runCount: 0
      },
      indexReorganizeJob: {
        name: 'ToolsNet_IndexReorganize',
        enabled: true,
        description: '重组数据库索引以提高报表和结果插入性能',
        schedule: 'daily-except-sunday',
        lastRun: null,
        runCount: 0,
        sqlServerOnly: true
      },
      indexRebuildJob: {
        name: 'ToolsNet_IndexRebuild',
        enabled: true,
        description: '重建数据库索引以提高数据库性能',
        schedule: 'weekly-sunday',
        lastRun: null,
        runCount: 0,
        sqlServerOnly: true
      },
      archiveJob: {
        name: 'ToolsNet_Archive',
        enabled: false,
        description: '将数据从ToolsNet数据库复制到归档数据库',
        schedule: 'manual',
        archiveDatabase: 'ToolsNet_Archive',
        lastRun: null,
        runCount: 0
      }
    }

    // 维护统计
    this.statistics = {
      totalDeletedResults: 0,
      totalDeletedGraphs: 0,
      totalArchivedRecords: 0,
      lastMaintenanceTime: null,
      indexFragmentation: 12.5, // 索引碎片率(%)
      databaseSize: 2.5, // 数据库大小(GB)
      archiveSize: 1.2 // 归档数据库大小(GB)
    }
  }

  /**
   * 执行删除维护任务
   */
  async runDeleteMaintenance() {
    const job = this.jobs.deleteMaintenanceJob
    
    if (!job.enabled) {
      return {
        success: false,
        message: '删除维护任务未启用',
        job: job.name
      }
    }

    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - job.daysToKeep)

      // 删除过期的拧紧结果
      const beforeCount = dataStore.results.length
      dataStore.results = dataStore.results.filter(r => 
        new Date(r.timestamp) > cutoffDate
      )
      const deletedResults = beforeCount - dataStore.results.length

      // 删除过期的曲线数据
      const beforeCurves = dataStore.curves.length
      dataStore.curves = dataStore.curves.filter(c => 
        new Date(c.timestamp) > cutoffDate
      )
      const deletedCurves = beforeCurves - dataStore.curves.length

      // 删除过期的事件
      dataStore.events = dataStore.events.filter(e => 
        new Date(e.timestamp) > cutoffDate
      )

      // 更新统计
      this.statistics.totalDeletedResults += deletedResults
      this.statistics.totalDeletedGraphs += deletedCurves
      job.lastRun = new Date().toISOString()
      job.runCount++

      return {
        success: true,
        message: '删除维护任务完成',
        job: job.name,
        details: {
          deletedResults,
          deletedCurves,
          cutoffDate: cutoffDate.toISOString(),
          remainingResults: dataStore.results.length
        }
      }
    } catch (error) {
      return {
        success: false,
        message: '删除维护任务失败: ' + error.message,
        job: job.name
      }
    }
  }

  /**
   * 删除未绑定的曲线
   */
  async runDeleteUnboundGraphs() {
    const job = this.jobs.deleteUnboundGraphsJob
    
    if (!job.enabled) {
      return {
        success: false,
        message: '未绑定曲线删除任务未启用',
        job: job.name
      }
    }

    try {
      // 获取所有结果ID
      const resultIds = new Set(dataStore.results.map(r => r.id))

      // 删除未关联的曲线
      const beforeCount = dataStore.curves.length
      dataStore.curves = dataStore.curves.filter(c => 
        resultIds.has(c.resultId)
      )
      const deletedCount = beforeCount - dataStore.curves.length

      // 更新统计
      this.statistics.totalDeletedGraphs += deletedCount
      job.lastRun = new Date().toISOString()
      job.runCount++

      return {
        success: true,
        message: '未绑定曲线删除完成',
        job: job.name,
        details: {
          deletedGraphs: deletedCount,
          remainingGraphs: dataStore.curves.length
        }
      }
    } catch (error) {
      return {
        success: false,
        message: '未绑定曲线删除失败: ' + error.message,
        job: job.name
      }
    }
  }

  /**
   * 重组索引
   */
  async runIndexReorganize() {
    const job = this.jobs.indexReorganizeJob
    
    if (!job.enabled) {
      return {
        success: false,
        message: '索引重组任务未启用',
        job: job.name
      }
    }

    try {
      // 模拟索引重组 (实际应执行SQL: ALTER INDEX ... REORGANIZE)
      const startTime = Date.now()
      
      // 模拟处理时间
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const duration = Date.now() - startTime
      const previousFragmentation = this.statistics.indexFragmentation
      this.statistics.indexFragmentation = Math.max(5, previousFragmentation - 3)

      job.lastRun = new Date().toISOString()
      job.runCount++

      return {
        success: true,
        message: '索引重组完成',
        job: job.name,
        details: {
          duration: `${duration}ms`,
          previousFragmentation: `${previousFragmentation.toFixed(1)}%`,
          currentFragmentation: `${this.statistics.indexFragmentation.toFixed(1)}%`,
          tablesProcessed: ['tightening_results', 'tightening_curves', 'controller_events']
        }
      }
    } catch (error) {
      return {
        success: false,
        message: '索引重组失败: ' + error.message,
        job: job.name
      }
    }
  }

  /**
   * 重建索引
   */
  async runIndexRebuild() {
    const job = this.jobs.indexRebuildJob
    
    if (!job.enabled) {
      return {
        success: false,
        message: '索引重建任务未启用',
        job: job.name
      }
    }

    try {
      // 模拟索引重建 (实际应执行SQL: ALTER INDEX ... REBUILD)
      const startTime = Date.now()
      
      // 模拟处理时间（重建比重组慢）
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const duration = Date.now() - startTime
      const previousFragmentation = this.statistics.indexFragmentation
      this.statistics.indexFragmentation = 2.5 // 重建后碎片率很低

      job.lastRun = new Date().toISOString()
      job.runCount++

      return {
        success: true,
        message: '索引重建完成',
        job: job.name,
        details: {
          duration: `${duration}ms`,
          previousFragmentation: `${previousFragmentation.toFixed(1)}%`,
          currentFragmentation: `${this.statistics.indexFragmentation.toFixed(1)}%`,
          tablesProcessed: ['tightening_results', 'tightening_curves', 'controller_events', 'program_versions', 'tools']
        }
      }
    } catch (error) {
      return {
        success: false,
        message: '索引重建失败: ' + error.message,
        job: job.name
      }
    }
  }

  /**
   * 归档数据
   */
  async runArchive() {
    const job = this.jobs.archiveJob
    
    if (!job.enabled) {
      return {
        success: false,
        message: '归档任务未启用',
        job: job.name
      }
    }

    try {
      // 归档策略: 归档3个月前的数据
      const archiveDate = new Date()
      archiveDate.setMonth(archiveDate.getMonth() - 3)

      // 筛选要归档的数据
      const toArchive = dataStore.results.filter(r => 
        new Date(r.timestamp) < archiveDate
      )

      if (toArchive.length === 0) {
        return {
          success: true,
          message: '没有需要归档的数据',
          job: job.name
        }
      }

      // 模拟归档操作 (实际应插入到归档数据库)
      const startTime = Date.now()
      await new Promise(resolve => setTimeout(resolve, 1500))
      const duration = Date.now() - startTime

      // 从主库删除已归档的数据
      const beforeCount = dataStore.results.length
      dataStore.results = dataStore.results.filter(r => 
        new Date(r.timestamp) >= archiveDate
      )
      const archivedCount = beforeCount - dataStore.results.length

      // 更新统计
      this.statistics.totalArchivedRecords += archivedCount
      this.statistics.archiveSize += archivedCount * 0.001 // 假设每条记录1KB
      job.lastRun = new Date().toISOString()
      job.runCount++

      return {
        success: true,
        message: '数据归档完成',
        job: job.name,
        details: {
          archivedRecords: archivedCount,
          archiveDate: archiveDate.toISOString(),
          duration: `${duration}ms`,
          archiveDatabase: job.archiveDatabase,
          currentArchiveSize: `${this.statistics.archiveSize.toFixed(2)} GB`
        }
      }
    } catch (error) {
      return {
        success: false,
        message: '数据归档失败: ' + error.message,
        job: job.name
      }
    }
  }

  /**
   * 获取维护任务配置
   */
  getJobsConfiguration() {
    return {
      jobs: this.jobs,
      statistics: this.statistics
    }
  }

  /**
   * 更新任务配置
   */
  updateJobConfiguration(jobName, config) {
    if (this.jobs[jobName]) {
      this.jobs[jobName] = { ...this.jobs[jobName], ...config }
      return { success: true, job: this.jobs[jobName] }
    }
    return { success: false, message: '任务不存在' }
  }
}

// 创建维护服务实例
const maintenanceService = new DatabaseMaintenanceService()

/**
 * GET /api/tightening/maintenance/jobs
 * 获取维护任务配置
 */
router.get('/maintenance/jobs', (req, res) => {
  try {
    const config = maintenanceService.getJobsConfiguration()
    res.json({
      success: true,
      data: config
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取配置失败: ' + error.message
    })
  }
})

/**
 * PUT /api/tightening/maintenance/jobs/:jobName
 * 更新维护任务配置
 */
router.put('/maintenance/jobs/:jobName', (req, res) => {
  try {
    const { jobName } = req.params
    const config = req.body
    
    const result = maintenanceService.updateJobConfiguration(jobName, config)
    
    if (result.success) {
      res.json({
        success: true,
        message: '配置更新成功',
        data: result.job
      })
    } else {
      res.status(404).json(result)
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新配置失败: ' + error.message
    })
  }
})

/**
 * POST /api/tightening/maintenance/run/:jobName
 * 手动执行维护任务
 */
router.post('/maintenance/run/:jobName', async (req, res) => {
  try {
    const { jobName } = req.params
    let result

    switch (jobName) {
      case 'deleteMaintenanceJob':
        result = await maintenanceService.runDeleteMaintenance()
        break
      case 'deleteUnboundGraphsJob':
        result = await maintenanceService.runDeleteUnboundGraphs()
        break
      case 'indexReorganizeJob':
        result = await maintenanceService.runIndexReorganize()
        break
      case 'indexRebuildJob':
        result = await maintenanceService.runIndexRebuild()
        break
      case 'archiveJob':
        result = await maintenanceService.runArchive()
        break
      default:
        return res.status(404).json({
          success: false,
          message: '未知的维护任务'
        })
    }

    if (result.success) {
      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '执行维护任务失败: ' + error.message
    })
  }
})

/**
 * POST /api/tightening/maintenance/run-all
 * 执行所有启用的维护任务
 */
router.post('/maintenance/run-all', async (req, res) => {
  try {
    const results = []

    // 按顺序执行所有启用的任务
    if (maintenanceService.jobs.deleteMaintenanceJob.enabled) {
      results.push(await maintenanceService.runDeleteMaintenance())
    }
    if (maintenanceService.jobs.deleteUnboundGraphsJob.enabled) {
      results.push(await maintenanceService.runDeleteUnboundGraphs())
    }
    if (maintenanceService.jobs.indexReorganizeJob.enabled) {
      results.push(await maintenanceService.runIndexReorganize())
    }
    if (maintenanceService.jobs.indexRebuildJob.enabled) {
      results.push(await maintenanceService.runIndexRebuild())
    }
    if (maintenanceService.jobs.archiveJob.enabled) {
      results.push(await maintenanceService.runArchive())
    }

    const successCount = results.filter(r => r.success).length
    const totalCount = results.length

    res.json({
      success: successCount === totalCount,
      message: `已执行 ${successCount}/${totalCount} 个维护任务`,
      results
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '执行维护任务失败: ' + error.message
    })
  }
})

/**
 * GET /api/tightening/maintenance/statistics
 * 获取维护统计信息
 */
router.get('/maintenance/statistics', (req, res) => {
  try {
    const stats = maintenanceService.statistics
    
    // 添加实时数据库信息
    const dbInfo = {
      currentResults: dataStore.results.length,
      currentCurves: dataStore.curves.length,
      currentEvents: dataStore.events.length,
      estimatedSize: ((dataStore.results.length * 0.001) + (dataStore.curves.length * 0.005)).toFixed(2) + ' GB'
    }

    res.json({
      success: true,
      data: {
        ...stats,
        database: dbInfo
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取统计信息失败: ' + error.message
    })
  }
})

// ========== ToolsNet Map 结构管理 ==========

/**
 * ToolsNet Map 管理服务
 * 逻辑结构: System → Station → Spindle → Program
 * 
 * 层级说明:
 * - System: 系统（唯一System Number）
 * - Station: 工位（System内唯一Station Number）
 * - Spindle: 主轴（Station内唯一Spindle Number）
 * - Program: 程序（Spindle内唯一Program Number）
 */
class ToolsNetMapService {
  constructor() {
    // 初始化默认结构
    this.initializeDefaultMap()
  }

  /**
   * 初始化默认Map结构
   */
  initializeDefaultMap() {
    if (dataStore.toolsNetMap.systems.length === 0) {
      // 创建示例系统结构
      dataStore.toolsNetMap.systems = [
        {
          systemNumber: 1,
          systemName: 'System 1',
          description: 'Production Line A',
          controllerType: 'PowerFocus 4000',
          ipAddress: '192.168.1.100',
          stations: [
            {
              stationNumber: 1,
              stationName: 'Station 1',
              description: 'Engine Assembly',
              spindles: [
                {
                  spindleNumber: 1,
                  spindleName: 'Spindle 1',
                  description: 'Main Spindle',
                  serialNumber: 'SN-PF4000-001',
                  programs: [
                    {
                      programNumber: 1,
                      programName: 'Program 1',
                      description: 'Cylinder Head Bolts',
                      targetTorque: 35,
                      targetAngle: 180,
                      minTorque: 32,
                      maxTorque: 38,
                      minAngle: 170,
                      maxAngle: 190,
                      lastModified: new Date().toISOString()
                    },
                    {
                      programNumber: 2,
                      programName: 'Program 2',
                      description: 'Oil Pan Bolts',
                      targetTorque: 25,
                      targetAngle: 90,
                      minTorque: 23,
                      maxTorque: 27,
                      minAngle: 85,
                      maxAngle: 95,
                      lastModified: new Date().toISOString()
                    }
                  ]
                },
                {
                  spindleNumber: 2,
                  spindleName: 'Spindle 2',
                  description: 'Backup Spindle',
                  serialNumber: 'SN-PF4000-002',
                  programs: [
                    {
                      programNumber: 1,
                      programName: 'Program 1',
                      description: 'Transmission Bolts',
                      targetTorque: 45,
                      targetAngle: 120,
                      minTorque: 42,
                      maxTorque: 48,
                      minAngle: 115,
                      maxAngle: 125,
                      lastModified: new Date().toISOString()
                    }
                  ]
                }
              ]
            },
            {
              stationNumber: 2,
              stationName: 'Station 2',
              description: 'Chassis Assembly',
              spindles: [
                {
                  spindleNumber: 1,
                  spindleName: 'Spindle 1',
                  description: 'Main Spindle',
                  serialNumber: 'SN-PF4000-003',
                  programs: [
                    {
                      programNumber: 1,
                      programName: 'Program 1',
                      description: 'Suspension Bolts',
                      targetTorque: 60,
                      targetAngle: 240,
                      minTorque: 55,
                      maxTorque: 65,
                      minAngle: 230,
                      maxAngle: 250,
                      lastModified: new Date().toISOString()
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          systemNumber: 2,
          systemName: 'System 2',
          description: 'Production Line B',
          controllerType: 'PowerFocus 6000',
          ipAddress: '192.168.1.101',
          stations: [
            {
              stationNumber: 1,
              stationName: 'Station 1',
              description: 'Final Assembly',
              spindles: [
                {
                  spindleNumber: 1,
                  spindleName: 'Spindle 1',
                  description: 'High Torque Spindle',
                  serialNumber: 'SN-PF6000-001',
                  programs: [
                    {
                      programNumber: 1,
                      programName: 'Program 1',
                      description: 'Wheel Nuts',
                      targetTorque: 120,
                      targetAngle: 360,
                      minTorque: 115,
                      maxTorque: 125,
                      minAngle: 350,
                      maxAngle: 370,
                      lastModified: new Date().toISOString()
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  }

  /**
   * 获取完整的ToolsNet Map
   */
  getFullMap() {
    return {
      systems: dataStore.toolsNetMap.systems,
      summary: {
        totalSystems: dataStore.toolsNetMap.systems.length,
        totalStations: this.countStations(),
        totalSpindles: this.countSpindles(),
        totalPrograms: this.countPrograms()
      }
    }
  }

  /**
   * 根据编号获取系统
   */
  getSystem(systemNumber) {
    return dataStore.toolsNetMap.systems.find(s => s.systemNumber === systemNumber)
  }

  /**
   * 根据编号获取工位
   */
  getStation(systemNumber, stationNumber) {
    const system = this.getSystem(systemNumber)
    return system?.stations.find(st => st.stationNumber === stationNumber)
  }

  /**
   * 根据编号获取主轴
   */
  getSpindle(systemNumber, stationNumber, spindleNumber) {
    const station = this.getStation(systemNumber, stationNumber)
    return station?.spindles.find(sp => sp.spindleNumber === spindleNumber)
  }

  /**
   * 根据编号获取程序
   */
  getProgram(systemNumber, stationNumber, spindleNumber, programNumber) {
    const spindle = this.getSpindle(systemNumber, stationNumber, spindleNumber)
    return spindle?.programs.find(p => p.programNumber === programNumber)
  }

  /**
   * 添加系统
   */
  addSystem(systemData) {
    const existing = this.getSystem(systemData.systemNumber)
    if (existing) {
      return { success: false, message: '系统编号已存在' }
    }

    const newSystem = {
      systemNumber: systemData.systemNumber,
      systemName: systemData.systemName || `System ${systemData.systemNumber}`,
      description: systemData.description || '',
      controllerType: systemData.controllerType || '',
      ipAddress: systemData.ipAddress || '',
      stations: []
    }

    dataStore.toolsNetMap.systems.push(newSystem)
    return { success: true, data: newSystem }
  }

  /**
   * 添加工位
   */
  addStation(systemNumber, stationData) {
    const system = this.getSystem(systemNumber)
    if (!system) {
      return { success: false, message: '系统不存在' }
    }

    const existing = system.stations.find(st => st.stationNumber === stationData.stationNumber)
    if (existing) {
      return { success: false, message: '工位编号在该系统中已存在' }
    }

    const newStation = {
      stationNumber: stationData.stationNumber,
      stationName: stationData.stationName || `Station ${stationData.stationNumber}`,
      description: stationData.description || '',
      spindles: []
    }

    system.stations.push(newStation)
    return { success: true, data: newStation }
  }

  /**
   * 添加主轴
   */
  addSpindle(systemNumber, stationNumber, spindleData) {
    const station = this.getStation(systemNumber, stationNumber)
    if (!station) {
      return { success: false, message: '工位不存在' }
    }

    const existing = station.spindles.find(sp => sp.spindleNumber === spindleData.spindleNumber)
    if (existing) {
      return { success: false, message: '主轴编号在该工位中已存在' }
    }

    const newSpindle = {
      spindleNumber: spindleData.spindleNumber,
      spindleName: spindleData.spindleName || `Spindle ${spindleData.spindleNumber}`,
      description: spindleData.description || '',
      serialNumber: spindleData.serialNumber || '',
      programs: []
    }

    station.spindles.push(newSpindle)
    return { success: true, data: newSpindle }
  }

  /**
   * 添加程序
   */
  addProgram(systemNumber, stationNumber, spindleNumber, programData) {
    const spindle = this.getSpindle(systemNumber, stationNumber, spindleNumber)
    if (!spindle) {
      return { success: false, message: '主轴不存在' }
    }

    const existing = spindle.programs.find(p => p.programNumber === programData.programNumber)
    if (existing) {
      return { success: false, message: '程序编号在该主轴中已存在' }
    }

    const newProgram = {
      programNumber: programData.programNumber,
      programName: programData.programName || `Program ${programData.programNumber}`,
      description: programData.description || '',
      targetTorque: programData.targetTorque || 0,
      targetAngle: programData.targetAngle || 0,
      minTorque: programData.minTorque || 0,
      maxTorque: programData.maxTorque || 0,
      minAngle: programData.minAngle || 0,
      maxAngle: programData.maxAngle || 0,
      lastModified: new Date().toISOString()
    }

    spindle.programs.push(newProgram)
    return { success: true, data: newProgram }
  }

  /**
   * 更新系统信息
   */
  updateSystem(systemNumber, updateData) {
    const system = this.getSystem(systemNumber)
    if (!system) {
      return { success: false, message: '系统不存在' }
    }

    Object.assign(system, updateData)
    return { success: true, data: system }
  }

  /**
   * 更新工位信息
   */
  updateStation(systemNumber, stationNumber, updateData) {
    const station = this.getStation(systemNumber, stationNumber)
    if (!station) {
      return { success: false, message: '工位不存在' }
    }

    Object.assign(station, updateData)
    return { success: true, data: station }
  }

  /**
   * 更新主轴信息
   */
  updateSpindle(systemNumber, stationNumber, spindleNumber, updateData) {
    const spindle = this.getSpindle(systemNumber, stationNumber, spindleNumber)
    if (!spindle) {
      return { success: false, message: '主轴不存在' }
    }

    Object.assign(spindle, updateData)
    return { success: true, data: spindle }
  }

  /**
   * 更新程序信息
   */
  updateProgram(systemNumber, stationNumber, spindleNumber, programNumber, updateData) {
    const program = this.getProgram(systemNumber, stationNumber, spindleNumber, programNumber)
    if (!program) {
      return { success: false, message: '程序不存在' }
    }

    Object.assign(program, updateData)
    program.lastModified = new Date().toISOString()
    return { success: true, data: program }
  }

  /**
   * 根据Result电报构建Map结构
   */
  buildMapFromResult(resultData) {
    const { systemNumber, stationNumber, spindleNumber, programNumber } = resultData

    // 确保系统存在
    let system = this.getSystem(systemNumber)
    if (!system) {
      this.addSystem({
        systemNumber,
        systemName: `System ${systemNumber}`,
        description: 'Auto-created from Result telegram'
      })
      system = this.getSystem(systemNumber)
    }

    // 确保工位存在
    let station = this.getStation(systemNumber, stationNumber)
    if (!station) {
      this.addStation(systemNumber, {
        stationNumber,
        stationName: `Station ${stationNumber}`,
        description: 'Auto-created from Result telegram'
      })
      station = this.getStation(systemNumber, stationNumber)
    }

    // 确保主轴存在
    let spindle = this.getSpindle(systemNumber, stationNumber, spindleNumber)
    if (!spindle) {
      this.addSpindle(systemNumber, stationNumber, {
        spindleNumber,
        spindleName: `Spindle ${spindleNumber}`,
        description: 'Auto-created from Result telegram'
      })
      spindle = this.getSpindle(systemNumber, stationNumber, spindleNumber)
    }

    // 确保程序存在
    let program = this.getProgram(systemNumber, stationNumber, spindleNumber, programNumber)
    if (!program) {
      this.addProgram(systemNumber, stationNumber, spindleNumber, {
        programNumber,
        programName: `Program ${programNumber}`,
        description: 'Auto-created from Result telegram',
        targetTorque: resultData.targetTorque || 0,
        targetAngle: resultData.targetAngle || 0
      })
    }

    return {
      success: true,
      message: 'Map structure ensured',
      path: `System ${systemNumber} → Station ${stationNumber} → Spindle ${spindleNumber} → Program ${programNumber}`
    }
  }

  /**
   * 统计方法
   */
  countStations() {
    return dataStore.toolsNetMap.systems.reduce((sum, sys) => sum + sys.stations.length, 0)
  }

  countSpindles() {
    return dataStore.toolsNetMap.systems.reduce((sum, sys) => 
      sum + sys.stations.reduce((stSum, st) => stSum + st.spindles.length, 0), 0)
  }

  countPrograms() {
    return dataStore.toolsNetMap.systems.reduce((sum, sys) => 
      sum + sys.stations.reduce((stSum, st) => 
        stSum + st.spindles.reduce((spSum, sp) => spSum + sp.programs.length, 0), 0), 0)
  }

  /**
   * 获取层级路径
   */
  getHierarchyPath(systemNumber, stationNumber, spindleNumber, programNumber) {
    const system = this.getSystem(systemNumber)
    const station = this.getStation(systemNumber, stationNumber)
    const spindle = this.getSpindle(systemNumber, stationNumber, spindleNumber)
    const program = this.getProgram(systemNumber, stationNumber, spindleNumber, programNumber)

    return {
      system: system || null,
      station: station || null,
      spindle: spindle || null,
      program: program || null,
      path: [
        system?.systemName || `System ${systemNumber}`,
        station?.stationName || `Station ${stationNumber}`,
        spindle?.spindleName || `Spindle ${spindleNumber}`,
        program?.programName || `Program ${programNumber}`
      ].join(' → ')
    }
  }
}

// 创建ToolsNet Map服务实例
const toolsNetMapService = new ToolsNetMapService()

// ========== ToolsNet Map API 路由 ==========

/**
 * GET /api/tightening/map
 * 获取完整的ToolsNet Map结构
 */
router.get('/map', (req, res) => {
  try {
    const mapData = toolsNetMapService.getFullMap()
    res.json({
      success: true,
      data: mapData
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '获取Map结构失败: ' + error.message
    })
  }
})

/**
 * GET /api/tightening/map/system/:systemNumber
 * 获取指定系统信息
 */
router.get('/map/system/:systemNumber', (req, res) => {
  try {
    const systemNumber = parseInt(req.params.systemNumber)
    const system = toolsNetMapService.getSystem(systemNumber)
    
    if (system) {
      res.json({
        success: true,
        data: system
      })
    } else {
      res.status(404).json({
        success: false,
        message: '系统不存在'
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '查询失败: ' + error.message
    })
  }
})

/**
 * GET /api/tightening/map/hierarchy
 * 获取指定层级路径
 */
router.get('/map/hierarchy', (req, res) => {
  try {
    const { systemNumber, stationNumber, spindleNumber, programNumber } = req.query
    
    const hierarchy = toolsNetMapService.getHierarchyPath(
      parseInt(systemNumber),
      parseInt(stationNumber),
      parseInt(spindleNumber),
      parseInt(programNumber)
    )
    
    res.json({
      success: true,
      data: hierarchy
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '查询失败: ' + error.message
    })
  }
})

/**
 * POST /api/tightening/map/system
 * 添加新系统
 */
router.post('/map/system', (req, res) => {
  try {
    const result = toolsNetMapService.addSystem(req.body)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '添加系统失败: ' + error.message
    })
  }
})

/**
 * POST /api/tightening/map/station
 * 添加新工位
 */
router.post('/map/station', (req, res) => {
  try {
    const { systemNumber, ...stationData } = req.body
    const result = toolsNetMapService.addStation(systemNumber, stationData)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '添加工位失败: ' + error.message
    })
  }
})

/**
 * POST /api/tightening/map/spindle
 * 添加新主轴
 */
router.post('/map/spindle', (req, res) => {
  try {
    const { systemNumber, stationNumber, ...spindleData } = req.body
    const result = toolsNetMapService.addSpindle(systemNumber, stationNumber, spindleData)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '添加主轴失败: ' + error.message
    })
  }
})

/**
 * POST /api/tightening/map/program
 * 添加新程序
 */
router.post('/map/program', (req, res) => {
  try {
    const { systemNumber, stationNumber, spindleNumber, ...programData } = req.body
    const result = toolsNetMapService.addProgram(
      systemNumber, 
      stationNumber, 
      spindleNumber, 
      programData
    )
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '添加程序失败: ' + error.message
    })
  }
})

/**
 * PUT /api/tightening/map/system/:systemNumber
 * 更新系统信息
 */
router.put('/map/system/:systemNumber', (req, res) => {
  try {
    const systemNumber = parseInt(req.params.systemNumber)
    const result = toolsNetMapService.updateSystem(systemNumber, req.body)
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(404).json(result)
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新系统失败: ' + error.message
    })
  }
})

/**
 * PUT /api/tightening/map/program
 * 更新程序信息
 */
router.put('/map/program', (req, res) => {
  try {
    const { systemNumber, stationNumber, spindleNumber, programNumber, ...updateData } = req.body
    const result = toolsNetMapService.updateProgram(
      systemNumber,
      stationNumber,
      spindleNumber,
      programNumber,
      updateData
    )
    
    if (result.success) {
      res.json(result)
    } else {
      res.status(404).json(result)
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '更新程序失败: ' + error.message
    })
  }
})

/**
 * POST /api/tightening/map/build-from-result
 * 根据Result电报自动构建Map结构
 */
router.post('/map/build-from-result', (req, res) => {
  try {
    const result = toolsNetMapService.buildMapFromResult(req.body)
    res.json(result)
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '构建Map结构失败: ' + error.message
    })
  }
})

export default router
