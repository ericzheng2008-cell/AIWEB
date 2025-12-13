import { defineStore } from 'pinia'

export const useDeviceStatusStore = defineStore('deviceStatus', {
  state: () => ({
    // 设备列表
    devices: [
      {
        id: 'DEV-001',
        name: '发动机装配工位-1号扳手',
        type: '电动扭矩扳手',
        brand: 'Atlas Copco',
        model: 'ETBP45-10',
        location: '车间A-工位01',
        status: 'online',
        healthScore: 95,
        runningHours: 2840,
        lastMaintenance: '2025-11-15',
        nextMaintenance: '2026-02-15',
        operator: '张三',
        torqueAccuracy: 98,
        batteryLevel: 85,
        temperature: 42,
        lastUpdate: '2025-12-13 14:30:25'
      },
      {
        id: 'DEV-002',
        name: '车轮装配工位-扳手',
        type: '气动冲击扳手',
        brand: 'Ingersoll Rand',
        model: 'W7150',
        location: '车间B-工位12',
        status: 'online',
        healthScore: 88,
        runningHours: 5230,
        lastMaintenance: '2025-10-20',
        nextMaintenance: '2026-01-20',
        operator: '李四',
        torqueAccuracy: 95,
        airPressure: 6.5,
        temperature: 38,
        lastUpdate: '2025-12-13 14:28:10'
      },
      {
        id: 'DEV-003',
        name: '电池包装配-扳手组',
        type: '电动扭矩扳手',
        brand: 'Bosch',
        model: 'GDS18V-200C',
        location: '车间C-工位05',
        status: 'warning',
        healthScore: 72,
        runningHours: 8450,
        lastMaintenance: '2025-09-10',
        nextMaintenance: '2025-12-10',
        operator: '王五',
        torqueAccuracy: 89,
        batteryLevel: 35,
        temperature: 58,
        lastUpdate: '2025-12-13 14:25:50',
        warnings: ['电池电量低', '温度偏高', '保养即将到期']
      },
      {
        id: 'DEV-004',
        name: '底盘装配工位-扳手',
        type: '电动扭矩扳手',
        brand: 'Atlas Copco',
        model: 'ETBP30-80',
        location: '车间A-工位15',
        status: 'offline',
        healthScore: 45,
        runningHours: 12300,
        lastMaintenance: '2025-08-05',
        nextMaintenance: '2025-11-05',
        operator: '-',
        torqueAccuracy: 0,
        batteryLevel: 0,
        temperature: 0,
        lastUpdate: '2025-12-12 18:30:00',
        faultType: '电池故障',
        faultDescription: '电池无法充电，需更换电池'
      },
      {
        id: 'DEV-005',
        name: '变速箱装配-扳手',
        type: '油压脉冲扳手',
        brand: 'Atlas Copco',
        model: 'HBP45-20',
        location: '车间B-工位08',
        status: 'online',
        healthScore: 92,
        runningHours: 3680,
        lastMaintenance: '2025-11-01',
        nextMaintenance: '2026-02-01',
        operator: '赵六',
        torqueAccuracy: 97,
        oilPressure: 210,
        temperature: 45,
        lastUpdate: '2025-12-13 14:29:45'
      },
      {
        id: 'DEV-006',
        name: '门盖装配工位-扳手',
        type: '电动扭矩扳手',
        brand: 'EQTCF',
        model: 'ETBP12-50',
        location: '车间A-工位08',
        status: 'maintenance',
        healthScore: 60,
        runningHours: 9800,
        lastMaintenance: '2025-12-11',
        nextMaintenance: '2026-03-11',
        operator: '-',
        torqueAccuracy: 0,
        batteryLevel: 0,
        temperature: 0,
        lastUpdate: '2025-12-11 09:00:00',
        maintenanceNote: '定期保养中，预计12月15日完成'
      }
    ],

    // 设备统计
    statistics: {
      total: 6,
      online: 3,
      offline: 1,
      warning: 1,
      maintenance: 1,
      avgHealthScore: 75,
      totalRunningHours: 42300
    }
  }),

  getters: {
    // 在线设备
    onlineDevices: (state) => {
      return state.devices.filter(d => d.status === 'online')
    },

    // 故障设备
    offlineDevices: (state) => {
      return state.devices.filter(d => d.status === 'offline')
    },

    // 预警设备
    warningDevices: (state) => {
      return state.devices.filter(d => d.status === 'warning')
    },

    // 维护中设备
    maintenanceDevices: (state) => {
      return state.devices.filter(d => d.status === 'maintenance')
    },

    // 按位置分组
    devicesByLocation: (state) => {
      const groups = {}
      state.devices.forEach(device => {
        const location = device.location.split('-')[0]
        if (!groups[location]) {
          groups[location] = []
        }
        groups[location].push(device)
      })
      return groups
    },

    // 按品牌分组
    devicesByBrand: (state) => {
      const groups = {}
      state.devices.forEach(device => {
        if (!groups[device.brand]) {
          groups[device.brand] = []
        }
        groups[device.brand].push(device)
      })
      return groups
    },

    // 健康度排序
    devicesByHealth: (state) => {
      return [...state.devices].sort((a, b) => a.healthScore - b.healthScore)
    },

    // 即将保养的设备（30天内）
    upcomingMaintenance: (state) => {
      const today = new Date()
      const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
      
      return state.devices.filter(device => {
        const nextDate = new Date(device.nextMaintenance)
        return nextDate >= today && nextDate <= thirtyDaysLater
      })
    }
  },

  actions: {
    // 搜索设备
    searchDevices(keyword) {
      if (!keyword) return this.devices
      
      const lowerKeyword = keyword.toLowerCase()
      return this.devices.filter(device => 
        device.name.toLowerCase().includes(lowerKeyword) ||
        device.id.toLowerCase().includes(lowerKeyword) ||
        device.location.toLowerCase().includes(lowerKeyword) ||
        device.model.toLowerCase().includes(lowerKeyword)
      )
    },

    // 按条件筛选设备
    filterDevices(filters) {
      let result = [...this.devices]

      if (filters.status) {
        result = result.filter(d => d.status === filters.status)
      }

      if (filters.location) {
        result = result.filter(d => d.location.includes(filters.location))
      }

      if (filters.brand) {
        result = result.filter(d => d.brand === filters.brand)
      }

      if (filters.healthMin !== undefined) {
        result = result.filter(d => d.healthScore >= filters.healthMin)
      }

      if (filters.healthMax !== undefined) {
        result = result.filter(d => d.healthScore <= filters.healthMax)
      }

      return result
    },

    // 获取设备详情
    getDeviceById(id) {
      return this.devices.find(d => d.id === id)
    },

    // 更新设备状态
    updateDeviceStatus(deviceId, newStatus) {
      const device = this.devices.find(d => d.id === deviceId)
      if (device) {
        device.status = newStatus
        device.lastUpdate = new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
        return true
      }
      return false
    },

    // 生成状态报告
    generateStatusReport() {
      const report = {
        timestamp: new Date().toLocaleString(),
        summary: {
          total: this.devices.length,
          online: this.onlineDevices.length,
          offline: this.offlineDevices.length,
          warning: this.warningDevices.length,
          maintenance: this.maintenanceDevices.length,
          avgHealth: Math.round(
            this.devices.reduce((sum, d) => sum + d.healthScore, 0) / this.devices.length
          )
        },
        details: this.devices.map(d => ({
          id: d.id,
          name: d.name,
          status: d.status,
          health: d.healthScore,
          location: d.location,
          lastUpdate: d.lastUpdate
        })),
        alerts: [
          ...this.offlineDevices.map(d => ({
            level: 'error',
            device: d.name,
            message: `设备离线: ${d.faultDescription || '未知故障'}`
          })),
          ...this.warningDevices.map(d => ({
            level: 'warning',
            device: d.name,
            message: `设备预警: ${d.warnings ? d.warnings.join(', ') : '需要关注'}`
          }))
        ]
      }
      
      return report
    }
  }
})
