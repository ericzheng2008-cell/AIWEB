/**
 * P2-2: 竞对数据智能抓取系统
 * 功能: 自动抓取竞品官网/价格/招投标/新闻/社交评价
 * 开发周期: Week 2-4
 */

import { ref, computed } from 'vue'

// 竞对数据库
export const competitors = ref([
  {
    id: 'COMP_001',
    name: 'XX智能拧紧',
    industry: 'automotive',
    website: 'https://competitor-a.com',
    logo: 'https://via.placeholder.com/80',
    marketShare: 0.23,
    rating: 4.5,
    lastUpdated: new Date(),
    products: [],
    priceHistory: [],
    biddingHistory: [],
    news: [],
    socialSentiment: 0.65,
    aiInsights: {}
  },
  {
    id: 'COMP_002',
    name: 'YY工业工具',
    industry: 'aerospace',
    website: 'https://competitor-b.com',
    logo: 'https://via.placeholder.com/80',
    marketShare: 0.18,
    rating: 4.2,
    lastUpdated: new Date(),
    products: [],
    priceHistory: [],
    biddingHistory: [],
    news: [],
    socialSentiment: 0.58,
    aiInsights: {}
  }
])

// 抓取任务队列
export const scrapeJobs = ref([])

// 抓取统计
export const scrapeMetrics = ref({
  totalJobs: 0,
  successJobs: 0,
  failedJobs: 0,
  successRate: 0,
  avgDuration: 0,
  dataCollected: 0
})

/**
 * 竞品智能抓取服务
 */
class CompetitorIntelligenceService {
  constructor() {
    this.isRunning = false
    this.scrapeQueue = []
  }

  /**
   * 抓取竞品官网数据
   */
  async scrapeWebsite(competitor) {
    const jobId = `web-${competitor.id}-${Date.now()}`
    this.addScrapeJob(jobId, 'website', competitor.name, 'running')
    
    try {
      console.log(`[CompetitorScraper] Scraping website: ${competitor.website}`)
      
      // 模拟Puppeteer爬虫
      const data = await this.mockPuppeteerScrape(competitor.website)
      
      // 解析产品信息
      const products = this.extractProducts(data)
      
      // 更新竞对数据
      competitor.products = products
      competitor.lastUpdated = new Date()
      
      this.updateScrapeJob(jobId, 'success', products.length)
      
      return {
        success: true,
        products: products,
        timestamp: new Date()
      }
    } catch (error) {
      this.updateScrapeJob(jobId, 'failed', 0, error.message)
      throw error
    }
  }

  /**
   * 抓取价格表数据 (PDF OCR)
   */
  async scrapePriceList(competitor, pdfUrl) {
    const jobId = `price-${competitor.id}-${Date.now()}`
    this.addScrapeJob(jobId, 'price', competitor.name, 'running')
    
    try {
      console.log(`[CompetitorScraper] Scraping price list: ${pdfUrl}`)
      
      // 模拟PDF下载和OCR
      const pdfText = await this.mockPDFToText(pdfUrl)
      
      // NLP提取价格信息
      const prices = await this.extractPrices(pdfText)
      
      // 更新价格历史
      prices.forEach(price => {
        competitor.priceHistory.push({
          productId: price.productId,
          productName: price.productName,
          price: price.price,
          currency: price.currency || 'CNY',
          validFrom: new Date(),
          source: 'pdf_ocr'
        })
      })
      
      competitor.lastUpdated = new Date()
      
      this.updateScrapeJob(jobId, 'success', prices.length)
      
      return {
        success: true,
        prices: prices,
        timestamp: new Date()
      }
    } catch (error) {
      this.updateScrapeJob(jobId, 'failed', 0, error.message)
      throw error
    }
  }

  /**
   * 抓取招投标平台数据
   */
  async scrapeBiddingPlatform(competitor, platform) {
    const jobId = `bid-${competitor.id}-${Date.now()}`
    this.addScrapeJob(jobId, 'bidding', competitor.name, 'running')
    
    try {
      console.log(`[CompetitorScraper] Scraping bidding platform: ${platform}`)
      
      // 抓取招投标数据
      const bids = await this.mockScrapeBidding(competitor.name, platform)
      
      // 更新投标历史
      bids.forEach(bid => {
        competitor.biddingHistory.push({
          projectId: bid.projectId,
          projectName: bid.projectName,
          bidAmount: bid.bidAmount,
          result: bid.result,  // 'won' | 'lost' | 'pending'
          date: new Date(bid.date),
          platform: platform,
          competitors: bid.competitors || []
        })
      })
      
      competitor.lastUpdated = new Date()
      
      this.updateScrapeJob(jobId, 'success', bids.length)
      
      return {
        success: true,
        bids: bids,
        timestamp: new Date()
      }
    } catch (error) {
      this.updateScrapeJob(jobId, 'failed', 0, error.message)
      throw error
    }
  }

  /**
   * 抓取行业新闻 (RSS + NLP)
   */
  async scrapeNews(competitor) {
    const jobId = `news-${competitor.id}-${Date.now()}`
    this.addScrapeJob(jobId, 'news', competitor.name, 'running')
    
    try {
      console.log(`[CompetitorScraper] Scraping news about: ${competitor.name}`)
      
      // RSS订阅源
      const rssSources = [
        'https://news.google.com/rss/search?q=',
        'https://news.baidu.com/rss?q='
      ]
      
      // 抓取新闻
      const news = await this.mockScrapeNews(competitor.name, rssSources)
      
      // NLP情感分析
      for (const article of news) {
        article.sentiment = await this.analyzeSentiment(article.title + ' ' + article.content)
      }
      
      // 更新新闻
      competitor.news = news
      competitor.lastUpdated = new Date()
      
      this.updateScrapeJob(jobId, 'success', news.length)
      
      return {
        success: true,
        news: news,
        timestamp: new Date()
      }
    } catch (error) {
      this.updateScrapeJob(jobId, 'failed', 0, error.message)
      throw error
    }
  }

  /**
   * 抓取社交评价 (API + 情感分析)
   */
  async scrapeSocialMedia(competitor) {
    const jobId = `social-${competitor.id}-${Date.now()}`
    this.addScrapeJob(jobId, 'social', competitor.name, 'running')
    
    try {
      console.log(`[CompetitorScraper] Scraping social media: ${competitor.name}`)
      
      // 社交平台API
      const platforms = ['weibo', 'zhihu', 'xiaohongshu']
      const mentions = []
      
      for (const platform of platforms) {
        const data = await this.mockScrapeSocial(competitor.name, platform)
        mentions.push(...data)
      }
      
      // 情感分析
      let totalSentiment = 0
      for (const mention of mentions) {
        mention.sentiment = await this.analyzeSentiment(mention.content)
        totalSentiment += mention.sentiment
      }
      
      // 更新社交情绪
      competitor.socialSentiment = mentions.length > 0 
        ? totalSentiment / mentions.length 
        : 0.5
      
      competitor.lastUpdated = new Date()
      
      this.updateScrapeJob(jobId, 'success', mentions.length)
      
      return {
        success: true,
        mentions: mentions,
        avgSentiment: competitor.socialSentiment,
        timestamp: new Date()
      }
    } catch (error) {
      this.updateScrapeJob(jobId, 'failed', 0, error.message)
      throw error
    }
  }

  /**
   * 生成竞品AI洞察
   */
  async generateAIInsights(competitor) {
    console.log(`[CompetitorAI] Generating insights for: ${competitor.name}`)
    
    const insights = {
      pricingStrategy: this.analyzePricingStrategy(competitor.priceHistory),
      targetSegments: this.identifyTargetSegments(competitor.biddingHistory),
      strengthWeakness: await this.analyzeStrengthWeakness(competitor),
      marketTrend: this.analyzeMarketTrend(competitor.news),
      competitiveAdvantage: this.identifyCompetitiveAdvantage(competitor)
    }
    
    competitor.aiInsights = insights
    
    return insights
  }

  /**
   * 分析定价策略
   */
  analyzePricingStrategy(priceHistory) {
    if (!priceHistory || priceHistory.length === 0) {
      return 'neutral'
    }
    
    // 计算价格变化趋势
    const recentPrices = priceHistory.slice(-10)
    const avgChange = recentPrices.reduce((sum, p, i) => {
      if (i === 0) return 0
      return sum + (p.price - recentPrices[i-1].price) / recentPrices[i-1].price
    }, 0) / (recentPrices.length - 1)
    
    if (avgChange > 0.05) {
      return 'premium'  // 高端策略
    } else if (avgChange < -0.05) {
      return 'aggressive'  // 激进降价
    } else {
      return 'stable'  // 稳定策略
    }
  }

  /**
   * 识别目标细分市场
   */
  identifyTargetSegments(biddingHistory) {
    if (!biddingHistory || biddingHistory.length === 0) {
      return ['unknown']
    }
    
    // 统计投标项目的行业分布
    const segmentCounts = {}
    
    biddingHistory.forEach(bid => {
      // 从项目名称中提取行业关键词
      const industry = this.extractIndustry(bid.projectName)
      segmentCounts[industry] = (segmentCounts[industry] || 0) + 1
    })
    
    // 返回Top 3市场
    return Object.entries(segmentCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([industry]) => industry)
  }

  /**
   * 分析优劣势
   */
  async analyzeStrengthWeakness(competitor) {
    const strengths = []
    const weaknesses = []
    
    // 基于市场份额
    if (competitor.marketShare > 0.2) {
      strengths.push('市场占有率高')
    } else {
      weaknesses.push('市场占有率偏低')
    }
    
    // 基于评分
    if (competitor.rating > 4.3) {
      strengths.push('客户满意度高')
    } else if (competitor.rating < 4.0) {
      weaknesses.push('客户满意度有待提升')
    }
    
    // 基于社交情绪
    if (competitor.socialSentiment > 0.6) {
      strengths.push('品牌口碑良好')
    } else if (competitor.socialSentiment < 0.5) {
      weaknesses.push('品牌认知度不足')
    }
    
    // 基于投标成功率
    const wonBids = competitor.biddingHistory.filter(b => b.result === 'won').length
    const totalBids = competitor.biddingHistory.length
    const winRate = totalBids > 0 ? wonBids / totalBids : 0
    
    if (winRate > 0.5) {
      strengths.push(`高中标率 (${(winRate * 100).toFixed(1)}%)`)
    } else if (winRate < 0.3) {
      weaknesses.push(`中标率偏低 (${(winRate * 100).toFixed(1)}%)`)
    }
    
    return { strengths, weaknesses }
  }

  /**
   * 分析市场趋势
   */
  analyzeMarketTrend(news) {
    if (!news || news.length === 0) {
      return 'stable'
    }
    
    // 基于新闻情感
    const avgSentiment = news.reduce((sum, n) => sum + (n.sentiment || 0.5), 0) / news.length
    
    if (avgSentiment > 0.6) {
      return 'growing'
    } else if (avgSentiment < 0.4) {
      return 'declining'
    } else {
      return 'stable'
    }
  }

  /**
   * 识别竞争优势
   */
  identifyCompetitiveAdvantage(competitor) {
    const advantages = []
    
    // 基于产品数量
    if (competitor.products.length > 50) {
      advantages.push('产品线丰富')
    }
    
    // 基于价格竞争力
    const avgPrice = competitor.priceHistory.reduce((sum, p) => sum + p.price, 0) / 
                     (competitor.priceHistory.length || 1)
    
    // 假设市场平均价为15000
    const marketAvg = 15000
    const priceAdvantage = (marketAvg - avgPrice) / marketAvg
    
    if (priceAdvantage > 0.1) {
      advantages.push(`价格优势 ${(priceAdvantage * 100).toFixed(1)}%`)
    }
    
    return advantages
  }

  /**
   * 从项目名称提取行业
   */
  extractIndustry(projectName) {
    const keywords = {
      'automotive': ['汽车', '车辆', '发动机'],
      'aerospace': ['航空', '航天', '飞机'],
      'electronics': ['电子', '芯片', '半导体'],
      'energy': ['能源', '电力', '风电'],
      'manufacturing': ['制造', '生产线', '工厂']
    }
    
    for (const [industry, terms] of Object.entries(keywords)) {
      if (terms.some(term => projectName.includes(term))) {
        return industry
      }
    }
    
    return 'general'
  }

  /**
   * 模拟Puppeteer爬虫
   */
  async mockPuppeteerScrape(url) {
    console.log(`[Mock] Puppeteer scraping: ${url}`)
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      products: [
        { name: '智能拧紧枪A1', price: 12000, specs: { torque: '100Nm', accuracy: '±2%' } },
        { name: '电动扭力扳手B2', price: 8500, specs: { torque: '80Nm', accuracy: '±3%' } },
        { name: '数控拧紧系统C3', price: 35000, specs: { torque: '200Nm', accuracy: '±1%' } }
      ]
    }
  }

  /**
   * 提取产品信息
   */
  extractProducts(data) {
    return data.products.map((p, index) => ({
      id: `P${String(index + 1).padStart(3, '0')}`,
      name: p.name,
      price: p.price,
      specs: p.specs,
      lastUpdated: new Date()
    }))
  }

  /**
   * 模拟PDF转文字
   */
  async mockPDFToText(pdfUrl) {
    console.log(`[Mock] PDF OCR: ${pdfUrl}`)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    return `
      产品价格表 2025年
      智能拧紧枪A1: ¥12,000
      电动扭力扳手B2: ¥8,500
      数控拧紧系统C3: ¥35,000
    `
  }

  /**
   * 提取价格信息
   */
  async extractPrices(text) {
    // 简单的正则匹配
    const priceRegex = /(.+?)[:：]\s*¥?([\d,]+)/g
    const prices = []
    
    let match
    while ((match = priceRegex.exec(text)) !== null) {
      const productName = match[1].trim()
      const price = parseFloat(match[2].replace(/,/g, ''))
      
      if (productName && !isNaN(price)) {
        prices.push({
          productId: `P${String(prices.length + 1).padStart(3, '0')}`,
          productName,
          price,
          currency: 'CNY'
        })
      }
    }
    
    return prices
  }

  /**
   * 模拟招投标抓取
   */
  async mockScrapeBidding(companyName, platform) {
    console.log(`[Mock] Scraping bidding: ${companyName} from ${platform}`)
    
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    return [
      {
        projectId: 'BID001',
        projectName: '某汽车厂拧紧设备采购项目',
        bidAmount: 280000,
        result: 'won',
        date: new Date(2025, 0, 15),
        competitors: ['我司', 'XX智能拧紧', 'ZZ工具']
      },
      {
        projectId: 'BID002',
        projectName: '航空制造生产线改造项目',
        bidAmount: 550000,
        result: 'lost',
        date: new Date(2025, 1, 3),
        competitors: ['我司', 'XX智能拧紧', 'YY工业工具']
      }
    ]
  }

  /**
   * 模拟新闻抓取
   */
  async mockScrapeNews(companyName, rssSources) {
    console.log(`[Mock] Scraping news: ${companyName}`)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return [
      {
        id: 'NEWS001',
        title: `${companyName}发布新一代智能拧紧系统`,
        content: '该系统采用AI算法,拧紧精度提升30%...',
        source: '行业新闻网',
        publishedAt: new Date(2025, 0, 20),
        url: 'https://news.example.com/1'
      },
      {
        id: 'NEWS002',
        title: `${companyName}中标某知名汽车厂项目`,
        content: '项目金额达500万元,预计2025年Q2交付...',
        source: '财经资讯',
        publishedAt: new Date(2025, 1, 10),
        url: 'https://news.example.com/2'
      }
    ]
  }

  /**
   * 模拟社交媒体抓取
   */
  async mockScrapeSocial(companyName, platform) {
    console.log(`[Mock] Scraping social: ${companyName} from ${platform}`)
    
    await new Promise(resolve => setTimeout(resolve, 800))
    
    return [
      {
        id: `${platform}-1`,
        platform,
        author: '工业自动化爱好者',
        content: `使用${companyName}的产品已经2年了,质量很稳定,售后服务也不错!`,
        likes: 156,
        shares: 23,
        createdAt: new Date(2025, 0, 25)
      },
      {
        id: `${platform}-2`,
        platform,
        author: '制造业观察',
        content: `${companyName}的新品发布会很成功,技术实力确实强`,
        likes: 89,
        shares: 12,
        createdAt: new Date(2025, 1, 5)
      }
    ]
  }

  /**
   * 情感分析
   */
  async analyzeSentiment(text) {
    // 简单的关键词情感分析
    const positiveWords = ['好', '优秀', '成功', '稳定', '强', '赞']
    const negativeWords = ['差', '失败', '问题', '故障', '投诉']
    
    let score = 0.5  // 中性
    
    positiveWords.forEach(word => {
      if (text.includes(word)) score += 0.1
    })
    
    negativeWords.forEach(word => {
      if (text.includes(word)) score -= 0.1
    })
    
    return Math.max(0, Math.min(1, score))
  }

  /**
   * 添加抓取任务
   */
  addScrapeJob(jobId, type, target, status) {
    const job = {
      id: jobId,
      type,
      target,
      status,
      startTime: new Date(),
      endTime: null,
      dataCount: 0,
      error: null
    }
    
    scrapeJobs.value.unshift(job)
    scrapeMetrics.value.totalJobs++
  }

  /**
   * 更新抓取任务
   */
  updateScrapeJob(jobId, status, dataCount = 0, error = null) {
    const job = scrapeJobs.value.find(j => j.id === jobId)
    if (job) {
      job.status = status
      job.endTime = new Date()
      job.dataCount = dataCount
      job.error = error
      
      if (status === 'success') {
        scrapeMetrics.value.successJobs++
        scrapeMetrics.value.dataCollected += dataCount
      } else if (status === 'failed') {
        scrapeMetrics.value.failedJobs++
      }
      
      // 更新成功率
      scrapeMetrics.value.successRate = 
        (scrapeMetrics.value.successJobs / scrapeMetrics.value.totalJobs * 100).toFixed(2)
      
      // 更新平均耗时
      const duration = job.endTime - job.startTime
      scrapeMetrics.value.avgDuration = 
        (scrapeMetrics.value.avgDuration * (scrapeMetrics.value.totalJobs - 1) + duration) /
        scrapeMetrics.value.totalJobs
    }
  }

  /**
   * 抓取全部数据
   */
  async scrapeAll(competitorId) {
    const competitor = competitors.value.find(c => c.id === competitorId)
    if (!competitor) {
      throw new Error(`Competitor not found: ${competitorId}`)
    }
    
    const results = []
    
    // 并行抓取多个数据源
    try {
      const [website, bidding, news, social] = await Promise.all([
        this.scrapeWebsite(competitor).catch(e => ({ error: e.message })),
        this.scrapeBiddingPlatform(competitor, 'gov_procurement').catch(e => ({ error: e.message })),
        this.scrapeNews(competitor).catch(e => ({ error: e.message })),
        this.scrapeSocialMedia(competitor).catch(e => ({ error: e.message }))
      ])
      
      results.push(website, bidding, news, social)
      
      // 生成AI洞察
      const insights = await this.generateAIInsights(competitor)
      results.push({ insights })
      
      return {
        success: true,
        results: results,
        competitor: competitor
      }
    } catch (error) {
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// 导出单例
export const competitorService = new CompetitorIntelligenceService()

// 导出计算属性
export const useCompetitorIntelligence = () => {
  const topCompetitors = computed(() =>
    competitors.value
      .sort((a, b) => b.marketShare - a.marketShare)
      .slice(0, 5)
  )
  
  const recentJobs = computed(() =>
    scrapeJobs.value.slice(0, 20)
  )
  
  const failedJobs = computed(() =>
    scrapeJobs.value.filter(j => j.status === 'failed')
  )
  
  return {
    competitors,
    scrapeJobs,
    scrapeMetrics,
    topCompetitors,
    recentJobs,
    failedJobs,
    competitorService
  }
}
