import { defineStore } from 'pinia'
import { useProductsServicesStore } from './productsServices'
import { useKnowledgeBase } from './knowledgeBase'
import { useTighteningDataStore } from './tighteningData'

/**
 * 企业产品矩阵管理 Store
 * 功能：产品收益-现金流分析、BCG矩阵、组合优化、AI推荐
 */
export const useProductMatrixStore = defineStore('productMatrix', {
  state: () => ({
    // 产品矩阵数据
    matrixData: JSON.parse(localStorage.getItem('productMatrixData') || JSON.stringify([])),
    
    // 财务数据（模拟）
    financialData: JSON.parse(localStorage.getItem('productFinancialData') || JSON.stringify({})),
    
    // 战略配置
    strategyConfig: JSON.parse(localStorage.getItem('matrixStrategyConfig') || JSON.stringify({
      // 四象限分界线
      grossMarginThreshold: 25, // 毛利率分界线 (%)
      cashFlowThreshold: 15,    // 现金流贡献率分界线 (%)
      
      // 风险阈值
      inventoryDaysAlert: 90,   // 库存天数警戒值
      paymentCycleAlert: 60,    // 回款周期警戒值
      
      // AI推荐权重
      revenueWeight: 0.3,
      marginWeight: 0.3,
      cashFlowWeight: 0.2,
      growthWeight: 0.2
    })),
    
    // 过滤器
    filters: {
      quadrant: null,
      category: null,
      lifecycle: null
    },
    
    // AI推荐记录
    recommendations: [],
    
    // 异常预警
    alerts: []
  }),

  getters: {
    /**
     * 获取矩阵产品数据（带坐标和定位）
     */
    getMatrixProducts: (state) => (period = 'month', categoryId = null) => {
      const productsStore = useProductsServicesStore()
      const products = state.matrixData.filter(p => {
        if (categoryId && p.categoryId !== categoryId) return false
        if (state.filters.quadrant && p.quadrant !== state.filters.quadrant) return false
        return true
      })

      // 计算坐标位置和气泡大小
      return products.map(product => {
        const revenue = product.revenue || 0
        const grossMargin = product.grossMargin || 0
        const cashFlowRate = product.cashFlowContributionRate || 0
        
        // 确定象限
        const quadrant = state.determineQuadrant(grossMargin, cashFlowRate)
        
        // 计算坐标 (0-100%)
        const x = Math.min(100, Math.max(0, (grossMargin / 50) * 100)) // 假设最大毛利率50%
        const y = Math.min(100, Math.max(0, (cashFlowRate / 30) * 100)) // 假设最大现金流贡献30%
        
        // 气泡大小（基于销售额，范围30-100px）
        const maxRevenue = Math.max(...products.map(p => p.revenue || 0))
        const size = 30 + ((revenue / maxRevenue) * 70)
        
        return {
          ...product,
          x,
          y,
          size,
          quadrant,
          shortName: product.name.length > 6 ? product.name.substring(0, 6) + '...' : product.name
        }
      })
    },

    /**
     * 获取核心指标
     */
    getMetrics: (state) => () => {
      const products = state.matrixData
      const totalRevenue = products.reduce((sum, p) => sum + (p.revenue || 0), 0)
      const totalProfit = products.reduce((sum, p) => sum + (p.netProfit || 0), 0)
      const totalCashFlow = products.reduce((sum, p) => sum + (p.cashFlowContribution || 0), 0)
      
      const avgGrossMargin = products.length > 0
        ? products.reduce((sum, p) => sum + (p.grossMargin || 0), 0) / products.length
        : 0
      
      const coreProducts = products.filter(p => p.quadrant === 'core')
      const coreProductRatio = products.length > 0
        ? (coreProducts.length / products.length * 100)
        : 0

      return {
        totalRevenue,
        revenueTrend: state.calculateTrend('revenue'),
        avgGrossMargin: Math.round(avgGrossMargin * 10) / 10,
        cashFlow: totalCashFlow,
        cashFlowTrend: state.calculateTrend('cashFlow'),
        coreProductRatio: Math.round(coreProductRatio),
        coreProductCount: coreProducts.length
      }
    },

    /**
     * 大类对比分析
     */
    getCategoryComparison: (state) => (metric = 'revenue', period = 'month') => {
      const productsStore = useProductsServicesStore()
      const categories = productsStore.level1Categories
      
      const comparison = categories.map(cat => {
        const categoryProducts = state.matrixData.filter(p => p.categoryId === cat.id)
        
        const revenue = categoryProducts.reduce((sum, p) => sum + (p.revenue || 0), 0)
        const margin = categoryProducts.reduce((sum, p) => sum + (p.netProfit || 0), 0)
        const cashFlow = categoryProducts.reduce((sum, p) => sum + (p.cashFlowContribution || 0), 0)
        
        return {
          id: cat.id,
          name: cat.name['zh-CN'],
          revenue,
          margin,
          cashFlow,
          productCount: categoryProducts.length,
          trend: state.calculateCategoryTrend(cat.id, metric)
        }
      })
      
      // 计算百分比
      const total = comparison.reduce((sum, c) => sum + (c[metric] || 0), 0)
      comparison.forEach(c => {
        c.percentage = total > 0 ? Math.round((c[metric] / total) * 100) : 0
      })
      
      // 按指标排序
      return comparison.sort((a, b) => b[metric] - a[metric])
    },

    /**
     * AI智能推荐
     */
    getAIRecommendations: (state) => () => {
      const strategic = state.generateStrategicRecommendations()
      const operational = state.generateOperationalRecommendations()
      const alerts = state.generateAlerts()
      
      return {
        strategic,
        operational,
        alerts
      }
    }
  },

  actions: {
    /**
     * 加载数据
     */
    async loadData(period = 'month', categoryId = null) {
      // 如果没有数据，生成模拟数据
      if (this.matrixData.length === 0) {
        await this.generateMockData()
      }
      
      // 刷新AI推荐
      this.refreshAIRecommendations()
      
      // 检测异常
      this.detectAnomalies()
      
      return true
    },

    /**
     * 生成模拟数据（基于产品库）
     */
    async generateMockData() {
      const productsStore = useProductsServicesStore()
      const categories = productsStore.level1Categories
      
      const mockProducts = []
      
      categories.forEach(cat => {
        // 每个大类生成3-5个产品
        const productCount = 3 + Math.floor(Math.random() * 3)
        
        for (let i = 0; i < productCount; i++) {
          const baseRevenue = 50000 + Math.random() * 500000
          const grossMargin = 15 + Math.random() * 30 // 15-45%
          const grossProfit = baseRevenue * (grossMargin / 100)
          const netProfit = grossProfit * 0.6 // 净利润约为毛利的60%
          
          const inventoryDays = 30 + Math.random() * 90
          const paymentCycle = 30 + Math.random() * 60
          const cashFlowContribution = baseRevenue * (1 - inventoryDays / 365)
          const cashFlowRate = (cashFlowContribution / baseRevenue) * 100
          
          mockProducts.push({
            id: `prod_${cat.id}_${i + 1}`,
            name: `${cat.name['zh-CN']}-${String.fromCharCode(65 + i)}型`,
            categoryId: cat.id,
            categoryName: cat.name['zh-CN'],
            
            // 销售数据
            revenue: Math.round(baseRevenue),
            salesVolume: Math.floor(baseRevenue / (1000 + Math.random() * 5000)),
            
            // 收益指标
            grossMargin: Math.round(grossMargin * 10) / 10,
            netProfit: Math.round(netProfit),
            contributionRate: Math.round((netProfit / baseRevenue) * 1000) / 10,
            
            // 现金流
            cashFlowContribution: Math.round(cashFlowContribution),
            cashFlowContributionRate: Math.round(cashFlowRate * 10) / 10,
            inventoryDays: Math.round(inventoryDays),
            paymentCycle: Math.round(paymentCycle),
            
            // 战略指标
            marketGrowthRate: -5 + Math.random() * 20, // -5% 到 15%
            marketShare: Math.random() * 15, // 0-15%
            lifecycle: this.determineLifecycle(baseRevenue, grossMargin),
            
            // 趋势数据（最近6个月）
            trends: this.generateTrendData(baseRevenue, grossMargin, 6),
            
            // AI推荐动作
            aiActions: []
          })
        }
      })
      
      // 计算象限
      mockProducts.forEach(p => {
        p.quadrant = this.determineQuadrant(p.grossMargin, p.cashFlowContributionRate)
        p.aiActions = this.generateProductActions(p)
      })
      
      this.matrixData = mockProducts
      this.saveToLocalStorage()
    },

    /**
     * 生成趋势数据
     */
    generateTrendData(baseRevenue, baseMargin, months = 6) {
      const trends = []
      const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      const currentMonth = new Date().getMonth()
      
      let maxRevenue = 0
      for (let i = 0; i < months; i++) {
        const monthIndex = (currentMonth - months + i + 1 + 12) % 12
        const fluctuation = 0.8 + Math.random() * 0.4 // 80%-120%
        const revenue = baseRevenue * fluctuation
        const margin = baseMargin + (Math.random() - 0.5) * 5
        const profit = revenue * (margin / 100)
        
        if (revenue > maxRevenue) maxRevenue = revenue
        
        trends.push({
          month: monthNames[monthIndex],
          revenue: Math.round(revenue),
          profit: Math.round(profit),
          margin: Math.round(margin * 10) / 10
        })
      }
      
      // 记录最大值用于图表归一化
      trends.forEach(t => t.maxRevenue = maxRevenue)
      trends[0].maxRevenue = maxRevenue
      
      return trends
    },

    /**
     * 确定产品生命周期
     */
    determineLifecycle(revenue, margin) {
      if (margin > 35) return 'growth' // 成长期
      if (margin > 25 && revenue > 200000) return 'mature' // 成熟期
      if (margin < 20) return 'decline' // 衰退期
      return 'intro' // 导入期
    },

    /**
     * 确定产品象限
     */
    determineQuadrant(grossMargin, cashFlowRate) {
      const marginThreshold = this.strategyConfig.grossMarginThreshold
      const cashThreshold = this.strategyConfig.cashFlowThreshold
      
      if (grossMargin >= marginThreshold && cashFlowRate >= cashThreshold) {
        return 'core' // 核心战略
      } else if (grossMargin >= marginThreshold && cashFlowRate < cashThreshold) {
        return 'optimize' // 优化提升
      } else if (grossMargin < marginThreshold && cashFlowRate < cashThreshold) {
        return 'maintain' // 低投入维持
      } else {
        return 'potential' // 潜力产品
      }
    },

    /**
     * 生成产品AI动作
     */
    generateProductActions(product) {
      const actions = []
      
      // 基于象限推荐
      if (product.quadrant === 'core') {
        actions.push(
          { id: 'increase_capacity', icon: '📈', text: '增加产能', type: 'success' },
          { id: 'protect_price', icon: '🛡️', text: '保持定价', type: 'success' }
        )
      } else if (product.quadrant === 'optimize') {
        actions.push(
          { id: 'optimize_inventory', icon: '📦', text: '优化库存', type: 'warning' },
          { id: 'improve_payment', icon: '💰', text: '改善账期', type: 'warning' }
        )
      } else if (product.quadrant === 'maintain') {
        actions.push(
          { id: 'reduce_cost', icon: '✂️', text: '降低成本', type: 'info' },
          { id: 'consider_exit', icon: '🚪', text: '考虑退出', type: 'danger' }
        )
      } else if (product.quadrant === 'potential') {
        actions.push(
          { id: 'increase_margin', icon: '💹', text: '提升毛利', type: 'primary' },
          { id: 'market_analysis', icon: '🔍', text: '市场分析', type: 'primary' }
        )
      }
      
      // 基于异常推荐
      if (product.inventoryDays > this.strategyConfig.inventoryDaysAlert) {
        actions.push({ id: 'clear_inventory', icon: '🏷️', text: '促销清库', type: 'danger' })
      }
      
      if (product.paymentCycle > this.strategyConfig.paymentCycleAlert) {
        actions.push({ id: 'accelerate_payment', icon: '⏰', text: '加速回款', type: 'warning' })
      }
      
      return actions
    },

    /**
     * 计算趋势
     */
    calculateTrend(metric = 'revenue') {
      // 简化版：随机生成趋势
      return Math.round((Math.random() - 0.3) * 20 * 10) / 10
    },

    /**
     * 计算大类趋势
     */
    calculateCategoryTrend(categoryId, metric) {
      return Math.round((Math.random() - 0.3) * 15 * 10) / 10
    },

    /**
     * 生成战略推荐
     */
    generateStrategicRecommendations() {
      const recommendations = []
      
      // 分析核心产品
      const coreProducts = this.matrixData.filter(p => p.quadrant === 'core')
      if (coreProducts.length > 0) {
        const topCore = coreProducts.sort((a, b) => b.revenue - a.revenue)[0]
        recommendations.push({
          id: 'rec_core_1',
          title: `强化核心产品"${topCore.name}"`,
          content: `该产品贡献销售额¥${(topCore.revenue / 10000).toFixed(1)}万，建议增加市场投入和产能保障`,
          color: '#67C23A',
          priority: 'success',
          priorityText: '高优先级'
        })
      }
      
      // 分析优化产品
      const optimizeProducts = this.matrixData.filter(p => p.quadrant === 'optimize')
      if (optimizeProducts.length > 0) {
        const highMargin = optimizeProducts.sort((a, b) => b.grossMargin - a.grossMargin)[0]
        recommendations.push({
          id: 'rec_optimize_1',
          title: `优化"${highMargin.name}"现金流`,
          content: `该产品毛利率${highMargin.grossMargin}%，但库存周转${highMargin.inventoryDays}天，建议优化供应链`,
          color: '#E6A23C',
          priority: 'warning',
          priorityText: '中优先级'
        })
      }
      
      // 分析淘汰产品
      const maintainProducts = this.matrixData.filter(p => p.quadrant === 'maintain')
      if (maintainProducts.length > 2) {
        recommendations.push({
          id: 'rec_maintain_1',
          title: `优化产品组合`,
          content: `当前有${maintainProducts.length}个低收益低现金流产品，建议评估是否淘汰或升级`,
          color: '#F56C6C',
          priority: 'danger',
          priorityText: '需关注'
        })
      }
      
      return recommendations
    },

    /**
     * 生成运营推荐
     */
    generateOperationalRecommendations() {
      const recommendations = []
      
      // 库存优化
      const highInventory = this.matrixData.filter(p => p.inventoryDays > this.strategyConfig.inventoryDaysAlert)
      if (highInventory.length > 0) {
        recommendations.push({
          id: 'op_inventory_1',
          title: `优化${highInventory.length}个产品库存`,
          content: `这些产品平均库存周转${Math.round(highInventory.reduce((s, p) => s + p.inventoryDays, 0) / highInventory.length)}天，建议JIT生产`,
          color: '#409EFF'
        })
      }
      
      // 回款优化
      const slowPayment = this.matrixData.filter(p => p.paymentCycle > this.strategyConfig.paymentCycleAlert)
      if (slowPayment.length > 0) {
        recommendations.push({
          id: 'op_payment_1',
          title: `加速${slowPayment.length}个产品回款`,
          content: `平均回款周期${Math.round(slowPayment.reduce((s, p) => s + p.paymentCycle, 0) / slowPayment.length)}天，建议调整账期或现金激励`,
          color: '#67C23A'
        })
      }
      
      return recommendations
    },

    /**
     * 生成异常预警
     */
    generateAlerts() {
      const alerts = []
      
      // 毛利异常
      const lowMargin = this.matrixData.filter(p => p.grossMargin < 15)
      if (lowMargin.length > 0) {
        alerts.push({
          id: 'alert_margin_1',
          title: `${lowMargin.length}个产品毛利率过低`,
          content: `这些产品毛利率低于15%，可能影响盈利能力，建议涨价或降成本`,
          color: '#F56C6C',
          severity: 'danger',
          severityText: '高风险'
        })
      }
      
      // 现金流异常
      const lowCashFlow = this.matrixData.filter(p => p.cashFlowContributionRate < 10)
      if (lowCashFlow.length > 0) {
        alerts.push({
          id: 'alert_cash_1',
          title: `${lowCashFlow.length}个产品现金流贡献低`,
          content: `这些产品占用大量现金但贡献率不足10%，建议优化或减少投入`,
          color: '#E6A23C',
          severity: 'warning',
          severityText: '中风险'
        })
      }
      
      return alerts
    },

    /**
     * 刷新AI推荐
     */
    refreshAIRecommendations() {
      this.recommendations = [
        ...this.generateStrategicRecommendations(),
        ...this.generateOperationalRecommendations()
      ]
    },

    /**
     * 从销售数据表同步
     */
    async syncFromSalesData() {
      // 模拟从销售数据表获取数据
      // 实际应用中，这里应该调用API获取真实的销售数据
      console.log('从销售数据表同步数据...')
      
      const productsStore = useProductsServicesStore()
      const products = productsStore.getAllProducts()
      
      products.forEach(product => {
        const existing = this.matrixData.find(p => p.id === product.id)
        if (existing) {
          // 更新销售数据
          existing.revenue = (Math.random() * 500000) + 50000
          existing.salesVolume = Math.floor(existing.revenue / (1000 + Math.random() * 5000))
        } else {
          // 新增产品
          this.addProductFromSource(product, 'salesData')
        }
      })
      
      this.saveToLocalStorage()
      return true
    },

    /**
     * 从产品数据库同步
     */
    async syncFromProductDatabase() {
      console.log('从产品数据库同步数据...')
      
      const productsStore = useProductsServicesStore()
      const products = productsStore.getAllProducts()
      
      products.forEach(product => {
        const existing = this.matrixData.find(p => p.id === product.id || p.name === product.name['zh-CN'])
        if (existing) {
          // 更新产品基本信息
          existing.name = product.name['zh-CN']
          existing.categoryId = product.category
          existing.categoryName = product.categoryName || product.name['zh-CN']
        } else {
          // 从产品库新增
          this.addProductFromSource(product, 'productDB')
        }
      })
      
      this.saveToLocalStorage()
      return true
    },

    /**
     * 从知识库同步
     */
    async syncFromKnowledgeBase() {
      console.log('从知识库同步数据...')
      
      const knowledgeStore = useKnowledgeBase()
      const knowledgeItems = knowledgeStore.items || []
      
      // 从知识库中提取产品相关的技术参数和市场分析
      knowledgeItems.forEach(item => {
        if (item.category === 'product' || item.tags?.includes('产品')) {
          // 尝试匹配现有产品
          const matchedProduct = this.matrixData.find(p => 
            item.title.includes(p.name) || p.name.includes(item.title)
          )
          
          if (matchedProduct) {
            // 从知识库内容中提取市场数据（示例逻辑）
            matchedProduct.knowledgeEnhanced = true
            matchedProduct.marketInsights = item.content?.substring(0, 200) || ''
          }
        }
      })
      
      this.saveToLocalStorage()
      return true
    },

    /**
     * 从学习库同步
     */
    async syncFromLearningLibrary() {
      console.log('从学习库同步数据...')
      
      const tighteningStore = useTighteningDataStore()
      
      // 从学习库获取历史趋势和预测数据
      this.matrixData.forEach(product => {
        // 模拟从学习库获取智能预测
        product.aiPrediction = {
          nextMonthRevenue: product.revenue * (1 + (Math.random() - 0.5) * 0.2),
          trendDirection: Math.random() > 0.5 ? 'up' : 'down',
          confidenceLevel: 0.7 + Math.random() * 0.3,
          riskLevel: Math.random() > 0.7 ? 'high' : (Math.random() > 0.5 ? 'medium' : 'low')
        }
      })
      
      this.saveToLocalStorage()
      return true
    },

    /**
     * 从数据源添加产品
     */
    addProductFromSource(sourceProduct, source) {
      const baseRevenue = 50000 + Math.random() * 500000
      const grossMargin = 15 + Math.random() * 30
      const netProfit = baseRevenue * (grossMargin / 100) * 0.6
      const inventoryDays = 30 + Math.random() * 90
      const cashFlowContribution = baseRevenue * (1 - inventoryDays / 365)
      const cashFlowRate = (cashFlowContribution / baseRevenue) * 100
      
      const newProduct = {
        id: sourceProduct.id || `prod_${Date.now()}`,
        name: sourceProduct.name?.['zh-CN'] || sourceProduct.name || '未命名产品',
        categoryId: sourceProduct.category || sourceProduct.categoryId || null,
        categoryName: sourceProduct.categoryName || '未分类',
        
        revenue: Math.round(baseRevenue),
        salesVolume: Math.floor(baseRevenue / (1000 + Math.random() * 5000)),
        grossMargin: Math.round(grossMargin * 10) / 10,
        netProfit: Math.round(netProfit),
        contributionRate: Math.round((netProfit / baseRevenue) * 1000) / 10,
        
        cashFlowContribution: Math.round(cashFlowContribution),
        cashFlowContributionRate: Math.round(cashFlowRate * 10) / 10,
        inventoryDays: Math.round(inventoryDays),
        paymentCycle: Math.round(30 + Math.random() * 60),
        
        marketGrowthRate: -5 + Math.random() * 20,
        marketShare: Math.random() * 15,
        lifecycle: this.determineLifecycle(baseRevenue, grossMargin),
        
        trends: this.generateTrendData(baseRevenue, grossMargin, 6),
        aiActions: [],
        
        dataSource: source,
        syncTime: new Date().toISOString()
      }
      
      newProduct.quadrant = this.determineQuadrant(newProduct.grossMargin, newProduct.cashFlowContributionRate)
      newProduct.aiActions = this.generateProductActions(newProduct)
      
      this.matrixData.push(newProduct)
    },

    /**
     * 手动添加产品
     */
    addProduct(productData) {
      const newProduct = {
        ...productData,
        id: productData.id || `manual_${Date.now()}`,
        trends: this.generateTrendData(productData.revenue || 100000, productData.grossMargin || 25, 6),
        aiActions: [],
        dataSource: 'manual',
        createTime: new Date().toISOString()
      }
      
      // 计算派生数据
      newProduct.cashFlowContributionRate = newProduct.revenue > 0 
        ? (newProduct.cashFlowContribution / newProduct.revenue) * 100 
        : 0
      newProduct.contributionRate = newProduct.revenue > 0
        ? (newProduct.netProfit / newProduct.revenue) * 100
        : 0
      newProduct.salesVolume = Math.floor(newProduct.revenue / (1000 + Math.random() * 5000))
      newProduct.marketGrowthRate = -5 + Math.random() * 20
      newProduct.marketShare = Math.random() * 15
      newProduct.lifecycle = this.determineLifecycle(newProduct.revenue, newProduct.grossMargin)
      
      // 确定象限
      newProduct.quadrant = this.determineQuadrant(newProduct.grossMargin, newProduct.cashFlowContributionRate)
      newProduct.aiActions = this.generateProductActions(newProduct)
      
      this.matrixData.push(newProduct)
      this.saveToLocalStorage()
      
      return newProduct
    },

    /**
     * 删除产品
     */
    deleteProduct(productId) {
      const index = this.matrixData.findIndex(p => p.id === productId)
      if (index > -1) {
        this.matrixData.splice(index, 1)
        this.saveToLocalStorage()
        return true
      }
      return false
    },

    /**
     * 更新产品
     */
    updateProduct(productId, updates) {
      const product = this.matrixData.find(p => p.id === productId)
      if (product) {
        Object.assign(product, updates)
        
        // 重新计算派生数据
        product.cashFlowContributionRate = product.revenue > 0 
          ? (product.cashFlowContribution / product.revenue) * 100 
          : 0
        product.quadrant = this.determineQuadrant(product.grossMargin, product.cashFlowContributionRate)
        product.aiActions = this.generateProductActions(product)
        
        this.saveToLocalStorage()
        return true
      }
      return false
    },

    /**
     * 检测异常
     */
    detectAnomalies() {
      this.alerts = this.generateAlerts()
    },

    /**
     * 应用推荐
     */
    applyRecommendation(recId) {
      const rec = this.recommendations.find(r => r.id === recId)
      if (rec) {
        // 记录应用日志
        console.log('应用推荐:', rec.title)
        // 这里可以执行具体的业务逻辑
        return true
      }
      return false
    },

    /**
     * 执行产品动作
     */
    executeProductAction(productId, actionId) {
      const product = this.matrixData.find(p => p.id === productId)
      if (product) {
        console.log(`执行动作: ${actionId} for ${product.name}`)
        // 这里可以执行具体的业务逻辑
        return true
      }
      return false
    },

    /**
     * 导出产品报告
     */
    exportProductReport(productId) {
      const product = this.matrixData.find(p => p.id === productId)
      if (!product) return
      
      const report = `
企业产品矩阵分析报告
=====================

产品名称: ${product.name}
产品大类: ${product.categoryName}
战略定位: ${this.getQuadrantName(product.quadrant)}

财务指标
--------
销售额: ¥${(product.revenue / 10000).toFixed(2)}万
毛利率: ${product.grossMargin}%
净利润: ¥${(product.netProfit / 10000).toFixed(2)}万
现金流贡献: ¥${(product.cashFlowContribution / 10000).toFixed(2)}万

运营指标
--------
库存周转天数: ${product.inventoryDays}天
回款周期: ${product.paymentCycle}天
市场增长率: ${product.marketGrowthRate}%

AI推荐动作
----------
${product.aiActions.map(a => `- ${a.text}`).join('\n')}

生成时间: ${new Date().toLocaleString('zh-CN')}
      `.trim()
      
      // 创建下载
      const blob = new Blob([report], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `产品矩阵报告_${product.name}_${new Date().toISOString().split('T')[0]}.txt`
      link.click()
      URL.revokeObjectURL(url)
    },

    /**
     * 获取象限名称
     */
    getQuadrantName(quadrant) {
      const names = {
        core: '核心战略产品',
        optimize: '优化提升产品',
        maintain: '低投入维持产品',
        potential: '潜力产品'
      }
      return names[quadrant] || '未分类'
    },

    /**
     * 设置象限过滤
     */
    setQuadrantFilter(quadrant) {
      this.filters.quadrant = this.filters.quadrant === quadrant ? null : quadrant
    },

    /**
     * 保存到本地存储
     */
    saveToLocalStorage() {
      localStorage.setItem('productMatrixData', JSON.stringify(this.matrixData))
      localStorage.setItem('matrixStrategyConfig', JSON.stringify(this.strategyConfig))
    },

    /**
     * 更新产品数据
     */
    updateProduct(productId, data) {
      const index = this.matrixData.findIndex(p => p.id === productId)
      if (index !== -1) {
        this.matrixData[index] = { ...this.matrixData[index], ...data }
        // 重新计算象限
        this.matrixData[index].quadrant = this.determineQuadrant(
          this.matrixData[index].grossMargin,
          this.matrixData[index].cashFlowContributionRate
        )
        this.saveToLocalStorage()
        return true
      }
      return false
    },

    /**
     * 添加产品
     */
    addProduct(product) {
      const newProduct = {
        id: `prod_custom_${Date.now()}`,
        ...product,
        quadrant: this.determineQuadrant(product.grossMargin, product.cashFlowContributionRate),
        aiActions: this.generateProductActions(product)
      }
      this.matrixData.push(newProduct)
      this.saveToLocalStorage()
      return newProduct
    },

    /**
     * 删除产品
     */
    deleteProduct(productId) {
      const index = this.matrixData.findIndex(p => p.id === productId)
      if (index !== -1) {
        this.matrixData.splice(index, 1)
        this.saveToLocalStorage()
        return true
      }
      return false
    }
  }
})
