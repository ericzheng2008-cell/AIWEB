<template>
  <div class="tool-selector-enhanced">
    <Header />
    
    <!-- 智能体状态栏 -->
    <div class="agent-status-bar" v-if="agentState.isActive">
      <div class="container">
        <div class="status-content">
          <div class="status-indicator">
            <span class="pulse-dot"></span>
            <span class="status-text">智能体运行中</span>
          </div>
          <div class="status-metrics">
            <el-tag size="small" type="info">置信度: {{ (agentState.confidence * 100).toFixed(0) }}%</el-tag>
            <el-tag size="small" type="success">反应时间: {{ realtimeReaction.reactionTime.toFixed(0) }}ms</el-tag>
            <el-tag size="small" v-if="proactiveEngine.recommendations.length > 0">
              {{ proactiveEngine.recommendations.length }}个智能建议
            </el-tag>
          </div>
        </div>
      </div>
    </div>

    <!-- 页面标题 -->
    <section class="selector-header">
      <div class="header-background"></div>
      <div class="container">
        <div class="header-content">
          <div class="header-badge">
            <el-icon><MagicStick /></el-icon>
            <span>AI智能推荐引擎</span>
          </div>
          <h1><el-icon><Tools /></el-icon> 拧紧工具选型</h1>
          <p>智能分析工艺需求，推荐最优拧紧工具方案</p>
          <div class="header-features">
            <div class="feature-badge">
              <el-icon><Checked /></el-icon>
              <span>自主分析决策</span>
            </div>
            <div class="feature-badge">
              <el-icon><Checked /></el-icon>
              <span>实时反应优化</span>
            </div>
            <div class="feature-badge">
              <el-icon><Checked /></el-icon>
              <span>主动建议推荐</span>
            </div>
            <div class="feature-badge">
              <el-icon><Checked /></el-icon>
              <span>持续学习适应</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 智能建议卡片 -->
    <section class="proactive-suggestions" v-if="proactiveEngine.recommendations.length > 0">
      <div class="container">
        <el-alert
          v-for="suggestion in proactiveEngine.recommendations"
          :key="suggestion.type"
          :title="suggestion.title"
          :type="suggestion.priority === 'high' ? 'warning' : 'info'"
          :description="suggestion.description"
          show-icon
          :closable="true"
          class="suggestion-alert">
          <template #default v-if="suggestion.actions">
            <div class="suggestion-actions">
              <el-button
                v-for="(action, idx) in suggestion.actions"
                :key="idx"
                size="small"
                type="primary"
                @click="action.handler">
                {{ action.label }}
              </el-button>
            </div>
          </template>
        </el-alert>
      </div>
    </section>

    <!-- 选型表单 -->
    <section class="selector-form">
      <div class="container">
        <!-- 进度条 -->
        <div class="form-progress">
          <el-progress
            :percentage="formIntelligence.fillProgress"
            :color="progressColor"
            :status="formIntelligence.fillProgress === 100 ? 'success' : null">
            <template #default="{ percentage }">
              <span class="progress-text">完成度 {{ percentage }}%</span>
            </template>
          </el-progress>
        </div>

        <el-card class="form-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span class="card-title">
                <el-icon><Document /></el-icon>
                工艺需求信息
              </span>
              <el-tag v-if="formIntelligence.autoSave" type="success" size="small">
                <el-icon><CircleCheck /></el-icon>
                自动保存
              </el-tag>
            </div>
          </template>

          <el-form
            ref="formRef"
            :model="formData"
            :rules="formRules"
            label-width="120px"
            @input="handleFormChange">
            
            <!-- 基本信息 -->
            <el-divider content-position="left">
              <el-icon><User /></el-icon>
              基本信息
            </el-divider>

            <el-form-item label="工件材料" prop="material" required>
              <el-select
                v-model="formData.material"
                placeholder="请选择工件材料"
                filterable
                @change="handleMaterialChange">
                <el-option label="钢材" value="steel" />
                <el-option label="铝合金" value="aluminum" />
                <el-option label="铸铁" value="cast-iron" />
                <el-option label="塑料" value="plastic" />
                <el-option label="复合材料" value="composite" />
              </el-select>
              <template #error="{ error }">
                <span class="form-error-tip">
                  <el-icon><Warning /></el-icon>
                  {{ error }}
                </span>
              </template>
            </el-form-item>

            <el-form-item label="螺栓规格" prop="boltSize" required>
              <el-input
                v-model="formData.boltSize"
                placeholder="例如: M8, M10, M12"
                clearable>
                <template #prefix>
                  <el-icon><Tools /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item label="目标扭矩" prop="targetTorque" required>
              <el-input-number
                v-model="formData.targetTorque"
                :min="1"
                :max="1000"
                placeholder="输入扭矩值"
                style="width: 200px" />
              <span class="unit-label">N·m</span>
              <el-tooltip content="扭矩建议范围会根据螺栓规格自动计算" placement="right">
                <el-icon class="info-icon"><QuestionFilled /></el-icon>
              </el-tooltip>
            </el-form-item>

            <el-form-item label="扭矩精度" prop="torqueAccuracy">
              <el-radio-group v-model="formData.torqueAccuracy">
                <el-radio label="±3%">高精度 (±3%)</el-radio>
                <el-radio label="±5%">标准精度 (±5%)</el-radio>
                <el-radio label="±10%">一般精度 (±10%)</el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 工艺需求 -->
            <el-divider content-position="left">
              <el-icon><Setting /></el-icon>
              工艺需求
            </el-divider>

            <el-form-item label="工作环境" prop="environment">
              <el-checkbox-group v-model="formData.environment">
                <el-checkbox label="高温环境" />
                <el-checkbox label="低温环境" />
                <el-checkbox label="潮湿环境" />
                <el-checkbox label="粉尘环境" />
                <el-checkbox label="洁净室" />
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="生产节拍" prop="cycleTime">
              <el-input-number
                v-model="formData.cycleTime"
                :min="1"
                :max="300"
                placeholder="输入节拍时间" />
              <span class="unit-label">秒/件</span>
            </el-form-item>

            <el-form-item label="日产量" prop="dailyOutput">
              <el-input-number
                v-model="formData.dailyOutput"
                :min="10"
                :max="100000"
                :step="100"
                placeholder="输入日产量" />
              <span class="unit-label">件/天</span>
            </el-form-item>

            <el-form-item label="特殊要求" prop="specialRequirements">
              <el-checkbox-group v-model="formData.specialRequirements">
                <el-checkbox label="需要数据采集" />
                <el-checkbox label="需要追溯系统" />
                <el-checkbox label="需要防错功能" />
                <el-checkbox label="需要远程监控" />
                <el-checkbox label="需要工艺曲线" />
              </el-checkbox-group>
            </el-form-item>

            <!-- 高级选项 -->
            <el-collapse v-model="activeCollapse" class="advanced-options">
              <el-collapse-item title="高级选项" name="advanced">
                <el-form-item label="预算范围" prop="budgetRange">
                  <el-slider
                    v-model="formData.budgetRange"
                    range
                    :min="0"
                    :max="200000"
                    :step="10000"
                    :marks="budgetMarks"
                    style="width: 400px" />
                  <div class="budget-display">
                    {{ formData.budgetRange[0].toLocaleString() }} - 
                    {{ formData.budgetRange[1].toLocaleString() }} 元
                  </div>
                </el-form-item>

                <el-form-item label="优先考虑" prop="priority">
                  <el-radio-group v-model="formData.priority">
                    <el-radio label="性价比">性价比优先</el-radio>
                    <el-radio label="性能">性能优先</el-radio>
                    <el-radio label="品牌">品牌优先</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-collapse-item>
            </el-collapse>

            <!-- 操作按钮 -->
            <el-form-item class="form-actions">
              <el-button
                type="primary"
                size="large"
                :loading="analyzing"
                :disabled="!canAnalyze"
                @click="handleAnalyze">
                <el-icon><MagicStick /></el-icon>
                {{ analyzing ? '智能分析中...' : '开始智能分析' }}
              </el-button>
              <el-button size="large" @click="handleReset">
                <el-icon><RefreshLeft /></el-icon>
                重置表单
              </el-button>
              <el-button size="large" @click="loadHistoryData">
                <el-icon><Clock /></el-icon>
                加载历史记录
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 分析结果 -->
        <transition name="fade-slide">
          <div v-if="analysisResult" class="analysis-result">
            <el-card shadow="hover">
              <template #header>
                <div class="result-header">
                  <span class="result-title">
                    <el-icon><TrendCharts /></el-icon>
                    智能分析结果
                  </span>
                  <el-tag type="success" size="large">
                    匹配度: {{ analysisResult.matchScore }}%
                  </el-tag>
                </div>
              </template>

              <!-- 推荐方案 -->
              <div class="recommendations">
                <h3>推荐方案</h3>
                <el-row :gutter="20">
                  <el-col
                    v-for="(solution, index) in analysisResult.solutions"
                    :key="index"
                    :span="8">
                    <el-card class="solution-card" shadow="hover">
                      <div class="solution-rank">方案{{ index + 1 }}</div>
                      <div class="solution-name">{{ solution.name }}</div>
                      <div class="solution-match">
                        <el-progress
                          type="circle"
                          :percentage="solution.matchScore"
                          :width="80"
                          :color="getProgressColor(solution.matchScore)" />
                      </div>
                      <div class="solution-specs">
                        <div class="spec-item">
                          <span class="spec-label">型号</span>
                          <span class="spec-value">{{ solution.model }}</span>
                        </div>
                        <div class="spec-item">
                          <span class="spec-label">扭矩范围</span>
                          <span class="spec-value">{{ solution.torqueRange }}</span>
                        </div>
                        <div class="spec-item">
                          <span class="spec-label">精度</span>
                          <span class="spec-value">{{ solution.accuracy }}</span>
                        </div>
                        <div class="spec-item">
                          <span class="spec-label">价格</span>
                          <span class="spec-value price">¥{{ solution.price.toLocaleString() }}</span>
                        </div>
                      </div>
                      <div class="solution-features">
                        <el-tag
                          v-for="feature in solution.features"
                          :key="feature"
                          size="small"
                          type="info">
                          {{ feature }}
                        </el-tag>
                      </div>
                      <div class="solution-actions">
                        <el-button type="primary" size="small" @click="viewDetails(solution)">
                          查看详情
                        </el-button>
                        <el-button size="small" @click="compareWith(solution)">
                          对比分析
                        </el-button>
                      </div>
                    </el-card>
                  </el-col>
                </el-row>
              </div>

              <!-- AI分析洞察 -->
              <div class="ai-insights">
                <h3>AI分析洞察</h3>
                <el-timeline>
                  <el-timeline-item
                    v-for="(insight, index) in analysisResult.insights"
                    :key="index"
                    :timestamp="insight.category"
                    placement="top"
                    :type="insight.type">
                    <el-card>
                      <h4>{{ insight.title }}</h4>
                      <p>{{ insight.content }}</p>
                      <div v-if="insight.suggestions" class="insight-suggestions">
                        <el-tag
                          v-for="(sug, idx) in insight.suggestions"
                          :key="idx"
                          size="small">
                          {{ sug }}
                        </el-tag>
                      </div>
                    </el-card>
                  </el-timeline-item>
                </el-timeline>
              </div>

              <!-- 决策依据 -->
              <div class="decision-basis">
                <h3>决策依据</h3>
                <el-descriptions :column="2" border>
                  <el-descriptions-item label="分析模型">智能推荐引擎 v3.0</el-descriptions-item>
                  <el-descriptions-item label="样本数量">{{ analysisResult.sampleSize }}</el-descriptions-item>
                  <el-descriptions-item label="置信水平">{{ (agentState.confidence * 100).toFixed(1) }}%</el-descriptions-item>
                  <el-descriptions-item label="分析时间">{{ analysisResult.analysisTime }}ms</el-descriptions-item>
                  <el-descriptions-item label="考虑因素" :span="2">
                    {{ analysisResult.factors.join('、') }}
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </el-card>
          </div>
        </transition>
      </div>
    </section>

    <!-- 活动日志（开发模式） -->
    <section v-if="isDevelopment" class="activity-log">
      <div class="container">
        <el-card>
          <template #header>
            <span>智能体活动日志</span>
            <el-button size="small" @click="activityLog = []">清空</el-button>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="log in activityLog.slice(0, 10)"
              :key="log.timestamp"
              :timestamp="formatTimestamp(log.timestamp)"
              placement="top">
              <strong>{{ log.type }}</strong>: {{ JSON.stringify(log.data) }}
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Tools, MagicStick, Checked, Document, CircleCheck, User, Setting,
  Warning, QuestionFilled, RefreshLeft, Clock, TrendCharts
} from '@element-plus/icons-vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import { useAgentCore } from '../composables/useAgentCore'
import { useSmartUI } from '../composables/useSmartUI'

const router = useRouter()
const isDevelopment = import.meta.env.DEV

// ==================== 智能体核心初始化 ====================

const {
  agentState,
  environmentSensors,
  realtimeReaction,
  proactiveEngine,
  socialNetwork,
  adaptiveSystem,
  activityLog,
  autonomousDecision,
  registerTrigger,
  proactiveAnalysis,
  connectAgent,
  recordExperience,
  optimizePerformance,
  logActivity
} = useAgentCore({
  agentId: 'tool-selector',
  agentName: '拧紧工具选型',
  goals: ['推荐最优工具', '提供专业建议', '优化用户体验'],
  learningRate: 0.3
})

const {
  loadingState,
  smartLoading,
  formIntelligence,
  smartFormHelper,
  feedbackSystem
} = useSmartUI()

// ==================== 表单数据 ====================

const formRef = ref(null)
const formData = reactive({
  material: '',
  boltSize: '',
  targetTorque: null,
  torqueAccuracy: '±5%',
  environment: [],
  cycleTime: null,
  dailyOutput: null,
  specialRequirements: [],
  budgetRange: [10000, 100000],
  priority: '性价比'
})

const formRules = {
  material: [{ required: true, message: '请选择工件材料', trigger: 'change' }],
  boltSize: [{ required: true, message: '请输入螺栓规格', trigger: 'blur' }],
  targetTorque: [{ required: true, message: '请输入目标扭矩', trigger: 'blur' }]
}

const activeCollapse = ref([])
const analyzing = ref(false)
const analysisResult = ref(null)

// ==================== 计算属性 ====================

const canAnalyze = computed(() => {
  return formData.material && formData.boltSize && formData.targetTorque
})

const progressColor = computed(() => {
  const progress = formIntelligence.fillProgress
  if (progress < 50) return '#f56c6c'
  if (progress < 80) return '#e6a23c'
  return '#67c23a'
})

const budgetMarks = {
  0: '0',
  50000: '5万',
  100000: '10万',
  150000: '15万',
  200000: '20万'
}

// ==================== 反应性触发器注册 ====================

onMounted(() => {
  // 注册表单变化触发器
  registerTrigger(
    'form_change',
    (newVal, oldVal) => {
      return newVal.userInput !== oldVal.userInput
    },
    (newVal) => {
      logActivity('form_changed', { formData: {...formData} })
      updateFormProgress()
      autoSaveForm()
    },
    8
  )

  // 注册数据质量检测触发器
  registerTrigger(
    'quality_check',
    (newVal) => {
      return newVal.dataChanges && newVal.dataChanges.length > 0
    },
    async () => {
      const suggestions = await proactiveAnalysis(formData)
      logActivity('quality_checked', { suggestions })
    },
    7
  )

  // 连接其他智能体
  connectAgent('curve-analysis', 'peer')
  connectAgent('tightening-data', 'peer')

  // 启动主动分析
  setTimeout(() => {
    proactiveAnalysis(formData)
  }, 2000)
})

// ==================== 表单处理 ====================

const handleFormChange = () => {
  environmentSensors.userInput = Date.now()
  environmentSensors.dataChanges.push({
    timestamp: Date.now(),
    type: 'form_input',
    data: { ...formData }
  })
}

const handleMaterialChange = (value) => {
  logActivity('material_selected', { material: value })
  
  // 主动提供建议
  if (value === 'aluminum') {
    feedbackSystem.warning(
      '铝合金材料建议使用防滑扭矩工具，避免表面划伤',
      '查看推荐工具'
    )
  }

  // 自主决策：自动调整扭矩建议
  autonomousDecision({
    action: 'adjust_torque_suggestion',
    material: value
  })
}

const updateFormProgress = () => {
  const requiredFields = ['material', 'boltSize', 'targetTorque']
  smartFormHelper.calculateProgress(formData, requiredFields)
}

const autoSaveForm = () => {
  // 自动保存到localStorage
  if (formIntelligence.autoSave) {
    localStorage.setItem('toolSelector_formData', JSON.stringify(formData))
    logActivity('form_auto_saved', { formData })
  }
}

const loadHistoryData = () => {
  const saved = localStorage.getItem('toolSelector_formData')
  if (saved) {
    Object.assign(formData, JSON.parse(saved))
    feedbackSystem.success('已加载历史记录')
    updateFormProgress()
  } else {
    feedbackSystem.warning('暂无历史记录')
  }
}

const handleReset = () => {
  ElMessageBox.confirm('确定要重置表单吗？', '提示', {
    type: 'warning'
  }).then(() => {
    formRef.value.resetFields()
    analysisResult.value = null
    feedbackSystem.success('表单已重置')
    logActivity('form_reset', {})
  }).catch(() => {})
}

// ==================== 智能分析 ====================

const handleAnalyze = async () => {
  // 验证表单
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) {
    feedbackSystem.error('请完整填写必填项')
    return
  }

  analyzing.value = true
  smartLoading.start('智能分析中，请稍候...', 3000)

  try {
    const startTime = Date.now()

    // 模拟智能分析过程
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 生成分析结果
    analysisResult.value = {
      matchScore: 92,
      analysisTime: Date.now() - startTime,
      sampleSize: 1247,
      factors: ['工件材料', '扭矩需求', '精度要求', '生产节拍', '特殊环境'],
      solutions: [
        {
          name: 'Atlas Copco PF6000',
          model: 'PF6050-25-T',
          matchScore: 95,
          torqueRange: '10-50 N·m',
          accuracy: '±3%',
          price: 85000,
          features: ['数据采集', '工艺曲线', '防错功能']
        },
        {
          name: 'Desoutter ESP2',
          model: 'ESP2-50-25',
          matchScore: 88,
          torqueRange: '5-45 N·m',
          accuracy: '±4%',
          price: 72000,
          features: ['数据采集', '追溯系统']
        },
        {
          name: 'Ingersoll Rand QX Series',
          model: 'QXX5PT40PS10',
          matchScore: 85,
          torqueRange: '8-40 N·m',
          accuracy: '±5%',
          price: 58000,
          features: ['数据采集', '远程监控']
        }
      ],
      insights: [
        {
          category: '工艺匹配',
          type: 'success',
          title: '扭矩需求匹配度高',
          content: '目标扭矩在推荐工具的最佳工作范围内，能够充分发挥工具性能',
          suggestions: ['建议使用中档扭矩范围', '预留20%安全余量']
        },
        {
          category: '成本分析',
          type: 'primary',
          title: '性价比优化建议',
          content: '综合考虑采购成本、维护成本和使用寿命，方案2性价比最优',
          suggestions: ['3年投资回报期', '年维护成本约8000元']
        },
        {
          category: '技术建议',
          type: 'warning',
          title: '特殊环境考量',
          content: '您选择了高温环境，建议选择耐高温型号或增加冷却装置',
          suggestions: ['推荐耐温等级IP65', '配置主动冷却']
        }
      ]
    }

    // 记录成功经验
    recordExperience({
      context: { formData: {...formData} },
      action: 'analyze',
      result: analysisResult.value,
      success: true,
      feedback: 'analysis_completed'
    })

    smartLoading.finish()
    feedbackSystem.success('分析完成！为您推荐了3个最优方案')
    
    // 优化性能
    optimizePerformance()

  } catch (error) {
    feedbackSystem.error('分析失败，请重试', error.message)
    
    // 记录失败经验
    recordExperience({
      context: { formData: {...formData} },
      action: 'analyze',
      result: null,
      success: false,
      feedback: error.message
    })
  } finally {
    analyzing.value = false
  }
}

const viewDetails = (solution) => {
  ElMessageBox.alert(
    `详细规格和技术参数即将展示`,
    solution.name,
    {
      confirmButtonText: '确定'
    }
  )
}

const compareWith = (solution) => {
  ElMessage.info('对比功能开发中...')
}

const getProgressColor = (percentage) => {
  if (percentage >= 90) return '#67c23a'
  if (percentage >= 80) return '#409eff'
  if (percentage >= 70) return '#e6a23c'
  return '#f56c6c'
}

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString()
}

// ==================== 监听器 ====================

watch(() => formData.targetTorque, (newVal) => {
  if (newVal && newVal > 500) {
    feedbackSystem.warning(
      '目标扭矩较大，建议选择重型拧紧工具',
      '查看大扭矩方案'
    )
  }
})

watch(() => formData.dailyOutput, (newVal) => {
  if (newVal && newVal > 10000) {
    feedbackSystem.success(
      '检测到高产量需求，智能体建议关注设备耐用性和自动化程度'
    )
  }
})

</script>

<style scoped lang="scss">
.tool-selector-enhanced {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 60px;
}

// 智能体状态栏
.agent-status-bar {
  background: rgba(255, 255, 255, 0.95);
  padding: 12px 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 60px;
  z-index: 100;

  .status-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: 8px;

    .pulse-dot {
      width: 8px;
      height: 8px;
      background: #67c23a;
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    .status-text {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }
  }

  .status-metrics {
    display: flex;
    gap: 12px;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

// 页面标题
.selector-header {
  position: relative;
  padding: 80px 0 60px;
  color: white;
  overflow: hidden;

  .header-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
  }

  .header-content {
    position: relative;
    z-index: 1;
    text-align: center;
  }

  .header-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.2);
    padding: 8px 20px;
    border-radius: 20px;
    font-size: 14px;
    margin-bottom: 20px;
  }

  h1 {
    font-size: 42px;
    font-weight: 700;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  p {
    font-size: 18px;
    margin-bottom: 32px;
    opacity: 0.95;
  }

  .header-features {
    display: flex;
    justify-content: center;
    gap: 24px;
    flex-wrap: wrap;
  }

  .feature-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.15);
    padding: 10px 20px;
    border-radius: 24px;
    font-size: 14px;
    backdrop-filter: blur(10px);
  }
}

// 智能建议
.proactive-suggestions {
  padding: 20px 0;

  .suggestion-alert {
    margin-bottom: 16px;

    .suggestion-actions {
      margin-top: 12px;
      display: flex;
      gap: 8px;
    }
  }
}

// 表单区域
.selector-form {
  padding: 40px 0;

  .form-progress {
    margin-bottom: 24px;

    .progress-text {
      font-size: 14px;
      font-weight: 500;
    }
  }

  .form-card {
    margin-bottom: 32px;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 600;
    }
  }

  .unit-label {
    margin-left: 8px;
    color: #606266;
  }

  .info-icon {
    margin-left: 8px;
    color: #409eff;
    cursor: help;
  }

  .form-error-tip {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #f56c6c;
  }

  .advanced-options {
    margin-top: 24px;
  }

  .budget-display {
    margin-top: 8px;
    font-size: 14px;
    color: #409eff;
    font-weight: 500;
  }

  .form-actions {
    margin-top: 32px;
    text-align: center;
  }
}

// 分析结果
.analysis-result {
  .result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .result-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 20px;
      font-weight: 600;
    }
  }

  .recommendations {
    margin-bottom: 32px;

    h3 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #333;
    }
  }

  .solution-card {
    position: relative;
    height: 100%;

    .solution-rank {
      position: absolute;
      top: 12px;
      right: 12px;
      background: #409eff;
      color: white;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .solution-name {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 16px;
      color: #333;
    }

    .solution-match {
      text-align: center;
      margin-bottom: 20px;
    }

    .solution-specs {
      margin-bottom: 16px;

      .spec-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 14px;

        .spec-label {
          color: #909399;
        }

        .spec-value {
          font-weight: 500;
          color: #333;

          &.price {
            color: #f56c6c;
            font-weight: 600;
          }
        }
      }
    }

    .solution-features {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
    }

    .solution-actions {
      display: flex;
      gap: 8px;
    }
  }

  .ai-insights {
    margin-bottom: 32px;

    h3 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #333;
    }

    h4 {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 8px;
      color: #333;
    }

    p {
      color: #606266;
      line-height: 1.6;
      margin-bottom: 12px;
    }

    .insight-suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }

  .decision-basis {
    h3 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #333;
    }
  }
}

// 活动日志
.activity-log {
  padding: 40px 0;
}

// 过渡动画
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

// 响应式
@media (max-width: 768px) {
  .selector-header {
    h1 {
      font-size: 28px;
    }

    p {
      font-size: 16px;
    }
  }

  .solution-card {
    margin-bottom: 16px;
  }
}
</style>
