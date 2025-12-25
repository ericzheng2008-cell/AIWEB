/**
 * 产品模型
 * 提供产品CRUD操作
 */

import db from '../database/init.js'

class Product {
  /**
   * 创建产品
   */
  static create(productData) {
    const {
      name_zh,
      name_en,
      category_id,
      description_zh,
      description_en,
      image,
      price,
      stock = 0,
      status = 'active',
      sort_order = 0
    } = productData
    
    const stmt = db.prepare(`
      INSERT INTO products (
        name_zh, name_en, category_id, description_zh, description_en,
        image, price, stock, status, sort_order
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    const result = stmt.run(
      name_zh, name_en, category_id, description_zh, description_en,
      image, price, stock, status, sort_order
    )
    
    return result.lastInsertRowid
  }
  
  /**
   * 根据ID查找产品
   */
  static findById(id) {
    const stmt = db.prepare(`
      SELECT p.*, c.name_zh as category_name_zh, c.name_en as category_name_en
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `)
    
    return stmt.get(id)
  }
  
  /**
   * 获取所有产品
   */
  static findAll({ category_id, status, limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT p.*, c.name_zh as category_name_zh, c.name_en as category_name_en
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `
    const params = []
    
    if (category_id) {
      query += ' AND p.category_id = ?'
      params.push(category_id)
    }
    
    if (status) {
      query += ' AND p.status = ?'
      params.push(status)
    }
    
    query += ' ORDER BY p.sort_order ASC, p.created_at DESC LIMIT ? OFFSET ?'
    params.push(limit, offset)
    
    const stmt = db.prepare(query)
    return stmt.all(...params)
  }
  
  /**
   * 搜索产品
   */
  static search(keyword) {
    const stmt = db.prepare(`
      SELECT p.*, c.name_zh as category_name_zh
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.name_zh LIKE ? OR p.name_en LIKE ? OR p.description_zh LIKE ?
      ORDER BY p.sort_order ASC
      LIMIT 50
    `)
    
    const searchTerm = `%${keyword}%`
    return stmt.all(searchTerm, searchTerm, searchTerm)
  }
  
  /**
   * 更新产品
   */
  static update(id, productData) {
    const {
      name_zh,
      name_en,
      category_id,
      description_zh,
      description_en,
      image,
      price,
      stock,
      status,
      sort_order
    } = productData
    
    const stmt = db.prepare(`
      UPDATE products
      SET name_zh = ?, name_en = ?, category_id = ?, description_zh = ?,
          description_en = ?, image = ?, price = ?, stock = ?, status = ?,
          sort_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    
    return stmt.run(
      name_zh, name_en, category_id, description_zh, description_en,
      image, price, stock, status, sort_order, id
    )
  }
  
  /**
   * 删除产品
   */
  static delete(id) {
    const stmt = db.prepare('DELETE FROM products WHERE id = ?')
    return stmt.run(id)
  }
  
  /**
   * 批量更新排序
   */
  static updateSortOrder(sortData) {
    const updateStmt = db.prepare('UPDATE products SET sort_order = ? WHERE id = ?')
    
    const updateMany = db.transaction((items) => {
      for (const item of items) {
        updateStmt.run(item.sort_order, item.id)
      }
    })
    
    return updateMany(sortData)
  }
  
  /**
   * 获取产品统计
   */
  static getStats() {
    const stmt = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN stock <= 0 THEN 1 ELSE 0 END) as out_of_stock,
        COUNT(DISTINCT category_id) as categories
      FROM products
    `)
    
    return stmt.get()
  }
}

export default Product
