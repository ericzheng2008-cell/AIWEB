/**
 * 用户模型
 * 提供用户CRUD操作
 */

import db from '../database/init.js'
import bcrypt from 'bcryptjs'

class User {
  /**
   * 创建新用户
   */
  static create({ username, password, email, role = 'user' }) {
    const hashedPassword = bcrypt.hashSync(password, 10)
    
    const stmt = db.prepare(`
      INSERT INTO users (username, password, email, role)
      VALUES (?, ?, ?, ?)
    `)
    
    const result = stmt.run(username, hashedPassword, email, role)
    return result.lastInsertRowid
  }
  
  /**
   * 根据用户名查找用户
   */
  static findByUsername(username) {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?')
    return stmt.get(username)
  }
  
  /**
   * 根据ID查找用户
   */
  static findById(id) {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?')
    return stmt.get(id)
  }
  
  /**
   * 获取所有用户
   */
  static findAll() {
    const stmt = db.prepare('SELECT id, username, email, role, created_at FROM users')
    return stmt.all()
  }
  
  /**
   * 更新用户信息
   */
  static update(id, { email, role }) {
    const stmt = db.prepare(`
      UPDATE users 
      SET email = ?, role = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    
    return stmt.run(email, role, id)
  }
  
  /**
   * 删除用户
   */
  static delete(id) {
    const stmt = db.prepare('DELETE FROM users WHERE id = ?')
    return stmt.run(id)
  }
  
  /**
   * 验证密码
   */
  static verifyPassword(plainPassword, hashedPassword) {
    return bcrypt.compareSync(plainPassword, hashedPassword)
  }
  
  /**
   * 修改密码
   */
  static changePassword(id, newPassword) {
    const hashedPassword = bcrypt.hashSync(newPassword, 10)
    
    const stmt = db.prepare(`
      UPDATE users 
      SET password = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    
    return stmt.run(hashedPassword, id)
  }
}

export default User
