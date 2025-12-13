import { defineStore } from 'pinia'

export const useToolDatabaseStore = defineStore('toolDatabase', {
  state: () => ({
    // 工具数据库
    tools: JSON.parse(localStorage.getItem('toolDatabase') || JSON.stringify([
      {
        id: 1,
        model: 'ETBP45-10',
        name: '电池油压脉冲定扭扳手',
        type: '普通型号',
        // 基本参数
        powerType: '锂电池', // 锂电池/有线电动
        torqueRange: { min: 25, max: 45, unit: 'Nm' },
        accuracy: '±10%',
        // 功能特性
        features: {
          dataCollection: false, // 数据采集
          processControl: false, // 过程控制
          okFeedback: false, // 合格型号反馈
          hasSensor: false, // 是否有传感器
          threadSearch: true, // 寻牙转速
          countingFunction: true, // 拧紧计数
          ledFeedback: true, // 机身红绿灯反馈
          torqueStop: true, // 定扭停拧
          wirelessComm: [], // 无线通讯：['蓝牙', 'WIFI']
          commProtocol: [] // 通讯协议：['TCP/IP', 'I/O', 'Openprotocol', 'RS232']
        },
        // 性能参数
        performance: {
          noLoadSpeed: { min: 3000, max: 4000, unit: 'rpm' }, // 空转速
          reactionForce: '无反力',
          weight: 1.8, // kg
          batteryCapacity: 4.0 // Ah
        },
        // 适用场景
        suitableFor: ['门盖工位', '轻量级装配', '手持操作'],
        // 价格和库存
        price: 12800,
        stock: 15,
        // 品牌和产地
        brand: '明升伟业',
        origin: '德国技术',
        // 图片
        image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400',
        // 备注
        notes: '适用于对精度要求不高，但需要快速装配的工位'
      },
      {
        id: 2,
        model: 'ETBP65-15-S',
        name: '电池油压脉冲定扭扳手（传感器版）',
        type: '高级型号',
        powerType: '锂电池',
        torqueRange: { min: 40, max: 65, unit: 'Nm' },
        accuracy: '±5%',
        features: {
          dataCollection: true,
          processControl: true,
          okFeedback: true,
          hasSensor: true,
          threadSearch: true,
          countingFunction: true,
          ledFeedback: true,
          torqueStop: true,
          wirelessComm: ['蓝牙', 'WIFI'],
          commProtocol: ['TCP/IP', 'Openprotocol', 'I/O']
        },
        performance: {
          noLoadSpeed: { min: 2800, max: 3500, unit: 'rpm' },
          reactionForce: '低反力',
          weight: 2.1,
          batteryCapacity: 5.0
        },
        suitableFor: ['底盘工位', '关键螺栓', '质量追溯'],
        price: 18900,
        stock: 8,
        brand: '明升伟业',
        origin: '德国技术',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
        notes: '带传感器，支持数据采集和质量追溯'
      },
      {
        id: 3,
        model: 'ETP80-20',
        name: '有线电动定扭扳手',
        type: '普通型号',
        powerType: '有线电动',
        torqueRange: { min: 50, max: 80, unit: 'Nm' },
        accuracy: '±8%',
        features: {
          dataCollection: false,
          processControl: false,
          okFeedback: false,
          hasSensor: false,
          threadSearch: true,
          countingFunction: true,
          ledFeedback: true,
          torqueStop: true,
          wirelessComm: [],
          commProtocol: ['I/O', 'RS232']
        },
        performance: {
          noLoadSpeed: { min: 2500, max: 3200, unit: 'rpm' },
          reactionForce: '中等反力',
          weight: 2.5,
          powerCable: '5米'
        },
        suitableFor: ['固定工位', '大扭矩装配', '连续作业'],
        price: 9800,
        stock: 20,
        brand: '明升伟业',
        origin: '欧洲技术',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400',
        notes: '有线供电，适合固定工位长时间作业'
      },
      {
        id: 4,
        model: 'ETBP35-8',
        name: '电池油压脉冲定扭扳手（轻量款）',
        type: '普通型号',
        powerType: '锂电池',
        torqueRange: { min: 20, max: 35, unit: 'Nm' },
        accuracy: '±12%',
        features: {
          dataCollection: false,
          processControl: false,
          okFeedback: false,
          hasSensor: false,
          threadSearch: true,
          countingFunction: true,
          ledFeedback: true,
          torqueStop: true,
          wirelessComm: [],
          commProtocol: []
        },
        performance: {
          noLoadSpeed: { min: 3500, max: 4500, unit: 'rpm' },
          reactionForce: '无反力',
          weight: 1.5,
          batteryCapacity: 3.0
        },
        suitableFor: ['内饰工位', '轻量级装配', '高频操作'],
        price: 10500,
        stock: 25,
        brand: '明升伟业',
        origin: '德国技术',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400',
        notes: '轻量化设计，适合高频率手持操作'
      },
      {
        id: 5,
        model: 'ETBP100-25-S',
        name: '电池油压脉冲定扭扳手（重载型）',
        type: '高级型号',
        powerType: '锂电池',
        torqueRange: { min: 70, max: 100, unit: 'Nm' },
        accuracy: '±5%',
        features: {
          dataCollection: true,
          processControl: true,
          okFeedback: true,
          hasSensor: true,
          threadSearch: true,
          countingFunction: true,
          ledFeedback: true,
          torqueStop: true,
          wirelessComm: ['蓝牙', 'WIFI'],
          commProtocol: ['TCP/IP', 'Openprotocol', 'I/O']
        },
        performance: {
          noLoadSpeed: { min: 2000, max: 2800, unit: 'rpm' },
          reactionForce: '低反力',
          weight: 2.8,
          batteryCapacity: 6.0
        },
        suitableFor: ['发动机工位', '关键螺栓', '重载装配'],
        price: 24500,
        stock: 5,
        brand: '明升伟业',
        origin: '德国技术',
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400',
        notes: '大扭矩，高精度，适合关键螺栓装配'
      }
    ])),
    
    // 搜索和筛选条件
    searchKeyword: '',
    filters: {
      powerType: '',
      hasDataCollection: null,
      hasSensor: null
    }
  }),

  getters: {
    // 获取筛选后的工具列表
    filteredTools: (state) => {
      let result = [...state.tools]
      
      // 关键词搜索
      if (state.searchKeyword) {
        const keyword = state.searchKeyword.toLowerCase()
        result = result.filter(tool => 
          tool.model.toLowerCase().includes(keyword) ||
          tool.name.toLowerCase().includes(keyword) ||
          tool.suitableFor.some(s => s.includes(keyword))
        )
      }
      
      // 动力形式筛选
      if (state.filters.powerType) {
        result = result.filter(tool => tool.powerType === state.filters.powerType)
      }
      
      // 数据采集筛选
      if (state.filters.hasDataCollection !== null) {
        result = result.filter(tool => tool.features.dataCollection === state.filters.hasDataCollection)
      }
      
      // 传感器筛选
      if (state.filters.hasSensor !== null) {
        result = result.filter(tool => tool.features.hasSensor === state.filters.hasSensor)
      }
      
      return result
    },

    // 根据ID获取工具
    getToolById: (state) => (id) => {
      return state.tools.find(tool => tool.id === id)
    },

    // 智能匹配工具
    matchTools: (state) => (requirements) => {
      const {
        powerType,
        torque,
        accuracy,
        needDataCollection,
        needProcessControl,
        needOkFeedback,
        needHighSpeed,
        needLowReaction
      } = requirements

      return state.tools.filter(tool => {
        // 动力形式匹配
        if (powerType && tool.powerType !== powerType) return false
        
        // 扭矩范围匹配（目标扭矩在工具范围内）
        if (torque && (torque < tool.torqueRange.min || torque > tool.torqueRange.max)) return false
        
        // 精度匹配（工具精度优于或等于要求）
        if (accuracy) {
          const toolAccuracy = parseFloat(tool.accuracy.replace(/[^0-9.]/g, ''))
          const reqAccuracy = parseFloat(accuracy.replace(/[^0-9.]/g, ''))
          if (toolAccuracy > reqAccuracy) return false
        }
        
        // 功能特性匹配
        if (needDataCollection && !tool.features.dataCollection) return false
        if (needProcessControl && !tool.features.processControl) return false
        if (needOkFeedback && !tool.features.okFeedback) return false
        
        // 性能匹配
        if (needHighSpeed) {
          const avgSpeed = (tool.performance.noLoadSpeed.min + tool.performance.noLoadSpeed.max) / 2
          if (avgSpeed < 3000) return false
        }
        
        if (needLowReaction && tool.performance.reactionForce !== '无反力' && tool.performance.reactionForce !== '低反力') {
          return false
        }
        
        return true
      })
    }
  },

  actions: {
    // 添加工具
    addTool(tool) {
      const newTool = {
        ...tool,
        id: Date.now()
      }
      this.tools.push(newTool)
      this.saveToLocalStorage()
      return newTool
    },

    // 更新工具
    updateTool(id, updatedTool) {
      const index = this.tools.findIndex(tool => tool.id === id)
      if (index !== -1) {
        this.tools[index] = { ...this.tools[index], ...updatedTool }
        this.saveToLocalStorage()
        return true
      }
      return false
    },

    // 删除工具
    deleteTool(id) {
      const index = this.tools.findIndex(tool => tool.id === id)
      if (index !== -1) {
        this.tools.splice(index, 1)
        this.saveToLocalStorage()
        return true
      }
      return false
    },

    // 批量导入工具
    importTools(toolsArray) {
      toolsArray.forEach(tool => {
        this.addTool(tool)
      })
    },

    // 保存到本地存储
    saveToLocalStorage() {
      localStorage.setItem('toolDatabase', JSON.stringify(this.tools))
    },

    // 设置搜索关键词
    setSearchKeyword(keyword) {
      this.searchKeyword = keyword
    },

    // 设置筛选条件
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },

    // 重置筛选
    resetFilters() {
      this.searchKeyword = ''
      this.filters = {
        powerType: '',
        hasDataCollection: null,
        hasSensor: null
      }
    }
  }
})
