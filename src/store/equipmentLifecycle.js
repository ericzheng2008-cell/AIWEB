import { defineStore } from 'pinia'

export const useEquipmentLifecycleStore = defineStore('equipmentLifecycle', {
  state: () => ({
    // 设备分类（基于维修降本清单）
    equipmentCategories: {
      robot: {
        id: 'robot',
        name: { 'zh-CN': '机器人', 'en-US': 'Robot' },
        icon: 'Robot',
        color: '#1890ff',
        components: [
          { id: 'circuit_board', name: { 'zh-CN': '电路板', 'en-US': 'Circuit Board' }, avgCost: 5000, lifecycle: 36, maintenanceCycle: 6 },
          { id: 'reducer', name: { 'zh-CN': '减速机', 'en-US': 'Reducer' }, avgCost: 8000, lifecycle: 48, maintenanceCycle: 12 },
          { id: 'servo_amplifier', name: { 'zh-CN': '伺服放大器', 'en-US': 'Servo Amplifier' }, avgCost: 3000, lifecycle: 36, maintenanceCycle: 12 },
          { id: 'display', name: { 'zh-CN': '示教器', 'en-US': 'Teaching Pendant' }, avgCost: 4000, lifecycle: 60, maintenanceCycle: 12 },
          { id: 'servo_motor', name: { 'zh-CN': '伺服电机', 'en-US': 'Servo Motor' }, avgCost: 6000, lifecycle: 48, maintenanceCycle: 12 }
        ]
      },
      welding: {
        id: 'welding',
        name: { 'zh-CN': '焊钳', 'en-US': 'Welding Gun' },
        icon: 'Connection',
        color: '#fa8c16',
        components: [
          { id: 'electrode_holder', name: { 'zh-CN': '电极握杆', 'en-US': 'Electrode Holder' }, avgCost: 800, lifecycle: 12, maintenanceCycle: 3 },
          { id: 'pliers', name: { 'zh-CN': '钳臂', 'en-US': 'Gun Arm' }, avgCost: 1500, lifecycle: 24, maintenanceCycle: 6 },
          { id: 'servo_cable', name: { 'zh-CN': '伺服马达/电缸', 'en-US': 'Servo Motor/Cylinder' }, avgCost: 4000, lifecycle: 36, maintenanceCycle: 12 },
          { id: 'weld_controller', name: { 'zh-CN': '焊接控制器', 'en-US': 'Weld Controller' }, avgCost: 5000, lifecycle: 48, maintenanceCycle: 12 }
        ]
      },
      electrical: {
        id: 'electrical',
        name: { 'zh-CN': '电气类', 'en-US': 'Electrical' },
        icon: 'Lightning',
        color: '#faad14',
        components: [
          { id: 'laser_scanner', name: { 'zh-CN': '激光扫描仪', 'en-US': 'Laser Scanner' }, avgCost: 12000, lifecycle: 60, maintenanceCycle: 12 },
          { id: 'touch_screen', name: { 'zh-CN': '触摸屏', 'en-US': 'Touch Screen' }, avgCost: 2000, lifecycle: 36, maintenanceCycle: 12 },
          { id: 'inverter', name: { 'zh-CN': '变频器', 'en-US': 'Inverter' }, avgCost: 3000, lifecycle: 48, maintenanceCycle: 12 },
          { id: 'servo_amplifier_e', name: { 'zh-CN': '伺服放大器', 'en-US': 'Servo Amplifier' }, avgCost: 3000, lifecycle: 36, maintenanceCycle: 12 },
          { id: 'motor', name: { 'zh-CN': '电机', 'en-US': 'Motor' }, avgCost: 2500, lifecycle: 48, maintenanceCycle: 12 }
        ]
      },
      mechanical: {
        id: 'mechanical',
        name: { 'zh-CN': '机械类', 'en-US': 'Mechanical' },
        icon: 'Setting',
        color: '#52c41a',
        components: [
          { id: 'cylinder', name: { 'zh-CN': '气缸', 'en-US': 'Cylinder' }, avgCost: 500, lifecycle: 24, maintenanceCycle: 6 },
          { id: 'strong_cylinder', name: { 'zh-CN': '强力缸', 'en-US': 'Power Cylinder' }, avgCost: 1200, lifecycle: 24, maintenanceCycle: 6 },
          { id: 'solenoid', name: { 'zh-CN': '电磁阀', 'en-US': 'Solenoid Valve' }, avgCost: 300, lifecycle: 24, maintenanceCycle: 6 },
          { id: 'roller', name: { 'zh-CN': '包胶轮（AGV驱动轮、驱动轮、摩擦轮）', 'en-US': 'Rubber Roller' }, avgCost: 400, lifecycle: 12, maintenanceCycle: 3 },
          { id: 'coating_gun', name: { 'zh-CN': '涂胶枪', 'en-US': 'Coating Gun' }, avgCost: 2000, lifecycle: 18, maintenanceCycle: 3 },
          { id: 'coating_meter', name: { 'zh-CN': '涂胶定量机', 'en-US': 'Coating Metering Machine' }, avgCost: 8000, lifecycle: 36, maintenanceCycle: 6 },
          { id: 'titanium_cup', name: { 'zh-CN': '钛制旋杯', 'en-US': 'Titanium Rotary Cup' }, avgCost: 3000, lifecycle: 12, maintenanceCycle: 3 }
        ]
      },
      painting: {
        id: 'painting',
        name: { 'zh-CN': '喷涂', 'en-US': 'Painting' },
        icon: 'Brush',
        color: '#722ed1',
        components: [
          { id: 'controller', name: { 'zh-CN': '控制器', 'en-US': 'Controller' }, avgCost: 6000, lifecycle: 48, maintenanceCycle: 12 },
          { id: 'control_board', name: { 'zh-CN': '控制基板', 'en-US': 'Control Board' }, avgCost: 4000, lifecycle: 36, maintenanceCycle: 12 },
          { id: 'hydraulic_oil', name: { 'zh-CN': '油压脉冲工具换油', 'en-US': 'Hydraulic Tool Oil Change' }, avgCost: 500, lifecycle: 6, maintenanceCycle: 6 }
        ]
      },
      tools: {
        id: 'tools',
        name: { 'zh-CN': '工具', 'en-US': 'Tools' },
        icon: 'Tools',
        color: '#13c2c2',
        components: [
          { id: 'clutch_tool', name: { 'zh-CN': '离合器工具维修保养', 'en-US': 'Clutch Tool Maintenance' }, avgCost: 800, lifecycle: 12, maintenanceCycle: 6 },
          { id: 'hydraulic_tool', name: { 'zh-CN': '油压脉冲工具维修保养', 'en-US': 'Hydraulic Pulse Tool Maintenance' }, avgCost: 1000, lifecycle: 12, maintenanceCycle: 6 }
        ]
      }
    },

    // 设备档案（真实设备实例）
    equipmentAssets: JSON.parse(localStorage.getItem('equipmentAssets') || JSON.stringify([
      {
        id: 'EQ-2024-001',
        name: '焊接机器人-1号线',
        category: 'robot',
        model: 'ABB IRB 6700',
        serialNumber: 'ABB-6700-20240101',
        manufacturer: 'ABB',
        purchaseDate: '2024-01-15',
        purchasePrice: 280000,
        installDate: '2024-02-01',
        warrantyEndDate: '2026-02-01',
        location: '车间A-1号线',
        status: 'running', // running, maintenance, idle, fault
        workingHours: 8760, // 运行小时数
        utilizationRate: 85, // 使用率%
        components: [
          { componentId: 'circuit_board', installDate: '2024-02-01', lastMaintenance: '2024-10-01', nextMaintenance: '2025-04-01', condition: 95 },
          { componentId: 'reducer', installDate: '2024-02-01', lastMaintenance: '2024-11-01', nextMaintenance: '2025-11-01', condition: 90 },
          { componentId: 'servo_amplifier', installDate: '2024-02-01', lastMaintenance: '2024-10-01', nextMaintenance: '2025-10-01', condition: 92 }
        ],
        maintenanceRecords: [],
        costRecords: []
      }
    ])),

    // ROI计算配置
    roiConfig: {
      depreciationMethod: 'straight_line', // straight_line, declining_balance
      depreciationYears: 10,
      laborCostPerHour: 80, // 人工成本/小时
      downtime: {
        plannedMaintenance: 240, // 计划维护小时/年
        unplannedDowntime: 120 // 非计划停机小时/年
      },
      productionValue: {
        perHour: 500 // 每小时产值
      }
    },

    // 维护保养预测模型
    maintenancePrediction: {
      algorithms: ['regression', 'ai_ml'], // 预测算法
      factors: {
        workingHours: 0.4, // 运行时间权重
        faultHistory: 0.3, // 故障历史权重
        componentAge: 0.2, // 部件年龄权重
        environmentalFactors: 0.1 // 环境因素权重
      },
      alertThresholds: {
        urgent: 30, // 30天内需保养
        warning: 60, // 60天内需保养
        normal: 90 // 90天内需保养
      }
    }
  }),

  getters: {
    // 获取所有设备分类
    getAllCategories: (state) => {
      return Object.values(state.equipmentCategories)
    },

    // 获取指定分类的部件
    getComponentsByCategory: (state) => (categoryId) => {
      return state.equipmentCategories[categoryId]?.components || []
    },

    // 获取运行中的设备
    getRunningEquipment: (state) => {
      return state.equipmentAssets.filter(eq => eq.status === 'running')
    },

    // 获取故障设备
    getFaultyEquipment: (state) => {
      return state.equipmentAssets.filter(eq => eq.status === 'fault')
    },

    // 计算总资产价值
    getTotalAssetValue: (state) => {
      return state.equipmentAssets.reduce((sum, eq) => {
        const age = new Date().getFullYear() - new Date(eq.purchaseDate).getFullYear()
        const depreciation = eq.purchasePrice / state.roiConfig.depreciationYears * age
        return sum + Math.max(eq.purchasePrice - depreciation, eq.purchasePrice * 0.1)
      }, 0)
    },

    // 获取需要保养的设备
    getMaintenanceDueEquipment: (state) => {
      const today = new Date()
      return state.equipmentAssets.filter(eq => {
        return eq.components.some(comp => {
          const nextMaintenanceDate = new Date(comp.nextMaintenance)
          const daysUntilMaintenance = Math.floor((nextMaintenanceDate - today) / (1000 * 60 * 60 * 24))
          return daysUntilMaintenance <= state.maintenancePrediction.alertThresholds.urgent
        })
      })
    },

    // 计算设备健康度
    getEquipmentHealth: (state) => (equipmentId) => {
      const equipment = state.equipmentAssets.find(eq => eq.id === equipmentId)
      if (!equipment) return 0
      
      const avgCondition = equipment.components.reduce((sum, comp) => sum + comp.condition, 0) / equipment.components.length
      return Math.round(avgCondition)
    }
  },

  actions: {
    // 添加设备
    addEquipment(equipment) {
      this.equipmentAssets.push({
        ...equipment,
        id: `EQ-${Date.now()}`,
        maintenanceRecords: [],
        costRecords: []
      })
      this.saveToLocalStorage()
    },

    // 更新设备信息
    updateEquipment(equipmentId, updates) {
      const index = this.equipmentAssets.findIndex(eq => eq.id === equipmentId)
      if (index !== -1) {
        this.equipmentAssets[index] = { ...this.equipmentAssets[index], ...updates }
        this.saveToLocalStorage()
      }
    },

    // 删除设备
    deleteEquipment(equipmentId) {
      this.equipmentAssets = this.equipmentAssets.filter(eq => eq.id !== equipmentId)
      this.saveToLocalStorage()
    },

    // 计算设备ROI
    calculateROI(equipmentId) {
      const equipment = this.equipmentAssets.find(eq => eq.id === equipmentId)
      if (!equipment) return null

      const age = new Date().getFullYear() - new Date(equipment.purchaseDate).getFullYear()
      const totalMaintenanceCost = equipment.costRecords.reduce((sum, cost) => sum + cost.amount, 0)
      
      // 年折旧
      const annualDepreciation = equipment.purchasePrice / this.roiConfig.depreciationYears
      
      // 年产值（考虑使用率和停机时间）
      const workingHoursPerYear = 8760 // 365天 * 24小时
      const actualWorkingHours = workingHoursPerYear * (equipment.utilizationRate / 100) - 
                                 this.roiConfig.downtime.plannedMaintenance - 
                                 this.roiConfig.downtime.unplannedDowntime
      const annualRevenue = actualWorkingHours * this.roiConfig.productionValue.perHour
      
      // ROI计算
      const totalInvestment = equipment.purchasePrice + totalMaintenanceCost
      const totalReturn = annualRevenue * age
      const roi = ((totalReturn - totalInvestment) / totalInvestment) * 100
      
      return {
        equipment: equipment.name,
        purchasePrice: equipment.purchasePrice,
        age,
        totalMaintenanceCost,
        annualDepreciation,
        currentValue: Math.max(equipment.purchasePrice - annualDepreciation * age, equipment.purchasePrice * 0.1),
        annualRevenue,
        actualWorkingHours,
        totalReturn,
        totalInvestment,
        roi: roi.toFixed(2),
        paybackPeriod: (totalInvestment / annualRevenue).toFixed(2) // 回本期（年）
      }
    },

    // 预测维护时间
    predictMaintenance(equipmentId) {
      const equipment = this.equipmentAssets.find(eq => eq.id === equipmentId)
      if (!equipment) return []

      const predictions = []
      const today = new Date()

      equipment.components.forEach(comp => {
        const componentInfo = this.findComponentInfo(equipment.category, comp.componentId)
        if (!componentInfo) return

        const nextMaintenanceDate = new Date(comp.nextMaintenance)
        const daysUntilMaintenance = Math.floor((nextMaintenanceDate - today) / (1000 * 60 * 60 * 24))
        
        // AI预测：基于运行小时数和部件状况
        const usageFactorScore = equipment.workingHours / (componentInfo.lifecycle * 730) // 730小时/月
        const conditionScore = (100 - comp.condition) / 100
        const predictedRisk = (usageFactorScore * 0.6 + conditionScore * 0.4) * 100

        let urgency = 'normal'
        if (daysUntilMaintenance <= this.maintenancePrediction.alertThresholds.urgent || predictedRisk > 80) {
          urgency = 'urgent'
        } else if (daysUntilMaintenance <= this.maintenancePrediction.alertThresholds.warning || predictedRisk > 60) {
          urgency = 'warning'
        }

        predictions.push({
          equipmentId,
          equipmentName: equipment.name,
          componentId: comp.componentId,
          componentName: componentInfo.name['zh-CN'],
          nextMaintenance: comp.nextMaintenance,
          daysUntilMaintenance,
          condition: comp.condition,
          predictedRisk: Math.round(predictedRisk),
          urgency,
          estimatedCost: componentInfo.avgCost * 0.15 // 保养成本约为部件价格的15%
        })
      })

      return predictions.sort((a, b) => a.daysUntilMaintenance - b.daysUntilMaintenance)
    },

    // 记录维护
    recordMaintenance(equipmentId, maintenanceData) {
      const equipment = this.equipmentAssets.find(eq => eq.id === equipmentId)
      if (!equipment) return

      equipment.maintenanceRecords.push({
        id: `MR-${Date.now()}`,
        date: maintenanceData.date || new Date().toISOString().split('T')[0],
        type: maintenanceData.type, // 'planned', 'unplanned', 'repair'
        components: maintenanceData.components,
        description: maintenanceData.description,
        technician: maintenanceData.technician,
        duration: maintenanceData.duration, // 维护耗时（小时）
        cost: maintenanceData.cost
      })

      // 更新部件状态
      maintenanceData.components.forEach(compId => {
        const component = equipment.components.find(c => c.componentId === compId)
        if (component) {
          component.lastMaintenance = maintenanceData.date
          component.condition = Math.min(component.condition + 10, 100) // 保养后状况提升
          
          // 计算下次保养时间
          const componentInfo = this.findComponentInfo(equipment.category, compId)
          if (componentInfo) {
            const nextDate = new Date(maintenanceData.date)
            nextDate.setMonth(nextDate.getMonth() + componentInfo.maintenanceCycle)
            component.nextMaintenance = nextDate.toISOString().split('T')[0]
          }
        }
      })

      this.saveToLocalStorage()
    },

    // 记录成本
    recordCost(equipmentId, costData) {
      const equipment = this.equipmentAssets.find(eq => eq.id === equipmentId)
      if (!equipment) return

      equipment.costRecords.push({
        id: `CR-${Date.now()}`,
        date: costData.date || new Date().toISOString().split('T')[0],
        type: costData.type, // 'parts', 'labor', 'maintenance', 'repair'
        description: costData.description,
        amount: costData.amount,
        relatedWorkOrder: costData.workOrderId || null
      })

      this.saveToLocalStorage()
    },

    // 分析服务成本
    analyzeServiceCosts(equipmentId, timeRange = 12) {
      const equipment = this.equipmentAssets.find(eq => eq.id === equipmentId)
      if (!equipment) return null

      const endDate = new Date()
      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - timeRange)

      const relevantCosts = equipment.costRecords.filter(cost => {
        const costDate = new Date(cost.date)
        return costDate >= startDate && costDate <= endDate
      })

      const costsByType = {
        parts: 0,
        labor: 0,
        maintenance: 0,
        repair: 0
      }

      relevantCosts.forEach(cost => {
        costsByType[cost.type] = (costsByType[cost.type] || 0) + cost.amount
      })

      const totalCost = Object.values(costsByType).reduce((sum, cost) => sum + cost, 0)
      const monthlyAverage = totalCost / timeRange

      return {
        equipmentId,
        equipmentName: equipment.name,
        timeRange: `${timeRange}个月`,
        totalCost,
        monthlyAverage,
        costsByType,
        costBreakdown: {
          parts: ((costsByType.parts / totalCost) * 100).toFixed(1),
          labor: ((costsByType.labor / totalCost) * 100).toFixed(1),
          maintenance: ((costsByType.maintenance / totalCost) * 100).toFixed(1),
          repair: ((costsByType.repair / totalCost) * 100).toFixed(1)
        },
        trend: this.calculateCostTrend(equipment, timeRange)
      }
    },

    // 计算成本趋势
    calculateCostTrend(equipment, months) {
      const monthlyData = []
      for (let i = months - 1; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

        const monthlyCost = equipment.costRecords
          .filter(cost => {
            const costDate = new Date(cost.date)
            return costDate >= monthStart && costDate <= monthEnd
          })
          .reduce((sum, cost) => sum + cost.amount, 0)

        monthlyData.push({
          month: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
          cost: monthlyCost
        })
      }
      return monthlyData
    },

    // 查找部件信息
    findComponentInfo(categoryId, componentId) {
      const category = this.equipmentCategories[categoryId]
      if (!category) return null
      return category.components.find(c => c.id === componentId)
    },

    // 批量导入设备
    importEquipment(equipmentList) {
      equipmentList.forEach(eq => this.addEquipment(eq))
    },

    // 生成设备报告
    generateEquipmentReport(equipmentId) {
      const equipment = this.equipmentAssets.find(eq => eq.id === equipmentId)
      if (!equipment) return null

      const roi = this.calculateROI(equipmentId)
      const maintenancePredictions = this.predictMaintenance(equipmentId)
      const costAnalysis = this.analyzeServiceCosts(equipmentId, 12)
      const health = this.getEquipmentHealth(equipmentId)

      return {
        equipment,
        health,
        roi,
        maintenancePredictions,
        costAnalysis,
        generatedAt: new Date().toISOString()
      }
    },

    // 保存到本地存储
    saveToLocalStorage() {
      localStorage.setItem('equipmentAssets', JSON.stringify(this.equipmentAssets))
    },

    // ========== 新增：核心商业功能 ==========

    // 【升级6】"必中算账法"实时计算器
    generateOnPageCalculator(customerInput) {
      const {
        toolCount = 100,
        toolUnitPrice = 20000,
        currentLifespan = 3,  // 年
        currentAnnualReplacement = Math.ceil(toolCount / currentLifespan)
      } = customerInput
      
      // 传统模式
      const traditional = {
        年换新数量: currentAnnualReplacement,
        年换新成本: currentAnnualReplacement * toolUnitPrice,
        备件成本: toolCount * 500  // 备件库存成本
      }
      traditional.总成本 = traditional.年换新成本 + traditional.备件成本
      
      // 明升年包模式
      const ourModel = {
        换新量下降率: 0.5,
        年换新数量: Math.ceil(currentAnnualReplacement * 0.5),
        年换新成本: Math.ceil(currentAnnualReplacement * 0.5) * toolUnitPrice,
        年包费率: 0.12,  // 12%年包费率
        年包费用: toolCount * toolUnitPrice * 0.12
      }
      ourModel.总成本 = ourModel.年换新成本 + ourModel.年包费用
      
      // 算账结果
      const result = {
        传统模式年成本: traditional.总成本,
        年包模式年成本: ourModel.总成本,
        直接节省现金: traditional.总成本 - ourModel.总成本,
        节省率: ((traditional.总成本 - ourModel.总成本) / traditional.总成本 * 100).toFixed(1) + '%',
        
        额外收益: {
          停线规避价值: '20-30万/年',
          人工节省: '10万/年',
          库存释放: '50-80万（一次性）'
        },
        
        // 现场演示金句
        salesPitch: `
【传统模式】
  ${toolCount}把工具 ÷ ${currentLifespan}年寿命 = 每年换${currentAnnualReplacement}把
  年成本: ${(traditional.总成本/10000).toFixed(1)}万（换新${(traditional.年换新成本/10000).toFixed(1)}万 + 备件${(traditional.备件成本/10000).toFixed(1)}万）

【年包模式】
  换新量↓50% = 每年换${ourModel.年换新数量}把
  新购成本: ${(ourModel.年换新成本/10000).toFixed(1)}万
  年包费用: ${(ourModel.年包费用/10000).toFixed(1)}万（${toolCount}把×${(ourModel.年包费率*100)}%）
  总成本: ${(ourModel.总成本/10000).toFixed(1)}万

【直接省】
  ${(traditional.总成本/10000).toFixed(1)}万 - ${(ourModel.总成本/10000).toFixed(1)}万 = ${(result.直接节省现金/10000).toFixed(1)}万/年

【您省下的不只是维修费，更是现金流】
  ✓ ${(result.直接节省现金/10000).toFixed(1)}万现金直接省
  ✓ 0停线风险（工具年包兜底）
  ✓ 0库存压力（明升备机管理）
  ✓ 释放库存资金50-80万
        `.trim(),
        
        // 详细对比数据
        detailedComparison: {
          traditional,
          ourModel,
          toolCount,
          toolUnitPrice,
          currentLifespan
        }
      }
      
      return result
    },

    // 【升级7】年包产品智能推荐
    recommendAnnualPackage(customerProfile) {
      const {
        budgetLevel = 'normal',      // 'tight' | 'normal' | 'ample'
        productionCriticality = 5,   // 1-10分
        toolCount = 100,
        currentPainPoints = []
      } = customerProfile
      
      const products = [
        {
          sku: 'AP-BASIC',
          name: 'A. 基础保障包',
          tagline: '止血方案 - 适合预算紧',
          pricing: {
            rateOfAssetValue: 0.10,
            annualFee: toolCount * 20000 * 0.10
          },
          services: [
            '检测分级（每季度）',
            '维修翻新（按需）',
            'SLA响应（48小时）',
            '年度健康报告'
          ],
          适用客户: '工具量大、预算有限、希望快速止血',
          expectedROI: '75-125%',
          score: 0
        },
        {
          sku: 'AP-STANDARD',
          name: 'B. 标准运营包（推荐⭐）',
          tagline: '降本+稳产 - 适合主线产线',
          pricing: {
            rateOfAssetValue: 0.12,
            annualFee: toolCount * 20000 * 0.12
          },
          services: [
            '✓ 基础包全部内容',
            '备机保障（10%备机池）',
            '定期巡检（每月）',
            '年度结算',
            '优先支持（24小时）',
            '预防性维护'
          ],
          适用客户: '主线产线、追求稳产、需要确定性',
          expectedROI: '125-167%',
          score: 0
        },
        {
          sku: 'AP-STRATEGIC',
          name: 'C. 战略托管包',
          tagline: '长期绑定 - 适合焊装/高节拍',
          pricing: {
            rateOfAssetValue: 0.15,
            annualFee: toolCount * 20000 * 0.15
          },
          services: [
            '✓ 标准包全部内容',
            '工具全托管',
            '健康度管理',
            '预防性翻新',
            'TCO目标共担',
            '专属服务团队',
            '数字化平台'
          ],
          适用客户: '关键产线、集团客户、追求极致确定性',
          expectedROI: '139-278%',
          score: 0
        }
      ]
      
      // 智能评分
      products[0].score += budgetLevel === 'tight' ? 30 : 0
      products[0].score += toolCount > 80 ? 20 : 0
      
      products[1].score += budgetLevel === 'normal' ? 30 : 0
      products[1].score += productionCriticality >= 5 && productionCriticality <= 7 ? 25 : 0
      products[1].score += 20  // 默认推荐
      
      products[2].score += budgetLevel === 'ample' ? 30 : 0
      products[2].score += productionCriticality >= 8 ? 30 : 0
      
      // 排序
      products.sort((a, b) => b.score - a.score)
      
      const recommended = products[0]
      recommended.reasoning = this.generateRecommendationReasoning(recommended, customerProfile)
      
      return {
        recommended,
        alternatives: products.slice(1),
        customQuotation: {
          年包费用: recommended.pricing.annualFee,
          服务内容: recommended.services,
          预期ROI: recommended.expectedROI,
          适用场景: recommended.适用客户
        }
      }
    },

    // 生成推荐理由
    generateRecommendationReasoning(product, profile) {
      const reasons = []
      
      if (product.sku === 'AP-BASIC') {
        reasons.push('工具量大，预算有限')
        reasons.push('建议先从基础保障包起步')
        reasons.push('见效后可升级到标准包')
      } else if (product.sku === 'AP-STRATEGIC') {
        reasons.push('产线关键度高')
        reasons.push('建议直接战略托管包')
        reasons.push('彻底消除停线风险')
      } else {
        reasons.push('综合性价比最优')
        reasons.push('90%客户选择')
        reasons.push('续签率90%')
      }
      
      return reasons.join('，')
    },

    // 【升级1】智能成本冰山分析
    generateCostIcebergAnalysis(equipmentId, timeRange = 12) {
      const equipment = this.equipmentAssets.find(eq => eq.id === equipmentId)
      if (!equipment) return null
      
      // 可见成本（30%）
      const visibleCosts = {
        purchase: equipment.purchasePrice,
        percentage: 30
      }
      
      // 隐性成本（70%）- 基于行业经验估算
      const purchasePrice = equipment.purchasePrice
      const hiddenCosts = {
        downtimeLoss: purchasePrice * 0.25,           // 停机损失25%
        emergencyRepair: purchasePrice * 0.15,        // 被动维修15%
        inventoryCost: purchasePrice * 0.08,          // 备件库存8%
        earlyScrap: purchasePrice * 0.10,             // 过早报废10%
        urgentLogistics: purchasePrice * 0.05,        // 紧急物流5%
        inefficientLabor: purchasePrice * 0.04,       // 人工低效4%
        qualityLoss: purchasePrice * 0.03,            // 质量损失3%
        percentage: 70
      }
      
      const totalHiddenCost = Object.values(hiddenCosts)
        .filter(v => typeof v === 'number')
        .reduce((sum, cost) => sum + cost, 0)
      
      return {
        equipment: equipment.name,
        visibleCosts,
        hiddenCosts: {
          ...hiddenCosts,
          total: totalHiddenCost
        },
        totalLifecycleCost: visibleCosts.purchase + totalHiddenCost,
        hiddenCostRatio: ((totalHiddenCost / (visibleCosts.purchase + totalHiddenCost)) * 100).toFixed(1) + '%',
        potentialSavings: totalHiddenCost * 0.4,  // 优化可节省40%隐性成本
        recommendation: '通过年包服务可将隐性成本降低40-60%'
      }
    },

    // 【升级3】五级价值路径智能推荐
    recommendOptimalPath(customerSituation) {
      const {
        budget = 'normal',           // 'tight' | 'normal' | 'ample'
        faultFrequency = 'medium',   // 'low' | 'medium' | 'high'
        importDependency = 'medium', // 'low' | 'medium' | 'high'
        targetCertainty = 'medium'   // 'low' | 'medium' | 'high'
      } = customerSituation
      
      const paths = {
        L1: { name: '利旧改造', score: 0, cost: '5-10万', roi: '160%', period: '5-8个月' },
        L2: { name: '原厂翻新', score: 0, cost: '10-20万', roi: '150%', period: '6-9个月' },
        L3: { name: '部件替换', score: 0, cost: '20-40万', roi: '167%', period: '4.5-7个月' },
        L4: { name: '年包服务', score: 0, cost: '年费12-18%', roi: '125-167%', period: '持续' },
        L5: { name: '国产替代', score: 0, cost: '100万+', roi: '150-200%', period: '6-8个月' }
      }
      
      // 评分逻辑
      if (budget === 'tight') {
        paths.L1.score += 30
        paths.L2.score += 20
      }
      if (faultFrequency === 'high') {
        paths.L3.score += 25
        paths.L4.score += 30
      }
      if (importDependency === 'high') {
        paths.L5.score += 35
      }
      if (targetCertainty === 'high') {
        paths.L4.score += 25
        paths.L5.score += 15
      }
      
      // 排序
      const sortedPaths = Object.entries(paths)
        .map(([key, value]) => ({ key, ...value }))
        .sort((a, b) => b.score - a.score)
      
      return {
        primaryPath: sortedPaths[0],
        alternativePaths: sortedPaths.slice(1, 3),
        reasoning: this.generatePathReasoning(sortedPaths[0], customerSituation),
        combinationRecommendation: this.suggestCombination(sortedPaths, customerSituation)
      }
    },

    // 生成路径推荐理由
    generatePathReasoning(path, situation) {
      const reasons = []
      
      if (path.key === 'L1' || path.key === 'L2') {
        reasons.push('预算有限，追求快速见效')
      }
      if (path.key === 'L3' || path.key === 'L4') {
        reasons.push('故障频繁，需要消除隐患')
      }
      if (path.key === 'L5') {
        reasons.push('进口依赖高，追求供应链安全')
      }
      if (path.key === 'L4') {
        reasons.push('追求成本确定性，风险转移')
      }
      
      return reasons.join('；')
    },

    // 推荐组合方案
    suggestCombination(paths, situation) {
      if (situation.targetCertainty === 'high') {
        return {
          recommended: ['L4', 'L5'],
          reasoning: '年包锁定成本 + 国产替代降本，双重保障',
          expectedROI: '150-208%',
          implementationPeriod: '6-12个月'
        }
      }
      return null
    }
  }
})
