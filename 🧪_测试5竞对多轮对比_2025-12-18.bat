@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   🧪 测试投标预测AI - 5竞对多轮对比
echo ========================================
echo.
echo 📝 测试步骤:
echo.
echo 1. 访问首页
echo    http://localhost:5173
echo.
echo 2. 进入投标预测AI
echo    首页 → 国际营销中控台 → 投标预测AI
echo.
echo 3. 选择项目
echo    点击左侧"某汽车厂拧紧工具采购项目"
echo.
echo 4. 查看5个竞对
echo    ✅ 应该看到5个竞对的报价趋势
echo.
echo 5. 查看多轮对比图表
echo    📊 应该看到新的"5个竞对多轮报价对比"图表
echo    - 6行数据 (我方 + 5个竞对)
echo    - 3列报价 (第一轮、第二轮、第三轮)
echo    - 趋势分析 (降价百分比)
echo    - 渐变色彩条形图
echo.
echo 6. 测试交互效果
echo    - 鼠标悬停在条形图上
echo    - 应该有放大和阴影效果
echo.
echo 7. 测试其他项目
echo    点击"某电子厂装配工具项目"
echo    ✅ 同样应该有5个竞对
echo.
echo ========================================
echo.
echo 🚀 正在启动开发服务器...
echo.

cd /d "%~dp0"
start http://localhost:5173
npm run dev

pause
