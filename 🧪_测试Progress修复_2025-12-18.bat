@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   测试 ElProgress 完整修复 (V2)
echo ========================================
echo.
echo 📋 测试步骤：
echo.
echo 1. 打开浏览器访问 AICRM 系统
echo    http://localhost:3003
echo.
echo 2. 点击左侧菜单 "销售目标" 或 "销售目标管理"
echo.
echo 3. 确认在 "总览" 模式
echo.
echo 4. 查看 "团队目标完成排名" 表格
echo.
echo 5. 检查 "销售额" 列的进度条
echo    ✅ 应该显示蓝色/黄色/红色进度条
echo    ✅ 每个成员都有对应的进度条
echo    ✅ 进度条应该在 0-100%% 范围内
echo.
echo 6. 打开浏览器控制台 (F12)
echo    ✅ 不应该看到任何 percentage 相关的错误
echo    ✅ 不应该看到 "Expected Number, got String"
echo    ✅ 不应该看到 "custom validator check failed"
echo    ✅ 控制台应该完全干净！
echo.
echo ========================================
echo   边界测试案例
echo ========================================
echo.
echo 当前数据包含以下测试场景：
echo.
echo 👤 张三: 120万/100万 = 120%% → 应显示 100%%
echo 👤 李四: 95万/100万 = 95%% → 应显示 95%%
echo 👤 王五: 85万/100万 = 85%% → 应显示 85%%
echo 👤 赵六: 75万/100万 = 75%% → 应显示 75%%
echo 👤 钱七: 65万/100万 = 65%% → 应显示 65%%
echo.
echo ========================================
echo.
echo 按任意键打开浏览器测试...
pause >nul
start http://localhost:3003
echo.
echo 测试完成后，请检查：
echo 1. 所有进度条正常显示
echo 2. 张三的进度条应该是满的（100%%，不是120%%）
echo 3. 控制台完全没有错误和警告
echo.
pause
