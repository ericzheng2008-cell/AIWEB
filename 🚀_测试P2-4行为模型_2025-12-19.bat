@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    🚀 P2-4 AI延误预测模型测试
echo ========================================
echo.
echo 测试功能:
echo   ✅ 7大特征提取
echo   ✅ 5条预测规则
echo   ✅ 延误天数计算
echo   ✅ AI智能建议
echo.
echo ----------------------------------------
echo 控制台测试命令:
echo ----------------------------------------
echo.
echo 1️⃣  打开浏览器控制台(F12)
echo.
echo 2️⃣  选择一个项目进行预测:
echo.
echo     const project = aipmProjects.value[0]
echo     const prediction = predictProjectDelay(project)
echo     console.log('===== AI延误预测结果 =====')
echo     console.log('延误概率:', prediction.delayProbability)
echo     console.log('预测延误天数:', prediction.predictedDelayDays)
echo     console.log('预测完成日期:', prediction.predictedEndDate)
echo     console.log('置信度:', prediction.confidence)
echo     console.log('风险等级:', prediction.riskLevel)
echo     console.log('关键因素:', prediction.criticalFactors)
echo     console.log('AI建议:', prediction.recommendations)
echo.
echo 3️⃣  批量预测所有项目:
echo.
echo     aipmProjects.value.forEach(p =^> {
echo       const pred = predictProjectDelay(p)
echo       console.log(`${p.name}: ${pred.riskLevel}风险, 延误概率${pred.delayProbability*100}%%`)
echo     })
echo.
echo 4️⃣  查看预测特征:
echo.
echo     console.table(prediction.metrics)
echo.
echo ========================================
echo   期望输出示例:
echo ========================================
echo.
echo {
echo   delayProbability: 0.75,        // 75%%延误概率
echo   predictedDelayDays: 12,        // 预计延误12天
echo   predictedEndDate: "2026-02-02",
echo   confidence: 0.85,               // 85%%置信度
echo   riskLevel: "高",
echo   criticalFactors: [
echo     "进度绩效指数偏低",
echo     "实际进度严重落后计划"
echo   ],
echo   recommendations: [
echo     "建议增加2-3名团队成员",
echo     "考虑精简非关键任务"
echo   ]
echo }
echo.
echo ========================================
echo 按任意键打开浏览器...
echo ========================================
pause >nul

start http://localhost:3002/#/aicrm
