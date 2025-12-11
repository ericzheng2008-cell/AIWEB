import express from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const router = express.Router()
const JWT_SECRET = 'your-secret-key-change-in-production'

// 模拟数据库
const users = [
  {
    id: 1,
    username: 'admin',
    password: bcrypt.hashSync('admin123', 10),
    email: 'admin@example.com',
    role: 'admin'
  },
  {
    id: 2,
    username: 'user',
    password: bcrypt.hashSync('user123', 10),
    email: 'user@example.com',
    role: 'user'
  }
]

// 登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    // 查找用户
    const user = users.find(u => 
      u.username === username || u.email === username
    )

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误'
      })
    }

    // 验证密码
    const isValidPassword = bcrypt.compareSync(password, user.password)
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

    res.json({
      success: true,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

// 注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, phone, password } = req.body

    // 检查用户是否存在
    const existingUser = users.find(u => 
      u.username === username || u.email === email
    )

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '用户名或邮箱已存在'
      })
    }

    // 创建新用户
    const newUser = {
      id: users.length + 1,
      username,
      email,
      phone,
      password: bcrypt.hashSync(password, 10),
      role: 'user'
    }

    users.push(newUser)

    res.json({
      success: true,
      message: '注册成功',
      data: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      }
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
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
