<template>
  <div class="enterprise-workflow-editor">
    <!-- ========== 顶部导航栏 ========== -->
    <div class="top-navbar">
      <div class="navbar-left">
        <el-button link @click="goBack" :icon="ArrowLeft">返回工作流列表</el-button>
        <el-divider direction="vertical" />
        <el-input 
          v-model="workflowName" 
          class="workflow-name-input"
          placeholder="工作流名称"
          :prefix-icon="Edit" />
        <el-tag type="info" size="small">版本: {{ workflowVersion }}</el-tag>
      </div>
      
      <div class="navbar-right">
        <el-button @click="saveWorkflow" :icon="DocumentChecked" type="default">
          保存
        </el-button>
        <el-button @click="publishWorkflow" :icon="Upload" type="primary">
          发布
        </el-button>
        <el-button @click="showAIBuilder" :icon="MagicStick" type="success">
          AI构建流程
        </el-button>
        <el-dropdown @command="handleCommand">
          <el-button :icon="More" circle />
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="debug" :icon="Tools">调试模式</el-dropdown-item>
              <el-dropdown-item command="version" :icon="Clock">版本历史</el-dropdown-item>
              <el-dropdown-item command="export" :icon="Download">导出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- ========== 主工作区（三栏布局）========== -->
    <div class="main-workspace">
      
      <!-- 左侧：节点库 -->
      <div class="left-panel" :class="{ 'collapsed': leftPanelCollapsed }">
        <div class="panel-header">
          <span><el-icon><Box /></el-icon> 节点库</span>
          <el-button link @click="leftPanelCollapsed = !leftPanelCollapsed" :icon="Fold" />
        </div>
        
        <el-input 
          v-model="nodeSearchKeyword"
          placeholder="搜索节点..."
          :prefix-icon="Search"
          clearable
          class="search-input" />
        
        <el-scrollbar class="node-library-scroll">
          <!-- 六大类节点 -->
          <el-collapse v-model="activeNodeCategories" accordion>
            
            <!-- 1. 触发节点 Trigger -->
            <el-collapse-item name="trigger">
              <template #title>
                <div class="category-title">
                  <el-icon color="#409eff"><VideoPlay /></el-icon>
                  <span>触发 Trigger</span>
                </div>
              </template>
              <div class="node-cards">
                <div 
                  v-for="node in filteredNodes('trigger')" 
                  :key="node.type"
                  class="node-card trigger"
                  draggable="true"
                  @dragstart="onNodeDragStart($event, node)">
                  <el-icon>{{ node.icon }}</el-icon>
                  <span>{{ node.label }}</span>
                </div>
              </div>
            </el-collapse-item>

            <!-- 2. 操作节点 Action -->
            <el-collapse-item name="action">
              <template #title>
                <div class="category-title">
                  <el-icon color="#909399"><Operation /></el-icon>
                  <span>操作 Action</span>
                </div>
              </template>
              <div class="node-cards">
                <div 
                  v-for="node in filteredNodes('action')" 
                  :key="node.type"
                  class="node-card action"
                  draggable="true"
                  @dragstart="onNodeDragStart($event, node)">
                  <el-icon>{{ node.icon }}</el-icon>
                  <span>{{ node.label }}</span>
                </div>
              </div>
            </el-collapse-item>

            <!-- 3. AI智能节点 -->
            <el-collapse-item name="ai">
              <template #title>
                <div class="category-title">
                  <el-icon color="#9f7aea"><MagicStick /></el-icon>
                  <span>AI智能 AI</span>
                </div>
              </template>
              <div class="node-cards">
                <div 
                  v-for="node in filteredNodes('ai')" 
                  :key="node.type"
                  class="node-card ai"
                  draggable="true"
                  @dragstart="onNodeDragStart($event, node)">
                  <el-icon>{{ node.icon }}</el-icon>
                  <span>{{ node.label }}</span>
                </div>
              </div>
            </el-collapse-item>

            <!-- 4. 控制节点 Logic -->
            <el-collapse-item name="logic">
              <template #title>
                <div class="category-title">
                  <el-icon color="#f59e0b"><Share /></el-icon>
                  <span>控制 Logic</span>
                </div>
              </template>
              <div class="node-cards">
                <div 
                  v-for="node in filteredNodes('logic')" 
                  :key="node.type"
                  class="node-card logic"
                  draggable="true"
                  @dragstart="onNodeDragStart($event, node)">
                  <el-icon>{{ node.icon }}</el-icon>
                  <span>{{ node.label }}</span>
                </div>
              </div>
            </el-collapse-item>

            <!-- 5. 集成节点 Integration -->
            <el-collapse-item name="integration">
              <template #title>
                <div class="category-title">
                  <el-icon color="#67c23a"><Connection /></el-icon>
                  <span>集成 Integration</span>
                </div>
              </template>
              <div class="node-cards">
                <div 
                  v-for="node in filteredNodes('integration')" 
                  :key="node.type"
                  class="node-card integration"
                  draggable="true"
                  @dragstart="onNodeDragStart($event, node)">
                  <el-icon>{{ node.icon }}</el-icon>
                  <span>{{ node.label }}</span>
                </div>
              </div>
            </el-collapse-item>

            <!-- 6. 输出节点 Output -->
            <el-collapse-item name="output">
              <template #title>
                <div class="category-title">
                  <el-icon color="#1e40af"><Document /></el-icon>
                  <span>输出 Output</span>
                </div>
              </template>
              <div class="node-cards">
                <div 
                  v-for="node in filteredNodes('output')" 
                  :key="node.type"
                  class="node-card output"
                  draggable="true"
                  @dragstart="onNodeDragStart($event, node)">
                  <el-icon>{{ node.icon }}</el-icon>
                  <span>{{ node.label }}</span>
                </div>
              </div>
            </el-collapse-item>

          </el-collapse>
        </el-scrollbar>
      </div>

      <!-- 中间：流程画布 -->
      <div class="center-canvas">
        <div class="canvas-toolbar">
          <el-button-group>
            <el-tooltip content="缩小 (Ctrl + -)">
              <el-button @click="zoomOut" :icon="ZoomOut" />
            </el-tooltip>
            <el-button disabled>{{ Math.round(canvasScale * 100) }}%</el-button>
            <el-tooltip content="放大 (Ctrl + +)">
              <el-button @click="zoomIn" :icon="ZoomIn" />
            </el-tooltip>
            <el-tooltip content="重置视图">
              <el-button @click="resetZoom" :icon="Refresh" />
            </el-tooltip>
          </el-button-group>
          
          <el-button-group style="margin-left: 10px">
            <el-tooltip content="自动布局">
              <el-button @click="autoLayout" :icon="Grid" />
            </el-tooltip>
            <el-tooltip content="网格对齐">
              <el-button @click="toggleGrid" :icon="MagicStick">
                <span v-if="showGrid">✓</span>
              </el-button>
            </el-tooltip>
          </el-button-group>
        </div>

        <div 
          class="canvas-container"
          @drop="onCanvasDrop"
          @dragover.prevent
          @click="deselectAll"
          @dblclick="handleCanvasDoubleClick">
          
          <svg 
            class="workflow-canvas"
            :viewBox="`${panOffset.x} ${panOffset.y} ${6000 / canvasScale} ${4000 / canvasScale}`"
            @contextmenu.prevent="handleCanvasRightClick">
            
            <!-- 网格背景 -->
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" stroke-width="0.5"/>
              </pattern>
            </defs>
            <rect v-if="showGrid" width="100%" height="100%" fill="url(#grid)" />

            <!-- 连接线层 -->
            <g class="connections-layer">
              <path
                v-for="(conn, index) in connections"
                :key="'conn-' + index"
                :d="getConnectionPath(conn)"
                :stroke="conn.color || getConnectionColor(conn.type)"
                stroke-width="4"
                fill="none"
                :class="['connection-line', conn.type]"
                @click.stop="selectConnection(conn, index)">
              </path>
              
              <!-- 箭头 -->
              <polygon
                v-for="(conn, index) in connections"
                :key="'arrow-' + index"
                :points="getArrowPoints(conn)"
                :fill="conn.color || getConnectionColor(conn.type)">
              </polygon>
            </g>

            <!-- 节点层 -->
            <g class="nodes-layer">
              <g
                v-for="node in workflowNodes"
                :key="node.id"
                :transform="`translate(${node.x}, ${node.y})`"
                class="workflow-node"
                :class="[
                  { 'selected': selectedNode === node.id },
                  { 'ai-node': node.isAI },
                  'node-category-' + node.category,
                  'node-status-' + node.status
                ]"
                @mousedown.stop="startDrag(node, $event)"
                @click.stop="selectNode(node)">
                
                <!-- 节点主体（标准化卡片）-->
                <rect
                  x="-108"
                  y="-54"
                  width="216"
                  height="108"
                  rx="12"
                  :fill="getNodeColor(node)"
                  :stroke="getNodeBorderColor(node)"
                  stroke-width="3"
                  :class="['node-body', 'node-status-' + (node.status || 'draft')]">
                </rect>

                <!-- 节点图标 -->
                <circle cx="-75" cy="-20" r="18" fill="rgba(255,255,255,0.2)" />
                <text x="-75" y="-15" text-anchor="middle" font-size="20">
                  {{ getNodeIcon(node) }}
                </text>

                <!-- 节点标题 -->
                <text
                  x="0"
                  y="-10"
                  text-anchor="middle"
                  fill="#fff"
                  font-size="20"
                  font-weight="600">
                  {{ node.label }}
                </text>

                <!-- 关键字段信息 -->
                <text
                  v-if="node.keyField"
                  x="0"
                  y="15"
                  text-anchor="middle"
                  fill="rgba(255,255,255,0.8)"
                  font-size="14">
                  {{ node.keyField }}
                </text>

                <!-- 状态标识 -->
                <text
                  x="0"
                  y="35"
                  text-anchor="middle"
                  :fill="getStatusColor(node.status)"
                  font-size="12">
                  {{ getStatusText(node.status) }}
                </text>

                <!-- AI标识徽章 -->
                <g v-if="node.isAI" transform="translate(85, -45)">
                  <circle cx="0" cy="0" r="20" fill="#9f7aea" />
                  <text x="0" y="5" text-anchor="middle" fill="#fff" font-size="16" font-weight="bold">
                    AI
                  </text>
                </g>

                <!-- 连接点 -->
                <circle
                  v-for="point in ['top', 'right', 'bottom', 'left']"
                  :key="point"
                  :cx="getConnectorPos(point).x"
                  :cy="getConnectorPos(point).y"
                  r="8"
                  fill="#409eff"
                  class="connector"
                  @mousedown.stop="startConnection(node, point)"
                  @mouseup.stop="endConnection(node, point)">
                </circle>

              </g>
            </g>

          </svg>

          <!-- AI智能推荐浮层 -->
          <div 
            v-if="showAIRecommendation"
            class="ai-recommendation-panel"
            :style="{
              left: aiRecommendPosition.x + 'px',
              top: aiRecommendPosition.y + 'px'
            }">
            <div class="recommendation-title">
              <el-icon><MagicStick /></el-icon>
              AI 推荐下一步：
            </div>
            <div class="recommendation-buttons">
              <el-button 
                v-for="rec in aiRecommendations" 
                :key="rec.type"
                size="small"
                @click="insertRecommendedNode(rec)">
                {{ rec.label }}
              </el-button>
            </div>
          </div>

        </div>
      </div>

      <!-- 右侧：属性面板 -->
      <div class="right-panel" :class="{ 'collapsed': rightPanelCollapsed }">
        <div class="panel-header">
          <span><el-icon><Setting /></el-icon> 节点属性</span>
          <el-button link @click="rightPanelCollapsed = !rightPanelCollapsed" :icon="Fold" />
        </div>

        <el-scrollbar v-if="currentNode && !rightPanelCollapsed" class="properties-scroll">
          
          <!-- 基础设置 -->
          <el-card shadow="never" class="property-card">
            <template #header>
              <div class="card-header">
                <el-icon><Document /></el-icon>
                <span>基础设置</span>
              </div>
            </template>
            
            <el-form label-position="top" size="default">
              <el-form-item label="节点名称">
                <el-input v-model="currentNode.label" placeholder="请输入节点名称" />
              </el-form-item>
              
              <el-form-item label="节点描述">
                <el-input 
                  v-model="currentNode.description" 
                  type="textarea" 
                  :rows="3"
                  placeholder="描述节点的作用和用途" />
              </el-form-item>
              
              <el-form-item label="执行角色">
                <el-select v-model="currentNode.owner" placeholder="选择执行角色">
                  <el-option label="自动执行" value="auto" />
                  <el-option label="研发部" value="rd" />
                  <el-option label="生产部" value="production" />
                  <el-option label="质量部" value="qc" />
                  <el-option label="工艺部" value="process" />
                  <el-option label="设备科" value="equipment" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="SLA (小时)">
                <el-input-number v-model="currentNode.sla" :min="0" :max="168" />
              </el-form-item>
            </el-form>
          </el-card>

          <!-- AI参数（仅AI节点显示）-->
          <el-card v-if="currentNode.isAI" shadow="never" class="property-card">
            <template #header>
              <div class="card-header">
                <el-icon><MagicStick /></el-icon>
                <span>AI参数</span>
              </div>
            </template>
            
            <el-form label-position="top">
              <el-form-item label="AI模型">
                <el-select v-model="currentNode.aiModel" placeholder="选择模型">
                  <el-option label="GPT-4 Turbo" value="gpt-4-turbo" />
                  <el-option label="GPT-3.5" value="gpt-3.5" />
                  <el-option label="Claude 3" value="claude-3" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="Prompt 模板">
                <el-input 
                  v-model="currentNode.promptTemplate" 
                  type="textarea" 
                  :rows="5"
                  placeholder="输入AI提示词模板..." />
              </el-form-item>
              
              <el-form-item label="置信度阈值">
                <el-slider v-model="currentNode.confidenceThreshold" :min="0" :max="100" show-stops />
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 数据映射 -->
          <el-card shadow="never" class="property-card">
            <template #header>
              <div class="card-header">
                <el-icon><Connection /></el-icon>
                <span>数据映射</span>
              </div>
            </template>
            
            <el-form label-position="top">
              <el-form-item label="输入字段">
                <el-tag 
                  v-for="(input, idx) in currentNode.inputs || []" 
                  :key="idx"
                  closable
                  @close="removeInput(idx)"
                  style="margin-right: 5px; margin-bottom: 5px">
                  {{ input.key }}
                </el-tag>
                <el-button size="small" @click="addInput" :icon="Plus">添加输入</el-button>
              </el-form-item>
              
              <el-form-item label="输出字段">
                <el-tag 
                  v-for="(output, idx) in currentNode.outputs || []" 
                  :key="idx"
                  type="success"
                  closable
                  @close="removeOutput(idx)"
                  style="margin-right: 5px; margin-bottom: 5px">
                  {{ output.key }}
                </el-tag>
                <el-button size="small" @click="addOutput" :icon="Plus">添加输出</el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 集成设置（仅集成节点显示）-->
          <el-card v-if="currentNode.category === 'integration'" shadow="never" class="property-card">
            <template #header>
              <div class="card-header">
                <el-icon><Link /></el-icon>
                <span>集成设置</span>
              </div>
            </template>
            
            <el-form label-position="top">
              <el-form-item label="API端点">
                <el-select v-model="currentNode.apiEndpoint" placeholder="选择API">
                  <el-option label="MES - 工单查询" value="mes_workorder" />
                  <el-option label="ERP - 采购申请" value="erp_purchase" />
                  <el-option label="CRM - 客户查询" value="crm_customer" />
                  <el-option label="IoT - 设备数据" value="iot_device" />
                </el-select>
              </el-form-item>
              
              <el-form-item label="参数配置">
                <el-input 
                  v-model="currentNode.apiParams" 
                  type="textarea" 
                  :rows="4"
                  placeholder='{"key": "value"}' />
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 操作按钮 -->
          <div class="property-actions">
            <el-button type="primary" @click="saveNodeProperties" :icon="Select">保存设置</el-button>
            <el-button type="danger" @click="deleteNode" :icon="Delete">删除节点</el-button>
            <el-button @click="cloneNode" :icon="DocumentCopy">克隆节点</el-button>
          </div>

        </el-scrollbar>

        <el-empty v-else description="选择一个节点以查看属性" />
      </div>

    </div>

    <!-- ========== AI构建对话框 ========== -->
    <el-dialog 
      v-model="aiBuilderVisible" 
      title="AI自动构建工作流"
      width="600px">
      <el-form label-position="top">
        <el-form-item label="描述你的业务场景">
          <el-input 
            v-model="aiBuilderInput"
            type="textarea"
            :rows="6"
            placeholder="示例：我需要一个处理生产线包装漏装问题的完整工作流，包括问题识别、批次隔离、原因分析、改善方案和SOP更新。" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="aiBuilderVisible = false">取消</el-button>
        <el-button type="primary" @click="buildWorkflowByAI" :loading="aiBuilding" :icon="MagicStick">
          {{ aiBuilding ? 'AI构建中...' : '开始构建' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- ========== 调试模式对话框 ========== -->
    <el-dialog 
      v-model="debugModeVisible" 
      title="工作流调试模式"
      width="80%"
      fullscreen>
      <div class="debug-toolbar">
        <el-button-group>
          <el-button :icon="CaretRight" @click="startDebug">开始执行</el-button>
          <el-button :icon="VideoPause" @click="pauseDebug">暂停</el-button>
          <el-button :icon="RefreshRight" @click="resetDebug">重置</el-button>
        </el-button-group>
        
        <el-steps :active="debugStep" style="margin: 20px 0">
          <el-step 
            v-for="(node, idx) in workflowNodes" 
            :key="node.id"
            :title="node.label" />
        </el-steps>
      </div>
      
      <el-tabs v-model="debugTab">
        <el-tab-pane label="输入数据" name="input">
          <el-input 
            v-model="debugInputData"
            type="textarea"
            :rows="15"
            placeholder='{"field": "value"}' />
        </el-tab-pane>
        
        <el-tab-pane label="输出数据" name="output">
          <pre class="json-viewer">{{ debugOutputData }}</pre>
        </el-tab-pane>
        
        <el-tab-pane label="执行日志" name="logs">
          <div class="debug-logs">
            <div v-for="(log, idx) in debugLogs" :key="idx" class="log-item">
              <el-tag :type="log.type" size="small">{{ log.level }}</el-tag>
              <span>{{ log.timestamp }}</span>
              <span>{{ log.message }}</span>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft, Edit, DocumentChecked, Upload, MagicStick, More,
  Bug, Clock, Download, Box, Fold, Search,
  VideoPlay, Operation, Share, Connection, Document,
  ZoomOut, ZoomIn, Refresh, Grid, Setting, Plus, Delete,
  DocumentCopy, Link, Select, CaretRight, VideoPause, RefreshRight
} from '@element-plus/icons-vue'

const router = useRouter()

// ==================== 核心状态 ====================
const workflowName = ref('未命名工作流')
const workflowVersion = ref('v1.0.0')
const workflowNodes = ref([])
const connections = ref([])
const selectedNode = ref(null)
const currentNode = computed(() => workflowNodes.value.find(n => n.id === selectedNode.value))

// ==================== 面板状态 ====================
const leftPanelCollapsed = ref(false)
const rightPanelCollapsed = ref(false)
const nodeSearchKeyword = ref('')
const activeNodeCategories = ref(['trigger'])

// ==================== 画布状态 ====================
const canvasScale = ref(1)
const panOffset = ref({ x: 0, y: 0 })
const showGrid = ref(true)

// ==================== AI功能状态 ====================
const aiBuilderVisible = ref(false)
const aiBuilderInput = ref('')
const aiBuilding = ref(false)
const showAIRecommendation = ref(false)
const aiRecommendPosition = ref({ x: 0, y: 0 })
const aiRecommendations = ref([])

// ==================== 调试模式状态 ====================
const debugModeVisible = ref(false)
const debugStep = ref(0)
const debugTab = ref('input')
const debugInputData = ref('{}')
const debugOutputData = ref('{}')
const debugLogs = ref([])

// ==================== 节点库定义（六大类）====================
const nodeLibrary = ref({
  trigger: [
    { type: 'manual_trigger', label: '手动触发', icon: '👆', category: 'trigger' },
    { type: 'schedule_trigger', label: '定时触发', icon: '⏰', category: 'trigger' },
    { type: 'alert_trigger', label: '设备告警触发', icon: '🚨', category: 'trigger' },
    { type: 'document_trigger', label: '文档触发', icon: '📄', category: 'trigger' }
  ],
  action: [
    { type: 'task_action', label: '任务节点', icon: '📋', category: 'action' },
    { type: 'approval_action', label: '审批节点', icon: '✅', category: 'action' },
    { type: 'form_action', label: '表单输入', icon: '📝', category: 'action' },
    { type: 'notification_action', label: '通知节点', icon: '📢', category: 'action' }
  ],
  ai: [
    { type: 'ai_condition', label: 'AI判断', icon: '🤖', category: 'ai', isAI: true },
    { type: 'ai_generate', label: 'AI文本生成', icon: '✍️', category: 'ai', isAI: true },
    { type: 'ai_analysis', label: 'AI分析', icon: '🔍', category: 'ai', isAI: true },
    { type: 'ai_assignment', label: 'AI分派', icon: '🎯', category: 'ai', isAI: true },
    { type: 'ai_qa', label: 'AI问答', icon: '💬', category: 'ai', isAI: true }
  ],
  logic: [
    { type: 'if_else', label: '分支节点', icon: '🔀', category: 'logic' },
    { type: 'parallel', label: '并行节点', icon: '⚡', category: 'logic' },
    { type: 'loop', label: '循环节点', icon: '🔄', category: 'logic' },
    { type: 'merge', label: '合并节点', icon: '🔗', category: 'logic' }
  ],
  integration: [
    { type: 'mes_fetch', label: 'MES数据查询', icon: '🏭', category: 'integration' },
    { type: 'erp_fetch', label: 'ERP数据查询', icon: '💼', category: 'integration' },
    { type: 'crm_fetch', label: 'CRM数据查询', icon: '👥', category: 'integration' },
    { type: 'iot_fetch', label: 'IoT设备数据', icon: '📡', category: 'integration' },
    { type: 'workorder_create', label: '创建工单', icon: '🎫', category: 'integration' }
  ],
  output: [
    { type: 'report_output', label: '生成报告', icon: '📊', category: 'output' },
    { type: 'document_output', label: '生成文档', icon: '📄', category: 'output' },
    { type: 'email_output', label: '发送邮件', icon: '📧', category: 'output' },
    { type: 'end_output', label: '流程结束', icon: '🏁', category: 'output' }
  ]
})

// ==================== 计算属性 ====================
const filteredNodes = (category) => {
  const nodes = nodeLibrary.value[category] || []
  if (!nodeSearchKeyword.value) return nodes
  return nodes.filter(n => n.label.includes(nodeSearchKeyword.value))
}

// ==================== 方法 ====================

// 返回
const goBack = () => {
  router.push('/')
}

// 保存工作流
const saveWorkflow = () => {
  localStorage.setItem('workflow_v3', JSON.stringify({
    name: workflowName.value,
    version: workflowVersion.value,
    nodes: workflowNodes.value,
    connections: connections.value
  }))
  ElMessage.success('工作流已保存')
}

// 发布工作流
const publishWorkflow = () => {
  ElMessageBox.confirm(
    '发布后工作流将可供其他用户使用，是否继续？',
    '确认发布',
    {
      confirmButtonText: '发布',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('工作流已发布')
  })
}

// 显示AI构建器
const showAIBuilder = () => {
  aiBuilderVisible.value = true
}

// AI自动构建工作流
const buildWorkflowByAI = async () => {
  aiBuilding.value = true
  // 模拟AI生成
  setTimeout(() => {
    // TODO: 调用AI接口生成工作流
    ElMessage.success('AI工作流构建完成')
    aiBuilding.value = false
    aiBuilderVisible.value = false
  }, 2000)
}

// 命令处理
const handleCommand = (command) => {
  if (command === 'debug') {
    debugModeVisible.value = true
  } else if (command === 'version') {
    ElMessage.info('版本历史功能开发中')
  } else if (command === 'export') {
    ElMessage.info('导出功能开发中')
  }
}

// 节点拖拽开始
const onNodeDragStart = (event, node) => {
  event.dataTransfer.setData('node', JSON.stringify(node))
}

// 画布放置
const onCanvasDrop = (event) => {
  const nodeData = JSON.parse(event.dataTransfer.getData('node'))
  const rect = event.currentTarget.getBoundingClientRect()
  const x = (event.clientX - rect.left - 300) / canvasScale.value + panOffset.value.x
  const y = (event.clientY - rect.top - 100) / canvasScale.value + panOffset.value.y
  
  addNodeToCanvas(nodeData, x, y)
}

// 添加节点到画布
const addNodeToCanvas = (nodeData, x, y) => {
  const newNode = {
    id: 'node-' + Date.now(),
    ...nodeData,
    x: x,
    y: y,
    status: 'draft', // draft/active/error/running
    sla: 2,
    inputs: [],
    outputs: [],
    description: '',
    owner: 'auto'
  }
  
  workflowNodes.value.push(newNode)
  selectedNode.value = newNode.id
  ElMessage.success(`已添加 ${nodeData.label}`)
}

// 选择节点
const selectNode = (node) => {
  selectedNode.value = node.id
}

// 取消选择
const deselectAll = () => {
  selectedNode.value = null
}

// 删除节点
const deleteNode = () => {
  ElMessageBox.confirm('确认删除该节点？', '提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = workflowNodes.value.findIndex(n => n.id === selectedNode.value)
    if (index > -1) {
      workflowNodes.value.splice(index, 1)
      selectedNode.value = null
      ElMessage.success('节点已删除')
    }
  })
}

// 克隆节点
const cloneNode = () => {
  if (!currentNode.value) return
  const cloned = {
    ...currentNode.value,
    id: 'node-' + Date.now(),
    x: currentNode.value.x + 50,
    y: currentNode.value.y + 50
  }
  workflowNodes.value.push(cloned)
  ElMessage.success('节点已克隆')
}

// 获取节点颜色
const getNodeColor = (node) => {
  const colors = {
    trigger: '#409eff',
    action: '#909399',
    ai: '#9f7aea',
    logic: '#f59e0b',
    integration: '#67c23a',
    output: '#1e40af'
  }
  return colors[node.category] || '#909399'
}

// 获取节点边框颜色（根据状态）
const getNodeBorderColor = (node) => {
  const borders = {
    draft: '#f59e0b',      // 待配置：黄色
    active: '#909399',     // 配置完成：灰色
    error: '#f56c6c',      // 错误：红色
    running: '#409eff'     // 运行中：蓝色
  }
  return borders[node.status] || '#909399'
}

// 获取节点图标
const getNodeIcon = (node) => {
  return node.icon || '📦'
}

// 获取状态文本
const getStatusText = (status) => {
  const texts = {
    draft: '待配置',
    active: '已配置',
    error: '配置错误',
    running: '运行中'
  }
  return texts[status] || '待配置'
}

// 获取状态颜色
const getStatusColor = (status) => {
  const colors = {
    draft: '#f59e0b',
    active: '#67c23a',
    error: '#f56c6c',
    running: '#409eff'
  }
  return colors[status] || '#f59e0b'
}

// 连接点位置
const getConnectorPos = (position) => {
  const positions = {
    top: { x: 0, y: -54 },
    right: { x: 108, y: 0 },
    bottom: { x: 0, y: 54 },
    left: { x: -108, y: 0 }
  }
  return positions[position] || { x: 0, y: 0 }
}

// 开始连接
const connectionStart = ref(null)
const startConnection = (node, point) => {
  connectionStart.value = { node, point }
}

// 结束连接
const endConnection = (node, point) => {
  if (!connectionStart.value || connectionStart.value.node.id === node.id) {
    connectionStart.value = null
    return
  }
  
  connections.value.push({
    from: connectionStart.value.node.id,
    to: node.id,
    type: 'default'
  })
  
  connectionStart.value = null
  ElMessage.success('连接已创建')
}

// 获取连接路径
const getConnectionPath = (conn) => {
  const fromNode = workflowNodes.value.find(n => n.id === conn.from)
  const toNode = workflowNodes.value.find(n => n.id === conn.to)
  if (!fromNode || !toNode) return ''
  
  const x1 = fromNode.x
  const y1 = fromNode.y + 54
  const x2 = toNode.x
  const y2 = toNode.y - 54
  
  const cx1 = x1
  const cy1 = y1 + (y2 - y1) / 3
  const cx2 = x2
  const cy2 = y2 - (y2 - y1) / 3
  
  return `M ${x1},${y1} C ${cx1},${cy1} ${cx2},${cy2} ${x2},${y2}`
}

// 获取箭头点
const getArrowPoints = (conn) => {
  const toNode = workflowNodes.value.find(n => n.id === conn.to)
  if (!toNode) return ''
  
  const x = toNode.x
  const y = toNode.y - 54
  
  return `${x},${y} ${x-10},${y-16} ${x+10},${y-16}`
}

// 获取连接颜色
const getConnectionColor = (type) => {
  return type === 'error' ? '#f56c6c' : '#409eff'
}

// 画布缩放
const zoomIn = () => {
  if (canvasScale.value < 2) canvasScale.value += 0.1
}

const zoomOut = () => {
  if (canvasScale.value > 0.5) canvasScale.value -= 0.1
}

const resetZoom = () => {
  canvasScale.value = 1
  panOffset.value = { x: 0, y: 0 }
}

// 切换网格
const toggleGrid = () => {
  showGrid.value = !showGrid.value
}

// 自动布局
const autoLayout = () => {
  // TODO: 实现自动布局算法
  ElMessage.info('自动布局功能开发中')
}

// 节点拖拽
let draggedNode = null
let dragOffset = { x: 0, y: 0 }

const startDrag = (node, event) => {
  draggedNode = node
  const rect = event.target.closest('svg').getBoundingClientRect()
  dragOffset.x = event.clientX - rect.left - node.x * canvasScale.value
  dragOffset.y = event.clientY - rect.top - node.y * canvasScale.value
  
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

const onDrag = (event) => {
  if (!draggedNode) return
  const canvas = document.querySelector('.workflow-canvas')
  const rect = canvas.getBoundingClientRect()
  
  draggedNode.x = (event.clientX - rect.left - dragOffset.x) / canvasScale.value
  draggedNode.y = (event.clientY - rect.top - dragOffset.y) / canvasScale.value
}

const stopDrag = () => {
  draggedNode = null
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// 双击画布
const handleCanvasDoubleClick = (event) => {
  if (event.target.tagName === 'svg' || event.target.tagName === 'rect') {
    // TODO: 显示快速添加节点菜单
    ElMessage.info('双击快速添加功能开发中')
  }
}

// 右键画布
const handleCanvasRightClick = (event) => {
  event.preventDefault()
  // TODO: 显示右键菜单
}

// 保存节点属性
const saveNodeProperties = () => {
  ElMessage.success('节点属性已保存')
  saveWorkflow()
}

// 添加输入/输出
const addInput = () => {
  ElMessageBox.prompt('请输入字段名称', '添加输入字段').then(({ value }) => {
    if (!currentNode.value.inputs) currentNode.value.inputs = []
    currentNode.value.inputs.push({ key: value, type: 'string', required: true })
    ElMessage.success('输入字段已添加')
  })
}

const addOutput = () => {
  ElMessageBox.prompt('请输入字段名称', '添加输出字段').then(({ value }) => {
    if (!currentNode.value.outputs) currentNode.value.outputs = []
    currentNode.value.outputs.push({ key: value, type: 'string' })
    ElMessage.success('输出字段已添加')
  })
}

const removeInput = (index) => {
  currentNode.value.inputs.splice(index, 1)
}

const removeOutput = (index) => {
  currentNode.value.outputs.splice(index, 1)
}

// 调试模式
const startDebug = () => {
  debugStep.value = 1
  debugLogs.value.push({
    level: 'INFO',
    type: 'info',
    timestamp: new Date().toLocaleTimeString(),
    message: '开始执行工作流'
  })
}

const pauseDebug = () => {
  debugLogs.value.push({
    level: 'WARN',
    type: 'warning',
    timestamp: new Date().toLocaleTimeString(),
    message: '工作流已暂停'
  })
}

const resetDebug = () => {
  debugStep.value = 0
  debugLogs.value = []
  debugInputData.value = '{}'
  debugOutputData.value = '{}'
}

// 初始化
onMounted(() => {
  // 加载保存的工作流
  const saved = localStorage.getItem('workflow_v3')
  if (saved) {
    const data = JSON.parse(saved)
    workflowName.value = data.name
    workflowVersion.value = data.version
    workflowNodes.value = data.nodes || []
    connections.value = data.connections || []
  }
})

</script>

<style scoped lang="scss">
.enterprise-workflow-editor {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  overflow: hidden;
}

// ========== 顶部导航栏 ==========
.top-navbar {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  
  .navbar-left {
    display: flex;
    align-items: center;
    gap: 15px;
    
    .workflow-name-input {
      width: 300px;
      
      :deep(.el-input__inner) {
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
  
  .navbar-right {
    display: flex;
    gap: 10px;
  }
}

// ========== 主工作区 ==========
.main-workspace {
  flex: 1;
  display: flex;
  overflow: hidden;
}

// ========== 左侧面板 ==========
.left-panel {
  width: 280px;
  background: #fff;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
  
  &.collapsed {
    width: 50px;
    
    .search-input,
    .node-library-scroll {
      display: none;
    }
  }
  
  .panel-header {
    height: 50px;
    padding: 0 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e4e7ed;
    font-weight: 600;
    
    span {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
  
  .search-input {
    margin: 15px;
  }
  
  .node-library-scroll {
    flex: 1;
    padding: 0 15px 15px;
  }
  
  .category-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 600;
  }
  
  .node-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    padding: 10px 0;
  }
  
  .node-card {
    padding: 15px 10px;
    border-radius: 8px;
    border: 2px solid #e4e7ed;
    cursor: grab;
    transition: all 0.2s;
    text-align: center;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    &:active {
      cursor: grabbing;
    }
    
    span {
      display: block;
      margin-top: 5px;
      font-size: 12px;
      font-weight: 500;
    }
    
    &.trigger {
      border-color: #409eff;
      background: rgba(64, 158, 255, 0.05);
    }
    
    &.action {
      border-color: #909399;
      background: rgba(144, 147, 153, 0.05);
    }
    
    &.ai {
      border-color: #9f7aea;
      background: rgba(159, 122, 234, 0.05);
    }
    
    &.logic {
      border-color: #f59e0b;
      background: rgba(245, 158, 11, 0.05);
    }
    
    &.integration {
      border-color: #67c23a;
      background: rgba(103, 194, 58, 0.05);
    }
    
    &.output {
      border-color: #1e40af;
      background: rgba(30, 64, 175, 0.05);
    }
  }
}

// ========== 中间画布 ==========
.center-canvas {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  
  .canvas-toolbar {
    height: 50px;
    background: #fff;
    border-bottom: 1px solid #e4e7ed;
    display: flex;
    align-items: center;
    padding: 0 15px;
    gap: 15px;
  }
  
  .canvas-container {
    flex: 1;
    overflow: hidden;
    position: relative;
    background: #fafafa;
  }
  
  .workflow-canvas {
    width: 100%;
    height: 100%;
  }
  
  .workflow-node {
    cursor: move;
    transition: all 0.2s;
    
    &.selected {
      filter: drop-shadow(0 0 10px rgba(64, 158, 255, 0.6));
    }
    
    &:hover {
      filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.2));
    }
  }
  
  .node-body {
    &.node-status-draft {
      stroke-dasharray: 8, 4;
      animation: dash 20s linear infinite;
    }
    
    &.node-status-running {
      animation: pulse 2s ease-in-out infinite;
    }
  }
  
  .connector {
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 1;
      transform: scale(1.2);
    }
  }
  
  .workflow-node:hover .connector {
    opacity: 0.7;
  }
  
  .connection-line {
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      stroke-width: 6;
      filter: drop-shadow(0 0 4px rgba(64, 158, 255, 0.6));
    }
  }
  
  .ai-recommendation-panel {
    position: absolute;
    background: #fff;
    border: 2px solid #9f7aea;
    border-radius: 12px;
    padding: 15px;
    box-shadow: 0 8px 24px rgba(159, 122, 234, 0.3);
    z-index: 1000;
    
    .recommendation-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: #9f7aea;
      margin-bottom: 10px;
    }
    
    .recommendation-buttons {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
  }
}

@keyframes dash {
  to {
    stroke-dashoffset: 100;
  }
}

@keyframes pulse {
  0%, 100% {
    stroke-width: 3;
  }
  50% {
    stroke-width: 6;
  }
}

// ========== 右侧面板 ==========
.right-panel {
  width: 350px;
  background: #fff;
  border-left: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
  
  &.collapsed {
    width: 50px;
    
    .properties-scroll {
      display: none;
    }
  }
  
  .panel-header {
    height: 50px;
    padding: 0 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e4e7ed;
    font-weight: 600;
    
    span {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
  
  .properties-scroll {
    flex: 1;
    padding: 15px;
  }
  
  .property-card {
    margin-bottom: 15px;
    
    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
    }
  }
  
  .property-actions {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}

// ========== 调试模式 ==========
.debug-toolbar {
  margin-bottom: 20px;
}

.json-viewer {
  background: #f5f7fa;
  padding: 15px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
}

.debug-logs {
  .log-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
    border-bottom: 1px solid #e4e7ed;
    font-size: 13px;
  }
}
</style>
