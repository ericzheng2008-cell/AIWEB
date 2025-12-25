import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { initDatabase, closeDatabase } from './database/init-memory.js'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import contentRoutes from './routes/content.js'
import userRoutes from './routes/user.js'
import tighteningRoutes from './routes/tightening.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 🚀 初始化数据库
try {
  await initDatabase()
  console.log('✅ 数据库连接成功')
} catch (error) {
  console.error('❌ 数据库初始化失败:', error)
  process.exit(1)
}

const app = express()
const PORT = process.env.PORT || 3001

// 中间件
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 静态文件
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')))

// 文件上传配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    
    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error('只支持图片文件!'))
    }
  }
})

// 路由
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/content', contentRoutes)
app.use('/api/user', userRoutes)
app.use('/api/tightening', tighteningRoutes)

// 文件上传路由
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: '没有上传文件' })
  }
  
  res.json({
    success: true,
    message: '上传成功',
    data: {
      filename: req.file.filename,
      url: `/uploads/${req.file.filename}`
    }
  })
})

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: err.message || '服务器错误'
  })
})

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '接口不存在'
  })
})

const server = app.listen(PORT, () => {
  console.log(`✅ 服务器运行在 http://localhost:${PORT}`)
  console.log(`✅ 数据库路径: ${path.join(__dirname, '../data/aiweb.db')}`)
})

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n⏳ 正在关闭服务器...')
  server.close(() => {
    closeDatabase()
    console.log('✅ 服务器已安全关闭')
    process.exit(0)
  })
})

process.on('SIGTERM', () => {
  server.close(() => {
    closeDatabase()
    process.exit(0)
  })
})
