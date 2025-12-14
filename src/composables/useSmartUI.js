/**
 * 智能UI交互组合式函数
 * 提供智能化、自适应的用户界面交互能力
 */
import { ref, reactive, computed, watch } from 'vue'
import { ElLoading, ElNotification } from 'element-plus'

/**
 * 智能UI管理器
 */
export function useSmartUI() {
  
  // ==================== 1. 智能加载状态 ====================
  
  const loadingState = reactive({
    active: false,
    message: '',
    progress: 0,
    estimatedTime: 0,
    startTime: 0
  })

  const smartLoading = {
    start: (message = '加载中...', estimatedTime = 0) => {
      loadingState.active = true
      loadingState.message = message
      loadingState.progress = 0
      loadingState.estimatedTime = estimatedTime
      loadingState.startTime = Date.now()
      
      // 自动进度模拟
      if (estimatedTime > 0) {
        simulateProgress(estimatedTime)
      }
    },
    
    update: (progress, message) => {
      loadingState.progress = progress
      if (message) loadingState.message = message
    },
    
    finish: () => {
      loadingState.active = false
      loadingState.progress = 100
    }
  }

  const simulateProgress = (duration) => {
    const interval = duration / 100
    let current = 0
    
    const timer = setInterval(() => {
      if (!loadingState.active || current >= 95) {
        clearInterval(timer)
        return
      }
      current += 1
      loadingState.progress = current
    }, interval)
  }

  // ==================== 2. 智能提示系统 ====================
  
  const smartTooltip = reactive({
    enabled: true,
    history: [],
    preferences: {}
  })

  const showContextualHelp = (context, trigger = 'auto') => {
    if (!smartTooltip.enabled) return

    const help = {
      id: `help_${Date.now()}`,
      context,
      trigger,
      timestamp: Date.now(),
      shown: true
    }

    smartTooltip.history.push(help)

    // 智能判断是否显示提示
    const shouldShow = evaluateHelpNeed(context)
    
    if (shouldShow) {
      ElNotification.info({
        title: '💡 智能提示',
        message: generateHelpMessage(context),
        duration: 5000,
        position: 'bottom-right'
      })
    }

    return help
  }

  const evaluateHelpNeed = (context) => {
    // 检查用户是否已经看过类似提示
    const similar = smartTooltip.history.filter(h => 
      h.context.type === context.type
    )
    
    // 如果30分钟内看过2次以上，不再显示
    const recentCount = similar.filter(h => 
      Date.now() - h.timestamp < 30 * 60 * 1000
    ).length
    
    return recentCount < 2
  }

  const generateHelpMessage = (context) => {
    const messages = {
      empty_data: '暂无数据，您可以点击"添加"按钮创建新记录',
      complex_form: '表单项较多，建议先填写必填项（标记为红色*）',
      error_occurred: '操作失败，请检查输入是否正确',
      new_feature: '发现新功能！点击查看使用说明'
    }
    
    return messages[context.type] || '需要帮助？点击右上角问号图标'
  }

  // ==================== 3. 自适应布局 ====================
  
  const layoutState = reactive({
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    device: 'desktop',
    orientation: 'landscape',
    density: 'comfortable'
  })

  const updateLayout = () => {
    layoutState.viewportWidth = window.innerWidth
    layoutState.viewportHeight = window.innerHeight
    
    // 智能判断设备类型
    if (layoutState.viewportWidth < 768) {
      layoutState.device = 'mobile'
      layoutState.density = 'compact'
    } else if (layoutState.viewportWidth < 1200) {
      layoutState.device = 'tablet'
      layoutState.density = 'comfortable'
    } else {
      layoutState.device = 'desktop'
      layoutState.density = 'spacious'
    }
    
    layoutState.orientation = layoutState.viewportWidth > layoutState.viewportHeight 
      ? 'landscape' 
      : 'portrait'
  }

  window.addEventListener('resize', updateLayout)
  updateLayout()

  // 计算属性：响应式布局配置
  const responsiveConfig = computed(() => ({
    columns: layoutState.device === 'mobile' ? 1 : 
             layoutState.device === 'tablet' ? 2 : 3,
    cardWidth: layoutState.device === 'mobile' ? '100%' : 
               layoutState.device === 'tablet' ? '48%' : '32%',
    fontSize: layoutState.device === 'mobile' ? '14px' : '16px',
    spacing: layoutState.density === 'compact' ? '12px' : 
             layoutState.density === 'comfortable' ? '20px' : '32px'
  }))

  // ==================== 4. 智能表单处理 ====================
  
  const formIntelligence = reactive({
    autoSave: true,
    validation: {},
    suggestions: [],
    fillProgress: 0
  })

  const smartFormHelper = {
    // 自动保存
    enableAutoSave: (formData, saveHandler, interval = 30000) => {
      if (!formIntelligence.autoSave) return

      const timer = setInterval(() => {
        if (hasUnsavedChanges(formData)) {
          saveHandler(formData)
          ElNotification.success({
            title: '自动保存',
            message: '表单已自动保存',
            duration: 2000,
            position: 'bottom-right'
          })
        }
      }, interval)

      return () => clearInterval(timer)
    },

    // 智能验证
    validateField: (field, value, rules) => {
      const errors = []
      
      rules.forEach(rule => {
        if (rule.required && !value) {
          errors.push(`${field}为必填项`)
        }
        if (rule.pattern && !rule.pattern.test(value)) {
          errors.push(rule.message || `${field}格式不正确`)
        }
      })

      formIntelligence.validation[field] = errors
      return errors.length === 0
    },

    // 智能建议
    suggestValue: (field, context) => {
      const suggestions = []
      
      // 基于历史数据的建议
      if (context.history && context.history[field]) {
        suggestions.push(...context.history[field].slice(0, 3))
      }

      // 基于当前输入的建议
      if (context.currentValue) {
        // 模糊匹配
        const matches = context.options?.filter(opt => 
          opt.toLowerCase().includes(context.currentValue.toLowerCase())
        ) || []
        suggestions.push(...matches.slice(0, 5))
      }

      formIntelligence.suggestions = suggestions
      return suggestions
    },

    // 计算填写进度
    calculateProgress: (formData, requiredFields) => {
      const filled = requiredFields.filter(field => formData[field]).length
      formIntelligence.fillProgress = (filled / requiredFields.length) * 100
      return formIntelligence.fillProgress
    }
  }

  const hasUnsavedChanges = (formData) => {
    // 简化版：检查是否有数据
    return Object.keys(formData).length > 0
  }

  // ==================== 5. 智能数据可视化 ====================
  
  const visualizationEngine = {
    // 自动选择最佳图表类型
    recommendChartType: (data) => {
      if (!data || data.length === 0) return 'empty'

      const dataType = analyzeDataType(data)
      
      if (dataType.isTimeSeries) return 'line'
      if (dataType.isComparison && data.length < 10) return 'bar'
      if (dataType.isComparison && data.length >= 10) return 'line'
      if (dataType.isDistribution) return 'pie'
      if (dataType.isCorrelation) return 'scatter'
      
      return 'bar'
    },

    // 智能配色方案
    getColorScheme: (theme = 'default', dataPoints = 5) => {
      const schemes = {
        default: ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'],
        professional: ['#2c3e50', '#3498db', '#e74c3c', '#f39c12', '#1abc9c'],
        pastel: ['#ffeaa7', '#74b9ff', '#a29bfe', '#fd79a8', '#fdcb6e'],
        vibrant: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731', '#5f27cd']
      }
      
      return schemes[theme] || schemes.default
    },

    // 自适应图表配置
    getResponsiveChartConfig: (chartType, device) => {
      const baseConfig = {
        mobile: {
          height: 250,
          fontSize: 10,
          legendPosition: 'bottom'
        },
        tablet: {
          height: 350,
          fontSize: 12,
          legendPosition: 'right'
        },
        desktop: {
          height: 450,
          fontSize: 14,
          legendPosition: 'right'
        }
      }

      return baseConfig[device] || baseConfig.desktop
    }
  }

  const analyzeDataType = (data) => {
    return {
      isTimeSeries: data[0]?.timestamp !== undefined,
      isComparison: data.every(d => d.value !== undefined),
      isDistribution: data.every(d => d.percentage !== undefined),
      isCorrelation: data.every(d => d.x !== undefined && d.y !== undefined)
    }
  }

  // ==================== 6. 智能交互反馈 ====================
  
  const feedbackSystem = {
    // 操作成功反馈
    success: (message, details = {}) => {
      ElNotification.success({
        title: '✓ 操作成功',
        message,
        duration: 3000,
        showClose: true
      })
      
      logUserInteraction('success', { message, ...details })
    },

    // 操作失败反馈
    error: (message, suggestion = null) => {
      ElNotification.error({
        title: '✗ 操作失败',
        message: suggestion ? `${message}\n建议：${suggestion}` : message,
        duration: 5000,
        showClose: true
      })
      
      logUserInteraction('error', { message, suggestion })
    },

    // 警告提示
    warning: (message, action = null) => {
      const notification = ElNotification.warning({
        title: '⚠ 注意',
        message,
        duration: 0,
        showClose: true
      })

      if (action) {
        // 添加操作按钮（需要自定义）
      }

      logUserInteraction('warning', { message })
      return notification
    },

    // 进度反馈
    progress: (current, total, message = '') => {
      const percentage = Math.round((current / total) * 100)
      return `${message} ${percentage}% (${current}/${total})`
    }
  }

  const interactionLog = ref([])
  const logUserInteraction = (type, data) => {
    interactionLog.value.unshift({
      timestamp: Date.now(),
      type,
      data
    })
    
    if (interactionLog.value.length > 50) {
      interactionLog.value = interactionLog.value.slice(0, 30)
    }
  }

  // ==================== 7. 智能搜索和过滤 ====================
  
  const searchEngine = {
    // 智能搜索
    smartSearch: (query, dataset, fields = []) => {
      if (!query || !dataset) return dataset

      const lowerQuery = query.toLowerCase()
      
      return dataset.filter(item => {
        // 如果指定了字段，只在这些字段中搜索
        if (fields.length > 0) {
          return fields.some(field => {
            const value = item[field]
            return value && String(value).toLowerCase().includes(lowerQuery)
          })
        }
        
        // 否则在所有字段中搜索
        return Object.values(item).some(value => 
          value && String(value).toLowerCase().includes(lowerQuery)
        )
      })
    },

    // 智能排序
    smartSort: (dataset, sortKey, order = 'asc') => {
      if (!dataset || dataset.length === 0) return dataset

      return [...dataset].sort((a, b) => {
        const aVal = a[sortKey]
        const bVal = b[sortKey]

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return order === 'asc' ? aVal - bVal : bVal - aVal
        }

        const aStr = String(aVal).toLowerCase()
        const bStr = String(bVal).toLowerCase()
        
        if (order === 'asc') {
          return aStr.localeCompare(bStr)
        } else {
          return bStr.localeCompare(aStr)
        }
      })
    },

    // 智能分组
    smartGroup: (dataset, groupBy) => {
      if (!dataset || dataset.length === 0) return {}

      return dataset.reduce((groups, item) => {
        const key = item[groupBy] || '未分类'
        if (!groups[key]) {
          groups[key] = []
        }
        groups[key].push(item)
        return groups
      }, {})
    }
  }

  // ==================== 对外接口 ====================

  return {
    // 加载状态
    loadingState,
    smartLoading,

    // 智能提示
    smartTooltip,
    showContextualHelp,

    // 自适应布局
    layoutState,
    responsiveConfig,
    updateLayout,

    // 智能表单
    formIntelligence,
    smartFormHelper,

    // 数据可视化
    visualizationEngine,

    // 交互反馈
    feedbackSystem,
    interactionLog,

    // 搜索和过滤
    searchEngine
  }
}
