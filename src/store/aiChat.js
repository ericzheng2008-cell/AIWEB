import { defineStore } from 'pinia'
import router from '../router'
import { useClassroomStore } from './classroom'

export const useAiChatStore = defineStore('aiChat', {
  state: () => ({
    messages: [],
    isTyping: false,
    chatVisible: false,
    conversationContext: {
      lastTopic: null,
      lastIntent: null,
      userName: null,
      conversationDepth: 0
    },
    // AI个性设置
    personality: {
      name: '小明',
      greeting: ['您好!我是明升智能助手小明 👋', '很高兴为您服务!我是小明 😊', '嗨!有什么我可以帮您的吗? 🌟'],
      encouragement: ['我会竭尽全力帮助您!💪', '放心交给我吧!✨', '让我们一起解决这个问题!🚀'],
      thinking: ['让我想想...🤔', '稍等,我查一下...⏳', '嗯...我来看看...👀'],
      enthusiasm: ['太好了!😄', '很棒的问题!👍', '这个我很拿手!💯']
    },
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
        keywords: ['品牌', '型号', '品牌匹配', '工具型号', '博世', 'Atlascopco', 'EQTCF', 'brand', 'model', 'bosch'],
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
      },
      equipmentDashboard: {
        keywords: ['驾驶舱', '监控中心', '数字监控', '可视化', '实时监控', '设备监控', '大屏', '仪表板', 'dashboard', 'monitor center', 'visualization', 'real-time monitoring', 'control center'],
        route: '/equipment-dashboard',
        name: '数字监控驾驶舱',
        description: '可视化数字监控中心，实时掌控设备状态、维护流程、零配件订货',
        answer: '我可以为您打开数字监控驾驶舱！\n\n一站式监控平台：\n✓ 设备状态实时监控\n✓ 维护流程可视化\n✓ 零配件订货追踪\n✓ 多角色视图切换\n✓ 智能预警提醒\n✓ 快速联系通讯\n\n支持设备管理人员、设备使用人员、供应商服务人员三种视角。'
      },
      techClassroom: {
        keywords: ['学习', '小课堂', '课程', '培训', '技术学习', '教程', '视频教程', '协作机器人学习', 'AGV学习', 'PLC学习', '拧紧工艺学习', '节卡学院', 'classroom', 'training', 'course', 'tutorial', 'learn', 'education'],
        route: '/tech-classroom',
        name: '产品技术销售小课堂',
        description: '专业的工业自动化技术知识分享平台，包括协作机器人、AGV、PLC、拧紧工艺等多个领域',
        answer: '欢迎来到产品技术销售小课堂！🎓\n\n我们提供9大技术领域的专业课程：\n✓ 协作机器人技术\n✓ AGV/AMR导航技术\n✓ PLC控制系统\n✓ 拧紧工艺与工具\n✓ 自动涂胶系统\n✓ 机器视觉\n✓ 精密测量\n✓ 焊装NC柔性系统\n✓ 设备服务知识\n\n每个领域都有详细的分级课程、视频教程和官方学习资源链接（如节卡学院等）！'
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
      },
      // 🆕 国际买家专属顾问
      internationalBuyer: {
        keywords: ['export', 'international', 'overseas', 'shipping', 'global', 'worldwide', 'import', '出口', '国际', '海外', '跨境'],
        answers: {
          'zh-CN': '欢迎国际买家！🌍\n\n我是您的专属国际贸易顾问，可以帮助您：\n\n📦 **采购服务**\n• 产品选型与推荐\n• 技术参数确认\n• 定制化方案\n• 批量采购优惠\n\n🌏 **物流支持**\n• 支持全球200+国家配送\n• 海运/空运/快递多种方式\n• FOB/CIF/DDP多种贸易条款\n• 专业报关清关服务\n\n💼 **商务服务**\n• 英语/西班牙语/德语/日语等多语言服务\n• 提供CE/ROHS/UL等国际认证\n• 支持信用证/T/T等多种付款方式\n• 样品试用与批量订购\n\n📧 international@mingsheng.com\n📞 +86-400-123-4567\n\n需要我推荐适合您的产品吗？',
          'en-US': 'Welcome International Buyers! 🌍\n\nI\'m your dedicated international trade advisor, ready to help you with:\n\n📦 **Procurement Services**\n• Product selection & recommendation\n• Technical specification confirmation\n• Customized solutions\n• Bulk purchase discounts\n\n🌏 **Logistics Support**\n• Delivery to 200+ countries worldwide\n• Sea/Air/Express shipping options\n• FOB/CIF/DDP trade terms available\n• Professional customs clearance\n\n💼 **Business Services**\n• Multilingual support (EN/ES/DE/JA/PT/FR)\n• International certifications (CE/ROHS/UL)\n• Multiple payment methods (L/C, T/T, etc.)\n• Sample trial & bulk ordering\n\n📧 international@mingsheng.com\n📞 +86-400-123-4567\n\nWould you like me to recommend products for you?',
          'es-ES': '¡Bienvenidos Compradores Internacionales! 🌍\n\nSoy su asesor comercial dedicado:\n\n📦 Servicios de Adquisición\n🌏 Soporte Logístico Global\n💼 Servicio Multilingüe\n\n📧 international@mingsheng.com\n📞 +86-400-123-4567',
          'de-DE': 'Willkommen Internationale Käufer! 🌍\n\nIch bin Ihr persönlicher Handelsberater:\n\n📦 Beschaffungsdienstleistungen\n🌏 Globale Logistikunterstützung\n💼 Mehrsprachiger Service\n\n📧 international@mingsheng.com\n📞 +86-400-123-4567',
          'ja-JP': '国際バイヤーの皆様、ようこそ！🌍\n\n専任の貿易アドバイザーとして：\n\n📦 調達サービス\n🌏 グローバル物流サポート\n💼 多言語対応\n\n📧 international@mingsheng.com\n📞 +86-400-123-4567',
          'pt-BR': 'Bem-vindos Compradores Internacionais! 🌍\n\nSou seu consultor comercial dedicado:\n\n📦 Serviços de Aquisição\n🌏 Suporte Logístico Global\n💼 Serviço Multilíngue\n\n📧 international@mingsheng.com\n📞 +86-400-123-4567',
          'fr-FR': 'Bienvenue Acheteurs Internationaux! 🌍\n\nJe suis votre conseiller commercial dédié:\n\n📦 Services d\'Approvisionnement\n🌏 Support Logistique Mondial\n💼 Service Multilingue\n\n📧 international@mingsheng.com\n📞 +86-400-123-4567'
        }
      },
      // 🆕 产品推荐系统
      productRecommendation: {
        keywords: ['recommend', 'suggestion', 'which product', 'what to buy', '推荐', '建议', '买什么', '哪个产品', '适合'],
        answers: {
          'zh-CN': '让我为您推荐合适的产品！🎯\n\n请告诉我您的需求：\n\n1️⃣ **应用场景**\n• 汽车制造装配？\n• 电子产品组装？\n• 机械加工？\n• 其他行业？\n\n2️⃣ **具体需求**\n• 扭矩范围（如30-150Nm）\n• 工作环境（空间限制、噪音要求）\n• 使用频率（偶尔/日常/高强度）\n• 预算范围\n\n3️⃣ **特殊要求**\n• 需要数字显示吗？\n• 需要数据采集吗？\n• 有无认证要求？\n\n回复您的需求，我会推荐最适合的产品！💡',
          'en-US': 'Let me recommend the right products for you! 🎯\n\nPlease tell me your requirements:\n\n1️⃣ **Application**\n• Automotive assembly?\n• Electronics manufacturing?\n• Mechanical processing?\n• Other industries?\n\n2️⃣ **Specifications**\n• Torque range (e.g., 30-150Nm)\n• Working environment (space, noise)\n• Usage frequency (occasional/daily/intensive)\n• Budget range\n\n3️⃣ **Special Requirements**\n• Digital display needed?\n• Data collection required?\n• Certification requirements?\n\nShare your needs and I\'ll recommend the best products! 💡'
        }
      },
      // 🆕 询盘与报价
      inquiry: {
        keywords: ['quote', 'quotation', 'price inquiry', 'rfq', 'inquiry', '询价', '报价', '价格咨询', '询盘'],
        answers: {
          'zh-CN': '感谢您的询价！💼\n\n**快速获取报价**：\n\n1️⃣ **在线询盘表单**\n点击右下角"获取报价"按钮，填写详细需求\n\n2️⃣ **直接联系**\n📧 sales@mingsheng.com\n📞 400-123-4567\n💬 WhatsApp: +86-138-0000-0000\n\n3️⃣ **提供信息**\n为了快速准确报价，请提供：\n• 产品型号或规格\n• 采购数量\n• 交货要求\n• 目标价格（如有）\n\n⏰ **响应时间**\n• 标准询价：24小时内\n• 紧急询价：4小时内\n• 复杂项目：48小时内\n\n我们提供极具竞争力的价格！✨',
          'en-US': 'Thank you for your inquiry! 💼\n\n**Quick Quote Process**:\n\n1️⃣ **Online Inquiry Form**\nClick "Get Quote" button below to submit detailed requirements\n\n2️⃣ **Direct Contact**\n📧 sales@mingsheng.com\n📞 +86-400-123-4567\n💬 WhatsApp: +86-138-0000-0000\n\n3️⃣ **Information Needed**\nFor fast & accurate quotation, please provide:\n• Product model or specifications\n• Purchase quantity\n• Delivery requirements\n• Target price (if any)\n\n⏰ **Response Time**\n• Standard inquiry: Within 24 hours\n• Urgent inquiry: Within 4 hours\n• Complex project: Within 48 hours\n\nWe offer highly competitive prices! ✨'
        }
      }
    },
    // 🆕 企业工作场景智能推荐系统
    workScenarios: {
      // 设备管理场景
      equipmentManagement: {
        keywords: ['设备管理', '设备维护', '设备运营', '资产管理', '设备监控', '保养', 'equipment management', 'asset management', 'maintenance', 'equipment monitoring'],
        recommendations: {
          internalTools: [
            { name: '设备全生命周期管理', route: '/equipment-lifecycle', icon: '📊', description: '设备档案、ROI分析、AI保养预测' },
            { name: '数字监控驾驶舱', route: '/equipment-dashboard', icon: '🚀', description: '实时监控设备状态、维护流程可视化' },
            { name: '故障工单管理', route: '/fault-tracking', icon: '🔧', description: '工单追踪、维修进度查询' }
          ],
          externalTools: [
            { name: 'UniEAP Workflow', url: 'https://iuap.yonyoucloud.com/iuap/', icon: '🏢', description: '用友BIP企业级流程编排' },
            { name: 'Dify工作流', url: 'https://dify.ai/', icon: '🔧', description: '开源LLM应用，支持设备管理工作流' }
          ]
        }
      },
      // 招聘场景
      recruitment: {
        keywords: ['招聘', '人才', 'HR', '人力资源', '求职', '招人', 'recruitment', 'hiring', 'talent', 'HR', 'human resource'],
        recommendations: {
          internalTools: [],
          externalTools: [
            { name: 'Moka Eva', url: 'https://www.mokahr.com/', icon: '👔', description: 'AI驱动智能招聘系统' },
            { name: '世纪云猎', url: 'https://www.liepin.com/', icon: '🎓', description: '智能人才工作流管理' },
            { name: '讯飞智聘', url: 'https://zhaopin.iflytek.com/', icon: '🎤', description: '科大讯飞智能招聘平台' },
            { name: '猎聘Doris', url: 'https://www.liepin.com/doris/', icon: '🦌', description: 'AI推荐+招聘流程管理' },
            { name: '仟寻', url: 'https://www.qianxunhr.com/', icon: '🔍', description: '企业级招聘管理系统' }
          ]
        }
      },
      // 销售数据分析场景
      salesAnalysis: {
        keywords: ['销售', '销售分析', '数据分析', '销售目标', '业绩', '客户', 'sales', 'sales analysis', 'data analysis', 'CRM', 'customer'],
        recommendations: {
          internalTools: [
            { name: 'AI CRM系统', route: '/mingsheng-aicrm', icon: '📊', description: '客户360画像、销售漏斗、数据分析' },
            { name: '投标预测AI', route: '/bid-prediction', icon: '🎯', description: '5竞对对比、智能分析' },
            { name: '客户沙盘分析', route: '/customer-sandbox', icon: '🗺️', description: '全球客户分布、策略推荐' }
          ],
          externalTools: [
            { name: 'Airtable', url: 'https://www.airtable.com/', icon: '📊', description: '数据库+工作流融合，销售数据管理' },
            { name: '金蝶云·星空', url: 'https://www.kingdee.com/products/cosmic', icon: '⭐', description: 'ERP与经营一体化分析' }
          ]
        }
      },
      // 项目管理场景
      projectManagement: {
        keywords: ['项目管理', '项目', '任务', '进度', '甘特图', '协作', 'project management', 'project', 'task', 'gantt', 'collaboration'],
        recommendations: {
          internalTools: [
            { name: 'AI项目管理', route: '/ai-project-management', icon: '🎯', description: '甘特图、任务分配、进度追踪' }
          ],
          externalTools: [
            { name: 'KISSflow', url: 'https://kissflow.com/', icon: '💼', description: '无代码流程设计，项目工作流管理' },
            { name: 'BetterYeah', url: 'https://www.betteryeah.com/', icon: '🎯', description: '敏捷开发协作，项目管理工作流' },
            { name: 'Airtable', url: 'https://www.airtable.com/', icon: '📊', description: '智能协作平台，项目数据管理' }
          ]
        }
      },
      // 智能办公协作场景
      officeCollaboration: {
        keywords: ['办公', '协同', '协作', '工作流', '审批', '自动化', 'office', 'collaboration', 'workflow', 'approval', 'automation'],
        recommendations: {
          internalTools: [],
          externalTools: [
            { name: '钉钉智能伙伴', url: 'https://open.dingtalk.com/', icon: '📱', description: '企业协同办公自动化' },
            { name: '飞书Lark', url: 'https://open.feishu.cn/', icon: '🚀', description: '团队协作效率工具' },
            { name: '腾讯元器', url: 'https://yuanqi.tencent.com/', icon: '🧩', description: '低代码快速构建企业应用' },
            { name: '实在智能RPA', url: 'https://www.i-search.com.cn/', icon: '🤖', description: '企业级流程自动化' }
          ]
        }
      },
      // AI智能体开发场景
      aiAgentDev: {
        keywords: ['AI智能体', '智能助手', 'AI开发', '机器人', 'chatbot', 'AI agent', 'bot development', 'AI assistant'],
        recommendations: {
          internalTools: [
            { name: '明升企业智能体', route: '/ai-agents', icon: '🤖', description: '25个智能体，覆盖7大领域' }
          ],
          externalTools: [
            { name: 'Coze', url: 'https://www.coze.com/', icon: '🚀', description: '字节跳动AI Bot开发平台' },
            { name: 'Dify', url: 'https://dify.ai/', icon: '🔧', description: '开源LLM应用开发平台' },
            { name: '阿里云百练', url: 'https://bailian.console.aliyun.com/', icon: '🎯', description: '企业级AI应用构建' },
            { name: '腾讯云智能体', url: 'https://cloud.tencent.com/product/tai', icon: '🧠', description: 'AI Agent开发平台' },
            { name: '百度文心智能体', url: 'https://yiyan.baidu.com/', icon: '🌐', description: '无代码构建AI助手' }
          ]
        }
      },
      // 学习培训场景
      training: {
        keywords: ['学习', '培训', '教育', '课程', '知识', 'learning', 'training', 'education', 'course', 'knowledge'],
        recommendations: {
          internalTools: [
            { name: '产品技术销售小课堂', route: '/tech-classroom', icon: '🎓', description: '9大技术领域专业课程' }
          ],
          externalTools: [
            { name: '慕课网', url: 'https://www.imooc.com/', icon: '📚', description: 'IT技能学习平台' },
            { name: '讯飞AI大学堂', url: 'https://ai.iflytek.com/', icon: '🎓', description: 'AI技术学习与应用' }
          ]
        }
      },
      // 数据治理场景
      dataGovernance: {
        keywords: ['数据治理', '数据管理', '数据清洗', '数据分析', '大数据', 'data governance', 'data management', 'data cleaning', 'big data'],
        recommendations: {
          internalTools: [
            { name: 'AI数据治理', route: '/data-governance', icon: '🗄️', description: '智能数据清洗、质量检查' }
          ],
          externalTools: [
            { name: '华为云FlexusAI', url: 'https://www.huaweicloud.com/', icon: '☁️', description: '企业级AI数据编排' },
            { name: '阿里云百练', url: 'https://bailian.console.aliyun.com/', icon: '🎯', description: '大模型数据应用' }
          ]
        }
      },
      // 业务模拟场景
      businessSimulation: {
        keywords: ['业务模拟', '沙盘', '模拟器', '预测', '决策', 'business simulation', 'sandbox', 'simulator', 'prediction', 'decision'],
        recommendations: {
          internalTools: [
            { name: 'AI业务模拟器', route: '/business-simulator', icon: '🎮', description: '智能场景模拟、决策支持' },
            { name: '客户沙盘分析', route: '/customer-sandbox', icon: '🗺️', description: '全球客户分布模拟' }
          ],
          externalTools: []
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
      const userInput = content.trim()
      
      // 添加用户消息
      this.addMessage({
        type: 'user',
        content: userInput
      })

      // 更新对话上下文
      this.conversationContext.conversationDepth++

      // 显示输入中状态
      this.isTyping = true

      // 模拟AI思考时间（更自然的思考延迟）
      const thinkingTime = 800 + Math.random() * 400
      await new Promise(resolve => setTimeout(resolve, thinkingTime))

      // 智能匹配答案（带上下文理解）
      const answer = this.matchAnswer(userInput, locale)

      // 使用打字机效果逐字显示 - 传入用户问题
      await this.typewriterEffect(answer, locale, userInput)

      this.isTyping = false
    },

    // 打字机效果 - 添加question参数
    async typewriterEffect(text, locale, question = '') {
      const messageId = Date.now()
      
      // 先添加空消息，包含原始问题用于反馈
      this.addMessage({
        type: 'ai',
        content: '',
        question: question, // 新增：记录原始问题
        id: messageId
      })

      // 逐字添加内容
      const words = text.split('')
      for (let i = 0; i < words.length; i++) {
        const message = this.messages.find(m => m.id === messageId)
        if (message) {
          message.content += words[i]
          // 每个字符延迟（中文慢一点，英文快一点）
          const delay = /[\u4e00-\u9fa5]/.test(words[i]) ? 30 : 20
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }

      // 检查是否需要添加建议卡片
      const suggestions = this.getRelatedSuggestions(text, locale)
      if (suggestions.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 300))
        const message = this.messages.find(m => m.id === messageId)
        if (message) {
          message.suggestions = suggestions
        }
      }
    },

    // 获取相关建议
    getRelatedSuggestions(answer, locale) {
      const suggestions = []
      
      // 🆕 优先处理场景推荐的建议卡片
      if (this.lastMatchedScenario) {
        const { recommendations } = this.lastMatchedScenario
        
        // 添加内部工具卡片
        recommendations.internalTools.forEach(tool => {
          suggestions.push({
            text: `${tool.icon} ${tool.name}`,
            action: 'navigate',
            route: tool.route,
            icon: 'Promotion'
          })
        })
        
        // 添加外部工具卡片（最多3个）
        recommendations.externalTools.slice(0, 3).forEach(tool => {
          suggestions.push({
            text: `${tool.icon} ${tool.name}`,
            action: 'external_link',
            url: tool.url,
            icon: 'Link'
          })
        })
        
        // 清除场景缓存
        this.lastMatchedScenario = null
        
        return suggestions.slice(0, 5) // 最多显示5个建议
      }
      
      // 如果回答中包含功能推荐，提供快捷操作
      if (this.lastMatchedRoute) {
        suggestions.push({
          text: locale === 'zh-CN' ? '立即打开' : 'Open Now',
          action: 'navigate',
          route: this.lastMatchedRoute,
          icon: 'Promotion'
        })
      }

      // 根据话题推荐相关功能
      if (answer.includes('工具选型') || answer.includes('Tool Selection')) {
        if (!suggestions.some(s => s.route === '/socket-selector')) {
          suggestions.push({
            text: locale === 'zh-CN' ? '套筒配件选型' : 'Socket Selection',
            action: 'navigate',
            route: '/socket-selector',
            icon: 'Tools'
          })
        }
      }

      if (answer.includes('拧紧') || answer.includes('Tightening')) {
        if (!suggestions.some(s => s.route === '/curve-analysis')) {
          suggestions.push({
            text: locale === 'zh-CN' ? '拧紧曲线分析' : 'Curve Analysis',
            action: 'navigate',
            route: '/curve-analysis',
            icon: 'TrendCharts'
          })
        }
      }

      // 如果提到学习、课程等，推荐小课堂和外部资源
      if (answer.includes('小课堂') || answer.includes('学习') || answer.includes('课程') || 
          answer.includes('classroom') || answer.includes('learn') || answer.includes('training')) {
        if (!suggestions.some(s => s.route === '/tech-classroom')) {
          suggestions.push({
            text: locale === 'zh-CN' ? '📚 进入小课堂' : '📚 Enter Classroom',
            action: 'navigate',
            route: '/tech-classroom',
            icon: 'Reading'
          })
        }
        
        // 推荐外部学习资源（如节卡学院）
        const externalLinksStore = useClassroomStore()
        const recommendedLinks = externalLinksStore.getAllExternalLinks
          .filter(link => link.status === 'active' && link.linkType === 'academy')
          .slice(0, 1) // 只推荐1个
        
        recommendedLinks.forEach(link => {
          suggestions.push({
            text: locale === 'zh-CN' ? `🎓 ${link.title.substring(0, 15)}...` : `🎓 ${link.title.substring(0, 15)}...`,
            action: 'external_link',
            url: link.url,
            linkId: link.id,
            icon: 'Link'
          })
        })
      }

      // 如果提到协作机器人，推荐相关外部资源
      if (answer.includes('协作机器人') || answer.includes('cobot') || answer.includes('collaborative robot')) {
        const externalLinksStore = useClassroomStore()
        const cobotLinks = externalLinksStore.getExternalLinksByCategory(1) // 协作机器人分类ID为1
          .filter(link => link.linkType === 'academy' || link.linkType === 'video')
          .slice(0, 1)
        
        cobotLinks.forEach(link => {
          suggestions.push({
            text: locale === 'zh-CN' ? `${link.icon} ${link.title.substring(0, 12)}...` : `${link.icon} ${link.title.substring(0, 12)}...`,
            action: 'external_link',
            url: link.url,
            linkId: link.id,
            icon: 'Link'
          })
        })
      }

      return suggestions.slice(0, 3) // 最多3个建议
    },

    // 检测问候语
    isGreeting(text) {
      const greetings = ['你好', '您好', 'hello', 'hi', '嗨', '早上好', '晚上好', '下午好', 'good morning', 'good afternoon', 'good evening']
      return greetings.some(g => text.toLowerCase().includes(g))
    },

    // 检测感谢语
    isThanks(text) {
      const thanks = ['谢谢', '感谢', 'thank', 'thanks', '多谢']
      return thanks.some(t => text.toLowerCase().includes(t))
    },

    // 生成问候回复
    getGreetingResponse(locale) {
      const greetings = this.personality.greeting
      const greeting = greetings[Math.floor(Math.random() * greetings.length)]
      
      const followUp = locale === 'zh-CN' ? 
        '\n\n我可以帮您：\n✨ 工具选型和配件匹配\n✨ 拧紧工艺优化分析\n✨ 设备管理和故障追踪\n✨ 成本优化和ROI计算\n\n请告诉我您的需求！' :
        '\n\nI can help you with:\n✨ Tool selection and fitting\n✨ Tightening process optimization\n✨ Equipment management and fault tracking\n✨ Cost optimization and ROI calculation\n\nPlease let me know your needs!'
      
      return greeting + followUp
    },

    // 生成感谢回复
    getThanksResponse(locale) {
      const responses = locale === 'zh-CN' ? [
        '不客气！很高兴能帮到您！😊',
        '随时为您服务！有其他问题随时找我！👋',
        '我的荣幸！期待下次为您服务！✨'
      ] : [
        'You\'re welcome! Happy to help! 😊',
        'Anytime! Feel free to ask if you have more questions! 👋',
        'My pleasure! Looking forward to serving you next time! ✨'
      ]
      
      return responses[Math.floor(Math.random() * responses.length)]
    },

    matchAnswer(question, locale) {
      const lowerQuestion = question.toLowerCase()
      
      // 检测问候语
      if (this.isGreeting(lowerQuestion)) {
        return this.getGreetingResponse(locale)
      }

      // 检测感谢语
      if (this.isThanks(lowerQuestion)) {
        return this.getThanksResponse(locale)
      }
      
      // 🆕 优先检测工作场景（新功能）
      const scenarioMatch = this.matchWorkScenario(lowerQuestion, locale)
      if (scenarioMatch) {
        return scenarioMatch
      }
      
      // 优先匹配智能体功能
      for (const [key, func] of Object.entries(this.agentFunctions)) {
        const matched = func.keywords.some(keyword => 
          lowerQuestion.includes(keyword.toLowerCase())
        )
        
        if (matched) {
          // 更新对话上下文
          this.conversationContext.lastTopic = key
          this.conversationContext.lastIntent = 'feature_inquiry'
          
          const enthusiasm = this.personality.enthusiasm[Math.floor(Math.random() * this.personality.enthusiasm.length)]
          
          const answer = locale === 'en-US' ? 
            `${enthusiasm}\n\nI can help you with ${func.name}!\n\n${func.description}\n\n💡 Would you like me to open this feature for you?` :
            `${enthusiasm}\n\n${func.answer}\n\n💡 是否需要我为您打开【${func.name}】功能？`
          
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
          this.conversationContext.lastTopic = category
          this.conversationContext.lastIntent = 'knowledge_inquiry'
          return data.answers[locale] || data.answers['zh-CN']
        }
      }

      // 智能模糊匹配
      const fuzzyMatch = this.fuzzyMatch(lowerQuestion, locale)
      if (fuzzyMatch) {
        return fuzzyMatch
      }

      // 默认回复（更友好和个性化）
      const thinking = this.personality.thinking[Math.floor(Math.random() * this.personality.thinking.length)]
      
      const defaultAnswers = {
        'zh-CN': `${thinking}\n\n抱歉，我可能没有完全理解您的问题。\n\n我擅长的领域包括：\n\n🔧 **工具选型**\n• 扭矩工具选型\n• 套筒配件选型\n• 品牌型号匹配\n\n⚙️ **工艺优化**\n• 拧紧策略优化\n• 拧紧曲线分析\n• 成本优化分析\n\n📊 **设备管理**\n• 设备全生命周期管理\n• 故障工单追踪\n• 数字监控驾驶舱\n\n您可以换个方式问我，比如：\n"我需要选择合适的扭矩工具"\n"帮我分析拧紧曲线"\n"查看设备运行状态"\n\n📞 需要人工服务？拨打：400-123-4567`,
        'en-US': `${thinking}\n\nSorry, I may not fully understand your question.\n\nMy expertise includes:\n\n🔧 **Tool Selection**\n• Torque Tool Selection\n• Socket Selection\n• Brand Model Matching\n\n⚙️ **Process Optimization**\n• Tightening Strategy\n• Curve Analysis\n• Cost Optimization\n\n📊 **Equipment Management**\n• Equipment Lifecycle Management\n• Fault Tracking\n• Digital Monitoring Dashboard\n\nYou can try asking:\n"I need to select a suitable torque tool"\n"Help me analyze tightening curves"\n"Check device running status"\n\n📞 Need human support? Call: 400-123-4567`
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

    // 🆕 匹配工作场景并推荐工具
    matchWorkScenario(question, locale) {
      for (const [scenarioKey, scenario] of Object.entries(this.workScenarios)) {
        const matched = scenario.keywords.some(keyword => 
          question.includes(keyword.toLowerCase())
        )
        
        if (matched) {
          this.conversationContext.lastTopic = scenarioKey
          this.conversationContext.lastIntent = 'scenario_recommendation'
          
          return this.generateScenarioRecommendation(scenario, scenarioKey, locale)
        }
      }
      return null
    },

    // 🆕 生成场景推荐回复
    generateScenarioRecommendation(scenario, scenarioKey, locale) {
      const { internalTools, externalTools } = scenario.recommendations
      
      let answer = ''
      
      // 构建推荐内容
      if (locale === 'zh-CN') {
        answer = '太好了！根据您的需求，我为您推荐以下工具：\n\n'
        
        // 内部工具推荐
        if (internalTools.length > 0) {
          answer += '📌 **明升智能体系统**\n'
          internalTools.forEach((tool, index) => {
            answer += `${index + 1}. ${tool.icon} **${tool.name}**\n   ${tool.description}\n`
          })
          answer += '\n'
        }
        
        // 外部工具推荐
        if (externalTools.length > 0) {
          answer += '🌐 **推荐外部AI工具**\n'
          externalTools.slice(0, 3).forEach((tool, index) => {
            answer += `${index + 1}. ${tool.icon} **${tool.name}**\n   ${tool.description}\n`
          })
          
          if (externalTools.length > 3) {
            answer += `\n...还有${externalTools.length - 3}个更多工具推荐\n`
          }
        }
        
        answer += '\n💡 点击下方卡片即可快速打开对应工具！'
      } else {
        answer = 'Great! Based on your needs, I recommend the following tools:\n\n'
        
        if (internalTools.length > 0) {
          answer += '📌 **Mingsheng AI Agents**\n'
          internalTools.forEach((tool, index) => {
            answer += `${index + 1}. ${tool.icon} **${tool.name}**\n   ${tool.description}\n`
          })
          answer += '\n'
        }
        
        if (externalTools.length > 0) {
          answer += '🌐 **Recommended External AI Tools**\n'
          externalTools.slice(0, 3).forEach((tool, index) => {
            answer += `${index + 1}. ${tool.icon} **${tool.name}**\n   ${tool.description}\n`
          })
          
          if (externalTools.length > 3) {
            answer += `\n...and ${externalTools.length - 3} more tools\n`
          }
        }
        
        answer += '\n💡 Click the cards below to open the tools!'
      }
      
      // 存储场景信息，用于生成建议卡片
      this.lastMatchedScenario = { scenarioKey, recommendations: scenario.recommendations }
      
      return answer
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
