import { defineStore } from 'pinia'

export const useProductionLineStore = defineStore('productionLine', {
  state: () => ({
    productionLines: []
  }),

  getters: {
    // 按类别分组的线体
    linesByCategory: (state) => {
      const grouped = {}
      state.productionLines.forEach(line => {
        if (!grouped[line.category]) {
          grouped[line.category] = []
        }
        grouped[line.category].push(line)
      })
      return grouped
    },

    // 获取所有线体名称（用于下拉菜单）
    lineNames: (state) => {
      return state.productionLines.map(line => line.name)
    }
  },

  actions: {
    // 加载线体列表
    loadProductionLines() {
      const saved = localStorage.getItem('productionLines')
      if (saved) {
        this.productionLines = JSON.parse(saved)
      } else {
        // 初始化默认数据
        this.productionLines = [
          {
            id: 1,
            name: '汽车总装线',
            category: '汽车行业',
            description: '整车总装配生产线',
            createTime: '2024-01-10 09:00:00'
          },
          {
            id: 2,
            name: '汽车焊装线',
            category: '汽车行业',
            description: '车身焊接生产线',
            createTime: '2024-01-10 09:05:00'
          },
          {
            id: 3,
            name: '汽车发动机线',
            category: '汽车行业',
            description: '发动机装配生产线',
            createTime: '2024-01-10 09:10:00'
          },
          {
            id: 4,
            name: '汽车变速器线',
            category: '汽车行业',
            description: '变速器装配生产线',
            createTime: '2024-01-10 09:15:00'
          },
          {
            id: 5,
            name: '汽车零部件线',
            category: '汽车行业',
            description: '汽车零部件装配生产线',
            createTime: '2024-01-10 09:20:00'
          },
          {
            id: 6,
            name: '铁路机车总装线',
            category: '铁路行业',
            description: '铁路机车整体装配生产线',
            createTime: '2024-01-10 09:25:00'
          },
          {
            id: 7,
            name: '铁路机车转向架线',
            category: '铁路行业',
            description: '转向架装配生产线',
            createTime: '2024-01-10 09:30:00'
          },
          {
            id: 8,
            name: '铁路机车刹车线',
            category: '铁路行业',
            description: '刹车系统装配生产线',
            createTime: '2024-01-10 09:35:00'
          },
          {
            id: 9,
            name: '工程机械总装线',
            category: '工程机械',
            description: '工程机械整体装配生产线',
            createTime: '2024-01-10 09:40:00'
          },
          {
            id: 10,
            name: '航空发动机总装线',
            category: '航空航天',
            description: '航空发动机装配生产线',
            createTime: '2024-01-10 09:45:00'
          },
          {
            id: 11,
            name: '电气装配线',
            category: '电气电子',
            description: '电气设备装配生产线',
            createTime: '2024-01-10 09:50:00'
          },
          {
            id: 12,
            name: '电子电器装配线',
            category: '电气电子',
            description: '电子电器装配生产线',
            createTime: '2024-01-10 09:55:00'
          },
          {
            id: 13,
            name: '能源动力装配线',
            category: '能源动力',
            description: '能源动力设备装配生产线',
            createTime: '2024-01-10 10:00:00'
          }
        ]
        this.saveProductionLines()
      }
    },

    // 保存到 localStorage
    saveProductionLines() {
      localStorage.setItem('productionLines', JSON.stringify(this.productionLines))
    },

    // 添加线体
    addProductionLine(data) {
      const newLine = {
        id: Date.now(),
        name: data.name,
        category: data.category,
        description: data.description || '',
        createTime: new Date().toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).replace(/\//g, '-')
      }
      this.productionLines.unshift(newLine)
      this.saveProductionLines()
      return newLine
    },

    // 更新线体
    updateProductionLine(id, data) {
      const index = this.productionLines.findIndex(line => line.id === id)
      if (index > -1) {
        this.productionLines[index] = {
          ...this.productionLines[index],
          name: data.name,
          category: data.category,
          description: data.description || ''
        }
        this.saveProductionLines()
        return this.productionLines[index]
      }
      return null
    },

    // 删除线体
    deleteProductionLine(id) {
      const index = this.productionLines.findIndex(line => line.id === id)
      if (index > -1) {
        this.productionLines.splice(index, 1)
        this.saveProductionLines()
        return true
      }
      return false
    },

    // 根据 ID 获取线体
    getProductionLineById(id) {
      return this.productionLines.find(line => line.id === id)
    },

    // 根据名称获取线体
    getProductionLineByName(name) {
      return this.productionLines.find(line => line.name === name)
    }
  }
})
