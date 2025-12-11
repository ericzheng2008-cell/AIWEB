<template>
  <div class="user-center-page">
    <Header />
    
    <div class="container">
      <div class="user-layout">
        <aside class="user-sidebar">
          <div class="user-profile">
            <el-avatar :size="80" :src="userInfo.avatar" />
            <h3>{{ userInfo.username }}</h3>
            <p>{{ userInfo.email }}</p>
          </div>
          
          <el-menu :default-active="activeTab" @select="handleMenuSelect">
            <el-menu-item index="profile">
              <el-icon><User /></el-icon>
              <span>个人信息</span>
            </el-menu-item>
            <el-menu-item index="orders">
              <el-icon><ShoppingBag /></el-icon>
              <span>我的订单</span>
            </el-menu-item>
            <el-menu-item index="favorites">
              <el-icon><Star /></el-icon>
              <span>我的收藏</span>
            </el-menu-item>
            <el-menu-item index="settings">
              <el-icon><Setting /></el-icon>
              <span>账号设置</span>
            </el-menu-item>
          </el-menu>
        </aside>

        <main class="user-content">
          <!-- 个人信息 -->
          <el-card v-show="activeTab === 'profile'">
            <template #header>
              <h3>个人信息</h3>
            </template>
            <el-form :model="userInfo" label-width="100px">
              <el-form-item label="用户名">
                <el-input v-model="userInfo.username" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="userInfo.email" />
              </el-form-item>
              <el-form-item label="手机号">
                <el-input v-model="userInfo.phone" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="updateProfile">保存修改</el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 我的订单 -->
          <el-card v-show="activeTab === 'orders'">
            <template #header>
              <h3>我的订单</h3>
            </template>
            <el-empty v-if="orders.length === 0" description="暂无订单" />
            <div v-else class="orders-list">
              <div v-for="order in orders" :key="order.id" class="order-item">
                <div class="order-header">
                  <span>订单号: {{ order.id }}</span>
                  <el-tag :type="getStatusType(order.status)">{{ order.status }}</el-tag>
                </div>
                <div class="order-content">
                  <img :src="order.product.image" />
                  <div class="order-info">
                    <h4>{{ order.product.name }}</h4>
                    <p>¥{{ order.amount }}</p>
                  </div>
                </div>
                <div class="order-footer">
                  <span>{{ order.time }}</span>
                  <el-button size="small">查看详情</el-button>
                </div>
              </div>
            </div>
          </el-card>

          <!-- 我的收藏 -->
          <el-card v-show="activeTab === 'favorites'">
            <template #header>
              <h3>我的收藏</h3>
            </template>
            <el-empty description="暂无收藏" />
          </el-card>

          <!-- 账号设置 -->
          <el-card v-show="activeTab === 'settings'">
            <template #header>
              <h3>账号设置</h3>
            </template>
            <el-form label-width="100px">
              <el-form-item label="修改密码">
                <el-button>修改密码</el-button>
              </el-form-item>
              <el-form-item label="绑定手机">
                <el-button>绑定手机</el-button>
              </el-form-item>
              <el-form-item label="绑定邮箱">
                <el-button>绑定邮箱</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </main>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '../store'
import { ElMessage } from 'element-plus'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

const userStore = useUserStore()
const activeTab = ref('profile')

const userInfo = computed(() => userStore.userInfo)

const orders = ref([])

const handleMenuSelect = (index) => {
  activeTab.value = index
}

const updateProfile = () => {
  ElMessage.success('个人信息已更新')
}

const getStatusType = (status) => {
  const types = {
    '已支付': 'success',
    '待支付': 'warning',
    '已取消': 'info'
  }
  return types[status] || 'info'
}
</script>

<style scoped>
.user-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 30px;
  padding: 40px 0;
}

.user-sidebar {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
}

.user-profile {
  padding: 30px;
  text-align: center;
  border-bottom: 1px solid #eee;
}

.user-profile h3 {
  margin: 15px 0 5px;
}

.user-profile p {
  color: #666;
  font-size: 14px;
}

.user-content {
  min-height: 500px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-item {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.order-content {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.order-content img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 4px;
}

.order-info h4 {
  margin-bottom: 10px;
}

.order-info p {
  color: #f56c6c;
  font-size: 20px;
  font-weight: 700;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #999;
}
</style>
