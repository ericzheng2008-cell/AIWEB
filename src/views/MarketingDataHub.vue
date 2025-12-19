<template>
  <div class="marketing-data-hub">
    <!-- 顶部KPI卡片 -->
    <div class="kpi-cards">
      <el-row :gutter="20">
        <el-col :span="6" v-for="kpi in kpiMetrics" :key="kpi.id">
          <el-card class="kpi-card" :class="kpi.trend">
            <div class="kpi-header">
              <span class="kpi-label">{{ $t(`dataHub.${kpi.label}`) }}</span>
              <i :class="kpi.icon" :style="{ color: kpi.color }"></i>
            </div>
            <div class="kpi-value">
              <span class="value">{{ formatNumber(kpi.value) }}</span>
              <span class="unit">{{ kpi.unit }}</span>
            </div>
            <div class="kpi-footer">
              <el-tag :type="kpi.trend === 'up' ? 'success' : 'danger'" size="small">
                <i :class="kpi.trend === 'up' ? 'el-icon-top' : 'el-icon-bottom'"></i>
                {{ kpi.change }}%
              </el-tag>
              <span class="period">{{ $t('dataHub.vsLastMonth') }}</span>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 数据可视化看板 -->
    <el-row :gutter="20" style="margin-top: 20px">
      <!-- 左侧：转化漏斗与趋势 -->
      <el-col :span="16">
        <!-- 转化漏斗 -->
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>{{ $t('dataHub.conversionFunnel') }}</span>
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                :range-separator="$t('common.to')"
                :start-placeholder="$t('common.startDate')"
                :end-placeholder="$t('common.endDate')"
                size="small"
                @change="refreshData"
              />
            </div>
          </template>
          <div id="funnelChart" style="height: 400px"></div>
        </el-card>

        <!-- 趋势图 -->
        <el-card class="chart-card" style="margin-top: 20px">
          <template #header>
            <div class="card-header">
              <span>{{ $t('dataHub.trafficTrend') }}</span>
              <el-radio-group v-model="trendPeriod" size="small" @change="updateTrendChart">
                <el-radio-button label="7d">{{ $t('dataHub.last7Days') }}</el-radio-button>
                <el-radio-button label="30d">{{ $t('dataHub.last30Days') }}</el-radio-button>
                <el-radio-button label="90d">{{ $t('dataHub.last90Days') }}</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div id="trendChart" style="height: 350px"></div>
        </el-card>

        <!-- 渠道效果对比 -->
        <el-card class="chart-card" style="margin-top: 20px">
          <template #header>
            <span>{{ $t('dataHub.channelPerformance') }}</span>
          </template>
          <el-table :data="channelData" style="width: 100%">
            <el-table-column prop="channel" :label="$t('dataHub.channel')" width="150">
              <template #default="{ row }">
                <div class="channel-name">
                  <i :class="row.icon" :style="{ color: row.color }"></i>
                  <span>{{ row.channel }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="visits" :label="$t('dataHub.visits')" width="120" sortable />
            <el-table-column prop="leads" :label="$t('dataHub.leads')" width="120" sortable />
            <el-table-column prop="conversions" :label="$t('dataHub.conversions')" width="120" sortable />
            <el-table-column prop="conversionRate" :label="$t('dataHub.conversionRate')" width="120" sortable>
              <template #default="{ row }">
                <el-progress :percentage="parseFloat(row.conversionRate)" :color="getProgressColor(row.conversionRate)" />
              </template>
            </el-table-column>
            <el-table-column prop="cost" :label="$t('dataHub.cost')" width="120" sortable>
              <template #default="{ row }">¥{{ formatNumber(row.cost) }}</template>
            </el-table-column>
            <el-table-column prop="roi" :label="$t('dataHub.roi')" sortable>
              <template #default="{ row }">
                <el-tag :type="row.roi > 200 ? 'success' : row.roi > 100 ? 'warning' : 'danger'">
                  {{ row.roi }}%
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 右侧：实时数据流 -->
      <el-col :span="8">
        <!-- 实时访客 -->
        <el-card class="realtime-card">
          <template #header>
            <div class="card-header">
              <span>{{ $t('dataHub.realtimeVisitors') }}</span>
              <el-badge :value="realtimeVisitors" class="item">
                <i class="el-icon-view"></i>
              </el-badge>
            </div>
          </template>
          <div class="realtime-list">
            <div v-for="visitor in recentVisitors" :key="visitor.id" class="visitor-item">
              <div class="visitor-header">
                <el-avatar :size="32" :src="visitor.avatar">
                  <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                </el-avatar>
                <div class="visitor-info">
                  <span class="visitor-location">{{ visitor.location }}</span>
                  <span class="visitor-time">{{ visitor.time }}</span>
                </div>
              </div>
              <div class="visitor-activity">
                <el-tag size="small" type="info">{{ visitor.page }}</el-tag>
                <span class="visitor-action">{{ visitor.action }}</span>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 热门页面 -->
        <el-card class="popular-pages-card" style="margin-top: 20px">
          <template #header>
            <span>{{ $t('dataHub.popularPages') }}</span>
          </template>
          <div class="pages-list">
            <div v-for="(page, index) in popularPages" :key="page.url" class="page-item">
              <div class="page-rank">{{ index + 1 }}</div>
              <div class="page-info">
                <div class="page-title">{{ page.title }}</div>
                <div class="page-stats">
                  <span><i class="el-icon-view"></i> {{ formatNumber(page.views) }}</span>
                  <span><i class="el-icon-time"></i> {{ page.avgTime }}s</span>
                </div>
              </div>
              <el-progress
                :percentage="page.bounceRate"
                :color="getBounceRateColor(page.bounceRate)"
                :format="() => `${page.bounceRate}%`"
                style="width: 100px"
              />
            </div>
          </div>
        </el-card>

        <!-- 地域分布 -->
        <el-card class="geo-card" style="margin-top: 20px">
          <template #header>
            <span>{{ $t('dataHub.geoDistribution') }}</span>
          </template>
          <div id="geoChart" style="height: 300px"></div>
        </el-card>

        <!-- 设备分布 -->
        <el-card class="device-card" style="margin-top: 20px">
          <template #header>
            <span>{{ $t('dataHub.deviceDistribution') }}</span>
          </template>
          <div id="deviceChart" style="height: 250px"></div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 数据导出 -->
    <el-row style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>{{ $t('dataHub.dataExport') }}</span>
              <div>
                <el-button size="small" @click="exportExcel">
                  <i class="el-icon-download"></i> {{ $t('dataHub.exportExcel') }}
                </el-button>
                <el-button size="small" @click="exportPDF">
                  <i class="el-icon-document"></i> {{ $t('dataHub.exportPDF') }}
                </el-button>
                <el-button size="small" type="primary" @click="scheduleReport">
                  <i class="el-icon-message"></i> {{ $t('dataHub.scheduleReport') }}
                </el-button>
              </div>
            </div>
          </template>
          <el-form :inline="true" size="small">
            <el-form-item :label="$t('dataHub.reportType')">
              <el-select v-model="exportConfig.type" :placeholder="$t('dataHub.selectType')">
                <el-option label="营销概览报告" value="overview" />
                <el-option label="渠道效果报告" value="channel" />
                <el-option label="转化分析报告" value="conversion" />
                <el-option label="用户行为报告" value="behavior" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('dataHub.timeRange')">
              <el-date-picker
                v-model="exportConfig.dateRange"
                type="daterange"
                :range-separator="$t('common.to')"
                :start-placeholder="$t('common.startDate')"
                :end-placeholder="$t('common.endDate')"
              />
            </el-form-item>
            <el-form-item :label="$t('dataHub.dimensions')">
              <el-select v-model="exportConfig.dimensions" multiple :placeholder="$t('dataHub.selectDimensions')">
                <el-option label="渠道" value="channel" />
                <el-option label="地域" value="geo" />
                <el-option label="设备" value="device" />
                <el-option label="时间" value="time" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  name: 'MarketingDataHub',
  
  data() {
    return {
      dateRange: [
        new Date(new Date().setDate(new Date().getDate() - 30)),
        new Date()
      ],
      trendPeriod: '30d',
      realtimeVisitors: 42,

      // KPI指标
      kpiMetrics: [
        {
          id: 1,
          label: 'totalVisits',
          value: 125860,
          unit: '',
          change: 15.3,
          trend: 'up',
          icon: 'el-icon-view',
          color: '#409eff'
        },
        {
          id: 2,
          label: 'totalLeads',
          value: 3245,
          unit: '',
          change: 22.7,
          trend: 'up',
          icon: 'el-icon-user',
          color: '#67c23a'
        },
        {
          id: 3,
          label: 'conversionRate',
          value: 2.58,
          unit: '%',
          change: 8.2,
          trend: 'up',
          icon: 'el-icon-s-data',
          color: '#e6a23c'
        },
        {
          id: 4,
          label: 'avgROI',
          value: 385,
          unit: '%',
          change: -3.5,
          trend: 'down',
          icon: 'el-icon-coin',
          color: '#f56c6c'
        }
      ],

      // 渠道数据
      channelData: [
        {
          channel: 'Google Ads',
          icon: 'el-icon-search',
          color: '#4285f4',
          visits: 45620,
          leads: 1256,
          conversions: 342,
          conversionRate: '2.75',
          cost: 125000,
          roi: 450
        },
        {
          channel: 'LinkedIn',
          icon: 'el-icon-share',
          color: '#0077b5',
          visits: 28340,
          leads: 892,
          conversions: 215,
          conversionRate: '3.15',
          cost: 68000,
          roi: 520
        },
        {
          channel: 'Alibaba',
          icon: 'el-icon-shopping-cart-2',
          color: '#ff6a00',
          visits: 32150,
          leads: 1120,
          conversions: 287,
          conversionRate: '3.48',
          cost: 85000,
          roi: 380
        },
        {
          channel: 'SEO Organic',
          icon: 'el-icon-document',
          color: '#67c23a',
          visits: 19750,
          leads: 625,
          conversions: 168,
          conversionRate: '3.16',
          cost: 15000,
          roi: 1250
        }
      ],

      // 实时访客
      recentVisitors: [
        {
          id: 1,
          location: 'USA, New York',
          time: '2分钟前',
          page: '产品页',
          action: '下载白皮书',
          avatar: null
        },
        {
          id: 2,
          location: 'Germany, Berlin',
          time: '5分钟前',
          page: 'AI选型器',
          action: '请求报价',
          avatar: null
        },
        {
          id: 3,
          location: 'Japan, Tokyo',
          time: '8分钟前',
          page: '资源中心',
          action: '观看视频',
          avatar: null
        }
      ],

      // 热门页面
      popularPages: [
        { url: '/products', title: '产品中心', views: 45620, avgTime: 185, bounceRate: 32 },
        { url: '/ai-selector', title: 'AI智能选型', views: 28340, avgTime: 245, bounceRate: 25 },
        { url: '/resources', title: '资源中心', views: 21560, avgTime: 320, bounceRate: 18 },
        { url: '/solutions', title: '解决方案', views: 18920, avgTime: 210, bounceRate: 28 },
        { url: '/about', title: '关于我们', views: 12450, avgTime: 95, bounceRate: 45 }
      ],

      // 导出配置
      exportConfig: {
        type: 'overview',
        dateRange: [],
        dimensions: []
      },

      // ECharts实例
      charts: {
        funnel: null,
        trend: null,
        geo: null,
        device: null
      }
    }
  },

  mounted() {
    this.initCharts()
    this.startRealtimeUpdate()
  },

  beforeUnmount() {
    this.stopRealtimeUpdate()
    Object.values(this.charts).forEach(chart => {
      if (chart) chart.dispose()
    })
  },

  methods: {
    // 初始化图表
    initCharts() {
      this.initFunnelChart()
      this.initTrendChart()
      this.initGeoChart()
      this.initDeviceChart()
    },

    // 转化漏斗图
    initFunnelChart() {
      const chartDom = document.getElementById('funnelChart')
      this.charts.funnel = echarts.init(chartDom)

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        series: [
          {
            type: 'funnel',
            left: '10%',
            width: '80%',
            label: {
              position: 'inside',
              formatter: '{b}: {c}',
              fontSize: 14
            },
            labelLine: {
              show: false
            },
            itemStyle: {
              borderWidth: 0
            },
            emphasis: {
              label: {
                fontSize: 16
              }
            },
            data: [
              { value: 125860, name: '访问' },
              { value: 52340, name: '浏览产品' },
              { value: 18920, name: '下载资源' },
              { value: 8456, name: '请求报价' },
              { value: 3245, name: '成为线索' },
              { value: 1012, name: '成交客户' }
            ]
          }
        ]
      }

      this.charts.funnel.setOption(option)
    },

    // 趋势图
    initTrendChart() {
      const chartDom = document.getElementById('trendChart')
      this.charts.trend = echarts.init(chartDom)

      const dates = this.getLast30Days()
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          data: ['访问量', '线索数', '转化数']
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dates
        },
        yAxis: [
          {
            type: 'value',
            name: '访问量',
            position: 'left'
          },
          {
            type: 'value',
            name: '转化数',
            position: 'right'
          }
        ],
        series: [
          {
            name: '访问量',
            type: 'line',
            smooth: true,
            data: this.generateTrendData(30, 3000, 5000),
            areaStyle: {
              opacity: 0.3
            }
          },
          {
            name: '线索数',
            type: 'line',
            smooth: true,
            data: this.generateTrendData(30, 80, 150),
            yAxisIndex: 1
          },
          {
            name: '转化数',
            type: 'line',
            smooth: true,
            data: this.generateTrendData(30, 20, 40),
            yAxisIndex: 1
          }
        ]
      }

      this.charts.trend.setOption(option)
    },

    // 地域分布图
    initGeoChart() {
      const chartDom = document.getElementById('geoChart')
      this.charts.geo = echarts.init(chartDom)

      const option = {
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              formatter: '{b}: {d}%'
            },
            data: [
              { value: 35, name: 'USA' },
              { value: 25, name: 'Germany' },
              { value: 15, name: 'Japan' },
              { value: 10, name: 'UK' },
              { value: 8, name: 'France' },
              { value: 7, name: 'Other' }
            ]
          }
        ]
      }

      this.charts.geo.setOption(option)
    },

    // 设备分布图
    initDeviceChart() {
      const chartDom = document.getElementById('deviceChart')
      this.charts.device = echarts.init(chartDom)

      const option = {
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            type: 'pie',
            radius: '70%',
            data: [
              { value: 58, name: 'Desktop', itemStyle: { color: '#5470c6' } },
              { value: 32, name: 'Mobile', itemStyle: { color: '#91cc75' } },
              { value: 10, name: 'Tablet', itemStyle: { color: '#fac858' } }
            ],
            label: {
              formatter: '{b}: {d}%'
            }
          }
        ]
      }

      this.charts.device.setOption(option)
    },

    // 更新趋势图
    updateTrendChart() {
      // 根据选择的时间段更新数据
      this.initTrendChart()
    },

    // 刷新数据
    refreshData() {
      this.$message.success(this.$t('dataHub.dataRefreshed'))
      this.initCharts()
    },

    // 开始实时更新
    startRealtimeUpdate() {
      this.realtimeTimer = setInterval(() => {
        // 模拟实时数据更新
        this.realtimeVisitors = Math.floor(Math.random() * 50) + 30
      }, 5000)
    },

    // 停止实时更新
    stopRealtimeUpdate() {
      if (this.realtimeTimer) {
        clearInterval(this.realtimeTimer)
      }
    },

    // 导出Excel
    exportExcel() {
      this.$message.success(this.$t('dataHub.exportingExcel'))
    },

    // 导出PDF
    exportPDF() {
      this.$message.success(this.$t('dataHub.exportingPDF'))
    },

    // 定时报告
    scheduleReport() {
      this.$message.success(this.$t('dataHub.reportScheduled'))
    },

    // 格式化数字
    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },

    // 获取进度条颜色
    getProgressColor(rate) {
      const value = parseFloat(rate)
      if (value >= 3) return '#67c23a'
      if (value >= 2) return '#e6a23c'
      return '#f56c6c'
    },

    // 获取跳出率颜色
    getBounceRateColor(rate) {
      if (rate <= 30) return '#67c23a'
      if (rate <= 50) return '#e6a23c'
      return '#f56c6c'
    },

    // 获取最近30天日期
    getLast30Days() {
      const dates = []
      for (let i = 29; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        dates.push(`${date.getMonth() + 1}/${date.getDate()}`)
      }
      return dates
    },

    // 生成趋势数据
    generateTrendData(days, min, max) {
      const data = []
      for (let i = 0; i < days; i++) {
        data.push(Math.floor(Math.random() * (max - min + 1)) + min)
      }
      return data
    }
  }
}
</script>

<style scoped>
.marketing-data-hub {
  padding: 20px;
  background: #f5f7fa;
}

.kpi-card {
  transition: all 0.3s;
}

.kpi-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.kpi-label {
  font-size: 14px;
  color: #606266;
}

.kpi-header i {
  font-size: 24px;
}

.kpi-value {
  margin-bottom: 10px;
}

.kpi-value .value {
  font-size: 32px;
  font-weight: bold;
  color: #303133;
}

.kpi-value .unit {
  font-size: 18px;
  color: #909399;
  margin-left: 5px;
}

.kpi-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.period {
  font-size: 12px;
  color: #909399;
}

.chart-card {
  margin-bottom: 0;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.channel-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.channel-name i {
  font-size: 20px;
}

.realtime-list {
  max-height: 400px;
  overflow-y: auto;
}

.visitor-item {
  padding: 15px;
  border-bottom: 1px solid #ebeef5;
}

.visitor-item:last-child {
  border-bottom: none;
}

.visitor-header {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.visitor-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.visitor-location {
  font-weight: bold;
  font-size: 14px;
}

.visitor-time {
  font-size: 12px;
  color: #909399;
}

.visitor-activity {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.visitor-action {
  font-size: 12px;
  color: #606266;
}

.pages-list {
  max-height: 350px;
  overflow-y: auto;
}

.page-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-bottom: 1px solid #ebeef5;
}

.page-item:last-child {
  border-bottom: none;
}

.page-rank {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #409eff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.page-info {
  flex: 1;
}

.page-title {
  font-weight: bold;
  margin-bottom: 5px;
}

.page-stats {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #909399;
}

.page-stats i {
  margin-right: 3px;
}
</style>
