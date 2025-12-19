<template>
  <div class="products-manage">
    <div class="page-header">
      <h1>产品管理</h1>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        添加产品
      </el-button>
    </div>

    <div class="filter-bar">
      <el-input 
        v-model="searchKeyword" 
        placeholder="搜索产品名称、品牌"
        style="width: 300px"
        clearable
      >
        <template #prefix>
          <el-icon><Search /></el-icon>
        </template>
      </el-input>
      <el-select v-model="filterCategory" placeholder="选择分类" clearable style="width: 200px">
        <el-option label="全部分类" value="" />
        <el-option label="自动化设备" value="自动化设备" />
        <el-option label="工业工具" value="工业工具" />
      </el-select>
    </div>

    <el-table :data="filteredProducts" style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column label="产品图片" width="100">
        <template #default="{ row }">
          <el-image :src="row.image" style="width: 60px; height: 60px" fit="cover" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="产品名称" min-width="200" />
      <el-table-column prop="brand" label="品牌" width="120" />
      <el-table-column prop="category" label="分类" width="150" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === 'active' ? 'success' : 'info'">
            {{ row.status === 'active' ? '上架' : '下架' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" text @click="handleEdit(row)">编辑</el-button>
          <el-button type="danger" text @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next, jumper"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const searchKeyword = ref('')
const filterCategory = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

const products = ref([
  { 
    id: 1, 
    name: 'SCA自动涂胶机', 
    brand: 'SCA', 
    category: '自动化设备', 
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=200', 
    status: 'active' 
  },
  { 
    id: 2, 
    name: 'Bosch博世电池工具', 
    brand: 'Bosch', 
    category: '工业工具', 
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=200', 
    status: 'active' 
  },
  { 
    id: 3, 
    name: 'Gudel七轴机器人', 
    brand: 'Gudel', 
    category: '自动化设备', 
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=200', 
    status: 'active' 
  }
])

const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchKeyword = !searchKeyword.value || 
      p.name.includes(searchKeyword.value) || 
      p.brand.includes(searchKeyword.value)
    const matchCategory = !filterCategory.value || p.category === filterCategory.value
    return matchKeyword && matchCategory
  })
})

const total = computed(() => filteredProducts.value.length)

const handleAdd = () => {
  ElMessage.info('添加产品功能开发中...')
}

const handleEdit = (row) => {
  ElMessage.info(`编辑产品: ${row.name}`)
}

const handleDelete = (row) => {
  ElMessageBox.confirm(`确定要删除产品 "${row.name}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = products.value.findIndex(p => p.id === row.id)
    if (index > -1) {
      products.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  })
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.filter-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}
</style>
