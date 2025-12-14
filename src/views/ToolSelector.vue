<template>
  <div class="tool-selector">
    <Header />
    
    <!-- 页面标题 - 增强版 -->
    <section class="selector-header">
      <div class="header-background"></div>
      <div class="container">
        <div class="header-content" data-aos="fade-up">
          <div class="header-badge">
            <el-icon><MagicStick /></el-icon>
            <span>AI智能推荐</span>
          </div>
          <h1><el-icon><Tools /></el-icon> 拧紧工具智能选型系统</h1>
          <p>填写您的工艺需求，AI将为您推荐最合适的工具方案</p>
          <div class="header-features">
            <div class="feature-badge">
              <el-icon><Checked /></el-icon>
              <span>98%匹配准确率</span>
            </div>
            <div class="feature-badge">
              <el-icon><Checked /></el-icon>
              <span>3分钟快速推荐</span>
            </div>
            <div class="feature-badge">
              <el-icon><Checked /></el-icon>
              <span>专业工艺建议</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 选型表单 - 增强版 -->
    <section class="selector-form">
      <div class="container">
        <!-- 进度指示器 -->
        <div class="progress-indicator" data-aos="fade-up">
          <div class="progress-step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
            <div class="step-number">1</div>
            <div class="step-label">基本信息</div>
          </div>
          <div class="progress-line" :class="{ active: currentStep > 1 }"></div>
          <div class="progress-step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
            <div class="step-number">2</div>
            <div class="step-label">功能需求</div>
          </div>
          <div class="progress-line" :class="{ active: currentStep > 2 }"></div>
          <div class="progress-step" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
            <div class="step-number">3</div>
            <div class="step-label">高级配置</div>
          </div>
          <div class="progress-line" :class="{ active: currentStep > 3 }"></div>
          <div class="progress-step" :class="{ active: currentStep >= 4 }">
            <div class="step-number">4</div>
            <div class="step-label">智能推荐</div>
          </div>
        </div>

        <el-card class="form-card" data-aos="fade-up" data-aos-delay="100">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <el-icon :size="20"><Setting /></el-icon>
                <span>工艺需求信息</span>
                <el-tag v-if="formCompleteness < 100" type="warning" size="small" style="margin-left: 12px;">
                  完成度: {{ formCompleteness }}%
                </el-tag>
                <el-tag v-else type="success" size="small" style="margin-left: 12px;">
                  <el-icon><Checked /></el-icon> 信息完整
                </el-tag>
              </div>
              <div class="header-right">
                <el-button type="primary" size="small" @click="autoFillExample">
                  <el-icon><MagicStick /></el-icon>
                  快速填充示例
                </el-button>
                <el-tooltip content="查看填写指南" placement="bottom">
                  <el-button circle size="small" @click="showGuide = true">
                    <el-icon><QuestionFilled /></el-icon>
                  </el-button>
                </el-tooltip>
              </div>
            </div>
          </template>

          <el-form :model="requirements" label-width="140px" label-position="left" @change="calculateCompleteness">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="线体名称" required>
                  <el-select 
                    v-model="requirements.productionLine" 
                    placeholder="请选择线体名称"
                    filterable
                    clearable
                    style="width: 100%">
                    <el-option 
                      v-for="line in productionLines" 
                      :key="line.id" 
                      :label="line.name" 
                      :value="line.name">
                      <span style="float: left">{{ line.name }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ line.category }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工位名称" required>
                  <el-select 
                    v-model="requirements.workstation" 
                    placeholder="请选择工位名称"
                    filterable
                    allow-create
                    clearable
                    style="width: 100%">
                    <el-option 
                      v-for="ws in workstations" 
                      :key="ws.id" 
                      :label="ws.name" 
                      :value="ws.name" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="动力形式" required>
                  <el-select v-model="requirements.powerType" placeholder="请选择动力形式">
                    <el-option label="锂电池" value="锂电池" />
                    <el-option label="有线电动" value="有线电动" />
                    <el-option label="气动" value="气动" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="扭矩要求" required>
                  <el-input-number 
                    v-model="requirements.torque" 
                    :min="1" 
                    :max="1000" 
                    placeholder="目标扭矩"
                    style="width: 100%"
                  />
                  <span style="margin-left: 8px;">Nm</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="精度要求" required>
                  <el-select v-model="requirements.accuracy" placeholder="选择精度要求">
                    <el-option label="±5%（高精度）" value="±5%" />
                    <el-option label="±8%（标准）" value="±8%" />
                    <el-option label="±10%（普通）" value="±10%" />
                    <el-option label="±12%（经济型）" value="±12%" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-divider content-position="left">功能需求</el-divider>
            
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="数据采集">
                  <el-switch v-model="requirements.needDataCollection" />
                  <span style="margin-left: 8px; color: #999; font-size: 12px;">
                    {{ requirements.needDataCollection ? '需要' : '不需要' }}
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="过程控制">
                  <el-switch v-model="requirements.needProcessControl" />
                  <span style="margin-left: 8px; color: #999; font-size: 12px;">
                    {{ requirements.needProcessControl ? '需要' : '不需要' }}
                  </span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="合格反馈">
                  <el-switch v-model="requirements.needOkFeedback" />
                  <span style="margin-left: 8px; color: #999; font-size: 12px;">
                    {{ requirements.needOkFeedback ? '需要' : '不需要' }}
                  </span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-divider content-position="left">通讯配置</el-divider>
            
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="无线通讯方式">
                  <el-select v-model="requirements.wirelessComm" multiple placeholder="选择无线通讯方式" clearable>
                    <el-option label="蓝牙" value="蓝牙" />
                    <el-option label="WIFI" value="WIFI" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="通讯协议">
                  <el-select v-model="requirements.commProtocol" multiple placeholder="选择通讯协议" clearable>
                    <el-option label="TCP/IP" value="TCP/IP" />
                    <el-option label="I/O" value="I/O" />
                    <el-option label="Openprotocol" value="Openprotocol" />
                    <el-option label="RS232" value="RS232" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-divider content-position="left">性能需求</el-divider>
            
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="转速要求">
                  <el-checkbox v-model="requirements.needHighSpeed">需要高转速（3000-4000rpm）</el-checkbox>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="反力要求">
                  <el-checkbox v-model="requirements.needLowReaction">要求无反力或低反力</el-checkbox>
                </el-form-item>
              </el-col>
            </el-row>

            <el-divider content-position="left">套筒选型</el-divider>
            
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="套筒外形">
                  <el-select v-model="requirements.socket.shape" placeholder="选择外形" clearable>
                    <el-option label="标准" value="标准" />
                    <el-option label="加长" value="加长" />
                    <el-option label="接杆" value="接杆" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="输入端类型">
                  <el-select v-model="requirements.socket.inputType" placeholder="选择输入端类型" clearable>
                    <el-option label="外六角" value="外六角" />
                    <el-option label="内六角" value="内六角" />
                    <el-option label="内六星" value="内六星" />
                    <el-option label="Torx" value="Torx" />
                    <el-option label="十字" value="十字" />
                    <el-option label="一字" value="一字" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="输入端尺寸">
                  <el-select v-model="requirements.socket.size" placeholder="选择尺寸" clearable>
                    <el-option label="10mm" value="10mm" />
                    <el-option label="12mm" value="12mm" />
                    <el-option label="13mm" value="13mm" />
                    <el-option label="14mm" value="14mm" />
                    <el-option label="15mm" value="15mm" />
                    <el-option label="18mm" value="18mm" />
                    <el-option label="其他尺寸" value="其他" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="磁性类型">
                  <el-select v-model="requirements.socket.magnetic" placeholder="选择磁性类型" clearable>
                    <el-option label="无磁性" value="无磁性" />
                    <el-option label="固定磁" value="固定磁" />
                    <el-option label="伸缩磁" value="伸缩磁" />
                    <el-option label="中空磁" value="中空磁" />
                    <el-option label="外置磁环" value="外置磁环" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="长度类型">
                  <el-select v-model="requirements.socket.length" placeholder="选择长度" clearable>
                    <el-option label="标准" value="标准" />
                    <el-option label="加长" value="加长" />
                    <el-option label="接杆" value="接杆" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="特殊要求">
                  <el-checkbox-group v-model="requirements.socket.specialRequirements" @change="handleSpecialRequirementsChange">
                    <el-checkbox label="抗振" />
                    <el-checkbox label="密封圈" />
                    <el-checkbox label="销子" />
                  </el-checkbox-group>
                </el-form-item>
              </el-col>
            </el-row>

            <el-divider content-position="left">防错要求</el-divider>
            
            <el-checkbox-group v-model="requirements.errorProofing" class="error-proofing-group">
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-checkbox label="防低扭矩" />
                </el-col>
                <el-col :span="8">
                  <el-checkbox label="防过扭矩" />
                </el-col>
                <el-col :span="8">
                  <el-checkbox label="防重复拧紧" />
                </el-col>
              </el-row>
              <el-row :gutter="10" style="margin-top: 12px;">
                <el-col :span="8">
                  <el-checkbox label="防漏拧" />
                </el-col>
                <el-col :span="8">
                  <el-checkbox label="防位置顺序错误" />
                </el-col>
              </el-row>
            </el-checkbox-group>

            <el-divider content-position="left">工装附件要求</el-divider>
            
            <el-checkbox-group v-model="requirements.accessories" class="accessories-group">
              <el-row :gutter="10">
                <el-col :span="6">
                  <el-checkbox label="三色灯" />
                </el-col>
                <el-col :span="6">
                  <el-checkbox label="套筒选择器" />
                </el-col>
                <el-col :span="6">
                  <el-checkbox label="总线卡" />
                </el-col>
                <el-col :span="6">
                  <el-checkbox label="工具外置控制器" />
                </el-col>
              </el-row>
              <el-row :gutter="10" style="margin-top: 12px;">
                <el-col :span="6">
                  <el-checkbox label="工位结果显示器" />
                </el-col>
                <el-col :span="6">
                  <el-checkbox label="工控机" />
                </el-col>
                <el-col :span="6">
                  <el-checkbox label="现场网线" />
                </el-col>
                <el-col :span="6">
                  <el-checkbox label="现场无线局域网" />
                </el-col>
              </el-row>
              <el-row :gutter="10" style="margin-top: 12px;">
                <el-col :span="6">
                  <el-checkbox label="AP" />
                </el-col>
                <el-col :span="6">
                  <el-checkbox label="机械臂" />
                </el-col>
                <el-col :span="6">
                  <el-checkbox label="机械抗扭臂" />
                </el-col>
                <el-col :span="6">
                  <el-checkbox label="工具小车" />
                </el-col>
              </el-row>
              <el-row :gutter="10" style="margin-top: 12px;">
                <el-col :span="6">
                  <el-checkbox label="轨道悬挂" />
                </el-col>
                <el-col :span="6">
                  <el-checkbox label="协作机器人" />
                </el-col>
                <el-col :span="6">
                  <el-checkbox label="视觉顺序位置防错" />
                </el-col>
                <el-col :span="6">
                  <el-checkbox label="位置角度编码器" />
                </el-col>
              </el-row>
            </el-checkbox-group>

            <el-divider content-position="left">服务要求</el-divider>
            
            <el-checkbox-group v-model="requirements.services" class="services-group">
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-checkbox label="现场工位试用" />
                </el-col>
                <el-col :span="8">
                  <el-checkbox label="现场工位工具调试" />
                </el-col>
                <el-col :span="8">
                  <el-checkbox label="动态标定" />
                </el-col>
              </el-row>
              <el-row :gutter="10" style="margin-top: 12px;">
                <el-col :span="8">
                  <el-checkbox label="拧紧工艺改善" />
                </el-col>
              </el-row>
            </el-checkbox-group>

            <el-divider content-position="left">软件要求</el-divider>
            
            <el-checkbox-group v-model="requirements.software" class="software-group">
              <el-row :gutter="10">
                <el-col :span="8">
                  <el-checkbox label="数据采集" />
                </el-col>
                <el-col :span="8">
                  <el-checkbox label="工位作业指导" />
                </el-col>
                <el-col :span="8">
                  <el-checkbox label="线体通讯" />
                </el-col>
              </el-row>
              <el-row :gutter="10" style="margin-top: 12px;">
                <el-col :span="12">
                  <el-checkbox label="线体多工位拧紧管理系统" />
                </el-col>
              </el-row>
            </el-checkbox-group>

            <el-divider content-position="left">其他要求</el-divider>

            <el-form-item label="补充说明">
              <el-input 
                v-model="requirements.additionalNotes" 
                type="textarea" 
                :rows="3"
                placeholder="如有其他特殊要求，请在此说明..."
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" size="large" @click="searchTools" :loading="searching">
                <el-icon><Search /></el-icon>
                智能匹配工具
              </el-button>
              <el-button size="large" @click="resetForm">
                <el-icon><RefreshLeft /></el-icon>
                重置
              </el-button>
              <el-button size="large" type="success" @click="generateReport">
                <el-icon><Document /></el-icon>
                生成需求报告
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </section>

    <!-- 匹配结果 -->
    <section v-if="matchedTools.length > 0" class="results-section">
      <div class="container">
        <div class="results-header">
          <h2><el-icon><CircleCheck /></el-icon> 为您找到 {{ matchedTools.length }} 个匹配工具</h2>
          <p>根据您的需求，以下工具最符合您的工艺要求</p>
        </div>

        <div class="tools-grid">
          <el-card 
            v-for="tool in matchedTools" 
            :key="tool.id" 
            class="tool-card"
            :class="{ 'recommended': isHighlyRecommended(tool) }"
            shadow="hover">
            <template #header>
              <div class="tool-card-header">
                <div>
                  <h3>{{ tool.model }}</h3>
                  <p>{{ tool.name }}</p>
                </div>
                <el-tag v-if="isHighlyRecommended(tool)" type="success" size="large" effect="dark">
                  <el-icon><Star /></el-icon> 强烈推荐
                </el-tag>
                <el-tag v-else type="info">备选方案</el-tag>
              </div>
            </template>

            <div class="tool-image">
              <img :src="tool.image" :alt="tool.model" />
            </div>

            <el-descriptions :column="1" size="small" border>
              <el-descriptions-item label="动力形式">
                <el-tag size="small">{{ tool.powerType }}</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="扭矩范围">
                {{ tool.torqueRange.min }}-{{ tool.torqueRange.max }}{{ tool.torqueRange.unit }}
              </el-descriptions-item>
              <el-descriptions-item label="精度">{{ tool.accuracy }}</el-descriptions-item>
              <el-descriptions-item label="转速范围">
                {{ tool.performance.noLoadSpeed.min }}-{{ tool.performance.noLoadSpeed.max }}rpm
              </el-descriptions-item>
              <el-descriptions-item label="反力">{{ tool.performance.reactionForce }}</el-descriptions-item>
              <el-descriptions-item label="重量">{{ tool.performance.weight }}kg</el-descriptions-item>
            </el-descriptions>

            <el-divider content-position="left">功能特性</el-divider>
            <div class="features-list">
              <el-tag v-if="tool.features.hasSensor" size="small" type="success">传感器</el-tag>
              <el-tag v-if="tool.features.dataCollection" size="small" type="primary">数据采集</el-tag>
              <el-tag v-if="tool.features.processControl" size="small" type="primary">过程控制</el-tag>
              <el-tag v-if="tool.features.okFeedback" size="small" type="primary">合格反馈</el-tag>
              <el-tag v-if="tool.features.threadSearch" size="small">寻牙功能</el-tag>
              <el-tag v-if="tool.features.countingFunction" size="small">拧紧计数</el-tag>
              <el-tag v-if="tool.features.ledFeedback" size="small">LED反馈</el-tag>
              <el-tag v-if="tool.features.torqueStop" size="small">定扭停拧</el-tag>
              <el-tag v-for="comm in tool.features.wirelessComm" :key="comm" size="small" type="warning">{{ comm }}</el-tag>
              <el-tag v-for="protocol in tool.features.commProtocol" :key="protocol" size="small" type="info">{{ protocol }}</el-tag>
            </div>

            <el-divider content-position="left">适用场景</el-divider>
            <div class="suitable-list">
              <el-tag v-for="scene in tool.suitableFor" :key="scene" size="small" type="info" effect="plain">
                {{ scene }}
              </el-tag>
            </div>

            <div class="tool-footer">
              <div class="price-info">
                <span class="label">参考价格：</span>
                <span class="price">¥{{ tool.price.toLocaleString() }}</span>
              </div>
              <div class="stock-info">
                <span class="label">库存：</span>
                <span :class="tool.stock > 10 ? 'in-stock' : 'low-stock'">
                  {{ tool.stock > 0 ? `${tool.stock}台` : '缺货' }}
                </span>
              </div>
            </div>

            <div class="tool-notes" v-if="tool.notes">
              <el-icon><InfoFilled /></el-icon>
              <span>{{ tool.notes }}</span>
            </div>

            <div class="tool-actions">
              <el-button type="primary" @click="contactSales(tool)">
                <el-icon><Phone /></el-icon>
                咨询销售
              </el-button>
              <el-button @click="viewDetails(tool)">
                <el-icon><View /></el-icon>
                查看详情
              </el-button>
            </div>
          </el-card>
        </div>
      </div>
    </section>

    <!-- 无匹配结果 -->
    <section v-else-if="hasSearched && matchedTools.length === 0" class="no-results">
      <div class="container">
        <el-empty description="未找到完全匹配的工具">
          <p>根据您的需求，暂时没有完全匹配的工具</p>
          <p>建议：</p>
          <ul>
            <li>放宽精度要求或扭矩范围</li>
            <li>减少必需的功能特性</li>
            <li>或直接联系我们的技术团队获取定制方案</li>
          </ul>
          <el-button type="primary" @click="contactCustomService">联系技术团队</el-button>
        </el-empty>
      </div>
    </section>

    <Footer />
    
    <!-- 抗振品牌选择对话框 -->
    <el-dialog
      v-model="antiVibrationDialogVisible"
      title="抗振工具品牌确认"
      width="500px"
      :close-on-click-modal="false">
      <div style="padding: 20px 0;">
        <p style="margin-bottom: 20px; font-size: 15px; color: #666;">
          <el-icon style="color: #409eff;"><InfoFilled /></el-icon>
          您选择了抗振套筒，请确认您使用的工具品牌：
        </p>
        <el-radio-group v-model="antiVibrationBrand" size="large" style="width: 100%;">
          <el-radio label="阿特拉斯工具" border style="width: 100%; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: 600;">阿特拉斯（Atlas Copco）工具</span>
              <el-tag size="small" type="primary">推荐</el-tag>
            </div>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #999;">
              适用于阿特拉斯品牌拧紧工具，专用抗振套筒
            </p>
          </el-radio>
          <el-radio label="其他品牌工具" border style="width: 100%;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: 600;">其他品牌工具</span>
            </div>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #999;">
              适用于其他品牌拧紧工具的通用抗振套筒
            </p>
          </el-radio>
        </el-radio-group>
      </div>
      <template #footer>
        <el-button @click="cancelAntiVibration">取消</el-button>
        <el-button type="primary" @click="confirmAntiVibrationBrand">
          <el-icon><Check /></el-icon>
          确认
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToolDatabaseStore } from '../store/toolDatabase'
import { useProductionLineStore } from '../store/productionLine'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Tools, Search, RefreshLeft, Document, CircleCheck, 
  Star, InfoFilled, Phone, View, MagicStick, Checked,
  Setting, QuestionFilled
} from '@element-plus/icons-vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

const router = useRouter()
const toolStore = useToolDatabaseStore()
const productionLineStore = useProductionLineStore()

// 初始化动画
onMounted(() => {
  AOS.init({
    duration: 600,
    easing: 'ease-out-cubic',
    once: true,
    offset: 50
  })
  
  // 加载线体和工位数据
  productionLineStore.loadProductionLines()
  loadWorkstations()
})

// 表单步骤
const currentStep = ref(1)
const showGuide = ref(false)

// 抗振品牌选择
const antiVibrationDialogVisible = ref(false)
const antiVibrationBrand = ref('')

// 线体和工位数据
const productionLines = computed(() => productionLineStore.productionLines)
const workstations = ref([])

// 加载工位数据
const loadWorkstations = () => {
  const saved = localStorage.getItem('workstations')
  if (saved) {
    workstations.value = JSON.parse(saved)
  } else {
    workstations.value = []
  }
}

// 需求表单
const requirements = reactive({
  productionLine: '',
  workstation: '',
  powerType: '',
  torque: null,
  accuracy: '',
  needDataCollection: false,
  needProcessControl: false,
  needOkFeedback: false,
  needHighSpeed: false,
  needLowReaction: false,
  // 通讯配置
  wirelessComm: [],
  commProtocol: [],
  // 套筒选型
  socket: {
    shape: '',
    inputType: '',
    size: '',
    magnetic: '',
    length: '',
    specialRequirements: [],
    antiVibrationBrand: '' // 抗振品牌
  },
  // 防错要求
  errorProofing: [],
  // 工装附件
  accessories: [],
  // 服务要求
  services: [],
  // 软件要求
  software: [],
  additionalNotes: ''
})

const searching = ref(false)
const hasSearched = ref(false)
const matchedTools = ref([])

// 表单完整度计算
const formCompleteness = computed(() => {
  let completed = 0
  let total = 5 // 基础必填项（增加了线体名称）
  
  if (requirements.productionLine) completed++
  if (requirements.workstation) completed++
  if (requirements.powerType) completed++
  if (requirements.torque) completed++
  if (requirements.accuracy) completed++
  
  return Math.round((completed / total) * 100)
})

// 计算当前步骤
const calculateStep = () => {
  if (!requirements.productionLine || !requirements.workstation || !requirements.powerType || !requirements.torque || !requirements.accuracy) {
    currentStep.value = 1
  } else if (!requirements.needDataCollection && !requirements.needProcessControl && !requirements.needOkFeedback) {
    currentStep.value = 2
  } else if (requirements.socket.inputType || requirements.errorProofing.length > 0) {
    currentStep.value = 3
  } else if (matchedTools.value.length > 0) {
    currentStep.value = 4
  }
}

// 计算完整度(兼容旧方法)
const calculateCompleteness = () => {
  calculateStep()
}

// 是否有高级需求
const hasAdvancedRequirements = computed(() => {
  return requirements.socket.inputType || 
         requirements.errorProofing.length > 0 || 
         requirements.accessories.length > 0 || 
         requirements.software.length > 0
})

// 处理特殊要求变化（监听抗振勾选）
const handleSpecialRequirementsChange = (value) => {
  // 检查是否新增了"抗振"选项
  const hasAntiVibration = value.includes('抗振')
  const hadAntiVibration = requirements.socket.antiVibrationBrand !== ''
  
  if (hasAntiVibration && !hadAntiVibration) {
    // 用户刚勾选了抗振，弹出品牌选择对话框
    antiVibrationDialogVisible.value = true
    antiVibrationBrand.value = '' // 重置选择
  } else if (!hasAntiVibration) {
    // 用户取消了抗振，清除品牌选择
    requirements.socket.antiVibrationBrand = ''
    antiVibrationBrand.value = ''
  }
}

// 确认抗振品牌
const confirmAntiVibrationBrand = () => {
  if (!antiVibrationBrand.value) {
    ElMessage.warning('请选择工具品牌')
    return
  }
  
  requirements.socket.antiVibrationBrand = antiVibrationBrand.value
  antiVibrationDialogVisible.value = false
  
  ElMessage.success({
    message: `已选择：${antiVibrationBrand.value}`,
    duration: 2000
  })
}

// 取消抗振选择
const cancelAntiVibration = () => {
  // 取消时移除"抗振"选项
  const index = requirements.socket.specialRequirements.indexOf('抗振')
  if (index > -1) {
    requirements.socket.specialRequirements.splice(index, 1)
  }
  requirements.socket.antiVibrationBrand = ''
  antiVibrationBrand.value = ''
  antiVibrationDialogVisible.value = false
  
  ElMessage.info('已取消抗振套筒选择')
}

// 自动填充示例
const autoFillExample = () => {
  Object.assign(requirements, {
    productionLine: '汽车总装线',
    workstation: '门盖工位',
    powerType: '锂电池',
    torque: 35,
    accuracy: '±10%',
    needDataCollection: false,
    needProcessControl: false,
    needOkFeedback: false,
    needHighSpeed: true,
    needLowReaction: true,
    wirelessComm: [],
    commProtocol: ['I/O'],
    socket: {
      shape: '标准',
      inputType: '外六角',
      size: '13mm',
      magnetic: '固定磁',
      length: '标准',
      specialRequirements: ['抗振'],
      antiVibrationBrand: '' // 将触发对话框
    },
    errorProofing: ['防低扭矩', '防过扭矩', '防漏拧'],
    accessories: ['三色灯', '工具小车', '机械抗扭臂'],
    services: ['现场工位试用', '现场工位工具调试'],
    software: ['数据采集', '工位作业指导'],
    additionalNotes: '需要手持操作，轻量化设计'
  })
  ElMessage.success('已填充示例数据：汽车总装线 - 门盖工位完整配置')
}

// 搜索匹配工具
const searchTools = () => {
  if (!requirements.productionLine || !requirements.workstation || !requirements.powerType || !requirements.torque || !requirements.accuracy) {
    ElMessage.warning('请填写必填项：线体名称、工位名称、动力形式、扭矩要求和精度要求')
    return
  }

  searching.value = true
  currentStep.value = 4
  
  // 模拟AI分析过程
  const loadingInstance = ElMessage({
    message: 'AI正在分析您的需求...',
    type: 'info',
    duration: 0,
    icon: MagicStick
  })
  
  // 模拟搜索延迟
  setTimeout(() => {
    matchedTools.value = toolStore.matchTools(requirements)
    hasSearched.value = true
    searching.value = false
    loadingInstance.close()

    if (matchedTools.value.length > 0) {
      ElMessage.success({
        message: `智能匹配完成！找到 ${matchedTools.value.length} 个推荐工具`,
        duration: 3000
      })
      // 滚动到结果区域
      setTimeout(() => {
        document.querySelector('.results-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } else {
      ElMessage.info('未找到完全匹配的工具，请调整需求或联系技术团队')
    }
  }, 1500)
}

// 判断是否强烈推荐
const isHighlyRecommended = (tool) => {
  let score = 0
  
  // 扭矩完全匹配
  if (requirements.torque >= tool.torqueRange.min && requirements.torque <= tool.torqueRange.max) {
    const midPoint = (tool.torqueRange.min + tool.torqueRange.max) / 2
    const deviation = Math.abs(requirements.torque - midPoint) / midPoint
    if (deviation < 0.2) score += 3 // 非常接近中点
  }
  
  // 功能完全匹配
  if (requirements.needDataCollection === tool.features.dataCollection) score += 1
  if (requirements.needProcessControl === tool.features.processControl) score += 1
  if (requirements.needOkFeedback === tool.features.okFeedback) score += 1
  
  // 性能匹配
  if (requirements.needHighSpeed && tool.performance.noLoadSpeed.min >= 3000) score += 1
  if (requirements.needLowReaction && (tool.performance.reactionForce === '无反力' || tool.performance.reactionForce === '低反力')) score += 1
  
  return score >= 5
}

// 重置表单
const resetForm = () => {
  Object.assign(requirements, {
    productionLine: '',
    workstation: '',
    powerType: '',
    torque: null,
    accuracy: '',
    needDataCollection: false,
    needProcessControl: false,
    needOkFeedback: false,
    needHighSpeed: false,
    needLowReaction: false,
    wirelessComm: [],
    commProtocol: [],
    socket: {
      shape: '',
      inputType: '',
      size: '',
      magnetic: '',
      length: '',
      specialRequirements: [],
      antiVibrationBrand: ''
    },
    errorProofing: [],
    accessories: [],
    services: [],
    software: [],
    additionalNotes: ''
  })
  matchedTools.value = []
  hasSearched.value = false
}

// 咨询销售
const contactSales = (tool) => {
  // 构建详细的咨询信息
  let message = `您好，我对工具 ${tool.model}（${tool.name}）感兴趣。\n\n【工位信息】\n线体名称：${requirements.productionLine}\n工位名称：${requirements.workstation}\n扭矩需求：${requirements.torque}Nm\n精度要求：${requirements.accuracy}\n`
  
  if (requirements.socket.inputType) {
    message += `\n【套筒配置】\n`
    message += `输入端类型：${requirements.socket.inputType}\n`
    message += `输入端尺寸：${requirements.socket.size}\n`
    message += `外形：${requirements.socket.shape}\n`
    message += `磁性：${requirements.socket.magnetic}\n`
  }
  
  if (requirements.errorProofing.length > 0) {
    message += `\n【防错要求】\n${requirements.errorProofing.join('、')}\n`
  }
  
  if (requirements.accessories.length > 0) {
    message += `\n【工装附件】\n${requirements.accessories.join('、')}\n`
  }
  
  if (requirements.services.length > 0) {
    message += `\n【服务要求】\n${requirements.services.join('、')}\n`
  }
  
  if (requirements.software.length > 0) {
    message += `\n【软件要求】\n${requirements.software.join('、')}\n`
  }
  
  if (requirements.wirelessComm.length > 0 || requirements.commProtocol.length > 0) {
    message += `\n【通讯配置】\n`
    if (requirements.wirelessComm.length > 0) {
      message += `无线通讯：${requirements.wirelessComm.join('、')}\n`
    }
    if (requirements.commProtocol.length > 0) {
      message += `通讯协议：${requirements.commProtocol.join('、')}\n`
    }
  }
  
  message += `\n请问能否提供详细报价和技术支持？谢谢！`
  
  ElMessage.success('正在跳转到联系页面...')
  
  setTimeout(() => {
    router.push({
      path: '/contact',
      query: {
        subject: `工具咨询 - ${tool.model}`,
        message: message
      }
    })
  }, 500)
}

// 查看详情
const viewDetails = (tool) => {
  ElMessage.info(`查看工具详情：${tool.model}`)
  // 可以打开详情对话框或跳转到详情页
}

// 联系定制服务
const contactCustomService = () => {
  router.push('/contact')
}

// 生成需求报告
const generateReport = () => {
  if (!requirements.productionLine || !requirements.workstation || !requirements.powerType || !requirements.torque) {
    ElMessage.warning('请至少填写线体名称、工位名称、动力形式和扭矩要求')
    return
  }

  const report = {
    基本信息: {
      线体名称: requirements.productionLine,
      工位名称: requirements.workstation,
      动力形式: requirements.powerType,
      扭矩要求: `${requirements.torque}Nm`,
      精度要求: requirements.accuracy
    },
    功能需求: {
      数据采集: requirements.needDataCollection ? '需要' : '不需要',
      过程控制: requirements.needProcessControl ? '需要' : '不需要',
      合格反馈: requirements.needOkFeedback ? '需要' : '不需要',
      高转速: requirements.needHighSpeed ? '需要（3000-4000rpm）' : '不需要',
      低反力: requirements.needLowReaction ? '需要' : '不需要'
    },
    通讯配置: {
      无线通讯: requirements.wirelessComm.length > 0 
        ? requirements.wirelessComm.join('、') 
        : '无',
      通讯协议: requirements.commProtocol.length > 0 
        ? requirements.commProtocol.join('、') 
        : '无'
    },
    套筒配置: {
      外形: requirements.socket.shape || '未指定',
      输入端类型: requirements.socket.inputType || '未指定',
      输入端尺寸: requirements.socket.size || '未指定',
      磁性类型: requirements.socket.magnetic || '未指定',
      长度类型: requirements.socket.length || '未指定',
      特殊要求: requirements.socket.specialRequirements.length > 0 
        ? requirements.socket.specialRequirements.join('、') 
        : '无',
      抗振品牌: requirements.socket.antiVibrationBrand || '未选择'
    },
    防错要求: requirements.errorProofing.length > 0 
      ? requirements.errorProofing.join('、') 
      : '无',
    工装附件: requirements.accessories.length > 0 
      ? requirements.accessories.join('、') 
      : '无',
    服务要求: requirements.services.length > 0 
      ? requirements.services.join('、') 
      : '无',
    软件要求: requirements.software.length > 0 
      ? requirements.software.join('、') 
      : '无',
    补充说明: requirements.additionalNotes || '无'
  }

  // 生成报告文本
  let reportText = `拧紧工具选型需求报告\n生成时间：${new Date().toLocaleString()}\n\n`
  
  Object.keys(report).forEach(section => {
    reportText += `【${section}】\n`
    if (typeof report[section] === 'object') {
      Object.keys(report[section]).forEach(key => {
        reportText += `  ${key}：${report[section][key]}\n`
      })
    } else {
      reportText += `  ${report[section]}\n`
    }
    reportText += '\n'
  })

  // 下载报告
  const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `工具选型需求报告_${requirements.productionLine}_${requirements.workstation}_${new Date().getTime()}.txt`
  link.click()
  URL.revokeObjectURL(url)
  
  ElMessage.success('需求报告已生成并下载')
}
</script>

<style scoped>
.tool-selector {
  min-height: 100vh;
  background: #f5f7fa;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 页面标题 - 增强版 */
.selector-header {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 0 60px;
  color: #fff;
  text-align: center;
  overflow: hidden;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: headerMove 20s linear infinite;
}

@keyframes headerMove {
  from {
    background-position: 0 0;
  }
  to {
    background-position: 40px 40px;
  }
}

.header-content {
  position: relative;
  z-index: 1;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
}

.selector-header h1 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 40px;
  margin-bottom: 16px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.selector-header p {
  font-size: 18px;
  opacity: 0.95;
  margin-bottom: 24px;
}

.header-features {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.feature-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  font-size: 14px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* 进度指示器 */
.progress-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  padding: 32px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
}

.step-number {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f0f0f0;
  color: #999;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.progress-step.active .step-number {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  animation: stepPulse 2s infinite;
}

.progress-step.completed .step-number {
  background: #52c41a;
  color: #fff;
}

@keyframes stepPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
  }
}

.step-label {
  font-size: 13px;
  color: #666;
  font-weight: 500;
  white-space: nowrap;
}

.progress-step.active .step-label {
  color: #667eea;
  font-weight: 600;
}

.progress-line {
  width: 80px;
  height: 2px;
  background: #e8e8e8;
  margin: 0 16px;
  transition: all 0.3s ease;
}

.progress-line.active {
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  animation: lineGrow 0.5s ease;
}

@keyframes lineGrow {
  from {
    width: 0;
  }
  to {
    width: 80px;
  }
}

/* 表单卡片 */
.selector-form {
  padding: 40px 0;
}

.form-card {
  max-width: 1000px;
  margin: 0 auto;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border-radius: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 表单项增强 */
:deep(.el-form-item__label) {
  font-weight: 500;
  color: #333;
}

:deep(.el-input__inner),
:deep(.el-select),
:deep(.el-input-number) {
  transition: all 0.3s ease;
}

:deep(.el-input__inner:focus),
:deep(.el-select:hover),
:deep(.el-input-number:hover) {
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

/* 结果区域 */
.results-section {
  padding: 60px 0;
  background: #fff;
}

.results-header {
  text-align: center;
  margin-bottom: 40px;
}

.results-header h2 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 28px;
  margin-bottom: 12px;
  color: #1a1a1a;
}

.results-header p {
  font-size: 16px;
  color: #666;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.tool-card {
  transition: all 0.3s ease;
}

.tool-card.recommended {
  border: 2px solid #67c23a;
}

.tool-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.tool-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.tool-card-header h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 4px 0;
  color: #1a1a1a;
}

.tool-card-header p {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.tool-image {
  width: 100%;
  height: 200px;
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f7fa;
}

.tool-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.features-list,
.suitable-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.tool-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 6px;
}

.price-info,
.stock-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  color: #666;
  font-size: 14px;
}

.price {
  font-size: 20px;
  font-weight: 600;
  color: #f56c6c;
}

.in-stock {
  color: #67c23a;
  font-weight: 500;
}

.low-stock {
  color: #e6a23c;
  font-weight: 500;
}

.tool-notes {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px;
  background: #e6f7ff;
  border-left: 3px solid #1890ff;
  border-radius: 4px;
  margin: 16px 0;
  font-size: 13px;
  color: #666;
  line-height: 1.6;
}

.tool-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.tool-actions .el-button {
  flex: 1;
}

/* 配置建议 */
.config-suggestions {
  margin-top: 16px;
  padding-top: 8px;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
}

.suggestion-item .label {
  color: #666;
  font-weight: 500;
  min-width: 80px;
}

.suggestion-item > span:not(.label) {
  color: #333;
}

/* 无结果 */
.no-results {
  padding: 80px 0;
  background: #fff;
}

.no-results ul {
  text-align: left;
  max-width: 400px;
  margin: 20px auto;
  color: #666;
}

.no-results li {
  margin: 8px 0;
}

/* 复选框组样式 */
.error-proofing-group,
.accessories-group,
.services-group,
.software-group {
  width: 100%;
}

.error-proofing-group :deep(.el-checkbox),
.accessories-group :deep(.el-checkbox),
.services-group :deep(.el-checkbox),
.software-group :deep(.el-checkbox) {
  margin-right: 0;
  width: 100%;
  margin-bottom: 8px;
}

.error-proofing-group :deep(.el-checkbox__label),
.accessories-group :deep(.el-checkbox__label),
.services-group :deep(.el-checkbox__label),
.software-group :deep(.el-checkbox__label) {
  white-space: nowrap;
}

</style>
