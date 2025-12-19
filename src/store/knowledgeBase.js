/**
 * 企业级知识库管理系统
 * Phase 2 - 知识库核心功能
 * 
 * 功能模块:
 * 1. 知识条目管理 (CRUD)
 * 2. 全文搜索与向量相似搜索
 * 3. 知识分类与标签系统
 * 4. 知识图谱构建
 * 5. 版本控制与审计日志
 * 6. 知识推荐引擎
 */

import { reactive, computed } from 'vue'

// ==================== 数据模型定义 ====================

/**
 * 知识条目结构
 */
const KnowledgeEntry = {
  id: 0,                    // 唯一标识
  title: '',                // 标题
  content: '',              // 内容(支持Markdown)
  type: 'document',         // 类型: document/faq/case/tutorial/specification/media
  category: '',             // 分类
  tags: [],                 // 标签数组
  sourceAgentId: null,      // 来源智能体ID
  relatedAgents: [],        // 关联智能体ID数组
  status: 'active',         // 状态: active/archived/draft
  author: '',               // 作者
  version: 1,               // 版本号
  // 多媒体文件支持
  attachments: [],          // 附件列表 [{id, name, type, size, url, uploadTime}]
  mediaFiles: [],           // 多媒体文件 [{id, name, type, size, url, thumbnail, duration, uploadTime}]
  metadata: {
    views: 0,               // 浏览次数
    likes: 0,               // 点赞数
    shares: 0,              // 分享次数
    useCount: 0,            // 被智能体使用次数
    lastUsedAt: null,       // 最后使用时间
    accuracy: 100,          // 准确率(0-100)
    relevance: 100,         // 相关度(0-100)
    hasAttachments: false,  // 是否有附件
    hasMedia: false,        // 是否有多媒体
    totalFileSize: 0        // 总文件大小(bytes)
  },
  relations: [],            // 关联知识ID数组
  createdAt: '',            // 创建时间
  updatedAt: '',            // 更新时间
  createdBy: '',            // 创建者
  updatedBy: ''             // 更新者
}

/**
 * 知识分类结构
 */
const KnowledgeCategory = {
  id: 0,
  name: '',
  parentId: null,           // 父分类ID(支持多级)
  description: '',
  icon: '',
  color: '',
  order: 0,
  knowledgeCount: 0
}

// ==================== 状态管理 ====================

const state = reactive({
  // 知识条目
  knowledgeEntries: [],
  
  // 知识分类
  categories: [
    { id: 1, name: '拧紧工艺', parentId: null, description: '拧紧工艺相关知识', icon: '🔧', color: '#409EFF', order: 1, knowledgeCount: 0 },
    { id: 2, name: '设备管理', parentId: null, description: '设备管理相关知识', icon: '📦', color: '#67C23A', order: 2, knowledgeCount: 0 },
    { id: 3, name: '品牌型号', parentId: null, description: '品牌型号数据库', icon: '🏷️', color: '#E6A23C', order: 3, knowledgeCount: 0 },
    { id: 4, name: '技术文档', parentId: null, description: '技术规范与标准', icon: '📚', color: '#F56C6C', order: 4, knowledgeCount: 0 },
    { id: 5, name: '案例库', parentId: null, description: '实际应用案例', icon: '💼', color: '#909399', order: 5, knowledgeCount: 0 },
    { id: 6, name: '常见问题', parentId: null, description: 'FAQ知识库', icon: '❓', color: '#C084FC', order: 6, knowledgeCount: 0 }
  ],
  
  // 标签系统
  tags: [
    { id: 1, name: '拧紧参数', color: '#409EFF', useCount: 0 },
    { id: 2, name: '故障诊断', color: '#F56C6C', useCount: 0 },
    { id: 3, name: '设备选型', color: '#67C23A', useCount: 0 },
    { id: 4, name: '工艺优化', color: '#E6A23C', useCount: 0 },
    { id: 5, name: '质量控制', color: '#909399', useCount: 0 },
    { id: 6, name: '安全规范', color: '#F56C6C', useCount: 0 },
    { id: 7, name: '成本分析', color: '#67C23A', useCount: 0 },
    { id: 8, name: '性能测试', color: '#409EFF', useCount: 0 }
  ],
  
  // 搜索历史
  searchHistory: [],
  
  // 审计日志
  auditLogs: [],
  
  // 统计数据
  statistics: {
    totalEntries: 0,
    activeEntries: 0,
    draftEntries: 0,
    archivedEntries: 0,
    totalViews: 0,
    totalLikes: 0,
    avgAccuracy: 100,
    lastUpdated: null
  }
})

// ==================== Getters ====================

const getters = {
  // 获取所有激活的知识条目
  activeKnowledge: computed(() => 
    state.knowledgeEntries.filter(k => k.status === 'active')
  ),
  
  // 按分类获取知识
  knowledgeByCategory: computed(() => (categoryId) =>
    state.knowledgeEntries.filter(k => k.category === categoryId && k.status === 'active')
  ),
  
  // 按标签获取知识
  knowledgeByTag: computed(() => (tagName) =>
    state.knowledgeEntries.filter(k => 
      k.tags.includes(tagName) && k.status === 'active'
    )
  ),
  
  // 按智能体获取知识
  knowledgeByAgent: computed(() => (agentId) =>
    state.knowledgeEntries.filter(k => 
      k.sourceAgentId === agentId || k.relatedAgents.includes(agentId)
    )
  ),
  
  // 热门知识(按浏览量排序)
  popularKnowledge: computed(() =>
    [...state.knowledgeEntries]
      .filter(k => k.status === 'active')
      .sort((a, b) => b.metadata.views - a.metadata.views)
      .slice(0, 10)
  ),
  
  // 最新知识
  recentKnowledge: computed(() =>
    [...state.knowledgeEntries]
      .filter(k => k.status === 'active')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
  ),
  
  // 获取知识图谱数据
  knowledgeGraph: computed(() => {
    const nodes = state.knowledgeEntries.map(k => ({
      id: k.id,
      label: k.title,
      category: k.category,
      type: k.type
    }))
    
    const edges = []
    state.knowledgeEntries.forEach(k => {
      k.relations.forEach(relId => {
        edges.push({
          source: k.id,
          target: relId,
          type: 'related'
        })
      })
    })
    
    return { nodes, edges }
  })
}

// ==================== Actions ====================

const actions = {
  // ===== 知识条目管理 =====
  
  /**
   * 添加知识条目
   */
  addKnowledge(knowledgeData) {
    const newId = state.knowledgeEntries.length > 0
      ? Math.max(...state.knowledgeEntries.map(k => k.id)) + 1
      : 1
    
    const attachments = knowledgeData.attachments || []
    const mediaFiles = knowledgeData.mediaFiles || []
    const totalFileSize = [...attachments, ...mediaFiles].reduce((sum, file) => sum + (file.size || 0), 0)
    
    const knowledge = {
      id: newId,
      title: knowledgeData.title || '未命名知识',
      content: knowledgeData.content || '',
      type: knowledgeData.type || 'document',
      category: knowledgeData.category || '',
      tags: knowledgeData.tags || [],
      sourceAgentId: knowledgeData.sourceAgentId || null,
      relatedAgents: knowledgeData.relatedAgents || [],
      status: knowledgeData.status || 'draft',
      author: knowledgeData.author || '系统管理员',
      version: 1,
      attachments: attachments,
      mediaFiles: mediaFiles,
      metadata: {
        views: 0,
        likes: 0,
        shares: 0,
        useCount: 0,
        lastUsedAt: null,
        accuracy: 100,
        relevance: 100,
        hasAttachments: attachments.length > 0,
        hasMedia: mediaFiles.length > 0,
        totalFileSize: totalFileSize
      },
      relations: knowledgeData.relations || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: knowledgeData.author || '系统管理员',
      updatedBy: knowledgeData.author || '系统管理员'
    }
    
    state.knowledgeEntries.push(knowledge)
    this.updateStatistics()
    this.saveToLocalStorage()
    
    // 记录审计日志
    this.addAuditLog({
      action: 'create',
      entityType: 'knowledge',
      entityId: newId,
      details: `创建知识: ${knowledge.title}`,
      user: knowledge.author
    })
    
    return newId
  },
  
  /**
   * 更新知识条目
   */
  updateKnowledge(id, updates) {
    const index = state.knowledgeEntries.findIndex(k => k.id === id)
    if (index !== -1) {
      const oldVersion = state.knowledgeEntries[index].version
      state.knowledgeEntries[index] = {
        ...state.knowledgeEntries[index],
        ...updates,
        version: oldVersion + 1,
        updatedAt: new Date().toISOString(),
        updatedBy: updates.updatedBy || '系统管理员'
      }
      
      this.updateStatistics()
      this.saveToLocalStorage()
      
      // 记录审计日志
      this.addAuditLog({
        action: 'update',
        entityType: 'knowledge',
        entityId: id,
        details: `更新知识: ${state.knowledgeEntries[index].title} (v${oldVersion} -> v${oldVersion + 1})`,
        user: updates.updatedBy || '系统管理员'
      })
      
      return true
    }
    return false
  },
  
  /**
   * 删除知识条目(软删除,归档)
   */
  deleteKnowledge(id) {
    return this.updateKnowledge(id, { status: 'archived' })
  },
  
  /**
   * 永久删除知识条目
   */
  permanentDeleteKnowledge(id) {
    const index = state.knowledgeEntries.findIndex(k => k.id === id)
    if (index !== -1) {
      const knowledge = state.knowledgeEntries[index]
      state.knowledgeEntries.splice(index, 1)
      
      this.updateStatistics()
      this.saveToLocalStorage()
      
      // 记录审计日志
      this.addAuditLog({
        action: 'delete',
        entityType: 'knowledge',
        entityId: id,
        details: `永久删除知识: ${knowledge.title}`,
        user: '系统管理员'
      })
      
      return true
    }
    return false
  },
  
  /**
   * 发布知识(从草稿变为激活)
   */
  publishKnowledge(id) {
    return this.updateKnowledge(id, { status: 'active' })
  },
  
  // ===== 搜索功能 =====
  
  /**
   * 全文搜索
   */
  searchKnowledge(query, options = {}) {
    const {
      category = null,
      tags = [],
      type = null,
      status = 'active',
      sortBy = 'relevance' // relevance, date, views, accuracy
    } = options
    
    // 保存搜索历史
    this.addSearchHistory(query)
    
    const lowerQuery = query.toLowerCase()
    let results = state.knowledgeEntries.filter(k => {
      // 状态过滤
      if (status && k.status !== status) return false
      
      // 分类过滤
      if (category && k.category !== category) return false
      
      // 标签过滤
      if (tags.length > 0 && !tags.some(tag => k.tags.includes(tag))) return false
      
      // 类型过滤
      if (type && k.type !== type) return false
      
      // 全文搜索
      return (
        k.title.toLowerCase().includes(lowerQuery) ||
        k.content.toLowerCase().includes(lowerQuery) ||
        k.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
    })
    
    // 排序
    switch (sortBy) {
      case 'date':
        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
      case 'views':
        results.sort((a, b) => b.metadata.views - a.metadata.views)
        break
      case 'accuracy':
        results.sort((a, b) => b.metadata.accuracy - a.metadata.accuracy)
        break
      case 'relevance':
      default:
        // 简单的相关度计算(标题匹配 > 内容匹配)
        results.sort((a, b) => {
          const aScore = (a.title.toLowerCase().includes(lowerQuery) ? 2 : 0) +
                        (a.content.toLowerCase().includes(lowerQuery) ? 1 : 0)
          const bScore = (b.title.toLowerCase().includes(lowerQuery) ? 2 : 0) +
                        (b.content.toLowerCase().includes(lowerQuery) ? 1 : 0)
          return bScore - aScore
        })
    }
    
    return results
  },
  
  /**
   * 向量相似搜索(模拟实现)
   * 实际生产环境应使用真实的向量数据库如Pinecone/Milvus
   */
  similaritySearch(knowledgeId, limit = 5) {
    const source = state.knowledgeEntries.find(k => k.id === knowledgeId)
    if (!source) return []
    
    // 简化的相似度计算:基于标签和分类的重叠度
    const similarities = state.knowledgeEntries
      .filter(k => k.id !== knowledgeId && k.status === 'active')
      .map(k => {
        let score = 0
        
        // 相同分类 +30分
        if (k.category === source.category) score += 30
        
        // 标签重叠度 (每个重叠标签 +10分)
        const commonTags = k.tags.filter(tag => source.tags.includes(tag))
        score += commonTags.length * 10
        
        // 相同类型 +20分
        if (k.type === source.type) score += 20
        
        // 关联知识 +40分
        if (source.relations.includes(k.id) || k.relations.includes(source.id)) {
          score += 40
        }
        
        return { knowledge: k, similarity: score }
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)
    
    return similarities
  },
  
  /**
   * 智能推荐
   * 基于用户行为和知识关联推荐相关内容
   */
  recommendKnowledge(userId, limit = 10) {
    // 获取用户最近浏览的知识
    const recentViews = state.auditLogs
      .filter(log => log.action === 'view' && log.user === userId)
      .slice(-5)
      .map(log => log.entityId)
    
    if (recentViews.length === 0) {
      // 如果没有浏览历史,返回热门知识
      return getters.popularKnowledge.value.slice(0, limit)
    }
    
    // 基于最近浏览找相似知识
    const recommendations = new Set()
    recentViews.forEach(id => {
      const similar = this.similaritySearch(id, 3)
      similar.forEach(s => recommendations.add(s.knowledge))
    })
    
    return Array.from(recommendations).slice(0, limit)
  },
  
  // ===== 分类管理 =====
  
  /**
   * 添加分类
   */
  addCategory(categoryData) {
    const newId = Math.max(...state.categories.map(c => c.id), 0) + 1
    const category = {
      id: newId,
      name: categoryData.name,
      parentId: categoryData.parentId || null,
      description: categoryData.description || '',
      icon: categoryData.icon || '📁',
      color: categoryData.color || '#409EFF',
      order: categoryData.order || state.categories.length + 1,
      knowledgeCount: 0
    }
    
    state.categories.push(category)
    this.saveToLocalStorage()
    
    return newId
  },
  
  /**
   * 更新分类
   */
  updateCategory(id, updates) {
    const index = state.categories.findIndex(c => c.id === id)
    if (index !== -1) {
      state.categories[index] = {
        ...state.categories[index],
        ...updates
      }
      this.saveToLocalStorage()
      return true
    }
    return false
  },
  
  /**
   * 删除分类
   */
  deleteCategory(id) {
    // 检查是否有知识使用此分类
    const hasKnowledge = state.knowledgeEntries.some(k => k.category === id)
    if (hasKnowledge) {
      return { success: false, message: '该分类下还有知识条目,无法删除' }
    }
    
    const index = state.categories.findIndex(c => c.id === id)
    if (index !== -1) {
      state.categories.splice(index, 1)
      this.saveToLocalStorage()
      return { success: true }
    }
    return { success: false, message: '分类不存在' }
  },
  
  // ===== 标签管理 =====
  
  /**
   * 添加标签
   */
  addTag(tagData) {
    const exists = state.tags.find(t => t.name === tagData.name)
    if (exists) return exists.id
    
    const newId = Math.max(...state.tags.map(t => t.id), 0) + 1
    const tag = {
      id: newId,
      name: tagData.name,
      color: tagData.color || '#409EFF',
      useCount: 0
    }
    
    state.tags.push(tag)
    this.saveToLocalStorage()
    
    return newId
  },
  
  /**
   * 更新标签使用次数
   */
  updateTagUsage() {
    state.tags.forEach(tag => {
      tag.useCount = state.knowledgeEntries.filter(k => 
        k.tags.includes(tag.name) && k.status === 'active'
      ).length
    })
    this.saveToLocalStorage()
  },
  
  // ===== 知识交互 =====
  
  /**
   * 增加浏览量
   */
  incrementViews(id) {
    const knowledge = state.knowledgeEntries.find(k => k.id === id)
    if (knowledge) {
      knowledge.metadata.views++
      this.updateStatistics()
      this.saveToLocalStorage()
      
      // 记录审计日志
      this.addAuditLog({
        action: 'view',
        entityType: 'knowledge',
        entityId: id,
        details: `浏览知识: ${knowledge.title}`,
        user: '当前用户'
      })
    }
  },
  
  /**
   * 增加点赞
   */
  incrementLikes(id) {
    const knowledge = state.knowledgeEntries.find(k => k.id === id)
    if (knowledge) {
      knowledge.metadata.likes++
      this.updateStatistics()
      this.saveToLocalStorage()
    }
  },
  
  /**
   * 增加分享次数
   */
  incrementShares(id) {
    const knowledge = state.knowledgeEntries.find(k => k.id === id)
    if (knowledge) {
      knowledge.metadata.shares++
      this.saveToLocalStorage()
    }
  },
  
  /**
   * 记录智能体使用
   */
  recordAgentUsage(knowledgeId, agentId) {
    const knowledge = state.knowledgeEntries.find(k => k.id === knowledgeId)
    if (knowledge) {
      knowledge.metadata.useCount++
      knowledge.metadata.lastUsedAt = new Date().toISOString()
      
      // 自动关联智能体
      if (!knowledge.relatedAgents.includes(agentId)) {
        knowledge.relatedAgents.push(agentId)
      }
      
      this.saveToLocalStorage()
      
      // 记录审计日志
      this.addAuditLog({
        action: 'use',
        entityType: 'knowledge',
        entityId: knowledgeId,
        details: `智能体 ${agentId} 使用了知识: ${knowledge.title}`,
        user: `agent-${agentId}`
      })
    }
  },
  
  /**
   * 更新准确率
   */
  updateAccuracy(id, accuracy) {
    const knowledge = state.knowledgeEntries.find(k => k.id === id)
    if (knowledge) {
      knowledge.metadata.accuracy = accuracy
      this.updateStatistics()
      this.saveToLocalStorage()
    }
  },
  
  // ===== 知识关联 =====
  
  /**
   * 添加知识关联
   */
  addRelation(sourceId, targetId) {
    const source = state.knowledgeEntries.find(k => k.id === sourceId)
    if (source && !source.relations.includes(targetId)) {
      source.relations.push(targetId)
      this.saveToLocalStorage()
      return true
    }
    return false
  },
  
  /**
   * 移除知识关联
   */
  removeRelation(sourceId, targetId) {
    const source = state.knowledgeEntries.find(k => k.id === sourceId)
    if (source) {
      source.relations = source.relations.filter(id => id !== targetId)
      this.saveToLocalStorage()
      return true
    }
    return false
  },
  
  // ===== 辅助功能 =====
  
  /**
   * 添加搜索历史
   */
  addSearchHistory(query) {
    const history = {
      query,
      timestamp: new Date().toISOString()
    }
    
    state.searchHistory.unshift(history)
    // 只保留最近50条
    if (state.searchHistory.length > 50) {
      state.searchHistory = state.searchHistory.slice(0, 50)
    }
    
    this.saveToLocalStorage()
  },
  
  /**
   * 添加审计日志
   */
  addAuditLog(log) {
    const auditLog = {
      id: state.auditLogs.length + 1,
      timestamp: new Date().toISOString(),
      ...log
    }
    
    state.auditLogs.unshift(auditLog)
    // 只保留最近1000条
    if (state.auditLogs.length > 1000) {
      state.auditLogs = state.auditLogs.slice(0, 1000)
    }
    
    this.saveToLocalStorage()
  },
  
  /**
   * 更新统计数据
   */
  updateStatistics() {
    state.statistics.totalEntries = state.knowledgeEntries.length
    state.statistics.activeEntries = state.knowledgeEntries.filter(k => k.status === 'active').length
    state.statistics.draftEntries = state.knowledgeEntries.filter(k => k.status === 'draft').length
    state.statistics.archivedEntries = state.knowledgeEntries.filter(k => k.status === 'archived').length
    
    state.statistics.totalViews = state.knowledgeEntries.reduce((sum, k) => sum + k.metadata.views, 0)
    state.statistics.totalLikes = state.knowledgeEntries.reduce((sum, k) => sum + k.metadata.likes, 0)
    
    const activeEntries = state.knowledgeEntries.filter(k => k.status === 'active')
    state.statistics.avgAccuracy = activeEntries.length > 0
      ? activeEntries.reduce((sum, k) => sum + k.metadata.accuracy, 0) / activeEntries.length
      : 100
    
    state.statistics.lastUpdated = new Date().toISOString()
    
    // 更新分类的知识数量
    state.categories.forEach(cat => {
      cat.knowledgeCount = state.knowledgeEntries.filter(k => 
        k.category === cat.id && k.status === 'active'
      ).length
    })
    
    // 更新标签使用次数
    this.updateTagUsage()
  },
  
  /**
   * 数据持久化
   */
  saveToLocalStorage() {
    try {
      localStorage.setItem('knowledgeBase_entries', JSON.stringify(state.knowledgeEntries))
      localStorage.setItem('knowledgeBase_categories', JSON.stringify(state.categories))
      localStorage.setItem('knowledgeBase_tags', JSON.stringify(state.tags))
      localStorage.setItem('knowledgeBase_searchHistory', JSON.stringify(state.searchHistory))
      localStorage.setItem('knowledgeBase_auditLogs', JSON.stringify(state.auditLogs))
      localStorage.setItem('knowledgeBase_statistics', JSON.stringify(state.statistics))
    } catch (error) {
      console.error('保存知识库数据失败:', error)
    }
  },
  
  /**
   * 从LocalStorage加载数据
   */
  loadFromLocalStorage() {
    try {
      const entries = localStorage.getItem('knowledgeBase_entries')
      const categories = localStorage.getItem('knowledgeBase_categories')
      const tags = localStorage.getItem('knowledgeBase_tags')
      const searchHistory = localStorage.getItem('knowledgeBase_searchHistory')
      const auditLogs = localStorage.getItem('knowledgeBase_auditLogs')
      const statistics = localStorage.getItem('knowledgeBase_statistics')
      
      if (entries) state.knowledgeEntries = JSON.parse(entries)
      if (categories) state.categories = JSON.parse(categories)
      if (tags) state.tags = JSON.parse(tags)
      if (searchHistory) state.searchHistory = JSON.parse(searchHistory)
      if (auditLogs) state.auditLogs = JSON.parse(auditLogs)
      if (statistics) state.statistics = JSON.parse(statistics)
      
      this.updateStatistics()
    } catch (error) {
      console.error('加载知识库数据失败:', error)
    }
  },
  
  /**
   * 导出知识库数据
   */
  exportData(format = 'json') {
    const data = {
      version: '1.0.0',
      exportTime: new Date().toISOString(),
      entries: state.knowledgeEntries,
      categories: state.categories,
      tags: state.tags,
      statistics: state.statistics
    }
    
    if (format === 'json') {
      return JSON.stringify(data, null, 2)
    }
    
    // TODO: 支持其他格式如CSV, XML等
    return data
  },
  
  /**
   * 导入知识库数据
   */
  importData(data) {
    try {
      if (typeof data === 'string') {
        data = JSON.parse(data)
      }
      
      if (data.entries) state.knowledgeEntries = data.entries
      if (data.categories) state.categories = data.categories
      if (data.tags) state.tags = data.tags
      
      this.updateStatistics()
      this.saveToLocalStorage()
      
      return { success: true, message: '导入成功' }
    } catch (error) {
      return { success: false, message: '导入失败: ' + error.message }
    }
  },
  
  // ===== 文件管理 =====
  
  /**
   * 添加附件到知识条目
   */
  addAttachment(knowledgeId, fileData) {
    const knowledge = state.knowledgeEntries.find(k => k.id === knowledgeId)
    if (!knowledge) return false
    
    const attachment = {
      id: Date.now() + Math.random(),
      name: fileData.name,
      type: fileData.type || this.getFileType(fileData.name),
      size: fileData.size,
      url: fileData.url || fileData.base64,
      uploadTime: new Date().toISOString()
    }
    
    if (!knowledge.attachments) knowledge.attachments = []
    knowledge.attachments.push(attachment)
    
    knowledge.metadata.hasAttachments = true
    knowledge.metadata.totalFileSize = (knowledge.metadata.totalFileSize || 0) + attachment.size
    knowledge.updatedAt = new Date().toISOString()
    
    this.saveToLocalStorage()
    return attachment.id
  },
  
  /**
   * 添加多媒体文件
   */
  addMediaFile(knowledgeId, fileData) {
    const knowledge = state.knowledgeEntries.find(k => k.id === knowledgeId)
    if (!knowledge) return false
    
    const mediaFile = {
      id: Date.now() + Math.random(),
      name: fileData.name,
      type: fileData.type || this.getFileType(fileData.name),
      size: fileData.size,
      url: fileData.url || fileData.base64,
      thumbnail: fileData.thumbnail || null,
      duration: fileData.duration || null, // 视频/音频时长
      uploadTime: new Date().toISOString()
    }
    
    if (!knowledge.mediaFiles) knowledge.mediaFiles = []
    knowledge.mediaFiles.push(mediaFile)
    
    knowledge.metadata.hasMedia = true
    knowledge.metadata.totalFileSize = (knowledge.metadata.totalFileSize || 0) + mediaFile.size
    knowledge.updatedAt = new Date().toISOString()
    
    this.saveToLocalStorage()
    return mediaFile.id
  },
  
  /**
   * 删除附件
   */
  removeAttachment(knowledgeId, attachmentId) {
    const knowledge = state.knowledgeEntries.find(k => k.id === knowledgeId)
    if (!knowledge) return false
    
    const index = knowledge.attachments.findIndex(a => a.id === attachmentId)
    if (index !== -1) {
      const file = knowledge.attachments[index]
      knowledge.metadata.totalFileSize -= file.size
      knowledge.attachments.splice(index, 1)
      knowledge.metadata.hasAttachments = knowledge.attachments.length > 0
      knowledge.updatedAt = new Date().toISOString()
      this.saveToLocalStorage()
      return true
    }
    return false
  },
  
  /**
   * 删除多媒体文件
   */
  removeMediaFile(knowledgeId, mediaId) {
    const knowledge = state.knowledgeEntries.find(k => k.id === knowledgeId)
    if (!knowledge) return false
    
    const index = knowledge.mediaFiles.findIndex(m => m.id === mediaId)
    if (index !== -1) {
      const file = knowledge.mediaFiles[index]
      knowledge.metadata.totalFileSize -= file.size
      knowledge.mediaFiles.splice(index, 1)
      knowledge.metadata.hasMedia = knowledge.mediaFiles.length > 0
      knowledge.updatedAt = new Date().toISOString()
      this.saveToLocalStorage()
      return true
    }
    return false
  },
  
  /**
   * 获取文件类型
   */
  getFileType(filename) {
    const ext = filename.split('.').pop().toLowerCase()
    
    // 图片类型
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(ext)) {
      return 'image'
    }
    // 文档类型
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'md'].includes(ext)) {
      return 'document'
    }
    // 视频类型
    if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'].includes(ext)) {
      return 'video'
    }
    // 音频类型
    if (['mp3', 'wav', 'ogg', 'aac', 'flac'].includes(ext)) {
      return 'audio'
    }
    // 压缩文件
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
      return 'archive'
    }
    
    return 'other'
  },
  
  /**
   * 格式化文件大小
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  },
  
  /**
   * 初始化演示数据
   */
  initDemoData() {
    // 添加一些演示知识
    const demoKnowledge = [
      {
        title: '拧紧力矩参数设置指南',
        content: `# 拧紧力矩参数设置指南

## 基本概念
拧紧力矩是指紧固件在安装过程中所需要的扭矩大小,直接影响连接的可靠性和安全性。

## 参数设置步骤
1. 确定螺栓规格和等级
2. 查阅相关标准(如ISO 或 DIN标准)
3. 考虑材料特性和应用环境
4. 设置目标力矩值和容差范围

## 注意事项
- 力矩过小:连接不牢固,可能松动
- 力矩过大:可能损坏螺纹或工件
- 建议使用扭矩扳手进行校验`,
        type: 'tutorial',
        category: 1,
        tags: ['拧紧参数', '工艺优化', '质量控制'],
        status: 'active',
        author: '技术专家'
      },
      {
        title: '设备故障诊断流程',
        content: `# 设备故障诊断流程

## 诊断步骤
1. **故障现象确认**
   - 详细记录故障表现
   - 收集操作人员反馈
   
2. **初步排查**
   - 检查电源和连接
   - 查看错误代码
   
3. **深度分析**
   - 使用专业诊断工具
   - 分析历史数据
   
4. **解决方案**
   - 制定维修计划
   - 实施修复措施
   - 验证修复效果`,
        type: 'document',
        category: 2,
        tags: ['故障诊断', '设备管理'],
        status: 'active',
        author: '维护工程师'
      },
      {
        title: '常见问题:工具选型困惑',
        content: `# 常见问题:如何选择合适的拧紧工具?

## 问题
客户经常不知道如何选择适合自己应用场景的拧紧工具。

## 解答
选择拧紧工具需要考虑以下因素:

1. **应用场景**
   - 生产线:推荐电动或气动工具
   - 现场维修:推荐便携式手动工具

2. **力矩范围**
   - 小扭矩(<50Nm):手动扳手
   - 中扭矩(50-500Nm):电动扳手
   - 大扭矩(>500Nm):液压工具

3. **精度要求**
   - 高精度:数控电动工具
   - 一般精度:标准电动工具

4. **预算考虑**
   - 根据实际需求平衡性能和价格`,
        type: 'faq',
        category: 6,
        tags: ['设备选型', '常见问题'],
        status: 'active',
        author: '销售顾问'
      },
      // ========== 新增: 拧紧曲线分析专业知识 ==========
      {
        title: '拧紧曲线三阶段理论 (Tightening Curve Phase Theory)',
        content: `# 拧紧曲线三阶段理论

拧紧曲线是扭矩-角度-时间的关系曲线，反映了螺栓连接从开始拧紧到最终紧固的全过程。理解曲线的各个阶段对于工艺优化和质量控制至关重要。

## 第一阶段: 低速认牙与贴合 (0-90°)

### 特征
- **扭矩**: 几乎为零或非常小 (0-5 N·m)
- **角度范围**: 0-90°
- **曲线形态**: 平缓,接近水平线

### 物理过程
1. 螺栓头部与工件表面接触
2. 螺纹开始啮合,低速旋入
3. 克服初始摩擦力

### 关键点: 贴合点 (Seat Point)
- **定义**: 曲线从平缓开始明显上升的拐点
- **典型位置**: 约280-360°处
- **识别方法**: 扭矩开始持续上升超过5 N·m时的角度
- **意义**: 螺栓头与被连接件完全贴合,是有效拧紧的起点

### 工艺要点
- ✓ 应使用低转速 (10-50 rpm)
- ✓ 避免快速冲击,防止滑牙
- ✓ 确保螺纹清洁,无异物

## 第二阶段: 快速旋入与弹性段 (90-360°)

### 特征
- **扭矩**: 缓慢增长 (5-50 N·m)
- **角度范围**: 90-360°
- **曲线形态**: 轻微上升的斜线

### 物理过程
1. 螺纹充分啮合
2. 螺栓轴向伸长(弹性变形)
3. 扭矩与转角基本呈线性关系

### 数学关系
\`\`\`
T = k₁ × θ + c
其中:
T - 扭矩 (N·m)
θ - 转角 (度)
k₁ - 弹性段斜率 (刚度系数)
c - 常数项
\`\`\`

### 质量指标
- **斜率(k₁)**: 反映连接刚度
  - 刚度大: 斜率陡,连接坚固
  - 刚度小: 斜率缓,可能松动
- **线性度**: 曲线越直线性越好,工艺越稳定

### 工艺要点
- ✓ 可适当提高转速 (50-150 rpm)
- ✓ 监控斜率变化,识别异常
- ✓ 此阶段应保持匀速拧紧

## 第三阶段: 拧紧段与塑性变形 (360-540°+)

### 特征
- **扭矩**: 快速增长至目标值 (50-200+ N·m)
- **角度范围**: 360°至目标角度
- **曲线形态**: 快速上升,可能出现屈服拐点

### 物理过程
1. 螺栓拉伸至接近屈服点
2. 被连接件压缩变形
3. 达到目标预紧力

### 屈服点 (Yield Point)
- **定义**: 曲线从直线开始偏离,斜率明显减小的点
- **意义**: 螺栓开始塑性变形,超过此点可能损坏
- **识别**: 二阶导数出现负值

### 控制策略

#### 1. 扭矩控制法 (Torque Control)
- 达到目标扭矩后停止
- 适用: 一般精度要求
- 精度: ±10-15%

#### 2. 转角控制法 (Angle Control)  
- 从贴合点旋转固定角度
- 适用: 高一致性要求
- 精度: ±5%

#### 3. 扭矩-转角法 (Torque-Angle Method) ⭐推荐
- 先达到贴合扭矩(如30 N·m)
- 再继续转动指定角度(如90°)
- 适用: 高精度关键连接
- 精度: ±2-3%

#### 4. 屈服点法 (Yield Point Control)
- 检测屈服点,按比例停止
- 适用: 最高精度要求
- 精度: ±1-2%

### 工艺要点
- ✓ 严格控制最终扭矩/角度
- ✓ 监控屈服点,避免过拧
- ✓ 降低转速 (20-50 rpm),保证精度
- ⚠️ 超过屈服点20%以上可能导致螺栓断裂

## 综合分析要点

### 曲线形状判断
1. **理想曲线**: 三段分明,过渡平滑
2. **异常曲线类型**:
   - 滑牙: 第二段扭矩异常低
   - 粘滑: 曲线有周期性锯齿
   - 断裂: 突然扭矩下降
   - 缓升: 第三段斜率过小
   - 浮钉: 贴合点延后

### 关键参数提取
- 贴合点角度 (Seat Angle)
- 最终扭矩 (Final Torque)
- 总转角 (Total Angle)
- 有效转角 (Angle from Seat)
- 弹性段斜率 (Elastic Slope)
- 最大斜率位置 (Peak Slope Point)

### 质量判定标准
\`\`\`
合格条件 (AND):
1. 最终扭矩在目标±10%范围内
2. 总转角在目标±20°范围内
3. 曲线无异常波动(滑牙/粘滑等)
4. 贴合点在合理范围(250-400°)
5. 弹性段斜率在预期范围
\`\`\`

## 参考标准
- **ISO 5393**: 旋转工具性能要求和测试方法
- **VDI/VDE 2862**: 拧紧技术标准
- **DIN EN 45545**: 螺栓连接质量要求
- **GB/T 16823**: 螺纹紧固件拧紧试验方法

---
**版本**: v2.0.0  
**最后更新**: 2025-12-16  
**作者**: 拧紧工艺专家团队`,
        type: 'specification',
        category: 1,
        tags: ['拧紧曲线', '三阶段理论', '工艺优化', '质量控制'],
        status: 'active',
        author: '拧紧工艺专家'
      },
      {
        title: '拧紧曲线7种常见异常类型诊断手册',
        content: `# 拧紧曲线异常诊断手册

本手册详细说明了拧紧过程中可能出现的7种典型异常及其诊断方法。

## 1. 滑牙 (Thread Stripping) 🔴 严重

### 曲线特征
- **扭矩**: 在旋入阶段突然下降或保持低位
- **角度**: 转角持续增加但扭矩不增
- **形态**: 扭矩曲线出现"平台"或"下降段"

### 识别条件
\`\`\`javascript
// 算法判断
if (angle > 200 && torque < 10 && continuing_rotation) {
  return "滑牙异常"
}
// 或斜率突变
if (slope_drop > 80% && angle < 400) {
  return "疑似滑牙"
}
\`\`\`

### 根本原因
1. **螺纹损伤**: 螺栓或螺母螺纹预先损坏
2. **材料不匹配**: 强度等级不符(如8.8用在10.9位置)
3. **扭矩过大**: 超出螺纹承载能力
4. **螺纹污染**: 切屑、油污堵塞螺纹

### 解决方案
- ✓ 更换新螺栓和螺母
- ✓ 检查螺纹规格和等级匹配性
- ✓ 降低拧紧扭矩或使用更高强度螺栓
- ✓ 清洁螺纹,去除杂质
- ✓ 检查螺纹加工质量

### 预防措施
- 使用螺纹量规检查
- 建立螺栓强度等级标识系统
- 定期培训操作员识别滑牙声音

---

## 2. 粘滑效应 (Stick-Slip) 🟡 中度

### 曲线特征
- **扭矩**: 周期性波动,呈锯齿状
- **角度**: 正常增长
- **形态**: 曲线不平滑,有规律性振荡

### 识别条件
\`\`\`javascript
// 检测扭矩波动频率
if (torque_oscillation_count > 5 && amplitude > 5Nm) {
  return "粘滑效应"
}
\`\`\`

### 根本原因
1. **摩擦系数不稳定**: 润滑不均匀
2. **表面粗糙**: 螺栓/螺母表面质量差
3. **转速过低**: 静摩擦与动摩擦差异大
4. **污染**: 锈蚀、氧化层

### 解决方案
- ✓ 使用适当的润滑剂(MoS₂、石墨)
- ✓ 提高拧紧转速(减小静动摩擦差)
- ✓ 改善螺纹表面光洁度
- ✓ 清除表面锈蚀和氧化层

### 预防措施
- 使用防锈螺栓
- 建立润滑标准作业程序
- 定期校准拧紧工具

---

## 3. 扭矩缓升 (Slow Torque Rise) 🟡 中度

### 曲线特征
- **扭矩**: 上升速度异常缓慢
- **角度**: 需要更大转角才能达到目标扭矩
- **形态**: 第三阶段斜率明显低于正常值

### 识别条件
\`\`\`javascript
// 斜率分析
if (final_slope < 0.3 && angle > 600) {
  return "扭矩缓升"
}
\`\`\`

### 根本原因
1. **连接刚度不足**: 垫片过软或缺失
2. **工件变形**: 被连接件刚度低
3. **间隙过大**: 装配不到位
4. **螺栓过长**: 有效拧紧长度过大

### 解决方案
- ✓ 检查并更换合适的垫片
- ✓ 增加被连接件刚度(加强筋、垫块)
- ✓ 改进装配工艺,消除间隙
- ✓ 使用正确长度的螺栓

---

## 4. 压溃失效 (Crushing Failure) 🔴 严重

### 曲线特征
- **扭矩**: 达到峰值后突然下降
- **角度**: 峰值后继续转动但扭矩不再增加
- **形态**: 出现明显的"驼峰"

### 识别条件
\`\`\`javascript
if (torque_peak_detected && torque_drop > 15Nm) {
  return "压溃失效"
}
\`\`\`

### 根本原因
1. **被连接件强度不足**: 材料承载力低(如铝合金、塑料)
2. **局部应力集中**: 接触面积小
3. **扭矩过大**: 超出工件承载能力
4. **垫片缺失**: 应力分布不均

### 解决方案
- ✓ 降低目标扭矩
- ✓ 使用更大接触面积的垫圈
- ✓ 增加被连接件厚度或强度
- ✓ 采用扭矩-转角法代替纯扭矩法

---

## 5. 螺栓断裂 (Bolt Fracture) 🔴 致命

### 曲线特征
- **扭矩**: 急剧上升后突然归零
- **角度**: 断裂点后无法继续拧紧
- **形态**: 垂直下降的"悬崖"

### 识别条件
\`\`\`javascript
if (torque > 50 && sudden_drop_to_zero) {
  return "螺栓断裂"
}
\`\`\`

### 根本原因
1. **过度拧紧**: 超过螺栓屈服强度
2. **疲劳断裂**: 螺栓已有疲劳裂纹
3. **应力腐蚀**: 环境腐蚀降低强度
4. **材料缺陷**: 螺栓内部有夹杂物或裂纹

### 解决方案
- ✓ 立即停止作业,更换螺栓
- ✓ 检查目标扭矩设置是否正确
- ✓ 使用更高强度等级螺栓
- ✓ 检查螺栓供应商质量
- ✓ 实施螺栓批次检验

---

## 6. 浮钉 (High Seating) 🟡 中度

### 曲线特征
- **扭矩**: 贴合点出现延迟
- **角度**: 贴合点角度>400°
- **形态**: 前段平缓段过长

### 识别条件
\`\`\`javascript
if (seat_point_angle > 400) {
  return "浮钉异常"
}
\`\`\`

### 根本原因
1. **螺栓过长**: 穿透螺母后有空隙
2. **螺纹损伤**: 螺纹啮合不充分
3. **装配间隙**: 工件之间有杂物
4. **垫片移位**: 垫片未正确安装

### 解决方案
- ✓ 使用正确长度的螺栓
- ✓ 检查螺纹质量
- ✓ 清除装配面杂物
- ✓ 确保垫片正确安装

---

## 7. 开裂破坏 (Material Cracking) 🔴 严重

### 曲线特征
- **扭矩**: 曲线中出现多个小跌落
- **角度**: 继续拧紧时扭矩波动
- **形态**: 锯齿状下降

### 识别条件
\`\`\`javascript
if (multiple_torque_drops && drop_count > 3) {
  return "材料开裂"
}
\`\`\`

### 根本原因
1. **脆性材料**: 铸铁、陶瓷等脆性工件
2. **应力集中**: 孔边缘有缺口
3. **温度应力**: 热胀冷缩导致
4. **疲劳损伤**: 工件已有裂纹

### 解决方案
- ✓ 降低拧紧速度和扭矩
- ✓ 改进孔加工质量(倒角、去毛刺)
- ✓ 使用柔性垫圈分散应力
- ✓ 检查工件材质是否合适

---

## 综合诊断流程图

\`\`\`
开始拧紧
    ↓
检测贴合点
    ├─ 未检测到 → 浮钉异常
    ├─ 延迟出现(>400°) → 浮钉/装配问题
    └─ 正常(250-400°) → 继续
        ↓
    监控扭矩上升
        ├─ 扭矩不增/下降 → 滑牙
        ├─ 周期性波动 → 粘滑
        ├─ 斜率过小 → 缓升
        └─ 正常上升 → 继续
            ↓
        检测峰值扭矩
            ├─ 扭矩突然归零 → 断裂
            ├─ 达到峰值后下降 → 压溃
            ├─ 多次小跌落 → 开裂
            └─ 达到目标扭矩 → 合格
\`\`\`

---

## 质量控制建议

### 自动检测系统
- 实时监控曲线形态
- 自动标记异常曲线
- 触发报警和停机机制

### 数据分析
- 批量对比分析
- 计算工艺能力指数(Cpk)
- 趋势分析和预测性维护

### 操作培训
- 识别异常曲线能力
- 理解根本原因
- 掌握快速响应措施

---
**版本**: v2.0.0  
**最后更新**: 2025-12-16  
**作者**: 质量工程师团队`,
        type: 'case',
        category: 1,
        tags: ['故障诊断', '曲线分析', '异常识别', '质量控制'],
        status: 'active',
        author: '质量工程师'
      },
      {
        title: '材质智能识别与工艺参数推荐系统',
        content: `# 材质识别与工艺参数推荐

基于拧紧曲线特征自动识别被连接材质,并给出最优工艺参数建议。

## 识别算法原理

### 核心判别参数
1. **弹性段斜率 (k)**: 反映材料刚度
2. **最大扭矩 (Tmax)**: 反映材料强度
3. **屈服点位置**: 不同材质屈服特性不同
4. **曲线平滑度**: 脆性材料波动大

### 材质特征数据库

---

## 1. 钢质材料 (Steel)

### 识别特征
- **弹性段斜率**: 0.8-1.2 N·m/°
- **屈服点**: 明显,通常在80-120 N·m
- **曲线形态**: 平滑,三段清晰
- **最终扭矩**: 高 (100-200 N·m)

### 材料属性
- **杨氏模量**: ~210 GPa
- **屈服强度**: 250-1000 MPa (根据钢种)
- **延展性**: 优秀
- **摩擦系数**: 0.12-0.18 (干燥) / 0.08-0.12 (润滑)

### 推荐工艺参数
\`\`\`yaml
拧紧策略: 扭矩-转角法
目标扭矩: 120-180 N·m (M10螺栓)
转角控制: 90-120° (从贴合点)
拧紧转速: 60-100 rpm
润滑: 推荐使用MoS₂润滑剂
预紧力系数: 0.75 (屈服强度的75%)
\`\`\`

### 注意事项
- ✓ 钢对钢连接最常见,工艺最成熟
- ✓ 可承受较高扭矩
- ⚠️ 注意防锈处理
- ⚠️ 高强度钢易发生延迟断裂

---

## 2. 铝合金 (Aluminum Alloy)

### 识别特征
- **弹性段斜率**: 0.3-0.5 N·m/° (低于钢)
- **屈服点**: 不明显或较早出现
- **曲线形态**: 相对平滑但斜率小
- **最终扭矩**: 中等 (40-80 N·m)

### 材料属性
- **杨氏模量**: ~70 GPa (钢的1/3)
- **屈服强度**: 100-500 MPa
- **延展性**: 良好
- **摩擦系数**: 0.15-0.25 (易粘连)

### 推荐工艺参数
\`\`\`yaml
拧紧策略: 转角法或扭矩法(低扭矩)
目标扭矩: 40-60 N·m (M10螺栓)
转角控制: 60-90° (从贴合点)
拧紧转速: 40-80 rpm (慢速)
润滑: 必须使用,防止粘连
预紧力系数: 0.60 (屈服强度的60%)
\`\`\`

### 注意事项
- ⚠️ 极易压溃,严格控制扭矩上限
- ⚠️ 铝合金螺纹容易滑牙
- ✓ 使用钢螺栓+铝螺母组合
- ✓ 推荐使用更大接触面积的垫圈
- ⚠️ 热膨胀系数大,温度变化影响预紧力

---

## 3. 塑料/复合材料 (Plastic/Composite)

### 识别特征
- **弹性段斜率**: 0.1-0.3 N·m/° (很低)
- **屈服点**: 无明显屈服点
- **曲线形态**: 渐进上升,可能有蠕变
- **最终扭矩**: 低 (5-30 N·m)

### 材料属性
- **杨氏模量**: 2-10 GPa (钢的1/20)
- **屈服强度**: 30-150 MPa
- **蠕变**: 显著,预紧力会衰减
- **摩擦系数**: 0.2-0.4 (高)

### 推荐工艺参数
\`\`\`yaml
拧紧策略: 低扭矩法
目标扭矩: 5-20 N·m (M6螺栓)
转角控制: 不推荐(材料蠕变)
拧紧转速: 20-40 rpm (慢速,防止发热)
润滑: 通常不需要
预紧力系数: 0.40 (屈服强度的40%)
\`\`\`

### 注意事项
- ⚠️ 极低扭矩,防止开裂
- ⚠️ 蠕变严重,需定期复紧
- ✓ 使用自攻螺钉或镶嵌件
- ✓ 大面积垫圈分散应力
- ⚠️ 温度敏感,避免高速拧紧产生热量

---

## 4. 铸铁 (Cast Iron)

### 识别特征
- **弹性段斜率**: 0.5-0.7 N·m/°
- **屈服点**: 不明显(脆性断裂)
- **曲线形态**: 可能有微小裂纹导致的跌落
- **最终扭矩**: 中等 (60-100 N·m)

### 材料属性
- **杨氏模量**: 100-180 GPa
- **抗拉强度**: 150-400 MPa (低)
- **延展性**: 差,脆性材料
- **摩擦系数**: 0.15-0.20

### 推荐工艺参数
\`\`\`yaml
拧紧策略: 扭矩法(保守)
目标扭矩: 60-80 N·m (M10螺栓)
转角控制: 不推荐(易开裂)
拧紧转速: 30-60 rpm (慢速,防止冲击)
润滑: 推荐使用
预紧力系数: 0.50 (抗拉强度的50%)
\`\`\`

### 注意事项
- ⚠️ 脆性材料,禁止冲击拧紧
- ⚠️ 孔边缘易开裂,必须倒角
- ✓ 使用柔性垫圈缓冲
- ⚠️ 避免重复拧紧(疲劳开裂)

---

## 5. 复合材料层压板 (CFRP/GFRP)

### 识别特征
- **弹性段斜率**: 0.2-0.6 N·m/° (各向异性)
- **屈服点**: 无明显屈服,可能突然分层
- **曲线形态**: 不规则,可能有台阶
- **最终扭矩**: 低到中等 (20-60 N·m)

### 材料属性
- **杨氏模量**: 10-150 GPa (各向异性)
- **抗拉强度**: 500-2000 MPa (纤维方向)
- **层间剪切强度**: 50-100 MPa (薄弱)
- **摩擦系数**: 0.2-0.3

### 推荐工艺参数
\`\`\`yaml
拧紧策略: 扭矩法+监控曲线
目标扭矩: 20-50 N·m (M8螺栓)
转角控制: 不推荐
拧紧转速: 20-40 rpm (防止分层)
润滑: 不需要
预紧力系数: 0.30 (层间剪切强度的30%)
\`\`\`

### 注意事项
- ⚠️ 极易分层失效
- ✓ 使用大面积垫圈或夹板
- ⚠️ 孔加工质量要求极高
- ✓ 推荐使用特殊复合材料专用紧固件

---

## 智能识别算法

### 决策树算法
\`\`\`python
def identify_material(curve_data):
    elastic_slope = calculate_slope(curve_data, phase=2)
    max_torque = max(curve_data['torque'])
    smoothness = calculate_smoothness(curve_data)
    
    if elastic_slope > 0.8:
        return "钢质材料"
    elif 0.5 < elastic_slope <= 0.8:
        if max_torque > 80:
            return "钢质材料(低碳钢)"
        else:
            return "铸铁"
    elif 0.3 < elastic_slope <= 0.5:
        return "铝合金"
    elif 0.2 < elastic_slope <= 0.3:
        if smoothness < 0.9:
            return "复合材料"
        else:
            return "塑料"
    else:
        return "塑料/软质材料"
\`\`\`

### 机器学习模型(未来方向)
- 使用SVM或神经网络
- 训练数据: 10000+标注曲线
- 准确率目标: >95%

---

## 工艺参数优化建议

### 通用原则
1. **宁低勿高**: 不确定时选择保守扭矩
2. **逐步加载**: 分两次拧紧,第二次达到目标
3. **监控曲线**: 实时检测异常
4. **定期校准**: 拧紧工具每季度校准

### 多材料组合
\`\`\`
组合              推荐策略             目标扭矩
───────────────────────────────────────────
钢-钢             扭矩-转角法           100%标准值
钢-铝             扭矩法(低限)          60%标准值
钢-塑料           低扭矩法              30%标准值
铝-铝             转角法                70%标准值
复合材料-任意      扭矩法+监控           40%标准值
\`\`\`

---
**版本**: v2.0.0  
**最后更新**: 2025-12-16  
**作者**: 材料工程师 & AI算法团队`,
        type: 'specification',
        category: 1,
        tags: ['材质识别', '智能诊断', '工艺参数', '拧紧曲线'],
        status: 'active',
        author: '材料工程师'
      }
    ]
    
    demoKnowledge.forEach(k => this.addKnowledge(k))
    
    console.log('演示数据初始化完成(包含拧紧曲线专业知识)')
  }
}

// 初始化时加载数据
actions.loadFromLocalStorage()

// 导出
export const useKnowledgeBase = () => {
  return {
    state,
    // 直接导出 state 中的属性，方便组件解构
    categories: state.categories,
    tags: state.tags,
    auditLogs: state.auditLogs,
    statistics: state.statistics,
    knowledgeEntries: state.knowledgeEntries,
    searchHistory: state.searchHistory,
    ...getters,
    ...actions
  }
}

export default useKnowledgeBase
