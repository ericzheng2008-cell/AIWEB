<template>
  <div class="equipment-lifecycle">
    <Header />
    
    <div class="page-container">
      <!-- 智能决策中心 - 头部 -->
      <div class="intelligence-header">
        <div class="header-content">
          <div class="header-left">
            <div class="brain-icon">
              <el-icon :size="48"><TrendCharts /></el-icon>
            </div>
            <div class="header-text">
              <h1>设备与工具运营大脑</h1>
              <p class="tagline">数据驱动决策 · 把一次性卖设备，变成持续帮客户赚钱</p>
              <div class="core-value">
                <el-tag type="success" effect="dark">延寿降本</el-tag>
                <el-tag type="warning" effect="dark">风险前移</el-tag>
                <el-tag type="primary" effect="dark">国产化替代</el-tag>
                <el-tag type="danger" effect="dark">年包服务</el-tag>
                <el-tag type="info" effect="dark">集团复制</el-tag>
              </div>
            </div>
          </div>
          <div class="header-right">
            <el-button @click="goHome" type="success" size="large" class="home-btn">
              <el-icon><HomeFilled /></el-icon>
              返回主页
            </el-button>
            <el-button type="primary" size="large" @click="goToDashboard" class="dashboard-btn">
              <el-icon><Monitor /></el-icon>
              3D数字驾驶舱
            </el-button>
          </div>
        </div>
      </div>

      <!-- 六层决策架构可视化 -->
      <div class="decision-architecture">
        <h2 class="section-title">
          <el-icon><Connection /></el-icon>
          六层垂直决策架构
        </h2>
        <div class="architecture-flow">
          <div class="arch-layer" v-for="(layer, index) in architectureLayers" :key="index">
            <div class="layer-number">{{ index + 1 }}</div>
            <div class="layer-content" :style="{borderColor: layer.color}">
              <div class="layer-header" :style="{background: layer.color}">
                <el-icon :size="24"><component :is="layer.icon" /></el-icon>
                <h3>{{ layer.title }}</h3>
              </div>
              <div class="layer-body">
                <p class="layer-desc">{{ layer.desc }}</p>
                <div class="layer-metrics">
                  <div class="metric-item" v-for="metric in layer.metrics" :key="metric.label">
                    <span class="metric-label">{{ metric.label }}</span>
                    <span class="metric-value">{{ metric.value }}</span>
                  </div>
                </div>
              </div>
            </div>
            <el-icon v-if="index < architectureLayers.length - 1" :size="24" class="flow-arrow">
              <ArrowDown />
            </el-icon>
          </div>
        </div>
      </div>

      <!-- 5大确定性抓手 -->
      <div class="five-handles-section">
        <h2 class="section-title">
          <el-icon><Star /></el-icon>
          5大确定性降本增效抓手
        </h2>
        <div class="handles-grid">
          <div 
            v-for="(handle, index) in fiveHandles" 
            :key="index"
            class="handle-card"
            @click="activeHandle = index"
            :class="{active: activeHandle === index}">
            <div class="handle-number">{{ index + 1 }}</div>
            <div class="handle-icon" :style="{background: handle.gradient}">
              <el-icon :size="36"><component :is="handle.icon" /></el-icon>
            </div>
            <h3>{{ handle.title }}</h3>
            <p class="handle-slogan">{{ handle.slogan }}</p>
            <div class="handle-stats">
              <div class="stat-box">
                <div class="stat-value">{{ handle.stats.saving }}</div>
                <div class="stat-label">预估年降本</div>
              </div>
              <div class="stat-box">
                <div class="stat-value">{{ handle.stats.risk }}</div>
                <div class="stat-label">风险降低</div>
              </div>
            </div>
            <el-button 
              type="primary" 
              text 
              class="handle-action"
              @click.stop="openHandleDetail(index)">
              查看详情 <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>
      </div>

      <!-- 核心决策模块矩阵 -->
      <div class="decision-matrix-section">
        <h2 class="section-title">
          <el-icon><Grid /></el-icon>
          智能决策模块矩阵
        </h2>
        <div class="matrix-grid">
          <div 
            v-for="module in decisionModules" 
            :key="module.id"
            class="module-card">
            <div class="module-header">
              <div class="module-icon" :style="{background: module.color}">
                <el-icon :size="28"><component :is="module.icon" /></el-icon>
              </div>
              <div class="module-title">
                <h3>{{ module.name }}</h3>
                <span class="module-subtitle">{{ module.subtitle }}</span>
              </div>
            </div>
            <div class="module-body">
              <div class="core-function">
                <strong>核心功能:</strong>
                <p>{{ module.coreFunction }}</p>
              </div>
              <div class="value-statement">
                <strong>价值说明:</strong>
                <p>{{ module.value }}</p>
              </div>
              <div class="decision-output">
                <el-tag type="warning" size="small">决策输出</el-tag>
                <p class="output-text">"{{ module.decisionOutput }}"</p>
              </div>
            </div>
            <div class="module-footer">
              <el-button type="primary" size="small" @click="enterModule(module.id)">
                <el-icon><Right /></el-icon>
                进入模块
              </el-button>
              <el-button size="small" @click="viewModuleCase(module.id)">
                查看案例
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 客户最痛的5个问题 - 智能回答 -->
      <div class="pain-points-section">
        <h2 class="section-title">
          <el-icon><QuestionFilled /></el-icon>
          客户最痛的5个问题 - AI智能决策
        </h2>
        <p class="section-desc">生产、维修、采购、财务谁都说不清，智能体站在中间给答案</p>
        <div class="pain-points-grid">
          <div 
            v-for="(question, index) in painPoints" 
            :key="index"
            class="pain-point-card">
            <div class="question-header">
              <el-icon :size="32" color="#f5222d"><Warning /></el-icon>
              <h3>问题 {{ index + 1 }}</h3>
            </div>
            <div class="question-content">
              <p class="question-text">"{{ question.question }}"</p>
              <div class="stakeholders">
                <el-tag 
                  v-for="role in question.stakeholders" 
                  :key="role"
                  size="small"
                  type="info">
                  {{ role }}
                </el-tag>
              </div>
            </div>
            <div class="ai-answer">
              <div class="answer-label">
                <el-icon color="#52c41a"><CircleCheck /></el-icon>
                <strong>智能体决策</strong>
              </div>
              <p class="answer-text">{{ question.aiAnswer }}</p>
              <div class="answer-confidence">
                <span>决策置信度:</span>
                <el-progress 
                  :percentage="question.confidence" 
                  :color="getConfidenceColor(question.confidence)"
                  :stroke-width="8" />
              </div>
            </div>
            <el-button 
              type="primary" 
              class="get-decision-btn"
              @click="getDecisionForQuestion(index)">
              <el-icon><Cpu /></el-icon>
              获取实时决策
            </el-button>
          </div>
        </div>
      </div>

      <!-- 闭环数据流 -->
      <div class="data-loop-section">
        <h2 class="section-title">
          <el-icon><Refresh /></el-icon>
          闭环数据流:采集→监测→预测→决策→执行→优化
        </h2>
        <div class="loop-diagram">
          <div 
            v-for="(step, index) in dataLoopSteps" 
            :key="index"
            class="loop-step"
            :class="{active: activeLoopStep === index}"
            @mouseenter="activeLoopStep = index">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-icon" :style="{background: step.color}">
              <el-icon :size="32"><component :is="step.icon" /></el-icon>
            </div>
            <h3>{{ step.name }}</h3>
            <p>{{ step.desc }}</p>
            <div class="step-kpi">
              <div class="kpi-item">
                <span class="kpi-label">{{ step.kpi.label }}</span>
                <span class="kpi-value">{{ step.kpi.value }}</span>
              </div>
            </div>
            <el-icon 
              v-if="index < dataLoopSteps.length - 1"
              :size="24" 
              class="step-arrow"
              color="#1890ff">
              <ArrowRight />
            </el-icon>
          </div>
        </div>
      </div>

      <!-- 实战案例展示 -->
      <div class="case-studies-section">
        <h2 class="section-title">
          <el-icon><Trophy /></el-icon>
          实战案例 - 降本增效真实数据
        </h2>
        <p class="section-desc">真实项目案例，可量化ROI，可复制方案</p>
        <div class="cases-grid">
          <div 
            v-for="(caseItem, index) in realCases" 
            :key="index"
            class="case-card">
            <div class="case-image">
              <div class="case-image-placeholder" :style="{background: caseItem.bgGradient}">
                <el-icon :size="60"><Setting /></el-icon>
              </div>
              <div class="case-badge" :style="{background: caseItem.badgeColor}">
                {{ caseItem.savingPercent }}
              </div>
            </div>
            <div class="case-content">
              <h3>{{ caseItem.title }}</h3>
              <p class="case-desc">{{ caseItem.desc }}</p>
              <div class="case-metrics">
                <div class="case-metric">
                  <el-icon><Money /></el-icon>
                  <span>成本节约: <strong>{{ caseItem.costSaving }}</strong></span>
                </div>
                <div class="case-metric" v-if="caseItem.timeSaving">
                  <el-icon><Timer /></el-icon>
                  <span>周期缩短: <strong>{{ caseItem.timeSaving }}</strong></span>
                </div>
                <div class="case-metric">
                  <el-icon><DataLine /></el-icon>
                  <span>ROI: <strong>{{ caseItem.roi }}</strong></span>
                </div>
              </div>
              <el-button type="primary" text class="case-detail-btn" @click="viewCaseDetail(index)">
                查看完整案例 <el-icon><ArrowRight /></el-icon>
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 非标定制降本方案 -->
      <div class="custom-solutions-section">
        <h2 class="section-title">
          <el-icon><Setting /></el-icon>
          非标定制降本方案
        </h2>
        <p class="section-desc">导电嘴、密封件非标定制，成本降低60-70%</p>
        <div class="solutions-grid">
          <div 
            v-for="(solution, index) in customSolutions" 
            :key="index"
            class="solution-card">
            <div class="solution-icon" :style="{background: solution.gradient}">
              <el-icon :size="40"><component :is="solution.icon" /></el-icon>
            </div>
            <div class="solution-content">
              <h3>{{ solution.title }}</h3>
              <p class="solution-desc">{{ solution.desc }}</p>
              <ul class="solution-items">
                <li v-for="item in solution.items" :key="item">
                  <el-icon><Check /></el-icon>
                  {{ item }}
                </li>
              </ul>
              <div class="solution-stats">
                <div class="stat">
                  <span class="stat-label">成本降低</span>
                  <span class="stat-value">{{ solution.costReduction }}</span>
                </div>
                <div class="stat">
                  <span class="stat-label">交付周期</span>
                  <span class="stat-value">{{ solution.deliveryTime }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 利旧改造升级降本 -->
      <div class="retrofit-section">
        <h2 class="section-title">
          <el-icon><Tools /></el-icon>
          利旧改造升级降本
        </h2>
        <p class="section-desc">爱信物流载具、工控元件利旧翻新，成本20%对比原值</p>
        <div class="retrofit-grid">
          <div 
            v-for="(retrofit, index) in retrofitCases" 
            :key="index"
            class="retrofit-card">
            <div class="retrofit-image">
              <div class="retrofit-image-placeholder" :style="{background: retrofit.bgGradient}">
                <el-icon :size="50"><Box /></el-icon>
              </div>
              <div class="retrofit-tag">{{ retrofit.tag }}</div>
            </div>
            <div class="retrofit-content">
              <h3>{{ retrofit.title }}</h3>
              <p class="retrofit-subtitle">{{ retrofit.subtitle }}</p>
              <ul class="retrofit-features">
                <li v-for="feature in retrofit.features" :key="feature">
                  <el-icon><Check /></el-icon>
                  {{ feature }}
                </li>
              </ul>
              <div class="retrofit-result">
                <el-tag type="success" size="large">
                  成本 {{ retrofit.costSaving }} 对比原值
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 智能化拓展能力 - 六角形网格 -->
      <div class="intelligence-expansion-section">
        <h2 class="section-title">
          <el-icon><Expand /></el-icon>
          智能化拓展能力
        </h2>
        <p class="section-desc">自学习优化、多厂协同、移动端/AR支持</p>
        <div class="hexagon-grid">
          <div 
            v-for="(capability, index) in intelligenceCapabilities" 
            :key="index"
            class="hexagon-item"
            :class="{ active: activeCapability === index }"
            :style="{ animationDelay: `${index * 0.1}s` }">
            <div class="hexagon" :style="{background: capability.gradient}">
              <div class="hexagon-content">
                <el-icon :size="36"><component :is="capability.icon" /></el-icon>
                <h3>{{ capability.title }}</h3>
                <p>{{ capability.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 客户5大痛点 + AI智能决策(增强版) -->
      <div class="enhanced-pain-points-section">
        <h2 class="section-title">
          <el-icon><Warning /></el-icon>
          客户5大痛点 + AI智能决策
        </h2>
        <p class="section-desc">客户最痛苦的，不是设备坏，而是这5个决策问题</p>
        <div class="enhanced-pain-grid">
          <div 
            v-for="(pain, index) in enhancedPainPoints" 
            :key="index"
            class="enhanced-pain-card">
            <div class="pain-header">
              <el-icon :size="32" :style="{color: pain.color}"><component :is="pain.icon" /></el-icon>
              <h3>{{ pain.question }}</h3>
            </div>
            <div class="pain-body">
              <div class="pain-challenge">
                <strong>决策挑战:</strong>
                <p>{{ pain.challenge }}</p>
              </div>
              <div class="ai-decision">
                <strong>AI智能决策:</strong>
                <div class="decision-card" :style="{borderColor: pain.color}">
                  <p>{{ pain.aiAnswer }}</p>
                  <div class="confidence-meter">
                    <span class="confidence-label">决策置信度</span>
                    <el-progress 
                      :percentage="pain.confidence" 
                      :color="pain.color"
                      :stroke-width="12">
                    </el-progress>
                  </div>
                </div>
              </div>
              <el-button 
                type="primary" 
                size="small" 
                @click="generateDecision(index)"
                class="generate-btn">
                <el-icon><Cpu /></el-icon>
                重新生成决策
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 商业模式三层收费 -->
      <div class="business-model-section">
        <h2 class="section-title">
          <el-icon><Money /></el-icon>
          三层收费结构 - 从项目到平台
        </h2>
        <div class="pricing-layers">
          <div 
            v-for="(layer, index) in pricingLayers" 
            :key="index"
            class="pricing-layer">
            <div class="layer-badge">{{ layer.stage }}</div>
            <div class="layer-title">
              <el-icon :size="28"><component :is="layer.icon" /></el-icon>
              <h3>{{ layer.name }}</h3>
            </div>
            <div class="layer-services">
              <div 
                v-for="service in layer.services" 
                :key="service"
                class="service-item">
                <el-icon color="#52c41a"><Check /></el-icon>
                <span>{{ service }}</span>
              </div>
            </div>
            <div class="layer-value">
              <div class="value-item">
                <span class="value-label">年收入潜力:</span>
                <span class="value-number">{{ layer.revenue }}</span>
              </div>
              <div class="value-item">
                <span class="value-label">客户价值:</span>
                <span class="value-desc">{{ layer.customerValue }}</span>
              </div>
            </div>
            <el-button 
              type="primary" 
              size="large"
              class="consult-btn">
              {{ layer.cta }}
            </el-button>
          </div>
        </div>
      </div>

      <!-- 设备列表(简化) -->
      <div class="equipment-overview-section">
        <h2 class="section-title">
          <el-icon><Box /></el-icon>
          设备资产概览
        </h2>
        
        <!-- 核心KPI -->
        <div class="kpi-cards">
          <div class="kpi-card" style="background: linear-gradient(135deg, #1890ff, #36cfc9);">
            <el-icon :size="40" color="#fff"><Box /></el-icon>
            <div class="kpi-content">
              <div class="kpi-value">{{ equipmentStore.equipmentAssets.length }}</div>
              <div class="kpi-label">设备总数</div>
            </div>
          </div>
          
          <div class="kpi-card" style="background: linear-gradient(135deg, #52c41a, #73d13d);">
            <el-icon :size="40" color="#fff"><Money /></el-icon>
            <div class="kpi-content">
              <div class="kpi-value">¥{{ (equipmentStore.getTotalAssetValue / 10000).toFixed(0) }}万</div>
              <div class="kpi-label">资产总价值</div>
            </div>
          </div>
          
          <div class="kpi-card" style="background: linear-gradient(135deg, #faad14, #ffc53d);">
            <el-icon :size="40" color="#fff"><Warning /></el-icon>
            <div class="kpi-content">
              <div class="kpi-value">{{ equipmentStore.getMaintenanceDueEquipment.length }}</div>
              <div class="kpi-label">待保养设备</div>
            </div>
          </div>
          
          <div class="kpi-card" style="background: linear-gradient(135deg, #f5222d, #ff4d4f);">
            <el-icon :size="40" color="#fff"><CircleClose /></el-icon>
            <div class="kpi-content">
              <div class="kpi-value">{{ equipmentStore.getFaultyEquipment.length }}</div>
              <div class="kpi-label">故障设备</div>
            </div>
          </div>
        </div>

        <!-- 快速操作 -->
        <div class="quick-actions">
          <el-button type="primary" size="large" @click="activeTab = 'assets'">
            <el-icon><Document /></el-icon>
            查看设备档案
          </el-button>
          <el-button type="success" size="large" @click="activeTab = 'roi'">
            <el-icon><DataAnalysis /></el-icon>
            ROI分析
          </el-button>
          <el-button type="warning" size="large" @click="activeTab = 'maintenance'">
            <el-icon><Tools /></el-icon>
            保养预测
          </el-button>
          <el-button type="danger" size="large" @click="activeTab = 'cost'">
            <el-icon><PieChart /></el-icon>
            成本分析
          </el-button>
        </div>
      </div>

      <!-- 详细功能选项卡(折叠) -->
      <el-collapse v-model="activeCollapse" accordion class="detail-collapse">
        <el-collapse-item name="1">
          <template #title>
            <div class="collapse-title">
              <el-icon :size="24"><Document /></el-icon>
              <span>设备详细管理功能</span>
              <el-tag type="info" size="small">点击展开</el-tag>
            </div>
          </template>
          
          <el-tabs v-model="activeTab" class="feature-tabs">
            <!-- 设备档案 -->
            <el-tab-pane label="设备档案" name="assets">
              <div class="tab-content">
                <div class="toolbar">
                  <el-button type="primary" @click="showAddEquipmentDialog = true">
                    <el-icon><Plus /></el-icon> 新增设备
                  </el-button>
                  <div class="filter-group">
                    <el-select v-model="filterCategory" placeholder="设备类别" clearable style="width: 160px;">
                      <el-option 
                        v-for="cat in equipmentStore.getAllCategories" 
                        :key="cat.id" 
                        :label="cat.name['zh-CN']" 
                        :value="cat.id" />
                    </el-select>
                    <el-select v-model="filterStatus" placeholder="运行状态" clearable style="width: 140px;">
                      <el-option label="运行中" value="running" />
                      <el-option label="维护中" value="maintenance" />
                      <el-option label="故障" value="fault" />
                      <el-option label="闲置" value="idle" />
                    </el-select>
                    <el-input 
                      v-model="searchKeyword" 
                      placeholder="搜索设备名称/编号" 
                      clearable 
                      style="width: 200px;">
                      <template #prefix>
                        <el-icon><Search /></el-icon>
                      </template>
                    </el-input>
                  </div>
                </div>

                <div class="equipment-grid">
                  <div 
                    v-for="equipment in filteredEquipment" 
                    :key="equipment.id" 
                    class="equipment-card"
                    @click="viewEquipmentDetail(equipment)">
                    <div class="equipment-header">
                      <div class="equipment-category">
                        <el-icon :style="{color: equipmentStore.equipmentCategories[equipment.category]?.color}">
                          <component :is="equipmentStore.equipmentCategories[equipment.category]?.icon" />
                        </el-icon>
                        <span>{{ equipmentStore.equipmentCategories[equipment.category]?.name['zh-CN'] }}</span>
                      </div>
                      <el-tag 
                        :type="getStatusType(equipment.status)" 
                        size="small">
                        {{ getStatusText(equipment.status) }}
                      </el-tag>
                    </div>
                    
                    <h3 class="equipment-name">{{ equipment.name }}</h3>
                    <div class="equipment-info">
                      <div class="info-item">
                        <span class="label">型号:</span>
                        <span class="value">{{ equipment.model }}</span>
                      </div>
                      <div class="info-item">
                        <span class="label">位置:</span>
                        <span class="value">{{ equipment.location }}</span>
                      </div>
                    </div>

                    <div class="equipment-health">
                      <div class="health-label">设备健康度</div>
                      <el-progress 
                        :percentage="equipmentStore.getEquipmentHealth(equipment.id)" 
                        :color="getHealthColor(equipmentStore.getEquipmentHealth(equipment.id))"
                        :stroke-width="8" />
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <!-- ROI分析 -->
            <el-tab-pane label="ROI分析" name="roi">
              <div class="tab-content">
                <el-table :data="roiTableData" style="width: 100%">
                  <el-table-column prop="equipmentName" label="设备名称" min-width="150" />
                  <el-table-column prop="purchasePrice" label="购买价格(¥)" width="120" align="right">
                    <template #default="scope">
                      {{ scope.row.purchasePrice.toLocaleString() }}
                    </template>
                  </el-table-column>
                  <el-table-column prop="roi" label="ROI(%)" width="100" align="center">
                    <template #default="scope">
                      <el-tag :type="getRoiType(scope.row.roi)" size="small">
                        {{ scope.row.roi }}%
                      </el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-tab-pane>

            <!-- 保养预测 -->
            <el-tab-pane label="保养预测" name="maintenance">
              <div class="tab-content">
                <el-alert 
                  v-if="urgentMaintenanceCount > 0"
                  :title="`有 ${urgentMaintenanceCount} 个部件需要紧急保养！`"
                  type="error"
                  :closable="false"
                  show-icon
                  style="margin-bottom: 20px;" />
                
                <el-table :data="allMaintenancePredictions" style="width: 100%">
                  <el-table-column prop="urgency" label="紧急程度" width="100">
                    <template #default="scope">
                      <el-tag :type="getUrgencyType(scope.row.urgency)" size="small">
                        {{ getUrgencyText(scope.row.urgency) }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="equipmentName" label="设备名称" min-width="150" />
                  <el-table-column prop="componentName" label="部件名称" min-width="150" />
                  <el-table-column prop="nextMaintenance" label="计划保养日期" width="130" align="center" />
                </el-table>
              </div>
            </el-tab-pane>

            <!-- 成本分析 -->
            <el-tab-pane label="成本分析" name="cost">
              <div class="tab-content">
                <div class="cost-overview-grid">
                  <div 
                    v-for="equipment in equipmentStore.equipmentAssets" 
                    :key="equipment.id"
                    class="cost-card">
                    <h3>{{ equipment.name }}</h3>
                    <div class="cost-summary" v-if="getCostAnalysis(equipment.id)">
                      <div class="cost-item">
                        <span class="label">12个月总成本:</span>
                        <span class="value">¥{{ getCostAnalysis(equipment.id).totalCost.toLocaleString() }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-collapse-item>
      </el-collapse>
    </div>

    <Footer />

    <!-- 新增设备对话框 -->
    <el-dialog 
      v-model="showAddEquipmentDialog" 
      title="新增设备" 
      width="600px">
      <el-form :model="newEquipment" label-width="120px">
        <el-form-item label="设备名称" required>
          <el-input v-model="newEquipment.name" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备类别" required>
          <el-select v-model="newEquipment.category" placeholder="请选择设备类别" style="width: 100%">
            <el-option 
              v-for="cat in equipmentStore.getAllCategories" 
              :key="cat.id" 
              :label="cat.name['zh-CN']" 
              :value="cat.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="型号">
          <el-input v-model="newEquipment.model" placeholder="请输入设备型号" />
        </el-form-item>
        <el-form-item label="购买价格(¥)">
          <el-input-number v-model="newEquipment.purchasePrice" :min="0" :step="1000" style="width: 100%" />
        </el-form-item>
        <el-form-item label="安装位置">
          <el-input v-model="newEquipment.location" placeholder="请输入安装位置" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddEquipmentDialog = false">取消</el-button>
        <el-button type="primary" @click="addEquipment">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  Monitor, TrendCharts, Connection, Star, Grid, QuestionFilled,
  Warning, CircleCheck, Cpu, Refresh, Money, Box, ArrowRight,
  ArrowDown, Check, Right, Document, DataAnalysis, Tools,
  PieChart, Plus, Search, CircleClose, Trophy, Setting,
  Timer, DataLine, Switch, Expand, View, Iphone, HomeFilled
} from '@element-plus/icons-vue'
import { useEquipmentLifecycleStore } from '../store/equipmentLifecycle'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

const router = useRouter()
const equipmentStore = useEquipmentLifecycleStore()

// 返回主页
const goHome = () => {
  router.push('/')
  ElMessage.success('返回主页')
}

// 跳转到驾驶舱
const goToDashboard = () => {
  router.push('/equipment-dashboard')
}

// 查看案例详情
const viewCaseDetail = (index) => {
  ElMessage.success(`正在加载案例详情: ${realCases[index].title}`)
  console.log('查看案例详情:', realCases[index])
}

// 重新生成AI决策
const generateDecision = (index) => {
  // 随机生成新的置信度
  enhancedPainPoints[index].confidence = Math.floor(Math.random() * 20) + 80
  ElMessage.success('AI决策已重新生成')
}

// 当前激活项
const activeTab = ref('assets')
const activeHandle = ref(0)
const activeLoopStep = ref(0)
const activeCollapse = ref('')

// 六层架构
const architectureLayers = [
  {
    title: '感知层',
    desc: '传感器、PLC、IoT设备实时采集设备状态数据',
    icon: 'Cpu',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    metrics: [
      { label: '接入设备', value: '127台' },
      { label: '实时数据点', value: '3,542个' }
    ]
  },
  {
    title: '数据层',
    desc: '设备档案、维修记录、成本数据、使用强度统一存储',
    icon: 'Document',
    color: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
    metrics: [
      { label: '历史数据', value: '18个月' },
      { label: '数据完整度', value: '96.8%' }
    ]
  },
  {
    title: '智能分析层',
    desc: 'AI预测停线风险、延寿ROI、国产化可行性',
    icon: 'TrendCharts',
    color: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
    metrics: [
      { label: '预测准确率', value: '92.3%' },
      { label: '决策模型', value: '8套' }
    ]
  },
  {
    title: '决策层',
    desc: '输出"修/换/延寿/国产化"的具体方案与成本对比',
    icon: 'Connection',
    color: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)',
    metrics: [
      { label: '月度决策', value: '43条' },
      { label: '采纳率', value: '87%' }
    ]
  },
  {
    title: '可视化层',
    desc: '3D驾驶舱、移动端看板、决策报告自动生成',
    icon: 'Monitor',
    color: 'linear-gradient(135deg, #f5222d 0%, #ff4d4f 100%)',
    metrics: [
      { label: '实时看板', value: '5个' },
      { label: '月度报告', value: '自动' }
    ]
  },
  {
    title: '集团复制层',
    desc: '多工厂数据打通、策略复制、集团级降本',
    icon: 'Star',
    color: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
    metrics: [
      { label: '已复制工厂', value: '3家' },
      { label: '集团降本', value: '¥682万' }
    ]
  }
]

// 5大抓手
const fiveHandles = [
  {
    title: '延寿策略',
    slogan: '最隐蔽、但最暴力的降本',
    icon: 'TrendCharts',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    stats: { saving: '¥186万', risk: '-65%' }
  },
  {
    title: '停线风险前移',
    slogan: '真正的"增效"',
    icon: 'Warning',
    gradient: 'linear-gradient(135deg, #f5222d 0%, #ff4d4f 100%)',
    stats: { saving: '¥234万', risk: '-82%' }
  },
  {
    title: '国产化替代',
    slogan: '现金流发动机',
    icon: 'Connection',
    gradient: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
    stats: { saving: '¥328万', risk: '-25%' }
  },
  {
    title: '年包服务',
    slogan: '不确定成本变确定合同',
    icon: 'Money',
    gradient: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)',
    stats: { saving: '¥142万', risk: '-45%' }
  },
  {
    title: '集团复制',
    slogan: '降本不靠一个工厂',
    icon: 'Star',
    gradient: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
    stats: { saving: '¥682万', risk: '-70%' }
  }
]

// 决策模块
const decisionModules = [
  {
    id: 'lifespan-assessment',
    name: '延寿评估模块',
    subtitle: '设备寿命延长决策',
    icon: 'TrendCharts',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    coreFunction: '基于设备健康度、历史维修、使用强度，计算延寿6/12/24个月的成本差异',
    value: '帮客户避免过早报废，每台设备延寿12月可节省15-40万',
    decisionOutput: '该机器人建议延寿18个月，翻新成本¥12万，比新购节省¥38万'
  },
  {
    id: 'shutdown-risk',
    name: '停线风险预测',
    subtitle: '预防性决策系统',
    icon: 'Warning',
    color: 'linear-gradient(135deg, #f5222d 0%, #ff4d4f 100%)',
    coreFunction: '用历史数据+使用强度+维修记录，预测未来90天停线概率',
    value: '提前60天预警，避免突发停线损失，单次停线损失¥50-200万',
    decisionOutput: '该设备未来90天停线风险72%，建议30天内完成预防性维护'
  },
  {
    id: 'domestic-substitute',
    name: '国产化决策引擎',
    subtitle: '替代可行性分析',
    icon: 'Connection',
    color: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
    coreFunction: '兼容性评估、风险等级划分、试点→放量→批量复制',
    value: '单个零部件国产化成本降低40-70%，年省¥50-300万',
    decisionOutput: '该伺服电机可替代，试点3台，风险等级:低，年节省¥28万'
  },
  {
    id: 'service-package',
    name: '年包策略优化',
    subtitle: '年度服务方案设计',
    icon: 'Money',
    color: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)',
    coreFunction: '动态评估年包风险，调整策略(翻新/替换/国产)，保证你赚钱',
    value: '客户风险外包+预算可控，你获得稳定现金流+数据沉淀',
    decisionOutput: '建议年包价¥68万，策略:2台翻新+5个国产零件，预期利润¥22万'
  },
  {
    id: 'multi-factory',
    name: '集团复制系统',
    subtitle: '策略跨厂推广',
    icon: 'Star',
    color: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
    coreFunction: '一个工厂验证策略，自动生成其他工厂实施方案',
    value: '单工厂降本¥120万，复制到5个厂=¥600万集团级价值',
    decisionOutput: '南京厂策略可复制到武汉、成都厂，预计集团年降本¥682万'
  },
  {
    id: 'cost-breakdown',
    name: '成本拆解分析',
    subtitle: '多维成本透视',
    icon: 'PieChart',
    color: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
    coreFunction: '备件、人工、保养、维修四维拆解，找出成本黑洞',
    value: '精准定位高成本设备，针对性降本，ROI提升15-35%',
    decisionOutput: '该产线备件成本占比68%(异常)，建议国产化3类零件'
  },
  {
    id: 'health-monitor',
    name: '设备健康监测',
    subtitle: '实时状态追踪',
    icon: 'Monitor',
    color: 'linear-gradient(135deg, #13c2c2 0%, #36cfc9 100%)',
    coreFunction: '关键部件健康度实时计算，劣化趋势预测',
    value: '提前发现隐患，从"救火"变"防火"，维修成本降40%',
    decisionOutput: '焊钳电极健康度62%，预计30天后低于50%，需备货'
  },
  {
    id: 'roi-calculator',
    name: 'ROI智能计算',
    subtitle: '投资回报分析',
    icon: 'DataAnalysis',
    color: 'linear-gradient(135deg, #eb2f96 0%, #f759ab 100%)',
    coreFunction: '购买价、维护成本、产值、回本期四维计算',
    value: '辅助新设备采购决策，避免"买得起用不起"',
    decisionOutput: '该设备ROI 18.5%，回本期3.2年，建议采购'
  }
]

// 客户痛点
const painPoints = [
  {
    question: '这台设备还能不能再用1年？',
    stakeholders: ['生产经理', '设备主管', '财务总监'],
    aiAnswer: '基于健康度78%、历史维修频率、关键部件剩余寿命综合评估：可再用14个月，但需在第8个月更换伺服电机，预估成本¥3.2万。',
    confidence: 89
  },
  {
    question: '现在修，是不是浪费钱？',
    stakeholders: ['维修主管', '采购经理', '车间主任'],
    aiAnswer: '当前维修成本¥8万，如延期30天，停线风险提升至67%，停线损失¥120万。建议:立即维修，ROI=1400%。',
    confidence: 92
  },
  {
    question: '换国产，会不会影响节拍？',
    stakeholders: ['工艺工程师', '质量主管', '生产总监'],
    aiAnswer: '该零件已有3家工厂试点，节拍影响<2%，故障率持平。建议:批量替换，年降本¥28万。',
    confidence: 86
  },
  {
    question: '不换，会不会下个月直接停线？',
    stakeholders: ['生产计划', '设备工程师', 'GM'],
    aiAnswer: '未来30天停线概率:34%，60天:72%，90天:89%。建议:45天内完成更换，避免高峰期停线。',
    confidence: 91
  },
  {
    question: '今年预算到底够不够？',
    stakeholders: ['财务总监', '采购总监', '工厂厂长'],
    aiAnswer: '年度预算¥180万，当前支出¥127万，预测剩余需求¥68万，缺口¥15万。建议:调整3台设备延寿策略，可控制在预算内。',
    confidence: 88
  }
]

// 数据闭环步骤
const dataLoopSteps = [
  {
    name: '数据采集',
    desc: 'IoT实时采集设备运行数据',
    icon: 'Cpu',
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    kpi: { label: '数据点/秒', value: '3,542' }
  },
  {
    name: '状态监测',
    desc: '健康度、劣化趋势实时计算',
    icon: 'Monitor',
    color: 'linear-gradient(135deg, #1890ff 0%, #36cfc9 100%)',
    kpi: { label: '监测设备', value: '127台' }
  },
  {
    name: '预测分析',
    desc: 'AI预测故障、停线风险',
    icon: 'TrendCharts',
    color: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
    kpi: { label: '准确率', value: '92.3%' }
  },
  {
    name: '决策生成',
    desc: '输出修/换/延寿/国产化方案',
    icon: 'Connection',
    color: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)',
    kpi: { label: '月度决策', value: '43条' }
  },
  {
    name: '执行追踪',
    desc: '工单跟踪、效果验证',
    icon: 'Check',
    color: 'linear-gradient(135deg, #f5222d 0%, #ff4d4f 100%)',
    kpi: { label: '执行率', value: '87%' }
  },
  {
    name: 'KPI优化',
    desc: '成本、风险、ROI持续改进',
    icon: 'Refresh',
    color: 'linear-gradient(135deg, #722ed1 0%, #9254de 100%)',
    kpi: { label: '年降本', value: '¥682万' }
  }
]

// 实战案例数据
const realCases = [
  {
    title: '埃安二工厂七轴机器人设备翻新',
    desc: 'KUKA七轴机器人翻新项目，延寿24个月，恢复95%原装性能',
    bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    savingPercent: '成本节约 40%',
    badgeColor: '#67C23A',
    costSaving: '¥28万',
    roi: '投资回报 6个月',
    timeSaving: null
  },
  {
    title: '传祺焊装国产化替代',
    desc: '焊钳伺服电机国产化替代项目，性能稳定，供应链可控',
    bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    savingPercent: '成本降低 30%',
    badgeColor: '#409EFF',
    costSaving: '¥42万/年',
    timeSaving: '物流周期 50%',
    roi: '投资回报 4个月'
  },
  {
    title: '埃安三工厂焊钳改造',
    desc: '焊钳批量改造升级，提升可靠性，降低故障率',
    bgGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    savingPercent: '成本节约 45%',
    badgeColor: '#E6A23C',
    costSaving: '¥35万',
    roi: '投资回报 5个月',
    timeSaving: null
  }
]

// 非标定制方案
const customSolutions = [
  {
    title: '导电嘴非标定制',
    icon: 'Setting',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    desc: '根据焊接工艺定制导电嘴，延长使用寿命',
    items: [
      '材质优化: 铜合金 → 钨铜合金',
      '寿命提升: 2倍 → 5倍',
      '定制周期: 7-10天',
      '批量供应: 支持'
    ],
    costReduction: '60%',
    deliveryTime: '7-10天'
  },
  {
    title: '密封件非标定制',
    icon: 'Tools',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    desc: '液压、气动密封件按需定制',
    items: [
      '精确匹配: 尺寸/材质/硬度',
      '国产替代: 成本降低70%',
      '交付周期: 5-7天',
      '质量保证: 3个月质保'
    ],
    costReduction: '70%',
    deliveryTime: '5-7天'
  }
]

// 利旧改造案例
const retrofitCases = [
  {
    title: '爱信物流载具改造',
    subtitle: '变速箱旧托盘利旧改造',
    bgGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    tag: '利旧改造',
    features: [
      '承载能力升级: 500kg → 800kg',
      '结构优化: 轻量化设计',
      '按需生产: 定制尺寸',
      '成本优势: 对比新品节省80%'
    ],
    costSaving: '20%'
  },
  {
    title: '工控元件利旧升级',
    subtitle: '机器人控制器、伺服驱动器翻新',
    bgGradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    tag: '翻新升级',
    features: [
      '涵盖品牌: KUKA、ABB、FANUC',
      '核心部件更换: 主板/驱动板',
      '性能恢复: 95%+原装性能',
      '质保服务: 12个月'
    ],
    costSaving: '20%'
  }
]

// 智能化拓展能力
const intelligenceCapabilities = [
  {
    title: '自学习优化',
    icon: 'Cpu',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    desc: 'AI持续学习，决策越来越准'
  },
  {
    title: '多厂协同预测',
    icon: 'Connection',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    desc: '集团级数据共享，预测更精准'
  },
  {
    title: '移动端支持',
    icon: 'Iphone',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    desc: '手机/平板实时查看决策'
  },
  {
    title: 'AR辅助维修',
    icon: 'View',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    desc: 'AR眼镜指导现场维修'
  },
  {
    title: '智能合同辅助',
    icon: 'Document',
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    desc: '年包合同智能定价与风险评估'
  },
  {
    title: '供应链整合',
    icon: 'Connection',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    desc: '备件、物流、采购一体化'
  }
]

// 增强版客户痛点
const enhancedPainPoints = [
  {
    question: '这台设备还能不能再用1年？',
    icon: 'QuestionFilled',
    color: '#409EFF',
    challenge: '生产、维修、财务各执一词，缺乏数据支撑',
    aiAnswer: '基于历史故障率、使用强度、维修成本分析，该设备可安全运行8个月，建议第7个月启动翻新计划。预计翻新成本¥12万，可延寿24个月。',
    confidence: 89
  },
  {
    question: '现在修，是不是浪费钱？',
    icon: 'Money',
    color: '#67C23A',
    challenge: '维修成本 vs 停线损失，缺乏量化对比',
    aiAnswer: '立即维修成本¥8万，预计停线损失¥15万/天。若延迟维修，7天内停线概率达72%。建议立即维修，ROI回报期<2天。',
    confidence: 92
  },
  {
    question: '换国产，会不会影响节拍？',
    icon: 'Switch',
    color: '#E6A23C',
    challenge: '兼容性、可靠性、供应链风险难评估',
    aiAnswer: '推荐国产品牌A伺服电机，兼容性98%，节拍影响<2%，成本降低30%。建议试点1台，验证3个月后批量替换。',
    confidence: 85
  },
  {
    question: '不换，会不会下个月直接停线？',
    icon: 'Warning',
    color: '#F56C6C',
    challenge: '缺乏预测性维护，被动响应风险高',
    aiAnswer: '基于振动、温度、电流数据分析，该设备30天内故障概率达68%。建议2周内更换，或立即启动备件采购。',
    confidence: 91
  },
  {
    question: '今年预算到底够不够？',
    icon: 'DataLine',
    color: '#909399',
    challenge: '维修、采购、改造计划不透明，财务难控',
    aiAnswer: '年度预算¥120万，已支出¥78万。预测剩余需求¥52万（含3台翻新+5台国产替代）。建议追加预算¥10万，或调整Q4采购计划。',
    confidence: 87
  }
]

// 激活状态
const activeCapability = ref(0)

// 三层收费
const pricingLayers = [
  {
    stage: '第一阶段:项目切入',
    name: '项目服务',
    icon: 'Tools',
    services: ['设备翻新改造', '国产化替代项目', '设备利旧工程', '紧急抢修服务'],
    revenue: '¥50-200万/项目',
    customerValue: '立竿见影降本，快速见效',
    cta: '咨询项目方案'
  },
  {
    stage: '第二阶段:年度服务',
    name: '年包订阅',
    icon: 'Money',
    services: ['工具年包服务', '设备保障包', '国产化支持包', '备件库存优化'],
    revenue: '¥80-300万/年·工厂',
    customerValue: '预算可控、风险外包、稳定现金流',
    cta: '定制年包方案'
  },
  {
    stage: '第三阶段:平台化',
    name: '智能体平台',
    icon: 'TrendCharts',
    services: ['按工厂订阅', '按产线订阅', '集团级平台', '数据增值服务'],
    revenue: '¥200-800万/年·集团',
    customerValue: '集团复制、数据资产、持续优化',
    cta: '申请平台演示'
  }
]

// 筛选条件
const filterCategory = ref('')
const filterStatus = ref('')
const searchKeyword = ref('')

// 对话框
const showAddEquipmentDialog = ref(false)

// 新设备表单
const newEquipment = ref({
  name: '',
  category: '',
  model: '',
  purchasePrice: 0,
  location: '',
  status: 'running'
})

// 过滤后的设备
const filteredEquipment = computed(() => {
  let result = equipmentStore.equipmentAssets
  if (filterCategory.value) {
    result = result.filter(eq => eq.category === filterCategory.value)
  }
  if (filterStatus.value) {
    result = result.filter(eq => eq.status === filterStatus.value)
  }
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(eq => 
      eq.name.toLowerCase().includes(keyword) || 
      eq.id.toLowerCase().includes(keyword)
    )
  }
  return result
})

// ROI表格数据
const roiTableData = computed(() => {
  return equipmentStore.equipmentAssets.map(eq => {
    const roi = equipmentStore.calculateROI(eq.id)
    return {
      equipmentId: eq.id,
      equipmentName: eq.name,
      ...roi
    }
  })
})

// 所有保养预测
const allMaintenancePredictions = computed(() => {
  const predictions = []
  equipmentStore.equipmentAssets.forEach(eq => {
    const eqPredictions = equipmentStore.predictMaintenance(eq.id)
    predictions.push(...eqPredictions)
  })
  return predictions.sort((a, b) => {
    const urgencyOrder = { urgent: 0, warning: 1, normal: 2 }
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency]
  })
})

// 紧急保养数量
const urgentMaintenanceCount = computed(() => {
  return allMaintenancePredictions.value.filter(p => p.urgency === 'urgent').length
})

// 获取成本分析
const getCostAnalysis = (equipmentId) => {
  return equipmentStore.analyzeServiceCosts(equipmentId, 12)
}

// 辅助函数
const getStatusType = (status) => {
  const types = { running: 'success', maintenance: 'warning', fault: 'danger', idle: 'info' }
  return types[status] || 'info'
}

const getStatusText = (status) => {
  const texts = { running: '运行中', maintenance: '维护中', fault: '故障', idle: '闲置' }
  return texts[status] || '未知'
}

const getHealthColor = (health) => {
  if (health >= 80) return '#52c41a'
  if (health >= 60) return '#faad14'
  return '#f5222d'
}

const getRoiType = (roi) => {
  const roiValue = parseFloat(roi)
  if (roiValue >= 20) return 'success'
  if (roiValue >= 10) return 'warning'
  return 'danger'
}

const getUrgencyType = (urgency) => {
  const types = { urgent: 'danger', warning: 'warning', normal: 'success' }
  return types[urgency] || 'info'
}

const getUrgencyText = (urgency) => {
  const texts = { urgent: '紧急', warning: '警告', normal: '正常' }
  return texts[urgency] || '未知'
}

const getConfidenceColor = (confidence) => {
  if (confidence >= 85) return '#52c41a'
  if (confidence >= 70) return '#faad14'
  return '#f5222d'
}

// 添加设备
const addEquipment = () => {
  if (!newEquipment.value.name || !newEquipment.value.category) {
    ElMessage.warning('请填写必填项')
    return
  }

  const categoryComponents = equipmentStore.getComponentsByCategory(newEquipment.value.category)
  const components = categoryComponents.map(comp => ({
    componentId: comp.id,
    installDate: new Date().toISOString().split('T')[0],
    lastMaintenance: new Date().toISOString().split('T')[0],
    nextMaintenance: calculateNextMaintenance(new Date(), comp.maintenanceCycle),
    condition: 100
  }))

  equipmentStore.addEquipment({
    ...newEquipment.value,
    purchaseDate: new Date().toISOString().split('T')[0],
    installDate: new Date().toISOString().split('T')[0],
    workingHours: 0,
    utilizationRate: 0,
    components
  })

  ElMessage.success('设备添加成功')
  showAddEquipmentDialog.value = false
  
  newEquipment.value = {
    name: '',
    category: '',
    model: '',
    purchasePrice: 0,
    location: '',
    status: 'running'
  }
}

const calculateNextMaintenance = (installDate, maintenanceCycle) => {
  const date = new Date(installDate || new Date())
  date.setMonth(date.getMonth() + maintenanceCycle)
  return date.toISOString().split('T')[0]
}

const viewEquipmentDetail = (equipment) => {
  router.push(`/equipment-detail/${equipment.id}`)
}

const openHandleDetail = (index) => {
  ElMessage.info(`${fiveHandles[index].title}详细分析功能开发中...`)
}

const enterModule = (moduleId) => {
  ElMessage.info(`进入${moduleId}模块...`)
}

const viewModuleCase = (moduleId) => {
  ElMessage.info(`查看${moduleId}案例...`)
}

const getDecisionForQuestion = (index) => {
  ElMessage.success('正在调用AI决策引擎...')
}
</script>

<style scoped>
.equipment-lifecycle {
  min-height: 100vh;
  background: #f0f2f5;
}

.page-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* 智能头部 */
.intelligence-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 48px;
  margin-bottom: 40px;
  color: #fff;
  position: relative;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.3);
}

.intelligence-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  border-radius: 50%;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
}

.header-left {
  display: flex;
  gap: 24px;
  align-items: center;
  flex: 1;
}

.brain-icon {
  width: 80px;
  height: 80px;
  background: rgba(255,255,255,0.2);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.header-text h1 {
  font-size: 42px;
  font-weight: 800;
  margin-bottom: 12px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.tagline {
  font-size: 18px;
  opacity: 0.95;
  margin-bottom: 16px;
}

.core-value {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.dashboard-btn {
  font-size: 16px;
  padding: 16px 32px;
  height: auto;
  background: #fff;
  color: #667eea;
  border: none;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.dashboard-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
}

/* 决策架构 */
.decision-architecture,
.five-handles-section,
.decision-matrix-section,
.pain-points-section,
.data-loop-section,
.business-model-section,
.equipment-overview-section {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 32px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #1a1a1a;
}

.section-desc {
  text-align: center;
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
}

.architecture-flow {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.arch-layer {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
}

.layer-number {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  flex-shrink: 0;
}

.layer-content {
  flex: 1;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
}

.layer-content:hover {
  border-color: #667eea;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.2);
}

.layer-header {
  padding: 16px 24px;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 12px;
}

.layer-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.layer-body {
  padding: 24px;
  background: #fafafa;
}

.layer-desc {
  font-size: 15px;
  color: #666;
  margin-bottom: 16px;
}

.layer-metrics {
  display: flex;
  gap: 24px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metric-label {
  font-size: 13px;
  color: #999;
}

.metric-value {
  font-size: 20px;
  font-weight: 700;
  color: #667eea;
}

.flow-arrow {
  align-self: center;
  color: #1890ff;
  margin: -8px 0;
}

/* 5大抓手 */
.handles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.handle-card {
  border: 2px solid #e8e8e8;
  border-radius: 16px;
  padding: 28px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.handle-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transform: scaleX(0);
  transition: transform 0.3s;
}

.handle-card.active::before,
.handle-card:hover::before {
  transform: scaleX(1);
}

.handle-card.active,
.handle-card:hover {
  border-color: #667eea;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
  transform: translateY(-4px);
}

.handle-number {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  background: #f0f2f5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: #999;
}

.handle-icon {
  width: 72px;
  height: 72px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-bottom: 20px;
}

.handle-card h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.handle-slogan {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.handle-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-box {
  text-align: center;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

.stat-box .stat-value {
  font-size: 22px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 4px;
}

.stat-box .stat-label {
  font-size: 12px;
  color: #999;
}

.handle-action {
  width: 100%;
  justify-content: center;
}

/* 决策模块矩阵 */
.matrix-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
}

.module-card {
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
}

.module-card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  transform: translateY(-4px);
}

.module-header {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  background: #fafafa;
}

.module-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.module-title h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #1a1a1a;
}

.module-subtitle {
  font-size: 13px;
  color: #999;
}

.module-body {
  padding: 24px;
}

.core-function,
.value-statement,
.decision-output {
  margin-bottom: 16px;
}

.core-function strong,
.value-statement strong {
  color: #1a1a1a;
  display: block;
  margin-bottom: 6px;
}

.core-function p,
.value-statement p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.output-text {
  font-size: 14px;
  color: #667eea;
  font-style: italic;
  margin: 8px 0 0 0;
  padding: 12px;
  background: #f0f5ff;
  border-radius: 8px;
}

.module-footer {
  padding: 16px 24px;
  background: #fafafa;
  display: flex;
  gap: 12px;
  border-top: 1px solid #e8e8e8;
}

/* 客户痛点 */
.pain-points-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 28px;
}

.pain-point-card {
  border: 2px solid #e8e8e8;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s;
}

.pain-point-card:hover {
  border-color: #f5222d;
  box-shadow: 0 8px 24px rgba(245, 34, 45, 0.15);
}

.question-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.question-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #f5222d;
  margin: 0;
}

.question-text {
  font-size: 16px;
  color: #1a1a1a;
  font-weight: 600;
  margin-bottom: 12px;
  line-height: 1.6;
}

.stakeholders {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.ai-answer {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}

.answer-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #52c41a;
}

.answer-text {
  font-size: 15px;
  color: #333;
  line-height: 1.7;
  margin-bottom: 16px;
}

.answer-confidence {
  display: flex;
  align-items: center;
  gap: 12px;
}

.answer-confidence span {
  font-size: 13px;
  color: #666;
  min-width: 80px;
}

.get-decision-btn {
  width: 100%;
}

/* 数据闭环 */
.loop-diagram {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.loop-step {
  flex: 1;
  min-width: 180px;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.loop-step.active,
.loop-step:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.2);
  transform: scale(1.05);
}

.step-number {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  background: #f0f2f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #999;
}

.step-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin: 0 auto 16px;
}

.loop-step h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #1a1a1a;
}

.loop-step p {
  font-size: 13px;
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.step-kpi {
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.kpi-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.kpi-label {
  font-size: 12px;
  color: #999;
}

.kpi-value {
  font-size: 16px;
  font-weight: 700;
  color: #1890ff;
}

.step-arrow {
  flex-shrink: 0;
}

/* 商业模式 */
.pricing-layers {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.pricing-layer {
  border: 2px solid #e8e8e8;
  border-radius: 16px;
  padding: 32px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}

.pricing-layer::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.pricing-layer:hover {
  border-color: #667eea;
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.2);
  transform: translateY(-8px);
}

.layer-badge {
  display: inline-block;
  background: #667eea;
  color: #fff;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 20px;
}

.layer-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.layer-title h3 {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.layer-services {
  margin-bottom: 28px;
}

.service-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  font-size: 15px;
  color: #333;
}

.layer-value {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
}

.value-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
}

.value-label {
  color: #666;
}

.value-number {
  font-size: 18px;
  font-weight: 700;
  color: #52c41a;
}

.value-desc {
  font-weight: 600;
  color: #1a1a1a;
}

.consult-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
}

/* 设备概览 */
.kpi-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.kpi-card {
  border-radius: 16px;
  padding: 28px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  transition: all 0.3s;
}

.kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.kpi-content {
  flex: 1;
  color: #fff;
}

.kpi-value {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 4px;
}

.kpi-label {
  font-size: 14px;
  opacity: 0.9;
}

.quick-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}

/* 详细功能折叠 */
.detail-collapse {
  margin-top: 32px;
}

.collapse-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  width: 100%;
}

.feature-tabs {
  margin-top: 20px;
}

.tab-content {
  padding: 20px 0;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
}

.filter-group {
  display: flex;
  gap: 12px;
}

.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.equipment-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.equipment-card:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.15);
  transform: translateY(-2px);
}

.equipment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.equipment-category {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #666;
}

.equipment-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1a1a1a;
}

.equipment-info {
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 13px;
}

.info-item .label {
  color: #999;
}

.info-item .value {
  color: #333;
  font-weight: 500;
}

.equipment-health {
  margin-top: 16px;
}

.health-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.cost-overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.cost-card {
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 20px;
  background: #fff;
}

.cost-card h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1a1a1a;
}

.cost-summary {
  margin-bottom: 16px;
}

.cost-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 14px;
}

.cost-item .label {
  color: #666;
}

.cost-item .value {
  font-weight: 600;
  color: #1a1a1a;
}

@media (max-width: 1200px) {
  .pricing-layers {
    grid-template-columns: 1fr;
  }
  
  .handles-grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .kpi-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .quick-actions {
    flex-wrap: wrap;
  }
  
  .pain-points-grid {
    grid-template-columns: 1fr;
  }
  
  .loop-diagram {
    flex-direction: column;
  }
}

/* 实战案例展示 */
.case-studies-section {
  margin-bottom: 60px;
}

.section-desc {
  text-align: center;
  font-size: 15px;
  color: #666;
  margin: -15px 0 30px 0;
}

.cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.case-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.case-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}

.case-image {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
}

.case-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.case-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  border-radius: 20px;
  color: white;
  font-weight: 600;
  font-size: 14px;
  backdrop-filter: blur(10px);
}

.case-content {
  padding: 25px;
}

.case-content h3 {
  font-size: 20px;
  margin: 0 0 10px 0;
  color: #333;
}

.case-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 20px 0;
  line-height: 1.6;
}

.case-metrics {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.case-metric {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #666;
}

.case-metric strong {
  color: #409EFF;
}

.case-detail-btn {
  width: 100%;
  margin-top: 10px;
}

/* 非标定制方案 */
.custom-solutions-section {
  margin-bottom: 60px;
}

.solutions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
}

.solution-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.solution-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}

.solution-icon {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 20px;
}

.solution-content h3 {
  font-size: 22px;
  margin: 0 0 10px 0;
  color: #333;
}

.solution-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 20px 0;
  line-height: 1.6;
}

.solution-items {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.solution-items li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  font-size: 14px;
  color: #555;
}

.solution-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.solution-stats .stat {
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
  border-radius: 12px;
  padding: 15px;
  text-align: center;
}

.solution-stats .stat-label {
  display: block;
  font-size: 12px;
  color: #909399;
  margin-bottom: 5px;
}

.solution-stats .stat-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #67C23A;
}

/* 利旧改造 */
.retrofit-section {
  margin-bottom: 60px;
}

.retrofit-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 30px;
}

.retrofit-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.retrofit-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}

.retrofit-image {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
}

.retrofit-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.retrofit-tag {
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  font-size: 13px;
  font-weight: 600;
  color: #409EFF;
}

.retrofit-content {
  padding: 25px;
}

.retrofit-content h3 {
  font-size: 20px;
  margin: 0 0 8px 0;
  color: #333;
}

.retrofit-subtitle {
  font-size: 14px;
  color: #909399;
  margin: 0 0 20px 0;
}

.retrofit-features {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.retrofit-features li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  font-size: 14px;
  color: #555;
}

.retrofit-result {
  text-align: center;
  padding-top: 15px;
  border-top: 1px solid #e4e7ed;
}

/* 智能化拓展能力 */
.intelligence-expansion-section {
  margin-bottom: 60px;
}

.hexagon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.hexagon-item {
  animation: hexagonFadeIn 0.6s ease-out forwards;
  opacity: 0;
}

@keyframes hexagonFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hexagon-item.active .hexagon {
  transform: scale(1.05);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.4);
}

.hexagon {
  height: 200px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
  cursor: pointer;
}

.hexagon:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.3);
}

.hexagon-content {
  text-align: center;
  padding: 20px;
}

.hexagon-content h3 {
  font-size: 18px;
  margin: 12px 0 8px 0;
}

.hexagon-content p {
  font-size: 13px;
  margin: 0;
  opacity: 0.9;
  line-height: 1.5;
}

/* 增强版客户痛点 */
.enhanced-pain-points-section {
  margin-bottom: 60px;
}

.enhanced-pain-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 30px;
}

.enhanced-pain-card {
  background: white;
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.enhanced-pain-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}

.enhanced-pain-card .pain-header {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 20px;
}

.enhanced-pain-card .pain-header h3 {
  font-size: 18px;
  margin: 0;
  color: #333;
  line-height: 1.4;
}

.enhanced-pain-card .pain-body strong {
  display: block;
  font-size: 13px;
  color: #909399;
  margin-bottom: 10px;
}

.pain-challenge {
  margin-bottom: 20px;
}

.pain-challenge p {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

.ai-decision {
  margin-bottom: 20px;
}

.decision-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%);
  border-left: 4px solid;
  border-radius: 8px;
  padding: 20px;
  margin-top: 10px;
}

.decision-card p {
  font-size: 14px;
  color: #333;
  margin: 0 0 15px 0;
  line-height: 1.6;
}

.confidence-meter {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.confidence-label {
  font-size: 12px;
  color: #909399;
}

.generate-btn {
  width: 100%;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .cases-grid {
    grid-template-columns: 1fr;
  }
  
  .solutions-grid {
    grid-template-columns: 1fr;
  }
  
  .retrofit-grid {
    grid-template-columns: 1fr;
  }
  
  .hexagon-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .enhanced-pain-grid {
    grid-template-columns: 1fr;
  }
}
</style>
