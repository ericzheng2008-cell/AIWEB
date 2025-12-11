import { defineStore } from 'pinia'

export const useAiChatStore = defineStore('aiChat', {
  state: () => ({
    messages: [],
    isTyping: false,
    chatVisible: false,
    knowledgeBase: {
      products: {
        keywords: ['产品', '工具', '设备', 'product', 'tool', 'equipment'],
        answers: {
          'zh-CN': '我们主要提供以下产品和服务：\n\n1. 自动化设备：SCA自动涂胶机、SPR FDS整机、Gudel七轴机器人等\n2. 工业工具：Bosch博世电池工具、Dynabra气动打磨工具、Beta手动工具\n3. 定制工装夹具：托盘、台车、夹具及NC多轴柔性工装\n4. 工业配套配件：电梯配件、五金配件、液压润滑系统\n5. 节能环保方案：焊机智能化节能系统\n6. 服务方案：AI视觉检测、MES系统、拧紧装配工作站\n\n需要了解具体产品详情吗？',
          'en-US': 'We mainly provide the following products and services:\n\n1. Automation Equipment: SCA automatic gluing machine, SPR FDS complete machine, Gudel 7-axis robot, etc.\n2. Industrial Tools: Bosch battery tools, Dynabra pneumatic grinding tools, Beta hand tools\n3. Custom Tooling & Fixtures: Pallets, trolleys, fixtures and NC multi-axis flexible tooling\n4. Industrial Supporting Parts: Elevator parts, hardware parts, hydraulic lubrication systems\n5. Energy Saving Solutions: Welding machine intelligent energy saving system\n6. Service Solutions: AI vision inspection, MES system, tightening assembly workstation\n\nWould you like to know more about specific products?'
        }
      },
      divisions: {
        keywords: ['事业部', '部门', 'division', 'department', 'business unit'],
        answers: {
          'zh-CN': '明升伟业设有以下9大事业部：\n\n1. 工业智能装配事业部：提供SCA涂胶机、Bosch工具、Gudel机器人等\n2. 工业智能智造事业部：AGV、协作机器人、AI视觉检测等\n3. 工业配套事业部：电梯配件、五金配件、液压系统\n4. 动力装配事业部：电池定扭扳手、扭矩检测仪、MES系统\n5. 汽车部件事业部：汽车零部件供应\n6. 明升科技事业部：研发创新\n7. 刀具油品事业部：润滑油脂、切削液、机加工刀具\n8. 网营事业部：网络营销服务\n9. 研发部：技术研发与创新\n\n您想了解哪个事业部的详细信息？',
          'en-US': 'Mingsheng has 9 business divisions:\n\n1. Industrial Intelligent Assembly: SCA gluing machines, Bosch tools, Gudel robots, etc.\n2. Industrial Intelligent Production: AGV, collaborative robots, AI vision inspection, etc.\n3. Industry OEM Division: Elevator parts, hardware parts, hydraulic systems\n4. Power Assembly Division: Battery torque wrenches, torque testers, MES systems\n5. Automobile Parts Division: Auto parts supply\n6. Mingsheng Technology: R&D and innovation\n7. Oils and Cutting Tools: Lubricants, cutting fluids, machining tools\n8. Network Marketing Division: Online marketing services\n9. R&D Department: Technology development and innovation\n\nWhich division would you like to know more about?'
        }
      },
      applications: {
        keywords: ['应用', '案例', '方案', 'application', 'case', 'solution'],
        answers: {
          'zh-CN': '我们提供以下7大应用解决方案：\n\n1. 协作机器人应用：拧紧、打磨、吸尘、搬运、监测\n2. 自动化系统：AGV、立体库、焊装定位系统\n3. 台架系统：定制化台车、夹具、托盘、柔性工装\n4. AI视觉检测：车身解体、漆面焊点焊缝检验\n5. 节能环保：焊机智能化节能系统\n6. 降本增效：MES系统、拧紧管理软件、数据采集\n7. AI人工智能：预测性维护、质量预测、智能排产\n\n主要应用于汽车制造、3C电子、机械加工等行业。需要详细了解某个方案吗？',
          'en-US': 'We provide 7 major application solutions:\n\n1. Collaborative Robot Applications: Tightening, grinding, vacuuming, handling, monitoring\n2. Automation Systems: AGV, AS/RS, welding positioning systems\n3. Rack Systems: Customized trolleys, fixtures, pallets, flexible tooling\n4. AI Vision Inspection: Body disassembly, paint surface weld spot inspection\n5. Energy Saving: Welding machine intelligent energy saving system\n6. Cost Reduction: MES system, tightening management software, data collection\n7. AI Applications: Predictive maintenance, quality prediction, intelligent scheduling\n\nMainly applied in automotive manufacturing, 3C electronics, machining, etc. Would you like to know more about any solution?'
        }
      },
      contact: {
        keywords: ['联系', '电话', '邮箱', '地址', 'contact', 'phone', 'email', 'address'],
        answers: {
          'zh-CN': '联系方式如下：\n\n📞 服务热线：400-123-4567\n📧 邮箱：sales@mingsheng.com\n📍 地址：广州市天河区珠江新城\n\n我们在全国多地设有办事处：\n- 华南：广州（总部）\n- 华中：长沙、株洲、常德、武汉、宜昌\n- 华东：杭州、上海\n- 西南：柳州\n\n您可以直接拨打热线，我们的销售团队会为您提供专业服务！',
          'en-US': 'Contact information:\n\n📞 Hotline: 400-123-4567\n📧 Email: sales@mingsheng.com\n📍 Address: Tianhe District, Guangzhou, China\n\nWe have offices nationwide:\n- South China: Guangzhou (HQ)\n- Central China: Changsha, Zhuzhou, Changde, Wuhan, Yichang\n- East China: Hangzhou, Shanghai\n- Southwest: Liuzhou\n\nPlease call our hotline directly, our sales team will provide professional service!'
        }
      },
      cooperation: {
        keywords: ['合作', '代理', '经销', '加盟', 'cooperation', 'partner', 'agent', 'distributor'],
        answers: {
          'zh-CN': '感谢您对明升伟业的关注！\n\n我们欢迎以下合作方式：\n\n1. 区域代理商：享受区域保护和价格优惠\n2. 项目合作：针对大型项目提供定制化方案\n3. 技术合作：共同研发创新产品\n4. OEM/ODM：提供贴牌和定制服务\n\n合作优势：\n✓ 28年行业经验\n✓ IATF16949认证\n✓ 欧美高端品牌资源\n✓ 全方位技术支持\n✓ 完善的培训体系\n\n请联系我们的商务部：\n📧 business@mingsheng.com\n📞 400-123-4567（转商务部）',
          'en-US': 'Thank you for your interest in Mingsheng!\n\nWe welcome the following cooperation:\n\n1. Regional Agents: Enjoy regional protection and price discounts\n2. Project Cooperation: Customized solutions for large projects\n3. Technical Cooperation: Co-develop innovative products\n4. OEM/ODM: Provide OEM and customization services\n\nCooperation Advantages:\n✓ 28 years industry experience\n✓ IATF16949 certification\n✓ European & American brand resources\n✓ Comprehensive technical support\n✓ Perfect training system\n\nPlease contact our business department:\n📧 business@mingsheng.com\n📞 400-123-4567 (Business Dept.)'
        }
      },
      service: {
        keywords: ['服务', '售后', '保修', '维护', 'service', 'after-sales', 'warranty', 'maintenance'],
        answers: {
          'zh-CN': '我们提供全方位的服务支持：\n\n🔧 售前服务：\n- 免费技术咨询\n- 方案设计与评估\n- 样机试用\n- 现场勘察\n\n🛠️ 售中服务：\n- 专业安装调试\n- 操作培训\n- 技术指导\n\n💯 售后服务：\n- 质保期内免费维修\n- 终身技术支持\n- 配件供应保障\n- 定期回访检查\n- 7×24小时热线支持\n\n📞 服务热线：400-123-4567\n我们在全国9个城市设有服务网点，响应迅速！',
          'en-US': 'We provide comprehensive service support:\n\n🔧 Pre-sales Service:\n- Free technical consultation\n- Solution design and evaluation\n- Prototype trial\n- On-site inspection\n\n🛠️ Sales Service:\n- Professional installation and commissioning\n- Operation training\n- Technical guidance\n\n💯 After-sales Service:\n- Free repair during warranty period\n- Lifetime technical support\n- Spare parts supply guarantee\n- Regular follow-up inspections\n- 7×24 hotline support\n\n📞 Service Hotline: 400-123-4567\nWe have service outlets in 9 cities nationwide for quick response!'
        }
      },
      customization: {
        keywords: ['定制', '非标', '设计', 'custom', 'customization', 'design', 'bespoke'],
        answers: {
          'zh-CN': '我们提供专业的定制化服务：\n\n🎨 定制范围：\n1. 工装夹具定制：根据产品特点设计专用夹具\n2. 自动化方案定制：定制化产线设计\n3. 软件系统定制：MES、数据采集等系统开发\n4. 非标设备定制：特殊工况设备设计制造\n\n⚙️ 定制流程：\n1. 需求沟通 → 2. 方案设计 → 3. 评审确认 → 4. 样机制作 → 5. 测试验收 → 6. 批量生产\n\n✨ 我们的优势：\n- 专业研发团队\n- 丰富项目经验\n- 快速响应周期\n- 完善的质量体系\n\n欢迎联系我们讨论您的定制需求！',
          'en-US': 'We provide professional customization services:\n\n🎨 Customization Scope:\n1. Tooling & Fixtures: Design special fixtures based on product characteristics\n2. Automation Solutions: Customized production line design\n3. Software Systems: MES, data collection system development\n4. Non-standard Equipment: Design and manufacture for special conditions\n\n⚙️ Customization Process:\n1. Requirement Communication → 2. Solution Design → 3. Review Confirmation → 4. Prototype Production → 5. Testing Acceptance → 6. Mass Production\n\n✨ Our Advantages:\n- Professional R&D team\n- Rich project experience\n- Fast response time\n- Perfect quality system\n\nWelcome to contact us to discuss your customization needs!'
        }
      }
    }
  }),

  actions: {
    addMessage(message) {
      this.messages.push({
        ...message,
        id: Date.now(),
        timestamp: new Date()
      })
    },

    async sendMessage(content, locale = 'zh-CN') {
      // 添加用户消息
      this.addMessage({
        type: 'user',
        content
      })

      // 显示输入中状态
      this.isTyping = true

      // 模拟AI思考时间
      await new Promise(resolve => setTimeout(resolve, 1000))

      // 智能匹配答案
      const answer = this.matchAnswer(content, locale)

      // 添加AI回复
      this.addMessage({
        type: 'ai',
        content: answer
      })

      this.isTyping = false
    },

    matchAnswer(question, locale) {
      const lowerQuestion = question.toLowerCase()
      
      // 遍历知识库匹配关键词
      for (const [category, data] of Object.entries(this.knowledgeBase)) {
        const matched = data.keywords.some(keyword => 
          lowerQuestion.includes(keyword.toLowerCase())
        )
        
        if (matched) {
          return data.answers[locale] || data.answers['zh-CN']
        }
      }

      // 默认回复
      const defaultAnswers = {
        'zh-CN': '感谢您的咨询！您的问题我会记录下来。\n\n为了更好地帮助您，建议您：\n1. 查看我们的产品中心了解详细信息\n2. 浏览应用案例了解实际应用\n3. 直接拨打服务热线 400-123-4567\n4. 发送邮件至 sales@mingsheng.com\n\n我们的专业团队会为您提供详细解答！',
        'en-US': 'Thank you for your inquiry! I will record your question.\n\nTo better assist you, we recommend:\n1. Check our Products Center for details\n2. Browse Application Cases for practical applications\n3. Call our service hotline 400-123-4567\n4. Email us at sales@mingsheng.com\n\nOur professional team will provide detailed answers!'
      }

      return defaultAnswers[locale] || defaultAnswers['zh-CN']
    },

    clearMessages() {
      this.messages = []
    },

    toggleChat() {
      this.chatVisible = !this.chatVisible
    },

    // 学习功能：添加新的知识
    addKnowledge(category, keywords, answers) {
      if (!this.knowledgeBase[category]) {
        this.knowledgeBase[category] = {
          keywords: [],
          answers: {}
        }
      }
      
      this.knowledgeBase[category].keywords.push(...keywords)
      Object.assign(this.knowledgeBase[category].answers, answers)
    }
  }
})
