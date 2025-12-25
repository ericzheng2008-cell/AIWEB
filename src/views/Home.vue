<template>
  <div class="home">
    <Header />
    
    <!-- 主Banner -->
    <section class="hero-banner">
      <el-carousel 
        :height="bannerHeight + 'px'" 
        :interval="bannerAutoplay ? 5000 : 0" 
        :autoplay="bannerAutoplay"
        arrow="always"
        indicator-position="outside">
        <el-carousel-item v-for="(banner, index) in banners" :key="index">
          <div class="banner-item" :style="{ backgroundImage: `url(${banner.image})`, width: bannerWidth + '%' }">
            <div class="banner-overlay" :style="{ 
              background: banner.overlayColor 
                ? `linear-gradient(135deg, rgba(${banner.overlayColor.r}, ${banner.overlayColor.g}, ${banner.overlayColor.b}, ${banner.overlayOpacity || 0.85}) 0%, rgba(${Math.floor(banner.overlayColor.r * 0.5)}, ${Math.floor(banner.overlayColor.g * 0.5)}, ${Math.floor(banner.overlayColor.b * 0.5)}, ${(banner.overlayOpacity || 0.85) - 0.15}) 100%)`
                : `linear-gradient(135deg, rgba(0, 40, 80, ${banner.overlayOpacity || 0.85}) 0%, rgba(0, 20, 40, ${(banner.overlayOpacity || 0.85) - 0.15}) 100%)` 
            }"></div>
            <div class="banner-content">
              <h1>{{ banner.title }}</h1>
              <p class="subtitle">{{ banner.subtitle }}</p>
              <div class="banner-buttons">
                <el-button type="primary" size="large" @click="handleBannerClick(banner)">
                  {{ banner.buttonText }}
                </el-button>
                <el-button size="large" plain @click="goToContact">联系我们</el-button>
              </div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </section>

    <!-- 明星产品展示 -->
    <section v-if="featuredProducts.length > 0" class="section featured-products-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">明星产品 / Featured Products</h2>
          <p class="section-desc">精选热销产品，为您提供卓越的工业解决方案</p>
        </div>
        <div class="featured-products-grid">
          <div v-for="product in featuredProducts" :key="product.id" class="featured-product-card">
            <!-- 返回主页按钮 -->
            <div class="product-back-home">
              <el-button type="info" size="small" plain @click="backToHome">
                <el-icon><HomeFilled /></el-icon>
                返回主页
              </el-button>
            </div>
            
            <!-- 视频媒体 (兼容旧格式video和新格式video-file/video-link) -->
            <div v-if="isVideoType(product.mediaType)" class="product-media">
              <!-- 视频链接: YouTube, Vimeo等 -->
              <iframe 
                v-if="product.mediaType === 'video-link' || product.mediaUrl.includes('youtube') || product.mediaUrl.includes('youtu.be') || product.mediaUrl.includes('vimeo') || product.mediaUrl.includes('qq.com')"
                :src="product.mediaUrl"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                class="product-video">
              </iframe>
              <!-- 视频文件: MP4等 -->
              <video 
                v-else
                :src="product.mediaUrl"
                controls
                :poster="product.thumbnailUrl"
                class="product-video">
                您的浏览器不支持视频播放
              </video>
            </div>
            
            <!-- 网页链接 -->
            <div v-else-if="product.mediaType === 'web-link'" class="product-media product-web-wrapper">
              <iframe 
                :src="product.mediaUrl"
                frameborder="0"
                class="product-web-frame">
              </iframe>
              <div class="web-overlay" @click="openExternalLink(product.mediaUrl)">
                <el-icon><Connection /></el-icon>
                <span>点击访问网页</span>
              </div>
            </div>
            
            <!-- 图片或GIF媒体 (兼容旧格式和新格式) -->
            <div v-else class="product-media product-image-wrapper">
              <img 
                :src="product.thumbnailUrl || product.mediaUrl" 
                :alt="product.title"
                class="product-image"
                :class="{ 'animated-image': isAnimatedType(product.mediaType) }"
                @click="goToProductLink(product.link)"
              />
            </div>
            
            <div class="product-info">
              <h3>{{ product.title }}</h3>
              <p>{{ product.description }}</p>
              <el-button type="primary" @click="goToProductLink(product.link)" v-if="product.link">
                <el-icon><View /></el-icon>
                了解详情
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 产品系列 -->
    <section class="section product-series">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">我们的产品和服务 / Products & Services</h2>
          <p class="section-desc">专业的工业自动化设备与智能制造解决方案</p>
        </div>
        <div class="series-grid" ref="seriesGridRef">
          <div v-for="series in productSeries" :key="series.id" 
               :data-id="series.id"
               class="series-card"
               :class="{ 'draggable-enabled': isAdmin }">
            <div v-if="isAdmin" class="drag-handle" title="拖拽调整顺序">
              <el-icon><Rank /></el-icon>
            </div>
            <div class="series-content" 
                 @click="goToProducts(series)"
                 @touchend="goToProducts(series)">
              <div class="series-image">
                <img :src="series.image" :alt="series.name" />
              </div>
              <div class="series-info">
                <h3>{{ series.name }}</h3>
                <p>{{ series.description }}</p>
                <div class="series-link">
                  查看详情 <el-icon><ArrowRight /></el-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 🆕 核心智能体双卡片并排布局 -->
    <section class="section core-agents-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">🌟 核心智能体平台 / Core AI Platforms</h2>
          <p class="section-desc">企业级智能体与国际营销中台双引擎驱动</p>
        </div>
        
        <div class="core-agents-grid">
          <!-- 左侧: 明升企业智能体 -->
          <div class="core-agent-card mingsheng-agent" 
               @click="handleCardClick('agents', $event)"
               @touchstart="handleCardClick('agents', $event)"
               style="cursor: pointer; -webkit-tap-highlight-color: rgba(0,0,0,0.1); touch-action: manipulation;">
            <div class="card-corner-badge">企业智能体</div>
            <!-- 返回主页按钮 -->
            <div class="card-back-home">
              <el-button type="info" size="small" plain @click.stop="backToHome">
                <el-icon><HomeFilled /></el-icon>
                返回主页
              </el-button>
            </div>
            
            <div class="agent-card-header">
              <div class="agent-icon">
                <el-icon :size="56"><Cpu /></el-icon>
              </div>
              <div class="agent-title-group">
                <h3>明升企业智能体</h3>
                <p class="agent-subtitle">MingSheng AI Agents</p>
                <div class="agent-stats-mini">
                  <span class="stat-badge">25个智能体</span>
                  <span class="stat-badge">7大领域</span>
                </div>
              </div>
            </div>
            
            <div class="agent-highlights">
              <div class="highlight-row">
                <el-icon color="#409EFF"><Tools /></el-icon>
                <span>工业制造智能体群</span>
              </div>
              <div class="highlight-row">
                <el-icon color="#67C23A"><Management /></el-icon>
                <span>设备全生命周期管理</span>
              </div>
              <div class="highlight-row">
                <el-icon color="#E6A23C"><DataLine /></el-icon>
                <span>拧紧数据智能分析</span>
              </div>
              <div class="highlight-row">
                <el-icon color="#F56C6C"><Connection /></el-icon>
                <span>工作流自动编排</span>
              </div>
            </div>
            
            <div class="agent-features-compact">
              <div class="compact-feature">
                <span class="feature-icon">🎯</span>
                <span class="feature-text">AI工单管理</span>
              </div>
              <div class="compact-feature">
                <span class="feature-icon">📊</span>
                <span class="feature-text">智能数据分析</span>
              </div>
              <div class="compact-feature">
                <span class="feature-icon">🔧</span>
                <span class="feature-text">工艺优化建议</span>
              </div>
              <div class="compact-feature">
                <span class="feature-icon">📈</span>
                <span class="feature-text">性能实时监控</span>
              </div>
            </div>
            
            <el-button type="primary" size="large" class="agent-card-action" @click.stop="handleCardClick('agents', $event)">
              <el-icon><Collection /></el-icon>
              查看全部智能体
            </el-button>
          </div>
          
          <!-- 右侧: AI国际营销中台 -->
          <div class="core-agent-card marketing-hub" 
               @click="handleCardClick('marketing', $event)"
               @touchstart="handleCardClick('marketing', $event)"
               style="cursor: pointer; -webkit-tap-highlight-color: rgba(0,0,0,0.1); touch-action: manipulation;">
            <div class="card-corner-badge marketing">国际营销</div>
            <!-- 返回主页按钮 -->
            <div class="card-back-home">
              <el-button type="info" size="small" plain @click.stop="backToHome">
                <el-icon><HomeFilled /></el-icon>
                返回主页
              </el-button>
            </div>
            
            <div class="agent-card-header">
              <div class="agent-icon marketing">
                <el-icon :size="56"><TrendCharts /></el-icon>
              </div>
              <div class="agent-title-group">
                <h3>AI国际营销中台</h3>
                <p class="agent-subtitle">AI Marketing Hub</p>
                <div class="agent-stats-mini">
                  <span class="stat-badge success">7种语言</span>
                  <span class="stat-badge success">ROI 385% <span>↑</span></span>
                </div>
              </div>
            </div>
            
            <div class="agent-highlights">
              <div class="highlight-row">
                <el-icon color="#409EFF"><Search /></el-icon>
                <span>AI产品智能选型</span>
              </div>
              <div class="highlight-row">
                <el-icon color="#67C23A"><Message /></el-icon>
                <span>多语言邮件营销</span>
              </div>
              <div class="highlight-row">
                <el-icon color="#E6A23C"><DataAnalysis /></el-icon>
                <span>客户行为分析</span>
              </div>
              <div class="highlight-row">
                <el-icon color="#F56C6C"><MagicStick /></el-icon>
                <span>AI营销预测</span>
              </div>
            </div>
            
            <div class="marketing-metrics-compact">
              <div class="metric-compact primary-metric">
                <div class="metric-number">385% <span>↑</span></div>
                <div class="metric-label">营销ROI提升</div>
              </div>
              <div class="metric-compact">
                <div class="metric-number">20+</div>
                <div class="metric-label">系统集成</div>
              </div>
              <div class="metric-compact">
                <div class="metric-number">7</div>
                <div class="metric-label">全球语言</div>
              </div>
            </div>
            
            <div class="success-case-mini">
              <el-icon color="#67C23A"><Trophy /></el-icon>
              <span class="case-text">某汽车企业：线索转化 <strong>+68%</strong>，订单增长 <strong>2.3倍</strong></span>
            </div>
            
            <el-button type="success" size="large" class="agent-card-action" @click.stop="handleCardClick('marketing', $event)">
              <el-icon><Promotion /></el-icon>
              立即体验营销中台
            </el-button>
          </div>
        </div>
      </div>
    </section>

    <!-- 🆕 AI工作平台 - 单卡片集成 -->
    <section class="section workflow-platforms-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">🤖 AI工作平台 / AI Work Platforms</h2>
          <p class="section-desc">连接顶尖AI工作平台，一站式管理企业智能化流程</p>
        </div>
        
        <!-- 单个大卡片容器 -->
        <div class="workflow-hub-card" 
             @click="handleCardClick('workflow', $event)"
             @touchstart="handleCardClick('workflow', $event)"
             style="cursor: pointer; -webkit-tap-highlight-color: rgba(0,0,0,0.1); touch-action: manipulation;">
          <div class="hub-card-header">
            <div class="hub-icon">
              <el-icon :size="40"><Operation /></el-icon>
            </div>
            <div class="hub-title">
              <h3>AI工作平台集</h3>
              <p>30个顶尖平台 · 企业级流程 · 智能编排 · 一站式管理</p>
            </div>
          </div>
          
          <div class="hub-card-stats">
            <div class="mini-stat">
              <span class="stat-icon">🤖</span>
              <span class="stat-text">30个平台</span>
            </div>
            <div class="mini-stat">
              <span class="stat-icon">🏢</span>
              <span class="stat-text">企业级</span>
            </div>
            <div class="mini-stat">
              <span class="stat-icon">🌐</span>
              <span class="stat-text">全球精选</span>
            </div>
            <div class="mini-stat">
              <span class="stat-icon">⚡</span>
              <span class="stat-text">智能编排</span>
            </div>
          </div>
          
          <div class="hub-card-features">
            <div class="feature-tag">🛠️ AI工具集</div>
            <div class="feature-tag">🏢 UniEAP Workflow</div>
            <div class="feature-tag">⭐ 金蝶云·星空</div>
            <div class="feature-tag">🚀 Coze</div>
            <div class="feature-tag">🔧 Dify</div>
            <div class="feature-tag">📱 钉钉智能伙伴</div>
            <div class="feature-tag">🚀 飞书Lark</div>
            <div class="feature-tag">🧩 腾讯元器</div>
            <div class="feature-tag">... +22个平台</div>
          </div>
          
          <div class="hub-card-footer">
            <el-button type="primary" size="large" @click.stop="handleCardClick('workflow', $event)">
              <el-icon><Connection /></el-icon>
              查看所有平台
            </el-button>
            <el-button size="large" plain @click.stop="() => {}">
              <el-icon><Document /></el-icon>
              了解更多
            </el-button>
          </div>
        </div>
      </div>
    </section>

    <!-- 🆕 制造企业AI工具平台弹窗 -->
    <el-dialog
      v-model="showWorkflowPlatforms"
      title="🏭 制造企业AI工具全景图（100+ 工具 · 9大场景）"
      width="95%"
      :close-on-click-modal="true"
      top="3vh"
      class="manufacturing-tools-dialog">
      
      <!-- 返回主页按钮 -->
      <div class="dialog-back-home">
        <el-button type="primary" size="small" @click="backToHome">
          <el-icon><HomeFilled /></el-icon>
          返回主页
        </el-button>
      </div>
      
      <!-- 工具平台容器 -->
      <div class="manufacturing-tools-container">
        
        <!-- 顶部导航栏：搜索 + 筛选 -->
        <div class="tools-toolbar">
          <div class="search-section">
            <el-input 
              v-model="toolSearchKeyword"
              placeholder="搜索工具名称、用途、标签..."
              :prefix-icon="Search"
              clearable
              size="large"
              style="width: 400px" />
          </div>
          
          <div class="filter-section">
            <el-select v-model="selectedCategory" placeholder="工作场景" size="large" style="width: 180px">
              <el-option label="全部场景" value="all" />
              <el-option v-for="cat in platformCategories" :key="cat.id" 
                :label="cat.name" :value="cat.id" />
            </el-select>
            
            <el-select v-model="selectedCostLevel" placeholder="成本等级" size="large" style="width: 150px">
              <el-option label="全部等级" value="all" />
              <el-option label="低成本" value="低" />
              <el-option label="中等成本" value="中" />
              <el-option label="高成本" value="高" />
            </el-select>
            
            <el-select v-model="selectedPrivatization" placeholder="私有化" size="large" style="width: 150px">
              <el-option label="全部" value="all" />
              <el-option label="支持私有化" value="yes" />
              <el-option label="仅云端" value="no" />
            </el-select>
          </div>
        </div>
        
        <!-- 优先级推荐看板 -->
        <div class="priority-board">
          <div class="board-header">
            <h3><el-icon><Trophy /></el-icon> 制造企业AI工具落地优先级推荐</h3>
            <p>基于ROI、实施难度、行业实践的综合评估</p>
          </div>
          <div class="priority-grid">
            <div v-for="item in toolPriorityRecommendation" :key="item.priority" class="priority-item">
              <div class="priority-badge">P{{ item.priority }}</div>
              <div class="priority-content">
                <h4>{{ item.category }}</h4>
                <div class="priority-tools">
                  <el-tag v-for="tool in item.tools" :key="tool" size="small" type="info">{{ tool }}</el-tag>
                </div>
                <p class="priority-reason"><el-icon><InfoFilled /></el-icon> {{ item.reason }}</p>
                <div class="priority-meta">
                  <span>💰 {{ item.estimatedROI }}</span>
                  <span>⏱️ {{ item.implementation }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 分类工具展示 -->
        <div class="tools-categories">
          <div v-for="category in platformCategories" :key="category.id" class="category-section">
            <!-- 分类头部 -->
            <div class="category-header" @click="toggleCategory(category.id)">
              <div class="category-title">
                <span class="category-icon">{{ category.icon }}</span>
                <h3>{{ category.name }}</h3>
                <el-tag size="small" type="info">
                  {{ getToolsByCategory(category.id).length }}个工具
                </el-tag>
              </div>
              <el-icon class="toggle-icon" :class="{ 'is-expanded': expandedCategories.includes(category.id) }">
                <ArrowDown />
              </el-icon>
            </div>
            
            <!-- 分类内容（折叠区域） -->
            <el-collapse-transition>
              <div v-show="expandedCategories.includes(category.id)" class="category-content">
                
                <!-- 子分类展示 -->
                <div v-for="subCat in category.subCategories" :key="subCat.id" class="sub-category-section">
                  <h4 class="sub-category-title">
                    <span>{{ subCat.icon }}</span>
                    {{ subCat.name }}
                    <el-tag size="small">{{ getToolsByCategory(category.id, subCat.id).length }}</el-tag>
                  </h4>
                  
                  <!-- 工具卡片网格 -->
                  <div class="tools-grid">
                    <div v-for="tool in getToolsByCategory(category.id, subCat.id)" :key="tool.id" 
                         class="tool-card"
                         @click="viewToolDetail(tool)">
                      <div class="tool-header">
                        <div class="tool-icon">{{ tool.icon }}</div>
                        <div class="tool-meta">
                          <h4>{{ tool.name }}</h4>
                          <p>{{ tool.description }}</p>
                        </div>
                      </div>
                      
                      <div class="tool-details">
                        <div class="detail-row">
                          <span class="label">用途：</span>
                          <span class="value">{{ tool.purpose }}</span>
                        </div>
                        <div class="detail-row">
                          <span class="label">场景：</span>
                          <span class="value">{{ tool.scenario }}</span>
                        </div>
                        <div class="detail-row">
                          <span class="label">规模：</span>
                          <el-tag size="small" type="success">{{ tool.companySize }}</el-tag>
                          <el-tag size="small" :type="tool.costLevel === '高' ? 'danger' : tool.costLevel === '中' ? 'warning' : 'success'">
                            {{ tool.costLevel }}成本
                          </el-tag>
                          <el-tag v-if="tool.privatization === '是'" size="small" type="info">私有化</el-tag>
                        </div>
                      </div>
                      
                      <div class="tool-tags">
                        <el-tag v-for="tag in tool.tags.slice(0, 3)" :key="tag" size="small">{{ tag }}</el-tag>
                      </div>
                      
                      <div class="tool-footer">
                        <el-button type="primary" size="small" plain @click.stop="openToolLink(tool.url)">
                          <el-icon><Connection /></el-icon>
                          {{ tool.url === '#' ? '查看方案' : '访问官网' }}
                        </el-button>
                        <el-button size="small" @click.stop="viewToolDetail(tool)">
                          查看详情
                        </el-button>
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </el-collapse-transition>
          </div>
        </div>
        
      </div>
    </el-dialog>
    
    <!-- 工具详情弹窗 -->
    <el-dialog
      v-model="showToolDetail"
      :title="selectedTool?.name || '工具详情'"
      width="800px"
      class="tool-detail-dialog">
      <div v-if="selectedTool" class="tool-detail-content">
        <div class="detail-header">
          <span class="detail-icon">{{ selectedTool.icon }}</span>
          <div>
            <h2>{{ selectedTool.name }}</h2>
            <p class="detail-desc">{{ selectedTool.description }}</p>
            <div class="detail-tags">
              <el-tag v-for="tag in selectedTool.tags" :key="tag" size="small">{{ tag }}</el-tag>
            </div>
          </div>
        </div>
        
        <el-divider />
        
        <div class="detail-sections">
          <div class="detail-section">
            <h4><el-icon><Tools /></el-icon> 核心信息</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">工具定位：</span>
                <span>{{ selectedTool.purpose }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">典型产品：</span>
                <span>{{ selectedTool.typicalProduct }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">适用场景：</span>
                <span>{{ selectedTool.scenario }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">目标行业：</span>
                <span>{{ selectedTool.targetIndustry }}</span>
              </div>
            </div>
          </div>
          
          <div class="detail-section">
            <h4><el-icon><DataAnalysis /></el-icon> 技术与成本</h4>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">企业规模：</span>
                <el-tag type="success">{{ selectedTool.companySize }}</el-tag>
              </div>
              <div class="info-item">
                <span class="info-label">私有化：</span>
                <el-tag :type="selectedTool.privatization === '是' ? 'success' : 'info'">
                  {{ selectedTool.privatization }}
                </el-tag>
              </div>
              <div class="info-item">
                <span class="info-label">API支持：</span>
                <el-tag :type="selectedTool.apiSupport === '是' ? 'success' : 'info'">
                  {{ selectedTool.apiSupport }}
                </el-tag>
              </div>
              <div class="info-item">
                <span class="info-label">成本等级：</span>
                <el-tag :type="selectedTool.costLevel === '高' ? 'danger' : selectedTool.costLevel === '中' ? 'warning' : 'success'">
                  {{ selectedTool.costLevel }}
                </el-tag>
              </div>
            </div>
          </div>
          
          <div class="detail-section">
            <h4><el-icon><Promotion /></el-icon> 优势与风险</h4>
            <div class="pros-cons">
              <div class="pros">
                <h5>✅ 主要优点</h5>
                <p>{{ selectedTool.advantage }}</p>
              </div>
              <div class="cons">
                <h5><el-icon><Warning /></el-icon> 风险点</h5>
                <p>{{ selectedTool.risk }}</p>
              </div>
            </div>
          </div>
          
          <div class="detail-section">
            <h4><el-icon><Connection /></el-icon> 替代方案</h4>
            <p>{{ selectedTool.alternative }}</p>
          </div>
          
          <div class="detail-section priority-section">
            <h4><el-icon><Trophy /></el-icon> 推荐优先级与落地建议</h4>
            <el-tag :type="selectedTool.priority === '高' ? 'success' : selectedTool.priority === '中' ? 'warning' : 'info'" size="large">
              {{ selectedTool.priority }}优先级
            </el-tag>
            <div class="config-suggestion">
              <h5>💡 落地建议：</h5>
              <p>{{ selectedTool.configSuggestion }}</p>
            </div>
          </div>
        </div>
        
        <el-divider />
        
        <div class="detail-actions">
          <el-button type="primary" size="large" @click="openToolLink(selectedTool.url)">
            <el-icon><Connection /></el-icon>
            {{ selectedTool.url === '#' ? '联系咨询' : '访问官网' }}
          </el-button>
          <el-button size="large" @click="showToolDetail = false">关闭</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 应用解决方案 -->
    <section class="section solutions-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">应用案例 / Application Cases</h2>
          <p class="section-desc">为不同行业提供智能制造与工业自动化应用方案</p>
        </div>
        <div class="solutions-grid">
          <div v-for="solution in solutions" :key="solution.id" 
               class="solution-card"
               @click="goToSolution(solution)">
            <div class="solution-icon">
              <el-icon :size="48"><component :is="solution.icon" /></el-icon>
            </div>
            <h3>{{ solution.name }}</h3>
            <p>{{ solution.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 关于明升伟业 -->
    <section class="section about-section">
      <div class="container">
        <div class="about-content">
          <div class="about-text">
            <h2>{{ aboutCompanyData.title[locale] || aboutCompanyData.title['zh-CN'] }}</h2>
            <p class="about-intro">
              {{ aboutCompanyData.intro[locale] || aboutCompanyData.intro['zh-CN'] }}
            </p>
            <div class="certifications">
              <div v-for="(cert, index) in aboutCompanyData.certifications" :key="index" class="cert-item">
                <el-icon :size="32" color="#1890ff"><Checked /></el-icon>
                <span>{{ cert.name[locale] || cert.name['zh-CN'] }}</span>
              </div>
            </div>
            <el-button type="primary" size="large" @click="goToAbout">
              {{ aboutCompanyData.buttonText[locale] || aboutCompanyData.buttonText['zh-CN'] }}
            </el-button>
          </div>
          <div class="about-image">
            <img :src="aboutCompanyData.image" alt="公司厂房" />
          </div>
        </div>
      </div>
    </section>

    <!-- 企业优势 -->
    <section class="section advantages-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            {{ homeContent.advantages?.title?.[locale] || homeContent.advantages?.title?.['zh-CN'] || '我们的优势' }}
          </h2>
          <p class="section-desc">
            {{ homeContent.advantages?.subtitle?.[locale] || homeContent.advantages?.subtitle?.['zh-CN'] || '值得信赖的工业合作伙伴' }}
          </p>
        </div>
        <div class="advantage-grid">
          <div v-for="(adv, index) in advantages" :key="index" class="advantage-item">
            <div class="advantage-icon">
              <el-icon :size="48" color="#1890ff">
                <component :is="adv.icon" />
              </el-icon>
            </div>
            <h3>{{ adv.title[locale] || adv.title['zh-CN'] }}</h3>
            <p>{{ adv.description[locale] || adv.description['zh-CN'] }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 📥 资料下载与索取报价 -->
    <MaterialDownload />

    <!-- 服务网络 -->
    <section class="section service-network">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            {{ homeContent.serviceNetwork?.title?.[locale] || homeContent.serviceNetwork?.title?.['zh-CN'] || '服务网络' }}
          </h2>
          <p class="section-desc">
            {{ homeContent.serviceNetwork?.subtitle?.[locale] || homeContent.serviceNetwork?.subtitle?.['zh-CN'] || '全国多地设有办事处，提供优质的客户服务' }}
          </p>
        </div>
        <div class="offices-grid">
          <div v-for="(office, index) in offices" :key="index" class="office-item">
            <el-icon :size="32" color="#1890ff"><Location /></el-icon>
            <h4>{{ office.city }}</h4>
            <p>{{ office.region }}</p>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'
import { useCmsStore } from '../store/cms'
import { useCmsAdvancedStore } from '../store/cmsAdvanced'
import { usePageContentStore } from '../store/pageContent'
import { useProductsServicesStore } from '../store/productsServices'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import MaterialDownload from '../components/MaterialDownload.vue'
import Sortable from 'sortablejs'
import { 
  Search, Message, DataAnalysis, MagicStick,
  TrendCharts, Cpu, Tools, Management, DataLine, Connection,
  Collection, Promotion, Trophy, Document, Location, Operation, ArrowDown, HomeFilled,
  InfoFilled, Warning
} from '@element-plus/icons-vue'
import { manufacturingTools, toolCategories, priorityRecommendation } from '../data/manufacturingTools'

const router = useRouter()
const { t, locale } = useI18n()
const cmsStore = useCmsStore()
const cmsAdvancedStore = useCmsAdvancedStore()
const pageContentStore = usePageContentStore()
const productsStore = useProductsServicesStore()

// 拖拽元素引用
const seriesGridRef = ref(null)

// 工作流平台弹窗显示状态
const showWorkflowPlatforms = ref(false)

// 检查是否为管理员
const isAdmin = computed(() => {
  return !!localStorage.getItem('adminToken')
})

// 从store获取首页板块数据
const homeContent = computed(() => pageContentStore.pages.home || {})

// Banner设置 - 从CMS读取
const bannerWidth = computed(() => homeContent.value.bannerSettings?.width || 100)
const bannerHeight = computed(() => homeContent.value.bannerSettings?.height || 650)
const bannerAutoplay = computed(() => homeContent.value.bannerSettings?.autoplay !== false)

// 从CMS Store获取Banner数据
const banners = computed(() => {
  return cmsStore.homeBanners
    .filter(b => b.status === 'active')
    .sort((a, b) => a.order - b.order)
    .map(banner => ({
      id: banner.id,
      title: banner.title[locale.value] || banner.title['zh-CN'],
      subtitle: banner.subtitle[locale.value] || banner.subtitle['zh-CN'],
      image: banner.image,
      buttonText: banner.buttonText[locale.value] || banner.buttonText['zh-CN'],
      buttonAction: banner.buttonAction
    }))
})

// 从store获取产品大类（1级分类）并添加工具选型和工单系统
const productSeries = computed(() => {
  // 获取保存的排序
  const savedOrder = JSON.parse(localStorage.getItem('homeProductSeriesOrder') || '[]')
  
  const categories = productsStore.visibleLevel1Categories.map(category => ({
    id: category.id,
    name: category.name[locale.value] || category.name['zh-CN'],
    description: category.description[locale.value] || category.description['zh-CN'],
    image: category.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600',
    type: 'category'
  }))
  
  // 添加工具选型智能体到产品服务
  const additionalServices = [
    {
      id: 'tool-selector',
      name: '拧紧工具选型',
      description: '智能分析工艺需求，推荐最优拧紧工具方案',
      image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600',
      type: 'service',
      path: '/tool-selector'
    }
  ]
  
  const allSeries = [...categories, ...additionalServices]
  
  // 如果有保存的排序，按照保存的顺序排列
  if (savedOrder.length > 0) {
    return allSeries.sort((a, b) => {
      const indexA = savedOrder.indexOf(String(a.id))
      const indexB = savedOrder.indexOf(String(b.id))
      if (indexA === -1 && indexB === -1) return 0
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      return indexA - indexB
    })
  }
  
  return allSeries
})

// 获取明星产品展示
const featuredProducts = computed(() => {
  return cmsStore.featuredProducts
    .filter(p => p.status === 'active')
    .sort((a, b) => a.order - b.order)
    .map(product => ({
      id: product.id,
      title: product.title[locale.value] || product.title['zh-CN'],
      description: product.description[locale.value] || product.description['zh-CN'],
      mediaType: product.mediaType, // video / image / gif
      mediaUrl: product.mediaUrl,
      thumbnailUrl: product.thumbnailUrl,
      link: product.link
    }))
})

const solutions = ref([
  { id: 1, name: '汽车制造', description: '为汽车制造企业提供全套工具装配解决方案', icon: 'Van' },
  { id: 2, name: '智能制造', description: '配套智能制造领域的工具应用与系统集成', icon: 'Monitor' },
  { id: 3, name: '航空航天', description: '高精度工具应用于航空航天精密装配', icon: 'Promotion' },
  { id: 4, name: '能源设备', description: '能源设备制造与维护工具解决方案', icon: 'HotWater' }
])

// 🆕 制造企业AI工具数据（从外部导入）- 已删除旧的内联数据

// 🆕 制造企业AI工具数据（从外部导入）
const workflowPlatforms = ref(manufacturingTools)
const platformCategories = ref(toolCategories)
const toolPriorityRecommendation = ref(priorityRecommendation)

// 分类折叠状态（默认全部展开）
const expandedCategories = ref(toolCategories.map(cat => cat.id))

// 当前查看的工具详情
const selectedTool = ref(null)
const showToolDetail = ref(false)

// 搜索和筛选
const toolSearchKeyword = ref('')
const selectedCategory = ref('all')
const selectedCostLevel = ref('all')
const selectedPrivatization = ref('all')

// 切换分类折叠
const toggleCategory = (categoryId) => {
  const index = expandedCategories.value.indexOf(categoryId)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(categoryId)
  }
}

// 根据分类和子分类获取工具
const getToolsByCategory = (categoryId, subCategoryId = null) => {
  let tools = workflowPlatforms.value.filter(t => t.category === categoryId)
  if (subCategoryId) {
    tools = tools.filter(t => t.subCategory === subCategoryId)
  }
  return tools
}

// 搜索和筛选工具
const filteredTools = computed(() => {
  let tools = workflowPlatforms.value
  
  // 按分类筛选
  if (selectedCategory.value !== 'all') {
    tools = tools.filter(t => t.category === selectedCategory.value)
  }
  
  // 按成本等级筛选
  if (selectedCostLevel.value !== 'all') {
    tools = tools.filter(t => t.costLevel === selectedCostLevel.value)
  }
  
  // 按私有化筛选
  if (selectedPrivatization.value !== 'all') {
    const isPrivate = selectedPrivatization.value === 'yes'
    tools = tools.filter(t => (t.privatization === '是') === isPrivate)
  }
  
  // 按关键词搜索
  if (toolSearchKeyword.value) {
    const keyword = toolSearchKeyword.value.toLowerCase()
    tools = tools.filter(t => 
      t.name.toLowerCase().includes(keyword) ||
      t.description.toLowerCase().includes(keyword) ||
      t.tags.some(tag => tag.toLowerCase().includes(keyword)) ||
      t.purpose.toLowerCase().includes(keyword)
    )
  }
  
  return tools
})

// 查看工具详情
const viewToolDetail = (tool) => {
  selectedTool.value = tool
  showToolDetail.value = true
}

// 打开工具链接
const openToolLink = (url) => {
  if (url && url !== '#') {
    window.open(url, '_blank')
  } else {
    ElMessage.info('该工具为企业自建方案，无外部链接')
  }
}


// AI智能体数据（移除工具选型和工单管理）
const aiAgents = ref([
  { 
    id: 1, 
    name: '企业知识库', 
    description: 'AI企业知识管理系统 - 训练AI助手，智能问答，业务知识库分类管理与检索', 
    icon: 'FolderOpened',
    tags: ['知识管理', '智能问答', 'AI训练'],
    path: '/ai-knowledge',
    badge: '新上线',
    category: 'knowledge'
  },
  { 
    id: 2, 
    name: '数字监控驾驶舱', 
    description: '可视化数字监控中心，实时监控设备状态、维护流程、零配件订货状态', 
    icon: 'DataAnalysis',
    tags: ['实时监控', '可视化数据', '智能预警'],
    path: '/equipment-dashboard',
    badge: '新功能'
  },
  { 
    id: 3, 
    name: '设备全生命周期管理', 
    description: '关键设备资产管理、ROI分析、保养预测、成本优化', 
    icon: 'Box',
    tags: ['设备档案', 'ROI分析', 'AI保养预测'],
    path: '/equipment-lifecycle'
  },
  { 
    id: 5, 
    name: '拧紧曲线对比分析', 
    description: '专业的拧紧曲线分析工具，支持多曲线对比、智能诊断', 
    icon: 'TrendCharts',
    tags: ['曲线对比', 'AI诊断', '工艺建议'],
    path: '/curve-analysis'
  },
  { 
    id: 6, 
    name: '拧紧数据采集分析', 
    description: '基于Open Protocol实时采集PF4000/PF8000控制器数据，Cpk分析+智能报警', 
    icon: 'DataAnalysis',
    tags: ['数据采集', 'Cpk分析', '异常报警'],
    path: '/tightening-data'
  },
  { 
    id: 7, 
    name: '产品技术销售小课堂', 
    description: '拧紧工具产品技术知识库，涵盖产品介绍、技术规格、应用案例', 
    icon: 'Reading',
    tags: ['产品知识', '技术规格', '应用案例'],
    path: '/tech-classroom'
  },
  { 
    id: 8, 
    name: '拧紧工艺改进与验证', 
    description: 'PSE拧紧程序参数推荐，多维度工艺条件筛选，三种控制策略分析', 
    icon: 'Setting',
    tags: ['PSE参数', '工艺验证', '策略分析'],
    path: '/process-verification',
    badge: '新功能'
  },
  { 
    id: 9, 
    name: '明升AICRM智能助手', 
    description: '轻量化智能客户关系管理系统，AI驱动商机管理、客户360°画像、半自动执行', 
    icon: 'User',
    tags: ['客户管理', 'AI预测', '商机跟进'],
    path: '/mingsheng-aicrm',
    badge: 'AI营销',
    category: 'marketing'
  },
  { 
    id: 10, 
    name: '明升AIMES助手', 
    description: 'AI MES系统 - 生产现场感知、智能排产、质量控制、设备智能运维', 
    icon: 'Setting',
    tags: ['智能制造', 'MES系统', 'AI排产'],
    path: '/mingsheng-aicrm?tab=aimes',
    badge: '新功能',
    category: 'manufacturing'
  },
  { 
    id: 11, 
    name: '明升AIFLOW', 
    description: '多部门工作流可视化管理 - 拖拽式流程设计、自定义节点、智能连接、实时协同', 
    icon: 'Operation',
    tags: ['流程管理', '可视化设计', '部门协同'],
    path: '/workflow-agent',
    badge: '新上线',
    category: 'management'
  }
])

// 关于明升伟业板块
const aboutCompanyData = computed(() => {
  return homeContent.value.aboutCompany || {
    title: { 'zh-CN': '关于明升伟业', 'en-US': 'About Mingsheng' },
    intro: { 'zh-CN': '', 'en-US': '' },
    certifications: [],
    buttonText: { 'zh-CN': '了解更多', 'en-US': 'Learn More' },
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800'
  }
})

// 我们的优势
const advantages = computed(() => {
  const data = homeContent.value.advantages
  if (data && data.items && data.items.length > 0) {
    return data.items
  }
  // 默认数据
  return [
    { 
      icon: 'Medal', 
      title: { 'zh-CN': '28年行业经验', 'en-US': '28 Years Experience' }, 
      description: { 'zh-CN': '自1996年成立，深耕工业工具领域近三十年，积累丰富实际案例', 'en-US': 'Since 1996, deep cultivation in industrial tools' } 
    },
    { 
      icon: 'Checked', 
      title: { 'zh-CN': '权威体系认证', 'en-US': 'Authoritative Certification' }, 
      description: { 'zh-CN': 'ISO9000、QS9000、IATF16949汽车制造体系认证', 'en-US': 'ISO9000, QS9000, IATF16949 certification' } 
    },
    { 
      icon: 'Box', 
      title: { 'zh-CN': '欧美高端品牌', 'en-US': 'European Brands' }, 
      description: { 'zh-CN': '专业代理欧美一线工业工具品牌，品质有保障', 'en-US': 'Professional agency for European brands' } 
    },
    { 
      icon: 'Service', 
      title: { 'zh-CN': '全国服务网络', 'en-US': 'National Service' }, 
      description: { 'zh-CN': '在华中、华南、西南多地设有办事处，提供及时服务', 'en-US': 'Offices nationwide for timely service' } 
    }
  ]
})

// 服务网络
const offices = computed(() => {
  const data = homeContent.value.serviceNetwork
  if (data && data.offices && data.offices.length > 0) {
    return data.offices.map(office => ({
      city: office.city[locale.value] || office.city['zh-CN'],
      region: office.region[locale.value] || office.region['zh-CN']
    }))
  }
  // 默认数据
  return [
    { city: '广州', region: '总部 · 珠江三角洲' },
    { city: '长沙', region: '湖南省' },
    { city: '株洲', region: '湖南省' },
    { city: '常德', region: '湖南省' },
    { city: '柳州', region: '广西省' },
    { city: '武汉', region: '湖北省' },
    { city: '宜昌', region: '湖北省' },
    { city: '杭州', region: '华中地区' },
    { city: '上海', region: '华东地区' }
  ]
})

const goToProducts = (series) => {
  // 如果是服务类型，直接跳转到对应路由
  if (series.type === 'service' && series.path) {
    router.push(series.path)
  } else {
    // 产品分类，跳转到产品与服务页面
    router.push('/products-services')
  }
}

const goToSolution = (solution) => {
  router.push({ path: '/solutions', query: { id: solution.id } })
}

const goToAbout = () => {
  router.push('/about')
}

const goToContact = () => {
  router.push('/contact')
}

const openDemoPage = () => {
  window.open('/📊_AI营销中台功能演示_2025-12-17.html', '_blank')
}

// 🆕 AI智能对话启动
const handleAIChatStart = () => {
  ElMessage({
    message: '正在启动AI营销顾问...',
    type: 'success',
    duration: 2000
  })
  setTimeout(() => {
    router.push('/ai-product-selector')
  }, 500)
}

// 🆕 打开工作流平台链接
const openPlatformLink = (url) => {
  window.open(url, '_blank')
  ElMessage.success('正在跳转到平台...')
}

// 🆕 返回主页方法
const backToHome = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  showWorkflowPlatforms.value = false
  ElMessage.success('已返回主页顶部')
}

const handleBannerClick = (banner) => {
  const action = banner.buttonAction || 'products'
  switch (action) {
    case 'about':
      router.push('/about')
      break
    case 'products':
      router.push('/products-services')
      break
    case 'solutions':
      router.push('/solutions')
      break
    case 'contact':
      router.push('/contact')
      break
    default:
      router.push('/products-services')
  }
}

const goToAgent = (agent) => {
  if (agent.path) {
    router.push(agent.path)
  } else {
    router.push(`/ai-agent/${agent.id}`)
  }
}

const goToProductLink = (link) => {
  if (link) {
    if (link.startsWith('http')) {
      // 外部链接，新窗口打开
      window.open(link, '_blank')
    } else {
      // 内部路由
      router.push(link)
    }
  }
}

// 打开外部链接
const openExternalLink = (url) => {
  window.open(url, '_blank')
}

// 🔧 统一卡片点击处理 - 兼容手机端触摸事件
const handleCardClick = (target, event) => {
  // 只阻止事件冒泡,不阻止默认行为,让click事件正常触发
  if (event) {
    event.stopPropagation()
  }
  
  console.log('🎯 卡片点击:', target, '事件类型:', event?.type)
  
  // 使用 nextTick 确保在事件处理完成后再跳转
  nextTick(() => {
    switch(target) {
      case 'agents':
        console.log('→ 跳转到智能体页面')
        router.push('/ai-agents')
        break
      case 'marketing':
        console.log('→ 跳转到营销页面')
        router.push('/ai-product-selector')
        break
      case 'workflow':
        console.log('→ 打开工作平台弹窗')
        showWorkflowPlatforms.value = true
        break
      default:
        console.warn('❌ 未知的卡片目标:', target)
    }
  })
}

// 滚动到智能体板块
const scrollToAgents = () => {
  router.push('/ai-agents')
}

// 判断是否为视频类型
const isVideoType = (mediaType) => {
  return mediaType === 'video' || mediaType === 'video-file' || mediaType === 'video-link'
}

// 判断是否为动画类型
const isAnimatedType = (mediaType) => {
  return mediaType === 'gif' || mediaType === 'gif-file' || mediaType === 'animation-link'
}

// 初始化拖拽功能（仅在管理员登录时启用）
const initDraggable = () => {
  if (!isAdmin.value || !seriesGridRef.value) {
    console.log('非管理员或元素未就绪，跳过拖拽初始化')
    return
  }
  
  console.log('✅ 管理员身份确认，启用拖拽功能')
  
  // 初始化 Sortable
  Sortable.create(seriesGridRef.value, {
    animation: 200,
    handle: '.drag-handle', // 只能通过拖拽手柄拖动
    ghostClass: 'series-card-ghost',
    chosenClass: 'series-card-chosen',
    dragClass: 'series-card-drag',
    forceFallback: true,
    fallbackTolerance: 3,
    onStart: (evt) => {
      console.log('开始拖拽卡片:', evt.item.getAttribute('data-id'))
    },
    onEnd: (evt) => {
      // 获取新的排序
      const newOrder = Array.from(seriesGridRef.value.children).map(el => el.getAttribute('data-id'))
      // 保存到 localStorage
      localStorage.setItem('homeProductSeriesOrder', JSON.stringify(newOrder))
      console.log('✅ 产品服务卡片顺序已更新:', newOrder)
      
      // 显示提示消息
      if (typeof ElMessage !== 'undefined') {
        ElMessage.success('卡片顺序已保存！刷新页面查看效果')
      }
    }
  })
}

// 组件挂载后初始化拖拽
onMounted(() => {
  // 从API加载最新数据
  cmsStore.loadFromAPI()
  
  nextTick(() => {
    initDraggable()
  })
})

</script>

<style scoped>
.home {
  min-height: 100vh;
  background: #f5f7fa;
}

/* Banner样式 */
.hero-banner {
  width: 100%;
}

.banner-item {
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 0 auto;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* 朦胧效果由内联样式控制，可在后台调整透明度 */
  transition: background 0.3s ease;
}

.banner-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: #fff;
  max-width: 1000px;
  padding: 0 20px;
}

.banner-content h1 {
  font-size: 56px;
  font-weight: 700;
  margin-bottom: 24px;
  line-height: 1.2;
  letter-spacing: 1px;
}

.banner-content .subtitle {
  font-size: 22px;
  margin-bottom: 20px;
  opacity: 0.95;
  font-weight: 300;
}

.banner-content .description {
  font-size: 18px;
  margin-bottom: 24px;
  opacity: 0.9;
  font-weight: 300;
  line-height: 1.6;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.banner-content.company-intro .subtitle {
  font-size: 20px;
  margin-bottom: 16px;
}

.banner-certifications {
  display: flex;
  gap: 24px;
  justify-content: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.cert-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.15);
  padding: 10px 20px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  font-size: 15px;
  font-weight: 500;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.cert-badge:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.cert-badge .el-icon {
  color: #52c41a;
  font-size: 18px;
}

.banner-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}

/* 通用板块样式 - 优化滚动量 */
.section {
  padding: 50px 0; /* 减少: 80px → 50px，减少38% */
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 40px; /* 减少: 60px → 40px，减少33% */
}

.section-title {
  font-size: 36px; /* 减少: 42px → 36px */
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 12px; /* 减少: 16px → 12px */
}

.section-desc {
  font-size: 16px; /* 减少: 18px → 16px */
  color: #666;
  max-width: 600px;
  margin: 0 auto;
}

/* 产品系列 */
.product-series {
  background: #fff;
}

.series-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

@media (max-width: 1600px) {
  .series-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1200px) {
  .series-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.series-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border: 1px solid #e8e8e8;
  position: relative;
  /* 🔧 手机端触摸优化 */
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
  touch-action: manipulation;
}

.series-content {
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
}

.series-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}

/* 🔧 手机端按压反馈 */
.series-card:active {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* 管理员拖拽手柄 */
.drag-handle {
  position: absolute;
  top: 10px;
  right: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  z-index: 100;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  animation: pulseGlow 2s infinite;
}

.drag-handle:hover {
  transform: scale(1.15);
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.6);
}

.drag-handle:active {
  cursor: grabbing;
  transform: scale(1.05);
}

@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
  }
  50% {
    box-shadow: 0 2px 16px rgba(102, 126, 234, 0.8);
  }
}

/* 拖拽状态样式 */
.series-card-ghost {
  opacity: 0.3;
  background: linear-gradient(135deg, #667eea22 0%, #764ba222 100%);
  border: 2px dashed #667eea;
}

.series-card-chosen {
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
  border-color: #667eea;
  transform: scale(1.02);
}

.series-card-drag {
  transform: rotate(3deg) scale(1.05);
  opacity: 0.9;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
  cursor: grabbing !important;
}

/* 管理员模式提示 */
.draggable-enabled {
  border-color: rgba(102, 126, 234, 0.3);
}

.draggable-enabled:hover {
  border-color: #667eea;
}

.series-image {
  width: 100%;
  height: 168px; /* 减小30%: 240 → 168 */
  overflow: hidden;
}

.series-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.series-card:hover .series-image img {
  transform: scale(1.08);
}

.series-info {
  padding: 20px; /* 减小30%: 28 → 20 */
}

.series-info h3 {
  font-size: 15px; /* 减小30%: 22 → 15 */
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px; /* 减小30%: 12 → 8 */
}

.series-info p {
  color: #666;
  font-size: 10px; /* 减小30%: 14 → 10 */
  line-height: 1.6;
  margin-bottom: 14px; /* 减小30%: 20 → 14 */
}

.series-link {
  color: #1890ff;
  font-size: 10px; /* 减小30%: 14 → 10 */
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 1600px) {
  .agents-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1200px) {
  .agents-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .agents-grid {
    grid-template-columns: 1fr;
  }
}

/* 解决方案 */
.solutions-section {
  background: #fafbfc;
}

.solutions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.solution-card {
  background: #fff;
  padding: 40px 28px;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e8e8e8;
}

.solution-card:hover {
  border-color: #1890ff;
  box-shadow: 0 8px 16px rgba(24, 144, 255, 0.15);
  transform: translateY(-4px);
}

.solution-icon {
  margin-bottom: 20px;
  color: #1890ff;
}

.solution-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1a1a1a;
}

.solution-card p {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

/* 🆕 核心智能体双卡片并排布局 */
.core-agents-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #e8eef5 100%);
  padding: 60px 0;
}

.core-agents-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 1200px) {
  .core-agents-grid {
    grid-template-columns: 1fr;
    max-width: 700px;
  }
}

/* 核心卡片样式 */
.core-agent-card {
  background: white;
  border-radius: 20px;
  padding: 40px 32px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 3px solid transparent;
  min-height: 650px;
  display: flex;
  flex-direction: column;
  /* 🔧 手机端触摸优化 */
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

.core-agent-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: height 0.3s;
}

.core-agent-card.marketing-hub::before {
  background: linear-gradient(90deg, #67C23A 0%, #409EFF 100%);
}

.core-agent-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 20px 48px rgba(102, 126, 234, 0.25);
  border-color: rgba(102, 126, 234, 0.3);
}

/* 🔧 手机端按压反馈 */
.core-agent-card:active {
  transform: scale(0.98) translateY(-8px);
  opacity: 0.95;
}

.core-agent-card:hover::before {
  height: 8px;
}

.core-agent-card.marketing-hub:hover {
  box-shadow: 0 20px 48px rgba(103, 194, 58, 0.25);
  border-color: rgba(103, 194, 58, 0.3);
}

/* 角标徽章 */
.card-corner-badge {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 6px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  letter-spacing: 0.5px;
}

/* 🆕 核心智能体卡片返回主页按钮 */
.card-back-home {
  position: absolute;
  top: 60px;
  right: 20px;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.core-agent-card:hover .card-back-home {
  opacity: 1;
}

.card-back-home .el-button {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.card-corner-badge.marketing {
  background: linear-gradient(135deg, #67C23A 0%, #409EFF 100%);
  box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);
}

/* 卡片头部 */
.agent-card-header {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid #F0F2F5;
}

.agent-icon {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
}

.agent-icon.marketing {
  background: linear-gradient(135deg, #67C23A 0%, #409EFF 100%);
  box-shadow: 0 8px 16px rgba(103, 194, 58, 0.3);
}

.agent-title-group h3 {
  font-size: 26px;
  font-weight: 700;
  color: #303133;
  margin: 0 0 6px 0;
  letter-spacing: 0.5px;
}

.agent-subtitle {
  font-size: 14px;
  color: #909399;
  font-weight: 500;
  margin: 0 0 12px 0;
}

.agent-stats-mini {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.stat-badge {
  padding: 4px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.stat-badge.success {
  background: linear-gradient(135deg, #67C23A 0%, #85CE61 100%);
}

/* 亮点列表 */
.agent-highlights {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 28px;
}

.highlight-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #F8F9FA;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  color: #606266;
  transition: all 0.3s;
}

.highlight-row:hover {
  background: #ECF5FF;
  transform: translateX(6px);
}

/* 紧凑功能特性 */
.agent-features-compact {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 28px;
}

.compact-feature {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: linear-gradient(135deg, #F5F7FA 0%, #FFFFFF 100%);
  border-radius: 8px;
  font-size: 14px;
  color: #606266;
  border: 1px solid #E4E7ED;
}

.feature-icon {
  font-size: 18px;
}

.feature-text {
  font-weight: 500;
}

/* 营销指标紧凑版 */
.marketing-metrics-compact {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.metric-compact {
  text-align: center;
  padding: 16px 12px;
  background: #F8F9FA;
  border-radius: 10px;
  border: 2px solid #E4E7ED;
  transition: all 0.3s;
}

.metric-compact.primary-metric {
  background: linear-gradient(135deg, #FFF7ED 0%, #FFF5F0 100%);
  border-color: #E6A23C;
}

.metric-compact:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.metric-number {
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 4px;
}

.metric-compact.primary-metric .metric-number {
  font-size: 32px;
  background: linear-gradient(135deg, #F56C6C 0%, #E6A23C 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.metric-label {
  font-size: 13px;
  color: #606266;
  font-weight: 500;
}

/* 成功案例迷你版 */
.success-case-mini {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: linear-gradient(135deg, #F0FFF4 0%, #E8F8F5 100%);
  border-left: 4px solid #67C23A;
  border-radius: 8px;
  margin-bottom: 28px;
}

.case-text {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
}

.case-text strong {
  color: #67C23A;
  font-weight: 700;
}

/* 卡片操作按钮 */
.agent-card-action {
  width: 100%;
  font-size: 16px;
  font-weight: 600;
  height: 48px;
  margin-top: auto;
}

/* 🆕 AI工作流平台板块 - 优化设计 */
.workflow-platforms-section {
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  padding: 60px 0;
  position: relative;
  overflow: hidden;
}

.workflow-platforms-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="2" fill="rgba(66,165,245,0.1)"/></svg>');
  opacity: 0.3;
}

.workflow-platforms-section .section-title {
  color: #1565c0;
  font-size: 36px;
  font-weight: 700;
}

.workflow-platforms-section .section-desc {
  color: #424242;
  font-size: 16px;
}

/* 工作流Hub卡片 - 大卡片样式 */
.workflow-hub-card {
  background: white;
  border-radius: 24px;
  padding: 48px 40px;
  box-shadow: 0 12px 40px rgba(33, 150, 243, 0.15);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border: 3px solid transparent;
  /* 🔧 手机端触摸优化 */
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
}

.workflow-hub-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #2196F3 0%, #03A9F4 100%);
  transition: height 0.3s;
}

.workflow-hub-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 24px 64px rgba(33, 150, 243, 0.25);
  border-color: rgba(33, 150, 243, 0.3);
}

/* 🔧 手机端按压反馈 */
.workflow-hub-card:active {
  transform: scale(0.98) translateY(-8px);
  box-shadow: 0 16px 48px rgba(33, 150, 243, 0.2);
}

.workflow-hub-card:hover::before {
  height: 8px;
}

/* Hub卡片头部 */
.hub-card-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid #E3F2FD;
}

.hub-icon {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #2196F3 0%, #03A9F4 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 20px rgba(33, 150, 243, 0.3);
}

.hub-title h3 {
  font-size: 28px;
  font-weight: 700;
  color: #1565c0;
  margin: 0 0 8px 0;
}

.hub-title p {
  font-size: 15px;
  color: #616161;
  margin: 0;
  font-weight: 500;
}

/* Hub统计数据 */
.hub-card-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.mini-stat {
  text-align: center;
  padding: 20px 16px;
  background: linear-gradient(135deg, #F5F5F5 0%, #FFFFFF 100%);
  border-radius: 12px;
  border: 2px solid #E0E0E0;
  transition: all 0.3s;
}

.mini-stat:hover {
  transform: scale(1.05);
  border-color: #2196F3;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.15);
}

.stat-icon {
  font-size: 28px;
  display: block;
  margin-bottom: 8px;
}

.stat-text {
  font-size: 14px;
  font-weight: 600;
  color: #424242;
  display: block;
}

/* Hub功能特性标签 */
.hub-card-features {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 32px;
  justify-content: center;
}

.feature-tag {
  padding: 10px 18px;
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  color: #1565C0;
  border: 2px solid #90CAF9;
  transition: all 0.3s;
  white-space: nowrap;
}

.feature-tag:hover {
  background: linear-gradient(135deg, #2196F3 0%, #03A9F4 100%);
  color: white;
  border-color: #1976D2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

/* Hub卡片底部按钮区 */
.hub-card-footer {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.hub-card-footer .el-button {
  font-size: 16px;
  font-weight: 600;
  padding: 14px 32px;
  border-radius: 12px;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .hub-card-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .feature-tag {
    font-size: 12px;
    padding: 8px 14px;
  }
  
  .hub-card-footer {
    flex-direction: column;
  }
  
  .hub-card-footer .el-button {
    width: 100%;
  }
}

/* 工作流平台弹窗网格 */
.workflow-platforms-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  max-height: 70vh;
  overflow-y: auto;
  padding: 8px;
}

/* 🆕 弹窗返回主页按钮 */
.dialog-back-home {
  position: absolute;
  top: 20px;
  right: 60px;
  z-index: 1000;
}

.dialog-back-home .el-button {
  background: linear-gradient(135deg, #409EFF 0%, #2196F3 100%);
  border: none;
  color: white;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
  transition: all 0.3s ease;
}

.dialog-back-home .el-button:hover {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.5);
  transform: translateY(-2px);
}

.workflow-platform-card {
  background: white;
  border-radius: 16px;
  padding: 24px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 14px;
  border: 2px solid #E0E0E0;
  position: relative;
  overflow: hidden;
}

.workflow-platform-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #2196F3 0%, #03A9F4 100%);
  transform: scaleY(0);
  transition: transform 0.3s;
}

.workflow-platform-card:hover::before {
  transform: scaleY(1);
}

.workflow-platform-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(33, 150, 243, 0.2);
  border-color: #2196F3;
}

.platform-logo {
  width: 72px;
  height: 72px;
  border-radius: 14px;
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all 0.3s;
  margin: 0 auto;
}

.workflow-platform-card:hover .platform-logo {
  background: linear-gradient(135deg, #2196F3 0%, #03A9F4 100%);
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(33, 150, 243, 0.3);
}

.platform-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 8px;
}

.platform-icon {
  font-size: 36px;
  line-height: 1;
  transition: all 0.3s;
}

.workflow-platform-card:hover .platform-icon {
  filter: brightness(5);
}

.platform-info {
  text-align: center;
}

.platform-info h3 {
  font-size: 17px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.platform-info p {
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 12px 0;
  min-height: 40px;
}

.platform-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}

.platform-tags .el-tag {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 10px;
}

.platform-action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #2196F3;
  font-size: 14px;
  font-weight: 600;
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  transition: all 0.3s;
}

.workflow-platform-card:hover .platform-action {
  color: #1976D2;
}

.platform-action .el-icon {
  font-size: 16px;
}

/* 响应式调整 */
@media (max-width: 1400px) {
  .workflow-platforms-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 992px) {
  .workflow-platforms-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .workflow-platforms-grid {
    grid-template-columns: 1fr;
  }
}

.agent-tags {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

/* 关于明升伟业 */
.about-section {
  background: #fff;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.about-text h2 {
  font-size: 36px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 24px;
}

.about-intro {
  font-size: 16px;
  line-height: 1.8;
  color: #444;
  margin-bottom: 32px;
}

.certifications {
  display: flex;
  gap: 24px;
  margin-bottom: 32px;
}

.cert-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: #333;
  font-weight: 500;
}

.about-image {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.about-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

/* 企业优势 */
.advantages-section {
  background: #fafbfc;
}

.advantage-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
}

.advantage-item {
  background: #fff;
  text-align: center;
  padding: 40px 24px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
}

.advantage-item:hover {
  border-color: #1890ff;
  box-shadow: 0 8px 16px rgba(24, 144, 255, 0.1);
}

.advantage-icon {
  margin-bottom: 20px;
}

.advantage-item h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1a1a1a;
}

.advantage-item p {
  color: #666;
  line-height: 1.6;
  font-size: 14px;
}

/* 服务网络 */
.service-network {
  background: #fff;
}

.offices-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.office-item {
  text-align: center;
  padding: 24px;
  background: #fafbfc;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
}

.office-item:hover {
  background: #fff;
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
}

.office-item h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 12px 0 6px;
  color: #1a1a1a;
}

.office-item p {
  font-size: 13px;
  color: #666;
}

/* 明星产品展示（缩小30% - 2025-12-20）*/
.featured-products-section {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 56px 0; /* 从80px缩小到56px */
}

.featured-products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 保持3列布局 */
  gap: 34px; /* 28px * 1.2 = 33.6px，向上取整为34px */
}

@media (max-width: 1200px) {
  .featured-products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .featured-products-grid {
    grid-template-columns: 1fr;
  }
}

.featured-product-card {
  background: #fff;
  border-radius: 19px; /* 16px * 1.2 = 19.2px */
  overflow: hidden;
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08); /* 2px*1.2, 8px*1.5 */
  transition: all 0.3s ease;
  position: relative; /* 为返回按钮定位 */
}

/* 🆕 明星产品卡片返回主页按钮 */
.product-back-home {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.featured-product-card:hover .product-back-home {
  opacity: 1;
}

.product-back-home .el-button {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.featured-product-card:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12); /* 4px*1.5, 16px*1.5 */
  transform: translateY(-5px); /* 4px * 1.2 = 4.8px */
}

.product-media {
  width: 100%;
  height: 336px; /* 280px * 1.2 = 336px（放大20%）*/
  background: #000;
  position: relative;
}

.product-video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.product-image-wrapper {
  cursor: pointer;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-image-wrapper:hover .product-image {
  transform: scale(1.05);
}

.product-info {
  padding: 26px; /* 22px * 1.2 = 26.4px */
  text-align: center;
}

.product-info h3 {
  font-size: 20px; /* 17px * 1.2 = 20.4px */
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 13px; /* 11px * 1.2 = 13.2px */
}

.product-info p {
  font-size: 13px; /* 11px * 1.2 = 13.2px */
  color: #666;
  line-height: 1.5;
  margin-bottom: 20px; /* 17px * 1.2 = 20.4px */
}

.product-info .el-button {
  font-size: 13px; /* 11px * 1.2 = 13.2px */
  padding: 6px 15px; /* 8px * 0.7 = 6px, 22px * 0.7 = 15px（再缩小30%）*/
}

/* ========== 新增媒体类型样式 ========== */

/* 网页链接样式 */
.product-web-wrapper {
  position: relative;
  cursor: pointer;
}

.product-web-frame {
  width: 100%;
  height: 100%;
  pointer-events: none; /* 防止直接操作iframe */
}

.web-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: #fff;
  font-size: 20px;
  font-weight: 500;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-web-wrapper:hover .web-overlay {
  opacity: 1;
}

.web-overlay .el-icon {
  font-size: 48px;
}

/* 动画图片样式 */
.animated-image {
  /* 为GIF添加特殊效果 */
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1);
}

/* 视频样式增强 */
.product-video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .product-media {
    height: 175px; /* 减小30%: 250 → 175 */
  }
  
  .product-info {
    padding: 20px; /* 移动端保持适中尺寸 */
  }
  
  .product-info h3 {
    font-size: 16px; /* 移动端字体适中 */
  }
  
  .product-info p {
    font-size: 12px; /* 移动端字体适中 */
  }
}

/* ==================== 制造企业AI工具平台样式 ==================== */

/* 工具平台弹窗 */
.manufacturing-tools-dialog {
  border-radius: 16px;
}

.manufacturing-tools-dialog .el-dialog__header {
  background: linear-gradient(135deg, #1976D2 0%, #42A5F5 100%);
  color: white;
  padding: 24px 32px;
  border-radius: 16px 16px 0 0;
}

.manufacturing-tools-dialog .el-dialog__title {
  font-size: 24px;
  font-weight: 700;
  color: white;
}

.manufacturing-tools-dialog .el-dialog__body {
  padding: 0;
  max-height: 82vh;
  overflow-y: auto;
}

/* 工具平台容器 */
.manufacturing-tools-container {
  padding: 24px;
}

/* 顶部工具栏 */
.tools-toolbar {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.search-section {
  flex: 1;
  min-width: 300px;
}

.filter-section {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

/* 优先级推荐看板 */
.priority-board {
  background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(255, 152, 0, 0.15);
}

.board-header {
  text-align: center;
  margin-bottom: 32px;
}

.board-header h3 {
  font-size: 28px;
  font-weight: 700;
  color: #E65100;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.board-header p {
  font-size: 16px;
  color: #F57C00;
  margin: 0;
}

.priority-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.priority-item {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.priority-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 20px rgba(255, 152, 0, 0.2);
}

.priority-badge {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #FF6F00 0%, #FF9800 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
}

.priority-content h4 {
  font-size: 18px;
  font-weight: 600;
  color: #E65100;
  margin: 0 0 12px 0;
}

.priority-tools {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.priority-reason {
  font-size: 14px;
  color: #666;
  margin: 8px 0;
  display: flex;
  align-items: flex-start;
  gap: 6px;
}

.priority-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #F57C00;
  margin-top: 8px;
}

/* 分类工具展示 */
.tools-categories {
  margin-top: 24px;
}

.category-section {
  background: white;
  border-radius: 12px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.category-header {
  background: linear-gradient(135deg, #F5F5F5 0%, #EEEEEE 100%);
  padding: 20px 24px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;
}

.category-header:hover {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
}

.category-title {
  display: flex;
  align-items: center;
  gap: 16px;
}

.category-icon {
  font-size: 32px;
}

.category-title h3 {
  font-size: 22px;
  font-weight: 600;
  color: #1565C0;
  margin: 0;
}

.toggle-icon {
  font-size: 24px;
  color: #1976D2;
  transition: transform 0.3s;
}

.toggle-icon.is-expanded {
  transform: rotate(180deg);
}

.category-content {
  padding: 18px; /* 从24px缩小到18px */
  background: #FAFAFA;
}

/* 子分类 - 缩小间距 */
.sub-category-section {
  margin-bottom: 24px; /* 从32px缩小到24px */
}

.sub-category-section:last-child {
  margin-bottom: 0;
}

.sub-category-title {
  font-size: 16px; /* 从18px缩小到16px */
  font-weight: 600;
  color: #424242;
  margin: 0 0 14px 0; /* 从20px缩小到14px */
  display: flex;
  align-items: center;
  gap: 6px; /* 从8px缩小到6px */
  padding-bottom: 10px; /* 从12px缩小到10px */
  border-bottom: 2px solid #E0E0E0;
}

/* 工具卡片网格 - 缩小并集中布局 */
.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); /* 从380px缩小到280px，增加每行卡片数 */
  gap: 16px; /* 从20px缩小到16px */
  max-width: 100%;
}

.tool-card {
  background: white;
  border-radius: 10px; /* 从12px缩小到10px */
  padding: 14px; /* 从20px缩小到14px */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08); /* 稍微减小阴影 */
  transition: all 0.3s;
  cursor: pointer;
  border: 2px solid transparent;
}

.tool-card:hover {
  transform: translateY(-3px); /* 从-4px缩小到-3px */
  box-shadow: 0 6px 18px rgba(25, 118, 210, 0.15); /* 减小悬停阴影 */
  border-color: #42A5F5;
}

.tool-header {
  display: flex;
  gap: 12px; /* 从16px缩小到12px */
  margin-bottom: 12px; /* 从16px缩小到12px */
}

.tool-icon {
  flex-shrink: 0;
  width: 40px; /* 从48px缩小到40px */
  height: 40px; /* 从48px缩小到40px */
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px; /* 从28px缩小到22px */
}

.tool-meta h4 {
  font-size: 15px; /* 从18px缩小到15px */
  font-weight: 600;
  color: #1565C0;
  margin: 0 0 4px 0; /* 从6px缩小到4px */
}

.tool-meta p {
  font-size: 12px; /* 从14px缩小到12px */
  color: #666;
  margin: 0;
  line-height: 1.4; /* 从1.5缩小到1.4 */
}

.tool-details {
  background: #F5F5F5;
  border-radius: 6px; /* 从8px缩小到6px */
  padding: 10px; /* 从12px缩小到10px */
  margin-bottom: 10px; /* 从12px缩小到10px */
}

.detail-row {
  font-size: 11px; /* 从13px缩小到11px */
  color: #424242;
  margin-bottom: 6px; /* 从8px缩小到6px */
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px; /* 从6px缩小到4px */
}

.detail-row:last-child {
  margin-bottom: 0;
}

.detail-row .label {
  font-weight: 600;
  color: #1976D2;
  min-width: 45px; /* 从50px缩小到45px */
}

.detail-row .value {
  flex: 1;
  color: #666;
}

.tool-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px; /* 从6px缩小到4px */
  margin-bottom: 12px; /* 从16px缩小到12px */
}

.tool-footer {
  display: flex;
  gap: 6px; /* 从8px缩小到6px */
}

.tool-footer .el-button {
  flex: 1;
  font-size: 12px; /* 添加字体大小 */
  padding: 6px 10px; /* 缩小按钮内边距 */
}

/* 工具卡片响应式优化 */
@media (max-width: 1400px) {
  .tools-grid {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); /* 中等屏幕 */
  }
}

@media (max-width: 992px) {
  .tools-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); /* 平板屏幕 */
    gap: 14px;
  }
  
  .tool-card {
    padding: 12px;
  }
}

@media (max-width: 768px) {
  .tools-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* 手机屏幕 */
    gap: 12px;
  }
  
  .tool-card {
    padding: 10px;
  }
  
  .tool-icon {
    width: 36px;
    height: 36px;
    font-size: 20px;
  }
  
  .tool-meta h4 {
    font-size: 14px;
  }
  
  .tool-meta p {
    font-size: 11px;
  }
}

@media (max-width: 576px) {
  .tools-grid {
    grid-template-columns: 1fr; /* 小屏幕单列显示 */
  }
}

/* 工具详情弹窗 */
.tool-detail-dialog .el-dialog__header {
  background: linear-gradient(135deg, #1976D2 0%, #42A5F5 100%);
  color: white;
  padding: 24px 32px;
}

.tool-detail-dialog .el-dialog__title {
  color: white;
  font-size: 22px;
  font-weight: 700;
}

.tool-detail-content {
  padding: 24px;
}

.detail-header {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
}

.detail-icon {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
}

.detail-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1565C0;
  margin: 0 0 8px 0;
}

.detail-desc {
  font-size: 16px;
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.6;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.detail-sections {
  margin-top: 24px;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h4 {
  font-size: 18px;
  font-weight: 600;
  color: #1976D2;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 8px;
  border-bottom: 2px solid #E3F2FD;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.info-item {
  font-size: 14px;
  color: #424242;
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-label {
  font-weight: 600;
  color: #1976D2;
  min-width: 80px;
}

.pros-cons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.pros, .cons {
  background: #F5F5F5;
  border-radius: 8px;
  padding: 16px;
}

.pros h5, .cons h5 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.pros h5 {
  color: #43A047;
}

.cons h5 {
  color: #E64A19;
}

.pros p, .cons p {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

.priority-section {
  background: linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%);
  border-radius: 12px;
  padding: 20px;
}

.config-suggestion {
  margin-top: 16px;
  background: white;
  border-radius: 8px;
  padding: 16px;
}

.config-suggestion h5 {
  font-size: 16px;
  font-weight: 600;
  color: #F57C00;
  margin: 0 0 8px 0;
}

.config-suggestion p {
  font-size: 14px;
  color: #666;
  margin: 0;
  line-height: 1.6;
}

.detail-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .tools-toolbar {
    flex-direction: column;
  }
  
  .search-section {
    width: 100%;
  }
  
  .filter-section {
    width: 100%;
    flex-direction: column;
  }
  
  .filter-section .el-select {
    width: 100% !important;
  }
  
  .priority-grid {
    grid-template-columns: 1fr;
  }
  
  .tools-grid {
    grid-template-columns: 1fr;
  }
  
  .pros-cons {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}


</style>
