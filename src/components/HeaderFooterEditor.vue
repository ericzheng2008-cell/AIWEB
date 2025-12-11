<template>
  <el-space direction="vertical" :size="20" style="width: 100%;">
    <!-- 顶部联系信息 -->
    <el-card>
      <template #header><h3>顶部联系信息</h3></template>
      <el-form label-width="120px">
        <el-form-item label="服务热线">
          <el-input v-model="topContact.hotline" placeholder="400-123-4567" />
        </el-form-item>
        <el-form-item label="邮箱地址">
          <el-input v-model="topContact.email" placeholder="sales@mingsheng.com" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveTopContact">
            <el-icon><Check /></el-icon> 保存顶部联系信息
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 页脚公司信息 -->
    <el-card>
      <template #header><h3>页脚公司信息</h3></template>
      <el-form label-width="120px">
        <el-form-item label="中文公司名">
          <el-input v-model="footerConfig.companyInfo.name['zh-CN']" />
        </el-form-item>
        <el-form-item label="英文公司名">
          <el-input v-model="footerConfig.companyInfo.name['en-US']" />
        </el-form-item>
        <el-form-item label="中文描述">
          <el-input type="textarea" :rows="4" v-model="footerConfig.companyInfo.description['zh-CN']" />
        </el-form-item>
        <el-form-item label="英文描述">
          <el-input type="textarea" :rows="4" v-model="footerConfig.companyInfo.description['en-US']" />
        </el-form-item>
        <el-form-item label="资质认证">
          <div class="certifications-list">
            <el-tag
              v-for="(cert, index) in footerConfig.companyInfo.certifications"
              :key="index"
              closable
              @close="removeCertification(index)"
              style="margin-right: 10px; margin-bottom: 10px;">
              {{ cert }}
            </el-tag>
            <el-input
              v-model="newCertification"
              placeholder="添加认证"
              style="width: 150px; margin-right: 10px;"
              size="small"
              @keyup.enter="addCertification" />
            <el-button size="small" @click="addCertification">
              <el-icon><Plus /></el-icon> 添加
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 页脚联系信息 -->
    <el-card>
      <template #header><h3>页脚联系方式</h3></template>
      <el-form label-width="120px">
        <el-form-item label="联系电话">
          <el-input v-model="footerConfig.contact.phone" placeholder="400-123-4567" />
        </el-form-item>
        <el-form-item label="联系邮箱">
          <el-input v-model="footerConfig.contact.email" placeholder="sales@mingsheng.com" />
        </el-form-item>
        <el-form-item label="中文地址">
          <el-input v-model="footerConfig.contact.address['zh-CN']" />
        </el-form-item>
        <el-form-item label="英文地址">
          <el-input v-model="footerConfig.contact.address['en-US']" />
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 服务网络 -->
    <el-card>
      <template #header><h3>服务网络城市</h3></template>
      <el-form label-width="120px">
        <el-form-item label="中文城市列表">
          <el-input v-model="footerConfig.serviceCities['zh-CN']" placeholder="广州 · 长沙 · 株洲 · 柳州 · 武汉 · 杭州 · 上海" />
          <span class="help-text">用 · 分隔城市名称</span>
        </el-form-item>
        <el-form-item label="英文城市列表">
          <el-input v-model="footerConfig.serviceCities['en-US']" placeholder="Guangzhou · Changsha · Zhuzhou · Liuzhou · Wuhan · Hangzhou · Shanghai" />
          <span class="help-text">Use · to separate city names</span>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 版权信息 -->
    <el-card>
      <template #header><h3>版权信息</h3></template>
      <el-form label-width="120px">
        <el-form-item label="中文版权">
          <el-input v-model="footerConfig.copyright['zh-CN']" placeholder="1996-2024 广州市明升伟业机电有限公司. 粤ICP备xxxxxxxx号" />
        </el-form-item>
        <el-form-item label="英文版权">
          <el-input v-model="footerConfig.copyright['en-US']" placeholder="1996-2024 Guangzhou Mingsheng Mechanical and Electrical Co., Ltd. All rights reserved." />
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 保存按钮 -->
    <el-card>
      <el-button type="primary" size="large" @click="saveAll">
        <el-icon><Check /></el-icon> 保存所有页脚配置
      </el-button>
    </el-card>
  </el-space>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useCmsAdvancedStore } from '../store/cmsAdvanced'
import { ElMessage } from 'element-plus'

const cmsStore = useCmsAdvancedStore()

// 顶部联系信息
const topContact = reactive({
  hotline: cmsStore.siteConfig.topContact.hotline,
  email: cmsStore.siteConfig.topContact.email
})

// 页脚配置
const footerConfig = reactive(JSON.parse(JSON.stringify(cmsStore.footerConfig)))

// 新增认证
const newCertification = ref('')

const saveTopContact = () => {
  cmsStore.updateTopContact(topContact)
  ElMessage.success('顶部联系信息已保存')
}

const addCertification = () => {
  if (newCertification.value.trim()) {
    footerConfig.companyInfo.certifications.push(newCertification.value.trim())
    newCertification.value = ''
  }
}

const removeCertification = (index) => {
  footerConfig.companyInfo.certifications.splice(index, 1)
}

const saveAll = () => {
  cmsStore.updateFooterConfig(footerConfig)
  ElMessage.success('页脚配置已保存')
}
</script>

<style scoped>
.certifications-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.help-text {
  display: block;
  margin-top: 5px;
  font-size: 12px;
  color: #909399;
}
</style>
