@echo off
chcp 65001 >nul
echo.
echo ========================================
echo   测试AI营销中台与明升智能体并排布局
echo ========================================
echo.
echo 正在启动开发服务器...
echo.
cd /d "%~dp0"
start cmd /k "npm run dev"
echo.
echo 等待服务器启动（5秒）...
timeout /t 5 /nobreak >nul
echo.
echo 正在打开浏览器...
start http://localhost:5173
echo.
echo ========================================
echo   测试重点
echo ========================================
echo.
echo 1. 滚动到"核心智能体平台"板块
echo 2. 验证左右两个卡片并排显示
echo 3. 测试卡片悬停效果（上浮+阴影）
echo 4. 点击"查看全部智能体"按钮
echo 5. 点击"立即体验营销中台"按钮
echo.
echo ========================================
echo.
pause
