import { defineStore } from 'pinia'
import { useEquipmentLifecycleStore } from './equipmentLifecycle'

export const useAIIntelligenceStore = defineStore('aiIntelligence', {
  state: () => ({
    // AI预测模型配置
    predictionConfig: {
      algorithms: ['regression', 'ml'],
      confidence: 0.85,
      updateFrequency: 'daily'
    },
    
    // 预测结果缓存
    predictions: [],
    
    // AI学习数据
    trainingData: {
      historicalRepairCount: 0,
      sensorDataPoints: 0,
      predictionAccuracy: 0.75  // 初始准确率75%
    }
  }),
  
  getters: {
    // 获取高风险预测
    getHighRiskPredictions: (state) => {
      return state.predictions.filter(p => p.riskLevel === 'high')
    },
    
    // 获取AI推荐建议
    getAIRecommendations: (state) => {
      return state.predictions
        .filter(p => p.recommendation)
        .sort((a, b) => b.priority - a.priority)
    }
  },
  
  actions: {
    // 【升级10】AI健康度预测
    predictEquipmentHealth(equipmentId) {
      const equipmentStore = useEquipmentLifecycleStore()
      const equipment = equipmentStore.equipmentAssets.find(eq => eq.id === equipmentId)
      
      if (!equipment) return null
      
      // 收集多维度数据
      const healthData = this.collectHealthData(equipment)
      
      // AI评分算法
      const healthScore = this.calculateHealthScore(healthData)
      
      // 生成预测
      const predictions = this.generatePredictions(healthScore, healthData, equipment)
      
      return {
        equipmentId,
        equipmentName: equipment.name,
        overallHealth: healthScore.score,
        status: healthScore.status,
        breakdown: healthScore.breakdown,
        predictions,
        confidence: this.predictionConfig.confidence,
        generatedAt: new Date().toISOString()
      }
    },
    
    // 收集健康数据
    collectHealthData(equipment) {
      const now = new Date()
      const purchaseDate = new Date(equipment.purchaseDate)
      const ageMonths = Math.floor((now - purchaseDate) / (1000 * 60 * 60 * 24 * 30))
      
      return {
        // 维度1: 运行数据
        operational: {
          workingHours: equipment.workingHours || 0,
          utilizationRate: equipment.utilizationRate || 0,
          ageMonths
        },
        
        // 维度2: 维修历史
        maintenance: {
          faultCount: equipment.maintenanceRecords?.filter(r => r.type === 'repair').length || 0,
          maintenanceCount: equipment.maintenanceRecords?.length || 0,
          avgRepairTime: this.calculateAvgRepairTime(equipment),
          totalMaintenanceCost: equipment.costRecords?.reduce((sum, c) => sum + c.amount, 0) || 0
        },
        
        // 维度3: 部件状态
        components: {
          avgCondition: equipment.components?.reduce((sum, c) => sum + c.condition, 0) / (equipment.components?.length || 1) || 0,
          criticalComponentsHealth: this.assessCriticalComponents(equipment)
        },
        
        // 维度4: 环境因素
        environmental: {
          location: equipment.location,
          workingCondition: 'normal'  // 可扩展
        }
      }
    },
    
    // 计算健康评分
    calculateHealthScore(healthData) {
      // 权重配置
      const weights = {
        operational: 0.30,
        maintenance: 0.35,
        components: 0.25,
        environmental: 0.10
      }
      
      // 分项评分（0-100）
      const scores = {
        operational: this.scoreOperational(healthData.operational),
        maintenance: this.scoreMaintenance(healthData.maintenance),
        components: healthData.components.avgCondition,
        environmental: 85  // 默认良好
      }
      
      // 综合评分
      const totalScore = 
        scores.operational * weights.operational +
        scores.maintenance * weights.maintenance +
        scores.components * weights.components +
        scores.environmental * weights.environmental
      
      // 确定状态
      let status = 'good'
      if (totalScore >= 90) status = 'excellent'
      else if (totalScore >= 75) status = 'good'
      else if (totalScore >= 60) status = 'fair'
      else if (totalScore >= 40) status = 'poor'
      else status = 'critical'
      
      return {
        score: Math.round(totalScore),
        status,
        breakdown: scores
      }
    },
    
    // 运行数据评分
    scoreOperational(data) {
      let score = 100
      
      // 年龄扣分（超过5年开始衰减）
      if (data.ageMonths > 60) {
        score -= (data.ageMonths - 60) * 0.5
      }
      
      // 使用率评分（60-90%最优）
      if (data.utilizationRate < 60 || data.utilizationRate > 90) {
        score -= 10
      }
      
      return Math.max(0, Math.min(100, score))
    },
    
    // 维修历史评分
    scoreMaintenance(data) {
      let score = 100
      
      // 故障频率扣分
      if (data.faultCount > 5) {
        score -= (data.faultCount - 5) * 5
      }
      
      // 维修成本占比扣分
      // 这里简化处理，实际应根据设备价值计算比例
      if (data.totalMaintenanceCost > 50000) {
        score -= 15
      }
      
      return Math.max(0, Math.min(100, score))
    },
    
    // 评估关键部件
    assessCriticalComponents(equipment) {
      if (!equipment.components || equipment.components.length === 0) {
        return 85  // 默认良好
      }
      
      const criticalComponents = equipment.components
        .filter(c => c.condition < 70)
      
      return criticalComponents.length === 0 ? 95 : 60
    },
    
    // 计算平均维修时长
    calculateAvgRepairTime(equipment) {
      const repairs = equipment.maintenanceRecords?.filter(r => r.type === 'repair') || []
      if (repairs.length === 0) return 0
      
      const totalTime = repairs.reduce((sum, r) => sum + (r.duration || 0), 0)
      return totalTime / repairs.length
    },
    
    // 生成预测建议
    generatePredictions(healthScore, healthData, equipment) {
      const predictions = []
      
      // 预测1: 故障风险
      if (healthScore.score < 70) {
        const daysToFailure = this.predictFailureDate(healthData)
        predictions.push({
          type: 'failure_risk',
          severity: healthScore.score < 50 ? 'high' : 'medium',
          timeframe: `${daysToFailure}天`,
          confidence: 0.85,
          recommendation: healthScore.score < 50 ? '建议立即安排维护' : '建议近期安排维护',
          estimatedCost: this.estimateMaintenanceCost(equipment),
          preventiveSavings: this.calculatePreventiveSavings(equipment),
          priority: healthScore.score < 50 ? 10 : 7
        })
      }
      
      // 预测2: 部件更换
      if (healthData.components.avgCondition < 75) {
        predictions.push({
          type: 'component_replacement',
          severity: 'medium',
          timeframe: '未来3个月',
          confidence: 0.80,
          recommendation: '建议更换老化部件，避免突发故障',
          estimatedCost: equipment.purchasePrice * 0.15,
          priority: 6
        })
      }
      
      // 预测3: 性能优化
      if (healthData.maintenance.faultCount > 3) {
        predictions.push({
          type: 'performance_optimization',
          severity: 'low',
          timeframe: '适时安排',
          confidence: 0.75,
          recommendation: '建议进行全面检修，提升可靠性',
          estimatedCost: equipment.purchasePrice * 0.08,
          priority: 4
        })
      }
      
      // 预测4: 年包推荐
      if (healthData.maintenance.totalMaintenanceCost > equipment.purchasePrice * 0.3) {
        predictions.push({
          type: 'annual_package_recommendation',
          severity: 'info',
          timeframe: '立即考虑',
          confidence: 0.90,
          recommendation: '维护成本已达设备价值30%，建议采用年包服务锁定成本',
          estimatedSavings: healthData.maintenance.totalMaintenanceCost * 0.25,
          priority: 8
        })
      }
      
      // 存储到状态
      this.predictions.push({
        equipmentId: equipment.id,
        predictions,
        timestamp: new Date().toISOString()
      })
      
      return predictions.sort((a, b) => b.priority - a.priority)
    },
    
    // 预测故障时间
    predictFailureDate(healthData) {
      // 简化算法：基于故障频率和部件状况
      const baselineDays = 180
      const faultFactor = Math.max(0.3, 1 - healthData.maintenance.faultCount / 10)
      const conditionFactor = healthData.components.avgCondition / 100
      
      return Math.round(baselineDays * faultFactor * conditionFactor)
    },
    
    // 估算维护成本
    estimateMaintenanceCost(equipment) {
      return equipment.purchasePrice * 0.10  // 约设备价值的10%
    },
    
    // 计算预防性维护节省
    calculatePreventiveSavings(equipment) {
      // 预防性维护成本 vs 故障后维修成本
      const preventiveCost = equipment.purchasePrice * 0.10
      const reactiveCost = equipment.purchasePrice * 0.25
      return reactiveCost - preventiveCost
    },
    
    // 【升级11】智能备件库存优化
    optimizeSparePartsInventory(customerData) {
      const { equipmentList, toolList, historicalUsage } = customerData
      
      // 分析备件使用频率
      const partUsageAnalysis = this.analyzePartUsage(historicalUsage)
      
      // ABC分类
      const classification = this.classifyParts(partUsageAnalysis)
      
      // 计算最优库存
      const optimalStock = this.calculateOptimalStock(classification)
      
      return {
        classification,
        optimalStock,
        recommendations: this.generateInventoryRecommendations(optimalStock),
        estimatedSavings: this.calculateInventorySavings(classification, optimalStock)
      }
    },
    
    // 分析备件使用
    analyzePartUsage(historicalUsage) {
      const partStats = {}
      
      historicalUsage.forEach(usage => {
        const partId = usage.partId
        if (!partStats[partId]) {
          partStats[partId] = {
            partId,
            partName: usage.partName,
            totalUsage: 0,
            avgMonthlyUsage: 0,
            cost: usage.cost || 0,
            leadTime: usage.leadTime || 7,
            criticalityScore: 0
          }
        }
        partStats[partId].totalUsage += usage.quantity
      })
      
      // 计算月均使用量
      Object.values(partStats).forEach(stat => {
        stat.avgMonthlyUsage = stat.totalUsage / 12  // 假设12个月数据
        stat.criticalityScore = this.calculatePartCriticality(stat)
      })
      
      return Object.values(partStats)
    },
    
    // 计算备件关键度
    calculatePartCriticality(partStat) {
      // 综合考虑使用频率、成本、交货期
      const frequencyScore = Math.min(partStat.avgMonthlyUsage * 10, 50)
      const costScore = Math.min(partStat.cost / 1000 * 10, 30)
      const leadTimeScore = Math.min(partStat.leadTime * 2, 20)
      
      return frequencyScore + costScore + leadTimeScore
    },
    
    // ABC分类
    classifyParts(partStats) {
      // 按关键度排序
      const sorted = partStats.sort((a, b) => b.criticalityScore - a.criticalityScore)
      
      const total = sorted.length
      const aCount = Math.ceil(total * 0.2)  // 前20%
      const bCount = Math.ceil(total * 0.3)  // 接下来30%
      
      return {
        A类件: sorted.slice(0, aCount).map(p => ({ ...p, category: 'A' })),
        B类件: sorted.slice(aCount, aCount + bCount).map(p => ({ ...p, category: 'B' })),
        C类件: sorted.slice(aCount + bCount).map(p => ({ ...p, category: 'C' })),
        
        策略: {
          A类: '100%库存，双供应商，安全库存+30%',
          B类: '50%库存，主供应商+备选，安全库存+15%',
          C类: '按需采购，单供应商，零库存'
        }
      }
    },
    
    // 计算最优库存
    calculateOptimalStock(classification) {
      const optimal = {}
      
      // A类件：充足库存
      classification.A类件.forEach(part => {
        optimal[part.partId] = {
          partName: part.partName,
          category: 'A',
          recommendedStock: Math.ceil(part.avgMonthlyUsage * 2.6),  // 2个月+30%安全库存
          reorderPoint: Math.ceil(part.avgMonthlyUsage * 1.5),
          orderQuantity: Math.ceil(part.avgMonthlyUsage * 3)
        }
      })
      
      // B类件：适度库存
      classification.B类件.forEach(part => {
        optimal[part.partId] = {
          partName: part.partName,
          category: 'B',
          recommendedStock: Math.ceil(part.avgMonthlyUsage * 1.15),  // 1个月+15%
          reorderPoint: Math.ceil(part.avgMonthlyUsage * 0.75),
          orderQuantity: Math.ceil(part.avgMonthlyUsage * 1.5)
        }
      })
      
      // C类件：按需采购
      classification.C类件.forEach(part => {
        optimal[part.partId] = {
          partName: part.partName,
          category: 'C',
          recommendedStock: 0,
          reorderPoint: 0,
          orderQuantity: part.avgMonthlyUsage  // 按月需求
        }
      })
      
      return optimal
    },
    
    // 生成库存建议
    generateInventoryRecommendations(optimalStock) {
      const recommendations = []
      
      Object.values(optimalStock).forEach(stock => {
        if (stock.category === 'A') {
          recommendations.push({
            partId: stock.partId,
            partName: stock.partName,
            action: '立即备货',
            quantity: stock.recommendedStock,
            reasoning: '高频高关键度，必须确保库存充足'
          })
        }
      })
      
      return recommendations
    },
    
    // 计算库存节省
    calculateInventorySavings(classification, optimalStock) {
      // 简化计算：优化后库存周转率提升50%
      const currentInventoryValue = 500000  // 假设当前库存50万
      const optimizedInventoryValue = currentInventoryValue * 0.7  // 优化后降低30%
      
      return {
        currentInventoryValue,
        optimizedInventoryValue,
        savings: currentInventoryValue - optimizedInventoryValue,
        savingsRate: '30%',
        turnoverImprovement: '50%',
        stockoutRiskReduction: '60%'
      }
    },
    
    // 生成实施路线图
    generateImplementationRoadmap(customerData) {
      const { equipmentCount, toolCount, budget, urgency } = customerData
      
      return {
        phase1: {
          name: '资产摸底与风险评估',
          duration: urgency === 'high' ? '3-4周' : '6-8周',
          tasks: [
            {
              week: 1,
              task: '关键设备盘点',
              deliverable: '设备清单（含型号、使用年限、故障频次）',
              effort: '客户2人日 + 明升5人日'
            },
            {
              week: 2,
              task: '电动工具全面盘点',
              deliverable: '工具台账（含品牌、数量、状态）',
              effort: '客户3人日 + 明升5人日'
            },
            {
              week: '3-4',
              task: '现场检测与状态分级',
              deliverable: '设备健康度评分报告 + 风险清单',
              effort: '明升10人日'
            }
          ],
          expectedOutcome: '完整资产底数 + 风险清单 + ROI分析'
        },
        
        phase2: {
          name: '快速止血与效果验证',
          duration: '3-6个月',
          tasks: [
            {
              month: 1,
              task: '高风险设备翻新',
              expectedSaving: '停机率↓30-50%，节省15-30万'
            },
            {
              month: '2-3',
              task: '电动工具年包导入',
              expectedSaving: '工具采购暂停，换新决策中止'
            },
            {
              month: '4-6',
              task: '效果验证与扩大',
              kpis: {
                停机率下降: '40-60%',
                维修成本下降: '20-35%',
                实际节省: '50-100万',
                客户满意度: '>85%'
              }
            }
          ]
        },
        
        phase3: {
          name: '结构性降本与长期锁定',
          duration: '6-12个月',
          tasks: [
            {
              month: '7-9',
              task: '国产替代全面实施',
              expectedSaving: 'CAPEX↓40-60%'
            },
            {
              month: '10-11',
              task: '年包覆盖关键设备',
              expectedSaving: 'OPEX可预测'
            },
            {
              month: 12,
              task: '年度总结与续约',
              kpis: {
                CAPEX下降: '30-52%',
                总节省: '150-300万/年',
                ROI: '132-175%'
              }
            }
          ]
        },
        
        customerRequirements: {
          人员: '指定1名设备接口人',
          数据: '提供设备&工具基础清单',
          决策: '确认年度目标',
          预算: '阶段1: 5-10万，阶段2-3按方案'
        }
      }
    }
  }
})
