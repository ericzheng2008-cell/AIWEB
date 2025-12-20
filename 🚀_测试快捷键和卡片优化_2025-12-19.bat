@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   测试设备页面4个区域布局优化
echo ========================================
echo.
echo 📋 测试清单：
echo.
echo 1️⃣ 六层垂直决策架构
echo    ✅ 检查是否为2×3网格布局
echo    ✅ 检查是否一屏显示全部6层
echo    ✅ 检查hover放大效果
echo.
echo 2️⃣ 5大确定性降本增效抓手
echo    ✅ 检查是否单行显示5个
echo    ✅ 检查卡片尺寸是否紧凑
echo    ✅ 检查hover效果
echo.
echo 3️⃣ 智能决策模块矩阵
echo    ✅ 检查是否3列网格布局
echo    ✅ 检查滚动是否流畅
echo    ✅ 检查卡片内容是否清晰
echo.
echo 4️⃣ 客户最痛的5个问题 - AI智能决策
echo    ✅ 检查卡片是否紧凑
echo    ✅ 检查滚动量是否减少
echo    ✅ 检查AI回答是否清晰
echo.
echo ========================================
echo.
echo 🚀 正在打开浏览器...
echo.
echo 访问地址: http://localhost:5173/equipment-lifecycle
echo.
echo ⚠️ 注意：
echo   1. 请确保前端服务器已启动 (npm run dev)
echo   2. 建议使用全屏浏览器测试
echo   3. 推荐分辨率: 1920×1080或更高
echo.
echo ========================================
echo.

start http://localhost:5173/equipment-lifecycle

echo.
echo ✅ 浏览器已打开！
echo.
echo 💡 测试提示：
echo   - 滚动查看4个区域的优化效果
echo   - Hover卡片测试交互效果
echo   - 对比优化前后的视觉体验
echo.
pause
