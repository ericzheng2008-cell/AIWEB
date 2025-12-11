<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <h1>注册</h1>
          <p>创建您的账号，开启营销之旅</p>
        </div>

        <el-form :model="registerForm" :rules="rules" ref="registerFormRef">
          <el-form-item prop="username">
            <el-input
              v-model="registerForm.username"
              placeholder="用户名"
              size="large"
              clearable>
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="email">
            <el-input
              v-model="registerForm.email"
              placeholder="邮箱"
              size="large"
              clearable>
              <template #prefix>
                <el-icon><Message /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="phone">
            <el-input
              v-model="registerForm.phone"
              placeholder="手机号"
              size="large"
              clearable>
              <template #prefix>
                <el-icon><Phone /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="registerForm.password"
              type="password"
              placeholder="密码"
              size="large"
              show-password>
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="confirmPassword">
            <el-input
              v-model="registerForm.confirmPassword"
              type="password"
              placeholder="确认密码"
              size="large"
              show-password>
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="agreement">
            <el-checkbox v-model="registerForm.agreement">
              我已阅读并同意 <el-link type="primary">用户协议</el-link> 和 <el-link type="primary">隐私政策</el-link>
            </el-checkbox>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="loading"
              @click="handleRegister"
              class="register-btn">
              注册
            </el-button>
          </el-form-item>
        </el-form>

        <div class="register-footer">
          已有账号? <router-link to="/login">立即登录</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const registerFormRef = ref(null)
const loading = ref(false)

const registerForm = ref({
  username: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  agreement: false
})

const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.value.password) {
    callback(new Error('两次输入密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度3-20个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ],
  agreement: [
    { 
      validator: (rule, value, callback) => {
        if (!value) {
          callback(new Error('请阅读并同意用户协议'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

const handleRegister = async () => {
  const valid = await registerFormRef.value?.validate()
  if (!valid) return

  loading.value = true

  // 模拟注册
  setTimeout(() => {
    ElMessage.success('注册成功! 请登录')
    loading.value = false
    router.push('/login')
  }, 1000)
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-container {
  width: 100%;
  max-width: 500px;
  padding: 20px;
}

.register-card {
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
}

.register-header {
  text-align: center;
  margin-bottom: 40px;
}

.register-header h1 {
  font-size: 32px;
  margin-bottom: 10px;
  color: #333;
}

.register-header p {
  color: #666;
  font-size: 14px;
}

.register-btn {
  width: 100%;
}

.register-footer {
  text-align: center;
  margin-top: 20px;
  color: #666;
}

.register-footer a {
  color: #409eff;
  text-decoration: none;
}
</style>
