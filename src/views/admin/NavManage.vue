<template>
  <div class="nav-manage">
    <el-card>
      <template #header>
        <div class="card-header">
          <h3>{{ t('cms.navigation.title') }}</h3>
          <el-button type="primary" @click="showAddDialog">
            <el-icon><Plus /></el-icon>
            {{ t('cms.navigation.add') }}
          </el-button>
        </div>
      </template>

      <el-alert 
        :title="t('cms.navigation.alertTitle')" 
        type="info" 
        :closable="false"
        style="margin-bottom: 20px;">
        {{ t('cms.navigation.alertText') }}
      </el-alert>

      <!-- 导航项列表（可拖拽排序） -->
      <el-table 
        :data="navItems" 
        row-key="id"
        border
        style="width: 100%">
        
        <el-table-column :label="t('cms.navigation.order')" width="80" align="center">
          <template #default="{ row }">
            <el-icon class="drag-handle" style="cursor: move; font-size: 20px;">
              <Rank />
            </el-icon>
            <span style="margin-left: 8px;">{{ row.order }}</span>
          </template>
        </el-table-column>

        <el-table-column :label="t('cms.navigation.navName')" min-width="200">
          <template #default="{ row }">
            <div>
              <div><strong>{{ t('cms.logo.chineseName') }}：</strong>{{ row.name['zh-CN'] }}</div>
              <div style="color: #909399; font-size: 12px; margin-top: 4px;">
                <strong>{{ t('cms.logo.englishName') }}：</strong>{{ row.name['en-US'] }}
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column :label="t('cms.navigation.path')" prop="path" min-width="150" />

        <el-table-column :label="t('cms.navigation.visible')" width="80" align="center">
          <template #default="{ row }">
            <el-switch 
              v-model="row.visible" 
              @change="updateNavVisibility(row)"
              active-color="#13ce66"
              inactive-color="#ff4949" />
          </template>
        </el-table-column>

        <el-table-column :label="t('cms.navigation.operation')" width="200" align="center">
          <template #default="{ row }">
            <el-button 
              size="small" 
              @click="editNavItem(row)"
              :icon="Edit">
              {{ t('cms.navigation.editBtn') }}
            </el-button>
            <el-button 
              size="small" 
              type="danger" 
              @click="confirmDelete(row)"
              :icon="Delete">
              {{ t('cms.navigation.deleteBtn') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      :title="isEdit ? t('cms.navigation.edit') : t('cms.navigation.add')"
      width="600px">
      
      <el-form :model="currentNav" label-width="100px">
        <el-form-item :label="t('cms.navigation.chineseName')" required>
          <el-input v-model="currentNav.name['zh-CN']" :placeholder="t('cms.navigation.chineseName')" />
        </el-form-item>

        <el-form-item :label="t('cms.navigation.englishName')" required>
          <el-input v-model="currentNav.name['en-US']" :placeholder="t('cms.navigation.englishName')" />
        </el-form-item>

        <el-form-item :label="t('cms.navigation.path')" required>
          <el-input v-model="currentNav.path" :placeholder="t('cms.navigation.pathPlaceholder')" />
          <div style="color: #909399; font-size: 12px; margin-top: 4px;">
            {{ t('cms.navigation.pathHint') }}
          </div>
        </el-form-item>

        <el-form-item :label="t('cms.navigation.order')">
          <el-input-number v-model="currentNav.order" :min="1" :max="99" />
        </el-form-item>

        <el-form-item :label="t('cms.navigation.visible')">
          <el-switch v-model="currentNav.visible" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">{{ t('cms.navigation.cancel') }}</el-button>
        <el-button type="primary" @click="saveNavItem">{{ t('cms.navigation.save') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete, Rank } from '@element-plus/icons-vue'
import { usePageContentStore } from '../../store/pageContent'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const pageStore = usePageContentStore()

const dialogVisible = ref(false)
const isEdit = ref(false)
const currentNav = ref({
  id: '',
  name: { 'zh-CN': '', 'en-US': '' },
  path: '',
  order: 1,
  visible: true
})

const navItems = computed(() => {
  return [...pageStore.navItems].sort((a, b) => a.order - b.order)
})

const showAddDialog = () => {
  isEdit.value = false
  currentNav.value = {
    id: '',
    name: { 'zh-CN': '', 'en-US': '' },
    path: '',
    order: navItems.value.length + 1,
    visible: true
  }
  dialogVisible.value = true
}

const editNavItem = (item) => {
  isEdit.value = true
  currentNav.value = JSON.parse(JSON.stringify(item))
  dialogVisible.value = true
}

const saveNavItem = () => {
  // 验证
  if (!currentNav.value.name['zh-CN']) {
    ElMessage.error(t('cms.message.fillName'))
    return
  }
  if (!currentNav.value.name['en-US']) {
    ElMessage.error(t('cms.message.fillName'))
    return
  }
  if (!currentNav.value.path) {
    ElMessage.error(t('cms.navigation.path'))
    return
  }

  if (isEdit.value) {
    pageStore.updateNavItem(currentNav.value)
    ElMessage.success(t('cms.message.saveSuccess'))
  } else {
    pageStore.addNavItem(currentNav.value)
    ElMessage.success(t('cms.message.saveSuccess'))
  }
  
  dialogVisible.value = false
}

const updateNavVisibility = (item) => {
  pageStore.updateNavItem(item)
  ElMessage.success(t('cms.message.saveSuccess'))
}

const confirmDelete = (item) => {
  ElMessageBox.confirm(
    t('cms.navigation.confirmDelete', { name: item.name['zh-CN'] }),
    t('cms.navigation.alertTitle'),
    {
      confirmButtonText: t('cms.navigation.save'),
      cancelButtonText: t('cms.navigation.cancel'),
      type: 'warning'
    }
  ).then(() => {
    pageStore.deleteNavItem(item.id)
    ElMessage.success(t('cms.message.deleteSuccess'))
  }).catch(() => {
    // 取消删除
  })
}
</script>

<style scoped>
.nav-manage {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
}

.drag-handle {
  cursor: move;
  color: #909399;
}

.drag-handle:hover {
  color: #409eff;
}

:deep(.el-table) {
  font-size: 14px;
}

:deep(.el-table__row) {
  cursor: default;
}
</style>
