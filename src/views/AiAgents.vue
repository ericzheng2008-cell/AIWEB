<template>
  <div class="ai-agents-page">
    <Header />
    
    <!-- 顶部Banner - 优化版 -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="hero-particles"></div>
        <div class="hero-gradient"></div>
      </div>
      <div class="hero-content">
        <div class="hero-badge" data-aos="fade-down">
          <el-icon><MagicStick /></el-icon>
          <span>AI驱动的智能决策</span>
        </div>
          <h1 data-aos="fade-up" data-aos-delay="100">安彤智能体系统</h1>
        <p class="subtitle" data-aos="fade-up" data-aos-delay="200">基于人工智能的专业工业解决方案 | 自主学习·主动思考·持续进化</p>
        <p class="description" data-aos="fade-up" data-aos-delay="300">
          通过AI技术提升工业效率，提供智能化的工具选型、设备监控、故障追踪和数据分析服务
        </p>
        <div class="hero-stats" data-aos="fade-up" data-aos-delay="400">
          <div class="stat-box">
            <div class="stat-number">8+</div>
            <div class="stat-text">智能体</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">98%</div>
            <div class="stat-text">准确率</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">24/7</div>
            <div class="stat-text">在线服务</div>
          </div>
          <div class="stat-box">
            <div class="stat-number">1000+</div>
            <div class="stat-text">企业使用</div>
          </div>
        </div>
        <div class="hero-actions" data-aos="fade-up" data-aos-delay="500">
          <el-button type="primary" size="large" round @click="scrollToAgents">
            <el-icon><Pointer /></el-icon>
            探索智能体
          </el-button>
          <el-button size="large" round @click="showTour = true">
            <el-icon><VideoPlay /></el-icon>
            观看演示
          </el-button>
        </div>
      </div>
    </section>

    <!-- 智能体列表 -->
    <section class="agents-section" ref="agentsSection">
      <div class="container">
        <!-- 分类标签 -->
        <div class="category-tabs" data-aos="fade-up">
          <el-radio-group v-model="selectedCategory" size="large">
            <el-radio-button label="all">全部智能体</el-radio-button>
            <el-radio-button label="tool">工具选型</el-radio-button>
            <el-radio-button label="equipment">设备管理</el-radio-button>
            <el-radio-button label="analysis">数据分析</el-radio-button>
          </el-radio-group>
          <el-input 
            v-model="searchKeyword" 
            placeholder="搜索智能体..." 
            clearable
            style="width: 300px;">
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
        </div>
        
        <div class="agents-grid">
          <!-- 工具选型智能体 -->
          <div 
            class="agent-card" 
            @click="goToAgent('/tool-selector')"
            @mouseenter="onCardHover($event)"
            @mouseleave="onCardLeave($event)"
            data-aos="fade-up"
            data-aos-delay="100"
            data-category="tool">
            <div class="card-glow"></div>
            <div class="agent-icon">
              <el-icon :size="64"><Tools /></el-icon>
            </div>
            <el-tooltip content="查看使用教程" placement="top">
              <el-button 
                class="help-btn" 
                circle 
                size="small" 
                @click.stop="showHelp('tool-selector')">
                <el-icon><QuestionFilled /></el-icon>
              </el-button>
            </el-tooltip>
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


          <!-- 数字监控驾驶舱 -->
          <div 
            class="agent-card highlight" 
            @click="goToAgent('/equipment-dashboard')"
            @mouseenter="onCardHover($event)"
            @mouseleave="onCardLeave($event)"
            data-aos="fade-up"
            data-aos-delay="200"
            data-category="equipment">
            <div class="badge badge-new">
              <el-icon><Star /></el-icon>
              新功能
            </div>
            <div class="card-glow"></div>
            <div class="agent-icon">
              <el-icon :size="64"><DataAnalysis /></el-icon>
            </div>
            <el-tooltip content="查看使用教程" placement="top">
              <el-button 
                class="help-btn" 
                circle 
                size="small" 
                @click.stop="showHelp('equipment-dashboard')">
                <el-icon><QuestionFilled /></el-icon>
              </el-button>
            </el-tooltip>
            <h2>数字监控驾驶舱</h2>
            <p class="agent-desc">可视化数字监控中心，实时监控设备状态、维护流程、零配件订货状态的一站式管理平台</p>
            <div class="agent-features">
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>实时监控</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>可视化数据</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>智能预警</span>
              </div>
            </div>
            <div class="agent-stats">
              <div class="stat-item">
                <div class="stat-value">3个</div>
                <div class="stat-label">用户视角</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">24/7</div>
                <div class="stat-label">实时监控</div>
              </div>
            </div>
            <el-button type="primary" size="large" class="action-btn">
              进入驾驶舱
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
          </div>

          <!-- 设备生命周期管理 -->
          <div 
            class="agent-card" 
            @click="goToAgent('/equipment-lifecycle')"
            @mouseenter="onCardHover($event)"
            @mouseleave="onCardLeave($event)"
            data-aos="fade-up"
            data-aos-delay="300"
            data-category="equipment">
            <div class="card-glow"></div>
            <div class="agent-icon">
              <el-icon :size="64"><Box /></el-icon>
            </div>
            <el-tooltip content="查看使用教程" placement="top">
              <el-button 
                class="help-btn" 
                circle 
                size="small" 
                @click.stop="showHelp('equipment-lifecycle')">
                <el-icon><QuestionFilled /></el-icon>
              </el-button>
            </el-tooltip>
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
          <div 
            class="agent-card" 
            @click="goToAgent('/fault-tracking')"
            @mouseenter="onCardHover($event)"
            @mouseleave="onCardLeave($event)"
            data-aos="fade-up"
            data-aos-delay="400"
            data-category="equipment">
            <div class="card-glow"></div>
            <div class="agent-icon">
              <el-icon :size="64"><List /></el-icon>
            </div>
            <el-tooltip content="查看使用教程" placement="top">
              <el-button 
                class="help-btn" 
                circle 
                size="small" 
                @click.stop="showHelp('fault-tracking')">
                <el-icon><QuestionFilled /></el-icon>
              </el-button>
            </el-tooltip>
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
          <div 
            class="agent-card" 
            @click="goToAgent('/curve-analysis')"
            @mouseenter="onCardHover($event)"
            @mouseleave="onCardLeave($event)"
            data-aos="fade-up"
            data-aos-delay="500"
            data-category="analysis">
            <div class="card-glow"></div>
            <div class="agent-icon">
              <el-icon :size="64"><TrendCharts /></el-icon>
            </div>
            <el-tooltip content="查看使用教程" placement="top">
              <el-button 
                class="help-btn" 
                circle 
                size="small" 
                @click.stop="showHelp('curve-analysis')">
                <el-icon><QuestionFilled /></el-icon>
              </el-button>
            </el-tooltip>
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

          <!-- 拧紧数据采集分析 -->
          <div 
            class="agent-card" 
            @click="goToAgent('/tightening-data')"
            @mouseenter="onCardHover($event)"
            @mouseleave="onCardLeave($event)"
            data-aos="fade-up"
            data-aos-delay="600"
            data-category="analysis">
            <div class="card-glow"></div>
            <div class="agent-icon agent-icon-featured">
              <el-icon :size="64"><DataAnalysis /></el-icon>
              <el-tag type="danger" size="small" class="new-badge">新功能</el-tag>
            </div>
            <el-tooltip content="查看使用教程" placement="top">
              <el-button 
                class="help-btn" 
                circle 
                size="small" 
                @click.stop="showHelp('tightening-data')">
                <el-icon><QuestionFilled /></el-icon>
              </el-button>
            </el-tooltip>
            <h2>拧紧数据采集分析</h2>
            <p class="agent-desc">基于Open Protocol协议，实时采集PF4000/PF8000控制器数据，提供Cpk分析、异常检测和智能报警</p>
            <div class="agent-features">
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>Open Protocol</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>Cpk分析</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>智能报警</span>
              </div>
            </div>
            <div class="agent-stats">
              <div class="stat-item">
                <div class="stat-value">10000</div>
                <div class="stat-label">数据容量</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">实时</div>
                <div class="stat-label">数据采集</div>
              </div>
            </div>
            <el-button type="primary" size="large" class="action-btn">
              立即使用
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
          </div>

          <!-- 产品技术销售小课堂 -->
          <div 
            class="agent-card" 
            @click="goToAgent('/tech-classroom')"
            @mouseenter="onCardHover($event)"
            @mouseleave="onCardLeave($event)"
            data-aos="fade-up"
            data-aos-delay="700"
            data-category="tool">
            <div class="card-glow"></div>
            <div class="agent-icon">
              <el-icon :size="64"><Reading /></el-icon>
            </div>
            <el-tooltip content="查看使用教程" placement="top">
              <el-button 
                class="help-btn" 
                circle 
                size="small" 
                @click.stop="showHelp('tech-classroom')">
                <el-icon><QuestionFilled /></el-icon>
              </el-button>
            </el-tooltip>
            <h2>产品技术销售小课堂</h2>
            <p class="agent-desc">拧紧工具产品技术知识库，涵盖产品介绍、技术规格、应用案例和常见问题解答</p>
            <div class="agent-features">
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>产品知识</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>技术规格</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>应用案例</span>
              </div>
            </div>
            <div class="agent-stats">
              <div class="stat-item">
                <div class="stat-value">100+</div>
                <div class="stat-label">知识条目</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">24/7</div>
                <div class="stat-label">在线学习</div>
              </div>
            </div>
            <el-button type="primary" size="large" class="action-btn">
              进入课堂
              <el-icon class="el-icon--right"><ArrowRight /></el-icon>
            </el-button>
          </div>

          <!-- 拧紧工艺改进与验证智能体 -->
          <div 
            class="agent-card highlight" 
            @click="goToAgent('/process-verification')"
            @mouseenter="onCardHover($event)"
            @mouseleave="onCardLeave($event)"
            data-aos="fade-up"
            data-aos-delay="800"
            data-category="analysis">
            <div class="badge badge-new">
              <el-icon><Star /></el-icon>
              新功能
            </div>
            <div class="card-glow"></div>
            <div class="agent-icon agent-icon-featured">
              <el-icon :size="64"><Setting /></el-icon>
            </div>
            <el-tooltip content="查看使用教程" placement="top">
              <el-button 
                class="help-btn" 
                circle 
                size="small" 
                @click.stop="showHelp('process-verification')">
                <el-icon><QuestionFilled /></el-icon>
              </el-button>
            </el-tooltip>
            <h2>拧紧工艺改进与验证</h2>
            <p class="agent-desc">基于PSE拧紧程序的智能工艺分析与参数推荐系统，支持扭矩、角度、DS等多种控制策略</p>
            <div class="agent-features">
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>PSE参数推荐</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>多策略分析</span>
              </div>
              <div class="feature-item">
                <el-icon><Checked /></el-icon>
                <span>数据库管理</span>
              </div>
            </div>
            <div class="agent-stats">
              <div class="stat-item">
                <div class="stat-value">3种</div>
                <div class="stat-label">控制策略</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">95%</div>
                <div class="stat-label">推荐准确率</div>
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
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  DataAnalysis, MagicStick, Pointer, VideoPlay, Search, 
  QuestionFilled, Star, Reading, Tools, Box, List, TrendCharts,
  Checked, ArrowRight, Document, Money
} from '@element-plus/icons-vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

const router = useRouter()

// 状态管理
const selectedCategory = ref('all')
const searchKeyword = ref('')
const showTour = ref(false)
const agentsSection = ref(null)

// 初始化动画
onMounted(() => {
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 100
  })
  
  // 延迟应用分类过滤，确保DOM完全加载
  nextTick(() => {
    applyFilter()
  })
})

// 应用分类和搜索过滤
const applyFilter = () => {
  const cards = document.querySelectorAll('.agent-card')
  cards.forEach(card => {
    const category = card.getAttribute('data-category')
    const title = card.querySelector('h2')?.textContent || ''
    const desc = card.querySelector('.agent-desc')?.textContent || ''
    
    // 分类过滤
    const matchCategory = selectedCategory.value === 'all' || category === selectedCategory.value
    
    // 关键词搜索过滤
    const matchSearch = !searchKeyword.value || 
                       title.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
                       desc.toLowerCase().includes(searchKeyword.value.toLowerCase())
    
    // 显示或隐藏卡片
    if (matchCategory && matchSearch) {
      card.style.display = 'block'
    } else {
      card.style.display = 'none'
    }
  })
}

// 监听分类变化
watch([selectedCategory, searchKeyword], () => {
  applyFilter()
})

// 滚动到智能体区域
const scrollToAgents = () => {
  agentsSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// 卡片悬停效果
const onCardHover = (event) => {
  const card = event.currentTarget
  const glow = card.querySelector('.card-glow')
  if (glow) {
    glow.style.opacity = '1'
  }
}

const onCardLeave = (event) => {
  const card = event.currentTarget
  const glow = card.querySelector('.card-glow')
  if (glow) {
    glow.style.opacity = '0'
  }
}

// 显示帮助
const showHelp = (agentId) => {
  const helpContent = {
    'tool-selector': '🔧 拧紧工具选型智能体\n\n功能说明：\n1. 填写工艺需求信息\n2. AI智能匹配推荐工具\n3. 查看详细工具参数\n4. 生成需求报告\n\n适用场景：新工位建设、工具升级、工艺优化',
    'equipment-dashboard': '📊 数字监控驾驶舱\n\n功能说明：\n1. 实时监控设备状态\n2. 维护流程可视化\n3. 零配件订货追踪\n4. 多角色视图切换\n\n适用角色：设备管理人员、设备使用人员、供应商服务人员',
    'equipment-lifecycle': '🔄 设备全生命周期管理\n\n功能说明：\n1. 设备档案管理\n2. ROI投资回报分析\n3. AI保养预测\n4. 成本优化建议\n\n适用场景：设备采购决策、维护计划制定、成本控制',
    'fault-tracking': '📋 故障工单管理\n\n功能说明：\n1. 创建维修工单\n2. 工单状态追踪\n3. 维修进度查询\n4. 历史记录分析\n\n适用场景：设备故障报修、维修进度管理、数据统计分析',
    'curve-analysis': '📈 拧紧曲线对比分析\n\n功能说明：\n1. 上传曲线数据文件\n2. 多曲线对比分析\n3. AI智能诊断\n4. 工艺优化建议\n\n适用场景：质量问题分析、工艺参数优化、问题排查',
    'tightening-data': '📊 拧紧数据采集分析\n\n功能说明：\n1. Open Protocol协议数据采集\n2. 实时数据监控（PF4000/PF8000）\n3. Cpk过程能力分析\n4. 异常检测与智能报警\n5. 拧紧曲线可视化\n6. 数据导出与统计分析\n\n适用场景：生产过程监控、质量数据分析、工艺参数优化、预防性维护',
    'tech-classroom': '📚 产品技术销售小课堂\n\n功能说明：\n1. 拧紧工具产品知识库\n2. 技术规格详细介绍\n3. 应用场景案例分享\n4. 常见问题快速解答\n5. 多级分类查询\n\n适用场景：产品学习、技术培训、销售支持、客户咨询',
    'process-verification': '⚙️ 拧紧工艺改进与验证智能体\n\n功能说明：\n1. 多维度工艺条件筛选（工位、工具、螺栓、材料）\n2. PSE拧紧程序参数智能推荐\n3. 三种控制策略分析（扭矩/角度/DS控制）\n4. 拧紧曲线可视化预览\n5. 工艺改进建议生成\n6. 拧紧测量数据库管理\n\n控制策略：\n• 扭矩控制：适用于刚性连接，扭矩精度高\n• 角度控制：适用于软连接、长螺栓\n• DS控制：双重控制，综合扭矩和角度优势\n\n适用场景：\n- 新工艺开发与验证\n- 现有工艺参数优化\n- 拧紧问题分析与改进\n- PSE程序参数设置指导\n- 拧紧数据管理与追溯'
  }
  
  ElMessageBox.alert(helpContent[agentId] || '功能介绍开发中...', '使用帮助', {
    confirmButtonText: '知道了',
    type: 'info',
    center: true
  })
}

// 跳转到智能体页面
const goToAgent = (path) => {
  router.push(path)
  ElMessage.success('正在进入智能体...')
}
</script>

<style scoped>
.ai-agents-page {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 顶部Banner - 增强版 */
.hero-section {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 120px 0 100px;
  color: #fff;
  text-align: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.hero-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px),
    radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 50px 50px, 100px 100px;
  background-position: 0 0, 25px 25px;
  animation: particlesMove 20s linear infinite;
}

@keyframes particlesMove {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(50px);
  }
}

.hero-gradient {
  position: absolute;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  animation: gradientRotate 15s linear infinite;
}

@keyframes gradientRotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.hero-content h1 {
  font-size: 56px;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
  letter-spacing: -1px;
}

.hero-content .subtitle {
  font-size: 24px;
  margin-bottom: 16px;
  opacity: 0.95;
  font-weight: 500;
}

.hero-content .description {
  font-size: 16px;
  opacity: 0.9;
  max-width: 700px;
  margin: 0 auto 40px;
  line-height: 1.8;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.stat-box {
  text-align: center;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 4px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.stat-text {
  font-size: 14px;
  opacity: 0.9;
}

.hero-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.hero-actions .el-button {
  padding: 12px 32px;
  font-size: 16px;
  font-weight: 500;
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

/* 分类标签 */
.category-tabs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.agents-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 80px;
}

.agent-card {
  position: relative;
  background: #fff;
  border-radius: 16px;
  padding: 24px 20px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  overflow: hidden;
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  right: -50%;
  bottom: -50%;
  background: radial-gradient(circle, rgba(24, 144, 255, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}

.agent-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border-color: #1890ff;
}

.agent-card:hover .card-glow {
  opacity: 1;
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
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  z-index: 1;
}

.badge-new {
  display: flex;
  align-items: center;
  gap: 4px;
  animation: badgePulse 2s infinite;
}

@keyframes badgePulse {
  0%, 100% {
    box-shadow: 0 0 10px rgba(82, 196, 26, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(82, 196, 26, 0.8);
  }
}

.help-btn {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 1;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e8e8e8;
}

.agent-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: #fff;
  transition: all 0.3s ease;
  position: relative;
}

.agent-icon-featured {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  animation: iconPulse 2s infinite;
}

@keyframes iconPulse {
  0%, 100% {
    box-shadow: 0 0 20px rgba(255, 107, 107, 0.4);
  }
  50% {
    box-shadow: 0 0 40px rgba(255, 107, 107, 0.6);
  }
}

.new-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 8px;
  animation: badgeBounce 1s infinite;
}

@keyframes badgeBounce {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.agent-card:hover .agent-icon {
  transform: scale(1.1) rotate(5deg);
}

.agent-card.highlight .agent-icon {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
}

.agent-card h2 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1a1a1a;
  transition: color 0.3s ease;
  line-height: 1.3;
}

.agent-card:hover h2 {
  color: #1890ff;
}

.agent-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 16px;
  min-height: 60px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.agent-features {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #333;
  background: #f5f7fa;
  padding: 4px 10px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.agent-card:hover .feature-item {
  background: #e6f7ff;
  color: #1890ff;
}

.feature-item .el-icon {
  color: #52c41a;
}

.agent-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
  padding: 12px;
  background: #fafafa;
  border-radius: 10px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #1890ff;
  margin-bottom: 2px;
}

.stat-label {
  font-size: 11px;
  color: #999;
}

.action-btn {
  width: 100%;
  height: 38px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateX(4px);
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
  transition: all 0.3s ease;
}

.feature-card:hover .el-icon {
  transform: scale(1.1);
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

/* 响应式设计 */
@media (max-width: 1200px) {
  .hero-content h1 {
    font-size: 48px;
  }
  
  .agents-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 36px;
  }
  
  .hero-stats {
    gap: 20px;
  }
  
  .stat-number {
    font-size: 24px;
  }
  
  .category-tabs {
    flex-direction: column;
    gap: 16px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .agent-card {
    padding: 24px;
  }

  .agents-grid {
    grid-template-columns: 1fr;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
