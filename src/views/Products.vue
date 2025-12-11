<template>
  <div class="products-page">
    <Header />
    
    <div class="page-container">
      <aside class="sidebar">
        <div class="filter-section">
          <h3>事业部分类</h3>
          <el-menu :default-active="activeCategory" @select="handleCategoryChange">
            <el-menu-item v-for="cat in categories" :key="cat.id" :index="cat.id.toString()">
              <div class="menu-item-content">
                <span class="cat-name">{{ cat.name }}</span>
                <span v-if="cat.en" class="cat-en">{{ cat.en }}</span>
              </div>
            </el-menu-item>
          </el-menu>
        </div>

        <div class="filter-section">
          <h3>品牌</h3>
          <el-checkbox-group v-model="selectedBrands">
            <el-checkbox v-for="brand in brands" :key="brand" :label="brand">
              {{ brand }}
            </el-checkbox>
          </el-checkbox-group>
        </div>

        <el-button type="primary" @click="applyFilters" class="apply-btn">应用筛选</el-button>
      </aside>

      <main class="main-content">
        <div class="toolbar">
          <div class="result-info">
            共找到 <span class="highlight">{{ filteredProducts.length }}</span> 款产品
          </div>
          <el-select v-model="sortBy" placeholder="排序方式" @change="handleSort">
            <el-option label="默认排序" value="default" />
            <el-option label="价格从低到高" value="price-asc" />
            <el-option label="价格从高到低" value="price-desc" />
            <el-option label="最新上架" value="newest" />
          </el-select>
        </div>

        <div class="products-grid">
          <div v-for="product in displayProducts" 
               :key="product.id" 
               class="product-card"
               @click="goToDetail(product.id)">
            <div class="product-image">
              <img :src="product.image" :alt="product.name" />
              <div class="product-badge" v-if="product.badge">{{ product.badge }}</div>
            </div>
            <div class="product-info">
              <h3>{{ product.name }}</h3>
              <p class="product-desc">{{ product.description }}</p>
              <el-button type="primary" class="view-btn">查看详情</el-button>
            </div>
          </div>
        </div>

        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="pageSize"
            :total="filteredProducts.length"
            layout="prev, pager, next, jumper"
            @current-change="handlePageChange"
          />
        </div>
      </main>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

const router = useRouter()
const route = useRoute()

const activeCategory = ref('0')
const selectedBrands = ref([])
const sortBy = ref('default')
const currentPage = ref(1)
const pageSize = ref(12)

const categories = ref([
  { id: 0, name: '全部产品' },
  { id: 1, name: '工业智能装配事业部', en: 'Industrial Intelligent Assembly' },
  { id: 2, name: '工业智能智造事业部', en: 'Industrial Intelligent Production' },
  { id: 3, name: '工业配套事业部', en: 'Industry OEM Division' },
  { id: 4, name: '动力装配事业部', en: 'Power Assembly Division' },
  { id: 5, name: '汽车部件事业部', en: 'Automobile Parts Division' },
  { id: 6, name: '明升科技事业部', en: 'Mingsheng Technology' },
  { id: 7, name: '刀具油品事业部', en: 'Oils and Cutting Tools' },
  { id: 8, name: '网营事业部', en: 'Network Marketing' }
])

const brands = ref([
  'SCA', 'Bosch博世', 'Dynabra丹纳布雷', 'Beta', 
  'Gudel固都', 'Staubli史陶比尔', 'Festo费斯托', 
  '图尔克', 'Kito', 'Aigeotech', '汇川'
])

const allProducts = ref([
  {
    id: 1,
    name: 'SCA自动涂胶机',
    description: '高精度自动涂胶系统，适用于汽车制造生产线',
    price: 158000,
    rating: 4.8,
    category: 1,
    brand: 'SCA',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400',
    badge: '热销'
  },
  {
    id: 2,
    name: 'Bosch博世电池工具套装',
    description: '专业级电池动力工具，高效可靠的装配解决方案',
    price: 8500,
    rating: 4.9,
    category: 1,
    brand: 'Bosch博世',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400',
    badge: '新品'
  },
  {
    id: 3,
    name: 'Dynabra丹纳布雷气动打磨工具',
    description: '高性能气动打磨系统，适用于精密表面处理',
    price: 12000,
    rating: 4.7,
    category: 1,
    brand: 'Dynabra丹纳布雷',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400'
  },
  {
    id: 4,
    name: 'Gudel固都七轴机器人桁架',
    description: '高精度七轴机器人系统，柔性自动化解决方案',
    price: 450000,
    rating: 4.9,
    category: 1,
    brand: 'Gudel固都',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
    badge: '推荐'
  },
  {
    id: 5,
    name: 'Staubli史陶比尔机器人换刀盘',
    description: '快速换刀系统，提升机器人作业效率',
    price: 35000,
    rating: 4.8,
    category: 1,
    brand: 'Staubli史陶比尔',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400'
  },
  {
    id: 6,
    name: 'Festo费斯托气路元件阀岛',
    description: '高性能气动控制系统，稳定可靠',
    price: 18000,
    rating: 4.7,
    category: 1,
    brand: 'Festo费斯托',
    image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400'
  },
  {
    id: 7,
    name: 'AGV智能搬运车',
    description: '自动导引运输车，智能物流解决方案',
    price: 120000,
    rating: 4.8,
    category: 2,
    brand: '汇川',
    image: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400',
    badge: '热销'
  },
  {
    id: 8,
    name: '协作机器人拧紧工作站',
    description: '智能拧紧装配系统，人机协作安全高效',
    price: 280000,
    rating: 4.9,
    category: 2,
    brand: '汇川',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400'
  },
  {
    id: 9,
    name: 'AI视觉检测系统',
    description: '车身漆面焊点焊缝智能检测，高精度识别',
    price: 95000,
    rating: 4.8,
    category: 2,
    brand: '明升科技',
    image: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400',
    badge: '新品'
  },
  {
    id: 10,
    name: 'NC多轴柔性工装',
    description: '定制化柔性夹具系统，适配多种车型',
    price: 68000,
    rating: 4.7,
    category: 2,
    brand: '明升科技',
    image: 'https://images.unsplash.com/photo-1581092583537-20d51876f1e9?w=400'
  },
  {
    id: 11,
    name: 'Kito电动葫芦吊具',
    description: '高载重电动葫芦系统，安全可靠',
    price: 15000,
    rating: 4.6,
    category: 1,
    brand: 'Kito',
    image: 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=400'
  },
  {
    id: 12,
    name: '电池油压脉冲定扭扳手 ETBP30-42',
    description: '高精度电池定扭扳手，适用于关键装配',
    price: 25000,
    rating: 4.8,
    category: 4,
    brand: 'Bosch博世',
    image: 'https://images.unsplash.com/photo-1581093588401-fbb62a02f120?w=400'
  },
  {
    id: 13,
    name: 'MES系统拧紧管理软件',
    description: '智能制造执行系统，拧紧数据采集与追溯',
    price: 120000,
    rating: 4.9,
    category: 4,
    brand: '明升科技',
    image: 'https://images.unsplash.com/photo-1581094651181-35942459ef62?w=400',
    badge: '推荐'
  },
  {
    id: 14,
    name: '润滑油脂系列',
    description: '工业级润滑油脂，延长设备使用寿命',
    price: 350,
    rating: 4.5,
    category: 7,
    brand: '壳牌',
    image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400'
  },
  {
    id: 15,
    name: '机加工刀具套装',
    description: '高性能切削刀具，精密加工必备',
    price: 4500,
    rating: 4.7,
    category: 7,
    brand: '肯纳',
    image: 'https://images.unsplash.com/photo-1581095724857-e68274a6d7ac?w=400'
  },
  {
    id: 16,
    name: '图尔克传感器',
    description: '工业自动化传感器，高灵敏度检测',
    price: 2800,
    rating: 4.7,
    category: 1,
    brand: '图尔克',
    image: 'https://images.unsplash.com/photo-1581096723107-0c516d1ce38b?w=400'
  },
  {
    id: 17,
    name: 'Beta手动工具套装',
    description: '意大利品质手动工具，专业维修必备',
    price: 3200,
    rating: 4.6,
    category: 1,
    brand: 'Beta',
    image: 'https://images.unsplash.com/photo-1581097360575-1f5553e30e2d?w=400'
  },
  {
    id: 18,
    name: '立体库存储系统',
    description: '智能立体仓储解决方案，空间利用率提升300%',
    price: 680000,
    rating: 4.9,
    category: 2,
    brand: '汇川',
    image: 'https://images.unsplash.com/photo-1581098365948-6b5c0ad9d870?w=400',
    badge: '热销'
  }
])

const filteredProducts = computed(() => {
  let products = [...allProducts.value]

  // 分类筛选
  if (activeCategory.value !== '0') {
    products = products.filter(p => p.category === parseInt(activeCategory.value))
  }

  // 品牌筛选
  if (selectedBrands.value.length > 0) {
    products = products.filter(p => selectedBrands.value.includes(p.brand))
  }

  // 排序
  if (sortBy.value === 'newest') {
    products.sort((a, b) => b.id - a.id)
  }

  return products
})

const displayProducts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredProducts.value.slice(start, end)
})

const handleCategoryChange = (index) => {
  activeCategory.value = index
}

const applyFilters = () => {
  currentPage.value = 1
}

const handleSort = () => {
  currentPage.value = 1
}

const handlePageChange = (page) => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goToDetail = (id) => {
  router.push(`/product/${id}`)
}

onMounted(() => {
  // 处理URL查询参数
  if (route.query.category) {
    activeCategory.value = route.query.category
  }
})
</script>

<style scoped>
.page-container {
  max-width: 1400px;
  margin: 40px auto;
  padding: 0 20px;
  display: flex;
  gap: 30px;
}

.sidebar {
  width: 280px;
  flex-shrink: 0;
}

.filter-section {
  background: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.filter-section h3 {
  font-size: 16px;
  margin-bottom: 15px;
  color: #333;
  font-weight: 600;
}

.menu-item-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.cat-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.cat-en {
  font-size: 11px;
  color: #999;
  font-weight: 400;
}

.price-display {
  text-align: center;
  margin-top: 10px;
  color: #666;
  font-size: 14px;
}

.el-checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.apply-btn {
  width: 100%;
  margin-top: 20px;
}

.main-content {
  flex: 1;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.result-info {
  font-size: 16px;
  color: #666;
}

.highlight {
  color: #409eff;
  font-weight: 700;
  font-size: 20px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 40px;
}

.product-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.product-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.product-image {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

.product-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #f56c6c;
  color: #fff;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 12px;
}

.product-info {
  padding: 20px;
}

.product-info h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.product-desc {
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
  height: 40px;
  overflow: hidden;
}

.view-btn {
  width: 100%;
}

.pagination {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}
</style>
