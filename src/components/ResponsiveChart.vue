<template>
  <div class="responsive-chart-container" ref="containerRef">
    <!-- 桌面端：完整图表 -->
    <div v-if="!isMobile" class="desktop-chart">
      <div :id="chartId" :style="{ height: chartHeight + 'px' }"></div>
    </div>
    
    <!-- 移动端：简化图表 + 展开按钮 -->
    <div v-else class="mobile-chart">
      <div :id="mobileChartId" :style="{ height: mobileChartHeight + 'px' }"></div>
      <el-button 
        v-if="showExpandButton" 
        @click="expandFullView" 
        type="primary" 
        size="small"
        class="expand-button"
      >
        <el-icon><FullScreen /></el-icon>
        查看完整图表
      </el-button>
    </div>
    
    <!-- 全屏图表对话框 -->
    <el-dialog
      v-model="fullScreenVisible"
      :fullscreen="true"
      :show-close="true"
      class="fullscreen-chart-dialog"
    >
      <template #header>
        <div class="dialog-header">
          <span>{{ title }}</span>
          <el-button @click="fullScreenVisible = false" text>
            <el-icon><Close /></el-icon>
          </el-button>
        </div>
      </template>
      <div :id="fullScreenChartId" style="height: calc(100vh - 100px);"></div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useResponsive } from '@/composables/useResponsive'
import { debounce } from '@/utils/performance'
import * as echarts from 'echarts'
import { FullScreen, Close } from '@element-plus/icons-vue'

// Props
const props = defineProps({
  options: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    default: '图表'
  },
  chartHeight: {
    type: Number,
    default: 400
  },
  mobileChartHeight: {
    type: Number,
    default: 250
  },
  showExpandButton: {
    type: Boolean,
    default: true
  }
})

// 响应式
const { isMobile, windowWidth } = useResponsive()

// 生成唯一ID
const generateId = () => `chart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

const chartId = ref(generateId())
const mobileChartId = ref(generateId())
const fullScreenChartId = ref(generateId())
const containerRef = ref(null)
const fullScreenVisible = ref(false)

let chartInstance = null
let mobileChartInstance = null
let fullScreenChartInstance = null

// 简化移动端图表配置
const getMobileOptions = (options) => {
  const mobileOptions = JSON.parse(JSON.stringify(options))
  
  // 简化配置
  if (mobileOptions.title) {
    mobileOptions.title.textStyle = { fontSize: 14 }
  }
  
  if (mobileOptions.legend) {
    mobileOptions.legend.textStyle = { fontSize: 12 }
    mobileOptions.legend.itemWidth = 20
    mobileOptions.legend.itemHeight = 12
  }
  
  if (mobileOptions.xAxis) {
    if (Array.isArray(mobileOptions.xAxis)) {
      mobileOptions.xAxis.forEach(axis => {
        if (axis.axisLabel) axis.axisLabel.fontSize = 10
      })
    } else {
      if (mobileOptions.xAxis.axisLabel) {
        mobileOptions.xAxis.axisLabel.fontSize = 10
        mobileOptions.xAxis.axisLabel.rotate = 45
      }
    }
  }
  
  if (mobileOptions.yAxis) {
    if (Array.isArray(mobileOptions.yAxis)) {
      mobileOptions.yAxis.forEach(axis => {
        if (axis.axisLabel) axis.axisLabel.fontSize = 10
      })
    } else {
      if (mobileOptions.yAxis.axisLabel) {
        mobileOptions.yAxis.axisLabel.fontSize = 10
      }
    }
  }
  
  if (mobileOptions.tooltip) {
    mobileOptions.tooltip.textStyle = { fontSize: 12 }
  }
  
  // 减少数据点（如果是折线图或柱状图）
  if (mobileOptions.series) {
    mobileOptions.series.forEach(series => {
      if (series.type === 'line' || series.type === 'bar') {
        series.sampling = 'lttb' // 使用LTTB采样算法
      }
    })
  }
  
  return mobileOptions
}

// 初始化图表
const initChart = () => {
  if (!isMobile.value) {
    // 桌面端
    nextTick(() => {
      const chartDom = document.getElementById(chartId.value)
      if (chartDom) {
        chartInstance = echarts.init(chartDom)
        chartInstance.setOption(props.options)
      }
    })
  } else {
    // 移动端
    nextTick(() => {
      const mobileDom = document.getElementById(mobileChartId.value)
      if (mobileDom) {
        mobileChartInstance = echarts.init(mobileDom)
        const mobileOptions = getMobileOptions(props.options)
        mobileChartInstance.setOption(mobileOptions)
      }
    })
  }
}

// 展开全屏视图
const expandFullView = () => {
  fullScreenVisible.value = true
  nextTick(() => {
    const fullScreenDom = document.getElementById(fullScreenChartId.value)
    if (fullScreenDom) {
      fullScreenChartInstance = echarts.init(fullScreenDom)
      fullScreenChartInstance.setOption(props.options)
    }
  })
}

// 响应式调整图表大小
const handleResize = debounce(() => {
  if (chartInstance) {
    chartInstance.resize()
  }
  if (mobileChartInstance) {
    mobileChartInstance.resize()
  }
  if (fullScreenChartInstance) {
    fullScreenChartInstance.resize()
  }
}, 300)

// 监听配置变化
watch(() => props.options, (newOptions) => {
  if (chartInstance) {
    chartInstance.setOption(newOptions, true)
  }
  if (mobileChartInstance) {
    const mobileOptions = getMobileOptions(newOptions)
    mobileChartInstance.setOption(mobileOptions, true)
  }
}, { deep: true })

// 监听移动端状态变化
watch(isMobile, () => {
  // 销毁旧图表
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  if (mobileChartInstance) {
    mobileChartInstance.dispose()
    mobileChartInstance = null
  }
  
  // 重新初始化
  initChart()
})

// 生命周期
onMounted(() => {
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
  }
  if (mobileChartInstance) {
    mobileChartInstance.dispose()
  }
  if (fullScreenChartInstance) {
    fullScreenChartInstance.dispose()
  }
  window.removeEventListener('resize', handleResize)
})

// 暴露方法
defineExpose({
  getChartInstance: () => chartInstance || mobileChartInstance,
  refreshChart: () => {
    if (chartInstance) chartInstance.setOption(props.options)
    if (mobileChartInstance) {
      const mobileOptions = getMobileOptions(props.options)
      mobileChartInstance.setOption(mobileOptions)
    }
  }
})
</script>

<style scoped lang="scss">
.responsive-chart-container {
  width: 100%;
}

.desktop-chart,
.mobile-chart {
  width: 100%;
}

.mobile-chart {
  .expand-button {
    width: 100%;
    margin-top: 12px;
  }
}

.fullscreen-chart-dialog {
  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    font-weight: 600;
  }
}
</style>
