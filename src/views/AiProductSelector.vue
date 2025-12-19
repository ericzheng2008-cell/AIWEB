<template>
  <div class="ai-product-selector">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">
          <el-icon><MagicStick /></el-icon>
          {{ $t('aiSelector.title') }}
        </h1>
        <p class="page-desc">{{ $t('aiSelector.description') }}</p>
      </div>
    </div>

    <!-- 步骤条 -->
    <div class="steps-container">
      <el-steps :active="currentStep" align-center finish-status="success">
        <el-step title="选择产品大类" icon="Box" />
        <el-step title="基本要求与参数" icon="Edit" />
        <el-step title="AI智能推荐" icon="Check" />
        <el-step title="产品对比" icon="DataAnalysis" />
      </el-steps>
    </div>

    <!-- 内容区域 -->
    <div class="selector-content">
      <!-- Step 1: 产品大类选择 -->
      <div v-show="currentStep === 0" class="step-panel">
        <h2 class="step-title">请选择产品大类</h2>
        <el-row :gutter="20" class="industry-grid">
          <el-col 
            :xs="12" :sm="8" :md="6" :lg="4"
            v-for="category in productCategories" 
            :key="category.id"
          >
            <div 
              class="industry-card"
              :class="{ active: selectedCategory === category.id }"
              @click="selectCategory(category.id)"
            >
              <el-icon class="industry-icon" :size="40">
                <component :is="category.icon" />
              </el-icon>
              <div class="industry-name">{{ category.name[$i18n.locale] }}</div>
            </div>
          </el-col>
        </el-row>
        <div class="step-actions">
          <el-button type="primary" size="large" :disabled="!selectedCategory" @click="nextStep">
            {{ $t('common.next') }}
            <el-icon class="el-icon--right"><ArrowRight /></el-icon>
          </el-button>
        </div>
      </div>

      <!-- Step 2: 需求采集 -->
      <div v-show="currentStep === 1" class="step-panel">
        <h2 class="step-title">输入基本要求与参数</h2>
        
        <!-- 动态显示当前产品大类的参数配置 -->
        <el-alert 
          :title="`当前选择: ${selectedCategoryName}`" 
          type="info" 
          :closable="false"
          style="margin-bottom: 20px"
        />
        
        <el-form :model="requirements" label-position="top" class="requirements-form">
          <el-row :gutter="20">
            <!-- 动态参数字段 - 根据后台配置生成 -->
            <el-col :xs="24" :sm="12" v-for="param in currentCategoryParams" :key="param.id">
              <el-form-item :label="param.label">
                <!-- 输入框类型 -->
                <el-input 
                  v-if="param.type === 'input'"
                  v-model="requirements.params[param.key]"
                  :placeholder="param.placeholder"
                  @change="analyzeRequirements"
                />
                
                <!-- 数字输入 -->
                <el-input-number
                  v-else-if="param.type === 'number'"
                  v-model="requirements.params[param.key]"
                  :min="param.min"
                  :max="param.max"
                  :step="param.step"
                  style="width: 100%"
                  @change="analyzeRequirements"
                />
                
                <!-- 下拉选择 -->
                <el-select
                  v-else-if="param.type === 'select'"
                  v-model="requirements.params[param.key]"
                  :placeholder="param.placeholder"
                  @change="analyzeRequirements"
                >
                  <el-option 
                    v-for="option in param.options" 
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  />
                </el-select>
                
                <!-- 范围滑块 -->
                <div v-else-if="param.type === 'range'">
                  <el-slider 
                    v-model="requirements.params[param.key]" 
                    range 
                    :min="param.min" 
                    :max="param.max"
                    :marks="param.marks"
                    @change="analyzeRequirements"
                  />
                  <div class="range-display">
                    {{ requirements.params[param.key]?.[0] || param.min }} - {{ requirements.params[param.key]?.[1] || param.max }} {{ param.unit }}
                  </div>
                </div>
                
                <!-- 多选框 -->
                <el-checkbox-group
                  v-else-if="param.type === 'checkbox'"
                  v-model="requirements.params[param.key]"
                  @change="analyzeRequirements"
                >
                  <el-checkbox 
                    v-for="option in param.options" 
                    :key="option.value"
                    :label="option.value"
                  >
                    {{ option.label }}
                  </el-checkbox>
                </el-checkbox-group>
                
                <!-- 单选按钮 -->
                <el-radio-group
                  v-else-if="param.type === 'radio'"
                  v-model="requirements.params[param.key]"
                  @change="analyzeRequirements"
                >
                  <el-radio-button 
                    v-for="option in param.options" 
                    :key="option.value"
                    :label="option.value"
                  >
                    {{ option.label }}
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <!-- 预算 - 通用字段 -->
            <el-col :xs="24" :sm="12">
              <el-form-item label="预算范围(元)">
                <el-input-number 
                  v-model="requirements.budget" 
                  :min="0" 
                  :step="1000"
                  placeholder="请输入预算"
                  style="width: 100%"
                  @change="analyzeRequirements"
                />
              </el-form-item>
            </el-col>

            <!-- 特殊需求 - 通用字段 -->
            <el-col :xs="24">
              <el-form-item label="特殊要求">
                <el-input 
                  v-model="requirements.specialNotes"
                  type="textarea"
                  :rows="3"
                  placeholder="请描述其他特殊要求..."
                  @blur="analyzeRequirements"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <!-- AI分析进度 -->
        <div v-if="analyzing" class="ai-analyzing">
          <el-icon class="is-loading"><Loading /></el-icon>
          <span>{{ $t('aiSelector.analyzing') }}</span>
        </div>

        <div class="step-actions">
          <el-button @click="prevStep">
            <el-icon class="el-icon--left"><ArrowLeft /></el-icon>
            {{ $t('common.previous') }}
          </el-button>
          <el-button type="primary" size="large" :disabled="!requirementsComplete" @click="nextStep">
            {{ $t('common.next') }}
            <el-icon class="el-icon--right"><ArrowRight /></el-icon>
          </el-button>
        </div>
      </div>

      <!-- Step 3: AI推荐结果 -->
      <div v-show="currentStep === 2" class="step-panel">
        <h2 class="step-title">{{ $t('aiSelector.recommendationTitle') }}</h2>
        
        <div class="recommendation-summary">
          <el-alert 
            :title="$t('aiSelector.aiAnalysisComplete')" 
            type="success"
            :closable="false"
          >
            <template #default>
              <div class="analysis-result">
                <p><strong>{{ $t('aiSelector.matchScore') }}:</strong> {{ analysisResult.matchScore }}%</p>
                <p><strong>{{ $t('aiSelector.recommendedProducts') }}:</strong> {{ recommendedProducts.length }} {{ $t('aiSelector.products') }}</p>
              </div>
            </template>
          </el-alert>
        </div>

        <el-row :gutter="20" class="products-grid">
          <el-col 
            :xs="24" :sm="12" :lg="8"
            v-for="(product, index) in recommendedProducts" 
            :key="product.id"
          >
            <div class="product-recommendation-card">
              <div class="product-badge" v-if="index === 0">
                <el-tag type="danger" effect="dark">{{ $t('aiSelector.bestMatch') }}</el-tag>
              </div>
              <div class="product-image">
                <img :src="product.image" :alt="product.name[$i18n.locale]" />
              </div>
              <div class="product-info">
                <h3 class="product-name">{{ product.name[$i18n.locale] }}</h3>
                <div class="match-score">
                  <span>{{ $t('aiSelector.matchDegree') }}: </span>
                  <el-progress 
                    :percentage="product.matchScore" 
                    :color="product.matchScore >= 90 ? '#67C23A' : product.matchScore >= 70 ? '#E6A23C' : '#909399'"
                  />
                </div>
                <div class="product-specs">
                  <div class="spec-item">
                    <el-icon><Tools /></el-icon>
                    <span>{{ product.torqueRange }}</span>
                  </div>
                  <div class="spec-item">
                    <el-icon><Lightning /></el-icon>
                    <span>{{ product.powerType }}</span>
                  </div>
                  <div class="spec-item">
                    <el-icon><PriceTag /></el-icon>
                    <span>¥{{ product.price?.toLocaleString() || $t('common.contactUs') }}</span>
                  </div>
                </div>
                <div class="product-highlights">
                  <el-tag 
                    v-for="highlight in product.highlights" 
                    :key="highlight"
                    size="small"
                    type="info"
                  >
                    {{ highlight }}
                  </el-tag>
                </div>
                <div class="product-actions">
                  <el-checkbox 
                    v-model="product.selected"
                    @change="updateComparison"
                  >
                    {{ $t('aiSelector.addToCompare') }}
                  </el-checkbox>
                  <el-button type="primary" text @click="viewProductDetail(product)">
                    {{ $t('common.viewDetails') }}
                  </el-button>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>

        <div class="step-actions">
          <el-button @click="prevStep">
            <el-icon class="el-icon--left"><ArrowLeft /></el-icon>
            {{ $t('common.previous') }}
          </el-button>
          <el-button type="primary" size="large" :disabled="selectedProducts.length < 2" @click="nextStep">
            {{ $t('aiSelector.compareSelected') }} ({{ selectedProducts.length }})
            <el-icon class="el-icon--right"><ArrowRight /></el-icon>
          </el-button>
        </div>
      </div>

      <!-- Step 4: 产品对比 -->
      <div v-show="currentStep === 3" class="step-panel">
        <h2 class="step-title">{{ $t('aiSelector.comparisonTitle') }}</h2>
        
        <div class="comparison-table-wrapper">
          <el-table :data="comparisonData" border stripe>
            <el-table-column :label="$t('aiSelector.parameter')" prop="parameter" fixed width="180" />
            <el-table-column 
              v-for="product in selectedProducts" 
              :key="product.id"
              :label="product.name[$i18n.locale]"
              align="center"
            >
              <template #default="{ row }">
                <div class="comparison-cell">
                  <span v-if="row.type === 'text'">{{ product[row.key] }}</span>
                  <el-tag v-else-if="row.type === 'tag'" :type="getTagType(product[row.key])">
                    {{ product[row.key] }}
                  </el-tag>
                  <el-rate 
                    v-else-if="row.type === 'rate'" 
                    v-model="product[row.key]" 
                    disabled 
                    show-score 
                    text-color="#ff9900"
                  />
                  <span v-else>{{ product[row.key] }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- AI推荐决策 -->
        <div class="ai-recommendation-decision">
          <el-card shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><MagicStick /></el-icon>
                <span>{{ $t('aiSelector.aiRecommendation') }}</span>
              </div>
            </template>
            <div class="decision-content">
              <p class="decision-text">{{ analysisResult.recommendation[$i18n.locale] }}</p>
              <div class="decision-reasons">
                <h4>{{ $t('aiSelector.reasons') }}:</h4>
                <ul>
                  <li v-for="reason in analysisResult.reasons[$i18n.locale]" :key="reason">{{ reason }}</li>
                </ul>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 操作按钮 -->
        <div class="step-actions">
          <el-button @click="prevStep">
            <el-icon class="el-icon--left"><ArrowLeft /></el-icon>
            {{ $t('common.previous') }}
          </el-button>
          <el-button type="success" @click="downloadQuotation">
            <el-icon><Download /></el-icon>
            {{ $t('aiSelector.downloadPDF') }}
          </el-button>
          <el-button type="primary" @click="showInquiryForm">
            <el-icon><Message /></el-icon>
            {{ $t('aiSelector.requestQuote') }}
          </el-button>
          <el-button @click="resetSelector">
            <el-icon><RefreshLeft /></el-icon>
            {{ $t('aiSelector.startOver') }}
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useProductsServicesStore } from '../store/productsServices'
import { ElMessage } from 'element-plus'
import {
  MagicStick, Box, Edit, Check, DataAnalysis,
  ArrowRight, ArrowLeft, Tools, Lightning, PriceTag,
  Loading, Download, Message, RefreshLeft, Cpu, Setting,
  Van, DishDot, MagicStick as Robot, Grid, Monitor
} from '@element-plus/icons-vue'

const { t, locale } = useI18n()
const productsStore = useProductsServicesStore()

// 当前步骤
const currentStep = ref(0)

// 产品大类列表
const productCategories = ref([
  { 
    id: 'battery_tools', 
    name: { 'zh-CN': '电池拧紧工具', 'en-US': 'Battery Tightening Tools' }, 
    icon: 'Tools' 
  },
  { 
    id: 'welding', 
    name: { 'zh-CN': '焊接设备', 'en-US': 'Welding Equipment' }, 
    icon: 'Lightning' 
  },
  { 
    id: 'cobot', 
    name: { 'zh-CN': '协作机器人', 'en-US': 'Collaborative Robots' }, 
    icon: 'Robot' 
  },
  { 
    id: 'agv', 
    name: { 'zh-CN': 'AGV', 'en-US': 'AGV' }, 
    icon: 'Van' 
  },
  { 
    id: 'gluing', 
    name: { 'zh-CN': '自动涂胶', 'en-US': 'Auto Gluing' }, 
    icon: 'DishDot' 
  },
  { 
    id: 'rail_system', 
    name: { 'zh-CN': '铝合金轨道', 'en-US': 'Aluminum Rail System' }, 
    icon: 'Grid' 
  },
  { 
    id: 'sockets', 
    name: { 'zh-CN': '套筒', 'en-US': 'Sockets' }, 
    icon: 'Setting' 
  },
  { 
    id: 'six_axis_robot', 
    name: { 'zh-CN': '六轴机器人', 'en-US': '6-Axis Robot' }, 
    icon: 'Cpu' 
  },
  { 
    id: 'custom_solution', 
    name: { 'zh-CN': '定制非标工作', 'en-US': 'Custom Solutions' }, 
    icon: 'MagicStick' 
  },
  { 
    id: 'station_upgrade', 
    name: { 'zh-CN': '工位改造升级', 'en-US': 'Station Upgrade' }, 
    icon: 'Monitor' 
  },
  { 
    id: 'refurbishment', 
    name: { 'zh-CN': '利旧翻新', 'en-US': 'Refurbishment' }, 
    icon: 'RefreshLeft' 
  }
])

const selectedCategory = ref(null)

// 产品大类对应的参数配置(后台可编辑)
const categoryParamsConfig = ref({
  battery_tools: [
    {
      id: 'torque_range',
      key: 'torque_range',
      label: '扭矩范围(Nm)',
      type: 'range',
      min: 1,
      max: 500,
      marks: { 1: '1Nm', 100: '100Nm', 250: '250Nm', 500: '500Nm' },
      unit: 'Nm'
    },
    {
      id: 'tool_type',
      key: 'tool_type',
      label: '工具类型',
      type: 'select',
      placeholder: '请选择工具类型',
      options: [
        { label: '电池油压脉冲定扭扳手', value: 'hydraulic_pulse' },
        { label: '电池油压脉冲传感器定扭扳手', value: 'hydraulic_pulse_sensor' },
        { label: '电池离合器定扭扳手', value: 'clutch' },
        { label: '电池直驱定扭扳手', value: 'direct_drive' }
      ]
    },
    {
      id: 'precision',
      key: 'precision',
      label: '精度要求',
      type: 'radio',
      options: [
        { label: '±3%', value: '3' },
        { label: '±5%', value: '5' },
        { label: '±10%', value: '10' }
      ]
    },
    {
      id: 'data_collection',
      key: 'data_collection',
      label: '是否需要数据采集',
      type: 'radio',
      options: [
        { label: '需要', value: 'yes' },
        { label: '不需要', value: 'no' }
      ]
    }
  ],
  welding: [
    {
      id: 'welding_type',
      key: 'welding_type',
      label: '焊接类型',
      type: 'checkbox',
      options: [
        { label: '激光焊', value: 'laser' },
        { label: '电阻焊', value: 'resistance' },
        { label: 'MIG/MAG焊', value: 'mig' },
        { label: 'TIG焊', value: 'tig' }
      ]
    },
    {
      id: 'power_range',
      key: 'power_range',
      label: '功率范围(kW)',
      type: 'range',
      min: 1,
      max: 100,
      unit: 'kW'
    }
  ],
  // 其他大类的参数配置可以在后台添加
  default: [
    {
      id: 'capacity',
      key: 'capacity',
      label: '产能要求',
      type: 'input',
      placeholder: '请输入产能要求'
    },
    {
      id: 'space',
      key: 'space',
      label: '占地面积(m²)',
      type: 'number',
      min: 1,
      max: 1000,
      step: 1
    }
  ]
})

// 需求数据
const requirements = ref({
  params: {},
  budget: null,
  specialNotes: ''
})

const analyzing = ref(false)
const analysisResult = ref({
  matchScore: 95,
  recommendation: {
    'zh-CN': '基于您的需求，我们推荐电动拧紧工具系列。该系列产品扭矩范围覆盖全面，精度高，适合汽车制造行业的日常使用。',
    'en-US': 'Based on your requirements, we recommend the electric tightening tool series. This series offers comprehensive torque range coverage, high precision, and is suitable for daily use in automotive manufacturing.'
  },
  reasons: {
    'zh-CN': [
      '扭矩范围完全匹配您的需求（10-100Nm）',
      '电动工具适合日常高频使用',
      '精度±5%满足汽车制造标准',
      '性价比最优，投资回报周期短'
    ],
    'en-US': [
      'Torque range fully matches your requirements (10-100Nm)',
      'Electric tools suitable for daily high-frequency use',
      'Precision ±5% meets automotive manufacturing standards',
      'Best cost-performance ratio with short ROI period'
    ]
  }
})

// 推荐产品列表
const recommendedProducts = ref([])

// 对比数据
const comparisonData = ref([
  { parameter: t('aiSelector.torqueRange'), key: 'torqueRange', type: 'text' },
  { parameter: t('aiSelector.powerType'), key: 'powerType', type: 'tag' },
  { parameter: t('aiSelector.precision'), key: 'precision', type: 'text' },
  { parameter: t('aiSelector.weight'), key: 'weight', type: 'text' },
  { parameter: t('aiSelector.price'), key: 'priceDisplay', type: 'text' },
  { parameter: t('aiSelector.rating'), key: 'rating', type: 'rate' }
])

// 计算属性
const selectedCategoryName = computed(() => {
  const category = productCategories.value.find(c => c.id === selectedCategory.value)
  return category ? category.name[locale.value] : ''
})

const currentCategoryParams = computed(() => {
  if (!selectedCategory.value) return []
  return categoryParamsConfig.value[selectedCategory.value] || categoryParamsConfig.value.default
})

const requirementsComplete = computed(() => {
  return Object.keys(requirements.value.params).length > 0
})

const selectedProducts = computed(() => {
  return recommendedProducts.value.filter(p => p.selected)
})

// 方法
function selectCategory(id) {
  selectedCategory.value = id
  // 初始化该大类的参数对象
  requirements.value.params = {}
  const params = categoryParamsConfig.value[id] || categoryParamsConfig.value.default
  params.forEach(param => {
    if (param.type === 'range') {
      requirements.value.params[param.key] = [param.min, param.max]
    } else if (param.type === 'checkbox') {
      requirements.value.params[param.key] = []
    } else {
      requirements.value.params[param.key] = null
    }
  })
}

function nextStep() {
  if (currentStep.value === 1) {
    generateRecommendations()
  }
  currentStep.value++
}

function prevStep() {
  currentStep.value--
}

async function analyzeRequirements() {
  analyzing.value = true
  // 模拟AI分析
  await new Promise(resolve => setTimeout(resolve, 1000))
  analyzing.value = false
}

function generateRecommendations() {
  // 模拟AI推荐算法
  const mockProducts = [
    {
      id: 1,
      name: { 'zh-CN': 'Bosch 电动拧紧工具 ETP-100', 'en-US': 'Bosch Electric Tightening Tool ETP-100' },
      image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400',
      torqueRange: '10-100Nm',
      powerType: t('aiSelector.electric'),
      precision: '±3%',
      weight: '1.2kg',
      price: 8900,
      priceDisplay: '¥8,900',
      rating: 5,
      matchScore: 98,
      highlights: [t('aiSelector.highPrecision'), t('aiSelector.lightweight'), t('aiSelector.dataLogging')],
      selected: false
    },
    {
      id: 2,
      name: { 'zh-CN': 'Atlas Copco 电动工具 AT-150', 'en-US': 'Atlas Copco Electric Tool AT-150' },
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
      torqueRange: '20-150Nm',
      powerType: t('aiSelector.electric'),
      precision: '±5%',
      weight: '1.5kg',
      price: 12500,
      priceDisplay: '¥12,500',
      rating: 4.5,
      matchScore: 92,
      highlights: [t('aiSelector.durable'), t('aiSelector.ergonomic'), t('aiSelector.certified')],
      selected: false
    },
    {
      id: 3,
      name: { 'zh-CN': 'EQTCF 智能拧紧工具 ST-200', 'en-US': 'EQTCF Smart Tightening Tool ST-200' },
      image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400',
      torqueRange: '5-200Nm',
      powerType: t('aiSelector.battery'),
      precision: '±5%',
      weight: '1.8kg',
      price: 15800,
      priceDisplay: '¥15,800',
      rating: 4,
      matchScore: 85,
      highlights: [t('aiSelector.wireless'), t('aiSelector.iot'), t('aiSelector.longBattery')],
      selected: false
    }
  ]

  recommendedProducts.value = mockProducts
}

function updateComparison() {
  // 更新对比表
}

function viewProductDetail(product) {
  ElMessage.info(t('aiSelector.viewingProduct') + ': ' + product.name[locale.value])
}

function getTagType(value) {
  if (value === t('aiSelector.electric')) return 'primary'
  if (value === t('aiSelector.battery')) return 'success'
  return 'info'
}

function downloadQuotation() {
  ElMessage.success(t('aiSelector.downloadingQuote'))
  // TODO: 实现PDF生成
}

function showInquiryForm() {
  ElMessage.info(t('aiSelector.openingInquiry'))
  // TODO: 打开询盘表单
}

function resetSelector() {
  currentStep.value = 0
  selectedCategory.value = null
  requirements.value = {
    params: {},
    budget: null,
    specialNotes: ''
  }
  recommendedProducts.value = []
}

onMounted(() => {
  // 初始化
})
</script>

<style scoped>
.ai-product-selector {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.page-header {
  background: white;
  border-radius: 12px;
  padding: 40px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.header-content {
  text-align: center;
}

.page-title {
  font-size: 32px;
  color: #333;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.page-desc {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.steps-container {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.selector-content {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  min-height: 500px;
}

.step-panel {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.step-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.industry-grid {
  margin-bottom: 30px;
}

.industry-card {
  background: #f8f9fa;
  border: 2px solid transparent;
  border-radius: 12px;
  padding: 30px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.industry-card:hover {
  border-color: #667eea;
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.2);
}

.industry-card.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
}

.industry-icon {
  margin-bottom: 10px;
}

.industry-name {
  font-size: 14px;
  font-weight: 500;
}

.requirements-form {
  margin-bottom: 30px;
}

.range-display {
  text-align: center;
  font-size: 16px;
  font-weight: 500;
  color: #667eea;
  margin-top: 10px;
}

.ai-analyzing {
  text-align: center;
  padding: 20px;
  color: #667eea;
  font-size: 16px;
}

.ai-analyzing .el-icon {
  font-size: 24px;
  margin-right: 10px;
}

.step-actions {
  text-align: center;
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #eee;
}

.recommendation-summary {
  margin-bottom: 30px;
}

.analysis-result {
  font-size: 14px;
}

.products-grid {
  margin-bottom: 30px;
}

.product-recommendation-card {
  background: white;
  border: 1px solid #eee;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
  position: relative;
  height: 100%;
}

.product-recommendation-card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  transform: translateY(-5px);
}

.product-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}

.product-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 20px;
}

.product-name {
  font-size: 18px;
  color: #333;
  margin: 0 0 15px 0;
}

.match-score {
  margin-bottom: 15px;
}

.product-specs {
  margin-bottom: 15px;
}

.spec-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.product-highlights {
  margin-bottom: 15px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.product-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comparison-table-wrapper {
  margin-bottom: 30px;
  overflow-x: auto;
}

.comparison-cell {
  padding: 8px;
}

.ai-recommendation-decision {
  margin-bottom: 30px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 500;
}

.decision-content {
  font-size: 14px;
  line-height: 1.6;
}

.decision-text {
  margin-bottom: 15px;
  font-size: 16px;
  color: #333;
}

.decision-reasons h4 {
  margin-bottom: 10px;
  color: #667eea;
}

.decision-reasons ul {
  padding-left: 20px;
}

.decision-reasons li {
  margin-bottom: 8px;
}

@media (max-width: 768px) {
  .page-header {
    padding: 20px;
  }

  .page-title {
    font-size: 24px;
  }

  .selector-content {
    padding: 20px;
  }

  .industry-card {
    height: 120px;
    padding: 20px 10px;
  }
}
</style>
