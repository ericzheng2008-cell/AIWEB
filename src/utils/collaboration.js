/**
 * 实时协作工具
 * 基于WebSocket实现多用户实时协作功能
 */

import { ref, reactive } from 'vue'
import { ElNotification } from 'element-plus'

class CollaborationService {
  constructor() {
    this.ws = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 3000
    this.heartbeatInterval = null
    this.userId = localStorage.getItem('userId') || this.generateUserId()
    this.userName = localStorage.getItem('userName') || '访客'
    
    // 响应式状态
    this.state = reactive({
      connected: false,
      userPresence: [], // 在线用户列表
      sharedCursor: {}, // 共享光标位置
      liveEditing: {}, // 实时编辑状态
      notifications: [] // 实时通知队列
    })
  }
  
  /**
   * 生成用户ID
   */
  generateUserId() {
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('userId', id)
    return id
  }
  
  /**
   * 连接WebSocket服务器
   */
  connect(url = 'ws://localhost:3000/collaboration') {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      console.log('WebSocket已连接')
      return
    }
    
    try {
      this.ws = new WebSocket(url)
      
      this.ws.onopen = () => {
        console.log('WebSocket连接成功')
        this.state.connected = true
        this.reconnectAttempts = 0
        
        // 发送用户加入消息
        this.send({
          type: 'user_join',
          userId: this.userId,
          userName: this.userName,
          timestamp: Date.now()
        })
        
        // 启动心跳
        this.startHeartbeat()
      }
      
      this.ws.onmessage = (event) => {
        this.handleMessage(JSON.parse(event.data))
      }
      
      this.ws.onerror = (error) => {
        console.error('WebSocket错误:', error)
      }
      
      this.ws.onclose = () => {
        console.log('WebSocket连接关闭')
        this.state.connected = false
        this.stopHeartbeat()
        this.attemptReconnect()
      }
    } catch (error) {
      console.error('WebSocket连接失败:', error)
      this.attemptReconnect()
    }
  }
  
  /**
   * 处理接收到的消息
   */
  handleMessage(message) {
    switch (message.type) {
      case 'user_presence':
        this.state.userPresence = message.users
        break
        
      case 'user_join':
        this.state.userPresence.push(message.user)
        ElNotification({
          title: '用户加入',
          message: `${message.user.userName} 加入了协作`,
          type: 'info',
          duration: 2000
        })
        break
        
      case 'user_leave':
        this.state.userPresence = this.state.userPresence.filter(
          u => u.userId !== message.userId
        )
        ElNotification({
          title: '用户离开',
          message: `${message.userName} 离开了协作`,
          type: 'info',
          duration: 2000
        })
        break
        
      case 'cursor_move':
        this.state.sharedCursor[message.userId] = {
          x: message.x,
          y: message.y,
          userName: message.userName
        }
        break
        
      case 'content_change':
        this.state.liveEditing[message.fieldId] = {
          userId: message.userId,
          userName: message.userName,
          content: message.content,
          timestamp: message.timestamp
        }
        break
        
      case 'notification':
        this.state.notifications.push(message.notification)
        ElNotification({
          title: message.notification.title,
          message: message.notification.message,
          type: message.notification.type || 'info',
          duration: 3000
        })
        break
        
      case 'task_assigned':
        ElNotification({
          title: '新任务',
          message: `您被分配了新任务: ${message.task.title}`,
          type: 'warning',
          duration: 5000
        })
        break
        
      default:
        console.log('未处理的消息类型:', message.type)
    }
  }
  
  /**
   * 发送消息
   */
  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        ...message,
        userId: this.userId,
        userName: this.userName
      }))
    } else {
      console.warn('WebSocket未连接，无法发送消息')
    }
  }
  
  /**
   * 更新光标位置
   */
  updateCursor(x, y) {
    this.send({
      type: 'cursor_move',
      x,
      y,
      timestamp: Date.now()
    })
  }
  
  /**
   * 实时编辑内容
   */
  updateContent(fieldId, content) {
    this.send({
      type: 'content_change',
      fieldId,
      content,
      timestamp: Date.now()
    })
  }
  
  /**
   * 发送通知给其他用户
   */
  sendNotification(notification) {
    this.send({
      type: 'notification',
      notification: {
        ...notification,
        timestamp: Date.now()
      }
    })
  }
  
  /**
   * 分配任务
   */
  assignTask(userId, task) {
    this.send({
      type: 'task_assigned',
      targetUserId: userId,
      task,
      timestamp: Date.now()
    })
  }
  
  /**
   * 创建共享会话
   */
  createSharedSession(sessionData) {
    this.send({
      type: 'create_session',
      sessionData,
      timestamp: Date.now()
    })
  }
  
  /**
   * 加入共享会话
   */
  joinSharedSession(sessionId) {
    this.send({
      type: 'join_session',
      sessionId,
      timestamp: Date.now()
    })
  }
  
  /**
   * 离开共享会话
   */
  leaveSharedSession(sessionId) {
    this.send({
      type: 'leave_session',
      sessionId,
      timestamp: Date.now()
    })
  }
  
  /**
   * 心跳保持连接
   */
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.send({
        type: 'heartbeat',
        timestamp: Date.now()
      })
    }, 30000) // 每30秒发送一次心跳
  }
  
  /**
   * 停止心跳
   */
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  }
  
  /**
   * 尝试重连
   */
  attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      console.log(`尝试重连... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      
      setTimeout(() => {
        this.connect()
      }, this.reconnectDelay)
    } else {
      console.error('WebSocket重连失败，已达到最大尝试次数')
      ElNotification({
        title: '连接失败',
        message: '无法连接到协作服务器，请检查网络连接',
        type: 'error',
        duration: 0
      })
    }
  }
  
  /**
   * 断开连接
   */
  disconnect() {
    if (this.ws) {
      this.send({
        type: 'user_leave',
        timestamp: Date.now()
      })
      this.stopHeartbeat()
      this.ws.close()
      this.ws = null
      this.state.connected = false
    }
  }
  
  /**
   * 获取在线用户列表
   */
  getOnlineUsers() {
    return this.state.userPresence
  }
  
  /**
   * 获取状态
   */
  getState() {
    return this.state
  }
}

// 单例模式
let collaborationService = null

export function useCollaboration() {
  if (!collaborationService) {
    collaborationService = new CollaborationService()
  }
  return collaborationService
}

export default useCollaboration
