<template>
  <div class="ai-workflow-agent">
    <!-- 顶部导航 -->
    <div class="agent-header">
      <el-page-header @back="goBack">
        <template #icon>
          <el-icon><Operation /></el-icon>
        </template>
        <template #content>
          <span class="header-title">🤖 AI工作流智能体</span>
          <el-tag type="success" size="small" style="margin-left: 10px">企业级Master Prompt驱动</el-tag>
        </template>
        <template #extra>
          <el-button type="primary" @click="showAIDialog" :icon="ChatDotRound">AI生成工作流</el-button>
          <el-button type="success" @click="saveWorkflow" :icon="Select">保存</el-button>
          <el-button @click="exportWorkflow" :icon="Download">导出</el-button>
        </template>
      </el-page-header>
    </div>

    <!-- 主工作区 -->
    <div class="workflow-main">
      <!-- 左侧：智能助手面板 -->
      <div class="ai-panel">
        <el-card shadow="hover" class="ai-card">
          <template #header>
            <div class="panel-header">
              <el-icon><MagicStick /></el-icon>
              <span>AI智能助手</span>
            </div>
          </template>

          <!-- AI对话输入 -->
          <div class="ai-input-section">
            <h4><el-icon><ChatDotRound /></el-icon> 描述你的需求</h4>
            <el-input
              v-model="aiInput"
              type="textarea"
              :rows="4"
              placeholder="示例：生产线包装出现漏装问题，帮我处理&#10;示例：设备需要升级，制定完整方案&#10;示例：车间需要改造布局"
              @keyup.ctrl.enter="generateWorkflowByAI">
            </el-input>
            <el-button 
              type="primary" 
              @click="generateWorkflowByAI" 
              :loading="aiGenerating"
              style="width: 100%; margin-top: 10px"
              :icon="MagicStick">
              {{ aiGenerating ? 'AI思考中...' : 'AI自动生成工作流' }}
            </el-button>
          </div>

          <!-- 场景模板快速选择 -->
          <div class="template-section">
            <h4><el-icon><DocumentCopy /></el-icon> 快速场景模板</h4>
            <el-scrollbar height="300px">
              <div 
                v-for="template in businessTemplates" 
                :key="template.id"
                class="template-card"
                @click="loadTemplate(template)">
                <div class="template-icon">{{ template.icon }}</div>
                <div class="template-info">
                  <div class="template-name">{{ template.name }}</div>
                  <div class="template-desc">{{ template.description }}</div>
                  <el-tag size="small" :type="template.tagType">{{ template.category }}</el-tag>
                </div>
              </div>
            </el-scrollbar>
          </div>

          <!-- 部门选择 -->
          <div class="department-section">
            <h4><el-icon><OfficeBuilding /></el-icon> 当前部门</h4>
            <el-select 
              v-model="selectedDepartment" 
              placeholder="选择部门"
              @change="onDepartmentChange"
              size="large"
              style="width: 100%">
              <el-option
                v-for="dept in departments"
                :key="dept.id"
                :label="dept.name"
                :value="dept.id">
                <span>{{ dept.icon }} {{ dept.name }}</span>
              </el-option>
            </el-select>
          </div>

          <!-- 工作流统计 -->
          <div class="stats-section">
            <h4><el-icon><DataAnalysis /></el-icon> 流程统计</h4>
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="总节点">
                <el-tag type="primary">{{ workflowNodes.length }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="AI节点">
                <el-tag type="success">{{ aiNodesCount }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="连接线">
                <el-tag type="info">{{ connections.length }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="预计时长">
                <el-tag type="warning">{{ totalDuration }}h</el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>
      </div>

      <!-- 中间：可视化画布 -->
      <div class="canvas-area">
        <el-card shadow="never" class="canvas-card">
          <template #header>
            <div class="canvas-header">
              <span>🎨 工作流画布 - {{ currentDepartmentName }}</span>
              <div class="canvas-tools">
                <el-button-group>
                  <el-button :icon="ZoomIn" @click="zoomIn" size="small">放大</el-button>
                  <el-button :icon="ZoomOut" @click="zoomOut" size="small">缩小</el-button>
                  <el-button :icon="Refresh" @click="resetZoom" size="small">重置</el-button>
                </el-button-group>
                <el-tag style="margin-left: 10px">{{ Math.round(canvasScale * 100) }}%</el-tag>
              </div>
            </div>
          </template>

          <!-- SVG画布 -->
          <div 
            class="canvas-container"
            @mousedown="startPan"
            @mousemove="doPan"
            @mouseup="endPan">
          <svg 
            class="workflow-canvas"
            :viewBox="`${panOffset.x} ${panOffset.y} ${6000 / canvasScale} ${4000 / canvasScale}`"
            @click="handleCanvasClick"
            @contextmenu.prevent="handleCanvasRightClick"
            @dblclick="handleCanvasDoubleClick">
              
              <!-- 连接线 -->
              <g class="connections-layer">
                <path
                  v-for="(conn, index) in connections"
                  :key="'conn-' + index"
                  :d="getConnectionPath(conn)"
                  :stroke="conn.color || '#409eff'"
                  stroke-width="4"
                  fill="none"
                  :class="{ 'ai-connection': conn.isAI }"
                  @click.stop="selectConnection(conn, index)">
                </path>
                <!-- 箭头 -->
                <polygon
                  v-for="(conn, index) in connections"
                  :key="'arrow-' + index"
                  :points="getArrowPoints(conn)"
                  :fill="conn.color || '#409eff'">
                </polygon>
              </g>

              <!-- 节点 -->
              <g class="nodes-layer">
              <g
                v-for="(node, index) in workflowNodes"
                :key="node.id"
                :transform="`translate(${node.x}, ${node.y})`"
                class="workflow-node"
                :class="[
                  { 'selected': selectedNode === node.id },
                  { 'ai-node': node.isAI },
                  'node-type-' + node.type
                ]">
                  
                  <!-- 节点形状（添加事件到这里，防止抖动） -->
                  <rect
                    v-if="node.type === 'process' || node.type === 'start' || node.type === 'end'"
                    x="-180"
                    y="-90"
                    width="360"
                    height="180"
                    :rx="node.type === 'start' || node.type === 'end' ? 90 : 20"
                    :fill="node.color || getNodeColor(node.type)"
                    stroke="#fff"
                    stroke-width="4"
                    @mousedown.stop="startDrag(node, $event)"
                    @click.stop="selectNode(node)">
                  </rect>
                  
                  <polygon
                    v-else-if="node.type === 'decision'"
                    points="0,-120 180,0 0,120 -180,0"
                    :fill="node.color || getNodeColor(node.type)"
                    stroke="#fff"
                    stroke-width="4"
                    @mousedown.stop="startDrag(node, $event)"
                    @click.stop="selectNode(node)">
                  </polygon>

                  <!-- AI标识 -->
                  <g v-if="node.isAI" pointer-events="none">
                    <circle
                      cx="150"
                      cy="-75"
                      r="28"
                      fill="#67c23a"
                      class="ai-badge">
                    </circle>
                    <text
                      x="150"
                      y="-67"
                      text-anchor="middle"
                      fill="#fff"
                      font-size="22"
                      font-weight="bold">
                      AI
                    </text>
                  </g>

                  <!-- 节点文本 -->
                  <text
                    x="0"
                    y="-10"
                    text-anchor="middle"
                    fill="#fff"
                    font-size="32"
                    font-weight="bold"
                    pointer-events="none"
                    @dblclick.stop="editNode(node)">
                    {{ node.label }}
                  </text>
                  
                  <!-- 部门信息 -->
                  <text
                    v-if="node.department"
                    x="0"
                    y="20"
                    text-anchor="middle"
                    fill="#fff"
                    font-size="20"
                    opacity="0.9"
                    pointer-events="none">
                    📋 {{ node.department }}
                  </text>
                  
                  <!-- 时长信息 -->
                  <text
                    v-if="node.duration"
                    x="0"
                    y="50"
                    text-anchor="middle"
                    fill="#fff"
                    font-size="24"
                    opacity="0.9"
                    pointer-events="none">
                    ⏱ {{ node.duration }}h
                  </text>

                  <!-- 连接点 -->
                  <circle
                    v-for="point in ['top', 'right', 'bottom', 'left']"
                    :key="point"
                    :cx="getConnectorPos(point).x"
                    :cy="getConnectorPos(point).y"
                    r="12"
                    fill="#409eff"
                    stroke="#fff"
                    stroke-width="2"
                    class="connector"
                    @mousedown.stop="startConnection(node, point)"
                    @mouseup.stop="endConnection(node, point)">
                  </circle>
                </g>
              </g>

              <!-- 临时连接线 -->
              <line
                v-if="tempConnection"
                :x1="tempConnection.x1"
                :y1="tempConnection.y1"
                :x2="tempConnection.x2"
                :y2="tempConnection.y2"
                stroke="#409eff"
                stroke-width="2"
                stroke-dasharray="5,5">
              </line>
            </svg>

            <!-- 右键菜单 -->
            <el-dropdown 
              trigger="contextmenu"
              :teleported="false"
              v-model:visible="contextMenuVisible"
              :style="{
                position: 'absolute',
                left: contextMenuPosition.x + 'px',
                top: contextMenuPosition.y + 'px',
                display: contextMenuVisible ? 'block' : 'none'
              }">
              <span></span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="addNodeAtPosition('process')">
                    <el-icon><DocumentAdd /></el-icon> 添加流程节点
                  </el-dropdown-item>
                  <el-dropdown-item @click="addNodeAtPosition('decision')">
                    <el-icon><QuestionFilled /></el-icon> 添加决策节点
                  </el-dropdown-item>
                  <el-dropdown-item @click="addNodeAtPosition('start')">
                    <el-icon><VideoPlay /></el-icon> 添加开始节点
                  </el-dropdown-item>
                  <el-dropdown-item @click="addNodeAtPosition('end')">
                    <el-icon><VideoPause /></el-icon> 添加结束节点
                  </el-dropdown-item>
                  <el-dropdown-item divided v-if="selectedNode" @click="deleteNode">
                    <el-icon><Delete /></el-icon> 删除节点
                  </el-dropdown-item>
                  <el-dropdown-item v-if="selectedNode" @click="editNodeLabel">
                    <el-icon><Edit /></el-icon> 编辑节点
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-card>
      </div>

      <!-- 右侧：属性编辑面板 -->
      <div class="properties-panel">
        <el-card shadow="hover" class="properties-card">
          <template #header>
            <div class="panel-header">
              <el-icon><Edit /></el-icon>
              <span>节点属性</span>
            </div>
          </template>

          <div v-if="currentNode" class="properties-content">
            <!-- 基础信息 -->
            <el-form label-width="80px" size="small">
              <el-form-item label="节点名称">
                <el-input v-model="currentNode.label" @change="updateNode"></el-input>
              </el-form-item>

              <el-form-item label="节点类型">
                <el-select v-model="currentNode.type" @change="updateNode">
                  <el-option label="🟢 开始" value="start"></el-option>
                  <el-option label="📋 流程" value="process"></el-option>
                  <el-option label="💎 决策" value="decision"></el-option>
                  <el-option label="🔴 结束" value="end"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="AI能力">
                <el-switch 
                  v-model="currentNode.isAI" 
                  @change="updateNode"
                  active-text="启用AI"
                  inactive-text="常规节点">
                </el-switch>
              </el-form-item>

              <el-form-item v-if="currentNode.isAI" label="AI类型">
                <el-select v-model="currentNode.aiType" @change="updateNode">
                  <el-option label="🔍 数据判断" value="data-analysis"></el-option>
                  <el-option label="🔧 故障识别" value="fault-detection"></el-option>
                  <el-option label="📸 图片识别" value="image-recognition"></el-option>
                  <el-option label="📊 效率计算" value="efficiency-calc"></el-option>
                  <el-option label="💰 预算生成" value="budget-gen"></el-option>
                  <el-option label="🏢 供应商比选" value="vendor-selection"></el-option>
                  <el-option label="📈 流程优化" value="process-optimize"></el-option>
                  <el-option label="📝 文档生成" value="doc-generation"></el-option>
                  <el-option label="⚠️ 风险预警" value="risk-alert"></el-option>
                  <el-option label="✅ 质量检测" value="quality-check"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="负责人">
                <el-input v-model="currentNode.owner" @change="updateNode" placeholder="输入负责人"></el-input>
              </el-form-item>

              <el-form-item label="预计时长">
                <el-input-number 
                  v-model="currentNode.duration" 
                  @change="updateNode"
                  :min="0.1"
                  :step="0.5"
                  controls-position="right">
                </el-input-number>
                <span style="margin-left: 5px">小时</span>
              </el-form-item>

              <el-form-item label="节点颜色">
                <el-color-picker v-model="currentNode.color" @change="updateNode"></el-color-picker>
              </el-form-item>

              <el-form-item label="描述">
                <el-input 
                  v-model="currentNode.description" 
                  type="textarea"
                  :rows="3"
                  @change="updateNode"
                  placeholder="输入节点描述、目标、输入输出等">
                </el-input>
              </el-form-item>

              <el-form-item label="风险提示">
                <el-input 
                  v-model="currentNode.risks" 
                  type="textarea"
                  :rows="2"
                  @change="updateNode"
                  placeholder="输入潜在风险和预防措施">
                </el-input>
              </el-form-item>

              <el-form-item label="数据依赖">
                <el-select 
                  v-model="currentNode.dataSources" 
                  multiple
                  @change="updateNode"
                  placeholder="选择数据来源">
                  <el-option label="MES系统" value="mes"></el-option>
                  <el-option label="ERP系统" value="erp"></el-option>
                  <el-option label="CRM系统" value="crm"></el-option>
                  <el-option label="设备数据" value="device"></el-option>
                  <el-option label="质检系统" value="quality"></el-option>
                  <el-option label="仓储系统" value="warehouse"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-button type="danger" @click="deleteNode" :icon="Delete">删除节点</el-button>
              </el-form-item>
            </el-form>
          </div>

          <el-empty v-else description="请选择一个节点进行编辑" :image-size="100"></el-empty>
        </el-card>

        <!-- AI生成的文档预览 -->
        <el-card v-if="generatedDocs.length > 0" shadow="hover" style="margin-top: 10px">
          <template #header>
            <div class="panel-header">
              <el-icon><Document /></el-icon>
              <span>AI生成文档</span>
            </div>
          </template>
          <el-scrollbar height="200px">
            <div v-for="(doc, index) in generatedDocs" :key="index" class="doc-item">
              <el-tag type="success" size="small">{{ doc.type }}</el-tag>
              <span style="margin-left: 8px">{{ doc.title }}</span>
              <el-button link type="primary" @click="viewDocument(doc)">查看</el-button>
            </div>
          </el-scrollbar>
        </el-card>
      </div>
    </div>

    <!-- AI对话生成工作流弹窗 -->
    <el-dialog
      v-model="aiDialogVisible"
      title="🤖 AI工作流智能生成"
      width="60%"
      :close-on-click-modal="false">
      <div class="ai-dialog-content">
        <el-alert
          title="AI Master Prompt 已加载"
          type="success"
          description="我可以根据你的描述自动生成完整的企业级工作流，包括AI判断节点、文档生成、跨系统联动等"
          show-icon
          :closable="false"
          style="margin-bottom: 20px">
        </el-alert>

        <el-form label-width="100px">
          <el-form-item label="任务描述">
            <el-input
              v-model="aiDialogInput"
              type="textarea"
              :rows="6"
              placeholder="请详细描述你的任务场景，例如：&#10;- 我们生产线出现包装漏装问题&#10;- 需要对车间进行布局改造&#10;- 设备老化需要升级更换&#10;- 采购固定资产需要比选方案">
            </el-input>
          </el-form-item>

          <el-form-item label="关键信息">
            <el-row :gutter="10">
              <el-col :span="12">
                <el-input v-model="aiContext.department" placeholder="所属部门"></el-input>
              </el-col>
              <el-col :span="12">
                <el-input v-model="aiContext.urgency" placeholder="紧急程度（低/中/高）"></el-input>
              </el-col>
            </el-row>
          </el-form-item>

          <el-form-item label="期望输出">
            <el-checkbox-group v-model="aiContext.expectedOutputs">
              <el-checkbox label="工作流程图">可执行工作流</el-checkbox>
              <el-checkbox label="文档生成">相关文档（报告/清单/预算等）</el-checkbox>
              <el-checkbox label="风险预警">风险点和预防措施</el-checkbox>
              <el-checkbox label="优化建议">流程优化和改进建议</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <el-button @click="aiDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAIGeneration" :loading="aiGenerating" :icon="MagicStick">
          {{ aiGenerating ? 'AI生成中...' : '开始生成' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 文档查看弹窗 -->
    <el-dialog
      v-model="docViewVisible"
      :title="currentDoc.title"
      width="70%">
      <el-scrollbar height="500px">
        <div class="document-content" v-html="currentDoc.content"></div>
      </el-scrollbar>
      <template #footer>
        <el-button type="primary" @click="downloadDocument">下载文档</el-button>
        <el-button @click="docViewVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Operation, ChatDotRound, Select, Download, MagicStick, 
  Setting, OfficeBuilding, DataAnalysis, DocumentCopy, 
  Edit, Delete, Plus, ZoomIn, ZoomOut, Refresh, Document,
  DocumentAdd, QuestionFilled, VideoPlay, VideoPause
} from '@element-plus/icons-vue'

const router = useRouter()

// ==================== 核心数据 ====================

// 14个部门定义
const departments = ref([
  { id: 'rd', name: '研发部', icon: '🔬', description: '产品研发与创新' },
  { id: 'planning', name: '生产计划管理', icon: '📋', description: '生产排程与计划' },
  { id: 'quality', name: '质量部', icon: '✅', description: '质量控制与保证' },
  { id: 'process', name: '工艺部', icon: '⚙️', description: '工艺改进与优化' },
  { id: 'admin', name: '商务内勤', icon: '📞', description: '内勤业务管理' },
  { id: 'procurement', name: '商务采购', icon: '🛒', description: '采购与供应商管理' },
  { id: 'logistics', name: '物流', icon: '🚚', description: '物流与配送' },
  { id: 'warehouse', name: '库房', icon: '📦', description: '仓储管理' },
  { id: 'finance', name: '财务', icon: '💰', description: '财务管理与审批' },
  { id: 'management', name: '企管', icon: '📊', description: '企业管理' },
  { id: 'hr', name: '人事部', icon: '👥', description: '人力资源管理' },
  { id: 'equipment', name: '设备科', icon: '🔧', description: '设备维护管理' },
  { id: 'dispatch', name: '车辆调度', icon: '🚗', description: '车辆调度管理' },
  { id: 'vehicle', name: '车辆管理', icon: '🚙', description: '车辆资产管理' }
])

// 业务场景模板（基于Master Prompt）
const businessTemplates = ref([
  {
    id: 1,
    name: '设备升级工作流',
    icon: '🔧',
    description: '设备老化判断→技术比选→预算测算→采购验收',
    category: '设备类',
    tagType: 'warning',
    workflow: 'equipment-upgrade'
  },
  {
    id: 2,
    name: '车间改造工作流',
    icon: '🏭',
    description: '布局分析→新布局设计→仿真预测→施工验收',
    category: '生产类',
    tagType: 'primary',
    workflow: 'workshop-renovation'
  },
  {
    id: 3,
    name: '包装漏装处理',
    icon: '📦',
    description: '图片识别→批次定位→原因溯源→改善措施',
    category: '质量类',
    tagType: 'danger',
    workflow: 'packaging-missing'
  },
  {
    id: 4,
    name: '设备故障处理',
    icon: '⚠️',
    description: '故障识别→工单分派→维修→复盘预防',
    category: '设备类',
    tagType: 'warning',
    workflow: 'equipment-fault'
  },
  {
    id: 5,
    name: '固定资产采购',
    icon: '💰',
    description: '需求验证→供应商比选→审批→验收入账',
    category: '采购类',
    tagType: 'success',
    workflow: 'asset-procurement'
  },
  {
    id: 6,
    name: '生产异常处理',
    icon: '🚨',
    description: '异常识别→影响评估→应急方案→根因分析',
    category: '生产类',
    tagType: 'danger',
    workflow: 'production-exception'
  },
  {
    id: 7,
    name: '工艺改进验证',
    icon: '⚙️',
    description: '改进方案→试验验证→数据分析→标准化',
    category: '工艺类',
    tagType: 'primary',
    workflow: 'process-improvement'
  },
  {
    id: 8,
    name: '供应商评估',
    icon: '🏢',
    description: '资质审核→实地考察→样品验证→综合评分',
    category: '采购类',
    tagType: 'success',
    workflow: 'vendor-evaluation'
  }
])

// 工作流节点
const workflowNodes = ref([])

// 连接线
const connections = ref([])

// 选中的部门
const selectedDepartment = ref('planning')

// 选中的节点
const selectedNode = ref(null)

// AI相关
const aiInput = ref('')
const aiGenerating = ref(false)
const aiDialogVisible = ref(false)
const aiDialogInput = ref('')
const aiContext = ref({
  department: '',
  urgency: '中',
  expectedOutputs: ['工作流程图']
})

// 画布控制
const canvasScale = ref(1)
const panOffset = ref({ x: 0, y: 0 })
const isPanning = ref(false)
const panStart = ref({ x: 0, y: 0 })

// 拖拽相关
const draggingNode = ref(null)
const dragOffset = ref({ x: 0, y: 0 })

// 连接线绘制
const tempConnection = ref(null)
const connectionStart = ref(null)

// 生成的文档
const generatedDocs = ref([])

// 文档查看
const docViewVisible = ref(false)
const currentDoc = ref({ title: '', content: '' })

// 右键菜单
const contextMenuVisible = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })
const clickPosition = ref({ x: 0, y: 0 })

// ==================== 计算属性 ====================

const currentNode = computed(() => {
  if (!selectedNode.value) return null
  return workflowNodes.value.find(n => n.id === selectedNode.value)
})

const currentDepartmentName = computed(() => {
  const dept = departments.value.find(d => d.id === selectedDepartment.value)
  return dept ? dept.name : '未选择部门'
})

const aiNodesCount = computed(() => {
  return workflowNodes.value.filter(n => n.isAI).length
})

const totalDuration = computed(() => {
  return workflowNodes.value.reduce((sum, node) => sum + (node.duration || 0), 0).toFixed(1)
})

// ==================== AI核心方法 ====================

// Master Prompt核心逻辑
const masterPromptEngine = {
  // 识别任务类型
  identifyTaskType(input) {
    const keywords = {
      '设备类': ['设备', '故障', '维修', '升级', '更换', '老化'],
      '生产类': ['生产', '车间', '改造', '布局', '产线', '产能'],
      '质量类': ['质量', '漏装', '缺陷', '不良', '检验', '异常'],
      '采购类': ['采购', '供应商', '比选', '资产', '招标'],
      '工艺类': ['工艺', '改进', '优化', '参数', '标准化'],
      '项目类': ['项目', '实施', '验收', '部署']
    }
    
    for (const [type, words] of Object.entries(keywords)) {
      if (words.some(word => input.includes(word))) {
        return type
      }
    }
    return '通用类'
  },

  // 生成工作流节点
  generateWorkflowNodes(taskType, description) {
    const templates = {
      '设备类': [
        { label: '设备老化判断', type: 'process', isAI: true, aiType: 'data-analysis', duration: 2 },
        { label: '技术方案比选', type: 'process', isAI: true, aiType: 'vendor-selection', duration: 4 },
        { label: '预算ROI测算', type: 'process', isAI: true, aiType: 'budget-gen', duration: 3 },
        { label: '审批流程', type: 'decision', isAI: false, duration: 1 },
        { label: '采购实施', type: 'process', isAI: false, duration: 5 },
        { label: '验收与调试', type: 'process', isAI: true, aiType: 'quality-check', duration: 3 },
        { label: '效果复盘', type: 'process', isAI: true, aiType: 'doc-generation', duration: 2 }
      ],
      '生产类': [
        { label: '现状分析', type: 'process', isAI: true, aiType: 'data-analysis', duration: 2 },
        { label: '新方案设计', type: 'process', isAI: true, aiType: 'process-optimize', duration: 4 },
        { label: '仿真验证', type: 'process', isAI: true, aiType: 'efficiency-calc', duration: 3 },
        { label: '方案评审', type: 'decision', isAI: false, duration: 1 },
        { label: '实施改造', type: 'process', isAI: false, duration: 10 },
        { label: '效果验证', type: 'process', isAI: true, aiType: 'data-analysis', duration: 2 },
        { label: '总结优化', type: 'process', isAI: true, aiType: 'doc-generation', duration: 1 }
      ],
      '质量类': [
        { label: '问题识别', type: 'process', isAI: true, aiType: 'image-recognition', duration: 1 },
        { label: '批次隔离', type: 'process', isAI: false, duration: 0.5 },
        { label: '原因分析', type: 'process', isAI: true, aiType: 'fault-detection', duration: 2 },
        { label: '临时措施', type: 'process', isAI: false, duration: 1 },
        { label: '永久改善', type: 'process', isAI: true, aiType: 'process-optimize', duration: 3 },
        { label: 'SOP更新', type: 'process', isAI: true, aiType: 'doc-generation', duration: 1 },
        { label: '风险复查', type: 'process', isAI: true, aiType: 'risk-alert', duration: 1 }
      ],
      '采购类': [
        { label: '需求确认', type: 'process', isAI: true, aiType: 'data-analysis', duration: 1 },
        { label: '市场调研', type: 'process', isAI: false, duration: 2 },
        { label: '供应商比选', type: 'process', isAI: true, aiType: 'vendor-selection', duration: 3 },
        { label: '预算审批', type: 'decision', isAI: false, duration: 1 },
        { label: '合同签订', type: 'process', isAI: false, duration: 1 },
        { label: '到货验收', type: 'process', isAI: true, aiType: 'quality-check', duration: 1 },
        { label: '入账归档', type: 'process', isAI: true, aiType: 'doc-generation', duration: 0.5 }
      ]
    }

    return templates[taskType] || templates['生产类']
  },

  // 生成AI文档
  generateDocuments(taskType, nodes) {
    const docs = []
    
    if (taskType.includes('设备')) {
      docs.push({
        type: '设备升级方案',
        title: '设备升级完整方案',
        content: this.generateUpgradeDoc(nodes)
      })
      docs.push({
        type: 'ROI分析报告',
        title: '投资回报分析',
        content: this.generateROIDoc(nodes)
      })
    }
    
    if (taskType.includes('质量')) {
      docs.push({
        type: '8D报告',
        title: '质量问题8D分析报告',
        content: this.generate8DDoc(nodes)
      })
      docs.push({
        type: '改善方案',
        title: '永久改善措施',
        content: this.generateImprovementDoc(nodes)
      })
    }
    
    if (taskType.includes('采购')) {
      docs.push({
        type: '供应商比选表',
        title: '供应商综合评分',
        content: this.generateVendorComparisonDoc(nodes)
      })
      docs.push({
        type: '预算清单',
        title: '采购预算明细',
        content: this.generateBudgetDoc(nodes)
      })
    }

    docs.push({
      type: '项目复盘',
      title: '项目实施复盘报告',
      content: this.generateReviewDoc(nodes)
    })
    
    return docs
  },

  generateUpgradeDoc(nodes) {
    return `
      <h2>设备升级完整方案</h2>
      <h3>一、升级背景与目标</h3>
      <p>根据设备运行数据和老化评估，本次升级旨在提升生产效率、降低故障率、优化能耗。</p>
      
      <h3>二、技术方案比选</h3>
      <table border="1" cellpadding="10" style="width:100%; border-collapse:collapse;">
        <tr><th>方案</th><th>品牌型号</th><th>技术优势</th><th>预估成本</th><th>综合评分</th></tr>
        <tr><td>方案A</td><td>XX品牌 Model-A</td><td>高效率、低能耗</td><td>50万</td><td>85分</td></tr>
        <tr><td>方案B</td><td>YY品牌 Model-B</td><td>稳定性强</td><td>45万</td><td>82分</td></tr>
        <tr><td>方案C</td><td>ZZ品牌 Model-C</td><td>智能化高</td><td>60万</td><td>88分</td></tr>
      </table>
      
      <h3>三、ROI测算</h3>
      <ul>
        <li>投资成本：60万元</li>
        <li>年节约成本：15万元（能耗+维修+停机损失）</li>
        <li>投资回报期：4年</li>
        <li>5年净收益：15万元</li>
      </ul>
      
      <h3>四、实施计划</h3>
      <p>共分${nodes.length}个阶段，预计总耗时${nodes.reduce((sum, n) => sum + (n.duration || 0), 0)}小时。</p>
      
      <h3>五、风险控制</h3>
      <ul>
        <li>停机风险：安排周末施工，备用产线顶替</li>
        <li>调试风险：厂家技术人员驻场3天</li>
        <li>验收风险：制定详细验收标准</li>
      </ul>
    `
  },

  generateROIDoc(nodes) {
    return `
      <h2>投资回报分析（ROI）</h2>
      <h3>投资概况</h3>
      <table border="1" cellpadding="10" style="width:100%; border-collapse:collapse;">
        <tr><th>项目</th><th>金额（万元）</th></tr>
        <tr><td>设备采购</td><td>50</td></tr>
        <tr><td>安装调试</td><td>5</td></tr>
        <tr><td>培训费用</td><td>3</td></tr>
        <tr><td>备件储备</td><td>2</td></tr>
        <tr><td><strong>总投资</strong></td><td><strong>60</strong></td></tr>
      </table>
      
      <h3>收益预测（年）</h3>
      <table border="1" cellpadding="10" style="width:100%; border-collapse:collapse;">
        <tr><th>收益项</th><th>金额（万元）</th></tr>
        <tr><td>能耗节约</td><td>6</td></tr>
        <tr><td>维修成本降低</td><td>4</td></tr>
        <tr><td>停机损失减少</td><td>3</td></tr>
        <tr><td>效率提升增收</td><td>2</td></tr>
        <tr><td><strong>年收益合计</strong></td><td><strong>15</strong></td></tr>
      </table>
      
      <h3>关键指标</h3>
      <ul>
        <li><strong>投资回报期（ROI）：</strong>4.0年</li>
        <li><strong>内部收益率（IRR）：</strong>18%</li>
        <li><strong>净现值（NPV）：</strong>12万元（5年）</li>
      </ul>
    `
  },

  generate8DDoc(nodes) {
    return `
      <h2>8D质量问题分析报告</h2>
      <p><strong>问题描述：</strong>包装过程中出现漏装配件问题</p>
      
      <h3>D1 - 组建团队</h3>
      <p>质量部牵头，生产、工艺、仓储参与</p>
      
      <h3>D2 - 问题描述</h3>
      <p>某批次产品包装缺少关键配件，客户投诉率上升</p>
      
      <h3>D3 - 临时措施</h3>
      <ul>
        <li>立即隔离可疑批次</li>
        <li>加强出货前检查</li>
        <li>客户端快速补发</li>
      </ul>
      
      <h3>D4 - 根本原因</h3>
      <p>通过AI图像识别和数据分析，定位原因：</p>
      <ul>
        <li>包装工位作业指导书不清晰</li>
        <li>配件摆放位置不合理</li>
        <li>检查流程缺失</li>
      </ul>
      
      <h3>D5 - 永久纠正措施</h3>
      <ul>
        <li>更新包装SOP，增加配件清单核对环节</li>
        <li>优化配件摆放，采用颜色标识</li>
        <li>增加AI视觉检测系统</li>
      </ul>
      
      <h3>D6 - 验证效果</h3>
      <p>措施实施后连续30天无漏装问题</p>
      
      <h3>D7 - 预防再发</h3>
      <ul>
        <li>标准化到所有包装工位</li>
        <li>定期培训和抽查</li>
        <li>纳入KPI考核</li>
      </ul>
      
      <h3>D8 - 团队表彰</h3>
      <p>对改善团队给予表彰和奖励</p>
    `
  },

  generateImprovementDoc(nodes) {
    return `
      <h2>永久改善措施方案</h2>
      <h3>一、现状问题</h3>
      <p>包装漏装问题频发，影响客户满意度和品牌形象</p>
      
      <h3>二、改善措施</h3>
      <h4>1. 作业标准化</h4>
      <ul>
        <li>重新编写包装作业指导书</li>
        <li>增加配件核对清单</li>
        <li>培训所有包装人员</li>
      </ul>
      
      <h4>2. 防错设计</h4>
      <ul>
        <li>配件区域颜色标识</li>
        <li>配件数量可视化管理</li>
        <li>包装完成自检确认</li>
      </ul>
      
      <h4>3. 智能化升级</h4>
      <ul>
        <li>引入AI视觉检测系统</li>
        <li>自动识别配件完整性</li>
        <li>实时报警提示</li>
      </ul>
      
      <h3>三、实施计划</h3>
      <table border="1" cellpadding="10" style="width:100%; border-collapse:collapse;">
        <tr><th>阶段</th><th>内容</th><th>负责人</th><th>时间</th></tr>
        <tr><td>第1周</td><td>SOP修订和培训</td><td>质量部</td><td>5天</td></tr>
        <tr><td>第2周</td><td>防错标识实施</td><td>生产部</td><td>3天</td></tr>
        <tr><td>第3-4周</td><td>AI系统部署</td><td>设备科</td><td>10天</td></tr>
        <tr><td>第5周</td><td>试运行观察</td><td>质量部</td><td>7天</td></tr>
      </table>
      
      <h3>四、预期效果</h3>
      <ul>
        <li>漏装率降低至0.01%以下</li>
        <li>客户投诉归零</li>
        <li>包装效率提升10%</li>
      </ul>
    `
  },

  generateVendorComparisonDoc(nodes) {
    return `
      <h2>供应商综合评分表</h2>
      <table border="1" cellpadding="10" style="width:100%; border-collapse:collapse;">
        <tr>
          <th>评估维度</th>
          <th>权重</th>
          <th>供应商A</th>
          <th>供应商B</th>
          <th>供应商C</th>
        </tr>
        <tr>
          <td>产品质量</td><td>30%</td>
          <td>90分</td><td>85分</td><td>88分</td>
        </tr>
        <tr>
          <td>价格竞争力</td><td>25%</td>
          <td>80分</td><td>90分</td><td>85分</td>
        </tr>
        <tr>
          <td>交货及时性</td><td>20%</td>
          <td>85分</td><td>80分</td><td>90分</td>
        </tr>
        <tr>
          <td>技术支持</td><td>15%</td>
          <td>88分</td><td>82分</td><td>85分</td>
        </tr>
        <tr>
          <td>服务响应</td><td>10%</td>
          <td>90分</td><td>88分</td><td>85分</td>
        </tr>
        <tr>
          <td><strong>综合得分</strong></td><td><strong>100%</strong></td>
          <td><strong>86.5分</strong></td><td><strong>85.2分</strong></td><td><strong>87.1分</strong></td>
        </tr>
      </table>
      
      <h3>推荐结论</h3>
      <p><strong>推荐供应商：供应商C</strong></p>
      <p>理由：综合得分最高，交货及时性突出，整体表现均衡</p>
    `
  },

  generateBudgetDoc(nodes) {
    return `
      <h2>采购预算明细表</h2>
      <table border="1" cellpadding="10" style="width:100%; border-collapse:collapse;">
        <tr><th>序号</th><th>项目</th><th>数量</th><th>单价（元）</th><th>金额（元）</th></tr>
        <tr><td>1</td><td>主设备</td><td>1套</td><td>450,000</td><td>450,000</td></tr>
        <tr><td>2</td><td>安装调试费</td><td>1项</td><td>30,000</td><td>30,000</td></tr>
        <tr><td>3</td><td>培训费</td><td>1项</td><td>15,000</td><td>15,000</td></tr>
        <tr><td>4</td><td>备件包</td><td>1套</td><td>20,000</td><td>20,000</td></tr>
        <tr><td>5</td><td>运输费</td><td>1项</td><td>5,000</td><td>5,000</td></tr>
        <tr><td>6</td><td>税费</td><td>1项</td><td>30,000</td><td>30,000</td></tr>
        <tr><td colspan="4"><strong>合计</strong></td><td><strong>550,000</strong></td></tr>
      </table>
      
      <h3>付款方式</h3>
      <ul>
        <li>合同签订：预付30% （165,000元）</li>
        <li>设备到货：支付50% （275,000元）</li>
        <li>验收合格：支付20% （110,000元）</li>
      </ul>
    `
  },

  generateReviewDoc(nodes) {
    return `
      <h2>项目实施复盘报告</h2>
      <h3>一、项目概况</h3>
      <p>共计${nodes.length}个关键节点，总耗时${nodes.reduce((sum, n) => sum + (n.duration || 0), 0)}小时</p>
      
      <h3>二、完成情况</h3>
      <table border="1" cellpadding="10" style="width:100%; border-collapse:collapse;">
        <tr><th>阶段</th><th>计划时长</th><th>实际时长</th><th>完成率</th></tr>
        ${nodes.map((n, i) => `
          <tr>
            <td>${n.label}</td>
            <td>${n.duration}h</td>
            <td>${(n.duration * (0.9 + Math.random() * 0.2)).toFixed(1)}h</td>
            <td>${95 + Math.floor(Math.random() * 5)}%</td>
          </tr>
        `).join('')}
      </table>
      
      <h3>三、经验总结</h3>
      <h4>✅ 做得好的</h4>
      <ul>
        <li>AI辅助决策大幅提升效率</li>
        <li>跨部门协作顺畅</li>
        <li>文档自动生成节省时间</li>
      </ul>
      
      <h4>⚠️ 需改进的</h4>
      <ul>
        <li>前期需求澄清可以更充分</li>
        <li>部分数据联动需优化</li>
        <li>风险预警机制需加强</li>
      </ul>
      
      <h3>四、下次优化建议</h3>
      <ul>
        <li>建立标准化流程模板库</li>
        <li>加强AI模型训练</li>
        <li>完善知识库沉淀机制</li>
      </ul>
    `
  }
}

// AI生成工作流
const generateWorkflowByAI = async () => {
  if (!aiInput.value.trim()) {
    ElMessage.warning('请输入任务描述')
    return
  }

  aiGenerating.value = true
  
  try {
    // 模拟AI思考过程
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 识别任务类型
    const taskType = masterPromptEngine.identifyTaskType(aiInput.value)
    ElMessage.success(`AI识别：${taskType}任务`)
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 生成工作流节点
    const templateNodes = masterPromptEngine.generateWorkflowNodes(taskType, aiInput.value)
    
    // 清空现有节点
    workflowNodes.value = []
    connections.value = []
    
    // 添加开始节点
    workflowNodes.value.push({
      id: 'start-' + Date.now(),
      label: '任务启动',
      type: 'start',
      x: 100,
      y: 100,
      color: '#67c23a',
      isAI: false,
      duration: 0
    })
    
    // 添加AI生成的节点
    templateNodes.forEach((node, index) => {
      const newNode = {
        id: 'node-' + Date.now() + '-' + index,
        ...node,
        x: 100 + (index % 3) * 200,
        y: 200 + Math.floor(index / 3) * 150,
        owner: aiContext.value.department || '待分配',
        description: `AI自动生成的${node.label}节点`,
        dataSources: node.isAI ? ['mes', 'erp'] : []
      }
      workflowNodes.value.push(newNode)
    })
    
    // 添加结束节点
    workflowNodes.value.push({
      id: 'end-' + Date.now(),
      label: '任务完成',
      type: 'end',
      x: 100 + (templateNodes.length % 3) * 200,
      y: 200 + Math.floor(templateNodes.length / 3) * 150 + 150,
      color: '#f56c6c',
      isAI: false,
      duration: 0
    })
    
    // 自动连接节点
    for (let i = 0; i < workflowNodes.value.length - 1; i++) {
      connections.value.push({
        from: workflowNodes.value[i].id,
        to: workflowNodes.value[i + 1].id,
        color: workflowNodes.value[i + 1].isAI ? '#67c23a' : '#409eff'
      })
    }
    
    // 生成文档
    generatedDocs.value = masterPromptEngine.generateDocuments(taskType, workflowNodes.value)
    
    ElMessage.success({
      message: `AI已生成完整工作流（${workflowNodes.value.length}个节点，${generatedDocs.value.length}份文档）`,
      duration: 3000
    })
    
    aiInput.value = ''
    
  } catch (error) {
    ElMessage.error('AI生成失败：' + error.message)
  } finally {
    aiGenerating.value = false
  }
}

// 加载模板
const loadTemplate = async (template) => {
  ElMessageBox.confirm(
    `确定加载"${template.name}"模板吗？当前工作流将被替换。`,
    '确认加载',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    aiInput.value = template.description
    await generateWorkflowByAI()
  }).catch(() => {
    ElMessage.info('已取消')
  })
}

// 显示AI对话框
const showAIDialog = () => {
  aiDialogVisible.value = true
  aiDialogInput.value = aiInput.value
}

// 确认AI生成
const confirmAIGeneration = async () => {
  aiInput.value = aiDialogInput.value
  aiDialogVisible.value = false
  await generateWorkflowByAI()
}

// ==================== 画布交互方法 ====================

// 处理画布点击
const handleCanvasClick = (event) => {
  if (event.target.tagName === 'svg') {
    deselectAll()
  }
}

// 处理画布右键
const handleCanvasRightClick = (event) => {
  event.preventDefault()
  const canvas = event.currentTarget
  const rect = canvas.getBoundingClientRect()
  
  // 记录点击位置（SVG坐标）
  const svgX = (event.clientX - rect.left) / canvasScale.value + panOffset.value.x
  const svgY = (event.clientY - rect.top) / canvasScale.value + panOffset.value.y
  clickPosition.value = { x: svgX, y: svgY }
  
  // 显示菜单（屏幕坐标）
  contextMenuPosition.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
  contextMenuVisible.value = true
}

// 处理画布双击
const handleCanvasDoubleClick = (event) => {
  if (event.target.tagName === 'svg') {
    const canvas = event.currentTarget
    const rect = canvas.getBoundingClientRect()
    const svgX = (event.clientX - rect.left) / canvasScale.value + panOffset.value.x
    const svgY = (event.clientY - rect.top) / canvasScale.value + panOffset.value.y
    
    addNodeAtPosition('process', { x: svgX, y: svgY })
  }
}

// 在指定位置添加节点
const addNodeAtPosition = (type, position = null) => {
  const pos = position || clickPosition.value
  const nodeId = 'node-' + Date.now()
  
  const nodeLabels = {
    process: '新流程',
    decision: '判断',
    start: '开始',
    end: '结束'
  }
  
  const newNode = {
    id: nodeId,
    type: type,
    label: nodeLabels[type] || '新节点',
    x: pos.x,
    y: pos.y,
    color: getNodeColor(type),
    department: selectedDepartment.value,
    owner: '',
    duration: type === 'process' ? 2 : 0,
    description: '',
    isAI: false
  }
  
  workflowNodes.value.push(newNode)
  selectedNode.value = nodeId
  contextMenuVisible.value = false
  
  ElMessage.success('节点已添加')
}

// 编辑节点标签
const editNodeLabel = () => {
  const node = currentNode.value
  if (!node) return
  
  ElMessageBox.prompt('请输入节点名称', '编辑节点', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputValue: node.label,
    inputPattern: /.+/,
    inputErrorMessage: '节点名称不能为空'
  }).then(({ value }) => {
    node.label = value
    ElMessage.success('节点名称已更新')
    saveWorkflow()
  }).catch(() => {})
}

// ==================== 节点操作方法 ====================

const getNodeColor = (type) => {
  const colors = {
    start: '#67c23a',
    process: '#409eff',
    decision: '#e6a23c',
    end: '#f56c6c'
  }
  return colors[type] || '#409eff'
}

const selectNode = (node) => {
  selectedNode.value = node.id
}

const deselectAll = () => {
  selectedNode.value = null
}

const updateNode = () => {
  // 节点更新后自动保存
  saveWorkflow()
}

const deleteNode = () => {
  ElMessageBox.confirm('确定删除该节点吗？', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = workflowNodes.value.findIndex(n => n.id === selectedNode.value)
    if (index !== -1) {
      // 删除相关连接
      connections.value = connections.value.filter(
        c => c.from !== selectedNode.value && c.to !== selectedNode.value
      )
      // 删除节点
      workflowNodes.value.splice(index, 1)
      selectedNode.value = null
      ElMessage.success('节点已删除')
    }
  }).catch(() => {})
}

// ==================== 拖拽相关 ====================

const startDrag = (node, event) => {
  draggingNode.value = node
  const rect = event.target.getBoundingClientRect()
  dragOffset.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
  
  document.addEventListener('mousemove', doDrag)
  document.addEventListener('mouseup', endDrag)
}

const doDrag = (event) => {
  if (!draggingNode.value) return
  
  const canvas = document.querySelector('.workflow-canvas')
  const rect = canvas.getBoundingClientRect()
  
  draggingNode.value.x = (event.clientX - rect.left - dragOffset.value.x) / canvasScale.value + panOffset.value.x
  draggingNode.value.y = (event.clientY - rect.top - dragOffset.value.y) / canvasScale.value + panOffset.value.y
}

const endDrag = () => {
  draggingNode.value = null
  document.removeEventListener('mousemove', doDrag)
  document.removeEventListener('mouseup', endDrag)
}

// ==================== 连接线相关 ====================

const getConnectorPos = (position) => {
  const positions = {
    top: { x: 0, y: -90 },
    right: { x: 180, y: 0 },
    bottom: { x: 0, y: 90 },
    left: { x: -180, y: 0 }
  }
  return positions[position] || { x: 0, y: 0 }
}

const startConnection = (node, point) => {
  connectionStart.value = { node, point }
}

const endConnection = (node, point) => {
  if (!connectionStart.value || connectionStart.value.node.id === node.id) {
    connectionStart.value = null
    return
  }
  
  connections.value.push({
    from: connectionStart.value.node.id,
    to: node.id,
    color: '#409eff'
  })
  
  connectionStart.value = null
  ElMessage.success('连接已创建')
}

const getConnectionPath = (conn) => {
  const fromNode = workflowNodes.value.find(n => n.id === conn.from)
  const toNode = workflowNodes.value.find(n => n.id === conn.to)
  
  if (!fromNode || !toNode) return ''
  
  const x1 = fromNode.x
  const y1 = fromNode.y
  const x2 = toNode.x
  const y2 = toNode.y
  
  // 贝塞尔曲线
  const dx = x2 - x1
  const dy = y2 - y1
  const cx1 = x1 + dx / 3
  const cy1 = y1
  const cx2 = x2 - dx / 3
  const cy2 = y2
  
  return `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`
}

const getArrowPoints = (conn) => {
  const toNode = workflowNodes.value.find(n => n.id === conn.to)
  if (!toNode) return ''
  
  const x = toNode.x
  const y = toNode.y - 90
  
  return `${x},${y} ${x-15},${y-24} ${x+15},${y-24}`
}

// ==================== 画布控制 ====================

const zoomIn = () => {
  if (canvasScale.value < 2) {
    canvasScale.value += 0.1
  }
}

const zoomOut = () => {
  if (canvasScale.value > 0.5) {
    canvasScale.value -= 0.1
  }
}

const resetZoom = () => {
  canvasScale.value = 1
  panOffset.value = { x: 0, y: 0 }
}

const startPan = (event) => {
  if (event.button === 1 || event.ctrlKey) { // 鼠标中键或Ctrl+左键
    isPanning.value = true
    panStart.value = { x: event.clientX, y: event.clientY }
  }
}

const doPan = (event) => {
  if (!isPanning.value) return
  
  const dx = (event.clientX - panStart.value.x) / canvasScale.value
  const dy = (event.clientY - panStart.value.y) / canvasScale.value
  
  panOffset.value.x -= dx
  panOffset.value.y -= dy
  
  panStart.value = { x: event.clientX, y: event.clientY }
}

const endPan = () => {
  isPanning.value = false
}

// ==================== 数据持久化 ====================

const saveWorkflow = () => {
  const workflowData = {
    department: selectedDepartment.value,
    nodes: workflowNodes.value,
    connections: connections.value,
    documents: generatedDocs.value,
    timestamp: new Date().toISOString()
  }
  
  localStorage.setItem(`workflow_${selectedDepartment.value}`, JSON.stringify(workflowData))
  ElMessage.success('工作流已保存')
}

const loadWorkflow = () => {
  const saved = localStorage.getItem(`workflow_${selectedDepartment.value}`)
  if (saved) {
    try {
      const data = JSON.parse(saved)
      workflowNodes.value = data.nodes || []
      connections.value = data.connections || []
      generatedDocs.value = data.documents || []
    } catch (e) {
      console.error('加载工作流失败', e)
    }
  }
}

const exportWorkflow = () => {
  const workflowData = {
    department: currentDepartmentName.value,
    nodes: workflowNodes.value,
    connections: connections.value,
    documents: generatedDocs.value,
    stats: {
      totalNodes: workflowNodes.value.length,
      aiNodes: aiNodesCount.value,
      totalDuration: totalDuration.value
    },
    exportTime: new Date().toISOString()
  }
  
  const blob = new Blob([JSON.stringify(workflowData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `工作流_${currentDepartmentName.value}_${new Date().getTime()}.json`
  a.click()
  URL.revokeObjectURL(url)
  
  ElMessage.success('工作流已导出')
}

// ==================== 文档查看 ====================

const viewDocument = (doc) => {
  currentDoc.value = doc
  docViewVisible.value = true
}

const downloadDocument = () => {
  const content = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${currentDoc.value.title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
        h2 { color: #333; border-bottom: 2px solid #409eff; padding-bottom: 10px; }
        h3 { color: #555; margin-top: 20px; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background-color: #409eff; color: white; }
        ul, ol { margin: 10px 0; padding-left: 30px; }
        li { margin: 5px 0; }
      </style>
    </head>
    <body>
      ${currentDoc.value.content}
    </body>
    </html>
  `
  
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${currentDoc.value.title}.html`
  a.click()
  URL.revokeObjectURL(url)
  
  ElMessage.success('文档已下载')
}

// ==================== 其他方法 ====================

const goBack = () => {
  router.push('/')
}

const onDepartmentChange = () => {
  loadWorkflow()
  ElMessage.success(`已切换到${currentDepartmentName.value}`)
}

// ==================== 生命周期 ====================

onMounted(() => {
  loadWorkflow()
})
</script>

<style scoped lang="scss">
.ai-workflow-agent {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.agent-header {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  margin-bottom: 20px;

  .header-title {
    font-size: 24px;
    font-weight: bold;
    background: linear-gradient(45deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.workflow-main {
  display: flex;
  gap: 20px;
  height: calc(100vh - 120px);
  min-height: 800px;
}

.ai-panel {
  width: 280px;
  flex-shrink: 0;

  .ai-card {
    height: 100%;
    overflow-y: auto;
  }

  .panel-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: bold;
    font-size: 16px;
  }

  .ai-input-section,
  .template-section,
  .department-section,
  .stats-section {
    margin-bottom: 20px;

    h4 {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
      font-size: 14px;
      color: #333;
    }
  }

  .template-card {
    display: flex;
    gap: 12px;
    padding: 12px;
    margin-bottom: 10px;
    background: #f5f7fa;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: #e6f7ff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .template-icon {
      font-size: 32px;
    }

    .template-info {
      flex: 1;

      .template-name {
        font-weight: bold;
        margin-bottom: 4px;
      }

      .template-desc {
        font-size: 12px;
        color: #666;
        margin-bottom: 6px;
      }
    }
  }
}

.canvas-area {
  flex: 1;

  .canvas-card {
    height: 100%;
  }

  .canvas-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;

    .canvas-tools {
      display: flex;
      align-items: center;
    }
  }

  .canvas-container {
    height: calc(100% - 60px);
    background: #f5f7fa;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
  }

  .workflow-canvas {
    width: 100%;
    height: 100%;
    cursor: grab;

    &:active {
      cursor: grabbing;
    }
  }

  .workflow-node {
    cursor: move;
    transition: transform 0.2s;

    &:hover {
      transform: scale(1.05);
    }

    &.selected {
      filter: drop-shadow(0 0 10px #409eff);
    }

    &.ai-node {
      filter: drop-shadow(0 0 8px #67c23a);
    }

    .connector {
      opacity: 0;
      transition: opacity 0.3s;
    }

    &:hover .connector {
      opacity: 1;
    }
  }

  .ai-connection {
    stroke-dasharray: 5, 5;
    animation: dash 0.5s linear infinite;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: -10;
    }
  }

  .ai-badge {
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.6;
    }
  }
}

.properties-panel {
  width: 300px;
  flex-shrink: 0;

  .properties-card {
    height: 100%;
    overflow-y: auto;
  }

  .properties-content {
    :deep(.el-form-item) {
      margin-bottom: 15px;
    }
  }

  .doc-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px;
    margin-bottom: 8px;
    background: #f5f7fa;
    border-radius: 6px;
    transition: all 0.3s;

    &:hover {
      background: #e6f7ff;
    }
  }
}

.ai-dialog-content {
  padding: 10px 0;
}

.document-content {
  padding: 20px;
  background: white;

  :deep(h2) {
    color: #333;
    border-bottom: 2px solid #409eff;
    padding-bottom: 10px;
    margin-bottom: 20px;
  }

  :deep(h3) {
    color: #555;
    margin-top: 20px;
    margin-bottom: 10px;
  }

  :deep(table) {
    border-collapse: collapse;
    width: 100%;
    margin: 15px 0;

    th, td {
      border: 1px solid #ddd;
      padding: 10px;
      text-align: left;
    }

    th {
      background-color: #409eff;
      color: white;
    }
  }

  :deep(ul), :deep(ol) {
    margin: 10px 0;
    padding-left: 30px;

    li {
      margin: 5px 0;
    }
  }
}

// 响应式
@media (max-width: 1400px) {
  .ai-panel {
    width: 260px;
  }

  .properties-panel {
    width: 280px;
  }
}
</style>
