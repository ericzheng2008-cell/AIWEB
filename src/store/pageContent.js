import { defineStore } from 'pinia'

export const usePageContentStore = defineStore('pageContent', {
  state: () => ({
    // 导航栏配置版本号（更新配置时递增此版本号）
    navConfigVersion: '2.2.0', // v2.2.0 - 补充AI智能体第7个子菜单：产品技术销售小课堂
    
    // 导航栏配置
    navItems: (() => {
      const currentVersion = '2.3.0'
      const savedVersion = localStorage.getItem('navConfigVersion')
      
      // 如果版本号不匹配，忽略缓存，使用新配置
      if (savedVersion !== currentVersion) {
        console.log('🔄 检测到导航配置更新，加载新配置...')
        localStorage.setItem('navConfigVersion', currentVersion)
        const newNavItems = [
      { id: 'home', name: { 'zh-CN': '首页', 'en-US': 'Home' }, path: '/', order: 1, visible: true },
      { 
        id: 'products', 
        name: { 'zh-CN': '产品与服务', 'en-US': 'Products & Services' }, 
        path: '/products-services', 
        order: 2, 
        visible: true,
        children: [
          { id: 'electric-tools', name: { 'zh-CN': '电动工具', 'en-US': 'Electric Tools' }, path: '/products-services?category=electric', order: 1, visible: true },
          { id: 'pneumatic-tools', name: { 'zh-CN': '气动工具', 'en-US': 'Pneumatic Tools' }, path: '/products-services?category=pneumatic', order: 2, visible: true },
          { id: 'manual-tools', name: { 'zh-CN': '手动工具', 'en-US': 'Manual Tools' }, path: '/products-services?category=manual', order: 3, visible: true },
          { id: 'measurement-tools', name: { 'zh-CN': '测量工具', 'en-US': 'Measurement Tools' }, path: '/products-services?category=measurement', order: 4, visible: true },
          { id: 'automated-systems', name: { 'zh-CN': '自动化系统', 'en-US': 'Automation Systems' }, path: '/products-services?category=automation', order: 5, visible: true },
          { id: 'smart-solutions', name: { 'zh-CN': '智能解决方案', 'en-US': 'Smart Solutions' }, path: '/products-services?category=smart', order: 6, visible: true }
        ]
      },
      { 
        id: 'divisions', 
        name: { 'zh-CN': '事业部', 'en-US': 'Business Divisions' }, 
        path: '/divisions', 
        order: 3, 
        visible: true,
        children: [
          { id: 'division-assembly', name: { 'zh-CN': '工业智能装配事业部', 'en-US': 'Intelligent Assembly Division' }, path: '/divisions?id=1', order: 1, visible: true },
          { id: 'division-manufacturing', name: { 'zh-CN': '工业智能智造事业部', 'en-US': 'Intelligent Manufacturing Division' }, path: '/divisions?id=2', order: 2, visible: true },
          { id: 'division-oem', name: { 'zh-CN': '工业配套事业部', 'en-US': 'Industrial OEM Division' }, path: '/divisions?id=3', order: 3, visible: true },
          { id: 'division-power', name: { 'zh-CN': '动力装配事业部', 'en-US': 'Power Assembly Division' }, path: '/divisions?id=4', order: 4, visible: true },
          { id: 'division-auto', name: { 'zh-CN': '汽车部件事业部', 'en-US': 'Automotive Parts Division' }, path: '/divisions?id=5', order: 5, visible: true },
          { id: 'division-mingsheng', name: { 'zh-CN': '明升科技事业部', 'en-US': 'Mingsheng Technology Division' }, path: '/divisions?id=6', order: 6, visible: true },
          { id: 'division-tools', name: { 'zh-CN': '刀具油品事业部', 'en-US': 'Tools & Lubricants Division' }, path: '/divisions?id=7', order: 7, visible: true },
          { id: 'division-marketing', name: { 'zh-CN': '网营事业部', 'en-US': 'E-Commerce Division' }, path: '/divisions?id=8', order: 8, visible: true }
        ]
      },
      { 
        id: 'solutions', 
        name: { 'zh-CN': '应用案例', 'en-US': 'Case Studies' }, 
        path: '/solutions', 
        order: 4, 
        visible: true,
        children: [
          { id: 'automotive', name: { 'zh-CN': '汽车制造', 'en-US': 'Automotive Manufacturing' }, path: '/solutions?category=automotive', order: 1, visible: true },
          { id: 'aerospace', name: { 'zh-CN': '航空航天', 'en-US': 'Aerospace Industry' }, path: '/solutions?category=aerospace', order: 2, visible: true },
          { id: 'electronics', name: { 'zh-CN': '电子电器', 'en-US': 'Electronics & Appliances' }, path: '/solutions?category=electronics', order: 3, visible: true },
          { id: 'machinery', name: { 'zh-CN': '机械制造', 'en-US': 'Machinery Manufacturing' }, path: '/solutions?category=machinery', order: 4, visible: true },
          { id: 'energy', name: { 'zh-CN': '新能源', 'en-US': 'Renewable Energy' }, path: '/solutions?category=energy', order: 5, visible: true },
          { id: 'rail', name: { 'zh-CN': '轨道交通', 'en-US': 'Rail Transportation' }, path: '/solutions?category=rail', order: 6, visible: true }
        ]
      },
      { 
        id: 'aiagents', 
        name: { 'zh-CN': 'AI智能体', 'en-US': 'AI Solutions' }, 
        path: '/ai-agents', 
        order: 5, 
        visible: true,
        children: [
          { id: 'equipment-dashboard', name: { 'zh-CN': '数字监控驾驶舱', 'en-US': 'Digital Monitoring Dashboard' }, path: '/equipment-dashboard', order: 1, visible: true },
          { id: 'tool-selector', name: { 'zh-CN': '工具选型', 'en-US': 'Tool Selection Advisor' }, path: '/tool-selector', order: 2, visible: true },
          { id: 'tightening-data', name: { 'zh-CN': '拧紧数据采集分析', 'en-US': 'Torque Data Analytics' }, path: '/tightening-data', order: 3, visible: true },
          { id: 'equipment-lifecycle', name: { 'zh-CN': '设备生命周期', 'en-US': 'Equipment Lifecycle Management' }, path: '/equipment-lifecycle', order: 4, visible: true },
          { id: 'fault-tracking', name: { 'zh-CN': '工单管理', 'en-US': 'Work Order Management' }, path: '/fault-tracking', order: 5, visible: true },
          { id: 'curve-analysis', name: { 'zh-CN': '曲线分析', 'en-US': 'Curve Analysis' }, path: '/curve-analysis', order: 6, visible: true },
          { id: 'tech-classroom', name: { 'zh-CN': '产品技术销售小课堂', 'en-US': 'Product Tech Training' }, path: '/tech-classroom', order: 7, visible: true },
          { id: 'process-verification', name: { 'zh-CN': '拧紧工艺改进与验证', 'en-US': 'Process Optimization & Verification' }, path: '/process-verification', order: 8, visible: true }
        ]
      },
      { id: 'about', name: { 'zh-CN': '关于我们', 'en-US': 'About Us' }, path: '/about', order: 6, visible: true },
      { id: 'service', name: { 'zh-CN': '服务与支持', 'en-US': 'Service & Support' }, path: '/service', order: 7, visible: true },
      { id: 'contact', name: { 'zh-CN': '联系我们', 'en-US': 'Contact Us' }, path: '/contact', order: 8, visible: true }
        ]
        localStorage.setItem('navItems', JSON.stringify(newNavItems))
        return newNavItems
      }
      
      // 使用缓存的配置
      return JSON.parse(localStorage.getItem('navItems') || JSON.stringify([
        { id: 'home', name: { 'zh-CN': '首页', 'en-US': 'Home' }, path: '/', order: 1, visible: true }
      ]))
    })(),
    
    // 页面内容配置
    pages: JSON.parse(localStorage.getItem('pageContents') || JSON.stringify({
      home: {
        banner: {
          title: { 'zh-CN': '广州市明升伟业机电有限公司', 'en-US': 'Guangzhou Mingsheng Industry Co., Ltd.' },
          subtitle: { 'zh-CN': '成立于1996年，总部位于珠江三角洲美丽的花城——广州', 'en-US': 'Established in 1996, headquartered in Guangzhou' },
          description: { 'zh-CN': '是一家集科研开发、生产制造、销售服务为一体的现代化科技企业', 'en-US': 'A modern technology enterprise integrating R&D, manufacturing and sales' },
          image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920',
          buttonText: { 'zh-CN': '了解更多', 'en-US': 'Learn More' }
        },
        sections: [],
        // 关于明升伟业板块
        aboutCompany: {
          title: { 'zh-CN': '关于明升伟业', 'en-US': 'About Mingsheng' },
          intro: { 
            'zh-CN': '广州市明升伟业机电有限公司成立于1996年，总部位于珠江三角洲美丽的花城——广州。是一家集科研开发、生产制造、销售服务为一体的现代化科技企业。', 
            'en-US': 'Guangzhou Mingsheng Industry Co., Ltd. was established in 1996, headquartered in Guangzhou. It is a modern technology enterprise integrating R&D, manufacturing and sales.' 
          },
          certifications: [
            { name: { 'zh-CN': 'ISO9000认证', 'en-US': 'ISO9000 Certified' } },
            { name: { 'zh-CN': 'QS9000认证', 'en-US': 'QS9000 Certified' } },
            { name: { 'zh-CN': 'IATF16949认证', 'en-US': 'IATF16949 Certified' } }
          ],
          buttonText: { 'zh-CN': '了解更多', 'en-US': 'Learn More' },
          image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800'
        },
        // 我们的优势板块
        advantages: {
          title: { 'zh-CN': '我们的优势', 'en-US': 'Our Advantages' },
          subtitle: { 'zh-CN': '值得信赖的工业合作伙伴', 'en-US': 'Trusted Industrial Partner' },
          items: [
            { 
              icon: 'Medal',
              title: { 'zh-CN': '28年行业经验', 'en-US': '28 Years Experience' }, 
              description: { 'zh-CN': '自1996年成立，深耕工业工具领域近三十年，积累丰富实际案例', 'en-US': 'Since 1996, deep cultivation in industrial tools for nearly 30 years' } 
            },
            { 
              icon: 'Checked',
              title: { 'zh-CN': '权威体系认证', 'en-US': 'Authoritative Certification' }, 
              description: { 'zh-CN': 'ISO9000、QS9000、IATF16949汽车制造体系认证', 'en-US': 'ISO9000, QS9000, IATF16949 automotive manufacturing system certification' } 
            },
            { 
              icon: 'Box',
              title: { 'zh-CN': '欧美高端品牌', 'en-US': 'European & American Brands' }, 
              description: { 'zh-CN': '专业代理欧美一线工业工具品牌，品质有保障', 'en-US': 'Professional agency for first-line European and American industrial tool brands' } 
            },
            { 
              icon: 'Service',
              title: { 'zh-CN': '全国服务网络', 'en-US': 'National Service Network' }, 
              description: { 'zh-CN': '在华中、华南、西南多地设有办事处，提供及时服务', 'en-US': 'Offices in Central, South and Southwest China for timely service' } 
            }
          ]
        },
        // 服务网络板块
        serviceNetwork: {
          title: { 'zh-CN': '服务网络', 'en-US': 'Service Network' },
          subtitle: { 'zh-CN': '全国多地设有办事处，提供优质的客户服务', 'en-US': 'Offices nationwide for quality customer service' },
          offices: [
            { city: { 'zh-CN': '广州', 'en-US': 'Guangzhou' }, region: { 'zh-CN': '总部 · 珠江三角洲', 'en-US': 'Headquarters · Pearl River Delta' } },
            { city: { 'zh-CN': '长沙', 'en-US': 'Changsha' }, region: { 'zh-CN': '湖南省', 'en-US': 'Hunan Province' } },
            { city: { 'zh-CN': '株洲', 'en-US': 'Zhuzhou' }, region: { 'zh-CN': '湖南省', 'en-US': 'Hunan Province' } },
            { city: { 'zh-CN': '常德', 'en-US': 'Changde' }, region: { 'zh-CN': '湖南省', 'en-US': 'Hunan Province' } },
            { city: { 'zh-CN': '柳州', 'en-US': 'Liuzhou' }, region: { 'zh-CN': '广西省', 'en-US': 'Guangxi Province' } },
            { city: { 'zh-CN': '武汉', 'en-US': 'Wuhan' }, region: { 'zh-CN': '湖北省', 'en-US': 'Hubei Province' } },
            { city: { 'zh-CN': '宜昌', 'en-US': 'Yichang' }, region: { 'zh-CN': '湖北省', 'en-US': 'Hubei Province' } },
            { city: { 'zh-CN': '杭州', 'en-US': 'Hangzhou' }, region: { 'zh-CN': '华中地区', 'en-US': 'Central China' } },
            { city: { 'zh-CN': '上海', 'en-US': 'Shanghai' }, region: { 'zh-CN': '华东地区', 'en-US': 'East China' } }
          ]
        }
      },
      about: {
        banner: {
          title: { 'zh-CN': '关于明升伟业', 'en-US': 'About Mingsheng' },
          subtitle: { 'zh-CN': '28年专注工业工具领域 · 值得信赖的工业合作伙伴', 'en-US': '28 Years Focus on Industrial Tools · Trusted Industrial Partner' },
          image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920'
        },
        sections: [],
        // 公司简介
        companyIntro: {
          title: { 'zh-CN': '公司简介', 'en-US': 'Company Profile' },
          content: [
            {
              'zh-CN': '广州市明升伟业机电有限公司成立于1996年，总部位于珠江三角洲美丽的花城——广州。是一家集科研开发、生产制造、销售服务为一体的现代化科技企业。',
              'en-US': 'Guangzhou Mingsheng Industry Co., Ltd. was established in 1996, headquartered in Guangzhou, Pearl River Delta. It is a modern technology enterprise integrating R&D, manufacturing and sales.'
            },
            {
              'zh-CN': '公司于2006年通过ISO9000和QS9000认证，2018年通过IATF16949汽车制造体系认证。明升伟业以"满足客户需求，以客户满意为准"为企业宗旨，专业于各类欧美高端工业用电动工具、气动工具和手动工具，非标五金制造和设计，各类高强度汽车标准件，传感器等产品的设计制造和生产；为客户提供各类工具装配应用的解决方案，在配套和智能领域得到客户的应用。',
              'en-US': 'The company passed ISO9000 and QS9000 certification in 2006, and IATF16949 automotive manufacturing system certification in 2018. Mingsheng specializes in European and American high-end industrial power tools, pneumatic tools, and hand tools, providing customers with various tool assembly application solutions.'
            }
          ],
          image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800'
        },
        // 发展历程
        timeline: {
          title: { 'zh-CN': '发展历程', 'en-US': 'Development History' },
          items: [
            {
              year: '1996',
              title: { 'zh-CN': '公司成立', 'en-US': 'Company Founded' },
              description: { 'zh-CN': '广州市明升伟业机电有限公司在广州正式成立', 'en-US': 'Guangzhou Mingsheng Industry Co., Ltd. officially established in Guangzhou' }
            },
            {
              year: '2006',
              title: { 'zh-CN': '质量体系认证', 'en-US': 'Quality System Certification' },
              description: { 'zh-CN': '通过ISO9000和QS9000质量管理体系认证', 'en-US': 'Passed ISO9000 and QS9000 quality management system certification' }
            },
            {
              year: '2018',
              title: { 'zh-CN': '汽车体系认证', 'en-US': 'Automotive System Certification' },
              description: { 'zh-CN': '通过IATF16949汽车制造质量管理体系认证', 'en-US': 'Passed IATF16949 automotive manufacturing quality management system certification' }
            },
            {
              year: { 'zh-CN': '至今', 'en-US': 'Present' },
              title: { 'zh-CN': '全国服务网络', 'en-US': 'National Service Network' },
              description: { 'zh-CN': '在湖南、广西、湖北、华中、华东等地设有办事处', 'en-US': 'Offices established in Hunan, Guangxi, Hubei, Central and East China' }
            }
          ]
        },
        // 资质认证
        certifications: {
          title: { 'zh-CN': '资质认证', 'en-US': 'Certifications' },
          items: [
            {
              name: 'ISO9000',
              description: { 'zh-CN': '国际质量管理体系认证', 'en-US': 'International Quality Management System Certification' },
              year: { 'zh-CN': '2006年', 'en-US': '2006' }
            },
            {
              name: 'QS9000',
              description: { 'zh-CN': '汽车行业质量体系认证', 'en-US': 'Automotive Industry Quality System Certification' },
              year: { 'zh-CN': '2006年', 'en-US': '2006' }
            },
            {
              name: 'IATF16949',
              description: { 'zh-CN': '汽车制造质量管理体系认证', 'en-US': 'Automotive Manufacturing Quality Management System Certification' },
              year: { 'zh-CN': '2018年', 'en-US': '2018' }
            }
          ]
        },
        // 团队优势
        teamAdvantages: {
          title: { 'zh-CN': '团队优势', 'en-US': 'Team Advantages' },
          items: [
            {
              title: { 'zh-CN': '经验丰富', 'en-US': 'Experienced' },
              description: { 'zh-CN': '拥有一支经验丰富的销售和技术团队，积累了丰富的工业应用实际案例', 'en-US': 'Experienced sales and technical team with rich industrial application cases' }
            },
            {
              title: { 'zh-CN': '专业服务', 'en-US': 'Professional Service' },
              description: { 'zh-CN': '以提供优质的客户服务为基础，为客户提供专业的技术支持和解决方案', 'en-US': 'Professional technical support and solutions based on quality customer service' }
            },
            {
              title: { 'zh-CN': '全国网络', 'en-US': 'National Network' },
              description: { 'zh-CN': '在湖南、广西、湖北、华中、华东等地设有办事处，提供及时服务', 'en-US': 'Offices nationwide for timely service' }
            }
          ]
        },
        // 服务网络
        serviceNetwork: {
          title: { 'zh-CN': '服务网络', 'en-US': 'Service Network' },
          headquarters: {
            title: { 'zh-CN': '总部', 'en-US': 'Headquarters' },
            location: { 'zh-CN': '广州 - 珠江三角洲', 'en-US': 'Guangzhou - Pearl River Delta' }
          },
          offices: [
            {
              region: { 'zh-CN': '湖南省', 'en-US': 'Hunan Province' },
              cities: [
                { 'zh-CN': '长沙', 'en-US': 'Changsha' },
                { 'zh-CN': '株洲', 'en-US': 'Zhuzhou' },
                { 'zh-CN': '常德', 'en-US': 'Changde' }
              ]
            },
            {
              region: { 'zh-CN': '广西省', 'en-US': 'Guangxi Province' },
              cities: [{ 'zh-CN': '柳州', 'en-US': 'Liuzhou' }]
            },
            {
              region: { 'zh-CN': '湖北省', 'en-US': 'Hubei Province' },
              cities: [
                { 'zh-CN': '武汉', 'en-US': 'Wuhan' },
                { 'zh-CN': '宜昌', 'en-US': 'Yichang' }
              ]
            },
            {
              region: { 'zh-CN': '华中/华东', 'en-US': 'Central/East China' },
              cities: [
                { 'zh-CN': '杭州', 'en-US': 'Hangzhou' },
                { 'zh-CN': '上海', 'en-US': 'Shanghai' }
              ]
            }
          ]
        },
        // 联系CTA
        contactCTA: {
          title: { 'zh-CN': '期待与您合作', 'en-US': 'Looking Forward to Working With You' },
          subtitle: { 'zh-CN': '如果您对我们的产品和服务感兴趣，欢迎随时联系我们', 'en-US': 'If you are interested in our products and services, please feel free to contact us' },
          buttonText: { 'zh-CN': '联系我们', 'en-US': 'Contact Us' }
        }
      },
      service: {
        banner: {
          title: { 'zh-CN': '服务与支持', 'en-US': 'Service & Support' },
          subtitle: { 'zh-CN': '专业的技术团队，优质的售后服务', 'en-US': 'Professional Technical Team, Quality After-sales Service' },
          image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1920'
        },
        sections: [],
        // 服务项目
        serviceItems: [
          {
            icon: 'Tools',
            title: { 'zh-CN': '产品安装', 'en-US': 'Product Installation' },
            description: { 'zh-CN': '专业团队提供现场安装调试服务，确保设备正常运行', 'en-US': 'Professional team provides on-site installation and commissioning services' }
          },
          {
            icon: 'Reading',
            title: { 'zh-CN': '技术培训', 'en-US': 'Technical Training' },
            description: { 'zh-CN': '为客户提供全面的产品使用和维护培训', 'en-US': 'Comprehensive product use and maintenance training for customers' }
          },
          {
            icon: 'Setting',
            title: { 'zh-CN': '维护保养', 'en-US': 'Maintenance' },
            description: { 'zh-CN': '定期维护保养服务，延长设备使用寿命', 'en-US': 'Regular maintenance services to extend equipment life' }
          },
          {
            icon: 'Service',
            title: { 'zh-CN': '故障维修', 'en-US': 'Troubleshooting' },
            description: { 'zh-CN': '快速响应故障报修，及时解决问题', 'en-US': 'Quick response to troubleshooting and timely problem solving' }
          },
          {
            icon: 'DocumentCopy',
            title: { 'zh-CN': '备件供应', 'en-US': 'Spare Parts Supply' },
            description: { 'zh-CN': '提供原厂备件，保证配件质量', 'en-US': 'Provide original spare parts to ensure quality' }
          },
          {
            icon: 'Pointer',
            title: { 'zh-CN': '方案定制', 'en-US': 'Solution Customization' },
            description: { 'zh-CN': '根据客户需求定制专属解决方案', 'en-US': 'Customize exclusive solutions according to customer needs' }
          }
        ],
        // 技术支持
        technicalSupport: {
          title: { 'zh-CN': '技术支持', 'en-US': 'Technical Support' },
          providedTitle: { 'zh-CN': '我们提供', 'en-US': 'We Provide' },
          providedItems: [
            { 'zh-CN': '产品选型咨询', 'en-US': 'Product Selection Consultation' },
            { 'zh-CN': '技术方案设计', 'en-US': 'Technical Solution Design' },
            { 'zh-CN': '现场安装调试', 'en-US': 'On-site Installation and Commissioning' },
            { 'zh-CN': '操作培训指导', 'en-US': 'Operation Training Guidance' },
            { 'zh-CN': '定期维护保养', 'en-US': 'Regular Maintenance' },
            { 'zh-CN': '故障快速响应', 'en-US': 'Quick Response to Troubleshooting' }
          ],
          contactTitle: { 'zh-CN': '联系技术支持', 'en-US': 'Contact Technical Support' },
          hotline: {
            label: { 'zh-CN': '技术热线', 'en-US': 'Technical Hotline' },
            value: '400-123-4567'
          },
          email: {
            label: { 'zh-CN': '技术邮箱', 'en-US': 'Technical Email' },
            value: 'support@mingsheng.com'
          },
          buttonText: { 'zh-CN': '在线咨询', 'en-US': 'Online Consultation' }
        },
        // 服务承诺
        servicePromises: {
          title: { 'zh-CN': '服务承诺', 'en-US': 'Service Commitment' },
          items: [
            {
              title: { 'zh-CN': '质量保证', 'en-US': 'Quality Assurance' },
              description: { 'zh-CN': '所有产品均提供质量保证，确保符合行业标准', 'en-US': 'All products come with quality assurance, ensuring compliance with industry standards' }
            },
            {
              title: { 'zh-CN': '快速响应', 'en-US': 'Quick Response' },
              description: { 'zh-CN': '技术问题24小时内响应，48小时内提供解决方案', 'en-US': 'Technical issues responded within 24 hours, solutions provided within 48 hours' }
            },
            {
              title: { 'zh-CN': '专业团队', 'en-US': 'Professional Team' },
              description: { 'zh-CN': '拥有经验丰富的销售和技术团队，提供专业服务', 'en-US': 'Experienced sales and technical team providing professional services' }
            },
            {
              title: { 'zh-CN': '长期支持', 'en-US': 'Long-term Support' },
              description: { 'zh-CN': '提供长期的技术支持和备件供应服务', 'en-US': 'Long-term technical support and spare parts supply services' }
            }
          ]
        }
      },
      contact: {
        banner: {
          title: { 'zh-CN': '联系我们', 'en-US': 'Contact Us' },
          subtitle: { 'zh-CN': '我们期待与您合作', 'en-US': 'We look forward to working with you' },
          image: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1920'
        },
        sections: [],
        // 联系方式信息
        contactInfo: {
          phone: {
            title: { 'zh-CN': '服务热线', 'en-US': 'Service Hotline' },
            value: '400-123-4567',
            subInfo: { 'zh-CN': '周一至周五 9:00-18:00', 'en-US': 'Mon-Fri 9:00-18:00' }
          },
          email: {
            title: { 'zh-CN': '电子邮箱', 'en-US': 'Email' },
            value: 'sales@mingsheng.com',
            subInfo: { 'zh-CN': '我们会在24小时内回复', 'en-US': 'We will reply within 24 hours' }
          },
          address: {
            title: { 'zh-CN': '公司地址', 'en-US': 'Address' },
            value: { 'zh-CN': '广东省广州市珠江三角洲', 'en-US': 'Pearl River Delta, Guangzhou, Guangdong' },
            subInfo: { 'zh-CN': '广州市明升伟业机电有限公司', 'en-US': 'Guangzhou Mingsheng Industry Co., Ltd.' }
          }
        },
        // 办事处标题
        officesTitle: { 'zh-CN': '办事处网络', 'en-US': 'Office Network' },
        // 办事处列表
        offices: [
          { city: { 'zh-CN': '长沙', 'en-US': 'Changsha' }, region: { 'zh-CN': '湖南省', 'en-US': 'Hunan Province' } },
          { city: { 'zh-CN': '株洲', 'en-US': 'Zhuzhou' }, region: { 'zh-CN': '湖南省', 'en-US': 'Hunan Province' } },
          { city: { 'zh-CN': '常德', 'en-US': 'Changde' }, region: { 'zh-CN': '湖南省', 'en-US': 'Hunan Province' } },
          { city: { 'zh-CN': '柳州', 'en-US': 'Liuzhou' }, region: { 'zh-CN': '广西省', 'en-US': 'Guangxi Province' } },
          { city: { 'zh-CN': '武汉', 'en-US': 'Wuhan' }, region: { 'zh-CN': '湖北省', 'en-US': 'Hubei Province' } },
          { city: { 'zh-CN': '宜昌', 'en-US': 'Yichang' }, region: { 'zh-CN': '湖北省', 'en-US': 'Hubei Province' } },
          { city: { 'zh-CN': '杭州', 'en-US': 'Hangzhou' }, region: { 'zh-CN': '华中地区', 'en-US': 'Central China' } },
          { city: { 'zh-CN': '上海', 'en-US': 'Shanghai' }, region: { 'zh-CN': '华东地区', 'en-US': 'East China' } }
        ]
      },
      solutions: {
        banner: {
          title: { 'zh-CN': '应用案例 / Application Cases', 'en-US': 'Application Cases' },
          subtitle: { 'zh-CN': '为不同行业提供定制化智能制造与工业自动化解决方案', 'en-US': 'Providing customized intelligent manufacturing and industrial automation solutions for different industries' },
          image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1920'
        },
        categories: [],
        // 解决方案列表
        solutionsList: [
          {
            id: 1,
            name: { 'zh-CN': '协作机器人应用方案', 'en-US': 'Collaborative Robot Application Solutions' },
            description: { 'zh-CN': '人机协作解决方案，包括拧紧、打磨、吸尘、搬运、监测等多场景应用', 'en-US': 'Human-machine collaboration solutions, including tightening, grinding, vacuuming, handling, monitoring and other multi-scenario applications' },
            image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800',
            features: [
              { 'zh-CN': '安全人机协作技术', 'en-US': 'Safe human-machine collaboration technology' },
              { 'zh-CN': '智能拧紧装配系统', 'en-US': 'Intelligent tightening assembly system' },
              { 'zh-CN': '自动打磨抛光应用', 'en-US': 'Automatic grinding and polishing applications' },
              { 'zh-CN': '精密搬运定位', 'en-US': 'Precision handling and positioning' },
              { 'zh-CN': '实时监测与数据采集', 'en-US': 'Real-time monitoring and data collection' }
            ],
            applications: [
              { 'zh-CN': '汽车装配', 'en-US': 'Automotive Assembly' },
              { 'zh-CN': '3C电子', 'en-US': '3C Electronics' },
              { 'zh-CN': '机械加工', 'en-US': 'Machining' },
              { 'zh-CN': '质量检测', 'en-US': 'Quality Inspection' }
            ]
          },
          {
            id: 2,
            name: { 'zh-CN': '自动化系统集成方案', 'en-US': 'Automation System Integration Solutions' },
            description: { 'zh-CN': 'AGV、立体库、焊装定位系统等全方位自动化解决方案', 'en-US': 'Comprehensive automation solutions including AGV, automated warehouse, welding positioning systems, etc.' },
            image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
            features: [
              { 'zh-CN': 'AGV智能物流系统', 'en-US': 'AGV intelligent logistics system' },
              { 'zh-CN': '立体仓储管理', 'en-US': 'Three-dimensional warehouse management' },
              { 'zh-CN': '焊装自动化定位', 'en-US': 'Welding automation positioning' },
              { 'zh-CN': '柔性生产线设计', 'en-US': 'Flexible production line design' },
              { 'zh-CN': 'WMS/WCS系统集成', 'en-US': 'WMS/WCS system integration' }
            ],
            applications: [
              { 'zh-CN': '智能仓储', 'en-US': 'Smart Warehousing' },
              { 'zh-CN': '焊装车间', 'en-US': 'Welding Workshop' },
              { 'zh-CN': '总装线', 'en-US': 'Final Assembly Line' },
              { 'zh-CN': '物料配送', 'en-US': 'Material Distribution' }
            ]
          },
          {
            id: 3,
            name: { 'zh-CN': '台架与夹具定制方案', 'en-US': 'Fixture and Tooling Customization Solutions' },
            description: { 'zh-CN': '托盘、台车、夹具及NC多轴柔性工装定制化设计与制造', 'en-US': 'Customized design and manufacturing of pallets, trolleys, fixtures and NC multi-axis flexible tooling' },
            image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800',
            features: [
              { 'zh-CN': 'NC多轴柔性工装', 'en-US': 'NC multi-axis flexible tooling' },
              { 'zh-CN': '定制化夹具设计', 'en-US': 'Customized fixture design' },
              { 'zh-CN': '标准托盘与台车', 'en-US': 'Standard pallets and trolleys' },
              { 'zh-CN': '快速换型系统', 'en-US': 'Quick changeover system' },
              { 'zh-CN': '精密定位装置', 'en-US': 'Precision positioning device' }
            ],
            applications: [
              { 'zh-CN': '车身焊装', 'en-US': 'Body Welding' },
              { 'zh-CN': '发动机装配', 'en-US': 'Engine Assembly' },
              { 'zh-CN': '变速箱装配', 'en-US': 'Transmission Assembly' },
              { 'zh-CN': '新能源电池', 'en-US': 'New Energy Battery' }
            ]
          },
          {
            id: 4,
            name: { 'zh-CN': 'AI视觉检测与监测方案', 'en-US': 'AI Vision Inspection and Monitoring Solutions' },
            description: { 'zh-CN': '车身解体、漆面焊点焊缝检验及智能质量监测系统', 'en-US': 'Body disassembly, paint welding point and seam inspection, and intelligent quality monitoring system' },
            image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=800',
            features: [
              { 'zh-CN': 'AI深度学习算法', 'en-US': 'AI deep learning algorithms' },
              { 'zh-CN': '车身漆面检测', 'en-US': 'Body paint inspection' },
              { 'zh-CN': '焊点焊缝检验', 'en-US': 'Welding point and seam inspection' },
              { 'zh-CN': '尺寸精度测量', 'en-US': 'Dimensional accuracy measurement' },
              { 'zh-CN': '缺陷自动识别与分类', 'en-US': 'Automatic defect identification and classification' }
            ],
            applications: [
              { 'zh-CN': '涂装质检', 'en-US': 'Coating Quality Inspection' },
              { 'zh-CN': '焊接检测', 'en-US': 'Welding Inspection' },
              { 'zh-CN': '装配监测', 'en-US': 'Assembly Monitoring' },
              { 'zh-CN': '外观检验', 'en-US': 'Appearance Inspection' }
            ]
          },
          {
            id: 5,
            name: { 'zh-CN': '节能环保改造方案', 'en-US': 'Energy-saving and Environmental Protection Solutions' },
            description: { 'zh-CN': '焊机智能化节能系统及工业设备节能降耗综合解决方案', 'en-US': 'Intelligent energy-saving system for welding machines and comprehensive energy-saving solutions for industrial equipment' },
            image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800',
            features: [
              { 'zh-CN': '焊机智能节能系统', 'en-US': 'Intelligent energy-saving system for welding machines' },
              { 'zh-CN': '能耗实时监控', 'en-US': 'Real-time energy consumption monitoring' },
              { 'zh-CN': '设备效率优化', 'en-US': 'Equipment efficiency optimization' },
              { 'zh-CN': '余热回收利用', 'en-US': 'Waste heat recovery and utilization' },
              { 'zh-CN': 'ISO50001能源管理', 'en-US': 'ISO50001 energy management' }
            ],
            applications: [
              { 'zh-CN': '焊装车间', 'en-US': 'Welding Workshop' },
              { 'zh-CN': '涂装车间', 'en-US': 'Painting Workshop' },
              { 'zh-CN': '空压站', 'en-US': 'Air Compressor Station' },
              { 'zh-CN': '动力车间', 'en-US': 'Power Workshop' }
            ]
          },
          {
            id: 6,
            name: { 'zh-CN': '降本增效数字化方案', 'en-US': 'Cost Reduction and Efficiency Digital Solutions' },
            description: { 'zh-CN': 'MES系统、拧紧管理软件、数据采集分析系统等智能制造解决方案', 'en-US': 'Intelligent manufacturing solutions including MES system, tightening management software, data collection and analysis system' },
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
            features: [
              { 'zh-CN': 'MES制造执行系统', 'en-US': 'MES manufacturing execution system' },
              { 'zh-CN': '拧紧数据管理', 'en-US': 'Tightening data management' },
              { 'zh-CN': '工位作业指导', 'en-US': 'Workstation operation guidance' },
              { 'zh-CN': '防错防呆系统', 'en-US': 'Error-proofing system' },
              { 'zh-CN': 'OEE综合效率分析', 'en-US': 'OEE comprehensive efficiency analysis' }
            ],
            applications: [
              { 'zh-CN': '装配车间', 'en-US': 'Assembly Workshop' },
              { 'zh-CN': '拧紧工位', 'en-US': 'Tightening Station' },
              { 'zh-CN': '质量追溯', 'en-US': 'Quality Traceability' },
              { 'zh-CN': '生产管理', 'en-US': 'Production Management' }
            ]
          },
          {
            id: 7,
            name: { 'zh-CN': 'AI人工智能应用方案', 'en-US': 'AI Artificial Intelligence Application Solutions' },
            description: { 'zh-CN': '工业AI技术在预测性维护、质量预测、智能排产等场景的应用', 'en-US': 'Application of industrial AI technology in predictive maintenance, quality prediction, intelligent scheduling and other scenarios' },
            image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
            features: [
              { 'zh-CN': '预测性维护', 'en-US': 'Predictive maintenance' },
              { 'zh-CN': '智能质量预测', 'en-US': 'Intelligent quality prediction' },
              { 'zh-CN': 'AI智能排产', 'en-US': 'AI intelligent scheduling' },
              { 'zh-CN': '异常检测预警', 'en-US': 'Abnormal detection and early warning' },
              { 'zh-CN': '工艺参数优化', 'en-US': 'Process parameter optimization' }
            ],
            applications: [
              { 'zh-CN': '设备管理', 'en-US': 'Equipment Management' },
              { 'zh-CN': '质量管理', 'en-US': 'Quality Management' },
              { 'zh-CN': '生产计划', 'en-US': 'Production Planning' },
              { 'zh-CN': '能源管理', 'en-US': 'Energy Management' }
            ]
          }
        ],
        // 咨询按钮文字
        consultButtonText: { 'zh-CN': '咨询方案', 'en-US': 'Consult Solution' },
        // 方案特点标题
        featuresTitle: { 'zh-CN': '方案特点', 'en-US': 'Solution Features' },
        // 应用场景标题
        applicationsTitle: { 'zh-CN': '应用场景', 'en-US': 'Application Scenarios' }
      }
    })),
    
    // 应用案例分类（1级）
    solutionCategories: JSON.parse(localStorage.getItem('solutionCategories') || JSON.stringify([
      {
        id: 1,
        name: { 'zh-CN': '汽车制造', 'en-US': 'Automobile Manufacturing' },
        description: { 'zh-CN': '为汽车制造企业提供全套工具装配解决方案', 'en-US': 'Complete tool assembly solutions for automotive manufacturers' },
        image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600',
        icon: 'Van'
      },
      {
        id: 2,
        name: { 'zh-CN': '智能制造', 'en-US': 'Intelligent Manufacturing' },
        description: { 'zh-CN': '配套智能制造领域的工具应用与系统集成', 'en-US': 'Tool applications and system integration for intelligent manufacturing' },
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600',
        icon: 'Monitor'
      }
    ])),
    
    // 应用案例2级分类
    solutionSubCategories: JSON.parse(localStorage.getItem('solutionSubCategories') || JSON.stringify([])),
    
    // 应用案例3级分类
    solutionThirdCategories: JSON.parse(localStorage.getItem('solutionThirdCategories') || JSON.stringify([])),
    
    // 具体案例
    solutionCases: JSON.parse(localStorage.getItem('solutionCases') || JSON.stringify([]))
  }),
  
  getters: {
    // 获取可见的导航项（按order排序）
    visibleNavItems: (state) => {
      return state.navItems
        .filter(item => item.visible)
        .sort((a, b) => a.order - b.order)
    },
    
    // 获取页面内容
    getPageContent: (state) => (pageName, locale = 'zh-CN') => {
      return state.pages[pageName] || {}
    },
    
    // 获取2级分类
    getSolutionSubCategories: (state) => (categoryId) => {
      return state.solutionSubCategories.filter(sub => sub.parentId === categoryId)
    },
    
    // 获取3级分类
    getSolutionThirdCategories: (state) => (subCategoryId) => {
      return state.solutionThirdCategories.filter(third => third.parentId === subCategoryId)
    },
    
    // 获取案例
    getSolutionCases: (state) => (categoryId, level = 1) => {
      return state.solutionCases.filter(c => {
        if (level === 1) return c.categoryId === categoryId
        if (level === 2) return c.subCategoryId === categoryId
        if (level === 3) return c.thirdCategoryId === categoryId
        return false
      })
    }
  },
  
  actions: {
    // ========== 导航栏管理 ==========
    addNavItem(item) {
      const maxId = this.navItems.length > 0 ? Math.max(...this.navItems.map(i => parseInt(i.id.replace(/[^\d]/g, '')) || 0)) : 0
      const maxOrder = this.navItems.length > 0 ? Math.max(...this.navItems.map(i => i.order)) : 0
      item.id = item.id || `nav-${maxId + 1}`
      item.order = item.order || maxOrder + 1
      item.visible = item.visible !== false
      this.navItems.push(item)
      this.saveNavItems()
    },
    
    updateNavItem(item) {
      const index = this.navItems.findIndex(i => i.id === item.id)
      if (index !== -1) {
        this.navItems[index] = item
        this.saveNavItems()
      }
    },
    
    deleteNavItem(id) {
      this.navItems = this.navItems.filter(i => i.id !== id)
      this.saveNavItems()
    },
    
    reorderNavItems(items) {
      this.navItems = items
      this.saveNavItems()
    },
    
    saveNavItems() {
      localStorage.setItem('navItems', JSON.stringify(this.navItems))
    },
    
    // ========== 页面内容管理 ==========
    updatePageContent(pageName, content) {
      this.pages[pageName] = content
      this.savePages()
    },
    
    updatePageSection(pageName, sectionIndex, section) {
      if (!this.pages[pageName].sections) {
        this.pages[pageName].sections = []
      }
      if (sectionIndex >= 0) {
        this.pages[pageName].sections[sectionIndex] = section
      } else {
        this.pages[pageName].sections.push(section)
      }
      this.savePages()
    },
    
    deletePageSection(pageName, sectionIndex) {
      if (this.pages[pageName].sections) {
        this.pages[pageName].sections.splice(sectionIndex, 1)
        this.savePages()
      }
    },
    
    savePages() {
      localStorage.setItem('pageContents', JSON.stringify(this.pages))
    },
    
    // ========== 应用案例分类管理（1级）==========
    addSolutionCategory(category) {
      const maxId = Math.max(...this.solutionCategories.map(c => c.id), 0)
      category.id = maxId + 1
      this.solutionCategories.push(category)
      this.saveSolutionCategories()
    },
    
    updateSolutionCategory(category) {
      const index = this.solutionCategories.findIndex(c => c.id === category.id)
      if (index !== -1) {
        this.solutionCategories[index] = category
        this.saveSolutionCategories()
      }
    },
    
    deleteSolutionCategory(id) {
      // 删除相关的2级、3级分类和案例
      this.solutionSubCategories = this.solutionSubCategories.filter(sub => sub.parentId !== id)
      this.solutionCases = this.solutionCases.filter(c => c.categoryId !== id)
      this.solutionCategories = this.solutionCategories.filter(c => c.id !== id)
      
      this.saveSolutionCategories()
      this.saveSolutionSubCategories()
      this.saveSolutionCases()
    },
    
    saveSolutionCategories() {
      localStorage.setItem('solutionCategories', JSON.stringify(this.solutionCategories))
    },
    
    // ========== 应用案例2级分类管理 ==========
    addSolutionSubCategory(subCategory) {
      const maxId = Math.max(...this.solutionSubCategories.map(s => s.id), 0)
      subCategory.id = maxId + 1
      this.solutionSubCategories.push(subCategory)
      this.saveSolutionSubCategories()
    },
    
    updateSolutionSubCategory(subCategory) {
      const index = this.solutionSubCategories.findIndex(s => s.id === subCategory.id)
      if (index !== -1) {
        this.solutionSubCategories[index] = subCategory
        this.saveSolutionSubCategories()
      }
    },
    
    deleteSolutionSubCategory(id) {
      this.solutionThirdCategories = this.solutionThirdCategories.filter(third => third.parentId !== id)
      this.solutionCases = this.solutionCases.filter(c => c.subCategoryId !== id)
      this.solutionSubCategories = this.solutionSubCategories.filter(s => s.id !== id)
      
      this.saveSolutionSubCategories()
      this.saveSolutionThirdCategories()
      this.saveSolutionCases()
    },
    
    saveSolutionSubCategories() {
      localStorage.setItem('solutionSubCategories', JSON.stringify(this.solutionSubCategories))
    },
    
    // ========== 应用案例3级分类管理 ==========
    addSolutionThirdCategory(thirdCategory) {
      const maxId = Math.max(...this.solutionThirdCategories.map(t => t.id), 0)
      thirdCategory.id = maxId + 1
      this.solutionThirdCategories.push(thirdCategory)
      this.saveSolutionThirdCategories()
    },
    
    updateSolutionThirdCategory(thirdCategory) {
      const index = this.solutionThirdCategories.findIndex(t => t.id === thirdCategory.id)
      if (index !== -1) {
        this.solutionThirdCategories[index] = thirdCategory
        this.saveSolutionThirdCategories()
      }
    },
    
    deleteSolutionThirdCategory(id) {
      this.solutionCases = this.solutionCases.filter(c => c.thirdCategoryId !== id)
      this.solutionThirdCategories = this.solutionThirdCategories.filter(t => t.id !== id)
      
      this.saveSolutionThirdCategories()
      this.saveSolutionCases()
    },
    
    saveSolutionThirdCategories() {
      localStorage.setItem('solutionThirdCategories', JSON.stringify(this.solutionThirdCategories))
    },
    
    // ========== 案例管理 ==========
    addSolutionCase(solutionCase) {
      const maxId = Math.max(...this.solutionCases.map(c => c.id), 0)
      solutionCase.id = maxId + 1
      solutionCase.images = solutionCase.images || []
      this.solutionCases.push(solutionCase)
      this.saveSolutionCases()
    },
    
    updateSolutionCase(solutionCase) {
      const index = this.solutionCases.findIndex(c => c.id === solutionCase.id)
      if (index !== -1) {
        this.solutionCases[index] = solutionCase
        this.saveSolutionCases()
      }
    },
    
    deleteSolutionCase(id) {
      this.solutionCases = this.solutionCases.filter(c => c.id !== id)
      this.saveSolutionCases()
    },
    
    saveSolutionCases() {
      localStorage.setItem('solutionCases', JSON.stringify(this.solutionCases))
    }
  }
})
