<template>
  <div class="workflow-editor-v4">
    <!-- 顶部导航栏 -->
    <div class="top-navbar">
      <div class="nav-left">
        <el-button @click="goBack" :icon="ArrowLeft" text>返回工作流列表</el-button>
        <div class="workflow-info">
          <el-input 
            v-model="workflowName" 
            class="workflow-name-input"
            placeholder="工作流名称">
          </el-input>
          <el-select v-model="workflowVersion" size="small" style="width: 120px; margin-left: 10px">
            <el-option label="v3.1 (当前)" value="v3.1"></el-option>
            <el-option label="v3.0" value="v3.0"></el-option>
            <el-option label="v2.5" value="v2.5"></el-option>
          </el-select>
        </div>
      </div>
      
      <div class="nav-right">
        <el-badge :value="unsavedChanges" :hidden="!unsavedChanges" type="warning">
          <el-button 
            :type="unsavedChanges ? 'primary' : 'default'"
            @click="saveWorkflow" 
            :icon="DocumentChecked">
            保存
          </el-button>
        </el-badge>
        <el-button type="primary" @click="publishWorkflow" :icon="Upload">发布</el-button>
        <el-button 
          type="success" 
          @click="aiAutoGenerate" 
          :icon="MagicStick"
          :loading="aiGenerating">
          AI 构建流程
        </el-button>
      </div>
    </div>

    <!-- 主工作区 -->
    <div class="main-workspace">
      <!-- 左侧节点库 -->
      <div class="left-sidebar" :class="{ collapsed: leftCollapsed }">
        <div class="sidebar-header">
          <span v-if="!leftCollapsed">节点库</span>
          <el-button 
            @click="leftCollapsed = !leftCollapsed" 
            :icon="leftCollapsed ? Expand : Fold"
            link>
          </el-button>
        </div>

        <div v-if="!leftCollapsed" class="sidebar-content">
          <!-- 搜索框 -->
          <el-input
            v-model="nodeSearchText"
            placeholder="搜索节点..."
            :prefix-icon="Search"
            clearable
            size="small">
          </el-input>

          <!-- 六大节点分类 -->
          <el-collapse v-model="activeCategories" class="node-categories">
            <!-- 1. 触发节点 -->
            <el-collapse-item name="trigger">
              <template #title>
                <div class="category-title">
                  <el-icon color="#409eff"><Lightning /></el-icon>
                  <span>触发 Trigger</span>
                  <el-tag size="small" type="info">{{ filteredNodesByCategory('trigger').length }}</el-tag>
                </div>
              </template>
              <div class="node-list">
                <div
                  v-for="node in filteredNodesByCategory('trigger')"
                  :key="node.id"
                  class="node-item"
                  draggable="true"
                  @dragstart="handleNodeDragStart($event, node)"
                  @click="addNodeToCanvas(node)">
                  <div class="node-icon">{{ node.icon }}</div>
                  <div class="node-info">
                    <div class="node-name">{{ node.name }}</div>
                    <div class="node-desc">{{ node.description }}</div>
                  </div>
                </div>
              </div>
            </el-collapse-item>

            <!-- 2. 操作节点 -->
            <el-collapse-item name="action">
              <template #title>
                <div class="category-title">
                  <el-icon color="#67c23a"><Tools /></el-icon>
                  <span>操作 Action</span>
                  <el-tag size="small" type="success">{{ filteredNodesByCategory('action').length }}</el-tag>
                </div>
              </template>
              <div class="node-list">
                <div
                  v-for="node in filteredNodesByCategory('action')"
                  :key="node.id"
                  class="node-item"
                  draggable="true"
                  @dragstart="handleNodeDragStart($event, node)"
                  @click="addNodeToCanvas(node)">
                  <div class="node-icon">{{ node.icon }}</div>
                  <div class="node-info">
                    <div class="node-name">{{ node.name }}</div>
                    <div class="node-desc">{{ node.description }}</div>
                  </div>
                </div>
              </div>
            </el-collapse-item>

            <!-- 3. AI智能节点 -->
            <el-collapse-item name="ai">
              <template #title>
                <div class="category-title">
                  <el-icon color="#e6a23c"><MagicStick /></el-icon>
                  <span>AI 智能</span>
                  <el-tag size="small" type="warning">{{ filteredNodesByCategory('ai').length }}</el-tag>
                </div>
              </template>
              <div class="node-list">
                <div
                  v-for="node in filteredNodesByCategory('ai')"
                  :key="node.id"
                  class="node-item ai-node"
                  draggable="true"
                  @dragstart="handleNodeDragStart($event, node)"
                  @click="addNodeToCanvas(node)">
                  <div class="node-icon">{{ node.icon }}</div>
                  <div class="node-info">
                    <div class="node-name">{{ node.name }}</div>
                    <div class="node-desc">{{ node.description }}</div>
                  </div>
                  <el-tag size="small" type="warning" effect="dark">AI</el-tag>
                </div>
              </div>
            </el-collapse-item>

            <!-- 4. 控制节点 -->
            <el-collapse-item name="logic">
              <template #title>
                <div class="category-title">
                  <el-icon color="#f56c6c"><Share /></el-icon>
                  <span>控制 Logic</span>
                  <el-tag size="small" type="danger">{{ filteredNodesByCategory('logic').length }}</el-tag>
                </div>
              </template>
              <div class="node-list">
                <div
                  v-for="node in filteredNodesByCategory('logic')"
                  :key="node.id"
                  class="node-item"
                  draggable="true"
                  @dragstart="handleNodeDragStart($event, node)"
                  @click="addNodeToCanvas(node)">
                  <div class="node-icon">{{ node.icon }}</div>
                  <div class="node-info">
                    <div class="node-name">{{ node.name }}</div>
                    <div class="node-desc">{{ node.description }}</div>
                  </div>
                </div>
              </div>
            </el-collapse-item>

            <!-- 5. 集成节点 -->
            <el-collapse-item name="integration">
              <template #title>
                <div class="category-title">
                  <el-icon color="#909399"><Connection /></el-icon>
                  <span>集成 Integration</span>
                  <el-tag size="small">{{ filteredNodesByCategory('integration').length }}</el-tag>
                </div>
              </template>
              <div class="node-list">
                <div
                  v-for="node in filteredNodesByCategory('integration')"
                  :key="node.id"
                  class="node-item"
                  draggable="true"
                  @dragstart="handleNodeDragStart($event, node)"
                  @click="addNodeToCanvas(node)">
                  <div class="node-icon">{{ node.icon }}</div>
                  <div class="node-info">
                    <div class="node-name">{{ node.name }}</div>
                    <div class="node-desc">{{ node.description }}</div>
                  </div>
                </div>
              </div>
            </el-collapse-item>

            <!-- 6. 输出节点 -->
            <el-collapse-item name="output">
              <template #title>
                <div class="category-title">
                  <el-icon color="#5470c6"><Finished /></el-icon>
                  <span>输出 Output</span>
                  <el-tag size="small" type="primary">{{ filteredNodesByCategory('output').length }}</el-tag>
                </div>
              </template>
              <div class="node-list">
                <div
                  v-for="node in filteredNodesByCategory('output')"
                  :key="node.id"
                  class="node-item"
                  draggable="true"
                  @dragstart="handleNodeDragStart($event, node)"
                  @click="addNodeToCanvas(node)">
                  <div class="node-icon">{{ node.icon }}</div>
                  <div class="node-info">
                    <div class="node-name">{{ node.name }}</div>
                    <div class="node-desc">{{ node.description }}</div>
                  </div>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>

      <!-- 中间画布 -->
      <div class="center-canvas">
        <div class="canvas-toolbar">
          <div class="toolbar-left">
            <span class="canvas-title">🎨 流程画布</span>
            <el-divider direction="vertical" />
            <el-button-group size="small">
              <el-button @click="undoAction" :disabled="!canUndo" :icon="RefreshLeft">撤销</el-button>
              <el-button @click="redoAction" :disabled="!canRedo" :icon="RefreshRight">重做</el-button>
            </el-button-group>
            <el-divider direction="vertical" />
            <el-button-group size="small">
              <el-button @click="zoomIn" :icon="ZoomIn">放大</el-button>
              <el-button @click="resetZoom">{{ Math.round(canvasZoom * 100) }}%</el-button>
              <el-button @click="zoomOut" :icon="ZoomOut">缩小</el-button>
            </el-button-group>
          </div>
          
          <div class="toolbar-right">
            <el-button-group size="small">
              <el-button @click="autoLayout" :icon="Grid">自动布局</el-button>
              <el-button @click="selectAll" :icon="Select">全选</el-button>
              <el-button @click="toggleGrid">
                <el-icon><Grid /></el-icon>
                网格{{ showGrid ? '(开)' : '(关)' }}
              </el-button>
            </el-button-group>
          </div>
        </div>

        <!-- SVG画布 -->
        <div 
          class="canvas-container"
          @drop="handleCanvasDrop"
          @dragover.prevent
          @mousedown="handleCanvasMouseDown"
          @mousemove="handleCanvasMouseMove"
          @mouseup="handleCanvasMouseUp"
          @contextmenu.prevent="handleCanvasContextMenu">
          
          <svg
            ref="svgCanvas"
            class="workflow-svg"
            :viewBox="`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`"
            @dblclick="handleCanvasDoubleClick">
            
            <!-- 网格背景 -->
            <defs>
              <pattern 
                id="grid" 
                width="20" 
                height="20" 
                patternUnits="userSpaceOnUse"
                v-if="showGrid">
                <path 
                  d="M 20 0 L 0 0 0 20" 
                  fill="none" 
                  stroke="#e0e0e0" 
                  stroke-width="0.5" />
              </pattern>
            </defs>
            <rect 
              v-if="showGrid"
              width="100%" 
              height="100%" 
              fill="url(#grid)" />

            <!-- 连接线层 -->
            <g class="connections-layer">
              <path
                v-for="(conn, index) in connections"
                :key="'conn-' + index"
                :d="getConnectionPath(conn)"
                :stroke="conn.selected ? '#409eff' : '#909399'"
                :stroke-width="conn.selected ? 3 : 2"
                fill="none"
                class="connection-line"
                :class="{ 'ai-connection': conn.aiFlow }"
                @click.stop="selectConnection(conn)"
                @contextmenu.prevent.stop="showConnectionMenu(conn, $event)">
              </path>
              <!-- 箭头 -->
              <polygon
                v-for="(conn, index) in connections"
                :key="'arrow-' + index"
                :points="getArrowPoints(conn)"
                :fill="conn.selected ? '#409eff' : '#909399'">
              </polygon>
            </g>

            <!-- 节点层 -->
            <g class="nodes-layer">
              <g
                v-for="node in canvasNodes"
                :key="node.id"
                :transform="`translate(${node.x}, ${node.y})`"
                class="canvas-node"
                :class="{ 
                  'selected': node.selected,
                  'ai-node': node.isAI,
                  'error': node.hasError
                }"
                @mousedown.stop="handleNodeMouseDown(node, $event)"
                @click.stop="selectNode(node)"
                @dblclick.stop="editNode(node)"
                @contextmenu.prevent.stop="showNodeMenu(node, $event)">
                
                <!-- 节点主体 -->
                <rect
                  :width="nodeWidth"
                  :height="nodeHeight"
                  :rx="10"
                  :fill="getNodeColor(node)"
                  :stroke="node.selected ? '#409eff' : (node.hasError ? '#f56c6c' : '#d9d9d9')"
                  :stroke-width="node.selected ? 3 : 1"
                  class="node-rect">
                </rect>

                <!-- 节点图标 -->
                <text
                  :x="20"
                  :y="35"
                  class="node-icon-text"
                  font-size="24">
                  {{ node.icon }}
                </text>

                <!-- 节点标题 -->
                <text
                  :x="50"
                  :y="30"
                  class="node-title"
                  font-size="14"
                  font-weight="bold">
                  {{ node.label }}
                </text>

                <!-- 节点状态 -->
                <text
                  :x="50"
                  :y="48"
                  class="node-status"
                  font-size="11"
                  :fill="getStatusColor(node.status)">
                  {{ getStatusText(node.status) }}
                </text>

                <!-- AI标识 -->
                <g v-if="node.isAI" :transform="`translate(${nodeWidth - 35}, 10)`">
                  <rect width="30" height="16" rx="8" fill="#e6a23c"></rect>
                  <text x="15" y="12" text-anchor="middle" fill="white" font-size="10" font-weight="bold">AI</text>
                </g>

                <!-- 错误标识 -->
                <g v-if="node.hasError" :transform="`translate(${nodeWidth - 35}, 35)`">
                  <circle cx="12" cy="8" r="10" fill="#f56c6c"></circle>
                  <text x="12" y="12" text-anchor="middle" fill="white" font-size="14" font-weight="bold">!</text>
                </g>

                <!-- 连接点 -->
                <circle
                  v-for="point in connectionPoints"
                  :key="point.position"
                  :cx="point.x"
                  :cy="point.y"
                  r="6"
                  fill="#fff"
                  stroke="#409eff"
                  stroke-width="2"
                  class="connection-point"
                  @mousedown.stop="startConnection(node, point.position, $event)"
                  @mouseup.stop="endConnection(node, point.position)">
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

            <!-- 框选矩形 -->
            <rect
              v-if="selectionBox"
              :x="selectionBox.x"
              :y="selectionBox.y"
              :width="selectionBox.width"
              :height="selectionBox.height"
              fill="rgba(64, 158, 255, 0.1)"
              stroke="#409eff"
              stroke-width="1"
              stroke-dasharray="5,5">
            </rect>
          </svg>
        </div>

        <!-- 缩略图 -->
        <div class="minimap" v-if="showMinimap">
          <div class="minimap-header">
            <span>缩略图</span>
            <el-button @click="showMinimap = false" :icon="Close" link size="small"></el-button>
          </div>
          <svg class="minimap-svg" viewBox="0 0 800 600">
            <rect
              v-for="node in canvasNodes"
              :key="'mini-' + node.id"
              :x="node.x / 5"
              :y="node.y / 5"
              :width="nodeWidth / 5"
              :height="nodeHeight / 5"
              :fill="getNodeColor(node)"
              opacity="0.8">
            </rect>
          </svg>
        </div>
      </div>

      <!-- 右侧属性面板 -->
      <div class="right-sidebar" :class="{ collapsed: rightCollapsed }">
        <div class="sidebar-header">
          <span v-if="!rightCollapsed">节点属性</span>
          <el-button 
            @click="rightCollapsed = !rightCollapsed" 
            :icon="rightCollapsed ? Expand : Fold"
            link>
          </el-button>
        </div>

        <div v-if="!rightCollapsed" class="sidebar-content">
          <div v-if="selectedNodes.length === 0" class="no-selection">
            <el-empty description="请选择一个节点进行编辑" :image-size="80"></el-empty>
          </div>

          <div v-else-if="selectedNodes.length === 1" class="node-properties">
            <el-tabs v-model="activeTab">
              <!-- 基础设置 -->
              <el-tab-pane label="基础设置" name="basic">
                <el-form label-width="80px" size="small">
                  <el-form-item label="节点名称">
                    <el-input v-model="currentEditNode.label" @change="markAsModified"></el-input>
                  </el-form-item>

                  <el-form-item label="节点描述">
                    <el-input
                      v-model="currentEditNode.description"
                      type="textarea"
                      :rows="3"
                      placeholder="描述节点的功能、目标和预期输出"
                      @change="markAsModified">
                    </el-input>
                  </el-form-item>

                  <el-form-item label="执行角色">
                    <el-select v-model="currentEditNode.role" @change="markAsModified" placeholder="选择负责人">
                      <el-option label="研发部" value="rd"></el-option>
                      <el-option label="生产计划" value="planning"></el-option>
                      <el-option label="质量部" value="quality"></el-option>
                      <el-option label="工艺部" value="process"></el-option>
                      <el-option label="采购部" value="procurement"></el-option>
                      <el-option label="设备科" value="equipment"></el-option>
                      <el-option label="财务部" value="finance"></el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="SLA时长">
                    <el-input-number 
                      v-model="currentEditNode.sla" 
                      :min="0.1"
                      :step="0.5"
                      @change="markAsModified">
                    </el-input-number>
                    <span style="margin-left: 8px">小时</span>
                  </el-form-item>

                  <el-form-item label="节点颜色">
                    <el-color-picker v-model="currentEditNode.customColor" @change="markAsModified"></el-color-picker>
                  </el-form-item>
                </el-form>
              </el-tab-pane>

              <!-- AI参数 -->
              <el-tab-pane label="AI参数" name="ai" v-if="currentEditNode.isAI">
                <el-form label-width="80px" size="small">
                  <el-form-item label="AI模型">
                    <el-select v-model="currentEditNode.aiModel" @change="markAsModified">
                      <el-option label="GPT-4" value="gpt-4"></el-option>
                      <el-option label="GPT-3.5 Turbo" value="gpt-3.5-turbo"></el-option>
                      <el-option label="Claude-3" value="claude-3"></el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="Prompt">
                    <el-input
                      v-model="currentEditNode.aiPrompt"
                      type="textarea"
                      :rows="6"
                      placeholder="输入AI提示词模板..."
                      @change="markAsModified">
                    </el-input>
                  </el-form-item>

                  <el-form-item label="AI功能">
                    <el-checkbox-group v-model="currentEditNode.aiCapabilities" @change="markAsModified">
                      <el-checkbox label="analysis">数据分析</el-checkbox>
                      <el-checkbox label="decision">智能判断</el-checkbox>
                      <el-checkbox label="generation">内容生成</el-checkbox>
                      <el-checkbox label="prediction">预测建议</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-form>
              </el-tab-pane>

              <!-- 数据映射 -->
              <el-tab-pane label="数据映射" name="data">
                <div class="data-mapping">
                  <h4>输入字段</h4>
                  <el-button @click="addInputField" size="small" :icon="Plus">添加字段</el-button>
                  <div v-for="(field, index) in currentEditNode.inputFields" :key="'input-' + index" class="field-item">
                    <el-input v-model="field.key" placeholder="字段名" size="small"></el-input>
                    <el-select v-model="field.type" size="small">
                      <el-option label="文本" value="string"></el-option>
                      <el-option label="数字" value="number"></el-option>
                      <el-option label="文件" value="file"></el-option>
                      <el-option label="列表" value="array"></el-option>
                    </el-select>
                    <el-checkbox v-model="field.required">必填</el-checkbox>
                    <el-button @click="removeInputField(index)" :icon="Delete" link type="danger"></el-button>
                  </div>

                  <h4 style="margin-top: 20px">输出字段</h4>
                  <el-button @click="addOutputField" size="small" :icon="Plus">添加字段</el-button>
                  <div v-for="(field, index) in currentEditNode.outputFields" :key="'output-' + index" class="field-item">
                    <el-input v-model="field.key" placeholder="字段名" size="small"></el-input>
                    <el-select v-model="field.type" size="small">
                      <el-option label="文本" value="string"></el-option>
                      <el-option label="数字" value="number"></el-option>
                      <el-option label="布尔" value="boolean"></el-option>
                      <el-option label="对象" value="object"></el-option>
                    </el-select>
                    <el-button @click="removeOutputField(index)" :icon="Delete" link type="danger"></el-button>
                  </div>
                </div>
              </el-tab-pane>

              <!-- 集成设置 -->
              <el-tab-pane label="集成设置" name="integration" v-if="currentEditNode.category === 'integration'">
                <el-form label-width="80px" size="small">
                  <el-form-item label="数据源">
                    <el-select v-model="currentEditNode.dataSource" @change="markAsModified">
                      <el-option label="MES系统" value="mes"></el-option>
                      <el-option label="ERP系统" value="erp"></el-option>
                      <el-option label="CRM系统" value="crm"></el-option>
                      <el-option label="设备IoT" value="iot"></el-option>
                      <el-option label="质检系统" value="qc"></el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="API端点">
                    <el-input v-model="currentEditNode.apiEndpoint" @change="markAsModified"></el-input>
                  </el-form-item>

                  <el-form-item label="请求方法">
                    <el-radio-group v-model="currentEditNode.httpMethod" @change="markAsModified">
                      <el-radio label="GET">GET</el-radio>
                      <el-radio label="POST">POST</el-radio>
                      <el-radio label="PUT">PUT</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-form>
              </el-tab-pane>

              <!-- 权限设置 -->
              <el-tab-pane label="权限" name="permission">
                <el-form label-width="100px" size="small">
                  <el-form-item label="可编辑角色">
                    <el-checkbox-group v-model="currentEditNode.editableBy" @change="markAsModified">
                      <el-checkbox label="admin">管理员</el-checkbox>
                      <el-checkbox label="process_owner">流程负责人</el-checkbox>
                      <el-checkbox label="dept_manager">部门经理</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>

                  <el-form-item label="可查看角色">
                    <el-checkbox-group v-model="currentEditNode.viewableBy" @change="markAsModified">
                      <el-checkbox label="all">所有人</el-checkbox>
                      <el-checkbox label="related">相关人员</el-checkbox>
                      <el-checkbox label="management">管理层</el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>

            <el-divider />
            <div class="node-actions">
              <el-button type="primary" @click="applyChanges" :icon="Check">应用更改</el-button>
              <el-button @click="resetChanges" :icon="RefreshLeft">重置</el-button>
              <el-button type="danger" @click="deleteSelectedNode" :icon="Delete">删除节点</el-button>
            </div>
          </div>

          <div v-else class="multi-selection">
            <p>已选择 {{ selectedNodes.length }} 个节点</p>
            <el-button @click="deleteSelectedNodes" type="danger">批量删除</el-button>
            <el-button @click="alignNodes('left')">左对齐</el-button>
            <el-button @click="alignNodes('center')">居中对齐</el-button>
            <el-button @click="alignNodes('top')">顶部对齐</el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- AI智能推荐浮层 -->
    <transition name="fade">
      <div 
        v-if="aiSuggestionVisible" 
        class="ai-suggestion-panel"
        :style="{ left: aiSuggestionPos.x + 'px', top: aiSuggestionPos.y + 'px' }">
        <div class="suggestion-header">
          <el-icon><MagicStick /></el-icon>
          <span>AI 推荐下一步</span>
        </div>
        <div class="suggestion-items">
          <div
            v-for="suggestion in aiSuggestions"
            :key="suggestion.id"
            class="suggestion-item"
            @click="acceptSuggestion(suggestion)">
            <span class="suggestion-icon">{{ suggestion.icon }}</span>
            <span class="suggestion-name">{{ suggestion.name }}</span>
          </div>
        </div>
      </div>
    </transition>

    <!-- 右键菜单 -->
    <el-dropdown 
      ref="contextMenu"
      trigger="contextmenu"
      :teleported="false"
      v-model:visible="contextMenuVisible"
      :style="{
        position: 'fixed',
        left: contextMenuPos.x + 'px',
        top: contextMenuPos.y + 'px'
      }">
      <span></span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-if="contextMenuTarget === 'canvas'" @click="pasteNode" :disabled="!clipboard">
            <el-icon><DocumentCopy /></el-icon> 粘贴节点
          </el-dropdown-item>
          <el-dropdown-item v-if="contextMenuTarget === 'node'" @click="copyNode">
            <el-icon><DocumentCopy /></el-icon> 复制
          </el-dropdown-item>
          <el-dropdown-item v-if="contextMenuTarget === 'node'" @click="cutNode">
            <el-icon><Scissor /></el-icon> 剪切
          </el-dropdown-item>
          <el-dropdown-item v-if="contextMenuTarget === 'node'" @click="duplicateNode">
            <el-icon><CopyDocument /></el-icon> 克隆
          </el-dropdown-item>
          <el-dropdown-item v-if="contextMenuTarget === 'node'" divided @click="deleteContextNode">
            <el-icon><Delete /></el-icon> 删除
          </el-dropdown-item>
          <el-dropdown-item v-if="contextMenuTarget === 'connection'" @click="deleteContextConnection">
            <el-icon><Delete /></el-icon> 删除连接线
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- AI自动生成对话框 -->
    <el-dialog
      v-model="aiDialogVisible"
      title="🤖 AI 自动构建流程"
      width="600px">
      <el-form label-width="100px">
        <el-form-item label="任务描述">
          <el-input
            v-model="aiTaskDescription"
            type="textarea"
            :rows="5"
            placeholder="例如：处理生产线包装漏装问题的完整流程">
          </el-input>
        </el-form-item>
        <el-form-item label="涉及部门">
          <el-checkbox-group v-model="aiInvolvedDepts">
            <el-checkbox label="quality">质量部</el-checkbox>
            <el-checkbox label="production">生产部</el-checkbox>
            <el-checkbox label="equipment">设备科</el-checkbox>
            <el-checkbox label="process">工艺部</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="aiDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmAIGenerate" :loading="aiGenerating">
          开始生成
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft, DocumentChecked, Upload, MagicStick, Search, Lightning, Tools,
  Share, Connection, Finished, Expand, Fold, RefreshLeft, RefreshRight,
  ZoomIn, ZoomOut, Grid, Select, Plus, Delete, Check, Close, DocumentCopy,
  Scissor, CopyDocument
} from '@element-plus/icons-vue'

const router = useRouter()

// ==================== 基础数据 ====================
const workflowName = ref('新工作流')
const workflowVersion = ref('v3.1')
const unsavedChanges = ref(0)

// 左右侧边栏折叠
const leftCollapsed = ref(false)
const rightCollapsed = ref(false)

// 节点搜索
const nodeSearchText = ref('')

// 激活的分类
const activeCategories = ref(['trigger', 'action', 'ai', 'logic', 'integration', 'output'])

// 属性面板激活标签
const activeTab = ref('basic')

// 画布缩放和平移
const canvasZoom = ref(1)
const viewBox = ref({ x: 0, y: 0, width: 4000, height: 3000 })

// 网格和缩略图
const showGrid = ref(true)
const showMinimap = ref(true)

// 节点尺寸
const nodeWidth = 220
const nodeHeight = 70

// 连接点位置
const connectionPoints = [
  { position: 'top', x: nodeWidth / 2, y: 0 },
  { position: 'right', x: nodeWidth, y: nodeHeight / 2 },
  { position: 'bottom', x: nodeWidth / 2, y: nodeHeight },
  { position: 'left', x: 0, y: nodeHeight / 2 }
]

// ==================== 节点库定义 ====================
const nodeLibrary = ref([
  // 触发节点
  { id: 'trigger-manual', category: 'trigger', name: '手动触发', icon: '👆', description: '手动启动流程', color: '#409eff' },
  { id: 'trigger-scheduled', category: 'trigger', name: '定时触发', icon: '⏰', description: '定时自动执行', color: '#409eff' },
  { id: 'trigger-alarm', category: 'trigger', name: '设备告警', icon: '🚨', description: '设备异常触发', color: '#f56c6c' },
  { id: 'trigger-doc', category: 'trigger', name: '文档上传', icon: '📄', description: '文档提交触发', color: '#409eff' },

  // 操作节点
  { id: 'action-approval', category: 'action', name: '审批节点', icon: '✅', description: '需要人工审批', color: '#67c23a' },
  { id: 'action-form', category: 'action', name: '表单填写', icon: '📝', description: '收集用户输入', color: '#67c23a' },
  { id: 'action-notify', category: 'action', name: '消息通知', icon: '📧', description: '发送通知消息', color: '#67c23a' },
  { id: 'action-task', category: 'action', name: '创建任务', icon: '📋', description: '创建工作任务', color: '#67c23a' },

  // AI智能节点
  { id: 'ai-condition', category: 'ai', name: 'AI判断', icon: '🧠', description: 'AI智能决策', color: '#e6a23c', isAI: true },
  { id: 'ai-analysis', category: 'ai', name: 'AI分析', icon: '📊', description: '数据智能分析', color: '#e6a23c', isAI: true },
  { id: 'ai-generate', category: 'ai', name: 'AI生成文档', icon: '📄', description: '自动生成报告', color: '#e6a23c', isAI: true },
  { id: 'ai-assignment', category: 'ai', name: 'AI分派', icon: '🎯', description: '智能任务分配', color: '#e6a23c', isAI: true },
  { id: 'ai-predict', category: 'ai', name: 'AI预测', icon: '🔮', description: '预测性分析', color: '#e6a23c', isAI: true },

  // 控制节点
  { id: 'logic-if', category: 'logic', name: '条件分支', icon: '💠', description: 'If/Else判断', color: '#f56c6c' },
  { id: 'logic-parallel', category: 'logic', name: '并行执行', icon: '⚡', description: '多路并行', color: '#f56c6c' },
  { id: 'logic-loop', category: 'logic', name: '循环节点', icon: '🔄', description: '重复执行', color: '#f56c6c' },
  { id: 'logic-merge', category: 'logic', name: '汇聚节点', icon: '🔀', description: '多路汇总', color: '#f56c6c' },

  // 集成节点
  { id: 'integration-mes', category: 'integration', name: 'MES查询', icon: '🏭', description: '查询MES数据', color: '#909399' },
  { id: 'integration-erp', category: 'integration', name: 'ERP查询', icon: '💼', description: '查询ERP数据', color: '#909399' },
  { id: 'integration-crm', category: 'integration', name: 'CRM查询', icon: '👥', description: '查询客户数据', color: '#909399' },
  { id: 'integration-iot', category: 'integration', name: '设备数据', icon: '📡', description: 'IoT设备数据', color: '#909399' },
  { id: 'integration-ticket', category: 'integration', name: '创建工单', icon: '🎫', description: '创建维修工单', color: '#909399' },

  // 输出节点
  { id: 'output-report', category: 'output', name: '生成报告', icon: '📑', description: '输出分析报告', color: '#5470c6' },
  { id: 'output-email', category: 'output', name: '发送邮件', icon: '✉️', description: '邮件发送', color: '#5470c6' },
  { id: 'output-export', category: 'output', name: '数据导出', icon: '💾', description: '导出Excel/PDF', color: '#5470c6' },
  { id: 'output-archive', category: 'output', name: '归档存储', icon: '🗄️', description: '文档归档', color: '#5470c6' }
])

// 画布节点
const canvasNodes = ref([])

// 连接线
const connections = ref([])

// 选中的节点
const selectedNodes = ref([])

// 当前编辑节点
const currentEditNode = computed(() => {
  return selectedNodes.value.length === 1 ? selectedNodes.value[0] : null
})

// ==================== 拖拽相关 ====================
const draggedNode = ref(null)
const isDragging = ref(false)
const dragStartPos = ref({ x: 0, y: 0 })

// 连接线绘制
const tempConnection = ref(null)
const connectionStartNode = ref(null)
const connectionStartPoint = ref(null)

// 框选
const selectionBox = ref(null)
const isSelecting = ref(false)

// 历史记录
const history = ref([])
const historyIndex = ref(-1)
const canUndo = computed(() => historyIndex.value > 0)
const canRedo = computed(() => historyIndex.value < history.value.length - 1)

// AI相关
const aiDialogVisible = ref(false)
const aiGenerating = ref(false)
const aiTaskDescription = ref('')
const aiInvolvedDepts = ref([])
const aiSuggestionVisible = ref(false)
const aiSuggestionPos = ref({ x: 0, y: 0 })
const aiSuggestions = ref([])

// 右键菜单
const contextMenuVisible = ref(false)
const contextMenuPos = ref({ x: 0, y: 0 })
const contextMenuTarget = ref(null)
const contextMenuNode = ref(null)
const contextMenuConnection = ref(null)

// 剪贴板
const clipboard = ref(null)

// ==================== 计算属性 ====================
const filteredNodesByCategory = (category) => {
  return computed(() => {
    return nodeLibrary.value.filter(node => {
      const matchCategory = node.category === category
      const matchSearch = !nodeSearchText.value || 
        node.name.includes(nodeSearchText.value) || 
        node.description.includes(nodeSearchText.value)
      return matchCategory && matchSearch
    })
  })
}

// ==================== 节点操作 ====================
const handleNodeDragStart = (event, node) => {
  event.dataTransfer.effectAllowed = 'copy'
  event.dataTransfer.setData('text/plain', JSON.stringify(node))
}

const addNodeToCanvas = (libraryNode, position = null) => {
  const newNode = {
    id: 'node-' + Date.now(),
    ...libraryNode,
    label: libraryNode.name,
    x: position ? position.x : viewBox.value.x + viewBox.value.width / 2,
    y: position ? position.y : viewBox.value.y + viewBox.value.height / 2,
    selected: false,
    status: 'pending',
    hasError: false,
    role: '',
    sla: 2,
    customColor: null,
    aiModel: 'gpt-4',
    aiPrompt: '',
    aiCapabilities: [],
    inputFields: [],
    outputFields: [],
    dataSource: '',
    apiEndpoint: '',
    httpMethod: 'GET',
    editableBy: ['admin'],
    viewableBy: ['all']
  }

  canvasNodes.value.push(newNode)
  saveHistory()
  markAsModified()
  ElMessage.success('节点已添加')
}

const handleCanvasDrop = (event) => {
  event.preventDefault()
  const data = JSON.parse(event.dataTransfer.getData('text/plain'))
  
  const svg = event.currentTarget.querySelector('svg')
  const rect = svg.getBoundingClientRect()
  const x = (event.clientX - rect.left) / canvasZoom.value + viewBox.value.x
  const y = (event.clientY - rect.top) / canvasZoom.value + viewBox.value.y

  addNodeToCanvas(data, { x, y })
}

const selectNode = (node) => {
  if (!event.ctrlKey && !event.metaKey) {
    // 清除其他选中
    canvasNodes.value.forEach(n => n.selected = false)
    selectedNodes.value = []
  }
  
  node.selected = !node.selected
  
  if (node.selected) {
    selectedNodes.value.push(node)
  } else {
    const index = selectedNodes.value.findIndex(n => n.id === node.id)
    if (index > -1) selectedNodes.value.splice(index, 1)
  }
}

const deleteSelectedNode = () => {
  ElMessageBox.confirm('确定删除选中的节点吗?', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    selectedNodes.value.forEach(node => {
      const index = canvasNodes.value.findIndex(n => n.id === node.id)
      if (index > -1) {
        canvasNodes.value.splice(index, 1)
        // 删除相关连接
        connections.value = connections.value.filter(
          c => c.from !== node.id && c.to !== node.id
        )
      }
    })
    selectedNodes.value = []
    saveHistory()
    markAsModified()
    ElMessage.success('节点已删除')
  }).catch(() => {})
}

// ==================== 连接线操作 ====================
const startConnection = (node, position, event) => {
  connectionStartNode.value = node
  connectionStartPoint.value = position
  
  const point = connectionPoints.find(p => p.position === position)
  tempConnection.value = {
    x1: node.x + point.x,
    y1: node.y + point.y,
    x2: node.x + point.x,
    y2: node.y + point.y
  }
  
  document.addEventListener('mousemove', updateTempConnection)
  document.addEventListener('mouseup', cancelConnection)
}

const updateTempConnection = (event) => {
  if (!tempConnection.value) return
  
  const svg = document.querySelector('.workflow-svg')
  const rect = svg.getBoundingClientRect()
  tempConnection.value.x2 = (event.clientX - rect.left) / canvasZoom.value + viewBox.value.x
  tempConnection.value.y2 = (event.clientY - rect.top) / canvasZoom.value + viewBox.value.y
}

const endConnection = (node, position) => {
  if (!connectionStartNode.value || connectionStartNode.value.id === node.id) {
    cancelConnection()
    return
  }
  
  const newConnection = {
    id: 'conn-' + Date.now(),
    from: connectionStartNode.value.id,
    to: node.id,
    fromPoint: connectionStartPoint.value,
    toPoint: position,
    selected: false,
    aiFlow: connectionStartNode.value.isAI || node.isAI
  }
  
  connections.value.push(newConnection)
  saveHistory()
  markAsModified()
  ElMessage.success('连接已创建')
  
  cancelConnection()
}

const cancelConnection = () => {
  tempConnection.value = null
  connectionStartNode.value = null
  connectionStartPoint.value = null
  document.removeEventListener('mousemove', updateTempConnection)
  document.removeEventListener('mouseup', cancelConnection)
}

const getConnectionPath = (conn) => {
  const fromNode = canvasNodes.value.find(n => n.id === conn.from)
  const toNode = canvasNodes.value.find(n => n.id === conn.to)
  
  if (!fromNode || !toNode) return ''
  
  const fromPoint = connectionPoints.find(p => p.position === conn.fromPoint)
  const toPoint = connectionPoints.find(p => p.position === conn.toPoint)
  
  const x1 = fromNode.x + fromPoint.x
  const y1 = fromNode.y + fromPoint.y
  const x2 = toNode.x + toPoint.x
  const y2 = toNode.y + toPoint.y
  
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
  const toNode = canvasNodes.value.find(n => n.id === conn.to)
  if (!toNode) return ''
  
  const toPoint = connectionPoints.find(p => p.position === conn.toPoint)
  const x = toNode.x + toPoint.x
  const y = toNode.y + toPoint.y
  
  // 根据连接点位置调整箭头方向
  if (conn.toPoint === 'top') return `${x},${y} ${x-8},${y-12} ${x+8},${y-12}`
  if (conn.toPoint === 'bottom') return `${x},${y} ${x-8},${y+12} ${x+8},${y+12}`
  if (conn.toPoint === 'left') return `${x},${y} ${x-12},${y-8} ${x-12},${y+8}`
  if (conn.toPoint === 'right') return `${x},${y} ${x+12},${y-8} ${x+12},${y+8}`
  
  return ''
}

const selectConnection = (conn) => {
  connections.value.forEach(c => c.selected = false)
  conn.selected = true
}

// ==================== 画布交互 ====================
const handleCanvasMouseDown = (event) => {
  if (event.button === 0 && event.target.classList.contains('canvas-container')) {
    // 开始框选
    isSelecting.value = true
    const rect = event.currentTarget.getBoundingClientRect()
    const startX = (event.clientX - rect.left) / canvasZoom.value + viewBox.value.x
    const startY = (event.clientY - rect.top) / canvasZoom.value + viewBox.value.y
    
    selectionBox.value = { x: startX, y: startY, width: 0, height: 0 }
  }
}

const handleCanvasMouseMove = (event) => {
  if (isSelecting.value && selectionBox.value) {
    const rect = event.currentTarget.getBoundingClientRect()
    const currentX = (event.clientX - rect.left) / canvasZoom.value + viewBox.value.x
    const currentY = (event.clientY - rect.top) / canvasZoom.value + viewBox.value.y
    
    selectionBox.value.width = currentX - selectionBox.value.x
    selectionBox.value.height = currentY - selectionBox.value.y
  }
}

const handleCanvasMouseUp = () => {
  if (isSelecting.value && selectionBox.value) {
    // 计算框选范围内的节点
    const box = selectionBox.value
    const minX = Math.min(box.x, box.x + box.width)
    const maxX = Math.max(box.x, box.x + box.width)
    const minY = Math.min(box.y, box.y + box.height)
    const maxY = Math.max(box.y, box.y + box.height)
    
    canvasNodes.value.forEach(node => {
      if (node.x >= minX && node.x + nodeWidth <= maxX &&
          node.y >= minY && node.y + nodeHeight <= maxY) {
        node.selected = true
        if (!selectedNodes.value.find(n => n.id === node.id)) {
          selectedNodes.value.push(node)
        }
      }
    })
    
    selectionBox.value = null
    isSelecting.value = false
  }
}

const handleNodeMouseDown = (node, event) => {
  isDragging.value = true
  dragStartPos.value = {
    x: event.clientX,
    y: event.clientY,
    nodeX: node.x,
    nodeY: node.y
  }
  
  document.addEventListener('mousemove', handleNodeDrag)
  document.addEventListener('mouseup', handleNodeDragEnd)
}

const handleNodeDrag = (event) => {
  if (!isDragging.value) return
  
  const dx = (event.clientX - dragStartPos.value.x) / canvasZoom.value
  const dy = (event.clientY - dragStartPos.value.y) / canvasZoom.value
  
  selectedNodes.value.forEach(node => {
    node.x = dragStartPos.value.nodeX + dx
    node.y = dragStartPos.value.nodeY + dy
  })
}

const handleNodeDragEnd = () => {
  if (isDragging.value) {
    saveHistory()
    markAsModified()
  }
  
  isDragging.value = false
  document.removeEventListener('mousemove', handleNodeDrag)
  document.removeEventListener('mouseup', handleNodeDragEnd)
}

const handleCanvasDoubleClick = (event) => {
  if (event.target.tagName === 'svg' || event.target.classList.contains('workflow-svg')) {
    // 显示节点选择菜单或AI推荐
    const rect = event.currentTarget.getBoundingClientRect()
    aiSuggestionPos.value = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
    
    // 模拟AI推荐
    aiSuggestions.value = [
      { id: 'ai-condition', name: 'AI判断', icon: '🧠' },
      { id: 'action-approval', name: '审批节点', icon: '✅' },
      { id: 'action-task', name: '创建任务', icon: '📋' },
      { id: 'ai-generate', name: 'AI生成文档', icon: '📄' }
    ]
    
    aiSuggestionVisible.value = true
    
    setTimeout(() => {
      aiSuggestionVisible.value = false
    }, 5000)
  }
}

const handleCanvasContextMenu = (event) => {
  contextMenuPos.value = { x: event.clientX, y: event.clientY }
  contextMenuTarget.value = 'canvas'
  contextMenuVisible.value = true
}

const showNodeMenu = (node, event) => {
  contextMenuPos.value = { x: event.clientX, y: event.clientY }
  contextMenuTarget.value = 'node'
  contextMenuNode.value = node
  contextMenuVisible.value = true
}

const showConnectionMenu = (conn, event) => {
  contextMenuPos.value = { x: event.clientX, y: event.clientY }
  contextMenuTarget.value = 'connection'
  contextMenuConnection.value = conn
  contextMenuVisible.value = true
}

// ==================== 工具栏操作 ====================
const zoomIn = () => {
  if (canvasZoom.value < 2) {
    canvasZoom.value += 0.1
    updateViewBox()
  }
}

const zoomOut = () => {
  if (canvasZoom.value > 0.3) {
    canvasZoom.value -= 0.1
    updateViewBox()
  }
}

const resetZoom = () => {
  canvasZoom.value = 1
  updateViewBox()
}

const updateViewBox = () => {
  viewBox.value.width = 4000 / canvasZoom.value
  viewBox.value.height = 3000 / canvasZoom.value
}

const toggleGrid = () => {
  showGrid.value = !showGrid.value
}

const selectAll = () => {
  canvasNodes.value.forEach(node => node.selected = true)
  selectedNodes.value = [...canvasNodes.value]
}

const autoLayout = () => {
  // 简单的自动布局：从上到下排列
  let y = 100
  canvasNodes.value.forEach((node, index) => {
    node.x = 100 + (index % 3) * 300
    node.y = y
    if ((index + 1) % 3 === 0) y += 150
  })
  saveHistory()
  markAsModified()
  ElMessage.success('自动布局完成')
}

const alignNodes = (direction) => {
  if (selectedNodes.value.length < 2) return
  
  if (direction === 'left') {
    const minX = Math.min(...selectedNodes.value.map(n => n.x))
    selectedNodes.value.forEach(n => n.x = minX)
  } else if (direction === 'center') {
    const avgX = selectedNodes.value.reduce((sum, n) => sum + n.x, 0) / selectedNodes.value.length
    selectedNodes.value.forEach(n => n.x = avgX)
  } else if (direction === 'top') {
    const minY = Math.min(...selectedNodes.value.map(n => n.y))
    selectedNodes.value.forEach(n => n.y = minY)
  }
  
  saveHistory()
  markAsModified()
}

const undoAction = () => {
  if (canUndo.value) {
    historyIndex.value--
    loadHistoryState(history.value[historyIndex.value])
  }
}

const redoAction = () => {
  if (canRedo.value) {
    historyIndex.value++
    loadHistoryState(history.value[historyIndex.value])
  }
}

const saveHistory = () => {
  const state = {
    nodes: JSON.parse(JSON.stringify(canvasNodes.value)),
    connections: JSON.parse(JSON.stringify(connections.value))
  }
  
  if (historyIndex.value < history.value.length - 1) {
    history.value = history.value.slice(0, historyIndex.value + 1)
  }
  
  history.value.push(state)
  historyIndex.value = history.value.length - 1
  
  // 限制历史记录数量
  if (history.value.length > 50) {
    history.value.shift()
    historyIndex.value--
  }
}

const loadHistoryState = (state) => {
  canvasNodes.value = JSON.parse(JSON.stringify(state.nodes))
  connections.value = JSON.parse(JSON.stringify(state.connections))
}

// ==================== 右键菜单操作 ====================
const copyNode = () => {
  if (contextMenuNode.value) {
    clipboard.value = JSON.parse(JSON.stringify(contextMenuNode.value))
    ElMessage.success('节点已复制')
  }
}

const cutNode = () => {
  if (contextMenuNode.value) {
    clipboard.value = JSON.parse(JSON.stringify(contextMenuNode.value))
    const index = canvasNodes.value.findIndex(n => n.id === contextMenuNode.value.id)
    if (index > -1) canvasNodes.value.splice(index, 1)
    saveHistory()
    markAsModified()
    ElMessage.success('节点已剪切')
  }
}

const pasteNode = () => {
  if (clipboard.value) {
    const newNode = JSON.parse(JSON.stringify(clipboard.value))
    newNode.id = 'node-' + Date.now()
    newNode.x += 50
    newNode.y += 50
    canvasNodes.value.push(newNode)
    saveHistory()
    markAsModified()
    ElMessage.success('节点已粘贴')
  }
}

const duplicateNode = () => {
  if (contextMenuNode.value) {
    const newNode = JSON.parse(JSON.stringify(contextMenuNode.value))
    newNode.id = 'node-' + Date.now()
    newNode.x += 50
    newNode.y += 50
    canvasNodes.value.push(newNode)
    saveHistory()
    markAsModified()
    ElMessage.success('节点已克隆')
  }
}

const deleteContextNode = () => {
  if (contextMenuNode.value) {
    const index = canvasNodes.value.findIndex(n => n.id === contextMenuNode.value.id)
    if (index > -1) {
      canvasNodes.value.splice(index, 1)
      connections.value = connections.value.filter(
        c => c.from !== contextMenuNode.value.id && c.to !== contextMenuNode.value.id
      )
      saveHistory()
      markAsModified()
      ElMessage.success('节点已删除')
    }
  }
}

const deleteContextConnection = () => {
  if (contextMenuConnection.value) {
    const index = connections.value.findIndex(c => c.id === contextMenuConnection.value.id)
    if (index > -1) {
      connections.value.splice(index, 1)
      saveHistory()
      markAsModified()
      ElMessage.success('连接线已删除')
    }
  }
}

// ==================== 属性编辑 ====================
const addInputField = () => {
  if (!currentEditNode.value.inputFields) {
    currentEditNode.value.inputFields = []
  }
  currentEditNode.value.inputFields.push({
    key: '',
    type: 'string',
    required: false
  })
  markAsModified()
}

const removeInputField = (index) => {
  currentEditNode.value.inputFields.splice(index, 1)
  markAsModified()
}

const addOutputField = () => {
  if (!currentEditNode.value.outputFields) {
    currentEditNode.value.outputFields = []
  }
  currentEditNode.value.outputFields.push({
    key: '',
    type: 'string'
  })
  markAsModified()
}

const removeOutputField = (index) => {
  currentEditNode.value.outputFields.splice(index, 1)
  markAsModified()
}

const applyChanges = () => {
  saveHistory()
  ElMessage.success('更改已应用')
}

const resetChanges = () => {
  if (historyIndex.value > 0) {
    loadHistoryState(history.value[historyIndex.value - 1])
    ElMessage.info('已重置更改')
  }
}

const markAsModified = () => {
  unsavedChanges.value++
}

// ==================== AI功能 ====================
const aiAutoGenerate = () => {
  aiDialogVisible.value = true
}

const confirmAIGenerate = async () => {
  if (!aiTaskDescription.value.trim()) {
    ElMessage.warning('请输入任务描述')
    return
  }
  
  aiGenerating.value = true
  
  try {
    // 模拟AI生成
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 生成示例流程
    const exampleNodes = [
      { ...nodeLibrary.value.find(n => n.id === 'trigger-manual'), x: 100, y: 100 },
      { ...nodeLibrary.value.find(n => n.id === 'ai-analysis'), x: 400, y: 100 },
      { ...nodeLibrary.value.find(n => n.id === 'logic-if'), x: 700, y: 100 },
      { ...nodeLibrary.value.find(n => n.id === 'action-approval'), x: 1000, y: 100 },
      { ...nodeLibrary.value.find(n => n.id === 'ai-generate'), x: 1300, y: 100 }
    ]
    
    canvasNodes.value = []
    exampleNodes.forEach(node => addNodeToCanvas(node, { x: node.x, y: node.y }))
    
    // 自动连接
    for (let i = 0; i < canvasNodes.value.length - 1; i++) {
      connections.value.push({
        id: 'conn-' + i,
        from: canvasNodes.value[i].id,
        to: canvasNodes.value[i + 1].id,
        fromPoint: 'right',
        toPoint: 'left',
        selected: false,
        aiFlow: canvasNodes.value[i].isAI || canvasNodes.value[i + 1].isAI
      })
    }
    
    saveHistory()
    ElMessage.success('AI流程生成完成!')
    aiDialogVisible.value = false
    
  } catch (error) {
    ElMessage.error('AI生成失败')
  } finally {
    aiGenerating.value = false
  }
}

const acceptSuggestion = (suggestion) => {
  const node = nodeLibrary.value.find(n => n.id === suggestion.id)
  if (node) {
    addNodeToCanvas(node)
  }
  aiSuggestionVisible.value = false
}

// ==================== 工具函数 ====================
const getNodeColor = (node) => {
  if (node.customColor) return node.customColor
  if (node.hasError) return '#fef0f0'
  if (node.isAI) return '#fdf6ec'
  
  const categoryColors = {
    trigger: '#ecf5ff',
    action: '#f0f9ff',
    ai: '#fdf6ec',
    logic: '#fef0f0',
    integration: '#f4f4f5',
    output: '#eff6ff'
  }
  
  return categoryColors[node.category] || '#ffffff'
}

const getStatusColor = (status) => {
  const colors = {
    pending: '#e6a23c',
    configured: '#67c23a',
    error: '#f56c6c',
    running: '#409eff'
  }
  return colors[status] || '#909399'
}

const getStatusText = (status) => {
  const texts = {
    pending: '待配置',
    configured: '配置完成',
    error: '配置错误',
    running: '正在运行'
  }
  return texts[status] || '未知状态'
}

const editNode = (node) => {
  selectNode(node)
  activeTab.value = 'basic'
}

const deleteSelectedNodes = () => {
  selectedNodes.value.forEach(node => {
    const index = canvasNodes.value.findIndex(n => n.id === node.id)
    if (index > -1) canvasNodes.value.splice(index, 1)
  })
  selectedNodes.value = []
  saveHistory()
  markAsModified()
}

const saveWorkflow = () => {
  const workflowData = {
    name: workflowName.value,
    version: workflowVersion.value,
    nodes: canvasNodes.value,
    connections: connections.value,
    timestamp: new Date().toISOString()
  }
  
  localStorage.setItem('workflow-editor-v4', JSON.stringify(workflowData))
  unsavedChanges.value = 0
  ElMessage.success('工作流已保存')
}

const publishWorkflow = () => {
  ElMessageBox.confirm('确定要发布工作流吗？发布后将应用到生产环境。', '确认发布', {
    confirmButtonText: '发布',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('工作流已发布')
  }).catch(() => {})
}

const goBack = () => {
  if (unsavedChanges.value > 0) {
    ElMessageBox.confirm('有未保存的更改，确定要离开吗？', '确认离开', {
      confirmButtonText: '离开',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      router.push('/')
    }).catch(() => {})
  } else {
    router.push('/')
  }
}

// ==================== 生命周期 ====================
onMounted(() => {
  // 加载保存的工作流
  const saved = localStorage.getItem('workflow-editor-v4')
  if (saved) {
    try {
      const data = JSON.parse(saved)
      workflowName.value = data.name
      workflowVersion.value = data.version
      canvasNodes.value = data.nodes || []
      connections.value = data.connections || []
    } catch (e) {
      console.error('加载工作流失败', e)
    }
  }
  
  // 初始化历史记录
  saveHistory()
})
</script>

<style scoped lang="scss">
.workflow-editor-v4 {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f0f2f5;
}

.top-navbar {
  height: 60px;
  background: white;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);

  .nav-left {
    display: flex;
    align-items: center;
    gap: 20px;

    .workflow-info {
      display: flex;
      align-items: center;
    }

    .workflow-name-input {
      width: 300px;
      :deep(.el-input__inner) {
        font-size: 16px;
        font-weight: 600;
      }
    }
  }

  .nav-right {
    display: flex;
    gap: 10px;
  }
}

.main-workspace {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.left-sidebar {
  width: 280px;
  background: white;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;

  &.collapsed {
    width: 50px;

    .sidebar-content {
      display: none;
    }
  }

  .sidebar-header {
    height: 50px;
    padding: 0 15px;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
  }

  .sidebar-content {
    flex: 1;
    overflow-y: auto;
    padding: 10px;

    :deep(.el-input) {
      margin-bottom: 10px;
    }

    .node-categories {
      border: none;

      :deep(.el-collapse-item__header) {
        height: 40px;
        line-height: 40px;
        background: #fafafa;
        border: none;
        margin-bottom: 5px;
        border-radius: 4px;
      }

      :deep(.el-collapse-item__wrap) {
        border: none;
      }

      .category-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
      }

      .node-list {
        padding: 5px 0;

        .node-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          margin-bottom: 8px;
          background: white;
          border: 1px solid #e8e8e8;
          border-radius: 6px;
          cursor: grab;
          transition: all 0.2s;

          &:hover {
            border-color: #409eff;
            box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
            transform: translateX(5px);
          }

          &:active {
            cursor: grabbing;
          }

          &.ai-node {
            border-color: #e6a23c;
            background: linear-gradient(to right, #fdf6ec, white);
          }

          .node-icon {
            font-size: 24px;
          }

          .node-info {
            flex: 1;

            .node-name {
              font-size: 13px;
              font-weight: 600;
              margin-bottom: 2px;
            }

            .node-desc {
              font-size: 11px;
              color: #909399;
            }
          }
        }
      }
    }
  }
}

.center-canvas {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;

  .canvas-toolbar {
    height: 50px;
    background: white;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;

    .toolbar-left,
    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .canvas-title {
      font-weight: 600;
      font-size: 14px;
    }
  }

  .canvas-container {
    flex: 1;
    background: #fafafa;
    overflow: hidden;
    position: relative;
    cursor: default;

    .workflow-svg {
      width: 100%;
      height: 100%;

      .connection-line {
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          stroke-width: 4 !important;
        }

        &.ai-connection {
          stroke-dasharray: 8, 4;
          animation: ai-flow 1s linear infinite;
        }
      }

      .canvas-node {
        cursor: move;
        transition: filter 0.2s;

        &:hover {
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));
        }

        &.selected {
          filter: drop-shadow(0 4px 12px rgba(64, 158, 255, 0.5));
        }

        &.ai-node {
          .node-rect {
            filter: drop-shadow(0 0 6px rgba(230, 162, 60, 0.3));
          }
        }

        &.error {
          .node-rect {
            stroke: #f56c6c !important;
            stroke-width: 2 !important;
          }
        }

        .node-title {
          fill: #303133;
        }

        .node-status {
          opacity: 0.8;
        }

        .connection-point {
          opacity: 0;
          transition: opacity 0.2s;
          cursor: crosshair;
        }

        &:hover .connection-point {
          opacity: 1;
        }
      }
    }
  }

  .minimap {
    position: absolute;
    right: 20px;
    bottom: 20px;
    width: 200px;
    height: 150px;
    background: white;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.15);

    .minimap-header {
      height: 30px;
      padding: 0 10px;
      border-bottom: 1px solid #e8e8e8;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      font-weight: 600;
    }

    .minimap-svg {
      width: 100%;
      height: 120px;
    }
  }
}

.right-sidebar {
  width: 320px;
  background: white;
  border-left: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;

  &.collapsed {
    width: 50px;

    .sidebar-content {
      display: none;
    }
  }

  .sidebar-header {
    height: 50px;
    padding: 0 15px;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
  }

  .sidebar-content {
    flex: 1;
    overflow-y: auto;
    padding: 15px;

    .no-selection {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 300px;
    }

    .node-properties {
      :deep(.el-tabs__header) {
        margin-bottom: 15px;
      }

      .data-mapping {
        h4 {
          margin: 15px 0 10px;
          font-size: 13px;
          color: #606266;
        }

        .field-item {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;

          .el-input {
            flex: 1;
          }

          .el-select {
            width: 100px;
          }
        }
      }

      .node-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 15px;
      }
    }

    .multi-selection {
      text-align: center;
      padding: 20px 0;

      p {
        margin-bottom: 15px;
        font-weight: 600;
      }

      button {
        width: 100%;
        margin-bottom: 8px;
      }
    }
  }
}

.ai-suggestion-panel {
  position: fixed;
  background: white;
  border: 1px solid #e6a23c;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(230, 162, 60, 0.3);
  padding: 15px;
  min-width: 250px;
  z-index: 1000;

  .suggestion-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    font-weight: 600;
    color: #e6a23c;
  }

  .suggestion-items {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .suggestion-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      background: #fdf6ec;
      border: 1px solid #f5dab1;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #faecd8;
        transform: translateX(5px);
      }

      .suggestion-icon {
        font-size: 20px;
      }

      .suggestion-name {
        font-size: 13px;
        font-weight: 500;
      }
    }
  }
}

@keyframes ai-flow {
  to {
    stroke-dashoffset: -12;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
