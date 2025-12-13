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
    }
  }
})
