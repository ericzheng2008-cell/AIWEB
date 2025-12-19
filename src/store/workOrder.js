import { defineStore } from 'pinia'

export const useWorkOrderStore = defineStore('workOrder', {
  state: () => ({
    // 工单列表
    workOrders: JSON.parse(localStorage.getItem('workOrders') || '[]'),
    
    // 工单状态选项
    statusOptions: [
      { value: 'waiting-disassembly', label: '等待拆检', color: '#909399' },
      { value: 'waiting-confirm', label: '等待确认维修', color: '#E6A23C' },
      { value: 'waiting-parts', label: '等待配件', color: '#F56C6C' },
      { value: 'waiting-assembly', label: '等待装配', color: '#409EFF' },
      { value: 'waiting-inspection', label: '等待检测验收', color: '#67C23A' },
      { value: 'in-delivery', label: '送货中', color: '#409EFF' },
      { value: 'delivered', label: '已交货', color: '#67C23A' },
      { value: 'cancelled', label: '已取消', color: '#909399' }
    ],
    
    // 配件物流状态选项
    partsStatusOptions: [
      { value: 'waiting-contract', label: '等待合同', color: '#909399' },
      { value: 'ordered', label: '已订货', color: '#E6A23C' },
      { value: 'in-transit', label: '物流中', color: '#409EFF' },
      { value: 'arrived', label: '已到货', color: '#67C23A' }
    ]
  }),

  getters: {
    // 根据工单号查询
    getOrderByNumber: (state) => (orderNumber) => {
      return state.workOrders.find(order => order.orderNumber === orderNumber)
    },
    
    // 根据手机号查询
    getOrdersByPhone: (state) => (phone) => {
      return state.workOrders.filter(order => order.contactPhone === phone)
    },
    
    // 获取状态标签
    getStatusLabel: (state) => (statusValue) => {
      const status = state.statusOptions.find(s => s.value === statusValue)
      return status ? status.label : statusValue
    },
    
    // 获取状态颜色
    getStatusColor: (state) => (statusValue) => {
      const status = state.statusOptions.find(s => s.value === statusValue)
      return status ? status.color : '#909399'
    },
    
    // 获取配件状态标签
    getPartsStatusLabel: (state) => (statusValue) => {
      const status = state.partsStatusOptions.find(s => s.value === statusValue)
      return status ? status.label : statusValue
    },
    
    // 获取配件状态颜色
    getPartsStatusColor: (state) => (statusValue) => {
      const status = state.partsStatusOptions.find(s => s.value === statusValue)
      return status ? status.color : '#909399'
    },
    
    // 统计各状态工单数量
    statusStatistics: (state) => {
      const stats = {}
      state.statusOptions.forEach(option => {
        stats[option.value] = state.workOrders.filter(
          order => order.status === option.value
        ).length
      })
      return stats
    }
  },

  actions: {
    // 创建工单
    createWorkOrder(orderData) {
      const newOrder = {
        id: Date.now().toString(),
        orderNumber: this.generateOrderNumber(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'waiting-disassembly',
        ...orderData,
        // 配件信息
        parts: orderData.parts || [],
        // 操作历史
        history: [{
          action: '创建工单',
          status: 'waiting-disassembly',
          operator: orderData.creator || '系统',
          timestamp: new Date().toISOString(),
          note: '工单创建成功'
        }]
      }
      
      this.workOrders.unshift(newOrder)
      this.saveToLocalStorage()
      return newOrder
    },
    
    // 更新工单状态
    updateOrderStatus(orderId, newStatus, note = '', operator = '系统') {
      const order = this.workOrders.find(o => o.id === orderId)
      if (!order) return false
      
      const oldStatus = order.status
      order.status = newStatus
      order.updatedAt = new Date().toISOString()
      
      // 添加历史记录
      order.history.push({
        action: '状态变更',
        oldStatus,
        newStatus,
        operator,
        timestamp: new Date().toISOString(),
        note
      })
      
      this.saveToLocalStorage()
      return true
    },
    
    // 更新配件状态
    updatePartsStatus(orderId, partIndex, newStatus, estimatedArrival = null) {
      const order = this.workOrders.find(o => o.id === orderId)
      if (!order || !order.parts || !order.parts[partIndex]) return false
      
      const part = order.parts[partIndex]
      const oldStatus = part.status
      part.status = newStatus
      part.updatedAt = new Date().toISOString()
      
      if (estimatedArrival) {
        part.estimatedArrival = estimatedArrival
      }
      
      // 添加配件历史
      if (!part.history) part.history = []
      part.history.push({
        action: '配件状态更新',
        oldStatus,
        newStatus,
        timestamp: new Date().toISOString(),
        estimatedArrival
      })
      
      order.updatedAt = new Date().toISOString()
      this.saveToLocalStorage()
      return true
    },
    
    // 添加配件
    addPart(orderId, partData) {
      const order = this.workOrders.find(o => o.id === orderId)
      if (!order) return false
      
      if (!order.parts) order.parts = []
      
      const newPart = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'waiting-contract',
        ...partData,
        history: [{
          action: '添加配件',
          status: 'waiting-contract',
          timestamp: new Date().toISOString()
        }]
      }
      
      order.parts.push(newPart)
      order.updatedAt = new Date().toISOString()
      
      // 添加工单历史
      order.history.push({
        action: '添加配件',
        operator: '系统',
        timestamp: new Date().toISOString(),
        note: `添加配件: ${partData.name}`
      })
      
      this.saveToLocalStorage()
      return true
    },
    
    // 生成工单号
    generateOrderNumber() {
      const date = new Date()
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
      return `WO${year}${month}${day}${random}`
    },
    
    // 删除工单
    deleteOrder(orderId) {
      const index = this.workOrders.findIndex(o => o.id === orderId)
      if (index > -1) {
        this.workOrders.splice(index, 1)
        this.saveToLocalStorage()
        return true
      }
      return false
    },
    
    // 保存到 localStorage
    saveToLocalStorage() {
      localStorage.setItem('workOrders', JSON.stringify(this.workOrders))
    },
    
    // 初始化示例数据
    initDemoData() {
      if (this.workOrders.length > 0) return
      
      const demoOrders = [
        {
          id: '1',
          orderNumber: 'WO202412170001',
          customerName: '张三',
          contactPhone: '13800138001',
          deviceModel: 'AT-3000 拧紧机',
          deviceSN: 'SN20231001',
          faultDescription: '扭矩输出不稳定，数据采集异常',
          status: 'waiting-parts',
          createdAt: '2024-12-10T10:00:00.000Z',
          updatedAt: '2024-12-15T14:30:00.000Z',
          estimatedCompletion: '2024-12-20',
          parts: [
            {
              id: 'p1',
              name: '扭矩传感器',
              partNumber: 'TS-001',
              quantity: 1,
              status: 'in-transit',
              estimatedArrival: '2024-12-18',
              supplier: '德国博世',
              orderDate: '2024-12-12',
              trackingNumber: 'SF1234567890',
              history: [
                { action: '添加配件', status: 'waiting-contract', timestamp: '2024-12-11T09:00:00.000Z' },
                { action: '配件状态更新', oldStatus: 'waiting-contract', newStatus: 'ordered', timestamp: '2024-12-12T10:00:00.000Z' },
                { action: '配件状态更新', oldStatus: 'ordered', newStatus: 'in-transit', timestamp: '2024-12-13T15:00:00.000Z', estimatedArrival: '2024-12-18' }
              ]
            },
            {
              id: 'p2',
              name: '数据采集模块',
              partNumber: 'DAQ-002',
              quantity: 1,
              status: 'ordered',
              estimatedArrival: '2024-12-19',
              supplier: '上海安彤',
              orderDate: '2024-12-13',
              history: [
                { action: '添加配件', status: 'waiting-contract', timestamp: '2024-12-11T09:00:00.000Z' },
                { action: '配件状态更新', oldStatus: 'waiting-contract', newStatus: 'ordered', timestamp: '2024-12-13T11:00:00.000Z', estimatedArrival: '2024-12-19' }
              ]
            }
          ],
          history: [
            { action: '创建工单', status: 'waiting-disassembly', operator: '李维修', timestamp: '2024-12-10T10:00:00.000Z', note: '工单创建成功' },
            { action: '状态变更', oldStatus: 'waiting-disassembly', newStatus: 'waiting-confirm', operator: '李维修', timestamp: '2024-12-11T08:30:00.000Z', note: '拆检完成，发现扭矩传感器和数据采集模块故障' },
            { action: '状态变更', oldStatus: 'waiting-confirm', newStatus: 'waiting-parts', operator: '王工程师', timestamp: '2024-12-11T14:00:00.000Z', note: '客户确认维修方案，等待配件到货' },
            { action: '添加配件', operator: '系统', timestamp: '2024-12-11T14:10:00.000Z', note: '添加配件: 扭矩传感器' },
            { action: '添加配件', operator: '系统', timestamp: '2024-12-11T14:11:00.000Z', note: '添加配件: 数据采集模块' }
          ]
        },
        {
          id: '2',
          orderNumber: 'WO202412170002',
          customerName: '李四',
          contactPhone: '13900139002',
          deviceModel: 'AT-5000 智能拧紧系统',
          deviceSN: 'SN20231102',
          faultDescription: '控制面板无显示',
          status: 'waiting-assembly',
          createdAt: '2024-12-12T09:00:00.000Z',
          updatedAt: '2024-12-16T16:00:00.000Z',
          estimatedCompletion: '2024-12-18',
          parts: [
            {
              id: 'p3',
              name: '液晶显示屏',
              partNumber: 'LCD-003',
              quantity: 1,
              status: 'arrived',
              estimatedArrival: '2024-12-15',
              actualArrival: '2024-12-15',
              supplier: '京东方',
              orderDate: '2024-12-13',
              trackingNumber: 'YTO9876543210',
              history: [
                { action: '添加配件', status: 'waiting-contract', timestamp: '2024-12-12T14:00:00.000Z' },
                { action: '配件状态更新', oldStatus: 'waiting-contract', newStatus: 'ordered', timestamp: '2024-12-13T09:00:00.000Z', estimatedArrival: '2024-12-15' },
                { action: '配件状态更新', oldStatus: 'ordered', newStatus: 'in-transit', timestamp: '2024-12-14T10:00:00.000Z' },
                { action: '配件状态更新', oldStatus: 'in-transit', newStatus: 'arrived', timestamp: '2024-12-15T14:00:00.000Z' }
              ]
            }
          ],
          history: [
            { action: '创建工单', status: 'waiting-disassembly', operator: '赵技师', timestamp: '2024-12-12T09:00:00.000Z', note: '工单创建成功' },
            { action: '状态变更', oldStatus: 'waiting-disassembly', newStatus: 'waiting-confirm', operator: '赵技师', timestamp: '2024-12-12T11:00:00.000Z', note: '检查发现液晶屏损坏' },
            { action: '状态变更', oldStatus: 'waiting-confirm', newStatus: 'waiting-parts', operator: '客服', timestamp: '2024-12-12T13:30:00.000Z', note: '客户同意更换液晶屏' },
            { action: '添加配件', operator: '系统', timestamp: '2024-12-12T14:00:00.000Z', note: '添加配件: 液晶显示屏' },
            { action: '状态变更', oldStatus: 'waiting-parts', newStatus: 'waiting-assembly', operator: '赵技师', timestamp: '2024-12-16T16:00:00.000Z', note: '配件已到货，准备装配' }
          ]
        },
        {
          id: '3',
          orderNumber: 'WO202412170003',
          customerName: '王五',
          contactPhone: '13700137003',
          deviceModel: 'AT-2000 手持拧紧机',
          deviceSN: 'SN20231203',
          faultDescription: '电池续航时间短',
          status: 'delivered',
          createdAt: '2024-12-08T08:00:00.000Z',
          updatedAt: '2024-12-16T10:00:00.000Z',
          estimatedCompletion: '2024-12-15',
          actualCompletion: '2024-12-16',
          parts: [
            {
              id: 'p4',
              name: '锂电池组',
              partNumber: 'BAT-004',
              quantity: 1,
              status: 'arrived',
              estimatedArrival: '2024-12-10',
              actualArrival: '2024-12-10',
              supplier: '宁德时代',
              orderDate: '2024-12-09',
              history: [
                { action: '添加配件', status: 'waiting-contract', timestamp: '2024-12-08T15:00:00.000Z' },
                { action: '配件状态更新', oldStatus: 'waiting-contract', newStatus: 'ordered', timestamp: '2024-12-09T09:00:00.000Z', estimatedArrival: '2024-12-10' },
                { action: '配件状态更新', oldStatus: 'ordered', newStatus: 'in-transit', timestamp: '2024-12-09T14:00:00.000Z' },
                { action: '配件状态更新', oldStatus: 'in-transit', newStatus: 'arrived', timestamp: '2024-12-10T11:00:00.000Z' }
              ]
            }
          ],
          deliveryInfo: {
            deliveryDate: '2024-12-16',
            deliveryPerson: '快递员小张',
            trackingNumber: 'JD1234567890',
            recipientName: '王五',
            recipientPhone: '13700137003'
          },
          history: [
            { action: '创建工单', status: 'waiting-disassembly', operator: '孙工', timestamp: '2024-12-08T08:00:00.000Z', note: '工单创建成功' },
            { action: '状态变更', oldStatus: 'waiting-disassembly', newStatus: 'waiting-confirm', operator: '孙工', timestamp: '2024-12-08T10:00:00.000Z', note: '电池老化，需更换' },
            { action: '状态变更', oldStatus: 'waiting-confirm', newStatus: 'waiting-parts', operator: '客服', timestamp: '2024-12-08T14:00:00.000Z', note: '客户确认更换电池' },
            { action: '添加配件', operator: '系统', timestamp: '2024-12-08T15:00:00.000Z', note: '添加配件: 锂电池组' },
            { action: '状态变更', oldStatus: 'waiting-parts', newStatus: 'waiting-assembly', operator: '孙工', timestamp: '2024-12-11T09:00:00.000Z', note: '配件到货，开始装配' },
            { action: '状态变更', oldStatus: 'waiting-assembly', newStatus: 'waiting-inspection', operator: '孙工', timestamp: '2024-12-12T15:00:00.000Z', note: '装配完成，等待质检' },
            { action: '状态变更', oldStatus: 'waiting-inspection', newStatus: 'in-delivery', operator: '质检员', timestamp: '2024-12-13T10:00:00.000Z', note: '质检通过，准备发货' },
            { action: '状态变更', oldStatus: 'in-delivery', newStatus: 'delivered', operator: '物流', timestamp: '2024-12-16T10:00:00.000Z', note: '设备已送达客户' }
          ]
        }
      ]
      
      this.workOrders = demoOrders
      this.saveToLocalStorage()
    }
  }
})
