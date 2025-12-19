/**
 * 数据质量自动治理引擎
 * P2-3: Data Governance Engine
 * 
 * 功能:
 * 1. 自动数据清洗
 * 2. 重复数据合并
 * 3. 异常值检测
 * 4. 字段标准化
 * 5. 数据分级管理
 */

import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// ========== 1. 数据清洗规则引擎 ==========

export class DataCleaningEngine {
  constructor() {
    this.rules = {
      // 手机号规则
      phone: {
        pattern: /^1[3-9]\d{9}$/,
        clean: (value) => {
          const cleaned = value.replace(/[^0-9]/g, '')
          return cleaned.length === 11 ? cleaned : null
        },
        format: (value) => value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
      },

      // 邮箱规则
      email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        clean: (value) => value.trim().toLowerCase(),
        validate: (value) => /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(value)
      },

      // 身份证规则
      idCard: {
        pattern: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/,
        clean: (value) => value.trim().toUpperCase(),
        validate: (value) => {
          if (!/^\d{17}[\dXx]$/.test(value)) return false
          // 校验码验证
          const weights = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
          const checkCodes = '10X98765432'
          const sum = value.slice(0, 17).split('').reduce((acc, num, i) => 
            acc + parseInt(num) * weights[i], 0)
          return checkCodes[sum % 11] === value[17]
        }
      },

      // 公司名称规则
      companyName: {
        clean: (value) => {
          return value
            .trim()
            .replace(/\s+/g, '')
            .replace(/（/g, '(')
            .replace(/）/g, ')')
        },
        standardize: (value) => {
          const suffixes = ['有限公司', '股份有限公司', '集团', '公司']
          for (const suffix of suffixes) {
            if (value.endsWith(suffix)) {
              return { name: value.slice(0, -suffix.length), type: suffix }
            }
          }
          return { name: value, type: '' }
        }
      },

      // 地址规则
      address: {
        clean: (value) => {
          return value
            .trim()
            .replace(/\s+/g, ' ')
            .replace(/[,，]/g, '')
        },
        parse: (value) => {
          const provinceMatch = value.match(/(.*?省|.*?市|.*?自治区|.*?特别行政区)/)
          const cityMatch = value.match(/(?:省|市|自治区)(.*?(?:市|地区|州|盟))/)
          const districtMatch = value.match(/(?:市|地区|州|盟)(.*?(?:区|县|市))/)
          
          return {
            province: provinceMatch?.[1] || '',
            city: cityMatch?.[1] || '',
            district: districtMatch?.[1] || '',
            detail: value
          }
        }
      },

      // 货币金额规则
      currency: {
        clean: (value) => {
          if (typeof value === 'number') return value
          const cleaned = value.replace(/[^0-9.]/g, '')
          return parseFloat(cleaned) || 0
        },
        format: (value) => {
          return new Intl.NumberFormat('zh-CN', {
            style: 'currency',
            currency: 'CNY'
          }).format(value)
        }
      }
    }
  }

  // 自动清洗字段
  cleanField(value, fieldType) {
    const rule = this.rules[fieldType]
    if (!rule || !value) return value
    
    try {
      const cleaned = rule.clean(value)
      if (rule.validate && !rule.validate(cleaned)) {
        console.warn(`[DataCleaning] Invalid ${fieldType}:`, value)
        return null
      }
      return cleaned
    } catch (error) {
      console.error(`[DataCleaning] Error cleaning ${fieldType}:`, error)
      return value
    }
  }

  // 批量清洗数据
  batchClean(data, fieldMapping) {
    const results = {
      cleaned: [],
      errors: [],
      warnings: []
    }

    data.forEach((record, index) => {
      const cleanedRecord = { ...record }
      let hasError = false

      Object.entries(fieldMapping).forEach(([field, type]) => {
        const originalValue = record[field]
        const cleanedValue = this.cleanField(originalValue, type)
        
        if (cleanedValue === null) {
          hasError = true
          results.errors.push({
            index,
            field,
            originalValue,
            reason: `Invalid ${type} format`
          })
        } else if (cleanedValue !== originalValue) {
          cleanedRecord[field] = cleanedValue
          results.warnings.push({
            index,
            field,
            before: originalValue,
            after: cleanedValue
          })
        }
      })

      if (!hasError) {
        results.cleaned.push(cleanedRecord)
      }
    })

    return results
  }
}


// ========== 2. 重复数据检测与合并 ==========

export class DuplicateDetector {
  constructor() {
    this.similarityThreshold = 0.85
  }

  // 计算字符串相似度 (Levenshtein距离)
  levenshteinSimilarity(str1, str2) {
    const m = str1.length
    const n = str2.length
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0))

    for (let i = 0; i <= m; i++) dp[i][0] = i
    for (let j = 0; j <= n; j++) dp[0][j] = j

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1]
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1,     // 删除
            dp[i][j - 1] + 1,     // 插入
            dp[i - 1][j - 1] + 1  // 替换
          )
        }
      }
    }

    const distance = dp[m][n]
    return 1 - distance / Math.max(m, n)
  }

  // 检测重复记录
  detectDuplicates(records, keyFields) {
    const duplicateGroups = []
    const processed = new Set()

    for (let i = 0; i < records.length; i++) {
      if (processed.has(i)) continue

      const group = [i]
      const record1 = records[i]

      for (let j = i + 1; j < records.length; j++) {
        if (processed.has(j)) continue

        const record2 = records[j]
        const similarity = this.calculateSimilarity(record1, record2, keyFields)

        if (similarity >= this.similarityThreshold) {
          group.push(j)
          processed.add(j)
        }
      }

      if (group.length > 1) {
        duplicateGroups.push({
          indices: group,
          records: group.map(idx => records[idx]),
          similarity: this.calculateGroupSimilarity(group.map(idx => records[idx]), keyFields)
        })
      }
      processed.add(i)
    }

    return duplicateGroups
  }

  // 计算两条记录的相似度
  calculateSimilarity(record1, record2, keyFields) {
    let totalSimilarity = 0
    let validFields = 0

    keyFields.forEach(field => {
      const val1 = String(record1[field] || '')
      const val2 = String(record2[field] || '')
      
      if (val1 && val2) {
        totalSimilarity += this.levenshteinSimilarity(val1, val2)
        validFields++
      }
    })

    return validFields > 0 ? totalSimilarity / validFields : 0
  }

  // 计算组内平均相似度
  calculateGroupSimilarity(records, keyFields) {
    let totalSim = 0
    let count = 0

    for (let i = 0; i < records.length; i++) {
      for (let j = i + 1; j < records.length; j++) {
        totalSim += this.calculateSimilarity(records[i], records[j], keyFields)
        count++
      }
    }

    return count > 0 ? totalSim / count : 0
  }

  // 智能合并重复记录
  mergeRecords(records, strategy = 'latest') {
    const strategies = {
      // 使用最新数据
      latest: (records) => {
        return records.reduce((merged, record) => {
          const recordTime = new Date(record.updateTime || record.createTime || 0)
          const mergedTime = new Date(merged.updateTime || merged.createTime || 0)
          return recordTime > mergedTime ? record : merged
        })
      },

      // 使用最完整的数据
      mostComplete: (records) => {
        return records.reduce((merged, record) => {
          Object.keys(record).forEach(key => {
            if (!merged[key] && record[key]) {
              merged[key] = record[key]
            }
          })
          return merged
        }, {})
      },

      // 使用最高质量的数据
      bestQuality: (records) => {
        return records.reduce((merged, record) => {
          const recordScore = this.calculateQualityScore(record)
          const mergedScore = this.calculateQualityScore(merged)
          return recordScore > mergedScore ? record : merged
        })
      }
    }

    return strategies[strategy](records)
  }

  // 计算数据质量分数
  calculateQualityScore(record) {
    let score = 0
    Object.values(record).forEach(value => {
      if (value !== null && value !== undefined && value !== '') score++
    })
    return score / Object.keys(record).length
  }
}


// ========== 3. 异常值检测 ==========

export class AnomalyDetector {
  // Z-Score异常检测
  detectOutliers(values, threshold = 3) {
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length
    const stdDev = Math.sqrt(variance)

    return values.map((value, index) => {
      const zScore = Math.abs((value - mean) / stdDev)
      return {
        index,
        value,
        zScore,
        isOutlier: zScore > threshold
      }
    })
  }

  // IQR异常检测
  detectOutliersIQR(values) {
    const sorted = [...values].sort((a, b) => a - b)
    const q1Index = Math.floor(sorted.length * 0.25)
    const q3Index = Math.floor(sorted.length * 0.75)
    
    const q1 = sorted[q1Index]
    const q3 = sorted[q3Index]
    const iqr = q3 - q1
    
    const lowerBound = q1 - 1.5 * iqr
    const upperBound = q3 + 1.5 * iqr

    return values.map((value, index) => ({
      index,
      value,
      isOutlier: value < lowerBound || value > upperBound,
      bounds: { lower: lowerBound, upper: upperBound }
    }))
  }

  // 时间序列异常检测
  detectTimeSeriesAnomalies(timeSeries, windowSize = 7) {
    const anomalies = []
    
    for (let i = windowSize; i < timeSeries.length; i++) {
      const window = timeSeries.slice(i - windowSize, i).map(item => item.value)
      const mean = window.reduce((a, b) => a + b, 0) / window.length
      const stdDev = Math.sqrt(
        window.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / window.length
      )
      
      const currentValue = timeSeries[i].value
      const zScore = Math.abs((currentValue - mean) / stdDev)
      
      if (zScore > 2.5) {
        anomalies.push({
          index: i,
          timestamp: timeSeries[i].timestamp,
          value: currentValue,
          expectedRange: [mean - 2 * stdDev, mean + 2 * stdDev],
          zScore
        })
      }
    }

    return anomalies
  }
}


// ========== 4. 数据分级管理 ==========

export class DataClassificationEngine {
  constructor() {
    this.levels = {
      public: {
        label: '公开数据',
        color: '#67C23A',
        encryption: false,
        accessControl: false,
        auditLog: false
      },
      internal: {
        label: '内部数据',
        color: '#409EFF',
        encryption: false,
        accessControl: true,
        auditLog: true
      },
      confidential: {
        label: '机密数据',
        color: '#E6A23C',
        encryption: true,
        accessControl: true,
        auditLog: true
      },
      secret: {
        label: '绝密数据',
        color: '#F56C6C',
        encryption: true,
        accessControl: true,
        auditLog: true,
        approvalRequired: true
      }
    }

    // 字段分类规则
    this.fieldClassification = {
      // 公开数据
      public: ['companyName', 'industry', 'productCategory', 'publicPhone'],
      
      // 内部数据
      internal: ['customerLevel', 'salesAmount', 'purchaseHistory', 'marketingTags'],
      
      // 机密数据
      confidential: ['contactPhone', 'email', 'detailedAddress', 'bankAccount', 'taxId'],
      
      // 绝密数据
      secret: ['idCard', 'passport', 'bankPassword', 'contractTerms', 'bidPrice']
    }
  }

  // 自动分类数据
  classifyData(record) {
    const classification = {}
    
    Object.keys(record).forEach(field => {
      let level = 'internal' // 默认内部数据
      
      for (const [levelKey, fields] of Object.entries(this.fieldClassification)) {
        if (fields.includes(field)) {
          level = levelKey
          break
        }
      }
      
      classification[field] = {
        value: record[field],
        level,
        ...this.levels[level]
      }
    })

    return classification
  }

  // 数据脱敏
  maskSensitiveData(value, field) {
    const maskRules = {
      phone: (val) => val.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'),
      idCard: (val) => val.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2'),
      email: (val) => val.replace(/(.{2}).*(@.*)/, '$1****$2'),
      bankAccount: (val) => val.replace(/\d(?=\d{4})/g, '*'),
      address: (val) => val.replace(/\d+号.*/, '***')
    }

    for (const [type, maskFn] of Object.entries(maskRules)) {
      if (field.toLowerCase().includes(type)) {
        return maskFn(String(value))
      }
    }

    return value
  }

  // 获取字段访问权限
  canAccess(field, userRole) {
    const rolePermissions = {
      admin: ['public', 'internal', 'confidential', 'secret'],
      manager: ['public', 'internal', 'confidential'],
      sales: ['public', 'internal'],
      guest: ['public']
    }

    const fieldLevel = this.getFieldLevel(field)
    return rolePermissions[userRole]?.includes(fieldLevel) ?? false
  }

  getFieldLevel(field) {
    for (const [level, fields] of Object.entries(this.fieldClassification)) {
      if (fields.includes(field)) return level
    }
    return 'internal'
  }
}


// ========== 5. 数据治理状态管理 ==========

export const useDataGovernance = () => {
  const cleaningEngine = new DataCleaningEngine()
  const duplicateDetector = new DuplicateDetector()
  const anomalyDetector = new AnomalyDetector()
  const classificationEngine = new DataClassificationEngine()

  const governanceState = reactive({
    // 清洗统计
    cleaningStats: {
      totalRecords: 0,
      cleanedRecords: 0,
      errorRecords: 0,
      warningRecords: 0
    },

    // 重复检测
    duplicateStats: {
      totalGroups: 0,
      totalDuplicates: 0,
      mergedRecords: 0
    },

    // 异常检测
    anomalyStats: {
      totalChecked: 0,
      anomaliesDetected: 0,
      falsePositives: 0
    },

    // 数据分级
    classificationStats: {
      public: 0,
      internal: 0,
      confidential: 0,
      secret: 0
    },

    // 治理任务
    tasks: [],
    activeTask: null
  })

  // 执行完整数据治理流程
  const runGovernancePipeline = async (data, config) => {
    const results = {
      original: data,
      cleaned: [],
      duplicates: [],
      anomalies: [],
      classification: {},
      summary: {}
    }

    try {
      // 1. 数据清洗
      console.log('[Governance] Step 1: Data Cleaning...')
      const cleaningResult = cleaningEngine.batchClean(data, config.fieldMapping)
      results.cleaned = cleaningResult.cleaned
      governanceState.cleaningStats = {
        totalRecords: data.length,
        cleanedRecords: cleaningResult.cleaned.length,
        errorRecords: cleaningResult.errors.length,
        warningRecords: cleaningResult.warnings.length
      }

      // 2. 重复检测
      console.log('[Governance] Step 2: Duplicate Detection...')
      const duplicates = duplicateDetector.detectDuplicates(
        results.cleaned, 
        config.keyFields
      )
      results.duplicates = duplicates
      governanceState.duplicateStats = {
        totalGroups: duplicates.length,
        totalDuplicates: duplicates.reduce((sum, g) => sum + g.indices.length, 0),
        mergedRecords: 0
      }

      // 3. 异常检测
      if (config.anomalyDetection) {
        console.log('[Governance] Step 3: Anomaly Detection...')
        const numericFields = config.numericFields || []
        numericFields.forEach(field => {
          const values = results.cleaned.map(r => r[field]).filter(v => v != null)
          const outliers = anomalyDetector.detectOutliersIQR(values)
          results.anomalies.push({
            field,
            outliers: outliers.filter(o => o.isOutlier)
          })
        })
      }

      // 4. 数据分级
      console.log('[Governance] Step 4: Data Classification...')
      results.cleaned.forEach(record => {
        const classification = classificationEngine.classifyData(record)
        Object.values(classification).forEach(c => {
          governanceState.classificationStats[c.level]++
        })
      })

      results.summary = {
        cleaningRate: (results.cleaned.length / data.length * 100).toFixed(2) + '%',
        duplicateRate: (governanceState.duplicateStats.totalDuplicates / data.length * 100).toFixed(2) + '%',
        anomalyRate: results.anomalies.length > 0 
          ? (results.anomalies.reduce((sum, a) => sum + a.outliers.length, 0) / data.length * 100).toFixed(2) + '%'
          : '0%'
      }

      ElMessage.success('数据治理完成!')
      return results

    } catch (error) {
      console.error('[Governance] Pipeline error:', error)
      ElMessage.error('数据治理失败: ' + error.message)
      throw error
    }
  }

  return {
    cleaningEngine,
    duplicateDetector,
    anomalyDetector,
    classificationEngine,
    governanceState,
    runGovernancePipeline
  }
}

export default {
  DataCleaningEngine,
  DuplicateDetector,
  AnomalyDetector,
  DataClassificationEngine,
  useDataGovernance
}
