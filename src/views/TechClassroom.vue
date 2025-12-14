<template>
  <div class="tech-classroom">
    <Header />
    
    <!-- 顶部Banner -->
    <section class="classroom-hero">
      <div class="hero-background">
        <div class="hero-particles"></div>
      </div>
      <div class="hero-content">
        <div class="hero-badge" data-aos="fade-down">
          <el-icon><Reading /></el-icon>
          <span>持续学习·专业成长</span>
        </div>
        <h1 data-aos="fade-up" data-aos-delay="100">产品技术销售小课堂</h1>
        <p class="subtitle" data-aos="fade-up" data-aos-delay="200">
          专业的工业自动化技术知识分享平台
        </p>
        <p class="description" data-aos="fade-up" data-aos-delay="300">
          涵盖协作机器人、AGV/AMR、PLC、拧紧工艺、视觉检测等多个技术领域<br />
          助力技术与销售人员快速提升专业能力
        </p>
      </div>
    </section>

    <!-- 分类卡片 -->
    <section class="categories-section">
      <div class="container">
        <div class="section-header" data-aos="fade-up">
          <h2>技术分类</h2>
          <p>选择您感兴趣的技术领域</p>
        </div>

        <div class="categories-grid">
          <div
            v-for="category in store.getAllCategories"
            :key="category.id"
            class="category-card"
            @click="selectCategory(category)"
            data-aos="fade-up"
            data-aos-delay="100">
            <div class="card-icon">{{ category.icon }}</div>
            <h3>{{ category.name }}</h3>
            <p class="card-desc">{{ category.description }}</p>
            <div class="card-stats">
              <span><el-icon><Reading /></el-icon> {{ store.getSubcategoriesByCategory(category.id).length }} 个主题</span>
              <span><el-icon><Document /></el-icon> {{ store.getLessonsByCategory(category.id).length }} 个课程</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 二级分类对话框 -->
    <el-dialog
      v-model="subcategoryDialogVisible"
      :title="selectedCategory?.name"
      width="900px"
      :close-on-click-modal="false">
      <div v-if="selectedCategory" class="subcategory-content">
        <div class="dialog-header">
          <span class="dialog-icon">{{ selectedCategory.icon }}</span>
          <div>
            <h3>{{ selectedCategory.name }}</h3>
            <p>{{ selectedCategory.description }}</p>
          </div>
        </div>

        <el-divider />

        <div class="subcategories-grid">
          <div
            v-for="subcategory in store.getSubcategoriesByCategory(selectedCategory.id)"
            :key="subcategory.id"
            class="subcategory-card"
            @click="selectSubcategory(subcategory)">
            <div class="subcategory-header">
              <h4>{{ subcategory.name }}</h4>
              <el-tag>{{ store.getLessonsBySubcategory(subcategory.id).length }} 个课程</el-tag>
            </div>
            <el-icon class="arrow-icon"><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 课程列表对话框 -->
    <el-dialog
      v-model="lessonsDialogVisible"
      :title="selectedSubcategory?.name"
      width="1000px"
      :close-on-click-modal="false">
      <div v-if="selectedSubcategory" class="lessons-content">
        <div class="lessons-header">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>{{ getCategoryName(selectedSubcategory.categoryId) }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{ selectedSubcategory.name }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <div class="lessons-grid">
          <div
            v-for="lesson in currentLessons"
            :key="lesson.id"
            class="lesson-card"
            @click="viewLesson(lesson)">
            <div class="lesson-cover">
              <img v-if="lesson.coverImage" :src="lesson.coverImage" :alt="lesson.title" />
              <div v-else class="no-cover">
                <el-icon :size="48"><Document /></el-icon>
              </div>
              <div class="lesson-badge">
                <el-tag :type="getLevelType(lesson.level)" size="small">{{ lesson.level }}</el-tag>
              </div>
            </div>
            <div class="lesson-info">
              <h4>{{ lesson.title }}</h4>
              <p class="lesson-desc">{{ lesson.description }}</p>
              <div class="lesson-meta">
                <span><el-icon><User /></el-icon> {{ lesson.author }}</span>
                <span><el-icon><Clock /></el-icon> {{ lesson.duration }}</span>
              </div>
              <div class="lesson-stats">
                <span><el-icon><View /></el-icon> {{ lesson.views }}</span>
                <span><el-icon><StarFilled /></el-icon> {{ lesson.likes }}</span>
              </div>
              <div class="lesson-tags">
                <el-tag v-for="tag in lesson.tags" :key="tag" size="small" type="info">{{ tag }}</el-tag>
              </div>
            </div>
          </div>
        </div>

        <el-empty v-if="currentLessons.length === 0" description="暂无课程" />
      </div>
    </el-dialog>

    <!-- 课程详情对话框 -->
    <el-dialog
      v-model="lessonDetailVisible"
      :title="currentLesson?.title"
      width="1200px"
      :close-on-click-modal="false"
      class="lesson-detail-dialog">
      <div v-if="currentLesson" class="lesson-detail">
        <div class="detail-header">
          <img v-if="currentLesson.coverImage" :src="currentLesson.coverImage" class="detail-cover" />
          <div class="detail-meta">
            <div class="meta-row">
              <el-tag :type="getLevelType(currentLesson.level)">{{ currentLesson.level }}</el-tag>
              <el-tag type="info">{{ currentLesson.status === 'published' ? '已发布' : '草稿' }}</el-tag>
            </div>
            <div class="meta-row">
              <span><el-icon><User /></el-icon> 讲师：{{ currentLesson.author }}</span>
              <span><el-icon><Clock /></el-icon> 时长：{{ currentLesson.duration }}</span>
            </div>
            <div class="meta-row">
              <span><el-icon><View /></el-icon> 浏览：{{ currentLesson.views }}</span>
              <span><el-icon><StarFilled /></el-icon> 点赞：{{ currentLesson.likes }}</span>
            </div>
            <div class="action-buttons">
              <el-button type="primary" @click="likeLesson">
                <el-icon><StarFilled /></el-icon> 点赞
              </el-button>
            </div>
          </div>
        </div>

        <el-divider />

        <div class="detail-content">
          <h3>课程简介</h3>
          <p class="description">{{ currentLesson.description }}</p>

          <h3>课程内容</h3>
          <div class="content-text">{{ currentLesson.content }}</div>

          <div v-if="currentLesson.tags && currentLesson.tags.length > 0" class="tags-section">
            <h3>标签</h3>
            <div class="tags-list">
              <el-tag v-for="tag in currentLesson.tags" :key="tag" type="info">{{ tag }}</el-tag>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Reading, Document, ArrowRight, User, Clock, View, StarFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import { useClassroomStore } from '../store/classroom'
import AOS from 'aos'
import 'aos/dist/aos.css'

const store = useClassroomStore()

// 状态
const selectedCategory = ref(null)
const selectedSubcategory = ref(null)
const currentLesson = ref(null)
const subcategoryDialogVisible = ref(false)
const lessonsDialogVisible = ref(false)
const lessonDetailVisible = ref(false)

// 计算属性
const currentLessons = computed(() => {
  if (!selectedSubcategory.value) return []
  return store.getLessonsBySubcategory(selectedSubcategory.value.id)
})

// 方法
const selectCategory = (category) => {
  selectedCategory.value = category
  subcategoryDialogVisible.value = true
}

const selectSubcategory = (subcategory) => {
  selectedSubcategory.value = subcategory
  subcategoryDialogVisible.value = false
  lessonsDialogVisible.value = true
}

const viewLesson = (lesson) => {
  currentLesson.value = lesson
  store.incrementViews(lesson.id)
  lessonDetailVisible.value = true
}

const likeLesson = () => {
  if (currentLesson.value) {
    store.incrementLikes(currentLesson.value.id)
    ElMessage.success('点赞成功！')
  }
}

const getCategoryName = (categoryId) => {
  const cat = store.categories.find(c => c.id === categoryId)
  return cat ? cat.name : ''
}

const getLevelType = (level) => {
  const types = {
    '入门': 'info',
    '初级': 'success',
    '中级': 'warning',
    '高级': 'danger'
  }
  return types[level] || 'info'
}

// 初始化
onMounted(() => {
  store.loadFromLocalStorage()
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 100
  })
})
</script>

<style scoped>
.tech-classroom {
  min-height: 100vh;
  background: #f5f7fa;
}

/* Hero区域 */
.classroom-hero {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 120px 0 100px;
  color: #fff;
  text-align: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.hero-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px),
    radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 50px 50px, 100px 100px;
  background-position: 0 0, 25px 25px;
  animation: particlesMove 20s linear infinite;
}

@keyframes particlesMove {
  from { transform: translateY(0); }
  to { transform: translateY(50px); }
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 24px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.hero-content h1 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
}

.hero-content .subtitle {
  font-size: 24px;
  margin-bottom: 16px;
  opacity: 0.95;
}

.hero-content .description {
  font-size: 16px;
  opacity: 0.9;
  line-height: 1.8;
}

/* 分类区域 */
.categories-section {
  padding: 80px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-header h2 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 12px;
  color: #1a1a1a;
}

.section-header p {
  font-size: 16px;
  color: #666;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.category-card {
  background: #fff;
  padding: 32px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  text-align: center;
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.card-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.category-card h3 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1a1a1a;
}

.card-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.card-stats {
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 13px;
  color: #999;
}

.card-stats span {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 二级分类对话框 */
.subcategory-content {
  padding: 20px;
}

.dialog-header {
  display: flex;
  align-items: center;
  gap: 20px;
}

.dialog-icon {
  font-size: 64px;
}

.dialog-header h3 {
  font-size: 24px;
  margin: 0 0 8px 0;
  color: #1a1a1a;
}

.dialog-header p {
  color: #666;
  margin: 0;
}

.subcategories-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.subcategory-card {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.subcategory-card:hover {
  background: #667eea;
  color: white;
  transform: translateX(8px);
}

.subcategory-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.subcategory-header h4 {
  margin: 0;
  font-size: 16px;
}

.arrow-icon {
  font-size: 20px;
}

/* 课程列表 */
.lessons-content {
  padding: 20px;
}

.lessons-header {
  margin-bottom: 24px;
}

.lessons-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.lesson-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e8e8e8;
}

.lesson-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.lesson-cover {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
}

.lesson-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.lesson-card:hover .lesson-cover img {
  transform: scale(1.1);
}

.no-cover {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.lesson-badge {
  position: absolute;
  top: 12px;
  right: 12px;
}

.lesson-info {
  padding: 16px;
}

.lesson-info h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: #1a1a1a;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.lesson-desc {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.lesson-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #999;
  margin-bottom: 8px;
}

.lesson-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.lesson-stats {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #999;
  margin-bottom: 12px;
}

.lesson-stats span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.lesson-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

/* 课程详情 */
.lesson-detail {
  padding: 20px;
}

.detail-header {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.detail-cover {
  width: 400px;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
}

.detail-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.meta-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.meta-row span {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: auto;
}

.detail-content h3 {
  font-size: 20px;
  font-weight: 600;
  margin: 24px 0 12px 0;
  color: #1a1a1a;
}

.detail-content .description {
  font-size: 16px;
  color: #666;
  line-height: 1.8;
}

.content-text {
  font-size: 15px;
  color: #333;
  line-height: 1.8;
  white-space: pre-wrap;
}

.tags-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e8e8e8;
}

.tags-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 响应式 */
@media (max-width: 1200px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .lessons-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .categories-grid,
  .subcategories-grid,
  .lessons-grid {
    grid-template-columns: 1fr;
  }
  
  .hero-content h1 {
    font-size: 32px;
  }
  
  .detail-header {
    flex-direction: column;
  }
  
  .detail-cover {
    width: 100%;
  }
}
</style>
