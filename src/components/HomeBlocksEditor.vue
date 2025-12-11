<template>
  <div class="home-blocks-editor">
    <el-tabs v-model="activeTab" type="border-card">
      <!-- 关于明升伟业板块 -->
      <el-tab-pane label="关于明升伟业" name="aboutCompany">
        <el-card>
          <h3>板块标题</h3>
          <el-form label-width="120px">
            <el-form-item label="中文标题">
              <el-input v-model="aboutCompany.title['zh-CN']" />
            </el-form-item>
            <el-form-item label="英文标题">
              <el-input v-model="aboutCompany.title['en-US']" />
            </el-form-item>
          </el-form>

          <el-divider />

          <h3>公司简介</h3>
          <el-form label-width="120px">
            <el-form-item label="中文简介">
              <el-input type="textarea" :rows="4" v-model="aboutCompany.intro['zh-CN']" />
            </el-form-item>
            <el-form-item label="英文简介">
              <el-input type="textarea" :rows="4" v-model="aboutCompany.intro['en-US']" />
            </el-form-item>
            <el-form-item label="配图">
              <ImageUploader v-model="aboutCompany.image" alt="公司图片" />
            </el-form-item>
          </el-form>

          <el-divider />

          <h3>资质认证</h3>
          <el-button type="primary" size="small" @click="addCertification" style="margin-bottom: 15px;">
            <el-icon><Plus /></el-icon> 添加认证
          </el-button>
          <div v-for="(cert, index) in aboutCompany.certifications" :key="index" class="cert-item">
            <el-form :inline="true">
              <el-form-item label="中文">
                <el-input v-model="cert.name['zh-CN']" placeholder="ISO9000认证" style="width: 200px;" />
              </el-form-item>
              <el-form-item label="英文">
                <el-input v-model="cert.name['en-US']" placeholder="ISO9000 Certified" style="width: 200px;" />
              </el-form-item>
              <el-form-item>
                <el-button type="danger" size="small" @click="removeCertification(index)">删除</el-button>
              </el-form-item>
            </el-form>
          </div>

          <el-divider />

          <h3>按钮设置</h3>
          <el-form label-width="120px">
            <el-form-item label="中文按钮文字">
              <el-input v-model="aboutCompany.buttonText['zh-CN']" />
            </el-form-item>
            <el-form-item label="英文按钮文字">
              <el-input v-model="aboutCompany.buttonText['en-US']" />
            </el-form-item>
          </el-form>

          <el-button type="primary" @click="saveAboutCompany">
            <el-icon><Check /></el-icon> 保存设置
          </el-button>
        </el-card>
      </el-tab-pane>

      <!-- 我们的优势板块 -->
      <el-tab-pane label="我们的优势" name="advantages">
        <el-card>
          <h3>板块标题</h3>
          <el-form label-width="120px">
            <el-form-item label="中文标题">
              <el-input v-model="advantages.title['zh-CN']" />
            </el-form-item>
            <el-form-item label="英文标题">
              <el-input v-model="advantages.title['en-US']" />
            </el-form-item>
            <el-form-item label="中文副标题">
              <el-input v-model="advantages.subtitle['zh-CN']" />
            </el-form-item>
            <el-form-item label="英文副标题">
              <el-input v-model="advantages.subtitle['en-US']" />
            </el-form-item>
          </el-form>

          <el-divider />

          <h3>优势项目</h3>
          <el-button type="primary" size="small" @click="addAdvantageItem" style="margin-bottom: 15px;">
            <el-icon><Plus /></el-icon> 添加优势项
          </el-button>

          <el-collapse v-model="activeAdvantages" accordion>
            <el-collapse-item v-for="(item, index) in advantages.items" :key="index" :name="index">
              <template #title>
                <div style="display: flex; align-items: center; gap: 10px; width: 100%;">
                  <el-icon :size="20"><component :is="item.icon" /></el-icon>
                  <span style="flex: 1;">{{ item.title['zh-CN'] }}</span>
                  <el-button type="danger" size="small" @click.stop="removeAdvantageItem(index)">删除</el-button>
                </div>
              </template>
              <el-form label-width="120px">
                <el-form-item label="图标">
                  <el-select v-model="item.icon" placeholder="选择图标">
                    <el-option label="奖章 (Medal)" value="Medal" />
                    <el-option label="勾选 (Checked)" value="Checked" />
                    <el-option label="盒子 (Box)" value="Box" />
                    <el-option label="服务 (Service)" value="Service" />
                    <el-option label="工具 (Tools)" value="Tools" />
                    <el-option label="奖杯 (Trophy)" value="Trophy" />
                    <el-option label="星星 (Star)" value="Star" />
                    <el-option label="设置 (Setting)" value="Setting" />
                  </el-select>
                </el-form-item>
                <el-form-item label="中文标题">
                  <el-input v-model="item.title['zh-CN']" />
                </el-form-item>
                <el-form-item label="英文标题">
                  <el-input v-model="item.title['en-US']" />
                </el-form-item>
                <el-form-item label="中文描述">
                  <el-input type="textarea" :rows="3" v-model="item.description['zh-CN']" />
                </el-form-item>
                <el-form-item label="英文描述">
                  <el-input type="textarea" :rows="3" v-model="item.description['en-US']" />
                </el-form-item>
              </el-form>
            </el-collapse-item>
          </el-collapse>

          <el-button type="primary" @click="saveAdvantages" style="margin-top: 20px;">
            <el-icon><Check /></el-icon> 保存设置
          </el-button>
        </el-card>
      </el-tab-pane>

      <!-- 服务网络板块 -->
      <el-tab-pane label="服务网络" name="serviceNetwork">
        <el-card>
          <h3>板块标题</h3>
          <el-form label-width="120px">
            <el-form-item label="中文标题">
              <el-input v-model="serviceNetwork.title['zh-CN']" />
            </el-form-item>
            <el-form-item label="英文标题">
              <el-input v-model="serviceNetwork.title['en-US']" />
            </el-form-item>
            <el-form-item label="中文副标题">
              <el-input v-model="serviceNetwork.subtitle['zh-CN']" />
            </el-form-item>
            <el-form-item label="英文副标题">
              <el-input v-model="serviceNetwork.subtitle['en-US']" />
            </el-form-item>
          </el-form>

          <el-divider />

          <h3>办事处列表</h3>
          <el-button type="primary" size="small" @click="addOffice" style="margin-bottom: 15px;">
            <el-icon><Plus /></el-icon> 添加办事处
          </el-button>

          <el-table :data="serviceNetwork.offices" style="width: 100%">
            <el-table-column label="中文城市" width="150">
              <template #default="scope">
                <el-input v-model="scope.row.city['zh-CN']" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="英文城市" width="150">
              <template #default="scope">
                <el-input v-model="scope.row.city['en-US']" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="中文地区" width="200">
              <template #default="scope">
                <el-input v-model="scope.row.region['zh-CN']" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="英文地区" width="200">
              <template #default="scope">
                <el-input v-model="scope.row.region['en-US']" size="small" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button type="danger" size="small" @click="removeOffice(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-button type="primary" @click="saveServiceNetwork" style="margin-top: 20px;">
            <el-icon><Check /></el-icon> 保存设置
          </el-button>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { usePageContentStore } from '../store/pageContent'
import ImageUploader from './ImageUploader.vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  lang: {
    type: String,
    default: 'zh-CN'
  }
})

const pageContentStore = usePageContentStore()
const activeTab = ref('banner')
const activeAdvantages = ref([])

// Banner设置
const bannerSettings = reactive({
  width: 100,
  height: 650,
  autoplay: true
})

// 关于明升伟业
const aboutCompany = reactive({
  title: { 'zh-CN': '', 'en-US': '' },
  intro: { 'zh-CN': '', 'en-US': '' },
  certifications: [],
  buttonText: { 'zh-CN': '', 'en-US': '' },
  image: ''
})

// 我们的优势
const advantages = reactive({
  title: { 'zh-CN': '', 'en-US': '' },
  subtitle: { 'zh-CN': '', 'en-US': '' },
  items: []
})

// 服务网络
const serviceNetwork = reactive({
  title: { 'zh-CN': '', 'en-US': '' },
  subtitle: { 'zh-CN': '', 'en-US': '' },
  offices: []
})

// 加载数据
const loadData = () => {
  const homeContent = pageContentStore.pages.home
  if (homeContent) {
    // 关于明升伟业
    if (homeContent.aboutCompany) {
      Object.assign(aboutCompany, JSON.parse(JSON.stringify(homeContent.aboutCompany)))
    }
    
    // 我们的优势
    if (homeContent.advantages) {
      Object.assign(advantages, JSON.parse(JSON.stringify(homeContent.advantages)))
    }
    
    // 服务网络
    if (homeContent.serviceNetwork) {
      Object.assign(serviceNetwork, JSON.parse(JSON.stringify(homeContent.serviceNetwork)))
    }
  }
}

loadData()

// 关于明升伟业 - 操作方法
const addCertification = () => {
  aboutCompany.certifications.push({
    name: { 'zh-CN': '', 'en-US': '' }
  })
}

const removeCertification = (index) => {
  aboutCompany.certifications.splice(index, 1)
}

const saveAboutCompany = () => {
  const homeContent = { ...pageContentStore.pages.home }
  homeContent.aboutCompany = JSON.parse(JSON.stringify(aboutCompany))
  pageContentStore.updatePageContent('home', homeContent)
  ElMessage.success('保存成功')
}

// 我们的优势 - 操作方法
const addAdvantageItem = () => {
  advantages.items.push({
    icon: 'Star',
    title: { 'zh-CN': '', 'en-US': '' },
    description: { 'zh-CN': '', 'en-US': '' }
  })
}

const removeAdvantageItem = (index) => {
  advantages.items.splice(index, 1)
}

const saveAdvantages = () => {
  const homeContent = { ...pageContentStore.pages.home }
  homeContent.advantages = JSON.parse(JSON.stringify(advantages))
  pageContentStore.updatePageContent('home', homeContent)
  ElMessage.success('保存成功')
}

// 服务网络 - 操作方法
const addOffice = () => {
  serviceNetwork.offices.push({
    city: { 'zh-CN': '', 'en-US': '' },
    region: { 'zh-CN': '', 'en-US': '' }
  })
}

const removeOffice = (index) => {
  serviceNetwork.offices.splice(index, 1)
}

const saveServiceNetwork = () => {
  const homeContent = { ...pageContentStore.pages.home }
  homeContent.serviceNetwork = JSON.parse(JSON.stringify(serviceNetwork))
  pageContentStore.updatePageContent('home', homeContent)
  ElMessage.success('保存成功')
}
</script>

<style scoped>
.home-blocks-editor {
  margin-top: 20px;
}

.cert-item {
  margin-bottom: 10px;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
}

.help-text {
  margin-left: 10px;
  font-size: 12px;
  color: #909399;
}

:deep(.el-collapse-item__header) {
  padding: 0 15px;
}
</style>
