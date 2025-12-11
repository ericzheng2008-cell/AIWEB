<template>
  <div class="products-services-sidebar" :class="{ collapsed: isCollapsed }">
    <div class="sidebar-header" @click="toggleSidebar">
      <div class="header-title">
        <el-icon :size="20"><Grid /></el-icon>
        <span v-if="!isCollapsed">{{ locale === 'zh-CN' ? '产品与服务' : 'Products & Services' }}</span>
      </div>
      <el-icon :size="16" class="toggle-icon" v-if="!isCollapsed">
        <DArrowLeft />
      </el-icon>
    </div>

    <div class="sidebar-content" v-if="!isCollapsed">
      <el-menu
        :default-openeds="['1']"
        @select="handleMenuSelect"
        class="product-menu"
      >
        <el-sub-menu 
          v-for="category in categories" 
          :key="category.id" 
          :index="category.id"
        >
          <template #title>
            <span class="category-icon">{{ category.icon }}</span>
            <span class="category-name">{{ locale === 'zh-CN' ? category.name_zh : category.name_en }}</span>
          </template>
          <el-menu-item 
            v-for="(item, index) in category.items" 
            :key="`${category.id}-${index}`"
            :index="`${category.id}-${index}`"
            @click="selectProduct(category.id, index, item)"
          >
            {{ locale === 'zh-CN' ? item.zh : item.en }}
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { locale } = useI18n()
const router = useRouter()
const isCollapsed = ref(false)

const categories = [
  {
    id: '1',
    icon: '🤖',
    name_zh: '自动化设备',
    name_en: 'Automation Equipment',
    items: [
      { zh: 'SCA自动涂胶机及配件', en: 'SCA Automatic Gluing Machine & Accessories', id: 1 },
      { zh: '苏上自动涂胶机配件', en: 'Sushang Gluing Machine Accessories', id: 2 },
      { zh: 'SPR FDS整机及配件', en: 'SPR FDS Complete Machine & Parts', id: 3 },
      { zh: '小原焊机', en: 'Obara Welding Machine', id: 4 },
      { zh: 'Gudel固德七轴机器人桁架', en: 'Gudel 7-Axis Robot Gantry', id: 5 },
      { zh: '汇川PLC及伺服', en: 'Inovance PLC & Servo', id: 6 },
      { zh: 'Staubli史陶比尔机器人换刀盘', en: 'Staubli Robot Tool Changer', id: 7 },
      { zh: '德克斯抓具夹具', en: 'Dextrous Grippers & Fixtures', id: 8 },
      { zh: '图尔克传感器', en: 'Turck Sensors', id: 9 },
      { zh: 'Festo费斯托气路元件阀岛', en: 'Festo Pneumatic Components & Valve Islands', id: 10 }
    ]
  },
  {
    id: '2',
    icon: '🔧',
    name_zh: '工业工具和装配解决方案',
    name_en: 'Industrial Tools & Assembly Solutions',
    items: [
      { zh: 'Bosch博世电池工具', en: 'Bosch Battery Tools', id: 11 },
      { zh: 'Dynabrade丹纳布雷气动打磨工具', en: 'Dynabrade Pneumatic Grinding Tools', id: 12 },
      { zh: 'Beta手动工具', en: 'Beta Hand Tools', id: 13 },
      { zh: 'Kito电动葫芦吊具', en: 'Kito Electric Hoist & Lifting Equipment', id: 14 },
      { zh: 'Aidietech八角管', en: 'Aidietech Octagonal Tube', id: 15 },
      { zh: 'EQTCF铝合金轨道', en: 'EQTCF Aluminum Alloy Track', id: 16 }
    ]
  },
  {
    id: '3',
    icon: '⚙️',
    name_zh: '工业配套配件',
    name_en: 'Industrial Supporting Parts',
    items: [
      { zh: '电梯配件', en: 'Elevator Parts', id: 17 }
    ]
  },
  {
    id: '4',
    icon: '🌱',
    name_zh: '节能环保方案',
    name_en: 'Energy-saving & Environmental Solutions',
    items: [
      { zh: '循环冷却水防垢', en: 'Circulating Cooling Water Anti-scaling', id: 18 },
      { zh: '空调降温节能', en: 'Air Conditioning Cooling & Energy Saving', id: 19 }
    ]
  },
  {
    id: '5',
    icon: '🛠️',
    name_zh: '服务方案',
    name_en: 'Service Solutions',
    items: [
      { zh: '利旧改造', en: 'Retrofit & Renovation', id: 20 },
      { zh: '原厂翻新', en: 'Original Factory Refurbishment', id: 21 },
      { zh: '老旧替换', en: 'Old Equipment Replacement', id: 22 },
      { zh: '全包服务', en: 'Full-service Package', id: 23 },
      { zh: '国产化', en: 'Localization', id: 24 }
    ]
  }
]

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const handleMenuSelect = (index) => {
  // Menu selection logic
}

const selectProduct = (categoryId, itemIndex, item) => {
  if (item.id) {
    router.push({ path: `/product/${item.id}`, query: { category: categoryId } })
  }
}
</script>

<style scoped>
.products-services-sidebar {
  position: fixed;
  left: 0;
  top: 120px;
  width: 300px;
  height: calc(100vh - 120px);
  background: #fff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 999;
  display: flex;
  flex-direction: column;
}

.products-services-sidebar.collapsed {
  width: 60px;
}

.sidebar-header {
  padding: 20px;
  background: linear-gradient(135deg, #1890ff 0%, #0066cc 100%);
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 16px;
  font-weight: 600;
}

.toggle-icon {
  transition: transform 0.3s;
}

.collapsed .toggle-icon {
  transform: rotate(180deg);
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 10px 0;
}

.product-menu {
  border: none;
}

.category-icon {
  font-size: 18px;
  margin-right: 8px;
}

.category-name {
  font-size: 14px;
  font-weight: 500;
}

:deep(.el-sub-menu__title) {
  padding: 12px 20px !important;
  height: auto !important;
  line-height: 1.5 !important;
}

:deep(.el-menu-item) {
  padding: 10px 20px 10px 56px !important;
  height: auto !important;
  line-height: 1.5 !important;
  font-size: 13px;
  color: #666;
  transition: all 0.3s;
}

:deep(.el-menu-item:hover) {
  background: #e6f7ff !important;
  color: #1890ff;
}

:deep(.el-menu-item.is-active) {
  background: #e6f7ff !important;
  color: #1890ff;
  font-weight: 500;
}

/* 滚动条样式 */
.sidebar-content::-webkit-scrollbar {
  width: 6px;
}

.sidebar-content::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.sidebar-content::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}

.sidebar-content::-webkit-scrollbar-thumb:hover {
  background: #999;
}
</style>
