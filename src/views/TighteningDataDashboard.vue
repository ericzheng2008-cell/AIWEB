<template>
  <div class="tightening-data-dashboard">
    <!-- 顶部工具栏 -->
    <div class="dashboard-toolbar">
      <div class="toolbar-left">
        <el-icon :size="24" color="#667eea"><DataAnalysis /></el-icon>
        <h1>拧紧数据采集分析系统</h1>
        <el-tag :type="connectionStatusType" effect="dark">
          {{ connectionStatus}}
        </el-tag>
        <el-tag v-if="isCollecting" type="success" effect="plain">
          <el-icon class="is-loading"><Loading /></el-icon>
          数据采集中
        </el-tag>
      </div>
      <div class="toolbar-right">
        <el-button-group>
          <el-button @click="showWidgetSelector = true" :icon="Grid">
            添加小工具
          </el-button>
          <el-button @click="resetLayout" :icon="RefreshRight">
            重置布局
          </el-button>
          <el-button @click="saveLayout" :icon="DocumentCopy" type="primary">
            保存视图
          </el-button>
        </el-button-group>
      </div>
    </div>

    <!-- 可拖拽小工具仪表板 -->
    <div class="dashboard-grid">
      <div
        v-for="widget in dashboard.layout"
        :key="widget.i"
        class="dashboard-widget"
        :style="getWidgetStyle(widget)"
      >
        <div class="widget-container">
          <div class="widget-header">
            <div class="widget-title">
              <el-icon :size="18">
                <component :is="getWidgetIcon(widget.type)" />
              </el-icon>
              <span>{{ widget.name }}</span>
            </div>
            <div class="widget-actions">
              <el-button text :icon="Setting" @click="editWidget(widget)" circle size="small"/>
              <el-button text :icon="RefreshRight" @click="refreshWidget(widget)" circle size="small"/>
              <el-button text :icon="Close" @click="removeWidget(widget.i)" circle size="small"/>
            </div>
          </div>
          <div class="widget-content">
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

    <!-- 小工具选择对话框 -->
    <el-dialog
      v-model="showWidgetSelector"
      title="选择小工具"
      width="900px"
      align-center
    >
      <div class="widget-selector">
        <el-row :gutter="16">
          <el-col :span="6" v-for="widget in availableWidgets" :key="widget.type">
            <el-card 
              shadow="hover" 
              class="widget-option"
              :body-style="{ padding: '16px' }"
              @click="addWidget(widget)"
            >
              <div class="widget-option-content">
                <el-icon :size="40" :color="widget.color">
                  <component :is="widget.icon" />
                </el-icon>
                <h4>{{ widget.name }}</h4>
                <p>{{ widget.description }}</p>
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

// 初始化
onMounted(() => {
  loadLayout()
  dataStore.loadTighteningResults()
  
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

.dashboard-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;

  .toolbar-left {
    display: flex;
    align-items: center;
    gap: 16px;

    h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
    }
  }
}

.dashboard-grid {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  background: transparent;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: 80px;
  gap: 12px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;

    &:hover {
      background: rgba(255, 255, 255, 0.4);
    }
  }
}

.dashboard-widget {
  .widget-container {
    height: 100%;
    background: rgba(255, 255, 255, 0.98);
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
      transform: translateY(-2px);
    }
  }

  .widget-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);

    .widget-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 14px;
    }

    .widget-actions {
      display: flex;
      gap: 4px;

      .el-button {
        color: white;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      }
    }
  }

  .widget-content {
    flex: 1;
    padding: 16px;
    overflow: auto;
  }
}

.widget-selector {
  .widget-option {
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 16px;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }

    .widget-option-content {
      text-align: center;

      h4 {
        margin: 12px 0 8px;
        font-size: 14px;
        color: #1a1a1a;
      }

      p {
        margin: 0;
        font-size: 12px;
        color: #666;
      }
    }
  }
}
</style>
