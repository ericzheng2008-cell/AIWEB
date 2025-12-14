<template>
  <div class="ai-agent-editor">
    <el-card shadow="never">
      <template #header>
        <div class="editor-header">
          <div>
            <el-icon><Avatar /></el-icon>
            <span>智能体内容编辑</span>
          </div>
          <el-button type="primary" @click="saveAllContent" :loading="saving">
            <el-icon><Check /></el-icon>
            保存所有更改
          </el-button>
        </div>
      </template>

      <!-- 智能体列表 -->
      <div class="agent-list">
        <el-tabs v-model="activeAgent" tab-position="left">
          <el-tab-pane 
            v-for="agent in agents" 
            :key="agent.id" 
            :label="agent.name" 
            :name="agent.id">
            <el-card class="agent-edit-card">
              <template #header>
                <div class="agent-card-header">
                  <h3>{{ agent.name }}</h3>
                  <el-tag :type="agent.status === 'active' ? 'success' : 'info'">
                    {{ agent.status === 'active' ? '已启用' : '未启用' }}
                  </el-tag>
                </div>
              </template>

              <el-form :model="agent" label-width="120px">
                <!-- 基本信息 -->
                <el-divider content-position="left">
                  <el-icon><InfoFilled /></el-icon>
                  基本信息
                </el-divider>

                <el-form-item label="智能体名称">
                  <el-input v-model="agent.name" placeholder="请输入智能体名称" />
                </el-form-item>

                <el-form-item label="状态">
                  <el-switch 
                    v-model="agent.status" 
                    active-value="active"
                    inactive-value="inactive"
                    active-text="启用"
                    inactive-text="停用" />
                </el-form-item>

                <el-form-item label="图标">
                  <el-input v-model="agent.icon" placeholder="如：🤖" />
                  <div class="icon-preview" v-if="agent.icon">
                    预览: <span class="preview-icon">{{ agent.icon }}</span>
                  </div>
                </el-form-item>

                <el-form-item label="简短描述">
                  <el-input 
                    v-model="agent.shortDesc" 
                    type="textarea"
                    :rows="2"
                    placeholder="一句话描述智能体功能"
                    maxlength="100"
                    show-word-limit />
                </el-form-item>

                <!-- 详细内容 -->
                <el-divider content-position="left">
                  <el-icon><Document /></el-icon>
                  详细内容
                </el-divider>

                <el-form-item label="详细描述">
                  <el-input 
                    v-model="agent.description" 
                    type="textarea"
                    :rows="4"
                    placeholder="详细介绍智能体的功能和特点"
                    maxlength="500"
                    show-word-limit />
                </el-form-item>

                <el-form-item label="核心功能">
                  <div class="features-editor">
                    <div 
                      v-for="(feature, index) in agent.features" 
                      :key="index"
                      class="feature-item">
                      <el-input 
                        v-model="agent.features[index]" 
                        placeholder="输入功能描述">
                        <template #append>
                          <el-button 
                            type="danger" 
                            :icon="Delete" 
                            @click="removeFeature(agent, index)" />
                        </template>
                      </el-input>
                    </div>
                    <el-button 
                      type="primary" 
                      :icon="Plus" 
                      @click="addFeature(agent)"
                      style="width: 100%; margin-top: 10px;">
                      添加功能
                    </el-button>
                  </div>
                </el-form-item>

                <el-form-item label="应用场景">
                  <div class="scenarios-editor">
                    <div 
                      v-for="(scenario, index) in agent.scenarios" 
                      :key="index"
                      class="scenario-item">
                      <el-input 
                        v-model="agent.scenarios[index]" 
                        placeholder="输入应用场景">
                        <template #append>
                          <el-button 
                            type="danger" 
                            :icon="Delete" 
                            @click="removeScenario(agent, index)" />
                        </template>
                      </el-input>
                    </div>
                    <el-button 
                      type="primary" 
                      :icon="Plus" 
                      @click="addScenario(agent)"
                      style="width: 100%; margin-top: 10px;">
                      添加场景
                    </el-button>
                  </div>
                </el-form-item>

                <!-- 图片设置 -->
                <el-divider content-position="left">
                  <el-icon><Picture /></el-icon>
                  图片设置
                </el-divider>

                <el-form-item label="封面图片">
                  <div class="image-upload-section">
                    <el-upload
                      class="cover-uploader"
                      action="#"
                      :show-file-list="false"
                      :auto-upload="false"
                      :on-change="(file) => handleImageChange(agent, 'coverImage', file)"
                      accept="image/*">
                      <img v-if="agent.coverImage" :src="agent.coverImage" class="cover-image" />
                      <el-icon v-else class="cover-uploader-icon"><Plus /></el-icon>
                    </el-upload>
                    <div class="image-tips">
                      <p>建议尺寸: 800x600px</p>
                      <p>支持格式: JPG, PNG, GIF</p>
                      <el-button 
                        v-if="agent.coverImage" 
                        type="danger" 
                        size="small"
                        @click="agent.coverImage = ''"
                        style="margin-top: 10px;">
                        删除图片
                      </el-button>
                    </div>
                  </div>
                </el-form-item>

                <el-form-item label="图片URL">
                  <el-input 
                    v-model="agent.coverImage" 
                    placeholder="或直接输入图片URL"
                    clearable>
                    <template #prepend>
                      <el-icon><Link /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>

                <!-- 操作按钮 -->
                <el-form-item>
                  <el-space>
                    <el-button type="primary" @click="saveAgent(agent)">
                      <el-icon><Check /></el-icon>
                      保存此智能体
                    </el-button>
                    <el-button @click="previewAgent(agent)">
                      <el-icon><View /></el-icon>
                      预览效果
                    </el-button>
                    <el-button type="danger" @click="deleteAgent(agent)">
                      <el-icon><Delete /></el-icon>
                      删除智能体
                    </el-button>
                  </el-space>
                </el-form-item>
              </el-form>
            </el-card>
          </el-tab-pane>

          <!-- 添加新智能体 -->
          <el-tab-pane label="+ 添加新智能体" name="new">
            <el-card>
              <el-result
                icon="success"
                title="创建新智能体"
                sub-title="点击下方按钮添加新的智能体">
                <template #extra>
                  <el-button type="primary" size="large" @click="createNewAgent">
                    <el-icon><Plus /></el-icon>
                    创建智能体
                  </el-button>
                </template>
              </el-result>
            </el-card>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-card>

    <!-- 预览对话框 -->
    <el-dialog
      v-model="previewVisible"
      title="智能体预览"
      width="800px">
      <div v-if="previewAgent" class="agent-preview">
        <div class="preview-header">
          <span class="preview-icon-large">{{ previewAgent.icon }}</span>
          <div class="preview-info">
            <h2>{{ previewAgent.name }}</h2>
            <p>{{ previewAgent.shortDesc }}</p>
          </div>
        </div>
        
        <el-divider />
        
        <div class="preview-content">
          <h3>详细描述</h3>
          <p>{{ previewAgent.description }}</p>
          
          <h3>核心功能</h3>
          <ul>
            <li v-for="(feature, index) in previewAgent.features" :key="index">
              {{ feature }}
            </li>
          </ul>
          
          <h3>应用场景</h3>
          <ul>
            <li v-for="(scenario, index) in previewAgent.scenarios" :key="index">
              {{ scenario }}
            </li>
          </ul>
          
          <h3>封面图片</h3>
          <img v-if="previewAgent.coverImage" :src="previewAgent.coverImage" class="preview-cover" />
          <el-empty v-else description="未设置封面图片" :image-size="100" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Avatar, Check, InfoFilled, Document, Picture, Plus, Delete, 
  View, Link
} from '@element-plus/icons-vue'

// 数据
const activeAgent = ref('tool-selector')
const saving = ref(false)
const previewVisible = ref(false)
const previewAgent = ref(null)

const agents = ref([
  {
    id: 'tool-selector',
    name: '拧紧工具选型智能体',
    icon: '🔧',
    shortDesc: '智能分析工艺需求，推荐最优拧紧工具方案',
    description: '基于AI算法，智能分析您的工艺需求，包括扭矩、精度、动力形式等参数，为您推荐最合适的拧紧工具方案。支持多维度筛选和对比，提供专业的工艺优化建议。',
    features: [
      'AI智能匹配推荐',
      '多维度参数分析',
      '工艺优化建议',
      '需求报告生成'
    ],
    scenarios: [
      '新工位建设',
      '工具升级换代',
      '工艺优化改善',
      '成本控制优化'
    ],
    coverImage: '/images/agent-tool-selector.jpg',
    status: 'active'
  },
  {
    id: 'brand-match',
    name: '品牌型号匹配智能体',
    icon: '🏆',
    shortDesc: '精准匹配全球主流品牌和型号',
    description: '整合全球主流拧紧工具品牌数据库，基于工艺需求和预算范围，智能推荐最合适的品牌和具体型号。提供详细的技术参数对比和性价比分析。',
    features: [
      '全球品牌数据库',
      '型号精准匹配',
      '技术参数对比',
      '性价比分析'
    ],
    scenarios: [
      '品牌选型决策',
      '型号对比分析',
      '采购预算规划',
      '供应商评估'
    ],
    coverImage: '/images/agent-brand-match.jpg',
    status: 'active'
  },
  {
    id: 'curve-analysis',
    name: '拧紧曲线分析智能体',
    icon: '📊',
    shortDesc: 'AI驱动的拧紧曲线智能分析',
    description: '采用深度学习算法，智能分析拧紧曲线数据，识别异常模式，预测潜在质量风险。支持多曲线对比分析，提供优化建议和预警提醒。',
    features: [
      '曲线智能分析',
      '异常模式识别',
      '质量预测预警',
      '多曲线对比'
    ],
    scenarios: [
      '质量问题诊断',
      '工艺参数优化',
      '过程质量监控',
      '数据分析报告'
    ],
    coverImage: '/images/agent-curve-analysis.jpg',
    status: 'active'
  }
])

// 方法
const loadAgents = () => {
  const saved = localStorage.getItem('aiAgents')
  if (saved) {
    agents.value = JSON.parse(saved)
  }
}

const saveAgents = () => {
  localStorage.setItem('aiAgents', JSON.stringify(agents.value))
}

const saveAgent = (agent) => {
  saveAgents()
  ElMessage.success(`已保存 ${agent.name}`)
}

const saveAllContent = () => {
  saving.value = true
  setTimeout(() => {
    saveAgents()
    saving.value = false
    ElMessage.success('所有智能体内容已保存')
  }, 500)
}

const addFeature = (agent) => {
  if (!agent.features) {
    agent.features = []
  }
  agent.features.push('')
}

const removeFeature = (agent, index) => {
  agent.features.splice(index, 1)
}

const addScenario = (agent) => {
  if (!agent.scenarios) {
    agent.scenarios = []
  }
  agent.scenarios.push('')
}

const removeScenario = (agent, index) => {
  agent.scenarios.splice(index, 1)
}

const handleImageChange = (agent, field, file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    agent[field] = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

const previewAgentFunc = (agent) => {
  previewAgent.value = agent
  previewVisible.value = true
}

const createNewAgent = () => {
  const newAgent = {
    id: `agent-${Date.now()}`,
    name: '新智能体',
    icon: '🤖',
    shortDesc: '',
    description: '',
    features: [],
    scenarios: [],
    coverImage: '',
    status: 'inactive'
  }
  agents.value.push(newAgent)
  activeAgent.value = newAgent.id
  ElMessage.success('已创建新智能体')
}

const deleteAgent = (agent) => {
  ElMessageBox.confirm(
    `确定要删除智能体 "${agent.name}" 吗？此操作不可恢复。`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = agents.value.findIndex(a => a.id === agent.id)
    if (index > -1) {
      agents.value.splice(index, 1)
      saveAgents()
      ElMessage.success('删除成功')
      activeAgent.value = agents.value[0]?.id || 'new'
    }
  }).catch(() => {})
}

// 初始化
onMounted(() => {
  loadAgents()
})
</script>

<style scoped>
.ai-agent-editor {
  padding: 20px;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.editor-header > div {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
}

.agent-list {
  margin-top: 20px;
}

.agent-edit-card {
  max-width: 900px;
}

.agent-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.agent-card-header h3 {
  margin: 0;
}

.icon-preview {
  margin-top: 8px;
  padding: 8px;
  background: #f5f7fa;
  border-radius: 4px;
}

.preview-icon {
  font-size: 32px;
}

.features-editor,
.scenarios-editor {
  width: 100%;
}

.feature-item,
.scenario-item {
  margin-bottom: 10px;
}

.image-upload-section {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.cover-uploader {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s;
}

.cover-uploader:hover {
  border-color: #409eff;
}

.cover-image {
  width: 300px;
  height: 225px;
  object-fit: cover;
  display: block;
}

.cover-uploader-icon {
  font-size: 48px;
  color: #8c939d;
  width: 300px;
  height: 225px;
  line-height: 225px;
  text-align: center;
}

.image-tips {
  color: #606266;
  font-size: 13px;
}

.image-tips p {
  margin: 5px 0;
}

/* 预览样式 */
.agent-preview {
  padding: 20px;
}

.preview-header {
  display: flex;
  gap: 20px;
  align-items: center;
}

.preview-icon-large {
  font-size: 64px;
}

.preview-info h2 {
  margin: 0 0 8px 0;
}

.preview-info p {
  margin: 0;
  color: #666;
}

.preview-content h3 {
  margin-top: 20px;
  margin-bottom: 10px;
  color: #303133;
}

.preview-content ul {
  padding-left: 20px;
}

.preview-content li {
  margin-bottom: 8px;
  line-height: 1.6;
}

.preview-cover {
  width: 100%;
  max-width: 600px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

:deep(.el-tabs--left .el-tabs__nav) {
  min-width: 180px;
}

:deep(.el-tabs__item) {
  text-align: left;
  padding: 0 20px;
}
</style>
