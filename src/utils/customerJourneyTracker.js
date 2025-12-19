/**
 * 客户旅程追踪系统
 * 功能：行为分析、转化漏斗、热力图
 */

export class CustomerJourneyTracker {
  constructor() {
    this.journeyData = []
    this.touchpoints = []
    this.conversionFunnel = []
  }

  /**
   * 追踪用户行为
   */
  trackEvent(userId, event) {
    const eventData = {
      userId,
      event: event.type,
      page: event.page,
      element: event.element,
      timestamp: new Date(),
      sessionId: this.getSessionId(userId),
      device: this.getDeviceInfo(),
      location: this.getLocationInfo(),
      referrer: document.referrer,
      metadata: event.metadata || {}
    }

    this.journeyData.push(eventData)
    this.saveToServer(eventData)
    
    return eventData
  }

  /**
   * 构建用户旅程地图
   */
  buildJourneyMap(userId) {
    const userEvents = this.journeyData.filter(e => e.userId === userId)
    
    // 按时间排序
    userEvents.sort((a, b) => a.timestamp - b.timestamp)
    
    // 识别关键接触点
    const touchpoints = this.identifyTouchpoints(userEvents)
    
    // 计算每个阶段的停留时间
    const stageDurations = this.calculateStageDurations(touchpoints)
    
    // 识别转化路径
    const conversionPath = this.identifyConversionPath(userEvents)
    
    return {
      userId,
      totalEvents: userEvents.length,
      touchpoints,
      stageDurations,
      conversionPath,
      firstTouch: userEvents[0],
      lastTouch: userEvents[userEvents.length - 1],
      totalDuration: userEvents[userEvents.length - 1].timestamp - userEvents[0].timestamp
    }
  }

  /**
   * 识别关键接触点
   */
  identifyTouchpoints(events) {
    const keyEvents = [
      'page_view',
      'form_submit',
      'download',
      'email_open',
      'email_click',
      'product_view',
      'add_to_cart',
      'quote_request',
      'purchase'
    ]

    return events
      .filter(e => keyEvents.includes(e.event))
      .map(e => ({
        type: e.event,
        timestamp: e.timestamp,
        page: e.page,
        metadata: e.metadata
      }))
  }

  /**
   * 计算阶段停留时间
   */
  calculateStageDurations(touchpoints) {
    const stages = {
      awareness: [],
      consideration: [],
      decision: [],
      purchase: []
    }

    touchpoints.forEach((tp, index) => {
      const stage = this.mapToStage(tp.type)
      const duration = index < touchpoints.length - 1
        ? touchpoints[index + 1].timestamp - tp.timestamp
        : 0

      stages[stage].push(duration)
    })

    return Object.keys(stages).map(stage => ({
      stage,
      totalTime: stages[stage].reduce((sum, d) => sum + d, 0),
      avgTime: stages[stage].length > 0
        ? stages[stage].reduce((sum, d) => sum + d, 0) / stages[stage].length
        : 0,
      touchpointsCount: stages[stage].length
    }))
  }

  /**
   * 将事件映射到营销漏斗阶段
   */
  mapToStage(eventType) {
    const stageMap = {
      page_view: 'awareness',
      email_open: 'awareness',
      download: 'consideration',
      product_view: 'consideration',
      email_click: 'consideration',
      quote_request: 'decision',
      add_to_cart: 'decision',
      purchase: 'purchase'
    }
    return stageMap[eventType] || 'awareness'
  }

  /**
   * 识别转化路径
   */
  identifyConversionPath(events) {
    const path = []
    let currentStage = null

    events.forEach(event => {
      const stage = this.mapToStage(event.event)
      if (stage !== currentStage) {
        path.push({
          stage,
          event: event.event,
          timestamp: event.timestamp,
          page: event.page
        })
        currentStage = stage
      }
    })

    return path
  }

  /**
   * 生成转化漏斗报告
   */
  generateFunnelReport(timeRange = 30) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - timeRange)

    const recentEvents = this.journeyData.filter(e => e.timestamp >= cutoffDate)
    
    // 按用户分组
    const userGroups = {}
    recentEvents.forEach(event => {
      if (!userGroups[event.userId]) {
        userGroups[event.userId] = []
      }
      userGroups[event.userId].push(event)
    })

    // 统计每个阶段的用户数
    const funnelStats = {
      awareness: new Set(),
      consideration: new Set(),
      decision: new Set(),
      purchase: new Set()
    }

    Object.keys(userGroups).forEach(userId => {
      const events = userGroups[userId]
      const stages = events.map(e => this.mapToStage(e.event))
      
      if (stages.includes('awareness')) funnelStats.awareness.add(userId)
      if (stages.includes('consideration')) funnelStats.consideration.add(userId)
      if (stages.includes('decision')) funnelStats.decision.add(userId)
      if (stages.includes('purchase')) funnelStats.purchase.add(userId)
    })

    const awarenessCount = funnelStats.awareness.size
    
    return [
      {
        stage: 'awareness',
        name: '认知阶段',
        users: awarenessCount,
        conversionRate: 100
      },
      {
        stage: 'consideration',
        name: '考虑阶段',
        users: funnelStats.consideration.size,
        conversionRate: ((funnelStats.consideration.size / awarenessCount) * 100).toFixed(1)
      },
      {
        stage: 'decision',
        name: '决策阶段',
        users: funnelStats.decision.size,
        conversionRate: ((funnelStats.decision.size / awarenessCount) * 100).toFixed(1)
      },
      {
        stage: 'purchase',
        name: '购买阶段',
        users: funnelStats.purchase.size,
        conversionRate: ((funnelStats.purchase.size / awarenessCount) * 100).toFixed(1)
      }
    ]
  }

  /**
   * 生成热力图数据
   */
  generateHeatmapData(page) {
    const pageEvents = this.journeyData.filter(e => e.page === page && e.event === 'click')
    
    // 按元素分组统计点击次数
    const clicksByElement = {}
    pageEvents.forEach(event => {
      const element = event.element || 'unknown'
      clicksByElement[element] = (clicksByElement[element] || 0) + 1
    })

    // 转换为热力图格式
    return Object.keys(clicksByElement).map(element => ({
      element,
      clicks: clicksByElement[element],
      intensity: this.calculateIntensity(clicksByElement[element], pageEvents.length)
    }))
  }

  /**
   * 计算热力强度
   */
  calculateIntensity(clicks, total) {
    const percentage = (clicks / total) * 100
    if (percentage >= 20) return 'very-hot'
    if (percentage >= 10) return 'hot'
    if (percentage >= 5) return 'warm'
    return 'cool'
  }

  /**
   * 识别流失点
   */
  identifyDropOffPoints() {
    const funnelReport = this.generateFunnelReport()
    const dropOffPoints = []

    for (let i = 0; i < funnelReport.length - 1; i++) {
      const current = funnelReport[i]
      const next = funnelReport[i + 1]
      const dropOffRate = ((current.users - next.users) / current.users * 100).toFixed(1)

      if (dropOffRate > 30) {
        dropOffPoints.push({
          fromStage: current.stage,
          toStage: next.stage,
          dropOffRate,
          usersLost: current.users - next.users,
          severity: dropOffRate > 50 ? 'critical' : 'high'
        })
      }
    }

    return dropOffPoints
  }

  /**
   * AI驱动的路径优化建议
   */
  getOptimizationSuggestions() {
    const dropOffPoints = this.identifyDropOffPoints()
    const suggestions = []

    dropOffPoints.forEach(point => {
      if (point.fromStage === 'awareness' && point.toStage === 'consideration') {
        suggestions.push({
          type: 'content',
          priority: 'high',
          title: '增强内容吸引力',
          description: `${point.dropOffRate}%的用户在认知阶段流失，建议优化首页内容、增加互动元素`,
          actions: [
            '添加更多视频和图像',
            '优化产品价值主张',
            '增加社会证明（客户评价）'
          ]
        })
      }

      if (point.fromStage === 'consideration' && point.toStage === 'decision') {
        suggestions.push({
          type: 'conversion',
          priority: 'critical',
          title: '降低决策门槛',
          description: `${point.dropOffRate}%的用户在考虑阶段流失，建议简化询盘流程`,
          actions: [
            '减少表单字段',
            '提供即时报价',
            '增加在线咨询入口'
          ]
        })
      }

      if (point.fromStage === 'decision' && point.toStage === 'purchase') {
        suggestions.push({
          type: 'checkout',
          priority: 'critical',
          title: '优化购买流程',
          description: `${point.dropOffRate}%的用户在决策阶段流失，建议优化结账体验`,
          actions: [
            '提供更多支付选项',
            '明确交付时间和成本',
            '增加信任标识（认证、保障）'
          ]
        })
      }
    })

    return suggestions
  }

  /**
   * 多渠道归因分析
   */
  analyzeAttribution() {
    const conversions = this.journeyData.filter(e => e.event === 'purchase')
    
    const attributionModels = {
      firstTouch: {},
      lastTouch: {},
      linear: {},
      timeDecay: {}
    }

    conversions.forEach(conversion => {
      const userJourney = this.buildJourneyMap(conversion.userId)
      const touchpoints = userJourney.touchpoints

      if (touchpoints.length === 0) return

      // First Touch Attribution
      const firstChannel = this.getChannel(touchpoints[0])
      attributionModels.firstTouch[firstChannel] = (attributionModels.firstTouch[firstChannel] || 0) + 1

      // Last Touch Attribution
      const lastChannel = this.getChannel(touchpoints[touchpoints.length - 1])
      attributionModels.lastTouch[lastChannel] = (attributionModels.lastTouch[lastChannel] || 0) + 1

      // Linear Attribution
      const creditPerTouch = 1 / touchpoints.length
      touchpoints.forEach(tp => {
        const channel = this.getChannel(tp)
        attributionModels.linear[channel] = (attributionModels.linear[channel] || 0) + creditPerTouch
      })

      // Time Decay Attribution (最近的接触点权重更高)
      const totalWeight = touchpoints.reduce((sum, _, i) => sum + Math.pow(2, i), 0)
      touchpoints.forEach((tp, i) => {
        const channel = this.getChannel(tp)
        const weight = Math.pow(2, i) / totalWeight
        attributionModels.timeDecay[channel] = (attributionModels.timeDecay[channel] || 0) + weight
      })
    })

    return attributionModels
  }

  /**
   * 获取渠道信息
   */
  getChannel(touchpoint) {
    const typeToChannel = {
      page_view: 'organic',
      email_open: 'email',
      email_click: 'email',
      download: 'content',
      product_view: 'website',
      quote_request: 'website'
    }
    return typeToChannel[touchpoint.type] || 'unknown'
  }

  /**
   * 获取会话ID
   */
  getSessionId(userId) {
    // 简化实现：使用sessionStorage
    let sessionId = sessionStorage.getItem('journey_session_id')
    if (!sessionId) {
      sessionId = `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      sessionStorage.setItem('journey_session_id', sessionId)
    }
    return sessionId
  }

  /**
   * 获取设备信息
   */
  getDeviceInfo() {
    const ua = navigator.userAgent
    return {
      type: /Mobile|Android|iPhone/i.test(ua) ? 'mobile' : 'desktop',
      os: this.detectOS(ua),
      browser: this.detectBrowser(ua)
    }
  }

  /**
   * 检测操作系统
   */
  detectOS(ua) {
    if (/Windows/i.test(ua)) return 'Windows'
    if (/Mac/i.test(ua)) return 'macOS'
    if (/Linux/i.test(ua)) return 'Linux'
    if (/Android/i.test(ua)) return 'Android'
    if (/iPhone|iPad/i.test(ua)) return 'iOS'
    return 'Unknown'
  }

  /**
   * 检测浏览器
   */
  detectBrowser(ua) {
    if (/Chrome/i.test(ua)) return 'Chrome'
    if (/Firefox/i.test(ua)) return 'Firefox'
    if (/Safari/i.test(ua)) return 'Safari'
    if (/Edge/i.test(ua)) return 'Edge'
    return 'Unknown'
  }

  /**
   * 获取位置信息（需要IP地理位置服务）
   */
  getLocationInfo() {
    // 简化实现，实际应调用IP地理位置API
    return {
      country: 'Unknown',
      city: 'Unknown',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  }

  /**
   * 保存到服务器
   */
  async saveToServer(eventData) {
    try {
      await fetch('/api/journey/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      })
    } catch (error) {
      console.error('Failed to save journey data:', error)
    }
  }
}

// 导出单例
export const journeyTracker = new CustomerJourneyTracker()
