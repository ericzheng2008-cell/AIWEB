<template>
  <div class="equipment-lifecycle">
    <Header />
    
    <div class="page-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1><el-icon><Box /></el-icon> 设备全生命周期管理</h1>
        <p class="subtitle">关键设备资产管理 · ROI分析 · 保养预测 · 成本优化</p>
      </div>

      <!-- 核心指标卡片 -->
      <div class="kpi-cards">
        <div class="kpi-card">
          <div class="kpi-icon" style="background: linear-gradient(135deg, #1890ff, #36cfc9);">
            <el-icon :size="32"><Box /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ equipmentStore.equipmentAssets.length }}</div>
            <div class="kpi-label">设备总数</div>
          </div>
        </div>
        
        <div class="kpi-card">
          <div class="kpi-icon" style="background: linear-gradient(135deg, #52c41a, #73d13d);">
            <el-icon :size="32"><Money /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">¥{{ (equipmentStore.getTotalAssetValue / 10000).toFixed(0) }}万</div>
            <div class="kpi-label">资产总价值</div>
          </div>
        </div>
        
        <div class="kpi-card">
          <div class="kpi-icon" style="background: linear-gradient(135deg, #faad14, #ffc53d);">
            <el-icon :size="32"><Warning /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ equipmentStore.getMaintenanceDueEquipment.length }}</div>
            <div class="kpi-label">待保养设备</div>
          </div>
        </div>
        
        <div class="kpi-card">
          <div class="kpi-icon" style="background: linear-gradient(135deg, #f5222d, #ff4d4f);">
            <el-icon :size="32"><CircleClose /></el-icon>
          </div>
          <div class="kpi-content">
            <div class="kpi-value">{{ equipmentStore.getFaultyEquipment.length }}</div>
            <div class="kpi-label">故障设备</div>
          </div>
        </div>
      </div>

      <!-- 功能选项卡 -->
      <el-tabs v-model="activeTab" class="feature-tabs">
        <!-- 设备档案 -->
        <el-tab-pane label="设备档案" name="assets">
          <div class="tab-content">
            <div class="toolbar">
              <el-button type="primary" @click="showAddEquipmentDialog = true">
                <el-icon><Plus /></el-icon> 新增设备
              </el-button>
              <el-button @click="showImportDialog = true">
                <el-icon><Upload /></el-icon> 批量导入
              </el-button>
              <div class="filter-group">
                <el-select v-model="filterCategory" placeholder="设备类别" clearable style="width: 160px;">
                  <el-option 
                    v-for="cat in equipmentStore.getAllCategories" 
                    :key="cat.id" 
                    :label="cat.name['zh-CN']" 
                    :value="cat.id" />
                </el-select>
                <el-select v-model="filterStatus" placeholder="运行状态" clearable style="width: 140px;">
                  <el-option label="运行中" value="running" />
                  <el-option label="维护中" value="maintenance" />
                  <el-option label="故障" value="fault" />
                  <el-option label="闲置" value="idle" />
                </el-select>
                <el-input 
                  v-model="searchKeyword" 
                  placeholder="搜索设备名称/编号" 
                  clearable 
                  style="width: 200px;">
                  <template #prefix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
              </div>
            </div>

            <div class="equipment-grid">
              <div 
                v-for="equipment in filteredEquipment" 
                :key="equipment.id" 
                class="equipment-card"
                @click="viewEquipmentDetail(equipment)">
                <div class="equipment-header">
                  <div class="equipment-category">
                    <el-icon :style="{color: equipmentStore.equipmentCategories[equipment.category]?.color}">
                      <component :is="equipmentStore.equipmentCategories[equipment.category]?.icon" />
                    </el-icon>
                    <span>{{ equipmentStore.equipmentCategories[equipment.category]?.name['zh-CN'] }}</span>
                  </div>
                  <el-tag 
                    :type="getStatusType(equipment.status)" 
                    size="small">
                    {{ getStatusText(equipment.status) }}
                  </el-tag>
                </div>
                
                <h3 class="equipment-name">{{ equipment.name }}</h3>
                <div class="equipment-info">
                  <div class="info-item">
                    <span class="label">型号:</span>
                    <span class="value">{{ equipment.model }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">位置:</span>
                    <span class="value">{{ equipment.location }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">购买日期:</span>
                    <span class="value">{{ equipment.purchaseDate }}</span>
                  </div>
                </div>

                <div class="equipment-health">
                  <div class="health-label">设备健康度</div>
                  <el-progress 
                    :percentage="equipmentStore.getEquipmentHealth(equipment.id)" 
                    :color="getHealthColor(equipmentStore.getEquipmentHealth(equipment.id))"
                    :stroke-width="8" />
                </div>

                <div class="equipment-stats">
                  <div class="stat-item">
                    <div class="stat-value">{{ equipment.utilizationRate }}%</div>
                    <div class="stat-label">使用率</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">{{ (equipment.workingHours / 1000).toFixed(1) }}K</div>
                    <div class="stat-label">运行小时</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">{{ equipment.components.length }}</div>
                    <div class="stat-label">关键部件</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- ROI分析 -->
        <el-tab-pane label="ROI分析" name="roi">
          <div class="tab-content">
            <div class="roi-analysis">
              <el-table :data="roiTableData" style="width: 100%">
                <el-table-column prop="equipmentName" label="设备名称" min-width="150" />
                <el-table-column prop="purchasePrice" label="购买价格(¥)" width="120" align="right">
                  <template #default="scope">
                    {{ scope.row.purchasePrice.toLocaleString() }}
                  </template>
                </el-table-column>
                <el-table-column prop="age" label="使用年限" width="100" align="center" />
                <el-table-column prop="currentValue" label="当前价值(¥)" width="120" align="right">
                  <template #default="scope">
                    {{ Math.round(scope.row.currentValue).toLocaleString() }}
                  </template>
                </el-table-column>
                <el-table-column prop="totalMaintenanceCost" label="维护成本(¥)" width="120" align="right">
                  <template #default="scope">
                    {{ scope.row.totalMaintenanceCost.toLocaleString() }}
                  </template>
                </el-table-column>
                <el-table-column prop="annualRevenue" label="年产值(¥)" width="120" align="right">
                  <template #default="scope">
                    {{ Math.round(scope.row.annualRevenue).toLocaleString() }}
                  </template>
                </el-table-column>
                <el-table-column prop="roi" label="ROI(%)" width="100" align="center">
                  <template #default="scope">
                    <el-tag :type="getRoiType(scope.row.roi)" size="small">
                      {{ scope.row.roi }}%
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="paybackPeriod" label="回本期(年)" width="110" align="center" />
                <el-table-column label="操作" width="120" fixed="right">
                  <template #default="scope">
                    <el-button link type="primary" size="small" @click="viewRoiDetail(scope.row)">
                      详情
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>

        <!-- 保养预测 -->
        <el-tab-pane label="保养预测" name="maintenance">
          <div class="tab-content">
            <div class="maintenance-predictions">
              <el-alert 
                v-if="urgentMaintenanceCount > 0"
                :title="`有 ${urgentMaintenanceCount} 个部件需要紧急保养！`"
                type="error"
                :closable="false"
                show-icon
                style="margin-bottom: 20px;" />
              
              <el-table :data="allMaintenancePredictions" style="width: 100%">
                <el-table-column prop="urgency" label="紧急程度" width="100">
                  <template #default="scope">
                    <el-tag :type="getUrgencyType(scope.row.urgency)" size="small">
                      {{ getUrgencyText(scope.row.urgency) }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="equipmentName" label="设备名称" min-width="150" />
                <el-table-column prop="componentName" label="部件名称" min-width="150" />
                <el-table-column prop="condition" label="当前状况" width="120">
                  <template #default="scope">
                    <el-progress 
                      :percentage="scope.row.condition" 
                      :color="getHealthColor(scope.row.condition)"
                      :stroke-width="6"
                      :show-text="true" />
                  </template>
                </el-table-column>
                <el-table-column prop="predictedRisk" label="风险评分" width="100" align="center">
                  <template #default="scope">
                    <span :style="{color: getRiskColor(scope.row.predictedRisk), fontWeight: 'bold'}">
                      {{ scope.row.predictedRisk }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="nextMaintenance" label="计划保养日期" width="130" align="center" />
                <el-table-column prop="daysUntilMaintenance" label="剩余天数" width="100" align="center">
                  <template #default="scope">
                    <span :style="{color: scope.row.daysUntilMaintenance < 30 ? '#f5222d' : '#52c41a'}">
                      {{ scope.row.daysUntilMaintenance }}天
                    </span>
                  </template>
                </el-table-column>
                <el-table-column prop="estimatedCost" label="预估成本(¥)" width="120" align="right">
                  <template #default="scope">
                    {{ Math.round(scope.row.estimatedCost).toLocaleString() }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="160" fixed="right">
                  <template #default="scope">
                    <el-button link type="primary" size="small" @click="createMaintenanceWorkOrder(scope.row)">
                      创建工单
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>

        <!-- 成本分析 -->
        <el-tab-pane label="成本分析" name="cost">
          <div class="tab-content">
            <div class="cost-analysis">
              <div class="cost-overview-grid">
                <div 
                  v-for="equipment in equipmentStore.equipmentAssets" 
                  :key="equipment.id"
                  class="cost-card">
                  <h3>{{ equipment.name }}</h3>
                  <div class="cost-summary" v-if="getCostAnalysis(equipment.id)">
                    <div class="cost-item">
                      <span class="label">12个月总成本:</span>
                      <span class="value">¥{{ getCostAnalysis(equipment.id).totalCost.toLocaleString() }}</span>
                    </div>
                    <div class="cost-item">
                      <span class="label">月均成本:</span>
                      <span class="value">¥{{ Math.round(getCostAnalysis(equipment.id).monthlyAverage).toLocaleString() }}</span>
                    </div>
                    
                    <div class="cost-breakdown">
                      <div class="breakdown-item">
                        <span class="label">备件:</span>
                        <el-progress 
                          :percentage="parseFloat(getCostAnalysis(equipment.id).costBreakdown.parts)" 
                          color="#1890ff"
                          :stroke-width="6">
                          <span class="percentage-text">{{ getCostAnalysis(equipment.id).costBreakdown.parts }}%</span>
                        </el-progress>
                      </div>
                      <div class="breakdown-item">
                        <span class="label">人工:</span>
                        <el-progress 
                          :percentage="parseFloat(getCostAnalysis(equipment.id).costBreakdown.labor)" 
                          color="#52c41a"
                          :stroke-width="6">
                          <span class="percentage-text">{{ getCostAnalysis(equipment.id).costBreakdown.labor }}%</span>
                        </el-progress>
                      </div>
                      <div class="breakdown-item">
                        <span class="label">保养:</span>
                        <el-progress 
                          :percentage="parseFloat(getCostAnalysis(equipment.id).costBreakdown.maintenance)" 
                          color="#faad14"
                          :stroke-width="6">
                          <span class="percentage-text">{{ getCostAnalysis(equipment.id).costBreakdown.maintenance }}%</span>
                        </el-progress>
                      </div>
                      <div class="breakdown-item">
                        <span class="label">维修:</span>
                        <el-progress 
                          :percentage="parseFloat(getCostAnalysis(equipment.id).costBreakdown.repair)" 
                          color="#f5222d"
                          :stroke-width="6">
                          <span class="percentage-text">{{ getCostAnalysis(equipment.id).costBreakdown.repair }}%</span>
                        </el-progress>
                      </div>
                    </div>
                  </div>
                  <el-button type="primary" text @click="viewCostDetail(equipment.id)">
                    查看详情 <el-icon class="el-icon--right"><ArrowRight /></el-icon>
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <!-- 设备分类 -->
        <el-tab-pane label="设备分类" name="categories">
          <div class="tab-content">
            <div class="categories-grid">
              <div 
                v-for="category in equipmentStore.getAllCategories" 
                :key="category.id"
                class="category-card">
                <div class="category-header" :style="{background: category.color}">
                  <el-icon :size="48"><component :is="category.icon" /></el-icon>
                  <h3>{{ category.name['zh-CN'] }}</h3>
                </div>
                <div class="category-body">
                  <div class="components-list">
                    <div class="component-item" v-for="comp in category.components" :key="comp.id">
                      <div class="comp-name">{{ comp.name['zh-CN'] }}</div>
                      <div class="comp-info">
                        <el-tag size="small" type="info">
                          平均成本: ¥{{ comp.avgCost.toLocaleString() }}
                        </el-tag>
                        <el-tag size="small" type="warning">
                          寿命: {{ comp.lifecycle }}个月
                        </el-tag>
                        <el-tag size="small">
                          保养周期: {{ comp.maintenanceCycle }}个月
                        </el-tag>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- 新增设备对话框 -->
    <el-dialog 
      v-model="showAddEquipmentDialog" 
      title="新增设备" 
      width="600px">
      <el-form :model="newEquipment" label-width="120px">
        <el-form-item label="设备名称" required>
          <el-input v-model="newEquipment.name" placeholder="请输入设备名称" />
        </el-form-item>
        <el-form-item label="设备类别" required>
          <el-select v-model="newEquipment.category" placeholder="请选择设备类别" style="width: 100%">
            <el-option 
              v-for="cat in equipmentStore.getAllCategories" 
              :key="cat.id" 
              :label="cat.name['zh-CN']" 
              :value="cat.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="型号">
          <el-input v-model="newEquipment.model" placeholder="请输入设备型号" />
        </el-form-item>
        <el-form-item label="序列号">
          <el-input v-model="newEquipment.serialNumber" placeholder="请输入序列号" />
        </el-form-item>
        <el-form-item label="制造商">
          <el-input v-model="newEquipment.manufacturer" placeholder="请输入制造商" />
        </el-form-item>
        <el-form-item label="购买日期">
          <el-date-picker 
            v-model="newEquipment.purchaseDate" 
            type="date" 
            placeholder="选择购买日期"
            style="width: 100%" />
        </el-form-item>
        <el-form-item label="购买价格(¥)">
          <el-input-number v-model="newEquipment.purchasePrice" :min="0" :step="1000" style="width: 100%" />
        </el-form-item>
        <el-form-item label="安装位置">
          <el-input v-model="newEquipment.location" placeholder="请输入安装位置" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showAddEquipmentDialog = false">取消</el-button>
        <el-button type="primary" @click="addEquipment">确定</el-button>
      </template>
    </el-dialog>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useEquipmentLifecycleStore } from '../store/equipmentLifecycle'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

const router = useRouter()
const equipmentStore = useEquipmentLifecycleStore()

// 当前激活的选项卡
const activeTab = ref('assets')

// 筛选条件
const filterCategory = ref('')
const filterStatus = ref('')
const searchKeyword = ref('')

// 新增设备对话框
const showAddEquipmentDialog = ref(false)
const showImportDialog = ref(false)

// 新设备表单
const newEquipment = ref({
  name: '',
  category: '',
  model: '',
  serialNumber: '',
  manufacturer: '',
  purchaseDate: '',
  purchasePrice: 0,
  location: '',
  status: 'running',
  workingHours: 0,
  utilizationRate: 0,
  components: []
})

// 过滤后的设备
const filteredEquipment = computed(() => {
  let result = equipmentStore.equipmentAssets

  if (filterCategory.value) {
    result = result.filter(eq => eq.category === filterCategory.value)
  }

  if (filterStatus.value) {
    result = result.filter(eq => eq.status === filterStatus.value)
  }

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(eq => 
      eq.name.toLowerCase().includes(keyword) || 
      eq.id.toLowerCase().includes(keyword) ||
      eq.serialNumber?.toLowerCase().includes(keyword)
    )
  }

  return result
})

// ROI表格数据
const roiTableData = computed(() => {
  return equipmentStore.equipmentAssets.map(eq => {
    const roi = equipmentStore.calculateROI(eq.id)
    return {
      equipmentId: eq.id,
      equipmentName: eq.name,
      ...roi
    }
  })
})

// 所有保养预测
const allMaintenancePredictions = computed(() => {
  const predictions = []
  equipmentStore.equipmentAssets.forEach(eq => {
    const eqPredictions = equipmentStore.predictMaintenance(eq.id)
    predictions.push(...eqPredictions)
  })
  return predictions.sort((a, b) => {
    const urgencyOrder = { urgent: 0, warning: 1, normal: 2 }
    return urgencyOrder[a.urgency] - urgencyOrder[b.urgency]
  })
})

// 紧急保养数量
const urgentMaintenanceCount = computed(() => {
  return allMaintenancePredictions.value.filter(p => p.urgency === 'urgent').length
})

// 获取成本分析
const getCostAnalysis = (equipmentId) => {
  return equipmentStore.analyzeServiceCosts(equipmentId, 12)
}

// 获取状态类型
const getStatusType = (status) => {
  const types = {
    running: 'success',
    maintenance: 'warning',
    fault: 'danger',
    idle: 'info'
  }
  return types[status] || 'info'
}

// 获取状态文本
const getStatusText = (status) => {
  const texts = {
    running: '运行中',
    maintenance: '维护中',
    fault: '故障',
    idle: '闲置'
  }
  return texts[status] || '未知'
}

// 获取健康度颜色
const getHealthColor = (health) => {
  if (health >= 80) return '#52c41a'
  if (health >= 60) return '#faad14'
  return '#f5222d'
}

// 获取ROI类型
const getRoiType = (roi) => {
  const roiValue = parseFloat(roi)
  if (roiValue >= 20) return 'success'
  if (roiValue >= 10) return 'warning'
  return 'danger'
}

// 获取紧急程度类型
const getUrgencyType = (urgency) => {
  const types = {
    urgent: 'danger',
    warning: 'warning',
    normal: 'success'
  }
  return types[urgency] || 'info'
}

// 获取紧急程度文本
const getUrgencyText = (urgency) => {
  const texts = {
    urgent: '紧急',
    warning: '警告',
    normal: '正常'
  }
  return texts[urgency] || '未知'
}

// 获取风险颜色
const getRiskColor = (risk) => {
  if (risk >= 80) return '#f5222d'
  if (risk >= 60) return '#faad14'
  return '#52c41a'
}

// 添加设备
const addEquipment = () => {
  if (!newEquipment.value.name || !newEquipment.value.category) {
    ElMessage.warning('请填写必填项')
    return
  }

  // 获取该类别的部件列表
  const categoryComponents = equipmentStore.getComponentsByCategory(newEquipment.value.category)
  
  // 为新设备添加部件信息
  const components = categoryComponents.map(comp => ({
    componentId: comp.id,
    installDate: newEquipment.value.purchaseDate || new Date().toISOString().split('T')[0],
    lastMaintenance: newEquipment.value.purchaseDate || new Date().toISOString().split('T')[0],
    nextMaintenance: calculateNextMaintenance(newEquipment.value.purchaseDate, comp.maintenanceCycle),
    condition: 100
  }))

  equipmentStore.addEquipment({
    ...newEquipment.value,
    purchaseDate: newEquipment.value.purchaseDate ? 
      new Date(newEquipment.value.purchaseDate).toISOString().split('T')[0] : 
      new Date().toISOString().split('T')[0],
    installDate: newEquipment.value.purchaseDate ? 
      new Date(newEquipment.value.purchaseDate).toISOString().split('T')[0] : 
      new Date().toISOString().split('T')[0],
    components
  })

  ElMessage.success('设备添加成功')
  showAddEquipmentDialog.value = false
  
  // 重置表单
  newEquipment.value = {
    name: '',
    category: '',
    model: '',
    serialNumber: '',
    manufacturer: '',
    purchaseDate: '',
    purchasePrice: 0,
    location: '',
    status: 'running',
    workingHours: 0,
    utilizationRate: 0,
    components: []
  }
}

// 计算下次保养时间
const calculateNextMaintenance = (installDate, maintenanceCycle) => {
  const date = new Date(installDate || new Date())
  date.setMonth(date.getMonth() + maintenanceCycle)
  return date.toISOString().split('T')[0]
}

// 查看设备详情
const viewEquipmentDetail = (equipment) => {
  router.push(`/equipment-detail/${equipment.id}`)
}

// 查看ROI详情
const viewRoiDetail = (roiData) => {
  ElMessage.info('ROI详情功能开发中...')
}

// 查看成本详情
const viewCostDetail = (equipmentId) => {
  router.push(`/equipment-cost/${equipmentId}`)
}

// 创建保养工单
const createMaintenanceWorkOrder = (prediction) => {
  router.push({
    path: '/fault-tracking',
    query: {
      type: 'maintenance',
      equipmentId: prediction.equipmentId,
      equipmentName: prediction.equipmentName,
      componentId: prediction.componentId,
      componentName: prediction.componentName
    }
  })
}
</script>

<style scoped>
.equipment-lifecycle {
  min-height: 100vh;
  background: #f5f7fa;
}

.page-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 36px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.subtitle {
  font-size: 16px;
  color: #666;
}

/* KPI卡片 */
.kpi-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 40px;
}

.kpi-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.12);
}

.kpi-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.kpi-content {
  flex: 1;
}

.kpi-value {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.kpi-label {
  font-size: 14px;
  color: #666;
}

/* 选项卡 */
.feature-tabs {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.tab-content {
  padding: 20px 0;
}

/* 工具栏 */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 16px;
}

.filter-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* 设备网格 */
.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.equipment-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e8e8e8;
  cursor: pointer;
  transition: all 0.3s ease;
}

.equipment-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0,0,0,0.12);
  border-color: #1890ff;
}

.equipment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.equipment-category {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
}

.equipment-name {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.equipment-info {
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 13px;
}

.info-item .label {
  color: #999;
}

.info-item .value {
  color: #333;
  font-weight: 500;
}

.equipment-health {
  margin-bottom: 16px;
}

.health-label {
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

.equipment-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

/* ROI分析 */
.roi-analysis {
  padding: 20px;
}

/* 成本分析 */
.cost-overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.cost-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 24px;
}

.cost-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #1a1a1a;
}

.cost-summary {
  margin-bottom: 20px;
}

.cost-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
}

.cost-item .label {
  color: #666;
}

.cost-item .value {
  font-weight: 600;
  color: #1a1a1a;
}

.cost-breakdown {
  margin-top: 20px;
}

.breakdown-item {
  margin-bottom: 16px;
}

.breakdown-item .label {
  font-size: 13px;
  color: #666;
  display: block;
  margin-bottom: 6px;
}

.percentage-text {
  font-size: 12px;
  color: #666;
}

/* 设备分类 */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.category-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e8e8e8;
}

.category-header {
  padding: 32px;
  text-align: center;
  color: #fff;
}

.category-header h3 {
  font-size: 22px;
  font-weight: 600;
  margin-top: 12px;
}

.category-body {
  padding: 24px;
}

.components-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.component-item {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.comp-name {
  font-size: 15px;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.comp-info {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 保养预测 */
.maintenance-predictions {
  padding: 20px;
}

@media (max-width: 768px) {
  .kpi-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .equipment-grid {
    grid-template-columns: 1fr;
  }
  
  .cost-overview-grid,
  .categories-grid {
    grid-template-columns: 1fr;
  }
}
</style>
