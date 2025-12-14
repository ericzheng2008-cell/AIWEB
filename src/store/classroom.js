/**
 * 产品技术销售小课堂 Store
 * 管理技术课程的多级分类和内容
 */

import { defineStore } from 'pinia'

export const useClassroomStore = defineStore('classroom', {
  state: () => ({
    // 一级分类
    categories: [
      {
        id: 1,
        name: '协作机器人',
        icon: '🤖',
        description: '协作机器人技术、应用场景、编程与集成',
        order: 1
      },
      {
        id: 2,
        name: 'AGV/AMR',
        icon: '🚗',
        description: 'AGV自动导引车和AMR自主移动机器人技术',
        order: 2
      },
      {
        id: 3,
        name: 'PLC控制系统',
        icon: '💻',
        description: 'PLC编程、工业控制系统设计与应用',
        order: 3
      },
      {
        id: 4,
        name: '拧紧工艺与工具',
        icon: '🔧',
        description: '拧紧技术、工艺参数、工具选型与维护',
        order: 4
      },
      {
        id: 5,
        name: '自动涂胶SPRFDS',
        icon: '💧',
        description: '自动涂胶系统、流体分配、密封胶应用',
        order: 5
      },
      {
        id: 6,
        name: '机器视觉',
        icon: '👁️',
        description: '视觉检测、图像处理、AI视觉识别',
        order: 6
      },
      {
        id: 7,
        name: '精密测量',
        icon: '📏',
        description: '工业测量技术、尺寸检测、质量控制',
        order: 7
      },
      {
        id: 8,
        name: '焊装NC柔性系统',
        icon: '⚡',
        description: 'NC焊接系统、柔性制造、焊装工艺',
        order: 8
      },
      {
        id: 9,
        name: '设备服务知识',
        icon: '🛠️',
        description: '设备维护、故障诊断、服务技术',
        order: 9
      }
    ],
    
    // 二级分类
    subcategories: [
      // 协作机器人二级分类
      { id: 101, categoryId: 1, name: '协作机器人基础', order: 1 },
      { id: 102, categoryId: 1, name: '编程与调试', order: 2 },
      { id: 103, categoryId: 1, name: '安全规范', order: 3 },
      { id: 104, categoryId: 1, name: '应用案例', order: 4 },
      
      // AGV/AMR二级分类
      { id: 201, categoryId: 2, name: 'AGV导航技术', order: 1 },
      { id: 202, categoryId: 2, name: 'AMR路径规划', order: 2 },
      { id: 203, categoryId: 2, name: '调度系统', order: 3 },
      { id: 204, categoryId: 2, name: '场景应用', order: 4 },
      
      // PLC控制系统二级分类
      { id: 301, categoryId: 3, name: 'PLC基础编程', order: 1 },
      { id: 302, categoryId: 3, name: '梯形图设计', order: 2 },
      { id: 303, categoryId: 3, name: '通信协议', order: 3 },
      { id: 304, categoryId: 3, name: '故障诊断', order: 4 },
      
      // 拧紧工艺与工具二级分类
      { id: 401, categoryId: 4, name: '拧紧工艺基础', order: 1 },
      { id: 402, categoryId: 4, name: '工具选型指南', order: 2 },
      { id: 403, categoryId: 4, name: 'Open Protocol协议', order: 3 },
      { id: 404, categoryId: 4, name: '质量管理与分析', order: 4 },
      { id: 405, categoryId: 4, name: '常见问题解决', order: 5 },
      
      // 自动涂胶SPRFDS二级分类
      { id: 501, categoryId: 5, name: '涂胶系统原理', order: 1 },
      { id: 502, categoryId: 5, name: '流体控制技术', order: 2 },
      { id: 503, categoryId: 5, name: '密封胶应用', order: 3 },
      { id: 504, categoryId: 5, name: '系统维护', order: 4 },
      
      // 机器视觉二级分类
      { id: 601, categoryId: 6, name: '视觉系统基础', order: 1 },
      { id: 602, categoryId: 6, name: '图像处理算法', order: 2 },
      { id: 603, categoryId: 6, name: 'AI视觉识别', order: 3 },
      { id: 604, categoryId: 6, name: '应用实例', order: 4 },
      
      // 精密测量二级分类
      { id: 701, categoryId: 7, name: '测量技术基础', order: 1 },
      { id: 702, categoryId: 7, name: '尺寸检测方法', order: 2 },
      { id: 703, categoryId: 7, name: 'SPC统计分析', order: 3 },
      { id: 704, categoryId: 7, name: '测量系统分析MSA', order: 4 },
      
      // 焊装NC柔性系统二级分类
      { id: 801, categoryId: 8, name: 'NC焊接原理', order: 1 },
      { id: 802, categoryId: 8, name: '柔性制造系统', order: 2 },
      { id: 803, categoryId: 8, name: '焊装工艺参数', order: 3 },
      { id: 804, categoryId: 8, name: '质量控制', order: 4 },
      
      // 设备服务知识二级分类
      { id: 901, categoryId: 9, name: '预防性维护', order: 1 },
      { id: 902, categoryId: 9, name: '故障诊断方法', order: 2 },
      { id: 903, categoryId: 9, name: '备件管理', order: 3 },
      { id: 904, categoryId: 9, name: '服务技术规范', order: 4 }
    ],
    
    // 课程内容
    lessons: [
      // 示例课程
      {
        id: 1001,
        categoryId: 1,
        subcategoryId: 101,
        title: '协作机器人入门指南',
        description: '了解协作机器人的基本概念、工作原理和应用场景',
        content: '协作机器人(Collaborative Robot, Cobot)是一种可以与人类在共享工作空间中安全协作的机器人...',
        coverImage: '',
        author: '技术专家',
        duration: '30分钟',
        level: '入门',
        tags: ['基础', '协作机器人', '入门'],
        views: 0,
        likes: 0,
        createTime: new Date().toISOString(),
        status: 'published',
        // 多媒体资源
        resources: {
          videos: [],      // 视频文件列表
          pdfs: [],        // PDF文件列表
          ppts: [],        // PPT文件列表
          excels: [],      // Excel文件列表
          words: []        // Word文件列表
        }
      }
    ]
  }),
  
  getters: {
    // 获取所有一级分类
    getAllCategories: (state) => {
      return state.categories.sort((a, b) => a.order - b.order)
    },
    
    // 获取指定一级分类的二级分类
    getSubcategoriesByCategory: (state) => (categoryId) => {
      return state.subcategories
        .filter(sub => sub.categoryId === categoryId)
        .sort((a, b) => a.order - b.order)
    },
    
    // 获取指定二级分类的课程
    getLessonsBySubcategory: (state) => (subcategoryId) => {
      return state.lessons.filter(lesson => lesson.subcategoryId === subcategoryId)
    },
    
    // 根据一级分类获取所有课程
    getLessonsByCategory: (state) => (categoryId) => {
      return state.lessons.filter(lesson => lesson.categoryId === categoryId)
    },
    
    // 获取课程详情
    getLessonById: (state) => (lessonId) => {
      return state.lessons.find(lesson => lesson.id === lessonId)
    }
  },
  
  actions: {
    // ===== 一级分类管理 =====
    addCategory(category) {
      const newId = Math.max(...this.categories.map(c => c.id), 0) + 1
      this.categories.push({
        id: newId,
        ...category,
        order: this.categories.length + 1
      })
      this.saveToLocalStorage()
    },
    
    updateCategory(category) {
      const index = this.categories.findIndex(c => c.id === category.id)
      if (index !== -1) {
        this.categories[index] = { ...category }
        this.saveToLocalStorage()
      }
    },
    
    deleteCategory(categoryId) {
      // 删除分类及其所有子分类和课程
      this.categories = this.categories.filter(c => c.id !== categoryId)
      this.subcategories = this.subcategories.filter(s => s.categoryId !== categoryId)
      this.lessons = this.lessons.filter(l => l.categoryId !== categoryId)
      this.saveToLocalStorage()
    },
    
    // ===== 二级分类管理 =====
    addSubcategory(subcategory) {
      const newId = Math.max(...this.subcategories.map(s => s.id), 100) + 1
      this.subcategories.push({
        id: newId,
        ...subcategory
      })
      this.saveToLocalStorage()
    },
    
    updateSubcategory(subcategory) {
      const index = this.subcategories.findIndex(s => s.id === subcategory.id)
      if (index !== -1) {
        this.subcategories[index] = { ...subcategory }
        this.saveToLocalStorage()
      }
    },
    
    deleteSubcategory(subcategoryId) {
      // 删除二级分类及其所有课程
      this.subcategories = this.subcategories.filter(s => s.id !== subcategoryId)
      this.lessons = this.lessons.filter(l => l.subcategoryId !== subcategoryId)
      this.saveToLocalStorage()
    },
    
    // ===== 课程管理 =====
    addLesson(lesson) {
      const newId = Math.max(...this.lessons.map(l => l.id), 1000) + 1
      this.lessons.push({
        id: newId,
        ...lesson,
        views: 0,
        likes: 0,
        createTime: new Date().toISOString(),
        status: 'published',
        resources: {
          videos: [],
          pdfs: [],
          ppts: [],
          excels: [],
          words: []
        }
      })
      this.saveToLocalStorage()
    },
    
    updateLesson(lesson) {
      const index = this.lessons.findIndex(l => l.id === lesson.id)
      if (index !== -1) {
        this.lessons[index] = { ...lesson }
        this.saveToLocalStorage()
      }
    },
    
    deleteLesson(lessonId) {
      this.lessons = this.lessons.filter(l => l.id !== lessonId)
      this.saveToLocalStorage()
    },
    
    // 增加课程浏览量
    incrementViews(lessonId) {
      const lesson = this.lessons.find(l => l.id === lessonId)
      if (lesson) {
        lesson.views++
        this.saveToLocalStorage()
      }
    },
    
    // 增加课程点赞
    incrementLikes(lessonId) {
      const lesson = this.lessons.find(l => l.id === lessonId)
      if (lesson) {
        lesson.likes++
        this.saveToLocalStorage()
      }
    },
    
    // ===== 多媒体资源管理 =====
    
    // 添加视频资源
    addVideoResource(lessonId, videoFile) {
      const lesson = this.lessons.find(l => l.id === lessonId)
      if (lesson) {
        if (!lesson.resources) {
          lesson.resources = { videos: [], pdfs: [], ppts: [], excels: [], words: [] }
        }
        const video = {
          id: Date.now(),
          name: videoFile.name,
          size: videoFile.size,
          type: videoFile.type,
          url: videoFile.url || '',
          uploadTime: new Date().toISOString(),
          duration: videoFile.duration || '未知'
        }
        lesson.resources.videos.push(video)
        this.saveToLocalStorage()
        return video
      }
      return null
    },
    
    // 删除视频资源
    deleteVideoResource(lessonId, videoId) {
      const lesson = this.lessons.find(l => l.id === lessonId)
      if (lesson && lesson.resources) {
        lesson.resources.videos = lesson.resources.videos.filter(v => v.id !== videoId)
        this.saveToLocalStorage()
      }
    },
    
    // 添加PDF资源
    addPdfResource(lessonId, pdfFile) {
      const lesson = this.lessons.find(l => l.id === lessonId)
      if (lesson) {
        if (!lesson.resources) {
          lesson.resources = { videos: [], pdfs: [], ppts: [], excels: [], words: [] }
        }
        const pdf = {
          id: Date.now(),
          name: pdfFile.name,
          size: pdfFile.size,
          type: pdfFile.type,
          url: pdfFile.url || '',
          uploadTime: new Date().toISOString(),
          pages: pdfFile.pages || 0
        }
        lesson.resources.pdfs.push(pdf)
        this.saveToLocalStorage()
        return pdf
      }
      return null
    },
    
    // 删除PDF资源
    deletePdfResource(lessonId, pdfId) {
      const lesson = this.lessons.find(l => l.id === lessonId)
      if (lesson && lesson.resources) {
        lesson.resources.pdfs = lesson.resources.pdfs.filter(p => p.id !== pdfId)
        this.saveToLocalStorage()
      }
    },
    
    // 添加PPT资源
    addPptResource(lessonId, pptFile) {
      const lesson = this.lessons.find(l => l.id === lessonId)
      if (lesson) {
        if (!lesson.resources) {
          lesson.resources = { videos: [], pdfs: [], ppts: [], excels: [], words: [] }
        }
        const ppt = {
          id: Date.now(),
          name: pptFile.name,
          size: pptFile.size,
          type: pptFile.type,
          url: pptFile.url || '',
          uploadTime: new Date().toISOString(),
          slides: pptFile.slides || 0
        }
        lesson.resources.ppts.push(ppt)
        this.saveToLocalStorage()
        return ppt
      }
      return null
    },
    
    // 删除PPT资源
    deletePptResource(lessonId, pptId) {
      const lesson = this.lessons.find(l => l.id === lessonId)
      if (lesson && lesson.resources) {
        lesson.resources.ppts = lesson.resources.ppts.filter(p => p.id !== pptId)
        this.saveToLocalStorage()
      }
    },
    
    // 添加Excel资源
    addExcelResource(lessonId, excelFile) {
      const lesson = this.lessons.find(l => l.id === lessonId)
      if (lesson) {
        if (!lesson.resources) {
          lesson.resources = { videos: [], pdfs: [], ppts: [], excels: [], words: [] }
        }
        const excel = {
          id: Date.now(),
          name: excelFile.name,
          size: excelFile.size,
          type: excelFile.type,
          url: excelFile.url || '',
          uploadTime: new Date().toISOString(),
          sheets: excelFile.sheets || 0
        }
        lesson.resources.excels.push(excel)
        this.saveToLocalStorage()
        return excel
      }
      return null
    },
    
    // 删除Excel资源
    deleteExcelResource(lessonId, excelId) {
      const lesson = this.lessons.find(l => l.id === lessonId)
      if (lesson && lesson.resources) {
        lesson.resources.excels = lesson.resources.excels.filter(e => e.id !== excelId)
        this.saveToLocalStorage()
      }
    },
    
    // 添加Word资源
    addWordResource(lessonId, wordFile) {
      const lesson = this.lessons.find(l => l.id === lessonId)
      if (lesson) {
        if (!lesson.resources) {
          lesson.resources = { videos: [], pdfs: [], ppts: [], excels: [], words: [] }
        }
        const word = {
          id: Date.now(),
          name: wordFile.name,
          size: wordFile.size,
          type: wordFile.type,
          url: wordFile.url || '',
          uploadTime: new Date().toISOString(),
          pages: wordFile.pages || 0
        }
        lesson.resources.words.push(word)
        this.saveToLocalStorage()
        return word
      }
      return null
    },
    
    // 删除Word资源
    deleteWordResource(lessonId, wordId) {
      const lesson = this.lessons.find(l => l.id === lessonId)
      if (lesson && lesson.resources) {
        lesson.resources.words = lesson.resources.words.filter(w => w.id !== wordId)
        this.saveToLocalStorage()
      }
    },
    
    // 获取课程的所有资源
    getLessonResources(lessonId) {
      const lesson = this.lessons.find(l => l.id === lessonId)
      return lesson?.resources || { videos: [], pdfs: [], ppts: [], excels: [], words: [] }
    },
    
    // 获取资源统计
    getResourceStats(lessonId) {
      const resources = this.getLessonResources(lessonId)
      return {
        totalVideos: resources.videos.length,
        totalPdfs: resources.pdfs.length,
        totalPpts: resources.ppts.length,
        totalExcels: resources.excels.length,
        totalWords: resources.words.length,
        totalFiles: resources.videos.length + resources.pdfs.length + 
                   resources.ppts.length + resources.excels.length + resources.words.length
      }
    },
    
    // ===== 数据持久化 =====
    saveToLocalStorage() {
      localStorage.setItem('classroom_categories', JSON.stringify(this.categories))
      localStorage.setItem('classroom_subcategories', JSON.stringify(this.subcategories))
      localStorage.setItem('classroom_lessons', JSON.stringify(this.lessons))
    },
    
    loadFromLocalStorage() {
      const categories = localStorage.getItem('classroom_categories')
      const subcategories = localStorage.getItem('classroom_subcategories')
      const lessons = localStorage.getItem('classroom_lessons')
      
      if (categories) this.categories = JSON.parse(categories)
      if (subcategories) this.subcategories = JSON.parse(subcategories)
      if (lessons) this.lessons = JSON.parse(lessons)
    }
  }
})
