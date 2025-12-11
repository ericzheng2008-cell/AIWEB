import express from 'express'
import { authMiddleware } from './auth.js'

const router = express.Router()

// 模拟产品数据
let products = [
  {
    id: 1,
    name: '智能营销系统Pro',
    category: '电子产品',
    price: 9999,
    originalPrice: 12999,
    stock: 100,
    rating: 4.5,
    reviewCount: 128,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'
    ],
    description: '专业的智能营销解决方案，助力企业快速增长',
    detailContent: '<h3>产品介绍</h3><p>智能营销系统Pro是一款专为企业打造的全方位营销解决方案...</p>',
    specs: {
      '品牌': '自主品牌',
      '型号': 'SMS-PRO-2024',
      '适用场景': '企业营销'
    },
    tags: ['热销', '推荐'],
    active: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: '数据分析平台',
    category: '电子产品',
    price: 8888,
    stock: 50,
    rating: 4.8,
    reviewCount: 95,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'
    ],
    description: '全方位数据分析与可视化工具',
    detailContent: '<h3>产品介绍</h3><p>专业的数据分析平台...</p>',
    specs: {
      '品牌': '自主品牌',
      '型号': 'DAP-2024'
    },
    tags: ['新品'],
    active: true,
    createdAt: new Date().toISOString()
  }
]

// 获取产品列表
router.get('/', (req, res) => {
  try {
    const { category, search, sortBy, page = 1, limit = 12 } = req.query
    
    let filtered = [...products]
    
    // 分类筛选
    if (category && category !== '0') {
      filtered = filtered.filter(p => p.category === category)
    }
    
    // 搜索
    if (search) {
      filtered = filtered.filter(p => 
        p.name.includes(search) || p.description.includes(search)
      )
    }
    
    // 排序
    if (sortBy === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
    
    // 分页
    const total = filtered.length
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + parseInt(limit)
    const paginatedProducts = filtered.slice(startIndex, endIndex)
    
    res.json({
      success: true,
      data: {
        products: paginatedProducts,
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// 获取产品详情
router.get('/:id', (req, res) => {
  try {
    const product = products.find(p => p.id === parseInt(req.params.id))
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '产品不存在'
      })
    }
    
    res.json({
      success: true,
      data: product
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// 创建产品 (需要管理员权限)
router.post('/', authMiddleware, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '没有权限'
      })
    }
    
    const newProduct = {
      id: products.length + 1,
      ...req.body,
      active: true,
      createdAt: new Date().toISOString()
    }
    
    products.push(newProduct)
    
    res.json({
      success: true,
      message: '创建成功',
      data: newProduct
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// 更新产品
router.put('/:id', authMiddleware, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '没有权限'
      })
    }
    
    const index = products.findIndex(p => p.id === parseInt(req.params.id))
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: '产品不存在'
      })
    }
    
    products[index] = {
      ...products[index],
      ...req.body,
      id: products[index].id,
      updatedAt: new Date().toISOString()
    }
    
    res.json({
      success: true,
      message: '更新成功',
      data: products[index]
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// 删除产品
router.delete('/:id', authMiddleware, (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: '没有权限'
      })
    }
    
    const index = products.findIndex(p => p.id === parseInt(req.params.id))
    
    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: '产品不存在'
      })
    }
    
    products.splice(index, 1)
    
    res.json({
      success: true,
      message: '删除成功'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

export default router
