<template>
  <div class="equipment-dashboard">
    <Header />
    
    <div class="dashboard-container">
      <!-- 顶部标题 -->
      <div class="dashboard-header">
        <div class="header-left">
          <h1 class="dashboard-title">
            <el-icon><Monitor /></el-icon>
            设备全生命周期数字监控驾驶舱
          </h1>
          <p class="dashboard-subtitle">实时监控 · 智能分析 · 全局掌控</p>
        </div>
        <div class="header-right">
          <div class="user-role-selector">
            <el-segmented v-model="currentRole" :options="roleOptions" size="large">
              <template #default="{ item }">
                <div class="role-option">
                  <el-icon><component :is="item.icon" /></el-icon>
                  <span>{{ item.label }}</span>
                </div>
              </template>
            </el-segmented>
          </div>
          <div class="real-time-indicator">
            <span class="indicator-dot"></span>
            <span>实时更新</span>
          </div>
        </div>
      </div>

      <!-- 核心KPI看板 -->
      <div class="kpi-section">
        <div class="kpi-card kpi-primary">
          <div class="kpi-icon">
            <el-icon :size="48"><DataAnalysis /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ dashboardData.totalDevices }}</div>
            <div class="kpi-label">设备总数</div>
            <div class="kpi-trend up">
              <el-icon><CaretTop /></el-icon>
              <span>+5%</span>
            </div>
          </div>
        </div>

        <div class="kpi-card kpi-success">
          <div class="kpi-icon">
            <el-icon :size="48"><CircleCheck /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ dashboardData.onlineDevices }}</div>
            <div class="kpi-label">在线设备</div>
            <div class="kpi-trend up">
              <el-icon><CaretTop /></el-icon>
              <span>{{ dashboardData.onlineRate }}%</span>
            </div>
          </div>
        </div>

        <div class="kpi-card kpi-warning">
          <div class="kpi-icon">
            <el-icon :size="48"><Warning /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ dashboardData.maintenanceCount }}</div>
            <div class="kpi-label">维护中</div>
            <div class="kpi-trend">
              <span>正常</span>
            </div>
          </div>
        </div>

        <div class="kpi-card kpi-danger">
          <div class="kpi-icon">
            <el-icon :size="48"><RemoveFilled /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ dashboardData.faultCount }}</div>
            <div class="kpi-label">故障设备</div>
            <div class="kpi-trend down" v-if="dashboardData.faultCount > 0">
              <el-icon><CaretBottom /></el-icon>
              <span>需关注</span>
            </div>
          </div>
        </div>

        <div class="kpi-card kpi-info">
          <div class="kpi-icon">
            <el-icon :size="48"><Document /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ dashboardData.workOrderCount }}</div>
            <div class="kpi-label">待处理工单</div>
            <div class="kpi-trend">
              <span>处理中</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 主体内容区 -->
      <el-row :gutter="20" class="main-content">
        <!-- 左侧：设备状态实时监控 -->
        <el-col :span="14">
          <div class="dashboard-card device-monitor-card">
            <div class="card-header">
              <h3>
                <el-icon><Monitor /></el-icon>
                设备状态实时监控
              </h3>
              <el-button type="primary" link @click="refreshData">
                <el-icon><Refresh /></el-icon>
                刷新
              </el-button>
            </div>
            <div class="device-grid">
              <div 
                v-for="device in filteredDevices" 
                :key="device.id"
                class="device-item"
                :class="`device-${device.status}`"
                @click="viewDeviceDetail(device)"
              >
                <div class="device-status-badge">
                  <el-icon>
                    <CircleCheck v-if="device.status === 'online'" />
                    <Warning v-else-if="device.status === 'maintenance'" />
                    <RemoveFilled v-else-if="device.status === 'fault'" />
                    <Close v-else />
                  </el-icon>
                </div>
                <div class="device-info">
                  <div class="device-name">{{ device.name }}</div>
                  <div class="device-model">{{ device.model }}</div>
                  <div class="device-location">{{ device.location }}</div>
                </div>
                <div class="device-metrics">
                  <div class="metric-item">
                    <span class="metric-label">健康度</span>
                    <span class="metric-value">{{ device.health }}%</span>
                  </div>
                  <div class="metric-item">
                    <span class="metric-label">运行时长</span>
                    <span class="metric-value">{{ device.runTime }}h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 维护状态流程图 -->
          <div class="dashboard-card maintenance-flow-card">
            <div class="card-header">
              <h3>
                <el-icon><Operation /></el-icon>
                设备维护状态流程
              </h3>
            </div>
            <div class="maintenance-flow">
              <div 
                v-for="(stage, index) in maintenanceStages" 
                :key="index"
                class="flow-stage"
                :class="{ 'active': stage.count > 0 }"
              >
                <div class="stage-icon">
                  <el-icon :size="32">
                    <component :is="stage.icon" />
                  </el-icon>
                </div>
                <div class="stage-info">
                  <div class="stage-name">{{ stage.name }}</div>
                  <div class="stage-count">{{ stage.count }}台</div>
                </div>
                <div class="stage-arrow" v-if="index < maintenanceStages.length - 1">
                  <el-icon><Right /></el-icon>
                </div>
              </div>
            </div>
          </div>
        </el-col>

        <!-- 右侧：关键信息卡片 -->
        <el-col :span="10">
          <!-- 零配件订货状态 -->
          <div class="dashboard-card spare-parts-card">
            <div class="card-header">
              <h3>
                <el-icon><Box /></el-icon>
                零配件订货流程状态
              </h3>
            </div>
            <div class="spare-parts-list">
              <div 
                v-for="order in sparePartsOrders" 
                :key="order.id"
                class="spare-part-item"
              >
                <div class="part-header">
                  <span class="part-name">{{ order.partName }}</span>
                  <el-tag :type="getOrderStatusType(order.status)">{{ order.status }}</el-tag>
                </div>
                <div class="part-progress">
                  <el-progress 
                    :percentage="order.progress" 
                    :color="getProgressColor(order.progress)"
                    :stroke-width="8"
                  />
                </div>
                <div class="part-info">
                  <span class="part-time">预计到货：{{ order.estimatedDate }}</span>
                  <span class="part-supplier">供应商：{{ order.supplier }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 待处理事项 -->
          <div class="dashboard-card todo-card">
            <div class="card-header">
              <h3>
                <el-icon><BellFilled /></el-icon>
                待处理事项 <el-badge :value="todoList.length" class="item-badge" />
              </h3>
            </div>
            <div class="todo-list">
              <div 
                v-for="todo in todoList" 
                :key="todo.id"
                class="todo-item"
                :class="`priority-${todo.priority}`"
              >
                <el-icon class="todo-icon"><InfoFilled /></el-icon>
                <div class="todo-content">
                  <div class="todo-title">{{ todo.title }}</div>
                  <div class="todo-time">{{ todo.time }}</div>
                </div>
                <el-button type="primary" size="small" @click="handleTodo(todo)">处理</el-button>
              </div>
            </div>
          </div>

          <!-- 联系人快速通讯 -->
          <div class="dashboard-card contact-card">
            <div class="card-header">
              <h3>
                <el-icon><Phone /></el-icon>
                快速联系
              </h3>
            </div>
            <div class="contact-list">
              <div 
                v-for="contact in filteredContacts" 
                :key="contact.id"
                class="contact-item"
              >
                <el-avatar :size="40" :icon="User">{{ contact.name.charAt(0) }}</el-avatar>
                <div class="contact-info">
                  <div class="contact-name">{{ contact.name }}</div>
                  <div class="contact-role">{{ contact.role }} - {{ contact.department }}</div>
                  <div class="contact-phone">{{ contact.phone }}</div>
                </div>
                <el-button type="primary" circle @click="callContact(contact)">
                  <el-icon><Phone /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 设备详情弹窗 -->
      <el-dialog v-model="deviceDetailVisible" title="设备详细信息" width="900px">
        <div v-if="selectedDevice" class="device-detail-content">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="设备名称">{{ selectedDevice.name }}</el-descriptions-item>
            <el-descriptions-item label="设备型号">{{ selectedDevice.model }}</el-descriptions-item>
            <el-descriptions-item label="设备位置">{{ selectedDevice.location }}</el-descriptions-item>
            <el-descriptions-item label="当前状态">
              <el-tag :type="getDeviceStatusType(selectedDevice.status)">
                {{ getDeviceStatusText(selectedDevice.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="健康度">
              <el-progress :percentage="selectedDevice.health" :stroke-width="10" />
            </el-descriptions-item>
            <el-descriptions-item label="运行时长">{{ selectedDevice.runTime }}小时</el-descriptions-item>
            <el-descriptions-item label="负责部门">{{ selectedDevice.department }}</el-descriptions-item>
            <el-descriptions-item label="管理人员">{{ selectedDevice.manager }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ selectedDevice.managerPhone }}</el-descriptions-item>
            <el-descriptions-item label="下次保养日期">{{ selectedDevice.nextMaintenance }}</el-descriptions-item>
          </el-descriptions>

          <div class="detail-actions">
            <el-button type="primary" @click="goToEquipmentLifecycle">查看完整生命周期</el-button>
            <el-button type="warning" @click="createWorkOrder">创建工单</el-button>
          </div>
        </div>
      </el-dialog>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Monitor, DataAnalysis, CircleCheck, Warning, RemoveFilled, Close,
  CaretTop, CaretBottom, Document, Refresh, Operation, Right,
  Box, BellFilled, InfoFilled, Phone, User
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

const router = useRouter()

// 角色选择
const currentRole = ref('manager')
const roleOptions = [
  { label: '设备管理人员', value: 'manager', icon: 'User' },
  { label: '设备使用人员', value: 'operator', icon: 'UserFilled' },
  { label: '供应商服务人员', value: 'supplier', icon: 'Service' }
]

// 仪表板数据
const dashboardData = ref({
  totalDevices: 28,
  onlineDevices: 24,
  onlineRate: 85.7,
  maintenanceCount: 2,
  faultCount: 2,
  workOrderCount: 3
})

// 设备列表
const devices = ref([
  { id: 'DEV-001', name: '发动机装配工位-1号扳手', model: 'ETBP45-10', location: '车间A-工位01', status: 'online', health: 98, runTime: 8524, department: '生产一部', manager: '王经理', managerPhone: '138-8888-1001', nextMaintenance: '2025-12-20' },
  { id: 'DEV-002', name: '车轮装配工位-扳手', model: 'W7150', location: '车间B-工位12', status: 'online', health: 95, runTime: 7850, department: '生产二部', manager: '陈主任', managerPhone: '138-8888-2012', nextMaintenance: '2025-12-18' },
  { id: 'DEV-003', name: '电池包装配-扳手组', model: 'GDS18V-200C', location: '车间C-工位05', status: 'maintenance', health: 82, runTime: 6320, department: '生产三部', manager: '刘主管', managerPhone: '138-8888-3005', nextMaintenance: '2025-12-15' },
  { id: 'DEV-004', name: '底盘装配工位-扳手', model: 'ETBP30-80', location: '车间A-工位15', status: 'fault', health: 45, runTime: 5640, department: '生产一部', manager: '王经理', managerPhone: '138-8888-1001', nextMaintenance: '立即维修' },
  { id: 'DEV-005', name: '变速箱装配-扳手', model: 'ETBE40-180', location: '车间A-工位22', status: 'online', health: 96, runTime: 7230, department: '生产一部', manager: '王经理', managerPhone: '138-8888-1001', nextMaintenance: '2025-12-19' },
  { id: 'DEV-006', name: '门盖装配工位-扳手', model: 'ETBP12-50', location: '车间A-工位08', status: 'maintenance', health: 88, runTime: 9820, department: '生产一部', manager: '王经理', managerPhone: '138-8888-1008', nextMaintenance: '2025-12-15' },
  { id: 'DEV-007', name: '前保险杠装配-扳手', model: 'W7250', location: '车间B-工位18', status: 'online', health: 94, runTime: 6890, department: '生产二部', manager: '陈主任', managerPhone: '138-8888-2012', nextMaintenance: '2025-12-22' },
  { id: 'DEV-008', name: '座椅装配-扳手组', model: 'ETBP25-60', location: '车间C-工位12', status: 'online', health: 92, runTime: 7456, department: '生产三部', manager: '刘主管', managerPhone: '138-8888-3005', nextMaintenance: '2025-12-21' }
])

// 维护阶段
const maintenanceStages = ref([
  { name: '待保养', icon: 'Clock', count: 3 },
  { name: '保养中', icon: 'Tools', count: 2 },
  { name: '待验收', icon: 'Document', count: 1 },
  { name: '已完成', icon: 'CircleCheck', count: 18 }
])

// 零配件订单
const sparePartsOrders = ref([
  { id: 'SP-001', partName: '扭矩传感器', status: '已下单', progress: 30, estimatedDate: '2025-12-18', supplier: '博世' },
  { id: 'SP-002', partName: '电池模组', status: '运输中', progress: 70, estimatedDate: '2025-12-15', supplier: 'Atlas' },
  { id: 'SP-003', partName: '润滑油套件', status: '待发货', progress: 15, estimatedDate: '2025-12-20', supplier: '美孚' },
  { id: 'SP-004', partName: '气压调节器', status: '运输中', progress: 85, estimatedDate: '2025-12-14', supplier: 'Ingersoll Rand' }
])

// 待办事项
const todoList = ref([
  { id: 1, title: 'DEV-004 电池故障需紧急处理', time: '2小时前', priority: 'high' },
  { id: 2, title: 'DEV-003 温度异常需检查', time: '4小时前', priority: 'medium' },
  { id: 3, title: 'DEV-006 定期保养待验收', time: '1天前', priority: 'low' }
])

// 联系人列表
const contacts = ref([
  { id: 1, name: '王经理', role: '设备管理', department: '生产一部', phone: '138-8888-1001', type: 'manager' },
  { id: 2, name: '陈主任', role: '设备管理', department: '生产二部', phone: '138-8888-2012', type: 'manager' },
  { id: 3, name: '刘主管', role: '设备管理', department: '生产三部', phone: '138-8888-3005', type: 'manager' },
  { id: 4, name: '李工', role: '维修工程师', department: '维修组', phone: '139-7777-2001', type: 'repair' },
  { id: 5, name: '张工', role: '维修工程师', department: '维修组', phone: '139-7777-2002', type: 'repair' },
  { id: 6, name: '赵工', role: '博世服务工程师', department: '技术支持', phone: '400-820-2345', type: 'supplier' },
  { id: 7, name: '孙工', role: 'Atlas服务工程师', department: '技术支持', phone: '400-820-6789', type: 'supplier' }
])

// 设备详情
const deviceDetailVisible = ref(false)
const selectedDevice = ref(null)

// 根据角色过滤设备
const filteredDevices = computed(() => {
  return devices.value.slice(0, 8) // 显示前8个设备
})

// 根据角色过滤联系人
const filteredContacts = computed(() => {
  if (currentRole.value === 'manager') {
    return contacts.value.filter(c => c.type === 'repair' || c.type === 'supplier').slice(0, 4)
  } else if (currentRole.value === 'operator') {
    return contacts.value.filter(c => c.type === 'manager' || c.type === 'repair').slice(0, 4)
  } else {
    return contacts.value.filter(c => c.type === 'manager').slice(0, 4)
  }
})

// 刷新数据
const refreshData = () => {
  ElMessage.success('数据已刷新')
}

// 查看设备详情
const viewDeviceDetail = (device) => {
  selectedDevice.value = device
  deviceDetailVisible.value = true
}

// 处理待办事项
const handleTodo = (todo) => {
  router.push('/fault-tracking')
}

// 拨打电话
const callContact = (contact) => {
  ElMessage.info(`呼叫：${contact.name} ${contact.phone}`)
}

// 跳转到设备生命周期页面
const goToEquipmentLifecycle = () => {
  router.push('/equipment-lifecycle')
}

// 创建工单
const createWorkOrder = () => {
  router.push('/fault-tracking')
}

// 获取订单状态类型
const getOrderStatusType = (status) => {
  const typeMap = {
    '已下单': 'primary',
    '待发货': 'warning',
    '运输中': 'success',
    '已到货': 'info'
  }
  return typeMap[status] || ''
}

// 获取进度条颜色
const getProgressColor = (percentage) => {
  if (percentage < 30) return '#909399'
  if (percentage < 70) return '#e6a23c'
  return '#67c23a'
}

// 获取设备状态类型
const getDeviceStatusType = (status) => {
  const typeMap = {
    'online': 'success',
    'maintenance': 'warning',
    'fault': 'danger',
    'offline': 'info'
  }
  return typeMap[status] || ''
}

// 获取设备状态文本
const getDeviceStatusText = (status) => {
  const textMap = {
    'online': '在线运行',
    'maintenance': '维护中',
    'fault': '故障',
    'offline': '离线'
  }
  return textMap[status] || status
}
</script>

<style scoped>
.equipment-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
}

.dashboard-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 30px 20px;
}

/* 顶部标题 */
.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px 30px;
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.1) 0%, rgba(100, 108, 255, 0.1) 100%);
  border: 1px solid rgba(64, 158, 255, 0.3);
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.dashboard-title {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  text-shadow: 0 0 20px rgba(64, 158, 255, 0.5);
}

.dashboard-subtitle {
  color: #a0cfff;
  font-size: 14px;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-role-selector {
  background: rgba(255, 255, 255, 0.1);
  padding: 4px;
  border-radius: 12px;
}

.role-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  color: #fff;
}

.real-time-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #67c23a;
  font-size: 14px;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  background: #67c23a;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    box-shadow: 0 0 10px #67c23a;
  }
  50% {
    opacity: 0.5;
    box-shadow: 0 0 20px #67c23a;
  }
}

/* KPI看板 */
.kpi-section {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.kpi-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s;
  backdrop-filter: blur(10px);
}

.kpi-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.kpi-icon {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.kpi-primary .kpi-icon {
  background: linear-gradient(135deg, #409eff 0%, #646cff 100%);
  color: #fff;
}

.kpi-success .kpi-icon {
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  color: #fff;
}

.kpi-warning .kpi-icon {
  background: linear-gradient(135deg, #e6a23c 0%, #f56c6c 100%);
  color: #fff;
}

.kpi-danger .kpi-icon {
  background: linear-gradient(135deg, #f56c6c 0%, #c0392b 100%);
  color: #fff;
}

.kpi-info .kpi-icon {
  background: linear-gradient(135deg, #909399 0%, #606266 100%);
  color: #fff;
}

.kpi-content {
  flex: 1;
}

.kpi-value {
  font-size: 36px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}

.kpi-label {
  font-size: 14px;
  color: #a0cfff;
  margin-bottom: 8px;
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #67c23a;
}

.kpi-trend.up {
  color: #67c23a;
}

.kpi-trend.down {
  color: #f56c6c;
}

/* 仪表板卡片 */
.dashboard-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 设备监控网格 */
.device-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  max-height: 500px;
  overflow-y: auto;
}

.device-item {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.device-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.device-online {
  border-color: rgba(103, 194, 58, 0.5);
}

.device-maintenance {
  border-color: rgba(230, 162, 60, 0.5);
}

.device-fault {
  border-color: rgba(245, 108, 108, 0.5);
  animation: deviceFault 2s infinite;
}

@keyframes deviceFault {
  0%, 100% {
    box-shadow: 0 0 10px rgba(245, 108, 108, 0.3);
  }
  50% {
    box-shadow: 0 0 20px rgba(245, 108, 108, 0.6);
  }
}

.device-status-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.device-online .device-status-badge {
  background: #67c23a;
  color: #fff;
}

.device-maintenance .device-status-badge {
  background: #e6a23c;
  color: #fff;
}

.device-fault .device-status-badge {
  background: #f56c6c;
  color: #fff;
}

.device-info {
  margin-bottom: 12px;
}

.device-name {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
}

.device-model {
  font-size: 12px;
  color: #a0cfff;
  margin-bottom: 2px;
}

.device-location {
  font-size: 11px;
  color: #909399;
}

.device-metrics {
  display: flex;
  gap: 12px;
}

.metric-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-label {
  font-size: 11px;
  color: #909399;
}

.metric-value {
  font-size: 14px;
  font-weight: 600;
  color: #409eff;
}

/* 维护流程 */
.maintenance-flow {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 20px 0;
}

.flow-stage {
  display: flex;
  align-items: center;
  gap: 16px;
  opacity: 0.5;
  transition: all 0.3s;
}

.flow-stage.active {
  opacity: 1;
}

.stage-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.2) 0%, rgba(100, 108, 255, 0.2) 100%);
  border: 2px solid rgba(64, 158, 255, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #409eff;
}

.stage-info {
  text-align: center;
}

.stage-name {
  font-size: 14px;
  color: #fff;
  margin-bottom: 4px;
}

.stage-count {
  font-size: 20px;
  font-weight: 700;
  color: #409eff;
}

.stage-arrow {
  color: rgba(255, 255, 255, 0.3);
  font-size: 24px;
}

/* 零配件列表 */
.spare-parts-list {
  max-height: 400px;
  overflow-y: auto;
}

.spare-part-item {
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  margin-bottom: 12px;
}

.part-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.part-name {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.part-progress {
  margin-bottom: 12px;
}

.part-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}

/* 待办列表 */
.todo-list {
  max-height: 300px;
  overflow-y: auto;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-left: 3px solid;
  border-radius: 8px;
  margin-bottom: 12px;
}

.priority-high {
  border-left-color: #f56c6c;
}

.priority-medium {
  border-left-color: #e6a23c;
}

.priority-low {
  border-left-color: #409eff;
}

.todo-icon {
  font-size: 24px;
  color: #409eff;
}

.todo-content {
  flex: 1;
}

.todo-title {
  font-size: 14px;
  color: #fff;
  margin-bottom: 4px;
}

.todo-time {
  font-size: 12px;
  color: #909399;
}

/* 联系人列表 */
.contact-list {
  max-height: 300px;
  overflow-y: auto;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  margin-bottom: 12px;
}

.contact-info {
  flex: 1;
}

.contact-name {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
}

.contact-role {
  font-size: 12px;
  color: #a0cfff;
  margin-bottom: 2px;
}

.contact-phone {
  font-size: 12px;
  color: #909399;
}

/* 设备详情 */
.device-detail-content {
  color: #303133;
}

.detail-actions {
  margin-top: 24px;
  display: flex;
  justify-content: center;
  gap: 16px;
}

/* 响应式 */
@media (max-width: 1400px) {
  .kpi-section {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .device-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .kpi-section {
    grid-template-columns: 1fr;
  }
  
  .device-grid {
    grid-template-columns: 1fr;
  }
  
  .main-content {
    flex-direction: column;
  }
}
</style>
