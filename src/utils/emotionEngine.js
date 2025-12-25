/**
 * Phase 3: 情绪感知引擎
 * 功能: 情绪识别、共情响应、人格化设计
 */

// ========== 情绪识别引擎 ==========
export class EmotionRecognizer {
  constructor() {
    // 情绪关键词库
    this.emotionKeywords = {
      anxiety: ['太累', '压力', 'KPI完不成', '焦虑', '担心', '紧张', '害怕'],
      confusion: ['不知道', '没思路', '怎么办', '迷茫', '困惑', '不懂'],
      frustration: ['烦', '郁闷', '无语', '气', '怒', '生气'],
      sadness: ['难过', '失望', '伤心', '沮丧', '失落'],
      joy: ['开心', '高兴', '棒', '太好了', '成功', '满意']
    }

    // 情绪强度词
    this.intensityModifiers = {
      high: ['非常', '特别', '太', '超级', '极其', '十分'],
      low: ['有点', '稍微', '略', '还好']
    }
  }

  /**
   * 分析用户输入的情绪
   * @param {String} text - 用户输入文本
   * @returns {Object} 情绪分析结果
   */
  analyzeEmotion(text) {
    if (!text || text.trim().length === 0) {
      return this.getDefaultEmotion()
    }

    const emotions = {}
    let dominantEmotion = 'neutral'
    let maxScore = 0
    let intensity = 'medium'

    // 检测情绪
    Object.keys(this.emotionKeywords).forEach(emotion => {
      const keywords = this.emotionKeywords[emotion]
      let score = 0
      
      keywords.forEach(keyword => {
        if (text.includes(keyword)) {
          score += 1
        }
      })
      
      emotions[emotion] = score
      
      if (score > maxScore) {
        maxScore = score
        dominantEmotion = emotion
      }
    })

    // 检测强度
    const hasHighIntensity = this.intensityModifiers.high.some(mod => text.includes(mod))
    const hasLowIntensity = this.intensityModifiers.low.some(mod => text.includes(mod))
    
    if (hasHighIntensity) {
      intensity = 'high'
    } else if (hasLowIntensity) {
      intensity = 'low'
    }

    // 如果没有检测到明显情绪
    if (maxScore === 0) {
      dominantEmotion = 'neutral'
    }

    return {
      dominant: dominantEmotion,
      intensity,
      score: maxScore,
      confidence: this.calculateConfidence(maxScore),
      emotions,
      needsSupport: ['anxiety', 'frustration', 'sadness'].includes(dominantEmotion),
      suggestedTone: this.getSuggestedTone(dominantEmotion, intensity)
    }
  }

  /**
   * 计算置信度
   */
  calculateConfidence(score) {
    if (score === 0) return 50
    if (score === 1) return 70
    if (score === 2) return 85
    return 95
  }

  /**
   * 获取建议的回复语气
   */
  getSuggestedTone(emotion, intensity) {
    const tones = {
      anxiety: {
        temperature: 0.6,
        style: '温和、确定性强、减压',
        keywords: ['我们', '一起', '没问题', '慢慢来']
      },
      confusion: {
        temperature: 0.7,
        style: '引导式、启发性、结构化',
        keywords: ['首先', '其次', '步骤', '建议']
      },
      frustration: {
        temperature: 0.5,
        style: '理解、安抚、建设性',
        keywords: ['理解', '确实', '不过', '换个角度']
      },
      sadness: {
        temperature: 0.4,
        style: '共情、鼓励、支持',
        keywords: ['我懂', '别难过', '加油', '相信你']
      },
      joy: {
        temperature: 0.8,
        style: '积极、肯定、庆祝',
        keywords: ['太棒了', '恭喜', '继续保持', '真不错']
      },
      neutral: {
        temperature: 0.7,
        style: '专业、友好、高效',
        keywords: ['好的', '明白', '没问题', '为您']
      }
    }

    return tones[emotion] || tones.neutral
  }

  /**
   * 默认情绪状态
   */
  getDefaultEmotion() {
    return {
      dominant: 'neutral',
      intensity: 'medium',
      score: 0,
      confidence: 50,
      emotions: {},
      needsSupport: false,
      suggestedTone: this.getSuggestedTone('neutral', 'medium')
    }
  }
}

// ========== 共情响应生成器 ==========
export class EmpathyResponseGenerator {
  constructor() {
    this.responseTemplates = {
      anxiety: [
        '营销工作确实不容易,我完全理解您的压力。要不我们先梳理下最核心的三个点?剩下的我来帮您草拟?',
        '别太焦虑,让我们一步一步来。先说说您最担心的是什么?',
        '深呼吸,我们一起来解决。先从最紧急的开始,好吗?'
      ],
      confusion: [
        '我注意到您好像有些困惑。让我为您提供一个清晰的思维导图如何?',
        '没思路很正常,我们来做个头脑风暴吧!先说说项目的基本情况?',
        '别着急,我来帮您梳理一下思路。首先,我们的目标是什么?'
      ],
      frustration: [
        '我理解您的心情。要不要先休息一下,我们换个角度看问题?',
        '确实让人郁闷。不过既然问题已经出现,我们一起想办法解决,好吗?',
        '您的感受我能理解。让我们冷静分析下,看看有什么突破口。'
      ],
      sadness: [
        '我能感受到您的失落。不过换个角度想,这也是学习和成长的机会。',
        '别太难过,每个人都会遇到挫折。让我帮您分析下,下次怎么做得更好?',
        '我懂您的心情。要不我们一起复盘一下,找出可以改进的地方?'
      ],
      joy: [
        '太棒了!恭喜您!能分享下成功的经验吗?',
        '真为您高兴!这个成果值得庆祝,继续保持!',
        '非常棒的表现!您是怎么做到的?可以分享给其他同事吗?'
      ]
    }
  }

  /**
   * 生成共情回复
   * @param {Object} emotionAnalysis - 情绪分析结果
   * @param {String} userInput - 用户输入
   */
  generateResponse(emotionAnalysis, userInput) {
    const { dominant, intensity } = emotionAnalysis
    
    const templates = this.responseTemplates[dominant] || [
      '我明白了,让我来帮您分析一下。'
    ]
    
    // 随机选择一个模板
    const template = templates[Math.floor(Math.random() * templates.length)]
    
    // 根据强度调整
    let response = template
    if (intensity === 'high') {
      response = this.enhanceIntensity(response)
    }
    
    return {
      text: response,
      tone: emotionAnalysis.suggestedTone,
      suggestions: this.generateActionSuggestions(dominant, userInput)
    }
  }

  /**
   * 增强回复的情感强度
   */
  enhanceIntensity(text) {
    // 添加额外的共情词汇
    const intensifiers = [
      '特别',
      '非常',
      '真的'
    ]
    
    const intensifier = intensifiers[Math.floor(Math.random() * intensifiers.length)]
    return text.replace(/我理解/, `我${intensifier}理解`)
  }

  /**
   * 生成行动建议
   */
  generateActionSuggestions(emotion, userInput) {
    const suggestions = {
      anxiety: [
        '📋 让我为您列一个优先级清单',
        '⏰ 我们可以做一个时间规划',
        '🤝 需要我帮您分担一些任务吗?'
      ],
      confusion: [
        '🗺️ 我来为您画个思维导图',
        '📚 要不要看看类似项目的案例?',
        '💡 我们可以先做个简单的POC验证'
      ],
      frustration: [
        '☕ 建议您先休息10分钟',
        '🔄 让我们换个思路重新审视',
        '📊 我帮您分析下根本原因'
      ],
      sadness: [
        '📈 我们一起复盘,找出改进点',
        '💪 让我给您一些成功案例参考',
        '🎯 下次我们可以这样做...'
      ],
      joy: [
        '🎉 要不要生成一份成功案例文档?',
        '📢 这个成果值得分享给团队',
        '🌟 继续保持,还有哪里需要优化?'
      ]
    }
    
    return suggestions[emotion] || []
  }
}

// ========== 人格化System Prompt生成器 ==========
export class PersonalityPromptBuilder {
  constructor() {
    this.basePersonality = {
      role: '拥有多年营销经验且极具亲和力的职场伙伴',
      traits: [
        '专业但不过于刻板',
        '适度使用幽默',
        '善用"我们"而非"我"',
        '懂得倾听和共情',
        '主动提供解决方案'
      ],
      forbidden: [
        '使用过于正式的官方用语',
        '机械式回答',
        '忽视用户情绪',
        '只提供信息不提供行动建议'
      ]
    }
  }

  /**
   * 构建系统提示词
   * @param {Object} emotionAnalysis - 当前对话的情绪分析
   */
  buildSystemPrompt(emotionAnalysis) {
    const { suggestedTone } = emotionAnalysis
    
    return `# 角色定位
你是一位${this.basePersonality.role}。你不仅仅是一个客服机器人,而是用户的得力助手和可信赖的伙伴。

# 性格特征
${this.basePersonality.traits.map(t => `- ${t}`).join('\n')}

# 当前对话语气
- 风格: ${suggestedTone.style}
- Temperature: ${suggestedTone.temperature}
- 常用词汇: ${suggestedTone.keywords.join('、')}

# 禁止行为
${this.basePersonality.forbidden.map(f => `- ${f}`).join('\n')}

# 情绪响应规则
${this.getEmotionRules(emotionAnalysis)}

# 核心原则
1. 用户第一: 始终站在用户角度思考
2. 解决问题: 不仅回答"是什么",更要说明"怎么做"
3. 共同成长: 与用户一起学习和进步
4. 真诚沟通: 坦诚交流,建立信任

# 回复格式
1. 先表达理解和共情(如有需要)
2. 然后提供清晰的解决方案
3. 最后给出可执行的下一步建议
4. 保持简洁,避免冗长

现在,请以这样的身份和语气,回答用户的问题。`
  }

  /**
   * 获取情绪响应规则
   */
  getEmotionRules(emotionAnalysis) {
    const rules = {
      anxiety: '- 当用户焦虑时,回答应更简洁、确定,并带有减压的心理暗示\n- 避免增加不确定性,多用"我们一起"、"没问题"等表达',
      confusion: '- 当用户困惑时,提供结构化的思维导图或步骤指导\n- 使用"首先"、"其次"、"然后"等逻辑词',
      frustration: '- 当用户沮丧时,先表达理解,再提供建设性建议\n- 避免说教,多用"换个角度"、"我们可以"等表达',
      sadness: '- 当用户难过时,给予情感支持和鼓励\n- 避免轻描淡写,多用"我懂"、"别难过"等表达',
      joy: '- 当用户开心时,一起庆祝并肯定成果\n- 可以适当幽默,多用"太棒了"、"恭喜"等表达',
      neutral: '- 保持专业、友好、高效\n- 快速理解需求,提供精准解决方案'
    }
    
    return rules[emotionAnalysis.dominant] || rules.neutral
  }
}

// ========== 导出 ==========
export default {
  EmotionRecognizer,
  EmpathyResponseGenerator,
  PersonalityPromptBuilder
}
