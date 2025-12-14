<template>
  <div class="antom-ai-monitor">
    <!-- 浮动监控按钮 -->
    <el-badge :value="unreadCount" :hidden="unreadCount === 0" class="monitor-badge">
      <el-button 
        circle 
        size="large"
        type="primary"
        class="monitor-button"
        @click="showMonitor = !showMonitor">
        <el-icon :size="24"><Cpu /></el-icon>
      </el-button>
    </el-badge>

    <!-- 监控面板 -->
    <el-drawer
      v-model="showMonitor"
      title="安彤智能体监控中心"
      direction="rtl"
      size="450px"
      :close-on-click-modal="false">
      
      <!-- 系统状态 -->
      <div class="status-section">
        <h3>🤖 系统状态</h3>
        <el-card shadow="hover">
          <div class="status-grid">
            <div class="status-item">
              <el-icon :class="['status-icon', antomStore.systemStatus.isLearning ? 'active' : '']">
                <Reading />
              </el-icon>
              <div class="status-info">
                <div class="status-label">自主学习</div>
                <div class="status-value">{{ antomStore.systemStatus.isLearning ? '进行中' : '待机' }}</div>
              </div>
            </div>
            
            <div class="status-item">
              <el-icon :class="['status-icon', antomStore.systemStatus.isThinking ? 'active' : '']">
                <Opportunity />
              </el-icon>
              <div class="status-info">
                <div class="status-label">主动思考</div>
                <div class="status-value">{{ antomStore.systemStatus.isThinking ? '分析中' : '待机' }}</div>
              </div>
            </div>
          </div>
          
          <el-divider />
          
          <div class="health-score">
            <div class="score-label">系统健康度</div>
            <el-progress 
              :percentage="antomStore.systemHealth.overallScore" 
              :color="healthColor"
              :stroke-width="12"
              :show-text="true">
              <template #default="{ percentage }">
                <span class="percentage-value">{{ percentage }}%</span>
              </template>
            </el-progress>
            <div class="score-status">{{ antomStore.systemHealth.status }}</div>
          </div>
        </el-card>
      </div>

      <!-- 学习统计 -->
      <div class="stats-section">
        <h3>📊 学习统计</h3>
        <el-row :gutter="12">
          <el-col :span="12">
            <el-statistic title="行为记录" :value="antomStore.learningStats.totalBehaviors">
              <template #prefix>
                <el-icon><Document /></el-icon>
              </template>
            </el-statistic>
          </el-col>
          <el-col :span="12">
            <el-statistic title="识别模式" :value="antomStore.learningStats.identifiedPatterns">
              <template #prefix>
                <el-icon><Connection /></el-icon>
              </template>
            </el-statistic>
          </el-col>
          <el-col :span="12" style="margin-top: 12px;">
            <el-statistic title="优化次数" :value="antomStore.learningStats.optimizations">
              <template #prefix>
                <el-icon><TrendCharts /></el-icon>
              </template>
            </el-statistic>
          </el-col>
          <el-col :span="12" style="margin-top: 12px;">
            <el-statistic title="知识节点" :value="antomStore.learningStats.knowledgeNodes">
              <template #prefix>
                <el-icon><Share /></el-icon>
              </template>
            </el-statistic>
          </el-col>
        </el-row>
      </div>

      <!-- 主动建议 -->
      <div class="suggestions-section">
        <h3>💡 智能建议</h3>
        <el-empty 
          v-if="recentSuggestions.length === 0" 
          description="暂无新建议"
          :image-size="80" />
        
        <div v-else class="suggestions-list">
          <el-card 
            v-for="(suggestion, index) in recentSuggestions" 
            :key="index"
            class="suggestion-card"
            shadow="hover">
            <div class="suggestion-header">
              <el-tag :type="suggestionTagType(suggestion.priority)">
                {{ suggestion.priority === 'high' ? '重要' : '提示' }}
              </el-tag>
              <span class="suggestion-time">{{ formatTime(suggestion.timestamp) }}</span>
            </div>
            <div class="suggestion-content">{{ suggestion.suggestion.message }}</div>
            <el-button 
              v-if="suggestion.suggestion.action"
              text 
              type="primary"
              size="small"
              @click="handleSuggestionAction(suggestion.suggestion.action)">
              立即处理
            </el-button>
          </el-card>
        </div>
      </div>

      <!-- 改善计划 -->
      <div class="improvement-section">
        <h3>🎯 改善计划</h3>
        <el-timeline>
          <el-timeline-item
            v-for="(item, index) in recentImprovements"
            :key="index"
            :timestamp="formatTime(item.timestamp)"
            placement="top">
            <el-card>
              <h4>{{ item.featureId }}</h4>
              <p>{{ item.plan?.expectedOutcome || '正在优化中...' }}</p>
              <el-tag size="small" type="success">持续改善</el-tag>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>

      <!-- 操作按钮 -->
      <div class="actions-section">
        <el-button type="primary" @click="triggerLearning" :loading="antomStore.systemStatus.isLearning">
          <el-icon><Reading /></el-icon>
          立即学习
        </el-button>
        <el-button type="success" @click="triggerThinking" :loading="antomStore.systemStatus.isThinking">
          <el-icon><Opportunity /></el-icon>
          主动思考
        </el-button>
        <el-button @click="showAIChat = true">
          <el-icon><ChatDotSquare /></el-icon>
          智能对话
        </el-button>
      </div>
    </el-drawer>

    <!-- AI对话窗口 -->
    <el-dialog
      v-model="showAIChat"
      title="💬 与安彤AI对话"
      width="600px"
      :close-on-click-modal="false">
      <div class="chat-container">
        <div class="chat-messages" ref="chatMessages">
          <div 
            v-for="(msg, index) in chatHistory" 
            :key="index"
            :class="['chat-message', msg.role]">
            <div class="message-avatar">
              <el-icon v-if="msg.role === 'ai'"><Avatar /></el-icon>
              <el-icon v-else><UserFilled /></el-icon>
            </div>
            <div class="message-content">{{ msg.content }}</div>
          </div>
        </div>
        
        <div class="chat-input">
          <el-input
            v-model="userInput"
            placeholder="输入您的问题..."
            @keyup.enter="sendMessage">
            <template #append>
              <el-button @click="sendMessage" :disabled="!userInput.trim()">
                <el-icon><Promotion /></el-icon>
              </el-button>
            </template>
          </el-input>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onUnmounted } from 'vue'
import { useAntomAIStore } from '../store/antomAI'
import { 
  Cpu, Reading, Opportunity, Document, Connection, 
  TrendCharts, Share, ChatDotSquare, Avatar, UserFilled, Promotion
} from '@element-plus/icons-vue'

const antomStore = useAntomAIStore()

// 组件卸载时清理定时器
onUnmounted(() => {
  antomStore.stopAllLoops()
})

// 状态
const showMonitor = ref(false)
const showAIChat = ref(false)
const userInput = ref('')
const chatHistory = ref([
  {
    role: 'ai',
    content: '您好！我是安彤智能助手。我会主动学习您的使用习惯，预测您的需求，并持续优化服务。有什么可以帮您的吗？'
  }
])
const chatMessages = ref(null)

// 计算属性
const unreadCount = computed(() => {
  return antomStore.communicationQueue.filter(c => !c.read).length
})

const recentSuggestions = computed(() => {
  return antomStore.communicationQueue.slice(-5).reverse()
})

const recentImprovements = computed(() => {
  return antomStore.learningDatabase.optimizationHistory.slice(-3).reverse()
})

const healthColor = computed(() => {
  const score = antomStore.systemHealth.overallScore
  if (score > 75) return '#67c23a'
  if (score > 50) return '#e6a23c'
  return '#909399'
})

// 方法
const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return date.toLocaleDateString()
}

const suggestionTagType = (priority) => {
  return priority === 'high' ? 'danger' : 'info'
}

const handleSuggestionAction = (action) => {
  // 处理建议的操作
  console.log('执行建议操作:', action)
}

const triggerLearning = async () => {
  await antomStore.learnFromBehaviors()
}

const triggerThinking = async () => {
  await antomStore.proactiveThinking()
}

const sendMessage = () => {
  if (!userInput.value.trim()) return
  
  // 添加用户消息
  chatHistory.value.push({
    role: 'user',
    content: userInput.value
  })
  
  // 获取AI回复
  const response = antomStore.intelligentDialogue(userInput.value)
  
  // 添加AI回复
  setTimeout(() => {
    chatHistory.value.push({
      role: 'ai',
      content: response
    })
    
    // 滚动到底部
    nextTick(() => {
      if (chatMessages.value) {
        chatMessages.value.scrollTop = chatMessages.value.scrollHeight
      }
    })
  }, 500)
  
  userInput.value = ''
}

// 监听打开状态，标记已读
watch(showMonitor, (newVal) => {
  if (newVal) {
    antomStore.communicationQueue.forEach(c => c.read = true)
  }
})
</script>

<style scoped>
.antom-ai-monitor {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 2000;
}

.monitor-badge {
  cursor: pointer;
}

.monitor-button {
  width: 64px;
  height: 64px;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(64, 158, 255, 0.6);
  }
}

.status-section,
.stats-section,
.suggestions-section,
.improvement-section {
  margin-bottom: 24px;
}

.status-section h3,
.stats-section h3,
.suggestions-section h3,
.improvement-section h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #303133;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-icon {
  font-size: 32px;
  color: #909399;
  transition: all 0.3s;
}

.status-icon.active {
  color: #409eff;
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.status-info {
  flex: 1;
}

.status-label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.status-value {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.health-score {
  text-align: center;
}

.score-label {
  font-size: 13px;
  color: #606266;
  margin-bottom: 12px;
}

.percentage-value {
  font-size: 16px;
  font-weight: 700;
}

.score-status {
  margin-top: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #67c23a;
}

.suggestions-list {
  max-height: 300px;
  overflow-y: auto;
}

.suggestion-card {
  margin-bottom: 12px;
}

.suggestion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.suggestion-time {
  font-size: 12px;
  color: #909399;
}

.suggestion-content {
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 12px;
  color: #606266;
}

.actions-section {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.actions-section .el-button {
  flex: 1;
}

/* 对话窗口 */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 500px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 16px;
}

.chat-message {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.chat-message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #409eff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.chat-message.user .message-avatar {
  background: #67c23a;
}

.message-content {
  flex: 1;
  padding: 12px 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  line-height: 1.6;
  max-width: 70%;
}

.chat-message.user .message-content {
  background: #409eff;
  color: #fff;
}

.chat-input {
  padding: 0;
}
</style>
