@echo off
chcp 65001 >nul
title 修复502错误 - 完整重启所有服务
color 0E

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║            🔧 修复502错误 - 完整重启                    ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.

:: 步骤1：杀死所有进程
echo [1/5] 🛑 停止所有服务...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM cpolar.exe >nul 2>&1
timeout /t 3 >nul
echo ✅ 所有进程已停止
echo.

:: 步骤2：清理端口
echo [2/5] 🧹 清理端口占用...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3002" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5000" ^| findstr "LISTENING"') do taskkill /F /PID %%a >nul 2>&1
timeout /t 2 >nul
echo ✅ 端口清理完成
echo.

:: 步骤3：启动后端服务
echo [3/5] 🔧 启动后端服务（端口5000）...
cd /d "%~dp0server"
start /min "AIWEB-后端" cmd /k "title AIWEB后端服务(5000) && color 0A && echo. && echo ═══════════════════════════════════════ && echo   AIWEB 后端服务 - 端口 5000 && echo ═══════════════════════════════════════ && echo. && echo [%date% %time%] 正在启动... && echo. && node index.js"
timeout /t 8 >nul
echo ✅ 后端已启动
echo.

:: 步骤4：启动前端服务
echo [4/5] 🎨 启动前端服务（端口3002）...
cd /d "%~dp0"
start /min "AIWEB-前端" cmd /k "title AIWEB前端服务(3002) && color 0B && echo. && echo ═══════════════════════════════════════ && echo   AIWEB 前端服务 - 端口 3002 && echo ═══════════════════════════════════════ && echo. && echo [%date% %time%] 正在启动... && echo. && npm run dev"
timeout /t 18 >nul
echo ✅ 前端已启动
echo.

:: 步骤5：验证服务状态
echo [5/5] 🔍 验证服务状态...
netstat -ano | findstr ":5000.*LISTENING" >nul
if %errorlevel% equ 0 (
    echo ✅ 后端服务运行正常（端口5000）
) else (
    echo ❌ 后端服务未启动！
)

netstat -ano | findstr ":3002.*LISTENING" >nul
if %errorlevel% equ 0 (
    echo ✅ 前端服务运行正常（端口3002）
) else (
    echo ❌ 前端服务未启动！
)
echo.

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║              ✅ 本地服务启动完成！                       ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
echo 📋 测试本地访问：
echo    前端：http://localhost:3002
echo    后端：http://localhost:5000/health
echo.
echo 🌐 下一步：
echo    1. 先测试本地是否正常（5秒后自动打开）
echo    2. 本地正常后再启动cpolar
echo    3. 使用下面的脚本一键启动cpolar
echo.
timeout /t 3 >nul

:: 打开本地测试
start http://localhost:3002
timeout /t 2 >nul
start http://localhost:5000/health

echo.
echo ╔═══════════════════════════════════════════════════════════╗
echo ║                                                           ║
echo ║          💡 如果本地正常，请运行：                       ║
echo ║                                                           ║
echo ║          🌐_一键生成cpolar链接_2025-12-21.bat            ║
echo ║                                                           ║
echo ║          ⚠️  注意：不要重复启动前后端！                  ║
echo ║                                                           ║
echo ╚═══════════════════════════════════════════════════════════╝
echo.
pause
