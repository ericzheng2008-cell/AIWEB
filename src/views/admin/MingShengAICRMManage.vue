<template>
  <div class="aicrm-manage">
    <el-page-header @back="$router.back()">
      <template #content>
        <div class="page-header-content">
          <el-icon><User /></el-icon>
          <span>明升AICRM 后台管理</span>
        </div>
      </template>
    </el-page-header>

    <el-tabs v-model="activeTab" class="management-tabs">
      <!-- Tab 1: 智能看板配置 -->
      <el-tab-pane label="📊 智能看板配置" name="dashboard">
        <div class="config-section">
          <h3>智能看板模块配置</h3>
          
          <!-- DB-01: 商机总览 -->
          <el-card class="config-card">
            <template #header>
              <div class="card-header">
                <span>📊 DB-01: 商机总览（漏斗图）</span>
                <el-switch v-model="dashboardConfig.opportunityOverview.enabled" />
              </div>
            </template>
            
            <el-form :model="dashboardConfig.opportunityOverview" label-width="140px">
              <el-form-item label="标题">
                <el-input v-model="dashboardConfig.opportunityOverview.title" placeholder="商机总览" />
              </el-form-item>
              
              <el-form-item label="阶段配置">
                <el-button @click="openStageEditor" type="primary" plain>
                  <el-icon><Edit /></el-icon>
                  编辑阶段和漏斗
                </el-button>
              </el-form-item>
              
              <el-form-item label="显示数据">
                <el-checkbox-group v-model="dashboardConfig.opportunityOverview.displayFields">
                  <el-checkbox label="count">商机数量</el-checkbox>
                  <el-checkbox label="amount">金额</el-checkbox>
                  <el-checkbox label="percentage">转化率</el-checkbox>
                  <el-checkbox label="trend">趋势箭头</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- DB-02: AI赢率预测 -->
          <el-card class="config-card">
            <template #header>
              <div class="card-header">
                <span>🎯 DB-02: AI赢率预测</span>
                <el-switch v-model="dashboardConfig.aiWinRate.enabled" />
              </div>
            </template>
            
            <el-form :model="dashboardConfig.aiWinRate" label-width="140px">
              <el-form-item label="模型类型">
                <el-radio-group v-model="dashboardConfig.aiWinRate.modelType">
                  <el-radio label="lightweight">轻量规则模型</el-radio>
                  <el-radio label="regression">线性回归</el-radio>
                  <el-radio label="ml">机器学习（需训练）</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item label="预测准确率目标">
                <el-slider v-model="dashboardConfig.aiWinRate.accuracyTarget" :min="70" :max="95" show-stops />
                <span class="accuracy-label">{{ dashboardConfig.aiWinRate.accuracyTarget }}%</span>
              </el-form-item>
              
              <el-form-item label="因素权重配置">
                <el-table :data="dashboardConfig.aiWinRate.factors" border>
                  <el-table-column prop="name" label="因素" width="150" />
                  <el-table-column prop="weight" label="权重" width="200">
                    <template #default="scope">
                      <el-slider v-model="scope.row.weight" :min="0" :max="100" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="weight" label="权重值">
                    <template #default="scope">
                      {{ scope.row.weight }}%
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- DB-03: 客户动态 -->
          <el-card class="config-card">
            <template #header>
              <div class="card-header">
                <span>📢 DB-03: 客户动态</span>
                <el-switch v-model="dashboardConfig.customerActivity.enabled" />
              </div>
            </template>
            
            <el-form :model="dashboardConfig.customerActivity" label-width="140px">
              <el-form-item label="实时刷新间隔">
                <el-input-number v-model="dashboardConfig.customerActivity.refreshInterval" :min="5" :max="300" />
                <span class="unit-label">秒</span>
              </el-form-item>
              
              <el-form-item label="显示条数">
                <el-input-number v-model="dashboardConfig.customerActivity.displayCount" :min="5" :max="50" />
              </el-form-item>
              
              <el-form-item label="活动类型过滤">
                <el-checkbox-group v-model="dashboardConfig.customerActivity.activityTypes">
                  <el-checkbox label="visit">访问网站</el-checkbox>
                  <el-checkbox label="download">下载资料</el-checkbox>
                  <el-checkbox label="inquiry">提交询盘</el-checkbox>
                  <el-checkbox label="call">电话沟通</el-checkbox>
                  <el-checkbox label="meeting">线下拜访</el-checkbox>
                  <el-checkbox label="email">邮件互动</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- DB-04: AI推荐任务 -->
          <el-card class="config-card">
            <template #header>
              <div class="card-header">
                <span>🤖 DB-04: AI推荐任务</span>
                <el-switch v-model="dashboardConfig.aiTasks.enabled" />
              </div>
            </template>
            
            <el-form :model="dashboardConfig.aiTasks" label-width="140px">
              <el-form-item label="推荐算法">
                <el-radio-group v-model="dashboardConfig.aiTasks.algorithm">
                  <el-radio label="rule">规则引擎</el-radio>
                  <el-radio label="score">评分排序</el-radio>
                  <el-radio label="ml">机器学习推荐</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item label="优先级计算">
                <el-table :data="dashboardConfig.aiTasks.priorityFactors" border>
                  <el-table-column prop="factor" label="因素" />
                  <el-table-column prop="weight" label="权重">
                    <template #default="scope">
                      <el-slider v-model="scope.row.weight" :min="0" :max="100" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="weight" label="权重值">
                    <template #default="scope">{{ scope.row.weight }}%</template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              
              <el-form-item label="每日推荐数量">
                <el-input-number v-model="dashboardConfig.aiTasks.dailyLimit" :min="5" :max="50" />
              </el-form-item>
              
              <el-form-item label="推荐确认率目标">
                <el-slider v-model="dashboardConfig.aiTasks.confirmRateTarget" :min="70" :max="100" show-stops />
                <span class="accuracy-label">{{ dashboardConfig.aiTasks.confirmRateTarget }}%</span>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- DB-05: KPI面板 -->
          <el-card class="config-card">
            <template #header>
              <div class="card-header">
                <span>📈 DB-05: KPI面板</span>
                <el-switch v-model="dashboardConfig.kpiPanel.enabled" />
              </div>
            </template>
            
            <el-form :model="dashboardConfig.kpiPanel" label-width="140px">
              <el-form-item label="KPI指标配置">
                <el-button @click="openKpiEditor" type="primary">
                  <el-icon><DataAnalysis /></el-icon>
                  配置6大KPI指标
                </el-button>
              </el-form-item>
              
              <el-form-item label="预警阈值">
                <el-table :data="dashboardConfig.kpiPanel.kpis" border>
                  <el-table-column prop="name" label="KPI指标" width="150" />
                  <el-table-column prop="target" label="目标值">
                    <template #default="scope">
                      <el-input v-model="scope.row.target" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="warningThreshold" label="预警阈值">
                    <template #default="scope">
                      <el-input-number v-model="scope.row.warningThreshold" :min="0" :max="100" />
                    </template>
                  </el-table-column>
                  <el-table-column label="启用">
                    <template #default="scope">
                      <el-switch v-model="scope.row.enabled" />
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- Tab 2: 客户360°配置 -->
      <el-tab-pane label="👤 客户360°配置" name="customer">
        <div class="config-section">
          <h3>客户360°视图配置</h3>
          
          <!-- CP-01: 基本信息 -->
          <el-card class="config-card">
            <template #header>
              <div class="card-header">
                <span>📇 CP-01: 客户基本信息</span>
                <el-switch v-model="customerConfig.basicInfo.enabled" />
              </div>
            </template>
            
            <el-form :model="customerConfig.basicInfo" label-width="140px">
              <el-form-item label="必填字段">
                <el-checkbox-group v-model="customerConfig.basicInfo.requiredFields">
                  <el-checkbox label="name">姓名</el-checkbox>
                  <el-checkbox label="phone">手机号</el-checkbox>
                  <el-checkbox label="email">邮箱</el-checkbox>
                  <el-checkbox label="company">公司名称</el-checkbox>
                  <el-checkbox label="position">职位</el-checkbox>
                  <el-checkbox label="industry">行业</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              
              <el-form-item label="客户标签库">
                <el-button @click="openTagLibrary" type="primary" plain>
                  <el-icon><PriceTag /></el-icon>
                  管理标签库
                </el-button>
                <div class="tag-preview">
                  <el-tag v-for="tag in customerConfig.basicInfo.tags" :key="tag" closable @close="removeTag(tag)">
                    {{ tag }}
                  </el-tag>
                </div>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- CP-02: 行为轨迹 -->
          <el-card class="config-card">
            <template #header>
              <div class="card-header">
                <span>📅 CP-02: 行为轨迹</span>
                <el-switch v-model="customerConfig.timeline.enabled" />
              </div>
            </template>
            
            <el-form :model="customerConfig.timeline" label-width="140px">
              <el-form-item label="时间线展示方式">
                <el-radio-group v-model="customerConfig.timeline.displayStyle">
                  <el-radio label="vertical">垂直时间线</el-radio>
                  <el-radio label="horizontal">横向时间线</el-radio>
                  <el-radio label="cards">卡片流</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item label="记录行为类型">
                <el-checkbox-group v-model="customerConfig.timeline.trackTypes">
                  <el-checkbox label="visit">网站访问</el-checkbox>
                  <el-checkbox label="download">资料下载</el-checkbox>
                  <el-checkbox label="inquiry">询盘提交</el-checkbox>
                  <el-checkbox label="call">电话记录</el-checkbox>
                  <el-checkbox label="meeting">拜访记录</el-checkbox>
                  <el-checkbox label="email">邮件往来</el-checkbox>
                  <el-checkbox label="wechat">微信沟通</el-checkbox>
                  <el-checkbox label="quote">报价记录</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              
              <el-form-item label="默认显示数量">
                <el-input-number v-model="customerConfig.timeline.defaultCount" :min="5" :max="100" />
              </el-form-item>
            </el-form>
          </el-card>

          <!-- CP-03: AI预测 -->
          <el-card class="config-card">
            <template #header>
              <div class="card-header">
                <span>🔮 CP-03: AI意向预测</span>
                <el-switch v-model="customerConfig.aiPrediction.enabled" />
              </div>
            </template>
            
            <el-form :model="customerConfig.aiPrediction" label-width="140px">
              <el-form-item label="意向评分模型">
                <el-radio-group v-model="customerConfig.aiPrediction.scoringModel">
                  <el-radio label="rule">规则引擎</el-radio>
                  <el-radio label="weighted">加权计算</el-radio>
                  <el-radio label="ml">机器学习模型</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item label="评分因素权重">
                <el-table :data="customerConfig.aiPrediction.scoringFactors" border>
                  <el-table-column prop="factor" label="因素" />
                  <el-table-column prop="weight" label="权重">
                    <template #default="scope">
                      <el-slider v-model="scope.row.weight" :min="0" :max="100" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="weight" label="权重值">
                    <template #default="scope">{{ scope.row.weight }}%</template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              
              <el-form-item label="风险标签配置">
                <el-button @click="openRiskLabelEditor" type="warning" plain>
                  <el-icon><Warning /></el-icon>
                  配置风险标签规则
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- CP-04: 推荐动作 -->
          <el-card class="config-card">
            <template #header>
              <div class="card-header">
                <span>💡 CP-04: AI推荐动作</span>
                <el-switch v-model="customerConfig.recommendedActions.enabled" />
              </div>
            </template>
            
            <el-form :model="customerConfig.recommendedActions" label-width="140px">
              <el-form-item label="推荐动作库">
                <el-button @click="openActionLibrary" type="primary">
                  <el-icon><List /></el-icon>
                  管理动作库
                </el-button>
              </el-form-item>
              
              <el-form-item label="最大推荐数">
                <el-input-number v-model="customerConfig.recommendedActions.maxRecommendations" :min="1" :max="10" />
              </el-form-item>
            </el-form>
          </el-card>

          <!-- CP-05: CRM集成 -->
          <el-card class="config-card">
            <template #header>
              <div class="card-header">
                <span>🔗 CP-05: CRM快速操作</span>
                <el-switch v-model="customerConfig.quickActions.enabled" />
              </div>
            </template>
            
            <el-form :model="customerConfig.quickActions" label-width="140px">
              <el-form-item label="集成CRM系统">
                <el-select v-model="customerConfig.quickActions.crmSystem" placeholder="选择CRM系统">
                  <el-option label="微信企业号" value="wechat" />
                  <el-option label="钉钉" value="dingtalk" />
                  <el-option label="纷享销客" value="fxiaoke" />
                  <el-option label="销售易" value="xiaoshouyi" />
                  <el-option label="自定义" value="custom" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="快速操作按钮">
                <el-checkbox-group v-model="customerConfig.quickActions.buttons">
                  <el-checkbox label="call">拨打电话</el-checkbox>
                  <el-checkbox label="email">发送邮件</el-checkbox>
                  <el-checkbox label="wechat">微信联系</el-checkbox>
                  <el-checkbox label="meeting">安排拜访</el-checkbox>
                  <el-checkbox label="quote">发送报价</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- Tab 3: 商机管理配置 -->
      <el-tab-pane label="💼 商机管理配置" name="opportunity">
        <div class="config-section">
          <h3>商机管理配置</h3>
          
          <!-- OP-01: 商机信息 -->
          <el-card class="config-card">
            <template #header>
              <div class="card-header">
                <span>💰 OP-01: 商机信息</span>
                <el-switch v-model="opportunityConfig.basicInfo.enabled" />
              </div>
            </template>
            
            <el-form :model="opportunityConfig.basicInfo" label-width="140px">
              <el-form-item label="商机阶段配置">
                <el-button @click="openOpportunityStageEditor" type="primary">
                  <el-icon><Edit /></el-icon>
                  编辑商机阶段
                </el-button>
                <el-table :data="opportunityConfig.basicInfo.stages" border class="mt-3">
                  <el-table-column prop="name" label="阶段名称" />
                  <el-table-column prop="defaultWinRate" label="默认赢率">
                    <template #default="scope">
                      <el-input-number v-model="scope.row.defaultWinRate" :min="0" :max="100" size="small" />%
                    </template>
                  </el-table-column>
                  <el-table-column prop="color" label="颜色">
                    <template #default="scope">
                      <el-color-picker v-model="scope.row.color" size="small" />
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="80">
                    <template #default="scope">
                      <el-button link type="danger" @click="removeStage(scope.$index)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              
              <el-form-item label="必填字段">
                <el-checkbox-group v-model="opportunityConfig.basicInfo.requiredFields">
                  <el-checkbox label="name">商机名称</el-checkbox>
                  <el-checkbox label="customer">客户名称</el-checkbox>
                  <el-checkbox label="amount">预计金额</el-checkbox>
                  <el-checkbox label="stage">商机阶段</el-checkbox>
                  <el-checkbox label="closeDate">预计成交日期</el-checkbox>
                  <el-checkbox label="probability">赢率</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- OP-02: 决策链 -->
          <el-card class="config-card">
            <template #header>
              <div class="card-header">
                <span>👥 OP-02: 决策链管理</span>
                <el-switch v-model="opportunityConfig.decisionChain.enabled" />
              </div>
            </template>
            
            <el-form :model="opportunityConfig.decisionChain" label-width="140px">
              <el-form-item label="角色类型配置">
                <el-button @click="openRoleEditor" type="primary" plain>
                  <el-icon><UserFilled /></el-icon>
                  配置决策角色
                </el-button>
                <div class="role-preview">
                  <el-tag v-for="role in opportunityConfig.decisionChain.roles" :key="role" class="mr-2">
                    {{ role }}
                  </el-tag>
                </div>
              </el-form-item>
              
              <el-form-item label="触达状态">
                <el-checkbox-group v-model="opportunityConfig.decisionChain.contactStatus">
                  <el-checkbox label="not_contacted">未触达</el-checkbox>
                  <el-checkbox label="initial_contact">初次接触</el-checkbox>
                  <el-checkbox label="building_relationship">关系建立中</el-checkbox>
                  <el-checkbox label="strong_support">强力支持</el-checkbox>
                  <el-checkbox label="neutral">中立</el-checkbox>
                  <el-checkbox label="opposition">反对</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- OP-03: AI推荐 -->
          <el-card class="config-card">
            <template #header>
              <div class="card-header">
                <span>🤖 OP-03: AI推荐下一步</span>
                <el-switch v-model="opportunityConfig.aiRecommendation.enabled" />
              </div>
            </template>
            
            <el-form :model="opportunityConfig.aiRecommendation" label-width="140px">
              <el-form-item label="推荐策略">
                <el-radio-group v-model="opportunityConfig.aiRecommendation.strategy">
                  <el-radio label="stage_based">基于阶段</el-radio>
                  <el-radio label="behavior_based">基于行为</el-radio>
                  <el-radio label="ml_based">机器学习</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item label="推荐动作库">
                <el-button @click="openNextActionLibrary" type="primary">
                  <el-icon><Management /></el-icon>
                  管理推荐动作
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- Tab 4: 自动化流程配置 -->
      <el-tab-pane label="⚙️ 自动化流程配置" name="workflow">
        <div class="config-section">
          <h3>自动化工作流配置</h3>
          
          <el-card class="config-card">
            <template #header>
              <div class="card-header">
                <span>🔄 6步自动化流程</span>
                <el-switch v-model="workflowConfig.enabled" />
              </div>
            </template>
            
            <el-form :model="workflowConfig" label-width="140px">
              <!-- WF-01: 线索捕获 -->
              <el-divider content-position="left">WF-01: 新线索捕获</el-divider>
              <el-form-item label="数据源配置">
                <el-checkbox-group v-model="workflowConfig.leadCapture.sources">
                  <el-checkbox label="website">官网表单</el-checkbox>
                  <el-checkbox label="wechat">微信公众号</el-checkbox>
                  <el-checkbox label="email">邮件询盘</el-checkbox>
                  <el-checkbox label="phone">电话来电</el-checkbox>
                  <el-checkbox label="exhibition">展会扫码</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              
              <el-form-item label="自动分配规则">
                <el-radio-group v-model="workflowConfig.leadCapture.assignRule">
                  <el-radio label="round_robin">轮询分配</el-radio>
                  <el-radio label="region">按区域</el-radio>
                  <el-radio label="product">按产品线</el-radio>
                  <el-radio label="workload">按工作负载</el-radio>
                </el-radio-group>
              </el-form-item>

              <!-- WF-02: ID归一化 -->
              <el-divider content-position="left">WF-02: 客户ID归一化</el-divider>
              <el-form-item label="匹配规则">
                <el-checkbox-group v-model="workflowConfig.idUnification.matchRules">
                  <el-checkbox label="phone">手机号</el-checkbox>
                  <el-checkbox label="email">邮箱</el-checkbox>
                  <el-checkbox label="company">公司名称</el-checkbox>
                  <el-checkbox label="wechat">微信OpenID</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              
              <el-form-item label="重复处理">
                <el-radio-group v-model="workflowConfig.idUnification.duplicateHandling">
                  <el-radio label="merge">自动合并</el-radio>
                  <el-radio label="manual">人工确认</el-radio>
                  <el-radio label="keep_both">保留两者</el-radio>
                </el-radio-group>
              </el-form-item>

              <!-- WF-03: AI分析 -->
              <el-divider content-position="left">WF-03: AI自动分析</el-divider>
              <el-form-item label="分析维度">
                <el-checkbox-group v-model="workflowConfig.aiAnalysis.dimensions">
                  <el-checkbox label="intent">意向评分</el-checkbox>
                  <el-checkbox label="winrate">赢率预测</el-checkbox>
                  <el-checkbox label="risk">风险识别</el-checkbox>
                  <el-checkbox label="value">客户价值</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              
              <el-form-item label="分析频率">
                <el-radio-group v-model="workflowConfig.aiAnalysis.frequency">
                  <el-radio label="realtime">实时（行为触发）</el-radio>
                  <el-radio label="hourly">每小时</el-radio>
                  <el-radio label="daily">每日一次</el-radio>
                </el-radio-group>
              </el-form-item>

              <!-- WF-04: 推荐生成 -->
              <el-divider content-position="left">WF-04: 推荐行动生成</el-divider>
              <el-form-item label="推荐引擎">
                <el-radio-group v-model="workflowConfig.recommendation.engine">
                  <el-radio label="rule">规则引擎</el-radio>
                  <el-radio label="collaborative">协同过滤</el-radio>
                  <el-radio label="ml">机器学习</el-radio>
                </el-radio-group>
              </el-form-item>

              <!-- WF-05: 半自动执行 -->
              <el-divider content-position="left">WF-05: 半自动执行</el-divider>
              <el-form-item label="人工确认类型">
                <el-checkbox-group v-model="workflowConfig.semiAuto.requireConfirm">
                  <el-checkbox label="high_value">高价值商机（>10万）</el-checkbox>
                  <el-checkbox label="sensitive">敏感操作</el-checkbox>
                  <el-checkbox label="new_customer">新客户首次接触</el-checkbox>
                  <el-checkbox label="risk">风险客户</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              
              <el-form-item label="自动执行类型">
                <el-checkbox-group v-model="workflowConfig.semiAuto.autoExecute">
                  <el-checkbox label="email">发送邮件</el-checkbox>
                  <el-checkbox label="reminder">提醒通知</el-checkbox>
                  <el-checkbox label="log">记录日志</el-checkbox>
                  <el-checkbox label="tag">打标签</el-checkbox>
                </el-checkbox-group>
              </el-form-item>

              <!-- WF-06: 反馈闭环 -->
              <el-divider content-position="left">WF-06: 行为反馈闭环</el-divider>
              <el-form-item label="反馈收集">
                <el-checkbox-group v-model="workflowConfig.feedback.collectTypes">
                  <el-checkbox label="confirm">确认/拒绝</el-checkbox>
                  <el-checkbox label="result">执行结果</el-checkbox>
                  <el-checkbox label="customer_response">客户反馈</el-checkbox>
                  <el-checkbox label="manual_adjust">人工调整</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              
              <el-form-item label="模型再训练">
                <el-radio-group v-model="workflowConfig.feedback.retrainFrequency">
                  <el-radio label="daily">每日</el-radio>
                  <el-radio label="weekly">每周</el-radio>
                  <el-radio label="monthly">每月</el-radio>
                  <el-radio label="manual">手动触发</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- Tab 5: 待办任务配置 -->
      <el-tab-pane label="📝 待办任务配置" name="tasks">
        <div class="config-section">
          <h3>待办任务系统配置</h3>
          
          <el-card class="config-card">
            <template #header>
              <div class="card-header">
                <span>✅ 任务管理配置</span>
                <el-switch v-model="taskConfig.enabled" />
              </div>
            </template>
            
            <el-form :model="taskConfig" label-width="140px">
              <el-form-item label="任务来源">
                <el-checkbox-group v-model="taskConfig.sources">
                  <el-checkbox label="ai">AI自动生成</el-checkbox>
                  <el-checkbox label="manual">销售手动创建</el-checkbox>
                  <el-checkbox label="workflow">工作流触发</el-checkbox>
                  <el-checkbox label="reminder">提醒转任务</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              
              <el-form-item label="优先级规则">
                <el-button @click="openPriorityRuleEditor" type="primary" plain>
                  <el-icon><Sort /></el-icon>
                  配置优先级规则
                </el-button>
              </el-form-item>
              
              <el-form-item label="任务状态">
                <el-tag v-for="status in taskConfig.statuses" :key="status.value" :type="status.type" class="mr-2">
                  {{ status.label }}
                </el-tag>
              </el-form-item>
              
              <el-form-item label="任务提醒">
                <el-checkbox-group v-model="taskConfig.reminders">
                  <el-checkbox label="desktop">桌面通知</el-checkbox>
                  <el-checkbox label="email">邮件提醒</el-checkbox>
                  <el-checkbox label="wechat">微信消息</el-checkbox>
                  <el-checkbox label="sms">短信提醒</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              
              <el-form-item label="逾期处理">
                <el-radio-group v-model="taskConfig.overdueHandling">
                  <el-radio label="escalate">升级上级</el-radio>
                  <el-radio label="reassign">重新分配</el-radio>
                  <el-radio label="notify">仅通知</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- Tab 6: 系统设置 -->
      <el-tab-pane label="⚙️ 系统设置" name="settings">
        <div class="config-section">
          <h3>系统全局设置</h3>
          
          <el-card class="config-card">
            <template #header>
              <div class="card-header">
                <span>🎨 界面设置</span>
              </div>
            </template>
            
            <el-form :model="systemSettings" label-width="140px">
              <el-form-item label="系统名称">
                <el-input v-model="systemSettings.systemName" placeholder="明升AICRM" />
              </el-form-item>
              
              <el-form-item label="系统Logo">
                <el-upload
                  class="logo-uploader"
                  action="#"
                  :show-file-list="false"
                  :auto-upload="false"
                  :on-change="handleLogoUpload">
                  <img v-if="systemSettings.logoUrl" :src="systemSettings.logoUrl" class="logo-preview" />
                  <el-icon v-else class="logo-uploader-icon"><Plus /></el-icon>
                </el-upload>
              </el-form-item>
              
              <el-form-item label="主题色">
                <el-color-picker v-model="systemSettings.primaryColor" show-alpha />
              </el-form-item>
              
              <el-form-item label="语言">
                <el-radio-group v-model="systemSettings.language">
                  <el-radio label="zh-CN">简体中文</el-radio>
                  <el-radio label="en-US">English</el-radio>
                  <el-radio label="zh-TW">繁體中文</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form>
          </el-card>

          <el-card class="config-card">
            <template #header>
              <div class="card-header">
                <span>🔧 功能设置</span>
              </div>
            </template>
            
            <el-form :model="systemSettings" label-width="140px">
              <el-form-item label="数据保留期">
                <el-input-number v-model="systemSettings.dataRetentionDays" :min="30" :max="3650" />
                <span class="unit-label">天</span>
              </el-form-item>
              
              <el-form-item label="备份频率">
                <el-radio-group v-model="systemSettings.backupFrequency">
                  <el-radio label="daily">每日</el-radio>
                  <el-radio label="weekly">每周</el-radio>
                  <el-radio label="monthly">每月</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item label="导出格式">
                <el-checkbox-group v-model="systemSettings.exportFormats">
                  <el-checkbox label="excel">Excel (.xlsx)</el-checkbox>
                  <el-checkbox label="csv">CSV</el-checkbox>
                  <el-checkbox label="pdf">PDF</el-checkbox>
                  <el-checkbox label="json">JSON</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </el-card>

          <el-card class="config-card">
            <template #header>
              <div class="card-header">
                <span>🔗 集成设置</span>
              </div>
            </template>
            
            <el-form :model="systemSettings.integrations" label-width="140px">
              <el-form-item label="CRM系统">
                <el-select v-model="systemSettings.integrations.crm" placeholder="选择CRM系统">
                  <el-option label="微信企业号" value="wechat" />
                  <el-option label="钉钉" value="dingtalk" />
                  <el-option label="纷享销客" value="fxiaoke" />
                  <el-option label="销售易" value="xiaoshouyi" />
                  <el-option label="自定义" value="custom" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="邮件服务">
                <el-select v-model="systemSettings.integrations.email" placeholder="选择邮件服务">
                  <el-option label="腾讯企业邮箱" value="tencent" />
                  <el-option label="阿里企业邮箱" value="aliyun" />
                  <el-option label="网易企业邮箱" value="163" />
                  <el-option label="SMTP自定义" value="smtp" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="数据云平台">
                <el-select v-model="systemSettings.integrations.dataCloud" placeholder="选择数据云">
                  <el-option label="神策数据" value="sensorsdata" />
                  <el-option label="GrowingIO" value="growingio" />
                  <el-option label="诸葛IO" value="zhugeio" />
                  <el-option label="自建" value="custom" />
                </el-select>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 底部操作栏 -->
    <div class="footer-actions">
      <el-button @click="resetConfig" size="large">
        <el-icon><RefreshLeft /></el-icon>
        重置配置
      </el-button>
      <el-button type="primary" @click="saveConfig" size="large" :loading="saving">
        <el-icon><Select /></el-icon>
        保存配置
      </el-button>
      <el-button type="success" @click="previewFrontend" size="large">
        <el-icon><View /></el-icon>
        预览前台
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('dashboard')
const saving = ref(false)
const newCategory = ref('')

// 智能看板配置
const dashboardConfig = reactive({
  opportunityOverview: {
    enabled: true,
    title: '商机总览',
    displayFields: ['count', 'amount', 'percentage', 'trend']
  },
  aiWinRate: {
    enabled: true,
    modelType: 'lightweight',
    accuracyTarget: 87,
    factors: [
      { name: '决策链触达率', weight: 25 },
      { name: '客户活跃度', weight: 20 },
      { name: '历史成交率', weight: 20 },
      { name: '商机金额', weight: 15 },
      { name: '竞争强度', weight: 10 },
      { name: '时间周期', weight: 10 }
    ]
  },
  customerActivity: {
    enabled: true,
    refreshInterval: 30,
    displayCount: 10,
    activityTypes: ['visit', 'download', 'inquiry', 'call', 'meeting', 'email']
  },
  aiTasks: {
    enabled: true,
    algorithm: 'score',
    dailyLimit: 20,
    confirmRateTarget: 92,
    priorityFactors: [
      { factor: '商机价值', weight: 30 },
      { factor: '成交紧迫度', weight: 25 },
      { factor: '客户活跃度', weight: 20 },
      { factor: '历史响应率', weight: 15 },
      { factor: '竞争态势', weight: 10 }
    ]
  },
  kpiPanel: {
    enabled: true,
    kpis: [
      { name: '线索转化率', target: '28%', warningThreshold: 25, enabled: true },
      { name: '触达效率', target: '92%', warningThreshold: 85, enabled: true },
      { name: '任务完成率', target: '85%', warningThreshold: 75, enabled: true },
      { name: '平均响应时间', target: '12分钟', warningThreshold: 20, enabled: true },
      { name: '本月新增商机', target: '45个', warningThreshold: 30, enabled: true },
      { name: '预计本月成交', target: '¥230万', warningThreshold: 200, enabled: true }
    ]
  }
})

// 客户360°配置
const customerConfig = reactive({
  basicInfo: {
    enabled: true,
    requiredFields: ['name', 'phone', 'company'],
    tags: ['A类客户', 'B类客户', 'C类客户', '新客户', '老客户', '高价值', '潜力客户', '流失风险']
  },
  timeline: {
    enabled: true,
    displayStyle: 'vertical',
    trackTypes: ['visit', 'download', 'inquiry', 'call', 'meeting', 'email', 'wechat', 'quote'],
    defaultCount: 20
  },
  aiPrediction: {
    enabled: true,
    scoringModel: 'weighted',
    scoringFactors: [
      { factor: '访问频次', weight: 20 },
      { factor: '资料下载', weight: 15 },
      { factor: '询盘次数', weight: 25 },
      { factor: '沟通深度', weight: 20 },
      { factor: '决策链完整度', weight: 15 },
      { factor: '响应速度', weight: 5 }
    ]
  },
  recommendedActions: {
    enabled: true,
    maxRecommendations: 5
  },
  quickActions: {
    enabled: true,
    crmSystem: 'wechat',
    buttons: ['call', 'email', 'wechat', 'meeting', 'quote']
  }
})

// 商机管理配置
const opportunityConfig = reactive({
  basicInfo: {
    enabled: true,
    stages: [
      { name: '初步接触', defaultWinRate: 10, color: '#909399' },
      { name: '需求确认', defaultWinRate: 25, color: '#E6A23C' },
      { name: '方案报价', defaultWinRate: 50, color: '#409EFF' },
      { name: '商务谈判', defaultWinRate: 75, color: '#67C23A' },
      { name: '合同签订', defaultWinRate: 95, color: '#F56C6C' }
    ],
    requiredFields: ['name', 'customer', 'amount', 'stage', 'closeDate']
  },
  decisionChain: {
    enabled: true,
    roles: ['决策者', '影响者', '使用者', '技术把关', '财务审批', '采购执行'],
    contactStatus: ['not_contacted', 'initial_contact', 'building_relationship', 'strong_support', 'neutral', 'opposition']
  },
  aiRecommendation: {
    enabled: true,
    strategy: 'behavior_based'
  }
})

// 自动化流程配置
const workflowConfig = reactive({
  enabled: true,
  leadCapture: {
    sources: ['website', 'wechat', 'email', 'phone'],
    assignRule: 'round_robin'
  },
  idUnification: {
    matchRules: ['phone', 'email', 'company'],
    duplicateHandling: 'merge'
  },
  aiAnalysis: {
    dimensions: ['intent', 'winrate', 'risk', 'value'],
    frequency: 'realtime'
  },
  recommendation: {
    engine: 'rule'
  },
  semiAuto: {
    requireConfirm: ['high_value', 'sensitive', 'new_customer'],
    autoExecute: ['email', 'reminder', 'log', 'tag']
  },
  feedback: {
    collectTypes: ['confirm', 'result', 'customer_response', 'manual_adjust'],
    retrainFrequency: 'weekly'
  }
})

// 任务配置
const taskConfig = reactive({
  enabled: true,
  sources: ['ai', 'manual', 'workflow', 'reminder'],
  statuses: [
    { label: '待确认', value: 'pending', type: 'info' },
    { label: '进行中', value: 'in_progress', type: 'warning' },
    { label: '已完成', value: 'completed', type: 'success' },
    { label: '已取消', value: 'cancelled', type: 'danger' }
  ],
  reminders: ['desktop', 'email', 'wechat'],
  overdueHandling: 'escalate'
})

// 系统设置
const systemSettings = reactive({
  systemName: '明升AICRM智能助手',
  logoUrl: '',
  primaryColor: '#667eea',
  language: 'zh-CN',
  dataRetentionDays: 365,
  backupFrequency: 'daily',
  exportFormats: ['excel', 'csv', 'pdf'],
  integrations: {
    crm: 'wechat',
    email: 'tencent',
    dataCloud: 'sensorsdata'
  }
})

// 加载配置
const loadConfig = () => {
  const saved = localStorage.getItem('mingsheng_aicrm_config')
  if (saved) {
    const config = JSON.parse(saved)
    Object.assign(dashboardConfig, config.dashboard || {})
    Object.assign(customerConfig, config.customer || {})
    Object.assign(opportunityConfig, config.opportunity || {})
    Object.assign(workflowConfig, config.workflow || {})
    Object.assign(taskConfig, config.task || {})
    Object.assign(systemSettings, config.system || {})
  }
}

// 保存配置
const saveConfig = async () => {
  saving.value = true
  try {
    const config = {
      dashboard: dashboardConfig,
      customer: customerConfig,
      opportunity: opportunityConfig,
      workflow: workflowConfig,
      task: taskConfig,
      system: systemSettings
    }
    localStorage.setItem('mingsheng_aicrm_config', JSON.stringify(config))
    
    // 模拟API保存
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('配置保存成功！')
  } catch (error) {
    ElMessage.error('保存失败：' + error.message)
  } finally {
    saving.value = false
  }
}

// 重置配置
const resetConfig = () => {
  ElMessageBox.confirm('确定要重置所有配置吗？此操作不可恢复！', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    localStorage.removeItem('mingsheng_aicrm_config')
    location.reload()
  })
}

// 预览前台
const previewFrontend = () => {
  router.push('/mingsheng-aicrm')
}

// 辅助函数（暂时为空，后续可扩展）
const openStageEditor = () => { ElMessage.info('商机阶段编辑器开发中...') }
const openKpiEditor = () => { ElMessage.info('KPI编辑器开发中...') }
const openTagLibrary = () => { ElMessage.info('标签库管理开发中...') }
const openRiskLabelEditor = () => { ElMessage.info('风险标签编辑器开发中...') }
const openActionLibrary = () => { ElMessage.info('动作库管理开发中...') }
const openOpportunityStageEditor = () => { ElMessage.info('商机阶段编辑器开发中...') }
const openRoleEditor = () => { ElMessage.info('角色编辑器开发中...') }
const openNextActionLibrary = () => { ElMessage.info('推荐动作库开发中...') }
const openPriorityRuleEditor = () => { ElMessage.info('优先级规则编辑器开发中...') }
const handleLogoUpload = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    systemSettings.logoUrl = e.target.result
  }
  reader.readAsDataURL(file.raw)
}
const removeTag = (tag) => {
  const index = customerConfig.basicInfo.tags.indexOf(tag)
  if (index > -1) {
    customerConfig.basicInfo.tags.splice(index, 1)
  }
}
const removeStage = (index) => {
  opportunityConfig.basicInfo.stages.splice(index, 1)
}

onMounted(() => {
  loadConfig()
})
</script>

<style scoped>
.aicrm-manage {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 60px);
}

.page-header-content {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
}

.management-tabs {
  margin-top: 20px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.config-section h3 {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #303133;
  padding-bottom: 10px;
  border-bottom: 2px solid #409EFF;
}

.config-card {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.accuracy-label,
.unit-label {
  margin-left: 10px;
  color: #606266;
  font-weight: 500;
}

.mt-2 {
  margin-top: 8px;
}

.mt-3 {
  margin-top: 12px;
}

.mr-2 {
  margin-right: 8px;
}

.hint {
  margin-left: 10px;
  font-size: 12px;
  color: #909399;
}

.training-stats {
  display: flex;
  gap: 40px;
  margin-top: 16px;
}

.tag-preview,
.role-preview {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.logo-uploader {
  display: inline-block;
}

.logo-preview {
  width: 120px;
  height: 120px;
  object-fit: contain;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  padding: 10px;
}

.logo-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.logo-uploader-icon:hover {
  border-color: #409EFF;
  color: #409EFF;
}

.footer-actions {
  position: sticky;
  bottom: 0;
  background: white;
  padding: 20px;
  border-top: 1px solid #e4e7ed;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  border-radius: 8px;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
}
</style>
