<template>
  <div class="curve-analysis-container">
    <el-card class="header-card">
      <div class="page-header">
        <div class="header-left">
          <el-icon :size="32" color="#1890ff"><TrendCharts /></el-icon>
          <div>
            <h1>拧紧曲线对比与分析</h1>
            <p>智能分析拧紧曲线，识别装配问题，最多支持100条曲线对比</p>
          </div>
        </div>
        <div class="header-actions">
          <el-button type="primary" @click="showUploadDialog = true">
            <el-icon><Upload /></el-icon>
            导入曲线
          </el-button>
          <el-button @click="clearAll">
            <el-icon><Delete /></el-icon>
            清空所有
          </el-button>
          <el-button @click="exportReport">
            <el-icon><Download /></el-icon>
            导出报告
          </el-button>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20">
      <!-- 左侧：曲线管理 -->
      <el-col :span="6">
        <el-card class="curve-list-card">
          <template #header>
            <div class="card-header">
              <span>曲线列表 ({{ curves.length }}/100)</span>
              <el-tag :type="curves.length >= 100 ? 'danger' : 'success'">
                {{ curves.length >= 100 ? '已满' : '可用' }}
              </el-tag>
            </div>
          </template>

          <!-- 标准曲线 -->
          <div class="curve-section" v-if="standardCurve">
            <div class="section-title">
              <el-icon color="#f39c12"><Star /></el-icon>
              标准曲线
            </div>
            <div class="curve-item standard-curve">
              <div class="curve-info">
                <div class="curve-name">{{ standardCurve.name }}</div>
                <div class="curve-meta">
                  <el-tag size="small" type="warning">标准</el-tag>
                  <span>{{ standardCurve.points }}点</span>
                </div>
              </div>
              <div class="curve-actions">
                <el-button size="small" text @click="viewCurveDetail(standardCurve)">
                  <el-icon><View /></el-icon>
                </el-button>
                <el-button size="small" text type="danger" @click="removeStandardCurve">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
          </div>

          <!-- 采集曲线列表 -->
          <div class="curve-section">
            <div class="section-title">
              <el-icon color="#3498db"><DataLine /></el-icon>
              采集曲线 ({{ curves.length }})
            </div>
            <el-scrollbar height="500px">
              <div
                v-for="(curve, index) in curves"
                :key="curve.id"
                :class="['curve-item', { active: selectedCurves.includes(curve.id) }]"
                @click="toggleCurveSelection(curve.id)"
              >
                <div class="curve-checkbox">
                  <el-checkbox
                    :model-value="selectedCurves.includes(curve.id)"
                    @change="toggleCurveSelection(curve.id)"
                  />
                </div>
                <div class="curve-info">
                  <div class="curve-name">{{ curve.name }}</div>
                  <div class="curve-meta">
                    <el-tag size="small" :type="getCurveStatusType(curve.status)">
                      {{ curve.status }}
                    </el-tag>
                    <span>{{ curve.points }}点</span>
                  </div>
                </div>
                <div class="curve-actions">
                  <el-button size="small" text @click.stop="viewCurveDetail(curve)">
                    <el-icon><View /></el-icon>
                  </el-button>
                  <el-button size="small" text type="danger" @click.stop="removeCurve(curve.id)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
            </el-scrollbar>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：曲线显示和分析 -->
      <el-col :span="18">
        <!-- 曲线图表 -->
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>拧紧曲线对比图</span>
              <div class="chart-controls">
                <el-button-group>
                  <el-button size="small" @click="resetZoom">重置缩放</el-button>
                  <el-button size="small" @click="toggleGrid">切换网格</el-button>
                  <el-button size="small" @click="toggleLegend">切换图例</el-button>
                </el-button-group>
              </div>
            </div>
          </template>
          <div id="curveChart" style="width: 100%; height: 500px;"></div>
        </el-card>

        <!-- 智能分析结果 -->
        <el-card class="analysis-card" v-if="analysisResult">
          <template #header>
            <div class="card-header">
              <span>智能分析结果</span>
              <el-tag :type="analysisResult.overallStatus === '正常' ? 'success' : 'danger'">
                {{ analysisResult.overallStatus }}
              </el-tag>
            </div>
          </template>

          <el-tabs v-model="activeTab">
            <!-- 综合评估 -->
            <el-tab-pane label="综合评估" name="overall">
              <div class="analysis-section">
                <el-alert
                  :title="analysisResult.summary.title"
                  :type="analysisResult.summary.type"
                  :description="analysisResult.summary.description"
                  show-icon
                  :closable="false"
                />

                <el-row :gutter="16" style="margin-top: 20px;">
                  <el-col :span="8">
                    <el-statistic title="合格曲线" :value="analysisResult.qualifiedCount">
                      <template #suffix>/ {{ curves.length }}</template>
                    </el-statistic>
                  </el-col>
                  <el-col :span="8">
                    <el-statistic title="异常曲线" :value="analysisResult.abnormalCount">
                      <template #suffix>条</template>
                    </el-statistic>
                  </el-col>
                  <el-col :span="8">
                    <el-statistic title="合格率" :value="analysisResult.qualificationRate">
                      <template #suffix>%</template>
                    </el-statistic>
                  </el-col>
                </el-row>
              </div>
            </el-tab-pane>

            <!-- 问题诊断 -->
            <el-tab-pane label="问题诊断" name="diagnosis">
              <div class="diagnosis-list">
                <div
                  v-for="(issue, index) in analysisResult.issues"
                  :key="index"
                  class="issue-item"
                >
                  <div class="issue-header">
                    <el-icon :size="20" :color="getIssueColor(issue.severity)">
                      <WarningFilled />
                    </el-icon>
                    <span class="issue-title">{{ issue.type }}</span>
                    <el-tag :type="getSeverityType(issue.severity)" size="small">
                      {{ issue.severity }}
                    </el-tag>
                  </div>
                  <div class="issue-content">
                    <p><strong>问题描述：</strong>{{ issue.description }}</p>
                    <p><strong>影响曲线：</strong>{{ issue.affectedCurves.join(', ') }}</p>
                    <p><strong>可能原因：</strong></p>
                    <ul>
                      <li v-for="(reason, idx) in issue.possibleReasons" :key="idx">
                        {{ reason }}
                      </li>
                    </ul>
                    <p><strong>建议措施：</strong></p>
                    <ul>
                      <li v-for="(solution, idx) in issue.solutions" :key="idx">
                        {{ solution }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </el-tab-pane>

            <!-- 参数对比 -->
            <el-tab-pane label="参数对比" name="parameters">
              <el-alert
                title="工艺参数对比说明"
                type="info"
                :closable="false"
                style="margin-bottom: 16px;"
              >
                <p>• <strong>扭矩控制</strong>：以达到目标扭矩为准，角度可能波动（±20°）</p>
                <p>• <strong>转角控制</strong>：以达到目标角度为准，扭矩相对稳定（屈服点控制）</p>
              </el-alert>
              <el-table :data="analysisResult.parameterComparison" border stripe>
                <el-table-column prop="curveName" label="曲线名称" width="160" fixed />
                <el-table-column prop="maxTorque" label="峰值扭矩(N·m)" width="110" />
                <el-table-column prop="maxAngle" label="峰值角度(°)" width="110" />
                <el-table-column prop="avgSlope" label="平均斜率" width="100" />
                <el-table-column prop="strategy" label="控制策略" width="100">
                  <template #default="{ row }">
                    <el-tag :type="row.strategy === '转角控制' ? 'primary' : 'success'" size="small">
                      {{ row.strategy }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="elasticRange" label="弹性区间(°)" width="110" />
                <el-table-column prop="plasticRange" label="塑性区间(°)" width="110" />
                <el-table-column prop="deviation" label="偏差率(%)" width="100">
                  <template #default="{ row }">
                    <el-tag :type="row.deviation > 10 ? 'danger' : row.deviation > 5 ? 'warning' : 'success'">
                      {{ row.deviation }}%
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="controlQuality" label="质量评级" width="100">
                  <template #default="{ row }">
                    <el-tag 
                      :type="row.controlQuality === '优秀' ? 'success' : row.controlQuality === '良好' ? 'primary' : 'warning'"
                      size="small"
                    >
                      {{ row.controlQuality }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <!-- 材质分析 -->
            <el-tab-pane label="材质分析" name="material">
              <div class="material-analysis">
                <el-alert
                  title="智能材质识别"
                  type="success"
                  :closable="false"
                  style="margin-bottom: 20px;"
                >
                  基于拧紧曲线特征（斜率、峰值扭矩、塑性段长度）自动识别连接件材质类型
                </el-alert>
                
                <el-descriptions :column="1" border size="large">
                  <el-descriptions-item>
                    <template #label>
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <el-icon color="#e67e22"><Box /></el-icon>
                        <strong>连接件材质</strong>
                      </div>
                    </template>
                    <el-tag size="large" type="warning" effect="dark">
                      {{ analysisResult.materialAnalysis.material }}
                    </el-tag>
                  </el-descriptions-item>
                  
                  <el-descriptions-item>
                    <template #label>
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <el-icon color="#3498db"><Document /></el-icon>
                        <strong>材质特性</strong>
                      </div>
                    </template>
                    {{ analysisResult.materialAnalysis.characteristics }}
                  </el-descriptions-item>
                  
                  <el-descriptions-item>
                    <template #label>
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <el-icon color="#27ae60"><Setting /></el-icon>
                        <strong>建议扭矩范围</strong>
                      </div>
                    </template>
                    <el-tag type="success" size="large">
                      {{ analysisResult.materialAnalysis.recommendedTorque }}
                    </el-tag>
                  </el-descriptions-item>
                  
                  <el-descriptions-item>
                    <template #label>
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <el-icon color="#9b59b6"><Odometer /></el-icon>
                        <strong>建议转速</strong>
                      </div>
                    </template>
                    <el-tag type="primary" size="large">
                      {{ analysisResult.materialAnalysis.recommendedSpeed }}
                    </el-tag>
                  </el-descriptions-item>
                  
                  <el-descriptions-item>
                    <template #label>
                      <div style="display: flex; align-items: center; gap: 8px;">
                        <el-icon color="#e74c3c"><Warning /></el-icon>
                        <strong>特殊注意事项</strong>
                      </div>
                    </template>
                    <div style="line-height: 1.8; color: #e74c3c; font-weight: 500;">
                      {{ analysisResult.materialAnalysis.notes }}
                    </div>
                  </el-descriptions-item>
                </el-descriptions>

                <!-- 材质对比参考表 -->
                <el-divider content-position="left">
                  <strong>材质特性对比参考</strong>
                </el-divider>
                <el-table :data="materialReferenceData" border stripe size="small">
                  <el-table-column prop="material" label="材质类型" width="120" />
                  <el-table-column prop="slope" label="典型斜率" width="100" />
                  <el-table-column prop="torque" label="扭矩范围" width="140" />
                  <el-table-column prop="speed" label="推荐转速" width="120" />
                  <el-table-column prop="risk" label="主要风险" />
                </el-table>
              </div>
            </el-tab-pane>

            <!-- 批次对比 -->
            <el-tab-pane label="批次对比" name="batch">
              <div class="batch-analysis">
                <el-alert
                  title="批次一致性分析"
                  type="info"
                  :closable="false"
                  style="margin-bottom: 20px;"
                >
                  对比同一工位不同批次的曲线，评估工艺稳定性和一致性
                </el-alert>

                <el-row :gutter="16">
                  <el-col :span="8">
                    <el-statistic title="曲线标准差(扭矩)" :value="analysisResult.batchAnalysis.torqueStdDev">
                      <template #suffix>N·m</template>
                    </el-statistic>
                  </el-col>
                  <el-col :span="8">
                    <el-statistic title="曲线标准差(角度)" :value="analysisResult.batchAnalysis.angleStdDev">
                      <template #suffix>°</template>
                    </el-statistic>
                  </el-col>
                  <el-col :span="8">
                    <el-statistic title="工艺稳定性评分" :value="analysisResult.batchAnalysis.stabilityScore">
                      <template #suffix>/ 100</template>
                    </el-statistic>
                  </el-col>
                </el-row>

                <el-divider />

                <div class="batch-conclusion">
                  <h4>一致性评估结论</h4>
                  <el-tag 
                    :type="analysisResult.batchAnalysis.conclusion.type" 
                    size="large" 
                    effect="dark"
                    style="margin-bottom: 12px;"
                  >
                    {{ analysisResult.batchAnalysis.conclusion.status }}
                  </el-tag>
                  <p style="line-height: 1.8; color: #34495e;">
                    {{ analysisResult.batchAnalysis.conclusion.description }}
                  </p>
                  
                  <div v-if="analysisResult.batchAnalysis.suggestions.length > 0">
                    <h4>改进建议</h4>
                    <ul class="suggestion-list">
                      <li v-for="(suggestion, idx) in analysisResult.batchAnalysis.suggestions" :key="idx">
                        {{ suggestion }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>

    <!-- 上传对话框 -->
    <el-dialog
      v-model="showUploadDialog"
      title="导入拧紧曲线"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-tabs v-model="uploadTab">
        <el-tab-pane label="导入标准曲线" name="standard">
          <el-upload
            drag
            accept=".csv"
            :auto-upload="false"
            :on-change="handleStandardUpload"
            :show-file-list="false"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              拖拽CSV文件到此处或 <em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                标准曲线用于对比分析，格式：角度(度),扭矩(N·m)
              </div>
            </template>
          </el-upload>
        </el-tab-pane>

        <el-tab-pane label="批量导入采集曲线" name="batch">
          <el-upload
            drag
            multiple
            accept=".csv"
            :auto-upload="false"
            :on-change="handleBatchUpload"
            :file-list="uploadFileList"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              拖拽多个CSV文件到此处或 <em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                最多可同时上传100个CSV文件，格式：角度(度),扭矩(N·m)
              </div>
            </template>
          </el-upload>
        </el-tab-pane>
      </el-tabs>

      <template #footer>
        <el-button @click="showUploadDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmUpload">确认导入</el-button>
      </template>
    </el-dialog>

    <!-- 曲线详情对话框 -->
    <el-dialog
      v-model="showDetailDialog"
      :title="currentCurve?.name"
      width="800px"
    >
      <div v-if="currentCurve">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="曲线名称">{{ currentCurve.name }}</el-descriptions-item>
          <el-descriptions-item label="数据点数">{{ currentCurve.points }}</el-descriptions-item>
          <el-descriptions-item label="峰值扭矩">{{ currentCurve.maxTorque }} N·m</el-descriptions-item>
          <el-descriptions-item label="峰值角度">{{ currentCurve.maxAngle }}°</el-descriptions-item>
          <el-descriptions-item label="分析状态">
            <el-tag :type="getCurveStatusType(currentCurve.status)">
              {{ currentCurve.status }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="上传时间">{{ currentCurve.uploadTime }}</el-descriptions-item>
        </el-descriptions>
        <div id="detailChart" style="width: 100%; height: 400px; margin-top: 20px;"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

// 数据状态
const curves = ref([])
const standardCurve = ref(null)
const selectedCurves = ref([])
const analysisResult = ref(null)
const activeTab = ref('overall')
const showUploadDialog = ref(false)
const showDetailDialog = ref(false)
const uploadTab = ref('standard')
const uploadFileList = ref([])
const currentCurve = ref(null)

let chartInstance = null
let detailChartInstance = null

// 材质参考数据
const materialReferenceData = [
  { material: '钢质', slope: '>0.10', torque: '25-35 N·m', speed: '40-60 rpm', risk: '过拧导致螺栓延伸' },
  { material: '铝合金', slope: '0.05-0.10', torque: '10-18 N·m', speed: '30-50 rpm', risk: '螺纹滑牙、压痕' },
  { material: '塑料', slope: '<0.05', torque: '3-8 N·m', speed: '20-40 rpm', risk: '开裂、蠕变松弛' },
  { material: '铸铁', slope: '0.08-0.12', torque: '20-30 N·m', speed: '30-50 rpm', risk: '脆性断裂' },
  { material: '复合材料', slope: '0.03-0.08', torque: '5-15 N·m', speed: '25-45 rpm', risk: '分层、纤维断裂' }
]

// 初始化图表
onMounted(() => {
  initChart()
  loadDemoData()
})

// 初始化ECharts
const initChart = () => {
  const chartDom = document.getElementById('curveChart')
  chartInstance = echarts.init(chartDom)
  
  const option = {
    title: {
      text: '拧紧曲线对比',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        let result = `角度: ${params[0].axisValue}°<br/>`
        params.forEach(param => {
          result += `${param.seriesName}: ${param.value} N·m<br/>`
        })
        return result
      }
    },
    legend: {
      data: [],
      bottom: 10,
      type: 'scroll'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        restore: {},
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'value',
      name: '角度 (度)',
      nameLocation: 'middle',
      nameGap: 30
    },
    yAxis: {
      type: 'value',
      name: '扭矩 (N·m)',
      nameLocation: 'middle',
      nameGap: 50
    },
    series: []
  }
  
  chartInstance.setOption(option)
}

// 加载演示数据
const loadDemoData = () => {
  // 生成标准曲线
  standardCurve.value = {
    id: 'standard',
    name: '标准拧紧曲线',
    points: 500,
    maxTorque: 28.5,
    maxAngle: 540,
    uploadTime: '2025-12-13 10:00:00',
    data: generatePerfectCurve()
  }

  // 生成多条测试曲线，展示不同异常类型
  curves.value = [
    {
      id: 'curve1',
      name: '采集曲线_001_正常',
      points: 500,
      status: '正常',
      maxTorque: 28.2,
      maxAngle: 535,
      uploadTime: '2025-12-13 10:15:00',
      data: generatePerfectCurve(0.95)
    },
    {
      id: 'curve2',
      name: '采集曲线_002_滑牙',
      points: 480,
      status: '异常-滑牙',
      maxTorque: 22.5,
      maxAngle: 520,
      uploadTime: '2025-12-13 10:16:00',
      data: generateSlipCurve()
    },
    {
      id: 'curve3',
      name: '采集曲线_003_粘滑',
      points: 510,
      status: '异常-粘滑',
      maxTorque: 27.8,
      maxAngle: 545,
      uploadTime: '2025-12-13 10:17:00',
      data: generateStickSlipCurve()
    },
    {
      id: 'curve4',
      name: '采集曲线_004_缓升',
      points: 500,
      status: '异常-缓升',
      maxTorque: 18.4,
      maxAngle: 540,
      uploadTime: '2025-12-13 10:18:00',
      data: generateSlowRiseCurve()
    },
    {
      id: 'curve5',
      name: '采集曲线_005_压溃',
      points: 500,
      status: '异常-压溃',
      maxTorque: 25.0,
      maxAngle: 530,
      uploadTime: '2025-12-13 10:19:00',
      data: generateCrushCurve()
    }
  ]

  selectedCurves.value = curves.value.map(c => c.id)
  updateChart()
  performAnalysis()
}

// 生成完美曲线数据
const generatePerfectCurve = (factor = 1.0) => {
  const data = []
  for (let angle = 0; angle <= 540; angle += 1) {
    let torque = 0
    if (angle < 280) {
      // 螺栓贴合阶段
      torque = 0
    } else if (angle < 350) {
      // 快速上升阶段（线性段）
      torque = (angle - 280) * 0.15 * factor
    } else if (angle < 480) {
      // 塑性段
      const base = 10.5 * factor
      const plastic = Math.pow((angle - 350) / 130, 2) * 18 * factor
      torque = base + plastic
    } else {
      // 稳定阶段
      torque = 28.5 * factor
    }
    data.push([angle, parseFloat(torque.toFixed(2))])
  }
  return data
}

// 生成滑牙曲线
const generateSlipCurve = () => {
  const data = []
  for (let angle = 0; angle <= 540; angle += 1) {
    let torque = 0
    if (angle < 280) {
      torque = 0
    } else if (angle < 350) {
      torque = (angle - 280) * 0.15
    } else if (angle < 420) {
      const base = 10.5
      const plastic = Math.pow((angle - 350) / 70, 2) * 12
      torque = base + plastic
    } else {
      // 滑牙后扭矩下降并波动
      const decay = Math.exp(-(angle - 420) / 100) * 5
      const wave = Math.sin((angle - 420) / 10) * 2
      torque = 22.5 + decay + wave
    }
    data.push([angle, parseFloat(torque.toFixed(2))])
  }
  return data
}

// 生成粘滑曲线
const generateStickSlipCurve = () => {
  const data = []
  for (let angle = 0; angle <= 540; angle += 1) {
    let torque = 0
    if (angle < 280) {
      torque = 0
    } else if (angle < 480) {
      const base = (angle - 280) * 0.14
      const noise = Math.sin(angle * 0.5) * 1.5 * (angle > 350 ? 1 : 0)
      torque = base + noise
    } else {
      torque = 27.8 + Math.sin(angle * 0.3) * 0.5
    }
    data.push([angle, parseFloat(torque.toFixed(2))])
  }
  return data
}

// 生成缓升曲线（斜率缓慢）
const generateSlowRiseCurve = () => {
  const data = []
  for (let angle = 0; angle <= 540; angle += 1) {
    let torque = 0
    if (angle < 280) {
      torque = 0
    } else if (angle < 420) {
      // 斜率明显小于正常值
      torque = (angle - 280) * 0.08
    } else {
      torque = 11.2 + (angle - 420) * 0.06
    }
    data.push([angle, parseFloat(torque.toFixed(2))])
  }
  return data
}

// 生成压溃曲线
const generateCrushCurve = () => {
  const data = []
  for (let angle = 0; angle <= 540; angle += 1) {
    let torque = 0
    if (angle < 280) {
      torque = 0
    } else if (angle < 360) {
      torque = (angle - 280) * 0.15
    } else if (angle < 380) {
      // 第一次压溃，出现平台
      torque = 12 + (angle - 360) * 0.02
    } else if (angle < 450) {
      // 再次上升
      torque = 12.4 + (angle - 380) * 0.18
    } else {
      // 最终稳定
      torque = 25
    }
    data.push([angle, parseFloat(torque.toFixed(2))])
  }
  return data
}

// 生成开裂曲线
const generateCrackCurve = () => {
  const data = []
  for (let angle = 0; angle <= 540; angle += 1) {
    let torque = 0
    if (angle < 280) {
      torque = 0
    } else if (angle < 420) {
      torque = (angle - 280) * 0.12
    } else if (angle === 420) {
      // 开裂瞬间，扭矩骤降
      torque = 16.8
    } else {
      // 开裂后扭矩下降并波动
      torque = 8 + Math.sin((angle - 420) / 5) * 1.5
    }
    data.push([angle, parseFloat(torque.toFixed(2))])
  }
  return data
}

// 生成浮钉曲线
const generateFloatingCurve = () => {
  const data = []
  for (let angle = 0; angle <= 540; angle += 1) {
    let torque = 0
    if (angle < 280) {
      torque = 0
    } else if (angle < 340) {
      // 快速上升
      torque = (angle - 280) * 0.25
    } else {
      // 触底后扭矩停滞不前
      torque = 15 + Math.sin((angle - 340) / 10) * 0.5
    }
    data.push([angle, parseFloat(torque.toFixed(2))])
  }
  return data
}

// 生成断裂曲线
const generateBreakCurve = () => {
  const data = []
  for (let angle = 0; angle <= 540; angle += 1) {
    let torque = 0
    if (angle < 280) {
      torque = 0
    } else if (angle < 460) {
      torque = (angle - 280) * 0.18
    } else if (angle === 460) {
      // 断裂瞬间
      torque = 32.4
    } else {
      // 断裂后扭矩归零
      torque = Math.max(0, 32.4 - (angle - 460) * 2)
    }
    data.push([angle, parseFloat(torque.toFixed(2))])
  }
  return data
}

// 更新图表
const updateChart = () => {
  if (!chartInstance) return

  const series = []
  const legendData = []

  // 添加标准曲线
  if (standardCurve.value) {
    series.push({
      name: standardCurve.value.name,
      type: 'line',
      data: standardCurve.value.data,
      lineStyle: { width: 3, color: '#f39c12' },
      itemStyle: { color: '#f39c12' },
      symbol: 'none',
      emphasis: { disabled: true }
    })
    legendData.push(standardCurve.value.name)
  }

  // 添加选中的曲线
  const selectedCurveData = curves.value.filter(c => selectedCurves.value.includes(c.id))
  const colors = ['#3498db', '#e74c3c', '#2ecc71', '#9b59b6', '#1abc9c']
  selectedCurveData.forEach((curve, index) => {
    series.push({
      name: curve.name,
      type: 'line',
      data: curve.data,
      lineStyle: { width: 2, color: colors[index % colors.length] },
      itemStyle: { color: colors[index % colors.length] },
      symbol: 'none'
    })
    legendData.push(curve.name)
  })

  chartInstance.setOption({
    legend: { data: legendData },
    series: series
  })
}

// 执行智能分析
const performAnalysis = () => {
  if (curves.value.length === 0) {
    analysisResult.value = null
    return
  }

  const abnormalCurves = curves.value.filter(c => c.status.includes('异常'))
  const qualifiedCount = curves.value.length - abnormalCurves.length
  const qualificationRate = ((qualifiedCount / curves.value.length) * 100).toFixed(1)

  // 问题诊断 - 扩展7种异常类型
  const issues = []
  
  // 1. 检测滑牙
  const slipCurves = curves.value.filter(c => c.status.includes('滑牙'))
  if (slipCurves.length > 0) {
    issues.push({
      type: '内螺纹滑牙',
      severity: '严重',
      description: '检测到螺纹滑牙现象，扭矩未达到目标值时突然下降或波动，曲线尾部呈波浪形',
      affectedCurves: slipCurves.map(c => c.name),
      possibleReasons: [
        '内螺纹材料硬度不足（如铝合金、塑料）',
        '螺纹啮合长度不够',
        '螺纹已有损伤、磕碰或交叉螺纹',
        '拧紧扭矩超过材料承载能力',
        '螺纹加工质量差（脱碳、尺寸偏差、粗糙度不良）'
      ],
      solutions: [
        '增加螺纹孔材料硬度（热处理、表面渗碳）',
        '增加螺纹啮合长度（至少1.5倍螺栓直径）',
        '加强来料检验，避免螺纹损伤',
        '重新评估工艺扭矩，降低拧紧扭矩10-20%',
        '改善螺纹加工工艺，控制脱碳层深度<0.2mm',
        '使用螺纹护套或自攻螺套增强连接'
      ]
    })
  }

  // 2. 检测粘滑
  const stickSlipCurves = curves.value.filter(c => c.status.includes('粘滑'))
  if (stickSlipCurves.length > 0) {
    issues.push({
      type: '粘滑现象（Stick-Slip）',
      severity: '中等',
      description: '扭矩曲线呈锯齿状波动，拧紧过程伴随咔吱声响和异常振动',
      affectedCurves: stickSlipCurves.map(c => c.name),
      possibleReasons: [
        '拧紧速度过高（>80rpm）',
        '螺纹副摩擦系数过大或不稳定',
        '表面粗糙度不佳，局部卡滞',
        '抗扭臂刚性连接不足，扭转积累释放',
        '润滑不良或螺纹胶干燥、粘度过高',
        '螺纹配合间隙过小'
      ],
      solutions: [
        '降低拧紧转速至40-60rpm',
        '使用螺纹胶或润滑剂降低摩擦系数',
        '改善螺纹表面粗糙度至Ra1.6-3.2μm',
        '提高抗扭臂的刚性连接（增加夹持长度）',
        '避免高扭矩启动，采用软启动策略',
        '检查螺纹配合等级，适当放宽公差'
      ]
    })
  }

  // 3. 检测斜率缓慢/缓升
  const slowRiseCurves = curves.value.filter(c => c.status.includes('缓升') || c.status.includes('斜率'))
  if (slowRiseCurves.length > 0) {
    issues.push({
      type: '扭矩上升缓慢',
      severity: '中等',
      description: '扭矩-角度曲线斜率明显小于正常值，弹性段不明显',
      affectedCurves: slowRiseCurves.map(c => c.name),
      possibleReasons: [
        '连接件间隙过大，贴合阶段过长',
        '螺栓或连接件刚度不足',
        '垫片压缩量过大',
        '被连接件支撑不足，产生弯曲变形',
        '螺纹配合间隙过大'
      ],
      solutions: [
        '减小连接件装配间隙，增加定位销',
        '更换高刚度螺栓或增大螺栓直径',
        '优化垫片选型，控制压缩量',
        '增加被连接件底部支撑，提高刚性',
        '检查螺纹配合等级，改用更紧配合'
      ]
    })
  }

  // 4. 检测压溃
  const crushCurves = curves.value.filter(c => c.status.includes('压溃'))
  if (crushCurves.length > 0) {
    issues.push({
      type: '被连接件压溃',
      severity: '严重',
      description: '曲线出现双峰或平台现象，连接件局部塑性变形或压溃',
      affectedCurves: crushCurves.map(c => c.name),
      possibleReasons: [
        '被连接件材料强度不足（如薄壁塑料、软质铝合金）',
        '支撑面积过小，局部应力集中',
        '拧紧扭矩过大',
        '垫片硬度过高，局部压入',
        '被连接件厚度不足'
      ],
      solutions: [
        '增加垫圈面积，分散压力',
        '使用软质垫片（如尼龙、橡胶）缓冲',
        '降低拧紧扭矩15-30%',
        '增加被连接件局部厚度或加强筋',
        '更换高强度材料或进行局部热处理'
      ]
    })
  }

  // 5. 检测开裂
  const crackCurves = curves.value.filter(c => c.status.includes('开裂'))
  if (crackCurves.length > 0) {
    issues.push({
      type: '连接件开裂',
      severity: '严重',
      description: '扭矩达到峰值后突然下降，伴随清脆断裂声，连接件开裂',
      affectedCurves: crackCurves.map(c => c.name),
      possibleReasons: [
        '塑料件或脆性材料韧性不足',
        '螺纹孔壁厚不足',
        '材料存在内应力或裂纹',
        '拧紧扭矩严重超标',
        '低温环境下材料脆性增大'
      ],
      solutions: [
        '更换韧性更好的材料（如PA66+GF改性塑料）',
        '增加螺纹孔壁厚（建议≥2倍螺栓直径）',
        '降低拧紧扭矩20-40%',
        '增加预埋螺母或金属嵌件',
        '进行退火处理消除内应力',
        '避免在低温环境（<-10℃）下拧紧'
      ]
    })
  }

  // 6. 检测浮钉
  const floatingCurves = curves.value.filter(c => c.status.includes('浮钉'))
  if (floatingCurves.length > 0) {
    issues.push({
      type: '浮钉（Floating Bolt）',
      severity: '严重',
      description: '扭矩快速上升后停滞，螺钉未有效拧入连接件，处于浮动状态',
      affectedCurves: floatingCurves.map(c => c.name),
      possibleReasons: [
        '螺纹孔深度不足，螺钉触底',
        '螺纹孔内有切屑、焊渣等异物',
        '盲孔底部存在残留切削液或油污',
        '螺纹孔已损坏或螺纹不完整',
        '螺钉长度过长'
      ],
      solutions: [
        '增加螺纹孔深度（至少螺钉长度+2个螺距）',
        '清理螺纹孔内异物，使用压缩空气吹净',
        '清理盲孔底部，确保排气通畅',
        '修复或重新加工螺纹孔',
        '更换合适长度的螺钉',
        '增加螺纹孔检验工序'
      ]
    })
  }

  // 7. 检测螺栓断裂
  const breakCurves = curves.value.filter(c => c.status.includes('断裂'))
  if (breakCurves.length > 0) {
    issues.push({
      type: '螺栓断裂',
      severity: '严重',
      description: '扭矩上升至峰值后急剧下降至零，螺栓杆部或螺纹根部断裂',
      affectedCurves: breakCurves.map(c => c.name),
      possibleReasons: [
        '螺栓强度等级不足',
        '螺栓存在材料缺陷（夹杂、裂纹）',
        '拧紧扭矩严重超过螺栓屈服极限',
        '螺纹根部应力集中',
        '螺栓疲劳损伤（重复使用）'
      ],
      solutions: [
        '更换高强度等级螺栓（如10.9级或12.9级）',
        '加强螺栓进货检验，进行无损检测',
        '重新计算拧紧扭矩，严格控制上限',
        '优化螺纹根部圆角半径，降低应力集中',
        '避免重复使用螺栓，特别是高强度螺栓',
        '检查拧紧设备精度，避免过载'
      ]
    })
  }

  // 参数对比 - 增强版
  const parameterComparison = curves.value.map(curve => {
    const deviation = standardCurve.value 
      ? (Math.abs(curve.maxTorque - standardCurve.value.maxTorque) / standardCurve.value.maxTorque * 100).toFixed(1)
      : 0
    
    // 判断拧紧策略（扭矩控制 vs 转角控制）
    const angleDeviation = standardCurve.value
      ? Math.abs(curve.maxAngle - standardCurve.value.maxAngle)
      : 0
    const strategy = angleDeviation < 20 ? '转角控制' : '扭矩控制'
    
    return {
      curveName: curve.name,
      maxTorque: curve.maxTorque,
      maxAngle: curve.maxAngle,
      avgSlope: (curve.maxTorque / (curve.maxAngle - 280)).toFixed(3),
      elasticRange: '280-350',
      plasticRange: '350-480',
      deviation: parseFloat(deviation),
      strategy: strategy,
      controlQuality: deviation < 5 ? '优秀' : deviation < 10 ? '良好' : '需改进'
    }
  })

  // 智能材质分析 - 基于曲线特征识别
  const avgSlope = curves.value.reduce((sum, c) => {
    return sum + (c.maxTorque / (c.maxAngle - 280))
  }, 0) / curves.value.length
  
  const avgMaxTorque = curves.value.reduce((sum, c) => sum + c.maxTorque, 0) / curves.value.length
  
  let material = '未知材质'
  let characteristics = ''
  let recommendedTorque = ''
  let recommendedSpeed = ''
  let notes = ''
  
  // 钢质连接件：高斜率（>0.1），高扭矩（>20Nm），明显塑性段
  if (avgSlope > 0.1 && avgMaxTorque > 20) {
    material = '钢质连接件'
    characteristics = '高强度、高刚度、线性弹性段明显、塑性变形区域较长、抗疲劳性能好'
    recommendedTorque = '25-35 N·m（M8-M10）'
    recommendedSpeed = '40-60 rpm'
    notes = '建议采用屈服点拧紧控制策略（Yield Point Control），确保预紧力稳定。注意防止过拧导致螺栓延伸超限。'
  }
  // 铝合金连接件：中等斜率（0.05-0.1），中等扭矩（10-20Nm）
  else if (avgSlope > 0.05 && avgSlope <= 0.1 && avgMaxTorque >= 10 && avgMaxTorque <= 20) {
    material = '铝合金连接件'
    characteristics = '中等强度、较软、易产生压痕、热膨胀系数大、螺纹易损伤'
    recommendedTorque = '10-18 N·m（M8-M10）'
    recommendedSpeed = '30-50 rpm'
    notes = '铝合金螺纹易滑牙，建议降低拧紧扭矩20-30%，使用螺纹护套增强连接。注意温度变化导致的预紧力松弛。'
  }
  // 塑料连接件：低斜率（<0.05），低扭矩（<10Nm），非线性明显
  else if (avgSlope <= 0.05 || avgMaxTorque < 10) {
    material = '塑料连接件（PA、PC或POM）'
    characteristics = '低刚度、非线性明显、蠕变性大、对温度敏感、易产生应力开裂'
    recommendedTorque = '3-8 N·m（M6-M8）'
    recommendedSpeed = '20-40 rpm'
    notes = '塑料件需严格控制扭矩上限，避免开裂。建议使用转角控制策略，监控扭矩上升斜率。使用自攻螺钉或预埋螺母可提高连接可靠性。注意蠕变导致的预紧力衰减。'
  }
  
  const materialAnalysis = {
    material,
    characteristics,
    recommendedTorque,
    recommendedSpeed,
    notes
  }

  // 批次对比分析
  const torques = curves.value.map(c => c.maxTorque)
  const angles = curves.value.map(c => c.maxAngle)
  
  const torqueMean = torques.reduce((sum, t) => sum + t, 0) / torques.length
  const angleMean = angles.reduce((sum, a) => sum + a, 0) / angles.length
  
  const torqueStdDev = Math.sqrt(
    torques.reduce((sum, t) => sum + Math.pow(t - torqueMean, 2), 0) / torques.length
  ).toFixed(2)
  
  const angleStdDev = Math.sqrt(
    angles.reduce((sum, a) => sum + Math.pow(a - angleMean, 2), 0) / angles.length
  ).toFixed(2)
  
  // 稳定性评分（标准差越小越稳定）
  const torqueCV = (parseFloat(torqueStdDev) / torqueMean * 100).toFixed(1) // 变异系数
  const angleCV = (parseFloat(angleStdDev) / angleMean * 100).toFixed(1)
  const stabilityScore = Math.max(0, 100 - parseFloat(torqueCV) * 10 - parseFloat(angleCV) * 2).toFixed(0)
  
  let batchStatus = '优秀'
  let batchType = 'success'
  let batchDescription = ''
  const batchSuggestions = []
  
  if (stabilityScore >= 90) {
    batchStatus = '工艺稳定'
    batchType = 'success'
    batchDescription = '所有批次的拧紧曲线高度一致，工艺参数稳定，质量控制良好。扭矩和角度的标准差均在合理范围内，可以继续保持当前工艺。'
  } else if (stabilityScore >= 70) {
    batchStatus = '基本稳定'
    batchType = 'warning'
    batchDescription = '大部分批次的拧紧曲线较为一致，但存在一定波动。建议检查设备状态、原材料批次差异和操作规范性。'
    batchSuggestions.push('定期校准拧紧设备，检查扭矩传感器精度')
    batchSuggestions.push('加强原材料进货检验，关注材料批次差异')
    batchSuggestions.push('统一操作规范，减少人为因素影响')
  } else {
    batchStatus = '波动较大'
    batchType = 'danger'
    batchDescription = '不同批次的拧紧曲线差异明显，工艺稳定性不足。需要立即排查原因，可能涉及设备故障、材料问题或操作不当。'
    batchSuggestions.push('紧急检查拧紧设备状态，进行全面维护保养')
    batchSuggestions.push('暂停生产，对异常批次进行全检')
    batchSuggestions.push('排查原材料供应商变更或材料批次问题')
    batchSuggestions.push('重新培训操作人员，统一拧紧标准')
    batchSuggestions.push('增加过程监控点，实时跟踪曲线变化')
  }
  
  const batchAnalysis = {
    torqueStdDev: parseFloat(torqueStdDev),
    angleStdDev: parseFloat(angleStdDev),
    stabilityScore: parseInt(stabilityScore),
    conclusion: {
      status: batchStatus,
      type: batchType,
      description: batchDescription
    },
    suggestions: batchSuggestions
  }

  analysisResult.value = {
    overallStatus: abnormalCurves.length === 0 ? '正常' : '存在异常',
    qualifiedCount,
    abnormalCount: abnormalCurves.length,
    qualificationRate: parseFloat(qualificationRate),
    summary: {
      title: abnormalCurves.length === 0 ? '所有曲线正常' : `发现 ${abnormalCurves.length} 条异常曲线`,
      type: abnormalCurves.length === 0 ? 'success' : 'error',
      description: abnormalCurves.length === 0 
        ? '所有采集曲线均符合标准要求，拧紧质量良好。'
        : `检测到${issues.length}类问题，请及时处理以确保装配质量。主要问题：${issues.map(i => i.type).join('、')}`
    },
    issues,
    parameterComparison,
    materialAnalysis,
    batchAnalysis
  }
}

// 切换曲线选择
const toggleCurveSelection = (curveId) => {
  const index = selectedCurves.value.indexOf(curveId)
  if (index > -1) {
    selectedCurves.value.splice(index, 1)
  } else {
    selectedCurves.value.push(curveId)
  }
  updateChart()
}

// 查看曲线详情
const viewCurveDetail = (curve) => {
  currentCurve.value = curve
  showDetailDialog.value = true
  nextTick(() => {
    renderDetailChart(curve)
  })
}

// 渲染详情图表
const renderDetailChart = (curve) => {
  const chartDom = document.getElementById('detailChart')
  if (detailChartInstance) {
    detailChartInstance.dispose()
  }
  detailChartInstance = echarts.init(chartDom)
  
  const option = {
    title: {
      text: curve.name,
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        return `角度: ${params[0].axisValue}°<br/>扭矩: ${params[0].value} N·m`
      }
    },
    xAxis: {
      type: 'value',
      name: '角度 (度)'
    },
    yAxis: {
      type: 'value',
      name: '扭矩 (N·m)'
    },
    series: [{
      type: 'line',
      data: curve.data,
      smooth: true,
      lineStyle: { width: 3 },
      areaStyle: { opacity: 0.3 }
    }]
  }
  
  detailChartInstance.setOption(option)
}

// 移除曲线
const removeCurve = (curveId) => {
  const index = curves.value.findIndex(c => c.id === curveId)
  if (index > -1) {
    curves.value.splice(index, 1)
    selectedCurves.value = selectedCurves.value.filter(id => id !== curveId)
    updateChart()
    performAnalysis()
    ElMessage.success('曲线已删除')
  }
}

// 移除标准曲线
const removeStandardCurve = () => {
  standardCurve.value = null
  updateChart()
  ElMessage.success('标准曲线已删除')
}

// 清空所有
const clearAll = () => {
  curves.value = []
  standardCurve.value = null
  selectedCurves.value = []
  analysisResult.value = null
  updateChart()
  ElMessage.success('已清空所有曲线')
}

// 处理标准曲线上传
const handleStandardUpload = (file) => {
  parseCSVFile(file.raw, (data) => {
    standardCurve.value = {
      id: 'standard',
      name: file.name.replace('.csv', ''),
      points: data.length,
      maxTorque: Math.max(...data.map(d => d[1])),
      maxAngle: Math.max(...data.map(d => d[0])),
      uploadTime: new Date().toLocaleString('zh-CN'),
      data: data
    }
    showUploadDialog.value = false
    updateChart()
    ElMessage.success('标准曲线导入成功')
  })
}

// 处理批量上传
const handleBatchUpload = (file) => {
  if (curves.value.length >= 100) {
    ElMessage.warning('最多支持100条曲线')
    return
  }
  
  uploadFileList.value.push(file)
}

// 确认上传
const confirmUpload = () => {
  if (uploadTab.value === 'batch' && uploadFileList.value.length > 0) {
    let processed = 0
    uploadFileList.value.forEach(file => {
      parseCSVFile(file.raw, (data) => {
        const curveId = `curve_${Date.now()}_${Math.random()}`
        const newCurve = {
          id: curveId,
          name: file.name.replace('.csv', ''),
          points: data.length,
          status: '待分析',
          maxTorque: Math.max(...data.map(d => d[1])),
          maxAngle: Math.max(...data.map(d => d[0])),
          uploadTime: new Date().toLocaleString('zh-CN'),
          data: data
        }
        curves.value.push(newCurve)
        selectedCurves.value.push(curveId)
        
        processed++
        if (processed === uploadFileList.value.length) {
          updateChart()
          performAnalysis()
          uploadFileList.value = []
          showUploadDialog.value = false
          ElMessage.success(`成功导入${processed}条曲线`)
        }
      })
    })
  }
}

// 解析CSV文件
const parseCSVFile = (file, callback) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    const text = e.target.result
    const lines = text.split('\n')
    const data = []
    
    // 跳过标题行
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line) {
        const [angle, torque] = line.split(',').map(v => parseFloat(v.trim()))
        if (!isNaN(angle) && !isNaN(torque)) {
          data.push([angle, torque])
        }
      }
    }
    
    callback(data)
  }
  reader.readAsText(file)
}

// 导出报告
const exportReport = () => {
  if (!analysisResult.value) {
    ElMessage.warning('请先导入曲线并进行分析')
    return
  }

  let report = '=== 拧紧曲线对比分析报告 ===\n\n'
  report += `生成时间：${new Date().toLocaleString('zh-CN')}\n\n`
  report += `--- 综合评估 ---\n`
  report += `总曲线数：${curves.value.length}\n`
  report += `合格曲线：${analysisResult.value.qualifiedCount}\n`
  report += `异常曲线：${analysisResult.value.abnormalCount}\n`
  report += `合格率：${analysisResult.value.qualificationRate}%\n\n`
  
  if (analysisResult.value.issues.length > 0) {
    report += `--- 问题诊断 ---\n`
    analysisResult.value.issues.forEach((issue, index) => {
      report += `\n问题${index + 1}：${issue.type} [${issue.severity}]\n`
      report += `描述：${issue.description}\n`
      report += `影响曲线：${issue.affectedCurves.join(', ')}\n`
      report += `可能原因：\n`
      issue.possibleReasons.forEach(r => report += `  - ${r}\n`)
      report += `建议措施：\n`
      issue.solutions.forEach(s => report += `  - ${s}\n`)
    })
  }
  
  report += `\n--- 参数对比 ---\n`
  analysisResult.value.parameterComparison.forEach(param => {
    report += `\n${param.curveName}:\n`
    report += `  峰值扭矩: ${param.maxTorque} N·m\n`
    report += `  峰值角度: ${param.maxAngle}°\n`
    report += `  偏差率: ${param.deviation}%\n`
  })

  const blob = new Blob([report], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `拧紧曲线分析报告_${new Date().toISOString().slice(0,10)}.txt`
  a.click()
  URL.revokeObjectURL(url)
  
  ElMessage.success('报告已导出')
}

// 工具函数
const getCurveStatusType = (status) => {
  if (status === '正常') return 'success'
  if (status.includes('异常')) return 'danger'
  return 'info'
}

const getIssueColor = (severity) => {
  if (severity === '严重') return '#e74c3c'
  if (severity === '中等') return '#f39c12'
  return '#3498db'
}

const getSeverityType = (severity) => {
  if (severity === '严重') return 'danger'
  if (severity === '中等') return 'warning'
  return 'info'
}

const resetZoom = () => {
  chartInstance?.dispatchAction({ type: 'restore' })
}

const toggleGrid = () => {
  const option = chartInstance?.getOption()
  if (option) {
    const showGrid = !option.grid[0].show
    chartInstance.setOption({ grid: { show: showGrid } })
  }
}

const toggleLegend = () => {
  const option = chartInstance?.getOption()
  if (option) {
    const show = !option.legend[0].show
    chartInstance.setOption({ legend: { show } })
  }
}
</script>

<style scoped>
.curve-analysis-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.header-card {
  margin-bottom: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-left h1 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #2c3e50;
}

.header-left p {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.curve-list-card {
  height: calc(100vh - 200px);
}

.curve-section {
  margin-bottom: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 2px solid #ecf0f1;
}

.curve-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  background: #f8f9fa;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.curve-item:hover {
  background: #e8f4fd;
  transform: translateX(4px);
}

.curve-item.active {
  background: #e3f2fd;
  border-color: #1890ff;
}

.curve-item.standard-curve {
  background: #fff9e6;
  border-color: #f39c12;
}

.curve-checkbox {
  display: flex;
  align-items: center;
}

.curve-info {
  flex: 1;
}

.curve-name {
  font-size: 14px;
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 4px;
}

.curve-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #95a5a6;
}

.curve-actions {
  display: flex;
  gap: 4px;
}

.chart-card {
  margin-bottom: 20px;
}

.chart-controls {
  display: flex;
  gap: 8px;
}

.analysis-card {
  margin-bottom: 20px;
}

.analysis-section {
  padding: 16px;
}

.diagnosis-list {
  max-height: 600px;
  overflow-y: auto;
}

.issue-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  border-left: 4px solid #3498db;
}

.issue-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.issue-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  flex: 1;
}

.issue-content {
  font-size: 14px;
  color: #34495e;
  line-height: 1.8;
}

.issue-content p {
  margin: 8px 0;
}

.issue-content ul {
  margin: 8px 0;
  padding-left: 24px;
}

.issue-content li {
  margin: 4px 0;
}

.material-analysis {
  padding: 16px;
}

.batch-analysis {
  padding: 16px;
}

.batch-conclusion {
  margin-top: 20px;
}

.batch-conclusion h4 {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 12px;
}

.suggestion-list {
  margin: 12px 0;
  padding-left: 24px;
  line-height: 2;
  color: #34495e;
}

.suggestion-list li {
  margin: 8px 0;
}

.el-icon--upload {
  font-size: 67px;
  color: #1890ff;
  margin: 40px 0 16px;
}

.el-upload__text {
  color: #606266;
  font-size: 14px;
}

.el-upload__text em {
  color: #1890ff;
  font-style: normal;
}
</style>
