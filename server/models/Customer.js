/**
 * 客户模型 (AICRM)
 * 提供客户管理功能
 */

import db from '../database/init.js'

class Customer {
  /**
   * 创建客户
   */
  static create(customerData) {
    const {
      name,
      company,
      email,
      phone,
      industry,
      source,
      status = 'lead',
      value = 0,
      tags,
      notes
    } = customerData
    
    const stmt = db.prepare(`
      INSERT INTO customers (
        name, company, email, phone, industry, source,
        status, value, tags, notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    const result = stmt.run(
      name, company, email, phone, industry, source,
      status, value, tags, notes
    )
    
    return result.lastInsertRowid
  }
  
  /**
   * 根据ID查找客户
   */
  static findById(id) {
    const stmt = db.prepare('SELECT * FROM customers WHERE id = ?')
    return stmt.get(id)
  }
  
  /**
   * 获取所有客户
   */
  static findAll({ status, industry, limit = 50, offset = 0 } = {}) {
    let query = 'SELECT * FROM customers WHERE 1=1'
    const params = []
    
    if (status) {
      query += ' AND status = ?'
      params.push(status)
    }
    
    if (industry) {
      query += ' AND industry = ?'
      params.push(industry)
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)
    
    const stmt = db.prepare(query)
    return stmt.all(...params)
  }
  
  /**
   * 搜索客户
   */
  static search(keyword) {
    const stmt = db.prepare(`
      SELECT * FROM customers
      WHERE name LIKE ? OR company LIKE ? OR email LIKE ? OR phone LIKE ?
      ORDER BY created_at DESC
      LIMIT 50
    `)
    
    const searchTerm = `%${keyword}%`
    return stmt.all(searchTerm, searchTerm, searchTerm, searchTerm)
  }
  
  /**
   * 更新客户
   */
  static update(id, customerData) {
    const {
      name, company, email, phone, industry, source,
      status, value, tags, notes
    } = customerData
    
    const stmt = db.prepare(`
      UPDATE customers
      SET name = ?, company = ?, email = ?, phone = ?, industry = ?,
          source = ?, status = ?, value = ?, tags = ?, notes = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    
    return stmt.run(
      name, company, email, phone, industry, source,
      status, value, tags, notes, id
    )
  }
  
  /**
   * 删除客户
   */
  static delete(id) {
    const stmt = db.prepare('DELETE FROM customers WHERE id = ?')
    return stmt.run(id)
  }
  
  /**
   * 获取客户统计
   */
  static getStats() {
    const stmt = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'lead' THEN 1 ELSE 0 END) as leads,
        SUM(CASE WHEN status = 'customer' THEN 1 ELSE 0 END) as customers,
        SUM(value) as total_value,
        AVG(value) as avg_value
      FROM customers
    `)
    
    return stmt.get()
  }
  
  /**
   * 按来源统计
   */
  static getStatsBySource() {
    const stmt = db.prepare(`
      SELECT source, COUNT(*) as count
      FROM customers
      GROUP BY source
      ORDER BY count DESC
    `)
    
    return stmt.all()
  }
  
  /**
   * 按行业统计
   */
  static getStatsByIndustry() {
    const stmt = db.prepare(`
      SELECT industry, COUNT(*) as count, SUM(value) as total_value
      FROM customers
      GROUP BY industry
      ORDER BY count DESC
    `)
    
    return stmt.all()
  }
}

export default Customer
