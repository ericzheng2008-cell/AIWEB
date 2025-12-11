<template>
  <div class="knowledge-manager">
    <Header />
    
    <div class="page-container">
      <div class="page-header">
        <h1>AI知识库管理 / AI Knowledge Management</h1>
        <p>训练AI助手，让它更懂您的业务</p>
      </div>

      <div class="manager-content">
        <!-- 左侧：知识分类 -->
        <aside class="categories-sidebar">
          <h3>知识分类</h3>
          <div class="category-list">
            <div
              v-for="(cat, key) in categories"
              :key="key"
              :class="['category-item', { active: activeCategory === key }]"
              @click="activeCategory = key"
            >
              <el-icon><FolderOpened /></el-icon>
              <span>{{ cat.name }}</span>
              <el-badge :value="cat.count" class="item-badge" />
            </div>
          </div>
          
          <el-button type="primary" class="add-category-btn" @click="showAddCategory = true">
            <el-icon><Plus /></el-icon> 新增分类
          </el-button>
        </aside>

        <!-- 右侧：知识管理 -->
        <main class="knowledge-main">
          <!-- 工具栏 -->
          <div class="toolbar">
            <el-button type="primary" @click="showAddKnowledge = true">
              <el-icon><Plus /></el-icon> 添加知识
            </el-button>
            <el-button @click="exportKnowledge">
              <el-icon><Download /></el-icon> 导出知识库
            </el-button>
            <el-button @click="importKnowledge">
              <el-icon><Upload /></el-icon> 导入知识库
            </el-button>
          </div>

          <!-- 知识列表 -->
          <div class="knowledge-list">
            <el-table :data="currentKnowledge" style="width: 100%">
              <el-table-column label="关键词" width="200">
                <template #default="{ row }">
                  <el-tag
                    v-for="keyword in row.keywords"
                    :key="keyword"
                    size="small"
                    style="margin-right: 5px"
                  >
                    {{ keyword }}
                  </el-tag>
                </template>
              </el-table-column>
              
              <el-table-column label="中文回答" min-width="300">
                <template #default="{ row }">
                  <div class="answer-preview">{{ row.answers['zh-CN'] }}</div>
                </template>
              </el-table-column>
              
              <el-table-column label="英文回答" min-width="300">
                <template #default="{ row }">
                  <div class="answer-preview">{{ row.answers['en-US'] }}</div>
                </template>
              </el-table-column>
              
              <el-table-column label="操作" width="150" fixed="right">
                <template #default="{ row }">
                  <el-button size="small" @click="editKnowledge(row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteKnowledge(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 统计信息 -->
          <div class="statistics">
            <el-card class="stat-card">
              <el-statistic title="知识总数" :value="totalKnowledge" />
            </el-card>
            <el-card class="stat-card">
              <el-statistic title="关键词数量" :value="totalKeywords" />
            </el-card>
            <el-card class="stat-card">
              <el-statistic title="问答次数" :value="chatStore.messages.length" />
            </el-card>
          </div>
        </main>
      </div>
    </div>

    <!-- 添加知识对话框 -->
    <el-dialog
      v-model="showAddKnowledge"
      title="添加知识"
      width="800px"
    >
      <el-form :model="knowledgeForm" label-width="100px">
        <el-form-item label="分类">
          <el-select v-model="knowledgeForm.category" placeholder="请选择分类">
            <el-option
              v-for="(cat, key) in categories"
              :key="key"
              :label="cat.name"
              :value="key"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="关键词">
          <el-tag
            v-for="keyword in knowledgeForm.keywords"
            :key="keyword"
            closable
            @close="removeKeyword(keyword)"
            style="margin-right: 10px"
          >
            {{ keyword }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="inputRef"
            v-model="inputValue"
            size="small"
            style="width: 100px"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button v-else size="small" @click="showInput">
            + 添加关键词
          </el-button>
        </el-form-item>
        
        <el-form-item label="中文回答">
          <el-input
            v-model="knowledgeForm.answers['zh-CN']"
            type="textarea"
            :rows="4"
            placeholder="请输入中文回答"
          />
        </el-form-item>
        
        <el-form-item label="英文回答">
          <el-input
            v-model="knowledgeForm.answers['en-US']"
            type="textarea"
            :rows="4"
            placeholder="Please enter English answer"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showAddKnowledge = false">取消</el-button>
        <el-button type="primary" @click="saveKnowledge">保存</el-button>
      </template>
    </el-dialog>

    <!-- 添加分类对话框 -->
    <el-dialog
      v-model="showAddCategory"
      title="添加分类"
      width="400px"
    >
      <el-form :model="categoryForm" label-width="100px">
        <el-form-item label="分类标识">
          <el-input v-model="categoryForm.key" placeholder="如: newCategory" />
        </el-form-item>
        <el-form-item label="分类名称">
          <el-input v-model="categoryForm.name" placeholder="如: 新产品介绍" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="showAddCategory = false">取消</el-button>
        <el-button type="primary" @click="saveCategory">保存</el-button>
      </template>
    </el-dialog>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { useAiChatStore } from '../store/aiChat'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

const chatStore = useAiChatStore()

const activeCategory = ref('products')
const showAddKnowledge = ref(false)
const showAddCategory = ref(false)
const inputVisible = ref(false)
const inputValue = ref('')
const inputRef = ref(null)

const categories = computed(() => {
  const cats = {}
  for (const [key, data] of Object.entries(chatStore.knowledgeBase)) {
    cats[key] = {
      name: getCategoryName(key),
      count: data.keywords.length
    }
  }
  return cats
})

const currentKnowledge = computed(() => {
  const category = chatStore.knowledgeBase[activeCategory.value]
  if (!category) return []
  
  return [{
    keywords: category.keywords,
    answers: category.answers
  }]
})

const totalKnowledge = computed(() => {
  return Object.keys(chatStore.knowledgeBase).length
})

const totalKeywords = computed(() => {
  let total = 0
  for (const data of Object.values(chatStore.knowledgeBase)) {
    total += data.keywords.length
  }
  return total
})

const knowledgeForm = ref({
  category: 'products',
  keywords: [],
  answers: {
    'zh-CN': '',
    'en-US': ''
  }
})

const categoryForm = ref({
  key: '',
  name: ''
})

const getCategoryName = (key) => {
  const names = {
    products: '产品介绍',
    divisions: '事业部信息',
    applications: '应用案例',
    contact: '联系方式',
    cooperation: '商务合作',
    service: '售后服务',
    customization: '定制服务'
  }
  return names[key] || key
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    inputRef.value?.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    knowledgeForm.value.keywords.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

const removeKeyword = (keyword) => {
  const index = knowledgeForm.value.keywords.indexOf(keyword)
  if (index > -1) {
    knowledgeForm.value.keywords.splice(index, 1)
  }
}

const saveKnowledge = () => {
  if (knowledgeForm.value.keywords.length === 0) {
    ElMessage.warning('请至少添加一个关键词')
    return
  }
  
  if (!knowledgeForm.value.answers['zh-CN']) {
    ElMessage.warning('请填写中文回答')
    return
  }
  
  chatStore.addKnowledge(
    knowledgeForm.value.category,
    knowledgeForm.value.keywords,
    knowledgeForm.value.answers
  )
  
  ElMessage.success('知识添加成功！')
  showAddKnowledge.value = false
  resetKnowledgeForm()
}

const saveCategory = () => {
  if (!categoryForm.value.key || !categoryForm.value.name) {
    ElMessage.warning('请填写完整信息')
    return
  }
  
  chatStore.knowledgeBase[categoryForm.value.key] = {
    keywords: [],
    answers: {
      'zh-CN': '',
      'en-US': ''
    }
  }
  
  ElMessage.success('分类添加成功！')
  showAddCategory.value = false
  categoryForm.value = { key: '', name: '' }
}

const resetKnowledgeForm = () => {
  knowledgeForm.value = {
    category: 'products',
    keywords: [],
    answers: {
      'zh-CN': '',
      'en-US': ''
    }
  }
}

const editKnowledge = (row) => {
  knowledgeForm.value = {
    category: activeCategory.value,
    keywords: [...row.keywords],
    answers: { ...row.answers }
  }
  showAddKnowledge.value = true
}

const deleteKnowledge = (row) => {
  delete chatStore.knowledgeBase[activeCategory.value]
  ElMessage.success('知识删除成功！')
}

const exportKnowledge = () => {
  const data = JSON.stringify(chatStore.knowledgeBase, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'ai-knowledge-base.json'
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('知识库导出成功！')
}

const importKnowledge = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        chatStore.knowledgeBase = data
        ElMessage.success('知识库导入成功！')
      } catch (error) {
        ElMessage.error('文件格式错误！')
      }
    }
    reader.readAsText(file)
  }
  input.click()
}
</script>

<style scoped>
.knowledge-manager {
  min-height: 100vh;
  background: #f5f7fa;
}

.page-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
}

.page-header h1 {
  font-size: 36px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.page-header p {
  font-size: 16px;
  color: #666;
}

.manager-content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;
}

.categories-sidebar {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  height: fit-content;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.categories-sidebar h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #1a1a1a;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  color: #666;
}

.category-item:hover {
  background: #f0f7ff;
  color: #1890ff;
}

.category-item.active {
  background: linear-gradient(135deg, #1890ff 0%, #0066cc 100%);
  color: #fff;
}

.item-badge {
  margin-left: auto;
}

.add-category-btn {
  width: 100%;
}

.knowledge-main {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.knowledge-list {
  margin-bottom: 24px;
}

.answer-preview {
  max-height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

.statistics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 24px;
}

.stat-card {
  text-align: center;
}
</style>
