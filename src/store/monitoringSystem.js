/**
 * 监控与优化系统
 * 提供实时性能监控、智能告警、数据分析和资源优化功能
 * @module monitoringSystem
 * @version 1.0.0
 * @date 2025-12-15
 */

import { reactive, computed } from 'vue'
import { defineStore } from 'pinia'
import { useAgentRegistryStore } from './agentRegistry'
import useKnowledgeBase from './knowledgeBase'
import useLearningEngine from './learningEngine'

export const useMonitoringSystemStore = defineStore('monitoringSystem', () => {
  // ===== 状态管理 =====
  
  const state = reactive({
    // 性能指标
    metrics: [],
    
    // 告警规则
    alertRules: [
      {
        id: 1,
        name: '智能体响应时间过长',
        type: 'performance',
        condition: 'responseTime > 3000',
        threshold: 3000,
        severity: 'warning',
        enabled: true,
        description: '智能体平均响应时间超过3秒',
        actions: ['notify', 'log']
      },
      {
        id: 2,
        name: '智能体错误率过高',
        type: 'error',
        condition: 'errorRate > 0.1',
        threshold: 0.1,
        severity: 'critical',
        enabled: true,
        description: '智能体错误率超过10%',
        actions: ['notify', 'log', 'auto_disable']
      },
      {
        id: 3,
        name: '知识质量低下',
        type: 'quality',
        condition: 'qualityScore < 60',
        threshold: 60,
        severity: 'warning',
        enabled: true,
        description: '知识条目质量评分低于60分',
        actions: ['notify', 'create_task']
      },
      {
        id: 4,
        name: '系统可用性低',
        type: 'availability',
        condition: 'availability < 0.95',
        threshold: 0.95,
        severity: 'critical',
        enabled: true,
        description: '系统整体可用性低于95%',
        actions: ['notify', 'log', 'alert_admin']
      },
      {
        id: 5,
        name: '用户满意度低',
        type: 'satisfaction',
        condition: 'satisfaction < 3.5',
        threshold: 3.5,
        severity: 'warning',
        enabled: true,
        description: '用户平均满意度评分低于3.5星',
        actions: ['notify', 'create_task']
      }
    ],
    
    // 告警记录
    alerts: [],
    
    // 性能基准
    benchmarks: {
      responseTime: { target: 2000, current: 1500 },
      errorRate: { target: 0.05, current: 0.02 },
      availability: { target: 0.99, current: 0.98 },
      userSatisfaction: { target: 4.0, current: 4.2 },
      knowledgeQuality: { target: 80, current: 75 }
    },
    
    // 资源使用情况
    resources: {
      agentCount: 0,
      knowledgeCount: 0,
      interactionCount: 0,
      storageUsed: 0,
      storageLimit: 10485760, // 10MB
      cpuUsage: 0,
      memoryUsage: 0
    },
    
    // 优化建议
    optimizationSuggestions: [],
    
    // 监控配置
    config: {
      metricsRetentionDays: 30,
      alertRetentionDays: 90,
      samplingInterval: 60000, // 1分钟
      autoOptimization: true,
      enableAlerts: true
    }
  })

  // ===== 计算属性 =====
  
  // 系统健康度 (0-100)
  const systemHealth = computed(() => {
    const scores = []
    
    // 性能评分 (响应时间)
    const avgResponseTime = state.benchmarks.responseTime.current
    const responseScore = Math.max(0, 100 - (avgResponseTime / 50))
    scores.push(responseScore)
    
    // 可用性评分
    const availabilityScore = state.benchmarks.availability.current * 100
    scores.push(availabilityScore)
    
    // 错误率评分
    const errorScore = Math.max(0, 100 - state.benchmarks.errorRate.current * 1000)
    scores.push(errorScore)
    
    // 质量评分
    scores.push(state.benchmarks.knowledgeQuality.current)
    
    // 用户满意度评分
    const satisfactionScore = (state.benchmarks.userSatisfaction.current / 5) * 100
    scores.push(satisfactionScore)
    
    // 计算平均分
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
    return Math.round(avgScore)
  })
  
  // 活跃告警数
  const activeAlertsCount = computed(() => {
    return state.alerts.filter(a => a.status === 'active').length
  })
  
  // 严重告警数
  const criticalAlertsCount = computed(() => {
    return state.alerts.filter(a => a.severity === 'critical' && a.status === 'active').length
  })
  
  // 资源使用率
  const storageUsagePercent = computed(() => {
    return Math.round((state.resources.storageUsed / state.resources.storageLimit) * 100)
  })
  
  // 最近24小时指标
  const last24HoursMetrics = computed(() => {
    const cutoff = Date.now() - 24 * 60 * 60 * 1000
    return state.metrics.filter(m => new Date(m.timestamp).getTime() > cutoff)
  })

  // ===== 核心功能 =====
  
  /**
   * 1. 性能指标收集
   */
  
  // 记录性能指标
  function recordMetric(metricData) {
    const metric = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...metricData
    }
    
    state.metrics.push(metric)
    
    // 更新基准数据
    updateBenchmarks()
    
    // 检查告警条件
    if (state.config.enableAlerts) {
      checkAlertRules(metric)
    }
    
    // 清理旧指标
    cleanupOldMetrics()
    
    return metric
  }
  
  // 批量记录指标
  function recordMetrics(metricsArray) {
    metricsArray.forEach(m => recordMetric(m))
  }
  
  // 更新基准数据
  function updateBenchmarks() {
    const agentStore = useAgentRegistryStore()
    const knowledgeStore = useKnowledgeBase()
    const learningStore = useLearningEngine()
    
    // 计算平均响应时间
    const responseTimes = state.metrics
      .filter(m => m.type === 'response_time')
      .slice(-100)
      .map(m => m.value)
    state.benchmarks.responseTime.current = responseTimes.length > 0
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
      : 0
    
    // 计算错误率
    const totalCalls = agentStore.agents.reduce((sum, a) => sum + (a.stats?.totalCalls || 0), 0)
    const failedCalls = agentStore.agents.reduce((sum, a) => sum + (a.stats?.failedCalls || 0), 0)
    state.benchmarks.errorRate.current = totalCalls > 0 ? failedCalls / totalCalls : 0
    
    // 计算可用性
    const availabilities = agentStore.agents.map(a => a.stats?.availability || 1.0)
    state.benchmarks.availability.current = availabilities.length > 0
      ? availabilities.reduce((a, b) => a + b, 0) / availabilities.length
      : 1.0
    
    // 计算用户满意度
    const feedbacks = learningStore.userFeedbacks
    const ratings = feedbacks.map(f => f.rating)
    state.benchmarks.userSatisfaction.current = ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0
    
    // 计算知识质量
    const qualities = knowledgeStore.knowledgeItems.map(k => k.qualityScore || 0)
    state.benchmarks.knowledgeQuality.current = qualities.length > 0
      ? Math.round(qualities.reduce((a, b) => a + b, 0) / qualities.length)
      : 0
    
    // 更新资源使用
    state.resources.agentCount = agentStore.agents.length
    state.resources.knowledgeCount = knowledgeStore.knowledgeItems.length
    state.resources.interactionCount = agentStore.interactions.length
    state.resources.storageUsed = estimateStorageUsage()
  }
  
  // 估算存储使用
  function estimateStorageUsage() {
    try {
      const data = {
        metrics: state.metrics,
        alerts: state.alerts,
        suggestions: state.optimizationSuggestions
      }
      return new Blob([JSON.stringify(data)]).size
    } catch (e) {
      return 0
    }
  }
  
  /**
   * 2. 智能告警系统
   */
  
  // 检查告警规则
  function checkAlertRules(metric) {
    state.alertRules
      .filter(rule => rule.enabled)
      .forEach(rule => {
        if (shouldTriggerAlert(rule, metric)) {
          createAlert(rule, metric)
        }
      })
  }
  
  // 判断是否触发告警
  function shouldTriggerAlert(rule, metric) {
    switch (rule.type) {
      case 'performance':
        return metric.type === 'response_time' && metric.value > rule.threshold
      case 'error':
        return state.benchmarks.errorRate.current > rule.threshold
      case 'quality':
        return state.benchmarks.knowledgeQuality.current < rule.threshold
      case 'availability':
        return state.benchmarks.availability.current < rule.threshold
      case 'satisfaction':
        return state.benchmarks.userSatisfaction.current < rule.threshold
      default:
        return false
    }
  }
  
  // 创建告警
  function createAlert(rule, metric) {
    // 检查是否已有相同的活跃告警
    const existingAlert = state.alerts.find(
      a => a.ruleId === rule.id && a.status === 'active'
    )
    if (existingAlert) return existingAlert
    
    const alert = {
      id: Date.now(),
      ruleId: rule.id,
      ruleName: rule.name,
      type: rule.type,
      severity: rule.severity,
      message: generateAlertMessage(rule, metric),
      timestamp: new Date().toISOString(),
      status: 'active',
      acknowledgedBy: null,
      acknowledgedAt: null,
      resolvedAt: null,
      actions: rule.actions,
      metadata: {
        metric: metric,
        threshold: rule.threshold,
        currentValue: getCurrentValue(rule.type)
      }
    }
    
    state.alerts.unshift(alert)
    
    // 执行告警动作
    executeAlertActions(alert, rule)
    
    // 清理旧告警
    cleanupOldAlerts()
    
    return alert
  }
  
  // 获取当前值
  function getCurrentValue(type) {
    switch (type) {
      case 'performance':
        return state.benchmarks.responseTime.current
      case 'error':
        return state.benchmarks.errorRate.current
      case 'quality':
        return state.benchmarks.knowledgeQuality.current
      case 'availability':
        return state.benchmarks.availability.current
      case 'satisfaction':
        return state.benchmarks.userSatisfaction.current
      default:
        return 0
    }
  }
  
  // 生成告警消息
  function generateAlertMessage(rule, metric) {
    const currentValue = getCurrentValue(rule.type)
    return `${rule.description} - 当前值: ${formatValue(currentValue, rule.type)}, 阈值: ${formatValue(rule.threshold, rule.type)}`
  }
  
  // 格式化值
  function formatValue(value, type) {
    switch (type) {
      case 'performance':
        return `${value}ms`
      case 'error':
      case 'availability':
        return `${(value * 100).toFixed(2)}%`
      case 'quality':
        return `${value}分`
      case 'satisfaction':
        return `${value.toFixed(1)}星`
      default:
        return value
    }
  }
  
  // 执行告警动作
  function executeAlertActions(alert, rule) {
    rule.actions.forEach(action => {
      switch (action) {
        case 'notify':
          console.log(`[告警通知] ${alert.message}`)
          break
        case 'log':
          logAlert(alert)
          break
        case 'auto_disable':
          autoDisableAgent(alert)
          break
        case 'create_task':
          createOptimizationTask(alert)
          break
        case 'alert_admin':
          alertAdmin(alert)
          break
      }
    })
  }
  
  // 记录告警日志
  function logAlert(alert) {
    recordMetric({
      type: 'alert_triggered',
      category: 'system',
      value: 1,
      metadata: {
        alertId: alert.id,
        severity: alert.severity,
        ruleName: alert.ruleName
      }
    })
  }
  
  // 自动禁用智能体
  function autoDisableAgent(alert) {
    if (alert.metadata?.metric?.agentId) {
      const agentStore = useAgentRegistryStore()
      const agent = agentStore.agents.find(a => a.id === alert.metadata.metric.agentId)
      if (agent && agent.status === 'active') {
        agentStore.updateAgent(agent.id, { status: 'inactive' })
        console.log(`[自动禁用] 智能体 ${agent.name} 已被自动禁用`)
      }
    }
  }
  
  // 创建优化任务
  function createOptimizationTask(alert) {
    const learningStore = useLearningEngineStore()
    learningStore.createLearningTask({
      type: 'optimize',
      description: `优化告警: ${alert.message}`,
      priority: alert.severity === 'critical' ? 'high' : 'medium',
      metadata: {
        alertId: alert.id,
        alertType: alert.type
      }
    })
  }
  
  // 通知管理员
  function alertAdmin(alert) {
    console.error(`[管理员告警] ${alert.severity.toUpperCase()}: ${alert.message}`)
    // 实际应用中可以发送邮件、短信、钉钉等
  }
  
  // 确认告警
  function acknowledgeAlert(alertId, acknowledgedBy) {
    const alert = state.alerts.find(a => a.id === alertId)
    if (alert && alert.status === 'active') {
      alert.status = 'acknowledged'
      alert.acknowledgedBy = acknowledgedBy
      alert.acknowledgedAt = new Date().toISOString()
      return true
    }
    return false
  }
  
  // 解决告警
  function resolveAlert(alertId, resolution) {
    const alert = state.alerts.find(a => a.id === alertId)
    if (alert) {
      alert.status = 'resolved'
      alert.resolvedAt = new Date().toISOString()
      alert.resolution = resolution
      return true
    }
    return false
  }
  
  /**
   * 3. 数据分析与可视化
   */
  
  // 获取趋势数据
  function getTrendData(metricType, timeRange = '24h') {
    const cutoff = getTimeRangeCutoff(timeRange)
    return state.metrics
      .filter(m => m.type === metricType && new Date(m.timestamp).getTime() > cutoff)
      .map(m => ({
        timestamp: m.timestamp,
        value: m.value
      }))
  }
  
  // 获取时间范围截止点
  function getTimeRangeCutoff(range) {
    const now = Date.now()
    const ranges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000
    }
    return now - (ranges[range] || ranges['24h'])
  }
  
  // 获取性能统计
  function getPerformanceStats(agentId = null) {
    let metrics = state.metrics.filter(m => m.type === 'response_time')
    if (agentId) {
      metrics = metrics.filter(m => m.agentId === agentId)
    }
    
    if (metrics.length === 0) return null
    
    const values = metrics.map(m => m.value).sort((a, b) => a - b)
    return {
      count: values.length,
      avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
      min: values[0],
      max: values[values.length - 1],
      p50: values[Math.floor(values.length * 0.5)],
      p95: values[Math.floor(values.length * 0.95)],
      p99: values[Math.floor(values.length * 0.99)]
    }
  }
  
  // 获取错误分析
  function getErrorAnalysis(timeRange = '24h') {
    const cutoff = getTimeRangeCutoff(timeRange)
    const errors = state.metrics.filter(
      m => m.type === 'error' && new Date(m.timestamp).getTime() > cutoff
    )
    
    // 按错误类型分组
    const byType = {}
    errors.forEach(e => {
      const type = e.metadata?.errorType || 'unknown'
      byType[type] = (byType[type] || 0) + 1
    })
    
    // 按智能体分组
    const byAgent = {}
    errors.forEach(e => {
      const agentId = e.agentId || 'unknown'
      byAgent[agentId] = (byAgent[agentId] || 0) + 1
    })
    
    return {
      total: errors.length,
      byType,
      byAgent,
      topErrors: Object.entries(byType)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
    }
  }
  
  /**
   * 4. 资源优化引擎
   */
  
  // 生成优化建议
  function generateOptimizationSuggestions() {
    const suggestions = []
    
    // 检查响应时间
    if (state.benchmarks.responseTime.current > state.benchmarks.responseTime.target) {
      suggestions.push({
        id: Date.now() + 1,
        type: 'performance',
        priority: 'high',
        title: '优化智能体响应时间',
        description: `当前平均响应时间${state.benchmarks.responseTime.current}ms，超过目标${state.benchmarks.responseTime.target}ms`,
        actions: [
          '优化智能体算法',
          '增加缓存机制',
          '优化数据库查询',
          '考虑异步处理'
        ],
        estimatedImpact: '响应时间可降低30-50%',
        effort: 'medium',
        createdAt: new Date().toISOString()
      })
    }
    
    // 检查错误率
    if (state.benchmarks.errorRate.current > state.benchmarks.errorRate.target) {
      suggestions.push({
        id: Date.now() + 2,
        type: 'reliability',
        priority: 'high',
        title: '降低系统错误率',
        description: `当前错误率${(state.benchmarks.errorRate.current * 100).toFixed(2)}%，超过目标${(state.benchmarks.errorRate.target * 100).toFixed(2)}%`,
        actions: [
          '增加错误处理机制',
          '添加重试逻辑',
          '优化输入验证',
          '增强异常监控'
        ],
        estimatedImpact: '错误率可降低40-60%',
        effort: 'medium',
        createdAt: new Date().toISOString()
      })
    }
    
    // 检查知识质量
    if (state.benchmarks.knowledgeQuality.current < state.benchmarks.knowledgeQuality.target) {
      suggestions.push({
        id: Date.now() + 3,
        type: 'quality',
        priority: 'medium',
        title: '提升知识库质量',
        description: `当前平均质量评分${state.benchmarks.knowledgeQuality.current}分，低于目标${state.benchmarks.knowledgeQuality.target}分`,
        actions: [
          '审核低质量知识',
          '补充缺失信息',
          '更新过时内容',
          '增加使用示例'
        ],
        estimatedImpact: '知识质量可提升20-30%',
        effort: 'high',
        createdAt: new Date().toISOString()
      })
    }
    
    // 检查存储使用
    if (storageUsagePercent.value > 80) {
      suggestions.push({
        id: Date.now() + 4,
        type: 'resource',
        priority: 'medium',
        title: '优化存储空间',
        description: `存储使用率${storageUsagePercent.value}%，接近上限`,
        actions: [
          '清理历史数据',
          '压缩存储数据',
          '归档旧记录',
          '优化数据结构'
        ],
        estimatedImpact: '存储空间可节省30-40%',
        effort: 'low',
        createdAt: new Date().toISOString()
      })
    }
    
    // 检查用户满意度
    if (state.benchmarks.userSatisfaction.current < state.benchmarks.userSatisfaction.target) {
      suggestions.push({
        id: Date.now() + 5,
        type: 'ux',
        priority: 'high',
        title: '提升用户满意度',
        description: `当前用户满意度${state.benchmarks.userSatisfaction.current.toFixed(1)}星，低于目标${state.benchmarks.userSatisfaction.target}星`,
        actions: [
          '分析低分反馈',
          '优化用户体验',
          '增强交互设计',
          '提供更多帮助'
        ],
        estimatedImpact: '满意度可提升0.5-1.0星',
        effort: 'medium',
        createdAt: new Date().toISOString()
      })
    }
    
    state.optimizationSuggestions = suggestions
    return suggestions
  }
  
  // 应用优化建议
  function applyOptimization(suggestionId) {
    const suggestion = state.optimizationSuggestions.find(s => s.id === suggestionId)
    if (!suggestion) return false
    
    // 创建学习任务
    const learningStore = useLearningEngine()
    learningStore.createLearningTask({
      type: 'optimize',
      description: suggestion.title,
      priority: suggestion.priority,
      metadata: {
        suggestionId: suggestion.id,
        actions: suggestion.actions
      }
    })
    
    // 记录应用
    recordMetric({
      type: 'optimization_applied',
      category: 'system',
      value: 1,
      metadata: {
        suggestionId: suggestion.id,
        type: suggestion.type
      }
    })
    
    return true
  }
  
  /**
   * 5. 性能基准测试
   */
  
  // 运行基准测试
  async function runBenchmark(testType = 'all') {
    const results = {
      timestamp: new Date().toISOString(),
      tests: []
    }
    
    if (testType === 'all' || testType === 'agent') {
      results.tests.push(await benchmarkAgentPerformance())
    }
    
    if (testType === 'all' || testType === 'knowledge') {
      results.tests.push(await benchmarkKnowledgeSearch())
    }
    
    if (testType === 'all' || testType === 'learning') {
      results.tests.push(await benchmarkLearningEngine())
    }
    
    // 记录基准测试结果
    recordMetric({
      type: 'benchmark_completed',
      category: 'system',
      value: results.tests.length,
      metadata: results
    })
    
    return results
  }
  
  // 智能体性能基准测试
  async function benchmarkAgentPerformance() {
    const agentStore = useAgentRegistryStore()
    const startTime = performance.now()
    
    // 模拟调用所有智能体
    const callPromises = agentStore.agents.map(agent => 
      agentStore.callAgent(agent.id, { test: true })
    )
    
    await Promise.all(callPromises)
    
    const endTime = performance.now()
    const duration = Math.round(endTime - startTime)
    
    return {
      name: 'Agent Performance',
      duration,
      agentCount: agentStore.agents.length,
      avgPerAgent: Math.round(duration / agentStore.agents.length),
      passed: duration < 5000
    }
  }
  
  // 知识搜索性能基准测试
  async function benchmarkKnowledgeSearch() {
    const knowledgeStore = useKnowledgeBaseStore()
    const startTime = performance.now()
    
    // 执行多次搜索
    const queries = ['拧紧', '工艺', '设备', '品牌', '优化']
    queries.forEach(q => knowledgeStore.searchKnowledge(q))
    
    const endTime = performance.now()
    const duration = Math.round(endTime - startTime)
    
    return {
      name: 'Knowledge Search',
      duration,
      queryCount: queries.length,
      avgPerQuery: Math.round(duration / queries.length),
      passed: duration < 1000
    }
  }
  
  // 学习引擎性能基准测试
  async function benchmarkLearningEngine() {
    const learningStore = useLearningEngine()
    const startTime = performance.now()
    
    // 执行质量评估
    learningStore.evaluateAllKnowledge()
    
    const endTime = performance.now()
    const duration = Math.round(endTime - startTime)
    
    return {
      name: 'Learning Engine',
      duration,
      passed: duration < 3000
    }
  }
  
  /**
   * 6. 数据清理与维护
   */
  
  // 清理旧指标
  function cleanupOldMetrics() {
    const cutoff = Date.now() - state.config.metricsRetentionDays * 24 * 60 * 60 * 1000
    state.metrics = state.metrics.filter(
      m => new Date(m.timestamp).getTime() > cutoff
    )
  }
  
  // 清理旧告警
  function cleanupOldAlerts() {
    const cutoff = Date.now() - state.config.alertRetentionDays * 24 * 60 * 60 * 1000
    state.alerts = state.alerts.filter(
      a => new Date(a.timestamp).getTime() > cutoff || a.status === 'active'
    )
  }
  
  // 重置所有数据
  function resetAllData() {
    state.metrics = []
    state.alerts = []
    state.optimizationSuggestions = []
    updateBenchmarks()
  }
  
  /**
   * 7. 告警规则管理
   */
  
  // 添加告警规则
  function addAlertRule(ruleData) {
    const newId = Math.max(...state.alertRules.map(r => r.id), 0) + 1
    const rule = {
      id: newId,
      enabled: true,
      actions: ['notify', 'log'],
      ...ruleData
    }
    state.alertRules.push(rule)
    return newId
  }
  
  // 更新告警规则
  function updateAlertRule(ruleId, updates) {
    const rule = state.alertRules.find(r => r.id === ruleId)
    if (rule) {
      Object.assign(rule, updates)
      return true
    }
    return false
  }
  
  // 删除告警规则
  function deleteAlertRule(ruleId) {
    const index = state.alertRules.findIndex(r => r.id === ruleId)
    if (index !== -1) {
      state.alertRules.splice(index, 1)
      return true
    }
    return false
  }
  
  // 启用/禁用告警规则
  function toggleAlertRule(ruleId, enabled) {
    return updateAlertRule(ruleId, { enabled })
  }

  // ===== 初始化 =====
  
  // 启动监控
  let monitoringInterval = null
  
  function startMonitoring() {
    if (monitoringInterval) return
    
    // 定期收集指标
    monitoringInterval = setInterval(() => {
      collectSystemMetrics()
      generateOptimizationSuggestions()
    }, state.config.samplingInterval)
    
    console.log('[监控系统] 已启动')
  }
  
  function stopMonitoring() {
    if (monitoringInterval) {
      clearInterval(monitoringInterval)
      monitoringInterval = null
      console.log('[监控系统] 已停止')
    }
  }
  
  // 收集系统指标
  function collectSystemMetrics() {
    updateBenchmarks()
    
    // 记录系统健康度
    recordMetric({
      type: 'system_health',
      category: 'system',
      value: systemHealth.value
    })
  }

  // ===== 返回 API =====
  
  return {
    // 状态
    state,
    
    // 计算属性
    systemHealth,
    activeAlertsCount,
    criticalAlertsCount,
    storageUsagePercent,
    last24HoursMetrics,
    
    // 性能指标
    recordMetric,
    recordMetrics,
    updateBenchmarks,
    getTrendData,
    getPerformanceStats,
    getErrorAnalysis,
    
    // 告警系统
    checkAlertRules,
    createAlert,
    acknowledgeAlert,
    resolveAlert,
    addAlertRule,
    updateAlertRule,
    deleteAlertRule,
    toggleAlertRule,
    
    // 优化建议
    generateOptimizationSuggestions,
    applyOptimization,
    
    // 性能基准测试
    runBenchmark,
    
    // 监控控制
    startMonitoring,
    stopMonitoring,
    
    // 数据维护
    cleanupOldMetrics,
    cleanupOldAlerts,
    resetAllData
  }
})
