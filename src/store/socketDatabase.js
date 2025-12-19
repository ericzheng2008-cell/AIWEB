import { defineStore } from 'pinia'

export const useSocketDatabaseStore = defineStore('socketDatabase', {
  state: () => ({
    sockets: [
      {
        id: 1,
        brand: 'Atlascopco',
        toolType: '油压脉冲',
        squareSize: '3/8四方',
        toolModel: 'ETBP45-10',
        socketType: {
          shape: '标准',
          inputType: '外六角',
          inputSize: '15mm',
          magnetic: '固定磁'
        },
        features: {
          antiVibration: true,
          sealRingPin: false
        },
        model: 'AV315150MP',
        name: '抗振固定磁套筒',
        fullName: '抗振接杆固定磁套筒',
        description: '适用于电池/油压/脉冲工具，3/8四方输出头，外六角螺栓对边15mm',
        specifications: {
          inputEnd: '3/8四方',
          outputEnd: '外六角',
          size: '15mm',
          length: '150mm',
          magnetic: '固定磁',
          antiVibration: true
        },
        applications: ['门盖工位', '底盘装配', '发动机装配'],
        stock: 100,
        price: 85,
        createdAt: '2025-12-13'
      },
      {
        id: 2,
        brand: 'Atlascopco',
        toolType: '油压脉冲',
        squareSize: '3/8四方',
        toolModel: 'HBP45-20',
        socketType: {
          shape: '标准',
          inputType: '外六角',
          inputSize: '17mm',
          magnetic: '伸缩磁'
        },
        features: {
          antiVibration: true,
          sealRingPin: true
        },
        model: 'AV317170MS',
        name: '抗振伸缩磁套筒',
        fullName: '抗振标准伸缩磁套筒',
        description: '适用于油压工具，3/8四方输出头，外六角螺栓对边17mm，带密封圈销子',
        specifications: {
          inputEnd: '3/8四方',
          outputEnd: '外六角',
          size: '17mm',
          length: '70mm',
          magnetic: '伸缩磁',
          antiVibration: true,
          sealRingPin: true
        },
        applications: ['悬挂系统', '转向系统'],
        stock: 80,
        price: 95,
        createdAt: '2025-12-13'
      },
      {
        id: 3,
        brand: 'Atlascopco',
        toolType: '油压脉冲',
        squareSize: '1/2四方',
        toolModel: 'PTS50-30',
        socketType: {
          shape: '加长',
          inputType: '内六角',
          inputSize: '10mm',
          magnetic: '中空磁'
        },
        features: {
          antiVibration: false,
          sealRingPin: false
        },
        model: 'IS512100H',
        name: '加长中空磁套筒',
        fullName: '加长内六角中空磁套筒',
        description: '适用于脉冲工具，1/2四方输出头，内六角螺栓10mm',
        specifications: {
          inputEnd: '1/2四方',
          outputEnd: '内六角',
          size: '10mm',
          length: '150mm',
          magnetic: '中空磁',
          antiVibration: false
        },
        applications: ['深孔装配', '受限空间'],
        stock: 60,
        price: 120,
        createdAt: '2025-12-13'
      },
      {
        id: 4,
        brand: 'Atlascopco',
        toolType: '其他',
        squareSize: '1/4快换',
        toolModel: 'ETBP25-05',
        socketType: {
          shape: '标准',
          inputType: 'Torx',
          inputSize: 'T25',
          magnetic: '外置磁环'
        },
        features: {
          antiVibration: false,
          sealRingPin: false
        },
        model: 'TQ14T25EM',
        name: '快换Torx套筒',
        fullName: '快换外置磁环Torx套筒',
        description: '适用于电池工具，1/4快换接口，Torx T25',
        specifications: {
          inputEnd: '1/4快换',
          outputEnd: 'Torx',
          size: 'T25',
          length: '50mm',
          magnetic: '外置磁环',
          antiVibration: false
        },
        applications: ['电子设备装配', '精密件装配'],
        stock: 150,
        price: 45,
        createdAt: '2025-12-13'
      },
      {
        id: 5,
        brand: '其他',
        toolType: '其他',
        squareSize: '3/8四方',
        toolModel: 'ETBP35-08',
        socketType: {
          shape: '接杆',
          inputType: '外六角',
          inputSize: '12mm',
          magnetic: '固定磁'
        },
        features: {
          antiVibration: true,
          sealRingPin: true
        },
        model: 'EXT312120AV',
        name: '抗振接杆套筒',
        fullName: '抗振接杆固定磁套筒组',
        description: '适用于电池工具，3/8四方输出头，外六角12mm，带接杆延长',
        specifications: {
          inputEnd: '3/8四方',
          outputEnd: '外六角',
          size: '12mm',
          length: '200mm',
          magnetic: '固定磁',
          antiVibration: true,
          sealRingPin: true
        },
        applications: ['深孔装配', '延长操作'],
        stock: 45,
        price: 135,
        createdAt: '2025-12-13'
      }
    ],
    nextId: 6
  }),

  getters: {
    // 获取所有套筒
    allSockets: (state) => state.sockets,

    // 根据ID获取套筒
    getSocketById: (state) => (id) => {
      return state.sockets.find(socket => socket.id === id)
    },

    // 根据品牌筛选
    getSocketsByBrand: (state) => (brand) => {
      return state.sockets.filter(socket => socket.brand === brand)
    },

    // 根据工具类型筛选
    getSocketsByToolType: (state) => (toolType) => {
      return state.sockets.filter(socket => socket.toolType === toolType)
    }
  },

  actions: {
    // 添加套筒
    addSocket(socket) {
      const newSocket = {
        ...socket,
        id: this.nextId++,
        createdAt: new Date().toISOString().split('T')[0]
      }
      this.sockets.push(newSocket)
      return newSocket
    },

    // 更新套筒
    updateSocket(id, updatedData) {
      const index = this.sockets.findIndex(socket => socket.id === id)
      if (index !== -1) {
        this.sockets[index] = {
          ...this.sockets[index],
          ...updatedData
        }
        return this.sockets[index]
      }
      return null
    },

    // 删除套筒
    deleteSocket(id) {
      const index = this.sockets.findIndex(socket => socket.id === id)
      if (index !== -1) {
        this.sockets.splice(index, 1)
        return true
      }
      return false
    },

    // 智能推荐套筒
    recommendSockets(criteria) {
      let matches = [...this.sockets]

      // 品牌筛选
      if (criteria.brand && criteria.brand !== '全部') {
        matches = matches.filter(s => s.brand === criteria.brand)
      }

      // 工具类型筛选
      if (criteria.toolType) {
        matches = matches.filter(s => s.toolType === criteria.toolType)
      }

      // 四方尺寸筛选
      if (criteria.squareSize) {
        matches = matches.filter(s => s.squareSize === criteria.squareSize)
      }

      // 套筒外形筛选
      if (criteria.socketShape) {
        matches = matches.filter(s => s.socketType.shape === criteria.socketShape)
      }

      // 输入端类型筛选
      if (criteria.inputType) {
        matches = matches.filter(s => s.socketType.inputType === criteria.inputType)
      }

      // 输出端对边尺寸筛选
      if (criteria.inputSize) {
        matches = matches.filter(s => s.socketType.inputSize === criteria.inputSize)
      }

      // 磁性筛选
      if (criteria.magnetic) {
        matches = matches.filter(s => s.socketType.magnetic === criteria.magnetic)
      }

      // 长度筛选
      if (criteria.lengthRequirement) {
        const lengthNum = parseInt(criteria.lengthRequirement)
        if (!isNaN(lengthNum)) {
          matches = matches.filter(s => {
            const socketLength = parseInt(s.specifications.length)
            return socketLength >= lengthNum
          })
        }
      }

      // 抗振要求
      if (criteria.antiVibration) {
        matches = matches.filter(s => s.features.antiVibration === true)
      }

      // 密封圈销子要求
      if (criteria.sealRingPin) {
        matches = matches.filter(s => s.features.sealRingPin === true)
      }

      // 按匹配度排序（完全匹配优先）
      matches = matches.sort((a, b) => {
        let scoreA = 0
        let scoreB = 0

        if (criteria.brand && a.brand === criteria.brand) scoreA += 10
        if (criteria.brand && b.brand === criteria.brand) scoreB += 10

        if (criteria.toolType && a.toolType === criteria.toolType) scoreA += 8
        if (criteria.toolType && b.toolType === criteria.toolType) scoreB += 8

        if (criteria.inputType && a.socketType.inputType === criteria.inputType) scoreA += 6
        if (criteria.inputType && b.socketType.inputType === criteria.inputType) scoreB += 6

        return scoreB - scoreA
      })

      return matches
    },

    // 批量导入套筒
    importSockets(socketsData) {
      socketsData.forEach(socket => {
        this.addSocket(socket)
      })
    }
  }
})
