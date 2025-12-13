<template>
  <div class="tool-database">
    <div class="page-header">
      <h2><el-icon><Tools /></el-icon> 工具数据库管理</h2>
      <el-button type="primary" @click="showAddDialog">
        <el-icon><Plus /></el-icon>
        添加工具
      </el-button>
    </div>

    <!-- 搜索和筛选 -->
    <el-card class="filter-card">
      <el-row :gutter="16">
        <el-col :span="8">
          <el-input 
            v-model="toolStore.searchKeyword" 
            placeholder="搜索型号、名称或适用场景"
            clearable
            @clear="toolStore.setSearchKeyword('')">
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </el-col>
        <el-col :span="5">
          <el-select v-model="powerTypeFilter" placeholder="动力形式" clearable @change="handleFilterChange">
            <el-option label="全部" value="" />
            <el-option label="锂电池" value="锂电池" />
            <el-option label="有线电动" value="有线电动" />
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-select v-model="dataCollectionFilter" placeholder="数据采集" clearable @change="handleFilterChange">
            <el-option label="全部" value="" />
            <el-option label="支持" :value="true" />
            <el-option label="不支持" :value="false" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button @click="resetFilters">重置筛选</el-button>
          <el-button type="success" @click="exportData">
            <el-icon><Download /></el-icon>
            导出数据
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 工具列表 -->
    <el-card class="tools-list">
      <el-table :data="toolStore.filteredTools" stripe style="width: 100%">
        <el-table-column prop="model" label="型号" width="150" />
        <el-table-column prop="name" label="名称" width="200" />
        <el-table-column prop="powerType" label="动力形式" width="100" />
        <el-table-column label="扭矩范围" width="120">
          <template #default="{ row }">
            {{ row.torqueRange.min }}-{{ row.torqueRange.max }}{{ row.torqueRange.unit }}
          </template>
        </el-table-column>
        <el-table-column prop="accuracy" label="精度" width="80" />
        <el-table-column label="关键功能" width="180">
          <template #default="{ row }">
            <el-tag v-if="row.features.hasSensor" size="small" type="success">传感器</el-tag>
            <el-tag v-if="row.features.dataCollection" size="small" type="primary">数据采集</el-tag>
            <el-tag v-if="row.features.ledFeedback" size="small">LED反馈</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="转速范围" width="120">
          <template #default="{ row }">
            {{ row.performance.noLoadSpeed.min }}-{{ row.performance.noLoadSpeed.max }}rpm
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格(¥)" width="100" />
        <el-table-column prop="stock" label="库存" width="80" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="viewTool(row)">查看</el-button>
            <el-button size="small" type="primary" @click="editTool(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteTool(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑工具对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="dialogMode === 'add' ? '添加工具' : '编辑工具'"
      width="900px"
      @close="resetForm">
      <el-form :model="toolForm" label-width="120px">
        <el-divider content-position="left">基本信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="型号">
              <el-input v-model="toolForm.model" placeholder="如: ETBP45-10" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="名称">
              <el-input v-model="toolForm.name" placeholder="如: 电池油压脉冲定扭扳手" />
            </el-form-item>
          </el-col>
        </el-row>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="类型">
              <el-select v-model="toolForm.type" placeholder="选择类型">
                <el-option label="普通型号" value="普通型号" />
                <el-option label="高级型号" value="高级型号" />
                <el-option label="专业型号" value="专业型号" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="动力形式">
              <el-select v-model="toolForm.powerType" placeholder="选择动力形式">
                <el-option label="锂电池" value="锂电池" />
                <el-option label="有线电动" value="有线电动" />
                <el-option label="气动" value="气动" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">扭矩参数</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="最小扭矩">
              <el-input-number v-model="toolForm.torqueRange.min" :min="0" :max="1000" />
              <span style="margin-left: 8px;">Nm</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最大扭矩">
              <el-input-number v-model="toolForm.torqueRange.max" :min="0" :max="1000" />
              <span style="margin-left: 8px;">Nm</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="精度">
              <el-input v-model="toolForm.accuracy" placeholder="如: ±10%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">功能特性</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="数据采集">
              <el-switch v-model="toolForm.features.dataCollection" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="过程控制">
              <el-switch v-model="toolForm.features.processControl" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合格反馈">
              <el-switch v-model="toolForm.features.okFeedback" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="有传感器">
              <el-switch v-model="toolForm.features.hasSensor" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="寻牙功能">
              <el-switch v-model="toolForm.features.threadSearch" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="拧紧计数">
              <el-switch v-model="toolForm.features.countingFunction" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="LED反馈">
              <el-switch v-model="toolForm.features.ledFeedback" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="定扭停拧">
              <el-switch v-model="toolForm.features.torqueStop" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="无线通讯">
              <el-select v-model="toolForm.features.wirelessComm" multiple placeholder="选择无线通讯方式">
                <el-option label="蓝牙" value="蓝牙" />
                <el-option label="WIFI" value="WIFI" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="通讯协议">
              <el-select v-model="toolForm.features.commProtocol" multiple placeholder="选择通讯协议">
                <el-option label="TCP/IP" value="TCP/IP" />
                <el-option label="I/O" value="I/O" />
                <el-option label="Openprotocol" value="Openprotocol" />
                <el-option label="RS232" value="RS232" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">性能参数</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="最低转速">
              <el-input-number v-model="toolForm.performance.noLoadSpeed.min" :min="0" :max="10000" />
              <span style="margin-left: 8px;">rpm</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="最高转速">
              <el-input-number v-model="toolForm.performance.noLoadSpeed.max" :min="0" :max="10000" />
              <span style="margin-left: 8px;">rpm</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="反力情况">
              <el-select v-model="toolForm.performance.reactionForce">
                <el-option label="无反力" value="无反力" />
                <el-option label="低反力" value="低反力" />
                <el-option label="中等反力" value="中等反力" />
                <el-option label="高反力" value="高反力" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="重量(kg)">
              <el-input-number v-model="toolForm.performance.weight" :min="0" :max="50" :precision="1" :step="0.1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="电池容量(Ah)" v-if="toolForm.powerType === '锂电池'">
              <el-input-number v-model="toolForm.performance.batteryCapacity" :min="0" :max="20" :precision="1" :step="0.5" />
            </el-form-item>
            <el-form-item label="电缆长度" v-else-if="toolForm.powerType === '有线电动'">
              <el-input v-model="toolForm.performance.powerCable" placeholder="如: 5米" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">其他信息</el-divider>
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="价格(¥)">
              <el-input-number v-model="toolForm.price" :min="0" :max="1000000" :step="100" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="库存">
              <el-input-number v-model="toolForm.stock" :min="0" :max="1000" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌">
              <el-input v-model="toolForm.brand" placeholder="品牌名称" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="适用场景">
          <el-select v-model="toolForm.suitableFor" multiple placeholder="选择适用场景" style="width: 100%">
            <el-option label="门盖工位" value="门盖工位" />
            <el-option label="底盘工位" value="底盘工位" />
            <el-option label="内饰工位" value="内饰工位" />
            <el-option label="发动机工位" value="发动机工位" />
            <el-option label="固定工位" value="固定工位" />
            <el-option label="手持操作" value="手持操作" />
            <el-option label="关键螺栓" value="关键螺栓" />
            <el-option label="轻量级装配" value="轻量级装配" />
            <el-option label="重载装配" value="重载装配" />
          </el-select>
        </el-form-item>

        <el-form-item label="图片URL">
          <el-input v-model="toolForm.image" placeholder="工具图片链接" />
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="toolForm.notes" type="textarea" :rows="3" placeholder="工具使用备注和说明" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveTool">保存</el-button>
      </template>
    </el-dialog>

    <!-- 查看工具详情对话框 -->
    <el-dialog v-model="viewDialogVisible" title="工具详情" width="700px">
      <div v-if="currentTool" class="tool-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="型号">{{ currentTool.model }}</el-descriptions-item>
          <el-descriptions-item label="名称">{{ currentTool.name }}</el-descriptions-item>
          <el-descriptions-item label="类型">{{ currentTool.type }}</el-descriptions-item>
          <el-descriptions-item label="动力形式">{{ currentTool.powerType }}</el-descriptions-item>
          <el-descriptions-item label="扭矩范围">
            {{ currentTool.torqueRange.min }}-{{ currentTool.torqueRange.max }}{{ currentTool.torqueRange.unit }}
          </el-descriptions-item>
          <el-descriptions-item label="精度">{{ currentTool.accuracy }}</el-descriptions-item>
          <el-descriptions-item label="转速范围">
            {{ currentTool.performance.noLoadSpeed.min }}-{{ currentTool.performance.noLoadSpeed.max }}rpm
          </el-descriptions-item>
          <el-descriptions-item label="反力">{{ currentTool.performance.reactionForce }}</el-descriptions-item>
          <el-descriptions-item label="重量">{{ currentTool.performance.weight }}kg</el-descriptions-item>
          <el-descriptions-item label="价格">¥{{ currentTool.price }}</el-descriptions-item>
          <el-descriptions-item label="库存">{{ currentTool.stock }}</el-descriptions-item>
          <el-descriptions-item label="品牌">{{ currentTool.brand }}</el-descriptions-item>
        </el-descriptions>

        <el-divider content-position="left">功能特性</el-divider>
        <div class="features-grid">
          <el-tag v-if="currentTool.features.dataCollection" type="success">数据采集</el-tag>
          <el-tag v-if="currentTool.features.processControl" type="success">过程控制</el-tag>
          <el-tag v-if="currentTool.features.okFeedback" type="success">合格反馈</el-tag>
          <el-tag v-if="currentTool.features.hasSensor" type="primary">传感器</el-tag>
          <el-tag v-if="currentTool.features.threadSearch">寻牙功能</el-tag>
          <el-tag v-if="currentTool.features.countingFunction">拧紧计数</el-tag>
          <el-tag v-if="currentTool.features.ledFeedback">LED反馈</el-tag>
          <el-tag v-if="currentTool.features.torqueStop">定扭停拧</el-tag>
          <el-tag v-for="comm in currentTool.features.wirelessComm" :key="comm" type="warning">{{ comm }}</el-tag>
          <el-tag v-for="protocol in currentTool.features.commProtocol" :key="protocol" type="info">{{ protocol }}</el-tag>
        </div>

        <el-divider content-position="left">适用场景</el-divider>
        <div class="suitable-tags">
          <el-tag v-for="scene in currentTool.suitableFor" :key="scene" type="info">{{ scene }}</el-tag>
        </div>

        <el-divider content-position="left">备注</el-divider>
        <p>{{ currentTool.notes }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useToolDatabaseStore } from '../../store/toolDatabase'
import { ElMessage, ElMessageBox } from 'element-plus'

const toolStore = useToolDatabaseStore()

// 对话框控制
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const dialogMode = ref('add') // 'add' or 'edit'
const currentTool = ref(null)

// 筛选条件
const powerTypeFilter = ref('')
const dataCollectionFilter = ref('')

// 工具表单
const toolForm = reactive({
  model: '',
  name: '',
  type: '普通型号',
  powerType: '锂电池',
  torqueRange: { min: 0, max: 100, unit: 'Nm' },
  accuracy: '±10%',
  features: {
    dataCollection: false,
    processControl: false,
    okFeedback: false,
    hasSensor: false,
    threadSearch: true,
    countingFunction: true,
    ledFeedback: true,
    torqueStop: true,
    wirelessComm: [],
    commProtocol: []
  },
  performance: {
    noLoadSpeed: { min: 3000, max: 4000, unit: 'rpm' },
    reactionForce: '无反力',
    weight: 1.8,
    batteryCapacity: 4.0
  },
  suitableFor: [],
  price: 10000,
  stock: 10,
  brand: '明升伟业',
  origin: '德国技术',
  image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400',
  notes: ''
})

// 显示添加对话框
const showAddDialog = () => {
  dialogMode.value = 'add'
  resetForm()
  dialogVisible.value = true
}

// 查看工具
const viewTool = (tool) => {
  currentTool.value = tool
  viewDialogVisible.value = true
}

// 编辑工具
const editTool = (tool) => {
  dialogMode.value = 'edit'
  currentTool.value = tool
  Object.assign(toolForm, JSON.parse(JSON.stringify(tool)))
  dialogVisible.value = true
}

// 删除工具
const deleteTool = (tool) => {
  ElMessageBox.confirm(
    `确定要删除工具 "${tool.model} - ${tool.name}" 吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    toolStore.deleteTool(tool.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 保存工具
const saveTool = () => {
  if (!toolForm.model || !toolForm.name) {
    ElMessage.warning('请填写型号和名称')
    return
  }

  if (dialogMode.value === 'add') {
    toolStore.addTool({ ...toolForm })
    ElMessage.success('添加成功')
  } else {
    toolStore.updateTool(currentTool.value.id, { ...toolForm })
    ElMessage.success('更新成功')
  }
  
  dialogVisible.value = false
  resetForm()
}

// 重置表单
const resetForm = () => {
  Object.assign(toolForm, {
    model: '',
    name: '',
    type: '普通型号',
    powerType: '锂电池',
    torqueRange: { min: 0, max: 100, unit: 'Nm' },
    accuracy: '±10%',
    features: {
      dataCollection: false,
      processControl: false,
      okFeedback: false,
      hasSensor: false,
      threadSearch: true,
      countingFunction: true,
      ledFeedback: true,
      torqueStop: true
    },
    performance: {
      noLoadSpeed: { min: 3000, max: 4000, unit: 'rpm' },
      reactionForce: '无反力',
      weight: 1.8,
      batteryCapacity: 4.0
    },
    suitableFor: [],
    price: 10000,
    stock: 10,
    brand: '明升伟业',
    origin: '德国技术',
    image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400',
    notes: ''
  })
}

// 处理筛选变化
const handleFilterChange = () => {
  toolStore.setFilters({
    powerType: powerTypeFilter.value,
    hasDataCollection: dataCollectionFilter.value
  })
}

// 重置筛选
const resetFilters = () => {
  powerTypeFilter.value = ''
  dataCollectionFilter.value = ''
  toolStore.resetFilters()
}

// 导出数据
const exportData = () => {
  const dataStr = JSON.stringify(toolStore.tools, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `tool-database-${new Date().getTime()}.json`
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success('数据导出成功')
}
</script>

<style scoped>
.tool-database {
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h2 {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.filter-card {
  margin-bottom: 20px;
}

.tools-list {
  margin-bottom: 20px;
}

.tool-detail {
  padding: 20px 0;
}

.features-grid,
.suitable-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}
</style>
