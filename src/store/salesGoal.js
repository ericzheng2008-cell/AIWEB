import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useSalesGoalStore = defineStore('salesGoal', () => {
  // 个人目标
  const personalGoals = ref({
    revenueTarget: 1000000, // 销售额目标(元)
    newCustomerTarget: 10, // 新客户数目标
    visitTarget: 50, // 拜访次数目标
    contractTarget: 8, // 合同数量目标
    collectionRate: 85, // 回款率目标(%)
    winRate: 60 // 成交率目标(%)
  })

  // 个人完成情况
  const personalProgress = ref({
    currentRevenue: 780000,
    currentNewCustomers: 7,
    currentVisits: 38,
    currentContracts: 6,
    currentCollectionRate: 82,
    currentWinRate: 58
  })

  // 团队目标
  const teamGoals = ref({
    totalRevenue: 50000000,
    totalNewCustomers: 50,
    totalContracts: 40
  })

  // 团队成员数据
  const teamMembers = ref([
    {
      id: 1,
      name: '张三',
      department: '销售一部',
      revenueTarget: 10000000,
      currentRevenue: 12000000,
      completionRate: 120,
      newCustomerTarget: 10,
      currentNewCustomers: 8,
      visitCount: 45,
      riskLevel: '低风险',
      aiScore: 5,
      aiAdvice: '保持当前策略，继续发力'
    },
    {
      id: 2,
      name: '李四',
      department: '销售二部',
      revenueTarget: 10000000,
      currentRevenue: 9500000,
      completionRate: 95,
      newCustomerTarget: 10,
      currentNewCustomers: 7,
      visitCount: 38,
      riskLevel: '中风险',
      aiScore: 4,
      aiAdvice: '建议加强客户跟进频次'
    },
    {
      id: 3,
      name: '王五',
      department: '销售一部',
      revenueTarget: 10000000,
      currentRevenue: 8500000,
      completionRate: 85,
      newCustomerTarget: 10,
      currentNewCustomers: 6,
      visitCount: 42,
      riskLevel: '中风险',
      aiScore: 4,
      aiAdvice: '需要调整产品组合策略'
    }
  ])

  // 历史数据分析
  const historicalData = ref({
    monthlyRevenue: [
      { month: '2024-07', revenue: 950000, newCustomers: 8, visits: 42 },
      { month: '2024-08', revenue: 1020000, newCustomers: 9, visits: 45 },
      { month: '2024-09', revenue: 880000, newCustomers: 7, visits: 38 },
      { month: '2024-10', revenue: 1150000, newCustomers: 10, visits: 48 },
      { month: '2024-11', revenue: 1080000, newCustomers: 9, visits: 46 },
      { month: '2024-12', revenue: 780000, newCustomers: 7, visits: 38 }
    ],
    productContribution: [
      { product: '电池油压脉冲工具', revenue: 2800000, percentage: 35 },
      { product: '电池离合器工具', revenue: 2240000, percentage: 28 },
      { product: '焊机', revenue: 1760000, percentage: 22 },
      { product: '自动涂胶机', revenue: 1200000, percentage: 15 }
    ],
    customerTypeContribution: [
      { type: '大客户', revenue: 4500000, percentage: 56 },
      { type: '中小客户', revenue: 2500000, percentage: 31 },
      { type: '新客户', revenue: 1000000, percentage: 13 }
    ]
  })

  // 行动计划
  const actionPlans = ref([
    {
      id: 1,
      task: '跟进某汽车厂项目',
      customer: '某汽车制造',
      priority: '高',
      dueDate: '2025-12-20',
      status: '进行中',
      description: '商务谈判阶段，需加快推进'
    },
    {
      id: 2,
      task: '发送报价单',
      customer: '某电子公司',
      priority: '中',
      dueDate: '2025-12-21',
      status: '待开始',
      description: '客户已确认需求，准备报价'
    },
    {
      id: 3,
      task: '客户拜访',
      customer: '某机械厂',
      priority: '高',
      dueDate: '2025-12-22',
      status: '待开始',
      description: '初次拜访，了解客户需求'
    }
  ])

  // AI预测数据
  const forecastData = ref({
    // 短期预测 (3-6个月)
    shortTerm: {
      period: '3-6个月',
      predictedRevenue: 8500000,
      confidenceLevel: 85,
      confidenceInterval: '800-920万',
      seasonalityFactor: '旺季调整+15%',
      keyDrivers: ['季节性需求增加', '重点项目推进', '客户续约率提升'],
      monthlyForecast: [
        { month: '2025-01', revenue: 2800000, confidence: 88 },
        { month: '2025-02', revenue: 2950000, confidence: 86 },
        { month: '2025-03', revenue: 3100000, confidence: 84 },
        { month: '2025-04', revenue: 3200000, confidence: 82 },
        { month: '2025-05', revenue: 3350000, confidence: 80 },
        { month: '2025-06', revenue: 3500000, confidence: 78 }
      ]
    },
    // 中期预测 (1年)
    midTerm: {
      period: '1年',
      predictedRevenue: 36000000,
      confidenceLevel: 72,
      productLifecycle: '成长期',
      contractCycle: '平均6个月',
      keyFactors: ['团队协作优化', '产品组合调整', '重点客户深度开发'],
      quarterlyForecast: [
        { quarter: 'Q1', revenue: 8500000, confidence: 75 },
        { quarter: 'Q2', revenue: 9200000, confidence: 72 },
        { quarter: 'Q3', revenue: 10500000, confidence: 70 },
        { quarter: 'Q4', revenue: 11800000, confidence: 68 }
      ]
    },
    // 长期预测 (3年)
    longTerm: {
      period: '3年',
      predictedRevenue: 120000000,
      confidenceLevel: 55,
      marketGrowthRate: 18,
      strategyRecommendation: '扩大市场份额',
      keyTrends: ['市场规模扩大', '技术升级需求', '行业整合加速'],
      yearlyForecast: [
        { year: '2025', revenue: 36000000, confidence: 60 },
        { year: '2026', revenue: 42000000, confidence: 55 },
        { year: '2027', revenue: 48000000, confidence: 50 }
      ]
    }
  })

  // AI优化建议
  const optimizationAdvice = ref({
    goalAdjustments: [
      {
        id: 1,
        priority: '高优先级',
        type: 'danger',
        title: '调整Q1销售目标',
        description: '根据市场趋势和历史数据分析，建议将Q1目标上调15%，当前市场环境有利',
        impact: '+15%销售额',
        actionItems: ['重新分配团队资源', '加强高潜客户开发', '优化产品组合']
      },
      {
        id: 2,
        priority: '中优先级',
        type: 'warning',
        title: '优化产品组合目标',
        description: '建议增加高利润产品的销售占比，从当前22%提升至35%',
        impact: '+8%利润率',
        actionItems: ['加强高利润产品培训', '调整激励机制', '优化客户匹配']
      }
    ],
    actionStrategies: [
      {
        id: 1,
        priority: '高优先级',
        type: 'success',
        title: '重点客户深度开发',
        description: '建议将80%的资源集中于前10大客户，预计可提升成交率20%',
        impact: '+20%成交率',
        actionItems: ['建立VIP客户服务体系', '增加拜访频次', '提供定制化方案']
      },
      {
        id: 2,
        priority: '中优先级',
        type: 'primary',
        title: '提升客户拜访效率',
        description: '建议使用智能路线规划工具，预计可提升30%拜访效率',
        impact: '+30%拜访效率',
        actionItems: ['部署智能路线规划系统', '优化拜访流程', '加强时间管理']
      },
      {
        id: 3,
        priority: '中优先级',
        type: 'info',
        title: '新客户开发策略',
        description: '当前新客户占比偏低，建议加强市场推广和线索获取',
        impact: '+40%新客户',
        actionItems: ['增加市场活动', '优化线索跟进流程', '提升转化率']
      }
    ]
  })

  // AI智能建议
  const aiSuggestions = ref([
    {
      id: 1,
      type: 'warning',
      title: '目标完成预警',
      content: '本月销售额完成度仅78%,距离目标还有差距。建议加强以下3个高潜客户的跟进: 某汽车厂、某电子公司、某机械厂',
      priority: 'high',
      actions: ['立即电话跟进', '安排现场拜访', '发送定制方案']
    },
    {
      id: 2,
      type: 'success',
      title: '优质商机提醒',
      content: '某汽车厂项目进展顺利，AI预测赢率达75%，建议本周内完成合同签订',
      priority: 'high',
      actions: ['准备合同文本', '协调法务审核', '安排签约会议']
    },
    {
      id: 3,
      type: 'info',
      title: '新客户开发建议',
      content: '当前新客户数7个,低于目标10个。建议增加市场活动和线索跟进',
      priority: 'medium',
      actions: ['参加行业展会', '优化线索跟进', '加强电话开发']
    }
  ])

  // Computed
  const personalCompletionRate = computed(() => {
    return Math.round((personalProgress.value.currentRevenue / personalGoals.value.revenueTarget) * 100)
  })

  const teamAvgCompletionRate = computed(() => {
    const total = teamMembers.value.reduce((sum, member) => sum + member.completionRate, 0)
    return Math.round(total / teamMembers.value.length)
  })

  // Actions
  const setPersonalGoal = (goals) => {
    personalGoals.value = { ...personalGoals.value, ...goals }
  }

  const updatePersonalProgress = (progress) => {
    personalProgress.value = { ...personalProgress.value, ...progress }
  }

  const setTeamGoal = (goals) => {
    teamGoals.value = { ...teamGoals.value, ...goals }
  }

  const updateTeamMember = (memberId, data) => {
    const index = teamMembers.value.findIndex(m => m.id === memberId)
    if (index !== -1) {
      teamMembers.value[index] = { ...teamMembers.value[index], ...data }
    }
  }

  const addActionPlan = (plan) => {
    actionPlans.value.push({
      id: Date.now(),
      ...plan,
      status: '待开始'
    })
  }

  const updateActionPlan = (planId, data) => {
    const index = actionPlans.value.findIndex(p => p.id === planId)
    if (index !== -1) {
      actionPlans.value[index] = { ...actionPlans.value[index], ...data }
    }
  }

  const completeActionPlan = (planId) => {
    updateActionPlan(planId, { status: '已完成' })
  }

  const generateAIGoalRecommendation = () => {
    // AI基于历史数据生成推荐目标
    const avgMonthlyRevenue = historicalData.value.monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0) / historicalData.value.monthlyRevenue.length
    const growthRate = 1.15 // 建议增长15%
    
    return {
      revenueTarget: Math.round(avgMonthlyRevenue * growthRate),
      newCustomerTarget: Math.round(historicalData.value.monthlyRevenue[historicalData.value.monthlyRevenue.length - 1].newCustomers * 1.2),
      visitTarget: Math.round(historicalData.value.monthlyRevenue[historicalData.value.monthlyRevenue.length - 1].visits * 1.1),
      contractTarget: 10,
      collectionRate: 88,
      winRate: 65
    }
  }

  const generateWeeklyActionPlan = () => {
    // AI根据目标和客户情况生成本周行动计划
    return [
      {
        task: '跟进高潜客户-某汽车厂',
        customer: '某汽车厂',
        priority: '高',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: 'AI检测到该客户决策进度加快，建议立即跟进'
      },
      {
        task: '发送定制方案-某电子公司',
        customer: '某电子公司',
        priority: '中',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: '客户已浏览产品资料3次，建议发送定制方案'
      },
      {
        task: '新客户开发-目标行业',
        customer: '待分配',
        priority: '中',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: '新客户数低于目标，建议加强开发'
      }
    ]
  }

  const analyzeGoalDeviation = () => {
    // 分析目标偏差并给出建议
    const revenueDeviation = ((personalProgress.value.currentRevenue - personalGoals.value.revenueTarget) / personalGoals.value.revenueTarget * 100).toFixed(1)
    const customerDeviation = personalProgress.value.currentNewCustomers - personalGoals.value.newCustomerTarget
    
    return {
      revenueDeviation,
      customerDeviation,
      isOnTrack: personalCompletionRate.value >= 80,
      recommendations: personalCompletionRate.value < 80 ? [
        '加强高潜客户跟进',
        '优化产品组合',
        '提升拜访效率'
      ] : [
        '保持当前策略',
        '关注新客户开发',
        '优化客户满意度'
      ]
    }
  }

  return {
    // State
    personalGoals,
    personalProgress,
    teamGoals,
    teamMembers,
    historicalData,
    actionPlans,
    forecastData,
    optimizationAdvice,
    aiSuggestions,
    
    // Computed
    personalCompletionRate,
    teamAvgCompletionRate,
    
    // Actions
    setPersonalGoal,
    updatePersonalProgress,
    setTeamGoal,
    updateTeamMember,
    addActionPlan,
    updateActionPlan,
    completeActionPlan,
    generateAIGoalRecommendation,
    generateWeeklyActionPlan,
    analyzeGoalDeviation
  }
})
