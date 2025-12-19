@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    🚀 P2-5 What-If场景模拟器测试
echo ========================================
echo.
echo 支持的4种场景:
echo   1️⃣  ADD_TEAM_MEMBER     - 增加团队成员
echo   2️⃣  REMOVE_NON_CRITICAL - 精简非关键任务
echo   3️⃣  EXTEND_DEADLINE     - 延长交期
echo   4️⃣  INCREASE_BUDGET     - 增加预算
echo.
echo ----------------------------------------
echo 控制台测试命令:
echo ----------------------------------------
echo.
echo 📌 场景1: 增加2名团队成员
echo.
echo const project = aipmProjects.value[0]
echo const sim1 = simulateScenario(project, 'ADD_TEAM_MEMBER', {count: 2})
echo console.log('===== 场景1: 增加团队成员 =====')
echo console.log('提前天数:', sim1.impact.schedule)
echo console.log('成本增加:', sim1.impact.cost)
echo console.log('可行性:', sim1.feasibility.level)
echo console.log('建议:', sim1.impact.recommendation)
echo.
echo ----------------------------------------
echo.
echo 📌 场景2: 精简非关键任务
echo.
echo const sim2 = simulateScenario(project, 'REMOVE_NON_CRITICAL')
echo console.log('===== 场景2: 精简任务 =====')
echo console.log('提前天数:', sim2.impact.schedule)
echo console.log('减少任务:', sim2.impact.scope)
echo console.log('风险提示:', sim2.impact.risk)
echo.
echo ----------------------------------------
echo.
echo 📌 场景3: 延长交期7天
echo.
echo const sim3 = simulateScenario(project, 'EXTEND_DEADLINE', {days: 7})
echo console.log('===== 场景3: 延长交期 =====')
echo console.log('延后天数:', sim3.impact.schedule)
echo console.log('质量提升:', sim3.impact.quality)
echo console.log('成本:', sim3.impact.cost)
echo.
echo ----------------------------------------
echo.
echo 📌 场景4: 增加50万预算
echo.
echo const sim4 = simulateScenario(project, 'INCREASE_BUDGET', {amount: 50})
echo console.log('===== 场景4: 增加预算 =====')
echo console.log('提前天数:', sim4.impact.schedule)
echo console.log('ROI:', sim4.impact.roi)
echo console.log('建议:', sim4.impact.recommendation)
echo.
echo ----------------------------------------
echo.
echo 📌 批量对比所有场景:
echo.
echo const scenarios = [
echo   {type: 'ADD_TEAM_MEMBER', params: {count: 2}},
echo   {type: 'REMOVE_NON_CRITICAL', params: {}},
echo   {type: 'EXTEND_DEADLINE', params: {days: 7}},
echo   {type: 'INCREASE_BUDGET', params: {amount: 50}}
echo ]
echo.
echo scenarios.forEach(s =^> {
echo   const result = simulateScenario(project, s.type, s.params)
echo   console.log(`${result.scenario}:`, result.feasibility.score + '分', result.impact.recommendation)
echo })
echo.
echo ========================================
echo   期望结果:
echo ========================================
echo.
echo ✅ 每个场景返回:
echo    - baseline: 原始数据
echo    - simulated: 模拟后数据
echo    - changes: 变化对比
echo    - impact: 影响分析
echo    - feasibility: 可行性评分
echo.
echo ✅ 可行性评分(0-100分):
echo    - 高可行性: ≥70分
echo    - 中可行性: 40-70分
echo    - 低可行性: <40分
echo.
echo ========================================
echo 按任意键打开浏览器...
echo ========================================
pause >nul

start http://localhost:3002/#/aicrm
