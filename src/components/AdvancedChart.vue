<template>
  <div class="advanced-chart-container" ref="containerRef">
    <!-- 工具栏 -->
    <div v-if="showToolbar" class="chart-toolbar">
      <div class="toolbar-left">
        <el-button-group>
          <el-button 
            size="small" 
            :type="chartType === 'line' ? 'primary' : ''" 
            @click="changeChartType('line')">
            <el-icon><TrendCharts /></el-icon>
            折线图
          </el-button>
          <el-button 
            size="small" 
            :type="chartType === 'bar' ? 'primary' : ''" 
            @click="changeChartType('bar')">
            <el-icon><Histogram /></el-icon>
            柱状图
          </el-button>
          <el-button 
            size="small" 
            :type="chartType === 'pie' ? 'primary' : ''" 
            @click="changeChartType('pie')">
            <el-icon><PieChart /></el-icon>
            饼图
          </el-button>
        </el-button-group>
      </div>
      
      <div class="toolbar-right">
        <el-button size="small" :icon="Refresh" @click="refreshChart" circle />
        <el-button size="small" :icon="Download" @click="downloadChart" circle />
        <el-button size="small" :icon="FullScreen" @click="toggleFullscreen" circle />
      </div>
    </div>

    <!-- 图表容器 -->
    <div 
      ref="chartRef" 
      class="chart-canvas" 
      :style="canvasStyle">
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="chart-loading">
      <el-skeleton :rows="5" animated />
    </div>

    <!-- 空状态 -->
    <el-empty 
      v-if="!loading && isEmpty" 
      description="暂无数据" 
      :image-size="120">
      <el-button type="primary" @click="$emit('refresh')">刷新数据</el-button>
    </el-empty>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import { ChartConfigGenerator, ChartPerformanceOptimizer, ResponsiveChartHelper } from '@/utils/chartEnhancer'

const props = defineProps({
  // 图表类型
  chartType: {
    type: String,
    default: 'line',
    validator: (value) => ['line', 'bar', 'pie', 'radar', 'gauge', 'custom'].includes(value)
  },
  // 图表数据
  data: {
    type: Object,
    default: () => ({})
  },
  // 图表配置
  option: {
    type: Object,
    default: () => ({})
  },
  // 图表高度
  height: {
    type: [String, Number],
    default: '400px'
  },
  // 是否显示工具栏
  showToolbar: {
    type: Boolean,
    default: true
  },
  // 是否自动刷新
  autoRefresh: {
    type: Boolean,
    default: false
  },
  // 刷新间隔(ms)
  refreshInterval: {
    type: Number,
    default: 30000
  },
  // 是否启用性能优化
  enableOptimization: {
    type: Boolean,
    default: true
  },
  // 主题
  theme: {
    type: String,
    default: 'custom'
  }
})

const emit = defineEmits(['refresh', 'chartReady', 'chartClick'])

// Refs
const containerRef = ref(null)
const chartRef = ref(null)
const chartInstance = ref(null)
const loading = ref(false)
const currentChartType = ref(props.chartType)

// 计算属性
const canvasStyle = computed(() => ({
  height: typeof props.height === 'number' ? `${props.height}px` : props.height
}))

const isEmpty = computed(() => {
  return !props.data || Object.keys(props.data).length === 0
})

// 初始化图表
const initChart = async () => {
  if (!chartRef.value) return

  loading.value = true

  try {
    // 销毁旧实例
    if (chartInstance.value) {
      chartInstance.value.dispose()
    }

    // 创建新实例
    chartInstance.value = echarts.init(chartRef.value, props.theme)

    // 生成配置
    const config = generateChartConfig()

    // 性能优化
    const optimizedConfig = props.enableOptimization 
      ? ChartPerformanceOptimizer.enableProgressiveRendering(config, getTotalDataCount())
      : config

    // 响应式适配
    const finalConfig = ResponsiveChartHelper.adaptToWidth(
      optimizedConfig, 
      containerRef.value?.offsetWidth || 800
    )

    // 设置配置
    chartInstance.value.setOption(finalConfig, true)

    // 绑定事件
    chartInstance.value.on('click', (params) => {
      emit('chartClick', params)
    })

    // 触发就绪事件
    emit('chartReady', chartInstance.value)

    // 设置自动调整大小
    const cleanup = ResponsiveChartHelper.setupAutoResize(chartInstance.value)

    // 保存清理函数
    onUnmounted(() => {
      cleanup()
    })
  } catch (error) {
    console.error('图表初始化失败:', error)
  } finally {
    loading.value = false
  }
}

// 生成图表配置
const generateChartConfig = () => {
  // 如果提供了自定义配置，直接使用
  if (Object.keys(props.option).length > 0) {
    return props.option
  }

  // 根据图表类型生成配置
  switch (currentChartType.value) {
    case 'line':
      return ChartConfigGenerator.generateLineChart(props.data)
    case 'bar':
      return ChartConfigGenerator.generateBarChart(props.data)
    case 'pie':
      return ChartConfigGenerator.generatePieChart(props.data)
    case 'radar':
      return ChartConfigGenerator.generateRadarChart(props.data)
    case 'gauge':
      return ChartConfigGenerator.generateGaugeChart(props.data)
    default:
      return props.option
  }
}

// 获取总数据量
const getTotalDataCount = () => {
  if (!props.data.series) return 0
  return props.data.series.reduce((sum, s) => sum + (s.data?.length || 0), 0)
}

// 切换图表类型
const changeChartType = (type) => {
  currentChartType.value = type
  initChart()
}

// 刷新图表
const refreshChart = () => {
  emit('refresh')
  initChart()
}

// 下载图表
const downloadChart = () => {
  if (!chartInstance.value) return

  const url = chartInstance.value.getDataURL({
    type: 'png',
    pixelRatio: 2,
    backgroundColor: '#fff'
  })

  const link = document.createElement('a')
  link.href = url
  link.download = `chart_${Date.now()}.png`
  link.click()
}

// 全屏切换
const toggleFullscreen = () => {
  if (!containerRef.value) return

  if (document.fullscreenElement) {
    document.exitFullscreen()
  } else {
    containerRef.value.requestFullscreen()
  }
}

// 监听数据变化
watch(() => props.data, () => {
  nextTick(() => {
    initChart()
  })
}, { deep: true })

watch(() => props.option, () => {
  nextTick(() => {
    initChart()
  })
}, { deep: true })

// 自动刷新
let refreshTimer = null
if (props.autoRefresh) {
  refreshTimer = setInterval(() => {
    refreshChart()
  }, props.refreshInterval)
}

// 生命周期
onMounted(() => {
  nextTick(() => {
    initChart()
  })
})

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.dispose()
  }
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
})

// 暴露方法
defineExpose({
  refresh: refreshChart,
  getInstance: () => chartInstance.value,
  changeType: changeChartType
})
</script>

<style scoped>
.advanced-chart-container {
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.chart-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #EBEEF5;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart-canvas {
  width: 100%;
  min-height: 300px;
  position: relative;
}

.chart-loading {
  position: absolute;
  top: 60px;
  left: 16px;
  right: 16px;
  bottom: 16px;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 8px;
}

/* 全屏样式 */
.advanced-chart-container:fullscreen {
  background: white;
  padding: 24px;
}

.advanced-chart-container:fullscreen .chart-canvas {
  height: calc(100vh - 100px) !important;
}

@media (max-width: 768px) {
  .chart-toolbar {
    flex-direction: column;
    gap: 12px;
  }

  .toolbar-left,
  .toolbar-right {
    width: 100%;
    justify-content: center;
  }
}
</style>
