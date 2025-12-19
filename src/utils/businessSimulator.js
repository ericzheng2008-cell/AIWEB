/**
 * P2-5: 业务运营模拟器升级
 * 基于沙盘分析的蒙特卡洛模拟、多策略组合优化、敏感性分析
 */

/**
 * 1. 蒙特卡洛模拟引擎
 */
export class MonteCarloSimulator {
  constructor() {
    this.simulationCount = 10000 // 默认模拟次数
    this.confidenceLevel = 0.95 // 95%置信度
  }

  /**
   * 运行蒙特卡洛模拟
   */
  runSimulation(strategy, customerSegments, iterations = this.simulationCount) {
    const results = []
    
    for (let i = 0; i < iterations; i++) {
      const scenarioResult = this._simulateSingleScenario(strategy, customerSegments)
      results.push(scenarioResult)
    }
    
    return this._analyzeResults(results)
  }

  _simulateSingleScenario(strategy, segments) {
    let totalRevenue = 0
    let totalCost = 0
    let customersAcquired = 0
    let customersRetained = 0
    let customersLost = 0
    
    segments.forEach(segment => {
      // 随机化客户行为
      const conversionRate = this._randomizeWithNoise(
        segment.baseConversionRate * this._getStrategyImpact(strategy, 'conversion'),
        0.15 // 15%标准差
      )
      
      const retentionRate = this._randomizeWithNoise(
        segment.baseRetentionRate * this._getStrategyImpact(strategy, 'retention'),
        0.12
      )
      
      const avgOrderValue = this._randomizeWithNoise(
        segment.avgOrderValue * this._getStrategyImpact(strategy, 'orderValue'),
        0.20
      )
      
      // 模拟客户数量
      const potentialCustomers = Math.floor(segment.size * (1 + this._randomNormal(0, 0.1)))
      const newCustomers = Math.floor(potentialCustomers * conversionRate)
      const existingCustomers = segment.existingCustomers || 0
      const retained = Math.floor(existingCustomers * retentionRate)
      const churned = existingCustomers - retained
      
      // 计算收入
      const newRevenue = newCustomers * avgOrderValue
      const retainedRevenue = retained * avgOrderValue * 1.2 // 老客户购买更多
      
      // 计算成本
      const acquisitionCost = newCustomers * (strategy.acquisitionCostPerCustomer || 500)
      const retentionCost = retained * (strategy.retentionCostPerCustomer || 100)
      const operationCost = (newCustomers + retained) * (strategy.operationCostPerCustomer || 50)
      
      totalRevenue += newRevenue + retainedRevenue
      totalCost += acquisitionCost + retentionCost + operationCost
      customersAcquired += newCustomers
      customersRetained += retained
      customersLost += churned
    })
    
    return {
      revenue: totalRevenue,
      cost: totalCost,
      profit: totalRevenue - totalCost,
      roi: totalCost > 0 ? (totalRevenue - totalCost) / totalCost : 0,
      customersAcquired,
      customersRetained,
      customersLost,
      netCustomerGrowth: customersAcquired - customersLost
    }
  }

  _getStrategyImpact(strategy, metric) {
    const impacts = {
      conversion: 1 + (strategy.priceDiscount || 0) * 0.5 + (strategy.serviceLevel || 0) * 0.3,
      retention: 1 + (strategy.serviceLevel || 0) * 0.6 + (strategy.loyaltyProgram || 0) * 0.4,
      orderValue: 1 - (strategy.priceDiscount || 0) * 0.8 + (strategy.productQuality || 0) * 0.5
    }
    return impacts[metric] || 1
  }

  _randomizeWithNoise(value, stdDevRatio) {
    const stdDev = value * stdDevRatio
    return Math.max(0, value + this._randomNormal(0, stdDev))
  }

  _randomNormal(mean, stdDev) {
    // Box-Muller变换生成正态分布随机数
    const u1 = Math.random()
    const u2 = Math.random()
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
    return mean + z0 * stdDev
  }

  _analyzeResults(results) {
    // 计算统计指标
    const revenues = results.map(r => r.revenue).sort((a, b) => a - b)
    const profits = results.map(r => r.profit).sort((a, b) => a - b)
    const rois = results.map(r => r.roi).sort((a, b) => a - b)
    
    const getPercentile = (arr, p) => {
      const index = Math.floor(arr.length * p)
      return arr[index]
    }
    
    const getMean = (arr) => arr.reduce((sum, val) => sum + val, 0) / arr.length
    const getStdDev = (arr) => {
      const mean = getMean(arr)
      const variance = arr.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / arr.length
      return Math.sqrt(variance)
    }
    
    return {
      revenue: {
        mean: getMean(revenues),
        median: getPercentile(revenues, 0.5),
        p5: getPercentile(revenues, 0.05),
        p95: getPercentile(revenues, 0.95),
        stdDev: getStdDev(revenues)
      },
      profit: {
        mean: getMean(profits),
        median: getPercentile(profits, 0.5),
        p5: getPercentile(profits, 0.05),
        p95: getPercentile(profits, 0.95),
        stdDev: getStdDev(profits),
        positiveProb: profits.filter(p => p > 0).length / profits.length
      },
      roi: {
        mean: getMean(rois),
        median: getPercentile(rois, 0.5),
        p5: getPercentile(rois, 0.05),
        p95: getPercentile(rois, 0.95),
        stdDev: getStdDev(rois)
      },
      customerMetrics: {
        avgAcquired: getMean(results.map(r => r.customersAcquired)),
        avgRetained: getMean(results.map(r => r.customersRetained)),
        avgLost: getMean(results.map(r => r.customersLost)),
        avgNetGrowth: getMean(results.map(r => r.netCustomerGrowth))
      },
      rawResults: results // 保留原始数据用于可视化
    }
  }
}

/**
 * 2. 多策略组合优化器
 */
export class StrategyOptimizer {
  constructor() {
    this.simulator = new MonteCarloSimulator()
    this.strategies = this._defineStrategies()
  }

  _defineStrategies() {
    return {
      aggressive: {
        name: '激进策略',
        priceDiscount: 0.3, // 30%折扣
        serviceLevel: 0.8,
        marketingBudget: 'high',
        acquisitionCostPerCustomer: 800,
        retentionCostPerCustomer: 150,
        operationCostPerCustomer: 60
      },
      balanced: {
        name: '平衡策略',
        priceDiscount: 0.15,
        serviceLevel: 0.9,
        marketingBudget: 'medium',
        acquisitionCostPerCustomer: 500,
        retentionCostPerCustomer: 100,
        operationCostPerCustomer: 50
      },
      conservative: {
        name: '保守策略',
        priceDiscount: 0.05,
        serviceLevel: 1.0,
        marketingBudget: 'low',
        acquisitionCostPerCustomer: 300,
        retentionCostPerCustomer: 80,
        operationCostPerCustomer: 40
      },
      premium: {
        name: '高端策略',
        priceDiscount: 0,
        serviceLevel: 1.2,
        productQuality: 1.3,
        marketingBudget: 'medium',
        acquisitionCostPerCustomer: 600,
        retentionCostPerCustomer: 200,
        operationCostPerCustomer: 80
      },
      retention_focused: {
        name: '留存优先',
        priceDiscount: 0.1,
        serviceLevel: 1.1,
        loyaltyProgram: 0.8,
        marketingBudget: 'low',
        acquisitionCostPerCustomer: 400,
        retentionCostPerCustomer: 250,
        operationCostPerCustomer: 55
      }
    }
  }

  /**
   * 评估所有策略
   */
  evaluateAllStrategies(customerSegments, iterations = 5000) {
    const results = {}
    
    Object.entries(this.strategies).forEach(([key, strategy]) => {
      console.log(`模拟策略: ${strategy.name}...`)
      results[key] = {
        strategy,
        simulation: this.simulator.runSimulation(strategy, customerSegments, iterations)
      }
    })
    
    return this._rankStrategies(results)
  }

  /**
   * 组合策略优化
   */
  optimizeCombinedStrategy(customerSegments, objectives) {
    // 使用遗传算法寻找最优策略组合
    const population = this._initializePopulation(50)
    const generations = 30
    
    for (let gen = 0; gen < generations; gen++) {
      // 评估适应度
      const fitness = population.map(individual => 
        this._evaluateFitness(individual, customerSegments, objectives)
      )
      
      // 选择
      const selected = this._selection(population, fitness)
      
      // 交叉
      const offspring = this._crossover(selected)
      
      // 变异
      const mutated = this._mutation(offspring)
      
      population.splice(0, population.length, ...mutated)
    }
    
    // 返回最优个体
    const finalFitness = population.map(ind => 
      this._evaluateFitness(ind, customerSegments, objectives)
    )
    const bestIndex = finalFitness.indexOf(Math.max(...finalFitness))
    
    return {
      optimalStrategy: population[bestIndex],
      simulation: this.simulator.runSimulation(population[bestIndex], customerSegments),
      fitness: finalFitness[bestIndex]
    }
  }

  _initializePopulation(size) {
    const population = []
    for (let i = 0; i < size; i++) {
      population.push({
        priceDiscount: Math.random() * 0.4, // 0-40%
        serviceLevel: 0.5 + Math.random() * 0.7, // 0.5-1.2
        productQuality: 0.8 + Math.random() * 0.6, // 0.8-1.4
        loyaltyProgram: Math.random(),
        acquisitionCostPerCustomer: 200 + Math.random() * 800,
        retentionCostPerCustomer: 50 + Math.random() * 300,
        operationCostPerCustomer: 30 + Math.random() * 100
      })
    }
    return population
  }

  _evaluateFitness(individual, segments, objectives) {
    const result = this.simulator.runSimulation(individual, segments, 1000)
    
    // 多目标适应度函数
    let fitness = 0
    
    if (objectives.maximizeProfit) {
      fitness += result.profit.mean / 1000000 // 归一化
    }
    if (objectives.maximizeROI) {
      fitness += result.roi.mean * 10
    }
    if (objectives.minimizeRisk) {
      fitness -= result.profit.stdDev / 1000000
    }
    if (objectives.maximizeCustomerGrowth) {
      fitness += result.customerMetrics.avgNetGrowth / 100
    }
    
    return fitness
  }

  _selection(population, fitness) {
    // 锦标赛选择
    const selected = []
    const tournamentSize = 5
    
    while (selected.length < population.length) {
      const tournament = []
      for (let i = 0; i < tournamentSize; i++) {
        const idx = Math.floor(Math.random() * population.length)
        tournament.push({ individual: population[idx], fitness: fitness[idx] })
      }
      tournament.sort((a, b) => b.fitness - a.fitness)
      selected.push(tournament[0].individual)
    }
    
    return selected
  }

  _crossover(selected) {
    const offspring = []
    
    for (let i = 0; i < selected.length; i += 2) {
      const parent1 = selected[i]
      const parent2 = selected[i + 1] || selected[0]
      
      const child = {}
      Object.keys(parent1).forEach(key => {
        child[key] = Math.random() < 0.5 ? parent1[key] : parent2[key]
      })
      
      offspring.push(child)
    }
    
    return offspring
  }

  _mutation(offspring, mutationRate = 0.1) {
    return offspring.map(individual => {
      if (Math.random() < mutationRate) {
        const keys = Object.keys(individual)
        const keyToMutate = keys[Math.floor(Math.random() * keys.length)]
        const mutation = (Math.random() - 0.5) * 0.2 // ±10%变异
        individual[keyToMutate] = Math.max(0, individual[keyToMutate] * (1 + mutation))
      }
      return individual
    })
  }

  _rankStrategies(results) {
    const rankings = Object.entries(results).map(([key, data]) => ({
      strategyName: data.strategy.name,
      strategyKey: key,
      expectedProfit: data.simulation.profit.mean,
      profitStdDev: data.simulation.profit.stdDev,
      expectedROI: data.simulation.roi.mean,
      positiveProb: data.simulation.profit.positiveProb,
      customerGrowth: data.simulation.customerMetrics.avgNetGrowth,
      riskAdjustedReturn: data.simulation.profit.mean / data.simulation.profit.stdDev,
      data
    }))
    
    // 按风险调整收益排序
    rankings.sort((a, b) => b.riskAdjustedReturn - a.riskAdjustedReturn)
    
    return {
      rankings,
      bestStrategy: rankings[0],
      allResults: results
    }
  }
}

/**
 * 3. 敏感性分析引擎
 */
export class SensitivityAnalyzer {
  constructor() {
    this.simulator = new MonteCarloSimulator()
  }

  /**
   * 单因素敏感性分析
   */
  analyzeSingleFactor(baseStrategy, customerSegments, factor, range) {
    const results = []
    
    for (let value = range.min; value <= range.max; value += range.step) {
      const strategy = { ...baseStrategy, [factor]: value }
      const simulation = this.simulator.runSimulation(strategy, customerSegments, 2000)
      
      results.push({
        factorValue: value,
        profit: simulation.profit.mean,
        revenue: simulation.revenue.mean,
        roi: simulation.roi.mean,
        customerGrowth: simulation.customerMetrics.avgNetGrowth
      })
    }
    
    return {
      factor,
      results,
      sensitivity: this._calculateSensitivity(results, 'profit')
    }
  }

  /**
   * 多因素敏感性分析
   */
  analyzeMultipleFactors(baseStrategy, customerSegments, factors) {
    const analyses = {}
    
    factors.forEach(({ name, range }) => {
      analyses[name] = this.analyzeSingleFactor(baseStrategy, customerSegments, name, range)
    })
    
    // 排序因素重要性
    const importanceRanking = Object.entries(analyses)
      .map(([name, analysis]) => ({
        factor: name,
        sensitivity: analysis.sensitivity,
        impact: Math.abs(analysis.sensitivity)
      }))
      .sort((a, b) => b.impact - a.impact)
    
    return {
      analyses,
      importanceRanking,
      mostSensitiveFactor: importanceRanking[0],
      leastSensitiveFactor: importanceRanking[importanceRanking.length - 1]
    }
  }

  /**
   * 交互效应分析
   */
  analyzeInteractionEffects(baseStrategy, customerSegments, factor1, factor2, ranges) {
    const heatmap = []
    
    for (let v1 = ranges.factor1.min; v1 <= ranges.factor1.max; v1 += ranges.factor1.step) {
      const row = []
      for (let v2 = ranges.factor2.min; v2 <= ranges.factor2.max; v2 += ranges.factor2.step) {
        const strategy = {
          ...baseStrategy,
          [factor1]: v1,
          [factor2]: v2
        }
        const simulation = this.simulator.runSimulation(strategy, customerSegments, 1000)
        row.push({
          factor1Value: v1,
          factor2Value: v2,
          profit: simulation.profit.mean,
          roi: simulation.roi.mean
        })
      }
      heatmap.push(row)
    }
    
    return {
      factor1,
      factor2,
      heatmap,
      interactionStrength: this._calculateInteractionStrength(heatmap)
    }
  }

  _calculateSensitivity(results, metric) {
    if (results.length < 2) return 0
    
    const firstValue = results[0][metric]
    const lastValue = results[results.length - 1][metric]
    const firstFactor = results[0].factorValue
    const lastFactor = results[results.length - 1].factorValue
    
    // 计算弹性系数
    const percentChange = ((lastValue - firstValue) / firstValue) * 100
    const factorChange = ((lastFactor - firstFactor) / firstFactor) * 100
    
    return factorChange !== 0 ? percentChange / factorChange : 0
  }

  _calculateInteractionStrength(heatmap) {
    // 简化的交互强度计算
    let variance = 0
    const allValues = heatmap.flat().map(cell => cell.profit)
    const mean = allValues.reduce((sum, val) => sum + val, 0) / allValues.length
    
    allValues.forEach(val => {
      variance += Math.pow(val - mean, 2)
    })
    
    return Math.sqrt(variance / allValues.length) / mean
  }
}

/**
 * 4. 场景规划引擎
 */
export class ScenarioPlanner {
  constructor() {
    this.simulator = new MonteCarloSimulator()
    this.scenarios = this._defineScenarios()
  }

  _defineScenarios() {
    return {
      best_case: {
        name: '最佳情况',
        marketGrowth: 1.3,
        competitorPressure: 0.8,
        economicCondition: 'boom',
        customerSentiment: 1.2
      },
      base_case: {
        name: '基准情况',
        marketGrowth: 1.0,
        competitorPressure: 1.0,
        economicCondition: 'stable',
        customerSentiment: 1.0
      },
      worst_case: {
        name: '最坏情况',
        marketGrowth: 0.7,
        competitorPressure: 1.3,
        economicCondition: 'recession',
        customerSentiment: 0.8
      },
      recession: {
        name: '经济衰退',
        marketGrowth: 0.6,
        competitorPressure: 1.5,
        economicCondition: 'recession',
        customerSentiment: 0.7
      },
      high_competition: {
        name: '激烈竞争',
        marketGrowth: 1.1,
        competitorPressure: 1.8,
        economicCondition: 'stable',
        customerSentiment: 0.9
      }
    }
  }

  /**
   * 场景规划分析
   */
  planScenarios(strategy, customerSegments) {
    const results = {}
    
    Object.entries(this.scenarios).forEach(([key, scenario]) => {
      const adjustedSegments = this._adjustSegmentsForScenario(customerSegments, scenario)
      const adjustedStrategy = this._adjustStrategyForScenario(strategy, scenario)
      
      results[key] = {
        scenario,
        simulation: this.simulator.runSimulation(adjustedStrategy, adjustedSegments, 3000),
        probability: this._estimateScenarioProbability(key)
      }
    })
    
    return this._calculateExpectedValue(results)
  }

  _adjustSegmentsForScenario(segments, scenario) {
    return segments.map(seg => ({
      ...seg,
      size: seg.size * scenario.marketGrowth,
      baseConversionRate: seg.baseConversionRate * scenario.customerSentiment,
      baseRetentionRate: seg.baseRetentionRate * (2 - scenario.competitorPressure) / 2
    }))
  }

  _adjustStrategyForScenario(strategy, scenario) {
    return {
      ...strategy,
      acquisitionCostPerCustomer: strategy.acquisitionCostPerCustomer * scenario.competitorPressure,
      retentionCostPerCustomer: strategy.retentionCostPerCustomer * scenario.competitorPressure
    }
  }

  _estimateScenarioProbability(scenarioKey) {
    const probabilities = {
      best_case: 0.15,
      base_case: 0.50,
      worst_case: 0.10,
      recession: 0.15,
      high_competition: 0.10
    }
    return probabilities[scenarioKey] || 0.2
  }

  _calculateExpectedValue(results) {
    let expectedProfit = 0
    let expectedRevenue = 0
    let expectedROI = 0
    
    Object.values(results).forEach(result => {
      expectedProfit += result.simulation.profit.mean * result.probability
      expectedRevenue += result.simulation.revenue.mean * result.probability
      expectedROI += result.simulation.roi.mean * result.probability
    })
    
    return {
      scenarios: results,
      expectedValue: {
        profit: expectedProfit,
        revenue: expectedRevenue,
        roi: expectedROI
      },
      worstCase: results.worst_case,
      bestCase: results.best_case,
      baseCase: results.base_case
    }
  }
}

/**
 * 5. 业务模拟器管理器
 */
export class BusinessSimulatorManager {
  constructor() {
    this.monteCarloSimulator = new MonteCarloSimulator()
    this.strategyOptimizer = new StrategyOptimizer()
    this.sensitivityAnalyzer = new SensitivityAnalyzer()
    this.scenarioPlanner = new ScenarioPlanner()
  }

  /**
   * 综合业务模拟
   */
  async runComprehensiveSimulation(config) {
    console.log('开始综合业务模拟...')
    
    const results = {
      timestamp: new Date(),
      config
    }
    
    // 1. 策略评估
    if (config.evaluateStrategies) {
      console.log('评估预定义策略...')
      results.strategyEvaluation = this.strategyOptimizer.evaluateAllStrategies(
        config.customerSegments,
        config.iterations || 5000
      )
    }
    
    // 2. 策略优化
    if (config.optimizeStrategy) {
      console.log('优化策略组合...')
      results.optimizedStrategy = this.strategyOptimizer.optimizeCombinedStrategy(
        config.customerSegments,
        config.objectives || { maximizeProfit: true, minimizeRisk: true }
      )
    }
    
    // 3. 敏感性分析
    if (config.sensitivityAnalysis) {
      console.log('执行敏感性分析...')
      results.sensitivity = this.sensitivityAnalyzer.analyzeMultipleFactors(
        config.baseStrategy || this.strategyOptimizer.strategies.balanced,
        config.customerSegments,
        config.sensitivityFactors || [
          { name: 'priceDiscount', range: { min: 0, max: 0.4, step: 0.05 } },
          { name: 'serviceLevel', range: { min: 0.5, max: 1.5, step: 0.1 } }
        ]
      )
    }
    
    // 4. 场景规划
    if (config.scenarioPlanning) {
      console.log('执行场景规划...')
      results.scenarios = this.scenarioPlanner.planScenarios(
        config.baseStrategy || this.strategyOptimizer.strategies.balanced,
        config.customerSegments
      )
    }
    
    // 5. 生成综合建议
    results.recommendations = this._generateRecommendations(results)
    
    console.log('综合业务模拟完成!')
    return results
  }

  _generateRecommendations(results) {
    const recommendations = []
    
    if (results.strategyEvaluation) {
      const best = results.strategyEvaluation.bestStrategy
      recommendations.push({
        type: 'strategy',
        priority: 'high',
        title: `推荐策略: ${best.strategyName}`,
        content: `预期利润: ¥${Math.round(best.expectedProfit).toLocaleString()}, ROI: ${(best.expectedROI * 100).toFixed(1)}%`,
        reason: `该策略具有最高的风险调整收益 (${best.riskAdjustedReturn.toFixed(2)})`
      })
    }
    
    if (results.sensitivity) {
      const mostSensitive = results.sensitivity.mostSensitiveFactor
      recommendations.push({
        type: 'sensitivity',
        priority: 'medium',
        title: `关注关键因素: ${mostSensitive.factor}`,
        content: `该因素敏感度最高 (${mostSensitive.sensitivity.toFixed(2)})`,
        reason: '优先优化该因素可获得最大收益提升'
      })
    }
    
    if (results.scenarios) {
      const worstProfit = results.scenarios.worstCase.simulation.profit.mean
      if (worstProfit < 0) {
        recommendations.push({
          type: 'risk',
          priority: 'urgent',
          title: '最坏情况下利润为负',
          content: `最坏情况预期亏损: ¥${Math.abs(Math.round(worstProfit)).toLocaleString()}`,
          reason: '建议增加风险缓冲或调整策略'
        })
      }
    }
    
    return recommendations
  }
}
