/**
 * P2-4: 行为驱动客户模型
 * 基于客户历史行为构建预测模型,实现精准营销
 */

/**
 * 1. 行为特征提取引擎
 */
export class BehaviorFeatureExtractor {
  constructor() {
    this.featureConfig = {
      // 访问行为特征
      visit: {
        frequency: { weight: 0.15, window: '30d' },
        duration: { weight: 0.12, threshold: 300 }, // 5分钟
        depth: { weight: 0.10, avgPages: 5 },
        recency: { weight: 0.18, decay: 'exponential' }
      },
      // 交互行为特征
      interaction: {
        inquiryCount: { weight: 0.20, normalize: true },
        downloadDocs: { weight: 0.15, category: ['manual', 'case', 'quote'] },
        videoWatch: { weight: 0.08, completionRate: 0.7 },
        formSubmit: { weight: 0.22, types: ['trial', 'demo', 'contact'] }
      },
      // 购买行为特征
      purchase: {
        orderFrequency: { weight: 0.25, timespan: '12m' },
        avgOrderValue: { weight: 0.20, normalize: 'log' },
        productCategory: { weight: 0.15, diversity: true },
        returnRate: { weight: -0.12, threshold: 0.1 } // 负向特征
      },
      // 社交行为特征
      social: {
        shareCount: { weight: 0.08, platforms: ['wechat', 'weibo'] },
        referralCount: { weight: 0.18, conversion: true },
        reviewSentiment: { weight: 0.12, nlp: true }
      }
    }
  }

  /**
   * 提取客户行为特征向量
   */
  extractFeatures(customerData) {
    const features = {
      visit: this._extractVisitFeatures(customerData.visitLogs),
      interaction: this._extractInteractionFeatures(customerData.interactions),
      purchase: this._extractPurchaseFeatures(customerData.orders),
      social: this._extractSocialFeatures(customerData.socialData)
    }

    // 计算综合行为分数
    const behaviorScore = this._calculateBehaviorScore(features)

    return {
      features,
      behaviorScore,
      vector: this._toFeatureVector(features),
      timestamp: new Date()
    }
  }

  _extractVisitFeatures(visitLogs) {
    const recent30d = visitLogs.filter(log => 
      (Date.now() - new Date(log.timestamp)) < 30 * 24 * 3600 * 1000
    )

    return {
      frequency: recent30d.length,
      avgDuration: recent30d.reduce((sum, log) => sum + log.duration, 0) / recent30d.length || 0,
      avgDepth: recent30d.reduce((sum, log) => sum + log.pageViews, 0) / recent30d.length || 0,
      recencyDays: recent30d.length > 0 
        ? Math.floor((Date.now() - new Date(recent30d[0].timestamp)) / (24 * 3600 * 1000))
        : 999,
      peakHours: this._findPeakHours(recent30d)
    }
  }

  _extractInteractionFeatures(interactions) {
    return {
      inquiryCount: interactions.filter(i => i.type === 'inquiry').length,
      downloadCount: interactions.filter(i => i.type === 'download').length,
      videoWatchTime: interactions
        .filter(i => i.type === 'video')
        .reduce((sum, i) => sum + i.duration, 0),
      formSubmissions: interactions.filter(i => i.type === 'form').length,
      lastInteractionDays: this._daysSince(interactions[0]?.timestamp)
    }
  }

  _extractPurchaseFeatures(orders) {
    if (!orders || orders.length === 0) {
      return { hasHistory: false, totalValue: 0, frequency: 0 }
    }

    const recent12m = orders.filter(order => 
      (Date.now() - new Date(order.date)) < 365 * 24 * 3600 * 1000
    )

    return {
      hasHistory: true,
      frequency: recent12m.length,
      totalValue: recent12m.reduce((sum, o) => sum + o.amount, 0),
      avgOrderValue: recent12m.reduce((sum, o) => sum + o.amount, 0) / recent12m.length,
      productDiversity: new Set(recent12m.map(o => o.category)).size,
      returnRate: orders.filter(o => o.returned).length / orders.length,
      lifetimeValue: orders.reduce((sum, o) => sum + o.amount, 0)
    }
  }

  _extractSocialFeatures(socialData) {
    return {
      shareCount: socialData?.shares?.length || 0,
      referralCount: socialData?.referrals?.length || 0,
      reviewScore: socialData?.reviews?.reduce((sum, r) => sum + r.score, 0) / socialData?.reviews?.length || 0,
      sentiment: this._analyzeSentiment(socialData?.reviews || [])
    }
  }

  _calculateBehaviorScore(features) {
    let score = 0
    
    // 访问行为分 (0-25)
    score += Math.min(features.visit.frequency / 10 * 10, 10)
    score += Math.min(features.visit.avgDuration / 600 * 8, 8)
    score += Math.min(features.visit.avgDepth / 10 * 7, 7)

    // 交互行为分 (0-30)
    score += Math.min(features.interaction.inquiryCount * 3, 12)
    score += Math.min(features.interaction.downloadCount * 2, 10)
    score += Math.min(features.interaction.formSubmissions * 4, 8)

    // 购买行为分 (0-35)
    if (features.purchase.hasHistory) {
      score += Math.min(features.purchase.frequency / 5 * 15, 15)
      score += Math.min(Math.log10(features.purchase.totalValue) * 2, 12)
      score += Math.min(features.purchase.productDiversity * 2, 8)
    }

    // 社交行为分 (0-10)
    score += Math.min(features.social.shareCount, 4)
    score += Math.min(features.social.referralCount * 2, 6)

    return Math.round(score)
  }

  _toFeatureVector(features) {
    return [
      features.visit.frequency,
      features.visit.avgDuration,
      features.visit.avgDepth,
      features.interaction.inquiryCount,
      features.interaction.downloadCount,
      features.interaction.formSubmissions,
      features.purchase.frequency || 0,
      features.purchase.avgOrderValue || 0,
      features.social.shareCount,
      features.social.referralCount
    ]
  }

  _findPeakHours(logs) {
    const hourCounts = new Array(24).fill(0)
    logs.forEach(log => {
      const hour = new Date(log.timestamp).getHours()
      hourCounts[hour]++
    })
    const maxCount = Math.max(...hourCounts)
    return hourCounts.map((count, hour) => ({ hour, count }))
      .filter(h => h.count === maxCount)
      .map(h => h.hour)
  }

  _analyzeSentiment(reviews) {
    if (reviews.length === 0) return { score: 0, label: 'neutral' }
    
    const avgScore = reviews.reduce((sum, r) => sum + (r.score || 0), 0) / reviews.length
    
    return {
      score: avgScore,
      label: avgScore >= 4 ? 'positive' : avgScore >= 3 ? 'neutral' : 'negative',
      distribution: {
        positive: reviews.filter(r => r.score >= 4).length,
        neutral: reviews.filter(r => r.score === 3).length,
        negative: reviews.filter(r => r.score < 3).length
      }
    }
  }

  _daysSince(timestamp) {
    if (!timestamp) return 999
    return Math.floor((Date.now() - new Date(timestamp)) / (24 * 3600 * 1000))
  }
}

/**
 * 2. 客户生命周期阶段识别
 */
export class LifecycleStageDetector {
  constructor() {
    this.stages = {
      visitor: {
        name: '访客',
        criteria: { visitCount: [1, 3], inquiryCount: 0, orderCount: 0 },
        score: [0, 20],
        nextActions: ['引导注册', '推送内容', '优惠券']
      },
      lead: {
        name: '线索',
        criteria: { visitCount: [3, 10], inquiryCount: [1, 5], orderCount: 0 },
        score: [20, 40],
        nextActions: ['电话跟进', '产品演示', '案例分享']
      },
      opportunity: {
        name: '商机',
        criteria: { visitCount: [10, Infinity], inquiryCount: [5, Infinity], downloadCount: [2, Infinity] },
        score: [40, 60],
        nextActions: ['发送报价', '技术交流', '样品试用']
      },
      customer: {
        name: '客户',
        criteria: { orderCount: [1, 5] },
        score: [60, 80],
        nextActions: ['交叉销售', '满意度调研', 'VIP服务']
      },
      advocate: {
        name: '忠诚客户',
        criteria: { orderCount: [5, Infinity], referralCount: [1, Infinity] },
        score: [80, 100],
        nextActions: ['推荐奖励', '产品内测', '品牌大使']
      },
      atRisk: {
        name: '流失风险',
        criteria: { lastInteractionDays: [60, 180], orderFrequency: 'declining' },
        score: [0, 40],
        nextActions: ['挽回优惠', '问题调研', '专属客服']
      },
      churned: {
        name: '已流失',
        criteria: { lastInteractionDays: [180, Infinity] },
        score: [0, 20],
        nextActions: ['重新激活', '新品推荐', '深度访谈']
      }
    }
  }

  /**
   * 识别客户所处生命周期阶段
   */
  detectStage(behaviorFeatures, orderHistory) {
    const metrics = this._calculateMetrics(behaviorFeatures, orderHistory)
    
    // 优先检查流失相关阶段
    if (this._matchStage('churned', metrics)) {
      return this._buildStageResult('churned', metrics)
    }
    if (this._matchStage('atRisk', metrics)) {
      return this._buildStageResult('atRisk', metrics)
    }

    // 按正常生命周期顺序检查
    const normalStages = ['visitor', 'lead', 'opportunity', 'customer', 'advocate']
    for (const stageName of normalStages.reverse()) {
      if (this._matchStage(stageName, metrics)) {
        return this._buildStageResult(stageName, metrics)
      }
    }

    return this._buildStageResult('visitor', metrics)
  }

  _calculateMetrics(features, orders) {
    return {
      visitCount: features.visit?.frequency || 0,
      inquiryCount: features.interaction?.inquiryCount || 0,
      downloadCount: features.interaction?.downloadCount || 0,
      orderCount: orders?.length || 0,
      referralCount: features.social?.referralCount || 0,
      lastInteractionDays: features.visit?.recencyDays || 999,
      orderFrequency: this._analyzeOrderFrequency(orders)
    }
  }

  _matchStage(stageName, metrics) {
    const stage = this.stages[stageName]
    
    for (const [key, value] of Object.entries(stage.criteria)) {
      if (Array.isArray(value)) {
        const [min, max] = value
        if (metrics[key] < min || metrics[key] > max) return false
      } else if (value === 'declining') {
        if (metrics.orderFrequency !== 'declining') return false
      } else {
        if (metrics[key] !== value) return false
      }
    }
    
    return true
  }

  _analyzeOrderFrequency(orders) {
    if (!orders || orders.length < 3) return 'stable'
    
    const recent3 = orders.slice(0, 3)
    const intervals = []
    for (let i = 0; i < recent3.length - 1; i++) {
      intervals.push(
        (new Date(recent3[i].date) - new Date(recent3[i + 1].date)) / (24 * 3600 * 1000)
      )
    }
    
    return intervals[0] > intervals[1] * 1.5 ? 'declining' : 'stable'
  }

  _buildStageResult(stageName, metrics) {
    const stage = this.stages[stageName]
    
    return {
      stage: stageName,
      stageName: stage.name,
      confidence: this._calculateConfidence(stageName, metrics),
      nextActions: stage.nextActions,
      scoreRange: stage.score,
      metrics,
      recommendations: this._generateRecommendations(stageName, metrics)
    }
  }

  _calculateConfidence(stageName, metrics) {
    // 简化的置信度计算
    let matchCount = 0
    let totalCriteria = 0
    
    const stage = this.stages[stageName]
    for (const [key, value] of Object.entries(stage.criteria)) {
      totalCriteria++
      if (Array.isArray(value)) {
        const [min, max] = value
        if (metrics[key] >= min && metrics[key] <= max) matchCount++
      } else if (value === metrics[key]) {
        matchCount++
      }
    }
    
    return Math.round(matchCount / totalCriteria * 100)
  }

  _generateRecommendations(stageName, metrics) {
    const recommendations = []
    
    if (stageName === 'visitor') {
      recommendations.push('建议引导客户注册,获取联系方式')
      if (metrics.visitCount >= 2) {
        recommendations.push('客户已多次访问,可推送针对性内容')
      }
    } else if (stageName === 'lead') {
      recommendations.push('建议主动电话跟进,了解需求')
      if (metrics.downloadCount >= 2) {
        recommendations.push('客户已下载资料,可安排产品演示')
      }
    } else if (stageName === 'opportunity') {
      recommendations.push('建议尽快发送正式报价')
      recommendations.push('安排技术交流或现场参观')
    } else if (stageName === 'atRisk') {
      recommendations.push('⚠️ 客户流失风险高,需立即干预')
      recommendations.push('建议联系客户了解问题并提供专属优惠')
    }
    
    return recommendations
  }
}

/**
 * 3. 购买倾向预测模型
 */
export class PurchasePropensityPredictor {
  constructor() {
    this.modelWeights = {
      behaviorScore: 0.30,
      lifecycleStage: 0.25,
      engagementTrend: 0.20,
      historicalConversion: 0.15,
      seasonalFactor: 0.10
    }
  }

  /**
   * 预测客户购买倾向
   */
  predictPropensity(customerData) {
    const factors = {
      behaviorScore: this._normalizeBehaviorScore(customerData.behaviorScore),
      lifecycleStage: this._stageToScore(customerData.lifecycleStage),
      engagementTrend: this._calculateEngagementTrend(customerData.interactions),
      historicalConversion: this._getHistoricalConversionRate(customerData),
      seasonalFactor: this._getSeasonalFactor()
    }

    const propensityScore = Object.entries(factors).reduce((sum, [key, value]) => {
      return sum + value * this.modelWeights[key]
    }, 0)

    return {
      score: Math.round(propensityScore * 100),
      level: this._scoreToLevel(propensityScore),
      factors,
      confidence: this._calculateConfidence(factors),
      recommendations: this._generateActionPlan(propensityScore, factors),
      predictedTimeframe: this._estimateTimeframe(propensityScore, factors)
    }
  }

  _normalizeBehaviorScore(score) {
    return Math.min(score / 100, 1)
  }

  _stageToScore(stage) {
    const stageScores = {
      visitor: 0.1,
      lead: 0.3,
      opportunity: 0.7,
      customer: 0.9,
      advocate: 1.0,
      atRisk: 0.2,
      churned: 0.05
    }
    return stageScores[stage] || 0.1
  }

  _calculateEngagementTrend(interactions) {
    if (!interactions || interactions.length < 2) return 0.5

    const recent7d = interactions.filter(i => 
      (Date.now() - new Date(i.timestamp)) < 7 * 24 * 3600 * 1000
    )
    const previous7d = interactions.filter(i => {
      const days = (Date.now() - new Date(i.timestamp)) / (24 * 3600 * 1000)
      return days >= 7 && days < 14
    })

    if (previous7d.length === 0) return recent7d.length > 0 ? 0.8 : 0.3

    const trend = recent7d.length / previous7d.length
    return Math.min(trend / 2, 1) // 归一化到0-1
  }

  _getHistoricalConversionRate(customerData) {
    // 简化版:基于行业平均转化率和客户特征
    const baseRate = 0.15 // 行业基准15%
    
    let rate = baseRate
    if (customerData.behaviorScore > 60) rate += 0.15
    if (customerData.lifecycleStage === 'opportunity') rate += 0.25
    if (customerData.referralSource === 'referral') rate += 0.10
    
    return Math.min(rate, 1)
  }

  _getSeasonalFactor() {
    const month = new Date().getMonth()
    const seasonalFactors = {
      0: 0.7, 1: 0.6, 2: 0.8, 3: 0.9,  // Q1
      4: 0.85, 5: 0.95, 6: 1.0, 7: 0.9, // Q2-Q3
      8: 0.95, 9: 1.0, 10: 0.95, 11: 0.85 // Q4
    }
    return seasonalFactors[month]
  }

  _scoreToLevel(score) {
    if (score >= 0.8) return { level: 'very_high', label: '极高', color: '#67C23A' }
    if (score >= 0.6) return { level: 'high', label: '高', color: '#409EFF' }
    if (score >= 0.4) return { level: 'medium', label: '中', color: '#E6A23C' }
    if (score >= 0.2) return { level: 'low', label: '低', color: '#F56C6C' }
    return { level: 'very_low', label: '极低', color: '#909399' }
  }

  _calculateConfidence(factors) {
    // 基于因子方差计算置信度
    const values = Object.values(factors)
    const avg = values.reduce((a, b) => a + b) / values.length
    const variance = values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length
    
    // 方差越小,置信度越高
    return Math.round((1 - Math.min(variance * 2, 1)) * 100)
  }

  _generateActionPlan(score, factors) {
    const actions = []
    
    if (score >= 0.8) {
      actions.push({
        priority: 'urgent',
        action: '立即联系客户发送正式报价',
        reason: '购买意向极高'
      })
      actions.push({
        priority: 'high',
        action: '提供限时优惠促进成交',
        reason: '把握最佳时机'
      })
    } else if (score >= 0.6) {
      actions.push({
        priority: 'high',
        action: '安排产品演示或技术交流',
        reason: '需进一步建立信任'
      })
      actions.push({
        priority: 'medium',
        action: '分享成功案例和客户评价',
        reason: '增强购买信心'
      })
    } else if (score >= 0.4) {
      actions.push({
        priority: 'medium',
        action: '持续提供有价值的内容',
        reason: '培育客户需求'
      })
      actions.push({
        priority: 'low',
        action: '定期跟进了解最新需求',
        reason: '保持联系'
      })
    } else {
      actions.push({
        priority: 'low',
        action: '加入培育邮件列表',
        reason: '长期培育'
      })
    }
    
    return actions
  }

  _estimateTimeframe(score, factors) {
    if (score >= 0.8) return { days: 7, label: '1周内' }
    if (score >= 0.6) return { days: 30, label: '1个月内' }
    if (score >= 0.4) return { days: 90, label: '3个月内' }
    return { days: 180, label: '6个月以上' }
  }
}

/**
 * 4. 客户行为路径分析
 */
export class CustomerJourneyAnalyzer {
  constructor() {
    this.commonPaths = {
      fast_track: ['首页访问', '产品页', '下载资料', '提交询价', '成交'],
      standard: ['首页访问', '产品页', '案例页', '多次访问', '下载资料', '提交询价', '成交'],
      hesitant: ['首页访问', '产品对比', '多次离开', '价格页', '竞品对比', '客服咨询', '成交'],
      abandoned: ['首页访问', '产品页', '离开未返回']
    }
  }

  /**
   * 分析客户行为路径
   */
  analyzePath(customerInteractions) {
    const path = this._buildPath(customerInteractions)
    const pathType = this._identifyPathType(path)
    const bottlenecks = this._findBottlenecks(path)
    const nextSteps = this._predictNextSteps(path, pathType)

    return {
      currentPath: path,
      pathType,
      completion: this._calculateCompletion(path, pathType),
      bottlenecks,
      nextSteps,
      recommendations: this._generatePathRecommendations(path, bottlenecks)
    }
  }

  _buildPath(interactions) {
    return interactions
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .map(interaction => ({
        step: this._normalizeAction(interaction.action),
        timestamp: interaction.timestamp,
        duration: interaction.duration || 0,
        details: interaction.details
      }))
  }

  _normalizeAction(action) {
    const actionMap = {
      'page_view': '页面访问',
      'product_view': '产品页',
      'download': '下载资料',
      'inquiry': '提交询价',
      'order': '成交',
      'compare': '产品对比',
      'chat': '客服咨询'
    }
    return actionMap[action] || action
  }

  _identifyPathType(path) {
    const steps = path.map(p => p.step)
    
    // 快速成交路径
    if (steps.includes('成交') && path.length <= 5) {
      return { type: 'fast_track', label: '快速成交', efficiency: 'high' }
    }
    
    // 犹豫路径
    if (steps.filter(s => s.includes('对比')).length >= 2) {
      return { type: 'hesitant', label: '犹豫观望', efficiency: 'medium' }
    }
    
    // 放弃路径
    if (!steps.includes('成交') && path.length > 0 && 
        (Date.now() - new Date(path[path.length - 1].timestamp)) > 30 * 24 * 3600 * 1000) {
      return { type: 'abandoned', label: '已放弃', efficiency: 'low' }
    }
    
    // 标准路径
    return { type: 'standard', label: '标准流程', efficiency: 'medium' }
  }

  _calculateCompletion(path, pathType) {
    const expectedPath = this.commonPaths[pathType.type] || this.commonPaths.standard
    const currentSteps = new Set(path.map(p => p.step))
    const completedSteps = expectedPath.filter(step => currentSteps.has(step))
    
    return Math.round(completedSteps.length / expectedPath.length * 100)
  }

  _findBottlenecks(path) {
    const bottlenecks = []
    
    for (let i = 0; i < path.length - 1; i++) {
      const timeDiff = (new Date(path[i + 1].timestamp) - new Date(path[i].timestamp)) / (24 * 3600 * 1000)
      
      if (timeDiff > 7) {
        bottlenecks.push({
          step: path[i].step,
          nextStep: path[i + 1].step,
          delayDays: Math.round(timeDiff),
          severity: timeDiff > 30 ? 'high' : 'medium'
        })
      }
    }
    
    return bottlenecks
  }

  _predictNextSteps(path, pathType) {
    const lastStep = path[path.length - 1]?.step
    const expectedPath = this.commonPaths[pathType.type] || this.commonPaths.standard
    const currentIndex = expectedPath.indexOf(lastStep)
    
    if (currentIndex === -1 || currentIndex === expectedPath.length - 1) {
      return []
    }
    
    return expectedPath.slice(currentIndex + 1, currentIndex + 3).map(step => ({
      step,
      probability: currentIndex === expectedPath.length - 2 ? 0.7 : 0.5
    }))
  }

  _generatePathRecommendations(path, bottlenecks) {
    const recommendations = []
    
    if (bottlenecks.length > 0) {
      bottlenecks.forEach(bottleneck => {
        recommendations.push({
          issue: `从"${bottleneck.step}"到"${bottleneck.nextStep}"停滞${bottleneck.delayDays}天`,
          suggestion: '建议主动跟进客户,了解阻碍原因',
          priority: bottleneck.severity
        })
      })
    }
    
    const lastStep = path[path.length - 1]?.step
    if (lastStep === '下载资料') {
      recommendations.push({
        issue: '客户已下载资料但未提交询价',
        suggestion: '建议48小时内电话跟进',
        priority: 'high'
      })
    }
    
    return recommendations
  }
}

/**
 * 5. 综合行为驱动模型管理器
 */
export class BehaviorDrivenModelManager {
  constructor() {
    this.featureExtractor = new BehaviorFeatureExtractor()
    this.stageDetector = new LifecycleStageDetector()
    this.propensityPredictor = new PurchasePropensityPredictor()
    this.journeyAnalyzer = new CustomerJourneyAnalyzer()
  }

  /**
   * 综合分析客户行为
   */
  async analyzeCustomer(customerId, customerData) {
    // 1. 提取行为特征
    const behaviorFeatures = this.featureExtractor.extractFeatures(customerData)
    
    // 2. 识别生命周期阶段
    const lifecycleStage = this.stageDetector.detectStage(
      behaviorFeatures.features,
      customerData.orders
    )
    
    // 3. 预测购买倾向
    const purchasePropensity = this.propensityPredictor.predictPropensity({
      behaviorScore: behaviorFeatures.behaviorScore,
      lifecycleStage: lifecycleStage.stage,
      interactions: customerData.interactions,
      referralSource: customerData.referralSource
    })
    
    // 4. 分析行为路径
    const customerJourney = this.journeyAnalyzer.analyzePath(customerData.interactions)
    
    return {
      customerId,
      timestamp: new Date(),
      behaviorFeatures,
      lifecycleStage,
      purchasePropensity,
      customerJourney,
      summary: this._generateSummary({
        behaviorFeatures,
        lifecycleStage,
        purchasePropensity,
        customerJourney
      })
    }
  }

  _generateSummary(analysis) {
    return {
      behaviorScore: analysis.behaviorFeatures.behaviorScore,
      stage: analysis.lifecycleStage.stageName,
      propensityLevel: analysis.purchasePropensity.level.label,
      propensityScore: analysis.purchasePropensity.score,
      pathType: analysis.customerJourney.pathType.label,
      keyInsights: [
        `客户处于${analysis.lifecycleStage.stageName}阶段`,
        `购买倾向${analysis.purchasePropensity.level.label} (${analysis.purchasePropensity.score}分)`,
        `预计${analysis.purchasePropensity.predictedTimeframe.label}可能成交`,
        analysis.customerJourney.bottlenecks.length > 0 
          ? `存在${analysis.customerJourney.bottlenecks.length}个流程瓶颈` 
          : '客户路径流畅'
      ],
      topActions: analysis.purchasePropensity.recommendations.slice(0, 3)
    }
  }
}
