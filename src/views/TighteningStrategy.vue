<template>
  <div class="tightening-strategy-page">
    <Header />
    
    <!-- 页面标题 -->
    <section class="page-header">
      <div class="container">
        <div class="header-content">
          <el-icon :size="48" color="#fff"><Guide /></el-icon>
          <h1>拧紧策略优化</h1>
          <p>智能分析拧紧顺序和方法，提升装配质量与效率</p>
        </div>
      </div>
    </section>

    <!-- 主内容区 -->
    <section class="main-content">
      <div class="container">
        <el-row :gutter="24">
          <!-- 左侧：配置面板 -->
          <el-col :span="8">
            <el-card class="config-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <el-icon><Setting /></el-icon>
                  <span>配置参数</span>
                </div>
              </template>

              <el-form :model="configParams" label-width="100px" label-position="top">
                <el-form-item label="应用场景">
                  <el-select v-model="configParams.application" placeholder="选择应用场景" clearable>
                    <el-option label="汽车发动机装配" value="汽车发动机装配" />
                    <el-option label="汽车车轮装配" value="汽车车轮装配" />
                    <el-option label="变速箱装配" value="变速箱装配" />
                    <el-option label="汽车底盘装配" value="汽车底盘装配" />
                    <el-option label="新能源汽车电池装配" value="新能源汽车电池装配" />
                  </el-select>
                </el-form-item>

                <el-form-item label="螺栓数量">
                  <el-input-number v-model="configParams.boltCount" :min="2" :max="30" :step="1" style="width: 100%" />
                </el-form-item>

                <el-form-item label="质量要求">
                  <el-select v-model="configParams.quality" placeholder="选择质量要求">
                    <el-option label="关键件（Critical）" value="critical" />
                    <el-option label="重要件（Important）" value="important" />
                    <el-option label="一般件（Normal）" value="normal" />
                  </el-select>
                </el-form-item>

                <el-form-item label="目标扭矩范围（Nm）">
                  <el-slider v-model="configParams.torqueRange" range :min="0" :max="200" :marks="torqueMarks" />
                  <div class="range-display">{{ configParams.torqueRange[0] }} - {{ configParams.torqueRange[1] }} Nm</div>
                </el-form-item>

                <el-form-item label="成本预算">
                  <el-radio-group v-model="configParams.budget">
                    <el-radio label="low">经济型</el-radio>
                    <el-radio label="medium">标准型</el-radio>
                    <el-radio label="high">高端型</el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-divider />

                <div class="button-group">
                  <el-button type="primary" size="large" :icon="Search" @click="searchStrategy" style="width: 100%">
                    智能推荐策略
                  </el-button>
                  <el-button size="large" :icon="RefreshRight" @click="resetConfig" style="width: 100%">
                    重置配置
                  </el-button>
                  <el-button size="large" :icon="MagicStick" @click="fillExample" style="width: 100%">
                    示例场景
                  </el-button>
                </div>
              </el-form>
            </el-card>

            <!-- 拧紧方法对比 -->
            <el-card class="method-card" shadow="hover" style="margin-top: 20px">
              <template #header>
                <div class="card-header">
                  <el-icon><TrendCharts /></el-icon>
                  <span>拧紧方法对比</span>
                </div>
              </template>
              <div class="method-comparison">
                <div v-for="method in strategyStore.methods" :key="method.id" class="method-item">
                  <div class="method-name">
                    <el-tag :type="method.cost === 'low' ? 'success' : method.cost === 'medium' ? 'warning' : 'danger'" size="small">
                      {{ method.name }}
                    </el-tag>
                  </div>
                  <div class="method-accuracy">精度: {{ method.accuracy }}</div>
                  <div class="method-advantages">
                    <el-text size="small" type="success">✓ {{ method.advantages.join(', ') }}</el-text>
                  </div>
                </div>
              </div>
            </el-card>
          </el-col>

          <!-- 右侧：推荐结果 -->
          <el-col :span="16">
            <!-- 空状态 -->
            <el-empty v-if="recommendations.length === 0" description="请配置参数后点击智能推荐策略获取建议" :image-size="200">
              <el-button type="primary" @click="fillExample">查看示例</el-button>
            </el-empty>

            <!-- 推荐结果列表 -->
            <div v-else class="recommendations-list">
              <div v-for="(strategy, index) in recommendations" :key="strategy.id" class="strategy-card">
                <!-- 最佳推荐标识 -->
                <div v-if="index === 0" class="best-badge">
                  <el-icon><Star /></el-icon>
                  最佳推荐
                </div>

                <el-card shadow="hover">
                  <div class="strategy-header">
                    <div class="strategy-title">
                      <h3>{{ strategy.name }}</h3>
                      <div class="strategy-badges">
                        <el-tag :type="strategy.difficulty === 'high' ? 'danger' : strategy.difficulty === 'medium' ? 'warning' : 'success'" size="small">
                          难度: {{ difficultyText(strategy.difficulty) }}
                        </el-tag>
                        <el-tag :type="strategy.quality === 'critical' ? 'danger' : 'warning'" size="small">
                          {{ qualityText(strategy.quality) }}
                        </el-tag>
                        <el-tag type="info" size="small">匹配度: {{ strategy.matchScore }}%</el-tag>
                      </div>
                    </div>
                  </div>

                  <el-divider />

                  <el-row :gutter="16">
                    <!-- 基本参数 -->
                    <el-col :span="12">
                      <div class="info-section">
                        <h4><el-icon><DataAnalysis /></el-icon> 基本参数</h4>
                        <div class="info-grid">
                          <div class="info-item">
                            <span class="label">螺栓数量:</span>
                            <span class="value">{{ strategy.boltCount }} 个</span>
                          </div>
                          <div class="info-item">
                            <span class="label">拧紧模式:</span>
                            <span class="value">{{ strategy.pattern }}</span>
                          </div>
                          <div class="info-item">
                            <span class="label">拧紧方法:</span>
                            <span class="value">{{ strategy.method }}</span>
                          </div>
                          <div class="info-item">
                            <span class="label">目标扭矩:</span>
                            <span class="value">{{ strategy.targetTorque }} Nm</span>
                          </div>
                          <div class="info-item">
                            <span class="label">目标角度:</span>
                            <span class="value">{{ strategy.targetAngle }}°</span>
                          </div>
                          <div class="info-item">
                            <span class="label">扭矩公差:</span>
                            <span class="value">±{{ strategy.tolerance }} Nm</span>
                          </div>
                        </div>
                      </div>
                    </el-col>

                    <!-- 拧紧顺序可视化 -->
                    <el-col :span="12">
                      <div class="info-section">
                        <h4><el-icon><Grid /></el-icon> 拧紧顺序</h4>
                        <div class="sequence-visualization">
                          <svg width="300" height="300" viewBox="0 0 300 300">
                            <!-- 绘制连接线 -->
                            <g v-for="(conn, idx) in getVisualization(strategy).connections" :key="'conn-' + idx">
                              <line 
                                :x1="getPosition(strategy, conn.from).x" 
                                :y1="getPosition(strategy, conn.from).y"
                                :x2="getPosition(strategy, conn.to).x" 
                                :y2="getPosition(strategy, conn.to).y"
                                stroke="#d0d0d0" 
                                stroke-width="2" 
                                stroke-dasharray="5,5" />
                            </g>
                            <!-- 绘制螺栓点 -->
                            <g v-for="pos in getVisualization(strategy).positions" :key="'bolt-' + pos.id">
                              <circle 
                                :cx="pos.x" 
                                :cy="pos.y" 
                                r="20" 
                                :fill="pos.order === 1 ? '#67c23a' : '#409eff'" 
                                stroke="#fff" 
                                stroke-width="2" />
                              <text 
                                :x="pos.x" 
                                :y="pos.y + 5" 
                                text-anchor="middle" 
                                fill="#fff" 
                                font-size="14" 
                                font-weight="bold">
                                {{ pos.order }}
                              </text>
                            </g>
                          </svg>
                          <div class="sequence-text">
                            顺序: {{ strategy.sequence.join(' → ') }}
                          </div>
                        </div>
                      </div>
                    </el-col>
                  </el-row>

                  <el-divider />

                  <!-- 拧紧阶段 -->
                  <div class="info-section">
                    <h4><el-icon><Timer /></el-icon> 拧紧阶段</h4>
                    <el-timeline>
                      <el-timeline-item 
                        v-for="stage in strategy.stages" 
                        :key="stage.stage"
                        :color="stage.stage === strategy.stages.length ? '#67c23a' : '#409eff'">
                        <div class="stage-item">
                          <div class="stage-header">
                            <strong>阶段 {{ stage.stage }}: {{ stage.description }}</strong>
                          </div>
                          <div class="stage-params">
                            <el-tag size="small">扭矩: {{ stage.torque }} Nm</el-tag>
                            <el-tag size="small" v-if="stage.angle > 0">角度: {{ stage.angle }}°</el-tag>
                            <el-tag size="small" :type="stage.speed === 'slow' ? 'danger' : stage.speed === 'medium' ? 'warning' : 'success'">
                              速度: {{ speedText(stage.speed) }}
                            </el-tag>
                          </div>
                        </div>
                      </el-timeline-item>
                    </el-timeline>
                  </div>

                  <el-divider />

                  <!-- 操作要点 -->
                  <el-row :gutter="16">
                    <el-col :span="12">
                      <div class="info-section">
                        <h4><el-icon><Checked /></el-icon> 操作要点</h4>
                        <ul class="tips-list">
                          <li v-for="(tip, idx) in strategy.tips" :key="idx">
                            <el-icon color="#67c23a"><Select /></el-icon>
                            {{ tip }}
                          </li>
                        </ul>
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <div class="info-section">
                        <h4><el-icon><Warning /></el-icon> 注意事项</h4>
                        <ul class="warnings-list">
                          <li v-for="(warning, idx) in strategy.warnings" :key="idx">
                            <el-icon color="#f56c6c"><WarningFilled /></el-icon>
                            {{ warning }}
                          </li>
                        </ul>
                      </div>
                    </el-col>
                  </el-row>

                  <el-divider />

                  <!-- 操作按钮 -->
                  <div class="action-buttons">
                    <el-button type="primary" :icon="Download" @click="downloadStrategy(strategy)">
                      下载策略文档
                    </el-button>
                    <el-button :icon="ChatDotRound" @click="consultStrategy(strategy)">
                      咨询专家
                    </el-button>
                    <el-button :icon="Share" @click="shareStrategy(strategy)">
                      分享策略
                    </el-button>
                  </div>
                </el-card>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Search, RefreshRight, MagicStick, Guide, Setting, TrendCharts, 
  DataAnalysis, Grid, Timer, Checked, Warning, Star, Download, 
  ChatDotRound, Share, Select, WarningFilled
} from '@element-plus/icons-vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import { useTighteningStrategyStore } from '../store/tighteningStrategy'

const strategyStore = useTighteningStrategyStore()

// 配置参数
const configParams = ref({
  application: '',
  boltCount: 8,
  quality: 'important',
  torqueRange: [20, 100],
  budget: 'medium'
})

// 扭矩刻度
const torqueMarks = {
  0: '0',
  50: '50',
  100: '100',
  150: '150',
  200: '200 Nm'
}

// 推荐结果
const recommendations = ref([])

// 智能推荐策略
const searchStrategy = () => {
  const results = strategyStore.recommendStrategy(configParams.value)
  
  if (results.length === 0) {
    ElMessage.warning('未找到匹配的策略，请调整筛选条件')
    return
  }
  
  recommendations.value = results
  ElMessage.success(`找到 ${results.length} 个匹配策略`)
}

// 重置配置
const resetConfig = () => {
  configParams.value = {
    application: '',
    boltCount: 8,
    quality: 'important',
    torqueRange: [20, 100],
    budget: 'medium'
  }
  recommendations.value = []
  ElMessage.info('配置已重置')
}

// 填充示例
const fillExample = () => {
  configParams.value = {
    application: '汽车发动机装配',
    boltCount: 10,
    quality: 'critical',
    torqueRange: [70, 90],
    budget: 'high'
  }
  searchStrategy()
  ElMessage.success('已加载发动机缸盖螺栓示例')
}

// 难度文本
const difficultyText = (difficulty) => {
  const map = { high: '高', medium: '中', low: '低' }
  return map[difficulty] || difficulty
}

// 质量文本
const qualityText = (quality) => {
  const map = { critical: '关键件', important: '重要件', normal: '一般件' }
  return map[quality] || quality
}

// 速度文本
const speedText = (speed) => {
  const map = { fast: '快速', medium: '中速', slow: '慢速' }
  return map[speed] || speed
}

// 获取可视化数据
const getVisualization = (strategy) => {
  return strategyStore.generateSequenceVisualization(strategy)
}

// 获取螺栓位置
const getPosition = (strategy, boltId) => {
  const vis = getVisualization(strategy)
  return vis.positions.find(p => p.id === boltId) || { x: 0, y: 0 }
}

// 下载策略文档
const downloadStrategy = (strategy) => {
  const content = `
拧紧策略文档
================

策略名称: ${strategy.name}
应用场景: ${strategy.application}

一、基本参数
-----------------
螺栓数量: ${strategy.boltCount} 个
拧紧模式: ${strategy.pattern}
拧紧方法: ${strategy.method}
目标扭矩: ${strategy.targetTorque} Nm
目标角度: ${strategy.targetAngle}°
扭矩公差: ±${strategy.tolerance} Nm
质量要求: ${qualityText(strategy.quality)}
操作难度: ${difficultyText(strategy.difficulty)}

二、拧紧顺序
-----------------
顺序: ${strategy.sequence.join(' → ')}

三、拧紧阶段
-----------------
${strategy.stages.map((stage, idx) => `
阶段${stage.stage}: ${stage.description}
  - 扭矩: ${stage.torque} Nm
  - 角度: ${stage.angle}°
  - 速度: ${speedText(stage.speed)}
`).join('\n')}

四、操作要点
-----------------
${strategy.tips.map((tip, idx) => `${idx + 1}. ${tip}`).join('\n')}

五、注意事项
-----------------
${strategy.warnings.map((warning, idx) => `⚠️ ${warning}`).join('\n')}

==================
生成时间: ${new Date().toLocaleString()}
来源: 明升伟业智能拧紧策略系统
==================
`

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `拧紧策略_${strategy.name}_${Date.now()}.txt`
  link.click()
  URL.revokeObjectURL(url)
  
  ElMessage.success('策略文档已下载')
}

// 咨询专家
const consultStrategy = (strategy) => {
  const message = `我想咨询关于"${strategy.name}"的拧紧策略，应用场景是${strategy.application}，螺栓数量${strategy.boltCount}个。`
  ElMessage.info(`咨询信息已生成: ${message}`)
  // TODO: 可以集成到在线客服或生成询价单
}

// 分享策略
const shareStrategy = (strategy) => {
  const shareText = `拧紧策略推荐: ${strategy.name}\n应用: ${strategy.application}\n方法: ${strategy.method}\n顺序: ${strategy.sequence.join('→')}`
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(shareText).then(() => {
      ElMessage.success('策略信息已复制到剪贴板')
    })
  } else {
    ElMessage.info('分享功能: ' + shareText)
  }
}
</script>

<style scoped>
.tightening-strategy-page {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 页面标题 */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 60px 0;
  color: #fff;
}

.header-content {
  text-align: center;
}

.header-content h1 {
  font-size: 36px;
  font-weight: 700;
  margin: 16px 0 12px;
}

.header-content p {
  font-size: 16px;
  opacity: 0.95;
}

/* 主内容 */
.main-content {
  padding: 40px 0 80px;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 卡片样式 */
.config-card, .method-card {
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
}

/* 按钮组 */
.button-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.range-display {
  text-align: center;
  margin-top: 8px;
  color: #666;
  font-weight: 500;
}

/* 方法对比 */
.method-comparison {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.method-item {
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
  border-left: 3px solid #409eff;
}

.method-name {
  margin-bottom: 6px;
}

.method-accuracy {
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
}

.method-advantages {
  font-size: 12px;
}

/* 推荐结果 */
.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.strategy-card {
  position: relative;
}

.best-badge {
  position: absolute;
  top: -10px;
  right: 20px;
  z-index: 10;
  background: linear-gradient(135deg, #67c23a 0%, #85ce61 100%);
  color: #fff;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.4);
}

.strategy-header {
  margin-bottom: 16px;
}

.strategy-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.strategy-title h3 {
  font-size: 22px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.strategy-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 信息区域 */
.info-section {
  margin-bottom: 20px;
}

.info-section h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 6px;
}

.info-item .label {
  color: #666;
  font-size: 14px;
}

.info-item .value {
  color: #1a1a1a;
  font-weight: 500;
  font-size: 14px;
}

/* 顺序可视化 */
.sequence-visualization {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sequence-text {
  margin-top: 12px;
  font-size: 13px;
  color: #666;
  text-align: center;
}

/* 阶段时间轴 */
.stage-item {
  padding: 8px 0;
}

.stage-header {
  margin-bottom: 8px;
}

.stage-params {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 列表样式 */
.tips-list, .warnings-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li, .warnings-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 0;
  font-size: 14px;
  line-height: 1.6;
}

.tips-list li {
  color: #333;
}

.warnings-list li {
  color: #f56c6c;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
