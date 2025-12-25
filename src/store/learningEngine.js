import { defineStore } from 'pinia'

export const useLearningEngineStore = defineStore('learningEngine', {
  state: () => ({
    feedbacks: [],
    difficultQuestions: [],
    trainingData: [],
    stats: {
      totalFeedbacks: 0,
      positiveCount: 0,
      negativeCount: 0,
      satisfaction: 0
    }
  }),

  getters: {
    // 满意度百分比
    satisfactionRate(state) {
      if (state.stats.totalFeedbacks === 0) return 0
      return Math.round((state.stats.positiveCount / state.stats.totalFeedbacks) * 100)
    },

    // 难题列表（负面反馈 >= 3次）
    frequentProblems(state) {
      const questionMap = {}
      
      state.feedbacks.filter(f => f.feedbackType === 'negative').forEach(feedback => {
        const question = feedback.question
        if (!questionMap[question]) {
          questionMap[question] = {
            question,
            count: 0,
            answers: []
          }
        }
        questionMap[question].count++
        questionMap[question].answers.push(feedback.answer)
      })
      
      return Object.values(questionMap)
        .filter(item => item.count >= 3)
        .sort((a, b) => b.count - a.count)
    },

    // 最近的反馈
    recentFeedbacks(state) {
      return state.feedbacks.slice(-50).reverse()
    }
  },

  actions: {
    // 提交反馈
    async submitFeedback(feedback) {
      this.feedbacks.push(feedback)
      this.stats.totalFeedbacks++
      
      if (feedback.feedbackType === 'positive') {
        this.stats.positiveCount++
      } else {
        this.stats.negativeCount++
      }
      
      // 保存到localStorage
      this.saveFeedbacks()
      
      // 发送到后端API（如果已配置）
      try {
        await this.sendToBackend(feedback)
      } catch (error) {
        console.log('Backend not configured, saving locally only')
      }
      
      // 检查是否需要更新知识库
      if (this.stats.totalFeedbacks % 10 === 0) {
        this.updateKnowledgeBase()
      }
    },

    // 保存反馈到本地存储
    saveFeedbacks() {
      try {
        localStorage.setItem('ai-chat-feedbacks', JSON.stringify({
          feedbacks: this.feedbacks,
          stats: this.stats
        }))
      } catch (error) {
        console.error('Failed to save feedbacks:', error)
      }
    },

    // 加载本地反馈数据
    loadFeedbacks() {
      try {
        const data = localStorage.getItem('ai-chat-feedbacks')
        if (data) {
          const parsed = JSON.parse(data)
          this.feedbacks = parsed.feedbacks || []
          this.stats = parsed.stats || this.stats
        }
      } catch (error) {
        console.error('Failed to load feedbacks:', error)
      }
    },

    // 发送到后端API
    async sendToBackend(feedback) {
      // TODO: 实现后端API调用
      const response = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedback)
      })
      
      if (!response.ok) {
        throw new Error('Backend API error')
      }
      
      return await response.json()
    },

    // 更新知识库
    async updateKnowledgeBase() {
      console.log('🎓 Triggering knowledge base update...')
      
      // 分析负面反馈
      const problems = this.frequentProblems
      
      if (problems.length > 0) {
        console.log('📋 Found difficult questions:', problems)
        
        // TODO: 调用AI重新生成回答
        // TODO: 更新知识库
      }
    },

    // 导出反馈报告
    exportFeedbackReport() {
      const report = {
        generatedAt: new Date().toISOString(),
        stats: this.stats,
        satisfactionRate: this.satisfactionRate + '%',
        difficultQuestions: this.frequentProblems,
        recentFeedbacks: this.recentFeedbacks
      }
      
      const blob = new Blob([JSON.stringify(report, null, 2)], { 
        type: 'application/json' 
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `AI聊天反馈报告_${new Date().getTime()}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    },

    // 清空反馈数据
    clearFeedbacks() {
      this.feedbacks = []
      this.stats = {
        totalFeedbacks: 0,
        positiveCount: 0,
        negativeCount: 0,
        satisfaction: 0
      }
      this.saveFeedbacks()
    }
  }
})

// 默认导出
export default useLearningEngineStore
