/**
 * 自动化报表系统
 * 功能：日报/周报/月报、定时发送、订阅管理
 */

import { jsPDF } from 'jspdf'
import * as XLSX from 'xlsx'

export class AutomatedReportingSystem {
  constructor() {
    this.reportTemplates = new Map()
    this.subscriptions = []
    this.scheduledReports = []
  }

  /**
   * 生成营销日报
   */
  async generateDailyReport(date = new Date()) {
    const data = await this.fetchDailyData(date)
    
    const report = {
      type: 'daily',
      date: date.toISOString().split('T')[0],
      summary: {
        visits: data.visits,
        leads: data.leads,
        conversions: data.conversions,
        revenue: data.revenue
      },
      channels: data.channelBreakdown,
      topPages: data.topPages,
      highlights: this.generateHighlights(data),
      alerts: this.generateAlerts(data)
    }

    return report
  }

  /**
   * 生成营销周报
   */
  async generateWeeklyReport(weekEndDate = new Date()) {
    const weekStartDate = new Date(weekEndDate)
    weekStartDate.setDate(weekEndDate.getDate() - 6)
    
    const data = await this.fetchWeeklyData(weekStartDate, weekEndDate)
    
    const report = {
      type: 'weekly',
      period: {
        start: weekStartDate.toISOString().split('T')[0],
        end: weekEndDate.toISOString().split('T')[0]
      },
      summary: {
        totalVisits: data.totalVisits,
        totalLeads: data.totalLeads,
        totalConversions: data.totalConversions,
        totalRevenue: data.totalRevenue,
        avgDailyVisits: Math.round(data.totalVisits / 7),
        weekOverWeekGrowth: data.weekOverWeekGrowth
      },
      trends: data.dailyTrends,
      channelPerformance: data.channelPerformance,
      topCampaigns: data.topCampaigns,
      leadQuality: data.leadQualityDistribution,
      insights: this.generateWeeklyInsights(data),
      recommendations: this.generateRecommendations(data)
    }

    return report
  }

  /**
   * 生成营销月报
   */
  async generateMonthlyReport(year, month) {
    const data = await this.fetchMonthlyData(year, month)
    
    const report = {
      type: 'monthly',
      period: `${year}-${String(month).padStart(2, '0')}`,
      executiveSummary: {
        keyMetrics: data.keyMetrics,
        achievements: data.achievements,
        challenges: data.challenges
      },
      performance: {
        overall: data.overallPerformance,
        byChannel: data.channelPerformance,
        byCampaign: data.campaignPerformance,
        byRegion: data.regionPerformance
      },
      leadAnalysis: {
        total: data.totalLeads,
        byGrade: data.leadsByGrade,
        conversionFunnel: data.conversionFunnel,
        averageLeadScore: data.avgLeadScore
      },
      roi: {
        totalSpent: data.totalMarketing Spend,
        totalRevenue: data.totalRevenue,
        roi: data.roi,
        costPerLead: data.costPerLead,
        costPerAcquisition: data.costPerAcquisition
      },
      forecast: data.nextMonthForecast,
      strategicRecommendations: this.generateStrategicRecommendations(data)
    }

    return report
  }

  /**
   * 导出为PDF
   */
  async exportToPDF(report) {
    const doc = new jsPDF()
    let yPos = 20

    // 标题
    doc.setFontSize(20)
    doc.text(`营销${this.getReportTypeLabel(report.type)}报告`, 20, yPos)
    yPos += 15

    // 日期
    doc.setFontSize(12)
    const periodText = report.date || report.period.start + ' 至 ' + report.period.end || report.period
    doc.text(`报告周期：${periodText}`, 20, yPos)
    yPos += 20

    // 摘要部分
    doc.setFontSize(16)
    doc.text('核心指标', 20, yPos)
    yPos += 10

    doc.setFontSize(12)
    const summary = report.summary || report.executiveSummary?.keyMetrics
    if (summary) {
      Object.entries(summary).forEach(([key, value]) => {
        const label = this.formatLabel(key)
        doc.text(`${label}: ${this.formatValue(value)}`, 30, yPos)
        yPos += 8
      })
    }

    // 更多内容...
    // （实际应用中会更详细）

    // 生成PDF Blob
    const pdfBlob = doc.output('blob')
    return pdfBlob
  }

  /**
   * 导出为Excel
   */
  async exportToExcel(report) {
    const workbook = XLSX.utils.book_new()

    // 摘要sheet
    const summaryData = this.convertToTableData(report.summary || report.executiveSummary)
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(workbook, summarySheet, '摘要')

    // 渠道sheet
    if (report.channels || report.performance?.byChannel) {
      const channelData = this.convertToTableData(report.channels || report.performance.byChannel)
      const channelSheet = XLSX.utils.aoa_to_sheet(channelData)
      XLSX.utils.book_append_sheet(workbook, channelSheet, '渠道分析')
    }

    // 趋势sheet
    if (report.trends) {
      const trendData = this.convertToTableData(report.trends)
      const trendSheet = XLSX.utils.aoa_to_sheet(trendData)
      XLSX.utils.book_append_sheet(workbook, trendSheet, '趋势分析')
    }

    // 生成Excel Buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    
    return excelBlob
  }

  /**
   * 定时发送报告
   */
  scheduleReport(config) {
    const schedule = {
      id: this.generateId(),
      reportType: config.reportType, // 'daily', 'weekly', 'monthly'
      recipients: config.recipients, // 邮箱列表
      frequency: config.frequency, // 'daily', 'weekly', 'monthly'
      dayOfWeek: config.dayOfWeek, // 周报：0-6 (周日到周六)
      dayOfMonth: config.dayOfMonth, // 月报：1-31
      time: config.time, // '09:00'
      format: config.format, // 'pdf', 'excel', 'both'
      active: true,
      createdAt: new Date(),
      lastSent: null,
      nextSend: this.calculateNextSendTime(config)
    }

    this.scheduledReports.push(schedule)
    this.saveSchedule(schedule)
    
    return schedule
  }

  /**
   * 计算下次发送时间
   */
  calculateNextSendTime(config) {
    const now = new Date()
    const [hours, minutes] = config.time.split(':')
    const nextSend = new Date()
    nextSend.setHours(parseInt(hours), parseInt(minutes), 0, 0)

    if (config.frequency === 'daily') {
      if (nextSend <= now) {
        nextSend.setDate(nextSend.getDate() + 1)
      }
    } else if (config.frequency === 'weekly') {
      const targetDay = config.dayOfWeek
      const currentDay = now.getDay()
      const daysUntilTarget = (targetDay - currentDay + 7) % 7
      nextSend.setDate(now.getDate() + (daysUntilTarget || 7))
    } else if (config.frequency === 'monthly') {
      nextSend.setDate(config.dayOfMonth)
      if (nextSend <= now) {
        nextSend.setMonth(nextSend.getMonth() + 1)
      }
    }

    return nextSend
  }

  /**
   * 执行定时任务
   */
  async executeScheduledReports() {
    const now = new Date()
    
    for (const schedule of this.scheduledReports) {
      if (!schedule.active) continue
      
      if (schedule.nextSend <= now) {
        await this.sendScheduledReport(schedule)
        
        // 更新下次发送时间
        schedule.lastSent = now
        schedule.nextSend = this.calculateNextSendTime(schedule)
        this.saveSchedule(schedule)
      }
    }
  }

  /**
   * 发送定时报告
   */
  async sendScheduledReport(schedule) {
    try {
      // 生成报告
      let report
      if (schedule.reportType === 'daily') {
        report = await this.generateDailyReport()
      } else if (schedule.reportType === 'weekly') {
        report = await this.generateWeeklyReport()
      } else if (schedule.reportType === 'monthly') {
        const now = new Date()
        report = await this.generateMonthlyReport(now.getFullYear(), now.getMonth() + 1)
      }

      // 导出文件
      const attachments = []
      
      if (schedule.format === 'pdf' || schedule.format === 'both') {
        const pdfBlob = await this.exportToPDF(report)
        attachments.push({
          filename: `${report.type}_report_${report.date || report.period}.pdf`,
          content: pdfBlob
        })
      }
      
      if (schedule.format === 'excel' || schedule.format === 'both') {
        const excelBlob = await this.exportToExcel(report)
        attachments.push({
          filename: `${report.type}_report_${report.date || report.period}.xlsx`,
          content: excelBlob
        })
      }

      // 发送邮件
      await this.sendEmail({
        to: schedule.recipients,
        subject: `${this.getReportTypeLabel(report.type)}营销报告 - ${report.date || report.period}`,
        html: this.generateEmailHTML(report),
        attachments
      })

      console.log(`报告已发送: ${schedule.id}`)
    } catch (error) {
      console.error(`报告发送失败: ${schedule.id}`, error)
    }
  }

  /**
   * 订阅管理
   */
  subscribe(email, reportTypes) {
    const subscription = {
      id: this.generateId(),
      email,
      reportTypes, // ['daily', 'weekly', 'monthly']
      createdAt: new Date(),
      active: true
    }

    this.subscriptions.push(subscription)
    this.saveSubscription(subscription)
    
    return subscription
  }

  /**
   * 取消订阅
   */
  unsubscribe(subscriptionId) {
    const subscription = this.subscriptions.find(s => s.id === subscriptionId)
    if (subscription) {
      subscription.active = false
      this.saveSubscription(subscription)
    }
  }

  /**
   * 生成亮点
   */
  generateHighlights(data) {
    const highlights = []

    if (data.visits > data.previousVisits) {
      const growth = ((data.visits - data.previousVisits) / data.previousVisits * 100).toFixed(1)
      highlights.push(`访问量增长${growth}%`)
    }

    if (data.conversions > data.previousConversions) {
      highlights.push(`转化数较昨日增加${data.conversions - data.previousConversions}个`)
    }

    // 识别最佳渠道
    const bestChannel = data.channelBreakdown.reduce((best, channel) => 
      channel.roi > (best?.roi || 0) ? channel : best
    , null)
    if (bestChannel) {
      highlights.push(`${bestChannel.name}渠道ROI达${bestChannel.roi}%`)
    }

    return highlights
  }

  /**
   * 生成告警
   */
  generateAlerts(data) {
    const alerts = []

    if (data.visits < data.previousVisits * 0.8) {
      alerts.push({
        level: 'warning',
        message: '访问量大幅下降，建议检查广告投放'
      })
    }

    if (data.conversionRate < 2) {
      alerts.push({
        level: 'warning',
        message: '转化率偏低，建议优化落地页'
      })
    }

    return alerts
  }

  /**
   * 生成周报洞察
   */
  generateWeeklyInsights(data) {
    return [
      `本周总访问量${data.totalVisits}，较上周${data.weekOverWeekGrowth > 0 ? '增长' : '下降'}${Math.abs(data.weekOverWeekGrowth)}%`,
      `线索质量改善，A级线索占比提升至${data.leadQualityDistribution.A}%`,
      `${data.topCampaigns[0].name}活动表现优异，ROI达${data.topCampaigns[0].roi}%`
    ]
  }

  /**
   * 生成建议
   */
  generateRecommendations(data) {
    return [
      {
        priority: 'high',
        recommendation: '增加LinkedIn广告预算',
        reason: 'ROI最高，达520%',
        expectedImpact: '预计增加30%线索'
      },
      {
        priority: 'medium',
        recommendation: '优化SEO策略',
        reason: '自然流量增长放缓',
        expectedImpact: '长期流量提升20-30%'
      }
    ]
  }

  /**
   * 生成战略建议
   */
  generateStrategicRecommendations(data) {
    return [
      '建议Q4加大国际市场投入，尤其是欧美市场',
      '考虑与行业KOL合作，提升品牌影响力',
      '开发更多垂直行业解决方案内容'
    ]
  }

  // 辅助方法
  async fetchDailyData(date) {
    // 实际应调用API获取数据
    return {
      visits: 4250,
      leads: 125,
      conversions: 32,
      revenue: 1600000,
      previousVisits: 3980,
      previousConversions: 28,
      channelBreakdown: [],
      topPages: []
    }
  }

  async fetchWeeklyData(start, end) {
    // 模拟数据
    return {
      totalVisits: 28540,
      totalLeads: 856,
      totalConversions: 218,
      totalRevenue: 10900000,
      weekOverWeekGrowth: 15.3,
      dailyTrends: [],
      channelPerformance: [],
      topCampaigns: [
        { name: 'LinkedIn广告', roi: 520 }
      ],
      leadQualityDistribution: { A: 25, B: 35, C: 30, D: 10 }
    }
  }

  async fetchMonthlyData(year, month) {
    // 模拟数据
    return {
      keyMetrics: {},
      achievements: [],
      challenges: [],
      overallPerformance: {},
      channelPerformance: [],
      roi: 385
    }
  }

  getReportTypeLabel(type) {
    const labels = { daily: '日', weekly: '周', monthly: '月' }
    return labels[type] || type
  }

  formatLabel(key) {
    const labels = {
      visits: '访问量',
      leads: '线索数',
      conversions: '转化数',
      revenue: '收入'
    }
    return labels[key] || key
  }

  formatValue(value) {
    if (typeof value === 'number') {
      return value.toLocaleString()
    }
    return value
  }

  convertToTableData(obj) {
    if (Array.isArray(obj)) {
      const headers = Object.keys(obj[0] || {})
      const rows = obj.map(item => headers.map(h => item[h]))
      return [headers, ...rows]
    }
    
    return Object.entries(obj).map(([key, value]) => [this.formatLabel(key), this.formatValue(value)])
  }

  generateEmailHTML(report) {
    return `
      <html>
        <body>
          <h1>${this.getReportTypeLabel(report.type)}营销报告</h1>
          <p>报告周期：${report.date || report.period}</p>
          <p>详细数据请查看附件。</p>
        </body>
      </html>
    `
  }

  async sendEmail(config) {
    // 调用邮件API
    await fetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    })
  }

  generateId() {
    return `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  saveSchedule(schedule) {
    // 保存到数据库
    localStorage.setItem(`schedule_${schedule.id}`, JSON.stringify(schedule))
  }

  saveSubscription(subscription) {
    // 保存到数据库
    localStorage.setItem(`subscription_${subscription.id}`, JSON.stringify(subscription))
  }
}

// 导出单例
export const reportingSystem = new AutomatedReportingSystem()

// 启动定时任务（每小时检查一次）
setInterval(() => {
  reportingSystem.executeScheduledReports()
}, 60 * 60 * 1000)
