<template>
  <div class="user-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>用户管理</h3>
          <el-button type="primary" @click="addUser">
            <el-icon><Plus /></el-icon>
            添加用户
          </el-button>
        </div>
      </template>

      <div class="toolbar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索用户..."
          style="width: 300px;"
          clearable>
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <el-table :data="filteredUsers" stripe>
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'info'">
              {{ row.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" width="180" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-switch v-model="row.active" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button size="small" @click="editUser(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteUser(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const searchQuery = ref('')

const users = ref([
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    phone: '13800138000',
    role: 'admin',
    createdAt: '2024-01-01 10:00',
    active: true
  },
  {
    id: 2,
    username: 'user1',
    email: 'user1@example.com',
    phone: '13800138001',
    role: 'user',
    createdAt: '2024-01-15 14:30',
    active: true
  }
])

const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value
  return users.value.filter(u => 
    u.username.includes(searchQuery.value) ||
    u.email.includes(searchQuery.value)
  )
})

const addUser = () => {
  ElMessage.info('添加用户功能开发中...')
}

const editUser = (user) => {
  ElMessage.info(`编辑用户: ${user.username}`)
}

const deleteUser = (id) => {
  ElMessage.success('用户已删除')
}
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar {
  margin-bottom: 20px;
}
</style>
