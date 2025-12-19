<template>
  <div class="lead-nurturing-system">
    <div class="page-header">
      <h1>{{ $t('leadNurturing.title') }}</h1>
      <p class="description">{{ $t('leadNurturing.description') }}</p>
    </div>

    <el-row :gutter="20">
      <!-- 左侧：线索漏斗 -->
      <el-col :span="16">
        <el-card class="funnel-card">
          <template #header>
            <span>{{ $t('leadNurturing.conversionFunnel') }}</span>
          </template>

          <!-- 漏斗可视化 -->
          <div class="funnel-visualization">
            <div 
              v-for="(stage, index) in funnelStages" 
              :key="stage.id"
              class="funnel-stage"
              :style="{ width: `${100 - index * 15}%` }"
            >
              <div class="stage-header">
                <h3>{{ stage.name }}</h3>
                <span class="stage-count">{{ stage.count }} {{ $t('leadNurturing.leads') }}</span>
              </div>
              <div class="stage-progress">
                <el-progress 
                  :percentage="getConversionRate(index)" 
                  :color="getStageColor(index)"
                  :show-text="false"
                />
              </div>
              <div class="stage-details">
                <span>{{ $t('leadNurturing.avgTime') }}: {{ stage.avgTime }}</span>
                <span>{{ $t('leadNurturing.conversionRate') }}: {{ getConversionRate(index) }}%</span>
              </div>
            </div>
          </div>

          <!-- 线索列表 -->
          <el-divider />
          <div class="leads-list">
            <div class="list-header">
              <h3>{{ $t('leadNurturing.activeLeads') }}</h3>
              <el-select v-model="selectedStage" :placeholder="$t('leadNurturing.filterStage')" style="width: 200px">
                <el-option :label="$t('leadNurturing.allStages')" value="all" />
                <el-option
                  v-for="stage in funnelStages"
                  :key="stage.id"
                  :label="stage.name"
                  :value="stage.id"
                />
              </el-select>
            </div>

            <el-table :data="filteredLeads" style="margin-top: 20px">
              <el-table-column prop="name" :label="$t('leadNurturing.contactName')" width="150" />
              <el-table-column prop="company" :label="$t('leadNurturing.company')" width="180" />
              <el-table-column prop="stage" :label="$t('leadNurturing.currentStage')" width="120">
                <template #default="{ row }">
                  <el-tag :type="getStageTagType(row.stage)">{{ getStageName(row.stage) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="score" :label="$t('leadNurturing.leadScore')" width="100">
                <template #default="{ row }">
                  <el-progress 
                    :percentage="row.score" 
                    :color="getScoreColor(row.score)"
                    :format="() => row.score"
                  />
                </template>
              </el-table-column>
              <el-table-column prop="lastActivity" :label="$t('leadNurturing.lastActivity')" width="180" />
              <el-table-column prop="nextAction" :label="$t('leadNurturing.nextAction')" />
              <el-table-column :label="$t('leadNurturing.actions')" width="200" fixed="right">
                <template #default="{ row }">
                  <el-button size="small" @click="viewLead(row)">{{ $t('leadNurturing.view') }}</el-button>
                  <el-button size="small" type="primary" @click="executeAction(row)">{{ $t('leadNurturing.execute') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>

        <!-- 自动化流程配置 -->
        <el-card class="automation-card" style="margin-top: 20px">
          <template #header>
            <div class="card-header">
              <span>{{ $t('leadNurturing.automationWorkflows') }}</span>
              <el-button type="primary" size="small" @click="createWorkflow">
                {{ $t('leadNurturing.createWorkflow') }}
              </el-button>
            </div>
          </template>

          <div class="workflows-list">
            <div v-for="workflow in workflows" :key="workflow.id" class="workflow-item">
              <div class="workflow-header">
                <div>
                  <h4>{{ workflow.name }}</h4>
                  <span class="workflow-trigger">{{ $t('leadNurturing.trigger') }}: {{ workflow.trigger }}</span>
                </div>
                <el-switch v-model="workflow.active" @change="toggleWorkflow(workflow)" />
              </div>
              <div class="workflow-steps">
                <el-steps :active="workflow.steps.length" finish-status="success">
                  <el-step
                    v-for="(step, index) in workflow.steps"
                    :key="index"
                    :title="step.action"
                    :description="step.delay"
                  />
                </el-steps>
              </div>
              <div class="workflow-stats">
                <span>{{ $t('leadNurturing.enrolled') }}: {{ workflow.stats.enrolled }}</span>
                <span>{{ $t('leadNurturing.completed') }}: {{ workflow.stats.completed }}</span>
                <span>{{ $t('leadNurturing.converted') }}: {{ workflow.stats.converted }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：线索评分和任务 -->
      <el-col :span="8">
        <!-- 评分规则 -->
        <el-card class="scoring-card">
          <template #header>{{ $t('leadNurturing.scoringRules') }}</template>
          <div class="scoring-rules">
            <div v-for="rule in scoringRules" :key="rule.id" class="rule-item">
              <div class="rule-header">
                <span class="rule-name">{{ rule.name }}</span>
                <el-tag size="small" type="success">+{{ rule.points }}</el-tag>
              </div>
              <p class="rule-description">{{ rule.description }}</p>
            </div>
          </div>
          <el-button type="text" @click="manageScoringRules">{{ $t('leadNurturing.manageRules') }}</el-button>
        </el-card>

        <!-- 待办任务 -->
        <el-card class="tasks-card" style="margin-top: 20px">
          <template #header>
            <div class="card-header">
              <span>{{ $t('leadNurturing.pendingTasks') }}</span>
              <el-badge :value="pendingTasks.length" class="item" />
            </div>
          </template>
          <div class="tasks-list">
            <div v-for="task in pendingTasks" :key="task.id" class="task-item">
              <div class="task-header">
                <el-checkbox v-model="task.completed" @change="completeTask(task)" />
                <span :class="{ 'task-overdue': task.overdue }">{{ task.title }}</span>
              </div>
              <p class="task-lead">{{ task.leadName }} - {{ task.company }}</p>
              <div class="task-footer">
                <span class="task-due">{{ task.dueDate }}</span>
                <el-tag size="small" :type="task.priority === 'high' ? 'danger' : 'info'">
                  {{ task.priority }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-card>

        <!-- AI建议 -->
        <el-card class="ai-suggestions-card" style="margin-top: 20px">
          <template #header>
            <span>{{ $t('leadNurturing.aiSuggestions') }}</span>
          </template>
          <div class="suggestions-list">
            <div v-for="suggestion in aiSuggestions" :key="suggestion.id" class="suggestion-item">
              <div class="suggestion-icon">
                <i :class="suggestion.icon" :style="{ color: suggestion.color }"></i>
              </div>
              <div class="suggestion-content">
                <h5>{{ suggestion.title }}</h5>
                <p>{{ suggestion.description }}</p>
                <el-button size="small" type="primary" @click="applySuggestion(suggestion)">
                  {{ $t('leadNurturing.apply') }}
                </el-button>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 创建工作流对话框 -->
    <el-dialog v-model="workflowDialogVisible" :title="$t('leadNurturing.createWorkflow')" width="700px">
      <el-form :model="newWorkflow" label-width="120px">
        <el-form-item :label="$t('leadNurturing.workflowName')">
          <el-input v-model="newWorkflow.name" />
        </el-form-item>
        <el-form-item :label="$t('leadNurturing.triggerEvent')">
          <el-select v-model="newWorkflow.trigger" :placeholder="$t('leadNurturing.selectTrigger')">
            <el-option :label="$t('leadNurturing.newLead')" value="new_lead" />
            <el-option :label="$t('leadNurturing.formSubmit')" value="form_submit" />
            <el-option :label="$t('leadNurturing.resourceDownload')" value="download" />
            <el-option :label="$t('leadNurturing.emailOpen')" value="email_open" />
            <el-option :label="$t('leadNurturing.linkClick')" value="link_click" />
            <el-option :label="$t('leadNurturing.stageChange')" value="stage_change" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('leadNurturing.workflowSteps')">
          <div class="workflow-steps-editor">
            <div v-for="(step, index) in newWorkflow.steps" :key="index" class="step-editor">
              <el-select v-model="step.action" :placeholder="$t('leadNurturing.selectAction')" style="width: 200px">
                <el-option :label="$t('leadNurturing.sendEmail')" value="send_email" />
                <el-option :label="$t('leadNurturing.assignSales')" value="assign_sales" />
                <el-option :label="$t('leadNurturing.addScore')" value="add_score" />
                <el-option :label="$t('leadNurturing.moveStage')" value="move_stage" />
                <el-option :label="$t('leadNurturing.createTask')" value="create_task" />
              </el-select>
              <el-input v-model="step.delay" :placeholder="$t('leadNurturing.delayTime')" style="width: 150px; margin-left: 10px" />
              <el-button type="danger" size="small" @click="removeStep(index)" style="margin-left: 10px">
                {{ $t('common.delete') }}
              </el-button>
            </div>
            <el-button type="text" @click="addStep">+ {{ $t('leadNurturing.addStep') }}</el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="workflowDialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="saveWorkflow">{{ $t('common.save') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'LeadNurturingSystem',
  data() {
    return {
      selectedStage: 'all',
      workflowDialogVisible: false,

      // 漏斗阶段
      funnelStages: [
        { id: 'visitor', name: '访客', count: 1000, avgTime: '0天' },
        { id: 'lead', name: '线索', count: 450, avgTime: '3天' },
        { id: 'mql', name: '营销合格线索', count: 280, avgTime: '7天' },
        { id: 'sql', name: '销售合格线索', count: 160, avgTime: '14天' },
        { id: 'opportunity', name: '商机', count: 85, avgTime: '21天' },
        { id: 'customer', name: '客户', count: 42, avgTime: '35天' }
      ],

      // 线索列表
      leads: [
        {
          id: 1,
          name: 'John Smith',
          company: 'ABC Manufacturing',
          stage: 'mql',
          score: 75,
          lastActivity: '2025-12-17 10:30',
          nextAction: '发送产品白皮书'
        },
        {
          id: 2,
          name: 'Maria Garcia',
          company: 'XYZ Auto Parts',
          stage: 'sql',
          score: 88,
          lastActivity: '2025-12-17 09:15',
          nextAction: '销售电话跟进'
        }
      ],

      // 自动化工作流
      workflows: [
        {
          id: 1,
          name: '新线索培育流程',
          trigger: '资源下载',
          active: true,
          steps: [
            { action: '发送欢迎邮件', delay: '立即' },
            { action: '发送案例研究', delay: '2天后' },
            { action: '分配销售跟进', delay: '5天后' }
          ],
          stats: { enrolled: 342, completed: 156, converted: 23 }
        },
        {
          id: 2,
          name: '休眠客户唤醒',
          trigger: '30天未活跃',
          active: true,
          steps: [
            { action: '发送特惠邮件', delay: '立即' },
            { action: '推送新品信息', delay: '3天后' },
            { action: '电话回访', delay: '7天后' }
          ],
          stats: { enrolled: 78, completed: 45, converted: 12 }
        }
      ],

      // 评分规则
      scoringRules: [
        { id: 1, name: '下载白皮书', points: 10, description: '访客下载技术白皮书' },
        { id: 2, name: '请求报价', points: 25, description: '访客提交报价请求' },
        { id: 3, name: '观看产品视频', points: 5, description: '观看完整产品介绍视频' },
        { id: 4, name: '邮件互动', points: 3, description: '打开营销邮件并点击链接' },
        { id: 5, name: '访问定价页', points: 15, description: '访问产品定价页面' }
      ],

      // 待办任务
      pendingTasks: [
        {
          id: 1,
          title: '跟进高价值客户 - ABC Manufacturing',
          leadName: 'John Smith',
          company: 'ABC Manufacturing',
          dueDate: '今天 15:00',
          priority: 'high',
          overdue: false,
          completed: false
        },
        {
          id: 2,
          title: '发送产品演示邀请',
          leadName: 'Maria Garcia',
          company: 'XYZ Auto Parts',
          dueDate: '明天 10:00',
          priority: 'medium',
          overdue: false,
          completed: false
        }
      ],

      // AI建议
      aiSuggestions: [
        {
          id: 1,
          icon: 'el-icon-warning',
          color: '#f56c6c',
          title: '有5个高价值线索超过7天未跟进',
          description: '建议立即安排销售电话',
          action: 'assign_sales_call'
        },
        {
          id: 2,
          icon: 'el-icon-star-off',
          color: '#409eff',
          title: 'ABC Manufacturing 对产品表现出强烈兴趣',
          description: '建议发送定制化解决方案',
          action: 'send_proposal'
        },
        {
          id: 3,
          icon: 'el-icon-data-line',
          color: '#67c23a',
          title: '本周新线索转化率提升15%',
          description: '当前策略有效，建议扩大投放',
          action: 'increase_budget'
        }
      ],

      // 新建工作流
      newWorkflow: {
        name: '',
        trigger: '',
        steps: []
      }
    }
  },

  computed: {
    filteredLeads() {
      if (this.selectedStage === 'all') {
        return this.leads
      }
      return this.leads.filter(lead => lead.stage === this.selectedStage)
    }
  },

  methods: {
    // 获取转化率
    getConversionRate(index) {
      if (index === 0) return 100
      const current = this.funnelStages[index].count
      const previous = this.funnelStages[index - 1].count
      return ((current / previous) * 100).toFixed(1)
    },

    // 获取阶段颜色
    getStageColor(index) {
      const colors = ['#67c23a', '#409eff', '#e6a23c', '#f56c6c', '#909399', '#606266']
      return colors[index] || '#909399'
    },

    // 获取阶段标签类型
    getStageTagType(stage) {
      const types = {
        visitor: 'info',
        lead: 'primary',
        mql: 'success',
        sql: 'warning',
        opportunity: 'danger',
        customer: 'success'
      }
      return types[stage] || 'info'
    },

    // 获取阶段名称
    getStageName(stageId) {
      const stage = this.funnelStages.find(s => s.id === stageId)
      return stage ? stage.name : stageId
    },

    // 获取评分颜色
    getScoreColor(score) {
      if (score >= 80) return '#67c23a'
      if (score >= 60) return '#409eff'
      if (score >= 40) return '#e6a23c'
      return '#f56c6c'
    },

    // 查看线索详情
    viewLead(lead) {
      this.$router.push(`/lead-detail/${lead.id}`)
    },

    // 执行操作
    executeAction(lead) {
      this.$message.success(`正在执行：${lead.nextAction}`)
    },

    // 创建工作流
    createWorkflow() {
      this.newWorkflow = {
        name: '',
        trigger: '',
        steps: []
      }
      this.workflowDialogVisible = true
    },

    // 添加步骤
    addStep() {
      this.newWorkflow.steps.push({
        action: '',
        delay: ''
      })
    },

    // 删除步骤
    removeStep(index) {
      this.newWorkflow.steps.splice(index, 1)
    },

    // 保存工作流
    saveWorkflow() {
      if (!this.newWorkflow.name || !this.newWorkflow.trigger) {
        this.$message.warning(this.$t('leadNurturing.fillRequired'))
        return
      }
      this.$message.success(this.$t('leadNurturing.workflowCreated'))
      this.workflowDialogVisible = false
    },

    // 切换工作流状态
    toggleWorkflow(workflow) {
      this.$message.success(
        workflow.active 
          ? this.$t('leadNurturing.workflowActivated')
          : this.$t('leadNurturing.workflowDeactivated')
      )
    },

    // 管理评分规则
    manageScoringRules() {
      this.$router.push('/scoring-rules')
    },

    // 完成任务
    completeTask(task) {
      if (task.completed) {
        this.$message.success(this.$t('leadNurturing.taskCompleted'))
      }
    },

    // 应用AI建议
    applySuggestion(suggestion) {
      this.$message.success(`正在执行：${suggestion.title}`)
    }
  }
}
</script>

<style scoped>
.lead-nurturing-system {
  padding: 20px;
}

.page-header h1 {
  font-size: 28px;
  margin-bottom: 10px;
}

.description {
  color: #666;
  font-size: 14px;
}

.funnel-visualization {
  padding: 30px 0;
}

.funnel-stage {
  margin: 0 auto 20px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: white;
  transition: all 0.3s;
}

.funnel-stage:hover {
  transform: scale(1.02);
}

.stage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.stage-header h3 {
  margin: 0;
  font-size: 18px;
}

.stage-count {
  font-size: 24px;
  font-weight: bold;
}

.stage-details {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  font-size: 12px;
  opacity: 0.9;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.workflow-item {
  padding: 20px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  margin-bottom: 15px;
}

.workflow-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.workflow-header h4 {
  margin: 0 0 5px 0;
}

.workflow-trigger {
  font-size: 12px;
  color: #909399;
}

.workflow-steps {
  margin: 20px 0;
}

.workflow-stats {
  display: flex;
  gap: 20px;
  font-size: 12px;
  color: #606266;
}

.rule-item {
  padding: 15px;
  border-left: 3px solid #409eff;
  background: #f5f7fa;
  margin-bottom: 10px;
  border-radius: 4px;
}

.rule-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.rule-name {
  font-weight: bold;
}

.rule-description {
  margin: 0;
  font-size: 12px;
  color: #606266;
}

.task-item {
  padding: 15px;
  border-bottom: 1px solid #ebeef5;
}

.task-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.task-overdue {
  color: #f56c6c;
}

.task-lead {
  margin: 5px 0;
  font-size: 12px;
  color: #909399;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.task-due {
  font-size: 12px;
  color: #606266;
}

.suggestion-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  margin-bottom: 15px;
}

.suggestion-icon {
  font-size: 24px;
}

.suggestion-content h5 {
  margin: 0 0 5px 0;
}

.suggestion-content p {
  margin: 0 0 10px 0;
  font-size: 12px;
  color: #606266;
}

.step-editor {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.workflow-steps-editor {
  padding: 15px;
  background: #f5f7fa;
  border-radius: 4px;
}
</style>
