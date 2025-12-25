/**
 * P2-4: 行为驱动的客户模型
 * 功能: 成功模式库、最佳实践推荐
 */

// ========== 成功项目模式提取 ==========
export class SuccessPatternExtractor {
  constructor() {
    this.patterns = []
  }

  /**
   * 从历史项目中提取成功模式
   * @param {Array} completedProjects - 已完成项目列表
   */
  extractSuccessPatterns(completedProjects) {
    // 筛选成功项目
    const successfulProjects = completedProjects.filter(p => 
      p.status === '已完成' && 
      p.customerSatisfaction >= 4.5 &&
      p.profitMargin > 0.15
    )

    if (successfulProjects.length === 0) {
      return []
    }

    // 按特征聚类分析
    const clusters = this.clusterProjects(successfulProjects)
    
    // 生成模式库
    this.patterns = clusters.map(cluster => {
      const pattern = {
        patternId: `pattern-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: this.generatePatternName(cluster),
        characteristics: this.extractCharacteristics(cluster.projects),
        successRate: this.calculateSuccessRate(cluster.projects),
        avgProfit: this.calculateAvgProfit(cluster.projects),
        projectCount: cluster.projects.length,
        keyFactors: this.identifyKeyFactors(cluster.projects),
        recommendations: this.generateRecommendations(cluster.projects)
      }
      
      return pattern
    })

    return this.patterns
  }

  /**
   * 聚类分析(简化版K-means)
   */
  clusterProjects(projects) {
    const clusters = []
    
    // 按团队规模和工期分组
    const smallShort = projects.filter(p => p.teamSize <= 5 && p.durationDays <= 60)
    const mediumMedium = projects.filter(p => p.teamSize > 5 && p.teamSize <= 10 && p.durationDays > 60 && p.durationDays <= 120)
    const largeLong = projects.filter(p => p.teamSize > 10 && p.durationDays > 120)
    
    if (smallShort.length > 0) clusters.push({ type: 'small-short', projects: smallShort })
    if (mediumMedium.length > 0) clusters.push({ type: 'medium-medium', projects: mediumMedium })
    if (largeLong.length > 0) clusters.push({ type: 'large-long', projects: largeLong })
    
    return clusters
  }

  /**
   * 生成模式名称
   */
  generatePatternName(cluster) {
    const names = {
      'small-short': '小型快速项目模式',
      'medium-medium': '中型SaaS产品开发模式',
      'large-long': '大型企业级项目模式'
    }
    return names[cluster.type] || '通用项目模式'
  }

  /**
   * 提取特征
   */
  extractCharacteristics(projects) {
    const avgTeamSize = projects.reduce((sum, p) => sum + p.teamSize, 0) / projects.length
    const avgDuration = projects.reduce((sum, p) => sum + p.durationDays, 0) / projects.length
    const avgBudget = projects.reduce((sum, p) => sum + p.budget, 0) / projects.length
    
    return {
      teamSize: Math.round(avgTeamSize),
      duration: Math.round(avgDuration),
      budget: Math.round(avgBudget),
      complexity: this.assessComplexity(projects)
    }
  }

  /**
   * 评估复杂度
   */
  assessComplexity(projects) {
    const avgFeatures = projects.reduce((sum, p) => sum + (p.featureCount || 10), 0) / projects.length
    if (avgFeatures < 10) return '低'
    if (avgFeatures < 30) return '中'
    return '高'
  }

  /**
   * 计算成功率
   */
  calculateSuccessRate(projects) {
    const onTimeProjects = projects.filter(p => !p.delayed).length
    return ((onTimeProjects / projects.length) * 100).toFixed(1)
  }

  /**
   * 计算平均利润率
   */
  calculateAvgProfit(projects) {
    const avgMargin = projects.reduce((sum, p) => sum + p.profitMargin, 0) / projects.length
    return (avgMargin * 100).toFixed(1)
  }

  /**
   * 识别关键成功因素
   */
  identifyKeyFactors(projects) {
    const factors = []
    
    // 需求阶段投入比例
    const avgReqPhase = projects.reduce((sum, p) => sum + (p.requirementPhasePercent || 20), 0) / projects.length
    if (avgReqPhase >= 20) {
      factors.push({
        factor: '前期需求阶段投入充分',
        importance: '高',
        value: `${avgReqPhase.toFixed(0)}%时间`
      })
    }
    
    // 客户参与度
    const avgCustomerEngagement = projects.reduce((sum, p) => sum + (p.customerEngagementScore || 4), 0) / projects.length
    if (avgCustomerEngagement >= 4) {
      factors.push({
        factor: '客户高度参与',
        importance: '高',
        value: `${avgCustomerEngagement.toFixed(1)}/5.0`
      })
    }
    
    // 技术风险管理
    const riskManagedProjects = projects.filter(p => p.riskManagement === true).length
    if (riskManagedProjects / projects.length >= 0.8) {
      factors.push({
        factor: '提前进行技术风险评估',
        importance: '中',
        value: `${((riskManagedProjects / projects.length) * 100).toFixed(0)}%项目`
      })
    }
    
    return factors
  }

  /**
   * 生成推荐建议
   */
  generateRecommendations(projects) {
    const recommendations = []
    
    const avgTeamSize = projects.reduce((sum, p) => sum + p.teamSize, 0) / projects.length
    const avgDuration = projects.reduce((sum, p) => sum + p.durationDays, 0) / projects.length
    
    recommendations.push({
      category: '团队配置',
      suggestion: `建议团队规模: ${Math.round(avgTeamSize)}人`,
      detail: this.getTeamComposition(avgTeamSize)
    })
    
    recommendations.push({
      category: '工期安排',
      suggestion: `建议工期: ${Math.round(avgDuration)}天 (${(avgDuration / 30).toFixed(1)}个月)`,
      detail: '预留20%缓冲时间应对技术风险'
    })
    
    recommendations.push({
      category: '关键里程碑',
      suggestion: '建立定期review机制',
      detail: '每2周进行一次客户演示,及时调整方向'
    })
    
    return recommendations
  }

  /**
   * 获取团队组成建议
   */
  getTeamComposition(teamSize) {
    if (teamSize <= 5) {
      return '2前端 + 2后端 + 1全栈/PM'
    } else if (teamSize <= 10) {
      return '2前端 + 3后端 + 1UI + 1测试 + 1PM + 1产品 + 1运维'
    } else {
      return '4前端 + 6后端 + 2UI + 2测试 + 2PM + 2产品 + 2运维'
    }
  }
}

// ========== 新项目匹配推荐 ==========
export class ProjectMatcher {
  constructor(patterns) {
    this.patterns = patterns
  }

  /**
   * 为新项目匹配最佳实践
   * @param {Object} newProject - 新项目信息
   */
  matchBestPractices(newProject) {
    if (this.patterns.length === 0) {
      return {
        matched: false,
        message: '暂无足够的历史数据支持推荐'
      }
    }

    // 计算与各模式的相似度
    const similarities = this.patterns.map(pattern => {
      const similarity = this.calculateSimilarity(newProject, pattern.characteristics)
      
      return {
        pattern,
        similarity,
        matched: similarity >= 0.7
      }
    })

    // 排序并取Top 3
    const topMatches = similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 3)
      .filter(m => m.matched)

    if (topMatches.length === 0) {
      return {
        matched: false,
        message: '未找到高度匹配的成功模式,建议采用通用最佳实践'
      }
    }

    // 返回最佳匹配
    const best = topMatches[0]
    
    return {
      matched: true,
      patternName: best.pattern.name,
      similarity: (best.similarity * 100).toFixed(0),
      recommendations: best.pattern.recommendations,
      keyFactors: best.pattern.keyFactors,
      expectedOutcome: {
        successRate: best.pattern.successRate,
        profitMargin: best.pattern.avgProfit,
        satisfaction: '4.6/5.0'
      },
      risks: this.identifyRisks(newProject, best.pattern),
      alternatives: topMatches.slice(1).map(m => ({
        patternName: m.pattern.name,
        similarity: (m.similarity * 100).toFixed(0)
      }))
    }
  }

  /**
   * 计算相似度(余弦相似度)
   */
  calculateSimilarity(project, characteristics) {
    // 特征向量化
    const projectVector = [
      project.teamSize || 8,
      project.durationDays || 90,
      project.budget || 1000000
    ]
    
    const patternVector = [
      characteristics.teamSize,
      characteristics.duration,
      characteristics.budget
    ]
    
    // 归一化
    const normalize = (vec) => {
      const max = Math.max(...vec)
      return vec.map(v => v / max)
    }
    
    const normProject = normalize(projectVector)
    const normPattern = normalize(patternVector)
    
    // 余弦相似度
    const dotProduct = normProject.reduce((sum, val, i) => sum + val * normPattern[i], 0)
    const magProject = Math.sqrt(normProject.reduce((sum, val) => sum + val * val, 0))
    const magPattern = Math.sqrt(normPattern.reduce((sum, val) => sum + val * val, 0))
    
    return dotProduct / (magProject * magPattern)
  }

  /**
   * 识别风险
   */
  identifyRisks(project, pattern) {
    const risks = []
    
    // 团队规模风险
    if (project.teamSize < pattern.characteristics.teamSize * 0.8) {
      risks.push({
        type: '人员不足',
        level: '中',
        suggestion: `建议增加${Math.ceil(pattern.characteristics.teamSize * 0.8 - project.teamSize)}名成员`
      })
    }
    
    // 工期风险
    if (project.durationDays < pattern.characteristics.duration * 0.7) {
      risks.push({
        type: '工期过紧',
        level: '高',
        suggestion: '建议调整工期或压缩功能范围'
      })
    }
    
    // 通用风险提示
    risks.push({
      type: '第三方API延迟',
      level: '低',
      suggestion: '类似项目30%存在此风险,建议提前2周完成API对接测试'
    })
    
    return risks
  }
}

// ========== 行为驱动模型管理器 ==========
export class BehaviorDrivenModelManager {
  constructor() {
    this.patternExtractor = new SuccessPatternExtractor()
    this.projectMatcher = new ProjectMatcher([])
  }

  /**
   * 分析客户行为
   * @param {String} customerId - 客户ID
   * @param {Object} behaviorData - 行为数据
   */
  async analyzeCustomer(customerId, behaviorData) {
    const { visitLogs, interactions, orders, socialData, referralSource } = behaviorData

    // 计算行为特征
    const behaviorFeatures = this.extractBehaviorFeatures(visitLogs, interactions, orders, socialData)
    
    // 计算行为分数
    const behaviorScore = this.calculateBehaviorScore(behaviorFeatures)
    
    // 预测购买倾向
    const propensity = this.predictPurchasePropensity(behaviorFeatures)
    
    // 识别生命周期阶段
    const stage = this.identifyLifecycleStage(behaviorFeatures, behaviorScore)
    
    // 分析客户旅程
    const customerJourney = this.analyzeCustomerJourney(visitLogs, interactions, orders)
    
    // 生成关键洞察
    const keyInsights = this.generateInsights(behaviorFeatures, behaviorScore, propensity)
    
    // 推荐行动
    const topActions = this.recommendActions(behaviorFeatures, propensity, stage)
    
    return {
      behaviorFeatures: {
        features: behaviorFeatures
      },
      summary: {
        behaviorScore,
        propensity,
        propensityLabel: this.getPropensityLabel(propensity),
        stage,
        keyInsights,
        topActions
      },
      customerJourney
    }
  }

  /**
   * 提取行为特征
   */
  extractBehaviorFeatures(visitLogs, interactions, orders, socialData) {
    return {
      visit: {
        frequency: visitLogs?.length || 0,
        recency: this.calculateRecency(visitLogs),
        avgDuration: this.calculateAvgDuration(visitLogs)
      },
      interaction: {
        inquiryCount: interactions?.length || 0,
        responseRate: this.calculateResponseRate(interactions),
        avgResponseTime: this.calculateAvgResponseTime(interactions)
      },
      purchase: {
        frequency: orders?.length || 0,
        lifetimeValue: this.calculateLifetimeValue(orders),
        avgOrderValue: this.calculateAvgOrderValue(orders)
      },
      social: {
        shareCount: socialData?.shareCount || 0,
        referralCount: socialData?.referralCount || 0,
        engagementScore: socialData?.engagementScore || 0
      }
    }
  }

  /**
   * 计算行为分数
   */
  calculateBehaviorScore(features) {
    const visitScore = Math.min(features.visit.frequency * 3, 30)
    const interactionScore = Math.min(features.interaction.inquiryCount * 5, 30)
    const purchaseScore = Math.min(features.purchase.frequency * 10, 30)
    const socialScore = Math.min(features.social.engagementScore, 10)
    
    return Math.round(visitScore + interactionScore + purchaseScore + socialScore)
  }

  /**
   * 预测购买倾向
   */
  predictPurchasePropensity(features) {
    let score = 0
    
    // 访问频率权重: 20%
    score += Math.min(features.visit.frequency * 2, 20)
    
    // 互动质量权重: 30%
    score += Math.min(features.interaction.inquiryCount * 3, 30)
    
    // 购买历史权重: 40%
    score += Math.min(features.purchase.frequency * 8, 40)
    
    // 社交影响权重: 10%
    score += Math.min(features.social.engagementScore * 0.5, 10)
    
    return Math.min(Math.round(score), 100)
  }

  /**
   * 识别生命周期阶段
   */
  identifyLifecycleStage(features, behaviorScore) {
    if (features.purchase.frequency === 0 && features.interaction.inquiryCount === 0) {
      return '访客'
    }
    
    if (features.purchase.frequency === 0 && features.interaction.inquiryCount > 0) {
      return behaviorScore > 50 ? '商机' : '线索'
    }
    
    if (features.purchase.frequency > 0) {
      const daysSinceLastPurchase = this.calculateDaysSinceLastPurchase()
      
      if (daysSinceLastPurchase > 180) {
        return '流失风险'
      }
      
      if (daysSinceLastPurchase > 365) {
        return '已流失'
      }
      
      return features.purchase.frequency >= 3 ? '忠诚客户' : '客户'
    }
    
    return '访客'
  }

  /**
   * 分析客户旅程
   */
  analyzeCustomerJourney(visitLogs, interactions, orders) {
    const journey = []
    
    // 合并所有事件
    const events = [
      ...(visitLogs || []).map(v => ({ type: '访问', timestamp: v.timestamp, data: v })),
      ...(interactions || []).map(i => ({ type: '互动', timestamp: i.timestamp, data: i })),
      ...(orders || []).map(o => ({ type: '购买', timestamp: o.timestamp, data: o }))
    ].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
    
    // 构建路径
    const currentPath = events.map((event, idx) => ({
      step: `${event.type} ${idx + 1}`,
      timestamp: event.timestamp,
      type: event.type
    }))
    
    // 识别瓶颈
    const bottlenecks = this.identifyBottlenecks(currentPath)
    
    // 预测下一步
    const nextSteps = this.predictNextSteps(currentPath)
    
    // 生成推荐
    const recommendations = this.generateJourneyRecommendations(currentPath, bottlenecks)
    
    return {
      currentPath,
      pathType: {
        label: this.classifyPathType(currentPath),
        efficiency: this.calculatePathEfficiency(currentPath)
      },
      completion: this.calculateCompletion(currentPath),
      bottlenecks,
      nextSteps,
      recommendations
    }
  }

  /**
   * 生成关键洞察
   */
  generateInsights(features, behaviorScore, propensity) {
    const insights = []
    
    if (behaviorScore >= 80) {
      insights.push('该客户行为得分优秀，表现出强烈的参与意愿')
    }
    
    if (propensity >= 70) {
      insights.push('购买倾向很高，建议尽快跟进促成交易')
    }
    
    if (features.visit.frequency > 10) {
      insights.push('访问频率高，对产品/服务保持持续关注')
    }
    
    if (features.interaction.inquiryCount > 5) {
      insights.push('多次咨询表明客户有明确需求')
    }
    
    if (features.purchase.frequency > 0) {
      insights.push(`已有 ${features.purchase.frequency} 次购买历史，是有价值的客户`)
    }
    
    if (insights.length === 0) {
      insights.push('客户处于早期阶段，需要培育和引导')
    }
    
    return insights
  }

  /**
   * 推荐行动
   */
  recommendActions(features, propensity, stage) {
    const actions = []
    
    if (propensity >= 80) {
      actions.push({
        priority: 'urgent',
        action: '立即联系并发送报价',
        reason: '购买意向极高，成交概率大'
      })
    } else if (propensity >= 60) {
      actions.push({
        priority: 'high',
        action: '安排产品演示或试用',
        reason: '客户兴趣较高，需要进一步了解产品'
      })
    } else if (propensity >= 40) {
      actions.push({
        priority: 'medium',
        action: '定期发送产品资讯',
        reason: '保持联系，培育购买意向'
      })
    } else {
      actions.push({
        priority: 'low',
        action: '添加到长期培育列表',
        reason: '目前意向不强，需要长期跟进'
      })
    }
    
    if (stage === '流失风险' || stage === '已流失') {
      actions.unshift({
        priority: 'urgent',
        action: '发送挽回优惠或关怀',
        reason: '客户有流失风险，需要立即行动'
      })
    }
    
    if (features.interaction.inquiryCount > 0 && features.purchase.frequency === 0) {
      actions.push({
        priority: 'high',
        action: '跟进之前的咨询',
        reason: '客户有过咨询但未购买，可能存在顾虑'
      })
    }
    
    return actions.slice(0, 3)
  }

  /**
   * 获取倾向标签
   */
  getPropensityLabel(propensity) {
    if (propensity >= 80) return '极高'
    if (propensity >= 60) return '高'
    if (propensity >= 40) return '中'
    return '低'
  }

  // ========== 辅助方法 ==========
  calculateRecency(logs) {
    if (!logs || logs.length === 0) return 0
    const lastVisit = new Date(logs[logs.length - 1].timestamp)
    const now = new Date()
    return Math.floor((now - lastVisit) / (1000 * 60 * 60 * 24))
  }

  calculateAvgDuration(logs) {
    if (!logs || logs.length === 0) return 0
    const total = logs.reduce((sum, log) => sum + (log.duration || 0), 0)
    return Math.round(total / logs.length)
  }

  calculateResponseRate(interactions) {
    if (!interactions || interactions.length === 0) return 0
    const responded = interactions.filter(i => i.responded).length
    return Math.round((responded / interactions.length) * 100)
  }

  calculateAvgResponseTime(interactions) {
    if (!interactions || interactions.length === 0) return 0
    const total = interactions.reduce((sum, i) => sum + (i.responseTime || 0), 0)
    return Math.round(total / interactions.length)
  }

  calculateLifetimeValue(orders) {
    if (!orders || orders.length === 0) return 0
    return orders.reduce((sum, order) => sum + (order.amount || 0), 0)
  }

  calculateAvgOrderValue(orders) {
    if (!orders || orders.length === 0) return 0
    const total = this.calculateLifetimeValue(orders)
    return Math.round(total / orders.length)
  }

  calculateDaysSinceLastPurchase() {
    // 简化实现，返回默认值
    return 30
  }

  identifyBottlenecks(path) {
    const bottlenecks = []
    
    for (let i = 0; i < path.length - 1; i++) {
      const current = new Date(path[i].timestamp)
      const next = new Date(path[i + 1].timestamp)
      const delayDays = Math.floor((next - current) / (1000 * 60 * 60 * 24))
      
      if (delayDays > 30) {
        bottlenecks.push({
          step: path[i].step,
          nextStep: path[i + 1].step,
          delayDays,
          severity: delayDays > 60 ? 'high' : 'medium'
        })
      }
    }
    
    return bottlenecks
  }

  predictNextSteps(path) {
    if (path.length === 0) return []
    
    const lastType = path[path.length - 1].type
    
    const predictions = {
      '访问': [
        { step: '咨询产品', probability: 0.6 },
        { step: '再次访问', probability: 0.3 }
      ],
      '互动': [
        { step: '请求报价', probability: 0.5 },
        { step: '预约演示', probability: 0.3 }
      ],
      '购买': [
        { step: '复购', probability: 0.4 },
        { step: '推荐他人', probability: 0.2 }
      ]
    }
    
    return predictions[lastType] || []
  }

  generateJourneyRecommendations(path, bottlenecks) {
    const recommendations = []
    
    if (bottlenecks.length > 0) {
      recommendations.push({
        priority: 'high',
        issue: '存在流程瓶颈',
        suggestion: '加强跟进，缩短客户决策周期'
      })
    }
    
    if (path.length < 3) {
      recommendations.push({
        priority: 'medium',
        issue: '互动次数较少',
        suggestion: '增加接触点，建立信任关系'
      })
    }
    
    const hasPurchase = path.some(p => p.type === '购买')
    if (!hasPurchase && path.length > 5) {
      recommendations.push({
        priority: 'high',
        issue: '多次互动未转化',
        suggestion: '了解客户顾虑，提供针对性解决方案'
      })
    }
    
    return recommendations
  }

  classifyPathType(path) {
    if (path.length < 3) return '简短路径'
    if (path.length > 10) return '复杂路径'
    return '标准路径'
  }

  calculatePathEfficiency(path) {
    const hasPurchase = path.some(p => p.type === '购买')
    
    if (!hasPurchase) return 'low'
    
    if (path.length <= 5) return 'high'
    if (path.length <= 10) return 'medium'
    return 'low'
  }

  calculateCompletion(path) {
    const hasPurchase = path.some(p => p.type === '购买')
    if (hasPurchase) return 100
    
    if (path.some(p => p.type === '互动')) return 60
    if (path.some(p => p.type === '访问')) return 30
    
    return 0
  }
}

// ========== 导出 ==========
export default {
  SuccessPatternExtractor,
  ProjectMatcher,
  BehaviorDrivenModelManager
}
