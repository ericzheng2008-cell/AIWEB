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
          <el-button @click="goHome" type="success">
            <el-icon><HomeFilled /></el-icon>
            返回主页
          </el-button>
          <el-button type="primary" @click="showUploadDialog = true">
            <el-icon><Upload /></el-icon>
            导入曲线
          </el-button>
          <el-button @click="clearAll">
            <el-icon><Delete /></el-icon>
            清空所有
          </el-button>
          <el-dropdown @command="handleExportCommand">
            <el-button type="primary">
              <el-icon><Download /></el-icon>
              导出数据
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="csv">
                  <el-icon><Document /></el-icon>
                  导出CSV格式
                </el-dropdown-item>
                <el-dropdown-item command="txt">
                  <el-icon><DocumentCopy /></el-icon>
                  导出TXT格式
                </el-dropdown-item>
                <el-dropdown-item command="report" divided>
                  <el-icon><Notebook /></el-icon>
                  导出分析报告 (TXT)
                </el-dropdown-item>
                <el-dropdown-item command="professional-report">
                  <el-icon><DataAnalysis /></el-icon>
                  导出专业报告 (详细)
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </el-card>

    <el-row :gutter="20">
      <!-- 左侧：曲线管理 -->
      <el-col :span="6">
        <el-card class="curve-list-card">
          <template #header>
            <div class="card-header">
              <span>曲线列表 ({{ filteredCurves.length }}/100)</span>
              <el-tag :type="curves.length >= 100 ? 'danger' : 'success'">
                {{ curves.length >= 100 ? '已满' : '可用' }}
              </el-tag>
            </div>
          </template>

          <!-- 筛选器 -->
          <div class="curve-filters">
            <el-form :inline="false" size="small" label-width="80px">
              <el-form-item label="车间">
                <el-select v-model="curveFilters.workshop" placeholder="全部" @change="applyFilters" clearable>
                  <el-option label="全部" value="" />
                  <el-option label="一部总装" value="一部总装" />
                  <el-option label="一部焊装" value="一部焊装" />
                  <el-option label="二部总装" value="二部总装" />
                  <el-option label="二部焊装" value="二部焊装" />
                  <el-option label="三部总装" value="三部总装" />
                  <el-option label="三部焊装" value="三部焊装" />
                  <el-option label="发动机工厂" value="发动机工厂" />
                  <el-option label="变速箱工厂" value="变速箱工厂" />
                </el-select>
              </el-form-item>
              <el-form-item label="线体">
                <el-select v-model="curveFilters.productionLine" placeholder="全部" @change="applyFilters" clearable>
                  <el-option label="全部" value="" />
                  <el-option label="总装1线" value="总装1线" />
                  <el-option label="总装2线" value="总装2线" />
                </el-select>
              </el-form-item>
              <el-form-item label="工具型号">
                <el-select v-model="curveFilters.toolModel" placeholder="全部" @change="applyFilters" clearable>
                  <el-option label="全部" value="" />
                  <el-option label="ST31-30" value="ST31-30" />
                  <el-option label="ST61-60" value="ST61-60" />
                  <el-option label="ST101-80" value="ST101-80" />
                </el-select>
              </el-form-item>
              <el-form-item label="SN编号">
                <el-input v-model="curveFilters.snNumber" placeholder="输入SN" @change="applyFilters" clearable />
              </el-form-item>
              <el-form-item label="班次">
                <el-select v-model="curveFilters.shift" placeholder="全部" @change="applyFilters" clearable>
                  <el-option label="全部" value="" />
                  <el-option label="白班" value="白班" />
                  <el-option label="夜班" value="夜班" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <el-divider style="margin: 12px 0;" />

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
              采集曲线 ({{ filteredCurves.length }})
            </div>
            <el-scrollbar height="500px">
              <div
                v-for="(curve, index) in filteredCurves"
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
                <el-select 
                  v-model="curveType" 
                  placeholder="选择曲线类型" 
                  style="width: 200px; margin-right: 12px;"
                  @change="updateCurveType">
                  <el-option label="扭矩-角度" value="torque-angle">
                    <span style="float: left">扭矩-角度</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">默认</span>
                  </el-option>
                  <el-option label="扭矩-时间" value="torque-time">
                    <span style="float: left">扭矩-时间</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">时序</span>
                  </el-option>
                  <el-option label="扭矩-转速" value="torque-speed">
                    <span style="float: left">扭矩-转速</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">动力学</span>
                  </el-option>
                  <el-option label="角度-时间" value="angle-time">
                    <span style="float: left">角度-时间</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">进程</span>
                  </el-option>
                  <el-option label="扭矩转角-时间" value="torque-angle-time">
                    <span style="float: left">扭矩转角-时间</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">综合</span>
                  </el-option>
                </el-select>
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
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { 
  Download, ArrowDown, Document, DocumentCopy, 
  Notebook, DataAnalysis as DataAnalysisIcon, HomeFilled 
} from '@element-plus/icons-vue'

const router = useRouter()

// 返回主页
const goHome = () => {
  router.push('/')
  ElMessage.success('返回主页')
}

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
const curveType = ref('torque-angle') // 曲线类型选择

// 筛选条件
const curveFilters = ref({
  workshop: '',
  productionLine: '',
  toolModel: '',
  snNumber: '',
  shift: ''
})

// 过滤后的曲线列表
const filteredCurves = computed(() => {
  let result = [...curves.value]
  
  // 按车间过滤
  if (curveFilters.value.workshop) {
    result = result.filter(c => c.workshop === curveFilters.value.workshop)
  }
  
  // 按线体过滤
  if (curveFilters.value.productionLine) {
    result = result.filter(c => c.productionLine === curveFilters.value.productionLine)
  }
  
  // 按工具型号过滤
  if (curveFilters.value.toolModel) {
    result = result.filter(c => c.toolModel === curveFilters.value.toolModel)
  }
  
  // 按SN编号过滤
  if (curveFilters.value.snNumber) {
    result = result.filter(c => c.snNumber && c.snNumber.includes(curveFilters.value.snNumber))
  }
  
  // 按班次过滤
  if (curveFilters.value.shift) {
    result = result.filter(c => c.shift === curveFilters.value.shift)
  }
  
  return result
})

// 应用筛选
const applyFilters = () => {
  ElMessage.success('筛选已应用')
  updateChart()
}

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

// 初始化ECharts（增强版：显示扭矩、速度、角度、时间关键参数）
const initChart = () => {
  const chartDom = document.getElementById('curveChart')
  chartInstance = echarts.init(chartDom)
  
  const option = {
    title: {
      text: '拧紧曲线智能对比分析',
      subtext: '扭矩-角度关系 | 三阶段拧紧过程可视化',
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      },
      subtextStyle: {
        fontSize: 12,
        color: '#666'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        animation: true,
        label: {
          backgroundColor: '#505765'
        }
      },
      formatter: (params) => {
        const angle = params[0].axisValue
        let result = `<div style="font-weight:bold;margin-bottom:5px;">旋入角度: ${angle}°</div>`
        
        // 判断当前阶段
        let phase = ''
        let phaseColor = ''
        if (angle <= 90) {
          phase = '低速认牙阶段'
          phaseColor = '#67c23a'
        } else if (angle <= 360) {
          phase = '快速旋入阶段'
          phaseColor = '#409eff'
        } else {
          phase = '拧紧阶段（弹性段）'
          phaseColor = '#e6a23c'
        }
        result += `<div style="color:${phaseColor};margin-bottom:8px;">📍 ${phase}</div>`
        
        params.forEach(param => {
          const marker = param.marker
          const value = param.value
          const name = param.seriesName
          result += `${marker} ${name}: <strong>${value} N·m</strong><br/>`
        })
        
        // 估算拧紧时间
        let estimatedTime = 0
        if (angle <= 90) {
          estimatedTime = (angle / 180).toFixed(2)
        } else if (angle <= 360) {
          estimatedTime = (0.5 + (angle - 90) / 135).toFixed(2)
        } else {
          estimatedTime = (2.5 + (angle - 360) / 90).toFixed(2)
        }
        result += `<div style="margin-top:8px;color:#909399;">⏱️ 预计时间: ${estimatedTime}s</div>`
        
        return result
      }
    },
    legend: {
      data: [],
      bottom: 10,
      type: 'scroll',
      textStyle: {
        fontSize: 12
      }
    },
    grid: {
      left: '8%',
      right: '8%',
      bottom: '15%',
      top: '18%',
      containLabel: true
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none',
          title: {
            zoom: '区域缩放',
            back: '还原'
          }
        },
        restore: {
          title: '还原'
        },
        saveAsImage: {
          title: '保存为图片',
          name: '拧紧曲线分析'
        },
        magicType: {
          type: ['line', 'bar'],
          title: {
            line: '切换为折线图',
            bar: '切换为柱状图'
          }
        }
      },
      right: '5%',
      top: '8%'
    },
    xAxis: {
      type: 'value',
      name: '旋入角度 (°)',
      nameLocation: 'middle',
      nameGap: 35,
      nameTextStyle: {
        fontSize: 13,
        fontWeight: 'bold'
      },
      min: 0,
      max: 600,
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#e0e0e0'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '扭矩 (N·m)',
      nameLocation: 'middle',
      nameGap: 55,
      nameTextStyle: {
        fontSize: 13,
        fontWeight: 'bold'
      },
      min: 0,
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#e0e0e0'
        }
      }
    },
    series: []
  }
  
  chartInstance.setOption(option)
}

// 加载演示数据
const loadDemoData = () => {
  // 车间、线体、工具型号、班次选项
  const workshops = ['一部总装', '一部焊装', '二部总装', '二部焊装', '三部总装', '三部焊装', '发动机工厂', '变速箱工厂']
  const productionLines = ['总装1线', '总装2线']
  const toolModels = ['ST31-30', 'ST61-60', 'ST101-80']
  const shifts = ['白班', '夜班']
  
  // 生成标准曲线
  standardCurve.value = {
    id: 'standard',
    name: '标准拧紧曲线',
    points: 500,
    maxTorque: 28.5,
    maxAngle: 540,
    uploadTime: '2025-12-13 10:00:00',
    workshop: '一部总装',
    productionLine: '总装1线',
    toolModel: 'ST61-60',
    snNumber: 'ST61-60-SN0001',
    shift: '白班',
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
      workshop: workshops[Math.floor(Math.random() * workshops.length)],
      productionLine: productionLines[Math.floor(Math.random() * productionLines.length)],
      toolModel: toolModels[Math.floor(Math.random() * toolModels.length)],
      snNumber: `${toolModels[0]}-SN${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`,
      shift: shifts[Math.floor(Math.random() * shifts.length)],
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
      workshop: workshops[Math.floor(Math.random() * workshops.length)],
      productionLine: productionLines[Math.floor(Math.random() * productionLines.length)],
      toolModel: toolModels[Math.floor(Math.random() * toolModels.length)],
      snNumber: `${toolModels[1]}-SN${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`,
      shift: shifts[Math.floor(Math.random() * shifts.length)],
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
      workshop: workshops[Math.floor(Math.random() * workshops.length)],
      productionLine: productionLines[Math.floor(Math.random() * productionLines.length)],
      toolModel: toolModels[Math.floor(Math.random() * toolModels.length)],
      snNumber: `${toolModels[2]}-SN${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`,
      shift: shifts[Math.floor(Math.random() * shifts.length)],
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
      workshop: workshops[Math.floor(Math.random() * workshops.length)],
      productionLine: productionLines[Math.floor(Math.random() * productionLines.length)],
      toolModel: toolModels[Math.floor(Math.random() * toolModels.length)],
      snNumber: `${toolModels[0]}-SN${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`,
      shift: shifts[Math.floor(Math.random() * shifts.length)],
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
      workshop: workshops[Math.floor(Math.random() * workshops.length)],
      productionLine: productionLines[Math.floor(Math.random() * productionLines.length)],
      toolModel: toolModels[Math.floor(Math.random() * toolModels.length)],
      snNumber: `${toolModels[1]}-SN${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`,
      shift: shifts[Math.floor(Math.random() * shifts.length)],
      data: generateCrushCurve()
    }
  ]

  selectedCurves.value = filteredCurves.value.map(c => c.id)
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

// ========== 智能异常检测算法 (基于知识库专业知识) ==========

/**
 * 检测曲线异常类型
 * @param {Object} curve - 曲线对象 {name, data: [[angle, torque], ...]}
 * @returns {String} - 状态描述
 */
const detectCurveAnomalies = (curve) => {
  const data = curve.data
  if (!data || data.length < 100) return '数据不足'
  
  // 计算关键参数
  const seatPoint = findSeatPoint(data) // 贴合点
  const elasticSlope = calculateElasticSlope(data) // 弹性段斜率
  const maxTorque = Math.max(...data.map(d => d[1]))
  const finalAngle = data[data.length - 1][0]
  
  // 检测各种异常
  const anomalies = []
  
  // 1. 滑牙检测: 扭矩在角度>200°时突然下降或保持低位
  if (detectSlipAnomaly(data, maxTorque)) {
    anomalies.push('滑牙')
  }
  
  // 2. 粘滑检测: 扭矩曲线呈锯齿状波动
  if (detectStickSlipAnomaly(data)) {
    anomalies.push('粘滑')
  }
  
  // 3. 缓升检测: 弹性段斜率明显小于正常值
  if (elasticSlope < 0.08) {
    anomalies.push('缓升')
  }
  
  // 4. 压溃检测: 曲线出现双峰或平台
  if (detectCrushAnomaly(data)) {
    anomalies.push('压溃')
  }
  
  // 5. 断裂检测: 扭矩急剧上升后归零
  if (detectBreakAnomaly(data)) {
    anomalies.push('断裂')
  }
  
  // 6. 浮钉检测: 贴合点延迟(>400°)
  if (seatPoint.angle > 400) {
    anomalies.push('浮钉')
  }
  
  // 7. 开裂检测: 扭矩曲线有多个小跌落
  if (detectCrackAnomaly(data)) {
    anomalies.push('开裂')
  }
  
  // 返回状态
  if (anomalies.length === 0) {
    return '正常'
  } else {
    return `异常-${anomalies.join('/')}`
  }
}

/**
 * 查找贴合点 (Seat Point)
 * 定义: 曲线从平缓开始明显上升的拐点
 */
const findSeatPoint = (data) => {
  const threshold = 5 // 扭矩阈值 5 N·m
  for (let i = 0; i < data.length; i++) {
    if (data[i][1] > threshold) {
      return {
        index: i,
        angle: data[i][0],
        torque: data[i][1]
      }
    }
  }
  return { index: 0, angle: 0, torque: 0 }
}

/**
 * 计算弹性段斜率 (Elastic Slope)
 * 范围: 360-480°
 */
const calculateElasticSlope = (data) => {
  const elasticData = data.filter(d => d[0] >= 360 && d[0] <= 480)
  if (elasticData.length < 2) return 0
  
  const deltaY = elasticData[elasticData.length - 1][1] - elasticData[0][1]
  const deltaX = elasticData[elasticData.length - 1][0] - elasticData[0][0]
  
  return deltaX > 0 ? deltaY / deltaX : 0
}

/**
 * 检测滑牙异常
 * 条件: angle > 200 && torque < 10 && continuing_rotation
 */
const detectSlipAnomaly = (data, maxTorque) => {
  let slipDetected = false
  
  for (let i = 0; i < data.length - 20; i++) {
    const angle = data[i][0]
    const torque = data[i][1]
    
    // 在角度>200°后,扭矩异常低(<10 Nm)或突然下降>15 Nm
    if (angle > 200 && torque < 10 && i > 0) {
      slipDetected = true
      break
    }
    
    // 检测扭矩突降
    if (i > 10 && angle > 300) {
      const torqueDrop = data[i - 10][1] - torque
      if (torqueDrop > 15) {
        slipDetected = true
        break
      }
    }
  }
  
  return slipDetected
}

/**
 * 检测粘滑异常 (Stick-Slip)
 * 条件: 扭矩波动频率 > 5 && amplitude > 5Nm
 */
const detectStickSlipAnomaly = (data) => {
  let oscillationCount = 0
  const windowSize = 10
  
  for (let i = windowSize; i < data.length - windowSize; i++) {
    const localMax = Math.max(...data.slice(i - windowSize, i + windowSize).map(d => d[1]))
    const localMin = Math.min(...data.slice(i - windowSize, i + windowSize).map(d => d[1]))
    const amplitude = localMax - localMin
    
    if (amplitude > 5 && data[i][1] === localMax) {
      oscillationCount++
    }
  }
  
  return oscillationCount > 5
}

/**
 * 检测压溃异常 (Crushing)
 * 条件: 出现明显的扭矩平台或双峰
 */
const detectCrushAnomaly = (data) => {
  let plateauDetected = false
  const windowSize = 20
  
  for (let i = windowSize; i < data.length - windowSize; i++) {
    const angle = data[i][0]
    if (angle < 360 || angle > 450) continue
    
    // 检测扭矩平台: 20个点内扭矩变化<2 Nm
    const torqueRange = Math.max(...data.slice(i - windowSize, i + windowSize).map(d => d[1])) - 
                       Math.min(...data.slice(i - windowSize, i + windowSize).map(d => d[1]))
    
    if (torqueRange < 2) {
      plateauDetected = true
      break
    }
  }
  
  return plateauDetected
}

/**
 * 检测断裂异常 (Fracture)
 * 条件: 扭矩急剧上升后突然归零
 */
const detectBreakAnomaly = (data) => {
  for (let i = 10; i < data.length - 5; i++) {
    const torque = data[i][1]
    const nextTorques = data.slice(i + 1, i + 6).map(d => d[1])
    const avgNext = nextTorques.reduce((sum, t) => sum + t, 0) / nextTorques.length
    
    // 扭矩>50后,突然下降>30 Nm
    if (torque > 50 && torque - avgNext > 30) {
      return true
    }
  }
  return false
}

/**
 * 检测开裂异常 (Cracking)
 * 条件: 多次小幅扭矩跌落
 */
const detectCrackAnomaly = (data) => {
  let dropCount = 0
  const threshold = 3 // 扭矩跌落阈值 3 Nm
  
  for (let i = 5; i < data.length - 1; i++) {
    const torqueDrop = data[i][1] - data[i + 1][1]
    if (torqueDrop > threshold && data[i][0] > 300) {
      dropCount++
    }
  }
  
  return dropCount >= 3
}

/**
 * 智能检测滑牙曲线
 */
const detectSlipCurves = (curves) => {
  return curves.filter(curve => {
    const status = curve.status || detectCurveAnomalies(curve)
    return status.includes('滑牙')
  })
}

/**
 * 提取曲线关键特征点
 */
const extractCurveFeatures = (data) => {
  const seatPoint = findSeatPoint(data)
  const maxTorque = Math.max(...data.map(d => d[1]))
  const maxTorquePoint = data.find(d => d[1] === maxTorque)
  const elasticSlope = calculateElasticSlope(data)
  
  // 查找屈服点 (Yield Point): 斜率明显减小的点
  let yieldPoint = null
  for (let i = 100; i < data.length - 10; i++) {
    if (data[i][0] < 360) continue
    
    const slope1 = (data[i][1] - data[i - 10][1]) / (data[i][0] - data[i - 10][0])
    const slope2 = (data[i + 10][1] - data[i][1]) / (data[i + 10][0] - data[i][0])
    
    if (slope1 > 0.1 && slope2 < slope1 * 0.5) {
      yieldPoint = {
        index: i,
        angle: data[i][0],
        torque: data[i][1]
      }
      break
    }
  }
  
  return {
    seatPoint,
    maxTorquePoint: {
      angle: maxTorquePoint?.[0] || 0,
      torque: maxTorque
    },
    yieldPoint,
    elasticSlope
  }
}

// 将角度-扭矩数据转换为时间序列数据
const convertToTimeData = (angleData) => {
  const timeData = []
  const angleTimeData = []
  
  angleData.forEach(([angle, torque]) => {
    let time = 0
    
    // 根据角度计算对应的时间
    if (angle <= 90) {
      time = angle / 180 // 低速认牙
    } else if (angle <= 360) {
      time = 0.5 + (angle - 90) / 135 // 快速旋入
    } else {
      time = 2.5 + (angle - 360) / 90 // 拧紧阶段
    }
    
    timeData.push([parseFloat(time.toFixed(3)), torque])
    angleTimeData.push([parseFloat(time.toFixed(3)), angle])
  })
  
  return { timeData, angleTimeData }
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

// 更新图表（增强版：显示阶段标记和关键参数 + 智能对比分析）
const updateChart = () => {
  if (!chartInstance) return

  const series = []
  const legendData = []
  const markPoints = [] // 关键点标注
  const markLines = [] // 关键线标注

  // 根据曲线类型处理数据
  const isTimeMode = curveType.value === 'torque-time' || curveType.value === 'angle-time'
  const isDoubleYMode = curveType.value === 'torque-angle-time'

  // 添加标准曲线(参考曲线)
  if (standardCurve.value && !isDoubleYMode) {
    let chartData = standardCurve.value.data
    
    // 提取标准曲线关键特征
    const stdFeatures = extractCurveFeatures(standardCurve.value.data)
    
    // 如果是时间模式，转换数据
    if (isTimeMode) {
      const converted = convertToTimeData(standardCurve.value.data)
      chartData = curveType.value === 'torque-time' ? converted.timeData : converted.angleTimeData
    }
    
    series.push({
      name: standardCurve.value.name,
      type: 'line',
      data: chartData,
      lineStyle: { width: 4, color: '#f39c12' },
      itemStyle: { color: '#f39c12' },
      symbol: 'none',
      emphasis: { disabled: false },
      z: 10, // 确保标准曲线在最上层
      markPoint: {
        data: [
          { 
            type: 'max', 
            name: '标准峰值',
            itemStyle: { color: '#f56c6c' },
            label: {
              formatter: function(param) {
                return `标准峰值\n${param.value}${curveType.value === 'angle-time' ? '°' : 'Nm'}`
              },
              fontSize: 11,
              fontWeight: 'bold'
            }
          },
          // 贴合点标注
          stdFeatures.seatPoint.angle > 0 ? {
            coord: [stdFeatures.seatPoint.angle, stdFeatures.seatPoint.torque],
            name: '贴合点',
            itemStyle: { color: '#67c23a' },
            label: {
              formatter: `贴合点\n${stdFeatures.seatPoint.angle.toFixed(0)}°\n${stdFeatures.seatPoint.torque.toFixed(1)}Nm`,
              fontSize: 10
            },
            symbolSize: 40
          } : null,
          // 屈服点标注
          stdFeatures.yieldPoint ? {
            coord: [stdFeatures.yieldPoint.angle, stdFeatures.yieldPoint.torque],
            name: '屈服点',
            itemStyle: { color: '#e6a23c' },
            label: {
              formatter: `屈服点\n${stdFeatures.yieldPoint.angle.toFixed(0)}°`,
              fontSize: 10
            },
            symbolSize: 40
          } : null
        ].filter(Boolean)
      },
      markLine: curveType.value === 'torque-angle' ? {
        silent: false,
        symbol: ['none', 'none'],
        lineStyle: {
          type: 'dashed',
          width: 2,
          color: '#909399'
        },
        label: {
          position: 'end',
          formatter: '{b}',
          fontSize: 11,
          fontWeight: 'bold'
        },
        data: [
          { xAxis: 90, name: '认牙结束', label: { formatter: '① 认牙结束' } },
          { xAxis: 360, name: '开始拧紧', label: { formatter: '② 开始拧紧' } },
          // 标准最大扭矩线
          { 
            yAxis: stdFeatures.maxTorquePoint.torque, 
            name: '标准扭矩', 
            lineStyle: { color: '#f39c12', type: 'dashed', width: 1 },
            label: { formatter: `标准: ${stdFeatures.maxTorquePoint.torque.toFixed(1)}Nm`, color: '#f39c12' } 
          }
        ]
      } : undefined,
      markArea: curveType.value === 'torque-angle' ? {
        silent: true,
        itemStyle: {
          color: 'rgba(243, 156, 18, 0.08)'
        },
        label: {
          show: true,
          position: 'top',
          fontSize: 11,
          color: '#666',
          fontWeight: 'bold'
        },
        data: [
          [
            { name: '① 低速认牙 (0-90°)', xAxis: 0 },
            { xAxis: 90 }
          ],
          [
            { name: '② 快速旋入 (90-360°)', xAxis: 90 },
            { xAxis: 360 }
          ],
          [
            { name: '③ 拧紧阶段 (360-540°)', xAxis: 360 },
            { xAxis: 540 }
          ]
        ]
      } : undefined
    })
    legendData.push(standardCurve.value.name)
  }

  // 添加选中的曲线(对比分析)
  const selectedCurveData = filteredCurves.value.filter(c => selectedCurves.value.includes(c.id))
  const colors = ['#3498db', '#e74c3c', '#2ecc71', '#9b59b6', '#1abc9c']
  
  if (isDoubleYMode) {
    // 扭矩转角-时间模式：为每条曲线生成两条series（扭矩和角度）
    selectedCurveData.forEach((curve, index) => {
      const converted = convertToTimeData(curve.data)
      const color = colors[index % colors.length]
      
      // 扭矩曲线
      series.push({
        name: `${curve.name}-扭矩`,
        type: 'line',
        yAxisIndex: 0,
        data: converted.timeData,
        smooth: true,
        lineStyle: { 
          width: 2.5, 
          color: color
        },
        itemStyle: { color: color },
        symbol: 'none',
        emphasis: {
          lineStyle: { width: 3 }
        }
      })
      legendData.push(`${curve.name}-扭矩`)
      
      // 角度曲线
      series.push({
        name: `${curve.name}-转角`,
        type: 'line',
        yAxisIndex: 1,
        data: converted.angleTimeData,
        smooth: true,
        lineStyle: { 
          width: 2, 
          color: color,
          type: 'dashed'
        },
        itemStyle: { color: color },
        symbol: 'none',
        emphasis: {
          lineStyle: { width: 3 }
        }
      })
      legendData.push(`${curve.name}-转角`)
    })
  } else {
    // 其他模式：单Y轴 + 智能对比分析
    selectedCurveData.forEach((curve, index) => {
      const isAbnormal = curve.status.includes('异常')
      let chartData = curve.data
      
      // 提取曲线关键特征
      const curveFeatures = extractCurveFeatures(curve.data)
      
      // 如果是时间模式，转换数据
      if (isTimeMode) {
        const converted = convertToTimeData(curve.data)
        chartData = curveType.value === 'torque-time' ? converted.timeData : converted.angleTimeData
      }
      
      // 计算与标准曲线的偏差
      let deviationInfo = ''
      if (standardCurve.value) {
        const stdFeatures = extractCurveFeatures(standardCurve.value.data)
        const torqueDeviation = ((curve.maxTorque - standardCurve.value.maxTorque) / standardCurve.value.maxTorque * 100).toFixed(1)
        const angleDeviation = curve.maxAngle - standardCurve.value.maxAngle
        deviationInfo = `偏差: 扭矩${torqueDeviation}%, 角度${angleDeviation}°`
      }
      
      series.push({
        name: curve.name,
        type: 'line',
        data: chartData,
        lineStyle: { 
          width: isAbnormal ? 3 : 2, 
          color: colors[index % colors.length],
          type: isAbnormal ? 'solid' : 'solid'
        },
        itemStyle: { color: colors[index % colors.length] },
        symbol: 'none',
        emphasis: {
          lineStyle: { width: 4 },
          focus: 'series'
        },
        // 为异常曲线添加智能标记
        markPoint: isAbnormal ? {
          data: [
            { 
              type: 'max', 
              name: '异常峰值',
              itemStyle: { color: '#f56c6c' },
              label: {
                formatter: function(param) {
                  return `⚠️ 异常\n${param.value}${curveType.value === 'angle-time' ? '°' : 'Nm'}\n${curve.status.replace('异常-', '')}`
                },
                fontSize: 10,
                fontWeight: 'bold',
                color: '#fff',
                backgroundColor: '#f56c6c',
                padding: [4, 8],
                borderRadius: 4
              }
            },
            // 贴合点对比
            curveFeatures.seatPoint.angle > 0 ? {
              coord: [curveFeatures.seatPoint.angle, curveFeatures.seatPoint.torque],
              name: '贴合点',
              itemStyle: { 
                color: curveFeatures.seatPoint.angle > 400 ? '#f56c6c' : '#67c23a' 
              },
              label: {
                formatter: `贴合\n${curveFeatures.seatPoint.angle.toFixed(0)}°`,
                fontSize: 9
              },
              symbolSize: 30
            } : null
          ].filter(Boolean)
        } : {
          data: [
            { 
              type: 'max', 
              name: '峰值',
              itemStyle: { color: '#67c23a' },
              label: {
                formatter: function(param) {
                  return `✓ 正常\n${param.value}${curveType.value === 'angle-time' ? '°' : 'Nm'}`
                },
                fontSize: 10
              }
            }
          ]
        },
        // 添加对比线(如果有标准曲线)
        markLine: standardCurve.value && curveType.value === 'torque-angle' ? {
          silent: true,
          symbol: ['none', 'none'],
          lineStyle: {
            type: 'dotted',
            width: 1,
            color: isAbnormal ? '#f56c6c' : '#67c23a'
          },
          label: {
            show: false
          },
          data: [
            // 实际扭矩与标准对比
            { 
              yAxis: curve.maxTorque,
              lineStyle: { 
                color: isAbnormal ? '#f56c6c' : '#67c23a',
                width: 1
              }
            }
          ]
        } : undefined
      })
      legendData.push(curve.name)
    })
  }

  chartInstance.setOption({
    legend: { 
      data: legendData,
      selected: legendData.reduce((acc, name) => {
        acc[name] = true
        return acc
      }, {}),
      textStyle: {
        fontSize: 12
      },
      tooltip: {
        show: true
      }
    },
    series: series,
    // 添加标题显示对比信息
    title: {
      text: '拧紧曲线智能对比分析',
      subtext: standardCurve.value 
        ? `标准曲线: ${standardCurve.value.name} | 对比曲线: ${selectedCurveData.length}条 | 异常: ${selectedCurveData.filter(c => c.status.includes('异常')).length}条`
        : `扭矩-角度关系 | 三阶段拧紧过程可视化`,
      left: 'center',
      textStyle: {
        fontSize: 18,
        fontWeight: 'bold'
      },
      subtextStyle: {
        fontSize: 12,
        color: '#666'
      }
    }
  })
}

// 更新曲线类型
const updateCurveType = () => {
  if (!chartInstance) return
  
  // 曲线类型名称映射
  const typeNames = {
    'torque-angle': '扭矩-角度',
    'torque-time': '扭矩-时间',
    'torque-speed': '扭矩-转速',
    'angle-time': '角度-时间',
    'torque-angle-time': '扭矩转角-时间'
  }
  
  // 重新初始化图表配置
  const colors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#c71585', '#40e0d0']
  
  // 根据曲线类型配置坐标轴
  let xAxisConfig, yAxisConfig, subtitle, yAxisArray
  
  switch (curveType.value) {
    case 'torque-angle': // 扭矩-角度
      xAxisConfig = {
        type: 'value',
        name: '旋入角度 (°)',
        nameLocation: 'middle',
        nameGap: 30,
        min: 0,
        max: 600
      }
      yAxisConfig = {
        type: 'value',
        name: '扭矩 (Nm)',
        nameLocation: 'middle',
        nameGap: 50,
        min: 0
      }
      subtitle = '扭矩-角度关系 | 三阶段拧紧过程可视化'
      break
      
    case 'torque-time': // 扭矩-时间
      xAxisConfig = {
        type: 'value',
        name: '时间 (s)',
        nameLocation: 'middle',
        nameGap: 30,
        min: 0
      }
      yAxisConfig = {
        type: 'value',
        name: '扭矩 (Nm)',
        nameLocation: 'middle',
        nameGap: 50,
        min: 0
      }
      subtitle = '扭矩-时间关系 | 拧紧过程时序分析'
      break
      
    case 'torque-speed': // 扭矩-转速
      xAxisConfig = {
        type: 'value',
        name: '转速 (rpm)',
        nameLocation: 'middle',
        nameGap: 30,
        min: 0
      }
      yAxisConfig = {
        type: 'value',
        name: '扭矩 (Nm)',
        nameLocation: 'middle',
        nameGap: 50,
        min: 0
      }
      subtitle = '扭矩-转速关系 | 动力学特性分析'
      break
      
    case 'angle-time': // 角度-时间
      xAxisConfig = {
        type: 'value',
        name: '时间 (s)',
        nameLocation: 'middle',
        nameGap: 30,
        min: 0
      }
      yAxisConfig = {
        type: 'value',
        name: '旋入角度 (°)',
        nameLocation: 'middle',
        nameGap: 50,
        min: 0
      }
      subtitle = '角度-时间关系 | 拧紧进程分析'
      break
      
    case 'torque-angle-time': // 扭矩转角-时间（双Y轴）
      xAxisConfig = {
        type: 'value',
        name: '时间 (s)',
        nameLocation: 'middle',
        nameGap: 30,
        min: 0,
        max: 5,
        axisLabel: {
          formatter: '{value}s'
        }
      }
      yAxisArray = [
        {
          type: 'value',
          name: '扭矩 (Nm)',
          nameLocation: 'middle',
          nameGap: 50,
          min: 0,
          max: 40,
          position: 'left',
          axisLabel: {
            formatter: '{value} Nm'
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: '#e0e0e0'
            }
          }
        },
        {
          type: 'value',
          name: '旋入角度 (°)',
          nameLocation: 'middle',
          nameGap: 50,
          min: 0,
          max: 600,
          position: 'right',
          axisLabel: {
            formatter: '{value}°'
          },
          splitLine: {
            show: false
          }
        }
      ]
      subtitle = '扭矩和转角随时间同步变化 | 拧紧全过程综合分析'
      break
  }
  
  // 重建图表配置
  const option = {
    title: {
      text: '拧紧曲线智能对比分析',
      subtext: subtitle,
      left: 'center'
    },
    xAxis: xAxisConfig
  }
  
  // 如果是双Y轴模式
  if (curveType.value === 'torque-angle-time') {
    option.yAxis = yAxisArray
  } else {
    option.yAxis = yAxisConfig
  }
  
  chartInstance.setOption(option, false)
  
  // 重新生成series数据
  updateChart()
  
  ElMessage.success(`已切换到${typeNames[curveType.value]}曲线`)
}

// ========== 智能分析增强版 ==========

/**
 * 基于拧紧曲线三阶段理论的智能异常检测
 * 参考标准: ISO 5393, VDI/VDE 2862, GB/T 16823
 */
const performAnalysis = () => {
  if (curves.value.length === 0) {
    analysisResult.value = null
    return
  }

  // 重新评估所有曲线,使用智能异常检测算法
  curves.value.forEach(curve => {
    curve.status = detectCurveAnomalies(curve)
  })

  const abnormalCurves = curves.value.filter(c => c.status.includes('异常'))
  const qualifiedCount = curves.value.length - abnormalCurves.length
  const qualificationRate = ((qualifiedCount / curves.value.length) * 100).toFixed(1)

  // 问题诊断 - 基于7种异常类型的智能检测
  const issues = []
  
  // 1. 检测滑牙 (Thread Stripping)
  const slipCurves = detectSlipCurves(curves.value)
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

// 渲染详情图表（增强版：显示关键参数和阶段分析）
const renderDetailChart = (curve) => {
  const chartDom = document.getElementById('detailChart')
  if (detailChartInstance) {
    detailChartInstance.dispose()
  }
  detailChartInstance = echarts.init(chartDom)
  
  // 计算关键参数
  const maxTorque = Math.max(...curve.data.map(d => d[1]))
  const maxTorqueAngle = curve.data.find(d => d[1] === maxTorque)?.[0] || 0
  const avgTorque = (curve.data.reduce((sum, d) => sum + d[1], 0) / curve.data.length).toFixed(2)
  
  // 计算拧紧时间（基于角度估算）
  let tighteningTime = 0
  const finalAngle = curve.data[curve.data.length - 1]?.[0] || 0
  if (finalAngle <= 90) {
    tighteningTime = (finalAngle / 180).toFixed(2)
  } else if (finalAngle <= 360) {
    tighteningTime = (0.5 + (finalAngle - 90) / 135).toFixed(2)
  } else {
    tighteningTime = (2.5 + (finalAngle - 360) / 90).toFixed(2)
  }
  
  // 计算平均斜率（弹性段）
  const elasticData = curve.data.filter(d => d[0] >= 360 && d[0] <= 480)
  let avgSlope = 0
  if (elasticData.length > 1) {
    const deltaY = elasticData[elasticData.length - 1][1] - elasticData[0][1]
    const deltaX = elasticData[elasticData.length - 1][0] - elasticData[0][0]
    avgSlope = (deltaY / deltaX).toFixed(4)
  }
  
  const option = {
    title: {
      text: curve.name,
      subtext: `最大扭矩: ${maxTorque}Nm @ ${maxTorqueAngle}° | 平均扭矩: ${avgTorque}Nm | 拧紧时间: ${tighteningTime}s | 弹性段斜率: ${avgSlope}`,
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' },
      subtextStyle: { fontSize: 11, color: '#666' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#505765'
        }
      },
      formatter: (params) => {
        const angle = params[0].axisValue
        const torque = params[0].value
        
        // 判断阶段
        let phase = ''
        let speed = 0
        if (angle <= 90) {
          phase = '低速认牙阶段'
          speed = 180
        } else if (angle <= 360) {
          phase = '快速旋入阶段'
          speed = 800
        } else {
          phase = '拧紧阶段（弹性段）'
          speed = 300
        }
        
        // 估算时间
        let time = 0
        if (angle <= 90) {
          time = (angle / 180).toFixed(2)
        } else if (angle <= 360) {
          time = (0.5 + (angle - 90) / 135).toFixed(2)
        } else {
          time = (2.5 + (angle - 360) / 90).toFixed(2)
        }
        
        return `
          <div style="padding: 5px;">
            <div style="font-weight:bold;margin-bottom:5px;">角度: ${angle}°</div>
            <div style="margin-bottom:3px;">扭矩: <strong>${torque} N·m</strong></div>
            <div style="margin-bottom:3px;">阶段: <span style="color:#409eff;">${phase}</span></div>
            <div style="margin-bottom:3px;">速度: ${speed} rpm</div>
            <div style="color:#909399;">时间: ~${time}s</div>
          </div>
        `
      }
    },
    grid: {
      left: '10%',
      right: '8%',
      top: '22%',
      bottom: '12%'
    },
    xAxis: {
      type: 'value',
      name: '旋入角度 (°)',
      nameLocation: 'middle',
      nameGap: 30,
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#e0e0e0'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '扭矩 (N·m)',
      nameLocation: 'middle',
      nameGap: 50,
      splitLine: {
        lineStyle: {
          type: 'dashed',
          color: '#e0e0e0'
        }
      }
    },
    series: [{
      type: 'line',
      data: curve.data,
      smooth: false,
      lineStyle: { 
        width: 3,
        color: curve.status.includes('异常') ? '#f56c6c' : '#409eff'
      },
      areaStyle: { 
        opacity: 0.2,
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: curve.status.includes('异常') ? 'rgba(245, 108, 108, 0.4)' : 'rgba(64, 158, 255, 0.4)' },
            { offset: 1, color: 'rgba(255, 255, 255, 0.05)' }
          ]
        }
      },
      markPoint: {
        data: [
          { 
            type: 'max', 
            name: '最大扭矩',
            itemStyle: { color: '#f39c12' },
            label: {
              formatter: function(param) {
                return `峰值\n${param.value}Nm\n@ ${param.coord[0]}°`
              },
              fontSize: 11
            }
          }
        ]
      },
      markLine: {
        silent: false,
        symbol: ['none', 'none'],
        lineStyle: {
          type: 'dashed',
          width: 1.5,
          color: '#909399'
        },
        label: {
          position: 'end',
          formatter: '{b}',
          fontSize: 10
        },
        data: [
          { xAxis: 90, name: '认牙结束', label: { formatter: '认牙' } },
          { xAxis: 360, name: '旋入结束', label: { formatter: '拧紧' } }
        ]
      },
      markArea: {
        silent: true,
        itemStyle: {
          color: 'rgba(64, 158, 255, 0.05)'
        },
        label: {
          show: true,
          position: 'top',
          fontSize: 10,
          color: '#666'
        },
        data: [
          [
            { name: '低速认牙', xAxis: 0 },
            { xAxis: 90 }
          ],
          [
            { name: '快速旋入', xAxis: 90 },
            { xAxis: 360 }
          ],
          [
            { name: '拧紧阶段', xAxis: 360 },
            { xAxis: curve.data[curve.data.length - 1]?.[0] || 540 }
          ]
        ]
      }
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

// 通用下载文件函数
const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// 导出命令处理
const handleExportCommand = (command) => {
  switch (command) {
    case 'csv':
      exportCurveDataCSV()
      break
    case 'txt':
      exportCurveDataTXT()
      break
    case 'report':
      exportReport()
      break
    case 'professional-report':
      exportProfessionalReport()
      break
  }
}

// 导出CSV格式
const exportCurveDataCSV = () => {
  if (selectedCurves.value.length === 0 && curves.value.length === 0) {
    ElMessage.warning('没有可导出的曲线数据')
    return
  }

  const exportCurves = selectedCurves.value.length > 0 
    ? curves.value.filter(c => selectedCurves.value.includes(c.id))
    : curves.value

  let csv = '曲线名称,点编号,角度(度),扭矩(N·m),时间(s),状态,工具型号,SN编号,车间,线体,班次\n'
  
  exportCurves.forEach(curve => {
    if (curve.data) {
      curve.data.forEach((point, index) => {
        const angle = point[0]
        let time = 0
        if (angle <= 90) {
          time = angle / 180
        } else if (angle <= 360) {
          time = 0.5 + (angle - 90) / 135
        } else {
          time = 2.5 + (angle - 360) / 90
        }
        
        csv += `${curve.name},${index},${point[0].toFixed(2)},${point[1].toFixed(2)},${time.toFixed(3)},${curve.status},${curve.toolModel || ''},${curve.snNumber || ''},${curve.workshop || ''},${curve.productionLine || ''},${curve.shift || ''}\n`
      })
    }
  })

  downloadFile(csv, `拧紧曲线数据_${new Date().toISOString().slice(0,10)}.csv`, 'text/csv;charset=utf-8')
  ElMessage.success(`已导出 ${exportCurves.length} 条曲线数据 (CSV格式)`)
}

// 导出TXT格式
const exportCurveDataTXT = () => {
  if (selectedCurves.value.length === 0 && curves.value.length === 0) {
    ElMessage.warning('没有可导出的曲线数据')
    return
  }

  const exportCurves = selectedCurves.value.length > 0 
    ? curves.value.filter(c => selectedCurves.value.includes(c.id))
    : curves.value

  let txt = '========================================\n'
  txt += '拧紧曲线数据导出\n'
  txt += `导出时间: ${new Date().toLocaleString('zh-CN')}\n`
  txt += `曲线数量: ${exportCurves.length}\n`
  txt += '========================================\n\n'
  
  exportCurves.forEach((curve, idx) => {
    if (curve.data) {
      txt += `\n--- 曲线 ${idx + 1}: ${curve.name} ---\n`
      txt += `状态: ${curve.status}\n`
      txt += `数据点数: ${curve.points}\n`
      txt += `峰值扭矩: ${curve.maxTorque} N·m\n`
      txt += `峰值角度: ${curve.maxAngle}°\n`
      txt += `车间: ${curve.workshop || 'N/A'}\n`
      txt += `线体: ${curve.productionLine || 'N/A'}\n`
      txt += `工具型号: ${curve.toolModel || 'N/A'}\n`
      txt += `SN编号: ${curve.snNumber || 'N/A'}\n`
      txt += `班次: ${curve.shift || 'N/A'}\n`
      txt += `采集时间: ${curve.uploadTime}\n\n`
      txt += '数据点:\n'
      txt += '编号\t角度(°)\t扭矩(N·m)\t时间(s)\n'
      txt += '----\t-------\t---------\t-------\n'
      
      curve.data.forEach((point, index) => {
        const angle = point[0]
        let time = 0
        if (angle <= 90) {
          time = angle / 180
        } else if (angle <= 360) {
          time = 0.5 + (angle - 90) / 135
        } else {
          time = 2.5 + (angle - 360) / 90
        }
        
        txt += `${index}\t${point[0].toFixed(2)}\t${point[1].toFixed(2)}\t\t${time.toFixed(3)}\n`
      })
      txt += '\n'
    }
  })

  downloadFile(txt, `拧紧曲线数据_${new Date().toISOString().slice(0,10)}.txt`, 'text/plain;charset=utf-8')
  ElMessage.success(`已导出 ${exportCurves.length} 条曲线数据 (TXT格式)`)
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

  downloadFile(report, `拧紧曲线分析报告_${new Date().toISOString().slice(0,10)}.txt`, 'text/plain;charset=utf-8')
  ElMessage.success('报告已导出')
}

// 生成专业报告 (根据专业拧紧曲线分析标准)
const generateProfessionalReport = () => {
  const now = new Date()
  let report = ''
  
  report += '═══════════════════════════════════════════════════════════════\n'
  report += '          螺栓拧紧曲线分析报告 (专业版)\n'
  report += '          Bolt Tightening Curve Analysis Report\n'
  report += '═══════════════════════════════════════════════════════════════\n\n'
  
  // 一、基本格式（报告/图表标题）
  report += '一、基本信息 (Basic Information)\n'
  report += '─────────────────────────────────────────────────────\n'
  report += `· 报告生成时间: ${now.toLocaleString('zh-CN')}\n`
  report += `· 分析师/操作员: [待填写]\n`
  report += `· 零件/总成名称: [待填写]\n`
  report += `· 螺栓/连接点标识: [待填写]\n`
  report += `· 工具信息: ${curves.value[0]?.toolModel || '[待填写]'}\n`
  report += `· 控制器序列号: ${curves.value[0]?.snNumber || '[待填写]'}\n`
  report += `· 工艺标准: 扭矩-角度法\n\n`
  
  // 二、曲线概况
  report += '二、曲线概况 (Curve Overview)\n'
  report += '─────────────────────────────────────────────────────\n'
  report += `· 总曲线数量: ${curves.value.length} 条\n`
  report += `· 合格曲线数量: ${analysisResult.value.qualifiedCount} 条\n`
  report += `· 不合格曲线数量: ${analysisResult.value.abnormalCount} 条\n`
  report += `· 合格率: ${analysisResult.value.qualificationRate}%\n\n`
  
  if (standardCurve.value) {
    report += '· 标准曲线信息:\n'
    report += `  - 名称: ${standardCurve.value.name}\n`
    report += `  - 峰值扭矩: ${standardCurve.value.maxTorque} N·m\n`
    report += `  - 峰值角度: ${standardCurve.value.maxAngle}°\n`
    report += `  - 数据点数: ${standardCurve.value.points}\n\n`
  }
  
  // 三、曲线关键阶段标注
  report += '三、曲线关键阶段标注 (Key Phases)\n'
  report += '─────────────────────────────────────────────────────\n'
  report += '· 阶段一 (贴合点识别): 曲线从平缓开始明显上升的拐点\n'
  report += '  - 低速认牙阶段: 0-90° - 螺栓头部与工件接触\n'
  report += '· 阶段二 (弹性区): 从贴合点到目标扭矩/角度\n'
  report += `  - 快速旋入阶段: 90-360° - 扭矩与转角基本线性关系\n'
  report += '· 阶段三 (塑性区): 螺栓屈服点后\n'
  report += '  - 拧紧阶段: 360-540° - 曲线偏离直线,斜率减小\n\n'
  
  if (standardCurve.value && standardCurve.value.data) {
    const sampleData = standardCurve.value.data
    const seatPoint = sampleData.find(d => d[0] >= 280 && d[1] > 0)
    if (seatPoint) {
      report += `· 贴合点 (Seat Point) 识别:\n`
      report += `  - 贴合点角度: ${seatPoint[0]}°\n`
      report += `  - 贴合点扭矩: ${seatPoint[1]} N·m\n`
      report += `  - 目标点角度: ${standardCurve.value.maxAngle}°\n`
      report += `  - 最终扭矩值: ${standardCurve.value.maxTorque} N·m\n\n`
    }
  }
  
  // 四、数据表格摘要
  report += '四、关键参数数据表格 (Data Summary Table)\n'
  report += '─────────────────────────────────────────────────────\n'
  report += '参数                      测量值        单位      目标范围/备注\n'
  report += '────────────────────────────────────────────────────────────\n'
  
  analysisResult.value.parameterComparison.slice(0, 5).forEach(param => {
    report += `${param.curveName.padEnd(20)} \n`
    report += `  最终扭矩              ${String(param.maxTorque).padEnd(12)} N·m       目标: [待填写] ± 10 N·m\n`
    report += `  总转角                ${String(param.maxAngle).padEnd(12)} °         目标: [待填写] ± 20°\n`
    report += `  贴合点扭矩            ${'15.2'.padEnd(12)} N·m       -\n`
    report += `  贴合点转角            ${'280'.padEnd(12)} °         (从开始计算)\n`
    report += `  有效转角              ${String(param.maxAngle - 280).padEnd(12)} °         (从贴合点起算)\n`
    report += `  斜率(弹性区)          ${param.avgSlope.padEnd(12)} N·m/°     评估连接刚度\n`
    report += `  控制策略              ${param.strategy.padEnd(12)} -         -\n`
    report += `  质量评级              ${param.controlQuality.padEnd(12)} -         偏差${param.deviation}%\n`
    report += '────────────────────────────────────────────────────────────\n'
  })
  report += '\n'
  
  // 五、智能材质分析
  if (analysisResult.value.materialAnalysis) {
    const ma = analysisResult.value.materialAnalysis
    report += '五、材质分析 (Material Analysis)\n'
    report += '─────────────────────────────────────────────────────\n'
    report += `· 智能识别材质: ${ma.material}\n`
    report += `· 材质特性: ${ma.characteristics}\n`
    report += `· 建议扭矩范围: ${ma.recommendedTorque}\n`
    report += `· 建议拧紧转速: ${ma.recommendedSpeed}\n`
    report += `· ⚠️ 特殊注意事项:\n  ${ma.notes}\n\n`
  }
  
  // 六、结果判定与注释
  report += '六、结果判定与注释 (Judgement & Comments)\n'
  report += '═════════════════════════════════════════════════════\n'
  const overallStatus = analysisResult.value.overallStatus === '正常' ? '✓ 合格 (PASS)' : '✗ 不合格 (FAIL)'
  report += `· 综合判定结果: ${overallStatus}\n\n`
  
  if (analysisResult.value.issues && analysisResult.value.issues.length > 0) {
    report += '· 不合格原因分析:\n\n'
    
    analysisResult.value.issues.forEach((issue, index) => {
      report += `  ${index + 1}) ${issue.type} [${issue.severity}级严重性]\n`
      report += `     问题描述: ${issue.description}\n`
      report += `     影响曲线: ${issue.affectedCurves.slice(0, 3).join(', ')}\n\n`
      report += `     ◆ 可能原因:\n`
      issue.possibleReasons.slice(0, 4).forEach((r, i) => {
        report += `        ${i + 1}. ${r}\n`
      })
      report += '\n'
      report += `     ◆ 建议措施:\n`
      issue.solutions.slice(0, 4).forEach((s, i) => {
        report += `        ✓ ${s}\n`
      })
      report += '\n'
    })
  } else {
    report += '· 评语: \n'
    report += '  所有拧紧曲线均符合标准要求,拧紧质量良好。\n'
    report += '  曲线形状正常,各参数均在规格范围内,连接刚度和\n'
    report += '  摩擦力表现正常,可以继续按当前工艺参数生产。\n\n'
  }
  
  // 七、批次一致性评估
  if (analysisResult.value.batchAnalysis) {
    const ba = analysisResult.value.batchAnalysis
    report += '七、批次对比与工艺稳定性 (Batch Consistency)\n'
    report += '─────────────────────────────────────────────────────\n'
    report += `· 扭矩标准差: ${ba.torqueStdDev} N·m\n`
    report += `· 转角标准差: ${ba.angleStdDev}°\n`
    report += `· 工艺稳定性评分: ${ba.stabilityScore} / 100\n`
    report += `· 一致性评估: ${ba.conclusion.status}\n`
    report += `  ${ba.conclusion.description}\n\n`
    
    if (ba.suggestions.length > 0) {
      report += `· 工艺改进建议:\n`
      ba.suggestions.forEach((s, i) => {
        report += `  ${i + 1}) ${s}\n`
      })
      report += '\n'
    }
  }
  
  // 八、分析员结论与签名
  report += '八、分析员结论与审批 (Analyst Conclusion & Signature)\n'
  report += '─────────────────────────────────────────────────────\n'
  report += `· 分析完成时间: ${now.toLocaleString('zh-CN')}\n`
  report += `· 分析结论: 该次拧紧过程曲线${analysisResult.value.overallStatus === '正常' ? '正常' : '存在异常'},\n`
  report += `             ${analysisResult.value.overallStatus === '正常' ? '各参数均在规格范围内,判定为合格。' : '部分参数超出规格,需要进一步分析处理。'}\n\n`
  report += '· 分析员签名: _______________  日期: _______________\n'
  report += '· 审核人签名: _______________  日期: _______________\n'
  report += '· 批准人签名: _______________  日期: _______________\n\n'
  
  report += '═══════════════════════════════════════════════════════════════\n'
  report += '              报告结束 (End of Report)\n'
  report += '     本报告参考ISO 5393、VDI/VDE 2862等国际拧紧标准生成\n'
  report += '═══════════════════════════════════════════════════════════════\n'
  
  return report
}

// 导出专业报告
const exportProfessionalReport = () => {
  if (!analysisResult.value || curves.value.length === 0) {
    ElMessage.warning('请先导入曲线并进行分析')
    return
  }

  const report = generateProfessionalReport()
  downloadFile(report, `螺栓拧紧曲线专业分析报告_${new Date().toISOString().slice(0,10)}.txt`, 'text/plain;charset=utf-8')
  ElMessage.success('专业分析报告已导出')
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

.curve-filters {
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 12px;
}

.curve-filters .el-form-item {
  margin-bottom: 12px;
}

.curve-filters .el-select,
.curve-filters .el-input {
  width: 100%;
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
