import express from 'express'
import { authMiddleware } from './auth.js'

const router = express.Router()

// 获取用户信息
router.get('/info', authMiddleware, (req, res) => {
  res.json({
    success: true,
    data: req.user
  })
})

// 更新用户信息
router.put('/info', authMiddleware, (req, res) => {
  try {
    // 这里应该更新数据库中的用户信息
    res.json({
      success: true,
      message: '更新成功',
      data: { ...req.user, ...req.body }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

export default router
