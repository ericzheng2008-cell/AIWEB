<template>
  <div class="business-simulator">
    <el-card class="header-card">
      <template #header>
        <div class="card-header">
          <el-icon><Operation /></el-icon>
          <span>业务模拟器 - What-If分析</span>
        </div>
      </template>

      <el-alert
        title="模拟说明"
        type="info"
        :closable="false"
        style="margin-bottom: 20px;"
      >
        <template #default>
          通过调整项目参数,实时预测不同决策对项目的影响。AI将为您提供专业建议。
        </template>
      </el-alert>
    </el-card>

    <!-- 场景选择 -->
    <el-card class="scenario-card">
      <template #header>
        <div class="card-header">
          <el-icon><Setting /></el-icon>
          <span>模拟场景选择</span>
        </div>
      </template>

      <el-radio-group v-model="selectedScenario" size="large">
        <el-radio label="addResource" border>
          <el-icon><UserFilled /></el-icon>
          增加/减少团队成员
        </el-radio>
        <el-radio label="compressSchedule" border>
          <el-icon><Clock /></el-icon>
          压缩/延长工期
        </el-radio>
        <el-radio label="budgetCut" border>
          <el-icon><Money /></el-icon>
          压缩预算
        </el-radio>
        <el-radio label="riskMitigation" border>
          <el-icon><Warning /></el-icon>
          风险应对
        </el-radio>
      </el-radio-group>
    </el-card>

    <!-- 参数设置 -->
    <el-card class="parameters-card">
      <template #header>
        <div class="card-header">
          <el-icon><Tools /></el-icon>
          <span>参数设置</span>
        </div>
      </template>

      <!-- 增加团队成员 -->
      <div v-if="selectedScenario === 'addResource'">
        <el-form label-width="120px">
          <el-form-item label="调整人数">
            <el-input-number 
              v-model="params.resourceChange"
              :min="-5"
              :max="10"
              :step="1"
            />
            <span class="param-hint">正数表示增加,负数表示减少</span>
          </el-form-item>
          <el-form-item label="人均成本">
            <el-input-number 
              v-model="params.avgCost"
              :min="0"
              :max="50000"
              :step="1000"
            />
            <span class="param-hint">元/月</span>
          </el-form-item>
        </el-form>
      </div>

      <!-- 压缩工期 -->
      <div v-if="selectedScenario === 'compressSchedule'">
        <el-form label-width="120px">
          <el-form-item label="工期调整">
            <el-slider 
              v-model="params.scheduleCompression"
              :min="50"
              :max="150"
              :step="5"
              :marks="{ 50: '压缩50%', 100: '保持', 150: '延长50%' }"
            />
            <span class="param-hint">当前: {{ params.scheduleCompression }}%</span>
          </el-form-item>
        </el-form>
      </div>

      <!-- 压缩预算 -->
      <div v-if="selectedScenario === 'budgetCut'">
        <el-form label-width="120px">
          <el-form-item label="预算压缩比例">
            <el-slider 
              v-model="params.budgetCutPercent"
              :min="0"
              :max="50"
              :step="5"
              :marks="{ 0: '0%', 15: '15%', 30: '30%', 50: '50%' }"
              :format-tooltip="(val) => `压缩${val}%`"
            />
          </el-form-item>
        </el-form>
      </div>

      <!-- 风险应对 -->
      <div v-if="selectedScenario === 'riskMitigation'">
        <el-form label-width="120px">
          <el-form-item label="风险类型">
            <el-select v-model="params.riskType">
              <el-option label="关键人员离职" value="keyPersonLeave" />
              <el-option label="技术难点突破" value="techChallenge" />
              <el-option label="第三方依赖延迟" value="externalDelay" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <el-button 
        type="primary" 
        size="large" 
        @click="runSimulation"
        :loading="simulating"
        :icon="Connection"
      >
        运行模拟
      </el-button>
    </el-card>

    <!-- 模拟结果 -->
    <el-card v-if="simulationResult" class="result-card">
      <template #header>
        <div class="card-header">
          <el-icon><DataAnalysis /></el-icon>
          <span>模拟结果对比</span>
        </div>
      </template>

      <el-table :data="comparisonData" border stripe>
        <el-table-column prop="metric" label="指标" width="150" />
        <el-table-column label="原方案" width="200">
          <template #default="{ row }">
            <span>{{ row.original }}</span>
          </template>
        </el-table-column>
        <el-table-column label="模拟方案" width="200">
          <template #default="{ row }">
            <span :class="row.changeType">
              {{ row.simulated }}
              <el-icon v-if="row.warning"><Warning /></el-icon>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="变化" width="150">
          <template #default="{ row }">
            <el-tag :type="row.changeTagType" size="small">
              {{ row.change }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <!-- AI建议 -->
      <el-alert
        v-if="simulationResult.aiRecommendation"
        :title="simulationResult.aiRecommendation.title"
        :type="simulationResult.aiRecommendation.type"
        :closable="false"
        style="margin-top: 20px;"
        show-icon
      >
        <template #default>
          <div class="ai-recommendation">
            <p><strong>{{ simulationResult.aiRecommendation.message }}</strong></p>
            <p v-if="simulationResult.aiRecommendation.detail">
              {{ simulationResult.aiRecommendation.detail }}
            </p>
          </div>
        </template>
      </el-alert>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <el-button type="primary" @click="applySimulation">
          应用模拟方案
        </el-button>
        <el-button @click="resetSimulation">
          重置
        </el-button>
        <el-button @click="saveComparison">
          保存对比
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  Operation, Setting, UserFilled, Clock, Money, Warning,
  Tools, Connection, DataAnalysis 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

// ========== 数据定义 ==========
const selectedScenario = ref('addResource')
const simulating = ref(false)
const simulationResult = ref(null)

const params = ref({
  resourceChange: 2,
  avgCost: 15000,
  scheduleCompression: 100,
  budgetCutPercent: 15,
  riskType: 'keyPersonLeave'
})

// 原始项目数据
const originalProject = ref({
  name: '明升AICRM V4.0',
  duration: 90, // 天
  budget: 1500000,
  teamSize: 10,
  successRate: 85,
  riskLevel: '中'
})

// ========== 模拟执行 ==========
const runSimulation = async () => {
  simulating.value = true
  
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    let result = null
    
    switch (selectedScenario.value) {
      case 'addResource':
        result = simulateResourceChange()
        break
      case 'compressSchedule':
        result = simulateScheduleCompression()
        break
      case 'budgetCut':
        result = simulateBudgetCut()
        break
      case 'riskMitigation':
        result = simulateRiskMitigation()
        break
    }
    
    simulationResult.value = result
    ElMessage.success('模拟完成!')
  } catch (error) {
    ElMessage.error('模拟失败')
  } finally {
    simulating.value = false
  }
}

// 资源调整模拟
const simulateResourceChange = () => {
  const change = params.value.resourceChange
  const newTeamSize = originalProject.value.teamSize + change
  const newBudget = originalProject.value.budget + (change * params.value.avgCost * 3) // 3个月
  
  // 简化的生产率模型
  const productivityGain = change > 0 ? change * 0.05 : change * 0.08
  const newDuration = Math.round(originalProject.value.duration * (1 - productivityGain))
  
  // 风险评估
  let riskLevel = originalProject.value.riskLevel
  let successRate = originalProject.value.successRate
  
  if (change > 3) {
    riskLevel = '中'
    successRate -= 5 // 团队过大,沟通成本增加
  } else if (change < -3) {
    riskLevel = '高'
    successRate -= 15 // 人员不足
  }
  
  return {
    scenario: '资源调整',
    original: originalProject.value,
    simulated: {
      duration: newDuration,
      budget: newBudget,
      teamSize: newTeamSize,
      successRate,
      riskLevel
    },
    aiRecommendation: generateRecommendation('addResource', {
      change,
      successRateChange: successRate - originalProject.value.successRate
    })
  }
}

// 工期压缩模拟
const simulateScheduleCompression = () => {
  const ratio = params.value.scheduleCompression / 100
  const newDuration = Math.round(originalProject.value.duration * ratio)
  
  let newTeamSize = originalProject.value.teamSize
  let newBudget = originalProject.value.budget
  let riskLevel = originalProject.value.riskLevel
  let successRate = originalProject.value.successRate
  
  if (ratio < 0.8) {
    // 压缩超过20%,需要增加人员
    const requiredExtra = Math.ceil(originalProject.value.teamSize * (1 / ratio - 1))
    newTeamSize += requiredExtra
    newBudget += requiredExtra * 15000 * 3
    riskLevel = '高'
    successRate -= 20
  } else if (ratio > 1.2) {
    // 延长超过20%,可以减少人员
    successRate += 10
    riskLevel = '低'
  }
  
  return {
    scenario: '工期调整',
    original: originalProject.value,
    simulated: {
      duration: newDuration,
      budget: newBudget,
      teamSize: newTeamSize,
      successRate,
      riskLevel
    },
    aiRecommendation: generateRecommendation('compressSchedule', { ratio })
  }
}

// 预算压缩模拟
const simulateBudgetCut = () => {
  const cutPercent = params.value.budgetCutPercent / 100
  const newBudget = Math.round(originalProject.value.budget * (1 - cutPercent))
  
  let newDuration = originalProject.value.duration
  let newTeamSize = originalProject.value.teamSize
  let riskLevel = originalProject.value.riskLevel
  let successRate = originalProject.value.successRate
  
  if (cutPercent > 0.2) {
    // 压缩超过20%
    newDuration += Math.round(originalProject.value.duration * 0.15)
    newTeamSize = Math.round(newTeamSize * 0.8)
    riskLevel = '高'
    successRate -= 25
  } else if (cutPercent > 0.1) {
    riskLevel = '中'
    successRate -= 10
  }
  
  return {
    scenario: '预算压缩',
    original: originalProject.value,
    simulated: {
      duration: newDuration,
      budget: newBudget,
      teamSize: newTeamSize,
      successRate,
      riskLevel
    },
    aiRecommendation: generateRecommendation('budgetCut', { cutPercent })
  }
}

// 风险应对模拟
const simulateRiskMitigation = () => {
  const riskType = params.value.riskType
  
  let impact = {
    duration: 0,
    budget: 0,
    successRate: 0
  }
  
  switch (riskType) {
    case 'keyPersonLeave':
      impact = { duration: 15, budget: 100000, successRate: -15 }
      break
    case 'techChallenge':
      impact = { duration: 20, budget: 150000, successRate: -20 }
      break
    case 'externalDelay':
      impact = { duration: 10, budget: 50000, successRate: -10 }
      break
  }
  
  return {
    scenario: '风险应对',
    original: originalProject.value,
    simulated: {
      duration: originalProject.value.duration + impact.duration,
      budget: originalProject.value.budget + impact.budget,
      teamSize: originalProject.value.teamSize,
      successRate: originalProject.value.successRate + impact.successRate,
      riskLevel: '高'
    },
    aiRecommendation: generateRecommendation('riskMitigation', { riskType })
  }
}

// 生成AI建议
const generateRecommendation = (scenario, data) => {
  const recommendations = {
    addResource: {
      title: data.change > 0 ? '资源增加建议' : '资源减少警告',
      type: data.successRateChange >= 0 ? 'success' : 'warning',
      message: data.change > 0
        ? '增加人员将缩短工期,但需注意团队协作成本。'
        : '减少人员存在较大风险,建议谨慎评估。',
      detail: data.change > 0
        ? '建议新成员在项目初期加入,并安排导师制度确保快速融入。'
        : '如必须减少人员,建议优先压缩非关键任务范围。'
    },
    compressSchedule: {
      title: data.ratio < 1 ? '工期压缩警告' : '工期延长建议',
      type: data.ratio < 0.8 ? 'error' : data.ratio < 1 ? 'warning' : 'success',
      message: data.ratio < 0.8
        ? '不建议采用此方案,风险过高!'
        : data.ratio < 1
        ? '工期压缩需要增加资源,建议评估ROI。'
        : '延长工期可以提高成功率,建议采纳。',
      detail: data.ratio < 0.8
        ? '建议仅压缩10%工期,或保持原计划。'
        : '可通过优化关键路径和并行任务来缩短工期。'
    },
    budgetCut: {
      title: '预算压缩影响分析',
      type: data.cutPercent > 0.2 ? 'error' : 'warning',
      message: data.cutPercent > 0.2
        ? '预算压缩幅度过大,严重影响项目质量和成功率!'
        : '可以通过优化资源配置实现预算节约。',
      detail: data.cutPercent > 0.2
        ? '建议将压缩比例控制在10%以内,通过采用开源方案替代商业License等方式节省成本。'
        : '建议优先压缩非关键功能,保障核心价值交付。'
    },
    riskMitigation: {
      title: '风险应对方案',
      type: 'warning',
      message: '检测到潜在风险,建议提前制定应对措施。',
      detail: data.riskType === 'keyPersonLeave'
        ? '建议建立知识共享机制,避免单点依赖;招聘备份人才。'
        : data.riskType === 'techChallenge'
        ? '建议提前进行技术预研和POC验证,预留技术攻关时间。'
        : '建议与第三方签订SLA协议,准备Plan B方案。'
    }
  }
  
  return recommendations[scenario] || {
    title: '模拟完成',
    type: 'info',
    message: '请根据对比结果做出决策。'
  }
}

// ========== 计算属性 ==========
const comparisonData = computed(() => {
  if (!simulationResult.value) return []
  
  const { original, simulated } = simulationResult.value
  
  return [
    {
      metric: '工期',
      original: `${original.duration}天`,
      simulated: `${simulated.duration}天`,
      change: `${simulated.duration > original.duration ? '+' : ''}${simulated.duration - original.duration}天`,
      changeType: simulated.duration > original.duration ? 'text-danger' : 'text-success',
      changeTagType: simulated.duration > original.duration ? 'danger' : 'success',
      warning: simulated.duration > original.duration * 1.2
    },
    {
      metric: '预算',
      original: formatCurrency(original.budget),
      simulated: formatCurrency(simulated.budget),
      change: `${simulated.budget > original.budget ? '+' : ''}${formatCurrency(simulated.budget - original.budget)}`,
      changeType: simulated.budget > original.budget ? 'text-danger' : 'text-success',
      changeTagType: simulated.budget > original.budget ? 'danger' : 'success',
      warning: simulated.budget > original.budget * 1.2
    },
    {
      metric: '团队规模',
      original: `${original.teamSize}人`,
      simulated: `${simulated.teamSize}人`,
      change: `${simulated.teamSize > original.teamSize ? '+' : ''}${simulated.teamSize - original.teamSize}人`,
      changeType: '',
      changeTagType: 'info',
      warning: false
    },
    {
      metric: '风险等级',
      original: original.riskLevel,
      simulated: simulated.riskLevel,
      change: simulated.riskLevel !== original.riskLevel ? '变化' : '无变化',
      changeType: simulated.riskLevel === '高' ? 'text-danger' : '',
      changeTagType: simulated.riskLevel === '高' ? 'danger' : simulated.riskLevel === '中' ? 'warning' : 'success',
      warning: simulated.riskLevel === '高'
    },
    {
      metric: '成功率',
      original: `${original.successRate}%`,
      simulated: `${simulated.successRate}%`,
      change: `${simulated.successRate > original.successRate ? '+' : ''}${simulated.successRate - original.successRate}%`,
      changeType: simulated.successRate < original.successRate ? 'text-danger' : 'text-success',
      changeTagType: simulated.successRate < original.successRate ? 'danger' : 'success',
      warning: simulated.successRate < 70
    }
  ]
})

// ========== 工具函数 ==========
const formatCurrency = (value) => {
  return (value / 10000).toFixed(1) + '万'
}

const applySimulation = () => {
  ElMessage.success('模拟方案已应用!')
  originalProject.value = { ...simulationResult.value.simulated }
}

const resetSimulation = () => {
  simulationResult.value = null
  ElMessage.info('已重置')
}

const saveComparison = () => {
  const data = JSON.stringify(simulationResult.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `simulation_${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('对比结果已保存!')
}
</script>

<style scoped lang="scss">
.business-simulator {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;

  .header-card,
  .scenario-card,
  .parameters-card,
  .result-card {
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

  .el-radio {
    margin: 10px;
    padding: 15px 20px;
  }

  .param-hint {
    margin-left: 10px;
    color: #909399;
    font-size: 14px;
  }

  .text-danger {
    color: #f56c6c;
    font-weight: 600;
  }

  .text-success {
    color: #67c23a;
    font-weight: 600;
  }

  .ai-recommendation {
    p {
      margin: 8px 0;
    }
  }

  .action-buttons {
    margin-top: 20px;
    display: flex;
    gap: 10px;
  }
}
</style>
