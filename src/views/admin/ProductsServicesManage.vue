<template>
  <div class="products-services-manage">
    <el-card class="header-card">
      <h2><el-icon><Box /></el-icon> 产品与服务多级分类管理</h2>
      <p>管理产品与服务的层级分类和内容（一级→二级→三级→产品）</p>
    </el-card>

    <el-tabs v-model="activeTab" class="content-tabs">
      <!-- 导航栏配置管理 -->
      <el-tab-pane label="🧭 导航栏配置" name="navbar">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>产品与服务 - 导航栏子菜单配置</span>
              <el-button type="primary" @click="saveNavbarConfig" :loading="saving">
                <el-icon><Check /></el-icon> 保存配置
              </el-button>
            </div>
          </template>

          <div class="navbar-config-section">
            <el-alert
              title="提示"
              type="info"
              :closable="false"
              style="margin-bottom: 20px;">
              拖拽行可调整子菜单顺序，修改名称后点击"保存配置"生效。导航栏会自动同步这些分类。
            </el-alert>

            <el-table 
              :data="navbarChildrenConfig" 
              border 
              stripe
              row-key="id"
              ref="navbarTableRef"
              @row-drop="handleNavbarRowDrop">
              <el-table-column label="拖拽" width="60">
                <template #default>
                  <el-icon class="drag-icon" style="cursor: grab;"><Rank /></el-icon>
                </template>
              </el-table-column>
              <el-table-column prop="order" label="排序" width="80" />
              <el-table-column label="中文名称" min-width="150">
                <template #default="{ row }">
                  <el-input v-model="row.name['zh-CN']" placeholder="请输入中文名称" />
                </template>
              </el-table-column>
              <el-table-column label="英文名称" min-width="150">
                <template #default="{ row }">
                  <el-input v-model="row.name['en-US']" placeholder="Please enter English name" />
                </template>
              </el-table-column>
              <el-table-column label="分类ID" width="100">
                <template #default="{ row }">
                  <el-tag v-if="row.categoryId" type="primary">{{ row.categoryId }}</el-tag>
                  <el-tag v-else type="info">工具</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="可见" width="80">
                <template #default="{ row }">
                  <el-switch v-model="row.visible" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-card>
      </el-tab-pane>

      <!-- 一级分类管理 -->
      <el-tab-pane label="📦 一级分类（6个子系统）" name="level1">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>一级分类管理（与导航栏保持一致）</span>
              <el-button type="primary" @click="showAddLevel1Dialog">
                <el-icon><Plus /></el-icon> 添加一级分类
              </el-button>
            </div>
          </template>

          <el-table :data="level1Categories" border stripe>
            <el-table-column prop="order" label="排序" width="80" />
            <el-table-column label="名称" min-width="150">
              <template #default="{ row }">
                <div class="name-cell">
                  <strong>{{ row.name['zh-CN'] }}</strong>
                  <span class="en-name">{{ row.name['en-US'] }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="描述" min-width="200">
              <template #default="{ row }">
                {{ row.description['zh-CN'] }}
              </template>
            </el-table-column>
            <el-table-column label="图片" width="120">
              <template #default="{ row }">
                <el-image 
                  v-if="row.image" 
                  :src="row.image" 
                  fit="cover"
                  class="table-image"
                  :preview-src-list="[row.image]" />
              </template>
            </el-table-column>
            <el-table-column label="可见" width="80">
              <template #default="{ row }">
                <el-tag :type="row.visible ? 'success' : 'info'">
                  {{ row.visible ? '是' : '否' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="editLevel1(row)">编辑</el-button>
                <el-button link type="danger" @click="deleteLevel1(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- 二级分类管理 -->
      <el-tab-pane label="📂 二级分类" name="level2">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>二级分类管理</span>
              <el-button type="primary" @click="showAddLevel2Dialog">
                <el-icon><Plus /></el-icon> 添加二级分类
              </el-button>
            </div>
          </template>

          <el-table :data="level2Categories" border stripe>
            <el-table-column label="一级分类" min-width="120">
              <template #default="{ row }">
                {{ getLevel1Name(row.parentId) }}
              </template>
            </el-table-column>
            <el-table-column prop="order" label="排序" width="80" />
            <el-table-column label="名称" min-width="150">
              <template #default="{ row }">
                <div class="name-cell">
                  <strong>{{ row.name['zh-CN'] }}</strong>
                  <span class="en-name">{{ row.name['en-US'] }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="描述" min-width="200">
              <template #default="{ row }">
                {{ row.description['zh-CN'] }}
              </template>
            </el-table-column>
            <el-table-column label="图片" width="120">
              <template #default="{ row }">
                <el-image 
                  v-if="row.image" 
                  :src="row.image" 
                  fit="cover"
                  class="table-image"
                  :preview-src-list="[row.image]" />
              </template>
            </el-table-column>
            <el-table-column label="可见" width="80">
              <template #default="{ row }">
                <el-tag :type="row.visible ? 'success' : 'info'">
                  {{ row.visible ? '是' : '否' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="editLevel2(row)">编辑</el-button>
                <el-button link type="danger" @click="deleteLevel2(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- 三级分类管理 -->
      <el-tab-pane label="📄 三级分类" name="level3">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>三级分类管理</span>
              <el-button type="primary" @click="showAddLevel3Dialog">
                <el-icon><Plus /></el-icon> 添加三级分类
              </el-button>
            </div>
          </template>

          <el-table :data="level3Categories" border stripe>
            <el-table-column label="一级分类" min-width="120">
              <template #default="{ row }">
                {{ getLevel1NameByLevel2(row.parentId) }}
              </template>
            </el-table-column>
            <el-table-column label="二级分类" min-width="120">
              <template #default="{ row }">
                {{ getLevel2Name(row.parentId) }}
              </template>
            </el-table-column>
            <el-table-column prop="order" label="排序" width="80" />
            <el-table-column label="名称" min-width="150">
              <template #default="{ row }">
                <div class="name-cell">
                  <strong>{{ row.name['zh-CN'] }}</strong>
                  <span class="en-name">{{ row.name['en-US'] }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="描述" min-width="200">
              <template #default="{ row }">
                {{ row.description['zh-CN'] }}
              </template>
            </el-table-column>
            <el-table-column label="图片" width="120">
              <template #default="{ row }">
                <el-image 
                  v-if="row.image" 
                  :src="row.image" 
                  fit="cover"
                  class="table-image"
                  :preview-src-list="[row.image]" />
              </template>
            </el-table-column>
            <el-table-column label="可见" width="80">
              <template #default="{ row }">
                <el-tag :type="row.visible ? 'success' : 'info'">
                  {{ row.visible ? '是' : '否' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="editLevel3(row)">编辑</el-button>
                <el-button link type="danger" @click="deleteLevel3(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- 产品管理 -->
      <el-tab-pane label="🛠️ 产品详情" name="products">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>产品详情管理</span>
              <el-button type="primary" @click="showAddProductDialog">
                <el-icon><Plus /></el-icon> 添加产品
              </el-button>
            </div>
          </template>

          <el-table :data="products" border stripe>
            <el-table-column label="分类路径" min-width="200">
              <template #default="{ row }">
                <el-tag size="small" style="margin-right: 4px;">{{ getLevel1Name(row.level1CategoryId) }}</el-tag>
                <el-tag size="small" type="success" style="margin-right: 4px;">{{ getLevel2Name(row.level2CategoryId) }}</el-tag>
                <el-tag size="small" type="warning">{{ getLevel3Name(row.level3CategoryId) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="产品名称" min-width="150">
              <template #default="{ row }">
                <div class="name-cell">
                  <strong>{{ row.name['zh-CN'] }}</strong>
                  <span class="en-name">{{ row.name['en-US'] }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="图片" width="120">
              <template #default="{ row }">
                <el-image 
                  v-if="row.images && row.images[0]" 
                  :src="row.images[0]" 
                  fit="cover"
                  class="table-image"
                  :preview-src-list="row.images" />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{ row }">
                <el-button link type="primary" @click="editProduct(row)">编辑</el-button>
                <el-button link type="danger" @click="deleteProduct(row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- 页面横幅设置 -->
      <el-tab-pane label="🎨 页面横幅" name="banner">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>页面横幅设置（PANTONE 2736C主色调）</span>
              <el-button type="primary" @click="saveBanner" :loading="saving">
                <el-icon><Check /></el-icon> 保存横幅
              </el-button>
            </div>
          </template>

          <el-form :model="bannerForm" label-width="120px">
            <el-divider content-position="left">中文内容</el-divider>
            <el-form-item label="标题">
              <el-input v-model="bannerForm.title['zh-CN']" size="large" />
            </el-form-item>
            <el-form-item label="副标题">
              <el-input v-model="bannerForm.subtitle['zh-CN']" type="textarea" :rows="2" />
            </el-form-item>

            <el-divider content-position="left">English Content</el-divider>
            <el-form-item label="Title">
              <el-input v-model="bannerForm.title['en-US']" size="large" />
            </el-form-item>
            <el-form-item label="Subtitle">
              <el-input v-model="bannerForm.subtitle['en-US']" type="textarea" :rows="2" />
            </el-form-item>

            <el-divider content-position="left">横幅样式（PANTONE 2736C）</el-divider>
            <el-form-item label="背景图片">
              <el-input v-model="bannerForm.backgroundImage" placeholder="输入图片URL" />
              <div class="form-tip">推荐尺寸：1920x600px</div>
            </el-form-item>
            <el-form-item label="背景颜色">
              <el-color-picker v-model="bannerForm.backgroundColor" show-alpha />
              <span class="color-text">{{ bannerForm.backgroundColor }}</span>
              <el-button size="small" @click="bannerForm.backgroundColor = '#0047BB'" style="margin-left: 10px;">
                使用PANTONE 2736C
              </el-button>
            </el-form-item>
            <el-form-item label="文字颜色">
              <el-color-picker v-model="bannerForm.textColor" />
              <span class="color-text">{{ bannerForm.textColor }}</span>
            </el-form-item>
          </el-form>

          <el-divider content-position="left">预览效果</el-divider>
          <div 
            class="banner-preview" 
            :style="{
              backgroundImage: bannerForm.backgroundImage ? `url(${bannerForm.backgroundImage})` : 'none',
              background: bannerForm.backgroundImage ? `linear-gradient(135deg, ${bannerForm.backgroundColor}99 0%, ${bannerForm.backgroundColor} 100%), url(${bannerForm.backgroundImage})` : `linear-gradient(135deg, ${bannerForm.backgroundColor} 0%, #0066dd 100%)`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              color: bannerForm.textColor
            }">
            <h1>{{ bannerForm.title['zh-CN'] }}</h1>
            <p>{{ bannerForm.subtitle['zh-CN'] }}</p>
          </div>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 一级分类编辑对话框 -->
    <el-dialog 
      v-model="level1DialogVisible" 
      :title="level1Form.id ? '编辑一级分类' : '添加一级分类'"
      width="600px">
      <el-form :model="level1Form" label-width="100px">
        <el-form-item label="中文名称">
          <el-input v-model="level1Form.name['zh-CN']" />
        </el-form-item>
        <el-form-item label="英文名称">
          <el-input v-model="level1Form.name['en-US']" />
        </el-form-item>
        <el-form-item label="中文描述">
          <el-input v-model="level1Form.description['zh-CN']" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="英文描述">
          <el-input v-model="level1Form.description['en-US']" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="分类图片">
          <div class="upload-area">
            <el-upload
              drag
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleLevel1ImageChange"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp">
              <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
              <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip">支持 JPG、PNG、GIF、WebP 格式，大小不超过 2MB</div>
            </el-upload>
            <div v-if="level1Form.image" class="image-preview">
              <el-image :src="level1Form.image" fit="cover" />
              <el-button size="small" type="danger" @click="level1Form.image = ''">删除</el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="level1Form.icon" placeholder="Element Plus图标名称" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="level1Form.order" :min="1" />
        </el-form-item>
        <el-form-item label="是否可见">
          <el-switch v-model="level1Form.visible" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="level1DialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveLevel1">保存</el-button>
      </template>
    </el-dialog>

    <!-- 二级分类编辑对话框 -->
    <el-dialog 
      v-model="level2DialogVisible" 
      :title="level2Form.id ? '编辑二级分类' : '添加二级分类'"
      width="600px">
      <el-form :model="level2Form" label-width="100px">
        <el-form-item label="所属一级分类">
          <el-select v-model="level2Form.parentId" placeholder="请选择一级分类">
            <el-option 
              v-for="cat in level1Categories" 
              :key="cat.id" 
              :label="cat.name['zh-CN']" 
              :value="cat.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="中文名称">
          <el-input v-model="level2Form.name['zh-CN']" />
        </el-form-item>
        <el-form-item label="英文名称">
          <el-input v-model="level2Form.name['en-US']" />
        </el-form-item>
        <el-form-item label="中文描述">
          <el-input v-model="level2Form.description['zh-CN']" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="英文描述">
          <el-input v-model="level2Form.description['en-US']" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="分类图片">
          <div class="upload-area">
            <el-upload
              drag
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleLevel2ImageChange"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp">
              <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
              <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip">支持 JPG、PNG、GIF、WebP 格式，大小不超过 2MB</div>
            </el-upload>
            <div v-if="level2Form.image" class="image-preview">
              <el-image :src="level2Form.image" fit="cover" />
              <el-button size="small" type="danger" @click="level2Form.image = ''">删除</el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="level2Form.order" :min="1" />
        </el-form-item>
        <el-form-item label="是否可见">
          <el-switch v-model="level2Form.visible" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="level2DialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveLevel2">保存</el-button>
      </template>
    </el-dialog>

    <!-- 三级分类编辑对话框 -->
    <el-dialog 
      v-model="level3DialogVisible" 
      :title="level3Form.id ? '编辑三级分类' : '添加三级分类'"
      width="600px">
      <el-form :model="level3Form" label-width="100px">
        <el-form-item label="所属一级分类">
          <el-select v-model="selectedLevel1ForLevel3" @change="onLevel1ChangeForLevel3" placeholder="请选择一级分类">
            <el-option 
              v-for="cat in level1Categories" 
              :key="cat.id" 
              :label="cat.name['zh-CN']" 
              :value="cat.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属二级分类">
          <el-select v-model="level3Form.parentId" placeholder="请选择二级分类">
            <el-option 
              v-for="cat in filteredLevel2ForLevel3" 
              :key="cat.id" 
              :label="cat.name['zh-CN']" 
              :value="cat.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="中文名称">
          <el-input v-model="level3Form.name['zh-CN']" />
        </el-form-item>
        <el-form-item label="英文名称">
          <el-input v-model="level3Form.name['en-US']" />
        </el-form-item>
        <el-form-item label="中文描述">
          <el-input v-model="level3Form.description['zh-CN']" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="英文描述">
          <el-input v-model="level3Form.description['en-US']" type="textarea" :rows="3" />
        </el-form-item>
        <el-form-item label="分类图片">
          <div class="upload-area">
            <el-upload
              drag
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleLevel3ImageChange"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp">
              <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
              <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip">支持 JPG、PNG、GIF、WebP 格式，大小不超过 2MB</div>
            </el-upload>
            <div v-if="level3Form.image" class="image-preview">
              <el-image :src="level3Form.image" fit="cover" />
              <el-button size="small" type="danger" @click="level3Form.image = ''">删除</el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="level3Form.order" :min="1" />
        </el-form-item>
        <el-form-item label="是否可见">
          <el-switch v-model="level3Form.visible" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="level3DialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveLevel3">保存</el-button>
      </template>
    </el-dialog>

    <!-- 产品编辑对话框 -->
    <el-dialog 
      v-model="productDialogVisible" 
      :title="productForm.id ? '编辑产品' : '添加产品'"
      width="700px">
      <el-form :model="productForm" label-width="120px">
        <el-form-item label="所属一级分类">
          <el-select v-model="productForm.level1CategoryId" @change="onLevel1ChangeForProduct" placeholder="请选择一级分类">
            <el-option 
              v-for="cat in level1Categories" 
              :key="cat.id" 
              :label="cat.name['zh-CN']" 
              :value="cat.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属二级分类">
          <el-select v-model="productForm.level2CategoryId" @change="onLevel2ChangeForProduct" placeholder="请选择二级分类">
            <el-option 
              v-for="cat in filteredLevel2ForProduct" 
              :key="cat.id" 
              :label="cat.name['zh-CN']" 
              :value="cat.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属三级分类">
          <el-select v-model="productForm.level3CategoryId" placeholder="请选择三级分类">
            <el-option 
              v-for="cat in filteredLevel3ForProduct" 
              :key="cat.id" 
              :label="cat.name['zh-CN']" 
              :value="cat.id" />
          </el-select>
        </el-form-item>
        <el-divider />
        <el-form-item label="产品中文名称">
          <el-input v-model="productForm.name['zh-CN']" />
        </el-form-item>
        <el-form-item label="产品英文名称">
          <el-input v-model="productForm.name['en-US']" />
        </el-form-item>
        <el-form-item label="中文描述">
          <el-input v-model="productForm.description['zh-CN']" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="英文描述">
          <el-input v-model="productForm.description['en-US']" type="textarea" :rows="4" />
        </el-form-item>
        <el-form-item label="产品图片">
          <div class="product-images-upload">
            <el-upload
              drag
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleProductImageChange"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp">
              <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
              <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip">支持 JPG、PNG、GIF、WebP 格式，大小不超过 2MB，支持多张</div>
            </el-upload>
            <div v-if="productForm.images && productForm.images.length > 0" class="product-images-grid">
              <div 
                v-for="(img, index) in productForm.images.filter(i => i)" 
                :key="index" 
                class="product-image-item">
                <el-image :src="img" fit="cover" />
                <div class="product-image-overlay">
                  <span class="image-number">{{ index + 1 }}</span>
                  <el-button size="small" type="danger" circle @click="removeProductImage(index)">
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="产品视频">
          <div class="product-video-upload">
            <el-alert 
              title="💡 支持本地上传和链接地址两种方式"
              type="info" 
              :closable="false"
              style="margin-bottom: 12px">
              <p>• 本地上传: 支持MP4、AVI、MOV格式，建议<50MB</p>
              <p>• 链接地址: YouTube、Vimeo、腾讯视频嵌入链接</p>
            </el-alert>
            
            <el-tabs v-model="videoUploadMode" class="video-tabs">
              <el-tab-pane label="📤 本地上传" name="upload">
                <el-upload
                  drag
                  :auto-upload="false"
                  :show-file-list="false"
                  :on-change="handleProductVideoChange"
                  accept="video/mp4,video/avi,video/quicktime">
                  <el-icon class="el-icon--upload"><VideoCamera /></el-icon>
                  <div class="el-upload__text">将视频拖到此处，或<em>点击上传</em></div>
                  <div class="el-upload__tip">支持 MP4、AVI、MOV 格式，大小建议<50MB（最大100MB）</div>
                </el-upload>
              </el-tab-pane>
              
              <el-tab-pane label="🔗 链接地址" name="link">
                <el-input 
                  v-model="productForm.videoUrl" 
                  placeholder="https://www.youtube.com/embed/VIDEO_ID"
                  clearable>
                  <template #prepend>
                    <el-icon><Link /></el-icon> URL
                  </template>
                </el-input>
                <div class="video-link-tips">
                  <el-text type="info" size="small">
                    <el-icon><InfoFilled /></el-icon>
                    示例: https://www.youtube.com/embed/dQw4w9WgXcQ
                  </el-text>
                </div>
              </el-tab-pane>
            </el-tabs>
            
            <!-- 视频预览 -->
            <div v-if="productForm.videoUrl" class="video-preview-box">
              <div class="preview-header">
                <el-text type="success"><el-icon><Check /></el-icon> 视频已设置</el-text>
                <el-button size="small" type="danger" @click="productForm.videoUrl = ''">
                  <el-icon><Delete /></el-icon> 删除视频
                </el-button>
              </div>
              <div class="video-preview-content">
                <video 
                  v-if="productForm.videoUrl.startsWith('data:') || productForm.videoUrl.endsWith('.mp4')"
                  :src="productForm.videoUrl"
                  controls
                  style="width: 100%; max-height: 300px;">
                </video>
                <iframe 
                  v-else
                  :src="productForm.videoUrl"
                  width="100%"
                  height="300"
                  frameborder="0"
                  allowfullscreen>
                </iframe>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="规格参数">
          <el-input v-model="productForm.specifications" type="textarea" :rows="3" placeholder="请输入产品规格参数" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="productDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveProduct">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Plus, Edit, Delete, Check, Box, UploadFilled, Rank,
  VideoCamera, Link, InfoFilled
} from '@element-plus/icons-vue'
import { useProductsServicesStore } from '../../store/productsServices'
import { usePageContentStore } from '../../store/pageContent'
import Sortable from 'sortablejs'

// 图片处理工具函数
const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = (error) => reject(error)
    reader.readAsDataURL(file)
  })
}

const validateImageFile = (file, maxSize = 2) => {
  const isImage = /^image\/(jpeg|jpg|png|gif|webp)$/i.test(file.type)
  const isLtMaxSize = file.size / 1024 / 1024 < maxSize
  
  if (!isImage) {
    ElMessage.error('只支持JPG、PNG、GIF、WebP格式的图片!')
    return false
  }
  if (!isLtMaxSize) {
    ElMessage.error(`图片大小不能超过 ${maxSize}MB!`)
    return false
  }
  return true
}

const store = useProductsServicesStore()
const pageContentStore = usePageContentStore()

const activeTab = ref('navbar')
const saving = ref(false)
const navbarTableRef = ref(null)

// 导航栏配置数据
const navbarChildrenConfig = ref([])

// 初始化导航栏配置
const initNavbarConfig = () => {
  const navItems = pageContentStore.navItems || []
  const productsNav = navItems.find(item => item.id === 'products')
  
  if (productsNav && productsNav.children) {
    // 深拷贝并添加categoryId字段
    navbarChildrenConfig.value = productsNav.children.map(child => {
      // 从path中提取category参数
      const match = child.path.match(/category=(\d+)/)
      return {
        ...JSON.parse(JSON.stringify(child)),
        categoryId: match ? parseInt(match[1]) : null
      }
    })
  }
}

// 初始化拖拽排序功能
const initNavbarSortable = () => {
  nextTick(() => {
    if (!navbarTableRef.value || !navbarTableRef.value.$el) return
    
    const tbody = navbarTableRef.value.$el.querySelector('.el-table__body-wrapper tbody')
    if (!tbody) return
    
    Sortable.create(tbody, {
      animation: 200,
      handle: '.drag-icon',
      onEnd: (evt) => {
        const { oldIndex, newIndex } = evt
        if (oldIndex === newIndex) return
        
        // 更新数组顺序
        const movedItem = navbarChildrenConfig.value.splice(oldIndex, 1)[0]
        navbarChildrenConfig.value.splice(newIndex, 0, movedItem)
        
        // 更新order值
        navbarChildrenConfig.value.forEach((item, index) => {
          item.order = index + 1
        })
        
        ElMessage.success('顺序已调整，请点击"保存配置"生效')
      }
    })
  })
}

// 保存导航栏配置
const saveNavbarConfig = () => {
  saving.value = true
  
  try {
    // 更新store中的导航配置
    const navItems = [...pageContentStore.navItems]
    const productsNavIndex = navItems.findIndex(item => item.id === 'products')
    
    if (productsNavIndex !== -1) {
      // 更新产品与服务的children
      navItems[productsNavIndex].children = navbarChildrenConfig.value.map(child => ({
        id: child.id,
        name: { ...child.name },
        path: child.categoryId 
          ? `/products-services?category=${child.categoryId}`
          : child.path,
        order: child.order,
        visible: child.visible
      }))
      
      // 保存到localStorage
      localStorage.setItem('navItems', JSON.stringify(navItems))
      
      // 更新版本号，强制刷新
      const newVersion = `2.5.${Date.now()}`
      localStorage.setItem('navConfigVersion', newVersion)
      
      // 重新加载导航栏
      pageContentStore.loadNavItems()
      
      ElMessage.success('导航栏配置保存成功！刷新页面查看效果')
    }
  } catch (error) {
    console.error('保存导航栏配置失败:', error)
    ElMessage.error('保存失败，请重试')
  } finally {
    saving.value = false
  }
}

// 数据 - 从 productsServices store 获取
const level1Categories = computed(() => store.level1Categories)
const level2Categories = computed(() => store.level2Categories)
const level3Categories = computed(() => store.level3Categories)
const products = computed(() => store.products)

// 横幅设置
const bannerForm = ref({
  title: {
    'zh-CN': '产品与服务',
    'en-US': 'Products & Services'
  },
  subtitle: {
    'zh-CN': '专业的工业自动化设备与智能制造解决方案',
    'en-US': 'Professional Industrial Automation Equipment and Intelligent Manufacturing Solutions'
  },
  backgroundImage: '',
  backgroundColor: '#0047BB', // PANTONE 2736C
  textColor: '#ffffff'
})

// 一级分类表单
const level1DialogVisible = ref(false)
const level1Form = ref({
  id: null,
  name: { 'zh-CN': '', 'en-US': '' },
  description: { 'zh-CN': '', 'en-US': '' },
  image: '',
  icon: '',
  order: 1,
  visible: true
})

// 二级分类表单
const level2DialogVisible = ref(false)
const level2Form = ref({
  id: null,
  parentId: null,
  name: { 'zh-CN': '', 'en-US': '' },
  description: { 'zh-CN': '', 'en-US': '' },
  image: '',
  order: 1,
  visible: true
})

// 三级分类表单
const level3DialogVisible = ref(false)
const selectedLevel1ForLevel3 = ref(null)
const level3Form = ref({
  id: null,
  parentId: null,
  name: { 'zh-CN': '', 'en-US': '' },
  description: { 'zh-CN': '', 'en-US': '' },
  image: '',
  order: 1,
  visible: true
})

const filteredLevel2ForLevel3 = computed(() => {
  if (!selectedLevel1ForLevel3.value) return []
  return level2Categories.value.filter(cat => cat.parentId === selectedLevel1ForLevel3.value)
})

// 产品表单
const productDialogVisible = ref(false)
const videoUploadMode = ref('upload') // 视频上传模式: upload 或 link
const productForm = ref({
  id: null,
  level1CategoryId: null,
  level2CategoryId: null,
  level3CategoryId: null,
  name: { 'zh-CN': '', 'en-US': '' },
  description: { 'zh-CN': '', 'en-US': '' },
  images: [''],
  videoUrl: '', // 新增视频URL字段
  specifications: ''
})

const filteredLevel2ForProduct = computed(() => {
  if (!productForm.value.level1CategoryId) return []
  return level2Categories.value.filter(cat => cat.parentId === productForm.value.level1CategoryId)
})

const filteredLevel3ForProduct = computed(() => {
  if (!productForm.value.level2CategoryId) return []
  return level3Categories.value.filter(cat => cat.parentId === productForm.value.level2CategoryId)
})

// 辅助方法
const getLevel1Name = (id) => {
  const cat = level1Categories.value.find(c => c.id === id)
  return cat ? cat.name['zh-CN'] : '-'
}

const getLevel2Name = (id) => {
  const cat = level2Categories.value.find(c => c.id === id)
  return cat ? cat.name['zh-CN'] : '-'
}

const getLevel3Name = (id) => {
  const cat = level3Categories.value.find(c => c.id === id)
  return cat ? cat.name['zh-CN'] : '-'
}

const getLevel1NameByLevel2 = (level2Id) => {
  const level2 = level2Categories.value.find(c => c.id === level2Id)
  if (!level2) return '-'
  return getLevel1Name(level2.parentId)
}

// 图片上传处理函数
const handleLevel1ImageChange = async (file) => {
  if (!validateImageFile(file.raw)) return
  try {
    const base64 = await convertImageToBase64(file.raw)
    level1Form.value.image = base64
    ElMessage.success('图片上传成功!')
  } catch (error) {
    ElMessage.error('图片转换失败!')
  }
}

const handleLevel2ImageChange = async (file) => {
  if (!validateImageFile(file.raw)) return
  try {
    const base64 = await convertImageToBase64(file.raw)
    level2Form.value.image = base64
    ElMessage.success('图片上传成功!')
  } catch (error) {
    ElMessage.error('图片转换失败!')
  }
}

const handleLevel3ImageChange = async (file) => {
  if (!validateImageFile(file.raw)) return
  try {
    const base64 = await convertImageToBase64(file.raw)
    level3Form.value.image = base64
    ElMessage.success('图片上传成功!')
  } catch (error) {
    ElMessage.error('图片转换失败!')
  }
}

const handleProductImageChange = async (file) => {
  if (!validateImageFile(file.raw)) return
  try {
    const base64 = await convertImageToBase64(file.raw)
    if (!productForm.value.images) productForm.value.images = []
    productForm.value.images.push(base64)
    ElMessage.success('图片上传成功!')
  } catch (error) {
    ElMessage.error('图片转换失败!')
  }
}

const removeProductImage = (index) => {
  productForm.value.images.splice(index, 1)
}

// 产品视频上传处理
const handleProductVideoChange = async (file) => {
  // 验证视频文件
  const isVideo = /^video\/(mp4|avi|quicktime)$/i.test(file.raw.type)
  const isLt100M = file.raw.size / 1024 / 1024 < 100
  
  if (!isVideo) {
    ElMessage.error('只支持MP4、AVI、MOV格式的视频!')
    return false
  }
  if (!isLt100M) {
    ElMessage.error('视频大小不能超过 100MB!')
    return false
  }
  
  try {
    const reader = new FileReader()
    reader.onload = (e) => {
      productForm.value.videoUrl = e.target.result
      ElMessage.success('视频上传成功!')
    }
    reader.onerror = () => {
      ElMessage.error('视频读取失败，请重试!')
    }
    reader.readAsDataURL(file.raw)
  } catch (error) {
    console.error('视频上传失败:', error)
    ElMessage.error('视频上传失败，请重试!')
  }
}

// 一级分类操作
const showAddLevel1Dialog = () => {
  level1Form.value = {
    id: null,
    name: { 'zh-CN': '', 'en-US': '' },
    description: { 'zh-CN': '', 'en-US': '' },
    image: '',
    icon: '',
    order: level1Categories.value.length + 1,
    visible: true
  }
  level1DialogVisible.value = true
}

const editLevel1 = (row) => {
  level1Form.value = JSON.parse(JSON.stringify(row))
  level1DialogVisible.value = true
}

const saveLevel1 = () => {
  if (level1Form.value.id) {
    store.updateLevel1Category(level1Form.value)
    ElMessage.success('更新成功')
  } else {
    store.addLevel1Category(level1Form.value)
    ElMessage.success('添加成功')
  }
  level1DialogVisible.value = false
}

const deleteLevel1 = (id) => {
  ElMessageBox.confirm('删除一级分类将同时删除所有相关的二级、三级分类和产品，确定继续吗？', '警告', {
    type: 'warning'
  }).then(() => {
    store.deleteLevel1Category(id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 二级分类操作
const showAddLevel2Dialog = () => {
  level2Form.value = {
    id: null,
    parentId: null,
    name: { 'zh-CN': '', 'en-US': '' },
    description: { 'zh-CN': '', 'en-US': '' },
    image: '',
    order: 1,
    visible: true
  }
  level2DialogVisible.value = true
}

const editLevel2 = (row) => {
  level2Form.value = JSON.parse(JSON.stringify(row))
  level2DialogVisible.value = true
}

const saveLevel2 = () => {
  if (!level2Form.value.parentId) {
    ElMessage.warning('请选择所属一级分类')
    return
  }
  if (level2Form.value.id) {
    store.updateLevel2Category(level2Form.value)
    ElMessage.success('更新成功')
  } else {
    store.addLevel2Category(level2Form.value)
    ElMessage.success('添加成功')
  }
  level2DialogVisible.value = false
}

const deleteLevel2 = (id) => {
  ElMessageBox.confirm('删除二级分类将同时删除所有相关的三级分类和产品，确定继续吗？', '警告', {
    type: 'warning'
  }).then(() => {
    store.deleteLevel2Category(id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 三级分类操作
const showAddLevel3Dialog = () => {
  level3Form.value = {
    id: null,
    parentId: null,
    name: { 'zh-CN': '', 'en-US': '' },
    description: { 'zh-CN': '', 'en-US': '' },
    image: '',
    order: 1,
    visible: true
  }
  selectedLevel1ForLevel3.value = null
  level3DialogVisible.value = true
}

const editLevel3 = (row) => {
  level3Form.value = JSON.parse(JSON.stringify(row))
  const level2 = level2Categories.value.find(c => c.id === row.parentId)
  selectedLevel1ForLevel3.value = level2 ? level2.parentId : null
  level3DialogVisible.value = true
}

const onLevel1ChangeForLevel3 = () => {
  level3Form.value.parentId = null
}

const saveLevel3 = () => {
  if (!level3Form.value.parentId) {
    ElMessage.warning('请选择所属二级分类')
    return
  }
  if (level3Form.value.id) {
    store.updateLevel3Category(level3Form.value)
    ElMessage.success('更新成功')
  } else {
    store.addLevel3Category(level3Form.value)
    ElMessage.success('添加成功')
  }
  level3DialogVisible.value = false
}

const deleteLevel3 = (id) => {
  ElMessageBox.confirm('删除三级分类将同时删除所有相关的产品，确定继续吗？', '警告', {
    type: 'warning'
  }).then(() => {
    store.deleteLevel3Category(id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 产品操作
const showAddProductDialog = () => {
  productForm.value = {
    id: null,
    level1CategoryId: null,
    level2CategoryId: null,
    level3CategoryId: null,
    name: { 'zh-CN': '', 'en-US': '' },
    description: { 'zh-CN': '', 'en-US': '' },
    images: [''],
    videoUrl: '', // 新增视频URL字段
    specifications: ''
  }
  videoUploadMode.value = 'upload' // 重置视频上传模式
  productDialogVisible.value = true
}

const editProduct = (row) => {
  productForm.value = JSON.parse(JSON.stringify(row))
  // 如果没有videoUrl字段，添加默认值
  if (!productForm.value.videoUrl) {
    productForm.value.videoUrl = ''
  }
  // 根据videoUrl判断上传模式
  if (productForm.value.videoUrl) {
    videoUploadMode.value = productForm.value.videoUrl.startsWith('data:') ? 'upload' : 'link'
  }
  productDialogVisible.value = true
}

const onLevel1ChangeForProduct = () => {
  productForm.value.level2CategoryId = null
  productForm.value.level3CategoryId = null
}

const onLevel2ChangeForProduct = () => {
  productForm.value.level3CategoryId = null
}

const saveProduct = () => {
  if (!productForm.value.level1CategoryId || !productForm.value.level2CategoryId || !productForm.value.level3CategoryId) {
    ElMessage.warning('请选择完整的分类路径')
    return
  }
  if (productForm.value.id) {
    store.updateProduct(productForm.value)
    ElMessage.success('更新成功')
  } else {
    store.addProduct(productForm.value)
    ElMessage.success('添加成功')
  }
  productDialogVisible.value = false
}

const deleteProduct = (id) => {
  ElMessageBox.confirm('确定要删除这个产品吗？', '警告', {
    type: 'warning'
  }).then(() => {
    store.deleteProduct(id)
    ElMessage.success('删除成功')
  }).catch(() => {})
}

// 保存横幅
const saveBanner = () => {
  saving.value = true
  localStorage.setItem('productsServicesPageSettings', JSON.stringify({
    banner: bannerForm.value,
    settings: {
      gridColumns: 3,
      cardBorderRadius: 8,
      cardShadow: true,
      hoverAnimation: true,
      showViewDetails: true
    }
  }))
  setTimeout(() => {
    saving.value = false
    ElMessage.success('保存成功！')
  }, 500)
}

// 加载横幅设置
const loadBanner = () => {
  const saved = localStorage.getItem('productsServicesPageSettings')
  if (saved) {
    try {
      const data = JSON.parse(saved)
      if (data.banner) {
        Object.assign(bannerForm.value, data.banner)
      }
    } catch (e) {
      console.error('加载横幅设置失败:', e)
    }
  }
}

onMounted(() => {
  loadBanner()
  initNavbarConfig()
  initNavbarSortable()
})
</script>

<style scoped>
.products-services-manage {
  padding: 20px;
}

.header-card {
  margin-bottom: 20px;
  background: linear-gradient(135deg, #0047BB 0%, #0066dd 100%);
  color: #fff;
}

.header-card h2 {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  margin-bottom: 8px;
}

.header-card p {
  opacity: 0.95;
  font-size: 14px;
}

.content-tabs {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.name-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.en-name {
  font-size: 12px;
  color: #999;
}

.table-image {
  width: 80px;
  height: 80px;
  border-radius: 4px;
}

.banner-preview {
  padding: 80px 40px;
  text-align: center;
  border-radius: 8px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
}

.banner-preview::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  z-index: 1;
}

.banner-preview h1,
.banner-preview p {
  position: relative;
  z-index: 2;
}

.banner-preview h1 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
}

.banner-preview p {
  font-size: 18px;
  opacity: 0.95;
}

.color-text {
  margin-left: 10px;
  font-family: monospace;
  color: #666;
}

.form-tip {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.upload-area {
  width: 100%;
}

.upload-area :deep(.el-upload-dragger) {
  width: 100%;
  padding: 20px;
}

.image-preview {
  margin-top: 16px;
  position: relative;
  width: 200px;
}

.image-preview .el-image {
  width: 200px;
  height: 200px;
  border-radius: 8px;
  display: block;
}

.image-preview .el-button {
  margin-top: 8px;
  width: 100%;
}

.product-images-upload {
  width: 100%;
}

.product-images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.product-image-item {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
}

.product-image-item .el-image {
  width: 100%;
  height: 100%;
}

.product-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s;
}

.product-image-item:hover .product-image-overlay {
  opacity: 1;
}

.image-number {
  position: absolute;
  top: 4px;
  left: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

/* 产品视频上传样式 */
.product-video-upload {
  width: 100%;
}

.video-tabs {
  margin-top: 12px;
}

.video-link-tips {
  margin-top: 8px;
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px;
}

.video-preview-box {
  margin-top: 16px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  overflow: hidden;
}

.video-preview-box .preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f5f7fa;
  border-bottom: 1px solid #dcdfe6;
}

.video-preview-content {
  padding: 16px;
  background: #000;
}

.video-preview-content video,
.video-preview-content iframe {
  display: block;
  border-radius: 4px;
}

/* 导航栏配置样式 */
.navbar-config-section {
  padding: 20px 0;
}

.drag-icon {
  color: #667eea;
  font-size: 20px;
}

.drag-icon:hover {
  color: #764ba2;
  transform: scale(1.1);
}







</style>
