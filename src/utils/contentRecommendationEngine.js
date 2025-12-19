/**
 * AI内容推荐引擎
 * 基于用户行为和偏好推荐个性化内容
 */

export class ContentRecommendationEngine {
  constructor() {
    this.userProfiles = new Map()
    this.contentItems = []
    this.interactionMatrix = new Map()
  }

  /**
   * 构建用户画像
   */
  buildUserProfile(userId, interactions) {
    const profile = {
      userId,
      interests: this.extractInterests(interactions),
      preferences: this.extractPreferences(interactions),
      behavior: this.analyzeBehavior(interactions),
      segment: this.identifySegment(interactions),
      contentAffinity: this.calculateContentAffinity(interactions)
    }

    this.userProfiles.set(userId, profile)
    return profile
  }

  /**
   * 提取用户兴趣
   */
  extractInterests(interactions) {
    const interests = {}

    interactions.forEach(interaction => {
      const tags = interaction.tags || []
      tags.forEach(tag => {
        interests[tag] = (interests[tag] || 0) + this.getInteractionWeight(interaction.type)
      })
    })

    // 按权重排序，返回Top 10
    return Object.entries(interests)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag, weight]) => ({ tag, weight }))
  }

  /**
   * 获取交互权重
   */
  getInteractionWeight(type) {
    const weights = {
      view: 1,
      click: 2,
      download: 5,
      share: 4,
      comment: 3,
      purchase: 10,
      quote_request: 8
    }
    return weights[type] || 1
  }

  /**
   * 提取用户偏好
   */
  extractPreferences(interactions) {
    const preferences = {
      contentTypes: {},
      languages: {},
      topics: {},
      formats: {}
    }

    interactions.forEach(interaction => {
      const { contentType, language, topic, format } = interaction

      if (contentType) {
        preferences.contentTypes[contentType] = (preferences.contentTypes[contentType] || 0) + 1
      }
      if (language) {
        preferences.languages[language] = (preferences.languages[language] || 0) + 1
      }
      if (topic) {
        preferences.topics[topic] = (preferences.topics[topic] || 0) + 1
      }
      if (format) {
        preferences.formats[format] = (preferences.formats[format] || 0) + 1
      }
    })

    return {
      preferredContentType: this.getTopPreference(preferences.contentTypes),
      preferredLanguage: this.getTopPreference(preferences.languages),
      preferredTopic: this.getTopPreference(preferences.topics),
      preferredFormat: this.getTopPreference(preferences.formats)
    }
  }

  /**
   * 获取首选项
   */
  getTopPreference(prefs) {
    const entries = Object.entries(prefs)
    if (entries.length === 0) return null
    return entries.sort(([, a], [, b]) => b - a)[0][0]
  }

  /**
   * 分析用户行为模式
   */
  analyzeBehavior(interactions) {
    const sortedInteractions = [...interactions].sort((a, b) => 
      new Date(a.timestamp) - new Date(b.timestamp)
    )

    return {
      totalInteractions: interactions.length,
      avgSessionDuration: this.calculateAvgSessionDuration(sortedInteractions),
      engagementLevel: this.calculateEngagementLevel(interactions),
      visitFrequency: this.calculateVisitFrequency(sortedInteractions),
      conversionProbability: this.predictConversionProbability(interactions)
    }
  }

  /**
   * 计算平均会话时长
   */
  calculateAvgSessionDuration(interactions) {
    if (interactions.length < 2) return 0

    let totalDuration = 0
    let sessionCount = 0
    let sessionStart = null

    interactions.forEach((interaction, index) => {
      if (!sessionStart) {
        sessionStart = new Date(interaction.timestamp)
      } else {
        const timeDiff = new Date(interaction.timestamp) - new Date(interactions[index - 1].timestamp)
        
        // 如果超过30分钟，认为是新会话
        if (timeDiff > 30 * 60 * 1000) {
          totalDuration += new Date(interactions[index - 1].timestamp) - sessionStart
          sessionCount++
          sessionStart = new Date(interaction.timestamp)
        }
      }
    })

    // 最后一个会话
    if (sessionStart) {
      totalDuration += new Date(interactions[interactions.length - 1].timestamp) - sessionStart
      sessionCount++
    }

    return sessionCount > 0 ? totalDuration / sessionCount / 1000 / 60 : 0 // 返回分钟数
  }

  /**
   * 计算参与度
   */
  calculateEngagementLevel(interactions) {
    const totalWeight = interactions.reduce((sum, interaction) => 
      sum + this.getInteractionWeight(interaction.type), 0
    )

    if (totalWeight >= 50) return 'high'
    if (totalWeight >= 20) return 'medium'
    return 'low'
  }

  /**
   * 计算访问频率
   */
  calculateVisitFrequency(interactions) {
    if (interactions.length === 0) return 0

    const firstVisit = new Date(interactions[0].timestamp)
    const lastVisit = new Date(interactions[interactions.length - 1].timestamp)
    const daysDiff = (lastVisit - firstVisit) / (1000 * 60 * 60 * 24)

    return daysDiff > 0 ? interactions.length / daysDiff : 0
  }

  /**
   * 预测转化概率
   */
  predictConversionProbability(interactions) {
    let score = 0

    // 基于关键行为评分
    interactions.forEach(interaction => {
      if (interaction.type === 'quote_request') score += 30
      if (interaction.type === 'download') score += 10
      if (interaction.type === 'product_view') score += 5
      if (interaction.type === 'pricing_page_view') score += 15
      if (interaction.type === 'email_click') score += 8
    })

    return Math.min(score, 100)
  }

  /**
   * 识别用户细分
   */
  identifySegment(interactions) {
    const behavior = this.analyzeBehavior(interactions)
    const conversionProb = behavior.conversionProbability

    if (conversionProb >= 70) return 'hot_lead'
    if (conversionProb >= 40) return 'warm_lead'
    if (conversionProb >= 20) return 'cold_lead'
    if (interactions.length > 10) return 'engaged_visitor'
    return 'new_visitor'
  }

  /**
   * 计算内容亲和度
   */
  calculateContentAffinity(interactions) {
    const affinity = {}

    interactions.forEach(interaction => {
      const contentId = interaction.contentId
      if (!contentId) return

      if (!affinity[contentId]) {
        affinity[contentId] = {
          views: 0,
          clicks: 0,
          downloads: 0,
          totalScore: 0
        }
      }

      affinity[contentId][interaction.type + 's'] = 
        (affinity[contentId][interaction.type + 's'] || 0) + 1
      affinity[contentId].totalScore += this.getInteractionWeight(interaction.type)
    })

    return affinity
  }

  /**
   * 协同过滤推荐
   */
  collaborativeFiltering(userId, limit = 5) {
    const userProfile = this.userProfiles.get(userId)
    if (!userProfile) return []

    // 找到相似用户
    const similarUsers = this.findSimilarUsers(userId, 10)

    // 汇总相似用户喜欢的内容
    const contentScores = new Map()

    similarUsers.forEach(({ userId: similarUserId, similarity }) => {
      const similarProfile = this.userProfiles.get(similarUserId)
      if (!similarProfile) return

      Object.entries(similarProfile.contentAffinity).forEach(([contentId, affinity]) => {
        const currentScore = contentScores.get(contentId) || 0
        contentScores.set(contentId, currentScore + affinity.totalScore * similarity)
      })
    })

    // 排除用户已经交互过的内容
    const userContentIds = new Set(Object.keys(userProfile.contentAffinity))
    const recommendations = Array.from(contentScores.entries())
      .filter(([contentId]) => !userContentIds.has(contentId))
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .slice(0, limit)
      .map(([contentId, score]) => ({
        contentId,
        score,
        reason: 'similar_users'
      }))

    return recommendations
  }

  /**
   * 找到相似用户
   */
  findSimilarUsers(userId, limit = 10) {
    const userProfile = this.userProfiles.get(userId)
    if (!userProfile) return []

    const similarities = []

    this.userProfiles.forEach((profile, otherUserId) => {
      if (otherUserId === userId) return

      const similarity = this.calculateUserSimilarity(userProfile, profile)
      similarities.push({ userId: otherUserId, similarity })
    })

    return similarities
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
  }

  /**
   * 计算用户相似度
   */
  calculateUserSimilarity(profile1, profile2) {
    // 基于兴趣标签的Jaccard相似度
    const tags1 = new Set(profile1.interests.map(i => i.tag))
    const tags2 = new Set(profile2.interests.map(i => i.tag))

    const intersection = new Set([...tags1].filter(x => tags2.has(x)))
    const union = new Set([...tags1, ...tags2])

    const jaccardSimilarity = intersection.size / union.size

    // 基于行为模式的相似度
    const behaviorSimilarity = 
      profile1.segment === profile2.segment ? 0.3 :
      profile1.behavior.engagementLevel === profile2.behavior.engagementLevel ? 0.2 : 0

    return jaccardSimilarity * 0.7 + behaviorSimilarity
  }

  /**
   * 基于内容的推荐
   */
  contentBasedFiltering(userId, limit = 5) {
    const userProfile = this.userProfiles.get(userId)
    if (!userProfile) return []

    const userInterests = new Set(userProfile.interests.map(i => i.tag))
    const userContentIds = new Set(Object.keys(userProfile.contentAffinity))

    const recommendations = this.contentItems
      .filter(item => !userContentIds.has(item.id))
      .map(item => {
        const itemTags = new Set(item.tags || [])
        const intersection = new Set([...userInterests].filter(x => itemTags.has(x)))
        const score = intersection.size / userInterests.size * 100

        return {
          contentId: item.id,
          score,
          reason: 'content_match',
          matchedTags: Array.from(intersection)
        }
      })
      .filter(rec => rec.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    return recommendations
  }

  /**
   * 混合推荐策略
   */
  getRecommendations(userId, limit = 10) {
    // 协同过滤推荐
    const cfRecommendations = this.collaborativeFiltering(userId, Math.ceil(limit * 0.6))

    // 基于内容推荐
    const cbRecommendations = this.contentBasedFiltering(userId, Math.ceil(limit * 0.4))

    // 合并并去重
    const allRecommendations = [...cfRecommendations, ...cbRecommendations]
    const uniqueRecommendations = Array.from(
      new Map(allRecommendations.map(rec => [rec.contentId, rec])).values()
    )

    // 按分数排序
    return uniqueRecommendations
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(rec => {
        const content = this.contentItems.find(c => c.id === rec.contentId)
        return {
          ...rec,
          content
        }
      })
  }

  /**
   * 实时个性化推荐
   */
  getRealTimeRecommendations(userId, currentPage, limit = 5) {
    const userProfile = this.userProfiles.get(userId)
    
    // 基于当前页面上下文调整推荐
    const contextualRecommendations = this.contentItems
      .filter(item => {
        // 相关性过滤
        if (currentPage.topic && item.topic !== currentPage.topic) return false
        if (userProfile?.preferences.preferredLanguage && 
            item.language !== userProfile.preferences.preferredLanguage) return false
        return true
      })
      .map(item => ({
        contentId: item.id,
        score: this.calculateContextualScore(item, currentPage, userProfile),
        reason: 'contextual',
        content: item
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    return contextualRecommendations
  }

  /**
   * 计算上下文相关性分数
   */
  calculateContextualScore(item, currentPage, userProfile) {
    let score = 50 // 基础分数

    // 主题匹配
    if (item.topic === currentPage.topic) score += 20

    // 用户偏好匹配
    if (userProfile) {
      if (item.contentType === userProfile.preferences.preferredContentType) score += 15
      if (item.format === userProfile.preferences.preferredFormat) score += 10

      // 兴趣标签匹配
      const userInterests = new Set(userProfile.interests.map(i => i.tag))
      const itemTags = new Set(item.tags || [])
      const matchCount = [...userInterests].filter(x => itemTags.has(x)).length
      score += matchCount * 5
    }

    // 内容新鲜度
    const daysSincePublish = (Date.now() - new Date(item.publishDate)) / (1000 * 60 * 60 * 24)
    if (daysSincePublish < 7) score += 10
    else if (daysSincePublish < 30) score += 5

    // 内容热度
    score += Math.min(item.views / 100, 20)

    return score
  }

  /**
   * A/B测试推荐策略
   */
  getABTestRecommendations(userId, variant = 'A', limit = 5) {
    if (variant === 'A') {
      // 策略A：混合推荐
      return this.getRecommendations(userId, limit)
    } else if (variant === 'B') {
      // 策略B：纯协同过滤
      return this.collaborativeFiltering(userId, limit).map(rec => ({
        ...rec,
        content: this.contentItems.find(c => c.id === rec.contentId)
      }))
    } else {
      // 策略C：纯基于内容
      return this.contentBasedFiltering(userId, limit).map(rec => ({
        ...rec,
        content: this.contentItems.find(c => c.id === rec.contentId)
      }))
    }
  }

  /**
   * 添加内容项
   */
  addContentItem(item) {
    this.contentItems.push(item)
  }

  /**
   * 记录用户交互
   */
  recordInteraction(userId, interaction) {
    if (!this.interactionMatrix.has(userId)) {
      this.interactionMatrix.set(userId, [])
    }
    this.interactionMatrix.get(userId).push(interaction)

    // 更新用户画像
    this.buildUserProfile(userId, this.interactionMatrix.get(userId))
  }
}

// 导出单例
export const recommendationEngine = new ContentRecommendationEngine()
