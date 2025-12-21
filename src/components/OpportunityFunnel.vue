<template>
  <div class="opportunity-funnel">
    <!-- 商机总览Header -->
    <el-card class="funnel-header" shadow="hover">
      <div class="header-content">
        <div class="header-left">
          <h2>{{ opportunity.name }}</h2>
          <div class="meta-info">
            <el-tag>{{ opportunity.customer }}</el-tag>
            <span class="amount">¥{{ (opportunity.amount / 10000).toFixed(1) }}万</span>
          </div>
        </div>
        <div class="header-right">
          <el-button @click="goHome">
            <el-icon><HomeFilled /></el-icon>
            返回主页
          </el-button>
          <el-button type="primary" @click="contactMapVisible = true">
            <el-icon><UserIcon /></el-icon>
            联系人关系图谱 ({{ customerContacts.length }})
          </el-button>
          <div class="total-win-rate">
            <div class="label">总赢率</div>
            <div class="value" :class="getTrendClass(opportunity.winRateTrend)">
              <span class="rate">{{ opportunity.winRate }}%</span>
              <el-icon v-if="opportunity.winRateTrend > 0"><CaretTop /></el-icon>
              <el-icon v-else-if="opportunity.winRateTrend < 0"><CaretBottom /></el-icon>
              <span class="trend">{{ opportunity.winRateTrend > 0 ? '+' : '' }}{{ opportunity.winRateTrend }}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 阶段进度条 -->
      <div class="stage-progress-bar">
        <el-steps :active="currentStageIndex" align-center>
          <el-step 
            v-for="(stage, index) in stages" 
            :key="stage.id"
            :title="stage.name"
            :description="`${stage.winRate}%`"
          />
        </el-steps>
      </div>
    </el-card>

    <!-- 漏斗阶段列表 - 时间线式纵向布局 -->
    <div class="funnel-stages-timeline">
      <div 
        v-for="(stage, index) in stages" 
        :key="stage.id"
        class="timeline-stage"
        :class="getRiskClass(stage.winRate)"
      >
        <!-- 时间线式三列布局 -->
        <div class="timeline-row" @click="toggleStage(stage.id)">
          <!-- 左侧：漏斗形状 + 阶段名称 -->
          <div class="timeline-left">
            <div class="funnel-shape" :style="getFunnelStyle(index, stages.length)">
              <div class="stage-number">{{ index + 1 }}</div>
              <div class="funnel-content">
                <h3 class="stage-name">{{ stage.name }}</h3>
                <div class="stage-time">{{ stage.startDate || '待开始' }}</div>
              </div>
            </div>
            <!-- 时间线连接线 -->
            <div v-if="index < stages.length - 1" class="timeline-connector"></div>
          </div>

          <!-- 中间：赢率指标 -->
          <div class="timeline-center">
            <div class="win-rate-card" :class="getRiskClass(stage.winRate)">
              <div class="rate-header">
                <span class="rate-label">赢率</span>
                <el-tag :type="getRiskTagType(stage.winRate)" size="small">
                  {{ getRiskLabel(stage.winRate) }}
                </el-tag>
              </div>
              <div class="rate-value">
                <span class="rate">{{ stage.winRate }}%</span>
                <span class="trend" :class="getTrendClass(stage.trend)">
                  <el-icon v-if="stage.trend > 0"><CaretTop /></el-icon>
                  <el-icon v-else-if="stage.trend < 0"><CaretBottom /></el-icon>
                  {{ stage.trend > 0 ? '+' : '' }}{{ stage.trend }}%
                </span>
              </div>
              <el-progress 
                :percentage="stage.winRate" 
                :color="getProgressColor(stage.winRate)"
                :stroke-width="8"
                :show-text="false"
              />
              <div class="rate-footer">
                <span class="predicted">预测下阶段: {{ stage.predictedNextRate }}%</span>
              </div>
            </div>
          </div>

          <!-- 右侧：标志事件（可多选/多填） -->
          <div class="timeline-right">
            <div class="milestone-events-section">
              <div class="events-header">
                <h4>📋 标志事件</h4>
                <el-button 
                  size="small" 
                  type="primary" 
                  text
                  @click.stop="addEvent(stage.id)"
                >
                  <el-icon><Plus /></el-icon>
                  添加
                </el-button>
              </div>
              
              <!-- 事件列表 -->
              <div class="events-timeline">
                <div 
                  v-for="event in stage.events" 
                  :key="event.id"
                  class="event-badge"
                  :class="{ positive: event.impact > 0, negative: event.impact < 0 }"
                  @click.stop="editEvent(event)"
                >
                  <el-icon class="event-icon">
                    <component :is="getEventIcon(event.type)" />
                  </el-icon>
                  <div class="event-info">
                    <span class="event-type">{{ event.type }}</span>
                    <span class="event-time">{{ event.time }}</span>
                  </div>
                  <el-tag 
                    :type="event.impact > 0 ? 'success' : 'danger'" 
                    size="small"
                    class="impact-tag"
                  >
                    {{ event.impact > 0 ? '+' : '' }}{{ event.impact }}%
                  </el-tag>
                </div>
                
                <!-- 空状态 -->
                <div v-if="!stage.events || stage.events.length === 0" class="empty-events">
                  <el-icon><DocumentAdd /></el-icon>
                  <span>暂无标志事件，点击"添加"创建</span>
                </div>
              </div>
            </div>
            
            <!-- 展开/收起图标 -->
            <el-icon class="expand-icon" :class="{ expanded: expandedStages.includes(stage.id) }">
              <ArrowDown />
            </el-icon>
          </div>
        </div>

        <!-- 阶段详细内容（可折叠） -->
        <el-collapse-transition>
          <div v-show="expandedStages.includes(stage.id)" class="stage-content">
            <el-row :gutter="20">
              <!-- 左侧：关键事件 -->
              <el-col :span="12">
                <div class="key-events-section">
                  <div class="section-header">
                    <h4>📋 关键事件</h4>
                    <el-button 
                      size="small" 
                      type="primary" 
                      @click="addEvent(stage.id)"
                    >
                      <el-icon><Plus /></el-icon>
                      添加事件
                    </el-button>
                  </div>
                  
                  <div class="events-list">
                    <div 
                      v-for="event in stage.events" 
                      :key="event.id"
                      class="event-item"
                      :class="{ positive: event.impact > 0, negative: event.impact < 0 }"
                    >
                      <div class="event-header">
                        <el-icon class="event-icon">
                          <component :is="getEventIcon(event.type)" />
                        </el-icon>
                        <span class="event-type">{{ event.type }}</span>
                        <span class="event-time">{{ event.time }}</span>
                      </div>
                      <div class="event-content">
                        <p>{{ event.description }}</p>
                        <div class="event-footer">
                          <el-tag 
                            :type="event.impact > 0 ? 'success' : 'danger'" 
                            size="small"
                          >
                            赢率影响: {{ event.impact > 0 ? '+' : '' }}{{ event.impact }}%
                          </el-tag>
                          <div class="event-actions">
                            <el-button size="small" text @click="editEvent(event)">
                              <el-icon><Edit /></el-icon>
                            </el-button>
                            <el-button size="small" text type="danger" @click="deleteEvent(event)">
                              <el-icon><Delete /></el-icon>
                            </el-button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-col>

              <!-- 右侧：客户分析 -->
              <el-col :span="12">
                <!-- 客户主动性分析 -->
                <div class="customer-activity-section mb-4">
                  <div class="section-header">
                    <h4>📊 客户主动性分析</h4>
                    <el-tooltip content="基于邮件回复率、会议参与度等维度综合评分">
                      <el-icon><QuestionFilled /></el-icon>
                    </el-tooltip>
                  </div>
                  
                  <div class="activity-chart">
                    <!-- 雷达图显示 -->
                    <div class="radar-chart">
                      <div class="metrics-list">
                        <div 
                          v-for="metric in stage.customerActivity" 
                          :key="metric.name"
                          class="metric-item"
                        >
                          <div class="metric-label">{{ metric.name }}</div>
                          <el-progress 
                            :percentage="metric.score" 
                            :color="getActivityColor(metric.score)"
                          />
                          <div class="metric-value">{{ metric.score }}分</div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="activity-summary">
                      <div class="summary-item">
                        <span class="label">综合评分:</span>
                        <span class="value" :class="getActivityLevelClass(stage.activityScore)">
                          {{ stage.activityScore }}分
                        </span>
                      </div>
                      <div class="summary-item">
                        <span class="label">活跃等级:</span>
                        <el-tag :type="getActivityTagType(stage.activityScore)">
                          {{ getActivityLevel(stage.activityScore) }}
                        </el-tag>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 客户个人画像 -->
                <div class="persona-insights-section">
                  <div class="section-header">
                    <h4>👤 客户个人画像</h4>
                  </div>
                  
                  <div class="persona-card">
                    <div class="persona-row">
                      <span class="label">角色/职位:</span>
                      <span class="value">{{ stage.persona.role }}</span>
                    </div>
                    <div class="persona-row">
                      <span class="label">决策权级别:</span>
                      <el-rate v-model="stage.persona.decisionLevel" disabled />
                    </div>
                    <div class="persona-row">
                      <span class="label">兴趣偏好:</span>
                      <el-tag 
                        v-for="interest in stage.persona.interests" 
                        :key="interest"
                        size="small"
                        class="mr-2"
                      >
                        {{ interest }}
                      </el-tag>
                    </div>
                    <div class="persona-row">
                      <span class="label">沟通偏好:</span>
                      <span class="value">{{ stage.persona.communicationStyle }}</span>
                    </div>
                    <div class="persona-row">
                      <span class="label">态度评分:</span>
                      <el-tag :type="getAttitudeType(stage.persona.attitude)">
                        {{ stage.persona.attitude }}
                      </el-tag>
                    </div>
                    <div class="persona-row">
                      <span class="label">下一步预测:</span>
                      <div class="predicted-behavior">
                        <el-icon><TrendCharts /></el-icon>
                        <span>{{ stage.persona.predictedBehavior }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>

            <!-- 跨阶段预测 -->
            <div class="stage-prediction">
              <el-alert 
                type="info" 
                :closable="false"
                show-icon
              >
                <template #title>
                  <strong>AI预测:</strong> 
                  基于当前阶段数据，预测下一阶段赢率为 
                  <span class="predicted-rate">{{ stage.predictedNextRate }}%</span>
                  {{ stage.predictedNextRate > stage.winRate ? '↑' : '↓' }}
                </template>
              </el-alert>
            </div>
          </div>
        </el-collapse-transition>
      </div>
    </div>

    <!-- AI推荐行动面板 -->
    <el-card class="ai-action-panel" shadow="hover">
      <template #header>
        <div class="panel-header">
          <h3>
            <el-icon color="#FFA500"><Lightning /></el-icon>
            AI推荐行动
          </h3>
          <el-button size="small" @click="refreshAIActions">
            <el-icon><Refresh /></el-icon>
            刷新推荐
          </el-button>
        </div>
      </template>
      
      <div class="ai-actions-list">
        <div 
          v-for="action in aiActions" 
          :key="action.id"
          class="ai-action-item"
          :class="'priority-' + action.priority"
        >
          <div class="action-header">
            <el-tag :type="getPriorityType(action.priority)">
              {{ getPriorityLabel(action.priority) }}
            </el-tag>
            <h4>{{ action.title }}</h4>
          </div>
          <p class="action-reason">{{ action.reason }}</p>
          <div class="action-footer">
            <el-button type="primary" size="small" @click="executeAction(action)">
              <el-icon><Check /></el-icon>
              立即执行
            </el-button>
            <el-button size="small" @click="ignoreAction(action)">
              <el-icon><Close /></el-icon>
              忽略
            </el-button>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 添加事件对话框 -->
    <el-dialog 
      v-model="eventDialogVisible" 
      title="添加关键事件" 
      width="700px"
    >
      <el-form :model="newEvent" label-width="120px">
        <el-form-item label="事件类型">
          <el-select v-model="newEvent.type" placeholder="请选择事件类型" @change="handleEventTypeChange">
            <el-option label="预约情况" value="预约情况" />
            <el-option label="拜访情况" value="拜访情况" />
            <el-option label="技术交流" value="技术交流" />
            <el-option label="再次预约拜访" value="再次预约拜访" />
            <el-option label="客户主动询问" value="客户主动询问" />
            <el-option label="决策者参与" value="决策者参与" />
            <el-option label="预算批准" value="预算批准" />
            <el-option label="竞品活动" value="竞品活动" />
            <el-option label="新增联系人" value="新增联系人" />
          </el-select>
        </el-form-item>

        <!-- 当选择"新增联系人"时显示联系人表单 -->
        <template v-if="newEvent.type === '新增联系人'">
          <el-divider content-position="left">
            <el-icon><UserIcon /></el-icon>
            联系人信息
          </el-divider>
          
          <el-form-item label="姓名" required>
            <el-input v-model="newContact.name" placeholder="请输入姓名" />
          </el-form-item>
          
          <el-form-item label="职位/角色" required>
            <el-input v-model="newContact.title" placeholder="如：采购经理" />
          </el-form-item>
          
          <el-form-item label="部门">
            <el-select v-model="newContact.department" placeholder="请选择部门">
              <el-option label="采购部" value="采购部" />
              <el-option label="技术部" value="技术部" />
              <el-option label="生产部" value="生产部" />
              <el-option label="质检部" value="质检部" />
              <el-option label="市场部" value="市场部" />
              <el-option label="销售部" value="销售部" />
              <el-option label="财务部" value="财务部" />
              <el-option label="管理层" value="管理层" />
              <el-option label="其他" value="其他" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="决策角色">
            <el-select v-model="newContact.role" placeholder="在决策中的角色">
              <el-option label="决策者 (拍板人)" value="decision_maker" />
              <el-option label="推动者 (内部支持)" value="champion" />
              <el-option label="影响者 (建议者)" value="influencer" />
              <el-option label="反对者 (阻碍者)" value="blocker" />
              <el-option label="使用者 (最终用户)" value="end_user" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="决策权级别">
            <el-rate v-model="newContact.decisionLevel" show-text :texts="['很低', '较低', '中等', '较高', '很高']" />
          </el-form-item>
          
          <el-form-item label="电话">
            <el-input v-model="newContact.phone" placeholder="联系电话" />
          </el-form-item>
          
          <el-form-item label="邮箱">
            <el-input v-model="newContact.email" placeholder="电子邮箱" />
          </el-form-item>
          
          <el-form-item label="微信">
            <el-input v-model="newContact.wechat" placeholder="微信号" />
          </el-form-item>
          
          <el-form-item label="主要对接事务">
            <el-checkbox-group v-model="newContact.responsibilities">
              <el-checkbox label="技术沟通" />
              <el-checkbox label="生产现场" />
              <el-checkbox label="设备管理" />
              <el-checkbox label="仓库收货" />
              <el-checkbox label="产品验收" />
              <el-checkbox label="质检" />
              <el-checkbox label="工具管理和标定" />
              <el-checkbox label="采购报价" />
              <el-checkbox label="询价" />
              <el-checkbox label="签合同" />
              <el-checkbox label="收发票" />
            </el-checkbox-group>
          </el-form-item>
          
          <el-form-item label="汇报上级">
            <el-select v-model="newContact.reportsTo" placeholder="选择直接上级" clearable>
              <el-option 
                v-for="contact in customerContacts" 
                :key="contact.id"
                :label="`${contact.name} - ${contact.title}`"
                :value="contact.id"
              />
            </el-select>
          </el-form-item>
          
          <el-form-item label="组织层级">
            <el-radio-group v-model="newContact.level">
              <el-radio label="高层" />
              <el-radio label="中层" />
              <el-radio label="基层" />
            </el-radio-group>
          </el-form-item>
          
          <el-form-item label="兴趣偏好">
            <el-select v-model="newContact.interests" multiple placeholder="选择兴趣点">
              <el-option label="技术创新" value="技术创新" />
              <el-option label="性价比" value="性价比" />
              <el-option label="品牌信誉" value="品牌信誉" />
              <el-option label="售后服务" value="售后服务" />
              <el-option label="交付速度" value="交付速度" />
              <el-option label="产品质量" value="产品质量" />
            </el-select>
          </el-form-item>
          
          <el-form-item label="沟通偏好">
            <el-input v-model="newContact.communicationStyle" placeholder="如：电话沟通优先，喜欢技术细节" />
          </el-form-item>
          
          <el-form-item label="当前态度">
            <el-radio-group v-model="newContact.attitude">
              <el-radio label="非常积极" />
              <el-radio label="积极" />
              <el-radio label="中立" />
              <el-radio label="消极" />
              <el-radio label="非常消极" />
            </el-radio-group>
          </el-form-item>
        </template>

        <!-- 通用事件字段 -->
        <template v-if="newEvent.type !== '新增联系人'">
          <el-form-item label="关联联系人">
            <el-select v-model="newEvent.contactId" placeholder="选择相关联系人" clearable>
              <el-option 
                v-for="contact in customerContacts" 
                :key="contact.id"
                :label="`${contact.name} - ${contact.title}`"
                :value="contact.id"
              />
            </el-select>
          </el-form-item>
        </template>

        <el-form-item label="事件时间">
          <el-date-picker 
            v-model="newEvent.time" 
            type="datetime" 
            placeholder="选择时间"
          />
        </el-form-item>
        
        <el-form-item label="事件描述">
          <el-input 
            v-model="newEvent.description" 
            type="textarea" 
            :rows="3"
            :placeholder="newEvent.type === '新增联系人' ? '首次接触情况、获取方式等' : '详细描述事件内容'"
          />
        </el-form-item>
        
        <el-form-item label="赢率影响">
          <el-slider 
            v-model="newEvent.impact" 
            :min="-20" 
            :max="20" 
            :marks="{ '-20': '-20%', '0': '0%', '20': '+20%' }"
            show-stops
          />
          <div class="impact-hint">
            <el-tag v-if="newEvent.type === '新增联系人' && newContact.role === 'decision_maker'" type="success">
              提示：决策者通常有 +10% ~ +15% 的赢率影响
            </el-tag>
            <el-tag v-else-if="newEvent.type === '新增联系人' && newContact.role === 'champion'" type="success">
              提示：推动者通常有 +8% ~ +12% 的赢率影响
            </el-tag>
          </div>
        </el-form-item>
        
        <el-form-item label="备注">
          <el-input v-model="newEvent.notes" placeholder="可选" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="eventDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEvent">保存</el-button>
      </template>
    </el-dialog>

    <!-- 客户联系人关系图谱对话框 -->
    <el-dialog 
      v-model="contactMapVisible" 
      title="客户联系人关系图谱" 
      width="90%"
      top="5vh"
    >
      <div class="contact-map-container">
        <!-- 工具栏 -->
        <div class="map-toolbar">
          <el-button type="primary" @click="showContactDialog = true">
            <el-icon><Plus /></el-icon>
            添加联系人
          </el-button>
          <el-button @click="refreshContactMap">
            <el-icon><Refresh /></el-icon>
            刷新图谱
          </el-button>
          <el-button @click="openCustomer360">
            <el-icon><UserIcon /></el-icon>
            查看客户360°
          </el-button>
        </div>

        <!-- 组织架构图 -->
        <div class="org-chart-view">
          <h3>组织架构（{{ customerContacts.length }}位联系人）</h3>
          
          <!-- 高层 -->
          <div class="org-level high-level">
            <div class="level-label">高层管理</div>
            <div class="contacts-row">
              <div 
                v-for="contact in getContactsByLevel('高层')" 
                :key="contact.id"
                class="contact-card"
                :class="getRoleClass(contact.role)"
                @click="viewContactDetail(contact)"
              >
                <el-avatar :size="60">{{ contact.name.charAt(0) }}</el-avatar>
                <div class="contact-info">
                  <div class="name">{{ contact.name }}</div>
                  <div class="title">{{ contact.title }}</div>
                  <div class="org-info">
                    <span v-if="contact.factory" class="factory">{{ contact.factory }}</span>
                    <span v-if="contact.workshop" class="workshop">{{ contact.workshop }}</span>
                    <span class="department">{{ contact.department }}</span>
                  </div>
                  <el-tag size="small" :type="getRoleTagType(contact.role)">
                    {{ getRoleLabel(contact.role) }}
                  </el-tag>
                  <el-rate v-model="contact.decisionLevel" disabled size="small" />
                  <div v-if="contact.workNature && contact.workNature.length" class="work-nature">
                    <el-tag size="small" v-for="nature in contact.workNature" :key="nature" type="info">
                      {{ nature }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <el-divider><el-icon><ArrowDown /></el-icon></el-divider>

          <!-- 中层 -->
          <div class="org-level mid-level">
            <div class="level-label">中层管理</div>
            <div class="contacts-row">
              <div 
                v-for="contact in getContactsByLevel('中层')" 
                :key="contact.id"
                class="contact-card"
                :class="getRoleClass(contact.role)"
                @click="viewContactDetail(contact)"
              >
                <el-avatar :size="50">{{ contact.name.charAt(0) }}</el-avatar>
                <div class="contact-info">
                  <div class="name">{{ contact.name }}</div>
                  <div class="title">{{ contact.title }}</div>
                  <div class="org-info">
                    <span v-if="contact.factory" class="factory">{{ contact.factory }}</span>
                    <span v-if="contact.workshop" class="workshop">{{ contact.workshop }}</span>
                    <span class="department">{{ contact.department }}</span>
                  </div>
                  <el-tag size="small" :type="getRoleTagType(contact.role)">
                    {{ getRoleLabel(contact.role) }}
                  </el-tag>
                  <el-rate v-model="contact.decisionLevel" disabled size="small" />
                  <div v-if="contact.reportsTo" class="reports-to">
                    向上汇报: {{ getContactName(contact.reportsTo) }}
                  </div>
                  <div v-if="contact.workRelation && contact.workRelation.length" class="work-relation">
                    <el-tag size="small" v-for="relation in contact.workRelation.slice(0, 2)" :key="relation" type="warning">
                      {{ relation }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <el-divider><el-icon><ArrowDown /></el-icon></el-divider>

          <!-- 基层 -->
          <div class="org-level base-level">
            <div class="level-label">基层执行</div>
            <div class="contacts-row">
              <div 
                v-for="contact in getContactsByLevel('基层')" 
                :key="contact.id"
                class="contact-card"
                :class="getRoleClass(contact.role)"
                @click="viewContactDetail(contact)"
              >
                <el-avatar :size="40">{{ contact.name.charAt(0) }}</el-avatar>
                <div class="contact-info">
                  <div class="name">{{ contact.name }}</div>
                  <div class="title">{{ contact.title }}</div>
                  <div class="org-info">
                    <span v-if="contact.factory" class="factory">{{ contact.factory }}</span>
                    <span v-if="contact.workshop" class="workshop">{{ contact.workshop }}</span>
                    <span class="department">{{ contact.department }}</span>
                  </div>
                  <el-tag size="small" :type="getRoleTagType(contact.role)">
                    {{ getRoleLabel(contact.role) }}
                  </el-tag>
                  <div v-if="contact.reportsTo" class="reports-to">
                    向上汇报: {{ getContactName(contact.reportsTo) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 联系人统计 -->
        <el-row :gutter="20" class="mt-4">
          <el-col :span="6">
            <el-statistic title="决策者" :value="getContactsByRole('decision_maker').length" />
          </el-col>
          <el-col :span="6">
            <el-statistic title="推动者" :value="getContactsByRole('champion').length" />
          </el-col>
          <el-col :span="6">
            <el-statistic title="影响者" :value="getContactsByRole('influencer').length" />
          </el-col>
          <el-col :span="6">
            <el-statistic title="反对者" :value="getContactsByRole('blocker').length" />
          </el-col>
        </el-row>
      </div>
    </el-dialog>

    <!-- 联系人详情对话框 -->
    <el-dialog 
      v-model="contactDetailVisible" 
      :title="`${currentContact?.name} - 详细信息`"
      width="900px"
    >
      <div v-if="currentContact" class="contact-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="姓名">{{ currentContact.name }}</el-descriptions-item>
          <el-descriptions-item label="职位">{{ currentContact.title }}</el-descriptions-item>
          <el-descriptions-item label="性别">{{ currentContact.gender }}</el-descriptions-item>
          <el-descriptions-item label="分厂">{{ currentContact.factory || '无' }}</el-descriptions-item>
          <el-descriptions-item label="车间">{{ currentContact.workshop || '无' }}</el-descriptions-item>
          <el-descriptions-item label="部门">{{ currentContact.department }}</el-descriptions-item>
          <el-descriptions-item label="组织层级">
            <el-tag>{{ currentContact.level }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="决策角色">
            <el-tag :type="getRoleTagType(currentContact.role)">
              {{ getRoleLabel(currentContact.role) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="决策权级别">
            <el-rate v-model="currentContact.decisionLevel" disabled />
          </el-descriptions-item>
          <el-descriptions-item label="电话">{{ currentContact.phone }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ currentContact.email }}</el-descriptions-item>
          <el-descriptions-item label="微信">{{ currentContact.wechat }}</el-descriptions-item>
          <el-descriptions-item label="汇报上级">
            {{ currentContact.reportsTo ? getContactName(currentContact.reportsTo) : '无' }}
          </el-descriptions-item>
          <el-descriptions-item label="当前态度">
            <el-tag :type="getAttitudeType(currentContact.attitude)">
              {{ currentContact.attitude }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <el-divider />

        <h4>工作性质</h4>
        <el-tag 
          v-for="nature in currentContact.workNature" 
          :key="nature"
          type="info"
          class="mr-2 mb-2"
        >
          {{ nature }}
        </el-tag>

        <el-divider />

        <h4>工作关系</h4>
        <el-tag 
          v-for="relation in currentContact.workRelation" 
          :key="relation"
          type="warning"
          class="mr-2 mb-2"
        >
          {{ relation }}
        </el-tag>

        <el-divider />

        <h4>主要对接事务</h4>
        <el-tag 
          v-for="responsibility in currentContact.responsibilities" 
          :key="responsibility"
          class="mr-2 mb-2"
        >
          {{ responsibility }}
        </el-tag>

        <el-divider />

        <h4>兴趣偏好</h4>
        <el-tag 
          v-for="interest in currentContact.interests" 
          :key="interest"
          type="success"
          class="mr-2 mb-2"
        >
          {{ interest }}
        </el-tag>

        <el-divider />

        <h4>沟通偏好</h4>
        <p>{{ currentContact.communicationStyle }}</p>

        <el-divider />

        <h4>互动历史（最近5次）</h4>
        <el-timeline>
          <el-timeline-item
            v-for="event in getContactEvents(currentContact.id)"
            :key="event.id"
            :timestamp="event.time"
          >
            <p><strong>{{ event.type }}</strong></p>
            <p>{{ event.description }}</p>
          </el-timeline-item>
        </el-timeline>
      </div>
      <template #footer>
        <el-button @click="editContact(currentContact)">编辑</el-button>
        <el-button type="primary" @click="contactDetailVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  CaretTop, CaretBottom, ArrowDown, Plus, Edit, Delete, 
  QuestionFilled, TrendCharts, Lightning, Refresh, Check, Close,
  Phone, Message, VideoCamera, Document, Calendar, User as UserIcon, HomeFilled,
  DocumentAdd
} from '@element-plus/icons-vue'

const router = useRouter()

// Props
const props = defineProps({
  opportunityId: {
    type: String,
    required: true
  }
})

// 商机基本信息
const opportunity = ref({
  id: props.opportunityId,
  name: '2025年工具采购项目',
  customer: '明升汽车',
  amount: 800000,
  winRate: 68,
  winRateTrend: 12
})

// 当前阶段索引
const currentStageIndex = ref(2)

// 展开的阶段
const expandedStages = ref(['stage-1', 'stage-2'])

// 6个漏斗阶段
const stages = ref([
  {
    id: 'stage-1',
    name: '潜在客户',
    startDate: '2025-12-18',
    winRate: 70,
    trend: 5,
    activityScore: 75,
    predictedNextRate: 68,
    events: [
      {
        id: 'e1',
        type: '预约情况',
        time: '2025-12-18 10:00',
        description: '成功预约电话沟通，客户表示感兴趣',
        impact: 5,
        notes: '态度积极'
      },
      {
        id: 'e2',
        type: '客户主动询问',
        time: '2025-12-17 14:30',
        description: '客户主动发邮件询问产品规格',
        impact: 7,
        notes: '主动性强'
      }
    ],
    customerActivity: [
      { name: '邮件回复率', score: 85 },
      { name: '会议参与度', score: 70 },
      { name: '技术交流参与度', score: 60 },
      { name: '主动提出需求', score: 80 }
    ],
    persona: {
      role: '采购经理',
      decisionLevel: 4,
      interests: ['技术方案', '性价比'],
      communicationStyle: '邮件为主，偏好详细资料',
      attitude: '积极',
      predictedBehavior: '可能在3天内主动预约技术交流'
    }
  },
  {
    id: 'stage-2',
    name: '联系人',
    startDate: '2025-12-16',
    winRate: 65,
    trend: -2,
    activityScore: 68,
    predictedNextRate: 63,
    events: [
      {
        id: 'e3',
        type: '拜访情况',
        time: '2025-12-16 15:00',
        description: '首次拜访，见到采购和技术负责人',
        impact: 4,
        notes: '技术负责人较认可'
      },
      {
        id: 'e4',
        type: '技术交流',
        time: '2025-12-15 10:00',
        description: '技术部门提出具体需求',
        impact: 2,
        notes: '需求明确'
      }
    ],
    customerActivity: [
      { name: '邮件回复率', score: 75 },
      { name: '会议参与度', score: 65 },
      { name: '技术交流参与度', score: 70 },
      { name: '主动提出需求', score: 60 }
    ],
    persona: {
      role: '部门负责人',
      decisionLevel: 3,
      interests: ['价格敏感', '交付周期'],
      communicationStyle: '电话沟通，快速决策',
      attitude: '中立',
      predictedBehavior: '需要提供详细报价'
    }
  },
  {
    id: 'stage-3',
    name: '首次接触',
    startDate: '2025-12-14',
    winRate: 60,
    trend: 0,
    activityScore: 55,
    predictedNextRate: 58,
    events: [
      {
        id: 'e5',
        type: '预约情况',
        time: '2025-12-14 11:00',
        description: '电话会议，介绍产品方案',
        impact: 3,
        notes: '基本了解'
      },
      {
        id: 'e6',
        type: '客户主动询问',
        time: '2025-12-13 16:00',
        description: '客户提出具体应用场景需求',
        impact: 5,
        notes: '需求明确'
      }
    ],
    customerActivity: [
      { name: '邮件回复率', score: 60 },
      { name: '会议参与度', score: 55 },
      { name: '技术交流参与度', score: 50 },
      { name: '主动提出需求', score: 55 }
    ],
    persona: {
      role: '技术工程师',
      decisionLevel: 2,
      interests: ['技术细节', '实施方案'],
      communicationStyle: '倾向于书面沟通',
      attitude: '中立',
      predictedBehavior: '需要技术演示'
    }
  },
  {
    id: 'stage-4',
    name: '技术交流',
    winRate: 58,
    trend: -3,
    activityScore: 50,
    predictedNextRate: 55,
    events: [
      {
        id: 'e7',
        type: '技术交流',
        time: '2025-12-12 14:00',
        description: '技术交流会议，讨论方案细节',
        impact: 2,
        notes: '有疑问待解决'
      },
      {
        id: 'e8',
        type: '竞品活动',
        time: '2025-12-11 10:00',
        description: '竞品进行了现场演示',
        impact: -10,
        notes: '竞争加剧'
      }
    ],
    customerActivity: [
      { name: '邮件回复率', score: 50 },
      { name: '会议参与度', score: 45 },
      { name: '技术交流参与度', score: 55 },
      { name: '主动提出需求', score: 50 }
    ],
    persona: {
      role: '技术主管',
      decisionLevel: 3,
      interests: ['技术先进性', '稳定性'],
      communicationStyle: '专业详细',
      attitude: '谨慎',
      predictedBehavior: '需要对比竞品资料'
    }
  },
  {
    id: 'stage-5',
    name: '再次预约/拜访',
    startDate: '2025-12-10',
    winRate: 55,
    trend: -5,
    activityScore: 45,
    predictedNextRate: 52,
    events: [
      {
        id: 'e9',
        type: '再次预约拜访',
        time: '2025-12-10 15:00',
        description: '再次拜访预约，客户有疑虑',
        impact: 3,
        notes: '需要解答'
      },
      {
        id: 'e10',
        type: '客户主动询问',
        time: '2025-12-09 11:00',
        description: '客户提出价格异议',
        impact: -2,
        notes: '价格敏感'
      }
    ],
    customerActivity: [
      { name: '邮件回复率', score: 45 },
      { name: '会议参与度', score: 40 },
      { name: '技术交流参与度', score: 50 },
      { name: '主动提出需求', score: 45 }
    ],
    persona: {
      role: '采购总监',
      decisionLevel: 5,
      interests: ['价格', 'ROI'],
      communicationStyle: '直接务实',
      attitude: '消极',
      predictedBehavior: '可能要求大幅降价'
    }
  },
  {
    id: 'stage-6',
    name: '决策/签单',
    startDate: '2025-12-08',
    winRate: 50,
    trend: -8,
    activityScore: 40,
    predictedNextRate: 48,
    events: [
      {
        id: 'e11',
        type: '决策者参与',
        time: '2025-12-08 10:00',
        description: '内部决策延迟',
        impact: -5,
        notes: '预算审批中'
      },
      {
        id: 'e12',
        type: '预算批准',
        time: '2025-12-07 14:00',
        description: '客户批准意见，等待最终决策',
        impact: 4,
        notes: '进入最后阶段'
      }
    ],
    customerActivity: [
      { name: '邮件回复率', score: 40 },
      { name: '会议参与度', score: 35 },
      { name: '技术交流参与度', score: 45 },
      { name: '主动提出需求', score: 40 }
    ],
    persona: {
      role: '总经理',
      decisionLevel: 5,
      interests: ['整体价值', '长期合作'],
      communicationStyle: '高层会谈',
      attitude: '谨慎',
      predictedBehavior: '可能需要最终谈判'
    }
  }
])

// AI推荐行动
const aiActions = ref([
  {
    id: 'a1',
    priority: 'high',
    title: '立即跟进技术负责人',
    reason: '技术交流阶段赢率下降-3%，竞品活动影响较大，需及时应对',
    action: '发送技术对比邮件'
  },
  {
    id: 'a2',
    priority: 'high',
    title: '准备竞品对比报告',
    reason: '竞品压力增加(-10%)，需要提供差异化优势分析',
    action: '生成对比文档'
  },
  {
    id: 'a3',
    priority: 'medium',
    title: '安排技术演示会议',
    reason: '客户技术团队需要更直观的产品演示',
    action: '预约会议'
  },
  {
    id: 'a4',
    priority: 'medium',
    title: '提供价格优化方案',
    reason: '客户对价格敏感，建议提供分期付款或捆绑优惠',
    action: '准备报价'
  },
  {
    id: 'a5',
    priority: 'low',
    title: '邀请参加产品培训',
    reason: '加深关系，提升客户粘性',
    action: '发送邀请'
  }
])

// 联系人管理相关
const contactMapVisible = ref(false)
const contactDetailVisible = ref(false)
const showContactDialog = ref(false)
const currentContact = ref(null)

// 客户联系人列表
const customerContacts = ref([
  {
    id: 'c1',
    name: '张总',
    title: '总经理',
    gender: '男',
    factory: '总部',
    workshop: '',
    department: '管理层',
    level: '高层',
    role: 'decision_maker',
    decisionLevel: 5,
    phone: '138****1234',
    email: 'zhang@mingsheng.com',
    wechat: 'zhang_boss',
    reportsTo: null,
    workNature: ['管理决策'],
    workRelation: ['决策参与', '流程审批'],
    responsibilities: ['签合同', '预算批准'],
    interests: ['品牌信誉', '长期合作'],
    communicationStyle: '简洁直接，重视ROI',
    attitude: '积极'
  },
  {
    id: 'c2',
    name: '李经理',
    title: '采购经理',
    gender: '女',
    factory: '总部',
    workshop: '',
    department: '采购部',
    level: '中层',
    role: 'champion',
    decisionLevel: 4,
    phone: '139****5678',
    email: 'li@mingsheng.com',
    wechat: 'li_purchase',
    reportsTo: 'c1',
    workNature: ['采购供应'],
    workRelation: ['直接负责人'],
    responsibilities: ['采购报价', '询价', '技术沟通'],
    interests: ['性价比', '交付速度'],
    communicationStyle: '邮件为主，偏好详细资料',
    attitude: '非常积极'
  },
  {
    id: 'c3',
    name: '王工',
    title: '技术主管',
    gender: '男',
    factory: '一分厂',
    workshop: '焊装车间',
    department: '技术部',
    level: '中层',
    role: 'influencer',
    decisionLevel: 3,
    phone: '137****9012',
    email: 'wang@mingsheng.com',
    wechat: 'wang_tech',
    reportsTo: 'c1',
    workNature: ['技术研发', '质量控制'],
    workRelation: ['技术支持', '配合协同'],
    responsibilities: ['技术沟通', '产品验收', '质检'],
    interests: ['技术创新', '产品质量'],
    communicationStyle: '重视技术细节，喜欢现场演示',
    attitude: '积极'
  },
  {
    id: 'c4',
    name: '刘主任',
    title: '生产主任',
    gender: '男',
    factory: '一分厂',
    workshop: '焊装车间',
    department: '生产部',
    level: '基层',
    role: 'end_user',
    decisionLevel: 2,
    phone: '136****3456',
    email: 'liu@mingsheng.com',
    wechat: 'liu_prod',
    reportsTo: 'c3',
    workNature: ['生产制造'],
    workRelation: ['信息接收'],
    responsibilities: ['生产现场', '工具管理和标定'],
    interests: ['易用性', '稳定性'],
    communicationStyle: '实际操作优先',
    attitude: '中立'
  }
])

// 新增联系人表单
const newContact = ref({
  name: '',
  title: '',
  gender: '男',
  factory: '',
  workshop: '',
  department: '',
  level: '中层',
  role: '',
  decisionLevel: 3,
  phone: '',
  email: '',
  wechat: '',
  reportsTo: null,
  workNature: [],
  workRelation: [],
  responsibilities: [],
  interests: [],
  communicationStyle: '',
  attitude: '中立',
  notes: ''
})

// 添加事件相关
const eventDialogVisible = ref(false)
const currentStageId = ref('')
const newEvent = ref({
  type: '',
  time: '',
  description: '',
  impact: 0,
  notes: '',
  contactId: null
})

// 方法
const toggleStage = (stageId) => {
  const index = expandedStages.value.indexOf(stageId)
  if (index > -1) {
    expandedStages.value.splice(index, 1)
  } else {
    expandedStages.value.push(stageId)
  }
}

const addEvent = (stageId) => {
  currentStageId.value = stageId
  newEvent.value = {
    type: '',
    time: '',
    description: '',
    impact: 0,
    notes: '',
    contactId: null
  }
  newContact.value = {
    name: '',
    title: '',
    gender: '男',
    factory: '',
    workshop: '',
    department: '',
    level: '中层',
    role: '',
    decisionLevel: 3,
    phone: '',
    email: '',
    wechat: '',
    reportsTo: null,
    workNature: [],
    workRelation: [],
    responsibilities: [],
    interests: [],
    communicationStyle: '',
    attitude: '中立',
    notes: ''
  }
  eventDialogVisible.value = true
}

// 事件类型改变时的处理
const handleEventTypeChange = (type) => {
  if (type === '新增联系人') {
    // 为新增联系人事件设置默认影响值
    newEvent.value.impact = 5
  }
}

const saveEvent = () => {
  const stage = stages.value.find(s => s.id === currentStageId.value)
  if (stage) {
    // 如果是新增联系人，先保存联系人
    if (newEvent.value.type === '新增联系人') {
      const newContactData = {
        id: 'c' + Date.now(),
        ...newContact.value
      }
      customerContacts.value.push(newContactData)
      
      // 更新事件描述，包含联系人信息
      newEvent.value.description = `新增联系人：${newContact.value.name}（${newContact.value.title}）- ${newEvent.value.description}`
      newEvent.value.contactId = newContactData.id
    }
    
    stage.events.push({
      id: 'e' + Date.now(),
      ...newEvent.value,
      time: newEvent.value.time ? newEvent.value.time.toLocaleString('zh-CN') : new Date().toLocaleString('zh-CN')
    })
    // 重新计算赢率
    stage.winRate += newEvent.value.impact
    stage.trend = newEvent.value.impact
  }
  eventDialogVisible.value = false
}

const editEvent = (event) => {
  console.log('编辑事件:', event)
}

const deleteEvent = (event) => {
  console.log('删除事件:', event)
}

const executeAction = (action) => {
  console.log('执行行动:', action)
}

const ignoreAction = (action) => {
  const index = aiActions.value.findIndex(a => a.id === action.id)
  if (index > -1) {
    aiActions.value.splice(index, 1)
  }
}

const refreshAIActions = () => {
  console.log('刷新AI推荐')
}

// 联系人管理相关方法
const getContactsByLevel = (level) => {
  return customerContacts.value.filter(c => c.level === level)
}

const getContactsByRole = (role) => {
  return customerContacts.value.filter(c => c.role === role)
}

const getContactName = (contactId) => {
  const contact = customerContacts.value.find(c => c.id === contactId)
  return contact ? `${contact.name} (${contact.title})` : '未知'
}

const viewContactDetail = (contact) => {
  currentContact.value = contact
  contactDetailVisible.value = true
}

const editContact = (contact) => {
  console.log('编辑联系人:', contact)
  // TODO: 实现编辑功能
}

const refreshContactMap = () => {
  console.log('刷新联系人关系图谱')
}

const openCustomer360 = () => {
  console.log('打开客户360°画像')
  // TODO: 跳转到客户360°页面，并传递客户ID和联系人数据
}

const getContactEvents = (contactId) => {
  // 获取与该联系人相关的所有事件
  const allEvents = []
  stages.value.forEach(stage => {
    const contactEvents = stage.events.filter(e => e.contactId === contactId)
    allEvents.push(...contactEvents)
  })
  return allEvents.slice(0, 5) // 返回最近5条
}

const getRoleClass = (role) => {
  const classMap = {
    'decision_maker': 'role-decision-maker',
    'champion': 'role-champion',
    'influencer': 'role-influencer',
    'blocker': 'role-blocker',
    'end_user': 'role-end-user'
  }
  return classMap[role] || ''
}

const getRoleLabel = (role) => {
  const labelMap = {
    'decision_maker': '决策者',
    'champion': '推动者',
    'influencer': '影响者',
    'blocker': '反对者',
    'end_user': '使用者'
  }
  return labelMap[role] || role
}

const getRoleTagType = (role) => {
  const typeMap = {
    'decision_maker': 'danger',
    'champion': 'success',
    'influencer': 'warning',
    'blocker': 'info',
    'end_user': ''
  }
  return typeMap[role] || ''
}

const getAttitudeType = (attitude) => {
  if (attitude.includes('积极')) return 'success'
  if (attitude.includes('消极')) return 'danger'
  return 'info'
}

// 辅助方法
// 返回主页
const goHome = () => {
  router.push('/')
}

const getTrendClass = (trend) => {
  if (trend > 0) return 'trend-up'
  if (trend < 0) return 'trend-down'
  return 'trend-neutral'
}


const getRiskClass = (winRate) => {
  if (winRate >= 70) return 'risk-low'
  if (winRate >= 50) return 'risk-medium'
  return 'risk-high'
}

const getRiskLabel = (winRate) => {
  if (winRate >= 70) return '低风险'
  if (winRate >= 50) return '中风险'
  return '高风险'
}

const getRiskTagType = (winRate) => {
  if (winRate >= 70) return 'success'
  if (winRate >= 50) return 'warning'
  return 'danger'
}

// 🆕 计算漏斗形状样式（梯形，从上到下逐渐变窄）
const getFunnelStyle = (index, total) => {
  const baseWidth = 100 // 基础宽度百分比
  const minWidth = 40 // 最小宽度百分比
  const widthDecrement = (baseWidth - minWidth) / (total - 1) // 每阶段递减
  
  const currentWidth = baseWidth - (widthDecrement * index)
  const nextWidth = Math.max(minWidth, baseWidth - (widthDecrement * (index + 1)))
  
  return {
    width: '100%',
    background: `linear-gradient(to bottom, 
      #667eea ${currentWidth}%, 
      #764ba2 100%)`,
    clipPath: `polygon(
      ${(100 - currentWidth) / 2}% 0%, 
      ${(100 + currentWidth) / 2}% 0%, 
      ${(100 + nextWidth) / 2}% 100%, 
      ${(100 - nextWidth) / 2}% 100%
    )`,
    minHeight: '120px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    position: 'relative'
  }
}

const getProgressColor = (winRate) => {
  if (winRate >= 70) return '#67C23A'
  if (winRate >= 50) return '#E6A23C'
  return '#F56C6C'
}

const getEventIcon = (type) => {
  const iconMap = {
    '预约情况': Calendar,
    '拜访情况': UserIcon,
    '技术交流': VideoCamera,
    '再次预约拜访': Calendar,
    '客户主动询问': Message,
    '决策者参与': UserIcon,
    '预算批准': Document,
    '竞品活动': Phone
  }
  return iconMap[type] || Document
}

const getActivityColor = (score) => {
  if (score >= 70) return '#409EFF'
  if (score >= 50) return '#E6A23C'
  return '#F56C6C'
}

const getActivityLevel = (score) => {
  if (score >= 70) return '高度活跃'
  if (score >= 50) return '中等活跃'
  return '活跃度低'
}

const getActivityLevelClass = (score) => {
  if (score >= 70) return 'level-high'
  if (score >= 50) return 'level-medium'
  return 'level-low'
}

const getActivityTagType = (score) => {
  if (score >= 70) return 'success'
  if (score >= 50) return 'warning'
  return 'danger'
}

const getPriorityLabel = (priority) => {
  const map = {
    high: '高优先级',
    medium: '中优先级',
    low: '低优先级'
  }
  return map[priority]
}

const getPriorityType = (priority) => {
  const map = {
    high: 'danger',
    medium: 'warning',
    low: 'info'
  }
  return map[priority]
}
</script>

<style scoped lang="scss">
.opportunity-funnel {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

// 商机总览Header
.funnel-header {
  margin-bottom: 24px;
  
  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .header-left {
      h2 {
        margin: 0 0 12px 0;
        font-size: 24px;
        color: #303133;
      }
      
      .meta-info {
        display: flex;
        gap: 12px;
        align-items: center;
        
        .amount {
          font-size: 18px;
          font-weight: 600;
          color: #F56C6C;
        }
      }
    }
    
    .header-right {
      .total-win-rate {
        text-align: center;
        
        .label {
          font-size: 14px;
          color: #909399;
          margin-bottom: 8px;
        }
        
        .value {
          display: flex;
          align-items: center;
          gap: 8px;
          
          .rate {
            font-size: 32px;
            font-weight: 700;
          }
          
          .trend {
            font-size: 18px;
            font-weight: 600;
          }
          
          &.trend-up {
            color: #67C23A;
          }
          
          &.trend-down {
            color: #F56C6C;
          }
        }
      }
    }
  }
  
  .stage-progress-bar {
    margin-top: 20px;
  }
}

// 漏斗阶段
// 🆕 时间线式纵向布局
.funnel-stages-timeline {
  display: flex;
  flex-direction: column;
  gap: 0; // 无间隙，由连接线连接
  margin-bottom: 24px;
}

.timeline-stage {
  border: none; // 移除边框
  overflow: visible; // 允许连接线显示
  transition: all 0.3s;
  
  &.risk-low .funnel-shape {
    border-color: #67C23A;
  }
  
  &.risk-medium .funnel-shape {
    border-color: #E6A23C;
  }
  
  &.risk-high .funnel-shape {
    border-color: #F56C6C;
  }
}

.timeline-row {
  display: grid;
  grid-template-columns: 300px 280px 1fr; // 左：漏斗，中：赢率，右：事件
  gap: 24px;
  align-items: start;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background: rgba(102, 126, 234, 0.03);
  }
}

// 🆕 左侧：漏斗形状 + 时间线
.timeline-left {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .funnel-shape {
    width: 100%;
    border: 3px solid #667eea;
    border-radius: 12px;
    position: relative;
    overflow: visible;
    
    .stage-number {
      position: absolute;
      top: 10px;
      left: 10px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 700;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
      z-index: 10;
    }
    
    .funnel-content {
      padding: 20px;
      color: #fff;
      text-align: center;
      
      .stage-name {
        font-size: 20px;
        font-weight: 700;
        margin: 10px 0 8px 0;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }
      
      .stage-time {
        font-size: 13px;
        opacity: 0.9;
      }
    }
  }
  
  // 时间线连接线
  .timeline-connector {
    width: 4px;
    height: 40px;
    background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
    margin: 8px 0;
    position: relative;
    
    &::after {
      content: '↓';
      position: absolute;
      bottom: -12px;
      left: 50%;
      transform: translateX(-50%);
      color: #764ba2;
      font-size: 16px;
      font-weight: 700;
    }
  }
}

// 🆕 中间：赢率卡片
.timeline-center {
  .win-rate-card {
    background: linear-gradient(135deg, #F5F7FA 0%, #FFFFFF 100%);
    border: 2px solid #EBEEF5;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.3s;
    
    &.risk-low {
      border-color: #67C23A;
      background: linear-gradient(135deg, #F0FFF4 0%, #FFFFFF 100%);
    }
    
    &.risk-medium {
      border-color: #E6A23C;
      background: linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%);
    }
    
    &.risk-high {
      border-color: #F56C6C;
      background: linear-gradient(135deg, #FEF0F0 0%, #FFFFFF 100%);
    }
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }
    
    .rate-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      
      .rate-label {
        font-size: 14px;
        color: #909399;
        font-weight: 600;
      }
    }
    
    .rate-value {
      display: flex;
      align-items: baseline;
      gap: 12px;
      margin-bottom: 16px;
      
      .rate {
        font-size: 42px;
        font-weight: 700;
        color: #1A1A1A;
        line-height: 1;
      }
      
      .trend {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 16px;
        font-weight: 600;
        
        &.trend-up {
          color: #67C23A;
        }
        
        &.trend-down {
          color: #F56C6C;
        }
        
        &.trend-neutral {
          color: #909399;
        }
      }
    }
    
    .rate-footer {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #EBEEF5;
      
      .predicted {
        font-size: 13px;
        color: #606266;
      }
    }
  }
}

// 🆕 右侧：标志事件
.timeline-right {
  position: relative;
  
  .milestone-events-section {
    background: #FAFAFA;
    border: 1px solid #EBEEF5;
    border-radius: 12px;
    padding: 16px;
    min-height: 150px;
    
    .events-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      
      h4 {
        font-size: 15px;
        font-weight: 600;
        color: #303133;
        margin: 0;
      }
    }
    
    .events-timeline {
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      .event-badge {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        background: #fff;
        border: 1px solid #E4E7ED;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        
        &.positive {
          border-left: 3px solid #67C23A;
          background: linear-gradient(90deg, #F0FFF4 0%, #FFFFFF 100%);
        }
        
        &.negative {
          border-left: 3px solid #F56C6C;
          background: linear-gradient(90deg, #FEF0F0 0%, #FFFFFF 100%);
        }
        
        &:hover {
          transform: translateX(4px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .event-icon {
          font-size: 18px;
          color: #409EFF;
        }
        
        .event-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          
          .event-type {
            font-size: 13px;
            font-weight: 600;
            color: #303133;
          }
          
          .event-time {
            font-size: 11px;
            color: #909399;
          }
        }
        
        .impact-tag {
          flex-shrink: 0;
        }
      }
      
      .empty-events {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 30px 20px;
        color: #909399;
        font-size: 13px;
        
        .el-icon {
          font-size: 32px;
          margin-bottom: 8px;
          opacity: 0.5;
        }
      }
    }
  }
  
  .expand-icon {
    position: absolute;
    top: -30px;
    right: 10px;
    font-size: 20px;
    color: #909399;
    transition: transform 0.3s;
    
    &.expanded {
      transform: rotate(180deg);
    }
  }
}
  display: flex;
  align-items: center;
  padding: 20px;
  background: linear-gradient(90deg, #F5F7FA 0%, #FFFFFF 100%);
  cursor: pointer;
  
  &:hover {
    background: linear-gradient(90deg, #ECF5FF 0%, #FFFFFF 100%);
  }
  
  .stage-left {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 0 0 200px;
    
    .stage-number {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 700;
    }
    
    .stage-name {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #303133;
    }
  }
  
  .stage-center {
    flex: 1;
    padding: 0 40px;
  }
  
  .stage-right {
    display: flex;
    align-items: center;
    gap: 20px;
    flex: 0 0 280px;
    justify-content: flex-end;
    
    .win-rate-display {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      
      .rate {
        font-size: 24px;
        font-weight: 700;
        color: #303133;
      }
      
      .trend {
        font-size: 16px;
        font-weight: 600;
        
        &.trend-up {
          color: #67C23A;
        }
        
        &.trend-down {
          color: #F56C6C;
        }
      }
    }
    
    .expand-icon {
      font-size: 20px;
      transition: transform 0.3s;
      
      &.expanded {
        transform: rotate(180deg);
      }
    }
  }
}

.stage-content {
  padding: 24px;
  background: #FAFAFA;
}

// 关键事件
.key-events-section {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    h4 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
  }
  
  .events-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .event-item {
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    border-left: 4px solid #DCDFE6;
    
    &.positive {
      border-left-color: #67C23A;
    }
    
    &.negative {
      border-left-color: #F56C6C;
    }
    
    .event-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      
      .event-icon {
        font-size: 18px;
        color: #409EFF;
      }
      
      .event-type {
        font-weight: 600;
        color: #303133;
      }
      
      .event-time {
        margin-left: auto;
        font-size: 12px;
        color: #909399;
      }
    }
    
    .event-content {
      p {
        margin: 8px 0;
        color: #606266;
        font-size: 14px;
      }
      
      .event-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 12px;
        
        .event-actions {
          display: flex;
          gap: 4px;
        }
      }
    }
  }
}

// 客户主动性分析
.customer-activity-section {
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    
    h4 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
  }
  
  .activity-chart {
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    
    .metrics-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 16px;
      
      .metric-item {
        .metric-label {
          font-size: 13px;
          color: #606266;
          margin-bottom: 4px;
        }
        
        .metric-value {
          font-size: 12px;
          color: #909399;
          text-align: right;
          margin-top: 4px;
        }
      }
    }
    
    .activity-summary {
      border-top: 1px solid #EBEEF5;
      padding-top: 12px;
      
      .summary-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        
        .label {
          font-size: 14px;
          color: #606266;
        }
        
        .value {
          font-size: 18px;
          font-weight: 600;
          
          &.level-high {
            color: #67C23A;
          }
          
          &.level-medium {
            color: #E6A23C;
          }
          
          &.level-low {
            color: #F56C6C;
          }
        }
      }
    }
  }
}

// 客户个人画像
.persona-insights-section {
  .section-header {
    margin-bottom: 16px;
    
    h4 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
    }
  }
  
  .persona-card {
    background: #fff;
    border-radius: 8px;
    padding: 16px;
    
    .persona-row {
      display: flex;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #F2F6FC;
      
      &:last-child {
        border-bottom: none;
      }
      
      .label {
        flex: 0 0 100px;
        font-size: 13px;
        color: #909399;
      }
      
      .value {
        flex: 1;
        font-size: 14px;
        color: #303133;
      }
      
      .predicted-behavior {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #409EFF;
        font-size: 14px;
      }
    }
  }
}

// 跨阶段预测
.stage-prediction {
  margin-top: 20px;
  
  .predicted-rate {
    font-size: 18px;
    font-weight: 700;
    color: #409EFF;
    margin: 0 4px;
  }
}

// AI推荐行动面板
.ai-action-panel {
  margin-top: 24px;
  
  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    h3 {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
    }
  }
  
  .ai-actions-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .ai-action-item {
    border: 2px solid #EBEEF5;
    border-radius: 8px;
    padding: 16px;
    transition: all 0.3s;
    
    &.priority-high {
      border-left: 4px solid #F56C6C;
      background: #FEF0F0;
    }
    
    &.priority-medium {
      border-left: 4px solid #E6A23C;
      background: #FDF6EC;
    }
    
    &.priority-low {
      border-left: 4px solid #409EFF;
      background: #ECF5FF;
    }
    
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .action-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
      
      h4 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
      }
    }
    
    .action-reason {
      color: #606266;
      font-size: 14px;
      margin: 8px 0;
    }
    
    .action-footer {
      display: flex;
      gap: 8px;
      margin-top: 12px;
    }
  }
}

.mb-4 {
  margin-bottom: 16px;
}

.mr-2 {
  margin-right: 8px;
}

.mb-2 {
  margin-bottom: 8px;
}

// 联系人关系图谱样式
.contact-map-container {
  .map-toolbar {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #EBEEF5;
  }
  
  .org-chart-view {
    h3 {
      text-align: center;
      margin-bottom: 24px;
      font-size: 20px;
      color: #303133;
    }
  }
  
  .org-level {
    margin-bottom: 32px;
    
    .level-label {
      text-align: center;
      font-size: 16px;
      font-weight: 600;
      color: #606266;
      margin-bottom: 16px;
      padding: 8px 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 20px;
      display: inline-block;
      margin-left: 50%;
      transform: translateX(-50%);
    }
    
    .contacts-row {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      justify-content: center;
      padding: 0 20px;
    }
  }
  
  .contact-card {
    width: 200px;
    border: 2px solid #EBEEF5;
    border-radius: 12px;
    padding: 16px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    background: white;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }
    
    // 根据决策角色设置边框颜色
    &.role-decision-maker {
      border-left: 4px solid #F56C6C;
      background: linear-gradient(135deg, #FFF5F5 0%, #FFFFFF 100%);
    }
    
    &.role-champion {
      border-left: 4px solid #67C23A;
      background: linear-gradient(135deg, #F0F9FF 0%, #FFFFFF 100%);
    }
    
    &.role-influencer {
      border-left: 4px solid #E6A23C;
      background: linear-gradient(135deg, #FDF6EC 0%, #FFFFFF 100%);
    }
    
    &.role-blocker {
      border-left: 4px solid #909399;
      background: linear-gradient(135deg, #F4F4F5 0%, #FFFFFF 100%);
    }
    
    &.role-end-user {
      border-left: 4px solid #409EFF;
      background: linear-gradient(135deg, #ECF5FF 0%, #FFFFFF 100%);
    }
    
    .contact-info {
      margin-top: 12px;
      
      .name {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
        margin-bottom: 4px;
      }
      
      .title {
        font-size: 14px;
        color: #606266;
        margin-bottom: 4px;
      }
      
      .org-info {
        font-size: 12px;
        color: #909399;
        margin-bottom: 8px;
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        
        .factory {
          padding: 2px 6px;
          background: #E1F3D8;
          border-radius: 3px;
        }
        
        .workshop {
          padding: 2px 6px;
          background: #FDE2E4;
          border-radius: 3px;
        }
        
        .department {
          padding: 2px 6px;
          background: #E3F2FD;
          border-radius: 3px;
        }
      }
      
      .work-nature,
      .work-relation {
        margin-top: 8px;
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
      }
      
      .department {
        font-size: 12px;
        color: #909399;
        margin-bottom: 8px;
      }
      
      .reports-to {
        font-size: 12px;
        color: #909399;
        margin-top: 8px;
        padding-top: 8px;
        border-top: 1px dashed #EBEEF5;
      }
    }
  }
}

.contact-detail {
  .mr-2 {
    margin-right: 8px;
  }
  
  .mb-2 {
    margin-bottom: 8px;
  }
  
  h4 {
    margin: 16px 0 12px 0;
    font-size: 16px;
    color: #303133;
  }
}

// 添加事件表单样式增强
.impact-hint {
  margin-top: 12px;
}
</style>
