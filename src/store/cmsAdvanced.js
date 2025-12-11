import { defineStore } from 'pinia'

export const useCmsAdvancedStore = defineStore('cmsAdvanced', {
  state: () => ({
    // 网站配置
    siteConfig: JSON.parse(localStorage.getItem('siteConfig') || JSON.stringify({
      logo: '',
      companyName: {
        'zh-CN': '明升伟业',
        'en-US': 'Mingsheng'
      },
      slogan: {
        'zh-CN': '专业工业工具供应商',
        'en-US': 'Professional Industrial Tools Supplier'
      },
      // 顶部联系信息
      topContact: {
        hotline: '400-123-4567',
        email: 'sales@mingsheng.com'
      }
    })),
    
    // 页脚配置
    footerConfig: JSON.parse(localStorage.getItem('footerConfig') || JSON.stringify({
      companyInfo: {
        name: { 'zh-CN': '明升伟业', 'en-US': 'Mingsheng' },
        description: {
          'zh-CN': '广州市明升伟业机电有限公司成立于1996年，是一家集科研开发、生产制造、销售服务为一体的现代化科技企业。专业于各类欧美高端工业用电动工具、气动工具和手动工具。',
          'en-US': 'Guangzhou Mingsheng Mechanical and Electrical Co., Ltd. was founded in 1996. It is a modern technology enterprise integrating R&D, manufacturing, sales and service. Professional in various European and American high-end industrial power tools, pneumatic tools and hand tools.'
        },
        certifications: ['ISO9000', 'QS9000', 'IATF16949']
      },
      contact: {
        phone: '400-123-4567',
        email: 'sales@mingsheng.com',
        address: {
          'zh-CN': '广州市珠江三角洲',
          'en-US': 'Pearl River Delta, Guangzhou'
        }
      },
      serviceCities: {
        'zh-CN': '广州 · 长沙 · 株洲 · 柳州 · 武汉 · 杭州 · 上海',
        'en-US': 'Guangzhou · Changsha · Zhuzhou · Liuzhou · Wuhan · Hangzhou · Shanghai'
      },
      copyright: {
        'zh-CN': '1996-2024 广州市明升伟业机电有限公司. 粤ICP备xxxxxxxx号',
        'en-US': '1996-2024 Guangzhou Mingsheng Mechanical and Electrical Co., Ltd. All rights reserved.'
      }
    })),
    
    // 事业部
    divisions: JSON.parse(localStorage.getItem('divisionsAdvanced') || JSON.stringify([
      {
        id: 1,
        key: 'assembly',
        name: { 'zh-CN': '工业智能装配事业部', 'en-US': 'Industrial Intelligent Assembly Division' },
        description: { 'zh-CN': '专注于工业智能装配系统与解决方案', 'en-US': 'Focus on industrial intelligent assembly systems and solutions' },
        icon: 'Connection',
        productCategories: [] // 关联的产品大类ID
      },
      {
        id: 2,
        key: 'production',
        name: { 'zh-CN': '工业智能智造事业部', 'en-US': 'Industrial Intelligent Production Division' },
        description: { 'zh-CN': '提供工业智能制造设备与自动化方案', 'en-US': 'Provide industrial intelligent manufacturing equipment and automation solutions' },
        icon: 'Setting',
        productCategories: []
      },
      {
        id: 3,
        key: 'oem',
        name: { 'zh-CN': '工业配套事业部', 'en-US': 'Industry OEM Division' },
        description: { 'zh-CN': '工业配套产品与零部件供应', 'en-US': 'Industrial supporting products and parts supply' },
        icon: 'Box',
        productCategories: []
      },
      {
        id: 4,
        key: 'power',
        name: { 'zh-CN': '动力装配事业部', 'en-US': 'Power Assembly Division' },
        description: { 'zh-CN': '动力装配系统与工具解决方案', 'en-US': 'Power assembly system and tool solutions' },
        icon: 'Cpu',
        productCategories: []
      },
      {
        id: 5,
        key: 'auto',
        name: { 'zh-CN': '汽车部件事业部', 'en-US': 'Automobile Parts Division' },
        description: { 'zh-CN': '汽车零部件制造与装配服务', 'en-US': 'Automobile parts manufacturing and assembly services' },
        icon: 'Van',
        productCategories: []
      },
      {
        id: 6,
        key: 'tech',
        name: { 'zh-CN': '明升科技事业部', 'en-US': 'Mingsheng Technology Division' },
        description: { 'zh-CN': '明升科技创新与研发中心', 'en-US': 'Mingsheng Technology Innovation and R&D Center' },
        icon: 'Monitor',
        productCategories: []
      },
      {
        id: 7,
        key: 'tools',
        name: { 'zh-CN': '刀具油品事业部', 'en-US': 'Oils and Cutting Tools Division' },
        description: { 'zh-CN': '刀具与油品专业供应服务', 'en-US': 'Professional supply service for cutting tools and oils' },
        icon: 'Tools',
        productCategories: []
      },
      {
        id: 8,
        key: 'marketing',
        name: { 'zh-CN': '网营事业部', 'en-US': 'Network Marketing Division' },
        description: { 'zh-CN': '网络营销与电子商务平台', 'en-US': 'Network marketing and e-commerce platform' },
        icon: 'Promotion',
        productCategories: []
      }
    ])),
    
    // 产品大类（1级分类）
    productCategories: JSON.parse(localStorage.getItem('productCategories') || JSON.stringify([
      {
        id: 1,
        name: { 'zh-CN': '自动化设备', 'en-US': 'Automation Equipment' },
        description: { 'zh-CN': 'SCA自动涂胶机、SPR FDS整机、Gudel七轴机器人等', 'en-US': 'SCA automatic gluing machine, SPR FDS complete machine, Gudel seven-axis robot' },
        image: '',
        subCategories: [] // 2级分类
      }
    ])),
    
    // 产品2级分类
    productSubCategories: JSON.parse(localStorage.getItem('productSubCategories') || JSON.stringify([])),
    
    // 产品3级分类
    productThirdCategories: JSON.parse(localStorage.getItem('productThirdCategories') || JSON.stringify([])),
    
    // 产品4级分类
    productFourthCategories: JSON.parse(localStorage.getItem('productFourthCategories') || JSON.stringify([])),
    
    // 具体产品
    products: JSON.parse(localStorage.getItem('productsAdvanced') || JSON.stringify([]))
  }),
  
  getters: {
    // 获取事业部的产品大类
    getDivisionCategories: (state) => (divisionId) => {
      const division = state.divisions.find(d => d.id === divisionId)
      if (!division) return []
      return state.productCategories.filter(cat => 
        division.productCategories.includes(cat.id)
      )
    },
    
    // 获取大类的2级分类
    getSubCategories: (state) => (categoryId) => {
      return state.productSubCategories.filter(sub => sub.parentId === categoryId)
    },
    
    // 获取2级分类的3级分类
    getThirdCategories: (state) => (subCategoryId) => {
      return state.productThirdCategories.filter(third => third.parentId === subCategoryId)
    },
    
    // 获取3级分类的4级分类
    getFourthCategories: (state) => (thirdCategoryId) => {
      return state.productFourthCategories.filter(fourth => fourth.parentId === thirdCategoryId)
    },
    
    // 获取分类下的产品
    getCategoryProducts: (state) => (categoryId, level = 1) => {
      return state.products.filter(p => {
        if (level === 1) return p.categoryId === categoryId
        if (level === 2) return p.subCategoryId === categoryId
        if (level === 3) return p.thirdCategoryId === categoryId
        if (level === 4) return p.fourthCategoryId === categoryId
        return false
      })
    }
  },
  
  actions: {
    // ========== 网站配置 ==========
    updateLogo(logo) {
      this.siteConfig.logo = logo
      this.saveSiteConfig()
    },
    
    updateCompanyName(name, locale) {
      this.siteConfig.companyName[locale] = name
      this.saveSiteConfig()
    },
    
    updateSlogan(slogan, locale) {
      this.siteConfig.slogan[locale] = slogan
      this.saveSiteConfig()
    },
    
    saveSiteConfig() {
      localStorage.setItem('siteConfig', JSON.stringify(this.siteConfig))
    },
    
    updateTopContact(contact) {
      this.siteConfig.topContact = { ...contact }
      this.saveSiteConfig()
    },
    
    saveFooterConfig() {
      localStorage.setItem('footerConfig', JSON.stringify(this.footerConfig))
    },
    
    updateFooterConfig(config) {
      this.footerConfig = { ...this.footerConfig, ...config }
      this.saveFooterConfig()
    },
    
    // ========== 事业部管理 ==========
    addDivision(division) {
      const maxId = Math.max(...this.divisions.map(d => d.id), 0)
      division.id = maxId + 1
      division.productCategories = division.productCategories || []
      this.divisions.push(division)
      this.saveDivisions()
    },
    
    updateDivision(division) {
      const index = this.divisions.findIndex(d => d.id === division.id)
      if (index !== -1) {
        this.divisions[index] = division
        this.saveDivisions()
      }
    },
    
    deleteDivision(id) {
      this.divisions = this.divisions.filter(d => d.id !== id)
      this.saveDivisions()
    },
    
    // 关联产品大类到事业部
    linkCategoryToDivision(divisionId, categoryId) {
      const division = this.divisions.find(d => d.id === divisionId)
      if (division && !division.productCategories.includes(categoryId)) {
        division.productCategories.push(categoryId)
        this.saveDivisions()
      }
    },
    
    // 取消关联
    unlinkCategoryFromDivision(divisionId, categoryId) {
      const division = this.divisions.find(d => d.id === divisionId)
      if (division) {
        division.productCategories = division.productCategories.filter(id => id !== categoryId)
        this.saveDivisions()
      }
    },
    
    saveDivisions() {
      localStorage.setItem('divisionsAdvanced', JSON.stringify(this.divisions))
    },
    
    // ========== 产品大类管理（1级）==========
    addProductCategory(category) {
      const maxId = Math.max(...this.productCategories.map(c => c.id), 0)
      category.id = maxId + 1
      category.subCategories = category.subCategories || []
      this.productCategories.push(category)
      this.saveProductCategories()
    },
    
    updateProductCategory(category) {
      const index = this.productCategories.findIndex(c => c.id === category.id)
      if (index !== -1) {
        this.productCategories[index] = category
        this.saveProductCategories()
      }
    },
    
    deleteProductCategory(id) {
      // 删除相关的2级、3级分类和产品
      this.productSubCategories = this.productSubCategories.filter(sub => sub.parentId !== id)
      this.productThirdCategories = this.productThirdCategories.filter(third => {
        const sub = this.productSubCategories.find(s => s.id === third.parentId)
        return sub && sub.parentId !== id
      })
      this.products = this.products.filter(p => p.categoryId !== id)
      this.productCategories = this.productCategories.filter(c => c.id !== id)
      
      this.saveProductCategories()
      this.saveProductSubCategories()
      this.saveProductThirdCategories()
      this.saveProducts()
    },
    
    saveProductCategories() {
      localStorage.setItem('productCategories', JSON.stringify(this.productCategories))
    },
    
    // ========== 产品2级分类管理 ==========
    addProductSubCategory(subCategory) {
      const maxId = Math.max(...this.productSubCategories.map(s => s.id), 0)
      subCategory.id = maxId + 1
      this.productSubCategories.push(subCategory)
      this.saveProductSubCategories()
    },
    
    updateProductSubCategory(subCategory) {
      const index = this.productSubCategories.findIndex(s => s.id === subCategory.id)
      if (index !== -1) {
        this.productSubCategories[index] = subCategory
        this.saveProductSubCategories()
      }
    },
    
    deleteProductSubCategory(id) {
      // 删除3级分类和产品
      this.productThirdCategories = this.productThirdCategories.filter(third => third.parentId !== id)
      this.products = this.products.filter(p => p.subCategoryId !== id)
      this.productSubCategories = this.productSubCategories.filter(s => s.id !== id)
      
      this.saveProductSubCategories()
      this.saveProductThirdCategories()
      this.saveProducts()
    },
    
    saveProductSubCategories() {
      localStorage.setItem('productSubCategories', JSON.stringify(this.productSubCategories))
    },
    
    // ========== 产品3级分类管理 ==========
    addProductThirdCategory(thirdCategory) {
      const maxId = Math.max(...this.productThirdCategories.map(t => t.id), 0)
      thirdCategory.id = maxId + 1
      this.productThirdCategories.push(thirdCategory)
      this.saveProductThirdCategories()
    },
    
    updateProductThirdCategory(thirdCategory) {
      const index = this.productThirdCategories.findIndex(t => t.id === thirdCategory.id)
      if (index !== -1) {
        this.productThirdCategories[index] = thirdCategory
        this.saveProductThirdCategories()
      }
    },
    
    deleteProductThirdCategory(id) {
      // 删除4级分类
      this.productFourthCategories = this.productFourthCategories.filter(f => f.parentId !== id)
      // 删除相关产品
      this.products = this.products.filter(p => p.thirdCategoryId !== id)
      this.productThirdCategories = this.productThirdCategories.filter(t => t.id !== id)
      
      this.saveProductFourthCategories()
      this.saveProductThirdCategories()
      this.saveProducts()
    },
    
    saveProductThirdCategories() {
      localStorage.setItem('productThirdCategories', JSON.stringify(this.productThirdCategories))
    },
    
    // ========== 产品4级分类管理 ==========
    addProductFourthCategory(fourthCategory) {
      const maxId = Math.max(...this.productFourthCategories.map(f => f.id), 0)
      fourthCategory.id = maxId + 1
      this.productFourthCategories.push(fourthCategory)
      this.saveProductFourthCategories()
    },
    
    updateProductFourthCategory(fourthCategory) {
      const index = this.productFourthCategories.findIndex(f => f.id === fourthCategory.id)
      if (index !== -1) {
        this.productFourthCategories[index] = fourthCategory
        this.saveProductFourthCategories()
      }
    },
    
    deleteProductFourthCategory(id) {
      // 删除相关产品
      this.products = this.products.filter(p => p.fourthCategoryId !== id)
      this.productFourthCategories = this.productFourthCategories.filter(f => f.id !== id)
      
      this.saveProductFourthCategories()
      this.saveProducts()
    },
    
    saveProductFourthCategories() {
      localStorage.setItem('productFourthCategories', JSON.stringify(this.productFourthCategories))
    },
    
    // ========== 产品管理 ==========
    addProduct(product) {
      const maxId = Math.max(...this.products.map(p => p.id), 0)
      product.id = maxId + 1
      product.images = product.images || []
      product.specs = product.specs || []
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
      localStorage.setItem('productsAdvanced', JSON.stringify(this.products))
    }
  }
})
