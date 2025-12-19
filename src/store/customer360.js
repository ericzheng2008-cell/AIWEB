import { defineStore } from 'pinia'

/**
 * 客户360画像与沙盘分析 Store
 * 功能：客户全景视图、RFM分析、CLV预测、沙盘模拟
 */
export const useCustomer360Store = defineStore('customer360', {
  state: () => ({
    // 客户列表
    customers: JSON.parse(localStorage.getItem('customer360Data') || JSON.stringify([])),
    
    // 当前选中的客户
    currentCustomer: null,
    
    // 沙盘模拟历史
    sandboxHistory: JSON.parse(localStorage.getItem('sandboxHistory') || JSON.stringify([])),
    
    // AI推荐记录
    aiRecommendations: [],
    
    // 客户分群配置
    segmentation: {
      rfmThresholds: {
        recency: { high: 30, medium: 60 },
        frequency: { high: 10, medium: 5 },
        monetary: { high: 50000, medium: 20000 }
      },
      clvThreshold: 100000,
      churnRiskThreshold: 40
    }
  }),

  getters: {
    /**
     * 获取高价值客户
     */
    highValueCustomers: (state) => {
      return state.customers.filter(c => 
        c.predictedCLV > state.segmentation.clvThreshold &&
        c.churnRisk < state.segmentation.churnRiskThreshold
      )
    },

    /**
     * 获取流失风险客户
     */
    churnRiskCustomers: (state) => {
      return state.customers.filter(c => 
        c.churnRisk >= state.segmentation.churnRiskThreshold
      )
    },

    /**
     * 按生命周期分组
     */
    customersByLifecycle: (state) => (lifecycle) => {
      return state.customers.filter(c => c.lifecycle === lifecycle)
    },

    /**
     * 按RFM分群
     */
    customersByRFM: (state) => (segment) => {
      return state.customers.filter(c => c.rfmSegment === segment)
    },

    /**
     * 获取客户详情
     */
    getCustomerById: (state) => (customerId) => {
      return state.customers.find(c => c.id === customerId)
    },

    /**
     * 客户统计
     */
    customerStats: (state) => {
      const total = state.customers.length
      const byLifecycle = {
        new: 0,
        active: 0,
        dormant: 0,
        churn: 0
      }
      
      let totalCLV = 0
      let avgChurnRisk = 0
      
      state.customers.forEach(c => {
        byLifecycle[c.lifecycle] = (byLifecycle[c.lifecycle] || 0) + 1
        totalCLV += c.predictedCLV
        avgChurnRisk += c.churnRisk
      })
      
      return {
        total,
        byLifecycle,
        avgCLV: total > 0 ? totalCLV / total : 0,
        avgChurnRisk: total > 0 ? avgChurnRisk / total : 0
      }
    }
  },

  actions: {
    /**
     * 加载客户数据
     */
    async loadCustomers() {
      if (this.customers.length === 0) {
        await this.generateMockData()
      }
      return true
    },

    /**
     * 生成模拟数据
     */
    async generateMockData() {
      const lifecycles = ['new', 'active', 'dormant', 'churn']
      const levels = ['普通客户', '重要客户', '高价值客户', 'VIP客户']
      const industries = ['汽车制造', '电子制造', '机械制造', '航空航天', '新能源']
      const rfmSegments = [
        '重要价值客户', '重要保持客户', '重要挽留客户', '重要发展客户',
        '一般价值客户', '一般保持客户', '一般挽留客户', '一般发展客户'
      ]
      
      const mockCustomers = []
      
      for (let i = 0; i < 50; i++) {
        const lifecycle = lifecycles[Math.floor(Math.random() * lifecycles.length)]
        const clv = 50000 + Math.random() * 200000
        const churnRisk = Math.random() * 100
        const totalSpent = 30000 + Math.random() * 500000
        const orderCount = 5 + Math.floor(Math.random() * 30)
        
        mockCustomers.push({
          id: `customer_${i + 1}`,
          name: `客户${String.fromCharCode(65 + i)}公司`,
          avatar: '',
          lifecycle,
          customerLevel: levels[Math.floor(Math.random() * levels.length)],
          industry: industries[Math.floor(Math.random() * industries.length)],
          tags: this.generateTags(lifecycle, churnRisk),
          
          // KPI
          predictedCLV: Math.round(clv),
          clvTrend: -10 + Math.random() * 30,
          churnRisk: Math.round(churnRisk),
          conversionProbability: Math.round(60 + Math.random() * 40),
          totalSpent: Math.round(totalSpent),
          orderCount,
          lastPurchaseDays: Math.floor(Math.random() * 90),
          
          // RFM
          rfm: {
            recency: Math.round(50 + Math.random() * 50),
            frequency: Math.round(50 + Math.random() * 50),
            monetary: Math.round(50 + Math.random() * 50)
          },
          rfmSegment: rfmSegments[Math.floor(Math.random() * rfmSegments.length)],
          
          // CLV趋势
          clvTrend: this.generateCLVTrend(clv),
          maxCLV: clv * 1.5,
          
          // 时间轴
          timeline: this.generateTimeline(),
          
          // AI洞察
          strategicInsights: this.generateStrategicInsights(lifecycle, churnRisk),
          operationalInsights: this.generateOperationalInsights(),
          alerts: this.generateAlerts(churnRisk)
        })
      }
      
      this.customers = mockCustomers
      this.saveToLocalStorage()
    },

    /**
     * 生成标签
     */
    generateTags(lifecycle, churnRisk) {
      const tags = []
      
      if (lifecycle === 'active') tags.push('活跃')
      if (lifecycle === 'new') tags.push('新客户')
      if (churnRisk < 30) tags.push('流失风险低')
      else if (churnRisk > 60) tags.push('流失风险高')
      
      const preferences = ['偏好拧紧工具', '偏好套筒工具', '偏好数字化系统']
      tags.push(preferences[Math.floor(Math.random() * preferences.length)])
      
      if (Math.random() > 0.5) tags.push('决策周期短')
      
      return tags
    },

    /**
     * 生成CLV趋势
     */
    generateCLVTrend(baseCLV) {
      const months = ['7月', '8月', '9月', '10月', '11月', '12月', '1月', '2月', '3月', '4月', '5月', '6月']
      const trend = []
      
      for (let i = 0; i < 12; i++) {
        const variation = 0.8 + Math.random() * 0.4
        const value = baseCLV * variation * ((i + 6) / 12)
        trend.push({
          month: months[i],
          value: Math.round(value)
        })
      }
      
      return trend
    },

    /**
     * 生成时间轴
     */
    generateTimeline() {
      const events = []
      const types = ['transaction', 'interaction']
      const transactions = [
        '购买数字扭矩扳手',
        '购买套筒工具包',
        '购买拧紧数据采集系统'
      ]
      const interactions = [
        '客服咨询',
        '产品浏览',
        '邮件互动',
        '技术支持'
      ]
      
      for (let i = 0; i < 5; i++) {
        const type = types[Math.floor(Math.random() * types.length)]
        const daysAgo = Math.floor(Math.random() * 30)
        const date = new Date()
        date.setDate(date.getDate() - daysAgo)
        
        events.push({
          id: `event_${i}`,
          time: date.toISOString().split('T')[0] + ' ' + 
                String(Math.floor(Math.random() * 24)).padStart(2, '0') + ':' +
                String(Math.floor(Math.random() * 60)).padStart(2, '0'),
          type,
          title: type === 'transaction' 
            ? transactions[Math.floor(Math.random() * transactions.length)]
            : interactions[Math.floor(Math.random() * interactions.length)],
          description: type === 'transaction'
            ? `金额 ¥${5000 + Math.floor(Math.random() * 50000)}`
            : '客户互动详情',
          channel: ['APP', '网站', '客服电话', '邮件'][Math.floor(Math.random() * 4)]
        })
      }
      
      return events.sort((a, b) => new Date(b.time) - new Date(a.time))
    },

    /**
     * 生成战略洞察
     */
    generateStrategicInsights(lifecycle, churnRisk) {
      const insights = []
      
      if (lifecycle === 'active' && churnRisk < 30) {
        insights.push({
          id: 's1',
          title: '推荐高端产品',
          content: '客户活跃度高且流失风险低，建议推荐高端产品线',
          color: '#409EFF',
          priority: 'success',
          priorityText: '高优先级'
        })
      }
      
      if (churnRisk > 60) {
        insights.push({
          id: 's2',
          title: '紧急挽留计划',
          content: '客户流失风险高，建议启动紧急挽留计划',
          color: '#F56C6C',
          priority: 'danger',
          priorityText: '紧急'
        })
      }
      
      return insights
    },

    /**
     * 生成运营建议
     */
    generateOperationalInsights() {
      return [
        {
          id: 'o1',
          title: '定期回访',
          content: '建议每月定期回访，了解使用情况',
          color: '#E6A23C'
        }
      ]
    },

    /**
     * 生成告警
     */
    generateAlerts(churnRisk) {
      const alerts = []
      
      if (churnRisk > 60) {
        alerts.push({
          id: 'a1',
          title: '流失风险告警',
          content: '客户流失概率较高，建议立即跟进',
          color: '#F56C6C',
          severity: 'danger',
          severityText: '高风险'
        })
      }
      
      return alerts
    },

    /**
     * 执行沙盘模拟
     */
    async executeSandboxSimulation(customerId, strategy) {
      const customer = this.getCustomerById(customerId)
      if (!customer) {
        throw new Error('客户不存在')
      }
      
      // 模拟AI计算（实际应调用后端API）
      const baseRevenue = customer.predictedCLV
      const priceImpact = strategy.price / 100
      const discountImpact = strategy.discount / 100
      const frequencyImpact = strategy.frequency === 'high' ? 0.2 : (strategy.frequency === 'medium' ? 0.1 : 0.05)
      const serviceImpact = strategy.serviceLevel === 'vip' ? 0.15 : (strategy.serviceLevel === 'premium' ? 0.1 : 0)
      
      const revenueChange = 15 + (priceImpact * 10) + (discountImpact * 20) + (frequencyImpact * 100) + (serviceImpact * 100)
      const churnRateChange = -8 - (discountImpact * 10) - (frequencyImpact * 50) - (serviceImpact * 50)
      
      const result = {
        revenue: Math.round(baseRevenue * (1 + revenueChange / 100)),
        revenueChange: Math.round(revenueChange),
        churnRate: Math.max(0, Math.round(customer.churnRisk + churnRateChange)),
        churnRateChange: Math.round(churnRateChange),
        roi: Math.round((2.0 + Math.random() * 0.5) * 10) / 10,
        roiChange: Math.round((0.3 + Math.random() * 0.3) * 10) / 10,
        cost: Math.round(baseRevenue * 0.4),
        costChange: Math.round(-5 - Math.random() * 5),
        timestamp: new Date().toISOString()
      }
      
      // 保存历史
      this.sandboxHistory.push({
        customerId,
        strategy,
        result,
        timestamp: new Date().toISOString()
      })
      
      this.saveToLocalStorage()
      
      return result
    },

    /**
     * 添加客户
     */
    addCustomer(customerData) {
      const newCustomer = {
        ...customerData,
        id: customerData.id || `customer_${Date.now()}`,
        timeline: [],
        clvTrend: this.generateCLVTrend(customerData.predictedCLV || 100000),
        strategicInsights: [],
        operationalInsights: [],
        alerts: []
      }
      
      this.customers.push(newCustomer)
      this.saveToLocalStorage()
      
      return newCustomer
    },

    /**
     * 更新客户
     */
    updateCustomer(customerId, updates) {
      const index = this.customers.findIndex(c => c.id === customerId)
      if (index > -1) {
        this.customers[index] = { ...this.customers[index], ...updates }
        this.saveToLocalStorage()
        return true
      }
      return false
    },

    /**
     * 删除客户
     */
    deleteCustomer(customerId) {
      const index = this.customers.findIndex(c => c.id === customerId)
      if (index > -1) {
        this.customers.splice(index, 1)
        this.saveToLocalStorage()
        return true
      }
      return false
    },

    /**
     * 保存到本地存储
     */
    saveToLocalStorage() {
      localStorage.setItem('customer360Data', JSON.stringify(this.customers))
      localStorage.setItem('sandboxHistory', JSON.stringify(this.sandboxHistory))
    },

    /**
     * 导出数据
     */
    exportData() {
      return {
        customers: this.customers,
        sandboxHistory: this.sandboxHistory,
        exportTime: new Date().toISOString()
      }
    },

    /**
     * 导入数据
     */
    importData(data) {
      if (data.customers) {
        this.customers = data.customers
      }
      if (data.sandboxHistory) {
        this.sandboxHistory = data.sandboxHistory
      }
      this.saveToLocalStorage()
    }
  }
})
