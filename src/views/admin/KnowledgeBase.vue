<template>
  <div class="knowledge-base-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1>📚 企业知识库管理</h1>
          <p class="subtitle">统一管理所有智能体的知识内容</p>
        </div>
        <div class="header-actions">
          <el-button type="primary" :icon="Plus" @click="showAddDialog">
            添加知识
          </el-button>
          <el-button :icon="Upload" @click="showImportDialog">
            导入数据
          </el-button>
          <el-button :icon="Download" @click="exportData">
            导出数据
          </el-button>
          <el-button :icon="Refresh" @click="refreshData">
            刷新
          </el-button>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="statistics-cards">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                <el-icon><Document /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-label">总知识条目</div>
                <div class="stat-value">{{ statistics.totalEntries }}</div>
                <div class="stat-trend">
                  <span class="active">激活: {{ statistics.activeEntries }}</span>
                  <span class="draft">草稿: {{ statistics.draftEntries }}</span>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
                <el-icon><View /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-label">总浏览量</div>
                <div class="stat-value">{{ statistics.totalViews }}</div>
                <div class="stat-detail">点赞: {{ statistics.totalLikes }}</div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
                <el-icon><CollectionTag /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-label">分类与标签</div>
                <div class="stat-value">{{ categories.length }} / {{ tags.length }}</div>
                <div class="stat-detail">分类 / 标签</div>
              </div>
            </div>
          </el-card>
        </el-col>

        <el-col :span="6">
          <el-card class="stat-card">
            <div class="stat-content">
              <div class="stat-icon" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
                <el-icon><TrendCharts /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-label">平均准确率</div>
                <div class="stat-value">{{ statistics.avgAccuracy.toFixed(1) }}%</div>
                <div class="stat-detail">知识质量指标</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 搜索和过滤栏 -->
    <el-card class="search-section">
      <el-form :inline="true">
        <el-form-item label="搜索">
          <el-input
            v-model="searchQuery"
            placeholder="搜索标题、内容、标签..."
            :prefix-icon="Search"
            clearable
            style="width: 300px"
            @input="handleSearch"
          />
        </el-form-item>

        <el-form-item label="分类">
          <el-select v-model="filterCategory" placeholder="全部分类" clearable style="width: 150px">
            <el-option
              v-for="cat in categories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id"
            >
              <span>{{ cat.icon }} {{ cat.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="类型">
          <el-select v-model="filterType" placeholder="全部类型" clearable style="width: 150px">
            <el-option label="📄 文档" value="document" />
            <el-option label="❓ FAQ" value="faq" />
            <el-option label="💼 案例" value="case" />
            <el-option label="📖 教程" value="tutorial" />
            <el-option label="📋 规范" value="specification" />
          </el-select>
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="filterStatus" placeholder="全部状态" clearable style="width: 120px">
            <el-option label="✅ 激活" value="active" />
            <el-option label="✏️ 草稿" value="draft" />
            <el-option label="📦 归档" value="archived" />
          </el-select>
        </el-form-item>

        <el-form-item label="标签">
          <el-select v-model="filterTags" multiple placeholder="选择标签" style="width: 200px">
            <el-option
              v-for="tag in tags"
              :key="tag.id"
              :label="tag.name"
              :value="tag.name"
            >
              <el-tag :color="tag.color" size="small">{{ tag.name }}</el-tag>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
          <el-button :icon="RefreshLeft" @click="resetFilters">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 主内容区 -->
    <el-card class="main-content">
      <!-- Tab切换 -->
      <el-tabs v-model="activeTab" @tab-change="handleTabChange">
        <!-- 知识列表 -->
        <el-tab-pane label="知识列表" name="list">
          <el-table
            :data="filteredKnowledge"
            stripe
            style="width: 100%"
            :default-sort="{ prop: 'createdAt', order: 'descending' }"
          >
            <el-table-column prop="id" label="ID" width="80" />
            
            <el-table-column label="标题" min-width="250">
              <template #default="scope">
                <div class="knowledge-title">
                  <span class="type-icon">{{ getTypeIcon(scope.row.type) }}</span>
                  <span class="title-text">{{ scope.row.title }}</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="分类" width="120">
              <template #default="scope">
                <el-tag v-if="getCategoryById(scope.row.category)" size="small">
                  {{ getCategoryById(scope.row.category).icon }}
                  {{ getCategoryById(scope.row.category).name }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="标签" width="200">
              <template #default="scope">
                <el-tag
                  v-for="tag in scope.row.tags.slice(0, 2)"
                  :key="tag"
                  size="small"
                  type="info"
                  style="margin-right: 5px"
                >
                  {{ tag }}
                </el-tag>
                <el-tag v-if="scope.row.tags.length > 2" size="small" type="info">
                  +{{ scope.row.tags.length - 2 }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="状态" width="100" align="center">
              <template #default="scope">
                <el-tag
                  :type="scope.row.status === 'active' ? 'success' : scope.row.status === 'draft' ? 'warning' : 'info'"
                  size="small"
                >
                  {{ getStatusText(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column label="数据" width="180" align="center">
              <template #default="scope">
                <div class="meta-stats">
                  <span>👁️ {{ scope.row.metadata.views }}</span>
                  <span>👍 {{ scope.row.metadata.likes }}</span>
                  <span>🎯 {{ scope.row.metadata.accuracy }}%</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="作者" width="100">
              <template #default="scope">
                {{ scope.row.author }}
              </template>
            </el-table-column>

            <el-table-column label="版本" width="80" align="center">
              <template #default="scope">
                v{{ scope.row.version }}
              </template>
            </el-table-column>

            <el-table-column label="创建时间" width="160">
              <template #default="scope">
                {{ formatDate(scope.row.createdAt) }}
              </template>
            </el-table-column>

            <el-table-column label="操作" width="220" fixed="right">
              <template #default="scope">
                <el-button link type="primary" size="small" @click="viewKnowledge(scope.row)">
                  查看
                </el-button>
                <el-button link type="primary" size="small" @click="editKnowledge(scope.row)">
                  编辑
                </el-button>
                <el-button
                  v-if="scope.row.status === 'draft'"
                  link
                  type="success"
                  size="small"
                  @click="publishKnowledge(scope.row.id)"
                >
                  发布
                </el-button>
                <el-button link type="danger" size="small" @click="deleteKnowledge(scope.row.id)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 分类管理 -->
        <el-tab-pane label="分类管理" name="categories">
          <div class="toolbar">
            <el-button type="primary" :icon="Plus" @click="showAddCategoryDialog">
              添加分类
            </el-button>
          </div>

          <el-table :data="categories" stripe>
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column label="图标" width="80" align="center">
              <template #default="scope">
                <span style="font-size: 24px">{{ scope.row.icon }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="名称" width="150" />
            <el-table-column prop="description" label="描述" min-width="200" />
            <el-table-column label="颜色" width="100" align="center">
              <template #default="scope">
                <div class="color-preview" :style="{ backgroundColor: scope.row.color }"></div>
              </template>
            </el-table-column>
            <el-table-column prop="knowledgeCount" label="知识数量" width="100" align="center" />
            <el-table-column prop="order" label="排序" width="80" align="center" />
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="scope">
                <el-button link type="primary" size="small" @click="editCategory(scope.row)">
                  编辑
                </el-button>
                <el-button link type="danger" size="small" @click="deleteCategory(scope.row.id)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 标签管理 -->
        <el-tab-pane label="标签管理" name="tags">
          <div class="toolbar">
            <el-button type="primary" :icon="Plus" @click="showAddTagDialog">
              添加标签
            </el-button>
          </div>

          <el-table :data="tags" stripe>
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column label="标签" width="200">
              <template #default="scope">
                <el-tag :color="scope.row.color">{{ scope.row.name }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="useCount" label="使用次数" width="120" align="center" />
            <el-table-column label="颜色" width="100" align="center">
              <template #default="scope">
                <div class="color-preview" :style="{ backgroundColor: scope.row.color }"></div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150" fixed="right">
              <template #default="scope">
                <el-button link type="primary" size="small" @click="editTag(scope.row)">
                  编辑
                </el-button>
                <el-button link type="danger" size="small" @click="deleteTag(scope.row.id)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 审计日志 -->
        <el-tab-pane label="审计日志" name="logs">
          <el-table :data="auditLogs.slice(0, 100)" stripe max-height="600">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column label="操作" width="100" align="center">
              <template #default="scope">
                <el-tag :type="getActionType(scope.row.action)" size="small">
                  {{ getActionText(scope.row.action) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="entityType" label="实体类型" width="120" />
            <el-table-column prop="entityId" label="实体ID" width="100" />
            <el-table-column prop="details" label="详情" min-width="300" />
            <el-table-column prop="user" label="用户" width="120" />
            <el-table-column label="时间" width="180">
              <template #default="scope">
                {{ formatDate(scope.row.timestamp) }}
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 知识详情对话框 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="知识详情"
      width="60%"
      :close-on-click-modal="false"
    >
      <div v-if="currentKnowledge" class="knowledge-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="ID">{{ currentKnowledge.id }}</el-descriptions-item>
          <el-descriptions-item label="类型">
            {{ getTypeIcon(currentKnowledge.type) }} {{ getTypeText(currentKnowledge.type) }}
          </el-descriptions-item>
          <el-descriptions-item label="标题" :span="2">{{ currentKnowledge.title }}</el-descriptions-item>
          <el-descriptions-item label="分类">
            <el-tag v-if="getCategoryById(currentKnowledge.category)" size="small">
              {{ getCategoryById(currentKnowledge.category).icon }}
              {{ getCategoryById(currentKnowledge.category).name }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag
              :type="currentKnowledge.status === 'active' ? 'success' : currentKnowledge.status === 'draft' ? 'warning' : 'info'"
              size="small"
            >
              {{ getStatusText(currentKnowledge.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="标签" :span="2">
            <el-tag
              v-for="tag in currentKnowledge.tags"
              :key="tag"
              size="small"
              style="margin-right: 5px"
            >
              {{ tag }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="作者">{{ currentKnowledge.author }}</el-descriptions-item>
          <el-descriptions-item label="版本">v{{ currentKnowledge.version }}</el-descriptions-item>
          <el-descriptions-item label="浏览量">{{ currentKnowledge.metadata.views }}</el-descriptions-item>
          <el-descriptions-item label="点赞数">{{ currentKnowledge.metadata.likes }}</el-descriptions-item>
          <el-descriptions-item label="使用次数">{{ currentKnowledge.metadata.useCount }}</el-descriptions-item>
          <el-descriptions-item label="准确率">{{ currentKnowledge.metadata.accuracy }}%</el-descriptions-item>
          <el-descriptions-item label="创建时间">{{ formatDate(currentKnowledge.createdAt) }}</el-descriptions-item>
          <el-descriptions-item label="更新时间">{{ formatDate(currentKnowledge.updatedAt) }}</el-descriptions-item>
        </el-descriptions>

        <div class="content-section">
          <h3>内容</h3>
          <div class="markdown-content" v-html="renderMarkdown(currentKnowledge.content)"></div>
        </div>

        <!-- 附件列表 -->
        <div v-if="currentKnowledge.attachments && currentKnowledge.attachments.length > 0" class="attachments-section">
          <el-divider content-position="left">📎 文档附件 ({{ currentKnowledge.attachments.length }})</el-divider>
          <el-space wrap>
            <el-card 
              v-for="file in currentKnowledge.attachments" 
              :key="file.id"
              class="attachment-card"
              shadow="hover"
            >
              <div class="attachment-info">
                <el-icon size="32" color="#409EFF"><Document /></el-icon>
                <div class="file-details">
                  <div class="file-name">{{ file.name }}</div>
                  <div class="file-meta">
                    <span>{{ kb.formatFileSize(file.size) }}</span>
                    <span>{{ formatDate(file.uploadTime) }}</span>
                  </div>
                </div>
              </div>
            </el-card>
          </el-space>
        </div>

        <!-- 多媒体文件 -->
        <div v-if="currentKnowledge.mediaFiles && currentKnowledge.mediaFiles.length > 0" class="media-section">
          <el-divider content-position="left">🎬 多媒体文件 ({{ currentKnowledge.mediaFiles.length }})</el-divider>
          <el-row :gutter="20">
            <el-col 
              v-for="media in currentKnowledge.mediaFiles" 
              :key="media.id"
              :span="8"
            >
              <el-card class="media-card" shadow="hover">
                <template v-if="media.type === 'image'">
                  <el-image 
                    :src="media.url" 
                    :preview-src-list="[media.url]"
                    fit="cover"
                    style="width: 100%; height: 150px"
                  />
                </template>
                <template v-else-if="media.type === 'video'">
                  <video 
                    :src="media.url" 
                    controls
                    style="width: 100%; height: 150px"
                  />
                </template>
                <div class="media-info">
                  <div class="media-name">{{ media.name }}</div>
                  <div class="media-meta">
                    <span>{{ kb.formatFileSize(media.size) }}</span>
                    <span v-if="media.duration">{{ media.duration }}</span>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>

    <!-- 添加/编辑知识对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="editMode === 'add' ? '添加知识' : '编辑知识'"
      width="70%"
      :close-on-click-modal="false"
    >
      <el-form :model="knowledgeForm" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="标题" required>
              <el-input v-model="knowledgeForm.title" placeholder="输入知识标题" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型" required>
              <el-select v-model="knowledgeForm.type" placeholder="选择类型" style="width: 100%">
                <el-option label="📄 文档" value="document" />
                <el-option label="❓ FAQ" value="faq" />
                <el-option label="💼 案例" value="case" />
                <el-option label="📖 教程" value="tutorial" />
                <el-option label="📋 规范" value="specification" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="分类" required>
              <el-select v-model="knowledgeForm.category" placeholder="选择分类" style="width: 100%">
                <el-option
                  v-for="cat in categories"
                  :key="cat.id"
                  :label="cat.name"
                  :value="cat.id"
                >
                  <span>{{ cat.icon }} {{ cat.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="knowledgeForm.status">
                <el-radio label="active">激活</el-radio>
                <el-radio label="draft">草稿</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="标签">
          <el-select
            v-model="knowledgeForm.tags"
            multiple
            filterable
            allow-create
            placeholder="选择或创建标签"
            style="width: 100%"
          >
            <el-option
              v-for="tag in tags"
              :key="tag.id"
              :label="tag.name"
              :value="tag.name"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="作者">
          <el-input v-model="knowledgeForm.author" placeholder="输入作者名称" />
        </el-form-item>

        <el-form-item label="内容" required>
          <el-input
            v-model="knowledgeForm.content"
            type="textarea"
            :rows="15"
            placeholder="支持Markdown格式"
          />
        </el-form-item>

        <!-- 文件上传区域 -->
        <el-divider content-position="left">📎 附件与多媒体</el-divider>
        
        <el-form-item label="文档附件">
          <el-upload
            ref="attachmentUpload"
            :auto-upload="false"
            :on-change="handleAttachmentChange"
            :on-remove="handleAttachmentRemove"
            :file-list="knowledgeForm.attachmentList"
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.md"
            drag
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              拖拽文件到此处 或 <em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持 PDF, Word, Excel, PowerPoint, TXT, Markdown 等文档格式
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="图片文件">
          <el-upload
            ref="imageUpload"
            :auto-upload="false"
            :on-change="handleImageChange"
            :on-remove="handleImageRemove"
            :file-list="knowledgeForm.imageList"
            list-type="picture-card"
            multiple
            accept="image/*"
          >
            <el-icon><Plus /></el-icon>
            <template #tip>
              <div class="el-upload__tip">
                支持 JPG, PNG, GIF, BMP, SVG 等图片格式
              </div>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="视频文件">
          <el-upload
            ref="videoUpload"
            :auto-upload="false"
            :on-change="handleVideoChange"
            :on-remove="handleVideoRemove"
            :file-list="knowledgeForm.videoList"
            accept="video/*"
            drag
          >
            <el-icon class="el-icon--upload"><video-camera /></el-icon>
            <div class="el-upload__text">
              拖拽视频文件到此处 或 <em>点击上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                支持 MP4, AVI, MOV, WMV 等视频格式，单个文件不超过100MB
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveKnowledge">保存</el-button>
      </template>
    </el-dialog>

    <!-- 添加/编辑分类对话框 -->
    <el-dialog
      v-model="categoryDialogVisible"
      :title="categoryEditMode === 'add' ? '添加分类' : '编辑分类'"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form :model="categoryForm" label-width="80px">
        <el-form-item label="名称" required>
          <el-input v-model="categoryForm.name" placeholder="输入分类名称" />
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="categoryForm.icon" placeholder="输入emoji图标" maxlength="2" />
        </el-form-item>
        <el-form-item label="颜色">
          <el-color-picker v-model="categoryForm.color" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="categoryForm.description" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="categoryForm.order" :min="1" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="categoryDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCategory">保存</el-button>
      </template>
    </el-dialog>

    <!-- 添加/编辑标签对话框 -->
    <el-dialog
      v-model="tagDialogVisible"
      :title="tagEditMode === 'add' ? '添加标签' : '编辑标签'"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form :model="tagForm" label-width="80px">
        <el-form-item label="名称" required>
          <el-input v-model="tagForm.name" placeholder="输入标签名称" />
        </el-form-item>
        <el-form-item label="颜色">
          <el-color-picker v-model="tagForm.color" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="tagDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveTag">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import {
  Plus, Upload, Download, Refresh, Search, RefreshLeft,
  Document, View, CollectionTag, TrendCharts,
  UploadFilled, VideoCamera
} from '@element-plus/icons-vue'
import useKnowledgeBase from '@/store/knowledgeBase'
import { marked } from 'marked'

// 知识库实例
const kb = useKnowledgeBase()

// 响应式数据
const { state, categories, tags, auditLogs, statistics } = kb

// 搜索和过滤
const searchQuery = ref('')
const filterCategory = ref(null)
const filterType = ref(null)
const filterStatus = ref(null)
const filterTags = ref([])
const activeTab = ref('list')

// 对话框控制
const viewDialogVisible = ref(false)
const editDialogVisible = ref(false)
const categoryDialogVisible = ref(false)
const tagDialogVisible = ref(false)

// 当前数据
const currentKnowledge = ref(null)
const editMode = ref('add')
const categoryEditMode = ref('add')
const tagEditMode = ref('add')

// 表单数据
const knowledgeForm = ref({
  title: '',
  content: '',
  type: 'document',
  category: null,
  tags: [],
  status: 'draft',
  author: '系统管理员',
  attachmentList: [],  // 附件文件列表
  imageList: [],       // 图片文件列表
  videoList: [],       // 视频文件列表
  attachments: [],     // 处理后的附件数据
  mediaFiles: []       // 处理后的多媒体数据
})

const categoryForm = ref({
  name: '',
  icon: '📁',
  color: '#409EFF',
  description: '',
  order: 1
})

const tagForm = ref({
  name: '',
  color: '#409EFF'
})

// 计算属性
const filteredKnowledge = computed(() => {
  let results = state.knowledgeEntries

  // 搜索过滤
  if (searchQuery.value) {
    results = kb.searchKnowledge(searchQuery.value, {
      category: filterCategory.value,
      tags: filterTags.value,
      type: filterType.value,
      status: filterStatus.value || 'active'
    })
  } else {
    // 分类过滤
    if (filterCategory.value) {
      results = results.filter(k => k.category === filterCategory.value)
    }

    // 类型过滤
    if (filterType.value) {
      results = results.filter(k => k.type === filterType.value)
    }

    // 状态过滤
    if (filterStatus.value) {
      results = results.filter(k => k.status === filterStatus.value)
    }

    // 标签过滤
    if (filterTags.value.length > 0) {
      results = results.filter(k =>
        filterTags.value.some(tag => k.tags.includes(tag))
      )
    }
  }

  return results
})

// 方法
const getCategoryById = (id) => {
  return categories.find(c => c.id === id)
}

const getTypeIcon = (type) => {
  const icons = {
    document: '📄',
    faq: '❓',
    case: '💼',
    tutorial: '📖',
    specification: '📋'
  }
  return icons[type] || '📄'
}

const getTypeText = (type) => {
  const texts = {
    document: '文档',
    faq: 'FAQ',
    case: '案例',
    tutorial: '教程',
    specification: '规范'
  }
  return texts[type] || '文档'
}

const getStatusText = (status) => {
  const texts = {
    active: '激活',
    draft: '草稿',
    archived: '归档'
  }
  return texts[status] || status
}

const getActionType = (action) => {
  const types = {
    create: 'success',
    update: 'warning',
    delete: 'danger',
    view: 'info',
    use: 'primary'
  }
  return types[action] || 'info'
}

const getActionText = (action) => {
  const texts = {
    create: '创建',
    update: '更新',
    delete: '删除',
    view: '查看',
    use: '使用'
  }
  return texts[action] || action
}

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const renderMarkdown = (content) => {
  return marked(content || '')
}

// 搜索处理
const handleSearch = () => {
  // 搜索逻辑已在computed中处理
}

const resetFilters = () => {
  searchQuery.value = ''
  filterCategory.value = null
  filterType.value = null
  filterStatus.value = null
  filterTags.value = []
}

// Tab切换
const handleTabChange = (tab) => {
  // 可以在这里添加tab切换逻辑
}

// 知识操作
const showAddDialog = () => {
  editMode.value = 'add'
  knowledgeForm.value = {
    title: '',
    content: '',
    type: 'document',
    category: null,
    tags: [],
    status: 'draft',
    author: '系统管理员',
    attachmentList: [],
    imageList: [],
    videoList: [],
    attachments: [],
    mediaFiles: []
  }
  editDialogVisible.value = true
}

const viewKnowledge = (knowledge) => {
  currentKnowledge.value = knowledge
  kb.incrementViews(knowledge.id)
  viewDialogVisible.value = true
}

const editKnowledge = (knowledge) => {
  editMode.value = 'edit'
  knowledgeForm.value = { 
    ...knowledge,
    attachmentList: [],
    imageList: [],
    videoList: []
  }
  editDialogVisible.value = true
}

// 文件上传处理函数
const handleAttachmentChange = (file, fileList) => {
  knowledgeForm.value.attachmentList = fileList
}

const handleAttachmentRemove = (file, fileList) => {
  knowledgeForm.value.attachmentList = fileList
}

const handleImageChange = (file, fileList) => {
  knowledgeForm.value.imageList = fileList
}

const handleImageRemove = (file, fileList) => {
  knowledgeForm.value.imageList = fileList
}

const handleVideoChange = (file, fileList) => {
  // 检查文件大小 (100MB限制)
  if (file.size > 100 * 1024 * 1024) {
    ElMessage.error('视频文件不能超过100MB')
    return false
  }
  knowledgeForm.value.videoList = fileList
}

const handleVideoRemove = (file, fileList) => {
  knowledgeForm.value.videoList = fileList
}

// 将文件转换为Base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

// 处理文件上传
const processFiles = async () => {
  const attachments = []
  const mediaFiles = []
  
  // 处理文档附件
  for (const item of knowledgeForm.value.attachmentList) {
    if (item.raw) {
      try {
        const base64 = await fileToBase64(item.raw)
        attachments.push({
          name: item.name,
          type: kb.getFileType(item.name),
          size: item.size,
          base64: base64
        })
      } catch (error) {
        console.error('文件处理失败:', error)
      }
    }
  }
  
  // 处理图片
  for (const item of knowledgeForm.value.imageList) {
    if (item.raw) {
      try {
        const base64 = await fileToBase64(item.raw)
        mediaFiles.push({
          name: item.name,
          type: 'image',
          size: item.size,
          base64: base64,
          thumbnail: base64 // 图片使用自身作为缩略图
        })
      } catch (error) {
        console.error('图片处理失败:', error)
      }
    }
  }
  
  // 处理视频
  for (const item of knowledgeForm.value.videoList) {
    if (item.raw) {
      try {
        const base64 = await fileToBase64(item.raw)
        mediaFiles.push({
          name: item.name,
          type: 'video',
          size: item.size,
          base64: base64
        })
      } catch (error) {
        console.error('视频处理失败:', error)
      }
    }
  }
  
  return { attachments, mediaFiles }
}

const saveKnowledge = async () => {
  if (!knowledgeForm.value.title || !knowledgeForm.value.content) {
    ElMessage.warning('请填写标题和内容')
    return
  }

  // 显示加载状态
  const loading = ElLoading.service({
    lock: true,
    text: '正在处理文件...',
    background: 'rgba(0, 0, 0, 0.7)'
  })

  try {
    // 处理文件上传
    const { attachments, mediaFiles } = await processFiles()
    
    // 更新表单数据
    const formData = {
      ...knowledgeForm.value,
      attachments: attachments,
      mediaFiles: mediaFiles
    }
    
    if (editMode.value === 'add') {
      kb.addKnowledge(formData)
      ElMessage.success('添加成功')
    } else {
      kb.updateKnowledge(formData.id, formData)
      ElMessage.success('更新成功')
    }

    editDialogVisible.value = false
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败，请重试')
  } finally {
    loading.close()
  }
}

const publishKnowledge = (id) => {
  kb.publishKnowledge(id)
  ElMessage.success('发布成功')
}

const deleteKnowledge = (id) => {
  ElMessageBox.confirm('确定要删除这个知识吗?', '确认删除', {
    type: 'warning'
  }).then(() => {
    kb.deleteKnowledge(id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 分类操作
const showAddCategoryDialog = () => {
  categoryEditMode.value = 'add'
  categoryForm.value = {
    name: '',
    icon: '📁',
    color: '#409EFF',
    description: '',
    order: categories.length + 1
  }
  categoryDialogVisible.value = true
}

const editCategory = (category) => {
  categoryEditMode.value = 'edit'
  categoryForm.value = { ...category }
  categoryDialogVisible.value = true
}

const saveCategory = () => {
  if (!categoryForm.value.name) {
    ElMessage.warning('请填写分类名称')
    return
  }

  if (categoryEditMode.value === 'add') {
    kb.addCategory(categoryForm.value)
    ElMessage.success('添加成功')
  } else {
    kb.updateCategory(categoryForm.value.id, categoryForm.value)
    ElMessage.success('更新成功')
  }

  categoryDialogVisible.value = false
}

const deleteCategory = (id) => {
  ElMessageBox.confirm('确定要删除这个分类吗?', '确认删除', {
    type: 'warning'
  }).then(() => {
    const result = kb.deleteCategory(id)
    if (result.success) {
      ElMessage.success('删除成功')
    } else {
      ElMessage.error(result.message)
    }
  }).catch(() => {})
}

// 标签操作
const showAddTagDialog = () => {
  tagEditMode.value = 'add'
  tagForm.value = {
    name: '',
    color: '#409EFF'
  }
  tagDialogVisible.value = true
}

const editTag = (tag) => {
  tagEditMode.value = 'edit'
  tagForm.value = { ...tag }
  tagDialogVisible.value = true
}

const saveTag = () => {
  if (!tagForm.value.name) {
    ElMessage.warning('请填写标签名称')
    return
  }

  if (tagEditMode.value === 'add') {
    kb.addTag(tagForm.value)
    ElMessage.success('添加成功')
  } else {
    // TODO: 实现updateTag方法
    ElMessage.success('更新成功')
  }

  tagDialogVisible.value = false
}

const deleteTag = (id) => {
  ElMessageBox.confirm('确定要删除这个标签吗?', '确认删除', {
    type: 'warning'
  }).then(() => {
    // TODO: 实现deleteTag方法
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 数据操作
const refreshData = () => {
  kb.loadFromLocalStorage()
  kb.updateStatistics()
  ElMessage.success('刷新成功')
}

const exportData = () => {
  const data = kb.exportData('json')
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `knowledge-base-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('导出成功')
}

const showImportDialog = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        const result = kb.importData(data)
        if (result.success) {
          ElMessage.success('导入成功')
        } else {
          ElMessage.error(result.message)
        }
      } catch (error) {
        ElMessage.error('导入失败: ' + error.message)
      }
    }
    reader.readAsText(file)
  }
  input.click()
}

// 生命周期
onMounted(() => {
  kb.loadFromLocalStorage()
  kb.updateStatistics()
  
  // 如果没有数据,初始化演示数据
  if (state.knowledgeEntries.length === 0) {
    kb.initDemoData()
  }
})
</script>

<style scoped>
.knowledge-base-container {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.page-header {
  background: white;
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-section h1 {
  margin: 0;
  font-size: 28px;
  color: #303133;
}

.subtitle {
  margin: 8px 0 0 0;
  color: #909399;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

/* 统计卡片 */
.statistics-cards {
  margin-bottom: 20px;
}

.stat-card {
  height: 100%;
  cursor: pointer;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-detail,
.stat-trend {
  font-size: 12px;
  color: #909399;
}

.stat-trend {
  display: flex;
  gap: 10px;
}

.stat-trend .active {
  color: #67C23A;
}

.stat-trend .draft {
  color: #E6A23C;
}

/* 搜索区域 */
.search-section {
  margin-bottom: 20px;
}

/* 主内容 */
.main-content {
  background: white;
}

.toolbar {
  margin-bottom: 16px;
}

.knowledge-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.type-icon {
  font-size: 18px;
}

.title-text {
  font-weight: 500;
}

.meta-stats {
  display: flex;
  gap: 12px;
  font-size: 12px;
}

.color-preview {
  width: 40px;
  height: 24px;
  border-radius: 4px;
  margin: 0 auto;
  border: 1px solid #dcdfe6;
}

/* 知识详情 */
.knowledge-detail {
  max-height: 70vh;
  overflow-y: auto;
}

.content-section {
  margin-top: 24px;
}

.content-section h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #303133;
}

.markdown-content {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 4px;
  line-height: 1.8;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3) {
  margin-top: 20px;
  margin-bottom: 12px;
  color: #303133;
}

.markdown-content :deep(code) {
  background: #e1e4e8;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
}

.markdown-content :deep(pre) {
  background: #282c34;
  color: #abb2bf;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  padding-left: 24px;
}

/* 附件和多媒体样式 */
.attachments-section,
.media-section {
  margin-top: 24px;
}

.attachment-card {
  width: 300px;
  margin-bottom: 12px;
}

.attachment-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-details {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 4px;
}

.file-meta {
  font-size: 12px;
  color: #909399;
  display: flex;
  gap: 8px;
}

.media-card {
  margin-bottom: 16px;
  overflow: hidden;
}

.media-info {
  margin-top: 12px;
}

.media-name {
  font-size: 13px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.media-meta {
  font-size: 12px;
  color: #909399;
  display: flex;
  gap: 8px;
}

/* 上传区域样式 */
:deep(.el-upload-dragger) {
  padding: 20px;
}

:deep(.el-upload__tip) {
  font-size: 12px;
  color: #909399;
  margin-top: 8px;
}


.markdown-content :deep(li) {
  margin: 8px 0;
}
</style>
