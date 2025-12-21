<template>
  <div class="material-download">
    <!-- 资料下载卡片（首页展示） -->
    <div class="material-card">
      <div class="card-header">
        <div class="header-icon">📚</div>
        <div class="header-text">
          <h3>{{ t('materials.title') }}</h3>
          <p>{{ t('materials.subtitle') }}</p>
        </div>
      </div>
      <div class="card-body">
        <p class="card-desc">{{ t('materials.description') }}</p>
        <el-button type="primary" size="large" @click="showMaterialDialog = true">
          <el-icon><Download /></el-icon>
          {{ t('materials.viewAll') }}
        </el-button>
      </div>
    </div>

    <!-- 资料下载弹窗 -->
    <el-dialog
      v-model="showMaterialDialog"
      :title="t('materials.dialogTitle')"
      width="90%"
      top="5vh"
      class="material-dialog">
      
      <!-- 返回主页按钮 -->
      <div class="dialog-back-home">
        <el-button type="primary" size="small" @click="backToHome">
          <el-icon><HomeFilled /></el-icon>
          {{ t('common.backHome') }}
        </el-button>
      </div>

      <div class="material-container">
        <!-- 顶部筛选栏 -->
        <div class="material-toolbar">
          <el-tabs v-model="activeCategory" @tab-change="handleCategoryChange">
            <el-tab-pane 
              :label="t('materials.allCategories')" 
              name="all">
            </el-tab-pane>
            <el-tab-pane 
              v-for="category in visibleCategories" 
              :key="category.id"
              :label="category.name[locale] || category.name['zh-CN']"
              :name="String(category.id)">
            </el-tab-pane>
          </el-tabs>

          <el-select v-model="activeType" :placeholder="t('materials.filterByType')" style="width: 200px">
            <el-option :label="t('materials.allTypes')" value="all" />
            <el-option :label="t('materials.types.manual')" value="manual" />
            <el-option :label="t('materials.types.technical')" value="technical" />
            <el-option :label="t('materials.types.whitepaper')" value="whitepaper" />
            <el-option :label="t('materials.types.other')" value="other" />
          </el-select>
        </div>

        <!-- 资料列表 -->
        <div class="materials-grid">
          <div v-for="material in filteredMaterials" :key="material.id" class="material-item">
            <div class="material-thumbnail">
              <img v-if="material.thumbnailUrl" :src="material.thumbnailUrl" :alt="material.title[locale]" />
              <div v-else class="thumbnail-placeholder">
                <el-icon :size="60"><Document /></el-icon>
              </div>
              <div class="material-type-badge">
                {{ getMaterialTypeName(material.type) }}
              </div>
            </div>

            <div class="material-info">
              <h4>{{ material.title[locale] || material.title['zh-CN'] }}</h4>
              <p class="material-desc">{{ material.description[locale] || material.description['zh-CN'] }}</p>
              
              <div class="material-meta">
                <el-tag size="small" type="info">
                  <el-icon><Document /></el-icon>
                  {{ material.fileType.toUpperCase() }}
                </el-tag>
                <el-tag size="small" type="success">
                  <el-icon><Download /></el-icon>
                  {{ material.fileSize }}
                </el-tag>
                <el-tag size="small">
                  {{ material.downloadCount || 0 }} {{ t('materials.downloads') }}
                </el-tag>
              </div>

              <el-button 
                type="primary" 
                size="large" 
                class="download-btn"
                @click="handleDownload(material)">
                <el-icon><Download /></el-icon>
                {{ t('materials.download') }}
              </el-button>
            </div>
          </div>

          <el-empty 
            v-if="filteredMaterials.length === 0" 
            :description="t('materials.noMaterials')"
            :image-size="200" />
        </div>
      </div>
    </el-dialog>

    <!-- 用户注册弹窗（下载前需要注册） -->
    <el-dialog
      v-model="showRegistrationDialog"
      :title="t('materials.registrationTitle')"
      width="500px"
      :close-on-click-modal="false"
      class="registration-dialog">
      
      <el-form 
        ref="registrationFormRef" 
        :model="registrationForm" 
        :rules="registrationRules"
        label-width="100px">
        
        <el-alert
          :title="t('materials.registrationNotice')"
          type="info"
          :closable="false"
          style="margin-bottom: 20px" />

        <el-form-item :label="t('materials.form.name')" prop="name">
          <el-input 
            v-model="registrationForm.name" 
            :placeholder="t('materials.form.namePlaceholder')"
            clearable />
        </el-form-item>

        <el-form-item :label="t('materials.form.company')" prop="company">
          <el-input 
            v-model="registrationForm.company" 
            :placeholder="t('materials.form.companyPlaceholder')"
            clearable />
        </el-form-item>

        <el-form-item :label="t('materials.form.phone')" prop="phone">
          <el-input 
            v-model="registrationForm.phone" 
            :placeholder="t('materials.form.phonePlaceholder')"
            clearable />
        </el-form-item>

        <el-form-item :label="t('materials.form.email')" prop="email">
          <el-input 
            v-model="registrationForm.email" 
            :placeholder="t('materials.form.emailPlaceholder')"
            clearable />
        </el-form-item>

        <el-form-item :label="t('materials.form.captcha')" prop="captcha">
          <div class="captcha-container">
            <el-input 
              v-model="registrationForm.captcha" 
              :placeholder="t('materials.form.captchaPlaceholder')"
              style="width: 200px" />
            <div class="captcha-code" @click="refreshCaptcha">
              <canvas ref="captchaCanvas" width="120" height="40"></canvas>
            </div>
          </div>
        </el-form-item>

        <el-form-item :label="t('materials.form.purpose')">
          <el-radio-group v-model="registrationForm.purpose">
            <el-radio value="download">{{ t('materials.purposes.download') }}</el-radio>
            <el-radio value="quote">{{ t('materials.purposes.quote') }}</el-radio>
            <el-radio value="both">{{ t('materials.purposes.both') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showRegistrationDialog = false">
          {{ t('common.cancel') }}
        </el-button>
        <el-button type="primary" @click="submitRegistration" :loading="submitting">
          {{ t('common.submit') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useMaterialDownloadStore } from '../store/materialDownload'
import { Download, Document, HomeFilled } from '@element-plus/icons-vue'

const router = useRouter()
const { t, locale } = useI18n()
const materialStore = useMaterialDownloadStore()

const showMaterialDialog = ref(false)
const showRegistrationDialog = ref(false)
const activeCategory = ref('all')
const activeType = ref('all')
const submitting = ref(false)
const currentMaterial = ref(null)

const registrationFormRef = ref(null)
const captchaCanvas = ref(null)
const captchaCode = ref('')

// 注册表单
const registrationForm = ref({
  name: '',
  company: '',
  phone: '',
  email: '',
  captcha: '',
  purpose: 'download'
})

// 表单验证规则
const registrationRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  company: [
    { required: true, message: '请输入公司名称', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { 
      validator: (rule, value, callback) => {
        if (value.toLowerCase() !== captchaCode.value.toLowerCase()) {
          callback(new Error('验证码不正确'))
        } else {
          callback()
        }
      }, 
      trigger: 'blur' 
    }
  ]
}

// 获取分类和资料
const visibleCategories = computed(() => materialStore.visibleCategories)

const filteredMaterials = computed(() => {
  let materials = materialStore.visibleMaterials
  
  // 按分类筛选
  if (activeCategory.value !== 'all') {
    materials = materials.filter(m => String(m.categoryId) === activeCategory.value)
  }
  
  // 按类型筛选
  if (activeType.value !== 'all') {
    materials = materials.filter(m => m.type === activeType.value)
  }
  
  return materials
})

// 获取资料类型名称
const getMaterialTypeName = (type) => {
  const typeNames = {
    manual: t('materials.types.manual'),
    technical: t('materials.types.technical'),
    whitepaper: t('materials.types.whitepaper'),
    other: t('materials.types.other')
  }
  return typeNames[type] || type
}

// 处理分类切换
const handleCategoryChange = (categoryId) => {
  activeCategory.value = categoryId
}

// 返回主页
const backToHome = () => {
  showMaterialDialog.value = false
  router.push('/')
}

// 处理下载
const handleDownload = (material) => {
  currentMaterial.value = material
  
  // 检查是否已注册（简化版：检查localStorage）
  const userInfo = localStorage.getItem('materialUserInfo')
  if (userInfo) {
    // 已注册，直接下载
    executeDownload(material, JSON.parse(userInfo))
  } else {
    // 未注册，显示注册弹窗
    showRegistrationDialog.value = true
    refreshCaptcha()
  }
}

// 执行下载
const executeDownload = (material, userInfo) => {
  // 记录下载
  materialStore.recordDownload(material.id, userInfo)
  
  // 模拟下载（实际应用中应该从服务器下载）
  ElMessage.success(t('materials.downloadSuccess'))
  
  // 如果是真实文件，可以触发下载
  if (material.fileUrl && material.fileUrl !== '#') {
    const link = document.createElement('a')
    link.href = material.fileUrl
    link.download = `${material.title[locale.value] || material.title['zh-CN']}.${material.fileType}`
    link.click()
  }
}

// 提交注册
const submitRegistration = async () => {
  if (!registrationFormRef.value) return
  
  await registrationFormRef.value.validate((valid) => {
    if (valid) {
      submitting.value = true
      
      // 保存用户信息
      const userInfo = {
        name: registrationForm.value.name,
        company: registrationForm.value.company,
        phone: registrationForm.value.phone,
        email: registrationForm.value.email,
        purpose: registrationForm.value.purpose
      }
      
      // 注册用户
      materialStore.registerUser(userInfo)
      
      // 保存到localStorage（用于下次自动识别）
      localStorage.setItem('materialUserInfo', JSON.stringify(userInfo))
      
      setTimeout(() => {
        submitting.value = false
        showRegistrationDialog.value = false
        ElMessage.success(t('materials.registrationSuccess'))
        
        // 执行下载
        if (currentMaterial.value) {
          executeDownload(currentMaterial.value, userInfo)
        }
        
        // 重置表单
        registrationFormRef.value.resetFields()
      }, 1000)
    }
  })
}

// 生成验证码
const generateCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// 绘制验证码
const drawCaptcha = () => {
  nextTick(() => {
    if (!captchaCanvas.value) return
    
    const ctx = captchaCanvas.value.getContext('2d')
    const width = captchaCanvas.value.width
    const height = captchaCanvas.value.height
    
    // 清空画布
    ctx.clearRect(0, 0, width, height)
    
    // 背景
    ctx.fillStyle = '#f0f0f0'
    ctx.fillRect(0, 0, width, height)
    
    // 干扰线
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`
      ctx.beginPath()
      ctx.moveTo(Math.random() * width, Math.random() * height)
      ctx.lineTo(Math.random() * width, Math.random() * height)
      ctx.stroke()
    }
    
    // 验证码文字
    captchaCode.value = generateCaptcha()
    ctx.font = 'bold 24px Arial'
    ctx.textBaseline = 'middle'
    
    for (let i = 0; i < captchaCode.value.length; i++) {
      ctx.fillStyle = `rgb(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100})`
      ctx.save()
      ctx.translate(20 + i * 25, height / 2)
      ctx.rotate((Math.random() - 0.5) * 0.3)
      ctx.fillText(captchaCode.value[i], 0, 0)
      ctx.restore()
    }
    
    // 干扰点
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.5)`
      ctx.beginPath()
      ctx.arc(Math.random() * width, Math.random() * height, 1, 0, 2 * Math.PI)
      ctx.fill()
    }
  })
}

// 刷新验证码
const refreshCaptcha = () => {
  drawCaptcha()
}

onMounted(() => {
  // 初始化验证码
  if (showRegistrationDialog.value) {
    drawCaptcha()
  }
})
</script>

<style scoped>
/* 资料下载卡片 */
.material-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 32px;
  color: white;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.25);
  transition: all 0.3s;
  cursor: pointer;
}

.material-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 32px rgba(102, 126, 234, 0.35);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.header-icon {
  font-size: 64px;
  line-height: 1;
}

.header-text h3 {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.header-text p {
  font-size: 16px;
  margin: 0;
  opacity: 0.9;
}

.card-body {
  margin-top: 20px;
}

.card-desc {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 24px;
  opacity: 0.95;
}

.card-body .el-button {
  width: 100%;
  height: 56px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 12px;
}

/* 资料下载弹窗 */
.material-dialog .el-dialog__header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px 32px;
}

.material-dialog .el-dialog__title {
  color: white;
  font-size: 24px;
  font-weight: 700;
}

.material-dialog .el-dialog__body {
  padding: 0;
  max-height: 80vh;
  overflow-y: auto;
}

.dialog-back-home {
  position: absolute;
  top: 24px;
  right: 80px;
  z-index: 10;
}

.material-container {
  padding: 24px;
}

.material-toolbar {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.material-toolbar .el-tabs {
  flex: 1;
}

.materials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.material-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.material-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
}

.material-thumbnail {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.material-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.material-type-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(102, 126, 234, 0.9);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.material-info {
  padding: 20px;
}

.material-info h4 {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.material-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 16px;
}

.material-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.download-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
}

/* 注册弹窗 */
.registration-dialog .el-dialog__header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 24px;
}

.registration-dialog .el-dialog__title {
  color: white;
  font-size: 20px;
  font-weight: 600;
}

.captcha-container {
  display: flex;
  gap: 12px;
  align-items: center;
}

.captcha-code {
  cursor: pointer;
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #dcdfe6;
  transition: all 0.3s;
}

.captcha-code:hover {
  border-color: #667eea;
  box-shadow: 0 0 8px rgba(102, 126, 234, 0.3);
}

.captcha-code canvas {
  display: block;
}

/* 响应式 */
@media (max-width: 768px) {
  .materials-grid {
    grid-template-columns: 1fr;
  }
  
  .material-toolbar {
    flex-direction: column;
  }
  
  .dialog-back-home {
    top: 16px;
    right: 60px;
  }
}
</style>
