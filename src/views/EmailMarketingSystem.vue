<template>
  <div class="email-marketing-system">
    <!-- 顶部导航 -->
    <div class="page-header">
      <h1>{{ $t('emailMarketing.title') }}</h1>
      <p class="description">{{ $t('emailMarketing.description') }}</p>
    </div>

    <!-- 功能标签页 -->
    <el-tabs v-model="activeTab" class="marketing-tabs">
      <!-- 1. 创建邮件 -->
      <el-tab-pane :label="$t('emailMarketing.createEmail')" name="create">
        <div class="create-email-panel">
          <el-row :gutter="20">
            <!-- 左侧：编辑区 -->
            <el-col :span="16">
              <el-card class="editor-card">
                <template #header>
                  <div class="card-header">
                    <span>{{ $t('emailMarketing.emailEditor') }}</span>
                    <el-button-group>
                      <el-button 
                        v-for="lang in supportedLanguages"
                        :key="lang.code"
                        :type="currentEditLang === lang.code ? 'primary' : ''"
                        @click="currentEditLang = lang.code"
                      >
                        {{ lang.name }}
                      </el-button>
                    </el-button-group>
                  </div>
                </template>

                <!-- 邮件基本信息 -->
                <el-form :model="emailForm" label-width="100px">
                  <el-form-item :label="$t('emailMarketing.campaignName')">
                    <el-input v-model="emailForm.name" :placeholder="$t('emailMarketing.campaignNamePlaceholder')" />
                  </el-form-item>

                  <el-form-item :label="$t('emailMarketing.subject')">
                    <el-input v-model="emailForm.subject[currentEditLang]" :placeholder="$t('emailMarketing.subjectPlaceholder')" />
                  </el-form-item>

                  <el-form-item :label="$t('emailMarketing.preheader')">
                    <el-input v-model="emailForm.preheader[currentEditLang]" :placeholder="$t('emailMarketing.preheaderPlaceholder')" />
                  </el-form-item>

                  <el-form-item :label="$t('emailMarketing.template')">
                    <el-select v-model="emailForm.templateId" :placeholder="$t('emailMarketing.selectTemplate')" @change="loadTemplate">
                      <el-option
                        v-for="template in emailTemplates"
                        :key="template.id"
                        :label="template.name"
                        :value="template.id"
                      >
                        <span>{{ template.name }}</span>
                        <el-tag size="small" style="margin-left: 10px">{{ template.category }}</el-tag>
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <!-- 富文本编辑器 -->
                  <el-form-item :label="$t('emailMarketing.content')">
                    <div class="rich-editor">
                      <div class="editor-toolbar">
                        <el-button-group>
                          <el-button size="small" @click="insertVariable('firstName')">{{ $t('emailMarketing.insertName') }}</el-button>
                          <el-button size="small" @click="insertVariable('company')">{{ $t('emailMarketing.insertCompany') }}</el-button>
                          <el-button size="small" @click="insertVariable('product')">{{ $t('emailMarketing.insertProduct') }}</el-button>
                        </el-button-group>
                      </div>
                      <el-input
                        v-model="emailForm.content[currentEditLang]"
                        type="textarea"
                        :rows="12"
                        :placeholder="$t('emailMarketing.contentPlaceholder')"
                      />
                    </div>
                  </el-form-item>

                  <!-- CTA按钮设置 -->
                  <el-form-item :label="$t('emailMarketing.ctaButton')">
                    <el-row :gutter="10">
                      <el-col :span="12">
                        <el-input v-model="emailForm.cta.text[currentEditLang]" :placeholder="$t('emailMarketing.ctaText')" />
                      </el-col>
                      <el-col :span="12">
                        <el-input v-model="emailForm.cta.url" :placeholder="$t('emailMarketing.ctaUrl')" />
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <!-- A/B测试设置 -->
                  <el-form-item :label="$t('emailMarketing.abTest')">
                    <el-switch v-model="emailForm.abTestEnabled" />
                    <div v-if="emailForm.abTestEnabled" class="ab-test-config">
                      <el-divider />
                      <h4>{{ $t('emailMarketing.testVariants') }}</h4>
                      <el-radio-group v-model="emailForm.abTest.type">
                        <el-radio label="subject">{{ $t('emailMarketing.testSubject') }}</el-radio>
                        <el-radio label="content">{{ $t('emailMarketing.testContent') }}</el-radio>
                        <el-radio label="cta">{{ $t('emailMarketing.testCTA') }}</el-radio>
                      </el-radio-group>
                      <el-input
                        v-if="emailForm.abTest.type === 'subject'"
                        v-model="emailForm.abTest.variantB.subject"
                        :placeholder="$t('emailMarketing.variantB')"
                        style="margin-top: 10px"
                      />
                    </div>
                  </el-form-item>
                </el-form>
              </el-card>
            </el-col>

            <!-- 右侧：预览区 -->
            <el-col :span="8">
              <el-card class="preview-card">
                <template #header>
                  <div class="card-header">
                    <span>{{ $t('emailMarketing.preview') }}</span>
                    <el-button-group size="small">
                      <el-button @click="previewDevice = 'desktop'" :type="previewDevice === 'desktop' ? 'primary' : ''">
                        <i class="el-icon-monitor"></i>
                      </el-button>
                      <el-button @click="previewDevice = 'mobile'" :type="previewDevice === 'mobile' ? 'primary' : ''">
                        <i class="el-icon-mobile"></i>
                      </el-button>
                    </el-button-group>
                  </div>
                </template>

                <div :class="['email-preview', previewDevice]">
                  <div class="email-subject">{{ emailForm.subject[currentEditLang] || '主题预览' }}</div>
                  <div class="email-preheader">{{ emailForm.preheader[currentEditLang] }}</div>
                  <div class="email-content-preview" v-html="renderPreview()"></div>
                  <div v-if="emailForm.cta.text[currentEditLang]" class="email-cta">
                    <a :href="emailForm.cta.url" class="cta-button">{{ emailForm.cta.text[currentEditLang] }}</a>
                  </div>
                </div>
              </el-card>

              <!-- 发送设置 -->
              <el-card class="send-settings" style="margin-top: 20px">
                <template #header>{{ $t('emailMarketing.sendSettings') }}</template>
                <el-form label-width="100px">
                  <el-form-item :label="$t('emailMarketing.audience')">
                    <el-select v-model="emailForm.audienceId" :placeholder="$t('emailMarketing.selectAudience')">
                      <el-option
                        v-for="audience in audiences"
                        :key="audience.id"
                        :label="`${audience.name} (${audience.count})`"
                        :value="audience.id"
                      />
                    </el-select>
                  </el-form-item>

                  <el-form-item :label="$t('emailMarketing.sendTime')">
                    <el-radio-group v-model="emailForm.sendType">
                      <el-radio label="immediate">{{ $t('emailMarketing.sendNow') }}</el-radio>
                      <el-radio label="scheduled">{{ $t('emailMarketing.schedule') }}</el-radio>
                    </el-radio-group>
                    <el-date-picker
                      v-if="emailForm.sendType === 'scheduled'"
                      v-model="emailForm.scheduledTime"
                      type="datetime"
                      :placeholder="$t('emailMarketing.selectTime')"
                      style="margin-top: 10px; width: 100%"
                    />
                  </el-form-item>
                </el-form>

                <div class="action-buttons">
                  <el-button type="primary" @click="sendEmail" :loading="sending">
                    {{ emailForm.sendType === 'immediate' ? $t('emailMarketing.sendNow') : $t('emailMarketing.scheduleEmail') }}
                  </el-button>
                  <el-button @click="saveAsDraft">{{ $t('emailMarketing.saveDraft') }}</el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>

      <!-- 2. 营销活动管理 -->
      <el-tab-pane :label="$t('emailMarketing.campaigns')" name="campaigns">
        <div class="campaigns-panel">
          <el-table :data="campaigns" style="width: 100%">
            <el-table-column prop="name" :label="$t('emailMarketing.campaignName')" width="200" />
            <el-table-column prop="status" :label="$t('emailMarketing.status')" width="120">
              <template #default="{ row }">
                <el-tag :type="getStatusType(row.status)">{{ $t(`emailMarketing.${row.status}`) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="sent" :label="$t('emailMarketing.sent')" width="100" />
            <el-table-column prop="delivered" :label="$t('emailMarketing.delivered')" width="100" />
            <el-table-column prop="opened" :label="$t('emailMarketing.opened')" width="100">
              <template #default="{ row }">
                {{ row.opened }} ({{ getRate(row.opened, row.delivered) }}%)
              </template>
            </el-table-column>
            <el-table-column prop="clicked" :label="$t('emailMarketing.clicked')" width="100">
              <template #default="{ row }">
                {{ row.clicked }} ({{ getRate(row.clicked, row.opened) }}%)
              </template>
            </el-table-column>
            <el-table-column prop="converted" :label="$t('emailMarketing.converted')" width="100">
              <template #default="{ row }">
                {{ row.converted }} ({{ getRate(row.converted, row.clicked) }}%)
              </template>
            </el-table-column>
            <el-table-column prop="sendTime" :label="$t('emailMarketing.sendTime')" width="180" />
            <el-table-column :label="$t('emailMarketing.actions')" fixed="right" width="200">
              <template #default="{ row }">
                <el-button size="small" @click="viewReport(row)">{{ $t('emailMarketing.viewReport') }}</el-button>
                <el-button size="small" type="danger" @click="deleteCampaign(row)">{{ $t('common.delete') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <!-- 3. 受众管理 -->
      <el-tab-pane :label="$t('emailMarketing.audiences')" name="audiences">
        <div class="audiences-panel">
          <el-button type="primary" @click="createAudience" style="margin-bottom: 20px">
            {{ $t('emailMarketing.createAudience') }}
          </el-button>

          <el-table :data="audiences" style="width: 100%">
            <el-table-column prop="name" :label="$t('emailMarketing.audienceName')" />
            <el-table-column prop="count" :label="$t('emailMarketing.contacts')" width="120" />
            <el-table-column prop="criteria" :label="$t('emailMarketing.criteria')" />
            <el-table-column prop="updatedAt" :label="$t('emailMarketing.lastUpdated')" width="180" />
            <el-table-column :label="$t('emailMarketing.actions')" width="150">
              <template #default="{ row }">
                <el-button size="small" @click="editAudience(row)">{{ $t('common.edit') }}</el-button>
                <el-button size="small" type="danger" @click="deleteAudience(row)">{{ $t('common.delete') }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>

      <!-- 4. 模板库 -->
      <el-tab-pane :label="$t('emailMarketing.templates')" name="templates">
        <div class="templates-panel">
          <el-row :gutter="20">
            <el-col :span="6" v-for="template in emailTemplates" :key="template.id">
              <el-card class="template-card" @click="selectTemplate(template)">
                <div class="template-preview">
                  <img :src="template.thumbnail" :alt="template.name" />
                </div>
                <div class="template-info">
                  <h4>{{ template.name }}</h4>
                  <el-tag size="small">{{ template.category }}</el-tag>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>

    <!-- 创建受众对话框 -->
    <el-dialog v-model="audienceDialogVisible" :title="$t('emailMarketing.createAudience')" width="600px">
      <el-form :model="newAudience" label-width="120px">
        <el-form-item :label="$t('emailMarketing.audienceName')">
          <el-input v-model="newAudience.name" />
        </el-form-item>
        <el-form-item :label="$t('emailMarketing.filterCriteria')">
          <el-select v-model="newAudience.filters" multiple :placeholder="$t('emailMarketing.selectCriteria')">
            <el-option label="高价值客户 (A级)" value="grade_a" />
            <el-option label="潜力客户 (B级)" value="grade_b" />
            <el-option label="已下载资源" value="downloaded" />
            <el-option label="已请求报价" value="quoted" />
            <el-option label="7天未活跃" value="inactive_7d" />
            <el-option label="30天未活跃" value="inactive_30d" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="audienceDialogVisible = false">{{ $t('common.cancel') }}</el-button>
        <el-button type="primary" @click="saveAudience">{{ $t('common.save') }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'EmailMarketingSystem',
  data() {
    return {
      activeTab: 'create',
      currentEditLang: 'zh-CN',
      previewDevice: 'desktop',
      sending: false,
      
      // 支持的语言
      supportedLanguages: [
        { code: 'zh-CN', name: '中文' },
        { code: 'en-US', name: 'English' },
        { code: 'de-DE', name: 'Deutsch' },
        { code: 'es-ES', name: 'Español' },
        { code: 'ja-JP', name: '日本語' }
      ],

      // 邮件表单
      emailForm: {
        name: '',
        subject: {
          'zh-CN': '',
          'en-US': '',
          'de-DE': '',
          'es-ES': '',
          'ja-JP': ''
        },
        preheader: {
          'zh-CN': '',
          'en-US': '',
          'de-DE': '',
          'es-ES': '',
          'ja-JP': ''
        },
        content: {
          'zh-CN': '',
          'en-US': '',
          'de-DE': '',
          'es-ES': '',
          'ja-JP': ''
        },
        cta: {
          text: {
            'zh-CN': '',
            'en-US': '',
            'de-DE': '',
            'es-ES': '',
            'ja-JP': ''
          },
          url: ''
        },
        templateId: '',
        audienceId: '',
        sendType: 'immediate',
        scheduledTime: null,
        abTestEnabled: false,
        abTest: {
          type: 'subject',
          variantB: {
            subject: '',
            content: '',
            cta: ''
          }
        }
      },

      // 邮件模板
      emailTemplates: [
        { id: 1, name: '产品推广', category: '促销', thumbnail: '/images/email-templates/product-promo.jpg' },
        { id: 2, name: '新品发布', category: '公告', thumbnail: '/images/email-templates/new-product.jpg' },
        { id: 3, name: '客户关怀', category: '培育', thumbnail: '/images/email-templates/nurture.jpg' },
        { id: 4, name: '活动邀请', category: '活动', thumbnail: '/images/email-templates/event.jpg' }
      ],

      // 营销活动列表
      campaigns: [],

      // 受众列表
      audiences: [
        { id: 1, name: '高价值客户', count: 156, criteria: 'A级客户 + 已下载资源', updatedAt: '2025-12-17 10:30' },
        { id: 2, name: '潜在客户', count: 342, criteria: 'B/C级客户 + 7天内活跃', updatedAt: '2025-12-17 09:15' },
        { id: 3, name: '流失预警', count: 78, criteria: '30天未活跃 + 历史订单>0', updatedAt: '2025-12-16 16:20' }
      ],

      // 新建受众对话框
      audienceDialogVisible: false,
      newAudience: {
        name: '',
        filters: []
      }
    }
  },
  
  mounted() {
    this.loadCampaigns()
  },

  methods: {
    // 加载模板
    loadTemplate(templateId) {
      const template = this.emailTemplates.find(t => t.id === templateId)
      if (template) {
        // 这里应该从服务器加载完整模板内容
        this.$message.success(`已加载模板：${template.name}`)
      }
    },

    // 插入变量
    insertVariable(variable) {
      const placeholder = `{{${variable}}}`
      this.emailForm.content[this.currentEditLang] += placeholder
    },

    // 渲染预览
    renderPreview() {
      let content = this.emailForm.content[this.currentEditLang] || ''
      // 替换变量为示例值
      content = content.replace(/\{\{firstName\}\}/g, 'John')
      content = content.replace(/\{\{company\}\}/g, 'ABC Manufacturing')
      content = content.replace(/\{\{product\}\}/g, '智能拧紧工具')
      return content.replace(/\n/g, '<br>')
    },

    // 发送邮件
    async sendEmail() {
      if (!this.emailForm.audienceId) {
        this.$message.warning(this.$t('emailMarketing.selectAudienceFirst'))
        return
      }

      this.sending = true
      try {
        // 调用发送API
        const response = await fetch('/api/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.emailForm)
        })

        if (response.ok) {
          this.$message.success(
            this.emailForm.sendType === 'immediate' 
              ? this.$t('emailMarketing.sendSuccess')
              : this.$t('emailMarketing.scheduleSuccess')
          )
          this.activeTab = 'campaigns'
          this.loadCampaigns()
        }
      } catch (error) {
        this.$message.error(this.$t('emailMarketing.sendFailed'))
      } finally {
        this.sending = false
      }
    },

    // 保存草稿
    async saveAsDraft() {
      this.$message.success(this.$t('emailMarketing.draftSaved'))
    },

    // 加载营销活动
    async loadCampaigns() {
      // 模拟数据
      this.campaigns = [
        {
          id: 1,
          name: '新品发布 - 智能拧紧工具',
          status: 'sent',
          sent: 1000,
          delivered: 980,
          opened: 490,
          clicked: 147,
          converted: 23,
          sendTime: '2025-12-15 14:00'
        },
        {
          id: 2,
          name: '年终促销活动',
          status: 'scheduled',
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          converted: 0,
          sendTime: '2025-12-20 09:00'
        }
      ]
    },

    // 查看报告
    viewReport(campaign) {
      this.$router.push(`/email-report/${campaign.id}`)
    },

    // 删除营销活动
    deleteCampaign(campaign) {
      this.$confirm(this.$t('emailMarketing.confirmDelete'), this.$t('common.warning'), {
        type: 'warning'
      }).then(() => {
        this.$message.success(this.$t('common.deleteSuccess'))
        this.loadCampaigns()
      })
    },

    // 创建受众
    createAudience() {
      this.audienceDialogVisible = true
      this.newAudience = { name: '', filters: [] }
    },

    // 保存受众
    saveAudience() {
      if (!this.newAudience.name) {
        this.$message.warning(this.$t('emailMarketing.enterAudienceName'))
        return
      }
      this.$message.success(this.$t('emailMarketing.audienceCreated'))
      this.audienceDialogVisible = false
      // 重新加载受众列表
    },

    // 编辑受众
    editAudience(audience) {
      this.newAudience = { ...audience }
      this.audienceDialogVisible = true
    },

    // 删除受众
    deleteAudience(audience) {
      this.$confirm(this.$t('emailMarketing.confirmDeleteAudience'), this.$t('common.warning'), {
        type: 'warning'
      }).then(() => {
        this.$message.success(this.$t('common.deleteSuccess'))
      })
    },

    // 选择模板
    selectTemplate(template) {
      this.emailForm.templateId = template.id
      this.activeTab = 'create'
      this.loadTemplate(template.id)
    },

    // 获取状态类型
    getStatusType(status) {
      const types = {
        draft: 'info',
        scheduled: 'warning',
        sending: 'primary',
        sent: 'success',
        failed: 'danger'
      }
      return types[status] || 'info'
    },

    // 计算比率
    getRate(numerator, denominator) {
      return denominator > 0 ? ((numerator / denominator) * 100).toFixed(1) : 0
    }
  }
}
</script>

<style scoped>
.email-marketing-system {
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  font-size: 28px;
  margin-bottom: 10px;
}

.description {
  color: #666;
  font-size: 14px;
}

.marketing-tabs {
  background: white;
  padding: 20px;
  border-radius: 8px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rich-editor {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.editor-toolbar {
  padding: 10px;
  border-bottom: 1px solid #dcdfe6;
  background: #f5f7fa;
}

.ab-test-config {
  margin-top: 15px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 4px;
}

.email-preview {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  min-height: 400px;
}

.email-preview.mobile {
  max-width: 375px;
  margin: 0 auto;
}

.email-subject {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.email-preheader {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}

.email-content-preview {
  background: white;
  padding: 20px;
  border-radius: 4px;
  min-height: 200px;
  line-height: 1.6;
}

.email-cta {
  text-align: center;
  margin-top: 30px;
}

.cta-button {
  display: inline-block;
  padding: 12px 30px;
  background: #409eff;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
}

.action-buttons {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}

.template-card {
  cursor: pointer;
  transition: all 0.3s;
  margin-bottom: 20px;
}

.template-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.template-preview img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 4px;
}

.template-info {
  margin-top: 10px;
}

.template-info h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
}
</style>
