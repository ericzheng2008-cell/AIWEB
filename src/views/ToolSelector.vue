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
                <el-button @click="goHome" type="success" size="small">
                  <el-icon><HomeFilled /></el-icon>
                  返回主页
                </el-button>
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
            
            <!-- 套筒选型列表 -->
            <div v-for="(socket, index) in requirements.sockets" :key="index" class="socket-item">
              <div class="socket-header">
                <span class="socket-label">套筒 {{ index + 1 }}</span>
                <el-button 
                  v-if="requirements.sockets.length > 1" 
                  type="danger" 
                  size="small" 
                  link 
                  @click="removeSocket(index)"
                >
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </div>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="工具类型">
                  <el-select 
                    v-model="socket.toolType" 
                    placeholder="选择工具类型" 
                    clearable 
                    @change="handleToolTypeChange(index)"
                  >
                    <el-option label="油压脉冲" value="油压脉冲" />
                    <el-option label="其他" value="其他" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="套筒型号">
                  <el-select 
                    v-model="socket.model" 
                    placeholder="选择或搜索型号" 
                    clearable 
                    filterable
                    @focus="loadModelSuggestions(index)"
                    @change="handleModelSelect(index, socket.model)"
                  >
                    <el-option 
                      v-for="suggestion in socket.modelSuggestions" 
                      :key="suggestion.model"
                      :label="`${suggestion.model} - ${suggestion.name}`"
                      :value="suggestion.model"
                    >
                      <div class="model-option">
                        <span class="model-code">{{ suggestion.model }}</span>
                        <span class="model-name">{{ suggestion.name }}</span>
                        <el-tag size="small" type="success">{{ suggestion.socketType.outputType }}</el-tag>
                        <el-tag size="small" type="warning">{{ suggestion.socketType.outputSize }}</el-tag>
                      </div>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="套筒数量">
                  <el-input-number v-model="socket.quantity" :min="1" :max="999" placeholder="数量" style="width: 100%" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="工具品牌">
                  <el-input v-model="socket.toolBrand" placeholder="工具品牌" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="工具型号">
                  <el-input v-model="socket.toolModel" placeholder="工具型号" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="套筒外形">
                  <el-select v-model="socket.shape" placeholder="选择外形" clearable @change="loadModelSuggestions(index)">
                    <el-option label="标准" value="标准" />
                    <el-option label="加长" value="加长" />
                    <el-option label="接杆" value="接杆" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="输出端类型">
                    <el-select v-model="socket.outputType" placeholder="选择输出端类型" clearable @change="loadModelSuggestions(index)">
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
                <el-form-item label="输出端对边尺寸">
                  <el-select v-model="socket.outputSize" placeholder="选择尺寸" clearable @change="loadModelSuggestions(index)">
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
              <el-col :span="8">
                <el-form-item label="四方尺寸">
                  <el-select v-model="socket.inputSquareSize" placeholder="选择四方尺寸" clearable @change="loadModelSuggestions(index)">
                    <el-option label="1/4快换" value="1/4快换" />
                    <el-option label="1/4" value="1/4" />
                    <el-option label="3/8" value="3/8" />
                    <el-option label="1/2" value="1/2" />
                    <el-option label="3/4" value="3/4" />
                    <el-option label="1寸" value="1寸" />
                  </el-select>
                </el-form-item>
              </el-col>
              </el-row>

              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item label="长度">
                    <el-select v-model="socket.length" placeholder="选择或输入长度" clearable filterable allow-create @change="loadModelSuggestions(index)">
                      <el-option label="30mm" value="30mm" />
                      <el-option label="40mm" value="40mm" />
                      <el-option label="50mm" value="50mm" />
                      <el-option label="60mm" value="60mm" />
                      <el-option label="75mm" value="75mm" />
                      <el-option label="100mm" value="100mm" />
                      <el-option label="150mm" value="150mm" />
                      <el-option label="200mm" value="200mm" />
                      <el-option label="250mm" value="250mm" />
                      <el-option label="300mm" value="300mm" />
                      <el-option label="350mm" value="350mm" />
                      <el-option label="400mm" value="400mm" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="磁性类型">
                    <el-select v-model="socket.magnetic" placeholder="选择磁性类型" clearable @change="loadModelSuggestions(index)">
                      <el-option label="无磁性" value="无磁性" />
                      <el-option label="固定磁" value="固定磁" />
                      <el-option label="伸缩磁" value="伸缩磁" />
                      <el-option label="中空磁" value="中空磁" />
                      <el-option label="外置磁环" value="外置磁环" />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="特殊要求">
                    <el-checkbox-group v-model="socket.specialRequirements" @change="handleSpecialRequirementsChange(index)">
                      <el-checkbox label="抗振" />
                      <el-checkbox label="密封圈" />
                      <el-checkbox label="销子" />
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <!-- 添加套筒按钮 -->
            <div class="add-socket-btn">
              <el-button type="primary" plain @click="addSocket">
                <el-icon><Plus /></el-icon>
                添加更多套筒
              </el-button>
              <el-button type="success" @click="generateSocketReport">
                <el-icon><Document /></el-icon>
                生成报价单(Excel)
              </el-button>
              <el-text type="info" size="small" style="margin-left: 8px;">
                💡 生成后可在Excel中编辑价格、打印或导出PDF
              </el-text>
            </div>

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
          您选择了{{ dialogTriggerType === 'toolType' ? '油压脉冲工具' : '抗振套筒' }}，请确认您使用的工具品牌：
        </p>
        <el-radio-group v-model="antiVibrationBrand" size="large" style="width: 100%;">
          <el-radio label="AtlasCopco油压脉冲" border style="width: 100%; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: 600;">阿特拉斯科普柯（Atlas Copco）油压脉冲</span>
              <el-tag size="small" type="primary">推荐</el-tag>
            </div>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #999;">
              适用于阿特拉斯科普柯品牌油压脉冲工具，专用抗振套筒，型号自动加"a"后缀
            </p>
          </el-radio>
          <el-radio label="其他品牌" border style="width: 100%;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-weight: 600;">其他品牌</span>
            </div>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #999;">
              适用于其他品牌油压脉冲工具的通用抗振套筒
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
import { useSocketDatabaseStore } from '../store/socketDatabase'
import { useProductionLineStore } from '../store/productionLine'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Tools, Search, RefreshLeft, Document, CircleCheck, 
  Star, InfoFilled, Phone, View, MagicStick, Checked,
  Setting, QuestionFilled, Plus, Delete, Check, HomeFilled
} from '@element-plus/icons-vue'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import AOS from 'aos'
import 'aos/dist/aos.css'
import * as XLSX from 'xlsx'

const router = useRouter()
const toolStore = useToolDatabaseStore()
const socketStore = useSocketDatabaseStore()
const productionLineStore = useProductionLineStore()

// 返回主页
const goHome = () => {
  router.push('/')
  ElMessage.success('返回主页')
}

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
const dialogTriggerType = ref('') // 'toolType' 或 'antiVibration'

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
  // 套筒选型 - 支持多个套筒
  sockets: [
    {
      toolType: '', // 工具类型(油压脉冲/其他)
      model: '', // 套筒型号
      quantity: 1, // 套筒数量
      toolBrand: '', // 工具品牌
      toolModel: '', // 工具型号
      shape: '',
      outputType: '', // 输出端类型(原:输入端类型)
      outputSize: '', // 输出端对边尺寸(原:输出端尺寸)
      inputSquareSize: '', // 四方尺寸(原:输入端四方尺寸)
      magnetic: '',
      length: '', // 长度(原:长度类型)
      specialRequirements: [],
      antiVibrationBrand: '', // 抗振品牌
      modelSuggestions: [] // 型号建议列表
    }
  ],
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
  return requirements.sockets.some(s => s.outputType) || 
         requirements.errorProofing.length > 0 || 
         requirements.accessories.length > 0 || 
         requirements.software.length > 0
})

// 处理工具类型变化
const handleToolTypeChange = (socketIndex) => {
  const socket = requirements.sockets[socketIndex]
  
  if (socket.toolType === '油压脉冲') {
    // 自动勾选"抗振"
    if (!socket.specialRequirements.includes('抗振')) {
      socket.specialRequirements.push('抗振')
    }
    
    // 弹出品牌选择对话框
    dialogTriggerType.value = 'toolType'
    antiVibrationDialogVisible.value = true
    antiVibrationBrand.value = '' // 重置选择
    currentSocketIndex.value = socketIndex // 记录当前套筒索引
    
    // 套筒型号加AV前缀
    if (socket.model && !socket.model.startsWith('AV')) {
      socket.model = 'AV' + socket.model
    }
  } else if (socket.toolType === '其他') {
    // 清除抗振品牌
    socket.antiVibrationBrand = ''
    socket.toolBrand = ''
    // 不自动移除"抗振"选项,用户可能手动保留
  }
  
  // 重新加载型号建议
  loadModelSuggestions(socketIndex)
}

// 处理特殊要求变化（监听抗振勾选）
const handleSpecialRequirementsChange = (socketIndex) => {
  const socket = requirements.sockets[socketIndex]
  // 检查是否新增了"抗振"选项
  const hasAntiVibration = socket.specialRequirements.includes('抗振')
  const hadAntiVibration = socket.antiVibrationBrand !== ''
  
  if (hasAntiVibration && !hadAntiVibration && socket.toolType !== '油压脉冲') {
    // 用户手动勾选了抗振(非油压脉冲触发)，弹出品牌选择对话框
    dialogTriggerType.value = 'antiVibration'
    antiVibrationDialogVisible.value = true
    antiVibrationBrand.value = '' // 重置选择
    currentSocketIndex.value = socketIndex // 记录当前套筒索引
  } else if (!hasAntiVibration) {
    // 用户取消了抗振，清除品牌选择
    socket.antiVibrationBrand = ''
    socket.toolBrand = ''
    socket.toolModel = ''
  }
  
  // 重新加载型号建议
  loadModelSuggestions(socketIndex)
}

// 当前正在编辑的套筒索引
const currentSocketIndex = ref(0)

// 确认抗振品牌
const confirmAntiVibrationBrand = () => {
  if (!antiVibrationBrand.value) {
    ElMessage.warning('请选择工具品牌')
    return
  }
  
  const socket = requirements.sockets[currentSocketIndex.value]
  socket.antiVibrationBrand = antiVibrationBrand.value
  
  // 根据选择设置工具品牌和型号
  if (antiVibrationBrand.value === 'AtlasCopco油压脉冲') {
    socket.toolBrand = 'Atlas Copco'
    
    // 工具型号自动加小写"a"(如果没有)
    if (socket.toolModel && !socket.toolModel.endsWith('a')) {
      socket.toolModel = socket.toolModel + 'a'
    }
    
    // 套筒型号加AV前缀(如果还没有) 并确保后缀带a
    if (socket.model) {
      // 先加AV前缀
      if (!socket.model.startsWith('AV')) {
        socket.model = 'AV' + socket.model
      }
      // 确保末尾带a（Atlascopco油压脉冲专用）
      if (!socket.model.endsWith('a')) {
        socket.model = socket.model + 'a'
      }
    }
  } else {
    socket.toolBrand = '其他品牌'
  }
  
  antiVibrationDialogVisible.value = false
  
  ElMessage.success({
    message: `已选择:${antiVibrationBrand.value}`,
    duration: 2000
  })
  
  // 重新加载型号建议
  loadModelSuggestions(currentSocketIndex.value)
}

// 加载型号建议 - 根据当前选择的参数从数据库匹配
const loadModelSuggestions = (socketIndex) => {
  const socket = requirements.sockets[socketIndex]
  
  // 构建查询条件
  const criteria = {}
  
  if (socket.shape) criteria.socketShape = socket.shape
  if (socket.outputType) criteria.inputType = socket.outputType
  if (socket.outputSize) criteria.inputSize = socket.outputSize
  if (socket.inputSquareSize) {
    // 转换格式: 1/4快换 -> 1/4快换, 1/2 -> 1/2四方
    if (socket.inputSquareSize.includes('快换')) {
      criteria.squareSize = socket.inputSquareSize
    } else {
      criteria.squareSize = socket.inputSquareSize + '四方'
    }
  }
  if (socket.magnetic) criteria.magnetic = socket.magnetic
  if (socket.length) criteria.lengthRequirement = socket.length.replace('mm', '')
  if (socket.specialRequirements.includes('抗振')) criteria.antiVibration = true
  if (socket.specialRequirements.includes('密封圈')) criteria.sealRingPin = true
  
  // 从数据库推荐
  const suggestions = socketStore.recommendSockets(criteria)
  
  // 更新建议列表
  socket.modelSuggestions = suggestions.slice(0, 10) // 最多显示10个建议
  
  console.log('型号建议:', socket.modelSuggestions.length, '个')
}

// 选择型号后自动填充
const handleModelSelect = (socketIndex, modelCode) => {
  const socket = requirements.sockets[socketIndex]
  
  // 找到选中的型号
  const selected = socket.modelSuggestions.find(s => s.model === modelCode)
  
  if (selected) {
    // 自动填充数据
    socket.shape = selected.socketType.shape || socket.shape
    socket.outputType = selected.socketType.inputType || socket.outputType
    socket.outputSize = selected.socketType.inputSize || socket.outputSize
    socket.magnetic = selected.socketType.magnetic || socket.magnetic
    socket.length = selected.specifications.length || socket.length
    
    // 填充四方尺寸(去掉"四方"后缀)
    if (selected.squareSize) {
      socket.inputSquareSize = selected.squareSize.replace('四方', '')
    }
    
    // 如果选中的是Atlascopco品牌且为油压脉冲，确保套筒型号带a后缀
    if (selected.brand === 'Atlascopco' && selected.toolType === '油压脉冲') {
      if (!socket.model.endsWith('a')) {
        socket.model = socket.model + 'a'
      }
    }
    
    ElMessage.success(`已选择: ${selected.model} - ${selected.name}`)
  }
}

// 添加套筒
const addSocket = () => {
  requirements.sockets.push({
    toolType: '',
    model: '',
    quantity: 1,
    toolBrand: '',
    toolModel: '',
    shape: '',
    outputType: '',
    outputSize: '',
    inputSquareSize: '',
    magnetic: '',
    length: '',
    specialRequirements: [],
    antiVibrationBrand: '',
    modelSuggestions: []
  })
  
  ElMessage.success('已添加新套筒')
}

// 删除套筒
const removeSocket = (index) => {
  if (requirements.sockets.length === 1) {
    ElMessage.warning('至少保留一个套筒')
    return
  }
  
  requirements.sockets.splice(index, 1)
  ElMessage.success('已删除套筒')
}

// 取消抗振选择
const cancelAntiVibration = () => {
  const socket = requirements.sockets[currentSocketIndex.value]
  
  if (dialogTriggerType.value === 'toolType') {
    // 由工具类型触发,取消时清空工具类型
    socket.toolType = ''
  }
  
  // 取消时移除"抗振"选项
  const index = socket.specialRequirements.indexOf('抗振')
  if (index > -1) {
    socket.specialRequirements.splice(index, 1)
  }
  
  socket.antiVibrationBrand = ''
  socket.toolBrand = ''
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
    sockets: [
      {
        toolType: '',
        model: 'SK-001',
        quantity: 2,
        toolBrand: '',
        toolModel: '',
        shape: '标准',
        outputType: '外六角',
        outputSize: '13mm',
        inputSquareSize: '1/2',
        magnetic: '固定磁',
        length: '50mm',
        specialRequirements: ['抗振'],
        antiVibrationBrand: '',
        modelSuggestions: []
      }
    ],
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
      model: '',
      quantity: 1,
      shape: '',
      outputType: '',
      outputSize: '',
      inputSquareSize: '',
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
  // 移除必填限制,允许部分填写
  const report = {
    基本信息: {
      线体名称: requirements.productionLine || '未填写',
      工位名称: requirements.workstation || '未填写',
      动力形式: requirements.powerType || '未选择',
      扭矩要求: requirements.torque ? `${requirements.torque}Nm` : '未填写',
      精度要求: requirements.accuracy || '未选择'
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
    套筒配置: getSocketsInfo(),
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
  const fileName = requirements.workstation || '未命名工位'
  link.download = `工具选型需求报告_${fileName}_${new Date().getTime()}.txt`
  link.click()
  URL.revokeObjectURL(url)
  
  ElMessage.success('需求报告已生成并下载')
}

// 获取套筒信息摘要
const getSocketsInfo = () => {
  if (requirements.sockets.length === 0) return '未配置'
  
  return requirements.sockets.map((socket, index) => {
    const parts = []
    if (socket.toolType) parts.push(`工具类型:${socket.toolType}`)
    if (socket.model) parts.push(`型号:${socket.model}`)
    if (socket.quantity > 1) parts.push(`数量:${socket.quantity}`)
    if (socket.toolBrand) parts.push(`工具品牌:${socket.toolBrand}`)
    if (socket.toolModel) parts.push(`工具型号:${socket.toolModel}`)
    if (socket.shape) parts.push(`外形:${socket.shape}`)
    if (socket.outputType) parts.push(`输出端:${socket.outputType}`)
    if (socket.outputSize) parts.push(`尺寸:${socket.outputSize}`)
    if (socket.length) parts.push(`长度:${socket.length}`)
    if (socket.magnetic) parts.push(`磁性:${socket.magnetic}`)
    
    return `套筒${index + 1}: ${parts.length > 0 ? parts.join(', ') : '未配置'}`
  }).join('\n  ')
}

// 生成套筒选型报告(Excel 格式 - 专业报价单)
const generateSocketReport = () => {
  if (requirements.sockets.length === 0 || !requirements.sockets[0].model) {
    ElMessage.warning('请至少配置一个套筒')
    return
  }
  
  // 准备 Excel 数据
  const excelData = []
  
  // ========== 标题 ==========
  excelData.push(['套筒选型报价单'])
  excelData.push([]) // 空行
  
  // ========== 买方信息 ==========
  excelData.push(['买方信息'])
  excelData.push(['公司名称', '', '', '联系人', '', '电话'])
  excelData.push(['', '', '', '', '', ''])
  excelData.push(['地址', '', '', '邮箱', '', ''])
  excelData.push(['', '', '', '', '', ''])
  excelData.push(['收货地址', '', '', '', '', ''])
  excelData.push(['', '', '', '', '', ''])
  excelData.push([]) // 空行
  
  // ========== 卖方信息 ==========
  excelData.push(['卖方信息'])
  excelData.push(['公司名称', '广州市明升伟业机电有限公司', '', '联系人', '', ''])
  excelData.push(['电话', '020-36815338 / 81196563 / 80720355', '', '', '', ''])
  excelData.push(['公司地址', '广州市荔湾区中山八路23号1709房', '', '', '', ''])
  excelData.push(['工厂地址', '广州市花都区秀全街红棉大道东，永祥路8号', '', '', '', ''])
  excelData.push(['网址', 'www.minsheng.net.cn / www.eqtcf.cn', '', '', '', ''])
  excelData.push(['邮箱', 'mingsheng@minsheng.net.cn', '', '', '', ''])
  excelData.push([]) // 空行
  
  // ========== 产品明细表头 ==========
  excelData.push(['产品明细'])
  excelData.push([
    '序号',
    '工具类型',
    '套筒型号',
    '工具品牌',
    '工具型号',
    '套筒外形',
    '输出端类型',
    '输出端对边尺寸',
    '四方尺寸',
    '长度',
    '磁性类型',
    '是否抗振',
    '特殊要求',
    '数量',
    '单价(不含税)',
    '单价(含税)',
    '总价',
    '货期(天)',
    '备注'
  ])
  
  // ========== 产品数据行 ==========
  let totalAmount = 0
  requirements.sockets.forEach((socket, index) => {
    const quantity = socket.quantity || 1
    const unitPrice = 0 // 默认单价,可手动填写
    const unitPriceWithTax = 0 // 含税单价,可手动填写
    const total = unitPriceWithTax * quantity
    totalAmount += total
    
    excelData.push([
      index + 1,
      socket.toolType || '', // 工具类型
      socket.model || '',
      socket.toolBrand || '', // 工具品牌
      socket.toolModel || '', // 工具型号
      socket.shape || '',
      socket.outputType || '',
      socket.outputSize || '',
      socket.inputSquareSize || '',
      socket.length || '',
      socket.magnetic || '',
      socket.specialRequirements.includes('抗振') ? '是' : '否', // 是否抗振
      socket.specialRequirements.filter(r => r !== '抗振').join('、') || '无', // 其他特殊要求
      quantity,
      unitPrice,
      unitPriceWithTax,
      total,
      '', // 货期(可手动填写)
      '' // 备注
    ])
  })
  
  // ========== 合计 ==========
  excelData.push([
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    '合计',
    '',
    '',
    totalAmount,
    '',
    ''
  ])
  excelData.push([]) // 空行
  
  // ========== 报价信息 ==========
  const now = new Date()
  const quoteDate = now.toLocaleDateString('zh-CN')
  const validUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN') // 默认30天有效期
  
  excelData.push(['报价信息'])
  excelData.push(['报价时间', quoteDate])
  excelData.push(['报价有效期', validUntil])
  excelData.push(['备注说明', ''])
  excelData.push([]) // 空行
  
  // ========== 附加信息 ==========
  if (requirements.productionLine || requirements.workstation) {
    excelData.push(['应用信息'])
    if (requirements.productionLine) {
      excelData.push(['线体名称', requirements.productionLine])
    }
    if (requirements.workstation) {
      excelData.push(['工位名称', requirements.workstation])
    }
  }
  
  // ========== 创建工作簿 ==========
  const worksheet = XLSX.utils.aoa_to_sheet(excelData)
  
  // ========== 设置列宽 ==========
  worksheet['!cols'] = [
    { wch: 6 },  // 序号
    { wch: 12 }, // 工具类型
    { wch: 16 }, // 套筒型号
    { wch: 14 }, // 工具品牌
    { wch: 14 }, // 工具型号
    { wch: 10 }, // 套筒外形
    { wch: 12 }, // 输出端类型
    { wch: 16 }, // 输出端对边尺寸
    { wch: 12 }, // 四方尺寸
    { wch: 10 }, // 长度
    { wch: 12 }, // 磁性类型
    { wch: 10 }, // 是否抗振
    { wch: 12 }, // 特殊要求
    { wch: 8 },  // 数量
    { wch: 14 }, // 单价(不含税)
    { wch: 14 }, // 单价(含税)
    { wch: 12 }, // 总价
    { wch: 12 }, // 货期
    { wch: 20 }  // 备注
  ]
  
  // ========== 设置单元格样式(合并单元格) ==========
  const merges = []
  
  // 标题合并 A1:S1
  merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: 18 } })
  
  // 买方信息标题 A3:F3
  merges.push({ s: { r: 2, c: 0 }, e: { r: 2, c: 5 } })
  
  // 卖方信息标题
  const sellerTitleRow = 9
  merges.push({ s: { r: sellerTitleRow, c: 0 }, e: { r: sellerTitleRow, c: 5 } })
  
  // 产品明细标题
  const productTitleRow = 13
  merges.push({ s: { r: productTitleRow, c: 0 }, e: { r: productTitleRow, c: 18 } })
  
  worksheet['!merges'] = merges
  
  // ========== 设置行高 ==========
  worksheet['!rows'] = [
    { hpt: 30 }, // 标题行
  ]
  
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '套筒选型报价单')
  
  // ========== 生成文件名 ==========
  const fileName = requirements.workstation 
    ? `套筒选型报价单_${requirements.workstation}_${new Date().getTime()}.xlsx`
    : `套筒选型报价单_${new Date().getTime()}.xlsx`
  
  // ========== 下载 Excel ==========
  XLSX.writeFile(workbook, fileName)
  
  ElMessage.success('套筒选型报价单(Excel)已生成并下载，可直接编辑和打印')
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

/* 套筒选型样式 */
.socket-item {
  padding: 20px;
  background: #f9fafb;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  margin-bottom: 16px;
}

.socket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.socket-label {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.add-socket-btn {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 16px;
}

/* 型号选项样式 */
.model-option {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.model-code {
  font-weight: 600;
  color: #303133;
  min-width: 120px;
}

.model-name {
  flex: 1;
  color: #606266;
  font-size: 13px;
}



</style>
