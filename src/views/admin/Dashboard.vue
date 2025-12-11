<template>
  <div class="admin-dashboard">
    <AdminLayout>
      <div class="dashboard-header">
        <h1>数据概览</h1>
        <p>实时监控系统运行状态</p>
      </div>

      <!-- 统计卡片 -->
      <div class="stats-grid">
        <div class="stat-card" v-for="stat in stats" :key="stat.title">
          <div class="stat-icon" :style="{ background: stat.color }">
            <el-icon :size="32">
              <component :is="stat.icon" />
            </el-icon>
          </div>
          <div class="stat-content">
            <p class="stat-title">{{ stat.title }}</p>
            <h2 class="stat-value">{{ stat.value }}</h2>
            <p class="stat-trend" :class="{ up: stat.trend > 0, down: stat.trend < 0 }">
              <el-icon><trend-charts /></el-icon>
              {{ Math.abs(stat.trend) }}% {{ stat.trend > 0 ? '↑' : '↓' }}
            </p>
          </div>
        </div>
      </div>

      <!-- 快捷操作 -->
      <div class="quick-actions">
        <h2>快捷操作</h2>
        <div class="actions-grid">
          <div class="action-card" @click="$router.push('/admin/ai-knowledge')">
            <el-icon :size="40"><ChatDotRound /></el-icon>
            <h3>AI知识库</h3>
            <p>配置AI客服知识</p>
          </div>
          <div class="action-card" @click="$router.push('/admin/content')">
            <el-icon :size="40"><Document /></el-icon>
            <h3>内容管理</h3>
            <p>编辑网站内容</p>
          </div>
          <div class="action-card" @click="$router.push('/admin/settings')">
            <el-icon :size="40"><Setting /></el-icon>
            <h3>系统设置</h3>
            <p>配置系统参数</p>
          </div>
        </div>
      </div>

      <!-- 最近访问 -->
      <div class="recent-activity">
        <h2>最近访问</h2>
        <el-table :data="recentData" style="width: 100%">
          <el-table-column prop="page" label="访问页面" />
          <el-table-column prop="ip" label="IP地址" />
          <el-table-column prop="time" label="访问时间" />
          <el-table-column prop="duration" label="停留时长" />
        </el-table>
      </div>
    </AdminLayout>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AdminLayout from './AdminLayout.vue'

const stats = ref([
  {
    title: '今日访问量',
    value: '1,248',
    trend: 12.5,
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    icon: 'View'
  },
  {
    title: '产品总数',
    value: '186',
    trend: 8.2,
    color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    icon: 'Box'
  },
  {
    title: 'AI对话量',
    value: '3,456',
    trend: 15.8,
    color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    icon: 'ChatDotRound'
  },
  {
    title: '咨询转化',
    value: '23.5%',
    trend: -2.3,
    color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    icon: 'TrendCharts'
  }
])

const recentData = ref([
  { page: '首页', ip: '192.168.1.100', time: '2025-12-10 14:35', duration: '3分28秒' },
  { page: '产品中心', ip: '192.168.1.101', time: '2025-12-10 14:32', duration: '5分12秒' },
  { page: '应用案例', ip: '192.168.1.102', time: '2025-12-10 14:28', duration: '2分45秒' },
  { page: '联系我们', ip: '192.168.1.103', time: '2025-12-10 14:25', duration: '1分18秒' }
])
</script>

<style scoped>
.dashboard-header {
  margin-bottom: 30px;
}

.dashboard-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.dashboard-header p {
  font-size: 14px;
  color: #666;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  gap: 20px;
  align-items: center;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  width: 70px;
  height: 70px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-title {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 8px;
}

.stat-trend {
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-trend.up {
  color: #52c41a;
}

.stat-trend.down {
  color: #f5222d;
}

.quick-actions,
.recent-activity {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
}

.quick-actions h2,
.recent-activity h2 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.action-card {
  padding: 30px 20px;
  border: 2px solid #e8e8e8;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.action-card:hover {
  border-color: #1890ff;
  background: #f0f7ff;
  transform: translateY(-5px);
}

.action-card .el-icon {
  color: #1890ff;
  margin-bottom: 16px;
}

.action-card h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

.action-card p {
  font-size: 13px;
  color: #999;
}
</style>
