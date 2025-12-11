<template>
  <div class="content-editor">
    <el-card class="page-header">
      <h2>可视化内容编辑器</h2>
      <p>管理网站的所有可编辑内容，包括LOGO、Banner、产品等</p>
    </el-card>

    <el-tabs v-model="activeTab" class="editor-tabs">
      <!-- 网站配置 -->
      <el-tab-pane label="网站配置" name="siteConfig">
        <el-card>
          <el-form :model="siteConfig" label-width="120px">
            <el-form-item label="网站名称">
              <el-input v-model="siteConfig.siteName" placeholder="请输入网站名称" />
            </el-form-item>
            
            <el-form-item label="网站Logo">
              <el-upload
                class="logo-uploader"
                :show-file-list="false"
                :on-success="handleLogoSuccess"
                :before-upload="beforeUpload"
                action="/api/upload">
                <img v-if="siteConfig.logo" :src="siteConfig.logo" class="logo-preview" />
                <el-icon v-else class="logo-uploader-icon"><Plus /></el-icon>
              </el-upload>
              <div class="upload-tip">建议尺寸: 200x60px, 支持JPG/PNG格式</div>
            </el-form-item>
            
            <el-form-item label="网站描述">
              <el-input 
                v-model="siteConfig.description" 
                type="textarea" 
                :rows="3"
                placeholder="请输入网站描述" />
            </el-form-item>
            
            <el-form-item label="关键词">
              <el-input v-model="siteConfig.keywords" placeholder="请输入关键词，用逗号分隔" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveSiteConfig">保存配置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      <!-- Banner管理 -->
      <el-tab-pane label="Banner管理" name="banners">
        <el-card>
          <div class="section-header">
            <h3>轮播图管理</h3>
            <el-button type="primary" @click="showBannerDialog()">
              <el-icon><Plus /></el-icon>
              添加Banner
            </el-button>
          </div>

          <el-table :data="banners" style="width: 100%">
            <el-table-column type="index" label="#" width="50" />
            <el-table-column label="预览图" width="200">
              <template #default="{ row }">
                <img :src="row.image" class="table-image" />
              </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" />
            <el-table-column prop="subtitle" label="副标题" />
            <el-table-column prop="buttonText" label="按钮文字" width="120" />
            <el-table-column label="状态" width="100">
              <template #default="{ row }">
                <el-switch v-model="row.active" @change="toggleBannerStatus(row)" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <el-button size="small" @click="showBannerDialog(row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteBanner(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- 产品分类 -->
      <el-tab-pane label="产品分类" name="categories">
        <el-card>
          <div class="section-header">
            <h3>产品分类管理</h3>
            <el-button type="primary" @click="showCategoryDialog()">
              <el-icon><Plus /></el-icon>
              添加分类
            </el-button>
          </div>

          <el-table :data="categories" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="分类名称" />
            <el-table-column prop="description" label="描述" />
            <el-table-column prop="icon" label="图标" width="100" />
            <el-table-column label="操作" width="200">
              <template #default="{ row }">
                <el-button size="small" @click="showCategoryDialog(row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteCategory(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- Banner编辑对话框 -->
    <el-dialog
      v-model="bannerDialogVisible"
      :title="currentBanner.id ? '编辑Banner' : '添加Banner'"
      width="600px">
      <el-form :model="currentBanner" label-width="100px">
        <el-form-item label="标题">
          <el-input v-model="currentBanner.title" />
        </el-form-item>
        <el-form-item label="副标题">
          <el-input v-model="currentBanner.subtitle" />
        </el-form-item>
        <el-form-item label="按钮文字">
          <el-input v-model="currentBanner.buttonText" />
        </el-form-item>
        <el-form-item label="背景图片">
          <el-upload
            class="banner-uploader"
            :show-file-list="false"
            :on-success="handleBannerImageSuccess"
            :before-upload="beforeUpload"
            action="/api/upload">
            <img v-if="currentBanner.image" :src="currentBanner.image" class="banner-preview" />
            <el-icon v-else class="uploader-icon"><Plus /></el-icon>
          </el-upload>
          <div class="upload-tip">建议尺寸: 1920x600px</div>
        </el-form-item>
        <el-form-item label="链接地址">
          <el-input v-model="currentBanner.link" placeholder="点击跳转的链接" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="bannerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveBanner">保存</el-button>
      </template>
    </el-dialog>

    <!-- 分类编辑对话框 -->
    <el-dialog
      v-model="categoryDialogVisible"
      :title="currentCategory.id ? '编辑分类' : '添加分类'"
      width="500px">
      <el-form :model="currentCategory" label-width="100px">
        <el-form-item label="分类名称">
          <el-input v-model="currentCategory.name" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="currentCategory.description" type="textarea" />
        </el-form-item>
        <el-form-item label="图标">
          <el-select v-model="currentCategory.icon" placeholder="选择图标">
            <el-option label="设置" value="SetUp" />
            <el-option label="文件" value="Files" />
            <el-option label="显示器" value="Monitor" />
            <el-option label="服务" value="Service" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="categoryDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCategory">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useContentStore } from '../../store'

const contentStore = useContentStore()

const activeTab = ref('siteConfig')

// 网站配置
const siteConfig = ref({
  siteName: '企业营销平台',
  logo: '/logo.png',
  description: '专业的企业级营销获客解决方案',
  keywords: '营销,获客,电商,推广'
})

// Banner管理
const banners = ref([
  {
    id: 1,
    title: '专业的企业营销解决方案',
    subtitle: '助力企业实现营销获客闭环',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920',
    buttonText: '了解更多',
    link: '/about',
    active: true
  }
])

const bannerDialogVisible = ref(false)
const currentBanner = ref({})

// 分类管理
const categories = ref([
  { id: 1, name: '工业设备', description: '专业工业设备解决方案', icon: 'SetUp' },
  { id: 2, name: '办公用品', description: '高效办公用品供应', icon: 'Files' },
  { id: 3, name: '电子产品', description: '前沿电子产品', icon: 'Monitor' },
  { id: 4, name: '服务方案', description: '定制化服务方案', icon: 'Service' }
])

const categoryDialogVisible = ref(false)
const currentCategory = ref({})

// 保存网站配置
const saveSiteConfig = () => {
  contentStore.updateSiteConfig(siteConfig.value)
  ElMessage.success('网站配置已保存')
}

// Logo上传
const handleLogoSuccess = (response, file) => {
  siteConfig.value.logo = URL.createObjectURL(file.raw)
  ElMessage.success('Logo上传成功')
}

// Banner图片上传
const handleBannerImageSuccess = (response, file) => {
  currentBanner.value.image = URL.createObjectURL(file.raw)
}

// 文件上传前验证
const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('图片大小不能超过 5MB!')
    return false
  }
  return true
}

// Banner操作
const showBannerDialog = (banner = null) => {
  if (banner) {
    currentBanner.value = { ...banner }
  } else {
    currentBanner.value = {
      title: '',
      subtitle: '',
      buttonText: '了解更多',
      image: '',
      link: '',
      active: true
    }
  }
  bannerDialogVisible.value = true
}

const saveBanner = () => {
  if (currentBanner.value.id) {
    const index = banners.value.findIndex(b => b.id === currentBanner.value.id)
    banners.value[index] = { ...currentBanner.value }
    ElMessage.success('Banner已更新')
  } else {
    currentBanner.value.id = banners.value.length + 1
    banners.value.push({ ...currentBanner.value })
    ElMessage.success('Banner已添加')
  }
  bannerDialogVisible.value = false
}

const toggleBannerStatus = (banner) => {
  ElMessage.success(`Banner已${banner.active ? '启用' : '禁用'}`)
}

const deleteBanner = (id) => {
  ElMessageBox.confirm('确定要删除这个Banner吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = banners.value.findIndex(b => b.id === id)
    banners.value.splice(index, 1)
    ElMessage.success('删除成功')
  })
}

// 分类操作
const showCategoryDialog = (category = null) => {
  if (category) {
    currentCategory.value = { ...category }
  } else {
    currentCategory.value = {
      name: '',
      description: '',
      icon: 'SetUp'
    }
  }
  categoryDialogVisible.value = true
}

const saveCategory = () => {
  if (currentCategory.value.id) {
    const index = categories.value.findIndex(c => c.id === currentCategory.value.id)
    categories.value[index] = { ...currentCategory.value }
    ElMessage.success('分类已更新')
  } else {
    currentCategory.value.id = categories.value.length + 1
    categories.value.push({ ...currentCategory.value })
    ElMessage.success('分类已添加')
  }
  categoryDialogVisible.value = false
}

const deleteCategory = (id) => {
  ElMessageBox.confirm('确定要删除这个分类吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = categories.value.findIndex(c => c.id === id)
    categories.value.splice(index, 1)
    ElMessage.success('删除成功')
  })
}

onMounted(() => {
  // 从store加载数据
  Object.assign(siteConfig.value, contentStore.siteConfig)
})
</script>

<style scoped>
.page-header {
  margin-bottom: 24px;
}

.page-header h2 {
  margin-bottom: 10px;
}

.page-header p {
  color: #666;
}

.editor-tabs {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.logo-uploader,
.banner-uploader {
  display: inline-block;
}

.logo-preview {
  width: 200px;
  height: 60px;
  object-fit: contain;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
}

.banner-preview {
  width: 500px;
  height: 156px;
  object-fit: cover;
  border-radius: 4px;
}

.logo-uploader-icon,
.uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 200px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
}

.banner-uploader .uploader-icon {
  width: 500px;
  height: 156px;
  line-height: 156px;
}

.upload-tip {
  margin-top: 8px;
  color: #999;
  font-size: 12px;
}

.table-image {
  width: 160px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
}
</style>
