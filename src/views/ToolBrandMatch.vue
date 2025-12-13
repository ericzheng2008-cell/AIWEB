<template>
  <div class="tool-brand-match">
    <div class="page-header">
      <div class="container">
        <h1>品牌型号智能匹配系统</h1>
        <p class="subtitle">根据工艺需求，为您推荐最合适的工具品牌和型号</p>
      </div>
    </div>

    <div class="container">
      <div class="match-content">
        <!-- 左侧：匹配条件 -->
        <div class="config-panel">
          <el-card class="config-card">
            <template #header>
              <div class="card-header">
                <el-icon><Setting /></el-icon>
                <span>匹配条件</span>
              </div>
            </template>

            <!-- 工具参数 -->
            <div class="config-section">
              <h3>工具参数</h3>
              <el-form :model="matchCriteria" label-width="120px">
                <el-form-item label="工具品牌">
                  <el-select v-model="matchCriteria.brand" placeholder="请选择品牌">
                    <el-option label="EQTCF" value="EQTCF" />
                    <el-option label="博世" value="博世" />
                  </el-select>
                </el-form-item>

                <el-form-item label="工具类型">
                  <el-select v-model="matchCriteria.toolType" placeholder="请选择工具类型">
                    <el-option label="锂电池" value="锂电池" />
                    <el-option label="有线电动" value="有线电动" />
                  </el-select>
                </el-form-item>

                <el-form-item label="控制类型">
                  <el-select v-model="matchCriteria.controlType" placeholder="请选择控制类型">
                    <el-option label="离合器" value="离合器" />
                    <el-option label="油压脉冲" value="油压脉冲" />
                    <el-option label="电脉冲" value="电脉冲" />
                    <el-option label="直驱" value="直驱" />
                  </el-select>
                </el-form-item>

                <el-form-item label="扭矩范围">
                  <el-select v-model="matchCriteria.torqueRange" placeholder="请选择扭矩范围">
                    <el-option label="1-5Nm" value="1-5Nm" />
                    <el-option label="5-8Nm" value="5-8Nm" />
                    <el-option label="6-12Nm" value="6-12Nm" />
                    <el-option label="5-10Nm" value="5-10Nm" />
                    <el-option label="20-30Nm" value="20-30Nm" />
                    <el-option label="25-35Nm" value="25-35Nm" />
                    <el-option label="30-45Nm" value="30-45Nm" />
                  </el-select>
                </el-form-item>

                <el-form-item label="需求扭矩">
                  <el-input v-model="matchCriteria.requiredTorque" placeholder="输入具体扭矩值" type="number">
                    <template #append>Nm</template>
                  </el-input>
                </el-form-item>
              </el-form>
            </div>

            <!-- 特殊要求 -->
            <div class="config-section">
              <h3>特殊要求</h3>
              <el-form :model="matchCriteria" label-width="120px">
                <el-form-item label="便携性要求">
                  <el-radio-group v-model="matchCriteria.portable">
                    <el-radio :label="null">不限</el-radio>
                    <el-radio :label="true">便携</el-radio>
                    <el-radio :label="false">固定</el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item label="数字化要求">
                  <el-radio-group v-model="matchCriteria.digital">
                    <el-radio :label="null">不限</el-radio>
                    <el-radio :label="true">数字化</el-radio>
                    <el-radio :label="false">传统型</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
            </div>

            <div class="action-buttons">
              <el-button type="primary" size="large" @click="handleMatch" :loading="loading">
                <el-icon><Search /></el-icon>
                智能匹配
              </el-button>
              <el-button size="large" @click="autoFillExample">
                <el-icon><MagicStick /></el-icon>
                示例场景
              </el-button>
              <el-button size="large" @click="resetForm">
                <el-icon><RefreshRight /></el-icon>
                重置
              </el-button>
            </div>
          </el-card>
        </div>

        <!-- 右侧：匹配结果 -->
        <div class="result-panel">
          <el-card class="result-card">
            <template #header>
              <div class="card-header">
                <el-icon><Collection /></el-icon>
                <span>匹配结果</span>
                <el-tag v-if="recommendations.length > 0" type="success" class="result-count">
                  共 {{ recommendations.length }} 个匹配项
                </el-tag>
              </div>
            </template>

            <div v-if="recommendations.length === 0" class="empty-state">
              <el-empty description="请在左侧配置匹配条件，点击智能匹配查看结果" />
            </div>

            <div v-else class="recommendations-list">
              <div
                v-for="(tool, index) in recommendations"
                :key="tool.id"
                class="tool-card"
                :class="{ 'best-match': index === 0 }"
              >
                <div class="tool-header">
                  <div class="tool-title">
                    <h3>{{ tool.model }}</h3>
                    <el-tag v-if="index === 0" type="success" effect="dark" size="large">
                      <el-icon><Star /></el-icon>
                      最佳推荐
                    </el-tag>
                  </div>
                  <div class="tool-name">{{ tool.name }}</div>
                  <div class="tool-brand-type">
                    <el-tag type="primary" size="small">{{ tool.brand }}</el-tag>
                    <el-tag type="info" size="small">{{ tool.toolType }}</el-tag>
                  </div>
                </div>

                <div class="tool-info">
                  <div class="info-row">
                    <div class="info-group">
                      <label>控制类型：</label>
                      <el-tag :type="getControlTypeColor(tool.controlType)" size="small">
                        {{ tool.controlType }}
                      </el-tag>
                    </div>
                    <div class="info-group">
                      <label>扭矩范围：</label>
                      <el-tag type="warning" size="small">{{ tool.torqueRange }}</el-tag>
                    </div>
                  </div>

                  <div class="info-row">
                    <div class="info-group">
                      <label>供电方式：</label>
                      <span>{{ tool.specifications.power }}</span>
                    </div>
                    <div class="info-group" v-if="tool.specifications.voltage">
                      <label>电压：</label>
                      <span>{{ tool.specifications.voltage }}</span>
                    </div>
                  </div>

                  <div class="info-row">
                    <div class="info-group">
                      <label>重量：</label>
                      <span>{{ tool.specifications.weight }}</span>
                    </div>
                    <div class="info-group">
                      <label>转速：</label>
                      <span>{{ tool.specifications.speed }}</span>
                    </div>
                  </div>

                  <div class="info-row">
                    <div class="info-group">
                      <label>扭矩详情：</label>
                      <span>
                        {{ tool.specifications.minTorque }} - {{ tool.specifications.maxTorque }} 
                        {{ tool.specifications.unit }}
                      </span>
                    </div>
                  </div>
                </div>

                <div class="tool-features">
                  <el-tag v-if="tool.features.portable" type="success" size="small">
                    <el-icon><Check /></el-icon>
                    便携
                  </el-tag>
                  <el-tag v-if="tool.features.adjustable" type="info" size="small">
                    <el-icon><Check /></el-icon>
                    可调节
                  </el-tag>
                  <el-tag v-if="tool.features.digital" type="primary" size="small">
                    <el-icon><Check /></el-icon>
                    数字化
                  </el-tag>
                </div>

                <div class="tool-description">
                  <p>{{ tool.description }}</p>
                </div>

                <div v-if="tool.applications && tool.applications.length > 0" class="tool-applications">
                  <label>应用场景：</label>
                  <el-tag
                    v-for="app in tool.applications"
                    :key="app"
                    type="info"
                    effect="plain"
                    size="small"
                  >
                    {{ app }}
                  </el-tag>
                </div>

                <div class="tool-footer">
                  <div class="price-stock">
                    <span class="price">¥{{ tool.price }}</span>
                    <span class="stock">库存：{{ tool.stock }}</span>
                  </div>
                  <el-button type="primary" @click="handleConsult(tool)">
                    <el-icon><ChatDotRound /></el-icon>
                    咨询采购
                  </el-button>
                </div>
              </div>
            </div>

            <div v-if="recommendations.length > 0" class="report-actions">
              <el-button type="success" size="large" @click="generateReport">
                <el-icon><Document /></el-icon>
                生成匹配报告
              </el-button>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useToolBrandDatabaseStore } from '@/store/toolBrandDatabase'
import { ElMessage } from 'element-plus'
import {
  Setting,
  Search,
  MagicStick,
  RefreshRight,
  Collection,
  Star,
  Check,
  ChatDotRound,
  Document
} from '@element-plus/icons-vue'

const toolBrandStore = useToolBrandDatabaseStore()

const loading = ref(false)
const recommendations = ref([])

// 匹配条件
const matchCriteria = reactive({
  brand: '',
  toolType: '',
  controlType: '',
  torqueRange: '',
  requiredTorque: '',
  portable: null,
  digital: null
})

// 获取控制类型颜色
const getControlTypeColor = (type) => {
  const colors = {
    '离合器': 'success',
    '油压脉冲': 'danger',
    '电脉冲': 'warning',
    '直驱': 'primary'
  }
  return colors[type] || 'info'
}

// 智能匹配
const handleMatch = () => {
  loading.value = true

  setTimeout(() => {
    recommendations.value = toolBrandStore.recommendTools(matchCriteria)
    loading.value = false

    if (recommendations.value.length > 0) {
      ElMessage.success(`为您找到 ${recommendations.value.length} 个匹配工具`)
    } else {
      ElMessage.warning('未找到匹配的工具，请调整匹配条件')
    }
  }, 500)
}

// 自动填充示例
const autoFillExample = () => {
  Object.assign(matchCriteria, {
    brand: 'EQTCF',
    toolType: '锂电池',
    controlType: '电脉冲',
    torqueRange: '6-12Nm',
    requiredTorque: '10',
    portable: true,
    digital: true
  })

  ElMessage.success('已自动填充汽车装配示例场景')
}

// 重置表单
const resetForm = () => {
  Object.assign(matchCriteria, {
    brand: '',
    toolType: '',
    controlType: '',
    torqueRange: '',
    requiredTorque: '',
    portable: null,
    digital: null
  })
  recommendations.value = []
  ElMessage.info('已重置匹配条件')
}

// 咨询采购
const handleConsult = (tool) => {
  const message = `
咨询工具采购

品牌：${tool.brand}
型号：${tool.model}
名称：${tool.name}

工具类型：${tool.toolType}
控制类型：${tool.controlType}
扭矩范围：${tool.torqueRange}
供电方式：${tool.specifications.power}
重量：${tool.specifications.weight}
转速：${tool.specifications.speed}

特性：${tool.features.portable ? '便携 ' : ''}${tool.features.digital ? '数字化 ' : ''}${tool.features.adjustable ? '可调节' : ''}

我想了解更多关于这款工具的信息和采购事宜。
  `.trim()

  console.log('咨询信息：', message)
  ElMessage.success('已生成咨询信息，可联系销售人员')
}

// 生成匹配报告
const generateReport = () => {
  let report = '品牌型号匹配报告\n'
  report += '='.repeat(50) + '\n\n'
  
  report += '匹配条件：\n'
  report += '-'.repeat(50) + '\n'
  report += `工具品牌：${matchCriteria.brand || '不限'}\n`
  report += `工具类型：${matchCriteria.toolType || '不限'}\n`
  report += `控制类型：${matchCriteria.controlType || '不限'}\n`
  report += `扭矩范围：${matchCriteria.torqueRange || '不限'}\n`
  report += `需求扭矩：${matchCriteria.requiredTorque ? matchCriteria.requiredTorque + 'Nm' : '未填写'}\n`
  report += `便携性要求：${matchCriteria.portable === null ? '不限' : (matchCriteria.portable ? '便携' : '固定')}\n`
  report += `数字化要求：${matchCriteria.digital === null ? '不限' : (matchCriteria.digital ? '数字化' : '传统型')}\n\n`

  report += '匹配结果：\n'
  report += '='.repeat(50) + '\n\n'

  recommendations.value.forEach((tool, index) => {
    report += `${index + 1}. ${tool.model} - ${tool.name}\n`
    report += '-'.repeat(50) + '\n'
    report += `品牌：${tool.brand}\n`
    report += `工具类型：${tool.toolType}\n`
    report += `控制类型：${tool.controlType}\n`
    report += `扭矩范围：${tool.torqueRange}\n`
    report += `扭矩详情：${tool.specifications.minTorque}-${tool.specifications.maxTorque} ${tool.specifications.unit}\n`
    report += `供电方式：${tool.specifications.power}\n`
    if (tool.specifications.voltage) {
      report += `电压：${tool.specifications.voltage}\n`
    }
    report += `重量：${tool.specifications.weight}\n`
    report += `转速：${tool.specifications.speed}\n`
    report += `特性：${tool.features.portable ? '便携 ' : ''}${tool.features.adjustable ? '可调节 ' : ''}${tool.features.digital ? '数字化 ' : ''}\n`
    report += `价格：¥${tool.price}\n`
    report += `库存：${tool.stock}\n`
    report += `描述：${tool.description}\n`
    if (tool.applications && tool.applications.length > 0) {
      report += `应用场景：${tool.applications.join('、')}\n`
    }
    report += '\n'
  })

  report += '='.repeat(50) + '\n'
  report += `生成时间：${new Date().toLocaleString()}\n`

  // 下载报告
  const blob = new Blob([report], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `品牌型号匹配报告_${matchCriteria.brand || '全部'}_${new Date().getTime()}.txt`
  link.click()
  URL.revokeObjectURL(url)

  ElMessage.success('匹配报告已生成并下载')
}
</script>

<style scoped>
.tool-brand-match {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-header {
  padding: 60px 0;
  text-align: center;
  color: white;
}

.page-header h1 {
  font-size: 42px;
  margin: 0 0 16px 0;
  font-weight: 700;
}

.subtitle {
  font-size: 18px;
  opacity: 0.9;
  margin: 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px 60px;
}

.match-content {
  display: grid;
  grid-template-columns: 500px 1fr;
  gap: 24px;
  margin-top: -30px;
}

.config-panel,
.result-panel {
  height: fit-content;
}

.config-card,
.result-card {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
}

.result-count {
  margin-left: auto;
}

.config-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #eee;
}

.config-section:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
}

.config-section h3 {
  font-size: 16px;
  margin: 0 0 16px 0;
  color: #303133;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.action-buttons .el-button {
  flex: 1;
}

.empty-state {
  padding: 60px 20px;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tool-card {
  border: 2px solid #eee;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s;
  background: white;
}

.tool-card:hover {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
  transform: translateY(-2px);
}

.tool-card.best-match {
  border-color: #67c23a;
  background: linear-gradient(to right, #f0f9ff, #ffffff);
}

.tool-header {
  margin-bottom: 20px;
}

.tool-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.tool-title h3 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.tool-name {
  font-size: 16px;
  color: #606266;
  font-weight: 500;
  margin-bottom: 8px;
}

.tool-brand-type {
  display: flex;
  gap: 8px;
}

.tool-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.info-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.info-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-group label {
  color: #909399;
  font-size: 14px;
}

.info-group span {
  color: #303133;
  font-size: 14px;
  font-weight: 500;
}

.tool-features {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.tool-description {
  margin-bottom: 16px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 6px;
}

.tool-description p {
  margin: 0;
  color: #606266;
  line-height: 1.6;
}

.tool-applications {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.tool-applications label {
  color: #909399;
  font-size: 14px;
}

.tool-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.price-stock {
  display: flex;
  gap: 24px;
  align-items: center;
}

.price {
  font-size: 24px;
  color: #f56c6c;
  font-weight: 700;
}

.stock {
  color: #909399;
  font-size: 14px;
}

.report-actions {
  margin-top: 24px;
  text-align: center;
}

@media (max-width: 1200px) {
  .match-content {
    grid-template-columns: 1fr;
  }
}
</style>
