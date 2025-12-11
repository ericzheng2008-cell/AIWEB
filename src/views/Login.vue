<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>登录</h1>
          <p>欢迎回到企业营销平台</p>
        </div>

        <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              placeholder="用户名/手机号/邮箱"
              size="large"
              clearable>
              <template #prefix>
                <el-icon><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="密码"
              size="large"
              show-password
              @keyup.enter="handleLogin">
              <template #prefix>
                <el-icon><Lock /></el-icon>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item>
            <div class="form-footer">
              <el-checkbox v-model="loginForm.remember">记住我</el-checkbox>
              <el-link type="primary">忘记密码?</el-link>
            </div>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="loading"
              @click="handleLogin"
              class="login-btn">
              登录
            </el-button>
          </el-form-item>
        </el-form>

        <div class="login-footer">
          还没有账号? <router-link to="/register">立即注册</router-link>
        </div>

        <el-divider>其他登录方式</el-divider>

        <div class="social-login">
          <el-button circle @click="handleSocialLogin('wechat')">
            <el-icon color="#67c23a"><ChatDotRound /></el-icon>
          </el-button>
          <el-button circle @click="handleSocialLogin('qq')">
            <el-icon color="#409eff"><ChatLineRound /></el-icon>
          </el-button>
          <el-button circle @click="handleSocialLogin('weibo')">
            <el-icon color="#f56c6c"><Share /></el-icon>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = ref({
  username: '',
  password: '',
  remember: true
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  const valid = await loginFormRef.value?.validate()
  if (!valid) return

  loading.value = true

  // 模拟登录
  setTimeout(() => {
    // 模拟用户数据
    const mockUser = {
      id: 1,
      username: loginForm.value.username,
      role: loginForm.value.username === 'admin' ? 'admin' : 'user',
      avatar: 'https://i.pravatar.cc/150?img=10'
    }

    const mockToken = 'mock-jwt-token-' + Date.now()

    userStore.setToken(mockToken)
    userStore.setUserInfo(mockUser)

    ElMessage.success('登录成功')
    loading.value = false

    // 根据角色跳转
    if (mockUser.role === 'admin') {
      router.push('/admin/dashboard')
    } else {
      router.push('/')
    }
  }, 1000)
}

const handleSocialLogin = (type) => {
  ElMessage.info(`${type} 登录功能开发中...`)
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  width: 100%;
  max-width: 450px;
  padding: 20px;
}

.login-card {
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.1);
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header h1 {
  font-size: 32px;
  margin-bottom: 10px;
  color: #333;
}

.login-header p {
  color: #666;
  font-size: 14px;
}

.form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.login-btn {
  width: 100%;
}

.login-footer {
  text-align: center;
  margin: 20px 0;
  color: #666;
}

.login-footer a {
  color: #409eff;
  text-decoration: none;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}
</style>
