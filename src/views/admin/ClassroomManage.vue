<template>
  <div class="classroom-manage">
    <el-card class="header-card">
      <h2><el-icon><Reading /></el-icon> 产品技术销售小课堂管理</h2>
      <p>管理技术课程的分类和内容，支持多级分类体系</p>
    </el-card>

    <el-tabs v-model="activeTab" class="manage-tabs">
      <!-- 一级分类管理 -->
      <el-tab-pane label="一级分类管理" name="categories">
        <el-card>
          <div class="section-header">
            <h3>一级分类列表</h3>
            <el-button type="primary" @click="showCategoryDialog()">
              <el-icon><Plus /></el-icon> 添加一级分类
            </el-button>
          </div>

          <el-table :data="store.getAllCategories" style="width: 100%">
            <el-table-column prop="order" label="排序" width="80" />
            <el-table-column label="图标" width="80">
              <template #default="scope">
                <span style="font-size: 32px;">{{ scope.row.icon }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="分类名称" width="200" />
            <el-table-column prop="description" label="描述" />
            <el-table-column label="二级分类数量" width="120">
              <template #default="scope">
                <el-tag>{{ store.getSubcategoriesByCategory(scope.row.id).length }} 个</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="课程数量" width="120">
              <template #default="scope">
                <el-tag type="success">{{ store.getLessonsByCategory(scope.row.id).length }} 个</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="scope">
                <el-button size="small" @click="showCategoryDialog(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteCategory(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- 二级分类管理 -->
      <el-tab-pane label="二级分类管理" name="subcategories">
        <el-card>
          <div class="section-header">
            <h3>二级分类列表</h3>
            <el-button type="primary" @click="showSubcategoryDialog()">
              <el-icon><Plus /></el-icon> 添加二级分类
            </el-button>
          </div>

          <!-- 按一级分类分组显示 -->
          <div v-for="category in store.getAllCategories" :key="category.id" class="category-group">
            <div class="category-group-header">
              <span class="category-icon">{{ category.icon }}</span>
              <h4>{{ category.name }}</h4>
              <el-tag type="info">{{ store.getSubcategoriesByCategory(category.id).length }} 个二级分类</el-tag>
            </div>
            
            <el-table :data="store.getSubcategoriesByCategory(category.id)" style="width: 100%">
              <el-table-column prop="order" label="排序" width="80" />
              <el-table-column prop="name" label="二级分类名称" />
              <el-table-column label="课程数量" width="120">
                <template #default="scope">
                  <el-tag type="success">{{ store.getLessonsBySubcategory(scope.row.id).length }} 个</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template #default="scope">
                  <el-button size="small" @click="showSubcategoryDialog(scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteSubcategory(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-tab-pane>

      <!-- 课程管理 -->
      <el-tab-pane label="课程管理" name="lessons">
        <el-card>
          <div class="section-header">
            <h3>课程列表</h3>
            <el-button type="primary" @click="showLessonDialog()">
              <el-icon><Plus /></el-icon> 添加课程
            </el-button>
          </div>

          <el-form :inline="true" class="filter-form">
            <el-form-item label="一级分类">
              <el-select v-model="filterCategory" placeholder="选择分类" clearable @change="onFilterChange">
                <el-option
                  v-for="cat in store.getAllCategories"
                  :key="cat.id"
                  :label="cat.name"
                  :value="cat.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
              <el-select v-model="filterSubcategory" placeholder="选择子分类" clearable :disabled="!filterCategory">
                <el-option
                  v-for="sub in store.getSubcategoriesByCategory(filterCategory)"
                  :key="sub.id"
                  :label="sub.name"
                  :value="sub.id" />
              </el-select>
            </el-form-item>
          </el-form>

          <el-table :data="filteredLessons" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column label="封面" width="100">
              <template #default="scope">
                <img v-if="scope.row.coverImage" :src="scope.row.coverImage" class="lesson-cover" />
                <div v-else class="no-cover">无封面</div>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="课程标题" width="250" />
            <el-table-column label="分类" width="200">
              <template #default="scope">
                <div>
                  <el-tag size="small">{{ getCategoryName(scope.row.categoryId) }}</el-tag>
                  <br />
                  <el-tag size="small" type="success" style="margin-top: 5px;">
                    {{ getSubcategoryName(scope.row.subcategoryId) }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="level" label="难度" width="80">
              <template #default="scope">
                <el-tag :type="getLevelType(scope.row.level)" size="small">{{ scope.row.level }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="duration" label="时长" width="100" />
            <el-table-column label="数据" width="150">
              <template #default="scope">
                <div class="stats">
                  <span><el-icon><View /></el-icon> {{ scope.row.views }}</span>
                  <span><el-icon><StarFilled /></el-icon> {{ scope.row.likes }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="scope">
                <el-button size="small" @click="showLessonDialog(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteLesson(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 一级分类编辑对话框 -->
    <el-dialog
      v-model="categoryDialogVisible"
      :title="categoryForm.id ? '编辑一级分类' : '添加一级分类'"
      width="600px">
      <el-form :model="categoryForm" label-width="100px">
        <el-form-item label="分类名称" required>
          <el-input v-model="categoryForm.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="图标" required>
          <el-input v-model="categoryForm.icon" placeholder="请输入图标 Emoji，如 🤖" />
          <div v-if="categoryForm.icon" class="icon-preview">
            预览: <span style="font-size: 32px;">{{ categoryForm.icon }}</span>
          </div>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="categoryForm.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="categoryForm.order" :min="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="categoryDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCategory">保存</el-button>
      </template>
    </el-dialog>

    <!-- 二级分类编辑对话框 -->
    <el-dialog
      v-model="subcategoryDialogVisible"
      :title="subcategoryForm.id ? '编辑二级分类' : '添加二级分类'"
      width="600px">
      <el-form :model="subcategoryForm" label-width="100px">
        <el-form-item label="一级分类" required>
          <el-select v-model="subcategoryForm.categoryId" placeholder="请选择一级分类">
            <el-option
              v-for="cat in store.getAllCategories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id">
              <span>{{ cat.icon }} {{ cat.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" required>
          <el-input v-model="subcategoryForm.name" placeholder="请输入二级分类名称" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="subcategoryForm.order" :min="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="subcategoryDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSubcategory">保存</el-button>
      </template>
    </el-dialog>

    <!-- 课程编辑对话框 -->
    <el-dialog
      v-model="lessonDialogVisible"
      :title="lessonForm.id ? '编辑课程' : '添加课程'"
      width="800px"
      :close-on-click-modal="false">
      <el-form :model="lessonForm" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="一级分类" required>
              <el-select v-model="lessonForm.categoryId" placeholder="选择一级分类" @change="onLessonCategoryChange">
                <el-option
                  v-for="cat in store.getAllCategories"
                  :key="cat.id"
                  :label="cat.name"
                  :value="cat.id">
                  <span>{{ cat.icon }} {{ cat.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="二级分类" required>
              <el-select v-model="lessonForm.subcategoryId" placeholder="选择二级分类" :disabled="!lessonForm.categoryId">
                <el-option
                  v-for="sub in store.getSubcategoriesByCategory(lessonForm.categoryId)"
                  :key="sub.id"
                  :label="sub.name"
                  :value="sub.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="课程标题" required>
          <el-input v-model="lessonForm.title" placeholder="请输入课程标题" />
        </el-form-item>

        <el-form-item label="简短描述">
          <el-input v-model="lessonForm.description" type="textarea" :rows="2" placeholder="一句话描述课程内容" />
        </el-form-item>

        <el-form-item label="课程内容">
          <el-input v-model="lessonForm.content" type="textarea" :rows="8" placeholder="详细的课程内容，支持Markdown格式" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="难度等级">
              <el-select v-model="lessonForm.level" placeholder="选择难度">
                <el-option label="入门" value="入门" />
                <el-option label="初级" value="初级" />
                <el-option label="中级" value="中级" />
                <el-option label="高级" value="高级" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="课程时长">
              <el-input v-model="lessonForm.duration" placeholder="如：30分钟" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="作者">
              <el-input v-model="lessonForm.author" placeholder="作者姓名" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="标签">
          <el-select v-model="lessonForm.tags" multiple placeholder="添加标签" allow-create filterable>
            <el-option label="基础" value="基础" />
            <el-option label="进阶" value="进阶" />
            <el-option label="实战" value="实战" />
            <el-option label="案例" value="案例" />
          </el-select>
        </el-form-item>

        <el-form-item label="封面图片">
          <div class="image-upload-section">
            <el-upload
              class="cover-uploader"
              action="#"
              :show-file-list="false"
              :auto-upload="false"
              :on-change="handleCoverChange"
              accept="image/*">
              <img v-if="lessonForm.coverImage" :src="lessonForm.coverImage" class="cover-preview" />
              <el-icon v-else class="upload-icon"><Plus /></el-icon>
            </el-upload>
            <div class="upload-tips">
              <p>建议尺寸: 800x450px</p>
              <p>支持格式: JPG, PNG</p>
              <el-button 
                v-if="lessonForm.coverImage" 
                type="danger" 
                size="small"
                @click="lessonForm.coverImage = ''"
                style="margin-top: 10px;">
                删除图片
              </el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="图片URL">
          <el-input v-model="lessonForm.coverImage" placeholder="或直接输入图片URL" clearable />
        </el-form-item>

        <el-form-item label="发布状态">
          <el-radio-group v-model="lessonForm.status">
            <el-radio label="published">已发布</el-radio>
            <el-radio label="draft">草稿</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="lessonDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveLesson">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Reading, Plus, View, StarFilled } from '@element-plus/icons-vue'
import { useClassroomStore } from '../../store/classroom'

const store = useClassroomStore()

// 状态管理
const activeTab = ref('categories')
const categoryDialogVisible = ref(false)
const subcategoryDialogVisible = ref(false)
const lessonDialogVisible = ref(false)

// 筛选
const filterCategory = ref(null)
const filterSubcategory = ref(null)

// 表单数据
const categoryForm = ref({
  id: null,
  name: '',
  icon: '',
  description: '',
  order: 1
})

const subcategoryForm = ref({
  id: null,
  categoryId: null,
  name: '',
  order: 1
})

const lessonForm = ref({
  id: null,
  categoryId: null,
  subcategoryId: null,
  title: '',
  description: '',
  content: '',
  coverImage: '',
  author: '',
  duration: '',
  level: '入门',
  tags: [],
  status: 'published'
})

// 计算属性
const filteredLessons = computed(() => {
  let lessons = store.lessons
  if (filterCategory.value) {
    lessons = lessons.filter(l => l.categoryId === filterCategory.value)
  }
  if (filterSubcategory.value) {
    lessons = lessons.filter(l => l.subcategoryId === filterSubcategory.value)
  }
  return lessons
})

// 方法
const onFilterChange = () => {
  filterSubcategory.value = null
}

const getCategoryName = (categoryId) => {
  const cat = store.categories.find(c => c.id === categoryId)
  return cat ? cat.name : ''
}

const getSubcategoryName = (subcategoryId) => {
  const sub = store.subcategories.find(s => s.id === subcategoryId)
  return sub ? sub.name : ''
}

const getLevelType = (level) => {
  const types = {
    '入门': 'info',
    '初级': 'success',
    '中级': 'warning',
    '高级': 'danger'
  }
  return types[level] || 'info'
}

// 一级分类操作
const showCategoryDialog = (category = null) => {
  if (category) {
    categoryForm.value = { ...category }
  } else {
    categoryForm.value = {
      id: null,
      name: '',
      icon: '',
      description: '',
      order: store.categories.length + 1
    }
  }
  categoryDialogVisible.value = true
}

const saveCategory = () => {
  if (!categoryForm.value.name || !categoryForm.value.icon) {
    ElMessage.warning('请填写分类名称和图标')
    return
  }
  
  if (categoryForm.value.id) {
    store.updateCategory(categoryForm.value)
    ElMessage.success('更新成功')
  } else {
    store.addCategory(categoryForm.value)
    ElMessage.success('添加成功')
  }
  
  categoryDialogVisible.value = false
}

const deleteCategory = (id) => {
  ElMessageBox.confirm('删除分类将同时删除其下的所有子分类和课程，确定要删除吗？', '警告', {
    type: 'warning'
  }).then(() => {
    store.deleteCategory(id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 二级分类操作
const showSubcategoryDialog = (subcategory = null) => {
  if (subcategory) {
    subcategoryForm.value = { ...subcategory }
  } else {
    subcategoryForm.value = {
      id: null,
      categoryId: null,
      name: '',
      order: 1
    }
  }
  subcategoryDialogVisible.value = true
}

const saveSubcategory = () => {
  if (!subcategoryForm.value.categoryId || !subcategoryForm.value.name) {
    ElMessage.warning('请选择一级分类并填写名称')
    return
  }
  
  if (subcategoryForm.value.id) {
    store.updateSubcategory(subcategoryForm.value)
    ElMessage.success('更新成功')
  } else {
    store.addSubcategory(subcategoryForm.value)
    ElMessage.success('添加成功')
  }
  
  subcategoryDialogVisible.value = false
}

const deleteSubcategory = (id) => {
  ElMessageBox.confirm('删除二级分类将同时删除其下的所有课程，确定要删除吗？', '警告', {
    type: 'warning'
  }).then(() => {
    store.deleteSubcategory(id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 课程操作
const showLessonDialog = (lesson = null) => {
  if (lesson) {
    lessonForm.value = { ...lesson }
  } else {
    lessonForm.value = {
      id: null,
      categoryId: null,
      subcategoryId: null,
      title: '',
      description: '',
      content: '',
      coverImage: '',
      author: '技术专家',
      duration: '',
      level: '入门',
      tags: [],
      status: 'published'
    }
  }
  lessonDialogVisible.value = true
}

const onLessonCategoryChange = () => {
  lessonForm.value.subcategoryId = null
}

const handleCoverChange = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    lessonForm.value.coverImage = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

const saveLesson = () => {
  if (!lessonForm.value.categoryId || !lessonForm.value.subcategoryId || !lessonForm.value.title) {
    ElMessage.warning('请填写必填项')
    return
  }
  
  if (lessonForm.value.id) {
    store.updateLesson(lessonForm.value)
    ElMessage.success('更新成功')
  } else {
    store.addLesson(lessonForm.value)
    ElMessage.success('添加成功')
  }
  
  lessonDialogVisible.value = false
}

const deleteLesson = (id) => {
  ElMessageBox.confirm('确定要删除这个课程吗？', '警告', {
    type: 'warning'
  }).then(() => {
    store.deleteLesson(id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 初始化
onMounted(() => {
  store.loadFromLocalStorage()
})
</script>

<style scoped>
.classroom-manage {
  padding: 20px;
}

.header-card {
  margin-bottom: 20px;
}

.header-card h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
  margin-bottom: 8px;
}

.header-card p {
  color: #666;
  font-size: 14px;
}

.manage-tabs {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  font-size: 18px;
  margin: 0;
}

.category-group {
  margin-bottom: 30px;
}

.category-group-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  margin-bottom: 12px;
}

.category-icon {
  font-size: 32px;
}

.category-group-header h4 {
  margin: 0;
  flex: 1;
  font-size: 18px;
}

.filter-form {
  margin-bottom: 20px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.lesson-cover {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.no-cover {
  width: 80px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  color: #999;
  font-size: 12px;
  border-radius: 4px;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stats span {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.icon-preview {
  margin-top: 10px;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
  text-align: center;
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

.cover-preview {
  width: 200px;
  height: 150px;
  object-fit: cover;
  display: block;
}

.upload-icon {
  font-size: 48px;
  color: #8c939d;
  width: 200px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}

.upload-tips {
  color: #606266;
  font-size: 13px;
}

.upload-tips p {
  margin: 5px 0;
}
</style>
