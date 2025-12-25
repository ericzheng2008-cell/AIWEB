/**
 * Phase 3: Agent执行层
 * 功能: 工具调用、任务拆解、主动跟进
 */

// ========== 工具调用系统 (Tool Calling / Function Calling) ==========
export class ToolRegistry {
  constructor() {
    this.tools = new Map()
    this.registerDefaultTools()
  }

  /**
   * 注册默认工具
   */
  registerDefaultTools() {
    // 营销文案生成工具
    this.registerTool({
      name: 'generateMarketingCopy',
      description: '生成营销文案',
      parameters: {
        platform: '平台(小红书/微博/微信)',
        target: '目标人群',
        product: '产品名称',
        count: '生成数量'
      },
      execute: async (params) => {
        return {
          success: true,
          copies: [
            `🌟 ${params.product}专为${params.target}打造!`,
            `💎 ${params.target}的首选!${params.product}限时优惠!`,
            `✨ 发现好物!${params.product}让${params.target}生活更美好`
          ]
        }
      }
    })

    // 数据分析工具
    this.registerTool({
      name: 'analyzeData',
      description: '分析CRM/后台数据',
      parameters: {
        dataType: '数据类型(转化率/销售额/用户行为)',
        timeRange: '时间范围',
        dimension: '分析维度'
      },
      execute: async (params) => {
        return {
          success: true,
          analysis: {
            trend: '上升',
            insights: [
              `${params.dataType}在${params.timeRange}内增长15%`,
              '主要增长来源于移动端用户',
              '建议加大移动端投放'
            ],
            recommendations: [
              '优化移动端用户体验',
              '增加移动端专属优惠',
              '加强社交媒体运营'
            ]
          }
        }
      }
    })

    // 搜索增强工具
    this.registerTool({
      name: 'searchWeb',
      description: '实时搜索最新信息',
      parameters: {
        query: '搜索关键词',
        source: '来源(Google/百度/行业报告)'
      },
      execute: async (params) => {
        return {
          success: true,
          results: [
            {
              title: `${params.query}最新趋势报告`,
              summary: '2025年该领域呈现快速增长态势...',
              source: params.source,
              date: new Date().toISOString().split('T')[0]
            }
          ]
        }
      }
    })

    // 任务分配工具
    this.registerTool({
      name: 'assignTask',
      description: '分配任务给团队成员',
      parameters: {
        userId: '用户ID',
        taskTitle: '任务标题',
        description: '任务描述',
        priority: '优先级(高/中/低)',
        deadline: '截止日期'
      },
      execute: async (params) => {
        return {
          success: true,
          taskId: `task-${Date.now()}`,
          message: `任务已分配给${params.userId}`,
          notification: '已发送通知'
        }
      }
    })

    // 报表生成工具
    this.registerTool({
      name: 'generateReport',
      description: '生成数据报表',
      parameters: {
        reportType: '报表类型(销售/运营/用户)',
        format: '格式(Excel/PDF/PPT)',
        timeRange: '时间范围'
      },
      execute: async (params) => {
        return {
          success: true,
          reportUrl: `/reports/${params.reportType}_${Date.now()}.${params.format}`,
          summary: `${params.timeRange}${params.reportType}报表已生成`
        }
      }
    })
  }

  /**
   * 注册工具
   */
  registerTool(tool) {
    this.tools.set(tool.name, tool)
  }

  /**
   * 调用工具
   */
  async callTool(toolName, parameters) {
    const tool = this.tools.get(toolName)
    
    if (!tool) {
      return {
        success: false,
        error: `工具"${toolName}"不存在`
      }
    }

    try {
      const result = await tool.execute(parameters)
      return {
        success: true,
        toolName,
        result
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }

  /**
   * 获取所有可用工具
   */
  getAvailableTools() {
    return Array.from(this.tools.values()).map(tool => ({
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters
    }))
  }
}

// ========== 任务编排引擎 ==========
export class TaskOrchestrator {
  constructor() {
    this.toolRegistry = new ToolRegistry()
  }

  /**
   * 分解复杂任务
   * @param {String} userRequest - 用户请求
   */
  decomposeTask(userRequest) {
    // 任务分解规则库
    const decompositionRules = {
      '策划.*活动': {
        steps: [
          { step: 1, name: '人群洞察', tool: 'analyzeData', params: { dataType: '用户行为' } },
          { step: 2, name: '卖点提炼', tool: 'searchWeb', params: { query: '行业趋势' } },
          { step: 3, name: '文案创作', tool: 'generateMarketingCopy', params: { count: 5 } },
          { step: 4, name: '渠道选择', tool: 'analyzeData', params: { dataType: '转化率' } },
          { step: 5, name: '预算预估', tool: 'generateReport', params: { reportType: '销售' } }
        ],
        estimatedTime: '2-3小时'
      },
      '分析.*数据': {
        steps: [
          { step: 1, name: '数据采集', tool: 'analyzeData', params: {} },
          { step: 2, name: '趋势分析', tool: 'analyzeData', params: {} },
          { step: 3, name: '生成报告', tool: 'generateReport', params: { format: 'Excel' } }
        ],
        estimatedTime: '30分钟-1小时'
      },
      '写.*文案': {
        steps: [
          { step: 1, name: '了解产品', tool: 'searchWeb', params: {} },
          { step: 2, name: '分析受众', tool: 'analyzeData', params: { dataType: '用户行为' } },
          { step: 3, name: '生成文案', tool: 'generateMarketingCopy', params: { count: 10 } }
        ],
        estimatedTime: '20-30分钟'
      }
    }

    // 匹配任务类型
    let matchedRule = null
    for (const [pattern, rule] of Object.entries(decompositionRules)) {
      if (new RegExp(pattern).test(userRequest)) {
        matchedRule = rule
        break
      }
    }

    if (!matchedRule) {
      return {
        decomposed: false,
        message: '这是一个简单任务,无需分解',
        directResponse: true
      }
    }

    return {
      decomposed: true,
      taskName: userRequest,
      steps: matchedRule.steps,
      estimatedTime: matchedRule.estimatedTime,
      currentStep: 0,
      status: 'pending'
    }
  }

  /**
   * 执行任务编排
   * @param {Object} taskPlan - 任务计划
   */
  async executeTask(taskPlan) {
    const results = []
    
    for (const step of taskPlan.steps) {
      console.log(`正在执行: 步骤${step.step} - ${step.name}`)
      
      const result = await this.toolRegistry.callTool(step.tool, step.params)
      
      results.push({
        step: step.step,
        name: step.name,
        result: result.success ? result.result : { error: result.error },
        status: result.success ? 'completed' : 'failed'
      })
      
      // 如果步骤失败,询问用户是否继续
      if (!result.success) {
        break
      }
    }
    
    return {
      taskName: taskPlan.taskName,
      completedSteps: results.filter(r => r.status === 'completed').length,
      totalSteps: taskPlan.steps.length,
      results,
      status: results.every(r => r.status === 'completed') ? 'completed' : 'partial'
    }
  }
}

// ========== 主动跟进系统 ==========
export class ProactiveFollowUp {
  constructor() {
    this.reminders = []
    this.sessionMemory = new Map()
  }

  /**
   * 记录对话上下文
   */
  recordSession(userId, interaction) {
    if (!this.sessionMemory.has(userId)) {
      this.sessionMemory.set(userId, [])
    }
    
    const userHistory = this.sessionMemory.get(userId)
    userHistory.push({
      timestamp: new Date(),
      interaction
    })
    
    // 只保留最近20条记录
    if (userHistory.length > 20) {
      userHistory.shift()
    }

    // 分析是否需要主动跟进
    this.analyzeFollowUpNeeds(userId, interaction)
  }

  /**
   * 分析跟进需求
   */
  analyzeFollowUpNeeds(userId, interaction) {
    // 未完成任务检测
    if (interaction.taskStatus === 'incomplete') {
      this.scheduleReminder({
        userId,
        type: 'incomplete_task',
        message: `您上次未完成的任务是"${interaction.taskName}",是否需要继续?`,
        scheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24小时后
      })
    }

    // 数据更新提醒
    if (interaction.topic === 'data_analysis') {
      this.scheduleReminder({
        userId,
        type: 'data_update',
        message: '您关注的数据已更新,要不要我帮您分析下?',
        scheduledTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7天后
      })
    }

    // 效果跟踪
    if (interaction.action === 'campaign_launch') {
      this.scheduleReminder({
        userId,
        type: 'effect_tracking',
        message: '活动已运行3天,我帮您生成了效果报告,是否查看?',
        scheduledTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3天后
      })
    }
  }

  /**
   * 安排提醒
   */
  scheduleReminder(reminder) {
    this.reminders.push({
      id: `reminder-${Date.now()}`,
      ...reminder,
      status: 'pending'
    })
  }

  /**
   * 获取应发送的提醒
   */
  getPendingReminders(userId) {
    const now = new Date()
    
    return this.reminders.filter(r => 
      r.userId === userId &&
      r.status === 'pending' &&
      r.scheduledTime <= now
    )
  }

  /**
   * 标记提醒已发送
   */
  markAsSent(reminderId) {
    const reminder = this.reminders.find(r => r.id === reminderId)
    if (reminder) {
      reminder.status = 'sent'
      reminder.sentAt = new Date()
    }
  }

  /**
   * 生成主动问候
   */
  generateProactiveGreeting(userId) {
    const history = this.sessionMemory.get(userId) || []
    
    if (history.length === 0) {
      return '您好!我是您的AI营销助手,有什么可以帮您的吗?'
    }

    const lastInteraction = history[history.length - 1]
    const hoursSinceLastInteraction = (new Date() - lastInteraction.timestamp) / (1000 * 60 * 60)

    // 检查待办提醒
    const pendingReminders = this.getPendingReminders(userId)
    if (pendingReminders.length > 0) {
      return pendingReminders[0].message
    }

    // 根据上次交互生成问候
    if (hoursSinceLastInteraction < 24) {
      return `欢迎回来!上次我们聊到了"${lastInteraction.interaction.topic}",需要继续吗?`
    }

    return '好久不见!最近有什么营销工作需要我帮忙的吗?'
  }
}

// ========== 导出 ==========
export default {
  ToolRegistry,
  TaskOrchestrator,
  ProactiveFollowUp
}
