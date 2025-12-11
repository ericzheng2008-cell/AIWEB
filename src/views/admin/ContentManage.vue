<template>
  <div class="content-manage">
    <div class="page-header">
      <h1>内容管理</h1>
      <p>管理网站首页的图片和文字内容</p>
    </div>

    <el-tabs v-model="activeTab" class="content-tabs">
      <el-tab-pane label="轮播图管理" name="banner">
        <div class="section-header">
          <h2>首页轮播图</h2>
          <el-button type="primary" @click="handleAddBanner">
            <el-icon><Plus /></el-icon>
            添加轮播图
          </el-button>
        </div>

        <div class="banner-list">
          <div v-for="banner in banners" :key="banner.id" class="banner-item">
            <div class="banner-preview">
              <img :src="banner.image" :alt="banner.title" />
              <div class="banner-overlay">
                <el-button @click="handleEditBanner(banner)" circle>
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button @click="handleDeleteBanner(banner)" circle type="danger">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="banner-info">
              <h3>{{ banner.title }}</h3>
              <p>{{ banner.subtitle }}</p>
              <el-tag :type="banner.status === 'active' ? 'success' : 'info'">
                {{ banner.status === 'active' ? '显示中' : '已隐藏' }}
              </el-tag>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <el-tab-pane label="公司信息" name="company">
        <el-form :model="companyInfo" label-width="120px">
          <el-form-item label="公司名称">
            <el-input v-model="companyInfo.name" />
          </el-form-item>
          <el-form-item label="公司介绍">
            <el-input v-model="companyInfo.description" type="textarea" :rows="4" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveCompanyInfo">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>

    <el-dialog v-model="bannerDialogVisible" title="编辑轮播图" width="600px">
      <el-form :model="editingBanner" label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="editingBanner.title" />
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="editingBanner.subtitle" />
        </el-form-item>
        <el-form-item label="图片URL">
          <el-input v-model="editingBanner.image" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="bannerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveBanner">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const activeTab = ref('banner')

const banners = ref([
  {
    id: 1,
    title: '广州市明升伟业机电有限公司',
    subtitle: '成立于1996年',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200',
    status: 'active'
  }
])

const bannerDialogVisible = ref(false)
const editingBanner = reactive({
  id: null,
  title: '',
  subtitle: '',
  image: '',
  status: 'active'
})

const companyInfo = reactive({
  name: '广州市明升伟业机电有限公司',
  description: '专业工业工具供应商'
})

const handleAddBanner = () => {
  Object.assign(editingBanner, { id: null, title: '', subtitle: '', image: '', status: 'active' })
  bannerDialogVisible.value = true
}

const handleEditBanner = (banner) => {
  Object.assign(editingBanner, banner)
  bannerDialogVisible.value = true
}

const handleDeleteBanner = (banner) => {
  ElMessageBox.confirm(`确定要删除轮播图 "${banner.title}" 吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = banners.value.findIndex(b => b.id === banner.id)
    if (index > -1) {
      banners.value.splice(index, 1)
      ElMessage.success('删除成功')
    }
  })
}

const saveBanner = () => {
  if (editingBanner.id) {
    const index = banners.value.findIndex(b => b.id === editingBanner.id)
    if (index > -1) {
      banners.value[index] = { ...editingBanner }
    }
    ElMessage.success('修改成功')
  } else {
    banners.value.push({ ...editingBanner, id: Date.now() })
    ElMessage.success('添加成功')
  }
  bannerDialogVisible.value = false
}

const saveCompanyInfo = () => {
  ElMessage.success('保存成功')
}
</script>

<style scoped>
.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.page-header p {
  font-size: 14px;
  color: #666;
}

.content-tabs {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.banner-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.banner-item {
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
}

.banner-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.banner-preview {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.banner-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.3s;
}

.banner-item:hover .banner-overlay {
  opacity: 1;
}

.banner-info {
  padding: 16px;
}

.banner-info h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

.banner-info p {
  font-size: 13px;
  color: #666;
  margin-bottom: 12px;
}
</style>
