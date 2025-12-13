import { defineStore } from 'pinia'

export const useTighteningStrategyStore = defineStore('tighteningStrategy', {
  state: () => ({
    // 拧紧策略案例库
    strategies: [
      {
        id: 1,
        name: '发动机缸盖螺栓拧紧',
        boltCount: 10,
        pattern: '对称拧紧',
        method: '扭矩-角度法',
        sequence: [1, 10, 2, 9, 3, 8, 4, 7, 5, 6],
        stages: [
          { stage: 1, torque: 20, angle: 0, speed: 'medium', description: '预紧阶段' },
          { stage: 2, torque: 50, angle: 0, speed: 'medium', description: '半紧阶段' },
          { stage: 3, torque: 80, angle: 90, speed: 'slow', description: '终紧阶段' }
        ],
        targetTorque: 80,
        targetAngle: 90,
        tolerance: 5,
        application: '汽车发动机装配',
        difficulty: 'high',
        quality: 'critical',
        tips: [
          '必须严格按照对称顺序拧紧',
          '每个阶段完成后需检查',
          '角度法确保塑性变形区域一致',
          '避免单螺栓一次拧到位'
        ],
        warnings: [
          '不可跳步拧紧',
          '温度影响较大，需在常温下操作',
          '螺栓必须使用专用润滑剂'
        ]
      },
      {
        id: 2,
        name: '车轮螺栓拧紧',
        boltCount: 5,
        pattern: '星形拧紧',
        method: '扭矩法',
        sequence: [1, 3, 5, 2, 4],
        stages: [
          { stage: 1, torque: 60, angle: 0, speed: 'fast', description: '预紧阶段' },
          { stage: 2, torque: 120, angle: 0, speed: 'medium', description: '终紧阶段' }
        ],
        targetTorque: 120,
        targetAngle: 0,
        tolerance: 8,
        application: '汽车车轮装配',
        difficulty: 'medium',
        quality: 'important',
        tips: [
          '星形顺序确保受力均匀',
          '第一遍预紧后需复检',
          '使用扭矩扳手终紧',
          '注意螺栓表面清洁'
        ],
        warnings: [
          '不可顺时针依次拧紧',
          '过紧会损坏轮毂',
          '螺栓不可重复使用超过3次'
        ]
      },
      {
        id: 3,
        name: '变速箱外壳螺栓',
        boltCount: 12,
        pattern: '螺旋拧紧',
        method: '扭矩法',
        sequence: [1, 4, 7, 10, 2, 5, 8, 11, 3, 6, 9, 12],
        stages: [
          { stage: 1, torque: 15, angle: 0, speed: 'fast', description: '预紧阶段' },
          { stage: 2, torque: 35, angle: 0, speed: 'medium', description: '终紧阶段' }
        ],
        targetTorque: 35,
        targetAngle: 0,
        tolerance: 3,
        application: '变速箱装配',
        difficulty: 'medium',
        quality: 'important',
        tips: [
          '螺旋顺序从中心向外',
          '确保密封面清洁',
          '注意密封垫片安装',
          '终紧后检查无渗漏'
        ],
        warnings: [
          '不可局部拧紧',
          '注意密封胶涂抹量',
          '避免交叉螺纹'
        ]
      },
      {
        id: 4,
        name: '底盘悬挂螺栓',
        boltCount: 4,
        pattern: '交叉拧紧',
        method: '扭矩法',
        sequence: [1, 3, 2, 4],
        stages: [
          { stage: 1, torque: 40, angle: 0, speed: 'medium', description: '预紧阶段' },
          { stage: 2, torque: 85, angle: 0, speed: 'slow', description: '终紧阶段' }
        ],
        targetTorque: 85,
        targetAngle: 0,
        tolerance: 5,
        application: '汽车底盘装配',
        difficulty: 'high',
        quality: 'critical',
        tips: [
          '交叉拧紧减少应力',
          '确保橡胶衬套正确安装',
          '车辆静止状态下拧紧',
          '完成后需进行路测'
        ],
        warnings: [
          '安全相关件，必须严格执行',
          '不可使用冲击扳手',
          '螺栓不可重复使用'
        ]
      },
      {
        id: 5,
        name: '电池包固定螺栓',
        boltCount: 8,
        pattern: '对称拧紧',
        method: '扭矩法',
        sequence: [1, 8, 2, 7, 3, 6, 4, 5],
        stages: [
          { stage: 1, torque: 20, angle: 0, speed: 'medium', description: '预紧阶段' },
          { stage: 2, torque: 45, angle: 0, speed: 'slow', description: '终紧阶段' }
        ],
        targetTorque: 45,
        targetAngle: 0,
        tolerance: 4,
        application: '新能源汽车电池装配',
        difficulty: 'high',
        quality: 'critical',
        tips: [
          '对称拧紧避免电池包变形',
          '注意绝缘措施',
          '确保接地可靠',
          '完成后需气密性测试'
        ],
        warnings: [
          '高压危险，需专业人员操作',
          '不可过紧导致外壳变形',
          '必须使用绝缘工具'
        ]
      }
    ],

    // 拧紧方法库
    methods: [
      {
        id: 'torque',
        name: '扭矩法',
        description: '通过控制拧紧扭矩来保证预紧力',
        advantages: ['简单易行', '工具普遍', '成本低'],
        disadvantages: ['精度受摩擦系数影响大', '分散度约±25%'],
        suitable: ['一般连接', '非关键部件'],
        accuracy: '±25%',
        cost: 'low'
      },
      {
        id: 'torque-angle',
        name: '扭矩-角度法',
        description: '先扭矩预紧，再角度终紧',
        advantages: ['精度高', '不受摩擦影响', '分散度约±15%'],
        disadvantages: ['需专用设备', '操作复杂', '成本较高'],
        suitable: ['关键连接', '发动机缸盖', '底盘安全件'],
        accuracy: '±15%',
        cost: 'medium'
      },
      {
        id: 'angle',
        name: '角度法',
        description: '通过控制螺栓转角来保证预紧力',
        advantages: ['精度较高', '不受润滑影响'],
        disadvantages: ['需知道弹性转角', '设备要求高'],
        suitable: ['螺栓材料性能一致的场合'],
        accuracy: '±20%',
        cost: 'medium'
      },
      {
        id: 'yield',
        name: '屈服点法',
        description: '将螺栓拧到屈服点',
        advantages: ['精度最高', '分散度约±10%'],
        disadvantages: ['螺栓一次性使用', '成本最高'],
        suitable: ['极关键连接', '航空航天'],
        accuracy: '±10%',
        cost: 'high'
      }
    ],

    // 拧紧模式库
    patterns: [
      {
        id: 'symmetric',
        name: '对称拧紧',
        description: '从中心向外对称拧紧，确保受力均匀',
        icon: 'grid',
        suitable: ['多螺栓圆形布置', '发动机缸盖', '电池包'],
        boltCountRange: [4, 20],
        visualization: 'symmetric'
      },
      {
        id: 'star',
        name: '星形拧紧',
        description: '按星形顺序拧紧，适用于5孔或6孔布置',
        icon: 'star',
        suitable: ['车轮', '制动盘', '离合器'],
        boltCountRange: [5, 6],
        visualization: 'star'
      },
      {
        id: 'cross',
        name: '交叉拧紧',
        description: '对角拧紧，减少应力集中',
        icon: 'close',
        suitable: ['矩形布置', '方形法兰', '4螺栓连接'],
        boltCountRange: [4, 4],
        visualization: 'cross'
      },
      {
        id: 'spiral',
        name: '螺旋拧紧',
        description: '从中心螺旋向外，适用于大型法兰',
        icon: 'refresh',
        suitable: ['大型法兰', '变速箱外壳', '齿轮箱'],
        boltCountRange: [8, 30],
        visualization: 'spiral'
      }
    ]
  }),

  getters: {
    // 根据应用场景筛选策略
    getStrategiesByApplication: (state) => (application) => {
      return state.strategies.filter(s => s.application.includes(application))
    },

    // 根据难度筛选
    getStrategiesByDifficulty: (state) => (difficulty) => {
      return state.strategies.filter(s => s.difficulty === difficulty)
    },

    // 根据螺栓数量推荐模式
    recommendPattern: (state) => (boltCount) => {
      return state.patterns.filter(p => 
        boltCount >= p.boltCountRange[0] && boltCount <= p.boltCountRange[1]
      )
    },

    // 根据质量要求推荐方法
    recommendMethod: (state) => (quality, cost) => {
      let methods = state.methods
      if (quality === 'critical') {
        methods = methods.filter(m => m.accuracy !== '±25%')
      }
      if (cost === 'low') {
        methods = methods.filter(m => m.cost === 'low' || m.cost === 'medium')
      }
      return methods
    }
  },

  actions: {
    // 智能推荐拧紧策略
    recommendStrategy(params) {
      const { boltCount, application, quality, torqueRange, budget } = params
      
      let recommendations = [...this.strategies]

      // 按应用筛选
      if (application) {
        recommendations = recommendations.filter(s => 
          s.application.toLowerCase().includes(application.toLowerCase())
        )
      }

      // 按螺栓数量筛选
      if (boltCount) {
        recommendations = recommendations.filter(s => s.boltCount === boltCount)
      }

      // 按质量要求筛选
      if (quality) {
        recommendations = recommendations.filter(s => s.quality === quality)
      }

      // 按扭矩范围筛选
      if (torqueRange) {
        recommendations = recommendations.filter(s => 
          s.targetTorque >= torqueRange[0] && s.targetTorque <= torqueRange[1]
        )
      }

      // 评分排序
      recommendations = recommendations.map(strategy => {
        let score = 0
        
        // 质量匹配加分
        if (strategy.quality === quality) score += 30
        
        // 难度适中加分
        if (strategy.difficulty === 'medium') score += 10
        
        // 螺栓数量匹配加分
        if (strategy.boltCount === boltCount) score += 20
        
        // 应用场景匹配加分
        if (application && strategy.application.includes(application)) score += 25
        
        return { ...strategy, matchScore: score }
      })

      // 按评分排序
      recommendations.sort((a, b) => b.matchScore - a.matchScore)

      return recommendations
    },

    // 生成拧紧顺序可视化数据
    generateSequenceVisualization(strategy) {
      const { boltCount, sequence, pattern } = strategy
      
      // 生成螺栓位置（圆形分布）
      const positions = []
      const radius = 100
      const centerX = 150
      const centerY = 150
      
      for (let i = 0; i < boltCount; i++) {
        const angle = (2 * Math.PI * i) / boltCount - Math.PI / 2
        positions.push({
          id: i + 1,
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle),
          order: sequence.indexOf(i + 1) + 1
        })
      }
      
      return {
        positions,
        connections: sequence.map((bolt, index) => {
          if (index === sequence.length - 1) return null
          return {
            from: bolt,
            to: sequence[index + 1]
          }
        }).filter(c => c !== null)
      }
    },

    // 添加自定义策略
    addCustomStrategy(strategy) {
      const newStrategy = {
        ...strategy,
        id: Math.max(...this.strategies.map(s => s.id)) + 1,
        custom: true
      }
      this.strategies.push(newStrategy)
      return newStrategy
    },

    // 删除自定义策略
    deleteCustomStrategy(id) {
      const index = this.strategies.findIndex(s => s.id === id && s.custom)
      if (index > -1) {
        this.strategies.splice(index, 1)
        return true
      }
      return false
    }
  }
})
