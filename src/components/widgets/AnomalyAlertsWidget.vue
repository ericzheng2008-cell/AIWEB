<template>
  <div class="anomaly-alerts-widget">
    <div v-if="data && data.length > 0" class="alerts-list">
      <el-scrollbar height="100%">
        <div 
          v-for="(alert, index) in data.slice(0, 20)" 
          :key="index" 
          class="alert-item"
          :class="`alert-${alert.level}`"
        >
          <div class="alert-icon">
            <el-icon :size="24">
              <component :is="getAlertIcon(alert.level)" />
            </el-icon>
          </div>
          <div class="alert-content">
            <div class="alert-message">{{ alert.message }}</div>
            <div class="alert-meta">
              <span>{{ alert.programName || 'Unknown' }}</span>
              <span>{{ formatTime(alert.timestamp) }}</span>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <el-empty v-else description="暂无异常报警" :image-size="100" />
  </div>
</template>

<script setup>
import { Warning, InfoFilled, CircleClose } from '@element-plus/icons-vue'

defineProps({
  widget: Object,
  data: {
    type: Array,
    default: () => []
  }
})

const getAlertIcon = (level) => {
  switch (level) {
    case 'critical':
      return CircleClose
    case 'error':
      return CircleClose
    case 'warning':
      return Warning
    default:
      return InfoFilled
  }
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', { 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}
</script>

<style scoped lang="scss">
.anomaly-alerts-widget {
  height: 100%;

  .alerts-list {
    height: 100%;
  }

  .alert-item {
    display: flex;
    gap: 12px;
    padding: 12px;
    margin-bottom: 8px;
    border-radius: 6px;
    border-left: 4px solid;
    background: #f9fafb;
    transition: all 0.2s ease;

    &:hover {
      transform: translateX(4px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    &.alert-critical {
      border-left-color: #dc2626;
      background: #fef2f2;

      .alert-icon {
        color: #dc2626;
      }
    }

    &.alert-error {
      border-left-color: #f43f5e;
      background: #fff1f2;

      .alert-icon {
        color: #f43f5e;
      }
    }

    &.alert-warning {
      border-left-color: #f59e0b;
      background: #fffbeb;

      .alert-icon {
        color: #f59e0b;
      }
    }

    .alert-content {
      flex: 1;

      .alert-message {
        font-size: 13px;
        color: #1a1a1a;
        margin-bottom: 4px;
      }

      .alert-meta {
        display: flex;
        justify-content: space-between;
        font-size: 11px;
        color: #666;
      }
    }
  }
}
</style>
