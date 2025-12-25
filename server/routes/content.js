import express from 'express'
import { authMiddleware } from './auth.js'

const router = express.Router()

// 网站配置
let siteConfig = {
  siteName: '明升企业智能体',
  logo: '/logo-new.png',
  description: 'AI驱动的企业智能解决方案',
  keywords: 'AI,智能体,企业智能,工作流,AICRM'
}

// Banner数据
let banners = [
  {
    id: 1,
    title: '明升企业智能体平台',
    subtitle: 'AI驱动的企业智能解决方案 · 自主学习 · 持续进化',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920',
    buttonText: '了解更多',
    link: 'about',
    active: true
  },
  {
    id: 2,
    title: '智能工具 · 智能装配 · 智能管理',
    subtitle: 'EQTCF & ETBP 系列智能工具，为您提供全方位智能解决方案',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1920',
    buttonText: '探索产品',
    link: 'products',
    active: true
  },
  {
    id: 3,
    title: 'AI工作流编排 · 智能体协作',
    subtitle: '可视化工作流设计 · 多智能体协同 · 自动化执行',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1920',
    buttonText: '查看方案',
    link: 'products',
    active: true
  },
  {
    id: 4,
    title: 'AICRM · 智能客户管理',
    subtitle: 'AI赋能的CRM系统 · 销售预测 · 商机分析 · 客户洞察',
    image: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1920',
    buttonText: '了解方案',
    link: 'solutions',
    active: true
  }
]

// 获取网站配置
router.get('/config', (req, res) => {
  res.json({
    success: true,
    data: siteConfig
  })
})

// 更新网站配置
router.put('/config', authMiddleware, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '没有权限'
      })
    }
    
    siteConfig = { ...siteConfig, ...req.body }
    
    res.json({
      success: true,
      message: '更新成功',
      data: siteConfig
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// 获取Banner列表
router.get('/banners', (req, res) => {
  res.json({
    success: true,
    data: banners.filter(b => b.active)
  })
})

// 获取所有Banner (管理端)
router.get('/banners/all', authMiddleware, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '没有权限'
      })
    }
    
    res.json({
      success: true,
      data: banners
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// 创建/更新Banner
router.post('/banners', authMiddleware, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '没有权限'
      })
    }
    
    const { id, ...bannerData } = req.body
    
    if (id) {
      // 更新
      const index = banners.findIndex(b => b.id === id)
      if (index !== -1) {
        banners[index] = { ...banners[index], ...bannerData }
        res.json({
          success: true,
          message: '更新成功',
          data: banners[index]
        })
      } else {
        res.status(404).json({
          success: false,
          message: 'Banner不存在'
        })
      }
    } else {
      // 创建
      const newBanner = {
        id: banners.length + 1,
        ...bannerData,
        active: true
      }
      banners.push(newBanner)
      res.json({
        success: true,
        message: '创建成功',
        data: newBanner
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// 删除Banner
router.delete('/banners/:id', authMiddleware, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '没有权限'
      })
    }
    
    const index = banners.findIndex(b => b.id === parseInt(req.params.id))
    
    if (index !== -1) {
      banners.splice(index, 1)
      res.json({
        success: true,
        message: '删除成功'
      })
    } else {
      res.status(404).json({
        success: false,
        message: 'Banner不存在'
      })
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

export default router
