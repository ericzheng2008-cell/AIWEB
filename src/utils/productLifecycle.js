/**
 * P2-6: 产品动态生命周期管理系统
 * 功能: BCG矩阵、生命周期分析、动态定价、库存优化
 */

// 1. 产品生命周期分析引擎
export class ProductLifecycleAnalyzer {
  constructor() {
    this.stages = ['导入期', '成长期', '成熟期', '衰退期', '淘汰期']
  }

  /**
   * 识别产品生命周期阶段
   * @param {Object} product - 产品数据
   * @returns {Object} 阶段识别结果
   */
  identifyStage(product) {
    const { salesTrend, growthRate, profitMargin, marketShare, monthsSinceLaunch } = product

    // 计算综合得分
    const scores = {
      introduction: this._scoreIntroduction(monthsSinceLaunch, salesTrend, marketShare),
      growth: this._scoreGrowth(growthRate, salesTrend, profitMargin),
      maturity: this._scoreMaturity(growthRate, profitMargin, marketShare),
      decline: this._scoreDecline(salesTrend, growthRate, profitMargin),
      obsolete: this._scoreObsolete(salesTrend, monthsSinceLaunch, profitMargin)
    }

    // 找出最高得分的阶段
    const stage = Object.entries(scores).reduce((max, [key, value]) => 
      value > max.score ? { stage: key, score: value } : max,
      { stage: 'maturity', score: 0 }
    )

    return {
      currentStage: this._mapStageToText(stage.stage),
      confidence: (stage.score / 100).toFixed(2),
      scores,
      characteristics: this._getStageCharacteristics(stage.stage),
      recommendations: this._getStageRecommendations(stage.stage, product)
    }
  }

  _scoreIntroduction(months, trend, share) {
    let score = 0
    if (months < 6) score += 40
    if (trend.recent > 0.5) score += 30
    if (share < 0.05) score += 30
    return score
  }

  _scoreGrowth(growth, trend, margin) {
    let score = 0
    if (growth > 0.3) score += 40
    if (trend.recent > 0.7) score += 30
    if (margin > 0.15) score += 30
    return score
  }

  _scoreMaturity(growth, margin, share) {
    let score = 0
    if (growth >= 0 && growth <= 0.1) score += 35
    if (margin > 0.2) score += 35
    if (share > 0.1) score += 30
    return score
  }

  _scoreDecline(trend, growth, margin) {
    let score = 0
    if (growth < 0) score += 40
    if (trend.recent < -0.2) score += 30
    if (margin < 0.1) score += 30
    return score
  }

  _scoreObsolete(trend, months, margin) {
    let score = 0
    if (trend.recent < -0.5) score += 40
    if (months > 60) score += 30
    if (margin < 0.05) score += 30
    return score
  }

  _mapStageToText(stage) {
    const map = {
      introduction: '导入期',
      growth: '成长期',
      maturity: '成熟期',
      decline: '衰退期',
      obsolete: '淘汰期'
    }
    return map[stage] || '未知'
  }

  _getStageCharacteristics(stage) {
    const characteristics = {
      introduction: ['市场认知度低', '销量缓慢增长', '投入成本高', '利润率低'],
      growth: ['销量快速增长', '市场份额扩大', '利润开始增长', '竞争者进入'],
      maturity: ['销量增长放缓', '市场份额稳定', '利润达到峰值', '竞争激烈'],
      decline: ['销量持续下降', '利润开始萎缩', '市场份额流失', '替代品出现'],
      obsolete: ['销量极低', '无利润或亏损', '市场已被替代', '建议淘汰']
    }
    return characteristics[stage] || []
  }

  _getStageRecommendations(stage, product) {
    const recommendations = {
      introduction: [
        { action: '加大市场推广', priority: 'high', impact: '+30%销量' },
        { action: '优化产品功能', priority: 'high', impact: '+20%用户满意度' },
        { action: '建立渠道网络', priority: 'medium', impact: '+25%覆盖率' }
      ],
      growth: [
        { action: '扩大产能', priority: 'high', impact: '+40%供应' },
        { action: '增加营销投入', priority: 'high', impact: '+35%市场份额' },
        { action: '优化定价策略', priority: 'medium', impact: '+15%利润' }
      ],
      maturity: [
        { action: '降低成本', priority: 'high', impact: '+10%利润率' },
        { action: '产品差异化', priority: 'medium', impact: '+8%市场份额' },
        { action: '稳定价格', priority: 'low', impact: '维持现状' }
      ],
      decline: [
        { action: '控制库存', priority: 'high', impact: '-30%积压' },
        { action: '促销清仓', priority: 'high', impact: '加快资金回笼' },
        { action: '评估淘汰', priority: 'medium', impact: '优化产品线' }
      ],
      obsolete: [
        { action: '停止生产', priority: 'high', impact: '避免亏损' },
        { action: '清空库存', priority: 'high', impact: '释放资金' },
        { action: '推出替代品', priority: 'medium', impact: '保留客户' }
      ]
    }
    return recommendations[stage] || []
  }

  /**
   * 批量分析产品组合
   */
  analyzePortfolio(products) {
    const results = products.map(p => ({
      ...p,
      lifecycle: this.identifyStage(p)
    }))

    // 统计各阶段产品数量
    const distribution = results.reduce((acc, p) => {
      const stage = p.lifecycle.currentStage
      acc[stage] = (acc[stage] || 0) + 1
      return acc
    }, {})

    // 风险评估
    const riskScore = this._assessPortfolioRisk(distribution)

    return {
      products: results,
      distribution,
      totalProducts: products.length,
      riskScore,
      recommendations: this._getPortfolioRecommendations(distribution, riskScore)
    }
  }

  _assessPortfolioRisk(distribution) {
    const weights = {
      '导入期': 0.3,
      '成长期': 0.1,
      '成熟期': 0.2,
      '衰退期': 0.6,
      '淘汰期': 0.9
    }

    const totalProducts = Object.values(distribution).reduce((sum, count) => sum + count, 0)
    const riskScore = Object.entries(distribution).reduce((sum, [stage, count]) => {
      return sum + (weights[stage] || 0) * (count / totalProducts)
    }, 0)

    return (riskScore * 100).toFixed(1)
  }

  _getPortfolioRecommendations(distribution, riskScore) {
    const recommendations = []

    if (riskScore > 50) {
      recommendations.push({
        type: 'warning',
        message: '产品组合风险较高,建议加快新产品开发',
        priority: 'high'
      })
    }

    if ((distribution['衰退期'] || 0) + (distribution['淘汰期'] || 0) > 3) {
      recommendations.push({
        type: 'danger',
        message: '衰退/淘汰产品过多,建议淘汰并推出替代品',
        priority: 'high'
      })
    }

    if ((distribution['导入期'] || 0) > 5) {
      recommendations.push({
        type: 'info',
        message: '新产品过多,建议集中资源支持重点产品',
        priority: 'medium'
      })
    }

    if ((distribution['成熟期'] || 0) / Object.values(distribution).reduce((a, b) => a + b, 0) > 0.6) {
      recommendations.push({
        type: 'success',
        message: '产品组合健康,建议维持现状并规划新产品',
        priority: 'low'
      })
    }

    return recommendations
  }
}

// 2. BCG矩阵分析引擎
export class BCGMatrixAnalyzer {
  constructor() {
    this.quadrants = ['明星', '现金牛', '问题', '瘦狗']
  }

  /**
   * BCG矩阵分类
   * @param {Object} product - 产品数据
   * @returns {Object} BCG分类结果
   */
  classify(product) {
    const { marketGrowthRate, relativeMarketShare } = product

    // 分类阈值
    const growthThreshold = 0.1  // 10%
    const shareThreshold = 1.0   // 相对份额1.0

    let category = ''
    if (marketGrowthRate >= growthThreshold && relativeMarketShare >= shareThreshold) {
      category = '明星'
    } else if (marketGrowthRate < growthThreshold && relativeMarketShare >= shareThreshold) {
      category = '现金牛'
    } else if (marketGrowthRate >= growthThreshold && relativeMarketShare < shareThreshold) {
      category = '问题'
    } else {
      category = '瘦狗'
    }

    return {
      category,
      position: {
        x: relativeMarketShare,
        y: marketGrowthRate
      },
      characteristics: this._getCategoryCharacteristics(category),
      strategy: this._getCategoryStrategy(category)
    }
  }

  _getCategoryCharacteristics(category) {
    const characteristics = {
      '明星': ['高增长', '高市场份额', '需要大量投资', '未来现金牛'],
      '现金牛': ['低增长', '高市场份额', '产生大量现金', '维持投资'],
      '问题': ['高增长', '低市场份额', '需要大量投资', '未来不确定'],
      '瘦狗': ['低增长', '低市场份额', '低利润', '考虑淘汰']
    }
    return characteristics[category] || []
  }

  _getCategoryStrategy(category) {
    const strategies = {
      '明星': {
        investment: 'high',
        description: '加大投资,巩固市场地位,争取成为未来的现金牛',
        actions: ['扩大产能', '加强营销', '提升品质', '培养品牌忠诚度']
      },
      '现金牛': {
        investment: 'maintain',
        description: '维持投资,收割现金,为其他产品提供资金支持',
        actions: ['优化成本', '稳定价格', '维护客户关系', '延长生命周期']
      },
      '问题': {
        investment: 'selective',
        description: '选择性投资,评估潜力,决定重点投入或放弃',
        actions: ['市场调研', '评估竞争力', '增加营销', '或考虑退出']
      },
      '瘦狗': {
        investment: 'low',
        description: '减少投资,收割残值,考虑淘汰或出售',
        actions: ['控制成本', '清理库存', '评估淘汰', '寻找买家']
      }
    }
    return strategies[category] || {}
  }

  /**
   * 批量BCG分析
   */
  analyzeBCGMatrix(products) {
    const results = products.map(p => ({
      ...p,
      bcg: this.classify(p)
    }))

    // 统计各象限产品
    const distribution = results.reduce((acc, p) => {
      const category = p.bcg.category
      acc[category] = (acc[category] || []).concat(p)
      return acc
    }, {})

    // 战略建议
    const strategyRecommendations = this._getMatrixRecommendations(distribution)

    return {
      products: results,
      distribution,
      strategyRecommendations
    }
  }

  _getMatrixRecommendations(distribution) {
    const recommendations = []

    // 检查明星产品
    if ((distribution['明星'] || []).length === 0) {
      recommendations.push({
        type: 'warning',
        message: '缺少明星产品,未来增长堪忧,建议加大新产品研发',
        priority: 'high'
      })
    }

    // 检查现金牛
    if ((distribution['现金牛'] || []).length === 0) {
      recommendations.push({
        type: 'danger',
        message: '缺少现金牛产品,现金流可能不足,需要快速培育明星产品',
        priority: 'high'
      })
    }

    // 检查问题产品
    if ((distribution['问题'] || []).length > 5) {
      recommendations.push({
        type: 'warning',
        message: '问题产品过多,建议优先选择2-3个重点培育',
        priority: 'medium'
      })
    }

    // 检查瘦狗产品
    if ((distribution['瘦狗'] || []).length > 3) {
      recommendations.push({
        type: 'info',
        message: '瘦狗产品较多,建议淘汰以释放资源',
        priority: 'medium'
      })
    }

    return recommendations
  }
}

// 3. 动态定价引擎
export class DynamicPricingEngine {
  /**
   * 计算最优定价
   * @param {Object} product - 产品数据
   * @param {Object} market - 市场数据
   * @returns {Object} 定价建议
   */
  calculateOptimalPrice(product, market) {
    const { cost, currentPrice, elasticity } = product
    const { demand, competitorPrices, seasonality } = market

    // 1. 成本加成定价
    const costPlusPrice = cost * 1.3  // 30%加成

    // 2. 需求弹性定价
    const elasticityPrice = this._priceByElasticity(currentPrice, demand, elasticity)

    // 3. 竞争导向定价
    const competitivePrice = this._priceByCompetition(competitorPrices, product.quality)

    // 4. 季节性调整
    const seasonalAdjustment = seasonality || 1.0

    // 综合定价 (加权平均)
    const optimalPrice = (
      costPlusPrice * 0.3 +
      elasticityPrice * 0.4 +
      competitivePrice * 0.3
    ) * seasonalAdjustment

    // 价格区间
    const priceRange = {
      min: Math.max(cost * 1.1, optimalPrice * 0.9),  // 保证至少10%利润
      optimal: optimalPrice,
      max: optimalPrice * 1.2
    }

    return {
      recommendedPrice: Math.round(optimalPrice),
      priceRange,
      expectedImpact: this._calculatePriceImpact(currentPrice, optimalPrice, elasticity),
      reasoning: this._getPricingReasoning(costPlusPrice, elasticityPrice, competitivePrice)
    }
  }

  _priceByElasticity(currentPrice, demand, elasticity) {
    // 价格弹性公式: % change in demand = elasticity × % change in price
    // 目标: 最大化收益 = price × demand
    const optimalMultiplier = 1 / (1 + elasticity)
    return currentPrice * optimalMultiplier
  }

  _priceByCompetition(competitorPrices, quality) {
    const avgCompetitorPrice = competitorPrices.reduce((sum, p) => sum + p, 0) / competitorPrices.length
    
    // 质量溢价 (quality: 1-5)
    const qualityPremium = 1 + (quality - 3) * 0.1
    
    return avgCompetitorPrice * qualityPremium
  }

  _calculatePriceImpact(oldPrice, newPrice, elasticity) {
    const priceChange = ((newPrice - oldPrice) / oldPrice) * 100
    const demandChange = priceChange * elasticity
    const revenueChange = priceChange + demandChange

    return {
      priceChange: priceChange.toFixed(1) + '%',
      demandChange: demandChange.toFixed(1) + '%',
      revenueChange: revenueChange.toFixed(1) + '%'
    }
  }

  _getPricingReasoning(costPlus, elasticity, competitive) {
    return [
      { factor: '成本导向', price: costPlus.toFixed(0), weight: '30%' },
      { factor: '需求弹性', price: elasticity.toFixed(0), weight: '40%' },
      { factor: '竞争导向', price: competitive.toFixed(0), weight: '30%' }
    ]
  }
}

// 4. 库存优化引擎
export class InventoryOptimizer {
  /**
   * 优化库存水平
   * @param {Object} product - 产品数据
   * @returns {Object} 库存优化建议
   */
  optimizeInventory(product) {
    const { demand, leadTime, currentInventory, cost, holdingCostRate } = product

    // 1. 经济订货量 (EOQ)
    const eoq = this._calculateEOQ(demand.annual, cost.order, cost.unit, holdingCostRate)

    // 2. 安全库存
    const safetyStock = this._calculateSafetyStock(demand, leadTime)

    // 3. 再订货点
    const reorderPoint = (demand.daily * leadTime) + safetyStock

    // 4. 库存周转率
    const turnoverRate = demand.annual / ((currentInventory + eoq) / 2)

    // 5. 库存健康度评分
    const healthScore = this._calculateInventoryHealth(currentInventory, eoq, safetyStock, turnoverRate)

    return {
      eoq: Math.round(eoq),
      safetyStock: Math.round(safetyStock),
      reorderPoint: Math.round(reorderPoint),
      currentInventory,
      turnoverRate: turnoverRate.toFixed(1),
      healthScore,
      recommendations: this._getInventoryRecommendations(currentInventory, eoq, reorderPoint, healthScore)
    }
  }

  _calculateEOQ(annualDemand, orderCost, unitCost, holdingRate) {
    // EOQ = sqrt((2 × D × S) / (H × C))
    // D: 年需求量, S: 订货成本, H: 持有成本率, C: 单位成本
    return Math.sqrt((2 * annualDemand * orderCost) / (holdingRate * unitCost))
  }

  _calculateSafetyStock(demand, leadTime) {
    // 安全库存 = Z × σ × sqrt(L)
    // Z: 服务水平系数 (95% → 1.65), σ: 需求标准差, L: 提前期
    const Z = 1.65  // 95%服务水平
    const sigma = demand.stdDev || (demand.daily * 0.2)  // 假设20%波动
    return Z * sigma * Math.sqrt(leadTime)
  }

  _calculateInventoryHealth(current, eoq, safety, turnover) {
    let score = 100

    // 库存水平合理性 (±20%范围内)
    const inventoryRatio = current / (eoq + safety)
    if (inventoryRatio < 0.8) score -= 20  // 库存不足
    if (inventoryRatio > 1.2) score -= 15  // 库存过高

    // 周转率健康度
    if (turnover < 4) score -= 20  // 周转慢
    if (turnover > 12) score -= 10  // 周转过快可能缺货

    return Math.max(0, score)
  }

  _getInventoryRecommendations(current, eoq, reorder, health) {
    const recommendations = []

    if (current < reorder) {
      recommendations.push({
        type: 'danger',
        message: `当前库存(${current})低于再订货点(${Math.round(reorder)}),建议立即补货`,
        priority: 'high',
        action: `补货数量: ${Math.round(eoq)}件`
      })
    }

    if (current > eoq * 2) {
      recommendations.push({
        type: 'warning',
        message: '库存过高,占用资金较多',
        priority: 'medium',
        action: '建议促销或调整采购计划'
      })
    }

    if (health < 60) {
      recommendations.push({
        type: 'warning',
        message: '库存健康度较低,需要优化',
        priority: 'high',
        action: '调整订货策略或需求预测'
      })
    }

    return recommendations
  }
}

// 5. 综合生命周期管理器
export class ProductLifecycleManager {
  constructor() {
    this.lifecycleAnalyzer = new ProductLifecycleAnalyzer()
    this.bcgAnalyzer = new BCGMatrixAnalyzer()
    this.pricingEngine = new DynamicPricingEngine()
    this.inventoryOptimizer = new InventoryOptimizer()
  }

  /**
   * 全面分析单个产品
   */
  analyzeProduct(product, market) {
    return {
      product: product,
      lifecycle: this.lifecycleAnalyzer.identifyStage(product),
      bcg: this.bcgAnalyzer.classify(product),
      pricing: this.pricingEngine.calculateOptimalPrice(product, market),
      inventory: this.inventoryOptimizer.optimizeInventory(product),
      overallScore: this._calculateOverallScore(product),
      actionPlan: this._generateActionPlan(product)
    }
  }

  /**
   * 产品组合全面分析
   */
  analyzePortfolio(products, markets) {
    const productAnalysis = products.map((p, i) => 
      this.analyzeProduct(p, markets[i] || {})
    )

    return {
      products: productAnalysis,
      portfolioHealth: this._assessPortfolioHealth(productAnalysis),
      recommendations: this._getPortfolioRecommendations(productAnalysis)
    }
  }

  _calculateOverallScore(product) {
    // 综合评分: 盈利性30% + 增长性30% + 风险20% + 战略价值20%
    const profitScore = product.profitMargin * 100
    const growthScore = Math.max(0, product.growthRate * 100)
    const riskScore = 100 - (product.riskLevel || 50)
    const strategicScore = product.strategicValue || 50

    return (
      profitScore * 0.3 +
      growthScore * 0.3 +
      riskScore * 0.2 +
      strategicScore * 0.2
    ).toFixed(1)
  }

  _generateActionPlan(product) {
    return {
      shortTerm: [
        '优化定价策略',
        '调整库存水平',
        '加强市场推广'
      ],
      mediumTerm: [
        '产品功能升级',
        '渠道拓展',
        '成本优化'
      ],
      longTerm: [
        '战略定位调整',
        '新产品开发',
        '市场扩张'
      ]
    }
  }

  _assessPortfolioHealth(products) {
    const avgScore = products.reduce((sum, p) => sum + parseFloat(p.overallScore), 0) / products.length
    
    return {
      score: avgScore.toFixed(1),
      level: avgScore >= 70 ? '健康' : avgScore >= 50 ? '良好' : '需改进',
      breakdown: {
        highPerformers: products.filter(p => parseFloat(p.overallScore) >= 70).length,
        average: products.filter(p => parseFloat(p.overallScore) >= 50 && parseFloat(p.overallScore) < 70).length,
        underperformers: products.filter(p => parseFloat(p.overallScore) < 50).length
      }
    }
  }

  _getPortfolioRecommendations(products) {
    const recommendations = []

    // 高风险产品
    const highRisk = products.filter(p => p.product.riskLevel > 70)
    if (highRisk.length > 0) {
      recommendations.push({
        type: 'warning',
        message: `${highRisk.length}个产品风险较高,建议重点关注`,
        products: highRisk.map(p => p.product.name)
      })
    }

    // 低表现产品
    const lowPerformers = products.filter(p => parseFloat(p.overallScore) < 50)
    if (lowPerformers.length > 0) {
      recommendations.push({
        type: 'info',
        message: `${lowPerformers.length}个产品表现不佳,建议优化或淘汰`,
        products: lowPerformers.map(p => p.product.name)
      })
    }

    return recommendations
  }
}

export default ProductLifecycleManager
