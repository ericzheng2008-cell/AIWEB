<template>
  <el-card>
    <div class="section-header">
      <h3>应用案例分类管理</h3>
      <el-button type="primary" @click="showAddDialog(1)">
        <el-icon><Plus /></el-icon> 添加一级分类
      </el-button>
    </div>

    <el-tree
      :data="categoryTreeData"
      :props="{ label: 'label', children: 'children' }"
      node-key="id"
      default-expand-all
      class="category-tree">
      <template #default="{ node, data }">
        <div class="tree-node">
          <span class="node-label">
            <el-tag :type="getLevelType(data.level)" size="small">{{ data.level }}级</el-tag>
            {{ data.label }}
          </span>
          <span class="node-actions">
            <el-button 
              v-if="data.level < 3" 
              size="small" 
              text
              @click.stop="showAddDialog(data.level + 1, data.realId)">
              添加子分类
            </el-button>
            <el-button size="small" text @click.stop="editCategory(data)">编辑</el-button>
            <el-button size="small" text type="danger" @click.stop="deleteCategory(data)">删除</el-button>
          </span>
        </div>
      </template>
    </el-tree>
  </el-card>

  <!-- 分类编辑对话框 -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
    <el-form :model="categoryForm" label-width="120px">
      <el-form-item label="中文名称">
        <el-input v-model="categoryForm.name['zh-CN']" />
      </el-form-item>
      <el-form-item label="英文名称">
        <el-input v-model="categoryForm.name['en-US']" />
      </el-form-item>
      <el-form-item label="分类图标">
        <ImageUploader v-model="categoryForm.icon" alt="分类图标" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="saveCategory">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { usePageContentStore } from '../store/pageContent'
import ImageUploader from './ImageUploader.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const pageContentStore = usePageContentStore()

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('')
const categoryForm = reactive({
  id: null,
  level: 1,
  parentId: null,
  name: { 'zh-CN': '', 'en-US': '' },
  icon: ''
})

// 构建分类树
const categoryTreeData = computed(() => {
  const buildTree = (parentId, level) => {
    const categories = level === 1 
      ? pageContentStore.solutionCategories 
      : level === 2 
        ? pageContentStore.solutionSubCategories
        : pageContentStore.solutionThirdCategories

    return categories
      .filter(cat => level === 1 || cat.parentId === parentId)
      .map(cat => ({
        id: `${level === 1 ? 'cat' : level === 2 ? 'sub' : 'third'}-${cat.id}`,
        realId: cat.id,
        level: level,
        label: cat.name['zh-CN'],
        children: level < 3 ? buildTree(cat.id, level + 1) : []
      }))
  }
  return buildTree(null, 1)
})

// 获取级别标签类型
const getLevelType = (level) => {
  return ['', 'primary', 'success', 'warning'][level]
}

// 显示添加对话框
const showAddDialog = (level, parentId = null) => {
  categoryForm.id = null
  categoryForm.level = level
  categoryForm.parentId = parentId
  categoryForm.name = { 'zh-CN': '', 'en-US': '' }
  categoryForm.icon = ''
  dialogTitle.value = `添加${level}级分类`
  dialogVisible.value = true
}

// 编辑分类
const editCategory = (data) => {
  const categories = data.level === 1 
    ? pageContentStore.solutionCategories 
    : data.level === 2 
      ? pageContentStore.solutionSubCategories
      : pageContentStore.solutionThirdCategories
  
  const cat = categories.find(c => c.id === data.realId)
  if (cat) {
    categoryForm.id = cat.id
    categoryForm.level = data.level
    categoryForm.parentId = cat.parentId || null
    categoryForm.name = { ...cat.name }
    categoryForm.icon = cat.icon || ''
    dialogTitle.value = `编辑${data.level}级分类`
    dialogVisible.value = true
  }
}

// 保存分类
const saveCategory = () => {
  const category = {
    id: categoryForm.id || Date.now(),
    parentId: categoryForm.parentId,
    name: { ...categoryForm.name },
    icon: categoryForm.icon
  }

  if (categoryForm.id) {
    // 更新
    if (categoryForm.level === 1) {
      pageContentStore.updateSolutionCategory(category)
    } else if (categoryForm.level === 2) {
      pageContentStore.updateSolutionSubCategory(category)
    } else {
      pageContentStore.updateSolutionThirdCategory(category)
    }
  } else {
    // 添加
    if (categoryForm.level === 1) {
      pageContentStore.addSolutionCategory(category)
    } else if (categoryForm.level === 2) {
      pageContentStore.addSolutionSubCategory(category)
    } else {
      pageContentStore.addSolutionThirdCategory(category)
    }
  }

  dialogVisible.value = false
  ElMessage.success('保存成功')
}

// 删除分类
const deleteCategory = (data) => {
  ElMessageBox.confirm('确认删除该分类吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    if (data.level === 1) {
      pageContentStore.deleteSolutionCategory(data.realId)
    } else if (data.level === 2) {
      pageContentStore.deleteSolutionSubCategory(data.realId)
    } else {
      pageContentStore.deleteSolutionThirdCategory(data.realId)
    }
    ElMessage.success('删除成功')
  }).catch(() => {})
}
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.category-tree {
  margin-top: 20px;
}

.tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
}

.node-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.node-actions {
  display: flex;
  gap: 5px;
}
</style>
