<template>
  <div class="bid-predictor">
    <!-- 主界面布局 -->
    <div class="predictor-header">
      <h2>🎯 投标预测AI系统</h2>
      <div class="header-actions">
        <el-button @click="goHome">
          <el-icon><HomeFilled /></el-icon>
          返回主页
        </el-button>
        <el-tag :type="getCurrentRoundType()">第{{ currentRound }}轮预测</el-tag>
      </div>
    </div>

    <div class="predictor-layout">
      <!-- 左侧导航栏 -->
      <div class="sidebar">
        <div class="sidebar-section">
          <div class="section-header">
            <h3>📋 项目列表</h3>
            <el-button 
              type="primary" 
              size="small" 
              @click="showProjectForm = true; editingProject = { id: null, name: '', amount: 0, customer: '', cost: 0, status: 'active', rounds: [], competitors: [] }"
              circle
            >
              <el-icon><Plus /></el-icon>
            </el-button>
          </div>
          <el-scrollbar height="200px">
            <div 
              v-for="project in bidProjects" 
              :key="project.id"
              class="project-item"
              :class="{ active: currentProject?.id === project.id }"
            >
              <div @click="selectProject(project)" style="flex: 1;">
                <div class="project-name">{{ project.name }}</div>
                <div class="project-amount">¥{{ formatMoney(project.amount) }}</div>
                <el-tag size="small" :type="project.status === 'active' ? 'success' : 'info'">
                  {{ project.status === 'active' ? '进行中' : '已完成' }}
                </el-tag>
              </div>
              <div class="project-actions">
                <el-button 
                  type="primary" 
                  size="small" 
                  link
                  @click="openProjectEditor(project)"
                >
                  <el-icon><Edit /></el-icon>
                </el-button>
              </div>
            </div>
          </el-scrollbar>
        </div>

        <div class="sidebar-section">
          <h3>👥 客户列表</h3>
          <el-select v-model="selectedCustomer" placeholder="选择客户" style="width: 100%;">
            <el-option 
              v-for="customer in customers" 
              :key="customer.id"
              :label="customer.name"
              :value="customer.id"
            />
          </el-select>
        </div>

        <div class="sidebar-section">
          <h3>📊 投标历史</h3>
          <el-statistic title="历史中标率" :value="historicalWinRate" suffix="%" />
          <el-statistic title="已投项目" :value="completedBids" suffix="个" class="mt-2" />
        </div>

        <div class="sidebar-section">
          <el-button type="primary" @click="simulatorVisible = true" style="width: 100%;">
            <el-icon><DataAnalysis /></el-icon>
            打开模拟器
          </el-button>
        </div>
      </div>

      <!-- 主显示区 -->
      <div class="main-display">
        <div v-if="currentProject" class="display-content">
          <!-- 当前轮信息卡片 -->
          <el-card class="round-info-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>第{{ currentRound }}轮投标信息</span>
                <el-button 
                  type="primary" 
                  size="small"
                  @click="nextRound"
                  :disabled="currentRound >= 3"
                >
                  进入下一轮
                </el-button>
              </div>
            </template>

            <!-- 中标概率 -->
            <div class="probability-section">
              <div class="probability-display">
                <div class="probability-value">{{ winProbability.toFixed(1) }}%</div>
                <div class="probability-label">中标概率</div>
                <div class="probability-trend" :class="getTrendClass()">
                  <el-icon v-if="probabilityTrend > 0"><CaretTop /></el-icon>
                  <el-icon v-else-if="probabilityTrend < 0"><CaretBottom /></el-icon>
                  <span>{{ probabilityTrend > 0 ? '+' : '' }}{{ probabilityTrend.toFixed(1) }}%</span>
                </div>
              </div>

              <el-progress 
                :percentage="winProbability" 
                :color="getProgressColor(winProbability)"
                :stroke-width="20"
              />
            </div>

            <!-- 建议报价区间 -->
            <div class="price-range-section">
              <h4>💰 建议报价区间</h4>
              <div class="price-range-chart">
                <div class="price-marker min-price">
                  <span class="label">最低</span>
                  <span class="value">¥{{ formatMoney(suggestedPriceRange.min) }}</span>
                </div>
                <div class="price-bar">
                  <div 
                    class="optimal-range" 
                    :style="getOptimalRangeStyle()"
                  ></div>
                  <div 
                    class="current-bid-marker"
                    :style="getCurrentBidStyle()"
                  >
                    <el-tooltip content="当前报价" placement="top">
                      <div class="marker-dot"></div>
                    </el-tooltip>
                  </div>
                </div>
                <div class="price-marker max-price">
                  <span class="label">最高</span>
                  <span class="value">¥{{ formatMoney(suggestedPriceRange.max) }}</span>
                </div>
              </div>
            </div>

            <!-- 竞对报价趋势 - 当前轮次 -->
            <div class="competitor-trends-section">
              <h4>📈 竞对报价趋势 (第{{ currentRound }}轮)</h4>
              <div class="competitor-chart">
                <div 
                  v-for="comp in competitorBids" 
                  :key="comp.id"
                  class="competitor-bar"
                >
                  <div class="comp-name">{{ comp.name }}</div>
                  <div class="comp-bar-wrapper">
                    <div 
                      class="comp-bar-fill"
                      :style="{ width: getCompetitorBarWidth(comp) }"
                    ></div>
                    <span class="comp-price">¥{{ formatMoney(comp.predictedBid) }}</span>
                  </div>
                  <el-tag size="small" :type="comp.strategy === '激进' ? 'danger' : 'success'">
                    {{ comp.strategy }}
                  </el-tag>
                </div>
              </div>
            </div>

            <!-- 5个竞对多轮对比图表 -->
            <div class="multi-round-comparison-section">
              <h4>📊 5个竞对多轮报价对比</h4>
              <div class="comparison-chart">
                <!-- 图表表头 -->
                <div class="chart-header">
                  <div class="header-label">竞对</div>
                  <div class="header-round">第一轮</div>
                  <div class="header-round">第二轮</div>
                  <div class="header-round">第三轮</div>
                  <div class="header-trend">趋势</div>
                </div>

                <!-- 我方报价行 -->
                <div class="chart-row our-row">
                  <div class="row-label">
                    <el-tag type="success" size="small">我方</el-tag>
                  </div>
                  <div class="row-value">
                    <div class="value-bar our-bar" :style="{ width: getOurBidBarWidth(1) }">
                      <span class="value-text">¥{{ formatMoneyShort(currentProject.ourBids?.round1 || 0) }}</span>
                    </div>
                  </div>
                  <div class="row-value">
                    <div class="value-bar our-bar" :style="{ width: getOurBidBarWidth(2) }">
                      <span class="value-text">¥{{ formatMoneyShort(currentProject.ourBids?.round2 || 0) }}</span>
                    </div>
                  </div>
                  <div class="row-value">
                    <div class="value-bar our-bar" :style="{ width: getOurBidBarWidth(3) }">
                      <span class="value-text">¥{{ formatMoneyShort(currentProject.ourBids?.round3 || 0) }}</span>
                    </div>
                  </div>
                  <div class="row-trend">
                    <el-icon :color="getOurTrendColor()">
                      <component :is="getOurTrendIcon()" />
                    </el-icon>
                    <span class="trend-percentage">{{ getOurTrendPercentage() }}</span>
                  </div>
                </div>

                <!-- 竞对报价行 -->
                <div 
                  v-for="(comp, index) in currentProject.competitors?.slice(0, 5) || []" 
                  :key="index"
                  class="chart-row"
                >
                  <div class="row-label">
                    <div class="comp-info">
                      <div class="comp-company">{{ comp.companyName || `竞对${index + 1}` }}</div>
                      <div class="comp-brand">{{ comp.brandName || '-' }}</div>
                    </div>
                  </div>
                  <div class="row-value">
                    <div class="value-bar comp-bar" :style="{ width: getCompBidBarWidth(comp.round1, 1), background: getCompetitorColor(index) }">
                      <span class="value-text">¥{{ formatMoneyShort(comp.round1 || 0) }}</span>
                    </div>
                  </div>
                  <div class="row-value">
                    <div class="value-bar comp-bar" :style="{ width: getCompBidBarWidth(comp.round2, 2), background: getCompetitorColor(index) }">
                      <span class="value-text">¥{{ formatMoneyShort(comp.round2 || 0) }}</span>
                    </div>
                  </div>
                  <div class="row-value">
                    <div class="value-bar comp-bar" :style="{ width: getCompBidBarWidth(comp.round3, 3), background: getCompetitorColor(index) }">
                      <span class="value-text">¥{{ formatMoneyShort(comp.round3 || 0) }}</span>
                    </div>
                  </div>
                  <div class="row-trend">
                    <el-icon :color="getCompTrendColor(comp)">
                      <component :is="getCompTrendIcon(comp)" />
                    </el-icon>
                    <span class="trend-percentage">{{ getCompTrendPercentage(comp) }}</span>
                  </div>
                </div>

                <!-- 图表说明 -->
                <div class="chart-legend">
                  <div class="legend-item">
                    <div class="legend-color our-color"></div>
                    <span>我方报价</span>
                  </div>
                  <div class="legend-item">
                    <el-icon><CaretBottom /></el-icon>
                    <span>降价趋势</span>
                  </div>
                  <div class="legend-item">
                    <el-icon><CaretTop /></el-icon>
                    <span>涨价趋势</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 历史数据参考 -->
            <div class="historical-data-section">
              <h4>📚 历史数据参考</h4>
              <el-row :gutter="16">
                <el-col :span="8">
                  <div class="data-card">
                    <div class="data-label">历史中标率</div>
                    <div class="data-value">{{ historicalWinRate }}%</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="data-card">
                    <div class="data-label">上轮竞对报价</div>
                    <div class="data-value">¥{{ formatMoney(lastRoundCompetitorAvg) }}</div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="data-card">
                    <div class="data-label">客户互动强度</div>
                    <el-rate v-model="customerInteraction" disabled />
                  </div>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </div>

        <div v-else class="empty-state">
          <el-empty description="请从左侧选择投标项目" />
        </div>
      </div>
    </div>

    <!-- 底部操作区 -->
    <div v-if="currentProject" class="operation-section">
      <!-- 报价滑块 -->
      <div class="price-slider-section">
        <h3>💵 调整报价</h3>
        <div class="slider-wrapper">
          <el-slider 
            v-model="currentBid" 
            :min="suggestedPriceRange.min * 0.8"
            :max="suggestedPriceRange.max * 1.2"
            :step="1000"
            :format-tooltip="formatSliderTooltip"
            @input="calculateRealtime"
          />
          <div class="bid-display">
            <span class="label">当前报价：</span>
            <span class="value">¥{{ formatMoney(currentBid) }}</span>
          </div>
        </div>

        <!-- 实时计算结果 -->
        <div class="realtime-results">
          <div class="result-item">
            <span class="label">实时中标概率：</span>
            <span class="value" :class="getProbabilityClass(winProbability)">
              {{ winProbability.toFixed(1) }}%
            </span>
          </div>
          <div class="result-item">
            <span class="label">期望利润：</span>
            <span class="value profit">¥{{ formatMoney(expectedProfit) }}</span>
          </div>
          <div class="result-item">
            <span class="label">利润率：</span>
            <span class="value" :class="getProfitRateClass(profitRate)">
              {{ profitRate.toFixed(1) }}%
            </span>
          </div>
        </div>
      </div>

      <!-- 提交按钮和风险提示 -->
      <div class="submit-section">
        <div class="risk-alerts">
          <el-alert 
            v-if="winProbability < 30"
            type="error"
            title="⚠️ 中标风险高"
            description="当前报价中标概率较低，建议降低报价或重新评估"
            :closable="false"
          />
          <el-alert 
            v-if="profitRate < 10"
            type="warning"
            title="⚠️ 利润不足"
            description="当前报价利润率过低，建议适当提高报价"
            :closable="false"
          />
          <el-alert 
            v-if="winProbability >= 60 && profitRate >= 15"
            type="success"
            title="✅ 报价优秀"
            description="当前报价平衡了中标概率和利润，建议提交"
            :closable="false"
          />
        </div>

        <el-button 
          type="primary" 
          size="large"
          @click="submitBid"
          style="width: 200px;"
        >
          <el-icon><Check /></el-icon>
          提交第{{ currentRound }}轮报价
        </el-button>
      </div>

      <!-- AI解释模块 -->
      <div class="ai-explanation-section">
        <h3>🤖 AI分析与影响因素</h3>
        <div class="influence-factors">
          <div 
            v-for="factor in influenceFactors" 
            :key="factor.name"
            class="factor-item"
          >
            <div class="factor-header">
              <span class="factor-name">{{ factor.name }}</span>
              <span class="factor-weight">权重: {{ factor.weight }}%</span>
            </div>
            <el-progress 
              :percentage="factor.impact" 
              :color="factor.impact > 50 ? '#67c23a' : '#e6a23c'"
            />
            <div class="factor-description">{{ factor.description }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 多轮模拟器对话框 -->
    <el-dialog
      v-model="simulatorVisible"
      title="📊 多轮投标模拟器"
      width="1000px"
      top="5vh"
    >
      <div class="simulator-content">
        <el-form label-width="120px">
          <el-form-item label="竞对数量">
            <el-input-number v-model="simulator.competitorCount" :min="2" :max="8" />
          </el-form-item>

          <el-form-item label="竞对策略">
            <el-radio-group v-model="simulator.competitorStrategy">
              <el-radio label="conservative">保守（高报价）</el-radio>
              <el-radio label="moderate">中等</el-radio>
              <el-radio label="aggressive">激进（低报价）</el-radio>
              <el-radio label="mixed">混合</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="我方报价策略">
            <el-slider 
              v-model="simulator.ourBidStrategy" 
              :min="1"
              :max="100"
              :marks="{ 1: '最低', 50: '适中', 100: '最高' }"
            />
          </el-form-item>

          <el-button type="primary" @click="runSimulation">
            <el-icon><VideoPlay /></el-icon>
            运行模拟
          </el-button>
        </el-form>

        <el-divider />

        <!-- 模拟结果 -->
        <div v-if="simulationResults" class="simulation-results">
          <h3>模拟结果（1000次蒙特卡洛模拟）</h3>
          
          <el-row :gutter="20">
            <el-col :span="8">
              <el-statistic title="平均中标概率" :value="simulationResults.avgWinRate" suffix="%" />
            </el-col>
            <el-col :span="8">
              <el-statistic title="期望利润" :value="simulationResults.avgProfit" prefix="¥" />
            </el-col>
            <el-col :span="8">
              <el-statistic title="风险等级" :value="simulationResults.riskLevel" />
            </el-col>
          </el-row>

          <div class="simulation-chart">
            <h4>各轮中标概率变化</h4>
            <div class="chart-bars">
              <div v-for="(round, index) in simulationResults.roundResults" :key="index" class="chart-bar">
                <div class="bar-label">第{{ index + 1 }}轮</div>
                <div class="bar-wrapper">
                  <div 
                    class="bar-fill"
                    :style="{ height: round.probability + '%' }"
                  >
                    <span class="bar-value">{{ round.probability }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <el-alert 
            :type="simulationResults.recommendation.type"
            :title="simulationResults.recommendation.title"
            :description="simulationResults.recommendation.message"
            show-icon
          />
        </div>
      </div>
    </el-dialog>

    <!-- 项目编辑/新增对话框 -->
    <el-dialog
      v-model="showProjectForm"
      :title="editingProject.id ? '编辑投标项目' : '新增投标项目'"
      width="1200px"
      top="5vh"
    >
      <el-form :model="editingProject" label-width="120px">
        <!-- 基本信息 -->
        <el-divider content-position="left">
          <h3>📝 项目基本信息</h3>
        </el-divider>
        
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目名称" required>
              <el-input v-model="editingProject.name" placeholder="请输入项目名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="客户名称">
              <el-input v-model="editingProject.customer" placeholder="请输入客户名称" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="项目预算(元)" required>
              <el-input-number 
                v-model="editingProject.amount" 
                :min="0" 
                :step="10000"
                style="width: 100%;"
                placeholder="项目预算金额"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="我方成本(元)" required>
              <el-input-number 
                v-model="editingProject.cost" 
                :min="0" 
                :step="10000"
                style="width: 100%;"
                placeholder="我方成本"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="项目描述">
              <el-input 
                v-model="editingProject.description" 
                type="textarea"
                :rows="3"
                placeholder="请输入项目详细描述..."
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 我方投标信息 -->
        <el-divider content-position="left">
          <h3>💼 我方投标信息</h3>
        </el-divider>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="第一轮报价(元)">
              <el-input-number 
                v-model="editingProject.ourBids.round1" 
                :min="0" 
                :step="1000"
                style="width: 100%;"
                placeholder="第一轮报价"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="第二轮报价(元)">
              <el-input-number 
                v-model="editingProject.ourBids.round2" 
                :min="0" 
                :step="1000"
                style="width: 100%;"
                placeholder="第二轮报价"
              />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="第三轮报价(元)">
              <el-input-number 
                v-model="editingProject.ourBids.round3" 
                :min="0" 
                :step="1000"
                style="width: 100%;"
                placeholder="第三轮报价"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="方案供货范围">
              <el-input 
                v-model="editingProject.ourScope" 
                type="textarea"
                :rows="2"
                placeholder="请输入我方方案供货范围..."
              />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 竞对信息 -->
        <el-divider content-position="left">
          <div style="display: flex; align-items: center; gap: 10px;">
            <h3 style="margin: 0;">🏢 竞对信息</h3>
            <el-button type="primary" size="small" @click="addCompetitor">
              <el-icon><Plus /></el-icon>
              添加竞对
            </el-button>
          </div>
        </el-divider>

        <div v-if="!editingProject.competitors || editingProject.competitors.length === 0" class="empty-competitors">
          <el-empty description="暂无竞对信息" :image-size="80" />
        </div>

        <el-card 
          v-for="(comp, index) in editingProject.competitors" 
          :key="index"
          class="competitor-card"
          shadow="hover"
        >
          <template #header>
            <div class="card-header">
              <span>竞对 {{ index + 1 }}</span>
              <el-button 
                type="danger" 
                size="small" 
                link
                @click="removeCompetitor(index)"
              >
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
          </template>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="公司名称">
                <el-input v-model="comp.companyName" placeholder="请输入竞对公司名称" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="品牌名称">
                <el-input v-model="comp.brandName" placeholder="请输入品牌名称" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="方案供货范围">
                <el-input 
                  v-model="comp.scope" 
                  type="textarea"
                  :rows="2"
                  placeholder="请输入竞对方案供货范围..."
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item label="第一轮报价(元)">
                <el-input-number 
                  v-model="comp.round1" 
                  :min="0" 
                  :step="1000"
                  style="width: 100%;"
                  placeholder="第一轮"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="第二轮报价(元)">
                <el-input-number 
                  v-model="comp.round2" 
                  :min="0" 
                  :step="1000"
                  style="width: 100%;"
                  placeholder="第二轮"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="第三轮报价(元)">
                <el-input-number 
                  v-model="comp.round3" 
                  :min="0" 
                  :step="1000"
                  style="width: 100%;"
                  placeholder="第三轮"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-divider content-position="left">历史成交案例</el-divider>

          <el-row :gutter="20">
            <el-col :span="16">
              <el-form-item label="历史案例描述">
                <el-input 
                  v-model="comp.historicalCase" 
                  type="textarea"
                  :rows="2"
                  placeholder="请输入历史成交案例描述..."
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="历史成交金额(元)">
                <el-input-number 
                  v-model="comp.historicalAmount" 
                  :min="0" 
                  :step="10000"
                  style="width: 100%;"
                  placeholder="历史金额"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
      </el-form>

      <template #footer>
        <el-button @click="showProjectForm = false">取消</el-button>
        <el-button type="primary" @click="saveProject">
          <el-icon><Check /></el-icon>
          保存项目
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  DataAnalysis, CaretTop, CaretBottom, Check, VideoPlay,
  Plus, Edit, Delete, HomeFilled
} from '@element-plus/icons-vue'

const router = useRouter()

// ==================== 数据定义 ====================

// 投标项目列表
const bidProjects = ref([
  {
    id: 1,
    name: '某汽车厂拧紧工具采购项目',
    amount: 5000000,
    status: 'active',
    customer: '某汽车制造',
    cost: 3500000,
    description: '某汽车制造厂智能拧紧工具整套解决方案',
    ourBids: {
      round1: 4500000,
      round2: 4200000,
      round3: 4000000
    },
    ourScope: '包含电池拧紧工具、控制器、数据采集系统、培训及售后服务',
    rounds: [],
    competitors: [
      {
        companyName: '某工业设备有限公司',
        brandName: '德国XX品牌',
        scope: '电池拧紧工具、控制器',
        round1: 4800000,
        round2: 4500000,
        round3: 4300000,
        historicalCase: '2023年某汽车厂类似项目',
        historicalAmount: 4600000
      },
      {
        companyName: '某智能装备公司',
        brandName: '瑞典YY品牌',
        scope: '拧紧工具、数据系统、培训',
        round1: 5200000,
        round2: 4900000,
        round3: 4600000,
        historicalCase: '2024年某电子厂项目',
        historicalAmount: 5000000
      },
      {
        companyName: '某机械科技公司',
        brandName: '美国AA品牌',
        scope: '拧紧工具、智能控制系统',
        round1: 4700000,
        round2: 4400000,
        round3: 4200000,
        historicalCase: '2023年某新能源厂项目',
        historicalAmount: 4500000
      },
      {
        companyName: '某自动化设备公司',
        brandName: '瑞士BB品牌',
        scope: '完整拧紧解决方案、售后服务',
        round1: 5000000,
        round2: 4700000,
        round3: 4500000,
        historicalCase: '2024年某航空制造项目',
        historicalAmount: 4800000
      },
      {
        companyName: '某精密工具公司',
        brandName: '日本CC品牌',
        scope: '电池工具、数据采集、培训',
        round1: 4900000,
        round2: 4600000,
        round3: 4400000,
        historicalCase: '2023年某机器人厂项目',
        historicalAmount: 4700000
      }
    ]
  },
  {
    id: 2,
    name: '某电子厂装配工具项目',
    amount: 3000000,
    status: 'active',
    customer: '某电子公司',
    cost: 2000000,
    description: '电子产品装配线智能工具系统',
    ourBids: {
      round1: 2800000,
      round2: 2600000,
      round3: 2400000
    },
    ourScope: '装配工具、质量检测系统、MES集成',
    rounds: [],
    competitors: [
      {
        companyName: '某精密设备公司',
        brandName: '日本ZZ品牌',
        scope: '装配工具、检测系统',
        round1: 2900000,
        round2: 2700000,
        round3: 2500000,
        historicalCase: '2023年某手机厂项目',
        historicalAmount: 2800000
      },
      {
        companyName: '某智能制造公司',
        brandName: '韩国DD品牌',
        scope: '装配工具、MES系统',
        round1: 2850000,
        round2: 2650000,
        round3: 2450000,
        historicalCase: '2024年某笔记本厂项目',
        historicalAmount: 2700000
      },
      {
        companyName: '某工业自动化公司',
        brandName: '台湾EE品牌',
        scope: '完整装配线方案',
        round1: 2950000,
        round2: 2750000,
        round3: 2550000,
        historicalCase: '2023年某平板厂项目',
        historicalAmount: 2800000
      },
      {
        companyName: '某机电科技公司',
        brandName: '欧洲FF品牌',
        scope: '装配工具、质检、培训',
        round1: 3000000,
        round2: 2800000,
        round3: 2600000,
        historicalCase: '2024年某穿戴设备厂项目',
        historicalAmount: 2900000
      },
      {
        companyName: '某精益设备公司',
        brandName: '新加坡GG品牌',
        scope: '智能装配系统',
        round1: 2880000,
        round2: 2680000,
        round3: 2480000,
        historicalCase: '2023年某IoT设备厂项目',
        historicalAmount: 2750000
      }
    ]
  }
])

// 项目编辑
const showProjectForm = ref(false)
const editingProject = ref({
  id: null,
  name: '',
  amount: 0,
  customer: '',
  cost: 0,
  status: 'active',
  description: '',
  ourBids: {
    round1: 0,
    round2: 0,
    round3: 0
  },
  ourScope: '',
  rounds: [],
  competitors: []
})

// 客户列表
const customers = ref([
  { id: 1, name: '某汽车制造', winRate: 65 },
  { id: 2, name: '某电子公司', winRate: 55 },
  { id: 3, name: '某机械厂', winRate: 45 }
])

// 当前选中项目
const currentProject = ref(null)
const selectedCustomer = ref(null)
const currentRound = ref(1)

// 中标概率
const winProbability = ref(0)
const probabilityTrend = ref(0)

// 报价相关
const currentBid = ref(0)
const suggestedPriceRange = ref({ min: 0, max: 0 })

// 竞对报价
const competitorBids = ref([])

// 历史数据
const historicalWinRate = ref(58)
const completedBids = ref(12)
const lastRoundCompetitorAvg = ref(0)
const customerInteraction = ref(4)

// 期望利润和利润率
const expectedProfit = computed(() => {
  if (!currentProject.value) return 0
  const profit = currentBid.value - currentProject.value.cost
  return profit * (winProbability.value / 100)
})

const profitRate = computed(() => {
  if (!currentProject.value || currentBid.value === 0) return 0
  return ((currentBid.value - currentProject.value.cost) / currentBid.value) * 100
})

// 影响因素
const influenceFactors = ref([
  {
    name: '竞对报价走势',
    weight: 35,
    impact: 72,
    description: '竞对采取保守策略，我方报价优势明显'
  },
  {
    name: '客户历史偏好',
    weight: 25,
    impact: 65,
    description: '客户历史倾向于选择中等偏上报价'
  },
  {
    name: '本轮报价利润平衡',
    weight: 20,
    impact: 58,
    description: '当前报价利润率合理，风险可控'
  },
  {
    name: '技术方案契合度',
    weight: 20,
    impact: 85,
    description: '技术方案高度契合客户需求'
  }
])

// 模拟器
const simulatorVisible = ref(false)
const simulator = ref({
  competitorCount: 4,
  competitorStrategy: 'moderate',
  ourBidStrategy: 50
})
const simulationResults = ref(null)

// ==================== 方法定义 ====================

// 选择项目
const selectProject = (project) => {
  currentProject.value = project
  currentRound.value = 1
  initializeProjectData(project)
  calculateInitialPrediction()
}

// 初始化项目数据
const initializeProjectData = (project) => {
  // 设置建议报价区间
  suggestedPriceRange.value = {
    min: project.cost * 1.15,
    max: project.cost * 1.40
  }
  
  // 如果项目有我方报价数据，使用对应轮次的报价；否则使用中间值
  if (project.ourBids && project.ourBids.round1) {
    if (currentRound.value === 1) {
      currentBid.value = project.ourBids.round1
    } else if (currentRound.value === 2 && project.ourBids.round2) {
      currentBid.value = project.ourBids.round2
    } else if (currentRound.value === 3 && project.ourBids.round3) {
      currentBid.value = project.ourBids.round3
    } else {
      currentBid.value = (suggestedPriceRange.value.min + suggestedPriceRange.value.max) / 2
    }
  } else {
    currentBid.value = (suggestedPriceRange.value.min + suggestedPriceRange.value.max) / 2
  }
  
  // 使用项目中的竞对数据或生成默认竞对报价
  updateCompetitorBidsFromProject(project)
}

// 生成竞对报价
const generateCompetitorBids = (project) => {
  const strategies = ['保守', '激进', '保守', '中等']
  const competitors = [
    { id: 1, name: '竞对A', strategy: strategies[0] },
    { id: 2, name: '竞对B', strategy: strategies[1] },
    { id: 3, name: '竞对C', strategy: strategies[2] },
    { id: 4, name: '竞对D', strategy: strategies[3] }
  ]
  
  competitorBids.value = competitors.map(comp => {
    let multiplier
    if (comp.strategy === '激进') {
      multiplier = 1.10 + Math.random() * 0.15
    } else if (comp.strategy === '保守') {
      multiplier = 1.30 + Math.random() * 0.15
    } else {
      multiplier = 1.20 + Math.random() * 0.15
    }
    
    return {
      ...comp,
      predictedBid: Math.round(project.cost * multiplier)
    }
  })
  
  // 计算上轮竞对平均报价
  lastRoundCompetitorAvg.value = Math.round(
    competitorBids.value.reduce((sum, comp) => sum + comp.predictedBid, 0) / competitorBids.value.length
  )
}

// 计算初始预测
const calculateInitialPrediction = () => {
  // 基于当前报价计算中标概率（简化的AI模型模拟）
  calculateRealtime()
}

// 实时计算（报价变化时）
const calculateRealtime = () => {
  if (!currentProject.value) return
  
  // 简化的概率计算模型（实际应使用XGBoost等）
  const avgCompetitorBid = competitorBids.value.reduce((sum, c) => sum + c.predictedBid, 0) / competitorBids.value.length
  
  let baseProbability
  if (currentBid.value < avgCompetitorBid * 0.95) {
    baseProbability = 85
  } else if (currentBid.value < avgCompetitorBid) {
    baseProbability = 75
  } else if (currentBid.value < avgCompetitorBid * 1.05) {
    baseProbability = 60
  } else if (currentBid.value < avgCompetitorBid * 1.10) {
    baseProbability = 45
  } else {
    baseProbability = 25
  }
  
  // 加入客户关系、技术方案等因素调整
  const relationshipBonus = customerInteraction.value * 2
  const technicalBonus = 10
  
  const oldProbability = winProbability.value
  winProbability.value = Math.min(95, Math.max(5, baseProbability + relationshipBonus + technicalBonus))
  probabilityTrend.value = winProbability.value - oldProbability
}

// 进入下一轮
const nextRound = () => {
  if (currentRound.value >= 3) {
    ElMessage.warning('已是最后一轮')
    return
  }
  
  currentRound.value++
  
  // 根据上一轮结果调整竞对策略（贝叶斯更新模拟）
  competitorBids.value = competitorBids.value.map(comp => {
    const adjustment = (Math.random() - 0.5) * 0.1
    return {
      ...comp,
      predictedBid: Math.round(comp.predictedBid * (1 + adjustment))
    }
  })
  
  calculateRealtime()
  ElMessage.success(`已进入第${currentRound.value}轮，AI已更新预测`)
}

// 提交报价
const submitBid = () => {
  if (!currentProject.value) return
  
  ElMessage.success({
    message: `第${currentRound.value}轮报价已提交！报价: ¥${formatMoney(currentBid.value)}，中标概率: ${winProbability.value.toFixed(1)}%`,
    duration: 3000
  })
  
  // 记录本轮报价
  if (!currentProject.value.rounds) {
    currentProject.value.rounds = []
  }
  
  currentProject.value.rounds.push({
    round: currentRound.value,
    bid: currentBid.value,
    probability: winProbability.value,
    profit: expectedProfit.value
  })
}

// 运行模拟
const runSimulation = () => {
  // 先检查是否选择了项目
  if (!currentProject.value) {
    ElMessage.warning('请先选择投标项目')
    return
  }
  
  // 显示加载提示
  const loading = ElMessage({
    message: '🔄 正在运行蒙特卡洛模拟，请稍候...',
    type: 'info',
    duration: 0
  })
  
  // 使用 setTimeout 让加载提示显示，并让 UI 有反馈
  setTimeout(() => {
    try {
      // 蒙特卡洛模拟（简化版）
      const iterations = 1000
      let totalWinRate = 0
      let totalProfit = 0
      const roundResults = []
      
      for (let round = 1; round <= 3; round++) {
        let roundWins = 0
        let roundProfit = 0
        
        for (let i = 0; i < iterations; i++) {
          // 模拟竞对报价
          const simCompetitors = competitorBids.value.map(comp => {
            const variance = (Math.random() - 0.5) * 0.2
            return comp.predictedBid * (1 + variance)
          })
          
          // 我方报价
          const ourBid = currentBid.value * (simulator.value.ourBidStrategy / 50)
          
          // 判断是否中标
          const minCompBid = Math.min(...simCompetitors)
          if (ourBid <= minCompBid * 1.05) {
            roundWins++
            roundProfit += (ourBid - currentProject.value.cost)
          }
        }
        
        roundResults.push({
          round,
          probability: Math.round((roundWins / iterations) * 100)
        })
        
        totalWinRate += roundWins
        totalProfit += roundProfit
      }
      
      const avgWinRate = Math.round((totalWinRate / (iterations * 3)) * 100)
      const avgProfit = Math.round(totalProfit / (iterations * 3))
      
      let riskLevel, recommendationType, recommendationTitle, recommendationMessage
      
      if (avgWinRate >= 70) {
        riskLevel = '低'
        recommendationType = 'success'
        recommendationTitle = '✅ 推荐提交'
        recommendationMessage = '模拟显示中标概率高，期望利润合理，建议按此策略投标'
      } else if (avgWinRate >= 50) {
        riskLevel = '中'
        recommendationType = 'warning'
        recommendationTitle = '⚠️ 谨慎考虑'
        recommendationMessage = '中标概率中等，建议优化报价或加强客户关系'
      } else {
        riskLevel = '高'
        recommendationType = 'error'
        recommendationTitle = '❌ 不建议投标'
        recommendationMessage = '模拟显示中标概率较低，建议降低报价或重新评估项目'
      }
      
      simulationResults.value = {
        avgWinRate,
        avgProfit,
        riskLevel,
        roundResults,
        recommendation: {
          type: recommendationType,
          title: recommendationTitle,
          message: recommendationMessage
        }
      }
      
      // 关闭加载提示
      loading.close()
      
      // 显示成功消息
      ElMessage.success({
        message: '✅ 模拟完成！共运行1000次蒙特卡洛模拟',
        duration: 3000
      })
      
    } catch (error) {
      loading.close()
      ElMessage.error('模拟运行出错: ' + error.message)
      console.error('Simulation error:', error)
    }
  }, 100)
}


// 返回主页
const goHome = () => {
  router.push('/')
  ElMessage.success('返回主页')
}

// 格式化金额
const formatMoney = (value) => {
  return (value / 10000).toFixed(1) + '万'
}

// 格式化金额（简短版，用于图表）
const formatMoneyShort = (value) => {
  if (value >= 10000) {
    return (value / 10000).toFixed(0) + '万'
  }
  return value.toString()
}

// ==================== 多轮对比图表方法 ====================

// 获取最大报价（用于计算条形宽度）
const getMaxBidValue = () => {
  if (!currentProject.value) return 1000000
  
  let maxBid = currentProject.value.amount || 1000000
  
  // 检查我方报价
  if (currentProject.value.ourBids) {
    maxBid = Math.max(maxBid, 
      currentProject.value.ourBids.round1 || 0,
      currentProject.value.ourBids.round2 || 0,
      currentProject.value.ourBids.round3 || 0
    )
  }
  
  // 检查竞对报价
  if (currentProject.value.competitors) {
    currentProject.value.competitors.forEach(comp => {
      maxBid = Math.max(maxBid,
        comp.round1 || 0,
        comp.round2 || 0,
        comp.round3 || 0
      )
    })
  }
  
  return maxBid * 1.1 // 留10%余量
}

// 获取我方报价条形宽度
const getOurBidBarWidth = (round) => {
  if (!currentProject.value?.ourBids) return '0%'
  
  let bidValue = 0
  if (round === 1) bidValue = currentProject.value.ourBids.round1
  else if (round === 2) bidValue = currentProject.value.ourBids.round2
  else if (round === 3) bidValue = currentProject.value.ourBids.round3
  
  if (!bidValue) return '0%'
  
  const maxBid = getMaxBidValue()
  return ((bidValue / maxBid) * 100) + '%'
}

// 获取竞对报价条形宽度
const getCompBidBarWidth = (bidValue, round) => {
  if (!bidValue) return '0%'
  
  const maxBid = getMaxBidValue()
  return ((bidValue / maxBid) * 100) + '%'
}

// 获取竞对颜色
const getCompetitorColor = (index) => {
  const colors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  ]
  return colors[index % colors.length]
}

// 获取我方趋势图标
const getOurTrendIcon = () => {
  if (!currentProject.value?.ourBids) return 'Minus'
  
  const round1 = currentProject.value.ourBids.round1 || 0
  const round3 = currentProject.value.ourBids.round3 || 0
  
  if (round3 < round1) return 'CaretBottom' // 降价
  if (round3 > round1) return 'CaretTop' // 涨价
  return 'Minus' // 持平
}

// 获取我方趋势颜色
const getOurTrendColor = () => {
  if (!currentProject.value?.ourBids) return '#909399'
  
  const round1 = currentProject.value.ourBids.round1 || 0
  const round3 = currentProject.value.ourBids.round3 || 0
  
  if (round3 < round1) return '#67c23a' // 降价，绿色（有利）
  if (round3 > round1) return '#f56c6c' // 涨价，红色（不利）
  return '#909399' // 持平，灰色
}

// 获取我方趋势百分比
const getOurTrendPercentage = () => {
  if (!currentProject.value?.ourBids) return '-'
  
  const round1 = currentProject.value.ourBids.round1 || 0
  const round3 = currentProject.value.ourBids.round3 || 0
  
  if (!round1 || !round3) return '-'
  
  const percentage = ((round3 - round1) / round1 * 100).toFixed(1)
  return percentage > 0 ? `+${percentage}%` : `${percentage}%`
}

// 获取竞对趋势图标
const getCompTrendIcon = (comp) => {
  const round1 = comp.round1 || 0
  const round3 = comp.round3 || 0
  
  if (round3 < round1) return 'CaretBottom'
  if (round3 > round1) return 'CaretTop'
  return 'Minus'
}

// 获取竞对趋势颜色
const getCompTrendColor = (comp) => {
  const round1 = comp.round1 || 0
  const round3 = comp.round3 || 0
  
  if (round3 < round1) return '#67c23a'
  if (round3 > round1) return '#f56c6c'
  return '#909399'
}

// 获取竞对趋势百分比
const getCompTrendPercentage = (comp) => {
  const round1 = comp.round1 || 0
  const round3 = comp.round3 || 0
  
  if (!round1 || !round3) return '-'
  
  const percentage = ((round3 - round1) / round1 * 100).toFixed(1)
  return percentage > 0 ? `+${percentage}%` : `${percentage}%`
}

// 格式化滑块提示
const formatSliderTooltip = (value) => {
  return '¥' + formatMoney(value)
}

// 获取进度条颜色
const getProgressColor = (percentage) => {
  if (percentage >= 70) return '#67c23a'
  if (percentage >= 50) return '#e6a23c'
  return '#f56c6c'
}

// 获取趋势样式类
const getTrendClass = () => {
  if (probabilityTrend > 0) return 'trend-up'
  if (probabilityTrend < 0) return 'trend-down'
  return 'trend-neutral'
}

// 获取概率样式类
const getProbabilityClass = (prob) => {
  if (prob >= 70) return 'high'
  if (prob >= 50) return 'medium'
  return 'low'
}

// 获取利润率样式类
const getProfitRateClass = (rate) => {
  if (rate >= 20) return 'high'
  if (rate >= 10) return 'medium'
  return 'low'
}

// 获取当前轮次类型
const getCurrentRoundType = () => {
  if (currentRound.value === 1) return 'primary'
  if (currentRound.value === 2) return 'warning'
  return 'danger'
}

// 获取最优报价范围样式
const getOptimalRangeStyle = () => {
  const min = suggestedPriceRange.value.min
  const max = suggestedPriceRange.value.max
  const total = max * 1.2 - min * 0.8
  
  const left = ((min - min * 0.8) / total) * 100
  const width = ((max - min) / total) * 100
  
  return {
    left: `${left}%`,
    width: `${width}%`
  }
}

// 获取当前报价位置样式
const getCurrentBidStyle = () => {
  const min = suggestedPriceRange.value.min * 0.8
  const max = suggestedPriceRange.value.max * 1.2
  const position = ((currentBid.value - min) / (max - min)) * 100
  
  return {
    left: `${Math.min(95, Math.max(0, position))}%`
  }
}

// 获取竞对条形宽度
const getCompetitorBarWidth = (comp) => {
  if (!currentProject.value) return '0%'
  const maxBid = Math.max(...competitorBids.value.map(c => c.predictedBid))
  return ((comp.predictedBid / maxBid) * 100) + '%'
}

// ==================== 项目管理功能 ====================

// 打开项目编辑器
const openProjectEditor = (project) => {
  editingProject.value = {
    ...project,
    ourBids: project.ourBids || { round1: 0, round2: 0, round3: 0 },
    ourScope: project.ourScope || '',
    description: project.description || '',
    competitors: project.competitors ? JSON.parse(JSON.stringify(project.competitors)) : []
  }
  showProjectForm.value = true
}

// 添加竞对
const addCompetitor = () => {
  if (!editingProject.value.competitors) {
    editingProject.value.competitors = []
  }
  editingProject.value.competitors.push({
    companyName: '',
    brandName: '',
    scope: '',
    round1: 0,
    round2: 0,
    round3: 0,
    historicalCase: '',
    historicalAmount: 0
  })
}

// 删除竞对
const removeCompetitor = (index) => {
  editingProject.value.competitors.splice(index, 1)
}

// 保存项目
const saveProject = () => {
  // 验证必填项
  if (!editingProject.value.name) {
    ElMessage.warning('请输入项目名称')
    return
  }
  if (!editingProject.value.amount || editingProject.value.amount <= 0) {
    ElMessage.warning('请输入有效的项目预算')
    return
  }
  if (!editingProject.value.cost || editingProject.value.cost <= 0) {
    ElMessage.warning('请输入有效的我方成本')
    return
  }

  if (editingProject.value.id) {
    // 更新现有项目
    const index = bidProjects.value.findIndex(p => p.id === editingProject.value.id)
    if (index !== -1) {
      bidProjects.value[index] = { ...editingProject.value }
      
      // 如果当前选中的是这个项目，更新当前项目
      if (currentProject.value?.id === editingProject.value.id) {
        currentProject.value = { ...editingProject.value }
        // 根据项目竞对数据更新竞对报价显示
        updateCompetitorBidsFromProject(currentProject.value)
      }
      
      ElMessage.success('✅ 项目信息已更新')
    }
  } else {
    // 新增项目
    const newProject = {
      ...editingProject.value,
      id: Date.now(),
      status: 'active',
      rounds: []
    }
    bidProjects.value.unshift(newProject)
    ElMessage.success('✅ 项目已创建')
  }

  showProjectForm.value = false
}

// 根据项目竞对数据更新竞对报价显示
const updateCompetitorBidsFromProject = (project) => {
  if (!project.competitors || project.competitors.length === 0) {
    // 没有竞对数据时使用默认生成
    generateCompetitorBids(project)
    return
  }

  // 使用项目中录入的竞对数据
  competitorBids.value = project.competitors.map((comp, index) => {
    // 根据当前轮次获取报价
    let predictedBid = 0
    if (currentRound.value === 1) {
      predictedBid = comp.round1 || project.cost * 1.3
    } else if (currentRound.value === 2) {
      predictedBid = comp.round2 || comp.round1 * 0.95 || project.cost * 1.25
    } else {
      predictedBid = comp.round3 || comp.round2 * 0.95 || project.cost * 1.2
    }

    return {
      id: index + 1,
      name: comp.companyName || `竞对${String.fromCharCode(65 + index)}`,
      brand: comp.brandName,
      scope: comp.scope,
      strategy: predictedBid < project.cost * 1.2 ? '激进' : (predictedBid > project.cost * 1.35 ? '保守' : '中等'),
      predictedBid: predictedBid,
      historicalCase: comp.historicalCase,
      historicalAmount: comp.historicalAmount
    }
  })

  // 更新上轮竞对平均报价
  if (competitorBids.value.length > 0) {
    lastRoundCompetitorAvg.value = Math.round(
      competitorBids.value.reduce((sum, comp) => sum + comp.predictedBid, 0) / competitorBids.value.length
    )
  }
}
</script>

<style scoped lang="scss">
.bid-predictor {
  padding: 20px;
  background: #f5f7fa;
  min-height: calc(100vh - 140px);
}

.predictor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 16px 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);

  h2 {
    margin: 0;
    font-size: 24px;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 12px;
  }
}

.predictor-layout {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.sidebar {
  width: 280px;
  flex-shrink: 0;

  .sidebar-section {
    background: white;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);

    h3 {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: #606266;
    }

    .project-item {
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 8px;
      cursor: pointer;
      transition: all 0.3s;
      border: 1px solid #ebeef5;

      &:hover {
        background: #f5f7fa;
        border-color: #409eff;
      }

      &.active {
        background: #ecf5ff;
        border-color: #409eff;
      }

      .project-name {
        font-weight: 500;
        margin-bottom: 6px;
      }

      .project-amount {
        color: #f56c6c;
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 8px;
      }
    }

    .mt-2 {
      margin-top: 16px;
    }
  }
}

.main-display {
  flex: 1;

  .display-content {
    .round-info-card {
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .probability-section {
        margin-bottom: 24px;

        .probability-display {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 12px;

          .probability-value {
            font-size: 48px;
            font-weight: bold;
            color: #409eff;
          }

          .probability-label {
            font-size: 14px;
            color: #909399;
          }

          .probability-trend {
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 4px 12px;
            border-radius: 16px;
            font-weight: 500;

            &.trend-up {
              background: #f0f9ff;
              color: #67c23a;
            }

            &.trend-down {
              background: #fef0f0;
              color: #f56c6c;
            }

            &.trend-neutral {
              background: #f4f4f5;
              color: #909399;
            }
          }
        }
      }

      .price-range-section {
        margin-bottom: 24px;

        h4 {
          margin: 0 0 16px 0;
        }

        .price-range-chart {
          display: flex;
          align-items: center;
          gap: 12px;

          .price-marker {
            flex-shrink: 0;
            text-align: center;

            .label {
              display: block;
              font-size: 12px;
              color: #909399;
              margin-bottom: 4px;
            }

            .value {
              display: block;
              font-size: 14px;
              font-weight: 500;
              color: #303133;
            }
          }

          .price-bar {
            flex: 1;
            height: 40px;
            background: #e4e7ed;
            border-radius: 20px;
            position: relative;

            .optimal-range {
              position: absolute;
              height: 100%;
              background: linear-gradient(90deg, #67c23a, #409eff);
              border-radius: 20px;
              opacity: 0.6;
            }

            .current-bid-marker {
              position: absolute;
              top: 50%;
              transform: translate(-50%, -50%);

              .marker-dot {
                width: 16px;
                height: 16px;
                background: #f56c6c;
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 8px rgba(245, 108, 108, 0.5);
                cursor: pointer;
              }
            }
          }
        }
      }

      .competitor-trends-section {
        margin-bottom: 24px;

        h4 {
          margin: 0 0 16px 0;
        }

        .competitor-chart {
          .competitor-bar {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;

            .comp-name {
              width: 80px;
              font-weight: 500;
            }

            .comp-bar-wrapper {
              flex: 1;
              height: 32px;
              background: #f5f7fa;
              border-radius: 16px;
              position: relative;

              .comp-bar-fill {
                height: 100%;
                background: linear-gradient(90deg, #409eff, #66b1ff);
                border-radius: 16px;
                transition: width 0.3s;
              }

              .comp-price {
                position: absolute;
                right: 12px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 12px;
                font-weight: 500;
                color: #303133;
              }
            }
          }
        }
      }

      // 多轮对比图表样式
      .multi-round-comparison-section {
        margin-bottom: 24px;
        background: linear-gradient(135deg, #667eea10 0%, #764ba210 100%);
        padding: 20px;
        border-radius: 12px;

        h4 {
          margin: 0 0 20px 0;
          font-size: 16px;
          font-weight: 600;
          color: #303133;
        }

        .comparison-chart {
          background: white;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

          .chart-header {
            display: grid;
            grid-template-columns: 150px repeat(3, 1fr) 100px;
            gap: 12px;
            padding: 12px 8px;
            background: #f5f7fa;
            border-radius: 6px;
            margin-bottom: 12px;
            font-weight: 600;
            font-size: 13px;
            color: #606266;
            text-align: center;

            .header-label {
              text-align: left;
              padding-left: 8px;
            }
          }

          .chart-row {
            display: grid;
            grid-template-columns: 150px repeat(3, 1fr) 100px;
            gap: 12px;
            padding: 12px 8px;
            margin-bottom: 8px;
            border-radius: 6px;
            transition: all 0.3s;

            &:hover {
              background: #f5f7fa;
            }

            &.our-row {
              background: #ecf5ff;
              border-left: 3px solid #409eff;

              &:hover {
                background: #d9ecff;
              }
            }

            .row-label {
              display: flex;
              align-items: center;
              padding-left: 8px;

              .comp-info {
                .comp-company {
                  font-size: 13px;
                  font-weight: 500;
                  color: #303133;
                  margin-bottom: 2px;
                }

                .comp-brand {
                  font-size: 11px;
                  color: #909399;
                }
              }
            }

            .row-value {
              display: flex;
              align-items: center;
              position: relative;

              .value-bar {
                height: 28px;
                border-radius: 14px;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding: 0 10px;
                transition: all 0.3s;
                min-width: 60px;

                &.our-bar {
                  background: linear-gradient(90deg, #409eff, #66b1ff);
                }

                &.comp-bar {
                  // 背景通过内联样式设置
                }

                .value-text {
                  font-size: 11px;
                  font-weight: 600;
                  color: white;
                  white-space: nowrap;
                  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                }

                &:hover {
                  transform: scaleY(1.1);
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }
              }
            }

            .row-trend {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;

              .el-icon {
                font-size: 18px;
                font-weight: bold;
              }

              .trend-percentage {
                font-size: 12px;
                font-weight: 600;
              }
            }
          }

          .chart-legend {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 24px;
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px dashed #e4e7ed;

            .legend-item {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 12px;
              color: #606266;

              .legend-color {
                width: 24px;
                height: 12px;
                border-radius: 6px;

                &.our-color {
                  background: linear-gradient(90deg, #409eff, #66b1ff);
                }
              }

              .el-icon {
                font-size: 16px;
              }
            }
          }
        }
      }

      .historical-data-section {
        h4 {
          margin: 0 0 16px 0;
        }

        .data-card {
          text-align: center;
          padding: 16px;
          background: #f5f7fa;
          border-radius: 8px;

          .data-label {
            font-size: 12px;
            color: #909399;
            margin-bottom: 8px;
          }

          .data-value {
            font-size: 20px;
            font-weight: bold;
            color: #303133;
          }
        }
      }
    }
  }

  .empty-state {
    background: white;
    border-radius: 8px;
    padding: 60px 20px;
    text-align: center;
  }
}

.operation-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);

  .price-slider-section {
    margin-bottom: 24px;

    h3 {
      margin: 0 0 16px 0;
    }

    .slider-wrapper {
      margin-bottom: 16px;

      .bid-display {
        text-align: center;
        margin-top: 12px;

        .label {
          color: #909399;
          margin-right: 8px;
        }

        .value {
          font-size: 24px;
          font-weight: bold;
          color: #f56c6c;
        }
      }
    }

    .realtime-results {
      display: flex;
      gap: 32px;
      justify-content: center;
      padding: 16px;
      background: #f5f7fa;
      border-radius: 8px;

      .result-item {
        .label {
          color: #606266;
          margin-right: 8px;
        }

        .value {
          font-size: 20px;
          font-weight: bold;

          &.high {
            color: #67c23a;
          }

          &.medium {
            color: #e6a23c;
          }

          &.low {
            color: #f56c6c;
          }

          &.profit {
            color: #409eff;
          }
        }
      }
    }
  }

  .submit-section {
    display: flex;
    gap: 24px;
    align-items: center;
    margin-bottom: 24px;

    .risk-alerts {
      flex: 1;
    }
  }

  .ai-explanation-section {
    h3 {
      margin: 0 0 16px 0;
    }

    .influence-factors {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;

      .factor-item {
        padding: 16px;
        background: #f5f7fa;
        border-radius: 8px;

        .factor-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;

          .factor-name {
            font-weight: 500;
          }

          .factor-weight {
            color: #909399;
            font-size: 12px;
          }
        }

        .factor-description {
          margin-top: 8px;
          font-size: 12px;
          color: #606266;
        }
      }
    }
  }
}

.simulator-content {
  .simulation-results {
    h3 {
      margin: 0 0 16px 0;
    }

    .simulation-chart {
      margin: 24px 0;

      h4 {
        margin: 0 0 16px 0;
      }

      .chart-bars {
        display: flex;
        gap: 24px;
        justify-content: space-around;

        .chart-bar {
          flex: 1;
          text-align: center;

          .bar-label {
            margin-bottom: 8px;
            font-weight: 500;
          }

          .bar-wrapper {
            height: 200px;
            display: flex;
            align-items: flex-end;
            justify-content: center;

            .bar-fill {
              width: 60px;
              background: linear-gradient(180deg, #409eff, #66b1ff);
              border-radius: 8px 8px 0 0;
              position: relative;
              min-height: 20px;

              .bar-value {
                position: absolute;
                top: -24px;
                left: 50%;
                transform: translateX(-50%);
                font-weight: bold;
                color: #303133;
              }
            }
          }
        }
      }
    }
  }
}

// 项目编辑对话框样式
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  
  h3 {
    margin: 0;
    font-size: 14px;
    color: #606266;
  }
}

.project-item {
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid #ebeef5;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #f5f7fa;
    border-color: #409eff;
  }

  &.active {
    background: #ecf5ff;
    border-color: #409eff;
  }

  .project-name {
    font-weight: 500;
    margin-bottom: 6px;
  }

  .project-amount {
    color: #f56c6c;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  .project-actions {
    margin-left: auto;
  }
}

.competitor-card {
  margin-bottom: 16px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.empty-competitors {
  padding: 40px 0;
  text-align: center;
}
</style>

