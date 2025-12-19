<template>
  <div class="work-order-query">
    <Header />
    
    <!-- 页面头部 -->
    <section class="hero-section">
      <div class="hero-background"></div>
      <div class="container">
        <div class="hero-content">
          <h1><el-icon><Search /></el-icon> 工单查询系统</h1>
          <p class="subtitle">实时查询维修进度、配件状态、物流信息</p>
        </div>
      </div>
    </section>

    <!-- 查询表单 -->
    <section class="query-section">
      <div class="container">
        <el-card class="query-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon><Search /></el-icon>
              <span>请输入查询信息</span>
            </div>
          </template>
          
          <el-form :model="queryForm" :rules="queryRules" ref="queryFormRef" label-width="120px">
            <el-form-item label="查询方式">
              <el-radio-group v-model="queryForm.queryType" @change="handleQueryTypeChange">
                <el-radio-button label="workOrderNo">工单号</el-radio-button>
                <el-radio-button label="phone">手机号</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item 
              v-if="queryForm.queryType === 'workOrderNo'" 
              label="工单号" 
              prop="workOrderNo">
              <el-input 
                v-model="queryForm.workOrderNo" 
                placeholder="请输入工单号，例如：WO202512170001"
                clearable>
                <template #prefix>
                  <el-icon><Document /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item 
              v-if="queryForm.queryType === 'phone'" 
              label="手机号" 
              prop="phone">
              <el-input 
                v-model="queryForm.phone" 
                placeholder="请输入登记时的手机号"
                maxlength="11"
                clearable>
                <template #prefix>
                  <el-icon><Phone /></el-icon>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" :loading="querying" @click="handleQuery" size="large">
                <el-icon><Search /></el-icon>
                查询
              </el-button>
              <el-button @click="handleReset" size="large">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 查询结果 -->
        <div v-if="queryResult" class="result-section">
          <el-card class="result-card" shadow="hover">
            <template #header>
              <div class="result-header">
                <div>
                  <el-icon><DocumentChecked /></el-icon>
                  <span>工单信息</span>
                </div>
                <el-tag :type="getStatusType(queryResult.status)" size="large">
                  {{ queryResult.status }}
                </el-tag>
              </div>
            </template>

            <!-- 工单基本信息 -->
            <el-descriptions :column="2" border>
              <el-descriptions-item label="工单号">
                <el-text type="primary" size="large">{{ queryResult.workOrderNo }}</el-text>
              </el-descriptions-item>
              <el-descriptions-item label="设备名称">
                {{ queryResult.deviceName }}
              </el-descriptions-item>
              <el-descriptions-item label="故障描述">
                {{ queryResult.faultDescription }}
              </el-descriptions-item>
              <el-descriptions-item label="联系人">
                {{ queryResult.contactName }}
              </el-descriptions-item>
              <el-descriptions-item label="联系电话">
                {{ queryResult.contactPhone }}
              </el-descriptions-item>
              <el-descriptions-item label="登记时间">
                {{ queryResult.createTime }}
              </el-descriptions-item>
              <el-descriptions-item label="预计完成时间">
                {{ queryResult.estimatedTime || '待确认' }}
              </el-descriptions-item>
              <el-descriptions-item label="维修人员">
                {{ queryResult.technician || '未分配' }}
              </el-descriptions-item>
            </el-descriptions>
          </el-card>

          <!-- 维修进度时间轴 -->
          <el-card class="timeline-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><Clock /></el-icon>
                <span>维修进度</span>
              </div>
            </template>

            <el-timeline>
              <el-timeline-item 
                v-for="(step, index) in queryResult.repairProgress" 
                :key="index"
                :timestamp="step.time"
                :type="getTimelineType(step.status)"
                :icon="getTimelineIcon(step.status)"
                placement="top">
                <el-card>
                  <h4>{{ step.title }}</h4>
                  <p>{{ step.description }}</p>
                  <el-tag v-if="step.operator" size="small" type="info">
                    操作人：{{ step.operator }}
                  </el-tag>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </el-card>

          <!-- 配件物流信息 -->
          <el-card v-if="queryResult.parts && queryResult.parts.length > 0" class="parts-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><Box /></el-icon>
                <span>配件物流状态</span>
              </div>
            </template>

            <el-table :data="queryResult.parts" border stripe>
              <el-table-column label="配件名称" prop="partName" min-width="150" />
              <el-table-column label="数量" prop="quantity" width="80" align="center" />
              <el-table-column label="合同状态" width="120" align="center">
                <template #default="{ row }">
                  <el-tag :type="row.contractStatus === '已签订' ? 'success' : 'warning'" size="small">
                    {{ row.contractStatus }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="订货状态" width="120" align="center">
                <template #default="{ row }">
                  <el-tag :type="row.orderStatus === '已订货' ? 'success' : 'warning'" size="small">
                    {{ row.orderStatus }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="物流状态" width="120" align="center">
                <template #default="{ row }">
                  <el-tag :type="getLogisticsType(row.logisticsStatus)" size="small">
                    {{ row.logisticsStatus }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="预计到货日期" prop="estimatedArrival" width="140" align="center">
                <template #default="{ row }">
                  <el-text v-if="row.estimatedArrival" type="primary">
                    {{ row.estimatedArrival }}
                  </el-text>
                  <el-text v-else type="info">待确认</el-text>
                </template>
              </el-table-column>
              <el-table-column label="物流单号" prop="trackingNo" width="160" />
              <el-table-column label="操作" width="100" align="center" fixed="right">
                <template #default="{ row }">
                  <el-button 
                    v-if="row.trackingNo" 
                    link 
                    type="primary" 
                    size="small"
                    @click="trackLogistics(row)">
                    追踪物流
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-card>

          <!-- 操作按钮 -->
          <div class="actions">
            <el-button type="primary" @click="printOrder">
              <el-icon><Printer /></el-icon>
              打印工单
            </el-button>
            <el-button @click="exportPDF">
              <el-icon><Download /></el-icon>
              导出PDF
            </el-button>
            <el-button @click="contactService">
              <el-icon><Service /></el-icon>
              联系客服
            </el-button>
          </div>
        </div>

        <!-- 无结果提示 -->
        <el-empty 
          v-if="noResult" 
          description="未查询到相关工单信息"
          :image-size="200">
          <el-button type="primary" @click="handleReset">重新查询</el-button>
        </el-empty>
      </div>
    </section>

    <!-- 物流追踪对话框 -->
    <el-dialog v-model="logisticsDialogVisible" title="物流追踪" width="800px">
      <div v-if="currentPart" class="logistics-detail">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="配件名称">{{ currentPart.partName }}</el-descriptions-item>
          <el-descriptions-item label="物流单号">{{ currentPart.trackingNo }}</el-descriptions-item>
          <el-descriptions-item label="物流公司">{{ currentPart.logisticsCompany }}</el-descriptions-item>
          <el-descriptions-item label="当前状态">
            <el-tag :type="getLogisticsType(currentPart.logisticsStatus)">
              {{ currentPart.logisticsStatus }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <div class="logistics-timeline">
          <h3>物流轨迹</h3>
          <el-timeline>
            <el-timeline-item 
              v-for="(track, index) in currentPart.logisticsTrack" 
              :key="index"
              :timestamp="track.time"
              placement="top">
              {{ track.location }} - {{ track.status }}
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-dialog>

    <Footer />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'

// 表单数据
const queryForm = reactive({
  queryType: 'workOrderNo',
  workOrderNo: '',
  phone: ''
})

// 表单验证规则
const queryRules = {
  workOrderNo: [
    { required: true, message: '请输入工单号', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

const queryFormRef = ref(null)
const querying = ref(false)
const queryResult = ref(null)
const noResult = ref(false)
const logisticsDialogVisible = ref(false)
const currentPart = ref(null)

// 模拟工单数据库
const mockWorkOrders = [
  {
    workOrderNo: 'WO202512170001',
    deviceName: '拧紧工具PF4000',
    faultDescription: '工具无法启动，显示屏无显示',
    contactName: '张三',
    contactPhone: '13800138000',
    createTime: '2025-12-17 09:00:00',
    estimatedTime: '2025-12-20 17:00:00',
    technician: '李工',
    status: '等待装配',
    repairProgress: [
      {
        title: '工单创建',
        description: '客户提交故障报修申请',
        time: '2025-12-17 09:00:00',
        status: 'success',
        operator: '系统'
      },
      {
        title: '等待拆检',
        description: '已分配维修人员，等待拆检确认故障',
        time: '2025-12-17 10:30:00',
        status: 'success',
        operator: '李工'
      },
      {
        title: '等待确认维修',
        description: '拆检完成，已向客户发送维修方案，等待确认',
        time: '2025-12-17 14:20:00',
        status: 'success',
        operator: '李工'
      },
      {
        title: '等待配件',
        description: '客户已确认维修方案，等待配件到货',
        time: '2025-12-18 09:00:00',
        status: 'success',
        operator: '李工'
      },
      {
        title: '等待装配',
        description: '配件已到货，等待装配',
        time: '2025-12-19 10:00:00',
        status: 'primary',
        operator: '李工'
      },
      {
        title: '等待检测验收',
        description: '装配完成，等待检测验收',
        time: '',
        status: 'info',
        operator: ''
      },
      {
        title: '送货中',
        description: '验收合格，正在配送',
        time: '',
        status: 'info',
        operator: ''
      },
      {
        title: '已交货',
        description: '设备已交付客户',
        time: '',
        status: 'info',
        operator: ''
      }
    ],
    parts: [
      {
        partName: '主控板',
        quantity: 1,
        contractStatus: '已签订',
        orderStatus: '已订货',
        logisticsStatus: '已到货',
        estimatedArrival: '2025-12-19',
        trackingNo: 'SF1234567890',
        logisticsCompany: '顺丰速运',
        logisticsTrack: [
          { time: '2025-12-19 08:30:00', location: '北京市朝阳区仓库', status: '已签收' },
          { time: '2025-12-18 20:15:00', location: '北京市朝阳区配送中心', status: '派送中' },
          { time: '2025-12-18 10:20:00', location: '北京分拨中心', status: '到达处理中心' },
          { time: '2025-12-17 22:30:00', location: '上海分拨中心', status: '发往北京' },
          { time: '2025-12-17 15:00:00', location: '上海市浦东新区', status: '已揽收' }
        ]
      },
      {
        partName: '显示屏',
        quantity: 1,
        contractStatus: '已签订',
        orderStatus: '已订货',
        logisticsStatus: '运输中',
        estimatedArrival: '2025-12-20',
        trackingNo: 'YTO9876543210',
        logisticsCompany: '圆通速递',
        logisticsTrack: [
          { time: '2025-12-19 14:20:00', location: '天津分拨中心', status: '到达处理中心' },
          { time: '2025-12-18 18:45:00', location: '石家庄分拨中心', status: '发往天津' },
          { time: '2025-12-18 09:00:00', location: '深圳市宝安区', status: '已揽收' }
        ]
      }
    ]
  },
  {
    workOrderNo: 'WO202512170002',
    deviceName: '套筒工具',
    faultDescription: '套筒磨损严重',
    contactName: '李四',
    contactPhone: '13900139000',
    createTime: '2025-12-17 11:00:00',
    estimatedTime: '2025-12-19 17:00:00',
    technician: '王工',
    status: '等待确认维修',
    repairProgress: [
      {
        title: '工单创建',
        description: '客户提交故障报修申请',
        time: '2025-12-17 11:00:00',
        status: 'success',
        operator: '系统'
      },
      {
        title: '等待拆检',
        description: '已完成拆检，确认需要更换套筒',
        time: '2025-12-17 14:00:00',
        status: 'success',
        operator: '王工'
      },
      {
        title: '等待确认维修',
        description: '已发送维修报价，等待客户确认',
        time: '2025-12-17 15:30:00',
        status: 'primary',
        operator: '王工'
      }
    ],
    parts: [
      {
        partName: '六角套筒19mm',
        quantity: 2,
        contractStatus: '等待合同',
        orderStatus: '未订货',
        logisticsStatus: '待发货',
        estimatedArrival: '',
        trackingNo: '',
        logisticsCompany: ''
      }
    ]
  }
]

// 查询类型改变
const handleQueryTypeChange = () => {
  queryFormRef.value?.clearValidate()
  queryForm.workOrderNo = ''
  queryForm.phone = ''
  queryResult.value = null
  noResult.value = false
}

// 查询工单
const handleQuery = async () => {
  try {
    await queryFormRef.value.validate()
    
    querying.value = true
    
    // 模拟网络请求延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    
    let result = null
    
    if (queryForm.queryType === 'workOrderNo') {
      // 按工单号查询
      result = mockWorkOrders.find(order => order.workOrderNo === queryForm.workOrderNo)
    } else {
      // 按手机号查询（可能有多个工单，这里返回最新的）
      const orders = mockWorkOrders.filter(order => order.contactPhone === queryForm.phone)
      result = orders.length > 0 ? orders[orders.length - 1] : null
    }
    
    if (result) {
      queryResult.value = result
      noResult.value = false
      ElMessage.success('查询成功')
    } else {
      queryResult.value = null
      noResult.value = true
      ElMessage.warning('未查询到相关工单信息')
    }
  } catch (error) {
    console.log('验证失败:', error)
  } finally {
    querying.value = false
  }
}

// 重置表单
const handleReset = () => {
  queryFormRef.value?.resetFields()
  queryResult.value = null
  noResult.value = false
}

// 获取状态类型
const getStatusType = (status) => {
  const typeMap = {
    '等待拆检': 'info',
    '等待确认维修': 'warning',
    '等待配件': 'warning',
    '等待装配': 'primary',
    '等待检测验收': 'primary',
    '送货中': 'success',
    '已交货': 'success'
  }
  return typeMap[status] || 'info'
}

// 获取时间轴类型
const getTimelineType = (status) => {
  const typeMap = {
    'success': 'success',
    'primary': 'primary',
    'info': 'info'
  }
  return typeMap[status] || 'info'
}

// 获取时间轴图标
const getTimelineIcon = (status) => {
  return status === 'success' ? 'CircleCheck' : (status === 'primary' ? 'Clock' : 'More')
}

// 获取物流状态类型
const getLogisticsType = (status) => {
  const typeMap = {
    '待发货': 'info',
    '运输中': 'warning',
    '已到货': 'success'
  }
  return typeMap[status] || 'info'
}

// 追踪物流
const trackLogistics = (part) => {
  currentPart.value = part
  logisticsDialogVisible.value = true
}

// 打印工单
const printOrder = () => {
  window.print()
}

// 导出PDF
const exportPDF = () => {
  ElMessage.info('PDF导出功能开发中...')
}

// 联系客服
const contactService = () => {
  ElMessageBox.alert('客服电话：400-123-4567\n工作时间：周一至周五 9:00-18:00', '联系客服', {
    confirmButtonText: '知道了'
  })
}
</script>

<style scoped>
.work-order-query {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 头部区域 */
.hero-section {
  position: relative;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 0 60px;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
  background: url('data:image/svg+xml,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="white" opacity="0.1"/><circle cx="25" cy="25" r="20" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="20" fill="white" opacity="0.1"/></svg>');
}

.hero-content {
  position: relative;
  text-align: center;
  color: #fff;
}

.hero-content h1 {
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.hero-content .subtitle {
  font-size: 20px;
  opacity: 0.95;
}

/* 查询区域 */
.query-section {
  padding: 40px 0 80px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.query-card {
  margin-bottom: 32px;
  border-radius: 12px;
  margin-top: -60px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

/* 结果区域 */
.result-section {
  margin-top: 32px;
}

.result-card,
.timeline-card,
.parts-card {
  margin-bottom: 24px;
  border-radius: 12px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.result-header > div {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
}

/* 物流追踪 */
.logistics-detail {
  padding: 20px 0;
}

.logistics-timeline {
  margin-top: 30px;
}

.logistics-timeline h3 {
  margin-bottom: 20px;
  font-size: 18px;
  color: #333;
}

/* 操作按钮 */
.actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 32px;
  padding: 24px;
  background: #fff;
  border-radius: 12px;
}

/* 响应式 */
@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 32px;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .actions .el-button {
    width: 100%;
  }
}

/* 打印样式 */
@media print {
  .hero-section,
  .query-card,
  .actions,
  header,
  footer {
    display: none !important;
  }
  
  .result-section {
    margin-top: 0;
  }
}
</style>
