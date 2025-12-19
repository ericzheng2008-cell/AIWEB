<template>
  <div class="product-lifecycle-panel">
    <el-card shadow="hover" style="margin-bottom: 20px">
      <template #header>
        <div class="card-header">
          <span><el-icon><Box /></el-icon> 产品动态生命周期管理</span>
          <el-button type="primary" @click="runAnalysis">
            <el-icon><Refresh /></el-icon> 运行分析
          </el-button>
        </div>
      </template>

      <!-- 配置区 -->
      <el-form :model="config" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="分析模式">
              <el-select v-model="config.mode" style="width: 100%">
                <el-option label="单品分析" value="single" />
                <el-option label="产品组合" value="portfolio" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产品类别">
              <el-select v-model="config.category" style="width: 100%" clearable>
                <el-option label="全部" value="all" />
                <el-option label="拧紧工具" value="tools" />
                <el-option label="套筒配件" value="sockets" />
                <el-option label="智能设备" value="smart" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="时间范围">
              <el-select v-model="config.timeRange" style="width: 100%">
                <el-option label="最近3个月" value="3m" />
                <el-option label="最近6个月" value="6m" />
                <el-option label="最近1年" value="1y" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="分析维度">
          <el-checkbox-group v-model="config.dimensions">
            <el-checkbox label="lifecycle">生命周期分析</el-checkbox>
            <el-checkbox label="bcg">BCG矩阵</el-checkbox>
            <el-checkbox label="pricing">动态定价</el-checkbox>
            <el-checkbox label="inventory">库存优化</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 分析结果 -->
    <el-tabs v-if="results" v-model="activeTab" type="border-card">
      <!-- 1. 生命周期分析 -->
      <el-tab-pane label="生命周期分析" name="lifecycle">
        <div v-if="results.lifecycle" class="lifecycle-results">
          <!-- 产品组合分布 -->
          <el-row :gutter="20" class="distribution-cards">
            <el-col :span="6" v-for="(count, stage) in results.lifecycle.distribution" :key="stage">
              <el-card shadow="hover" :body-style="{ padding: '15px' }">
                <el-statistic :title="stage" :value="count">
                  <template #suffix>
                    <span style="font-size: 14px">个产品</span>
                  </template>
                </el-statistic>
                <el-progress
                  :percentage="(count / results.lifecycle.totalProducts * 100).toFixed(0)"
                  :color="getStageColor(stage)"
                  style="margin-top: 10px"
                />
              </el-card>
            </el-col>
          </el-row>

          <!-- 生命周期分布图 -->
          <div class="chart-section">
            <h4><el-icon><PieChart /></el-icon> 生命周期阶段分布</h4>
            <div ref="lifecycleChartRef" style="width: 100%; height: 400px"></div>
          </div>

          <!-- 产品详情表格 -->
          <el-table :data="results.lifecycle.products" border stripe style="margin-top: 20px">
            <el-table-column prop="name" label="产品名称" width="200" fixed />
            <el-table-column label="生命周期阶段" width="120">
              <template #default="{ row }">
                <el-tag :type="getStageTagType(row.lifecycle.currentStage)">
                  {{ row.lifecycle.currentStage }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="置信度" width="100">
              <template #default="{ row }">
                {{ (row.lifecycle.confidence * 100).toFixed(0) }}%
              </template>
            </el-table-column>
            <el-table-column prop="monthsSinceLaunch" label="上市时长(月)" width="120" />
            <el-table-column label="增长率" width="100">
              <template #default="{ row }">
                <el-tag :type="row.growthRate > 0.2 ? 'success' : row.growthRate > 0 ? '' : 'danger'">
                  {{ (row.growthRate * 100).toFixed(1) }}%
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="利润率" width="100">
              <template #default="{ row }">
                {{ (row.profitMargin * 100).toFixed(1) }}%
              </template>
            </el-table-column>
            <el-table-column label="市场份额" width="100">
              <template #default="{ row }">
                {{ (row.marketShare * 100).toFixed(2) }}%
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link @click="viewProductDetail(row)">
                  查看详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 风险警告 -->
          <el-alert
            v-if="results.lifecycle.riskScore > 50"
            type="warning"
            :title="`产品组合风险评分: ${results.lifecycle.riskScore}分`"
            :closable="false"
            style="margin-top: 20px"
          >
            <template #default>
              <div v-for="rec in results.lifecycle.recommendations" :key="rec.message">
                • {{ rec.message }}
              </div>
            </template>
          </el-alert>
        </div>

        <el-empty v-else description="请点击'运行分析'并勾选'生命周期分析'" />
      </el-tab-pane>

      <!-- 2. BCG矩阵 -->
      <el-tab-pane label="BCG矩阵" name="bcg">
        <div v-if="results.bcg" class="bcg-results">
          <!-- BCG象限统计 -->
          <el-row :gutter="20" class="bcg-stats">
            <el-col :span="6" v-for="(products, quadrant) in results.bcg.distribution" :key="quadrant">
              <el-card shadow="hover" :body-style="{ padding: '15px' }">
                <el-statistic :title="quadrant" :value="products.length">
                  <template #prefix>
                    <el-icon :color="getQuadrantColor(quadrant)" style="font-size: 24px">
                      <Star v-if="quadrant === '明星'" />
                      <Money v-else-if="quadrant === '现金牛'" />
                      <QuestionFilled v-else-if="quadrant === '问题'" />
                      <Delete v-else />
                    </el-icon>
                  </template>
                </el-statistic>
                <div style="margin-top: 10px; font-size: 12px; color: #909399">
                  总销售额: ¥{{ formatNumber(calculateQuadrantRevenue(products)) }}
                </div>
              </el-card>
            </el-col>
          </el-row>

          <!-- BCG矩阵散点图 -->
          <div class="chart-section">
            <h4><el-icon><Grid /></el-icon> BCG战略矩阵</h4>
            <div ref="bcgChartRef" style="width: 100%; height: 500px"></div>
          </div>

          <!-- 战略建议 -->
          <el-card shadow="never" style="margin-top: 20px">
            <template #header>
              <span><el-icon><Document /></el-icon> 战略建议</span>
            </template>
            <el-timeline>
              <el-timeline-item
                v-for="(rec, index) in results.bcg.strategyRecommendations"
                :key="index"
                :type="rec.type"
                :timestamp="rec.priority"
              >
                {{ rec.message }}
              </el-timeline-item>
            </el-timeline>
          </el-card>
        </div>

        <el-empty v-else description="请点击'运行分析'并勾选'BCG矩阵'" />
      </el-tab-pane>

      <!-- 3. 动态定价 -->
      <el-tab-pane label="动态定价" name="pricing">
        <div v-if="results.pricing" class="pricing-results">
          <el-table :data="results.pricing" border stripe>
            <el-table-column prop="name" label="产品名称" width="200" fixed />
            <el-table-column label="当前价格" width="120">
              <template #default="{ row }">
                ¥{{ row.currentPrice }}
              </template>
            </el-table-column>
            <el-table-column label="建议价格" width="120">
              <template #default="{ row }">
                <el-tag type="success" size="large">
                  ¥{{ row.pricing.recommendedPrice }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="价格区间" width="200">
              <template #default="{ row }">
                <el-slider
                  :model-value="row.pricing.recommendedPrice"
                  :min="row.pricing.priceRange.min"
                  :max="row.pricing.priceRange.max"
                  :show-tooltip="false"
                  disabled
                />
                <div style="display: flex; justify-content: space-between; font-size: 12px; color: #909399">
                  <span>¥{{ row.pricing.priceRange.min.toFixed(0) }}</span>
                  <span>¥{{ row.pricing.priceRange.max.toFixed(0) }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="预期影响" width="250">
              <template #default="{ row }">
                <div style="font-size: 12px">
                  <div>价格变化: <el-tag size="small">{{ row.pricing.expectedImpact.priceChange }}</el-tag></div>
                  <div>需求变化: <el-tag size="small">{{ row.pricing.expectedImpact.demandChange }}</el-tag></div>
                  <div>收益变化: <el-tag size="small" type="success">{{ row.pricing.expectedImpact.revenueChange }}</el-tag></div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="定价依据" width="300">
              <template #default="{ row }">
                <el-space wrap>
                  <el-tag
                    v-for="reason in row.pricing.reasoning"
                    :key="reason.factor"
                    size="small"
                  >
                    {{ reason.factor }}: ¥{{ reason.price }} ({{ reason.weight }})
                  </el-tag>
                </el-space>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="{ row }">
                <el-button type="primary" link @click="applyPricing(row)">
                  应用建议
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-empty v-else description="请点击'运行分析'并勾选'动态定价'" />
      </el-tab-pane>

      <!-- 4. 库存优化 -->
      <el-tab-pane label="库存优化" name="inventory">
        <div v-if="results.inventory" class="inventory-results">
          <el-table :data="results.inventory" border stripe>
            <el-table-column prop="name" label="产品名称" width="200" fixed />
            <el-table-column label="当前库存" width="120">
              <template #default="{ row }">
                <el-tag :type="getInventoryTagType(row.inventory.currentInventory, row.inventory.reorderPoint)">
                  {{ row.inventory.currentInventory }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="经济订货量" width="120">
              <template #default="{ row }">
                {{ row.inventory.eoq }}
              </template>
            </el-table-column>
            <el-table-column label="安全库存" width="120">
              <template #default="{ row }">
                {{ row.inventory.safetyStock }}
              </template>
            </el-table-column>
            <el-table-column label="再订货点" width="120">
              <template #default="{ row }">
                {{ row.inventory.reorderPoint }}
              </template>
            </el-table-column>
            <el-table-column label="周转率" width="100">
              <template #default="{ row }">
                <el-tag :type="row.inventory.turnoverRate > 6 ? 'success' : 'warning'">
                  {{ row.inventory.turnoverRate }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="健康度" width="150">
              <template #default="{ row }">
                <el-progress
                  :percentage="row.inventory.healthScore"
                  :color="getHealthColor(row.inventory.healthScore)"
                />
              </template>
            </el-table-column>
            <el-table-column label="建议" width="300">
              <template #default="{ row }">
                <div v-for="rec in row.inventory.recommendations" :key="rec.message" style="margin-bottom: 5px">
                  <el-alert :type="rec.type" :closable="false" :title="rec.message" style="padding: 5px">
                    <template #default>
                      <div style="font-size: 12px">{{ rec.action }}</div>
                    </template>
                  </el-alert>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-empty v-else description="请点击'运行分析'并勾选'库存优化'" />
      </el-tab-pane>

      <!-- 5. 综合报告 -->
      <el-tab-pane label="综合报告" name="summary">
        <div v-if="results.summary" class="summary-results">
          <!-- 产品组合健康度 -->
          <el-card shadow="hover" style="margin-bottom: 20px">
            <template #header>
              <span><el-icon><TrendCharts /></el-icon> 产品组合健康度评估</span>
            </template>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-statistic title="综合得分" :value="results.summary.portfolioHealth.score" suffix="分">
                  <template #prefix>
                    <el-icon :color="getHealthColor(results.summary.portfolioHealth.score)">
                      <Odometer />
                    </el-icon>
                  </template>
                </el-statistic>
              </el-col>
              <el-col :span="6">
                <el-statistic title="健康等级" :value="results.summary.portfolioHealth.level" />
              </el-col>
              <el-col :span="12">
                <div style="padding: 10px">
                  <div style="margin-bottom: 10px">
                    <span>高表现产品: </span>
                    <el-tag type="success">{{ results.summary.portfolioHealth.breakdown.highPerformers }}个</el-tag>
                  </div>
                  <div style="margin-bottom: 10px">
                    <span>平均表现产品: </span>
                    <el-tag>{{ results.summary.portfolioHealth.breakdown.average }}个</el-tag>
                  </div>
                  <div>
                    <span>低表现产品: </span>
                    <el-tag type="danger">{{ results.summary.portfolioHealth.breakdown.underperformers }}个</el-tag>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-card>

          <!-- 综合建议 -->
          <el-card shadow="hover">
            <template #header>
              <span><el-icon><List /></el-icon> 综合优化建议</span>
            </template>
            <el-collapse accordion>
              <el-collapse-item
                v-for="(rec, index) in results.summary.recommendations"
                :key="index"
                :title="rec.message"
                :name="index"
              >
                <el-descriptions :column="1" border>
                  <el-descriptions-item label="类型">
                    <el-tag :type="rec.type">{{ rec.type }}</el-tag>
                  </el-descriptions-item>
                  <el-descriptions-item label="涉及产品">
                    <el-space wrap>
                      <el-tag v-for="p in rec.products" :key="p" size="small">{{ p }}</el-tag>
                    </el-space>
                  </el-descriptions-item>
                </el-descriptions>
              </el-collapse-item>
            </el-collapse>
          </el-card>

          <!-- 导出报告 -->
          <div style="text-align: center; margin-top: 30px">
            <el-button type="primary" size="large" @click="exportReport">
              <el-icon><Download /></el-icon> 导出完整报告
            </el-button>
          </div>
        </div>

        <el-empty v-else description="请先运行分析以查看综合报告" />
      </el-tab-pane>
    </el-tabs>

    <!-- 产品详情对话框 -->
    <el-dialog v-model="showDetailDialog" title="产品详细分析" width="900px">
      <div v-if="selectedProduct">
        <el-descriptions title="基本信息" :column="2" border>
          <el-descriptions-item label="产品名称">{{ selectedProduct.name }}</el-descriptions-item>
          <el-descriptions-item label="生命周期阶段">
            <el-tag :type="getStageTagType(selectedProduct.lifecycle.currentStage)">
              {{ selectedProduct.lifecycle.currentStage }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="置信度">
            {{ (selectedProduct.lifecycle.confidence * 100).toFixed(0) }}%
          </el-descriptions-item>
          <el-descriptions-item label="综合得分">
            {{ selectedProduct.overallScore }}分
          </el-descriptions-item>
        </el-descriptions>

        <el-divider />

        <h4>阶段特征</h4>
        <el-space wrap>
          <el-tag v-for="char in selectedProduct.lifecycle.characteristics" :key="char">
            {{ char }}
          </el-tag>
        </el-space>

        <el-divider />

        <h4>推荐行动</h4>
        <el-table :data="selectedProduct.lifecycle.recommendations" border>
          <el-table-column prop="action" label="行动" />
          <el-table-column label="优先级" width="100">
            <template #default="{ row }">
              <el-tag :type="row.priority === 'high' ? 'danger' : row.priority === 'medium' ? 'warning' : 'info'">
                {{ row.priority }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="impact" label="预期影响" />
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import ProductLifecycleManager from '@/utils/productLifecycle'

const config = ref({
  mode: 'portfolio',
  category: 'all',
  timeRange: '6m',
  dimensions: ['lifecycle', 'bcg', 'pricing', 'inventory']
})

const results = ref(null)
const activeTab = ref('lifecycle')
const showDetailDialog = ref(false)
const selectedProduct = ref(null)

const lifecycleChartRef = ref(null)
const bcgChartRef = ref(null)

const manager = new ProductLifecycleManager()

// 模拟数据
const mockProducts = [
  {
    name: '智能拧紧枪A1',
    monthsSinceLaunch: 8,
    salesTrend: { recent: 0.8 },
    growthRate: 0.35,
    profitMargin: 0.18,
    marketShare: 0.08,
    marketGrowthRate: 0.25,
    relativeMarketShare: 1.2,
    currentPrice: 2500,
    cost: 1800,
    elasticity: -1.2,
    demand: { annual: 5000, daily: 15, stdDev: 3 },
    leadTime: 7,
    currentInventory: 350,
    riskLevel: 30,
    strategicValue: 80
  },
  {
    name: '经典套筒组B2',
    monthsSinceLaunch: 48,
    salesTrend: { recent: 0.05 },
    growthRate: 0.02,
    profitMargin: 0.35,
    marketShare: 0.25,
    marketGrowthRate: 0.05,
    relativeMarketShare: 2.5,
    currentPrice: 800,
    cost: 500,
    elasticity: -0.8,
    demand: { annual: 12000, daily: 35, stdDev: 5 },
    leadTime: 5,
    currentInventory: 1200,
    riskLevel: 20,
    strategicValue: 70
  },
  {
    name: '新型扭矩扳手C3',
    monthsSinceLaunch: 3,
    salesTrend: { recent: 0.6 },
    growthRate: 0.5,
    profitMargin: 0.12,
    marketShare: 0.03,
    marketGrowthRate: 0.4,
    relativeMarketShare: 0.5,
    currentPrice: 1500,
    cost: 1200,
    elasticity: -1.5,
    demand: { annual: 2000, daily: 6, stdDev: 2 },
    leadTime: 10,
    currentInventory: 80,
    riskLevel: 60,
    strategicValue: 60
  }
]

const mockMarkets = mockProducts.map(() => ({
  demand: Math.random() * 1000 + 500,
  competitorPrices: [2000, 2200, 2400],
  seasonality: 1.1
}))

// 运行分析
const runAnalysis = async () => {
  const portfolioResults = manager.analyzePortfolio(mockProducts, mockMarkets)

  results.value = {
    lifecycle: config.value.dimensions.includes('lifecycle') ? 
      manager.lifecycleAnalyzer.analyzePortfolio(mockProducts) : null,
    bcg: config.value.dimensions.includes('bcg') ?
      manager.bcgAnalyzer.analyzeBCGMatrix(mockProducts) : null,
    pricing: config.value.dimensions.includes('pricing') ?
      mockProducts.map((p, i) => ({
        ...p,
        pricing: manager.pricingEngine.calculateOptimalPrice(p, mockMarkets[i])
      })) : null,
    inventory: config.value.dimensions.includes('inventory') ?
      mockProducts.map(p => ({
        ...p,
        inventory: manager.inventoryOptimizer.optimizeInventory({
          demand: p.demand,
          leadTime: p.leadTime,
          currentInventory: p.currentInventory,
          cost: { order: 500, unit: p.cost },
          holdingCostRate: 0.2
        })
      })) : null,
    summary: portfolioResults
  }

  await nextTick()
  renderCharts()
}

// 渲染图表
const renderCharts = () => {
  if (results.value.lifecycle) renderLifecycleChart()
  if (results.value.bcg) renderBCGChart()
}

const renderLifecycleChart = () => {
  const chart = echarts.init(lifecycleChartRef.value)
  const data = Object.entries(results.value.lifecycle.distribution).map(([name, value]) => ({
    name, value
  }))

  chart.setOption({
    tooltip: { trigger: 'item' },
    legend: { top: '5%', left: 'center' },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b}: {c}个 ({d}%)'
      },
      data
    }]
  })
}

const renderBCGChart = () => {
  const chart = echarts.init(bcgChartRef.value)
  const allProducts = Object.values(results.value.bcg.distribution).flat()

  const data = allProducts.map(p => ({
    name: p.name,
    value: [
      p.bcg.position.x,
      p.bcg.position.y * 100,
      (p.salesTrend?.recent || 0.5) * 1000
    ],
    category: p.bcg.category
  }))

  chart.setOption({
    tooltip: {
      formatter: params => `${params.name}<br/>市场份额: ${params.value[0].toFixed(2)}<br/>增长率: ${params.value[1].toFixed(1)}%`
    },
    xAxis: {
      name: '相对市场份额',
      nameLocation: 'middle',
      nameGap: 30,
      min: 0,
      max: 3
    },
    yAxis: {
      name: '市场增长率(%)',
      nameLocation: 'middle',
      nameGap: 50,
      min: -10,
      max: 60
    },
    series: [{
      type: 'scatter',
      symbolSize: val => Math.sqrt(val[2]) * 2,
      data,
      itemStyle: {
        color: params => {
          const colors = { '明星': '#67C23A', '现金牛': '#E6A23C', '问题': '#909399', '瘦狗': '#F56C6C' }
          return colors[params.data.category] || '#909399'
        }
      },
      markLine: {
        lineStyle: { type: 'dashed', color: '#999' },
        data: [
          { xAxis: 1 },
          { yAxis: 10 }
        ]
      }
    }]
  })
}

// 辅助函数
const getStageColor = stage => {
  const colors = {
    '导入期': '#409EFF',
    '成长期': '#67C23A',
    '成熟期': '#E6A23C',
    '衰退期': '#F56C6C',
    '淘汰期': '#909399'
  }
  return colors[stage] || '#909399'
}

const getStageTagType = stage => {
  const types = {
    '导入期': '',
    '成长期': 'success',
    '成熟期': 'warning',
    '衰退期': 'danger',
    '淘汰期': 'info'
  }
  return types[stage] || ''
}

const getQuadrantColor = quadrant => {
  const colors = {
    '明星': '#67C23A',
    '现金牛': '#E6A23C',
    '问题': '#909399',
    '瘦狗': '#F56C6C'
  }
  return colors[quadrant] || '#909399'
}

const getInventoryTagType = (current, reorder) => {
  if (current < reorder) return 'danger'
  if (current < reorder * 1.5) return 'warning'
  return 'success'
}

const getHealthColor = score => {
  if (score >= 80) return '#67C23A'
  if (score >= 60) return '#E6A23C'
  return '#F56C6C'
}

const formatNumber = num => {
  return (num || 0).toLocaleString('zh-CN')
}

const calculateQuadrantRevenue = products => {
  return products.reduce((sum, p) => sum + ((p.salesTrend?.recent || 0) * 100000), 0)
}

const viewProductDetail = product => {
  selectedProduct.value = product
  showDetailDialog.value = true
}

const applyPricing = product => {
  console.log('应用定价建议:', product)
  // 实际应用定价逻辑
}

const exportReport = () => {
  console.log('导出报告')
  // 实际导出逻辑
}

onMounted(() => {
  // 自动运行分析
  runAnalysis()
})
</script>

<style scoped lang="scss">
.product-lifecycle-panel {
  padding: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      font-size: 16px;
      font-weight: bold;
    }
  }

  .distribution-cards {
    margin-bottom: 30px;
  }

  .chart-section {
    margin: 30px 0;
    padding: 20px;
    background: #f5f7fa;
    border-radius: 8px;

    h4 {
      margin: 0 0 20px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .bcg-stats {
    margin-bottom: 30px;
  }
}
</style>
