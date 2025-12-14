<template>
  <div class="process-verification-page">
    <Header />
    
    <!-- 页面标题区 -->
    <section class="page-header">
      <div class="container">
        <div class="header-content">
          <div class="icon-wrapper">
            <el-icon :size="48"><Setting /></el-icon>
          </div>
          <div class="text-content">
            <h1>拧紧工艺改进与验证智能体</h1>
            <p>基于PSE拧紧程序的智能工艺分析与参数推荐系统</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 主要内容区 -->
    <section class="main-content">
      <div class="container">
        <!-- 筛选条件卡片 -->
        <el-card class="filter-card" shadow="never">
          <template #header>
            <div class="card-header">
              <el-icon><Filter /></el-icon>
              <span>工艺条件筛选</span>
              <el-button 
                type="primary" 
                :icon="Search" 
                @click="analyzeProcess"
                :loading="analyzing">
                智能分析
              </el-button>
            </div>
          </template>

          <el-form :model="filterForm" label-width="140px" class="filter-form">
            <el-row :gutter="24">
              <!-- 工位信息 -->
              <el-col :span="12">
                <el-form-item label="工位名称">
                  <el-select 
                    v-model="filterForm.workstation" 
                    placeholder="请选择工位"
                    filterable
                    multiple
                    collapse-tags
                    collapse-tags-tooltip>
                    <el-option-group
                      v-for="group in workstationGroups"
                      :key="group.label"
                      :label="group.label">
                      <el-option
                        v-for="item in group.options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        <span style="float: left">{{ item.label }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.category }}</span>
                      </el-option>
                    </el-option-group>
                  </el-select>
                </el-form-item>
              </el-col>

              <!-- 工位扭矩 -->
              <el-col :span="12">
                <el-form-item label="工位扭矩 (Nm)">
                  <el-input-number 
                    v-model="filterForm.torque" 
                    :min="1" 
                    :max="500" 
                    :step="0.5"
                    placeholder="请输入工位扭矩" />
                </el-form-item>
              </el-col>

              <!-- 工具类型 -->
              <el-col :span="12">
                <el-form-item label="工具类型">
                  <el-select 
                    v-model="filterForm.toolType" 
                    placeholder="请选择工具类型"
                    @change="onToolTypeChange">
                    <el-option
                      v-for="item in toolTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                      <div class="tool-option">
                        <span>{{ item.label }}</span>
                        <el-tag size="small" :type="item.tagType">{{ item.power }}</el-tag>
                      </div>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <!-- 工具型号 -->
              <el-col :span="12">
                <el-form-item label="工具型号">
                  <el-select 
                    v-model="filterForm.toolModel" 
                    placeholder="请选择工具型号"
                    filterable
                    :disabled="!filterForm.toolType">
                    <el-option
                      v-for="item in availableToolModels"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                      <span style="float: left">{{ item.label }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.spec }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <!-- 螺栓类型 -->
              <el-col :span="12">
                <el-form-item label="螺栓类型">
                  <el-select 
                    v-model="filterForm.boltType" 
                    placeholder="请选择螺栓类型">
                    <el-option
                      v-for="item in boltTypes"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                      <div class="bolt-option">
                        <span>{{ item.label }}</span>
                        <el-icon v-if="item.common" style="color: #67c23a"><Star /></el-icon>
                      </div>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <!-- 连接件弹性 -->
              <el-col :span="12">
                <el-form-item label="连接件弹性">
                  <el-radio-group v-model="filterForm.jointElasticity">
                    <el-radio label="soft">偏软</el-radio>
                    <el-radio label="medium">中性</el-radio>
                    <el-radio label="hard">偏硬</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>

              <!-- 工件材料 -->
              <el-col :span="12">
                <el-form-item label="工件材料">
                  <el-select 
                    v-model="filterForm.material" 
                    placeholder="请选择工件材料">
                    <el-option
                      v-for="item in materials"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value" />
                  </el-select>
                </el-form-item>
              </el-col>

              <!-- 特殊工况 -->
              <el-col :span="12">
                <el-form-item label="特殊工况">
                  <el-select 
                    v-model="filterForm.specialCondition" 
                    placeholder="请选择特殊工况"
                    clearable>
                    <el-option
                      v-for="item in specialConditions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                      <span style="float: left">{{ item.label }}</span>
                      <el-tag size="small" :type="item.tagType" style="float: right">{{ item.difficulty }}</el-tag>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>

              <!-- 测试类型 -->
              <el-col :span="24">
                <el-form-item label="测试类型">
                  <el-radio-group v-model="filterForm.testType">
                    <el-radio label="dynamic">动态扭矩测试</el-radio>
                    <el-radio label="static">静态扭矩测试</el-radio>
                  </el-radio-group>
                  <el-tooltip content="动态扭矩测试适用于旋转拧紧过程，静态扭矩测试用于最终扭矩检测" placement="top">
                    <el-icon style="margin-left: 8px; color: #909399"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </el-form-item>
              </el-col>
            </el-row>

            <el-divider />

            <!-- 快速操作按钮 -->
            <div class="quick-actions">
              <el-button @click="resetFilter">
                <el-icon><RefreshRight /></el-icon>
                重置条件
              </el-button>
              <el-button @click="loadTemplate">
                <el-icon><Document /></el-icon>
                加载模板
              </el-button>
              <el-button @click="saveTemplate">
                <el-icon><FolderOpened /></el-icon>
                保存模板
              </el-button>
            </div>
          </el-form>
        </el-card>

        <!-- 分析结果区域 -->
        <el-card v-if="showResult" class="result-card" shadow="never">
          <template #header>
            <div class="card-header">
              <el-icon><Cpu /></el-icon>
              <span>智能分析结果</span>
              <el-button 
                type="success" 
                :icon="Download" 
                @click="exportReport"
                size="small">
                导出报告
              </el-button>
            </div>
          </template>

          <!-- 推荐控制策略 -->
          <div class="strategy-section">
            <h3>
              <el-icon><Lightning /></el-icon>
              推荐控制策略
            </h3>
            <el-row :gutter="16">
              <el-col :span="8" v-for="strategy in recommendedStrategies" :key="strategy.type">
                <el-card 
                  class="strategy-card" 
                  :class="{ 'strategy-best': strategy.best }"
                  @click="selectStrategy(strategy)"
                  :body-style="{ padding: '20px' }">
                  <div class="strategy-header">
                    <h4>{{ strategy.name }}</h4>
                    <el-tag v-if="strategy.best" type="success" size="small">
                      <el-icon><Star /></el-icon>
                      最优
                    </el-tag>
                    <el-tag v-else :type="strategy.tagType" size="small">{{ strategy.suitability }}</el-tag>
                  </div>
                  <div class="strategy-content">
                    <p class="strategy-desc">{{ strategy.description }}</p>
                    <div class="strategy-score">
                      <span>匹配度</span>
                      <el-progress 
                        :percentage="strategy.score" 
                        :color="getScoreColor(strategy.score)"
                        :stroke-width="8" />
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>

          <!-- 选中策略的详细参数 -->
          <div v-if="selectedStrategy" class="parameters-section">
            <h3>
              <el-icon><Setting /></el-icon>
              PSE程序参数推荐 - {{ selectedStrategy.name }}
            </h3>
            
            <!-- 参数表格 -->
            <el-table 
              :data="selectedStrategy.parameters" 
              border
              stripe
              class="parameters-table">
              <el-table-column prop="code" label="参数代码" width="120" align="center">
                <template #default="{ row }">
                  <el-tag type="info">{{ row.code }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="参数名称" width="200" />
              <el-table-column prop="value" label="推荐值" width="150" align="center">
                <template #default="{ row }">
                  <span style="font-weight: 600; color: #409eff">{{ row.value }} {{ row.unit }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="range" label="可调范围" width="180" align="center" />
              <el-table-column prop="description" label="说明" min-width="300" show-overflow-tooltip />
            </el-table>

            <!-- 拧紧曲线预览 -->
            <div class="curve-preview">
              <h4>
                <el-icon><TrendCharts /></el-icon>
                预期拧紧曲线
              </h4>
              <div ref="curveChart" style="width: 100%; height: 400px"></div>
            </div>

            <!-- 注意事项 -->
            <el-alert 
              :title="`${selectedStrategy.name}注意事项`" 
              type="warning" 
              :closable="false"
              style="margin-top: 24px">
              <template #default>
                <ul class="notes-list">
                  <li v-for="(note, index) in selectedStrategy.notes" :key="index">{{ note }}</li>
                </ul>
              </template>
            </el-alert>
          </div>

          <!-- 工艺改进建议 -->
          <div class="improvement-section">
            <h3>
              <el-icon><Opportunity /></el-icon>
              工艺改进建议
            </h3>
            <el-timeline>
              <el-timeline-item
                v-for="(item, index) in improvementSuggestions"
                :key="index"
                :icon="item.icon"
                :type="item.type"
                :size="item.size">
                <div class="timeline-content">
                  <h4>{{ item.title }}</h4>
                  <p>{{ item.content }}</p>
                  <el-tag v-if="item.priority" :type="getPriorityType(item.priority)" size="small">
                    {{ item.priority }}
                  </el-tag>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-card>

        <!-- 数据库记录 -->
        <el-card class="database-card" shadow="never">
          <template #header>
            <div class="card-header">
              <el-icon><DataAnalysis /></el-icon>
              <span>拧紧测量数据库</span>
              <el-button-group>
                <el-button :icon="Plus" @click="addRecord" size="small">新增记录</el-button>
                <el-button :icon="Upload" @click="importData" size="small">导入数据</el-button>
              </el-button-group>
            </div>
          </template>

          <!-- 数据筛选 -->
          <div class="data-filter">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索工位、工具型号..."
              :prefix-icon="Search"
              clearable
              style="width: 300px; margin-right: 12px;" />
            <el-select 
              v-model="dataFilterWorkstation" 
              placeholder="按工位筛选"
              clearable
              style="width: 200px; margin-right: 12px;">
              <el-option
                v-for="item in workstationList"
                :key="item.value"
                :label="item.label"
                :value="item.value" />
            </el-select>
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 300px;" />
          </div>

          <!-- 数据表格 -->
          <el-table 
            :data="filteredDatabaseRecords" 
            border
            stripe
            max-height="500"
            class="database-table"
            style="margin-top: 16px">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="id" label="记录ID" width="100" align="center" />
            <el-table-column prop="workstation" label="工位名称" width="150" />
            <el-table-column prop="toolType" label="工具类型" width="150" />
            <el-table-column prop="toolModel" label="工具型号" width="130" />
            <el-table-column prop="torque" label="扭矩(Nm)" width="100" align="center" />
            <el-table-column prop="angle" label="角度(°)" width="100" align="center" />
            <el-table-column prop="strategy" label="控制策略" width="120" align="center">
              <template #default="{ row }">
                <el-tag :type="getStrategyTagType(row.strategy)" size="small">
                  {{ row.strategy }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="result" label="测试结果" width="100" align="center">
              <template #default="{ row }">
                <el-tag :type="row.result === 'OK' ? 'success' : 'danger'" size="small">
                  {{ row.result }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="160" align="center" />
            <el-table-column label="操作" width="160" align="center" fixed="right">
              <template #default="{ row }">
                <el-button-group>
                  <el-button type="primary" size="small" :icon="View" @click="viewRecord(row)" />
                  <el-button type="warning" size="small" :icon="Edit" @click="editRecord(row)" />
                  <el-button type="danger" size="small" :icon="Delete" @click="deleteRecord(row)" />
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页 -->
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="totalRecords"
            layout="total, sizes, prev, pager, next, jumper"
            style="margin-top: 16px; justify-content: center" />
        </el-card>
      </div>
    </section>

    <!-- 新增/编辑记录对话框 -->
    <el-dialog
      v-model="recordDialogVisible"
      :title="editingRecord ? '编辑记录' : '新增记录'"
      width="800px"
      :close-on-click-modal="false">
      <el-form :model="recordForm" :rules="recordRules" ref="recordFormRef" label-width="120px">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="工位名称" prop="workstation">
              <el-select v-model="recordForm.workstation" placeholder="请选择">
                <el-option
                  v-for="item in workstationList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工具类型" prop="toolType">
              <el-select v-model="recordForm.toolType" placeholder="请选择">
                <el-option
                  v-for="item in toolTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工具型号" prop="toolModel">
              <el-input v-model="recordForm.toolModel" placeholder="如:ETBP45-10" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="控制策略" prop="strategy">
              <el-select v-model="recordForm.strategy" placeholder="请选择">
                <el-option label="扭矩控制" value="扭矩控制" />
                <el-option label="角度控制" value="角度控制" />
                <el-option label="DS控制" value="DS控制" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标扭矩" prop="torque">
              <el-input-number v-model="recordForm.torque" :min="1" :max="500" :step="0.5" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="目标角度" prop="angle">
              <el-input-number v-model="recordForm.angle" :min="0" :max="720" :step="1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="测试结果" prop="result">
              <el-radio-group v-model="recordForm.result">
                <el-radio label="OK">合格</el-radio>
                <el-radio label="NG">不合格</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input 
                v-model="recordForm.remark" 
                type="textarea" 
                :rows="3"
                placeholder="请输入备注信息" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <el-button @click="recordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRecord">保存</el-button>
      </template>
    </el-dialog>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Setting, Filter, Search, RefreshRight, Document, FolderOpened,
  Cpu, Download, Lightning, Star, TrendCharts, Opportunity,
  DataAnalysis, Plus, Upload, View, Edit, Delete, QuestionFilled
} from '@element-plus/icons-vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import * as echarts from 'echarts'

// ===== 筛选条件 =====
const filterForm = ref({
  workstation: [],
  torque: null,
  toolType: '',
  toolModel: '',
  boltType: '',
  jointElasticity: 'medium',
  material: '',
  specialCondition: '',
  testType: 'dynamic'
})

// 工位分组数据
const workstationGroups = [
  {
    label: '车身工位',
    options: [
      { value: 'tire', label: '轮胎工位', category: '车身' },
      { value: 'halfshaft', label: '半轴工位', category: '车身' },
      { value: 'shock', label: '减震器工位', category: '车身' },
      { value: 'chassis', label: '底盘螺栓工位', category: '车身' },
      { value: 'door', label: '四门两盖工位', category: '车身' }
    ]
  },
  {
    label: '内饰工位',
    options: [
      { value: 'seat', label: '座椅工位', category: '内饰' },
      { value: 'seatbelt', label: '安全带工位', category: '内饰' },
      { value: 'wheel', label: '方向盘工位', category: '内饰' },
      { value: 'steering', label: '转向器工位', category: '内饰' }
    ]
  },
  {
    label: '动力总成',
    options: [
      { value: 'cylinder', label: '缸盖工位', category: '动力' },
      { value: 'flywheel', label: '飞轮工位', category: '动力' },
      { value: 'valvecover', label: '气门室盖工位', category: '动力' },
      { value: 'fuelline', label: '燃油管工位', category: '动力' }
    ]
  }
]

// 工位列表(扁平化，用于筛选)
const workstationList = computed(() => {
  return workstationGroups.flatMap(group => group.options)
})

// 工具类型
const toolTypes = [
  { value: 'hydraulic', label: '锂电手持油压脉冲定扭扳手', power: '油压脉冲', tagType: 'danger' },
  { value: 'pulse', label: '锂电电脉冲定扭扳手', power: '电脉冲', tagType: 'warning' },
  { value: 'clutch', label: '锂电离合器定扭扳手', power: '离合器', tagType: 'success' },
  { value: 'direct', label: '锂电直驱定扭扳手', power: '直驱', tagType: 'primary' }
]

// 工具型号数据
const toolModelsData = {
  hydraulic: [
    { value: 'ETBP45-10', label: 'ETBP45-10', spec: '45Nm' },
    { value: 'ETBP90-15', label: 'ETBP90-15', spec: '90Nm' },
    { value: 'ETBP180-20', label: 'ETBP180-20', spec: '180Nm' }
  ],
  pulse: [
    { value: 'ETBEP45-10', label: 'ETBEP45-10', spec: '45Nm' },
    { value: 'ETBEP90-15', label: 'ETBEP90-15', spec: '90Nm' }
  ],
  clutch: [
    { value: 'ETBC35-08', label: 'ETBC35-08', spec: '35Nm' },
    { value: 'ETBC65-12', label: 'ETBC65-12', spec: '65Nm' }
  ],
  direct: [
    { value: 'ETBD25-06', label: 'ETBD25-06', spec: '25Nm' },
    { value: 'ETBD50-10', label: 'ETBD50-10', spec: '50Nm' }
  ]
}

// 可用工具型号(根据工具类型动态变化)
const availableToolModels = computed(() => {
  return toolModelsData[filterForm.value.toolType] || []
})

// 螺栓类型
const boltTypes = [
  { value: 'standard', label: '标准机螺栓', common: true },
  { value: 'long', label: '长螺栓', common: true },
  { value: 'double', label: '双头螺栓', common: false },
  { value: 'self-tapping', label: '自攻螺丝', common: true },
  { value: 'hold-drive-inner', label: 'Hold and Drive (内止外动)', common: false }
]

// 工件材料
const materials = [
  { value: 'steel-steel', label: '钢对钢' },
  { value: 'steel-aluminum', label: '钢铝' },
  { value: 'aluminum', label: '铝合金' },
  { value: 'thin-metal', label: '薄金属板' },
  { value: 'plastic-gasket', label: '塑料件加垫片' },
  { value: 'steel-gap', label: '双层钢板中间间隙' },
  { value: 'steel-rubber', label: '双层钢板中间橡胶' }
]

// 特殊工况
const specialConditions = [
  { value: '', label: '无特殊工况', difficulty: '标准', tagType: 'info' },
  { value: 'high-torque', label: '大扭矩拧紧', difficulty: '较难', tagType: 'warning' },
  { value: 'soft-joint', label: '软连接', difficulty: '困难', tagType: 'danger' },
  { value: 'blind-hole', label: '盲孔拧紧', difficulty: '较难', tagType: 'warning' },
  { value: 'long-bolt', label: '长螺栓拧紧', difficulty: '困难', tagType: 'danger' }
]

// 工具类型变化时清空型号
const onToolTypeChange = () => {
  filterForm.value.toolModel = ''
}

// ===== 分析功能 =====
const analyzing = ref(false)
const showResult = ref(false)
const recommendedStrategies = ref([])
const selectedStrategy = ref(null)
const improvementSuggestions = ref([])
const curveChart = ref(null)
let curveChartInstance = null

// 智能分析
const analyzeProcess = async () => {
  // 验证必填项
  if (!filterForm.value.workstation || filterForm.value.workstation.length === 0) {
    ElMessage.warning('请选择工位名称')
    return
  }
  if (!filterForm.value.torque) {
    ElMessage.warning('请输入工位扭矩')
    return
  }
  if (!filterForm.value.toolType) {
    ElMessage.warning('请选择工具类型')
    return
  }

  analyzing.value = true
  
  try {
    // 模拟AI分析延迟
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 生成推荐策略
    generateRecommendations()
    
    showResult.value = true
    ElMessage.success('分析完成！已为您生成专业工艺建议')
    
    // 滚动到结果区域
    nextTick(() => {
      document.querySelector('.result-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  } catch (error) {
    ElMessage.error('分析失败，请重试')
  } finally {
    analyzing.value = false
  }
}

// 生成推荐策略
const generateRecommendations = () => {
  const torque = filterForm.value.torque
  const material = filterForm.value.material
  const jointElasticity = filterForm.value.jointElasticity
  
  // 根据条件智能推荐策略
  const strategies = []
  
  // 扭矩控制策略
  const torqueStrategy = {
    type: 'torque',
    name: '扭矩控制',
    description: '通过扭矩传感器实时监控拧紧扭矩，达到目标扭矩后停止。适用于刚性连接，要求扭矩精度高。',
    score: 85,
    suitability: '推荐',
    tagType: 'success',
    best: false,
    parameters: [
      { code: 'P110', name: '周期开始', value: (torque * 0.1).toFixed(1), unit: 'Nm', range: '5-20% 目标扭矩', description: '拧紧过程数据采集起始扭矩值' },
      { code: 'P113', name: '最终目标', value: torque, unit: 'Nm', range: '用户设定', description: '目标拧紧扭矩，达到后工具自动停止' },
      { code: 'P112', name: '最终扭矩最小值', value: (torque * 0.9).toFixed(1), unit: 'Nm', range: '85-95% 目标扭矩', description: '合格扭矩下限，低于此值判定为NG' },
      { code: 'P114', name: '最终扭矩最大值', value: (torque * 1.1).toFixed(1), unit: 'Nm', range: '105-115% 目标扭矩', description: '合格扭矩上限，超过此值判定为NG并立即停止' },
      { code: 'P115', name: '周期完成', value: (torque * 0.85).toFixed(1), unit: 'Nm', range: '80-90% 目标扭矩', description: '拧紧数据采集结束扭矩值' },
      { code: 'P141', name: '结束时间', value: '0.5', unit: 's', range: '0.3-2.0s', description: '从周期完成到停止的延迟时间' }
    ],
    notes: [
      '适用于刚性连接(如钢对钢)，扭矩精度要求±5%以内',
      '不适用于软连接或长螺栓，可能导致预紧力不足',
      '建议配合角度监控，防止螺纹打滑或过拧',
      '扭矩传感器需定期校准，推荐周期为6个月'
    ]
  }
  
  // 角度控制策略
  const angleStrategy = {
    type: 'angle',
    name: '角度控制',
    description: '在起始扭矩后，按设定角度旋转拧紧。适用于软连接、长螺栓，更稳定的预紧力。',
    score: 78,
    suitability: '可选',
    tagType: 'warning',
    best: false,
    parameters: [
      { code: 'P110', name: '周期开始', value: (torque * 0.1).toFixed(1), unit: 'Nm', range: '5-20% 目标扭矩', description: '角度测量起始扭矩值' },
      { code: 'P120', name: '开始最终角度', value: (torque * 0.7).toFixed(1), unit: 'Nm', range: '60-80% 目标扭矩', description: '从此扭矩开始计算最终角度' },
      { code: 'P123', name: '目标角度', value: '90', unit: '°', range: '60-180°', description: '从P120开始需旋转的角度' },
      { code: 'P121', name: '测量角度', value: (torque * 0.5).toFixed(1), unit: 'Nm', range: '40-60% 目标扭矩', description: '角度测量参考点' },
      { code: 'P124', name: '最终角度最大值', value: '110', unit: '°', range: '目标角度+10-30°', description: '最大允许角度，超过判定为NG' },
      { code: 'P141', name: '结束时间', value: '1.0', unit: 's', range: '0.5-2.0s', description: '达到目标角度后延迟停止时间' }
    ],
    notes: [
      '适用于软连接(如有垫片)、长螺栓、铝制件等',
      '可以更精确控制预紧力，减少材料弹性影响',
      '需确保螺纹质量良好，避免打滑导致角度误判',
      '建议配合扭矩上限保护，防止过拧'
    ]
  }
  
  // DS(双重控制)策略
  const dsStrategy = {
    type: 'ds',
    name: 'DS控制',
    description: 'DS控制(Dual Stage)结合扭矩和角度，两阶段拧紧。先扭矩定位，再角度拧紧。适用于高精度要求。',
    score: 92,
    suitability: '最优',
    tagType: 'success',
    best: true,
    parameters: [
      { code: 'P110', name: '周期开始', value: (torque * 0.1).toFixed(1), unit: 'Nm', range: '5-20% 目标扭矩', description: '数据采集起始点' },
      { code: 'P113', name: '第一阶段目标', value: (torque * 0.7).toFixed(1), unit: 'Nm', range: '60-80% 目标扭矩', description: '第一阶段扭矩目标，到达后转入第二阶段' },
      { code: 'P120', name: '开始最终角度', value: (torque * 0.7).toFixed(1), unit: 'Nm', range: '与P113相同', description: '第二阶段角度测量起点' },
      { code: 'P123', name: '目标角度', value: '75', unit: '°', range: '50-120°', description: '第二阶段旋转角度' },
      { code: 'P112', name: '最终扭矩最小值', value: (torque * 0.92).toFixed(1), unit: 'Nm', range: '90-95% 目标扭矩', description: '最终扭矩合格下限' },
      { code: 'P114', name: '最终扭矩最大值', value: (torque * 1.08).toFixed(1), unit: 'Nm', range: '105-110% 目标扭矩', description: '最终扭矩合格上限' },
      { code: 'P124', name: '最终角度最大值', value: '90', unit: '°', range: '目标角度+10-20°', description: '第二阶段最大允许角度' },
      { code: 'P141', name: '结束时间', value: '0.8', unit: 's', range: '0.5-1.5s', description: '完成后延迟停止时间' }
    ],
    notes: [
      '综合了扭矩和角度的优点，拧紧一致性最佳',
      '适用于高价值零部件(如发动机缸盖、飞轮等)',
      '对工具性能要求较高，需支持双控模式',
      '第一阶段扭矩需根据实际连接特性调整，通常为目标扭矩的60-80%',
      '第二阶段角度根据螺纹参数和材料确定，通常50-120°'
    ]
  }
  
  strategies.push(torqueStrategy, angleStrategy, dsStrategy)
  
  // 根据材料和弹性调整评分
  if (material === 'steel-steel' && jointElasticity === 'hard') {
    torqueStrategy.score = 95
    torqueStrategy.best = true
    torqueStrategy.tagType = 'success'
    dsStrategy.best = false
    dsStrategy.score = 88
  } else if (jointElasticity === 'soft' || material.includes('rubber') || material.includes('gap')) {
    angleStrategy.score = 90
    angleStrategy.best = true
    angleStrategy.tagType = 'success'
    dsStrategy.best = false
    dsStrategy.score = 85
    torqueStrategy.score = 70
  }
  
  recommendedStrategies.value = strategies.sort((a, b) => b.score - a.score)
  
  // 默认选中最优策略
  selectedStrategy.value = strategies.find(s => s.best)
  
  // 生成改进建议
  generateImprovementSuggestions()
  
  // 绘制曲线
  nextTick(() => {
    drawCurveChart()
  })
}

// 生成改进建议
const generateImprovementSuggestions = () => {
  improvementSuggestions.value = [
    {
      icon: 'Check',
      type: 'success',
      size: 'large',
      title: '优先推荐',
      content: `使用${selectedStrategy.value.name}策略，该策略匹配度${selectedStrategy.value.score}%，最适合当前工况`,
      priority: '高优先级'
    },
    {
      icon: 'Warning',
      type: 'warning',
      size: 'normal',
      title: '工具选型建议',
      content: filterForm.value.toolType === 'hydraulic' 
        ? '油压脉冲工具适合大扭矩(>100Nm)场景，当前扭矩如较小，建议考虑电脉冲或直驱工具，可降低成本'
        : '当前工具类型适合该扭矩范围',
      priority: '中优先级'
    },
    {
      icon: 'Setting',
      type: 'primary',
      size: 'normal',
      title: '参数优化建议',
      content: '建议在实际验证后，根据Cpk分析结果微调P112/P114扭矩窗口，确保Cpk≥1.67',
      priority: '中优先级'
    },
    {
      icon: 'DataAnalysis',
      type: 'info',
      size: 'normal',
      title: '数据采集建议',
      content: '建议采集至少30组数据，进行统计分析，验证工艺参数稳定性',
      priority: '建议执行'
    }
  ]
  
  // 根据特殊工况添加建议
  if (filterForm.value.specialCondition === 'soft-joint') {
    improvementSuggestions.value.push({
      icon: 'Warning',
      type: 'danger',
      size: 'normal',
      title: '软连接特殊注意',
      content: '软连接(如有橡胶垫片)扭矩衰减明显，建议使用角度控制或DS控制，并在24小时后复检扭矩',
      priority: '高优先级'
    })
  }
  
  if (filterForm.value.specialCondition === 'long-bolt') {
    improvementSuggestions.value.push({
      icon: 'Warning',
      type: 'danger',
      size: 'normal',
      title: '长螺栓拧紧注意',
      content: '长螺栓(L/D>5)拧紧时扭矩损失大，建议采用角度控制，并适当提高第一阶段扭矩(如DS控制)',
      priority: '高优先级'
    })
  }
}

// 选择策略
const selectStrategy = (strategy) => {
  selectedStrategy.value = strategy
  nextTick(() => {
    drawCurveChart()
    document.querySelector('.parameters-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

// 获取评分颜色
const getScoreColor = (score) => {
  if (score >= 90) return '#67c23a'
  if (score >= 75) return '#409eff'
  if (score >= 60) return '#e6a23c'
  return '#f56c6c'
}

// 获取优先级类型
const getPriorityType = (priority) => {
  if (priority.includes('高')) return 'danger'
  if (priority.includes('中')) return 'warning'
  return 'info'
}

// 绘制拧紧曲线
const drawCurveChart = () => {
  if (!curveChart.value) return
  
  if (!curveChartInstance) {
    curveChartInstance = echarts.init(curveChart.value)
  }
  
  const torque = filterForm.value.torque
  const strategy = selectedStrategy.value
  
  let curveData = []
  let option = {}
  
  if (strategy.type === 'torque') {
    // 扭矩控制曲线
    curveData = []
    for (let angle = 0; angle <= 540; angle += 2) {
      let t = 0
      if (angle < 90) {
        t = angle / 90 * torque * 0.1  // 认牙阶段
      } else if (angle < 360) {
        t = torque * 0.1 + (angle - 90) / 270 * (torque * 0.6)  // 旋入阶段
      } else {
        t = torque * 0.7 + (angle - 360) / 180 * (torque * 0.3)  // 拧紧阶段
        if (t > torque) t = torque  // 达到目标扭矩
      }
      curveData.push([angle, parseFloat(t.toFixed(2))])
    }
    
    option = {
      title: {
        text: '扭矩控制曲线预览',
        subtext: '扭矩达到目标值后自动停止',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          return `角度: ${params[0].data[0]}°<br/>扭矩: ${params[0].data[1]} Nm`
        }
      },
      xAxis: {
        type: 'value',
        name: '旋入角度 (°)',
        nameLocation: 'middle',
        nameGap: 30,
        min: 0,
        max: 600
      },
      yAxis: {
        type: 'value',
        name: '扭矩 (Nm)',
        nameLocation: 'middle',
        nameGap: 50,
        min: 0,
        max: torque * 1.2
      },
      series: [{
        type: 'line',
        data: curveData,
        smooth: true,
        lineStyle: { color: '#409eff', width: 3 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(64, 158, 255, 0.4)' },
              { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
            ]
          }
        },
        markLine: {
          data: [
            { yAxis: torque, label: { formatter: 'P113 目标扭矩' }, lineStyle: { color: '#67c23a', type: 'dashed' } },
            { yAxis: torque * 0.9, label: { formatter: 'P112 最小值' }, lineStyle: { color: '#e6a23c', type: 'dashed' } },
            { yAxis: torque * 1.1, label: { formatter: 'P114 最大值' }, lineStyle: { color: '#f56c6c', type: 'dashed' } }
          ]
        }
      }]
    }
  } else if (strategy.type === 'angle') {
    // 角度控制曲线
    const startAngle = 360
    const targetAngle = 90
    curveData = []
    for (let angle = 0; angle <= startAngle + targetAngle + 20; angle += 2) {
      let t = 0
      if (angle < 90) {
        t = angle / 90 * torque * 0.1
      } else if (angle < startAngle) {
        t = torque * 0.1 + (angle - 90) / (startAngle - 90) * (torque * 0.6)
      } else {
        // 从P120开始按角度拧紧
        t = torque * 0.7 + (angle - startAngle) / targetAngle * (torque * 0.35)
        if (t > torque * 1.05) t = torque * 1.05
      }
      curveData.push([angle, parseFloat(t.toFixed(2))])
    }
    
    option = {
      title: {
        text: '角度控制曲线预览',
        subtext: `从${(torque * 0.7).toFixed(1)}Nm开始，旋转90°后停止`,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          return `角度: ${params[0].data[0]}°<br/>扭矩: ${params[0].data[1]} Nm`
        }
      },
      xAxis: {
        type: 'value',
        name: '旋入角度 (°)',
        nameLocation: 'middle',
        nameGap: 30,
        min: 0,
        max: 550
      },
      yAxis: {
        type: 'value',
        name: '扭矩 (Nm)',
        nameLocation: 'middle',
        nameGap: 50,
        min: 0,
        max: torque * 1.2
      },
      series: [{
        type: 'line',
        data: curveData,
        smooth: true,
        lineStyle: { color: '#e6a23c', width: 3 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(230, 162, 60, 0.4)' },
              { offset: 1, color: 'rgba(230, 162, 60, 0.05)' }
            ]
          }
        },
        markLine: {
          data: [
            { xAxis: startAngle, label: { formatter: 'P120 开始角度测量' }, lineStyle: { color: '#67c23a', type: 'dashed' } },
            { xAxis: startAngle + targetAngle, label: { formatter: 'P123 目标角度' }, lineStyle: { color: '#409eff', type: 'dashed' } }
          ]
        },
        markArea: {
          data: [[
            { xAxis: startAngle, itemStyle: { color: 'rgba(103, 194, 58, 0.1)' } },
            { xAxis: startAngle + targetAngle }
          ]]
        }
      }]
    }
  } else {
    // DS控制曲线
    const stage1Torque = torque * 0.7
    const stage1Angle = 360
    const stage2Angle = 75
    
    curveData = []
    for (let angle = 0; angle <= stage1Angle + stage2Angle + 20; angle += 2) {
      let t = 0
      if (angle < 90) {
        t = angle / 90 * torque * 0.1
      } else if (angle < stage1Angle) {
        t = torque * 0.1 + (angle - 90) / (stage1Angle - 90) * (stage1Torque - torque * 0.1)
      } else {
        // 第二阶段：从stage1Torque按角度拧紧到最终扭矩
        const progress = (angle - stage1Angle) / stage2Angle
        t = stage1Torque + progress * (torque - stage1Torque)
        if (t > torque) t = torque
      }
      curveData.push([angle, parseFloat(t.toFixed(2))])
    }
    
    option = {
      title: {
        text: 'DS双重控制曲线预览',
        subtext: `第一阶段扭矩至${stage1Torque.toFixed(1)}Nm，第二阶段角度控制${stage2Angle}°`,
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          const angle = params[0].data[0]
          const t = params[0].data[1]
          const stage = angle < stage1Angle ? '第一阶段(扭矩控制)' : '第二阶段(角度控制)'
          return `角度: ${angle}°<br/>扭矩: ${t} Nm<br/>${stage}`
        }
      },
      xAxis: {
        type: 'value',
        name: '旋入角度 (°)',
        nameLocation: 'middle',
        nameGap: 30,
        min: 0,
        max: 550
      },
      yAxis: {
        type: 'value',
        name: '扭矩 (Nm)',
        nameLocation: 'middle',
        nameGap: 50,
        min: 0,
        max: torque * 1.2
      },
      series: [{
        type: 'line',
        data: curveData,
        smooth: true,
        lineStyle: { color: '#67c23a', width: 3 },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(103, 194, 58, 0.4)' },
              { offset: 1, color: 'rgba(103, 194, 58, 0.05)' }
            ]
          }
        },
        markLine: {
          data: [
            { xAxis: stage1Angle, label: { formatter: '第一阶段→第二阶段' }, lineStyle: { color: '#409eff', type: 'solid', width: 2 } },
            { yAxis: stage1Torque, label: { formatter: 'P113 第一阶段目标' }, lineStyle: { color: '#e6a23c', type: 'dashed' } },
            { yAxis: torque * 0.92, label: { formatter: 'P112 最终最小' }, lineStyle: { color: '#f56c6c', type: 'dashed' } }
          ]
        },
        markArea: {
          data: [
            [
              { name: '第一阶段', xAxis: 0, itemStyle: { color: 'rgba(64, 158, 255, 0.08)' } },
              { xAxis: stage1Angle }
            ],
            [
              { name: '第二阶段', xAxis: stage1Angle, itemStyle: { color: 'rgba(103, 194, 58, 0.08)' } },
              { xAxis: stage1Angle + stage2Angle }
            ]
          ]
        }
      }]
    }
  }
  
  curveChartInstance.setOption(option, true)
}

// 重置筛选
const resetFilter = () => {
  filterForm.value = {
    workstation: [],
    torque: null,
    toolType: '',
    toolModel: '',
    boltType: '',
    jointElasticity: 'medium',
    material: '',
    specialCondition: '',
    testType: 'dynamic'
  }
  showResult.value = false
  ElMessage.info('已重置筛选条件')
}

// 加载模板
const loadTemplate = () => {
  ElMessageBox.alert('模板加载功能开发中...', '提示', {
    confirmButtonText: '确定',
    type: 'info'
  })
}

// 保存模板
const saveTemplate = () => {
  ElMessageBox.alert('模板保存功能开发中...', '提示', {
    confirmButtonText: '确定',
    type: 'info'
  })
}

// 导出报告
const exportReport = () => {
  ElMessage.success('正在生成报告，请稍候...')
  setTimeout(() => {
    ElMessage.success('报告已生成！')
  }, 1500)
}

// ===== 数据库管理 =====
const databaseRecords = ref([
  {
    id: 1,
    workstation: '轮胎工位',
    toolType: '锂电手持油压脉冲定扭扳手',
    toolModel: 'ETBP45-10',
    torque: 45,
    angle: 90,
    strategy: '扭矩控制',
    result: 'OK',
    createTime: '2025-12-14 10:30:25',
    remark: '测试正常'
  },
  {
    id: 2,
    workstation: '缸盖工位',
    toolType: '锂电电脉冲定扭扳手',
    toolModel: 'ETBEP90-15',
    torque: 90,
    angle: 75,
    strategy: 'DS控制',
    result: 'OK',
    createTime: '2025-12-14 11:15:40',
    remark: 'DS双控效果良好'
  },
  {
    id: 3,
    workstation: '半轴工位',
    toolType: '锂电离合器定扭扳手',
    toolModel: 'ETBC65-12',
    torque: 65,
    angle: 120,
    strategy: '角度控制',
    result: 'NG',
    createTime: '2025-12-14 14:22:18',
    remark: '角度超限，需调整参数'
  }
])

const searchKeyword = ref('')
const dataFilterWorkstation = ref('')
const dateRange = ref([])
const currentPage = ref(1)
const pageSize = ref(10)

// 筛选后的记录
const filteredDatabaseRecords = computed(() => {
  let records = [...databaseRecords.value]
  
  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    records = records.filter(r => 
      r.workstation.toLowerCase().includes(keyword) ||
      r.toolModel.toLowerCase().includes(keyword) ||
      r.toolType.toLowerCase().includes(keyword)
    )
  }
  
  // 工位筛选
  if (dataFilterWorkstation.value) {
    records = records.filter(r => r.workstation === dataFilterWorkstation.value)
  }
  
  // 日期范围筛选
  if (dateRange.value && dateRange.value.length === 2) {
    const [start, end] = dateRange.value
    records = records.filter(r => {
      const recordDate = new Date(r.createTime)
      return recordDate >= start && recordDate <= end
    })
  }
  
  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return records.slice(start, end)
})

const totalRecords = computed(() => {
  return databaseRecords.value.length
})

// 获取策略标签类型
const getStrategyTagType = (strategy) => {
  if (strategy === 'DS控制') return 'success'
  if (strategy === '角度控制') return 'warning'
  return 'primary'
}

// 记录对话框
const recordDialogVisible = ref(false)
const editingRecord = ref(null)
const recordFormRef = ref(null)
const recordForm = ref({
  workstation: '',
  toolType: '',
  toolModel: '',
  torque: null,
  angle: null,
  strategy: '',
  result: 'OK',
  remark: ''
})

const recordRules = {
  workstation: [{ required: true, message: '请选择工位', trigger: 'change' }],
  toolType: [{ required: true, message: '请选择工具类型', trigger: 'change' }],
  toolModel: [{ required: true, message: '请输入工具型号', trigger: 'blur' }],
  torque: [{ required: true, message: '请输入目标扭矩', trigger: 'blur' }],
  strategy: [{ required: true, message: '请选择控制策略', trigger: 'change' }]
}

// 新增记录
const addRecord = () => {
  editingRecord.value = null
  recordForm.value = {
    workstation: '',
    toolType: '',
    toolModel: '',
    torque: null,
    angle: null,
    strategy: '',
    result: 'OK',
    remark: ''
  }
  recordDialogVisible.value = true
}

// 查看记录
const viewRecord = (record) => {
  ElMessageBox.alert(`
    <div style="line-height: 1.8;">
      <p><strong>工位名称:</strong> ${record.workstation}</p>
      <p><strong>工具类型:</strong> ${record.toolType}</p>
      <p><strong>工具型号:</strong> ${record.toolModel}</p>
      <p><strong>目标扭矩:</strong> ${record.torque} Nm</p>
      <p><strong>目标角度:</strong> ${record.angle}°</p>
      <p><strong>控制策略:</strong> ${record.strategy}</p>
      <p><strong>测试结果:</strong> ${record.result}</p>
      <p><strong>创建时间:</strong> ${record.createTime}</p>
      <p><strong>备注:</strong> ${record.remark || '无'}</p>
    </div>
  `, `记录详情 #${record.id}`, {
    confirmButtonText: '关闭',
    dangerouslyUseHTMLString: true
  })
}

// 编辑记录
const editRecord = (record) => {
  editingRecord.value = record
  recordForm.value = { ...record }
  recordDialogVisible.value = true
}

// 删除记录
const deleteRecord = (record) => {
  ElMessageBox.confirm(`确定要删除记录 #${record.id} 吗？`, '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = databaseRecords.value.findIndex(r => r.id === record.id)
    if (index !== -1) {
      databaseRecords.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 保存记录
const saveRecord = async () => {
  if (!recordFormRef.value) return
  
  await recordFormRef.value.validate((valid) => {
    if (valid) {
      if (editingRecord.value) {
        // 更新现有记录
        const index = databaseRecords.value.findIndex(r => r.id === editingRecord.value.id)
        if (index !== -1) {
          databaseRecords.value[index] = {
            ...databaseRecords.value[index],
            ...recordForm.value
          }
          ElMessage.success('记录已更新')
        }
      } else {
        // 新增记录
        const maxId = Math.max(...databaseRecords.value.map(r => r.id), 0)
        databaseRecords.value.push({
          id: maxId + 1,
          ...recordForm.value,
          createTime: new Date().toLocaleString('zh-CN')
        })
        ElMessage.success('记录已添加')
      }
      recordDialogVisible.value = false
    }
  })
}

// 导入数据
const importData = () => {
  ElMessageBox.alert('数据导入功能开发中...', '提示', {
    confirmButtonText: '确定',
    type: 'info'
  })
}

// 组件卸载时销毁图表
onMounted(() => {
  // 窗口大小变化时重绘图表
  window.addEventListener('resize', () => {
    if (curveChartInstance) {
      curveChartInstance.resize()
    }
  })
})
</script>

<style scoped>
.process-verification-page {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 页面标题 */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 0;
  color: #fff;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 24px;
}

.icon-wrapper {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.text-content h1 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 8px;
}

.text-content p {
  font-size: 16px;
  opacity: 0.9;
}

/* 主要内容 */
.main-content {
  padding: 40px 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 卡片通用样式 */
.filter-card,
.result-card,
.database-card {
  margin-bottom: 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
}

.card-header .el-icon {
  font-size: 20px;
  color: #409eff;
}

.card-header span {
  flex: 1;
}

/* 筛选表单 */
.filter-form {
  margin-top: 24px;
}

.tool-option,
.bolt-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.quick-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
}

/* 策略推荐 */
.strategy-section {
  margin-bottom: 40px;
}

.strategy-section h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #1a1a1a;
}

.strategy-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.strategy-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.strategy-best {
  border-color: #67c23a;
  background: linear-gradient(135deg, #fff 0%, #f0f9ff 100%);
}

.strategy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.strategy-header h4 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.strategy-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 16px;
}

.strategy-score {
  margin-top: 12px;
}

.strategy-score span {
  display: block;
  font-size: 13px;
  color: #666;
  margin-bottom: 8px;
}

/* 参数表格 */
.parameters-section {
  margin-bottom: 40px;
}

.parameters-section h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #1a1a1a;
}

.parameters-table {
  margin-bottom: 32px;
}

/* 曲线预览 */
.curve-preview {
  margin-bottom: 24px;
}

.curve-preview h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1a1a1a;
}

/* 注意事项 */
.notes-list {
  margin: 0;
  padding-left: 20px;
  line-height: 1.8;
}

.notes-list li {
  margin-bottom: 8px;
}

/* 改进建议 */
.improvement-section {
  margin-bottom: 40px;
}

.improvement-section h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #1a1a1a;
}

.timeline-content h4 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.timeline-content p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 8px;
}

/* 数据筛选 */
.data-filter {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

/* 响应式 */
@media (max-width: 1200px) {
  .agents-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }
  
  .text-content h1 {
    font-size: 28px;
  }
  
  .strategy-section .el-row {
    flex-direction: column;
  }
  
  .data-filter {
    flex-direction: column;
    align-items: stretch;
  }
  
  .data-filter .el-input,
  .data-filter .el-select,
  .data-filter .el-date-picker {
    width: 100% !important;
  }
}
</style>
