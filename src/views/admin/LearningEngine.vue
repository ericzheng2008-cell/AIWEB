<template>
  <div class="learning-engine-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1>🧠 主动学习引擎</h1>
          <p class="subtitle">智能体持续学习与自动优化系统</p>
        </div>
        <div class="header-actions">
          <el-switch
            v-model="learningConfig.enabled"
            active-text="学习引擎已启用"
            inactive-text="学习引擎已禁用"
            @change="toggleLearningEngine"
          />
          <el-button type="primary" :icon="MagicStick" @click="executeAllTasks">
            执行全部待处理任务
          </el-button>
          <el-button :icon="Refresh" @click="refreshData">
            刷新数据
          </el-button>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="statistics-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                <el-icon><ChatLineRound /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-label">总反馈数</div>
                <div class="stat-value">{{ statistics.totalFeedbacks }}</div>
                <div class="stat-trend">
                  <span class="positive">正面: {{ statistics.positiveFeedbacks }}</span>
                  <span class="negative">负面: {{ statistics.negativeFeedbacks }}</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
                <el-icon><StarFilled /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-label">平均评分</div>
                <div class="stat-value">{{ statistics.avgRating }}</div>
                <div class="stat-detail">
                  准确率: {{ statistics.avgAccuracy }}%
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
                <el-icon><List /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-label">学习任务</div>
                <div class="stat-value">{{ statistics.totalTasks }}</div>
                <div class="stat-detail">
                  完成: {{ statistics.completedTasks }} ({{ statistics.successRate }}%)
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
                <el-icon><TrendCharts /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-label">总改进数</div>
                <div class="stat-value">{{ statistics.totalImprovements }}</div>
                <div class="stat-detail">学习进度: {{ learningProgress }}%</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 主内容区 -->
    <el-card class="main-content">
      <el-tabs v-model="activeTab">
        <!-- 用户反馈 -->
        <el-tab-pane label="用户反馈" name="feedbacks">
          <div class="toolbar">
            <el-button type="primary" :icon="Plus" @click="showFeedbackDialog">
              添加反馈 (测试)
            </el-button>
            <el-button :icon="Check" @click="processPendingFeedbacks">
              批量处理待处理反馈
            </el-button>
          </div>

          <el-table :data="feedbacks.slice(0, 50)" stripe max-height="600">
            <el-table-column prop="id" label="ID" width="60" />
            
            <el-table-column label="智能体" width="150">
              <template #default="scope">
                <el-tag size="small">{{ getAgentName(scope.row.agentId) }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column label="评分" width="120" align="center">
              <template #default="scope">
                <el-rate
                  v-model="scope.row.rating"
                  disabled
                  show-score
                  text-color="#ff9900"
                />
              </template>
            </el-table-column>

            <el-table-column label="情感" width="100" align="center">
              <template #default="scope">
                <el-tag
                  :type="getSentimentType(scope.row.sentiment)"
                  size="small"
                >
                  {{ getSentimentText(scope.row.sentiment) }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column prop="comment" label="评论" min-width="200" show-overflow-tooltip />

            <el-table-column label="指标" width="180">
              <template #default="scope">
                <div class="metrics">
                  <span>准确: {{ scope.row.accuracy }}%</span>
                  <span>有用: {{ scope.row.helpfulness }}%</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="状态" width="100" align="center">
              <template #default="scope">
                <el-tag
                  :type="scope.row.status === 'processed' ? 'success' : 'warning'"
                  size="small"
                >
                  {{ scope.row.status === 'processed' ? '已处理' : '待处理' }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="时间" width="160">
              <template #default="scope">
                {{ formatDate(scope.row.createdAt) }}
              </template>
            </el-table-column>

            <el-table-column label="操作" width="120" fixed="right">
              <template #default="scope">
                <el-button link type="primary" size="small" @click="viewFeedback(scope.row)">
                  查看
                </el-button>
                <el-button
                  v-if="scope.row.status === 'pending'"
                  link
                  type="success"
                  size="small"
                  @click="processFeedback(scope.row.id)"
                >
                  处理
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 学习任务 -->
        <el-tab-pane label="学习任务" name="tasks">
          <el-table :data="learningTasks" stripe>
            <el-table-column prop="id" label="ID" width="60" />
            
            <el-table-column label="类型" width="150">
              <template #default="scope">
                {{ getTaskTypeText(scope.row.type) }}
              </template>
            </el-table-column>

            <el-table-column label="优先级" width="100" align="center">
              <template #default="scope">
                <el-tag
                  :type="getPriorityType(scope.row.priority)"
                  size="small"
                >
                  {{ getPriorityText(scope.row.priority) }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column prop="action" label="动作" width="150" />
            <el-table-column prop="reason" label="原因" min-width="200" show-overflow-tooltip />

            <el-table-column label="状态" width="100" align="center">
              <template #default="scope">
                <el-tag
                  :type="getTaskStatusType(scope.row.status)"
                  size="small"
                >
                  {{ getTaskStatusText(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="创建时间" width="160">
              <template #default="scope">
                {{ formatDate(scope.row.createdAt) }}
              </template>
            </el-table-column>

            <el-table-column label="操作" width="180" fixed="right">
              <template #default="scope">
                <el-button link type="primary" size="small" @click="viewTask(scope.row)">
                  查看
                </el-button>
                <el-button
                  v-if="scope.row.status === 'pending'"
                  link
                  type="success"
                  size="small"
                  :loading="executingTaskId === scope.row.id"
                  @click="executeTask(scope.row.id)"
                >
                  执行
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 质量评估 -->
        <el-tab-pane label="质量评估" name="evaluation">
          <div class="toolbar">
            <el-button type="primary" :icon="Odometer" @click="evaluateAll">
              评估所有知识质量
            </el-button>
          </div>

          <el-table v-if="evaluationResults.length > 0" :data="evaluationResults" stripe>
            <el-table-column label="知识ID" width="100">
              <template #default="scope">
                <el-link type="primary" @click="viewKnowledge(scope.row.knowledgeId)">
                  #{{ scope.row.knowledgeId }}
                </el-link>
              </template>
            </el-table-column>

            <el-table-column label="综合评分" width="120" align="center">
              <template #default="scope">
                <el-progress
                  :percentage="scope.row.score"
                  :color="getScoreColor(scope.row.score)"
                  :stroke-width="20"
                  :text-inside="true"
                />
              </template>
            </el-table-column>

            <el-table-column label="指标" width="300">
              <template #default="scope">
                <div class="metrics-grid">
                  <div>评分: {{ scope.row.metrics?.avgRating || '-' }}</div>
                  <div>准确: {{ scope.row.metrics?.avgAccuracy || '-' }}%</div>
                  <div>有用: {{ scope.row.metrics?.avgHelpfulness || '-' }}%</div>
                  <div>完整: {{ scope.row.metrics?.avgCompleteness || '-' }}%</div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="反馈统计" width="180">
              <template #default="scope">
                <div v-if="scope.row.sentiments">
                  <el-tag type="success" size="small">正: {{ scope.row.sentiments.positive }}</el-tag>
                  <el-tag type="info" size="small">中: {{ scope.row.sentiments.neutral }}</el-tag>
                  <el-tag type="danger" size="small">负: {{ scope.row.sentiments.negative }}</el-tag>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="建议" min-width="300">
              <template #default="scope">
                <div v-if="scope.row.recommendations?.length > 0">
                  <el-tag
                    v-for="(rec, idx) in scope.row.recommendations.slice(0, 2)"
                    :key="idx"
                    :type="rec.severity === 'critical' ? 'danger' : rec.severity === 'high' ? 'warning' : 'info'"
                    size="small"
                    style="margin: 2px"
                  >
                    {{ rec.suggestion }}
                  </el-tag>
                </div>
                <span v-else class="text-muted">暂无建议</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="120" fixed="right">
              <template #default="scope">
                <el-button link type="primary" size="small" @click="createOptimizationTask(scope.row)">
                  创建优化任务
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-empty v-else description="点击'评估所有知识质量'按钮开始评估" />
        </el-tab-pane>

        <!-- 学习配置 -->
        <el-tab-pane label="学习配置" name="config">
          <el-form :model="learningConfig" label-width="150px">
            <el-form-item label="启用学习引擎">
              <el-switch v-model="learningConfig.enabled" />
            </el-form-item>

            <el-form-item label="自动优化">
              <el-switch v-model="learningConfig.autoOptimize" />
              <span class="form-tip">启用后,系统将根据反馈自动创建优化任务</span>
            </el-form-item>

            <el-form-item label="反馈阈值">
              <el-input-number
                v-model="learningConfig.feedbackThreshold"
                :min="1"
                :max="100"
              />
              <span class="form-tip">触发优化所需的最少反馈数量</span>
            </el-form-item>

            <el-form-item label="质量阈值">
              <el-input-number
                v-model="learningConfig.qualityThreshold"
                :min="0"
                :max="100"
              />
              <span class="form-tip">低于此分数将触发优化任务</span>
            </el-form-item>

            <el-form-item label="学习率">
              <el-slider
                v-model="learningConfig.learningRate"
                :min="0"
                :max="1"
                :step="0.01"
                show-input
                :input-size="'small'"
              />
              <span class="form-tip">控制模型更新的速度(0-1)</span>
            </el-form-item>

            <el-form-item label="探索率">
              <el-slider
                v-model="learningConfig.explorationRate"
                :min="0"
                :max="1"
                :step="0.01"
                show-input
                :input-size="'small'"
              />
              <span class="form-tip">用于A/B测试的流量比例(0-1)</span>
            </el-form-item>

            <el-form-item label="奖励权重">
              <el-row :gutter="10">
                <el-col :span="6">
                  <el-input-number
                    v-model="learningConfig.rewardWeights.accuracy"
                    :min="0"
                    :max="1"
                    :step="0.1"
                    :controls="false"
                  >
                    <template #prepend>准确性</template>
                  </el-input-number>
                </el-col>
                <el-col :span="6">
                  <el-input-number
                    v-model="learningConfig.rewardWeights.helpfulness"
                    :min="0"
                    :max="1"
                    :step="0.1"
                    :controls="false"
                  >
                    <template #prepend>有用性</template>
                  </el-input-number>
                </el-col>
                <el-col :span="6">
                  <el-input-number
                    v-model="learningConfig.rewardWeights.completeness"
                    :min="0"
                    :max="1"
                    :step="0.1"
                    :controls="false"
                  >
                    <template #prepend>完整性</template>
                  </el-input-number>
                </el-col>
                <el-col :span="6">
                  <el-input-number
                    v-model="learningConfig.rewardWeights.speed"
                    :min="0"
                    :max="1"
                    :step="0.1"
                    :controls="false"
                  >
                    <template #prepend>速度</template>
                  </el-input-number>
                </el-col>
              </el-row>
              <span class="form-tip">总和应等于1.0</span>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="saveConfig">保存配置</el-button>
              <el-button @click="resetConfig">重置为默认</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 反馈详情对话框 -->
    <el-dialog
      v-model="feedbackDialogVisible"
      title="反馈详情"
      width="600px"
    >
      <el-descriptions v-if="currentFeedback" :column="2" border>
        <el-descriptions-item label="ID">{{ currentFeedback.id }}</el-descriptions-item>
        <el-descriptions-item label="智能体">{{ getAgentName(currentFeedback.agentId) }}</el-descriptions-item>
        <el-descriptions-item label="用户">{{ currentFeedback.userId }}</el-descriptions-item>
        <el-descriptions-item label="评分">
          <el-rate v-model="currentFeedback.rating" disabled />
        </el-descriptions-item>
        <el-descriptions-item label="情感" :span="2">
          <el-tag :type="getSentimentType(currentFeedback.sentiment)">
            {{ getSentimentText(currentFeedback.sentiment) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="准确性">{{ currentFeedback.accuracy }}%</el-descriptions-item>
        <el-descriptions-item label="有用性">{{ currentFeedback.helpfulness }}%</el-descriptions-item>
        <el-descriptions-item label="完整性">{{ currentFeedback.completeness }}%</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentFeedback.status === 'processed' ? 'success' : 'warning'">
            {{ currentFeedback.status === 'processed' ? '已处理' : '待处理' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="评论" :span="2">
          {{ currentFeedback.comment || '无' }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">
          {{ formatDate(currentFeedback.createdAt) }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 添加反馈对话框(测试用) -->
    <el-dialog
      v-model="addFeedbackDialogVisible"
      title="添加测试反馈"
      width="500px"
    >
      <el-form :model="feedbackForm" label-width="100px">
        <el-form-item label="智能体">
          <el-input v-model="feedbackForm.agentId" placeholder="如: agent-1" />
        </el-form-item>
        <el-form-item label="评分">
          <el-rate v-model="feedbackForm.rating" show-score />
        </el-form-item>
        <el-form-item label="准确性">
          <el-slider v-model="feedbackForm.accuracy" show-input />
        </el-form-item>
        <el-form-item label="有用性">
          <el-slider v-model="feedbackForm.helpfulness" show-input />
        </el-form-item>
        <el-form-item label="评论">
          <el-input v-model="feedbackForm.comment" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="addFeedbackDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitFeedback">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus, Refresh, Check, MagicStick, Odometer,
  ChatLineRound, StarFilled, List, TrendCharts
} from '@element-plus/icons-vue'
import useLearningEngine from '@/store/learningEngine'
import { useAgentRegistryStore } from '@/store/agentRegistry'
import useKnowledgeBase from '@/store/knowledgeBase'

// 学习引擎实例
const le = useLearningEngine()
const ar = useAgentRegistryStore()
const kb = useKnowledgeBase()

// 响应式数据
const { state, feedbacks, learningTasks, statistics, learningConfig, learningProgress } = le

// Tab控制
const activeTab = ref('feedbacks')

// 对话框控制
const feedbackDialogVisible = ref(false)
const addFeedbackDialogVisible = ref(false)

// 当前数据
const currentFeedback = ref(null)
const executingTaskId = ref(null)

// 评估结果
const evaluationResults = ref([])

// 反馈表单
const feedbackForm = reactive({
  agentId: 'agent-1',
  rating: 4,
  accuracy: 85,
  helpfulness: 80,
  comment: ''
})

// 方法
const getAgentName = (agentId) => {
  const agent = ar.getAgentById(agentId)
  return agent?.name || agentId
}

const getSentimentType = (sentiment) => {
  const types = {
    positive: 'success',
    neutral: 'info',
    negative: 'danger'
  }
  return types[sentiment] || 'info'
}

const getSentimentText = (sentiment) => {
  const texts = {
    positive: '正面',
    neutral: '中性',
    negative: '负面'
  }
  return texts[sentiment] || sentiment
}

const getPriorityType = (priority) => {
  const types = {
    critical: 'danger',
    high: 'warning',
    medium: 'primary',
    low: 'info'
  }
  return types[priority] || 'info'
}

const getPriorityText = (priority) => {
  const texts = {
    critical: '紧急',
    high: '高',
    medium: '中',
    low: '低'
  }
  return texts[priority] || priority
}

const getTaskTypeText = (type) => {
  const texts = {
    knowledge_optimization: '知识优化',
    accuracy_improvement: '准确性提升',
    agent_tuning: '智能体调优',
    sentiment_analysis: '情感分析',
    knowledge_extraction: '知识提取'
  }
  return texts[type] || type
}

const getTaskStatusType = (status) => {
  const types = {
    pending: 'warning',
    running: 'primary',
    completed: 'success',
    failed: 'danger'
  }
  return types[status] || 'info'
}

const getTaskStatusText = (status) => {
  const texts = {
    pending: '待处理',
    running: '执行中',
    completed: '已完成',
    failed: '失败'
  }
  return texts[status] || status
}

const getScoreColor = (score) => {
  if (score >= 80) return '#67C23A'
  if (score >= 60) return '#E6A23C'
  return '#F56C6C'
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 反馈操作
const showFeedbackDialog = () => {
  feedbackForm.agentId = 'agent-1'
  feedbackForm.rating = 4
  feedbackForm.accuracy = 85
  feedbackForm.helpfulness = 80
  feedbackForm.comment = ''
  addFeedbackDialogVisible.value = true
}

const submitFeedback = () => {
  le.collectFeedback({
    ...feedbackForm,
    userId: 'test_user',
    completeness: feedbackForm.helpfulness
  })
  
  ElMessage.success('反馈已添加')
  addFeedbackDialogVisible.value = false
}

const viewFeedback = (feedback) => {
  currentFeedback.value = feedback
  feedbackDialogVisible.value = true
}

const processFeedback = (id) => {
  le.processFeedbacks([id])
  ElMessage.success('反馈已处理')
}

const processPendingFeedbacks = () => {
  const pending = le.pendingFeedbacks.value
  if (pending.length === 0) {
    ElMessage.info('没有待处理的反馈')
    return
  }
  
  le.processFeedbacks(pending.map(f => f.id))
  ElMessage.success(`已处理 ${pending.length} 条反馈`)
}

// 任务操作
const viewTask = (task) => {
  ElMessageBox.alert(
    `<strong>任务详情</strong><br>
    类型: ${getTaskTypeText(task.type)}<br>
    动作: ${task.action}<br>
    原因: ${task.reason}<br>
    建议数: ${task.recommendations.length}`,
    '学习任务详情',
    {
      dangerouslyUseHTMLString: true
    }
  )
}

const executeTask = async (taskId) => {
  executingTaskId.value = taskId
  
  try {
    const success = await le.executeLearningTask(taskId)
    if (success) {
      ElMessage.success('任务执行成功')
    } else {
      ElMessage.error('任务执行失败')
    }
  } finally {
    executingTaskId.value = null
  }
}

const executeAllTasks = async () => {
  const pending = le.pendingTasks.value
  if (pending.length === 0) {
    ElMessage.info('没有待处理的任务')
    return
  }
  
  ElMessage.info(`开始执行 ${Math.min(pending.length, 5)} 个任务...`)
  
  const results = await le.executeAllPendingTasks()
  const successCount = results.filter(r => r.success).length
  
  ElMessage.success(`成功执行 ${successCount} 个任务`)
}

// 质量评估
const evaluateAll = () => {
  ElMessage.info('正在评估所有知识质量...')
  
  evaluationResults.value = le.evaluateAllKnowledge()
  
  ElMessage.success(`评估完成! 共评估 ${evaluationResults.value.length} 个知识`)
}

const viewKnowledge = (knowledgeId) => {
  // TODO: 跳转到知识详情
  ElMessage.info(`查看知识 #${knowledgeId}`)
}

const createOptimizationTask = (evaluation) => {
  if (evaluation.recommendations.length === 0) {
    ElMessage.info('该知识暂无优化建议')
    return
  }
  
  le.createLearningTask({
    agentId: 'system',
    type: 'knowledge_optimization',
    priority: 'medium',
    targetId: evaluation.knowledgeId,
    action: 'optimize_content',
    reason: `综合评分: ${evaluation.score}分`,
    recommendations: evaluation.recommendations,
    metrics: {
      currentScore: evaluation.score,
      expectedScore: Math.min(evaluation.score + 20, 100),
      improvement: 20
    }
  })
  
  ElMessage.success('优化任务已创建')
}

// 配置操作
const toggleLearningEngine = () => {
  le.saveToLocalStorage()
  ElMessage.success(learningConfig.enabled ? '学习引擎已启用' : '学习引擎已禁用')
}

const saveConfig = () => {
  le.saveToLocalStorage()
  ElMessage.success('配置已保存')
}

const resetConfig = () => {
  // 重置为默认值
  learningConfig.feedbackThreshold = 10
  learningConfig.qualityThreshold = 70
  learningConfig.learningRate = 0.1
  learningConfig.explorationRate = 0.2
  learningConfig.rewardWeights = {
    accuracy: 0.4,
    helpfulness: 0.3,
    completeness: 0.2,
    speed: 0.1
  }
  
  le.saveToLocalStorage()
  ElMessage.success('已重置为默认配置')
}

const refreshData = () => {
  le.loadFromLocalStorage()
  le.updateStatistics()
  ElMessage.success('数据已刷新')
}

// 生命周期
onMounted(() => {
  le.loadFromLocalStorage()
  le.updateStatistics()
  
  // 如果没有数据,初始化演示数据
  if (state.feedbacks.length === 0) {
    le.initDemoData()
  }
})
</script>

<style scoped>
.learning-engine-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  background: white;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-section h1 {
  margin: 0;
  font-size: 28px;
  color: #303133;
}

.subtitle {
  margin: 8px 0 0 0;
  color: #909399;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

/* 统计卡片 */
.statistics-cards {
  margin-bottom: 20px;
}

.stat-card {
  height: 100%;
  cursor: pointer;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-detail,
.stat-trend {
  font-size: 12px;
  color: #909399;
}

.stat-trend {
  display: flex;
  gap: 10px;
}

.stat-trend .positive {
  color: #67C23A;
}

.stat-trend .negative {
  color: #F56C6C;
}

/* 主内容 */
.main-content {
  background: white;
}

.toolbar {
  margin-bottom: 16px;
}

.metrics {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 4px;
  font-size: 12px;
}

.text-muted {
  color: #909399;
  font-size: 12px;
}

.form-tip {
  margin-left: 12px;
  font-size: 12px;
  color: #909399;
}
</style>
