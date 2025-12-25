import { defineStore } from 'pinia'

export const useCmsStore = defineStore('cms', {
  state: () => ({
    // 网站配置
    siteConfig: {
      logo: localStorage.getItem('siteLogo') || '/logo-new.png',  // 使用新Logo
      companyName: {
        'zh-CN': '明升企业智能体',
        'en-US': 'MingSheng AI Agent'
      },
      slogan: {
        'zh-CN': 'AI驱动的企业智能解决方案',
        'en-US': 'AI-Powered Enterprise Intelligence Solutions'
      }
    },
    
    // 主题色配置
    themeColors: JSON.parse(localStorage.getItem('themeColors') || JSON.stringify({
      primary: '#1890ff',      // 主色调（蓝色）
      primaryLight: '#40a9ff',  // 主色浅色
      primaryDark: '#096dd9'    // 主色深色
    })),
    
    // 首页Banner轮播图
    homeBanners: JSON.parse(localStorage.getItem('homeBanners') || JSON.stringify([
      {
        id: 1,
        title: { 'zh-CN': '明升企业智能体平台', 'en-US': 'MingSheng AI Agent Platform' },
        subtitle: { 'zh-CN': 'AI驱动的企业智能解决方案 · 自主学习 · 持续进化', 'en-US': 'AI-Powered Enterprise Intelligence · Self-Learning · Continuous Evolution' },
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920',
        buttonText: { 'zh-CN': '了解更多', 'en-US': 'Learn More' },
        buttonAction: 'about',
        status: 'active',
        order: 1
      },
      {
        id: 2,
        title: { 'zh-CN': '智能工具 · 智能装配 · 智能管理', 'en-US': 'Smart Tools · Smart Assembly · Smart Management' },
        subtitle: { 'zh-CN': 'EQTCF & ETBP 系列智能工具，为您提供全方位智能解决方案', 'en-US': 'EQTCF & ETBP smart tools for comprehensive intelligent solutions' },
        image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1920',
        buttonText: { 'zh-CN': '探索产品', 'en-US': 'Explore Products' },
        buttonAction: 'products',
        status: 'active',
        order: 2
      },
      {
        id: 3,
        title: { 'zh-CN': 'AI工作流编排 · 智能体协作', 'en-US': 'AI Workflow · Agent Collaboration' },
        subtitle: { 'zh-CN': '可视化工作流设计 · 多智能体协同 · 自动化执行', 'en-US': 'Visual Workflow Design · Multi-Agent Collaboration · Automated Execution' },
        image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1920',
        buttonText: { 'zh-CN': '查看方案', 'en-US': 'View Solutions' },
        buttonAction: 'products',
        status: 'active',
        order: 3
      },
      {
        id: 4,
        title: { 'zh-CN': 'AICRM · 智能客户管理', 'en-US': 'AICRM · Intelligent Customer Management' },
        subtitle: { 'zh-CN': 'AI赋能的CRM系统 · 销售预测 · 商机分析 · 客户洞察', 'en-US': 'AI-Powered CRM · Sales Forecast · Opportunity Analysis · Customer Insights' },
        image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1920',
        buttonText: { 'zh-CN': '了解方案', 'en-US': 'Learn Solutions' },
        buttonAction: 'solutions',
        status: 'active',
        order: 4
      }
    ])),
    
    // 明星产品展示
    featuredProducts: JSON.parse(localStorage.getItem('featuredProducts') || JSON.stringify([
      {
        id: 1,
        title: { 'zh-CN': 'EQTCF 智能拧紧工具', 'en-US': 'EQTCF Smart Tightening Tool' },
        description: { 'zh-CN': '高精度智能拧紧，数据实时采集与分析', 'en-US': 'High-precision smart tightening with real-time data collection' },
        mediaType: 'video',
        mediaUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800',
        link: '/products',
        status: 'active',
        order: 1
      },
      {
        id: 2,
        title: { 'zh-CN': 'ETBP 智能电动工具', 'en-US': 'ETBP Smart Electric Tool' },
        description: { 'zh-CN': '智能扭矩控制，蓝牙连接，云端数据管理', 'en-US': 'Smart torque control, Bluetooth connectivity, cloud data management' },
        mediaType: 'image',
        mediaUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1200',
        thumbnailUrl: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800',
        link: '/products',
        status: 'active',
        order: 2
      }
    ])),
    
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
    // 更新主题色
    updateThemeColors(colors) {
      this.themeColors = { ...this.themeColors, ...colors }
      localStorage.setItem('themeColors', JSON.stringify(this.themeColors))
      // 更新CSS变量
      this.applyThemeColors()
    },
    
    // 应用主题色到CSS变量
    applyThemeColors() {
      const root = document.documentElement
      root.style.setProperty('--primary-color', this.themeColors.primary)
      root.style.setProperty('--primary-light-color', this.themeColors.primaryLight)
      root.style.setProperty('--primary-dark-color', this.themeColors.primaryDark)
    },
    
    // 重置主题色为默认值
    resetThemeColors() {
      this.themeColors = {
        primary: '#1890ff',
        primaryLight: '#40a9ff',
        primaryDark: '#096dd9'
      }
      localStorage.setItem('themeColors', JSON.stringify(this.themeColors))
      this.applyThemeColors()
    },
    
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
    },
    
    // ========== Banner管理 ==========
    // 更新Banner列表
    updateHomeBanners(banners) {
      this.homeBanners = banners
      localStorage.setItem('homeBanners', JSON.stringify(banners))
    },
    
    // 添加Banner
    addHomeBanner(banner) {
      const maxId = Math.max(...this.homeBanners.map(b => b.id), 0)
      const maxOrder = Math.max(...this.homeBanners.map(b => b.order), 0)
      banner.id = maxId + 1
      banner.order = maxOrder + 1
      this.homeBanners.push(banner)
      this.updateHomeBanners(this.homeBanners)
    },
    
    // 更新单个Banner
    updateBanner(id, updatedBanner) {
      const index = this.homeBanners.findIndex(b => b.id === id)
      if (index !== -1) {
        this.homeBanners[index] = { ...this.homeBanners[index], ...updatedBanner }
        this.updateHomeBanners(this.homeBanners)
      }
    },
    
    // 删除Banner
    deleteHomeBanner(id) {
      this.homeBanners = this.homeBanners.filter(b => b.id !== id)
      this.updateHomeBanners(this.homeBanners)
    },
    
    // ========== 明星产品管理 ==========
    // 更新明星产品列表
    updateFeaturedProducts(products) {
      this.featuredProducts = products
      localStorage.setItem('featuredProducts', JSON.stringify(products))
    },
    
    // 添加明星产品
    addFeaturedProduct(product) {
      const maxId = Math.max(...this.featuredProducts.map(p => p.id), 0)
      const maxOrder = Math.max(...this.featuredProducts.map(p => p.order), 0)
      product.id = maxId + 1
      product.order = maxOrder + 1
      this.featuredProducts.push(product)
      this.updateFeaturedProducts(this.featuredProducts)
    },
    
    // 更新单个明星产品
    updateFeaturedProduct(id, updatedProduct) {
      const index = this.featuredProducts.findIndex(p => p.id === id)
      if (index !== -1) {
        this.featuredProducts[index] = { ...this.featuredProducts[index], ...updatedProduct }
        this.updateFeaturedProducts(this.featuredProducts)
      }
    },
    
    // 删除明星产品
    deleteFeaturedProduct(id) {
      this.featuredProducts = this.featuredProducts.filter(p => p.id !== id)
      this.updateFeaturedProducts(this.featuredProducts)
    },

    // ========== 从API加载数据 ==========
    async loadFromAPI() {
      try {
        // 加载Banner数据
        const bannersRes = await fetch('/api/content/banners')
        if (bannersRes.ok) {
          const bannersData = await bannersRes.json()
          if (bannersData.success && bannersData.data.length > 0) {
            // 转换API格式到store格式
            this.homeBanners = bannersData.data.map(b => ({
              id: b.id,
              // 🔧 修复: 确保将字符串转换为多语言对象
              title: typeof b.title === 'string' 
                ? { 'zh-CN': b.title, 'en-US': b.title }
                : (b.title || { 'zh-CN': '', 'en-US': '' }),
              subtitle: typeof b.subtitle === 'string'
                ? { 'zh-CN': b.subtitle, 'en-US': b.subtitle }
                : (b.subtitle || { 'zh-CN': '', 'en-US': '' }),
              image: b.image,
              buttonText: typeof b.buttonText === 'string'
                ? { 'zh-CN': b.buttonText, 'en-US': b.buttonText }
                : (b.buttonText || { 'zh-CN': '了解更多', 'en-US': 'Learn More' }),
              buttonAction: b.link || 'about',
              status: b.active ? 'active' : 'inactive',
              order: b.id
            }))
            // 同步到localStorage
            localStorage.setItem('homeBanners', JSON.stringify(this.homeBanners))
            console.log('✅ Banner数据已从API同步到localStorage')
          }
        }

        // 加载网站配置
        const configRes = await fetch('/api/content/config')
        if (configRes.ok) {
          const configData = await configRes.json()
          if (configData.success) {
            // 更新配置
            if (configData.data.logo) {
              this.siteConfig.logo = configData.data.logo
              localStorage.setItem('siteLogo', configData.data.logo)
              console.log('✅ Logo已从API同步:', configData.data.logo)
            }
          }
        }

        console.log('✅ 数据已从API加载并同步')
      } catch (error) {
        console.warn('⚠️ 从API加载数据失败，使用本地缓存:', error.message)
      }
    }
  }
})
