/**
 * 数据库初始化脚本
 * 运行：node server/scripts/initDatabase.js
 */

import { initDatabase } from '../database/init.js'

console.log('🚀 开始初始化数据库...\n')

try {
  await initDatabase()
  console.log('\n✅ 数据库初始化成功！')
  console.log('\n📝 默认管理员账户：')
  console.log('   用户名：admin')
  console.log('   密码：admin123')
  console.log('\n⚠️  请在生产环境中修改默认密码！\n')
  process.exit(0)
} catch (error) {
  console.error('\n❌ 数据库初始化失败：', error)
  process.exit(1)
}

