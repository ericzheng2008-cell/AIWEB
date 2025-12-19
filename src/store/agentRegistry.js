/**
 * 企业级智能体注册中心 - Pinia Store
 * 
 * 功能:
 * - 智能体注册与发现
 * - 配置管理
 * - 健康检查
 * - 性能监控
 * - 版本管理
 */

import { defineStore } from 'pinia'

export const useAgentRegistryStore = defineStore('agentRegistry', {
  state: () => ({
    // 已注册的智能体列表
    agents: [
      {
        agentId: 'tool-selection-agent',
        name: '拧紧工具智能选型',
        type: 'recommendation',
        version: '1.0.0',
        status: 'active',
        capabilities: ['工具推荐', '品牌匹配', '规格查询'],
        endpoints: {
          recommend: '/api/agents/tool-selection/recommend',
          search: '/api/agents/tool-selection/search'
        },
        configuration: {
          maxConcurrency: 10,
          timeout: 5000,
          retryPolicy: 'exponential',
          cacheEnabled: true,
          cacheTTL: 3600
        },
        dependencies: ['knowledge-base', 'product-database'],
        metrics: {
          totalRequests: 0,
          successfulRequests: 0,
          failedRequests: 0,
          avgResponseTime: 0,
          lastActive: null,
          uptime: 100
        },
        metadata: {
          description: '基于需求智能推荐拧紧工具',
          category: '工具选型',
          tags: ['推荐', '选型', '拧紧工具'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      },
      {
        agentId: 'tightening-process-agent',
        name: '拧紧工艺改进与验证',
        type: 'process-optimization',
        version: '1.0.0',
        status: 'active',
        capabilities: ['曲线分析', '参数优化', '故障诊断', '工艺验证'],
        endpoints: {
          analyzeCurve: '/api/agents/tightening/analyze-curve',
          optimizeParameters: '/api/agents/tightening/optimize',
          diagnose: '/api/agents/tightening/diagnose'
        },
        configuration: {
          maxConcurrency: 5,
          timeout: 10000,
          retryPolicy: 'exponential',
          cacheEnabled: false
        },
        dependencies: ['knowledge-base', 'data-service', 'toolsnet-parser'],
        metrics: {
          totalRequests: 0,
          successfulRequests: 0,
          failedRequests: 0,
          avgResponseTime: 0,
          lastActive: null,
          uptime: 100
        },
        metadata: {
          description: '拧紧曲线分析与工艺参数优化',
          category: '工艺优化',
          tags: ['曲线分析', '参数优化', '故障诊断'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      },
      {
        agentId: 'device-management-agent',
        name: '设备全生命周期管理',
        type: 'asset-management',
        version: '1.0.0',
        status: 'active',
        capabilities: ['设备档案', '故障追踪', '维保管理', '备件管理'],
        endpoints: {
          getDeviceInfo: '/api/agents/device/info',
          trackFailure: '/api/agents/device/track-failure',
          manageMaintenance: '/api/agents/device/maintenance'
        },
        configuration: {
          maxConcurrency: 15,
          timeout: 3000,
          retryPolicy: 'linear',
          cacheEnabled: true,
          cacheTTL: 1800
        },
        dependencies: ['knowledge-base', 'equipment-database'],
        metrics: {
          totalRequests: 0,
          successfulRequests: 0,
          failedRequests: 0,
          avgResponseTime: 0,
          lastActive: null,
          uptime: 100
        },
        metadata: {
          description: '设备管理、故障追踪和维保计划',
          category: '设备管理',
          tags: ['设备管理', '故障追踪', '维保'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      },
      {
        agentId: 'ticketing-agent',
        name: '工单管理系统',
        type: 'workflow-management',
        version: '1.0.0',
        status: 'active',
        capabilities: ['工单创建', '工单分配', '工单跟踪', 'SLA管理'],
        endpoints: {
          createTicket: '/api/agents/ticketing/create',
          assignTicket: '/api/agents/ticketing/assign',
          trackProgress: '/api/agents/ticketing/track'
        },
        configuration: {
          maxConcurrency: 20,
          timeout: 2000,
          retryPolicy: 'linear',
          cacheEnabled: false
        },
        dependencies: ['notification-service', 'user-management'],
        metrics: {
          totalRequests: 0,
          successfulRequests: 0,
          failedRequests: 0,
          avgResponseTime: 0,
          lastActive: null,
          uptime: 100
        },
        metadata: {
          description: '工单创建、分配和跟踪管理',
          category: '工单管理',
          tags: ['工单', '流程管理', 'SLA'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      },
      {
        agentId: 'curve-analysis-agent',
        name: '拧紧曲线对比分析',
        type: 'data-analysis',
        version: '1.0.0',
        status: 'active',
        capabilities: ['曲线对比', '异常检测', '趋势分析', '报告生成'],
        endpoints: {
          compareCurves: '/api/agents/curve/compare',
          detectAnomaly: '/api/agents/curve/detect',
          analyzeTrend: '/api/agents/curve/trend'
        },
        configuration: {
          maxConcurrency: 8,
          timeout: 8000,
          retryPolicy: 'exponential',
          cacheEnabled: true,
          cacheTTL: 1200
        },
        dependencies: ['data-service', 'ml-service'],
        metrics: {
          totalRequests: 0,
          successfulRequests: 0,
          failedRequests: 0,
          avgResponseTime: 0,
          lastActive: null,
          uptime: 100
        },
        metadata: {
          description: '多曲线对比与异常检测分析',
          category: '数据分析',
          tags: ['曲线分析', '异常检测', '趋势分析'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      },
      {
        agentId: 'brand-matching-agent',
        name: '品牌型号智能匹配',
        type: 'recommendation',
        version: '1.0.0',
        status: 'active',
        capabilities: ['品牌匹配', '型号识别', '替代推荐', '价格比较'],
        endpoints: {
          matchBrand: '/api/agents/brand/match',
          findAlternatives: '/api/agents/brand/alternatives'
        },
        configuration: {
          maxConcurrency: 12,
          timeout: 4000,
          retryPolicy: 'linear',
          cacheEnabled: true,
          cacheTTL: 7200
        },
        dependencies: ['product-database', 'pricing-service'],
        metrics: {
          totalRequests: 0,
          successfulRequests: 0,
          failedRequests: 0,
          avgResponseTime: 0,
          lastActive: null,
          uptime: 100
        },
        metadata: {
          description: '智能品牌型号匹配与替代推荐',
          category: '品牌匹配',
          tags: ['品牌', '型号', '匹配'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      },
      {
        agentId: 'data-collection-agent',
        name: '拧紧数据采集分析',
        type: 'data-collection',
        version: '1.0.0',
        status: 'active',
        capabilities: ['数据采集', '协议解析', '实时监控', '数据存储'],
        endpoints: {
          collect: '/api/agents/data/collect',
          parse: '/api/agents/data/parse',
          monitor: '/api/agents/data/monitor'
        },
        configuration: {
          maxConcurrency: 30,
          timeout: 1000,
          retryPolicy: 'none',
          cacheEnabled: false,
          bufferSize: 1000
        },
        dependencies: ['toolsnet-parser', 'database-service'],
        metrics: {
          totalRequests: 0,
          successfulRequests: 0,
          failedRequests: 0,
          avgResponseTime: 0,
          lastActive: null,
          uptime: 100
        },
        metadata: {
          description: 'ToolsNet8协议数据采集与实时分析',
          category: '数据采集',
          tags: ['数据采集', 'ToolsNet8', '实时监控'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      },
      {
        agentId: 'antong-learning-agent',
        name: '安彤自主学习智能体',
        type: 'conversational-ai',
        version: '1.0.0',
        status: 'active',
        capabilities: ['自然语言理解', '知识问答', '主动学习', '个性化推荐'],
        endpoints: {
          chat: '/api/agents/antong/chat',
          learn: '/api/agents/antong/learn',
          feedback: '/api/agents/antong/feedback'
        },
        configuration: {
          maxConcurrency: 50,
          timeout: 15000,
          retryPolicy: 'exponential',
          cacheEnabled: true,
          cacheTTL: 600,
          modelVersion: 'gpt-4-turbo'
        },
        dependencies: ['openai-api', 'knowledge-base', 'vector-db'],
        metrics: {
          totalRequests: 0,
          successfulRequests: 0,
          failedRequests: 0,
          avgResponseTime: 0,
          lastActive: null,
          uptime: 100,
          learningRate: 0.85,
          satisfactionScore: 4.2
        },
        metadata: {
          description: '具备自主学习能力的AI助手',
          category: '对话AI',
          tags: ['AI助手', '自主学习', 'NLP'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }
    ],

    // 智能体类型分类
    agentTypes: [
      { value: 'recommendation', label: '推荐系统' },
      { value: 'process-optimization', label: '工艺优化' },
      { value: 'asset-management', label: '资产管理' },
      { value: 'workflow-management', label: '流程管理' },
      { value: 'data-analysis', label: '数据分析' },
      { value: 'data-collection', label: '数据采集' },
      { value: 'conversational-ai', label: '对话AI' },
      { value: 'predictive-maintenance', label: '预测性维护' }
    ],

    // 智能体状态
    agentStatuses: [
      { value: 'active', label: '运行中', color: 'success' },
      { value: 'inactive', label: '已停用', color: 'info' },
      { value: 'upgrading', label: '升级中', color: 'warning' },
      { value: 'error', label: '异常', color: 'danger' },
      { value: 'maintenance', label: '维护中', color: 'warning' }
    ],

    // 交互历史记录
    interactions: [],

    // 学习记录
    learningRecords: [],

    // 系统配置
    systemConfig: {
      enableAutoRecovery: true, // 自动恢复
      healthCheckInterval: 60000, // 健康检查间隔(ms)
      metricsCollectionInterval: 300000, // 指标收集间隔(ms)
      maxRetryAttempts: 3, // 最大重试次数
      enableDistributedTracing: true, // 分布式追踪
      logLevel: 'info' // 日志级别
    }
  }),

  getters: {
    // 获取所有激活的智能体
    activeAgents: (state) => {
      return state.agents.filter(agent => agent.status === 'active')
    },

    // 按类型分组
    agentsByType: (state) => {
      return state.agents.reduce((acc, agent) => {
        if (!acc[agent.type]) {
          acc[agent.type] = []
        }
        acc[agent.type].push(agent)
        return acc
      }, {})
    },

    // 获取智能体统计
    agentStats: (state) => {
      const total = state.agents.length
      const active = state.agents.filter(a => a.status === 'active').length
      const totalRequests = state.agents.reduce((sum, a) => sum + a.metrics.totalRequests, 0)
      const avgUptime = state.agents.reduce((sum, a) => sum + a.metrics.uptime, 0) / total

      return {
        total,
        active,
        inactive: total - active,
        totalRequests,
        avgUptime: avgUptime.toFixed(2)
      }
    },

    // 性能最佳的智能体
    topPerformingAgents: (state) => {
      return [...state.agents]
        .filter(a => a.metrics.totalRequests > 0)
        .sort((a, b) => {
          const scoreA = (a.metrics.successfulRequests / a.metrics.totalRequests) * a.metrics.uptime
          const scoreB = (b.metrics.successfulRequests / b.metrics.totalRequests) * b.metrics.uptime
          return scoreB - scoreA
        })
        .slice(0, 5)
    },

    // 根据ID获取智能体
    getAgentById: (state) => {
      return (agentId) => state.agents.find(a => a.agentId === agentId)
    }
  },

  actions: {
    // ===== 智能体管理 =====
    
    /**
     * 注册新智能体
     */
    registerAgent(agentData) {
      const newAgent = {
        agentId: agentData.agentId || `agent-${Date.now()}`,
        ...agentData,
        status: 'active',
        metrics: {
          totalRequests: 0,
          successfulRequests: 0,
          failedRequests: 0,
          avgResponseTime: 0,
          lastActive: null,
          uptime: 100
        },
        metadata: {
          ...agentData.metadata,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      }

      this.agents.push(newAgent)
      this.saveToLocalStorage()
      
      console.log(`✅ 智能体注册成功: ${newAgent.name} (${newAgent.agentId})`)
      
      return newAgent.agentId
    },

    /**
     * 更新智能体配置
     */
    updateAgentConfig(agentId, config) {
      const agent = this.agents.find(a => a.agentId === agentId)
      if (agent) {
        agent.configuration = { ...agent.configuration, ...config }
        agent.metadata.updatedAt = new Date().toISOString()
        this.saveToLocalStorage()
        return true
      }
      return false
    },

    /**
     * 更新智能体状态
     */
    updateAgentStatus(agentId, status) {
      const agent = this.agents.find(a => a.agentId === agentId)
      if (agent) {
        agent.status = status
        agent.metadata.updatedAt = new Date().toISOString()
        this.saveToLocalStorage()
        return true
      }
      return false
    },

    /**
     * 删除智能体
     */
    unregisterAgent(agentId) {
      const index = this.agents.findIndex(a => a.agentId === agentId)
      if (index !== -1) {
        const agent = this.agents[index]
        this.agents.splice(index, 1)
        this.saveToLocalStorage()
        console.log(`🗑️ 智能体已注销: ${agent.name}`)
        return true
      }
      return false
    },

    // ===== 智能体调用 =====
    
    /**
     * 调用智能体
     */
    async invokeAgent(agentId, action, data, context = {}) {
      const agent = this.agents.find(a => a.agentId === agentId)
      if (!agent) {
        throw new Error(`智能体不存在: ${agentId}`)
      }

      if (agent.status !== 'active') {
        throw new Error(`智能体未激活: ${agent.name} (${agent.status})`)
      }

      const startTime = Date.now()
      const interactionId = `int-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

      try {
        // 记录交互
        const interaction = {
          interactionId,
          agentId,
          action,
          data,
          context,
          startTime,
          status: 'processing'
        }
        this.interactions.push(interaction)

        // 更新指标
        agent.metrics.totalRequests++
        agent.metrics.lastActive = new Date().toISOString()

        // 模拟调用(实际应该调用真实API)
        const result = await this.simulateAgentCall(agent, action, data)

        // 记录成功
        const duration = Date.now() - startTime
        agent.metrics.successfulRequests++
        agent.metrics.avgResponseTime = 
          (agent.metrics.avgResponseTime * (agent.metrics.successfulRequests - 1) + duration) / 
          agent.metrics.successfulRequests

        interaction.status = 'success'
        interaction.result = result
        interaction.duration = duration
        interaction.endTime = Date.now()

        this.saveToLocalStorage()

        return {
          interactionId,
          result,
          duration
        }

      } catch (error) {
        // 记录失败
        agent.metrics.failedRequests++
        
        const interaction = this.interactions.find(i => i.interactionId === interactionId)
        if (interaction) {
          interaction.status = 'failed'
          interaction.error = error.message
          interaction.endTime = Date.now()
        }

        this.saveToLocalStorage()
        throw error
      }
    },

    /**
     * 模拟智能体调用(开发阶段使用)
     */
    async simulateAgentCall(agent, action, data) {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200))

      // 根据不同智能体返回模拟结果
      switch (agent.agentId) {
        case 'tool-selection-agent':
          return {
            recommendations: [
              { tool: 'ETV ST61-100', score: 0.95, reason: '扭矩范围匹配' },
              { tool: 'Atlas Copco QST15', score: 0.88, reason: '精度要求匹配' }
            ]
          }
        
        case 'tightening-process-agent':
          return {
            analysis: {
              status: 'OK',
              torque: { min: 95, max: 105, avg: 100.2 },
              angle: { min: 440, max: 460, avg: 450 },
              recommendation: '参数正常，建议继续使用'
            }
          }
        
        default:
          return { success: true, message: '处理完成' }
      }
    },

    // ===== 健康检查 =====
    
    /**
     * 执行健康检查
     */
    async performHealthCheck(agentId) {
      const agent = this.agents.find(a => a.agentId === agentId)
      if (!agent) return false

      try {
        // 实际应该调用agent的健康检查端点
        const isHealthy = Math.random() > 0.05 // 95%健康率

        if (isHealthy) {
          agent.status = 'active'
          agent.metrics.uptime = Math.min(100, agent.metrics.uptime + 0.1)
        } else {
          agent.status = 'error'
          agent.metrics.uptime = Math.max(0, agent.metrics.uptime - 1)
          
          // 自动恢复
          if (this.systemConfig.enableAutoRecovery) {
            await this.recoverAgent(agentId)
          }
        }

        this.saveToLocalStorage()
        return isHealthy

      } catch (error) {
        console.error(`健康检查失败: ${agent.name}`, error)
        return false
      }
    },

    /**
     * 恢复智能体
     */
    async recoverAgent(agentId) {
      const agent = this.agents.find(a => a.agentId === agentId)
      if (!agent) return false

      console.log(`🔄 正在恢复智能体: ${agent.name}`)
      
      // 模拟恢复过程
      agent.status = 'upgrading'
      await new Promise(resolve => setTimeout(resolve, 2000))
      agent.status = 'active'
      agent.metrics.uptime = 100

      this.saveToLocalStorage()
      console.log(`✅ 智能体恢复成功: ${agent.name}`)
      
      return true
    },

    // ===== 学习与反馈 =====
    
    /**
     * 提交用户反馈
     */
    submitFeedback(interactionId, feedbackData) {
      const interaction = this.interactions.find(i => i.interactionId === interactionId)
      if (!interaction) return false

      const feedback = {
        feedbackId: `fb-${Date.now()}`,
        interactionId,
        agentId: interaction.agentId,
        ...feedbackData,
        timestamp: new Date().toISOString()
      }

      interaction.feedback = feedback

      // 创建学习记录
      this.createLearningRecord(interaction.agentId, 'feedback', feedback)

      this.saveToLocalStorage()
      return true
    },

    /**
     * 创建学习记录
     */
    createLearningRecord(agentId, learningType, data) {
      const record = {
        recordId: `lr-${Date.now()}`,
        agentId,
        learningType,
        data,
        timestamp: new Date().toISOString()
      }

      this.learningRecords.push(record)
      this.saveToLocalStorage()

      console.log(`📚 学习记录已创建: ${agentId} - ${learningType}`)
    },

    // ===== 数据持久化 =====
    
    saveToLocalStorage() {
      try {
        localStorage.setItem('agentRegistry_agents', JSON.stringify(this.agents))
        localStorage.setItem('agentRegistry_interactions', JSON.stringify(this.interactions.slice(-1000))) // 只保留最近1000条
        localStorage.setItem('agentRegistry_learningRecords', JSON.stringify(this.learningRecords.slice(-500)))
      } catch (error) {
        console.error('保存数据失败:', error)
      }
    },

    loadFromLocalStorage() {
      try {
        const agents = localStorage.getItem('agentRegistry_agents')
        const interactions = localStorage.getItem('agentRegistry_interactions')
        const learningRecords = localStorage.getItem('agentRegistry_learningRecords')

        if (agents) this.agents = JSON.parse(agents)
        if (interactions) this.interactions = JSON.parse(interactions)
        if (learningRecords) this.learningRecords = JSON.parse(learningRecords)
      } catch (error) {
        console.error('加载数据失败:', error)
      }
    },

    // ===== 初始化 =====
    
    initialize() {
      this.loadFromLocalStorage()
      
      // 启动定期健康检查
      if (this.systemConfig.healthCheckInterval > 0) {
        setInterval(() => {
          this.activeAgents.forEach(agent => {
            this.performHealthCheck(agent.agentId)
          })
        }, this.systemConfig.healthCheckInterval)
      }

      console.log('🚀 智能体注册中心已初始化')
      console.log(`📊 已注册智能体: ${this.agents.length}个`)
      console.log(`✅ 活跃智能体: ${this.activeAgents.length}个`)
    }
  }
})
