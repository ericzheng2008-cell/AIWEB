<template>
  <div class="products-services-menu">
    <div 
      class="menu-trigger" 
      @click="openSidebar"
      :class="{ active: isMenuOpen }"
    >
      <span>{{ t('productsServices.title') }}</span>
    </div>


  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const isMenuOpen = ref(false)

const emit = defineEmits(['open-sidebar'])

const openSidebar = () => {
  emit('open-sidebar')
}
</script>

<style scoped>
.products-services-menu {
  position: relative;
}

.menu-trigger {
  color: #333;
  font-size: 15px;
  font-weight: 500;
  transition: color 0.3s;
  position: relative;
  padding: 8px 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.menu-trigger:hover,
.menu-trigger.active {
  color: #1890ff;
}
</style>
