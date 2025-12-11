<template>
  <div class="promotion-page">
    <Header />
    
    <div class="page-banner">
      <h1>营销推广</h1>
      <p>精选营销活动，助力业务增长</p>
    </div>

    <div class="container">
      <div class="promotions-list">
        <el-card v-for="promo in promotions" :key="promo.id" class="promotion-card">
          <div class="promo-content">
            <img :src="promo.image" :alt="promo.title" />
            <div class="promo-info">
              <h2>{{ promo.title }}</h2>
              <p>{{ promo.description }}</p>
              <div class="promo-meta">
                <span><el-icon><Clock /></el-icon> {{ promo.endDate }}</span>
                <span class="participants"><el-icon><User /></el-icon> {{ promo.participants }}人参与</span>
              </div>
              <el-button type="danger" size="large" @click="participate(promo)">
                立即参与
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

const promotions = ref([
  {
    id: 1,
    title: '新用户专享优惠',
    description: '注册即送1000元优惠券，首单立减500元',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200',
    endDate: '2024-12-31',
    participants: 1256
  },
  {
    id: 2,
    title: '限时秒杀活动',
    description: '精选产品5折起，每日10:00准时开抢',
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200',
    endDate: '2024-12-25',
    participants: 2580
  }
])

const participate = (promo) => {
  ElMessage.success(`成功参与 ${promo.title}`)
}
</script>

<style scoped>
.page-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  text-align: center;
  padding: 80px 20px;
}

.page-banner h1 {
  font-size: 48px;
  margin-bottom: 15px;
}

.page-banner p {
  font-size: 20px;
  opacity: 0.9;
}

.promotions-list {
  padding: 60px 0;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.promotion-card {
  overflow: hidden;
}

.promo-content {
  display: grid;
  grid-template-columns: 500px 1fr;
  gap: 40px;
}

.promo-content img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 8px;
}

.promo-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.promo-info h2 {
  font-size: 32px;
  margin-bottom: 20px;
}

.promo-info p {
  font-size: 18px;
  color: #666;
  margin-bottom: 30px;
  line-height: 1.8;
}

.promo-meta {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
  color: #999;
}

.promo-meta span {
  display: flex;
  align-items: center;
  gap: 8px;
}

.participants {
  color: #409eff;
}
</style>
