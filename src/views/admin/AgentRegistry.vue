<template>
  <div class="agent-registry-container">
    <el-card class="header-card">
      <div class="page-header">
        <div>
          <h2>🤖 企业级智能体注册中心</h2>
          <p class="subtitle">集中管理、监控和优化所有智能体</p>
        </div>
        <el-button type="primary" @click="showRegisterDialog">
          <el-icon><Plus /></el-icon> 注册新智能体
        </el-button>
      </div>
    </el-card>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon" :size="40" color="#409EFF"><Grid /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ agentStore.agentStats.total }}</div>
              <div class="stat-label">总智能体数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon" :size="40" color="#67C23A"><SuccessFilled /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ agentStore.agentStats.active }}</div>
              <div class="stat-label">运行中</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon" :size="40" color="#E6A23C"><DataAnalysis /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ formatNumber(agentStore.agentStats.totalRequests) }}</div>
              <div class="stat-label">总调用次数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <el-icon class="stat-icon" :size="40" color="#F56C6C"><TrendCharts /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ agentStore.agentStats.avgUptime }}%</div>
              <div class="stat-label">平均可用性</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 智能体列表 -->
    <el-card class="main-card">
      <el-tabs v-model="activeTab">
        <!-- 全部智能体 -->
        <el-tab-pane label="全部智能体" name="all">
          <el-table :data="filteredAgents" style="width: 100%">
            <el-table-column prop="name" label="智能体名称" width="200">
              <template #default="scope">
                <div class="agent-name-cell">
                  <span class="agent-icon">🤖</span>
                  <div>
                    <div class="name">{{ scope.row.name }}</div>
                    <div class="agent-id">{{ scope.row.agentId }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column prop="type" label="类型" width="120">
              <template #default="scope">
                <el-tag size="small">{{ getTypeName(scope.row.type) }}</el-tag>
              </template>
            </el-table-column>

            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="getStatusColor(scope.row.status)" size="small">
                  {{ getStatusName(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="能力" min-width="200">
              <template #default="scope">
                <div class="capabilities">
                  <el-tag 
                    v-for="cap in scope.row.capabilities.slice(0, 3)" 
                    :key="cap" 
                    size="small" 
                    type="info"
                    style="margin-right: 5px;">
                    {{ cap }}
                  </el-tag>
                  <el-tag v-if="scope.row.capabilities.length > 3" size="small" type="info">
                    +{{ scope.row.capabilities.length - 3 }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="性能指标" width="200">
              <template #default="scope">
                <div class="metrics">
                  <div class="metric-item">
                    <span class="label">调用:</span>
                    <span class="value">{{ scope.row.metrics.totalRequests }}</span>
                  </div>
                  <div class="metric-item">
                    <span class="label">成功率:</span>
                    <span class="value success">
                      {{ calculateSuccessRate(scope.row.metrics) }}%
                    </span>
                  </div>
                  <div class="metric-item">
                    <span class="label">响应:</span>
                    <span class="value">{{ scope.row.metrics.avgResponseTime }}ms</span>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="可用性" width="120">
              <template #default="scope">
                <el-progress 
                  :percentage="scope.row.metrics.uptime" 
                  :color="getUptimeColor(scope.row.metrics.uptime)"
                  :stroke-width="8" />
              </template>
            </el-table-column>

            <el-table-column label="操作" width="250" fixed="right">
              <template #default="scope">
                <el-button size="small" @click="viewAgentDetail(scope.row)">
                  <el-icon><View /></el-icon> 详情
                </el-button>
                <el-button size="small" @click="testAgent(scope.row)">
                  <el-icon><Promotion /></el-icon> 测试
                </el-button>
                <el-dropdown>
                  <el-button size="small">
                    更多 <el-icon><ArrowDown /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="editAgent(scope.row)">
                        <el-icon><Edit /></el-icon> 编辑
                      </el-dropdown-item>
                      <el-dropdown-item @click="performHealthCheck(scope.row)">
                        <el-icon><CircleCheck /></el-icon> 健康检查
                      </el-dropdown-item>
                      <el-dropdown-item @click="viewMetrics(scope.row)">
                        <el-icon><DataLine /></el-icon> 查看指标
                      </el-dropdown-item>
                      <el-dropdown-item divided @click="unregisterAgent(scope.row)">
                        <el-icon><Delete /></el-icon> 注销
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 性能监控 -->
        <el-tab-pane label="性能监控" name="performance">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-card>
                <template #header>
                  <div class="card-header">
                    <span>🏆 性能最佳智能体</span>
                  </div>
                </template>
                <el-table :data="agentStore.topPerformingAgents" :show-header="false">
                  <el-table-column prop="name" label="名称" />
                  <el-table-column label="成功率" width="100">
                    <template #default="scope">
                      {{ calculateSuccessRate(scope.row.metrics) }}%
                    </template>
                  </el-table-column>
                  <el-table-column label="可用性" width="100">
                    <template #default="scope">
                      {{ scope.row.metrics.uptime.toFixed(1) }}%
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card>
                <template #header>
                  <div class="card-header">
                    <span>📊 类型分布</span>
                  </div>
                </template>
                <div class="type-distribution">
                  <div 
                    v-for="(agents, type) in agentStore.agentsByType" 
                    :key="type"
                    class="type-item">
                    <span class="type-label">{{ getTypeName(type) }}</span>
                    <el-progress 
                      :percentage="(agents.length / agentStore.agents.length) * 100" 
                      :format="() => agents.length"
                      :stroke-width="20" />
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </el-tab-pane>

        <!-- 交互历史 -->
        <el-tab-pane label="交互历史" name="interactions">
          <el-table :data="recentInteractions" style="width: 100%">
            <el-table-column prop="interactionId" label="交互ID" width="180" />
            <el-table-column label="智能体" width="150">
              <template #default="scope">
                {{ getAgentName(scope.row.agentId) }}
              </template>
            </el-table-column>
            <el-table-column prop="action" label="操作" width="120" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.status === 'success' ? 'success' : 'danger'" size="small">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="duration" label="耗时(ms)" width="100" />
            <el-table-column label="时间" width="180">
              <template #default="scope">
                {{ formatTime(scope.row.startTime) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button size="small" @click="viewInteractionDetail(scope.row)">
                  查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 学习记录 -->
        <el-tab-pane label="学习记录" name="learning">
          <el-table :data="recentLearningRecords" style="width: 100%">
            <el-table-column prop="recordId" label="记录ID" width="180" />
            <el-table-column label="智能体" width="150">
              <template #default="scope">
                {{ getAgentName(scope.row.agentId) }}
              </template>
            </el-table-column>
            <el-table-column prop="learningType" label="学习类型" width="120">
              <template #default="scope">
                <el-tag size="small">{{ scope.row.learningType }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="时间" width="180">
              <template #default="scope">
                {{ formatTime(scope.row.timestamp) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button size="small" @click="viewLearningDetail(scope.row)">
                  查看
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 智能体详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="currentAgent?.name"
      width="900px">
      <div v-if="currentAgent" class="agent-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="智能体ID">
            {{ currentAgent.agentId }}
          </el-descriptions-item>
          <el-descriptions-item label="类型">
            {{ getTypeName(currentAgent.type) }}
          </el-descriptions-item>
          <el-descriptions-item label="版本">
            {{ currentAgent.version }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusColor(currentAgent.status)">
              {{ getStatusName(currentAgent.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="创建时间" :span="2">
            {{ formatTime(currentAgent.metadata.createdAt) }}
          </el-descriptions-item>
          <el-descriptions-item label="能力列表" :span="2">
            <el-tag 
              v-for="cap in currentAgent.capabilities" 
              :key="cap" 
              style="margin-right: 5px;">
              {{ cap }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="依赖服务" :span="2">
            <el-tag 
              v-for="dep in currentAgent.dependencies" 
              :key="dep" 
              type="info"
              style="margin-right: 5px;">
              {{ dep }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="描述" :span="2">
            {{ currentAgent.metadata.description }}
          </el-descriptions-item>
        </el-descriptions>

        <el-divider>配置信息</el-divider>
        <pre class="config-json">{{ JSON.stringify(currentAgent.configuration, null, 2) }}</pre>

        <el-divider>端点列表</el-divider>
        <pre class="config-json">{{ JSON.stringify(currentAgent.endpoints, null, 2) }}</pre>
      </div>
    </el-dialog>

    <!-- 测试智能体对话框 -->
    <el-dialog
      v-model="testDialogVisible"
      :title="`测试: ${currentAgent?.name}`"
      width="700px">
      <el-form :model="testForm" label-width="100px">
        <el-form-item label="操作">
          <el-input v-model="testForm.action" placeholder="如: analyze" />
        </el-form-item>
        <el-form-item label="数据">
          <el-input 
            v-model="testForm.data" 
            type="textarea" 
            :rows="6"
            placeholder='输入JSON格式数据, 如: {"param": "value"}' />
        </el-form-item>
        <el-form-item label="上下文">
          <el-input 
            v-model="testForm.context" 
            type="textarea" 
            :rows="3"
            placeholder='可选, JSON格式' />
        </el-form-item>
      </el-form>

      <el-divider>测试结果</el-divider>
      <div v-if="testResult" class="test-result">
        <el-alert 
          :type="testResult.success ? 'success' : 'error'" 
          :title="testResult.success ? '调用成功' : '调用失败'"
          :closable="false" />
        <pre class="result-json">{{ JSON.stringify(testResult, null, 2) }}</pre>
      </div>

      <template #footer>
        <el-button @click="testDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="executeTest" :loading="testing">
          <el-icon><Promotion /></el-icon> 执行测试
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAgentRegistryStore } from '@/store/agentRegistry'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Plus, Grid, SuccessFilled, DataAnalysis, TrendCharts,
  View, Edit, Delete, Promotion, ArrowDown,
  CircleCheck, DataLine
} from '@element-plus/icons-vue'

const agentStore = useAgentRegistryStore()
agentStore.initialize()

const activeTab = ref('all')
const detailDialogVisible = ref(false)
const testDialogVisible = ref(false)
const currentAgent = ref(null)
const testing = ref(false)
const testResult = ref(null)

const testForm = ref({
  action: '',
  data: '',
  context: ''
})

// 计算属性
const filteredAgents = computed(() => agentStore.agents)

const recentInteractions = computed(() => {
  return agentStore.interactions.slice(-50).reverse()
})

const recentLearningRecords = computed(() => {
  return agentStore.learningRecords.slice(-50).reverse()
})

// 辅助函数
const getTypeName = (type) => {
  const found = agentStore.agentTypes.find(t => t.value === type)
  return found ? found.label : type
}

const getStatusName = (status) => {
  const found = agentStore.agentStatuses.find(s => s.value === status)
  return found ? found.label : status
}

const getStatusColor = (status) => {
  const found = agentStore.agentStatuses.find(s => s.value === status)
  return found ? found.color : 'info'
}

const getAgentName = (agentId) => {
  const agent = agentStore.agents.find(a => a.agentId === agentId)
  return agent ? agent.name : agentId
}

const calculateSuccessRate = (metrics) => {
  if (metrics.totalRequests === 0) return 100
  return ((metrics.successfulRequests / metrics.totalRequests) * 100).toFixed(1)
}

const getUptimeColor = (uptime) => {
  if (uptime >= 99) return '#67C23A'
  if (uptime >= 95) return '#E6A23C'
  return '#F56C6C'
}

const formatNumber = (num) => {
  return num.toLocaleString()
}

const formatTime = (timestamp) => {
  if (!timestamp) return '-'
  return new Date(timestamp).toLocaleString('zh-CN')
}

// 操作函数
const showRegisterDialog = () => {
  ElMessage.info('注册新智能体功能开发中...')
}

const viewAgentDetail = (agent) => {
  currentAgent.value = agent
  detailDialogVisible.value = true
}

const testAgent = (agent) => {
  currentAgent.value = agent
  testForm.value = {
    action: '',
    data: '',
    context: ''
  }
  testResult.value = null
  testDialogVisible.value = true
}

const executeTest = async () => {
  try {
    testing.value = true
    const data = testForm.value.data ? JSON.parse(testForm.value.data) : {}
    const context = testForm.value.context ? JSON.parse(testForm.value.context) : {}

    const result = await agentStore.invokeAgent(
      currentAgent.value.agentId,
      testForm.value.action,
      data,
      context
    )

    testResult.value = {
      success: true,
      ...result
    }

    ElMessage.success('测试执行成功')

  } catch (error) {
    testResult.value = {
      success: false,
      error: error.message
    }
    ElMessage.error('测试执行失败: ' + error.message)

  } finally {
    testing.value = false
  }
}

const editAgent = (agent) => {
  ElMessage.info('编辑功能开发中...')
}

const performHealthCheck = async (agent) => {
  const result = await agentStore.performHealthCheck(agent.agentId)
  if (result) {
    ElMessage.success(`健康检查通过: ${agent.name}`)
  } else {
    ElMessage.warning(`健康检查异常: ${agent.name}`)
  }
}

const viewMetrics = (agent) => {
  ElMessage.info('指标查看功能开发中...')
}

const unregisterAgent = (agent) => {
  ElMessageBox.confirm(
    `确定要注销智能体 "${agent.name}" 吗？此操作不可恢复。`,
    '确认注销',
    {
      type: 'warning'
    }
  ).then(() => {
    agentStore.unregisterAgent(agent.agentId)
    ElMessage.success('注销成功')
  }).catch(() => {})
}

const viewInteractionDetail = (interaction) => {
  ElMessage.info('交互详情功能开发中...')
}

const viewLearningDetail = (record) => {
  ElMessage.info('学习记录详情功能开发中...')
}
</script>

<style scoped>
.agent-registry-container {
  padding: 20px;
}

.header-card {
  margin-bottom: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-header h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  color: #303133;
}

.subtitle {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  height: 100%;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  flex-shrink: 0;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.main-card {
  min-height: 500px;
}

.agent-name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.agent-icon {
  font-size: 24px;
}

.name {
  font-weight: 500;
  color: #303133;
}

.agent-id {
  font-size: 12px;
  color: #909399;
}

.capabilities {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.metrics {
  font-size: 12px;
}

.metric-item {
  margin-bottom: 4px;
}

.metric-item .label {
  color: #909399;
  margin-right: 5px;
}

.metric-item .value {
  color: #303133;
  font-weight: 500;
}

.metric-item .value.success {
  color: #67C23A;
}

.agent-detail {
  max-height: 600px;
  overflow-y: auto;
}

.config-json {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  font-size: 12px;
  max-height: 200px;
  overflow-y: auto;
}

.test-result {
  margin-top: 15px;
}

.result-json {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  font-size: 12px;
  margin-top: 15px;
  max-height: 300px;
  overflow-y: auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
}

.type-distribution {
  padding: 10px 0;
}

.type-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.type-label {
  width: 120px;
  font-size: 14px;
  color: #606266;
}
</style>
