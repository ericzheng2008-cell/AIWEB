<template>
  <div class="realtime-results-widget">
    <el-table :data="data" height="100%" size="small" stripe>
      <el-table-column label="时间" width="90">
        <template #default="scope">
          {{ formatTime(scope.row.timestamp) }}
        </template>
      </el-table-column>
      <el-table-column prop="programName" label="程序" min-width="120" show-overflow-tooltip />
      <el-table-column label="结果" width="70" align="center">
        <template #default="scope">
          <el-tag :type="scope.row.result === 'OK' ? 'success' : 'danger'" size="small" effect="dark">
            {{ scope.row.result }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="扭矩" width="90" align="center">
        <template #default="scope">
          <span :class="{ 'value-abnormal': scope.row.torqueStatus !== 'OK' }">
            {{ scope.row.torque }} Nm
          </span>
        </template>
      </el-table-column>
      <el-table-column label="角度" width="90" align="center">
        <template #default="scope">
          <span :class="{ 'value-abnormal': scope.row.angleStatus !== 'OK' }">
            {{ scope.row.angle }}°
          </span>
        </template>
      </el-table-column>
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
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
</script>

<style scoped lang="scss">
.realtime-results-widget {
  height: 100%;

  .value-abnormal {
    color: #f43f5e;
    font-weight: 600;
  }
}
</style>
