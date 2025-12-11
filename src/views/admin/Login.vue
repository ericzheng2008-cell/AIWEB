<template>
  <div class="admin-login-page">
    <div class="login-container">
      <div class="login-header">
        <h1>明升伟业管理后台</h1>
        <p>Mingsheng Admin System</p>
      </div>

      <el-form :model="loginForm" :rules="rules" ref="loginFormRef" class="login-form">
        <el-form-item prop="username">
          <el-input 
            v-model="loginForm.username" 
            placeholder="请输入用户名"
            size="large"
            prefix-icon="User"
          />
        </el-form-item>

        <el-form-item prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password"
            placeholder="请输入密码"
            size="large"
            prefix-icon="Lock"
            @keyup.enter="handleLogin"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="loginForm.remember">记住密码</el-checkbox>
        </el-form-item>

        <el-button 
          type="primary" 
          size="large" 
          class="login-btn"
          :loading="loading"
          @click="handleLogin"
        >
          登 录
        </el-button>
      </el-form>

      <div class="login-tips">
        <p>默认账号：admin / admin123</p>
        <p>测试账号：test / test123</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
  remember: false
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  await loginFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      
      // 模拟登录验证
      setTimeout(() => {
        const validUsers = {
          'admin': 'admin123',
          'test': 'test123'
        }
        
        if (validUsers[loginForm.username] === loginForm.password) {
          // 保存登录状态
          localStorage.setItem('adminToken', 'admin-token-' + Date.now())
          localStorage.setItem('adminUser', JSON.stringify({
            username: loginForm.username,
            role: loginForm.username === 'admin' ? 'admin' : 'user'
          }))
          
          ElMessage.success('登录成功')
          router.push('/admin/dashboard')
        } else {
          ElMessage.error('用户名或密码错误')
        }
        loading.value = false
      }, 1000)
    }
  })
}
</script>

<style scoped>
.admin-login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.admin-login-page::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  animation: moveBackground 20s linear infinite;
}

@keyframes moveBackground {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(50px, 50px);
  }
}

.login-container {
  width: 420px;
  padding: 50px 40px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.login-header p {
  font-size: 14px;
  color: #666;
  font-weight: 400;
}

.login-form {
  margin-top: 30px;
}

.login-btn {
  width: 100%;
  margin-top: 10px;
  font-size: 16px;
  font-weight: 600;
  height: 48px;
}

.login-tips {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e8e8e8;
  text-align: center;
}

.login-tips p {
  font-size: 13px;
  color: #999;
  margin: 8px 0;
}
</style>
