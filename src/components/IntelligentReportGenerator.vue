<template>
  <div class="intelligent-report-generator">
    <el-card class="header-card">
      <template #header>
        <div class="card-header">
          <el-icon><Document /></el-icon>
          <span>智能报告生成器</span>
          <el-tag type="info">AI v3.0</el-tag>
        </div>
      </template>

      <el-row :gutter="20">
        <el-col :span="6">
          <el-button 
            type="primary" 
            :icon="Calendar" 
            @click="generateReport('weekly')"
            :loading="generating && currentType === 'weekly'"
          >
            生成周报
          </el-button>
        </el-col>
        <el-col :span="6">
          <el-button 
            type="success" 
            :icon="Calendar" 
            @click="generateReport('monthly')"
            :loading="generating && currentType === 'monthly'"
          >
            生成月报
          </el-button>
        </el-col>
        <el-col :span="6">
          <el-button 
            type="warning" 
            :icon="TrendCharts" 
            @click="generateReport('executive')"
            :loading="generating && currentType === 'executive'"
          >
            高层汇报
          </el-button>
        </el-col>
        <el-col :span="6">
          <el-button 
            type="info" 
            :icon="Download" 
            @click="exportReport"
            :disabled="!currentReport"
          >
            导出报告
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 报告预览 -->
    <el-card v-if="currentReport" class="report-preview">
      <template #header>
        <div class="card-header">
          <el-icon><Reading /></el-icon>
          <span>{{ currentReport.title }}</span>
          <el-tag size="small">{{ currentReport.generatedAt }}</el-tag>
        </div>
      </template>

      <!-- Markdown渲染 -->
      <div class="report-content" v-html="renderedMarkdown"></div>
    </el-card>

    <!-- 历史报告 -->
    <el-card class="history-card">
      <template #header>
        <div class="card-header">
          <el-icon><Clock /></el-icon>
          <span>历史报告</span>
        </div>
      </template>

      <el-table :data="reportHistory" stripe>
        <el-table-column prop="title" label="报告标题" width="300" />
        <el-table-column label="类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getReportTypeTag(row.type)" size="small">
              {{ getReportTypeName(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="generatedAt" label="生成时间" width="180" />
        <el-table-column label="项目数" width="100">
          <template #default="{ row }">
            {{ row.projectCount }}
          </el-table-column>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button 
              type="primary" 
              link 
              :icon="View" 
              @click="viewReport(row)"
            >
              查看
            </el-button>
            <el-button 
              type="success" 
              link 
              :icon="Download" 
              @click="downloadReport(row)"
            >
              下载
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  Document, Calendar, TrendCharts, Download, Reading, 
  Clock, View 
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { marked } from 'marked'

// ========== 数据定义 ==========
const generating = ref(false)
const currentType = ref('')
const currentReport = ref(null)
const reportHistory = ref([])

// 模拟项目数据
const projects = ref([
  {
    id: 1,
    name: '明升AICRM V4.0',
    status: '进行中',
    progress: 65,
    budget: 1500000,
    spent: 1020000,
    risk: '中',
    teamSize: 10
  },
  {
    id: 2,
    name: '智能算账系统',
    status: '进行中',
    progress: 85,
    budget: 800000,
    spent: 680000,
    risk: '低',
    teamSize: 6
  },
  {
    id: 3,
    name: '投标预测AI',
    status: '进行中',
    progress: 70,
    budget: 1000000,
    spent: 850000,
    risk: '中',
    teamSize: 8
  }
])

// ========== 报告生成逻辑 ==========
const generateWeeklyReport = () => {
  const now = new Date()
  const weekNumber = Math.ceil((now - new Date(now.getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000))
  
  const normalProjects = projects.value.filter(p => p.risk === '低').length
  const riskProjects = projects.value.filter(p => p.risk === '中').length
  const delayProjects = projects.value.filter(p => p.risk === '高').length
  
  const totalBudget = projects.value.reduce((sum, p) => sum + p.budget, 0)
  const totalSpent = projects.value.reduce((sum, p) => sum + p.spent, 0)
  
  const report = `# 📊 项目周报

**报告周期**：${now.getFullYear()}年第${weekNumber}周  
**生成时间**：${formatDateTime(now)}  
**AI分析引擎**：AIPM v3.0

---

## 📈 本周概况

- **总项目数**：${projects.value.length}个
- **正常项目**：${normalProjects}个 (${((normalProjects / projects.value.length) * 100).toFixed(1)}%)
- **风险项目**：${riskProjects}个 (${((riskProjects / projects.value.length) * 100).toFixed(1)}%)
- **延误项目**：${delayProjects}个 (${((delayProjects / projects.value.length) * 100).toFixed(1)}%)
- **完成里程碑**：5个

---

## 🎯 关键成果

${projects.value.filter(p => p.progress >= 80).map((p, i) => 
  `${i + 1}. ✅ ${p.name}完成重要里程碑`
).join('\n') || '1. ✅ 本周各项目稳步推进'}

---

## ⚠️ 风险预警（Top 3）

${projects.value
  .filter(p => p.risk !== '低')
  .slice(0, 3)
  .map((p, i) => {
    const progressGap = Math.round((70 - p.progress) * 0.3)
    return `${i + 1}. **【${p.risk}风险】${p.name}**
   - 当前进度：${p.progress}% (计划70%)
   - 延误风险：${60 + progressGap}分
   - 预计延误：${Math.max(0, progressGap)}天
   - **AI建议**：增加2名开发人员，可缩短工期${Math.round(progressGap * 0.6)}天`
  })
  .join('\n\n')}

---

## 📅 下周计划

${projects.value.map((p, i) => 
  `- [ ] ${p.name}完成核心功能开发`
).join('\n')}

---

## 💡 AI优化建议

1. **资源调配**：建议将已完成项目的成员调至风险项目
2. **关键路径优化**：部分项目可并行执行，节省工期
3. **成本控制**：当前总支出${formatCurrency(totalSpent)}，预算${formatCurrency(totalBudget)}，控制良好

---

**报告生成人**：AIPM智能助手  
**审核建议**：请重点关注中高风险项目的资源调配
`

  return report
}

const generateMonthlyReport = () => {
  const now = new Date()
  const monthNames = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
  
  const totalBudget = projects.value.reduce((sum, p) => sum + p.budget, 0)
  const totalSpent = projects.value.reduce((sum, p) => sum + p.spent, 0)
  const avgProgress = projects.value.reduce((sum, p) => sum + p.progress, 0) / projects.value.length
  
  const report = `# 📊 项目月度运营报告

**报告月份**：${now.getFullYear()}年${monthNames[now.getMonth()]}月  
**生成时间**：${formatDateTime(now)}

---

## 📈 月度总览

| 指标 | 计划 | 实际 | 达成率 |
|------|------|------|--------|
| 项目启动数 | 5 | ${projects.value.length} | ${(projects.value.length / 5 * 100).toFixed(0)}% |
| 项目完成数 | 3 | ${projects.value.filter(p => p.progress >= 100).length} | ${(projects.value.filter(p => p.progress >= 100).length / 3 * 100).toFixed(0)}% |
| 里程碑达成 | 15 | 13 | 87% |
| 预算使用 | ${formatCurrency(totalBudget)} | ${formatCurrency(totalSpent)} | ${((totalSpent / totalBudget) * 100).toFixed(0)}% |

---

## 🎯 项目健康度分析

- **优秀项目**：${projects.value.filter(p => p.risk === '低').length}个 (${((projects.value.filter(p => p.risk === '低').length / projects.value.length) * 100).toFixed(0)}%)
- **正常项目**：${projects.value.filter(p => p.risk === '中').length}个 (${((projects.value.filter(p => p.risk === '中').length / projects.value.length) * 100).toFixed(0)}%)
- **风险项目**：${projects.value.filter(p => p.risk === '高').length}个 (${((projects.value.filter(p => p.risk === '高').length / projects.value.length) * 100).toFixed(0)}%)

---

## 💰 成本分析

- **总预算**：${formatCurrency(totalBudget)}
- **已支出**：${formatCurrency(totalSpent)} (${((totalSpent / totalBudget) * 100).toFixed(1)}%)
- **预计总支出**：${formatCurrency(totalSpent * 1.15)}
- **预计节余**：${formatCurrency(totalBudget - totalSpent * 1.15)} (${(((totalBudget - totalSpent * 1.15) / totalBudget) * 100).toFixed(1)}%)

---

## 🔍 问题复盘

### 问题1：部分项目进度偏慢
- **根本原因**：人员配置不足，技术难点突破慢
- **影响程度**：可能导致下游项目延期
- **经验教训**：需要提前识别技术风险
- **改进措施**：建立技术预研机制

---

## 📅 下月展望

- 预计启动项目：4个
- 预计完成项目：${projects.value.filter(p => p.progress >= 80).length}个
- 关键风险：需持续关注成本控制
`

  return report
}

const generateExecutiveReport = () => {
  const now = new Date()
  const quarter = Math.ceil((now.getMonth() + 1) / 3)
  
  const totalBudget = projects.value.reduce((sum, p) => sum + p.budget, 0)
  const totalSpent = projects.value.reduce((sum, p) => sum + p.spent, 0)
  const avgProgress = projects.value.reduce((sum, p) => sum + p.progress, 0) / projects.value.length
  
  const report = `# 📊 项目组合管理季度汇报

**汇报对象**：CEO / 管理层  
**汇报周期**：${now.getFullYear()} Q${quarter}  
**汇报人**：项目管理办公室

---

## 🎯 核心数据一览

| 维度 | Q${quarter}目标 | Q${quarter}实际 | 达成率 |
|------|--------|--------|--------|
| 项目交付数量 | 12 | ${projects.value.filter(p => p.progress >= 100).length} | ${(projects.value.filter(p => p.progress >= 100).length / 12 * 100).toFixed(0)}% |
| 客户满意度 | 90% | 92% | ✅ |
| 预算控制 | ±5% | ${(((totalSpent / totalBudget) - 1) * 100).toFixed(0)}% | ✅ |
| 资源利用率 | 80% | ${avgProgress.toFixed(0)}% | ✅ |

---

## 💡 关键洞察

1. **技术债务累积**：${projects.value.filter(p => p.risk === '高').length}个项目存在技术债，建议Q${quarter + 1}投入20%时间重构
2. **人才缺口**：前端开发需求增长30%，现有team无法满足
3. **流程优化空间**：需求变更平均耗时3天，建议引入敏捷流程

---

## 🚀 Q${quarter + 1}战略建议

1. **优先级排序**：聚焦高ROI项目（建议优化2个低价值项目）
2. **资源补充**：招聘3名高级开发，外包2个非核心模块
3. **流程改进**：引入敏捷看板，缩短决策周期50%

---

**AI分析置信度**：92%  
**建议执行优先级**：🔴 高
`

  return report
}

// ========== 报告生成主函数 ==========
const generateReport = async (type) => {
  generating.value = true
  currentType.value = type
  
  try {
    // 模拟AI生成延迟
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    let content = ''
    let title = ''
    
    switch (type) {
      case 'weekly':
        content = generateWeeklyReport()
        title = '项目周报'
        break
      case 'monthly':
        content = generateMonthlyReport()
        title = '项目月报'
        break
      case 'executive':
        content = generateExecutiveReport()
        title = '高层汇报'
        break
    }
    
    const report = {
      id: Date.now(),
      type,
      title,
      content,
      generatedAt: formatDateTime(new Date()),
      projectCount: projects.value.length
    }
    
    currentReport.value = report
    reportHistory.value.unshift(report)
    
    // 保存到localStorage
    localStorage.setItem(
      `report_${report.id}`,
      JSON.stringify(report)
    )
    
    ElMessage.success(`${title}生成成功!`)
  } catch (error) {
    ElMessage.error('报告生成失败')
  } finally {
    generating.value = false
    currentType.value = ''
  }
}

// ========== 工具函数 ==========
const formatDateTime = (date) => {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = (value) => {
  return (value / 10000).toFixed(1) + '万'
}

const getReportTypeName = (type) => {
  const names = {
    weekly: '周报',
    monthly: '月报',
    executive: '高层汇报'
  }
  return names[type] || type
}

const getReportTypeTag = (type) => {
  const tags = {
    weekly: 'primary',
    monthly: 'success',
    executive: 'warning'
  }
  return tags[type] || 'info'
}

const viewReport = (report) => {
  currentReport.value = report
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const downloadReport = (report) => {
  const blob = new Blob([report.content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${report.title}_${report.generatedAt}.md`
  a.click()
  URL.revokeObjectURL(url)
  ElMessage.success('报告已下载')
}

const exportReport = () => {
  if (currentReport.value) {
    downloadReport(currentReport.value)
  }
}

// ========== Markdown渲染 ==========
const renderedMarkdown = computed(() => {
  if (!currentReport.value) return ''
  return marked(currentReport.value.content)
})
</script>

<style scoped lang="scss">
.intelligent-report-generator {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;

  .header-card,
  .report-preview,
  .history-card {
    margin-bottom: 20px;
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;

    .el-icon {
      font-size: 20px;
      color: #409eff;
    }
  }

  .report-content {
    padding: 20px;
    background: white;
    border-radius: 8px;
    line-height: 1.8;
    
    :deep(h1) {
      font-size: 28px;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e4e7ed;
    }

    :deep(h2) {
      font-size: 22px;
      margin: 24px 0 16px;
      color: #303133;
    }

    :deep(h3) {
      font-size: 18px;
      margin: 20px 0 12px;
      color: #606266;
    }

    :deep(table) {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      
      th, td {
        border: 1px solid #dcdfe6;
        padding: 12px;
        text-align: left;
      }
      
      th {
        background: #f5f7fa;
        font-weight: 600;
      }
    }

    :deep(ul), :deep(ol) {
      padding-left: 24px;
      margin: 12px 0;
    }

    :deep(li) {
      margin: 8px 0;
    }

    :deep(strong) {
      color: #303133;
      font-weight: 600;
    }

    :deep(hr) {
      border: none;
      border-top: 1px solid #e4e7ed;
      margin: 24px 0;
    }
  }
}
</style>
