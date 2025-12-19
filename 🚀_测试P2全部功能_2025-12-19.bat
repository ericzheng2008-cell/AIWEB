@echo off
chcp 65001 >nul
echo.
echo ╔════════════════════════════════════════╗
echo ║   🚀 P2全部功能完整测试指南            ║
echo ╚════════════════════════════════════════╝
echo.
echo 📊 P2开发进度: 71.4%% (5/7项已完成)
echo.
echo ✅ 已完成功能:
echo    P2-1: 项目快照引擎
echo    P2-2: 时序数据仓库
echo    P2-3: 核心指标计算(OEE/SPI/CPI)
echo    P2-4: AI延误预测模型
echo    P2-5: What-If场景模拟器
echo.
echo ⏳ 待开发功能:
echo    P2-6: 成功模式学习引擎
echo    P2-7: AI助手对话集成
echo.
echo ========================================
echo    完整测试流程
echo ========================================
echo.
echo 🔹 步骤1: 启动服务器
echo    cd c:/Users/EricZ/CodeBuddy/AIWEB1
echo    npm run dev
echo.
echo 🔹 步骤2: 访问AIPM
echo    http://localhost:3002/#/aicrm
echo    → 点击 "AIPM项目管理" 标签
echo.
echo 🔹 步骤3: 生成项目快照
echo    → 点击 "刷新" 按钮
echo    → 查看提示: "数据已刷新，生成X个项目快照"
echo.
echo 🔹 步骤4: F12打开控制台
echo.
echo ========================================
echo    测试命令集合 (复制到控制台)
echo ========================================
echo.
echo // ===== 测试1: 查看项目快照 =====
echo console.log('📸 项目快照总数:', projectSnapshots.value.length)
echo console.table(projectSnapshots.value[0])
echo.
echo // ===== 测试2: 查看时序数据库 =====
echo console.log('📅 每日快照:', timeSeriesDB.value.daily.length + '条')
echo console.log('📅 每周汇总:', timeSeriesDB.value.weekly.length + '条')
echo console.table(timeSeriesDB.value.weekly)
echo.
echo // ===== 测试3: 计算项目指标 =====
echo const metrics = calculateProjectMetrics(aipmProjects.value[0])
echo console.log('📊 项目指标:')
echo console.log('  OEE综合效率:', metrics.oee + '%%')
echo console.log('  SPI进度绩效:', metrics.spi)
echo console.log('  CPI成本绩效:', metrics.cpi)
echo console.log('  进度健康:', metrics.scheduleHealth)
echo console.log('  成本健康:', metrics.costHealth)
echo console.log('  综合健康:', metrics.overallHealth)
echo.
echo // ===== 测试4: AI延误预测 =====
echo const project = aipmProjects.value[0]
echo const prediction = predictProjectDelay(project)
echo console.log('🤖 AI延误预测:')
echo console.log('  延误概率:', (prediction.delayProbability * 100).toFixed(0) + '%%')
echo console.log('  预测延误:', prediction.predictedDelayDays + '天')
echo console.log('  预测完成:', prediction.predictedEndDate)
echo console.log('  置信度:', (prediction.confidence * 100).toFixed(0) + '%%')
echo console.log('  风险等级:', prediction.riskLevel)
echo console.log('  关键因素:', prediction.criticalFactors)
echo console.log('  AI建议:', prediction.recommendations)
echo.
echo // ===== 测试5: 场景模拟 =====
echo const sim1 = simulateScenario(project, 'ADD_TEAM_MEMBER', {count: 2})
echo const sim2 = simulateScenario(project, 'REMOVE_NON_CRITICAL')
echo const sim3 = simulateScenario(project, 'EXTEND_DEADLINE', {days: 7})
echo const sim4 = simulateScenario(project, 'INCREASE_BUDGET', {amount: 50})
echo.
echo console.log('🎮 场景模拟对比:')
echo console.log('场景1-增加2人:', sim1.impact.recommendation)
echo console.log('场景2-精简任务:', sim2.impact.recommendation)
echo console.log('场景3-延期7天:', sim3.impact.recommendation)
echo console.log('场景4-加预算50万:', sim4.impact.recommendation)
echo.
echo // ===== 测试6: 批量分析所有项目 =====
echo console.log('📋 所有项目风险评估:')
echo aipmProjects.value.forEach(p =^> {
echo   const pred = predictProjectDelay(p)
echo   const status = pred.riskLevel === '高' ? '🔴' : pred.riskLevel === '中' ? '🟡' : '🟢'
echo   console.log(`${status} ${p.name}: ${pred.riskLevel}风险, 延误概率${(pred.delayProbability*100).toFixed(0)}%%`)
echo })
echo.
echo ========================================
echo    期望验收标准
echo ========================================
echo.
echo ✅ 快照引擎:
echo    - 每个项目生成1个快照
echo    - 快照包含8大维度数据
echo    - 数据完整无缺失
echo.
echo ✅ 时序数据库:
echo    - 每日快照最多30条
echo    - 每周汇总自动计算
echo    - 数据结构正确
echo.
echo ✅ 指标计算:
echo    - OEE分数(0-100)
echo    - SPI/CPI精确到3位小数
echo    - 健康度分级正确
echo.
echo ✅ 延误预测:
echo    - 延误概率(0-1)
echo    - 关键因素3-5条
echo    - AI建议1-3条
echo    - 置信度≥75%%
echo.
echo ✅ 场景模拟:
echo    - 4种场景全支持
echo    - 可行性评分(0-100)
echo    - impact包含具体数据
echo    - recommendation明确清晰
echo.
echo ========================================
echo 按任意键打开浏览器并查看完整测试说明...
echo ========================================
pause >nul

start http://localhost:3002/#/aicrm
start notepad "🎊_P2-Week1-5完成_71%%进度超前42%%_2025-12-19.md"
