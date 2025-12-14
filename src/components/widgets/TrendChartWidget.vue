<template>
  <div class="trend-chart-widget">
    <div ref="chartRef" style="width: 100%; height: 100%;"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  widget: Object,
  data: {
    type: Object,
    default: () => ({ results: [], filters: {} })
  }
})

const chartRef = ref(null)
let chartInstance = null

const initChart = () => {
  if (!chartRef.value || !props.data.results) return

  if (chartInstance) {
    chartInstance.dispose()
  }

  chartInstance = echarts.init(chartRef.value)

  const results = props.data.results.slice().reverse()
  const timestamps = results.map((r, index) => index + 1)
  const torques = results.map(r => r.torque)
  const angles = results.map(r => r.angle)
  const targetTorque = results[0]?.targetTorque || 35

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['扭矩', '角度', '扭矩目标值'],
      top: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: timestamps,
      name: '拧紧序号'
    },
    yAxis: [
      {
        type: 'value',
        name: '扭矩 (Nm)',
        position: 'left',
        axisLabel: {
          formatter: '{value} Nm'
        }
      },
      {
        type: 'value',
        name: '角度 (°)',
        position: 'right',
        axisLabel: {
          formatter: '{value}°'
        }
      }
    ],
    series: [
      {
        name: '扭矩',
        type: 'line',
        yAxisIndex: 0,
        data: torques,
        smooth: true,
        itemStyle: {
          color: '#667eea'
        },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(102, 126, 234, 0.3)' },
            { offset: 1, color: 'rgba(102, 126, 234, 0.05)' }
          ])
        }
      },
      {
        name: '角度',
        type: 'line',
        yAxisIndex: 1,
        data: angles,
        smooth: true,
        itemStyle: {
          color: '#10b981'
        }
      },
      {
        name: '扭矩目标值',
        type: 'line',
        yAxisIndex: 0,
        data: Array(timestamps.length).fill(targetTorque),
        lineStyle: {
          type: 'dashed',
          color: '#f43f5e',
          width: 2
        },
        symbol: 'none'
      }
    ]
  }

  chartInstance.setOption(option)
}

onMounted(() => {
  nextTick(() => {
    initChart()
  })

  window.addEventListener('resize', () => {
    chartInstance?.resize()
  })
})

watch(() => props.data.results, () => {
  initChart()
}, { deep: true })
</script>

<style scoped lang="scss">
.trend-chart-widget {
  width: 100%;
  height: 100%;
  min-height: 200px;
}
</style>
