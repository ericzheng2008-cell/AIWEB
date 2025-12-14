import { defineStore } from 'pinia'

/**
 * 拧紧数据采集分析 Store
 * 基于 Open Protocol 协议
 * 支持 Atlas Copco PF4000/PF6000/PF8000 控制器
 * 符合 ToolsNet 8 规范
 */
export const useTighteningDataStore = defineStore('tighteningData', {
  state: () => ({
    // 工厂结构 (Plant Structure)
    plantStructure: {
      nodes: [], // 层级结构节点
      currentNode: null
    },

    // 连接状态
    connection: {
      status: 'disconnected', // disconnected, connecting, connected
      controller: null, // PF4000, PF6000, PF8000
      systemType: 'PowerFocus',
      ipAddress: '',
      port: 4545, // Open Protocol 默认端口
      lastConnectTime: null,
      collectionSpeed: { // 数据采集速度
        resultsPerMinute: 0,
        resultsPerSecond: 0
      }
    },

    // 实时数据采集
    realtimeData: {
      currentJob: null,
      currentPset: null,
      lastResult: null,
      isRunning: false,
      latestResults: [] // 最新10条结果
    },

    // 拧紧结果数据
    tighteningResults: [],

    // 拧紧曲线数据 (Trace Analysis)
    tighteningCurves: [],

    // 程序数据 (Program Data)
    programs: [],
    programVersions: [],

    // 工具数据 (Tool Center)
    tools: [],
    toolStatistics: [],
    serviceLog: [],

    // 数据统计
    statistics: {
      total: 0,
      ok: 0,
      nok: 0,
      okRepaired: 0,
      okRate: 0,
      nokRate: 0,
      avgTorque: 0,
      avgAngle: 0,
      avgTime: 0
    },

    // TOP NOK 应用程序
    topNokApplications: [],

    // 异常数据 & 控制器事件
    anomalies: [],
    controllerEvents: [],
    eventSummary: [],

    // 报警配置
    alarmConfig: {
      enabled: true,
      nokAlarm: true,
      torqueDeviation: 10, // 扭矩偏差百分比
      angleDeviation: 15, // 角度偏差百分比
      consecutiveNok: 3, // 连续NOK报警
      lowCpk: 1.33, // Cpk低于此值报警
      emailNotification: false,
      emailRecipients: []
    },

    // 数据过滤器
    filters: {
      dateRange: [null, null],
      maxDays: 7, // TOP NOK最大天数
      result: 'all', // all, ok, nok
      psetId: null,
      programName: '',
      jobId: null,
      batchId: null,
      identifier: '', // VIN号
      boltNumber: null,
      plantStructure: null,
      eventLevel: 'all', // all, info, warning, error
      valueType: 'torque', // torque, angle, rundown_angle
      status: 'all', // all, ok, nok
      maxResults: 1000,
      // 新增筛选条件
      workshop: 'all', // 车间名称
      productionLine: 'all', // 线体名称
      toolModel: 'all', // 工具型号
      snNumber: '', // SN编号
      shift: 'all' // 白班/夜班
    },

    // 车间列表
    workshops: [
      '一部总装',
      '一部焊装',
      '二部总装',
      '二部焊装',
      '三部总装',
      '三部焊装',
      '发动机工厂',
      '变速箱工厂'
    ],

    // 线体列表
    productionLines: [
      '总装1线',
      '总装2线'
    ],

    // 工具型号列表
    toolModels: [
      'ST31-30',
      'ST61-60',
      'ST101-80'
    ]
  }),


  getters: {
    // 获取过滤后的拧紧结果
    filteredResults: (state) => {
      let results = [...state.tighteningResults]

      // 按日期过滤
      if (state.filters.dateRange[0] && state.filters.dateRange[1]) {
        results = results.filter(r => {
          const date = new Date(r.timestamp)
          return date >= state.filters.dateRange[0] && date <= state.filters.dateRange[1]
        })
      }

      // 按结果过滤
      if (state.filters.result !== 'all') {
        results = results.filter(r => r.result.toLowerCase() === state.filters.result)
      }

      // 按Pset过滤
      if (state.filters.psetId) {
        results = results.filter(r => r.psetId === state.filters.psetId)
      }

      // 按程序名称过滤
      if (state.filters.programName) {
        results = results.filter(r => r.programName && r.programName.includes(state.filters.programName))
      }

      // 按Job过滤
      if (state.filters.jobId) {
        results = results.filter(r => r.jobId === state.filters.jobId)
      }

      // 按批次过滤
      if (state.filters.batchId) {
        results = results.filter(r => r.batchId === state.filters.batchId)
      }

      // 按VIN号过滤
      if (state.filters.identifier) {
        results = results.filter(r => r.identifier && r.identifier.includes(state.filters.identifier))
      }

      // 按螺栓号过滤 (PowerMACS)
      if (state.filters.boltNumber) {
        results = results.filter(r => r.boltNumber === state.filters.boltNumber)
      }

      // 按车间过滤
      if (state.filters.workshop && state.filters.workshop !== 'all') {
        results = results.filter(r => r.workshop === state.filters.workshop)
      }

      // 按线体过滤
      if (state.filters.productionLine && state.filters.productionLine !== 'all') {
        results = results.filter(r => r.productionLine === state.filters.productionLine)
      }

      // 按工具型号过滤
      if (state.filters.toolModel && state.filters.toolModel !== 'all') {
        results = results.filter(r => r.toolModel === state.filters.toolModel)
      }

      // 按SN编号过滤
      if (state.filters.snNumber) {
        results = results.filter(r => r.snNumber && r.snNumber.includes(state.filters.snNumber))
      }

      // 按班次过滤
      if (state.filters.shift && state.filters.shift !== 'all') {
        results = results.filter(r => r.shift === state.filters.shift)
      }

      // 限制最大结果数
      if (state.filters.maxResults && results.length > state.filters.maxResults) {
        results = results.slice(0, state.filters.maxResults)
      }

      return results
    },

    // 计算过滤后的统计数据
    filteredStatistics: (state) => {
      const results = state.filteredResults || []
      if (results.length === 0) {
        return {
          total: 0,
          ok: 0,
          nok: 0,
          okRepaired: 0,
          okRate: 0,
          nokRate: 0,
          avgTorque: 0,
          avgAngle: 0,
          avgTime: 0
        }
      }

      const ok = results.filter(r => r.result === 'OK').length
      const nok = results.filter(r => r.result === 'NOK').length
      const okRepaired = results.filter(r => r.result === 'OK_REPAIRED').length
      const avgTorque = results.reduce((sum, r) => sum + r.torque, 0) / results.length
      const avgAngle = results.reduce((sum, r) => sum + r.angle, 0) / results.length
      const avgTime = results.reduce((sum, r) => sum + r.tighteningTime, 0) / results.length

      return {
        total: results.length,
        ok,
        nok,
        okRepaired,
        okRate: (ok / results.length * 100).toFixed(2),
        nokRate: (nok / results.length * 100).toFixed(2),
        okRepairedRate: (okRepaired / results.length * 100).toFixed(2),
        avgTorque: avgTorque.toFixed(2),
        avgAngle: avgAngle.toFixed(2),
        avgTime: avgTime.toFixed(3)
      }
    },

    // 获取最近的异常
    recentAnomalies: (state) => {
      return state.anomalies.slice(-20).reverse()
    },

    // 获取最近的控制器事件
    recentControllerEvents: (state) => {
      let events = [...state.controllerEvents]
      
      // 按事件级别过滤
      if (state.filters.eventLevel !== 'all') {
        events = events.filter(e => e.level === state.filters.eventLevel)
      }

      // 按日期过滤
      if (state.filters.dateRange[0] && state.filters.dateRange[1]) {
        events = events.filter(e => {
          const date = new Date(e.timestamp)
          return date >= state.filters.dateRange[0] && date <= state.filters.dateRange[1]
        })
      }

      // 限制最大结果数
      if (state.filters.maxResults && events.length > state.filters.maxResults) {
        events = events.slice(0, state.filters.maxResults)
      }

      return events.slice(-50).reverse()
    },

    // 计算 TOP NOK 应用程序
    topNokApplications: (state) => {
      const results = state.filteredResults
      if (results.length === 0) return []

      // 按程序分组
      const programGroups = {}
      results.forEach(r => {
        const key = r.programName || `Pset-${r.psetId}`
        if (!programGroups[key]) {
          programGroups[key] = {
            programName: key,
            psetId: r.psetId,
            total: 0,
            ok: 0,
            nok: 0,
            nokReasons: {}
          }
        }
        programGroups[key].total++
        if (r.result === 'OK') {
          programGroups[key].ok++
        } else if (r.result === 'NOK') {
          programGroups[key].nok++
          const reason = r.nokReason || 'Unknown'
          programGroups[key].nokReasons[reason] = (programGroups[key].nokReasons[reason] || 0) + 1
        }
      })

      // 计算NOK百分比并排序
      const programList = Object.values(programGroups).map(p => ({
        ...p,
        nokRate: (p.nok / p.total * 100).toFixed(2)
      }))

      // 按NOK率降序排序，返回前10个
      return programList
        .sort((a, b) => parseFloat(b.nokRate) - parseFloat(a.nokRate))
        .slice(0, 10)
    },

    // 计算Cpk (过程能力指数)
    cpkAnalysis: (state) => {
      const results = state.filteredResults || []
      if (results.length < 30) {
        return null // 数据量不足
      }

      // 根据值类型选择数据
      let dataValues
      let targetValue
      let upperSpec
      let lowerSpec

      if (state.filters.valueType === 'torque') {
        dataValues = results.map(r => r.torque)
        targetValue = results[0].targetTorque
        upperSpec = targetValue * 1.1 // +10%
        lowerSpec = targetValue * 0.9 // -10%
      } else if (state.filters.valueType === 'angle') {
        dataValues = results.map(r => r.angle)
        targetValue = results[0].targetAngle || 180
        upperSpec = targetValue * 1.15
        lowerSpec = targetValue * 0.85
      } else {
        dataValues = results.map(r => r.rundownAngle || r.angle)
        targetValue = 90
        upperSpec = 110
        lowerSpec = 70
      }

      // 计算均值
      const mean = dataValues.reduce((sum, v) => sum + v, 0) / dataValues.length
      
      // 计算标准差
      const variance = dataValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / (dataValues.length - 1)
      const stdDev = Math.sqrt(variance)

      // 计算过程能力指数
      const cpu = (upperSpec - mean) / (3 * stdDev)
      const cpl = (mean - lowerSpec) / (3 * stdDev)
      const cpk = Math.min(cpu, cpl)
      const cp = (upperSpec - lowerSpec) / (6 * stdDev)

      // 计算控制限 (±3σ)
      const ucl = mean + 3 * stdDev // Upper Control Limit
      const lcl = mean - 3 * stdDev // Lower Control Limit

      return {
        cpk: cpk.toFixed(3),
        cp: cp.toFixed(3),
        cpu: cpu.toFixed(3),
        cpl: cpl.toFixed(3),
        mean: mean.toFixed(2),
        stdDev: stdDev.toFixed(3),
        variance: variance.toFixed(3),
        target: targetValue.toFixed(2),
        upperLimit: upperSpec.toFixed(2),
        lowerLimit: lowerSpec.toFixed(2),
        ucl: ucl.toFixed(2),
        lcl: lcl.toFixed(2),
        minValue: Math.min(...dataValues).toFixed(2),
        maxValue: Math.max(...dataValues).toFixed(2),
        range: (Math.max(...dataValues) - Math.min(...dataValues)).toFixed(2),
        sampleSize: dataValues.length
      }
    },

    // X-Bar / Range 控制图数据
    xBarRangeData: (state) => {
      const results = state.filteredResults || []
      if (results.length < 10) return null

      const groupSize = 5 // 子组大小
      const groups = []

      for (let i = 0; i < results.length; i += groupSize) {
        const group = results.slice(i, i + groupSize)
        if (group.length === groupSize) {
          const torques = group.map(r => r.torque)
          const mean = torques.reduce((a, b) => a + b, 0) / groupSize
          const range = Math.max(...torques) - Math.min(...torques)
          
          groups.push({
            index: groups.length + 1,
            mean: mean.toFixed(2),
            range: range.toFixed(2),
            timestamp: group[0].timestamp
          })
        }
      }

      // 计算总均值和控制限
      const overallMean = groups.reduce((sum, g) => sum + parseFloat(g.mean), 0) / groups.length
      const avgRange = groups.reduce((sum, g) => sum + parseFloat(g.range), 0) / groups.length

      // 控制图常数 (n=5)
      const A2 = 0.577
      const D3 = 0
      const D4 = 2.114

      return {
        groups: groups.slice(0, 10), // 显示最近10个子组
        xBar: {
          mean: overallMean.toFixed(2),
          ucl: (overallMean + A2 * avgRange).toFixed(2),
          lcl: (overallMean - A2 * avgRange).toFixed(2)
        },
        range: {
          mean: avgRange.toFixed(2),
          ucl: (D4 * avgRange).toFixed(2),
          lcl: (D3 * avgRange).toFixed(2)
        }
      }
    }
  },


  actions: {
    // ========== 连接管理 ==========
    
    // 连接到控制器
    async connectToController(ipAddress, controller = 'PF4000') {
      this.connection.status = 'connecting'
      this.connection.ipAddress = ipAddress
      this.connection.controller = controller
      this.connection.systemType = controller.startsWith('PF') ? 'PowerFocus' : 'PowerMACS'

      // 模拟Open Protocol连接握手
      await new Promise(resolve => setTimeout(resolve, 1500))

      this.connection.status = 'connected'
      this.connection.lastConnectTime = new Date()
      
      // 初始化工厂结构
      this.initPlantStructure()
      
      return { 
        success: true, 
        message: `成功连接到 ${controller} (${ipAddress})`,
        protocol: 'Open Protocol',
        version: '2.8.0'
      }
    },

    // 断开连接
    disconnect() {
      this.connection.status = 'disconnected'
      this.connection.ipAddress = ''
      this.realtimeData.isRunning = false
      this.connection.collectionSpeed = { resultsPerMinute: 0, resultsPerSecond: 0 }
    },

    // 初始化工厂结构
    initPlantStructure() {
      this.plantStructure.nodes = [
        { id: 'root', name: '总装车间', type: 'plant', children: ['line1', 'line2'] },
        { id: 'line1', name: '生产线1', type: 'line', parent: 'root', children: ['station1', 'station2'] },
        { id: 'line2', name: '生产线2', type: 'line', parent: 'root', children: ['station3', 'station4'] },
        { id: 'station1', name: '工位1', type: 'station', parent: 'line1', unitName: 'PF4000-001' },
        { id: 'station2', name: '工位2', type: 'station', parent: 'line1', unitName: 'PF4000-002' },
        { id: 'station3', name: '工位3', type: 'station', parent: 'line2', unitName: 'PF8000-001' },
        { id: 'station4', name: '工位4', type: 'station', parent: 'line2', unitName: 'PF8000-002' }
      ]
      this.plantStructure.currentNode = 'root'
    },

    // ========== 数据采集 ==========
    
    // 开始数据采集
    startDataCollection() {
      if (this.connection.status !== 'connected') {
        throw new Error('未连接到控制器')
      }
      this.realtimeData.isRunning = true
      
      // 开始计算采集速度
      this.startCollectionSpeedMonitor()
    },

    // 停止数据采集
    stopDataCollection() {
      this.realtimeData.isRunning = false
      this.connection.collectionSpeed = { resultsPerMinute: 0, resultsPerSecond: 0 }
    },

    // 监控数据采集速度
    startCollectionSpeedMonitor() {
      let lastCount = this.tighteningResults.length
      let lastTime = Date.now()

      const monitorInterval = setInterval(() => {
        if (!this.realtimeData.isRunning) {
          clearInterval(monitorInterval)
          return
        }

        const currentCount = this.tighteningResults.length
        const currentTime = Date.now()
        const timeDiff = (currentTime - lastTime) / 1000 // 秒
        const countDiff = currentCount - lastCount

        this.connection.collectionSpeed = {
          resultsPerSecond: (countDiff / timeDiff).toFixed(2),
          resultsPerMinute: ((countDiff / timeDiff) * 60).toFixed(0)
        }

        lastCount = currentCount
        lastTime = currentTime
      }, 5000) // 每5秒更新一次
    },

    // 添加拧紧结果
    addTighteningResult(result) {
      // 生成唯一ID
      result.id = Date.now() + Math.random()
      result.timestamp = result.timestamp || new Date().toISOString()
      
      // 添加详细字段
      result.unitName = result.unitName || this.connection.controller
      result.programName = result.programName || `Program_${result.psetId}`
      result.programId = result.psetId
      result.resultTime = result.timestamp
      
      // 扭矩状态判断
      result.torqueStatus = this.checkValueStatus(
        result.torque, 
        result.torqueLowerLimit || result.targetTorque * 0.9, 
        result.torqueUpperLimit || result.targetTorque * 1.1
      )
      
      // 角度状态判断
      result.angleStatus = this.checkValueStatus(
        result.angle,
        result.angleLowerLimit || result.targetAngle * 0.85,
        result.angleUpperLimit || result.targetAngle * 1.15
      )
      
      // 详细拧紧状态
      result.detailedStatus = this.getDetailedStatus(result)

      // 保存结果
      this.tighteningResults.unshift(result)
      
      // 更新最新结果列表
      this.realtimeData.latestResults = this.tighteningResults.slice(0, 10)

      // 限制存储数量（最多保存10000条）
      if (this.tighteningResults.length > 10000) {
        this.tighteningResults = this.tighteningResults.slice(0, 10000)
      }

      // 更新统计
      this.updateStatistics()

      // 检查异常
      this.checkAnomalies(result)

      // 保存到本地存储
      this.saveTighteningResults()
    },

    // 检查值状态
    checkValueStatus(value, lowerLimit, upperLimit) {
      if (value < lowerLimit) return 'LOW'
      if (value > upperLimit) return 'HIGH'
      return 'OK'
    },

    // 获取详细状态
    getDetailedStatus(result) {
      if (result.result === 'OK') return 'OK'
      
      const reasons = []
      if (result.torqueStatus !== 'OK') reasons.push(`扭矩${result.torqueStatus === 'LOW' ? '过低' : '过高'}`)
      if (result.angleStatus !== 'OK') reasons.push(`角度${result.angleStatus === 'LOW' ? '过低' : '过高'}`)
      if (result.rundownAngleStatus && result.rundownAngleStatus !== 'OK') reasons.push('下降角度异常')
      
      return reasons.length > 0 ? reasons.join(', ') : 'NOK'
    },

    // 添加拧紧曲线 (Trace)
    addTighteningCurve(curve) {
      curve.id = Date.now() + Math.random()
      curve.timestamp = curve.timestamp || new Date().toISOString()
      curve.programName = curve.programName || `Program_${curve.psetId}`

      this.tighteningCurves.unshift(curve)

      // 限制存储数量（曲线数据较大，最多保存1000条）
      if (this.tighteningCurves.length > 1000) {
        this.tighteningCurves = this.tighteningCurves.slice(0, 1000)
      }

      this.saveTighteningCurves()
    },

    // ========== 统计分析 ==========
    
    // 更新统计数据
    updateStatistics() {
      const total = this.tighteningResults.length
      if (total === 0) return

      const ok = this.tighteningResults.filter(r => r.result === 'OK').length
      const nok = this.tighteningResults.filter(r => r.result === 'NOK').length
      const okRepaired = this.tighteningResults.filter(r => r.result === 'OK_REPAIRED').length
      const avgTorque = this.tighteningResults.reduce((sum, r) => sum + r.torque, 0) / total
      const avgAngle = this.tighteningResults.reduce((sum, r) => sum + r.angle, 0) / total
      const avgTime = this.tighteningResults.reduce((sum, r) => sum + r.tighteningTime, 0) / total

      this.statistics = {
        total,
        ok,
        nok,
        okRepaired,
        okRate: (ok / total * 100).toFixed(2),
        nokRate: (nok / total * 100).toFixed(2),
        okRepairedRate: (okRepaired / total * 100).toFixed(2),
        avgTorque: avgTorque.toFixed(2),
        avgAngle: avgAngle.toFixed(2),
        avgTime: avgTime.toFixed(3)
      }
    },

    // ========== 异常检测 ==========
    
    // 检查异常
    checkAnomalies(result) {
      if (!this.alarmConfig.enabled) return

      const anomalies = []

      // NOK结果报警
      if (this.alarmConfig.nokAlarm && result.result === 'NOK') {
        anomalies.push({
          type: 'NOK',
          level: 'warning',
          message: `拧紧NOK - ${result.detailedStatus || result.nokReason || '未知原因'}`,
          resultId: result.id,
          programName: result.programName,
          unitName: result.unitName,
          timestamp: new Date().toISOString()
        })
      }

      // 扭矩偏差报警
      const torqueDeviation = Math.abs((result.torque - result.targetTorque) / result.targetTorque * 100)
      if (torqueDeviation > this.alarmConfig.torqueDeviation) {
        anomalies.push({
          type: 'TORQUE_DEVIATION',
          level: 'error',
          message: `扭矩偏差过大: ${torqueDeviation.toFixed(1)}% (目标: ${result.targetTorque}Nm, 实际: ${result.torque}Nm)`,
          resultId: result.id,
          programName: result.programName,
          unitName: result.unitName,
          timestamp: new Date().toISOString()
        })
      }

      // 角度偏差报警
      if (result.angle && result.targetAngle) {
        const angleDeviation = Math.abs((result.angle - result.targetAngle) / result.targetAngle * 100)
        if (angleDeviation > this.alarmConfig.angleDeviation) {
          anomalies.push({
            type: 'ANGLE_DEVIATION',
            level: 'warning',
            message: `角度偏差过大: ${angleDeviation.toFixed(1)}% (目标: ${result.targetAngle}°, 实际: ${result.angle}°)`,
            resultId: result.id,
            programName: result.programName,
            unitName: result.unitName,
            timestamp: new Date().toISOString()
          })
        }
      }

      // 连续NOK报警
      const recentResults = this.tighteningResults.slice(0, this.alarmConfig.consecutiveNok)
      const consecutiveNok = recentResults.every(r => r.result === 'NOK')
      if (consecutiveNok && recentResults.length === this.alarmConfig.consecutiveNok) {
        anomalies.push({
          type: 'CONSECUTIVE_NOK',
          level: 'critical',
          message: `连续${this.alarmConfig.consecutiveNok}次拧紧NOK，请立即检查设备和工艺参数`,
          resultId: result.id,
          programName: result.programName,
          unitName: result.unitName,
          timestamp: new Date().toISOString()
        })
      }

      // Cpk低值报警
      const cpkData = this.cpkAnalysis
      if (cpkData && parseFloat(cpkData.cpk) < this.alarmConfig.lowCpk) {
        anomalies.push({
          type: 'LOW_CPK',
          level: 'error',
          message: `过程能力指数过低: Cpk=${cpkData.cpk} (要求≥${this.alarmConfig.lowCpk})，过程稳定性不足`,
          resultId: result.id,
          programName: result.programName,
          cpk: cpkData.cpk,
          timestamp: new Date().toISOString()
        })
      }

      // 保存异常
      if (anomalies.length > 0) {
        this.anomalies.push(...anomalies)
        
        // 限制异常记录数量
        if (this.anomalies.length > 1000) {
          this.anomalies = this.anomalies.slice(-1000)
        }

        // 如果启用邮件通知，发送报警邮件
        if (this.alarmConfig.emailNotification && this.alarmConfig.emailRecipients.length > 0) {
          this.sendAlarmEmail(anomalies)
        }
      }
    },

    // 发送报警邮件
    sendAlarmEmail(anomalies) {
      console.log('发送报警邮件:', {
        recipients: this.alarmConfig.emailRecipients,
        anomalies
      })
      // 实际实现需要后端API支持
    },

    // 添加控制器事件
    addControllerEvent(event) {
      event.id = Date.now() + Math.random()
      event.timestamp = event.timestamp || new Date().toISOString()
      event.acknowledged = event.acknowledged || false

      this.controllerEvents.unshift(event)

      // 限制数量
      if (this.controllerEvents.length > 5000) {
        this.controllerEvents = this.controllerEvents.slice(0, 5000)
      }

      // 更新事件摘要
      this.updateEventSummary()
    },

    // 更新事件摘要
    updateEventSummary() {
      const summary = {}
      this.controllerEvents.forEach(event => {
        const key = `${event.eventCode}_${event.eventDescription}`
        if (!summary[key]) {
          summary[key] = {
            eventCode: event.eventCode,
            eventDescription: event.eventDescription,
            eventLevel: event.eventLevel,
            eventType: event.eventType,
            count: 0
          }
        }
        summary[key].count++
      })

      this.eventSummary = Object.values(summary)
        .map(s => ({
          ...s,
          percentage: (s.count / this.controllerEvents.length * 100).toFixed(2)
        }))
        .sort((a, b) => b.count - a.count)
    },

    // 清除异常记录
    clearAnomalies() {
      this.anomalies = []
    },


    // ========== 工具管理 (Tool Center) ==========
    
    // 添加工具
    addTool(tool) {
      tool.id = Date.now() + Math.random()
      tool.addedTime = new Date().toISOString()
      this.tools.push(tool)
    },

    // 更新工具统计
    updateToolStatistics(toolId, statistics) {
      const index = this.toolStatistics.findIndex(t => t.toolId === toolId)
      if (index >= 0) {
        this.toolStatistics[index] = { ...this.toolStatistics[index], ...statistics }
      } else {
        this.toolStatistics.push({ toolId, ...statistics, timestamp: new Date().toISOString() })
      }
    },

    // 添加工具服务日志
    addServiceLog(log) {
      log.id = Date.now() + Math.random()
      log.timestamp = log.timestamp || new Date().toISOString()
      this.serviceLog.unshift(log)
      
      if (this.serviceLog.length > 1000) {
        this.serviceLog = this.serviceLog.slice(0, 1000)
      }
    },

    // ========== 数据导出 ==========
    
    // 导出拧紧结果报告
    exportData(format = 'csv') {
      const results = this.filteredResults

      if (format === 'csv') {
        const headers = [
          '时间', '单元名称', '程序名称', 'Pset ID', 'Job ID', '结果', 
          '扭矩(Nm)', '目标扭矩', '扭矩下限', '扭矩上限', '扭矩状态',
          '角度(°)', '目标角度', '角度下限', '角度上限', '角度状态',
          '拧紧时间(s)', 'NOK原因', 'VIN号', '螺栓号'
        ]
        
        const rows = results.map(r => [
          new Date(r.timestamp).toLocaleString(),
          r.unitName || '',
          r.programName || '',
          r.psetId,
          r.jobId,
          r.result,
          r.torque,
          r.targetTorque,
          r.torqueLowerLimit || (r.targetTorque * 0.9).toFixed(2),
          r.torqueUpperLimit || (r.targetTorque * 1.1).toFixed(2),
          r.torqueStatus || '',
          r.angle,
          r.targetAngle,
          r.angleLowerLimit || (r.targetAngle * 0.85).toFixed(2),
          r.angleUpperLimit || (r.targetAngle * 1.15).toFixed(2),
          r.angleStatus || '',
          r.tighteningTime,
          r.nokReason || r.detailedStatus || '',
          r.identifier || '',
          r.boltNumber || ''
        ])

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
        
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `拧紧数据报告_${new Date().toISOString().split('T')[0]}.csv`
        link.click()
        URL.revokeObjectURL(url)
      }
    },

    // 导出产品列表报告 (按VIN号)
    exportProductListReport() {
      const results = this.filteredResults
      
      // 按VIN号分组
      const vinGroups = {}
      results.forEach(r => {
        const vin = r.identifier || 'Unknown'
        if (!vinGroups[vin]) {
          vinGroups[vin] = {
            identifier: vin,
            results: []
          }
        }
        vinGroups[vin].results.push(r)
      })

      // 生成报告
      const headers = ['VIN号', '总拧紧数', 'OK数', 'NOK数', '首次时间', '最后时间', 'OK率(%)']
      const rows = Object.values(vinGroups).map(group => {
        const total = group.results.length
        const ok = group.results.filter(r => r.result === 'OK').length
        const nok = group.results.filter(r => r.result === 'NOK').length
        const times = group.results.map(r => new Date(r.timestamp).getTime())
        
        return [
          group.identifier,
          total,
          ok,
          nok,
          new Date(Math.min(...times)).toLocaleString(),
          new Date(Math.max(...times)).toLocaleString(),
          (ok / total * 100).toFixed(2)
        ]
      })

      const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
      
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `产品列表报告_${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      URL.revokeObjectURL(url)
    },

    // 导出结果摘要报告
    exportResultSummaryReport() {
      const results = this.filteredResults
      
      // 按程序分组
      const programGroups = {}
      results.forEach(r => {
        const key = r.programName || `Pset-${r.psetId}`
        if (!programGroups[key]) {
          programGroups[key] = {
            programName: key,
            unitName: r.unitName,
            psetId: r.psetId,
            results: []
          }
        }
        programGroups[key].results.push(r)
      })

      // 生成统计
      const headers = [
        '单元名称', '程序名称', 'Pset ID', '平均扭矩', '最小扭矩', '最大扭矩',
        '平均角度', '最小角度', '最大角度', '总数', 'OK数', 'NOK数', 'OK率(%)', 'NOK率(%)', 'Cpk'
      ]
      
      const rows = Object.values(programGroups).map(group => {
        const total = group.results.length
        const ok = group.results.filter(r => r.result === 'OK').length
        const nok = group.results.filter(r => r.result === 'NOK').length
        
        const torques = group.results.map(r => r.torque)
        const angles = group.results.map(r => r.angle)
        
        const avgTorque = torques.reduce((a, b) => a + b, 0) / total
        const avgAngle = angles.reduce((a, b) => a + b, 0) / total
        
        return [
          group.unitName || '',
          group.programName,
          group.psetId,
          avgTorque.toFixed(2),
          Math.min(...torques).toFixed(2),
          Math.max(...torques).toFixed(2),
          avgAngle.toFixed(2),
          Math.min(...angles).toFixed(2),
          Math.max(...angles).toFixed(2),
          total,
          ok,
          nok,
          (ok / total * 100).toFixed(2),
          (nok / total * 100).toFixed(2),
          '-' // Cpk需要单独计算
        ]
      })

      const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
      
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `结果摘要报告_${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      URL.revokeObjectURL(url)
    },

    // 导出TOP NOK报告
    exportTopNokReport() {
      const topNok = this.topNokApplications
      
      const headers = ['排名', '程序名称', 'Pset ID', '总拧紧数', 'OK数', 'NOK数', 'NOK率(%)', '主要NOK原因']
      const rows = topNok.map((item, index) => [
        index + 1,
        item.programName,
        item.psetId,
        item.total,
        item.ok,
        item.nok,
        item.nokRate,
        Object.entries(item.nokReasons).sort((a, b) => b[1] - a[1])[0]?.[0] || '-'
      ])

      const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
      
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `TOP_NOK报告_${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      URL.revokeObjectURL(url)
    },

    // 导出控制器事件报告
    exportEventReport() {
      const events = this.recentControllerEvents
      
      const headers = ['时间', '单元名称', '事件级别', '事件类型', '事件代码', '事件描述', '已确认']
      const rows = events.map(e => [
        new Date(e.timestamp).toLocaleString(),
        e.unitName || '',
        e.eventLevel || '',
        e.eventType || '',
        e.eventCode || '',
        e.eventDescription || '',
        e.acknowledged ? '是' : '否'
      ])

      const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
      
      const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `事件报告_${new Date().toISOString().split('T')[0]}.csv`
      link.click()
      URL.revokeObjectURL(url)
    },

    // ========== 本地存储 ==========
    
    // 保存到本地存储
    saveTighteningResults() {
      try {
        // 只保存最近1000条到localStorage
        const dataToSave = this.tighteningResults.slice(0, 1000)
        localStorage.setItem('tighteningResults', JSON.stringify(dataToSave))
      } catch (e) {
        console.error('保存拧紧结果失败:', e)
      }
    },

    saveTighteningCurves() {
      try {
        const dataToSave = this.tighteningCurves.slice(0, 100)
        localStorage.setItem('tighteningCurves', JSON.stringify(dataToSave))
      } catch (e) {
        console.error('保存拧紧曲线失败:', e)
      }
    },

    // 从本地存储加载
    loadTighteningResults() {
      try {
        const saved = localStorage.getItem('tighteningResults')
        if (saved) {
          this.tighteningResults = JSON.parse(saved)
          this.updateStatistics()
        }
      } catch (e) {
        console.error('加载拧紧结果失败:', e)
      }
    },

    loadTighteningCurves() {
      try {
        const saved = localStorage.getItem('tighteningCurves')
        if (saved) {
          this.tighteningCurves = JSON.parse(saved)
        }
      } catch (e) {
        console.error('加载拧紧曲线失败:', e)
      }
    },

    // ========== 模拟数据生成 ==========
    
    // 生成模拟数据（开发测试用）
    generateMockData(count = 100) {
      const psetIds = [1, 2, 3, 4, 5]
      const jobIds = [100, 101, 102]
      const programNames = ['发动机螺栓拧紧', '变速箱装配', '底盘连接', '车身拧紧', '电池包装配']
      const unitNames = ['PF4000-001', 'PF4000-002', 'PF8000-001', 'PF8000-002']
      const vins = ['VIN001', 'VIN002', 'VIN003', 'VIN004', 'VIN005']
      const results = ['OK', 'OK', 'OK', 'OK', 'OK', 'OK', 'OK', 'NOK'] // 87.5% OK率
      const nokReasons = ['扭矩过低', '扭矩过高', '角度超限', '下降角度异常', '拧紧时间超时']
      
      // 新增字段数据
      const workshops = this.workshops
      const productionLines = this.productionLines
      const toolModels = this.toolModels
      const shifts = ['白班', '夜班']

      for (let i = 0; i < count; i++) {
        const targetTorque = 35
        const torqueVariation = (Math.random() - 0.5) * 10
        const torque = parseFloat((targetTorque + torqueVariation).toFixed(2))

        const targetAngle = 180
        const angleVariation = (Math.random() - 0.5) * 40
        const angle = parseFloat((targetAngle + angleVariation).toFixed(1))

        const result = results[Math.floor(Math.random() * results.length)]
        const psetId = psetIds[Math.floor(Math.random() * psetIds.length)]
        const toolModel = toolModels[Math.floor(Math.random() * toolModels.length)]
        
        // 生成SN编号（根据工具型号）
        const snNumber = `${toolModel}-SN${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`
        
        this.addTighteningResult({
          psetId,
          programName: programNames[psetId - 1],
          jobId: jobIds[Math.floor(Math.random() * jobIds.length)],
          batchId: 'BATCH-001',
          unitName: unitNames[Math.floor(Math.random() * unitNames.length)],
          identifier: vins[Math.floor(Math.random() * vins.length)],
          boltNumber: Math.floor(Math.random() * 20) + 1,
          result,
          torque,
          targetTorque,
          torqueLowerLimit: targetTorque * 0.9,
          torqueUpperLimit: targetTorque * 1.1,
          angle,
          targetAngle,
          angleLowerLimit: targetAngle * 0.85,
          angleUpperLimit: targetAngle * 1.15,
          rundownAngle: parseFloat((90 + (Math.random() - 0.5) * 20).toFixed(1)),
          tighteningTime: parseFloat((Math.random() * 2 + 1).toFixed(3)),
          nokReason: result === 'NOK' ? nokReasons[Math.floor(Math.random() * nokReasons.length)] : null,
          timestamp: new Date(Date.now() - i * 60000).toISOString(),
          // 新增字段
          workshop: workshops[Math.floor(Math.random() * workshops.length)],
          productionLine: productionLines[Math.floor(Math.random() * productionLines.length)],
          toolModel: toolModel,
          snNumber: snNumber,
          shift: shifts[Math.floor(Math.random() * shifts.length)]
        })
      }

      // 生成一些控制器事件
      this.generateMockEvents(20)
    },

    // 生成模拟控制器事件
    generateMockEvents(count = 20) {
      const eventLevels = ['info', 'warning', 'error']
      const eventTypes = ['系统', '程序', '工具', '通信', '报警']
      const eventCodes = ['E001', 'E002', 'W001', 'W002', 'I001']
      const descriptions = [
        '控制器启动成功',
        '程序加载完成',
        '工具连接断开',
        '通信超时',
        '扭矩超限报警',
        '系统自检完成',
        '程序更新',
        '工具校准到期'
      ]

      for (let i = 0; i < count; i++) {
        this.addControllerEvent({
          eventLevel: eventLevels[Math.floor(Math.random() * eventLevels.length)],
          eventType: eventTypes[Math.floor(Math.random() * eventTypes.length)],
          eventCode: eventCodes[Math.floor(Math.random() * eventCodes.length)],
          eventDescription: descriptions[Math.floor(Math.random() * descriptions.length)],
          unitName: 'PF4000-001',
          timestamp: new Date(Date.now() - i * 3600000).toISOString()
        })
      }
    },

    // 清空所有数据
    clearAllData() {
      this.tighteningResults = []
      this.tighteningCurves = []
      this.anomalies = []
      this.controllerEvents = []
      this.tools = []
      this.toolStatistics = []
      this.serviceLog = []
      this.updateStatistics()
      localStorage.removeItem('tighteningResults')
      localStorage.removeItem('tighteningCurves')
    }
  }
})

