<template>
  <div class="ai-agent-page">
    <Header />
    
    <!-- 智能体Banner -->
    <section class="agent-banner">
      <div class="container">
        <div class="banner-content">
          <el-icon :size="64" color="#fff"><component :is="currentAgent?.icon || 'Robot'" /></el-icon>
          <h1>{{ currentAgent?.name }}</h1>
          <p>{{ currentAgent?.description }}</p>
          <div class="agent-tags">
            <el-tag v-for="tag in currentAgent?.tags" :key="tag" size="large" effect="plain" color="rgba(255,255,255,0.2)">
              {{ tag }}
            </el-tag>
          </div>
        </div>
      </div>
    </section>

    <!-- 智能体分类 -->
    <section class="agent-categories">
      <div class="container">
        <div class="section-header">
          <h2>功能模块</h2>
          <p>选择您需要的智能服务</p>
        </div>
        
        <div class="categories-grid">
          <div v-for="category in categories" :key="category.id" class="category-card">
            <div class="category-header" @click="toggleCategory(category.id)">
              <div class="category-title">
                <el-icon :size="24"><component :is="category.icon" /></el-icon>
                <h3>{{ category.name }}</h3>
              </div>
              <el-icon :size="20">
                <component :is="expandedCategories.includes(category.id) ? 'ArrowUp' : 'ArrowDown'" />
              </el-icon>
            </div>
            
            <transition name="expand">
              <div v-show="expandedCategories.includes(category.id)" class="subcategories">
                <div v-for="sub in category.subcategories" :key="sub.id" 
                     class="subcategory-item"
                     @click="handleSubcategoryClick(sub)">
                  <div class="sub-icon">
                    <el-icon :size="20"><component :is="sub.icon" /></el-icon>
                  </div>
                  <div class="sub-info">
                    <h4>{{ sub.name }}</h4>
                    <p>{{ sub.description }}</p>
                  </div>
                  <el-button type="primary" size="small" @click.stop="openAgent(sub)">
                    立即使用
                  </el-button>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </section>

    <!-- 使用说明 -->
    <section class="usage-guide">
      <div class="container">
        <div class="section-header">
          <h2>使用指南</h2>
          <p>简单三步，快速上手</p>
        </div>
        <div class="steps-grid">
          <div class="step-item">
            <div class="step-number">1</div>
            <h3>选择功能</h3>
            <p>在上方功能模块中选择您需要的服务</p>
          </div>
          <div class="step-item">
            <div class="step-number">2</div>
            <h3>输入信息</h3>
            <p>按照提示输入相关参数和需求</p>
          </div>
          <div class="step-item">
            <div class="step-number">3</div>
            <h3>获取结果</h3>
            <p>AI智能分析并给出专业建议</p>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

const route = useRoute()
const router = useRouter()

// 智能体数据
const agents = ref([
  { 
    id: 1, 
    name: '拧紧工具选型与工艺改进', 
    description: '基于AI的智能工具选型系统，帮助您选择最优拧紧方案，提升装配工艺效率', 
    icon: 'Tools',
    tags: ['工具选型', '工艺优化', 'AI推荐', '效率提升']
  },
  { 
    id: 2, 
    name: '服务状态查询', 
    description: '实时查询设备服务状态、维护记录和保养计划', 
    icon: 'Search',
    tags: ['状态监控', '服务追踪', '实时查询', '智能提醒']
  },
  { 
    id: 3, 
    name: '智能质检助手', 
    description: 'AI辅助质量检测，自动识别缺陷，提升产品合格率', 
    icon: 'View',
    tags: ['质量检测', 'AI识别', '自动化', '数据分析']
  }
])

const currentAgent = computed(() => {
  const agentId = parseInt(route.params.id)
  return agents.value.find(a => a.id === agentId) || agents.value[0]
})

// 展开的分类
const expandedCategories = ref([1])

// 根据不同智能体显示不同的分类
const categories = computed(() => {
  const agentId = currentAgent.value?.id
  
  if (agentId === 1) {
    // 拧紧工具选型与工艺改进
    return [
      {
        id: 1,
        name: '工具选型',
        icon: 'SetUp',
        subcategories: [
          { id: 11, name: '扭矩工具选型', description: '根据装配需求智能推荐扭矩工具', icon: 'DataAnalysis', route: '/tool-selector' },
          { id: 12, name: '套筒配件选型', description: '根据工具和螺栓匹配最适合的套筒', icon: 'Box', route: '/socket-selector' },
          { id: 13, name: '品牌型号匹配', description: '匹配符合要求的具体品牌和型号', icon: 'Management', route: '/tool-brand-match' }
        ]
      },
      {
        id: 2,
        name: '工艺优化',
        icon: 'TrendCharts',
        subcategories: [
          { id: 21, name: '拧紧策略优化', description: '优化拧紧顺序和方式，提升装配质量', icon: 'Guide', route: '/tightening-strategy' },
          { id: 22, name: '拧紧曲线分析', description: '对比分析拧紧曲线，诊断装配问题', icon: 'DataLine', route: '/curve-analysis' },
          { id: 23, name: '成本优化分析', description: '平衡质量与成本，给出最优方案', icon: 'Coin', route: '/cost-optimization' }
        ]
      }
    ]
  } else if (agentId === 2) {
    // 服务状态查询
    return [
      {
        id: 1,
        name: '设备状态',
        icon: 'Monitor',
        subcategories: [
          { id: 11, name: '在线设备查询', description: '查看所有在线设备的实时状态', icon: 'CircleCheck', route: '/device-status' },
          { id: 12, name: '故障设备追踪', description: '追踪故障设备的维修进度', icon: 'Warning' },
          { id: 13, name: '性能监控', description: '监控设备性能指标和趋势', icon: 'Odometer' }
        ]
      },
      {
        id: 2,
        name: '服务记录',
        icon: 'Document',
        subcategories: [
          { id: 21, name: '维护历史', description: '查询设备的历史维护记录', icon: 'Clock' },
          { id: 22, name: '保养计划', description: '查看即将到期的保养计划', icon: 'Calendar' },
          { id: 23, name: '服务报告', description: '生成和下载服务报告', icon: 'DocumentCopy' }
        ]
      }
    ]
  } else {
    // 智能质检助手
    return [
      {
        id: 1,
        name: '质检功能',
        icon: 'View',
        subcategories: [
          { id: 11, name: '外观检测', description: 'AI识别产品外观缺陷', icon: 'Picture' },
          { id: 12, name: '尺寸测量', description: '自动测量产品关键尺寸', icon: 'Histogram' },
          { id: 13, name: '质量评分', description: '综合评估产品质量等级', icon: 'Medal' }
        ]
      },
      {
        id: 2,
        name: '数据分析',
        icon: 'DataLine',
        subcategories: [
          { id: 21, name: '缺陷统计', description: '统计分析缺陷类型和频率', icon: 'PieChart' },
          { id: 22, name: '趋势分析', description: '分析质量趋势，预测问题', icon: 'TrendCharts' },
          { id: 23, name: '改进建议', description: '基于数据给出改进建议', icon: 'MagicStick' }
        ]
      }
    ]
  }
})

const toggleCategory = (categoryId) => {
  const index = expandedCategories.value.indexOf(categoryId)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(categoryId)
  }
}

const handleSubcategoryClick = (subcategory) => {
  console.log('选择了子功能:', subcategory.name)
}

const openAgent = (subcategory) => {
  // 根据不同的子功能跳转到对应页面
  if (subcategory.route) {
    router.push(subcategory.route)
  } else {
    // 其他智能体功能
    console.log('打开智能体:', subcategory.name)
    // TODO: 可以在这里添加其他智能体的具体功能页面
  }
}

onMounted(() => {
  // 默认展开第一个分类
  if (categories.value.length > 0) {
    expandedCategories.value = [categories.value[0].id]
  }
})
</script>

<style scoped>
.ai-agent-page {
  min-height: 100vh;
  background: #f5f7fa;
}

/* Banner */
.agent-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 0;
  color: #fff;
  text-align: center;
}

.banner-content {
  max-width: 800px;
  margin: 0 auto;
}

.banner-content h1 {
  font-size: 42px;
  font-weight: 700;
  margin: 24px 0 16px;
}

.banner-content p {
  font-size: 18px;
  margin-bottom: 24px;
  opacity: 0.95;
}

.agent-tags {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

/* 分类板块 */
.agent-categories {
  padding: 80px 0;
  background: #fff;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-header h2 {
  font-size: 36px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.section-header p {
  font-size: 16px;
  color: #666;
}

.categories-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.category-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.category-card:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  cursor: pointer;
  background: #fafbfc;
  transition: background 0.3s ease;
}

.category-header:hover {
  background: #f5f7fa;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.category-title h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.category-title .el-icon {
  color: #667eea;
}

.subcategories {
  padding: 0 28px 24px;
}

.subcategory-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background: #fafbfc;
  border-radius: 8px;
  margin-top: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.subcategory-item:hover {
  background: #f5f7fa;
  transform: translateX(4px);
}

.sub-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  color: #fff;
  flex-shrink: 0;
}

.sub-info {
  flex: 1;
}

.sub-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 6px 0;
}

.sub-info p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 展开动画 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 1000px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

/* 使用指南 */
.usage-guide {
  padding: 80px 0;
  background: #fafbfc;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.step-item {
  text-align: center;
  padding: 40px 20px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
}

.step-item:hover {
  border-color: #667eea;
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.1);
  transform: translateY(-4px);
}

.step-number {
  width: 60px;
  height: 60px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  font-size: 28px;
  font-weight: 700;
  border-radius: 50%;
}

.step-item h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.step-item p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}
</style>
