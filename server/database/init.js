/**
 * 数据库初始化脚本
 * 使用 better-sqlite3 实现数据持久化
 * 
 * 解决问题：所有数据存内存，重启即丢失
 * 技术选型：SQLite（轻量） → PostgreSQL（生产环境可升级）
 */

import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 数据库文件路径
const DB_PATH = path.join(__dirname, '../../data/aiweb.db')

// 确保数据目录存在
const dataDir = path.dirname(DB_PATH)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// 创建数据库连接
const db = new Database(DB_PATH, {
  verbose: process.env.NODE_ENV === 'development' ? console.log : null
})

// 启用外键约束
db.pragma('foreign_keys = ON')

/**
 * 初始化数据库表结构
 */
export async function initDatabase() {
  console.log('🚀 初始化数据库...')
  
  // 1. 用户表
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      email TEXT,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  // 2. 产品分类表
  db.exec(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_zh TEXT NOT NULL,
      name_en TEXT,
      parent_id INTEGER,
      level INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      icon TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE
    )
  `)
  
  // 3. 产品表
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_zh TEXT NOT NULL,
      name_en TEXT,
      category_id INTEGER,
      description_zh TEXT,
      description_en TEXT,
      image TEXT,
      price REAL,
      stock INTEGER DEFAULT 0,
      status TEXT DEFAULT 'active',
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
    )
  `)
  
  // 4. 产品图片表
  db.exec(`
    CREATE TABLE IF NOT EXISTS product_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      url TEXT NOT NULL,
      is_primary INTEGER DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `)
  
  // 5. 页面内容表（CMS）
  db.exec(`
    CREATE TABLE IF NOT EXISTS contents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL UNIQUE,
      title_zh TEXT,
      title_en TEXT,
      content_zh TEXT,
      content_en TEXT,
      type TEXT DEFAULT 'page',
      status TEXT DEFAULT 'published',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  // 6. 导航菜单表
  db.exec(`
    CREATE TABLE IF NOT EXISTS menus (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_zh TEXT NOT NULL,
      name_en TEXT,
      path TEXT,
      parent_id INTEGER,
      level INTEGER DEFAULT 1,
      icon TEXT,
      sort_order INTEGER DEFAULT 0,
      visible INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES menus(id) ON DELETE CASCADE
    )
  `)
  
  // 7. Banner表
  db.exec(`
    CREATE TABLE IF NOT EXISTS banners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title_zh TEXT,
      title_en TEXT,
      image TEXT NOT NULL,
      link TEXT,
      sort_order INTEGER DEFAULT 0,
      visible INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  // 8. 明星产品表
  db.exec(`
    CREATE TABLE IF NOT EXISTS featured_products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      title_zh TEXT,
      title_en TEXT,
      subtitle_zh TEXT,
      subtitle_en TEXT,
      image TEXT,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `)
  
  // 9. 智能体表
  db.exec(`
    CREATE TABLE IF NOT EXISTS agents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name_zh TEXT NOT NULL,
      name_en TEXT,
      description_zh TEXT,
      description_en TEXT,
      icon TEXT,
      category TEXT,
      route TEXT,
      visible INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  // 10. 知识库表
  db.exec(`
    CREATE TABLE IF NOT EXISTS knowledge_base (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT,
      category TEXT,
      tags TEXT,
      file_url TEXT,
      file_type TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  // 11. 工单表
  db.exec(`
    CREATE TABLE IF NOT EXISTS tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      status TEXT DEFAULT 'open',
      priority TEXT DEFAULT 'normal',
      assigned_to INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
    )
  `)
  
  // 12. AICRM - 客户表
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      company TEXT,
      email TEXT,
      phone TEXT,
      industry TEXT,
      source TEXT,
      status TEXT DEFAULT 'lead',
      value REAL DEFAULT 0,
      tags TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  // 13. 销售机会表
  db.exec(`
    CREATE TABLE IF NOT EXISTS opportunities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      amount REAL,
      stage TEXT DEFAULT 'prospecting',
      probability INTEGER DEFAULT 0,
      expected_close_date DATE,
      owner_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
      FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `)
  
  // 14. 投标项目表
  db.exec(`
    CREATE TABLE IF NOT EXISTS bidding_projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      customer_id INTEGER,
      budget REAL,
      deadline DATE,
      requirements TEXT,
      status TEXT DEFAULT 'preparing',
      win_probability INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE SET NULL
    )
  `)
  
  // 15. 竞争对手分析表
  db.exec(`
    CREATE TABLE IF NOT EXISTS competitors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      project_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      strengths TEXT,
      weaknesses TEXT,
      price_range TEXT,
      win_rate REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES bidding_projects(id) ON DELETE CASCADE
    )
  `)
  
  // 16. 拧紧数据表
  db.exec(`
    CREATE TABLE IF NOT EXISTS tightening_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_id TEXT,
      torque REAL,
      angle REAL,
      time INTEGER,
      result TEXT,
      curve_type TEXT,
      parameters TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  // 17. 系统配置表
  db.exec(`
    CREATE TABLE IF NOT EXISTS system_config (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL UNIQUE,
      value TEXT,
      description TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  // 创建索引
  createIndexes()
  
  // 插入默认数据
  await insertDefaultData()
  
  console.log('✅ 数据库初始化完成')
}

/**
 * 创建索引以提升查询性能
 */
function createIndexes() {
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
    CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
    CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
    CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
    CREATE INDEX IF NOT EXISTS idx_opportunities_customer ON opportunities(customer_id);
    CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
    CREATE INDEX IF NOT EXISTS idx_tightening_device ON tightening_data(device_id);
  `)
}

/**
 * 插入默认数据
 */
async function insertDefaultData() {
  // 检查是否已有数据
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get()
  
  if (userCount.count === 0) {
    console.log('📝 插入默认数据...')
    
    // 默认管理员账户（密码：admin123）
    const bcrypt = await import('bcryptjs')
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    db.prepare(`
      INSERT INTO users (username, password, email, role)
      VALUES (?, ?, ?, ?)
    `).run('admin', hashedPassword, 'admin@aiweb.com', 'admin')
    
    // 默认系统配置
    const configs = [
      { key: 'site_name_zh', value: '明升企业智能体', description: '网站中文名称' },
      { key: 'site_name_en', value: 'MingSheng AI Platform', description: '网站英文名称' },
      { key: 'logo_url', value: '/assets/logo.png', description: 'Logo图片路径' },
      { key: 'contact_email', value: 'contact@aiweb.com', description: '联系邮箱' },
      { key: 'contact_phone', value: '400-888-8888', description: '联系电话' }
    ]
    
    const insertConfig = db.prepare(`
      INSERT INTO system_config (key, value, description)
      VALUES (?, ?, ?)
    `)
    
    const insertMany = db.transaction((configs) => {
      for (const config of configs) {
        insertConfig.run(config.key, config.value, config.description)
      }
    })
    
    insertMany(configs)
    
    console.log('✅ 默认数据插入完成')
  }
}

/**
 * 数据库备份
 */
export function backupDatabase() {
  const backupPath = path.join(__dirname, `../../data/backups/aiweb_${Date.now()}.db`)
  const backupDir = path.dirname(backupPath)
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true })
  }
  
  db.backup(backupPath)
    .then(() => {
      console.log(`✅ 数据库备份成功：${backupPath}`)
    })
    .catch((err) => {
      console.error('❌ 数据库备份失败：', err)
    })
}

/**
 * 关闭数据库连接
 */
export function closeDatabase() {
  db.close()
  console.log('✅ 数据库连接已关闭')
}

// 导出数据库实例
export default db
