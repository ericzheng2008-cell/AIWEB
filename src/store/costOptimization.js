import { defineStore } from 'pinia'
import { useEquipmentLifecycleStore } from './equipmentLifecycle'
import { useFaultTrackingStore } from './faultTracking'

export const useCostOptimizationStore = defineStore('costOptimization', {
  state: () => ({
    // 成本优化建议
    optimizationSuggestions: [],
    
    // 降本指标
    savingsMetrics: {
      totalSavings: 0,
      partsOptimization: 0,
      laborEfficiency: 0,
      preventiveMaintenance: 0,
      energyEfficiency: 0
    },
    
    // 优化类别
    categories: [
      { id: 'parts', name: '备件优化', icon: 'Box', color: '#1890ff' },
      { id: 'labor', name: '人工效率', icon: 'User', color: '#52c41a' },
      { id: 'preventive', name: '预防性维护', icon: 'Clock', color: '#faad14' },
      { id: 'energy', name: '能源效率', icon: 'Lightning', color: '#f5222d' },
      { id: 'process', name: '流程优化', icon: 'Setting', color: '#722ed1' }
    ],
    
    // 优先级
    priorities: ['high', 'medium', 'low']
  }),
  
  getters: {
    // 按优先级分组的建议
    suggestionsByPriority: (state) => {
      const grouped = {}
      state.priorities.forEach(p => {
        grouped[p] = state.optimizationSuggestions.filter(s => s.priority === p)
      })
      return grouped
    },
    
    // 按类别分组的建议
    suggestionsByCategory: (state) => {
      const grouped = {}
      state.categories.forEach(c => {
        grouped[c.id] = state.optimizationSuggestions.filter(s => s.category === c.id)
      })
      return grouped
    },
    
    // 总节省金额
    totalPotentialSavings: (state) => {
      return state.optimizationSuggestions.reduce((sum, s) => sum + (s.potentialSavings || 0), 0)
    },
    
    // 高优先级建议数量
    highPriorityCount: (state) => {
      return state.optimizationSuggestions.filter(s => s.priority === 'high').length
    }
  },
  
  actions: {
    // 生成成本优化建议
    generateOptimizationSuggestions() {
      const equipmentStore = useEquipmentLifecycleStore()
      const faultStore = useFaultTrackingStore()
      
      this.optimizationSuggestions = []
      
      // 1. 备件库存优化
      const highFreqParts = this.analyzePartsUsage(faultStore.workOrders)
      if (highFreqParts.length > 0) {
        this.optimizationSuggestions.push({
          id: `OPT-${Date.now()}-1`,
          category: 'parts',
          title: '优化高频备件库存',
          description: `发现${highFreqParts.length}种备件使用频率高，建议增加库存以减少停机时间`,
          currentSituation: '备件库存不足导致等待时间长',
          solution: '建立合理库存预测模型，增加高频备件储备',
          potentialSavings: highFreqParts.length * 5000,
          implementationTime: '1-2周',
          difficulty: 'medium',
          priority: 'high',
          status: 'pending',
          createdAt: new Date().toISOString()
        })
      }
      
      // 2. 预防性维护优化
      const overdueEquipment = equipmentStore.getMaintenanceDueEquipment
      if (overdueEquipment.length > 0) {
        this.optimizationSuggestions.push({
          id: `OPT-${Date.now()}-2`,
          category: 'preventive',
          title: '加强预防性维护计划',
          description: `${overdueEquipment.length}台设备维护逾期，可能导致突发故障和高昂的维修成本`,
          currentSituation: '预防性维护执行不及时',
          solution: '建立维护提醒机制，优化维护计划执行',
          potentialSavings: overdueEquipment.length * 8000,
          implementationTime: '立即',
          difficulty: 'low',
          priority: 'high',
          status: 'pending',
          createdAt: new Date().toISOString()
        })
      }
      
      // 3. 维修人员效率优化
      const avgRepairTime = this.calculateAvgRepairTime(faultStore.workOrders)
      if (avgRepairTime > 8) {
        this.optimizationSuggestions.push({
          id: `OPT-${Date.now()}-3`,
          category: 'labor',
          title: '提升维修人员效率',
          description: `平均维修时长${avgRepairTime.toFixed(1)}小时，通过培训和工具优化可缩短30%`,
          currentSituation: `当前平均维修时长: ${avgRepairTime.toFixed(1)}小时`,
          solution: '开展技能培训，配备专业工具，优化维修流程',
          potentialSavings: 50000,
          implementationTime: '1-3个月',
          difficulty: 'medium',
          priority: 'medium',
          status: 'pending',
          createdAt: new Date().toISOString()
        })
      }
      
      // 4. 高故障率设备更新
      const highFaultEquipment = equipmentStore.equipmentAssets.filter(eq => {
        const faultCount = faultStore.workOrders.filter(wo => wo.equipmentId === eq.id).length
        return faultCount > 5
      })
      
      if (highFaultEquipment.length > 0) {
        this.optimizationSuggestions.push({
          id: `OPT-${Date.now()}-4`,
          category: 'parts',
          title: '更换高故障率设备',
          description: `${highFaultEquipment.length}台设备故障率超标，考虑更新设备降低维护成本`,
          currentSituation: '部分设备频繁故障，维护成本高',
          solution: '制定设备更新计划，优先更换高故障率设备',
          potentialSavings: highFaultEquipment.length * 30000,
          implementationTime: '3-6个月',
          difficulty: 'high',
          priority: 'medium',
          status: 'pending',
          createdAt: new Date().toISOString()
        })
      }
      
      // 5. 能源效率优化
      const oldEquipment = equipmentStore.equipmentAssets.filter(eq => {
        const age = new Date().getFullYear() - new Date(eq.purchaseDate).getFullYear()
        return age > 8
      })
      
      if (oldEquipment.length > 0) {
        this.optimizationSuggestions.push({
          id: `OPT-${Date.now()}-5`,
          category: 'energy',
          title: '升级老旧设备提升能效',
          description: `${oldEquipment.length}台设备使用超过8年，能耗较高，建议升级`,
          currentSituation: '老旧设备能耗高，运行效率低',
          solution: '分批更新为高能效设备，降低运营成本',
          potentialSavings: oldEquipment.length * 20000,
          implementationTime: '6-12个月',
          difficulty: 'high',
          priority: 'low',
          status: 'pending',
          createdAt: new Date().toISOString()
        })
      }
      
      // 6. 流程优化
      const pendingOrders = faultStore.workOrders.filter(wo => wo.status === 'pending')
      if (pendingOrders.length > 10) {
        this.optimizationSuggestions.push({
          id: `OPT-${Date.now()}-6`,
          category: 'process',
          title: '优化工单响应流程',
          description: `${pendingOrders.length}个工单待处理，响应速度需要提升`,
          currentSituation: '工单响应时间长，影响生产效率',
          solution: '优化工单分配机制，增加维修人员，建立快速响应通道',
          potentialSavings: 40000,
          implementationTime: '1个月',
          difficulty: 'medium',
          priority: 'high',
          status: 'pending',
          createdAt: new Date().toISOString()
        })
      }
      
      // 更新降本指标
      this.updateSavingsMetrics()
    },
    
    // 分析备件使用情况
    analyzePartsUsage(workOrders) {
      const partsCount = {}
      workOrders.forEach(wo => {
        if (wo.spareParts) {
          wo.spareParts.forEach(part => {
            partsCount[part.name] = (partsCount[part.name] || 0) + part.quantity
          })
        }
      })
      
      // 返回使用频率大于3的备件
      return Object.entries(partsCount)
        .filter(([_, count]) => count > 3)
        .map(([name, count]) => ({ name, count }))
    },
    
    // 计算平均维修时长
    calculateAvgRepairTime(workOrders) {
      const closedOrders = workOrders.filter(wo => wo.status === 'closed' && wo.actualTime)
      if (closedOrders.length === 0) return 0
      
      const totalTime = closedOrders.reduce((sum, wo) => sum + (wo.actualTime || 0), 0)
      return totalTime / closedOrders.length
    },
    
    // 更新节省指标
    updateSavingsMetrics() {
      const suggestions = this.optimizationSuggestions
      
      this.savingsMetrics.partsOptimization = suggestions
        .filter(s => s.category === 'parts')
        .reduce((sum, s) => sum + s.potentialSavings, 0)
        
      this.savingsMetrics.laborEfficiency = suggestions
        .filter(s => s.category === 'labor')
        .reduce((sum, s) => sum + s.potentialSavings, 0)
        
      this.savingsMetrics.preventiveMaintenance = suggestions
        .filter(s => s.category === 'preventive')
        .reduce((sum, s) => sum + s.potentialSavings, 0)
        
      this.savingsMetrics.energyEfficiency = suggestions
        .filter(s => s.category === 'energy')
        .reduce((sum, s) => sum + s.potentialSavings, 0)
        
      this.savingsMetrics.totalSavings = this.totalPotentialSavings
    },
    
    // 更新建议状态
    updateSuggestionStatus(suggestionId, status) {
      const suggestion = this.optimizationSuggestions.find(s => s.id === suggestionId)
      if (suggestion) {
        suggestion.status = status
        suggestion.updatedAt = new Date().toISOString()
      }
    },
    
    // 添加自定义建议
    addCustomSuggestion(suggestionData) {
      const newSuggestion = {
        id: `OPT-${Date.now()}`,
        ...suggestionData,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
      this.optimizationSuggestions.push(newSuggestion)
      this.updateSavingsMetrics()
      return newSuggestion
    },
    
    // 删除建议
    deleteSuggestion(suggestionId) {
      const index = this.optimizationSuggestions.findIndex(s => s.id === suggestionId)
      if (index !== -1) {
        this.optimizationSuggestions.splice(index, 1)
        this.updateSavingsMetrics()
        return true
      }
      return false
    }
  }
})
