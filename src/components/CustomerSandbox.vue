<template>
  <div class="customer-sandbox">
    <div class="sandbox-header">
      <h2>🎯 客户沙盘分析</h2>
      <div class="header-actions">
        <el-button @click="goHome">
          <el-icon><HomeFilled /></el-icon>
          返回主页
        </el-button>
        <el-button @click="$emit('close')">
          <el-icon><Close /></el-icon>
          返回客户360
        </el-button>
      </div>
    </div>

    <!-- 策略设置区 -->
    <el-card class="strategy-settings">
      <template #header>
        <span>⚙️ 策略参数调整</span>
      </template>

      <el-row :gutter="24">
        <el-col :span="12">
          <div class="setting-group">
            <label class="setting-label">价格策略</label>
            <div class="setting-control">
              <el-slider 
                v-model="strategy.price" 
                :min="-30" 
                :max="30" 
                :step="5"
                show-stops
                :format-tooltip="(val) => val > 0 ? `+${val}%` : `${val}%`"
              />
              <span class="setting-value">{{ strategy.price > 0 ? '+' : '' }}{{ strategy.price }}%</span>
            </div>
          </div>

          <div class="setting-group">
            <label class="setting-label">折扣力度</label>
            <div class="setting-control">
              <el-slider 
                v-model="strategy.discount" 
                :min="0" 
                :max="50" 
                :step="5"
                show-stops
                :format-tooltip="(val) => `${val}%`"
              />
              <span class="setting-value">{{ strategy.discount }}% OFF</span>
            </div>
          </div>

          <div class="setting-group">
            <label class="setting-label">营销触达渠道</label>
            <el-checkbox-group v-model="strategy.channels">
              <el-checkbox label="APP推送" />
              <el-checkbox label="邮件" />
              <el-checkbox label="短信" />
              <el-checkbox label="客服跟进" />
            </el-checkbox-group>
          </div>
        </el-col>

        <el-col :span="12">
          <div class="setting-group">
            <label class="setting-label">触达频率</label>
            <el-radio-group v-model="strategy.frequency">
              <el-radio label="low">低频（每月1次）</el-radio>
              <el-radio label="medium">中频（每周1次）</el-radio>
              <el-radio label="high">高频（每日1次）</el-radio>
            </el-radio-group>
          </div>

          <div class="setting-group">
            <label class="setting-label">服务等级</label>
            <el-radio-group v-model="strategy.serviceLevel">
              <el-radio label="standard">标准服务</el-radio>
              <el-radio label="premium">高级服务</el-radio>
              <el-radio label="vip">VIP专属</el-radio>
            </el-radio-group>
          </div>

          <div class="setting-group">
            <label class="setting-label">模拟时间周期</label>
            <el-select v-model="strategy.period" style="width: 100%;">
              <el-option label="短期（1-3个月）" value="short" />
              <el-option label="中期（3-6个月）" value="medium" />
              <el-option label="长期（6-12个月）" value="long" />
            </el-select>
          </div>
        </el-col>
      </el-row>

      <div class="strategy-actions">
        <el-button type="primary" size="large" @click="executeSimulation">
          <el-icon><VideoPlay /></el-icon>
          执行模拟
        </el-button>
        <el-button size="large" @click="saveStrategy">
          <el-icon><DocumentCopy /></el-icon>
          保存策略
        </el-button>
        <el-button size="large" @click="compareStrategies">
          <el-icon><DataAnalysis /></el-icon>
          多策略对比
        </el-button>
      </div>
    </el-card>

    <!-- 客户群选择 -->
    <el-card class="customer-group-selector">
      <template #header>
        <span>👥 客户群选择</span>
      </template>

      <el-radio-group v-model="selectedGroup" class="group-options">
        <el-radio label="current">
          <div class="group-option">
            <div class="group-title">当前客户</div>
            <div class="group-desc">{{ currentCustomer.name }}</div>
          </div>
        </el-radio>
        <el-radio label="highValue">
          <div class="group-option">
            <div class="group-title">高价值群体</div>
            <div class="group-desc">250人 | 平均CLV: ¥9.8万 | 流失率: 12%</div>
          </div>
        </el-radio>
        <el-radio label="churnRisk">
          <div class="group-option">
            <div class="group-title">流失风险群</div>
            <div class="group-desc">120人 | 平均CLV: ¥5.2万 | 流失率: 45%</div>
          </div>
        </el-radio>
        <el-radio label="custom">
          <div class="group-option">
            <div class="group-title">自定义分层</div>
            <div class="group-desc">自由选择客户群体</div>
          </div>
        </el-radio>
      </el-radio-group>
    </el-card>

    <!-- 模拟结果 -->
    <div v-if="simulationResult" class="simulation-results">
      <!-- KPI面板 -->
      <el-row :gutter="16" class="kpi-panels">
        <el-col :span="6">
          <el-card>
            <div class="result-kpi">
              <div class="kpi-label">预测收入</div>
              <div class="kpi-value">¥{{ (simulationResult.revenue / 10000).toFixed(1) }}万</div>
              <div :class="['kpi-change', simulationResult.revenueChange > 0 ? 'positive' : 'negative']">
                {{ simulationResult.revenueChange > 0 ? '+' : '' }}{{ simulationResult.revenueChange }}%
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card>
            <div class="result-kpi">
              <div class="kpi-label">流失率</div>
              <div class="kpi-value">{{ simulationResult.churnRate }}%</div>
              <div :class="['kpi-change', simulationResult.churnRateChange < 0 ? 'positive' : 'negative']">
                {{ simulationResult.churnRateChange > 0 ? '+' : '' }}{{ simulationResult.churnRateChange }}%
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card>
            <div class="result-kpi">
              <div class="kpi-label">ROI</div>
              <div class="kpi-value">{{ simulationResult.roi }}</div>
              <div :class="['kpi-change', simulationResult.roiChange > 0 ? 'positive' : 'negative']">
                {{ simulationResult.roiChange > 0 ? '+' : '' }}{{ simulationResult.roiChange }}
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card>
            <div class="result-kpi">
              <div class="kpi-label">营销成本</div>
              <div class="kpi-value">¥{{ (simulationResult.cost / 10000).toFixed(1) }}万</div>
              <div :class="['kpi-change', simulationResult.costChange < 0 ? 'positive' : 'negative']">
                {{ simulationResult.costChange > 0 ? '+' : '' }}{{ simulationResult.costChange }}%
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- 可视化结果 -->
      <el-row :gutter="16" class="visualization-section">
        <!-- 热力图 -->
        <el-col :span="8">
          <el-card>
            <template #header>
              <span>🔥 客户响应热力图</span>
            </template>
            <div class="heatmap">
              <div 
                v-for="(row, rowIndex) in heatmapData" 
                :key="rowIndex"
                class="heatmap-row"
              >
                <div 
                  v-for="(cell, cellIndex) in row" 
                  :key="cellIndex"
                  class="heatmap-cell"
                  :style="{ background: getHeatColor(cell.value) }"
                  :title="`响应率: ${cell.value}%`"
                >
                  {{ cell.value }}%
                </div>
              </div>
            </div>
            <div class="heatmap-legend">
              <span><span class="legend-color" style="background: #67C23A;"></span>高响应</span>
              <span><span class="legend-color" style="background: #E6A23C;"></span>中响应</span>
              <span><span class="legend-color" style="background: #F56C6C;"></span>低响应</span>
            </div>
          </el-card>
        </el-col>

        <!-- 漏斗图 -->
        <el-col :span="8">
          <el-card>
            <template #header>
              <span>📊 转化路径漏斗</span>
            </template>
            <div class="funnel-chart">
              <div 
                v-for="(stage, index) in funnelData" 
                :key="index"
                class="funnel-stage"
              >
                <div 
                  class="funnel-bar"
                  :style="{ 
                    width: stage.percentage + '%',
                    background: getFunnelColor(index)
                  }"
                >
                  <div class="funnel-label">
                    {{ stage.name }}: {{ stage.count }}人 ({{ stage.percentage }}%)
                  </div>
                </div>
                <div class="funnel-loss" v-if="index < funnelData.length - 1">
                  ↓ 流失 {{ funnelData[index].count - funnelData[index + 1].count }}人
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 敏感性分析 -->
        <el-col :span="8">
          <el-card>
            <template #header>
              <span>📈 敏感性分析</span>
            </template>
            <div class="sensitivity-chart">
              <div 
                v-for="factor in sensitivityData" 
                :key="factor.name"
                class="sensitivity-bar"
              >
                <div class="sensitivity-label">{{ factor.name }}</div>
                <div class="sensitivity-progress">
                  <div 
                    class="sensitivity-fill"
                    :style="{ 
                      width: Math.abs(factor.impact) + '%',
                      background: factor.impact > 0 ? '#67C23A' : '#F56C6C'
                    }"
                  >
                    {{ factor.impact > 0 ? '+' : '' }}{{ factor.impact }}%
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <!-- AI策略建议 -->
      <el-card class="ai-recommendations">
        <template #header>
          <span>🤖 AI策略推荐</span>
        </template>

        <el-alert
          v-for="rec in aiRecommendations"
          :key="rec.id"
          :title="rec.title"
          :type="rec.type"
          :description="rec.description"
          show-icon
          class="recommendation-item"
        >
          <template #default>
            <div class="recommendation-actions">
              <el-button size="small" type="primary" @click="applyRecommendation(rec)">
                应用建议
              </el-button>
              <el-button size="small" @click="saveRecommendation(rec)">
                保存
              </el-button>
            </div>
          </template>
        </el-alert>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  Close, VideoPlay, DocumentCopy, DataAnalysis, HomeFilled
} from '@element-plus/icons-vue'

const router = useRouter()

const props = defineProps({
  customer: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close'])

// 返回主页
const goHome = () => {
  router.push('/')
  ElMessage.success('返回主页')
}

// 当前客户
const currentCustomer = ref(props.customer)

// 策略参数
const strategy = ref({
  price: 0,
  discount: 10,
  channels: ['APP推送', '邮件'],
  frequency: 'medium',
  serviceLevel: 'standard',
  period: 'medium'
})

// 选中的客户群
const selectedGroup = ref('current')

// 模拟结果
const simulationResult = ref(null)

// 热力图数据
const heatmapData = ref([])

// 漏斗数据
const funnelData = ref([])

// 敏感性数据
const sensitivityData = ref([])

// AI推荐
const aiRecommendations = ref([])

// 执行模拟
const executeSimulation = () => {
  ElMessage.info('正在执行模拟分析...')
  
  // 模拟计算（实际应调用后端AI模型）
  setTimeout(() => {
    simulationResult.value = {
      revenue: 150000,
      revenueChange: 15,
      churnRate: 12,
      churnRateChange: -8,
      roi: 2.3,
      roiChange: 0.5,
      cost: 65000,
      costChange: -5
    }
    
    // 热力图数据
    heatmapData.value = [
      [{ value: 85 }, { value: 78 }, { value: 92 }],
      [{ value: 72 }, { value: 88 }, { value: 65 }],
      [{ value: 90 }, { value: 82 }, { value: 75 }]
    ]
    
    // 漏斗数据
    funnelData.value = [
      { name: '触达客户', count: 250, percentage: 100 },
      { name: '打开/查看', count: 200, percentage: 80 },
      { name: '点击/互动', count: 150, percentage: 60 },
      { name: '咨询/询价', count: 100, percentage: 40 },
      { name: '完成购买', count: 60, percentage: 24 }
    ]
    
    // 敏感性分析
    sensitivityData.value = [
      { name: '价格', impact: -12 },
      { name: '折扣', impact: 25 },
      { name: '触达频率', impact: 18 },
      { name: '服务等级', impact: 15 },
      { name: '渠道组合', impact: 20 }
    ]
    
    // AI推荐
    aiRecommendations.value = [
      {
        id: 'r1',
        title: '高价值客户推新品体验',
        description: '针对高价值客户推送新品试用活动，可提升15%转化率，建议配合10%专属折扣',
        type: 'success'
      },
      {
        id: 'r2',
        title: '流失风险客户增加触达',
        description: '对流失风险客户增加触达频率至每周1次，配合专属客服跟进，可降低8%流失率',
        type: 'warning'
      },
      {
        id: 'r3',
        title: '优化营销渠道组合',
        description: 'APP推送+邮件组合效果最佳，建议减少短信渠道，可节省12%营销成本',
        type: 'info'
      }
    ]
    
    ElMessage.success('模拟分析完成')
  }, 1500)
}

// 辅助方法
const getHeatColor = (value) => {
  if (value >= 80) return '#67C23A'
  if (value >= 60) return '#E6A23C'
  return '#F56C6C'
}

const getFunnelColor = (index) => {
  const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399']
  return colors[index] || '#909399'
}

const saveStrategy = () => {
  ElMessage.success('策略已保存')
}

const compareStrategies = () => {
  ElMessage.info('多策略对比功能开发中...')
}

const applyRecommendation = (rec) => {
  ElMessage.success(`正在应用建议：${rec.title}`)
}

const saveRecommendation = (rec) => {
  ElMessage.success('建议已保存')
}
</script>

<style scoped lang="scss">
.customer-sandbox {
  padding: 20px;
}

.sandbox-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  
  h2 {
    margin: 0;
    font-size: 24px;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }
}

.strategy-settings {
  margin-bottom: 20px;
}

.setting-group {
  margin-bottom: 24px;
  
  .setting-label {
    display: block;
    font-weight: bold;
    margin-bottom: 12px;
    font-size: 14px;
  }
  
  .setting-control {
    display: flex;
    align-items: center;
    gap: 16px;
    
    .el-slider {
      flex: 1;
    }
    
    .setting-value {
      min-width: 60px;
      text-align: right;
      font-weight: bold;
      color: #409EFF;
    }
  }
}

.strategy-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #EBEEF5;
}

.customer-group-selector {
  margin-bottom: 20px;
}

.group-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  
  .el-radio {
    width: 100%;
    margin: 0;
    padding: 16px;
    border: 2px solid #DCDFE6;
    border-radius: 8px;
    transition: all 0.3s;
    
    &:hover {
      border-color: #409EFF;
    }
    
    &.is-checked {
      border-color: #409EFF;
      background: #ecf5ff;
    }
  }
  
  .group-option {
    .group-title {
      font-weight: bold;
      margin-bottom: 4px;
    }
    
    .group-desc {
      font-size: 12px;
      color: #909399;
    }
  }
}

.simulation-results {
  margin-top: 20px;
}

.kpi-panels {
  margin-bottom: 20px;
}

.result-kpi {
  text-align: center;
  
  .kpi-label {
    font-size: 14px;
    color: #909399;
    margin-bottom: 8px;
  }
  
  .kpi-value {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 8px;
  }
  
  .kpi-change {
    font-size: 14px;
    font-weight: bold;
    
    &.positive {
      color: #67C23A;
    }
    
    &.negative {
      color: #F56C6C;
    }
  }
}

.visualization-section {
  margin-bottom: 20px;
}

.heatmap {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  
  .heatmap-row {
    display: flex;
    gap: 8px;
    
    .heatmap-cell {
      flex: 1;
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        transform: scale(1.1);
      }
    }
  }
}

.heatmap-legend {
  display: flex;
  justify-content: center;
  gap: 16px;
  font-size: 12px;
  
  .legend-color {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 2px;
    margin-right: 4px;
  }
}

.funnel-chart {
  padding: 20px 0;
  
  .funnel-stage {
    margin-bottom: 16px;
    
    .funnel-bar {
      height: 50px;
      display: flex;
      align-items: center;
      padding: 0 16px;
      border-radius: 8px;
      color: white;
      font-weight: bold;
      margin-bottom: 8px;
      transition: all 0.3s;
      
      .funnel-label {
        font-size: 13px;
      }
    }
    
    .funnel-loss {
      text-align: center;
      font-size: 12px;
      color: #909399;
      margin-bottom: 8px;
    }
  }
}

.sensitivity-chart {
  padding: 10px 0;
  
  .sensitivity-bar {
    margin-bottom: 20px;
    
    .sensitivity-label {
      font-size: 14px;
      margin-bottom: 8px;
      font-weight: bold;
    }
    
    .sensitivity-progress {
      height: 30px;
      background: #F5F7FA;
      border-radius: 4px;
      overflow: hidden;
      position: relative;
      
      .sensitivity-fill {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
        transition: all 0.3s;
      }
    }
  }
}

.ai-recommendations {
  .recommendation-item {
    margin-bottom: 16px;
    
    .recommendation-actions {
      margin-top: 12px;
      display: flex;
      gap: 8px;
    }
  }
}
</style>
