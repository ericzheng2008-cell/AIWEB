import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// 登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    // 输入验证
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名和密码不能为空'
      })
    }

    // 查找用户（支持用户名或邮箱登录）
    const user = User.findByUsername(username)

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      })
    }

    // 验证密码
    const isValidPassword = User.verifyPassword(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      })
    }

    // 生成token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // 不返回密码
    delete user.password

    res.json({
      success: true,
      message: '登录成功',
      data: {
        token,
        user
      }
    })
  } catch (error) {
    console.error('登录错误:', error)
    res.status(500).json({
      success: false,
      message: '登录失败，请稍后重试'
    })
  }
})

// 注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body

    // 输入验证
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: '用户名和密码不能为空'
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '密码长度至少6位'
      })
    }

    // 检查用户是否存在
    const existingUser = User.findByUsername(username)
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '用户名已存在'
      })
    }

    // 创建新用户
    const userId = User.create({ username, email, password })

    res.json({
      success: true,
      message: '注册成功',
      data: {
        id: userId,
        username,
        email
      }
    })
  } catch (error) {
    console.error('注册错误:', error)
    res.status(500).json({
      success: false,
      message: '注册失败，请稍后重试'
    })
  }
})

// 验证token中间件
export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未提供认证令牌'
      })
    }

    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      message: '无效的认证令牌'
    })
  }
}

export default router
