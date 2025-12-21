<template>
  <div class="ai-chat-container">
    <!-- 遮罩层 - 点击关闭 -->
    <transition name="fade">
      <div 
        v-if="(chatStore.chatVisible && !isMinimized) || isMinimized" 
        class="chat-overlay"
        @click="closeChat"
      ></div>
    </transition>

    <!-- 聊天按钮 - AI人形助手 -->
    <el-tooltip 
      content="点击打开 AI 助手 (快捷键: Ctrl+K) | 长按可拖拽" 
      placement="left"
      :show-after="500"
    >
      <div 
        class="chat-button ai-assistant" 
        :class="{ dragging: isButtonDragging }"
        @click="!isButtonDragging && toggleChat()" 
        @mousedown="startButtonDrag"
        @touchstart="startButtonDrag"
        :style="{ bottom: buttonPosition.y + 'px', right: buttonPosition.x + 'px' }"
        v-if="!chatStore.chatVisible">
      <!-- AI头像容器 -->
      <div class="ai-avatar">
        <!-- 头部 -->
        <div class="ai-head">
          <!-- 发型装饰 -->
          <div class="ai-hair-top"></div>
          <div class="ai-hair-left"></div>
          <div class="ai-hair-right"></div>
          
          <!-- 面部 -->
          <div class="ai-face">
            <!-- 脸部面板线条 -->
            <div class="face-panel panel-left"></div>
            <div class="face-panel panel-right"></div>
            
            <!-- 眼睛 -->
            <div class="ai-eyes">
              <div class="ai-eye left">
                <div class="eye-glow"></div>
              </div>
              <div class="ai-eye right">
                <div class="eye-glow"></div>
              </div>
            </div>
            
            <!-- 额头装饰 -->
            <div class="forehead-dot"></div>
          </div>
        </div>
        
        <!-- 颈部科技纹理 -->
        <div class="ai-neck">
          <div class="neck-glow"></div>
        </div>
        
        <!-- 肩部装饰 -->
        <div class="ai-shoulders">
          <div class="shoulder left">
            <div class="shoulder-circle"></div>
          </div>
          <div class="shoulder right">
            <div class="shoulder-circle"></div>
          </div>
        </div>
      </div>
      
      <div class="chat-badge" v-if="hasUnread">1</div>
    </div>
    </el-tooltip>

    <!-- 最小化聊天窗口 -->
    <transition name="slide-up">
      <div class="chat-mini" v-if="isMinimized" @click.stop>
        <div class="mini-header" @click="restoreChat">
          <el-icon :size="20"><Service /></el-icon>
          <span>{{ t('aiChat.title') }}</span>
        </div>
        <el-icon :size="18" @click="closeChat" class="mini-close">
          <Close />
        </el-icon>
      </div>
    </transition>

    <!-- 聊天窗口 -->
    <transition name="slide-up">
      <div 
        class="chat-window" 
        v-if="chatStore.chatVisible && !isMinimized" 
        @click.stop
        :style="{ top: windowPosition.y + 'px', right: windowPosition.x + 'px' }"
      >
        <!-- 头部 - 可拖动 -->
        <div 
          class="chat-header draggable-header" 
          @mousedown="startDrag"
          @touchstart="startDrag"
        >
          <div class="header-left">
            <el-icon :size="24" color="#fff"><Service /></el-icon>
            <div class="header-info">
              <h3>{{ t('aiChat.title') }}</h3>
              <p>{{ t('aiChat.subtitle') }}</p>
            </div>
          </div>
          <div class="header-actions">
            <el-tooltip content="清空对话" placement="bottom">
              <el-icon :size="20" @click="clearHistory" class="action-icon">
                <Delete />
              </el-icon>
            </el-tooltip>
            <el-tooltip content="最小化" placement="bottom">
              <el-icon :size="20" @click="minimizeChat" class="action-icon">
                <Minus />
              </el-icon>
            </el-tooltip>
            <el-tooltip content="关闭" placement="bottom">
              <el-icon :size="22" @click="closeChat" class="action-icon close-btn">
                <Close />
              </el-icon>
            </el-tooltip>
          </div>
        </div>

        <!-- 消息列表 -->
        <div class="chat-messages" ref="messagesContainer">
          <!-- 欢迎消息 -->
          <div class="message ai-message" v-if="chatStore.messages.length === 0">
            <div class="message-avatar">
              <el-icon :size="24"><Cpu /></el-icon>
            </div>
            <div class="message-content">
              <div class="message-bubble">{{ t('aiChat.welcome') }}</div>
            </div>
          </div>

          <!-- 历史消息 -->
          <div
            v-for="msg in chatStore.messages"
            :key="msg.id"
            :class="['message', `${msg.type}-message`]"
          >
            <div class="message-avatar" v-if="msg.type === 'ai'">
              <el-icon :size="24"><Cpu /></el-icon>
            </div>
            <div class="message-content">
              <div class="message-bubble typing-text" v-html="formatMessage(msg.content)"></div>
              
              <!-- AI消息反馈组件 -->
              <AiChatFeedback
                v-if="msg.type === 'ai' && msg.question"
                :message-id="msg.id"
                :question="msg.question"
                :answer="msg.content"
              />
              
              <!-- 智能建议卡片 -->
              <div v-if="msg.suggestions && msg.suggestions.length > 0" class="suggestions-container">
                <div 
                  v-for="(suggestion, index) in msg.suggestions"
                  :key="index"
                  class="suggestion-card"
                  @click="handleSuggestion(suggestion)"
                >
                  <el-icon :size="16"><component :is="suggestion.icon || 'Promotion'" /></el-icon>
                  <span>{{ suggestion.text }}</span>
                </div>
              </div>
              
              <div class="message-time">
                {{ formatTime(msg.timestamp) }}
              </div>
            </div>
            <div class="message-avatar" v-if="msg.type === 'user'">
              <el-icon :size="24"><User /></el-icon>
            </div>
          </div>

          <!-- 输入中提示 -->
          <div class="message ai-message" v-if="chatStore.isTyping">
            <div class="message-avatar">
              <el-icon :size="24"><Cpu /></el-icon>
            </div>
            <div class="message-content">
              <div class="message-bubble typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        </div>

        <!-- 快捷问题 -->
        <div class="quick-questions" v-if="chatStore.messages.length === 0">
          <div class="quick-title">{{ t('aiChat.quickQuestions') }}</div>
          <div class="question-chips">
            <div
              v-for="(q, key) in quickQuestions"
              :key="key"
              class="question-chip"
              @click="askQuestion(q)"
            >
              {{ q }}
            </div>
          </div>
        </div>

        <!-- 输入区域 -->
        <div class="chat-input">
          <el-input
            v-model="inputMessage"
            :placeholder="t('aiChat.placeholder')"
            @keyup.enter="sendMessage"
            :disabled="chatStore.isTyping"
          >
            <template #suffix>
              <el-icon
                class="send-icon"
                :class="{ active: inputMessage.trim() }"
                @click="sendMessage"
              >
                <Promotion />
              </el-icon>
            </template>
          </el-input>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAiChatStore } from '../store/aiChat'
import { useClassroomStore } from '../store/classroom'
import { useLearningEngineStore } from '../store/learningEngine'
import { ElMessage } from 'element-plus'
import AiChatFeedback from './AiChatFeedback.vue'

const { t, locale } = useI18n()
const chatStore = useAiChatStore()
const learningStore = useLearningEngineStore()

const inputMessage = ref('')
const messagesContainer = ref(null)
const hasUnread = ref(false)
const isMinimized = ref(false)

// 拖动功能相关状态
const windowPosition = ref({ x: 20, y: 20 })
const buttonPosition = ref({ x: 30, y: 30 }) // 聊天按钮位置
const isDragging = ref(false)
const isButtonDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })

// 拖动开始
const startDrag = (e) => {
  if (e.target.closest('.action-icon')) return // 不在图标按钮上触发拖动
  
  isDragging.value = true
  const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX
  const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY
  
  dragStart.value = {
    x: clientX - windowPosition.value.x,
    y: clientY - windowPosition.value.y
  }
  
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchmove', onDrag)
  document.addEventListener('touchend', stopDrag)
}

// 拖动中
const onDrag = (e) => {
  if (!isDragging.value) return
  
  e.preventDefault()
  const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX
  const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY
  
  // 计算新位置(右侧定位)
  const newX = Math.max(0, Math.min(window.innerWidth - 400, clientX - dragStart.value.x))
  const newY = Math.max(0, Math.min(window.innerHeight - 600, clientY - dragStart.value.y))
  
  windowPosition.value = {
    x: window.innerWidth - newX - 400, // 转换为right定位
    y: newY
  }
}

// 拖动结束
const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDrag)
  document.removeEventListener('touchend', stopDrag)
}

// 聊天按钮拖动开始
const startButtonDrag = (e) => {
  e.stopPropagation() // 阻止触发toggleChat
  isButtonDragging.value = true
  
  const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX
  const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY
  
  dragStart.value = {
    x: clientX - (window.innerWidth - buttonPosition.value.x - 90),
    y: clientY - (window.innerHeight - buttonPosition.value.y - 100)
  }
  
  document.addEventListener('mousemove', onButtonDrag)
  document.addEventListener('mouseup', stopButtonDrag)
  document.addEventListener('touchmove', onButtonDrag)
  document.addEventListener('touchend', stopButtonDrag)
}

// 聊天按钮拖动中
const onButtonDrag = (e) => {
  if (!isButtonDragging.value) return
  
  e.preventDefault()
  const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX
  const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY
  
  const newRight = window.innerWidth - clientX + dragStart.value.x
  const newBottom = window.innerHeight - clientY + dragStart.value.y
  
  buttonPosition.value = {
    x: Math.max(10, Math.min(window.innerWidth - 100, newRight)),
    y: Math.max(10, Math.min(window.innerHeight - 110, newBottom))
  }
}

// 聊天按钮拖动结束
const stopButtonDrag = (e) => {
  if (isButtonDragging.value) {
    e.stopPropagation()
    e.preventDefault()
  }
  
  isButtonDragging.value = false
  document.removeEventListener('mousemove', onButtonDrag)
  document.removeEventListener('mouseup', stopButtonDrag)
  document.removeEventListener('touchmove', onButtonDrag)
  document.removeEventListener('touchend', stopButtonDrag)
}

// 快捷键处理：Ctrl+K 隐藏/唤醒应答机器人
const handleKeyboardShortcut = (e) => {
  // Ctrl+K 或 Cmd+K（Mac）
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    toggleChat()
  }
}

// 组件挂载时加载反馈数据和绑定快捷键
onMounted(() => {
  learningStore.loadFeedbacks()
  // 绑定全局快捷键
  document.addEventListener('keydown', handleKeyboardShortcut)
})

// 组件卸载时移除监听器
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyboardShortcut)
})

const quickQuestions = computed(() => ({
  q1: t('aiChat.questions.q1'),
  q2: t('aiChat.questions.q2'),
  q3: t('aiChat.questions.q3'),
  q4: t('aiChat.questions.q4'),
  q5: t('aiChat.questions.q5'),
  q6: t('aiChat.questions.q6')
}))

const toggleChat = () => {
  chatStore.toggleChat()
  hasUnread.value = false
  isMinimized.value = false
  if (chatStore.chatVisible) {
    nextTick(() => {
      scrollToBottom()
    })
  }
}

const minimizeChat = () => {
  isMinimized.value = true
}

const restoreChat = () => {
  isMinimized.value = false
  nextTick(() => {
    scrollToBottom()
  })
}

const closeChat = () => {
  chatStore.toggleChat()
  isMinimized.value = false
}

const sendMessage = async () => {
  if (!inputMessage.value.trim() || chatStore.isTyping) return

  const message = inputMessage.value.trim()
  inputMessage.value = ''

  await chatStore.sendMessage(message, locale.value)
  
  nextTick(() => {
    scrollToBottom()
  })
}

const askQuestion = (question) => {
  inputMessage.value = question
  sendMessage()
}

const clearHistory = () => {
  chatStore.clearMessages()
}

const formatTime = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const openFunction = () => {
  const success = chatStore.navigateToFunction()
  if (success) {
    ElMessage.success('正在为您打开功能页面...')
  }
}

// 格式化消息内容（支持Markdown样式）
const formatMessage = (content) => {
  if (!content) return ''
  
  // 将换行符转换为<br>
  let formatted = content.replace(/\n/g, '<br>')
  
  // 将**粗体**转换为<strong>
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  
  // 将emoji表情保持原样
  return formatted
}

// 处理建议卡片点击
const handleSuggestion = (suggestion) => {
  if (suggestion.action === 'navigate' && suggestion.route) {
    chatStore.navigateToFunction(suggestion.route)
    ElMessage.success('正在为您打开功能页面...')
  } else if (suggestion.action === 'external_link' && suggestion.url) {
    // 增加外部链接浏览量
    if (suggestion.linkId) {
      const classroomStore = useClassroomStore()
      classroomStore.incrementLinkViews(suggestion.linkId)
    }
    window.open(suggestion.url, '_blank')
    ElMessage.success('正在打开外部学习资源...')
  }
}

watch(() => chatStore.messages.length, () => {
  nextTick(() => {
    scrollToBottom()
  })
})
</script>

<style scoped>
.ai-chat-container {
  position: fixed;
  z-index: 9999;
}

/* 遮罩层 */
.chat-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
  z-index: 9998;
}

/* 遮罩层淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* AI人形助手按钮 */
.chat-button.ai-assistant {
  width: 90px;
  height: 100px;
  background: transparent;
  border-radius: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: move;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: fixed;
  overflow: visible;
  filter: drop-shadow(0 8px 24px rgba(0, 200, 255, 0.3));
  user-select: none;
}

.chat-button.ai-assistant.dragging {
  cursor: grabbing;
  animation: none !important;
  filter: drop-shadow(0 12px 32px rgba(0, 200, 255, 0.6));
}

/* AI头像容器 */
.ai-avatar {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* AI头部 */
.ai-head {
  width: 50px;
  height: 55px;
  background: linear-gradient(135deg, #e8f4f8 0%, #cfe9f3 100%);
  border-radius: 50% 50% 45% 45% / 60% 60% 40% 40%;
  position: relative;
  z-index: 3;
  box-shadow: 
    inset 0 2px 8px rgba(255, 255, 255, 0.8),
    inset 0 -2px 8px rgba(0, 0, 0, 0.1),
    0 4px 16px rgba(0, 200, 255, 0.2);
}

/* 发型顶部 */
.ai-hair-top {
  position: absolute;
  width: 46px;
  height: 28px;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  border-radius: 50% 50% 40% 40% / 80% 80% 20% 20%;
  top: -2px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 
    inset 0 2px 4px rgba(255, 255, 255, 0.2),
    0 2px 8px rgba(0, 0, 0, 0.3);
}

/* 发型左侧 */
.ai-hair-left {
  position: absolute;
  width: 18px;
  height: 30px;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  border-radius: 50% 30% 30% 50% / 50% 40% 60% 50%;
  top: 8px;
  left: -2px;
  box-shadow: inset 1px 1px 3px rgba(255, 255, 255, 0.15);
}

/* 发型右侧 */
.ai-hair-right {
  position: absolute;
  width: 18px;
  height: 30px;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  border-radius: 30% 50% 50% 30% / 40% 50% 50% 60%;
  top: 8px;
  right: -2px;
  box-shadow: inset -1px 1px 3px rgba(255, 255, 255, 0.15);
}

/* 面部 */
.ai-face {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 脸部面板线条 */
.face-panel {
  position: absolute;
  width: 1px;
  height: 35px;
  background: linear-gradient(to bottom, 
    transparent 0%, 
    rgba(100, 150, 180, 0.3) 20%, 
    rgba(100, 150, 180, 0.4) 50%, 
    rgba(100, 150, 180, 0.3) 80%, 
    transparent 100%);
  top: 18px;
}

.panel-left {
  left: 12px;
  transform: rotate(-8deg);
}

.panel-right {
  right: 12px;
  transform: rotate(8deg);
}

/* 眼睛容器 */
.ai-eyes {
  position: absolute;
  top: 22px;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  display: flex;
  justify-content: space-between;
}

/* 单个眼睛 */
.ai-eye {
  width: 10px;
  height: 11px;
  background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%);
  border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  position: relative;
  box-shadow: 
    0 0 12px rgba(0, 212, 255, 0.8),
    inset 0 1px 3px rgba(255, 255, 255, 0.6);
  animation: eye-pulse 3s ease-in-out infinite;
}

.ai-eye.left {
  transform: rotate(-5deg);
}

.ai-eye.right {
  transform: rotate(5deg);
}

/* 眼睛发光效果 */
.eye-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  background: radial-gradient(circle, rgba(0, 255, 255, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  animation: glow-pulse 2s ease-in-out infinite;
}

@keyframes eye-pulse {
  0%, 100% {
    box-shadow: 
      0 0 12px rgba(0, 212, 255, 0.8),
      inset 0 1px 3px rgba(255, 255, 255, 0.6);
  }
  50% {
    box-shadow: 
      0 0 20px rgba(0, 212, 255, 1),
      0 0 30px rgba(0, 255, 255, 0.6),
      inset 0 1px 3px rgba(255, 255, 255, 0.8);
  }
}

@keyframes glow-pulse {
  0%, 100% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.3);
  }
}

/* 额头装饰点 */
.forehead-dot {
  position: absolute;
  width: 3px;
  height: 3px;
  background: #00d4ff;
  border-radius: 50%;
  top: 14px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 0 6px rgba(0, 212, 255, 0.8);
  animation: dot-blink 3s ease-in-out infinite;
}

@keyframes dot-blink {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* 颈部 */
.ai-neck {
  width: 26px;
  height: 18px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 40% 40% 30% 30% / 20% 20% 80% 80%;
  position: relative;
  z-index: 2;
  margin-top: -3px;
  box-shadow: 
    inset 0 2px 6px rgba(0, 0, 0, 0.4),
    0 2px 8px rgba(0, 200, 255, 0.3);
}

/* 颈部发光线条 */
.neck-glow {
  position: absolute;
  width: 2px;
  height: 12px;
  background: linear-gradient(to bottom, 
    rgba(0, 212, 255, 0) 0%,
    rgba(0, 212, 255, 0.8) 30%,
    rgba(0, 212, 255, 0.8) 70%,
    rgba(0, 212, 255, 0) 100%);
  left: 50%;
  top: 3px;
  transform: translateX(-50%);
  box-shadow: 0 0 8px rgba(0, 212, 255, 0.6);
  animation: neck-glow 2s ease-in-out infinite;
}

@keyframes neck-glow {
  0%, 100% {
    opacity: 0.6;
    height: 12px;
  }
  50% {
    opacity: 1;
    height: 14px;
  }
}

/* 肩部容器 */
.ai-shoulders {
  width: 70px;
  height: 20px;
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  margin-top: -2px;
}

/* 单个肩部 */
.shoulder {
  width: 28px;
  height: 20px;
  background: linear-gradient(135deg, #e8f4f8 0%, #cfe9f3 100%);
  position: relative;
  box-shadow: 
    inset 0 2px 6px rgba(255, 255, 255, 0.6),
    inset 0 -2px 6px rgba(0, 0, 0, 0.1),
    0 2px 12px rgba(0, 200, 255, 0.2);
}

.shoulder.left {
  border-radius: 50% 20% 20% 40% / 40% 30% 50% 60%;
}

.shoulder.right {
  border-radius: 20% 50% 40% 20% / 30% 40% 60% 50%;
}

/* 肩部发光圆圈 */
.shoulder-circle {
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid #00d4ff;
  border-radius: 50%;
  top: 50%;
  transform: translateY(-50%);
  box-shadow: 
    0 0 10px rgba(0, 212, 255, 0.6),
    inset 0 0 6px rgba(0, 212, 255, 0.4);
  animation: shoulder-rotate 4s linear infinite;
}

.shoulder.left .shoulder-circle {
  left: 6px;
}

.shoulder.right .shoulder-circle {
  right: 6px;
}

@keyframes shoulder-rotate {
  0% {
    transform: translateY(-50%) rotate(0deg);
    box-shadow: 
      0 0 10px rgba(0, 212, 255, 0.6),
      inset 0 0 6px rgba(0, 212, 255, 0.4);
  }
  50% {
    box-shadow: 
      0 0 16px rgba(0, 212, 255, 0.9),
      inset 0 0 10px rgba(0, 212, 255, 0.6);
  }
  100% {
    transform: translateY(-50%) rotate(360deg);
    box-shadow: 
      0 0 10px rgba(0, 212, 255, 0.6),
      inset 0 0 6px rgba(0, 212, 255, 0.4);
  }
}

/* 整体悬浮动画 */
.chat-button.ai-assistant {
  animation: ai-float 4s ease-in-out infinite;
}

@keyframes ai-float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* 悬停效果 */
.chat-button.ai-assistant:hover {
  transform: translateY(-12px) scale(1.1) !important;
  filter: drop-shadow(0 12px 32px rgba(0, 200, 255, 0.5));
  animation-play-state: paused;
}

.chat-button.ai-assistant:hover .ai-eye {
  animation: eye-wink 0.6s;
}

@keyframes eye-wink {
  0%, 100% { 
    height: 11px;
    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
  }
  50% { 
    height: 2px;
    border-radius: 50%;
  }
}

.chat-button.ai-assistant:hover .ai-head {
  animation: head-tilt 0.8s;
}

@keyframes head-tilt {
  0%, 100% { transform: rotate(0deg); }
  30% { transform: rotate(-3deg); }
  70% { transform: rotate(3deg); }
}

.chat-button.ai-assistant:hover .neck-glow {
  animation: neck-glow-active 0.5s ease-in-out infinite;
}

@keyframes neck-glow-active {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 12px rgba(0, 212, 255, 1);
  }
  50% {
    opacity: 0.8;
    box-shadow: 0 0 20px rgba(0, 255, 255, 1);
  }
}

/* 点击效果 */
.chat-button.ai-assistant:active {
  transform: translateY(-6px) scale(1.05) !important;
}

/* 背景光晕 */
.chat-button.ai-assistant::before {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 10px;
  background: radial-gradient(ellipse, rgba(0, 212, 255, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  animation: shadow-pulse 4s ease-in-out infinite;
  z-index: 0;
}

@keyframes shadow-pulse {
  0%, 100% {
    width: 60px;
    opacity: 0.4;
  }
  50% {
    width: 70px;
    opacity: 0.6;
  }
}

/* 外围光环 */
.chat-button.ai-assistant::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  border: 2px solid rgba(0, 212, 255, 0.2);
  border-radius: 50%;
  animation: ring-expand 3s ease-out infinite;
  pointer-events: none;
}

@keyframes ring-expand {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}

.chat-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 22px;
  height: 22px;
  background: linear-gradient(135deg, #ff5252 0%, #f44336 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  border: 3px solid #fff;
  z-index: 10;
  box-shadow: 0 2px 8px rgba(244, 67, 54, 0.5);
  animation: badge-bounce 2s infinite;
}

@keyframes badge-bounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}

.chat-window {
  width: 420px;
  height: 650px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(102, 126, 234, 0.25), 0 8px 24px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: fixed;
  z-index: 10000;
  border: 1px solid rgba(102, 126, 234, 0.1);
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 24px 72px rgba(102, 126, 234, 0.3), 0 12px 36px rgba(0, 0, 0, 0.15);
  }
}

.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 24px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: hidden;
  
  &.draggable-header {
    cursor: move;
    user-select: none;
  }
}

/* 头部装饰背景 */
.chat-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.chat-header::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -5%;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%);
  border-radius: 50%;
}

.header-left {
  display: flex;
  gap: 12px;
  align-items: center;
}

.header-info h3 {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 4px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-info p {
  font-size: 13px;
  opacity: 0.95;
  font-weight: 400;
}

.header-actions {
  display: flex;
  gap: 16px;
}

.action-icon {
  cursor: pointer;
  opacity: 0.9;
  transition: all 0.3s;
}

.action-icon:hover {
  opacity: 1;
  transform: scale(1.15);
}

.action-icon.close-btn {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  padding: 4px;
  opacity: 1;
}

.action-icon.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.2);
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: linear-gradient(to bottom, #fafbff 0%, #f5f7ff 100%);
  position: relative;
}

/* 消息区域装饰 */
.chat-messages::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 0%, transparent 100%);
  pointer-events: none;
  z-index: 1;
}

.message {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  animation: slideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  z-index: 2;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.ai-message {
  justify-content: flex-start;
}

.user-message {
  justify-content: flex-end;
}

.message-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
}

/* AI头像闪光效果 */
.ai-message .message-avatar::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%);
  animation: shine 3s infinite;
}

@keyframes shine {
  0%, 100% {
    transform: translateX(-100%) translateY(-100%) rotate(45deg);
  }
  50% {
    transform: translateX(100%) translateY(100%) rotate(45deg);
  }
}

.user-message .message-avatar {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 4px 12px rgba(240, 147, 251, 0.3);
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-width: 70%;
}

.user-message .message-content {
  align-items: flex-end;
}

.message-bubble {
  background: #fff;
  padding: 14px 18px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.7;
  word-wrap: break-word;
  white-space: pre-wrap;
  box-shadow: 0 2px 12px rgba(102, 126, 234, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04);
  position: relative;
  transition: all 0.3s ease;
}

/* AI消息气泡装饰 */
.ai-message .message-bubble::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 12px;
  width: 12px;
  height: 12px;
  background: #fff;
  transform: rotate(45deg);
  box-shadow: -2px 2px 4px rgba(102, 126, 234, 0.05);
}

.message-bubble:hover {
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

.user-message .message-bubble {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.25), 0 2px 8px rgba(102, 126, 234, 0.15);
}

/* 用户消息气泡装饰 */
.user-message .message-bubble::before {
  content: '';
  position: absolute;
  right: -6px;
  top: 12px;
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: rotate(45deg);
  box-shadow: 2px 2px 4px rgba(102, 126, 234, 0.15);
}

.user-message .message-bubble:hover {
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.35), 0 3px 10px rgba(102, 126, 234, 0.2);
}

.message-time {
  font-size: 11px;
  color: #999;
  padding: 0 8px;
}

.suggestions-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  padding: 0 8px;
}

.suggestion-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: linear-gradient(135deg, #f0f3ff 0%, #e8ecff 100%);
  border: 1px solid rgba(102, 126, 234, 0.2);
  border-radius: 20px;
  font-size: 13px;
  color: #667eea;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  user-select: none;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

/* 建议卡片波纹效果 */
.suggestion-card::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.suggestion-card:hover::after {
  width: 300px;
  height: 300px;
}

.suggestion-card:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  transform: translateY(-3px) scale(1.08);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  border-color: transparent;
}

.suggestion-card:active {
  transform: translateY(-1px) scale(1.03);
}

.suggestion-card :deep(.el-icon) {
  z-index: 1;
  position: relative;
}

.suggestion-card span {
  z-index: 1;
  position: relative;
}

.typing-text {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.typing-text :deep(strong) {
  font-weight: 600;
  color: #667eea;
  text-shadow: 0 1px 2px rgba(102, 126, 234, 0.1);
}

.quick-action {
  margin-top: 8px;
  padding: 0 8px;
}

.quick-action .el-button {
  border-radius: 16px;
  padding: 6px 16px;
  font-size: 13px;
  background: linear-gradient(135deg, #1890ff 0%, #0066cc 100%);
  border: none;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
  transition: all 0.3s;
}

.quick-action .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.5);
}

.typing-indicator {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 18px;
}

.typing-indicator span {
  width: 10px;
  height: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
  box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
}

.typing-indicator span:nth-child(1) {
  animation-delay: 0s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 60%, 100% {
    transform: translateY(0) scale(1);
  }
  30% {
    transform: translateY(-12px) scale(1.1);
  }
}

.quick-questions {
  padding: 20px;
  background: #fff;
  border-top: 1px solid rgba(102, 126, 234, 0.1);
}

.quick-title {
  font-size: 13px;
  color: #666;
  margin-bottom: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.question-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.question-chip {
  background: linear-gradient(135deg, #f0f3ff 0%, #e8ecff 100%);
  color: #667eea;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid rgba(102, 126, 234, 0.2);
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

/* 快捷问题悬浮光效 */
.question-chip::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(102, 126, 234, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.5s, height 0.5s;
}

.question-chip:hover::before {
  width: 200px;
  height: 200px;
}

.question-chip:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.35);
  border-color: transparent;
}

.question-chip:active {
  transform: translateY(-1px) scale(1.02);
}

.chat-input {
  padding: 20px;
  background: #fff;
  border-top: 1px solid rgba(102, 126, 234, 0.1);
  position: relative;
}

/* 输入框聚焦光晕 */
.chat-input::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #667eea, #764ba2, transparent);
  transition: width 0.4s ease;
}

.chat-input:focus-within::before {
  width: 100%;
}

.chat-input :deep(.el-input__wrapper) {
  border-radius: 24px;
  box-shadow: 0 2px 12px rgba(102, 126, 234, 0.1);
  transition: all 0.3s ease;
  border: 1px solid rgba(102, 126, 234, 0.15);
}

.chat-input :deep(.el-input__wrapper:hover) {
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15);
  border-color: rgba(102, 126, 234, 0.3);
}

.chat-input :deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.25);
  border-color: #667eea;
}

.send-icon {
  cursor: pointer;
  color: #ccc;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-size: 22px;
}

.send-icon.active {
  color: #667eea;
  animation: pulse-send 2s infinite;
}

@keyframes pulse-send {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.send-icon:hover {
  transform: scale(1.2) rotate(10deg);
  color: #764ba2;
}

/* 滑入动画 */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 滚动条样式 */
.chat-messages::-webkit-scrollbar {
  width: 8px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  transition: all 0.3s ease;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  box-shadow: 0 0 6px rgba(102, 126, 234, 0.5);
}

/* 最小化窗口样式 */
.chat-mini {
  width: 320px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  color: #fff;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.35), 0 4px 8px rgba(102, 126, 234, 0.2);
  position: relative;
  z-index: 10000;
  overflow: hidden;
}

/* 最小化窗口装饰 */
.chat-mini::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
  border-radius: 50%;
}

.mini-header {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  flex: 1;
  transition: all 0.3s ease;
}

.mini-header:hover {
  transform: translateX(5px);
}

.mini-header span {
  font-size: 15px;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.mini-close {
  cursor: pointer;
  opacity: 0.9;
  transition: all 0.3s ease;
  z-index: 1;
}

.mini-close:hover {
  opacity: 1;
  transform: scale(1.2) rotate(90deg);
}

/* ===================================================
   移动端响应式适配 - 修复手机端无法对话问题
   ================================================= */

/* 大屏手机 (最大 768px) */
@media screen and (max-width: 768px) {
  .chat-window {
    width: 100vw !important;
    height: 100vh !important;
    height: 100dvh !important; /* 动态视口高度，适配手机浏览器地址栏 */
    max-width: none;
    max-height: none;
    border-radius: 0 !important;
    top: 0 !important;
    right: 0 !important;
    left: 0 !important;
    bottom: 0 !important;
  }

  .chat-header {
    padding: 16px 15px;
    min-height: 60px;
  }

  .header-left .header-info h3 {
    font-size: 16px;
  }

  .header-left .header-info p {
    font-size: 12px;
  }

  .header-actions {
    gap: 12px;
  }

  .chat-messages {
    flex: 1;
    padding: 12px 15px;
    padding-bottom: env(safe-area-inset-bottom); /* iOS安全区域 */
  }

  .message {
    margin-bottom: 16px;
  }

  .message-avatar {
    width: 32px;
    height: 32px;
  }

  .message-avatar .el-icon {
    font-size: 18px !important;
  }

  .message-bubble {
    padding: 12px 14px;
    font-size: 14px;
    max-width: calc(100vw - 100px);
  }

  /* 输入区域 - 关键修复 */
  .chat-input {
    padding: 12px 15px;
    padding-bottom: calc(12px + env(safe-area-inset-bottom)); /* iOS底部安全区域 */
    background: #fff;
    border-top: 1px solid #e0e0e0;
    position: sticky;
    bottom: 0;
    z-index: 100;
  }

  .chat-input :deep(.el-input__wrapper) {
    font-size: 15px; /* 防止iOS自动缩放 */
    min-height: 44px; /* 触摸友好尺寸 */
  }

  .chat-input :deep(.el-input__inner) {
    font-size: 15px !important; /* 防止iOS自动缩放 */
    -webkit-appearance: none; /* 移除iOS默认样式 */
  }

  .send-icon {
    font-size: 24px;
    padding: 8px;
    min-width: 44px; /* 触摸友好 */
    min-height: 44px;
  }

  /* 快捷问题区域 */
  .quick-questions {
    padding: 12px 15px;
    padding-bottom: 8px;
  }

  .quick-title {
    font-size: 13px;
    margin-bottom: 10px;
  }

  .question-chips {
    gap: 8px;
  }

  .question-chip {
    font-size: 13px;
    padding: 8px 14px;
    min-height: 36px; /* 触摸友好 */
  }

  /* 建议卡片 */
  .suggestion-card {
    padding: 10px 14px;
    font-size: 13px;
    min-height: 44px; /* 触摸友好 */
  }

  /* 聊天按钮位置调整 */
  .chat-button.ai-assistant {
    bottom: 20px !important;
    right: 20px !important;
    width: 60px;
    height: 60px;
  }

  /* 最小化窗口 */
  .chat-mini {
    width: calc(100vw - 40px);
    max-width: 280px;
    height: 52px;
    padding: 0 18px;
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
  }

  .mini-header span {
    font-size: 14px;
  }

  /* 遮罩层 */
  .chat-overlay {
    background: rgba(0, 0, 0, 0.5);
  }
}

/* 小屏手机 (最大 480px) */
@media screen and (max-width: 480px) {
  .chat-header {
    padding: 14px 12px;
  }

  .header-left .header-info h3 {
    font-size: 15px;
  }

  .header-left .header-info p {
    font-size: 11px;
  }

  .header-actions {
    gap: 10px;
  }

  .header-actions .action-icon {
    font-size: 18px !important;
  }

  .chat-messages {
    padding: 10px 12px;
  }

  .message-bubble {
    padding: 10px 12px;
    font-size: 13px;
    max-width: calc(100vw - 80px);
  }

  .chat-input {
    padding: 10px 12px;
    padding-bottom: calc(10px + env(safe-area-inset-bottom));
  }

  .quick-questions {
    padding: 10px 12px;
  }

  .question-chip {
    font-size: 12px;
    padding: 6px 12px;
  }

  /* 聊天按钮 */
  .chat-button.ai-assistant {
    width: 56px;
    height: 56px;
    bottom: 16px !important;
    right: 16px !important;
  }

  .ai-avatar {
    transform: scale(0.9);
  }
}

/* 横屏模式优化 */
@media screen and (max-width: 768px) and (orientation: landscape) {
  .chat-window {
    height: 100vh !important;
  }

  .chat-header {
    padding: 10px 15px;
    min-height: 50px;
  }

  .header-left .header-info h3 {
    font-size: 14px;
  }

  .header-left .header-info p {
    display: none; /* 横屏隐藏副标题 */
  }

  .chat-messages {
    padding: 8px 15px;
  }

  .message {
    margin-bottom: 12px;
  }

  .message-avatar {
    width: 28px;
    height: 28px;
  }

  .quick-questions {
    padding: 8px 15px;
  }
}

/* iOS Safari 特殊处理 */
@supports (-webkit-touch-callout: none) {
  @media screen and (max-width: 768px) {
    .chat-window {
      /* 使用 100vh 而不是 100dvh，避免地址栏导致的布局问题 */
      height: 100vh !important;
      /* 添加额外的底部内边距，确保输入框不被虚拟键盘遮挡 */
      padding-bottom: env(safe-area-inset-bottom, 0);
    }

    .chat-input {
      /* 确保输入框在虚拟键盘弹出时可见 */
      position: sticky;
      bottom: 0;
      background: #fff;
      z-index: 1000;
    }

    .chat-input :deep(.el-input__inner) {
      /* 防止iOS缩放页面 */
      font-size: 16px !important;
    }
  }
}

/* 触摸优化 - 增加可点击区域 */
@media (hover: none) and (pointer: coarse) {
  /* 触摸设备检测 */
  .action-icon,
  .send-icon,
  .mini-close {
    min-width: 44px;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .question-chip,
  .suggestion-card {
    min-height: 44px;
    display: flex;
    align-items: center;
  }

  /* 禁用触摸设备的悬停效果 */
  .message-bubble:hover,
  .suggestion-card:hover,
  .question-chip:hover {
    transform: none;
  }

  /* 添加触摸反馈 */
  .question-chip:active,
  .suggestion-card:active,
  .send-icon:active,
  .action-icon:active {
    opacity: 0.7;
    transform: scale(0.95);
  }
}

/* 键盘弹出时的处理 */
@media screen and (max-width: 768px) {
  /* 当虚拟键盘弹出时，确保输入框可见 */
  .chat-window.keyboard-open {
    height: calc(100vh - var(--keyboard-height, 0px)) !important;
  }

  /* 确保消息列表可以滚动到底部 */
  .chat-messages {
    overflow-y: auto;
    -webkit-overflow-scrolling: touch; /* iOS平滑滚动 */
    overscroll-behavior: contain; /* 防止过度滚动 */
  }
}

/* 平板设备 (768px - 1024px) */
@media screen and (min-width: 769px) and (max-width: 1024px) {
  .chat-window {
    width: 480px;
    height: 700px;
  }

  .chat-button.ai-assistant {
    width: 70px;
    height: 70px;
  }
}
</style>
