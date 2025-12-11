import { defineStore } from 'pinia'

export const useCmsStore = defineStore('cms', {
  state: () => ({
    // 网站配置
    siteConfig: {
      logo: localStorage.getItem('siteLogo') || '',
      companyName: {
        'zh-CN': '明升伟业',
        'en-US': 'Mingsheng'
      },
      slogan: {
        'zh-CN': '专业工业工具供应商',
        'en-US': 'Professional Industrial Tools Supplier'
      }
    },
    
    // 页面内容管理
    pageContents: JSON.parse(localStorage.getItem('pageContents') || '{}'),
    
    // 产品系列
    productSeries: JSON.parse(localStorage.getItem('productSeries') || JSON.stringify([
      {
        id: 1,
        name: { 'zh-CN': '自动化设备', 'en-US': 'Automation Equipment' },
        description: { 
          'zh-CN': 'SCA自动涂胶机、SPR FDS整机、Gudel七轴机器人等自动化解决方案',
          'en-US': 'SCA automatic gluing machine, SPR FDS complete machine, Gudel seven-axis robot and other automation solutions'
        },
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600'
      },
      {
        id: 2,
        name: { 'zh-CN': '工业工具和装配解决方案', 'en-US': 'Industrial Tools & Assembly Solutions' },
        description: { 
          'zh-CN': 'Bosch博世电池工具、Dynabra气动打磨工具、Beta手动工具等',
          'en-US': 'Bosch battery tools, Dynabra pneumatic grinding tools, Beta manual tools, etc.'
        },
        image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=600'
      },
      {
        id: 3,
        name: { 'zh-CN': '定制工装夹具', 'en-US': 'Custom Tooling & Fixtures' },
        description: { 
          'zh-CN': '托盘、台车、夹具及NC多轴柔性工装定制服务',
          'en-US': 'Customized services for pallets, trolleys, fixtures and NC multi-axis flexible tooling'
        },
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600'
      },
      {
        id: 4,
        name: { 'zh-CN': '工业配套配件', 'en-US': 'Industrial Supporting Parts' },
        description: { 
          'zh-CN': '电梯配件、五金配件、液压润滑系统等工业配套产品',
          'en-US': 'Elevator parts, hardware accessories, hydraulic lubrication systems and other industrial supporting products'
        },
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600'
      },
      {
        id: 5,
        name: { 'zh-CN': '节能环保方案', 'en-US': 'Energy Saving & Environmental Protection' },
        description: { 
          'zh-CN': '焊机智能化节能系统及工业节能改造方案',
          'en-US': 'Intelligent energy-saving system for welding machines and industrial energy-saving transformation solutions'
        },
        image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=600'
      },
      {
        id: 6,
        name: { 'zh-CN': '服务方案', 'en-US': 'Service Solutions' },
        description: { 
          'zh-CN': 'AI视觉检测、拧紧装配工作站、MES系统等智能制造服务',
          'en-US': 'AI visual inspection, tightening assembly workstation, MES system and other intelligent manufacturing services'
        },
        image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600'
      }
    ])),
    
    // 事业部
    divisions: JSON.parse(localStorage.getItem('divisions') || JSON.stringify([
      {
        id: 1,
        key: 'assembly',
        name: { 'zh-CN': '工业智能装配事业部', 'en-US': 'Industrial Intelligent Assembly Division' },
        description: { 'zh-CN': '专注于工业智能装配系统与解决方案', 'en-US': 'Focus on industrial intelligent assembly systems and solutions' }
      },
      {
        id: 2,
        key: 'production',
        name: { 'zh-CN': '工业智能智造事业部', 'en-US': 'Industrial Intelligent Production Division' },
        description: { 'zh-CN': '提供工业智能制造设备与自动化方案', 'en-US': 'Provide industrial intelligent manufacturing equipment and automation solutions' }
      },
      {
        id: 3,
        key: 'oem',
        name: { 'zh-CN': '工业配套事业部', 'en-US': 'Industry OEM Division' },
        description: { 'zh-CN': '工业配套产品与零部件供应', 'en-US': 'Industrial supporting products and parts supply' }
      },
      {
        id: 4,
        key: 'power',
        name: { 'zh-CN': '动力装配事业部', 'en-US': 'Power Assembly Division' },
        description: { 'zh-CN': '动力装配系统与工具解决方案', 'en-US': 'Power assembly system and tool solutions' }
      },
      {
        id: 5,
        key: 'auto',
        name: { 'zh-CN': '汽车部件事业部', 'en-US': 'Automobile Parts Division' },
        description: { 'zh-CN': '汽车零部件制造与装配服务', 'en-US': 'Automobile parts manufacturing and assembly services' }
      },
      {
        id: 6,
        key: 'tech',
        name: { 'zh-CN': '明升科技事业部', 'en-US': 'Mingsheng Technology Division' },
        description: { 'zh-CN': '明升科技创新与研发中心', 'en-US': 'Mingsheng Technology Innovation and R&D Center' }
      },
      {
        id: 7,
        key: 'tools',
        name: { 'zh-CN': '刀具油品事业部', 'en-US': 'Oils and Cutting Tools Division' },
        description: { 'zh-CN': '刀具与油品专业供应服务', 'en-US': 'Professional supply service for cutting tools and oils' }
      },
      {
        id: 8,
        key: 'marketing',
        name: { 'zh-CN': '网营事业部', 'en-US': 'Network Marketing Division' },
        description: { 'zh-CN': '网络营销与电子商务平台', 'en-US': 'Network marketing and e-commerce platform' }
      }
    ]))
  }),
  
  actions: {
    // 更新Logo
    updateLogo(logoUrl) {
      this.siteConfig.logo = logoUrl
      localStorage.setItem('siteLogo', logoUrl)
    },
    
    // 更新公司名称
    updateCompanyName(name, locale) {
      this.siteConfig.companyName[locale] = name
      this.saveSiteConfig()
    },
    
    // 更新标语
    updateSlogan(slogan, locale) {
      this.siteConfig.slogan[locale] = slogan
      this.saveSiteConfig()
    },
    
    // 保存网站配置
    saveSiteConfig() {
      localStorage.setItem('siteConfig', JSON.stringify(this.siteConfig))
    },
    
    // 更新页面内容
    updatePageContent(page, locale, content) {
      if (!this.pageContents[page]) {
        this.pageContents[page] = {}
      }
      this.pageContents[page][locale] = content
      localStorage.setItem('pageContents', JSON.stringify(this.pageContents))
    },
    
    // 获取页面内容
    getPageContent(page, locale) {
      return this.pageContents[page]?.[locale] || ''
    },
    
    // 更新产品系列
    updateProductSeries(series) {
      this.productSeries = series
      localStorage.setItem('productSeries', JSON.stringify(series))
    },
    
    // 添加产品系列
    addProductSeries(series) {
      const maxId = Math.max(...this.productSeries.map(s => s.id), 0)
      series.id = maxId + 1
      this.productSeries.push(series)
      this.updateProductSeries(this.productSeries)
    },
    
    // 删除产品系列
    deleteProductSeries(id) {
      this.productSeries = this.productSeries.filter(s => s.id !== id)
      this.updateProductSeries(this.productSeries)
    },
    
    // 更新事业部
    updateDivisions(divisions) {
      this.divisions = divisions
      localStorage.setItem('divisions', JSON.stringify(divisions))
    },
    
    // 添加事业部
    addDivision(division) {
      const maxId = Math.max(...this.divisions.map(d => d.id), 0)
      division.id = maxId + 1
      this.divisions.push(division)
      this.updateDivisions(this.divisions)
    },
    
    // 删除事业部
    deleteDivision(id) {
      this.divisions = this.divisions.filter(d => d.id !== id)
      this.updateDivisions(this.divisions)
    }
  }
})
