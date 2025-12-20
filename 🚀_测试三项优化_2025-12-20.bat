@echo off
chcp 65001 >nul
echo.
echo ============================================
echo   🚀 测试三项优化效果
echo ============================================
echo.
echo 📋 优化内容：
echo.
echo 1️⃣ AIMES改名
echo    - AIMES智能制造 → AIMES助手
echo    - 4个位置全部修改
echo.
echo 2️⃣ 明星产品卡片缩小30%%
echo    - 媒体高度: 400px → 280px
echo    - 标题字号: 24px → 17px
echo    - 内边距: 32px → 22px
echo.
echo 3️⃣ 产品服务卡片缩小30%%
echo    - 图片高度: 240px → 168px
echo    - 标题字号: 22px → 15px
echo    - 内边距: 28px → 20px
echo.
echo ========================================
echo.
echo 🌐 正在打开浏览器...
echo.

timeout /t 2 >nul
start http://localhost:3002

echo.
echo ✅ 浏览器已打开！
echo.
echo 📝 验证步骤：
echo.
echo 【1. 检查AIMES改名】
echo   - 首页智能体板块 → "AIMES助手"
echo   - 点击进入AICRM V3 → 导航栏显示"AIMES助手"
echo   - AI智能体标签 → 第4个卡片名称
echo.
echo 【2. 检查明星产品卡片】
echo   - 向下滚动到"明星产品"板块
echo   - 对比卡片高度是否明显减小
echo   - 查看文字大小是否更紧凑
echo.
echo 【3. 检查产品服务卡片】
echo   - 向下滚动到"我们的产品和服务"板块
echo   - 对比卡片尺寸是否减小
echo   - 查看整体布局是否更紧凑
echo.
echo 🎨 预期效果：
echo   ✓ AIMES名称统一为"助手"
echo   ✓ 明星产品卡片高度减小约30%%
echo   ✓ 产品服务卡片更紧凑
echo   ✓ 页面信息密度提升
echo.
pause
