/**
 * 数据库备份脚本
 * 运行：node server/scripts/backupDatabase.js
 */

import { backupDatabase } from '../database/init.js'
import cron from 'node-cron'

console.log('🚀 启动数据库自动备份服务...\n')

// 立即执行一次备份
backupDatabase()

// 每天凌晨2点自动备份
cron.schedule('0 2 * * *', () => {
  console.log('\n⏰ 执行定时备份...')
  backupDatabase()
})

console.log('✅ 自动备份服务已启动（每天2:00AM）')
console.log('📁 备份目录：data/backups/')
console.log('\n按 Ctrl+C 停止服务\n')
