<template>
  <div class="trace-analysis-widget">
    <el-empty description="曲线追溯分析（开发中）" :image-size="100" />
  </div>
</template>

<script setup>
defineProps({
  widget: Object,
  data: Object
})
</script>

<style scoped lang="scss">
.trace-analysis-widget {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
