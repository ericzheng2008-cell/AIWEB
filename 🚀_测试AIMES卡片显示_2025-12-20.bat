@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🚀 测试AIMES智能体卡片显示
echo ========================================
echo.
echo 📋 问题：AIMES卡片看不见
echo 🔧 修复：调整布局 + 添加调试信息
echo.
echo ----------------------------------------
echo.
echo 🎯 测试步骤：
echo.
echo 【步骤1】访问AICRM页面
echo   → http://localhost:3002/#/mingsheng-aicrm-v3
echo.
echo 【步骤2】点击左侧菜单
echo   → 点击"AI智能体"
echo.
echo 【步骤3】验证卡片显示
echo   ✓ 第1行：赢率预测、客户意向、行动推荐
echo   ✓ 第2行：AIMES智能制造助手（紫色）
echo.
echo 【步骤4】检查调试信息
echo   ✓ 页面底部显示：共加载 4 个AI智能体
echo.
echo ----------------------------------------
echo.
echo 💡 验证要点：
echo   1. 卡片总数 = 4个
echo   2. AIMES卡片可见
echo   3. 每行3个卡片（不是4个）
echo   4. 调试信息显示正确
echo.
echo ----------------------------------------
echo.
echo 🔧 如果仍看不到：
echo   1. 强制刷新：Ctrl + Shift + R
echo   2. 清除缓存：F12 → Network → Disable cache
echo   3. 使用诊断工具：🔍_诊断AIMES智能体卡片_2025-12-20.html
echo.
echo ----------------------------------------
echo.
echo 🌐 正在打开测试页面...
timeout /t 2 >nul
start http://localhost:3002/#/mingsheng-aicrm-v3
echo.
echo ✅ 浏览器已打开！
echo.
echo 📊 预期结果：
echo   第1行: [赢率预测] [客户意向] [行动推荐]
echo   第2行: [AIMES智能制造助手]
echo   提示: ✅ 共加载 4 个AI智能体
echo.
pause
