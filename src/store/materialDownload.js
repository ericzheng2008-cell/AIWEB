import { defineStore } from 'pinia'

export const useMaterialDownloadStore = defineStore('materialDownload', {
  state: () => ({
    // 资料分类（与产品分类对应）
    categories: JSON.parse(localStorage.getItem('materialCategories') || JSON.stringify([
      {
        id: 1,
        name: { 'zh-CN': '电动工具资料', 'en-US': 'Electric Tools Materials' },
        description: { 'zh-CN': '电动拧紧工具相关资料', 'en-US': 'Electric tightening tools related materials' },
        order: 1,
        visible: true
      },
      {
        id: 2,
        name: { 'zh-CN': '气动工具资料', 'en-US': 'Pneumatic Tools Materials' },
        description: { 'zh-CN': '气动拧紧工具相关资料', 'en-US': 'Pneumatic tightening tools related materials' },
        order: 2,
        visible: true
      },
      {
        id: 3,
        name: { 'zh-CN': '手动工具资料', 'en-US': 'Manual Tools Materials' },
        description: { 'zh-CN': '手动拧紧工具相关资料', 'en-US': 'Manual tightening tools related materials' },
        order: 3,
        visible: true
      },
      {
        id: 4,
        name: { 'zh-CN': '测量工具资料', 'en-US': 'Measurement Tools Materials' },
        description: { 'zh-CN': '测量设备相关资料', 'en-US': 'Measurement equipment related materials' },
        order: 4,
        visible: true
      },
      {
        id: 5,
        name: { 'zh-CN': '自动化系统资料', 'en-US': 'Automation Systems Materials' },
        description: { 'zh-CN': '自动化系统相关资料', 'en-US': 'Automation systems related materials' },
        order: 5,
        visible: true
      },
      {
        id: 6,
        name: { 'zh-CN': '智能解决方案资料', 'en-US': 'Smart Solutions Materials' },
        description: { 'zh-CN': '智能解决方案相关资料', 'en-US': 'Smart solutions related materials' },
        order: 6,
        visible: true
      }
    ])),
    
    // 资料列表
    materials: JSON.parse(localStorage.getItem('materialsList') || JSON.stringify([
      // 电动工具资料示例
      {
        id: 1,
        categoryId: 1,
        title: { 'zh-CN': '电动拧紧工具产品手册', 'en-US': 'Electric Tightening Tools Product Manual' },
        description: { 'zh-CN': '详细介绍电动拧紧工具的规格、参数和使用方法', 'en-US': 'Detailed introduction to the specifications, parameters and usage of electric tightening tools' },
        type: 'manual', // manual(手册), technical(技术资料), whitepaper(白皮书), other(其他)
        fileType: 'pdf',
        fileUrl: '/materials/electric-tools-manual.pdf',
        fileSize: '2.5 MB',
        thumbnailUrl: '/images/electric-tools-cover.jpg',
        downloadCount: 0,
        order: 1,
        visible: true,
        createdAt: '2025-12-21',
        updatedAt: '2025-12-21'
      },
      {
        id: 2,
        categoryId: 1,
        title: { 'zh-CN': '电动工具技术白皮书', 'en-US': 'Electric Tools Technical Whitepaper' },
        description: { 'zh-CN': '电动拧紧技术原理与应用案例', 'en-US': 'Electric tightening technology principles and application cases' },
        type: 'whitepaper',
        fileType: 'pdf',
        fileUrl: '/materials/electric-tools-whitepaper.pdf',
        fileSize: '5.8 MB',
        thumbnailUrl: '/images/whitepaper-cover.jpg',
        downloadCount: 0,
        order: 2,
        visible: true,
        createdAt: '2025-12-21',
        updatedAt: '2025-12-21'
      },
      // 气动工具资料示例
      {
        id: 3,
        categoryId: 2,
        title: { 'zh-CN': '气动拧紧工具选型指南', 'en-US': 'Pneumatic Tightening Tools Selection Guide' },
        description: { 'zh-CN': '气动拧紧工具选型方法和技术参数对照表', 'en-US': 'Pneumatic tightening tools selection methods and technical parameter comparison table' },
        type: 'technical',
        fileType: 'pdf',
        fileUrl: '/materials/pneumatic-selection-guide.pdf',
        fileSize: '3.2 MB',
        thumbnailUrl: '/images/pneumatic-guide-cover.jpg',
        downloadCount: 0,
        order: 1,
        visible: true,
        createdAt: '2025-12-21',
        updatedAt: '2025-12-21'
      }
    ])),
    
    // 下载记录（用于统计和权限控制）
    downloadRecords: JSON.parse(localStorage.getItem('materialDownloadRecords') || '[]'),
    
    // 用户注册记录（用于索取报价）
    userRegistrations: JSON.parse(localStorage.getItem('userRegistrations') || '[]')
  }),
  
  getters: {
    // 获取可见的分类
    visibleCategories: (state) => {
      return state.categories.filter(c => c.visible).sort((a, b) => a.order - b.order)
    },
    
    // 根据分类获取资料
    getMaterialsByCategory: (state) => (categoryId) => {
      return state.materials
        .filter(m => m.categoryId === categoryId && m.visible)
        .sort((a, b) => a.order - b.order)
    },
    
    // 根据类型获取资料
    getMaterialsByType: (state) => (type) => {
      return state.materials
        .filter(m => m.type === type && m.visible)
        .sort((a, b) => a.order - b.order)
    },
    
    // 获取所有可见资料
    visibleMaterials: (state) => {
      return state.materials.filter(m => m.visible).sort((a, b) => a.order - b.order)
    },
    
    // 获取下载次数统计
    getDownloadStats: (state) => {
      const stats = {}
      state.materials.forEach(material => {
        stats[material.id] = {
          title: material.title,
          count: material.downloadCount || 0
        }
      })
      return stats
    }
  },
  
  actions: {
    // 添加分类
    addCategory(category) {
      const newCategory = {
        ...category,
        id: Date.now(),
        order: this.categories.length + 1,
        visible: true
      }
      this.categories.push(newCategory)
      this.saveCategories()
      return newCategory
    },
    
    // 更新分类
    updateCategory(id, updates) {
      const index = this.categories.findIndex(c => c.id === id)
      if (index > -1) {
        this.categories[index] = { ...this.categories[index], ...updates }
        this.saveCategories()
        return this.categories[index]
      }
      return null
    },
    
    // 删除分类
    deleteCategory(id) {
      const index = this.categories.findIndex(c => c.id === id)
      if (index > -1) {
        this.categories.splice(index, 1)
        this.saveCategories()
        return true
      }
      return false
    },
    
    // 添加资料
    addMaterial(material) {
      const newMaterial = {
        ...material,
        id: Date.now(),
        downloadCount: 0,
        order: this.materials.filter(m => m.categoryId === material.categoryId).length + 1,
        visible: true,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      }
      this.materials.push(newMaterial)
      this.saveMaterials()
      return newMaterial
    },
    
    // 更新资料
    updateMaterial(id, updates) {
      const index = this.materials.findIndex(m => m.id === id)
      if (index > -1) {
        this.materials[index] = { 
          ...this.materials[index], 
          ...updates,
          updatedAt: new Date().toISOString().split('T')[0]
        }
        this.saveMaterials()
        return this.materials[index]
      }
      return null
    },
    
    // 删除资料
    deleteMaterial(id) {
      const index = this.materials.findIndex(m => m.id === id)
      if (index > -1) {
        this.materials.splice(index, 1)
        this.saveMaterials()
        return true
      }
      return false
    },
    
    // 记录下载
    recordDownload(materialId, userInfo) {
      const material = this.materials.find(m => m.id === materialId)
      if (material) {
        material.downloadCount = (material.downloadCount || 0) + 1
        
        const record = {
          id: Date.now(),
          materialId,
          materialTitle: material.title,
          userInfo,
          downloadedAt: new Date().toISOString()
        }
        this.downloadRecords.push(record)
        
        this.saveMaterials()
        this.saveDownloadRecords()
        return true
      }
      return false
    },
    
    // 用户注册
    registerUser(userInfo) {
      const registration = {
        id: Date.now(),
        ...userInfo,
        registeredAt: new Date().toISOString(),
        status: 'pending' // pending(待处理), contacted(已联系), completed(已完成)
      }
      this.userRegistrations.push(registration)
      this.saveUserRegistrations()
      return registration
    },
    
    // 更新注册状态
    updateRegistrationStatus(id, status) {
      const index = this.userRegistrations.findIndex(r => r.id === id)
      if (index > -1) {
        this.userRegistrations[index].status = status
        this.userRegistrations[index].updatedAt = new Date().toISOString()
        this.saveUserRegistrations()
        return true
      }
      return false
    },
    
    // 保存到localStorage
    saveCategories() {
      localStorage.setItem('materialCategories', JSON.stringify(this.categories))
    },
    
    saveMaterials() {
      localStorage.setItem('materialsList', JSON.stringify(this.materials))
    },
    
    saveDownloadRecords() {
      localStorage.setItem('materialDownloadRecords', JSON.stringify(this.downloadRecords))
    },
    
    saveUserRegistrations() {
      localStorage.setItem('userRegistrations', JSON.stringify(this.userRegistrations))
    }
  }
})
