<template>
  <div class="aicrm-enhanced">
    <!-- Salesforce风格全局导航栏 -->
    <div class="global-header">
      <div class="header-brand">
        <el-icon :size="32" color="#1E90FF"><TrendCharts /></el-icon>
        <div class="brand-text">
          <h1>明升 AICRM</h1>
          <span>AI驱动智能营销平台</span>
        </div>
      </div>

      <!-- 主导航 -->
      <el-menu 
        mode="horizontal" 
        :default-active="activeTab"
        @select="handleTabChange"
        class="main-menu"
      >
        <el-menu-item index="funnel">
          <el-icon><Filter /></el-icon>
          <span>销售漏斗</span>
        </el-menu-item>
        <el-menu-item index="customer360">
          <el-icon><User /></el-icon>
          <span>客户360°</span>
        </el-menu-item>
        <el-menu-item index="opportunities">
          <el-icon><Money /></el-icon>
          <span>商机管理</span>
        </el-menu-item>
        <el-menu-item index="activities">
          <el-icon><Clock /></el-icon>
          <span>客户活动</span>
        </el-menu-item>
        <el-menu-item index="aiAgent">
          <el-icon><MagicStick /></el-icon>
          <span>AI智能体</span>
        </el-menu-item>
        <el-menu-item index="reports">
          <el-icon><DataAnalysis /></el-icon>
          <span>数据报表</span>
        </el-menu-item>
      </el-menu>

      <!-- 工具栏 -->
      <div class="header-toolbar">
        <el-input
          v-model="globalSearch"
          placeholder="搜索客户、商机、活动..."
          clearable
          style="width: 300px;"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-badge :value="aiTaskCount" :max="99" class="ml-4">
          <el-button circle @click="showAIRecommendations">
            <el-icon :size="18" color="#FFA500"><Lightning /></el-icon>
          </el-button>
        </el-badge>

        <el-badge :value="unreadCount" :max="99">
          <el-button circle>
            <el-icon :size="18"><Bell /></el-icon>
          </el-button>
        </el-badge>

        <el-dropdown @command="handleUserCommand">
          <div class="user-info">
            <el-avatar :size="36">销</el-avatar>
            <span>销售经理</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">个人设置</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 销售漏斗视图 -->
      <div v-show="activeTab === 'funnel'" class="funnel-view">
        <div class="view-header">
          <h2>📊 销售漏斗分析</h2>
          <div class="header-actions">
            <el-select v-model="funnelPeriod" style="width: 150px;">
              <el-option label="本月" value="month" />
              <el-option label="本季度" value="quarter" />
              <el-option label="本年" value="year" />
            </el-select>
            <el-button type="primary" @click="refreshFunnel">
              <el-icon><Refresh /></el-icon>
              刷新数据
            </el-button>
          </div>
        </div>

        <!-- KPI指标卡片 -->
        <el-row :gutter="20" class="kpi-cards">
          <el-col :span="6" v-for="kpi in kpiMetrics" :key="kpi.id">
            <el-card class="kpi-card" :body-style="{ padding: '20px' }">
              <div class="kpi-header">
                <el-icon :size="24" :color="kpi.color">
                  <component :is="kpi.icon" />
                </el-icon>
                <span class="kpi-title">{{ kpi.title }}</span>
              </div>
              <div class="kpi-value">{{ kpi.value }}</div>
              <div class="kpi-trend" :class="kpi.trend > 0 ? 'positive' : 'negative'">
                <el-icon><component :is="kpi.trend > 0 ? 'CaretTop' : 'CaretBottom'" /></el-icon>
                {{ Math.abs(kpi.trend) }}% {{ kpi.trendLabel }}
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 漏斗可视化 -->
        <el-row :gutter="20" class="mt-4">
          <el-col :span="16">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>销售漏斗阶段转化</span>
                  <el-tag>总商机：{{ totalOpportunities }}个</el-tag>
                </div>
              </template>
              <div class="funnel-chart">
                <div 
                  v-for="(stage, index) in funnelStages" 
                  :key="stage.name"
                  class="funnel-stage"
                  :style="{ 
                    width: 100 - (index * 15) + '%',
                    backgroundColor: stage.color + '20',
                    borderLeft: `4px solid ${stage.color}`
                  }"
                >
                  <div class="stage-info">
                    <span class="stage-name">{{ stage.name }}</span>
                    <span class="stage-count">{{ stage.count }}个</span>
                    <span class="stage-amount">¥{{ (stage.amount / 10000).toFixed(1) }}万</span>
                    <span class="stage-rate">{{ stage.conversionRate }}%</span>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card>
              <template #header>
                <span>🎯 AI智能预测</span>
              </template>
              <div class="ai-predictions">
                <div class="prediction-item">
                  <span class="label">预测本月成交：</span>
                  <span class="value success">¥{{ predictedRevenue }}万</span>
                </div>
                <div class="prediction-item">
                  <span class="label">赢率预测：</span>
                  <el-progress :percentage="winRatePrediction" :color="getProgressColor(winRatePrediction)" />
                </div>
                <div class="prediction-item">
                  <span class="label">高风险商机：</span>
                  <span class="value danger">{{ highRiskDeals }}个</span>
                </div>
                <div class="prediction-item">
                  <span class="label">推荐行动：</span>
                  <el-tag type="warning">{{ aiRecommendedActions }}</el-tag>
                </div>
              </div>

              <el-divider />

              <div class="quick-actions">
                <el-button type="primary" size="small" @click="viewAIInsights">
                  <el-icon><View /></el-icon>
                  查看AI洞察
                </el-button>
                <el-button size="small" @click="exportFunnelReport">
                  <el-icon><Download /></el-icon>
                  导出报表
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 商机列表 -->
        <el-card class="mt-4">
          <template #header>
            <div class="card-header">
              <span>🔥 重点关注商机</span>
              <el-button type="primary" size="small" @click="createOpportunity">
                <el-icon><Plus /></el-icon>
                新增商机
              </el-button>
            </div>
          </template>

          <el-table :data="topOpportunities" stripe>
            <el-table-column prop="name" label="商机名称" width="200" />
            <el-table-column prop="customer" label="客户" width="150" />
            <el-table-column prop="stage" label="阶段" width="120">
              <template #default="{ row }">
                <el-tag :type="getStageType(row.stage)">{{ row.stage }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="amount" label="金额" width="120">
              <template #default="{ row }">
                ¥{{ (row.amount / 10000).toFixed(1) }}万
              </template>
            </el-table-column>
            <el-table-column prop="winRate" label="赢率" width="120">
              <template #default="{ row }">
                <el-progress :percentage="row.winRate" :color="getProgressColor(row.winRate)" />
              </template>
            </el-table-column>
            <el-table-column prop="owner" label="负责人" width="100" />
            <el-table-column prop="closeDate" label="预计成交" width="120" />
            <el-table-column label="AI建议" width="200">
              <template #default="{ row }">
                <el-tooltip :content="row.aiSuggestion" placement="top">
                  <el-tag size="small" type="warning">
                    <el-icon><Lightning /></el-icon>
                    {{ row.aiAction }}
                  </el-tag>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button size="small" @click="viewOpportunity(row)">查看</el-button>
                <el-button size="small" type="primary" @click="followUp(row)">跟进</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>

      <!-- 客户360°视图 -->
      <div v-show="activeTab === 'customer360'" class="customer360-view">
        <div class="view-header">
          <h2>👤 客户360°画像</h2>
          <el-button type="primary" @click="createCustomer">
            <el-icon><Plus /></el-icon>
            新增客户
          </el-button>
        </div>

        <el-row :gutter="20">
          <!-- 客户列表 -->
          <el-col :span="8">
            <el-card>
              <template #header>
                <el-input 
                  v-model="customerSearch" 
                  placeholder="搜索客户..."
                  clearable
                >
                  <template #prefix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
              </template>

              <el-scrollbar height="600px">
                <div 
                  v-for="customer in filteredCustomers" 
                  :key="customer.id"
                  class="customer-item"
                  :class="{ active: selectedCustomer?.id === customer.id }"
                  @click="selectCustomer(customer)"
                >
                  <el-avatar :size="50">{{ customer.name.charAt(0) }}</el-avatar>
                  <div class="customer-info">
                    <div class="name">{{ customer.name }}</div>
                    <div class="company">{{ customer.company }}</div>
                    <div class="tags">
                      <el-tag size="small" :type="customer.level">{{ customer.levelLabel }}</el-tag>
                      <el-tag size="small" type="info">{{ customer.industry }}</el-tag>
                    </div>
                  </div>
                  <div class="customer-score">
                    <el-progress 
                      type="circle" 
                      :percentage="customer.score" 
                      :width="40"
                      :color="getProgressColor(customer.score)"
                    />
                  </div>
                </div>
              </el-scrollbar>
            </el-card>
          </el-col>

          <!-- 客户详情 -->
          <el-col :span="16" v-if="selectedCustomer">
            <el-card>
              <template #header>
                <div class="customer-header">
                  <div class="header-left">
                    <el-avatar :size="60">{{ selectedCustomer.name.charAt(0) }}</el-avatar>
                    <div class="header-info">
                      <h3>{{ selectedCustomer.name }}</h3>
                      <p>{{ selectedCustomer.company }} · {{ selectedCustomer.title }}</p>
                      <div class="contact-info">
                        <el-icon><Phone /></el-icon> {{ selectedCustomer.phone }}
                        <el-icon class="ml-3"><Message /></el-icon> {{ selectedCustomer.email }}
                      </div>
                    </div>
                  </div>
                  <div class="header-actions">
                    <el-button @click="callCustomer">
                      <el-icon><Phone /></el-icon>
                      拨打电话
                    </el-button>
                    <el-button @click="sendEmail">
                      <el-icon><Message /></el-icon>
                      发送邮件
                    </el-button>
                    <el-button type="primary" @click="createTask">
                      <el-icon><Plus /></el-icon>
                      创建任务
                    </el-button>
                  </div>
                </div>
              </template>

              <el-tabs>
                <!-- 基本信息 -->
                <el-tab-pane label="基本信息">
                  <el-descriptions :column="2" border>
                    <el-descriptions-item label="客户等级">
                      <el-tag :type="selectedCustomer.level">{{ selectedCustomer.levelLabel }}</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item label="客户评分">
                      <el-rate v-model="selectedCustomer.rating" disabled />
                    </el-descriptions-item>
                    <el-descriptions-item label="行业">{{ selectedCustomer.industry }}</el-descriptions-item>
                    <el-descriptions-item label="地区">{{ selectedCustomer.region }}</el-descriptions-item>
                    <el-descriptions-item label="公司规模">{{ selectedCustomer.companySize }}</el-descriptions-item>
                    <el-descriptions-item label="年营收">{{ selectedCustomer.revenue }}</el-descriptions-item>
                    <el-descriptions-item label="来源">{{ selectedCustomer.source }}</el-descriptions-item>
                    <el-descriptions-item label="负责人">{{ selectedCustomer.owner }}</el-descriptions-item>
                  </el-descriptions>
                </el-tab-pane>

                <!-- 活动时间线 -->
                <el-tab-pane label="活动记录">
                  <el-timeline>
                    <el-timeline-item
                      v-for="activity in selectedCustomer.activities"
                      :key="activity.id"
                      :timestamp="activity.time"
                      :type="activity.type"
                      :icon="activity.icon"
                    >
                      <h4>{{ activity.title }}</h4>
                      <p>{{ activity.content }}</p>
                      <el-tag size="small" v-if="activity.result">{{ activity.result }}</el-tag>
                    </el-timeline-item>
                  </el-timeline>
                </el-tab-pane>

                <!-- AI洞察 -->
                <el-tab-pane label="AI洞察">
                  <div class="ai-insights">
                    <el-alert type="info" :closable="false" class="mb-3">
                      <template #title>
                        <el-icon><Lightning /></el-icon>
                        AI综合评分：{{ selectedCustomer.score }}分
                      </template>
                    </el-alert>

                    <div class="insight-item">
                      <h4>🎯 购买意向预测</h4>
                      <el-progress :percentage="selectedCustomer.intentScore" :color="getProgressColor(selectedCustomer.intentScore)" />
                      <p>{{ selectedCustomer.intentAnalysis }}</p>
                    </div>

                    <div class="insight-item">
                      <h4>📊 客户活跃度</h4>
                      <el-progress :percentage="selectedCustomer.activityScore" />
                      <p>最近30天：{{ selectedCustomer.recentActivities }}次互动</p>
                    </div>

                    <div class="insight-item">
                      <h4>💡 推荐行动</h4>
                      <el-tag 
                        v-for="action in selectedCustomer.recommendedActions" 
                        :key="action"
                        type="warning"
                        class="mr-2 mb-2"
                      >
                        {{ action }}
                      </el-tag>
                    </div>

                    <div class="insight-item">
                      <h4>⚠️ 风险提示</h4>
                      <el-alert 
                        v-for="risk in selectedCustomer.risks" 
                        :key="risk"
                        :type="risk.level"
                        :title="risk.message"
                        :closable="false"
                        class="mb-2"
                      />
                    </div>
                  </div>
                </el-tab-pane>

                <!-- 关联商机 -->
                <el-tab-pane label="关联商机">
                  <el-table :data="selectedCustomer.opportunities">
                    <el-table-column prop="name" label="商机名称" />
                    <el-table-column prop="stage" label="阶段">
                      <template #default="{ row }">
                        <el-tag :type="getStageType(row.stage)">{{ row.stage }}</el-tag>
                      </template>
                    </el-table-column>
                    <el-table-column prop="amount" label="金额" />
                    <el-table-column prop="winRate" label="赢率" />
                    <el-table-column prop="closeDate" label="预计成交" />
                    <el-table-column label="操作">
                      <template #default="{ row }">
                        <el-button size="small" @click="viewOpportunity(row)">查看</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-tab-pane>
              </el-tabs>
            </el-card>
          </el-col>

          <el-col :span="16" v-else>
            <el-empty description="请从左侧选择一个客户查看详情" />
          </el-col>
        </el-row>
      </div>

      <!-- AI智能体视图 -->
      <div v-show="activeTab === 'aiAgent'" class="ai-agent-view">
        <div class="view-header">
          <h2>🤖 AI智能体助手</h2>
        </div>

        <el-row :gutter="20">
          <el-col :span="8" v-for="agent in aiAgents" :key="agent.id">
            <el-card class="agent-card" :body-style="{ padding: '24px' }">
              <div class="agent-header">
                <el-icon :size="48" :color="agent.color">
                  <component :is="agent.icon" />
                </el-icon>
                <h3>{{ agent.name }}</h3>
                <p>{{ agent.description }}</p>
              </div>

              <el-divider />

              <div class="agent-stats">
                <div class="stat-item">
                  <span class="label">准确率：</span>
                  <span class="value">{{ agent.accuracy }}%</span>
                </div>
                <div class="stat-item">
                  <span class="label">今日推荐：</span>
                  <span class="value">{{ agent.todayRecommendations }}条</span>
                </div>
                <div class="stat-item">
                  <span class="label">采纳率：</span>
                  <span class="value">{{ agent.adoptionRate }}%</span>
                </div>
              </div>

              <el-button type="primary" class="mt-3" @click="openAgent(agent)" block>
                启动智能体
              </el-button>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- AI推荐侧边栏 -->
    <el-drawer
      v-model="showAIDrawer"
      title="AI智能推荐"
      size="400px"
      direction="rtl"
    >
      <div class="ai-recommendations">
        <el-alert type="success" :closable="false" class="mb-3">
          <template #title>
            <el-icon><Lightning /></el-icon>
            今日AI推荐 {{ aiTaskCount }} 条
          </template>
        </el-alert>

        <div v-for="task in aiTasks" :key="task.id" class="ai-task-item">
          <div class="task-header">
            <el-tag :type="task.priority === 'high' ? 'danger' : task.priority === 'medium' ? 'warning' : ''">
              {{ task.priorityLabel }}
            </el-tag>
            <span class="task-time">{{ task.time }}</span>
          </div>
          <h4>{{ task.title }}</h4>
          <p>{{ task.description }}</p>
          <div class="task-actions">
            <el-button size="small" type="primary" @click="acceptTask(task)">采纳</el-button>
            <el-button size="small" @click="ignoreTask(task)">忽略</el-button>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  TrendCharts, Filter, User, Money, Clock, MagicStick, DataAnalysis,
  Search, Lightning, Bell, Refresh, CaretTop, CaretBottom, View, Download,
  Plus, Phone, Message, QuestionFilled
} from '@element-plus/icons-vue'

// 当前激活的标签页
const activeTab = ref('funnel')

// 全局搜索
const globalSearch = ref('')

// AI任务数量
const aiTaskCount = ref(12)
const unreadCount = ref(5)

// 漏斗数据
const funnelPeriod = ref('month')
const totalOpportunities = ref(45)
const predictedRevenue = ref(230)
const winRatePrediction = ref(68)
const highRiskDeals = ref(3)
const aiRecommendedActions = ref(8)

// KPI指标
const kpiMetrics = ref([
  { id: 1, title: '线索转化率', value: '28%', trend: 5, trendLabel: '环比上月', icon: 'TrendCharts', color: '#67C23A' },
  { id: 2, title: '平均成交周期', value: '45天', trend: -8, trendLabel: '环比缩短', icon: 'Clock', color: '#E6A23C' },
  { id: 3, title: '本月新增商机', value: '45个', trend: 12, trendLabel: '环比增长', icon: 'Money', color: '#409EFF' },
  { id: 4, title: '预计本月成交', value: '¥230万', trend: 15, trendLabel: '环比增长', icon: 'DataAnalysis', color: '#F56C6C' }
])

// 漏斗阶段
const funnelStages = ref([
  { name: '线索获取', count: 150, amount: 3000000, conversionRate: 100, color: '#409EFF' },
  { name: '初步接触', count: 45, amount: 2300000, conversionRate: 30, color: '#67C23A' },
  { name: '需求确认', count: 28, amount: 1800000, conversionRate: 62, color: '#E6A23C' },
  { name: '方案报价', count: 18, amount: 1500000, conversionRate: 64, color: '#F56C6C' },
  { name: '商务谈判', count: 10, amount: 1200000, conversionRate: 56, color: '#909399' },
  { name: '合同签订', count: 5, amount: 800000, conversionRate: 50, color: '#606266' }
])

// 重点商机
const topOpportunities = ref([
  { 
    id: 1, 
    name: '某汽车厂焊接线项目', 
    customer: '某汽车制造', 
    stage: '商务谈判', 
    amount: 1200000,
    winRate: 75,
    owner: '张三',
    closeDate: '2025-01-15',
    aiAction: '紧急跟进',
    aiSuggestion: '客户近3天未互动，建议今日电话跟进'
  },
  // 更多商机...
])

// 客户数据
const customerSearch = ref('')
const selectedCustomer = ref(null)

const customers = ref([
  {
    id: 1,
    name: '李经理',
    company: '某汽车制造',
    title: '采购总监',
    phone: '138****1234',
    email: 'li@example.com',
    level: 'success',
    levelLabel: 'VIP客户',
    industry: '汽车制造',
    region: '上海',
    companySize: '1000-5000人',
    revenue: '¥10亿+',
    source: '官网咨询',
    owner: '张三',
    score: 85,
    rating: 5,
    intentScore: 82,
    intentAnalysis: '最近2周互动频繁，预算已确认，购买意向强烈',
    activityScore: 75,
    recentActivities: 8,
    recommendedActions: ['安排产品演示', '提供解决方案', '邀请参观工厂'],
    risks: [
      { level: 'warning', message: '竞争对手也在接触中' }
    ],
    activities: [
      { id: 1, time: '2025-12-17 14:30', type: 'success', icon: 'Phone', title: '电话沟通', content: '确认了项目预算和时间节点', result: '进展顺利' },
      { id: 2, time: '2025-12-16 10:00', type: 'primary', icon: 'Message', title: '邮件跟进', content: '发送了详细的产品方案', result: '已读' }
    ],
    opportunities: [
      { name: '焊接线项目', stage: '商务谈判', amount: '¥120万', winRate: 75, closeDate: '2025-01-15' }
    ]
  }
])

const filteredCustomers = computed(() => {
  if (!customerSearch.value) return customers.value
  return customers.value.filter(c => 
    c.name.includes(customerSearch.value) || 
    c.company.includes(customerSearch.value)
  )
})

// AI智能体
const aiAgents = ref([
  { 
    id: 1, 
    name: '赢率预测引擎', 
    description: '基于历史数据预测商机成交概率',
    icon: 'DataAnalysis',
    color: '#409EFF',
    accuracy: 87,
    todayRecommendations: 12,
    adoptionRate: 92
  },
  { 
    id: 2, 
    name: '客户意向分析', 
    description: '智能分析客户购买意向和时机',
    icon: 'TrendCharts',
    color: '#67C23A',
    accuracy: 85,
    todayRecommendations: 8,
    adoptionRate: 88
  },
  { 
    id: 3, 
    name: '行动推荐助手', 
    description: '自动推荐最佳跟进策略和话术',
    icon: 'MagicStick',
    color: '#E6A23C',
    accuracy: 90,
    todayRecommendations: 15,
    adoptionRate: 95
  }
])

// AI推荐任务
const showAIDrawer = ref(false)
const aiTasks = ref([
  {
    id: 1,
    priority: 'high',
    priorityLabel: '高优先级',
    time: '2小时前',
    title: '紧急跟进：某汽车厂项目',
    description: 'AI检测到客户3天未互动，竞争对手正在接触，建议立即电话跟进'
  },
  {
    id: 2,
    priority: 'medium',
    priorityLabel: '中优先级',
    time: '4小时前',
    title: '发送方案：某电子公司',
    description: '客户已查看产品手册2次，建议发送定制化解决方案'
  }
])

// 方法
const handleTabChange = (key) => {
  activeTab.value = key
}

const handleUserCommand = (command) => {
  console.log('User command:', command)
}

const refreshFunnel = () => {
  console.log('刷新漏斗数据')
}

const getProgressColor = (percentage) => {
  if (percentage >= 80) return '#67C23A'
  if (percentage >= 60) return '#E6A23C'
  return '#F56C6C'
}

const getStageType = (stage) => {
  const typeMap = {
    '线索获取': 'info',
    '初步接触': 'primary',
    '需求确认': '',
    '方案报价': 'success',
    '商务谈判': 'warning',
    '合同签订': 'danger'
  }
  return typeMap[stage] || ''
}

const selectCustomer = (customer) => {
  selectedCustomer.value = customer
}

const showAIRecommendations = () => {
  showAIDrawer.value = true
}

const acceptTask = (task) => {
  console.log('采纳任务:', task)
  aiTaskCount.value--
}

const ignoreTask = (task) => {
  console.log('忽略任务:', task)
  aiTaskCount.value--
}
</script>

<style scoped lang="scss">
.aicrm-enhanced {
  min-height: 100vh;
  background: #f5f7fa;
}

.global-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;

  .header-brand {
    display: flex;
    align-items: center;
    gap: 12px;

    .brand-text {
      h1 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
      }
      span {
        font-size: 12px;
        opacity: 0.9;
      }
    }
  }

  .main-menu {
    background: transparent;
    border: none;
    
    :deep(.el-menu-item) {
      color: white;
      border-bottom: 2px solid transparent;
      
      &:hover, &.is-active {
        background: rgba(255, 255, 255, 0.1);
        border-bottom-color: white;
      }
    }
  }

  .header-toolbar {
    display: flex;
    align-items: center;
    gap: 16px;

    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      
      span {
        font-size: 14px;
      }
    }
  }
}

.main-content {
  padding: 24px;
  max-width: 1600px;
  margin: 0 auto;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h2 {
    margin: 0;
    font-size: 24px;
    color: #303133;
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }
}

.kpi-cards {
  .kpi-card {
    .kpi-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      
      .kpi-title {
        color: #606266;
        font-size: 14px;
      }
    }

    .kpi-value {
      font-size: 32px;
      font-weight: 600;
      color: #303133;
      margin: 12px 0;
    }

    .kpi-trend {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;

      &.positive {
        color: #67C23A;
      }
      &.negative {
        color: #F56C6C;
      }
    }
  }
}

.funnel-chart {
  padding: 20px 0;

  .funnel-stage {
    margin: 12px auto;
    padding: 20px;
    border-radius: 8px;
    transition: all 0.3s;

    &:hover {
      transform: translateX(5px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .stage-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;

      .stage-name {
        font-weight: 600;
        color: #303133;
      }
      .stage-count, .stage-amount {
        color: #606266;
      }
      .stage-rate {
        color: #909399;
        font-size: 12px;
      }
    }
  }
}

.ai-predictions {
  .prediction-item {
    margin-bottom: 20px;

    .label {
      display: block;
      color: #606266;
      font-size: 13px;
      margin-bottom: 8px;
    }

    .value {
      font-size: 24px;
      font-weight: 600;
      
      &.success {
        color: #67C23A;
      }
      &.danger {
        color: #F56C6C;
      }
    }
  }
}

.customer-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #EBEEF5;
  cursor: pointer;
  transition: all 0.2s;

  &:hover, &.active {
    background: #F5F7FA;
  }

  .customer-info {
    flex: 1;

    .name {
      font-weight: 600;
      color: #303133;
      margin-bottom: 4px;
    }
    .company {
      font-size: 13px;
      color: #606266;
      margin-bottom: 8px;
    }
    .tags {
      display: flex;
      gap: 4px;
    }
  }
}

.customer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-left {
    display: flex;
    gap: 16px;

    .header-info {
      h3 {
        margin: 0 0 4px 0;
      }
      p {
        margin: 0 0 8px 0;
        color: #606266;
        font-size: 14px;
      }
      .contact-info {
        display: flex;
        gap: 12px;
        font-size: 13px;
        color: #909399;
      }
    }
  }

  .header-actions {
    display: flex;
    gap: 8px;
  }
}

.ai-insights {
  .insight-item {
    margin-bottom: 24px;

    h4 {
      margin: 0 0 12px 0;
      color: #303133;
    }
    p {
      margin: 8px 0 0 0;
      color: #606266;
      font-size: 13px;
    }
  }
}

.agent-card {
  transition: all 0.3s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }

  .agent-header {
    text-align: center;

    h3 {
      margin: 12px 0 8px 0;
      font-size: 18px;
    }
    p {
      color: #606266;
      font-size: 13px;
      margin: 0;
    }
  }

  .agent-stats {
    .stat-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 14px;

      .label {
        color: #606266;
      }
      .value {
        font-weight: 600;
        color: #409EFF;
      }
    }
  }
}

.ai-task-item {
  padding: 16px;
  background: #F5F7FA;
  border-radius: 8px;
  margin-bottom: 16px;

  .task-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;

    .task-time {
      font-size: 12px;
      color: #909399;
    }
  }

  h4 {
    margin: 0 0 8px 0;
    font-size: 14px;
  }

  p {
    margin: 0 0 12px 0;
    font-size: 13px;
    color: #606266;
  }

  .task-actions {
    display: flex;
    gap: 8px;
  }
}

.mt-3 { margin-top: 12px; }
.mt-4 { margin-top: 16px; }
.mb-2 { margin-bottom: 8px; }
.mb-3 { margin-bottom: 12px; }
.mr-2 { margin-right: 8px; }
.ml-3 { margin-left: 12px; }
.ml-4 { margin-left: 16px; }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.quick-actions {
  display: flex;
  gap: 8px;
}
</style>
