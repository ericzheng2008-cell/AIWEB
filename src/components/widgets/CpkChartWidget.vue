<template>
  <div class="cpk-chart-widget">
    <div v-if="data" class="cpk-info">
      <el-row :gutter="16">
        <el-col :span="6">
          <div class="cpk-card" :class="cpkLevel">
            <div class="cpk-label">Cpk</div>
            <div class="cpk-value">{{ data.cpk }}</div>
            <el-tag :type="cpkTagType" size="small" effect="dark">
              {{ cpkStatus }}
            </el-tag>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="cpk-item">
            <span class="label">Cp:</span>
            <span class="value">{{ data.cp }}</span>
          </div>
          <div class="cpk-item">
            <span class="label">均值:</span>
            <span class="value">{{ data.mean }} Nm</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="cpk-item">
            <span class="label">标准差:</span>
            <span class="value">{{ data.stdDev }}</span>
          </div>
          <div class="cpk-item">
            <span class="label">样本:</span>
            <span class="value">{{ data.sampleSize }}</span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="cpk-item">
            <span class="label">UCL:</span>
            <span class="value">{{ data.ucl }} Nm</span>
          </div>
          <div class="cpk-item">
            <span class="label">LCL:</span>
            <span class="value">{{ data.lcl }} Nm</span>
          </div>
        </el-col>
      </el-row>
      <div ref="chartRef" style="width: 100%; height: 200px; margin-top: 16px;"></div>
    </div>
    <el-empty v-else description="数据不足（需要≥30个样本）" :image-size="80" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  widget: Object,
  data: Object
})

const chartRef = ref(null)
let chartInstance = null

const cpkLevel = computed(() => {
  if (!props.data) return 'insufficient'
  const cpk = parseFloat(props.data.cpk)
  if (cpk >= 1.67) return 'excellent'
  if (cpk >= 1.33) return 'good'
  if (cpk >= 1.0) return 'acceptable'
  return 'poor'
})

const cpkStatus = computed(() => {
  if (!props.data) return '数据不足'
  const cpk = parseFloat(props.data.cpk)
  if (cpk >= 1.67) return '优秀'
  if (cpk >= 1.33) return '良好'
  if (cpk >= 1.0) return '可接受'
  return '不足'
})

const cpkTagType = computed(() => {
  if (!props.data) return 'info'
  const cpk = parseFloat(props.data.cpk)
  if (cpk >= 1.67) return 'success'
  if (cpk >= 1.33) return 'success'
  if (cpk >= 1.0) return 'warning'
  return 'danger'
})

const initChart = () => {
  if (!chartRef.value || !props.data) return

  if (chartInstance) {
    chartInstance.dispose()
  }

  chartInstance = echarts.init(chartRef.value)

  const option = {
    tooltip: {
      trigger: 'item'
    },
    xAxis: {
      type: 'category',
      data: ['下限', '目标', '上限'],
      axisLabel: {
        fontSize: 11
      }
    },
    yAxis: {
      type: 'value',
      name: '扭矩 (Nm)',
      axisLabel: {
        fontSize: 11
      }
    },
    series: [
      {
        type: 'bar',
        data: [
          { value: parseFloat(props.data.lowerLimit), itemStyle: { color: '#f43f5e' } },
          { value: parseFloat(props.data.target), itemStyle: { color: '#10b981' } },
          { value: parseFloat(props.data.upperLimit), itemStyle: { color: '#f43f5e' } }
        ],
        label: {
          show: true,
          position: 'top',
          fontSize: 12,
          formatter: '{c} Nm'
        }
      },
      {
        type: 'line',
        data: [
          parseFloat(props.data.mean),
          parseFloat(props.data.mean),
          parseFloat(props.data.mean)
        ],
        lineStyle: {
          type: 'dashed',
          color: '#667eea',
          width: 2
        },
        symbol: 'none',
        name: '实际均值'
      }
    ]
  }

  chartInstance.setOption(option)
}

onMounted(() => {
  if (props.data) {
    initChart()
  }
})

watch(() => props.data, () => {
  if (props.data) {
    initChart()
  }
}, { deep: true })
</script>

<style scoped lang="scss">
.cpk-chart-widget {
  height: 100%;

  .cpk-info {
    height: 100%;
  }

  .cpk-card {
    text-align: center;
    padding: 16px;
    border-radius: 8px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    &.excellent {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }

    &.good {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    }

    &.acceptable {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    }

    &.poor {
      background: linear-gradient(135deg, #f43f5e 0%, #dc2626 100%);
    }

    .cpk-label {
      font-size: 12px;
      opacity: 0.9;
      margin-bottom: 8px;
    }

    .cpk-value {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 8px;
    }
  }

  .cpk-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 12px;
    margin-bottom: 4px;
    background: #f9fafb;
    border-radius: 4px;
    font-size: 13px;

    .label {
      color: #666;
    }

    .value {
      font-weight: 600;
      color: #1a1a1a;
    }
  }
}
</style>
