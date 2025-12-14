<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="admin-logo">
        <h2>管理后台</h2>
      </div>
      
      <el-menu
        :default-active="route.path"
        router
        class="admin-menu">
        <el-menu-item index="/admin/dashboard">
          <el-icon><Odometer /></el-icon>
          <span>仪表盘</span>
        </el-menu-item>
        
        <el-menu-item index="/admin/cms">
          <el-icon><Setting /></el-icon>
          <span>CMS内容管理</span>
        </el-menu-item>

        <el-menu-item index="/admin/products-services">
          <el-icon><Box /></el-icon>
          <span>产品与服务管理</span>
        </el-menu-item>

        <el-menu-item index="/admin/tightening-data">
          <el-icon><DataAnalysis /></el-icon>
          <span>拧紧数据采集</span>
        </el-menu-item>

        <el-sub-menu index="classroom-menu">
          <template #title>
            <el-icon><Reading /></el-icon>
            <span>产品技术销售小课堂</span>
          </template>
          <el-menu-item index="/admin/classroom">
            <el-icon><Document /></el-icon>
            <span>分类与课程管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/classroom-resources">
            <el-icon><FolderOpened /></el-icon>
            <span>多媒体资源管理</span>
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/admin/production-line">
          <el-icon><Position /></el-icon>
          <span>线体管理</span>
        </el-menu-item>

        <el-menu-item index="/admin/workstation">
          <el-icon><Operation /></el-icon>
          <span>工位管理</span>
        </el-menu-item>

        <el-menu-item index="/admin/ai-agents">
          <el-icon><Star /></el-icon>
          <span>AI智能体管理</span>
        </el-menu-item>

        <el-menu-item index="/admin/tool-database">
          <el-icon><Tools /></el-icon>
          <span>工具数据库</span>
        </el-menu-item>

        <el-menu-item index="/admin/tool-brand-database">
          <el-icon><Collection /></el-icon>
          <span>品牌型号数据库</span>
        </el-menu-item>

        <el-menu-item index="/admin/socket-database">
          <el-icon><Box /></el-icon>
          <span>套筒数据库</span>
        </el-menu-item>

        <el-menu-item index="/admin/equipment">
          <el-icon><Box /></el-icon>
          <span>设备生命周期</span>
        </el-menu-item>

        <el-menu-item index="/admin/workorder">
          <el-icon><Document /></el-icon>
          <span>工单管理</span>
        </el-menu-item>

        <el-menu-item index="/admin/users">
          <el-icon><User /></el-icon>
          <span>用户管理</span>
        </el-menu-item>
      </el-menu>
    </aside>

    <div class="admin-main">
      <header class="admin-header">
        <div class="header-left">
          <el-icon class="menu-icon" @click="toggleSidebar"><Expand /></el-icon>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>管理后台</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentPageTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="header-right">
          <el-button @click="$router.push('/')">
            <el-icon><House /></el-icon>
            返回前台
          </el-button>
          
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" src="https://i.pravatar.cc/150?img=10" />
              <span>{{ userInfo.username }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人设置</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </header>

      <main class="admin-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../../store'
import { ElMessage } from 'element-plus'
import { 
  Odometer, Setting, Tools, Collection, Box, Document, User, 
  Expand, House, Position, Operation, DataAnalysis, Reading, FolderOpened, Star
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo)

const currentPageTitle = computed(() => {
  const titles = {
    '/admin/dashboard': '仪表盘',
    '/admin/cms': 'CMS内容管理',
    '/admin/products-services': '产品与服务管理',
    '/admin/tightening-data': '拧紧数据采集分析',
    '/admin/classroom': '产品技术销售小课堂 - 分类与课程管理',
    '/admin/classroom-resources': '产品技术销售小课堂 - 多媒体资源管理',
    '/admin/production-line': '线体管理',
    '/admin/workstation': '工位管理',
    '/admin/tool-database': '工具数据库',
    '/admin/tool-brand-database': '品牌型号数据库',
    '/admin/socket-database': '套筒数据库',
    '/admin/equipment': '设备生命周期',
    '/admin/workorder': '工单管理',
    '/admin/users': '用户管理'
  }
  return titles[route.path] || '管理后台'
})

const toggleSidebar = () => {
  // Sidebar toggle logic
}

const handleCommand = (command) => {
  if (command === 'logout') {
    userStore.logout()
    ElMessage.success('退出登录成功')
    router.push('/login')
  } else if (command === 'profile') {
    ElMessage.info('个人设置功能开发中')
  }
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  height: 100vh;
}

.admin-sidebar {
  width: 250px;
  background: #001529;
  color: #fff;
  display: flex;
  flex-direction: column;
}

.admin-logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.admin-logo h2 {
  color: #fff;
  font-size: 20px;
}

.admin-menu {
  flex: 1;
  border-right: none;
}

.admin-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.admin-header {
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.menu-icon {
  font-size: 20px;
  cursor: pointer;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.admin-content {
  flex: 1;
  overflow-y: auto;
  background: #f0f2f5;
  padding: 24px;
}
</style>
