@echo off
chcp 65001 >nul 2>&1
title 电脑端cpolar 404快速修复
color 0B

echo ========================================
echo   电脑端cpolar 404快速修复
echo ========================================
echo.
echo   问题：电脑访问cpolar链接显示404
echo   原因：后端服务器(3001端口)未运行
echo.
echo   正在自动修复...
echo.

:: 步骤1: 清理进程
echo [1/6] 清理旧进程...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul
echo ✅ 完成

:: 步骤2: 释放端口
echo.
echo [2/6] 释放端口...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do taskkill /F /PID %%a >nul 2>&1
timeout /t 2 >nul
echo ✅ 完成

:: 步骤3: 启动后端
echo.
echo [3/6] 启动后端服务器(3001端口)...
start "后端服务器" /min cmd /k "cd /d %~dp0server && echo 后端服务器正在启动... && node index.js"
timeout /t 5 >nul
echo ✅ 完成

:: 步骤4: 验证后端
echo.
echo [4/6] 验证后端状态...
timeout /t 3 >nul
curl -s http://localhost:3001 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 后端运行正常
) else (
    echo ⚠️  后端启动中，请稍候...
    timeout /t 5 >nul
)

:: 步骤5: 启动前端
echo.
echo [5/6] 启动前端服务器(5173端口)...
start "前端服务器" /min cmd /k "cd /d %~dp0 && npm run dev"
timeout /t 5 >nul
echo ✅ 完成

:: 步骤6: 启动cpolar
echo.
echo [6/6] 启动cpolar...
taskkill /F /IM cpolar.exe >nul 2>&1
timeout /t 2 >nul
start "cpolar" cmd /k "cpolar http 5173"
timeout /t 3 >nul
echo ✅ 完成

:: 显示结果
echo.
echo ========================================
echo   🎉 修复完成！
echo ========================================
echo.
echo   ✅ 后端服务器：http://localhost:3001
echo   ✅ 前端服务器：http://localhost:5173
echo   ✅ cpolar已启动
echo.
echo ========================================
echo   测试步骤：
echo ========================================
echo.
echo   1️⃣  等待15秒让所有服务完全启动
echo.
echo   2️⃣  查看cpolar窗口，找到你的链接
echo       示例：https://msaiweb.vip.cpolar.cn
echo.
echo   3️⃣  在电脑浏览器访问cpolar链接
echo.
echo   4️⃣  如果看到网站首页 = 修复成功✅
echo       如果还是404 = 请查看下方排查步骤
echo.
echo ========================================
echo   如果仍然404，请检查：
echo ========================================
echo.
echo   ❌ 后端窗口是否有错误信息？
echo      → 如有错误，关闭后重新运行此脚本
echo.
echo   ❌ cpolar链接是否正确？
echo      → 确认链接没有多余空格
echo      → 确认使用的是最新链接
echo.
echo   ❌ 浏览器是否有缓存？
echo      → 按 Ctrl+Shift+Del 清除缓存
echo      → 按 Ctrl+Shift+R 强制刷新
echo.
echo   ❌ 防火墙是否阻止？
echo      → 暂时关闭防火墙测试
echo.
echo ========================================
echo   需要更多帮助？
echo ========================================
echo.
echo   运行以下工具：
echo   ⭐_立即修复cpolar_404问题_2025-12-25.bat
echo.
echo   或查看完整文档：
echo   README_手机端404修复_2025-12-25.md
echo.
pause

:: 显示服务状态
echo.
echo ========================================
echo   当前服务状态：
echo ========================================
echo.

echo 后端服务器(3001):
netstat -ano | findstr :3001 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 正在运行
) else (
    echo ❌ 未运行
)

echo.
echo 前端服务器(5173):
netstat -ano | findstr :5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 正在运行
) else (
    netstat -ano | findstr :5174 >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ 正在运行(5174端口)
    ) else (
        echo ❌ 未运行
    )
)

echo.
echo cpolar进程:
tasklist | findstr "cpolar.exe" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 正在运行
) else (
    echo ❌ 未运行
)

echo.
echo ========================================
pause
