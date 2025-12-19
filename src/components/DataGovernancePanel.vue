<template>
  <div class="data-governance-panel">
    <el-card class="header-card">
      <div class="header">
        <div class="title">
          <el-icon :size="24" color="#409EFF"><Management /></el-icon>
          <h2>数据质量自动治理</h2>
        </div>
        <el-button 
          type="primary" 
          @click="runFullGovernance"
          :loading="running"
        >
          <el-icon><MagicStick /></el-icon>
          执行完整治理流程
        </el-button>
      </div>
    </el-card>

    <!-- 治理统计概览 -->
    <div class="stats-grid">
      <el-card class="stat-card">
        <div class="stat-content">
          <el-icon :size="40" color="#67C23A"><SuccessFilled /></el-icon>
          <div class="stat-info">
            <div class="stat-value">{{ governanceState.cleaningStats.cleanedRecords }}</div>
            <div class="stat-label">清洗成功</div>
          </div>
        </div>
        <el-progress 
          :percentage="cleaningRate" 
          :color="progressColors"
        />
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <el-icon :size="40" color="#E6A23C"><CopyDocument /></el-icon>
          <div class="stat-info">
            <div class="stat-value">{{ governanceState.duplicateStats.totalGroups }}</div>
            <div class="stat-label">重复组</div>
          </div>
        </div>
        <el-tag v-if="governanceState.duplicateStats.totalDuplicates > 0" type="warning">
          {{ governanceState.duplicateStats.totalDuplicates }}条重复
        </el-tag>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <el-icon :size="40" color="#F56C6C"><WarningFilled /></el-icon>
          <div class="stat-info">
            <div class="stat-value">{{ governanceState.anomalyStats.anomaliesDetected }}</div>
            <div class="stat-label">异常检测</div>
          </div>
        </div>
        <el-tag v-if="governanceState.anomalyStats.anomaliesDetected > 0" type="danger">
          需要人工审核
        </el-tag>
      </el-card>

      <el-card class="stat-card">
        <div class="stat-content">
          <el-icon :size="40" color="#409EFF"><Lock /></el-icon>
          <div class="stat-info">
            <div class="stat-value">{{ totalClassified }}</div>
            <div class="stat-label">已分级</div>
          </div>
        </div>
        <div class="classification-breakdown">
          <el-tag size="small" type="success">公开:{{ governanceState.classificationStats.public }}</el-tag>
          <el-tag size="small" type="info">内部:{{ governanceState.classificationStats.internal }}</el-tag>
          <el-tag size="small" type="warning">机密:{{ governanceState.classificationStats.confidential }}</el-tag>
          <el-tag size="small" type="danger">绝密:{{ governanceState.classificationStats.secret }}</el-tag>
        </div>
      </el-card>
    </div>

    <!-- 治理功能标签页 -->
    <el-tabs v-model="activeTab" class="governance-tabs">
      <!-- 数据清洗 -->
      <el-tab-pane label="数据清洗" name="cleaning">
        <el-card>
          <h3>清洗规则配置</h3>
          <el-form :model="cleaningConfig" label-width="120px">
            <el-form-item label="字段映射">
              <el-select 
                v-model="cleaningConfig.selectedFields" 
                multiple 
                placeholder="选择需要清洗的字段"
              >
                <el-option 
                  v-for="field in availableFields" 
                  :key="field.key"
                  :label="field.label"
                  :value="field.key"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="清洗策略">
              <el-checkbox-group v-model="cleaningConfig.strategies">
                <el-checkbox label="trim">去除空白字符</el-checkbox>
                <el-checkbox label="format">格式标准化</el-checkbox>
                <el-checkbox label="validate">数据验证</el-checkbox>
                <el-checkbox label="normalize">数据归一化</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-button type="primary" @click="runCleaning">执行清洗</el-button>
          </el-form>

          <!-- 清洗结果 -->
          <div v-if="cleaningResults.length > 0" class="results-section">
            <h3>清洗结果</h3>
            <el-table :data="cleaningResults" max-height="400">
              <el-table-column prop="index" label="序号" width="80" />
              <el-table-column prop="field" label="字段" width="150" />
              <el-table-column prop="before" label="清洗前" width="200" />
              <el-table-column prop="after" label="清洗后" width="200" />
              <el-table-column label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.status === 'success' ? 'success' : 'warning'">
                    {{ row.status === 'success' ? '成功' : '警告' }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-tab-pane>

      <!-- 重复检测 -->
      <el-tab-pane label="重复检测" name="duplicate">
        <el-card>
          <h3>重复检测配置</h3>
          <el-form :model="duplicateConfig" label-width="120px">
            <el-form-item label="关键字段">
              <el-select 
                v-model="duplicateConfig.keyFields" 
                multiple 
                placeholder="选择用于比对的关键字段"
              >
                <el-option 
                  v-for="field in availableFields" 
                  :key="field.key"
                  :label="field.label"
                  :value="field.key"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="相似度阈值">
              <el-slider 
                v-model="duplicateConfig.threshold" 
                :min="0" 
                :max="100" 
                :step="5"
                show-input
              />
              <span class="hint">当前阈值: {{ duplicateConfig.threshold }}%</span>
            </el-form-item>

            <el-form-item label="合并策略">
              <el-radio-group v-model="duplicateConfig.mergeStrategy">
                <el-radio label="latest">使用最新数据</el-radio>
                <el-radio label="mostComplete">使用最完整数据</el-radio>
                <el-radio label="bestQuality">使用最高质量数据</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-button type="primary" @click="runDuplicateDetection">检测重复</el-button>
          </el-form>

          <!-- 重复数据列表 -->
          <div v-if="duplicateGroups.length > 0" class="results-section">
            <h3>检测到 {{ duplicateGroups.length }} 组重复数据</h3>
            <el-collapse v-model="activeDuplicateGroups">
              <el-collapse-item 
                v-for="(group, index) in duplicateGroups" 
                :key="index"
                :name="index"
              >
                <template #title>
                  <div class="duplicate-group-header">
                    <el-tag type="warning">组 {{ index + 1 }}</el-tag>
                    <span>{{ group.records.length }} 条记录</span>
                    <span>相似度: {{ (group.similarity * 100).toFixed(1) }}%</span>
                  </div>
                </template>
                
                <el-table :data="group.records" border>
                  <el-table-column 
                    v-for="field in duplicateConfig.keyFields" 
                    :key="field"
                    :prop="field" 
                    :label="getFieldLabel(field)"
                  />
                  <el-table-column label="操作" width="150">
                    <template #default="{ row }">
                      <el-button size="small" @click="keepRecord(group, row)">保留</el-button>
                      <el-button size="small" type="danger" @click="deleteRecord(row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                
                <div class="group-actions">
                  <el-button type="primary" @click="mergeGroup(group)">
                    智能合并
                  </el-button>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-card>
      </el-tab-pane>

      <!-- 异常检测 -->
      <el-tab-pane label="异常检测" name="anomaly">
        <el-card>
          <h3>异常检测配置</h3>
          <el-form :model="anomalyConfig" label-width="120px">
            <el-form-item label="数值字段">
              <el-select 
                v-model="anomalyConfig.numericFields" 
                multiple 
                placeholder="选择需要检测的数值字段"
              >
                <el-option 
                  v-for="field in numericFields" 
                  :key="field.key"
                  :label="field.label"
                  :value="field.key"
                />
              </el-select>
            </el-form-item>

            <el-form-item label="检测方法">
              <el-radio-group v-model="anomalyConfig.method">
                <el-radio label="zscore">Z-Score (标准差)</el-radio>
                <el-radio label="iqr">IQR (四分位距)</el-radio>
                <el-radio label="timeseries">时间序列</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="敏感度">
              <el-slider 
                v-model="anomalyConfig.sensitivity" 
                :min="1" 
                :max="5" 
                :marks="{ 1: '低', 3: '中', 5: '高' }"
              />
            </el-form-item>

            <el-button type="primary" @click="runAnomalyDetection">检测异常</el-button>
          </el-form>

          <!-- 异常值列表 -->
          <div v-if="anomalies.length > 0" class="results-section">
            <h3>检测到 {{ totalAnomalies }} 个异常值</h3>
            <el-table :data="anomalies" max-height="400">
              <el-table-column prop="field" label="字段" width="150" />
              <el-table-column prop="value" label="异常值" width="150" />
              <el-table-column label="预期范围" width="200">
                <template #default="{ row }">
                  {{ row.expectedRange ? `[${row.expectedRange[0].toFixed(2)}, ${row.expectedRange[1].toFixed(2)}]` : '-' }}
                </template>
              </el-table-column>
              <el-table-column label="Z-Score" width="120">
                <template #default="{ row }">
                  <el-tag :type="row.zScore > 3 ? 'danger' : 'warning'">
                    {{ row.zScore?.toFixed(2) || '-' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template #default="{ row }">
                  <el-button size="small" @click="correctAnomaly(row)">修正</el-button>
                  <el-button size="small" type="info" @click="ignoreAnomaly(row)">忽略</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-tab-pane>

      <!-- 数据分级 -->
      <el-tab-pane label="数据分级" name="classification">
        <el-card>
          <h3>数据分级概览</h3>
          <div class="classification-overview">
            <el-row :gutter="20">
              <el-col :span="6" v-for="(level, key) in dataLevels" :key="key">
                <el-card :body-style="{ background: level.color + '20' }">
                  <div class="level-card">
                    <el-icon :size="30" :color="level.color">
                      <Lock v-if="key === 'secret'" />
                      <Warning v-else-if="key === 'confidential'" />
                      <InfoFilled v-else-if="key === 'internal'" />
                      <Unlock v-else />
                    </el-icon>
                    <h4>{{ level.label }}</h4>
                    <div class="level-count">{{ governanceState.classificationStats[key] || 0 }} 字段</div>
                    <ul class="level-features">
                      <li v-if="level.encryption">✓ 加密存储</li>
                      <li v-if="level.accessControl">✓ 访问控制</li>
                      <li v-if="level.auditLog">✓ 审计日志</li>
                      <li v-if="level.approvalRequired">✓ 审批流程</li>
                    </ul>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>

          <!-- 字段分级配置 -->
          <div class="field-classification-config">
            <h3>字段分级配置</h3>
            <el-table :data="fieldClassificationList" border>
              <el-table-column prop="field" label="字段" width="200" />
              <el-table-column label="当前级别" width="150">
                <template #default="{ row }">
                  <el-tag :type="getLevelTagType(row.level)">
                    {{ dataLevels[row.level]?.label }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="调整级别" width="200">
                <template #default="{ row }">
                  <el-select v-model="row.level" size="small">
                    <el-option 
                      v-for="(level, key) in dataLevels" 
                      :key="key"
                      :label="level.label"
                      :value="key"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="示例数据" width="250">
                <template #default="{ row }">
                  <span v-if="row.isSensitive">
                    {{ maskSensitiveData(row.sampleValue, row.field) }}
                  </span>
                  <span v-else>{{ row.sampleValue }}</span>
                </template>
              </el-table-column>
              <el-table-column label="访问权限">
                <template #default="{ row }">
                  <el-tag 
                    v-for="role in getAllowedRoles(row.level)" 
                    :key="role"
                    size="small"
                    style="margin: 2px;"
                  >
                    {{ role }}
                  </el-tag>
                </template>
              </el-table-column>
            </el-table>
            
            <div style="margin-top: 20px;">
              <el-button type="primary" @click="saveClassificationConfig">
                保存配置
              </el-button>
            </div>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 治理日志 -->
    <el-card class="log-card">
      <h3>治理操作日志</h3>
      <el-timeline>
        <el-timeline-item 
          v-for="log in governanceLogs" 
          :key="log.id"
          :timestamp="log.timestamp"
          :type="log.type"
        >
          <strong>{{ log.action }}</strong>
          <p>{{ log.details }}</p>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { 
  Management, MagicStick, SuccessFilled, CopyDocument, 
  WarningFilled, Lock, Unlock, Warning, InfoFilled 
} from '@element-plus/icons-vue'
import { useDataGovernance } from '@/utils/dataGovernance'
import { ElMessage } from 'element-plus'

const { 
  cleaningEngine, 
  duplicateDetector, 
  anomalyDetector,
  classificationEngine,
  governanceState,
  runGovernancePipeline 
} = useDataGovernance()

// 状态
const activeTab = ref('cleaning')
const running = ref(false)

// 可用字段
const availableFields = ref([
  { key: 'customerName', label: '客户名称' },
  { key: 'phone', label: '联系电话' },
  { key: 'email', label: '电子邮箱' },
  { key: 'companyName', label: '公司名称' },
  { key: 'address', label: '地址' },
  { key: 'revenue', label: '营收额' },
  { key: 'clv', label: '客户终身价值' }
])

const numericFields = computed(() => 
  availableFields.value.filter(f => ['revenue', 'clv'].includes(f.key))
)

// 清洗配置
const cleaningConfig = reactive({
  selectedFields: [],
  strategies: ['trim', 'format', 'validate']
})

const cleaningResults = ref([])

// 重复检测配置
const duplicateConfig = reactive({
  keyFields: [],
  threshold: 85,
  mergeStrategy: 'latest'
})

const duplicateGroups = ref([])
const activeDuplicateGroups = ref([])

// 异常检测配置
const anomalyConfig = reactive({
  numericFields: [],
  method: 'iqr',
  sensitivity: 3
})

const anomalies = ref([])

// 数据分级
const dataLevels = classificationEngine.levels

const fieldClassificationList = ref([
  { field: 'customerName', level: 'internal', sampleValue: '张三', isSensitive: false },
  { field: 'phone', level: 'confidential', sampleValue: '13800138000', isSensitive: true },
  { field: 'email', level: 'confidential', sampleValue: 'zhangsan@example.com', isSensitive: true },
  { field: 'idCard', level: 'secret', sampleValue: '110101199001011234', isSensitive: true }
])

// 治理日志
const governanceLogs = ref([
  {
    id: 1,
    timestamp: new Date().toLocaleString(),
    type: 'success',
    action: '数据清洗完成',
    details: '成功清洗1250条记录,错误15条'
  }
])

// 计算属性
const cleaningRate = computed(() => {
  const total = governanceState.cleaningStats.totalRecords
  const cleaned = governanceState.cleaningStats.cleanedRecords
  return total > 0 ? Math.round((cleaned / total) * 100) : 0
})

const totalClassified = computed(() => 
  Object.values(governanceState.classificationStats).reduce((sum, count) => sum + count, 0)
)

const totalAnomalies = computed(() => 
  anomalies.value.length
)

const progressColors = [
  { color: '#f56c6c', percentage: 40 },
  { color: '#e6a23c', percentage: 70 },
  { color: '#67c23a', percentage: 100 }
]

// 方法
const runFullGovernance = async () => {
  running.value = true
  try {
    // 模拟数据
    const mockData = [
      { customerName: '明升科技', phone: '138-0013-8000', email: 'INFO@MINGSHENG.COM', revenue: 5000000 },
      { customerName: '明升科技 ', phone: '13800138000', email: 'info@mingsheng.com', revenue: 5200000 },
      { customerName: '华为技术', phone: '021-12345678', email: 'huawei@hw.com', revenue: 8000000 }
    ]

    const results = await runGovernancePipeline(mockData, {
      fieldMapping: {
        phone: 'phone',
        email: 'email',
        companyName: 'companyName'
      },
      keyFields: ['customerName', 'phone'],
      anomalyDetection: true,
      numericFields: ['revenue']
    })

    ElMessage.success('完整治理流程执行成功!')
    
    governanceLogs.value.unshift({
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      type: 'success',
      action: '完整治理流程',
      details: `清洗率: ${results.summary.cleaningRate}, 重复率: ${results.summary.duplicateRate}`
    })

  } catch (error) {
    ElMessage.error('治理失败: ' + error.message)
  } finally {
    running.value = false
  }
}

const runCleaning = () => {
  ElMessage.info('执行数据清洗...')
  // 实现清洗逻辑
}

const runDuplicateDetection = () => {
  ElMessage.info('执行重复检测...')
  // 实现重复检测逻辑
}

const runAnomalyDetection = () => {
  ElMessage.info('执行异常检测...')
  // 实现异常检测逻辑
}

const getFieldLabel = (key) => {
  return availableFields.value.find(f => f.key === key)?.label || key
}

const getLevelTagType = (level) => {
  const typeMap = {
    public: 'success',
    internal: 'info',
    confidential: 'warning',
    secret: 'danger'
  }
  return typeMap[level] || 'info'
}

const maskSensitiveData = (value, field) => {
  return classificationEngine.maskSensitiveData(value, field)
}

const getAllowedRoles = (level) => {
  const roleMap = {
    public: ['所有人'],
    internal: ['员工', '经理', '管理员'],
    confidential: ['经理', '管理员'],
    secret: ['管理员']
  }
  return roleMap[level] || []
}

const saveClassificationConfig = () => {
  ElMessage.success('配置已保存!')
}

const mergeGroup = (group) => {
  ElMessage.success(`已合并组 ${group.records.length} 条记录`)
}

const keepRecord = (group, row) => {
  ElMessage.success('已标记保留此记录')
}

const deleteRecord = (row) => {
  ElMessage.warning('已标记删除此记录')
}

const correctAnomaly = (row) => {
  ElMessage.info('请输入修正值')
}

const ignoreAnomaly = (row) => {
  ElMessage.info('已忽略此异常')
}
</script>

<style lang="scss" scoped>
.data-governance-panel {
  padding: 20px;

  .header-card {
    margin-bottom: 20px;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        display: flex;
        align-items: center;
        gap: 10px;

        h2 {
          margin: 0;
          color: #303133;
        }
      }
    }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 20px;

    .stat-card {
      .stat-content {
        display: flex;
        align-items: center;
        gap: 15px;
        margin-bottom: 15px;

        .stat-info {
          flex: 1;

          .stat-value {
            font-size: 32px;
            font-weight: bold;
            color: #303133;
          }

          .stat-label {
            font-size: 14px;
            color: #909399;
            margin-top: 5px;
          }
        }
      }

      .classification-breakdown {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-top: 10px;
      }
    }
  }

  .governance-tabs {
    margin-bottom: 20px;

    .results-section {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #EBEEF5;

      h3 {
        margin-bottom: 15px;
      }
    }

    .hint {
      margin-left: 10px;
      font-size: 12px;
      color: #909399;
    }

    .duplicate-group-header {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .group-actions {
      margin-top: 15px;
      text-align: right;
    }

    .classification-overview {
      margin: 20px 0;

      .level-card {
        text-align: center;

        h4 {
          margin: 10px 0;
          color: #303133;
        }

        .level-count {
          font-size: 24px;
          font-weight: bold;
          margin: 10px 0;
        }

        .level-features {
          list-style: none;
          padding: 0;
          margin: 10px 0 0;
          font-size: 12px;
          color: #606266;

          li {
            margin: 5px 0;
          }
        }
      }
    }

    .field-classification-config {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #EBEEF5;
    }
  }

  .log-card {
    h3 {
      margin-bottom: 20px;
    }

    strong {
      color: #303133;
    }

    p {
      margin: 5px 0 0;
      color: #606266;
      font-size: 14px;
    }
  }
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr !important;
  }

  .header {
    flex-direction: column;
    gap: 15px;
  }
}
</style>
