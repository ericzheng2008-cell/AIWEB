/**
 * AI询盘评分系统
 * 根据多维度数据自动评估客户质量
 */

export class LeadScoringEngine {
  constructor() {
    // 评分权重配置
    this.weights = {
      companyBackground: 30,  // 公司背景
      industryMatch: 25,      // 行业匹配度
      budgetCapability: 20,   // 预算能力
      requirementMaturity: 15, // 需求成熟度
      interactionQuality: 10   // 交互质量
    }

    // 目标市场权重
    this.marketWeights = {
      'USA': 1.2,
      'Germany': 1.2,
      'Japan': 1.15,
      'UK': 1.1,
      'France': 1.1,
      'China': 1.0,
      'Other': 0.9
    }
  }

  /**
   * 评估询盘质量
   * @param {Object} inquiryData - 询盘数据
   * @returns {Object} 评分结果
   */
  async scoreInquiry(inquiryData) {
    let totalScore = 0
    const scoreDetails = {}

    // 1. 公司背景验证（30分）
    const companyScore = await this.evaluateCompanyBackground(inquiryData)
    scoreDetails.companyBackground = companyScore
    totalScore += companyScore

    // 2. 行业匹配度（25分）
    const industryScore = this.evaluateIndustryMatch(inquiryData.industry)
    scoreDetails.industryMatch = industryScore
    totalScore += industryScore

    // 3. 预算能力（20分）
    const budgetScore = this.evaluateBudgetCapability(inquiryData)
    scoreDetails.budgetCapability = budgetScore
    totalScore += budgetScore

    // 4. 需求成熟度（15分）
    const maturityScore = this.evaluateRequirementMaturity(inquiryData.requirements)
    scoreDetails.requirementMaturity = maturityScore
    totalScore += maturityScore

    // 5. 交互质量（10分）
    const interactionScore = this.evaluateInteractionQuality(inquiryData.conversation)
    scoreDetails.interactionQuality = interactionScore
    totalScore += interactionScore

    // 地理位置加权
    const locationMultiplier = this.getLocationMultiplier(inquiryData.country)
    const finalScore = Math.min(100, totalScore * locationMultiplier)

    return {
      score: Math.round(finalScore),
      grade: this.getGrade(finalScore),
      scoreDetails,
      recommendation: this.getRecommendation(finalScore),
      priority: this.getPriority(finalScore),
      estimatedValue: this.estimateValue(inquiryData),
      nextActions: this.getNextActions(finalScore)
    }
  }

  /**
   * 评估公司背景
   */
  async evaluateCompanyBackground(inquiryData) {
    let score = 0
    const { company, email, phone, website } = inquiryData

    // 公司名称有效性
    if (company && company.length > 3) {
      score += 10
    }

    // 邮箱域名分析
    if (email) {
      const domain = email.split('@')[1]
      if (domain && !['gmail.com', 'yahoo.com', 'hotmail.com', '163.com', 'qq.com'].includes(domain)) {
        score += 10 // 企业邮箱
      }
      if (website && domain === website.replace(/^https?:\/\//, '').split('/')[0]) {
        score += 5 // 邮箱域名与网站一致
      }
    }

    // LinkedIn验证（模拟）
    if (inquiryData.linkedinProfile) {
      score += 5
    }

    return Math.min(30, score)
  }

  /**
   * 评估行业匹配度
   */
  evaluateIndustryMatch(industry) {
    const targetIndustries = {
      'automotive': 25,       // 汽车制造
      'aerospace': 25,        // 航空航天
      'energy': 20,          // 能源设备
      'rail': 20,            // 轨道交通
      'electronics': 18,     // 电子制造
      'machinery': 15,       // 机械加工
      'other': 10
    }

    return targetIndustries[industry] || targetIndustries['other']
  }

  /**
   * 评估预算能力
   */
  evaluateBudgetCapability(inquiryData) {
    let score = 0
    const { quantity, budget, productType } = inquiryData

    // 采购数量
    if (quantity) {
      if (quantity >= 100) score += 10
      else if (quantity >= 50) score += 8
      else if (quantity >= 10) score += 6
      else score += 3
    }

    // 预算范围
    if (budget) {
      if (budget >= 100000) score += 10
      else if (budget >= 50000) score += 8
      else if (budget >= 20000) score += 6
      else score += 4
    }

    return Math.min(20, score)
  }

  /**
   * 评估需求成熟度
   */
  evaluateRequirementMaturity(requirements) {
    let score = 0

    if (!requirements) return 0

    // 参数明确度
    const params = ['torqueRange', 'powerType', 'precision', 'application', 'deliveryTime']
    const definedParams = params.filter(p => requirements[p] !== undefined && requirements[p] !== '')
    score += (definedParams.length / params.length) * 10

    // 技术参数详细程度
    if (requirements.technicalSpecs && requirements.technicalSpecs.length > 0) {
      score += 5
    }

    return Math.min(15, score)
  }

  /**
   * 评估交互质量
   */
  evaluateInteractionQuality(conversation) {
    let score = 0

    if (!conversation || !Array.isArray(conversation)) return 0

    // 对话轮次
    const turns = conversation.length
    if (turns >= 10) score += 4
    else if (turns >= 5) score += 3
    else if (turns >= 3) score += 2
    else score += 1

    // 深度问题数量
    const deepQuestions = conversation.filter(msg => 
      msg.type === 'user' && msg.content.length > 50
    ).length
    if (deepQuestions >= 3) score += 3
    else if (deepQuestions >= 1) score += 2

    // 资料下载
    if (conversation.some(msg => msg.action === 'download')) {
      score += 2
    }

    // 视频观看
    if (conversation.some(msg => msg.action === 'watch_video')) {
      score += 1
    }

    return Math.min(10, score)
  }

  /**
   * 获取地理位置加权系数
   */
  getLocationMultiplier(country) {
    return this.marketWeights[country] || this.marketWeights['Other']
  }

  /**
   * 获取评级
   */
  getGrade(score) {
    if (score >= 90) return 'A'
    if (score >= 70) return 'B'
    if (score >= 50) return 'C'
    return 'D'
  }

  /**
   * 获取建议
   */
  getRecommendation(score) {
    const grade = this.getGrade(score)
    
    const recommendations = {
      'A': {
        'zh-CN': '高价值客户，立即分配销售经理跟进，24小时内发送详细报价',
        'en-US': 'High-value customer, assign sales manager immediately, send detailed quote within 24 hours'
      },
      'B': {
        'zh-CN': '潜在优质客户，48小时内电话跟进，提供定制化方案',
        'en-US': 'Potential quality customer, follow up by phone within 48 hours, provide customized solution'
      },
      'C': {
        'zh-CN': '一般询盘，加入培育池，定期发送产品资讯和案例',
        'en-US': 'Regular inquiry, add to nurturing pool, send product news and cases regularly'
      },
      'D': {
        'zh-CN': '低质量询盘，自动回复标准资料，不分配销售资源',
        'en-US': 'Low-quality inquiry, auto-reply with standard materials, no sales resource allocation'
      }
    }

    return recommendations[grade]
  }

  /**
   * 获取优先级
   */
  getPriority(score) {
    if (score >= 90) return 'critical'
    if (score >= 70) return 'high'
    if (score >= 50) return 'medium'
    return 'low'
  }

  /**
   * 估算订单价值
   */
  estimateValue(inquiryData) {
    const { quantity = 1, budget, productType } = inquiryData

    // 基于产品类型的平均单价
    const avgPrices = {
      'electric': 10000,
      'pneumatic': 8000,
      'battery': 15000,
      'manual': 3000,
      'automated': 50000,
      'smart': 80000
    }

    const avgPrice = avgPrices[productType] || 10000
    
    let estimatedValue = quantity * avgPrice

    if (budget && budget < estimatedValue) {
      estimatedValue = budget
    }

    return {
      min: estimatedValue * 0.7,
      max: estimatedValue * 1.3,
      expected: estimatedValue,
      currency: 'CNY'
    }
  }

  /**
   * 获取下一步行动建议
   */
  getNextActions(score) {
    const grade = this.getGrade(score)

    const actions = {
      'A': [
        { action: 'assign_sales', deadline: '1h', priority: 'critical' },
        { action: 'send_quotation', deadline: '24h', priority: 'high' },
        { action: 'schedule_call', deadline: '48h', priority: 'high' },
        { action: 'send_samples', deadline: '7d', priority: 'medium' }
      ],
      'B': [
        { action: 'send_quotation', deadline: '48h', priority: 'high' },
        { action: 'schedule_call', deadline: '5d', priority: 'medium' },
        { action: 'send_case_study', deadline: '7d', priority: 'medium' }
      ],
      'C': [
        { action: 'auto_reply', deadline: '24h', priority: 'medium' },
        { action: 'add_to_nurture', deadline: '24h', priority: 'low' },
        { action: 'send_newsletter', deadline: '7d', priority: 'low' }
      ],
      'D': [
        { action: 'auto_reply', deadline: '48h', priority: 'low' },
        { action: 'tag_as_spam', deadline: '24h', priority: 'low' }
      ]
    }

    return actions[grade] || actions['D']
  }

  /**
   * 批量评分
   */
  async scoreMultipleInquiries(inquiries) {
    const results = await Promise.all(
      inquiries.map(inquiry => this.scoreInquiry(inquiry))
    )

    // 按评分排序
    return results.sort((a, b) => b.score - a.score)
  }

  /**
   * 生成评分报告
   */
  generateReport(scoringResult) {
    return {
      summary: {
        grade: scoringResult.grade,
        score: scoringResult.score,
        priority: scoringResult.priority
      },
      details: scoringResult.scoreDetails,
      estimatedValue: scoringResult.estimatedValue,
      recommendation: scoringResult.recommendation,
      nextActions: scoringResult.nextActions,
      timestamp: new Date().toISOString()
    }
  }
}

export default LeadScoringEngine
