<template>
  <div class="collaboration-panel">
    <!-- 在线用户列表 -->
    <el-card class="online-users-card">
      <template #header>
        <div class="card-header">
          <span>👥 在线协作 ({{ onlineUsers.length }})</span>
          <el-badge 
            :value="connected ? '已连接' : '未连接'" 
            :type="connected ? 'success' : 'danger'"
          />
        </div>
      </template>
      
      <div class="users-list">
        <div 
          v-for="user in onlineUsers" 
          :key="user.userId"
          class="user-item"
        >
          <el-avatar :size="32">{{ user.userName.charAt(0) }}</el-avatar>
          <div class="user-info">
            <div class="user-name">{{ user.userName }}</div>
            <div class="user-status">
              <el-tag size="small" type="success">在线</el-tag>
            </div>
          </div>
          <el-button 
            size="small" 
            text 
            @click="assignTaskToUser(user)"
          >
            <el-icon><Message /></el-icon>
          </el-button>
        </div>
        
        <el-empty 
          v-if="onlineUsers.length === 0" 
          description="暂无其他用户在线"
          :image-size="80"
        />
      </div>
    </el-card>

    <!-- 共享会话 -->
    <el-card class="shared-session-card" style="margin-top: 16px;">
      <template #header>
        <div class="card-header">
          <span>🔗 共享会话</span>
          <el-button size="small" type="primary" @click="createSession">
            <el-icon><Plus /></el-icon>
            创建会话
          </el-button>
        </div>
      </template>
      
      <el-form v-if="currentSession" label-width="80px">
        <el-form-item label="会话ID">
          <el-input :value="currentSession.id" readonly>
            <template #append>
              <el-button @click="copySessionId">复制</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="参与者">
          <el-tag 
            v-for="participant in currentSession.participants" 
            :key="participant.userId"
            style="margin-right: 8px;"
          >
            {{ participant.userName }}
          </el-tag>
        </el-form-item>
        <el-form-item label="会话状态">
          <el-tag :type="currentSession.state === 'active' ? 'success' : 'info'">
            {{ currentSession.state === 'active' ? '进行中' : '已结束' }}
          </el-tag>
        </el-form-item>
      </el-form>
      
      <el-button 
        v-else 
        type="primary" 
        plain 
        block
        @click="joinSessionDialog = true"
      >
        <el-icon><Connection /></el-icon>
        加入会话
      </el-button>
    </el-card>

    <!-- 实时通知 -->
    <el-card class="notifications-card" style="margin-top: 16px;">
      <template #header>
        <div class="card-header">
          <span>🔔 实时通知</span>
          <el-badge :value="notifications.length" :max="99" />
        </div>
      </template>
      
      <div class="notifications-list">
        <el-timeline>
          <el-timeline-item
            v-for="notification in notifications.slice(0, 5)"
            :key="notification.id"
            :timestamp="formatTime(notification.timestamp)"
            :type="getNotificationType(notification.type)"
          >
            <h4>{{ notification.title }}</h4>
            <p>{{ notification.message }}</p>
          </el-timeline-item>
        </el-timeline>
        
        <el-empty 
          v-if="notifications.length === 0" 
          description="暂无通知"
          :image-size="80"
        />
      </div>
    </el-card>

    <!-- 加入会话对话框 -->
    <el-dialog v-model="joinSessionDialog" title="加入共享会话" width="400px">
      <el-form :model="joinForm" label-width="80px">
        <el-form-item label="会话ID">
          <el-input v-model="joinForm.sessionId" placeholder="请输入会话ID" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="joinSessionDialog = false">取消</el-button>
        <el-button type="primary" @click="joinSession">加入</el-button>
      </template>
    </el-dialog>

    <!-- 任务分配对话框 -->
    <el-dialog v-model="assignTaskDialog" title="分配任务" width="500px">
      <el-form :model="taskForm" label-width="80px">
        <el-form-item label="分配给">
          <el-tag>{{ selectedUser?.userName }}</el-tag>
        </el-form-item>
        <el-form-item label="任务标题">
          <el-input v-model="taskForm.title" placeholder="请输入任务标题" />
        </el-form-item>
        <el-form-item label="任务描述">
          <el-input 
            v-model="taskForm.description" 
            type="textarea" 
            :rows="4"
            placeholder="请输入任务描述"
          />
        </el-form-item>
        <el-form-item label="优先级">
          <el-radio-group v-model="taskForm.priority">
            <el-radio label="high">高</el-radio>
            <el-radio label="medium">中</el-radio>
            <el-radio label="low">低</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assignTaskDialog = false">取消</el-button>
        <el-button type="primary" @click="submitTask">分配任务</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useCollaboration } from '@/utils/collaboration'
import { Message, Plus, Connection } from '@element-plus/icons-vue'

// 协作服务
const collaboration = useCollaboration()
const collaborationState = collaboration.getState()

// 响应式数据
const joinSessionDialog = ref(false)
const assignTaskDialog = ref(false)
const selectedUser = ref(null)
const currentSession = ref(null)

const joinForm = ref({
  sessionId: ''
})

const taskForm = ref({
  title: '',
  description: '',
  priority: 'medium'
})

// 计算属性
const connected = computed(() => collaborationState.connected)
const onlineUsers = computed(() => collaborationState.userPresence)
const notifications = computed(() => collaborationState.notifications)

// 方法
const createSession = () => {
  const sessionId = `session_${Date.now()}`
  currentSession.value = {
    id: sessionId,
    participants: [
      { userId: collaboration.userId, userName: collaboration.userName }
    ],
    state: 'active',
    createdAt: Date.now()
  }
  
  collaboration.createSharedSession(currentSession.value)
  ElMessage.success('共享会话已创建')
}

const joinSession = () => {
  if (!joinForm.value.sessionId) {
    ElMessage.warning('请输入会话ID')
    return
  }
  
  collaboration.joinSharedSession(joinForm.value.sessionId)
  joinSessionDialog.value = false
  ElMessage.success('已加入会话')
}

const copySessionId = () => {
  if (currentSession.value) {
    navigator.clipboard.writeText(currentSession.value.id)
    ElMessage.success('会话ID已复制到剪贴板')
  }
}

const assignTaskToUser = (user) => {
  selectedUser.value = user
  assignTaskDialog.value = true
}

const submitTask = () => {
  if (!taskForm.value.title) {
    ElMessage.warning('请输入任务标题')
    return
  }
  
  const task = {
    ...taskForm.value,
    id: `task_${Date.now()}`,
    assignedTo: selectedUser.value.userId,
    assignedBy: collaboration.userId,
    createdAt: Date.now()
  }
  
  collaboration.assignTask(selectedUser.value.userId, task)
  
  assignTaskDialog.value = false
  taskForm.value = {
    title: '',
    description: '',
    priority: 'medium'
  }
  
  ElMessage.success(`任务已分配给 ${selectedUser.value.userName}`)
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN')
}

const getNotificationType = (type) => {
  const typeMap = {
    success: 'success',
    warning: 'warning',
    error: 'danger',
    info: 'primary'
  }
  return typeMap[type] || 'primary'
}

// 生命周期
onMounted(() => {
  collaboration.connect()
})

onUnmounted(() => {
  if (currentSession.value) {
    collaboration.leaveSharedSession(currentSession.value.id)
  }
})
</script>

<style scoped lang="scss">
.collaboration-panel {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .users-list {
    max-height: 300px;
    overflow-y: auto;

    .user-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      border-bottom: 1px solid #f0f0f0;
      transition: background 0.2s;

      &:hover {
        background: #f5f7fa;
      }

      .user-info {
        flex: 1;

        .user-name {
          font-weight: 600;
          color: #303133;
          margin-bottom: 4px;
        }

        .user-status {
          font-size: 12px;
        }
      }
    }
  }

  .notifications-list {
    max-height: 400px;
    overflow-y: auto;

    h4 {
      margin: 0 0 4px 0;
      font-size: 14px;
      color: #303133;
    }

    p {
      margin: 0;
      font-size: 13px;
      color: #606266;
    }
  }
}
</style>
