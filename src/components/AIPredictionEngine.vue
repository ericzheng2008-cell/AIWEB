<template>
  <div class="ai-prediction-engine">
    <el-card class="header-card">
      <template #header>
        <div class="card-header">
          <el-icon><TrendCharts /></el-icon>
          <span>AI智能预测引擎</span>
          <el-tag :type="overallRiskType" size="small">
            {{ overallRiskLevel }}
          </el-tag>
        </div>
      </template>
      
      <el-row :gutter="20">
        <el-col :span="8">
          <el-statistic title="综合风险评分" :value="overallRiskScore">
            <template #suffix>/100</template>
          </el-statistic>
        </el-col>
        <el-col :span="8">
          <el-statistic title="预测置信度" :value="confidence">
            <template #suffix>%</template>
          </el-statistic>
        </el-col>
        <el-col :span="8">
          <el-statistic title="监控项目数" :value="projects.length" />
        </el-col>
      </el-row>
    </el-card>

    <!-- 延误风险预测 -->
    <el-card class="prediction-card">
      <template #header>
        <div class="card-header">
          <el-icon><Clock /></el-icon>
          <span>延误风险预测</span>
          <el-tooltip content="基于进度偏差、资源充足度、依赖风险综合评估">
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </template>

      <el-table :data="delayRisks" stripe>
        <el-table-column prop="projectName" label="项目名称" width="200" />
        <el-table-column label="风险等级" width="120">
          <template #default="{ row }">
            <el-tag :type="getRiskTagType(row.severity)">
              {{ row.severity }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="风险评分" width="150">
          <template #default="{ row }">
            <el-progress 
              :percentage="row.riskScore" 
              :color="getRiskColor(row.riskScore)"
              :format="() => `${row.riskScore}分`"
            />
          </template>
        </el-table-column>
        <el-table-column prop="predictedDelay" label="预计延误" width="120">
          <template #default="{ row }">
            <span :class="row.predictedDelay > 0 ? 'text-danger' : 'text-success'">
              {{ row.predictedDelay > 0 ? `+${row.predictedDelay}天` : '无延误' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="confidence" label="置信度" width="100">
          <template #default="{ row }">
            {{ row.confidence }}%
          </template>
        </el-table-column>
        <el-table-column label="AI建议" min-width="300">
          <template #default="{ row }">
            <div class="ai-suggestion">
              <el-icon><Finished /></el-icon>
              <span>{{ row.suggestion }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 成本超支预警 -->
    <el-card class="prediction-card">
      <template #header>
        <div class="card-header">
          <el-icon><Money /></el-icon>
          <span>成本超支预警</span>
          <el-tooltip content="基于燃烧率预测项目最终成本">
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </template>

      <el-table :data="costOverruns" stripe>
        <el-table-column prop="projectName" label="项目名称" width="200" />
        <el-table-column label="预算状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getCostTagType(row.severity)">
              {{ row.severity }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="预计总支出" width="150">
          <template #default="{ row }">
            {{ formatCurrency(row.projectedTotal) }}
          </template>
        </el-table-column>
        <el-table-column label="超支金额" width="150">
          <template #default="{ row }">
            <span :class="row.overrunAmount > 0 ? 'text-danger' : 'text-success'">
              {{ row.overrunAmount > 0 ? `+${formatCurrency(row.overrunAmount)}` : '无超支' }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="超支比例" width="120">
          <template #default="{ row }">
            <el-progress 
              :percentage="Math.min(row.overrunPercent, 100)" 
              :color="getCostColor(row.overrunPercent)"
              :format="() => `${row.overrunPercent.toFixed(1)}%`"
            />
          </template>
        </el-table-column>
        <el-table-column label="AI建议" min-width="300">
          <template #default="{ row }">
            <div class="ai-suggestion">
              <el-icon><Finished /></el-icon>
              <span>{{ row.suggestion }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 资源冲突检测 -->
    <el-card class="prediction-card">
      <template #header>
        <div class="card-header">
          <el-icon><UserFilled /></el-icon>
          <span>资源冲突检测</span>
          <el-tooltip content="检测同一资源在同一时间段的分配冲突">
            <el-icon><QuestionFilled /></el-icon>
          </el-tooltip>
        </div>
      </template>

      <el-table :data="resourceConflicts" stripe>
        <el-table-column prop="resourceName" label="资源名称" width="150" />
        <el-table-column label="冲突等级" width="120">
          <template #default="{ row }">
            <el-tag :type="getConflictTagType(row.severity)">
              {{ row.severity }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="分配总和" width="150">
          <template #default="{ row }">
            <el-progress 
              :percentage="Math.min(row.totalAllocation, 200)" 
              :color="getAllocationColor(row.totalAllocation)"
              :format="() => `${row.totalAllocation}%`"
            />
          </template>
        </el-table-column>
        <el-table-column label="冲突项目" min-width="250">
          <template #default="{ row }">
            <el-tag 
              v-for="project in row.conflictProjects" 
              :key="project" 
              size="small" 
              style="margin: 2px;"
            >
              {{ project }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="AI建议" min-width="300">
          <template #default="{ row }">
            <div class="ai-suggestion">
              <el-icon><Finished /></el-icon>
              <span>{{ row.suggestion }}</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 预测模型信息 -->
    <el-card class="model-info-card">
      <template #header>
        <div class="card-header">
          <el-icon><DataAnalysis /></el-icon>
          <span>预测模型信息</span>
        </div>
      </template>
      
      <el-descriptions :column="3" border>
        <el-descriptions-item label="模型版本">{{ modelInfo.version }}</el-descriptions-item>
        <el-descriptions-item label="训练日期">{{ modelInfo.trainDate }}</el-descriptions-item>
        <el-descriptions-item label="样本数量">{{ modelInfo.sampleCount }}</el-descriptions-item>
        <el-descriptions-item label="模型类型" :span="2">{{ modelInfo.modelType }}</el-descriptions-item>
        <el-descriptions-item label="平均准确率">
          <el-tag type="success">{{ modelInfo.accuracy }}%</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="最后更新" :span="3">{{ modelInfo.lastUpdate }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
  TrendCharts, Clock, Money, UserFilled, QuestionFilled, 
  Finished, DataAnalysis 
} from '@element-plus/icons-vue'

// ========== 数据定义 ==========
const projects = ref([
  {
    id: 1,
    name: '明升AICRM V4.0',
    progress: 65,
    budget: 1500000,
    spent: 1020000,
    startDate: '2024-11-01',
    endDate: '2025-01-31',
    teamSize: 10,
    resources: [
      { name: '张三', allocation: 80 },
      { name: '李四', allocation: 100 },
      { name: '王五', allocation: 60 }
    ]
  },
  {
    id: 2,
    name: '智能算账系统',
    progress: 85,
    budget: 800000,
    spent: 680000,
    startDate: '2024-10-15',
    endDate: '2025-01-15',
    teamSize: 6,
    resources: [
      { name: '张三', allocation: 20 },
      { name: '赵六', allocation: 100 }
    ]
  },
  {
    id: 3,
    name: '投标预测AI',
    progress: 70,
    budget: 1000000,
    spent: 850000,
    startDate: '2024-11-15',
    endDate: '2025-02-15',
    teamSize: 8,
    resources: [
      { name: '李四', allocation: 80 },
      { name: '孙七', allocation: 100 }
    ]
  }
])

const modelInfo = ref({
  version: 'v2.3.1',
  trainDate: '2025-12-01',
  sampleCount: 5000,
  modelType: 'XGBoost集成模型',
  accuracy: 87,
  lastUpdate: '2025-12-20 10:30:00'
})

// ========== 预测算法 ==========
// 1. 延误风险预测
const predictDelayRisk = (project) => {
  const today = new Date()
  const start = new Date(project.startDate)
  const end = new Date(project.endDate)
  
  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  const elapsedDays = Math.ceil((today - start) / (1000 * 60 * 60 * 24))
  const remainingDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24))
  
  // 计算进度偏差 (期望进度 vs 实际进度)
  const expectedProgress = (elapsedDays / totalDays) * 100
  const progressDeviation = Math.max(0, expectedProgress - project.progress)
  
  // 计算资源充足度 (团队规模评分)
  const resourceAdequacy = project.teamSize >= 8 ? 0 : (8 - project.teamSize) * 10
  
  // 计算依赖风险 (简化版,实际应基于任务依赖关系)
  const dependencyRisk = project.progress < 50 ? 20 : 10
  
  // 综合风险评分
  const riskScore = Math.min(100, Math.round(
    progressDeviation * 0.5 +
    resourceAdequacy * 0.3 +
    dependencyRisk * 0.2
  ))
  
  // 预测延误天数
  const velocity = elapsedDays > 0 ? project.progress / elapsedDays : 0
  const predictedDelay = velocity > 0
    ? Math.ceil((100 - project.progress) / velocity - remainingDays)
    : remainingDays
  
  const severity = riskScore > 70 ? '高' : riskScore > 40 ? '中' : '低'
  
  // AI建议
  let suggestion = ''
  if (severity === '高') {
    suggestion = `建议增加${Math.ceil(resourceAdequacy / 10)}名开发人员,可缩短工期${Math.ceil(predictedDelay * 0.6)}天`
  } else if (severity === '中') {
    suggestion = '建议优化关键路径任务,压缩非关键任务时间'
  } else {
    suggestion = '项目进展顺利,保持当前节奏'
  }
  
  return {
    projectName: project.name,
    riskScore,
    predictedDelay: Math.max(0, predictedDelay),
    severity,
    confidence: 85,
    suggestion
  }
}

// 2. 成本超支预警
const predictCostOverrun = (project) => {
  const today = new Date()
  const start = new Date(project.startDate)
  const end = new Date(project.endDate)
  
  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  const elapsedDays = Math.ceil((today - start) / (1000 * 60 * 60 * 24))
  const remainingDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24))
  
  // 燃烧率
  const burnRate = elapsedDays > 0 ? project.spent / elapsedDays : 0
  
  // 预计总支出
  const projectedTotal = project.spent + (burnRate * remainingDays)
  
  // 超支金额和比例
  const overrunAmount = Math.max(0, projectedTotal - project.budget)
  const overrunPercent = (overrunAmount / project.budget) * 100
  
  const severity = overrunPercent > 20 ? '高' : overrunPercent > 10 ? '中' : '低'
  
  // AI建议
  let suggestion = ''
  if (severity === '高') {
    suggestion = `压缩非关键任务资源,优先保障核心功能,预计可节省${formatCurrency(overrunAmount * 0.4)}`
  } else if (severity === '中') {
    suggestion = '优化资源分配,避免不必要开支'
  } else {
    suggestion = '成本控制良好,继续保持'
  }
  
  return {
    projectName: project.name,
    projectedTotal,
    overrunAmount,
    overrunPercent,
    severity,
    suggestion
  }
}

// 3. 资源冲突检测
const detectResourceConflicts = () => {
  const resourceMap = new Map()
  
  projects.value.forEach(project => {
    project.resources.forEach(resource => {
      if (!resourceMap.has(resource.name)) {
        resourceMap.set(resource.name, {
          resourceName: resource.name,
          totalAllocation: 0,
          conflictProjects: [],
          allocations: []
        })
      }
      
      const resData = resourceMap.get(resource.name)
      resData.totalAllocation += resource.allocation
      resData.conflictProjects.push(project.name)
      resData.allocations.push({
        project: project.name,
        allocation: resource.allocation
      })
    })
  })
  
  const conflicts = []
  resourceMap.forEach((data, name) => {
    if (data.totalAllocation > 100) {
      const severity = data.totalAllocation > 150 ? '高' : data.totalAllocation > 120 ? '中' : '低'
      
      let suggestion = ''
      if (severity === '高') {
        suggestion = `严重冲突!建议将部分工作委托给其他团队成员或延后低优先级项目`
      } else if (severity === '中') {
        suggestion = `建议调整工作优先级或增加资源支持`
      } else {
        suggestion = `轻微冲突,建议优化时间分配`
      }
      
      conflicts.push({
        ...data,
        severity,
        suggestion
      })
    }
  })
  
  return conflicts
}

// ========== 计算属性 ==========
const delayRisks = computed(() => {
  return projects.value.map(predictDelayRisk)
})

const costOverruns = computed(() => {
  return projects.value.map(predictCostOverrun)
})

const resourceConflicts = computed(() => {
  return detectResourceConflicts()
})

const overallRiskScore = computed(() => {
  const avgDelayRisk = delayRisks.value.reduce((sum, r) => sum + r.riskScore, 0) / delayRisks.value.length
  const avgCostRisk = costOverruns.value.reduce((sum, r) => sum + r.overrunPercent, 0) / costOverruns.value.length
  const conflictRisk = resourceConflicts.value.length > 0 ? 50 : 0
  
  return Math.round((avgDelayRisk + avgCostRisk + conflictRisk) / 3)
})

const overallRiskLevel = computed(() => {
  return overallRiskScore.value > 70 ? '高风险' : overallRiskScore.value > 40 ? '中风险' : '低风险'
})

const overallRiskType = computed(() => {
  return overallRiskScore.value > 70 ? 'danger' : overallRiskScore.value > 40 ? 'warning' : 'success'
})

const confidence = computed(() => 85)

// ========== 工具函数 ==========
const formatCurrency = (value) => {
  return (value / 10000).toFixed(1) + '万'
}

const getRiskTagType = (severity) => {
  return severity === '高' ? 'danger' : severity === '中' ? 'warning' : 'success'
}

const getCostTagType = (severity) => {
  return severity === '高' ? 'danger' : severity === '中' ? 'warning' : 'success'
}

const getConflictTagType = (severity) => {
  return severity === '高' ? 'danger' : severity === '中' ? 'warning' : 'info'
}

const getRiskColor = (score) => {
  if (score > 70) return '#f56c6c'
  if (score > 40) return '#e6a23c'
  return '#67c23a'
}

const getCostColor = (percent) => {
  if (percent > 20) return '#f56c6c'
  if (percent > 10) return '#e6a23c'
  return '#67c23a'
}

const getAllocationColor = (allocation) => {
  if (allocation > 150) return '#f56c6c'
  if (allocation > 100) return '#e6a23c'
  return '#67c23a'
}

onMounted(() => {
  console.log('AI智能预测引擎已加载')
})
</script>

<style scoped lang="scss">
.ai-prediction-engine {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;

  .header-card,
  .prediction-card,
  .model-info-card {
    margin-bottom: 20px;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;

    .el-icon {
      font-size: 20px;
      color: #409eff;
    }
  }

  .ai-suggestion {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #606266;
    
    .el-icon {
      color: #67c23a;
      flex-shrink: 0;
    }
  }

  .text-danger {
    color: #f56c6c;
    font-weight: 600;
  }

  .text-success {
    color: #67c23a;
    font-weight: 600;
  }

  :deep(.el-statistic__head) {
    font-size: 14px;
    color: #909399;
  }

  :deep(.el-statistic__number) {
    font-size: 28px;
    font-weight: 600;
    color: #303133;
  }

  :deep(.el-progress__text) {
    font-size: 12px !important;
  }
}
</style>
