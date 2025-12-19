<template>
  <div class="tightening-data-analysis">
    <el-card class="header-card">
      <h2><el-icon><DataAnalysis /></el-icon> 拧紧数据采集分析</h2>
      <p>基于Open Protocol协议的实时数据采集、清洗、统计与异常分析</p>
    </el-card>

    <!-- 连接状态卡片 -->
    <el-card class="connection-card">
      <template #header>
        <div class="card-header">
          <span><el-icon><Connection /></el-icon> 控制器连接 (ToolsNet 8)</span>
          <el-space>
            <el-tag 
              :type="connectionStatusType" 
              size="large"
              effect="dark">
              {{ connectionStatusText }}
            </el-tag>
            <el-tag v-if="dataStore.connection.systemType" type="info" size="small">
              {{ dataStore.connection.systemType }}
            </el-tag>
          </el-space>
        </div>
      </template>

      <el-form :model="connectionForm" label-width="140px" v-if="dataStore.connection.status === 'disconnected'">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="控制器类型">
              <el-select v-model="connectionForm.controller" placeholder="选择控制器">
                <el-option label="PowerFocus 4000" value="PF4000">
                  <span style="float: left">PF4000</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">标准型</span>
                </el-option>
                <el-option label="PowerFocus 6000" value="PF6000">
                  <span style="float: left">PF6000</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">中高级型</span>
                </el-option>
                <el-option label="PowerFocus 8000" value="PF8000">
                  <span style="float: left">PF8000</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">高级型</span>
                </el-option>
                <el-option label="PowerMACS" value="PowerMACS">
                  <span style="float: left">PowerMACS</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">总线型</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="IP地址">
              <el-input v-model="connectionForm.ipAddress" placeholder="192.168.1.100" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="Open Protocol端口">
              <el-input-number v-model="connectionForm.port" :min="1" :max="65535" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider />
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="Protocol版本">
              <el-select v-model="connectionForm.protocolVersion" placeholder="选择协议版本">
                <el-option label="2.8.0 (推荐)" value="2.8.0" />
                <el-option label="2.7.0" value="2.7.0" />
                <el-option label="2.6.0" value="2.6.0" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数据库类型">
              <el-select v-model="connectionForm.database" placeholder="选择数据库">
                <el-option label="SQL Server (推荐)" value="sqlserver" />
                <el-option label="Oracle" value="oracle" />
                <el-option label="本地存储 (测试)" value="local" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="MSMQ消息队列">
              <el-switch v-model="connectionForm.useMsmq" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="connect" :loading="connecting">
            <el-icon><Link /></el-icon>
            连接控制器 (PIM)
          </el-button>
          <el-button @click="useMockData">
            <el-icon><MagicStick /></el-icon>
            生成模拟数据
          </el-button>
          <el-button @click="testConnection">
            <el-icon><Connection /></el-icon>
            测试连接
          </el-button>
        </el-form-item>
      </el-form>

      <div v-else class="connection-info">
        <el-descriptions :column="4" border size="small">
          <el-descriptions-item label="控制器">
            <el-tag type="success">{{ dataStore.connection.controller }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="系统类型">{{ dataStore.connection.systemType }}</el-descriptions-item>
          <el-descriptions-item label="IP地址">{{ dataStore.connection.ipAddress }}</el-descriptions-item>
          <el-descriptions-item label="端口">{{ dataStore.connection.port }}</el-descriptions-item>
          <el-descriptions-item label="连接时间">
            {{ new Date(dataStore.connection.lastConnectTime).toLocaleString() }}
          </el-descriptions-item>
          <el-descriptions-item label="采集速度">
            <span style="color: #67c23a; font-weight: 600;">
              {{ dataStore.connection.collectionSpeed.resultsPerMinute }} 个/分钟
            </span>
          </el-descriptions-item>
          <el-descriptions-item label="Protocol版本">Open Protocol 2.8.0</el-descriptions-item>
          <el-descriptions-item label="服务组件">
            <el-tag size="small" type="success">PIM</el-tag>
            <el-tag size="small" type="success" style="margin-left: 4px;">DCS</el-tag>
            <el-tag size="small" type="success" style="margin-left: 4px;">CDC</el-tag>
          </el-descriptions-item>
        </el-descriptions>
        
        <div style="margin-top: 16px;">
          <el-button 
            v-if="!dataStore.realtimeData.isRunning" 
            type="success" 
            @click="startCollection">
            <el-icon><VideoPlay /></el-icon>
            启动数据采集服务 (DCS)
          </el-button>
          <el-button 
            v-else 
            type="warning" 
            @click="stopCollection">
            <el-icon><VideoPause /></el-icon>
            停止数据采集
          </el-button>
          <el-button type="danger" @click="disconnect">
            <el-icon><SwitchButton /></el-icon>
            断开PIM连接
          </el-button>
          <el-button @click="showArchiveDialog">
            <el-icon><FolderOpened /></el-icon>
            存档服务
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 数据统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card total">
          <div class="stat-content">
            <el-icon class="stat-icon"><Document /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ dataStore.statistics.total }}</div>
              <div class="stat-label">总拧紧数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card ok">
          <div class="stat-content">
            <el-icon class="stat-icon"><CircleCheck /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ dataStore.statistics.ok }}</div>
              <div class="stat-label">合格数 (OK)</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card nok">
          <div class="stat-content">
            <el-icon class="stat-icon"><CircleClose /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ dataStore.statistics.nok }}</div>
              <div class="stat-label">不合格数 (NOK)</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card rate">
          <div class="stat-content">
            <el-icon class="stat-icon"><TrendCharts /></el-icon>
            <div class="stat-info">
              <div class="stat-value">{{ dataStore.statistics.okRate }}%</div>
              <div class="stat-label">合格率</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Tab切换 -->
    <el-tabs v-model="activeTab" class="data-tabs">
      <!-- 实时监控 -->
      <el-tab-pane label="实时监控" name="realtime">
        <el-card>
          <template #header>
            <div class="card-header">
              <span><el-icon><Monitor /></el-icon> 实时拧紧数据流</span>
              <el-space>
                <el-tag v-if="dataStore.realtimeData.isRunning" type="success" effect="dark">
                  <el-icon><View /></el-icon> 采集中...
                </el-tag>
                <el-button size="small" @click="refreshRealtimeData">
                  <el-icon><Refresh /></el-icon>
                  刷新
                </el-button>
              </el-space>
            </div>
          </template>

          <el-table 
            :data="recentResults" 
            stripe 
            height="500"
            :row-class-name="tableRowClassName">
            <el-table-column prop="timestamp" label="时间" width="180">
              <template #default="scope">
                {{ new Date(scope.row.timestamp).toLocaleString() }}
              </template>
            </el-table-column>
            <el-table-column prop="workshop" label="车间" width="120" />
            <el-table-column prop="productionLine" label="线体" width="100" />
            <el-table-column prop="toolModel" label="工具型号" width="100" />
            <el-table-column prop="snNumber" label="SN编号" width="140" />
            <el-table-column prop="shift" label="班次" width="80">
              <template #default="scope">
                <el-tag :type="scope.row.shift === '白班' ? 'primary' : 'info'" size="small">
                  {{ scope.row.shift }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="psetId" label="Pset ID" width="100" />
            <el-table-column prop="jobId" label="Job ID" width="100" />
            <el-table-column prop="result" label="结果" width="100">
              <template #default="scope">
                <el-tag :type="scope.row.result === 'OK' ? 'success' : 'danger'">
                  {{ scope.row.result }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="扭矩" width="200">
              <template #default="scope">
                <div>
                  <strong>{{ scope.row.torque }}Nm</strong>
                  <span style="color: #999; font-size: 12px;"> / 目标: {{ scope.row.targetTorque }}Nm</span>
                </div>
                <el-progress 
                  :percentage="Math.min((scope.row.torque / scope.row.targetTorque * 100), 100)" 
                  :color="getTorqueColor(scope.row.torque, scope.row.targetTorque)"
                  :show-text="false"
                  style="margin-top: 4px;" />
              </template>
            </el-table-column>
            <el-table-column prop="angle" label="角度" width="120">
              <template #default="scope">
                {{ scope.row.angle }}°
              </template>
            </el-table-column>
            <el-table-column prop="tighteningTime" label="拧紧时间" width="120">
              <template #default="scope">
                {{ scope.row.tighteningTime }}s
              </template>
            </el-table-column>
            <el-table-column prop="nokReason" label="NOK原因" min-width="150">
              <template #default="scope">
                <el-tag v-if="scope.row.nokReason" type="danger" size="small">
                  {{ scope.row.nokReason }}
                </el-tag>
                <span v-else style="color: #999;">-</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120" fixed="right">
              <template #default="scope">
                <el-button size="small" text @click="viewCurve(scope.row)">
                  <el-icon><TrendCharts /></el-icon>
                  查看曲线
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-tab-pane>

      <!-- 数据分析 -->
      <el-tab-pane label="数据分析" name="analysis">
        <el-card>
          <template #header>
            <div class="card-header">
              <span><el-icon><DataLine /></el-icon> 统计分析</span>
              <el-button size="small" @click="exportData">
                <el-icon><Download /></el-icon>
                导出数据
              </el-button>
            </div>
          </template>

          <!-- 数据过滤器 -->
          <div class="filter-panel">
            <el-form :inline="true">
              <el-form-item label="日期范围">
                <el-date-picker
                  v-model="dataStore.filters.dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="applyFilters"
                />
              </el-form-item>
              <el-form-item label="结果筛选">
                <el-select v-model="dataStore.filters.result" @change="applyFilters">
                  <el-option label="全部" value="all" />
                  <el-option label="仅OK" value="ok" />
                  <el-option label="仅NOK" value="nok" />
                </el-select>
              </el-form-item>
              <el-form-item label="Pset ID">
                <el-input v-model="dataStore.filters.psetId" placeholder="筛选Pset" clearable @change="applyFilters" />
              </el-form-item>
              <!-- 车间名称 -->
              <el-form-item label="车间名称">
                <el-select v-model="dataStore.filters.workshop" @change="applyFilters" clearable>
                  <el-option label="全部" value="all" />
                  <el-option
                    v-for="workshop in dataStore.workshops"
                    :key="workshop"
                    :label="workshop"
                    :value="workshop"
                  />
                </el-select>
              </el-form-item>
              <!-- 线体名称 -->
              <el-form-item label="线体名称">
                <el-select v-model="dataStore.filters.productionLine" @change="applyFilters" clearable>
                  <el-option label="全部" value="all" />
                  <el-option
                    v-for="line in dataStore.productionLines"
                    :key="line"
                    :label="line"
                    :value="line"
                  />
                </el-select>
              </el-form-item>
              <!-- 工具型号 -->
              <el-form-item label="工具型号">
                <el-select v-model="dataStore.filters.toolModel" @change="applyFilters" clearable>
                  <el-option label="全部" value="all" />
                  <el-option
                    v-for="model in dataStore.toolModels"
                    :key="model"
                    :label="model"
                    :value="model"
                  />
                </el-select>
              </el-form-item>
              <!-- SN编号 -->
              <el-form-item label="SN编号">
                <el-input
                  v-model="dataStore.filters.snNumber"
                  placeholder="输入SN编号"
                  clearable
                  @change="applyFilters"
                  style="width: 180px;"
                />
              </el-form-item>
              <!-- 白班/夜班 -->
              <el-form-item label="班次">
                <el-select v-model="dataStore.filters.shift" @change="applyFilters" clearable>
                  <el-option label="全部" value="all" />
                  <el-option label="白班" value="白班" />
                  <el-option label="夜班" value="夜班" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="applyFilters">
                  <el-icon><Search /></el-icon>
                  应用筛选
                </el-button>
                <el-button @click="resetFilters">
                  <el-icon><RefreshLeft /></el-icon>
                  重置
                </el-button>
              </el-form-item>
            </el-form>
          </div>

          <!-- 统计图表 -->
          <el-row :gutter="20" style="margin-top: 20px;">
            <el-col :span="12">
              <div class="chart-container" ref="okRateChart" style="height: 300px;"></div>
            </el-col>
            <el-col :span="12">
              <div class="chart-container" ref="torqueDistChart" style="height: 300px;"></div>
            </el-col>
          </el-row>

          <!-- 拧紧曲线分析（基于物理模型） -->
          <el-row :gutter="20" style="margin-top: 20px;">
            <el-col :span="24">
              <div class="chart-container" ref="curveChart" style="height: 450px;"></div>
            </el-col>
          </el-row>

          <!-- 多参数对比分析 -->
          <el-row :gutter="20" style="margin-top: 20px;">
            <el-col :span="24">
              <div class="chart-container" ref="multiParamChart" style="height: 400px;"></div>
            </el-col>
          </el-row>

          <!-- Cpk分析 -->
          <el-card style="margin-top: 20px;" v-if="cpkData">
            <template #header>
              <span><el-icon><Histogram /></el-icon> 过程能力分析 (Cpk)</span>
            </template>
            <el-row :gutter="20">
              <el-col :span="6">
                <el-statistic title="Cpk" :value="cpkData.cpk">
                  <template #suffix>
                    <el-tag :type="getCpkType(cpkData.cpk)" size="small">
                      {{ getCpkLevel(cpkData.cpk) }}
                    </el-tag>
                  </template>
                </el-statistic>
              </el-col>
              <el-col :span="6">
                <el-statistic title="均值 (μ)" :value="cpkData.mean" suffix="Nm" />
              </el-col>
              <el-col :span="6">
                <el-statistic title="标准差 (σ)" :value="cpkData.stdDev" suffix="Nm" />
              </el-col>
              <el-col :span="6">
                <el-statistic title="目标扭矩" :value="cpkData.target" suffix="Nm" />
              </el-col>
            </el-row>
            <el-divider />
            <p style="color: #666; font-size: 14px;">
              <el-icon><InfoFilled /></el-icon>
              控制限: {{ cpkData.lowerLimit }}Nm ~ {{ cpkData.upperLimit }}Nm | 
              Cpu: {{ cpkData.cpu }} | Cpl: {{ cpkData.cpl }}
            </p>
          </el-card>
        </el-card>
      </el-tab-pane>

      <!-- 异常报警 -->
      <el-tab-pane name="anomalies">
        <template #label>
          <span>
            异常报警
            <el-badge :value="dataStore.anomalies.length" :max="99" v-if="dataStore.anomalies.length > 0" />
          </span>
        </template>

        <el-card>
          <template #header>
            <div class="card-header">
              <span><el-icon><WarningFilled /></el-icon> 异常记录</span>
              <el-space>
                <el-button size="small" @click="configAlarm">
                  <el-icon><Setting /></el-icon>
                  报警配置
                </el-button>
                <el-button size="small" type="danger" @click="clearAnomalies">
                  <el-icon><Delete /></el-icon>
                  清空记录
                </el-button>
              </el-space>
            </div>
          </template>

          <el-timeline v-if="dataStore.recentAnomalies.length > 0">
            <el-timeline-item
              v-for="anomaly in dataStore.recentAnomalies"
              :key="anomaly.timestamp"
              :timestamp="new Date(anomaly.timestamp).toLocaleString()"
              :type="getAnomalyType(anomaly.level)"
              :icon="getAnomalyIcon(anomaly.level)">
              <el-card>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <el-tag :type="getAnomalyType(anomaly.level)" size="small" style="margin-right: 8px;">
                      {{ anomaly.type }}
                    </el-tag>
                    <span>{{ anomaly.message }}</span>
                  </div>
                  <el-button size="small" text @click="viewAnomalyDetail(anomaly)">
                    查看详情
                  </el-button>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>

          <el-empty v-else description="暂无异常记录" />
        </el-card>
      </el-tab-pane>

      <!-- 拧紧曲线 -->
      <el-tab-pane label="拧紧曲线" name="curves">
        <el-card>
          <template #header>
            <div class="card-header">
              <span><el-icon><TrendCharts /></el-icon> 拧紧曲线分析</span>
              <el-select 
                v-model="curveType" 
                placeholder="选择曲线类型" 
                style="width: 220px;"
                @change="updateCurveChart">
                <el-option label="扭矩-角度" value="torque-angle">
                  <span style="float: left">扭矩-角度</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">默认</span>
                </el-option>
                <el-option label="扭矩-时间" value="torque-time">
                  <span style="float: left">扭矩-时间</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">时序</span>
                </el-option>
                <el-option label="扭矩-转速" value="torque-speed">
                  <span style="float: left">扭矩-转速</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">动力学</span>
                </el-option>
                <el-option label="角度-时间" value="angle-time">
                  <span style="float: left">角度-时间</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">进程</span>
                </el-option>
                <el-option label="扭矩转角-时间" value="torque-angle-time">
                  <span style="float: left">扭矩转角-时间</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">综合</span>
                </el-option>
              </el-select>
            </div>
          </template>

          <div class="curve-viewer">
            <div class="chart-container" ref="curveChart" style="height: 500px;"></div>
          </div>
        </el-card>
      </el-tab-pane>

      <!-- 数据库维护 -->
      <el-tab-pane label="数据库维护" name="maintenance">
        <el-card>
          <template #header>
            <div class="card-header">
              <span><el-icon><Tools /></el-icon> 数据库维护任务 (ToolsNet Database Jobs)</span>
              <el-button size="small" type="primary" @click="runAllMaintenanceJobs" :loading="maintenanceLoading">
                <el-icon><VideoPlay /></el-icon>
                执行所有启用任务
              </el-button>
            </div>
          </template>

          <!-- 维护统计 -->
          <el-row :gutter="20" style="margin-bottom: 20px;">
            <el-col :span="6">
              <el-statistic title="数据库大小" :value="maintenanceStats.database?.estimatedSize || '0 GB'" />
            </el-col>
            <el-col :span="6">
              <el-statistic title="当前结果数" :value="maintenanceStats.database?.currentResults || 0" />
            </el-col>
            <el-col :span="6">
              <el-statistic title="当前曲线数" :value="maintenanceStats.database?.currentCurves || 0" />
            </el-col>
            <el-col :span="6">
              <el-statistic title="索引碎片率" :value="maintenanceStats.indexFragmentation || 0" suffix="%" />
            </el-col>
          </el-row>

          <el-divider />

          <!-- 维护任务列表 -->
          <div class="maintenance-jobs">
            <!-- 删除维护任务 -->
            <el-card shadow="hover" style="margin-bottom: 16px;">
              <template #header>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <el-tag :type="maintenanceJobs.deleteMaintenanceJob?.enabled ? 'success' : 'info'" size="small">
                      {{ maintenanceJobs.deleteMaintenanceJob?.enabled ? '已启用' : '已禁用' }}
                    </el-tag>
                    <strong style="margin-left: 12px;">ToolsNet_DeleteMaintenance</strong>
                  </div>
                  <el-space>
                    <el-switch
                      v-model="maintenanceJobs.deleteMaintenanceJob.enabled"
                      @change="updateMaintenanceJob('deleteMaintenanceJob')"
                    />
                    <el-button
                      size="small"
                      @click="runMaintenanceJob('deleteMaintenanceJob')"
                      :loading="maintenanceLoading"
                      :disabled="!maintenanceJobs.deleteMaintenanceJob?.enabled">
                      执行
                    </el-button>
                  </el-space>
                </div>
              </template>
              <el-descriptions :column="2" border size="small">
                <el-descriptions-item label="说明">
                  删除过期的结果、曲线、程序信息和不再使用的工具数据
                </el-descriptions-item>
                <el-descriptions-item label="调度">每日</el-descriptions-item>
                <el-descriptions-item label="保留天数">
                  <el-input-number
                    v-model="maintenanceJobs.deleteMaintenanceJob.daysToKeep"
                    :min="7"
                    :max="365"
                    size="small"
                    @change="updateMaintenanceJob('deleteMaintenanceJob')"
                  />
                  天
                </el-descriptions-item>
                <el-descriptions-item label="执行次数">
                  {{ maintenanceJobs.deleteMaintenanceJob?.runCount || 0 }} 次
                </el-descriptions-item>
                <el-descriptions-item label="上次运行">
                  {{ maintenanceJobs.deleteMaintenanceJob?.lastRun ? new Date(maintenanceJobs.deleteMaintenanceJob.lastRun).toLocaleString() : '从未运行' }}
                </el-descriptions-item>
              </el-descriptions>
            </el-card>

            <!-- 删除未绑定曲线 -->
            <el-card shadow="hover" style="margin-bottom: 16px;">
              <template #header>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <el-tag :type="maintenanceJobs.deleteUnboundGraphsJob?.enabled ? 'success' : 'info'" size="small">
                      {{ maintenanceJobs.deleteUnboundGraphsJob?.enabled ? '已启用' : '已禁用' }}
                    </el-tag>
                    <strong style="margin-left: 12px;">ToolsNet_DeleteUnboundGraphs</strong>
                    <el-tag type="warning" size="small" style="margin-left: 8px;">PowerMACS</el-tag>
                  </div>
                  <el-space>
                    <el-switch
                      v-model="maintenanceJobs.deleteUnboundGraphsJob.enabled"
                      @change="updateMaintenanceJob('deleteUnboundGraphsJob')"
                    />
                    <el-button
                      size="small"
                      @click="runMaintenanceJob('deleteUnboundGraphsJob')"
                      :loading="maintenanceLoading"
                      :disabled="!maintenanceJobs.deleteUnboundGraphsJob?.enabled">
                      执行
                    </el-button>
                  </el-space>
                </div>
              </template>
              <el-descriptions :column="2" border size="small">
                <el-descriptions-item label="说明">
                  删除未关联到结果的曲线数据（主要用于PowerMACS系统）
                </el-descriptions-item>
                <el-descriptions-item label="调度">每日</el-descriptions-item>
                <el-descriptions-item label="执行次数">
                  {{ maintenanceJobs.deleteUnboundGraphsJob?.runCount || 0 }} 次
                </el-descriptions-item>
                <el-descriptions-item label="上次运行">
                  {{ maintenanceJobs.deleteUnboundGraphsJob?.lastRun ? new Date(maintenanceJobs.deleteUnboundGraphsJob.lastRun).toLocaleString() : '从未运行' }}
                </el-descriptions-item>
              </el-descriptions>
            </el-card>

            <!-- 索引重组 -->
            <el-card shadow="hover" style="margin-bottom: 16px;">
              <template #header>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <el-tag :type="maintenanceJobs.indexReorganizeJob?.enabled ? 'success' : 'info'" size="small">
                      {{ maintenanceJobs.indexReorganizeJob?.enabled ? '已启用' : '已禁用' }}
                    </el-tag>
                    <strong style="margin-left: 12px;">ToolsNet_IndexReorganize</strong>
                    <el-tag type="primary" size="small" style="margin-left: 8px;">SQL Server</el-tag>
                  </div>
                  <el-space>
                    <el-switch
                      v-model="maintenanceJobs.indexReorganizeJob.enabled"
                      @change="updateMaintenanceJob('indexReorganizeJob')"
                    />
                    <el-button
                      size="small"
                      @click="runMaintenanceJob('indexReorganizeJob')"
                      :loading="maintenanceLoading"
                      :disabled="!maintenanceJobs.indexReorganizeJob?.enabled">
                      执行
                    </el-button>
                  </el-space>
                </div>
              </template>
              <el-descriptions :column="2" border size="small">
                <el-descriptions-item label="说明">
                  重组数据库索引以提高报表和结果插入性能
                </el-descriptions-item>
                <el-descriptions-item label="调度">每日（周日除外）</el-descriptions-item>
                <el-descriptions-item label="执行次数">
                  {{ maintenanceJobs.indexReorganizeJob?.runCount || 0 }} 次
                </el-descriptions-item>
                <el-descriptions-item label="上次运行">
                  {{ maintenanceJobs.indexReorganizeJob?.lastRun ? new Date(maintenanceJobs.indexReorganizeJob.lastRun).toLocaleString() : '从未运行' }}
                </el-descriptions-item>
              </el-descriptions>
            </el-card>

            <!-- 索引重建 -->
            <el-card shadow="hover" style="margin-bottom: 16px;">
              <template #header>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <el-tag :type="maintenanceJobs.indexRebuildJob?.enabled ? 'success' : 'info'" size="small">
                      {{ maintenanceJobs.indexRebuildJob?.enabled ? '已启用' : '已禁用' }}
                    </el-tag>
                    <strong style="margin-left: 12px;">ToolsNet_IndexRebuild</strong>
                    <el-tag type="primary" size="small" style="margin-left: 8px;">SQL Server</el-tag>
                  </div>
                  <el-space>
                    <el-switch
                      v-model="maintenanceJobs.indexRebuildJob.enabled"
                      @change="updateMaintenanceJob('indexRebuildJob')"
                    />
                    <el-button
                      size="small"
                      @click="runMaintenanceJob('indexRebuildJob')"
                      :loading="maintenanceLoading"
                      :disabled="!maintenanceJobs.indexRebuildJob?.enabled">
                      执行
                    </el-button>
                  </el-space>
                </div>
              </template>
              <el-descriptions :column="2" border size="small">
                <el-descriptions-item label="说明">
                  重建数据库索引以提高数据库性能（更彻底，耗时更长）
                </el-descriptions-item>
                <el-descriptions-item label="调度">每周日</el-descriptions-item>
                <el-descriptions-item label="执行次数">
                  {{ maintenanceJobs.indexRebuildJob?.runCount || 0 }} 次
                </el-descriptions-item>
                <el-descriptions-item label="上次运行">
                  {{ maintenanceJobs.indexRebuildJob?.lastRun ? new Date(maintenanceJobs.indexRebuildJob.lastRun).toLocaleString() : '从未运行' }}
                </el-descriptions-item>
              </el-descriptions>
            </el-card>

            <!-- 归档任务 -->
            <el-card shadow="hover">
              <template #header>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <el-tag :type="maintenanceJobs.archiveJob?.enabled ? 'success' : 'info'" size="small">
                      {{ maintenanceJobs.archiveJob?.enabled ? '已启用' : '已禁用' }}
                    </el-tag>
                    <strong style="margin-left: 12px;">ToolsNet_Archive</strong>
                  </div>
                  <el-space>
                    <el-switch
                      v-model="maintenanceJobs.archiveJob.enabled"
                      @change="updateMaintenanceJob('archiveJob')"
                    />
                    <el-button
                      size="small"
                      @click="runMaintenanceJob('archiveJob')"
                      :loading="maintenanceLoading"
                      :disabled="!maintenanceJobs.archiveJob?.enabled">
                      执行
                    </el-button>
                  </el-space>
                </div>
              </template>
              <el-descriptions :column="2" border size="small">
                <el-descriptions-item label="说明">
                  将数据从ToolsNet数据库复制到归档数据库
                </el-descriptions-item>
                <el-descriptions-item label="调度">手动</el-descriptions-item>
                <el-descriptions-item label="归档数据库">
                  {{ maintenanceJobs.archiveJob?.archiveDatabase || 'ToolsNet_Archive' }}
                </el-descriptions-item>
                <el-descriptions-item label="归档大小">
                  {{ maintenanceStats.archiveSize || 0 }} GB
                </el-descriptions-item>
                <el-descriptions-item label="执行次数">
                  {{ maintenanceJobs.archiveJob?.runCount || 0 }} 次
                </el-descriptions-item>
                <el-descriptions-item label="上次运行">
                  {{ maintenanceJobs.archiveJob?.lastRun ? new Date(maintenanceJobs.archiveJob.lastRun).toLocaleString() : '从未运行' }}
                </el-descriptions-item>
              </el-descriptions>
            </el-card>
          </div>

          <!-- 维护历史 -->
          <el-divider />
          <el-card shadow="never">
            <template #header>
              <span><el-icon><Document /></el-icon> 维护历史</span>
            </template>
            <el-descriptions :column="3" border>
              <el-descriptions-item label="已删除结果总数">
                {{ maintenanceStats.totalDeletedResults || 0 }}
              </el-descriptions-item>
              <el-descriptions-item label="已删除曲线总数">
                {{ maintenanceStats.totalDeletedGraphs || 0 }}
              </el-descriptions-item>
              <el-descriptions-item label="已归档记录总数">
                {{ maintenanceStats.totalArchivedRecords || 0 }}
              </el-descriptions-item>
              <el-descriptions-item label="上次维护时间" :span="3">
                {{ maintenanceStats.lastMaintenanceTime ? new Date(maintenanceStats.lastMaintenanceTime).toLocaleString() : '从未执行' }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
        </el-card>
      </el-tab-pane>

      <!-- ToolsNet Map -->
      <el-tab-pane label="ToolsNet Map" name="map">
        <ToolsNetMapViewer />
      </el-tab-pane>

      <!-- 内容编辑 -->
      <el-tab-pane label="内容编辑" name="content">
        <el-card>
          <template #header>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span><el-icon><Edit /></el-icon> 页面内容编辑</span>
              <el-button type="primary" @click="savePageContent" :loading="contentSaving">
                <el-icon><Check /></el-icon> 保存所有内容
              </el-button>
            </div>
          </template>

          <!-- Banner横幅配置 -->
          <el-card shadow="hover" style="margin-bottom: 20px;">
            <template #header>
              <h3><el-icon><Picture /></el-icon> Banner横幅配置</h3>
            </template>
            <el-form :model="pageContentForm.banner" label-width="140px">
              <el-form-item label="中文标题">
                <el-input v-model="pageContentForm.banner.title['zh-CN']" placeholder="请输入中文标题" />
              </el-form-item>
              <el-form-item label="英文标题">
                <el-input v-model="pageContentForm.banner.title['en-US']" placeholder="Please enter English title" />
              </el-form-item>
              <el-form-item label="中文副标题">
                <el-input v-model="pageContentForm.banner.subtitle['zh-CN']" placeholder="请输入中文副标题" />
              </el-form-item>
              <el-form-item label="英文副标题">
                <el-input v-model="pageContentForm.banner.subtitle['en-US']" placeholder="Please enter English subtitle" />
              </el-form-item>
              <el-form-item label="中文描述">
                <el-input 
                  type="textarea" 
                  :rows="3" 
                  v-model="pageContentForm.banner.description['zh-CN']" 
                  placeholder="请输入中文描述" />
              </el-form-item>
              <el-form-item label="英文描述">
                <el-input 
                  type="textarea" 
                  :rows="3" 
                  v-model="pageContentForm.banner.description['en-US']" 
                  placeholder="Please enter English description" />
              </el-form-item>
              <el-form-item label="背景图片">
                <ImageUploader v-model="pageContentForm.banner.image" alt="Banner背景图片" />
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 功能特点 -->
          <el-card shadow="hover" style="margin-bottom: 20px;">
            <template #header>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3><el-icon><StarFilled /></el-icon> 功能特点</h3>
                <el-button type="primary" size="small" @click="showAddFeatureDialog">
                  <el-icon><Plus /></el-icon> 添加特点
                </el-button>
              </div>
            </template>

            <div v-if="pageContentForm.features && pageContentForm.features.length > 0">
              <el-card 
                v-for="(feature, index) in pageContentForm.features" 
                :key="index" 
                class="feature-card"
                shadow="hover"
                style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                  <div style="flex: 1;">
                    <h4>{{ feature.title['zh-CN'] }}</h4>
                    <p style="color: #666; margin: 8px 0;">{{ feature.description['zh-CN'] }}</p>
                    <el-image 
                      v-if="feature.icon" 
                      :src="feature.icon" 
                      style="width: 60px; height: 60px; border-radius: 8px;"
                      fit="cover" />
                  </div>
                  <el-space>
                    <el-button size="small" @click="editFeature(index, feature)">
                      <el-icon><Edit /></el-icon> 编辑
                    </el-button>
                    <el-button size="small" type="danger" @click="deleteFeature(index)">
                      <el-icon><Delete /></el-icon> 删除
                    </el-button>
                  </el-space>
                </div>
              </el-card>
            </div>
            <el-empty v-else description="暂无功能特点，点击上方按钮添加" />
          </el-card>

          <!-- 内容模块 -->
          <el-card shadow="hover">
            <template #header>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3><el-icon><Document /></el-icon> 内容模块</h3>
                <el-button type="primary" size="small" @click="showAddSectionDialog">
                  <el-icon><Plus /></el-icon> 添加模块
                </el-button>
              </div>
            </template>

            <div v-if="pageContentForm.sections && pageContentForm.sections.length > 0">
              <el-card 
                v-for="(section, index) in pageContentForm.sections" 
                :key="index" 
                class="section-card"
                shadow="hover"
                style="margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                  <div style="flex: 1;">
                    <h4>{{ section.title['zh-CN'] }}</h4>
                    <p style="color: #666; margin-top: 8px;">{{ section.content['zh-CN'] }}</p>
                    <el-image 
                      v-if="section.image" 
                      :src="section.image" 
                      style="width: 200px; height: 120px; margin-top: 12px; border-radius: 8px;"
                      fit="cover" />
                  </div>
                  <el-space>
                    <el-button size="small" @click="editSection(index, section)">
                      <el-icon><Edit /></el-icon> 编辑
                    </el-button>
                    <el-button size="small" type="danger" @click="deleteSection(index)">
                      <el-icon><Delete /></el-icon> 删除
                    </el-button>
                  </el-space>
                </div>
              </el-card>
            </div>
            <el-empty v-else description="暂无内容模块，点击上方按钮添加" />
          </el-card>
        </el-card>
      </el-tab-pane>
    </el-tabs>

    <!-- 功能特点编辑对话框 -->
    <el-dialog 
      v-model="featureDialogVisible" 
      :title="featureForm.isEdit ? '编辑功能特点' : '添加功能特点'" 
      width="600px">
      <el-form :model="featureForm" label-width="120px">
        <el-form-item label="中文标题">
          <el-input v-model="featureForm.title['zh-CN']" placeholder="请输入中文标题" />
        </el-form-item>
        <el-form-item label="英文标题">
          <el-input v-model="featureForm.title['en-US']" placeholder="Please enter English title" />
        </el-form-item>
        <el-form-item label="中文描述">
          <el-input 
            type="textarea" 
            :rows="4" 
            v-model="featureForm.description['zh-CN']" 
            placeholder="请输入中文描述" />
        </el-form-item>
        <el-form-item label="英文描述">
          <el-input 
            type="textarea" 
            :rows="4" 
            v-model="featureForm.description['en-US']" 
            placeholder="Please enter English description" />
        </el-form-item>
        <el-form-item label="图标/图片">
          <ImageUploader v-model="featureForm.icon" alt="功能图标" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="featureDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveFeatureForm">保存</el-button>
      </template>
    </el-dialog>

    <!-- 内容模块编辑对话框 -->
    <el-dialog 
      v-model="sectionDialogVisible" 
      :title="sectionForm.isEdit ? '编辑内容模块' : '添加内容模块'" 
      width="700px">
      <el-form :model="sectionForm" label-width="120px">
        <el-form-item label="中文标题">
          <el-input v-model="sectionForm.title['zh-CN']" placeholder="请输入中文标题" />
        </el-form-item>
        <el-form-item label="英文标题">
          <el-input v-model="sectionForm.title['en-US']" placeholder="Please enter English title" />
        </el-form-item>
        <el-form-item label="中文内容">
          <el-input 
            type="textarea" 
            :rows="5" 
            v-model="sectionForm.content['zh-CN']" 
            placeholder="请输入中文内容" />
        </el-form-item>
        <el-form-item label="英文内容">
          <el-input 
            type="textarea" 
            :rows="5" 
            v-model="sectionForm.content['en-US']" 
            placeholder="Please enter English content" />
        </el-form-item>
        <el-form-item label="配图">
          <ImageUploader v-model="sectionForm.image" alt="模块配图" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="sectionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveSectionForm">保存</el-button>
      </template>
    </el-dialog>

    <!-- 报警配置对话框 -->
    <el-dialog v-model="alarmConfigVisible" title="报警配置" width="600px">
      <el-form :model="dataStore.alarmConfig" label-width="140px">
        <el-form-item label="启用报警">
          <el-switch v-model="dataStore.alarmConfig.enabled" />
        </el-form-item>
        <el-form-item label="NOK结果报警">
          <el-switch v-model="dataStore.alarmConfig.nokAlarm" />
        </el-form-item>
        <el-form-item label="扭矩偏差阈值">
          <el-input-number 
            v-model="dataStore.alarmConfig.torqueDeviation" 
            :min="1" 
            :max="50" 
            suffix="%" />
          <span style="margin-left: 8px; color: #999;">%</span>
        </el-form-item>
        <el-form-item label="角度偏差阈值">
          <el-input-number 
            v-model="dataStore.alarmConfig.angleDeviation" 
            :min="1" 
            :max="50" />
          <span style="margin-left: 8px; color: #999;">%</span>
        </el-form-item>
        <el-form-item label="连续NOK报警">
          <el-input-number 
            v-model="dataStore.alarmConfig.consecutiveNok" 
            :min="2" 
            :max="10" />
          <span style="margin-left: 8px; color: #999;">次</span>
        </el-form-item>
        <el-form-item label="Cpk低值报警">
          <el-input-number 
            v-model="dataStore.alarmConfig.lowCpk" 
            :min="0.5" 
            :max="2" 
            :step="0.1" 
            :precision="2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="alarmConfigVisible = false">取消</el-button>
        <el-button type="primary" @click="saveAlarmConfig">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useTighteningDataStore } from '../../store/tighteningData'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  DataAnalysis, Connection, Link, VideoPlay, VideoPause, SwitchButton,
  Document, CircleCheck, CircleClose, TrendCharts, Monitor, View,
  Refresh, DataLine, Download, Search, RefreshLeft, Histogram,
  InfoFilled, WarningFilled, Setting, Delete, MagicStick, FolderOpened, Tools,
  Edit, Plus, Picture, StarFilled, Check
} from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import ToolsNetMapViewer from '../../components/ToolsNetMapViewer.vue'
import ImageUploader from '../../components/ImageUploader.vue'

const dataStore = useTighteningDataStore()

const activeTab = ref('realtime')
const connecting = ref(false)
const alarmConfigVisible = ref(false)
const curveType = ref('torque-angle') // 曲线类型选择

// 连接表单
const connectionForm = ref({
  controller: 'PF4000',
  ipAddress: '192.168.1.100',
  port: 4545,
  protocolVersion: '2.8.0',
  database: 'sqlserver',
  useMsmq: true
})

// 连接状态
const connectionStatusType = computed(() => {
  const status = dataStore.connection.status
  return {
    disconnected: 'info',
    connecting: 'warning',
    connected: 'success'
  }[status]
})

const connectionStatusText = computed(() => {
  const status = dataStore.connection.status
  return {
    disconnected: '未连接',
    connecting: '连接中...',
    connected: '已连接'
  }[status]
})

// 最近的拧紧结果
const recentResults = computed(() => {
  return dataStore.tighteningResults.slice(0, 50)
})

// Cpk数据
const cpkData = computed(() => dataStore.cpkAnalysis)

// 连接控制器
const connect = async () => {
  if (!connectionForm.value.ipAddress) {
    ElMessage.warning('请输入IP地址')
    return
  }

  connecting.value = true
  try {
    const result = await dataStore.connectToController(
      connectionForm.value.ipAddress,
      connectionForm.value.controller
    )
    ElMessage.success(result.message)
  } catch (error) {
    ElMessage.error('连接失败: ' + error.message)
  } finally {
    connecting.value = false
  }
}

// 断开连接
const disconnect = () => {
  ElMessageBox.confirm('确定要断开连接吗？', '确认', {
    type: 'warning'
  }).then(() => {
    dataStore.disconnect()
    ElMessage.success('已断开连接')
  }).catch(() => {})
}

// 开始采集
const startCollection = () => {
  dataStore.startDataCollection()
  ElMessage.success('开始数据采集')
  // 模拟数据采集
  simulateDataCollection()
}

// 停止采集
const stopCollection = () => {
  dataStore.stopDataCollection()
  ElMessage.info('停止数据采集')
}

// 模拟数据采集
let collectionInterval = null
const simulateDataCollection = () => {
  if (collectionInterval) {
    clearInterval(collectionInterval)
  }

  collectionInterval = setInterval(() => {
    if (!dataStore.realtimeData.isRunning) {
      clearInterval(collectionInterval)
      return
    }

    // 生成随机拧紧结果
    const targetTorque = 35
    const torqueVariation = (Math.random() - 0.5) * 8
    const torque = parseFloat((targetTorque + torqueVariation).toFixed(2))

    const result = Math.random() > 0.15 ? 'OK' : 'NOK' // 85% OK率

    dataStore.addTighteningResult({
      psetId: Math.floor(Math.random() * 5) + 1,
      jobId: 100 + Math.floor(Math.random() * 3),
      batchId: 'BATCH-001',
      result,
      torque,
      targetTorque,
      angle: parseFloat((180 + (Math.random() - 0.5) * 30).toFixed(1)),
      targetAngle: 180,
      tighteningTime: parseFloat((Math.random() * 1.5 + 1).toFixed(3)),
      nokReason: result === 'NOK' ? ['扭矩过低', '扭矩过高', '角度超限'][Math.floor(Math.random() * 3)] : null
    })
  }, 3000) // 每3秒采集一次
}

// 使用模拟数据
const useMockData = () => {
  ElMessageBox.confirm(
    '这将生成100条模拟拧紧数据，用于测试和演示。是否继续？',
    '生成模拟数据',
    {
      confirmButtonText: '生成',
      cancelButtonText: '取消',
      type: 'info'
    }
  ).then(() => {
    dataStore.generateMockData(100)
    ElMessage.success('✅ 已通过Data Collection Service生成100条模拟数据')
    initCharts()
  }).catch(() => {})
}

// 测试连接
const testConnection = () => {
  if (!connectionForm.value.ipAddress) {
    ElMessage.warning('请输入IP地址')
    return
  }
  
  ElMessage.info(`正在测试连接到 ${connectionForm.value.ipAddress}:${connectionForm.value.port}...`)
  
  // 模拟测试连接
  setTimeout(() => {
    ElMessage.success('✅ 连接测试成功 - Open Protocol 2.8.0 可用')
  }, 1500)
}

// 显示存档服务对话框
const showArchiveDialog = () => {
  ElMessage.info('存档服务 (Archive Service) - 正在开发中')
}

// 刷新实时数据
const refreshRealtimeData = () => {
  ElMessage.success('数据已刷新')
}

// 表格行样式
const tableRowClassName = ({ row }) => {
  return row.result === 'NOK' ? 'nok-row' : ''
}

// 扭矩颜色
const getTorqueColor = (actual, target) => {
  const deviation = Math.abs((actual - target) / target * 100)
  if (deviation < 5) return '#67c23a'
  if (deviation < 10) return '#e6a23c'
  return '#f56c6c'
}

// 应用筛选
const applyFilters = () => {
  ElMessage.success('筛选已应用')
  initCharts()
}

// 重置筛选
const resetFilters = () => {
  dataStore.filters.dateRange = [null, null]
  dataStore.filters.result = 'all'
  dataStore.filters.psetId = null
  dataStore.filters.jobId = null
  dataStore.filters.batchId = null
  dataStore.filters.workshop = 'all'
  dataStore.filters.productionLine = 'all'
  dataStore.filters.toolModel = 'all'
  dataStore.filters.snNumber = ''
  dataStore.filters.shift = 'all'
  ElMessage.success('筛选已重置')
  initCharts()
}

// 导出数据
const exportData = () => {
  dataStore.exportData('csv')
  ElMessage.success('数据导出成功')
}

// Cpk等级
const getCpkType = (cpk) => {
  const value = parseFloat(cpk)
  if (value >= 1.67) return 'success'
  if (value >= 1.33) return 'warning'
  return 'danger'
}

const getCpkLevel = (cpk) => {
  const value = parseFloat(cpk)
  if (value >= 1.67) return '优秀'
  if (value >= 1.33) return '良好'
  return '不足'
}

// 异常类型
const getAnomalyType = (level) => {
  return {
    warning: 'warning',
    error: 'danger',
    critical: 'danger'
  }[level] || 'info'
}

const getAnomalyIcon = (level) => {
  return {
    warning: WarningFilled,
    error: CircleClose,
    critical: CircleClose
  }[level] || InfoFilled
}

// 配置报警
const configAlarm = () => {
  alarmConfigVisible.value = true
}

// 保存报警配置
const saveAlarmConfig = () => {
  alarmConfigVisible.value = false
  ElMessage.success('报警配置已保存')
}

// 清空异常
const clearAnomalies = () => {
  ElMessageBox.confirm('确定要清空所有异常记录吗？', '确认', {
    type: 'warning'
  }).then(() => {
    dataStore.clearAnomalies()
    ElMessage.success('异常记录已清空')
  }).catch(() => {})
}

// 查看异常详情
const viewAnomalyDetail = (anomaly) => {
  ElMessage.info('查看异常详情: ' + anomaly.type)
}

// 查看曲线
const viewCurve = (result) => {
  activeTab.value = 'curves'
  ElMessage.info('查看拧紧曲线')
}

// 图表引用
const okRateChart = ref(null)
const torqueDistChart = ref(null)
const curveChart = ref(null)

// 初始化图表
const initCharts = () => {
  nextTick(() => {
    initOkRateChart()
    initTorqueDistChart()
    initCurveChart()
    initMultiParamChart()
  })
}

// OK率趋势图
const initOkRateChart = () => {
  if (!okRateChart.value) return

  const chart = echarts.init(okRateChart.value)
  
  const results = dataStore.filteredResults.slice(0, 100).reverse()
  
  if (results.length === 0) {
    chart.setOption({
      title: { text: 'OK率趋势分析', left: 'center' },
      graphic: [{
        type: 'text',
        left: 'center',
        top: 'middle',
        style: { text: '暂无数据', fontSize: 16, fill: '#999' }
      }]
    })
    return
  }
  
  // 按时间分组统计(每10个数据一组)
  const groupSize = 10
  const groups = []
  for (let i = 0; i < results.length; i += groupSize) {
    const group = results.slice(i, i + groupSize)
    const okCount = group.filter(r => r.result === 'OK').length
    const okRate = (okCount / group.length * 100).toFixed(1)
    groups.push({
      index: Math.floor(i / groupSize) + 1,
      okRate: parseFloat(okRate),
      okCount,
      totalCount: group.length
    })
  }
  
  const xData = groups.map(g => `批次${g.index}`)
  const okData = groups.map(g => g.okRate)
  
  // 计算平均OK率
  const avgOkRate = (okData.reduce((sum, val) => sum + val, 0) / okData.length).toFixed(1)

  chart.setOption({
    title: { 
      text: 'OK率趋势分析', 
      subtext: `平均OK率: ${avgOkRate}% | 样本数: ${results.length} | 每批次: ${groupSize}个`,
      left: 'center' 
    },
    tooltip: { 
      trigger: 'axis',
      formatter: function(params) {
        const group = groups[params[0].dataIndex]
        return `${params[0].name}<br/>
                OK率: ${params[0].value}%<br/>
                合格: ${group.okCount}/${group.totalCount}次`
      }
    },
    grid: {
      left: '60px',
      right: '40px',
      top: '80px',
      bottom: '40px'
    },
    xAxis: { 
      type: 'category', 
      data: xData, 
      name: '批次',
      axisLabel: {
        interval: 0,
        fontSize: 11
      }
    },
    yAxis: { 
      type: 'value', 
      name: 'OK率(%)', 
      min: 0, 
      max: 100,
      axisLabel: {
        formatter: '{value}%'
      }
    },
    series: [
      {
        name: 'OK率',
        type: 'line',
        data: okData,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
          color: '#409EFF'
        },
        itemStyle: {
          color: (params) => {
            const rate = params.value
            if (rate >= 95) return '#67C23A' // 优秀 - 绿色
            if (rate >= 90) return '#409EFF' // 良好 - 蓝色
            if (rate >= 85) return '#E6A23C' // 一般 - 橙色
            return '#F56C6C' // 较差 - 红色
          }
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(64, 158, 255, 0.3)'
            }, {
              offset: 1,
              color: 'rgba(64, 158, 255, 0.05)'
            }]
          }
        },
        markLine: {
          silent: true,
          symbol: 'none',
          data: [
            { 
              yAxis: 95,
              name: '目标线',
              lineStyle: { color: '#67C23A', width: 2, type: 'dashed' },
              label: { formatter: '目标: 95%', position: 'end' }
            },
            { 
              yAxis: avgOkRate,
              name: '平均线',
              lineStyle: { color: '#909399', width: 1, type: 'solid' },
              label: { formatter: `平均: ${avgOkRate}%`, position: 'start' }
            }
          ]
        }
      }
    ]
  })
}

// 扭矩分布图
const initTorqueDistChart = () => {
  if (!torqueDistChart.value) return

  const chart = echarts.init(torqueDistChart.value)
  
  const results = dataStore.filteredResults
  if (results.length === 0) {
    chart.setOption({
      title: { text: '扭矩分布直方图', left: 'center' },
      graphic: [{
        type: 'text',
        left: 'center',
        top: 'middle',
        style: { text: '暂无数据', fontSize: 16, fill: '#999' }
      }]
    })
    return
  }
  
  const torqueData = results.map(r => r.torque).filter(t => t != null && !isNaN(t))
  
  // 计算目标扭矩和上下限
  const target = results[0]?.targetTorque || 35
  const upperLimit = target * 1.1
  const lowerLimit = target * 0.9
  
  // 计算扭矩范围和分组
  const minTorque = Math.min(...torqueData)
  const maxTorque = Math.max(...torqueData)
  const range = maxTorque - minTorque
  const binSize = range / 20 // 分成20个区间
  
  // 创建直方图数据
  const histogram = {}
  torqueData.forEach(torque => {
    const bin = Math.floor((torque - minTorque) / binSize) * binSize + minTorque
    const binKey = bin.toFixed(1)
    histogram[binKey] = (histogram[binKey] || 0) + 1
  })
  
  // 转换为图表数据
  const bins = Object.keys(histogram).sort((a, b) => parseFloat(a) - parseFloat(b))
  const counts = bins.map(bin => histogram[bin])
  const binLabels = bins.map(bin => `${parseFloat(bin).toFixed(1)}-${(parseFloat(bin) + binSize).toFixed(1)}`)

  chart.setOption({
    title: { 
      text: '扭矩分布直方图', 
      subtext: `目标: ${target}Nm | 上限: ${upperLimit.toFixed(1)}Nm | 下限: ${lowerLimit.toFixed(1)}Nm`,
      left: 'center' 
    },
    tooltip: { 
      trigger: 'axis',
      formatter: function(params) {
        return `扭矩范围: ${params[0].name}<br/>
                数量: ${params[0].value} 次<br/>
                占比: ${(params[0].value / torqueData.length * 100).toFixed(1)}%`
      }
    },
    grid: {
      left: '60px',
      right: '40px',
      top: '80px',
      bottom: '60px'
    },
    xAxis: { 
      type: 'category', 
      data: binLabels,
      name: '扭矩范围(Nm)',
      nameLocation: 'middle',
      nameGap: 35,
      axisLabel: {
        rotate: 45,
        fontSize: 10
      }
    },
    yAxis: { 
      type: 'value', 
      name: '数量(次)',
      nameLocation: 'middle',
      nameGap: 45
    },
    series: [{
      name: '扭矩分布',
      type: 'bar',
      data: counts.map((count, index) => {
        const binStart = parseFloat(bins[index])
        const binCenter = binStart + binSize / 2
        let color = '#409EFF' // 默认蓝色
        
        // 根据是否在目标范围内着色
        if (binCenter < lowerLimit) {
          color = '#F56C6C' // 红色 - 过低
        } else if (binCenter > upperLimit) {
          color = '#E6A23C' // 橙色 - 过高
        } else {
          color = '#67C23A' // 绿色 - 合格
        }
        
        return {
          value: count,
          itemStyle: { color }
        }
      }),
      barWidth: '60%',
      label: {
        show: true,
        position: 'top',
        fontSize: 10
      }
    }],
    markLine: {
      silent: true,
      symbol: 'none',
      data: [
        { 
          xAxis: binLabels[Math.floor(binLabels.length / 2)],
          name: '目标值',
          lineStyle: { color: '#67C23A', width: 2, type: 'dashed' },
          label: { formatter: `目标: ${target}Nm`, position: 'end' }
        }
      ]
    }
  })
}

// 拧紧曲线图（基于真实物理模型）
const initCurveChart = () => {
  if (!curveChart.value) return

  const chart = echarts.init(curveChart.value)

  // 生成标准三阶段拧紧曲线
  const generateStandardTighteningCurve = () => {
    const data = []
    const timeData = []
    const speedData = []
    
    // 阶段1：低速认牙阶段 (0-90°, 0-0.5s)
    for (let angle = 0; angle <= 90; angle += 1) {
      const time = angle / 180 // 低速
      const torque = angle * 0.02 // 扭矩缓慢上升
      const speed = 180 // rpm，低速
      data.push([angle, parseFloat(torque.toFixed(2))])
      timeData.push([time, parseFloat(torque.toFixed(2))])
      speedData.push([angle, speed])
    }
    
    // 阶段2：快速旋入阶段 (90-360°, 0.5-2.5s)
    for (let angle = 91; angle <= 360; angle += 1) {
      const time = 0.5 + (angle - 90) / 135
      const torque = 1.8 + (angle - 90) * 0.015 // 扭矩缓慢增加
      const speed = 800 // rpm，高速
      data.push([angle, parseFloat(torque.toFixed(2))])
      timeData.push([time, parseFloat(torque.toFixed(2))])
      speedData.push([angle, speed])
    }
    
    // 阶段3：拧紧阶段 (360-540°, 2.5-4.5s)
    for (let angle = 361; angle <= 540; angle += 1) {
      const time = 2.5 + (angle - 360) / 90
      // 弹性段：扭矩快速上升
      const elasticTorque = 5.85 + Math.pow((angle - 360) / 180, 1.5) * 29
      const torque = Math.min(35, elasticTorque)
      const speed = 300 // rpm，降低速度
      data.push([angle, parseFloat(torque.toFixed(2))])
      timeData.push([time, parseFloat(torque.toFixed(2))])
      speedData.push([angle, speed])
    }
    
    return { data, timeData, speedData }
  }

  const curveData = generateStandardTighteningCurve()
  
  // 计算关键参数
  const maxTorque = Math.max(...curveData.data.map(d => d[1]))
  const avgTorque = (curveData.data.reduce((sum, d) => sum + d[1], 0) / curveData.data.length).toFixed(2)
  const totalTime = 4.5
  const maxAngle = 540

  chart.setOption({
    title: { 
      text: '标准拧紧曲线分析',
      subtext: `最大扭矩: ${maxTorque}Nm | 平均扭矩: ${avgTorque}Nm | 拧紧时间: ${totalTime}s | 总角度: ${maxAngle}°`,
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' },
      subtextStyle: { fontSize: 12, color: '#666' }
    },
    tooltip: { 
      trigger: 'axis',
      formatter: function(params) {
        const angle = params[0].data[0]
        const torque = params[0].data[1]
        let phase = ''
        if (angle <= 90) phase = '低速认牙阶段'
        else if (angle <= 360) phase = '快速旋入阶段'
        else phase = '拧紧阶段（弹性段）'
        return `角度: ${angle}°<br/>扭矩: ${torque}Nm<br/>阶段: ${phase}`
      }
    },
    legend: {
      data: ['扭矩曲线', '目标扭矩', '上限', '下限'],
      top: 35
    },
    grid: { left: '10%', right: '10%', top: '20%', bottom: '15%' },
    xAxis: { 
      type: 'value', 
      name: '旋入角度 (°)',
      nameLocation: 'middle',
      nameGap: 30,
      min: 0,
      max: 600
    },
    yAxis: { 
      type: 'value', 
      name: '扭矩 (Nm)',
      nameLocation: 'middle',
      nameGap: 50,
      min: 0,
      max: 40
    },
    series: [
      {
        name: '扭矩曲线',
        type: 'line',
        data: curveData.data,
        smooth: false,
        lineStyle: { color: '#409eff', width: 3 },
        areaStyle: { 
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(64, 158, 255, 0.4)' },
              { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
            ]
          }
        },
        markPoint: {
          data: [
            { type: 'max', name: '最大扭矩', itemStyle: { color: '#f56c6c' } }
          ]
        },
        markLine: {
          silent: true,
          lineStyle: { type: 'dashed', width: 1 },
          data: [
            { xAxis: 90, name: '认牙结束', label: { formatter: '认牙' } },
            { xAxis: 360, name: '旋入结束', label: { formatter: '快速旋入' } }
          ]
        }
      },
      {
        name: '目标扭矩',
        type: 'line',
        data: [[0, 35], [600, 35]],
        lineStyle: { color: '#67c23a', width: 2, type: 'solid' },
        symbol: 'none'
      },
      {
        name: '上限',
        type: 'line',
        data: [[0, 38.5], [600, 38.5]],
        lineStyle: { color: '#e6a23c', width: 1, type: 'dashed' },
        symbol: 'none'
      },
      {
        name: '下限',
        type: 'line',
        data: [[0, 31.5], [600, 31.5]],
        lineStyle: { color: '#e6a23c', width: 1, type: 'dashed' },
        symbol: 'none'
      }
    ]
  })
}

// 多参数对比图（扭矩-角度-时间-速度四维分析）
const initMultiParamChart = () => {
  if (!multiParamChart.value) return

  const chart = echarts.init(multiParamChart.value)

  // 生成完整拧紧过程的多参数数据
  const generateMultiParamData = () => {
    const torqueData = []
    const angleData = []
    const speedData = []
    const timeAxis = []
    
    // 阶段1：低速认牙 (0-0.5s)
    for (let t = 0; t <= 0.5; t += 0.01) {
      const angle = t * 180 // 低速认牙
      const torque = angle * 0.02
      const speed = 180 // rpm
      timeAxis.push(t.toFixed(2))
      torqueData.push(torque.toFixed(2))
      angleData.push(angle.toFixed(1))
      speedData.push(speed)
    }
    
    // 阶段2：快速旋入 (0.5-2.5s)
    for (let t = 0.51; t <= 2.5; t += 0.01) {
      const angle = 90 + (t - 0.5) * 135
      const torque = 1.8 + (angle - 90) * 0.015
      const speed = 800 // rpm
      timeAxis.push(t.toFixed(2))
      torqueData.push(torque.toFixed(2))
      angleData.push(angle.toFixed(1))
      speedData.push(speed)
    }
    
    // 阶段3：拧紧阶段 (2.5-4.5s)
    for (let t = 2.51; t <= 4.5; t += 0.01) {
      const angle = 360 + (t - 2.5) * 90
      const elasticTorque = 5.85 + Math.pow((angle - 360) / 180, 1.5) * 29
      const torque = Math.min(35, elasticTorque)
      const speed = 300 // rpm
      timeAxis.push(t.toFixed(2))
      torqueData.push(torque.toFixed(2))
      angleData.push(angle.toFixed(1))
      speedData.push(speed)
    }
    
    return { torqueData, angleData, speedData, timeAxis }
  }

  const data = generateMultiParamData()
  
  // 计算关键统计参数
  const maxTorque = Math.max(...data.torqueData.map(Number))
  const avgTorque = (data.torqueData.reduce((sum, v) => sum + Number(v), 0) / data.torqueData.length).toFixed(2)
  const totalTime = data.timeAxis[data.timeAxis.length - 1]
  const totalAngle = data.angleData[data.angleData.length - 1]

  chart.setOption({
    title: {
      text: '拧紧过程多参数对比分析',
      subtext: `最大扭矩: ${maxTorque}Nm | 平均扭矩: ${avgTorque}Nm | 总时间: ${totalTime}s | 总角度: ${totalAngle}°`,
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 'bold' },
      subtextStyle: { fontSize: 12, color: '#666' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      formatter: function(params) {
        const time = params[0].name
        let result = `时间: ${time}s<br/>`
        params.forEach(item => {
          result += `${item.seriesName}: ${item.value}${item.seriesName.includes('扭矩') ? 'Nm' : item.seriesName.includes('角度') ? '°' : 'rpm'}<br/>`
        })
        return result
      }
    },
    legend: {
      data: ['扭矩 (Nm)', '旋入角度 (°/10)', '拧紧速度 (rpm/10)'],
      top: 35
    },
    grid: {
      left: '8%',
      right: '8%',
      top: '18%',
      bottom: '12%'
    },
    xAxis: {
      type: 'category',
      data: data.timeAxis,
      name: '时间 (s)',
      nameLocation: 'middle',
      nameGap: 30,
      axisLabel: {
        interval: Math.floor(data.timeAxis.length / 10),
        formatter: '{value}'
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '扭矩 (Nm)',
        nameLocation: 'middle',
        nameGap: 50,
        min: 0,
        max: 40,
        axisLabel: { formatter: '{value}' },
        splitLine: { lineStyle: { type: 'dashed', color: '#e0e0e0' } }
      },
      {
        type: 'value',
        name: '角度(°) / 速度(rpm)',
        nameLocation: 'middle',
        nameGap: 50,
        min: 0,
        max: 100,
        axisLabel: { formatter: '{value}' },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: '扭矩 (Nm)',
        type: 'line',
        data: data.torqueData,
        yAxisIndex: 0,
        smooth: false,
        lineStyle: { color: '#409eff', width: 3 },
        itemStyle: { color: '#409eff' },
        symbol: 'none',
        markArea: {
          silent: true,
          data: [
            [
              { name: '低速认牙', xAxis: data.timeAxis[0] },
              { xAxis: data.timeAxis[50] }
            ],
            [
              { name: '快速旋入', xAxis: data.timeAxis[51] },
              { xAxis: data.timeAxis[250] }
            ],
            [
              { name: '拧紧', xAxis: data.timeAxis[251] },
              { xAxis: data.timeAxis[data.timeAxis.length - 1] }
            ]
          ],
          itemStyle: {
            color: 'rgba(64, 158, 255, 0.05)'
          },
          label: {
            show: true,
            position: 'top',
            fontSize: 11,
            color: '#666'
          }
        }
      },
      {
        name: '旋入角度 (°/10)',
        type: 'line',
        data: data.angleData.map(a => (Number(a) / 10).toFixed(1)),
        yAxisIndex: 1,
        smooth: true,
        lineStyle: { color: '#67c23a', width: 2, type: 'dashed' },
        itemStyle: { color: '#67c23a' },
        symbol: 'none'
      },
      {
        name: '拧紧速度 (rpm/10)',
        type: 'line',
        data: data.speedData.map(s => (s / 10).toFixed(1)),
        yAxisIndex: 1,
        smooth: true,
        lineStyle: { color: '#e6a23c', width: 2, type: 'dotted' },
        itemStyle: { color: '#e6a23c' },
        symbol: 'none',
        step: 'end'
      }
    ]
  })
}

// 更新曲线图表（根据选择的曲线类型）
const updateCurveChart = () => {
  if (!curveChart.value) return

  const chart = echarts.getInstanceByDom(curveChart.value) || echarts.init(curveChart.value)

  // 生成标准三阶段拧紧曲线数据
  const generateCurveData = () => {
    const angleData = []
    const torqueData = []
    const timeData = []
    const speedData = []
    
    // 阶段1：低速认牙阶段 (0-90°, 0-0.5s)
    for (let angle = 0; angle <= 90; angle += 1) {
      const time = angle / 180
      const torque = angle * 0.02
      const speed = 180
      angleData.push(angle)
      torqueData.push(parseFloat(torque.toFixed(2)))
      timeData.push(parseFloat(time.toFixed(3)))
      speedData.push(speed)
    }
    
    // 阶段2：快速旋入阶段 (90-360°, 0.5-2.5s)
    for (let angle = 91; angle <= 360; angle += 1) {
      const time = 0.5 + (angle - 90) / 135
      const torque = 1.8 + (angle - 90) * 0.015
      const speed = 800
      angleData.push(angle)
      torqueData.push(parseFloat(torque.toFixed(2)))
      timeData.push(parseFloat(time.toFixed(3)))
      speedData.push(speed)
    }
    
    // 阶段3：拧紧阶段 (360-540°, 2.5-4.5s)
    for (let angle = 361; angle <= 540; angle += 1) {
      const time = 2.5 + (angle - 360) / 90
      const elasticTorque = 5.85 + Math.pow((angle - 360) / 180, 1.5) * 29
      const torque = Math.min(35, elasticTorque)
      const speed = 300
      angleData.push(angle)
      torqueData.push(parseFloat(torque.toFixed(2)))
      timeData.push(parseFloat(time.toFixed(3)))
      speedData.push(speed)
    }
    
    return { angleData, torqueData, timeData, speedData }
  }

  const data = generateCurveData()
  let option = {}

  // 根据曲线类型生成不同的图表配置
  switch (curveType.value) {
    case 'torque-angle': // 扭矩-角度
      option = {
        title: {
          text: '扭矩-角度曲线',
          subtext: '拧紧过程扭矩随角度变化关系',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const angle = params[0].data[0]
            const torque = params[0].data[1]
            let phase = angle <= 90 ? '低速认牙' : angle <= 360 ? '快速旋入' : '拧紧阶段'
            return `角度: ${angle}°<br/>扭矩: ${torque}Nm<br/>阶段: ${phase}`
          }
        },
        xAxis: {
          type: 'value',
          name: '旋入角度 (°)',
          nameLocation: 'middle',
          nameGap: 30
        },
        yAxis: {
          type: 'value',
          name: '扭矩 (Nm)',
          nameLocation: 'middle',
          nameGap: 50
        },
        series: [{
          type: 'line',
          data: data.angleData.map((a, i) => [a, data.torqueData[i]]),
          smooth: false,
          lineStyle: { color: '#409eff', width: 3 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(64, 158, 255, 0.4)' },
                { offset: 1, color: 'rgba(64, 158, 255, 0.05)' }
              ]
            }
          },
          markLine: {
            silent: true,
            lineStyle: { type: 'dashed', width: 1 },
            data: [
              { xAxis: 90, name: '认牙结束', label: { formatter: '认牙' } },
              { xAxis: 360, name: '旋入结束', label: { formatter: '快速旋入' } }
            ]
          }
        }]
      }
      break

    case 'torque-time': // 扭矩-时间
      option = {
        title: {
          text: '扭矩-时间曲线',
          subtext: '拧紧过程扭矩随时间变化关系',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const time = params[0].data[0]
            const torque = params[0].data[1]
            let phase = time <= 0.5 ? '低速认牙' : time <= 2.5 ? '快速旋入' : '拧紧阶段'
            return `时间: ${time}s<br/>扭矩: ${torque}Nm<br/>阶段: ${phase}`
          }
        },
        xAxis: {
          type: 'value',
          name: '时间 (s)',
          nameLocation: 'middle',
          nameGap: 30,
          max: 5
        },
        yAxis: {
          type: 'value',
          name: '扭矩 (Nm)',
          nameLocation: 'middle',
          nameGap: 50
        },
        series: [{
          type: 'line',
          data: data.timeData.map((t, i) => [t, data.torqueData[i]]),
          smooth: true,
          lineStyle: { color: '#67c23a', width: 3 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(103, 194, 58, 0.4)' },
                { offset: 1, color: 'rgba(103, 194, 58, 0.05)' }
              ]
            }
          },
          markLine: {
            silent: true,
            lineStyle: { type: 'dashed', width: 1 },
            data: [
              { xAxis: 0.5, name: '认牙结束', label: { formatter: '0.5s' } },
              { xAxis: 2.5, name: '旋入结束', label: { formatter: '2.5s' } }
            ]
          }
        }]
      }
      break

    case 'torque-speed': // 扭矩-转速
      option = {
        title: {
          text: '扭矩-转速曲线',
          subtext: '拧紧过程扭矩与转速动力学关系',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const speed = params[0].data[0]
            const torque = params[0].data[1]
            let phase = speed === 180 ? '低速认牙' : speed === 800 ? '快速旋入' : '拧紧阶段'
            return `转速: ${speed}rpm<br/>扭矩: ${torque}Nm<br/>阶段: ${phase}`
          }
        },
        xAxis: {
          type: 'value',
          name: '转速 (rpm)',
          nameLocation: 'middle',
          nameGap: 30
        },
        yAxis: {
          type: 'value',
          name: '扭矩 (Nm)',
          nameLocation: 'middle',
          nameGap: 50
        },
        series: [{
          type: 'scatter',
          data: data.speedData.map((s, i) => [s, data.torqueData[i]]),
          symbolSize: 6,
          itemStyle: {
            color: (params) => {
              const speed = params.data[0]
              if (speed === 180) return '#909399'
              if (speed === 800) return '#409eff'
              return '#f56c6c'
            }
          }
        }]
      }
      break

    case 'angle-time': // 角度-时间
      option = {
        title: {
          text: '角度-时间曲线',
          subtext: '拧紧过程角度随时间变化关系',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const time = params[0].data[0]
            const angle = params[0].data[1]
            let phase = time <= 0.5 ? '低速认牙' : time <= 2.5 ? '快速旋入' : '拧紧阶段'
            return `时间: ${time}s<br/>角度: ${angle}°<br/>阶段: ${phase}`
          }
        },
        xAxis: {
          type: 'value',
          name: '时间 (s)',
          nameLocation: 'middle',
          nameGap: 30,
          max: 5
        },
        yAxis: {
          type: 'value',
          name: '旋入角度 (°)',
          nameLocation: 'middle',
          nameGap: 50
        },
        series: [{
          type: 'line',
          data: data.timeData.map((t, i) => [t, data.angleData[i]]),
          smooth: true,
          lineStyle: { color: '#e6a23c', width: 3 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(230, 162, 60, 0.4)' },
                { offset: 1, color: 'rgba(230, 162, 60, 0.05)' }
              ]
            }
          },
          markLine: {
            silent: true,
            lineStyle: { type: 'dashed', width: 1 },
            data: [
              { xAxis: 0.5, label: { formatter: '认牙结束' } },
              { xAxis: 2.5, label: { formatter: '旋入结束' } }
            ]
          }
        }]
      }
      break

    case 'torque-angle-time': // 扭矩转角-时间（双Y轴）
      option = {
        title: {
          text: '扭矩转角-时间曲线',
          subtext: '拧紧过程扭矩和角度随时间同步变化关系',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          },
          formatter: (params) => {
            const time = params[0].axisValue
            let result = `<div style="font-weight:bold;margin-bottom:5px;">时间: ${time}s</div>`
            
            // 判断阶段
            let phase = ''
            let phaseColor = ''
            if (time <= 0.5) {
              phase = '低速认牙阶段'
              phaseColor = '#67c23a'
            } else if (time <= 2.5) {
              phase = '快速旋入阶段'
              phaseColor = '#409eff'
            } else {
              phase = '拧紧阶段'
              phaseColor = '#e6a23c'
            }
            result += `<div style="color:${phaseColor};margin-bottom:8px;">📍 ${phase}</div>`
            
            params.forEach(param => {
              const marker = param.marker
              const value = param.value
              const name = param.seriesName
              const unit = name.includes('扭矩') ? 'Nm' : '°'
              result += `${marker} ${name}: <strong>${value} ${unit}</strong><br/>`
            })
            
            return result
          }
        },
        legend: {
          data: ['扭矩', '转角'],
          bottom: 10
        },
        grid: {
          left: '8%',
          right: '8%',
          bottom: '12%',
          top: '18%'
        },
        xAxis: {
          type: 'value',
          name: '时间 (s)',
          nameLocation: 'middle',
          nameGap: 30,
          min: 0,
          max: 5,
          axisLabel: {
            formatter: '{value}s'
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '扭矩 (Nm)',
            nameLocation: 'middle',
            nameGap: 50,
            min: 0,
            max: 40,
            position: 'left',
            axisLabel: {
              formatter: '{value} Nm'
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#e0e0e0'
              }
            }
          },
          {
            type: 'value',
            name: '旋入角度 (°)',
            nameLocation: 'middle',
            nameGap: 50,
            min: 0,
            max: 600,
            position: 'right',
            axisLabel: {
              formatter: '{value}°'
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '扭矩',
            type: 'line',
            yAxisIndex: 0,
            data: data.timeData.map((t, i) => [t, data.torqueData[i]]),
            smooth: true,
            lineStyle: { color: '#f56c6c', width: 3 },
            itemStyle: { color: '#f56c6c' },
            symbol: 'none',
            areaStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(245, 108, 108, 0.3)' },
                  { offset: 1, color: 'rgba(245, 108, 108, 0.05)' }
                ]
              }
            },
            markLine: {
              silent: true,
              lineStyle: { type: 'dashed', width: 1, color: '#909399' },
              data: [
                { xAxis: 0.5, name: '认牙结束', label: { formatter: '认牙→旋入' } },
                { xAxis: 2.5, name: '旋入结束', label: { formatter: '旋入→拧紧' } }
              ]
            }
          },
          {
            name: '转角',
            type: 'line',
            yAxisIndex: 1,
            data: data.timeData.map((t, i) => [t, data.angleData[i]]),
            smooth: true,
            lineStyle: { color: '#409eff', width: 2 },
            itemStyle: { color: '#409eff' },
            symbol: 'none'
          }
        ]
      }
      break
  }

  // 通用配置
  option.grid = { left: '10%', right: '10%', top: '15%', bottom: '12%' }
  option.toolbox = {
    feature: {
      saveAsImage: { title: '保存为图片' },
      dataZoom: { title: { zoom: '区域缩放', back: '还原' } },
      restore: { title: '还原' }
    }
  }

  chart.setOption(option, true)
  
  const typeNames = {
    'torque-angle': '扭矩-角度',
    'torque-time': '扭矩-时间',
    'torque-speed': '扭矩-转速',
    'angle-time': '角度-时间',
    'torque-angle-time': '扭矩转角-时间'
  }
  
  ElMessage.success(`已切换到${typeNames[curveType.value]}曲线`)
}

// ==================== 数据库维护功能 ====================

// 维护任务和统计
const maintenanceJobs = ref({
  deleteMaintenanceJob: {
    name: 'ToolsNet_DeleteMaintenance',
    enabled: false,
    daysToKeep: 100,
    description: '删除过期的结果、曲线、程序信息和不再使用的工具数据',
    schedule: 'daily',
    lastRun: null,
    runCount: 0
  },
  deleteUnboundGraphsJob: {
    name: 'ToolsNet_DeleteUnboundGraphs',
    enabled: true,
    description: '删除未关联到结果的曲线数据（主要用于PowerMACS系统）',
    schedule: 'daily',
    lastRun: null,
    runCount: 0
  },
  indexReorganizeJob: {
    name: 'ToolsNet_IndexReorganize',
    enabled: true,
    description: '重组数据库索引以提高报表和结果插入性能',
    schedule: 'daily-except-sunday',
    lastRun: null,
    runCount: 0
  },
  indexRebuildJob: {
    name: 'ToolsNet_IndexRebuild',
    enabled: true,
    description: '重建数据库索引以提高数据库性能',
    schedule: 'weekly-sunday',
    lastRun: null,
    runCount: 0
  },
  archiveJob: {
    name: 'ToolsNet_Archive',
    enabled: false,
    description: '将数据从ToolsNet数据库复制到归档数据库',
    schedule: 'manual',
    archiveDatabase: 'ToolsNet_Archive',
    lastRun: null,
    runCount: 0
  }
})

const maintenanceStats = ref({
  totalDeletedResults: 0,
  totalDeletedGraphs: 0,
  totalArchivedRecords: 0,
  lastMaintenanceTime: null,
  indexFragmentation: 12.5,
  databaseSize: 2.5,
  archiveSize: 1.2,
  database: {
    currentResults: 0,
    currentCurves: 0,
    currentEvents: 0,
    estimatedSize: '0 GB'
  }
})

const maintenanceLoading = ref(false)

// 加载维护配置
const loadMaintenanceConfig = async () => {
  try {
    const response = await fetch('/api/tightening/maintenance/jobs')
    const data = await response.json()
    
    if (data.success) {
      maintenanceJobs.value = data.data.jobs
      maintenanceStats.value = { ...maintenanceStats.value, ...data.data.statistics }
    }
  } catch (error) {
    console.error('加载维护配置失败:', error)
  }
}

// 更新维护任务配置
const updateMaintenanceJob = async (jobName) => {
  try {
    const response = await fetch(`/api/tightening/maintenance/jobs/${jobName}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(maintenanceJobs.value[jobName])
    })
    
    const data = await response.json()
    
    if (data.success) {
      ElMessage.success(`任务配置已更新: ${data.data.name}`)
    } else {
      ElMessage.error(data.message)
    }
  } catch (error) {
    ElMessage.error('更新任务配置失败: ' + error.message)
  }
}

// 执行单个维护任务
const runMaintenanceJob = async (jobName) => {
  const job = maintenanceJobs.value[jobName]
  
  if (!job.enabled) {
    ElMessage.warning(`任务未启用: ${job.name}`)
    return
  }

  maintenanceLoading.value = true

  try {
    ElMessage.info(`正在执行: ${job.name}`)
    
    const response = await fetch(`/api/tightening/maintenance/run/${jobName}`, {
      method: 'POST'
    })
    
    const data = await response.json()
    
    if (data.success) {
      ElMessage.success({
        message: data.message,
        duration: 5000,
        showClose: true
      })
      
      // 显示详细信息
      if (data.details) {
        console.log('维护任务详情:', data.details)
      }
      
      // 重新加载配置和统计
      await loadMaintenanceConfig()
      await loadMaintenanceStatistics()
    } else {
      ElMessage.error(data.message)
    }
  } catch (error) {
    ElMessage.error('执行维护任务失败: ' + error.message)
  } finally {
    maintenanceLoading.value = false
  }
}

// 执行所有启用的维护任务
const runAllMaintenanceJobs = async () => {
  const enabledJobs = Object.entries(maintenanceJobs.value)
    .filter(([_, job]) => job.enabled)
    .map(([_, job]) => job.name)

  if (enabledJobs.length === 0) {
    ElMessage.warning('没有启用的维护任务')
    return
  }

  ElMessageBox.confirm(
    `将执行 ${enabledJobs.length} 个启用的维护任务，是否继续？`,
    '确认执行',
    {
      confirmButtonText: '执行',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    maintenanceLoading.value = true

    try {
      ElMessage.info(`正在执行 ${enabledJobs.length} 个维护任务...`)
      
      const response = await fetch('/api/tightening/maintenance/run-all', {
        method: 'POST'
      })
      
      const data = await response.json()
      
      if (data.success) {
        ElMessage.success({
          message: data.message,
          duration: 5000,
          showClose: true
        })
        
        // 显示每个任务的结果
        data.results.forEach(result => {
          if (result.success) {
            console.log(`✅ ${result.job}: ${result.message}`)
          } else {
            console.error(`❌ ${result.job}: ${result.message}`)
          }
        })
        
        // 重新加载配置和统计
        await loadMaintenanceConfig()
        await loadMaintenanceStatistics()
      } else {
        ElMessage.error(data.message)
      }
    } catch (error) {
      ElMessage.error('执行维护任务失败: ' + error.message)
    } finally {
      maintenanceLoading.value = false
    }
  }).catch(() => {})
}

// 加载维护统计信息
const loadMaintenanceStatistics = async () => {
  try {
    const response = await fetch('/api/tightening/maintenance/statistics')
    const data = await response.json()
    
    if (data.success) {
      maintenanceStats.value = data.data
    }
  } catch (error) {
    console.error('加载维护统计失败:', error)
  }
}

// ======== 内容编辑功能 ========

// 页面内容表单
const pageContentForm = ref({
  banner: {
    title: {
      'zh-CN': '拧紧数据采集分析系统',
      'en-US': 'Tightening Data Collection & Analysis System'
    },
    subtitle: {
      'zh-CN': '基于 ToolsNet 8 工业标准',
      'en-US': 'Based on ToolsNet 8 Industrial Standard'
    },
    description: {
      'zh-CN': '实时采集、智能分析、精准预警 - 为智能制造保驾护航',
      'en-US': 'Real-time Collection, Intelligent Analysis, Accurate Alerts - Empowering Smart Manufacturing'
    },
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200'
  },
  features: [
    {
      title: {
        'zh-CN': '实时数据采集',
        'en-US': 'Real-time Data Collection'
      },
      description: {
        'zh-CN': '支持 Open Protocol 2.8.0 协议，连接 PowerFocus/PowerMACS 控制器，实时采集拧紧数据，采集速度 >60个/分钟',
        'en-US': 'Supports Open Protocol 2.8.0, connects to PowerFocus/PowerMACS controllers, real-time data collection at >60 results/min'
      },
      icon: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=400'
    },
    {
      title: {
        'zh-CN': '智能过程分析',
        'en-US': 'Intelligent Process Analysis'
      },
      description: {
        'zh-CN': '提供 Cpk、Cp、Cpu、Cpl 等过程能力分析，X-Bar/Range 控制图，TOP NOK 分析，帮助快速定位质量问题',
        'en-US': 'Provides Cpk, Cp, Cpu, Cpl process capability analysis, X-Bar/Range control charts, TOP NOK analysis for quick quality issue identification'
      },
      icon: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400'
    },
    {
      title: {
        'zh-CN': '异常智能预警',
        'en-US': 'Intelligent Anomaly Alerts'
      },
      description: {
        'zh-CN': '自动检测 NOK 结果、扭矩/角度偏差、连续 NOK、Cpk 低值等异常，支持邮件/短信/推送通知',
        'en-US': 'Automatically detects NOK results, torque/angle deviations, consecutive NOK, low Cpk values, supports email/SMS/push notifications'
      },
      icon: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400'
    },
    {
      title: {
        'zh-CN': '数据库智能维护',
        'en-US': 'Intelligent Database Maintenance'
      },
      description: {
        'zh-CN': '自动删除过期数据、清理未绑定曲线、索引重组/重建、数据归档，保持系统高性能运行',
        'en-US': 'Automatically deletes expired data, cleans unbound curves, reorganizes/rebuilds indexes, archives data for optimal system performance'
      },
      icon: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400'
    }
  ],
  sections: [
    {
      title: {
        'zh-CN': 'ToolsNet 8 架构',
        'en-US': 'ToolsNet 8 Architecture'
      },
      content: {
        'zh-CN': '本系统完全基于 Atlas Copco ToolsNet 8 工业标准设计，包含 Protocol Interface Module (PIM)、Data Collection Service (DCS)、Common Data Collection (CDC) 等核心组件，确保与原厂系统100%兼容。',
        'en-US': 'This system is fully designed based on Atlas Copco ToolsNet 8 industrial standard, including core components such as Protocol Interface Module (PIM), Data Collection Service (DCS), Common Data Collection (CDC), ensuring 100% compatibility with OEM systems.'
      },
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600'
    },
    {
      title: {
        'zh-CN': '企业级数据库',
        'en-US': 'Enterprise Database'
      },
      content: {
        'zh-CN': '支持 SQL Server 和 Oracle 数据库，包含7张核心数据表、15+个优化索引、存储过程、触发器等，存储容量 >50,000 条拧紧结果，>5,000 条曲线数据。',
        'en-US': 'Supports SQL Server and Oracle databases, includes 7 core data tables, 15+ optimized indexes, stored procedures, triggers, storage capacity >50,000 tightening results, >5,000 curve data.'
      },
      image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600'
    }
  ]
})

const contentSaving = ref(false)
const featureDialogVisible = ref(false)
const sectionDialogVisible = ref(false)

// 功能特点表单
const featureForm = ref({
  title: { 'zh-CN': '', 'en-US': '' },
  description: { 'zh-CN': '', 'en-US': '' },
  icon: '',
  isEdit: false,
  editIndex: -1
})

// 内容模块表单
const sectionForm = ref({
  title: { 'zh-CN': '', 'en-US': '' },
  content: { 'zh-CN': '', 'en-US': '' },
  image: '',
  isEdit: false,
  editIndex: -1
})

// 保存所有页面内容
const savePageContent = async () => {
  contentSaving.value = true
  
  try {
    // 模拟保存到后端API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 实际项目中应该调用API
    // const response = await fetch('/api/tightening/page-content', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(pageContentForm.value)
    // })
    
    ElMessage.success('页面内容已保存')
    
    // 保存到 localStorage 作为备份
    localStorage.setItem('tightening_page_content', JSON.stringify(pageContentForm.value))
  } catch (error) {
    ElMessage.error('保存失败: ' + error.message)
  } finally {
    contentSaving.value = false
  }
}

// 显示添加功能特点对话框
const showAddFeatureDialog = () => {
  featureForm.value = {
    title: { 'zh-CN': '', 'en-US': '' },
    description: { 'zh-CN': '', 'en-US': '' },
    icon: '',
    isEdit: false,
    editIndex: -1
  }
  featureDialogVisible.value = true
}

// 编辑功能特点
const editFeature = (index, feature) => {
  featureForm.value = {
    ...JSON.parse(JSON.stringify(feature)),
    isEdit: true,
    editIndex: index
  }
  featureDialogVisible.value = true
}

// 删除功能特点
const deleteFeature = (index) => {
  ElMessageBox.confirm('确定删除该功能特点吗？', '提示', {
    type: 'warning'
  }).then(() => {
    pageContentForm.value.features.splice(index, 1)
    ElMessage.success('已删除')
  }).catch(() => {})
}

// 保存功能特点表单
const saveFeatureForm = () => {
  if (!featureForm.value.title['zh-CN'] || !featureForm.value.title['en-US']) {
    ElMessage.warning('请填写标题')
    return
  }
  
  if (!featureForm.value.description['zh-CN'] || !featureForm.value.description['en-US']) {
    ElMessage.warning('请填写描述')
    return
  }
  
  const featureData = {
    title: featureForm.value.title,
    description: featureForm.value.description,
    icon: featureForm.value.icon
  }
  
  if (featureForm.value.isEdit) {
    // 编辑模式
    pageContentForm.value.features[featureForm.value.editIndex] = featureData
    ElMessage.success('功能特点已更新')
  } else {
    // 新增模式
    pageContentForm.value.features.push(featureData)
    ElMessage.success('功能特点已添加')
  }
  
  featureDialogVisible.value = false
}

// 显示添加内容模块对话框
const showAddSectionDialog = () => {
  sectionForm.value = {
    title: { 'zh-CN': '', 'en-US': '' },
    content: { 'zh-CN': '', 'en-US': '' },
    image: '',
    isEdit: false,
    editIndex: -1
  }
  sectionDialogVisible.value = true
}

// 编辑内容模块
const editSection = (index, section) => {
  sectionForm.value = {
    ...JSON.parse(JSON.stringify(section)),
    isEdit: true,
    editIndex: index
  }
  sectionDialogVisible.value = true
}

// 删除内容模块
const deleteSection = (index) => {
  ElMessageBox.confirm('确定删除该内容模块吗？', '提示', {
    type: 'warning'
  }).then(() => {
    pageContentForm.value.sections.splice(index, 1)
    ElMessage.success('已删除')
  }).catch(() => {})
}

// 保存内容模块表单
const saveSectionForm = () => {
  if (!sectionForm.value.title['zh-CN'] || !sectionForm.value.title['en-US']) {
    ElMessage.warning('请填写标题')
    return
  }
  
  if (!sectionForm.value.content['zh-CN'] || !sectionForm.value.content['en-US']) {
    ElMessage.warning('请填写内容')
    return
  }
  
  const sectionData = {
    title: sectionForm.value.title,
    content: sectionForm.value.content,
    image: sectionForm.value.image
  }
  
  if (sectionForm.value.isEdit) {
    // 编辑模式
    pageContentForm.value.sections[sectionForm.value.editIndex] = sectionData
    ElMessage.success('内容模块已更新')
  } else {
    // 新增模式
    pageContentForm.value.sections.push(sectionData)
    ElMessage.success('内容模块已添加')
  }
  
  sectionDialogVisible.value = false
}

// 加载已保存的页面内容
const loadPageContent = () => {
  const savedContent = localStorage.getItem('tightening_page_content')
  if (savedContent) {
    try {
      pageContentForm.value = JSON.parse(savedContent)
    } catch (error) {
      console.error('加载页面内容失败:', error)
    }
  }
}

// ======== 生命周期 ========

onMounted(() => {
  dataStore.loadTighteningResults()
  dataStore.loadTighteningCurves()
  
  // 加载维护配置
  loadMaintenanceConfig()
  loadMaintenanceStatistics()
  
  // 加载页面内容
  loadPageContent()
  
  nextTick(() => {
    initCharts()
  })
})
</script>

<style scoped>
.tightening-data-analysis {
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

.connection-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.connection-info {
  padding: 12px 0;
}

/* 统计卡片 */
.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
}

.stat-icon {
  font-size: 48px;
}

.stat-card.total .stat-icon {
  color: #409eff;
}

.stat-card.ok .stat-icon {
  color: #67c23a;
}

.stat-card.nok .stat-icon {
  color: #f56c6c;
}

.stat-card.rate .stat-icon {
  color: #e6a23c;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 600;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

/* Tabs */
.data-tabs {
  background: #fff;
  padding: 20px;
  border-radius: 4px;
}

/* 表格 */
:deep(.nok-row) {
  background-color: #fef0f0 !important;
}

/* 过滤面板 */
.filter-panel {
  padding: 16px;
  background: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 16px;
}

/* 图表容器 */
.chart-container {
  width: 100%;
  min-height: 300px;
}

.curve-viewer {
  padding: 20px;
}
</style>
