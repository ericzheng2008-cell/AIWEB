<template>
  <div class="ai-explainability">
    <!-- AI预测结果展示 -->
    <el-card class="prediction-card">
      <template #header>
        <div class="card-header">
          <span>🤖 AI预测结果</span>
          <el-tag :type="getConfidenceType(prediction.confidence)">
            置信度: {{ (prediction.confidence * 100).toFixed(1) }}%
          </el-tag>
        </div>
      </template>

      <div class="prediction-value">
        <div class="value-main">
          <span class="label">预测值:</span>
          <span class="value">{{ formatPredictionValue(prediction.value) }}</span>
        </div>
        <el-progress 
          :percentage="prediction.confidence * 100" 
          :color="getConfidenceColor(prediction.confidence)"
          :stroke-width="10"
        />
      </div>

      <el-divider />

      <!-- 不确定性区间 -->
      <div class="uncertainty-range">
        <h4>📊 不确定性区间</h4>
        <div class="range-display">
          <span class="range-min">{{ formatValue(prediction.uncertaintyRange[0]) }}</span>
          <div class="range-bar">
            <div 
              class="range-indicator" 
              :style="{ left: getIndicatorPosition(prediction.value) + '%' }"
            >
              <el-tooltip content="预测值" placement="top">
                <div class="indicator-dot"></div>
              </el-tooltip>
            </div>
          </div>
          <span class="range-max">{{ formatValue(prediction.uncertaintyRange[1]) }}</span>
        </div>
        <p class="range-description">
          AI预测{{ formatValue(prediction.value) }}，有{{ (prediction.confidence * 100).toFixed(0) }}%的概率落在
          {{ formatValue(prediction.uncertaintyRange[0]) }} - {{ formatValue(prediction.uncertaintyRange[1]) }}之间
        </p>
      </div>

      <el-divider />

      <!-- 影响因素权重分析 -->
      <div class="explainability-factors">
        <h4>🔍 影响因素分析</h4>
        <el-table :data="prediction.explainability.topFactors" style="width: 100%">
          <el-table-column prop="factor" label="影响因素" width="180" />
          <el-table-column label="权重占比" width="200">
            <template #default="{ row }">
              <el-progress 
                :percentage="row.weight * 100" 
                :color="getWeightColor(row.weight)"
                :stroke-width="8"
              >
                <template #default="{ percentage }">
                  <span style="font-size: 12px;">{{ percentage.toFixed(1) }}%</span>
                </template>
              </el-progress>
            </template>
          </el-table-column>
          <el-table-column label="影响方向" width="120">
            <template #default="{ row }">
              <el-tag :type="getImpactType(row.impact)">
                {{ row.impact }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="explanation" label="说明" min-width="200" />
        </el-table>
      </div>

      <el-divider />

      <!-- 模型元信息 -->
      <div class="model-metadata">
        <h4>ℹ️ 模型信息</h4>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="模型版本">
            <el-tag>{{ prediction.explainability.modelVersion }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="训练日期">
            {{ formatDate(prediction.explainability.trainingDate) }}
          </el-descriptions-item>
          <el-descriptions-item label="样本数量">
            {{ prediction.explainability.sampleSize || 'N/A' }}
          </el-descriptions-item>
          <el-descriptions-item label="模型类型">
            {{ prediction.explainability.modelType || '集成学习模型' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <el-divider />

      <!-- 历史准确率 -->
      <div class="historical-accuracy">
        <h4>📈 历史预测准确率</h4>
        <div id="accuracyChart" style="height: 250px;"></div>
        <el-alert 
          type="info" 
          :closable="false"
          style="margin-top: 12px;"
        >
          <template #title>
            该模型在过去30天的平均准确率为{{ historicalAccuracy }}%，
            {{ historicalAccuracy >= 85 ? '表现优秀' : historicalAccuracy >= 75 ? '表现良好' : '需要优化' }}
          </template>
        </el-alert>
      </div>

      <!-- 操作按钮 -->
      <div class="actions" style="margin-top: 20px;">
        <el-button @click="showDetailedAnalysis">
          <el-icon><View /></el-icon>
          查看详细分析
        </el-button>
        <el-button @click="exportPrediction">
          <el-icon><Download /></el-icon>
          导出预测报告
        </el-button>
        <el-button @click="provideFeedback" type="primary">
          <el-icon><ChatLineSquare /></el-icon>
          提供反馈
        </el-button>
      </div>
    </el-card>

    <!-- 反馈对话框 -->
    <el-dialog v-model="feedbackDialogVisible" title="预测反馈" width="500px">
      <el-form :model="feedback" label-width="100px">
        <el-form-item label="实际结果">
          <el-input v-model="feedback.actualValue" placeholder="请输入实际值" />
        </el-form-item>
        <el-form-item label="准确度评价">
          <el-rate v-model="feedback.rating" show-text />
        </el-form-item>
        <el-form-item label="反馈意见">
          <el-input 
            v-model="feedback.comment" 
            type="textarea" 
            :rows="4"
            placeholder="请输入您的反馈意见..."
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="feedbackDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitFeedback">提交反馈</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { View, Download, ChatLineSquare } from '@element-plus/icons-vue'

// Props
const props = defineProps({
  prediction: {
    type: Object,
    required: true,
    default: () => ({
      value: 0.75,
      confidence: 0.82,
      uncertaintyRange: [0.68, 0.82],
      explainability: {
        topFactors: [
          { factor: '历史中标率', weight: 0.35, impact: '+15%', explanation: '该客户历史中标率较高' },
          { factor: '竞对报价趋势', weight: 0.28, impact: '-8%', explanation: '竞争对手报价偏低' },
          { factor: '客户关系强度', weight: 0.22, impact: '+12%', explanation: '与客户关系良好' },
          { factor: '项目复杂度', weight: 0.15, impact: '-5%', explanation: '项目技术难度较高' }
        ],
        modelVersion: 'v2.3.1',
        trainingDate: '2025-12-01',
        sampleSize: 5000,
        modelType: 'XGBoost集成模型'
      }
    })
  },
  valueType: {
    type: String,
    default: 'percentage' // 'percentage', 'currency', 'number'
  }
})

// 响应式数据
const feedbackDialogVisible = ref(false)
const feedback = ref({
  actualValue: '',
  rating: 0,
  comment: ''
})
const historicalAccuracy = ref(87)

// 方法
const formatPredictionValue = (value) => {
  if (props.valueType === 'percentage') {
    return (value * 100).toFixed(1) + '%'
  } else if (props.valueType === 'currency') {
    return '¥' + (value / 10000).toFixed(1) + '万'
  }
  return value.toFixed(2)
}

const formatValue = (value) => {
  if (props.valueType === 'percentage') {
    return (value * 100).toFixed(1) + '%'
  } else if (props.valueType === 'currency') {
    return '¥' + (value / 10000).toFixed(1) + '万'
  }
  return value.toFixed(2)
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN')
}

const getConfidenceType = (confidence) => {
  if (confidence >= 0.85) return 'success'
  if (confidence >= 0.7) return 'warning'
  return 'danger'
}

const getConfidenceColor = (confidence) => {
  if (confidence >= 0.85) return '#67C23A'
  if (confidence >= 0.7) return '#E6A23C'
  return '#F56C6C'
}

const getWeightColor = (weight) => {
  if (weight >= 0.3) return '#F56C6C'
  if (weight >= 0.2) return '#E6A23C'
  if (weight >= 0.1) return '#409EFF'
  return '#909399'
}

const getImpactType = (impact) => {
  if (impact.startsWith('+')) return 'success'
  if (impact.startsWith('-')) return 'danger'
  return 'info'
}

const getIndicatorPosition = (value) => {
  const min = props.prediction.uncertaintyRange[0]
  const max = props.prediction.uncertaintyRange[1]
  return ((value - min) / (max - min)) * 100
}

const showDetailedAnalysis = () => {
  ElMessage.info('打开详细分析面板')
}

const exportPrediction = () => {
  ElMessage.success('正在导出预测报告...')
}

const provideFeedback = () => {
  feedbackDialogVisible.value = true
}

const submitFeedback = () => {
  if (!feedback.value.actualValue) {
    ElMessage.warning('请输入实际结果')
    return
  }
  
  ElMessage.success('感谢您的反馈!这将帮助我们改进AI模型')
  feedbackDialogVisible.value = false
  
  // 重置反馈表单
  feedback.value = {
    actualValue: '',
    rating: 0,
    comment: ''
  }
}

// 初始化图表
const initCharts = () => {
  const accuracyChart = echarts.init(document.getElementById('accuracyChart'))
  
  // 生成近30天的模拟数据
  const dates = []
  const accuracyData = []
  for (let i = 29; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    dates.push(date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }))
    accuracyData.push(82 + Math.random() * 10) // 82-92%之间随机
  }
  
  accuracyChart.setOption({
    tooltip: {
      trigger: 'axis',
      formatter: '{b}<br/>准确率: {c}%'
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLabel: {
        interval: 4
      }
    },
    yAxis: {
      type: 'value',
      min: 70,
      max: 100,
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [{
      name: '准确率',
      type: 'line',
      data: accuracyData,
      smooth: true,
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(64, 158, 255, 0.3)' },
            { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
          ]
        }
      },
      itemStyle: {
        color: '#409EFF'
      },
      markLine: {
        data: [
          { type: 'average', name: '平均值', lineStyle: { color: '#67C23A' } }
        ]
      }
    }]
  })
}

onMounted(() => {
  setTimeout(() => {
    initCharts()
  }, 300)
})
</script>

<style scoped lang="scss">
.ai-explainability {
  .prediction-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
    }

    .prediction-value {
      margin-bottom: 20px;

      .value-main {
        display: flex;
        align-items: center;
        margin-bottom: 12px;

        .label {
          font-size: 16px;
          color: #606266;
          margin-right: 12px;
        }

        .value {
          font-size: 36px;
          font-weight: 700;
          color: #409EFF;
        }
      }
    }

    .uncertainty-range {
      h4 {
        margin: 0 0 16px 0;
        color: #303133;
        font-size: 15px;
      }

      .range-display {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;

        .range-min,
        .range-max {
          font-size: 14px;
          font-weight: 600;
          color: #606266;
          min-width: 60px;
        }

        .range-bar {
          flex: 1;
          height: 24px;
          background: linear-gradient(to right, #F56C6C, #E6A23C, #67C23A);
          border-radius: 12px;
          position: relative;

          .range-indicator {
            position: absolute;
            top: -8px;
            transform: translateX(-50%);

            .indicator-dot {
              width: 16px;
              height: 40px;
              background: #303133;
              border-radius: 8px;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
              cursor: pointer;
            }
          }
        }
      }

      .range-description {
        font-size: 13px;
        color: #909399;
        margin: 8px 0 0 0;
      }
    }

    .explainability-factors {
      h4 {
        margin: 0 0 16px 0;
        color: #303133;
        font-size: 15px;
      }
    }

    .model-metadata {
      h4 {
        margin: 0 0 16px 0;
        color: #303133;
        font-size: 15px;
      }
    }

    .historical-accuracy {
      h4 {
        margin: 0 0 16px 0;
        color: #303133;
        font-size: 15px;
      }
    }

    .actions {
      display: flex;
      gap: 12px;
    }
  }
}
</style>
