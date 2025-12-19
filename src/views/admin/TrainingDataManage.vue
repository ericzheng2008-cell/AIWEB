<template>
  <div class="training-data-manage">
    <el-page-header @back="$router.back()">
      <template #content>
        <div class="page-header-content">
          <el-icon><DataAnalysis /></el-icon>
          <span>学习训练系统资料管理</span>
        </div>
      </template>
    </el-page-header>

    <el-tabs v-model="activeTab" class="management-tabs">
      <!-- 产品知识库 -->
      <el-tab-pane label="📦 产品知识库" name="products">
        <div class="tab-content">
          <div class="toolbar">
            <el-button type="primary" @click="addProductKnowledge">
              <el-icon><Plus /></el-icon>
              添加产品知识
            </el-button>
            <el-input v-model="searchKeyword" placeholder="搜索品牌、型号、关键词" style="width: 300px;" clearable>
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>

          <el-table :data="filteredProductKnowledge" border stripe>
            <el-table-column type="expand">
              <template #default="{ row }">
                <div class="expand-content">
                  <p><strong>详细描述：</strong>{{ row.description }}</p>
                  <p><strong>技术规格：</strong>{{ row.specifications }}</p>
                  <p><strong>应用场景：</strong>{{ row.applications }}</p>
                  <p><strong>标签：</strong>
                    <el-tag v-for="tag in row.tags" :key="tag" size="small" class="mr-2">{{ tag }}</el-tag>
                  </p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="category" label="分类" width="120">
              <template #default="{ row }">
                <el-tag>{{ getCategoryLabel(row.category) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="brand" label="品牌" width="150" />
            <el-table-column prop="model" label="型号" width="150" />
            <el-table-column prop="name" label="产品名称" min-width="200" />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-switch v-model="row.status" active-text="启用" inactive-text="禁用" @change="updateStatus(row)" />
              </template>
            </el-table-column>
            <el-table-column prop="trainCount" label="训练次数" width="100" />
            <el-table-column prop="updateTime" label="更新时间" width="160" />
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{ row }">
                <el-button size="small" type="primary" @click="editProductKnowledge(row)">
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
                <el-button size="small" type="danger" @click="deleteProductKnowledge(row)">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="productKnowledge.length"
            :page-sizes="[10, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            class="pagination"
          />
        </div>
      </el-tab-pane>

      <!-- 技术技能库 -->
      <el-tab-pane label="🔧 技术技能库" name="skills">
        <div class="tab-content">
          <div class="toolbar">
            <el-button type="primary" @click="addTechSkill">
              <el-icon><Plus /></el-icon>
              添加技术技能
            </el-button>
            <el-select v-model="skillCategoryFilter" placeholder="筛选分类" clearable style="width: 200px; margin-left: 10px;">
              <el-option label="PLC技术" value="plc" />
              <el-option label="机器人技术" value="robot" />
              <el-option label="编程技术" value="programming" />
              <el-option label="CAD绘图" value="cad" />
              <el-option label="其他" value="other" />
            </el-select>
          </div>

          <el-table :data="filteredTechSkills" border stripe>
            <el-table-column type="expand">
              <template #default="{ row }">
                <div class="expand-content">
                  <p><strong>技能描述：</strong>{{ row.description }}</p>
                  <p><strong>学习目标：</strong>{{ row.learningGoals }}</p>
                  <p><strong>适用场景：</strong>{{ row.scenarios }}</p>
                  <p><strong>相关文档：</strong>
                    <el-link v-for="doc in row.documents" :key="doc" type="primary" class="mr-2">{{ doc }}</el-link>
                  </p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="skillName" label="技能名称" min-width="200" />
            <el-table-column prop="category" label="分类" width="120">
              <template #default="{ row }">
                <el-tag>{{ getSkillCategoryLabel(row.category) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="difficulty" label="难度" width="100">
              <template #default="{ row }">
                <el-rate v-model="row.difficulty" disabled />
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-switch v-model="row.status" @change="updateSkillStatus(row)" />
              </template>
            </el-table-column>
            <el-table-column prop="trainCount" label="训练次数" width="100" />
            <el-table-column prop="updateTime" label="更新时间" width="160" />
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{ row }">
                <el-button size="small" type="primary" @click="editTechSkill(row)">
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
                <el-button size="small" type="danger" @click="deleteTechSkill(row)">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <!-- 销售营销知识 -->
      <el-tab-pane label="💼 销售营销知识" name="sales">
        <div class="tab-content">
          <div class="toolbar">
            <el-button type="primary" @click="addSalesKnowledge">
              <el-icon><Plus /></el-icon>
              添加营销知识
            </el-button>
          </div>

          <el-table :data="salesKnowledge" border stripe>
            <el-table-column type="expand">
              <template #default="{ row }">
                <div class="expand-content">
                  <p><strong>内容：</strong>{{ row.content }}</p>
                  <p><strong>案例：</strong>{{ row.cases }}</p>
                  <p><strong>话术：</strong>{{ row.scripts }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="知识标题" min-width="200" />
            <el-table-column prop="type" label="类型" width="120">
              <template #default="{ row }">
                <el-tag :type="getSalesTypeColor(row.type)">{{ getSalesTypeLabel(row.type) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-switch v-model="row.status" @change="updateSalesStatus(row)" />
              </template>
            </el-table-column>
            <el-table-column prop="trainCount" label="训练次数" width="100" />
            <el-table-column prop="updateTime" label="更新时间" width="160" />
            <el-table-column label="操作" width="180" fixed="right">
              <template #default="{ row }">
                <el-button size="small" type="primary" @click="editSalesKnowledge(row)">
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
                <el-button size="small" type="danger" @click="deleteSalesKnowledge(row)">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <!-- 训练数据源 -->
      <el-tab-pane label="🌐 训练数据源" name="sources">
        <div class="tab-content">
          <div class="toolbar">
            <el-button type="primary" @click="addDataSource">
              <el-icon><Plus /></el-icon>
              添加数据源
            </el-button>
            <el-button type="success" @click="syncAllSources" :loading="isSyncing">
              <el-icon><Refresh /></el-icon>
              同步所有数据源
            </el-button>
          </div>

          <el-table :data="dataSources" border stripe>
            <el-table-column prop="name" label="数据源名称" min-width="200" />
            <el-table-column prop="type" label="类型" width="120">
              <template #default="{ row }">
                <el-tag>{{ getSourceTypeLabel(row.type) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="url" label="URL" min-width="300" show-overflow-tooltip />
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-switch v-model="row.status" @change="updateSourceStatus(row)" />
              </template>
            </el-table-column>
            <el-table-column prop="lastSync" label="最后同步" width="160" />
            <el-table-column prop="dataCount" label="数据量" width="100" />
            <el-table-column label="操作" width="250" fixed="right">
              <template #default="{ row }">
                <el-button size="small" type="success" @click="syncSource(row)" :loading="row.syncing">
                  <el-icon><Refresh /></el-icon>
                  同步
                </el-button>
                <el-button size="small" type="primary" @click="editDataSource(row)">
                  <el-icon><Edit /></el-icon>
                  编辑
                </el-button>
                <el-button size="small" type="danger" @click="deleteDataSource(row)">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <!-- 训练计划 -->
      <el-tab-pane label="📅 训练计划" name="schedule">
        <div class="tab-content">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>自动训练计划配置</span>
                <el-switch v-model="autoTraining.enabled" active-text="启用" inactive-text="禁用" @change="toggleAutoTraining" />
              </div>
            </template>

            <el-form :model="autoTraining" label-width="140px">
              <el-form-item label="每日数据采集">
                <el-time-picker v-model="autoTraining.dataCollection" format="HH:mm" placeholder="选择时间" />
                <span class="hint">建议凌晨执行，减少对业务影响</span>
              </el-form-item>

              <el-form-item label="增量训练频率">
                <el-select v-model="autoTraining.incrementalFreq">
                  <el-option label="每天" value="daily" />
                  <el-option label="每周" value="weekly" />
                  <el-option label="每月" value="monthly" />
                </el-select>
              </el-form-item>

              <el-form-item label="全量训练频率">
                <el-select v-model="autoTraining.fullTrainingFreq">
                  <el-option label="每周" value="weekly" />
                  <el-option label="每月" value="monthly" />
                  <el-option label="每季度" value="quarterly" />
                </el-select>
              </el-form-item>

              <el-form-item label="训练目标">
                <el-checkbox-group v-model="autoTraining.targets">
                  <el-checkbox label="product">产品知识</el-checkbox>
                  <el-checkbox label="tech">技术技能</el-checkbox>
                  <el-checkbox label="sales">销售营销</el-checkbox>
                  <el-checkbox label="faq">常见问题</el-checkbox>
                </el-checkbox-group>
              </el-form-item>

              <el-form-item label="训练通知">
                <el-input v-model="autoTraining.notificationEmail" placeholder="接收训练报告的邮箱" />
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="saveTrainingSchedule">保存配置</el-button>
                <el-button @click="testTrainingNow" type="warning">立即测试训练</el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <el-card class="mt-3">
            <template #header>
              <span>训练历史记录</span>
            </template>

            <el-table :data="trainingHistory" border>
              <el-table-column prop="date" label="训练时间" width="160" />
              <el-table-column prop="type" label="类型" width="100">
                <template #default="{ row }">
                  <el-tag :type="row.type === 'full' ? 'success' : 'info'">
                    {{ row.type === 'full' ? '全量' : '增量' }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="dataCount" label="数据量" width="100" />
              <el-table-column prop="duration" label="耗时" width="100" />
              <el-table-column prop="accuracy" label="准确率" width="100">
                <template #default="{ row }">
                  <el-progress :percentage="row.accuracy" :color="getAccuracyColor(row.accuracy)" />
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template #default="{ row }">
                  <el-tag :type="getTrainingStatusType(row.status)">{{ row.status }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="120">
                <template #default="{ row }">
                  <el-button size="small" @click="viewTrainingReport(row)">查看报告</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 产品知识编辑对话框 -->
    <el-dialog v-model="productDialogVisible" :title="productDialogTitle" width="70%">
      <el-form :model="currentProduct" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="分类">
              <el-select v-model="currentProduct.category" placeholder="选择分类">
                <el-option label="自动化控制" value="automation" />
                <el-option label="工业机器人" value="robot" />
                <el-option label="连接涂胶" value="connection" />
                <el-option label="焊接技术" value="welding" />
                <el-option label="气动工装" value="pneumatic" />
                <el-option label="线缆连接" value="cable" />
                <el-option label="装配工具" value="assembly" />
                <el-option label="打磨工具" value="grinding" />
                <el-option label="起重设备" value="lifting" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="品牌">
              <el-input v-model="currentProduct.brand" placeholder="如：汇川、川崎、博世" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="型号">
              <el-input v-model="currentProduct.model" placeholder="产品型号" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="产品名称">
              <el-input v-model="currentProduct.name" placeholder="产品名称" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="详细描述">
          <el-input v-model="currentProduct.description" type="textarea" :rows="3" placeholder="产品详细描述" />
        </el-form-item>

        <el-form-item label="技术规格">
          <el-input v-model="currentProduct.specifications" type="textarea" :rows="3" placeholder="技术参数、规格" />
        </el-form-item>

        <el-form-item label="应用场景">
          <el-input v-model="currentProduct.applications" type="textarea" :rows="2" placeholder="适用场景、行业" />
        </el-form-item>

        <el-form-item label="标签">
          <el-tag v-for="tag in currentProduct.tags" :key="tag" closable @close="removeProductTag(tag)" class="mr-2">
            {{ tag }}
          </el-tag>
          <el-input v-model="newTag" placeholder="添加标签" style="width: 200px;" @keyup.enter="addProductTag">
            <template #append>
              <el-button @click="addProductTag">添加</el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="currentProduct.status" active-text="启用" inactive-text="禁用" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="productDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveProductKnowledge">保存</el-button>
      </template>
    </el-dialog>

    <!-- 技术技能编辑对话框 -->
    <el-dialog v-model="skillDialogVisible" :title="skillDialogTitle" width="70%">
      <el-form :model="currentSkill" label-width="120px">
        <el-form-item label="技能名称">
          <el-input v-model="currentSkill.skillName" placeholder="如：PLC编程、机器人调试" />
        </el-form-item>

        <el-form-item label="分类">
          <el-select v-model="currentSkill.category">
            <el-option label="PLC技术" value="plc" />
            <el-option label="机器人技术" value="robot" />
            <el-option label="编程技术" value="programming" />
            <el-option label="CAD绘图" value="cad" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>

        <el-form-item label="难度">
          <el-rate v-model="currentSkill.difficulty" />
        </el-form-item>

        <el-form-item label="技能描述">
          <el-input v-model="currentSkill.description" type="textarea" :rows="3" />
        </el-form-item>

        <el-form-item label="学习目标">
          <el-input v-model="currentSkill.learningGoals" type="textarea" :rows="2" />
        </el-form-item>

        <el-form-item label="适用场景">
          <el-input v-model="currentSkill.scenarios" type="textarea" :rows="2" />
        </el-form-item>

        <el-form-item label="相关文档">
          <el-tag v-for="doc in currentSkill.documents" :key="doc" closable @close="removeSkillDoc(doc)" class="mr-2">
            {{ doc }}
          </el-tag>
          <el-input v-model="newDoc" placeholder="文档链接或文件名" style="width: 300px;" @keyup.enter="addSkillDoc">
            <template #append>
              <el-button @click="addSkillDoc">添加</el-button>
            </template>
          </el-input>
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="currentSkill.status" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="skillDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveTechSkill">保存</el-button>
      </template>
    </el-dialog>

    <!-- 销售营销知识编辑对话框 -->
    <el-dialog v-model="salesDialogVisible" :title="salesDialogTitle" width="70%">
      <el-form :model="currentSales" label-width="120px">
        <el-form-item label="知识标题">
          <el-input v-model="currentSales.title" />
        </el-form-item>

        <el-form-item label="类型">
          <el-select v-model="currentSales.type">
            <el-option label="销售技巧" value="technique" />
            <el-option label="客户案例" value="case" />
            <el-option label="话术模板" value="script" />
            <el-option label="异议处理" value="objection" />
            <el-option label="谈判策略" value="negotiation" />
          </el-select>
        </el-form-item>

        <el-form-item label="内容">
          <el-input v-model="currentSales.content" type="textarea" :rows="4" />
        </el-form-item>

        <el-form-item label="案例">
          <el-input v-model="currentSales.cases" type="textarea" :rows="3" />
        </el-form-item>

        <el-form-item label="话术">
          <el-input v-model="currentSales.scripts" type="textarea" :rows="3" />
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="currentSales.status" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="salesDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSalesKnowledge">保存</el-button>
      </template>
    </el-dialog>

    <!-- 数据源编辑对话框 -->
    <el-dialog v-model="sourceDialogVisible" :title="sourceDialogTitle" width="60%">
      <el-form :model="currentSource" label-width="120px">
        <el-form-item label="数据源名称">
          <el-input v-model="currentSource.name" />
        </el-form-item>

        <el-form-item label="类型">
          <el-select v-model="currentSource.type">
            <el-option label="官方网站" value="website" />
            <el-option label="技术论坛" value="forum" />
            <el-option label="行业媒体" value="media" />
            <el-option label="视频平台" value="video" />
            <el-option label="学术数据库" value="academic" />
          </el-select>
        </el-form-item>

        <el-form-item label="URL">
          <el-input v-model="currentSource.url" placeholder="https://" />
        </el-form-item>

        <el-form-item label="采集规则">
          <el-input v-model="currentSource.rules" type="textarea" :rows="3" placeholder="CSS选择器或XPath" />
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="currentSource.status" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="sourceDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveDataSource">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// Tab状态
const activeTab = ref('products')
const searchKeyword = ref('')
const skillCategoryFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

// 产品知识库数据
const productKnowledge = ref([
  {
    id: 1,
    category: 'automation',
    brand: '汇川',
    model: 'IS620P',
    name: '伺服驱动器',
    description: '高性能伺服驱动器，适用于精密运动控制',
    specifications: '功率范围：0.4-22kW，通讯接口：EtherCAT',
    applications: '注塑机、机器人、电子设备',
    tags: ['伺服', '运动控制', '汇川'],
    status: true,
    trainCount: 156,
    updateTime: '2025-12-15 10:30:00'
  },
  {
    id: 2,
    category: 'robot',
    brand: '川崎',
    model: 'RS007N',
    name: '小型机器人',
    description: '紧凑型6轴机器人，负载7kg',
    specifications: '工作半径：927mm，重复定位精度：±0.02mm',
    applications: '搬运、装配、码垛',
    tags: ['机器人', '川崎', '6轴'],
    status: true,
    trainCount: 203,
    updateTime: '2025-12-14 16:20:00'
  }
])

// 技术技能库数据
const techSkills = ref([
  {
    id: 1,
    skillName: 'PLC编程与调试',
    category: 'plc',
    difficulty: 4,
    description: 'Ladder Logic编程、系统调试、故障诊断',
    learningGoals: '掌握PLC编程基础、能独立完成简单系统调试',
    scenarios: '自动化产线、设备控制',
    documents: ['PLC编程手册.pdf', 'Ladder Logic入门教程.mp4'],
    status: true,
    trainCount: 89,
    updateTime: '2025-12-13 14:00:00'
  },
  {
    id: 2,
    skillName: '机器人安装调试',
    category: 'robot',
    difficulty: 5,
    description: '机器人系统安装、参数配置、轨迹示教',
    learningGoals: '熟悉机器人系统架构、掌握示教编程',
    scenarios: '焊接、搬运、装配',
    documents: ['机器人安装指南.pdf', '示教编程视频.mp4'],
    status: true,
    trainCount: 124,
    updateTime: '2025-12-12 09:15:00'
  }
])

// 销售营销知识数据
const salesKnowledge = ref([
  {
    id: 1,
    title: '工业自动化产品销售技巧',
    type: 'technique',
    content: 'SPIN销售法在工业品销售中的应用',
    cases: '某汽车零部件厂采购案例分析',
    scripts: '"您目前产线的节拍是多少？""有遇到什么瓶颈吗？"',
    status: true,
    trainCount: 67,
    updateTime: '2025-12-11 11:00:00'
  },
  {
    id: 2,
    title: '客户异议处理话术',
    type: 'objection',
    content: '常见价格异议、技术异议处理方法',
    cases: '价格谈判成功案例',
    scripts: '"我理解您对价格的关注，我们来算一下综合成本..."',
    status: true,
    trainCount: 53,
    updateTime: '2025-12-10 15:30:00'
  }
])

// 数据源配置
const dataSources = ref([
  {
    id: 1,
    name: '汇川官网技术支持',
    type: 'website',
    url: 'https://www.inovance.com/support',
    rules: '.tech-doc, .product-spec',
    status: true,
    lastSync: '2025-12-17 02:00:00',
    dataCount: 1234,
    syncing: false
  },
  {
    id: 2,
    name: '工控论坛',
    type: 'forum',
    url: 'https://www.gkong.com',
    rules: '.article-content',
    status: true,
    lastSync: '2025-12-17 02:30:00',
    dataCount: 5678,
    syncing: false
  }
])

// 自动训练配置
const autoTraining = reactive({
  enabled: true,
  dataCollection: new Date(2025, 11, 17, 2, 0),
  incrementalFreq: 'daily',
  fullTrainingFreq: 'weekly',
  targets: ['product', 'tech', 'sales'],
  notificationEmail: 'admin@company.com'
})

// 训练历史
const trainingHistory = ref([
  {
    date: '2025-12-17 02:00:00',
    type: 'incremental',
    dataCount: 523,
    duration: '12分钟',
    accuracy: 93,
    status: '成功'
  },
  {
    date: '2025-12-16 02:00:00',
    type: 'incremental',
    dataCount: 489,
    duration: '11分钟',
    accuracy: 92,
    status: '成功'
  },
  {
    date: '2025-12-15 01:00:00',
    type: 'full',
    dataCount: 15234,
    duration: '4小时15分钟',
    accuracy: 94,
    status: '成功'
  }
])

// 对话框状态
const productDialogVisible = ref(false)
const productDialogTitle = ref('添加产品知识')
const currentProduct = ref({})

const skillDialogVisible = ref(false)
const skillDialogTitle = ref('添加技术技能')
const currentSkill = ref({})

const salesDialogVisible = ref(false)
const salesDialogTitle = ref('添加销售知识')
const currentSales = ref({})

const sourceDialogVisible = ref(false)
const sourceDialogTitle = ref('添加数据源')
const currentSource = ref({})

const newTag = ref('')
const newDoc = ref('')
const isSyncing = ref(false)

// 计算属性
const filteredProductKnowledge = computed(() => {
  let data = productKnowledge.value
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    data = data.filter(item => 
      item.brand.toLowerCase().includes(keyword) ||
      item.model.toLowerCase().includes(keyword) ||
      item.name.toLowerCase().includes(keyword) ||
      item.tags.some(tag => tag.toLowerCase().includes(keyword))
    )
  }
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return data.slice(start, end)
})

const filteredTechSkills = computed(() => {
  let data = techSkills.value
  if (skillCategoryFilter.value) {
    data = data.filter(item => item.category === skillCategoryFilter.value)
  }
  return data
})

// 辅助方法
const getCategoryLabel = (category) => {
  const labels = {
    automation: '自动化控制',
    robot: '工业机器人',
    connection: '连接涂胶',
    welding: '焊接技术',
    pneumatic: '气动工装',
    cable: '线缆连接',
    assembly: '装配工具',
    grinding: '打磨工具',
    lifting: '起重设备'
  }
  return labels[category] || category
}

const getSkillCategoryLabel = (category) => {
  const labels = {
    plc: 'PLC技术',
    robot: '机器人技术',
    programming: '编程技术',
    cad: 'CAD绘图',
    other: '其他'
  }
  return labels[category] || category
}

const getSalesTypeLabel = (type) => {
  const labels = {
    technique: '销售技巧',
    case: '客户案例',
    script: '话术模板',
    objection: '异议处理',
    negotiation: '谈判策略'
  }
  return labels[type] || type
}

const getSalesTypeColor = (type) => {
  const colors = {
    technique: 'success',
    case: 'primary',
    script: 'warning',
    objection: 'danger',
    negotiation: 'info'
  }
  return colors[type] || ''
}

const getSourceTypeLabel = (type) => {
  const labels = {
    website: '官方网站',
    forum: '技术论坛',
    media: '行业媒体',
    video: '视频平台',
    academic: '学术数据库'
  }
  return labels[type] || type
}

const getAccuracyColor = (accuracy) => {
  if (accuracy >= 90) return '#67C23A'
  if (accuracy >= 80) return '#E6A23C'
  return '#F56C6C'
}

const getTrainingStatusType = (status) => {
  return status === '成功' ? 'success' : 'danger'
}

// 产品知识管理
const addProductKnowledge = () => {
  productDialogTitle.value = '添加产品知识'
  currentProduct.value = {
    category: '',
    brand: '',
    model: '',
    name: '',
    description: '',
    specifications: '',
    applications: '',
    tags: [],
    status: true
  }
  productDialogVisible.value = true
}

const editProductKnowledge = (row) => {
  productDialogTitle.value = '编辑产品知识'
  currentProduct.value = { ...row }
  productDialogVisible.value = true
}

const saveProductKnowledge = () => {
  if (currentProduct.value.id) {
    // 更新
    const index = productKnowledge.value.findIndex(item => item.id === currentProduct.value.id)
    if (index > -1) {
      productKnowledge.value[index] = { ...currentProduct.value, updateTime: new Date().toLocaleString('zh-CN') }
      ElMessage.success('产品知识已更新')
    }
  } else {
    // 新增
    currentProduct.value.id = Date.now()
    currentProduct.value.trainCount = 0
    currentProduct.value.updateTime = new Date().toLocaleString('zh-CN')
    productKnowledge.value.push(currentProduct.value)
    ElMessage.success('产品知识已添加')
  }
  productDialogVisible.value = false
}

const deleteProductKnowledge = async (row) => {
  try {
    await ElMessageBox.confirm(`确定删除 ${row.brand} ${row.model} 吗？`, '确认删除', {
      type: 'warning'
    })
    const index = productKnowledge.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      productKnowledge.value.splice(index, 1)
      ElMessage.success('已删除')
    }
  } catch {
    // 用户取消
  }
}

const addProductTag = () => {
  if (newTag.value && !currentProduct.value.tags.includes(newTag.value)) {
    currentProduct.value.tags.push(newTag.value)
    newTag.value = ''
  }
}

const removeProductTag = (tag) => {
  const index = currentProduct.value.tags.indexOf(tag)
  if (index > -1) {
    currentProduct.value.tags.splice(index, 1)
  }
}

const updateStatus = (row) => {
  ElMessage.success(`${row.name} 状态已更新`)
}

// 技术技能管理
const addTechSkill = () => {
  skillDialogTitle.value = '添加技术技能'
  currentSkill.value = {
    skillName: '',
    category: '',
    difficulty: 3,
    description: '',
    learningGoals: '',
    scenarios: '',
    documents: [],
    status: true
  }
  skillDialogVisible.value = true
}

const editTechSkill = (row) => {
  skillDialogTitle.value = '编辑技术技能'
  currentSkill.value = { ...row }
  skillDialogVisible.value = true
}

const saveTechSkill = () => {
  if (currentSkill.value.id) {
    const index = techSkills.value.findIndex(item => item.id === currentSkill.value.id)
    if (index > -1) {
      techSkills.value[index] = { ...currentSkill.value, updateTime: new Date().toLocaleString('zh-CN') }
      ElMessage.success('技术技能已更新')
    }
  } else {
    currentSkill.value.id = Date.now()
    currentSkill.value.trainCount = 0
    currentSkill.value.updateTime = new Date().toLocaleString('zh-CN')
    techSkills.value.push(currentSkill.value)
    ElMessage.success('技术技能已添加')
  }
  skillDialogVisible.value = false
}

const deleteTechSkill = async (row) => {
  try {
    await ElMessageBox.confirm(`确定删除 ${row.skillName} 吗？`, '确认删除', {
      type: 'warning'
    })
    const index = techSkills.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      techSkills.value.splice(index, 1)
      ElMessage.success('已删除')
    }
  } catch {
    // 用户取消
  }
}

const addSkillDoc = () => {
  if (newDoc.value && !currentSkill.value.documents.includes(newDoc.value)) {
    currentSkill.value.documents.push(newDoc.value)
    newDoc.value = ''
  }
}

const removeSkillDoc = (doc) => {
  const index = currentSkill.value.documents.indexOf(doc)
  if (index > -1) {
    currentSkill.value.documents.splice(index, 1)
  }
}

const updateSkillStatus = (row) => {
  ElMessage.success(`${row.skillName} 状态已更新`)
}

// 销售知识管理
const addSalesKnowledge = () => {
  salesDialogTitle.value = '添加销售知识'
  currentSales.value = {
    title: '',
    type: '',
    content: '',
    cases: '',
    scripts: '',
    status: true
  }
  salesDialogVisible.value = true
}

const editSalesKnowledge = (row) => {
  salesDialogTitle.value = '编辑销售知识'
  currentSales.value = { ...row }
  salesDialogVisible.value = true
}

const saveSalesKnowledge = () => {
  if (currentSales.value.id) {
    const index = salesKnowledge.value.findIndex(item => item.id === currentSales.value.id)
    if (index > -1) {
      salesKnowledge.value[index] = { ...currentSales.value, updateTime: new Date().toLocaleString('zh-CN') }
      ElMessage.success('销售知识已更新')
    }
  } else {
    currentSales.value.id = Date.now()
    currentSales.value.trainCount = 0
    currentSales.value.updateTime = new Date().toLocaleString('zh-CN')
    salesKnowledge.value.push(currentSales.value)
    ElMessage.success('销售知识已添加')
  }
  salesDialogVisible.value = false
}

const deleteSalesKnowledge = async (row) => {
  try {
    await ElMessageBox.confirm(`确定删除 ${row.title} 吗？`, '确认删除', {
      type: 'warning'
    })
    const index = salesKnowledge.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      salesKnowledge.value.splice(index, 1)
      ElMessage.success('已删除')
    }
  } catch {
    // 用户取消
  }
}

const updateSalesStatus = (row) => {
  ElMessage.success(`${row.title} 状态已更新`)
}

// 数据源管理
const addDataSource = () => {
  sourceDialogTitle.value = '添加数据源'
  currentSource.value = {
    name: '',
    type: '',
    url: '',
    rules: '',
    status: true
  }
  sourceDialogVisible.value = true
}

const editDataSource = (row) => {
  sourceDialogTitle.value = '编辑数据源'
  currentSource.value = { ...row }
  sourceDialogVisible.value = true
}

const saveDataSource = () => {
  if (currentSource.value.id) {
    const index = dataSources.value.findIndex(item => item.id === currentSource.value.id)
    if (index > -1) {
      dataSources.value[index] = { ...currentSource.value }
      ElMessage.success('数据源已更新')
    }
  } else {
    currentSource.value.id = Date.now()
    currentSource.value.lastSync = '-'
    currentSource.value.dataCount = 0
    currentSource.value.syncing = false
    dataSources.value.push(currentSource.value)
    ElMessage.success('数据源已添加')
  }
  sourceDialogVisible.value = false
}

const deleteDataSource = async (row) => {
  try {
    await ElMessageBox.confirm(`确定删除 ${row.name} 吗？`, '确认删除', {
      type: 'warning'
    })
    const index = dataSources.value.findIndex(item => item.id === row.id)
    if (index > -1) {
      dataSources.value.splice(index, 1)
      ElMessage.success('已删除')
    }
  } catch {
    // 用户取消
  }
}

const syncSource = async (row) => {
  row.syncing = true
  ElMessage.info(`正在同步 ${row.name}...`)
  
  // 模拟同步
  setTimeout(() => {
    row.syncing = false
    row.lastSync = new Date().toLocaleString('zh-CN')
    row.dataCount += Math.floor(Math.random() * 100)
    ElMessage.success(`${row.name} 同步完成`)
  }, 2000)
}

const syncAllSources = async () => {
  isSyncing.value = true
  ElMessage.info('正在同步所有数据源...')
  
  setTimeout(() => {
    dataSources.value.forEach(source => {
      if (source.status) {
        source.lastSync = new Date().toLocaleString('zh-CN')
        source.dataCount += Math.floor(Math.random() * 100)
      }
    })
    isSyncing.value = false
    ElMessage.success('所有数据源同步完成')
  }, 3000)
}

const updateSourceStatus = (row) => {
  ElMessage.success(`${row.name} 状态已更新`)
}

// 训练计划管理
const toggleAutoTraining = (value) => {
  ElMessage.success(value ? '自动训练已启用' : '自动训练已禁用')
}

const saveTrainingSchedule = () => {
  ElMessage.success('训练计划配置已保存')
}

const testTrainingNow = () => {
  ElMessage.info('正在启动测试训练...')
  setTimeout(() => {
    ElMessage.success('测试训练完成！准确率：92%')
  }, 2000)
}

const viewTrainingReport = (row) => {
  ElMessage.info(`查看 ${row.date} 的训练报告`)
}
</script>

<style scoped>
.training-data-manage {
  padding: 20px;
}

.page-header-content {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
}

.management-tabs {
  margin-top: 20px;
}

.tab-content {
  padding: 20px 0;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.expand-content {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 4px;
}

.expand-content p {
  margin: 8px 0;
  line-height: 1.6;
}

.mr-2 {
  margin-right: 8px;
}

.mt-3 {
  margin-top: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hint {
  margin-left: 10px;
  color: #909399;
  font-size: 12px;
}
</style>
