<template>
  <div class="toolsnet-map-viewer">
    <el-card class="header-card">
      <template #header>
        <div class="card-header">
          <span>
            <el-icon><Grid /></el-icon> 
            ToolsNet Map 结构
          </span>
          <el-space>
            <el-button size="small" @click="refreshMap">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
            <el-button size="small" type="primary" @click="showAddDialog('system')">
              <el-icon><Plus /></el-icon>
              添加系统
            </el-button>
          </el-space>
        </div>
      </template>

      <!-- 统计概览 -->
      <el-row :gutter="20" class="stats-row">
        <el-col :span="6">
          <el-statistic title="系统数量" :value="mapData.summary?.totalSystems || 0">
            <template #suffix>
              <el-icon><Setting /></el-icon>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic title="工位数量" :value="mapData.summary?.totalStations || 0">
            <template #suffix>
              <el-icon><Location /></el-icon>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic title="主轴数量" :value="mapData.summary?.totalSpindles || 0">
            <template #suffix>
              <el-icon><Tools /></el-icon>
            </template>
          </el-statistic>
        </el-col>
        <el-col :span="6">
          <el-statistic title="程序数量" :value="mapData.summary?.totalPrograms || 0">
            <template #suffix>
              <el-icon><Document /></el-icon>
            </template>
          </el-statistic>
        </el-col>
      </el-row>
    </el-card>

    <!-- 树形结构展示 -->
    <el-card style="margin-top: 20px;">
      <el-tree
        :data="treeData"
        :props="treeProps"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false">
        <template #default="{ node, data }">
          <div class="tree-node">
            <span class="node-label">
              <el-icon v-if="data.type === 'system'" color="#409eff"><Setting /></el-icon>
              <el-icon v-if="data.type === 'station'" color="#67c23a"><Location /></el-icon>
              <el-icon v-if="data.type === 'spindle'" color="#e6a23c"><Tools /></el-icon>
              <el-icon v-if="data.type === 'program'" color="#909399"><Document /></el-icon>
              {{ node.label }}
            </span>
            <span class="node-info">
              <el-tag v-if="data.type === 'system'" size="small" type="primary">
                {{ data.controllerType }}
              </el-tag>
              <el-tag v-if="data.type === 'program'" size="small">
                {{ data.targetTorque }}Nm / {{ data.targetAngle }}°
              </el-tag>
            </span>
            <span class="node-actions">
              <el-button
                size="small"
                text
                @click="editNode(data)">
                编辑
              </el-button>
              <el-button
                v-if="data.type !== 'program'"
                size="small"
                text
                type="primary"
                @click="addChild(data)">
                添加
              </el-button>
              <el-button
                size="small"
                text
                type="info"
                @click="viewDetails(data)">
                详情
              </el-button>
            </span>
          </div>
        </template>
      </el-tree>
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog
      v-model="detailsDialogVisible"
      :title="dialogTitle"
      width="600px">
      <el-descriptions v-if="selectedNode" :column="2" border>
        <el-descriptions-item label="类型">
          {{ typeLabels[selectedNode.type] }}
        </el-descriptions-item>
        <el-descriptions-item label="编号">
          {{ selectedNode.number }}
        </el-descriptions-item>
        <el-descriptions-item label="名称" span="2">
          {{ selectedNode.name }}
        </el-descriptions-item>
        <el-descriptions-item label="描述" span="2">
          {{ selectedNode.description || '-' }}
        </el-descriptions-item>
        
        <!-- 系统特有字段 -->
        <template v-if="selectedNode.type === 'system'">
          <el-descriptions-item label="控制器类型">
            {{ selectedNode.controllerType }}
          </el-descriptions-item>
          <el-descriptions-item label="IP地址">
            {{ selectedNode.ipAddress }}
          </el-descriptions-item>
        </template>

        <!-- 主轴特有字段 -->
        <template v-if="selectedNode.type === 'spindle'">
          <el-descriptions-item label="序列号" span="2">
            {{ selectedNode.serialNumber }}
          </el-descriptions-item>
        </template>

        <!-- 程序特有字段 -->
        <template v-if="selectedNode.type === 'program'">
          <el-descriptions-item label="目标扭矩">
            {{ selectedNode.targetTorque }} Nm
          </el-descriptions-item>
          <el-descriptions-item label="目标角度">
            {{ selectedNode.targetAngle }}°
          </el-descriptions-item>
          <el-descriptions-item label="扭矩范围">
            {{ selectedNode.minTorque }} ~ {{ selectedNode.maxTorque }} Nm
          </el-descriptions-item>
          <el-descriptions-item label="角度范围">
            {{ selectedNode.minAngle }} ~ {{ selectedNode.maxAngle }}°
          </el-descriptions-item>
          <el-descriptions-item label="最后修改" span="2">
            {{ selectedNode.lastModified ? new Date(selectedNode.lastModified).toLocaleString() : '-' }}
          </el-descriptions-item>
        </template>

        <!-- 层级路径 -->
        <el-descriptions-item label="层级路径" span="2">
          <el-tag>{{ selectedNode.path }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <el-button @click="detailsDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 编辑/添加对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="editMode === 'add' ? `添加${typeLabels[editType]}` : `编辑${typeLabels[editType]}`"
      width="600px">
      <el-form :model="editForm" label-width="120px">
        <el-form-item :label="`${typeLabels[editType]}编号`">
          <el-input-number
            v-model="editForm.number"
            :min="1"
            :disabled="editMode === 'edit'"
            style="width: 100%;" />
        </el-form-item>
        <el-form-item :label="`${typeLabels[editType]}名称`">
          <el-input v-model="editForm.name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="editForm.description"
            type="textarea"
            :rows="3" />
        </el-form-item>

        <!-- 系统特有字段 -->
        <template v-if="editType === 'system'">
          <el-form-item label="控制器类型">
            <el-select v-model="editForm.controllerType">
              <el-option label="PowerFocus 4000" value="PowerFocus 4000" />
              <el-option label="PowerFocus 6000" value="PowerFocus 6000" />
              <el-option label="PowerFocus 8000" value="PowerFocus 8000" />
              <el-option label="PowerMACS" value="PowerMACS" />
            </el-select>
          </el-form-item>
          <el-form-item label="IP地址">
            <el-input v-model="editForm.ipAddress" placeholder="192.168.1.100" />
          </el-form-item>
        </template>

        <!-- 主轴特有字段 -->
        <template v-if="editType === 'spindle'">
          <el-form-item label="序列号">
            <el-input v-model="editForm.serialNumber" />
          </el-form-item>
        </template>

        <!-- 程序特有字段 -->
        <template v-if="editType === 'program'">
          <el-form-item label="目标扭矩">
            <el-input-number
              v-model="editForm.targetTorque"
              :min="0"
              :step="0.1"
              style="width: 100%;" />
            <span style="margin-left: 8px;">Nm</span>
          </el-form-item>
          <el-form-item label="目标角度">
            <el-input-number
              v-model="editForm.targetAngle"
              :min="0"
              :step="1"
              style="width: 100%;" />
            <span style="margin-left: 8px;">°</span>
          </el-form-item>
          <el-form-item label="扭矩范围">
            <el-col :span="11">
              <el-input-number
                v-model="editForm.minTorque"
                :min="0"
                :step="0.1"
                style="width: 100%;"
                placeholder="最小" />
            </el-col>
            <el-col :span="2" style="text-align: center;">~</el-col>
            <el-col :span="11">
              <el-input-number
                v-model="editForm.maxTorque"
                :min="0"
                :step="0.1"
                style="width: 100%;"
                placeholder="最大" />
            </el-col>
          </el-form-item>
          <el-form-item label="角度范围">
            <el-col :span="11">
              <el-input-number
                v-model="editForm.minAngle"
                :min="0"
                :step="1"
                style="width: 100%;"
                placeholder="最小" />
            </el-col>
            <el-col :span="2" style="text-align: center;">~</el-col>
            <el-col :span="11">
              <el-input-number
                v-model="editForm.maxAngle"
                :min="0"
                :step="1"
                style="width: 100%;"
                placeholder="最大" />
            </el-col>
          </el-form-item>
        </template>
      </el-form>

      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveEdit">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Grid, Refresh, Plus, Setting, Location, Tools, Document
} from '@element-plus/icons-vue'

// 响应式数据
const mapData = ref({
  systems: [],
  summary: {
    totalSystems: 0,
    totalStations: 0,
    totalSpindles: 0,
    totalPrograms: 0
  }
})

const detailsDialogVisible = ref(false)
const editDialogVisible = ref(false)
const selectedNode = ref(null)
const editMode = ref('add') // 'add' or 'edit'
const editType = ref('system') // 'system', 'station', 'spindle', 'program'
const editForm = ref({})
const parentNode = ref(null)

const typeLabels = {
  system: '系统',
  station: '工位',
  spindle: '主轴',
  program: '程序'
}

const dialogTitle = computed(() => {
  if (!selectedNode.value) return ''
  return `${typeLabels[selectedNode.value.type]} - ${selectedNode.value.name}`
})

// 树形数据配置
const treeProps = {
  children: 'children',
  label: 'label'
}

// 转换Map数据为树形结构
const treeData = computed(() => {
  return mapData.value.systems.map(system => ({
    id: `sys-${system.systemNumber}`,
    label: `${system.systemName} (系统 ${system.systemNumber})`,
    type: 'system',
    number: system.systemNumber,
    name: system.systemName,
    description: system.description,
    controllerType: system.controllerType,
    ipAddress: system.ipAddress,
    path: system.systemName,
    raw: system,
    children: system.stations.map(station => ({
      id: `sys-${system.systemNumber}-st-${station.stationNumber}`,
      label: `${station.stationName} (工位 ${station.stationNumber})`,
      type: 'station',
      number: station.stationNumber,
      name: station.stationName,
      description: station.description,
      path: `${system.systemName} → ${station.stationName}`,
      parent: { type: 'system', number: system.systemNumber },
      raw: station,
      children: station.spindles.map(spindle => ({
        id: `sys-${system.systemNumber}-st-${station.stationNumber}-sp-${spindle.spindleNumber}`,
        label: `${spindle.spindleName} (主轴 ${spindle.spindleNumber})`,
        type: 'spindle',
        number: spindle.spindleNumber,
        name: spindle.spindleName,
        description: spindle.description,
        serialNumber: spindle.serialNumber,
        path: `${system.systemName} → ${station.stationName} → ${spindle.spindleName}`,
        parent: { type: 'station', systemNumber: system.systemNumber, stationNumber: station.stationNumber },
        raw: spindle,
        children: spindle.programs.map(program => ({
          id: `sys-${system.systemNumber}-st-${station.stationNumber}-sp-${spindle.spindleNumber}-pg-${program.programNumber}`,
          label: `${program.programName} (程序 ${program.programNumber})`,
          type: 'program',
          number: program.programNumber,
          name: program.programName,
          description: program.description,
          targetTorque: program.targetTorque,
          targetAngle: program.targetAngle,
          minTorque: program.minTorque,
          maxTorque: program.maxTorque,
          minAngle: program.minAngle,
          maxAngle: program.maxAngle,
          lastModified: program.lastModified,
          path: `${system.systemName} → ${station.stationName} → ${spindle.spindleName} → ${program.programName}`,
          parent: {
            type: 'spindle',
            systemNumber: system.systemNumber,
            stationNumber: station.stationNumber,
            spindleNumber: spindle.spindleNumber
          },
          raw: program
        }))
      }))
    }))
  }))
})

// 加载Map数据
const loadMap = async () => {
  try {
    const response = await fetch('/api/tightening/map')
    const data = await response.json()
    
    if (data.success) {
      mapData.value = data.data
    } else {
      ElMessage.error('加载Map结构失败')
    }
  } catch (error) {
    ElMessage.error('加载Map结构失败: ' + error.message)
  }
}

// 刷新Map
const refreshMap = () => {
  loadMap()
  ElMessage.success('已刷新')
}

// 查看详情
const viewDetails = (data) => {
  selectedNode.value = data
  detailsDialogVisible.value = true
}

// 编辑节点
const editNode = (data) => {
  editMode.value = 'edit'
  editType.value = data.type
  
  editForm.value = {
    number: data.number,
    name: data.name,
    description: data.description,
    ...(data.type === 'system' && {
      controllerType: data.controllerType,
      ipAddress: data.ipAddress
    }),
    ...(data.type === 'spindle' && {
      serialNumber: data.serialNumber
    }),
    ...(data.type === 'program' && {
      targetTorque: data.targetTorque,
      targetAngle: data.targetAngle,
      minTorque: data.minTorque,
      maxTorque: data.maxTorque,
      minAngle: data.minAngle,
      maxAngle: data.maxAngle
    })
  }
  
  parentNode.value = data.parent || null
  editDialogVisible.value = true
}

// 添加子节点
const addChild = (data) => {
  editMode.value = 'add'
  parentNode.value = data
  
  // 确定要添加的子节点类型
  const childTypes = {
    system: 'station',
    station: 'spindle',
    spindle: 'program'
  }
  
  editType.value = childTypes[data.type]
  
  // 重置表单
  editForm.value = {
    number: 1,
    name: '',
    description: '',
    ...(editType.value === 'system' && {
      controllerType: 'PowerFocus 4000',
      ipAddress: ''
    }),
    ...(editType.value === 'spindle' && {
      serialNumber: ''
    }),
    ...(editType.value === 'program' && {
      targetTorque: 35,
      targetAngle: 180,
      minTorque: 30,
      maxTorque: 40,
      minAngle: 170,
      maxAngle: 190
    })
  }
  
  editDialogVisible.value = true
}

// 显示添加对话框
const showAddDialog = (type) => {
  editMode.value = 'add'
  editType.value = type
  parentNode.value = null
  
  editForm.value = {
    number: 1,
    name: '',
    description: '',
    controllerType: 'PowerFocus 4000',
    ipAddress: ''
  }
  
  editDialogVisible.value = true
}

// 保存编辑
const saveEdit = async () => {
  try {
    let apiUrl = ''
    let method = 'POST'
    let requestData = {}

    if (editMode.value === 'add') {
      // 添加模式
      if (editType.value === 'system') {
        apiUrl = '/api/tightening/map/system'
        requestData = {
          systemNumber: editForm.value.number,
          systemName: editForm.value.name,
          description: editForm.value.description,
          controllerType: editForm.value.controllerType,
          ipAddress: editForm.value.ipAddress
        }
      } else if (editType.value === 'station') {
        apiUrl = '/api/tightening/map/station'
        requestData = {
          systemNumber: parentNode.value.number,
          stationNumber: editForm.value.number,
          stationName: editForm.value.name,
          description: editForm.value.description
        }
      } else if (editType.value === 'spindle') {
        apiUrl = '/api/tightening/map/spindle'
        requestData = {
          systemNumber: parentNode.value.parent.number,
          stationNumber: parentNode.value.number,
          spindleNumber: editForm.value.number,
          spindleName: editForm.value.name,
          description: editForm.value.description,
          serialNumber: editForm.value.serialNumber
        }
      } else if (editType.value === 'program') {
        apiUrl = '/api/tightening/map/program'
        requestData = {
          systemNumber: parentNode.value.parent.systemNumber,
          stationNumber: parentNode.value.parent.stationNumber,
          spindleNumber: parentNode.value.number,
          programNumber: editForm.value.number,
          programName: editForm.value.name,
          description: editForm.value.description,
          targetTorque: editForm.value.targetTorque,
          targetAngle: editForm.value.targetAngle,
          minTorque: editForm.value.minTorque,
          maxTorque: editForm.value.maxTorque,
          minAngle: editForm.value.minAngle,
          maxAngle: editForm.value.maxAngle
        }
      }
    } else {
      // 编辑模式
      method = 'PUT'
      if (editType.value === 'system') {
        apiUrl = `/api/tightening/map/system/${editForm.value.number}`
        requestData = {
          systemName: editForm.value.name,
          description: editForm.value.description,
          controllerType: editForm.value.controllerType,
          ipAddress: editForm.value.ipAddress
        }
      } else if (editType.value === 'program') {
        apiUrl = '/api/tightening/map/program'
        requestData = {
          systemNumber: parentNode.value.systemNumber,
          stationNumber: parentNode.value.stationNumber,
          spindleNumber: parentNode.value.spindleNumber,
          programNumber: editForm.value.number,
          programName: editForm.value.name,
          description: editForm.value.description,
          targetTorque: editForm.value.targetTorque,
          targetAngle: editForm.value.targetAngle,
          minTorque: editForm.value.minTorque,
          maxTorque: editForm.value.maxTorque,
          minAngle: editForm.value.minAngle,
          maxAngle: editForm.value.maxAngle
        }
      }
    }

    const response = await fetch(apiUrl, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    })

    const data = await response.json()

    if (data.success) {
      ElMessage.success(editMode.value === 'add' ? '添加成功' : '更新成功')
      editDialogVisible.value = false
      await loadMap()
    } else {
      ElMessage.error(data.message)
    }
  } catch (error) {
    ElMessage.error('操作失败: ' + error.message)
  }
}

// 生命周期
onMounted(() => {
  loadMap()
})
</script>

<style scoped>
.toolsnet-map-viewer {
  padding: 20px;
}

.header-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stats-row {
  margin-top: 16px;
}

.tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.node-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
}

.node-info {
  margin-left: 12px;
}

.node-actions {
  display: flex;
  gap: 4px;
}

:deep(.el-tree-node__content) {
  height: 40px;
}
</style>
