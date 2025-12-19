<template>
  <div class="marketing-hub-manage">
    <el-page-header @back="$router.back()">
      <template #content>
        <div class="page-header-content">
          <el-icon><TrendCharts /></el-icon>
          <span>AI营销中台管理</span>
        </div>
      </template>
    </el-page-header>

    <el-tabs v-model="activeTab" class="management-tabs">
      <!-- Phase 2: AI驱动营销 -->
      <el-tab-pane label="Phase 2 - AI驱动营销" name="phase2">
        <div class="phase-section">
          <h3>Phase 2：AI驱动营销配置</h3>
          
          <!-- AI产品选型系统 -->
          <el-card class="feature-card">
            <template #header>
              <div class="card-header">
                <span>🎯 AI产品选型系统</span>
                <el-switch v-model="phase2Config.aiSelector.enabled" />
              </div>
            </template>
            
            <el-form :model="phase2Config.aiSelector" label-width="120px">
              <el-form-item label="系统标题">
                <el-input v-model="phase2Config.aiSelector.title.zh" placeholder="中文标题" />
                <el-input v-model="phase2Config.aiSelector.title.en" placeholder="English Title" class="mt-2" />
              </el-form-item>
              
              <el-form-item label="推荐准确率">
                <el-slider v-model="phase2Config.aiSelector.accuracy" :min="80" :max="100" show-stops />
                <span class="accuracy-label">{{ phase2Config.aiSelector.accuracy }}%</span>
              </el-form-item>
              
              <el-form-item label="问答步骤数">
                <el-input-number v-model="phase2Config.aiSelector.steps" :min="3" :max="8" />
              </el-form-item>
              
              <el-form-item label="训练数据集">
                <el-upload
                  class="upload-demo"
                  action="#"
                  :auto-upload="false"
                  :on-change="handleTrainingDataUpload">
                  <el-button type="primary" plain>
                    <el-icon><Upload /></el-icon>
                    上传训练数据（CSV/JSON）
                  </el-button>
                </el-upload>
                <div class="training-stats">
                  <el-statistic title="已训练样本数" :value="phase2Config.aiSelector.trainingSamples" />
                  <el-statistic title="最后训练时间" :value="phase2Config.aiSelector.lastTraining" />
                </div>
              </el-form-item>
              
              <el-form-item label="AI模型参数">
                <el-button @click="openModelConfig('aiSelector')" type="warning" plain>
                  <el-icon><Setting /></el-icon>
                  配置AI模型
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 资源中心 -->
          <el-card class="feature-card">
            <template #header>
              <div class="card-header">
                <span>📚 资源中心</span>
                <el-switch v-model="phase2Config.resourceCenter.enabled" />
              </div>
            </template>
            
            <el-form :model="phase2Config.resourceCenter" label-width="120px">
              <el-form-item label="资源分类">
                <el-tag v-for="cat in phase2Config.resourceCenter.categories" :key="cat" closable @close="removeCategory(cat)">
                  {{ cat }}
                </el-tag>
                <el-input v-model="newCategory" placeholder="添加分类" class="input-new-tag" @keyup.enter="addCategory">
                  <template #append>
                    <el-button @click="addCategory">添加</el-button>
                  </template>
                </el-input>
              </el-form-item>
              
              <el-form-item label="下载追踪">
                <el-switch v-model="phase2Config.resourceCenter.trackDownloads" />
                <span class="hint">开启后将记录用户下载行为用于AI分析</span>
              </el-form-item>
              
              <el-form-item label="资源管理">
                <el-button @click="openResourceManager" type="primary">
                  <el-icon><FolderOpened /></el-icon>
                  管理资源文件
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- AI询盘评分 -->
          <el-card class="feature-card">
            <template #header>
              <div class="card-header">
                <span>🏆 AI询盘评分系统</span>
                <el-switch v-model="phase2Config.leadScoring.enabled" />
              </div>
            </template>
            
            <el-form :model="phase2Config.leadScoring" label-width="140px">
              <el-form-item label="评分维度权重">
                <el-row :gutter="20">
                  <el-col :span="6" v-for="(weight, key) in phase2Config.leadScoring.weights" :key="key">
                    <el-statistic :title="weightLabels[key]" :value="weight" suffix="%" />
                    <el-slider v-model="phase2Config.leadScoring.weights[key]" :max="100" />
                  </el-col>
                </el-row>
              </el-form-item>
              
              <el-form-item label="分级标准">
                <el-table :data="phase2Config.leadScoring.grades" border>
                  <el-table-column prop="grade" label="等级" width="80" />
                  <el-table-column prop="minScore" label="最低分" width="100">
                    <template #default="{ row }">
                      <el-input-number v-model="row.minScore" :min="0" :max="100" size="small" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="maxScore" label="最高分" width="100">
                    <template #default="{ row }">
                      <el-input-number v-model="row.maxScore" :min="0" :max="100" size="small" />
                    </template>
                  </el-table-column>
                  <el-table-column prop="action" label="跟进策略">
                    <template #default="{ row }">
                      <el-input v-model="row.action" placeholder="自动跟进策略" />
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
              
              <el-form-item label="AI训练">
                <el-button @click="trainLeadScoring" type="danger">
                  <el-icon><MagicStick /></el-icon>
                  重新训练评分模型
                </el-button>
                <span class="hint">基于历史转化数据优化评分算法</span>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- SEO引擎 -->
          <el-card class="feature-card">
            <template #header>
              <div class="card-header">
                <span>🔍 AI SEO优化引擎</span>
                <el-switch v-model="phase2Config.seoEngine.enabled" />
              </div>
            </template>
            
            <el-form :model="phase2Config.seoEngine" label-width="140px">
              <el-form-item label="目标关键词">
                <el-tag v-for="keyword in phase2Config.seoEngine.keywords" :key="keyword" closable @close="removeKeyword(keyword)">
                  {{ keyword }}
                </el-tag>
                <el-input v-model="newKeyword" placeholder="添加关键词" class="input-new-tag" @keyup.enter="addKeyword">
                  <template #append>
                    <el-button @click="addKeyword">添加</el-button>
                  </template>
                </el-input>
              </el-form-item>
              
              <el-form-item label="自动生成Meta">
                <el-switch v-model="phase2Config.seoEngine.autoMeta" />
              </el-form-item>
              
              <el-form-item label="多语言SEO">
                <el-checkbox-group v-model="phase2Config.seoEngine.languages">
                  <el-checkbox label="zh-CN">简体中文</el-checkbox>
                  <el-checkbox label="en-US">英语</el-checkbox>
                  <el-checkbox label="es-ES">西班牙语</el-checkbox>
                  <el-checkbox label="fr-FR">法语</el-checkbox>
                  <el-checkbox label="de-DE">德语</el-checkbox>
                  <el-checkbox label="ja-JP">日语</el-checkbox>
                  <el-checkbox label="ko-KR">韩语</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- Phase 3: 营销自动化 -->
      <el-tab-pane label="Phase 3 - 营销自动化" name="phase3">
        <div class="phase-section">
          <h3>Phase 3：营销自动化配置</h3>
          
          <!-- AI邮件营销 -->
          <el-card class="feature-card">
            <template #header>
              <div class="card-header">
                <span>📧 AI邮件营销系统</span>
                <el-switch v-model="phase3Config.emailMarketing.enabled" />
              </div>
            </template>
            
            <el-form :model="phase3Config.emailMarketing" label-width="140px">
              <el-form-item label="每日发送上限">
                <el-input-number v-model="phase3Config.emailMarketing.dailyLimit" :min="100" :max="50000" :step="100" />
                <span class="hint">当前配额：10,000封/天</span>
              </el-form-item>
              
              <el-form-item label="A/B测试">
                <el-switch v-model="phase3Config.emailMarketing.abTest" />
                <el-input-number v-if="phase3Config.emailMarketing.abTest" v-model="phase3Config.emailMarketing.abTestSplit" :min="10" :max="50" />
                <span v-if="phase3Config.emailMarketing.abTest" class="hint">测试组占比：{{ phase3Config.emailMarketing.abTestSplit }}%</span>
              </el-form-item>
              
              <el-form-item label="邮件模板">
                <el-button @click="openTemplateEditor" type="primary">
                  <el-icon><Edit /></el-icon>
                  编辑邮件模板
                </el-button>
                <el-button @click="openAITemplateGen" type="success">
                  <el-icon><MagicStick /></el-icon>
                  AI生成模板
                </el-button>
              </el-form-item>
              
              <el-form-item label="发送统计">
                <el-row :gutter="20">
                  <el-col :span="6">
                    <el-statistic title="今日发送" :value="phase3Config.emailMarketing.stats.todaySent" />
                  </el-col>
                  <el-col :span="6">
                    <el-statistic title="打开率" :value="phase3Config.emailMarketing.stats.openRate" suffix="%" />
                  </el-col>
                  <el-col :span="6">
                    <el-statistic title="点击率" :value="phase3Config.emailMarketing.stats.clickRate" suffix="%" />
                  </el-col>
                  <el-col :span="6">
                    <el-statistic title="转化率" :value="phase3Config.emailMarketing.stats.conversionRate" suffix="%" />
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 线索孵化系统 -->
          <el-card class="feature-card">
            <template #header>
              <div class="card-header">
                <span>🔄 线索孵化系统</span>
                <el-switch v-model="phase3Config.leadNurturing.enabled" />
              </div>
            </template>
            
            <el-form :model="phase3Config.leadNurturing" label-width="140px">
              <el-form-item label="漏斗阶段配置">
                <el-button @click="openFunnelEditor" type="primary">
                  <el-icon><Operation /></el-icon>
                  配置6阶段漏斗
                </el-button>
              </el-form-item>
              
              <el-form-item label="自动化工作流">
                <el-table :data="phase3Config.leadNurturing.workflows" border>
                  <el-table-column prop="name" label="工作流名称" />
                  <el-table-column prop="trigger" label="触发条件" />
                  <el-table-column prop="actions" label="动作数" width="100" />
                  <el-table-column label="状态" width="100">
                    <template #default="{ row }">
                      <el-switch v-model="row.active" />
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="150">
                    <template #default="{ row }">
                      <el-button size="small" @click="editWorkflow(row)">编辑</el-button>
                      <el-button size="small" type="danger" @click="deleteWorkflow(row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <el-button @click="createWorkflow" type="success" class="mt-3">
                  <el-icon><Plus /></el-icon>
                  创建新工作流
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 客户旅程追踪 -->
          <el-card class="feature-card">
            <template #header>
              <div class="card-header">
                <span>🗺️ 客户旅程追踪</span>
                <el-switch v-model="phase3Config.journeyTracking.enabled" />
              </div>
            </template>
            
            <el-form :model="phase3Config.journeyTracking" label-width="140px">
              <el-form-item label="追踪事件">
                <el-checkbox-group v-model="phase3Config.journeyTracking.events">
                  <el-checkbox label="page_view">页面浏览</el-checkbox>
                  <el-checkbox label="product_view">产品查看</el-checkbox>
                  <el-checkbox label="download">资源下载</el-checkbox>
                  <el-checkbox label="inquiry">询盘提交</el-checkbox>
                  <el-checkbox label="email_open">邮件打开</el-checkbox>
                  <el-checkbox label="email_click">邮件点击</el-checkbox>
                  <el-checkbox label="form_submit">表单提交</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              
              <el-form-item label="归因模型">
                <el-select v-model="phase3Config.journeyTracking.attributionModel">
                  <el-option label="首次互动归因" value="first-touch" />
                  <el-option label="最后互动归因" value="last-touch" />
                  <el-option label="线性归因" value="linear" />
                  <el-option label="时间衰减归因" value="time-decay" />
                  <el-option label="位置归因" value="position-based" />
                  <el-option label="数据驱动归因" value="data-driven" />
                </el-select>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- Phase 4: 数据分析 -->
      <el-tab-pane label="Phase 4 - 数据分析" name="phase4">
        <div class="phase-section">
          <h3>Phase 4：数据分析与优化</h3>
          
          <!-- 营销数据中台 -->
          <el-card class="feature-card">
            <template #header>
              <div class="card-header">
                <span>📊 营销数据中台</span>
                <el-switch v-model="phase4Config.dataHub.enabled" />
              </div>
            </template>
            
            <el-form :model="phase4Config.dataHub" label-width="140px">
              <el-form-item label="数据源集成">
                <el-checkbox-group v-model="phase4Config.dataHub.dataSources">
                  <el-checkbox label="website">网站访问数据</el-checkbox>
                  <el-checkbox label="crm">CRM系统</el-checkbox>
                  <el-checkbox label="email">邮件营销</el-checkbox>
                  <el-checkbox label="social">社交媒体</el-checkbox>
                  <el-checkbox label="ads">广告平台</el-checkbox>
                  <el-checkbox label="analytics">Google Analytics</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              
              <el-form-item label="实时数仓">
                <el-switch v-model="phase4Config.dataHub.realtime" />
                <el-input-number v-if="phase4Config.dataHub.realtime" v-model="phase4Config.dataHub.refreshInterval" :min="1" :max="60" />
                <span v-if="phase4Config.dataHub.realtime" class="hint">刷新间隔：{{ phase4Config.dataHub.refreshInterval }}秒</span>
              </el-form-item>
              
              <el-form-item label="可视化看板">
                <el-button @click="openDashboardBuilder" type="primary">
                  <el-icon><DataBoard /></el-icon>
                  配置看板
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- AI预测分析 -->
          <el-card class="feature-card">
            <template #header>
              <div class="card-header">
                <span>🔮 AI预测分析引擎</span>
                <el-switch v-model="phase4Config.predictive.enabled" />
              </div>
            </template>
            
            <el-form :model="phase4Config.predictive" label-width="140px">
              <el-form-item label="预测模型">
                <el-radio-group v-model="phase4Config.predictive.model">
                  <el-radio label="rf">随机森林</el-radio>
                  <el-radio label="xgboost">XGBoost</el-radio>
                  <el-radio label="lstm">LSTM神经网络</el-radio>
                  <el-radio label="ensemble">集成学习</el-radio>
                </el-radio-group>
              </el-form-item>
              
              <el-form-item label="预测准确率">
                <el-progress :percentage="phase4Config.predictive.accuracy" :color="accuracyColor" />
                <span class="accuracy-label">{{ phase4Config.predictive.accuracy }}%</span>
              </el-form-item>
              
              <el-form-item label="预测场景">
                <el-checkbox-group v-model="phase4Config.predictive.scenarios">
                  <el-checkbox label="conversion">转化预测</el-checkbox>
                  <el-checkbox label="churn">流失预警</el-checkbox>
                  <el-checkbox label="ltv">客户终身价值</el-checkbox>
                  <el-checkbox label="demand">需求预测</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              
              <el-form-item label="模型训练">
                <el-button @click="trainPredictiveModel" type="danger" :loading="isTraining">
                  <el-icon><MagicStick /></el-icon>
                  {{ isTraining ? '训练中...' : '开始训练' }}
                </el-button>
                <div class="training-progress" v-if="isTraining">
                  <el-progress :percentage="trainingProgress" />
                </div>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 自动化报表 -->
          <el-card class="feature-card">
            <template #header>
              <div class="card-header">
                <span>📈 自动化报表系统</span>
                <el-switch v-model="phase4Config.reporting.enabled" />
              </div>
            </template>
            
            <el-form :model="phase4Config.reporting" label-width="140px">
              <el-form-item label="报表周期">
                <el-checkbox-group v-model="phase4Config.reporting.schedules">
                  <el-checkbox label="daily">每日报表</el-checkbox>
                  <el-checkbox label="weekly">每周报表</el-checkbox>
                  <el-checkbox label="monthly">每月报表</el-checkbox>
                  <el-checkbox label="quarterly">季度报表</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              
              <el-form-item label="报表订阅者">
                <el-tag v-for="email in phase4Config.reporting.subscribers" :key="email" closable @close="removeSubscriber(email)">
                  {{ email }}
                </el-tag>
                <el-input v-model="newSubscriber" placeholder="添加邮箱" class="input-new-tag" @keyup.enter="addSubscriber">
                  <template #append>
                    <el-button @click="addSubscriber">添加</el-button>
                  </template>
                </el-input>
              </el-form-item>
              
              <el-form-item label="报表模板">
                <el-button @click="openReportTemplate" type="primary">
                  <el-icon><Document /></el-icon>
                  编辑报表模板
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- AI训练中心 -->
      <el-tab-pane label="AI训练中心" name="training">
        <div class="training-center">
          <h3>AI模型训练中心</h3>
          
          <el-card>
            <el-row :gutter="20">
              <el-col :span="12">
                <h4>训练任务队列</h4>
                <el-table :data="trainingQueue" border>
                  <el-table-column prop="model" label="模型名称" />
                  <el-table-column prop="status" label="状态" width="100">
                    <template #default="{ row }">
                      <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="progress" label="进度" width="150">
                    <template #default="{ row }">
                      <el-progress :percentage="row.progress" :status="row.status === 'completed' ? 'success' : ''" />
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="100">
                    <template #default="{ row }">
                      <el-button size="small" type="danger" @click="cancelTraining(row)" v-if="row.status === 'running'">
                        取消
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-col>
              
              <el-col :span="12">
                <h4>模型性能监控</h4>
                <div class="model-performance">
                  <el-row :gutter="20">
                    <el-col :span="8" v-for="metric in performanceMetrics" :key="metric.name">
                      <el-card shadow="hover">
                        <el-statistic :title="metric.name" :value="metric.value" :suffix="metric.suffix" />
                        <el-progress :percentage="metric.percentage" :color="metric.color" class="mt-2" />
                      </el-card>
                    </el-col>
                  </el-row>
                </div>
              </el-col>
            </el-row>
            
            <el-divider />
            
            <div class="training-actions">
              <h4>快速训练</h4>
              <el-space wrap>
                <el-button type="primary" @click="quickTrain('all')">
                  <el-icon><MagicStick /></el-icon>
                  训练所有模型
                </el-button>
                <el-button type="success" @click="quickTrain('aiSelector')">训练产品选型模型</el-button>
                <el-button type="warning" @click="quickTrain('leadScoring')">训练询盘评分模型</el-button>
                <el-button type="info" @click="quickTrain('predictive')">训练预测分析模型</el-button>
              </el-space>
            </div>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- 系统配置 -->
      <el-tab-pane label="系统配置" name="settings">
        <div class="system-settings">
          <h3>系统全局配置</h3>
          
          <el-card>
            <el-form :model="systemConfig" label-width="160px">
              <el-form-item label="营销中台名称">
                <el-input v-model="systemConfig.name.zh" placeholder="中文名称" />
                <el-input v-model="systemConfig.name.en" placeholder="English Name" class="mt-2" />
              </el-form-item>
              
              <el-form-item label="Logo">
                <el-upload
                  class="logo-uploader"
                  action="#"
                  :show-file-list="false"
                  :auto-upload="false"
                  :on-change="handleLogoUpload">
                  <img v-if="systemConfig.logo" :src="systemConfig.logo" class="logo-preview" />
                  <el-icon v-else class="logo-uploader-icon"><Plus /></el-icon>
                </el-upload>
              </el-form-item>
              
              <el-form-item label="主题色">
                <el-color-picker v-model="systemConfig.primaryColor" />
              </el-form-item>
              
              <el-form-item label="默认语言">
                <el-select v-model="systemConfig.defaultLanguage">
                  <el-option label="简体中文" value="zh-CN" />
                  <el-option label="English" value="en-US" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="时区">
                <el-select v-model="systemConfig.timezone">
                  <el-option label="北京时间 (UTC+8)" value="Asia/Shanghai" />
                  <el-option label="美国东部时间 (UTC-5)" value="America/New_York" />
                  <el-option label="欧洲中部时间 (UTC+1)" value="Europe/Paris" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="数据保留期">
                <el-input-number v-model="systemConfig.dataRetention" :min="30" :max="365" />
                <span class="hint">天</span>
              </el-form-item>
            </el-form>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 保存按钮 -->
    <div class="footer-actions">
      <el-button @click="$router.back()">取消</el-button>
      <el-button type="primary" @click="saveAllConfig" :loading="isSaving">
        <el-icon><Check /></el-icon>
        保存所有配置
      </el-button>
    </div>

    <!-- 对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="80%">
      <component :is="currentDialogComponent" v-bind="dialogProps" @close="dialogVisible = false" />
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// Tab状态
const activeTab = ref('phase2')

// Phase 2 配置
const phase2Config = reactive({
  aiSelector: {
    enabled: true,
    title: { zh: 'AI智能产品选型系统', en: 'AI Product Selector' },
    accuracy: 92,
    steps: 4,
    trainingSamples: 1250,
    lastTraining: '2025-12-16 14:30:00'
  },
  resourceCenter: {
    enabled: true,
    categories: ['产品手册', '技术白皮书', '应用案例', '视频教程'],
    trackDownloads: true
  },
  leadScoring: {
    enabled: true,
    weights: {
      company: 25,
      position: 20,
      budget: 30,
      timeline: 25
    },
    grades: [
      { grade: 'A', minScore: 80, maxScore: 100, action: '销售立即跟进' },
      { grade: 'B', minScore: 60, maxScore: 79, action: '3天内跟进' },
      { grade: 'C', minScore: 40, maxScore: 59, action: '自动邮件培育' },
      { grade: 'D', minScore: 0, maxScore: 39, action: '加入培育池' }
    ]
  },
  seoEngine: {
    enabled: true,
    keywords: ['工业工具', '拧紧系统', 'torque tools', 'assembly solutions'],
    autoMeta: true,
    languages: ['zh-CN', 'en-US']
  }
})

// Phase 3 配置
const phase3Config = reactive({
  emailMarketing: {
    enabled: true,
    dailyLimit: 10000,
    abTest: true,
    abTestSplit: 20,
    stats: {
      todaySent: 3456,
      openRate: 28.5,
      clickRate: 12.3,
      conversionRate: 3.8
    }
  },
  leadNurturing: {
    enabled: true,
    workflows: [
      { id: 1, name: '新询盘培育流程', trigger: '提交询盘表单', actions: 6, active: true },
      { id: 2, name: '下载资源跟进', trigger: '下载白皮书', actions: 4, active: true },
      { id: 3, name: '流失客户唤醒', trigger: '30天无互动', actions: 5, active: false }
    ]
  },
  journeyTracking: {
    enabled: true,
    events: ['page_view', 'product_view', 'download', 'inquiry'],
    attributionModel: 'data-driven'
  }
})

// Phase 4 配置
const phase4Config = reactive({
  dataHub: {
    enabled: true,
    dataSources: ['website', 'crm', 'email'],
    realtime: true,
    refreshInterval: 5
  },
  predictive: {
    enabled: true,
    model: 'ensemble',
    accuracy: 85,
    scenarios: ['conversion', 'churn']
  },
  reporting: {
    enabled: true,
    schedules: ['daily', 'weekly', 'monthly'],
    subscribers: ['sales@company.com', 'marketing@company.com']
  }
})

// 系统配置
const systemConfig = reactive({
  name: { zh: 'AI国际营销中台', en: 'AI Marketing Hub' },
  logo: '',
  primaryColor: '#667eea',
  defaultLanguage: 'zh-CN',
  timezone: 'Asia/Shanghai',
  dataRetention: 180
})

// 训练队列
const trainingQueue = ref([
  { model: 'AI产品选型模型', status: 'completed', progress: 100 },
  { model: '询盘评分模型', status: 'running', progress: 65 },
  { model: '预测分析模型', status: 'pending', progress: 0 }
])

// 性能指标
const performanceMetrics = ref([
  { name: '模型准确率', value: 92, suffix: '%', percentage: 92, color: '#67C23A' },
  { name: '响应时间', value: 120, suffix: 'ms', percentage: 85, color: '#409EFF' },
  { name: '数据覆盖率', value: 98, suffix: '%', percentage: 98, color: '#E6A23C' }
])

// 辅助数据
const weightLabels = {
  company: '公司规模',
  position: '职位级别',
  budget: '预算范围',
  timeline: '采购时间'
}

const newCategory = ref('')
const newKeyword = ref('')
const newSubscriber = ref('')
const isTraining = ref(false)
const trainingProgress = ref(0)
const isSaving = ref(false)

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('')
const currentDialogComponent = ref(null)
const dialogProps = ref({})

// 计算属性
const accuracyColor = computed(() => {
  const acc = phase4Config.predictive.accuracy
  if (acc >= 85) return '#67C23A'
  if (acc >= 70) return '#E6A23C'
  return '#F56C6C'
})

// 方法
const addCategory = () => {
  if (newCategory.value) {
    phase2Config.resourceCenter.categories.push(newCategory.value)
    newCategory.value = ''
  }
}

const removeCategory = (cat) => {
  const index = phase2Config.resourceCenter.categories.indexOf(cat)
  if (index > -1) {
    phase2Config.resourceCenter.categories.splice(index, 1)
  }
}

const addKeyword = () => {
  if (newKeyword.value) {
    phase2Config.seoEngine.keywords.push(newKeyword.value)
    newKeyword.value = ''
  }
}

const removeKeyword = (keyword) => {
  const index = phase2Config.seoEngine.keywords.indexOf(keyword)
  if (index > -1) {
    phase2Config.seoEngine.keywords.splice(index, 1)
  }
}

const addSubscriber = () => {
  if (newSubscriber.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newSubscriber.value)) {
    phase4Config.reporting.subscribers.push(newSubscriber.value)
    newSubscriber.value = ''
  } else {
    ElMessage.warning('请输入有效的邮箱地址')
  }
}

const removeSubscriber = (email) => {
  const index = phase4Config.reporting.subscribers.indexOf(email)
  if (index > -1) {
    phase4Config.reporting.subscribers.splice(index, 1)
  }
}

const handleTrainingDataUpload = (file) => {
  ElMessage.success(`训练数据 ${file.name} 已上传`)
}

const handleLogoUpload = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    systemConfig.logo = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

const openModelConfig = (model) => {
  ElMessage.info(`打开 ${model} 模型配置`)
}

const openResourceManager = () => {
  ElMessage.info('打开资源管理器')
}

const trainLeadScoring = async () => {
  try {
    await ElMessageBox.confirm('确定要重新训练询盘评分模型吗？这可能需要几分钟时间。', '确认训练', {
      confirmButtonText: '开始训练',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    ElMessage.success('评分模型训练已启动')
    // 添加到训练队列
    trainingQueue.value.push({
      model: '询盘评分模型',
      status: 'running',
      progress: 0
    })
  } catch {
    // 用户取消
  }
}

const openTemplateEditor = () => {
  ElMessage.info('打开邮件模板编辑器')
}

const openAITemplateGen = () => {
  ElMessage.info('AI正在生成邮件模板...')
}

const openFunnelEditor = () => {
  ElMessage.info('打开漏斗编辑器')
}

const editWorkflow = (row) => {
  ElMessage.info(`编辑工作流: ${row.name}`)
}

const deleteWorkflow = (row) => {
  const index = phase3Config.leadNurturing.workflows.findIndex(w => w.id === row.id)
  if (index > -1) {
    phase3Config.leadNurturing.workflows.splice(index, 1)
    ElMessage.success('工作流已删除')
  }
}

const createWorkflow = () => {
  ElMessage.info('创建新工作流')
}

const openDashboardBuilder = () => {
  ElMessage.info('打开看板配置器')
}

const trainPredictiveModel = async () => {
  isTraining.value = true
  trainingProgress.value = 0
  
  // 模拟训练进度
  const interval = setInterval(() => {
    trainingProgress.value += 10
    if (trainingProgress.value >= 100) {
      clearInterval(interval)
      isTraining.value = false
      ElMessage.success('预测模型训练完成！准确率提升至 87%')
      phase4Config.predictive.accuracy = 87
    }
  }, 500)
}

const openReportTemplate = () => {
  ElMessage.info('打开报表模板编辑器')
}

const getStatusType = (status) => {
  const map = {
    'completed': 'success',
    'running': 'warning',
    'pending': 'info',
    'failed': 'danger'
  }
  return map[status] || 'info'
}

const cancelTraining = (row) => {
  const index = trainingQueue.value.findIndex(t => t.model === row.model)
  if (index > -1) {
    trainingQueue.value[index].status = 'cancelled'
    ElMessage.warning('训练已取消')
  }
}

const quickTrain = (type) => {
  const models = {
    'all': '所有模型',
    'aiSelector': 'AI产品选型模型',
    'leadScoring': '询盘评分模型',
    'predictive': '预测分析模型'
  }
  ElMessage.success(`${models[type]} 训练已启动`)
}

const saveAllConfig = async () => {
  isSaving.value = true
  
  try {
    // 保存到localStorage
    localStorage.setItem('marketingHubPhase2', JSON.stringify(phase2Config))
    localStorage.setItem('marketingHubPhase3', JSON.stringify(phase3Config))
    localStorage.setItem('marketingHubPhase4', JSON.stringify(phase4Config))
    localStorage.setItem('marketingHubSystem', JSON.stringify(systemConfig))
    
    // 模拟保存延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('所有配置已保存成功！')
  } catch (error) {
    ElMessage.error('保存失败：' + error.message)
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.marketing-hub-manage {
  padding: 20px;
}

.page-header-content {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
}

.management-tabs {
  margin-top: 20px;
}

.phase-section h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #303133;
}

.feature-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.mt-2 {
  margin-top: 8px;
}

.mt-3 {
  margin-top: 16px;
}

.hint {
  margin-left: 10px;
  color: #909399;
  font-size: 12px;
}

.accuracy-label {
  margin-left: 10px;
  font-weight: 600;
  color: #409EFF;
}

.input-new-tag {
  width: 300px;
  margin-top: 8px;
}

.training-stats {
  display: flex;
  gap: 40px;
  margin-top: 16px;
}

.training-progress {
  margin-top: 16px;
}

.training-center h4,
.system-settings h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
}

.model-performance {
  margin-top: 16px;
}

.training-actions {
  margin-top: 20px;
}

.logo-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-uploader:hover {
  border-color: #409EFF;
}

.logo-uploader-icon {
  font-size: 28px;
  color: #8c939d;
}

.logo-preview {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.footer-actions {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #EBEEF5;
  text-align: right;
}
</style>
