<template>
  <div class="inquiry-form-container">
    <!-- 浮动询盘按钮 -->
    <transition name="bounce">
      <div 
        class="inquiry-button" 
        :class="{ dragging: isButtonDragging }"
        @click="!isButtonDragging && (showForm = true)" 
        @mousedown="startButtonDrag"
        @touchstart="startButtonDrag"
        :style="{ bottom: buttonPosition.y + 'px', right: buttonPosition.x + 'px' }"
        v-if="!showForm">
        <el-icon :size="24"><ChatLineSquare /></el-icon>
        <span>{{ t('inquiry.title') }}</span>
      </div>
    </transition>

    <!-- 询盘表单对话框 -->
    <el-dialog
      v-model="showForm"
      :title="t('inquiry.title')"
      width="600px"
      :close-on-click-modal="false"
      class="inquiry-dialog">
      
      <div class="form-subtitle">{{ t('inquiry.subtitle') }}</div>

      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-position="top"
        class="inquiry-form">
        
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item :label="t('inquiry.name')" prop="name">
              <el-input
                v-model="formData.name"
                :placeholder="t('inquiry.namePlaceholder')"
                prefix-icon="User" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item :label="t('inquiry.email')" prop="email">
              <el-input
                v-model="formData.email"
                :placeholder="t('inquiry.emailPlaceholder')"
                prefix-icon="Message" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item :label="t('inquiry.company')" prop="company">
              <el-input
                v-model="formData.company"
                :placeholder="t('inquiry.companyPlaceholder')"
                prefix-icon="OfficeBuilding" />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item :label="t('inquiry.phone')" prop="phone">
              <el-input
                v-model="formData.phone"
                :placeholder="t('inquiry.phonePlaceholder')"
                prefix-icon="Phone" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item :label="t('inquiry.country')" prop="country">
              <el-select
                v-model="formData.country"
                :placeholder="t('inquiry.countryPlaceholder')"
                filterable
                style="width: 100%">
                <el-option
                  v-for="country in countries"
                  :key="country.code"
                  :label="`${country.flag} ${country.name[locale] || country.name.en}`"
                  :value="country.code" />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item :label="t('inquiry.product')" prop="product">
              <el-input
                v-model="formData.product"
                :placeholder="t('inquiry.productPlaceholder')"
                prefix-icon="Box" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item :label="t('inquiry.quantity')">
          <el-input
            v-model="formData.quantity"
            :placeholder="t('inquiry.quantityPlaceholder')"
            prefix-icon="Histogram" />
        </el-form-item>

        <el-form-item :label="t('inquiry.message')" prop="message">
          <el-input
            v-model="formData.message"
            :placeholder="t('inquiry.messagePlaceholder')"
            type="textarea"
            :rows="4"
            maxlength="500"
            show-word-limit />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showForm = false">{{ t('common.cancel') || '取消' }}</el-button>
          <el-button
            type="primary"
            @click="submitInquiry"
            :loading="submitting"
            :disabled="submitting">
            {{ submitting ? t('inquiry.submitting') : t('inquiry.submit') }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'

const { t, locale } = useI18n()
const showForm = ref(false)
const submitting = ref(false)
const formRef = ref(null)

// 拖拽功能相关状态
const buttonPosition = ref({ x: 30, y: 120 }) // 询盘按钮位置
const isButtonDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })

// 表单数据
const formData = reactive({
  name: '',
  email: '',
  company: '',
  phone: '',
  country: '',
  product: '',
  quantity: '',
  message: ''
})

// 主要国家列表
const countries = [
  { code: 'CN', name: { zh: '中国', en: 'China' }, flag: '🇨🇳' },
  { code: 'US', name: { zh: '美国', en: 'United States' }, flag: '🇺🇸' },
  { code: 'GB', name: { zh: '英国', en: 'United Kingdom' }, flag: '🇬🇧' },
  { code: 'DE', name: { zh: '德国', en: 'Germany' }, flag: '🇩🇪' },
  { code: 'FR', name: { zh: '法国', en: 'France' }, flag: '🇫🇷' },
  { code: 'JP', name: { zh: '日本', en: 'Japan' }, flag: '🇯🇵' },
  { code: 'KR', name: { zh: '韩国', en: 'South Korea' }, flag: '🇰🇷' },
  { code: 'IT', name: { zh: '意大利', en: 'Italy' }, flag: '🇮🇹' },
  { code: 'ES', name: { zh: '西班牙', en: 'Spain' }, flag: '🇪🇸' },
  { code: 'CA', name: { zh: '加拿大', en: 'Canada' }, flag: '🇨🇦' },
  { code: 'AU', name: { zh: '澳大利亚', en: 'Australia' }, flag: '🇦🇺' },
  { code: 'BR', name: { zh: '巴西', en: 'Brazil' }, flag: '🇧🇷' },
  { code: 'MX', name: { zh: '墨西哥', en: 'Mexico' }, flag: '🇲🇽' },
  { code: 'IN', name: { zh: '印度', en: 'India' }, flag: '🇮🇳' },
  { code: 'RU', name: { zh: '俄罗斯', en: 'Russia' }, flag: '🇷🇺' },
  { code: 'SG', name: { zh: '新加坡', en: 'Singapore' }, flag: '🇸🇬' },
  { code: 'TH', name: { zh: '泰国', en: 'Thailand' }, flag: '🇹🇭' },
  { code: 'VN', name: { zh: '越南', en: 'Vietnam' }, flag: '🇻🇳' },
  { code: 'ID', name: { zh: '印度尼西亚', en: 'Indonesia' }, flag: '🇮🇩' },
  { code: 'MY', name: { zh: '马来西亚', en: 'Malaysia' }, flag: '🇲🇾' }
]

// 表单验证规则
const rules = computed(() => ({
  name: [
    { required: true, message: locale.value === 'zh-CN' ? '请输入姓名' : 'Please enter your name', trigger: 'blur' }
  ],
  email: [
    { required: true, message: locale.value === 'zh-CN' ? '请输入邮箱' : 'Please enter email', trigger: 'blur' },
    { type: 'email', message: locale.value === 'zh-CN' ? '请输入正确的邮箱格式' : 'Please enter valid email', trigger: 'blur' }
  ],
  company: [
    { required: true, message: locale.value === 'zh-CN' ? '请输入公司名称' : 'Please enter company name', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: locale.value === 'zh-CN' ? '请输入电话' : 'Please enter phone', trigger: 'blur' }
  ],
  country: [
    { required: true, message: locale.value === 'zh-CN' ? '请选择国家' : 'Please select country', trigger: 'change' }
  ],
  product: [
    { required: true, message: locale.value === 'zh-CN' ? '请输入产品信息' : 'Please enter product', trigger: 'blur' }
  ],
  message: [
    { required: true, message: locale.value === 'zh-CN' ? '请输入详细需求' : 'Please enter message', trigger: 'blur' }
  ]
}))

// 提交询盘
const submitInquiry = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    submitting.value = true
    
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // 这里应该调用实际的API
      console.log('提交询盘数据：', {
        ...formData,
        timestamp: new Date().toISOString(),
        locale: locale.value
      })
      
      ElMessage.success({
        message: t('inquiry.successMessage'),
        duration: 3000
      })
      
      // 重置表单
      formRef.value.resetFields()
      showForm.value = false
      
    } catch (error) {
      console.error('提交失败：', error)
      ElMessage.error({
        message: t('inquiry.errorMessage'),
        duration: 3000
      })
    } finally {
      submitting.value = false
    }
  })
}

// 询盘按钮拖动开始
const startButtonDrag = (e) => {
  e.stopPropagation()
  isButtonDragging.value = true
  
  const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX
  const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY
  
  dragStart.value = {
    x: clientX - (window.innerWidth - buttonPosition.value.x - 100),
    y: clientY - (window.innerHeight - buttonPosition.value.y - 60)
  }
  
  document.addEventListener('mousemove', onButtonDrag)
  document.addEventListener('mouseup', stopButtonDrag)
  document.addEventListener('touchmove', onButtonDrag)
  document.addEventListener('touchend', stopButtonDrag)
}

// 询盘按钮拖动中
const onButtonDrag = (e) => {
  if (!isButtonDragging.value) return
  
  e.preventDefault()
  const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX
  const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY
  
  const newRight = window.innerWidth - clientX + dragStart.value.x
  const newBottom = window.innerHeight - clientY + dragStart.value.y
  
  buttonPosition.value = {
    x: Math.max(10, Math.min(window.innerWidth - 110, newRight)),
    y: Math.max(10, Math.min(window.innerHeight - 70, newBottom))
  }
}

// 询盘按钮拖动结束
const stopButtonDrag = (e) => {
  if (isButtonDragging.value) {
    e.stopPropagation()
    e.preventDefault()
  }
  
  isButtonDragging.value = false
  document.removeEventListener('mousemove', onButtonDrag)
  document.removeEventListener('mouseup', stopButtonDrag)
  document.removeEventListener('touchmove', onButtonDrag)
  document.removeEventListener('touchend', stopButtonDrag)
}
</script>

<style scoped>
/* 浮动询盘按钮 */
.inquiry-button {
  position: fixed;
  z-index: 9998;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: #fff;
  border-radius: 50px;
  box-shadow: 0 8px 24px rgba(245, 87, 108, 0.4);
  cursor: move;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  font-size: 15px;
  font-weight: 500;
  user-select: none;
}

.inquiry-button.dragging {
  cursor: grabbing;
  box-shadow: 0 12px 32px rgba(245, 87, 108, 0.6);
  transform: scale(1.05);
}

.inquiry-button:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow: 0 12px 32px rgba(245, 87, 108, 0.5);
}

.inquiry-button.dragging:hover {
  transform: scale(1.05);
}

/* 弹跳动画 */
.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.bounce-leave-active {
  animation: bounce-in 0.3s reverse;
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 对话框样式 */
.inquiry-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 20px;
  margin: 0;
}

.inquiry-dialog :deep(.el-dialog__title) {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
}

.inquiry-dialog :deep(.el-dialog__headerbtn .el-icon) {
  color: #fff;
  font-size: 20px;
}

.form-subtitle {
  color: #666;
  font-size: 14px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.inquiry-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #333;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 移动端响应式 */
@media (max-width: 768px) {
  .inquiry-button span {
    display: none;
  }

  :deep(.el-dialog) {
    width: 95% !important;
    margin: 5vh auto !important;
  }
}
</style>
