@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🚀 AIWEB完整功能测试
echo ========================================
echo.
echo 正在启动浏览器，测试以下功能：
echo.
echo 1️⃣  客户沙盘分析（策略推荐+导出报告）
echo 2️⃣  响应式设计（全平台适配）
echo 3️⃣  AI聊天反馈（自我训练）
echo 4️⃣  AI学习管理中心（后台管理）
echo.
echo ========================================
echo.

:: 打开AICRM主页
start http://localhost:3002/#/ai-crm-v3

:: 等待3秒
timeout /t 3 /nobreak >nul

:: 打开AI学习中心
start http://localhost:3002/#/ai-learning-dashboard

echo.
echo ✅ 测试页面已打开！
echo.
echo 📋 测试步骤：
echo.
echo 【测试1：客户沙盘分析】
echo   1. 在第一个标签页，点击"客户沙盘"
echo   2. 选择任意客户
echo   3. 点击"策略推荐"（绿色按钮）
echo   4. 点击"导出报告"（橙色按钮）
echo.
echo 【测试2：响应式设计】
echo   1. 按F12打开开发者工具
echo   2. 按Ctrl+Shift+M切换设备模拟
echo   3. 测试不同设备：iPhone/iPad/Desktop
echo.
echo 【测试3：AI聊天反馈】
echo   1. 点击右下角AI聊天机器人
echo   2. 发送任意问题
echo   3. 在AI回答下方点击👍/👎评分
echo   4. （可选）输入文字反馈
echo   5. 点击"提交反馈"
echo.
echo 【测试4：AI学习中心】
echo   1. 在第二个标签页查看统计数据
echo   2. 查看反馈详情表格
echo   3. 测试筛选和搜索功能
echo   4. 查看趋势图表
echo   5. 点击"导出报告"下载CSV
echo.
echo ========================================
echo.
pause
