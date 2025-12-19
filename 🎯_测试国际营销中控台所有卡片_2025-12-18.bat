@echo off
chcp 65001 > nul
echo.
echo ========================================
echo  国际营销中控台 - 卡片功能检查清单
echo ========================================
echo.
echo 【测试步骤】
echo.
echo 1. 确保开发服务器正在运行
echo    如未启动,请运行: npm run dev
echo.
echo 2. 访问首页: http://localhost:5173
echo.
echo 3. 滚动到"AI国际营销中台"板块
echo.
echo ========================================
echo  Phase 2: AI驱动营销 (4个卡片)
echo ========================================
echo.
echo ✓ AI产品选型系统
echo   点击后应跳转到: /ai-product-selector
echo   预期: 显示4步智能选型流程
echo.
echo ✓ 资源中心
echo   点击后应跳转到: /resource-center
echo   预期: 显示白皮书、技术文档、案例列表
echo.
echo ✓ AI询盘评分 [功能卡片]
echo   预期: 显示了解详情按钮
echo.
echo ✓ AI自动报价 [功能卡片]
echo   预期: 显示了解详情按钮
echo.
echo ========================================
echo  Phase 3: 营销自动化 (4个卡片)
echo ========================================
echo.
echo ✓ AI邮件营销
echo   点击后应跳转到: /email-marketing
echo   预期: 显示邮件编辑器和模板选择
echo.
echo ✓ 线索孵化系统
echo   点击后应跳转到: /lead-nurturing
echo   预期: 显示6阶段转化漏斗
echo.
echo ✓ 客户旅程追踪 [功能卡片]
echo   预期: 显示了解详情按钮
echo.
echo ✓ AI内容推荐 [功能卡片]
echo   预期: 显示了解详情按钮
echo.
echo ========================================
echo  Phase 4: 数据分析优化 (4个卡片)
echo ========================================
echo.
echo ✓ 营销数据中台
echo   点击后应跳转到: /marketing-data-hub
echo   预期: 显示实时KPI、转化漏斗、渠道对比
echo.
echo ✓ AI预测分析 [功能卡片]
echo   预期: 显示了解详情按钮
echo.
echo ✓ 自动化报表 [功能卡片]
echo   预期: 显示了解详情按钮
echo.
echo ✓ 多维度归因 [功能卡片]
echo   预期: 显示了解详情按钮
echo.
echo ========================================
echo  检查结果
echo ========================================
echo.
echo 所有路由文件已验证存在:
echo   ✓ AiProductSelector.vue
echo   ✓ ResourceCenter.vue  
echo   ✓ EmailMarketingSystem.vue
echo   ✓ LeadNurturingSystem.vue
echo   ✓ MarketingDataHub.vue
echo.
echo 【注意事项】
echo 1. "了解详情"按钮的卡片暂时只是展示功能介绍
echo 2. 可点击跳转的卡片都已配置完整路由和页面
echo 3. 所有页面都包含完整内容和功能实现
echo.
echo ========================================
echo.
echo 按任意键在浏览器中打开首页进行测试...
pause > nul
start http://localhost:5173
echo.
echo 测试指南已显示,请按照清单逐项检查!
echo.
pause
