/**
 * 多渠道集成系统
 * 支持WhatsApp、LinkedIn、微信等多渠道对接
 */

export class MultiChannelIntegration {
  constructor() {
    this.channels = new Map()
    this.messageQueue = []
    this.integrations = {
      whatsapp: null,
      linkedin: null,
      wechat: null,
      email: null,
      sms: null
    }
  }

  /**
   * 初始化WhatsApp集成
   */
  initWhatsApp(config) {
    this.integrations.whatsapp = {
      apiKey: config.apiKey,
      phoneNumber: config.phoneNumber,
      webhookUrl: config.webhookUrl,
      status: 'connected'
    }

    // 设置webhook监听
    this.setupWhatsAppWebhook()
    
    return {
      success: true,
      channel: 'whatsapp',
      message: 'WhatsApp集成成功'
    }
  }

  /**
   * 设置WhatsApp Webhook
   */
  setupWhatsAppWebhook() {
    // 实际应使用WhatsApp Business API
    console.log('WhatsApp webhook已设置')
  }

  /**
   * 发送WhatsApp消息
   */
  async sendWhatsAppMessage(to, message, options = {}) {
    if (!this.integrations.whatsapp) {
      throw new Error('WhatsApp未集成')
    }

    const payload = {
      to,
      type: options.type || 'text',
      message: {
        text: message.text,
        template: message.template,
        media: message.media
      },
      timestamp: new Date().toISOString()
    }

    try {
      // 调用WhatsApp Business API
      const response = await fetch('https://api.whatsapp.com/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.integrations.whatsapp.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        this.logMessage('whatsapp', 'sent', payload)
        return { success: true, messageId: response.headers.get('X-Message-Id') }
      }
    } catch (error) {
      console.error('WhatsApp发送失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 初始化LinkedIn集成
   */
  initLinkedIn(config) {
    this.integrations.linkedin = {
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      accessToken: config.accessToken,
      organizationId: config.organizationId,
      status: 'connected'
    }

    return {
      success: true,
      channel: 'linkedin',
      message: 'LinkedIn集成成功'
    }
  }

  /**
   * 发布LinkedIn内容
   */
  async postToLinkedIn(content, options = {}) {
    if (!this.integrations.linkedin) {
      throw new Error('LinkedIn未集成')
    }

    const payload = {
      author: `urn:li:organization:${this.integrations.linkedin.organizationId}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: content.text
          },
          shareMediaCategory: content.mediaUrl ? 'IMAGE' : 'NONE',
          media: content.mediaUrl ? [{
            status: 'READY',
            media: content.mediaUrl
          }] : undefined
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': options.visibility || 'PUBLIC'
      }
    }

    try {
      const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.integrations.linkedin.accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        this.logMessage('linkedin', 'posted', payload)
        return { success: true, postId: (await response.json()).id }
      }
    } catch (error) {
      console.error('LinkedIn发布失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 初始化微信集成
   */
  initWeChat(config) {
    this.integrations.wechat = {
      appId: config.appId,
      appSecret: config.appSecret,
      accessToken: null,
      tokenExpiry: null,
      status: 'connected'
    }

    // 获取access_token
    this.refreshWeChatToken()

    return {
      success: true,
      channel: 'wechat',
      message: '微信集成成功'
    }
  }

  /**
   * 刷新微信Access Token
   */
  async refreshWeChatToken() {
    const { appId, appSecret } = this.integrations.wechat

    try {
      const response = await fetch(
        `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${appSecret}`
      )
      const data = await response.json()

      if (data.access_token) {
        this.integrations.wechat.accessToken = data.access_token
        this.integrations.wechat.tokenExpiry = Date.now() + (data.expires_in * 1000)
        
        // 定时刷新（提前5分钟）
        setTimeout(() => this.refreshWeChatToken(), (data.expires_in - 300) * 1000)
      }
    } catch (error) {
      console.error('微信token刷新失败:', error)
    }
  }

  /**
   * 发送微信模板消息
   */
  async sendWeChatTemplate(openId, templateId, data, url = '') {
    if (!this.integrations.wechat || !this.integrations.wechat.accessToken) {
      throw new Error('微信未集成或token无效')
    }

    const payload = {
      touser: openId,
      template_id: templateId,
      url,
      data
    }

    try {
      const response = await fetch(
        `https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=${this.integrations.wechat.accessToken}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }
      )

      const result = await response.json()
      
      if (result.errcode === 0) {
        this.logMessage('wechat', 'sent', payload)
        return { success: true, msgId: result.msgid }
      }

      return { success: false, error: result.errmsg }
    } catch (error) {
      console.error('微信消息发送失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 统一消息发送接口
   */
  async sendMessage(channel, recipient, message, options = {}) {
    switch (channel) {
      case 'whatsapp':
        return this.sendWhatsAppMessage(recipient, message, options)
      
      case 'wechat':
        return this.sendWeChatTemplate(
          recipient,
          message.templateId,
          message.data,
          message.url
        )
      
      case 'email':
        return this.sendEmail(recipient, message, options)
      
      case 'sms':
        return this.sendSMS(recipient, message, options)
      
      default:
        throw new Error(`不支持的渠道: ${channel}`)
    }
  }

  /**
   * 发送邮件
   */
  async sendEmail(to, message, options = {}) {
    const payload = {
      to,
      subject: message.subject,
      html: message.html,
      text: message.text,
      from: options.from || 'noreply@company.com',
      cc: options.cc,
      bcc: options.bcc,
      attachments: options.attachments
    }

    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        this.logMessage('email', 'sent', payload)
        return { success: true }
      }
    } catch (error) {
      console.error('邮件发送失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 发送短信
   */
  async sendSMS(to, message, options = {}) {
    const payload = {
      to,
      message: message.text,
      sender: options.sender || 'Company'
    }

    try {
      const response = await fetch('/api/sms/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        this.logMessage('sms', 'sent', payload)
        return { success: true }
      }
    } catch (error) {
      console.error('短信发送失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 获取渠道统计
   */
  getChannelStats(channel, timeRange = 30) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - timeRange)

    const messages = this.messageQueue.filter(msg => 
      msg.channel === channel && new Date(msg.timestamp) >= cutoffDate
    )

    return {
      channel,
      totalMessages: messages.length,
      sent: messages.filter(m => m.action === 'sent').length,
      delivered: messages.filter(m => m.action === 'delivered').length,
      read: messages.filter(m => m.action === 'read').length,
      failed: messages.filter(m => m.action === 'failed').length,
      deliveryRate: this.calculateRate(
        messages.filter(m => m.action === 'delivered').length,
        messages.filter(m => m.action === 'sent').length
      ),
      readRate: this.calculateRate(
        messages.filter(m => m.action === 'read').length,
        messages.filter(m => m.action === 'delivered').length
      )
    }
  }

  /**
   * 计算比率
   */
  calculateRate(numerator, denominator) {
    return denominator > 0 ? ((numerator / denominator) * 100).toFixed(1) : 0
  }

  /**
   * 记录消息日志
   */
  logMessage(channel, action, payload) {
    this.messageQueue.push({
      channel,
      action,
      payload,
      timestamp: new Date().toISOString()
    })

    // 保存到服务器
    this.saveMessageLog({ channel, action, payload })
  }

  /**
   * 保存消息日志到服务器
   */
  async saveMessageLog(log) {
    try {
      await fetch('/api/messages/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log)
      })
    } catch (error) {
      console.error('消息日志保存失败:', error)
    }
  }

  /**
   * 获取所有渠道状态
   */
  getAllChannelsStatus() {
    return Object.keys(this.integrations).map(channel => ({
      channel,
      status: this.integrations[channel]?.status || 'disconnected',
      config: this.integrations[channel] ? 
        { ...this.integrations[channel], apiKey: '***', accessToken: '***' } : 
        null
    }))
  }

  /**
   * 断开渠道连接
   */
  disconnectChannel(channel) {
    if (this.integrations[channel]) {
      this.integrations[channel] = null
      return { success: true, message: `${channel}已断开连接` }
    }
    return { success: false, message: `${channel}未连接` }
  }
}

// 导出单例
export const multiChannelIntegration = new MultiChannelIntegration()
