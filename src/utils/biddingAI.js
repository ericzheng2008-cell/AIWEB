/**
 * P2-7: 投标AI工程化系统
 * 功能: 多轮博弈预测、竞对建模、报价优化、风险评估
 */

// 1. 多轮投标博弈引擎
export class MultiBiddingEngine {
  constructor() {
    this.rounds = 3
    this.competitorCount = 5
  }

  /**
   * 多轮投标预测
   * @param {Object} project - 项目信息
   * @param {Array} historicalData - 历史数据
   * @param {Number} currentRound - 当前轮次 (1-3)
   * @returns {Object} 预测结果
   */
  predictMultiRound(project, historicalData, currentRound) {
    // 1. 竞对行为建模
    const competitorModels = this._modelCompetitors(historicalData)

    // 2. 各轮预测
    const roundPredictions = []
    for (let round = currentRound; round <= this.rounds; round++) {
      const prediction = this._predictRound(project, competitorModels, round, roundPredictions)
      roundPredictions.push(prediction)
    }

    // 3. 最优策略
    const optimalStrategy = this._calculateOptimalStrategy(roundPredictions, project)

    return {
      currentRound,
      roundPredictions,
      optimalStrategy,
      winProbability: this._calculateWinProbability(optimalStrategy, competitorModels),
      expectedProfit: this._calculateExpectedProfit(optimalStrategy, project)
    }
  }

  _modelCompetitors(historicalData) {
    // 使用贝叶斯更新建模竞对行为
    return historicalData.competitors.map(comp => ({
      name: comp.name,
      avgDiscount: this._calculateAvgDiscount(comp.history),
      priceVolatility: this._calculateVolatility(comp.history),
      aggressiveness: this._calculateAggressiveness(comp.history),
      winRate: comp.winRate || 0.2,
      strategy: this._identifyStrategy(comp.history)
    }))
  }

  _calculateAvgDiscount(history) {
    if (!history || history.length === 0) return 0.9
    return history.reduce((sum, h) => sum + (h.bid / h.basePrice), 0) / history.length
  }

  _calculateVolatility(history) {
    if (!history || history.length < 2) return 0.05
    const discounts = history.map(h => h.bid / h.basePrice)
    const mean = discounts.reduce((a, b) => a + b, 0) / discounts.length
    const variance = discounts.reduce((sum, d) => sum + Math.pow(d - mean, 2), 0) / discounts.length
    return Math.sqrt(variance)
  }

  _calculateAggressiveness(history) {
    if (!history || history.length === 0) return 0.5
    // 计算历史中报价降低的频率
    let aggressiveCount = 0
    for (let i = 1; i < history.length; i++) {
      if (history[i].bid < history[i - 1].bid * 0.95) aggressiveCount++
    }
    return aggressiveCount / Math.max(1, history.length - 1)
  }

  _identifyStrategy(history) {
    if (!history || history.length === 0) return 'conservative'
    
    const avgDiscount = this._calculateAvgDiscount(history)
    const volatility = this._calculateVolatility(history)

    if (avgDiscount < 0.85 && volatility > 0.1) return 'aggressive'
    if (avgDiscount > 0.95 && volatility < 0.05) return 'conservative'
    return 'moderate'
  }

  _predictRound(project, competitors, round, previousRounds) {
    const basePrice = project.basePrice
    let predictions = []

    competitors.forEach(comp => {
      // 序列预测模型
      let predictedBid = basePrice * comp.avgDiscount

      // 第2轮及以后,考虑前轮反馈
      if (round > 1 && previousRounds.length > 0) {
        const prevRound = previousRounds[previousRounds.length - 1]
        const lowestBid = Math.min(...prevRound.predictions.map(p => p.bid))
        
        // 激进竞对会降价
        if (comp.strategy === 'aggressive') {
          predictedBid = lowestBid * (0.95 - Math.random() * 0.05)
        } else if (comp.strategy === 'conservative') {
          predictedBid = lowestBid * (0.98 - Math.random() * 0.03)
        } else {
          predictedBid = lowestBid * (0.96 - Math.random() * 0.04)
        }
      }

      // 添加随机波动
      predictedBid *= (1 + (Math.random() - 0.5) * comp.priceVolatility)

      predictions.push({
        competitor: comp.name,
        bid: Math.round(predictedBid),
        confidence: this._calculatePredictionConfidence(comp, round),
        strategy: comp.strategy
      })
    })

    // 排序
    predictions.sort((a, b) => a.bid - b.bid)

    return {
      round,
      predictions,
      lowestBid: predictions[0].bid,
      avgBid: predictions.reduce((sum, p) => sum + p.bid, 0) / predictions.length,
      recommendedBid: this._calculateRecommendedBid(predictions, project, round)
    }
  }

  _calculatePredictionConfidence(competitor, round) {
    // 第1轮置信度较低,后续轮次提高
    let confidence = 0.6 + (round - 1) * 0.15
    
    // 根据历史数据量调整
    if (competitor.history && competitor.history.length > 10) {
      confidence += 0.1
    }

    return Math.min(0.95, confidence)
  }

  _calculateRecommendedBid(predictions, project, round) {
    const lowestBid = predictions[0].bid
    const secondLowest = predictions[1]?.bid || lowestBid * 1.05

    // 博弈策略: 比最低价高一点点,保证利润
    const minAcceptableProfit = project.basePrice * 0.1
    const recommendedBid = Math.max(
      lowestBid * 0.99,  // 比最低价略低
      project.basePrice - minAcceptableProfit  // 保证最低利润
    )

    return Math.round(recommendedBid)
  }

  _calculateOptimalStrategy(roundPredictions, project) {
    // 三轮策略
    return {
      round1: {
        bid: roundPredictions[0].recommendedBid,
        strategy: 'moderate',
        reasoning: '第1轮采用中等报价,观察竞对'
      },
      round2: {
        bid: roundPredictions[1]?.recommendedBid || 0,
        strategy: 'responsive',
        reasoning: '第2轮根据竞对报价调整'
      },
      round3: {
        bid: roundPredictions[2]?.recommendedBid || 0,
        strategy: 'decisive',
        reasoning: '第3轮决定性报价,争取中标'
      }
    }
  }

  _calculateWinProbability(strategy, competitors) {
    // 基于期望收益和竞对强度计算
    const avgCompetitorStrength = competitors.reduce((sum, c) => sum + c.winRate, 0) / competitors.length
    const baseProbability = 1 / (this.competitorCount + 1)
    
    // 根据策略调整
    const strategyBonus = 0.15  // 智能策略提升15%
    
    return Math.min(0.85, baseProbability * (1 + strategyBonus) / avgCompetitorStrength)
  }

  _calculateExpectedProfit(strategy, project) {
    const finalBid = strategy.round3.bid
    const profit = project.basePrice - finalBid
    const profitMargin = (profit / project.basePrice * 100).toFixed(1)

    return {
      amount: profit,
      margin: profitMargin + '%',
      roi: ((profit / finalBid) * 100).toFixed(1) + '%'
    }
  }
}

// 2. 竞对智能分析引擎
export class CompetitorAnalyzer {
  /**
   * 竞对SWOT分析
   */
  analyzeSWOT(competitor, project) {
    return {
      strengths: this._identifyStrengths(competitor),
      weaknesses: this._identifyWeaknesses(competitor),
      opportunities: this._identifyOpportunities(competitor, project),
      threats: this._identifyThreats(competitor, project)
    }
  }

  _identifyStrengths(comp) {
    const strengths = []
    if (comp.winRate > 0.3) strengths.push('历史中标率高')
    if (comp.avgDiscount < 0.9) strengths.push('价格竞争力强')
    if (comp.brandScore > 80) strengths.push('品牌知名度高')
    if (comp.techScore > 85) strengths.push('技术实力强')
    return strengths
  }

  _identifyWeaknesses(comp) {
    const weaknesses = []
    if (comp.winRate < 0.2) weaknesses.push('中标率偏低')
    if (comp.priceVolatility > 0.15) weaknesses.push('报价波动大')
    if (comp.serviceScore < 70) weaknesses.push('服务口碑一般')
    if (comp.deliveryScore < 75) weaknesses.push('交付能力不足')
    return weaknesses
  }

  _identifyOpportunities(comp, project) {
    const opportunities = []
    if (project.techComplexity < 5 && comp.techScore > 80) {
      opportunities.push('项目技术难度低,技术优势可能未充分发挥')
    }
    if (project.priceWeight > 0.6 && comp.avgDiscount > 0.92) {
      opportunities.push('价格权重高,但该竞对报价相对保守')
    }
    return opportunities
  }

  _identifyThreats(comp, project) {
    const threats = []
    if (comp.strategy === 'aggressive' && project.priceWeight > 0.5) {
      threats.push('激进竞对可能大幅降价')
    }
    if (comp.winRate > 0.35) {
      threats.push('强势竞对,压力较大')
    }
    return threats
  }

  /**
   * 竞对对比分析
   */
  compareCompetitors(competitors, project) {
    const comparison = competitors.map(comp => ({
      name: comp.name,
      overallScore: this._calculateOverallScore(comp, project),
      priceCompetitiveness: this._scorePriceCompetitiveness(comp),
      technicalCapability: comp.techScore || 70,
      brandStrength: comp.brandScore || 60,
      winProbability: this._estimateCompetitorWinProb(comp, competitors)
    }))

    comparison.sort((a, b) => b.overallScore - a.overallScore)

    return {
      comparison,
      primaryThreat: comparison[0],
      ourPosition: this._assessOurPosition(comparison),
      recommendations: this._generateCompetitorRecommendations(comparison)
    }
  }

  _calculateOverallScore(comp, project) {
    const weights = {
      price: project.priceWeight || 0.4,
      tech: project.techWeight || 0.3,
      brand: project.brandWeight || 0.2,
      service: project.serviceWeight || 0.1
    }

    return (
      this._scorePriceCompetitiveness(comp) * weights.price +
      (comp.techScore || 70) * weights.tech +
      (comp.brandScore || 60) * weights.brand +
      (comp.serviceScore || 65) * weights.service
    )
  }

  _scorePriceCompetitiveness(comp) {
    // 折扣越低,得分越高
    return (1 - comp.avgDiscount) * 100 + 50
  }

  _estimateCompetitorWinProb(comp, allCompetitors) {
    const totalStrength = allCompetitors.reduce((sum, c) => 
      sum + this._calculateOverallScore(c, {}), 0
    )
    const compStrength = this._calculateOverallScore(comp, {})
    return (compStrength / totalStrength * 100).toFixed(1)
  }

  _assessOurPosition(comparison) {
    // 假设我们是额外的参与者
    const avgScore = comparison.reduce((sum, c) => sum + c.overallScore, 0) / comparison.length

    if (avgScore < 70) return { level: 'strong', message: '竞对整体实力一般,我方优势明显' }
    if (avgScore < 80) return { level: 'competitive', message: '竞争激烈,需要精心准备' }
    return { level: 'challenging', message: '竞对实力强,需要差异化策略' }
  }

  _generateCompetitorRecommendations(comparison) {
    const recommendations = []

    if (comparison[0].priceCompetitiveness > 85) {
      recommendations.push({
        type: 'warning',
        message: `主要威胁 ${comparison[0].name} 价格竞争力强,建议强化技术/服务差异化`,
        priority: 'high'
      })
    }

    if (comparison.filter(c => c.technicalCapability > 85).length >= 3) {
      recommendations.push({
        type: 'info',
        message: '多个竞对技术实力强,建议突出我方独特技术优势',
        priority: 'medium'
      })
    }

    return recommendations
  }
}

// 3. 报价优化引擎
export class BidOptimizer {
  /**
   * 优化报价
   * @param {Object} project - 项目信息
   * @param {Array} competitors - 竞对信息
   * @param {Object} constraints - 约束条件
   * @returns {Object} 优化结果
   */
  optimizeBid(project, competitors, constraints = {}) {
    const basePrice = project.basePrice
    const minMargin = constraints.minMargin || 0.1
    const maxDiscount = constraints.maxDiscount || 0.2

    // 1. 成本底线
    const costFloor = basePrice * (1 - maxDiscount)

    // 2. 竞对预测
    const predictedLowest = this._predictLowestBid(competitors, basePrice)

    // 3. 多目标优化
    const objectives = {
      winProbability: this._objectiveWinProb,
      profitMargin: this._objectiveProfitMargin,
      riskMinimization: this._objectiveRiskMin
    }

    // 4. 帕累托最优解
    const paretoSolutions = this._findParetoOptimal(
      basePrice,
      costFloor,
      predictedLowest,
      objectives,
      constraints
    )

    // 5. 推荐方案
    const recommendedBid = this._selectRecommendedBid(paretoSolutions, constraints.riskTolerance || 'medium')

    return {
      recommendedBid,
      bidRange: {
        min: costFloor,
        max: predictedLowest * 0.98,
        optimal: recommendedBid
      },
      paretoSolutions,
      expectedOutcome: this._calculateExpectedOutcome(recommendedBid, basePrice, competitors)
    }
  }

  _predictLowestBid(competitors, basePrice) {
    if (!competitors || competitors.length === 0) return basePrice * 0.9

    const predictedBids = competitors.map(c => basePrice * (c.avgDiscount || 0.92))
    return Math.min(...predictedBids)
  }

  _objectiveWinProb(bid, lowestBid) {
    // 报价越低,中标概率越高
    if (bid <= lowestBid) return 0.85
    if (bid > lowestBid * 1.1) return 0.1
    return 0.85 - (bid - lowestBid) / lowestBid * 3
  }

  _objectiveProfitMargin(bid, basePrice) {
    return (basePrice - bid) / basePrice
  }

  _objectiveRiskMin(bid, costFloor) {
    // 距离成本底线越远,风险越低
    return Math.min(1, (bid - costFloor) / costFloor)
  }

  _findParetoOptimal(basePrice, costFloor, lowestBid, objectives, constraints) {
    const solutions = []
    const step = (lowestBid - costFloor) / 20

    for (let bid = costFloor; bid <= lowestBid * 1.05; bid += step) {
      const winProb = this._objectiveWinProb(bid, lowestBid)
      const profitMargin = this._objectiveProfitMargin(bid, basePrice)
      const riskScore = this._objectiveRiskMin(bid, costFloor)

      solutions.push({
        bid: Math.round(bid),
        winProbability: (winProb * 100).toFixed(1),
        profitMargin: (profitMargin * 100).toFixed(1),
        riskScore: (riskScore * 100).toFixed(0),
        comprehensiveScore: (winProb * 0.4 + profitMargin * 0.4 + riskScore * 0.2) * 100
      })
    }

    return solutions.sort((a, b) => b.comprehensiveScore - a.comprehensiveScore)
  }

  _selectRecommendedBid(solutions, riskTolerance) {
    if (riskTolerance === 'low') {
      // 保守策略: 高利润,低风险
      return solutions.filter(s => s.riskScore > 70).sort((a, b) => b.profitMargin - a.profitMargin)[0]
    } else if (riskTolerance === 'high') {
      // 激进策略: 高中标概率
      return solutions.sort((a, b) => b.winProbability - a.winProbability)[0]
    } else {
      // 平衡策略: 综合得分最高
      return solutions[0]
    }
  }

  _calculateExpectedOutcome(bid, basePrice, competitors) {
    const profit = basePrice - bid
    const winProb = this._objectiveWinProb(bid, this._predictLowestBid(competitors, basePrice))

    return {
      profit,
      profitMargin: ((profit / basePrice) * 100).toFixed(1) + '%',
      winProbability: (winProb * 100).toFixed(1) + '%',
      expectedValue: Math.round(profit * winProb)
    }
  }
}

// 4. 风险评估引擎
export class RiskAssessmentEngine {
  /**
   * 全面风险评估
   */
  assessRisk(project, bidPlan, competitors) {
    const risks = {
      priceRisk: this._assessPriceRisk(bidPlan, competitors),
      competitionRisk: this._assessCompetitionRisk(competitors),
      executionRisk: this._assessExecutionRisk(project),
      financialRisk: this._assessFinancialRisk(project, bidPlan)
    }

    const overallRisk = this._calculateOverallRisk(risks)

    return {
      risks,
      overallRisk,
      level: this._getRiskLevel(overallRisk),
      mitigation: this._generateMitigationPlan(risks)
    }
  }

  _assessPriceRisk(bidPlan, competitors) {
    const lowestCompetitorBid = Math.min(...competitors.map(c => c.predictedBid || 1000000))
    const gap = ((bidPlan.bid - lowestCompetitorBid) / lowestCompetitorBid * 100).toFixed(1)

    let score = 0
    if (gap < 0) score = 20  // 我方最低
    else if (gap < 5) score = 40
    else if (gap < 10) score = 60
    else score = 80

    return {
      score,
      description: `报价差距${gap}%`,
      factors: [
        { factor: '与最低价差距', impact: gap + '%' },
        { factor: '竞对数量', impact: competitors.length + '家' }
      ]
    }
  }

  _assessCompetitionRisk(competitors) {
    const strongCompetitors = competitors.filter(c => (c.winRate || 0) > 0.3).length
    const aggressiveCompetitors = competitors.filter(c => c.strategy === 'aggressive').length

    const score = Math.min(100, strongCompetitors * 15 + aggressiveCompetitors * 20)

    return {
      score,
      description: `${strongCompetitors}个强势竞对, ${aggressiveCompetitors}个激进竞对`,
      factors: [
        { factor: '强势竞对', impact: strongCompetitors },
        { factor: '激进竞对', impact: aggressiveCompetitors }
      ]
    }
  }

  _assessExecutionRisk(project) {
    const techComplexity = project.techComplexity || 5
    const timeConstraint = project.timeConstraint || 'normal'

    let score = techComplexity * 10
    if (timeConstraint === 'tight') score += 20
    if (project.customization > 0.5) score += 15

    return {
      score: Math.min(100, score),
      description: '技术复杂度' + techComplexity + '/10',
      factors: [
        { factor: '技术复杂度', impact: techComplexity + '/10' },
        { factor: '时间约束', impact: timeConstraint },
        { factor: '定制化程度', impact: ((project.customization || 0.3) * 100).toFixed(0) + '%' }
      ]
    }
  }

  _assessFinancialRisk(project, bidPlan) {
    const profitMargin = (project.basePrice - bidPlan.bid) / project.basePrice
    
    let score = 0
    if (profitMargin < 0.05) score = 80  // 低于5%高风险
    else if (profitMargin < 0.1) score = 50
    else if (profitMargin < 0.2) score = 30
    else score = 10

    return {
      score,
      description: `利润率${(profitMargin * 100).toFixed(1)}%`,
      factors: [
        { factor: '利润率', impact: (profitMargin * 100).toFixed(1) + '%' },
        { factor: '项目金额', impact: '¥' + project.basePrice.toLocaleString() }
      ]
    }
  }

  _calculateOverallRisk(risks) {
    const weights = {
      priceRisk: 0.3,
      competitionRisk: 0.3,
      executionRisk: 0.25,
      financialRisk: 0.15
    }

    return Object.entries(risks).reduce((sum, [key, risk]) => {
      return sum + risk.score * weights[key]
    }, 0)
  }

  _getRiskLevel(score) {
    if (score < 30) return { level: '低', color: 'success' }
    if (score < 60) return { level: '中', color: 'warning' }
    return { level: '高', color: 'danger' }
  }

  _generateMitigationPlan(risks) {
    const plan = []

    if (risks.priceRisk.score > 60) {
      plan.push({
        risk: '价格风险',
        action: '考虑适度降低报价或强化技术/服务差异化',
        priority: 'high'
      })
    }

    if (risks.competitionRisk.score > 50) {
      plan.push({
        risk: '竞争风险',
        action: '重点关注强势竞对,准备针对性策略',
        priority: 'high'
      })
    }

    if (risks.executionRisk.score > 60) {
      plan.push({
        risk: '执行风险',
        action: '增加技术评审,确保交付能力匹配',
        priority: 'medium'
      })
    }

    if (risks.financialRisk.score > 50) {
      plan.push({
        risk: '财务风险',
        action: '重新评估成本,考虑提高报价',
        priority: 'high'
      })
    }

    return plan
  }
}

// 5. 综合投标AI管理器
export class BiddingAIManager {
  constructor() {
    this.multiBiddingEngine = new MultiBiddingEngine()
    this.competitorAnalyzer = new CompetitorAnalyzer()
    this.bidOptimizer = new BidOptimizer()
    this.riskAssessment = new RiskAssessmentEngine()
  }

  /**
   * 全面投标分析
   */
  analyzeBid(project, historicalData, constraints = {}) {
    // 1. 多轮预测
    const multiRoundPrediction = this.multiBiddingEngine.predictMultiRound(
      project,
      historicalData,
      1  // 从第1轮开始
    )

    // 2. 竞对分析
    const competitorAnalysis = this.competitorAnalyzer.compareCompetitors(
      historicalData.competitors,
      project
    )

    // 3. 报价优化
    const bidOptimization = this.bidOptimizer.optimizeBid(
      project,
      historicalData.competitors,
      constraints
    )

    // 4. 风险评估
    const riskAssessment = this.riskAssessment.assessRisk(
      project,
      { bid: bidOptimization.recommendedBid.bid },
      historicalData.competitors
    )

    return {
      multiRoundPrediction,
      competitorAnalysis,
      bidOptimization,
      riskAssessment,
      finalRecommendation: this._generateFinalRecommendation(
        multiRoundPrediction,
        bidOptimization,
        riskAssessment
      )
    }
  }

  _generateFinalRecommendation(multiRound, optimization, risk) {
    const shouldBid = risk.overallRisk < 70 && multiRound.winProbability > 0.2

    return {
      shouldBid,
      confidence: shouldBid ? 'high' : 'low',
      recommendedAction: shouldBid ? 
        `建议参与投标,第1轮报价¥${multiRound.optimalStrategy.round1.bid.toLocaleString()}` :
        '风险较高或中标概率低,建议谨慎参与',
      keyPoints: [
        `预计中标概率: ${(multiRound.winProbability * 100).toFixed(1)}%`,
        `预期利润: ¥${multiRound.expectedProfit.amount.toLocaleString()} (${multiRound.expectedProfit.margin})`,
        `风险等级: ${risk.level.level}`,
        `主要威胁: ${risk.risks.competitionRisk.description}`
      ]
    }
  }
}

export default BiddingAIManager
