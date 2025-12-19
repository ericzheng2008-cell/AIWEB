import { defineStore } from 'pinia'

export const useProductsServicesStore = defineStore('productsServices', {
  state: () => ({
    // 一级分类（与导航栏保持一致的6个子系统）
    level1Categories: JSON.parse(localStorage.getItem('productsLevel1') || JSON.stringify([
      {
        id: 1,
        name: { 'zh-CN': '电动工具', 'en-US': 'Electric Tools' },
        description: { 'zh-CN': '专业电动拧紧工具、电动螺丝刀等', 'en-US': 'Professional electric tightening tools, electric screwdrivers, etc.' },
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600',
        icon: 'Lightning',
        order: 1,
        visible: true
      },
      {
        id: 2,
        name: { 'zh-CN': '气动工具', 'en-US': 'Pneumatic Tools' },
        description: { 'zh-CN': '气动拧紧工具、气动扳手、气动螺丝刀等', 'en-US': 'Pneumatic tightening tools, pneumatic wrenches, pneumatic screwdrivers, etc.' },
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600',
        icon: 'Wind',
        order: 2,
        visible: true
      },
      {
        id: 3,
        name: { 'zh-CN': '手动工具', 'en-US': 'Manual Tools' },
        description: { 'zh-CN': '扭力扳手、手动拧紧工具、套筒等', 'en-US': 'Torque wrenches, manual tightening tools, sockets, etc.' },
        image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600',
        icon: 'Tools',
        order: 3,
        visible: true
      },
      {
        id: 4,
        name: { 'zh-CN': '测量工具', 'en-US': 'Measurement Tools' },
        description: { 'zh-CN': '扭力测试仪、角度测量仪、传感器等', 'en-US': 'Torque testers, angle measuring instruments, sensors, etc.' },
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600',
        icon: 'DataAnalysis',
        order: 4,
        visible: true
      },
      {
        id: 5,
        name: { 'zh-CN': '自动化系统', 'en-US': 'Automated Systems' },
        description: { 'zh-CN': '自动拧紧系统、装配线、工作站等', 'en-US': 'Automatic tightening systems, assembly lines, workstations, etc.' },
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600',
        icon: 'Monitor',
        order: 5,
        visible: true
      },
      {
        id: 6,
        name: { 'zh-CN': '智能解决方案', 'en-US': 'Smart Solutions' },
        description: { 'zh-CN': '数据采集、MES系统、AI分析等', 'en-US': 'Data collection, MES systems, AI analysis, etc.' },
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600',
        icon: 'Management',
        order: 6,
        visible: true
      }
    ])),
    
    // 二级分类
    level2Categories: JSON.parse(localStorage.getItem('productsLevel2') || JSON.stringify([
      // 电动工具的二级分类
      { id: 101, parentId: 1, name: { 'zh-CN': '电动拧紧工具', 'en-US': 'Electric Tightening Tools' }, description: { 'zh-CN': '专业电动拧紧解决方案', 'en-US': 'Professional electric tightening solutions' }, order: 1, visible: true },
      { id: 102, parentId: 1, name: { 'zh-CN': '电动螺丝刀', 'en-US': 'Electric Screwdrivers' }, description: { 'zh-CN': '高效装配电动螺丝刀', 'en-US': 'Efficient assembly electric screwdrivers' }, order: 2, visible: true },
      
      // 气动工具的二级分类
      { id: 201, parentId: 2, name: { 'zh-CN': '气动拧紧工具', 'en-US': 'Pneumatic Tightening Tools' }, description: { 'zh-CN': '可靠的气动拧紧方案', 'en-US': 'Reliable pneumatic tightening solutions' }, order: 1, visible: true },
      { id: 202, parentId: 2, name: { 'zh-CN': '气动打磨工具', 'en-US': 'Pneumatic Grinding Tools' }, description: { 'zh-CN': '专业气动打磨设备', 'en-US': 'Professional pneumatic grinding equipment' }, order: 2, visible: true },
      
      // 手动工具的二级分类
      { id: 301, parentId: 3, name: { 'zh-CN': '扭力扳手', 'en-US': 'Torque Wrenches' }, description: { 'zh-CN': '精密扭力控制扳手', 'en-US': 'Precision torque control wrenches' }, order: 1, visible: true },
      { id: 302, parentId: 3, name: { 'zh-CN': '套筒工具', 'en-US': 'Socket Tools' }, description: { 'zh-CN': '高强度套筒系列', 'en-US': 'High-strength socket series' }, order: 2, visible: true },
      
      // 测量工具的二级分类
      { id: 401, parentId: 4, name: { 'zh-CN': '扭力测试仪', 'en-US': 'Torque Testers' }, description: { 'zh-CN': '高精度扭力测量设备', 'en-US': 'High-precision torque measuring equipment' }, order: 1, visible: true },
      { id: 402, parentId: 4, name: { 'zh-CN': '传感器', 'en-US': 'Sensors' }, description: { 'zh-CN': '工业级传感器解决方案', 'en-US': 'Industrial-grade sensor solutions' }, order: 2, visible: true },
      
      // 自动化系统的二级分类
      { id: 501, parentId: 5, name: { 'zh-CN': '自动拧紧系统', 'en-US': 'Automatic Tightening Systems' }, description: { 'zh-CN': '全自动拧紧装配线', 'en-US': 'Fully automatic tightening assembly lines' }, order: 1, visible: true },
      { id: 502, parentId: 5, name: { 'zh-CN': '装配工作站', 'en-US': 'Assembly Workstations' }, description: { 'zh-CN': '智能装配工作站', 'en-US': 'Intelligent assembly workstations' }, order: 2, visible: true },
      
      // 智能解决方案的二级分类
      { id: 601, parentId: 6, name: { 'zh-CN': '数据采集系统', 'en-US': 'Data Collection Systems' }, description: { 'zh-CN': '拧紧数据实时采集', 'en-US': 'Real-time tightening data collection' }, order: 1, visible: true },
      { id: 602, parentId: 6, name: { 'zh-CN': 'MES系统', 'en-US': 'MES Systems' }, description: { 'zh-CN': '制造执行系统', 'en-US': 'Manufacturing execution systems' }, order: 2, visible: true }
    ])),
    
    // 三级分类
    level3Categories: JSON.parse(localStorage.getItem('productsLevel3') || JSON.stringify([
      // 电动拧紧工具的三级分类
      { id: 10101, parentId: 101, name: { 'zh-CN': '直柄电动拧紧工具', 'en-US': 'Straight Electric Tools' }, description: { 'zh-CN': '适用于直接拧紧场景', 'en-US': 'Suitable for direct tightening scenarios' }, order: 1, visible: true },
      { id: 10102, parentId: 101, name: { 'zh-CN': '角向电动拧紧工具', 'en-US': 'Angle Electric Tools' }, description: { 'zh-CN': '适用于狭窄空间', 'en-US': 'Suitable for narrow spaces' }, order: 2, visible: true },
      
      // 气动拧紧工具的三级分类
      { id: 20101, parentId: 201, name: { 'zh-CN': '直柄气动拧紧工具', 'en-US': 'Straight Pneumatic Tools' }, description: { 'zh-CN': '标准气动拧紧', 'en-US': 'Standard pneumatic tightening' }, order: 1, visible: true },
      { id: 20102, parentId: 201, name: { 'zh-CN': '角向气动拧紧工具', 'en-US': 'Angle Pneumatic Tools' }, description: { 'zh-CN': '角向气动拧紧', 'en-US': 'Angle pneumatic tightening' }, order: 2, visible: true },
      
      // 扭力扳手的三级分类
      { id: 30101, parentId: 301, name: { 'zh-CN': '预置式扭力扳手', 'en-US': 'Preset Torque Wrenches' }, description: { 'zh-CN': '预设扭力值', 'en-US': 'Preset torque value' }, order: 1, visible: true },
      { id: 30102, parentId: 301, name: { 'zh-CN': '数显扭力扳手', 'en-US': 'Digital Torque Wrenches' }, description: { 'zh-CN': '数字显示扭力', 'en-US': 'Digital torque display' }, order: 2, visible: true }
    ])),
    
    // 具体产品
    products: JSON.parse(localStorage.getItem('productsData') || JSON.stringify([])),
    
    // 分类横幅
    categoryBanners: JSON.parse(localStorage.getItem('categoryBanners') || JSON.stringify([]))
  }),
  
  getters: {
    // 获取可见的一级分类（按order排序）
    visibleLevel1Categories: (state) => {
      return state.level1Categories
        .filter(cat => cat.visible)
        .sort((a, b) => a.order - b.order)
    },
    
    // 获取指定一级分类下的二级分类
    getLevel2Categories: (state) => (parentId) => {
      return state.level2Categories
        .filter(cat => cat.parentId === parentId && cat.visible)
        .sort((a, b) => a.order - b.order)
    },
    
    // 获取指定二级分类下的三级分类
    getLevel3Categories: (state) => (parentId) => {
      return state.level3Categories
        .filter(cat => cat.parentId === parentId && cat.visible)
        .sort((a, b) => a.order - b.order)
    },
    
    // 获取指定分类下的产品
    getProductsByCategory: (state) => (categoryId, level = 1) => {
      return state.products.filter(p => {
        if (level === 1) return p.level1CategoryId === categoryId
        if (level === 2) return p.level2CategoryId === categoryId
        if (level === 3) return p.level3CategoryId === categoryId
        return false
      })
    }
  },
  
  actions: {
    // ========== 一级分类管理 ==========
    addLevel1Category(category) {
      const maxId = Math.max(...this.level1Categories.map(c => c.id), 0)
      const maxOrder = Math.max(...this.level1Categories.map(c => c.order), 0)
      category.id = maxId + 1
      category.order = category.order || maxOrder + 1
      category.visible = category.visible !== false
      this.level1Categories.push(category)
      this.saveLevel1Categories()
    },
    
    updateLevel1Category(category) {
      const index = this.level1Categories.findIndex(c => c.id === category.id)
      if (index !== -1) {
        this.level1Categories[index] = category
        this.saveLevel1Categories()
      }
    },
    
    deleteLevel1Category(id) {
      // 删除相关的二级、三级分类和产品
      this.level2Categories = this.level2Categories.filter(cat => cat.parentId !== id)
      this.products = this.products.filter(p => p.level1CategoryId !== id)
      this.level1Categories = this.level1Categories.filter(c => c.id !== id)
      
      this.saveLevel1Categories()
      this.saveLevel2Categories()
      this.saveProducts()
    },
    
    saveLevel1Categories() {
      localStorage.setItem('productsLevel1', JSON.stringify(this.level1Categories))
    },
    
    // ========== 二级分类管理 ==========
    addLevel2Category(category) {
      const maxId = Math.max(...this.level2Categories.map(c => c.id), 0)
      const maxOrder = Math.max(...this.level2Categories.filter(c => c.parentId === category.parentId).map(c => c.order), 0)
      category.id = maxId + 1
      category.order = category.order || maxOrder + 1
      category.visible = category.visible !== false
      this.level2Categories.push(category)
      this.saveLevel2Categories()
    },
    
    updateLevel2Category(category) {
      const index = this.level2Categories.findIndex(c => c.id === category.id)
      if (index !== -1) {
        this.level2Categories[index] = category
        this.saveLevel2Categories()
      }
    },
    
    deleteLevel2Category(id) {
      this.level3Categories = this.level3Categories.filter(cat => cat.parentId !== id)
      this.products = this.products.filter(p => p.level2CategoryId !== id)
      this.level2Categories = this.level2Categories.filter(c => c.id !== id)
      
      this.saveLevel2Categories()
      this.saveLevel3Categories()
      this.saveProducts()
    },
    
    saveLevel2Categories() {
      localStorage.setItem('productsLevel2', JSON.stringify(this.level2Categories))
    },
    
    // ========== 三级分类管理 ==========
    addLevel3Category(category) {
      const maxId = Math.max(...this.level3Categories.map(c => c.id), 0)
      const maxOrder = Math.max(...this.level3Categories.filter(c => c.parentId === category.parentId).map(c => c.order), 0)
      category.id = maxId + 1
      category.order = category.order || maxOrder + 1
      category.visible = category.visible !== false
      this.level3Categories.push(category)
      this.saveLevel3Categories()
    },
    
    updateLevel3Category(category) {
      const index = this.level3Categories.findIndex(c => c.id === category.id)
      if (index !== -1) {
        this.level3Categories[index] = category
        this.saveLevel3Categories()
      }
    },
    
    deleteLevel3Category(id) {
      this.products = this.products.filter(p => p.level3CategoryId !== id)
      this.level3Categories = this.level3Categories.filter(c => c.id !== id)
      
      this.saveLevel3Categories()
      this.saveProducts()
    },
    
    saveLevel3Categories() {
      localStorage.setItem('productsLevel3', JSON.stringify(this.level3Categories))
    },
    
    // ========== 产品管理 ==========
    addProduct(product) {
      const maxId = Math.max(...this.products.map(p => p.id), 0)
      product.id = maxId + 1
      product.images = product.images || []
      this.products.push(product)
      this.saveProducts()
    },
    
    updateProduct(product) {
      const index = this.products.findIndex(p => p.id === product.id)
      if (index !== -1) {
        this.products[index] = product
        this.saveProducts()
      }
    },
    
    deleteProduct(id) {
      this.products = this.products.filter(p => p.id !== id)
      this.saveProducts()
    },
    
    saveProducts() {
      localStorage.setItem('productsData', JSON.stringify(this.products))
    },
    
    // ========== 横幅管理 ==========
    addCategoryBanner(banner) {
      const maxId = Math.max(...this.categoryBanners.map(b => b.id), 0)
      banner.id = maxId + 1
      this.categoryBanners.push(banner)
      this.saveCategoryBanners()
    },
    
    updateCategoryBanner(banner) {
      const index = this.categoryBanners.findIndex(b => b.id === banner.id)
      if (index !== -1) {
        this.categoryBanners[index] = banner
        this.saveCategoryBanners()
      }
    },
    
    deleteCategoryBanner(id) {
      this.categoryBanners = this.categoryBanners.filter(b => b.id !== id)
      this.saveCategoryBanners()
    },
    
    saveCategoryBanners() {
      localStorage.setItem('categoryBanners', JSON.stringify(this.categoryBanners))
    },
    
    // ========== 加载数据 ==========
    loadData() {
      // 数据已在state中通过localStorage加载，这里可以做一些初始化工作
      console.log('产品与服务数据已加载')
    }
  }
})
