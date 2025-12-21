@echo off
chcp 65001 >nul
title AIWEB自动测试系统
color 0A

echo ========================================
echo 🚀 AIWEB自动启动与测试系统
echo ========================================
echo.

:: 第1步：检查Node.js
echo [1/6] 检查Node.js环境...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未检测到Node.js，请先安装Node.js
    pause
    exit /b 1
)
echo ✅ Node.js已安装

:: 第2步：检查项目依赖
echo.
echo [2/6] 检查项目依赖...
if not exist "node_modules" (
    echo ⚠️  依赖未安装，正在安装...
    call npm install
) else (
    echo ✅ 依赖已安装
)

:: 第3步：清理端口
echo.
echo [3/6] 清理5173端口...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do (
    taskkill /F /PID %%a >nul 2>&1
    echo ✅ 已清理端口占用
)

:: 第4步：启动服务器
echo.
echo [4/6] 启动开发服务器...
start "AIWEB开发服务器" cmd /k "npm run dev"
echo ⏳ 等待服务器启动（30秒）...
ping 127.0.0.1 -n 31 >nul

:: 第5步：测试网页
echo.
echo [5/6] 测试网页访问...
set TEST_COUNT=0
set MAX_TESTS=10

:TEST_LOOP
set /a TEST_COUNT+=1
echo 测试 %TEST_COUNT%/%MAX_TESTS%...

powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5173' -TimeoutSec 5 -UseBasicParsing; exit $response.StatusCode } catch { exit 0 }" 
set HTTP_CODE=%errorlevel%

if %HTTP_CODE%==200 (
    echo.
    echo ========================================
    echo ✅ 网页正常打开！HTTP 200
    echo ========================================
    goto OPEN_BROWSER
) else if %HTTP_CODE%==500 (
    echo ❌ 发现500错误！正在显示错误详情...
    goto SHOW_ERROR
) else (
    echo ⏳ 服务器还未就绪，等待5秒后重试...
    ping 127.0.0.1 -n 6 >nul
    if %TEST_COUNT% LSS %MAX_TESTS% goto TEST_LOOP
    echo ❌ 超过最大重试次数，请检查控制台错误
    goto END
)

:OPEN_BROWSER
echo.
echo [6/6] 打开浏览器...
start http://localhost:5173
echo.
echo ========================================
echo 🎉 系统启动成功！
echo ========================================
echo.
echo 💡 提示：
echo   - 前端地址: http://localhost:5173
echo   - 保持此窗口打开以维持服务器运行
echo   - 按Ctrl+C可停止服务器
echo.
goto MONITOR

:SHOW_ERROR
echo.
echo ========================================
echo ❌ 检测到500错误
echo ========================================
echo 请检查开发服务器窗口的错误信息
echo 常见问题：
echo   1. Vue模板语法错误
echo   2. i18n翻译键缺失
echo   3. 组件导入路径错误
echo.
pause
exit /b 1

:MONITOR
echo 开始监控网页状态（每30秒检测一次）...
echo 按Ctrl+C退出
echo.

:MONITOR_LOOP
ping 127.0.0.1 -n 31 >nul
powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://localhost:5173' -TimeoutSec 5 -UseBasicParsing; Write-Host \"[$(Get-Date -Format 'HH:mm:ss')] ✅ 网页正常 - HTTP $($response.StatusCode)\" } catch { Write-Host \"[$(Get-Date -Format 'HH:mm:ss')] ❌ 错误: $($_.Exception.Message)\" }"
goto MONITOR_LOOP

:END
echo.
pause
