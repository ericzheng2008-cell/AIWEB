@echo off
chcp 65001 >nul
color 0B
echo ========================================
echo    🚀 AIWEB完整启动流程
echo ========================================
echo.
echo 此脚本将依次启动：
echo   1. 后端服务器 (端口5000)
echo   2. 前端服务器 (端口5173)
echo   3. cpolar公网隧道
echo.
echo 请保持所有窗口运行！
echo.
pause

echo.
echo [步骤1/3] 启动后端服务器...
start "🔧AIWEB后端" cmd /k "cd /d %~dp0server && node index.js"
timeout /t 3 >nul

echo [步骤2/3] 启动前端服务器...
start "🎨AIWEB前端" cmd /k "cd /d %~dp0 && npx vite --port 5173 --host 0.0.0.0"
timeout /t 8 >nul

echo [步骤3/3] 启动公网隧道...
echo.
echo ⏳ 正在连接cpolar服务器...
echo.

:: 检查服务器是否启动
netstat -ano | findstr ":5173" >nul
if %errorlevel%==0 (
    echo ✅ 前端服务器已就绪
    echo.
    start "🌐公网隧道" cmd /k "cpolar http 5173"
    timeout /t 3 >nul
    
    echo.
    echo ========================================
    echo    ✅ 所有服务已启动！
    echo ========================================
    echo.
    echo 📱 访问方式：
    echo.
    echo   局域网: http://192.168.31.103:5173
    echo   公  网: 查看"🌐公网隧道"窗口
    echo.
    echo 💡 在"公网隧道"窗口找到：
    echo    Forwarding https://xxxx.vip.cpolar.cn
    echo    这就是您的公网访问地址！
    echo.
    echo ⚠️  注意：
    echo    - 请勿关闭任何命令窗口
    echo    - 免费版URL每次重启会变化
    echo    - 需要固定域名请升级cpolar VIP
    echo.
    echo ========================================
) else (
    echo ❌ 前端服务器启动失败！
    echo.
    echo 可能的原因：
    echo   1. 端口5173被占用
    echo   2. npm依赖未安装
    echo   3. node版本不兼容
    echo.
    echo 请检查"AIWEB前端"窗口的错误信息
    echo.
)

pause
