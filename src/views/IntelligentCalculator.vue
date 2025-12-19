<template>
  <div class="intelligent-calculator">
    <Header />
    
    <div class="page-container">
      <!-- 标题区 -->
      <div class="page-header">
        <div class="header-content">
          <div class="icon-wrapper">
            <el-icon :size="60" color="#1890ff"><Calculator /></el-icon>
          </div>
          <div>
            <h1>智能算账与年包推荐系统</h1>
            <p class="tagline">30秒现场算清账，3分钟锁定客户决策</p>
            <el-tag type="success" effect="dark">ROI 132-175%</el-tag>
            <el-tag type="warning" effect="dark">投资回收期 5-6个月</el-tag>
            <el-tag type="danger" effect="dark">续签率 90%+</el-tag>
          </div>
        </div>
      </div>

      <!-- Tab切换 -->
      <el-tabs v-model="activeTab" class="calculator-tabs">
        <!-- Tab 1: 必中算账法 -->
        <el-tab-pane label="📊 必中算账法" name="calculator">
          <div class="calculator-section">
            <el-row :gutter="30">
              <!-- 左侧：客户输入 -->
              <el-col :span="10">
                <el-card shadow="hover" class="input-card">
                  <template #header>
                    <div class="card-header">
                      <el-icon><Edit /></el-icon>
                      <span>客户现状输入</span>
                    </div>
                  </template>
                  
                  <el-form :model="customerInput" label-width="140px" size="large">
                    <el-form-item label="工具数量">
                      <el-input-number 
                        v-model="customerInput.toolCount" 
                        :min="10" 
                        :max="1000"
                        :step="10"
                        controls-position="right" />
                      <span class="unit">把</span>
                    </el-form-item>
                    
                    <el-form-item label="单价">
                      <el-input-number 
                        v-model="customerInput.toolUnitPrice" 
                        :min="1000" 
                        :max="100000"
                        :step="1000"
                        controls-position="right" />
                      <span class="unit">元</span>
                    </el-form-item>
                    
                    <el-form-item label="当前使用寿命">
                      <el-input-number 
                        v-model="customerInput.currentLifespan" 
                        :min="1" 
                        :max="10"
                        :step="1"
                        controls-position="right" />
                      <span class="unit">年</span>
                    </el-form-item>

                    <el-divider />
                    
                    <el-form-item label="产线关键度">
                      <el-rate 
                        v-model="customerInput.criticality" 
                        :max="10"
                        show-score
                        score-template="{value} 分" />
                    </el-form-item>

                    <el-form-item label="故障频率">
                      <el-select v-model="customerInput.faultFrequency">
                        <el-option label="低（每月<3次）" value="low" />
                        <el-option label="中（每月3-8次）" value="medium" />
                        <el-option label="高（每月>8次）" value="high" />
                      </el-select>
                    </el-form-item>
                    
                    <el-button 
                      type="primary" 
                      size="large" 
                      @click="calculateNow"
                      :loading="calculating"
                      style="width: 100%; margin-top: 20px;">
                      <el-icon><TrendCharts /></el-icon>
                      立即算账
                    </el-button>
                  </el-form>
                </el-card>
              </el-col>

              <!-- 右侧：算账结果 -->
              <el-col :span="14">
                <el-card shadow="hover" class="result-card" v-if="calculationResult">
                  <template #header>
                    <div class="card-header">
                      <el-icon color="#52c41a"><PieChart /></el-icon>
                      <span>算账结果 - 一目了然</span>
                    </div>
                  </template>

                  <!-- 核心数据对比 -->
                  <div class="comparison-section">
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <div class="cost-box traditional">
                          <div class="box-header">
                            <el-icon><WarningFilled /></el-icon>
                            <h3>传统模式</h3>
                          </div>
                          <div class="box-body">
                            <div class="big-number">
                              {{ (calculationResult.传统模式年成本 / 10000).toFixed(1) }}
                              <span class="unit">万/年</span>
                            </div>
                            <div class="breakdown">
                              <div class="item">
                                <span>年换新成本</span>
                                <strong>{{ (calculationResult.detailedComparison.traditional.年换新成本 / 10000).toFixed(1) }}万</strong>
                              </div>
                              <div class="item">
                                <span>备件成本</span>
                                <strong>{{ (calculationResult.detailedComparison.traditional.备件成本 / 10000).toFixed(1) }}万</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </el-col>
                      
                      <el-col :span="12">
                        <div class="cost-box our-model">
                          <div class="box-header">
                            <el-icon><CircleCheckFilled /></el-icon>
                            <h3>明升年包模式</h3>
                          </div>
                          <div class="box-body">
                            <div class="big-number">
                              {{ (calculationResult.年包模式年成本 / 10000).toFixed(1) }}
                              <span class="unit">万/年</span>
                            </div>
                            <div class="breakdown">
                              <div class="item">
                                <span>年换新成本</span>
                                <strong>{{ (calculationResult.detailedComparison.ourModel.年换新成本 / 10000).toFixed(1) }}万</strong>
                              </div>
                              <div class="item">
                                <span>年包费用</span>
                                <strong>{{ (calculationResult.detailedComparison.ourModel.年包费用 / 10000).toFixed(1) }}万</strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </el-col>
                    </el-row>
                  </div>

                  <!-- 直接节省 -->
                  <el-alert 
                    type="success" 
                    :closable="false"
                    class="savings-alert">
                    <template #title>
                      <div class="savings-content">
                        <el-icon :size="32"><Trophy /></el-icon>
                        <div>
                          <h2>每年直接节省现金</h2>
                          <div class="savings-number">
                            {{ (calculationResult.直接节省现金 / 10000).toFixed(1) }} 万元
                            <el-tag type="success" size="large">{{ calculationResult.节省率 }}</el-tag>
                          </div>
                        </div>
                      </div>
                    </template>
                  </el-alert>

                  <!-- 额外收益 -->
                  <div class="extra-benefits">
                    <h3><el-icon><StarFilled /></el-icon> 额外收益（未计入上述节省）</h3>
                    <el-row :gutter="15">
                      <el-col :span="8">
                        <div class="benefit-item">
                          <el-icon color="#ff4d4f"><Close /></el-icon>
                          <span>停线规避</span>
                          <strong>{{ calculationResult.额外收益.停线规避价值 }}</strong>
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="benefit-item">
                          <el-icon color="#52c41a"><User /></el-icon>
                          <span>人工节省</span>
                          <strong>{{ calculationResult.额外收益.人工节省 }}</strong>
                        </div>
                      </el-col>
                      <el-col :span="8">
                        <div class="benefit-item">
                          <el-icon color="#1890ff"><Box /></el-icon>
                          <span>库存释放</span>
                          <strong>{{ calculationResult.额外收益.库存释放 }}</strong>
                        </div>
                      </el-col>
                    </el-row>
                  </div>

                  <!-- 销售话术 -->
                  <el-collapse v-model="activeCollapse" class="pitch-collapse">
                    <el-collapse-item name="pitch">
                      <template #title>
                        <el-icon color="#722ed1"><ChatDotRound /></el-icon>
                        <strong style="margin-left: 8px;">现场演示话术（可复制）</strong>
                      </template>
                      <pre class="pitch-content">{{ calculationResult.salesPitch }}</pre>
                      <el-button 
                        type="primary" 
                        text 
                        @click="copyToClipboard(calculationResult.salesPitch)">
                        <el-icon><DocumentCopy /></el-icon>
                        复制话术
                      </el-button>
                    </el-collapse-item>
                  </el-collapse>
                </el-card>

                <!-- 未计算时的提示 -->
                <el-empty 
                  v-else
                  description="请在左侧输入客户数据，立即算账"
                  :image-size="200">
                  <el-icon :size="100" color="#d9d9d9"><TrendCharts /></el-icon>
                </el-empty>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>

        <!-- Tab 2: 年包产品推荐 -->
        <el-tab-pane label="🎯 年包智能推荐" name="recommendation">
          <div class="recommendation-section">
            <el-row :gutter="30">
              <!-- 客户画像输入 -->
              <el-col :span="8">
                <el-card shadow="hover">
                  <template #header>
                    <div class="card-header">
                      <el-icon><User /></el-icon>
                      <span>客户画像</span>
                    </div>
                  </template>
                  
                  <el-form :model="customerProfile" label-width="100px">
                    <el-form-item label="预算水平">
                      <el-radio-group v-model="customerProfile.budgetLevel">
                        <el-radio label="tight">紧张</el-radio>
                        <el-radio label="normal">正常</el-radio>
                        <el-radio label="ample">充裕</el-radio>
                      </el-radio-group>
                    </el-form-item>

                    <el-form-item label="产线重要性">
                      <el-slider 
                        v-model="customerProfile.productionCriticality" 
                        :min="1" 
                        :max="10"
                        :marks="{1: '普通', 5: '重要', 10: '关键'}"
                        show-stops />
                    </el-form-item>

                    <el-form-item label="工具数量">
                      <el-input-number 
                        v-model="customerProfile.toolCount" 
                        :min="10"
                        controls-position="right" />
                    </el-form-item>

                    <el-form-item label="当前痛点">
                      <el-checkbox-group v-model="customerProfile.currentPainPoints">
                        <el-checkbox label="frequent-downtime">频繁停线</el-checkbox>
                        <el-checkbox label="high-repair-cost">维修成本高</el-checkbox>
                        <el-checkbox label="uncertain-budget">预算不可控</el-checkbox>
                        <el-checkbox label="inventory-pressure">库存压力大</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>

                    <el-button 
                      type="primary" 
                      @click="getRecommendation"
                      :loading="recommending"
                      style="width: 100%;">
                      <el-icon><MagicStick /></el-icon>
                      智能推荐
                    </el-button>
                  </el-form>
                </el-card>
              </el-col>

              <!-- 推荐结果 -->
              <el-col :span="16">
                <div v-if="recommendation">
                  <!-- 推荐产品 -->
                  <el-card shadow="hover" class="recommended-product">
                    <div class="product-badge">
                      <el-icon><Medal /></el-icon>
                      <span>智能推荐</span>
                    </div>
                    <div class="product-content">
                      <h2>{{ recommendation.recommended.name }}</h2>
                      <p class="product-tagline">{{ recommendation.recommended.tagline }}</p>
                      
                      <div class="product-pricing">
                        <div class="price-main">
                          <span class="price-label">年包费用</span>
                          <div class="price-value">
                            {{ (recommendation.recommended.pricing.annualFee / 10000).toFixed(1) }}
                            <span class="unit">万/年</span>
                          </div>
                          <span class="price-desc">
                            （资产价值的 {{ (recommendation.recommended.pricing.rateOfAssetValue * 100).toFixed(0) }}%）
                          </span>
                        </div>
                        <div class="price-roi">
                          <el-tag type="success" size="large" effect="dark">
                            预期ROI: {{ recommendation.recommended.expectedROI }}
                          </el-tag>
                        </div>
                      </div>

                      <div class="product-services">
                        <h4><el-icon><List /></el-icon> 服务内容</h4>
                        <ul>
                          <li v-for="service in recommendation.recommended.services" :key="service">
                            <el-icon color="#52c41a"><CircleCheck /></el-icon>
                            {{ service }}
                          </li>
                        </ul>
                      </div>

                      <div class="product-reasoning">
                        <el-alert type="info" :closable="false">
                          <template #title>
                            <strong>推荐理由：</strong>{{ recommendation.recommended.reasoning }}
                          </template>
                        </el-alert>
                      </div>

                      <el-button type="primary" size="large" class="quote-btn">
                        <el-icon><Document /></el-icon>
                        生成报价单
                      </el-button>
                    </div>
                  </el-card>

                  <!-- 备选方案 -->
                  <div class="alternative-products">
                    <h3><el-icon><Menu /></el-icon> 备选方案</h3>
                    <el-row :gutter="20">
                      <el-col :span="12" v-for="alt in recommendation.alternatives" :key="alt.sku">
                        <el-card shadow="hover" class="alt-card">
                          <h4>{{ alt.name }}</h4>
                          <p class="alt-tagline">{{ alt.tagline }}</p>
                          <div class="alt-price">
                            {{ (alt.pricing.annualFee / 10000).toFixed(1) }} 万/年
                          </div>
                          <div class="alt-roi">ROI: {{ alt.expectedROI }}</div>
                          <el-button size="small" text type="primary">查看详情</el-button>
                        </el-card>
                      </el-col>
                    </el-row>
                  </div>
                </div>

                <el-empty 
                  v-else
                  description="请输入客户画像，获取智能推荐"
                  :image-size="180" />
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>

        <!-- Tab 3: 五级价值路径 -->
        <el-tab-pane label="🚀 五级价值路径" name="valuePath">
          <div class="value-path-section">
            <el-card shadow="hover">
              <template #header>
                <h3>客户现状诊断</h3>
              </template>
              
              <el-form :model="customerSituation" label-width="120px" inline>
                <el-form-item label="预算状况">
                  <el-select v-model="customerSituation.budget">
                    <el-option label="紧张" value="tight" />
                    <el-option label="正常" value="normal" />
                    <el-option label="充裕" value="ample" />
                  </el-select>
                </el-form-item>

                <el-form-item label="故障频率">
                  <el-select v-model="customerSituation.faultFrequency">
                    <el-option label="低" value="low" />
                    <el-option label="中" value="medium" />
                    <el-option label="高" value="high" />
                  </el-select>
                </el-form-item>

                <el-form-item label="进口依赖">
                  <el-select v-model="customerSituation.importDependency">
                    <el-option label="低" value="low" />
                    <el-option label="中" value="medium" />
                    <el-option label="高" value="high" />
                  </el-select>
                </el-form-item>

                <el-form-item label="确定性需求">
                  <el-select v-model="customerSituation.targetCertainty">
                    <el-option label="低" value="low" />
                    <el-option label="中" value="medium" />
                    <el-option label="高" value="high" />
                  </el-select>
                </el-form-item>

                <el-button type="primary" @click="getPathRecommendation">
                  <el-icon><Compass /></el-icon>
                  获取路径推荐
                </el-button>
              </el-form>
            </el-card>

            <!-- 推荐路径 -->
            <div v-if="pathRecommendation" class="path-result">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-card shadow="always" class="primary-path">
                    <template #header>
                      <div class="path-header">
                        <el-icon color="#52c41a" :size="24"><Trophy /></el-icon>
                        <span>首选路径</span>
                      </div>
                    </template>
                    
                    <div class="path-content">
                      <h2>{{ pathRecommendation.primaryPath.name }}</h2>
                      <div class="path-metrics">
                        <div class="metric">
                          <span>投资成本</span>
                          <strong>{{ pathRecommendation.primaryPath.cost }}</strong>
                        </div>
                        <div class="metric">
                          <span>预期ROI</span>
                          <strong>{{ pathRecommendation.primaryPath.roi }}</strong>
                        </div>
                        <div class="metric">
                          <span>回本周期</span>
                          <strong>{{ pathRecommendation.primaryPath.period }}</strong>
                        </div>
                      </div>
                      <el-alert type="success" :closable="false">
                        <template #title>
                          <strong>推荐理由：</strong>{{ pathRecommendation.reasoning }}
                        </template>
                      </el-alert>
                    </div>
                  </el-card>
                </el-col>

                <el-col :span="12">
                  <el-card shadow="hover">
                    <template #header>
                      <div class="path-header">
                        <el-icon color="#1890ff" :size="24"><List /></el-icon>
                        <span>备选路径</span>
                      </div>
                    </template>
                    
                    <div class="alternative-paths">
                      <div 
                        v-for="alt in pathRecommendation.alternativePaths" 
                        :key="alt.key"
                        class="alt-path-item">
                        <h4>{{ alt.name }}</h4>
                        <div class="alt-path-info">
                          <span>成本: {{ alt.cost }}</span>
                          <span>ROI: {{ alt.roi }}</span>
                          <span>周期: {{ alt.period }}</span>
                        </div>
                      </div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>

              <!-- 组合方案 -->
              <el-card 
                v-if="pathRecommendation.combinationRecommendation"
                shadow="hover" 
                class="combination-card">
                <template #header>
                  <div class="path-header">
                    <el-icon color="#722ed1" :size="24"><Connection /></el-icon>
                    <span>组合方案（推荐）</span>
                  </div>
                </template>
                
                <div class="combination-content">
                  <h3>{{ pathRecommendation.combinationRecommendation.recommended.join(' + ') }}</h3>
                  <p class="reasoning">{{ pathRecommendation.combinationRecommendation.reasoning }}</p>
                  <div class="combination-metrics">
                    <el-tag type="warning" size="large">
                      预期ROI: {{ pathRecommendation.combinationRecommendation.expectedROI }}
                    </el-tag>
                    <el-tag type="info" size="large">
                      实施周期: {{ pathRecommendation.combinationRecommendation.implementationPeriod }}
                    </el-tag>
                  </div>
                </div>
              </el-card>
            </div>
          </div>
        </el-tab-pane>

        <!-- Tab 4: 成本冰山分析 -->
        <el-tab-pane label="🧊 成本冰山分析" name="iceberg">
          <div class="iceberg-section">
            <el-card>
              <p class="section-intro">
                真正的降本空间不在"买得便宜"，而在"用得更久"。
                采购成本仅占30%，隐性成本占70%。
              </p>
            </el-card>

            <div class="iceberg-visual">
              <div class="iceberg-container">
                <div class="visible-cost">
                  <div class="cost-label">可见成本（30%）</div>
                  <div class="cost-detail">
                    <el-icon :size="48"><ShoppingCart /></el-icon>
                    <h3>采购成本</h3>
                  </div>
                </div>
                
                <div class="water-line">
                  <div class="wave"></div>
                </div>
                
                <div class="hidden-costs">
                  <div class="cost-label">隐性成本（70%）</div>
                  <div class="hidden-items">
                    <div class="hidden-item">
                      <el-icon><Warning /></el-icon>
                      <span>停机损失 25%</span>
                    </div>
                    <div class="hidden-item">
                      <el-icon><Tools /></el-icon>
                      <span>被动维修 15%</span>
                    </div>
                    <div class="hidden-item">
                      <el-icon><Box /></el-icon>
                      <span>备件库存 8%</span>
                    </div>
                    <div class="hidden-item">
                      <el-icon><Delete /></el-icon>
                      <span>过早报废 10%</span>
                    </div>
                    <div class="hidden-item">
                      <el-icon><Van /></el-icon>
                      <span>紧急物流 5%</span>
                    </div>
                    <div class="hidden-item">
                      <el-icon><User /></el-icon>
                      <span>人工低效 4%</span>
                    </div>
                    <div class="hidden-item">
                      <el-icon><WarningFilled /></el-icon>
                      <span>质量损失 3%</span>
                    </div>
                  </div>
                </div>
              </div>

              <el-alert type="warning" :closable="false" class="iceberg-conclusion">
                <template #title>
                  <h3>优化空间：通过年包服务可将隐性成本降低 40-60%</h3>
                </template>
              </el-alert>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useEquipmentLifecycleStore } from '@/store/equipmentLifecycle'
import { ElMessage } from 'element-plus'
import Header from '@/components/Header.vue'

const equipmentStore = useEquipmentLifecycleStore()

// Tab切换
const activeTab = ref('calculator')
const activeCollapse = ref([])

// 算账输入
const customerInput = reactive({
  toolCount: 100,
  toolUnitPrice: 20000,
  currentLifespan: 3,
  criticality: 7,
  faultFrequency: 'medium'
})

// 算账结果
const calculationResult = ref(null)
const calculating = ref(false)

// 年包推荐输入
const customerProfile = reactive({
  budgetLevel: 'normal',
  productionCriticality: 6,
  toolCount: 100,
  currentPainPoints: []
})

// 推荐结果
const recommendation = ref(null)
const recommending = ref(false)

// 价值路径输入
const customerSituation = reactive({
  budget: 'normal',
  faultFrequency: 'medium',
  importDependency: 'medium',
  targetCertainty: 'medium'
})

// 路径推荐结果
const pathRecommendation = ref(null)

// 立即算账
const calculateNow = () => {
  calculating.value = true
  setTimeout(() => {
    calculationResult.value = equipmentStore.generateOnPageCalculator(customerInput)
    calculating.value = false
    ElMessage.success('算账完成！')
  }, 800)
}

// 获取年包推荐
const getRecommendation = () => {
  recommending.value = true
  setTimeout(() => {
    recommendation.value = equipmentStore.recommendAnnualPackage(customerProfile)
    recommending.value = false
    ElMessage.success('推荐完成！')
  }, 1000)
}

// 获取路径推荐
const getPathRecommendation = () => {
  pathRecommendation.value = equipmentStore.recommendOptimalPath(customerSituation)
  ElMessage.success('路径推荐完成！')
}

// 复制到剪贴板
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    ElMessage.success('话术已复制到剪贴板')
  })
}
</script>

<style scoped>
.intelligent-calculator {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding-bottom: 40px;
}

.page-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icon-wrapper {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.page-header h1 {
  margin: 0 0 10px 0;
  font-size: 32px;
  color: #1a1a1a;
}

.tagline {
  color: #666;
  font-size: 16px;
  margin-bottom: 10px;
}

.calculator-tabs {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.input-card,
.result-card {
  height: 100%;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
}

.unit {
  margin-left: 8px;
  color: #999;
}

.comparison-section {
  margin-bottom: 24px;
}

.cost-box {
  border-radius: 8px;
  padding: 20px;
  height: 100%;
}

.cost-box.traditional {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
  color: white;
}

.cost-box.our-model {
  background: linear-gradient(135deg, #51cf66 0%, #37b24d 100%);
  color: white;
}

.box-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.box-header h3 {
  margin: 0;
  font-size: 18px;
}

.big-number {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 16px;
}

.big-number .unit {
  font-size: 20px;
  margin-left: 8px;
  opacity: 0.9;
}

.breakdown .item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255,255,255,0.2);
}

.savings-alert {
  margin: 24px 0;
}

.savings-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.savings-content h2 {
  margin: 0 0 8px 0;
  font-size: 18px;
}

.savings-number {
  font-size: 36px;
  font-weight: bold;
  color: #52c41a;
  display: flex;
  align-items: center;
  gap: 12px;
}

.extra-benefits {
  margin: 24px 0;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.extra-benefits h3 {
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.benefit-item {
  text-align: center;
  padding: 16px;
  background: white;
  border-radius: 8px;
}

.benefit-item span {
  display: block;
  margin: 8px 0;
  color: #666;
}

.benefit-item strong {
  display: block;
  font-size: 20px;
  color: #1890ff;
}

.pitch-collapse {
  margin-top: 24px;
}

.pitch-content {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  white-space: pre-wrap;
  font-family: 'Courier New', monospace;
  line-height: 1.6;
}

/* 年包推荐样式 */
.recommended-product {
  position: relative;
  margin-bottom: 24px;
}

.product-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: #333;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 6px;
}

.product-content h2 {
  margin: 0 0 8px 0;
  font-size: 28px;
  color: #1a1a1a;
}

.product-tagline {
  color: #666;
  font-size: 16px;
  margin-bottom: 24px;
}

.product-pricing {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
  margin-bottom: 24px;
}

.price-value {
  font-size: 48px;
  font-weight: bold;
  margin: 8px 0;
}

.price-value .unit {
  font-size: 20px;
  margin-left: 8px;
}

.price-desc {
  font-size: 14px;
  opacity: 0.9;
}

.product-services {
  margin: 24px 0;
}

.product-services h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.product-services ul {
  list-style: none;
  padding: 0;
}

.product-services li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
}

.quote-btn {
  width: 100%;
  margin-top: 24px;
}

.alternative-products {
  margin-top: 24px;
}

.alternative-products h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.alt-card {
  text-align: center;
}

.alt-card h4 {
  margin: 0 0 8px 0;
}

.alt-tagline {
  color: #666;
  font-size: 14px;
  margin-bottom: 16px;
}

.alt-price {
  font-size: 24px;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 8px;
}

/* 价值路径样式 */
.primary-path {
  border: 2px solid #52c41a;
}

.path-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

.path-content h2 {
  margin: 0 0 20px 0;
  font-size: 28px;
  color: #1a1a1a;
}

.path-metrics {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
}

.path-metrics .metric {
  text-align: center;
}

.path-metrics .metric span {
  display: block;
  color: #666;
  margin-bottom: 8px;
}

.path-metrics .metric strong {
  display: block;
  font-size: 20px;
  color: #1890ff;
}

.alt-path-item {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.alt-path-item:last-child {
  border-bottom: none;
}

.alt-path-item h4 {
  margin: 0 0 12px 0;
}

.alt-path-info {
  display: flex;
  gap: 16px;
  color: #666;
  font-size: 14px;
}

.combination-card {
  margin-top: 20px;
  border: 2px solid #722ed1;
}

.combination-content h3 {
  margin: 0 0 12px 0;
  font-size: 24px;
  color: #722ed1;
}

.combination-content .reasoning {
  color: #666;
  margin-bottom: 16px;
}

.combination-metrics {
  display: flex;
  gap: 12px;
}

/* 成本冰山样式 */
.iceberg-section .section-intro {
  font-size: 16px;
  line-height: 1.8;
  color: #666;
  text-align: center;
  padding: 20px;
}

.iceberg-visual {
  max-width: 800px;
  margin: 40px auto;
}

.iceberg-container {
  position: relative;
  background: linear-gradient(180deg, #e6f7ff 0%, #e6f7ff 30%, #0050b3 30%, #003a8c 100%);
  border-radius: 12px;
  padding: 40px;
  min-height: 600px;
}

.visible-cost {
  text-align: center;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.cost-label {
  font-size: 20px;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 16px;
}

.cost-detail h3 {
  margin: 16px 0 0 0;
  color: #1a1a1a;
}

.water-line {
  position: relative;
  height: 40px;
  margin: 20px 0;
  overflow: hidden;
}

.wave {
  position: absolute;
  width: 100%;
  height: 4px;
  background: rgba(255,255,255,0.5);
  animation: wave 2s infinite;
}

@keyframes wave {
  0%, 100% { transform: translateX(-50%) scaleX(1); }
  50% { transform: translateX(50%) scaleX(1.2); }
}

.hidden-costs {
  padding: 30px;
  color: white;
}

.hidden-costs .cost-label {
  color: white;
  text-align: center;
}

.hidden-items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 20px;
}

.hidden-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255,255,255,0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.iceberg-conclusion {
  margin-top: 40px;
}

.iceberg-conclusion h3 {
  margin: 0;
  font-size: 20px;
}
</style>
