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

      <!-- 主导航 - 基于5大核心功能模块优化 -->
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
        <el-menu-item index="customerSandbox">
          <el-icon><DataAnalysis /></el-icon>
          <span>客户沙盘</span>
        </el-menu-item>
        <el-menu-item index="contactsRelationship">
          <el-icon><Connection /></el-icon>
          <span>联系人与关系</span>
        </el-menu-item>
        <el-menu-item index="productMatrix">
          <el-icon><Grid /></el-icon>
          <span>产品矩阵</span>
        </el-menu-item>
        <el-menu-item index="salesTarget">
          <el-icon><TrendCharts /></el-icon>
          <span>销售目标</span>
        </el-menu-item>
        <el-menu-item index="biddingAI">
          <el-icon><Trophy /></el-icon>
          <span>投标预测</span>
        </el-menu-item>
        <el-menu-item index="aiAgent">
          <el-icon><MagicStick /></el-icon>
          <span>AI智能体</span>
        </el-menu-item>
        <el-menu-item index="automation">
          <el-icon><Setting /></el-icon>
          <span>自动化流程</span>
        </el-menu-item>
        <el-menu-item index="tasks">
          <el-icon><DocumentCopy /></el-icon>
          <span>待办任务</span>
        </el-menu-item>
        <el-menu-item index="dataQuality">
          <el-icon><Monitor /></el-icon>
          <span>数据质量</span>
        </el-menu-item>
        <el-menu-item index="dataSync">
          <el-icon><Connection /></el-icon>
          <span>数据同步</span>
        </el-menu-item>
        <el-menu-item index="dataGovernance">
          <el-icon><Management /></el-icon>
          <span>数据治理</span>
        </el-menu-item>
        <el-menu-item index="behaviorModel">
          <el-icon><DataLine /></el-icon>
          <span>行为模型</span>
        </el-menu-item>
      </el-menu>

      <!-- 工具栏 -->
      <div class="header-toolbar">
        <!-- Phase 1-3: 自然语言智能搜索 -->
        <el-popover
          v-model:visible="nlpSearchVisible"
          placement="bottom-start"
          :width="600"
          trigger="click"
        >
          <template #reference>
            <el-input
              v-model="globalSearch"
              placeholder="💬 试试说: 查询本月高流失风险客户..."
              clearable
              style="width: 400px;"
              @keyup.enter="handleNLPSearch"
            >
              <template #prefix>
                <el-icon><MagicStick /></el-icon>
              </template>
              <template #suffix>
                <el-tag v-if="nlpMode" size="small" type="success">AI模式</el-tag>
              </template>
            </el-input>
          </template>

          <!-- 智能搜索面板 -->
          <div class="nlp-search-panel">
            <div class="panel-header">
              <h4>🤖 AI智能助手</h4>
              <el-switch
                v-model="nlpMode"
                active-text="AI模式"
                inactive-text="普通搜索"
                @change="handleModeChange"
              />
            </div>

            <!-- Phase 1: 快速指令 -->
            <div v-if="!nlpMode" class="quick-commands">
              <h5>⚡ 快速指令</h5>
              <div class="command-grid">
                <el-button
                  v-for="cmd in quickCommands"
                  :key="cmd.id"
                  size="small"
                  @click="executeQuickCommand(cmd)"
                >
                  <el-icon><component :is="cmd.icon" /></el-icon>
                  {{ cmd.label }}
                </el-button>
              </div>
            </div>

            <!-- Phase 2 & 3: 智能解析与AI对话 -->
            <div v-else class="ai-conversation">
              <div class="conversation-history">
                <div
                  v-for="msg in conversationHistory"
                  :key="msg.id"
                  :class="['message', msg.role]"
                >
                  <div class="message-avatar">
                    <el-avatar :size="32">
                      {{ msg.role === 'user' ? '我' : 'AI' }}
                    </el-avatar>
                  </div>
                  <div class="message-content">
                    <div class="message-text">{{ msg.text }}</div>
                    <div v-if="msg.result" class="message-result">
                      <el-tag v-if="msg.result.type === 'count'" type="success">
                        找到 {{ msg.result.count }} 条结果
                      </el-tag>
                      <el-button
                        v-if="msg.result.action"
                        size="small"
                        type="primary"
                        @click="executeAction(msg.result.action)"
                      >
                        {{ msg.result.actionLabel }}
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 智能推荐 -->
              <div class="ai-suggestions">
                <el-tag
                  v-for="suggestion in aiSuggestions"
                  :key="suggestion"
                  size="small"
                  effect="plain"
                  @click="applySuggestion(suggestion)"
                  style="cursor: pointer; margin-right: 8px;"
                >
                  {{ suggestion }}
                </el-tag>
              </div>
            </div>

            <!-- 历史查询记录 -->
            <div class="search-history">
              <h5>📝 最近查询</h5>
              <div class="history-list">
                <el-tag
                  v-for="history in searchHistory.slice(0, 5)"
                  :key="history.id"
                  closable
                  @click="replaySearch(history)"
                  @close="removeHistory(history.id)"
                  style="margin: 4px;"
                >
                  {{ history.query }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-popover>

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

        <el-dropdown @command="handleUserCommand" trigger="click">
          <div class="user-info">
            <el-avatar :size="36">销</el-avatar>
            <span class="user-name">销售经理</span>
            <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu class="user-dropdown-menu">
              <el-dropdown-item command="profile">
                <el-icon><User /></el-icon>
                <span>个人设置</span>
              </el-dropdown-item>
              <el-dropdown-item command="logout" divided>
                <el-icon><SwitchButton /></el-icon>
                <span>退出登录</span>
              </el-dropdown-item>
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
            <el-button type="primary" @click="createOpportunityDialog">
              <el-icon><Plus /></el-icon>
              新增商机
            </el-button>
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

      <!-- 自动化流程视图 -->
      <div v-show="activeTab === 'automation'" class="automation-view">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>⚙️ 自动化工作流配置</span>
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

      <!-- 数据质量监控视图 -->
      <div v-show="activeTab === 'dataQuality'">
        <DataQualityMonitor />
      </div>

      <!-- 数据治理视图 -->
      <div v-show="activeTab === 'dataGovernance'">
        <DataGovernancePanel />
      </div>

      <!-- 待办任务视图 -->
      <div v-show="activeTab === 'tasks'" class="tasks-view">
        <div class="task-filters">
          <el-radio-group v-model="taskFilter">
            <el-radio-button label="all">全部</el-radio-button>
            <el-radio-button label="ai">AI推荐</el-radio-button>
            <el-radio-button label="manual">手动创建</el-radio-button>
            <el-radio-button label="pending">待确认</el-radio-button>
            <el-radio-button label="completed">已完成</el-radio-button>
          </el-radio-group>
        </div>

        <el-table :data="filteredTasks" border style="margin-top: 20px;">
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

      <!-- 产品矩阵管理视图 - 基于企业产品矩阵prompt -->
      <div v-show="activeTab === 'productMatrix'" class="product-matrix-view">
        <div class="view-header">
          <h2>📊 企业产品矩阵管理</h2>
          <div class="header-actions">
            <el-button type="primary" @click="openProductDataDialog">
              <el-icon><Plus /></el-icon>
              添加产品数据
            </el-button>
            <el-select v-model="matrixPeriod" style="width: 150px;">
              <el-option label="本月" value="month" />
              <el-option label="本季度" value="quarter" />
              <el-option label="本年" value="year" />
            </el-select>
            <el-button type="success" @click="refreshMatrix">
              <el-icon><Refresh /></el-icon>
              刷新数据
            </el-button>
          </div>
        </div>

        <!-- 产品矩阵KPI -->
        <el-row :gutter="20" class="kpi-cards">
          <el-col :span="6" v-for="kpi in productMatrixKPIs" :key="kpi.id">
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

        <!-- 产品收益-现金流矩阵图 -->
        <el-row :gutter="20" class="mt-4">
          <el-col :span="16">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>产品收益-现金流矩阵</span>
                  <el-tag>总产品：{{ totalProducts }}个</el-tag>
                </div>
              </template>
              <div id="productMatrixChart" style="height: 500px;"></div>
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card>
              <template #header>
                <span>🤖 AI战略建议</span>
              </template>
              <div class="ai-strategy-panel">
                <el-alert type="success" :closable="false" class="mb-3">
                  <template #title>
                    <el-icon><Lightning /></el-icon>
                    智能分析完成
                  </template>
                </el-alert>

                <div class="strategy-item">
                  <h4>核心战略产品 ({{ coreProducts }}个)</h4>
                  <p>高收益、高现金流，建议保持并增加资源投入</p>
                  <el-tag type="success">优先级: 最高</el-tag>
                </div>

                <div class="strategy-item">
                  <h4>优化提升产品 ({{ optimizeProducts }}个)</h4>
                  <p>高收益、低现金流,建议改善库存和账期</p>
                  <el-tag type="warning">优先级: 中</el-tag>
                </div>

                <div class="strategy-item">
                  <h4>维持运营产品 ({{ maintainProducts }}个)</h4>
                  <p>低收益、高现金流，建议保持现状低成本管理</p>
                  <el-tag type="info">优先级: 低</el-tag>
                </div>

                <div class="strategy-item">
                  <h4>淘汰替代产品 ({{ eliminateProducts }}个)</h4>
                  <p>低收益、低现金流，建议停产、替代或升级</p>
                  <el-tag type="danger">优先级: 淘汰</el-tag>
                </div>

                <el-divider />

                <el-button type="primary" @click="viewMatrixAIInsights" block>
                  <el-icon><View /></el-icon>
                  查看详细建议
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- BCG矩阵与产品列表 -->
        <el-row :gutter="20" class="mt-4">
          <el-col :span="12">
            <el-card>
              <template #header>
                <span>BCG矩阵分析</span>
              </template>
              <div id="bcgMatrixChart" style="height: 400px;"></div>
            </el-card>
          </el-col>

          <el-col :span="12">
            <el-card>
              <template #header>
                <span>产品大类贡献分析</span>
              </template>
              <div id="categoryContributionChart" style="height: 400px;"></div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 重点产品列表 -->
        <el-card class="mt-4">
          <template #header>
            <div class="card-header">
              <span>🔥 重点关注产品</span>
              <el-button type="primary" size="small" @click="addProduct">
                <el-icon><Plus /></el-icon>
                添加产品
              </el-button>
            </div>
          </template>

          <el-table :data="keyProducts" stripe>
            <el-table-column prop="name" label="产品名称" width="200" />
            <el-table-column prop="category" label="产品大类" width="120" />
            <el-table-column prop="sales" label="销售额" width="120">
              <template #default="{ row }">
                ¥{{ (row.sales / 10000).toFixed(1) }}万
              </template>
            </el-table-column>
            <el-table-column prop="profit" label="毛利率" width="100">
              <template #default="{ row }">
                {{ row.profit }}%
              </template>
            </el-table-column>
            <el-table-column prop="cashFlow" label="现金流贡献" width="120">
              <template #default="{ row }">
                <el-progress :percentage="row.cashFlow" :color="getProgressColor(row.cashFlow)" />
              </template>
            </el-table-column>
            <el-table-column prop="lifecycle" label="生命周期" width="100">
              <template #default="{ row }">
                <el-tag :type="getLifecycleType(row.lifecycle)">{{ row.lifecycle }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="strategy" label="战略分类" width="120">
              <template #default="{ row }">
                <el-tag :type="getStrategyType(row.strategy)">{{ row.strategy }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="AI建议" min-width="200">
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
                <el-button size="small" @click="viewProductDetail(row)">查看</el-button>
                <el-button size="small" type="primary" @click="optimizeProduct(row)">优化</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- 产品数据管理表格 -->
        <el-card class="mt-4">
          <template #header>
            <div class="card-header">
              <span>📝 产品数据管理（可手动添加/编辑）</span>
              <el-tag type="success">共 {{ productMatrixData.length }} 个产品</el-tag>
            </div>
          </template>
          
          <el-table :data="productMatrixData" stripe>
            <el-table-column prop="name" label="产品名称" width="200" />
            <el-table-column prop="category" label="产品类别" width="120" />
            <el-table-column prop="profit" label="毛利率 (%)" width="120" />
            <el-table-column prop="cashFlow" label="现金流贡献 (%)" width="140" />
            <el-table-column prop="revenue" label="收益（元）" width="150">
              <template #default="{ row }">
                ¥{{ (row.revenue / 10000).toFixed(1) }}万
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right">
              <template #default="{ $index }">
                <el-button size="small" type="danger" @click="deleteProductData($index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>

      <!-- 销售目标管理视图 - 基于销售目标管理prompt -->
      <div v-show="activeTab === 'salesTarget'" class="sales-target-view">
        <div class="view-header">
          <h2>🎯 销售目标管理</h2>
          <div class="header-actions">
            <el-button type="primary" @click="createTarget">
              <el-icon><Plus /></el-icon>
              新建目标
            </el-button>
            <el-button type="success" @click="refreshTargets">
              <el-icon><Refresh /></el-icon>
              刷新数据
            </el-button>
          </div>
        </div>

        <!-- 目标完成情况概览 -->
        <el-row :gutter="20" class="kpi-cards">
          <el-col :span="6" v-for="kpi in targetKPIs" :key="kpi.id">
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

        <!-- 个人与团队目标 -->
        <el-row :gutter="20" class="mt-4">
          <el-col :span="12">
            <el-card>
              <template #header>
                <span>👤 个人目标</span>
              </template>
              <div class="target-progress">
                <div v-for="target in personalTargets" :key="target.id" class="target-item">
                  <div class="target-header">
                    <span class="target-name">{{ target.name }}</span>
                    <span class="target-value">{{ target.current }} / {{ target.goal }}</span>
                  </div>
                  <el-progress 
                    :percentage="target.progress" 
                    :color="getProgressColor(target.progress)"
                    :status="target.progress >= 100 ? 'success' : null"
                  />
                  <div class="target-info">
                    <span>截止: {{ target.deadline }}</span>
                    <el-tag size="small" :type="target.status === '进行中' ? 'primary' : 'success'">
                      {{ target.status }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>

          <el-col :span="12">
            <el-card>
              <template #header>
                <span>👥 团队目标</span>
              </template>
              <div class="target-progress">
                <div v-for="target in teamTargets" :key="target.id" class="target-item">
                  <div class="target-header">
                    <span class="target-name">{{ target.name }}</span>
                    <span class="target-value">{{ target.current }} / {{ target.goal }}</span>
                  </div>
                  <el-progress 
                    :percentage="target.progress" 
                    :color="getProgressColor(target.progress)"
                    :status="target.progress >= 100 ? 'success' : null"
                  />
                  <div class="target-info">
                    <span>截止: {{ target.deadline }}</span>
                    <el-tag size="small" :type="target.status === '进行中' ? 'primary' : 'success'">
                      {{ target.status }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- AI预测与行动计划 -->
        <el-row :gutter="20" class="mt-4">
          <el-col :span="16">
            <el-card>
              <template #header>
                <span>📈 销售预测与趋势</span>
              </template>
              <div id="salesForecastChart" style="height: 400px;"></div>
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card>
              <template #header>
                <span>🤖 AI分析与建议</span>
              </template>
              <div class="ai-analysis-panel">
                <el-alert type="info" :closable="false" class="mb-3">
                  <template #title>
                    <el-icon><Lightning /></el-icon>
                    智能预测完成
                  </template>
                </el-alert>

                <div class="analysis-item">
                  <h4>短期预测 (3-6月)</h4>
                  <p>预计完成率: {{ shortTermForecast }}%</p>
                  <el-progress :percentage="shortTermForecast" :color="getProgressColor(shortTermForecast)" />
                </div>

                <div class="analysis-item">
                  <h4>中期预测 (1年)</h4>
                  <p>预计完成率: {{ midTermForecast }}%</p>
                  <el-progress :percentage="midTermForecast" :color="getProgressColor(midTermForecast)" />
                </div>

                <div class="analysis-item">
                  <h4>长期预测 (3年)</h4>
                  <p>预计完成率: {{ longTermForecast }}%</p>
                  <el-progress :percentage="longTermForecast" :color="getProgressColor(longTermForecast)" />
                </div>

                <el-divider />

                <div class="analysis-item">
                  <h4>🎯 改进建议</h4>
                  <el-tag 
                    v-for="suggestion in targetSuggestions" 
                    :key="suggestion"
                    type="warning"
                    class="mr-2 mb-2"
                  >
                    {{ suggestion }}
                  </el-tag>
                </div>

                <el-button type="primary" @click="viewTargetAIInsights" block class="mt-3">
                  <el-icon><View /></el-icon>
                  查看详细分析
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 行动计划列表 -->
        <el-card class="mt-4">
          <template #header>
            <div class="card-header">
              <span>📋 行动计划</span>
              <el-button type="primary" size="small" @click="createActionPlan">
                <el-icon><Plus /></el-icon>
                新建计划
              </el-button>
            </div>
          </template>

          <el-table :data="actionPlans" stripe>
            <el-table-column prop="name" label="计划名称" width="200" />
            <el-table-column prop="target" label="关联目标" width="150" />
            <el-table-column prop="owner" label="负责人" width="100" />
            <el-table-column prop="startDate" label="开始时间" width="120" />
            <el-table-column prop="endDate" label="结束时间" width="120" />
            <el-table-column prop="progress" label="完成进度" width="150">
              <template #default="{ row }">
                <el-progress :percentage="row.progress" :color="getProgressColor(row.progress)" />
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getTaskStatusType(row.status)">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button size="small" @click="viewPlanDetail(row)">查看</el-button>
                <el-button size="small" type="primary" @click="updatePlan(row)">更新</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>

      <!-- 联系人与关系图谱视图 -->
      <div v-show="activeTab === 'contactsRelationship'" class="contacts-relationship-view">
        <div class="view-header">
          <h2>👥 客户联系人与关系图谱</h2>
          <div class="header-actions">
            <el-button type="primary" @click="addContact">
              <el-icon><Plus /></el-icon>
              添加联系人
            </el-button>
            <el-button type="success" @click="refreshRelationship">
              <el-icon><Refresh /></el-icon>
              刷新关系图
            </el-button>
          </div>
        </div>

        <!-- 联系人KPI -->
        <el-row :gutter="20" class="kpi-cards">
          <el-col :span="6" v-for="kpi in contactsKPIs" :key="kpi.id">
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

        <!-- 关系图谱与联系人列表 -->
        <el-row :gutter="20" class="mt-4">
          <el-col :span="14">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>🔗 客户关系图谱</span>
                  <el-radio-group v-model="relationshipView" size="small">
                    <el-radio-button label="network">网络图</el-radio-button>
                    <el-radio-button label="hierarchy">层级图</el-radio-button>
                    <el-radio-button label="matrix">矩阵图</el-radio-button>
                  </el-radio-group>
                </div>
              </template>
              <div id="relationshipGraph" style="height: 600px;"></div>
            </el-card>
          </el-col>

          <el-col :span="10">
            <el-card>
              <template #header>
                <span>📋 联系人列表</span>
              </template>
              
              <el-input
                v-model="contactSearch"
                placeholder="搜索联系人..."
                clearable
                class="mb-3"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>

              <el-table :data="filteredContacts" stripe height="540">
                <el-table-column prop="name" label="姓名" width="100" />
                <el-table-column prop="title" label="职位" width="120" />
                <el-table-column prop="company" label="公司" width="140" />
                <el-table-column prop="influence" label="影响力" width="100">
                  <template #default="{ row }">
                    <el-rate v-model="row.influence" disabled />
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120" fixed="right">
                  <template #default="{ row }">
                    <el-button size="small" @click="viewContact(row)">详情</el-button>
                    <el-button size="small" type="primary" @click="contactPerson(row)">联系</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>
        </el-row>

        <!-- 关键联系人与互动记录 -->
        <el-row :gutter="20" class="mt-4">
          <el-col :span="12">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>⭐ 关键联系人</span>
                  <el-tag>影响力排名 TOP 10</el-tag>
                </div>
              </template>

              <el-table :data="keyContacts" stripe>
                <el-table-column type="index" label="排名" width="60" />
                <el-table-column prop="name" label="姓名" width="100" />
                <el-table-column prop="title" label="职位" width="120" />
                <el-table-column prop="company" label="公司" width="140" />
                <el-table-column prop="department" label="部门" width="100" />
                <el-table-column prop="influence" label="影响力" width="100">
                  <template #default="{ row }">
                    <el-progress :percentage="row.influence * 20" :color="getProgressColor(row.influence * 20)" />
                  </template>
                </el-table-column>
                <el-table-column prop="lastContact" label="最近联系" width="120" />
                <el-table-column label="操作" width="100" fixed="right">
                  <template #default="{ row }">
                    <el-button size="small" @click="viewContactDetail(row)">详情</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
          </el-col>

          <el-col :span="12">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>📞 最近互动记录</span>
                  <el-button size="small" @click="addInteraction">
                    <el-icon><Plus /></el-icon>
                    新增互动
                  </el-button>
                </div>
              </template>

              <el-timeline>
                <el-timeline-item
                  v-for="activity in recentInteractions"
                  :key="activity.id"
                  :timestamp="activity.timestamp"
                  :color="activity.color"
                  placement="top"
                >
                  <el-card>
                    <h4>{{ activity.contactName }} - {{ activity.title }}</h4>
                    <p>{{ activity.content }}</p>
                    <div class="activity-tags">
                      <el-tag size="small" :type="activity.typeTag">{{ activity.type }}</el-tag>
                      <el-tag size="small">{{ activity.channel }}</el-tag>
                    </div>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </el-card>
          </el-col>
        </el-row>

        <!-- 智能推荐 -->
        <el-card class="mt-4">
          <template #header>
            <div class="card-header">
              <span>🤖 AI智能推荐</span>
              <el-icon><Lightning /></el-icon>
            </div>
          </template>

          <el-row :gutter="20">
            <el-col :span="8">
              <div class="ai-recommendation">
                <h4>🎯 优先跟进联系人</h4>
                <el-table :data="priorityContacts" stripe>
                  <el-table-column prop="name" label="姓名" />
                  <el-table-column prop="reason" label="推荐理由" />
                  <el-table-column label="操作" width="80">
                    <template #default="{ row }">
                      <el-button size="small" type="primary" @click="followUp(row)">跟进</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-col>

            <el-col :span="8">
              <div class="ai-recommendation">
                <h4>🔍 潜在关键人物</h4>
                <el-table :data="potentialKeyPersons" stripe>
                  <el-table-column prop="name" label="姓名" />
                  <el-table-column prop="potential" label="潜力评分">
                    <template #default="{ row }">
                      <el-progress :percentage="row.potential" />
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="80">
                    <template #default="{ row }">
                      <el-button size="small" @click="cultivate(row)">培养</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-col>

            <el-col :span="8">
              <div class="ai-recommendation">
                <h4>⚠️ 关系维护提醒</h4>
                <el-alert
                  v-for="reminder in relationshipReminders"
                  :key="reminder.id"
                  :type="reminder.type"
                  :title="reminder.title"
                  :description="reminder.description"
                  :closable="false"
                  class="mb-2"
                />
              </div>
            </el-col>
          </el-row>
        </el-card>
      </div>

      <!-- 客户沙盘分析视图 - 基于客户360沙盘prompt -->
      <div v-show="activeTab === 'customerSandbox'" class="customer-sandbox-view">
        <div class="view-header">
          <h2>📊 客户沙盘分析</h2>
          <div class="header-actions">
            <el-button type="primary" @click="createScenario">
              <el-icon><Plus /></el-icon>
              新建场景
            </el-button>
            <el-button type="success" @click="runSimulation">
              <el-icon><VideoPlay /></el-icon>
              运行模拟
            </el-button>
          </div>
        </div>

        <!-- 场景设置 -->
        <el-row :gutter="20" class="kpi-cards">
          <el-col :span="6" v-for="kpi in sandboxKPIs" :key="kpi.id">
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

        <!-- 策略模拟面板 -->
        <el-row :gutter="20" class="mt-4">
          <el-col :span="16">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>策略参数设置</span>
                  <el-tag>当前场景: {{ currentScenario }}</el-tag>
                </div>
              </template>
              
              <div class="strategy-settings">
                <el-form label-width="120px">
                  <el-form-item label="价格策略">
                    <el-slider v-model="priceStrategy" :min="-30" :max="30" :step="5" show-stops />
                    <span>{{ priceStrategy > 0 ? '+' : '' }}{{ priceStrategy }}%</span>
                  </el-form-item>
                  
                  <el-form-item label="折扣力度">
                    <el-slider v-model="discountLevel" :max="50" show-stops />
                    <span>{{ discountLevel }}%</span>
                  </el-form-item>
                  
                  <el-form-item label="营销渠道">
                    <el-checkbox-group v-model="selectedChannels">
                      <el-checkbox label="邮件">邮件</el-checkbox>
                      <el-checkbox label="短信">短信</el-checkbox>
                      <el-checkbox label="App推送">App推送</el-checkbox>
                      <el-checkbox label="客服跟进">客服跟进</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  
                  <el-form-item label="触达频率">
                    <el-radio-group v-model="contactFrequency">
                      <el-radio label="low">低频 (每周1次)</el-radio>
                      <el-radio label="medium">中频 (每周2-3次)</el-radio>
                      <el-radio label="high">高频 (每日1次)</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  
                  <el-form-item label="目标客户群">
                    <el-select v-model="targetCustomerGroup" placeholder="选择客户群">
                      <el-option label="高价值客户" value="high-value" />
                      <el-option label="流失风险客户" value="churn-risk" />
                      <el-option label="潜力客户" value="potential" />
                      <el-option label="全部客户" value="all" />
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card>
              <template #header>
                <span>🤖 AI模拟预测</span>
              </template>
              <div class="simulation-results">
                <el-alert type="info" :closable="false" class="mb-3">
                  <template #title>
                    <el-icon><Lightning /></el-icon>
                    模拟分析完成
                  </template>
                </el-alert>

                <div class="result-item">
                  <h4>预测转化率</h4>
                  <el-progress :percentage="predictedConversion" :color="getProgressColor(predictedConversion)" />
                  <p>{{ predictedConversionText }}</p>
                </div>

                <div class="result-item">
                  <h4>预测收入变化</h4>
                  <div class="revenue-change">
                    <span class="value" :class="revenueChange > 0 ? 'positive' : 'negative'">
                      {{ revenueChange > 0 ? '+' : '' }}{{ revenueChange }}%
                    </span>
                  </div>
                  <p>预计收入: ¥{{ predictedRevenueSandbox }}万</p>
                </div>

                <div class="result-item">
                  <h4>客户流失风险</h4>
                  <el-progress :percentage="churnRisk" color="#F56C6C" />
                  <p>{{ churnRiskText }}</p>
                </div>

                <el-divider />

                <el-button type="primary" @click="applySandboxStrategy" block>
                  <el-icon><Check /></el-icon>
                  应用此策略
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 模拟结果可视化 -->
        <el-row :gutter="20" class="mt-4">
          <el-col :span="12">
            <el-card>
              <template #header>
                <span>收益-风险矩阵</span>
              </template>
              <div id="revenueRiskMatrix" style="height: 400px;"></div>
            </el-card>
          </el-col>

          <el-col :span="12">
            <el-card>
              <template #header>
                <span>敏感性分析</span>
              </template>
              <div id="sensitivityChart" style="height: 400px;"></div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 历史场景对比 -->
        <el-card class="mt-4">
          <template #header>
            <div class="card-header">
              <span>📋 历史场景对比</span>
              <el-button type="primary" size="small" @click="exportScenarios">
                <el-icon><Download /></el-icon>
                导出报告
              </el-button>
            </div>
          </template>

          <el-table :data="historicalScenarios" stripe>
            <el-table-column prop="name" label="场景名称" width="200" />
            <el-table-column prop="date" label="创建时间" width="150" />
            <el-table-column prop="conversion" label="转化率" width="120">
              <template #default="{ row }">
                {{ row.conversion }}%
              </template>
            </el-table-column>
            <el-table-column prop="revenue" label="预测收入" width="120">
              <template #default="{ row }">
                ¥{{ row.revenue }}万
              </template>
            </el-table-column>
            <el-table-column prop="roi" label="ROI" width="100">
              <template #default="{ row }">
                {{ row.roi }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getScenarioStatusType(row.status)">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button size="small" @click="loadScenario(row)">加载</el-button>
                <el-button size="small" type="primary" @click="compareScenario(row)">对比</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>

      <!-- 投标预测AI视图 - 基于投标预测AI prompt -->
      <div v-show="activeTab === 'biddingAI'" class="bidding-ai-view">
        <div class="view-header">
          <h2>🏆 三轮投标预测AI</h2>
          <div class="header-actions">
            <el-button type="primary" @click="createBiddingProject">
              <el-icon><Plus /></el-icon>
              新建投标项目
            </el-button>
            <el-button type="success" @click="runBiddingSimulation">
              <el-icon><VideoPlay /></el-icon>
              运行模拟
            </el-button>
          </div>
        </div>

        <!-- 投标项目概览 -->
        <el-row :gutter="20" class="kpi-cards">
          <el-col :span="6" v-for="kpi in biddingKPIs" :key="kpi.id">
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

        <!-- 三轮投标模拟 -->
        <el-row :gutter="20" class="mt-4">
          <el-col :span="16">
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>三轮投标报价模拟</span>
                  <el-tag>当前项目: {{ currentBiddingProject }}</el-tag>
                </div>
              </template>
              
              <el-tabs v-model="biddingRound" type="card">
                <el-tab-pane label="第一轮" name="round1">
                  <div class="bidding-round-content">
                    <h3>第一轮 - 初始报价策略</h3>
                    <div class="competitor-analysis">
                      <el-table :data="round1Competitors" stripe>
                        <el-table-column prop="name" label="竞争对手" width="150" />
                        <el-table-column prop="predictedPrice" label="预测报价" width="150">
                          <template #default="{ row }">
                            ¥{{ (row.predictedPrice / 10000).toFixed(1) }}万
                          </template>
                        </el-table-column>
                        <el-table-column prop="confidence" label="置信度" width="120">
                          <template #default="{ row }">
                            <el-progress :percentage="row.confidence" :color="getProgressColor(row.confidence)" />
                          </template>
                        </el-table-column>
                        <el-table-column prop="strategy" label="预测策略" min-width="200" />
                      </el-table>
                    </div>
                    
                    <el-divider />
                    
                    <div class="ai-recommendation">
                      <h4>🤖 AI推荐报价</h4>
                      <div class="price-recommendation">
                        <div class="price-item">
                          <span class="label">推荐报价:</span>
                          <span class="value success">¥{{ round1RecommendedPrice }}万</span>
                        </div>
                        <div class="price-item">
                          <span class="label">预测胜率:</span>
                          <el-progress :percentage="round1WinRate" :color="getProgressColor(round1WinRate)" />
                        </div>
                        <div class="price-item">
                          <span class="label">预期利润:</span>
                          <span class="value">¥{{ round1ExpectedProfit }}万</span>
                        </div>
                      </div>
                      <p class="ai-reason">{{ round1AIReason }}</p>
                    </div>
                  </div>
                </el-tab-pane>

                <el-tab-pane label="第二轮" name="round2">
                  <div class="bidding-round-content">
                    <h3>第二轮 - 调整优化策略</h3>
                    <div class="competitor-analysis">
                      <el-table :data="round2Competitors" stripe>
                        <el-table-column prop="name" label="竞争对手" width="150" />
                        <el-table-column prop="round1Price" label="第一轮报价" width="150">
                          <template #default="{ row }">
                            ¥{{ (row.round1Price / 10000).toFixed(1) }}万
                          </template>
                        </el-table-column>
                        <el-table-column prop="predictedPrice" label="预测第二轮" width="150">
                          <template #default="{ row }">
                            ¥{{ (row.predictedPrice / 10000).toFixed(1) }}万
                          </template>
                        </el-table-column>
                        <el-table-column prop="change" label="变化趋势" width="120">
                          <template #default="{ row }">
                            <el-tag :type="row.change > 0 ? 'danger' : 'success'">
                              {{ row.change > 0 ? '+' : '' }}{{ row.change }}%
                            </el-tag>
                          </template>
                        </el-table-column>
                        <el-table-column prop="strategy" label="调整策略" min-width="200" />
                      </el-table>
                    </div>
                    
                    <el-divider />
                    
                    <div class="ai-recommendation">
                      <h4>🤖 AI优化建议</h4>
                      <div class="price-recommendation">
                        <div class="price-item">
                          <span class="label">推荐报价:</span>
                          <span class="value success">¥{{ round2RecommendedPrice }}万</span>
                        </div>
                        <div class="price-item">
                          <span class="label">预测胜率:</span>
                          <el-progress :percentage="round2WinRate" :color="getProgressColor(round2WinRate)" />
                        </div>
                        <div class="price-item">
                          <span class="label">预期利润:</span>
                          <span class="value">¥{{ round2ExpectedProfit }}万</span>
                        </div>
                      </div>
                      <p class="ai-reason">{{ round2AIReason }}</p>
                    </div>
                  </div>
                </el-tab-pane>

                <el-tab-pane label="第三轮" name="round3">
                  <div class="bidding-round-content">
                    <h3>第三轮 - 最终决战策略</h3>
                    <div class="competitor-analysis">
                      <el-table :data="round3Competitors" stripe>
                        <el-table-column prop="name" label="竞争对手" width="150" />
                        <el-table-column prop="round2Price" label="第二轮报价" width="150">
                          <template #default="{ row }">
                            ¥{{ (row.round2Price / 10000).toFixed(1) }}万
                          </template>
                        </el-table-column>
                        <el-table-column prop="predictedPrice" label="预测最终报价" width="150">
                          <template #default="{ row }">
                            ¥{{ (row.predictedPrice / 10000).toFixed(1) }}万
                          </template>
                        </el-table-column>
                        <el-table-column prop="finalRank" label="预测排名" width="100">
                          <template #default="{ row }">
                            <el-tag :type="row.finalRank === 1 ? 'danger' : 'info'">
                              第{{ row.finalRank }}名
                            </el-tag>
                          </template>
                        </el-table-column>
                        <el-table-column prop="winProbability" label="中标概率" width="120">
                          <template #default="{ row }">
                            {{ row.winProbability }}%
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                    
                    <el-divider />
                    
                    <div class="ai-recommendation">
                      <h4>🤖 AI最终建议</h4>
                      <div class="price-recommendation">
                        <div class="price-item">
                          <span class="label">推荐报价:</span>
                          <span class="value success">¥{{ round3RecommendedPrice }}万</span>
                        </div>
                        <div class="price-item">
                          <span class="label">预测胜率:</span>
                          <el-progress :percentage="round3WinRate" :color="getProgressColor(round3WinRate)" />
                        </div>
                        <div class="price-item">
                          <span class="label">预期利润:</span>
                          <span class="value">¥{{ round3ExpectedProfit }}万</span>
                        </div>
                        <div class="price-item">
                          <span class="label">预测排名:</span>
                          <el-tag type="success" size="large">第{{ predictedRank }}名</el-tag>
                        </div>
                      </div>
                      <p class="ai-reason">{{ round3AIReason }}</p>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-card>
          </el-col>

          <el-col :span="8">
            <el-card>
              <template #header>
                <span>📊 蒙特卡洛模拟分析</span>
              </template>
              <div id="monteCarloChart" style="height: 300px;"></div>
              
              <el-divider />
              
              <div class="simulation-stats">
                <h4>模拟统计 (10,000次)</h4>
                <div class="stat-item">
                  <span class="label">平均胜率:</span>
                  <span class="value">{{ monteCarloAvgWinRate }}%</span>
                </div>
                <div class="stat-item">
                  <span class="label">最优报价区间:</span>
                  <span class="value">¥{{ monteCarloPriceRange }}</span>
                </div>
                <div class="stat-item">
                  <span class="label">风险评估:</span>
                  <el-tag :type="monteCarloRisk === '低' ? 'success' : monteCarloRisk === '中' ? 'warning' : 'danger'">
                    {{ monteCarloRisk }}风险
                  </el-tag>
                </div>
              </div>
            </el-card>

            <el-card class="mt-3">
              <template #header>
                <span>🎯 竞争对手行为预测</span>
              </template>
              <div class="competitor-behavior">
                <div v-for="behavior in competitorBehaviors" :key="behavior.name" class="behavior-item">
                  <h5>{{ behavior.name }}</h5>
                  <el-tag size="small" :type="behavior.risk">{{ behavior.strategy }}</el-tag>
                  <p>{{ behavior.prediction }}</p>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>

        <!-- 投标项目列表 -->
        <el-card class="mt-4">
          <template #header>
            <div class="card-header">
              <span>📋 投标项目管理</span>
              <el-button type="primary" size="small" @click="createBiddingProject">
                <el-icon><Plus /></el-icon>
                新建项目
              </el-button>
            </div>
          </template>

          <el-table :data="biddingProjects" stripe>
            <el-table-column prop="name" label="项目名称" width="200" />
            <el-table-column prop="customer" label="客户" width="150" />
            <el-table-column prop="budget" label="项目预算" width="120">
              <template #default="{ row }">
                ¥{{ (row.budget / 10000).toFixed(1) }}万
              </template>
            </el-table-column>
            <el-table-column prop="competitors" label="竞争对手数" width="120" />
            <el-table-column prop="currentRound" label="当前轮次" width="100">
              <template #default="{ row }">
                <el-tag>第{{ row.currentRound }}轮</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="winRate" label="预测胜率" width="120">
              <template #default="{ row }">
                <el-progress :percentage="row.winRate" :color="getProgressColor(row.winRate)" />
              </template>
            </el-table-column>
            <el-table-column prop="deadline" label="截止时间" width="120" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="getBiddingStatusType(row.status)">{{ row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="{ row }">
                <el-button size="small" @click="viewBiddingDetail(row)">查看</el-button>
                <el-button size="small" type="primary" @click="simulateBidding(row)">模拟</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
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

    <!-- 新增商机对话框 -->
    <el-dialog v-model="showOpportunityDialog" title="新增商机" width="600px">
      <el-form :model="opportunityForm" label-width="100px">
        <el-form-item label="商机名称" required>
          <el-input v-model="opportunityForm.name" placeholder="请输入商机名称" />
        </el-form-item>
        <el-form-item label="客户名称">
          <el-select v-model="opportunityForm.customerId" placeholder="请选择客户" style="width: 100%">
            <el-option v-for="customer in customers" :key="customer.id" :label="customer.name" :value="customer.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="预计金额" required>
          <el-input v-model="opportunityForm.amount" placeholder="请输入金额（万元）">
            <template #append>万元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="商机阶段">
          <el-select v-model="opportunityForm.stage" style="width: 100%">
            <el-option label="需求挖掘" value="qualification" />
            <el-option label="方案设计" value="proposal" />
            <el-option label="报价谈判" value="negotiation" />
            <el-option label="合同签订" value="contract" />
          </el-select>
        </el-form-item>
        <el-form-item label="成功概率">
          <el-slider v-model="opportunityForm.probability" :marks="{ 0: '0%', 25: '25%', 50: '50%', 75: '75%', 100: '100%' }" />
        </el-form-item>
        <el-form-item label="预计成交日期">
          <el-date-picker v-model="opportunityForm.expectedCloseDate" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="备注说明">
          <el-input v-model="opportunityForm.description" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showOpportunityDialog = false">取消</el-button>
        <el-button type="primary" @click="submitOpportunity">确定</el-button>
      </template>
    </el-dialog>

    <!-- 新增客户对话框 -->
    <el-dialog v-model="showCustomerDialog" title="新增客户" width="700px">
      <el-form :model="customerForm" label-width="120px">
        <el-form-item label="客户名称" required>
          <el-input v-model="customerForm.name" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="所属行业">
          <el-select v-model="customerForm.industry" placeholder="请选择行业" style="width: 100%">
            <el-option label="汽车制造" value="automotive" />
            <el-option label="航空航天" value="aerospace" />
            <el-option label="电子电器" value="electronics" />
            <el-option label="机械设备" value="machinery" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="企业规模">
          <el-select v-model="customerForm.scale" placeholder="请选择规模" style="width: 100%">
            <el-option label="大型企业（500人以上）" value="large" />
            <el-option label="中型企业（100-500人）" value="medium" />
            <el-option label="小型企业（100人以下）" value="small" />
          </el-select>
        </el-form-item>
        
        <!-- 新增生产信息字段 -->
        <el-divider content-position="left">生产信息</el-divider>
        
        <el-form-item label="分厂名称">
          <el-select 
            v-model="customerForm.factoryName" 
            placeholder="请选择或输入分厂名称" 
            allow-create 
            filterable 
            style="width: 100%"
          >
            <el-option label="传祺一厂" value="传祺一厂" />
            <el-option label="传祺二厂" value="传祺二厂" />
            <el-option label="埃安一厂" value="埃安一厂" />
            <el-option label="埃安二厂" value="埃安二厂" />
            <el-option label="丰田三厂" value="丰田三厂" />
            <el-option label="丰田五厂" value="丰田五厂" />
            <el-option label="本田3厂" value="本田3厂" />
            <el-option label="本田采购总部" value="本田采购总部" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="车间名称">
          <el-select 
            v-model="customerForm.workshopName" 
            placeholder="请选择或输入车间名称" 
            allow-create 
            filterable 
            style="width: 100%"
          >
            <el-option label="总装1部" value="总装1部" />
            <el-option label="焊装1部" value="焊装1部" />
            <el-option label="总装2部" value="总装2部" />
            <el-option label="焊装2部" value="焊装2部" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="线体名称">
          <el-select 
            v-model="customerForm.lineName" 
            placeholder="请选择或输入线体名称" 
            allow-create 
            filterable 
            style="width: 100%"
          >
            <el-option label="总装1线" value="总装1线" />
            <el-option label="总装2线" value="总装2线" />
            <el-option label="焊装1线" value="焊装1线" />
            <el-option label="焊装2线" value="焊装2线" />
            <el-option label="涂装1线" value="涂装1线" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="部门名称">
          <el-select 
            v-model="customerForm.departmentName" 
            placeholder="请选择或输入部门名称" 
            allow-create 
            filterable 
            style="width: 100%"
          >
            <el-option label="工艺科" value="工艺科" />
            <el-option label="质量科" value="质量科" />
            <el-option label="工具房" value="工具房" />
            <el-option label="库房" value="库房" />
            <el-option label="生产管理室" value="生产管理室" />
            <el-option label="设备科" value="设备科" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="工位名称">
          <el-input 
            v-model="customerForm.stationName" 
            placeholder="请输入工位名称，如：OP10、OP20等" 
          />
        </el-form-item>
        
        <el-divider content-position="left">联系信息</el-divider>
        
        <el-form-item label="联系人" required>
          <el-input v-model="customerForm.contactPerson" placeholder="请输入联系人姓名" />
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="customerForm.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="电子邮箱">
          <el-input v-model="customerForm.email" placeholder="请输入电子邮箱" />
        </el-form-item>
        <el-form-item label="公司地址">
          <el-input v-model="customerForm.address" placeholder="请输入公司地址" />
        </el-form-item>
        <el-form-item label="客户标签">
          <el-select v-model="customerForm.tags" multiple placeholder="请选择标签" style="width: 100%">
            <el-option label="重点客户" value="vip" />
            <el-option label="潜在客户" value="potential" />
            <el-option label="老客户" value="old" />
            <el-option label="战略合作" value="strategic" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCustomerDialog = false">取消</el-button>
        <el-button type="primary" @click="submitCustomer">确定</el-button>
      </template>
    </el-dialog>

    <!-- 新建销售目标对话框 -->
    <el-dialog v-model="showTargetDialog" title="新建销售目标" width="600px">
      <el-form :model="targetForm" label-width="100px">
        <el-form-item label="目标名称" required>
          <el-input v-model="targetForm.name" placeholder="请输入目标名称" />
        </el-form-item>
        <el-form-item label="目标类型">
          <el-select v-model="targetForm.type" style="width: 100%">
            <el-option label="营收目标" value="revenue" />
            <el-option label="客户数目标" value="customer" />
            <el-option label="商机数目标" value="opportunity" />
            <el-option label="转化率目标" value="conversion" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标周期">
          <el-select v-model="targetForm.period" style="width: 100%">
            <el-option label="月度目标" value="month" />
            <el-option label="季度目标" value="quarter" />
            <el-option label="年度目标" value="year" />
          </el-select>
        </el-form-item>
        <el-form-item label="目标值" required>
          <el-input v-model="targetForm.target" placeholder="请输入目标值">
            <template #append>{{ targetForm.unit }}</template>
          </el-input>
        </el-form-item>
        <el-form-item label="单位">
          <el-input v-model="targetForm.unit" placeholder="如：万元、个、%" />
        </el-form-item>
        <el-form-item label="负责人">
          <el-input v-model="targetForm.responsible" placeholder="请输入负责人" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showTargetDialog = false">取消</el-button>
        <el-button type="primary" @click="submitTarget">确定</el-button>
      </template>
    </el-dialog>

    <!-- 新建投标项目对话框 -->
    <el-dialog v-model="showBiddingDialog" title="新建投标项目" width="600px">
      <el-form :model="biddingForm" label-width="100px">
        <el-form-item label="项目名称" required>
          <el-input v-model="biddingForm.name" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="客户名称" required>
          <el-input v-model="biddingForm.client" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="项目金额">
          <el-input v-model="biddingForm.amount" placeholder="请输入金额（万元）">
            <template #append>万元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="投标日期">
          <el-date-picker v-model="biddingForm.bidDate" type="date" placeholder="选择日期" style="width: 100%" />
        </el-form-item>
        <el-form-item label="竞争对手">
          <el-select v-model="biddingForm.competitors" multiple placeholder="请选择或输入竞争对手" allow-create filterable style="width: 100%">
            <el-option label="阿特拉斯·科普柯" value="阿特拉斯·科普柯" />
            <el-option label="英格索兰" value="英格索兰" />
            <el-option label="博世力士乐" value="博世力士乐" />
            <el-option label="马头" value="马头" />
            <el-option label="史丹利百得" value="史丹利百得" />
            <el-option label="日本优利康" value="日本优利康" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button size="small" @click="manageCompetitors">
            <el-icon><Setting /></el-icon>
            管理竞争对手资料
          </el-button>
        </el-form-item>
        <el-form-item label="项目描述">
          <el-input v-model="biddingForm.description" type="textarea" :rows="3" placeholder="请输入项目描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showBiddingDialog = false">取消</el-button>
        <el-button type="primary" @click="submitBiddingProject">确定</el-button>
      </template>
    </el-dialog>

    <!-- 新建沙盘场景对话框 -->
    <el-dialog v-model="showScenarioDialog" title="新建沙盘场景" width="600px">
      <el-form :model="scenarioForm" label-width="100px">
        <el-form-item label="场景名称" required>
          <el-input v-model="scenarioForm.name" placeholder="请输入场景名称" />
        </el-form-item>
        <el-form-item label="场景类型">
          <el-select v-model="scenarioForm.type" style="width: 100%">
            <el-option label="营销活动" value="marketing" />
            <el-option label="价格调整" value="pricing" />
            <el-option label="渠道拓展" value="channel" />
            <el-option label="客户流失" value="churn" />
            <el-option label="市场竞争" value="competition" />
          </el-select>
        </el-form-item>
        <el-form-item label="预算投入" required>
          <el-input v-model="scenarioForm.budget" placeholder="请输入预算（万元）">
            <template #append>万元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="持续时间">
          <el-input v-model="scenarioForm.duration" placeholder="请输入持续时间（天）">
            <template #append>天</template>
          </el-input>
        </el-form-item>
        <el-form-item label="场景描述">
          <el-input v-model="scenarioForm.description" type="textarea" :rows="3" placeholder="请描述场景内容和目标" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showScenarioDialog = false">取消</el-button>
        <el-button type="primary" @click="submitScenario">确定</el-button>
      </template>
    </el-dialog>

    <!-- 添加产品数据对话框 -->
    <el-dialog v-model="showProductDataDialog" title="添加产品数据" width="600px">
      <el-form :model="productDataForm" label-width="130px">
        <el-form-item label="产品名称" required>
          <el-input v-model="productDataForm.name" placeholder="请输入产品名称" />
        </el-form-item>
        <el-form-item label="产品类别" required>
          <el-select v-model="productDataForm.category" placeholder="请选择产品类别" style="width: 100%">
            <el-option label="控制系统" value="控制系统" />
            <el-option label="拧紧工具" value="拧紧工具" />
            <el-option label="检测设备" value="检测设备" />
            <el-option label="配件工具" value="配件工具" />
            <el-option label="物联网系统" value="物联网系统" />
            <el-option label="软件服务" value="软件服务" />
          </el-select>
        </el-form-item>
        <el-form-item label="毛利率 (%)">
          <el-input-number v-model="productDataForm.profit" :min="0" :max="100" :precision="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="现金流贡献率 (%)">
          <el-input-number v-model="productDataForm.cashFlow" :min="0" :max="100" :precision="1" style="width: 100%" />
        </el-form-item>
        <el-form-item label="产品收益 (元)">
          <el-input-number v-model="productDataForm.revenue" :min="0" :step="10000" style="width: 100%" />
          <div class="form-tip">提示：{{ (productDataForm.revenue / 10000).toFixed(2) }} 万元</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showProductDataDialog = false">取消</el-button>
        <el-button type="primary" @click="submitProductData">确定添加</el-button>
      </template>
    </el-dialog>

    <!-- 添加联系人对话框 -->
    <el-dialog v-model="showContactDialog" title="添加联系人" width="700px">
      <el-form :model="contactForm" label-width="120px">
        <el-form-item label="姓名" required>
          <el-input v-model="contactForm.name" placeholder="请输入联系人姓名" />
        </el-form-item>
        <el-form-item label="职位" required>
          <el-input v-model="contactForm.title" placeholder="请输入职位" />
        </el-form-item>
        <el-form-item label="所属公司" required>
          <el-input v-model="contactForm.company" placeholder="请输入公司名称" />
        </el-form-item>
        
        <el-divider content-position="left">生产信息</el-divider>
        
        <el-form-item label="分厂名称">
          <el-select 
            v-model="contactForm.factoryName" 
            placeholder="请选择或输入分厂名称" 
            allow-create 
            filterable 
            style="width: 100%"
          >
            <el-option label="传祺一厂" value="传祺一厂" />
            <el-option label="传祺二厂" value="传祺二厂" />
            <el-option label="埃安一厂" value="埃安一厂" />
            <el-option label="埃安二厂" value="埃安二厂" />
            <el-option label="丰田三厂" value="丰田三厂" />
            <el-option label="丰田五厂" value="丰田五厂" />
            <el-option label="本田3厂" value="本田3厂" />
            <el-option label="本田采购总部" value="本田采购总部" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="车间名称">
          <el-select 
            v-model="contactForm.workshopName" 
            placeholder="请选择或输入车间名称" 
            allow-create 
            filterable 
            style="width: 100%"
          >
            <el-option label="总装1部" value="总装1部" />
            <el-option label="焊装1部" value="焊装1部" />
            <el-option label="总装2部" value="总装2部" />
            <el-option label="焊装2部" value="焊装2部" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="线体名称">
          <el-select 
            v-model="contactForm.lineName" 
            placeholder="请选择或输入线体名称" 
            allow-create 
            filterable 
            style="width: 100%"
          >
            <el-option label="总装1线" value="总装1线" />
            <el-option label="总装2线" value="总装2线" />
            <el-option label="焊装1线" value="焊装1线" />
            <el-option label="焊装2线" value="焊装2线" />
            <el-option label="涂装1线" value="涂装1线" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="部门名称">
          <el-select 
            v-model="contactForm.departmentName" 
            placeholder="请选择或输入部门名称" 
            allow-create 
            filterable 
            style="width: 100%"
          >
            <el-option label="工艺科" value="工艺科" />
            <el-option label="质量科" value="质量科" />
            <el-option label="工具房" value="工具房" />
            <el-option label="库房" value="库房" />
            <el-option label="生产管理室" value="生产管理室" />
            <el-option label="设备科" value="设备科" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="工位名称">
          <el-input 
            v-model="contactForm.stationName" 
            placeholder="请输入工位名称，如：OP10、OP20等" 
          />
        </el-form-item>
        
        <el-divider content-position="left">联系方式</el-divider>
        
        <el-form-item label="联系电话">
          <el-input v-model="contactForm.phone" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="电子邮箱">
          <el-input v-model="contactForm.email" placeholder="请输入电子邮箱" />
        </el-form-item>
        <el-form-item label="微信号">
          <el-input v-model="contactForm.wechat" placeholder="请输入微信号" />
        </el-form-item>
        <el-form-item label="影响力">
          <el-rate v-model="contactForm.influence" show-text />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="contactForm.notes" type="textarea" :rows="3" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showContactDialog = false">取消</el-button>
        <el-button type="primary" @click="submitContact">确定添加</el-button>
      </template>
    </el-dialog>

    <!-- 竞争对手管理对话框 -->
    <el-dialog v-model="showCompetitorDialog" title="竞争对手信息管理" width="90%" top="5vh">
      <el-tabs v-model="competitorTab" type="border-card">
        <!-- 竞争对手列表 -->
        <el-tab-pane label="竞争对手列表" name="list">
          <div class="competitor-list-header">
            <el-button type="primary" @click="addNewCompetitor">
              <el-icon><Plus /></el-icon>
              新增竞争对手
            </el-button>
            <el-input
              v-model="competitorSearch"
              placeholder="搜索竞争对手..."
              clearable
              style="width: 300px; margin-left: 10px;"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>

          <el-table :data="filteredCompetitorsList" stripe style="margin-top: 20px;" @row-click="viewCompetitorDetail">
            <el-table-column prop="name" label="公司名称" width="180" />
            <el-table-column prop="country" label="国家/地区" width="120" />
            <el-table-column prop="marketShare" label="市场份额" width="120">
              <template #default="{ row }">
                <el-progress :percentage="row.marketShare" :color="getProgressColor(row.marketShare)" />
              </template>
            </el-table-column>
            <el-table-column prop="productLine" label="主营产品线" width="200" show-overflow-tooltip />
            <el-table-column prop="recentNews" label="最新动态" min-width="250" show-overflow-tooltip />
            <el-table-column prop="lastUpdate" label="更新时间" width="120" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button size="small" @click.stop="viewCompetitorDetail(row)">详情</el-button>
                <el-button size="small" type="primary" @click.stop="analyzeSWOT(row)">SWOT分析</el-button>
                <el-button size="small" type="danger" @click.stop="deleteCompetitor(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 竞争对手详情 -->
        <el-tab-pane label="竞争对手详情" name="detail" v-if="currentCompetitor">
          <el-form :model="currentCompetitor" label-width="140px">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-divider content-position="left">基础信息</el-divider>
                <el-form-item label="公司名称" required>
                  <el-input v-model="currentCompetitor.name" placeholder="请输入公司名称" />
                </el-form-item>
                <el-form-item label="国家/地区">
                  <el-input v-model="currentCompetitor.country" placeholder="如：德国、美国" />
                </el-form-item>
                <el-form-item label="成立时间">
                  <el-date-picker v-model="currentCompetitor.foundedYear" type="year" placeholder="选择年份" style="width: 100%" />
                </el-form-item>
                <el-form-item label="市场份额 (%)">
                  <el-input-number v-model="currentCompetitor.marketShare" :min="0" :max="100" :precision="1" style="width: 100%" />
                </el-form-item>
                <el-form-item label="主营产品线">
                  <el-input v-model="currentCompetitor.productLine" type="textarea" :rows="2" placeholder="如：拧紧工具、控制系统等" />
                </el-form-item>
                <el-form-item label="官网">
                  <el-input v-model="currentCompetitor.website" placeholder="https://" />
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-divider content-position="left">市场表现</el-divider>
                <el-form-item label="年营收">
                  <el-input v-model="currentCompetitor.revenue" placeholder="如：50亿美元">
                    <template #append>美元</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="员工人数">
                  <el-input-number v-model="currentCompetitor.employees" :min="0" style="width: 100%" />
                </el-form-item>
                <el-form-item label="研发投入比例">
                  <el-input-number v-model="currentCompetitor.rdRatio" :min="0" :max="100" :precision="1" style="width: 100%">
                    <template #append>%</template>
                  </el-input-number>
                </el-form-item>
                <el-form-item label="全球排名">
                  <el-input-number v-model="currentCompetitor.globalRank" :min="1" style="width: 100%" />
                </el-form-item>
                <el-form-item label="中国市场份额">
                  <el-input-number v-model="currentCompetitor.chinaMarketShare" :min="0" :max="100" :precision="1" style="width: 100%">
                    <template #append>%</template>
                  </el-input-number>
                </el-form-item>
              </el-col>
            </el-row>

            <el-divider content-position="left">情报信息</el-divider>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="最新动态/新闻">
                  <el-input v-model="currentCompetitor.recentNews" type="textarea" :rows="4" placeholder="记录最新的新闻、动态、产品发布等" />
                </el-form-item>
                <el-form-item label="中标业绩">
                  <el-input v-model="currentCompetitor.winningProjects" type="textarea" :rows="4" placeholder="记录近期中标项目，如：2024年广汽本田拧紧系统项目 3000万" />
                </el-form-item>
                <el-form-item label="公司发展动向">
                  <el-input v-model="currentCompetitor.development" type="textarea" :rows="4" placeholder="如：扩建新工厂、收购企业、技术突破等" />
                </el-form-item>
                <el-form-item label="技术优势">
                  <el-input v-model="currentCompetitor.techAdvantages" type="textarea" :rows="3" placeholder="核心技术、专利、创新点等" />
                </el-form-item>
                <el-form-item label="客户案例">
                  <el-input v-model="currentCompetitor.customers" type="textarea" :rows="3" placeholder="主要客户、标杆案例等" />
                </el-form-item>
                <el-form-item label="备注">
                  <el-input v-model="currentCompetitor.notes" type="textarea" :rows="2" placeholder="其他重要信息" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item>
              <el-button type="primary" @click="saveCompetitor">保存</el-button>
              <el-button @click="competitorTab = 'list'">返回列表</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- SWOT分析 -->
        <el-tab-pane label="SWOT分析" name="swot" v-if="swotCompetitor">
          <div class="swot-analysis-header">
            <h2>{{ swotCompetitor.name }} - SWOT分析</h2>
            <el-button type="primary" @click="generateAISWOT">
              <el-icon><MagicStick /></el-icon>
              AI智能生成
            </el-button>
          </div>

          <el-row :gutter="20" class="swot-grid">
            <el-col :span="12">
              <el-card class="swot-card strengths">
                <template #header>
                  <div class="swot-card-header">
                    <el-icon :size="20"><CircleCheck /></el-icon>
                    <span>优势 (Strengths)</span>
                  </div>
                </template>
                <el-input
                  v-model="swotAnalysis.strengths"
                  type="textarea"
                  :rows="8"
                  placeholder="列出竞争对手的核心优势..."
                />
              </el-card>
            </el-col>

            <el-col :span="12">
              <el-card class="swot-card weaknesses">
                <template #header>
                  <div class="swot-card-header">
                    <el-icon :size="20"><QuestionFilled /></el-icon>
                    <span>劣势 (Weaknesses)</span>
                  </div>
                </template>
                <el-input
                  v-model="swotAnalysis.weaknesses"
                  type="textarea"
                  :rows="8"
                  placeholder="列出竞争对手的劣势和不足..."
                />
              </el-card>
            </el-col>

            <el-col :span="12">
              <el-card class="swot-card opportunities">
                <template #header>
                  <div class="swot-card-header">
                    <el-icon :size="20"><TrendCharts /></el-icon>
                    <span>机会 (Opportunities)</span>
                  </div>
                </template>
                <el-input
                  v-model="swotAnalysis.opportunities"
                  type="textarea"
                  :rows="8"
                  placeholder="分析外部机会..."
                />
              </el-card>
            </el-col>

            <el-col :span="12">
              <el-card class="swot-card threats">
                <template #header>
                  <div class="swot-card-header">
                    <el-icon :size="20"><Bell /></el-icon>
                    <span>威胁 (Threats)</span>
                  </div>
                </template>
                <el-input
                  v-model="swotAnalysis.threats"
                  type="textarea"
                  :rows="8"
                  placeholder="分析外部威胁..."
                />
              </el-card>
            </el-col>
          </el-row>

          <el-divider />

          <el-card class="ai-recommendation-card">
            <template #header>
              <span>🤖 AI竞争策略建议</span>
            </template>
            <el-input
              v-model="swotAnalysis.aiRecommendation"
              type="textarea"
              :rows="6"
              placeholder="基于SWOT分析，AI将生成竞争策略建议..."
            />
          </el-card>

          <div style="margin-top: 20px;">
            <el-button type="primary" @click="saveSWOT">保存SWOT分析</el-button>
            <el-button @click="competitorTab = 'list'">返回列表</el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import DataQualityMonitor from '@/components/DataQualityMonitor.vue'
import DataSyncMonitor from '@/components/DataSyncMonitor.vue'
import DataGovernancePanel from '@/components/DataGovernancePanel.vue'
import BehaviorModelPanel from '@/components/BehaviorModelPanel.vue'
import BusinessSimulatorPanel from '@/components/BusinessSimulatorPanel.vue'
import { 
  TrendCharts, Filter, User, Money, Clock, MagicStick, DataAnalysis,
  Search, Lightning, Bell, Refresh, CaretTop, CaretBottom, View, Download,
  Plus, Phone, Message, QuestionFilled, ArrowDown, SwitchButton, Setting, Right,
  DocumentCopy, Notification, CircleCheck, Select, SuccessFilled, Grid, Trophy,
  VideoPlay
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'

// 当前激活的标签页
const activeTab = ref('funnel')

// 全局搜索
const globalSearch = ref('')

// ========== 自然语言交互系统 (Phase 1-3) ==========
const nlpSearchVisible = ref(false)
const nlpMode = ref(false)
const conversationHistory = ref([])
const searchHistory = ref([
  { id: 1, query: '本月高流失风险客户', timestamp: '2025-12-18 10:30' },
  { id: 2, query: '上季度销售额Top10客户', timestamp: '2025-12-17 15:20' },
  { id: 3, query: '未跟进超过7天的商机', timestamp: '2025-12-16 09:15' }
])

// Phase 1: 快速指令库
const quickCommands = ref([
  { id: 1, label: '高价值客户', icon: 'Star', query: 'CLV > 50000', category: 'customer' },
  { id: 2, label: '流失风险客户', icon: 'Warning', query: 'churnRisk > 70', category: 'customer' },
  { id: 3, label: '本月新客户', icon: 'User', query: 'createdDate >= thisMonth', category: 'customer' },
  { id: 4, label: '待跟进商机', icon: 'Flag', query: 'status = pending AND lastContact > 7days', category: 'opportunity' },
  { id: 5, label: '本季度销售额', icon: 'TrendCharts', query: 'revenue thisQuarter', category: 'sales' },
  { id: 6, label: '活跃客户分析', icon: 'DataAnalysis', query: 'activeCustomers thisMonth', category: 'analytics' },
  { id: 7, label: '产品销售排行', icon: 'Trophy', query: 'topProducts byRevenue', category: 'product' },
  { id: 8, label: '客户满意度低', icon: 'MessageBox', query: 'NPS < 6', category: 'customer' }
])

// Phase 2: AI智能推荐
const aiSuggestions = ref([
  '查询本周待跟进客户',
  '分析高流失风险原因',
  '推荐最佳跟进策略',
  '预测本月销售目标达成率'
])

// Phase 2: NLP关键词映射表
const nlpKeywordMap = {
  // 时间关键词
  '本月': 'thisMonth',
  '上月': 'lastMonth',
  '本季度': 'thisQuarter',
  '本年': 'thisYear',
  '今天': 'today',
  '本周': 'thisWeek',
  '最近7天': 'last7Days',
  '最近30天': 'last30Days',
  
  // 客户分类
  '高价值': 'highValue',
  '流失风险': 'churnRisk',
  '活跃': 'active',
  '沉睡': 'dormant',
  '新客户': 'newCustomer',
  
  // 指标关键词
  '销售额': 'revenue',
  '转化率': 'conversionRate',
  '客单价': 'avgOrderValue',
  '毛利': 'grossProfit',
  
  // 动作关键词
  '查询': 'query',
  '分析': 'analyze',
  '预测': 'predict',
  '推荐': 'recommend',
  '统计': 'statistics',
  '对比': 'compare'
}

// Phase 3: AI对话上下文
const conversationContext = ref({
  lastQuery: '',
  lastResult: null,
  currentTopic: '',
  filters: {}
})

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

// 自动化流程数据
const taskFilter = ref('all')
const automationEnabled = ref(true)

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

// 计算属性 - 过滤任务
const filteredTasks = computed(() => {
  if (taskFilter.value === 'all') return tasks.value
  if (taskFilter.value === 'ai') return tasks.value.filter(t => t.source === 'AI')
  if (taskFilter.value === 'manual') return tasks.value.filter(t => t.source === '手动')
  if (taskFilter.value === 'pending') return tasks.value.filter(t => t.status === '待确认')
  if (taskFilter.value === 'completed') return tasks.value.filter(t => t.status === '已完成')
  return tasks.value
})

// 方法
const handleTabChange = (key) => {
  activeTab.value = key
}

const handleUserCommand = (command) => {
  console.log('User command:', command)
  if (command === 'profile') {
    ElMessage.info('打开个人设置')
  } else if (command === 'logout') {
    ElMessage.success('退出登录')
  }
}

// ========== 商机和客户管理方法 ==========

// 创建商机对话框状态
const showOpportunityDialog = ref(false)
const opportunityForm = ref({
  name: '',
  customerId: '',
  amount: '',
  stage: 'qualification',
  probability: 20,
  expectedCloseDate: '',
  description: ''
})

// 创建商机对话框
const createOpportunityDialog = () => {
  opportunityForm.value = {
    name: '',
    customerId: '',
    amount: '',
    stage: 'qualification',
    probability: 20,
    expectedCloseDate: '',
    description: ''
  }
  showOpportunityDialog.value = true
}

// 创建商机
const createOpportunity = () => {
  createOpportunityDialog()
}

// 提交商机表单
const submitOpportunity = () => {
  if (!opportunityForm.value.name || !opportunityForm.value.amount) {
    ElMessage.warning('请填写必填项：商机名称和金额')
    return
  }
  
  // 添加到商机列表
  const newOpportunity = {
    id: Date.now(),
    ...opportunityForm.value,
    createDate: new Date().toISOString().split('T')[0],
    status: 'active'
  }
  
  topOpportunities.value.unshift(newOpportunity)
  
  ElMessage.success('商机创建成功！')
  showOpportunityDialog.value = false
}

// 创建客户对话框状态
const showCustomerDialog = ref(false)
const customerForm = ref({
  name: '',
  industry: '',
  scale: '',
  factoryName: '',      // 分厂名称
  workshopName: '',     // 车间名称
  lineName: '',         // 线体名称
  departmentName: '',   // 部门名称
  stationName: '',      // 工位名称
  contactPerson: '',
  phone: '',
  email: '',
  address: '',
  tags: []
})

// 创建客户
const createCustomer = () => {
  customerForm.value = {
    name: '',
    industry: '',
    scale: '',
    factoryName: '',
    workshopName: '',
    lineName: '',
    departmentName: '',
    stationName: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    tags: []
  }
  showCustomerDialog.value = true
}

// 提交客户表单
const submitCustomer = () => {
  if (!customerForm.value.name || !customerForm.value.contactPerson) {
    ElMessage.warning('请填写必填项：客户名称和联系人')
    return
  }
  
  const newCustomer = {
    id: Date.now(),
    ...customerForm.value,
    joinDate: new Date().toISOString().split('T')[0],
    totalRevenue: 0,
    status: 'active'
  }
  
  customers.value.unshift(newCustomer)
  
  ElMessage.success('客户创建成功！')
  showCustomerDialog.value = false
}

// 查看AI洞察
const viewAIInsights = () => {
  ElMessage.success('正在生成AI洞察报告...')
  // TODO: 显示AI洞察分析
}

// 导出漏斗报表
const exportFunnelReport = () => {
  ElMessage.success('正在导出漏斗报表...')
  // TODO: 生成并导出Excel报表
}

// ========== 自然语言交互核心方法 (Phase 1-3) ==========

// Phase 1: 执行快速指令
const executeQuickCommand = (cmd) => {
  ElMessage.success(`执行指令: ${cmd.label}`)
  globalSearch.value = cmd.label
  
  // 添加到历史记录
  addToHistory(cmd.label)
  
  // 根据类别执行不同操作
  switch(cmd.category) {
    case 'customer':
      activeTab.value = 'customer360'
      break
    case 'opportunity':
      activeTab.value = 'funnel'
      break
    case 'sales':
      activeTab.value = 'salesTarget'
      break
    case 'analytics':
      activeTab.value = 'customerSandbox'
      break
    case 'product':
      activeTab.value = 'productMatrix'
      break
  }
  
  nlpSearchVisible.value = false
}

// Phase 2: NLP智能解析
const parseNLPQuery = (query) => {
  const tokens = query.toLowerCase().split(/\s+/)
  const parsed = {
    action: '',
    timeRange: '',
    customerType: '',
    metric: '',
    filters: []
  }
  
  // 提取动作
  for (const token of tokens) {
    if (nlpKeywordMap[token]) {
      const mappedValue = nlpKeywordMap[token]
      
      if (['query', 'analyze', 'predict', 'recommend', 'statistics', 'compare'].includes(mappedValue)) {
        parsed.action = mappedValue
      } else if (['thisMonth', 'lastMonth', 'thisQuarter', 'thisYear', 'today', 'thisWeek', 'last7Days', 'last30Days'].includes(mappedValue)) {
        parsed.timeRange = mappedValue
      } else if (['highValue', 'churnRisk', 'active', 'dormant', 'newCustomer'].includes(mappedValue)) {
        parsed.customerType = mappedValue
      } else if (['revenue', 'conversionRate', 'avgOrderValue', 'grossProfit'].includes(mappedValue)) {
        parsed.metric = mappedValue
      }
    }
  }
  
  return parsed
}

// Phase 2 & 3: 处理NLP搜索
const handleNLPSearch = () => {
  if (!globalSearch.value.trim()) return
  
  if (nlpMode.value) {
    // Phase 3: AI模式 - 模拟GPT解析
    handleAISearch(globalSearch.value)
  } else {
    // Phase 2: NLP解析模式
    const parsed = parseNLPQuery(globalSearch.value)
    executeNLPQuery(parsed)
  }
  
  addToHistory(globalSearch.value)
}

// Phase 3: AI对话处理
const handleAISearch = (query) => {
  // 添加用户消息
  conversationHistory.value.push({
    id: Date.now(),
    role: 'user',
    text: query,
    timestamp: new Date().toLocaleTimeString()
  })
  
  // 模拟AI思考
  setTimeout(() => {
    const aiResponse = generateAIResponse(query)
    
    conversationHistory.value.push({
      id: Date.now() + 1,
      role: 'assistant',
      text: aiResponse.text,
      result: aiResponse.result,
      timestamp: new Date().toLocaleTimeString()
    })
    
    // 更新上下文
    conversationContext.value.lastQuery = query
    conversationContext.value.lastResult = aiResponse.result
  }, 500)
  
  globalSearch.value = ''
}

// Phase 3: AI响应生成
const generateAIResponse = (query) => {
  const lowerQuery = query.toLowerCase()
  
  // 智能匹配常见查询模式
  if (lowerQuery.includes('高流失') || lowerQuery.includes('流失风险')) {
    return {
      text: '我帮您查询到本月高流失风险客户共28位，主要特征：\n1. 近60天无购买记录\n2. 最近客服评分下降\n3. 客单价降低超过30%\n\n建议：立即安排专属客服跟进，并发送定向优惠券。',
      result: {
        type: 'count',
        count: 28,
        action: 'viewChurnCustomers',
        actionLabel: '查看详情'
      }
    }
  } else if (lowerQuery.includes('销售额') && (lowerQuery.includes('本月') || lowerQuery.includes('本季'))) {
    return {
      text: '本月销售额达成情况：\n- 当前: ¥1,580万\n- 目标: ¥2,000万\n- 完成率: 79%\n- 预测: 按当前趋势预计达成率92%\n\n建议：重点跟进5个大单客户，有望冲刺目标。',
      result: {
        type: 'count',
        count: 1580,
        action: 'viewSalesTarget',
        actionLabel: '查看销售目标'
      }
    }
  } else if (lowerQuery.includes('新客户') || lowerQuery.includes('新客')) {
    return {
      text: '本月新增客户分析：\n- 新客户数: 156位\n- 主要来源: 线上推广(62%)、老客推荐(28%)\n- 转化率: 18.5%\n- 平均客单价: ¥3,200\n\n建议：加强老客推荐奖励计划。',
      result: {
        type: 'count',
        count: 156,
        action: 'viewNewCustomers',
        actionLabel: '查看新客户列表'
      }
    }
  } else if (lowerQuery.includes('待跟进') || lowerQuery.includes('未跟进')) {
    return {
      text: '待跟进商机列表：\n- 超过7天未跟进: 42个\n- 超过14天未跟进: 18个\n- 高价值商机: 12个(预计¥680万)\n\n建议：优先跟进高价值商机，本周内完成。',
      result: {
        type: 'count',
        count: 42,
        action: 'viewPendingOpportunities',
        actionLabel: '查看商机列表'
      }
    }
  } else if (lowerQuery.includes('预测') || lowerQuery.includes('预估')) {
    return {
      text: 'AI预测分析：\n- 本季度销售目标达成率: 95%\n- 下月预计流失客户: 15-20位\n- Q1重点客户转化率: 78%\n\n已为您生成详细预测报告。',
      result: {
        type: 'count',
        count: 1,
        action: 'viewPrediction',
        actionLabel: '查看预测报告'
      }
    }
  } else {
    return {
      text: `我理解您想查询"${query}"，正在为您智能分析...\n\n建议您可以尝试：\n- 查询本月高流失风险客户\n- 分析本季度销售额\n- 查看待跟进商机\n- 预测下月目标达成率`,
      result: null
    }
  }
}

// 执行NLP解析后的查询
const executeNLPQuery = (parsed) => {
  console.log('执行查询:', parsed)
  
  let message = '正在查询'
  if (parsed.customerType) message += ` ${parsed.customerType} 客户`
  if (parsed.timeRange) message += ` (${parsed.timeRange})`
  if (parsed.metric) message += ` 的 ${parsed.metric}`
  
  ElMessage.success(message)
  nlpSearchVisible.value = false
}

// 执行AI推荐的操作
const executeAction = (action) => {
  const actionMap = {
    viewChurnCustomers: () => {
      activeTab.value = 'customer360'
      ElMessage.success('已切换到客户360°视图')
    },
    viewSalesTarget: () => {
      activeTab.value = 'salesTarget'
      ElMessage.success('已切换到销售目标视图')
    },
    viewNewCustomers: () => {
      activeTab.value = 'customer360'
      ElMessage.success('已切换到客户360°视图')
    },
    viewPendingOpportunities: () => {
      activeTab.value = 'funnel'
      ElMessage.success('已切换到销售漏斗视图')
    },
    viewPrediction: () => {
      activeTab.value = 'biddingAI'
      ElMessage.success('已切换到投标预测视图')
    }
  }
  
  if (actionMap[action]) {
    actionMap[action]()
    nlpSearchVisible.value = false
  }
}

// 应用AI推荐
const applySuggestion = (suggestion) => {
  globalSearch.value = suggestion
  handleAISearch(suggestion)
}

// 重播历史搜索
const replaySearch = (history) => {
  globalSearch.value = history.query
  handleNLPSearch()
}

// 删除历史记录
const removeHistory = (id) => {
  searchHistory.value = searchHistory.value.filter(h => h.id !== id)
}

// 添加到历史记录
const addToHistory = (query) => {
  if (!query.trim()) return
  
  const exists = searchHistory.value.find(h => h.query === query)
  if (exists) return
  
  searchHistory.value.unshift({
    id: Date.now(),
    query: query,
    timestamp: new Date().toLocaleString()
  })
  
  // 只保留最近10条
  if (searchHistory.value.length > 10) {
    searchHistory.value = searchHistory.value.slice(0, 10)
  }
}

// 切换AI模式
const handleModeChange = () => {
  if (nlpMode.value) {
    ElMessage.success('已切换到AI智能模式')
    // 清空对话历史
    conversationHistory.value = []
    // 添加欢迎消息
    conversationHistory.value.push({
      id: Date.now(),
      role: 'assistant',
      text: '您好！我是AICRM智能助手，可以帮您：\n- 查询客户数据和商机\n- 分析销售趋势和预测\n- 推荐最佳营销策略\n- 生成业务报告\n\n请随时向我提问！',
      timestamp: new Date().toLocaleTimeString()
    })
  } else {
    ElMessage.info('已切换到普通搜索模式')
  }
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

// 工作流和任务相关方法
const getNodeType = (type) => {
  const map = { 'AI': 'success', '人工': 'primary', '系统': 'info' }
  return map[type] || 'info'
}

const getPriorityType = (priority) => {
  const map = { '高': 'danger', '中': 'warning', '低': 'info' }
  return map[priority] || 'info'
}

const getTaskStatusType = (status) => {
  const map = { '待确认': 'warning', '进行中': 'primary', '已完成': 'success' }
  return map[status] || 'info'
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

// ========== 产品矩阵管理模块数据 ==========
const matrixPeriod = ref('month')
const totalProducts = ref(85)
const coreProducts = ref(12)
const optimizeProducts = ref(18)
const maintainProducts = ref(28)
const eliminateProducts = ref(27)

const productMatrixKPIs = ref([
  { id: 1, title: '核心产品收益', value: '¥520万', trend: 18, trendLabel: '环比增长', icon: 'Money', color: '#67C23A' },
  { id: 2, title: '平均毛利率', value: '42%', trend: 5, trendLabel: '环比提升', icon: 'TrendCharts', color: '#409EFF' },
  { id: 3, title: '现金流健康度', value: '85分', trend: 8, trendLabel: '环比改善', icon: 'DataAnalysis', color: '#E6A23C' },
  { id: 4, title: '产品周转天数', value: '38天', trend: -12, trendLabel: '环比缩短', icon: 'Clock', color: '#F56C6C' }
])

const keyProducts = ref([
  {
    id: 1,
    name: '智能拧紧控制器 Pro',
    category: '控制系统',
    sales: 2800000,
    profit: 45,
    cashFlow: 85,
    lifecycle: '成长期',
    strategy: '核心产品',
    aiAction: '增加产能',
    aiSuggestion: '市场需求强劲，建议增加20%产能并加大市场推广力度'
  },
  {
    id: 2,
    name: '精密拧紧工具系列',
    category: '拧紧工具',
    sales: 1600000,
    profit: 38,
    cashFlow: 72,
    lifecycle: '成熟期',
    strategy: '优化提升',
    aiAction: '优化库存',
    aiSuggestion: '现金占用较高，建议优化库存结构，调整账期策略'
  },
  {
    id: 3,
    name: '套筒工具套装',
    category: '配件工具',
    sales: 980000,
    profit: 28,
    cashFlow: 68,
    lifecycle: '成熟期',
    strategy: '维持运营',
    aiAction: '保持现状',
    aiSuggestion: '稳定贡献现金流，建议保持现状低成本运营'
  }
])

// ========== 销售目标管理模块数据 ==========
const targetKPIs = ref([
  { id: 1, title: '本月目标完成率', value: '78%', trend: 12, trendLabel: '环比提升', icon: 'TrendCharts', color: '#67C23A' },
  { id: 2, title: '个人目标达成', value: '3/5', trend: 0, trendLabel: '进行中', icon: 'User', color: '#409EFF' },
  { id: 3, title: '团队目标达成', value: '5/8', trend: 10, trendLabel: '环比提升', icon: 'Money', color: '#E6A23C' },
  { id: 4, title: 'AI预测完成率', value: '92%', trend: 5, trendLabel: '置信度', icon: 'DataAnalysis', color: '#F56C6C' }
])

const personalTargets = ref([
  { id: 1, name: '本月销售额', current: '¥180万', goal: '¥200万', progress: 90, deadline: '2025-12-31', status: '进行中' },
  { id: 2, name: '新客户开发', current: '8个', goal: '10个', progress: 80, deadline: '2025-12-31', status: '进行中' },
  { id: 3, name: '客户满意度', current: '92分', goal: '95分', progress: 97, deadline: '2025-12-31', status: '进行中' }
])

const teamTargets = ref([
  { id: 1, name: '季度销售额', current: '¥850万', goal: '¥1000万', progress: 85, deadline: '2025-12-31', status: '进行中' },
  { id: 2, name: '团队商机转化率', current: '32%', goal: '35%', progress: 91, deadline: '2025-12-31', status: '进行中' },
  { id: 3, name: '客户续约率', current: '88%', goal: '90%', progress: 98, deadline: '2025-12-31', status: '进行中' }
])

const shortTermForecast = ref(88)
const midTermForecast = ref(92)
const longTermForecast = ref(85)

const targetSuggestions = ref([
  '加强重点客户跟进',
  '优化销售流程',
  '提升团队协作效率',
  '增加高价值产品推广'
])

const actionPlans = ref([
  {
    id: 1,
    name: '重点客户深度开发计划',
    target: '本月销售额',
    owner: '张三',
    startDate: '2025-12-01',
    endDate: '2025-12-31',
    progress: 75,
    status: '进行中'
  },
  {
    id: 2,
    name: '新产品市场推广方案',
    target: '新客户开发',
    owner: '李四',
    startDate: '2025-12-05',
    endDate: '2025-12-25',
    progress: 60,
    status: '进行中'
  }
])

// ========== 联系人与关系图谱模块数据 ==========
const contactSearch = ref('')
const relationshipView = ref('network')

const contactsKPIs = ref([
  { id: 1, title: '总联系人数', value: '156人', trend: 12, trendLabel: '本月新增', icon: 'User', color: '#409EFF' },
  { id: 2, title: '关键联系人', value: '28人', trend: 8, trendLabel: '影响力提升', icon: 'Star', color: '#F56C6C' },
  { id: 3, title: '本月互动次数', value: '342次', trend: 15, trendLabel: '环比增长', icon: 'ChatDotRound', color: '#67C23A' },
  { id: 4, title: '关系深度评分', value: '85分', trend: 5, trendLabel: '持续改善', icon: 'TrendCharts', color: '#E6A23C' }
])

const allContacts = ref([
  { id: 1, name: '张总', title: '总经理', company: '明升工业', department: '总经办', influence: 5, phone: '138****1234', email: 'zhang@ms.com', lastContact: '2025-12-15' },
  { id: 2, name: '李工', title: '技术总监', company: '明升工业', department: '技术部', influence: 4, phone: '139****5678', email: 'li@ms.com', lastContact: '2025-12-16' },
  { id: 3, name: '王经理', title: '采购经理', company: '明升工业', department: '采购部', influence: 4, phone: '136****9012', email: 'wang@ms.com', lastContact: '2025-12-17' },
  { id: 4, name: '赵主管', title: '质量主管', company: '明升工业', department: '质量部', influence: 3, phone: '135****3456', email: 'zhao@ms.com', lastContact: '2025-12-14' },
  { id: 5, name: '刘总监', title: '生产总监', company: '明升工业', department: '生产部', influence: 4, phone: '137****7890', email: 'liu@ms.com', lastContact: '2025-12-13' }
])

const filteredContacts = computed(() => {
  if (!contactSearch.value) return allContacts.value
  return allContacts.value.filter(contact =>
    contact.name.includes(contactSearch.value) ||
    contact.title.includes(contactSearch.value) ||
    contact.company.includes(contactSearch.value)
  )
})

const keyContacts = ref([
  { id: 1, name: '张总', title: '总经理', company: '明升工业', department: '总经办', influence: 5, lastContact: '2025-12-15' },
  { id: 2, name: '李工', title: '技术总监', company: '明升工业', department: '技术部', influence: 4, lastContact: '2025-12-16' },
  { id: 3, name: '王经理', title: '采购经理', company: '明升工业', department: '采购部', influence: 4, lastContact: '2025-12-17' },
  { id: 4, name: '刘总监', title: '生产总监', company: '明升工业', department: '生产部', influence: 4, lastContact: '2025-12-13' },
  { id: 5, name: '陈主任', title: '设备主任', company: '明升工业', department: '设备部', influence: 3, lastContact: '2025-12-12' }
])

const recentInteractions = ref([
  {
    id: 1,
    contactName: '张总',
    title: '项目洽谈会议',
    content: '讨论了2025年度合作计划,张总对我们的智能拧紧方案很感兴趣',
    timestamp: '2025-12-17 14:30',
    type: '会议',
    typeTag: 'primary',
    channel: '线下',
    color: '#409EFF'
  },
  {
    id: 2,
    contactName: '李工',
    title: '技术交流电话',
    content: '解答了关于拧紧曲线分析的技术问题,李工对AI分析功能表示认可',
    timestamp: '2025-12-16 10:15',
    type: '电话',
    typeTag: 'success',
    channel: '电话',
    color: '#67C23A'
  },
  {
    id: 3,
    contactName: '王经理',
    title: '采购意向确认',
    content: '王经理确认了Q1采购计划,预计订单额500万',
    timestamp: '2025-12-15 16:20',
    type: '邮件',
    typeTag: 'warning',
    channel: '邮件',
    color: '#E6A23C'
  }
])

const priorityContacts = ref([
  { id: 1, name: '赵主管', reason: '上次沟通后7天未跟进,建议本周联系' },
  { id: 2, name: '孙工', reason: '对新产品表达强烈兴趣,建议安排演示' },
  { id: 3, name: '周总', reason: '决策周期临近,建议加快推进' }
])

const potentialKeyPersons = ref([
  { id: 1, name: '吴经理', potential: 85, department: '研发部' },
  { id: 2, name: '郑主任', potential: 78, department: '项目部' },
  { id: 3, name: '钱总监', potential: 72, department: '运营部' }
])

const relationshipReminders = ref([
  { id: 1, type: 'warning', title: '张总', description: '距离上次互动已15天,建议本周联系' },
  { id: 2, type: 'error', title: '刘总监', description: '生日将至(12月20日),建议发送祝福' },
  { id: 3, type: 'info', title: '李工', description: '技术培训邀请待确认,建议跟进' }
])

// ========== 客户沙盘分析模块数据 ==========
const currentScenario = ref('默认场景')
const priceStrategy = ref(0)
const discountLevel = ref(10)
const selectedChannels = ref(['邮件', 'App推送'])
const contactFrequency = ref('medium')
const targetCustomerGroup = ref('high-value')
const predictedConversion = ref(75)
const predictedConversionText = ref('基于当前策略，预计转化率将提升至75%')
const revenueChange = ref(15)
const predictedRevenueSandbox = ref(520)
const churnRisk = ref(12)
const churnRiskText = ref('流失风险较低，建议保持当前策略')

const sandboxKPIs = ref([
  { id: 1, title: '模拟场景数', value: '8个', trend: 20, trendLabel: '本月新增', icon: 'DataAnalysis', color: '#67C23A' },
  { id: 2, title: '平均ROI提升', value: '18%', trend: 5, trendLabel: '环比增长', icon: 'TrendCharts', color: '#409EFF' },
  { id: 3, title: '策略采纳率', value: '85%', trend: 12, trendLabel: '环比提升', icon: 'CircleCheck', color: '#E6A23C' },
  { id: 4, title: '收益预测准确率', value: '92%', trend: 3, trendLabel: '持续优化', icon: 'SuccessFilled', color: '#F56C6C' }
])

const historicalScenarios = ref([
  {
    id: 1,
    name: '高价值客户促销策略',
    date: '2025-12-15',
    conversion: 78,
    revenue: 550,
    roi: 1.8,
    status: '已应用'
  },
  {
    id: 2,
    name: '流失风险客户挽回',
    date: '2025-12-12',
    conversion: 65,
    revenue: 420,
    roi: 1.5,
    status: '模拟中'
  },
  {
    id: 3,
    name: '全渠道营销组合',
    date: '2025-12-10',
    conversion: 82,
    revenue: 680,
    roi: 2.1,
    status: '已应用'
  }
])

// ========== 投标预测AI模块数据 ==========
const biddingRound = ref('round1')
const currentBiddingProject = ref('某汽车厂智能生产线项目')

const biddingKPIs = ref([
  { id: 1, title: '当前项目数', value: '8个', trend: 20, trendLabel: '环比增长', icon: 'Trophy', color: '#67C23A' },
  { id: 2, title: '平均中标率', value: '65%', trend: 15, trendLabel: '环比提升', icon: 'TrendCharts', color: '#409EFF' },
  { id: 3, title: 'AI预测准确率', value: '87%', trend: 3, trendLabel: '持续优化', icon: 'DataAnalysis', color: '#E6A23C' },
  { id: 4, title: '本月预计中标', value: '5个', trend: 25, trendLabel: '环比增长', icon: 'Trophy', color: '#F56C6C' }
])

// 第一轮数据
const round1Competitors = ref([
  { name: '竞对A', predictedPrice: 2800000, confidence: 82, strategy: '激进定价策略，可能报低价抢占市场' },
  { name: '竞对B', predictedPrice: 3200000, confidence: 78, strategy: '稳健策略，注重利润平衡' },
  { name: '竞对C', predictedPrice: 3500000, confidence: 75, strategy: '高价值策略，强调品质和服务' }
])

const round1RecommendedPrice = ref(295)
const round1WinRate = ref(72)
const round1ExpectedProfit = ref(45)
const round1AIReason = ref('基于竞争对手行为预测和客户预算分析，推荐报价¥295万可获得最佳胜率与利润平衡。建议采用"高价值+服务保障"策略，强调长期合作价值。')

// 第二轮数据
const round2Competitors = ref([
  { name: '竞对A', round1Price: 2800000, predictedPrice: 2650000, change: -5.4, strategy: '进一步降价，准备孤注一掷' },
  { name: '竞对B', round1Price: 3200000, predictedPrice: 3100000, change: -3.1, strategy: '小幅调整，保持竞争力' },
  { name: '竞对C', round1Price: 3500000, predictedPrice: 3400000, change: -2.9, strategy: '象征性降价，坚持价值策略' }
])

const round2RecommendedPrice = ref(282)
const round2WinRate = ref(78)
const round2ExpectedProfit = ref(38)
const round2AIReason = ref('根据第一轮竞争对手报价，竞对A采用激进策略。建议适度降价至¥282万，保持竞争优势同时确保合理利润。强调技术优势和服务保障。')

// 第三轮数据
const round3Competitors = ref([
  { name: '竞对A', round2Price: 2650000, predictedPrice: 2580000, finalRank: 2, winProbability: 35 },
  { name: '竞对B', round2Price: 3100000, predictedPrice: 3050000, finalRank: 3, winProbability: 15 },
  { name: '竞对C', round2Price: 3400000, predictedPrice: 3350000, finalRank: 4, winProbability: 8 }
])

const round3RecommendedPrice = ref(268)
const round3WinRate = ref(85)
const round3ExpectedProfit = ref(32)
const predictedRank = ref(1)
const round3AIReason = ref('最终轮次关键决战！AI综合分析显示，报价¥268万可确保85%胜率并获得第1名排名。虽然利润压缩至¥32万，但项目战略价值极高，建议中标。后续可通过增值服务和长期合作弥补利润。')

// 蒙特卡洛模拟数据
const monteCarloAvgWinRate = ref(78)
const monteCarloPriceRange = ref('265-275万')
const monteCarloRisk = ref('中')

const competitorBehaviors = ref([
  {
    name: '竞对A',
    strategy: '激进降价',
    risk: 'danger',
    prediction: 'AI预测其会采用成本底线策略，最终报价约¥258万，但利润空间不足可能影响项目质量'
  },
  {
    name: '竞对B',
    strategy: '稳健跟随',
    risk: 'warning',
    prediction: '预计会跟随市场主流价格，最终报价¥305万左右，竞争力相对较弱'
  },
  {
    name: '竞对C',
    strategy: '高端路线',
    risk: 'success',
    prediction: '坚持高价值策略，最终报价约¥335万，主打品质和服务，不太可能调整太多'
  }
])

const biddingProjects = ref([
  {
    id: 1,
    name: '某汽车厂智能生产线',
    customer: '某汽车制造',
    budget: 3000000,
    competitors: 3,
    currentRound: 3,
    winRate: 85,
    deadline: '2025-12-25',
    status: '进行中'
  },
  {
    id: 2,
    name: '电子厂自动化改造项目',
    customer: '某电子公司',
    budget: 1800000,
    competitors: 4,
    currentRound: 2,
    winRate: 72,
    deadline: '2025-12-30',
    status: '进行中'
  }
])

// 新增方法
const refreshMatrix = () => {
  ElMessage.success('产品矩阵数据已刷新')
}

const viewMatrixAIInsights = () => {
  ElMessage.info('打开产品矩阵AI详细洞察')
}

const addProduct = () => {
  ElMessage.info('打开添加产品对话框')
}

const viewProductDetail = (product) => {
  ElMessage.info(`查看产品详情：${product.name}`)
}

const optimizeProduct = (product) => {
  ElMessage.success(`开始优化产品：${product.name}`)
}

const getLifecycleType = (lifecycle) => {
  const map = { '导入期': 'info', '成长期': 'success', '成熟期': 'primary', '衰退期': 'danger' }
  return map[lifecycle] || 'info'
}

const getStrategyType = (strategy) => {
  const map = { '核心产品': 'success', '优化提升': 'warning', '维持运营': 'info', '淘汰替代': 'danger' }
  return map[strategy] || 'info'
}

const createTarget = () => {
  showTargetDialog.value = true
  targetForm.value = {
    name: '',
    type: 'revenue',
    period: 'month',
    target: '',
    current: 0,
    unit: '万元',
    responsible: ''
  }
}

const showTargetDialog = ref(false)
const targetForm = ref({
  name: '',
  type: 'revenue',
  period: 'month',
  target: '',
  current: 0,
  unit: '万元',
  responsible: ''
})

const submitTarget = () => {
  if (!targetForm.value.name || !targetForm.value.target) {
    ElMessage.warning('请填写必填项：目标名称和目标值')
    return
  }
  
  const newTarget = {
    id: Date.now(),
    ...targetForm.value,
    createDate: new Date().toISOString().split('T')[0],
    progress: 0,
    status: 'active'
  }
  
  salesTargets.value.unshift(newTarget)
  
  ElMessage.success('销售目标创建成功！')
  showTargetDialog.value = false
}

const refreshTargets = () => {
  ElMessage.success('销售目标数据已刷新')
}

const viewTargetAIInsights = () => {
  ElMessage.info('打开目标管理AI详细分析')
}

const createActionPlan = () => {
  ElMessage.info('打开新建行动计划对话框')
}

const viewPlanDetail = (plan) => {
  ElMessage.info(`查看计划详情：${plan.name}`)
}

const updatePlan = (plan) => {
  ElMessage.success(`更新计划：${plan.name}`)
}

const createBiddingProject = () => {
  showBiddingDialog.value = true
  biddingForm.value = {
    name: '',
    client: '',
    amount: '',
    bidDate: '',
    competitors: [],
    description: ''
  }
}

const showBiddingDialog = ref(false)
const biddingForm = ref({
  name: '',
  client: '',
  amount: '',
  bidDate: '',
  competitors: [],
  description: ''
})

const submitBiddingProject = () => {
  if (!biddingForm.value.name || !biddingForm.value.client) {
    ElMessage.warning('请填写必填项：项目名称和客户名称')
    return
  }
  
  const newProject = {
    id: Date.now(),
    ...biddingForm.value,
    createDate: new Date().toISOString().split('T')[0],
    status: '进行中',
    winRate: 0
  }
  
  // 添加到投标项目列表
  biddingProjects.value.unshift(newProject)
  
  ElMessage.success('投标项目创建成功！')
  showBiddingDialog.value = false
}

const runBiddingSimulation = () => {
  ElMessage.success('正在运行投标模拟...AI分析中')
}

const viewBiddingDetail = (project) => {
  ElMessage.info(`查看投标项目详情：${project.name}`)
}

const simulateBidding = (project) => {
  ElMessage.success(`启动模拟：${project.name}`)
}

const getBiddingStatusType = (status) => {
  const map = { '进行中': 'primary', '已中标': 'success', '未中标': 'danger', '已取消': 'info' }
  return map[status] || 'info'
}

// ========== 竞争对手管理模块 ==========
const showCompetitorDialog = ref(false)
const competitorTab = ref('list')
const competitorSearch = ref('')
const currentCompetitor = ref(null)
const swotCompetitor = ref(null)
const swotAnalysis = ref({
  strengths: '',
  weaknesses: '',
  opportunities: '',
  threats: '',
  aiRecommendation: ''
})

// 竞争对手列表数据
const competitorsList = ref([
  {
    id: 1,
    name: '阿特拉斯·科普柯',
    country: '瑞典',
    marketShare: 28,
    productLine: '工业压缩机、真空设备、拧紧工具、组装系统',
    recentNews: '2024年Q1推出新一代智能拧紧系统，集成AI质量预测功能',
    winningProjects: '2024年奔驰德国工厂智能装配线项目 8000万欧元\n2023年特斯拉柏林工厂拧紧系统 6500万欧元',
    development: '计划2025年在中国苏州建立新的研发中心，投资5亿人民币',
    techAdvantages: '1. 独有的PF6000控制器技术\n2. 工业4.0整合解决方案\n3. 超过150年的行业经验',
    customers: '奔驰、宝马、奥迪、大众、特斯拉',
    foundedYear: new Date('1873-01-01'),
    revenue: '150亿',
    employees: 43000,
    rdRatio: 3.5,
    globalRank: 1,
    chinaMarketShare: 22,
    website: 'https://www.atlascopco.com',
    lastUpdate: '2024-12-15',
    notes: '行业绝对领导者，高端市场占有率最高'
  },
  {
    id: 2,
    name: '英格索兰',
    country: '美国',
    marketShare: 18,
    productLine: '压缩空气系统、拧紧工具、气动工具、流体管理',
    recentNews: '2024年收购德国精密工具制造商，强化欧洲市场',
    winningProjects: '2024年通用汽车全球工厂标准化项目 1.2亿美元\n2023年福特电动车工厂拧紧系统 7500万美元',
    development: '战略重点转向电动汽车装配领域，研发电池组装配解决方案',
    techAdvantages: '1. QX系列无线拧紧工具领先\n2. 云端数据分析平台成熟\n3. 北美市场占有率第一',
    customers: '通用、福特、克莱斯勒、丰田北美',
    foundedYear: new Date('1871-01-01'),
    revenue: '68亿',
    employees: 16000,
    rdRatio: 2.8,
    globalRank: 2,
    chinaMarketShare: 15,
    website: 'https://www.ingersollrand.com',
    lastUpdate: '2024-12-10',
    notes: '北美市场强势，电动车领域布局领先'
  },
  {
    id: 3,
    name: '博世力士乐',
    country: '德国',
    marketShare: 22,
    productLine: '工业自动化、液压系统、拧紧技术、装配系统',
    recentNews: '2024年发布NEXO智能拧紧平台，支持5G边缘计算',
    winningProjects: '2024年比亚迪全球工厂智能装配项目 5.5亿人民币\n2023年宁德时代电池装配线 3.8亿人民币',
    development: '在中国西安扩建智能制造基地，专注新能源汽车领域',
    techAdvantages: '1. 全球领先的工业4.0解决方案\n2. 与西门子深度合作的数字化平台\n3. 模块化设计行业标杆',
    customers: '比亚迪、宁德时代、大众、宝马中国',
    foundedYear: new Date('1978-01-01'),
    revenue: '71亿',
    employees: 32500,
    rdRatio: 4.2,
    globalRank: 1,
    chinaMarketShare: 25,
    website: 'https://www.boschrexroth.com',
    lastUpdate: '2024-12-18',
    notes: '中国市场份额最高，新能源领域优势明显'
  },
  {
    id: 4,
    name: '马头',
    country: '德国',
    marketShare: 12,
    productLine: '拧紧工具、气动工具、装配系统',
    recentNews: '2024年推出新一代伺服拧紧系统，精度提升30%',
    winningProjects: '2024年广汽本田焊装线拧紧系统 2800万人民币\n2023年上汽大众总装线项目 3200万人民币',
    development: '在上海建立亚太研发中心，专注汽车行业',
    techAdvantages: '1. 高精度伺服拧紧技术领先\n2. 紧凑型设计适合狭小空间\n3. 售后服务响应迅速',
    customers: '广汽本田、上汽大众、东风日产',
    foundedYear: new Date('1899-01-01'),
    revenue: '3.5亿',
    employees: 1200,
    rdRatio: 3.8,
    globalRank: 8,
    chinaMarketShare: 8,
    website: 'https://www.deprag.com',
    lastUpdate: '2024-12-12',
    notes: '德国工艺，性价比较高，中型企业首选'
  },
  {
    id: 5,
    name: '史丹利百得',
    country: '美国',
    marketShare: 10,
    productLine: '手动工具、电动工具、拧紧系统、工业存储',
    recentNews: '2024年在中国推出本土化产品线，价格下调20%',
    winningProjects: '2024年长安汽车工具房标准化项目 1500万人民币\n2023年吉利汽车维修工具项目 1200万人民币',
    development: '加大中国市场投入，推出性价比产品线',
    techAdvantages: '1. 手动工具市场占有率全球第一\n2. 工具管理系统完善\n3. 品牌知名度高',
    customers: '长安汽车、吉利汽车、广汽传祺',
    foundedYear: new Date('1843-01-01'),
    revenue: '155亿',
    employees: 60000,
    rdRatio: 2.2,
    globalRank: 1,
    chinaMarketShare: 7,
    website: 'https://www.stanleyblackanddecker.com',
    lastUpdate: '2024-12-08',
    notes: '手动工具强势，拧紧系统正在发力中国市场'
  },
  {
    id: 6,
    name: '日本优利康',
    country: '日本',
    marketShare: 8,
    productLine: '电动螺丝刀、拧紧控制器、自动化设备',
    recentNews: '2024年与日本电装合作开发下一代拧紧系统',
    winningProjects: '2024年丰田广州工厂总装线 2500万人民币\n2023年本田中国采购项目 1800万人民币',
    development: '聚焦日系车企，深耕细分市场',
    techAdvantages: '1. 小型化设计领先\n2. 适合精密装配\n3. 稳定性极高',
    customers: '丰田、本田、日产、马自达',
    foundedYear: new Date('1950-01-01'),
    revenue: '1.8亿',
    employees: 800,
    rdRatio: 3.2,
    globalRank: 15,
    chinaMarketShare: 5,
    website: 'https://www.uryu.co.jp',
    lastUpdate: '2024-12-05',
    notes: '日系车企首选，忠诚度高但市场份额有限'
  }
])

// 筛选后的竞争对手列表
const filteredCompetitorsList = computed(() => {
  if (!competitorSearch.value) return competitorsList.value
  const keyword = competitorSearch.value.toLowerCase()
  return competitorsList.value.filter(c => 
    c.name.toLowerCase().includes(keyword) ||
    c.country.toLowerCase().includes(keyword) ||
    c.productLine.toLowerCase().includes(keyword)
  )
})

// 打开竞争对手管理对话框
const manageCompetitors = () => {
  showCompetitorDialog.value = true
  competitorTab.value = 'list'
}

// 新增竞争对手
const addNewCompetitor = () => {
  currentCompetitor.value = {
    id: Date.now(),
    name: '',
    country: '',
    marketShare: 0,
    productLine: '',
    recentNews: '',
    winningProjects: '',
    development: '',
    techAdvantages: '',
    customers: '',
    foundedYear: null,
    revenue: '',
    employees: 0,
    rdRatio: 0,
    globalRank: 0,
    chinaMarketShare: 0,
    website: '',
    lastUpdate: new Date().toISOString().split('T')[0],
    notes: ''
  }
  competitorTab.value = 'detail'
}

// 查看竞争对手详情
const viewCompetitorDetail = (competitor) => {
  currentCompetitor.value = { ...competitor }
  competitorTab.value = 'detail'
}

// 保存竞争对手
const saveCompetitor = () => {
  if (!currentCompetitor.value.name) {
    ElMessage.warning('请填写公司名称')
    return
  }

  const index = competitorsList.value.findIndex(c => c.id === currentCompetitor.value.id)
  if (index >= 0) {
    // 更新现有竞争对手
    competitorsList.value[index] = { ...currentCompetitor.value }
    ElMessage.success('竞争对手信息已更新')
  } else {
    // 新增竞争对手
    competitorsList.value.unshift({ ...currentCompetitor.value })
    ElMessage.success('新竞争对手已添加')
  }
  
  competitorTab.value = 'list'
}

// 删除竞争对手
const deleteCompetitor = (competitor) => {
  ElMessageBox.confirm(
    `确定要删除竞争对手"${competitor.name}"吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    const index = competitorsList.value.findIndex(c => c.id === competitor.id)
    if (index >= 0) {
      competitorsList.value.splice(index, 1)
      ElMessage.success('已删除')
    }
  }).catch(() => {
    // 用户取消
  })
}

// SWOT分析
const analyzeSWOT = (competitor) => {
  swotCompetitor.value = competitor
  swotAnalysis.value = {
    strengths: competitor.techAdvantages || '',
    weaknesses: '',
    opportunities: '',
    threats: '',
    aiRecommendation: ''
  }
  competitorTab.value = 'swot'
}

// AI生成SWOT分析
const generateAISWOT = () => {
  ElMessage.info('AI正在分析中...')
  
  setTimeout(() => {
    // 模拟AI生成
    swotAnalysis.value = {
      strengths: `【优势分析】
1. 品牌影响力：${swotCompetitor.value.name}在${swotCompetitor.value.country}具有强大品牌认知度
2. 市场份额：当前市场份额${swotCompetitor.value.marketShare}%，排名靠前
3. 技术实力：${swotCompetitor.value.techAdvantages}
4. 客户资源：拥有${swotCompetitor.value.customers}等优质客户
5. 研发投入：研发占比${swotCompetitor.value.rdRatio}%，持续创新能力强`,
      
      weaknesses: `【劣势分析】
1. 价格策略：作为国际品牌，产品价格普遍偏高
2. 本地化程度：在中国市场的本地化服务可能不如本土企业
3. 响应速度：决策链条较长，对市场变化的响应可能较慢
4. 售后网络：部分地区售后服务网点覆盖不足
5. 定制化能力：标准化产品为主，定制化服务灵活性相对较低`,
      
      opportunities: `【机会分析】
1. 新能源汽车：中国新能源汽车市场快速增长，拧紧工具需求旺盛
2. 智能制造：工业4.0推进，智能拧紧系统需求增加
3. 国产替代：部分领域对高端进口设备依赖降低，但仍有高端市场空间
4. 市场扩张：二三线城市制造业升级，提供新的市场机会
5. 技术合作：与中国企业合作开发本地化产品`,
      
      threats: `【威胁分析】
1. 竞争加剧：国内厂商技术提升，性价比竞争激烈
2. 贸易摩擦：国际贸易环境不确定性增加
3. 成本上升：原材料、人力成本持续上涨
4. 技术替代：新技术路线可能颠覆现有产品
5. 客户忠诚度：价格敏感型客户流失风险`,
      
      aiRecommendation: `【AI竞争策略建议】

针对${swotCompetitor.value.name}，建议采取以下差异化竞争策略：

🎯 **核心策略：技术+服务+性价比组合拳**

1. **技术差异化**
   - 强调我们的本地化研发能力和快速响应优势
   - 突出在新能源汽车领域的实际应用案例
   - 展示智能化、数字化方面的创新功能

2. **价格策略**
   - 在确保质量的前提下，提供更具竞争力的价格（建议比${swotCompetitor.value.name}低15-20%）
   - 采用灵活的付款方式和融资租赁方案
   - 提供长期合作优惠政策

3. **服务优势**
   - 7×24小时本地化快速响应服务
   - 免费的操作培训和技术支持
   - 更长的质保期（建议比竞争对手多1年）

4. **客户关系**
   - 加强与决策层的关系维护
   - 提供定制化解决方案
   - 建立长期战略合作伙伴关系

5. **重点突破领域**
   - 新能源汽车装配线（对手相对薄弱环节）
   - 中小型制造企业（性价比敏感客户）
   - 二三线城市市场（服务网络优势）

💡 **投标建议**
- 初次报价：比${swotCompetitor.value.name}预测报价低12-15%
- 强调本地化服务和快速响应
- 提供3年免费维保（对手通常1-2年）
- 赠送操作培训和备件套件`
    }
    
    ElMessage.success('AI分析完成！')
  }, 2000)
}

// 保存SWOT分析
const saveSWOT = () => {
  // 将SWOT分析保存到竞争对手数据中
  const competitor = competitorsList.value.find(c => c.id === swotCompetitor.value.id)
  if (competitor) {
    competitor.swotAnalysis = { ...swotAnalysis.value }
    competitor.lastUpdate = new Date().toISOString().split('T')[0]
  }
  
  ElMessage.success('SWOT分析已保存')
  competitorTab.value = 'list'
}

// 联系人与关系图谱相关方法
const showContactDialog = ref(false)
const contactForm = ref({
  name: '',
  title: '',
  company: '',
  factoryName: '',
  workshopName: '',
  lineName: '',
  departmentName: '',
  stationName: '',
  phone: '',
  email: '',
  wechat: '',
  influence: 3,
  notes: ''
})

const addContact = () => {
  contactForm.value = {
    name: '',
    title: '',
    company: '',
    factoryName: '',
    workshopName: '',
    lineName: '',
    departmentName: '',
    stationName: '',
    phone: '',
    email: '',
    wechat: '',
    influence: 3,
    notes: ''
  }
  showContactDialog.value = true
}

const submitContact = () => {
  if (!contactForm.value.name || !contactForm.value.title || !contactForm.value.company) {
    ElMessage.warning('请填写必填项：姓名、职位和公司')
    return
  }
  
  const newContact = {
    id: Date.now(),
    ...contactForm.value,
    createDate: new Date().toISOString().split('T')[0]
  }
  
  // 添加到联系人列表
  contactsList.value.unshift(newContact)
  
  ElMessage.success('联系人添加成功！')
  showContactDialog.value = false
  
  // 刷新关系图谱
  refreshRelationship()
}

const refreshRelationship = () => {
  ElMessage.success('正在刷新关系图谱...')
}

const viewContact = (contact) => {
  ElMessage.info(`查看联系人详情：${contact.name}`)
}

const contactPerson = (contact) => {
  ElMessage.success(`发起联系：${contact.name}`)
}

const viewContactDetail = (contact) => {
  ElMessage.info(`查看详细信息：${contact.name}`)
}

const addInteraction = () => {
  ElMessage.info('添加新互动记录')
}

const followUp = (contact) => {
  ElMessage.success(`已安排跟进：${contact.name}`)
}

const cultivate = (person) => {
  ElMessage.info(`开始培养关键人物：${person.name}`)
}

// 客户沙盘相关方法
const createScenario = () => {
  showScenarioDialog.value = true
  scenarioForm.value = {
    name: '',
    type: 'marketing',
    budget: '',
    duration: '',
    description: ''
  }
}

const showScenarioDialog = ref(false)
const scenarioForm = ref({
  name: '',
  type: 'marketing',
  budget: '',
  duration: '',
  description: ''
})

const submitScenario = () => {
  if (!scenarioForm.value.name || !scenarioForm.value.budget) {
    ElMessage.warning('请填写必填项：场景名称和预算')
    return
  }
  
  const newScenario = {
    id: Date.now(),
    ...scenarioForm.value,
    createDate: new Date().toISOString().split('T')[0],
    status: 'draft'
  }
  
  sandboxScenarios.value.unshift(newScenario)
  
  ElMessage.success('沙盘场景创建成功！')
  showScenarioDialog.value = false
}

const runSimulation = () => {
  ElMessage.success('正在运行沙盘模拟...AI分析中')
}

const applySandboxStrategy = () => {
  ElMessage.success('策略已应用到营销系统')
}

const exportScenarios = () => {
  ElMessage.info('导出场景对比报告')
}

const loadScenario = (scenario) => {
  ElMessage.info(`加载场景：${scenario.name}`)
}

const compareScenario = (scenario) => {
  ElMessage.info(`对比场景：${scenario.name}`)
}

const getScenarioStatusType = (status) => {
  const map = { '已应用': 'success', '模拟中': 'primary', '已取消': 'info' }
  return map[status] || 'info'
}

// ECharts图表初始化标志
const chartsInitialized = ref({
  productMatrix: false,
  bcg: false,
  category: false
})

// ECharts图表初始化 (将在切换到对应标签时调用)
const initCharts = () => {
  nextTick(() => {
    // 产品矩阵散点图
    if (document.getElementById('productMatrixChart') && !chartsInitialized.value.productMatrix) {
      const matrixChart = echarts.init(document.getElementById('productMatrixChart'))
      matrixChart.setOption({
        title: { text: '产品收益-现金流矩阵' },
        tooltip: { 
          trigger: 'item',
          formatter: (params) => {
            return `${params.data[3]}<br/>毛利率: ${params.data[0]}%<br/>现金流贡献: ${params.data[1]}%<br/>收益: ¥${(params.data[2]/10000).toFixed(0)}万`
          }
        },
        xAxis: { 
          name: '毛利率 (%)',
          min: 0,
          max: 100,
          splitLine: { show: true }
        },
        yAxis: { 
          name: '现金流贡献率 (%)',
          min: 0,
          max: 100,
          splitLine: { show: true }
        },
        grid: { left: '10%', right: '10%', bottom: '15%', top: '15%' },
        series: [{
          type: 'scatter',
          symbolSize: (data) => Math.sqrt(data[2]) / 100,
          data: [
            [45, 85, 2800000, '智能拧紧控制器 Pro'],
            [38, 72, 1600000, '精密拧紧工具系列'],
            [28, 68, 980000, '套筒工具套装'],
            [52, 78, 2200000, '数据采集系统'],
            [35, 65, 1200000, '扭矩扳手系列'],
            [42, 75, 1800000, '智能检测设备']
          ],
          itemStyle: {
            color: (params) => {
              // 根据位置着色：高毛利高现金流=绿色，其他渐变
              if (params.data[0] > 40 && params.data[1] > 70) return '#67C23A'
              if (params.data[0] > 35 && params.data[1] > 65) return '#409EFF'
              if (params.data[0] > 30) return '#E6A23C'
              return '#F56C6C'
            }
          }
        }]
      })
      chartsInitialized.value.productMatrix = true
    }

    // BCG矩阵
    if (document.getElementById('bcgMatrixChart') && !chartsInitialized.value.bcg) {
      const bcgChart = echarts.init(document.getElementById('bcgMatrixChart'))
      bcgChart.setOption({
        title: { text: 'BCG矩阵' },
        tooltip: { 
          trigger: 'item',
          formatter: (params) => {
            return `${params.data[2]}<br/>市场份额: ${params.data[0]}%<br/>增长率: ${params.data[1]}%`
          }
        },
        xAxis: { 
          name: '市场份额 (%)',
          min: 0,
          max: 100,
          splitLine: { show: true, lineStyle: { type: 'dashed' } },
          axisLine: { onZero: false }
        },
        yAxis: { 
          name: '市场增长率 (%)',
          min: -20,
          max: 40,
          splitLine: { show: true, lineStyle: { type: 'dashed' } }
        },
        grid: { left: '15%', right: '10%', bottom: '15%', top: '15%' },
        series: [{
          type: 'scatter',
          symbolSize: 30,
          data: [
            [65, 25, '智能控制器', '明星产品'],
            [45, 15, '拧紧工具', '现金牛'],
            [25, 35, '物联网系统', '问题产品'],
            [15, -5, '传统工具', '瘦狗产品'],
            [55, 30, '检测设备', '明星产品'],
            [35, 8, '配件耗材', '现金牛']
          ],
          itemStyle: {
            color: (params) => {
              // 明星产品（高份额高增长）=金色
              if (params.data[0] > 50 && params.data[1] > 20) return '#F59A23'
              // 现金牛（高份额低增长）=绿色
              if (params.data[0] > 40 && params.data[1] < 20 && params.data[1] > 0) return '#67C23A'
              // 问题产品（低份额高增长）=蓝色
              if (params.data[0] < 40 && params.data[1] > 20) return '#409EFF'
              // 瘦狗产品（低份额低增长）=灰色
              return '#909399'
            }
          },
          label: {
            show: true,
            formatter: '{@[2]}',
            position: 'top',
            fontSize: 10
          }
        }],
        // 添加象限分割线
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: { type: 'solid', color: '#999', width: 2 },
          data: [
            { xAxis: 50 },
            { yAxis: 10 }
          ]
        }
      })
      chartsInitialized.value.bcg = true
    }

    // 大类贡献图
    if (document.getElementById('categoryContributionChart') && !chartsInitialized.value.category) {
      const categoryChart = echarts.init(document.getElementById('categoryContributionChart'))
      categoryChart.setOption({
        title: { text: '产品大类收入贡献' },
        tooltip: { 
          trigger: 'axis',
          formatter: (params) => {
            return `${params[0].name}<br/>收入: ¥${params[0].value}万<br/>占比: ${((params[0].value / 6580) * 100).toFixed(1)}%`
          }
        },
        xAxis: { 
          type: 'category', 
          data: ['控制系统', '拧紧工具', '检测设备', '配件工具', '物联网', '软件服务'],
          axisLabel: { interval: 0, rotate: 30 }
        },
        yAxis: { 
          type: 'value',
          name: '收入（万元）'
        },
        grid: { left: '12%', right: '10%', bottom: '20%', top: '15%' },
        series: [{
          type: 'bar',
          data: [2800, 1600, 1200, 980, 650, 350],
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#409EFF' },
              { offset: 1, color: '#67C23A' }
            ])
          },
          label: {
            show: true,
            position: 'top',
            formatter: '¥{c}万'
          }
        }]
      })
      chartsInitialized.value.category = true
    }
  })
}

// 监听标签页切换，初始化对应图表
watch(activeTab, (newTab) => {
  if (newTab === 'productMatrix') {
    // 延迟100ms确保DOM渲染完成
    setTimeout(() => {
      initCharts()
    }, 100)
  }
})

// ECharts图表初始化 (旧版，保留兼容)
const initChartsOld = () => {
  // 产品矩阵散点图
  const matrixChart = echarts.init(document.getElementById('productMatrixChart'))
  matrixChart.setOption({
    title: { text: '产品收益-现金流矩阵' },
    tooltip: { trigger: 'item' },
    xAxis: { name: '毛利率 (%)' },
    yAxis: { name: '现金流贡献率 (%)' },
    series: [{
      type: 'scatter',
      symbolSize: (data) => data[2] / 50000,
      data: [
        [45, 85, 2800000, '智能拧紧控制器 Pro'],
        [38, 72, 1600000, '精密拧紧工具系列'],
        [28, 68, 980000, '套筒工具套装']
      ]
    }]
  })

  // BCG矩阵
  const bcgChart = echarts.init(document.getElementById('bcgMatrixChart'))
  bcgChart.setOption({
    title: { text: 'BCG矩阵' },
    tooltip: { trigger: 'item' },
    xAxis: { name: '市场份额' },
    yAxis: { name: '市场增长率 (%)' },
    series: [{
      type: 'scatter',
      symbolSize: 20,
      data: [[0.3, 15], [0.5, 8], [0.15, 12]]
    }]
  })

  // 销售预测图
  const forecastChart = echarts.init(document.getElementById('salesForecastChart'))
  forecastChart.setOption({
    title: { text: '销售预测趋势' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['1月', '2月', '3月', '4月', '5月', '6月'] },
    yAxis: { type: 'value' },
    series: [
      { name: '实际', type: 'line', data: [120, 132, 101, 134, 90, 180] },
      { name: '预测', type: 'line', data: [null, null, null, null, 180, 195], lineStyle: { type: 'dashed' } }
    ]
  })

  // 蒙特卡洛图
  const monteCarloChart = echarts.init(document.getElementById('monteCarloChart'))
  monteCarloChart.setOption({
    title: { text: '胜率分布' },
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['250', '260', '268', '275', '280', '290', '300'] },
    yAxis: { type: 'value', name: '胜率 (%)' },
    series: [{
      type: 'line',
      data: [45, 62, 85, 78, 65, 52, 38],
      smooth: true,
      areaStyle: {}
    }]
  })

  // 大类贡献图
  if (document.getElementById('categoryContributionChart')) {
    const categoryChart = echarts.init(document.getElementById('categoryContributionChart'))
    categoryChart.setOption({
      title: { text: '产品大类收入贡献' },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['控制系统', '拧紧工具', '配件工具', '检测设备'] },
      yAxis: { type: 'value' },
      series: [{
        type: 'bar',
        data: [2800, 1600, 980, 1200],
        itemStyle: { color: '#409EFF' }
      }]
    })
  }

  // 沙盘收益-风险矩阵
  if (document.getElementById('revenueRiskMatrix')) {
    const matrixChart = echarts.init(document.getElementById('revenueRiskMatrix'))
    matrixChart.setOption({
      title: { text: '收益-风险矩阵' },
      tooltip: { trigger: 'item' },
      xAxis: { name: '风险等级' },
      yAxis: { name: '收益增长 (%)' },
      series: [{
        type: 'scatter',
        symbolSize: 20,
        data: [[0.3, 15], [0.5, 22], [0.7, 12], [0.2, 18]],
        itemStyle: { color: '#67C23A' }
      }]
    })
  }

  // 敏感性分析图
  if (document.getElementById('sensitivityChart')) {
    const sensitivityChart = echarts.init(document.getElementById('sensitivityChart'))
    sensitivityChart.setOption({
      title: { text: '策略参数敏感性分析' },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: ['价格', '折扣', '渠道', '频率', '客群'] },
      yAxis: { type: 'value', name: '影响度 (%)' },
      series: [{
        type: 'bar',
        data: [35, 28, 22, 18, 15],
        itemStyle: { 
          color: function(params) {
            const colors = ['#F56C6C', '#E6A23C', '#409EFF', '#67C23A', '#909399']
            return colors[params.dataIndex]
          }
        }
      }]
    })
  }

  // 关系图谱
  if (document.getElementById('relationshipGraph')) {
    const relationshipChart = echarts.init(document.getElementById('relationshipGraph'))
    
    const graphData = {
      nodes: [
        { id: '1', name: '明升工业', symbolSize: 80, category: 0, value: 100 },
        { id: '2', name: '张总\\n总经理', symbolSize: 60, category: 1, value: 95 },
        { id: '3', name: '李工\\n技术总监', symbolSize: 50, category: 1, value: 80 },
        { id: '4', name: '王经理\\n采购经理', symbolSize: 50, category: 1, value: 80 },
        { id: '5', name: '刘总监\\n生产总监', symbolSize: 50, category: 1, value: 75 },
        { id: '6', name: '赵主管\\n质量主管', symbolSize: 40, category: 2, value: 60 },
        { id: '7', name: '陈主任\\n设备主任', symbolSize: 40, category: 2, value: 55 },
        { id: '8', name: '孙工\\n研发工程师', symbolSize: 35, category: 2, value: 50 }
      ],
      links: [
        { source: '1', target: '2', value: 10, name: '决策层' },
        { source: '1', target: '3', value: 8, name: '技术对接' },
        { source: '1', target: '4', value: 8, name: '商务合作' },
        { source: '1', target: '5', value: 7, name: '生产协同' },
        { source: '2', target: '3', value: 6, name: '管理' },
        { source: '2', target: '4', value: 6, name: '管理' },
        { source: '2', target: '5', value: 6, name: '管理' },
        { source: '3', target: '6', value: 5, name: '质量对接' },
        { source: '3', target: '8', value: 5, name: '技术指导' },
        { source: '5', target: '7', value: 4, name: '设备配合' }
      ],
      categories: [
        { name: '核心客户' },
        { name: '关键联系人' },
        { name: '普通联系人' }
      ]
    }
    
    relationshipChart.setOption({
      title: { text: '客户关系网络图谱', left: 'center' },
      tooltip: {
        formatter: function(params) {
          if (params.dataType === 'edge') {
            return `${params.data.name}: ${params.data.source} → ${params.data.target}`
          }
          return `${params.data.name}<br/>影响力: ${params.data.value}`
        }
      },
      legend: {
        data: graphData.categories.map(c => c.name),
        bottom: 10
      },
      series: [{
        type: 'graph',
        layout: 'force',
        data: graphData.nodes,
        links: graphData.links,
        categories: graphData.categories,
        roam: true,
        label: {
          show: true,
          position: 'inside',
          formatter: '{b}',
          fontSize: 10
        },
        labelLayout: {
          hideOverlap: true
        },
        force: {
          repulsion: 500,
          edgeLength: [100, 200]
        },
        lineStyle: {
          color: 'source',
          curveness: 0.3
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 5
          }
        }
      }]
    })
  }
}

// ========== 产品矩阵数据管理 ==========

// 产品数据
const productMatrixData = ref([
  { name: '智能拧紧控制器 Pro', profit: 45, cashFlow: 85, revenue: 2800000, category: '控制系统' },
  { name: '精密拧紧工具系列', profit: 38, cashFlow: 72, revenue: 1600000, category: '拧紧工具' },
  { name: '套筒工具套装', profit: 28, cashFlow: 68, revenue: 980000, category: '配件工具' },
  { name: '数据采集系统', profit: 52, cashFlow: 78, revenue: 2200000, category: '控制系统' },
  { name: '扭矩扳手系列', profit: 35, cashFlow: 65, revenue: 1200000, category: '拧紧工具' },
  { name: '智能检测设备', profit: 42, cashFlow: 75, revenue: 1800000, category: '检测设备' }
])

// 产品数据输入对话框
const showProductDataDialog = ref(false)
const productDataForm = ref({
  name: '',
  profit: 0,
  cashFlow: 0,
  revenue: 0,
  category: ''
})

// 打开产品数据输入对话框
const openProductDataDialog = () => {
  productDataForm.value = {
    name: '',
    profit: 0,
    cashFlow: 0,
    revenue: 0,
    category: ''
  }
  showProductDataDialog.value = true
}

// 提交产品数据
const submitProductData = () => {
  if (!productDataForm.value.name || !productDataForm.value.category) {
    ElMessage.warning('请填写产品名称和类别')
    return
  }
  
  productMatrixData.value.push({
    ...productDataForm.value
  })
  
  ElMessage.success('产品数据已添加！')
  showProductDataDialog.value = false
  
  // 重新初始化图表
  chartsInitialized.value.productMatrix = false
  chartsInitialized.value.bcg = false
  chartsInitialized.value.category = false
  
  setTimeout(() => {
    initCharts()
  }, 100)
}

// 删除产品数据
const deleteProductData = (index) => {
  ElMessageBox.confirm('确定要删除这个产品吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    productMatrixData.value.splice(index, 1)
    ElMessage.success('删除成功！')
    
    // 重新初始化图表
    chartsInitialized.value.productMatrix = false
    chartsInitialized.value.bcg = false
    chartsInitialized.value.category = false
    
    setTimeout(() => {
      initCharts()
    }, 100)
  }).catch(() => {
    // 取消删除
  })
}

onMounted(() => {
  // 延迟初始化图表,确保DOM已渲染
  setTimeout(() => {
    try {
      // 如果默认标签是产品矩阵，则初始化
      if (activeTab.value === 'productMatrix') {
        initCharts()
      }
    } catch (error) {
      console.log('图表初始化将在切换到对应标签时进行')
    }
  }, 500)
})
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
      gap: 10px;
      cursor: pointer;
      padding: 8px 16px;
      border-radius: 8px;
      transition: all 0.3s ease;
      background: rgba(255, 255, 255, 0.1);
      
      &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-1px);
      }
      
      .user-name {
        font-size: 15px;
        font-weight: 500;
        color: #ffffff;
        margin: 0 4px;
      }
      
      .dropdown-icon {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.9);
        transition: transform 0.3s ease;
      }
      
      &:hover .dropdown-icon {
        transform: rotate(180deg);
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

/* 优化下拉菜单样式 */
:deep(.user-dropdown-menu) {
  margin-top: 12px !important;
  padding: 8px 0 !important;
  min-width: 180px !important;
  border-radius: 10px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
  border: 1px solid rgba(0, 0, 0, 0.08) !important;
  
  .el-dropdown-menu__item {
    padding: 12px 20px !important;
    font-size: 15px !important;
    font-weight: 500 !important;
    color: #303133 !important;
    display: flex !important;
    align-items: center !important;
    gap: 10px !important;
    transition: all 0.2s ease !important;
    
    .el-icon {
      font-size: 18px !important;
      color: #667eea !important;
    }
    
    span {
      flex: 1;
    }
    
    &:hover {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
      color: #ffffff !important;
      
      .el-icon {
        color: #ffffff !important;
      }
    }
    
    &.is-divided {
      margin-top: 6px !important;
      border-top: 1px solid #ebeef5 !important;
    }
  }
}

/* 自动化流程视图样式 */
.automation-view {
  .workflow-diagram {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin: 20px 0;
  }

  .workflow-node {
    background: white;
    border: 2px solid #DCDFE6;
    border-radius: 8px;
    padding: 16px;
    position: relative;
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      transform: translateY(-2px);
    }

    &.ai-node {
      border-color: #67C23A;
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2f1 100%);
    }

    &.manual-node {
      border-color: #409EFF;
      background: linear-gradient(135deg, #f0f7ff 0%, #e3f2fd 100%);
    }

    &.system-node {
      border-color: #909399;
      background: linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%);
    }

    .node-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;

      .node-name {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }
    }

    .node-content {
      .node-detail {
        font-size: 14px;
        color: #606266;
        margin: 6px 0;
      }
    }

    .node-arrow {
      position: absolute;
      bottom: -20px;
      left: 50%;
      transform: translateX(-50%) rotate(90deg);
      font-size: 24px;
      color: #409EFF;
    }

    &:last-child .node-arrow {
      display: none;
    }
  }

  .workflow-stats {
    margin-top: 30px;

    h3 {
      margin-bottom: 20px;
      color: #303133;
    }
  }
}

/* 待办任务视图样式 */
.tasks-view {
  .task-filters {
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
  }
}

/* 产品矩阵管理视图样式 */
.product-matrix-view {
  .ai-strategy-panel {
    .strategy-item {
      margin-bottom: 20px;
      padding: 16px;
      background: #F5F7FA;
      border-radius: 8px;

      h4 {
        margin: 0 0 8px 0;
        color: #303133;
        font-size: 14px;
      }

      p {
        margin: 0 0 8px 0;
        color: #606266;
        font-size: 13px;
      }
    }
  }
}

/* 销售目标管理视图样式 */
.sales-target-view {
  .target-progress {
    .target-item {
      margin-bottom: 24px;
      padding: 16px;
      background: #F5F7FA;
      border-radius: 8px;

      .target-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;

        .target-name {
          font-weight: 600;
          color: #303133;
        }

        .target-value {
          color: #409EFF;
          font-weight: 600;
        }
      }

      .target-info {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        font-size: 13px;
        color: #606266;
      }
    }
  }

  .ai-analysis-panel {
    .analysis-item {
      margin-bottom: 20px;

      h4 {
        margin: 0 0 8px 0;
        color: #303133;
        font-size: 14px;
      }

      p {
        margin: 0 0 8px 0;
        color: #606266;
        font-size: 13px;
      }
    }
  }
}

/* 联系人与关系图谱视图样式 */
.contacts-relationship-view {
  .activity-tags {
    margin-top: 8px;
    
    .el-tag {
      margin-right: 8px;
    }
  }

  .ai-recommendation {
    h4 {
      margin-bottom: 16px;
      color: #303133;
      font-size: 16px;
    }
  }

  .el-timeline {
    max-height: 540px;
    overflow-y: auto;

    .el-card {
      margin-bottom: 0;

      h4 {
        margin: 0 0 8px 0;
        color: #303133;
        font-size: 14px;
      }

      p {
        margin: 0 0 8px 0;
        color: #606266;
        font-size: 13px;
      }
    }
  }
}

/* 客户沙盘分析视图样式 */
.customer-sandbox-view {
  .strategy-settings {
    padding: 20px 0;

    .el-form-item {
      margin-bottom: 30px;
    }
  }

  .simulation-results {
    .result-item {
      margin-bottom: 24px;

      h4 {
        margin: 0 0 12px 0;
        color: #303133;
        font-size: 14px;
      }

      p {
        margin: 8px 0 0 0;
        color: #606266;
        font-size: 13px;
      }

      .revenue-change {
        .value {
          font-size: 32px;
          font-weight: 600;

          &.positive {
            color: #67C23A;
          }
          &.negative {
            color: #F56C6C;
          }
        }
      }
    }
  }
}

/* 投标预测AI视图样式 */
.bidding-ai-view {
  padding: 24px;
}

/* ========== 自然语言搜索面板样式 (Phase 1-3) ========== */
.nlp-search-panel {
  padding: 20px;
  max-height: 600px;
  overflow-y: auto;

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 2px solid #f0f0f0;

    h4 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #303133;
    }
  }

  // Phase 1: 快速指令样式
  .quick-commands {
    margin-bottom: 24px;

    h5 {
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 600;
      color: #606266;
    }

    .command-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;

      .el-button {
        justify-content: flex-start;
        text-align: left;
      }
    }
  }

  // Phase 2 & 3: AI对话样式
  .ai-conversation {
    margin-bottom: 24px;

    .conversation-history {
      max-height: 300px;
      overflow-y: auto;
      margin-bottom: 16px;
      padding: 12px;
      background: #f5f7fa;
      border-radius: 8px;

      .message {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;

        &.user {
          flex-direction: row-reverse;

          .message-content {
            background: #409EFF;
            color: white;
            border-radius: 12px 12px 0 12px;
          }
        }

        &.assistant {
          .message-content {
            background: white;
            border: 1px solid #e4e7ed;
            border-radius: 12px 12px 12px 0;
          }
        }

        .message-avatar {
          flex-shrink: 0;
        }

        .message-content {
          max-width: 70%;
          padding: 12px 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);

          .message-text {
            white-space: pre-wrap;
            line-height: 1.6;
            font-size: 14px;
          }

          .message-result {
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            gap: 12px;
          }
        }
      }
    }

    .ai-suggestions {
      padding: 12px;
      background: #fff8e1;
      border-radius: 8px;
      border-left: 3px solid #FFA500;

      .el-tag {
        margin: 4px;
      }
    }
  }

  // 历史查询记录样式
  .search-history {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e4e7ed;

    h5 {
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 600;
      color: #606266;
    }

    .history-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .el-tag {
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
      }
    }
  }
}

/* 滚动条美化 */
.nlp-search-panel,
.ai-conversation .conversation-history {
  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;

    &:hover {
      background: #555;
    }
  }
}
  .bidding-round-content {
    h3 {
      margin-bottom: 20px;
      color: #303133;
    }

    .competitor-analysis {
      margin-bottom: 24px;
    }

    .ai-recommendation {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2f1 100%);
      padding: 20px;
      border-radius: 8px;

      h4 {
        margin: 0 0 16px 0;
        color: #303133;
        font-size: 16px;
      }

      .price-recommendation {
        .price-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;

          .label {
            color: #606266;
            font-size: 14px;
          }

          .value {
            font-size: 24px;
            font-weight: 600;

            &.success {
              color: #67C23A;
            }
          }
        }
      }

      .ai-reason {
        margin-top: 16px;
        padding: 12px;
        background: #ffffff;
        border-radius: 6px;
        color: #606266;
        font-size: 13px;
        line-height: 1.6;
      }
    }
  }

  .simulation-stats {
    h4 {
      margin-bottom: 16px;
      color: #303133;
    }

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

  .competitor-behavior {
    .behavior-item {
      margin-bottom: 20px;
      padding: 12px;
      background: #F5F7FA;
      border-radius: 6px;

      h5 {
        margin: 0 0 8px 0;
        color: #303133;
      }

      p {
        margin: 8px 0 0 0;
        color: #606266;
        font-size: 13px;
        line-height: 1.6;
      }
    }
  }
</style>
