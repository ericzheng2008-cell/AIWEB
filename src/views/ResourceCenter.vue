<template>
  <div class="resource-center">
    <!-- 页面横幅 -->
    <div class="page-banner">
      <div class="banner-content">
        <h1 class="banner-title">{{ $t('resourceCenter.title') }}</h1>
        <p class="banner-desc">{{ $t('resourceCenter.description') }}</p>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="filter-section">
      <div class="container">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="16">
            <el-input
              v-model="searchKeyword"
              :placeholder="$t('resourceCenter.searchPlaceholder')"
              size="large"
              clearable
              @input="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </el-col>
          <el-col :xs="24" :sm="8">
            <el-select
              v-model="selectedCategory"
              :placeholder="$t('resourceCenter.allCategories')"
              size="large"
              clearable
              @change="handleFilter"
            >
              <el-option
                v-for="cat in categories"
                :key="cat.value"
                :label="cat.label[$i18n.locale]"
                :value="cat.value"
              >
                <el-icon style="margin-right: 8px"><component :is="cat.icon" /></el-icon>
                <span>{{ cat.label[$i18n.locale] }}</span>
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 资源列表 -->
    <div class="resources-section">
      <div class="container">
        <!-- 分类标签 -->
        <div class="category-tabs">
          <el-radio-group v-model="selectedCategory" @change="handleFilter">
            <el-radio-button label="">{{ $t('resourceCenter.all') }}</el-radio-button>
            <el-radio-button
              v-for="cat in categories"
              :key="cat.value"
              :label="cat.value"
            >
              <el-icon><component :is="cat.icon" /></el-icon>
              {{ cat.label[$i18n.locale] }}
            </el-radio-button>
          </el-radio-group>
        </div>

        <!-- 资源网格 -->
        <el-row :gutter="20" class="resources-grid">
          <el-col
            :xs="24" :sm="12" :lg="8"
            v-for="resource in filteredResources"
            :key="resource.id"
          >
            <div class="resource-card">
              <div class="resource-type-badge">
                <el-tag :type="getResourceTypeTag(resource.type)">
                  {{ resource.typeName[$i18n.locale] }}
                </el-tag>
              </div>
              
              <div class="resource-thumbnail">
                <img :src="resource.thumbnail" :alt="resource.title[$i18n.locale]" />
                <div class="resource-overlay">
                  <el-icon class="preview-icon" @click="previewResource(resource)">
                    <View />
                  </el-icon>
                </div>
              </div>

              <div class="resource-content">
                <h3 class="resource-title">{{ resource.title[$i18n.locale] }}</h3>
                <p class="resource-desc">{{ resource.description[$i18n.locale] }}</p>

                <div class="resource-meta">
                  <span class="meta-item">
                    <el-icon><Calendar /></el-icon>
                    {{ resource.publishDate }}
                  </span>
                  <span class="meta-item">
                    <el-icon><Download /></el-icon>
                    {{ resource.downloads }}
                  </span>
                  <span class="meta-item">
                    <el-icon><View /></el-icon>
                    {{ resource.views }}
                  </span>
                </div>

                <div class="resource-tags">
                  <el-tag
                    v-for="tag in resource.tags"
                    :key="tag"
                    size="small"
                    type="info"
                  >
                    {{ tag }}
                  </el-tag>
                </div>

                <div class="resource-actions">
                  <el-button
                    type="primary"
                    :icon="Download"
                    @click="downloadResource(resource)"
                  >
                    {{ $t('resourceCenter.download') }}
                  </el-button>
                  <el-button
                    type="default"
                    :icon="View"
                    @click="viewResource(resource)"
                  >
                    {{ $t('resourceCenter.preview') }}
                  </el-button>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>

        <!-- 空状态 -->
        <el-empty
          v-if="filteredResources.length === 0"
          :description="$t('resourceCenter.noResources')"
        />

        <!-- 分页 -->
        <div class="pagination-wrapper" v-if="filteredResources.length > 0">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[9, 18, 36, 72]"
            :total="totalResources"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </div>
    </div>

    <!-- 下载对话框 -->
    <el-dialog
      v-model="downloadDialogVisible"
      :title="$t('resourceCenter.downloadResource')"
      width="500px"
    >
      <el-form :model="downloadForm" label-position="top">
        <el-form-item :label="$t('resourceCenter.name')">
          <el-input v-model="downloadForm.name" :placeholder="$t('resourceCenter.enterName')" />
        </el-form-item>
        <el-form-item :label="$t('resourceCenter.email')">
          <el-input v-model="downloadForm.email" type="email" :placeholder="$t('resourceCenter.enterEmail')" />
        </el-form-item>
        <el-form-item :label="$t('resourceCenter.company')">
          <el-input v-model="downloadForm.company" :placeholder="$t('resourceCenter.enterCompany')" />
        </el-form-item>
        <el-form-item :label="$t('resourceCenter.purpose')">
          <el-select v-model="downloadForm.purpose" :placeholder="$t('resourceCenter.selectPurpose')">
            <el-option :label="$t('resourceCenter.evaluation')" value="evaluation" />
            <el-option :label="$t('resourceCenter.procurement')" value="procurement" />
            <el-option :label="$t('resourceCenter.research')" value="research" />
            <el-option :label="$t('resourceCenter.other')" value="other" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="downloadDialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="confirmDownload">{{ $t('common.confirm') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import {
  Search, Download, View, Calendar,
  Document, VideoCamera, Picture, Reading,
  Files, Notebook
} from '@element-plus/icons-vue'

const { t, locale } = useI18n()

// 数据
const searchKeyword = ref('')
const selectedCategory = ref('')
const currentPage = ref(1)
const pageSize = ref(9)

const categories = ref([
  {
    value: 'whitepaper',
    label: { 'zh-CN': '白皮书', 'en-US': 'White Papers' },
    icon: 'Document'
  },
  {
    value: 'guide',
    label: { 'zh-CN': '选型指南', 'en-US': 'Selection Guides' },
    icon: 'Reading'
  },
  {
    value: 'video',
    label: { 'zh-CN': '视频教程', 'en-US': 'Video Tutorials' },
    icon: 'VideoCamera'
  },
  {
    value: 'article',
    label: { 'zh-CN': '技术文章', 'en-US': 'Technical Articles' },
    icon: 'Notebook'
  },
  {
    value: 'case',
    label: { 'zh-CN': '客户案例', 'en-US': 'Case Studies' },
    icon: 'Files'
  },
  {
    value: 'manual',
    label: { 'zh-CN': '产品手册', 'en-US': 'Product Manuals' },
    icon: 'Document'
  }
])

const resources = ref([
  {
    id: 1,
    type: 'whitepaper',
    typeName: { 'zh-CN': '白皮书', 'en-US': 'White Paper' },
    title: {
      'zh-CN': '工业4.0时代的智能拧紧技术白皮书',
      'en-US': 'Smart Tightening Technology in Industry 4.0 Era'
    },
    description: {
      'zh-CN': '深入探讨智能拧紧技术在工业4.0时代的应用与发展趋势',
      'en-US': 'In-depth discussion on the application and development trends of smart tightening technology in Industry 4.0'
    },
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
    publishDate: '2024-12-01',
    downloads: 1256,
    views: 3420,
    tags: ['工业4.0', '智能制造', 'IoT'],
    fileUrl: '/resources/whitepaper_industry40.pdf',
    fileSize: '5.2MB'
  },
  {
    id: 2,
    type: 'guide',
    typeName: { 'zh-CN': '选型指南', 'en-US': 'Selection Guide' },
    title: {
      'zh-CN': '电动拧紧工具选型完全指南',
      'en-US': 'Complete Guide to Electric Tightening Tool Selection'
    },
    description: {
      'zh-CN': '帮助您选择最适合的电动拧紧工具，覆盖各种应用场景',
      'en-US': 'Help you choose the most suitable electric tightening tools for various application scenarios'
    },
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400',
    publishDate: '2024-11-15',
    downloads: 2134,
    views: 5680,
    tags: ['选型', '电动工具', '应用指南'],
    fileUrl: '/resources/guide_electric_tools.pdf',
    fileSize: '3.8MB'
  },
  {
    id: 3,
    type: 'video',
    typeName: { 'zh-CN': '视频教程', 'en-US': 'Video Tutorial' },
    title: {
      'zh-CN': '拧紧曲线分析实战教程',
      'en-US': 'Practical Tutorial on Tightening Curve Analysis'
    },
    description: {
      'zh-CN': '30分钟学会如何分析拧紧曲线，识别装配问题',
      'en-US': 'Learn how to analyze tightening curves and identify assembly issues in 30 minutes'
    },
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
    publishDate: '2024-11-20',
    downloads: 856,
    views: 4320,
    tags: ['视频教程', '曲线分析', '实战'],
    fileUrl: 'https://www.youtube.com/watch?v=example',
    fileSize: '280MB'
  },
  {
    id: 4,
    type: 'article',
    typeName: { 'zh-CN': '技术文章', 'en-US': 'Technical Article' },
    title: {
      'zh-CN': '扭矩控制精度对装配质量的影响研究',
      'en-US': 'Impact of Torque Control Precision on Assembly Quality'
    },
    description: {
      'zh-CN': '通过实验数据分析扭矩精度与装配质量的关系',
      'en-US': 'Analyze the relationship between torque precision and assembly quality through experimental data'
    },
    thumbnail: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400',
    publishDate: '2024-10-28',
    downloads: 678,
    views: 2150,
    tags: ['扭矩控制', '质量管理', '研究'],
    fileUrl: '/resources/article_torque_precision.pdf',
    fileSize: '2.1MB'
  },
  {
    id: 5,
    type: 'case',
    typeName: { 'zh-CN': '客户案例', 'en-US': 'Case Study' },
    title: {
      'zh-CN': '某知名汽车厂商智能拧紧系统实施案例',
      'en-US': 'Smart Tightening System Implementation Case at Leading Auto Manufacturer'
    },
    description: {
      'zh-CN': '详细介绍智能拧紧系统在汽车生产线的应用效果',
      'en-US': 'Detailed introduction to the application results of smart tightening systems in automotive production lines'
    },
    thumbnail: 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400',
    publishDate: '2024-09-15',
    downloads: 1542,
    views: 6780,
    tags: ['案例研究', '汽车制造', 'ROI分析'],
    fileUrl: '/resources/case_automotive.pdf',
    fileSize: '4.5MB'
  },
  {
    id: 6,
    type: 'manual',
    typeName: { 'zh-CN': '产品手册', 'en-US': 'Product Manual' },
    title: {
      'zh-CN': 'Bosch电动拧紧工具完整产品手册',
      'en-US': 'Complete Bosch Electric Tightening Tools Product Manual'
    },
    description: {
      'zh-CN': 'Bosch全系列电动拧紧工具的技术参数与操作指南',
      'en-US': 'Technical specifications and operation guides for Bosch complete electric tightening tools series'
    },
    thumbnail: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400',
    publishDate: '2024-08-10',
    downloads: 3245,
    views: 8900,
    tags: ['Bosch', '产品手册', '技术参数'],
    fileUrl: '/resources/manual_bosch_complete.pdf',
    fileSize: '12.8MB'
  }
])

const downloadDialogVisible = ref(false)
const downloadForm = ref({
  name: '',
  email: '',
  company: '',
  purpose: ''
})
const currentResource = ref(null)

// 计算属性
const filteredResources = computed(() => {
  let result = resources.value

  if (selectedCategory.value) {
    result = result.filter(r => r.type === selectedCategory.value)
  }

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(r =>
      r.title[locale.value].toLowerCase().includes(keyword) ||
      r.description[locale.value].toLowerCase().includes(keyword) ||
      r.tags.some(tag => tag.toLowerCase().includes(keyword))
    )
  }

  return result
})

const totalResources = computed(() => filteredResources.value.length)

// 方法
function handleSearch() {
  currentPage.value = 1
}

function handleFilter() {
  currentPage.value = 1
}

function handleSizeChange() {
  currentPage.value = 1
}

function handlePageChange() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function getResourceTypeTag(type) {
  const typeMap = {
    whitepaper: 'danger',
    guide: 'warning',
    video: 'success',
    article: 'primary',
    case: 'info',
    manual: ''
  }
  return typeMap[type] || 'info'
}

function previewResource(resource) {
  ElMessage.info(t('resourceCenter.previewingResource'))
  // TODO: 实现预览功能
}

function downloadResource(resource) {
  currentResource.value = resource
  downloadDialogVisible.value = true
}

function viewResource(resource) {
  if (resource.type === 'video') {
    window.open(resource.fileUrl, '_blank')
  } else {
    previewResource(resource)
  }
}

function confirmDownload() {
  if (!downloadForm.value.email) {
    ElMessage.warning(t('resourceCenter.emailRequired'))
    return
  }

  ElMessage.success(t('resourceCenter.downloadStarted'))
  downloadDialogVisible.value = false

  // TODO: 实现真实下载逻辑和数据收集
  console.log('Download resource:', currentResource.value)
  console.log('User info:', downloadForm.value)

  // 重置表单
  downloadForm.value = {
    name: '',
    email: '',
    company: '',
    purpose: ''
  }
}

onMounted(() => {
  // 初始化
})
</script>

<style scoped>
.resource-center {
  min-height: 100vh;
  background: #f5f7fa;
}

.page-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 20px;
  text-align: center;
}

.banner-content {
  max-width: 800px;
  margin: 0 auto;
}

.banner-title {
  font-size: 42px;
  margin: 0 0 20px 0;
  font-weight: 700;
}

.banner-desc {
  font-size: 18px;
  opacity: 0.95;
  margin: 0;
}

.filter-section {
  background: white;
  padding: 30px 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.resources-section {
  padding: 40px 0;
}

.category-tabs {
  margin-bottom: 30px;
  text-align: center;
}

.resources-grid {
  margin-bottom: 40px;
}

.resource-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  transition: all 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.resource-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.resource-type-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 10;
}

.resource-thumbnail {
  width: 100%;
  height: 200px;
  overflow: hidden;
  position: relative;
}

.resource-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.resource-card:hover .resource-thumbnail img {
  transform: scale(1.1);
}

.resource-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.resource-card:hover .resource-overlay {
  opacity: 1;
}

.preview-icon {
  font-size: 48px;
  color: white;
  cursor: pointer;
}

.resource-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.resource-title {
  font-size: 18px;
  color: #333;
  margin: 0 0 10px 0;
  line-height: 1.4;
  min-height: 50px;
}

.resource-desc {
  font-size: 14px;
  color: #666;
  margin: 0 0 15px 0;
  line-height: 1.6;
  flex: 1;
}

.resource-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 12px;
  color: #999;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.resource-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
  min-height: 32px;
}

.resource-actions {
  display: flex;
  gap: 10px;
}

.resource-actions .el-button {
  flex: 1;
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  padding: 30px 0;
}

@media (max-width: 768px) {
  .banner-title {
    font-size: 28px;
  }

  .banner-desc {
    font-size: 14px;
  }

  .category-tabs :deep(.el-radio-button__inner) {
    padding: 8px 12px;
    font-size: 12px;
  }

  .resource-title {
    font-size: 16px;
    min-height: auto;
  }
}
</style>
