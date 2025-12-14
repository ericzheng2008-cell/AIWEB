<template>
  <div class="cms-manage">
    <el-card class="header-card">
      <h2><el-icon><Setting /></el-icon> {{ t('cms.title') }}</h2>
      <p>{{ t('cms.subtitle') }}</p>
    </el-card>

    <el-tabs v-model="activeTab" class="cms-tabs">
      <!-- 语言切换 -->
      <el-tab-pane label="🇨🇳 中文内容管理" name="chinese">
        <el-card class="lang-card">
          <h3>中文网站内容管理</h3>
          <p>在此模块编辑中文网站的所有内容</p>
        </el-card>
        
        <el-tabs v-model="chineseTab" class="sub-tabs">
          <el-tab-pane label="首页内容" name="home-cn">
            <el-space direction="vertical" :size="20" style="width: 100%;">
              <el-card>
                <template #header><h3>首页横幅</h3></template>
                <PageContentEditor page-type="home" :lang="'zh-CN'" />
              </el-card>
              <el-card>
                <template #header><h3>首页模块</h3></template>
                <HomeBlocksEditor :lang="'zh-CN'" />
              </el-card>
            </el-space>
          </el-tab-pane>
          
          <el-tab-pane label="关于我们" name="about-cn">
            <AboutPageEditor :lang="'zh-CN'" />
          </el-tab-pane>
          
          <el-tab-pane label="服务与支持" name="service-cn">
            <ServicePageEditor :lang="'zh-CN'" />
          </el-tab-pane>
          
          <el-tab-pane label="应用案例" name="solutions-cn">
            <SolutionsPageEditor :lang="'zh-CN'" />
          </el-tab-pane>
          
          <el-tab-pane label="联系我们" name="contact-cn">
            <el-space direction="vertical" :size="20" style="width: 100%;">
              <el-card>
                <template #header><h3>联系我们横幅</h3></template>
                <PageContentEditor page-type="contact" :lang="'zh-CN'" />
              </el-card>
              <el-card>
                <template #header><h3>联系信息</h3></template>
                <ContactInfoEditor :lang="'zh-CN'" />
              </el-card>
            </el-space>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>

      <!-- 英文内容管理 -->
      <el-tab-pane label="🇺🇸 English Content Management" name="english">
        <el-card class="lang-card">
          <h3>English Website Content Management</h3>
          <p>Edit all English website content in this module</p>
        </el-card>
        
        <el-tabs v-model="englishTab" class="sub-tabs">
          <el-tab-pane label="Home" name="home-en">
            <el-space direction="vertical" :size="20" style="width: 100%;">
              <el-card>
                <template #header><h3>Home Banner</h3></template>
                <PageContentEditor page-type="home" :lang="'en-US'" />
              </el-card>
              <el-card>
                <template #header><h3>Home Blocks</h3></template>
                <HomeBlocksEditor :lang="'en-US'" />
              </el-card>
            </el-space>
          </el-tab-pane>
          
          <el-tab-pane label="About Us" name="about-en">
            <AboutPageEditor :lang="'en-US'" />
          </el-tab-pane>
          
          <el-tab-pane label="Service & Support" name="service-en">
            <ServicePageEditor :lang="'en-US'" />
          </el-tab-pane>
          
          <el-tab-pane label="Solutions" name="solutions-en">
            <SolutionsPageEditor :lang="'en-US'" />
          </el-tab-pane>
          
          <el-tab-pane label="Contact Us" name="contact-en">
            <el-space direction="vertical" :size="20" style="width: 100%;">
              <el-card>
                <template #header><h3>Contact Banner</h3></template>
                <PageContentEditor page-type="contact" :lang="'en-US'" />
              </el-card>
              <el-card>
                <template #header><h3>Contact Information</h3></template>
                <ContactInfoEditor :lang="'en-US'" />
              </el-card>
            </el-space>
          </el-tab-pane>
        </el-tabs>
      </el-tab-pane>

      <!-- 导航栏管理 -->
      <el-tab-pane :label="t('cms.tabs.navigation')" name="navigation">
        <NavManage />
      </el-tab-pane>

      <!-- Logo和基本设置 -->
      <el-tab-pane :label="t('cms.tabs.logo')" name="logo">
        <el-card>
          <h3>{{ t('cms.logo.websiteLogo') }}</h3>
          <div class="logo-section">
            <ImageUploader v-model="cmsStore.siteConfig.logo" :alt="t('cms.logo.websiteLogo')" />
            <el-button type="primary" @click="saveLogo" style="margin-top: 10px;">
              <el-icon><Check /></el-icon> {{ t('cms.logo.saveLogo') }}
            </el-button>
          </div>

          <el-divider />

          <h3>{{ t('cms.logo.companyInfo') }}</h3>
          <el-form :model="siteConfigForm" label-width="120px">
            <el-form-item :label="t('cms.logo.chineseName')">
              <el-input v-model="siteConfigForm.companyName['zh-CN']" />
            </el-form-item>
            <el-form-item :label="t('cms.logo.englishName')">
              <el-input v-model="siteConfigForm.companyName['en-US']" />
            </el-form-item>
            <el-form-item :label="t('cms.logo.chineseSlogan')">
              <el-input v-model="siteConfigForm.slogan['zh-CN']" />
            </el-form-item>
            <el-form-item :label="t('cms.logo.englishSlogan')">
              <el-input v-model="siteConfigForm.slogan['en-US']" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveSiteConfig">
                <el-icon><Check /></el-icon> {{ t('cms.logo.saveConfig') }}
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>

      <!-- 顶部和页脚管理 -->
      <el-tab-pane label="顶部和页脚" name="header-footer">
        <HeaderFooterEditor />
      </el-tab-pane>

      <!-- 智能体内容管理 -->
      <el-tab-pane label="🤖 智能体内容" name="ai-agents">
        <AiAgentEditor />
      </el-tab-pane>

      <!-- 事业部管理 -->
      <el-tab-pane :label="t('cms.tabs.divisions')" name="divisions">
        <el-card>
          <div class="section-header">
            <h3>{{ t('cms.division.list') }}</h3>
            <el-button type="primary" @click="showAddDivisionDialog">
              <el-icon><Plus /></el-icon> {{ t('cms.division.add') }}
            </el-button>
          </div>

          <el-table :data="cmsStore.divisions" style="width: 100%">
            <el-table-column prop="id" label="ID" width="60" />
            <el-table-column :label="t('cms.division.chineseName')" width="200">
              <template #default="scope">
                {{ scope.row.name['zh-CN'] }}
              </template>
            </el-table-column>
            <el-table-column :label="t('cms.division.englishName')" width="250">
              <template #default="scope">
                {{ scope.row.name['en-US'] }}
              </template>
            </el-table-column>
            <el-table-column :label="t('cms.division.relatedProducts')">
              <template #default="scope">
                <el-tag 
                  v-for="catId in scope.row.productCategories" 
                  :key="catId"
                  size="small"
                  style="margin-right: 5px;">
                  {{ getCategoryName(catId) }}
                </el-tag>
                <el-button 
                  size="small" 
                  text
                  @click="manageDivisionProducts(scope.row)">
                  {{ t('cms.division.manageProducts') }}
                </el-button>
              </template>
            </el-table-column>
            <el-table-column :label="t('cms.product.operation')" width="180" fixed="right">
              <template #default="scope">
                <el-button size="small" @click="editDivision(scope.row)">{{ t('cms.category.edit') }}</el-button>
                <el-button size="small" type="danger" @click="deleteDivision(scope.row.id)">{{ t('cms.division.delete') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- 产品分类管理 -->
      <el-tab-pane :label="t('cms.tabs.categories')" name="categories">
        <el-card>
          <div class="section-header">
            <h3>{{ t('cms.category.title') }}</h3>
            <el-button type="primary" @click="showAddCategoryDialog(1)">
              <el-icon><Plus /></el-icon> {{ t('cms.category.addLevel1') }}
            </el-button>
          </div>

          <!-- 分类树形展示 -->
          <el-tree
            :data="categoryTreeData"
            :props="{ label: 'label', children: 'children' }"
            node-key="id"
            default-expand-all
            class="category-tree">
            <template #default="{ node, data }">
              <div class="tree-node">
                <span class="node-label">
                  <el-tag :type="getLevelType(data.level)" size="small">{{ data.level }}{{ t('cms.category.level') }}</el-tag>
                  {{ data.label }}
                </span>
                <span class="node-actions">
                  <el-button 
                    v-if="data.level < 4" 
                    size="small" 
                    text
                    @click.stop="showAddCategoryDialog(data.level + 1, data.realId)">
                    {{ t('cms.category.addSub') }}
                  </el-button>
                  <el-button size="small" text @click.stop="editCategory(data)">{{ t('cms.category.edit') }}</el-button>
                  <el-button size="small" text type="danger" @click.stop="deleteCategory(data)">{{ t('cms.category.delete') }}</el-button>
                </span>
              </div>
            </template>
          </el-tree>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 事业部编辑对话框 -->
    <el-dialog v-model="divisionDialogVisible" :title="divisionForm.id ? t('cms.division.edit') : t('cms.division.add')" width="600px">
      <el-form :model="divisionForm" label-width="120px">
        <el-form-item :label="t('cms.division.key')">
          <el-input v-model="divisionForm.key" placeholder="assembly" />
        </el-form-item>
        <el-form-item :label="t('cms.division.icon')">
          <el-select v-model="divisionForm.icon" :placeholder="t('cms.division.selectIcon')">
            <el-option label="Connection" value="Connection" />
            <el-option label="Setting" value="Setting" />
            <el-option label="Box" value="Box" />
            <el-option label="Cpu" value="Cpu" />
            <el-option label="Van" value="Van" />
            <el-option label="Monitor" value="Monitor" />
            <el-option label="Tools" value="Tools" />
            <el-option label="Promotion" value="Promotion" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('cms.division.chineseName')">
          <el-input v-model="divisionForm.name['zh-CN']" />
        </el-form-item>
        <el-form-item :label="t('cms.division.englishName')">
          <el-input v-model="divisionForm.name['en-US']" />
        </el-form-item>
        <el-form-item :label="t('cms.division.chineseDesc')">
          <el-input v-model="divisionForm.description['zh-CN']" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item :label="t('cms.division.englishDesc')">
          <el-input v-model="divisionForm.description['en-US']" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="divisionDialogVisible = false">{{ t('cms.division.cancel') }}</el-button>
        <el-button type="primary" @click="saveDivision">{{ t('cms.division.save') }}</el-button>
      </template>
    </el-dialog>

    <!-- 事业部产品管理对话框 -->
    <el-dialog v-model="divisionProductsDialogVisible" :title="t('cms.division.manageTitle')" width="700px">
      <div v-if="currentDivision">
        <h4>{{ currentDivision.name['zh-CN'] }}</h4>
        <el-divider />
        
        <div class="product-select-area">
          <h5>{{ t('cms.division.availableCategories') }}</h5>
          <el-checkbox-group v-model="selectedCategories">
            <el-checkbox 
              v-for="cat in cmsStore.productCategories" 
              :key="cat.id" 
              :label="cat.id">
              {{ cat.name['zh-CN'] }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
      <template #footer>
        <el-button @click="divisionProductsDialogVisible = false">{{ t('cms.division.cancel') }}</el-button>
        <el-button type="primary" @click="saveDivisionProducts">{{ t('cms.division.save') }}</el-button>
      </template>
    </el-dialog>

    <!-- 分类编辑对话框 -->
    <el-dialog v-model="categoryDialogVisible" :title="getCategoryDialogTitle()" width="650px">
      <el-form :model="categoryForm" label-width="120px">
        <el-form-item v-if="categoryForm.level > 1" :label="t('cms.category.parentCategory')">
          <el-select v-model="categoryForm.parentId" :placeholder="t('cms.category.selectParent')" disabled>
            <el-option 
              v-for="cat in getParentCategoryOptions()" 
              :key="cat.id" 
              :label="cat.name['zh-CN']" 
              :value="cat.id" 
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('cms.category.chineseName')">
          <el-input v-model="categoryForm.name['zh-CN']" />
        </el-form-item>
        <el-form-item :label="t('cms.category.englishName')">
          <el-input v-model="categoryForm.name['en-US']" />
        </el-form-item>
        <el-form-item :label="t('cms.category.chineseDesc')">
          <el-input v-model="categoryForm.description['zh-CN']" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item :label="t('cms.category.englishDesc')">
          <el-input v-model="categoryForm.description['en-US']" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item v-if="categoryForm.level === 1" :label="t('cms.category.categoryImage')">
          <ImageUploader v-model="categoryForm.image" :alt="t('cms.category.categoryImage')" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="categoryDialogVisible = false">{{ t('cms.category.cancel') }}</el-button>
        <el-button type="primary" @click="saveCategory">{{ t('cms.category.save') }}</el-button>
      </template>
    </el-dialog>


  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCmsAdvancedStore } from '../../store/cmsAdvanced'
import ImageUploader from '../../components/ImageUploader.vue'
import NavManage from './NavManage.vue'
import PageContentEditor from '../../components/PageContentEditor.vue'
import SolutionCategoryManager from '../../components/SolutionCategoryManager.vue'
import HomeBlocksEditor from '../../components/HomeBlocksEditor.vue'
import ContactInfoEditor from '../../components/ContactInfoEditor.vue'
import AboutPageEditor from '../../components/AboutPageEditor.vue'
import ServicePageEditor from '../../components/ServicePageEditor.vue'
import SolutionsPageEditor from '../../components/SolutionsPageEditor.vue'
import HeaderFooterEditor from '../../components/HeaderFooterEditor.vue'
import AiAgentEditor from '../../components/AiAgentEditor.vue'

const { t } = useI18n()
const cmsStore = useCmsAdvancedStore()

const activeTab = ref('chinese')
const chineseTab = ref('home-cn')
const englishTab = ref('home-en')

// Logo和基本设置
const siteConfigForm = reactive({
  companyName: { ...cmsStore.siteConfig.companyName },
  slogan: { ...cmsStore.siteConfig.slogan }
})

const saveLogo = () => {
  cmsStore.saveSiteConfig()
  ElMessage.success(t('cms.message.logoSaved'))
  location.reload()
}

const saveSiteConfig = () => {
  cmsStore.siteConfig.companyName = { ...siteConfigForm.companyName }
  cmsStore.siteConfig.slogan = { ...siteConfigForm.slogan }
  cmsStore.saveSiteConfig()
  ElMessage.success(t('cms.message.configSaved'))
}

// 事业部管理
const divisionDialogVisible = ref(false)
const divisionProductsDialogVisible = ref(false)
const currentDivision = ref(null)
const selectedCategories = ref([])
const divisionForm = reactive({
  id: null,
  key: '',
  icon: 'Box',
  name: { 'zh-CN': '', 'en-US': '' },
  description: { 'zh-CN': '', 'en-US': '' },
  productCategories: []
})

const showAddDivisionDialog = () => {
  Object.assign(divisionForm, {
    id: null,
    key: '',
    icon: 'Box',
    name: { 'zh-CN': '', 'en-US': '' },
    description: { 'zh-CN': '', 'en-US': '' },
    productCategories: []
  })
  divisionDialogVisible.value = true
}

const editDivision = (row) => {
  Object.assign(divisionForm, JSON.parse(JSON.stringify(row)))
  divisionDialogVisible.value = true
}

const saveDivision = () => {
  if (!divisionForm.name['zh-CN'] || !divisionForm.name['en-US']) {
    ElMessage.warning(t('cms.message.fillName'))
    return
  }
  
  if (divisionForm.id) {
    cmsStore.updateDivision({ ...divisionForm })
  } else {
    cmsStore.addDivision({ ...divisionForm })
  }
  
  divisionDialogVisible.value = false
  ElMessage.success(t('cms.message.saveSuccess'))
}

const deleteDivision = (id) => {
  ElMessageBox.confirm(t('cms.division.confirmDelete'), t('cms.division.deleteTitle'), {
    type: 'warning'
  }).then(() => {
    cmsStore.deleteDivision(id)
    ElMessage.success(t('cms.message.deleteSuccess'))
  }).catch(() => {})
}

const manageDivisionProducts = (division) => {
  currentDivision.value = division
  selectedCategories.value = [...division.productCategories]
  divisionProductsDialogVisible.value = true
}

const saveDivisionProducts = () => {
  if (currentDivision.value) {
    currentDivision.value.productCategories = [...selectedCategories.value]
    cmsStore.updateDivision(currentDivision.value)
    divisionProductsDialogVisible.value = false
    ElMessage.success(t('cms.message.saveSuccess'))
  }
}

const getCategoryName = (catId) => {
  const cat = cmsStore.productCategories.find(c => c.id === catId)
  return cat ? cat.name['zh-CN'] : ''
}

// 产品分类管理
const categoryDialogVisible = ref(false)
const categoryForm = reactive({
  id: null,
  level: 1,
  parentId: null,
  name: { 'zh-CN': '', 'en-US': '' },
  description: { 'zh-CN': '', 'en-US': '' },
  image: ''
})

// 构建分类树数据
const categoryTreeData = computed(() => {
  const buildTree = () => {
    const tree = []
    
    // 1级分类
    cmsStore.productCategories.forEach(cat1 => {
      const node1 = {
        id: `cat1-${cat1.id}`,
        realId: cat1.id,
        level: 1,
        label: cat1.name['zh-CN'],
        data: cat1,
        children: []
      }
      
      // 2级分类
      const subs = cmsStore.getSubCategories(cat1.id)
      subs.forEach(cat2 => {
        const node2 = {
          id: `cat2-${cat2.id}`,
          realId: cat2.id,
          level: 2,
          label: cat2.name['zh-CN'],
          data: cat2,
          children: []
        }
        
        // 3级分类
        const thirds = cmsStore.getThirdCategories(cat2.id)
        thirds.forEach(cat3 => {
          const node3 = {
            id: `cat3-${cat3.id}`,
            realId: cat3.id,
            level: 3,
            label: cat3.name['zh-CN'],
            data: cat3,
            children: []
          }
          
          // 4级分类
          const fourths = cmsStore.getFourthCategories(cat3.id)
          fourths.forEach(cat4 => {
            const node4 = {
              id: `cat4-${cat4.id}`,
              realId: cat4.id,
              level: 4,
              label: cat4.name['zh-CN'],
              data: cat4
            }
            node3.children.push(node4)
          })
          
          node2.children.push(node3)
        })
        
        node1.children.push(node2)
      })
      
      tree.push(node1)
    })
    
    return tree
  }
  return buildTree()
})

const showAddCategoryDialog = (level, parentId = null) => {
  Object.assign(categoryForm, {
    id: null,
    level,
    parentId,
    name: { 'zh-CN': '', 'en-US': '' },
    description: { 'zh-CN': '', 'en-US': '' },
    image: ''
  })
  categoryDialogVisible.value = true
}

const editCategory = (data) => {
  Object.assign(categoryForm, {
    ...JSON.parse(JSON.stringify(data.data)),
    level: data.level
  })
  categoryDialogVisible.value = true
}

const saveCategory = () => {
  if (!categoryForm.name['zh-CN'] || !categoryForm.name['en-US']) {
    ElMessage.warning(t('cms.message.fillName'))
    return
  }
  
  const category = { ...categoryForm }
  
  if (category.level === 1) {
    if (category.id) {
      cmsStore.updateProductCategory(category)
    } else {
      cmsStore.addProductCategory(category)
    }
  } else if (category.level === 2) {
    if (category.id) {
      cmsStore.updateProductSubCategory(category)
    } else {
      cmsStore.addProductSubCategory(category)
    }
  } else if (category.level === 3) {
    if (category.id) {
      cmsStore.updateProductThirdCategory(category)
    } else {
      cmsStore.addProductThirdCategory(category)
    }
  } else if (category.level === 4) {
    if (category.id) {
      cmsStore.updateProductFourthCategory(category)
    } else {
      cmsStore.addProductFourthCategory(category)
    }
  }
  
  categoryDialogVisible.value = false
  ElMessage.success(t('cms.message.saveSuccess'))
}

const deleteCategory = (data) => {
  ElMessageBox.confirm(
    t('cms.category.confirmDelete').replace('{name}', data.label),
    t('cms.division.deleteTitle'),
    { type: 'warning' }
  ).then(() => {
    if (data.level === 1) {
      cmsStore.deleteProductCategory(data.realId)
    } else if (data.level === 2) {
      cmsStore.deleteProductSubCategory(data.realId)
    } else if (data.level === 3) {
      cmsStore.deleteProductThirdCategory(data.realId)
    } else if (data.level === 4) {
      cmsStore.deleteProductFourthCategory(data.realId)
    }
    ElMessage.success(t('cms.message.deleteSuccess'))
  }).catch(() => {})
}

const getCategoryDialogTitle = () => {
  if (!categoryForm.id) {
    if (categoryForm.level === 1) return t('cms.category.addLevel1')
    if (categoryForm.level === 2) return t('cms.category.addLevel2')
    if (categoryForm.level === 3) return t('cms.category.addLevel3')
    if (categoryForm.level === 4) return '添加4级分类'
  }
  return `${t('cms.category.edit')} ${categoryForm.level}${t('cms.category.level')}`
}

const getParentCategoryOptions = () => {
  if (categoryForm.level === 2) {
    return cmsStore.productCategories
  } else if (categoryForm.level === 3) {
    return cmsStore.productSubCategories
  }
  return []
}

const getLevelType = (level) => {
  const types = { 1: 'primary', 2: 'success', 3: 'warning', 4: 'info' }
  return types[level] || 'info'
}


</script>

<style scoped>
.cms-manage {
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

.cms-tabs {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

.logo-section {
  max-width: 400px;
  margin-bottom: 30px;
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

.table-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.category-tree {
  margin-top: 20px;
}

.tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
}

.node-label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.node-actions {
  display: flex;
  gap: 5px;
}

.product-select-area {
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
}

.product-select-area h5 {
  margin-bottom: 10px;
}

.lang-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: 20px;
}

.lang-card h3 {
  font-size: 20px;
  margin-bottom: 8px;
}

.lang-card p {
  font-size: 14px;
  opacity: 0.9;
}

.sub-tabs {
  margin-top: 20px;
}

</style>
