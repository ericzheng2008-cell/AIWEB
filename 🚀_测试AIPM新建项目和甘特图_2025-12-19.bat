@echo off
chcp 65001 > nul
echo.
echo ========================================
echo   🚀 测试AIPM新建项目和甘特图
echo ========================================
echo.
echo 📋 完成功能：
echo    ✅ 新建项目对话框(完整表单)
echo    ✅ 动态WBS任务管理
echo    ✅ 真实甘特图可视化
echo    ✅ 三种视图模式(日/周/月)
echo    ✅ 项目健康度雷达图
echo.
echo 🎯 测试步骤：
echo.
echo 【功能1：新建项目】
echo    1. 访问 http://localhost:3002
echo    2. 进入AICRM页面
echo    3. 点击"AIPM项目管理"标签
echo    4. 点击右上角"新建项目"按钮
echo    5. 填写项目信息：
echo       - 项目名称：测试项目2025
echo       - 项目经理：张经理
echo       - 开始日期：2025-01-01
echo       - 结束日期：2025-06-30
echo       - 预算：500万元
echo       - 团队人数：8人
echo    6. 点击"添加任务"添加3-5个WBS任务
echo    7. 点击"确定创建"
echo    8. 确认项目出现在列表顶部
echo.
echo 【功能2：甘特图演示】
echo    1. 切换到"列表视图"(点击"3D视图"按钮)
echo    2. 观察项目甘特图：
echo       ✓ 查看所有项目的时间轴
echo       ✓ 不同颜色代表不同状态
echo       ✓ 进度条显示完成百分比
echo       ✓ 红色虚线标注今天
echo    3. 鼠标悬停在任务条上：
echo       ✓ 查看详细信息Tooltip
echo    4. 切换视图模式：
echo       ✓ 点击"日"按钮
echo       ✓ 点击"周"按钮
echo       ✓ 点击"月"按钮
echo       ✓ 观察时间轴变化
echo.
echo 【功能3：项目健康度】
echo    1. 向下滚动到"AI项目管家分析"卡片
echo    2. 查看"项目健康度分析"雷达图
echo    3. 观察多个维度评分：
echo       ✓ 进度达成
echo       ✓ 质量评分
echo       ✓ 成本控制
echo       ✓ 团队协作
echo       ✓ 风险管理
echo.
echo 🔍 验证要点：
echo    ✓ 新建项目对话框正常打开
echo    ✓ WBS任务可以添加和删除
echo    ✓ 表单验证提示正确
echo    ✓ 项目创建成功提示
echo    ✓ 甘特图自动刷新
echo    ✓ 甘特图时间轴准确
echo    ✓ 进度条显示正确
echo    ✓ 视图模式切换流畅
echo    ✓ Tooltip信息完整
echo    ✓ 健康度雷达图正常
echo.
echo ⚠️ 注意事项：
echo    1. 确保服务器正在运行
echo    2. 如浏览器已打开，请强制刷新(Ctrl+Shift+R)
echo    3. F12打开控制台，确认无错误
echo.
pause
echo.
echo 🌐 正在打开浏览器...
start http://localhost:3002/#/aicrm
echo.
echo ✅ 浏览器已打开到AICRM页面
echo.
echo 📖 详细说明文档：
echo    ✅_AIPM新建项目与甘特图功能完成_2025-12-19.md
echo.
echo 💡 高级测试：
echo    1. 创建多个项目，观察甘特图排列
echo    2. 设置不同的开始/结束日期，测试时间轴
echo    3. 修改视图模式，对比显示效果
echo    4. 展开项目列表，查看WBS任务树
echo.
pause
