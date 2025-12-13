<template>
  <div class="ai-agents-page">
    <Header />
    
    <!-- 顶部Banner -->
    <section class="hero-section">
      <div class="hero-content">
        <h1>AI智能体系统</h1>
        <p class="subtitle">基于人工智能的专业工业解决方案</p>
        <p class="description">通过AI技术提升工业效率，提供智能化的工具选型、设备监控、故障追踪和数据分析服务</p>
      </div>
    </section>

    <!-- 智能体列表 -->
    <section class="agents-section">
      <div class="container">
        <div class="agents-grid">
          <!-- 工具选型智能体 -->
          <div class="agent-card" @click="goToAgent('/tool-selector')">
            <div class="agent-icon">
              <el-icon :size="64"><Tools /></el-icon>
            </div>
            <h2>拧紧工具选型与工艺改进</h2>
            <p class="agent-desc">智能分析工艺需求，推荐最优拧紧工具方案，提供专业的工艺优化建议</p>
            <div class="agent-features">
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>AI智能推荐</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>工具匹配</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>工艺优化</span>
              </div>
            </div>
            <div class="agent-stats">
              <div class="stat-item">
                <div class="stat-value">98%</div>
                <div class="stat-label">匹配准确率</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">3分钟</div>
                <div class="stat-label">平均响应时间</div>
              </div>
            </div>
            <el-button type="primary" size="large" class="action-btn">
              立即使用
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
          </div>

          <!-- 设备状态查询 -->
          <div class="agent-card" @click="goToAgent('/device-status')">
            <div class="agent-icon">
              <el-icon :size="64"><Monitor /></el-icon>
            </div>
            <h2>设备在线状态查询</h2>
            <p class="agent-desc">实时监控设备运行状态，提供设备健康度评估和预警服务</p>
            <div class="agent-features">
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>实时监控</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>健康评估</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>智能预警</span>
              </div>
            </div>
            <div class="agent-stats">
              <div class="stat-item">
                <div class="stat-value">24/7</div>
                <div class="stat-label">全天候监控</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">99.9%</div>
                <div class="stat-label">在线率</div>
              </div>
            </div>
            <el-button type="primary" size="large" class="action-btn">
              立即使用
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
          </div>

          <!-- 设备生命周期管理 -->
          <div class="agent-card highlight" @click="goToAgent('/equipment-lifecycle')">
            <div class="badge">新功能</div>
            <div class="agent-icon">
              <el-icon :size="64"><Box /></el-icon>
            </div>
            <h2>设备全生命周期管理</h2>
            <p class="agent-desc">关键设备资产管理、ROI分析、保养预测、成本优化的全方位解决方案</p>
            <div class="agent-features">
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>设备档案</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>ROI分析</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>AI保养预测</span>
              </div>
            </div>
            <div class="agent-stats">
              <div class="stat-item">
                <div class="stat-value">6大类</div>
                <div class="stat-label">关键设备</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">30%↓</div>
                <div class="stat-label">降本空间</div>
              </div>
            </div>
            <el-button type="primary" size="large" class="action-btn">
              立即使用
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
          </div>

          <!-- 工单管理 -->
          <div class="agent-card" @click="goToAgent('/fault-tracking')">
            <div class="agent-icon">
              <el-icon :size="64"><List /></el-icon>
            </div>
            <h2>故障工单管理</h2>
            <p class="agent-desc">全流程工单管理系统，从创建到追踪到完成，全程数字化管理维修工单</p>
            <div class="agent-features">
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>工单创建</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>进度追踪</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>历史记录</span>
              </div>
            </div>
            <div class="agent-stats">
              <div class="stat-item">
                <div class="stat-value">2小时</div>
                <div class="stat-label">平均响应</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">95%</div>
                <div class="stat-label">按时完成率</div>
              </div>
            </div>
            <el-button type="primary" size="large" class="action-btn">
              立即使用
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
          </div>

          <!-- 拧紧曲线分析 -->
          <div class="agent-card" @click="goToAgent('/curve-analysis')">
            <div class="agent-icon">
              <el-icon :size="64"><TrendCharts /></el-icon>
            </div>
            <h2>拧紧曲线对比分析</h2>
            <p class="agent-desc">专业的拧紧曲线分析工具，支持多曲线对比、智能诊断和工艺优化建议</p>
            <div class="agent-features">
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>曲线对比</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>AI诊断</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>工艺建议</span>
              </div>
            </div>
            <div class="agent-stats">
              <div class="stat-item">
                <div class="stat-value">92%</div>
                <div class="stat-label">诊断准确率</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">5秒</div>
                <div class="stat-label">分析速度</div>
              </div>
            </div>
            <el-button type="primary" size="large" class="action-btn">
              立即使用
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>

        <!-- 附加功能卡片 -->
        <div class="additional-features">
          <h2 class="section-title">更多功能</h2>
          <div class="features-grid">
            <router-link to="/maintenance-history" class="feature-card">
              <el-icon :size="32"><Document /></el-icon>
              <h3>维修历史记录</h3>
              <p>查询历史维修记录，分析维修趋势</p>
            </router-link>
            <router-link to="/fault-statistics" class="feature-card">
              <el-icon :size="32"><DataAnalysis /></el-icon>
              <h3>故障率统计</h3>
              <p>全面的故障数据统计和分析</p>
            </router-link>
            <router-link to="/cost-optimization" class="feature-card">
              <el-icon :size="32"><Money /></el-icon>
              <h3>成本优化分析</h3>
              <p>基于数据的降本增效方案</p>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

const router = useRouter()

const goToAgent = (path) => {
  router.push(path)
}
</script>

<style scoped>
.ai-agents-page {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 顶部Banner */
.hero-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 0;
  color: #fff;
  text-align: center;
}

.hero-content h1 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
}

.hero-content .subtitle {
  font-size: 22px;
  margin-bottom: 16px;
  opacity: 0.95;
}

.hero-content .description {
  font-size: 16px;
  opacity: 0.9;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}

/* 智能体卡片区域 */
.agents-section {
  padding: 80px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.agents-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  margin-bottom: 80px;
}

.agent-card {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.agent-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: #1890ff;
}

.agent-card.highlight {
  border-color: #52c41a;
  background: linear-gradient(135deg, #fff 0%, #f6ffed 100%);
}

.badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #52c41a;
  color: #fff;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.agent-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  color: #fff;
}

.agent-card.highlight .agent-icon {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
}

.agent-card h2 {
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1a1a1a;
}

.agent-desc {
  font-size: 15px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 24px;
}

.agent-features {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #333;
  background: #f5f7fa;
  padding: 6px 12px;
  border-radius: 16px;
}

.feature-item .el-icon {
  color: #52c41a;
}

.agent-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
  padding: 20px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1890ff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #999;
}

.action-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}

/* 附加功能 */
.additional-features {
  margin-top: 60px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  margin-bottom: 40px;
  color: #1a1a1a;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.feature-card {
  background: #fff;
  padding: 32px 24px;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid #e8e8e8;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  border-color: #1890ff;
}

.feature-card .el-icon {
  color: #1890ff;
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1a1a1a;
}

.feature-card p {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .agents-grid {
    grid-template-columns: 1fr;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
