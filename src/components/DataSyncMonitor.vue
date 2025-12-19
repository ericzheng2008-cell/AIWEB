<template>
  <div class="data-sync-monitor">
    <h2 class="monitor-title">
      <el-icon><Connection /></el-icon>
      实时数据同步监控
    </h2>

    <!-- 同步指标卡片 -->
    <div class="metrics-grid">
      <el-card class="metric-card">
        <template #header>
          <div class="card-header">
            <el-icon><Finished /></el-icon>
            <span>同步成功率</span>
          </div>
        </template>
        <div class="metric-value success">
          {{ syncMetrics.successRate }}%
        </div>
        <div class="metric-trend">
          <el-tag type="success" size="small">
            {{ syncMetrics.successCount }} / {{ syncMetrics.totalSyncs }}
          </el-tag>
        </div>
      </el-card>

      <el-card class="metric-card">
        <template #header>
          <div class="card-header">
            <el-icon><Timer /></el-icon>
            <span>平均延迟</span>
          </div>
        </template>
        <div class="metric-value">
          {{ Math.round(syncMetrics.averageLatency) }}ms
        </div>
        <div class="metric-trend">
          <el-tag 
            :type="syncMetrics.averageLatency < 100 ? 'success' : syncMetrics.averageLatency < 500 ? 'warning' : 'danger'" 
            size="small">
            {{ syncMetrics.averageLatency < 100 ? '优秀' : syncMetrics.averageLatency < 500 ? '良好' : '需优化' }}
          </el-tag>
        </div>
      </el-card>

      <el-card class="metric-card">
        <template #header>
          <div class="card-header">
            <el-icon><Upload /></el-icon>
            <span>同步总数</span>
          </div>
        </template>
        <div class="metric-value">
          {{ syncMetrics.totalSyncs }}
        </div>
        <div class="metric-trend">
          <el-tag type="info" size="small">
            失败: {{ syncMetrics.failureCount }}
          </el-tag>
        </div>
      </el-card>

      <el-card class="metric-card">
        <template #header>
          <div class="card-header">
            <el-icon><DataLine /></el-icon>
            <span>数据量</span>
          </div>
        </template>
        <div class="metric-value">
          {{ formatDataSize(syncMetrics.dataVolume) }}
        </div>
        <div class="metric-trend">
          <el-tag type="primary" size="small">
            总计
          </el-tag>
        </div>
      </el-card>
    </div>

    <!-- 数据源状态 -->
    <el-card class="sources-card">
      <template #header>
        <div class="card-header-with-actions">
          <div class="card-header">
            <el-icon><Connection /></el-icon>
            <span>数据源状态</span>
          </div>
          <el-button 
            type="primary" 
            size="small" 
            @click="refreshAllSources">
            <el-icon><Refresh /></el-icon>
            刷新全部
          </el-button>
        </div>
      </template>

      <el-table 
        :data="dataSources" 
        style="width: 100%"
        :row-class-name="getRowClassName">
        <el-table-column prop="name" label="数据源" width="150">
          <template #default="{ row }">
            <div class="source-name">
              <el-icon v-if="row.status === 'active'" color="#67c23a"><CircleCheck /></el-icon>
              <el-icon v-else color="#f56c6c"><CircleClose /></el-icon>
              {{ row.name }}
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="type" label="同步方式" width="120">
          <template #default="{ row }">
            <el-tag 
              :type="getSyncTypeTag(row.type)" 
              size="small">
              {{ getSyncTypeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="syncInterval" label="频率" width="100" />

        <el-table-column prop="sla" label="SLA" width="100">
          <template #default="{ row }">
            <el-tag type="info" size="small">{{ row.sla }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="lastSync" label="最后同步" width="180">
          <template #default="{ row }">
            {{ row.lastSync ? formatTime(row.lastSync) : '未同步' }}
          </template>
        </el-table-column>

        <el-table-column prop="syncCount" label="同步次数" width="100" align="center" />

        <el-table-column prop="errorCount" label="错误次数" width="100" align="center">
          <template #default="{ row }">
            <el-tag 
              v-if="row.errorCount > 0" 
              type="danger" 
              size="small">
              {{ row.errorCount }}
            </el-tag>
            <span v-else>0</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button 
              type="primary" 
              size="small" 
              :loading="syncingSource === row.id"
              :disabled="row.type === 'webhook'"
              @click="manualSync(row.id)">
              手动同步
            </el-button>
            <el-button 
              type="info" 
              size="small"
              @click="viewSourceDetails(row)">
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 同步日志 -->
    <el-card class="logs-card">
      <template #header>
        <div class="card-header-with-actions">
          <div class="card-header">
            <el-icon><Document /></el-icon>
            <span>同步日志 (最近50条)</span>
          </div>
          <el-button 
            type="default" 
            size="small" 
            @click="clearLogs">
            <el-icon><Delete /></el-icon>
            清除日志
          </el-button>
        </div>
      </template>

      <el-table 
        :data="recentLogs" 
        style="width: 100%"
        max-height="400">
        <el-table-column prop="timestamp" label="时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.timestamp) }}
          </template>
        </el-table-column>

        <el-table-column prop="sourceName" label="数据源" width="120" />

        <el-table-column prop="type" label="类型" width="100">
          <template #default="{ row }">
            <el-tag size="small">{{ row.type }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag 
              :type="row.status === 'success' ? 'success' : 'danger'" 
              size="small">
              {{ row.status === 'success' ? '成功' : '失败' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="latency" label="延迟" width="100" />
        
        <el-table-column prop="count" label="数据量" width="100" align="center" />

        <el-table-column prop="error" label="错误信息" min-width="200">
          <template #default="{ row }">
            <span v-if="row.error" class="error-message">{{ row.error }}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 数据源详情对话框 -->
    <el-dialog 
      v-model="detailsDialogVisible" 
      title="数据源详情" 
      width="600px">
      <div v-if="selectedSource" class="source-details">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="数据源名称">
            {{ selectedSource.name }}
          </el-descriptions-item>
          <el-descriptions-item label="数据源ID">
            {{ selectedSource.id }}
          </el-descriptions-item>
          <el-descriptions-item label="同步方式">
            {{ getSyncTypeLabel(selectedSource.type) }}
          </el-descriptions-item>
          <el-descriptions-item label="同步频率">
            {{ selectedSource.syncInterval }}
          </el-descriptions-item>
          <el-descriptions-item label="SLA要求">
            {{ selectedSource.sla }}
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="selectedSource.status === 'active' ? 'success' : 'danger'">
              {{ selectedSource.status === 'active' ? '活跃' : '停用' }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="最后同步">
            {{ selectedSource.lastSync ? formatTime(selectedSource.lastSync) : '未同步' }}
          </el-descriptions-item>
          <el-descriptions-item label="同步次数">
            {{ selectedSource.syncCount }}
          </el-descriptions-item>
          <el-descriptions-item label="错误次数">
            <el-tag type="danger" v-if="selectedSource.errorCount > 0">
              {{ selectedSource.errorCount }}
            </el-tag>
            <span v-else>0</span>
          </el-descriptions-item>
          <el-descriptions-item label="接入端点" :span="2">
            {{ selectedSource.endpoint || selectedSource.apiUrl || '系统内部' }}
          </el-descriptions-item>
        </el-descriptions>
      </div>

      <template #footer>
        <el-button @click="detailsDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { 
  Connection, 
  Finished, 
  Timer, 
  Upload, 
  DataLine, 
  Refresh,
  CircleCheck,
  CircleClose,
  Document,
  Delete
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useDataSync } from '@/utils/dataSyncEngine'

const {
  dataSources,
  syncMetrics,
  recentLogs,
  dataSyncService
} = useDataSync()

const syncingSource = ref(null)
const detailsDialogVisible = ref(false)
const selectedSource = ref(null)
let autoRefreshTimer = null

/**
 * 组件挂载
 */
onMounted(() => {
  console.log('[DataSyncMonitor] Component mounted')
  
  // 启动自动同步
  dataSyncService.startAutoSync()
  
  // 每10秒刷新指标
  autoRefreshTimer = setInterval(() => {
    console.log('[DataSyncMonitor] Auto refresh metrics')
  }, 10000)
})

/**
 * 组件卸载
 */
onUnmounted(() => {
  if (autoRefreshTimer) {
    clearInterval(autoRefreshTimer)
  }
})

/**
 * 手动同步
 */
const manualSync = async (sourceId) => {
  syncingSource.value = sourceId
  
  try {
    const result = await dataSyncService.manualSync(sourceId)
    
    ElMessage.success({
      message: `同步成功! 处理 ${result.count} 条数据,延迟 ${result.latency}ms`,
      duration: 3000
    })
  } catch (error) {
    ElMessage.error({
      message: `同步失败: ${error.message}`,
      duration: 5000
    })
  } finally {
    syncingSource.value = null
  }
}

/**
 * 刷新全部数据源
 */
const refreshAllSources = async () => {
  ElMessage.info('正在刷新所有数据源...')
  
  const promises = dataSources.value
    .filter(s => s.type !== 'webhook')
    .map(s => dataSyncService.manualSync(s.id).catch(e => ({ error: e })))
  
  const results = await Promise.all(promises)
  
  const successCount = results.filter(r => !r.error).length
  const failureCount = results.length - successCount
  
  ElMessage.success({
    message: `刷新完成! 成功: ${successCount}, 失败: ${failureCount}`,
    duration: 3000
  })
}

/**
 * 查看数据源详情
 */
const viewSourceDetails = (source) => {
  selectedSource.value = source
  detailsDialogVisible.value = true
}

/**
 * 清除日志
 */
const clearLogs = () => {
  recentLogs.value.length = 0
  ElMessage.success('日志已清除')
}

/**
 * 获取同步类型标签
 */
const getSyncTypeTag = (type) => {
  const tags = {
    'webhook': 'success',
    'api': 'primary',
    'incremental': 'info',
    'imap': 'warning'
  }
  return tags[type] || 'info'
}

/**
 * 获取同步类型标签文本
 */
const getSyncTypeLabel = (type) => {
  const labels = {
    'webhook': 'Webhook',
    'api': 'API轮询',
    'incremental': 'CDC增量',
    'imap': 'IMAP'
  }
  return labels[type] || type
}

/**
 * 表格行类名
 */
const getRowClassName = ({ row }) => {
  if (row.errorCount > 0) {
    return 'row-error'
  }
  if (row.status !== 'active') {
    return 'row-inactive'
  }
  return ''
}

/**
 * 格式化时间
 */
const formatTime = (date) => {
  if (!date) return ''
  
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/**
 * 格式化数据大小
 */
const formatDataSize = (bytes) => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
</script>

<style scoped lang="scss">
.data-sync-monitor {
  padding: 20px;

  .monitor-title {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 20px;

    @media (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }

  .metric-card {
    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }

    .metric-value {
      font-size: 32px;
      font-weight: 600;
      margin: 10px 0;
      
      &.success {
        color: #67c23a;
      }
    }

    .metric-trend {
      font-size: 14px;
      color: #909399;
    }
  }

  .sources-card,
  .logs-card {
    margin-bottom: 20px;

    .card-header-with-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }
  }

  .source-name {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .error-message {
    color: #f56c6c;
    font-size: 12px;
  }

  :deep(.row-error) {
    background-color: #fef0f0;
  }

  :deep(.row-inactive) {
    background-color: #f5f5f5;
    opacity: 0.7;
  }

  .source-details {
    .el-descriptions {
      margin-top: 20px;
    }
  }
}
</style>
