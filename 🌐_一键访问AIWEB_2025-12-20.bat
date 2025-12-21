@echo off
chcp 65001 >nul
color 0B
echo.
echo ========================================
echo    🌐 AIWEB一键访问工具
echo ========================================
echo.
echo 正在检查服务器状态...
echo.

:: 检查5173端口
netstat -ano | findstr ":5173" >nul
if %errorlevel% equ 0 (
    echo ✅ 前端服务器正在运行
    echo.
    echo 🌐 访问地址：
    echo    http://localhost:5173
    echo.
    echo 正在打开浏览器...
    timeout /t 2 /nobreak >nul
    start http://localhost:5173
    echo.
    echo ========================================
    echo    ✅ 浏览器已打开！
    echo ========================================
    echo.
    pause
    exit
)

echo ⚠️ 前端服务器未运行
echo.
echo 是否立即启动服务器？
echo.
choice /C YN /M "按Y启动，按N取消"

if errorlevel 2 (
    echo.
    echo 已取消操作
    echo.
    echo 💡 提示：手动启动命令
    echo    cd c:\Users\EricZ\CodeBuddy\AIWEB1
    echo    npm run dev
    echo.
    pause
    exit
)

echo.
echo ========================================
echo    正在启动前端服务器...
echo ========================================
echo.
echo 请稍候，服务器启动需要10-15秒...
echo.

:: 启动前端服务器
start "AIWEB前端服务器" cmd /k "cd c:\Users\EricZ\CodeBuddy\AIWEB1 && npm run dev"

echo 等待服务器启动...
timeout /t 15 /nobreak >nul

echo.
echo 正在打开浏览器...
start http://localhost:5173

echo.
echo ========================================
echo    ✅ 完成！
echo ========================================
echo.
echo 🌐 访问地址：
echo    http://localhost:5173
echo.
echo 📱 主要功能模块：
echo    • 首页：http://localhost:5173/
echo    • 智能体：http://localhost:5173/#/agents
echo    • AICRM：http://localhost:5173/#/mingsheng-aicrm-v3
echo    • AIMES：http://localhost:5173/#/aimes
echo    • AI营销：http://localhost:5173/#/ai-marketing
echo    • 后台：http://localhost:5173/#/admin
echo.
echo 💡 提示：
echo    • 服务器窗口不要关闭
echo    • 按Ctrl+C可停止服务器
echo.
pause
