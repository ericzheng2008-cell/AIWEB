import { defineStore } from 'pinia'

export const useToolBrandDatabaseStore = defineStore('toolBrandDatabase', {
  state: () => ({
    tools: [
      {
        id: 1,
        brand: 'EQTCF',
        toolType: '锂电池',
        controlType: '离合器',
        torqueRange: '1-5Nm',
        model: 'ETBP10-42',
        name: 'EQTCF锂电池离合器拧紧工具',
        description: '适用于低扭矩精密装配，锂电池供电，离合器控制',
        specifications: {
          power: '锂电池',
          control: '离合器',
          minTorque: 1,
          maxTorque: 5,
          unit: 'Nm',
          weight: '1.2kg',
          speed: '0-800 rpm'
        },
        features: {
          portable: true,
          adjustable: true,
          digital: false
        },
        applications: ['精密装配', '电子设备', '小型部件'],
        price: 3500,
        stock: 25,
        createdAt: '2025-12-13'
      },
      {
        id: 2,
        brand: '博世',
        toolType: '有线电动',
        controlType: '油压脉冲',
        torqueRange: '5-8Nm',
        model: 'GDS18V-200C',
        name: '博世有线电动油压脉冲工具',
        description: '适用于中等扭矩装配，有线供电稳定，油压脉冲控制',
        specifications: {
          power: '有线电动',
          control: '油压脉冲',
          minTorque: 5,
          maxTorque: 8,
          unit: 'Nm',
          weight: '1.8kg',
          speed: '0-1200 rpm',
          voltage: '220V'
        },
        features: {
          portable: false,
          adjustable: true,
          digital: true
        },
        applications: ['汽车装配', '机械装配', '中型部件'],
        price: 4800,
        stock: 18,
        createdAt: '2025-12-13'
      },
      {
        id: 3,
        brand: 'EQTCF',
        toolType: '锂电池',
        controlType: '电脉冲',
        torqueRange: '6-12Nm',
        model: 'ETBP12-50',
        name: 'EQTCF锂电池电脉冲拧紧工具',
        description: '适用于中等扭矩装配，锂电池供电，电脉冲精确控制',
        specifications: {
          power: '锂电池',
          control: '电脉冲',
          minTorque: 6,
          maxTorque: 12,
          unit: 'Nm',
          weight: '1.5kg',
          speed: '0-1000 rpm'
        },
        features: {
          portable: true,
          adjustable: true,
          digital: true
        },
        applications: ['汽车装配', '底盘装配', '中型部件'],
        price: 5200,
        stock: 20,
        createdAt: '2025-12-13'
      },
      {
        id: 4,
        brand: '博世',
        toolType: '有线电动',
        controlType: '直驱',
        torqueRange: '5-10Nm',
        model: 'GSR18V-190',
        name: '博世有线电动直驱拧紧工具',
        description: '适用于中等扭矩装配，有线供电，直驱快速响应',
        specifications: {
          power: '有线电动',
          control: '直驱',
          minTorque: 5,
          maxTorque: 10,
          unit: 'Nm',
          weight: '1.6kg',
          speed: '0-1500 rpm',
          voltage: '220V'
        },
        features: {
          portable: false,
          adjustable: true,
          digital: true
        },
        applications: ['通用装配', '快速装配', '中型部件'],
        price: 4200,
        stock: 22,
        createdAt: '2025-12-13'
      },
      {
        id: 5,
        brand: 'EQTCF',
        toolType: '有线电动',
        controlType: '油压脉冲',
        torqueRange: '20-30Nm',
        model: 'ETBP30-80',
        name: 'EQTCF有线电动油压脉冲工具',
        description: '适用于高扭矩装配，有线供电稳定，油压脉冲强力控制',
        specifications: {
          power: '有线电动',
          control: '油压脉冲',
          minTorque: 20,
          maxTorque: 30,
          unit: 'Nm',
          weight: '2.5kg',
          speed: '0-800 rpm',
          voltage: '220V'
        },
        features: {
          portable: false,
          adjustable: true,
          digital: true
        },
        applications: ['重型装配', '发动机装配', '大型部件'],
        price: 7800,
        stock: 12,
        createdAt: '2025-12-13'
      },
      {
        id: 6,
        brand: '博世',
        toolType: '锂电池',
        controlType: '电脉冲',
        torqueRange: '25-35Nm',
        model: 'GDS18V-1050',
        name: '博世锂电池电脉冲拧紧工具',
        description: '适用于高扭矩装配，锂电池高性能，电脉冲精确控制',
        specifications: {
          power: '锂电池',
          control: '电脉冲',
          minTorque: 25,
          maxTorque: 35,
          unit: 'Nm',
          weight: '2.2kg',
          speed: '0-900 rpm'
        },
        features: {
          portable: true,
          adjustable: true,
          digital: true
        },
        applications: ['重型装配', '悬挂系统', '大型部件'],
        price: 8500,
        stock: 15,
        createdAt: '2025-12-13'
      },
      {
        id: 7,
        brand: 'EQTCF',
        toolType: '有线电动',
        controlType: '直驱',
        torqueRange: '30-45Nm',
        model: 'ETBP45-100',
        name: 'EQTCF有线电动直驱重型工具',
        description: '适用于超高扭矩装配，有线供电强劲，直驱最大功率',
        specifications: {
          power: '有线电动',
          control: '直驱',
          minTorque: 30,
          maxTorque: 45,
          unit: 'Nm',
          weight: '3.0kg',
          speed: '0-700 rpm',
          voltage: '220V'
        },
        features: {
          portable: false,
          adjustable: true,
          digital: true
        },
        applications: ['超重型装配', '底盘总成', '超大型部件'],
        price: 9200,
        stock: 10,
        createdAt: '2025-12-13'
      }
    ],
    nextId: 8
  }),

  getters: {
    // 获取所有工具
    allTools: (state) => state.tools,

    // 根据ID获取工具
    getToolById: (state) => (id) => {
      return state.tools.find(tool => tool.id === id)
    },

    // 根据品牌筛选
    getToolsByBrand: (state) => (brand) => {
      return state.tools.filter(tool => tool.brand === brand)
    },

    // 根据工具类型筛选
    getToolsByToolType: (state) => (toolType) => {
      return state.tools.filter(tool => tool.toolType === toolType)
    },

    // 根据控制类型筛选
    getToolsByControlType: (state) => (controlType) => {
      return state.tools.filter(tool => tool.controlType === controlType)
    },

    // 根据扭矩范围筛选
    getToolsByTorqueRange: (state) => (torqueRange) => {
      return state.tools.filter(tool => tool.torqueRange === torqueRange)
    }
  },

  actions: {
    // 添加工具
    addTool(tool) {
      const newTool = {
        ...tool,
        id: this.nextId++,
        createdAt: new Date().toISOString().split('T')[0]
      }
      this.tools.push(newTool)
      return newTool
    },

    // 更新工具
    updateTool(id, updatedData) {
      const index = this.tools.findIndex(tool => tool.id === id)
      if (index !== -1) {
        this.tools[index] = {
          ...this.tools[index],
          ...updatedData
        }
        return this.tools[index]
      }
      return null
    },

    // 删除工具
    deleteTool(id) {
      const index = this.tools.findIndex(tool => tool.id === id)
      if (index !== -1) {
        this.tools.splice(index, 1)
        return true
      }
      return false
    },

    // 智能推荐工具
    recommendTools(criteria) {
      let matches = [...this.tools]

      // 品牌筛选
      if (criteria.brand && criteria.brand !== '全部') {
        matches = matches.filter(t => t.brand === criteria.brand)
      }

      // 工具类型筛选
      if (criteria.toolType) {
        matches = matches.filter(t => t.toolType === criteria.toolType)
      }

      // 控制类型筛选
      if (criteria.controlType) {
        matches = matches.filter(t => t.controlType === criteria.controlType)
      }

      // 扭矩范围筛选
      if (criteria.torqueRange) {
        matches = matches.filter(t => t.torqueRange === criteria.torqueRange)
      }

      // 扭矩需求筛选（根据具体扭矩值）
      if (criteria.requiredTorque) {
        const required = parseFloat(criteria.requiredTorque)
        matches = matches.filter(t => {
          return t.specifications.minTorque <= required && 
                 t.specifications.maxTorque >= required
        })
      }

      // 便携性要求
      if (criteria.portable !== undefined && criteria.portable !== null) {
        matches = matches.filter(t => t.features.portable === criteria.portable)
      }

      // 数字化要求
      if (criteria.digital !== undefined && criteria.digital !== null) {
        matches = matches.filter(t => t.features.digital === criteria.digital)
      }

      // 按匹配度排序
      matches = matches.sort((a, b) => {
        let scoreA = 0
        let scoreB = 0

        if (criteria.brand && a.brand === criteria.brand) scoreA += 10
        if (criteria.brand && b.brand === criteria.brand) scoreB += 10

        if (criteria.controlType && a.controlType === criteria.controlType) scoreA += 8
        if (criteria.controlType && b.controlType === criteria.controlType) scoreB += 8

        if (criteria.toolType && a.toolType === criteria.toolType) scoreA += 6
        if (criteria.toolType && b.toolType === criteria.toolType) scoreB += 6

        return scoreB - scoreA
      })

      return matches
    },

    // 批量导入工具
    importTools(toolsData) {
      toolsData.forEach(tool => {
        this.addTool(tool)
      })
    }
  }
})
