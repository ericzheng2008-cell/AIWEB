<template>
  <div class="ai-agent-manage">
    <div class="page-header">
      <h2>AI智能体管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新增智能体
      </el-button>
    </div>

    <!-- 智能体列表 -->
    <el-table :data="agents" border stripe>
      <el-table-column label="排序" width="80" align="center">
        <template #default="{ row }">
          <el-input-number v-model="row.order" :min="1" size="small" @change="handleOrderChange" />
        </template>
      </el-table-column>
      
      <el-table-column label="图标" width="100" align="center">
        <template #default="{ row }">
          <el-icon :size="32" :style="{ color: row.iconColor }">
            <component :is="row.icon" />
          </el-icon>
        </template>
      </el-table-column>
      
      <el-table-column label="标题" prop="title" width="200" />
      
      <el-table-column label="描述" prop="description" show-overflow-tooltip />
      
      <el-table-column label="路由" prop="path" width="180" />
      
      <el-table-column label="状态标签" width="120" align="center">
        <template #default="{ row }">
          <el-tag v-if="row.badge" :type="row.badgeType">{{ row.badge }}</el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      
      <el-table-column label="高亮显示" width="100" align="center">
        <template #default="{ row }">
          <el-switch v-model="row.highlight" @change="handleSave" />
        </template>
      </el-table-column>
      
      <el-table-column label="可见" width="80" align="center">
        <template #default="{ row }">
          <el-switch v-model="row.visible" @change="handleSave" />
        </template>
      </el-table-column>
      
      <el-table-column label="操作" width="150" align="center" fixed="right">
        <template #default="{ row }">
          <el-button size="small" type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="dialogTitle"
      width="700px"
      @close="handleDialogClose">
      <el-form :model="currentAgent" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="currentAgent.title" placeholder="智能体名称" />
        </el-form-item>
        
        <el-form-item label="英文标题" prop="titleEn">
          <el-input v-model="currentAgent.titleEn" placeholder="Agent Title (English)" />
        </el-form-item>
        
        <el-form-item label="描述" prop="description">
          <el-input 
            v-model="currentAgent.description" 
            type="textarea" 
            :rows="3"
            placeholder="智能体描述..." />
        </el-form-item>
        
        <el-form-item label="英文描述" prop="descriptionEn">
          <el-input 
            v-model="currentAgent.descriptionEn" 
            type="textarea" 
            :rows="3"
            placeholder="Agent Description (English)..." />
        </el-form-item>
        
        <el-form-item label="路由路径" prop="path">
          <el-input v-model="currentAgent.path" placeholder="/agent-path" />
        </el-form-item>
        
        <el-form-item label="图标" prop="icon">
          <el-select v-model="currentAgent.icon" placeholder="选择图标">
            <el-option label="工具 (Tools)" value="Tools" />
            <el-option label="监控 (Monitoring)" value="Monitoring" />
            <el-option label="刷新 (Refresh)" value="Refresh" />
            <el-option label="列表 (List)" value="List" />
            <el-option label="图表 (TrendCharts)" value="TrendCharts" />
            <el-option label="数据分析 (DataAnalysis)" value="DataAnalysis" />
            <el-option label="阅读 (Reading)" value="Reading" />
            <el-option label="设置 (Setting)" value="Setting" />
            <el-option label="星星 (Star)" value="Star" />
            <el-option label="文档 (Document)" value="Document" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="图标颜色" prop="iconColor">
          <el-color-picker v-model="currentAgent.iconColor" show-alpha />
        </el-form-item>
        
        <el-form-item label="特性标签">
          <el-tag
            v-for="(tag, index) in currentAgent.features"
            :key="index"
            closable
            @close="removeFeature(index)"
            style="margin-right: 8px">
            {{ tag }}
          </el-tag>
          <el-input
            v-if="featureInputVisible"
            ref="featureInputRef"
            v-model="featureInputValue"
            size="small"
            style="width: 100px"
            @keyup.enter="handleFeatureConfirm"
            @blur="handleFeatureConfirm" />
          <el-button v-else size="small" @click="showFeatureInput">+ 添加特性</el-button>
        </el-form-item>
        
        <el-form-item label="统计数据1">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-input v-model="currentAgent.stat1Value" placeholder="数值" />
            </el-col>
            <el-col :span="12">
              <el-input v-model="currentAgent.stat1Label" placeholder="标签" />
            </el-col>
          </el-row>
        </el-form-item>
        
        <el-form-item label="统计数据2">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-input v-model="currentAgent.stat2Value" placeholder="数值" />
            </el-col>
            <el-col :span="12">
              <el-input v-model="currentAgent.stat2Label" placeholder="标签" />
            </el-col>
          </el-row>
        </el-form-item>
        
        <el-form-item label="状态标签">
          <el-input v-model="currentAgent.badge" placeholder="如: 新功能" style="width: 150px" />
          <el-select v-model="currentAgent.badgeType" placeholder="标签类型" style="width: 120px; margin-left: 10px">
            <el-option label="成功" value="success" />
            <el-option label="警告" value="warning" />
            <el-option label="危险" value="danger" />
            <el-option label="信息" value="info" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="高亮显示" prop="highlight">
          <el-switch v-model="currentAgent.highlight" />
          <span style="margin-left: 10px; color: #999; font-size: 12px">启用后卡片将显示高亮背景</span>
        </el-form-item>
        
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="currentAgent.order" :min="1" />
        </el-form-item>
        
        <el-form-item label="可见" prop="visible">
          <el-switch v-model="currentAgent.visible" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 默认的8个智能体配置
const defaultAgents = [
  {
    id: 1,
    title: '拧紧工具选型智能体',
    titleEn: 'Tool Selection Agent',
    description: '智能工具推荐系统，基于工艺需求匹配最佳工具',
    descriptionEn: 'Intelligent tool recommendation system',
    path: '/tool-selector',
    icon: 'Tools',
    iconColor: '#667eea',
    features: ['智能匹配', '多品牌工具', '参数对比'],
    stat1Value: '500+',
    stat1Label: '工具型号',
    stat2Value: '95%',
    stat2Label: '匹配准确率',
    badge: '',
    badgeType: 'success',
    highlight: false,
    order: 1,
    visible: true
  },
  {
    id: 2,
    title: '数字监控驾驶舱',
    titleEn: 'Digital Dashboard',
    description: '实时设备状态监控、多角色权限视图、维护流程可视化',
    descriptionEn: 'Real-time equipment monitoring dashboard',
    path: '/equipment-dashboard',
    icon: 'Monitoring',
    iconColor: '#667eea',
    features: ['实时监控', '多角色视图', '流程可视化'],
    stat1Value: '100+',
    stat1Label: '监控设备',
    stat2Value: '实时',
    stat2Label: '数据更新',
    badge: '',
    badgeType: 'success',
    highlight: false,
    order: 2,
    visible: true
  },
  {
    id: 3,
    title: '设备全生命周期管理',
    titleEn: 'Lifecycle Management',
    description: '设备资产档案管理、ROI投资回报分析、AI智能保养预测',
    descriptionEn: 'Complete equipment lifecycle management',
    path: '/equipment-lifecycle',
    icon: 'Refresh',
    iconColor: '#667eea',
    features: ['设备档案', 'ROI分析', 'AI保养预测'],
    stat1Value: '6大类',
    stat1Label: '关键设备',
    stat2Value: '30%↓',
    stat2Label: '降本空间',
    badge: '',
    badgeType: 'success',
    highlight: false,
    order: 3,
    visible: true
  },
  {
    id: 4,
    title: '故障工单管理',
    titleEn: 'Work Order Management',
    description: '全流程工单管理系统，从创建到追踪到完成',
    descriptionEn: 'Complete work order management system',
    path: '/fault-tracking',
    icon: 'List',
    iconColor: '#667eea',
    features: ['工单创建', '进度追踪', '历史记录'],
    stat1Value: '2小时',
    stat1Label: '平均响应',
    stat2Value: '95%',
    stat2Label: '按时完成率',
    badge: '',
    badgeType: 'success',
    highlight: false,
    order: 4,
    visible: true
  },
  {
    id: 5,
    title: '拧紧曲线对比分析',
    titleEn: 'Curve Analysis',
    description: '专业的拧紧曲线分析工具，支持多曲线对比、智能诊断',
    descriptionEn: 'Professional tightening curve analysis tool',
    path: '/curve-analysis',
    icon: 'TrendCharts',
    iconColor: '#667eea',
    features: ['曲线对比', 'AI诊断', '工艺建议'],
    stat1Value: '92%',
    stat1Label: '诊断准确率',
    stat2Value: '5秒',
    stat2Label: '分析速度',
    badge: '',
    badgeType: 'success',
    highlight: false,
    order: 5,
    visible: true
  },
  {
    id: 6,
    title: '拧紧数据采集分析',
    titleEn: 'Torque Data Analytics',
    description: '基于Open Protocol协议，实时采集PF4000/PF8000控制器数据',
    descriptionEn: 'Real-time torque data collection and analysis',
    path: '/tightening-data',
    icon: 'DataAnalysis',
    iconColor: '#ff6b6b',
    features: ['Open Protocol', 'Cpk分析', '智能报警'],
    stat1Value: '10000',
    stat1Label: '数据容量',
    stat2Value: '实时',
    stat2Label: '数据采集',
    badge: '新功能',
    badgeType: 'danger',
    highlight: false,
    order: 6,
    visible: true
  },
  {
    id: 7,
    title: '产品技术销售小课堂',
    titleEn: 'Product Tech Training',
    description: '拧紧工具产品技术知识库，涵盖产品介绍、技术规格、应用案例',
    descriptionEn: 'Product knowledge base and technical training',
    path: '/tech-classroom',
    icon: 'Reading',
    iconColor: '#667eea',
    features: ['产品知识', '技术规格', '应用案例'],
    stat1Value: '100+',
    stat1Label: '知识条目',
    stat2Value: '24/7',
    stat2Label: '在线学习',
    badge: '',
    badgeType: 'success',
    highlight: false,
    order: 7,
    visible: true
  },
  {
    id: 8,
    title: '拧紧工艺改进与验证',
    titleEn: 'Process Optimization',
    description: '基于PSE拧紧程序的智能工艺分析与参数推荐系统',
    descriptionEn: 'PSE-based process optimization and verification',
    path: '/process-verification',
    icon: 'Setting',
    iconColor: '#52c41a',
    features: ['PSE参数推荐', '多策略分析', '数据库管理'],
    stat1Value: '3种',
    stat1Label: '控制策略',
    stat2Value: '95%',
    stat2Label: '推荐准确率',
    badge: '新功能',
    badgeType: 'success',
    highlight: true,
    order: 8,
    visible: true
  }
]

const agents = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('')
const currentAgent = reactive({})
const formRef = ref()
const featureInputVisible = ref(false)
const featureInputValue = ref('')
const featureInputRef = ref()

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
  path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
  icon: [{ required: true, message: '请选择图标', trigger: 'change' }]
}

// 加载数据
const loadData = () => {
  const saved = localStorage.getItem('aiAgentsConfig')
  if (saved) {
    agents.value = JSON.parse(saved)
  } else {
    agents.value = [...defaultAgents]
    saveData()
  }
}

// 保存数据
const saveData = () => {
  localStorage.setItem('aiAgentsConfig', JSON.stringify(agents.value))
  ElMessage.success('保存成功')
}

// 处理排序变化
const handleOrderChange = () => {
  agents.value.sort((a, b) => a.order - b.order)
  saveData()
}

// 新增
const handleAdd = () => {
  dialogTitle.value = '新增智能体'
  Object.assign(currentAgent, {
    id: Date.now(),
    title: '',
    titleEn: '',
    description: '',
    descriptionEn: '',
    path: '',
    icon: 'Tools',
    iconColor: '#667eea',
    features: [],
    stat1Value: '',
    stat1Label: '',
    stat2Value: '',
    stat2Label: '',
    badge: '',
    badgeType: 'success',
    highlight: false,
    order: agents.value.length + 1,
    visible: true
  })
  dialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  dialogTitle.value = '编辑智能体'
  Object.assign(currentAgent, { ...row })
  dialogVisible.value = true
}

// 删除
const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除"${row.title}"吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = agents.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      agents.value.splice(index, 1)
      saveData()
    }
  }).catch(() => {})
}

// 提交
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const index = agents.value.findIndex(item => item.id === currentAgent.id)
      if (index !== -1) {
        agents.value[index] = { ...currentAgent }
      } else {
        agents.value.push({ ...currentAgent })
      }
      agents.value.sort((a, b) => a.order - b.order)
      saveData()
      dialogVisible.value = false
    }
  })
}

// 关闭对话框
const handleDialogClose = () => {
  formRef.value?.resetFields()
}

// 保存开关状态
const handleSave = () => {
  saveData()
}

// 特性标签管理
const removeFeature = (index) => {
  currentAgent.features.splice(index, 1)
}

const showFeatureInput = () => {
  featureInputVisible.value = true
  nextTick(() => {
    featureInputRef.value?.focus()
  })
}

const handleFeatureConfirm = () => {
  if (featureInputValue.value) {
    if (!currentAgent.features) {
      currentAgent.features = []
    }
    currentAgent.features.push(featureInputValue.value)
    featureInputValue.value = ''
  }
  featureInputVisible.value = false
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.ai-agent-manage {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}
</style>
