<template>
  <div class="product-matrix-manage">
    <div class="page-header">
      <h2>📊 企业产品矩阵管理 - 后台编辑</h2>
      <el-space>
        <el-button type="primary" @click="showAddProductDialog = true">
          <el-icon><Plus /></el-icon>
          添加产品
        </el-button>
        <el-button @click="importData">
          <el-icon><Upload /></el-icon>
          批量导入
        </el-button>
        <el-button @click="exportData">
          <el-icon><Download /></el-icon>
          导出数据
        </el-button>
        <el-button @click="showStrategyConfig = true">
          <el-icon><Setting /></el-icon>
          战略配置
        </el-button>
      </el-space>
    </div>

    <!-- 数据统计卡片 -->
    <el-row :gutter="16" class="stats-row">
      <el-col :span="6">
        <el-card>
          <el-statistic title="总产品数" :value="matrixStore.matrixData.length">
            <template #prefix>
              <el-icon><Box /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-statistic title="核心产品" :value="coreProductCount" suffix="个">
            <template #prefix>
              <el-icon color="#67C23A"><Star /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-statistic title="需优化产品" :value="optimizeProductCount" suffix="个">
            <template #prefix>
              <el-icon color="#E6A23C"><Warning /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <el-statistic title="待淘汰产品" :value="maintainProductCount" suffix="个">
            <template #prefix>
              <el-icon color="#F56C6C"><Delete /></el-icon>
            </template>
          </el-statistic>
        </el-card>
      </el-col>
    </el-row>

    <!-- 产品列表 -->
    <el-card class="product-table-card">
      <template #header>
        <div class="card-header">
          <span>产品列表</span>
          <el-space>
            <el-input
              v-model="searchKeyword"
              placeholder="搜索产品名称..."
              clearable
              style="width: 200px;"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-select v-model="filterQuadrant" placeholder="战略象限" clearable style="width: 140px;">
              <el-option label="核心产品" value="core" />
              <el-option label="优化提升" value="optimize" />
              <el-option label="低投入维持" value="maintain" />
              <el-option label="潜力产品" value="potential" />
            </el-select>
          </el-space>
        </div>
      </template>

      <el-table :data="filteredProducts" stripe border>
        <el-table-column type="index" label="#" width="60" />
        <el-table-column prop="name" label="产品名称" width="200" />
        <el-table-column prop="categoryName" label="产品大类" width="120" />
        <el-table-column label="销售额" width="120">
          <template #default="{ row }">
            ¥{{ (row.revenue / 10000).toFixed(1) }}万
          </template>
        </el-table-column>
        <el-table-column label="毛利率" width="100">
          <template #default="{ row }">
            <el-tag :type="getMarginType(row.grossMargin)">
              {{ row.grossMargin }}%
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="现金流贡献率" width="130">
          <template #default="{ row }">
            {{ row.cashFlowContributionRate }}%
          </template>
        </el-table-column>
        <el-table-column label="库存周转(天)" width="120">
          <template #default="{ row }">
            <span :class="{ 'text-danger': row.inventoryDays > 90 }">
              {{ row.inventoryDays }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="回款周期(天)" width="120">
          <template #default="{ row }">
            <span :class="{ 'text-danger': row.paymentCycle > 60 }">
              {{ row.paymentCycle }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="战略定位" width="120">
          <template #default="{ row }">
            <el-tag :type="getQuadrantType(row.quadrant)">
              {{ getQuadrantName(row.quadrant) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="editProduct(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="deleteProduct(row)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑产品对话框 -->
    <el-dialog
      v-model="showAddProductDialog"
      :title="editingProduct ? '编辑产品' : '添加产品'"
      width="800px"
      :close-on-click-modal="false"
    >
      <el-form :model="productForm" :rules="productRules" ref="productFormRef" label-width="140px">
        <el-tabs v-model="activeTab">
          <!-- 基础信息 -->
          <el-tab-pane label="基础信息" name="basic">
            <el-form-item label="产品名称" prop="name">
              <el-input v-model="productForm.name" placeholder="请输入产品名称" />
            </el-form-item>
            <el-form-item label="产品大类" prop="categoryId">
              <el-select v-model="productForm.categoryId" placeholder="请选择产品大类" style="width: 100%;">
                <el-option
                  v-for="cat in productCategories"
                  :key="cat.id"
                  :label="cat.name"
                  :value="cat.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="产品生命周期">
              <el-radio-group v-model="productForm.lifecycle">
                <el-radio label="intro">导入期</el-radio>
                <el-radio label="growth">成长期</el-radio>
                <el-radio label="mature">成熟期</el-radio>
                <el-radio label="decline">衰退期</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-tab-pane>

          <!-- 财务数据 -->
          <el-tab-pane label="财务数据" name="financial">
            <el-form-item label="销售额(元)" prop="revenue">
              <el-input-number
                v-model="productForm.revenue"
                :min="0"
                :step="10000"
                controls-position="right"
                style="width: 100%;"
              />
            </el-form-item>
            <el-form-item label="毛利率(%)" prop="grossMargin">
              <el-slider
                v-model="productForm.grossMargin"
                :min="0"
                :max="50"
                :step="0.1"
                show-input
              />
            </el-form-item>
            <el-form-item label="净利润(元)">
              <el-input-number
                v-model="productForm.netProfit"
                :min="0"
                :step="1000"
                controls-position="right"
                style="width: 100%;"
              />
            </el-form-item>
          </el-tab-pane>

          <!-- 现金流数据 -->
          <el-tab-pane label="现金流数据" name="cashflow">
            <el-form-item label="现金流贡献(元)">
              <el-input-number
                v-model="productForm.cashFlowContribution"
                :min="0"
                :step="1000"
                controls-position="right"
                style="width: 100%;"
              />
            </el-form-item>
            <el-form-item label="现金流贡献率(%)">
              <el-slider
                v-model="productForm.cashFlowContributionRate"
                :min="0"
                :max="30"
                :step="0.1"
                show-input
              />
            </el-form-item>
            <el-form-item label="库存周转天数">
              <el-input-number
                v-model="productForm.inventoryDays"
                :min="0"
                :max="365"
                controls-position="right"
                style="width: 100%;"
              />
              <div class="form-tip" v-if="productForm.inventoryDays > 90">
                <el-icon color="#F56C6C"><Warning /></el-icon>
                库存周转天数较高，建议优化
              </div>
            </el-form-item>
            <el-form-item label="回款周期(天)">
              <el-input-number
                v-model="productForm.paymentCycle"
                :min="0"
                :max="180"
                controls-position="right"
                style="width: 100%;"
              />
              <div class="form-tip" v-if="productForm.paymentCycle > 60">
                <el-icon color="#F56C6C"><Warning /></el-icon>
                回款周期较长，建议改善账期
              </div>
            </el-form-item>
          </el-tab-pane>

          <!-- 市场数据 -->
          <el-tab-pane label="市场数据" name="market">
            <el-form-item label="市场增长率(%)">
              <el-slider
                v-model="productForm.marketGrowthRate"
                :min="-10"
                :max="30"
                :step="0.1"
                show-input
              />
            </el-form-item>
            <el-form-item label="市场份额(%)">
              <el-slider
                v-model="productForm.marketShare"
                :min="0"
                :max="30"
                :step="0.1"
                show-input
              />
            </el-form-item>
            <el-form-item label="销售数量">
              <el-input-number
                v-model="productForm.salesVolume"
                :min="0"
                controls-position="right"
                style="width: 100%;"
              />
            </el-form-item>
          </el-tab-pane>
        </el-tabs>

        <!-- 自动计算的战略定位 -->
        <el-divider />
        <el-form-item label="战略定位">
          <el-tag :type="getQuadrantType(autoQuadrant)" size="large">
            {{ getQuadrantName(autoQuadrant) }}
          </el-tag>
          <span class="ml-2 text-muted">
            (自动根据毛利率和现金流贡献率计算)
          </span>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showAddProductDialog = false">取消</el-button>
        <el-button type="primary" @click="saveProduct">保存</el-button>
      </template>
    </el-dialog>

    <!-- 战略配置对话框 -->
    <el-dialog
      v-model="showStrategyConfig"
      title="战略配置"
      width="600px"
    >
      <el-form :model="matrixStore.strategyConfig" label-width="160px">
        <el-divider content-position="left">四象限分界线</el-divider>
        <el-form-item label="毛利率分界线(%)">
          <el-slider
            v-model="matrixStore.strategyConfig.grossMarginThreshold"
            :min="10"
            :max="40"
            :step="1"
            show-input
          />
          <div class="config-tip">
            毛利率高于此值的产品将被归类为"高收益"产品
          </div>
        </el-form-item>
        <el-form-item label="现金流分界线(%)">
          <el-slider
            v-model="matrixStore.strategyConfig.cashFlowThreshold"
            :min="5"
            :max="25"
            :step="1"
            show-input
          />
          <div class="config-tip">
            现金流贡献率高于此值的产品将被归类为"高现金流"产品
          </div>
        </el-form-item>

        <el-divider content-position="left">风险阈值</el-divider>
        <el-form-item label="库存天数警戒值">
          <el-input-number
            v-model="matrixStore.strategyConfig.inventoryDaysAlert"
            :min="30"
            :max="180"
            controls-position="right"
            style="width: 100%;"
          />
          <div class="config-tip">
            库存周转天数超过此值将产生预警
          </div>
        </el-form-item>
        <el-form-item label="回款周期警戒值">
          <el-input-number
            v-model="matrixStore.strategyConfig.paymentCycleAlert"
            :min="30"
            :max="120"
            controls-position="right"
            style="width: 100%;"
          />
          <div class="config-tip">
            回款周期超过此值将产生预警
          </div>
        </el-form-item>

        <el-divider content-position="left">AI推荐权重</el-divider>
        <el-form-item label="收益权重">
          <el-slider
            v-model="matrixStore.strategyConfig.revenueWeight"
            :min="0"
            :max="1"
            :step="0.1"
            show-input
          />
        </el-form-item>
        <el-form-item label="毛利权重">
          <el-slider
            v-model="matrixStore.strategyConfig.marginWeight"
            :min="0"
            :max="1"
            :step="0.1"
            show-input
          />
        </el-form-item>
        <el-form-item label="现金流权重">
          <el-slider
            v-model="matrixStore.strategyConfig.cashFlowWeight"
            :min="0"
            :max="1"
            :step="0.1"
            show-input
          />
        </el-form-item>
        <el-form-item label="增长权重">
          <el-slider
            v-model="matrixStore.strategyConfig.growthWeight"
            :min="0"
            :max="1"
            :step="0.1"
            show-input
          />
        </el-form-item>
        <el-alert
          :title="`权重总和: ${totalWeight.toFixed(1)} ${totalWeight !== 1.0 ? '(建议总和为1.0)' : ''}`"
          :type="totalWeight === 1.0 ? 'success' : 'warning'"
          :closable="false"
        />
      </el-form>

      <template #footer>
        <el-button @click="showStrategyConfig = false">取消</el-button>
        <el-button type="primary" @click="saveStrategyConfig">保存配置</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus, Upload, Download, Setting, Box, Star, Warning, Delete,
  Search, Edit
} from '@element-plus/icons-vue'
import { useProductMatrixStore } from '@/store/productMatrix'
import { useProductsServicesStore } from '@/store/productsServices'

const matrixStore = useProductMatrixStore()
const productsStore = useProductsServicesStore()

// 状态
const showAddProductDialog = ref(false)
const showStrategyConfig = ref(false)
const editingProduct = ref(null)
const searchKeyword = ref('')
const filterQuadrant = ref('')
const activeTab = ref('basic')
const productFormRef = ref(null)

// 产品表单
const productForm = reactive({
  name: '',
  categoryId: null,
  revenue: 0,
  grossMargin: 0,
  netProfit: 0,
  cashFlowContribution: 0,
  cashFlowContributionRate: 0,
  inventoryDays: 0,
  paymentCycle: 0,
  marketGrowthRate: 0,
  marketShare: 0,
  salesVolume: 0,
  lifecycle: 'intro'
})

// 表单验证规则
const productRules = {
  name: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择产品大类', trigger: 'change' }],
  revenue: [{ required: true, message: '请输入销售额', trigger: 'blur' }],
  grossMargin: [{ required: true, message: '请输入毛利率', trigger: 'blur' }]
}

// 计算属性
const productCategories = computed(() =>
  productsStore.level1Categories.map(cat => ({
    id: cat.id,
    name: cat.name['zh-CN']
  }))
)

const coreProductCount = computed(() =>
  matrixStore.matrixData.filter(p => p.quadrant === 'core').length
)

const optimizeProductCount = computed(() =>
  matrixStore.matrixData.filter(p => p.quadrant === 'optimize').length
)

const maintainProductCount = computed(() =>
  matrixStore.matrixData.filter(p => p.quadrant === 'maintain').length
)

const filteredProducts = computed(() => {
  let products = matrixStore.matrixData

  // 搜索过滤
  if (searchKeyword.value) {
    products = products.filter(p =>
      p.name.toLowerCase().includes(searchKeyword.value.toLowerCase())
    )
  }

  // 象限过滤
  if (filterQuadrant.value) {
    products = products.filter(p => p.quadrant === filterQuadrant.value)
  }

  return products
})

const autoQuadrant = computed(() => {
  return matrixStore.determineQuadrant(
    productForm.grossMargin,
    productForm.cashFlowContributionRate
  )
})

const totalWeight = computed(() => {
  const config = matrixStore.strategyConfig
  return config.revenueWeight + config.marginWeight + config.cashFlowWeight + config.growthWeight
})

// 方法
const editProduct = (product) => {
  editingProduct.value = product
  Object.assign(productForm, product)
  showAddProductDialog.value = true
}

const deleteProduct = (product) => {
  ElMessageBox.confirm(
    `确定要删除产品"${product.name}"吗？此操作不可恢复。`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    if (matrixStore.deleteProduct(product.id)) {
      ElMessage.success('删除成功')
    } else {
      ElMessage.error('删除失败')
    }
  }).catch(() => {})
}

const saveProduct = async () => {
  if (!productFormRef.value) return

  await productFormRef.value.validate((valid) => {
    if (valid) {
      const categoryName = productCategories.value.find(
        c => c.id === productForm.categoryId
      )?.name || ''

      const productData = {
        ...productForm,
        categoryName,
        contributionRate: productForm.revenue > 0
          ? (productForm.netProfit / productForm.revenue) * 100
          : 0
      }

      if (editingProduct.value) {
        // 更新产品
        if (matrixStore.updateProduct(editingProduct.value.id, productData)) {
          ElMessage.success('更新成功')
          showAddProductDialog.value = false
          resetForm()
        }
      } else {
        // 添加产品
        matrixStore.addProduct(productData)
        ElMessage.success('添加成功')
        showAddProductDialog.value = false
        resetForm()
      }
    }
  })
}

const resetForm = () => {
  editingProduct.value = null
  Object.assign(productForm, {
    name: '',
    categoryId: null,
    revenue: 0,
    grossMargin: 0,
    netProfit: 0,
    cashFlowContribution: 0,
    cashFlowContributionRate: 0,
    inventoryDays: 0,
    paymentCycle: 0,
    marketGrowthRate: 0,
    marketShare: 0,
    salesVolume: 0,
    lifecycle: 'intro'
  })
  nextTick(() => {
    productFormRef.value?.clearValidate()
  })
}

const importData = () => {
  ElMessage.info('批量导入功能开发中...')
}

const exportData = () => {
  const csv = [
    ['产品名称', '大类', '销售额', '毛利率', '现金流贡献率', '库存周转', '回款周期', '战略定位'].join(','),
    ...matrixStore.matrixData.map(p => [
      p.name,
      p.categoryName,
      p.revenue,
      p.grossMargin,
      p.cashFlowContributionRate,
      p.inventoryDays,
      p.paymentCycle,
      getQuadrantName(p.quadrant)
    ].join(','))
  ].join('\n')

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `产品矩阵数据_${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success('导出成功')
}

const saveStrategyConfig = () => {
  matrixStore.saveToLocalStorage()
  ElMessage.success('配置已保存')
  showStrategyConfig.value = false
}

// 辅助方法
const getMarginType = (margin) => {
  if (margin >= 30) return 'success'
  if (margin >= 20) return 'warning'
  return 'danger'
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

const getQuadrantName = (quadrant) => {
  const names = {
    core: '核心',
    optimize: '优化',
    maintain: '维持',
    potential: '潜力'
  }
  return names[quadrant] || '未分类'
}

// 初始化
const init = async () => {
  await matrixStore.loadData()
}

init()
</script>

<style scoped>
.product-matrix-manage {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: #fff;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
}

.stats-row {
  margin-bottom: 20px;
}

.product-table-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.text-danger {
  color: #F56C6C;
  font-weight: 600;
}

.form-tip {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 13px;
  color: #F56C6C;
}

.config-tip {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
  line-height: 1.5;
}

.ml-2 {
  margin-left: 8px;
}

.text-muted {
  color: #909399;
  font-size: 13px;
}

:deep(.el-statistic__content) {
  font-size: 24px;
}

:deep(.el-card) {
  border-radius: 8px;
  transition: all 0.3s;
}

:deep(.el-card:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>
