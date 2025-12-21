<template>
  <div class="ai-assistant-hub">
    <Header />
    
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="container">
        <h1 class="page-title">
          <el-icon class="title-icon"><MagicStick /></el-icon>
          AI智能助手中心
        </h1>
        <p class="page-subtitle">一站式AI助手集成平台，提升工作效率10倍</p>
      </div>
    </div>

    <!-- 助手分类导航 -->
    <div class="category-nav">
      <div class="container">
        <el-tabs v-model="activeCategory" @tab-change="handleCategoryChange">
          <el-tab-pane 
            v-for="category in categories" 
            :key="category.id" 
            :label="category.name" 
            :name="category.id">
            <template #label>
              <span class="category-label">
                <el-icon><component :is="category.icon" /></el-icon>
                {{ category.name }}
                <el-badge :value="category.count" class="category-badge" />
              </span>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 助手卡片网格 -->
    <div class="assistants-section">
      <div class="container">
        <!-- 搜索和筛选 -->
        <div class="filter-bar">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索助手名称、描述或功能..."
            prefix-icon="Search"
            clearable
            @input="handleSearch"
            class="search-input"
          />
          
          <el-select v-model="sortBy" placeholder="排序方式" class="sort-select">
            <el-option label="最新发布" value="latest" />
            <el-option label="最热门" value="popular" />
            <el-option label="评分最高" value="rating" />
          </el-select>
        </div>

        <!-- 助手卡片 -->
        <transition-group name="card-list" tag="div" class="assistants-grid">
          <div
            v-for="assistant in filteredAssistants"
            :key="assistant.id"
            class="assistant-card"
            @click="openAssistant(assistant)"
          >
            <!-- 卡片头部 -->
            <div class="card-header">
              <div class="assistant-icon" :style="{ backgroundColor: assistant.color }">
                <el-icon :size="32"><component :is="assistant.icon" /></el-icon>
              </div>
              <el-tag :type="assistant.status === 'active' ? 'success' : 'info'" size="small">
                {{ assistant.status === 'active' ? '运行中' : '就绪' }}
              </el-tag>
            </div>

            <!-- 卡片内容 -->
            <div class="card-body">
              <h3 class="assistant-name">{{ assistant.name }}</h3>
              <p class="assistant-desc">{{ assistant.description }}</p>
              
              <!-- 功能标签 -->
              <div class="feature-tags">
                <el-tag
                  v-for="(feature, index) in assistant.features.slice(0, 3)"
                  :key="index"
                  size="small"
                  effect="plain"
                >
                  {{ feature }}
                </el-tag>
              </div>

              <!-- 统计信息 -->
              <div class="card-stats">
                <div class="stat-item">
                  <el-icon><User /></el-icon>
                  <span>{{ assistant.users }}</span>
                </div>
                <div class="stat-item">
                  <el-icon><StarFilled /></el-icon>
                  <span>{{ assistant.rating }}</span>
                </div>
                <div class="stat-item">
                  <el-icon><Clock /></el-icon>
                  <span>{{ assistant.avgTime }}</span>
                </div>
              </div>
            </div>

            <!-- 卡片底部 -->
            <div class="card-footer">
              <el-button type="primary" size="small" :icon="ChatDotRound">
                立即使用
              </el-button>
              <el-button size="small" :icon="InfoFilled" @click.stop="showDetail(assistant)">
                详情
              </el-button>
            </div>
          </div>
        </transition-group>

        <!-- 空状态 -->
        <el-empty
          v-if="filteredAssistants.length === 0"
          description="未找到匹配的AI助手"
        >
          <el-button type="primary" @click="searchKeyword = ''">清除搜索</el-button>
        </el-empty>
      </div>
    </div>

    <!-- 助手详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      :title="selectedAssistant?.name"
      width="800px"
      class="assistant-detail-dialog"
    >
      <div v-if="selectedAssistant" class="assistant-detail">
        <div class="detail-header">
          <div class="assistant-icon-large" :style="{ backgroundColor: selectedAssistant.color }">
            <el-icon :size="48"><component :is="selectedAssistant.icon" /></el-icon>
          </div>
          <div class="detail-info">
            <h2>{{ selectedAssistant.name }}</h2>
            <p>{{ selectedAssistant.description }}</p>
            <div class="detail-stats">
              <el-rate v-model="selectedAssistant.rating" disabled show-score />
              <span class="users-count">{{ selectedAssistant.users }} 用户使用</span>
            </div>
          </div>
        </div>

        <el-divider />

        <div class="detail-content">
          <h3>核心功能</h3>
          <ul class="feature-list">
            <li v-for="(feature, index) in selectedAssistant.features" :key="index">
              <el-icon><Check /></el-icon>
              <span>{{ feature }}</span>
            </li>
          </ul>

          <h3>使用场景</h3>
          <div class="scenarios">
            <el-tag
              v-for="(scenario, index) in selectedAssistant.scenarios"
              :key="index"
              size="large"
              effect="light"
            >
              {{ scenario }}
            </el-tag>
          </div>

          <h3>技术特点</h3>
          <p>{{ selectedAssistant.techDetails }}</p>
        </div>
      </div>

      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="openAssistant(selectedAssistant)">
          立即使用
        </el-button>
      </template>
    </el-dialog>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

const router = useRouter()

// 当前分类
const activeCategory = ref('all')

// 搜索关键词
const searchKeyword = ref('')

// 排序方式
const sortBy = ref('latest')

// 详情对话框
const detailDialogVisible = ref(false)
const selectedAssistant = ref(null)

// 分类数据
const categories = ref([
  { id: 'all', name: '全部', icon: 'Grid', count: 18 },
  { id: 'production', name: '生产制造', icon: 'Setting', count: 6 },
  { id: 'marketing', name: '营销管理', icon: 'Promotion', count: 5 },
  { id: 'data', name: '数据分析', icon: 'DataAnalysis', count: 4 },
  { id: 'service', name: '客户服务', icon: 'Service', count: 3 }
])

// AI助手数据
const assistants = ref([
  {
    id: 1,
    name: '智能质量检测助手',
    description: '基于AI视觉的实时质量检测，准确率99.8%',
    icon: 'View',
    color: '#409EFF',
    category: 'production',
    features: ['实时检测', '缺陷分类', '智能预警', 'OCR识别'],
    scenarios: ['产线质检', '来料检验', '出厂检验'],
    techDetails: '采用深度学习算法，支持多种缺陷类型自动识别，可与MES系统无缝集成。',
    users: '1.2k',
    rating: 4.8,
    avgTime: '< 1s',
    status: 'active'
  },
  {
    id: 2,
    name: '预测性维护助手',
    description: '设备故障提前预警，减少停机时间80%',
    icon: 'Tools',
    color: '#67C23A',
    category: 'production',
    features: ['故障预测', '维护建议', '备件管理', '趋势分析'],
    scenarios: ['设备维护', '备件管理', '停机预防'],
    techDetails: '通过机器学习分析设备运行数据，提前预测潜在故障点。',
    users: '856',
    rating: 4.6,
    avgTime: '< 2s',
    status: 'ready'
  },
  {
    id: 3,
    name: 'AI智能客服助手',
    description: '24/7在线客服，客户满意度提升40%',
    icon: 'Service',
    color: '#E6A23C',
    category: 'service',
    features: ['智能问答', '多语言支持', '情绪识别', '转人工'],
    scenarios: ['售前咨询', '售后服务', '技术支持'],
    techDetails: '基于NLP和知识图谱，支持上下文理解和多轮对话。',
    users: '2.3k',
    rating: 4.9,
    avgTime: '< 0.5s',
    status: 'active'
  },
  {
    id: 4,
    name: '销售线索评分助手',
    description: '自动评估线索质量，转化率提升60%',
    icon: 'TrendCharts',
    color: '#F56C6C',
    category: 'marketing',
    features: ['线索评分', '优先级排序', '跟进建议', '转化预测'],
    scenarios: ['线索管理', '销售跟进', '商机挖掘'],
    techDetails: '多维度评估线索质量，智能推荐最佳跟进策略。',
    users: '1.5k',
    rating: 4.7,
    avgTime: '< 1s',
    status: 'active'
  },
  {
    id: 5,
    name: '智能报价助手',
    description: '秒级生成专业报价，准确率99%',
    icon: 'DocumentCopy',
    color: '#909399',
    category: 'marketing',
    features: ['自动报价', 'BOM分析', '成本优化', 'PDF导出'],
    scenarios: ['产品报价', '成本核算', '方案对比'],
    techDetails: '结合产品数据库和市场行情，智能生成最优报价方案。',
    users: '1.1k',
    rating: 4.5,
    avgTime: '< 2s',
    status: 'ready'
  },
  {
    id: 6,
    name: '数据可视化助手',
    description: '一键生成专业图表，洞察业务趋势',
    icon: 'DataLine',
    color: '#00C9A7',
    category: 'data',
    features: ['智能图表', '交互分析', '报告生成', 'BI集成'],
    scenarios: ['数据分析', '经营分析', '决策支持'],
    techDetails: '支持30+图表类型，智能推荐最佳可视化方案。',
    users: '1.8k',
    rating: 4.8,
    avgTime: '< 3s',
    status: 'active'
  },
  {
    id: 7,
    name: '智能排程助手',
    description: 'AI优化生产排程，产能提升35%',
    icon: 'Calendar',
    color: '#845EC2',
    category: 'production',
    features: ['自动排程', '产能优化', '瓶颈分析', '实时调整'],
    scenarios: ['生产计划', '产能管理', '资源调度'],
    techDetails: '基于约束理论和遗传算法，实现最优生产排程。',
    users: '672',
    rating: 4.6,
    avgTime: '< 5s',
    status: 'ready'
  },
  {
    id: 8,
    name: '客户画像助手',
    description: '360°客户洞察，精准营销决策',
    icon: 'Avatar',
    color: '#FF6F91',
    category: 'marketing',
    features: ['客户画像', '行为分析', '价值评估', '推荐策略'],
    scenarios: ['客户管理', '精准营销', '客户维护'],
    techDetails: '整合多源数据，构建完整客户画像和生命周期模型。',
    users: '1.4k',
    rating: 4.7,
    avgTime: '< 2s',
    status: 'active'
  },
  {
    id: 9,
    name: '智能文档助手',
    description: 'AI自动生成技术文档，效率提升10倍',
    icon: 'Document',
    color: '#3D5A80',
    category: 'service',
    features: ['文档生成', '版本管理', '多语言', '模板库'],
    scenarios: ['技术文档', '操作手册', '培训资料'],
    techDetails: '基于模板和AI写作，自动生成专业技术文档。',
    users: '923',
    rating: 4.4,
    avgTime: '< 10s',
    status: 'ready'
  },
  {
    id: 10,
    name: '库存优化助手',
    description: '智能预测需求，库存成本降低30%',
    icon: 'Box',
    color: '#4ECDC4',
    category: 'production',
    features: ['需求预测', '安全库存', '补货建议', '呆滞分析'],
    scenarios: ['库存管理', '采购计划', '成本控制'],
    techDetails: '时间序列预测 + 机器学习，实现精准库存管理。',
    users: '734',
    rating: 4.5,
    avgTime: '< 3s',
    status: 'active'
  },
  {
    id: 11,
    name: '价格优化助手',
    description: '动态定价策略，利润提升25%',
    icon: 'Coin',
    color: '#FFD700',
    category: 'marketing',
    features: ['动态定价', '竞品分析', '利润优化', 'A/B测试'],
    scenarios: ['定价策略', '促销方案', '竞品对比'],
    techDetails: '结合市场数据和需求弹性，制定最优定价策略。',
    users: '589',
    rating: 4.3,
    avgTime: '< 2s',
    status: 'ready'
  },
  {
    id: 12,
    name: '供应链协同助手',
    description: '端到端供应链可视化，交付准时率95%',
    icon: 'Connection',
    color: '#98D8C8',
    category: 'production',
    features: ['供应链追踪', '风险预警', '协同计划', '物流优化'],
    scenarios: ['供应链管理', '物流追踪', '风险管理'],
    techDetails: '区块链 + IoT技术，实现供应链全程透明化。',
    users: '512',
    rating: 4.6,
    avgTime: '< 1s',
    status: 'active'
  },
  {
    id: 13,
    name: '智能培训助手',
    description: 'AI定制化培训，员工技能提升50%',
    icon: 'Reading',
    color: '#F7B801',
    category: 'service',
    features: ['学习路径', '知识测评', '进度跟踪', '证书管理'],
    scenarios: ['员工培训', '技能认证', '知识管理'],
    techDetails: '自适应学习算法，为每位员工定制最优学习路径。',
    users: '1.6k',
    rating: 4.8,
    avgTime: '< 1s',
    status: 'active'
  },
  {
    id: 14,
    name: '风险评估助手',
    description: '全方位风险监控，损失预防90%',
    icon: 'Warning',
    color: '#FF6B6B',
    category: 'data',
    features: ['风险识别', '影响评估', '应对方案', '预警通知'],
    scenarios: ['风险管理', '合规检查', '危机应对'],
    techDetails: '多维度风险模型，实时监控并智能预警。',
    users: '423',
    rating: 4.4,
    avgTime: '< 2s',
    status: 'ready'
  },
  {
    id: 15,
    name: '能耗优化助手',
    description: 'AI节能方案，能耗降低40%',
    icon: 'Lightning',
    color: '#52B788',
    category: 'production',
    features: ['能耗监控', '优化建议', '碳排放', '成本分析'],
    scenarios: ['节能减排', '成本控制', '绿色生产'],
    techDetails: '实时监控能耗数据，AI推荐最优节能方案。',
    users: '367',
    rating: 4.5,
    avgTime: '< 2s',
    status: 'active'
  },
  {
    id: 16,
    name: '竞品监测助手',
    description: '实时竞品情报，抢占市场先机',
    icon: 'Telescope',
    color: '#5E60CE',
    category: 'marketing',
    features: ['价格监控', '产品对比', '舆情分析', '策略建议'],
    scenarios: ['竞品分析', '市场调研', '战略规划'],
    techDetails: '爬虫 + NLP技术，7×24小时监控竞品动态。',
    users: '789',
    rating: 4.6,
    avgTime: '< 3s',
    status: 'active'
  },
  {
    id: 17,
    name: '异常检测助手',
    description: '实时异常识别，问题响应提速80%',
    icon: 'Monitor',
    color: '#D62828',
    category: 'data',
    features: ['异常识别', '根因分析', '自动告警', '处置建议'],
    scenarios: ['质量监控', '设备巡检', '安全防护'],
    techDetails: '无监督学习算法，自动发现异常模式。',
    users: '634',
    rating: 4.7,
    avgTime: '< 1s',
    status: 'active'
  },
  {
    id: 18,
    name: '智能招聘助手',
    description: 'AI简历筛选，招聘效率提升5倍',
    icon: 'User',
    color: '#06FFA5',
    category: 'service',
    features: ['简历解析', '候选人匹配', '面试安排', '人才画像'],
    scenarios: ['人才招聘', '候选人管理', 'HR效能'],
    techDetails: 'NLP + 知识图谱，精准匹配岗位与候选人。',
    users: '912',
    rating: 4.5,
    avgTime: '< 2s',
    status: 'ready'
  }
])

// 筛选后的助手列表
const filteredAssistants = computed(() => {
  let result = assistants.value

  // 按分类筛选
  if (activeCategory.value !== 'all') {
    result = result.filter(a => a.category === activeCategory.value)
  }

  // 按关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(a => 
      a.name.toLowerCase().includes(keyword) ||
      a.description.toLowerCase().includes(keyword) ||
      a.features.some(f => f.toLowerCase().includes(keyword))
    )
  }

  // 排序
  if (sortBy.value === 'popular') {
    result.sort((a, b) => parseFloat(b.users) - parseFloat(a.users))
  } else if (sortBy.value === 'rating') {
    result.sort((a, b) => b.rating - a.rating)
  }

  return result
})

// 分类切换
const handleCategoryChange = (categoryId) => {
  activeCategory.value = categoryId
}

// 搜索处理
const handleSearch = () => {
  // 搜索逻辑已在computed中实现
}

// 打开助手
const openAssistant = (assistant) => {
  // 根据助手类型跳转到对应页面
  console.log('打开助手:', assistant.name)
  // router.push({ name: 'AssistantDetail', params: { id: assistant.id } })
}

// 显示详情
const showDetail = (assistant) => {
  selectedAssistant.value = assistant
  detailDialogVisible.value = true
}

onMounted(() => {
  // 初始化逻辑
})
</script>

<style scoped>
.ai-assistant-hub {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 0;
  text-align: center;
}

.page-title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.title-icon {
  font-size: 52px;
}

.page-subtitle {
  font-size: 20px;
  opacity: 0.95;
}

.category-nav {
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  position: sticky;
  top: 60px;
  z-index: 99;
}

.category-label {
  display: flex;
  align-items: center;
  gap: 6px;
}

.category-badge {
  margin-left: 4px;
}

.assistants-section {
  padding: 40px 0;
}

.filter-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
}

.search-input {
  flex: 1;
}

.sort-select {
  width: 160px;
}

.assistants-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
}

.assistant-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.assistant-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
  border-color: #409EFF;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.assistant-icon {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.assistant-name {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #303133;
}

.assistant-desc {
  font-size: 14px;
  color: #606266;
  margin-bottom: 16px;
  line-height: 1.6;
}

.feature-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.card-stats {
  display: flex;
  gap: 16px;
  padding: 12px 0;
  border-top: 1px solid #EBEEF5;
  border-bottom: 1px solid #EBEEF5;
  margin-bottom: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #909399;
}

.card-footer {
  display: flex;
  gap: 8px;
}

.card-footer .el-button {
  flex: 1;
}

/* 动画 */
.card-list-move,
.card-list-enter-active,
.card-list-leave-active {
  transition: all 0.3s ease;
}

.card-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.card-list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* 详情对话框 */
.assistant-detail-dialog .detail-header {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.assistant-icon-large {
  width: 96px;
  height: 96px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.detail-info h2 {
  font-size: 28px;
  margin-bottom: 12px;
}

.detail-stats {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 12px;
}

.users-count {
  color: #909399;
  font-size: 14px;
}

.detail-content h3 {
  font-size: 18px;
  margin: 24px 0 16px 0;
  color: #303133;
}

.feature-list {
  list-style: none;
  padding: 0;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 0;
  font-size: 15px;
  color: #606266;
}

.feature-list .el-icon {
  color: #67C23A;
}

.scenarios {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

@media (max-width: 768px) {
  .assistants-grid {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 32px;
  }
  
  .filter-bar {
    flex-direction: column;
  }
  
  .sort-select {
    width: 100%;
  }
}
</style>
