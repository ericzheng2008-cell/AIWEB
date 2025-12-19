<template>
  <div class="socket-selector">
    <div class="page-header">
      <div class="container">
        <h1>智能套筒选型系统</h1>
        <p class="subtitle">根据工位需求，为您推荐最合适的套筒配置方案</p>
      </div>
    </div>

    <div class="container">
      <div class="selector-content">
        <!-- 左侧：选型配置 -->
        <div class="config-panel">
          <el-card class="config-card">
            <template #header>
              <div class="card-header">
                <el-icon><Setting /></el-icon>
                <span>选型配置</span>
              </div>
            </template>

            <!-- 基本信息 -->
            <div class="config-section">
              <h3>基本信息</h3>
              <el-form :model="selectionCriteria" label-width="120px">
                <el-form-item label="工位名称">
                  <el-input v-model="selectionCriteria.workstation" placeholder="如：门盖工位" />
                </el-form-item>

                <el-form-item label="工具品牌">
                  <el-select v-model="selectionCriteria.brand" placeholder="请选择品牌">
                    <el-option label="Atlascopco" value="Atlascopco" />
                    <el-option label="其他" value="其他" />
                  </el-select>
                </el-form-item>

                <el-form-item label="工具类型">
                  <el-select v-model="selectionCriteria.toolType" placeholder="请选择工具类型">
                    <el-option label="油压脉冲" value="油压脉冲" />
                    <el-option label="其他" value="其他" />
                  </el-select>
                </el-form-item>

                <el-form-item label="工具型号">
                  <el-input v-model="selectionCriteria.toolModel" placeholder="如：ETBP45-10" />
                </el-form-item>

                <el-form-item label="四方尺寸">
                  <el-select v-model="selectionCriteria.squareSize" placeholder="请选择四方尺寸">
                    <el-option label="1/4快换" value="1/4快换" />
                    <el-option label="1/4四方" value="1/4四方" />
                    <el-option label="3/8四方" value="3/8四方" />
                    <el-option label="1/2四方" value="1/2四方" />
                    <el-option label="3/4四方" value="3/4四方" />
                    <el-option label="1寸四方" value="1寸四方" />
                  </el-select>
                </el-form-item>
              </el-form>
            </div>

            <!-- 套筒参数 -->
            <div class="config-section">
              <h3>套筒参数</h3>
              <el-form :model="selectionCriteria" label-width="120px">
                <el-form-item label="外形">
                  <el-select v-model="selectionCriteria.socketShape" placeholder="请选择外形">
                    <el-option label="标准" value="标准" />
                    <el-option label="加长" value="加长" />
                    <el-option label="接杆" value="接杆" />
                  </el-select>
                </el-form-item>

                <el-form-item label="输入端类型">
                  <el-select v-model="selectionCriteria.inputType" placeholder="请选择输入端类型">
                    <el-option label="外六角" value="外六角" />
                    <el-option label="内六角" value="内六角" />
                    <el-option label="内六星" value="内六星" />
                    <el-option label="Torx" value="Torx" />
                    <el-option label="十字" value="十字" />
                    <el-option label="一字" value="一字" />
                  </el-select>
                </el-form-item>

                <el-form-item label="输出端对边尺寸">
                  <el-input v-model="selectionCriteria.inputSize" placeholder="如：15mm 或 T25">
                    <template #append>mm</template>
                  </el-input>
                </el-form-item>

                <el-form-item label="磁性要求">
                  <el-select v-model="selectionCriteria.magnetic" placeholder="请选择磁性">
                    <el-option label="固定磁" value="固定磁" />
                    <el-option label="伸缩磁" value="伸缩磁" />
                    <el-option label="中空磁" value="中空磁" />
                    <el-option label="外置磁环" value="外置磁环" />
                    <el-option label="无磁性" value="无磁性" />
                  </el-select>
                </el-form-item>

                <el-form-item label="长度要求">
                  <el-input v-model="selectionCriteria.lengthRequirement" placeholder="如：150" type="number">
                    <template #append>mm</template>
                  </el-input>
                </el-form-item>
              </el-form>
            </div>

            <!-- 特殊要求 -->
            <div class="config-section">
              <h3>特殊要求</h3>
              <el-form :model="selectionCriteria" label-width="120px">
                <el-form-item label="是否抗振">
                  <el-switch v-model="selectionCriteria.antiVibration" />
                </el-form-item>

                <el-form-item label="密封圈销子">
                  <el-switch v-model="selectionCriteria.sealRingPin" />
                </el-form-item>
              </el-form>
            </div>

            <div class="action-buttons">
              <el-button type="primary" size="large" @click="handleRecommend" :loading="loading">
                <el-icon><Search /></el-icon>
                智能推荐
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

        <!-- 右侧：推荐结果 -->
        <div class="result-panel">
          <el-card class="result-card">
            <template #header>
              <div class="card-header">
                <el-icon><Box /></el-icon>
                <span>推荐结果</span>
                <el-tag v-if="recommendations.length > 0" type="success" class="result-count">
                  共 {{ recommendations.length }} 个匹配项
                </el-tag>
              </div>
            </template>

            <div v-if="recommendations.length === 0" class="empty-state">
              <el-empty description="请在左侧配置选型条件，点击智能推荐查看结果" />
            </div>

            <div v-else class="recommendations-list">
              <div
                v-for="(socket, index) in recommendations"
                :key="socket.id"
                class="socket-card"
                :class="{ 'best-match': index === 0 }"
              >
                <div class="socket-header">
                  <div class="socket-title">
                    <h3>{{ socket.model }}</h3>
                    <el-tag v-if="index === 0" type="success" effect="dark" size="large">
                      <el-icon><Star /></el-icon>
                      最佳推荐
                    </el-tag>
                  </div>
                  <div class="socket-name">{{ socket.fullName || socket.name }}</div>
                </div>

                <div class="socket-info">
                  <div class="info-group">
                    <label>品牌：</label>
                    <span>{{ socket.brand }}</span>
                  </div>
                  <div class="info-group">
                    <label>工具类型：</label>
                    <span>{{ socket.toolType }}</span>
                  </div>
                  <div class="info-group">
                    <label>四方尺寸：</label>
                    <span>{{ socket.squareSize }}</span>
                  </div>
                  <div class="info-group">
                    <label>输入端：</label>
                    <span>{{ socket.specifications.inputEnd }}</span>
                  </div>
                  <div class="info-group">
                    <label>输出端：</label>
                    <span>{{ socket.specifications.outputEnd }} {{ socket.specifications.size }}</span>
                  </div>
                  <div class="info-group">
                    <label>长度：</label>
                    <span>{{ socket.specifications.length }}</span>
                  </div>
                  <div class="info-group">
                    <label>磁性：</label>
                    <el-tag type="primary" size="small">{{ socket.socketType.magnetic }}</el-tag>
                  </div>
                </div>

                <div class="socket-features">
                  <el-tag v-if="socket.features.antiVibration" type="success" size="small">
                    <el-icon><Check /></el-icon>
                    抗振
                  </el-tag>
                  <el-tag v-if="socket.features.sealRingPin" type="warning" size="small">
                    <el-icon><Check /></el-icon>
                    密封圈销子
                  </el-tag>
                  <el-tag type="info" size="small">{{ socket.socketType.shape }}</el-tag>
                  <el-tag type="info" size="small">{{ socket.socketType.inputType }}</el-tag>
                </div>

                <div class="socket-description">
                  <p>{{ socket.description }}</p>
                </div>

                <div v-if="socket.applications && socket.applications.length > 0" class="socket-applications">
                  <label>应用场景：</label>
                  <el-tag
                    v-for="app in socket.applications"
                    :key="app"
                    type="info"
                    effect="plain"
                    size="small"
                  >
                    {{ app }}
                  </el-tag>
                </div>

                <div class="socket-footer">
                  <div class="price-stock">
                    <span class="price">¥{{ socket.price }}</span>
                    <span class="stock">库存：{{ socket.stock }}</span>
                  </div>
                  <el-button type="primary" @click="handleConsult(socket)">
                    <el-icon><ChatDotRound /></el-icon>
                    咨询选型
                  </el-button>
                </div>
              </div>
            </div>

            <div v-if="recommendations.length > 0" class="report-actions">
              <el-button type="success" size="large" @click="generateReport">
                <el-icon><Document /></el-icon>
                生成选型报告
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
import { useSocketDatabaseStore } from '@/store/socketDatabase'
import { ElMessage } from 'element-plus'
import {
  Setting,
  Search,
  MagicStick,
  RefreshRight,
  Box,
  Star,
  Check,
  ChatDotRound,
  Document
} from '@element-plus/icons-vue'

const socketStore = useSocketDatabaseStore()

const loading = ref(false)
const recommendations = ref([])

// 选型条件
const selectionCriteria = reactive({
  workstation: '',
  brand: '',
  toolType: '',
  toolModel: '',
  squareSize: '',
  socketShape: '',
  inputType: '',
  inputSize: '',
  magnetic: '',
  lengthRequirement: '',
  antiVibration: false,
  sealRingPin: false
})

// 智能推荐
const handleRecommend = () => {
  loading.value = true

  setTimeout(() => {
    recommendations.value = socketStore.recommendSockets(selectionCriteria)
    loading.value = false

    if (recommendations.value.length > 0) {
      ElMessage.success(`为您找到 ${recommendations.value.length} 个匹配套筒`)
    } else {
      ElMessage.warning('未找到匹配的套筒，请调整选型条件')
    }
  }, 500)
}

// 自动填充示例
const autoFillExample = () => {
  Object.assign(selectionCriteria, {
    workstation: '门盖工位',
    brand: 'Atlascopco',
    toolType: '油压脉冲',
    toolModel: 'ETBP45-10',
    squareSize: '3/8四方',
    socketShape: '标准',
    inputType: '外六角',
    inputSize: '15',
    magnetic: '固定磁',
    lengthRequirement: '150',
    antiVibration: true,
    sealRingPin: false
  })

  ElMessage.success('已自动填充门盖工位示例场景')
}

// 重置表单
const resetForm = () => {
  Object.assign(selectionCriteria, {
    workstation: '',
    brand: '',
    toolType: '',
    toolModel: '',
    squareSize: '',
    socketShape: '',
    inputType: '',
    inputSize: '',
    magnetic: '',
    lengthRequirement: '',
    antiVibration: false,
    sealRingPin: false
  })
  recommendations.value = []
  ElMessage.info('已重置选型条件')
}

// 咨询选型
const handleConsult = (socket) => {
  const message = `
咨询套筒选型

工位名称：${selectionCriteria.workstation || '未填写'}
工具类型：${selectionCriteria.toolType || '未填写'}
工具型号：${selectionCriteria.toolModel || '未填写'}

推荐套筒：
型号：${socket.model}
名称：${socket.fullName || socket.name}
品牌：${socket.brand}
规格：${socket.specifications.inputEnd} → ${socket.specifications.outputEnd} ${socket.specifications.size}
长度：${socket.specifications.length}
磁性：${socket.socketType.magnetic}
特性：${socket.features.antiVibration ? '抗振 ' : ''}${socket.features.sealRingPin ? '密封圈销子' : ''}

我想了解更多关于这款套筒的信息。
  `.trim()

  console.log('咨询信息：', message)
  ElMessage.success('已生成咨询信息，可联系销售人员')
}

// 生成选型报告
const generateReport = () => {
  let report = '套筒选型报告\n'
  report += '=' . repeat(50) + '\n\n'
  
  report += '选型条件：\n'
  report += '-'.repeat(50) + '\n'
  report += `工位名称：${selectionCriteria.workstation || '未填写'}\n`
  report += `工具品牌：${selectionCriteria.brand || '未填写'}\n`
  report += `工具类型：${selectionCriteria.toolType || '未填写'}\n`
  report += `工具型号：${selectionCriteria.toolModel || '未填写'}\n`
  report += `四方尺寸：${selectionCriteria.squareSize || '未填写'}\n`
  report += `套筒外形：${selectionCriteria.socketShape || '未填写'}\n`
  report += `输出端类型：${selectionCriteria.inputType || '未填写'}\n`
  report += `输出端对边尺寸：${selectionCriteria.inputSize || '未填写'}\n`
  report += `磁性要求：${selectionCriteria.magnetic || '未填写'}\n`
  report += `长度要求：${selectionCriteria.lengthRequirement ? selectionCriteria.lengthRequirement + 'mm' : '未填写'}\n`
  report += `是否抗振：${selectionCriteria.antiVibration ? '是' : '否'}\n`
  report += `密封圈销子：${selectionCriteria.sealRingPin ? '是' : '否'}\n\n`

  report += '推荐结果：\n'
  report += '='.repeat(50) + '\n\n'

  recommendations.value.forEach((socket, index) => {
    report += `${index + 1}. ${socket.model} - ${socket.fullName || socket.name}\n`
    report += '-'.repeat(50) + '\n'
    report += `品牌：${socket.brand}\n`
    report += `工具类型：${socket.toolType}\n`
    report += `四方尺寸：${socket.squareSize}\n`
    report += `输入端：${socket.specifications.inputEnd}\n`
    report += `输出端：${socket.specifications.outputEnd} ${socket.specifications.size}\n`
    report += `长度：${socket.specifications.length}\n`
    report += `磁性：${socket.socketType.magnetic}\n`
    report += `外形：${socket.socketType.shape}\n`
    report += `输入端类型：${socket.socketType.inputType}\n`
    report += `特性：${socket.features.antiVibration ? '抗振 ' : ''}${socket.features.sealRingPin ? '密封圈销子 ' : ''}\n`
    report += `价格：¥${socket.price}\n`
    report += `库存：${socket.stock}\n`
    report += `描述：${socket.description}\n`
    if (socket.applications && socket.applications.length > 0) {
      report += `应用场景：${socket.applications.join('、')}\n`
    }
    report += '\n'
  })

  report += '=' . repeat(50) + '\n'
  report += `生成时间：${new Date().toLocaleString()}\n`

  // 下载报告
  const blob = new Blob([report], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `套筒选型报告_${selectionCriteria.workstation || '未命名'}_${new Date().getTime()}.txt`
  link.click()
  URL.revokeObjectURL(url)

  ElMessage.success('选型报告已生成并下载')
}
</script>

<style scoped>
.socket-selector {
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

.selector-content {
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

.socket-card {
  border: 2px solid #eee;
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s;
  background: white;
}

.socket-card:hover {
  border-color: #409eff;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
  transform: translateY(-2px);
}

.socket-card.best-match {
  border-color: #67c23a;
  background: linear-gradient(to right, #f0f9ff, #ffffff);
}

.socket-header {
  margin-bottom: 20px;
}

.socket-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.socket-title h3 {
  margin: 0;
  font-size: 24px;
  color: #303133;
}

.socket-name {
  font-size: 16px;
  color: #606266;
  font-weight: 500;
}

.socket-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 16px;
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

.socket-features {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.socket-description {
  margin-bottom: 16px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 6px;
}

.socket-description p {
  margin: 0;
  color: #606266;
  line-height: 1.6;
}

.socket-applications {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.socket-applications label {
  color: #909399;
  font-size: 14px;
}

.socket-footer {
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
  .selector-content {
    grid-template-columns: 1fr;
  }
}
</style>
