<template>
  <div class="n8n-workflow-editor">
    <!-- 顶部工具栏 - N8N风格 -->
    <div class="n8n-header">
      <div class="header-left">
        <el-button text @click="goBack" :icon="ArrowLeft">返回</el-button>
        <el-divider direction="vertical" />
        <el-input 
          v-model="workflowName" 
          class="workflow-name"
          placeholder="未命名工作流">
        </el-input>
        <el-tag size="small" :type="workflowStatus === 'active' ? 'success' : 'info'">
          {{ workflowStatus === 'active' ? '已激活' : '草稿' }}
        </el-tag>
      </div>
      
      <div class="header-center">
        <!-- 画布控制 -->
        <el-button-group>
          <el-button :icon="ZoomOut" @click="zoomOut" size="small">{{ Math.round(canvasZoom * 100) }}%</el-button>
          <el-button :icon="ZoomIn" @click="zoomIn" size="small"></el-button>
          <el-button @click="resetZoom" size="small">重置</el-button>
        </el-button-group>
        <el-divider direction="vertical" />
        <el-button-group>
          <el-button :icon="Back" @click="undo" :disabled="!canUndo" size="small"></el-button>
          <el-button :icon="Right" @click="redo" :disabled="!canRedo" size="small"></el-button>
        </el-button-group>
      </div>
      
      <div class="header-right">
        <el-button @click="testWorkflow" :icon="VideoPlay">测试工作流</el-button>
        <el-button 
          type="primary" 
          @click="saveWorkflow" 
          :loading="saving"
          :icon="Check">
          {{ unsavedChanges > 0 ? `保存 (${unsavedChanges})` : '已保存' }}
        </el-button>
        <el-dropdown>
          <el-button :icon="More"></el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :icon="Share">分享</el-dropdown-item>
              <el-dropdown-item :icon="Download">导出</el-dropdown-item>
              <el-dropdown-item :icon="Setting">设置</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 主工作区 -->
    <div class="n8n-main">
      <!-- 左侧节点库 - N8N风格 -->
      <div class="n8n-sidebar" :class="{ collapsed: sidebarCollapsed }">
        <div class="sidebar-toggle" @click="sidebarCollapsed = !sidebarCollapsed">
          <el-icon><DArrowRight v-if="sidebarCollapsed" /><DArrowLeft v-else /></el-icon>
        </div>

        <div v-show="!sidebarCollapsed" class="sidebar-content">
          <!-- 搜索 -->
          <div class="sidebar-search">
            <el-input
              v-model="searchText"
              placeholder="搜索节点或触发器..."
              :prefix-icon="Search"
              clearable>
            </el-input>
          </div>

          <!-- 标签页切换 -->
          <el-tabs v-model="activeTab" class="sidebar-tabs">
            <el-tab-pane label="节点" name="nodes">
              <!-- 节点分类 -->
              <div class="node-categories">
                <!-- 触发器 -->
                <div class="category-section">
                  <div class="category-header">
                    <el-icon color="#ff6d5a"><Lightning /></el-icon>
                    <span>触发器</span>
                  </div>
                  <div class="node-grid">
                    <div
                      v-for="node in getNodesByCategory('trigger')"
                      :key="node.id"
                      class="node-card"
                      draggable="true"
                      @dragstart="onNodeDragStart($event, node)"
                      @click="quickAddNode(node)">
                      <div class="node-card-icon" :style="{ backgroundColor: node.color }">
                        {{ node.icon }}
                      </div>
                      <div class="node-card-content">
                        <div class="node-card-name">{{ node.name }}</div>
                        <div class="node-card-desc">{{ node.description }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 核心节点 -->
                <div class="category-section">
                  <div class="category-header">
                    <el-icon color="#7e57c2"><Box /></el-icon>
                    <span>核心</span>
                  </div>
                  <div class="node-grid">
                    <div
                      v-for="node in getNodesByCategory('core')"
                      :key="node.id"
                      class="node-card"
                      draggable="true"
                      @dragstart="onNodeDragStart($event, node)"
                      @click="quickAddNode(node)">
                      <div class="node-card-icon" :style="{ backgroundColor: node.color }">
                        {{ node.icon }}
                      </div>
                      <div class="node-card-content">
                        <div class="node-card-name">{{ node.name }}</div>
                        <div class="node-card-desc">{{ node.description }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- AI节点 -->
                <div class="category-section">
                  <div class="category-header">
                    <el-icon color="#9c27b0"><MagicStick /></el-icon>
                    <span>AI 智能</span>
                  </div>
                  <div class="node-grid">
                    <div
                      v-for="node in getNodesByCategory('ai')"
                      :key="node.id"
                      class="node-card"
                      draggable="true"
                      @dragstart="onNodeDragStart($event, node)"
                      @click="quickAddNode(node)">
                      <div class="node-card-icon" :style="{ backgroundColor: node.color }">
                        {{ node.icon }}
                      </div>
                      <div class="node-card-content">
                        <div class="node-card-name">{{ node.name }}</div>
                        <div class="node-card-desc">{{ node.description }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 数据操作 -->
                <div class="category-section">
                  <div class="category-header">
                    <el-icon color="#00bcd4"><DataAnalysis /></el-icon>
                    <span>数据</span>
                  </div>
                  <div class="node-grid">
                    <div
                      v-for="node in getNodesByCategory('data')"
                      :key="node.id"
                      class="node-card"
                      draggable="true"
                      @dragstart="onNodeDragStart($event, node)"
                      @click="quickAddNode(node)">
                      <div class="node-card-icon" :style="{ backgroundColor: node.color }">
                        {{ node.icon }}
                      </div>
                      <div class="node-card-content">
                        <div class="node-card-name">{{ node.name }}</div>
                        <div class="node-card-desc">{{ node.description }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 集成 -->
                <div class="category-section">
                  <div class="category-header">
                    <el-icon color="#4caf50"><Connection /></el-icon>
                    <span>集成</span>
                  </div>
                  <div class="node-grid">
                    <div
                      v-for="node in getNodesByCategory('integration')"
                      :key="node.id"
                      class="node-card"
                      draggable="true"
                      @dragstart="onNodeDragStart($event, node)"
                      @click="quickAddNode(node)">
                      <div class="node-card-icon" :style="{ backgroundColor: node.color }">
                        {{ node.icon }}
                      </div>
                      <div class="node-card-content">
                        <div class="node-card-name">{{ node.name }}</div>
                        <div class="node-card-desc">{{ node.description }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 控制流 -->
                <div class="category-section">
                  <div class="category-header">
                    <el-icon color="#ff9800"><Operation /></el-icon>
                    <span>控制流</span>
                  </div>
                  <div class="node-grid">
                    <div
                      v-for="node in getNodesByCategory('logic')"
                      :key="node.id"
                      class="node-card"
                      draggable="true"
                      @dragstart="onNodeDragStart($event, node)"
                      @click="quickAddNode(node)">
                      <div class="node-card-icon" :style="{ backgroundColor: node.color }">
                        {{ node.icon }}
                      </div>
                      <div class="node-card-content">
                        <div class="node-card-name">{{ node.name }}</div>
                        <div class="node-card-desc">{{ node.description }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 🆕 企业级节点 -->
                <div class="category-section">
                  <div class="category-header">
                    <el-icon color="#e91e63"><OfficeBuilding /></el-icon>
                    <span>企业级 🔥</span>
                  </div>
                  <div class="node-grid">
                    <div
                      v-for="node in getNodesByCategory('enterprise')"
                      :key="node.id"
                      class="node-card node-card-pro"
                      draggable="true"
                      @dragstart="onNodeDragStart($event, node)"
                      @click="quickAddNode(node)">
                      <div class="node-card-icon" :style="{ backgroundColor: node.color }">
                        {{ node.icon }}
                      </div>
                      <div class="node-card-content">
                        <div class="node-card-name">
                          {{ node.name }}
                          <el-tag v-if="node.sla" size="small" type="warning" effect="plain">SLA</el-tag>
                        </div>
                        <div class="node-card-desc">{{ node.description }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <el-tab-pane label="模板" name="templates">
              <div class="templates-list">
                <div
                  v-for="template in workflowTemplates"
                  :key="template.id"
                  class="template-card"
                  @click="useTemplate(template)">
                  <div class="template-icon">{{ template.icon }}</div>
                  <div class="template-name">{{ template.name }}</div>
                  <div class="template-desc">{{ template.description }}</div>
                  <el-tag size="small">{{ template.nodesCount }} 个节点</el-tag>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <!-- 中间画布 - N8N风格 -->
      <div class="n8n-canvas">
        <div 
          class="canvas-container"
          ref="canvasContainer"
          @drop="onCanvasDrop"
          @dragover.prevent
          @dblclick="onCanvasDoubleClick">
          
          <!-- 网格背景 -->
          <div class="canvas-grid"></div>

          <!-- SVG连接线层 -->
          <svg class="connections-layer">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="#999" />
              </marker>
            </defs>
            <path
              v-for="conn in connections"
              :key="conn.id"
              :d="getConnectionPath(conn)"
              :class="['connection-path', { 'connection-active': conn.id === selectedConnection }]"
              @click="selectConnection(conn)"
              marker-end="url(#arrowhead)" />
          </svg>

          <!-- 节点层 -->
          <div
            v-for="node in canvasNodes"
            :key="node.id"
            class="canvas-node"
            :class="[
              `node-${node.category}`,
              { 
                'node-selected': node.id === selectedNode,
                'node-error': node.hasError,
                'node-running': node.isRunning
              }
            ]"
            :style="{
              left: node.position.x + 'px',
              top: node.position.y + 'px'
            }"
            @click="selectNode(node)"
            @dblclick="openNodeSettings(node)"
            @mousedown="startDragNode($event, node)">
            
            <!-- 节点主体 -->
            <div class="node-header">
              <div class="node-icon" :style="{ backgroundColor: node.color }">
                {{ node.icon }}
              </div>
              <div class="node-title">
                <div class="node-name">{{ node.displayName || node.name }}</div>
                <div class="node-type">{{ node.type }}</div>
              </div>
              <div class="node-actions">
                <el-dropdown trigger="click" @command="handleNodeCommand($event, node)">
                  <el-icon><MoreFilled /></el-icon>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="execute" :icon="VideoPlay">执行</el-dropdown-item>
                      <el-dropdown-item command="duplicate" :icon="CopyDocument">复制</el-dropdown-item>
                      <el-dropdown-item command="disable" :icon="CloseBold">禁用</el-dropdown-item>
                      <el-dropdown-item command="delete" :icon="Delete" divided>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>

            <!-- 节点状态 -->
            <div v-if="node.executionData" class="node-execution">
              <el-tag 
                :type="node.executionData.success ? 'success' : 'danger'" 
                size="small"
                effect="plain">
                {{ node.executionData.success ? '成功' : '失败' }}
              </el-tag>
              <span class="execution-time">{{ node.executionData.duration }}ms</span>
            </div>

            <!-- 连接点 -->
            <div class="node-endpoints">
              <div 
                class="endpoint endpoint-input"
                @mousedown.stop="startConnection($event, node, 'input')">
              </div>
              <div 
                class="endpoint endpoint-output"
                @mousedown.stop="startConnection($event, node, 'output')">
              </div>
            </div>

            <!-- 添加按钮(N8N特色) -->
            <div 
              v-if="node.id === selectedNode"
              class="node-add-button"
              @click.stop="showNodeQuickAdd(node)">
              <el-icon><Plus /></el-icon>
            </div>
          </div>

          <!-- 空状态提示 -->
          <div v-if="canvasNodes.length === 0" class="canvas-empty">
            <el-empty description="从左侧拖拽节点开始构建工作流">
              <el-button type="primary" @click="showQuickStart">快速开始</el-button>
            </el-empty>
          </div>
        </div>

        <!-- 小地图 -->
        <div class="canvas-minimap">
          <div class="minimap-viewport"></div>
        </div>
      </div>

      <!-- 右侧属性面板 - N8N风格 -->
      <div class="n8n-panel" v-if="selectedNode">
        <div class="panel-header">
          <div class="panel-title">
            <div class="panel-icon" :style="{ backgroundColor: selectedNodeData?.color }">
              {{ selectedNodeData?.icon }}
            </div>
            <span>{{ selectedNodeData?.displayName || selectedNodeData?.name }}</span>
          </div>
          <el-button text @click="closePanel" :icon="Close"></el-button>
        </div>

        <div class="panel-content">
          <el-tabs v-model="activePanelTab" class="panel-tabs">
            <!-- 参数配置 -->
            <el-tab-pane label="参数" name="parameters">
              <el-scrollbar height="calc(100vh - 200px)">
                <div class="parameters-form">
                  <!-- 基础信息 -->
                  <div class="form-section">
                    <div class="section-title">基础信息</div>
                    <el-form label-position="top">
                      <el-form-item label="节点名称">
                        <el-input v-model="selectedNodeData.displayName" placeholder="输入节点名称" />
                      </el-form-item>
                      <el-form-item label="节点描述">
                        <el-input 
                          v-model="selectedNodeData.description" 
                          type="textarea"
                          :rows="3"
                          placeholder="描述此节点的用途..." />
                      </el-form-item>
                      <el-form-item label="执行条件">
                        <el-select v-model="selectedNodeData.executeMode" placeholder="选择执行条件">
                          <el-option label="总是执行" value="always"></el-option>
                          <el-option label="当上游成功时" value="onSuccess"></el-option>
                          <el-option label="当上游失败时" value="onError"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-form>
                  </div>

                  <!-- 节点特定参数 -->
                  <div class="form-section" v-if="selectedNodeData.category === 'ai'">
                    <div class="section-title">AI 参数</div>
                    <el-form label-position="top">
                      <el-form-item label="AI 模型">
                        <el-select v-model="selectedNodeData.aiModel" placeholder="选择模型">
                          <el-option label="GPT-4" value="gpt-4"></el-option>
                          <el-option label="GPT-3.5 Turbo" value="gpt-3.5-turbo"></el-option>
                          <el-option label="Claude 3" value="claude-3"></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="Prompt 模板">
                        <el-input 
                          v-model="selectedNodeData.promptTemplate" 
                          type="textarea"
                          :rows="6"
                          placeholder="输入提示词模板..."
                          show-word-limit />
                        <div class="field-helper">
                          <el-button text size="small" :icon="MagicStick">AI 生成模板</el-button>
                          <el-button text size="small" :icon="DocumentCopy">使用变量</el-button>
                        </div>
                      </el-form-item>
                      <el-form-item label="温度">
                        <el-slider v-model="selectedNodeData.temperature" :min="0" :max="1" :step="0.1" show-input />
                      </el-form-item>
                      <el-form-item label="最大Token数">
                        <el-input-number v-model="selectedNodeData.maxTokens" :min="1" :max="4096" />
                      </el-form-item>
                    </el-form>
                  </div>

                  <!-- 数据映射 -->
                  <div class="form-section" v-if="selectedNodeData.category === 'integration'">
                    <div class="section-title">数据映射</div>
                    <div class="field-mapping">
                      <div
                        v-for="(field, index) in selectedNodeData.fieldMapping"
                        :key="index"
                        class="mapping-row">
                        <el-input v-model="field.source" placeholder="源字段" size="small" />
                        <el-icon><Right /></el-icon>
                        <el-input v-model="field.target" placeholder="目标字段" size="small" />
                        <el-button text :icon="Delete" @click="removeMapping(index)"></el-button>
                      </div>
                      <el-button text :icon="Plus" @click="addMapping">添加映射</el-button>
                    </div>
                  </div>

                  <!-- 条件设置 -->
                  <div class="form-section" v-if="selectedNodeData.category === 'logic'">
                    <div class="section-title">条件规则</div>
                    <div class="conditions-builder">
                      <div
                        v-for="(condition, index) in selectedNodeData.conditions"
                        :key="index"
                        class="condition-row">
                        <el-select v-model="condition.field" placeholder="字段" size="small">
                          <el-option label="状态" value="status"></el-option>
                          <el-option label="优先级" value="priority"></el-option>
                          <el-option label="金额" value="amount"></el-option>
                        </el-select>
                        <el-select v-model="condition.operator" placeholder="操作符" size="small">
                          <el-option label="等于" value="equals"></el-option>
                          <el-option label="不等于" value="notEquals"></el-option>
                          <el-option label="大于" value="greaterThan"></el-option>
                          <el-option label="小于" value="lessThan"></el-option>
                          <el-option label="包含" value="contains"></el-option>
                        </el-select>
                        <el-input v-model="condition.value" placeholder="值" size="small" />
                        <el-button text :icon="Delete" @click="removeCondition(index)"></el-button>
                      </div>
                      <el-button text :icon="Plus" @click="addCondition">添加条件</el-button>
                    </div>
                  </div>
                </div>
              </el-scrollbar>
            </el-tab-pane>

            <!-- 执行数据 -->
            <el-tab-pane label="执行" name="execution">
              <div class="execution-panel">
                <el-button type="primary" @click="executeNode" :loading="executing" block>
                  <el-icon><VideoPlay /></el-icon>
                  执行此节点
                </el-button>

                <div v-if="selectedNodeData.executionData" class="execution-result">
                  <div class="result-header">
                    <el-tag :type="selectedNodeData.executionData.success ? 'success' : 'danger'">
                      {{ selectedNodeData.executionData.success ? '执行成功' : '执行失败' }}
                    </el-tag>
                    <span class="result-time">{{ selectedNodeData.executionData.timestamp }}</span>
                  </div>

                  <el-divider />

                  <div class="result-section">
                    <div class="result-title">输入数据</div>
                    <el-input
                      type="textarea"
                      :rows="8"
                      :value="JSON.stringify(selectedNodeData.executionData.input, null, 2)"
                      readonly />
                  </div>

                  <div class="result-section">
                    <div class="result-title">输出数据</div>
                    <el-input
                      type="textarea"
                      :rows="8"
                      :value="JSON.stringify(selectedNodeData.executionData.output, null, 2)"
                      readonly />
                  </div>

                  <div class="result-stats">
                    <div class="stat-item">
                      <span class="stat-label">执行时长</span>
                      <span class="stat-value">{{ selectedNodeData.executionData.duration }}ms</span>
                    </div>
                    <div class="stat-item" v-if="selectedNodeData.category === 'ai'">
                      <span class="stat-label">Tokens</span>
                      <span class="stat-value">{{ selectedNodeData.executionData.tokens }}</span>
                    </div>
                  </div>
                </div>

                <el-empty v-else description="尚未执行" />
              </div>
            </el-tab-pane>

            <!-- 设置 -->
            <el-tab-pane label="设置" name="settings">
              <div class="settings-panel">
                <el-form label-position="top">
                  <el-form-item label="节点颜色">
                    <el-color-picker v-model="selectedNodeData.color" />
                  </el-form-item>
                  <el-form-item label="超时时间(秒)">
                    <el-input-number v-model="selectedNodeData.timeout" :min="0" :max="3600" />
                  </el-form-item>
                  <el-form-item label="重试次数">
                    <el-input-number v-model="selectedNodeData.retryCount" :min="0" :max="10" />
                  </el-form-item>
                  <el-form-item label="错误处理">
                    <el-select v-model="selectedNodeData.errorMode">
                      <el-option label="停止工作流" value="stop"></el-option>
                      <el-option label="继续执行" value="continue"></el-option>
                      <el-option label="执行备选分支" value="fallback"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="备注">
                    <el-input 
                      v-model="selectedNodeData.notes" 
                      type="textarea"
                      :rows="4"
                      placeholder="添加备注..." />
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>

            <!-- 🆕 Tab 4: 执行责任 -->
            <el-tab-pane label="执行责任" name="responsibility">
              <div class="responsibility-panel">
                <el-form label-position="top">
                  <el-form-item label="负责角色">
                    <el-select v-model="selectedNodeData.responsibleRole" placeholder="选择角色" multiple>
                      <el-option label="质量工程师" value="qe"></el-option>
                      <el-option label="设备工程师" value="ee"></el-option>
                      <el-option label="生产经理" value="pm"></el-option>
                      <el-option label="采购员" value="buyer"></el-option>
                      <el-option label="审批人" value="approver"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="负责人">
                    <el-input v-model="selectedNodeData.responsiblePerson" placeholder="输入姓名" />
                  </el-form-item>
                  <el-form-item label="联系方式">
                    <el-input v-model="selectedNodeData.contact" placeholder="邮箱或电话" />
                  </el-form-item>
                  <el-form-item label="升级路径">
                    <div class="escalation-path">
                      <el-tag v-for="(person, idx) in (selectedNodeData.escalationPath || [])" :key="idx" closable @close="removeEscalation(idx)">
                        {{ person }}
                      </el-tag>
                      <el-input
                        v-model="newEscalation"
                        size="small"
                        placeholder="添加升级人"
                        @keyup.enter="addEscalation"
                        style="width: 150px" />
                    </div>
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>

            <!-- 🆕 Tab 5: SLA管理 -->
            <el-tab-pane label="SLA管理" name="sla">
              <div class="sla-panel">
                <el-switch v-model="selectedNodeData.slaEnabled" active-text="启用SLA" />
                <el-divider />
                <el-form label-position="top" v-if="selectedNodeData.slaEnabled">
                  <el-form-item label="SLA目标时间">
                    <el-input-number v-model="selectedNodeData.slaTarget" :min="1" :max="168" />
                    <el-select v-model="selectedNodeData.slaUnit" style="width: 100px; margin-left: 10px">
                      <el-option label="小时" value="hours"></el-option>
                      <el-option label="天" value="days"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="优先级">
                    <el-select v-model="selectedNodeData.slaPriority">
                      <el-option label="🔴 紧急" value="urgent"></el-option>
                      <el-option label="🟠 高" value="high"></el-option>
                      <el-option label="🟡 中" value="medium"></el-option>
                      <el-option label="🟢 低" value="low"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="预警阈值(%)">
                    <el-slider v-model="selectedNodeData.slaWarningThreshold" :min="50" :max="100" :step="10" show-stops />
                  </el-form-item>
                  <el-form-item label="超时动作">
                    <el-checkbox-group v-model="selectedNodeData.slaTimeoutActions">
                      <el-checkbox label="notify">发送通知</el-checkbox>
                      <el-checkbox label="escalate">升级处理</el-checkbox>
                      <el-checkbox label="log">记录日志</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-form>
                <el-empty v-else description="SLA未启用" :image-size="100" />
              </div>
            </el-tab-pane>

            <!-- 🆕 Tab 6: 权限设置 -->
            <el-tab-pane label="权限" name="permissions">
              <div class="permissions-panel">
                <el-form label-position="top">
                  <el-form-item label="可执行角色">
                    <el-checkbox-group v-model="selectedNodeData.permExecute">
                      <el-checkbox label="admin">管理员</el-checkbox>
                      <el-checkbox label="approver">审批人</el-checkbox>
                      <el-checkbox label="operator">操作员</el-checkbox>
                      <el-checkbox label="viewer">查看者</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item label="可查看角色">
                    <el-checkbox-group v-model="selectedNodeData.permView">
                      <el-checkbox label="admin">管理员</el-checkbox>
                      <el-checkbox label="approver">审批人</el-checkbox>
                      <el-checkbox label="operator">操作员</el-checkbox>
                      <el-checkbox label="viewer">查看者</el-checkbox>
                      <el-checkbox label="all">所有人</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item label="数据脱敏">
                    <el-switch v-model="selectedNodeData.dataMasking" active-text="启用数据脱敏" />
                  </el-form-item>
                  <el-form-item label="脱敏字段" v-if="selectedNodeData.dataMasking">
                    <el-select v-model="selectedNodeData.maskFields" multiple placeholder="选择需要脱敏的字段">
                      <el-option label="手机号" value="phone"></el-option>
                      <el-option label="邮箱" value="email"></el-option>
                      <el-option label="身份证" value="idcard"></el-option>
                      <el-option label="金额" value="amount"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="审计日志">
                    <el-switch v-model="selectedNodeData.auditLog" active-text="记录审计日志" />
                  </el-form-item>
                </el-form>
              </div>
            </el-tab-pane>

            <!-- 🆕 Tab 7: 数据追踪 -->
            <el-tab-pane label="数据追踪" name="datatracking">
              <div class="tracking-panel">
                <div class="tracking-info">
                  <el-alert title="数据链路追踪" type="info" :closable="false">
                    追踪数据流转路径，支持三层变量：流程级/会话级/节点级
                  </el-alert>
                </div>
                <el-divider />
                <div class="tracking-variables">
                  <div class="variable-section">
                    <div class="section-title">🌐 流程级变量</div>
                    <el-tag v-for="(value, key) in selectedNodeData.flowVars" :key="key">
                      {{ key }}: {{ value }}
                    </el-tag>
                  </div>
                  <div class="variable-section">
                    <div class="section-title">💬 会话级变量</div>
                    <el-tag v-for="(value, key) in selectedNodeData.sessionVars" :key="key" type="success">
                      {{ key }}: {{ value }}
                    </el-tag>
                  </div>
                  <div class="variable-section">
                    <div class="section-title">📦 节点级变量</div>
                    <div class="node-vars">
                      <el-input
                        v-model="newVarKey"
                        size="small"
                        placeholder="变量名"
                        style="width: 120px; margin-right: 10px" />
                      <el-input
                        v-model="newVarValue"
                        size="small"
                        placeholder="变量值"
                        style="width: 150px; margin-right: 10px" />
                      <el-button size="small" @click="addNodeVar">添加</el-button>
                    </div>
                    <el-tag
                      v-for="(value, key) in selectedNodeData.nodeVars"
                      :key="key"
                      type="warning"
                      closable
                      @close="deleteNodeVar(key)">
                      {{ key }}: {{ value }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <!-- 🆕 Tab 8: 调试模式 -->
            <el-tab-pane label="调试" name="debug">
              <div class="debug-panel">
                <el-switch v-model="selectedNodeData.debugMode" active-text="启用调试模式" />
                <el-divider />
                <div v-if="selectedNodeData.debugMode">
                  <el-form label-position="top">
                    <el-form-item label="断点">
                      <el-switch v-model="selectedNodeData.breakpoint" active-text="在此节点暂停" />
                    </el-form-item>
                    <el-form-item label="日志级别">
                      <el-radio-group v-model="selectedNodeData.logLevel">
                        <el-radio label="debug">调试</el-radio>
                        <el-radio label="info">信息</el-radio>
                        <el-radio label="warn">警告</el-radio>
                        <el-radio label="error">错误</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="输出变量">
                      <el-switch v-model="selectedNodeData.outputVars" active-text="输出所有变量到控制台" />
                    </el-form-item>
                  </el-form>
                  <div class="debug-logs">
                    <div class="logs-title">执行日志</div>
                    <div class="logs-content">
                      <div v-for="(log, idx) in (selectedNodeData.debugLogs || [])" :key="idx" class="log-item">
                        <el-tag :type="log.level" size="small">{{ log.level }}</el-tag>
                        <span>{{ log.message }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <el-empty v-else description="调试模式未启用" :image-size="100" />
              </div>
            </el-tab-pane>

            <!-- 🆕 Tab 9: AI智能 -->
            <el-tab-pane label="AI智能" name="ai">
              <div class="ai-panel">
                <el-button type="primary" :icon="MagicStick" @click="aiAutoConfig" block>
                  AI 自动配置此节点
                </el-button>
                <el-divider />
                <div class="ai-suggestions">
                  <div class="suggestion-title">💡 AI 建议</div>
                  <el-alert
                    v-for="(suggestion, idx) in (selectedNodeData.aiSuggestions || [])"
                    :key="idx"
                    :title="suggestion.title"
                    :type="suggestion.type"
                    :description="suggestion.desc"
                    :closable="false"
                    style="margin-bottom: 10px">
                    <template #default>
                      <el-button size="small" @click="applySuggestion(suggestion)">应用</el-button>
                    </template>
                  </el-alert>
                </div>
                <el-divider />
                <div class="ai-optimize">
                  <div class="optimize-title">🚀 智能优化</div>
                  <el-button size="small" @click="aiOptimizePrompt" :disabled="selectedNodeData.category !== 'ai'">
                    优化 Prompt
                  </el-button>
                  <el-button size="small" @click="aiDetectRisk">
                    风险检测
                  </el-button>
                  <el-button size="small" @click="aiRecommendNext">
                    推荐下个节点
                  </el-button>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>

        <div class="panel-footer">
          <el-button @click="closePanel">关闭</el-button>
          <el-button type="primary" @click="saveNodeSettings">保存</el-button>
        </div>
      </div>
    </div>

    <!-- AI助手浮窗 -->
    <transition name="ai-assistant">
      <div v-if="showAIAssistant" class="ai-assistant-float">
        <div class="assistant-header">
          <el-icon color="#9c27b0"><MagicStick /></el-icon>
          <span>AI 助手</span>
          <el-button text :icon="Close" @click="showAIAssistant = false"></el-button>
        </div>
        <div class="assistant-content">
          <el-input
            v-model="aiPrompt"
            type="textarea"
            :rows="3"
            placeholder="告诉我你想做什么..."
            @keyup.ctrl.enter="processAICommand" />
          <el-button type="primary" @click="processAICommand" :loading="aiProcessing">
            生成工作流
          </el-button>
        </div>
        <div class="assistant-suggestions">
          <div class="suggestion-title">快速开始:</div>
          <el-tag
            v-for="template in quickTemplates"
            :key="template.id"
            @click="useQuickTemplate(template)"
            class="suggestion-tag">
            {{ template.name }}
          </el-tag>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft, ZoomIn, ZoomOut, Back, Right, Check, More, Share, Download, Setting,
  Search, Lightning, Box, MagicStick, DataAnalysis, Connection, Operation,
  VideoPlay, Close, MoreFilled, CopyDocument, CloseBold, Delete, Plus,
  DocumentCopy, DArrowLeft, DArrowRight, Expand, Fold
} from '@element-plus/icons-vue'

const router = useRouter()

// ==================== 基础状态 ====================
const workflowName = ref('未命名工作流')
const workflowStatus = ref('draft') // draft | active
const saving = ref(false)
const unsavedChanges = ref(0)

// ==================== 画布状态 ====================
const canvasZoom = ref(1)
const canUndo = ref(false)
const canRedo = ref(false)
const canvasContainer = ref(null)

// ==================== 侧边栏状态 ====================
const sidebarCollapsed = ref(false)
const searchText = ref('')
const activeTab = ref('nodes')

// ==================== 节点和连接 ====================
const canvasNodes = ref([])
const connections = ref([])
const selectedNode = ref(null)
const selectedConnection = ref(null)

// ==================== 属性面板 ====================
const activePanelTab = ref('parameters')
const executing = ref(false)

// ==================== AI助手 ====================
const showAIAssistant = ref(false)
const aiPrompt = ref('')
const aiProcessing = ref(false)

// 🆕 ==================== 新增响应式变量 ====================
const newEscalation = ref('') // Tab4: 升级路径
const newVarKey = ref('') // Tab7: 数据追踪
const newVarValue = ref('')


// ==================== 节点库定义 (N8N风格) ====================
const nodeLibrary = ref([
  // 触发器
  {
    id: 'trigger_manual',
    name: '手动触发',
    type: 'Manual Trigger',
    description: '手动启动工作流',
    icon: '▶️',
    color: '#ff6d5a',
    category: 'trigger'
  },
  {
    id: 'trigger_schedule',
    name: '定时触发',
    type: 'Schedule Trigger',
    description: '按计划自动执行',
    icon: '⏰',
    color: '#ff6d5a',
    category: 'trigger'
  },
  {
    id: 'trigger_webhook',
    name: 'Webhook',
    type: 'Webhook Trigger',
    description: '通过HTTP接收数据',
    icon: '🔗',
    color: '#ff6d5a',
    category: 'trigger'
  },
  {
    id: 'trigger_email',
    name: '邮件触发',
    type: 'Email Trigger',
    description: '收到邮件时触发',
    icon: '📧',
    color: '#ff6d5a',
    category: 'trigger'
  },

  // 核心节点
  {
    id: 'core_set',
    name: '设置',
    type: 'Set',
    description: '设置或修改数据字段',
    icon: '✏️',
    color: '#7e57c2',
    category: 'core'
  },
  {
    id: 'core_code',
    name: '代码',
    type: 'Code',
    description: '执行JavaScript代码',
    icon: '💻',
    color: '#7e57c2',
    category: 'core'
  },
  {
    id: 'core_http',
    name: 'HTTP请求',
    type: 'HTTP Request',
    description: '发送HTTP请求',
    icon: '🌐',
    color: '#7e57c2',
    category: 'core'
  },
  {
    id: 'core_function',
    name: '函数',
    type: 'Function',
    description: '自定义函数处理',
    icon: 'ƒ',
    color: '#7e57c2',
    category: 'core'
  },

  // AI节点
  {
    id: 'ai_chat',
    name: 'AI对话',
    type: 'AI Chat',
    description: '与AI模型对话',
    icon: '🤖',
    color: '#9c27b0',
    category: 'ai'
  },
  {
    id: 'ai_analysis',
    name: 'AI分析',
    type: 'AI Analysis',
    description: 'AI智能分析',
    icon: '🧠',
    color: '#9c27b0',
    category: 'ai'
  },
  {
    id: 'ai_classify',
    name: 'AI分类',
    type: 'AI Classifier',
    description: '智能分类',
    icon: '🏷️',
    color: '#9c27b0',
    category: 'ai'
  },
  {
    id: 'ai_extract',
    name: 'AI提取',
    type: 'AI Extractor',
    description: '提取关键信息',
    icon: '🔍',
    color: '#9c27b0',
    category: 'ai'
  },
  {
    id: 'ai_generate',
    name: 'AI生成',
    type: 'AI Generator',
    description: '生成文本内容',
    icon: '✨',
    color: '#9c27b0',
    category: 'ai'
  },

  // 数据节点
  {
    id: 'data_filter',
    name: '过滤',
    type: 'Filter',
    description: '过滤数据项',
    icon: '🔽',
    color: '#00bcd4',
    category: 'data'
  },
  {
    id: 'data_merge',
    name: '合并',
    type: 'Merge',
    description: '合并多个数据源',
    icon: '⚡',
    color: '#00bcd4',
    category: 'data'
  },
  {
    id: 'data_split',
    name: '拆分',
    type: 'Split',
    description: '拆分数据',
    icon: '✂️',
    color: '#00bcd4',
    category: 'data'
  },
  {
    id: 'data_aggregate',
    name: '聚合',
    type: 'Aggregate',
    description: '聚合统计',
    icon: '📊',
    color: '#00bcd4',
    category: 'data'
  },

  // 集成节点
  {
    id: 'int_database',
    name: '数据库',
    type: 'Database',
    description: '查询数据库',
    icon: '🗄️',
    color: '#4caf50',
    category: 'integration'
  },
  {
    id: 'int_api',
    name: 'API调用',
    type: 'API Call',
    description: '调用外部API',
    icon: '🔌',
    color: '#4caf50',
    category: 'integration'
  },
  {
    id: 'int_email',
    name: '发送邮件',
    type: 'Send Email',
    description: '发送电子邮件',
    icon: '📮',
    color: '#4caf50',
    category: 'integration'
  },
  {
    id: 'int_notification',
    name: '通知',
    type: 'Notification',
    description: '发送通知',
    icon: '🔔',
    color: '#4caf50',
    category: 'integration'
  },

  // 控制流节点
  {
    id: 'logic_if',
    name: '条件判断',
    type: 'IF',
    description: '条件分支',
    icon: '🔀',
    color: '#ff9800',
    category: 'logic'
  },
  {
    id: 'logic_switch',
    name: '分支选择',
    type: 'Switch',
    description: '多路分支',
    icon: '🎚️',
    color: '#ff9800',
    category: 'logic'
  },
  {
    id: 'logic_loop',
    name: '循环',
    type: 'Loop',
    description: '循环执行',
    icon: '🔄',
    color: '#ff9800',
    category: 'logic'
  },
  {
    id: 'logic_wait',
    name: '等待',
    type: 'Wait',
    description: '延迟执行',
    icon: '⏸️',
    color: '#ff9800',
    category: 'logic'
  },

  // 🆕 企业级节点（新增5个）
  {
    id: 'enterprise_approval',
    name: '审批节点',
    type: 'Approval',
    description: '人工审批决策',
    icon: '✅',
    color: '#e91e63',
    category: 'enterprise',
    sla: {
      enabled: true,
      target: 4,
      unit: 'hours',
      priority: 'high'
    },
    permissions: {
      execute: ['admin', 'approver'],
      view: ['all']
    }
  },
  {
    id: 'enterprise_notification',
    name: '通知中心',
    type: 'Notification Center',
    description: '多渠道通知（邮件/短信/企微）',
    icon: '📣',
    color: '#e91e63',
    category: 'enterprise'
  },
  {
    id: 'enterprise_datalog',
    name: '数据日志',
    type: 'Data Logger',
    description: '记录数据变更审计',
    icon: '📝',
    color: '#e91e63',
    category: 'enterprise'
  },
  {
    id: 'enterprise_escalation',
    name: 'SLA升级',
    type: 'SLA Escalation',
    description: '超时自动升级',
    icon: '⚠️',
    color: '#e91e63',
    category: 'enterprise',
    sla: {
      enabled: true,
      escalationPath: ['manager', 'director', 'vp']
    }
  },
  {
    id: 'enterprise_parallel',
    name: '并行网关',
    type: 'Parallel Gateway',
    description: '多分支并行执行',
    icon: '⚡',
    color: '#e91e63',
    category: 'enterprise'
  }
])

// ==================== 工作流模板 ====================
const workflowTemplates = ref([
  {
    id: 'tpl_quality',
    name: '质量问题处理',
    description: '自动识别并处理质量问题',
    icon: '🔍',
    nodesCount: 8
  },
  {
    id: 'tpl_equipment',
    name: '设备故障诊断',
    description: 'AI驱动的设备故障诊断',
    icon: '⚙️',
    nodesCount: 6
  },
  {
    id: 'tpl_procurement',
    name: '采购审批流程',
    description: '智能采购审批',
    icon: '🛒',
    nodesCount: 10
  },
  {
    id: 'tpl_production',
    name: '生产异常处理',
    description: '生产异常自动处理',
    icon: '🏭',
    nodesCount: 7
  }
])

// ==================== 快速模板 ====================
const quickTemplates = ref([
  { id: 'qt1', name: '质量问题识别' },
  { id: 'qt2', name: '设备预警' },
  { id: 'qt3', name: '数据分析' },
  { id: 'qt4', name: '自动审批' }
])

// ==================== 计算属性 ====================
const selectedNodeData = computed(() => {
  return canvasNodes.value.find(n => n.id === selectedNode.value)
})

// ==================== 节点库方法 ====================
const getNodesByCategory = (category) => {
  return nodeLibrary.value.filter(n => 
    n.category === category && 
    (!searchText.value || n.name.toLowerCase().includes(searchText.value.toLowerCase()))
  )
}

// ==================== 拖拽相关 ====================
const onNodeDragStart = (event, node) => {
  event.dataTransfer.setData('nodeData', JSON.stringify(node))
  event.dataTransfer.effectAllowed = 'copy'
}

const onCanvasDrop = (event) => {
  event.preventDefault()
  const nodeData = JSON.parse(event.dataTransfer.getData('nodeData'))
  
  const rect = canvasContainer.value.getBoundingClientRect()
  const x = (event.clientX - rect.left) / canvasZoom.value
  const y = (event.clientY - rect.top) / canvasZoom.value

  addNodeAtPosition(nodeData, x, y)
}

const addNodeAtPosition = (nodeTemplate, x, y) => {
  const newNode = {
    ...nodeTemplate,
    id: `node_${Date.now()}`,
    displayName: nodeTemplate.name,
    position: { x, y },
    executeMode: 'always',
    timeout: 30,
    retryCount: 0,
    errorMode: 'stop',
    fieldMapping: [],
    conditions: [],
    executionData: null
  }

  canvasNodes.value.push(newNode)
  selectedNode.value = newNode.id
  unsavedChanges.value++
  
  ElMessage.success(`已添加节点: ${nodeTemplate.name}`)
}

const quickAddNode = (node) => {
  const centerX = 400
  const centerY = 200
  addNodeAtPosition(node, centerX, centerY)
}

// ==================== 节点操作 ====================
// 🔧 企业级修复：selectNode中禁止触发fitView/autoLayout
const selectNode = (node) => {
  // ⚠️ 关键修复：不再触发任何布局调整，避免循环
  selectedNode.value = node.id
  selectedConnection.value = null
  
  // ❌ 禁止自动fitView（常见抖动源）
  // ❌ 禁止autoLayout（常见抖动源）
  // ❌ 禁止自动zoom（常见抖动源）
}

const closePanel = () => {
  selectedNode.value = null
}

const openNodeSettings = (node) => {
  selectedNode.value = node.id
  activePanelTab.value = 'parameters'
}

const handleNodeCommand = (command, node) => {
  switch (command) {
    case 'execute':
      executeNode(node)
      break
    case 'duplicate':
      duplicateNode(node)
      break
    case 'disable':
      node.disabled = !node.disabled
      break
    case 'delete':
      deleteNode(node)
      break
  }
}

const executeNode = () => {
  executing.value = true
  
  setTimeout(() => {
    const node = canvasNodes.value.find(n => n.id === selectedNode.value)
    if (node) {
      node.executionData = {
        success: true,
        timestamp: new Date().toLocaleString(),
        duration: Math.floor(Math.random() * 1000) + 100,
        tokens: node.category === 'ai' ? Math.floor(Math.random() * 500) + 100 : null,
        input: { example: 'input data' },
        output: { result: 'success', data: { processed: true } }
      }
    }
    executing.value = false
    ElMessage.success('节点执行成功')
  }, 1500)
}

const duplicateNode = (node) => {
  const newNode = {
    ...JSON.parse(JSON.stringify(node)),
    id: `node_${Date.now()}`,
    position: {
      x: node.position.x + 50,
      y: node.position.y + 50
    }
  }
  canvasNodes.value.push(newNode)
  unsavedChanges.value++
}

const deleteNode = (node) => {
  ElMessageBox.confirm('确定删除此节点吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    canvasNodes.value = canvasNodes.value.filter(n => n.id !== node.id)
    connections.value = connections.value.filter(c => 
      c.sourceId !== node.id && c.targetId !== node.id
    )
    if (selectedNode.value === node.id) {
      selectedNode.value = null
    }
    unsavedChanges.value++
    ElMessage.success('已删除节点')
  }).catch(() => {})
}

const saveNodeSettings = () => {
  unsavedChanges.value++
  ElMessage.success('节点设置已保存')
}

// ==================== 字段映射/条件 ====================
const addMapping = () => {
  const node = canvasNodes.value.find(n => n.id === selectedNode.value)
  if (node && !node.fieldMapping) {
    node.fieldMapping = []
  }
  node.fieldMapping.push({ source: '', target: '' })
}

const removeMapping = (index) => {
  const node = canvasNodes.value.find(n => n.id === selectedNode.value)
  node.fieldMapping.splice(index, 1)
}

const addCondition = () => {
  const node = canvasNodes.value.find(n => n.id === selectedNode.value)
  if (node && !node.conditions) {
    node.conditions = []
  }
  node.conditions.push({ field: '', operator: 'equals', value: '' })
}

const removeCondition = (index) => {
  const node = canvasNodes.value.find(n => n.id === selectedNode.value)
  node.conditions.splice(index, 1)
}

// ==================== 画布控制 ====================
const zoomIn = () => {
  canvasZoom.value = Math.min(canvasZoom.value + 0.1, 2)
}

const zoomOut = () => {
  canvasZoom.value = Math.max(canvasZoom.value - 0.1, 0.5)
}

const resetZoom = () => {
  canvasZoom.value = 1
}

const undo = () => {
  ElMessage.info('撤销功能')
}

const redo = () => {
  ElMessage.info('重做功能')
}

const onCanvasDoubleClick = (event) => {
  if (event.target.classList.contains('canvas-container')) {
    showAIAssistant.value = true
  }
}

// ==================== 连接线 ====================
const getConnectionPath = (conn) => {
  // 简化的贝塞尔曲线路径
  return `M 100 100 C 200 100, 200 200, 300 200`
}

const selectConnection = (conn) => {
  selectedConnection.value = conn.id
  selectedNode.value = null
}

const startConnection = (event, node, type) => {
  // 实现连接线拖拽逻辑
  ElMessage.info(`开始连接: ${type}`)
}

// 🔧 终极修复：完全非响应式拖拽系统（直接操作DOM，避免Vue响应式触发重排）
const isDragging = ref(false)
const dragStartPos = { x: 0, y: 0 } // 普通对象，非响应式
const dragNodeStartPos = { x: 0, y: 0 } // 普通对象，非响应式
let currentDragNode = null // 普通变量，非响应式
let dragMoveThreshold = 0
let currentDragElement = null // 当前拖拽的DOM元素

const startDragNode = (event, node) => {
  // 只响应左键
  if (event.button !== 0) return
  
  // 阻止默认行为和事件冒泡
  event.preventDefault()
  event.stopPropagation()
  
  // 🔧 关键修复1：记录当前拖拽的DOM元素
  currentDragElement = event.currentTarget
  
  // 记录初始状态（普通对象，非响应式）
  dragStartPos.x = event.clientX
  dragStartPos.y = event.clientY
  dragNodeStartPos.x = node.position.x
  dragNodeStartPos.y = node.position.y
  dragMoveThreshold = 0
  currentDragNode = node
  
  const onMouseMove = (e) => {
    // 计算移动距离
    const moveX = Math.abs(e.clientX - dragStartPos.x)
    const moveY = Math.abs(e.clientY - dragStartPos.y)
    dragMoveThreshold = Math.max(moveX, moveY)
    
    // 只有移动超过5px才认为是拖拽
    if (dragMoveThreshold < 5) return
    
    // 开始拖拽（仅设置状态一次）
    if (!isDragging.value) {
      isDragging.value = true
      selectedNode.value = node.id
      // 🔧 关键修复2：添加拖拽类名，用CSS优化渲染
      if (currentDragElement) {
        currentDragElement.classList.add('is-dragging')
      }
    }
    
    if (!isDragging.value || !currentDragNode) return
    
    // 🔧 关键修复3：直接操作DOM的transform，完全绕过Vue响应式
    const deltaX = e.clientX - dragStartPos.x
    const deltaY = e.clientY - dragStartPos.y
    const newX = dragNodeStartPos.x + deltaX
    const newY = dragNodeStartPos.y + deltaY
    
    if (currentDragElement) {
      // 使用transform代替left/top，性能更好且不触发layout
      currentDragElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`
    }
  }
  
  const onMouseUp = () => {
    // 🔧 关键修复4：拖拽结束后才更新Vue数据（批量更新）
    if (isDragging.value && currentDragNode) {
      const deltaX = dragStartPos.x ? (event.clientX || 0) - dragStartPos.x : 0
      const deltaY = dragStartPos.y ? (event.clientY || 0) - dragStartPos.y : 0
      
      // 找到目标节点并更新position（此时才触发Vue响应式）
      const targetNode = canvasNodes.value.find(n => n.id === currentDragNode.id)
      if (targetNode) {
        targetNode.position.x = dragNodeStartPos.x + deltaX
        targetNode.position.y = dragNodeStartPos.y + deltaY
      }
      
      // 清除transform，让Vue的:style接管
      if (currentDragElement) {
        currentDragElement.style.transform = ''
        currentDragElement.classList.remove('is-dragging')
      }
      
      unsavedChanges.value++
    }
    
    // 清理拖拽状态
    isDragging.value = false
    currentDragNode = null
    currentDragElement = null
    dragMoveThreshold = 0
    dragStartPos.x = 0
    dragStartPos.y = 0
    dragNodeStartPos.x = 0
    dragNodeStartPos.y = 0
    
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }
  
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

// ==================== 工作流操作 ====================
const saveWorkflow = () => {
  saving.value = true
  setTimeout(() => {
    saving.value = false
    unsavedChanges.value = 0
    ElMessage.success('工作流已保存')
  }, 1000)
}

const testWorkflow = () => {
  ElMessage.info('开始测试工作流')
}

const publishWorkflow = () => {
  ElMessageBox.confirm('确定发布此工作流吗?', '发布确认', {
    confirmButtonText: '发布',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    workflowStatus.value = 'active'
    ElMessage.success('工作流已发布')
  }).catch(() => {})
}

// ==================== 模板操作 ====================
const useTemplate = (template) => {
  ElMessage.success(`应用模板: ${template.name}`)
}

const useQuickTemplate = (template) => {
  aiPrompt.value = template.name
  processAICommand()
}

// ==================== AI助手 ====================
const processAICommand = () => {
  aiProcessing.value = true
  setTimeout(() => {
    aiProcessing.value = false
    showAIAssistant.value = false
    ElMessage.success('AI已生成工作流')
  }, 2000)
}

const showQuickStart = () => {
  showAIAssistant.value = true
}

const showNodeQuickAdd = (node) => {
  ElMessage.info('快速添加下一节点')
}

// 🆕 ==================== 新增方法 ====================
// Tab 4: 执行责任 - 升级路径管理
const addEscalation = () => {
  if (!newEscalation.value) return
  if (!selectedNodeData.value.escalationPath) {
    selectedNodeData.value.escalationPath = []
  }
  selectedNodeData.value.escalationPath.push(newEscalation.value)
  newEscalation.value = ''
}

const removeEscalation = (index) => {
  selectedNodeData.value.escalationPath.splice(index, 1)
}

// Tab 7: 数据追踪 - 节点变量管理
const addNodeVar = () => {
  if (!newVarKey.value || !newVarValue.value) return
  if (!selectedNodeData.value.nodeVars) {
    selectedNodeData.value.nodeVars = {}
  }
  selectedNodeData.value.nodeVars[newVarKey.value] = newVarValue.value
  newVarKey.value = ''
  newVarValue.value = ''
  ElMessage.success('变量已添加')
}

const deleteNodeVar = (key) => {
  delete selectedNodeData.value.nodeVars[key]
  ElMessage.success('变量已删除')
}

// Tab 9: AI智能 - AI辅助功能
const aiAutoConfig = () => {
  ElMessage.info('AI正在分析节点配置...')
  setTimeout(() => {
    if (!selectedNodeData.value.aiSuggestions) {
      selectedNodeData.value.aiSuggestions = []
    }
    selectedNodeData.value.aiSuggestions = [
      {
        title: '优化建议',
        type: 'success',
        desc: '建议将超时时间设置为30秒，增加1次重试',
        config: { timeout: 30, retryCount: 1 }
      },
      {
        title: 'SLA提醒',
        type: 'warning',
        desc: '此节点建议启用SLA，目标时间4小时',
        config: { slaEnabled: true, slaTarget: 4, slaUnit: 'hours' }
      }
    ]
    ElMessage.success('AI分析完成')
  }, 1500)
}

const applySuggestion = (suggestion) => {
  Object.assign(selectedNodeData.value, suggestion.config)
  ElMessage.success('建议已应用')
}

const aiOptimizePrompt = () => {
  ElMessage.info('AI正在优化Prompt...')
  setTimeout(() => {
    ElMessage.success('Prompt已优化')
  }, 1000)
}

const aiDetectRisk = () => {
  ElMessage.warning('检测到2个潜在风险：\n1. 缺少错误处理\n2. 未设置超时时间')
}

const aiRecommendNext = () => {
  ElMessage.success('推荐下一个节点：AI分析 (根据当前上下文)')
}

// ==================== 其他 ====================
const goBack = () => {
  router.back()
}

onMounted(() => {
  // 初始化
})
</script>

<style scoped lang="scss">
.n8n-workflow-editor {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

// ==================== 顶部导航栏 ====================
.n8n-header {
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;

    .workflow-name {
      width: 300px;
      font-size: 16px;
      font-weight: 600;
      
      :deep(.el-input__wrapper) {
        border: none;
        box-shadow: none;
        background: transparent;
        
        &:hover, &.is-focus {
          background: #f5f5f5;
        }
      }
    }
  }

  .header-center {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .header-right {
    display: flex;
    gap: 8px;
  }
}

// ==================== 主工作区（企业级固定布局 - 防止resize循环）====================
.n8n-main {
  flex: 1;
  display: flex;
  overflow: hidden;
  /* 🔧 关键修复：使用固定高度，禁止子元素触发父容器resize */
  height: calc(100vh - 60px);
}

// ==================== 左侧节点库 ====================
.n8n-sidebar {
  width: 340px;
  background: #fff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: all 0.3s;

  &.collapsed {
    width: 0;
    overflow: hidden;
  }

  .sidebar-toggle {
    position: absolute;
    right: -12px;
    top: 50%;
    transform: translateY(-50%);
    width: 24px;
    height: 48px;
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 0 12px 12px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10;
    
    &:hover {
      background: #f5f5f5;
    }
  }

  .sidebar-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .sidebar-search {
    padding: 16px;
    border-bottom: 1px solid #e0e0e0;
  }

  .sidebar-tabs {
    flex: 1;
    overflow: hidden;

    :deep(.el-tabs__content) {
      height: calc(100% - 40px);
      overflow-y: auto;
    }
  }
}

// ==================== 节点分类 ====================
.node-categories {
  padding: 12px;
}

.category-section {
  margin-bottom: 24px;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-weight: 600;
  font-size: 14px;
  color: #333;
  margin-bottom: 12px;
}

.node-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.node-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: move;
  transition: all 0.2s;

  &:hover {
    border-color: #409eff;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
    transform: translateY(-1px);
  }

  .node-card-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }

  .node-card-content {
    flex: 1;
    min-width: 0;
  }

  .node-card-name {
    font-weight: 600;
    font-size: 13px;
    color: #333;
    margin-bottom: 2px;
  }

  .node-card-desc {
    font-size: 12px;
    color: #999;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

// ==================== 模板列表 ====================
.templates-list {
  padding: 16px;
  display: grid;
  gap: 12px;
}

.template-card {
  padding: 16px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #409eff;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
  }

  .template-icon {
    font-size: 32px;
    margin-bottom: 8px;
  }

  .template-name {
    font-weight: 600;
    margin-bottom: 4px;
  }

  .template-desc {
    font-size: 12px;
    color: #666;
    margin-bottom: 8px;
  }
}

// ==================== 画布区域（企业级固定宽度 - 防止宽度变化触发重排）====================
.n8n-canvas {
  /* 🔧 关键修复1：使用flex:1配合min-width:0，防止宽度计算循环 */
  flex: 1;
  min-width: 0;
  position: relative;
  overflow: hidden;
  background: #fafafa;
  /* 🔧 关键修复2：禁止子元素触发父容器resize */
  contain: layout style;
}

.canvas-container {
  width: 100%;
  height: 100%;
  position: relative;
  /* 🔧 完全移除transform相关属性，防止坐标系冲突 */
}

.canvas-grid {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(to right, #e0e0e0 1px, transparent 1px),
    linear-gradient(to bottom, #e0e0e0 1px, transparent 1px);
  background-size: 20px 20px;
  opacity: 0.3;
  pointer-events: none;
}

.connections-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.connection-path {
  fill: none;
  stroke: #999;
  stroke-width: 2;
  pointer-events: all;
  cursor: pointer;
  transition: all 0.2s;

  &:hover, &.connection-active {
    stroke: #409eff;
    stroke-width: 3;
  }
}

// ==================== 画布节点（放大50% - 360px，便于操作）====================
.canvas-node {
  position: absolute;
  width: 360px; /* 从240px放大到360px */
  background: #fff;
  border: 3px solid #e0e0e0; /* 边框也放大 */
  border-radius: 12px;
  box-shadow: 0 3px 12px rgba(0,0,0,0.08);
  cursor: move;
  transition: box-shadow 0.2s, border-color 0.2s;
  user-select: none;
  z-index: 100;
  
  /* 🔧 关键优化：使用will-change提示浏览器优化渲染 */
  will-change: transform;
  
  /* 🔧 拖拽时的特殊状态 */
  &.is-dragging {
    /* 拖拽时移除transition，使用GPU加速的transform */
    transition: none;
    z-index: 1000;
    box-shadow: 0 12px 36px rgba(0,0,0,0.2);
    /* 强制GPU渲染，避免CPU重排 */
    transform: translateZ(0);
  }

  &:hover {
    box-shadow: 0 6px 24px rgba(0,0,0,0.12);
  }

  &.node-selected {
    border-color: #409eff;
    box-shadow: 0 0 0 4px rgba(64, 158, 255, 0.2);
  }

  &.node-error {
    border-color: #f56c6c;
  }

  &.node-running {
    border-color: #67c23a;
    animation: pulse 1.5s ease-in-out infinite;
  }

  .node-header {
    display: flex;
    align-items: center;
    padding: 18px; /* 从12px放大到18px */
    gap: 15px; /* 从10px放大到15px */

    .node-icon {
      width: 54px; /* 从36px放大到54px */
      height: 54px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 27px; /* 从18px放大到27px */
      flex-shrink: 0;
    }

    .node-title {
      flex: 1;
      min-width: 0;

      .node-name {
        font-weight: 600;
        font-size: 21px; /* 从14px放大到21px */
        color: #333;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .node-type {
        font-size: 18px; /* 从12px放大到18px */
        color: #999;
        margin-top: 3px;
      }
    }

    .node-actions {
      cursor: pointer;
      color: #999;
      font-size: 18px; /* 从12px放大到18px */
      
      &:hover {
        color: #333;
      }
    }
  }

  .node-execution {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 18px; /* 从8px 12px放大到12px 18px */
    background: #f5f5f5;
    border-top: 2px solid #e0e0e0;
    font-size: 18px; /* 从12px放大到18px */
  }

  .node-endpoints {
    
    .endpoint {
      position: absolute;
      width: 18px; /* 从12px放大到18px */
      height: 18px;
      border-radius: 50%;
      background: #fff;
      border: 3px solid #999; /* 从2px放大到3px */
      cursor: crosshair;
      transition: all 0.2s;

      &:hover {
        border-color: #409eff;
        transform: scale(1.3);
      }

      &.endpoint-input {
        top: 50%;
        left: -9px; /* 从-6px调整到-9px */
        transform: translateY(-50%);
      }

      &.endpoint-output {
        top: 50%;
        right: -9px; /* 从-6px调整到-9px */
        transform: translateY(-50%);
      }
    }
  }

  .node-add-button {
    position: absolute;
    right: -60px; /* 从-40px调整到-60px */
    top: 50%;
    transform: translateY(-50%);
    width: 48px; /* 从32px放大到48px */
    height: 48px;
    background: #409eff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 24px; /* 从16px放大到24px */
    cursor: pointer;
    box-shadow: 0 3px 12px rgba(64, 158, 255, 0.3);
    transition: all 0.2s;

    &:hover {
      transform: translateY(-50%) scale(1.1);
    }
  }
}

// ==================== 空状态 ====================
.canvas-empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

// ==================== 小地图 ====================
.canvas-minimap {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 200px;
  height: 150px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

// ==================== 右侧属性面板（企业级固定宽度 - 防止展开/收缩触发画布resize）====================
.n8n-panel {
  /* 🔧 关键修复：固定宽度400px，不使用flex或百分比 */
  width: 400px;
  min-width: 400px;
  max-width: 400px;
  flex-shrink: 0;
  background: #fff;
  border-left: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;

  .panel-header {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    border-bottom: 1px solid #e0e0e0;

    .panel-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 600;

      .panel-icon {
        width: 32px;
        height: 32px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
      }
    }
  }

  .panel-content {
    flex: 1;
    overflow: hidden;
  }

  .panel-tabs {
    height: 100%;

    :deep(.el-tabs__content) {
      height: calc(100% - 40px);
    }
  }

  .panel-footer {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
    padding: 0 20px;
    border-top: 1px solid #e0e0e0;
  }
}

// ==================== 表单区域 ====================
.parameters-form, .execution-panel, .settings-panel {
  padding: 20px;
}

.form-section {
  margin-bottom: 24px;

  .section-title {
    font-weight: 600;
    font-size: 14px;
    color: #333;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e0e0e0;
  }
}

.field-helper {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.field-mapping, .conditions-builder {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mapping-row, .condition-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

// ==================== 执行结果 ====================
.execution-result {
  margin-top: 20px;

  .result-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .result-section {
    margin: 16px 0;

    .result-title {
      font-weight: 600;
      font-size: 13px;
      margin-bottom: 8px;
    }
  }

  .result-stats {
    display: flex;
    gap: 24px;
    margin-top: 16px;

    .stat-item {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .stat-label {
        font-size: 12px;
        color: #999;
      }

      .stat-value {
        font-size: 18px;
        font-weight: 600;
        color: #333;
      }
    }
  }
}

// ==================== AI助手 ====================
.ai-assistant-float {
  position: fixed;
  bottom: 80px;
  right: 80px;
  width: 400px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  z-index: 1000;

  .assistant-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 16px 20px;
    border-bottom: 1px solid #e0e0e0;
    font-weight: 600;
  }

  .assistant-content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .assistant-suggestions {
    padding: 0 20px 20px;

    .suggestion-title {
      font-size: 12px;
      color: #999;
      margin-bottom: 8px;
    }

    .suggestion-tag {
      margin-right: 8px;
      margin-bottom: 8px;
      cursor: pointer;
    }
  }
}

.ai-assistant-enter-active,
.ai-assistant-leave-active {
  transition: all 0.3s;
}

.ai-assistant-enter-from,
.ai-assistant-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

// ==================== 动画 ====================
@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(103, 194, 58, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(103, 194, 58, 0);
  }
}
</style>
