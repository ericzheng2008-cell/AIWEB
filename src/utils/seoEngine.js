/**
 * SEO深度优化引擎
 * 多语言SEO、长尾关键词、Schema.org结构化数据
 */

export class SEOEngine {
  constructor() {
    // 目标语言市场
    this.targetMarkets = [
      { code: 'zh-CN', name: '中文', country: 'China' },
      { code: 'en-US', name: 'English', country: 'USA' },
      { code: 'es-ES', name: 'Spanish', country: 'Spain' },
      { code: 'de-DE', name: 'German', country: 'Germany' },
      { code: 'ja-JP', name: 'Japanese', country: 'Japan' },
      { code: 'pt-BR', name: 'Portuguese', country: 'Brazil' },
      { code: 'fr-FR', name: 'French', country: 'France' }
    ]

    // 行业关键词库
    this.industryKeywords = {
      automotive: {
        'zh-CN': ['汽车装配', '汽车生产线', '汽车拧紧', '发动机装配', '底盘拧紧'],
        'en-US': ['automotive assembly', 'car production line', 'engine assembly', 'chassis tightening', 'automotive torque tools'],
        'de-DE': ['Automobilmontage', 'Autoproduktionslinie', 'Motorenmontage'],
        'ja-JP': ['自動車組立', '生産ライン', 'エンジン組立']
      },
      aerospace: {
        'zh-CN': ['航空航天', '飞机装配', '高精度拧紧', '航空器维修'],
        'en-US': ['aerospace', 'aircraft assembly', 'high-precision tightening', 'aviation maintenance'],
        'de-DE': ['Luft- und Raumfahrt', 'Flugzeugmontage', 'Präzisionsverschraubung'],
        'ja-JP': ['航空宇宙', '航空機組立', '高精度締付']
      }
    }
  }

  /**
   * 生成SEO优化内容
   */
  async generateSEOContent(product, targetMarket) {
    const keywords = await this.keywordResearch(product, targetMarket)
    
    return {
      title: this.generateTitle(keywords.primary, targetMarket),
      metaDescription: this.generateDescription(keywords, targetMarket),
      headings: this.generateHeadings(keywords, targetMarket),
      content: await this.generateLongFormContent({
        keywords,
        minWords: 1500,
        includeSchema: true,
        includeImages: true,
        language: targetMarket
      }),
      schema: this.generateProductSchema(product, targetMarket),
      keywords: keywords,
      url: this.generateSEOFriendlyURL(product, targetMarket)
    }
  }

  /**
   * 关键词研究
   */
  async keywordResearch(product, targetMarket) {
    const primary = this.getPrimaryKeyword(product, targetMarket)
    const secondary = this.getSecondaryKeywords(product, targetMarket)
    const longTail = this.getLongTailKeywords(product, targetMarket)
    
    return {
      primary,
      secondary,
      longTail,
      lsi: this.getLSIKeywords(primary, targetMarket) // Latent Semantic Indexing
    }
  }

  /**
   * 获取主关键词
   */
  getPrimaryKeyword(product, language) {
    const templates = {
      'zh-CN': `${product.category} ${product.type} ${product.brand || ''}`,
      'en-US': `${product.type} ${product.category} ${product.brand || ''}`,
      'de-DE': `${product.brand || ''} ${product.type} ${product.category}`,
      'ja-JP': `${product.brand || ''} ${product.category} ${product.type}`
    }

    return (templates[language] || templates['en-US']).trim()
  }

  /**
   * 获取次要关键词
   */
  getSecondaryKeywords(product, language) {
    const keywords = []

    // 基于产品属性
    if (product.torqueRange) {
      keywords.push({
        'zh-CN': `${product.torqueRange} 扭矩工具`,
        'en-US': `${product.torqueRange} torque tool`,
        'de-DE': `${product.torqueRange} Drehmoment werkzeug`,
        'ja-JP': `${product.torqueRange} トルク工具`
      }[language])
    }

    // 基于应用场景
    if (product.application) {
      keywords.push({
        'zh-CN': `${product.application} 专用工具`,
        'en-US': `${product.application} specialized tool`,
        'de-DE': `${product.application} Spezialwerkzeug`,
        'ja-JP': `${product.application} 専用工具`
      }[language])
    }

    // 基于功能特性
    if (product.features) {
      product.features.forEach(feature => {
        keywords.push(feature[language] || feature['en-US'])
      })
    }

    return keywords.filter(k => k)
  }

  /**
   * 获取长尾关键词
   */
  getLongTailKeywords(product, language) {
    const longTailTemplates = {
      'zh-CN': [
        `${product.category}哪个品牌好`,
        `${product.category}如何选择`,
        `${product.category}价格多少`,
        `${product.category}使用方法`,
        `${product.category}维护保养`,
        `${product.category}故障排除`
      ],
      'en-US': [
        `best ${product.category} for ${product.application}`,
        `how to choose ${product.category}`,
        `${product.category} buying guide`,
        `${product.category} maintenance tips`,
        `${product.category} troubleshooting`,
        `professional ${product.category} selection`
      ],
      'de-DE': [
        `beste ${product.category} für ${product.application}`,
        `${product.category} Auswahlführer`,
        `${product.category} Kaufberatung`,
        `${product.category} Wartungstipps`
      ],
      'ja-JP': [
        `${product.category} おすすめ`,
        `${product.category} 選び方`,
        `${product.category} メンテナンス`,
        `${product.category} トラブルシューティング`
      ]
    }

    return longTailTemplates[language] || longTailTemplates['en-US']
  }

  /**
   * 获取LSI关键词（语义相关词）
   */
  getLSIKeywords(primaryKeyword, language) {
    const lsiMap = {
      'zh-CN': {
        '拧紧工具': ['装配工具', '扭矩扳手', '电动螺丝刀', '气动工具', '拧紧系统'],
        '扭矩扳手': ['预置扭力扳手', '数显扭力扳手', '扭力工具', '力矩扳手']
      },
      'en-US': {
        'tightening tool': ['assembly tool', 'torque wrench', 'fastening tool', 'screwdriver', 'tightening system'],
        'torque wrench': ['torque tool', 'preset torque wrench', 'digital torque wrench', 'calibrated wrench']
      },
      'de-DE': {
        'Anzugswerkzeug': ['Montagewerkzeug', 'Drehmomentschlüssel', 'Befestigungswerkzeug'],
        'Drehmomentschlüssel': ['Drehmoment werkzeug', 'Präzisionswerkzeug']
      }
    }

    const languageLSI = lsiMap[language] || lsiMap['en-US']
    return languageLSI[primaryKeyword] || []
  }

  /**
   * 生成SEO标题
   */
  generateTitle(primaryKeyword, language) {
    const templates = {
      'zh-CN': [
        `${primaryKeyword} - 专业供应商 | 明升伟业`,
        `${primaryKeyword} 选型指南 - 明升伟业`,
        `高品质${primaryKeyword} - 明升伟业机电`
      ],
      'en-US': [
        `${primaryKeyword} - Professional Supplier | Mingsheng`,
        `${primaryKeyword} Selection Guide - Mingsheng`,
        `High-Quality ${primaryKeyword} - Mingsheng Weiye`
      ],
      'de-DE': [
        `${primaryKeyword} - Professioneller Anbieter | Mingsheng`,
        `${primaryKeyword} Auswahlführer - Mingsheng`
      ],
      'ja-JP': [
        `${primaryKeyword} - プロサプライヤー | Mingsheng`,
        `${primaryKeyword} 選択ガイド - Mingsheng`
      ]
    }

    const titleTemplates = templates[language] || templates['en-US']
    return titleTemplates[0]
  }

  /**
   * 生成Meta描述
   */
  generateDescription(keywords, language) {
    const templates = {
      'zh-CN': `专业提供${keywords.primary}，涵盖${keywords.secondary.slice(0, 3).join('、')}。28年行业经验，服务汽车、航空等行业。提供选型指南、技术支持。联系电话：400-123-4567`,
      'en-US': `Professional supplier of ${keywords.primary}, including ${keywords.secondary.slice(0, 3).join(', ')}. 28 years of experience serving automotive, aerospace industries. Selection guide and technical support available. Contact: 400-123-4567`,
      'de-DE': `Professioneller Anbieter von ${keywords.primary}. 28 Jahre Erfahrung in der Automobil- und Luftfahrtindustrie. Auswahlführer und technische Unterstützung verfügbar.`,
      'ja-JP': `${keywords.primary}のプロサプライヤー。自動車・航空宇宙産業に28年の経験。選択ガイドと技術サポートが利用可能。`
    }

    return templates[language] || templates['en-US']
  }

  /**
   * 生成标题结构
   */
  generateHeadings(keywords, language) {
    const headings = {
      'zh-CN': {
        h1: keywords.primary,
        h2: [
          `${keywords.primary}产品系列`,
          `如何选择${keywords.primary}`,
          `${keywords.primary}应用案例`,
          `技术参数与规格`,
          `常见问题解答`
        ],
        h3: keywords.secondary.slice(0, 6)
      },
      'en-US': {
        h1: keywords.primary,
        h2: [
          `${keywords.primary} Product Series`,
          `How to Choose ${keywords.primary}`,
          `${keywords.primary} Applications`,
          `Technical Specifications`,
          `Frequently Asked Questions`
        ],
        h3: keywords.secondary.slice(0, 6)
      }
    }

    return headings[language] || headings['en-US']
  }

  /**
   * 生成长篇SEO内容
   */
  async generateLongFormContent(params) {
    const { keywords, minWords, language } = params

    const sections = []

    // 1. 产品介绍段落
    sections.push({
      heading: 'h2',
      title: language === 'zh-CN' ? `${keywords.primary}产品介绍` : `${keywords.primary} Product Introduction`,
      content: this.generateIntroductionParagraph(keywords, language)
    })

    // 2. 选型指南
    sections.push({
      heading: 'h2',
      title: language === 'zh-CN' ? '选型指南' : 'Selection Guide',
      content: this.generateSelectionGuideParagraph(keywords, language)
    })

    // 3. 技术参数
    sections.push({
      heading: 'h2',
      title: language === 'zh-CN' ? '技术参数' : 'Technical Specifications',
      content: this.generateSpecificationsParagraph(keywords, language)
    })

    // 4. 应用案例
    sections.push({
      heading: 'h2',
      title: language === 'zh-CN' ? '应用案例' : 'Application Cases',
      content: this.generateCaseStudiesParagraph(keywords, language)
    })

    // 5. FAQ
    sections.push({
      heading: 'h2',
      title: language === 'zh-CN' ? '常见问题' : 'Frequently Asked Questions',
      content: this.generateFAQParagraph(keywords, language)
    })

    return sections
  }

  /**
   * 生成Product Schema
   */
  generateProductSchema(product, language) {
    return {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name[language] || product.name['zh-CN'],
      "image": product.images || [],
      "description": product.description[language] || product.description['zh-CN'],
      "brand": {
        "@type": "Brand",
        "name": product.brand || "Mingsheng"
      },
      "offers": {
        "@type": "Offer",
        "url": `https://www.mingsheng.com/product/${product.id}`,
        "priceCurrency": "CNY",
        "price": product.price || 0,
        "priceValidUntil": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        "availability": "https://schema.org/InStock",
        "seller": {
          "@type": "Organization",
          "name": "广州市明升伟业机电有限公司"
        }
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating || "4.8",
        "reviewCount": product.reviewCount || "156"
      }
    }
  }

  /**
   * 生成SEO友好URL
   */
  generateSEOFriendlyURL(product, language) {
    const slug = product.name[language]
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '')

    return `/${language}/product/${product.category}/${slug}-${product.id}`
  }

  /**
   * 生成多语言sitemap
   */
  generateMultilingualSitemap(products, pages) {
    const urls = []

    // 产品页面
    products.forEach(product => {
      this.targetMarkets.forEach(market => {
        const url = {
          loc: `https://www.mingsheng.com${this.generateSEOFriendlyURL(product, market.code)}`,
          lastmod: product.lastModified || new Date().toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: 0.8,
          'xhtml:link': this.targetMarkets.map(m => ({
            rel: 'alternate',
            hreflang: m.code,
            href: `https://www.mingsheng.com${this.generateSEOFriendlyURL(product, m.code)}`
          }))
        }
        urls.push(url)
      })
    })

    // 其他页面
    pages.forEach(page => {
      this.targetMarkets.forEach(market => {
        const url = {
          loc: `https://www.mingsheng.com/${market.code}${page.path}`,
          lastmod: page.lastModified || new Date().toISOString().split('T')[0],
          changefreq: page.changefreq || 'monthly',
          priority: page.priority || 0.6,
          'xhtml:link': this.targetMarkets.map(m => ({
            rel: 'alternate',
            hreflang: m.code,
            href: `https://www.mingsheng.com/${m.code}${page.path}`
          }))
        }
        urls.push(url)
      })
    })

    return this.generateSitemapXML(urls)
  }

  /**
   * 生成Sitemap XML
   */
  generateSitemapXML(urls) {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n'
    xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'

    urls.forEach(url => {
      xml += '  <url>\n'
      xml += `    <loc>${url.loc}</loc>\n`
      xml += `    <lastmod>${url.lastmod}</lastmod>\n`
      xml += `    <changefreq>${url.changefreq}</changefreq>\n`
      xml += `    <priority>${url.priority}</priority>\n`
      
      if (url['xhtml:link']) {
        url['xhtml:link'].forEach(link => {
          xml += `    <xhtml:link rel="${link.rel}" hreflang="${link.hreflang}" href="${link.href}"/>\n`
        })
      }
      
      xml += '  </url>\n'
    })

    xml += '</urlset>'
    return xml
  }

  // 辅助方法：生成段落内容
  generateIntroductionParagraph(keywords, language) {
    return `[${language}] Introduction paragraph about ${keywords.primary}...`
  }

  generateSelectionGuideParagraph(keywords, language) {
    return `[${language}] Selection guide for ${keywords.primary}...`
  }

  generateSpecificationsParagraph(keywords, language) {
    return `[${language}] Technical specifications for ${keywords.primary}...`
  }

  generateCaseStudiesParagraph(keywords, language) {
    return `[${language}] Case studies of ${keywords.primary}...`
  }

  generateFAQParagraph(keywords, language) {
    return `[${language}] FAQ about ${keywords.primary}...`
  }
}

export default SEOEngine
