<template>
  <div class="customer360-manage">
    <el-card>
      <template #header>
        <div class="card-header">
          <h2>👤 客户360画像与沙盘分析管理</h2>
          <el-button type="primary" @click="showAddCustomerDialog">
            <el-icon><Plus /></el-icon>
            添加客户
          </el-button>
        </div>
      </template>

      <!-- 数据源配置 -->
      <el-tabs v-model="activeTab">
        <el-tab-pane label="客户数据管理" name="customers">
          <el-table :data="customers" stripe>
            <el-table-column prop="name" label="客户名称" width="200" />
            <el-table-column prop="industry" label="行业" width="120" />
            <el-table-column prop="totalRevenue" label="总营收" width="120">
              <template #default="{ row }">
                ¥{{ (row.totalRevenue / 10000).toFixed(1) }}万
              </template>
            </el-table-column>
            <el-table-column prop="healthScore" label="健康分" width="100">
              <template #default="{ row }">
                <el-tag :type="getHealthType(row.healthScore)">
                  {{ row.healthScore }}分
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="stage" label="客户阶段" width="120" />
            <el-table-column label="数据完整度" width="150">
              <template #default="{ row }">
                <el-progress :percentage="row.dataCompleteness" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="{ row }">
                <el-button size="small" @click="editCustomer(row)">编辑</el-button>
                <el-button size="small" type="primary" @click="viewCustomer360(row)">360画像</el-button>
                <el-button size="small" type="danger" @click="deleteCustomer(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="数据源配置" name="datasource">
          <el-form label-width="150px">
            <el-divider content-position="left">销售数据同步</el-divider>
            <el-form-item label="同步商机数据">
              <el-switch v-model="config.syncOpportunities" />
              <span class="ml-2 text-gray">自动同步商机列表到客户360</span>
            </el-form-item>
            <el-form-item label="同步报价数据">
              <el-switch v-model="config.syncQuotes" />
              <span class="ml-2 text-gray">同步报价单到客户画像</span>
            </el-form-item>

            <el-divider content-position="left">产品数据整合</el-divider>
            <el-form-item label="整合产品数据库">
              <el-switch v-model="config.integrateProducts" />
              <span class="ml-2 text-gray">获取客户购买产品历史</span>
            </el-form-item>
            <el-form-item label="整合产品矩阵">
              <el-switch v-model="config.integrateMatrix" />
              <span class="ml-2 text-gray">分析客户产品组合偏好</span>
            </el-form-item>

            <el-divider content-position="left">知识库整合</el-divider>
            <el-form-item label="整合案例库">
              <el-switch v-model="config.integrateCases" />
              <span class="ml-2 text-gray">展示相关成功案例</span>
            </el-form-item>
            <el-form-item label="整合技术文档">
              <el-switch v-model="config.integrateDocs" />
              <span class="ml-2 text-gray">推荐相关技术资料</span>
            </el-form-item>

            <el-divider content-position="left">AI分析配置</el-divider>
            <el-form-item label="启用AI健康分析">
              <el-switch v-model="config.enableHealthAnalysis" />
            </el-form-item>
            <el-form-item label="启用行为预测">
              <el-switch v-model="config.enableBehaviorPrediction" />
            </el-form-item>
            <el-form-item label="启用流失预警">
              <el-switch v-model="config.enableChurnAlert" />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="saveConfig">保存配置</el-button>
              <el-button @click="resetConfig">重置</el-button>
              <el-button type="success" @click="syncAllData">
                <el-icon><Refresh /></el-icon>
                立即同步所有数据
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="沙盘配置" name="sandbox">
          <el-form label-width="150px">
            <el-form-item label="预测时间范围">
              <el-radio-group v-model="sandboxConfig.timeRange">
                <el-radio label="month">未来1个月</el-radio>
                <el-radio label="quarter">未来1季度</el-radio>
                <el-radio label="halfYear">未来半年</el-radio>
                <el-radio label="year">未来1年</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="风险阈值设置">
              <el-row :gutter="20">
                <el-col :span="8">
                  <label>流失风险</label>
                  <el-slider v-model="sandboxConfig.churnThreshold" :max="100" />
                </el-col>
                <el-col :span="8">
                  <label>付款风险</label>
                  <el-slider v-model="sandboxConfig.paymentRiskThreshold" :max="100" />
                </el-col>
                <el-col :span="8">
                  <label>竞争风险</label>
                  <el-slider v-model="sandboxConfig.competitionRiskThreshold" :max="100" />
                </el-col>
              </el-row>
            </el-form-item>

            <el-form-item label="模拟场景">
              <el-checkbox-group v-model="sandboxConfig.scenarios">
                <el-checkbox label="price_increase">价格上涨10%</el-checkbox>
                <el-checkbox label="competitor_entry">新竞争对手进入</el-checkbox>
                <el-checkbox label="budget_cut">客户预算削减</el-checkbox>
                <el-checkbox label="expand_product">产品线扩展</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="saveSandboxConfig">保存沙盘配置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加/编辑客户对话框 -->
    <el-dialog
      v-model="customerDialogVisible"
      :title="editingCustomer ? '编辑客户' : '添加客户'"
      width="800px"
    >
      <el-form :model="customerForm" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户名称" required>
              <el-input v-model="customerForm.name" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="行业">
              <el-select v-model="customerForm.industry" style="width: 100%;">
                <el-option label="汽车制造" value="汽车制造" />
                <el-option label="电子制造" value="电子制造" />
                <el-option label="航空航天" value="航空航天" />
                <el-option label="新能源" value="新能源" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="客户阶段">
              <el-select v-model="customerForm.stage" style="width: 100%;">
                <el-option label="潜在客户" value="potential" />
                <el-option label="意向客户" value="interested" />
                <el-option label="成交客户" value="customer" />
                <el-option label="战略客户" value="strategic" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="健康分">
              <el-input-number v-model="customerForm.healthScore" :min="0" :max="100" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="公司地址">
          <el-input v-model="customerForm.address" />
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="customerForm.notes" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="customerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCustomer">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh } from '@element-plus/icons-vue'
import { useCustomer360Store } from '@/store/customer360'

const customer360Store = useCustomer360Store()

// 状态管理
const activeTab = ref('customers')
const customerDialogVisible = ref(false)
const editingCustomer = ref(null)

// 配置数据
const config = reactive({
  syncOpportunities: true,
  syncQuotes: true,
  integrateProducts: true,
  integrateMatrix: true,
  integrateCases: true,
  integrateDocs: true,
  enableHealthAnalysis: true,
  enableBehaviorPrediction: true,
  enableChurnAlert: true
})

const sandboxConfig = reactive({
  timeRange: 'quarter',
  churnThreshold: 70,
  paymentRiskThreshold: 60,
  competitionRiskThreshold: 50,
  scenarios: ['price_increase', 'competitor_entry']
})

const customerForm = reactive({
  name: '',
  industry: '',
  stage: 'potential',
  healthScore: 80,
  address: '',
  notes: ''
})

// 客户列表
const customers = ref([])

// 加载客户数据
const loadCustomers = () => {
  customers.value = customer360Store.customers.map(c => ({
    ...c,
    dataCompleteness: Math.floor(70 + Math.random() * 30)
  }))
}

// 显示添加客户对话框
const showAddCustomerDialog = () => {
  editingCustomer.value = null
  Object.assign(customerForm, {
    name: '',
    industry: '',
    stage: 'potential',
    healthScore: 80,
    address: '',
    notes: ''
  })
  customerDialogVisible.value = true
}

// 编辑客户
const editCustomer = (customer) => {
  editingCustomer.value = customer
  Object.assign(customerForm, customer)
  customerDialogVisible.value = true
}

// 保存客户
const saveCustomer = () => {
  if (!customerForm.name) {
    ElMessage.warning('请填写客户名称')
    return
  }

  if (editingCustomer.value) {
    customer360Store.updateCustomer(editingCustomer.value.id, customerForm)
    ElMessage.success('客户更新成功')
  } else {
    customer360Store.addCustomer({
      ...customerForm,
      id: `cust_${Date.now()}`,
      createTime: new Date().toISOString()
    })
    ElMessage.success('客户添加成功')
  }

  customerDialogVisible.value = false
  loadCustomers()
}

// 删除客户
const deleteCustomer = (customer) => {
  ElMessageBox.confirm('确定要删除这个客户吗？', '确认删除', {
    type: 'warning'
  }).then(() => {
    customer360Store.deleteCustomer(customer.id)
    loadCustomers()
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 查看客户360
const viewCustomer360 = (customer) => {
  ElMessage.info('前往客户360画像页面')
  // 跳转到前台客户360页面
}

// 获取健康分类型
const getHealthType = (score) => {
  if (score >= 80) return 'success'
  if (score >= 60) return 'warning'
  return 'danger'
}

// 保存配置
const saveConfig = () => {
  localStorage.setItem('customer360Config', JSON.stringify(config))
  ElMessage.success('配置保存成功')
}

// 重置配置
const resetConfig = () => {
  Object.assign(config, {
    syncOpportunities: true,
    syncQuotes: true,
    integrateProducts: true,
    integrateMatrix: true,
    integrateCases: true,
    integrateDocs: true,
    enableHealthAnalysis: true,
    enableBehaviorPrediction: true,
    enableChurnAlert: true
  })
}

// 同步所有数据
const syncAllData = async () => {
  const loading = ElMessage({
    message: '正在同步所有数据源...',
    type: 'info',
    duration: 0
  })

  try {
    // 模拟数据同步
    await new Promise(resolve => setTimeout(resolve, 2000))
    await customer360Store.syncAllDataSources()
    loadCustomers()
    ElMessage.success('所有数据同步成功')
  } catch (error) {
    ElMessage.error('数据同步失败')
  } finally {
    loading.close()
  }
}

// 保存沙盘配置
const saveSandboxConfig = () => {
  localStorage.setItem('customer360SandboxConfig', JSON.stringify(sandboxConfig))
  ElMessage.success('沙盘配置保存成功')
}

onMounted(() => {
  loadCustomers()
  
  // 加载配置
  const savedConfig = localStorage.getItem('customer360Config')
  if (savedConfig) {
    Object.assign(config, JSON.parse(savedConfig))
  }
  
  const savedSandboxConfig = localStorage.getItem('customer360SandboxConfig')
  if (savedSandboxConfig) {
    Object.assign(sandboxConfig, JSON.parse(savedSandboxConfig))
  }
})
</script>

<style scoped>
.customer360-manage {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.text-gray {
  color: #999;
  font-size: 13px;
}

.ml-2 {
  margin-left: 8px;
}
</style>
