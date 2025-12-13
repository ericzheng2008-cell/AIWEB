import { defineStore } from 'pinia'
import router from '../router'

export const useAiChatStore = defineStore('aiChat', {
  state: () => ({
    messages: [],
    isTyping: false,
    chatVisible: false,
    // 智能体功能映射表
    agentFunctions: {
      toolSelection: {
        keywords: ['扭矩', '工具选型', '选工具', '推荐工具', '扭矩工具', '电动工具', '气动工具', '拧紧工具', 'torque', 'tool selection', 'recommend tool'],
        route: '/tool-selector',
        name: '扭矩工具选型',
        description: '根据您的装配需求，智能推荐最适合的扭矩工具',
        answer: '我可以帮您进行扭矩工具选型！\n\n通过智能分析，我会根据：\n✓ 扭矩需求范围\n✓ 工作环境（空间限制、噪音要求）\n✓ 使用频率\n✓ 预算范围\n\n为您推荐最适合的电动或气动拧紧工具。'
      },
      socketSelection: {
        keywords: ['套筒', '套筒选型', '配件', '接杆', '四方', '六角', 'socket', 'socket selection', 'hex'],
        route: '/socket-selector',
        name: '套筒配件选型',
        description: '根据工具和螺栓规格，智能匹配最适合的套筒配件',
        answer: '我可以帮您选择合适的套筒配件！\n\n我会根据：\n✓ 工具品牌和型号\n✓ 四方尺寸（1/4、3/8、1/2等）\n✓ 螺栓类型和尺寸\n✓ 特殊要求（抗振、密封圈、磁性等）\n\n为您匹配最合适的套筒配件。'
      },
      brandMatch: {
        keywords: ['品牌', '型号', '品牌匹配', '工具型号', '博世', '阿特拉斯', 'EQTCF', 'brand', 'model', 'bosch'],
        route: '/tool-brand-match',
        name: '品牌型号匹配',
        description: '智能匹配符合要求的工具品牌和具体型号',
        answer: '我可以帮您匹配品牌和型号！\n\n基于您的需求：\n✓ 工具类型（锂电池、有线电动）\n✓ 控制方式（离合器、油压脉冲、电脉冲、直驱）\n✓ 扭矩范围\n✓ 特殊要求（便携性、数字化）\n\n推荐最匹配的品牌和型号。'
      },
      tighteningStrategy: {
        keywords: ['拧紧策略', '拧紧顺序', '装配顺序', '拧紧方法', '对称拧紧', '交叉拧紧', '工艺优化', 'tightening strategy', 'tightening sequence', 'assembly'],
        route: '/tightening-strategy',
        name: '拧紧策略优化',
        description: '优化拧紧顺序和方式，提升装配质量',
        answer: '我可以帮您优化拧紧策略！\n\n专业分析：\n✓ 拧紧顺序优化（对称、交叉、螺旋）\n✓ 拧紧参数设置\n✓ 多螺栓装配方案\n✓ 防止过拧/欠拧\n\n提供可视化的拧紧路径和详细策略建议。'
      },
      curveAnalysis: {
        keywords: ['拧紧曲线', '曲线分析', '曲线对比', '滑牙', '过扭矩', '粘滑', '扭矩衰减', '螺纹失效', 'curve analysis', 'torque curve', 'slip'],
        route: '/curve-analysis',
        name: '拧紧曲线分析',
        description: '智能分析拧紧曲线，识别滑牙、粘滑等装配问题',
        answer: '我可以帮您分析拧紧曲线！\n\n专业诊断：\n✓ 对比分析标准曲线vs采集曲线\n✓ 识别滑牙、粘滑、压溃等异常\n✓ 分析扭矩衰减原因\n✓ 考虑材质、转速等多种因素\n✓ 支持同时对比100条曲线\n\n导入CSV格式曲线文件即可开始分析。'
      },
      costOptimization: {
        keywords: ['成本', '成本优化', '节省', '省钱', '投资回报', 'ROI', '降本', '预算', 'cost', 'save money', 'optimization', 'budget'],
        route: '/cost-optimization',
        name: '成本优化分析',
        description: '平衡质量与成本，提供最优采购和使用方案',
        answer: '我可以帮您进行成本优化分析！\n\n全面评估：\n✓ 采购成本分析\n✓ 运营成本（能耗、维护）\n✓ TCO总拥有成本\n✓ ROI投资回报率\n✓ 性价比对比\n\n提供数据化的决策支持和优化建议。'
      },
      deviceStatus: {
        keywords: ['设备', '设备状态', '在线', '离线', '故障', '监控', '设备查询', '运行状态', 'device', 'equipment', 'status', 'online', 'offline', 'fault'],
        route: '/device-status',
        name: '在线设备查询',
        description: '实时查看设备运行状态和健康度',
        answer: '我可以帮您查询设备状态！\n\n实时监控：\n✓ 设备在线/离线状态\n✓ 健康度评分\n✓ 运行时长统计\n✓ 故障预警\n✓ 维护记录\n\n让您随时掌握设备运行情况。'
      },
      faultTracking: {
        keywords: ['工单', '维修工单', '故障工单', '维修追踪', '维修记录', '维修进度', '工单查询', '报修', 'work order', 'repair', 'maintenance', 'tracking', 'fault ticket'],
        route: '/fault-tracking',
        name: '故障工单管理',
        description: '创建、查询和管理维修工单，追踪维修进度',
        answer: '我可以帮您管理故障工单！\n\n功能包括：\n✓ 创建维修工单\n✓ 工单状态跟踪\n✓ 维修进度查询\n✓ 工单历史记录\n✓ 维修人员分配\n\n让您全程掌握维修流程。'
      },
      maintenanceHistory: {
        keywords: ['维修历史', '历史记录', '维修记录查询', '历史工单', '过往维修', 'history', 'maintenance history', 'repair history', 'past records'],
        route: '/maintenance-history',
        name: '维修历史记录',
        description: '查询历史维修记录，分析维修趋势',
        answer: '我可以帮您查询维修历史！\n\n数据分析：\n✓ 历史工单查询\n✓ 维修趋势分析\n✓ 设备维修频率\n✓ 维修成本统计\n✓ 可视化图表展示\n\n帮您发现潜在问题和优化空间。'
      },
      faultStatistics: {
        keywords: ['故障统计', '故障率', '故障分析', '数据分析', '统计报告', 'statistics', 'fault rate', 'fault analysis', 'data analysis', 'report'],
        route: '/fault-statistics',
        name: '故障率统计分析',
        description: '全面的故障数据统计和分析',
        answer: '我可以帮您进行故障统计分析！\n\n深度分析：\n✓ 故障率统计\n✓ 设备健康评分\n✓ 维修效率分析\n✓ 成本结构分析\n✓ 故障预警提示\n\n提供数据化的决策支持。'
      },
      equipmentLifecycle: {
        keywords: ['设备生命周期', '设备档案', '设备管理', 'ROI', '投资回报', '保养预测', '成本分析', '全生命周期', 'equipment lifecycle', 'asset management', 'ROI analysis', 'maintenance prediction'],
        route: '/equipment-lifecycle',
        name: '设备全生命周期管理',
        description: '关键设备资产管理、ROI分析、保养预测、成本优化',
        answer: '我可以帮您进行设备全生命周期管理！\n\n核心功能：\n✓ 设备档案管理（6大类关键设备）\n✓ ROI投资回报率计算\n✓ AI保养预测（基于运行数据）\n✓ 服务成本动态采集\n✓ 全生命周期追踪\n✓ 降本增效分析\n\n实现设备资产的精细化管理。'
      }
    },
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
      
      // 优先匹配智能体功能
      for (const [key, func] of Object.entries(this.agentFunctions)) {
        const matched = func.keywords.some(keyword => 
          lowerQuestion.includes(keyword.toLowerCase())
        )
        
        if (matched) {
          const answer = locale === 'en-US' ? 
            `I can help you with ${func.name}!\n\n${func.description}\n\nWould you like me to open this feature for you?` :
            `${func.answer}\n\n💡 是否需要我为您打开【${func.name}】功能？`
          
          // 存储匹配到的功能，用于后续跳转
          this.lastMatchedRoute = func.route
          return answer
        }
      }
      
      // 然后匹配知识库
      for (const [category, data] of Object.entries(this.knowledgeBase)) {
        const matched = data.keywords.some(keyword => 
          lowerQuestion.includes(keyword.toLowerCase())
        )
        
        if (matched) {
          return data.answers[locale] || data.answers['zh-CN']
        }
      }

      // 智能模糊匹配
      const fuzzyMatch = this.fuzzyMatch(lowerQuestion, locale)
      if (fuzzyMatch) {
        return fuzzyMatch
      }

      // 默认回复
      const defaultAnswers = {
        'zh-CN': '感谢您的咨询！😊\n\n我可以帮您：\n\n🔧 工具选型相关：\n• 扭矩工具选型\n• 套筒配件选型\n• 品牌型号匹配\n\n⚙️ 工艺优化相关：\n• 拧紧策略优化\n• 成本优化分析\n\n📊 服务支持相关：\n• 在线设备查询\n• 故障追踪\n• 保养计划\n\n您可以直接问我，比如：\n"我需要选择合适的扭矩工具"\n"帮我优化拧紧策略"\n"查看设备运行状态"\n\n或者拨打服务热线：400-123-4567',
        'en-US': 'Thank you for your inquiry! 😊\n\nI can help you with:\n\n🔧 Tool Selection:\n• Torque Tool Selection\n• Socket Selection\n• Brand Model Matching\n\n⚙️ Process Optimization:\n• Tightening Strategy\n• Cost Optimization\n\n📊 Service Support:\n• Device Status Query\n• Fault Tracking\n• Maintenance Planning\n\nYou can ask me directly, for example:\n"I need to select a suitable torque tool"\n"Help me optimize tightening strategy"\n"Check device running status"\n\nOr call our hotline: 400-123-4567'
      }

      return defaultAnswers[locale] || defaultAnswers['zh-CN']
    },

    // 模糊匹配功能
    fuzzyMatch(question, locale) {
      const patterns = {
        tool: ['选', '推荐', '需要', '想要', '找', '什么工具', 'select', 'recommend', 'need', 'want'],
        strategy: ['怎么拧', '如何装配', '拧紧方法', '安装顺序', 'how to tighten', 'assembly method'],
        cost: ['便宜', '价格', '多少钱', '节约', 'cheap', 'price', 'how much', 'save'],
        device: ['查看', '检查', '状态', '运行', 'check', 'view', 'status', 'running']
      }

      for (const [category, keywords] of Object.entries(patterns)) {
        const matched = keywords.some(kw => question.includes(kw.toLowerCase()))
        if (matched) {
          if (category === 'tool') {
            this.lastMatchedRoute = '/tool-selector'
            return locale === 'zh-CN' ?
              '我理解您需要工具选型服务！\n\n我们有三种选型工具：\n1️⃣ 扭矩工具选型 - 推荐合适的拧紧工具\n2️⃣ 套筒配件选型 - 匹配套筒和配件\n3️⃣ 品牌型号匹配 - 推荐具体品牌型号\n\n💡 是否需要我为您打开【扭矩工具选型】功能？' :
              'I understand you need tool selection service!\n\nWe have three selection tools:\n1️⃣ Torque Tool Selection\n2️⃣ Socket Selection\n3️⃣ Brand Model Matching\n\nWould you like me to open the Tool Selection feature?'
          } else if (category === 'strategy') {
            this.lastMatchedRoute = '/tightening-strategy'
            return locale === 'zh-CN' ?
              '我可以帮您优化拧紧策略！\n\n包括：\n• 拧紧顺序规划\n• 拧紧参数设置\n• 装配工艺优化\n\n💡 是否需要我为您打开【拧紧策略优化】功能？' :
              'I can help optimize your tightening strategy!\n\nIncluding:\n• Tightening sequence planning\n• Parameter settings\n• Assembly process optimization\n\nWould you like me to open the Tightening Strategy feature?'
          } else if (category === 'cost') {
            this.lastMatchedRoute = '/cost-optimization'
            return locale === 'zh-CN' ?
              '我可以帮您进行成本优化分析！\n\n分析内容：\n• 采购成本\n• 运营成本\n• TCO总拥有成本\n• ROI投资回报率\n\n💡 是否需要我为您打开【成本优化分析】功能？' :
              'I can help with cost optimization analysis!\n\nAnalysis includes:\n• Procurement cost\n• Operating cost\n• TCO (Total Cost of Ownership)\n• ROI (Return on Investment)\n\nWould you like me to open the Cost Optimization feature?'
          } else if (category === 'device') {
            this.lastMatchedRoute = '/device-status'
            return locale === 'zh-CN' ?
              '我可以帮您查询设备状态！\n\n包括：\n• 在线/离线状态\n• 健康度评分\n• 运行时长\n• 故障预警\n\n💡 是否需要我为您打开【在线设备查询】功能？' :
              'I can help check device status!\n\nIncluding:\n• Online/Offline status\n• Health score\n• Running time\n• Fault alerts\n\nWould you like me to open the Device Status feature?'
          }
        }
      }

      return null
    },

    // 跳转到智能体功能
    navigateToFunction(route) {
      if (route) {
        router.push(route)
        this.chatVisible = false
        return true
      } else if (this.lastMatchedRoute) {
        router.push(this.lastMatchedRoute)
        this.chatVisible = false
        this.lastMatchedRoute = null
        return true
      }
      return false
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
