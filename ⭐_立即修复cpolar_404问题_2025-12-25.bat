@echo off
chcp 65001 >nul 2>&1
title cpolar 404问题一键修复工具
color 0E

:MENU
cls
echo ========================================
echo   cpolar 404 问题修复工具
echo ========================================
echo.
echo   当前问题：电脑端和手机端都显示404
echo   根本原因：后端服务器未运行
echo.
echo ========================================
echo   请选择修复方式：
echo ========================================
echo.
echo   [1] 一键完整启动（推荐）⭐
echo       → 自动启动后端
echo       → 自动启动前端
echo       → 自动启动cpolar
echo       → 10秒解决
echo.
echo   [2] 仅启动后端服务器
echo       → 适合前端已启动的情况
echo.
echo   [3] 诊断当前服务状态
echo       → 查看哪些服务在运行
echo       → 查看端口占用情况
echo.
echo   [4] 完全重启所有服务
echo       → 清理所有进程
echo       → 重新启动全部
echo.
echo   [5] 查看完整解决方案文档
echo.
echo   [0] 退出
echo.
echo ========================================
set /p choice="请输入选项 [0-5]: "

if "%choice%"=="1" goto COMPLETE_START
if "%choice%"=="2" goto START_BACKEND
if "%choice%"=="3" goto DIAGNOSE
if "%choice%"=="4" goto FULL_RESTART
if "%choice%"=="5" goto VIEW_DOC
if "%choice%"=="0" exit
goto MENU

:COMPLETE_START
cls
echo ========================================
echo   正在执行一键完整启动...
echo ========================================
echo.

echo [1/5] 清理旧进程...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
    taskkill /F /PID %%a >nul 2>&1
)
echo ✅ 清理完成

echo.
echo [2/5] 启动后端服务器...
start "后端服务器" cmd /k "cd /d %~dp0server && node index.js"
timeout /t 3 >nul
echo ✅ 后端启动完成

echo.
echo [3/5] 检查后端健康状态...
timeout /t 2 >nul
curl -s http://localhost:3001 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 后端响应正常
) else (
    echo ⚠️  后端可能需要更多时间启动
)

echo.
echo [4/5] 启动前端服务器...
start "前端服务器" cmd /k "cd /d %~dp0 && npm run dev"
timeout /t 3 >nul
echo ✅ 前端启动完成

echo.
echo [5/5] 启动cpolar内网穿透...
start "cpolar" cmd /k "cpolar http 5173"
timeout /t 2 >nul
echo ✅ cpolar启动完成

echo.
echo ========================================
echo   🎉 全部启动完成！
echo ========================================
echo.
echo   ✅ 后端服务器: http://localhost:3001
echo   ✅ 前端服务器: http://localhost:5173
echo   ✅ cpolar链接: 请查看cpolar窗口
echo.
echo   请等待10-15秒让所有服务完全启动
echo   然后刷新浏览器测试
echo.
pause
goto MENU

:START_BACKEND
cls
echo ========================================
echo   正在启动后端服务器...
echo ========================================
echo.

echo [1/3] 检查端口占用...
netstat -ano | findstr :3001 >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  端口3001已被占用，正在释放...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
        taskkill /F /PID %%a >nul 2>&1
    )
    timeout /t 2 >nul
    echo ✅ 端口已释放
) else (
    echo ✅ 端口3001可用
)

echo.
echo [2/3] 启动后端服务器...
start "后端服务器 - 端口3001" cmd /k "cd /d %~dp0server && node index.js"
timeout /t 3 >nul

echo.
echo [3/3] 验证服务器状态...
timeout /t 2 >nul
curl -s http://localhost:3001 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 后端服务器启动成功！
    echo.
    echo 现在可以测试cpolar链接了
) else (
    echo ⚠️  后端服务器可能需要更多时间启动
    echo     请查看后端窗口的输出信息
)

echo.
pause
goto MENU

:DIAGNOSE
cls
echo ========================================
echo   服务状态诊断报告
echo ========================================
echo.

echo [1/4] 检查后端服务器 (端口3001)...
netstat -ano | findstr :3001 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 后端服务器正在运行
    curl -s http://localhost:3001 >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ 后端API响应正常
    ) else (
        echo ⚠️  后端端口已占用但API无响应
    )
) else (
    echo ❌ 后端服务器未启动 （这是404的根本原因）
)

echo.
echo [2/4] 检查前端服务器 (端口5173)...
netstat -ano | findstr :5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 前端服务器正在运行
) else (
    netstat -ano | findstr :5174 >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ 前端服务器正在运行 (端口5174)
    ) else (
        echo ❌ 前端服务器未启动
    )
)

echo.
echo [3/4] 检查Node.js进程...
tasklist | findstr "node.exe" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 发现Node.js进程
    tasklist | findstr "node.exe"
) else (
    echo ❌ 未发现Node.js进程
)

echo.
echo [4/4] 检查cpolar进程...
tasklist | findstr "cpolar.exe" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ cpolar正在运行
) else (
    echo ⚠️  cpolar未运行
)

echo.
echo ========================================
echo   诊断结论
echo ========================================
echo.

netstat -ano | findstr :3001 >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 问题确认：后端服务器未启动
    echo.
    echo 解决方案：
    echo   1. 返回主菜单
    echo   2. 选择 [1] 一键完整启动
    echo   3. 等待10秒
    echo   4. 刷新浏览器测试
) else (
    echo ✅ 所有服务运行正常
    echo.
    echo 如果仍然404，请尝试：
    echo   1. 清空浏览器缓存 (Ctrl+Shift+Del)
    echo   2. 刷新页面 (Ctrl+Shift+R)
    echo   3. 检查cpolar链接是否正确
)

echo.
pause
goto MENU

:FULL_RESTART
cls
echo ========================================
echo   正在完全重启所有服务...
echo ========================================
echo.

echo [1/4] 关闭所有Node.js进程...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM cpolar.exe >nul 2>&1
timeout /t 2 >nul
echo ✅ 进程已清理

echo.
echo [2/4] 释放所有端口...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
    taskkill /F /PID %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5174') do (
    taskkill /F /PID %%a >nul 2>&1
)
timeout /t 2 >nul
echo ✅ 端口已释放

echo.
echo [3/4] 重新启动后端...
start "后端服务器" cmd /k "cd /d %~dp0server && node index.js"
timeout /t 5 >nul
echo ✅ 后端已启动

echo.
echo [4/4] 重新启动前端和cpolar...
start "前端服务器" cmd /k "cd /d %~dp0 && npm run dev"
timeout /t 3 >nul
start "cpolar" cmd /k "cpolar http 5173"
timeout /t 2 >nul
echo ✅ 全部启动完成

echo.
echo ========================================
echo   🎉 完全重启成功！
echo ========================================
echo.
echo   请等待15秒让服务完全启动
echo   然后刷新浏览器测试
echo.
pause
goto MENU

:VIEW_DOC
cls
echo ========================================
echo   正在打开完整解决方案文档...
echo ========================================
echo.

if exist "%~dp0README_手机端404修复_2025-12-25.md" (
    start "" "%~dp0README_手机端404修复_2025-12-25.md"
    echo ✅ 文档已打开
) else (
    echo ⚠️  未找到文档文件
)

echo.
pause
goto MENU
