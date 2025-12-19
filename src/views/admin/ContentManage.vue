<template>
  <div class="content-manage">
    <div class="page-header">
      <h1>内容管理</h1>
      <p>管理网站首页的轮播图、明星产品和其他内容</p>
    </div>

    <el-tabs v-model="activeTab" class="content-tabs">
      <!-- Banner轮播图管理 -->
      <el-tab-pane label="首页Banner" name="banner">
        <div class="section-header">
          <h2>首页轮播图</h2>
          <el-button type="primary" @click="handleAddBanner">
            <el-icon><Plus /></el-icon>
            添加轮播图
          </el-button>
        </div>

        <div class="banner-list">
          <div v-for="banner in banners" :key="banner.id" class="banner-item">
            <div class="banner-preview">
              <img :src="banner.image" :alt="banner.title['zh-CN']" />
              <div class="banner-overlay">
                <el-button @click="handleEditBanner(banner)" circle>
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button @click="handleDeleteBanner(banner)" circle type="danger">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="banner-info">
              <h3>{{ banner.title['zh-CN'] }}</h3>
              <p>{{ banner.subtitle['zh-CN'] }}</p>
              <div class="banner-meta">
                <el-tag :type="banner.status === 'active' ? 'success' : 'info'">
                  {{ banner.status === 'active' ? '显示中' : '已隐藏' }}
                </el-tag>
                <el-tag type="info">排序: {{ banner.order }}</el-tag>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- 明星产品管理 -->
      <el-tab-pane label="明星产品" name="featured">
        <div class="section-header">
          <h2>明星产品展示</h2>
          <el-button type="primary" @click="handleAddFeaturedProduct">
            <el-icon><Plus /></el-icon>
            添加明星产品
          </el-button>
        </div>

        <div class="featured-list">
          <div v-for="product in featuredProducts" :key="product.id" class="featured-item">
            <div class="featured-preview">
              <img :src="product.thumbnailUrl" :alt="product.title['zh-CN']" />
              <div class="media-type-badge">
                <el-tag :type="getMediaTypeColor(product.mediaType)" size="small">
                  {{ getMediaTypeLabel(product.mediaType) }}
                </el-tag>
              </div>
              <div class="featured-overlay">
                <el-button @click="handleEditFeaturedProduct(product)" circle>
                  <el-icon><Edit /></el-icon>
                </el-button>
                <el-button @click="handleDeleteFeaturedProduct(product)" circle type="danger">
                  <el-icon><Delete /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="featured-info">
              <h3>{{ product.title['zh-CN'] }}</h3>
              <p>{{ product.description['zh-CN'] }}</p>
              <div class="featured-meta">
                <el-tag :type="product.status === 'active' ? 'success' : 'info'">
                  {{ product.status === 'active' ? '显示中' : '已隐藏' }}
                </el-tag>
                <el-tag type="info">排序: {{ product.order }}</el-tag>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- Banner编辑对话框 -->
    <el-dialog 
      v-model="bannerDialogVisible" 
      :title="editingBanner.id ? '编辑轮播图' : '添加轮播图'" 
      width="700px"
      :close-on-click-modal="false">
      <el-form :model="editingBanner" label-width="120px">
        <el-tabs v-model="activeLangTab">
          <el-tab-pane label="中文" name="zh-CN">
            <el-form-item label="标题">
              <el-input v-model="editingBanner.title['zh-CN']" placeholder="请输入中文标题" />
            </el-form-item>
            <el-form-item label="副标题">
              <el-input v-model="editingBanner.subtitle['zh-CN']" type="textarea" :rows="2" placeholder="请输入中文副标题" />
            </el-form-item>
            <el-form-item label="按钮文字">
              <el-input v-model="editingBanner.buttonText['zh-CN']" placeholder="如：了解更多" />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="English" name="en-US">
            <el-form-item label="Title">
              <el-input v-model="editingBanner.title['en-US']" placeholder="Enter English title" />
            </el-form-item>
            <el-form-item label="Subtitle">
              <el-input v-model="editingBanner.subtitle['en-US']" type="textarea" :rows="2" placeholder="Enter English subtitle" />
            </el-form-item>
            <el-form-item label="Button Text">
              <el-input v-model="editingBanner.buttonText['en-US']" placeholder="e.g.: Learn More" />
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
        
        <el-form-item label="背景图片" required>
          <el-upload
            class="image-uploader"
            :show-file-list="false"
            :before-upload="beforeBannerUpload"
            :auto-upload="false"
            :on-change="handleBannerImageChange"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            drag>
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">
              将图片拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持 JPG、PNG、WebP | 建议尺寸 1920x650px | 大小 < 3MB
              </div>
            </template>
          </el-upload>
          <div v-if="editingBanner.image" class="banner-image-preview">
            <img :src="editingBanner.image" alt="Banner预览" />
            <el-button type="danger" size="small" @click="editingBanner.image = ''" class="remove-btn">
              <el-icon><Delete /></el-icon> 删除图片
            </el-button>
          </div>
        </el-form-item>
        
        <el-form-item label="按钮动作">
          <el-select v-model="editingBanner.buttonAction" placeholder="选择按钮点击后的跳转">
            <el-option label="关于我们" value="about" />
            <el-option label="产品与服务" value="products" />
            <el-option label="解决方案" value="solutions" />
            <el-option label="联系我们" value="contact" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="显示状态">
          <el-radio-group v-model="editingBanner.status">
            <el-radio label="active">显示</el-radio>
            <el-radio label="hidden">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="排序">
          <el-input-number v-model="editingBanner.order" :min="1" :max="100" />
          <el-text type="info" size="small">数字越小越靠前</el-text>
        </el-form-item>
        
        <el-divider content-position="left">🎨 视觉效果设置</el-divider>
        
        <!-- 朦胧效果颜色设置 -->
        <el-form-item label="朦胧效果颜色">
          <div class="color-control">
            <div class="color-picker-row">
              <el-color-picker 
                v-model="overlayColorHex" 
                show-alpha
                @change="updateOverlayColorFromHex"
                style="margin-right: 16px"
              />
              <el-input 
                v-model="overlayColorHex" 
                placeholder="#000000"
                style="width: 150px; margin-right: 16px"
                @input="updateOverlayColorFromHex"
              >
                <template #prepend>HEX</template>
              </el-input>
              <el-text type="info" size="small">{{ overlayColorHex }}</el-text>
            </div>
            
            <div class="rgb-controls">
              <div class="rgb-slider">
                <span class="rgb-label" style="color: #f56c6c">R</span>
                <el-slider 
                  v-model="overlayColorRGB.r" 
                  :min="0" 
                  :max="255"
                  @input="updateOverlayColorFromRGB"
                  style="width: 200px; margin: 0 12px"
                />
                <el-input-number 
                  v-model="overlayColorRGB.r" 
                  :min="0" 
                  :max="255"
                  @change="updateOverlayColorFromRGB"
                  style="width: 100px"
                  size="small"
                />
              </div>
              
              <div class="rgb-slider">
                <span class="rgb-label" style="color: #67c23a">G</span>
                <el-slider 
                  v-model="overlayColorRGB.g" 
                  :min="0" 
                  :max="255"
                  @input="updateOverlayColorFromRGB"
                  style="width: 200px; margin: 0 12px"
                />
                <el-input-number 
                  v-model="overlayColorRGB.g" 
                  :min="0" 
                  :max="255"
                  @change="updateOverlayColorFromRGB"
                  style="width: 100px"
                  size="small"
                />
              </div>
              
              <div class="rgb-slider">
                <span class="rgb-label" style="color: #409eff">B</span>
                <el-slider 
                  v-model="overlayColorRGB.b" 
                  :min="0" 
                  :max="255"
                  @input="updateOverlayColorFromRGB"
                  style="width: 200px; margin: 0 12px"
                />
                <el-input-number 
                  v-model="overlayColorRGB.b" 
                  :min="0" 
                  :max="255"
                  @change="updateOverlayColorFromRGB"
                  style="width: 100px"
                  size="small"
                />
              </div>
            </div>
            
            <div class="color-presets">
              <el-text type="info" size="small" style="margin-right: 12px">快速选择：</el-text>
              <el-tag size="small" @click="setPresetColor(0, 40, 80)" style="cursor: pointer; margin-right: 8px; background: rgb(0, 40, 80); color: white">深蓝色</el-tag>
              <el-tag size="small" @click="setPresetColor(0, 0, 0)" style="cursor: pointer; margin-right: 8px; background: rgb(0, 0, 0); color: white">纯黑色</el-tag>
              <el-tag size="small" @click="setPresetColor(40, 0, 80)" style="cursor: pointer; margin-right: 8px; background: rgb(40, 0, 80); color: white">深紫色</el-tag>
              <el-tag size="small" @click="setPresetColor(80, 40, 0)" style="cursor: pointer; margin-right: 8px; background: rgb(80, 40, 0); color: white">深棕色</el-tag>
              <el-tag size="small" @click="setPresetColor(0, 60, 40)" style="cursor: pointer; margin-right: 8px; background: rgb(0, 60, 40); color: white">深绿色</el-tag>
            </div>
          </div>
        </el-form-item>
        
        <el-form-item label="朦胧效果强度">
          <div class="overlay-control">
            <el-slider 
              v-model="overlayOpacityPercent" 
              :min="0" 
              :max="100" 
              :step="5"
              show-stops
              @input="updateOverlayOpacity"
              style="width: 60%"
            />
            <el-input-number 
              v-model="overlayOpacityPercent" 
              :min="0" 
              :max="100"
              :step="5"
              @change="updateOverlayOpacity"
              style="width: 120px; margin-left: 16px"
            />
            <span style="margin-left: 12px">%</span>
          </div>
          <div class="overlay-preview">
            <div class="preview-box" :style="{ 
              background: `linear-gradient(135deg, rgba(${overlayColorRGB.r}, ${overlayColorRGB.g}, ${overlayColorRGB.b}, ${editingBanner.overlayOpacity || 0.85}) 0%, rgba(${Math.floor(overlayColorRGB.r * 0.5)}, ${Math.floor(overlayColorRGB.g * 0.5)}, ${Math.floor(overlayColorRGB.b * 0.5)}, ${(editingBanner.overlayOpacity || 0.85) - 0.15}) 100%)` 
            }">
              <span>预览效果</span>
            </div>
            <div class="opacity-tips">
              <el-text type="info" size="small">
                <el-icon><InfoFilled /></el-icon>
                调整图片上方遮罩的透明度：0%（完全透明）- 100%（完全不透明）
              </el-text>
            </div>
            <div class="opacity-suggestions">
              <el-tag size="small" @click="setOpacity(0)" style="cursor: pointer; margin-right: 8px">无遮罩 0%</el-tag>
              <el-tag size="small" @click="setOpacity(30)" style="cursor: pointer; margin-right: 8px">轻微 30%</el-tag>
              <el-tag size="small" @click="setOpacity(50)" style="cursor: pointer; margin-right: 8px">适中 50%</el-tag>
              <el-tag size="small" @click="setOpacity(70)" style="cursor: pointer; margin-right: 8px">较深 70%</el-tag>
              <el-tag size="small" @click="setOpacity(85)" style="cursor: pointer; margin-right: 8px">推荐 85%</el-tag>
              <el-tag size="small" @click="setOpacity(100)" style="cursor: pointer">最深 100%</el-tag>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="bannerDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveBanner">保存</el-button>
      </template>
    </el-dialog>

    <!-- 明星产品编辑对话框 (功能增强版) -->
    <el-dialog 
      v-model="featuredDialogVisible" 
      :title="editingFeatured.id ? '编辑明星产品' : '添加明星产品'" 
      width="900px"
      :close-on-click-modal="false"
      class="featured-product-dialog">
      <el-form :model="editingFeatured" label-width="140px" ref="featuredFormRef">
        <!-- 语言切换 -->
        <el-tabs v-model="activeLangTab" class="lang-tabs">
          <el-tab-pane label="🇨🇳 中文" name="zh-CN">
            <el-form-item label="产品名称" required>
              <el-input v-model="editingFeatured.title['zh-CN']" placeholder="请输入产品名称（中文）" maxlength="100" show-word-limit />
            </el-form-item>
            <el-form-item label="产品描述" required>
              <el-input v-model="editingFeatured.description['zh-CN']" type="textarea" :rows="3" placeholder="请输入产品描述（中文）" maxlength="300" show-word-limit />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="🇺🇸 English" name="en-US">
            <el-form-item label="Product Name" required>
              <el-input v-model="editingFeatured.title['en-US']" placeholder="Enter product name (English)" maxlength="100" show-word-limit />
            </el-form-item>
            <el-form-item label="Description" required>
              <el-input v-model="editingFeatured.description['en-US']" type="textarea" :rows="3" placeholder="Enter description (English)" maxlength="300" show-word-limit />
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
        
        <el-divider content-position="left">
          <el-icon><Picture /></el-icon> 媒体资源配置
        </el-divider>
        
        <!-- 媒体类型选择 -->
        <el-form-item label="媒体类型" required>
          <el-radio-group v-model="editingFeatured.mediaType" @change="handleMediaTypeChange">
            <el-radio label="video-file" border>
              <el-icon><VideoCamera /></el-icon> 视频文件 (MP4)
            </el-radio>
            <el-radio label="video-link" border>
              <el-icon><Link /></el-icon> 视频链接 (YouTube/Vimeo)
            </el-radio>
            <el-radio label="web-link" border>
              <el-icon><Connection /></el-icon> 网页链接
            </el-radio>
            <el-radio label="image-file" border>
              <el-icon><Picture /></el-icon> 图片文件 (JPG/PNG)
            </el-radio>
            <el-radio label="image-link" border>
              <el-icon><Link /></el-icon> 图片链接
            </el-radio>
            <el-radio label="gif-file" border>
              <el-icon><PictureFilled /></el-icon> 动画文件 (GIF/动图)
            </el-radio>
            <el-radio label="animation-link" border>
              <el-icon><Link /></el-icon> 动态图片链接
            </el-radio>
          </el-radio-group>
        </el-form-item>
        
        <!-- 媒体URL/文件上传 -->
        <el-form-item 
          :label="getMediaUrlLabel()" 
          required
          class="media-url-item">
          <!-- 文件URL输入模式（所有类型统一使用URL） -->
          <div class="upload-section">
            <el-alert 
              title="💡 上传提示"
              :description="getUploadTip()" 
              type="info" 
              :closable="false"
              style="margin-bottom: 12px"
            />
            <el-input 
              v-model="editingFeatured.mediaUrl" 
              :placeholder="getMediaUrlPlaceholder()"
              class="url-input-main">
              <template #prepend>
                <el-icon><Link /></el-icon> URL
              </template>
              <template #append>
                <el-button @click="editingFeatured.mediaUrl = ''">清除</el-button>
              </template>
            </el-input>
            <div class="url-examples">
              <el-text type="info" size="small">
                <el-icon><InfoFilled /></el-icon>
                示例: {{ getMediaUrlPlaceholder() }}
              </el-text>
            </div>
          </div>
          
          <!-- 媒体帮助信息 -->
          <el-collapse v-model="showMediaHelp" class="help-collapse">
              <el-collapse-item name="help">
                <template #title>
                  <el-icon><InfoFilled /></el-icon> 如何填写{{ getMediaTypeText() }}URL？
                </template>
                <div class="help-content">
                  <div v-if="editingFeatured.mediaType === 'video-link'">
                    <p><strong>🎥 YouTube视频:</strong></p>
                    <el-tag type="success">推荐</el-tag>
                    <code>https://www.youtube.com/embed/VIDEO_ID</code>
                    <p class="mt-2">示例: <code>https://www.youtube.com/embed/dQw4w9WgXcQ</code></p>
                    
                    <p class="mt-3"><strong>🎥 Vimeo视频:</strong></p>
                    <code>https://player.vimeo.com/video/VIDEO_ID</code>
                    
                    <p class="mt-3"><strong>🎥 腾讯视频:</strong></p>
                    <code>https://v.qq.com/txp/iframe/player.html?vid=VIDEO_ID</code>
                  </div>
                  
                  <div v-if="editingFeatured.mediaType === 'web-link'">
                    <p><strong>🌐 网页链接:</strong></p>
                    <p>输入完整的网页URL地址</p>
                    <code>https://www.example.com/product-page</code>
                  </div>
                  
                  <div v-if="editingFeatured.mediaType === 'image-link'">
                    <p><strong>🖼️ 图片链接:</strong></p>
                    <code>https://example.com/images/product.jpg</code>
                    <p class="mt-2">支持格式: JPG, PNG, WEBP</p>
                    <p>建议尺寸: 1200x800px，大小 < 500KB</p>
                  </div>
                  
                  <div v-if="editingFeatured.mediaType === 'animation-link'">
                    <p><strong>🎞️ 动态图片链接:</strong></p>
                    <code>https://example.com/images/animation.gif</code>
                    <p class="mt-2">支持格式: GIF, APNG</p>
                    <p>建议大小 < 2MB，帧数 < 100帧</p>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
        </el-form-item>
        
        <!-- 媒体预览 -->
        <el-form-item label="媒体预览" v-if="editingFeatured.mediaUrl">
          <div class="media-preview-box">
            <!-- 视频预览 -->
            <div v-if="editingFeatured.mediaType.startsWith('video')" class="preview-video">
              <iframe 
                v-if="editingFeatured.mediaType === 'video-link'"
                :src="editingFeatured.mediaUrl"
                width="100%"
                height="300"
                frameborder="0"
                allowfullscreen>
              </iframe>
              <video 
                v-else
                :src="editingFeatured.mediaUrl"
                controls
                width="100%"
                height="300">
              </video>
            </div>
            
            <!-- 图片/GIF预览 -->
            <div v-else-if="editingFeatured.mediaType.includes('image') || editingFeatured.mediaType.includes('animation') || editingFeatured.mediaType.includes('gif')" class="preview-image">
              <img :src="editingFeatured.mediaUrl" alt="预览" />
            </div>
            
            <!-- 网页链接预览 -->
            <div v-else-if="editingFeatured.mediaType === 'web-link'" class="preview-link">
              <el-link :href="editingFeatured.mediaUrl" target="_blank" type="primary">
                <el-icon><Link /></el-icon>
                {{ editingFeatured.mediaUrl }}
              </el-link>
            </div>
          </div>
        </el-form-item>
        
        <!-- 缩略图 -->
        <el-form-item label="缩略图" required>
          <el-upload
            class="image-uploader"
            :show-file-list="false"
            :before-upload="beforeThumbnailUpload"
            :on-success="handleThumbnailSuccess"
            :auto-upload="false"
            :on-change="handleThumbnailChange"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            drag>
            <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
            <div class="el-upload__text">
              将图片拖到此处，或<em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持 JPG、PNG、GIF、WebP | 建议尺寸 800x500px | 大小 < 2MB
              </div>
            </template>
          </el-upload>
          <div v-if="editingFeatured.thumbnailUrl" class="thumbnail-preview">
            <img :src="editingFeatured.thumbnailUrl" alt="缩略图预览" />
            <el-button type="danger" size="small" @click="editingFeatured.thumbnailUrl = ''" class="remove-btn">
              <el-icon><Delete /></el-icon> 删除图片
            </el-button>
          </div>
        </el-form-item>
        
        <el-divider content-position="left">
          <el-icon><Setting /></el-icon> 其他设置
        </el-divider>
        
        <!-- 跳转链接 -->
        <el-form-item label="点击跳转链接">
          <el-input v-model="editingFeatured.link" placeholder="/products 或其他页面路径">
            <template #prepend>
              <el-icon><Connection /></el-icon>
            </template>
          </el-input>
          <el-text type="info" size="small">💡 留空则不跳转 | 站内链接: /products | 外部链接: https://...</el-text>
        </el-form-item>
        
        <!-- 显示状态和排序 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="显示状态">
              <el-radio-group v-model="editingFeatured.status">
                <el-radio label="active">
                  <el-icon color="green"><CircleCheck /></el-icon> 显示
                </el-radio>
                <el-radio label="hidden">
                  <el-icon color="gray"><Hide /></el-icon> 隐藏
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序">
              <el-input-number v-model="editingFeatured.order" :min="1" :max="100" />
              <el-text type="info" size="small">数字越小越靠前</el-text>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="featuredDialogVisible = false" size="large">
            <el-icon><Close /></el-icon>
            取消
          </el-button>
          <el-button type="primary" @click="saveFeaturedProduct" size="large">
            <el-icon><Check /></el-icon>
            保存产品
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useCmsStore } from '@/store/cms'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Plus, Edit, Delete, QuestionFilled, InfoFilled,
  VideoCamera, Link, Connection, Picture, PictureFilled,
  Upload, CircleCheck, Hide, Check, Close, Setting, UploadFilled
} from '@element-plus/icons-vue'

const cmsStore = useCmsStore()
const activeTab = ref('banner')
const activeLangTab = ref('zh-CN')
const showMediaHelp = ref([])

// Banner数据
const banners = computed(() => cmsStore.homeBanners)
const bannerDialogVisible = ref(false)
const editingBanner = reactive({
  id: null,
  title: { 'zh-CN': '', 'en-US': '' },
  subtitle: { 'zh-CN': '', 'en-US': '' },
  buttonText: { 'zh-CN': '了解更多', 'en-US': 'Learn More' },
  buttonAction: 'products',
  image: '',
  status: 'active',
  order: 1,
  overlayOpacity: 0.85,  // 朦胧效果透明度 (0-1)
  overlayColor: { r: 0, g: 40, b: 80 }  // 朦胧效果RGB颜色
})

// 朦胧效果控制 - 百分比显示
const overlayOpacityPercent = ref(85)

// 朦胧效果颜色控制
const overlayColorRGB = ref({ r: 0, g: 40, b: 80 })
const overlayColorHex = ref('#002850')

// RGB转HEX
const rgbToHex = (r, g, b) => {
  const toHex = (n) => {
    const hex = Math.round(n).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

// HEX转RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 40, b: 80 }
}

// 从RGB更新颜色
const updateOverlayColorFromRGB = () => {
  overlayColorHex.value = rgbToHex(overlayColorRGB.value.r, overlayColorRGB.value.g, overlayColorRGB.value.b)
  editingBanner.overlayColor = { ...overlayColorRGB.value }
}

// 从HEX更新颜色
const updateOverlayColorFromHex = (value) => {
  if (value && value.startsWith('#')) {
    const rgb = hexToRgb(value)
    overlayColorRGB.value = rgb
    editingBanner.overlayColor = rgb
  }
}

// 设置预设颜色
const setPresetColor = (r, g, b) => {
  overlayColorRGB.value = { r, g, b }
  overlayColorHex.value = rgbToHex(r, g, b)
  editingBanner.overlayColor = { r, g, b }
}

// 更新透明度
const updateOverlayOpacity = (value) => {
  editingBanner.overlayOpacity = value / 100
}

// 快速设置透明度
const setOpacity = (percent) => {
  overlayOpacityPercent.value = percent
  editingBanner.overlayOpacity = percent / 100
}

// 明星产品数据
const featuredProducts = computed(() => cmsStore.featuredProducts)
const featuredDialogVisible = ref(false)
const editingFeatured = reactive({
  id: null,
  title: { 'zh-CN': '', 'en-US': '' },
  description: { 'zh-CN': '', 'en-US': '' },
  mediaType: 'image-link',
  mediaUrl: '',
  thumbnailUrl: '',
  link: '/products',
  status: 'active',
  order: 1
})

// ========== Banner管理 ==========
const handleAddBanner = () => {
  Object.assign(editingBanner, {
    id: null,
    title: { 'zh-CN': '', 'en-US': '' },
    subtitle: { 'zh-CN': '', 'en-US': '' },
    buttonText: { 'zh-CN': '了解更多', 'en-US': 'Learn More' },
    buttonAction: 'products',
    image: '',
    status: 'active',
    order: banners.value.length + 1,
    overlayOpacity: 0.85,
    overlayColor: { r: 0, g: 40, b: 80 }
  })
  overlayOpacityPercent.value = 85
  overlayColorRGB.value = { r: 0, g: 40, b: 80 }
  overlayColorHex.value = '#002850'
  activeLangTab.value = 'zh-CN'
  bannerDialogVisible.value = true
}

const handleEditBanner = (banner) => {
  Object.assign(editingBanner, JSON.parse(JSON.stringify(banner)))
  // 设置透明度百分比
  overlayOpacityPercent.value = Math.round((editingBanner.overlayOpacity || 0.85) * 100)
  // 设置颜色
  if (editingBanner.overlayColor) {
    overlayColorRGB.value = { ...editingBanner.overlayColor }
    overlayColorHex.value = rgbToHex(editingBanner.overlayColor.r, editingBanner.overlayColor.g, editingBanner.overlayColor.b)
  } else {
    overlayColorRGB.value = { r: 0, g: 40, b: 80 }
    overlayColorHex.value = '#002850'
    editingBanner.overlayColor = { r: 0, g: 40, b: 80 }
  }
  activeLangTab.value = 'zh-CN'
  bannerDialogVisible.value = true
}

const handleDeleteBanner = (banner) => {
  ElMessageBox.confirm(
    `确定要删除轮播图 "${banner.title['zh-CN']}" 吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    cmsStore.deleteHomeBanner(banner.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const saveBanner = () => {
  // 验证必填项
  if (!editingBanner.title['zh-CN'] || !editingBanner.image) {
    ElMessage.warning('请填写中文标题和图片URL')
    return
  }
  
  if (editingBanner.id) {
    cmsStore.updateBanner(editingBanner.id, { ...editingBanner })
    ElMessage.success('修改成功')
  } else {
    cmsStore.addHomeBanner({ ...editingBanner })
    ElMessage.success('添加成功')
  }
  bannerDialogVisible.value = false
}

// ========== 图片上传处理 ==========
// 将图片文件转换为Base64
const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })
}

// Banner图片上传前验证
const beforeBannerUpload = (file) => {
  const isImage = /^image\/(jpeg|jpg|png|webp)$/.test(file.type)
  const isLt3M = file.size / 1024 / 1024 < 3

  if (!isImage) {
    ElMessage.error('只能上传 JPG/PNG/WebP 格式的图片!')
    return false
  }
  if (!isLt3M) {
    ElMessage.error('图片大小不能超过 3MB!')
    return false
  }
  return true
}

// Banner图片选择处理
const handleBannerImageChange = async (file) => {
  if (beforeBannerUpload(file.raw)) {
    try {
      const base64 = await convertImageToBase64(file.raw)
      editingBanner.image = base64
      ElMessage.success('图片已加载，可预览效果')
    } catch (error) {
      ElMessage.error('图片加载失败: ' + error.message)
    }
  }
}

// 缩略图上传前验证
const beforeThumbnailUpload = (file) => {
  const isImage = /^image\/(jpeg|jpg|png|gif|webp)$/.test(file.type)
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传 JPG/PNG/GIF/WebP 格式的图片!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 缩略图选择处理
const handleThumbnailChange = async (file) => {
  if (beforeThumbnailUpload(file.raw)) {
    try {
      const base64 = await convertImageToBase64(file.raw)
      editingFeatured.thumbnailUrl = base64
      ElMessage.success('缩略图已加载，可预览效果')
    } catch (error) {
      ElMessage.error('图片加载失败: ' + error.message)
    }
  }
}

// 上传成功回调（预留给未来使用图床的情况）
const handleThumbnailSuccess = (response, file) => {
  if (response && response.url) {
    editingFeatured.thumbnailUrl = response.url
    ElMessage.success('图片上传成功')
  }
}

// ========== 明星产品管理 (增强版) ==========
const uploadAction = ref('/api/upload') // 上传接口地址
const featuredFormRef = ref(null)

const handleAddFeaturedProduct = () => {
  Object.assign(editingFeatured, {
    id: null,
    title: { 'zh-CN': '', 'en-US': '' },
    description: { 'zh-CN': '', 'en-US': '' },
    mediaType: 'image-link',
    mediaUrl: '',
    thumbnailUrl: '',
    link: '/products',
    status: 'active',
    order: featuredProducts.value.length + 1
  })
  activeLangTab.value = 'zh-CN'
  showMediaHelp.value = []
  featuredDialogVisible.value = true
}

const handleEditFeaturedProduct = (product) => {
  Object.assign(editingFeatured, JSON.parse(JSON.stringify(product)))
  // 兼容旧数据: 将旧的媒体类型映射到新类型
  if (editingFeatured.mediaType === 'video') {
    editingFeatured.mediaType = 'video-link'
  } else if (editingFeatured.mediaType === 'image') {
    editingFeatured.mediaType = 'image-link'
  } else if (editingFeatured.mediaType === 'gif') {
    editingFeatured.mediaType = 'gif-file'
  }
  activeLangTab.value = 'zh-CN'
  showMediaHelp.value = []
  featuredDialogVisible.value = true
}

const handleDeleteFeaturedProduct = (product) => {
  ElMessageBox.confirm(
    `确定要删除明星产品 "${product.title['zh-CN']}" 吗？`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    cmsStore.deleteFeaturedProduct(product.id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const saveFeaturedProduct = () => {
  // 验证必填项
  if (!editingFeatured.title['zh-CN']) {
    ElMessage.warning('请填写产品名称（中文）')
    return
  }
  if (!editingFeatured.title['en-US']) {
    ElMessage.warning('请填写产品名称（英文）')
    return
  }
  if (!editingFeatured.mediaUrl) {
    ElMessage.warning('请填写媒体URL')
    return
  }
  if (!editingFeatured.thumbnailUrl) {
    ElMessage.warning('请上传缩略图')
    return
  }
  
  // 创建要保存的数据副本
  const dataToSave = {
    id: editingFeatured.id,
    title: { ...editingFeatured.title },
    description: { ...editingFeatured.description },
    mediaType: editingFeatured.mediaType,
    mediaUrl: editingFeatured.mediaUrl,
    thumbnailUrl: editingFeatured.thumbnailUrl,
    link: editingFeatured.link,
    status: editingFeatured.status,
    order: editingFeatured.order
  }
  
  if (editingFeatured.id) {
    cmsStore.updateFeaturedProduct(editingFeatured.id, dataToSave)
    ElMessage.success('修改成功')
  } else {
    cmsStore.addFeaturedProduct(dataToSave)
    ElMessage.success('添加成功')
  }
  featuredDialogVisible.value = false
}

// ========== 媒体类型辅助函数 ==========

// 媒体类型变更处理
const handleMediaTypeChange = (newType) => {
  // 切换媒体类型时，清空媒体URL
  editingFeatured.mediaUrl = ''
  showMediaHelp.value = []
}

// 判断是否为文件上传模式
const isFileUploadMode = () => {
  return ['video-file', 'image-file', 'gif-file'].includes(editingFeatured.mediaType)
}

// 获取媒体URL标签
const getMediaUrlLabel = () => {
  const labels = {
    'video-file': '上传视频文件',
    'video-link': '视频嵌入链接',
    'web-link': '网页链接',
    'image-file': '上传图片文件',
    'image-link': '图片URL',
    'gif-file': '上传GIF文件',
    'animation-link': '动态图URL'
  }
  return labels[editingFeatured.mediaType] || '媒体URL'
}

// 获取媒体URL占位符
const getMediaUrlPlaceholder = () => {
  const placeholders = {
    'video-link': 'https://www.youtube.com/embed/VIDEO_ID 或 https://player.vimeo.com/video/VIDEO_ID',
    'web-link': 'https://www.example.com/product-page',
    'image-link': 'https://example.com/images/product.jpg',
    'animation-link': 'https://example.com/images/animation.gif'
  }
  return placeholders[editingFeatured.mediaType] || '请输入URL地址'
}

// 获取媒体类型文字
const getMediaTypeText = () => {
  const texts = {
    'video-file': '视频',
    'video-link': '视频链接',
    'web-link': '网页',
    'image-file': '图片',
    'image-link': '图片链接',
    'gif-file': 'GIF动画',
    'animation-link': '动画链接'
  }
  return texts[editingFeatured.mediaType] || '媒体'
}

// 获取上传提示
const getUploadTip = () => {
  const tips = {
    'video-file': '支持MP4、AVI、MOV格式，文件大小不超过50MB',
    'image-file': '支持JPG、PNG、WEBP格式，文件大小不超过5MB，建议尺寸1200x800px',
    'gif-file': '支持GIF格式，文件大小不超过10MB，建议帧数<100帧'
  }
  return tips[editingFeatured.mediaType] || '请选择文件上传'
}

// 获取接受的文件类型
const getAcceptTypes = () => {
  const accepts = {
    'video-file': 'video/mp4,video/avi,video/quicktime',
    'image-file': 'image/jpeg,image/png,image/webp',
    'gif-file': 'image/gif'
  }
  return accepts[editingFeatured.mediaType] || '*'
}

// 文件上传前验证
const beforeUpload = (file) => {
  const sizeLimit = {
    'video-file': 50 * 1024 * 1024, // 50MB
    'image-file': 5 * 1024 * 1024,  // 5MB
    'gif-file': 10 * 1024 * 1024    // 10MB
  }
  
  const limit = sizeLimit[editingFeatured.mediaType]
  if (limit && file.size > limit) {
    ElMessage.error(`文件大小不能超过 ${limit / 1024 / 1024}MB`)
    return false
  }
  
  return true
}

// 文件上传成功回调
const handleUploadSuccess = (response, file) => {
  if (response.code === 200 && response.data) {
    editingFeatured.mediaUrl = response.data.url
    ElMessage.success('文件上传成功')
  } else {
    ElMessage.error('文件上传失败: ' + (response.message || '未知错误'))
  }
}

// 文件上传失败回调
const handleUploadError = (error) => {
  console.error('上传失败:', error)
  ElMessage.error('文件上传失败，请重试')
}

// 辅助函数 - 获取媒体类型标签和颜色
const getMediaTypeLabel = (type) => {
  const labels = {
    'video': '视频',
    'video-file': '视频文件',
    'video-link': '视频链接',
    'web-link': '网页',
    'image': '图片',
    'image-file': '图片',
    'image-link': '图片链接',
    'gif': 'GIF',
    'gif-file': 'GIF动画',
    'animation-link': '动画'
  }
  return labels[type] || type
}

const getMediaTypeColor = (type) => {
  if (type.includes('video')) return 'danger'
  if (type.includes('image')) return 'primary'
  if (type.includes('gif') || type.includes('animation')) return 'warning'
  if (type.includes('web')) return 'success'
  return 'info'
}
</script>

<style scoped>
.content-manage {
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.page-header p {
  font-size: 14px;
  color: #666;
}

.content-tabs {
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

/* Banner列表 */
.banner-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.banner-item {
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
}

.banner-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.banner-preview {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.banner-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.3s;
}

.banner-item:hover .banner-overlay {
  opacity: 1;
}

.banner-info {
  padding: 16px;
}

.banner-info h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

.banner-info p {
  font-size: 13px;
  color: #666;
  margin-bottom: 12px;
}

.banner-meta {
  display: flex;
  gap: 8px;
}

/* 明星产品列表 */
.featured-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.featured-item {
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
}

.featured-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.featured-preview {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.featured-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-type-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 1;
}

.featured-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.3s;
}

.featured-item:hover .featured-overlay {
  opacity: 1;
}

.featured-info {
  padding: 16px;
}

.featured-info h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

.featured-info p {
  font-size: 13px;
  color: #666;
  margin-bottom: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.featured-meta {
  display: flex;
  gap: 8px;
}

/* 帮助文本 */
.help-text {
  margin-top: 8px;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

.help-text p {
  margin: 6px 0;
}

.help-text strong {
  color: #333;
}

/* 对话框内标签页 */
:deep(.el-dialog .el-tabs) {
  margin-bottom: 16px;
}

:deep(.el-dialog .el-tabs__content) {
  padding-top: 16px;
}

/* ========== 明星产品对话框增强样式 ========== */

.featured-product-dialog :deep(.el-dialog__header) {
  border-bottom: 1px solid #e8e8e8;
  padding: 20px 24px;
}

.featured-product-dialog :deep(.el-dialog__body) {
  padding: 24px;
  max-height: 70vh;
  overflow-y: auto;
}

.lang-tabs {
  margin-bottom: 20px;
}

.lang-tabs :deep(.el-tabs__item) {
  font-weight: 500;
  font-size: 15px;
}

/* 媒体类型选择 */
.media-url-item :deep(.el-radio.is-bordered) {
  margin: 0 8px 12px 0;
  padding: 10px 16px;
  border-radius: 8px;
  transition: all 0.3s;
}

.media-url-item :deep(.el-radio.is-bordered:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.media-url-item :deep(.el-radio.is-bordered.is-checked) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-color: #667eea;
}

.media-url-item :deep(.el-radio.is-bordered.is-checked .el-radio__label) {
  color: #fff;
}

/* 上传区域 */
.upload-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.media-uploader {
  width: 100%;
}

.media-uploader :deep(.el-upload) {
  width: 100%;
}

.media-uploader :deep(.el-upload-list) {
  margin-top: 12px;
}

.url-input-fallback {
  margin-top: 12px;
}

/* 链接输入区域 */
.link-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 帮助折叠面板 */
.help-collapse {
  margin-top: 12px;
  border: none;
}

.help-collapse :deep(.el-collapse-item__header) {
  background: #f5f7fa;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 500;
  color: #409eff;
}

.help-content {
  padding: 16px;
  background: #fafbfc;
  border-radius: 8px;
  line-height: 1.8;
}

.help-content p {
  margin: 8px 0;
  color: #666;
}

.help-content code {
  background: #fff;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #e8e8e8;
  font-size: 12px;
  color: #333;
  font-family: 'Consolas', 'Monaco', monospace;
}

.help-content .mt-2 {
  margin-top: 8px;
}

.help-content .mt-3 {
  margin-top: 16px;
}

/* 媒体预览 */
.media-preview-box {
  border: 2px dashed #d9d9d9;
  border-radius: 12px;
  padding: 16px;
  background: #fafafa;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-video iframe,
.preview-video video {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.preview-image {
  max-width: 100%;
  max-height: 400px;
  overflow: hidden;
  border-radius: 8px;
}

.preview-image img {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.preview-link {
  font-size: 16px;
}

/* 缩略图预览 */
.thumbnail-preview {
  margin-top: 12px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 8px;
  background: #fafafa;
  display: inline-block;
}

.thumbnail-preview img {
  max-width: 300px;
  max-height: 200px;
  object-fit: contain;
  border-radius: 4px;
}

/* 对话框底部 */
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.dialog-footer .el-button {
  min-width: 120px;
}

/* 分段标题 */
:deep(.el-divider__text) {
  background: #fff;
  padding: 0 16px;
  font-weight: 600;
  color: #409eff;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .featured-product-dialog :deep(.el-dialog) {
    width: 95% !important;
  }
  
  .media-url-item :deep(.el-radio.is-bordered) {
    width: 100%;
    margin-right: 0;
  }
}

/* ========== 朦胧效果控制样式 ========== */
.overlay-control {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.overlay-preview {
  margin-top: 20px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 12px;
}

.preview-box {
  width: 100%;
  height: 120px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: 600;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  margin-bottom: 12px;
  transition: background 0.3s ease;
}

.opacity-tips {
  margin-bottom: 12px;
}

.opacity-tips .el-text {
  display: flex;
  align-items: center;
  gap: 6px;
}

.opacity-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.opacity-suggestions .el-tag {
  transition: all 0.3s;
}

.opacity-suggestions .el-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

/* ========== RGB颜色控制样式 ========== */
.color-control {
  width: 100%;
}

.color-picker-row {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.rgb-controls {
  margin-bottom: 16px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
}

.rgb-slider {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.rgb-slider:last-child {
  margin-bottom: 0;
}

.rgb-label {
  font-weight: 600;
  font-size: 16px;
  width: 30px;
  text-align: center;
}

.color-presets {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 8px;
}

.color-presets .el-tag {
  transition: all 0.3s;
  border: 1px solid rgba(255,255,255,0.3);
}

.color-presets .el-tag:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

/* ========== 图片上传样式 ========== */
.image-uploader {
  width: 100%;
}

:deep(.el-upload-dragger) {
  width: 100%;
  padding: 40px;
}

.el-icon--upload {
  font-size: 67px;
  color: #409eff;
  margin-bottom: 16px;
}

.el-upload__text {
  color: #606266;
  font-size: 14px;
}

.el-upload__text em {
  color: #409eff;
  font-style: normal;
}

.el-upload__tip {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}

.thumbnail-preview {
  margin-top: 16px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  border: 1px dashed #d9d9d9;
  position: relative;
  text-align: center;
}

.thumbnail-preview img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 4px;
  display: block;
  margin: 0 auto 12px;
}

.thumbnail-preview .remove-btn {
  width: 100%;
}

.banner-image-preview {
  margin-top: 16px;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
  border: 1px dashed #d9d9d9;
  position: relative;
  text-align: center;
}

.banner-image-preview img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 4px;
  display: block;
  margin: 0 auto 12px;
}

.banner-image-preview .remove-btn {
  width: 100%;
}


</style>
