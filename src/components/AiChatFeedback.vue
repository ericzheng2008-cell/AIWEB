<template>
  <div class="ai-feedback" v-if="!submitted">
    <span class="feedback-label">这个回答有帮助吗？</span>
    <div class="feedback-buttons">
      <el-button
        size="small"
        :type="feedbackType === 'positive' ? 'success' : ''"
        @click="submitFeedback('positive')"
      >
        <el-icon><CircleCheck /></el-icon>
        有帮助
      </el-button>
      <el-button
        size="small"
        :type="feedbackType === 'negative' ? 'danger' : ''"
        @click="submitFeedback('negative')"
      >
        <el-icon><CircleClose /></el-icon>
        没帮助
      </el-button>
    </div>
  </div>
  <div class="ai-feedback-thanks" v-else>
    <el-icon color="#67c23a"><SuccessFilled /></el-icon>
    <span>感谢您的反馈！</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { CircleCheck, CircleClose, SuccessFilled } from '@element-plus/icons-vue'
import { useLearningEngineStore } from '@/store/learningEngine'

const props = defineProps({
  messageId: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  }
})

const learningStore = useLearningEngineStore()
const submitted = ref(false)
const feedbackType = ref('')

const submitFeedback = async (type) => {
  feedbackType.value = type
  
  await learningStore.submitFeedback({
    messageId: props.messageId,
    question: props.question,
    answer: props.answer,
    feedbackType: type,
    timestamp: new Date().toISOString()
  })
  
  submitted.value = true
}
</script>

<style scoped>
.ai-feedback {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 8px;
  font-size: 13px;
}

.feedback-label {
  font-size: 13px;
  color: #606266;
  flex-shrink: 0;
}

.feedback-buttons {
  display: flex;
  gap: 8px;
}

.ai-feedback-thanks {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  padding: 8px 12px;
  background: #f0f9ff;
  border-radius: 8px;
  color: #67c23a;
  font-size: 13px;
}

/* 响应式设计 */
@media screen and (max-width: 767px) {
  .ai-feedback {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .feedback-buttons {
    width: 100%;
  }

  .feedback-buttons .el-button {
    flex: 1;
  }
}
</style>
