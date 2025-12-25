@echo off
chcp 65001 >nul
echo ========================================
echo 🚀 后端服务器启动中...
echo ========================================
echo.

cd /d "%~dp0"

:: 检查5000端口是否被占用
echo ⏳ 检查5000端口状态...
netstat -ano | findstr :5000 | findstr LISTENING >nul
if %errorlevel%==0 (
    echo ⚠️  5000端口已被占用，正在清理...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
        taskkill /F /PID %%a >nul 2>&1
    )
    timeout /t 2 /nobreak >nul
)

echo ✅ 端口已清理
echo.

:: 启动后端服务器
echo 🚀 正在启动后端服务器（5000端口）...
start "AIWEB后端服务器" cmd /k "cd /d %~dp0 && npm run server"

:: 等待服务器启动
echo ⏳ 等待后端服务器启动（约5秒）...
timeout /t 6 /nobreak >nul

:: 验证后端是否启动成功
echo.
echo ========================================
echo 🔍 验证服务器状态...
echo ========================================
echo.

netstat -ano | findstr :5000 | findstr LISTENING >nul
if %errorlevel%==0 (
    echo ✅ 后端服务器启动成功！（端口:5000）
) else (
    echo ❌ 后端服务器启动失败！请检查错误信息
    pause
    exit /b 1
)

:: 检查前端是否运行
netstat -ano | findstr :5173 | findstr LISTENING >nul
if %errorlevel%==0 (
    echo ✅ 前端服务器正在运行（端口:5173）
) else (
    echo ⚠️  前端服务器未运行，正在启动...
    start "AIWEB前端服务器" cmd /k "cd /d %~dp0 && npm run dev"
    timeout /t 5 /nobreak >nul
)

echo.
echo ========================================
echo 🎉 系统已完全启动！
echo ========================================
echo.
echo 📊 服务器状态：
echo    - 后端服务器: http://localhost:5000 ✅
echo    - 前端服务器: http://localhost:5173 ✅
echo.
echo 🌐 访问地址：
echo    - 电脑访问: http://localhost:5173
echo    - 局域网访问: http://你的IP:5173
echo.
echo 💡 下一步操作：
echo    1. 电脑浏览器访问: http://localhost:5173
echo    2. 检查后台数据是否正常显示
echo    3. 手机访问验证（需先配置cpolar）
echo.
echo ⚠️  注意：不要关闭此窗口和后端服务器窗口！
echo.
pause

:: 打开浏览器测试
echo.
echo 🌐 正在打开浏览器测试...
start http://localhost:5173
