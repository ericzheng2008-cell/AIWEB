<template>
  <div class="controller-events-widget">
    <el-table :data="data" height="100%" size="small" stripe>
      <el-table-column label="时间" width="140">
        <template #default="scope">
          {{ formatTime(scope.row.timestamp) }}
        </template>
      </el-table-column>
      <el-table-column label="级别" width="80" align="center">
        <template #default="scope">
          <el-tag :type="getEventType(scope.row.eventLevel)" size="small">
            {{ scope.row.eventLevel?.toUpperCase() || 'INFO' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="eventType" label="类型" width="100" />
      <el-table-column prop="eventDescription" label="描述" min-width="200" show-overflow-tooltip />
      <el-table-column prop="unitName" label="设备" width="120" />
    </el-table>
  </div>
</template>

<script setup>
defineProps({
  widget: Object,
  data: {
    type: Array,
    default: () => []
  }
})

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN')
}

const getEventType = (level) => {
  switch (level) {
    case 'error':
      return 'danger'
    case 'warning':
      return 'warning'
    default:
      return 'info'
  }
}
</script>

<style scoped lang="scss">
.controller-events-widget {
  height: 100%;
}
</style>
