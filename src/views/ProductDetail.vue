<template>
  <div class="product-detail-page">
    <Header @open-sidebar="$emit('open-sidebar')" />
    
    <div class="page-container" v-if="product">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/products' }">产品中心</el-breadcrumb-item>
        <el-breadcrumb-item>{{ product.name }}</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="detail-content">
        <div class="product-gallery">
          <div class="main-image">
            <img :src="product.image" :alt="product.name" />
          </div>
        </div>

        <div class="product-main-info">
          <h1 class="product-title">{{ product.name }}</h1>
          <div class="product-subtitle">{{ product.enName }}</div>
          
          <div class="product-tags">
            <el-tag type="danger" v-if="product.badge">{{ product.badge }}</el-tag>
            <el-tag type="primary">{{ product.brand }}</el-tag>
            <el-tag>{{ product.categoryName }}</el-tag>
          </div>

          <div class="product-brief">
            <p>{{ product.description }}</p>
          </div>

          <div class="action-buttons">
            <el-button type="primary" size="large" @click="handleContact">
              <el-icon><Phone /></el-icon>
              联系我们咨询
            </el-button>
            <el-button size="large" @click="handleDownload">
              <el-icon><Download /></el-icon>
              下载产品资料
            </el-button>
          </div>
        </div>
      </div>

      <el-tabs v-model="activeTab" class="detail-tabs">
        <el-tab-pane label="产品详情" name="detail">
          <div class="tab-content">
            <h2>产品介绍</h2>
            <p>{{ product.detailIntro }}</p>

            <h2>产品特点</h2>
            <ul class="feature-list">
              <li v-for="(feature, index) in product.features" :key="index">
                <el-icon color="#1890ff"><Check /></el-icon>
                <span>{{ feature }}</span>
              </li>
            </ul>

            <h2>技术参数</h2>
            <el-descriptions :column="2" border>
              <el-descriptions-item 
                v-for="(param, key) in product.specs" 
                :key="key"
                :label="key"
              >
                {{ param }}
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </el-tab-pane>

        <el-tab-pane label="应用场景" name="applications">
          <div class="tab-content">
            <h2>适用行业</h2>
            <div class="application-grid">
              <div 
                v-for="(app, index) in product.applications" 
                :key="index"
                class="application-card"
              >
                <div class="app-icon">{{ app.icon }}</div>
                <h3>{{ app.industry }}</h3>
                <p>{{ app.description }}</p>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="服务支持" name="support">
          <div class="tab-content">
            <h2>我们的服务</h2>
            <div class="support-list">
              <div class="support-item">
                <el-icon :size="32" color="#1890ff"><Tools /></el-icon>
                <h3>技术支持</h3>
                <p>专业技术团队提供7×24小时技术支持服务</p>
              </div>
              <div class="support-item">
                <el-icon :size="32" color="#1890ff"><Setting /></el-icon>
                <h3>安装调试</h3>
                <p>提供专业的设备安装调试和培训服务</p>
              </div>
              <div class="support-item">
                <el-icon :size="32" color="#1890ff"><Monitor /></el-icon>
                <h3>售后保障</h3>
                <p>完善的售后服务体系，快速响应客户需求</p>
              </div>
              <div class="support-item">
                <el-icon :size="32" color="#1890ff"><Box /></el-icon>
                <h3>备件供应</h3>
                <p>充足的原厂备件库存，确保设备稳定运行</p>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div class="related-products">
        <h2>相关产品推荐</h2>
        <div class="products-grid">
          <div 
            v-for="item in relatedProducts" 
            :key="item.id"
            class="product-card"
            @click="goToProduct(item.id)"
          >
            <div class="product-image">
              <img :src="item.image" :alt="item.name" />
            </div>
            <div class="product-info">
              <h3>{{ item.name }}</h3>
              <p>{{ item.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

const route = useRoute()
const router = useRouter()
const activeTab = ref('detail')

// 产品数据库
const productsData = {
  1: {
    name: 'SCA自动涂胶机',
    enName: 'SCA Automatic Gluing Machine',
    brand: 'SCA',
    categoryName: '自动化设备',
    description: '高精度自动涂胶系统，适用于汽车制造生产线',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
    badge: '热销',
    detailIntro: 'SCA自动涂胶机是专为汽车制造行业设计的高精度涂胶设备。采用先进的控制系统和精密的机械结构，确保涂胶的均匀性和一致性。设备具有高度的灵活性，可适应不同车型和涂胶工艺要求。',
    features: [
      '高精度涂胶控制，精度可达±0.1mm',
      '智能化控制系统，支持多种涂胶模式',
      '快速换型设计，提高生产效率',
      '实时监控和数据记录功能',
      '节能环保，材料利用率高达98%',
      '易于维护，降低运营成本'
    ],
    specs: {
      '型号': 'SCA-2000',
      '涂胶精度': '±0.1mm',
      '涂胶速度': '0-500mm/s',
      '工作范围': '2000×1500×800mm',
      '控制系统': 'PLC + 触摸屏',
      '电源': 'AC380V 50Hz',
      '气源压力': '0.6-0.8MPa',
      '重量': '850kg'
    },
    applications: [
      { icon: '🚗', industry: '汽车制造', description: '车身密封、玻璃粘接等工艺' },
      { icon: '✈️', industry: '航空航天', description: '机舱密封、结构粘接' },
      { icon: '🏭', industry: '电子制造', description: '产品封装、防水密封' },
      { icon: '📱', industry: '3C电子', description: '手机屏幕贴合、密封' }
    ]
  },
  2: {
    name: 'Bosch博世电池工具套装',
    enName: 'Bosch Battery Tools Set',
    brand: 'Bosch博世',
    categoryName: '工业工具',
    description: '专业级电池动力工具，高效可靠的装配解决方案',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800',
    badge: '新品',
    detailIntro: 'Bosch博世电池工具套装是专为工业装配设计的专业级电动工具。采用先进的锂电池技术，提供持久的动力输出。人体工学设计，长时间使用不易疲劳。',
    features: [
      '高性能无刷电机，动力强劲',
      '智能电池管理系统，延长使用寿命',
      '快速充电技术，30分钟充满80%',
      '多档扭矩调节，适应不同工况',
      'LED工作灯设计，照明便捷',
      '耐用金属齿轮箱，使用寿命长'
    ],
    specs: {
      '型号': 'GSR 18V-60 C',
      '电压': '18V',
      '最大扭矩': '60Nm',
      '转速': '0-450/0-1700rpm',
      '电池容量': '5.0Ah',
      '充电时间': '60分钟',
      '重量': '1.3kg'
    },
    applications: [
      { icon: '🔩', industry: '装配制造', description: '螺栓紧固、零件装配' },
      { icon: '🏗️', industry: '建筑施工', description: '钢结构装配、设备安装' },
      { icon: '⚙️', industry: '设备维修', description: '设备拆装、维护保养' },
      { icon: '🚙', industry: '汽车维修', description: '车辆维修、保养作业' }
    ]
  }
  // 可以继续添加更多产品详情...
}

const product = ref(null)

const relatedProducts = computed(() => {
  // 返回同类产品
  return [
    {
      id: 3,
      name: 'Gudel固都七轴机器人桁架',
      description: '高精度七轴机器人系统',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400'
    },
    {
      id: 4,
      name: 'Festo费斯托气路元件',
      description: '高性能气动控制系统',
      image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=400'
    },
    {
      id: 5,
      name: '图尔克传感器',
      description: '工业自动化传感器',
      image: 'https://images.unsplash.com/photo-1581096723107-0c516d1ce38b?w=400'
    }
  ]
})

const handleContact = () => {
  router.push('/contact')
}

const handleDownload = () => {
  alert('产品资料下载功能开发中...')
}

const goToProduct = (id) => {
  router.push(`/product/${id}`)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  const productId = route.params.id
  product.value = productsData[productId] || null
  
  if (!product.value) {
    // 如果没有详细数据，使用默认模板
    product.value = {
      name: '产品名称',
      enName: 'Product Name',
      brand: '品牌',
      categoryName: '分类',
      description: '产品简介',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
      detailIntro: '该产品详细介绍开发中...',
      features: [
        '产品特点1',
        '产品特点2',
        '产品特点3'
      ],
      specs: {
        '参数1': '值1',
        '参数2': '值2'
      },
      applications: [
        { icon: '🏭', industry: '制造业', description: '应用场景描述' }
      ]
    }
  }
})
</script>

<style scoped>
.page-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 20px;
}

.el-breadcrumb {
  margin-bottom: 30px;
}

.detail-content {
  display: grid;
  grid-template-columns: 500px 1fr;
  gap: 40px;
  margin-bottom: 50px;
  background: #fff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.product-gallery {
  position: sticky;
  top: 140px;
  height: fit-content;
}

.main-image {
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e8e8e8;
}

.main-image img {
  width: 100%;
  height: 500px;
  object-fit: cover;
}

.product-main-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.product-title {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.product-subtitle {
  font-size: 18px;
  color: #666;
  margin-top: -10px;
}

.product-tags {
  display: flex;
  gap: 12px;
}

.product-brief {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
  font-size: 16px;
  line-height: 1.8;
  color: #555;
}

.action-buttons {
  display: flex;
  gap: 16px;
  margin-top: 20px;
}

.action-buttons .el-button {
  flex: 1;
}

.detail-tabs {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  margin-bottom: 50px;
}

.tab-content {
  padding: 20px 0;
}

.tab-content h2 {
  font-size: 24px;
  color: #333;
  margin: 30px 0 20px 0;
  padding-bottom: 12px;
  border-bottom: 2px solid #1890ff;
}

.tab-content h2:first-child {
  margin-top: 0;
}

.feature-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
  font-size: 15px;
}

.application-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 20px;
}

.application-card {
  padding: 24px;
  background: #f5f7fa;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s;
}

.application-card:hover {
  background: #e6f7ff;
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.app-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.application-card h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

.application-card p {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

.support-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top: 20px;
}

.support-item {
  padding: 30px 20px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s;
}

.support-item:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.2);
}

.support-item h3 {
  font-size: 18px;
  margin: 16px 0 12px 0;
  color: #333;
}

.support-item p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.related-products {
  background: #fff;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.related-products h2 {
  font-size: 24px;
  margin-bottom: 30px;
  color: #333;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.product-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.product-card .product-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.product-card .product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

.product-card .product-info {
  padding: 20px;
}

.product-card .product-info h3 {
  font-size: 16px;
  margin-bottom: 8px;
  color: #333;
}

.product-card .product-info p {
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}
</style>
