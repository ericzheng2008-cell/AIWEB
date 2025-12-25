/**
 * P2-2: 数据底座建设
 * 功能: 项目快照、历史数据库、指标计算
 */

// ========== 项目快照系统 ==========
export class ProjectSnapshot {
  constructor() {
    this.snapshots = new Map()
  }

  /**
   * 创建项目快照
   * @param {Object} project - 项目数据
   * @param {String} snapshotType - 快照类型: daily/weekly/monthly/milestone
   */
  createSnapshot(project, snapshotType = 'daily') {
    const snapshotId = `snap-${project.id}-${Date.now()}`
    const snapshotDate = new Date().toISOString().split('T')[0]

    const snapshot = {
      snapshotId,
      projectId: project.id,
      snapshotDate,
      snapshotType,
      data: {
        progress: project.progress,
        budget: project.budget,
        spent: project.spent,
        teamSize: project.teamSize,
        riskLevel: this.calculateRiskLevel(project),
        wbsSnapshot: JSON.parse(JSON.stringify(project.wbs || [])),
        milestonesSnapshot: JSON.parse(JSON.stringify(project.milestones || []))
      },
      deviations: this.calculateDeviations(project)
    }

    this.snapshots.set(snapshotId, snapshot)
    this.saveToStorage(snapshot)
    
    return snapshot
  }

  /**
   * 计算偏差
   */
  calculateDeviations(project) {
    const today = new Date()
    const start = new Date(project.startDate)
    const end = new Date(project.endDate)
    
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    const elapsedDays = Math.ceil((today - start) / (1000 * 60 * 60 * 24))
    
    const expectedProgress = (elapsedDays / totalDays) * 100
    const progressDeviation = project.progress - expectedProgress

    const expectedSpent = (elapsedDays / totalDays) * project.budget
    const costDeviation = ((project.spent - expectedSpent) / expectedSpent) * 100

    return {
      progressDeviation: Math.round(progressDeviation),
      costDeviation: Math.round(costDeviation),
      scheduleDeviation: Math.round(progressDeviation / 10) // 简化计算
    }
  }

  /**
   * 计算风险等级
   */
  calculateRiskLevel(project) {
    const deviations = this.calculateDeviations(project)
    
    if (deviations.progressDeviation < -15 || deviations.costDeviation > 20) {
      return '高'
    } else if (deviations.progressDeviation < -5 || deviations.costDeviation > 10) {
      return '中'
    }
    return '低'
  }

  /**
   * 保存到本地存储
   */
  saveToStorage(snapshot) {
    const key = `project_snapshot_${snapshot.snapshotId}`
    localStorage.setItem(key, JSON.stringify(snapshot))
  }

  /**
   * 查询快照
   * @param {Number} projectId - 项目ID
   * @param {String} startDate - 开始日期
   * @param {String} endDate - 结束日期
   */
  querySnapshots(projectId, startDate, endDate) {
    const results = []
    
    // 从localStorage获取所有快照
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key.startsWith('project_snapshot_')) {
        const snapshot = JSON.parse(localStorage.getItem(key))
        
        if (snapshot.projectId === projectId) {
          const snapshotDate = new Date(snapshot.snapshotDate)
          const start = new Date(startDate)
          const end = new Date(endDate)
          
          if (snapshotDate >= start && snapshotDate <= end) {
            results.push(snapshot)
          }
        }
      }
    }
    
    return results.sort((a, b) => 
      new Date(a.snapshotDate) - new Date(b.snapshotDate)
    )
  }

  /**
   * 自动快照生成器(定时任务)
   */
  setupAutoSnapshot(projects, schedule = 'daily') {
    const scheduleMap = {
      daily: 24 * 60 * 60 * 1000,      // 每天
      weekly: 7 * 24 * 60 * 60 * 1000,  // 每周
      monthly: 30 * 24 * 60 * 60 * 1000 // 每月
    }

    const interval = scheduleMap[schedule] || scheduleMap.daily

    return setInterval(() => {
      projects.forEach(project => {
        this.createSnapshot(project, schedule)
        console.log(`自动快照已生成: ${project.name} [${schedule}]`)
      })
    }, interval)
  }
}

// ========== 数据治理规则 ==========
export const DataGovernance = {
  retentionPolicy: {
    daily: 30,      // 保留30天
    weekly: 180,    // 保留6个月
    monthly: 730,   // 保留2年
    milestone: -1   // 永久保留
  },

  aggregationRules: {
    weeklyRollup: true,
    monthlyRollup: true,
    quarterlyRollup: true
  },

  /**
   * 清理过期快照
   */
  cleanupExpiredSnapshots() {
    const now = new Date()
    
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i)
      if (key.startsWith('project_snapshot_')) {
        const snapshot = JSON.parse(localStorage.getItem(key))
        const snapshotDate = new Date(snapshot.snapshotDate)
        const retentionDays = this.retentionPolicy[snapshot.snapshotType]
        
        if (retentionDays > 0) {
          const expiryDate = new Date(snapshotDate)
          expiryDate.setDate(expiryDate.getDate() + retentionDays)
          
          if (now > expiryDate) {
            localStorage.removeItem(key)
            console.log(`已清理过期快照: ${snapshot.snapshotId}`)
          }
        }
      }
    }
  }
}

// ========== 数据指标库 ==========
export const MetricsLibrary = {
  /**
   * 进度绩效指数 (Schedule Performance Index)
   * SPI > 1: 进度提前
   * SPI = 1: 进度正常
   * SPI < 1: 进度延误
   */
  SPI: (EV, PV) => {
    return PV > 0 ? EV / PV : 0
  },

  /**
   * 进度偏差 (Schedule Variance)
   * SV > 0: 进度提前
   * SV = 0: 进度正常
   * SV < 0: 进度延误
   */
  SV: (EV, PV) => {
    return EV - PV
  },

  /**
   * 成本绩效指数 (Cost Performance Index)
   * CPI > 1: 成本节约
   * CPI = 1: 成本正常
   * CPI < 1: 成本超支
   */
  CPI: (EV, AC) => {
    return AC > 0 ? EV / AC : 0
  },

  /**
   * 成本偏差 (Cost Variance)
   * CV > 0: 成本节约
   * CV = 0: 成本正常
   * CV < 0: 成本超支
   */
  CV: (EV, AC) => {
    return EV - AC
  },

  /**
   * 挣值 (Earned Value)
   */
  EV: (budget, progress) => {
    return budget * (progress / 100)
  },

  /**
   * 计划值 (Planned Value)
   */
  PV: (budget, plannedProgress) => {
    return budget * (plannedProgress / 100)
  },

  /**
   * 实际成本 (Actual Cost)
   */
  AC: (spent) => {
    return spent
  },

  /**
   * 计算完整绩效指标
   */
  calculatePerformance(project) {
    const today = new Date()
    const start = new Date(project.startDate)
    const end = new Date(project.endDate)
    
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
    const elapsedDays = Math.ceil((today - start) / (1000 * 60 * 60 * 24))
    const plannedProgress = (elapsedDays / totalDays) * 100

    const EV = this.EV(project.budget, project.progress)
    const PV = this.PV(project.budget, plannedProgress)
    const AC = this.AC(project.spent)

    const SPI = this.SPI(EV, PV)
    const SV = this.SV(EV, PV)
    const CPI = this.CPI(EV, AC)
    const CV = this.CV(EV, AC)

    return {
      EV: Math.round(EV),
      PV: Math.round(PV),
      AC: Math.round(AC),
      SPI: SPI.toFixed(2),
      SV: Math.round(SV),
      CPI: CPI.toFixed(2),
      CV: Math.round(CV),
      interpretation: {
        schedule: SPI >= 1 ? '进度正常' : '进度延误',
        cost: CPI >= 1 ? '成本正常' : '成本超支',
        overall: SPI >= 0.95 && CPI >= 0.95 ? '项目健康' : '需要关注'
      }
    }
  }
}

// ========== 历史数据分析 ==========
export class HistoricalDataAnalyzer {
  constructor() {
    this.snapshotManager = new ProjectSnapshot()
  }

  /**
   * 趋势分析
   * @param {Number} projectId - 项目ID
   * @param {Number} days - 分析天数
   */
  analyzeTrend(projectId, days = 30) {
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const snapshots = this.snapshotManager.querySnapshots(
      projectId,
      startDate.toISOString().split('T')[0],
      endDate.toISOString().split('T')[0]
    )

    if (snapshots.length < 2) {
      return null
    }

    const progressTrend = this.calculateLinearTrend(
      snapshots.map(s => s.data.progress)
    )

    const costTrend = this.calculateLinearTrend(
      snapshots.map(s => s.data.spent)
    )

    return {
      progressTrend: progressTrend > 0 ? '上升' : progressTrend < 0 ? '下降' : '稳定',
      costTrend: costTrend > 0 ? '上升' : costTrend < 0 ? '下降' : '稳定',
      avgProgressChange: (progressTrend * days).toFixed(1),
      avgCostChange: Math.round(costTrend * days),
      dataPoints: snapshots.length
    }
  }

  /**
   * 线性趋势计算
   */
  calculateLinearTrend(values) {
    const n = values.length
    if (n < 2) return 0

    const xSum = (n * (n - 1)) / 2
    const ySum = values.reduce((sum, val) => sum + val, 0)
    const xySum = values.reduce((sum, val, idx) => sum + val * idx, 0)
    const xxSum = (n * (n - 1) * (2 * n - 1)) / 6

    const slope = (n * xySum - xSum * ySum) / (n * xxSum - xSum * xSum)
    return slope
  }

  /**
   * 对比分析
   */
  compareSnapshots(snapshot1, snapshot2) {
    return {
      progressChange: snapshot2.data.progress - snapshot1.data.progress,
      spentChange: snapshot2.data.spent - snapshot1.data.spent,
      teamSizeChange: snapshot2.data.teamSize - snapshot1.data.teamSize,
      riskChange: snapshot2.data.riskLevel !== snapshot1.data.riskLevel
        ? `从${snapshot1.data.riskLevel}变为${snapshot2.data.riskLevel}`
        : '无变化'
    }
  }
}

// ========== 导出 ==========
export default {
  ProjectSnapshot,
  DataGovernance,
  MetricsLibrary,
  HistoricalDataAnalyzer
}
