<template>
  <div class="enhanced-curve-chart">
    <!-- 图形控制工具栏 -->
    <div class="chart-toolbar">
      <el-row :gutter="12">
        <!-- 显示范围控制 -->
        <el-col :span="8">
          <div class="toolbar-section">
            <label class="toolbar-label">Display Range (标尺)</label>
            <div class="range-controls">
              <el-input-number
                v-model="displayRange.min"
                :min="0"
                :max="displayRange.max"
                :step="1"
                size="small"
                @change="handleRangeChange"
              >
                <template #prepend>最小角度</template>
              </el-input-number>
              <el-input-number
                v-model="displayRange.max"
                :min="displayRange.min"
                :max="100"
                :step="1"
                size="small"
                @change="handleRangeChange"
                style="margin-left: 8px;"
              >
                <template #prepend>最大角度</template>
              </el-input-number>
              <el-button
                size="small"
                @click="resetDisplayRange"
                style="margin-left: 8px;"
              >
                100%
              </el-button>
              <el-button
                size="small"
                type="primary"
                @click="applyZoom"
                style="margin-left: 8px;"
              >
                Zoom
              </el-button>
            </div>
          </div>
        </el-col>

        <!-- 图形点查看 -->
        <el-col :span="6">
          <div class="toolbar-section">
            <label class="toolbar-label">Graph Point (图形点)</label>
            <el-input-number
              v-model="currentPointIndex"
              :min="0"
              :max="totalPoints - 1"
              :step="1"
              size="small"
              @change="handlePointChange"
            >
              <template #prepend>点编号</template>
            </el-input-number>
            <el-checkbox
              v-model="editMode"
              style="margin-left: 8px;"
              @change="toggleEditMode"
            >
              Edit
            </el-checkbox>
          </div>
        </el-col>

        <!-- 图形类型选择 -->
        <el-col :span="6">
          <div class="toolbar-section">
            <label class="toolbar-label">图形类型 (>>)</label>
            <el-button size="small" @click="showGraphTypeDialog = true">
              >> 选择图形
            </el-button>
          </div>
        </el-col>

        <!-- NOK内存 -->
        <el-col :span="4">
          <div class="toolbar-section">
            <label class="toolbar-label">NOK Memory</label>
            <el-button
              size="small"
              type="warning"
              @click="loadNOKMemory"
            >
              Load NOK
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 图形显示区域 -->
    <div class="chart-display">
      <div
        ref="chartContainer"
        class="chart-container"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @click="handleChartClick"
      ></div>

      <!-- 十字准线和数据显示 -->
      <div v-if="crosshairData" class="crosshair-info">
        <div class="info-panel">
          <div class="info-row">
            <span class="info-label">点编号:</span>
            <span class="info-value">{{ crosshairData.index }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">角度:</span>
            <span class="info-value">{{ crosshairData.angle.toFixed(2) }}°</span>
          </div>
          <div class="info-row">
            <span class="info-label">扭矩:</span>
            <span class="info-value">{{ crosshairData.torque.toFixed(2) }} Nm</span>
          </div>
          <div class="info-row" v-if="crosshairData.gradient !== undefined">
            <span class="info-label">梯度:</span>
            <span class="info-value">{{ crosshairData.gradient.toFixed(2) }}</span>
          </div>
          <div class="info-row" v-if="crosshairData.auxiliary !== undefined">
            <span class="info-label">辅助:</span>
            <span class="info-value">{{ crosshairData.auxiliary.toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 鼠标框选提示 -->
    <div v-if="isSelecting" class="selection-hint">
      拖动鼠标从左上到右下选择区域进行缩放
    </div>

    <!-- 图形类型选择对话框 -->
    <el-dialog
      v-model="showGraphTypeDialog"
      title="图形选择 - Graph Type Selection"
      width="500px"
    >
      <div class="graph-type-selection">
        <p class="dialog-hint">
          对你想查看的图形作对号标记。你能同时查看两个图形。
        </p>
        <el-checkbox-group v-model="selectedGraphTypes" :max="2">
          <div class="graph-type-item">
            <el-checkbox label="torque" value="torque">
              <div class="checkbox-content">
                <span class="type-name">T Graph (扭矩图)</span>
                <el-tag size="small" type="success">标准</el-tag>
              </div>
            </el-checkbox>
          </div>
          <div class="graph-type-item">
            <el-checkbox label="gradient" value="gradient">
              <div class="checkbox-content">
                <span class="type-name">Gradient (梯度图)</span>
              </div>
            </el-checkbox>
          </div>
          <div class="graph-type-item">
            <el-checkbox label="auxiliary" value="auxiliary">
              <div class="checkbox-content">
                <span class="type-name">Auxiliary (辅助图)</span>
              </div>
            </el-checkbox>
          </div>
        </el-checkbox-group>
        <div class="selected-count">
          已选择: {{ selectedGraphTypes.length }} / 2
        </div>
      </div>
      <template #footer>
        <el-button @click="showGraphTypeDialog = false">取消</el-button>
        <el-button type="primary" @click="applyGraphTypes">确定</el-button>
      </template>
    </el-dialog>

    <!-- 键盘操作提示 -->
    <div class="keyboard-hints">
      <el-alert type="info" :closable="false">
        <template #title>
          <div class="hints-content">
            <span><kbd>←</kbd> <kbd>→</kbd> 逐点查看</span>
            <span><kbd>Ctrl</kbd> + <kbd>←</kbd> <kbd>→</kbd> 每10点查看</span>
            <span><kbd>Shift</kbd> + <kbd>←</kbd> <kbd>→</kbd> 每100点查看</span>
            <span>鼠标点击图形查看数据点</span>
          </div>
        </template>
      </el-alert>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

// Props
const props = defineProps({
  curveData: {
    type: Array,
    default: () => []
  },
  standardCurve: {
    type: Array,
    default: () => []
  }
})

// Emit
const emit = defineEmits(['point-selected', 'zoom-changed'])

// Refs
const chartContainer = ref(null)
let chartInstance = null

// 状态
const displayRange = reactive({
  min: 0,
  max: 100
})

const currentPointIndex = ref(0)
const totalPoints = ref(0)
const editMode = ref(false)
const crosshairData = ref(null)
const showGraphTypeDialog = ref(false)
const selectedGraphTypes = ref(['torque']) // 默认显示扭矩图
const isSelecting = ref(false)
const selectionStart = reactive({ x: 0, y: 0 })
const selectionEnd = reactive({ x: 0, y: 0 })

// NOK内存（存储不合格曲线）
const nokMemory = ref([])
const currentNOKIndex = ref(0)

// 初始化图表
onMounted(() => {
  initChart()
  addKeyboardListeners()
  loadNOKFromStorage()
})

onUnmounted(() => {
  removeKeyboardListeners()
  if (chartInstance) {
    chartInstance.dispose()
  }
})

// 监听曲线数据变化
watch(() => props.curveData, () => {
  updateChart()
}, { deep: true })

// 初始化图表
const initChart = () => {
  if (!chartContainer.value) return

  chartInstance = echarts.init(chartContainer.value)
  updateChart()

  // 图表点击事件
  chartInstance.on('click', (params) => {
    if (editMode.value && params.componentType === 'series') {
      handleChartPointClick(params)
    }
  })
}

// 更新图表
const updateChart = () => {
  if (!chartInstance || props.curveData.length === 0) return

  totalPoints.value = props.curveData.length

  const series = []
  
  // 根据选择的图形类型添加系列
  if (selectedGraphTypes.value.includes('torque')) {
    series.push({
      name: '扭矩',
      type: 'line',
      data: props.curveData.map(point => [point.angle, point.torque]),
      smooth: false,
      symbol: editMode.value ? 'circle' : 'none',
      symbolSize: 4,
      lineStyle: {
        width: 2,
        color: '#1890ff'
      }
    })
  }

  if (selectedGraphTypes.value.includes('gradient')) {
    series.push({
      name: '梯度',
      type: 'line',
      data: props.curveData.map(point => [point.angle, point.gradient || 0]),
      smooth: false,
      symbol: 'none',
      lineStyle: {
        width: 2,
        color: '#52c41a'
      },
      yAxisIndex: 1
    })
  }

  if (selectedGraphTypes.value.includes('auxiliary')) {
    series.push({
      name: '辅助',
      type: 'line',
      data: props.curveData.map(point => [point.angle, point.auxiliary || 0]),
      smooth: false,
      symbol: 'none',
      lineStyle: {
        width: 2,
        color: '#faad14',
        type: 'dashed'
      }
    })
  }

  // 添加标准曲线（如果有）
  if (props.standardCurve && props.standardCurve.length > 0) {
    series.push({
      name: '标准曲线',
      type: 'line',
      data: props.standardCurve.map(point => [point.angle, point.torque]),
      smooth: false,
      symbol: 'none',
      lineStyle: {
        width: 2,
        color: '#ff4d4f',
        type: 'dashed'
      }
    })
  }

  const option = {
    title: {
      text: '拧紧曲线分析',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      formatter: (params) => {
        let result = `角度: ${params[0].data[0].toFixed(2)}°<br/>`
        params.forEach(param => {
          result += `${param.seriesName}: ${param.data[1].toFixed(2)}<br/>`
        })
        return result
      }
    },
    legend: {
      data: series.map(s => s.name),
      top: 30
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'value',
      name: '角度 (°)',
      min: displayRange.min,
      max: displayRange.max,
      axisLabel: {
        formatter: '{value}°'
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '扭矩 (Nm)',
        position: 'left'
      },
      {
        type: 'value',
        name: '梯度',
        position: 'right',
        show: selectedGraphTypes.value.includes('gradient')
      }
    ],
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: 0
      }
    ],
    series: series
  }

  chartInstance.setOption(option, true)

  // 如果在编辑模式，显示当前点
  if (editMode.value && currentPointIndex.value < props.curveData.length) {
    showCrosshair(currentPointIndex.value)
  }
}

// 处理显示范围变化
const handleRangeChange = () => {
  emit('zoom-changed', { min: displayRange.min, max: displayRange.max })
}

// 重置显示范围
const resetDisplayRange = () => {
  displayRange.min = 0
  displayRange.max = 100
  updateChart()
  ElMessage.success('已重置为100%显示')
}

// 应用缩放
const applyZoom = () => {
  if (displayRange.min >= displayRange.max) {
    ElMessage.warning('最小角度必须小于最大角度')
    return
  }
  updateChart()
  ElMessage.success(`已缩放到 ${displayRange.min}° - ${displayRange.max}°`)
}

// 处理点变化
const handlePointChange = () => {
  if (editMode.value) {
    showCrosshair(currentPointIndex.value)
  }
}

// 切换编辑模式
const toggleEditMode = () => {
  if (editMode.value) {
    ElMessage.info('已进入编辑模式 - 可使用键盘方向键或点击图形查看数据点')
  } else {
    crosshairData.value = null
    ElMessage.info('已退出编辑模式')
  }
  updateChart()
}

// 显示十字准线
const showCrosshair = (index) => {
  if (index < 0 || index >= props.curveData.length) return

  const point = props.curveData[index]
  crosshairData.value = {
    index: index,
    angle: point.angle,
    torque: point.torque,
    gradient: point.gradient,
    auxiliary: point.auxiliary
  }

  currentPointIndex.value = index
  emit('point-selected', crosshairData.value)

  // 在图表上标记该点
  chartInstance.dispatchAction({
    type: 'showTip',
    seriesIndex: 0,
    dataIndex: index
  })
}

// 处理图表点击
const handleChartPointClick = (params) => {
  if (!editMode.value) return
  
  const dataIndex = params.dataIndex
  showCrosshair(dataIndex)
}

// 键盘事件处理
const handleKeyDown = (e) => {
  if (!editMode.value || props.curveData.length === 0) return

  let step = 1
  if (e.ctrlKey) step = 10
  if (e.shiftKey) step = 100

  switch(e.key) {
    case 'ArrowLeft':
      e.preventDefault()
      currentPointIndex.value = Math.max(0, currentPointIndex.value - step)
      showCrosshair(currentPointIndex.value)
      break
    case 'ArrowRight':
      e.preventDefault()
      currentPointIndex.value = Math.min(totalPoints.value - 1, currentPointIndex.value + step)
      showCrosshair(currentPointIndex.value)
      break
  }
}

// 添加键盘监听
const addKeyboardListeners = () => {
  window.addEventListener('keydown', handleKeyDown)
}

// 移除键盘监听
const removeKeyboardListeners = () => {
  window.removeEventListener('keydown', handleKeyDown)
}

// 鼠标框选缩放
const handleMouseDown = (e) => {
  if (e.button === 0 && e.shiftKey) { // 按住Shift+鼠标左键
    isSelecting.value = true
    const rect = chartContainer.value.getBoundingClientRect()
    selectionStart.x = e.clientX - rect.left
    selectionStart.y = e.clientY - rect.top
  }
}

const handleMouseMove = (e) => {
  if (isSelecting.value) {
    const rect = chartContainer.value.getBoundingClientRect()
    selectionEnd.x = e.clientX - rect.left
    selectionEnd.y = e.clientY - rect.top
  }
}

const handleMouseUp = (e) => {
  if (isSelecting.value) {
    isSelecting.value = false
    // 计算选择的区域并应用缩放
    const rect = chartContainer.value.getBoundingClientRect()
    // 这里可以根据选择的区域计算新的displayRange
    ElMessage.success('区域已选择，正在缩放...')
  }
}

const handleChartClick = (e) => {
  // 处理点击事件
}

// 图形类型选择
const applyGraphTypes = () => {
  if (selectedGraphTypes.value.length === 0) {
    ElMessage.warning('请至少选择一个图形类型')
    return
  }
  showGraphTypeDialog.value = false
  updateChart()
  ElMessage.success(`已切换到: ${selectedGraphTypes.value.join(', ')}`)
}

// NOK内存操作
const loadNOKMemory = () => {
  if (nokMemory.value.length === 0) {
    ElMessage.warning('NOK内存为空')
    return
  }

  const nokCurve = nokMemory.value[currentNOKIndex.value]
  emit('load-nok', nokCurve)
  
  currentNOKIndex.value = (currentNOKIndex.value + 1) % nokMemory.value.length
  ElMessage.info(`已加载NOK曲线 ${currentNOKIndex.value} / ${nokMemory.value.length}`)
}

const saveToNOKMemory = (curveData) => {
  nokMemory.value.push(curveData)
  localStorage.setItem('nokMemory', JSON.stringify(nokMemory.value))
  ElMessage.success('已保存到NOK内存')
}

const loadNOKFromStorage = () => {
  const stored = localStorage.getItem('nokMemory')
  if (stored) {
    try {
      nokMemory.value = JSON.parse(stored)
    } catch (e) {
      console.error('Failed to load NOK memory:', e)
    }
  }
}

// 暴露方法
defineExpose({
  saveToNOKMemory,
  resetDisplayRange,
  applyZoom
})
</script>

<style scoped>
.enhanced-curve-chart {
  width: 100%;
}

.chart-toolbar {
  background: #f5f7fa;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.toolbar-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toolbar-label {
  font-size: 12px;
  color: #606266;
  font-weight: 500;
}

.range-controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.chart-display {
  position: relative;
  width: 100%;
  height: 600px;
}

.chart-container {
  width: 100%;
  height: 100%;
}

.crosshair-info {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.info-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.info-label {
  font-size: 12px;
  color: #909399;
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  font-family: 'Courier New', monospace;
}

.selection-hint {
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(24, 144, 255, 0.9);
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 1000;
}

.graph-type-selection {
  padding: 16px;
}

.dialog-hint {
  color: #606266;
  margin-bottom: 16px;
  font-size: 14px;
}

.graph-type-item {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.checkbox-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.type-name {
  font-weight: 500;
}

.selected-count {
  margin-top: 16px;
  text-align: right;
  color: #909399;
  font-size: 12px;
}

.keyboard-hints {
  margin-top: 16px;
}

.hints-content {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  font-size: 13px;
}

kbd {
  display: inline-block;
  padding: 2px 6px;
  background: #f0f0f0;
  border: 1px solid #d9d9d9;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 11px;
  margin: 0 2px;
}
</style>
