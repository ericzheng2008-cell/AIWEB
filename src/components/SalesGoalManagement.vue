<template>
  <div class="sales-goal-management">
    <!-- 顶部操作栏 -->
    <div class="module-header">
      <div class="header-left">
        <h2>📊 销售目标管理 - 智能闭环系统</h2>
        <el-radio-group v-model="viewMode" size="default">
          <el-radio-button label="overview">总览</el-radio-button>
          <el-radio-button label="personal">个人目标</el-radio-button>
          <el-radio-button label="team">团队目标</el-radio-button>
          <el-radio-button label="forecast">AI预测</el-radio-button>
        </el-radio-group>
      </div>
      <div class="header-actions">
        <el-select v-model="currentPeriod" style="width: 150px;">
          <el-option label="本月" value="month" />
          <el-option label="本季度" value="quarter" />
          <el-option label="本年度" value="year" />
        </el-select>
        <el-button type="primary" @click="setGoalDialog = true">
          <el-icon><Plus /></el-icon>
          设定目标
        </el-button>
        <el-button @click="goHome">
          <el-icon><HomeFilled /></el-icon>
          返回主页
        </el-button>
      </div>
    </div>

    <!-- 总览模式 -->
    <div v-show="viewMode === 'overview'" class="overview-mode">
      <el-row :gutter="20">
        <!-- KPI完成率卡片 -->
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon primary">
                <el-icon :size="32"><TrendCharts /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-label">总目标完成率</div>
                <div class="stat-value">{{ dashboardData.overallCompletion }}%</div>
                <div class="stat-trend" :class="dashboardData.completionTrend > 0 ? 'up' : 'down'">
                  {{ dashboardData.completionTrend > 0 ? '↑' : '↓' }} {{ Math.abs(dashboardData.completionTrend) }}%
                </div>
              </div>
            </div>
            <el-progress :percentage="dashboardData.overallCompletion" :color="getProgressColor(dashboardData.overallCompletion)" />
          </el-card>
        </el-col>

        <!-- 销售额 -->
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon success">
                <el-icon :size="32"><Money /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-label">本月销售额</div>
                <div class="stat-value">¥{{ (dashboardData.currentRevenue / 10000).toFixed(1) }}万</div>
                <div class="stat-sub">目标: ¥{{ (dashboardData.targetRevenue / 10000).toFixed(1) }}万</div>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 新增客户 -->
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon warning">
                <el-icon :size="32"><User /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-label">新增客户数</div>
                <div class="stat-value">{{ dashboardData.newCustomers }}</div>
                <div class="stat-sub">目标: {{ dashboardData.targetNewCustomers }}</div>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- AI预测本月成交 -->
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon danger">
                <el-icon :size="32"><DataAnalysis /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-label">AI预测本月成交</div>
                <div class="stat-value">¥{{ (dashboardData.aiPredictedRevenue / 10000).toFixed(1) }}万</div>
                <div class="stat-sub">置信度: {{ dashboardData.confidenceLevel }}%</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 目标完成趋势图 -->
      <el-row :gutter="20" class="mt-4">
        <el-col :span="16">
          <el-card>
            <template #header>
              <span>📈 目标完成趋势 - 实际 vs 目标 vs AI预测</span>
            </template>
            <div ref="trendChart" style="height: 400px;"></div>
          </el-card>
        </el-col>

        <el-col :span="8">
          <el-card>
            <template #header>
              <span>🎯 关键指标雷达图</span>
            </template>
            <div ref="radarChart" style="height: 400px;"></div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 团队目标完成排名 -->
      <el-card class="mt-4">
        <template #header>
          <div class="card-header">
            <span>🏆 团队目标完成排名</span>
            <el-tag type="success">本{{ currentPeriod === 'month' ? '月' : currentPeriod === 'quarter' ? '季度' : '年' }}</el-tag>
          </div>
        </template>
        <el-table :data="teamRanking" stripe>
          <el-table-column type="index" label="排名" width="80" />
          <el-table-column prop="name" label="姓名" width="120" />
          <el-table-column prop="department" label="部门" width="120" />
          <el-table-column label="销售额" width="150">
            <template #default="{ row }">
              <div class="progress-cell">
                <span>¥{{ (row.currentRevenue / 10000).toFixed(1) }}万</span>
                <el-progress 
                  :percentage="Math.min(100, Math.max(0, Math.round(row.currentRevenue / row.targetRevenue * 100))) || 0" 
                  :color="getProgressColor(Math.min(100, row.currentRevenue / row.targetRevenue * 100))"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="targetRevenue" label="目标" width="120">
            <template #default="{ row }">
              ¥{{ (row.targetRevenue / 10000).toFixed(1) }}万
            </template>
          </el-table-column>
          <el-table-column label="完成率" width="100">
            <template #default="{ row }">
              <el-tag :type="getCompletionType(row.completionRate)">
                {{ row.completionRate }}%
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="newCustomers" label="新客户" width="100" />
          <el-table-column prop="visitCount" label="拜访次数" width="100" />
          <el-table-column label="AI评分" width="120">
            <template #default="{ row }">
              <el-rate v-model="row.aiScore" disabled show-score />
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="150">
            <template #default="{ row }">
              <el-button size="small" @click="viewPersonalDetail(row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>

    <!-- 个人目标模式 -->
    <div v-show="viewMode === 'personal'" class="personal-mode">
      <el-row :gutter="20">
        <el-col :span="18">
          <!-- 个人目标设定 -->
          <el-card class="mb-4">
            <template #header>
              <span>🎯 我的目标设定</span>
            </template>
            <el-form :model="personalGoals" label-width="120px">
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="销售额目标">
                    <el-input-number v-model="personalGoals.revenueTarget" :min="0" style="width: 100%;" />
                    <span class="unit">万元</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="新客户数">
                    <el-input-number v-model="personalGoals.newCustomerTarget" :min="0" style="width: 100%;" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="拜访次数">
                    <el-input-number v-model="personalGoals.visitTarget" :min="0" style="width: 100%;" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="合同数量">
                    <el-input-number v-model="personalGoals.contractTarget" :min="0" style="width: 100%;" />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="回款率">
                    <el-input-number v-model="personalGoals.collectionRate" :min="0" :max="100" style="width: 100%;" />
                    <span class="unit">%</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="成交率">
                    <el-input-number v-model="personalGoals.winRate" :min="0" :max="100" style="width: 100%;" />
                    <span class="unit">%</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item>
                <el-button type="primary" @click="savePersonalGoals">保存目标</el-button>
                <el-button @click="requestAIRecommendation">AI推荐目标</el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 个人历史数据分析 -->
          <el-card>
            <template #header>
              <span>📊 个人历史数据分析</span>
            </template>
            <div ref="personalHistoryChart" style="height: 350px;"></div>
          </el-card>

          <!-- 行动计划 -->
          <el-card class="mt-4">
            <template #header>
              <div class="card-header">
                <span>📝 本周行动计划</span>
                <el-button size="small" type="primary" @click="generateWeeklyPlan">
                  <el-icon><MagicStick /></el-icon>
                  AI生成计划
                </el-button>
              </div>
            </template>
            <el-table :data="weeklyTasks" stripe>
              <el-table-column type="index" label="#" width="50" />
              <el-table-column prop="task" label="任务" />
              <el-table-column prop="customer" label="客户" width="150" />
              <el-table-column prop="priority" label="优先级" width="100">
                <template #default="{ row }">
                  <el-tag :type="getPriorityType(row.priority)">{{ row.priority }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="dueDate" label="截止日期" width="120" />
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template #default="{ row }">
                  <el-button size="small" @click="completeTask(row)">完成</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-col>

        <el-col :span="6">
          <!-- AI智能建议 -->
          <el-card class="ai-suggestions">
            <template #header>
              <span>💡 AI智能建议</span>
            </template>
            <div class="suggestion-list">
              <div v-for="suggestion in aiSuggestions" :key="suggestion.id" class="suggestion-item">
                <div class="suggestion-icon" :class="suggestion.type">
                  <el-icon><Bell /></el-icon>
                </div>
                <div class="suggestion-content">
                  <h4>{{ suggestion.title }}</h4>
                  <p>{{ suggestion.content }}</p>
                  <el-button size="small" type="primary" @click="acceptSuggestion(suggestion)">
                    采纳
                  </el-button>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 产品线贡献分析 -->
          <el-card class="mt-4">
            <template #header>
              <span>📦 产品线贡献</span>
            </template>
            <div ref="productPieChart" style="height: 250px;"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 团队目标模式 -->
    <div v-show="viewMode === 'team'" class="team-mode">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>👥 团队目标管理</span>
            <el-button type="primary" @click="allocateTeamGoals">
              <el-icon><Share /></el-icon>
              目标分配
            </el-button>
          </div>
        </template>

        <!-- 团队目标设定 -->
        <div class="team-goal-setting mb-4">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-statistic title="团队销售额目标" :value="teamGoals.totalRevenue / 10000" suffix="万元" />
            </el-col>
            <el-col :span="6">
              <el-statistic title="团队新客户目标" :value="teamGoals.totalNewCustomers" suffix="个" />
            </el-col>
            <el-col :span="6">
              <el-statistic title="团队成员" :value="teamMembers.length" suffix="人" />
            </el-col>
            <el-col :span="6">
              <el-statistic title="平均完成率" :value="teamGoals.avgCompletion" suffix="%" />
            </el-col>
          </el-row>
        </div>

        <!-- 团队成员目标分配表 -->
        <el-table :data="teamMembers" border stripe>
          <el-table-column prop="name" label="成员" width="120" />
          <el-table-column label="销售额目标" width="150">
            <template #default="{ row }">
              <el-input-number v-model="row.revenueTarget" :min="0" size="small" />
            </template>
          </el-table-column>
          <el-table-column label="当前完成" width="120">
            <template #default="{ row }">
              ¥{{ (row.currentRevenue / 10000).toFixed(1) }}万
            </template>
          </el-table-column>
          <el-table-column label="完成率" width="150">
            <template #default="{ row }">
              <el-progress :percentage="Math.min(100, Math.max(0, Number(row.completionRate))) || 0" :color="getProgressColor(row.completionRate)" />
            </template>
          </el-table-column>
          <el-table-column label="新客户目标" width="120">
            <template #default="{ row }">
              <el-input-number v-model="row.newCustomerTarget" :min="0" size="small" />
            </template>
          </el-table-column>
          <el-table-column prop="currentNewCustomers" label="已完成" width="80" />
          <el-table-column label="风险评估" width="120">
            <template #default="{ row }">
              <el-tag :type="getRiskType(row.riskLevel)">{{ row.riskLevel }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="AI建议" width="200">
            <template #default="{ row }">
              <el-tooltip :content="row.aiAdvice" placement="top">
                <el-button size="small" type="text">查看建议</el-button>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="150">
            <template #default="{ row }">
              <el-button size="small" @click="adjustMemberGoal(row)">调整</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 团队协作任务看板 -->
      <el-card class="mt-4">
        <template #header>
          <span>📋 团队协作任务看板</span>
        </template>
        <div ref="teamGanttChart" style="height: 400px;"></div>
      </el-card>
    </div>

    <!-- AI预测模式 -->
    <div v-show="viewMode === 'forecast'" class="forecast-mode">
      <el-row :gutter="20">
        <!-- 短期预测 (3-6个月) -->
        <el-col :span="8">
          <el-card class="forecast-card">
            <template #header>
              <div class="card-header">
                <span>📊 短期预测 (3-6个月)</span>
                <el-tag type="success">高置信度</el-tag>
              </div>
            </template>
            <div class="forecast-content">
              <div ref="shortTermChart" style="height: 300px;"></div>
              <el-divider />
              <div class="forecast-stats">
                <div class="stat-row">
                  <span>预测销售额:</span>
                  <strong>¥{{ (forecastData.shortTerm.revenue / 10000).toFixed(1) }}万</strong>
                </div>
                <div class="stat-row">
                  <span>置信区间:</span>
                  <span>{{ forecastData.shortTerm.confidenceInterval }}</span>
                </div>
                <div class="stat-row">
                  <span>季节性因素:</span>
                  <el-tag size="small">{{ forecastData.shortTerm.seasonality }}</el-tag>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 中期预测 (1年) -->
        <el-col :span="8">
          <el-card class="forecast-card">
            <template #header>
              <div class="card-header">
                <span>📈 中期预测 (1年)</span>
                <el-tag type="warning">中置信度</el-tag>
              </div>
            </template>
            <div class="forecast-content">
              <div ref="midTermChart" style="height: 300px;"></div>
              <el-divider />
              <div class="forecast-stats">
                <div class="stat-row">
                  <span>预测年销售额:</span>
                  <strong>¥{{ (forecastData.midTerm.revenue / 10000).toFixed(1) }}万</strong>
                </div>
                <div class="stat-row">
                  <span>产品生命周期:</span>
                  <span>{{ forecastData.midTerm.productLifecycle }}</span>
                </div>
                <div class="stat-row">
                  <span>合同周期影响:</span>
                  <el-tag size="small">{{ forecastData.midTerm.contractCycle }}</el-tag>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 长期预测 (3年) -->
        <el-col :span="8">
          <el-card class="forecast-card">
            <template #header>
              <div class="card-header">
                <span>🔮 长期预测 (3年)</span>
                <el-tag type="info">参考性</el-tag>
              </div>
            </template>
            <div class="forecast-content">
              <div ref="longTermChart" style="height: 300px;"></div>
              <el-divider />
              <div class="forecast-stats">
                <div class="stat-row">
                  <span>3年累计预测:</span>
                  <strong>¥{{ (forecastData.longTerm.revenue / 10000).toFixed(1) }}万</strong>
                </div>
                <div class="stat-row">
                  <span>市场增长率:</span>
                  <span>{{ forecastData.longTerm.marketGrowth }}%</span>
                </div>
                <div class="stat-row">
                  <span>战略建议:</span>
                  <el-tag size="small" type="success">{{ forecastData.longTerm.strategy }}</el-tag>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- AI优化建议 -->
      <el-card class="mt-4">
        <template #header>
          <span>🤖 AI智能优化建议</span>
        </template>
        <el-row :gutter="20">
          <el-col :span="12">
            <div class="optimization-section">
              <h3>🎯 目标调整建议</h3>
              <el-timeline>
                <el-timeline-item
                  v-for="item in optimizationAdvice.goalAdjustments"
                  :key="item.id"
                  :timestamp="item.priority"
                  :type="item.type"
                >
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.description }}</p>
                  <el-button size="small" type="primary" @click="applyOptimization(item)">
                    应用建议
                  </el-button>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="optimization-section">
              <h3>💼 行动策略优化</h3>
              <el-timeline>
                <el-timeline-item
                  v-for="item in optimizationAdvice.actionStrategies"
                  :key="item.id"
                  :timestamp="item.priority"
                  :type="item.type"
                >
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.description }}</p>
                  <el-button size="small" type="primary" @click="applyOptimization(item)">
                    应用建议
                  </el-button>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- 设定目标对话框 -->
    <el-dialog
      v-model="setGoalDialog"
      title="设定目标"
      width="800px"
    >
      <el-form :model="newGoal" label-width="120px">
        <el-form-item label="目标类型">
          <el-radio-group v-model="newGoal.type">
            <el-radio label="personal">个人目标</el-radio>
            <el-radio label="team">团队目标</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="时间周期">
          <el-radio-group v-model="newGoal.period">
            <el-radio label="month">月度</el-radio>
            <el-radio label="quarter">季度</el-radio>
            <el-radio label="year">年度</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-divider />
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="销售额目标">
              <el-input-number v-model="newGoal.revenueTarget" :min="0" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="新客户数">
              <el-input-number v-model="newGoal.newCustomerTarget" :min="0" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="拜访次数">
              <el-input-number v-model="newGoal.visitTarget" :min="0" style="width: 100%;" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="成交率">
              <el-input-number v-model="newGoal.winRateTarget" :min="0" :max="100" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="setGoalDialog = false">取消</el-button>
        <el-button type="primary" @click="saveNewGoal">保存目标</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  Plus, TrendCharts, Money, User, DataAnalysis, HomeFilled,
  MagicStick, Bell, Share
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { useSalesGoalStore } from '@/store/salesGoal'

const router = useRouter()
const salesGoalStore = useSalesGoalStore()

// 视图模式
const viewMode = ref('overview')
const currentPeriod = ref('month')

// 仪表盘数据
const dashboardData = ref({
  overallCompletion: 78,
  completionTrend: 12,
  currentRevenue: 2340000,
  targetRevenue: 3000000,
  newCustomers: 15,
  targetNewCustomers: 20,
  aiPredictedRevenue: 2850000,
  confidenceLevel: 85
})

// 团队排名
const teamRanking = ref([
  { name: '张三', department: '销售一部', currentRevenue: 1200000, targetRevenue: 1000000, completionRate: 120, newCustomers: 8, visitCount: 45, aiScore: 5 },
  { name: '李四', department: '销售二部', currentRevenue: 950000, targetRevenue: 1000000, completionRate: 95, newCustomers: 7, visitCount: 38, aiScore: 4 },
  { name: '王五', department: '销售一部', currentRevenue: 850000, targetRevenue: 1000000, completionRate: 85, newCustomers: 6, visitCount: 42, aiScore: 4 },
  { name: '赵六', department: '销售三部', currentRevenue: 750000, targetRevenue: 1000000, completionRate: 75, newCustomers: 5, visitCount: 35, aiScore: 3 },
  { name: '钱七', department: '销售二部', currentRevenue: 650000, targetRevenue: 1000000, completionRate: 65, newCustomers: 4, visitCount: 30, aiScore: 3 }
])

// 个人目标
const personalGoals = ref({
  revenueTarget: 100,
  newCustomerTarget: 10,
  visitTarget: 50,
  contractTarget: 8,
  collectionRate: 85,
  winRate: 60
})

// 本周任务
const weeklyTasks = ref([
  { task: '跟进某汽车厂项目', customer: '某汽车制造', priority: '高', dueDate: '2025-12-20', status: '进行中' },
  { task: '发送报价单', customer: '某电子公司', priority: '中', dueDate: '2025-12-21', status: '待开始' },
  { task: '客户拜访', customer: '某机械厂', priority: '高', dueDate: '2025-12-22', status: '待开始' }
])

// AI建议
const aiSuggestions = ref([
  { id: 1, type: 'warning', title: '目标完成预警', content: '本月销售额完成度偏低，建议加强高潜客户跟进' },
  { id: 2, type: 'success', title: '优质客户提醒', content: '某汽车厂项目进展顺利，建议本周完成合同签订' },
  { id: 3, type: 'info', title: '行动建议', content: '建议增加新客户开发，当前新客户数低于目标' }
])

// 团队目标
const teamGoals = ref({
  totalRevenue: 50000000,
  totalNewCustomers: 50,
  avgCompletion: 82
})

// 团队成员
const teamMembers = ref([
  { name: '张三', revenueTarget: 1000000, currentRevenue: 1200000, completionRate: 120, newCustomerTarget: 10, currentNewCustomers: 8, riskLevel: '低风险', aiAdvice: '保持当前策略，继续发力' },
  { name: '李四', revenueTarget: 1000000, currentRevenue: 950000, completionRate: 95, newCustomerTarget: 10, currentNewCustomers: 7, riskLevel: '中风险', aiAdvice: '建议加强客户跟进频次' },
  { name: '王五', revenueTarget: 1000000, currentRevenue: 850000, completionRate: 85, newCustomerTarget: 10, currentNewCustomers: 6, riskLevel: '中风险', aiAdvice: '需要调整产品组合策略' },
  { name: '赵六', revenueTarget: 1000000, currentRevenue: 750000, completionRate: 75, newCustomerTarget: 10, currentNewCustomers: 5, riskLevel: '高风险', aiAdvice: '建议降低目标或增加资源支持' }
])

// 预测数据
const forecastData = ref({
  shortTerm: {
    revenue: 8500000,
    confidenceInterval: '800-920万',
    seasonality: '旺季调整+15%'
  },
  midTerm: {
    revenue: 36000000,
    productLifecycle: '成长期',
    contractCycle: '平均6个月'
  },
  longTerm: {
    revenue: 120000000,
    marketGrowth: 18,
    strategy: '扩大市场份额'
  }
})

// 优化建议
const optimizationAdvice = ref({
  goalAdjustments: [
    { id: 1, priority: '高优先级', type: 'danger', title: '调整Q1销售目标', description: '根据市场趋势，建议将Q1目标上调15%' },
    { id: 2, priority: '中优先级', type: 'warning', title: '优化产品组合', description: '建议增加高利润产品的销售占比' }
  ],
  actionStrategies: [
    { id: 1, priority: '高优先级', type: 'success', title: '重点客户深度开发', description: '建议将资源集中于前10大客户' },
    { id: 2, priority: '中优先级', type: 'primary', title: '提升客户拜访效率', description: '建议使用智能路线规划，提升30%拜访效率' }
  ]
})

// 对话框
const setGoalDialog = ref(false)
const newGoal = ref({
  type: 'personal',
  period: 'month',
  revenueTarget: 0,
  newCustomerTarget: 0,
  visitTarget: 0,
  winRateTarget: 0
})

// Chart refs
const trendChart = ref(null)
const radarChart = ref(null)
const personalHistoryChart = ref(null)
const productPieChart = ref(null)
const teamGanttChart = ref(null)
const shortTermChart = ref(null)
const midTermChart = ref(null)
const longTermChart = ref(null)

// 方法
const goHome = () => {
  router.push('/')
  ElMessage.success('返回主页')
}

const getProgressColor = (percentage) => {
  if (percentage >= 100) return '#67C23A'
  if (percentage >= 80) return '#E6A23C'
  return '#F56C6C'
}

const getCompletionType = (rate) => {
  if (rate >= 100) return 'success'
  if (rate >= 80) return 'warning'
  return 'danger'
}

const getPriorityType = (priority) => {
  const map = { '高': 'danger', '中': 'warning', '低': 'info' }
  return map[priority] || 'info'
}

const getStatusType = (status) => {
  const map = { '已完成': 'success', '进行中': 'primary', '待开始': 'info' }
  return map[status] || 'info'
}

const getRiskType = (risk) => {
  const map = { '低风险': 'success', '中风险': 'warning', '高风险': 'danger' }
  return map[risk] || 'info'
}

const savePersonalGoals = () => {
  ElMessage.success('个人目标已保存')
}

const requestAIRecommendation = () => {
  ElMessage.info('AI正在分析历史数据，生成推荐目标...')
  setTimeout(() => {
    personalGoals.value = {
      revenueTarget: 120,
      newCustomerTarget: 12,
      visitTarget: 55,
      contractTarget: 10,
      collectionRate: 88,
      winRate: 65
    }
    ElMessage.success('AI推荐目标已生成')
  }, 1000)
}

const generateWeeklyPlan = () => {
  ElMessage.success('AI已生成本周行动计划')
}

const completeTask = (task) => {
  task.status = '已完成'
  ElMessage.success(`任务"${task.task}"已完成`)
}

const acceptSuggestion = (suggestion) => {
  ElMessage.success(`已采纳建议: ${suggestion.title}`)
}

const viewPersonalDetail = (member) => {
  ElMessage.info(`查看 ${member.name} 的详细数据`)
}

const allocateTeamGoals = () => {
  ElMessage.success('团队目标自动分配完成')
}

const adjustMemberGoal = (member) => {
  ElMessage.info(`调整 ${member.name} 的目标`)
}

const applyOptimization = (item) => {
  ElMessage.success(`已应用优化建议: ${item.title}`)
}

const saveNewGoal = () => {
  ElMessage.success('新目标已保存')
  setGoalDialog.value = false
}

// 安全初始化 ECharts 实例（检查容器可见性和尺寸）
const safeInitChart = (container, chartName) => {
  if (!container) {
    console.log(`❌ ${chartName}: 容器引用不存在`)
    return null
  }
  
  // 检查容器是否可见
  if (container.offsetParent === null) {
    console.log(`⚠️ ${chartName}: 容器被隐藏 (v-show)，跳过初始化`)
    return null
  }
  
  // 检查容器尺寸
  const width = container.clientWidth
  const height = container.clientHeight
  
  if (!width || !height) {
    console.log(`⚠️ ${chartName}: 容器尺寸为 ${width}×${height}，跳过初始化`)
    return null
  }
  
  console.log(`✅ ${chartName}: 开始初始化，尺寸 ${width}×${height}`)
  return echarts.init(container)
}

// 初始化图表
const initCharts = () => {
  console.log('📊 开始初始化所有图表')
  
  // 趋势图
  if (trendChart.value) {
    const chart = safeInitChart(trendChart.value, '趋势图')
    if (chart) {
      chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['实际完成', '目标', 'AI预测'] },
      xAxis: { 
        type: 'category', 
        data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'] 
      },
      yAxis: { type: 'value', name: '销售额(万元)' },
      series: [
        { name: '实际完成', type: 'line', data: [180, 220, 195, 240, 260, 285, 310, 295, 0, 0, 0, 0], itemStyle: { color: '#67C23A' } },
        { name: '目标', type: 'line', data: [200, 200, 200, 250, 250, 300, 300, 300, 300, 300, 300, 300], itemStyle: { color: '#409EFF' }, lineStyle: { type: 'dashed' } },
        { name: 'AI预测', type: 'line', data: [0, 0, 0, 0, 0, 0, 0, 0, 315, 330, 345, 360], itemStyle: { color: '#E6A23C' }, lineStyle: { type: 'dotted' } }
      ]
    })
    }
  }

  // 雷达图
  if (radarChart.value) {
    const chart = safeInitChart(radarChart.value, '雷达图')
    if (chart) {
      chart.setOption({
      radar: {
        indicator: [
          { name: '销售额', max: 100 },
          { name: '新客户', max: 100 },
          { name: '拜访次数', max: 100 },
          { name: '成交率', max: 100 },
          { name: '回款率', max: 100 }
        ]
      },
      series: [{
        type: 'radar',
        data: [
          { value: [78, 75, 88, 65, 82], name: '当前完成' }
        ]
      }]
    })
    }
  }

  // 个人历史图表
  if (personalHistoryChart.value) {
    const chart = safeInitChart(personalHistoryChart.value, '个人历史图表')
    if (chart) {
      chart.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['销售额', '新客户数', '拜访次数'] },
      xAxis: { type: 'category', data: ['7月', '8月', '9月', '10月', '11月', '12月'] },
      yAxis: { type: 'value' },
      series: [
        { name: '销售额', type: 'bar', data: [95, 102, 88, 115, 108, 120] },
        { name: '新客户数', type: 'line', data: [8, 9, 7, 10, 9, 12] },
        { name: '拜访次数', type: 'line', data: [42, 45, 38, 48, 46, 50] }
      ]
    })
    }
  }

  // 产品饼图
  if (productPieChart.value) {
    const chart = safeInitChart(productPieChart.value, '产品饼图')
    if (chart) {
      chart.setOption({
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: '70%',
        data: [
          { value: 35, name: '电池工具' },
          { value: 28, name: '焊机' },
          { value: 22, name: '涂胶机' },
          { value: 15, name: '其他' }
        ]
      }]
    })
    }
  }

  // 短期预测图
  if (shortTermChart.value) {
    const chart = safeInitChart(shortTermChart.value, '短期预测图')
    if (chart) {
      chart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
      yAxis: { type: 'value' },
      series: [{
        type: 'line',
        data: [280, 295, 310, 320, 335, 350],
        areaStyle: { color: 'rgba(103, 194, 58, 0.2)' }
      }]
    })
    }
  }

  // 中期预测图
  if (midTermChart.value) {
    const chart = safeInitChart(midTermChart.value, '中期预测图')
    if (chart) {
      chart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['Q1', 'Q2', 'Q3', 'Q4'] },
      yAxis: { type: 'value' },
      series: [{
        type: 'bar',
        data: [850, 920, 1050, 1180],
        itemStyle: { color: '#E6A23C' }
      }]
    })
    }
  }

  // 长期预测图
  if (longTermChart.value) {
    const chart = safeInitChart(longTermChart.value, '长期预测图')
    if (chart) {
      chart.setOption({
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['2025', '2026', '2027'] },
      yAxis: { type: 'value' },
      series: [{
        type: 'line',
        data: [3600, 4200, 4800],
        itemStyle: { color: '#409EFF' },
        lineStyle: { width: 3 }
      }]
    })
    }
  }
  
  console.log('✅ 所有图表初始化完成')
}

onMounted(() => {
  // 使用 setTimeout 替代 nextTick，确保容器完成布局（特别是 v-show 场景）
  setTimeout(() => {
    initCharts()
  }, 500)
})
</script>

<style scoped lang="scss">
.sales-goal-management {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 24px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

  .header-left {
    display: flex;
    align-items: center;
    gap: 20px;

    h2 {
      margin: 0;
      font-size: 20px;
    }
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }
}

.stat-card {
  .stat-content {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;

    .stat-icon {
      width: 64px;
      height: 64px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.primary { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
      &.success { background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%); color: white; }
      &.warning { background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); color: white; }
      &.danger { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; }
    }

    .stat-info {
      flex: 1;

      .stat-label {
        font-size: 13px;
        color: #909399;
        margin-bottom: 8px;
      }

      .stat-value {
        font-size: 28px;
        font-weight: 600;
        color: #303133;
      }

      .stat-trend {
        font-size: 14px;
        margin-top: 4px;

        &.up { color: #67C23A; }
        &.down { color: #F56C6C; }
      }

      .stat-sub {
        font-size: 12px;
        color: #909399;
        margin-top: 4px;
      }
    }
  }
}

.mt-4 { margin-top: 24px; }
.mb-4 { margin-bottom: 24px; }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-cell {
  display: flex;
  flex-direction: column;
  gap: 8px;

  span {
    font-size: 13px;
    color: #606266;
  }
}

.unit {
  margin-left: 8px;
  font-size: 12px;
  color: #909399;
}

.ai-suggestions {
  .suggestion-list {
    .suggestion-item {
      border: 1px solid #EBEEF5;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
      display: flex;
      gap: 12px;

      .suggestion-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        &.warning { background: #FDF6EC; color: #E6A23C; }
        &.success { background: #F0F9FF; color: #67C23A; }
        &.info { background: #ECF5FF; color: #409EFF; }
      }

      .suggestion-content {
        flex: 1;

        h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
        }

        p {
          margin: 0 0 12px 0;
          font-size: 13px;
          color: #606266;
        }
      }
    }
  }
}

.forecast-card {
  .forecast-content {
    .forecast-stats {
      .stat-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #EBEEF5;

        &:last-child {
          border-bottom: none;
        }

        span {
          font-size: 13px;
          color: #606266;
        }

        strong {
          font-size: 16px;
          color: #303133;
        }
      }
    }
  }
}

.optimization-section {
  h3 {
    margin: 0 0 20px 0;
    font-size: 16px;
  }
}

.team-goal-setting {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}
</style>
