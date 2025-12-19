<template>
  <div class="classroom-manage">
    <el-card class="header-card">
      <h2><el-icon><Reading /></el-icon> 产品技术销售小课堂管理</h2>
      <p>管理技术课程的分类和内容，支持多级分类体系</p>
    </el-card>

    <el-tabs v-model="activeTab" class="manage-tabs">
      <!-- 一级分类管理 -->
      <el-tab-pane label="一级分类管理" name="categories">
        <el-card>
          <div class="section-header">
            <h3>一级分类列表</h3>
            <el-button type="primary" @click="showCategoryDialog()">
              <el-icon><Plus /></el-icon> 添加一级分类
            </el-button>
          </div>

          <el-table :data="store.getAllCategories" style="width: 100%">
            <el-table-column prop="order" label="排序" width="80" />
            <el-table-column label="图标" width="80">
              <template #default="scope">
                <span style="font-size: 32px;">{{ scope.row.icon }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="分类名称" width="200" />
            <el-table-column prop="description" label="描述" />
            <el-table-column label="二级分类数量" width="120">
              <template #default="scope">
                <el-tag>{{ store.getSubcategoriesByCategory(scope.row.id).length }} 个</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="课程数量" width="120">
              <template #default="scope">
                <el-tag type="success">{{ store.getLessonsByCategory(scope.row.id).length }} 个</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="scope">
                <el-button size="small" @click="showCategoryDialog(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteCategory(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- 二级分类管理 -->
      <el-tab-pane label="二级分类管理" name="subcategories">
        <el-card>
          <div class="section-header">
            <h3>二级分类列表</h3>
            <el-button type="primary" @click="showSubcategoryDialog()">
              <el-icon><Plus /></el-icon> 添加二级分类
            </el-button>
          </div>

          <!-- 按一级分类分组显示 -->
          <div v-for="category in store.getAllCategories" :key="category.id" class="category-group">
            <div class="category-group-header">
              <span class="category-icon">{{ category.icon }}</span>
              <h4>{{ category.name }}</h4>
              <el-tag type="info">{{ store.getSubcategoriesByCategory(category.id).length }} 个二级分类</el-tag>
            </div>
            
            <el-table :data="store.getSubcategoriesByCategory(category.id)" style="width: 100%">
              <el-table-column prop="order" label="排序" width="80" />
              <el-table-column prop="name" label="二级分类名称" />
              <el-table-column label="课程数量" width="120">
                <template #default="scope">
                  <el-tag type="success">{{ store.getLessonsBySubcategory(scope.row.id).length }} 个</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="200">
                <template #default="scope">
                  <el-button size="small" @click="showSubcategoryDialog(scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteSubcategory(scope.row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-tab-pane>

      <!-- 课程管理 -->
      <el-tab-pane label="课程管理" name="lessons">
        <el-card>
          <div class="section-header">
            <h3>课程列表</h3>
            <el-button type="primary" @click="showLessonDialog()">
              <el-icon><Plus /></el-icon> 添加课程
            </el-button>
          </div>

          <el-form :inline="true" class="filter-form">
            <el-form-item label="一级分类">
              <el-select v-model="filterCategory" placeholder="选择分类" clearable @change="onFilterChange">
                <el-option
                  v-for="cat in store.getAllCategories"
                  :key="cat.id"
                  :label="cat.name"
                  :value="cat.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
              <el-select v-model="filterSubcategory" placeholder="选择子分类" clearable :disabled="!filterCategory">
                <el-option
                  v-for="sub in store.getSubcategoriesByCategory(filterCategory)"
                  :key="sub.id"
                  :label="sub.name"
                  :value="sub.id" />
              </el-select>
            </el-form-item>
          </el-form>

          <el-table :data="filteredLessons" style="width: 100%">
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column label="封面" width="100">
              <template #default="scope">
                <img v-if="scope.row.coverImage" :src="scope.row.coverImage" class="lesson-cover" />
                <div v-else class="no-cover">无封面</div>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="课程标题" width="250" />
            <el-table-column label="分类" width="200">
              <template #default="scope">
                <div>
                  <el-tag size="small">{{ getCategoryName(scope.row.categoryId) }}</el-tag>
                  <br />
                  <el-tag size="small" type="success" style="margin-top: 5px;">
                    {{ getSubcategoryName(scope.row.subcategoryId) }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="level" label="难度" width="80">
              <template #default="scope">
                <el-tag :type="getLevelType(scope.row.level)" size="small">{{ scope.row.level }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="duration" label="时长" width="100" />
            <el-table-column label="外部链接" width="100" align="center">
              <template #default="scope">
                <el-tag v-if="scope.row.externalUrl" type="success" size="small">
                  <el-icon><Link /></el-icon> 已设置
                </el-tag>
                <el-tag v-else type="info" size="small">未设置</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="数据" width="150">
              <template #default="scope">
                <div class="stats">
                  <span><el-icon><View /></el-icon> {{ scope.row.views }}</span>
                  <span><el-icon><StarFilled /></el-icon> {{ scope.row.likes }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="scope">
                <el-button size="small" @click="showLessonDialog(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteLesson(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- 视频管理 -->
      <el-tab-pane label="视频管理" name="videos">
        <el-card>
          <div class="section-header">
            <h3>视频列表</h3>
            <el-button type="primary" @click="showVideoDialog()">
              <el-icon><Plus /></el-icon> 上传视频
            </el-button>
          </div>

          <el-form :inline="true" class="filter-form">
            <el-form-item label="一级分类">
              <el-select v-model="videoFilterCategory" placeholder="选择分类" clearable @change="onVideoFilterChange">
                <el-option
                  v-for="cat in store.getAllCategories"
                  :key="cat.id"
                  :label="cat.name"
                  :value="cat.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
              <el-select v-model="videoFilterSubcategory" placeholder="选择子分类" clearable :disabled="!videoFilterCategory">
                <el-option
                  v-for="sub in store.getSubcategoriesByCategory(videoFilterCategory)"
                  :key="sub.id"
                  :label="sub.name"
                  :value="sub.id" />
              </el-select>
            </el-form-item>
          </el-form>

          <!-- 按二级分类显示视频 -->
          <div v-for="category in store.getAllCategories" :key="category.id" class="video-category-group">
            <div v-for="subcategory in store.getSubcategoriesByCategory(category.id)" :key="subcategory.id">
              <div v-if="getSubcategoryVideos(subcategory.id).length > 0" class="subcategory-video-section">
                <div class="category-group-header">
                  <span class="category-icon">{{ category.icon }}</span>
                  <h4>{{ category.name }} / {{ subcategory.name }}</h4>
                  <el-tag type="success">{{ getSubcategoryVideos(subcategory.id).length }} 个视频</el-tag>
                  <el-button 
                    size="small" 
                    type="primary" 
                    @click="showVideoDialog(null, subcategory.id)">
                    <el-icon><Plus /></el-icon> 添加视频
                  </el-button>
                </div>
                
                <div class="videos-list">
                  <div
                    v-for="video in getSubcategoryVideos(subcategory.id)"
                    :key="video.id"
                    class="video-item">
                    <div class="video-thumbnail">
                      <img v-if="video.thumbnail" :src="video.thumbnail" alt="缩略图" />
                      <div v-else class="no-thumbnail">
                        <el-icon :size="40"><VideoPlay /></el-icon>
                      </div>
                      <div class="video-duration-badge">{{ video.duration }}</div>
                    </div>
                    <div class="video-item-info">
                      <h5>{{ video.title }}</h5>
                      <p>{{ video.description }}</p>
                      <div class="video-stats-admin">
                        <span><el-icon><View /></el-icon> {{ video.views || 0 }}</span>
                        <span><el-icon><StarFilled /></el-icon> {{ video.likes || 0 }}</span>
                        <span v-if="video.uploadTime">
                          {{ new Date(video.uploadTime).toLocaleDateString() }}
                        </span>
                      </div>
                    </div>
                    <div class="video-actions">
                      <el-button size="small" @click="showVideoDialog(video, subcategory.id)">编辑</el-button>
                      <el-button size="small" type="danger" @click="deleteVideo(subcategory.id, video.id)">删除</el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <el-empty v-if="getAllVideosCount() === 0" description="暂无视频，请先上传" />
        </el-card>
      </el-tab-pane>

      <!-- 外部链接管理 -->
      <el-tab-pane label="外部链接管理" name="externalLinks">
        <el-card>
          <div class="section-header">
            <h3>外部链接列表</h3>
            <el-button type="primary" @click="showExternalLinkDialog()">
              <el-icon><Plus /></el-icon> 添加外部链接
            </el-button>
          </div>

          <el-form :inline="true" class="filter-form">
            <el-form-item label="一级分类">
              <el-select v-model="linkFilterCategory" placeholder="选择分类" clearable @change="onLinkFilterChange">
                <el-option
                  v-for="cat in store.getAllCategories"
                  :key="cat.id"
                  :label="cat.name"
                  :value="cat.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="链接类型">
              <el-select v-model="linkFilterType" placeholder="选择类型" clearable>
                <el-option label="学院平台" value="academy" />
                <el-option label="技术文档" value="docs" />
                <el-option label="视频教程" value="video" />
                <el-option label="在线工具" value="tool" />
              </el-select>
            </el-form-item>
            <el-form-item label="状态">
              <el-select v-model="linkFilterStatus" placeholder="选择状态" clearable>
                <el-option label="激活" value="active" />
                <el-option label="停用" value="inactive" />
              </el-select>
            </el-form-item>
          </el-form>

          <el-table :data="filteredExternalLinks" style="width: 100%">
            <el-table-column prop="order" label="排序" width="80" />
            <el-table-column label="图标" width="80">
              <template #default="scope">
                <span style="font-size: 24px;">{{ scope.row.icon }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="链接标题" width="250" show-overflow-tooltip />
            <el-table-column prop="url" label="链接地址" width="300" show-overflow-tooltip>
              <template #default="scope">
                <el-link :href="scope.row.url" target="_blank" type="primary">{{ scope.row.url }}</el-link>
              </template>
            </el-table-column>
            <el-table-column label="分类" width="200">
              <template #default="scope">
                <div>
                  <el-tag size="small">{{ getCategoryName(scope.row.categoryId) }}</el-tag>
                  <br />
                  <el-tag v-if="scope.row.subcategoryId" size="small" type="success" style="margin-top: 5px;">
                    {{ getSubcategoryName(scope.row.subcategoryId) }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="类型" width="120">
              <template #default="scope">
                <el-tag :type="getLinkTypeColor(scope.row.linkType)" size="small">
                  {{ getLinkTypeName(scope.row.linkType) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="语言" width="80">
              <template #default="scope">
                <el-tag size="small">{{ scope.row.language }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="数据" width="150">
              <template #default="scope">
                <div class="stats">
                  <span><el-icon><View /></el-icon> {{ scope.row.views }}</span>
                  <span><el-icon><StarFilled /></el-icon> {{ scope.row.likes }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="状态" width="100">
              <template #default="scope">
                <el-switch
                  v-model="scope.row.status"
                  active-value="active"
                  inactive-value="inactive"
                  @change="toggleLinkStatus(scope.row.id)"
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="scope">
                <el-button size="small" @click="showExternalLinkDialog(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="deleteExternalLink(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 一级分类编辑对话框 -->
    <el-dialog
      v-model="categoryDialogVisible"
      :title="categoryForm.id ? '编辑一级分类' : '添加一级分类'"
      width="600px">
      <el-form :model="categoryForm" label-width="100px">
        <el-form-item label="分类名称" required>
          <el-input v-model="categoryForm.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="图标" required>
          <el-input v-model="categoryForm.icon" placeholder="请输入图标 Emoji，如 🤖" />
          <div v-if="categoryForm.icon" class="icon-preview">
            预览: <span style="font-size: 32px;">{{ categoryForm.icon }}</span>
          </div>
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

    <!-- 二级分类编辑对话框 -->
    <el-dialog
      v-model="subcategoryDialogVisible"
      :title="subcategoryForm.id ? '编辑二级分类' : '添加二级分类'"
      width="600px">
      <el-form :model="subcategoryForm" label-width="100px">
        <el-form-item label="一级分类" required>
          <el-select v-model="subcategoryForm.categoryId" placeholder="请选择一级分类">
            <el-option
              v-for="cat in store.getAllCategories"
              :key="cat.id"
              :label="cat.name"
              :value="cat.id">
              <span>{{ cat.icon }} {{ cat.name }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" required>
          <el-input v-model="subcategoryForm.name" placeholder="请输入二级分类名称" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="subcategoryForm.order" :min="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="subcategoryDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSubcategory">保存</el-button>
      </template>
    </el-dialog>

    <!-- 课程编辑对话框 -->
    <el-dialog
      v-model="lessonDialogVisible"
      :title="lessonForm.id ? '编辑课程' : '添加课程'"
      width="800px"
      :close-on-click-modal="false">
      <el-form :model="lessonForm" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="一级分类" required>
              <el-select v-model="lessonForm.categoryId" placeholder="选择一级分类" @change="onLessonCategoryChange">
                <el-option
                  v-for="cat in store.getAllCategories"
                  :key="cat.id"
                  :label="cat.name"
                  :value="cat.id">
                  <span>{{ cat.icon }} {{ cat.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="二级分类" required>
              <el-select v-model="lessonForm.subcategoryId" placeholder="选择二级分类" :disabled="!lessonForm.categoryId">
                <el-option
                  v-for="sub in store.getSubcategoriesByCategory(lessonForm.categoryId)"
                  :key="sub.id"
                  :label="sub.name"
                  :value="sub.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="课程标题" required>
          <el-input v-model="lessonForm.title" placeholder="请输入课程标题" />
        </el-form-item>

        <el-form-item label="简短描述">
          <el-input v-model="lessonForm.description" type="textarea" :rows="2" placeholder="一句话描述课程内容" />
        </el-form-item>

        <el-form-item label="课程内容">
          <el-input v-model="lessonForm.content" type="textarea" :rows="8" placeholder="详细的课程内容，支持Markdown格式" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="难度等级">
              <el-select v-model="lessonForm.level" placeholder="选择难度">
                <el-option label="入门" value="入门" />
                <el-option label="初级" value="初级" />
                <el-option label="中级" value="中级" />
                <el-option label="高级" value="高级" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="课程时长">
              <el-input v-model="lessonForm.duration" placeholder="如：30分钟" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="作者">
              <el-input v-model="lessonForm.author" placeholder="作者姓名" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="标签">
          <el-select v-model="lessonForm.tags" multiple placeholder="添加标签" allow-create filterable>
            <el-option label="基础" value="基础" />
            <el-option label="进阶" value="进阶" />
            <el-option label="实战" value="实战" />
            <el-option label="案例" value="案例" />
          </el-select>
        </el-form-item>

        <el-form-item label="封面图片">
          <div class="image-upload-section">
            <el-upload
              class="cover-uploader"
              action="#"
              :show-file-list="false"
              :auto-upload="false"
              :on-change="handleCoverChange"
              accept="image/*">
              <img v-if="lessonForm.coverImage" :src="lessonForm.coverImage" class="cover-preview" />
              <el-icon v-else class="upload-icon"><Plus /></el-icon>
            </el-upload>
            <div class="upload-tips">
              <p>建议尺寸: 800x450px</p>
              <p>支持格式: JPG, PNG</p>
              <el-button 
                v-if="lessonForm.coverImage" 
                type="danger" 
                size="small"
                @click="lessonForm.coverImage = ''"
                style="margin-top: 10px;">
                删除图片
              </el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="图片URL">
          <el-input v-model="lessonForm.coverImage" placeholder="或直接输入图片URL" clearable />
        </el-form-item>

        <el-form-item label="外部链接">
          <el-input 
            v-model="lessonForm.externalUrl" 
            placeholder="输入相关网页地址(如产品介绍、详细说明等)" 
            clearable>
            <template #prepend>
              <el-icon><Link /></el-icon>
            </template>
            <template #append>
              <el-button 
                v-if="lessonForm.externalUrl" 
                :icon="View" 
                @click="window.open(lessonForm.externalUrl, '_blank')">
                预览
              </el-button>
            </template>
          </el-input>
          <div style="color: #909399; font-size: 12px; margin-top: 5px;">
            填写完整的URL地址，如：https://www.example.com
          </div>
        </el-form-item>

        <el-form-item label="发布状态">
          <el-radio-group v-model="lessonForm.status">
            <el-radio label="published">已发布</el-radio>
            <el-radio label="draft">草稿</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="lessonDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveLesson">保存</el-button>
      </template>
    </el-dialog>

    <!-- 视频上传/编辑对话框 -->
    <el-dialog
      v-model="videoDialogVisible"
      :title="videoForm.id ? '编辑视频' : '上传视频'"
      width="800px"
      :close-on-click-modal="false">
      <el-form :model="videoForm" label-width="120px">
        <el-form-item label="选择分类" required>
          <el-cascader
            v-model="videoForm.categoryPath"
            :options="categoryOptions"
            :props="{ expandTrigger: 'hover', value: 'id', label: 'name', children: 'children' }"
            placeholder="选择一级分类和二级分类"
            @change="handleVideoCategoryChange"
            style="width: 100%">
          </el-cascader>
        </el-form-item>

        <el-form-item label="视频标题" required>
          <el-input v-model="videoForm.title" placeholder="请输入视频标题" />
        </el-form-item>

        <el-form-item label="视频描述">
          <el-input v-model="videoForm.description" type="textarea" :rows="3" placeholder="简要描述视频内容" />
        </el-form-item>

        <el-form-item label="视频文件" required>
          <div class="file-upload-section">
            <el-upload
              class="video-uploader"
              action="#"
              :show-file-list="false"
              :auto-upload="false"
              :on-change="handleVideoFileChange"
              accept="video/*">
              <div v-if="videoForm.url" class="video-preview">
                <video :src="videoForm.url" controls style="width: 100%; max-height: 300px;"></video>
                <el-button 
                  type="danger" 
                  size="small"
                  @click.stop="videoForm.url = ''"
                  style="margin-top: 10px;">
                  更换视频
                </el-button>
              </div>
              <div v-else class="upload-placeholder">
                <el-icon :size="60"><VideoPlay /></el-icon>
                <p>点击上传视频文件</p>
                <p class="tips">支持 MP4, WebM, MOV 格式</p>
              </div>
            </el-upload>
          </div>
        </el-form-item>

        <el-form-item label="视频URL">
          <el-input v-model="videoForm.url" placeholder="或直接输入视频URL地址" clearable />
          <div class="form-tips">支持本地上传或填入在线视频地址</div>
        </el-form-item>

        <el-form-item label="视频时长">
          <el-input v-model="videoForm.duration" placeholder="如：05:30" />
          <div class="form-tips">格式：分钟:秒，如 05:30 表示5分30秒</div>
        </el-form-item>

        <el-form-item label="缩略图">
          <div class="image-upload-section">
            <el-upload
              class="thumbnail-uploader"
              action="#"
              :show-file-list="false"
              :auto-upload="false"
              :on-change="handleThumbnailChange"
              accept="image/*">
              <img v-if="videoForm.thumbnail" :src="videoForm.thumbnail" class="thumbnail-preview" />
              <el-icon v-else class="upload-icon"><Plus /></el-icon>
            </el-upload>
            <div class="upload-tips">
              <p>建议尺寸: 1280x720px</p>
              <p>支持格式: JPG, PNG</p>
              <el-button 
                v-if="videoForm.thumbnail" 
                type="danger" 
                size="small"
                @click="videoForm.thumbnail = ''"
                style="margin-top: 10px;">
                删除缩略图
              </el-button>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="缩略图URL">
          <el-input v-model="videoForm.thumbnail" placeholder="或直接输入缩略图URL" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="videoDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveVideo">保存</el-button>
      </template>
    </el-dialog>

    <!-- 外部链接编辑对话框 -->
    <el-dialog
      v-model="externalLinkDialogVisible"
      :title="externalLinkForm.id ? '编辑外部链接' : '添加外部链接'"
      width="800px"
      :close-on-click-modal="false">
      <el-form :model="externalLinkForm" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="一级分类" required>
              <el-select v-model="externalLinkForm.categoryId" placeholder="选择一级分类">
                <el-option
                  v-for="cat in store.getAllCategories"
                  :key="cat.id"
                  :label="cat.name"
                  :value="cat.id">
                  <span>{{ cat.icon }} {{ cat.name }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="二级分类">
              <el-select 
                v-model="externalLinkForm.subcategoryId" 
                placeholder="选择二级分类（可选）" 
                :disabled="!externalLinkForm.categoryId"
                clearable>
                <el-option
                  v-for="sub in store.getSubcategoriesByCategory(externalLinkForm.categoryId)"
                  :key="sub.id"
                  :label="sub.name"
                  :value="sub.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="链接标题" required>
          <el-input v-model="externalLinkForm.title" placeholder="请输入链接标题" />
        </el-form-item>

        <el-form-item label="链接地址" required>
          <el-input v-model="externalLinkForm.url" placeholder="https://example.com" />
          <div v-if="externalLinkForm.url" style="margin-top: 8px;">
            <el-link :href="externalLinkForm.url" target="_blank" type="primary">
              <el-icon><Link /></el-icon> 预览链接
            </el-link>
          </div>
        </el-form-item>

        <el-form-item label="链接描述">
          <el-input v-model="externalLinkForm.description" type="textarea" :rows="3" placeholder="描述链接内容和用途" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="链接类型">
              <el-select v-model="externalLinkForm.linkType" placeholder="选择类型">
                <el-option label="🎓 学院平台" value="academy" />
                <el-option label="📖 技术文档" value="docs" />
                <el-option label="🎬 视频教程" value="video" />
                <el-option label="🔧 在线工具" value="tool" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="语言">
              <el-select v-model="externalLinkForm.language" placeholder="选择语言">
                <el-option label="中文" value="zh" />
                <el-option label="英文" value="en" />
                <el-option label="双语" value="both" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="图标">
              <el-input v-model="externalLinkForm.icon" placeholder="如: 🎓" />
              <div v-if="externalLinkForm.icon" class="icon-preview">
                <span style="font-size: 24px;">{{ externalLinkForm.icon }}</span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="需要会员">
              <el-switch v-model="externalLinkForm.isPremium" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序">
              <el-input-number v-model="externalLinkForm.order" :min="1" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="标签">
          <el-select v-model="externalLinkForm.tags" multiple placeholder="添加标签" allow-create filterable>
            <el-option label="官方课程" value="官方课程" />
            <el-option label="免费资源" value="免费资源" />
            <el-option label="编程教程" value="编程教程" />
            <el-option label="视频教学" value="视频教学" />
            <el-option label="技术文档" value="技术文档" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="externalLinkDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveExternalLink">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Reading, Plus, View, StarFilled, VideoPlay, Link } from '@element-plus/icons-vue'
import { useClassroomStore } from '../../store/classroom'

const store = useClassroomStore()

// 状态管理
const activeTab = ref('categories')
const categoryDialogVisible = ref(false)
const subcategoryDialogVisible = ref(false)
const lessonDialogVisible = ref(false)
const videoDialogVisible = ref(false)
const externalLinkDialogVisible = ref(false)

// 筛选
const filterCategory = ref(null)
const filterSubcategory = ref(null)
const videoFilterCategory = ref(null)
const videoFilterSubcategory = ref(null)
const linkFilterCategory = ref(null)
const linkFilterType = ref(null)
const linkFilterStatus = ref(null)

// 表单数据
const categoryForm = ref({
  id: null,
  name: '',
  icon: '',
  description: '',
  order: 1
})

const subcategoryForm = ref({
  id: null,
  categoryId: null,
  name: '',
  order: 1
})

const lessonForm = ref({
  id: null,
  categoryId: null,
  subcategoryId: null,
  title: '',
  description: '',
  content: '',
  coverImage: '',
  externalUrl: '',
  author: '',
  duration: '',
  level: '入门',
  tags: [],
  status: 'published'
})

const videoForm = ref({
  id: null,
  subcategoryId: null,
  categoryPath: [],
  title: '',
  description: '',
  url: '',
  thumbnail: '',
  duration: ''
})

const externalLinkForm = ref({
  id: null,
  categoryId: null,
  subcategoryId: null,
  title: '',
  description: '',
  url: '',
  icon: '🎓',
  linkType: 'academy',
  language: 'zh',
  isPremium: false,
  tags: [],
  order: 1
})

// 计算属性
const filteredLessons = computed(() => {
  let lessons = store.lessons
  if (filterCategory.value) {
    lessons = lessons.filter(l => l.categoryId === filterCategory.value)
  }
  if (filterSubcategory.value) {
    lessons = lessons.filter(l => l.subcategoryId === filterSubcategory.value)
  }
  return lessons
})

const filteredExternalLinks = computed(() => {
  let links = store.getAllExternalLinks
  if (linkFilterCategory.value) {
    links = links.filter(l => l.categoryId === linkFilterCategory.value)
  }
  if (linkFilterType.value) {
    links = links.filter(l => l.linkType === linkFilterType.value)
  }
  if (linkFilterStatus.value) {
    links = links.filter(l => l.status === linkFilterStatus.value)
  }
  return links
})

// 视频管理的级联选择器数据
const categoryOptions = computed(() => {
  return store.getAllCategories.map(cat => ({
    id: cat.id,
    name: cat.name,
    children: store.getSubcategoriesByCategory(cat.id).map(sub => ({
      id: sub.id,
      name: sub.name
    }))
  }))
})

// 方法
const onFilterChange = () => {
  filterSubcategory.value = null
}

const getCategoryName = (categoryId) => {
  const cat = store.categories.find(c => c.id === categoryId)
  return cat ? cat.name : ''
}

const getSubcategoryName = (subcategoryId) => {
  const sub = store.subcategories.find(s => s.id === subcategoryId)
  return sub ? sub.name : ''
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

// 一级分类操作
const showCategoryDialog = (category = null) => {
  if (category) {
    categoryForm.value = { ...category }
  } else {
    categoryForm.value = {
      id: null,
      name: '',
      icon: '',
      description: '',
      order: store.categories.length + 1
    }
  }
  categoryDialogVisible.value = true
}

const saveCategory = () => {
  if (!categoryForm.value.name || !categoryForm.value.icon) {
    ElMessage.warning('请填写分类名称和图标')
    return
  }
  
  if (categoryForm.value.id) {
    store.updateCategory(categoryForm.value)
    ElMessage.success('更新成功')
  } else {
    store.addCategory(categoryForm.value)
    ElMessage.success('添加成功')
  }
  
  categoryDialogVisible.value = false
}

const deleteCategory = (id) => {
  ElMessageBox.confirm('删除分类将同时删除其下的所有子分类和课程，确定要删除吗？', '警告', {
    type: 'warning'
  }).then(() => {
    store.deleteCategory(id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 二级分类操作
const showSubcategoryDialog = (subcategory = null) => {
  if (subcategory) {
    subcategoryForm.value = { ...subcategory }
  } else {
    subcategoryForm.value = {
      id: null,
      categoryId: null,
      name: '',
      order: 1
    }
  }
  subcategoryDialogVisible.value = true
}

const saveSubcategory = () => {
  if (!subcategoryForm.value.categoryId || !subcategoryForm.value.name) {
    ElMessage.warning('请选择一级分类并填写名称')
    return
  }
  
  if (subcategoryForm.value.id) {
    store.updateSubcategory(subcategoryForm.value)
    ElMessage.success('更新成功')
  } else {
    store.addSubcategory(subcategoryForm.value)
    ElMessage.success('添加成功')
  }
  
  subcategoryDialogVisible.value = false
}

const deleteSubcategory = (id) => {
  ElMessageBox.confirm('删除二级分类将同时删除其下的所有课程，确定要删除吗？', '警告', {
    type: 'warning'
  }).then(() => {
    store.deleteSubcategory(id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 课程操作
const showLessonDialog = (lesson = null) => {
  if (lesson) {
    lessonForm.value = { ...lesson }
  } else {
    lessonForm.value = {
      id: null,
      categoryId: null,
      subcategoryId: null,
      title: '',
      description: '',
      content: '',
      coverImage: '',
      externalUrl: '',
      author: '技术专家',
      duration: '',
      level: '入门',
      tags: [],
      status: 'published'
    }
  }
  lessonDialogVisible.value = true
}

const onLessonCategoryChange = () => {
  lessonForm.value.subcategoryId = null
}

const handleCoverChange = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    lessonForm.value.coverImage = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

const saveLesson = () => {
  if (!lessonForm.value.categoryId || !lessonForm.value.subcategoryId || !lessonForm.value.title) {
    ElMessage.warning('请填写必填项')
    return
  }
  
  if (lessonForm.value.id) {
    store.updateLesson(lessonForm.value)
    ElMessage.success('更新成功')
  } else {
    store.addLesson(lessonForm.value)
    ElMessage.success('添加成功')
  }
  
  lessonDialogVisible.value = false
}

const deleteLesson = (id) => {
  ElMessageBox.confirm('确定要删除这个课程吗？', '警告', {
    type: 'warning'
  }).then(() => {
    store.deleteLesson(id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 视频管理操作
const onVideoFilterChange = () => {
  videoFilterSubcategory.value = null
}

const getSubcategoryVideos = (subcategoryId) => {
  return store.getVideosBySubcategory(subcategoryId)
}

const getAllVideosCount = () => {
  let count = 0
  store.subcategories.forEach(sub => {
    if (sub.videos && sub.videos.length > 0) {
      count += sub.videos.length
    }
  })
  return count
}

const showVideoDialog = (video = null, subcategoryId = null) => {
  if (video) {
    // 编辑视频
    videoForm.value = {
      ...video,
      subcategoryId: subcategoryId,
      categoryPath: []
    }
    // 设置级联选择器的值
    const subcategory = store.subcategories.find(s => s.id === subcategoryId)
    if (subcategory) {
      videoForm.value.categoryPath = [subcategory.categoryId, subcategory.id]
    }
  } else {
    // 新增视频
    videoForm.value = {
      id: null,
      subcategoryId: subcategoryId || null,
      categoryPath: subcategoryId ? getCategoryPath(subcategoryId) : [],
      title: '',
      description: '',
      url: '',
      thumbnail: '',
      duration: ''
    }
  }
  videoDialogVisible.value = true
}

const getCategoryPath = (subcategoryId) => {
  const subcategory = store.subcategories.find(s => s.id === subcategoryId)
  return subcategory ? [subcategory.categoryId, subcategory.id] : []
}

const handleVideoCategoryChange = (value) => {
  if (value && value.length === 2) {
    videoForm.value.subcategoryId = value[1]
  }
}

const handleVideoFileChange = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    videoForm.value.url = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

const handleThumbnailChange = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    videoForm.value.thumbnail = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

const saveVideo = () => {
  if (!videoForm.value.subcategoryId || !videoForm.value.title || !videoForm.value.url) {
    ElMessage.warning('请填写必填项（分类、标题、视频文件）')
    return
  }
  
  const videoData = {
    title: videoForm.value.title,
    description: videoForm.value.description,
    url: videoForm.value.url,
    thumbnail: videoForm.value.thumbnail,
    duration: videoForm.value.duration
  }
  
  if (videoForm.value.id) {
    // 更新视频
    store.updateVideo(videoForm.value.subcategoryId, videoForm.value.id, videoData)
    ElMessage.success('视频更新成功')
  } else {
    // 添加视频
    const videoId = store.addVideo(videoForm.value.subcategoryId, videoData)
    if (videoId) {
      ElMessage.success('视频上传成功')
    } else {
      ElMessage.error('上传失败')
      return
    }
  }
  
  videoDialogVisible.value = false
}

const deleteVideo = (subcategoryId, videoId) => {
  ElMessageBox.confirm('确定要删除这个视频吗？', '警告', {
    type: 'warning'
  }).then(() => {
    store.deleteVideo(subcategoryId, videoId)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// ===== 外部链接操作 =====
const onLinkFilterChange = () => {
  // 筛选变化时的处理
}

const getLinkTypeName = (type) => {
  const types = {
    'academy': '学院平台',
    'docs': '技术文档',
    'video': '视频教程',
    'tool': '在线工具'
  }
  return types[type] || type
}

const getLinkTypeColor = (type) => {
  const colors = {
    'academy': '',
    'docs': 'success',
    'video': 'warning',
    'tool': 'info'
  }
  return colors[type] || ''
}

const showExternalLinkDialog = (link = null) => {
  if (link) {
    externalLinkForm.value = { ...link }
  } else {
    externalLinkForm.value = {
      id: null,
      categoryId: null,
      subcategoryId: null,
      title: '',
      description: '',
      url: '',
      icon: '🎓',
      linkType: 'academy',
      language: 'zh',
      isPremium: false,
      tags: [],
      order: store.externalLinks.length + 1
    }
  }
  externalLinkDialogVisible.value = true
}

const saveExternalLink = () => {
  if (!externalLinkForm.value.categoryId || !externalLinkForm.value.title || !externalLinkForm.value.url) {
    ElMessage.warning('请填写分类、标题和链接地址')
    return
  }

  // 验证URL格式
  try {
    new URL(externalLinkForm.value.url)
  } catch {
    ElMessage.warning('请输入有效的URL地址（如：https://example.com）')
    return
  }

  if (externalLinkForm.value.id) {
    store.updateExternalLink(externalLinkForm.value)
    ElMessage.success('更新成功')
  } else {
    store.addExternalLink(externalLinkForm.value)
    ElMessage.success('添加成功')
  }

  externalLinkDialogVisible.value = false
}

const deleteExternalLink = (id) => {
  ElMessageBox.confirm('确定要删除这个外部链接吗？', '确认删除', {
    type: 'warning'
  }).then(() => {
    store.deleteExternalLink(id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

const toggleLinkStatus = (id) => {
  store.toggleLinkStatus(id)
  ElMessage.success('状态已更新')
}

// 初始化
onMounted(() => {
  store.loadFromLocalStorage()
})
</script>

<style scoped>
.classroom-manage {
  padding: 20px;
}

.header-card {
  margin-bottom: 20px;
}

.header-card h2 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 24px;
  margin-bottom: 8px;
}

.header-card p {
  color: #666;
  font-size: 14px;
}

.manage-tabs {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  font-size: 18px;
  margin: 0;
}

.category-group {
  margin-bottom: 30px;
}

.category-group-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  margin-bottom: 12px;
}

.category-icon {
  font-size: 32px;
}

.category-group-header h4 {
  margin: 0;
  flex: 1;
  font-size: 18px;
}

.filter-form {
  margin-bottom: 20px;
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
}

.lesson-cover {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
}

.no-cover {
  width: 80px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  color: #999;
  font-size: 12px;
  border-radius: 4px;
}

.stats {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stats span {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
}

.icon-preview {
  margin-top: 10px;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
  text-align: center;
}

.image-upload-section {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.cover-uploader {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s;
}

.cover-uploader:hover {
  border-color: #409eff;
}

.cover-preview {
  width: 200px;
  height: 150px;
  object-fit: cover;
  display: block;
}

.upload-icon {
  font-size: 48px;
  color: #8c939d;
  width: 200px;
  height: 150px;
  line-height: 150px;
  text-align: center;
}

.upload-tips {
  color: #606266;
  font-size: 13px;
}

.upload-tips p {
  margin: 5px 0;
}

/* 视频管理样式 */
.video-category-group {
  margin-bottom: 20px;
}

.subcategory-video-section {
  margin-bottom: 30px;
}

.videos-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.video-item {
  display: flex;
  gap: 16px;
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e8e8e8;
  transition: all 0.3s;
}

.video-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.video-thumbnail {
  position: relative;
  width: 180px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.video-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-thumbnail {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
}

.video-duration-badge {
  position: absolute;
  bottom: 6px;
  right: 6px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
}

.video-item-info {
  flex: 1;
  min-width: 0;
}

.video-item-info h5 {
  margin: 0 0 8px 0;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.video-item-info p {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: #666;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-stats-admin {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #999;
}

.video-stats-admin span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.video-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex-shrink: 0;
}

/* 视频上传对话框 */
.file-upload-section {
  margin-bottom: 16px;
}

.video-uploader,
.thumbnail-uploader {
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s;
}

.video-uploader:hover,
.thumbnail-uploader:hover {
  border-color: #409eff;
}

.video-preview {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.upload-placeholder {
  padding: 40px;
  text-align: center;
  color: #8c939d;
}

.upload-placeholder p {
  margin: 8px 0 0 0;
}

.upload-placeholder .tips {
  font-size: 12px;
  color: #b0b0b0;
}

.thumbnail-preview {
  width: 240px;
  height: 135px;
  object-fit: cover;
  display: block;
}

.form-tips {
  margin-top: 5px;
  font-size: 12px;
  color: #909399;
}
</style>
