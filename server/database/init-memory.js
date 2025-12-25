/**
 * 内存数据库 - 临时方案
 * 用于快速启动项目，无需安装 better-sqlite3
 */

import bcryptjs from 'bcryptjs'

// 内存数据存储
const memoryDB = {
  users: [],
  categories: [],
  products: [],
  customers: [],
  opportunities: [],
  tickets: [],
  systemConfig: []
}

// 自增 ID 计数器
const autoIncrement = {
  users: 1,
  categories: 1,
  products: 1,
  customers: 1,
  opportunities: 1,
  tickets: 1,
  systemConfig: 1
}

/**
 * 初始化数据库
 */
export async function initDatabase() {
  console.log('🚀 初始化内存数据库...')
  
  // 检查是否已有数据
  if (memoryDB.users.length === 0) {
    console.log('📝 插入默认数据...')
    
    // 默认管理员账户（密码：admin123）
    const hashedPassword = await bcryptjs.hash('admin123', 10)
    
    memoryDB.users.push({
      id: autoIncrement.users++,
      username: 'admin',
      password: hashedPassword,
      email: 'admin@aiweb.com',
      role: 'admin',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    
    // 默认系统配置
    const configs = [
      { key: 'site_name_zh', value: '明升企业智能体', description: '网站中文名称' },
      { key: 'site_name_en', value: 'MingSheng AI Platform', description: '网站英文名称' },
      { key: 'logo_url', value: '/assets/logo.png', description: 'Logo图片路径' },
      { key: 'contact_email', value: 'contact@aiweb.com', description: '联系邮箱' },
      { key: 'contact_phone', value: '400-888-8888', description: '联系电话' }
    ]
    
    configs.forEach(config => {
      memoryDB.systemConfig.push({
        id: autoIncrement.systemConfig++,
        ...config,
        updated_at: new Date().toISOString()
      })
    })
    
    console.log('✅ 默认数据插入完成')
  }
  
  console.log('✅ 内存数据库初始化完成')
}

/**
 * 模拟 SQLite prepare 方法
 */
class Statement {
  constructor(table, query) {
    this.table = table
    this.query = query
  }
  
  run(...params) {
    // 简单的 INSERT 实现
    if (this.query.toUpperCase().includes('INSERT')) {
      const data = {}
      // 这里需要根据实际 SQL 解析参数
      return { lastInsertRowid: autoIncrement[this.table]++ }
    }
    return {}
  }
  
  get(...params) {
    // 简单的 SELECT 实现
    if (this.query.toUpperCase().includes('SELECT COUNT')) {
      return { count: memoryDB[this.table]?.length || 0 }
    }
    return memoryDB[this.table]?.[0] || null
  }
  
  all(...params) {
    return memoryDB[this.table] || []
  }
}

/**
 * 模拟 SQLite 数据库对象
 */
const db = {
  prepare(query) {
    // 尝试从查询中提取表名
    const tableMatch = query.match(/FROM\s+(\w+)/i) || query.match(/INTO\s+(\w+)/i)
    const table = tableMatch ? tableMatch[1] : 'users'
    return new Statement(table, query)
  },
  
  exec(sql) {
    // 不做任何事情，因为表结构在内存中不需要
    return true
  },
  
  transaction(fn) {
    return (...args) => fn(...args)
  }
}

export function closeDatabase() {
  console.log('✅ 内存数据库连接已关闭')
}

export function backupDatabase() {
  console.log('⚠️  内存数据库不支持备份')
}

// 导出数据库实例和数据
export { memoryDB }
export default db
