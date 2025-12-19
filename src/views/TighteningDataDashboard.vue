<template>
  <div class="tightening-data-dashboard">
    <!-- 3D粒子背景 -->
    <div class="particle-background">
      <div class="particle" v-for="i in 50" :key="i" 
           :style="getParticleStyle(i)"></div>
    </div>

    <!-- 数据流动背景 -->
    <div class="data-stream-background">
      <div class="data-line" v-for="i in 8" :key="i" 
           :style="getDataLineStyle(i)"></div>
    </div>

    <!-- 顶部工具栏 -->
    <div class="dashboard-toolbar">
      <div class="toolbar-left">
        <div class="logo-3d">
          <el-icon :size="24"><DataAnalysis /></el-icon>
        </div>
        <h1 class="title-3d">拧紧数据采集分析系统</h1>
        <el-tag :type="connectionStatusType" effect="dark" class="status-tag-3d">
          <span class="pulse-dot" v-if="connectionStatusType === 'success'"></span>
          {{ connectionStatus}}
        </el-tag>
        <el-tag v-if="isCollecting" type="success" effect="plain" class="collecting-tag-3d">
          <el-icon class="is-loading"><Loading /></el-icon>
          数据采集中
          <span class="wave-effect"></span>
        </el-tag>
      </div>
      <div class="toolbar-right">
        <el-button-group>
          <el-button @click="showWidgetSelector = true" :icon="Grid" class="btn-3d">
            添加小工具
          </el-button>
          <el-button @click="resetLayout" :icon="RefreshRight" class="btn-3d">
            重置布局
          </el-button>
          <el-button @click="saveLayout" :icon="DocumentCopy" type="primary" class="btn-3d-primary">
            保存视图
          </el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 可拖拽小工具仪表板 - 3D动画版 -->
    <div class="dashboard-grid">
      <div
        v-for="(widget, index) in dashboard.layout"
        :key="widget.i"
        class="dashboard-widget widget-3d"
        :class="{ 'widget-appear': widgetAppeared }"
        :style="{
          ...getWidgetStyle(widget),
          animationDelay: `${index * 0.1}s`
        }"
      >
        <div class="widget-container-3d">
          <!-- 3D光效背景 -->
          <div class="widget-glow"></div>
          
          <!-- 边框扫描效果 -->
          <div class="widget-scan-line"></div>
          
          <div class="widget-inner">
            <div class="widget-header-3d">
              <div class="widget-title">
                <div class="icon-3d">
                  <el-icon :size="18">
                    <component :is="getWidgetIcon(widget.type)" />
                  </el-icon>
                </div>
                <span>{{ widget.name }}</span>
              </div>
              <div class="widget-actions">
                <el-button text :icon="Setting" @click="editWidget(widget)" circle size="small" class="action-btn-3d"/>
                <el-button text :icon="RefreshRight" @click="refreshWidget(widget)" circle size="small" class="action-btn-3d"/>
                <el-button text :icon="Close" @click="removeWidget(widget.i)" circle size="small" class="action-btn-3d"/>
              </div>
            </div>
            <div class="widget-content-3d">
              <!-- 实时统计卡片 -->
              <component 
                :is="getWidgetComponent(widget.type)" 
                :widget="widget"
                :data="getWidgetData(widget.type)"
                @update="handleWidgetUpdate"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 小工具选择对话框 - 3D版 -->
    <el-dialog
      v-model="showWidgetSelector"
      title="选择小工具"
      width="900px"
      align-center
      class="widget-selector-dialog-3d"
    >
      <div class="widget-selector">
        <el-row :gutter="16">
          <el-col :span="6" v-for="widget in availableWidgets" :key="widget.type">
            <el-card 
              shadow="hover" 
              class="widget-option widget-option-3d"
              :body-style="{ padding: '16px' }"
              @click="addWidget(widget)"
            >
              <div class="widget-option-content">
                <div class="widget-option-icon-3d" :style="{ color: widget.color }">
                  <el-icon :size="40">
                    <component :is="widget.icon" />
                  </el-icon>
                  <div class="icon-ripple"></div>
                </div>
                <h4>{{ widget.name }}</h4>
                <p>{{ widget.description }}</p>
                <div class="card-glow" :style="{ background: widget.color }"></div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-dialog>

    <!-- 控制器连接对话框 -->
    <el-dialog
      v-model="showConnectionDialog"
      title="连接到控制器"
      width="600px"
    >
      <el-form :model="connectionForm" label-width="140px">
        <el-form-item label="控制器型号">
          <el-select v-model="connectionForm.controller" placeholder="选择控制器">
            <el-option label="PowerFocus 4000" value="PF4000" />
            <el-option label="PowerFocus 6000" value="PF6000" />
            <el-option label="PowerFocus 8000" value="PF8000" />
            <el-option label="PowerMACS" value="PowerMACS" />
          </el-select>
        </el-form-item>
        <el-form-item label="IP地址">
          <el-input v-model="connectionForm.ipAddress" placeholder="192.168.1.100" />
        </el-form-item>
        <el-form-item label="Protocol端口">
          <el-input-number v-model="connectionForm.port" :min="1" :max="65535" style="width: 100%;" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showConnectionDialog = false">取消</el-button>
        <el-button type="primary" @click="connectToController" :loading="connecting">连接</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useTighteningDataStore } from '../store/tighteningData'
import { ElMessage, ElNotification } from 'element-plus'
import { 
  DataAnalysis, Loading, Grid, RefreshRight, DocumentCopy, 
  Setting, Close, TrendCharts, Odometer, Warning, 
  Check, Document, Connection, List, Timer
} from '@element-plus/icons-vue'
// 简化版网格布局实现

// Widgets组件
import StatisticsWidget from '../components/widgets/StatisticsWidget.vue'
import TrendChartWidget from '../components/widgets/TrendChartWidget.vue'
import NokAnalysisWidget from '../components/widgets/NokAnalysisWidget.vue'
import CpkChartWidget from '../components/widgets/CpkChartWidget.vue'
import RealtimeResultsWidget from '../components/widgets/RealtimeResultsWidget.vue'
import AnomalyAlertsWidget from '../components/widgets/AnomalyAlertsWidget.vue'
import TraceAnalysisWidget from '../components/widgets/TraceAnalysisWidget.vue'
import ControllerEventsWidget from '../components/widgets/ControllerEventsWidget.vue'

const dataStore = useTighteningDataStore()

// Widget出现动画控制
const widgetAppeared = ref(false)

// 连接状态
const connecting = ref(false)
const showConnectionDialog = ref(false)
const connectionForm = ref({
  controller: 'PF4000',
  ipAddress: '192.168.1.100',
  port: 4545
})

const connectionStatus = computed(() => {
  const status = dataStore.connection.status
  if (status === 'connected') return '已连接'
  if (status === 'connecting') return '连接中...'
  return '未连接'
})

const connectionStatusType = computed(() => {
  const status = dataStore.connection.status
  if (status === 'connected') return 'success'
  if (status === 'connecting') return 'warning'
  return 'info'
})

const isCollecting = computed(() => dataStore.realtimeData.isRunning)

// 仪表板布局
const dashboard = ref({
  layout: [
    { i: 'stats-1', x: 0, y: 0, w: 4, h: 3, type: 'statistics', name: '实时统计', minW: 3, minH: 2 },
    { i: 'trend-1', x: 4, y: 0, w: 8, h: 4, type: 'trend', name: '拧紧趋势分析', minW: 4, minH: 3 },
    { i: 'cpk-1', x: 0, y: 3, w: 6, h: 4, type: 'cpk', name: 'Cpk过程能力分析', minW: 4, minH: 3 },
    { i: 'nok-1', x: 6, y: 3, w: 6, h: 4, type: 'nok', name: 'TOP NOK分析', minW: 3, minH: 3 },
    { i: 'realtime-1', x: 0, y: 7, w: 6, h: 4, type: 'realtime', name: '实时拧紧结果', minW: 4, minH: 3 },
    { i: 'alerts-1', x: 6, y: 7, w: 6, h: 4, type: 'alerts', name: '异常报警', minW: 3, minH: 3 },
  ],
  savedViews: []
})

// 小工具选择器
const showWidgetSelector = ref(false)
const availableWidgets = ref([
  { 
    type: 'statistics', 
    name: '实时统计', 
    description: '总数、OK率、NOK率', 
    icon: Odometer,
    color: '#667eea',
    defaultSize: { w: 4, h: 3 }
  },
  { 
    type: 'trend', 
    name: '拧紧趋势图', 
    description: '扭矩/角度趋势分析', 
    icon: TrendCharts,
    color: '#764ba2',
    defaultSize: { w: 8, h: 4 }
  },
  { 
    type: 'cpk', 
    name: 'Cpk分析', 
    description: '过程能力指数图表', 
    icon: DataAnalysis,
    color: '#f093fb',
    defaultSize: { w: 6, h: 4 }
  },
  { 
    type: 'nok', 
    name: 'NOK分析', 
    description: 'TOP NOK应用程序', 
    icon: Warning,
    color: '#f43f5e',
    defaultSize: { w: 6, h: 4 }
  },
  { 
    type: 'realtime', 
    name: '实时结果', 
    description: '最新拧紧结果列表', 
    icon: List,
    color: '#10b981',
    defaultSize: { w: 6, h: 4 }
  },
  { 
    type: 'alerts', 
    name: '异常报警', 
    description: '实时报警和通知', 
    icon: Warning,
    color: '#f59e0b',
    defaultSize: { w: 6, h: 4 }
  },
  { 
    type: 'trace', 
    name: '曲线追溯', 
    description: '拧紧轨迹对比分析', 
    icon: TrendCharts,
    color: '#3b82f6',
    defaultSize: { w: 12, h: 5 }
  },
  { 
    type: 'events', 
    name: '控制器事件', 
    description: '系统事件和日志', 
    icon: Document,
    color: '#8b5cf6',
    defaultSize: { w: 12, h: 4 }
  }
])

// 获取小工具图标
const getWidgetIcon = (type) => {
  const widget = availableWidgets.value.find(w => w.type === type)
  return widget?.icon || DataAnalysis
}

// 获取widget CSS Grid样式
const getWidgetStyle = (widget) => {
  return {
    gridColumn: `span ${widget.w}`,
    gridRow: `span ${widget.h}`
  }
}

// 获取小工具组件
const getWidgetComponent = (type) => {
  const components = {
    statistics: StatisticsWidget,
    trend: TrendChartWidget,
    nok: NokAnalysisWidget,
    cpk: CpkChartWidget,
    realtime: RealtimeResultsWidget,
    alerts: AnomalyAlertsWidget,
    trace: TraceAnalysisWidget,
    events: ControllerEventsWidget
  }
  return components[type] || 'div'
}

// 获取小工具数据
const getWidgetData = (type) => {
  switch (type) {
    case 'statistics':
      return dataStore.filteredStatistics
    case 'trend':
      return {
        results: dataStore.filteredResults.slice(0, 100),
        filters: dataStore.filters
      }
    case 'nok':
      return dataStore.topNokApplications
    case 'cpk':
      return dataStore.cpkAnalysis
    case 'realtime':
      return dataStore.realtimeData.latestResults
    case 'alerts':
      return dataStore.recentAnomalies
    case 'trace':
      return {
        curves: dataStore.tighteningCurves.slice(0, 10),
        selected: null
      }
    case 'events':
      return dataStore.recentControllerEvents
    default:
      return {}
  }
}

// 添加小工具
const addWidget = (widgetTemplate) => {
  const id = `${widgetTemplate.type}-${Date.now()}`
  const newWidget = {
    i: id,
    x: 0,
    y: 0, // 将被自动计算
    w: widgetTemplate.defaultSize.w,
    h: widgetTemplate.defaultSize.h,
    type: widgetTemplate.type,
    name: widgetTemplate.name,
    minW: widgetTemplate.defaultSize.w < 4 ? widgetTemplate.defaultSize.w : 3,
    minH: 2
  }
  
  dashboard.value.layout.push(newWidget)
  showWidgetSelector.value = false
  
  ElMessage.success(`已添加 ${widgetTemplate.name}`)
}

// 移除小工具
const removeWidget = (id) => {
  const index = dashboard.value.layout.findIndex(w => w.i === id)
  if (index >= 0) {
    dashboard.value.layout.splice(index, 1)
    ElMessage.info('已移除小工具')
  }
}

// 刷新小工具
const refreshWidget = (widget) => {
  ElMessage.success(`刷新 ${widget.name}`)
  // 触发数据重新加载
}

// 编辑小工具
const editWidget = (widget) => {
  ElMessage.info(`编辑 ${widget.name} (开发中)`)
}

// 重置布局
const resetLayout = () => {
  dashboard.value.layout = [
    { i: 'stats-1', x: 0, y: 0, w: 4, h: 3, type: 'statistics', name: '实时统计', minW: 3, minH: 2 },
    { i: 'trend-1', x: 4, y: 0, w: 8, h: 4, type: 'trend', name: '拧紧趋势分析', minW: 4, minH: 3 },
    { i: 'cpk-1', x: 0, y: 3, w: 6, h: 4, type: 'cpk', name: 'Cpk过程能力分析', minW: 4, minH: 3 },
    { i: 'nok-1', x: 6, y: 3, w: 6, h: 4, type: 'nok', name: 'TOP NOK分析', minW: 3, minH: 3 },
    { i: 'realtime-1', x: 0, y: 7, w: 6, h: 4, type: 'realtime', name: '实时拧紧结果', minW: 4, minH: 3 },
    { i: 'alerts-1', x: 6, y: 7, w: 6, h: 4, type: 'alerts', name: '异常报警', minW: 3, minH: 3 },
  ]
  ElMessage.success('布局已重置')
}

// 保存布局
const saveLayout = () => {
  localStorage.setItem('tighteningDashboard', JSON.stringify(dashboard.value.layout))
  ElMessage.success('视图已保存')
}

// 加载布局
const loadLayout = () => {
  const saved = localStorage.getItem('tighteningDashboard')
  if (saved) {
    try {
      dashboard.value.layout = JSON.parse(saved)
    } catch (e) {
      console.error('加载布局失败:', e)
    }
  }
}

// 连接到控制器
const connectToController = async () => {
  connecting.value = true
  try {
    const result = await dataStore.connectToController(
      connectionForm.value.ipAddress,
      connectionForm.value.controller
    )
    ElNotification.success({
      title: '连接成功',
      message: result.message,
      duration: 3000
    })
    showConnectionDialog.value = false
    
    // 开始数据采集
    dataStore.startDataCollection()
  } catch (error) {
    ElNotification.error({
      title: '连接失败',
      message: error.message,
      duration: 5000
    })
  } finally {
    connecting.value = false
  }
}

// 小工具更新处理
const handleWidgetUpdate = (payload) => {
  console.log('Widget update:', payload)
}

// 粒子样式生成 - 使用computed确保响应式系统正确处理
const particleStyles = computed(() => {
  const styles = []
  for (let i = 1; i <= 50; i++) {
    const seed = i * 9301 + 49297
    const rand1 = (seed % 233280) / 233280
    const rand2 = ((seed * 2) % 233280) / 233280
    const rand3 = ((seed * 3) % 233280) / 233280
    const rand4 = ((seed * 5) % 233280) / 233280
    const rand5 = ((seed * 7) % 233280) / 233280
    
    const size = rand1 * 4 + 2
    const duration = rand2 * 20 + 10
    const delay = rand3 * 5
    const left = rand4 * 100
    const opacity = rand5 * 0.5 + 0.3
    
    styles.push({
      width: `${size}px`,
      height: `${size}px`,
      left: `${left}%`,
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`,
      opacity: opacity
    })
  }
  return styles
})

const getParticleStyle = (index) => {
  return particleStyles.value[index - 1] || {}
}

// 数据流线样式生成
const dataLineStyles = computed(() => {
  const styles = []
  for (let i = 1; i <= 8; i++) {
    const seed = i * 7919 + 65521
    const rand1 = (seed % 233280) / 233280
    const rand2 = ((seed * 2) % 233280) / 233280
    const rand3 = ((seed * 3) % 233280) / 233280
    
    const height = rand1 * 2 + 1
    const duration = rand2 * 3 + 2
    const delay = rand3 * 2
    
    styles.push({
      height: `${height}px`,
      top: `${i * 12}%`,
      animationDuration: `${duration}s`,
      animationDelay: `${delay}s`
    })
  }
  return styles
})

const getDataLineStyle = (index) => {
  return dataLineStyles.value[index - 1] || {}
}

// 初始化
onMounted(() => {
  loadLayout()
  dataStore.loadTighteningResults()
  
  // Widget出现动画延迟
  setTimeout(() => {
    widgetAppeared.value = true
  }, 100)
  
  // 自动连接提示
  if (dataStore.connection.status === 'disconnected') {
    setTimeout(() => {
      showConnectionDialog.value = true
    }, 500)
  }
})

// 监听数据变化
watch(() => dataStore.realtimeData.latestResults.length, (newVal, oldVal) => {
  if (newVal > oldVal) {
    // 新数据到达，触发通知
    const latest = dataStore.realtimeData.latestResults[0]
    if (latest && latest.result === 'NOK') {
      ElNotification.warning({
        title: 'NOK报警',
        message: `Pset ${latest.psetId}: ${latest.detailedStatus}`,
        duration: 2000,
        position: 'bottom-right'
      })
    }
  }
})
</script>

<style scoped lang="scss">
.tightening-data-dashboard {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a2e 0%, #0f0f1e 50%, #16213e 100%);
  overflow: hidden;
  position: relative;
  perspective: 1000px;
}

// ======= 3D粒子背景 =======
.particle-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;

  .particle {
    position: absolute;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 50%;
    animation: float-particle linear infinite;
    box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);
  }
}

@keyframes float-particle {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

// ======= 数据流动背景 =======
.data-stream-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 2;

  .data-line {
    position: absolute;
    left: -100%;
    width: 100%;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(102, 126, 234, 0.3) 50%, 
      transparent 100%);
    animation: flow-data linear infinite;
    box-shadow: 0 0 20px rgba(102, 126, 234, 0.5);
  }
}

@keyframes flow-data {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

// ======= 顶部工具栏 3D效果 =======
.dashboard-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  box-shadow: 
    0 8px 32px 0 rgba(31, 38, 135, 0.37),
    inset 0 1px 1px rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 100;
  position: relative;
  transform-style: preserve-3d;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      transparent 0%,
      #667eea 50%,
      transparent 100%);
    animation: scan-line 3s linear infinite;
  }

  .toolbar-left {
    display: flex;
    align-items: center;
    gap: 16px;

    .logo-3d {
      color: #667eea;
      animation: rotate-3d 6s linear infinite;
      transform-style: preserve-3d;
      filter: drop-shadow(0 0 10px rgba(102, 126, 234, 0.8));
    }

    .title-3d {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      background: linear-gradient(135deg, #667eea, #f093fb, #667eea);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradient-shift 3s ease infinite;
      text-shadow: 0 0 30px rgba(102, 126, 234, 0.5);
    }

    .status-tag-3d {
      position: relative;
      transform: translateZ(10px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);

      .pulse-dot {
        position: absolute;
        left: 8px;
        top: 50%;
        transform: translateY(-50%);
        width: 8px;
        height: 8px;
        background: #67c23a;
        border-radius: 50%;
        animation: pulse-dot 2s ease infinite;
      }
    }

    .collecting-tag-3d {
      position: relative;
      overflow: hidden;

      .wave-effect {
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, 
          transparent 0%,
          rgba(255, 255, 255, 0.3) 50%,
          transparent 100%);
        animation: wave-move 2s linear infinite;
      }
    }
  }

  .toolbar-right {
    .btn-3d {
      position: relative;
      transform-style: preserve-3d;
      transition: all 0.3s ease;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      }

      &:hover {
        transform: translateY(-2px) translateZ(10px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);

        &::before {
          opacity: 1;
        }
      }

      &:active {
        transform: translateY(0) translateZ(5px);
      }
    }

    .btn-3d-primary {
      background: linear-gradient(135deg, #667eea, #764ba2);
      border: none;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      animation: pulse-btn 2s ease infinite;

      &:hover {
        background: linear-gradient(135deg, #764ba2, #667eea);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
      }
    }
  }
}

@keyframes rotate-3d {
  0%, 100% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(360deg);
  }
}

@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes pulse-dot {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(103, 194, 58, 0.7);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(103, 194, 58, 0);
  }
}

@keyframes wave-move {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

@keyframes pulse-btn {
  0%, 100% {
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }
  50% {
    box-shadow: 0 4px 25px rgba(102, 126, 234, 0.8);
  }
}

@keyframes scan-line {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

// ======= 仪表板网格 3D布局 =======
.dashboard-grid {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  background: transparent;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: 80px;
  gap: 12px;
  position: relative;
  z-index: 10;
  perspective: 1500px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 4px;
    box-shadow: 0 0 10px rgba(102, 126, 234, 0.5);

    &:hover {
      background: linear-gradient(135deg, #764ba2, #667eea);
    }
  }
}

// ======= 小工具 3D卡片 =======
.dashboard-widget {
  position: relative;
  transform-style: preserve-3d;

  &.widget-3d {
    opacity: 0;
    transform: translateY(50px) rotateX(-15deg);
    transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);

    &.widget-appear {
      opacity: 1;
      transform: translateY(0) rotateX(0deg);
    }
  }

  .widget-container-3d {
    height: 100%;
    position: relative;
    transform-style: preserve-3d;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

    // 3D光效背景
    .widget-glow {
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(135deg, #667eea, #764ba2, #f093fb);
      border-radius: 14px;
      opacity: 0;
      filter: blur(10px);
      transition: opacity 0.4s ease;
      z-index: -1;
    }

    // 边框扫描线
    .widget-scan-line {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg,
        transparent 0%,
        rgba(102, 126, 234, 0.8) 50%,
        transparent 100%);
      animation: scan-widget 3s linear infinite;
      z-index: 10;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover {
      transform: translateY(-8px) translateZ(20px) rotateX(5deg);
      
      .widget-glow {
        opacity: 0.6;
      }

      .widget-scan-line {
        opacity: 1;
      }
    }

    .widget-inner {
      height: 100%;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.2),
        inset 0 1px 2px rgba(255, 255, 255, 0.5),
        0 0 0 1px rgba(255, 255, 255, 0.1);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
      transform-style: preserve-3d;
    }

    .widget-header-3d {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: linear-gradient(135deg, 
        rgba(102, 126, 234, 0.95), 
        rgba(118, 75, 162, 0.95));
      color: white;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(45deg,
          transparent 30%,
          rgba(255, 255, 255, 0.1) 50%,
          transparent 70%);
        animation: shine 3s linear infinite;
      }

      .widget-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        font-size: 14px;
        position: relative;
        z-index: 1;

        .icon-3d {
          animation: icon-float 3s ease-in-out infinite;
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }
      }

      .widget-actions {
        display: flex;
        gap: 4px;
        position: relative;
        z-index: 1;

        .action-btn-3d {
          color: white;
          transition: all 0.3s ease;
          transform-style: preserve-3d;

          &:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: translateZ(5px) scale(1.1);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          }

          &:active {
            transform: translateZ(2px) scale(1.05);
          }
        }
      }
    }

    .widget-content-3d {
      flex: 1;
      padding: 16px;
      overflow: auto;
      position: relative;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 40px;
        background: linear-gradient(180deg, 
          rgba(102, 126, 234, 0.05) 0%,
          transparent 100%);
        pointer-events: none;
      }
    }
  }
}

@keyframes scan-widget {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

@keyframes shine {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes icon-float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-3px);
  }
}

// ======= 小工具选择器 3D对话框 =======
.widget-selector-dialog-3d {
  :deep(.el-dialog) {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  :deep(.el-dialog__header) {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 20px;
    border-bottom: none;
  }

  :deep(.el-dialog__title) {
    color: white;
    font-weight: 600;
  }

  :deep(.el-dialog__headerbtn .el-dialog__close) {
    color: white;
    
    &:hover {
      color: rgba(255, 255, 255, 0.8);
    }
  }
}

.widget-selector {
  .widget-option-3d {
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    margin-bottom: 16px;
    position: relative;
    overflow: hidden;
    transform-style: preserve-3d;
    border: 2px solid transparent;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), transparent);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover {
      transform: translateY(-8px) rotateX(10deg) scale(1.05);
      box-shadow: 
        0 15px 35px rgba(0, 0, 0, 0.2),
        0 0 20px rgba(102, 126, 234, 0.3);
      border-color: rgba(102, 126, 234, 0.5);

      &::before {
        opacity: 1;
      }

      .widget-option-icon-3d {
        transform: scale(1.2) rotateY(360deg);
        
        .icon-ripple {
          animation: ripple-expand 1s ease-out;
        }
      }

      .card-glow {
        opacity: 0.3;
        transform: scale(1.5);
      }
    }

    &:active {
      transform: translateY(-4px) rotateX(5deg) scale(1.02);
    }

    .widget-option-content {
      text-align: center;
      position: relative;
      z-index: 1;

      .widget-option-icon-3d {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));

        .icon-ripple {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 2px solid currentColor;
          opacity: 0;
        }
      }

      h4 {
        margin: 12px 0 8px;
        font-size: 14px;
        color: #1a1a1a;
        font-weight: 600;
        position: relative;
        z-index: 1;
      }

      p {
        margin: 0;
        font-size: 12px;
        color: #666;
        position: relative;
        z-index: 1;
      }

      .card-glow {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80px;
        height: 80px;
        border-radius: 50%;
        opacity: 0;
        filter: blur(30px);
        transition: all 0.6s ease;
        pointer-events: none;
      }
    }
  }
}

@keyframes ripple-expand {
  0% {
    width: 60px;
    height: 60px;
    opacity: 0.8;
  }
  100% {
    width: 120px;
    height: 120px;
    opacity: 0;
  }
}

// ======= 响应式优化 =======
@media (max-width: 1600px) {
  .dashboard-grid {
    grid-template-columns: repeat(8, 1fr);
  }
}

@media (max-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .dashboard-toolbar {
    flex-direction: column;
    gap: 12px;
    
    .toolbar-left, .toolbar-right {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>
