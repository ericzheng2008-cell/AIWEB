<template>
  <div class="nok-analysis-widget">
    <el-table :data="data" height="100%" stripe>
      <el-table-column type="index" label="排名" width="60" />
      <el-table-column prop="programName" label="程序名称" min-width="150" />
      <el-table-column prop="total" label="总数" width="80" align="center" />
      <el-table-column prop="nok" label="NOK" width="80" align="center" />
      <el-table-column label="NOK率" width="100" align="center">
        <template #default="scope">
          <el-tag 
            :type="scope.row.nokRate < 5 ? 'success' : scope.row.nokRate < 10 ? 'warning' : 'danger'"
            effect="dark"
          >
            {{ scope.row.nokRate }}%
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="趋势" width="80" align="center">
        <template #default="scope">
          <el-icon :size="20" :color="scope.row.nokRate < 5 ? '#10b981' : '#f43f5e'">
            <component :is="scope.row.nokRate < 5 ? 'TrendCharts' : 'Warning'" />
          </el-icon>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { TrendCharts, Warning } from '@element-plus/icons-vue'

defineProps({
  widget: Object,
  data: {
    type: Array,
    default: () => []
  }
})
</script>

<style scoped lang="scss">
.nok-analysis-widget {
  height: 100%;
}
</style>
