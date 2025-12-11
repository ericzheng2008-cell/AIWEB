import express from 'express'
import { authMiddleware } from './auth.js'

const router = express.Router()

// 网站配置
let siteConfig = {
  siteName: '企业营销平台',
  logo: '/logo.png',
  description: '专业的企业级营销获客解决方案',
  keywords: '营销,获客,电商,推广'
}

// Banner数据
let banners = [
  {
    id: 1,
    title: '专业的企业营销解决方案',
    subtitle: '助力企业实现营销获客闭环',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920',
    buttonText: '了解更多',
    link: '/about',
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
