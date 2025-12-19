<template>
  <div class="monitoring-dashboard">
    <el-page-header @back="$router.back()" content="监控与优化中心" />
    
    <!-- 系统健康度总览 -->
    <div class="health-overview">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="stat-card">
              <div class="stat-icon" :class="healthClass">
                <el-icon><Monitor /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-label">系统健康度</div>
                <div class="stat-value" :class="healthClass">{{ safeSystemHealth }}%</div>
                <div class="stat-trend">{{ healthStatus }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="stat-card">
              <div class="stat-icon warning">
                <el-icon><BellFilled /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-label">活跃告警</div>
                <div class="stat-value">{{ safeActiveAlertsCount }}</div>
                <div class="stat-trend critical">严重: {{ safeCriticalAlertsCount }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="stat-card">
              <div class="stat-icon success">
                <el-icon><TrendCharts /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-label">平均响应时间</div>
                <div class="stat-value">{{ safeResponseTime }}ms</div>
                <div class="stat-trend">目标: {{ safeResponseTimeTarget }}ms</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <el-col :span="6">
          <el-card shadow="hover">
            <div class="stat-card">
              <div class="stat-icon info">
                <el-icon><PieChart /></el-icon>
              </div>
              <div class="stat-content">
                <div class="stat-label">存储使用率</div>
                <div class="stat-value">{{ safeStorageUsagePercent }}%</div>
                <div class="stat-trend">{{ (safeStorageUsed / 1024).toFixed(2) }} KB</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 功能标签页 -->
    <el-tabs v-model="activeTab" class="main-tabs" @tab-click="handleTabClick">
      <!-- 性能监控 -->
      <el-tab-pane label="性能监控" name="performance">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>性能基准对比</span>
                  <el-button type="primary" size="small" @click="runBenchmarkTest">
                    <el-icon><VideoPlay /></el-icon> 运行基准测试
                  </el-button>
                </div>
              </template>
              
              <el-table :data="benchmarkData" stripe>
                <el-table-column prop="metric" label="指标" width="180" />
                <el-table-column label="当前值" width="120">
                  <template #default="scope">
                    <el-tag :type="scope.row.status">{{ scope.row.current }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="target" label="目标值" width="120" />
                <el-table-column label="达标率" width="100">
                  <template #default="scope">
                    <el-progress 
                      :percentage="scope.row.percentage" 
                      :status="scope.row.status === 'success' ? 'success' : 'exception'"
                      :stroke-width="8"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
          
          <el-col :span="12">
            <el-card>
              <template #header>
                <span>性能统计</span>
              </template>
              
              <div v-if="performanceStats" class="stats-grid">
                <div class="stat-item">
                  <div class="label">总请求数</div>
                  <div class="value">{{ performanceStats.count }}</div>
                </div>
                <div class="stat-item">
                  <div class="label">平均响应</div>
                  <div class="value">{{ performanceStats.avg }}ms</div>
                </div>
                <div class="stat-item">
                  <div class="label">最快响应</div>
                  <div class="value">{{ performanceStats.min }}ms</div>
                </div>
                <div class="stat-item">
                  <div class="label">最慢响应</div>
                  <div class="value">{{ performanceStats.max }}ms</div>
                </div>
                <div class="stat-item">
                  <div class="label">P50</div>
                  <div class="value">{{ performanceStats.p50 }}ms</div>
                </div>
                <div class="stat-item">
                  <div class="label">P95</div>
                  <div class="value">{{ performanceStats.p95 }}ms</div>
                </div>
                <div class="stat-item">
                  <div class="label">P99</div>
                  <div class="value">{{ performanceStats.p99 }}ms</div>
                </div>
              </div>
              <el-empty v-else description="暂无性能数据" :image-size="100" />
            </el-card>
          </el-col>
        </el-row>
        
        <el-card style="margin-top: 20px;">
          <template #header>
            <div class="card-header">
              <span>错误分析</span>
              <el-select v-model="errorTimeRange" size="small" style="width: 120px;">
                <el-option label="最近1小时" value="1h" />
                <el-option label="最近24小时" value="24h" />
                <el-option label="最近7天" value="7d" />
                <el-option label="最近30天" value="30d" />
              </el-select>
            </div>
          </template>
          
          <div v-if="errorAnalysis.total > 0">
            <el-row :gutter="20">
              <el-col :span="12">
                <h4>Top 5 错误类型</h4>
                <el-table :data="errorAnalysis.topErrors" stripe size="small">
                  <el-table-column label="错误类型" prop="0" />
                  <el-table-column label="次数" prop="1" width="100" />
                  <el-table-column label="占比" width="100">
                    <template #default="scope">
                      {{ ((scope.row[1] / errorAnalysis.total) * 100).toFixed(1) }}%
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
              <el-col :span="12">
                <h4>总计: {{ errorAnalysis.total }} 个错误</h4>
                <div class="stats-grid">
                  <div v-for="([type, count]) in Object.entries(errorAnalysis.byType).slice(0, 6)" :key="type" class="stat-item">
                    <div class="label">{{ type }}</div>
                    <div class="value">{{ count }}</div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <el-empty v-else description="暂无错误记录" :image-size="100" />
        </el-card>
      </el-tab-pane>

      <!-- 告警管理 -->
      <el-tab-pane label="告警管理" name="alerts">
        <el-row :gutter="20">
          <el-col :span="16">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>告警记录</span>
                  <div>
                    <el-select v-model="alertFilter" size="small" placeholder="筛选状态" style="width: 120px; margin-right: 10px;">
                      <el-option label="全部" value="all" />
                      <el-option label="活跃" value="active" />
                      <el-option label="已确认" value="acknowledged" />
                      <el-option label="已解决" value="resolved" />
                    </el-select>
                    <el-button type="danger" size="small" @click="clearResolvedAlerts">
                      清理已解决告警
                    </el-button>
                  </div>
                </div>
              </template>
              
              <el-table :data="filteredAlerts" stripe max-height="500">
                <el-table-column label="严重程度" width="100">
                  <template #default="scope">
                    <el-tag :type="getSeverityType(scope.row.severity)" size="small">
                      {{ getSeverityLabel(scope.row.severity) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="ruleName" label="规则名称" width="180" />
                <el-table-column prop="message" label="告警消息" show-overflow-tooltip />
                <el-table-column label="状态" width="100">
                  <template #default="scope">
                    <el-tag :type="getStatusType(scope.row.status)" size="small">
                      {{ getStatusLabel(scope.row.status) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="180" fixed="right">
                  <template #default="scope">
                    <el-button 
                      v-if="scope.row.status === 'active'" 
                      type="warning" 
                      size="small"
                      @click="acknowledgeAlert(scope.row.id)">
                      确认
                    </el-button>
                    <el-button 
                      v-if="scope.row.status !== 'resolved'" 
                      type="success" 
                      size="small"
                      @click="resolveAlertDialog(scope.row)">
                      解决
                    </el-button>
                    <el-button 
                      type="info" 
                      size="small"
                      @click="viewAlertDetails(scope.row)">
                      详情
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
          
          <el-col :span="8">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>告警规则</span>
                  <el-button type="primary" size="small" @click="showAddRuleDialog">
                    <el-icon><Plus /></el-icon> 新增
                  </el-button>
                </div>
              </template>
              
              <el-table :data="safeAlertRules" stripe max-height="500">
                <el-table-column prop="name" label="规则名称" show-overflow-tooltip />
                <el-table-column label="状态" width="80">
                  <template #default="scope">
                    <el-switch 
                      v-model="scope.row.enabled"
                      @change="toggleRule(scope.row.id, $event)"
                    />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                  <template #default="scope">
                    <el-button 
                      type="primary" 
                      size="small"
                      @click="editRule(scope.row)">
                      编辑
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>

      <!-- 优化建议 -->
      <el-tab-pane label="优化建议" name="optimization">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>系统优化建议</span>
              <el-button type="primary" @click="generateSuggestions">
                <el-icon><Refresh /></el-icon> 生成建议
              </el-button>
            </div>
          </template>
          
          <div v-if="safeOptimizationSuggestions.length > 0">
            <div 
              v-for="suggestion in safeOptimizationSuggestions" 
              :key="suggestion.id" 
              class="suggestion-card">
              <el-card shadow="hover">
                <div class="suggestion-header">
                  <div>
                    <el-tag :type="getPriorityType(suggestion.priority)" size="large">
                      {{ getPriorityLabel(suggestion.priority) }}
                    </el-tag>
                    <span class="suggestion-title">{{ suggestion.title }}</span>
                  </div>
                  <el-button type="primary" @click="applySuggestion(suggestion.id)">
                    应用优化
                  </el-button>
                </div>
                
                <el-divider />
                
                <p class="suggestion-description">{{ suggestion.description }}</p>
                
                <div class="suggestion-meta">
                  <el-tag type="info" size="small">类型: {{ getOptTypeLabel(suggestion.type) }}</el-tag>
                  <el-tag type="warning" size="small">工作量: {{ getEffortLabel(suggestion.effort) }}</el-tag>
                  <el-tag type="success" size="small">预期效果: {{ suggestion.estimatedImpact }}</el-tag>
                </div>
                
                <div class="suggestion-actions">
                  <h4>建议措施:</h4>
                  <ul>
                    <li v-for="(action, index) in suggestion.actions" :key="index">{{ action }}</li>
                  </ul>
                </div>
              </el-card>
            </div>
          </div>
          <el-empty v-else description="暂无优化建议，系统运行良好" :image-size="200" />
        </el-card>
      </el-tab-pane>

      <!-- 系统配置 -->
      <el-tab-pane label="系统配置" name="config">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-card>
              <template #header>
                <span>监控配置</span>
              </template>
              
              <el-form label-width="150px">
                <el-form-item label="采样间隔">
                  <el-input-number 
                    v-model="safeConfig.samplingInterval"
                    :min="10000"
                    :max="300000"
                    :step="10000"
                  />
                  <span style="margin-left: 10px;">毫秒</span>
                </el-form-item>
                
                <el-form-item label="指标保留天数">
                  <el-input-number 
                    v-model="monitoringStore.state.config.metricsRetentionDays"
                    :min="1"
                    :max="365"
                  />
                  <span style="margin-left: 10px;">天</span>
                </el-form-item>
                
                <el-form-item label="告警保留天数">
                  <el-input-number 
                    v-model="safeConfig.alertRetentionDays"
                    :min="1"
                    :max="365"
                  />
                  <span style="margin-left: 10px;">天</span>
                </el-form-item>
                
                <el-form-item label="启用告警">
                  <el-switch v-model="safeConfig.enableAlerts" />
                </el-form-item>
                
                <el-form-item label="自动优化">
                  <el-switch v-model="safeConfig.autoOptimization" />
                </el-form-item>
                
                <el-form-item>
                  <el-button type="primary" @click="saveConfig">保存配置</el-button>
                  <el-button @click="resetConfig">重置</el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </el-col>
          
          <el-col :span="12">
            <el-card>
              <template #header>
                <span>数据维护</span>
              </template>
              
              <el-descriptions :column="1" border>
                <el-descriptions-item label="性能指标数量">
                  {{ monitoringStore.state.metrics.length }}
                </el-descriptions-item>
                <el-descriptions-item label="告警记录数量">
                  {{ monitoringStore.state.alerts.length }}
                </el-descriptions-item>
                <el-descriptions-item label="存储使用">
                  {{ (safeStorageUsed / 1024).toFixed(2) }} KB
                </el-descriptions-item>
              </el-descriptions>
              
              <div style="margin-top: 20px;">
                <el-button type="warning" @click="cleanupOldData">
                  <el-icon><Delete /></el-icon> 清理过期数据
                </el-button>
                <el-button type="danger" @click="resetAllData">
                  <el-icon><RefreshLeft /></el-icon> 重置所有数据
                </el-button>
              </div>
            </el-card>
            
            <el-card style="margin-top: 20px;">
              <template #header>
                <span>监控控制</span>
              </template>
              
              <el-descriptions :column="1" border>
                <el-descriptions-item label="监控状态">
                  <el-tag :type="isMonitoring ? 'success' : 'info'">
                    {{ isMonitoring ? '运行中' : '已停止' }}
                  </el-tag>
                </el-descriptions-item>
              </el-descriptions>
              
              <div style="margin-top: 20px;">
                <el-button 
                  v-if="!isMonitoring" 
                  type="success" 
                  @click="startMonitoring">
                  <el-icon><VideoPlay /></el-icon> 启动监控
                </el-button>
                <el-button 
                  v-else 
                  type="warning" 
                  @click="stopMonitoring">
                  <el-icon><VideoPause /></el-icon> 停止监控
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <!-- 告警详情对话框 -->
    <el-dialog v-model="alertDetailVisible" title="告警详情" width="600px">
      <el-descriptions v-if="currentAlert" :column="1" border>
        <el-descriptions-item label="告警ID">{{ currentAlert.id }}</el-descriptions-item>
        <el-descriptions-item label="规则名称">{{ currentAlert.ruleName }}</el-descriptions-item>
        <el-descriptions-item label="严重程度">
          <el-tag :type="getSeverityType(currentAlert.severity)">
            {{ getSeverityLabel(currentAlert.severity) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="消息">{{ currentAlert.message }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentAlert.status)">
            {{ getStatusLabel(currentAlert.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="触发时间">{{ formatTime(currentAlert.timestamp) }}</el-descriptions-item>
        <el-descriptions-item v-if="currentAlert.acknowledgedBy" label="确认人">
          {{ currentAlert.acknowledgedBy }}
        </el-descriptions-item>
        <el-descriptions-item v-if="currentAlert.acknowledgedAt" label="确认时间">
          {{ formatTime(currentAlert.acknowledgedAt) }}
        </el-descriptions-item>
        <el-descriptions-item v-if="currentAlert.resolvedAt" label="解决时间">
          {{ formatTime(currentAlert.resolvedAt) }}
        </el-descriptions-item>
        <el-descriptions-item label="阈值">
          {{ currentAlert.metadata?.threshold }}
        </el-descriptions-item>
        <el-descriptions-item label="当前值">
          {{ currentAlert.metadata?.currentValue }}
        </el-descriptions-item>
        <el-descriptions-item label="执行动作">
          <el-tag v-for="action in currentAlert.actions" :key="action" size="small" style="margin-right: 5px;">
            {{ action }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 解决告警对话框 -->
    <el-dialog v-model="resolveDialogVisible" title="解决告警" width="500px">
      <el-form :model="resolveForm" label-width="100px">
        <el-form-item label="解决方案">
          <el-input 
            v-model="resolveForm.resolution" 
            type="textarea" 
            :rows="4"
            placeholder="请描述解决方案..."
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="resolveDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmResolveAlert">确认解决</el-button>
      </template>
    </el-dialog>

    <!-- 编辑规则对话框 -->
    <el-dialog v-model="ruleDialogVisible" :title="ruleForm.id ? '编辑规则' : '新增规则'" width="600px">
      <el-form :model="ruleForm" label-width="100px">
        <el-form-item label="规则名称">
          <el-input v-model="ruleForm.name" placeholder="请输入规则名称" />
        </el-form-item>
        
        <el-form-item label="类型">
          <el-select v-model="ruleForm.type" placeholder="选择类型">
            <el-option label="性能" value="performance" />
            <el-option label="错误" value="error" />
            <el-option label="质量" value="quality" />
            <el-option label="可用性" value="availability" />
            <el-option label="满意度" value="satisfaction" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="阈值">
          <el-input-number v-model="ruleForm.threshold" :min="0" />
        </el-form-item>
        
        <el-form-item label="严重程度">
          <el-radio-group v-model="ruleForm.severity">
            <el-radio label="info">信息</el-radio>
            <el-radio label="warning">警告</el-radio>
            <el-radio label="critical">严重</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="描述">
          <el-input v-model="ruleForm.description" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="ruleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRule">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Monitor, BellFilled, TrendCharts, PieChart, VideoPlay, VideoPause,
  Refresh, Plus, Delete, RefreshLeft
} from '@element-plus/icons-vue'
import { useMonitoringSystemStore } from '@/store/monitoringSystem'

const router = useRouter()
const monitoringStore = useMonitoringSystemStore()

// 安全访问包装器 - 防止页面崩溃
const safeSystemHealth = computed(() => {
  try {
    return monitoringStore.systemHealth || 0
  } catch (error) {
    console.error('获取系统健康度失败:', error)
    return 0
  }
})

const safeActiveAlertsCount = computed(() => {
  try {
    return monitoringStore.activeAlertsCount || 0
  } catch (error) {
    console.error('获取活跃告警数失败:', error)
    return 0
  }
})

const safeCriticalAlertsCount = computed(() => {
  try {
    return monitoringStore.criticalAlertsCount || 0
  } catch (error) {
    console.error('获取严重告警数失败:', error)
    return 0
  }
})

const safeStorageUsagePercent = computed(() => {
  try {
    return monitoringStore.storageUsagePercent || 0
  } catch (error) {
    console.error('获取存储使用率失败:', error)
    return 0
  }
})

const safeResponseTime = computed(() => {
  try {
    return monitoringStore.state?.benchmarks?.responseTime?.current || 0
  } catch (error) {
    console.error('获取响应时间失败:', error)
    return 0
  }
})

const safeResponseTimeTarget = computed(() => {
  try {
    return monitoringStore.state?.benchmarks?.responseTime?.target || 0
  } catch (error) {
    return 0
  }
})

const safeStorageUsed = computed(() => {
  try {
    return monitoringStore.state?.resources?.storageUsed || 0
  } catch (error) {
    return 0
  }
})

// 安全访问 - 告警规则
const safeAlertRules = computed(() => {
  try {
    return monitoringStore.state?.alertRules || []
  } catch (error) {
    console.error('获取告警规则失败:', error)
    return []
  }
})

// 安全访问 - 优化建议
const safeOptimizationSuggestions = computed(() => {
  try {
    return monitoringStore.state?.optimizationSuggestions || []
  } catch (error) {
    console.error('获取优化建议失败:', error)
    return []
  }
})

// 安全访问 - 告警列表
const safeAlerts = computed(() => {
  try {
    return monitoringStore.state?.alerts || []
  } catch (error) {
    console.error('获取告警列表失败:', error)
    return []
  }
})

// 安全访问 - 指标数量
const safeMetricsCount = computed(() => {
  try {
    return monitoringStore.state?.metrics?.length || 0
  } catch (error) {
    return 0
  }
})

// 安全访问 - 配置对象
const safeConfig = computed(() => {
  try {
    return monitoringStore.state?.config || {
      samplingInterval: 60000,
      metricsRetentionDays: 30,
      alertRetentionDays: 90,
      enableAlerts: true,
      autoOptimization: false
    }
  } catch (error) {
    console.error('获取配置失败:', error)
    return {
      samplingInterval: 60000,
      metricsRetentionDays: 30,
      alertRetentionDays: 90,
      enableAlerts: true,
      autoOptimization: false
    }
  }
})

// 当前Tab
const activeTab = ref('performance')

// 标签页点击处理
const handleTabClick = (tab) => {
  console.log('标签被点击:', tab)
  activeTab.value = tab.props.name
  ElMessage.info(`切换到: ${tab.props.label}`)
}

// 监控状态
const isMonitoring = ref(false)

// 健康度状态
const healthClass = computed(() => {
  try {
    const health = monitoringStore.systemHealth || 0
    if (health >= 90) return 'success'
    if (health >= 70) return 'warning'
    return 'danger'
  } catch (error) {
    console.error('获取健康度状态失败:', error)
    return 'info'
  }
})

const healthStatus = computed(() => {
  try {
    const health = monitoringStore.systemHealth || 0
    if (health >= 90) return '优秀'
    if (health >= 70) return '良好'
    if (health >= 50) return '一般'
    return '需要关注'
  } catch (error) {
    console.error('获取健康度文本失败:', error)
    return '加载中'
  }
})

// 基准数据
const benchmarkData = computed(() => {
  try {
    if (!monitoringStore.state || !monitoringStore.state.benchmarks) {
      return []
    }
    
    const b = monitoringStore.state.benchmarks
    return [
      {
        metric: '响应时间',
        current: `${b.responseTime.current}ms`,
        target: `${b.responseTime.target}ms`,
        percentage: Math.min(100, Math.round((b.responseTime.target / Math.max(1, b.responseTime.current)) * 100)),
        status: b.responseTime.current <= b.responseTime.target ? 'success' : 'danger'
      },
      {
        metric: '错误率',
        current: `${(b.errorRate.current * 100).toFixed(2)}%`,
        target: `${(b.errorRate.target * 100).toFixed(2)}%`,
        percentage: Math.min(100, Math.round((b.errorRate.target / Math.max(0.001, b.errorRate.current)) * 100)),
        status: b.errorRate.current <= b.errorRate.target ? 'success' : 'danger'
      },
      {
        metric: '可用性',
        current: `${(b.availability.current * 100).toFixed(2)}%`,
        target: `${(b.availability.target * 100).toFixed(2)}%`,
        percentage: Math.round((b.availability.current / b.availability.target) * 100),
        status: b.availability.current >= b.availability.target ? 'success' : 'danger'
      },
      {
        metric: '用户满意度',
        current: `${b.userSatisfaction.current.toFixed(1)}星`,
        target: `${b.userSatisfaction.target}星`,
        percentage: Math.round((b.userSatisfaction.current / b.userSatisfaction.target) * 100),
        status: b.userSatisfaction.current >= b.userSatisfaction.target ? 'success' : 'warning'
      },
      {
        metric: '知识质量',
        current: `${b.knowledgeQuality.current}分`,
        target: `${b.knowledgeQuality.target}分`,
        percentage: Math.round((b.knowledgeQuality.current / b.knowledgeQuality.target) * 100),
        status: b.knowledgeQuality.current >= b.knowledgeQuality.target ? 'success' : 'warning'
      }
    ]
  } catch (error) {
    console.error('获取基准数据失败:', error)
    return []
  }
})

// 性能统计
const performanceStats = computed(() => {
  try {
    return monitoringStore.getPerformanceStats() || {
      count: 0,
      avg: 0,
      min: 0,
      max: 0,
      p50: 0,
      p95: 0,
      p99: 0
    }
  } catch (error) {
    console.error('获取性能统计失败:', error)
    return { count: 0, avg: 0, min: 0, max: 0, p50: 0, p95: 0, p99: 0 }
  }
})

// 错误分析
const errorTimeRange = ref('24h')
const errorAnalysis = computed(() => {
  try {
    return monitoringStore.getErrorAnalysis(errorTimeRange.value) || {
      total: 0,
      byType: {},
      byAgent: {},
      trend: []
    }
  } catch (error) {
    console.error('获取错误分析失败:', error)
    return { total: 0, byType: {}, byAgent: {}, trend: [] }
  }
})

// 告警管理
const alertFilter = ref('all')
const filteredAlerts = computed(() => {
  if (alertFilter.value === 'all') return safeAlerts.value
  return safeAlerts.value.filter(a => a.status === alertFilter.value)
})

const alertDetailVisible = ref(false)
const currentAlert = ref(null)

const resolveDialogVisible = ref(false)
const resolveForm = ref({
  alertId: null,
  resolution: ''
})

// 告警规则管理
const ruleDialogVisible = ref(false)
const ruleForm = ref({
  id: null,
  name: '',
  type: 'performance',
  threshold: 0,
  severity: 'warning',
  description: ''
})

// 功能函数
function runBenchmarkTest() {
  ElMessageBox.confirm('运行基准测试将执行一系列性能测试，可能需要几秒钟，是否继续？', '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(async () => {
    const loading = ElMessage({ message: '正在运行基准测试...', duration: 0, type: 'info' })
    try {
      const results = await monitoringStore.runBenchmark()
      loading.close()
      ElMessage.success(`基准测试完成! 执行了 ${results.tests.length} 项测试`)
    } catch (error) {
      loading.close()
      ElMessage.error('基准测试失败: ' + error.message)
    }
  }).catch(() => {})
}

function acknowledgeAlert(alertId) {
  monitoringStore.acknowledgeAlert(alertId, 'Admin')
  ElMessage.success('告警已确认')
}

function resolveAlertDialog(alert) {
  currentAlert.value = alert
  resolveForm.value.alertId = alert.id
  resolveForm.value.resolution = ''
  resolveDialogVisible.value = true
}

function confirmResolveAlert() {
  if (!resolveForm.value.resolution) {
    ElMessage.warning('请输入解决方案')
    return
  }
  
  monitoringStore.resolveAlert(resolveForm.value.alertId, resolveForm.value.resolution)
  ElMessage.success('告警已解决')
  resolveDialogVisible.value = false
}

function viewAlertDetails(alert) {
  currentAlert.value = alert
  alertDetailVisible.value = true
}

function clearResolvedAlerts() {
  ElMessageBox.confirm('确定要清理所有已解决的告警吗？', '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (monitoringStore.state && monitoringStore.state.alerts) {
      monitoringStore.state.alerts = monitoringStore.state.alerts.filter(a => a.status !== 'resolved')
    }
    ElMessage.success('已清理已解决的告警')
  }).catch(() => {})
}

function showAddRuleDialog() {
  ruleForm.value = {
    id: null,
    name: '',
    type: 'performance',
    threshold: 0,
    severity: 'warning',
    description: ''
  }
  ruleDialogVisible.value = true
}

function editRule(rule) {
  ruleForm.value = { ...rule }
  ruleDialogVisible.value = true
}

function saveRule() {
  if (!ruleForm.value.name || !ruleForm.value.description) {
    ElMessage.warning('请填写完整的规则信息')
    return
  }
  
  if (ruleForm.value.id) {
    monitoringStore.updateAlertRule(ruleForm.value.id, ruleForm.value)
    ElMessage.success('规则已更新')
  } else {
    monitoringStore.addAlertRule(ruleForm.value)
    ElMessage.success('规则已添加')
  }
  
  ruleDialogVisible.value = false
}

function toggleRule(ruleId, enabled) {
  monitoringStore.toggleAlertRule(ruleId, enabled)
  ElMessage.success(enabled ? '规则已启用' : '规则已禁用')
}

function generateSuggestions() {
  const suggestions = monitoringStore.generateOptimizationSuggestions()
  ElMessage.success(`已生成 ${suggestions.length} 条优化建议`)
}

function applySuggestion(suggestionId) {
  ElMessageBox.confirm('确定要应用此优化建议吗？系统将创建相应的学习任务。', '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'info'
  }).then(() => {
    monitoringStore.applyOptimization(suggestionId)
    ElMessage.success('已创建优化任务')
  }).catch(() => {})
}

function saveConfig() {
  ElMessage.success('配置已保存')
}

function resetConfig() {
  ElMessageBox.confirm('确定要重置配置吗？', '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (monitoringStore.state && monitoringStore.state.config) {
      monitoringStore.state.config = {
        samplingInterval: 60000,
        metricsRetentionDays: 30,
        alertRetentionDays: 90,
        enableAlerts: true,
        autoOptimization: false
      }
    }
    ElMessage.success('配置已重置')
  }).catch(() => {})
}

function cleanupOldData() {
  ElMessageBox.confirm('确定要清理过期数据吗？', '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    monitoringStore.cleanupOldMetrics()
    monitoringStore.cleanupOldAlerts()
    ElMessage.success('过期数据已清理')
  }).catch(() => {})
}

function resetAllData() {
  ElMessageBox.confirm('警告：此操作将清除所有监控数据，包括指标、告警和优化建议！是否继续？', '确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'error'
  }).then(() => {
    monitoringStore.resetAllData()
    ElMessage.success('所有数据已重置')
  }).catch(() => {})
}

function startMonitoring() {
  monitoringStore.startMonitoring()
  isMonitoring.value = true
  ElMessage.success('监控已启动')
}

function stopMonitoring() {
  monitoringStore.stopMonitoring()
  isMonitoring.value = false
  ElMessage.warning('监控已停止')
}

// 辅助函数
function getSeverityType(severity) {
  const types = {
    info: 'info',
    warning: 'warning',
    critical: 'danger'
  }
  return types[severity] || 'info'
}

// 组件挂载时添加手动点击事件监听
onMounted(() => {
  console.log('监控页面已挂载,添加标签页点击监听器')
  
  // 等待 DOM 渲染完成
  setTimeout(() => {
    // 1. 修复返回按钮
    const backButton = document.querySelector('.el-page-header__back')
    if (backButton) {
      console.log('✅ 找到返回按钮,添加点击监听器')
      backButton.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        console.log('返回按钮被点击,执行返回操作')
        router.back()
      }, { capture: true })
    } else {
      console.warn('⚠️ 未找到返回按钮元素')
    }
    
    // 2. 修复标签页切换
    const tabItems = document.querySelectorAll('.el-tabs__item')
    const tabPanes = document.querySelectorAll('.el-tab-pane')
    console.log('找到标签页数量:', tabItems.length)
    console.log('找到内容面板数量:', tabPanes.length)
    
    if (tabItems.length > 0) {
      tabItems.forEach((tab, index) => {
        // 移除可能存在的旧监听器
        const newTab = tab.cloneNode(true)
        tab.parentNode.replaceChild(newTab, tab)
        
        // 添加新的点击监听器
        newTab.addEventListener('click', (e) => {
          e.preventDefault()
          e.stopPropagation()
          
          console.log(`标签 ${index + 1} 被手动点击`)
          
          const tabNames = ['performance', 'alerts', 'suggestions', 'config']
          if (tabNames[index]) {
            // 1. 更新 activeTab
            activeTab.value = tabNames[index]
            console.log('activeTab 已更新为:', tabNames[index])
            
            // 2. 手动移除所有激活状态
            document.querySelectorAll('.el-tabs__item').forEach(t => {
              t.classList.remove('is-active')
            })
            
            // 3. 手动添加当前标签的激活状态
            document.querySelectorAll('.el-tabs__item')[index].classList.add('is-active')
            
            // 4. 手动隐藏所有内容面板
            document.querySelectorAll('.el-tab-pane').forEach(p => {
              p.style.display = 'none'
            })
            
            // 5. 手动显示对应的内容面板
            const targetPane = document.querySelectorAll('.el-tab-pane')[index]
            if (targetPane) {
              targetPane.style.display = 'block'
              console.log('✅ 内容面板已切换')
            }
          }
        }, { capture: true })
      })
      
      console.log('✅ 标签页点击监听器已添加')
      
      // 初始化:显示第一个面板
      document.querySelectorAll('.el-tab-pane').forEach((p, i) => {
        p.style.display = i === 0 ? 'block' : 'none'
      })
    } else {
      console.error('❌ 未找到标签页元素')
    }
  }, 500)
})

function getSeverityLabel(severity) {
  const labels = {
    info: '信息',
    warning: '警告',
    critical: '严重'
  }
  return labels[severity] || severity
}

function getStatusType(status) {
  const types = {
    active: 'danger',
    acknowledged: 'warning',
    resolved: 'success'
  }
  return types[status] || 'info'
}

function getStatusLabel(status) {
  const labels = {
    active: '活跃',
    acknowledged: '已确认',
    resolved: '已解决'
  }
  return labels[status] || status
}

function getPriorityType(priority) {
  const types = {
    low: 'info',
    medium: 'warning',
    high: 'danger'
  }
  return types[priority] || 'info'
}

function getPriorityLabel(priority) {
  const labels = {
    low: '低优先级',
    medium: '中优先级',
    high: '高优先级'
  }
  return labels[priority] || priority
}

function getOptTypeLabel(type) {
  const labels = {
    performance: '性能优化',
    reliability: '可靠性',
    quality: '质量提升',
    resource: '资源优化',
    ux: '用户体验'
  }
  return labels[type] || type
}

function getEffortLabel(effort) {
  const labels = {
    low: '低',
    medium: '中',
    high: '高'
  }
  return labels[effort] || effort
}

function formatTime(time) {
  if (!time) return '-'
  return new Date(time).toLocaleString('zh-CN')
}

// 生命周期
onMounted(() => {
  // 更新基准数据
  monitoringStore.updateBenchmarks()
  
  // 生成初始优化建议
  monitoringStore.generateOptimizationSuggestions()
  
  // 自动启动监控
  startMonitoring()
})

onUnmounted(() => {
  // 停止监控
  if (isMonitoring.value) {
    stopMonitoring()
  }
})
</script>

<style scoped>
.monitoring-dashboard {
  padding: 20px;
}

.health-overview {
  margin: 20px 0;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
}

.stat-icon.success {
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  color: white;
}

.stat-icon.warning {
  background: linear-gradient(135deg, #e6a23c 0%, #ebb563 100%);
  color: white;
}

.stat-icon.danger {
  background: linear-gradient(135deg, #f56c6c 0%, #f78989 100%);
  color: white;
}

.stat-icon.info {
  background: linear-gradient(135deg, #409eff 0%, #66b1ff 100%);
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.stat-value.success {
  color: #67c23a;
}

.stat-value.warning {
  color: #e6a23c;
}

.stat-value.danger {
  color: #f56c6c;
}

.stat-trend {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.stat-trend.critical {
  color: #f56c6c;
  font-weight: bold;
}

.main-tabs {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  padding: 10px 0;
}

.stat-item {
  text-align: center;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
}

.stat-item .label {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-item .value {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
}

.suggestion-card {
  margin-bottom: 15px;
}

.suggestion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.suggestion-title {
  font-size: 18px;
  font-weight: bold;
  margin-left: 10px;
}

.suggestion-description {
  color: #606266;
  margin: 10px 0;
}

.suggestion-meta {
  display: flex;
  gap: 10px;
  margin: 15px 0;
}

.suggestion-actions h4 {
  margin: 15px 0 10px 0;
  color: #303133;
}

.suggestion-actions ul {
  margin: 0;
  padding-left: 20px;
}

.suggestion-actions li {
  margin: 8px 0;
  color: #606266;
}
</style>
