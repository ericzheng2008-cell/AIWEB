<template>
  <div class="statistics-widget">
    <el-row :gutter="16">
      <el-col :span="12">
        <div class="stat-card total">
          <div class="stat-icon">
            <el-icon :size="32"><Odometer /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ data.total || 0 }}</div>
            <div class="stat-label">总拧紧数</div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="stat-card ok">
          <div class="stat-icon">
            <el-icon :size="32"><CircleCheck /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ data.ok || 0 }}</div>
            <div class="stat-label">OK数量</div>
            <div class="stat-rate ok-rate">{{ data.okRate || 0 }}%</div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="stat-card nok">
          <div class="stat-icon">
            <el-icon :size="32"><CircleClose /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ data.nok || 0 }}</div>
            <div class="stat-label">NOK数量</div>
            <div class="stat-rate nok-rate">{{ data.nokRate || 0 }}%</div>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="stat-card avg">
          <div class="stat-icon">
            <el-icon :size="32"><TrendCharts /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ data.avgTorque || 0 }}</div>
            <div class="stat-label">平均扭矩 (Nm)</div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { Odometer, CircleCheck, CircleClose, TrendCharts } from '@element-plus/icons-vue'

defineProps({
  widget: {
    type: Object,
    required: true
  },
  data: {
    type: Object,
    default: () => ({
      total: 0,
      ok: 0,
      nok: 0,
      okRate: 0,
      nokRate: 0,
      avgTorque: 0
    })
  }
})
</script>

<style scoped lang="scss">
.statistics-widget {
  height: 100%;
  display: flex;
  align-items: center;

  .stat-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 12px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    &.total {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    &.ok {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
    }

    &.nok {
      background: linear-gradient(135deg, #f43f5e 0%, #dc2626 100%);
      color: white;
    }

    &.avg {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
    }

    .stat-icon {
      opacity: 0.9;
    }

    .stat-info {
      flex: 1;

      .stat-value {
        font-size: 28px;
        font-weight: 700;
        line-height: 1;
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 12px;
        opacity: 0.9;
      }

      .stat-rate {
        font-size: 14px;
        font-weight: 600;
        margin-top: 4px;
        padding: 2px 8px;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.2);
        display: inline-block;
      }
    }
  }
}
</style>
