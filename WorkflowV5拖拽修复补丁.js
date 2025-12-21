// 🔧 工作流编辑器V5拖拽修复补丁
// 文件位置：src/views/WorkflowEditorV5_N8N.vue
// 
// 问题：节点拖拽时抖动，无法编辑
// 原因：
// 1. 节点使用了transform定位但缺少正确的拖拽事件处理
// 2. will-change导致浏览器过度优化引起抖动
// 3. 拖拽和点击事件冲突
//
// 修复方案：

// ==================== 需要在<script setup>中添加的代码 ====================

// 1. 在现有ref定义后添加拖拽相关状态
const draggingNodeId = ref(null)  // 正在拖拽的节点ID
const dragOffset = ref({ x: 0, y: 0 })  // 拖拽偏移
const isDragging = ref(false)  // 是否正在拖拽

// 2. 替换现有的节点拖拽方法
const startNodeDrag = (event, node) => {
  // 只在节点头部拖拽，避免与按钮/下拉菜单冲突
  if (event.target.closest('.node-actions') || 
      event.target.closest('.endpoint') ||
      event.target.closest('.node-add-button')) {
    return
  }

  event.preventDefault()
  event.stopPropagation()
  
  draggingNodeId.value = node.id
  isDragging.value = true
  
  // 计算鼠标相对节点的偏移
  const nodeElement = event.currentTarget
  const rect = nodeElement.getBoundingClientRect()
  const canvasRect = canvasContainer.value.getBoundingClientRect()
  
  dragOffset.value = {
    x: (event.clientX - canvasRect.left) / canvasZoom.value - node.position.x,
    y: (event.clientY - canvasRect.top) / canvasZoom.value - node.position.y
  }
  
  // 添加全局事件监听
  document.addEventListener('mousemove', onNodeDrag)
  document.addEventListener('mouseup', stopNodeDrag)
  
  // 防止文本选择
  document.body.style.userSelect = 'none'
}

const onNodeDrag = (event) => {
  if (!isDragging.value || !draggingNodeId.value) return
  
  event.preventDefault()
  
  const canvasRect = canvasContainer.value.getBoundingClientRect()
  
  // 计算新位置
  const newX = (event.clientX - canvasRect.left) / canvasZoom.value - dragOffset.value.x
  const newY = (event.clientY - canvasRect.top) / canvasZoom.value - dragOffset.value.y
  
  // 更新节点位置
  const node = canvasNodes.value.find(n => n.id === draggingNodeId.value)
  if (node) {
    node.position.x = Math.max(0, newX)
    node.position.y = Math.max(0, newY)
    unsavedChanges.value++
  }
}

const stopNodeDrag = () => {
  if (isDragging.value) {
    isDragging.value = false
    draggingNodeId.value = null
    
    // 移除全局事件监听
    document.removeEventListener('mousemove', onNodeDrag)
    document.removeEventListener('mouseup', stopNodeDrag)
    
    // 恢复文本选择
    document.body.style.userSelect = ''
  }
}

// 3. 修改selectNode方法，添加防抖
let selectTimeout = null
const selectNodeFixed = (node) => {
  // 如果正在拖拽，不触发选中
  if (isDragging.value) return
  
  // 防抖，避免拖拽时误触发
  clearTimeout(selectTimeout)
  selectTimeout = setTimeout(() => {
    selectedNode.value = node.id
    selectedConnection.value = null
  }, 50)
}

// ==================== 需要修改的模板部分 ====================

// 将现有的 canvas-node div 的事件修改为：
/*
<div
  v-for="node in canvasNodes"
  :key="node.id"
  class="canvas-node"
  :class="{
    'node-selected': selectedNode === node.id,
    'node-error': node.error,
    'node-running': node.status === 'running',
    'is-dragging': draggingNodeId === node.id  // 添加拖拽状态类
  }"
  :style="{
    left: node.position.x + 'px',
    top: node.position.y + 'px',
    transform: 'none'  // ⚠️ 关键：移除transform，只用left/top定位
  }"
  @mousedown="startNodeDrag($event, node)"  // 改为mousedown
  @click.stop="selectNodeFixed(node)">      // 添加防抖的点击
  ...
</div>
*/

// ==================== 需要修改的CSS部分 ====================

// 在 .canvas-node 样式中修改：
/*
.canvas-node {
  position: absolute;
  width: 360px;
  background: #fff;
  border: 3px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 3px 12px rgba(0,0,0,0.08);
  cursor: move;
  // ⚠️ 移除 will-change: transform
  // ⚠️ 移除 transition (拖拽时不需要过渡)
  user-select: none;
  z-index: 100;
  
  &.is-dragging {
    z-index: 1000;
    box-shadow: 0 12px 36px rgba(0,0,0,0.2);
    // ⚠️ 移除 transform: translateZ(0)
    // ⚠️ 移除 transition: none
    cursor: grabbing !important;  // 拖拽时改变光标
  }

  // ... 其他样式保持不变
}
*/

// ==================== 完整修复步骤 ====================
/*
步骤1: 备份原文件
  cp src/views/WorkflowEditorV5_N8N.vue src/views/WorkflowEditorV5_N8N.vue.backup

步骤2: 添加新的拖拽状态变量（在script setup中）
  const draggingNodeId = ref(null)
  const dragOffset = ref({ x: 0, y: 0 })
  const isDragging = ref(false)

步骤3: 添加新的拖拽方法
  复制上面的 startNodeDrag, onNodeDrag, stopNodeDrag 方法

步骤4: 修改selectNode为selectNodeFixed

步骤5: 修改模板中的canvas-node
  - 添加 :class 中的 'is-dragging': draggingNodeId === node.id
  - 修改 :style 中的 transform: 'none'
  - 修改 @mousedown="startNodeDrag($event, node)"
  - 修改 @click.stop="selectNodeFixed(node)"

步骤6: 修改CSS
  - 移除 .canvas-node 中的 will-change
  - 移除 .canvas-node 中的 transition
  - 修改 .is-dragging 样式

步骤7: 测试
  - 刷新页面 (Ctrl+F5)
  - 测试拖拽节点
  - 测试点击选中节点
  - 测试节点属性编辑
*/

console.log('工作流编辑器V5拖拽修复补丁已加载')
