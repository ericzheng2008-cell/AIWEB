<template>
  <div id="app">
    <ProductsServicesSidebar v-if="showSidebar" />
    <div class="main-wrapper" :class="{ 'with-sidebar': showSidebar }">
      <router-view @open-sidebar="showSidebar = true" />
    </div>
    <AiChat />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import AiChat from './components/AiChat.vue'
import ProductsServicesSidebar from './components/ProductsServicesSidebar.vue'

const route = useRoute()
const showSidebar = ref(false)

// 监听路由变化，在特定页面隐藏侧边栏
watch(() => route.path, () => {
  if (route.path === '/' || route.path === '/about' || route.path === '/contact') {
    showSidebar.value = false
  }
})
</script>

<style>
#app {
  width: 100%;
  min-height: 100vh;
}

.main-wrapper {
  transition: margin-left 0.3s;
}

.main-wrapper.with-sidebar {
  margin-left: 300px;
}
</style>
