/**
 * AI预测分析系统
 * 功能：线索质量预测、流失预警、需求预测
 */

export class AIPredictiveAnalytics {
  constructor() {
    this.models = {
      leadQuality: null,
      churnPrediction: null,
      demandForecasting: null
    }
    this.historicalData = []
  }

  /**
   * 预测线索质量（A/B/C/D级）
   */
  predictLeadQuality(leadData) {
    // 特征提取
    const features = this.extractLeadFeatures(leadData)
    
    // 使用多个维度评分
    const scores = {
      engagement: this.scoreEngagement(features),
      intent: this.scoreIntent(features),
      fit: this.scoreFit(features),
      timing: this.scoreTiming(features),
      budget: this.scoreBudget(features)
    }

    // 加权计算总分
    const totalScore = 
      scores.engagement * 0.25 +
      scores.intent * 0.30 +
      scores.fit * 0.20 +
      scores.timing * 0.15 +
      scores.budget * 0.10

    // 预测结果
    const prediction = {
      score: totalScore,
      grade: this.getLeadGrade(totalScore),
      confidence: this.calculateConfidence(scores),
      scores,
      recommendations: this.getLeadRecommendations(totalScore, scores),
      estimatedValue: this.estimateLeadValue(totalScore, leadData),
      conversionProbability: this.calculateConversionProbability(totalScore),
      suggestedActions: this.suggestActions(totalScore, scores)
    }

    return prediction
  }

  /**
   * 提取线索特征
   */
  extractLeadFeatures(leadData) {
    return {
      // 行为特征
      pageViews: leadData.pageViews || 0,
      timeOnSite: leadData.timeOnSite || 0,
      downloadsCount: leadData.downloadsCount || 0,
      emailOpens: leadData.emailOpens || 0,
      emailClicks: leadData.emailClicks || 0,
      formSubmissions: leadData.formSubmissions || 0,
      
      // 公司特征
      companySize: leadData.companySize || 'unknown',
      industry: leadData.industry || 'unknown',
      revenue: leadData.revenue || 0,
      location: leadData.location || 'unknown',
      
      // 需求特征
      productInterest: leadData.productInterest || [],
      budgetRange: leadData.budgetRange || 'unknown',
      timeframe: leadData.timeframe || 'unknown',
      requirements: leadData.requirements || '',
      
      // 来源特征
      source: leadData.source || 'unknown',
      medium: leadData.medium || 'unknown',
      campaign: leadData.campaign || 'unknown',
      
      // 时间特征
      daysSinceFirstVisit: leadData.daysSinceFirstVisit || 0,
      visitFrequency: leadData.visitFrequency || 0
    }
  }

  /**
   * 评分：参与度
   */
  scoreEngagement(features) {
    let score = 0
    
    // 页面浏览量
    score += Math.min(features.pageViews / 10, 20)
    
    // 停留时间（分钟）
    score += Math.min(features.timeOnSite / 60 / 5, 20)
    
    // 下载次数
    score += Math.min(features.downloadsCount * 10, 30)
    
    // 邮件互动
    score += features.emailOpens * 2
    score += features.emailClicks * 5
    
    // 表单提交
    score += features.formSubmissions * 15
    
    return Math.min(score, 100)
  }

  /**
   * 评分：购买意向
   */
  scoreIntent(features) {
    let score = 0
    
    // 访问频率
    if (features.visitFrequency > 5) score += 30
    else if (features.visitFrequency > 2) score += 20
    else if (features.visitFrequency > 0) score += 10
    
    // 时间窗口
    const timeframeScore = {
      'immediate': 40,
      '1-3months': 30,
      '3-6months': 20,
      '6-12months': 10,
      'unknown': 0
    }
    score += timeframeScore[features.timeframe] || 0
    
    // 产品兴趣深度
    score += Math.min(features.productInterest.length * 10, 30)
    
    return Math.min(score, 100)
  }

  /**
   * 评分：公司匹配度
   */
  scoreFit(features) {
    let score = 50 // 基础分
    
    // 公司规模
    const sizeScore = {
      'enterprise': 30,
      'medium': 25,
      'small': 15,
      'startup': 10,
      'unknown': 0
    }
    score += sizeScore[features.companySize] || 0
    
    // 行业匹配
    const targetIndustries = ['automotive', 'aerospace', 'manufacturing', 'energy']
    if (targetIndustries.includes(features.industry)) {
      score += 20
    }
    
    return Math.min(score, 100)
  }

  /**
   * 评分：时机
   */
  scoreTiming(features) {
    let score = 0
    
    // 新鲜度（越新越好）
    if (features.daysSinceFirstVisit < 7) score += 40
    else if (features.daysSinceFirstVisit < 30) score += 30
    else if (features.daysSinceFirstVisit < 90) score += 20
    else score += 10
    
    // 访问频率趋势
    score += Math.min(features.visitFrequency * 10, 60)
    
    return Math.min(score, 100)
  }

  /**
   * 评分：预算能力
   */
  scoreBudget(features) {
    const budgetScore = {
      'high': 100,
      'medium': 70,
      'low': 40,
      'unknown': 50
    }
    return budgetScore[features.budgetRange] || 50
  }

  /**
   * 获取线索等级
   */
  getLeadGrade(score) {
    if (score >= 80) return 'A'
    if (score >= 60) return 'B'
    if (score >= 40) return 'C'
    return 'D'
  }

  /**
   * 计算置信度
   */
  calculateConfidence(scores) {
    // 基于分数的标准差计算置信度
    const values = Object.values(scores)
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length
    const stdDev = Math.sqrt(variance)
    
    // 标准差越小，置信度越高
    const confidence = Math.max(0, 100 - stdDev)
    return confidence.toFixed(1)
  }

  /**
   * 获取推荐建议
   */
  getLeadRecommendations(score, scores) {
    const recommendations = []
    
    if (scores.engagement < 50) {
      recommendations.push({
        type: 'engagement',
        priority: 'high',
        message: '参与度较低，建议发送个性化内容吸引互动'
      })
    }
    
    if (scores.intent < 50) {
      recommendations.push({
        type: 'nurturing',
        priority: 'medium',
        message: '购买意向不明确，建议加入培育流程'
      })
    }
    
    if (scores.timing > 70) {
      recommendations.push({
        type: 'urgency',
        priority: 'high',
        message: '时机良好，建议立即安排销售跟进'
      })
    }
    
    return recommendations
  }

  /**
   * 估算线索价值
   */
  estimateLeadValue(score, leadData) {
    // 基础价值计算
    let baseValue = 50000 // 基础客单价
    
    // 根据评分调整
    const scoreMultiplier = score / 100
    
    // 根据公司规模调整
    const sizeMultiplier = {
      'enterprise': 5,
      'medium': 2,
      'small': 1,
      'startup': 0.5,
      'unknown': 1
    }
    
    const estimatedValue = baseValue * scoreMultiplier * (sizeMultiplier[leadData.companySize] || 1)
    
    return {
      value: Math.round(estimatedValue),
      range: {
        min: Math.round(estimatedValue * 0.7),
        max: Math.round(estimatedValue * 1.5)
      }
    }
  }

  /**
   * 计算转化概率
   */
  calculateConversionProbability(score) {
    // 使用Sigmoid函数平滑转化概率
    const probability = 100 / (1 + Math.exp(-(score - 50) / 10))
    return probability.toFixed(1)
  }

  /**
   * 建议行动
   */
  suggestActions(score, scores) {
    const actions = []
    
    if (score >= 80) {
      actions.push({
        action: '立即分配给高级销售',
        priority: 'urgent',
        timeline: '立即'
      })
      actions.push({
        action: '发送定制化解决方案',
        priority: 'high',
        timeline: '24小时内'
      })
    } else if (score >= 60) {
      actions.push({
        action: '安排产品演示',
        priority: 'high',
        timeline: '3天内'
      })
      actions.push({
        action: '提供技术白皮书',
        priority: 'medium',
        timeline: '立即'
      })
    } else if (score >= 40) {
      actions.push({
        action: '加入培育流程',
        priority: 'medium',
        timeline: '立即'
      })
      actions.push({
        action: '发送行业案例',
        priority: 'medium',
        timeline: '7天内'
      })
    } else {
      actions.push({
        action: '加入长期培育',
        priority: 'low',
        timeline: '30天内'
      })
    }
    
    return actions
  }

  /**
   * 流失预警预测
   */
  predictChurnRisk(customerData) {
    const features = {
      daysSinceLastPurchase: customerData.daysSinceLastPurchase || 0,
      purchaseFrequency: customerData.purchaseFrequency || 0,
      avgOrderValue: customerData.avgOrderValue || 0,
      emailEngagement: customerData.emailEngagement || 0,
      supportTickets: customerData.supportTickets || 0,
      npsScore: customerData.npsScore || 0,
      daysSinceLastLogin: customerData.daysSinceLastLogin || 0
    }

    // 计算流失风险分数
    let riskScore = 0

    // 最后购买时间（权重最高）
    if (features.daysSinceLastPurchase > 180) riskScore += 40
    else if (features.daysSinceLastPurchase > 90) riskScore += 25
    else if (features.daysSinceLastPurchase > 30) riskScore += 10

    // 购买频率下降
    if (features.purchaseFrequency < 2) riskScore += 20

    // 邮件参与度下降
    if (features.emailEngagement < 30) riskScore += 15

    // 支持工单增加（可能不满意）
    if (features.supportTickets > 5) riskScore += 15

    // NPS分数低
    if (features.npsScore < 6) riskScore += 20

    // 长时间未登录
    if (features.daysSinceLastLogin > 60) riskScore += 10

    const riskLevel = this.getChurnRiskLevel(riskScore)

    return {
      riskScore,
      riskLevel,
      probability: riskScore,
      factors: this.identifyChurnFactors(features),
      retention Strategies: this.getRetentionStrategies(riskLevel),
      estimatedChurnDate: this.estimateChurnDate(features)
    }
  }

  /**
   * 获取流失风险等级
   */
  getChurnRiskLevel(score) {
    if (score >= 70) return 'critical'
    if (score >= 50) return 'high'
    if (score >= 30) return 'medium'
    return 'low'
  }

  /**
   * 识别流失因素
   */
  identifyChurnFactors(features) {
    const factors = []

    if (features.daysSinceLastPurchase > 90) {
      factors.push({
        factor: '长时间未购买',
        impact: 'high',
        description: `已${features.daysSinceLastPurchase}天未购买`
      })
    }

    if (features.emailEngagement < 30) {
      factors.push({
        factor: '邮件参与度低',
        impact: 'medium',
        description: '邮件打开率和点击率持续下降'
      })
    }

    if (features.npsScore < 6) {
      factors.push({
        factor: '满意度低',
        impact: 'high',
        description: `NPS分数仅为${features.npsScore}`
      })
    }

    return factors
  }

  /**
   * 获取挽留策略
   */
  getRetentionStrategies(riskLevel) {
    const strategies = {
      critical: [
        { action: '高管电话回访', timeline: '立即' },
        { action: '提供专属优惠', timeline: '24小时内' },
        { action: '安排现场拜访', timeline: '本周' }
      ],
      high: [
        { action: '客户成功经理跟进', timeline: '3天内' },
        { action: '发送升级方案', timeline: '立即' },
        { action: '邀请参加VIP活动', timeline: '本月' }
      ],
      medium: [
        { action: '发送关怀邮件', timeline: '立即' },
        { action: '提供新功能培训', timeline: '本周' },
        { action: '收集反馈', timeline: '本月' }
      ],
      low: [
        { action: '定期触达', timeline: '本月' },
        { action: '分享成功案例', timeline: '季度' }
      ]
    }

    return strategies[riskLevel] || strategies.low
  }

  /**
   * 估算流失日期
   */
  estimateChurnDate(features) {
    // 简化的估算逻辑
    const baselineDays = 365 // 假设客户生命周期为1年
    const adjustmentFactor = features.purchaseFrequency * 30 // 购买频率影响

    const estimatedDays = Math.max(30, baselineDays - features.daysSinceLastPurchase + adjustmentFactor)
    
    const churnDate = new Date()
    churnDate.setDate(churnDate.getDate() + estimatedDays)

    return {
      date: churnDate.toISOString().split('T')[0],
      daysRemaining: estimatedDays,
      confidence: this.calculateEstimateConfidence(features)
    }
  }

  /**
   * 计算估算置信度
   */
  calculateEstimateConfidence(features) {
    // 数据完整度越高，置信度越高
    const dataCompleteness = Object.values(features).filter(v => v > 0).length / Object.keys(features).length
    return (dataCompleteness * 100).toFixed(1)
  }

  /**
   * 需求预测（时间序列预测）
   */
  forecastDemand(historicalData, forecastPeriod = 30) {
    // 简化的移动平均预测
    const windowSize = 7 // 7天移动平均
    
    // 计算趋势
    const trend = this.calculateTrend(historicalData)
    
    // 计算季节性
    const seasonality = this.calculateSeasonality(historicalData)
    
    // 生成预测
    const forecast = []
    const lastValue = historicalData[historicalData.length - 1]
    
    for (let i = 1; i <= forecastPeriod; i++) {
      const trendComponent = lastValue + (trend * i)
      const seasonalComponent = seasonality[i % seasonality.length]
      const predictedValue = trendComponent * seasonalComponent
      
      forecast.push({
        day: i,
        prediction: Math.max(0, Math.round(predictedValue)),
        confidenceInterval: {
          lower: Math.max(0, Math.round(predictedValue * 0.8)),
          upper: Math.round(predictedValue * 1.2)
        }
      })
    }

    return {
      forecast,
      trend: trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable',
      trendValue: trend,
      insights: this.generateForecastInsights(forecast, trend)
    }
  }

  /**
   * 计算趋势
   */
  calculateTrend(data) {
    if (data.length < 2) return 0
    
    // 简单线性回归
    const n = data.length
    const xSum = (n * (n - 1)) / 2
    const ySum = data.reduce((a, b) => a + b, 0)
    const xySum = data.reduce((sum, y, x) => sum + x * y, 0)
    const x2Sum = (n * (n - 1) * (2 * n - 1)) / 6
    
    const slope = (n * xySum - xSum * ySum) / (n * x2Sum - xSum * xSum)
    
    return slope
  }

  /**
   * 计算季节性
   */
  calculateSeasonality(data) {
    // 简化的季节性分解（按周）
    const seasonalPattern = [1.0, 0.95, 0.9, 0.85, 0.9, 1.05, 1.15] // 周一到周日
    return seasonalPattern
  }

  /**
   * 生成预测洞察
   */
  generateForecastInsights(forecast, trend) {
    const insights = []
    
    if (trend > 5) {
      insights.push({
        type: 'opportunity',
        message: '需求呈强劲增长趋势，建议增加库存和人力准备'
      })
    } else if (trend < -5) {
      insights.push({
        type: 'warning',
        message: '需求下降趋势明显，建议优化营销策略'
      })
    }
    
    // 检查峰值
    const maxDay = forecast.reduce((max, day) => day.prediction > max.prediction ? day : max, forecast[0])
    if (maxDay.prediction > forecast[0].prediction * 1.5) {
      insights.push({
        type: 'peak',
        message: `预计第${maxDay.day}天将出现需求高峰，请提前准备`
      })
    }
    
    return insights
  }
}

// 导出单例
export const predictiveAnalytics = new AIPredictiveAnalytics()
