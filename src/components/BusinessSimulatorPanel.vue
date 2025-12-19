<template>
  <div class="business-simulator-panel">
    <!-- 顶部快速配置 -->
    <el-card class="config-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span><el-icon><Setting /></el-icon> 模拟配置</span>
          <el-button type="primary" @click="runSimulation" :loading="simulating">
            <el-icon><VideoPlay /></el-icon>
            {{ simulating ? '模拟中...' : '开始模拟' }}
          </el-button>
        </div>
      </template>

      <el-form :model="config" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="模拟次数">
              <el-slider v-model="config.iterations" :min="1000" :max="20000" :step="1000" show-input />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="基准策略">
              <el-select v-model="config.baseStrategy" placeholder="选择策略">
                <el-option label="激进策略" value="aggressive" />
                <el-option label="平衡策略" value="balanced" />
                <el-option label="保守策略" value="conservative" />
                <el-option label="高端策略" value="premium" />
                <el-option label="留存优先" value="retention_focused" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="分析模块">
              <el-checkbox-group v-model="config.modules">
                <el-checkbox label="策略评估" />
                <el-checkbox label="策略优化" />
                <el-checkbox label="敏感性分析" />
                <el-checkbox label="场景规划" />
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 功能标签页 -->
    <el-card class="main-panel" shadow="never" style="margin-top: 20px">
      <el-tabs v-model="activeTab" type="border-card">
        <!-- 1. 蒙特卡洛模拟 -->
        <el-tab-pane label="蒙特卡洛模拟" name="montecarlo">
          <div v-if="results?.strategyEvaluation" class="montecarlo-results">
            <!-- 最佳策略推荐 -->
            <el-alert
              :title="`推荐策略: ${results.strategyEvaluation.bestStrategy.strategyName}`"
              type="success"
              :closable="false"
              style="margin-bottom: 20px"
            >
              <p><strong>预期利润:</strong> ¥{{ formatNumber(results.strategyEvaluation.bestStrategy.expectedProfit) }}</p>
              <p><strong>预期ROI:</strong> {{ (results.strategyEvaluation.bestStrategy.expectedROI * 100).toFixed(1) }}%</p>
              <p><strong>风险调整收益:</strong> {{ results.strategyEvaluation.bestStrategy.riskAdjustedReturn.toFixed(2) }}</p>
            </el-alert>

            <!-- 策略对比表 -->
            <el-table :data="results.strategyEvaluation.rankings" border stripe>
              <el-table-column prop="strategyName" label="策略名称" width="150" fixed />
              <el-table-column label="预期利润" width="150">
                <template #default="{ row }">
                  <span :class="row.expectedProfit > 0 ? 'profit-positive' : 'profit-negative'">
                    ¥{{ formatNumber(row.expectedProfit) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="利润标准差" width="150">
                <template #default="{ row }">
                  ¥{{ formatNumber(row.profitStdDev) }}
                </template>
              </el-table-column>
              <el-table-column label="预期ROI" width="120">
                <template #default="{ row }">
                  {{ (row.expectedROI * 100).toFixed(1) }}%
                </template>
              </el-table-column>
              <el-table-column label="盈利概率" width="120">
                <template #default="{ row }">
                  <el-progress
                    :percentage="Math.round(row.positiveProb * 100)"
                    :color="getProgressColor(row.positiveProb)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="客户增长" width="120">
                <template #default="{ row }">
                  {{ Math.round(row.customerGrowth) }} 人
                </template>
              </el-table-column>
              <el-table-column label="风险调整收益" width="150">
                <template #default="{ row }">
                  <el-tag :type="getRiskReturnType(row.riskAdjustedReturn)">
                    {{ row.riskAdjustedReturn.toFixed(2) }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150" fixed="right">
                <template #default="{ row }">
                  <el-button size="small" @click="viewStrategyDetail(row)">
                    查看详情
                  </el-button>
                </template>
              </el-table-column>
            </el-table>

            <!-- 利润分布图 -->
            <div class="chart-section">
              <h4><el-icon><TrendCharts /></el-icon> 利润分布可视化</h4>
              <div ref="profitDistChartRef" style="width: 100%; height: 400px"></div>
            </div>
          </div>

          <el-empty v-else description="请点击'开始模拟'运行蒙特卡洛分析" />
        </el-tab-pane>

        <!-- 2. 策略优化 -->
        <el-tab-pane label="策略优化" name="optimization">
          <div v-if="results?.optimizedStrategy" class="optimization-results">
            <el-descriptions title="遗传算法优化结果" :column="2" border>
              <el-descriptions-item label="适应度分数">
                <el-tag type="success" size="large">
                  {{ results.optimizedStrategy.fitness.toFixed(2) }}
                </el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="预期利润">
                ¥{{ formatNumber(results.optimizedStrategy.simulation.profit.mean) }}
              </el-descriptions-item>
              <el-descriptions-item label="预期ROI">
                {{ (results.optimizedStrategy.simulation.roi.mean * 100).toFixed(1) }}%
              </el-descriptions-item>
              <el-descriptions-item label="盈利概率">
                {{ (results.optimizedStrategy.simulation.profit.positiveProb * 100).toFixed(1) }}%
              </el-descriptions-item>
            </el-descriptions>

            <!-- 最优策略参数 -->
            <div class="strategy-params">
              <h4><el-icon><Document /></el-icon> 最优策略参数</h4>
              <el-row :gutter="20">
                <el-col :span="6" v-for="(value, key) in results.optimizedStrategy.optimalStrategy" :key="key">
                  <el-statistic :title="formatParamName(key)" :value="formatParamValue(value)" />
                </el-col>
              </el-row>
            </div>

            <!-- 优化过程可视化 -->
            <div class="chart-section">
              <h4><el-icon><TrendCharts /></el-icon> 收益区间分析</h4>
              <div ref="roiRangeChartRef" style="width: 100%; height: 350px"></div>
            </div>
          </div>

          <el-empty v-else description="请在配置中勾选'策略优化'并运行模拟" />
        </el-tab-pane>

        <!-- 3. 敏感性分析 -->
        <el-tab-pane label="敏感性分析" name="sensitivity">
          <div v-if="results?.sensitivity" class="sensitivity-results">
            <!-- 因素重要性排名 -->
            <el-alert
              :title="`最敏感因素: ${results.sensitivity.mostSensitiveFactor.factor}`"
              type="warning"
              :closable="false"
              style="margin-bottom: 20px"
            >
              敏感度系数: {{ results.sensitivity.mostSensitiveFactor.sensitivity.toFixed(2) }}
              (该因素变化1%,利润预期变化{{ Math.abs(results.sensitivity.mostSensitiveFactor.sensitivity).toFixed(2) }}%)
            </el-alert>

            <el-table :data="results.sensitivity.importanceRanking" border>
              <el-table-column prop="factor" label="参数因素" width="200">
                <template #default="{ row }">
                  <el-tag>{{ formatParamName(row.factor) }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="敏感度系数" width="150">
                <template #default="{ row }">
                  {{ row.sensitivity.toFixed(2) }}
                </template>
              </el-table-column>
              <el-table-column label="影响程度" width="200">
                <template #default="{ row }">
                  <el-progress
                    :percentage="Math.min(Math.abs(row.sensitivity) * 10, 100)"
                    :color="row.sensitivity > 0 ? '#67C23A' : '#F56C6C'"
                  />
                </template>
              </el-table-column>
              <el-table-column label="影响方向" width="120">
                <template #default="{ row }">
                  <el-tag :type="row.sensitivity > 0 ? 'success' : 'danger'">
                    {{ row.sensitivity > 0 ? '正向' : '负向' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="建议优先级" width="120">
                <template #default="{ row, $index }">
                  <el-rate :model-value="5 - $index" disabled show-score text-color="#ff9900" />
                </template>
              </el-table-column>
            </el-table>

            <!-- 敏感性曲线图 -->
            <div class="chart-section">
              <h4><el-icon><DataLine /></el-icon> 敏感性曲线分析</h4>
              <div ref="sensitivityChartRef" style="width: 100%; height: 450px"></div>
            </div>
          </div>

          <el-empty v-else description="请在配置中勾选'敏感性分析'并运行模拟" />
        </el-tab-pane>

        <!-- 4. 场景规划 -->
        <el-tab-pane label="场景规划" name="scenario">
          <div v-if="results?.scenarios" class="scenario-results">
            <!-- 期望值汇总 -->
            <el-row :gutter="20" class="expected-value-cards">
              <el-col :span="8">
                <el-card shadow="hover">
                  <el-statistic
                    title="期望利润"
                    :value="formatNumber(results.scenarios.expectedValue.profit)"
                    prefix="¥"
                  >
                    <template #suffix>
                      <el-icon color="#67C23A"><TrendCharts /></el-icon>
                    </template>
                  </el-statistic>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card shadow="hover">
                  <el-statistic
                    title="期望ROI"
                    :value="(results.scenarios.expectedValue.roi * 100).toFixed(1)"
                    suffix="%"
                  >
                    <template #suffix>
                      <el-icon color="#409EFF">%</el-icon>
                    </template>
                  </el-statistic>
                </el-card>
              </el-col>
              <el-col :span="8">
                <el-card shadow="hover">
                  <el-statistic
                    title="期望收入"
                    :value="formatNumber(results.scenarios.expectedValue.revenue)"
                    prefix="¥"
                  >
                    <template #suffix>
                      <el-icon color="#E6A23C"><Money /></el-icon>
                    </template>
                  </el-statistic>
                </el-card>
              </el-col>
            </el-row>

            <!-- 场景对比表 -->
            <el-table :data="scenarioTableData" border stripe style="margin-top: 20px">
              <el-table-column prop="scenarioName" label="场景名称" width="150" fixed />
              <el-table-column label="发生概率" width="120">
                <template #default="{ row }">
                  <el-progress
                    :percentage="Math.round(row.probability * 100)"
                    :color="getProgressColor(row.probability)"
                  />
                </template>
              </el-table-column>
              <el-table-column label="预期利润" width="180">
                <template #default="{ row }">
                  <span :class="row.profit > 0 ? 'profit-positive' : 'profit-negative'">
                    ¥{{ formatNumber(row.profit) }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="利润区间(95%)" width="250">
                <template #default="{ row }">
                  <span class="range-text">
                    [{{ formatNumber(row.profitP5) }}, {{ formatNumber(row.profitP95) }}]
                  </span>
                </template>
              </el-table-column>
              <el-table-column label="预期ROI" width="120">
                <template #default="{ row }">
                  {{ (row.roi * 100).toFixed(1) }}%
                </template>
              </el-table-column>
              <el-table-column label="盈利概率" width="120">
                <template #default="{ row }">
                  {{ (row.positiveProb * 100).toFixed(1) }}%
                </template>
              </el-table-column>
              <el-table-column label="风险等级" width="120">
                <template #default="{ row }">
                  <el-tag :type="getRiskLevelType(row.positiveProb)">
                    {{ getRiskLevel(row.positiveProb) }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>

            <!-- 场景对比雷达图 -->
            <div class="chart-section">
              <h4><el-icon><Odometer /></el-icon> 场景综合对比</h4>
              <div ref="scenarioRadarChartRef" style="width: 100%; height: 450px"></div>
            </div>
          </div>

          <el-empty v-else description="请在配置中勾选'场景规划'并运行模拟" />
        </el-tab-pane>

        <!-- 5. 综合建议 -->
        <el-tab-pane label="综合建议" name="recommendations">
          <div v-if="results?.recommendations?.length > 0" class="recommendations-section">
            <el-timeline>
              <el-timeline-item
                v-for="(rec, idx) in results.recommendations"
                :key="idx"
                :type="getPriorityType(rec.priority)"
                :timestamp="rec.type"
              >
                <el-card shadow="hover">
                  <template #header>
                    <div class="rec-header">
                      <el-tag :type="getPriorityType(rec.priority)" effect="dark">
                        {{ rec.priority }}
                      </el-tag>
                      <span class="rec-title">{{ rec.title }}</span>
                    </div>
                  </template>
                  <p class="rec-content">{{ rec.content }}</p>
                  <p class="rec-reason"><strong>原因:</strong> {{ rec.reason }}</p>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>

          <el-empty v-else description="运行完整模拟后查看AI综合建议" />
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 策略详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="策略详细分析"
      width="70%"
      @close="closeDetailDialog"
    >
      <div v-if="selectedStrategy" class="strategy-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="策略名称">
            {{ selectedStrategy.strategyName }}
          </el-descriptions-item>
          <el-descriptions-item label="预期利润">
            ¥{{ formatNumber(selectedStrategy.expectedProfit) }}
          </el-descriptions-item>
          <el-descriptions-item label="利润置信区间">
            [{{ formatNumber(selectedStrategy.data.simulation.profit.p5) }}, 
             {{ formatNumber(selectedStrategy.data.simulation.profit.p95) }}]
          </el-descriptions-item>
          <el-descriptions-item label="ROI">
            {{ (selectedStrategy.expectedROI * 100).toFixed(1) }}%
          </el-descriptions-item>
        </el-descriptions>

        <!-- 利润分布直方图 -->
        <div class="detail-chart">
          <h4>利润分布直方图</h4>
          <div ref="detailHistogramRef" style="width: 100%; height: 350px"></div>
        </div>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="adoptStrategy">采用此策略</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import {
  Setting,
  VideoPlay,
  TrendCharts,
  Document,
  DataLine,
  Odometer,
  Money
} from '@element-plus/icons-vue'
import { BusinessSimulatorManager } from '@/utils/businessSimulator'
import { ElMessage } from 'element-plus'

// 数据
const simulator = new BusinessSimulatorManager()
const config = ref({
  iterations: 5000,
  baseStrategy: 'balanced',
  modules: ['策略评估', '敏感性分析', '场景规划']
})
const activeTab = ref('montecarlo')
const simulating = ref(false)
const results = ref(null)
const detailDialogVisible = ref(false)
const selectedStrategy = ref(null)

// 图表引用
const profitDistChartRef = ref(null)
const roiRangeChartRef = ref(null)
const sensitivityChartRef = ref(null)
const scenarioRadarChartRef = ref(null)
const detailHistogramRef = ref(null)

// 计算属性
const scenarioTableData = computed(() => {
  if (!results.value?.scenarios) return []
  
  return Object.entries(results.value.scenarios.scenarios).map(([key, data]) => ({
    scenarioName: data.scenario.name,
    probability: data.probability,
    profit: data.simulation.profit.mean,
    profitP5: data.simulation.profit.p5,
    profitP95: data.simulation.profit.p95,
    roi: data.simulation.roi.mean,
    positiveProb: data.simulation.profit.positiveProb
  }))
})

// 方法
const runSimulation = async () => {
  simulating.value = true
  
  try {
    const simulationConfig = {
      iterations: config.value.iterations,
      baseStrategy: simulator.strategyOptimizer.strategies[config.value.baseStrategy],
      customerSegments: getMockCustomerSegments(),
      evaluateStrategies: config.value.modules.includes('策略评估'),
      optimizeStrategy: config.value.modules.includes('策略优化'),
      sensitivityAnalysis: config.value.modules.includes('敏感性分析'),
      scenarioPlanning: config.value.modules.includes('场景规划'),
      objectives: {
        maximizeProfit: true,
        minimizeRisk: true,
        maximizeCustomerGrowth: true
      },
      sensitivityFactors: [
        { name: 'priceDiscount', range: { min: 0, max: 0.4, step: 0.05 } },
        { name: 'serviceLevel', range: { min: 0.5, max: 1.5, step: 0.1 } },
        { name: 'acquisitionCostPerCustomer', range: { min: 200, max: 1000, step: 100 } }
      ]
    }
    
    results.value = await simulator.runComprehensiveSimulation(simulationConfig)
    
    ElMessage.success('模拟完成!')
    
    // 绘制图表
    await nextTick()
    drawCharts()
  } catch (error) {
    console.error('模拟失败:', error)
    ElMessage.error('模拟失败,请检查配置')
  } finally {
    simulating.value = false
  }
}

const viewStrategyDetail = (strategy) => {
  selectedStrategy.value = strategy
  detailDialogVisible.value = true
  
  nextTick(() => {
    drawDetailHistogram(strategy.data.simulation.profit.rawResults)
  })
}

const closeDetailDialog = () => {
  detailDialogVisible.value = false
  selectedStrategy.value = null
}

const adoptStrategy = () => {
  ElMessage.success(`已采用策略: ${selectedStrategy.value.strategyName}`)
  detailDialogVisible.value = false
}

const drawCharts = () => {
  if (results.value?.strategyEvaluation) {
    drawProfitDistChart()
  }
  if (results.value?.optimizedStrategy) {
    drawRoiRangeChart()
  }
  if (results.value?.sensitivity) {
    drawSensitivityChart()
  }
  if (results.value?.scenarios) {
    drawScenarioRadarChart()
  }
}

const drawProfitDistChart = () => {
  if (!profitDistChartRef.value) return
  
  const chart = echarts.init(profitDistChartRef.value)
  
  const strategies = results.value.strategyEvaluation.rankings
  
  const option = {
    title: { text: '各策略利润分布对比' },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {},
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: strategies.map(s => s.strategyName)
    },
    yAxis: {
      type: 'value',
      name: '利润 (万元)',
      axisLabel: {
        formatter: (value) => (value / 10000).toFixed(0)
      }
    },
    series: [
      {
        name: '预期利润',
        type: 'bar',
        data: strategies.map(s => s.expectedProfit),
        itemStyle: { color: '#409EFF' }
      },
      {
        name: '标准差',
        type: 'bar',
        data: strategies.map(s => s.profitStdDev),
        itemStyle: { color: '#E6A23C' }
      }
    ]
  }
  
  chart.setOption(option)
}

const drawRoiRangeChart = () => {
  if (!roiRangeChartRef.value) return
  
  const chart = echarts.init(roiRangeChartRef.value)
  
  const data = results.value.optimizedStrategy.simulation
  
  const option = {
    title: { text: 'ROI置信区间分析' },
    tooltip: { trigger: 'axis' },
    xAxis: {
      type: 'category',
      data: ['5%分位', '中位数', '均值', '95%分位']
    },
    yAxis: {
      type: 'value',
      name: 'ROI',
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [{
      type: 'bar',
      data: [
        (data.roi.p5 * 100).toFixed(1),
        (data.roi.median * 100).toFixed(1),
        (data.roi.mean * 100).toFixed(1),
        (data.roi.p95 * 100).toFixed(1)
      ],
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 1, color: '#188df0' }
        ])
      }
    }]
  }
  
  chart.setOption(option)
}

const drawSensitivityChart = () => {
  if (!sensitivityChartRef.value) return
  
  const chart = echarts.init(sensitivityChartRef.value)
  
  const analyses = results.value.sensitivity.analyses
  const series = []
  
  Object.entries(analyses).forEach(([factor, analysis]) => {
    series.push({
      name: formatParamName(factor),
      type: 'line',
      smooth: true,
      data: analysis.results.map(r => [r.factorValue, r.profit / 10000])
    })
  })
  
  const option = {
    title: { text: '敏感性分析曲线' },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        let result = params[0].axisValueLabel + '<br/>'
        params.forEach(p => {
          result += `${p.marker}${p.seriesName}: ${p.value[1].toFixed(2)} 万元<br/>`
        })
        return result
      }
    },
    legend: {},
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'value',
      name: '参数值'
    },
    yAxis: {
      type: 'value',
      name: '预期利润 (万元)'
    },
    series
  }
  
  chart.setOption(option)
}

const drawScenarioRadarChart = () => {
  if (!scenarioRadarChartRef.value) return
  
  const chart = echarts.init(scenarioRadarChartRef.value)
  
  const scenarios = results.value.scenarios.scenarios
  const scenarioNames = Object.keys(scenarios)
  
  const indicator = [
    { name: '预期利润', max: Math.max(...scenarioNames.map(k => scenarios[k].simulation.profit.mean)) },
    { name: '预期ROI', max: Math.max(...scenarioNames.map(k => scenarios[k].simulation.roi.mean)) * 100 },
    { name: '盈利概率', max: 100 },
    { name: '客户增长', max: Math.max(...scenarioNames.map(k => scenarios[k].simulation.customerMetrics.avgNetGrowth)) }
  ]
  
  const seriesData = scenarioNames.map(key => ({
    name: scenarios[key].scenario.name,
    value: [
      scenarios[key].simulation.profit.mean,
      scenarios[key].simulation.roi.mean * 100,
      scenarios[key].simulation.profit.positiveProb * 100,
      scenarios[key].simulation.customerMetrics.avgNetGrowth
    ]
  }))
  
  const option = {
    title: { text: '场景综合对比雷达图' },
    tooltip: {},
    legend: { data: seriesData.map(s => s.name) },
    radar: { indicator },
    series: [{
      type: 'radar',
      data: seriesData
    }]
  }
  
  chart.setOption(option)
}

const drawDetailHistogram = (profitResults) => {
  if (!detailHistogramRef.value || !profitResults) return
  
  const chart = echarts.init(detailHistogramRef.value)
  
  // 计算直方图
  const profits = profitResults.map(r => r.profit).sort((a, b) => a - b)
  const bins = 30
  const min = profits[0]
  const max = profits[profits.length - 1]
  const binWidth = (max - min) / bins
  
  const histogram = new Array(bins).fill(0)
  profits.forEach(p => {
    const index = Math.min(Math.floor((p - min) / binWidth), bins - 1)
    histogram[index]++
  })
  
  const option = {
    title: { text: '利润分布直方图' },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    xAxis: {
      type: 'category',
      data: histogram.map((_, i) => ((min + i * binWidth) / 10000).toFixed(0) + '万')
    },
    yAxis: {
      type: 'value',
      name: '出现次数'
    },
    series: [{
      type: 'bar',
      data: histogram,
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 1, color: '#188df0' }
        ])
      }
    }]
  }
  
  chart.setOption(option)
}

const getMockCustomerSegments = () => {
  return [
    {
      name: '高价值客户',
      size: 500,
      baseConversionRate: 0.25,
      baseRetentionRate: 0.85,
      avgOrderValue: 100000,
      existingCustomers: 120
    },
    {
      name: '中价值客户',
      size: 1500,
      baseConversionRate: 0.15,
      baseRetentionRate: 0.75,
      avgOrderValue: 50000,
      existingCustomers: 300
    },
    {
      name: '低价值客户',
      size: 3000,
      baseConversionRate: 0.08,
      baseRetentionRate: 0.60,
      avgOrderValue: 20000,
      existingCustomers: 450
    }
  ]
}

// 工具方法
const formatNumber = (num) => {
  return Math.round(num).toLocaleString()
}

const formatParamName = (name) => {
  const map = {
    priceDiscount: '价格折扣',
    serviceLevel: '服务水平',
    productQuality: '产品质量',
    loyaltyProgram: '忠诚计划',
    acquisitionCostPerCustomer: '获客成本',
    retentionCostPerCustomer: '留存成本',
    operationCostPerCustomer: '运营成本'
  }
  return map[name] || name
}

const formatParamValue = (value) => {
  if (value < 1) {
    return (value * 100).toFixed(1) + '%'
  } else if (value > 100) {
    return '¥' + Math.round(value)
  } else {
    return value.toFixed(2)
  }
}

const getProgressColor = (value) => {
  if (value >= 0.8) return '#67C23A'
  if (value >= 0.5) return '#409EFF'
  if (value >= 0.3) return '#E6A23C'
  return '#F56C6C'
}

const getRiskReturnType = (value) => {
  if (value >= 2) return 'success'
  if (value >= 1) return 'primary'
  if (value >= 0.5) return 'warning'
  return 'danger'
}

const getRiskLevel = (positiveProb) => {
  if (positiveProb >= 0.9) return '低风险'
  if (positiveProb >= 0.7) return '中风险'
  return '高风险'
}

const getRiskLevelType = (positiveProb) => {
  if (positiveProb >= 0.9) return 'success'
  if (positiveProb >= 0.7) return 'warning'
  return 'danger'
}

const getPriorityType = (priority) => {
  const map = {
    urgent: 'danger',
    high: 'warning',
    medium: 'primary',
    low: 'info'
  }
  return map[priority] || 'info'
}

onMounted(() => {
  // 初始化
})

watch(activeTab, (newTab) => {
  if (results.value) {
    nextTick(() => drawCharts())
  }
})
</script>

<style scoped lang="scss">
.business-simulator-panel {
  padding: 20px;

  .config-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .main-panel {
    .montecarlo-results,
    .optimization-results,
    .sensitivity-results,
    .scenario-results {
      .chart-section {
        margin-top: 30px;

        h4 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 15px;
          font-size: 16px;
          font-weight: bold;
        }
      }

      .strategy-params {
        margin-top: 30px;

        h4 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          font-size: 16px;
          font-weight: bold;
        }
      }

      .expected-value-cards {
        margin-bottom: 20px;
      }
    }

    .profit-positive {
      color: #67C23A;
      font-weight: bold;
    }

    .profit-negative {
      color: #F56C6C;
      font-weight: bold;
    }

    .range-text {
      font-size: 12px;
      color: #606266;
    }
  }

  .recommendations-section {
    .rec-header {
      display: flex;
      align-items: center;
      gap: 15px;

      .rec-title {
        font-size: 16px;
        font-weight: bold;
      }
    }

    .rec-content {
      margin: 10px 0;
      font-size: 14px;
    }

    .rec-reason {
      color: #909399;
      font-size: 13px;
    }
  }

  .strategy-detail {
    .detail-chart {
      margin-top: 30px;

      h4 {
        margin-bottom: 15px;
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
}
</style>
