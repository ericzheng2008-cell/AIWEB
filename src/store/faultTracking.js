import { defineStore } from 'pinia'
import { useEquipmentLifecycleStore } from './equipmentLifecycle'

export const useFaultTrackingStore = defineStore('faultTracking', {
  state: () => ({
    // 维修工单列表
    workOrders: [
      {
        id: 'WO-2025-001',
        deviceId: 'DEV-004',
        deviceName: '底盘装配工位-扳手',
        deviceModel: 'ETBP30-80',
        location: '车间A-工位15',
        faultType: '电池故障',
        faultLevel: 'critical', // critical高危, serious严重, normal一般, minor轻微
        faultDescription: '电池无法充电，设备无法启动',
        faultTime: '2025-12-12 18:30:00',
        reportedBy: '张三',
        reportedTime: '2025-12-12 18:35:00',
        status: 'pending', // pending待处理, assigned已分配, in_progress维修中, resolved已解决, closed已关闭
        priority: 'high', // high高, medium中, low低
        assignedTo: null,
        assignedTime: null,
        startTime: null,
        resolvedTime: null,
        closedTime: null,
        estimatedTime: '2小时',
        actualTime: null,
        maintenancePlan: '',
        maintenanceLog: [],
        spareParts: [],
        totalCost: 0,
        notes: '',
        attachments: [],
        // 新增客户信息字段
        customerName: '张三',
        customerPhone: '138-1234-5678',
        customerCompany: '某汽车制造厂',
        // 新增人员信息字段
        deviceDepartment: '生产一部',
        deviceManagerName: '王经理',
        deviceManagerPhone: '138-8888-1001',
        repairPersonName: null,
        repairPersonPhone: null,
        supplierPersonName: null,
        supplierPersonPhone: null,
        // 新增服务状态跟踪
        serviceStatus: 'pending', // pending待服务, diagnosing诊断中, repairing维修中, testing测试中, completed已完成
        // 新增配件订购状态
        partsOrderStatus: 'not_required', // not_required无需配件, pending待订购, ordered已订购, in_transit运输中, received已到货
        partsOrderDetails: null,
        // 新增检测结果
        inspectionResult: null,
        inspectionTime: null,
        inspectionBy: null,
        // 新增交付验收信息
        deliveryStatus: 'not_delivered', // not_delivered未交付, delivered已交付, accepted已验收
        deliveryTime: null,
        deliveryBy: null,
        acceptanceStatus: 'not_accepted', // not_accepted未验收, accepted已验收, rejected已拒绝
        acceptanceTime: null,
        acceptanceBy: null,
        acceptanceNotes: null,
        createdAt: '2025-12-12 18:35:00',
        updatedAt: '2025-12-12 18:35:00'
      },
      {
        id: 'WO-2025-002',
        deviceId: 'DEV-003',
        deviceName: '电池包装配-扳手组',
        deviceModel: 'GDS18V-200C',
        location: '车间C-工位05',
        faultType: '温度异常',
        faultLevel: 'serious',
        faultDescription: '设备运行温度持续偏高（58℃），超过安全阈值',
        faultTime: '2025-12-13 10:20:00',
        reportedBy: '王五',
        reportedTime: '2025-12-13 10:25:00',
        status: 'assigned',
        priority: 'high',
        assignedTo: '维修组-李工',
        assignedTime: '2025-12-13 10:30:00',
        startTime: null,
        resolvedTime: null,
        closedTime: null,
        estimatedTime: '3小时',
        actualTime: null,
        maintenancePlan: '1. 检查散热系统\n2. 检查电机运行状态\n3. 清洁内部灰尘',
        maintenanceLog: [
          {
            time: '2025-12-13 10:30:00',
            operator: '李工',
            action: '接受工单',
            details: '已查看工单详情，预计今日14:00开始维修'
          }
        ],
        spareParts: [],
        totalCost: 0,
        notes: '',
        attachments: [],
        // 新增客户信息字段
        customerName: '王五',
        customerPhone: '139-8888-2002',
        customerCompany: '某汽车制造厂',
        // 新增人员信息字段
        deviceDepartment: '生产三部',
        deviceManagerName: '刘主管',
        deviceManagerPhone: '138-8888-3005',
        repairPersonName: '李工',
        repairPersonPhone: '139-7777-2001',
        supplierPersonName: null,
        supplierPersonPhone: null,
        // 新增服务状态跟踪
        serviceStatus: 'diagnosing',
        // 新增配件订购状态
        partsOrderStatus: 'not_required',
        partsOrderDetails: null,
        // 新增检测结果
        inspectionResult: null,
        inspectionTime: null,
        inspectionBy: null,
        // 新增交付验收信息
        deliveryStatus: 'not_delivered',
        deliveryTime: null,
        deliveryBy: null,
        acceptanceStatus: 'not_accepted',
        acceptanceTime: null,
        acceptanceBy: null,
        acceptanceNotes: null,
        createdAt: '2025-12-13 10:25:00',
        updatedAt: '2025-12-13 10:30:00'
      },
      {
        id: 'WO-2025-003',
        deviceId: 'DEV-006',
        deviceName: '门盖装配工位-扳手',
        deviceModel: 'ETBP12-50',
        location: '车间A-工位08',
        faultType: '定期保养',
        faultLevel: 'normal',
        faultDescription: '设备已运行9800小时，需进行定期保养',
        faultTime: '2025-12-11 08:00:00',
        reportedBy: '系统自动',
        reportedTime: '2025-12-11 08:00:00',
        status: 'in_progress',
        priority: 'medium',
        assignedTo: '维修组-张工',
        assignedTime: '2025-12-11 08:10:00',
        startTime: '2025-12-11 09:00:00',
        resolvedTime: null,
        closedTime: null,
        estimatedTime: '4小时',
        actualTime: null,
        maintenancePlan: '1. 更换润滑油\n2. 检查各部件磨损情况\n3. 校准扭矩传感器\n4. 清洁设备\n5. 功能测试',
        maintenanceLog: [
          {
            time: '2025-12-11 08:10:00',
            operator: '张工',
            action: '接受工单',
            details: '已安排保养计划'
          },
          {
            time: '2025-12-11 09:00:00',
            operator: '张工',
            action: '开始维修',
            details: '开始定期保养作业'
          },
          {
            time: '2025-12-11 10:30:00',
            operator: '张工',
            action: '更换部件',
            details: '已更换润滑油，型号：MobilGear 600 XP 220'
          },
          {
            time: '2025-12-11 11:45:00',
            operator: '张工',
            action: '检查进度',
            details: '各部件磨损正常，扭矩传感器校准完成'
          }
        ],
        spareParts: [
          { name: '润滑油 MobilGear 600 XP 220', quantity: 1, unit: '瓶', price: 180 }
        ],
        totalCost: 180,
        notes: '预计12月15日完成',
        attachments: [],
        // 新增客户信息字段
        customerName: '赵六',
        customerPhone: '137-9999-3003',
        customerCompany: '某汽车制造厂',
        // 新增人员信息字段
        deviceDepartment: '生产一部',
        deviceManagerName: '王经理',
        deviceManagerPhone: '138-8888-1008',
        repairPersonName: '张工',
        repairPersonPhone: '139-7777-2002',
        supplierPersonName: '博世服务-赵工',
        supplierPersonPhone: '400-820-2345',
        // 新增服务状态跟踪
        serviceStatus: 'repairing',
        // 新增配件订购状态
        partsOrderStatus: 'received',
        partsOrderDetails: '润滑油已到货，型号MobilGear 600 XP 220',
        // 新增检测结果
        inspectionResult: '设备运行正常，各部件磨损在合理范围内',
        inspectionTime: '2025-12-11 11:45:00',
        inspectionBy: '张工',
        // 新增交付验收信息
        deliveryStatus: 'not_delivered',
        deliveryTime: null,
        deliveryBy: null,
        acceptanceStatus: 'not_accepted',
        acceptanceTime: null,
        acceptanceBy: null,
        acceptanceNotes: null,
        createdAt: '2025-12-11 08:00:00',
        updatedAt: '2025-12-11 11:45:00'
      },
      {
        id: 'WO-2025-004',
        deviceId: 'DEV-002',
        deviceName: '车轮装配工位-扳手',
        deviceModel: 'W7150',
        location: '车间B-工位12',
        faultType: '扭矩精度下降',
        faultLevel: 'normal',
        faultDescription: '扭矩精度从98%降至95%，需要校准',
        faultTime: '2025-12-10 15:30:00',
        reportedBy: '李四',
        reportedTime: '2025-12-10 15:35:00',
        status: 'resolved',
        priority: 'medium',
        assignedTo: '维修组-王工',
        assignedTime: '2025-12-10 15:40:00',
        startTime: '2025-12-10 16:00:00',
        resolvedTime: '2025-12-10 17:20:00',
        closedTime: null,
        estimatedTime: '1.5小时',
        actualTime: '1小时20分钟',
        maintenancePlan: '1. 校准扭矩传感器\n2. 检查气压稳定性\n3. 功能测试',
        maintenanceLog: [
          {
            time: '2025-12-10 15:40:00',
            operator: '王工',
            action: '接受工单',
            details: '已接受工单'
          },
          {
            time: '2025-12-10 16:00:00',
            operator: '王工',
            action: '开始维修',
            details: '开始扭矩传感器校准'
          },
          {
            time: '2025-12-10 16:45:00',
            operator: '王工',
            action: '问题诊断',
            details: '发现气压波动，已调整气压调节器'
          },
          {
            time: '2025-12-10 17:20:00',
            operator: '王工',
            action: '完成维修',
            details: '校准完成，扭矩精度恢复至98%，测试通过'
          }
        ],
        spareParts: [],
        totalCost: 0,
        notes: '建议每月检查气压系统',
        attachments: [],
        // 新增客户信息字段
        customerName: '李四',
        customerPhone: '136-7777-4004',
        customerCompany: '某汽车制造厂',
        // 新增人员信息字段
        deviceDepartment: '生产二部',
        deviceManagerName: '陈主任',
        deviceManagerPhone: '138-8888-2012',
        repairPersonName: '王工',
        repairPersonPhone: '139-7777-2003',
        supplierPersonName: null,
        supplierPersonPhone: null,
        // 新增服务状态跟踪
        serviceStatus: 'completed',
        // 新增配件订购状态
        partsOrderStatus: 'not_required',
        partsOrderDetails: null,
        // 新增检测结果
        inspectionResult: '扭矩精度恢复至98%，气压系统稳定，测试通过',
        inspectionTime: '2025-12-10 17:20:00',
        inspectionBy: '王工',
        // 新增交付验收信息
        deliveryStatus: 'delivered',
        deliveryTime: '2025-12-10 17:30:00',
        deliveryBy: '王工',
        acceptanceStatus: 'not_accepted',
        acceptanceTime: null,
        acceptanceBy: null,
        acceptanceNotes: null,
        createdAt: '2025-12-10 15:35:00',
        updatedAt: '2025-12-10 17:20:00'
      },
      {
        id: 'WO-2025-005',
        deviceId: 'DEV-001',
        deviceName: '发动机装配工位-1号扳手',
        deviceModel: 'ETBP45-10',
        location: '车间A-工位01',
        faultType: '通讯故障',
        faultLevel: 'minor',
        faultDescription: '设备与MES系统通讯间歇性中断',
        faultTime: '2025-12-09 09:15:00',
        reportedBy: '张三',
        reportedTime: '2025-12-09 09:20:00',
        status: 'closed',
        priority: 'low',
        assignedTo: '维修组-赵工',
        assignedTime: '2025-12-09 09:30:00',
        startTime: '2025-12-09 10:00:00',
        resolvedTime: '2025-12-09 10:45:00',
        closedTime: '2025-12-09 14:00:00',
        estimatedTime: '1小时',
        actualTime: '45分钟',
        maintenancePlan: '1. 检查网络连接\n2. 检查通讯模块\n3. 测试通讯稳定性',
        maintenanceLog: [
          {
            time: '2025-12-09 09:30:00',
            operator: '赵工',
            action: '接受工单',
            details: '已接受工单'
          },
          {
            time: '2025-12-09 10:00:00',
            operator: '赵工',
            action: '开始维修',
            details: '开始排查通讯问题'
          },
          {
            time: '2025-12-09 10:30:00',
            operator: '赵工',
            action: '问题诊断',
            details: '发现网线松动，已重新连接并更换网线'
          },
          {
            time: '2025-12-09 10:45:00',
            operator: '赵工',
            action: '完成维修',
            details: '通讯恢复正常，测试稳定'
          },
          {
            time: '2025-12-09 14:00:00',
            operator: '张三',
            action: '验收通过',
            details: '确认设备运行正常，工单关闭'
          }
        ],
        spareParts: [
          { name: '六类网线 2米', quantity: 1, unit: '根', price: 15 }
        ],
        totalCost: 15,
        notes: '已关闭',
        attachments: [],
        // 新增客户信息字段
        customerName: '张三',
        customerPhone: '138-1234-5678',
        customerCompany: '某汽车制造厂',
        // 新增人员信息字段
        deviceDepartment: '生产一部',
        deviceManagerName: '王经理',
        deviceManagerPhone: '138-8888-1001',
        repairPersonName: '赵工',
        repairPersonPhone: '139-7777-2004',
        supplierPersonName: 'Atlas服务-孙工',
        supplierPersonPhone: '400-820-6789',
        // 新增服务状态跟踪
        serviceStatus: 'completed',
        // 新增配件订购状态
        partsOrderStatus: 'received',
        partsOrderDetails: '六类网线已使用',
        // 新增检测结果
        inspectionResult: '通讯恢复正常，连续测试3小时无中断',
        inspectionTime: '2025-12-09 10:45:00',
        inspectionBy: '赵工',
        // 新增交付验收信息
        deliveryStatus: 'delivered',
        deliveryTime: '2025-12-09 11:00:00',
        deliveryBy: '赵工',
        acceptanceStatus: 'accepted',
        acceptanceTime: '2025-12-09 14:00:00',
        acceptanceBy: '张三',
        acceptanceNotes: '设备运行正常，验收通过',
        createdAt: '2025-12-09 09:20:00',
        updatedAt: '2025-12-09 14:00:00'
      }
    ],

    // 维修人员列表
    technicians: [
      { id: 'TECH-001', name: '李工', skills: ['电动工具', '传感器校准', '电气系统'], workload: 2, phone: '138****1001' },
      { id: 'TECH-002', name: '张工', skills: ['机械维修', '定期保养', '故障诊断'], workload: 1, phone: '138****1002' },
      { id: 'TECH-003', name: '王工', skills: ['气动工具', '液压系统', '扭矩校准'], workload: 1, phone: '138****1003' },
      { id: 'TECH-004', name: '赵工', skills: ['网络通讯', '控制系统', '软件调试'], workload: 0, phone: '138****1004' }
    ],

    // 故障类型统计
    faultTypeStats: {
      '电池故障': 1,
      '温度异常': 1,
      '定期保养': 1,
      '扭矩精度下降': 1,
      '通讯故障': 1
    },

    // 工单状态统计
    statusStats: {
      pending: 1,
      assigned: 1,
      in_progress: 1,
      resolved: 1,
      closed: 1
    }
  }),

  getters: {
    // 待处理工单
    pendingOrders: (state) => {
      return state.workOrders.filter(o => o.status === 'pending')
    },

    // 进行中工单
    activeOrders: (state) => {
      return state.workOrders.filter(o => ['assigned', 'in_progress'].includes(o.status))
    },

    // 已完成工单
    completedOrders: (state) => {
      return state.workOrders.filter(o => ['resolved', 'closed'].includes(o.status))
    },

    // 高优先级工单
    highPriorityOrders: (state) => {
      return state.workOrders.filter(o => o.priority === 'high' && !['resolved', 'closed'].includes(o.status))
    },

    // 超时工单（预估时间已过但未解决）
    overdueOrders: (state) => {
      const now = new Date()
      return state.workOrders.filter(o => {
        if (['resolved', 'closed'].includes(o.status)) return false
        if (!o.startTime) return false
        
        const start = new Date(o.startTime)
        const estimatedHours = parseFloat(o.estimatedTime)
        const deadline = new Date(start.getTime() + estimatedHours * 60 * 60 * 1000)
        
        return now > deadline
      })
    },

    // 按设备分组的工单
    ordersByDevice: (state) => {
      const groups = {}
      state.workOrders.forEach(order => {
        if (!groups[order.deviceId]) {
          groups[order.deviceId] = []
        }
        groups[order.deviceId].push(order)
      })
      return groups
    },

    // 按维修人员分组的工单
    ordersByTechnician: (state) => {
      const groups = {}
      state.workOrders.forEach(order => {
        if (order.assignedTo) {
          if (!groups[order.assignedTo]) {
            groups[order.assignedTo] = []
          }
          groups[order.assignedTo].push(order)
        }
      })
      return groups
    },

    // 故障率统计（按设备）
    deviceFaultRate: (state) => {
      const deviceStats = {}
      state.workOrders.forEach(order => {
        if (!deviceStats[order.deviceId]) {
          deviceStats[order.deviceId] = {
            deviceId: order.deviceId,
            deviceName: order.deviceName,
            totalFaults: 0,
            criticalFaults: 0,
            seriousFaults: 0,
            avgRepairTime: 0,
            totalCost: 0
          }
        }
        
        deviceStats[order.deviceId].totalFaults++
        if (order.faultLevel === 'critical') deviceStats[order.deviceId].criticalFaults++
        if (order.faultLevel === 'serious') deviceStats[order.deviceId].seriousFaults++
        deviceStats[order.deviceId].totalCost += order.totalCost
      })
      
      return Object.values(deviceStats)
    },

    // 平均维修时间
    avgRepairTime: (state) => {
      const completed = state.workOrders.filter(o => o.actualTime)
      if (completed.length === 0) return 0
      
      const totalMinutes = completed.reduce((sum, o) => {
        const time = o.actualTime
        const match = time.match(/(\d+)小时|(\d+)分钟/)
        if (!match) return sum
        
        const hours = match[1] ? parseInt(match[1]) : 0
        const minutes = match[2] ? parseInt(match[2]) : 0
        return sum + hours * 60 + minutes
      }, 0)
      
      return Math.round(totalMinutes / completed.length)
    },

    // 本周工单统计
    weeklyStats: (state) => {
      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      
      const weeklyOrders = state.workOrders.filter(o => {
        const created = new Date(o.createdAt)
        return created >= weekAgo && created <= now
      })
      
      return {
        total: weeklyOrders.length,
        completed: weeklyOrders.filter(o => ['resolved', 'closed'].includes(o.status)).length,
        inProgress: weeklyOrders.filter(o => ['assigned', 'in_progress'].includes(o.status)).length,
        pending: weeklyOrders.filter(o => o.status === 'pending').length
      }
    }
  },

  actions: {
    // 创建工单
    createWorkOrder(orderData) {
      const newOrder = {
        id: `WO-${new Date().getFullYear()}-${String(this.workOrders.length + 1).padStart(3, '0')}`,
        ...orderData,
        status: 'pending',
        assignedTo: null,
        assignedTime: null,
        startTime: null,
        resolvedTime: null,
        closedTime: null,
        actualTime: null,
        maintenanceLog: [],
        spareParts: [],
        totalCost: 0,
        attachments: [],
        createdAt: new Date().toLocaleString('zh-CN', { hour12: false }),
        updatedAt: new Date().toLocaleString('zh-CN', { hour12: false })
      }
      
      this.workOrders.unshift(newOrder)
      
      // 更新统计
      this.statusStats.pending++
      if (!this.faultTypeStats[orderData.faultType]) {
        this.faultTypeStats[orderData.faultType] = 0
      }
      this.faultTypeStats[orderData.faultType]++
      
      // 如果有设备ID,更新设备状态为故障
      if (orderData.equipmentId) {
        const equipmentStore = useEquipmentLifecycleStore()
        equipmentStore.updateEquipment(orderData.equipmentId, {
          status: 'fault'
        })
      }
      
      return newOrder
    },

    // 分配工单
    assignWorkOrder(orderId, technicianName) {
      const order = this.workOrders.find(o => o.id === orderId)
      if (!order) return false
      
      const oldStatus = order.status
      order.status = 'assigned'
      order.assignedTo = technicianName
      order.assignedTime = new Date().toLocaleString('zh-CN', { hour12: false })
      order.updatedAt = new Date().toLocaleString('zh-CN', { hour12: false })
      
      order.maintenanceLog.push({
        time: order.assignedTime,
        operator: technicianName,
        action: '接受工单',
        details: '已接受工单，准备开始维修'
      })
      
      // 更新维修人员工作负载
      const tech = this.technicians.find(t => t.name === technicianName)
      if (tech) tech.workload++
      
      // 更新状态统计
      if (this.statusStats[oldStatus]) this.statusStats[oldStatus]--
      this.statusStats.assigned++
      
      return true
    },

    // 开始维修
    startMaintenance(orderId, operator) {
      const order = this.workOrders.find(o => o.id === orderId)
      if (!order) return false
      
      const oldStatus = order.status
      order.status = 'in_progress'
      order.startTime = new Date().toLocaleString('zh-CN', { hour12: false })
      order.updatedAt = new Date().toLocaleString('zh-CN', { hour12: false })
      
      order.maintenanceLog.push({
        time: order.startTime,
        operator: operator,
        action: '开始维修',
        details: '开始维修作业'
      })
      
      // 更新状态统计
      if (this.statusStats[oldStatus]) this.statusStats[oldStatus]--
      this.statusStats.in_progress++
      
      return true
    },

    // 添加维修日志
    addMaintenanceLog(orderId, logData) {
      const order = this.workOrders.find(o => o.id === orderId)
      if (!order) return false
      
      order.maintenanceLog.push({
        time: new Date().toLocaleString('zh-CN', { hour12: false }),
        ...logData
      })
      order.updatedAt = new Date().toLocaleString('zh-CN', { hour12: false })
      
      return true
    },

    // 添加备件
    addSparePart(orderId, partData) {
      const order = this.workOrders.find(o => o.id === orderId)
      if (!order) return false
      
      order.spareParts.push(partData)
      order.totalCost += partData.price * partData.quantity
      order.updatedAt = new Date().toLocaleString('zh-CN', { hour12: false })
      
      return true
    },

    // 完成维修
    resolveMaintenance(orderId, operator, actualTime, notes) {
      const order = this.workOrders.find(o => o.id === orderId)
      if (!order) return false
      
      const oldStatus = order.status
      order.status = 'resolved'
      order.resolvedTime = new Date().toLocaleString('zh-CN', { hour12: false })
      order.actualTime = actualTime
      order.notes = notes
      order.updatedAt = new Date().toLocaleString('zh-CN', { hour12: false })
      
      order.maintenanceLog.push({
        time: order.resolvedTime,
        operator: operator,
        action: '完成维修',
        details: notes
      })
      
      // 更新维修人员工作负载
      const tech = this.technicians.find(t => t.name === order.assignedTo)
      if (tech && tech.workload > 0) tech.workload--
      
      // 更新状态统计
      if (this.statusStats[oldStatus]) this.statusStats[oldStatus]--
      this.statusStats.resolved++
      
      return true
    },

    // 关闭工单
    closeWorkOrder(orderId, operator, notes) {
      const order = this.workOrders.find(o => o.id === orderId)
      if (!order) return false
      
      const oldStatus = order.status
      order.status = 'closed'
      order.closedTime = new Date().toLocaleString('zh-CN', { hour12: false })
      order.updatedAt = new Date().toLocaleString('zh-CN', { hour12: false })
      
      // 计算实际维修时长
      if (order.startTime) {
        const start = new Date(order.startTime)
        const closed = new Date(order.closedTime)
        order.actualTime = Math.round((closed - start) / (1000 * 60 * 60))
      }
      
      order.maintenanceLog.push({
        time: order.closedTime,
        operator: operator,
        action: '关闭工单',
        details: notes || '验收通过，工单关闭'
      })
      
      // 释放维修人员工作负载
      if (order.assignedTo) {
        const tech = this.technicians.find(t => t.name === order.assignedTo)
        if (tech && tech.workload > 0) tech.workload--
      }
      
      // 更新状态统计
      if (this.statusStats[oldStatus]) this.statusStats[oldStatus]--
      this.statusStats.closed++
      
      // 与设备生命周期管理集成
      if (order.equipmentId) {
        const equipmentStore = useEquipmentLifecycleStore()
        
        // 更新设备状态为运行中
        equipmentStore.updateEquipment(order.equipmentId, {
          status: 'running'
        })
        
        // 记录维护记录到设备
        equipmentStore.recordMaintenance(order.equipmentId, {
          date: new Date(order.closedTime).toISOString().split('T')[0],
          type: order.priority === 'urgent' ? 'unplanned' : 'planned',
          components: order.componentIds || [],
          description: order.faultDescription,
          technician: order.assignedTo,
          duration: order.actualTime || 0,
          cost: order.totalCost
        })
        
        // 记录成本到设备
        if (order.totalCost > 0) {
          // 备件成本
          order.spareParts.forEach(part => {
            equipmentStore.recordCost(order.equipmentId, {
              date: new Date(order.closedTime).toISOString().split('T')[0],
              type: 'parts',
              description: `备件: ${part.name}`,
              amount: part.price * part.quantity,
              workOrderId: order.id
            })
          })
          
          // 人工成本
          if (order.actualTime) {
            const laborCost = order.actualTime * 80 // 80元/小时
            equipmentStore.recordCost(order.equipmentId, {
              date: new Date(order.closedTime).toISOString().split('T')[0],
              type: 'labor',
              description: `维修人工成本 (${order.actualTime}小时)`,
              amount: laborCost,
              workOrderId: order.id
            })
          }
        }
      }
      
      return true
    },

    // 搜索工单（增强版：支持工单号、客户姓名、客户手机号查询）
    searchWorkOrders(keyword) {
      if (!keyword) return this.workOrders
      
      const lowerKeyword = keyword.toLowerCase()
      return this.workOrders.filter(order => 
        order.id.toLowerCase().includes(lowerKeyword) ||
        order.deviceName.toLowerCase().includes(lowerKeyword) ||
        order.faultType.toLowerCase().includes(lowerKeyword) ||
        order.faultDescription.toLowerCase().includes(lowerKeyword) ||
        order.location.toLowerCase().includes(lowerKeyword) ||
        (order.customerName && order.customerName.toLowerCase().includes(lowerKeyword)) ||
        (order.customerPhone && order.customerPhone.includes(keyword)) ||
        (order.customerCompany && order.customerCompany.toLowerCase().includes(lowerKeyword))
      )
    },

    // 根据服务工单号查询
    searchByOrderId(orderId) {
      return this.workOrders.find(order => order.id === orderId)
    },

    // 根据客户手机号查询
    searchByCustomerPhone(phone) {
      if (!phone) return []
      return this.workOrders.filter(order => 
        order.customerPhone && order.customerPhone.includes(phone)
      )
    },

    // 根据客户姓名查询
    searchByCustomerName(name) {
      if (!name) return []
      const lowerName = name.toLowerCase()
      return this.workOrders.filter(order => 
        order.customerName && order.customerName.toLowerCase().includes(lowerName)
      )
    },

    // 按条件筛选工单
    filterWorkOrders(filters) {
      let result = [...this.workOrders]

      if (filters.status) {
        result = result.filter(o => o.status === filters.status)
      }

      if (filters.priority) {
        result = result.filter(o => o.priority === filters.priority)
      }

      if (filters.faultLevel) {
        result = result.filter(o => o.faultLevel === filters.faultLevel)
      }

      if (filters.deviceId) {
        result = result.filter(o => o.deviceId === filters.deviceId)
      }

      if (filters.assignedTo) {
        result = result.filter(o => o.assignedTo === filters.assignedTo)
      }

      if (filters.dateFrom) {
        result = result.filter(o => new Date(o.createdAt) >= new Date(filters.dateFrom))
      }

      if (filters.dateTo) {
        result = result.filter(o => new Date(o.createdAt) <= new Date(filters.dateTo))
      }

      return result
    },

    // 获取工单详情
    getWorkOrderById(id) {
      return this.workOrders.find(o => o.id === id)
    },

    // 获取设备的维修历史
    getDeviceHistory(deviceId) {
      return this.workOrders
        .filter(o => o.deviceId === deviceId)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    },

    // 生成故障统计报告
    generateFaultReport() {
      const report = {
        timestamp: new Date().toLocaleString(),
        summary: {
          total: this.workOrders.length,
          pending: this.statusStats.pending,
          inProgress: this.statusStats.in_progress,
          completed: this.statusStats.resolved + this.statusStats.closed,
          avgRepairTime: this.avgRepairTime,
          totalCost: this.workOrders.reduce((sum, o) => sum + o.totalCost, 0)
        },
        faultTypeDistribution: this.faultTypeStats,
        deviceFaultRate: this.deviceFaultRate,
        weeklyStats: this.weeklyStats,
        highPriorityOrders: this.highPriorityOrders.map(o => ({
          id: o.id,
          device: o.deviceName,
          faultType: o.faultType,
          status: o.status,
          priority: o.priority
        }))
      }
      
      return report
    },

    // 更新工单信息（用于编辑）
    updateWorkOrder(orderId, updateData) {
      const order = this.workOrders.find(o => o.id === orderId)
      if (!order) return false
      
      Object.assign(order, updateData, {
        updatedAt: new Date().toLocaleString('zh-CN', { hour12: false })
      })
      
      return true
    },

    // 更新服务状态
    updateServiceStatus(orderId, status, operator, notes) {
      const order = this.workOrders.find(o => o.id === orderId)
      if (!order) return false
      
      order.serviceStatus = status
      order.updatedAt = new Date().toLocaleString('zh-CN', { hour12: false })
      
      order.maintenanceLog.push({
        time: order.updatedAt,
        operator: operator,
        action: '更新服务状态',
        details: `服务状态更新为: ${status}${notes ? ` - ${notes}` : ''}`
      })
      
      return true
    },

    // 更新配件订购状态
    updatePartsOrderStatus(orderId, status, operator, details) {
      const order = this.workOrders.find(o => o.id === orderId)
      if (!order) return false
      
      order.partsOrderStatus = status
      order.partsOrderDetails = details
      order.updatedAt = new Date().toLocaleString('zh-CN', { hour12: false })
      
      order.maintenanceLog.push({
        time: order.updatedAt,
        operator: operator,
        action: '更新配件订购状态',
        details: `配件状态: ${status}${details ? ` - ${details}` : ''}`
      })
      
      return true
    },

    // 记录检测结果
    recordInspection(orderId, result, operator, notes) {
      const order = this.workOrders.find(o => o.id === orderId)
      if (!order) return false
      
      order.inspectionResult = result
      order.inspectionTime = new Date().toLocaleString('zh-CN', { hour12: false })
      order.inspectionBy = operator
      order.updatedAt = order.inspectionTime
      
      order.maintenanceLog.push({
        time: order.inspectionTime,
        operator: operator,
        action: '记录检测结果',
        details: `检测结果: ${result}${notes ? ` - ${notes}` : ''}`
      })
      
      return true
    },

    // 更新交付状态
    updateDeliveryStatus(orderId, operator, notes) {
      const order = this.workOrders.find(o => o.id === orderId)
      if (!order) return false
      
      order.deliveryStatus = 'delivered'
      order.deliveryTime = new Date().toLocaleString('zh-CN', { hour12: false })
      order.deliveryBy = operator
      order.updatedAt = order.deliveryTime
      
      order.maintenanceLog.push({
        time: order.deliveryTime,
        operator: operator,
        action: '交付设备',
        details: notes || '设备已交付给客户'
      })
      
      return true
    },

    // 记录验收结果
    recordAcceptance(orderId, status, operator, notes) {
      const order = this.workOrders.find(o => o.id === orderId)
      if (!order) return false
      
      order.acceptanceStatus = status
      order.acceptanceTime = new Date().toLocaleString('zh-CN', { hour12: false })
      order.acceptanceBy = operator
      order.acceptanceNotes = notes
      order.updatedAt = order.acceptanceTime
      
      const statusText = {
        'accepted': '验收通过',
        'rejected': '验收拒绝',
        'not_accepted': '未验收'
      }
      
      order.maintenanceLog.push({
        time: order.acceptanceTime,
        operator: operator,
        action: '记录验收结果',
        details: `${statusText[status]}${notes ? ` - ${notes}` : ''}`
      })
      
      return true
    },

    // 删除工单
    deleteWorkOrder(orderId) {
      const index = this.workOrders.findIndex(o => o.id === orderId)
      if (index === -1) return false
      
      const order = this.workOrders[index]
      
      // 更新统计
      if (this.statusStats[order.status]) {
        this.statusStats[order.status]--
      }
      if (this.faultTypeStats[order.faultType]) {
        this.faultTypeStats[order.faultType]--
      }
      
      this.workOrders.splice(index, 1)
      return true
    }
  }
})
