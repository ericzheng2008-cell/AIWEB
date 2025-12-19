<template>
  <div class="product-matrix-agent">
    <div class="matrix-header">
      <h2>📊 企业产品矩阵管理</h2>
      <div class="header-actions">
        <el-button @click="goHome">
          <el-icon><HomeFilled /></el-icon>
          返回主页
        </el-button>
        
        <el-button-group>
          <el-button 
            :type="dataSource === 'auto' ? 'primary' : 'default'" 
            @click="switchDataSource('auto')"
          >
            <el-icon><Refresh /></el-icon>
            自动同步
          </el-button>
          <el-button 
            :type="dataSource === 'manual' ? 'primary' : 'default'" 
            @click="switchDataSource('manual')"
          >
            <el-icon><Edit /></el-icon>
            手动输入
          </el-button>
        </el-button-group>
        
        <el-select v-model="timePeriod" style="width: 120px; margin-left: 12px;" @change="loadMatrixData">
          <el-option label="本月" value="month" />
          <el-option label="本季度" value="quarter" />
          <el-option label="本年" value="year" />
        </el-select>
        <el-select v-model="selectedCategory" style="width: 150px; margin-left: 12px;" @change="loadMatrixData">
          <el-option label="全部大类" :value="null" />
          <el-option 
            v-for="cat in productCategories" 
            :key="cat.id" 
            :label="cat.name" 
            :value="cat.id" 
          />
        </el-select>
        
        <el-dropdown style="margin-left: 12px;" @command="handleDataSourceCommand">
          <el-button>
            <el-icon><Upload /></el-icon>
            数据来源
            <el-icon class="el-icon--right"><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="syncSalesData">
                <el-icon><TrendCharts /></el-icon>
                同步销售数据表
              </el-dropdown-item>
              <el-dropdown-item command="syncProductDB">
                <el-icon><Box /></el-icon>
                同步产品数据库
              </el-dropdown-item>
              <el-dropdown-item command="syncKnowledgeBase">
                <el-icon><Reading /></el-icon>
                同步知识库
              </el-dropdown-item>
              <el-dropdown-item command="syncLearningData">
                <el-icon><Connection /></el-icon>
                同步学习库
              </el-dropdown-item>
              <el-dropdown-item divided command="syncAll">
                <el-icon><Check /></el-icon>
                同步所有数据源
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        
        <el-button type="success" @click="showAddProductDialog" v-if="dataSource === 'manual'">
          <el-icon><Plus /></el-icon>
          新增产品
        </el-button>
        <el-button type="primary" @click="refreshData">
          <el-icon><Refresh /></el-icon>
          刷新数据
        </el-button>
      </div>
    </div>

    <!-- 核心指标卡片 -->
    <el-row :gutter="16" class="metrics-row">
      <el-col :span="6">
        <el-card class="metric-card">
          <div class="metric-content">
            <el-icon :size="32" color="#409EFF"><TrendCharts /></el-icon>
            <div class="metric-info">
              <div class="metric-label">总销售额</div>
              <div class="metric-value">¥{{ (metrics.totalRevenue / 10000).toFixed(1) }}万</div>
              <div :class="['metric-trend', metrics.revenueTrend > 0 ? 'trend-up' : 'trend-down']">
                {{ metrics.revenueTrend > 0 ? '+' : '' }}{{ metrics.revenueTrend }}%
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="metric-card">
          <div class="metric-content">
            <el-icon :size="32" color="#67C23A"><Money /></el-icon>
            <div class="metric-info">
              <div class="metric-label">综合毛利率</div>
              <div class="metric-value">{{ metrics.avgGrossMargin }}%</div>
              <el-progress 
                :percentage="metrics.avgGrossMargin" 
                :color="getProgressColor(metrics.avgGrossMargin)" 
                :show-text="false"
                style="margin-top: 8px;"
              />
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="metric-card">
          <div class="metric-content">
            <el-icon :size="32" color="#E6A23C"><Wallet /></el-icon>
            <div class="metric-info">
              <div class="metric-label">现金流贡献</div>
              <div class="metric-value">¥{{ (metrics.cashFlow / 10000).toFixed(1) }}万</div>
              <div :class="['metric-trend', metrics.cashFlowTrend > 0 ? 'trend-up' : 'trend-down']">
                {{ metrics.cashFlowTrend > 0 ? '+' : '' }}{{ metrics.cashFlowTrend }}%
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="metric-card">
          <div class="metric-content">
            <el-icon :size="32" color="#F56C6C"><Warning /></el-icon>
            <div class="metric-info">
              <div class="metric-label">核心产品占比</div>
              <div class="metric-value">{{ metrics.coreProductRatio }}%</div>
              <div class="metric-subtitle">{{ metrics.coreProductCount }}个核心产品</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 主内容区域 -->
    <el-row :gutter="16" class="main-content">
      <!-- 左侧：收益-现金流矩阵图 -->
      <el-col :span="14">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>🎯 产品收益-现金流战略矩阵</span>
              <el-tooltip content="X轴：毛利率 | Y轴：现金流贡献率 | 气泡大小：销售额">
                <el-icon><QuestionFilled /></el-icon>
              </el-tooltip>
            </div>
          </template>
          <div class="matrix-chart" ref="matrixChart">
            <!-- 四象限背景 -->
            <div class="quadrant-background">
              <div class="quadrant q1" @click="filterByQuadrant('core')">
                <div class="quadrant-label">核心战略产品</div>
                <div class="quadrant-desc">高收益 + 高现金流</div>
              </div>
              <div class="quadrant q2" @click="filterByQuadrant('optimize')">
                <div class="quadrant-label">优化提升产品</div>
                <div class="quadrant-desc">高收益 + 低现金流</div>
              </div>
              <div class="quadrant q3" @click="filterByQuadrant('maintain')">
                <div class="quadrant-label">低投入维持</div>
                <div class="quadrant-desc">低收益 + 低现金流</div>
              </div>
              <div class="quadrant q4" @click="filterByQuadrant('potential')">
                <div class="quadrant-label">潜力产品</div>
                <div class="quadrant-desc">低收益 + 高现金流</div>
              </div>
            </div>

            <!-- 坐标轴 -->
            <div class="axis-x">
              <span class="axis-label">毛利率 →</span>
            </div>
            <div class="axis-y">
              <span class="axis-label">↑ 现金流贡献</span>
            </div>

            <!-- 产品气泡 -->
            <div 
              v-for="product in matrixProducts" 
              :key="product.id"
              class="product-bubble"
              :style="{
                left: product.x + '%',
                bottom: product.y + '%',
                width: product.size + 'px',
                height: product.size + 'px',
                background: getQuadrantColor(product.quadrant),
                boxShadow: selectedProduct?.id === product.id ? '0 0 20px rgba(64, 158, 255, 0.8)' : 'none'
              }"
              @click="selectProduct(product)"
              @mouseenter="showProductTooltip(product, $event)"
              @mouseleave="hideProductTooltip"
            >
              <div class="bubble-label">{{ product.shortName }}</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：AI智能预测与建议 -->
      <el-col :span="10">
        <el-card>
          <template #header>
            <span>🤖 AI智能分析与推荐</span>
          </template>
          <div class="ai-recommendations">
            <!-- 战略建议 -->
            <div class="ai-section">
              <h4>🎯 战略建议</h4>
              <div 
                v-for="rec in aiRecommendations.strategic" 
                :key="rec.id"
                class="recommendation-item strategic"
              >
                <div class="rec-header">
                  <el-icon :color="rec.color"><Star /></el-icon>
                  <span class="rec-title">{{ rec.title }}</span>
                </div>
                <div class="rec-content">{{ rec.content }}</div>
                <el-tag :type="rec.priority" size="small">{{ rec.priorityText }}</el-tag>
              </div>
            </div>

            <!-- 运营优化 -->
            <div class="ai-section">
              <h4>⚡ 运营优化</h4>
              <div 
                v-for="rec in aiRecommendations.operational" 
                :key="rec.id"
                class="recommendation-item operational"
              >
                <div class="rec-header">
                  <el-icon :color="rec.color"><Tools /></el-icon>
                  <span class="rec-title">{{ rec.title }}</span>
                </div>
                <div class="rec-content">{{ rec.content }}</div>
                <div class="rec-actions">
                  <el-button size="small" @click="applyRecommendation(rec)">应用建议</el-button>
                </div>
              </div>
            </div>

            <!-- 异常预警 -->
            <div class="ai-section">
              <h4>⚠️ 异常预警</h4>
              <div 
                v-for="alert in aiRecommendations.alerts" 
                :key="alert.id"
                class="recommendation-item alert"
              >
                <div class="rec-header">
                  <el-icon :color="alert.color"><Warning /></el-icon>
                  <span class="rec-title">{{ alert.title }}</span>
                </div>
                <div class="rec-content">{{ alert.content }}</div>
                <el-tag :type="alert.severity" size="small">{{ alert.severityText }}</el-tag>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 大类对比分析 -->
    <el-card class="category-comparison">
      <template #header>
        <div class="card-header">
          <span>📊 产品大类对比分析</span>
          <el-radio-group v-model="comparisonMetric" size="small">
            <el-radio-button label="revenue">销售额</el-radio-button>
            <el-radio-button label="margin">毛利</el-radio-button>
            <el-radio-button label="cashFlow">现金流</el-radio-button>
          </el-radio-group>
        </div>
      </template>
      <div class="category-bars">
        <div 
          v-for="cat in categoryComparison" 
          :key="cat.id"
          class="category-bar-item"
          @click="drilldownCategory(cat)"
        >
          <div class="category-info">
            <span class="category-name">{{ cat.name }}</span>
            <span class="category-value">¥{{ (cat[comparisonMetric] / 10000).toFixed(1) }}万</span>
          </div>
          <div class="bar-container">
            <div 
              class="bar-fill"
              :style="{
                width: cat.percentage + '%',
                background: getCategoryGradient(cat.id)
              }"
            >
              <span class="bar-label">{{ cat.percentage }}%</span>
            </div>
          </div>
          <div class="category-metrics">
            <el-tag size="small" type="info">{{ cat.productCount }}个产品</el-tag>
            <el-tag size="small" :type="cat.trend > 0 ? 'success' : 'danger'">
              {{ cat.trend > 0 ? '+' : '' }}{{ cat.trend }}%
            </el-tag>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 单产品详情面板 -->
    <el-dialog
      v-model="showProductDetail"
      :title="selectedProduct?.name || '产品详情'"
      width="900px"
      :close-on-click-modal="false"
    >
      <div v-if="selectedProduct" class="product-detail">
        <!-- 产品基础信息 -->
        <el-descriptions :column="2" border>
          <el-descriptions-item label="产品大类">{{ selectedProduct.categoryName }}</el-descriptions-item>
          <el-descriptions-item label="战略定位">
            <el-tag :type="getQuadrantType(selectedProduct.quadrant)">
              {{ getQuadrantName(selectedProduct.quadrant) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="销售额">¥{{ (selectedProduct.revenue / 10000).toFixed(2) }}万</el-descriptions-item>
          <el-descriptions-item label="毛利率">{{ selectedProduct.grossMargin }}%</el-descriptions-item>
          <el-descriptions-item label="净利润">¥{{ (selectedProduct.netProfit / 10000).toFixed(2) }}万</el-descriptions-item>
          <el-descriptions-item label="现金流贡献">¥{{ (selectedProduct.cashFlowContribution / 10000).toFixed(2) }}万</el-descriptions-item>
          <el-descriptions-item label="库存周转天数">{{ selectedProduct.inventoryDays }}天</el-descriptions-item>
          <el-descriptions-item label="回款周期">{{ selectedProduct.paymentCycle }}天</el-descriptions-item>
        </el-descriptions>

        <!-- 趋势图表 -->
        <div class="detail-charts">
          <h4>📈 销售与利润趋势</h4>
          <div class="trend-chart">
            <div 
              v-for="(month, index) in selectedProduct.trends" 
              :key="index"
              class="trend-bar"
            >
              <div class="bar-group">
                <div 
                  class="bar revenue-bar"
                  :style="{ height: (month.revenue / selectedProduct.maxRevenue * 100) + '%' }"
                  :title="'销售额: ¥' + (month.revenue / 10000).toFixed(1) + '万'"
                />
                <div 
                  class="bar profit-bar"
                  :style="{ height: (month.profit / selectedProduct.maxRevenue * 100) + '%' }"
                  :title="'毛利: ¥' + (month.profit / 10000).toFixed(1) + '万'"
                />
              </div>
              <div class="month-label">{{ month.month }}</div>
            </div>
          </div>
          <div class="chart-legend">
            <span class="legend-item"><span class="legend-color revenue"></span>销售额</span>
            <span class="legend-item"><span class="legend-color profit"></span>毛利</span>
          </div>
        </div>

        <!-- AI推荐动作 -->
        <div class="product-actions">
          <h4>🤖 AI推荐优化动作</h4>
          <el-space wrap>
            <el-tag 
              v-for="action in selectedProduct.aiActions" 
              :key="action.id"
              :type="action.type"
              effect="dark"
              size="large"
              style="cursor: pointer;"
              @click="executeAction(action)"
            >
              {{ action.icon }} {{ action.text }}
            </el-tag>
          </el-space>
        </div>
      </div>

      <template #footer>
        <el-button @click="showProductDetail = false">关闭</el-button>
        <el-button type="primary" @click="exportProductReport">导出报告</el-button>
      </template>
    </el-dialog>

    <!-- 产品tooltip -->
    <div 
      v-show="tooltipVisible" 
      class="product-tooltip"
      :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }"
    >
      <div v-if="tooltipProduct">
        <div class="tooltip-title">{{ tooltipProduct.name }}</div>
        <div class="tooltip-item">销售额: ¥{{ (tooltipProduct.revenue / 10000).toFixed(1) }}万</div>
        <div class="tooltip-item">毛利率: {{ tooltipProduct.grossMargin }}%</div>
        <div class="tooltip-item">现金流: ¥{{ (tooltipProduct.cashFlowContribution / 10000).toFixed(1) }}万</div>
        <div class="tooltip-item">战略定位: {{ getQuadrantName(tooltipProduct.quadrant) }}</div>
      </div>
    </div>

    <!-- 手动添加/编辑产品对话框 -->
    <el-dialog
      v-model="addProductDialogVisible"
      :title="productForm.id ? '编辑产品' : '新增产品'"
      width="700px"
      :close-on-click-modal="false"
    >
      <el-form :model="productForm" label-width="120px">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="产品名称" required>
              <el-input v-model="productForm.name" placeholder="请输入产品名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品大类" required>
              <el-select v-model="productForm.categoryId" placeholder="请选择产品大类" style="width: 100%;">
                <el-option 
                  v-for="cat in productCategories" 
                  :key="cat.id" 
                  :label="cat.name" 
                  :value="cat.id" 
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">财务数据</el-divider>
        
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="销售额（万元）">
              <el-input-number 
                v-model="productForm.revenue" 
                :min="0" 
                :step="1"
                :controls="true"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="毛利率（%）">
              <el-input-number 
                v-model="productForm.grossMargin" 
                :min="0" 
                :max="100"
                :step="0.1"
                :precision="1"
                :controls="true"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="净利润（万元）">
              <el-input-number 
                v-model="productForm.netProfit" 
                :min="0" 
                :step="1"
                :controls="true"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="现金流贡献（万元）">
              <el-input-number 
                v-model="productForm.cashFlowContribution" 
                :min="0" 
                :step="1"
                :controls="true"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-divider content-position="left">运营数据</el-divider>
        
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="库存周转天数">
              <el-input-number 
                v-model="productForm.inventoryDays" 
                :min="0" 
                :step="1"
                :controls="true"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="回款周期（天）">
              <el-input-number 
                v-model="productForm.paymentCycle" 
                :min="0" 
                :step="1"
                :controls="true"
                style="width: 100%;"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-alert
          title="数据来源提示"
          type="info"
          :closable="false"
          show-icon
          style="margin-top: 16px;"
        >
          <template #default>
            <div style="font-size: 13px; line-height: 1.6;">
              <p style="margin: 0 0 8px 0;">💡 您可以从以下数据源获取数据：</p>
              <ul style="margin: 0; padding-left: 20px;">
                <li>销售数据表：自动获取销售额、毛利等财务数据</li>
                <li>产品数据库：自动获取产品基本信息和分类</li>
                <li>知识库：获取产品技术参数和市场分析数据</li>
                <li>学习库：获取历史销售趋势和预测数据</li>
              </ul>
              <p style="margin: 8px 0 0 0;">点击顶部"数据来源"按钮可以自动同步这些数据</p>
            </div>
          </template>
        </el-alert>
      </el-form>

      <template #footer>
        <el-button @click="addProductDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addProduct">
          {{ productForm.id ? '保存' : '添加' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  TrendCharts, Money, Wallet, Warning, Refresh, QuestionFilled,
  Star, Tools, Filter, DocumentCopy, Edit, Upload, ArrowDown,
  Plus, Box, Reading, Connection, Check, HomeFilled
} from '@element-plus/icons-vue'
import { useProductMatrixStore } from '../store/productMatrix'
import { useProductsServicesStore } from '../store/productsServices'
import { useKnowledgeBase } from '../store/knowledgeBase'
import { useTighteningDataStore } from '../store/tighteningData'

const router = useRouter()
const matrixStore = useProductMatrixStore()
const productsStore = useProductsServicesStore()
const knowledgeStore = useKnowledgeBase()
const tighteningStore = useTighteningDataStore()

// 状态管理
const timePeriod = ref('month')
const selectedCategory = ref(null)
const comparisonMetric = ref('revenue')
const showProductDetail = ref(false)
const selectedProduct = ref(null)
const dataSource = ref('auto') // 'auto' | 'manual'
const addProductDialogVisible = ref(false)
const productForm = reactive({
  name: '',
  categoryId: null,
  revenue: 0,
  grossMargin: 0,
  netProfit: 0,
  cashFlowContribution: 0,
  inventoryDays: 0,
  paymentCycle: 0
})

// Tooltip
const tooltipVisible = ref(false)
const tooltipProduct = ref(null)
const tooltipX = ref(0)
const tooltipY = ref(0)

// 核心指标
const metrics = reactive({
  totalRevenue: 0,
  revenueTrend: 0,
  avgGrossMargin: 0,
  cashFlow: 0,
  cashFlowTrend: 0,
  coreProductRatio: 0,
  coreProductCount: 0
})

// 产品分类
const productCategories = computed(() => productsStore.level1Categories.map(cat => ({
  id: cat.id,
  name: cat.name['zh-CN']
})))

// 矩阵产品数据
const matrixProducts = computed(() => matrixStore.getMatrixProducts(timePeriod.value, selectedCategory.value))

// 大类对比数据
const categoryComparison = computed(() => matrixStore.getCategoryComparison(comparisonMetric.value, timePeriod.value))

// AI推荐
const aiRecommendations = computed(() => matrixStore.getAIRecommendations())

// 方法
const loadMatrixData = async () => {
  try {
    await matrixStore.loadData(timePeriod.value, selectedCategory.value)
    updateMetrics()
    ElMessage.success('数据加载成功')
  } catch (error) {
    ElMessage.error('数据加载失败: ' + error.message)
  }
}

const updateMetrics = () => {
  const data = matrixStore.getMetrics()
  Object.assign(metrics, data)
}

// 返回主页
const goHome = () => {
  router.push('/')
  ElMessage.success('返回主页')
}

const refreshData = () => {
  loadMatrixData()
}

const selectProduct = (product) => {
  selectedProduct.value = product
  showProductDetail.value = true
}

const showProductTooltip = (product, event) => {
  tooltipProduct.value = product
  tooltipX.value = event.clientX + 15
  tooltipY.value = event.clientY + 15
  tooltipVisible.value = true
}

const hideProductTooltip = () => {
  tooltipVisible.value = false
}

const filterByQuadrant = (quadrant) => {
  matrixStore.setQuadrantFilter(quadrant)
}

const drilldownCategory = (category) => {
  selectedCategory.value = category.id
  loadMatrixData()
}

const applyRecommendation = (recommendation) => {
  ElMessageBox.confirm(
    `确定要应用建议"${recommendation.title}"吗？`,
    '确认操作',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    matrixStore.applyRecommendation(recommendation.id)
    ElMessage.success('建议已应用，系统将自动优化相关策略')
  }).catch(() => {})
}

const executeAction = (action) => {
  ElMessage.success(`正在执行: ${action.text}`)
  matrixStore.executeProductAction(selectedProduct.value.id, action.id)
}

const exportProductReport = () => {
  matrixStore.exportProductReport(selectedProduct.value.id)
  ElMessage.success('报告导出成功')
}

// 数据源切换
const switchDataSource = (source) => {
  dataSource.value = source
  if (source === 'auto') {
    loadMatrixData()
    ElMessage.info('已切换到自动同步模式，将从各数据源自动获取数据')
  } else {
    ElMessage.info('已切换到手动输入模式，您可以手动添加和编辑产品数据')
  }
}

// 数据源命令处理
const handleDataSourceCommand = async (command) => {
  const loading = ElMessage({
    message: '正在同步数据...',
    type: 'info',
    duration: 0
  })
  
  try {
    switch(command) {
      case 'syncSalesData':
        await matrixStore.syncFromSalesData()
        ElMessage.success('销售数据同步成功')
        break
      case 'syncProductDB':
        await matrixStore.syncFromProductDatabase()
        ElMessage.success('产品数据库同步成功')
        break
      case 'syncKnowledgeBase':
        await matrixStore.syncFromKnowledgeBase()
        ElMessage.success('知识库同步成功')
        break
      case 'syncLearningData':
        await matrixStore.syncFromLearningLibrary()
        ElMessage.success('学习库同步成功')
        break
      case 'syncAll':
        await Promise.all([
          matrixStore.syncFromSalesData(),
          matrixStore.syncFromProductDatabase(),
          matrixStore.syncFromKnowledgeBase(),
          matrixStore.syncFromLearningLibrary()
        ])
        ElMessage.success('所有数据源同步成功')
        break
    }
    await loadMatrixData()
  } catch (error) {
    ElMessage.error('数据同步失败: ' + error.message)
  } finally {
    loading.close()
  }
}

// 显示添加产品对话框
const showAddProductDialog = () => {
  Object.assign(productForm, {
    name: '',
    categoryId: null,
    revenue: 0,
    grossMargin: 0,
    netProfit: 0,
    cashFlowContribution: 0,
    inventoryDays: 0,
    paymentCycle: 0
  })
  addProductDialogVisible.value = true
}

// 添加产品
const addProduct = () => {
  if (!productForm.name || !productForm.categoryId) {
    ElMessage.warning('请填写产品名称和选择产品大类')
    return
  }
  
  matrixStore.addProduct({
    ...productForm,
    id: Date.now().toString(),
    createTime: new Date().toISOString()
  })
  
  addProductDialogVisible.value = false
  loadMatrixData()
  ElMessage.success('产品添加成功')
}

// 编辑产品
const editProduct = (product) => {
  Object.assign(productForm, product)
  addProductDialogVisible.value = true
}

// 删除产品
const deleteProduct = (productId) => {
  ElMessageBox.confirm('确定要删除这个产品吗？', '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    matrixStore.deleteProduct(productId)
    loadMatrixData()
    ElMessage.success('产品删除成功')
  }).catch(() => {})
}

// 辅助方法
const getProgressColor = (percentage) => {
  if (percentage >= 30) return '#67C23A'
  if (percentage >= 20) return '#E6A23C'
  return '#F56C6C'
}

const getQuadrantColor = (quadrant) => {
  const colors = {
    core: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    optimize: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    maintain: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    potential: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  }
  return colors[quadrant] || '#ccc'
}

const getQuadrantName = (quadrant) => {
  const names = {
    core: '核心战略产品',
    optimize: '优化提升产品',
    maintain: '低投入维持',
    potential: '潜力产品'
  }
  return names[quadrant] || '未分类'
}

const getQuadrantType = (quadrant) => {
  const types = {
    core: 'success',
    optimize: 'warning',
    maintain: 'info',
    potential: 'primary'
  }
  return types[quadrant] || 'info'
}

const getCategoryGradient = (categoryId) => {
  const gradients = [
    'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(90deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(90deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(90deg, #30cfd0 0%, #330867 100%)'
  ]
  return gradients[(categoryId - 1) % gradients.length]
}

onMounted(() => {
  loadMatrixData()
})
</script>

<style scoped>
.product-matrix-agent {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.matrix-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: #fff;
}

.matrix-header h2 {
  margin: 0;
  font-size: 24px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 指标卡片 */
.metrics-row {
  margin-bottom: 20px;
}

.metric-card {
  border-radius: 12px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.metric-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.metric-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.metric-info {
  flex: 1;
}

.metric-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 4px;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.metric-trend {
  font-size: 14px;
  font-weight: 500;
}

.trend-up {
  color: #67C23A;
}

.trend-down {
  color: #F56C6C;
}

.metric-subtitle {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}

/* 矩阵图表 */
.main-content {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.matrix-chart {
  position: relative;
  width: 100%;
  height: 500px;
  background: linear-gradient(to right, #f9f9f9 50%, #fff 50%), 
              linear-gradient(to bottom, #fff 50%, #f9f9f9 50%);
  background-size: 100% 100%;
}

/* 四象限背景 */
.quadrant-background {
  position: absolute;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}

.quadrant {
  position: relative;
  border: 1px solid #e4e7ed;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0.3;
}

.quadrant:hover {
  opacity: 0.6;
}

.q1 {
  background: linear-gradient(135deg, rgba(103, 194, 58, 0.1) 0%, rgba(103, 194, 58, 0.05) 100%);
}

.q2 {
  background: linear-gradient(135deg, rgba(230, 162, 60, 0.1) 0%, rgba(230, 162, 60, 0.05) 100%);
}

.q3 {
  background: linear-gradient(135deg, rgba(144, 147, 153, 0.1) 0%, rgba(144, 147, 153, 0.05) 100%);
}

.q4 {
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.1) 0%, rgba(64, 158, 255, 0.05) 100%);
}

.quadrant-label {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}

.quadrant-desc {
  font-size: 12px;
  color: #909399;
}

/* 坐标轴 */
.axis-x, .axis-y {
  position: absolute;
  color: #606266;
  font-size: 14px;
  font-weight: 500;
  z-index: 1;
}

.axis-x {
  bottom: 10px;
  right: 10px;
}

.axis-y {
  top: 10px;
  left: 10px;
}

/* 产品气泡 */
.product-bubble {
  position: absolute;
  border-radius: 50%;
  transform: translate(-50%, 50%);
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  border: 2px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.product-bubble:hover {
  transform: translate(-50%, 50%) scale(1.15);
  z-index: 20;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}

.bubble-label {
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  text-align: center;
  line-height: 1.2;
  padding: 4px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

/* AI推荐 */
.ai-recommendations {
  max-height: 500px;
  overflow-y: auto;
}

.ai-section {
  margin-bottom: 24px;
}

.ai-section h4 {
  margin: 0 0 12px 0;
  color: #303133;
  font-size: 16px;
}

.recommendation-item {
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 8px;
  border-left: 3px solid;
  background: #f9f9f9;
  transition: all 0.3s;
}

.recommendation-item:hover {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.recommendation-item.strategic {
  border-left-color: #409EFF;
}

.recommendation-item.operational {
  border-left-color: #67C23A;
}

.recommendation-item.alert {
  border-left-color: #F56C6C;
}

.rec-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.rec-title {
  font-weight: 600;
  color: #303133;
}

.rec-content {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
  line-height: 1.6;
}

.rec-actions {
  margin-top: 8px;
}

/* 大类对比 */
.category-comparison {
  margin-bottom: 20px;
}

.category-bars {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.category-bar-item {
  cursor: pointer;
  transition: all 0.3s;
  padding: 12px;
  border-radius: 8px;
  background: #fff;
}

.category-bar-item:hover {
  background: #f5f7fa;
  transform: translateX(5px);
}

.category-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.category-name {
  font-weight: 600;
  color: #303133;
}

.category-value {
  font-weight: 600;
  color: #409EFF;
}

.bar-container {
  height: 24px;
  background: #e4e7ed;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 8px;
}

.bar-fill {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 12px;
  transition: width 0.8s ease-out;
}

.bar-label {
  color: #fff;
  font-weight: 600;
  font-size: 12px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.category-metrics {
  display: flex;
  gap: 8px;
}

/* 产品详情 */
.product-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-charts h4 {
  margin: 0 0 16px 0;
  color: #303133;
}

.trend-chart {
  display: flex;
  gap: 12px;
  height: 200px;
  align-items: flex-end;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 12px;
}

.trend-bar {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.bar-group {
  display: flex;
  gap: 4px;
  align-items: flex-end;
  height: 100%;
}

.bar {
  width: 16px;
  border-radius: 4px 4px 0 0;
  transition: all 0.3s;
  cursor: pointer;
}

.bar:hover {
  opacity: 0.8;
  transform: scaleY(1.05);
}

.revenue-bar {
  background: linear-gradient(to top, #409EFF, #66b1ff);
}

.profit-bar {
  background: linear-gradient(to top, #67C23A, #95d475);
}

.month-label {
  font-size: 11px;
  color: #909399;
}

.chart-legend {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #606266;
}

.legend-color {
  width: 16px;
  height: 12px;
  border-radius: 2px;
}

.legend-color.revenue {
  background: #409EFF;
}

.legend-color.profit {
  background: #67C23A;
}

.product-actions h4 {
  margin: 0 0 12px 0;
  color: #303133;
}

/* Tooltip */
.product-tooltip {
  position: fixed;
  background: rgba(0, 0, 0, 0.85);
  color: #fff;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13px;
  z-index: 9999;
  pointer-events: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.tooltip-title {
  font-weight: 600;
  margin-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 4px;
}

.tooltip-item {
  margin: 4px 0;
  line-height: 1.5;
}

/* 响应式 */
@media (max-width: 1200px) {
  .main-content .el-col:first-child {
    margin-bottom: 16px;
  }
}
</style>
