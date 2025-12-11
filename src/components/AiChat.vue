<template>
  <div class="ai-chat-container">
    <!-- 聊天按钮 -->
    <div class="chat-button" @click="toggleChat" v-if="!chatStore.chatVisible">
      <el-icon :size="28"><ChatDotRound /></el-icon>
      <div class="chat-badge" v-if="hasUnread">1</div>
    </div>

    <!-- 最小化聊天窗口 -->
    <transition name="slide-up">
      <div class="chat-mini" v-if="isMinimized">
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
      <div class="chat-window" v-if="chatStore.chatVisible && !isMinimized">
        <!-- 头部 -->
        <div class="chat-header">
          <div class="header-left">
            <el-icon :size="24" color="#fff"><Service /></el-icon>
            <div class="header-info">
              <h3>{{ t('aiChat.title') }}</h3>
              <p>{{ t('aiChat.subtitle') }}</p>
            </div>
          </div>
          <div class="header-actions">
            <el-icon :size="20" @click="clearHistory" class="action-icon" title="清空对话">
              <Delete />
            </el-icon>
            <el-icon :size="20" @click="minimizeChat" class="action-icon" title="最小化">
              <Minus />
            </el-icon>
            <el-icon :size="20" @click="closeChat" class="action-icon" title="关闭">
              <Close />
            </el-icon>
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
              <div class="message-bubble">{{ msg.content }}</div>
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
import { ref, computed, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAiChatStore } from '../store/aiChat'

const { t, locale } = useI18n()
const chatStore = useAiChatStore()

const inputMessage = ref('')
const messagesContainer = ref(null)
const hasUnread = ref(false)
const isMinimized = ref(false)

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

watch(() => chatStore.messages.length, () => {
  nextTick(() => {
    scrollToBottom()
  })
})
</script>

<style scoped>
.ai-chat-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9999;
}

.chat-button {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #1890ff 0%, #0066cc 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.4);
  transition: all 0.3s ease;
  position: relative;
}

.chat-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 24px rgba(24, 144, 255, 0.6);
}

.chat-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  width: 24px;
  height: 24px;
  background: #f56c6c;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  border: 2px solid #fff;
}

.chat-window {
  width: 400px;
  height: 600px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  background: linear-gradient(135deg, #1890ff 0%, #0066cc 100%);
  color: #fff;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  gap: 12px;
  align-items: center;
}

.header-info h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.header-info p {
  font-size: 12px;
  opacity: 0.9;
}

.header-actions {
  display: flex;
  gap: 16px;
}

.action-icon {
  cursor: pointer;
  opacity: 0.9;
  transition: opacity 0.3s;
}

.action-icon:hover {
  opacity: 1;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #f5f7fa;
}

.message {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.ai-message {
  justify-content: flex-start;
}

.user-message {
  justify-content: flex-end;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.user-message .message-avatar {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  word-wrap: break-word;
  white-space: pre-wrap;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.user-message .message-bubble {
  background: linear-gradient(135deg, #1890ff 0%, #0066cc 100%);
  color: #fff;
}

.message-time {
  font-size: 11px;
  color: #999;
  padding: 0 8px;
}

.typing-indicator {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 16px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #1890ff;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-10px);
  }
}

.quick-questions {
  padding: 16px 20px;
  background: #fff;
  border-top: 1px solid #e8e8e8;
}

.quick-title {
  font-size: 12px;
  color: #999;
  margin-bottom: 12px;
}

.question-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.question-chip {
  background: #f0f7ff;
  color: #1890ff;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #d6e4ff;
}

.question-chip:hover {
  background: #1890ff;
  color: #fff;
  transform: translateY(-2px);
}

.chat-input {
  padding: 16px 20px;
  background: #fff;
  border-top: 1px solid #e8e8e8;
}

.send-icon {
  cursor: pointer;
  color: #999;
  transition: all 0.3s;
  font-size: 20px;
}

.send-icon.active {
  color: #1890ff;
}

.send-icon:hover {
  transform: scale(1.1);
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
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: transparent;
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 3px;
}

.chat-messages::-webkit-scrollbar-thumb:hover {
  background: #bfbfbf;
}

/* 最小化窗口样式 */
.chat-mini {
  width: 300px;
  height: 50px;
  background: linear-gradient(135deg, #1890ff 0%, #0066cc 100%);
  border-radius: 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  color: #fff;
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.4);
}

.mini-header {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  flex: 1;
}

.mini-header span {
  font-size: 14px;
  font-weight: 500;
}

.mini-close {
  cursor: pointer;
  opacity: 0.9;
  transition: opacity 0.3s;
}

.mini-close:hover {
  opacity: 1;
}
</style>
