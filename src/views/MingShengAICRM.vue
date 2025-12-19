<template>
  <div class="mingsheng-aicrm">
    <!-- Salesforce风格顶部导航栏 -->
    <div class="crm-navbar">
      <div class="navbar-left">
        <div class="logo-section">
          <el-icon :size="32" color="#fff"><TrendCharts /></el-icon>
          <div class="logo-text">
            <h1>明升AICRM</h1>
            <span class="subtitle">智能营销获客平台</span>
          </div>
        </div>
        
        <!-- 全局导航 -->
        <el-menu mode="horizontal" :default-active="activeView" @select="handleMenuSelect" class="global-nav">
          <el-menu-item index="dashboard">
            <el-icon><TrendCharts /></el-icon>
            <span>销售漏斗</span>
          </el-menu-item>
          <el-menu-item index="customers">
            <el-icon><User /></el-icon>
            <span>客户360°</span>
          </el-menu-item>
          <el-menu-item index="opportunities">
            <el-icon><Opportunity /></el-icon>
            <span>商机管理</span>
          </el-menu-item>
          <el-menu-item index="activities">
            <el-icon><Clock /></el-icon>
            <span>客户活动</span>
          </el-menu-item>
          <el-menu-item index="reports">
            <el-icon><DataAnalysis /></el-icon>
            <span>数据报表</span>
          </el-menu-item>
          <el-menu-item index="aiInsights">
            <el-icon><Histogram /></el-icon>
            <span>AI洞察</span>
          </el-menu-item>
        </el-menu>
      </div>
      
      <div class="navbar-right">
        <!-- 搜索框 -->
        <el-input 
          v-model="globalSearch" 
          placeholder="全局搜索客户、商机..." 
          clearable
          style="width: 300px;"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
        <!-- AI推荐任务通知 -->
        <el-badge :value="aiTaskCount" :max="99" class="navbar-badge">
          <el-button circle @click="showAITasks">
            <el-icon :size="20"><Lightning /></el-icon>
          </el-button>
        </el-badge>
        
        <!-- 待办任务 -->
        <el-badge :value="pendingTasks" :max="99" class="navbar-badge">
          <el-button circle @click="activeView = 'tasks'">
            <el-icon :size="20"><Bell /></el-icon>
          </el-button>
        </el-badge>
        
        <!-- 用户菜单 -->
        <el-dropdown @command="handleCommand">
          <div class="user-avatar">
            <el-avatar :size="40" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            <span class="user-name">销售经理</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><User /></el-icon>
                个人设置
              </el-dropdown-item>
              <el-dropdown-item command="help">
                <el-icon><QuestionFilled /></el-icon>
                帮助中心
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <el-icon><SwitchButton /></el-icon>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="crm-main-content">
      <!-- 销售漏斗Dashboard -->
      <div v-if="activeView === 'dashboard'" class="funnel-dashboard">
        <div class="dashboard-grid">
          <!-- DB-01: 商机总览 -->
          <el-card class="dashboard-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>🎯 商机总览</span>
                <el-button text @click="refreshOpportunities">
                  <el-icon><Refresh /></el-icon>
                </el-button>
              </div>
            </template>
            <div class="funnel-chart">
              <div v-for="stage in opportunityStages" :key="stage.name" class="stage-item">
                <div class="stage-name">{{ stage.name }}</div>
                <div class="stage-bar">
                  <div class="stage-fill" :style="{ width: stage.percentage + '%' }"></div>
                </div>
                <div class="stage-info">
                  <span>{{ stage.count }}个</span>
                  <span>¥{{ stage.amount }}万</span>
                </div>
              </div>
            </div>
          </el-card>

          <!-- DB-02: AI赢率预测 -->
          <el-card class="dashboard-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>🤖 AI赢率预测</span>
                <el-tag size="small" type="success">轻量模型</el-tag>
              </div>
            </template>
            <div class="prediction-list">
              <div v-for="pred in winratePredictions" :key="pred.id" class="prediction-item">
                <div class="pred-company">{{ pred.company }}</div>
                <el-progress :percentage="pred.winrate" :color="getWinrateColor(pred.winrate)" />
                <div class="pred-stage">{{ pred.stage }}</div>
              </div>
            </div>
          </el-card>

          <!-- DB-03: 客户动态 -->
          <el-card class="dashboard-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>🔥 客户动态</span>
                <el-badge value="实时" class="realtime-badge"></el-badge>
              </div>
            </template>
            <div class="customer-activities">
              <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
                <el-avatar :size="32" :src="activity.avatar"></el-avatar>
                <div class="activity-content">
                  <div class="activity-header">
                    <strong>{{ activity.customer }}</strong>
                    <span class="activity-time">{{ activity.time }}</span>
                  </div>
                  <div class="activity-detail">
                    <el-tag :type="getActivityType(activity.type)" size="small">{{ activity.type }}</el-tag>
                    <span>{{ activity.detail }}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-card>

          <!-- DB-04: AI推荐任务 -->
          <el-card class="dashboard-card ai-tasks" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>✨ AI推荐任务</span>
                <el-tag size="small" type="warning">{{ aiRecommendedTasks.length }}待确认</el-tag>
              </div>
            </template>
            <div class="task-list">
              <div v-for="task in aiRecommendedTasks" :key="task.id" class="task-item">
                <div class="task-priority">
                  <el-tag :type="getPriorityType(task.priority)">{{ task.priority }}</el-tag>
                </div>
                <div class="task-info">
                  <div class="task-title">{{ task.title }}</div>
                  <div class="task-customer">客户：{{ task.customer }}</div>
                  <div class="task-reason">AI建议：{{ task.reason }}</div>
                </div>
                <div class="task-actions">
                  <el-button size="small" type="success" @click="confirmTask(task)">
                    <el-icon><Check /></el-icon>
                    执行
                  </el-button>
                  <el-button size="small" @click="ignoreTask(task)">
                    <el-icon><Close /></el-icon>
                    忽略
                  </el-button>
                </div>
              </div>
            </div>
          </el-card>

          <!-- DB-05: KPI面板 -->
          <el-card class="dashboard-card kpi-panel" shadow="hover">
            <template #header>
              <span>📈 关键指标</span>
            </template>
            <el-row :gutter="20">
              <el-col :span="8" v-for="kpi in kpiMetrics" :key="kpi.name">
                <div class="kpi-item">
                  <div class="kpi-icon" :style="{ background: kpi.color }">
                    <el-icon :size="24">
                      <component :is="kpi.icon"></component>
                    </el-icon>
                  </div>
                  <div class="kpi-content">
                    <div class="kpi-value">{{ kpi.value }}{{ kpi.unit }}</div>
                    <div class="kpi-name">{{ kpi.name }}</div>
                    <div class="kpi-trend" :class="{ positive: kpi.trend > 0 }">
                      <el-icon><CaretTop v-if="kpi.trend > 0" /><CaretBottom v-else /></el-icon>
                      {{ Math.abs(kpi.trend) }}%
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- 客户画像页 -->
      <el-tab-pane label="👤 客户360°" name="customers">
        <div class="customer-view">
          <div class="customer-sidebar">
            <el-input v-model="customerSearch" placeholder="搜索客户" clearable>
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <div class="customer-list">
              <div v-for="customer in filteredCustomers" :key="customer.id" 
                   class="customer-list-item"
                   :class="{ active: selectedCustomer?.id === customer.id }"
                   @click="selectCustomer(customer)">
                <el-avatar :size="40" :src="customer.avatar"></el-avatar>
                <div class="customer-info">
                  <div class="customer-name">{{ customer.name }}</div>
                  <div class="customer-company">{{ customer.company }}</div>
                </div>
                <el-tag v-if="customer.intentScore" :type="getIntentType(customer.intentScore)" size="small">
                  {{ customer.intentScore }}级
                </el-tag>
              </div>
            </div>
          </div>

          <div class="customer-detail" v-if="selectedCustomer">
            <!-- CP-01: 基本信息 -->
            <el-card class="detail-card">
              <template #header>
                <span>📋 基本信息</span>
              </template>
              <el-descriptions :column="2" border>
                <el-descriptions-item label="姓名">{{ selectedCustomer.name }}</el-descriptions-item>
                <el-descriptions-item label="手机号">{{ selectedCustomer.phone }}</el-descriptions-item>
                <el-descriptions-item label="公司">{{ selectedCustomer.company }}</el-descriptions-item>
                <el-descriptions-item label="生命周期阶段">
                  <el-tag>{{ selectedCustomer.lifecycleStage }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="标签" :span="2">
                  <el-tag v-for="tag in selectedCustomer.tags" :key="tag" class="mr-2">{{ tag }}</el-tag>
                </el-descriptions-item>
              </el-descriptions>
            </el-card>

            <!-- CP-02: 行为轨迹 -->
            <el-card class="detail-card">
              <template #header>
                <span>🕒 行为轨迹</span>
              </template>
              <el-timeline>
                <el-timeline-item v-for="event in selectedCustomer.behaviorTimeline" :key="event.id" 
                                  :timestamp="event.timestamp" placement="top">
                  <el-tag :type="getEventTypeColor(event.type)" size="small">{{ event.type }}</el-tag>
                  <span class="ml-2">{{ event.detail }}</span>
                </el-timeline-item>
              </el-timeline>
            </el-card>

            <!-- CP-03: AI预测 -->
            <el-card class="detail-card ai-prediction">
              <template #header>
                <span>🤖 AI智能预测</span>
              </template>
              <div class="prediction-grid">
                <div class="prediction-box">
                  <div class="prediction-title">意向评分</div>
                  <div class="prediction-score" :class="'score-' + selectedCustomer.intentScore">
                    {{ selectedCustomer.intentScore }}级
                  </div>
                  <el-progress :percentage="getIntentPercentage(selectedCustomer.intentScore)" 
                               :color="getIntentColor(selectedCustomer.intentScore)" />
                </div>
                <div class="prediction-box">
                  <div class="prediction-title">风险标签</div>
                  <div class="risk-tags">
                    <el-tag v-for="risk in selectedCustomer.riskTags" :key="risk" type="danger" size="small">
                      {{ risk }}
                    </el-tag>
                    <el-tag v-if="!selectedCustomer.riskTags.length" type="success" size="small">
                      无风险
                    </el-tag>
                  </div>
                </div>
              </div>
            </el-card>

            <!-- CP-04: 推荐动作 -->
            <el-card class="detail-card">
              <template #header>
                <span>✨ AI推荐动作</span>
              </template>
              <div class="recommended-actions">
                <div v-for="action in selectedCustomer.recommendedActions" :key="action.id" class="action-item">
                  <el-icon :size="20" color="#409EFF"><Lightning /></el-icon>
                  <div class="action-content">
                    <div class="action-title">{{ action.title }}</div>
                    <div class="action-reason">{{ action.reason }}</div>
                  </div>
                  <el-button type="primary" size="small" @click="executeAction(action)">执行</el-button>
                </div>
              </div>
            </el-card>

            <!-- CP-05: CRM快速操作 -->
            <el-card class="detail-card">
              <template #header>
                <span>⚡ 快速操作</span>
              </template>
              <el-space wrap>
                <el-button @click="createTask(selectedCustomer)">
                  <el-icon><Plus /></el-icon>
                  创建任务
                </el-button>
                <el-button @click="sendMessage(selectedCustomer)">
                  <el-icon><ChatDotRound /></el-icon>
                  发送消息
                </el-button>
                <el-button @click="scheduleCall(selectedCustomer)">
                  <el-icon><Phone /></el-icon>
                  预约电话
                </el-button>
                <el-button @click="updateStage(selectedCustomer)">
                  <el-icon><Promotion /></el-icon>
                  更新阶段
                </el-button>
              </el-space>
            </el-card>
          </div>
        </div>
      </el-tab-pane>

      <!-- 商机页 -->
      <el-tab-pane label="💼 商机管理" name="opportunities">
        <div class="opportunity-view">
          <div class="toolbar">
            <el-button type="primary" @click="createOpportunity">
              <el-icon><Plus /></el-icon>
              新建商机
            </el-button>
            <el-select v-model="opportunityFilter" placeholder="筛选阶段" clearable style="width: 200px;">
              <el-option label="初步接触" value="initial" />
              <el-option label="需求确认" value="requirement" />
              <el-option label="方案报价" value="proposal" />
              <el-option label="商务谈判" value="negotiation" />
              <el-option label="合同签订" value="contract" />
            </el-select>
          </div>

          <el-table :data="filteredOpportunities" border stripe>
            <el-table-column type="expand">
              <template #default="{ row }">
                <div class="opportunity-expand">
                  <!-- OP-02: 决策链状态 -->
                  <div class="decision-chain">
                    <h4>决策链状态</h4>
                    <div class="chain-status">
                      <div v-for="role in row.decisionChain" :key="role.name" class="chain-role">
                        <el-tag :type="role.contacted ? 'success' : 'info'">
                          {{ role.name }}
                        </el-tag>
                        <el-icon v-if="role.contacted" color="#67C23A"><Check /></el-icon>
                        <el-icon v-else color="#909399"><Warning /></el-icon>
                      </div>
                    </div>
                    <div class="missing-roles" v-if="row.missingRoles.length">
                      <el-alert type="warning" :closable="false">
                        <template #title>
                          缺失环节：{{ row.missingRoles.join('、') }}
                        </template>
                      </el-alert>
                    </div>
                  </div>

                  <!-- OP-03: AI推荐动作 -->
                  <div class="ai-recommendations">
                    <h4>AI推荐动作</h4>
                    <div v-for="action in row.aiRecommendations" :key="action.id" class="recommendation-item">
                      <el-tag :type="getPriorityType(action.priority)" size="small">{{ action.priority }}</el-tag>
                      <span class="action-text">{{ action.action }}</span>
                      <el-button size="small" type="primary" @click="confirmOpportunityAction(row, action)">
                        确认执行
                      </el-button>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="company" label="公司名称" min-width="150" />
            <el-table-column prop="stage" label="阶段" width="120">
              <template #default="{ row }">
                <el-tag>{{ row.stage }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="金额" width="120">
              <template #default="{ row }">
                ¥{{ row.amount }}万
              </template>
            </el-table-column>
            <el-table-column prop="winrate" label="AI预测赢率" width="150">
              <template #default="{ row }">
                <el-progress :percentage="row.winrate" :color="getWinrateColor(row.winrate)" />
              </template>
            </el-table-column>
            <el-table-column prop="createdAt" label="创建时间" width="160" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button size="small" type="primary" @click="editOpportunity(row)">编辑</el-button>
                <el-button size="small" @click="viewOpportunityDetail(row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <!-- 自动化流程 -->
      <el-tab-pane label="⚙️ 自动化流程" name="automation">
        <div class="automation-view">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>自动化工作流配置</span>
                <el-switch v-model="automationEnabled" active-text="启用" inactive-text="禁用" />
              </div>
            </template>

            <div class="workflow-diagram">
              <div class="workflow-node" v-for="node in workflowNodes" :key="node.id" 
                   :class="{ 'ai-node': node.type === 'AI', 'manual-node': node.type === '人工', 'system-node': node.type === '系统' }">
                <div class="node-header">
                  <el-tag :type="getNodeType(node.type)">{{ node.code }}</el-tag>
                  <span class="node-name">{{ node.name }}</span>
                </div>
                <div class="node-content">
                  <div class="node-detail">触发：{{ node.trigger }}</div>
                  <div class="node-detail">动作：{{ node.action }}</div>
                </div>
                <el-icon class="node-arrow"><Right /></el-icon>
              </div>
            </div>

            <el-divider />

            <div class="workflow-stats">
              <h3>流程执行统计</h3>
              <el-row :gutter="20">
                <el-col :span="6" v-for="stat in workflowStats" :key="stat.name">
                  <el-statistic :title="stat.name" :value="stat.value" :suffix="stat.suffix">
                    <template #prefix>
                      <el-icon :color="stat.color">
                        <component :is="stat.icon"></component>
                      </el-icon>
                    </template>
                  </el-statistic>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- 待办任务 -->
      <el-tab-pane label="📝 待办任务" name="tasks">
        <div class="tasks-view">
          <div class="task-filters">
            <el-radio-group v-model="taskFilter">
              <el-radio-button label="all">全部</el-radio-button>
              <el-radio-button label="ai">AI推荐</el-radio-button>
              <el-radio-button label="manual">手动创建</el-radio-button>
              <el-radio-button label="pending">待确认</el-radio-button>
              <el-radio-button label="completed">已完成</el-radio-button>
            </el-radio-group>
          </div>

          <el-table :data="filteredTasks" border>
            <el-table-column prop="title" label="任务标题" min-width="200" />
            <el-table-column prop="customer" label="客户" width="150" />
            <el-table-column prop="priority" label="优先级" width="100">
              <template #default="{ row }">
                <el-tag :type="getPriorityType(row.priority)">{{ row.priority }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="source" label="来源" width="100">
              <template #default="{ row }">
                <el-tag :type="row.source === 'AI' ? 'success' : 'info'">{{ row.source }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="dueDate" label="截止时间" width="160" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getTaskStatusType(row.status)">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button v-if="row.status === '待确认'" size="small" type="success" @click="confirmTaskExecution(row)">
                  确认执行
                </el-button>
                <el-button v-if="row.status === '进行中'" size="small" type="primary" @click="completeTask(row)">
                  完成
                </el-button>
                <el-button size="small" @click="viewTaskDetail(row)">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

// 当前视图
const activeView = ref('dashboard')
const customerSearch = ref('')
const opportunityFilter = ref('')
const taskFilter = ref('all')
const automationEnabled = ref(true)

// 商机阶段数据
const opportunityStages = ref([
  { name: '初步接触', count: 15, amount: 230, percentage: 100 },
  { name: '需求确认', count: 12, amount: 180, percentage: 80 },
  { name: '方案报价', count: 8, amount: 150, percentage: 53 },
  { name: '商务谈判', count: 5, amount: 120, percentage: 33 },
  { name: '合同签订', count: 2, amount: 80, percentage: 13 }
])

// AI赢率预测
const winratePredictions = ref([
  { id: 1, company: '某汽车零部件厂', winrate: 85, stage: '商务谈判' },
  { id: 2, company: '某电子设备公司', winrate: 72, stage: '方案报价' },
  { id: 3, company: '某机械制造企业', winrate: 58, stage: '需求确认' }
])

// 客户动态
const recentActivities = ref([
  { id: 1, customer: '张经理', avatar: '', type: '浏览报价', detail: '查看了伺服驱动器报价页面', time: '5分钟前' },
  { id: 2, customer: '李总', avatar: '', type: '下载资料', detail: '下载了产品白皮书', time: '15分钟前' },
  { id: 3, customer: '王工', avatar: '', type: '咨询', detail: '通过企业微信咨询技术问题', time: '1小时前' }
])

// AI推荐任务
const aiRecommendedTasks = ref([
  { id: 1, priority: '高', title: '向张经理发送定制方案', customer: '张经理', reason: '客户已浏览报价3次，意向评分A级' },
  { id: 2, priority: '中', title: '跟进李总合同进度', customer: '李总', reason: '距上次联系已7天，商机处于关键阶段' },
  { id: 3, priority: '中', title: '推送案例给王工', customer: '王工', reason: '客户咨询了技术问题，推荐相关成功案例' }
])

// KPI指标
const kpiMetrics = ref([
  { name: '线索转化率', value: 28, unit: '%', trend: 5, color: '#67C23A', icon: 'TrendCharts' },
  { name: '触达效率', value: 92, unit: '%', trend: 3, color: '#409EFF', icon: 'Connection' },
  { name: '任务完成率', value: 85, unit: '%', trend: -2, color: '#E6A23C', icon: 'Checked' },
  { name: '平均响应时间', value: 12, unit: '分钟', trend: -8, color: '#F56C6C', icon: 'Timer' },
  { name: '本月新增商机', value: 45, unit: '个', trend: 12, color: '#909399', icon: 'Opportunity' },
  { name: '预计本月成交', value: 230, unit: '万', trend: 15, color: '#67C23A', icon: 'Money' }
])

// 客户列表
const customers = ref([
  {
    id: 1,
    name: '张经理',
    company: '某汽车零部件厂',
    phone: '138****1234',
    avatar: '',
    lifecycleStage: '商机阶段',
    tags: ['汽车行业', '大客户', 'VIP'],
    intentScore: 'A',
    riskTags: [],
    behaviorTimeline: [
      { id: 1, type: '浏览报价', detail: '查看伺服驱动器报价', timestamp: '2025-12-17 10:30' },
      { id: 2, type: '下载资料', detail: '下载产品白皮书', timestamp: '2025-12-17 09:15' },
      { id: 3, type: '咨询', detail: '咨询技术参数', timestamp: '2025-12-16 14:20' }
    ],
    recommendedActions: [
      { id: 1, title: '发送定制方案', reason: '客户已多次浏览报价，意向强烈' },
      { id: 2, title: '预约现场演示', reason: '客户关注技术细节，建议安排演示' }
    ]
  },
  {
    id: 2,
    name: '李总',
    company: '某电子设备公司',
    phone: '139****5678',
    avatar: '',
    lifecycleStage: '合同阶段',
    tags: ['电子行业', '老客户'],
    intentScore: 'A',
    riskTags: ['付款周期长'],
    behaviorTimeline: [
      { id: 1, type: '聊天', detail: '讨论合同条款', timestamp: '2025-12-15 16:00' }
    ],
    recommendedActions: [
      { id: 1, title: '跟进合同签署', reason: '距上次沟通已3天，需及时跟进' }
    ]
  },
  {
    id: 3,
    name: '王工',
    company: '某机械制造企业',
    phone: '137****9012',
    avatar: '',
    lifecycleStage: '线索阶段',
    tags: ['机械行业', '新客户'],
    intentScore: '中',
    riskTags: [],
    behaviorTimeline: [
      { id: 1, type: '咨询', detail: '咨询PLC编程服务', timestamp: '2025-12-17 11:00' }
    ],
    recommendedActions: [
      { id: 1, title: '推送成功案例', reason: '客户咨询技术问题，推荐相关案例提升信任' }
    ]
  }
])

const selectedCustomer = ref(null)

// 商机列表
const opportunities = ref([
  {
    id: 1,
    company: '某汽车零部件厂',
    stage: '商务谈判',
    amount: 80,
    winrate: 85,
    createdAt: '2025-12-01',
    decisionChain: [
      { name: '技术负责人', contacted: true },
      { name: '采购经理', contacted: true },
      { name: '总经理', contacted: false }
    ],
    missingRoles: ['总经理'],
    aiRecommendations: [
      { id: 1, priority: '高', action: '安排总经理会议，展示ROI分析' }
    ]
  },
  {
    id: 2,
    company: '某电子设备公司',
    stage: '合同签订',
    amount: 120,
    winrate: 92,
    createdAt: '2025-11-15',
    decisionChain: [
      { name: '技术负责人', contacted: true },
      { name: '采购经理', contacted: true },
      { name: '财务总监', contacted: true }
    ],
    missingRoles: [],
    aiRecommendations: [
      { id: 1, priority: '中', action: '准备合同文件，安排签约仪式' }
    ]
  }
])

// 工作流节点
const workflowNodes = ref([
  { id: 1, code: 'WF-01', name: '新线索捕获', type: 'AI', trigger: '微信扫码/表单提交', action: '生成CRM商机 + 意向评分' },
  { id: 2, code: 'WF-02', name: '客户ID归一化', type: '系统', trigger: 'OpenID ↔ CRM ID完成', action: '数据标准化 + 标签化' },
  { id: 3, code: 'WF-03', name: 'AI分析', type: 'AI', trigger: '新事件或商机更新', action: '赢率预测、意向评分、风险标签' },
  { id: 4, code: 'WF-04', name: '推荐行动', type: 'AI', trigger: 'AI分析完成', action: '生成任务列表' },
  { id: 5, code: 'WF-05', name: '半自动执行', type: '人工', trigger: '销售确认', action: '完成任务或发送消息' },
  { id: 6, code: 'WF-06', name: '行为反馈', type: '系统', trigger: '任务完成', action: '数据回流，优化AI' }
])

// 工作流统计
const workflowStats = ref([
  { name: '今日触发次数', value: 156, suffix: '次', color: '#409EFF', icon: 'Notification' },
  { name: 'AI推荐准确率', value: 87, suffix: '%', color: '#67C23A', icon: 'CircleCheck' },
  { name: '人工确认率', value: 92, suffix: '%', color: '#E6A23C', icon: 'Select' },
  { name: '任务完成率', value: 85, suffix: '%', color: '#F56C6C', icon: 'SuccessFilled' }
])

// 任务列表
const tasks = ref([
  { id: 1, title: '向张经理发送定制方案', customer: '张经理', priority: '高', source: 'AI', dueDate: '2025-12-18', status: '待确认' },
  { id: 2, title: '跟进李总合同进度', customer: '李总', priority: '中', source: 'AI', dueDate: '2025-12-18', status: '进行中' },
  { id: 3, title: '准备王工技术演示', customer: '王工', priority: '中', source: '手动', dueDate: '2025-12-19', status: '待确认' },
  { id: 4, title: '整理本周销售报表', customer: '-', priority: '低', source: '手动', dueDate: '2025-12-20', status: '已完成' }
])

// 计算属性
const pendingTasks = computed(() => {
  return tasks.value.filter(t => t.status === '待确认').length
})

const filteredCustomers = computed(() => {
  if (!customerSearch.value) return customers.value
  const keyword = customerSearch.value.toLowerCase()
  return customers.value.filter(c => 
    c.name.toLowerCase().includes(keyword) ||
    c.company.toLowerCase().includes(keyword) ||
    c.phone.includes(keyword)
  )
})

const filteredOpportunities = computed(() => {
  if (!opportunityFilter.value) return opportunities.value
  return opportunities.value.filter(o => o.stage === opportunityFilter.value)
})

const filteredTasks = computed(() => {
  if (taskFilter.value === 'all') return tasks.value
  if (taskFilter.value === 'ai') return tasks.value.filter(t => t.source === 'AI')
  if (taskFilter.value === 'manual') return tasks.value.filter(t => t.source === '手动')
  if (taskFilter.value === 'pending') return tasks.value.filter(t => t.status === '待确认')
  if (taskFilter.value === 'completed') return tasks.value.filter(t => t.status === '已完成')
  return tasks.value
})

// 方法
const getWinrateColor = (rate) => {
  if (rate >= 80) return '#67C23A'
  if (rate >= 60) return '#409EFF'
  if (rate >= 40) return '#E6A23C'
  return '#F56C6C'
}

const getActivityType = (type) => {
  const map = { '浏览报价': 'primary', '下载资料': 'success', '咨询': 'warning', '聊天': 'info' }
  return map[type] || ''
}

const getPriorityType = (priority) => {
  const map = { '高': 'danger', '中': 'warning', '低': 'info' }
  return map[priority] || 'info'
}

const getIntentType = (score) => {
  const map = { 'A': 'danger', '中': 'warning', '低': 'info' }
  return map[score] || 'info'
}

const getIntentPercentage = (score) => {
  const map = { 'A': 90, '中': 60, '低': 30 }
  return map[score] || 0
}

const getIntentColor = (score) => {
  const map = { 'A': '#67C23A', '中': '#E6A23C', '低': '#909399' }
  return map[score] || '#909399'
}

const getEventTypeColor = (type) => {
  const map = { '浏览报价': 'primary', '下载资料': 'success', '咨询': 'warning', '聊天': 'info' }
  return map[type] || ''
}

const getNodeType = (type) => {
  const map = { 'AI': 'success', '人工': 'primary', '系统': 'info' }
  return map[type] || 'info'
}

const getTaskStatusType = (status) => {
  const map = { '待确认': 'warning', '进行中': 'primary', '已完成': 'success' }
  return map[status] || 'info'
}

const refreshOpportunities = () => {
  ElMessage.success('商机数据已刷新')
}

const confirmTask = (task) => {
  ElMessage.success(`已确认执行任务：${task.title}`)
  const index = aiRecommendedTasks.value.findIndex(t => t.id === task.id)
  if (index > -1) {
    aiRecommendedTasks.value.splice(index, 1)
  }
}

const ignoreTask = (task) => {
  ElMessage.info(`已忽略任务：${task.title}`)
  const index = aiRecommendedTasks.value.findIndex(t => t.id === task.id)
  if (index > -1) {
    aiRecommendedTasks.value.splice(index, 1)
  }
}

const selectCustomer = (customer) => {
  selectedCustomer.value = customer
}

const executeAction = (action) => {
  ElMessage.success(`正在执行：${action.title}`)
}

const createTask = (customer) => {
  ElMessage.success(`为 ${customer.name} 创建任务`)
}

const sendMessage = (customer) => {
  ElMessage.success(`向 ${customer.name} 发送消息`)
}

const scheduleCall = (customer) => {
  ElMessage.success(`预约与 ${customer.name} 的电话`)
}

const updateStage = (customer) => {
  ElMessage.success(`更新 ${customer.name} 的阶段`)
}

const createOpportunity = () => {
  ElMessage.info('打开新建商机对话框')
}

const editOpportunity = (opp) => {
  ElMessage.info(`编辑商机：${opp.company}`)
}

const viewOpportunityDetail = (opp) => {
  ElMessage.info(`查看商机详情：${opp.company}`)
}

const confirmOpportunityAction = (opp, action) => {
  ElMessage.success(`确认执行：${action.action}`)
}

const confirmTaskExecution = (task) => {
  task.status = '进行中'
  ElMessage.success(`任务已开始执行：${task.title}`)
}

const completeTask = (task) => {
  task.status = '已完成'
  ElMessage.success(`任务已完成：${task.title}`)
}

const viewTaskDetail = (task) => {
  ElMessage.info(`查看任务详情：${task.title}`)
}

const handleCommand = (command) => {
  if (command === 'logout') {
    ElMessage.success('已退出登录')
  }
}
</script>

<style scoped>
.mingsheng-aicrm {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 40px;
}

.crm-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.header-left h1 {
  color: white;
  margin: 0;
  font-size: 28px;
  font-weight: 700;
}

.tagline {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  display: block;
  margin-top: 5px;
}

.header-right {
  display: flex;
  gap: 20px;
  align-items: center;
}

.task-badge {
  margin-right: 10px;
}

.main-tabs {
  margin: 20px 40px;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.dashboard-card {
  height: 100%;
}

.dashboard-card.ai-tasks {
  grid-column: span 2;
}

.dashboard-card.kpi-panel {
  grid-column: span 2;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.funnel-chart {
  padding: 10px 0;
}

.stage-item {
  margin: 15px 0;
}

.stage-name {
  font-weight: 600;
  margin-bottom: 8px;
  color: #303133;
}

.stage-bar {
  height: 24px;
  background: #f5f7fa;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 5px;
}

.stage-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s;
}

.stage-info {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}

.prediction-list, .customer-activities, .task-list {
  max-height: 400px;
  overflow-y: auto;
}

.prediction-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.pred-company {
  font-weight: 600;
  margin-bottom: 8px;
}

.pred-stage {
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
}

.activity-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.activity-content {
  flex: 1;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.activity-time {
  font-size: 12px;
  color: #909399;
}

.activity-detail {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
}

.ml-2 {
  margin-left: 8px;
}

.mr-2 {
  margin-right: 8px;
}

.task-item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 15px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  margin-bottom: 10px;
  background: #fafafa;
  transition: all 0.3s;
}

.task-item:hover {
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.task-info {
  flex: 1;
}

.task-title {
  font-weight: 600;
  margin-bottom: 5px;
}

.task-customer, .task-reason {
  font-size: 12px;
  color: #909399;
  margin: 3px 0;
}

.task-actions {
  display: flex;
  gap: 8px;
}

.kpi-item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 15px;
  background: #fafafa;
  border-radius: 8px;
  transition: all 0.3s;
}

.kpi-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.kpi-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.kpi-value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
}

.kpi-name {
  font-size: 12px;
  color: #909399;
  margin: 5px 0;
}

.kpi-trend {
  font-size: 12px;
  color: #f56c6c;
  display: flex;
  align-items: center;
  gap: 4px;
}

.kpi-trend.positive {
  color: #67c23a;
}

.customer-view {
  display: flex;
  gap: 20px;
}

.customer-sidebar {
  width: 300px;
  background: #fafafa;
  border-radius: 8px;
  padding: 15px;
}

.customer-list {
  margin-top: 15px;
  max-height: 600px;
  overflow-y: auto;
}

.customer-list-item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 8px;
}

.customer-list-item:hover {
  background: white;
}

.customer-list-item.active {
  background: #ecf5ff;
  border: 1px solid #409eff;
}

.customer-info {
  flex: 1;
}

.customer-name {
  font-weight: 600;
}

.customer-company {
  font-size: 12px;
  color: #909399;
}

.customer-detail {
  flex: 1;
}

.detail-card {
  margin-bottom: 20px;
}

.ai-prediction .prediction-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.prediction-box {
  text-align: center;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
}

.prediction-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 10px;
}

.prediction-score {
  font-size: 32px;
  font-weight: 700;
  margin: 10px 0;
}

.score-A {
  color: #67c23a;
}

.score-中 {
  color: #e6a23c;
}

.score-低 {
  color: #909399;
}

.risk-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.recommended-actions .action-item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  margin-bottom: 10px;
}

.action-content {
  flex: 1;
}

.action-title {
  font-weight: 600;
  margin-bottom: 5px;
}

.action-reason {
  font-size: 12px;
  color: #909399;
}

.opportunity-view .toolbar {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.opportunity-expand {
  padding: 20px;
  background: #fafafa;
}

.decision-chain, .ai-recommendations {
  margin-bottom: 20px;
}

.decision-chain h4, .ai-recommendations h4 {
  margin-bottom: 15px;
}

.chain-status {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.chain-role {
  display: flex;
  align-items: center;
  gap: 8px;
}

.missing-roles {
  margin-top: 15px;
}

.recommendation-item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  margin-bottom: 8px;
}

.action-text {
  flex: 1;
}

.workflow-diagram {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin: 20px 0;
}

.workflow-node {
  position: relative;
  width: 200px;
  padding: 15px;
  border-radius: 8px;
  border: 2px solid #e4e7ed;
  background: white;
}

.workflow-node.ai-node {
  border-color: #67c23a;
  background: #f0f9ff;
}

.workflow-node.manual-node {
  border-color: #409eff;
  background: #ecf5ff;
}

.workflow-node.system-node {
  border-color: #909399;
  background: #f4f4f5;
}

.node-header {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 10px;
}

.node-name {
  font-weight: 600;
}

.node-detail {
  font-size: 12px;
  color: #606266;
  margin: 5px 0;
}

.node-arrow {
  position: absolute;
  right: -25px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 20px;
  color: #909399;
}

.workflow-stats h3 {
  margin-bottom: 20px;
}

.tasks-view .task-filters {
  margin-bottom: 20px;
}
</style>
